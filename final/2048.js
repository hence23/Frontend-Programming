var gameObj = {
    points: {
        //分數 歷史分數
        score: 0,
        history: [],
        status: 1
    },

    //空陣列
    biglist: [],

    // 4x4矩陣
    intiStage: function() {
        for (var cell = 0; cell < 4; cell++) {
            this.biglist[cell] = [];
            for (var row = 0; row < 4; row++) {
                this.biglist[cell][row] = {
                    boxObj: null,
                    position: [cell, row]
                };
            }
        }
    },

    //清空陣列fuction
    empty: function() {
        var emptyList = [];
        for (var row = 0; row < 4; row++) {
            for (var cell = 0; cell < 4; cell++) {
                if (this.biglist[cell][row].boxObj == null) {
                    emptyList.push(this.biglist[cell][row]);
                }
            }
        }
        return emptyList;
    },

    newBox: function() {
        var _this = this;
        var box = function(allitem) {
            //初始先產生2or4
            var num = Math.random() > 0.9 ? 4 : 2;
            this.value = num;
            this.parent = allitem;
            this.domObj = function() {
                var mainBox = document.createElement('span');
                // mainBox.innerText = num;
                mainBox.textContent = num;
                //設置class名稱
                mainBox.className = 'row' + allitem.position[0] + ' ' + 'cell' + allitem.position[1] + ' ' + 'num' + num;
                var root = document.getElementById('biglist');
                //appendChild添增??????
                root.appendChild(mainBox);
                return mainBox;
            }();
            allitem.boxObj = this;
        }

        var emptyList = this.empty();
        if (emptyList.length) {
            //建立空白List來操作元素
            var randomIndex = Math.floor(Math.random() * emptyList.length);
            new box(emptyList[randomIndex]);
            return true;
        }
    },

    //GameOver條件
    isEnd: function() {
        var emptyList = this.empty();
        if (!emptyList.length) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    // 每個元素
                    var allitem = this.biglist[i][j];
                    //利用條件訂上下左右各值
                    var itemleft = (j == 0) ? { boxObj: { value: 0 } } : this.biglist[i][j - 1];
                    var itemright = (j == 3) ? { boxObj: { value: 0 } } : this.biglist[i][j + 1];
                    var itemup = (i == 0) ? { boxObj: { value: 0 } } : this.biglist[i - 1][j];
                    var itemdown = (i == 3) ? { boxObj: { value: 0 } } : this.biglist[i + 1][j];
                    //當每格上下左右有出現一或以上個值一樣，遊戲就可以繼續
                    //當每格上下左右都不相等時，回傳true，Gameover
                    if (allitem.boxObj.value == itemleft.boxObj.value ||
                        allitem.boxObj.value == itemdown.boxObj.value ||
                        allitem.boxObj.value == itemright.boxObj.value ||
                        allitem.boxObj.value == itemup.boxObj.value) {
                        return false
                    }
                }
            }
            return true;
        }
        return false;
    },

    //Gameover的時候彈出視窗
    gameOver: function() {
        alert('GAVE OVER!');
    },
    moveTo: function(obj1, obj2) {
        //當兩個數值相等時會合併，所以將前面數字調整為null
        obj2.boxObj = obj1.boxObj;
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
        obj1.boxObj = null;
    },
    addTo: function(obj1, obj2) {
        obj2.boxObj.domObj.parentNode.removeChild(obj2.boxObj.domObj);
        obj2.boxObj = obj1.boxObj; //兩數字相等合併
        obj1.boxObj = null; //前面數字變成0
        obj2.boxObj.value = obj2.boxObj.value * 2; //合併後變為原來兩倍
        obj2.boxObj.domObj.className = 'row' + obj2.position[0] + ' ' + 'cell' + obj2.position[1] + ' ' + 'num' + obj2.boxObj.value;
        obj2.boxObj.domObj.innerText = obj2.boxObj.value;
        obj2.boxObj.domObj.textContent = obj2.boxObj.value;
        this.points.score += obj2.boxObj.value; //分數增加為合併數字的值
        var scoreBar = document.getElementById('score');
        scoreBar.innerText = this.points.score; //分數顯示
        scoreBar.textContent = this.points.score; //分數顯示
        return obj2.boxObj.value;
    },
    clear: function(x, y) {
        var can = 0;
        for (var i = 0; i < 4; i++) {
            var fst = null;
            var fstEmpty = null;
            for (var j = 0; j < 4; j++) {
                var objInThisWay = null;
                switch ("" + x + y) {
                    case '00':
                        objInThisWay = this.biglist[i][j];
                        break;
                    case '10':
                        objInThisWay = this.biglist[j][i];
                        break;
                    case '11':
                        objInThisWay = this.biglist[3 - j][i];
                        break;
                    case '01':
                        objInThisWay = this.biglist[i][3 - j];
                        break;
                }
                if (objInThisWay.boxObj != null) {
                    if (fstEmpty) {
                        this.moveTo(objInThisWay, fstEmpty)
                        fstEmpty = null;
                        j = 0;
                        can = 1;
                    }
                } else if (!fstEmpty) {
                    fstEmpty = objInThisWay;
                }
            }
        }
        return can;
    },

    move: function(x, y) {
        var can = 0;
        can = this.clear(x, y) ? 1 : 0;
        var add = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 3; j++) {
                var objInThisWay = null;
                var objInThisWay2 = null;
                //利用switch做不同狀況時調整
                switch ("" + x + y) {
                    case '00': //向左
                        {
                            objInThisWay = this.biglist[i][j];
                            objInThisWay2 = this.biglist[i][j + 1];
                            break;
                        }
                    case '10': //向上
                        {
                            objInThisWay = this.biglist[j][i];
                            objInThisWay2 = this.biglist[j + 1][i];
                            break;
                        }

                    case '11': // 向下
                        {
                            objInThisWay = this.biglist[3 - j][i];
                            objInThisWay2 = this.biglist[2 - j][i];
                            break;
                        }
                    case '01': //向右
                        {
                            objInThisWay = this.biglist[i][3 - j];
                            objInThisWay2 = this.biglist[i][2 - j];
                            break;
                        }
                }
                //如果兩值相等，呼叫addto和clear
                if (objInThisWay2.boxObj && objInThisWay.boxObj.value == objInThisWay2.boxObj.value) {
                    add += this.addTo(objInThisWay2, objInThisWay);
                    this.clear(x, y);
                    //j++;
                    can = 1;
                }
            }
        }
        if (add) {
            var addscore = document.getElementById('addScore');
            addscore.innerText = "+" + add; //分數特效
            addscore.textContent = "+" + add; //分數特效
            addscore.className = "show"; //顯示
            setTimeout(function() {
                addscore.className = "hide"; //500毫秒後隱藏
            }, 500);
        }
        if (can) {
            this.newBox(); //新遊戲
        }
        if (this.isEnd()) {
            this.gameOver(); //Gameover時，彈幕視窗顯示
        }
    },

    inti: null
}

