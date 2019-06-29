let Range = require('./Range');
let PizzaCreation = require('./PizzaCreation');
let PizzaCompletion = require('./PizzaCompletion');

cc.Class({
    extends: cc.Component,

    properties: {
        currentPhase: 1,
        numberPizzaEachGroup :{
            default: null,
            type: Range
        },
        stayAliveMoves: {
            default: null,
            type: Range
        },
        numberMovesToHelp: 2,
        capAvailableToFitCustomerOrder : 2,
    },

    onLoad () {
        window.pizzaGeneration = this;
        this.queue = [];
    },

    start () {
        this.reset();
    },

    update (dt) {
    },

    getCreation(){
        if(this.queue.length > 0){
            return this.queue.shift();
        }
        if(this.currentPhase == 1){
            if(this.countMove >= this.numberMovesToHelp){
                let holders = this.getHoldersCanCompleteBy();
                shuffleArray(holders);

                let creation = this.getSliceCanFitWithCustomerOrder(holders);
                if(creation != null && creation.length <= this.capAvailableToFitCustomerOrder){
                    for(let c of creation){
                        cc.log(`Avaiable For COrder : number ${c.number} - typeStart ${c.typeStart} - typeSlice ${c.type}`);
                        this.queue.push(c);
                    }
                    this.countMove = 0;
                    return this.queue.shift();
                }

                creation = this.getSliceToFitMostHolders(holders);
                if(creation){
                    this.countMove = 0;
                    return creation;
                }  
            }
        }

        return this.getRandomCreation();
    },

    getSliceCanFitWithCustomerOrder(holders){
        if(holders.length > 0){
            let customerOrder = window.customerOrder.pizzaHolderCom;
            let customerCompare = customerOrder.getCompare();
            for(let completion of holders){
                let cusArrayClone = Array.from(customerCompare);
                // if(completion.pizzaCreations.length > 1)continue;
                let campare = completion.pizzaHolder.getCompare();
                if(campare.length == 0)continue;
                // for(let o of campare)cc.log(`Compare : ${o.type} - ${o.slice}`);
                let isOk = true;
                for(let o of campare){
                    let find = cusArrayClone.findIndex(cc => cc.type == o.type && cc.slice == o.slice);
                    if(find == -1){
                        isOk = false;
                        break;
                    }else{
                        cusArrayClone.splice(find, 1);
                    }
                }
                
                if(isOk){
                    let creation = [];
                    for(let c of completion.pizzaCreations){
                        creation.push(new PizzaCreation);
                        let last = creation[creation.length - 1];
                        last.typeStart = c.typeStart;
                        last.type = null;
                        last.number = 0;
                        for(let i = 0; i < c.number; i++){
                            let find = cusArrayClone.findIndex(cc => cc.type == c.typeStart + i * ANGLE_BETWEEN_PIZZA);
                            if(find != -1){
                                if(last.type == null){
                                    last.type = cusArrayClone[find].slice;
                                    last.number++;
                                    cusArrayClone.splice(find, 1);
                                }else{
                                    if(cusArrayClone[find].slice != last.type){
                                        creation.push(new PizzaCreation);
                                        last = creation[creation.length - 1];
                                        last.number = 1;
                                        last.typeStart = c.typeStart + ANGLE_BETWEEN_PIZZA * i;
                                        if(last.typeStart >= 360) last.typeStart -= 360;
                                        last.type = cusArrayClone[find].slice;
                                    }else{
                                        last.number++;
                                    }
                                }    
                            }
                        }
                    }
                    return creation;
                }
            }
        }
        return null;
    },

    getSliceToFitMostHolders(holders){
        if(holders.length > 0){
            let mostPizzaHolder = null;
            let mostNumberPizza = 0;
            for(let completion of holders){
                if(completion.pizzaCreations.length == 1){
                    let numberPizzas = completion.pizzaHolder.getNumberPizza();
                    if(numberPizzas >= mostNumberPizza){
                        mostPizzaHolder = completion;
                        mostNumberPizza = numberPizzas;
                    }
                }
            }

            if(mostPizzaHolder){
                cc.log(`Most with number pizza : ${mostPizzaHolder.pizzaHolder.getNumberPizza()}`);
                let creation = mostPizzaHolder.pizzaCreations[0];
                cc.log(`Most with creation pizza : ${creation.number} - ${creation.typeStart}`);
                creation.type = getRandomRange(SLICE_TYPE.SLICE_1, SLICE_TYPE.COUNT - 1);
                return creation;
            }      
        }
        return null;
    },

    getHoldersCanCompleteBy(){
        let completions = [];
        
        for(let holder of window.holderManager.pizzaHolders){
            let holderCom = holder.getComponent('PizzaHolder');
            if(holderCom){
                let cases = this.findPieceLeftOfHolder(holderCom);
                let completion = new PizzaCompletion();
                completion.pizzaHolder = holderCom;
                for(let c of cases){
                    let creation = new PizzaCreation();
                    creation.number = c.length;
                    creation.typeStart = c[0] * ANGLE_BETWEEN_PIZZA;
                    creation.isAnticlockwise = true;
                    completion.pizzaCreations.push(creation);
                }
                completions.push(completion);
            }
        }

        completions = completions.filter(value => value.pizzaCreations.length > 0);

        return completions;
    },

    findPieceLeftOfHolder(holderCom){
        let cases = [];

        if(holderCom.pizzaGroups.length == 0)return cases;
        let array = []; 
        for(let i = 0; i < 360 / ANGLE_BETWEEN_PIZZA; i++)array.push(i);
        for(let pg of holderCom.pizzaGroups)
            for(let p of pg.pizzas)
                removeFromArray(array, Math.round(p.angle / ANGLE_BETWEEN_PIZZA));
        if(array.length > this.numberPizzaEachGroup.max || array.length == 0)return cases;

        for(let i = 0; i < array.length; i++){
            let current = array[i];
            if(cases.length == 0){
                cases.push(new Array);
                cases[0].push(current);
            }else{
                let check = cases.findIndex(c => c.findIndex(e => Math.abs(e - current) == 1 || Math.abs(e - current) == ~~(360 / ANGLE_BETWEEN_PIZZA - 1)) != -1);
                if(check == -1){
                    cases.push(new Array);
                    cases[cases.length - 1].push(current);
                }else{
                    if(current < cases[check][0] || Math.abs(cases[check][0] - current) == ~~(360 / ANGLE_BETWEEN_PIZZA - 1)){
                        cases[check].unshift(current);
                    }else{
                        cases[check].push(current);
                    }
                }
            }
        }

        return cases;
    },

    getRandomCreation(){
        let creation = new PizzaCreation();
        creation.number = getRandomRange(this.numberPizzaEachGroup.min, this.numberPizzaEachGroup.max);
        creation.typeStart = ANGLE_BETWEEN_PIZZA * ~~(Math.random() * (360 / ANGLE_BETWEEN_PIZZA))
        creation.isAnticlockwise = (~~Math.random() * 1) == 1 ? true : false;
        creation.type = getRandomRange(SLICE_TYPE.SLICE_1, SLICE_TYPE.COUNT - 1);
        return creation;
    },

    reset(){
        this.countMove = 0;
        this.countStayAlive = getRandomRange(this.stayAliveMoves.min, this.stayAliveMoves.max);
        this.totalCountMove = this.countStayAlive;
        this.queue.length = 0;
    },

    move(){
        this.countMove++;
        if(this.currentPhase == 1)this.totalCountMove--;
        if(this.totalCountMove <= 0 && this.currentPhase == 1){
            this.currentPhase = 2;
        }
        cc.log("Total move : " + this.totalCountMove + " on stay : " + this.countStayAlive);
    }
});
