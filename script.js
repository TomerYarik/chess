const board = document.querySelector('.container');
let player = 0;

function createCell(color) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.cssText = `background:${color};`;
    return cell;
}

function putPieces(cell, i, j) {
    let image = document.createElement('img');
    if(i === 6 || i === 1) {
        image.src = `./picess/${ i === 6 ? 'B' : 'W'}P.png`;
        image.classList.add(`${i === 6 ? 'black' : 'white'}`);
        image.classList.add('pawn');
        cell.appendChild(image);
    }
    if(i === 0 || i === 7) {
        if(j===0 || j===7) {
            image.src = `./picess/${ i === 7 ? 'B' : 'W'}R.png`;
            image.classList.add(`${i === 7 ? 'black' : 'white'}`);
            image.classList.add('rook');
            cell.appendChild(image);
        }
        else if(j===1 || j===6) {
            image.src = `./picess/${ i === 7 ? 'B' : 'W'}Kn.png`;
            image.classList.add(`${i === 7 ? 'black' : 'white'}`);
            image.classList.add('knight');
            cell.appendChild(image);
        }
        else if(j ===2 || j === 5) {
            image.src = `./picess/${ i === 7 ? 'B' : 'W'}Bish.png`;
            image.classList.add(`${i === 7 ? 'black' : 'white'}`);
            image.classList.add('bishop');
            cell.appendChild(image);
        }
        else if(j === 3) {
            image.src = `./picess/${ i === 7 ? 'B' : 'W'}Q.png`;
            image.classList.add(`${i === 7 ? 'black' : 'white'}`);
            image.classList.add('queen');
            cell.appendChild(image);
        }
        else if(j === 4) {
            image.src = `./picess/${ i === 7 ? 'B' : 'W'}K.png`;
            image.classList.add(`${i === 7 ? 'black' : 'white'}`);
            image.classList.add('king');
            cell.appendChild(image);
        }
    }
}

function setPositionLetter(i) {
    let letter;
    if(i===7) letter = 'h';
    else if(i === 6) letter = 'g';
    else if(i===5) letter = 'f';
    else if(i===4) letter = 'e';
    else if(i===3) letter = 'd';
    else if(i===2) letter = 'c';
    else if(i===1) letter = 'b';
    else if(i===0) letter = 'a';
    return letter;
}

function createBoard() {
    let arr = [];
    let id = 1;
    let colorIndicator = 0;
    for(let i=7; i>=0;i--){
        let line = [];
        for(let j=0;j<8;j++) {
            const color = colorIndicator === 0 ? 'AntiqueWhite' : 'Sienna';
            const cell = createCell(color);
            const currentLetter = setPositionLetter(j);
            cell.classList.add(`${currentLetter}`);
            cell.classList.add(`${i+1}`);
            if(i===0 || i===1 || i===6 || i===7) putPieces(cell, i, j);
            line.push(cell);
            colorIndicator === 0 ? colorIndicator++ : colorIndicator--;
        }
        arr.push(line);
        colorIndicator === 0 ? colorIndicator++ : colorIndicator--;
    }
    for(const array of arr) {
        for(const cell of array) {
            board.appendChild(cell);
        }
    }
}

function returnNumFromPositionLetter(cellLetter) {
    if(cellLetter === 'a') return 0;
    else if(cellLetter === 'b') return 1;
    else if(cellLetter === 'c') return 2;
    else if(cellLetter === 'd') return 3;
    else if(cellLetter === 'e') return 4;
    else if(cellLetter === 'f') return 5;
    else if(cellLetter === 'g') return 6;
    else if(cellLetter === 'h') return 7;
}

createBoard();
const cells = document.querySelectorAll('.cell');
const pawns = document.querySelectorAll('.pawn');
const rooks = document.querySelectorAll('.rook');
const knights = document.querySelectorAll('.knight');
const bishops = document.querySelectorAll('.bishop');
const queens = document.querySelectorAll('.queen');
const kings = document.querySelectorAll('.king');

function getCell(letterPos, numPos) {
    for(const cell of cells){
        if(cell.classList.contains(letterPos) && cell.classList.contains(numPos)) return cell;
    }
}
const getCurrentLetter = currentPiece => currentPiece.parentElement.classList[1];
const getCurrentNum = currentPiece => Number(currentPiece.parentElement.classList[2]);
const selectCurrentCircles = () => document.querySelectorAll('.moveTo');
const getCurrentCell = currentPiece => getCell(getCurrentLetter(currentPiece), getCurrentNum(currentPiece));

function createMoveCircle() {
    const circle = document.createElement('img');
    circle.src = "./picess/move-circle.png";
    circle.classList.add('moveTo');
    return circle;
}

function removeCircle(currentCell) {
    currentCell.removeChild(currentCell.querySelector('.moveTo'));
}

function removeAllCircles() {
    for(const circle of document.querySelectorAll('.moveTo')) {
        const currentCell = getCell(getCurrentLetter(circle),getCurrentNum(circle));
        removeCircle(currentCell);
    }
}

function makeAMove(currentPiece) {
    const currCircles = selectCurrentCircles();
    for(const circle of currCircles) {
        circle.addEventListener('click', function() {
            const targetCell = getCell(getCurrentLetter(circle),getCurrentNum(circle));
            removeAllCircles();
            if(targetCell.hasChildNodes()) targetCell.removeChild(targetCell.firstChild); 
            targetCell.appendChild(currentPiece);
            player === 0 ? player++: player--;
        })
    }
}

function checkTakePawn(letterPos, numPos, player) {
    const currClass = player === 0 ? 'white' : 'black';
    const negativeClass = player === 0 ? 'black' : 'white';
    const nextRow = player === 0 ? numPos+1: numPos-1;
    const checkRight = setPositionLetter(returnNumFromPositionLetter(letterPos)+1);
    const checkLeft = setPositionLetter(returnNumFromPositionLetter(letterPos)-1)
    const takeRight = getCell(checkRight, nextRow);
    if(takeRight.hasChildNodes() && takeRight.firstChild.classList.contains(negativeClass)) takeRight.appendChild(createMoveCircle());
    const takeLeft = getCell(checkLeft, nextRow);
    if(takeLeft.hasChildNodes() && takeLeft.firstChild.classList.contains(negativeClass)) takeLeft.appendChild(createMoveCircle());
}


//move pawns
for(let i=0;i<pawns.length;i++) {
    let currentPawn = pawns[i];
    function pawnMove(){
        removeAllCircles();
        if(currentPawn.classList.contains(`${player === 0 ? 'white' : 'black'}`)){
            const letterPos = getCurrentLetter(currentPawn);
            const numPos = getCurrentNum(currentPawn);
            const currentCell = getCurrentCell(currentPawn);
            const nextCell = player === 0 ? getCell(letterPos,numPos+1) : getCell(letterPos, numPos-1);
            if(!nextCell.hasChildNodes()){
                nextCell.appendChild(createMoveCircle());
                if(currentCell.classList.contains(`${player === 0 ? '2' : '7'}`) && !getCell(letterPos, numPos+(player === 0 ? 2 : -2)).hasChildNodes()) {
                    const secondCellFirstMove = getCell(letterPos,numPos+(player === 0 ? 2 : -2));
                    secondCellFirstMove.appendChild(createMoveCircle());
                }
            }
            checkTakePawn(letterPos, numPos, player);
            makeAMove(currentPawn);
        }
    }
    currentPawn.addEventListener('click', pawnMove);
}