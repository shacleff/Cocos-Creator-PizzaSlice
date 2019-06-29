let EAds = cc.Enum({
    ADS_CENTER: 0,
    ADS_VIDEO: 1
});

cc.Class({
    extends: cc.Component,

    properties: {
        loseBG:{
            default: null,
            type: cc.Node
        },
        timeStep :{
            default: null,
            type: cc.ProgressBar
        },
        continueBtn:{
            default: null,
            type: cc.Node
        },
        backBtn:{
            default: null,
            type: cc.Node
        },
        refreshBtn:{
            default: null,
            type: cc.Node
        },
        listAds :{
            type: cc.Prefab,
            default: []
        },
        toProgress: 1,
    },

    onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, ()=>{});
        let widget = this.node.getComponent(cc.Widget);
        widget.active = true;
        widget.target = cc.find('Canvas');
        widget.updateAlignment();
        this.lockBtn = false;
        this.visibleContinue = true;
        this.continueBtn.active = this.visibleContinue;
        this.backRefreshBtnActive(false);
    },

    start(){
        this.loseBG.active = true;
        this.node.active = true;
        this.timeStep.node.active = true;
        
        //create ads
        if(this.listAds.length > EAds.ADS_CENTER){
            let node = cc.instantiate(this.listAds[EAds.ADS_CENTER]);
            this.node.addChild(node, 10);
        }
    },
    
    update (dt) {
        if (this.timeStep.progress <= 0) {
            this.timeStep.progress = 0; 
            this.timeStep.node.active = false;
            this.backRefreshBtnActive(true);
        }else{
            this.timeStep.progress -= dt / this.toProgress;
        }

        if((!this.popupExit || !this.popupExit.isValid) && this.timeStep.progress ==0 && !this.lockBtn){
            this.backRefreshBtnActive(true);
            this.continueBtn.active = this.visibleContinue;
        }else{
            this.backRefreshBtnActive(false);
        }
    },

    loadAdsContinue(){
        if(this.listAds.length > EAds.ADS_VIDEO){
            let node = cc.instantiate(this.listAds[EAds.ADS_VIDEO]);
            let adsCom = node.getComponent('AdsVideo');
            adsCom.skipCallBack = this;
            cc.find('Canvas').addChild(node);
            this.backRefreshBtnActive(false);
            this.continueBtn.active = false;
            this.lockBtn = true;
        }         
    },

    continue(){
        if(window.game.continue())
            this.node.destroy();
    },

    homeBtn(){
        window.game.home();
    },

    reset(){
        if(window.game.refresh())
            this.node.destroy();
    },
    
    backRefreshBtnActive(value){
        this.backBtn.active = value;
        this.refreshBtn.active = value;
    }
});
