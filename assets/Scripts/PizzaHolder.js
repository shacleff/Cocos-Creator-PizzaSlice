const ACTION_HINT = 7;
const ANIMATION_FADE = 'animtion0';

cc.Class({
    extends: cc.Component,

    properties: {
        pizzaGroups : [],    //PizzaGroup Objects
        arrayToClean: [],
        playAble: true,
        timeFade: 1,
        fadeOutTo: 120,
        destroyNode : cc.Node,
        destroyParticle: cc.Prefab,
    },

    onLoad () {
        this.isShowingFit = false;
        if(this.destroyNode){
            this.destroyNode.zIndex = 10;
            this.destroyNode.active = false;
        }
        this.pointHolder = this.node.getChildByName('HolderPoint');
        this.pointHolder.zIndex = 1;
        this.fitOrder = false;
    },

    update(dt){
        if(this.getNumberPizza() >= 6 && this.playAble && !this.fitOrder){
            this.score();
        }
    },

    putPizzaGroup(pizzaGroup){
        if(pizzaGroup.getNumberOfRunningActions() > 0)return false;

        let pizzaGroupCom = pizzaGroup.getComponent('PizzaGroup');
        if(!this.availableToPut(pizzaGroupCom)){
            if(pizzaGroup.parent && pizzaGroup.parent && this.node)
                this.animateMove(pizzaGroup, true);
            return false;
        }

        if(this.pointHolder){
            // pizzaGroup.position = pointHolder.position.clone();
            let holderSize = this.pointHolder.getContentSize();
            for(let pizza of pizzaGroupCom.pizzas){
                let pizzaSize = pizza.getContentSize();
                let ratio = (holderSize.height / 2) / pizzaSize.height;
                let size = cc.size(pizzaSize.width * ratio, pizzaSize.height * ratio);
                pizza.setContentSize(size);
            }
        }

        this.pizzaGroups.push(pizzaGroupCom);

        //animation move
        if(pizzaGroup.parent && this.node){
            this.animateMove(pizzaGroup, false);
        }else{
            pizzaGroup.position = this.pointHolder.position.clone();
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
                    pizzaGroup.position = this.pointHolder.position.clone();
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
        if(this.getNumberPizza() <= 0)return 0;
        if(isClean){
            if(useAnimate && this.destroyNode){
                this.arrayToClean = Array.from(this.pizzaGroups);
                let action = cc.sequence(
                    cc.delayTime(window.config.pizzaMoveTime),
                    cc.callFunc(()=>{
                        this.destroyNode.active = true;
                        let ard = this.destroyNode.getComponent(dragonBones.ArmatureDisplay);
                        ard.playAnimation(ANIMATION_FADE, 1);
                        ard.addEventListener(dragonBones.EventObject.COMPLETE, this.animationEventHandler, this);
                        if(this.pointHolder) this.pointHolder.addChild(cc.instantiate(this.destroyParticle))
                    }, this), 
                    cc.delayTime(0.2),
                    cc.callFunc(()=>{
                        for(let g of this.arrayToClean)g.node.destroy();
                        this.arrayToClean.length = 0;
                    }));
                this.node.runAction(action);
            } else {
                for(let g of this.pizzaGroups){
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
        if(!this.fitOrder)this.remove(true, true);
    },

    getNumberPizza(){
        let count = 0;
        for(let group of this.pizzaGroups)if(group && group.pizzas)count += group.pizzas.length;
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
    },

    animationEventHandler(event){
        if(event.type === dragonBones.EventObject.COMPLETE){
            if(event.animationState.name == ANIMATION_FADE){
                // for(let g of this.arrayToClean)g.node.destroy();
                // this.arrayToClean.length = 0;
                if(this.destroyNode)this.destroyNode.active = false;
            }
        }
    }
});
