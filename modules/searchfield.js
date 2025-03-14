import { getEntries } from "./storage.js";
import { id, create } from "./lib.js";
import { displayEntry } from "./entries.js";
import { toggleFormVisibility } from "./ui.js";
import { updateCurrentIndex } from "./navigation.js";

export function setupSearch() {
  const searchInput = id("search");
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchEntries();
    }
  });
}

function searchEntries() {
  const query = id("search").value.trim().toLowerCase();
  const resultsContainer = id("search-results") || createResultsContainer();
  resultsContainer.innerHTML = ""; // Vorherige Ergebnisse löschen

  const entries = getEntries();
  const matchingEntries = entries.filter((entry) =>
    Object.values(entry)
      .flatMap((value) =>
        typeof value === "object" ? Object.values(value) : [value]
      )
      .some((val) => val.toString().toLowerCase().includes(query))
  );

  // UI anpassen (Formular verstecken, Suchergebnisse anzeigen)
  id("form").classList.add("hidden");
  id("entries-container").classList.remove("hidden");

  if (matchingEntries.length === 0) {
    resultsContainer.innerHTML = "<p>Keine Treffer gefunden.</p>";
  } else {
    matchingEntries.forEach((entry) => {
      const resultItem = create("div");
      resultItem.classList.add("search-result-item");
      resultItem.textContent = `${entry.date} - ${entry.location}`;
      resultItem.style.cursor = "pointer";
      resultItem.addEventListener("click", () => {
        displayEntryById(entry.id);
      });
      resultsContainer.appendChild(resultItem);
    });
  }

  // "Zurück zum Formular"-Button anzeigen
  id("load-entries").textContent = "Zurück zum Formular";
  id("load-entries").onclick = showFormAgain;
}

function createResultsContainer() {
  const container = create("div");
  container.id = "search-results";
  container.classList.add("search-results");
  id("entries-container").appendChild(container);
  return container;
}

function displayEntryById(entryId) {
  const entries = getEntries();
  const entryIndex = entries.findIndex((entry) => entry.id == entryId);

  if (entryIndex !== -1) {
    updateCurrentIndex(entryIndex); // Setze den aktuellen Index richtig

    // 🔥 ALLE vorherigen Inhalte sicher entfernen
    id("entries-container").innerHTML = ""; // Vorherige Einträge löschen
    const searchResults = id("search-results");
    if (searchResults) {
      searchResults.remove(); // Komplett aus dem DOM entfernen
    }

    displayEntry(); // Zeige den gewählten Eintrag an

    // Sicherstellen, dass der Eintrag auch wirklich sichtbar wird
    id("entries-container").classList.remove("hidden");

    console.log("Eintrag erfolgreich angezeigt:", entries[entryIndex]);
  } else {
    alert("Fehler: Eintrag nicht gefunden.");
  }
}

// 🔄 Funktion, um das Formular zurückzuholen
function showFormAgain() {
  id("search").value = ""; // Suchfeld leeren

  // 🔥 Sicherstellen, dass `search-results` vollständig verschwindet
  const searchResults = id("search-results");
  if (searchResults) {
    searchResults.remove(); // Element aus dem DOM entfernen
  }

  // 🔥 Sicherstellen, dass `entries-container` nicht fälschlicherweise alte Einträge zeigt
  id("entries-container").innerHTML = "";
  id("entries-container").classList.add("hidden");

  // 🔥 Formular anzeigen
  id("form").classList.remove("hidden");
  id("load-entries").textContent = "Einträge anzeigen";
  id("load-entries").onclick = toggleFormVisibility;
}
