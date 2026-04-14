import { useState, useEffect } from "react";
import { getMyCertificates } from "../../../api/courseApi";
import { notify } from "../../../utils/toast";

import LoadingState      from "./components/certificate/LoadingState";
import ErrorState        from "./components/certificate/ErrorState";
import NoCertificateState from "./components/certificate/NoCertificateState";
import LockedState       from "./components/certificate/LockedState";
import PendingState      from "./components/certificate/PendingState";
import RevokedState      from "./components/certificate/RevokedState";
import IssuedState       from "./components/certificate/IssuedState";

const StudentCertificatePage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const loadCertificates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyCertificates();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || err.message || "Failed to load certificate.");
      notify.error("Could not load your certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} onRetry={loadCertificates} />;
  if (!certificates.length) return <NoCertificateState />;

  // Use the most recent certificate (first in the array)
  const cert = certificates[0];

  switch (cert.status) {
    case "issued":  return <IssuedState  data={cert} />;
    case "pending": return <PendingState data={cert} />;
    case "revoked": return <RevokedState data={cert} />;
    case "locked":
    default:        return <LockedState  data={cert} />;
  }
};

export default StudentCertificatePage;