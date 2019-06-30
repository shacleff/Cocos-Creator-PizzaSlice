cc.Class({
    extends: cc.Component,

    properties: {
        uiNode: cc.Node,
        gameOver: cc.Prefab,
        quitPopup: cc.Prefab,
    },

    onLoad(){
        window.game = this;
    },

    start () {
        Game_Status = GAME_STATUS.PLAYING;
    },

    update (dt) {
        if(Game_Status == GAME_STATUS.PLAYING){

        } else if(Game_Status == GAME_STATUS.CANNOT_PLAY){
            cc.log("Status Cannot play");

            Game_Status = GAME_STATUS.LOSE
        } else if(Game_Status == GAME_STATUS.LOSE){
            cc.log("Status LOSE");
            let gameover = cc.instantiate(this.gameOver);
            this.uiNode.addChild(gameover);
            Game_Status = GAME_STATUS.WELCOM;
        }
    },

    
    refresh(){
        if(QuitPopupShowed)return false;
        window.scoreManager.reset();
        window.pizzaGeneration.reset();
        window.customerOrder.reset();
        window.holderManager.reset(true, false);

        return true;
    },

    continue(){
        if(QuitPopupShowed)return false;
        window.pizzaGeneration.reset();
        window.customerOrder.reset();
        window.holderManager.reset(false, true);
        return true;
    },

    home(){
        if(QuitPopupShowed)return false;

        let quit = cc.instantiate(this.quitPopup);
        this.uiNode.addChild(quit);
        QuitPopupShowed = true;
        return true;
    },
    
});
