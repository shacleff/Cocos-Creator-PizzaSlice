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
        orderBarArea: cc.Node,
        playUITopArea : cc.Node,
        holdersArea : cc.Node,
        HomeBtn: cc.Node,
    },

    onLoad () {
        if(this.playUITopArea)this.playUITopArea.zIndex = 2;
        if(this.holdersArea)this.holdersArea.zIndex = 1;
        if(this.orderBarArea)this.orderBarArea.zIndex = 0;
        if(this.HomeBtn)this.HomeBtn.zIndex = 10;
    },

});
