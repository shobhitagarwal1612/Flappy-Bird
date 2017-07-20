var ResultLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this._super();

        this._result_board = new cc.Sprite(res.result_board_png);
        this._medal_silver = new cc.Sprite(res.medal_silver_png);
        this._medal_silver.x = -105;
        this._medal_silver.y = -15;
        this.addChild(this._medal_silver, 1);
        this._medal_gold = new cc.Sprite(res.medal_gold_png);
        this._medal_gold.x = -105;
        this._medal_gold.y = -15;
        this.addChild(this._medal_gold, 1);
        this._scoreLabel = this.addLabel("0", 120, 22);
        this._highScoreLabel = this.addLabel("0", 120, -45);

        this.addChild(this._result_board, 0);
    },

    setScore: function (score, highscore) {
        var medal = null;

        this._medal_silver.visible = false;
        this._medal_gold.visible = false;

        if (score >= 50) {
            this._medal_gold.visible = true;
        } else if (score >= 20) {
            this._medal_silver.visible = true;
        }

        this._scoreLabel.string = score;
        this._highScoreLabel.string = highscore;
    },

    addLabel: function (text, x, y) {
        var label = new cc.LabelTTF(text, fontName, fontSizeScore);
        label.setPosition(x, y);
        label.color = cc.color.BLACK;
        this.addChild(label, 2);
        return label;
    },
});