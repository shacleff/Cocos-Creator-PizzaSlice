// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        score: 0,
        scoreIncreEachPizza: 1,
        scoreExtraWhenFitOrder: 10,
        numberFitOrderToGetPower: 3,
        numberPowerReceived: 1,
        scoreLabel: cc.Label,
        coinLabel: cc.Label
    },
    onLoad(){
        window.scoreManager = this;
        this.targetScore = this.score;
        this.totalScore = 0;
        this.reset();
    },

    increWithPizza(number){
        this.targetScore += this.scoreIncreEachPizza * number;
        this.totalScore += this.scoreIncreEachPizza * number;
        this.updateScore();
    },

    update(dt){
        if(this.score < this.targetScore){
            this.score++;
            this.updateScore();
        }
    },

    increFitOrder(){
        this.targetScore += this.scoreExtraWhenFitOrder;
        this.totalScore += this.scoreExtraWhenFitOrder;
        this.countFitOrder++;
        this.updateScore();
    },

    updateScore(){
        if(typeof this.scoreLabel != 'undefined')this.scoreLabel.string = this.score;
        if(this.countFitOrder >= this.numberFitOrderToGetPower){
            this.countFitOrder = 0;
            window.powerUpCharge.getPowerUpCharge(this.numberPowerReceived);
        }
        this.coinLabel.string = this.totalScore;
    },

    reset(){
        this.score = 0;
        this.targetScore = this.score;
        this.countFitOrder = 0;
        this.updateScore();
    }

});
