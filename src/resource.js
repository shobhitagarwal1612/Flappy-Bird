var res = {
    background_png: {
        path: "res/main_background.png",
        z_index: 0
    },
    bird1_png: {
        path: "res/bird1.png",
        z_index: 10
    },
    bird2_png: {
        path: "res/bird2.png",
        z_index: 10
    },
    bird3_png: {
        path: "res/bird3.png",
        z_index: 10
    },
    game_name_png: {
        path: "res/game_name.png",
        z_index: 20
    },
    game_over_png: {
        path: "res/game_over.png",
        z_index: 20
    },
    get_ready_png: {
        path: "res/get_ready.png",
        z_index: 20
    },
    medal_gold_png: {
        path: "res/medal_gold.png",
        z_index: 30
    },
    medal_silver: {
        path: "res/medal_silver.png",
        z_index: 30
    },
    pipe_png: {
        path: "res/pipe.png",
        z_index: 10
    },
    play_button_png: {
        path: "res/play_button.png",
        z_index: 25
    },
    result_board_png: {
        path: "res/result_board.png",
        z_index: 25
    },
    road_base_png: {
        path: "res/road_base.png",
        z_index: 5
    },
    tap_tap_png: {
        path: "res/tap_tap.png",
        z_index: 15
    },
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i].path);
}