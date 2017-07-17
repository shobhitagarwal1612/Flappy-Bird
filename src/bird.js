var _bird = cc.Sprite.extend({
    state: bird_state_stopped,
    speedY: 0.0,
    topOfScreen: 0,

    ctor: function (spriteFrameName) {
        this._super(spriteFrameName);
    },

    UpdateBird: function (dt) {

    },

    Reset: function () {

    },

    SetStartSpeed: function () {

    },

    TubeCollisionBox: function(){
        
    }

});

(res.bird1_png);
this._bird.attr({
    x: size.width / 2,
    y: size.height / 2 + 100
});
this.addChild(this._bird, z_index_bird);

var bird_action = cc.MoveBy.create(2, cc.p(100, 0));
this._bird.runAction(bird_action);