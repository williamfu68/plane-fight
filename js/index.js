// 声明变量，存储数据
var plane; // 我方战机
var bullets = []; // 存放所有子弹
var enemies = []; // 所有小敌机
var middleEnemies = []; // 所有中型敌机
var score = 0; // 记录积分
var historyScores = []; // 记录历史积分
var enemySpeed = 0; // 控制敌机速度

// 一组状态值，用于记录当前按下的是哪个方向键
var leftState = false;
var rightState = false;
var topState = false;
var bottomState = false;
var shootState = false;
var gameState = false;
var flag = true; // 根据 flag变量的状态决定显示或者隐藏积分记录
var hugeisDied = false;
var hugeStatus = true;
var hugeMoveStatus = true;

// 获取 DOM元素
var main = document.getElementById('main');
var startBtn = document.getElementById('start-btn');
var fightInfo = document.querySelector('.fight-info');
var scoreNum = document.querySelector('.score-number');
var blood = document.querySelector('.blood');
var bloodItems = document.querySelectorAll('.blood-item');
var pause = document.querySelector('.pause');
var shade = document.querySelector('.shade');
var shadeBtn = document.querySelector('.shade-btn-box');
var abandonBtn = document.querySelector('.abandon');
var continueBtn = document.querySelector('.continue');
var gameoverPage = document.querySelector('.gameover-page');
var gameoverTitle = document.querySelector('.gameover-title');
var againBtn = document.querySelector('.gameover-btn');
var scoreRecord = document.querySelector('.score-record');
var scoreText = document.querySelector('.score-text');
var scoreWrap = document.querySelector('.score-wrap');

// 按键监听，确认方向键  上：38， 下：40， 左：37，右：39，空格：32
document.addEventListener('keydown', function(e) {
    var k = e.keyCode || e.which || e.keyCode;
    // console.log('键盘码：', k);
    if (k === 38) {
        topState = true;
    } else if (k === 40) {
        bottomState = true;
    } else if (k === 37) {
        leftState = true;
    } else if (k === 39) {
        rightState = true;
    }

    if (k === 32) {
        shootState = true;
    }
})

document.addEventListener('keyup', function(e) {
        var k = e.keyCode || e.which || e.charCode;
        if (k === 38) {
            topState = false;
        } else if (k === 40) {
            bottomState = false;
        } else if (k === 37) {
            leftState = false;
        } else if (k === 39) {
            rightState = false;
        }

        if (k === 32) {
            shootState = false;
        }
    })
    //开始游戏
startBtn.addEventListener('click', function() {
        this.style.display = 'none';
        main.style.background = 'url(images/background_1.png) no-repeat';
        fightInfo.style.visibility = 'visible';
        scoreRecord.style.visibility = 'visible';
        startGame();
    })
    // 暂停游戏
pause.addEventListener('click', function() {
        main.removeChild(plane.img);
        shade.style.zIndex = 2;
        shade.style.visibility = 'visible';
        clearInterval(timer1);
        clearInterval(timer2);
        clearTimeout(timer3);
        clearInterval(timer4);
        clearInterval(timer5);
        clearInterval(timer6);
        clearInterval(timer7);
        clearInterval(timer9);
        clearInterval(timer10);
        clearInterval(timer11);
        clearInterval(timer12);

    })
    // 重新开始
abandonBtn.addEventListener('click', function() {
        historyScores.push(parseInt(scoreNum.innerText));

        shade.style.zIndex = -1;
        shade.style.visibility = 'hidden';
        window.location.reload();
    })
    // 继续游戏
continueBtn.addEventListener('click', function() {
        shade.style.zIndex = -1;
        shade.style.visibility = 'hidden';
        startGame();
    })
    // 再来一局
againBtn.addEventListener('click', function() {
        historyScores.push(parseInt(scoreNum.innerText));
        gameoverPage.style.zIndex = -2;
        window.location.reload();
    })
    // 积分记录
