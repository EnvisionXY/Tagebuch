import { id, create } from "./lib.js";
import { displayEntry } from "./entries.js";
import { setCurrentDateTime } from "./dateTime.js";
import { getCurrentIndex, updateCurrentIndex } from "./navigation.js";

export function getEntries() {
  return JSON.parse(localStorage.getItem("diaryEntries")) || [];
}

export function saveEntry() {
  let entries = getEntries();

  // 1. Formulardaten erfassen
  const entry = {
    id: Date.now(),
    location: id("location").value,
    date: id("entry-date").value,
    time: id("entry-time").value,
    mood: id("mood").value,
    entries: {
      "good-today": id("good-today").value,
      "beautiful-moment": id("beautiful-moment").value,
      "felt-good": id("felt-good").value,
      "had-fun": id("had-fun").value,
      "looking-forward": id("looking-forward").value,
      "other-thoughts": id("other-thoughts").value,
    },
  };

  // 2. Neuen Eintrag hinzufügen
  entries.push(entry);
  localStorage.setItem("diaryEntries", JSON.stringify(entries));

  // 3. UI aktualisieren
  alert("Eintrag erfolgreich gespeichert! 🎉");
  id("form").reset();

  // Setze den aktuellen Index auf den neuesten Eintrag
  updateCurrentIndex(entries.length - 1);

  displayEntry();
}

export function deleteEntry(entryId) {
  console.log(`deleteEntry aufgerufen mit ID: ${entryId}`);

  if (!entryId) {
    console.error("FEHLER: Keine gültige entryId!");
    return;
  }

  // Bestätigung einholen
  if (!confirm("Möchtest du diesen Eintrag wirklich löschen?")) {
    console.log("Löschen abgebrochen.");
    return;
  }

  let entries = getEntries();
  console.log("Vor dem Löschen:", entries);

  // Neuen Array ohne das gelöschte Element erstellen
  entries = entries.filter((entry) => entry.id != entryId);

  // Daten im LocalStorage aktualisieren
  localStorage.setItem("diaryEntries", JSON.stringify(entries));
  console.log("Nach dem Löschen:", entries);

  // Falls der letzte Eintrag gelöscht wurde, UI leeren
  if (entries.length === 0) {
    console.log("Alle Einträge wurden gelöscht.");
    id("entries-container").innerHTML = "<p>Keine Einträge vorhanden</p>";
    return;
  }

  // Index anpassen, um nicht ins Leere zu zeigen
  if (getCurrentIndex() >= entries.length) {
    updateCurrentIndex(entries.length - 1);
  }

  console.log("Index angepasst auf:", getCurrentIndex());

  // Neuen Eintrag anzeigen
  displayEntry();
}

export function editEntry(entryId) {
  let entries = getEntries();
  const entry = entries.find((entry) => entry.id == entryId);

  if (!entry) {
    console.error("Eintrag nicht gefunden.");
    return;
  }

  // Formular mit Eintragsdaten befüllen
  id("location").value = entry.location;
  id("entry-date").value = entry.date;
  id("entry-time").value = entry.time;
  id("mood").value = entry.mood;
  id("good-today").value = entry.entries["good-today"];
  id("beautiful-moment").value = entry.entries["beautiful-moment"];
  id("felt-good").value = entry.entries["felt-good"];
  id("had-fun").value = entry.entries["had-fun"];
  id("looking-forward").value = entry.entries["looking-forward"];
  id("other-thoughts").value = entry.entries["other-thoughts"];

  // UI anpassen
  id("entries-container").classList.add("hidden");
  id("form").classList.remove("hidden");
  id("load-entries").textContent = "Einträge anzeigen";
  id("submit").style.display = "none";

  // Falls Buttons schon existieren, zuerst entfernen
  document
    .querySelectorAll("#save-edit, #cancel-edit")
    .forEach((btn) => btn.remove());

  const saveButton = create("button");
  saveButton.id = "save-edit";
  saveButton.textContent = "Änderungen speichern";
  saveButton.classList.add("submit-style");
  id("form").appendChild(saveButton);

  const cancelButton = create("button");
  cancelButton.id = "cancel-edit";
  cancelButton.textContent = "Bearbeitung abbrechen";
  cancelButton.classList.add("cancel-style");
  id("form").appendChild(cancelButton);

  saveButton.addEventListener("click", () => saveEditedEntry(entryId));
  cancelButton.addEventListener("click", cancelEdit);
}

export function saveEditedEntry(entryId) {
  let entries = getEntries();
  const entryIndex = entries.findIndex((entry) => entry.id == entryId);

  if (entryIndex === -1) return;

  // 📝 Eintrag mit neuen Werten aktualisieren
  entries[entryIndex] = {
    ...entries[entryIndex],
    location: id("location").value,
    date: id("entry-date").value,
    time: id("entry-time").value,
    mood: id("mood").value,
    entries: {
      "good-today": id("good-today").value,
      "beautiful-moment": id("beautiful-moment").value,
      "felt-good": id("felt-good").value,
      "had-fun": id("had-fun").value,
      "looking-forward": id("looking-forward").value,
      "other-thoughts": id("other-thoughts").value,
    },
  };

  // 🌍 Änderungen im LocalStorage speichern
  localStorage.setItem("diaryEntries", JSON.stringify(entries));
  console.log(`Eintrag ${entryId} wurde aktualisiert`);

  // 🧹 UI aktualisieren
  id("form").reset(); // Formular leeren
  id("form").classList.add("hidden"); // Formular ausblenden
  id("entries-container").classList.remove("hidden"); // Einträge sichtbar machen
  id("load-entries").textContent = "Einträge verbergen";

  // 🔄 Aktualisierten Eintrag anzeigen
  displayEntry();

  // 🗑 "Speichern" und "Abbrechen"-Buttons entfernen
  id("save-edit").remove();
  id("cancel-edit").remove();
  id("submit").style.display = "block"; // Standard-Submit-Button wieder sichtbar machen
}

export function cancelEdit() {
  id("form").reset();
  setCurrentDateTime();
  id("save-edit").remove();
  id("cancel-edit").remove();
  id("submit").style.display = "block";
  displayEntry();
}
