'use strict';

const FLAG = '🚩';
var gIsSafeClick = false;
var safeClicksCount;
var gBoard;
var gFirstClick;
var gMines;
var gLives;
var gSize = 0;
var gHint;
var gHintCount;
var gIsManuallyPlacing = false;
var gCanPlace;
var gIs7Boom;
var gGame = {
isOn: true,
shownCount: 0,
markedCount: 0,
secsPassed: 0
}

function init(size = 4) {
    gIs7Boom = false;
    gIsManuallyPlacing = false;
    gCanPlace = true
    gHint = false;
    gHintCount = 3;
    safeClicksCount = 3
    document.querySelector('#safe span').innerText = safeClicksCount + ' Remaining';
    document.querySelector('#hint').innerText = gHintCount + ' Remaining';
    timePaused();
    resetTimer();
    gFirstClick = false;
    gMines = determineMinesCount(size);
    gLives = 3;
    gBoard = buildBoard(size);
    renderBoard();
    gSize = size ** 2;
    gGame.isOn = true;
    document.querySelector('h1 span').innerText = '😀'
    document.querySelector('h2 span').innerText = gLives

}

function determineMinesCount(size) {
    if (size === 8) gMines = 10;
    else if (size === 12) gMines = 20;
    else gMines = 2;
    return gMines;

}

function buildBoard(size = 4) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0, isShown: false, isMine: false,
                isMarked: false
            };


        }
    }
    return board;
}

function renderBoard() {
    var strHTML = '';
    var num = 0
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            var className = `cell cell${i}-${j}`;
            strHTML += `\t<td class="${className}"
                            onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="plantFlag(this, ${i}, ${j}); return false;"
                            data-num="${num++}" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    var elboard = document.querySelector('.board');
    elboard.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        // gameOver();
        return;
    }
    var elSmiley = document.querySelector('h1 span');
    if (gIsManuallyPlacing && !gFirstClick && gCanPlace) {
        menuallyPlaceMines(i, j);
        return;
    }
    if (!gFirstClick && gCanPlace && !gIs7Boom) {
        putBombs(i, j);
        startTimer();
        gFirstClick = true;
    }
    if (gHint && gHintCount > 0) {
        getHint(i, j);
        gHint = false;
        gHintCount--
        document.querySelector('#hint').innerText = gHintCount + ' Remaining';
        return;
    }
    if (gBoard[i][j].isMine) {
        gLives--;
        var elLives = document.querySelector('h2 span');
        elLives.innerText = gLives;
        if (gLives === 0) {
            elCell.style.backgroundColor = 'red';
            gGame.isOn = false;
            gameOver();
            timePaused()
            return;
        }
        elSmiley.innerText = '🤯';
        return;
    }
    reveal(i, j, elCell);
    elSmiley.innerText = '😀';
    if (checkVictory()) {
        // if player wins
        timePaused();
        elSmiley.innerText = '😎';
        alert('You win!!')
        gGame.isOn = false;
    }

}

function reveal(i, j, elSelectedCell) {
    gBoard[i][j].isShown = true;
    if (elSelectedCell) elSelectedCell.classList.add('shown');
    else {
        var elSelectedCell = document.querySelector(`.cell${i}-${j}`);
        elSelectedCell.classList.add('shown');
    }
    gBoard[i][j].minesAroundCount = setMinesNegsCount(i, j);
    if (gBoard[i][j].minesAroundCount === 0) {
        fullExpand(i, j)
    }
    elSelectedCell.innerText = setMinesNegsCount(i, j);

}

// puts the bombs on the board
function putBombs(i, j) {
    var remaingMines = gMines;
    while (remaingMines > 0) {
        var randI = getRandomInt(0, gBoard.length);
        var randj = getRandomInt(0, gBoard.length);
        // prevents from being at start location
        if (randI === i && randj === j) continue;
        else if (gBoard[randI][randj].isMine) continue
        else {
            gBoard[randI][randj].isMine = true;
            remaingMines--;
        }

    }

}

function gameOver() {
    gGame.isOn = false;
    var elSmiley = document.querySelector('h1 span');
    elSmiley.innerText = '😭';
    alert('You lost');
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
                var elMine = document.querySelector(`.cell${i}-${j}`)
                elMine.innerHTML = '<img src="images/mine.jpg">';

            }

        }

    }

}


function fullExpand(posI, posJ) {
    for (let i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (let j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === posI && j === posJ) continue;
            if (!gBoard[i][j].isMine && !gBoard[i][j].isShown) {
                reveal(i, j);
            }

        }

    }
}

function checkVictory() {
    var count = 0;
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine && gBoard[i][j].isMarked) count++;

        }

    }
    var isShowncount = 0
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isShown) isShowncount++

        }

    }
    return (count + isShowncount) === gSize;
}