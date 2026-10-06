const board = document.getElementById("board");
const rollBtn = document.getElementById("rollBtn");
const restartBtn = document.getElementById("restartBtn");
const dice = document.getElementById("dice");
const diceResult = document.getElementById("dice-result");
const message = document.getElementById("message");
const turnText = document.getElementById("turn");
const position1 = document.getElementById("position1");
const position2 = document.getElementById("position2");

// Players
let players = [
    {
        name: "Player 1",
        position: 1,
        className: "player1-piece"
    },
    {
        name: "Player 2",
        position: 1,
        className: "player2-piece"
    }
];

let currentPlayer = 0;
let gameOver = false;

// Snakes
const snakes = {
    99: 54,
    95: 75,
    92: 88,
    74: 53,
    64: 60,
    62: 19,
    49: 11,
    47: 26,
    34: 1,
    16: 6
};

// Ladders
const ladders = {
    2: 38,
    7: 14,
    8: 31,
    15: 26,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    78: 98
};

// Dice faces
const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

// Create board
function createBoard() {

    board.innerHTML = "";

    // Create numbers 100 to 1
    for (let row = 9; row >= 0; row--) {

        let numbers = [];

        for (let col = 1; col <= 10; col++) {

            let number = row * 10 + col;

            numbers.push(number);
        }

        // Reverse every second row
        if ((9 - row) % 2 === 1) {
            numbers.reverse();
        }

        numbers.forEach(number => {

            const cell = document.createElement("div");

            cell.classList.add("cell");
            cell.id = `cell-${number}`;

            const numberElement = document.createElement("span");

            numberElement.classList.add("number");
            numberElement.textContent = number;

            cell.appendChild(numberElement);

            // Ladder
            if (ladders[number]) {
                cell.classList.add("ladder");

                const special = document.createElement("span");
                special.classList.add("special");
                special.textContent = "🪜";

                cell.appendChild(special);
            }

            // Snake
            if (snakes[number]) {
                cell.classList.add("snake");

                const special = document.createElement("span");
                special.classList.add("special");
                special.textContent = "🐍";

                cell.appendChild(special);
            }

            board.appendChild(cell);
        });
    }

    updatePlayers();
}

// Update player pieces
function updatePlayers() {

    // Remove old pieces
    document.querySelectorAll(".player").forEach(piece => {
        piece.remove();
    });

    players.forEach((player, index) => {

        const cell = document.getElementById(`cell-${player.position}`);

        if (cell) {

            const piece = document.createElement("div");

            piece.classList.add(
                "player",
                player.className
            );

            cell.appendChild(piece);
        }
    });

    position1.textContent = `Position: ${players[0].position}`;
    position2.textContent = `Position: ${players[1].position}`;
}

// Roll dice
rollBtn.addEventListener("click", () => {

    if (gameOver) return;

    rollBtn.disabled = true;

    dice.classList.add("rolling");

    let roll = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {

        dice.classList.remove("rolling");

        dice.textContent = diceFaces[roll - 1];

        diceResult.textContent = `You rolled ${roll}!`;

        movePlayer(roll);

    }, 600);
});

// Move player
function movePlayer(roll) {

    const player = players[currentPlayer];

    let newPosition = player.position + roll;

    // Cannot move above 100
    if (newPosition > 100) {

        message.textContent =
            `${player.name} needs an exact number to reach 100!`;

        changeTurn();

        return;
    }

    player.position = newPosition;

    updatePlayers();

    // Check ladder
    if (ladders[player.position]) {

        const oldPosition = player.position;

        player.position = ladders[player.position];

        message.textContent =
            `🪜 ${player.name} climbed from ${oldPosition} to ${player.position}!`;

        updatePlayers();
    }

    // Check snake
    else if (snakes[player.position]) {

        const oldPosition = player.position;

        player.position = snakes[player.position];

        message.textContent =
            `🐍 Oh no! ${player.name} fell from ${oldPosition} to ${player.position}!`;

        updatePlayers();
    }

    // Winner
    if (player.position === 100) {

        message.textContent =
            `🏆 ${player.name} wins the game!`;

        turnText.textContent = "🎉 Game Over!";

        gameOver = true;

        rollBtn.disabled = true;

        return;
    }

    changeTurn();
}

// Change player turn
function changeTurn() {

    currentPlayer = currentPlayer === 0 ? 1 : 0;

    turnText.textContent =
        `${players[currentPlayer].name}'s Turn`;

    if (!gameOver) {
        rollBtn.disabled = false;
    }
}

// Restart game
restartBtn.addEventListener("click", () => {

    players[0].position = 1;
    players[1].position = 1;

    currentPlayer = 0;
    gameOver = false;

    dice.textContent = "🎲";
    diceResult.textContent = "Roll the dice!";

    turnText.textContent = "Player 1's Turn";

    message.textContent =
        "Player 1, roll the dice to start!";

    rollBtn.disabled = false;

    updatePlayers();
});

// Start game
createBoard();