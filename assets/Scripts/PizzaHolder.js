const ACTION_HINT = 7;

cc.Class({
    extends: cc.Component,

    properties: {
        pizzaGroups : [],    //PizzaGroup Objects
        playAble: true,
        timeFade: 1,
        fadeOutTo: 120,
    },

    onLoad () {
        this.isShowingFit = false;
    },

    update(dt){
        if(this.getNumberPizza() >= 6 && this.playAble){
            this.score();
        }
    },

    putPizzaGroup(pizzaGroup){
        if(pizzaGroup.getNumberOfRunningActions() > 0)return;

        let pizzaGroupCom = pizzaGroup.getComponent('PizzaGroup');
        if(!this.availableToPut(pizzaGroupCom)){
            if(pizzaGroup.parent && pizzaGroup.parent && this.node)
                this.animateMove(pizzaGroup, true);
            return false;
        }

        let pointHolder = this.node.getChildByName('HolderPoint');
        if(pointHolder){
            // pizzaGroup.position = pointHolder.position.clone();
            let holderSize = pointHolder.getContentSize();
            for(let pizza of pizzaGroupCom.pizzas){
                let pizzaSize = pizza.getContentSize();
                let ratio = (holderSize.height / 2) / pizzaSize.height;
                let size = cc.size(pizzaSize.width * ratio, pizzaSize.height * ratio);
                pizza.setContentSize(size);
            }
        }

        this.pizzaGroups.push(pizzaGroupCom);

        //animation move
        if(pizzaGroup.parent && pizzaGroup.parent && this.node){
            this.animateMove(pizzaGroup, false);
        }else{
            pizzaGroup.position = pointHolder.position.clone();
            pizzaGroup.removeFromParent(false);
            this.node.addChild(pizzaGroup);
        }
       
        return true;
    },

    availableToPut(pizzaGroupCom){
        let used = [];
        for(let pizzaG of this.pizzaGroups){
            for(let pizza of pizzaG.pizzas){
                used.push(pizza.angle);
            }
        }

        for(let pizza of pizzaGroupCom.pizzas){
            if(used.findIndex(a => a == pizza.angle) != -1)return false;
        }
        return true;
    },

    animateMove(pizzaGroup, isRevert){
        let pointHolder = this.node.getChildByName('HolderPoint');
        let fromPos = pizzaGroup.parent.convertToWorldSpaceAR(pizzaGroup.position);
        let toPos = this.node.parent.convertToWorldSpaceAR( this.node.position);
        let action = null;
        if(isRevert){
            action = cc.sequence(
                cc.moveBy(window.config.pizzaMoveTime / 2, toPos.sub(fromPos)),
                cc.moveBy(window.config.pizzaMoveTime / 2, fromPos.sub(toPos)),
            );
        }else {
            action = cc.sequence(
                cc.moveBy(window.config.pizzaMoveTime, toPos.sub(fromPos)),
                cc.callFunc(()=>{
                    pizzaGroup.position = pointHolder.position.clone();
                    pizzaGroup.removeFromParent(false);
                    this.node.addChild(pizzaGroup);
            }));
        }
        pizzaGroup.runAction(action);
    },

    getCompare(){
        let array = [];
        for(let pg of this.pizzaGroups){
            for(let pizza of pg.pizzas){
                let spriteName = pizza.getComponent(cc.Sprite).spriteFrame.name;
                array.push({
                    type: pizza.angle,
                    slice: Number(spriteName[spriteName.length - 1]),
                });
            }
        }
        array.sort((a, b)=> a.type - b.type);
        return array;
    },

    remove(isClean = false, useAnimate = true){
        if(isClean){
            for(let g of this.pizzaGroups){
                if(useAnimate){
                    g.node.runAction(cc.sequence(
                        cc.fadeOut(0.5),
                        cc.callFunc(()=>{
                            g.node.destroy();
                        }, g)
                    ))
                }else{
                    g.node.destroy();
                }
            }
        }
        let count = this.getNumberPizza();
        this.pizzaGroups.length = 0;
        return count;
    },

    score(){
        window.holderManager.scoreAtHolder(this);
        this.remove(true, true);
    },

    getNumberPizza(){
        let count = 0;
        for(let group of this.pizzaGroups)count += group.pizzas.length;
        return count;
    },

    showCanFit(){
        if(this.isShowingFit)return;
        for(let pg of this.pizzaGroups){
            this.isShowingFit = true;
            let action = cc.repeatForever(cc.sequence(
                cc.fadeTo(this.timeFade, this.fadeOutTo),
                cc.fadeTo(this.timeFade, 255)
            ));
            action.setTag(ACTION_HINT);
            pg.node.runAction(action);
        }
    },

    stopShowCanFit(){
        for(let pg of this.pizzaGroups){
            pg.node.stopActionByTag(ACTION_HINT);
            pg.node.opacity = 255;
        }
        this.isShowingFit = false;
    }
});
