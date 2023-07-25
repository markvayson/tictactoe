const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const updateBoard = (index, marker) => {
    board[index] = marker;
  };
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    updateBoard,
    resetBoard,
  };
})();

const createPlayer = (name, marker) => {
  return {
    name,
    marker,
  };
};

const selectMode = (e) => {
  return (mode = e.target.textContent.trim());
};

const game = (() => {
  const modeBtns = document.querySelectorAll(".mode");
  modeBtns.forEach((mode) => {
    mode.addEventListener("click", selectMode);
  });
  const playWithComputer = document.getElementById("p2c");
  const playWithPlayer = document.getElementById("p2p");
  const playerOne = createPlayer("Mark", "X");
  const playerTwo = createPlayer("Vayson", "O");
  let currentPlayer = playerOne;

  const getCurrentPlayer = () => currentPlayer;
  const setCurrentPlayer = (player) => {
    currentPlayer = player;
  };
  let mode;
  console.log(mode);
  const winningGrids = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];

  const checkGame = () => {
    const board = gameBoard.getBoard();
    const emptyBoxCount = board.reduce((count, content) => {
      return count + (content === "" ? 1 : 0);
    }, 0);
    const isWinning = winningGrids.some((grid) => {
      return grid.every((index) => board[index] === currentPlayer.marker);
    });

    return {
      isWinning,
      isEmpty: emptyBoxCount === 0,
    };
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };
  return {
    playerOne,
    playerTwo,
    currentPlayer,
    checkGame,
    switchPlayer,
    getCurrentPlayer,
    setCurrentPlayer,
  };
})();

const displayController = (() => {
  const gameStatus = document.getElementById("game-status");
  const resetButton = document.getElementById("reset-button");

  const init = () => {
    createBoard();
    displayTexts();
    resetButton.addEventListener("click", resetBoard);
  };

  const createBoard = () => {
    const boxes = gameBoard.getBoard().length;
    const boardContainer = document.getElementById("board-container");
    for (let i = 0; i < boxes; i++) {
      const box = document.createElement("button");
      box.dataset.index = i;
      box.className =
        "box bg-slate-50 w-28 h-28 transition-color duration-300 rounded-xl border border-gray-300 shadow-md text-5xl";
      box.addEventListener("click", playerClickedBox);
      boardContainer.appendChild(box);
    }
  };

  const playerClickedBox = (e) => {
    const box = e.target;
    gameBoard.updateBoard(box.dataset.index, game.getCurrentPlayer().marker);

    if (box.textContent !== "") return;
    box.textContent = game.getCurrentPlayer().marker;
    box.classList.remove("bg-slate-50");
    if (game.getCurrentPlayer().marker === "X") {
      box.classList.add("bg-red-500", "text-slate-50");
    } else {
      box.classList.add("bg-purple-500", "text-slate-50");
    }
    const { isWinning, isEmpty } = game.checkGame();
    if (isWinning || isEmpty) {
      return displayWinner(isEmpty);
    }
    game.switchPlayer();
    gameStatus.textContent = `${game.getCurrentPlayer().name}'s Turn (${
      game.getCurrentPlayer().marker
    })`;
  };

  const displayWinner = (zeroBox) => {
    if (zeroBox) {
      return (gameStatus.textContent = "It's a Draw!");
    }
    return (gameStatus.textContent = `${game.getCurrentPlayer().name} wins!`);
  };

  const displayTexts = () => {
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    p1.textContent = game.playerOne.name;
    p2.textContent = game.playerTwo.name;
    gameStatus.textContent = `${game.currentPlayer.name}'s Turn (${game.currentPlayer.marker})`;
  };

  const resetBoard = () => {
    const boxElements = document.querySelectorAll(".box");
    boxElements.forEach((box) => {
      box.textContent = "";
      box.classList.remove("bg-red-500", "bg-purple-500", "text-slate-50");
      box.classList.add("bg-slate-50");
    });

    gameBoard.resetBoard();

    game.setCurrentPlayer(game.playerOne);
    gameStatus.textContent = `${game.currentPlayer.name}'s Turn (${game.currentPlayer.marker})`;
  };

  return {
    init,
  };
})();

displayController.init();