scoreText.addEventListener('click', function() {
    if (flag) {
        flag = false;
        scoreText.style.borderBottom = '2px solid #b4b8b9';
        scoreWrap.style.transform = 'scaleY(1)';
        historyScores.push(parseInt(scoreNum.innerText));
        scoreWrap.innerHTML = '';

        function getTime() {
            var now = new Date();
            var y = now.getFullYear();
            var m = now.getMonth() + 1;
            var d = now.getDate();
            var h = now.getHours();
            var mi = now.getMinutes();
            var s = now.getSeconds();
            mi = checkTime(mi);
            s = checkTime(s);

            function checkTime(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            }
            // 21:32 PM · Oct 5，2020 
            return mi + ':' + s + ' ' + 'AM' + ' ' + '·' + ' ' + 'Oct' + ' ' + m + '，' + y;
        }


        for (i = 0; i < historyScores.length; i++) {
            for (j = i + 1; j < historyScores.length; j++) {
                if (historyScores[i] == historyScores[j]) {
                    historyScores.splice(j, 1);
                }
            }
        }
        for (var i = 0; i <= historyScores.length - 1; i++) { //外层循环控制趟数
            for (var j = 0; j <= historyScores.length - i - 1; j++) { //内层循环控制交换次数
                if (historyScores[j] < historyScores[j + 1]) {
                    var temp = historyScores[j];
                    historyScores[j] = historyScores[j + 1];
                    historyScores[j + 1] = temp;
                }
            }
        }
        for (i = 0; i < historyScores.length; i++) {
            var li = document.createElement('li');
            li.className = 'score-item';
            var textNode = document.createTextNode(historyScores[i] + ' ' + getTime());
            scoreWrap.appendChild(li);
            li.appendChild(textNode);
        }
    } else {
        scoreWrap.style.transform = 'scaleY(0)';
        flag = true;
        scoreText.style.border = '0';
    }
})

//开始游戏
function startGame() {
    plane = new Plane('images/myplane.gif', 125, 450); // 实例化我方战机
    timer1 = setInterval(planeMove, 20); // 玩家飞机移动
    timer2 = setInterval(bulletMove, 100); // 玩家飞机子弹移动
    timer3 = setInterval(createEnemy, 1500); // 批量创建敌机
    timer4 = setInterval(enemyMove, 50); // 敌机移动
    timer5 = setInterval(isHit, 10); // 判断玩家战机子弹和敌机是否接触
    timer6 = setInterval(isCrash, 600); // 判断玩家战机和敌方战机是否接触
    timer7 = setInterval(isDied, 500); // 计算击落敌机得分
    timer8 = setInterval(detectScore, 500) // 检测得分，超过一定得分增加敌机出现的频率和速度
    timer9 = setInterval(createMiddleEnemy, 3000); // 批量创建中型敌机
    timer10 = setInterval(middleEnemyMove, 50); // 中型敌机移动
    timer11 = setInterval(middleisHit, 10); // 判断玩家战机子弹和中型敌机是否接触
    timer12 = setInterval(middleisCrash, 600); // 判断玩家战机和敌方中型战机是否接触
}

