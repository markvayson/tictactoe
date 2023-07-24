const DEFAULT_SIZE = 9;
const DEFAULT_PLAYER = "X";
const gameBoard = document.getElementById("game-board");
const menu = document.getElementById("menu");
const text = document.getElementById("text");

let currentPlayer = DEFAULT_PLAYER;
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
  name: "Mark",
  mark: "X",
};

const computer = {
  name: "Computer",
  mark: "O",
};

function createBoard() {
  for (let i = 0; i < DEFAULT_SIZE; i++) {
    const box = document.createElement("div");
    box.className =
      "w-20 h-20 shadow-md hover:bg-purple-600 transition-color duration-300 cursor-pointer flex items-center justify-center bg-slate-50 rounded-lg";
    box.id = "box" + i;
    box.addEventListener("click", clickedBox);
    gameBoard.appendChild(box);
  }
}
function checkGame(currentPlayer) {
  const boxElement = [...gameBoard.children];
  const boxIds = boxElement.map((childElement) => childElement.textContent);

  return winningGrids.some((grid) => {
    return grid.every((index) => boxIds[index] === currentPlayer);
  });
}

function resetGame() {
  menu.classList.add("hidden", "opacity-0");
  gameBoard.classList.remove("hidden", "opacity-0");
  const boxElement = [...gameBoard.children];
  const boxes = boxElement.forEach((box) => {
    box.textContent = "";
  });
  game();
}
function game(nextPlayer) {
  if (checkGame(nextPlayer)) {
    return;
  }
  currentPlayer = nextPlayer.mark;
  console.log(currentPlayer);
  if (currentPlayer === computer.mark) return computerPicks();
}

function clickedBox(box) {
  if (currentPlayer !== player.mark) return;
  let index = box.target.id;
  const boxTarget = document.getElementById(index);
  if (boxTarget.textContent !== "") return;
  boxTarget.textContent = player.mark;
  boxTarget.className =
    "bg-purple-600 w-full h-full cursor-pointer text-slate-50 text-5xl rounded-lg justify-center items-center flex";

  return game(computer);
}

function computerPicks() {
  let rand = Math.floor(Math.random() * 9);

  const boxTarget = document.getElementById("box" + rand);
  if (boxTarget.textContent !== "") return computerPicks();
  boxTarget.textContent = computer.mark;
  boxTarget.className =
    "bg-red-600 w-full h-full  cursor-pointer text-slate-50 text-5xl rounded-lg justify-center items-center flex";

  return game(player);
}

function winner(currentPlayer) {
  gameBoard.classList.add("pointer-events-none");
  text.textContent = currentPlayer + " wins!";
}

window.onload = () => {
  createBoard();
};
