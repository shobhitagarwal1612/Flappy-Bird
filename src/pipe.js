var PipeSprite = cc.Sprite.extend({

    screenWidth: 0.0,
    pixelsPerSecond: 0,
    xOffset: 0,
    scored: false,
    inactiveX: 0,
    state: pipeStateInActive,

    ctor: function (spriteFrameName) {
        this._super(spriteFrameName);
    },

    Start: function () {
        this.stopAllActions();
        var distance = this.xOffset + this.screenWidth;
        var time = distance / this.pixelsPerSecond;
        var destination = cc.p(-this.xOffset, this.y);
        this.setPosition(this.xOffset + this.screenWidth, this.y);
        this.Visible = true;

        var actionMove = cc.moveTo(time, destination);
        var actionMoveDone = cc.callFunc(this.ReachedDestination, this);
        this.runAction(cc.sequence(actionMove, actionMoveDone));
    },

    Stop: function () {
        this.stopAllActions();
        this.Visible = false;
        this.state = pipeStateInActive;
        this.setPosition(this.inactiveX, this.y);
        this.scored = false;
    },

    Initialise: function (speed, width, Xoffset, inactiveX) {
        this.screenWidth = width;
        this.pixelsPerSecond = speed;
        this.Xoffset = Xoffset;
        this.inactiveX = inactiveX;
        this.x = inactiveX;
        this.y = 0;
        this.state = pipeStateActive;
        this.scored = false;
    },

    ReachedDestination: function (sender) {
        console.log('tube reached destination');
        sender.Stop();
    }
});