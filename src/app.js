var ArrayPipes = [];

var MainLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var size = cc.winSize;

        var background = new cc.Sprite(res.background_png);
        background.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(background, z_index_background);

        this._logo = new cc.Sprite(res.game_name_png);
        this._logo.attr({
            x: size.width / 2,
            y: size.height / 2 + 150
        });
        this.addChild(this._logo, z_index_label);

        this._play_button = new cc.Sprite(res.play_button_png);
        this._play_button.attr({
            x: size.width / 2,
            y: size.height / 2 - 150
        });
        this.addChild(this._play_button, z_index_button);

        this._floor = new cc.Sprite(res.road_base_png);
        this._floor.setPosition(0, 0);
        this._floor.setAnchorPoint(0, 0);
        this.addChild(this._floor, z_index_floor);

        this._bird = new BirdSprite(res.bird1_png);
        this._bird.x = bird_startX;
        this._bird.y = size.height / 2;
        this._bird.topOfScreen = size.height;
        this._bird.Reset();
        this.addChild(this._bird, z_index_bird);

        this._gameTime = 0;
        this._gameStarted = false;
        this._middleY = size.height / 2;
        this._processTouch = false;

        this._lastSpawnTime = 0;
        this._nextSpawnTime = 0;

        this._lastPipeType = pipeTypeNone;
        this._lastGetUnderY = 0;

        this._gameOverLabel = this.addLabel("Game Over!", size.width / 2, size.height / 2, false, z_index_bird, cc.color.RED, fontSizeGameOver);
        this._gameStartLabel = this.addLabel("Tap to start", size.width / 2, size.height / 3 * 2, true, z_index_bird, cc.color.RED, fontSizeGameOver);
        this._scoreLabel = this.addLabel("00000", scoreX, size.height - scoreY, true, z_index_bird, cc.color.RED, fontSizeScore);
        this._scoreLabel.setAnchorPoint(0, 1);
        this._highScoreLabel = this.addLabel("10000", scoreX, size.height - scoreY * 3, true, z_index_bird, cc.color.RED, fontSizeScore);
        this._highScoreLabel.setAnchorPoint(0, 1);
    },

    addLabel: function (text, x, y, visible, zIndex, color, fsize) {
        var label = new cc.LabelTTF(text, fontName, fsize);
        label.setPosition(x, y);
        label.color = color;
        label.visible = visible;
        this.addChild(label, zIndex);
        console.log('label added');
        return label;
    },

    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMove: this.onTouchMove,
            onTouchEnded: this.onTouchEnded,
        }, this);

        this.schedule(this.onTick);

        this.StopGame();
        this._processTouch = true;
    },

    onTick: function (dt) {

        var gameOver = false;

        if (this._gameStarted) {
            this._gameTime += dt;
            this._lastSpawnTime += dt;

            if (this._lastSpawnTime > this._nextSpawnTime) {
                console.log('spawn pipes');
                this.SetSpawnTime();
                this.SpawnNewPipes();
            }

            if (this._bird.y < this._floor.height) {
                gameOver = true;
            } else {

                var BirdCollisionBox = new cc.Rect(
                    this._bird.getBoundingBox().x + 25,
                    this._bird.getBoundingBox().y + 5,
                    this._bird.getBoundingBox().width - 30,
                    this._bird.getBoundingBox().height - 20
                );

                for (var i = 0, len = ArrayPipes.length; i < len; i++) {
                    if (cc.rectIntersectsRect(ArrayPipes[i].getBoundingBox(), BirdCollisionBox)) {
                        console.log('collision');
                        gameOver = true;
                    }
                }
            }

            if (!gameOver) {
                this._bird.UpdateBird(dt);
            } else {
                this.GameOver();
            }
        }
    },

    onTouchBegan: function (touch, event) {
        var tp = touch.getLocation();
        var tar = event.getCurrentTarget();

        if (tar._processTouch) {
            tar._bird.SetStartSpeed();
            if (!tar._gameStarted) {
                tar.StartGame();
            }
        }

        if (tar._bird.state == bird_state_stopped) {
            tar._bird.state = bird_state_moving;
        }
        tar._bird.SetStartSpeed();

        return false;
    },

    onTouchMove: function (touch, event) {
        var tp = touch.getLocation();
        console.log('onTouchMove : ' + tp.x.toFixed(2) + ' , ' + tp.y.toFixed(2));
        return true;
    },

    onTouchEnded: function (touch, event) {
        var tp = touch.getLocation();
        console.log('onTouchEnded : ' + tp.x.toFixed(2) + ' , ' + tp.y.toFixed(2));
        return true;
    },

    StopPipes: function () {
        for (var i = 0, len = ArrayPipes.length; i < len; i++) {
            ArrayPipes[i].stopAllActions();
        }
    },

    ClearPipes: function () {
        for (var i = 0, len = ArrayPipes.length; i < len; i++) {
            ArrayPipes[i].Stop();
        }
    },

    StartGame: function () {
        this._bird.state = bird_state_moving;
        this._gameStarted = true;
        this._processTouch = true;
        this._lastPipeType = pipeTypeNone;
        this._lastGetUnderY = this._middleY;
        this._gameStartLabel.visible = false;
        this._play_button.visible = false;
        this._logo.visible = false;
    },

    StopGame: function () {
        this._gameStarted = false;
        this._gameTime = 0;
        this._nextSpawnTime = 0.2;
        this.StopPipes();
    },

    GameOver: function () {
        this._processTouch = false;
        this._gameOverLabel.visible = true;
        this.StopGame();
        this.scheduleOnce(this.ReEnableAfterGameOver, reenableTime);
    },

    ReEnableAfterGameOver: function () {
        this._bird.y = this._middleY;
        this._processTouch = true;
        this._gameOverLabel.visible = false;
        this._gameStartLabel.visible = true;
        this._play_button.visible = true;
        this._logo.visible = true;

        this.ClearPipes();
    },

    SetSpawnTime: function () {
        this._lastSpawnTime = 0;
        this._nextSpawnTime = Math.floor((Math.random() * pipeSpawnTimeVariance) + 1) / 10 + pipeSpawnMinTime;
        console.log('next spawn time : ' + this._nextSpawnTime);
    },

    SpawnNewPipes: function () {
        var ourChance = Math.floor((Math.random() * 3) + 1);

        while (1) {
            if (this._lastPipeType == pipeTypeUpper && ourChance == 1) {
                ourChance = Math.floor((Math.random() * 3) + 1);
            } else if (this._lastPipeType == pipeTypeLower && ourChance == 2) {
                ourChance = Math.floor((Math.random() * 3) + 1);
            } else if (this._lastPipeType == pipeTypePair && ourChance == 3) {
                ourChance = Math.floor((Math.random() * 3) + 1);
            } else {
                break;
            }
        }

        if (ourChance == 1) {
            this.SpawnUpperOrLower(true);
        } else if (ourChance == 2) {
            this.SpawnUpperOrLower(false);
        } else {
            this.SpawnPipePair();
        }
    },

    SpawnUpperOrLower: function (isUpper) {
        var YMax, YMin;
        if (isUpper) {
            this._lastPipeType = pipeTypeUpper;
            YMax = this._middleY;
            YMin = singleGapBottom;
        } else {
            this._lastPipeType = pipeTypeLower;
            YMax = singleGapTop;
            YMin = this._middleY;
            if (YMax - this._lastGetUnderY > pipeMaxUpPixels) {
                YMax = this._lastGetUnderY + pipeMaxUpPixels;
            }
        }

        var YRange = Math.abs(YMax - YMin);
        var YPos = YMax - Math.floor(Math.random() * (YRange));

        if (isUpper) {
            this._lastGetUnderY = YPos;
        } else {
            this._lastGetUnderY = this._middleY;
        }

        console.log('SpawnUpperOrLower pipe isUpper:', isUpper, ' YPos:', YPos);
        this.SpawnPipe(isUpper, YPos);
    },

    SpawnPipePair: function () {
        this._lastPipeType = pipeTypePair;
        var Gap = doubleGapMin + Math.floor(Math.random() * (doubleGapMax - doubleGapMin));
        var YRange = doubleGapTop - Gap - doubleGapBottom;
        var TopY = doubleGapTop - Math.floor(Math.random() * YRange);
        var BottomY = TopY - Gap;

        this._lastGetUnderY = TopY;

        console.log('SpawnPipePair TopY:', TopY, ' BottomY:', BottomY);
        this.SpawnPipe(true, TopY);
        this.SpawnPipe(false, BottomY);
    },

    SpawnPipe: function (isUpper, yPos) {
        var pipe = this.GetNextPipe();

        if (isUpper) {
            pipe.setAnchorPoint(0.5, 0);
            pipe.setFlippedY(false);
        } else {
            pipe.setAnchorPoint(0.5, 1);
            pipe.setFlippedY(true);
        }

        pipe.y = yPos + this._floor.height;
        pipe.Start();
    },

    GetNextPipe: function () {
        for (var i = 0, len = ArrayPipes.length; i < len; i++) {
            if (ArrayPipes[i].state == pipeStateInActive) {
                console.log('found resuable pipe');
                return ArrayPipes[i];
            }
        }

        var size = cc.winSize;

        var newPipe = new PipeSprite(res.pipe_png);
        newPipe.Initialise(pipeSpeed, size.width, pipeOffsetX, pipeInActiveX, this._floor.height);
        this.addChild(newPipe, 2);
        ArrayPipes[ArrayPipes.length] = newPipe;
        console.log('made tube num:' + ArrayPipes.length);
        return newPipe;
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