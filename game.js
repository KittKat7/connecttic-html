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

let winningTiles = []

let lastX = { x: -1, y: -1 };
let lastO = { x: -1, y: -1 };

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

function hasWon() {
	for (let x = 0; x < board.length; x++) {
		for (let y = 0; y < board[x].length; y++) {
			if (board[x][y] == "+") {
				continue;
			}
			if (x < board.length - 3 && (
				board[x][y].toLowerCase() == board[x + 1][y].toLowerCase() &&
				board[x][y].toLowerCase() == board[x + 2][y].toLowerCase() &&
				board[x][y].toLowerCase() == board[x + 3][y].toLowerCase())) {
				winningTiles = [
					{ x: x, y: y },
					{ x: x + 1, y: y },
					{ x: x + 2, y: y },
					{ x: x + 3, y: y }
				];
				return true;
			}

			if (x < board.length - 3 && y < board[x].length && (
				board[x][y].toLowerCase() == board[x + 1][y + 1].toLowerCase() &&
				board[x][y].toLowerCase() == board[x + 2][y + 2].toLowerCase() &&
				board[x][y].toLowerCase() == board[x + 3][y + 3].toLowerCase())) {
				winningTiles = [
					{ x: x, y: y },
					{ x: x + 1, y: y + 1 },
					{ x: x + 2, y: y + 2 },
					{ x: x + 3, y: y + 3 }
				];
				return true;
			}

			if (x < board.length - 3 && y < board[x].length && (
				board[x][y].toLowerCase() == board[x][y + 1].toLowerCase() &&
				board[x][y].toLowerCase() == board[x][y + 2].toLowerCase() &&
				board[x][y].toLowerCase() == board[x][y + 3].toLowerCase())) {
				winningTiles = [
					{ x: x, y: y },
					{ x: x, y: y + 1 },
					{ x: x, y: y + 2 },
					{ x: x, y: y + 3 }
				];
				return true;
			}
		}
	}
	return false;
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
	var a, b = -1;
	if (state == "PLAYERX") {
		a = lastX.x;
		b = lastX.y;
	} else if (state == "PLAYERO") {
		a = lastO.x;
		b = lastO.y;
	}

	if (a > -1) {
		for (var x = a - 1; x <= a + 1; x++) {
			if (x < 0 || x > 6)
				continue;
			for (var y = b - 1; y <= b + 1; y++) {
				if ((x == a && y == b) || y < 0 || y > 5)
					continue;
				drawBlocker(x, y);
			}
		}
	}

	for (var i = 0; i < winningTiles.length; i++) {
		drawWinner(winningTiles[i].x, winningTiles[i].y);
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
	ctx.strokeStyle = accentColor;
	ctx.fillStyle = accentColor;
	ctx.arc((x + 1) * scale - (scale / 2), (y + 1) * scale - (scale / 2), scale / 2, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}

function drawSmallO(x, y) {
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = accentColor;
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

function drawBlocker(x, y) {
	ctx.beginPath();

	ctx.lineWidth = scale * 0.2;
	ctx.strokeStyle = "#FF000099";

	ctx.rect(x * scale + scale * 0.1, y * scale + scale * 0.1, scale * 0.8, scale * 0.8)
	ctx.stroke();
}

function drawWinner(x, y) {
	ctx.beginPath();

	ctx.lineWidth = scale * 0.2;
	ctx.strokeStyle = "#00FF0099";

	ctx.rect(x * scale + scale * 0.1, y * scale + scale * 0.1, scale * 0.8, scale * 0.8)
	ctx.stroke();
}

function clearBoard() {
	for (var i = 0; i < 7; i++) {
		board[i] = [];
		for (var j = 0; j < 6; j++) {
			board[i][j] = "+";
		}
	}
}

function newGame() {
	state = "PLAYERX";
	clearBoard();
}

function isValidMove(x, y) {
	if (board[x][y] != "+")
		return false;

	var a, b = -1;

	if (state == "PLAYERX" && lastX.x >= 0) {
		a = lastX.x;
		b = lastX.y;
	}

	if (state == "PLAYERO" && lastX.x >= 0) {
		a = lastO.x;
		b = lastO.y;
	}

	if (a < 0)
		return true

	for (var x1 = a - 1; x1 <= a + 1; x1++) {
		if (x1 < 0 || x1 > 6)
			continue;
		for (var y1 = b - 1; y1 <= b + 1; y1++) {
			if ((x1 == a && y1 == b) || y1 < 0 || y1 > 5)
				continue;
			if (x1 == x && y1 == y)
				return false;
		}
	}
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
	console.log(isValidMove(c.x, c.y));
	if (!isValidMove(c.x, c.y))
		return;
	if (state == "PLAYERX") {
		if (lastX.x > -1)
			board[lastX.x][lastX.y] = "x";
		board[c.x][c.y] = "X";
		lastX.x = c.x;
		lastX.y = c.y;
		if (hasWon())
			state = "WINNERX";
		else
			state = "PLAYERO";
	}
	else if (state == "PLAYERO") {
		if (lastO.x > -1)
			board[lastO.x][lastO.y] = "o";
		board[c.x][c.y] = "O";
		lastO.x = c.x;
		lastO.y = c.y;
		if (hasWon())
			state = "WINNERO";
		else
			state = "PLAYERX";
	}

	drawTiles();
}, false);

// canvas.addEventListener('mousemove', function (e) {
// 	let c = getCoords(e);

// 	drawTiles();
// })

updateCanvasSize();

clear();
newGame();
drawTiles();




