const board = document.querySelector('.container');
let player = 0;
const arrOfLetters = ['a', 'b' , 'c', 'd', 'e', 'f', 'g', 'h'];

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

const setLetterFromNum = i => arrOfLetters[i];
const getColumnNum = colLetter => arrOfLetters.indexOf(colLetter);

function createBoard() {
    let arr = [];
    let id = 1;
    let colorIndicator = 0;
    for(let i=7; i>=0;i--){
        let line = [];
        for(let j=0;j<8;j++) {
            const color = colorIndicator === 0 ? 'AntiqueWhite' : 'Sienna';
            const cell = createCell(color);
            const currentLetter = setLetterFromNum(j);
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

createBoard();
const cells = document.querySelectorAll('.cell');
const pawns = document.querySelectorAll('.pawn');
const rooks = document.querySelectorAll('.rook');
const knights = document.querySelectorAll('.knight');
const bishops = document.querySelectorAll('.bishop');
const queens = document.querySelectorAll('.queen');
const kings = document.querySelectorAll('.king');

function getCell(currCol, currRow) {
    for(const cell of cells){
        if(cell.classList.contains(currCol) && cell.classList.contains(currRow)) return cell;
    }
}
const getCurrentColumn = currentPiece => currentPiece.parentElement.classList[1];
const getCurrentRow = currentPiece => Number(currentPiece.parentElement.classList[2]);
const selectCurrentCircles = () => document.querySelectorAll('.moveTo');
const getNegativeClass = () => player === 0 ? 'black' : 'white';
const hasCurrentclass = piece => piece.classList.contains(`${player === 0 ? 'white' : 'black'}`);

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
        const currentCell = getCell(getCurrentColumn(circle),getCurrentRow(circle));
        removeCircle(currentCell);
    }
}

function makeAMove(currentPiece) {
    for(const circle of selectCurrentCircles()) {
        circle.addEventListener('click', function() {
            const targetCell = getCell(getCurrentColumn(circle),getCurrentRow(circle));
            removeAllCircles();
            if(targetCell.hasChildNodes()) targetCell.removeChild(targetCell.firstChild); 
            targetCell.appendChild(currentPiece);
            player === 0 ? player++: player--;
        })
    }
}

function checkSideForward(col, nextRow) {
    const negativeClass = getNegativeClass()
    if(col !== undefined) {
        const takeCell = getCell(col, nextRow);
        if(takeCell.hasChildNodes() && takeCell.firstChild.classList.contains(negativeClass)) takeCell.appendChild(createMoveCircle());
    }
}

function checkTakePawn(piece) {
    const currCol = getCurrentColumn(piece);
    const currRow = getCurrentRow(piece);
    const nextRow = player === 0 ? currRow+1: currRow-1;
    const checkRight = setLetterFromNum(getColumnNum(currCol)+1);
    const checkLeft = setLetterFromNum(getColumnNum(currCol)-1);
    checkSideForward(checkLeft, nextRow);
    checkSideForward(checkRight, nextRow);
}

function pawnStep(piece) {
    const currCol = getCurrentColumn(piece);
    const currRow = getCurrentRow(piece);
    const nextCell = player === 0 ? getCell(currCol,currRow+1) : getCell(currCol, currRow-1);
    const currentCell = getCell(currCol, currRow);
    if(!nextCell.hasChildNodes()){
        nextCell.appendChild(createMoveCircle());
        if(currentCell.classList.contains(`${player === 0 ? '2' : '7'}`) && !getCell(currCol, currRow+(player === 0 ? 2 : -2)).hasChildNodes()) {
            const secondCellFirstMove = getCell(currCol,currRow+(player === 0 ? 2 : -2));
            secondCellFirstMove.appendChild(createMoveCircle());
        }
    }
}


function addCirclesVertically(row, piece) {
    const currCol = getCurrentColumn(piece);
    const currRow = getCurrentRow(piece);
    const negativeClass = getNegativeClass(player);
    if(getCell(currCol, row) !== undefined) {
        while(!getCell(currCol,row).hasChildNodes()){
            const nextCell = getCell(currCol,row);
            nextCell.appendChild(createMoveCircle());
            if(currRow>row){
                if(row !== 1) row--;
                else break;
            }
            else{
                if(row !== 8) row++;
                else break;
            }
        }
        if(getCell(currCol,row).hasChildNodes() && getCell(currCol,row).firstChild.classList.contains(negativeClass)){
            getCell(currCol,row).appendChild(createMoveCircle());
        }
    }
}

function checkVertical(piece) {
    const nextRow = getCurrentRow(piece)+1;
    const backRow = getCurrentRow(piece)-1;
    addCirclesVertically(nextRow,piece);
    addCirclesVertically(backRow, piece);
}


function addCirclesHorizontally(piece, col) {
    const negativeClass = getNegativeClass();
    const currCol = getCurrentColumn(piece);
    const currRow = getCurrentRow(piece);
    let counter = 1;
    if(col !== undefined){
        while(!getCell(col,currRow).hasChildNodes()) {
            getCell(col,currRow).appendChild(createMoveCircle());
            counter++;
            col = getColumnNum(col) > getColumnNum(currCol) ? setLetterFromNum(getColumnNum(currCol)+counter) : setLetterFromNum(getColumnNum(currCol)-counter);
            if(col === undefined) break;
        }
        if(col !== undefined){
            if(getCell(col,currRow).hasChildNodes() && getCell(col,currRow).firstChild.classList.contains(negativeClass)) {
                getCell(col,currRow).appendChild(createMoveCircle());
            }
        }
    }
}

function checkHorizontal(piece) {
    const currCol = getCurrentColumn(piece);
    const leftCol = setLetterFromNum(getColumnNum(currCol)-1);
    const rightCol = setLetterFromNum(getColumnNum(currCol)+1);
    addCirclesHorizontally(piece, leftCol);
    addCirclesHorizontally(piece, rightCol);
}

//move pawns
for(let i=0;i<pawns.length;i++) {
    const currentPawn = pawns[i];
    function pawnMove(){
        removeAllCircles();
        if(hasCurrentclass(currentPawn)){
            pawnStep(currentPawn);
            checkTakePawn(currentPawn);
            makeAMove(currentPawn);
        }
    }
    currentPawn.addEventListener('click', pawnMove);
}

//move rooks
for(let i=0;i<rooks.length;i++) {
    const currentRook = rooks[i];
    function rookMove() {
        removeAllCircles();
        if(hasCurrentclass(currentRook)) {
            checkVertical(currentRook);
            checkHorizontal(currentRook);
            makeAMove(currentRook);
        }
    }
    currentRook.addEventListener('click', rookMove)
} 