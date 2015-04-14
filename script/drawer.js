function Drawer(){
    this.snakePartSide = 10;
    this.step = 12;
    this.canvasWidth = null;
    this.canvasHeight = null;
    this.gameFieldW = null;
    this.gameFieldW = null;
    this.canvasElem = null;
    this.getWindowSize();
}


Drawer.prototype.getWindowSize = function(){
    this.gameFieldW = Math.floor(window.innerWidth / this.step) - 1;
    this.gameFieldH = Math.floor(window.innerHeight / this.step) - 1;
    this.canvasHeight = (this.gameFieldH * this.step);
    this.canvasWidth = (this.gameFieldW * this.step);

    console.log(this.canvasWidth, this.canvasHeight);
};


Drawer.prototype.createCanvas = function(containerElem){
    this.canvasElem = document.createElement('CANVAS');
    this.canvasElem.width =  this.canvasWidth;
    this.canvasElem.height = this.canvasHeight;
    this.canvasElem.id = 'snake';
    containerElem.appendChild(this.canvasElem);
};


Drawer.prototype.createGame = function () {
    var parentElem,
        containerElem;

    if (!!document.getElementById('wrapper')){
        containerElem = document.getElementById('wrapper');
        containerElem.innerHTML = '';
        this.createCanvas(containerElem);
    }else{
        parentElem = document.getElementsByTagName('body')[0];
        containerElem = document.createElement('DIV');
        containerElem.id = 'wrapper';
        parentElem.appendChild(containerElem);
        this.createCanvas(containerElem);
    }
};

Drawer.prototype.redraw = function (activePlayers, bonus) {
    var ctx = this.canvasElem.getContext('2d'),
        activeUserCount = activePlayers.length,
        redrawArr = [],
        max,
        rect;

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    redrawArr.push(bonus);
    for (var j = 0; j < activeUserCount; j++) {
        redrawArr = redrawArr.concat(activePlayers[j].snake);
    }

    max = redrawArr.length;
    for (var i = 0; i < max; i++) {
        rect = redrawArr[i];
        ctx.fillRect(rect[0]*(
            this.snakePartSide+2),
            rect[1]*(this.snakePartSide+2),
            this.snakePartSide, this.snakePartSide
        );
    }
};