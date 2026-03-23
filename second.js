const birds = [
  {
    id: "amsel",
    name: "Amsel",
    image: "assets/images/amsel.jpg",
    sound: "assets/audio/amsel.mp3"
  },
  {
    id: "buchfink",
    name: "Buchfink",
    image: "assets/images/buchfink.jpg",
    sound: "assets/audio/buchfink.mp3"
  },
  {
    id: "nachtigall",
    name: "Nachtigall",
    image: "assets/images/nachtigall.jpg",
    sound: "assets/audio/nachtigall.mp3"
  },
  {
    id: "star",
    name: "Star",
    image: "assets/images/star.jpg",
    sound: "assets/audio/star.mp3"
  }
];

const imagePool = document.getElementById("image-pool");
const namePool = document.getElementById("name-pool");
const board = document.getElementById("task-board");
const message = document.getElementById("quiz-message");
const checkButton = document.getElementById("check-answers");
const modal = document.getElementById("success-modal");
const closeModalButton = document.getElementById("close-modal");
const quizCard = document.querySelector(".quiz-card");

function shuffled(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createImageToken(bird) {
  const token = document.createElement("button");
  token.type = "button";
  token.className = "token image-token";
  token.draggable = true;
  token.dataset.tokenId = `image-${bird.id}`;
  token.dataset.kind = "image";
  token.dataset.birdId = bird.id;
  token.innerHTML = `<img src="${bird.image}" alt="${bird.name}" loading="lazy" />`;
  return token;
}

function createNameToken(bird) {
  const token = document.createElement("button");
  token.type = "button";
  token.className = "token name-token";
  token.draggable = true;
  token.dataset.tokenId = `name-${bird.id}`;
  token.dataset.kind = "name";
  token.dataset.birdId = bird.id;
  token.textContent = bird.name;
  return token;
}

function createTaskRow(bird, index) {
  const row = document.createElement("article");
  row.className = "task-row";

  row.innerHTML = `
    <div class="drop-slot" data-kind="image" data-answer="${bird.id}" data-placeholder="Drop picture here" aria-label="Picture drop zone for row ${index + 1}">
      Füge das Bild hier ein
    </div>
    <div class="drop-slot" data-kind="name" data-answer="${bird.id}" data-placeholder="Drop name here" aria-label="Name drop zone for row ${index + 1}">
        Füge den Namen hier ein
    </div>
    <div class="sound-box">
      <audio controls preload="none" src="${bird.sound}"></audio>
    </div>
  `;

  return row;
}

function resetSlot(slot) {
  slot.classList.remove("filled");
  slot.textContent = slot.dataset.placeholder;
}

function wireDragging() {
  document.querySelectorAll(".token").forEach((token) => {
    token.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", token.dataset.tokenId);
      token.classList.add("dragging");
    });

    token.addEventListener("dragend", () => {
      token.classList.remove("dragging");
    });
  });

  document.querySelectorAll(".drop-slot").forEach((slot) => {
    slot.addEventListener("dragover", (event) => {
      event.preventDefault();
      slot.classList.add("is-over");
    });

    slot.addEventListener("dragleave", () => {
      slot.classList.remove("is-over");
    });

    slot.addEventListener("drop", (event) => {
      event.preventDefault();
      slot.classList.remove("is-over");

      const tokenId = event.dataTransfer.getData("text/plain");
      const token = document.querySelector(`[data-token-id="${tokenId}"]`);
      if (!token || token.dataset.kind !== slot.dataset.kind) {
        return;
      }

      const existing = slot.querySelector(".token");
      if (existing && existing !== token) {
        const targetPool = existing.dataset.kind === "image" ? imagePool : namePool;
        targetPool.appendChild(existing);
      }

      const currentParentSlot = token.closest(".drop-slot");
      if (currentParentSlot && currentParentSlot !== slot) {
        resetSlot(currentParentSlot);
      }

      slot.textContent = "";
      slot.appendChild(token);
      slot.classList.add("filled");
      quizCard.classList.remove("all-correct");
      message.classList.remove("success");
    });
  });
}

function buildBoard() {
  shuffled(birds).forEach((bird) => imagePool.appendChild(createImageToken(bird)));
  shuffled(birds).forEach((bird) => namePool.appendChild(createNameToken(bird)));
  shuffled(birds).forEach((bird, index) => board.appendChild(createTaskRow(bird, index)));
  wireDragging();
}

function isSolved() {
  const slots = Array.from(document.querySelectorAll(".drop-slot"));
  return slots.every((slot) => {
    const token = slot.querySelector(".token");
    return token && token.dataset.birdId === slot.dataset.answer;
  });
}

buildBoard();

checkButton.addEventListener("click", () => {
  const slots = Array.from(document.querySelectorAll(".drop-slot"));

  if (slots.some((slot) => !slot.querySelector(".token"))) {
    message.textContent = "Fülle zuerst alle Bild- und Namenpläne aus.";
    message.classList.remove("success");
    quizCard.classList.remove("all-correct");
    return;
  }

  if (isSolved()) {
    message.textContent = "Perfect. Every match is correct.";
    message.classList.add("success");
    quizCard.classList.add("all-correct");
    modal.hidden = false;
    return;
  }

  message.textContent = "Nich ganz. Überprüfe deine Zuordnungen und versuche es erneut.";
  message.classList.remove("success");
  quizCard.classList.remove("all-correct");
});

closeModalButton.addEventListener("click", () => {
  modal.hidden = true;
});
