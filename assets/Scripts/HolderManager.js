let HolderLink = require('./HolderLink')

cc.Class({
    extends: cc.Component,

    properties: {
        pizzaHolders :{
            default: [],
            type: cc.Node
        },
        holderLink: [HolderLink],

        nextHolder: cc.Node,
        pan: cc.Node,
    },

    onLoad(){
        window.holderManager = this;
        this.enableTapToPlace();
        this.panHolderCom = this.pan.getComponent('PizzaHolder');
    },

    update(dt){
        if(this.panHolderCom.getNumberPizza() == 0){
            this.pizzaHolders.forEach(element => {
                element.getComponent('PizzaHolder').stopShowCanFit();
            });
            this.putPizzaFromNextToPan();
            let available = this.getAvailableHolder();
            if(available.length == 0){
                if(this.node.getNumberOfRunningActions() == 0){
                    this.node.runAction(cc.sequence(
                        cc.delayTime(2),
                        cc.callFunc(()=>{
                            window.game.status = GAME_STATUS.CANNOT_PLAY;
                        }) 
                    ));
                }
            }else{
                this.node.stopAllActions();
                window.game.status = GAME_STATUS.PLAYING;
                // window.game.status = GAME_STATUS.CANNOT_PLAY;
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
        for(let holder of this.pizzaHolders){
            let com = holder.getComponent('PizzaHolder');
            holder.targetOff(holder);
            holder.on('click', ()=> this.putPizzaFromPanToHolder(holder), holder);

            // holder.node.on(cc.Node.EventType.TOUCH_CANCEL, ()=>com.score());
        }
    },

    enableTapToDestroy(){
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
        if(findIndex < this.holderLink.length){
            let link = this.holderLink[findIndex];
            for(let i of link.links){
                let count = this.pizzaHolders[i].getComponent('PizzaHolder').remove(true, true);
                score += count;
            }
        }

        window.customerOrder.campareWithOrder(holder);
        window.scoreManager.increWithPizza(score);
    },

    //@param : holder - PizzaHolder Object
    putPizzaFromPanToHolder(holder){
        let canMove = this.movePizzaGroupFromHolderToHolder(this.pan, holder);
        if(canMove)window.pizzaGeneration.move();
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