// 玩家战机构造函数
function Plane(src, x, y) {
    this.img = document.createElement('img');
    this.src = src;
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.blood = 100;
    this.hitCount = 3;
    this.dieTime = 10;
    this.moveTop = function() {
        if (parseInt(this.img.style.top) > 0) {
            this.img.style.top = parseInt(this.img.style.top) - this.speed + 'px';
        } else {
            this.img.style.top = '0';
        }
    }
    this.moveBottom = function() {
        if (parseInt(this.img.style.top) < 568 - 80) {
            this.img.style.top = parseInt(this.img.style.top) + this.speed + 'px';
        } else {
            this.img.style.top = 568 - 80 + 'px';
        }

    }
    this.moveLeft = function() {
        if (parseInt(this.img.style.left) > 0) {
            this.img.style.left = parseInt(this.img.style.left) - this.speed + 'px';
        } else {
            this.img.style.left = '0';
        }

    }
    this.moveRight = function() {
        if (parseInt(this.img.style.left) < 320 - 66) {
            this.img.style.left = parseInt(this.img.style.left) + this.speed + 'px';
        } else {
            this.img.style.left = 320 - 66 + 'px';
        }

    }
    this.shoot = function() {
        var x = parseInt(this.img.style.left) + 33 - 7;
        var y = parseInt(this.img.style.top) - 16;
        var bullet = new Bullet('images/bullet.png', x, y, 30);
        bullets.push(bullet);
    }
    this.init = function() {
        this.img.style.position = "absolute";
        this.img.style.zIndex = 2;
        this.img.src = this.src;
        this.img.style.top = this.y + 'px';
        this.img.style.left = this.x + 'px';
        main.appendChild(this.img);
    }
    this.init();
}
// 玩家战机移动
function planeMove() {
    if (topState) {
        plane.moveTop();
        scoreWrap.style.transform = 'scaleY(0)';
        scoreText.style.border = '0';
    } else if (bottomState) {
        plane.moveBottom();
        scoreWrap.style.transform = 'scaleY(0)';
        scoreText.style.border = '0';
    } else if (leftState) {
        plane.moveLeft();
        scoreWrap.style.transform = 'scaleY(0)';
        scoreText.style.border = '0';
    } else if (rightState) {
        plane.moveRight();
        scoreWrap.style.transform = 'scaleY(0)';
        scoreText.style.border = '0';
    }
    if (shootState) {
        plane.shoot();
        scoreWrap.style.transform = 'scaleY(0)';
        scoreText.style.border = '0';
    }
}
// 玩家战机子弹构造函数
function Bullet(src, x, y, speed) {
    this.img = document.createElement('img');
    this.src = src;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isDied = false;
    this.move = function() {
        this.img.style.top = parseInt(this.img.style.top) - this.speed + 'px';
    }
    this.init = function() {
        this.img.src = this.src;
        this.img.style.position = 'absolute';
        this.img.style.left = this.x + 'px';
        this.img.style.top = this.y + 'px';
        main.appendChild(this.img);
    }
    this.init();
}
// 玩家战机子弹移动
function bulletMove() {
    for (var i = 0; i < bullets.length; i++) {
        if (!bullets[i].isDied) {
            if (parseInt(bullets[i].img.style.top) > -18) {
                bullets[i].move();
            } else {
                main.removeChild(bullets[i].img);
                bullets.splice(i, 1);
            }
        } else {
            main.removeChild(bullets[i].img);
            bullets.splice(i, 1);
        }

    }
}


// 敌机构造函数
function Enemy(src, x, y, speed, blood) {
    this.img = document.createElement('img');
    this.src = src;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.blood = blood;
    this.isDied = false;
    this.dieTime = 10;
    this.move = function() {
        this.img.style.top = parseInt(this.img.style.top) + this.speed + 'px';
    }
    this.init = function() {
        this.img.src = this.src;
        this.img.style.position = 'absolute';
        this.img.style.top = this.y + 'px';
        this.img.style.left = this.x + 'px';
        main.appendChild(this.img);
    }
    this.init();
}

function createEnemy() {
    var x = Math.floor(Math.random() * (320 - 34));
    var y = 30 + Math.floor(Math.random() * 24);
    var speed = enemySpeed + Math.ceil(Math.random() * 8);
    var enemy = new Enemy('images/enemy1.png', x, y, speed);
    enemies.push(enemy);
}

// 敌机移动
function enemyMove() {
    for (i = 0; i < enemies.length; i++) {
        if (!enemies[i].isDied) {
            if (parseInt(enemies[i].img.style.top) < (568 + 24)) {
                enemies[i].move();
            } else {
                main.removeChild(enemies[i].img);
                enemies.splice(i, 1);
            }
        } else {
            enemies[i].dieTime--;
            if (enemies[i].dieTime <= 0) {
                main.removeChild(enemies[i].img);
                enemies.splice(i, 1);
            }
        }
    }
}

