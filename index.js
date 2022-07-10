const board = document.querySelector('.board');
const cellElem = document.querySelectorAll('[data-cell]');
const winMessageArea = document.querySelector('.winning-message');
const winMessageText = document.querySelector('.winning-text');
const restartBtn = document.querySelector('.restartButton');
const resetBtn = document.querySelector('.resetBtn');
const newGameBtn = document.querySelector('.newGame');
const scoreX = document.querySelector('.scorex');
const scoreO = document.querySelector('.scoreo');
const scoreTies = document.querySelector('.ties');

const clickAudio = new Audio('assets/audio/click.mp3');
clickAudio.playbackRate = 2;
const newGameAudio = new Audio('assets/audio/new_game.mp3');
const resetScoreAudio = new Audio('assets/audio/reset_score.mp3');

const xClass = 'x';
const circleClass = 'circle';
const winComb = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let countTurns = 0;
let circleTurn;
let countWinX = 0;
let countWinO = 0;
let countTies = 0;

const swapMove = () => circleTurn = !circleTurn;

const addMark = (currentCell, currentClass) => {
    currentCell.classList.add(currentClass);
    clickAudio.play();
}

const checkWin = (currentClass) => {
    return winComb.some(comb => comb.every(i => cellElem[i].classList.contains(currentClass)))
};

const isTie = () => {
    return [...cellElem].every(cell => cell.classList.contains(xClass) || cell.classList.contains(circleClass))
};

const setHover = () => {
    board.classList.remove(xClass);
    board.classList.remove(circleClass);
    if (circleTurn) { board.classList.add(circleClass) }
    else { board.classList.add(xClass) }
};

const startGame = () => {
    localStorage.countTiesScore !== undefined ? scoreTies.innerHTML = localStorage.countTiesScore : scoreTies.innerHTML = '0';
    localStorage.countXScore !== undefined ? scoreX.innerHTML = localStorage.countXScore : scoreX.innerHTML = '0';
    localStorage.countCircleScore !== undefined ? scoreO.innerHTML = localStorage.countCircleScore : scoreO.innerHTML = '0';
    circleTurn = false;
    countTurns = 0;
    cellElem.forEach(cell => {
        cell.classList.remove(xClass);
        cell.classList.remove(circleClass);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    })
    setHover();
    winMessageArea.classList.remove('show');
};

const endGame = (tie, countTurns) => {
    if (tie) {
        winMessageText.innerText = "It's a tie!";
        countTies++;
        localStorage.countTiesScore = countTies;
        scoreTies.innerHTML = localStorage.countTiesScore;
    }
    else if (circleTurn) {
        winMessageText.innerText = `O's won on move ${countTurns}!`;
        countWinO++;
        localStorage.countCircleScore = countWinO;
        scoreO.innerHTML = localStorage.countCircleScore;
    }
    else if (!circleTurn) {
        winMessageText.innerText = `X's won on move ${countTurns}!`;
        countWinX++;
        localStorage.countXScore = countWinX;
        scoreX.innerHTML = localStorage.countXScore;
    }
    winMessageArea.classList.add('show');
};

const handleClick = (e) => {
    countTurns++;
    const currentCell = e.target;
    const currentClass = circleTurn ? circleClass : xClass;
    addMark(currentCell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false, countTurns);
    }
    else if (isTie()) { endGame(true) }
    else {
        swapMove();
        setHover();
    }
};

const runAudio = () => {
    resetScoreAudio.load();
    resetScoreAudio.play();
};

const reset = () => {
    delete localStorage.countTiesScore;
    delete localStorage.countXScore;
    delete localStorage.countCircleScore;
    location.reload();
};

restartBtn.addEventListener('click', () => {
    newGameAudio.play();
    startGame();
});
newGameBtn.addEventListener('click', () => {
    newGameAudio.play();
    startGame();
});
resetBtn.addEventListener('click', () => {
    reset();

});

startGame();
window.onload(runAudio());