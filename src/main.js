const DEFAULT_SIZE = 9;
const DEFAULT_MODE = "Player vs Computer";
const DEFAULT_PLAYERONE = "Mark";
const DEFAULT_PLAYERTWO = "Computer";

const gameBoard = document.getElementById("game-board");
const gameMode = document.getElementById("game-mode");
const gameContainer = document.getElementById("game-container");

const menuContainer = document.getElementById("menu-container");
const text = document.getElementById("text");
const playvsComputer = document.getElementById("playvs-computer");
playvsComputer.addEventListener("click", showInputForm);
const playvsPlayer = document.getElementById("playvs-player");
playvsPlayer.addEventListener("click", showInputForm);
const submitNameBtn = document.getElementById("submit-name");
submitNameBtn.addEventListener("click", getNames);
const gameStatus = document.getElementById("game-status");
const againBtn = document.getElementById("again-btn");
const endMenu = document.getElementById("end-menu");
const end = document.getElementById("end");
const inputName = document.getElementById("input-name");
const menu = document.getElementById("menu");

againBtn.addEventListener("click", resetGame);
endMenu.addEventListener("click", () => {
  isMenu = false;
  showMenu();
});

let playMode = DEFAULT_MODE;
let currentMarker = "X";
let currentState;
let isMenu = true;

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
    type: "human",
  },
  playerTwo: {
    name: DEFAULT_PLAYERTWO,
    marker: "O",
    type: "npc",
  },
};

let currentPlayer = player["playerOne"];

function getNames() {
  const One = document.getElementById("player-one");
  const Two = document.getElementById("player-two");
  const inputName = document.getElementById("input-name");
  const p1 = document.getElementById("p1");
  const p2 = document.getElementById("p2");
  const pError = document.createElement("p");
  pError.className = "text-red-300 absolute -bottom-5";
  pError.textContent = "Please add a name";

  if (One.value === "") {
    return inputName.appendChild(pError);
  }
  player["playerOne"].name = One.value;
  if (playMode === "Player vs Player") {
    if (One.value === "" || Two.value === "") {
      return inputName.appendChild(pError);
    }
    player["playerTwo"].name = Two.value;
  }
  p1.textContent = player["playerOne"].name;
  p2.textContent = player["playerTwo"].name;
  resetGame();
}

function showMenu() {
  if (isMenu) {
    menuContainer.classList.add("opacity-0");
    setTimeout(() => {
      menuContainer.classList.add("hidden");
      gameContainer.classList.remove("hidden", "opacity-0");
    }, 300);
    return (isMenu = false);
  }
  if (!isMenu) {
    gameContainer.classList.add("opacity-0");
    setTimeout(() => {
      gameContainer.classList.add("hidden");
      menuContainer.classList.remove("hidden", "opacity-0");
      menu.classList.remove("opacity-0", "hidden");

      inputName.classList.add("hidden");
    }, 300);
    return (isMenu = true);
  }
}
function showInputForm(mode) {
  playMode = mode.target.textContent.trim();

  console.log(playMode);
  const playerTwo = document.getElementById("second-player");
  playerTwo.classList.remove("hidden");
  player["playerTwo"].type = "human";
  menu.classList.add("opacity-0");
  setTimeout(() => {
    menu.classList.add("hidden");
    inputName.classList.remove("hidden");
  }, 300);
  if (playMode === "Player vs Computer") {
    player["playerTwo"].type = "npc";
    player["playerTwo"].name = "Computer";
    playerTwo.classList.add("hidden");
  }
}

function createBoard() {
  for (let i = 0; i < DEFAULT_SIZE; i++) {
    const box = document.createElement("div");
    box.className =
      "w-20 h-20 shadow-md text-slate-50 transition-color duration-300 cursor-pointer flex items-center justify-center bg-slate-50 rounded-lg";
    box.id = "box" + i;
    box.addEventListener("click", playerPicks);
    gameBoard.appendChild(box);
  }
}
function checkGame(currentPlayer) {
  const boxElement = [...gameBoard.children];
  const boxIds = boxElement.map((childElement) => childElement.textContent);

  const isEmpty = boxIds.some((obj) => obj === "");
  const isWinning = winningGrids.some((grid) => {
    return grid.every((index) => boxIds[index] === currentPlayer.marker);
  });

  if (!isEmpty) {
    if (!isWinning) {
      currentState = "Draw";
    }
    return true;
  }
  return isWinning;
}
function resetGame() {
  currentState = "";
  currentPlayer = player["playerOne"];
  currentMarker = player["playerOne"].marker;
  gameBoard.classList.remove("pointer-events-none");
  gameStatus.classList.add("opacity-0");
  end.classList.add("hidden");
  isMenu = true;
  showMenu();
  const boxElement = [...gameBoard.children];
  const boxes = boxElement.forEach((box) => {
    box.textContent = "";
    box.classList.remove("bg-red-600", "bg-purple-600");
    box.classList.add("bg-slate-50");
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
  if (currentPlayer.type === "npc") return;
  let index = box.target.id;
  const boxTarget = document.getElementById(index);

  if (boxTarget.textContent !== "") return;
  boxTarget.textContent = currentMarker;
  boxTarget.classList.remove("bg-slate-50");
  if (currentMarker === "X") {
    boxTarget.classList.add("text-5xl", "bg-purple-600", "font-bold");
    return game(player["playerTwo"]);
  }
  if (currentMarker === "O" && player["playerTwo"].type === "human") {
    boxTarget.classList.add("text-5xl", "bg-red-600", "font-bold");
    return game(player["playerOne"]);
  }
}

function computerPicks() {
  let rand = Math.floor(Math.random() * 9);
  const boxTarget = document.getElementById("box" + rand);
  if (boxTarget.textContent !== "") return computerPicks();
  boxTarget.textContent = player["playerTwo"].marker;
  boxTarget.classList.remove("bg-slate-50");
  boxTarget.classList.add(
    "text-slate-50",
    "text-5xl",
    "bg-red-600",
    "font-bold"
  );
  return game(player["playerOne"]);
}

function winner(currentPlayer) {
  console.log(currentState);
  gameBoard.classList.add("pointer-events-none");
  end.classList.remove("hidden");
  gameStatus.classList.remove("opacity-0");
  if (currentState === "Draw") {
    return (gameStatus.textContent = currentState);
  }
  gameStatus.textContent = currentPlayer.name + " wins!";
}

window.onload = () => {
  createBoard();
};
