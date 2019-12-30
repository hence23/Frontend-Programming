(function() {
    // Canvas & Context
    var canvas;
    var ctx;

    //背景色號
    var colorcode = 0;
    colorlist = ["#99BBFF", "#9999FF", "#9F88FF"];
    // 蛇
    var snake;
    //蛇蛇原本方向
    var snake_dir;
    //按下上下所右後的方向
    var snake_next_dir;
    //蛇蛇速度
    var snake_speed;



    // 食物初始座標
    var food = {
        x: 0,
        y: 0
    };

    // 分數
    var score;

    // 邊界
    var wall;

    // HTML
    var screen_snake;
    var screen_menu;
    var screen_setting;
    var screen_gameover;
    var button_newgame_menu;
    var button_newgame_setting;
    var button_newgame_gameover;
    var button_setting_menu;
    var button_setting_gameover;
    var ele_score;
    var speed_setting;
    var wall_setting;

    var activeDot = function(x, y) {
        //蛇跟食物的顏色
        //加入漸層色板
        let lineargradient = ctx.createLinearGradient(50, 50, 200, 200);
        lineargradient.addColorStop(0, 'white');
        lineargradient.addColorStop(1, 'yellow');
        ctx.fillStyle = lineargradient;
        ctx.fillRect(x * 10, y * 10, 10, 10);
    }

    //設定按鍵跟方向
    //keycode  37 = 左鍵 keycode  38 = 上鍵 keycode  39 = 右鍵 keycode  40 = 下鍵
    var changeDir = function(key) {
        if (key == 38 && snake_dir != 2) {
            snake_next_dir = 0;
        } else {

            if (key == 39 && snake_dir != 3) {
                snake_next_dir = 1;
            } else {

                if (key == 40 && snake_dir != 0) {
                    snake_next_dir = 2;
                } else {

                    if (key == 37 && snake_dir != 1) {
                        snake_next_dir = 3;
                    }
                }
            }
        }

    }

    //新增食物
    var addFood = function() {
        food.x = Math.floor(Math.random() * ((canvas.width / 10) - 1));
        food.y = Math.floor(Math.random() * ((canvas.height / 10) - 1));
        //避免食物直接生成到蛇蛇身上
        for (var i = 0; i < snake.length; i++) {
            if (checkBlock(food.x, food.y, snake[i].x, snake[i].y)) {
                addFood();
            }
        }
    }

    //驗證座標function
    var checkBlock = function(x, y, _x, _y) {
        return (x == _x && y == _y) ? true : false;
    }

    // 右上角分數
    var altScore = function(score_val) {
        ele_score.innerHTML = String(score_val);
    }

    //負責畫蛇蛇跟各邏輯判斷
    var mainLoop = function() {
        //蛇蛇初始化位子
        var _x = snake[0].x;
        var _y = snake[0].y;
        //前進方向
        snake_dir = snake_next_dir;

        // 0 - 上, 1 - 右 2 - 下 3 - 左
        switch (snake_dir) {
            case 0:
                _y--;
                break;
            case 1:
                _x++;
                break;
            case 2:
                _y++;
                break;
            case 3:
                _x--;
                break;
        }

        snake.pop();
        snake.unshift({
            x: _x,
            y: _y
        });

        // 邊際設定
        if (wall == 1) {
            // 開啟
            if (snake[0].x < 0 || snake[0].x == canvas.width / 10 || snake[0].y < 0 || snake[0].y == canvas.height / 10) {
                showScreen(3);
                return;
            }
        } else {
            // 關閉
            for (var i = 0, x = snake.length; i < x; i++) {
                if (snake[i].x < 0) {
                    snake[i].x = snake[i].x + (canvas.width / 10);
                }
                if (snake[i].x == canvas.width / 10) {
                    snake[i].x = snake[i].x - (canvas.width / 10);
                }
                if (snake[i].y < 0) {
                    snake[i].y = snake[i].y + (canvas.height / 10);
                }
                if (snake[i].y == canvas.height / 10) {
                    snake[i].y = snake[i].y - (canvas.height / 10);
                }
            }
        }

        // 自己吃到自己的死亡情況
        for (var i = 1; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                showScreen(3);
                return;
            }
        }

        // 蛇蛇吃到東西 = 蛇頭座標 = 食物座標
        if (checkBlock(snake[0].x, snake[0].y, food.x, food.y)) {
            snake[snake.length] = {
                x: snake[0].x,
                y: snake[0].y
            };
            score += 1;
            colorcode += 1;
            altScore(score);
            addFood();
            activeDot(food.x, food.y);
        }

        ctx.beginPath();
        //背景顏色
        //設計成吃到食物變一個顏色
        if (colorcode % 3 === 0) {
            ctx.fillStyle = colorlist[0]
        };
        if (colorcode % 3 === 1) {
            ctx.fillStyle = colorlist[1]
        };
        if (colorcode % 3 === 2) {
            ctx.fillStyle = colorlist[2]
        };
        ctx.fillRect(0, 0, canvas.width, canvas.height);


        for (var i = 0; i < snake.length; i++) {
            activeDot(snake[i].x, snake[i].y);
        }

        activeDot(food.x, food.y);
        //重啟遊戲
        setTimeout(mainLoop, snake_speed);
    }

    //新遊戲開始
    var newGame = function() {
        //回到遊戲畫面
        showScreen(0);
        screen_snake.focus();

        snake = [];
        for (var i = 4; i >= 0; i--) {
            snake.push({
                x: i,
                y: 15
            });
        }
        //預設向右
        snake_next_dir = 1;
        //分數歸零
        score = 0;
        altScore(score);
        //生成食物
        addFood();
        //設置空白鍵可以開始遊戲
        canvas.onkeydown = function(evt) {
            evt = evt || window.event;
            changeDir(evt.keyCode);
        }
        mainLoop();

    }

    //設計不同速度 150 = 慢慢 100 = 普普 50 = 快快
    var setSnakeSpeed = function(speed_value) {
        snake_speed = speed_value;
    }

    //有無邊界 換邊界顏色
    var setWall = function(wall_value) {
        wall = wall_value;
        if (wall == 0) {
            screen_snake.style.borderColor = "#CCEEFF";
        }
        if (wall == 1) {
            screen_snake.style.borderColor = "#FFFFFF";
        }
    }

    //透過Fuction來控制各個不同CSS的呈現
    // 0 遊戲畫面
    // 1 主Menu
    // 2 遊戲設定
    // 3 死亡畫面
    var showScreen = function(screen_opt) {
        switch (screen_opt) {
            //遊戲畫面
            case 0:
                screen_snake.style.display = "block";
                screen_menu.style.display = "none";
                screen_setting.style.display = "none";
                screen_gameover.style.display = "none";
                break;
                //主選單
            case 1:
                screen_snake.style.display = "none";
                screen_menu.style.display = "block";
                screen_setting.style.display = "none";
                screen_gameover.style.display = "none";
                break;
                //遊戲設定
            case 2:
                screen_snake.style.display = "none";
                screen_menu.style.display = "none";
                screen_setting.style.display = "block";
                screen_gameover.style.display = "none";
                break;
                //死亡畫面
            case 3:
                screen_snake.style.display = "none";
                screen_menu.style.display = "none";
                screen_setting.style.display = "none";
                screen_gameover.style.display = "block";
                break;
        }
    }

    window.onload = function() {
        canvas = document.getElementById("snake");
        ctx = canvas.getContext("2d");

        //畫面
        screen_snake = document.getElementById("snake");
        screen_menu = document.getElementById("menu");
        screen_gameover = document.getElementById("gameover");
        screen_setting = document.getElementById("setting");

        //設定按鈕
        button_newgame_menu = document.getElementById("newgame_menu");
        button_newgame_setting = document.getElementById("newgame_setting");
        button_newgame_gameover = document.getElementById("newgame_gameover");
        button_setting_menu = document.getElementById("setting_menu");
        button_setting_gameover = document.getElementById("setting_gameover");

        //分數 速度 牆壁
        ele_score = document.getElementById("score_value");
        speed_setting = document.getElementsByName("speed");
        wall_setting = document.getElementsByName("wall");

        //設定各按鈕的功能
        //新遊戲
        button_newgame_menu.onclick = function() {
            newGame();
        };
        //結束重新開始
        button_newgame_gameover.onclick = function() {
            newGame();
        };
        //遊戲設定裡的新遊戲
        button_newgame_setting.onclick = function() {
            newGame();
        };
        //根據上面寫好的情況2
        button_setting_menu.onclick = function() {
            showScreen(2);
        };
        button_setting_gameover.onclick = function() {
            showScreen(2)
        };

        //蛇蛇初始速度
        setSnakeSpeed(150);
        //預設有邊界
        setWall(1);
        //呈現主畫面
        showScreen("menu");

        // 遊戲設定裡選擇"速度"
        for (var i = 0; i < speed_setting.length; i++) {
            speed_setting[i].addEventListener("click", function() {
                for (var i = 0; i < speed_setting.length; i++) {
                    if (speed_setting[i].checked) {
                        setSnakeSpeed(speed_setting[i].value);
                    }
                }
            });
        }

        // 遊戲設定裡選擇"邊界"
        for (var i = 0; i < wall_setting.length; i++) {
            wall_setting[i].addEventListener("click", function() {
                for (var i = 0; i < wall_setting.length; i++) {
                    if (wall_setting[i].checked) {
                        setWall(wall_setting[i].value);
                    }
                }
            });
        }
        //呈現死亡畫面
        //設定案空白鍵可開始新遊戲
        document.onkeydown = function(evt) {
            if (screen_gameover.style.display == "block") {
                evt = evt || window.event;
                if (evt.keyCode == 32) {
                    newGame();
                }
            }
        }
    }

})();