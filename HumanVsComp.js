let boxes = document.querySelectorAll(".boxes");
let reset = document.querySelector("#reset");
let news = document.querySelector("#new");
let msgBox = document.querySelector(".cont");
let msg = document.querySelector("#msg");
let vs = document.querySelector("#vs");

let vsHuman = true;

vs.addEventListener("click", () => {
    vsHuman = !vsHuman;
    alert(`Playing against ${vsHuman ? "Human" : "Computer"}`);
    resetGame();
});

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

let turnX = true;
let count = 0;

const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

const enableBoxes = () => {
    boxes.forEach(box => box.disabled = false);
};

const resetGame = () => {
    turnX = true;
    count = 0;
    enableBoxes();
    boxes.forEach(box => box.innerText = "");
    msgBox.classList.add("hide");
    reset.disabled = false;
};

const draw = () => {
    if (count === 9) {
        msg.innerText = "The game has drawn, start a new one!";
        msgBox.classList.remove("hide");
        disableBoxes();
        reset.disabled = true;
    }
};

news.addEventListener("click", resetGame);
reset.addEventListener("click", resetGame);

const showWinner = (pos1) => {
    msg.innerText = `Congratulations, the winner is ${pos1}`;
    msgBox.classList.remove("hide");
    disableBoxes();
    reset.disabled = true;
};

const checkWinner = (board, player) => {
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
};

const minimax = (newBoard, player) => {
    const availableSpots = newBoard.filter(s => typeof s === 'number');

    if (checkWinner(newBoard, "O")) {
        return { score: 10 };
    } else if (checkWinner(newBoard, "X")) {
        return { score: -10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;

        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
};

const computerMove = () => {
    let newBoard = Array.from(boxes).map((box, i) => box.innerText === "" ? i : box.innerText);
    let bestSpot = minimax(newBoard, "O").index;
    boxes[bestSpot].innerText = "O";
    boxes[bestSpot].style.color = "blue";
    boxes[bestSpot].disabled = true;
    count++;
    newBoard[bestSpot] = "O";  // Update the board with the computer's move
    if (checkWinner(newBoard, "O")) {
        showWinner("O");
    } else if (count < 9) {
        draw();
    }
};

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (box.innerText === "" && !box.disabled) {
            if (vsHuman) {
                box.innerText = turnX ? "X" : "O";
                box.style.color = turnX ? "red" : "blue";
                box.disabled = true;
                count++;
                let currentBoard = Array.from(boxes).map(box => box.innerText);
                if (checkWinner(currentBoard, turnX ? "X" : "O")) {
                    showWinner(turnX ? "X" : "O");
                } else {
                    draw();
                    turnX = !turnX;
                }
            } else {
                if (turnX) {
                    box.innerText = "X";
                    box.style.color = "red";
                    box.disabled = true;
                    count++;
                    let currentBoard = Array.from(boxes).map(box => box.innerText);
                    if (checkWinner(currentBoard, "X")) {
                        showWinner("X");
                    } else if (count < 9) {
                        computerMove();
                    } else {
                        draw();
                    }
                }
            }
        }
    });
});
