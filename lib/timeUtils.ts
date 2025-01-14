export function parseTimeSince(timeSince: string): string {
  // Handle invalid input
  if (!timeSince || typeof timeSince !== "string") {
    return "Just now";
  }

  // Split the input string into value and unit
  const parts = timeSince.split(" ");
  if (parts.length < 2) {
    return "Just now";
  }

  const [value, unit] = parts;
  const numericValue = parseInt(value, 10);

  // Handle invalid numeric values
  if (isNaN(numericValue)) {
    return "Just now";
  }

  // Normalize the unit to handle plural and singular forms
  const normalizedUnit = unit.toLowerCase().replace(/s$/, ""); // Remove trailing 's' for plural forms

  // Convert hours to days if over 24
  if (normalizedUnit === "hr" && numericValue >= 24) {
    const days = Math.floor(numericValue / 24);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  // Map normalized units to their display names
  const unitMap: Record<string, string> = {
    sec: "second",
    min: "minute",
    hr: "hour",
    day: "day",
    week: "week",
    month: "month",
    year: "year",
  };

  // Get the display unit from the map
  const displayUnit = unitMap[normalizedUnit] || unit; // Fallback to the original unit if not found

  // Handle pluralization
  const pluralizedUnit = numericValue === 1 ? displayUnit : `${displayUnit}s`;

  return `${numericValue} ${pluralizedUnit} ago`;
}
