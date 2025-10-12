export const isExpired = (expiryDate) => new Date(expiryDate) < new Date();
export const daysUntil = (expiryDate) =>
  Math.ceil((new Date(expiryDate) - new Date()) / (1000*60*60*24));
export const isNearExpiry = (expiryDate, days = 30) => {
  const d = daysUntil(expiryDate);
  return d >= 0 && d <= days;
};
