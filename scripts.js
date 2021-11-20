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
                }
            } else {
                // play an animation where the letter shakes
            }
        }
    }

    // default players if none are set
    _players.push(new Player('x', 'x'), new Player('o', 'o'));

    function takeTurn(square){
        _players[currTurn].play(square);
    }

    const checkBoard = () => {
        function checkWin(){
            for (let i = 0; i < _plays.length; i++){
                if (_plays[i] != ''){
                    // diagnal wins
                    if (i == 4){
                        // center piece
                        if (_plays[i] == _plays[0]){
                            if (_plays[i] == _plays[8]){
                                // top left through bottom right
                                return true
                            }
                        } else if (_plays[i] == _plays[2]){
                            if (_plays[i] == _plays[6]){
                                // bottom left through top right
                                return true
                            }
                        } else {
                            continue
                        }
                    }
                    // three in a row horizontally
                    if (i % 3 == 0){
                        if (_plays[i] == _plays[i+1]){
                            if (_plays[i] == _plays[i+2]){
                                // gg
                                return true
                            }
                        }
                    } 
                    if (i == 0 || i == 1 || i == 2){
                        // top row going down
                        if (_plays[i] == _plays[i+3]){
                            if (_plays[i] == _plays[i+6]){
                                // gg 
                                return true
                            }
                        }
                    }
                }
            }
        }
        const result = checkWin();
        if (result != true && _plays.includes('') === false){
            // if no one won yet the board is full, it has to be a draw
            return "draw";
        }  

        // returns whether to keep going or if the game has been won
        return result;
    }

    const newBoard = () =>{
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
                newName = `Set ${marker}`;
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