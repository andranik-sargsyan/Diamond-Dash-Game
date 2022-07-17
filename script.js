let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let options = {
    width: 9,
    height: 9,
    colors: ["red", "green", "blue", "yellow", "purple"],
    bonuses: ["cross", "bang"]
};

options.sizeX = canvas.width / options.width;
options.sizeY = canvas.height / options.height;

let board;

function reset() {
    board = [];

    for (let i = 0; i < options.height; i++) {
        let row = [];

        for (let j = 0; j < options.width; j++) {
            row.push({
                type: "color",
                color: options.colors[getRandomInt(options.colors.length)]
            });
        }

        board.push(row);
    }
}

function draw() {
    ctx.strokeStyle = "gray";

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].type == "color") {
                ctx.fillStyle = board[i][j].color || "white";
                ctx.fillRect(j * options.sizeX, i * options.sizeY, options.sizeX, options.sizeY);
            }
            else if (board[i][j].type == "bonus") {
                ctx.fillStyle = "white";
                ctx.fillRect(j * options.sizeX, i * options.sizeY, options.sizeX, options.sizeY);

                ctx.fillStyle = "black";
                ctx.font = "25px Arial";
                ctx.fillText(board[i][j].bonus == "bang" ? "B" : "C", j * options.sizeX + options.sizeX / 3, i * options.sizeY + options.sizeY / 2 + 8);
            }
            else {
                ctx.fillStyle = "white";
                ctx.fillRect(j * options.sizeX, i * options.sizeY, options.sizeX, options.sizeY);
            }

            ctx.strokeRect(j * options.sizeX, i * options.sizeY, options.sizeX, options.sizeY);
        }
    }
}

function findAndRemove(row, col, color) {
    erase(row, col);

    if (col > 0 && board[row][col - 1].type && board[row][col - 1].color == color) {
        findAndRemove(row, col - 1, color);
    }

    if (row > 0 && board[row - 1][col].type && board[row - 1][col].color == color) {
        findAndRemove(row - 1, col, color);
    }

    if (col < options.width - 1 && board[row][col + 1].type && board[row][col + 1].color == color) {
        findAndRemove(row, col + 1, color);
    }

    if (row < options.height - 1 && board[row + 1][col].type && board[row + 1][col].color == color) {
        findAndRemove(row + 1, col, color);
    }
}

function processBonus(row, col) {
    if (board[row][col].bonus == "bang") {
        erase(row, col);

        if (col > 0) {
            erase(row, col - 1);
        }

        if (row > 0) {
            erase(row - 1, col);
        }

        if (col < options.width - 1) {
            erase(row, col + 1);
        }

        if (row < options.height - 1) {
            erase(row + 1, col);
        }

        if (col > 0 && row > 0) {
            erase(row - 1, col - 1);
        }

        if (row > 0 && col < options.width - 1) {
            erase(row - 1, col + 1);
        }

        if (col < options.width - 1 && row < options.height - 1) {
            erase(row + 1, col + 1);
        }

        if (col > 0 && row < options.height - 1) {
            erase(row + 1, col - 1);
        }
    }
    else if (board[row][col].bonus == "cross") {
        for (var i = 0; i < options.height; i++) {
            erase(i, col);
        }

        for (var j = 0; j < options.width; j++) {
            erase(row, j);
        }
    }
}

function moveItemsDown() {
    for (let j = 0; j < options.width; j++) {
        let items = [];

        for (let i = options.height - 1; i >= 0; i--) {
            if (board[i][j].type) {
                items.push({
                    type: board[i][j].type,
                    color: board[i][j].color,
                    bonus: board[i][j].bonus
                });

                erase(i, j);
            }
        }

        for (let k = 0; k < items.length; k++) {
            board[options.height - 1 - k][j].color = items[k].color;
            board[options.height - 1 - k][j].bonus = items[k].bonus;
            board[options.height - 1 - k][j].type = items[k].type;
        }
    }
}

function fillNewItems() {
    for (let i = 0; i < options.height; i++) {
        for (let j = 0; j < options.width; j++) {
            if (!board[i][j].type) {
                let num = getRandomInt(50);

                if (num < 45) {
                    board[i][j].type = "color";

                    board[i][j].color = options.colors[getRandomInt(options.colors.length)];
                }
                else {
                    board[i][j].type = "bonus";

                    if (num < 49) {
                        board[i][j].bonus = "bang";
                    }
                    else {
                        board[i][j].bonus = "cross";
                    }
                }
            }
        }
    }
}

function erase(i, j) {
    board[i][j].type = undefined;
}

canvas.addEventListener("click", e => {
    let row = Math.floor(e.offsetY / options.sizeY);
    let col = Math.floor(e.offsetX / options.sizeX);

    if (row == -1 || row == options.height || col == -1 || col == options.width) {
        return;
    }

    if (board[row][col].type == "color") {
        findAndRemove(row, col, board[row][col].color);
    }
    if (board[row][col].type == "bonus") {
        processBonus(row, col);
    }

    moveItemsDown();
    fillNewItems();

    draw();
});

reset();
draw();
