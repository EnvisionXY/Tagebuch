import { saveEntry, deleteEntry, editEntry } from "./storage.js";
import { loadEntry, displayEntry } from "./entries.js";
import { showPreviousEntry, showNextEntry } from "./navigation.js";
import { setCurrentDateTime } from "../modules/dateTime.js";
import { setupSearch } from "./searchfield.js";
import { el, id } from "./lib.js";

export function init() {
  document.addEventListener("DOMContentLoaded", () => {
    setCurrentDateTime();
    setupSearch();

    el("#form").addEventListener("submit", (event) => {
      event.preventDefault();
      saveEntry();
      displayEntry();
    });

    el("#load-entries").addEventListener("click", () => {
      loadEntry();
    });

    // 🎯 Event Delegation für Navigation
    id("entries-container").addEventListener("click", (event) => {
      if (event.target.closest("#prev")) {
        showPreviousEntry();
      }
      if (event.target.closest("#next")) {
        showNextEntry();
      }

      // 🎯 Event Delegation für Edit-Buttons
      const editButton = event.target.closest(".edit-entry");
      if (editButton) {
        const entryId = editButton.getAttribute("data-id");
        if (entryId) editEntry(entryId);
      }

      // 🎯 Event Delegation für Delete-Buttons
      const deleteButton = event.target.closest(".delete-entry");
      if (deleteButton) {
        const entryId = deleteButton.getAttribute("data-id");
        if (entryId) deleteEntry(entryId);
      }
    });
  });
}
