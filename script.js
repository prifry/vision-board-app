let selectedCard = null;
const board = document.getElementById("board");

// 1. Create 12 empty cards
for (let i = 0; i < 12; i++) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = i;
   // card.innerHTML = `<p></p>`;
    card.addEventListener("click", function () {
        // Highlight selected card
        document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        card.classList.add("selected");
        selectedCard = card;
    });
    board.appendChild(card);
}

// 2. Upload image
function triggerUpload() {
    document.getElementById("uploadImage").click();
}

document.getElementById("uploadImage").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
        if (!selectedCard) {
            alert("Click a card first to select where to upload or replace the image.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (event) {
            let img = selectedCard.querySelector("img");

            if (img) {
                // If image exists, just update the source
                img.src = event.target.result;
            } else {
                // If no image, create it and insert at top
                img = document.createElement("img");
                img.src = event.target.result;
                img.alt = "Vision";
                selectedCard.insertBefore(img, selectedCard.firstChild);
            }
        };

        reader.readAsDataURL(file);
        
    }
    img.src = event.target.result;
        showToast("Image updated!");
});

// 3. Add or update quote
function addQuote() {
    if (!selectedCard) {
        alert("Click a card first to select where to add or update the quote.");
        return;
    }

    const quote = prompt("Enter your quote:");

    if (quote) {
        // Check if quote already exists in the card
        let quoteEl = selectedCard.querySelector(".quote-text");

        if (quoteEl) {
            // If it exists, update the content
            quoteEl.textContent = quote;
        } else {
            // If not, create and append the quote
            quoteEl = document.createElement("p");
            quoteEl.className = "quote-text";
            quoteEl.textContent = quote;
            selectedCard.appendChild(quoteEl);
        }
    }
    showToast("Quote updated!");
}
// 4. Find first empty card
function getSelectedCard() {
    const cards = document.querySelectorAll(".card");
    for (let card of cards) {
        const isEmpty = card.textContent.trim() === "";
        if (isEmpty || card.querySelector("img") || card.querySelector(".quote-text")) {
            if (!card.classList.contains("filled")) {
                card.classList.add("filled");
                return card;
            }
        }
    }
    return null;
}

// 5. Save board to localStorage
function saveBoard() {
    const data = Array.from(document.querySelectorAll(".card")).map(card => card.innerHTML);
    localStorage.setItem("visionBoard", JSON.stringify(data));
    alert("Board saved!");
}

// 6. Load saved board
window.addEventListener("DOMContentLoaded", () => {
    const data = JSON.parse(localStorage.getItem("visionBoard"));
    if (data) {
        const cards = document.querySelectorAll(".card");
        data.forEach((content, i) => {
            if (cards[i]) cards[i].innerHTML = content;
        });
    }

    window.addEventListener("DOMContentLoaded", () => {
        const data = JSON.parse(localStorage.getItem("visionBoard"));
        if (data) {
            const cards = document.querySelectorAll(".card");
            data.forEach((content, i) => {
                if (cards[i]) cards[i].innerHTML = content;
            });
        }

        // Show welcome toast
        showToast("You can change your images and quotes anytime—just click a card.");
    });

    
   

});
 function showToast(message, duration = 3000) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, duration);
    }

    // 7. Reset the board
    function resetBoard() {
        if (confirm("Has your vision come true? Start a new board?")) {
            localStorage.removeItem("visionBoard");
            window.location.reload();
        }
    }