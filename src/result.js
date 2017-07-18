var ResultLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this._super();

        this._result_board = new cc.Sprite(res.result_board_png);
        this._medal_silver = new cc.Sprite(res.medal_silver_png);
        this._medal_gold = new cc.Sprite(res.medal_gold_png);
        this._scoreLabel = this.addLabel("0", 120, 22);
        this._highScoreLabel = this.addLabel("0", 120, -45);

        this.addChild(this._result_board, 0);
    },

    setScore: function (score, highscore) {
        console.log(score, highscore);

        var medal = null;

        if (score >= 5) {
            medal = this._medal_gold;
        } else if (score >= 2) {
            medal = this._medal_silver;
        }

        if (medal != null) {
            medal.x = -105;
            medal.y = -15;
            this.addChild(medal, 1);
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