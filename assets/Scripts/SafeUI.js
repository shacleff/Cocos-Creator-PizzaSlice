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
        topUI: [cc.Node]
    },

    onLoad () {
        let screen = cc.find('Canvas').getContentSize();
        let safeZone = cc.sys.getSafeAreaRect();
        let distanceY = screen.height - safeZone.height;
        cc.log("Screen : " + screen);
        cc.log("Safe : " + safeZone);
        cc.log("distance : " + distanceY);
        for(let ui of this.topUI){
            let widget = ui.getComponent(cc.Widget);
            if(widget){
                widget.top += distanceY;
                // widget.top += 100;
                widget.updateAlignment();
            }else{
                ui.position = cc.v2(ui.position.x, ui.position.y - distanceY);
            }
            
        }
    },
});
