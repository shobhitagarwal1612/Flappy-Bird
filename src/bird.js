var BirdLayer = cc.Layer.extend({
    state: bird_state_stopped,
    speedY: 0.0,
    topOfScreen: 0,
    spriteSheet: null,
    runningAction: null,
    sprite: null,

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this._super();

        // create sprite sheet
        cc.spriteFrameCache.addSpriteFrames(res.flapping_flappy_plist);
        this.spriteSheet = new cc.SpriteBatchNode(res.flapping_flappy_png);
        this.addChild(this.spriteSheet);

        // init runningAction
        var animFrames = [];
        for (var i = 1; i <= 3; i++) {
            var str = "bird" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = new cc.Animation(animFrames, 0.1);
        this.runningAction = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite = new cc.Sprite("#bird1.png");
        this.sprite.runAction(this.runningAction);
        this.spriteSheet.addChild(this.sprite);
    },

    UpdateBird: function (dt) {
        if (this.state == bird_state_moving) {
            var distance = 0;
            var newSpeed = 0;

            distance = this.speedY * dt + 0.5 * gravity * dt * dt;
            newSpeed = this.speedY + gravity * dt;

            this.y = this.y + distance;
            this.speedY = newSpeed;

            if (this.y > this.topOfScreen) {
                this.y = this.topOfScreen;
                this.speedY = 0.0;
            }
        }
    },

    Reset: function () {
        this.state = bird_state_stopped;
        this.SetStartSpeed();
    },

    SetStartSpeed: function () {
        this.speedY = bird_start_speedY;
    },
});