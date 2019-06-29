cc.Class({
    extends: cc.Component,

    properties: {
        typeStart : 0,
        isAnticlockwise : false,
        pizzas : [],
    },

    push(pizza){
        const iac = this.isAnticlockwise ? 1 : -1;
        const type = getTrueAngle(this.typeStart + this.pizzas.length * ANGLE_BETWEEN_PIZZA * iac);
        pizza.angle = type;
        pizza.position = cc.v2(0,0);
        this.pizzas.push(pizza);
        this.node.addChild(pizza);
    }

});
