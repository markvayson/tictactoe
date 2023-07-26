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
  const playerOne = createPlayer("Mark", "X");
  const playerTwo = createPlayer("Vayson", "O");
  let Turn = playerOne;
  const getHuman = () => playerTwo;
  const getBot = () => playerOne;
  let round = 1;
  const getRound = () => round;
  const getPlayerToMove = () => Turn;
  const setPlayerToMove = (player) => {
    Turn = player;
  };
  let mode;
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
    const isWinning = winningGrids.some((grid) => {
      return grid.every((index) => board[index] === player.marker);
    });
    return {
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
    getBot,
    getHuman,
  };
})();

const displayController = (() => {
  const gameStatus = document.getElementById("game-status");
  const resetButton = document.getElementById("reset-button");
  const titleContainer = document.getElementById("title-container");
  const gameContainer = document.getElementById("game-container");

  const playerTwoInput = document.getElementById("player-two");
  const playerOneInput = document.getElementById("player-one");
  let menu = true;
  const init = () => {
    createBoard();
    displayTexts();
    MakeAiMove();

    resetButton.addEventListener("click", resetBoard);
  };
  const MakeAiMove = () => {
    if (game.getPlayerToMove() !== game.getBot()) return;

    const boxes = document.querySelectorAll(".box");
    let { bestMove, bestScore } = game.findBestMove();

    if (bestScore === 0) {
      bestMove = Math.floor(Math.random() * gameBoard.getBoard().length);
    }
    console.log(bestScore);
    if (gameBoard.getBoard()[bestMove] !== "") return MakeAiMove();
    gameBoard.updateBoard(bestMove, game.getPlayerToMove().marker);
    boxes[bestMove].textContent = game.getPlayerToMove().marker;
    boxes[bestMove].classList.add("bg-red-500", "text-slate-50");
    boxes[bestMove].classList.remove("bg-slate-50");
    const { isWinning, isEmpty } = game.checkGame(game.getPlayerToMove());
    if (isWinning || isEmpty) {
      return displayWinner(isWinning, isEmpty);
    }
    return game.setPlayerToMove(game.getHuman());
  };

  const updatePlayers = () => {
    game.playerOne.name = playerOneInput.value;
    game.playerTwo.name = playerTwoInput.value;
    displayTexts();
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

    const { isWinning, isEmpty } = game.checkGame(game.getPlayerToMove());

    if (isWinning || isEmpty) {
      return displayWinner(isWinning, isEmpty);
    }
    gameStatus.textContent = `${game.getPlayerToMove().name}'s Turn (${
      game.getPlayerToMove().marker
    })`;
    game.setPlayerToMove(game.getBot());
    return setTimeout(() => {
      MakeAiMove();
    }, 1000);
  };

  const displayWinner = (winner, zeroBox) => {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
      box.classList.add("pointer-events-none");
    });
    if (zeroBox && !winner) {
      return (gameStatus.textContent = "It's a Draw!");
    }
    return (gameStatus.textContent = `${game.getPlayerToMove().name} wins!`);
  };

  const displayTexts = () => {
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    p1.textContent = game.playerOne.name;
    p2.textContent = game.playerTwo.name;
    gameStatus.textContent = `${game.getPlayerToMove().name}'s Turn (${
      game.getPlayerToMove().marker
    })`;
  };

  const resetBoard = () => {
    const boxElements = document.querySelectorAll(".box");
    boxElements.forEach((box) => {
      box.textContent = "";
      box.classList.remove(
        "bg-red-500",
        "bg-purple-500",
        "text-slate-50",
        "pointer-events-none"
      );
      box.classList.add("bg-slate-50");
    });
    gameBoard.resetBoard();

    game.setPlayerToMove(game.getBot());
    gameStatus.textContent = `${game.getPlayerToMove().name}'s Turn (${
      game.getPlayerToMove().marker
    })`;

    return setTimeout(() => {
      MakeAiMove();
    }, 1000);
  };

  return {
    showContainer,
  };
})();

const playBtn = document.getElementById("play-btn");
playBtn.addEventListener("click", () => displayController.showContainer());

displayController.showContainer();
