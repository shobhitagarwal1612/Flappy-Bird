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
 var z_index_bird = 10;
 var z_index_button = 15;
 var z_index_floor = 5;

 var bird_state_moving = 1;
 var bird_state_stopped = 0;
 var bird_start_speedY = 300;
 var bird_startX = 240;

 var gravity = -620;