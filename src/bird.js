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

        cc.spriteFrameCache.addSpriteFrames(res.flapping_flappy_plist);

        this._animFrames = [];
        for (var i = 1; i <= 3; i++) {
            var str = "bird" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            this._animFrames.push(frame);
        }

        this.spriteSheet = new cc.SpriteBatchNode(res.flapping_flappy_png);
        this.addChild(this.spriteSheet);

        this.sprite = new cc.Sprite("#bird1.png");
        this.spriteSheet.addChild(this.sprite);

        this.StartFlapping();
    },

    StartFlapping: function () {
        var animation = new cc.Animation(this._animFrames, 0.1);
        this.flappingAction = new cc.RepeatForever(new cc.Animate(animation));
        this.sprite.runAction(this.flappingAction);
    },

    StartVerticalMovement: function () {
        this.sprite.x = 0;
        this.sprite.y = 0;
        var motionUp = new cc.MoveBy(0.2, cc.p(this.sprite.x, this.sprite.y + 10));
        var motionDown = new cc.MoveBy(0.2, cc.p(this.sprite.x, this.sprite.y - 10));
        this.vMotion = new cc.RepeatForever(cc.sequence(motionUp, motionDown));
        this.sprite.runAction(this.vMotion);
    },

    StopVerticalMovement: function () {
        this.sprite.stopAllActions();
        this.StartFlapping();
    },

    StopFlapping: function(){
        this.sprite.stopAllActions();
    },

    StopActions: function () {},

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