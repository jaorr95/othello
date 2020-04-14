table = {

    blacks: 0,
    whites: 0,
    rows: null,
    turn: null,
    TABLE_SIZE: 8,
    COLOR_BLACK: 'black',
    COLOR_WHITE: 'white',
    playerOne: null,
    playerTwo: null,

    /**
     * Funcion que inicia los valores basicos
     */
    init: function () {
        table.rows = document.getElementsByClassName('row-table');
        table.turn = table.COLOR_BLACK;
        table.addListenersSidePanel();
        table.addListenersRadiosBtn();
    },

    /**
     * Funcion que coloca las 4 fichas iniciales en el tablero
     */
    initTable: function () {
        table.setNewCell(table.rows[3].children[3], table.COLOR_BLACK);
        table.setNewCell(table.rows[3].children[4], table.COLOR_WHITE);
        table.setNewCell(table.rows[4].children[3], table.COLOR_WHITE);
        table.setNewCell(table.rows[4].children[4], table.COLOR_BLACK);
    },

    /**
     * Funcion que agrega listener de click a cada celda del tablero
     */
    addListenersCells: function () {
        const cells = document.getElementsByClassName("row-item");
        for (const cell of cells) {
            cell.addEventListener('click', table.validateCellClick);
        }
    },

    /**
     * Funcion que agrega el listener click a las opciones del menu lateral
     */
    addListenersSidePanel: function () {
        const options = document.getElementsByClassName("option-side");
        for (const option of options) {
            option.addEventListener('click', table.changeSidePanel);
        }
    },

    /**
     * Funcion que agrega el listener onchange a los radio buttons de modo de juego
     */
    addListenersRadiosBtn: function () {
        const gameModes = document.getElementsByName("mode");
        for (const mode of gameModes) {
            mode.onchange = table.btnModeActivate;
        }
    },

    /**
     * Funcionn que valida todas las condiciones necesarias para que sea un click en una celda valida
     */
    validateCellClick: function () {
        if (table.isEmptyCell(this)) {
            rowIndex = table.findRowIndex(this);
            columnIndex = table.findcolumnIndex(rowIndex, this);
            status = table.checkCellsV2(rowIndex, columnIndex, 1, table.turn);
            if (status == "true") {
                table.setNewCell(this, table.turn);
                table.changeTurn();
                table.setQuantityBlackAndWhiteHTML();
                table.checkWinner();
                /*winner = table.checkWinner();
                if (winner == 0) {
                    table.checkOptions();
                }*/

            } else {
                alert("Debe seleccionar una celda que al rededor tenga una ficha de color contrario y que en sus trazos tenga una ficha de parada");
            }

        } else {
            alert("Debe seleccionar una celda vacia");
        }
    },

    /**
     * Funcion que encuentra la posicion de la fila en la cual se encuentra la celda que fue clickeada
     */
    findRowIndex: function (cell) {
        index = 0;
        for (const r of table.rows) {
            if (r === cell.parentNode) {
                break;
            }
            index++;
        }
        return index;
    },

    /**
     * Funcion que encuentra la posicion de la columna en la cual se encuentra la celda que fue clickeada
     */
    findcolumnIndex: function (rowIndex, cell) {
        row = table.rows[rowIndex].children;
        index = 0;
        for (const c of row) {
            if (c === cell) {
                break;
            }
            index++;
        }

        return index;
    },

    /** 
     * Funcion que valida si la celda clikeada esta vacia
     */
    isEmptyCell: function (cell) {
        if (cell.children.length === 0) {
            return true;
        }
        return false;
    },

    /**
     * 
     * @param {NodeElement} cell Celda que debe contener un hijo con una ficha
     * @param {string} color Color a validar con la ficha
     */
    checkColor: function (cell, color) {
        if (cell.children[0].style.backgroundColor === color) {
            return true;
        }
        return false;
    },

    /**
     * 
     * @param {Int} rowIndex Coordenada de la fila
     * @param {Int} columnIndex Coordenada de la columna
     * @returns {NodeElement | null} Si las coordenadas son vaiidas, devuelve un NodeElement, de lo contrario devuelve null
     */
    getCell: function (rowIndex, columnIndex) {
        if (rowIndex >= 0 && rowIndex <= (table.TABLE_SIZE - 1) &&
            columnIndex >= 0 && columnIndex <= (table.TABLE_SIZE - 1)) {
            return table.rows[rowIndex].children[columnIndex];
        }

        return null;
    },

    showWinner: function() {
        if (table.blacks > table.whites) {
            alert('Ganador: Las negras');
        } else if (table.whites > table.blacks) {
            alert('Ganador: Las blancas')
        } else {
            alert('Empate');
        }
    },

    checkWinner: function () {
        if ((table.blacks + table.whites) == 64) {
            table.showWinner();
        } else {
            optionTurn = table.checkOptions(table.turn);
            optionOponent = table.checkOptions(table.getColorOponent());
            if (optionTurn != 'true' && optionOponent != 'true') {
                table.showWinner();
                //table.resetTable();
            } else {
                if (optionTurn != 'true'){
                    alert('El turno se mantiene debido a que el oponente no tiene movimientos disponibles');
                    table.changeTurn();
                }
            }
            
        }
    },

    /**
     * 
     */
    checkOptions: function (turn) {
        rowIndex = 0;

        for (const row of table.rows) {
            columnIndex = 0;
            for (const cell of row.children) {
                if (table.isEmptyCell(cell)) {
                    status = table.checkCellsV2(rowIndex, columnIndex, 0, turn);
                    if (status == "true") {
                        return status;
                    }
                }
                columnIndex++;
            }

            rowIndex++;
        }

        return status;
    },

    checkCellsV2: function (rowIndex, columnIndex, option, turn) {
        row = rowIndex - 1;
        availableDirections = null;
        do {
            col = columnIndex - 1;
            do {
                if ((row != rowIndex || col != columnIndex) && (row >= 0 && col >= 0)) {
                    sumandRow = row - rowIndex;
                    summandCol = col - columnIndex;

                    const status = table.checkDirections(row, col, 
                        (val, summand = sumandRow) => { return val + summand }, 
                        (val, summand = summandCol) => { return val + summand }, 
                        option, turn);

                    if (availableDirections != 'true') {

                        availableDirections = status;
                    }
                }
                col++;
            } while ((col - columnIndex) < 2);

            row++

        } while ((row - rowIndex) < 2);

        return availableDirections;
    },


    checkDirections: function (rowIndex, columnIndex, rowIndexfunc, columnIndexfunc, option, turn, firstIteration = true) {
        
        cell = table.getCell(rowIndex, columnIndex);
        if (!cell || table.isEmptyCell(cell)) {
            return null;
        }

        if (firstIteration) {

            if (table.checkColor(cell, turn)){
                return null;
            }
        } else {
            if (table.checkColor(cell, turn)) {
                return true;
            }
        }

        status = table.checkDirections(rowIndexfunc(rowIndex), columnIndexfunc(columnIndex), rowIndexfunc, columnIndexfunc, option, turn, false);

        if (status == "true" && option == 1) {
            cell = table.getCell(rowIndex, columnIndex);
            cell.children[0].style.backgroundColor = turn;
            table.countPiece();
        }

        return status;
    },

    getColorOponent: function () {
        return table.turn === table.COLOR_BLACK ? table.COLOR_WHITE : table.COLOR_BLACK;
    },

    setNewCell: function (cell, color) {
        piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = color;
        cell.appendChild(piece);
        if (color === table.COLOR_BLACK) {
            table.blacks++;
        } else {
            table.whites++;
        }
    },

    changeTurn: function () {
        table.turn = table.getColorOponent();
        turnElem = document.getElementsByClassName('turn');
        turnElem[0].style.backgroundColor = table.turn;
    },

    countPiece: function () {
        if (table.turn === table.COLOR_BLACK) {
            table.blacks++;
            table.whites--;
        } else {
            table.blacks--;
            table.whites++;
        }
    },

    setQuantityBlackAndWhiteHTML: function () {
        blackElem = document.getElementsByClassName("quantity-blacks");
        whiteElem = document.getElementsByClassName("quantity-whites");
        blackElem[0].innerHTML = table.blacks;
        whiteElem[0].innerHTML = table.whites;

    },

    askNamePlayers: function () {
        table.playerOne = null;
        table.playerTwo = null;

        do {
            table.playerOne = table.askName('Ingrese nombre de jugador 1');
            table.playerTwo = table.askName('Ingrese nombre de jugador 2');
            if (table.playerOne == table.playerTwo && table.playerOne != 'null') {
                alert('Los nombres deben ser direrentes');
            }
        } while (table.playerOne == table.playerTwo && table.playerOne != 'null');

        table.setPlayers();
    },

    askName: function (askText) {
        while (true) {
            name = prompt(askText);
            if (name && name != '' && name.length > 2) {
                return name;
            } else {
                alert("Nombre invalido. Debe escribir un nombre con al menos 3 caracteres")
            }
        }


    },

    setPlayers: function () {
        playerOneElem = document.getElementsByClassName("player-one");
        playerTwoElem = document.getElementsByClassName("player-two");
        playerOneElem[0].innerHTML = table.playerOne;
        playerTwoElem[0].innerHTML = table.playerTwo;
    },

    changeSidePanel: function () {
        optionSelected = this;
        prevSelected = document.getElementsByClassName("option-side selected");
        if (optionSelected != prevSelected[0]) {

            previosSide = document.getElementsByClassName(prevSelected[0].getAttribute('data-target'));
            previosSide[0].style.display = 'none';

            newSide = document.getElementsByClassName(optionSelected.getAttribute('data-target'));
            newSide[0].style.display = 'block';

            prevSelected[0].classList.remove('selected');
            optionSelected.classList.add('selected');

        }

    },

    btnModeActivate: function () {
        btn = document.getElementsByClassName('btn-game-mode');
        if (this.id == 'radio-local') {
            btn[0].innerHTML = 'Nuevo juego';
        } else if (this.id == 'radio-socket') {
            btn[0].innerHTML = 'Buscar jugadores';
        }
        btn[0].disabled = false;

    },

    initGame: function () {
        table.initTable();
        table.addListenersCells();
    },

    initMode: function () {
        const gameModes = document.getElementsByName("mode");
        for (const mode of gameModes) {
            if (mode.checked) {
                if (mode.id == 'radio-local') {
                    this.initModeLocal();
                    break;
                } else if (mode.id == 'radio-socket') {
                    break;
                    //TODO proceso del socket
                }
            }
        }
    },

    initModeLocal: function () {
        table.askNamePlayers();
        if (table.playerNameNotNull()) {
            table.resetTable();
            table.initGame();

            document.getElementById('game-info').click();
        }

    },

    resetTable: function () {
        for (const row of table.rows) {
            for (const cell of row.children) {
                cell.removeEventListener('click', table.validateCellClick);
                if (cell.children.length > 0) {
                    cell.removeChild(cell.children[0]);
                }

            }

        }
    },

    playerNameNotNull: function () {
        if (table.playerOne == 'null' || table.playerTwo == 'null') {
            table.playerOne = null;
            table.playerTwo = null;
            return false;
        }

        return true;
    }
}