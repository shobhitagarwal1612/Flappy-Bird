var res = {
    background_png: "res/main_background.png",
    bird1_png: "res/bird1.png",
    bird2_png: "res/bird2.png",
    bird3_png: "res/bird3.png",
    game_name_png: "res/game_name.png",
    game_over_png: "res/game_over.png",
    get_ready_png: "res/get_ready.png",
    medal_gold_png: "res/medal_gold.png",
    medal_silver: "res/medal_silver.png",
    pipe_png: "res/pipe.png",
    play_button_png: "res/play_button.png",
    result_board_png: "res/result_board.png",
    road_base_png: "res/road_base.png",
    tap_tap_png: "res/tap_tap.png",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}

var z_index_background = 0;
var z_index_label = 20;
var z_index_bird = 100;
var z_index_button = 15;
var z_index_floor = 5;
var z_index_pipe = 35;

var bird_state_moving = 1;
var bird_state_stopped = 0;
var bird_start_speedY = 300;
var bird_startX = 240;

var gravity = -620;

var reenableTime = 2.5;
var pipeSpawnMinTime = 2.3;
var pipeSpawnTimeVariance = 8;

var singleGapTop = 440;
var singleGapBottom = 230;
var singleGapMax = 280;
var singleGapMin = 160;

var doubleGapTop = 480;
var doubleGapBottom = 120;
var doubleGapMax = 220;
var doubleGapMin = 140;

var pipeTypeUpper = 0;
var pipeTypeLower = 1;
var pipeTypePair = 2;
var pipeTypeNone = 3;

var pipeStateActive = 0;
var pipeStateInActive = 1;

var pipeOffsetX = 100;
var pipeInActiveX = -1000;

var pipeScore = 1;

var pipeMaxUpPixels = 180