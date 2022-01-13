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

function checkSecondSquare(currentCell, currCol, currRow) {
    if(currentCell.classList.contains(`${player === 0 ? '2' : '7'}`) && !getCell(currCol, currRow+(player === 0 ? 2 : -2)).hasChildNodes()) {
        const secondCellFirstMove = getCell(currCol,currRow+(player === 0 ? 2 : -2));
        secondCellFirstMove.appendChild(createMoveCircle());
    }
}

function pawnStep(piece) {
    const currCol = getCurrentColumn(piece);
    const currRow = getCurrentRow(piece);
    const nextCell = player === 0 ? getCell(currCol,currRow+1) : getCell(currCol, currRow-1);
    const currentCell = getCell(currCol, currRow);
    if(!nextCell.hasChildNodes()){
        nextCell.appendChild(createMoveCircle());
        checkSecondSquare(currentCell, currCol, currRow);
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

const nextDiagonalCellRight = (currCol, currRow, counter) => getCell(setLetterFromNum(getColumnNum(currCol)+counter), currRow+counter);
const nextDiagonalCellLeft = (currCol, currRow, counter) => getCell(setLetterFromNum(getColumnNum(currCol)-counter), currRow+counter);

function checkDiagonalRightFunc(piece, counter) {
    const negativeClass = getNegativeClass();
    const currCol = getCurrentColumn(piece);
    const currRow = getCurrentRow(piece);
    let nextCell = nextDiagonalCellRight(currCol,currRow,counter);
    if(nextCell !== undefined) {
        while(!nextCell.hasChildNodes()) {
            nextCell.appendChild(createMoveCircle());
            counter > 0 ? counter++ : counter--;
            nextCell = nextDiagonalCellRight(currCol,currRow,counter);
            if(nextCell === undefined) break;
        }
        if(nextCell !== undefined){
            if(nextCell.hasChildNodes() && nextCell.firstChild.classList.contains(negativeClass)) {
                nextCell.appendChild(createMoveCircle());
            }
        }
    }
}

function checkDiagonalLeftFunc(piece, counter) {
    const negativeClass = getNegativeClass();
    const currCol = getCurrentColumn(piece);
    const currRow = getCurrentRow(piece);
    let nextCell = nextDiagonalCellLeft(currCol,currRow,counter);
    if(nextCell !== undefined) {
        while(!nextCell.hasChildNodes()) {
            nextCell.appendChild(createMoveCircle());
            counter > 0 ? counter++ : counter--;
            nextCell = nextDiagonalCellLeft(currCol,currRow,counter);
            if(nextCell === undefined) break;
        }
        if(nextCell !== undefined){
            if(nextCell.hasChildNodes() && nextCell.firstChild.classList.contains(negativeClass)) {
                nextCell.appendChild(createMoveCircle());
            }
        }
    }
}

function checkDiagonalRight(piece) {
    checkDiagonalRightFunc(piece,1);
    checkDiagonalRightFunc(piece,-1);
}

function checkDiagonalLeft(piece) {
    checkDiagonalLeftFunc(piece, 1);
    checkDiagonalLeftFunc(piece,-1);
}

function checkLeagleMoveKing(cell) {
    const negativeClass = getNegativeClass();
    if(cell !== undefined){
        if(!cell.hasChildNodes()) {
            cell.appendChild(createMoveCircle());
        }
        if(cell.firstChild.classList.contains(negativeClass)) cell.appendChild(createMoveCircle());
    }
}

function kingHorizontalAndVertical(piece) {
    const currRow = getCurrentRow(piece);
    const currCol = getCurrentColumn(piece);
    for(let i = -1;i<=1;i++) {
        for(let j=-1;j<=1;j++) {
            const cellAdded = getCell(setLetterFromNum(getColumnNum(currCol) + i), currRow + j);
            if(!(i === 0 && j === 0)) checkLeagleMoveKing(cellAdded);
        }
    }
}

//move pawns
for(let i=0;i<pawns.length;i++) {
    const currentPawn = pawns[i];
    function pawnMove(){
        if(hasCurrentclass(currentPawn)){
            removeAllCircles();
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
        if(hasCurrentclass(currentRook)) {
            removeAllCircles();
            checkVertical(currentRook);
            checkHorizontal(currentRook);
            makeAMove(currentRook);
        }
    }
    currentRook.addEventListener('click', rookMove)
} 

//move bishops
for(let i=0;i<bishops.length;i++) {
    const currentBish = bishops[i];
    function bishopMove() {
        if(hasCurrentclass(currentBish)) {
            removeAllCircles();
            checkDiagonalRight(currentBish);
            checkDiagonalLeft(currentBish);
            makeAMove(currentBish);
        }
    }
    currentBish.addEventListener('click',bishopMove);
}

//move queens
for(let i=0;i<queens.length;i++){
    const currentQueen = queens[i];
    function queenMove() {
        if(hasCurrentclass(currentQueen)) {
            removeAllCircles();
            checkDiagonalLeft(currentQueen);
            checkDiagonalRight(currentQueen);
            checkHorizontal(currentQueen);
            checkVertical(currentQueen);
            makeAMove(currentQueen);
        }
    }
    currentQueen.addEventListener('click', queenMove)
}

//move king
for(let i=0; i<kings.length;i++) {
    const currKing = kings[i];
    function kingMove() {
        if(hasCurrentclass(currKing)){
            removeAllCircles();
            kingHorizontalAndVertical(currKing);

            makeAMove(currKing);
        }
    }
    currKing.addEventListener('click', kingMove);
}

//move knights
for(let i=0;i<knights.length;i++) {
    const currKnight = knights[i];
    function knightMove() {
        
    }
    currKnight.addEventListener('click',knightMove)
}