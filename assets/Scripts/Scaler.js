cc.Class({
    extends: cc.Component,

    properties: {
        objectsScale :{
            default: [],
            type: cc.Node
        },
        subRatioWhenLongScreen : 0.2,
        subRatioWhenTab : 0.2,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        window.scaler = this;
        let currentSize = this.node.getContentSize();
        let ratio = 1;
        ratio = this.convertRatioWidthHeight(ratio, currentSize);
        for(let obj of this.objectsScale){
            let size = obj.getContentSize();
            // obj.setContentSize(size.width * ratio, size.height * ratio);
            obj.setScale(ratio * obj.scale);
            // obj.scale += ratio - 1;
        }
    },

    scaleNode(node){
        let ratio = this.convertRatioWidthHeight(1, this.node.getContentSize());
        let size = node.getContentSize();
        // node.setContentSize(size.width * ratio, size.height * ratio);
        // node.setScale(ratio * node.scale);
    },

    convertRatioWidthHeight(ratio, screenSize){
        let ratioWH = screenSize.height / screenSize.width;
        if(ratioWH >= 2)ratio -= this.subRatioWhenLongScreen;
        // else if (ratioWH <= 1.3) ratio -= this.subRatioWhenTab;
        
        return ratio;
    },
});
