const container = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");

async function fetchNotes(query = "") {
  let url;

  if (!query.trim()) {
    container.innerHTML = `<p class="no-notes">Search Your Notes... 🔍</p>`;
    return;
  } else {
    url = `http://localhost:8000/api/note/search?query=${query}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  renderNotes(data.data);
}

function renderNotes(notes) {
  if (notes.length === 0) {
    container.innerHTML = "<p class='no-notes'>No notes found 😢</p>";
    return;
  }

  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note";

    div.innerHTML = `
  <p>${note.content.slice(0, 120)}...</p>
  <small>${note.type}</small><br/>
  <small>${note.tags?.join(", ")}</small><br/>
  <a href="${note.sourceUrl}" target="_blank">View Source</a>
`;

    container.appendChild(div);
  });
}

let timeout;

searchInput.addEventListener("input", (e) => {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    const value = e.target.value;
    fetchNotes(value);
  }, 300);
});
fetchNotes();
