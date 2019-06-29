let PizzaCreation = require('./PizzaCreation');

var PizzaCompletion = cc.Class({
    name: 'PizzaCompletion',
    properties:{
        pizzaCreations : [PizzaCreation],
        pizzaHolder: null, // PizzaHolder object
    }
});
