export function categorize(text) {
  const lower = text.toLowerCase();
  if (lower.includes("naivas")) return "Groceries";
  if (lower.includes("mpesa")) return "Mobile Money";
  if (lower.includes("uber")) return "Transport";
  if (lower.includes("restaurant") || lower.includes("cafe")) return "Dining";
  return "Other";
}
