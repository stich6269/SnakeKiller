function Controller() {
    this.drawer = new Drawer();
    this.model = new Model();

    this.speed = 200; // speed on steps/ milliseconds
    this.intervalId = false;
    this.listener = null;
    this.initializeGame();
}


Controller.prototype.initializeGame = function(){
    var gameFieldW = this.drawer.gameFieldW,
        gameFieldH = this.drawer.gameFieldH;

    this.intervalId = false;
    this.drawer.createGame();
    this.model.players = [];
    this.model.bonusRect = [];

    this.model.players.push(new Player(
        {name:'Artem',
        startPos: [0,0],
        startDirect: 'RIGHT_SIDE'},

        {68 : 'RIGHT_SIDE',
        65 : 'LEFT_SIDE',
        83 : 'LOWER_SIDE',
        87 : 'UPPER_SIDE'
    }));

    this.model.players.push(new Player(
        {name:'Igor',
        startPos: [0, this.drawer.gameFieldH-1],
        startDirect: 'RIGHT_SIDE'},

        {102 : 'RIGHT_SIDE',
        100 : 'LEFT_SIDE',
        101: 'LOWER_SIDE',
        104 : 'UPPER_SIDE'
    }));

    this.model.bonusRect = new Bonus(gameFieldW, gameFieldH);

    this.createListenerFunk();
    document.addEventListener('keydown', this.listener);
    this.drawer.redraw(this.model.players, this.model.bonusRect.coordinate);
};

Controller.prototype.stepSnake = function() {
    var gameFieldW = this.drawer.gameFieldW,
        gameFieldH = this.drawer.gameFieldH,
        playersCount = this.model.players.length,
        activePlayer,
        gameResult ,
        rivalPlayer,
        isEating,
        isLeaveGame,
        isAccident;

    for (var i = 0; i <  playersCount; i++) {
        activePlayer =  this.model.players[i];
        rivalPlayer = this.model.players[(i+1)%2];
        this.model.updSnakePosition(activePlayer);
        isAccident = this.isAccidentThemselves(activePlayer);
        isEating = this.isEatingRival(activePlayer, rivalPlayer);
        isLeaveGame = this.isLeaveGameField(activePlayer);

        console.log(isEating, isLeaveGame, isAccident);

        if (isAccident || isLeaveGame || isEating){
            var player;

            for (var j = 0; j <  playersCount; j++) {
                player = this.model.players[j];
                gameResult += player.name + ': ' + player.snake.length+' ';
            }

            if (confirm(activePlayer.name + ' loss. ' + gameResult)){
                clearInterval(this.intervalId);
                if (typeof this.listener === 'function') {
                    document.removeEventListener('keydown', this.listener);
                    this.listener = null;
                }
                this.initializeGame();
            }
        }


        if (this.model.checkMatchesHeadAndBonus(activePlayer)){
            activePlayer.snake.push(this.model.bonusRect.coordinate);
            this.model.bonusRect = new Bonus(gameFieldW, gameFieldH);
        }
    }

    this.drawer.redraw(this.model.players, this.model.bonusRect.coordinate);
};

Controller.prototype.createListenerFunk = function () {
    var self = this;

    this.listener = function(e){
        if(!self.intervalId){
            self.intervalId = setInterval(function(){
                self.stepSnake();
            }, self.speed);
        }

        for (var i = 0; i < self.model.players.length; i++) {
            var player = self.model.players[i];
            if (player.ctrlButtons[+e.keyCode]){
                player.nextKey = player.ctrlButtons[+e.keyCode];
            }else{
                player.nextKey = player.prevKey;
            }
        }
    };
};


Controller.prototype.isLeaveGameField = function (player) {
    var leftBorder = 0,
        rightBorder = this.drawer.gameFieldW,
        topBorder = 0,
        bottomBorder = this.drawer.gameFieldH,
        headPosX = player.snake[0][0],
        headPosY = player.snake[0][1];

    return headPosX < leftBorder || headPosX >= rightBorder || headPosY < topBorder || headPosY >= bottomBorder;
};

Controller.prototype.isAccidentThemselves = function(activePlayer){
    var snakeArr = activePlayer.snake,
        snakeLength = activePlayer.snake.length,
        snakePartX = [],
        snakePartY = [],
        headPosX = activePlayer.snake[0][0],
        headPosY = activePlayer.snake[0][1];


    for (var i = 1; i < snakeLength; i++) {
        snakePartX = snakeArr[i][0];
        snakePartY = snakeArr[i][1];

        if (snakePartX === headPosX && snakePartY === headPosY){
            return true;
        }
    }
};

Controller.prototype.isEatingRival = function (activePlayer, rival) {
    var snakePlayer = activePlayer.snake,
        snakeRival = rival.snake,
        playerHeadX = activePlayer.snake[0][0],
        playerHeadY = activePlayer.snake[0][1],
        rivalPartX,
        rivalPartY;

    for (var i = 0; i < snakeRival.length; i++) {
        rivalPartX = snakeRival[i][0];
        rivalPartY = snakeRival[i][1];
        if(playerHeadX == rivalPartX && playerHeadY == rivalPartY){

            if (i<=1){
                console.log(i);
                return true;
            }else{
                snakePlayer.push(snakeRival[i]);
                snakeRival.splice(i);
                return false
            }
        }

    }

};





