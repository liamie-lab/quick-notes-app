
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const noteCategory = document.getElementById("note-category");
const notesList = document.getElementById("notes-list");
const noteCount = document.getElementById("note-count");
const errorMessage = document.getElementById("error-message");
const searchInput = document.getElementById("search-input");

// Store notes in an array
let notes = [];

// Display notes on the page
function displayNotes(notesToDisplay = notes) {
    notesList.innerHTML = "";

    notesToDisplay.forEach(function (note) {
        const listItem = document.createElement("li");
        listItem.classList.add(
            "note-card",
            `category-${note.category}`
        );

        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        const category = document.createElement("small");
        category.textContent = `Category: ${note.category}`;

        const date = document.createElement("small");
        date.textContent = `Created: ${new Date(note.createdAt).toLocaleString()}`;

        listItem.appendChild(noteText);
        listItem.appendChild(category);
        listItem.appendChild(date);

        notesList.appendChild(listItem);
    });

    // Update the total note count
    noteCount.textContent = notes.length === 1
        ? "You have 1 note."
        : `You have ${notes.length} notes.`;
}

// Add a new note
noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent = "Please enter a note.";
        return;
    }

    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);

    displayNotes();

    noteInput.value = "";
    errorMessage.textContent = "";
    noteInput.focus();
});

// Search notes
searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchTerm);
    });

    displayNotes(filteredNotes);
});

// Show the initial empty state
displayNotes();
