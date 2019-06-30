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
        number : 0,
        powerUpBtn: cc.Node,
        countLabel: cc.Label,
        cameraIcon: cc.Node,
        spriteFrameOn: cc.SpriteFrame,
        spriteFrameOff: cc.SpriteFrame,
        ads: cc.Prefab,
        numberChargeAddedWhenAds : 3,
    },

    onLoad () {
        window.powerUpCharge = this;
        this.buttonFrame = this.powerUpBtn.getChildByName('Background').getComponent(cc.Sprite);
        this.updateCount();
    },


    getPowerUpCharge(number){
        this.number += number;
        this.updateCount();
    },

    usePowerUpCharge(){
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