// 玩家飞机子弹与敌方小飞机碰撞判断
function isHit() {
    for (i = 0; i < bullets.length; i++) {
        for (j = 0; j < enemies.length; j++) {
            var bt = parseInt(bullets[i].img.style.top);
            var bl = parseInt(bullets[i].img.style.left);
            var et = parseInt(enemies[j].img.style.top);
            var el = parseInt(enemies[j].img.style.left);
            if (bt <= et + 24 && bt > et && bl + 16 > el && bl < el + 34) {
                bullets[i].isDied = true;
                enemies[j].isDied = true;
                enemies[j].img.src = 'images/boom1.gif';
            }
        }
    }
}

// 玩家飞机与敌方飞机碰撞判断
function isCrash() {
    for (i = 0; i < enemies.length; i++) {
        var pt = parseInt(plane.img.style.top);
        var pl = parseInt(plane.img.style.left);
        var et = parseInt(enemies[i].img.style.top);
        var el = parseInt(enemies[i].img.style.left);

        if (et <= pt + 80 && et > pt && el + 34 > pl && el < pl + 66) {

            plane.hitCount--;
            console.log(plane.hitCount);
            if (plane.hitCount == 2) {
                bloodItems[2].style.backgroundColor = '#c3c8c9';
                bloodItems[1].style.backgroundColor = '#3396cc';
                bloodItems[0].style.backgroundColor = '#3396cc';
                console.log('我方飞机与敌机碰撞 1 次');
            } else if (plane.hitCount == 1) {
                bloodItems[1].style.backgroundColor = '#c3c8c9';
                bloodItems[0].style.backgroundColor = '#dc143c';
                console.log('我方飞机与敌机碰撞 2 次');
            } else if (plane.hitCount == 0) {
                plane.img.src = "images/plane-boom.gif";
                blood.style.visibility = "hidden";
                console.log('我方飞机与敌机碰撞 1 次');
                setTimeout(fadeOut, 1000);

                function fadeOut() {
                    main.removeChild(plane.img);
                    // plane.img.style.display = 'none';
                    gameoverTitle.innerHTML = '<h2>游戏结束 ' + scoreNum.innerText + '</h2>';
                    gameoverPage.style.zIndex = 2;
                    clearInterval(timer1);
                    clearInterval(timer2);
                    clearInterval(timer3);
                    clearInterval(timer5);
                    clearInterval(timer6);
                    clearInterval(timer7);
                    clearInterval(timer9);
                    clearInterval(timer11);
                    clearInterval(timer12);

                    console.clear();
                }
            }
        }
    }
}

// 计算得分 
function isDied() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].isDied) {
            score += 10;
        }
    }
    scoreNum.innerText = score;
    for (var i = 0; i < middleEnemies.length; i++) {
        if (middleEnemies[i].isDied) {
            score += 20;
        }
    }
    scoreNum.innerText = score;
    if (hugeisDied) {
        score += 50;
        scoreNum.innerText = score;
        hugeisDied = false;
    }
}

