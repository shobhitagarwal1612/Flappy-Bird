var BirdSprite = cc.Sprite.extend({
    state: bird_state_stopped,
    speedY: 0.0,
    topOfScreen: 0,

    ctor: function (spriteFrameName) {
        this._super(spriteFrameName);
    },

    UpdateBird: function (dt) {
        if (this.state == bird_state_moving) {
            var distance = 0;
            var newSpeed = 0;

            distance = this.speedY * dt + 0.5 * gravity * dt * dt;
            newSpeed = this.speedY + gravity * dt;

            this.y = this.y + distance;

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

    TubeCollisionBox: function () {

    }

});