var FloorLayer = cc.Layer.extend({
    sprite: null,
    sprite2: null,
    screenWidth: 0,

    ctor: function () {
        this._super();
        this.init();
    },

    Setup: function (screenWidth) {
        this.screenWidth = screenWidth;
    },

    init: function () {
        this._super();
        this.sprite = new cc.Sprite(res.road_base_png);
        this.sprite2 = new cc.Sprite(res.road_base_png);

        this.Reset();

        this.addChild(this.sprite);
        this.addChild(this.sprite2);
    },

    Reset: function () {
        this.sprite.stopAllActions();
        this.sprite2.stopAllActions();

        this.sprite.setPosition(0, 0);
        this.sprite.setAnchorPoint(0, 0);
        this.sprite2.setPosition(this.sprite.width, 0);
        this.sprite2.setAnchorPoint(0, 0);
    },

    Start: function () {
        this.Reset();

        var time = this.screenWidth / pipeSpeed;

        var destination = cc.p(-this.sprite.width, 0);
        var actionMove = cc.moveTo(time * 3, destination);
        var actionMoveDone = cc.callFunc(this.Start, this);
        this.sprite.runAction(cc.sequence(actionMove, actionMoveDone));
        this.sprite.runAction(actionMove);

        var destination2 = cc.p(0, 0);
        var actionMove2 = cc.moveTo(time * 3, destination2);
        this.sprite2.runAction(actionMove2);
    }
});