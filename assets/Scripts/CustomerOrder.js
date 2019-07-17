// let PizzaCreation = require('./PizzaHelper');
let PizzaCreation = require('./PizzaCreation');

let PizzaOrder = cc.Class({
    name: 'PizzaOrder',
    properties:{
        pizzaGroups: [PizzaCreation]
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        pizzaHolder: cc.Node,
        orders: [PizzaOrder],
        delayTimeForNewOrder : 2
    },

    onLoad(){
        window.customerOrder = this;
        this.pizzaHolderCom = this.pizzaHolder.getComponent('PizzaHolder');
    },

    start () {

    },

    update (dt) {
        if(this.pizzaHolderCom.getNumberPizza() <= 0 && this.node.getNumberOfRunningActions() == 0){
            this.node.runAction(cc.sequence(
                cc.delayTime(this.delayTimeForNewOrder),
                cc.callFunc(()=>{
                    let order = this.getCreationFromOrder(); 
                    for(let creation of order.pizzaGroups){
                        this.spawnPizzaToOrder(creation.number, creation.typeStart, creation.isAnticlockwise, creation.type)
                    }
                }, this)
            ))
        }
    },

    getCreationFromOrder(){
        let randomIndex = ~~(Math.random() * this.orders.length);
        let order = this.orders[randomIndex];
        let numberType = Math.round(360 / ANGLE_BETWEEN_PIZZA);
        let next = -1;
        for(let creation of order.pizzaGroups){
            if(creation.typeStart < 0 && next == -1){
                let rand = ~~(Math.random() * numberType);
                creation.typeStart = rand * ANGLE_BETWEEN_PIZZA;
                next = rand + creation.number;
                if(next >= numberType)next -= numberType;
            }else if(creation.typeStart < 0){
                creation.typeStart = next * ANGLE_BETWEEN_PIZZA;
                next = creation.typeStart + creation.number;
                if(next >= numberType)next -= numberType;
            }
        }

        return order;
    },

    spawnPizzaToOrder(number, typeStart, isAnticlockwise, typeSlice){
        let group = window.pizzaSpawner.spawnPizzaGroup(number, typeStart, isAnticlockwise, typeSlice);
        let isPut = this.pizzaHolderCom.putPizzaGroup(group);
        if(!isPut)group.destroy();
    },

    campareWithOrder(holderCom){
        // if(this.pizzaHolderCom.fitOrder)return;

        let holderCompare = holderCom.getCompare();
        let cusCompare = this.pizzaHolderCom.getCompare();
        
        if(cusCompare.length == holderCompare.length && cusCompare.length == MAX_PIZZA_ON_HOLDER){
            for(let i = 0; i < cusCompare.length; i++){
                if(cusCompare[i].slice != holderCompare[i].slice)
                    return false;
            }
            window.scoreManager.increFitOrder();
            this.removeWhenFitOrder(holderCom);
            return true;
        }
        return false;
    },

    removeWhenFitOrder(holder){
        let pizzaInOrder = Array.from(this.pizzaHolderCom.pizzaGroups);
        let action = cc.sequence(
            cc.delayTime(window.config.pizzaMoveTime),
            cc.callFunc(()=>{
                window.holderManager.movePizzaGroupFromHolderToHolder(holder.node, this.pizzaHolder);
                this.pizzaHolderCom.remove(true, true);
                holder.fitOrder = false;
            }),
            cc.delayTime(window.config.pizzaMoveTime),
            cc.callFunc(()=>{
                for(let pg of pizzaInOrder)pg.destroy();
                pizzaInOrder.length = 0;
            })
        )
        this.pizzaHolderCom.remove(false, false);
        holder.fitOrder = true;
        this.node.runAction(action);
    },
    
    reset(){
        this.pizzaHolderCom.remove(true, false);
    },
});
