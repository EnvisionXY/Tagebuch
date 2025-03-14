import { id } from "./lib.js";

export function toggleFormVisibility() {
  const form = id("form");
  const container = id("entries-container");
  const button = id("load-entries");

  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    container.classList.add("hidden");
    button.textContent = "Einträge anzeigen";
  } else {
    form.classList.add("hidden");
    container.classList.remove("hidden");
    button.textContent = "Einträge verbergen";
  }
}
