import { el } from "./lib.js";

export function setCurrentDateTime() {
  const dateTime = new Date(); // aktuelles Datum und Uhrzeit

  // Datum setzen
  const date = dateTime.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  el("#entry-date").value = date;

  // Uhrzeit setzen
  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");
  el("#entry-time").value = `${hours}:${minutes}`;
}
