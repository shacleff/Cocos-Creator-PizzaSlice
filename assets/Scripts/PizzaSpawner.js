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
        pizzaPrefabs :{
            default: [],
            type: cc.Prefab
        },
        pizzaGroupPrefabs: {
            default: null,
            type: cc.Prefab
        },

        typeSlices : [cc.SpriteFrame],

        nextHolder: cc.Node,
    },

    onLoad(){
        window.pizzaSpawner = this;
        this.nextHolderCom = this.nextHolder.getComponent('PizzaHolder');
    },

    update(dt){
        if(Game_Status == GAME_STATUS.WELCOM)return;
        
        if(this.nextHolderCom.getNumberPizza() == 0){
            let creation = this.getCreationOfPizza();
            this.spawnPizzaToNext(creation.number, creation.typeStart, creation.isAnticlockwise, creation.type);
        }
    },

    getCreationOfPizza(){
        let generate = this.node.getComponent('PizzaGeneration');
        return generate.getCreation();
    },

    spawnPizzaToNext(number, typeStart, isAnticlockwise, typeSlice){
        if(!this.nextHolder)return;
        let pizzaG = this.spawnPizzaGroup(number, typeStart, isAnticlockwise, typeSlice);
        let isput = this.putPizzaGroup(pizzaG, this.nextHolder);
        if(!isput)pizzaG.destroy();
    },

    //@number   : the number of pizza in group
    spawnPizzaGroup(number, typeStart, isAnticlockwise, typeSlice){
        let group = cc.instantiate(this.pizzaGroupPrefabs);
        let pizzaGroup = group.getComponent('PizzaGroup')
        pizzaGroup.typeStart = typeStart;
        pizzaGroup.isAnticlockwise = isAnticlockwise;
        for(let i = 0; i < number; ++i){
            let pizza = this.spawn(0, PIZZA_TYPE.TOP, typeSlice);
            pizzaGroup.push(pizza);
        }
        
        return group;
    },
    
    putPizzaGroup(group, holder){
        let pizzaHolder = holder.getComponent('PizzaHolder');
        return pizzaHolder.putPizzaGroup(group);
    },

    //@i    : index of pizzaPrefabs array
    //@type : PIZZA_TYPE in Global.js 
    spawn(i, type, typeSlice){
        if(this.pizzaPrefabs.length == 0)return;
        i = cc.misc.clampf(i, 0, this.pizzaPrefabs.length - 1);
        let pizza = cc.instantiate(this.pizzaPrefabs[i]);
        pizza.angle = type;
        pizza.getComponent(cc.Sprite).spriteFrame = this.typeSlices[typeSlice - 1];
        if(window.scaler)window.scaler.scaleNode(pizza);
        return pizza;
    },

});
