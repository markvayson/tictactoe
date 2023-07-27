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

const createPlayer = (name, marker, type) => {
  return {
    name,
    marker,
  };
};

const game = (() => {
  const playerOne = createPlayer("Ai", "X");
  const playerTwo = createPlayer("Player", "O");
  let Turn = playerOne;
  const getHuman = () => playerTwo;
  const getBot = () => playerOne;
  let round = 1;
  const getRound = () => round;
  const resetRound = () => (round = 0);
  const getPlayerToMove = () => Turn;
  const setPlayerToMove = (player) => {
    Turn = player;
    round++;
  };
  let mode = "Easy";
  const getMode = () => mode;
  const setMode = (difficulty) => (mode = difficulty);
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

  const checkGame = (player) => {
    const board = gameBoard.getBoard();
    const emptyBoxCount = board.reduce((count, content) => {
      return count + (content === "" ? 1 : 0);
    }, 0);
    let winningGrid;
    const isWinning = winningGrids.some((grid) => {
      const isWinningGrid = grid.every(
        (index) => board[index] === player.marker
      );
      if (isWinningGrid) winningGrid = grid;
      return isWinningGrid;
    });
    return {
      winningGrid,
      isWinning,
      isEmpty: emptyBoxCount === 0,
    };
  };

  const findBestMove = () => {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < gameBoard.getBoard().length; i++) {
      if (gameBoard.getBoard()[i] === "") {
        gameBoard.updateBoard(i, getBot().marker);
        const score = minimax(gameBoard.getBoard(), 0, false, getBot());
        gameBoard.updateBoard(i, "");
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return {
      bestMove,
      bestScore,
    };
  };

  const minimax = (board, depth, isMaximizing, player) => {
    scores = {
      X: 1,
      O: -1,
      draw: 0,
    };
    const result = checkGame(player);
    if (result.isWinning) return scores[player.marker];
    if (result.isEmpty) return scores["draw"];
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = getBot().marker;
          const score = minimax(board, depth + 1, false, getBot());
          board[i] = "";
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = getHuman().marker;
          const score = minimax(board, depth + 1, true, getHuman());
          board[i] = "";
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  };
  return {
    playerOne,
    playerTwo,
    checkGame,
    getPlayerToMove,
    setPlayerToMove,
    findBestMove,
    getRound,
    resetRound,
    getBot,
    getHuman,
    getMode,
    setMode,
  };
})();

const displayController = (() => {
  const resetButton = document.getElementById("reset-button");
  const titleContainer = document.getElementById("title-container");
  const gameContainer = document.getElementById("game-container");
  const modeBtns = document.querySelectorAll(".mode-button");

  let menu = true;
  const init = () => {
    createBoard();
    displayTexts();
    MakeAiMove();
    modeBtns.forEach((mode) => {
      mode.addEventListener("click", () => changeMode(mode));
    });
    resetButton.addEventListener("click", resetBoard);
  };
  const changeMode = (mode) => {
    if (game.getMode() === mode.textContent.trim()) return;
    game.setMode(mode.textContent.trim());
    modeBtns.forEach((item) =>
      item.classList.remove("bg-green-500", "text-slate-50")
    );
    mode.classList.add("bg-green-500", "text-slate-50");
    resetBoard();
  };
  const inputValid = () => {
    return playerOneInput.value !== "" || playerTwoInput.value !== "";
  };
  const showContainer = () => {
    // if (!inputValid()) return;
    if (menu) {
      titleContainer.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      menu = false;
    } else {
      titleContainer.classList.remove("hidden");
      gameContainer.classList.add("hidden");
      menu = true;
    }

    return init();
  };

  const createBoard = () => {
    const boxes = gameBoard.getBoard().length;
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    p1.textContent = game.playerOne.name;
    p2.textContent = game.playerTwo.name;
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

  const MakeAiMove = () => {
    if (game.getPlayerToMove() !== game.getBot()) return;
    const boxes = document.querySelectorAll(".box");
    let { bestMove, bestScore } = game.findBestMove();
    if (
      game.getMode() === "Easy" ||
      (game.getMode() === "Normal" && bestScore === 0)
    ) {
      bestMove = Math.floor(Math.random() * gameBoard.getBoard().length);
    }
    if (game.getMode() === "Hard" && game.getRound() === 1) {
      const desiredMoves = [0, 2, 6, 8];
      const randomIndex = Math.floor(Math.random() * desiredMoves.length);
      bestMove = desiredMoves[randomIndex];
    }
    if (gameBoard.getBoard()[bestMove] !== "") return MakeAiMove();
    gameBoard.updateBoard(bestMove, game.getPlayerToMove().marker);
    boxes[bestMove].textContent = game.getPlayerToMove().marker;
    boxes[bestMove].classList.add("bg-red-500", "text-slate-50");
    boxes[bestMove].classList.remove("bg-slate-50");

    if (!displayTexts()) {
      return game.setPlayerToMove(game.getHuman());
    }

    return;
  };
  const playerClickedBox = (e) => {
    if (game.getPlayerToMove() === game.getBot()) return;

    const box = e.target;

    if (box.textContent !== "") return;
    gameBoard.updateBoard(box.dataset.index, game.getPlayerToMove().marker);

    box.textContent = game.getPlayerToMove().marker;
    box.classList.remove("bg-slate-50");
    if (game.getPlayerToMove().marker === "X") {
      box.classList.add("bg-red-500", "text-slate-50");
    } else {
      box.classList.add("bg-purple-500", "text-slate-50");
    }
    if (!displayTexts()) {
      game.setPlayerToMove(game.getBot());
      return setTimeout(() => {
        MakeAiMove();
      }, 300);
    }
    return;
  };

  const displayTexts = () => {
    const { winningGrid, isWinning, isEmpty } = game.checkGame(
      game.getPlayerToMove()
    );
    const turnTexts = document.querySelectorAll(".turn-text");

    const boxElements = document.querySelectorAll(".box");
    if (winningGrid !== undefined) {
      let selectedBoxes = winningGrid.map((index) => boxElements[index]);
      selectedBoxes.forEach((box) => {
        box.classList.remove("bg-red-500", "bg-purple-500");
        box.classList.add("bg-green-500");
      });
    }
    if (isWinning) {
      boxElements.forEach((box) => box.classList.add("pointer-events-none"));
      if (game.getPlayerToMove() === game.getBot()) {
        turnTexts[1].textContent = "";

        return (turnTexts[0].textContent = "wins!");
      } else {
        turnTexts[0].textContent = "";
        return (turnTexts[1].textContent = "wins!");
      }
    }
    if (isEmpty) {
      boxElements.forEach((box) => {
        box.classList.remove("bg-red-500","bg-purple-500","bg-slate-50")
        box.classList.add("pointer-events-none","bg-green-500")});
      turnTexts[0].textContent = "";
      turnTexts[1].textContent = "";
      return (turnTexts[2].textContent = "Draw!");
    }
    if (game.getPlayerToMove() === game.getHuman()) {
      turnTexts[0].textContent = "turn";
      turnTexts[1].textContent = "";
    } else {
      turnTexts[1].textContent = "turn";
      turnTexts[0].textContent = "";
    }
    return isWinning || isEmpty;
  };

  const resetBoard = () => {
    const boxElements = document.querySelectorAll(".box");
    const turn = document.querySelectorAll(".turn-text");

    turn.forEach((text) => (text.textContent = ""));
    boxElements.forEach((box) => {
      box.textContent = "";
      box.classList.remove(
        "bg-red-500",
        "bg-purple-500",
        "bg-green-500",
        "text-slate-50",
        "pointer-events-none"
      );
      box.classList.add("bg-slate-50");
    });
    gameBoard.resetBoard();
    game.resetRound();
    game.setPlayerToMove(game.getBot());

    return MakeAiMove();
  };

  return {
    showContainer,
  };
})();

const playBtn = document.getElementById("play-btn");
playBtn.addEventListener("click", () => displayController.showContainer());

displayController.showContainer();
