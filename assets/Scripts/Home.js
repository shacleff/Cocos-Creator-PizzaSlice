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
        pan: cc.Node,
        holder: cc.Node,
        quitPopup: cc.Prefab,
        uiNode: cc.Node,
        hand: cc.Node,
        startGameNode: cc.Node
    },

    onLoad(){
        Game_Status = GAME_STATUS.WELCOM;
        this.isReseted = false;
        this.startGameNode.on(cc.Node.EventType.TOUCH_END, this.startGame, this);
    },

    update(){
        if(!this.isReseted)this.reset();
    },

    reset(){
        this.isReseted = true;
        let pizzaHolder1 = window.pizzaSpawner.spawnPizzaGroup(2, PIZZA_TYPE.BOT_RIGHT, true, SLICE_TYPE.SLICE_1);
        window.pizzaSpawner.putPizzaGroup(pizzaHolder1, this.holder);
        let pizzaHolder2 = window.pizzaSpawner.spawnPizzaGroup(2, PIZZA_TYPE.TOP, true, SLICE_TYPE.SLICE_2);
        window.pizzaSpawner.putPizzaGroup(pizzaHolder2, this.holder);

        let pizzaPan = window.pizzaSpawner.spawnPizzaGroup(2, PIZZA_TYPE.BOT_LEFT, true, SLICE_TYPE.SLICE_1);
        window.pizzaSpawner.putPizzaGroup(pizzaPan, this.pan);

        this.hand.getComponent(cc.Animation).play();
        this.hand.active = true;
        let action = cc.sequence(
            cc.delayTime(2),
            cc.callFunc(()=>{
                this.hand.getComponent(cc.Animation).stop();
                this.hand.active = false;
                window.holderManager.putPizzaFromPanToHolder(this.holder.getComponent('PizzaHolder'));
            }, this),
            cc.delayTime(window.config.pizzaMoveTime * 4),
            cc.callFunc(()=> {this.isReseted = false;})
        );

        this.node.runAction(action);
    },

    startGame(){
        if(QuitPopupShowed)return;
        cc.director.loadScene('GamePlay');
    },


    home(){
        if(QuitPopupShowed)return false;

        let quit = cc.instantiate(this.quitPopup);
        this.uiNode.addChild(quit);
        QuitPopupShowed = true;
        return true;
    },

});
