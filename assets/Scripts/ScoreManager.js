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
        scoreLabel: cc.Label
    },
    onLoad(){
        window.scoreManager = this;
        this.reset();
    },

    increWithPizza(number){
        this.score += this.scoreIncreEachPizza * number;
        this.updateScore();
    },

    increFitOrder(){
        this.score += this.scoreExtraWhenFitOrder;
        this.countFitOrder++;
        this.updateScore();
    },

    updateScore(){
        if(typeof this.scoreLabel != 'undefined')this.scoreLabel.string = this.score;
        if(this.countFitOrder >= this.numberFitOrderToGetPower){
            this.countFitOrder = 0;
            window.powerUpCharge.getPowerUpCharge(this.numberPowerReceived);
        }
    },

    reset(){
        this.score = 0;
        this.countFitOrder = 0;
        this.updateScore();
    }

});
