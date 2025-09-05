const board = document.getElementById("board");
const uploadInput = document.getElementById("uploadImage");

// 1. Upload image → create card
function triggerUpload() {
  uploadInput.click();
}

uploadInput.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (event) {
      createCard(event.target.result);
      showToast("New card added!");
    };
    reader.readAsDataURL(file);
  }
});

// 2. Create a card with image + quote + buttons
function createCard(imageSrc) {
  const card = document.createElement("div");
  card.classList.add("card");

  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = "Vision";

  const quoteEl = document.createElement("p");
  quoteEl.className = "quote-text";
  quoteEl.textContent = "Click here to add a quote";
  quoteEl.contentEditable = "true"; // make editable
  quoteEl.addEventListener("focus", () => {
    if (quoteEl.textContent === "Click here to add a quote") {
      quoteEl.textContent = "";
    }
  });
  quoteEl.addEventListener("blur", () => {
    if (!quoteEl.textContent.trim()) {
      quoteEl.textContent = "Click here to add a quote";
    }
    showToast("Quote updated!");
  });

  // Buttons for this card only
  const buttonBar = document.createElement("div");
  buttonBar.classList.add("card-buttons");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.onclick = () => {
    card.remove();
    showToast("Card removed!");
  };

  buttonBar.appendChild(deleteBtn);

  card.appendChild(img);
  card.appendChild(quoteEl);
  card.appendChild(buttonBar);

  board.appendChild(card);
}

// 3. Save board to localStorage
function saveBoard() {
  const data = Array.from(document.querySelectorAll(".card")).map(card => card.innerHTML);
  localStorage.setItem("visionBoard", JSON.stringify(data));
  alert("Board saved!");
}

// 4. Load saved board
window.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("visionBoard"));
  if (data) {
    data.forEach(content => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = content;

      // restore editable quotes
      const quoteEl = card.querySelector(".quote-text");
      if (quoteEl) {
        quoteEl.contentEditable = "true";
        quoteEl.addEventListener("blur", () => {
          if (!quoteEl.textContent.trim()) {
            quoteEl.textContent = "Click here to add a quote";
          }
          showToast("Quote updated!");
        });
      }

      // restore delete button event
      const deleteBtn = card.querySelector("button");
      if (deleteBtn) {
        deleteBtn.onclick = () => {
          card.remove();
          showToast("Card removed!");
        };
      }

      board.appendChild(card);
    });
  }
  showToast("You can change your images and quotes anytime—just click a card.");
});

// 5. Reset board
function resetBoard() {
  if (confirm("Has your vision come true? Start a new board?")) {
    localStorage.removeItem("visionBoard");
    board.innerHTML = "";
    showToast("Board reset!");
  }
}

// 6. Toast function
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}