// 积分升高，提高游戏难度
function detectScore() {
    if (parseInt(scoreNum.innerText) >= 20) {
        enemySpeed = 2;
        if (hugeMoveStatus) {
            // 大型敌机构造函数
            function hugeEnemy(src, x, y, speed, blood) {
                this.img = document.createElement('img');
                this.src = src;
                this.x = x;
                this.y = y;
                this.speed = speed;
                this.blood = blood;
                this.dieTime = 10;
                this.init = function() {
                    this.img.src = this.src;
                    this.img.style.position = 'absolute';
                    this.img.style.left = this.x + 'px';
                    this.img.style.top = this.y + 'px';
                    main.appendChild(this.img);
                }
                this.init();
                this.move = function() {
                    this.img.style.top = parseInt(this.img.style.top) + this.speed + 'px';
                }
            }

            // 创建大型敌机
            function createHugeEnemy() {
                var x = Math.floor(Math.random() * (320 - 110));
                var y = -Math.floor(Math.random() * 164);
                var speed = 2;
                var blood = 100;
                dieTime = 10;
                hugeEnemy = new MiddleEnemy('images/enemy3.png', x, y, speed, blood);
            }
            createHugeEnemy();

            timer13 = setInterval(hugeEnemyMove, 100); // 大型敌机移动 
            timer14 = setInterval(hugeisHit, 10); // 判断玩家飞机子弹和大型敌机是否接触
            timer15 = setInterval(hugeisCrash, 600); // 判断玩家飞机和大型敌机是否接触

            // 玩家飞机子弹与大型敌机碰撞判断
            function hugeisHit() {
                for (i = 0; i < bullets.length; i++) {
                    var bt = parseInt(bullets[i].img.style.top);
                    var bl = parseInt(bullets[i].img.style.left);
                    var lt = parseInt(hugeEnemy.img.style.top);
                    var ll = parseInt(hugeEnemy.img.style.left);
                    if (bt <= lt + 164 && bt > lt && bl + 16 > ll && bl < ll + 110) {
                        bullets[i].isDied = true;
                        hugeEnemy.isDied = true;
                        hugeEnemy.img.src = 'images/boom3.gif';
                    }
                }
            }
            // 玩家战机与大型敌机碰撞判断
            function hugeisCrash() {
                var pt = parseInt(plane.img.style.top);
                var pl = parseInt(plane.img.style.left);
                var lt = parseInt(hugeEnemy.img.style.top);
                var ll = parseInt(hugeEnemy.img.style.left);
                if (lt <= pt + 80 && lt > pt && ll + 110 > pl && ll < pl + 66) {
                    plane.hitCount--;
                    console.log(plane.hitCount);
                    if (plane.hitCount == 2) {
                        bloodItems[2].style.backgroundColor = '#c3c8c9';
                        bloodItems[1].style.backgroundColor = '#3396cc';
                        bloodItems[0].style.backgroundColor = '#3396cc';
                        console.log('我方飞机与敌机碰撞 1 次');
                    } else if (plane.hitCount == 1) {
                        bloodItems[1].style.backgroundColor = '#c3c8c9';
                        bloodItems[0].style.backgroundColor = '#dc143c';
                        console.log('我方飞机与敌机碰撞 2 次');
                    } else if (plane.hitCount == 0) {
                        plane.img.src = "images/plane-boom.gif";
                        blood.style.visibility = "hidden";
                        console.log('我方飞机与敌机碰撞 3 次');
                        setTimeout(fadeOut, 1000);

                        function fadeOut() {
                            main.removeChild(hugeEnemy.img);
                            // plane.img.style.display = 'none';
                            gameoverTitle.innerHTML = '<h2>游戏结束 ' + scoreNum.innerText + '</h2>';
                            gameoverPage.style.zIndex = 2;
                            clearInterval(timer1);
                            clearInterval(timer2);
                            clearInterval(timer3);
                            clearInterval(timer5);
                            clearInterval(timer6);
                            clearInterval(timer7);
                            clearInterval(timer9);
                            console.clear();
                        }
                    }
                }
            }
            // 大型敌机移动
            function hugeEnemyMove() {
                if (!hugeEnemy.isDied) {
                    if (parseInt(hugeEnemy.img.style.top) < (568 + 164)) {
                        hugeEnemy.move();
                    } else {
                        huge.style.display = 'none';
                    }
                } else {
                    hugeEnemy.dieTime--;
                    if (hugeEnemy.dieTime <= 0) {

                        if (hugeStatus) {
                            main.removeChild(hugeEnemy.img);
                            hugeStatus = false;
                            hugeisDied = true;
                        }
                    }
                }
            }
        } else if (parseInt(scoreNum.innerText) >= 500) {
            enemySpeed = 4;
            timer3 = setTimeout(createEnemy, 600);
        }
        hugeMoveStatus = false;
    }

}


