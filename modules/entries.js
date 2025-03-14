import { getEntries, editEntry, deleteEntry } from "./storage.js";
import { toggleFormVisibility } from "./ui.js";
import { id, create, group } from "./lib.js";
import { getCurrentIndex, updateCurrentIndex } from "./navigation.js";

let entries = getEntries();

export function loadEntry() {
  entries = getEntries();
  if (entries.length === 0) {
    console.log("Keine Einträge vorhanden");
    id("entries-container").innerHTML = "<p>Keine Einträge vorhanden</p>";
    return;
  }

  displayEntry();
  toggleFormVisibility();
}

// 📆 Formatiert das Datum in TT.MM.JJJJ
function formatDate(date) {
  if (!date) return "Kein Datum";
  const [year, month, day] = date.split("-");
  return `${day}.${month}.${year}`;
}

export function displayEntry() {
  entries = getEntries();
  const container = id("entries-container");
  container.innerHTML = "";

  // Get the current index
  let currentIndex = getCurrentIndex();

  if (
    entries.length === 0 ||
    currentIndex < 0 ||
    currentIndex >= entries.length
  ) {
    container.innerHTML = "<p>Keine Einträge vorhanden</p>";
    return;
  }

  // Entry-Element erstellen
  const entry = entries[currentIndex];
  const formattedDate = formatDate(entry.date);

  const entryDiv = create("div");
  entryDiv.classList.add("entry");

  entryDiv.innerHTML = `
    <nav class="entries-nav">
      <h3 class="entry-date">${formattedDate}</h3>
      <div class="entry-buttons">
        <button class="edit-entry" data-id="${entry.id}" aria-label="Bearbeiten">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z"></path>
      </svg>
        </button>
        <button class="delete-entry" data-id="${entry.id}" aria-label="Löschen">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M4 6h16"></path>
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
      </svg>
        </button>
      </div>
    </nav>
    <h3>${entry.location} - ${entry.time}</h3>
    <p><strong>Stimmung:</strong> ${entry.mood}</p>
    <p><strong>Was habe ich heute gut gemacht?</strong> <br> ${entry.entries["good-today"]}</p>
    <p><strong>Welcher Moment war heute schön?</strong> <br> ${entry.entries["beautiful-moment"]}</p>
    <p><strong>Wann habe ich mich heute gut gefühlt?</strong> <br> ${entry.entries["felt-good"]}</p>
    <p><strong>Was hat mir heute Spaß gemacht?</strong> <br> ${entry.entries["had-fun"]}</p>
    <p><strong>Worauf freue ich mich morgen?</strong> <br> ${entry.entries["looking-forward"]}</p>
    <p><strong>Was geht mir sonst so durch den Kopf?</strong> <br> ${entry.entries["other-thoughts"]}</p>
  `;

  // Wrapper für Navigation + Eintrag erstellen
  const entryWrapper = create("div");
  entryWrapper.classList.add("entry-wrapper");

  // "Vorheriger Eintrag" Button
  const prevButton = create("button");
  prevButton.id = "prev";
  prevButton.innerHTML = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M15 18l-6-6 6-6"></path>
  </svg>
`;
  prevButton.classList.add("nav-button");

  // "Nächster Eintrag" Button
  const nextButton = create("button");
  nextButton.id = "next";
  nextButton.innerHTML = `<svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M9 18l6-6-6-6"></path>
      </svg>
    `;
  nextButton.classList.add("nav-button");

  // 🎯 Dynamisches Anzeigen/Verstecken der Pfeile mit visibility: hidden;
  prevButton.style.visibility = currentIndex === 0 ? "hidden" : "visible";
  nextButton.style.visibility =
    currentIndex === entries.length - 1 ? "hidden" : "visible";

  // Elemente in den Wrapper einfügen
  entryWrapper.appendChild(prevButton);
  entryWrapper.appendChild(entryDiv);
  entryWrapper.appendChild(nextButton);

  // Wrapper in den Container einfügen
  container.appendChild(entryWrapper);
}
