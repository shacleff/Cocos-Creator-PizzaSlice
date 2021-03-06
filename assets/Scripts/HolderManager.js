let HolderLink = require('./HolderLink')
const SCALE_TAG = 6;
cc.Class({
    extends: cc.Component,

    properties: {
        pizzaHolders :{
            default: [],
            type: cc.Node
        },
        scaleHolder: 0.8,
        scaleDuration : 0.1,
        holderLink: [HolderLink],

        nextHolder: cc.Node,
        pan: cc.Node,
        darkenNode: cc.Node,
        playUITopArea: cc.Node,
        alterCannotPlace: cc.Node,
        moveToLoseSceneAfter: 1,
        
    },

    onLoad(){
        window.holderManager = this;
        this.enableTapToPlace();
        this.panHolderCom = this.pan.getComponent('PizzaHolder');
        if(this.alterCannotPlace)this.alterCannotPlace.active = false;
    },

    start(){
        this.holderOriginScale = 1;
        if(this.pizzaHolders.length > 0){
            this.holderOriginScale = this.pizzaHolders[0].scale;
            this.scaleHolder *= this.holderOriginScale;
        }
    },

    update(dt){
        if(Game_Status == GAME_STATUS.WELCOM)return;
        
        if(this.panHolderCom.getNumberPizza() == 0){
            this.pizzaHolders.forEach(element => {
                element.getComponent('PizzaHolder').stopShowCanFit();
            });
            this.putPizzaFromNextToPan();
            let available = this.getAvailableHolder();
            if(available.length == 0){
                if(this.node.getNumberOfRunningActions() == 0){
                    this.alterCannotPlace.active = true;
                    this.node.runAction(cc.sequence(
                        cc.delayTime(this.moveToLoseSceneAfter),
                        cc.callFunc(()=>{
                            Game_Status = GAME_STATUS.CANNOT_PLAY;
                            this.alterCannotPlace.active = false;
                        }) 
                    ));
                }
            }else{
                this.node.stopAllActions();
                Game_Status = GAME_STATUS.PLAYING;
                // Game_Status = GAME_STATUS.CANNOT_PLAY;
                available.forEach(element => {
                    element.getComponent('PizzaHolder').showCanFit();
                });
            }
        }
    },

    reset(isAll, useAnimate){
        for(let holder of this.pizzaHolders)
            holder.getComponent('PizzaHolder').remove(true, useAnimate);
        if(isAll){
            this.nextHolder.getComponent('PizzaHolder').remove(true, useAnimate);
            this.pan.getComponent('PizzaHolder').remove(true, useAnimate);
        }
        this.alterCannotPlace.active = false;
    },

    getAvailableHolder(){
        let panCompare = this.panHolderCom.getCompare();
        let count = [];
        for(let holder of this.pizzaHolders){
            let com = holder.getComponent('PizzaHolder');
            let compare = com.getCompare();
            let isOk = true;
            for(let c of panCompare){
                let find = compare.findIndex(e => e.type == c.type);
                if(find != -1){
                    isOk = false;
                    break;
                }
            }
            if(isOk)count.push(com);
        }
        return count;
    },

    enableTapToPlace(){
        if(this.darkenNode)this.darkenNode.active = false;
        if(this.playUITopArea)this.playUITopArea.zIndex = 3;
        let scaleHolder = (holder, duration, scaleTo) =>{
            holder.stopActionByTag(SCALE_TAG);
            let action = cc.scaleTo(duration, scaleTo, scaleTo);
            action.setTag(SCALE_TAG);
            holder.runAction(action);
        };

        for(let holder of this.pizzaHolders){
            let com = holder.getComponent('PizzaHolder');
            holder.targetOff(holder);
            // holder.on('click', ()=> this.putPizzaFromPanToHolder(holder), holder);
            holder.on(cc.Node.EventType.TOUCH_START, ()=> {
                scaleHolder(holder, this.scaleDuration, this.scaleHolder);
            }, holder)
            holder.on(cc.Node.EventType.TOUCH_END, ()=> {
                this.putPizzaFromPanToHolder(holder);
                scaleHolder(holder, this.scaleDuration, this.holderOriginScale);
            }, holder);
            holder.on(cc.Node.EventType.TOUCH_CANCEL, ()=> {
                scaleHolder(holder, this.scaleDuration, this.holderOriginScale);
            }, holder);
            
            // holder.node.on(cc.Node.EventType.TOUCH_CANCEL, ()=>com.score());
        }
    },

    enableTapToDestroy(){
        if(this.darkenNode)this.darkenNode.active = true;
        if(this.playUITopArea)this.playUITopArea.zIndex = 1;
        let canvas = cc.find('Canvas');
        canvas.once(cc.Node.EventType.TOUCH_END, ()=>{
            cc.log("Touch else to cancel");
            window.holderManager.enableTapToPlace();
        }, canvas);

        for(let holder of this.pizzaHolders){
            let com = holder.getComponent('PizzaHolder');
            holder.targetOff(holder);
            holder.on('click', ()=> {
                if(com.pizzaGroups.length > 0){
                    com.score();
                    window.powerUpCharge.costPowerUpChange();
                }
                canvas.emit(cc.Node.EventType.TOUCH_END);
            }, holder);
        }
    },  

    //@param : holder - PizzaHolder Object
    scoreAtHolder(holder, useAnimate = true){
        let score = holder.getNumberPizza();
        let findIndex = this.pizzaHolders.findIndex(o => o.uuid == holder.node.uuid);
        if(findIndex < this.holderLink.length && findIndex != -1){
            let link = this.holderLink[findIndex];
            for(let i of link.links){
                let count = this.pizzaHolders[i].getComponent('PizzaHolder').remove(true, true);
                score += count;
            }
        }

        if(window.customerOrder)window.customerOrder.campareWithOrder(holder);
        if(window.scoreManager)window.scoreManager.increWithPizza(score);
    },

    //@param : holder - PizzaHolder Object
    putPizzaFromPanToHolder(holder){
        let canMove = this.movePizzaGroupFromHolderToHolder(this.pan, holder);
        if(canMove && window.pizzaGeneration)window.pizzaGeneration.move();
    },

    putPizzaFromNextToPan(){
        this.movePizzaGroupFromHolderToHolder(this.nextHolder, this.pan);

    },

    //@holder1/holder2 : cc.Node which has component : PizzaHolder
    movePizzaGroupFromHolderToHolder(holderFrom, holderTo){
        let holderFromCom = holderFrom.getComponent('PizzaHolder');
        let holderToCom = holderTo.getComponent('PizzaHolder');

        for(let pg of holderFromCom.pizzaGroups)
            if(!holderToCom.putPizzaGroup(pg.node))return false;
        holderFromCom.remove();
        return true;
    },

    
});
