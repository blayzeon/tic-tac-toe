const ticTacToe = (function(){
    // html elements
    const boardContainer = document.querySelector('#board');
    let gamesPlayed = 0;
    let currTurn = 0;

    let _plays = ['', '', '', '', '', '', '', '', ''];
    let _players = [];

    function Player(name, marker, gamesWon=0){
        this.name = name
        this.marker = marker
        this.gamesWon = gamesWon;
        this.play = function (elm){
            if (elm.innerText == ""){
                // it's empty so we can place a letter there
                if (currTurn == 0){
                    currTurn = 1;
                } else {
                    currTurn = 0;
                }

                index = elm.dataset.square;
                elm.innerText = marker;
                _plays[index] = marker;
                let result = checkBoard();
                if (result === "draw" || result == true){
                    gamesPlayed ++;
                    if (result == true){
                        gamesWon ++;
                        alert(`${name} has won ${gamesWon} out of ${gamesPlayed} games!`);
                    } else {
                        alert(`it's a draw!`);
                    }
                    newBoard();
                } else {
                    // computer's turn
                    if (_players[0].name == "computer" || _players[1].name == "computer"){
                        if (name != "computer"){
                            if (gamesWon >= gamesPlayed / 2){
                                computerPlay("normal");
                            } else {
                                computerPlay("easy");
                            }
                        }
                    }
                }
            } else {
                // play an animation where the letter shakes
            }
        }
    }

    function computerPlay(difficulty){
        let index = 1;
        if (_players[1].name != "computer"){
            index = 0;
            if (_players[0].name != "computer"){
                // if both names are set, we don't want AI to play
                return
            }    
        }
        // the computer takes a turn
        if (index == currTurn){
            let move = 4;
            if (difficulty === "easy"){
                while (_plays[move] != ''){
                    move = Math.floor(Math.random()*9);
                }
            } else if (difficulty === "normal"){
                for (let i = 0; i < 9; i++){
                    let tempArray = [..._plays];
                    if (_plays[i] == ''){
                        tempArray[i] = _players[index].marker;
                        result = checkWin(tempArray);
                        if (result == true){
                            move = i;
                        }
                    }
                }
                if (move == 4){
                    computerPlay("easy");
                    return;
                }
            }
            let elm = document.querySelector(`[data-square="${move}"]`);
            _players[index].play(elm);
        } else {
            return
        }
    }

    // default players if none are set
    _players.push(new Player('x', 'x'), new Player('computer', 'o'));

    function checkWin(array){
        for (let i = 0; i < array.length; i++){
            if (array[i] != ''){
                // diagnal wins
                if (i == 4){
                    // center piece
                    if (array[i] == array[0]){
                        if (array[i] == array[8]){
                            // top left through bottom right
                            return true
                        }
                    } else if (array[i] == array[2]){
                        if (array[i] == array[6]){
                            // bottom left through top right
                            return true
                        }
                    } else {
                        continue
                    }
                }
                // three in a row horizontally
                if (i % 3 == 0){
                    if (array[i] == array[i+1]){
                        if (array[i] == array[i+2]){
                            // gg
                            return true
                        }
                    }
                } 
                if (i == 0 || i == 1 || i == 2){
                    // top row going down
                    if (array[i] == array[i+3]){
                        if (array[i] == array[i+6]){
                            // gg 
                            return true
                        }
                    }
                }
            }
        }
    }

    const checkBoard = () => {        
        const result = checkWin(_plays);
        if (result != true && _plays.includes('') === false){
            // if no one won yet the board is full, it has to be a draw
            return "draw";
        }  

        // returns whether to keep going or if the game has been won
        return result;
    }

    const newBoard = () =>{
        function takeTurn(square){
            _players[currTurn].play(square);
        }

        // creates the board
        _plays = ['', '', '', '', '', '', '', '', ''];
        const squares = 9;
        let newBoard = ``;
        for (let i = 0; i < squares; i++){
            newBoard += `<li data-square="${i}"></li>`;
        };

        // populates the elm and adds event listeners
        boardContainer.innerHTML = newBoard;
        const squareElm = boardContainer.querySelectorAll('li');

        squareElm.forEach(square => {
            square.addEventListener('click', takeTurn.bind(this, square));
        });

        // sets up the computer's turn
        currTurn = gamesPlayed % 2;
        computerPlay("easy");
    }

    // Startup functions & listeners
    (function () {
        // functions
        const toggle = () =>{
            // show/hide the new game menu
            const popup = document.querySelector('#popup');
            popup.classList.toggle('hidden');

            newBoard();

            if (document.querySelector('#controls').innerHTML == ""){
                (document.querySelector('#controls').appendChild(btnElm));
            }
                       
        }

        const askName = (marker) =>{
            // sets the player
            const setPlayer = (index=0, name="player", marker="x") => {
                _players[index] = (player = new Player(name, marker));
            }

            let index = 0;
            if (marker == "o"){
                index = 1;
            }
            let newName = prompt('What is your name?');
            if (newName == null || newName == ''){
                newName = marker;
            }

            setPlayer(index, newName, marker);
            return newName;
        }

        // html elements
        const setPlayer = document.querySelectorAll('[data-btn]');
        const close = document.querySelector('#confirm');
        const btnElm = document.createElement('button');
        
        // new game button
        btnElm.classList.add('big-button')
        btnElm.innerText = "New Game";
        btnElm.addEventListener('click', toggle);

        // event listeners
        close.addEventListener('click', toggle);
        boardContainer.appendChild(btnElm);
        setPlayer.forEach(player =>{
            player.addEventListener('click', ()=>{
                const marker = player.dataset.btn;
                let newName = askName(marker);
                player.innerText = newName;
            });
        })
    })();

    return {
        
    };

})();