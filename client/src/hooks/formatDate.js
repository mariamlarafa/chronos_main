export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" }); // Get the full month name
  const year = date.getFullYear();

  // Create a zero-padded day (e.g., "03" instead of "3")
  const formattedDay = day.toString().padStart(2, "0");

  // Return the formatted date string
  return `${formattedDay} ${month} ${year}`;
}


