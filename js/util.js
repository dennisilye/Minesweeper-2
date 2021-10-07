var gMarkedMines = 0;
const watch = document.querySelector("#stopwatch");
let millisecound = 0;
let timer;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function setMinesNegsCount(posI, posJ) {
    var count = 0;
    for (let i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (let j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === posI && j === posJ) continue;
            if (gBoard[i][j].isMine) count++;

        }

    }
    return count;

}

function plantFlag(elCell, i, j) {
    if (!gGame.isOn) return;
    if (elCell.innerText === FLAG && !gBoard[i][j].isShown) {
        gBoard[i][j].isMarked = false;
        elCell.innerText = ' ';
        return;

    }
    if (elCell.innerText) return;
    gMarkedMines++;
    gBoard[i][j].isMarked = true;
    elCell.innerText = FLAG;
    if (checkVictory()) {
        timePaused();
        document.querySelector('h1 span').innerText = '😎'
        alert('You win!');
        gGame.isOn = false;
    }

}

function startTimer() {
    watch.style.color = "black";
    clearInterval(timer);
    timer = setInterval(() => {
        millisecound += 10;

        let dateTimer = new Date(millisecound);

        watch.innerHTML =
            ('0' + dateTimer.getUTCHours()).slice(-2) + ':' +
            ('0' + dateTimer.getUTCMinutes()).slice(-2) + ':' +
            ('0' + dateTimer.getUTCSeconds()).slice(-2) + ':' +
            ('0' + dateTimer.getUTCMilliseconds()).slice(-3, -1);
    }, 10);
}

function resetTimer() {
    setInterval(timer)
    millisecound = 0;
    watch.innerHTML = "00:00:00:00";
}

function timePaused() {
    watch.style.color = "red";
    clearInterval(timer);
}

function safeClick() {
    getEmptyCell();
}





function getEmptyCell() {
    if (!gFirstClick) return;
    if (!gGame.isOn) return;
    if (safeClicksCount === 0) return
    safeClicksCount--;
    document.querySelector('#safe span').innerText = safeClicksCount + ' Remaining';
    var emptyCells = getEmptycells();
    if (!emptyCells.length) return;
    var randIdx = getRandomInt(0, emptyCells.length);
    var emptyCell = emptyCells[randIdx];
    gBoard[emptyCell.i][emptyCell.j].isShown = true
    document.querySelector(`.cell${emptyCell.i}-${emptyCell.j}`)
    reveal(emptyCell.i, emptyCell.j)

}

function getEmptycells() {
    var emptyCells = [];
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isShown) {
                emptyCells.push({ i, j });
            }

        }

    }
    return emptyCells;

}

function activateHintClick() {
    if (!gFirstClick) return;
    if (!gHintCount > 0) alert('You ran out of hints')
    gHint = true;
}

function getHint(posI, posJ) {
    for (let i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (let j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            var elCell = document.querySelector(`.cell${i}-${j}`);
            elCell.classList.add('shown');
            if (gBoard[i][j].isMine) {
                elCell.innerHTML = '<img src="images/mine.jpg">';
            }

        }

    }
    setTimeout(function () {
        for (let i = posI - 1; i <= posI + 1; i++) {
            if (i < 0 || i > gBoard.length - 1) continue;
            for (let j = posJ - 1; j <= posJ + 1; j++) {
                if (j < 0 || j > gBoard[0].length - 1) continue;
                var elCell = document.querySelector(`.cell${i}-${j}`);
                if (!elCell.innerText) elCell.classList.remove('shown');
                if (gBoard[i][j].isMine) {
                    elCell.innerHTML = '';
                }

            }

        }


    }, 1000)



}

function activateMenually() {
    if (gIsManuallyPlacing && !gFirstClick) {
        gCanPlace = false;
        
    } else alert('Click again to stop')
    gIsManuallyPlacing = true;
    
    
}

function menuallyPlaceMines(i, j) {
    gBoard[i][j].isMine = true;
    console.log('activated');

}

function activate7Boom() {
    if (gFirstClick) return;
    gFirstClick = true;
    gIs7Boom = true;
    var count = 0;
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            var currCell = document.querySelector(`[data-num="${count}"]`)
            console.log(currCell.dataset.num);
            if ((parseInt(currCell.dataset.num) + 1) % 7 === 0) {
                gBoard[i][j].isMine = true;
            } 
            count++
            
        }
        
    }

    
}