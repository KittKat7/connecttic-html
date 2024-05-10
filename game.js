let canvas = document.getElementById("board");
let ctx = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

let scale = 0;

let backgroundColor = getComputedStyle(document.body).getPropertyValue('--background');
let foregroundColor = getComputedStyle(document.body).getPropertyValue('--foreground');
let accentColor = getComputedStyle(document.body).getPropertyValue('--accent');

let state = "HOME";

let board = [];

let lastX = { x: -1, y: -1 };
let lastY = { x: -1, y: -1 };

// Function to update canvas size
function updateCanvasSize() {
	if (window.innerWidth / 7 > window.innerHeight / 6)
		scale = window.innerHeight / 6;
	else
		scale = window.innerWidth / 7

	width = scale * 7;
	height = scale * 6;

	canvas.width = width;
	canvas.height = height;

	clear();
	drawTiles();
}

function clear() {
	ctx.beginPath();
	ctx.rect(-1, -1, width + 2, height + 2)
	ctx.fillStyle = foregroundColor;
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(1, 1, width - 2, height - 2);
	ctx.fill();
	ctx.stroke();
}

function drawTiles() {
	for (let w = 0; w < board.length; w++) {
		for (let h = 0; h < board[w].length; h++) {
			ctx.beginPath();
			if ((w % 2 == 0 && h % 2 == 0) || (w % 2 != 0 && h % 2 != 0)) {
				ctx.fillStyle = backgroundColor;
			} else {
				ctx.fillStyle = foregroundColor;
			}
			ctx.fillRect(w * scale, h * scale, scale, scale);
			ctx.stroke()

			if (board[w][h] == 'X') drawBigX(w, h);
			if (board[w][h] == 'x') drawSmallX(w, h);
			if (board[w][h] == 'O') drawBigO(w, h);
			if (board[w][h] == 'o') drawSmallO(w, h);
		}
	}
}

function drawBigX(x, y) {
	ctx.beginPath();

	ctx.lineWidth = scale * 0.2;
	ctx.strokeStyle = accentColor;

	ctx.moveTo(x * scale + scale * 0.1, y * scale + scale * 0.1);
	ctx.lineTo(x * scale + scale * 0.9, y * scale + scale * 0.9);

	ctx.moveTo(x * scale + scale * 0.1, y * scale + scale * 0.9);
	ctx.lineTo(x * scale + scale * 0.9, y * scale + scale * 0.1);
	ctx.stroke();
}

function drawSmallX(x, y) {
	ctx.beginPath();

	ctx.lineWidth = scale * 0.2;
	ctx.strokeStyle = accentColor;

	ctx.moveTo(x * scale + scale * 0.3, y * scale + scale * 0.3);
	ctx.lineTo(x * scale + scale * 0.7, y * scale + scale * 0.7);

	ctx.moveTo(x * scale + scale * 0.3, y * scale + scale * 0.7);
	ctx.lineTo(x * scale + scale * 0.7, y * scale + scale * 0.3);
	ctx.stroke();
}

function drawBigO(x, y) {
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.fillStyle = accentColor;
	ctx.arc((x + 1) * scale - (scale / 2), (y + 1) * scale - (scale / 2), scale / 2, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}

function drawSmallO(x, y) {
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.fillStyle = accentColor;
	ctx.arc((x + 1) * scale - (scale / 2), (y + 1) * scale - (scale / 2), scale / 4, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}

function drawSmallBox(x, y) {
	ctx.beginPath();
	ctx.fillStyle = accentColor;
	ctx.fillRect(x * scale, y * scale, scale, scale)
	ctx.fill();
	ctx.stroke();
}

function clearBoard() {
	for (var i = 0; i < 7; i++) {
		board[i] = [];
		for (var j = 0; j < 6; j++) {
			board[i][j] = "-";
		}
	}
}

function newGame() {
	state = "PLAYERX";
	clearBoard();
}

function isValidMove(x, y) {
	return true;
}

// Listen for window resize event
window.addEventListener('resize', function () {
	updateCanvasSize();
});

function getCoords(e) {
	// const rect = canvas.getBoundingClientRect();
	// const x = e.clientX - rect.left;
	// const y = e.clientY - rect.top;
	var x, y;

	x = e.offsetX;
	y = e.offsetY;
	return { x: Math.floor(x / scale), y: Math.floor(y / scale) };
}

canvas.addEventListener('click', function (e) {
	let c = getCoords(e);
	if (state == "PLAYERX") {
		if (isValidMove(c.x, c.y)) {
			if (lastX.x > -1)
				board[lastX.x][lastX.y] = "x";
			board[c.x][c.y] = "X";
			lastX.x = c.x;
			lastX.y = c.y;
		}
		state = "PLAYERO";
	}
	else if (state == "PLAYERO") {
		if (isValidMove(c.x, c.y)) {
			if (lastY.x > -1)
				board[lastY.x][lastY.y] = "o";
			board[c.x][c.y] = "O";
			lastY.x = c.x;
			lastY.y = c.y;
		}
		state = "PLAYERX";
	}

	drawTiles();
}, false);

canvas.addEventListener('mousemove', function (e) {
	let c = getCoords(e);

	drawTiles();
})

updateCanvasSize();

clear();
newGame();
drawTiles();




