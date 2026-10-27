
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const noteCategory = document.getElementById("note-category");
const notesList = document.getElementById("notes-list");
const noteCount = document.getElementById("note-count");
const errorMessage = document.getElementById("error-message");
const searchInput = document.getElementById("search-input");

// Load saved notes from localStorage
let notes = [];

try {
    const savedNotes = localStorage.getItem("quickNotes");

    if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);

        if (Array.isArray(parsedNotes)) {
            notes = parsedNotes;
        }
    }
} catch (error) {
    console.error("Could not load saved notes:", error);
}

// Save notes to localStorage
function saveNotes() {
    try {
        localStorage.setItem("quickNotes", JSON.stringify(notes));
    } catch (error) {
        errorMessage.textContent =
            "Unable to save notes. Check your browser storage settings.";
        console.error("Could not save notes:", error);
    }
}

// Display notes and update count
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
        date.textContent =
            `Created: ${new Date(note.createdAt).toLocaleString()}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            deleteNote(note.id);
        });

        listItem.appendChild(noteText);
        listItem.appendChild(category);
        listItem.appendChild(date);
        listItem.appendChild(deleteButton);

        notesList.appendChild(listItem);
    });

    noteCount.textContent = notes.length === 1
        ? "You have 1 note."
        : `You have ${notes.length} notes.`;
}

// Add a new note
noteForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text.length === 0) {
        errorMessage.textContent = "Please enter a note.";
        noteInput.focus();
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent =
            "Your note must not exceed 200 characters.";
        noteInput.focus();
        return;
    }

    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toISOString()
    };

    notes.push(newNote);
    saveNotes();
    displayNotes();

    errorMessage.textContent = "";
    noteForm.reset();
    noteInput.focus();
});

// Delete a note
function deleteNote(noteId) {
    notes = notes.filter(function (note) {
        return note.id !== noteId;
    });

    saveNotes();
    displayNotes();
}

// Search notes, ignoring uppercase and lowercase
searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchTerm);
    });

    displayNotes(filteredNotes);
});

// Display saved notes when the page opens
displayNotes();
