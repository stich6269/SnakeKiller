function Model(){
    this.players = [];
    this.bonusRect = null;
}


function Player(options, ctrlButtons){
    this.name = options.name;
    this.startLendth = 3;
    this.startPos = options.startPos;
    this.snake =(function(self){
        var part = [],
            snakeArr = [];

        for (var i = 0; i < self.startLendth; i++) {
            part = [];
            part[0] = i + self.startPos[0];
            part[1] = 0 + self.startPos[1];
            snakeArr.unshift(part);
        }
        return snakeArr;
    })(this);
    this.ctrlButtons = ctrlButtons;
    this.prevKey = options.startDirect;
    this.nextKey = null;
}


function Bonus(gameFieldW, gameFieldH){
    this.coordinate = (function(){
        var rect = [];

        rect[0] =  Math.ceil(Math.random() * gameFieldW);
        rect[1] =  Math.ceil(Math.random() * gameFieldH);
        return rect;
    })();
}


Model.prototype.getUpdateSnakeHeadXY = function(player){
    var firsPart = player.snake[0],
        newFirsPart = [],
        button = player.nextKey || player.prevKey;

    newFirsPart[0] = firsPart[0];
    newFirsPart[1] = firsPart[1];

    var oppositeDirections = {
        'RIGHT_SIDE' : 'LEFT_SIDE',
        'LEFT_SIDE' : 'RIGHT_SIDE',
        'LOWER_SIDE': 'UPPER_SIDE',
        'UPPER_SIDE' : 'LOWER_SIDE'
    };

    var directionChanges = {
        'RIGHT_SIDE' : [1, 0, 'RIGHT_SIDE'],
        'LEFT_SIDE' : [-1, 0, 'LEFT_SIDE'],
        'LOWER_SIDE' : [0, 1, 'LOWER_SIDE'],
        'UPPER_SIDE' : [0, -1, 'UPPER_SIDE']
    };

    function updateCoordinate(){
        newFirsPart[0] += directionChanges[button][0];
        newFirsPart[1] += directionChanges[button][1];
    }

    if (oppositeDirections[button] != player.prevKey) {
        updateCoordinate();
        player.prevKey = directionChanges[button][2];
        return newFirsPart;
    }else{
        button = player.prevKey;
        player.nextKey = directionChanges[button][2];
        updateCoordinate();
        return newFirsPart;
    }
};


Model.prototype.updSnakePosition = function (player) {
    var newSnakeHead,
        countSnakePart = player.snake.length;

    newSnakeHead = this.getUpdateSnakeHeadXY(player);
    if (newSnakeHead){
        for (var i = countSnakePart-1; i; i--) {
            player.snake[i][0] = player.snake[i-1][0];
            player.snake[i][1] = player.snake[i-1][1];
        }
        player.snake[0][0] = newSnakeHead[0];
        player.snake[0][1] = newSnakeHead[1];
    }
};


Model.prototype.checkMatchesHeadAndBonus = function (player) {
    var headX = player.snake[0][0],
        headY = player.snake[0][1],
        bonusX = this.bonusRect.coordinate[0],
        bonusY = this.bonusRect.coordinate[1];

    return headX === bonusX && headY === bonusY;
};
