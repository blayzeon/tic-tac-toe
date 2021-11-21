const ticTacToe = (function(){
    // html elements
    const boardContainer = document.querySelector('#board');

    // counters
    let currTurn = 0;
    let _plays = ['', '', '', '', '', '', '', '', ''];
    let _players = [];

    function Player(name, marker, index, gamesWon=0){
        this.name = name
        this.marker = marker
        this.gamesWon = gamesWon;
        this.index = index;
        this.play = function (elm="computer"){
            // check if we are a player or a computer
            let newElm = elm;
            if (name == "computer"){
                let elmIndex = computerPlay(index);
                newElm = document.querySelector(`[data-square="${elmIndex}"]`);
            }

            if (newElm.innerText == ""){
                // add the marker
                newElm.innerHTML = `<span>${marker}</span>`;
                newElm.classList.add('fadein');

                // add to array
                _plays[newElm.dataset.square] = marker;

                // update the turn
                if (index == 0){
                    currTurn = 1;
                } else {
                    currTurn = 0;
                }

                // check if the game is over
                let gameResult = checkBoard();
                if (gameResult == "draw" || gameResult === true ){
                    if (gameResult === true){
                        gamesWon ++;
                        let game = "games";
                        if (gamesWon == 1){
                            game = "game"
                        }
                        alert(`${name} won!  They have won ${gamesWon} ${game} in total!`);
                    } else {
                        alert(`it's a draw!`);
                    }
                    newBoard();
                } else if (name != "computer" && _players[currTurn].name == "computer"){
                    // computer's turn
                    _players[currTurn].play();
                }
                return;
            } else {
                // not a valid space;
                if (document.body.contains(newElm.querySelector('span'))){
                    newElm.querySelector('span').classList.remove('shake');
                    newElm.querySelector('span').classList.add('shake');
                    return;
                }
            }
        }
    }

    function computerPlay(cpu){
        // the computer takes a turn
        let move = 4;

        function checkOutcome(player){
            for (let i = 0; i < 9; i++){
                let tempArray = [..._plays];
                if (_plays[i] === ''){
                    tempArray[i] = _players[player].marker;
                    let result = checkWin(tempArray);
                    if (result == true){
                        return i;
                    }
                }
            }
        }

        let human = 0;
        if (cpu = 0){
            human = 1;
        }

        // check for a win
        let outcome = checkOutcome(cpu);
        if (outcome != undefined){
            move = outcome;
        }else{
            let human = 0;
            if (_players[0].name == "computer"){
                human = 1;
            }
            let outcome2 = checkOutcome(human);
            if (outcome2 != undefined){
                move = outcome2;
            } else {
                while (_plays[move] != ''){
                    move = Math.floor(Math.random()*9);
                }
            }
        }

        if (_plays[move] != ""){
            console.log('invalid move')
        }
        return(move);
            
    }

    // default players if none are set
    _players.push(new Player('x', 'x', 0), new Player('computer', 'o', 1));

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

        if (_players[currTurn].name == "computer"){
            _players[currTurn].play();
        }
    }

    // Startup functions & listeners
    (function () {
        // functions
        const toggle = () =>{
            // show/hide the new game menu
            const popup = document.querySelector('#popup');
            popup.classList.toggle('hidden');

            currTurn = 0;
            newBoard();

            if (document.querySelector('#controls').innerHTML == ""){
                (document.querySelector('#controls').appendChild(btnElm));
            }
                       
        }

        const askName = (marker) =>{
            // sets the player
            const setPlayer = (index=0, name="player", marker="x") => {
                _players[index] = (player = new Player(name, marker, index));
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

})();