// 中型敌机构造函数
function MiddleEnemy(src, x, y, speed, blood) {
    this.img = document.createElement('img');
    this.src = src;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dieTime = 10;
    this.init = function() {
        this.img.src = this.src;
        this.img.style.position = 'absolute';
        this.img.style.left = this.x + 'px';
        this.img.style.top = this.y + 'px';
        main.appendChild(this.img);
    }
    this.init();
    this.move = function() {
        this.img.style.top = parseInt(this.img.style.top) + this.speed + 'px';
    }

}

// 批量创建中型敌机
function createMiddleEnemy() {
    var x = Math.floor(Math.random() * (320 - 46));
    var y = 30 + Math.floor(Math.random() * 60);
    var speed = enemySpeed + Math.ceil(Math.random() * 2);
    var middleEnemy = new MiddleEnemy('images/enemy2.png', x, y, speed);
    middleEnemies.push(middleEnemy);
}

// 中型敌机移动
function middleEnemyMove() {
    for (i = 0; i < middleEnemies.length; i++) {
        if (!middleEnemies[i].isDied) {
            if (parseInt(middleEnemies[i].img.style.top) < (568 + 60)) {
                middleEnemies[i].move();
            } else {
                main.removeChild(middleEnemies[i].img);
                middleEnemies.splice(i, 1);
            }
        } else {
            middleEnemies[i].dieTime--;
            if (middleEnemies[i].dieTime <= 0) {
                main.removeChild(middleEnemies[i].img);
                middleEnemies.splice(i, 1);
            }
        }

    }
}
// 玩家飞机子弹与中型敌机碰撞判断
function middleisHit() {
    for (i = 0; i < bullets.length; i++) {
        for (j = 0; j < middleEnemies.length; j++) {
            var bt = parseInt(bullets[i].img.style.top);
            var bl = parseInt(bullets[i].img.style.left);
            var mt = parseInt(middleEnemies[j].img.style.top);
            var ml = parseInt(middleEnemies[j].img.style.left);
            if (bt <= mt + 60 && bt > mt && bl + 16 > ml && bl < ml + 46) {
                bullets[i].isDied = true;
                middleEnemies[j].isDied = true;
                middleEnemies[j].img.src = 'images/boom2.gif';
            }
        }
    }
}

// 玩家飞机与中型飞机碰撞判断
function middleisCrash() {
    for (i = 0; i < middleEnemies.length; i++) {
        var pt = parseInt(plane.img.style.top);
        var pl = parseInt(plane.img.style.left);
        var mt = parseInt(middleEnemies[i].img.style.top);
        var ml = parseInt(middleEnemies[i].img.style.left);

        if (mt <= pt + 80 && mt > pt && ml + 46 > pl && ml < pl + 66) {

            plane.hitCount--;
            console.log(plane.hitCount);
            if (plane.hitCount == 2) {
                bloodItems[2].style.backgroundColor = '#c3c8c9';
                bloodItems[1].style.backgroundColor = '#3396cc';
                bloodItems[0].style.backgroundColor = '#3396cc';
                console.log('我方飞机与敌机碰撞 1 次');
            } else if (plane.hitCount == 1) {
                bloodItems[1].style.backgroundColor = '#c3c8c9';
                bloodItems[0].style.backgroundColor = '#dc143c';
                console.log('我方飞机与敌机碰撞 2 次');
            } else if (plane.hitCount == 0) {
                plane.img.src = "images/plane-boom.gif";
                blood.style.visibility = "hidden";
                console.log('我方飞机与敌机碰撞 1 次');
                setTimeout(fadeOut, 1000);

                function fadeOut() {
                    main.removeChild(plane.img);
                    // plane.img.style.display = 'none';
                    gameoverTitle.innerHTML = '<h2>游戏结束 ' + scoreNum.innerText + '</h2>';
                    gameoverPage.style.zIndex = 2;
                    clearInterval(timer1);
                    clearInterval(timer2);
                    clearInterval(timer3);
                    clearInterval(timer5);
                    clearInterval(timer6);
                    clearInterval(timer7);
                    clearInterval(timer9);
                    clearInterval(timer11);
                    clearInterval(timer12);
                    console.clear();
                }
                break;
            }
        }
    }
}