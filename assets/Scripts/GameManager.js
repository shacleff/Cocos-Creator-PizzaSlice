cc.Class({
    extends: cc.Component,

    properties: {
        uiNode: cc.Node,
        gameOver: cc.Prefab,
        quitPopup: cc.Prefab,
    },

    onLoad(){
        window.game = this;
        this.status = GAME_STATUS.WELCOM;
        this.quitPopupShowed = false;
    },

    start () {
        this.status = GAME_STATUS.PLAYING;
    },

    update (dt) {
        if(this.status == GAME_STATUS.PLAYING){

        } else if(this.status == GAME_STATUS.CANNOT_PLAY){
            cc.log("Status Cannot play");

            this.status = GAME_STATUS.LOSE
        } else if(this.status == GAME_STATUS.LOSE){
            cc.log("Status LOSE");
            let gameover = cc.instantiate(this.gameOver);
            this.uiNode.addChild(gameover);
            this.status = GAME_STATUS.WELCOM;
        }
    },

    
    refresh(){
        if(this.quitPopupShowed)return false;
        window.scoreManager.reset();
        window.pizzaGeneration.reset();
        window.customerOrder.reset();
        window.holderManager.reset(true, false);

        return true;
    },

    continue(){
        if(this.quitPopupShowed)return false;
        window.pizzaGeneration.reset();
        window.customerOrder.reset();
        window.holderManager.reset(false, true);
        return true;
    },

    home(){
        if(this.quitPopupShowed)return false;

        let quit = cc.instantiate(this.quitPopup);
        this.uiNode.addChild(quit);
        this.quitPopupShowed = true;
        return true;
    },
    
});