//控制上下左右
//呼叫move用x,y座標進行操作
var controller = function() {
    var startX = 0;
    var startY = 0;
    var ready = 0;
    this.start = function(x, y) {
        ready = 1;
        startX = x;
        startY = y;
    };
    this.move = function(x, y) {
        if (x - startX > 100 && ready) {
            gameObj.move(0, 1);
            ready = 0;
        } else if (startX - x > 100 && ready) {
            gameObj.move(0, 0);
            ready = 0;
        } else if (startY - y > 100 && ready) {
            gameObj.move(1, 0);
            ready = 0;
        } else if (y - startY > 100 && ready) {
            gameObj.move(1, 1);
            ready = 0;
        }
    }
    this.end = function(x, y) {
        ready = 0;
    }
    return {
        start: this.start,
        move: this.move,
        end: this.end
    }
}();

//在頁面加載完成後立刻生成
window.onload = function() {
    gameObj.intiStage();
    gameObj.newBox();
    //用keycode來操作上下左右的function
    function keyUp(e) {
        var currKey = 0,
            e = e || event;
        currKey = e.keyCode || e.which || e.charCode;
        //用fromCharCode來將上下左右的編碼作為keyname
        var keyName = String.fromCharCode(currKey);
        switch (currKey) {
            case 37: //左
                gameObj.move(0, 0);
                break;
            case 38: //上
                gameObj.move(1, 0);
                break;
            case 39: //右
                gameObj.move(0, 1);
                break;
            case 40: //下
                gameObj.move(1, 1);
                break;
        }
    }
    document.onkeyup = keyUp;
}