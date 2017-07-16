var MainLayer = cc.Layer.extend({
    _background: null,
    _bird: null,
    ctor: function () {
        this._super();

        var size = cc.winSize;

        this._background = new cc.Sprite(res.background_png);
        this._background.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this._background, 0);

        var logo = new cc.Sprite(res.game_name_png);
        logo.attr({
            x: size.width / 2,
            y: size.height / 2 + 200
        });
        this.addChild(logo, 1);

        this._bird = new cc.Sprite(res.bird1_png);
        this._bird.attr({
            x: size.width / 2,
            y: size.height / 2 + 100
        });
        this.addChild(this._bird, 2);

        return true;
    }
});

MainLayer.create = function () {
    var sg = new MainLayer();
    if (sg && sg.init(cc.c4b(255, 255, 255, 255))) {
        return sg;
    }
    return null;
};

MainLayer.scene = function () {
    var scene = cc.Scene.create();
    var layer = MainLayer.create();
    scene.addChild(layer);
    return scene;
};