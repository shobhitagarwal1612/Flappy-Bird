var ArrayPipes = [];

var MainLayer = cc.Layer.extend({

    screenWidth: 0,
    screenHeight: 0,

    ctor: function () {
        this._super();

        var size = cc.winSize;
        this.screenWidth = size.width;
        this.screenHeight = size.height;

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

        this._floor = new FloorLayer();
        this._floor.Setup(this.screenWidth);
        this._floor.setPosition(0, 0);
        this._floor.setAnchorPoint(0, 0);
        this.addChild(this._floor, z_index_floor);

        this._bird = new BirdLayer();
        this._bird.x = bird_startX;
        this._bird.y = size.height / 2;
        this._bird.setAnchorPoint(0, 0);
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

        this._score = 0;
        this._highScore = 0;

        this._gameReadyLabel = new cc.Sprite(res.get_ready_png);
        this._gameReadyLabel.x = size.width / 2;
        this._gameReadyLabel.y = size.height / 2 * 1.5;
        this._gameReadyLabel.visible = false;
        this.addChild(this._gameReadyLabel, z_index_bird);

        this._tapTapLabel = new cc.Sprite(res.tap_tap_png);
        this._tapTapLabel.x = size.width / 2 + 50;
        this._tapTapLabel.y = size.height / 2;
        this._tapTapLabel.visible = false;
        this.addChild(this._tapTapLabel, z_index_bird);

        this._gameOverLabel = new cc.Sprite(res.game_over_png);
        this._gameOverLabel.x = size.width / 2;
        this._gameOverLabel.y = size.height / 2 * 1.5;
        this._gameOverLabel.visible = false;
        this.addChild(this._gameOverLabel, z_index_bird);

        this._resultBoard = new ResultLayer();
        this._resultBoard.x = size.width / 2;
        this._resultBoard.y = size.height / 2 + 50;
        this._resultBoard.visible = false;
        this.addChild(this._resultBoard, z_index_bird);

        this._scoreLabel = new cc.LabelTTF("0", fontName, fontSizeScore);
        this._scoreLabel.setPosition(size.width / 2, size.height - 100);
        this._scoreLabel.setAnchorPoint(0, 1);
        this._scoreLabel.color = cc.color.WHITE;
        this._scoreLabel.visible = false;
        this.addChild(this._scoreLabel, z_index_bird);

        this.setScoreLabels();
    },

    setScoreLabels: function () {
        console.log('setScoreLabels():: Score:', this._score, ', Highscore:', this._highScore);
        this._scoreLabel.string = this._score.toString();
    },

    addLabel: function (text, x, y, visible, zIndex, color, fsize) {

    },

    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchEnded: this.onTouchEnded,
        }, this._play_button);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchEnded: this.onTouchEnded,
        }, this);

        this._floor.Start(this._floor);
        this.schedule(this.onTick);
        this.StopGame();

        this._bird.StartVerticalMovement();
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

            if (this._bird.y < this._floor.sprite.height) {
                gameOver = true;
            } else {
                var BirdCollisionBox = new cc.Rect(
                    this._bird.x + this._bird.sprite.getBoundingBox().x + 25,
                    this._bird.y + this._bird.sprite.getBoundingBox().y + 5,
                    this._bird.sprite.width - 30,
                    this._bird.sprite.height - 20
                );

                for (var i = 0, len = ArrayPipes.length; i < len; i++) {
                    var pipe = ArrayPipes[i];
                    if (pipe.state == pipeStateActive) {
                        if (cc.rectIntersectsRect(pipe.getBoundingBox(), BirdCollisionBox)) {
                            console.log('collision');
                            gameOver = true;
                        } else if (!pipe.scored && (pipe.getBoundingBox().x + pipe.getBoundingBox().width) <
                            this._bird.x + this._bird.sprite.getBoundingBox().x) {
                            ArrayPipes[i].scored = true;
                            this._score += pipeScore;
                            this.setScoreLabels();
                        }
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
        var target = event.getCurrentTarget();

        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);

        if (cc.rectContainsPoint(rect, locationInNode)) {
            target.opacity = 200;
            return true;
        }
        return false;
    },

    onTouchEnded: function (touch, event) {
        var tar = event.getCurrentTarget();
        tar.setOpacity(255);

        if (tar._play_button == undefined) {
            tar = tar.parent;
            tar._processTouch = true;
        } else {
            tar._processTouch = false;
        }

        if (tar._processTouch) {
            tar._bird.SetStartSpeed();

            if (tar._ready && !tar._gameStarted) {
                tar.StartGame();
            }

            if (!tar._gameStarted) {
                tar.GetReady();
            }
        }

        if (tar._bird.state == bird_state_stopped) {
            tar._bird.state = bird_state_moving;
        }
        tar._bird.SetStartSpeed();


        /*  var angle = 0;
         if (tar._bird.speedY >= 0) {
             angle = 0.1;
         } else {
             angle = -0.1;
         }

         if (angle > 45) {
             angle = 45;
         } else if (angle < -90) {
             angle = -90;
         }

         var rotate = cc.RotateBy.create(0.2, tar._bird.rotation + angle);
         tar._bird.runAction(rotate); */

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
        console.log('game started');
        this._gameStarted = true;
        this._lastPipeType = pipeTypeNone;
        this._lastGetUnderY = this._middleY;
        this._gameReadyLabel.visible = false;
        this._tapTapLabel.visible = false;
        this._bird.x = this.screenWidth / 2;
        this._bird.y = this.screenHeight / 2;
        this._bird.StopVerticalMovement();
    },

    GetReady: function () {
        console.log('game ready');
        this._ready = true;
        this._processTouch = true;
        this._scoreLabel.visible = true;
        this._logo.visible = false;
        this._play_button.visible = false;
        this._gameReadyLabel.visible = true;
        this._bird.x -= 100;
        this._tapTapLabel.visible = true;
        this._bird.state = bird_state_moving;

        this._bird.y = this.screenHeight / 2;
        this._processTouch = true;
        this._gameOverLabel.visible = false;
        this._resultBoard.visible = false;
        this.ClearPipes();
        this._bird.StartFlapping();
        this._bird.StartVerticalMovement();

        if (this._score > this._highScore) {
            this._highScore = this._score;
        }
        this._score = 0;
        this.setScoreLabels();
    },

    StopGame: function () {
        this._gameStarted = false;
        this._ready = false;
        this._gameTime = 0;
        this._nextSpawnTime = 0.2;
        this._scoreLabel.visible = false;
        this.StopPipes();
    },

    GameOver: function () {
        console.log('game over');
        if (this._score > this._highScore) {
            this._highScore = this._score;
        }
        this._resultBoard.setScore(this._score, this._highScore);
        this._bird.StopVerticalMovement();
        this._bird.StopFlapping();

        this._processTouch = false;
        this._gameOverLabel.visible = true;
        this._resultBoard.visible = true;
        this._play_button.visible = true;
        this.StopGame();
        // this.scheduleOnce(this.ReEnableAfterGameOver, reenableTime);
    },

    ReEnableAfterGameOver: function () {
        this._bird.y = this._middleY;
        this._processTouch = true;
        this._gameOverLabel.visible = false;
        this._resultBoard.visible = false;
        this._play_button.visible = true;
        this._logo.visible = true;
        this.ClearPipes();
        this._bird.StartFlapping();
        this._bird.StartVerticalMovement();

        if (this._score > this._highScore) {
            this._highScore = this._score;
        }
        this._score = 0;
        this.setScoreLabels();
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

        pipe.y = yPos + this._floor.sprite.height;
        pipe.Start();
    },

    GetNextPipe: function () {
        for (var i = 0, len = ArrayPipes.length; i < len; i++) {
            if (ArrayPipes[i].state == pipeStateInActive) {
                console.log('found reusable pipe');
                return ArrayPipes[i];
            }
        }

        var size = cc.winSize;

        var newPipe = new PipeSprite(res.pipe_png);
        newPipe.Initialise(pipeSpeed, size.width, pipeOffsetX, pipeInActiveX, this._floor.sprite.height);
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