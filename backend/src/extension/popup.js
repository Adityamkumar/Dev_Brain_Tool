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
  container.innerHTML = "";

  if (notes.length === 0) {
    container.innerHTML = `<p class="no-notes">No notes found 😢</p>`;
    return;
  }

  notes.forEach((note) => {
    const div = document.createElement("div");
    div.className = "note";

    let isExpanded = false;

    const shortText = note.content.slice(0, 100);

    div.innerHTML = `
      <p class="content">${shortText}...</p>
      
      <div class="actions">
        <button class="expand-btn">Expand</button>
        <button class="copy-btn">Copy</button>
        <button class="delete-btn">Delete</button>
      </div>

      <small>${note.type}</small>
    `;

    const contentEl = div.querySelector(".content");
    const expandBtn = div.querySelector(".expand-btn");
    const copyBtn = div.querySelector(".copy-btn");
    const deleteBtn = div.querySelector(".delete-btn");

    expandBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;

      if (isExpanded) {
        contentEl.textContent = note.content;
        expandBtn.textContent = "Collapse";
      } else {
        contentEl.textContent = shortText + "...";
        expandBtn.textContent = "Expand";
      }
    });

    copyBtn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(note.content);
      copyBtn.textContent = "Copied ✅";

      setTimeout(() => {
        copyBtn.textContent = "Copy";
      }, 1500);
    });

    deleteBtn.addEventListener("click", async () => {
      const confirmDelete = confirm("Delete this note?");
      if (!confirmDelete) return;

      try {
        deleteBtn.textContent = "Deleting...";
        deleteBtn.disabled = true;

        const res = await fetch(`http://localhost:8000/api/note/${note._id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (!data.success) {
          throw new Error("Delete failed");
        }
        div.classList.add("removing");

        setTimeout(() => {
          div.remove();
        }, 200);
      } catch (error) {
        console.error("Delete failed:", error);

        deleteBtn.textContent = "Error ❌";

        setTimeout(() => {
          deleteBtn.textContent = "Delete";
          deleteBtn.disabled = false;
        }, 1500);
      }
    });

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
