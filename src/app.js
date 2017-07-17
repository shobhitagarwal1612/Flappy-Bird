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
        this.addChild(this._background, res.background_png.z_index);

        var logo = new cc.Sprite(res.game_name_png);
        logo.attr({
            x: size.width / 2,
            y: size.height / 2 + 200
        });
        this.addChild(logo, res.game_name_png.z_index);

        this._bird = new cc.Sprite(res.bird1_png);
        this._bird.attr({
            x: size.width / 2,
            y: size.height / 2 + 100
        });
        this.addChild(this._bird, 2);

        var bird_action = cc.MoveBy.create(2, cc.p(100, 0));
        this._bird.runAction(bird_action);

        var play_button = new cc.Sprite(res.play_button_png);
        play_button.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(play_button, res.play_button_png.z_index);

        var road_base = new cc.Sprite(res.road_base_png);
        road_base.attr({
            x: size.width / 2,
            y: (size.height / 2) - 250
        });
        this.addChild(road_base, res.road_base_png.z_index);

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