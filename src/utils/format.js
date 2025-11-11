export function formatINR(value) {
  const num = Number(value) || 0
  try {
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })
  } catch (e) {
    // Fallback
    return `₹${num.toFixed(2)}`
  }
}
