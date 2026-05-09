/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  ExternalLink,
  Copy,
} from "lucide-react";

import { notify } from "../../../utils/toast";
import axiosInstance from "../../../api/axiosInstance";

const AdminPaymentRequestsPage = () => {
  const [payments, setPayments] = useState([]);
  const [tutorRequests, setTutorRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    amount: "",
    description: "",
  });

  // ─────────────────────────────────────────────────────
  // FETCH TUTOR REQUESTS
  // ─────────────────────────────────────────────────────
  const fetchTutorRequests = async () => {
    try {
      const res = await axiosInstance.get("/admin/tutor-requests");

      console.log("Tutor Requests:", res.data);

      setTutorRequests(res.data?.requests || res.data || []);
    } catch (err) {
      console.error(err);
      notify.error("Failed to load tutor requests");
    }
  };

  // ─────────────────────────────────────────────────────
  // FETCH PAYMENT REQUESTS
  // ─────────────────────────────────────────────────────
  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        "/admin/payment-requests"
      );

      console.log("Payments:", res.data);

      setPayments(res.data?.payments || res.data || []);
    } catch (err) {
      console.error(err);
      notify.error("Failed to load payment requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorRequests();
    fetchPayments();
  }, []);

  // ─────────────────────────────────────────────────────
  // CREATE PAYMENT REQUEST
  // ─────────────────────────────────────────────────────
  const handleCreatePayment = (e) => {
    e.preventDefault();
  
    const selectedRequest = tutorRequests.find(
      (r) => String(r.id) === String(formData.user_id)
    );
  
    if (!selectedRequest || !formData.amount) {
      notify.error("Fill all fields");
      return;
    }
  
    const tx_ref = `PAY-${Date.now()}`;
  
    // FIXED FLUTTERWAVE LINK
    const paymentLink =
      "https://flutterwave.com/pay/gevoos4331nd";
  
    const newPayment = {
      id: tx_ref,
      full_name: selectedRequest.full_name,
      email: selectedRequest.email,
      subject: selectedRequest.subject,
      amount: formData.amount,
      reference: tx_ref,
      status: "pending",
      payment_link: paymentLink,
    };
  
    setPayments((prev) => [newPayment, ...prev]);
  
    notify.success("Payment link generated");
  
    setFormData({
      user_id: "",
      amount: "",
    });
  };
  // ─────────────────────────────────────────────────────
  // DELETE PAYMENT REQUEST
  // ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this payment request?"
      )
    )
      return;

    try {
      await axiosInstance.delete(
        `/admin/payment-requests/${id}`
      );

      setPayments((prev) =>
        prev.filter((p) => p.id !== id)
      );

      notify.success("Deleted successfully");
    } catch (err) {
      console.error(err);
      notify.error("Delete failed");
    }
  };

  // ─────────────────────────────────────────────────────
  // COPY PAYMENT LINK
  // ─────────────────────────────────────────────────────
  const copyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);

      notify.success("Payment link copied");
    } catch (err) {
      console.error(err);
      notify.error("Copy failed");
    }
  };

  // ─────────────────────────────────────────────────────
  // STATUS BADGE
  // ─────────────────────────────────────────────────────
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Paid
          </span>
        );

      case "failed":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            Failed
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">
          Payment Requests
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Generate payment links for tutor
          requests
        </p>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <Plus className="w-5 h-5 text-[#004aad]" />

          <h2 className="font-semibold text-lg">
            Create Payment Request
          </h2>
        </div>

        <form
          onSubmit={handleCreatePayment}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* SELECT TUTOR REQUEST */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Select Tutor Request
            </label>

            <select
              value={formData.user_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  user_id: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#004aad]"
            >
              <option value="">
                Select Tutor Request
              </option>

              {tutorRequests.map((request) => (
                <option
                  key={request.id}
                  value={request.id}
                >
                  {request.full_name} (
                  {request.email}) -{" "}
                  {request.subject}
                </option>
              ))}
            </select>
          </div>

          {/* AMOUNT */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Amount (₦)
            </label>

            <input
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value,
                })
              }
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#004aad]"
            />
          </div>
          {/* BUTTON */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#004aad] text-white px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading
                ? "Generating Payment Link..."
                : "Generate Payment Link"}
            </button>
          </div>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Subject
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Amount
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Reference
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-500"
                  >
                    No payment requests found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* STUDENT */}
                    <td className="px-6 py-5">
                      <p className="font-medium text-gray-900">
                        {payment.full_name}
                      </p>

                      <p className="text-sm text-gray-500">
                        {payment.email}
                      </p>
                    </td>

                    {/* SUBJECT */}
                    <td className="px-6 py-5 text-gray-700">
                      {payment.subject}
                    </td>

                    {/* AMOUNT */}
                    <td className="px-6 py-5 font-semibold text-gray-800">
                      ₦
                      {Number(
                        payment.amount
                      ).toLocaleString()}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5">
                      {getStatusBadge(
                        payment.status
                      )}
                    </td>

                    {/* REFERENCE */}
                    <td className="px-6 py-5 text-sm text-gray-600">
                      {payment.reference}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        {/* OPEN */}
                        <a
                          href={
                            payment.payment_link
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-[#004aad] hover:bg-blue-50 rounded-xl transition"
                        >
                          <ExternalLink size={18} />
                        </a>

                        {/* COPY */}
                        <button
                          onClick={() =>
                            copyLink(
                              payment.payment_link
                            )
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition"
                        >
                          <Copy size={18} />
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() =>
                            handleDelete(
                              payment.id
                            )
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentRequestsPage;