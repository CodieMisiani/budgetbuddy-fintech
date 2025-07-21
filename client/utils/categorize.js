export default function categorize(text) {
  const lower = (text || "").toLowerCase();
  if (lower.includes("naivas")) return "Groceries";
  if (lower.includes("mpesa")) return "Mobile Money";
  if (lower.includes("uber")) return "Transport";
  if (lower.includes("kfc") || lower.includes("restaurant") || lower.includes("cafe")) return "Dining";
  if (lower.includes("salary") || lower.includes("payroll")) return "Salary";
  if (lower.includes("airtime")) return "Airtime";
  if (lower.includes("rent")) return "Rent";
  if (lower.includes("school")) return "Education";
  if (lower.includes("loan")) return "Loan";
  if (lower.includes("electricity") || lower.includes("kplc")) return "Utilities";
  return "Other";
}
