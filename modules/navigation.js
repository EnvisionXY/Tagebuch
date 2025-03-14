import { displayEntry } from "./entries.js";
import { getEntries } from "./storage.js";

let entries = getEntries();
let currentIndex = entries.length - 1;

export function showPreviousEntry() {
  console.log("showPreviousEntry");
  console.log("currentIndex", currentIndex);
  if (currentIndex > 0) {
    currentIndex--;
    displayEntry();
  }
}

export function showNextEntry() {
  console.log("showNextEntry");
  console.log("currentIndex", currentIndex);
  if (currentIndex < entries.length - 1) {
    currentIndex++;
    displayEntry();
  }
}

export function getCurrentIndex() {
  return currentIndex;
}

export function updateCurrentIndex(newIndex) {
  currentIndex = newIndex;
}
