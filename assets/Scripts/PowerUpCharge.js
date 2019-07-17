cc.Class({
    extends: cc.Component,

    properties: {
        number : 0,
        powerUpBtn: cc.Node,
        countLabel: cc.Label,
        cameraIcon: cc.Node,
        spriteFrameOn: cc.SpriteFrame,
        spriteFrameOff: cc.SpriteFrame,
        ads: cc.Prefab,
        numberChargeAddedWhenAds : 3,
        percentGrow: 30,
        timeMoveIcon: 0.5,
        sendPoint: cc.Node,
        bombIcon: cc.Prefab,
        effectGetCharge: cc.Prefab,
    },

    onLoad () {
        window.powerUpCharge = this;
        this.buttonFrame = this.powerUpBtn.getChildByName('Background').getComponent(cc.Sprite);
        this.updateCount();
    },


    getPowerUpCharge(number){
        this.number += number;
        // for(let i = 0; i < number; i++){
        //     let icon = cc.instantiate(this.bombIcon);
        //     this.sendPoint.parent.addChild(icon);
        //     icon.position = this.sendPoint.position;
        //     icon.runAction(cc.sequence(
        //         cc.moveTo(this.timeMoveIcon + i * this.timeMoveIcon / 5, this.powerUpBtn.parent.position),
        //         cc.callFunc(()=>{
        //             if(this.effectGetCharge){
        //                 let effect = cc.instantiate(this.effectGetCharge);
        //                 effect.scale = 0.75;
        //                 this.powerUpBtn.addChild(effect);
        //             }
                        
        //         }, this),
        //         cc.removeSelf()
        //     ));
        // }
        let originScale = this.powerUpBtn.scale;
        this.powerUpBtn.runAction(cc.sequence(
            cc.scaleTo(this.timeMoveIcon / 2, originScale + originScale * (this.percentGrow / 100)), 
            cc.scaleTo(this.timeMoveIcon / 2, originScale)));
        if(this.effectGetCharge){
            let effect = cc.instantiate(this.effectGetCharge);
            effect.scale = 0.75;
            this.powerUpBtn.addChild(effect);
        }
        
        this.updateCount();
    },

    usePowerUpCharge(){
        if(window.holderManager.darkenNode.active){
            window.holderManager.enableTapToPlace();
        }else{
            if(this.number <= 0){
                let ads = cc.instantiate(this.ads);
                ads.position = cc.v2(0,0);
                ads.getComponent('AdsVideo').callBack = (()=>{
                    this.getPowerUpCharge(this.numberChargeAddedWhenAds);
                }).bind(this);
                cc.find('Canvas').addChild(ads);
            }else{
                window.holderManager.enableTapToDestroy();
            }
            this.updateCount();
        }
    },

    costPowerUpChange(){
        this.number--;
        this.updateCount();
    },

    updateCount(){
        this.countLabel.string = this.number;
        if(this.number <= 0)this.cameraIcon.active = true;
        else this.cameraIcon.active = false;
        this.countLabel.node.active = !this.cameraIcon.active;
        // this.buttonFrame.spriteFrame = this.countLabel.node.active ? this.spriteFrameOn : this.spriteFrameOff;
    }
});
