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

        var play_button = new cc.Sprite(res.play_button_png);
        play_button.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(play_button, 3);

        var road_base = new cc.Sprite(res.road_base_png);
        road_base.attr({
            x: size.width / 2,
            y: (size.height / 2) - 250
        });
        this.addChild(road_base, 4);

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