const DEFAULT_SIZE = 9;
const DEFAULT_MODE = "Player vs Computer";
const DEFAULT_PLAYERONE = "Mark";
const DEFAULT_PLAYERTWO = "Computer";

const gameBoard = document.getElementById("game-board");
const menuContainer = document.getElementById("menu-container");
const text = document.getElementById("text");
const playvsComputer = document.getElementById("playvs-computer");
playvsComputer.addEventListener("click", showInputForm);
const playvsPlayer = document.getElementById("playvs-player");
playvsPlayer.addEventListener("click", showInputForm);
const submitNameBtn = document.getElementById("submit-name");
submitNameBtn.addEventListener("click", getNames);
const gameStatus = document.getElementById("game-status");
const againBtn = document.createElement("button");
againBtn.textContent = "Try Again";
againBtn.addEventListener("click", resetGame);
againBtn.id = "again-btn";

let playMode = DEFAULT_MODE;
let currentMarker = "X";
let currentState;

let winningGrids = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const player = {
  playerOne: {
    name: DEFAULT_PLAYERONE,
    marker: "X",
  },
  playerTwo: {
    name: DEFAULT_PLAYERTWO,
    marker: "O",
  },
};

let currentPlayer = player["playerOne"];

function getNames() {
  const One = document.getElementById("player-one");
  const Two = document.getElementById("player-two");
  const inputName = document.getElementById("input-name");

  const pError = document.createElement("p");
  pError.className = "text-red-300 absolute -bottom-5";
  pError.textContent = "Please add a name";

  if (One.value === "") {
    return inputName.appendChild(pError);
  }
  if (playMode === "Player vs Player") {
    if (One.value === "" || Two.value === "") {
      return inputName.appendChild(pError);
    }
    player["playerTwo"].name = Two.value;
  }
  player["playerOne"].name = One.value;

  resetGame();
}

function showInputForm(mode) {
  playMode = mode.target.textContent.trim();
  const inputName = document.getElementById("input-name");
  const menu = document.getElementById("menu");
  const playerTwo = document.getElementById("second-player");

  menu.classList.add("opacity-0");
  setTimeout(() => {
    menu.classList.add("hidden");
    inputName.classList.remove("hidden");
    inputName.classList.add("flex");
  }, 300);
  if (playMode === "Player vs Computer") {
    playerTwo.classList.add("hidden");
  }
}

function createBoard() {
  for (let i = 0; i < DEFAULT_SIZE; i++) {
    const box = document.createElement("div");
    box.className =
      "w-20 h-20 shadow-md text-slate-50 hover:bg-purple-600 transition-color duration-300 cursor-pointer flex items-center justify-center bg-slate-50 rounded-lg";
    box.id = "box" + i;
    box.addEventListener("click", playerPicks);
    gameBoard.appendChild(box);
  }
}
function checkGame(currentPlayer) {
  const boxElement = [...gameBoard.children];
  const boxIds = boxElement.map((childElement) => childElement.textContent);

  const isEmpty = boxIds.some((obj) => obj === "");

  if (!isEmpty) {
    currentState = "Draw";
    return true;
  }
  return winningGrids.some((grid) => {
    return grid.every((index) => boxIds[index] === currentPlayer.marker);
  });
}

function resetGame() {
  const gameContainer = document.getElementById("game-container");
  const gameMode = document.getElementById("game-mode");
  const btnAgain = document.getElementById("again-btn");

  currentPlayer = player["playerOne"];
  currentMarker = player["playerOne"].marker;
  gameBoard.classList.remove("pointer-events-none");
  if (btnAgain) {
    gameStatus.textContent = "";
    btnAgain.parentElement.removeChild(btnAgain);
  }

  gameMode.textContent = playMode;
  menuContainer.classList.add("opacity-0");
  setTimeout(() => {
    menuContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden", "opacity-0");
  }, 300);
  const boxElement = [...gameBoard.children];
  const boxes = boxElement.forEach((box) => {
    box.textContent = "";
    box.classList.remove("bg-red-600", "bg-purple-600");
  });
  return game(currentPlayer);
}
function game(nextPlayer) {
  if (checkGame(currentPlayer)) return winner(currentPlayer);
  currentPlayer = nextPlayer;
  currentMarker = nextPlayer.marker;

  if (currentPlayer.name === "Computer" && playMode === "Player vs Computer") {
    return setTimeout(() => {
      computerPicks();
    }, 300);
  }
  return;
}

function playerPicks(box) {
  let index = box.target.id;
  const boxTarget = document.getElementById(index);

  if (boxTarget.textContent !== "") return;
  boxTarget.textContent = currentMarker;
  boxTarget.classList.remove("bg-slate-50");
  boxTarget.classList.add("text-5xl", "bg-purple-600");
  if (currentMarker === "X") {
    return game(player["playerTwo"]);
  }
  if (currentMarker === "O") {
    return game(player["playerOne"]);
  }
}

function computerPicks() {
  let rand = Math.floor(Math.random() * 9);
  const boxTarget = document.getElementById("box" + rand);
  if (boxTarget.textContent !== "") return computerPicks();
  boxTarget.textContent = player["playerTwo"].marker;
  boxTarget.classList.remove("bg-slate-50");
  boxTarget.classList.add("text-slate-50", "text-5xl", "bg-red-600");
  return game(player["playerOne"]);
}

function winner(currentPlayer) {
  gameBoard.classList.add("pointer-events-none");
  text.appendChild(againBtn);
  if (currentState === "Draw") {
    return (gameStatus.textContent = currentState);
  }
  gameStatus.textContent = currentPlayer.name + " wins!";
}

window.onload = () => {
  createBoard();
};
