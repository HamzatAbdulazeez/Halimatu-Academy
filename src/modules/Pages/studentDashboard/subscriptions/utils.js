export const formatDate = (d) => {
    if (!d) return '—';
    try {
      return new Date(d).toLocaleDateString('en-NG', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return '—';
    }
  };
  
  export const formatPrice = (amount) => {
    if (amount == null) return '—';
    return `₦${Number(amount).toLocaleString()}`;
  };