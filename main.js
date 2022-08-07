//ゲームスピード(ms)
const gameSpeed = 1000 / 60; //1000msを60回で割る → 秒間60 → 60fps

//画面サイズ定義
const screenWidth = 320;
const screenHeight = 320;

//CANVASサイズ定義
const canvasAspectRatio = 2;
const canvasWidth = screenWidth * canvasAspectRatio;
const canvasHeight = screenHeight * canvasAspectRatio;

//フィールド（仮想画面）サイズ
/*仮想画面と実画面に分けているのはなぜかと言うと、拡大表示したいからです。
というのもどうやら実画面だけでは拡大できず、「256 × 224」の画面サイズが等倍で表示されるようです。（結構小さい）
なので、でっかい画面でゲームができるように、「仮想画面にもう一つcanvasを作って、それを拡大させたものを実画面に表示する」という手順をとっている。
*/
const fieldWidth = screenWidth + 120;
const fieldHeight = screenHeight + 40;


//CANVAS作成
let can = document.getElementById("can"); //htmlにCANVASを表示させる
let con = can.getContext("2d")  //2D画面描写のドキュメントを取得する
can.width = canvasWidth;
can.height = canvasHeight;

//画面をスムージングをオフ。輪郭をはっきりさせる。
const Smoothing = false;
con.mozimageSmoothingEnagbled = Smoothing;
con.webkitimageSmoothingEnabled = Smoothing;
con.msimageSmoothingEnabled = Smoothing;
con.imageSmoothingEnabled = Smoothing;
con.font = "20px ' Impact'";

//フィールド（仮想画面）を作成
let vcan = document.createElement("canvas"); //新しいcanvasの要素を作成
let vcon = vcan.getContext("2d")  //2D画面描写のドキュメントを取得する
vcan.width = fieldWidth;
vcan.height = fieldHeight;
vcon.font = "12px ' Impact'";

//フィールド（仮想画面）を作成＞カメラ座標
let cameraX = 0;
let cameraY = 0;

//ゲームオーバー/スコア等の設定
let gameOver = false;
let score = 0;
let gameCount = 0;
let gameWave = 0;

//ボスのHP
let bossHP = 0;
let bossMHP = 0;

//星を定義
const starMax = 300; //星の数
let star = []; //星を実体

//キーボードの状態
let key = [];

//オブジェクト
let teki = [];
let tama = [];
let teta = [];
let expl = [];
let jiki = new Jiki();

//ファイルを読み込み
let spriteImage = new Image();
spriteImage.src = "sprite.png";

//ゲーム初期化
function gameInit() {
    //星を生成し、格納する
    for (let i = 0; i < starMax; i++) {
        star[i] = new StarDraw();   //インスタンス化、クラスの実行結果を各配列に格納
    }
    //一定時間毎に処理を繰り返す。秒間60回毎に描画させる
    setInterval(gameLoop, gameSpeed);
}

//オブジェクトをアップデート
function updateObj(obj) {
    for (let i = obj.length - 1; i >= 0; i--) {
        obj[i].update();
        if (obj[i].kill) {
            obj.splice(i, 1);
        }
    }
}

//オブジェクトを描画
function drawObj(obj) {
    for (let i = 0; i < obj.length; i++) {
        obj[i].draw();
    }
}

//移動の処理
function updateAll() {
    updateObj(star);
    updateObj(tama);
    if (!gameOver) jiki.update();
    updateObj(teta);
    updateObj(teki);
    updateObj(expl);
}

//描画の処理
function drawAll() {
    vcon.fillStyle = (jiki.damage) ? "red" : "black";
    vcon.fillRect(cameraX, cameraY, screenWidth, screenHeight);
    drawObj(star);
    drawObj(tama);
    if (!gameOver) jiki.draw();
    drawObj(teki);
    drawObj(expl);
    drawObj(teta);

    //自機の範囲0〜fieldWidth
    //カメラの範囲０〜(fieldWidth-screenWidth)
    cameraX = Math.floor((jiki.x >> 8) / fieldWidth * (fieldWidth - screenWidth));
    cameraY = Math.floor((jiki.y >> 8) / fieldHeight * (fieldHeight - screenHeight));

    //ボスのHPを表示する
    if (bossHP > 0) {
        let sz = (screenWidth - 20) * bossHP / bossMHP;
        let sz2 = (screenWidth - 20);
        vcon.fillStyle = "rgba(255,0,0,0.5)";
        vcon.fillRect(cameraX + 10, cameraY + 10, sz, 10);
        vcon.strokeStyle = "rgba(255,0,0,0.9)";
        vcon.strokeRect(cameraX + 10, cameraY + 10, sz2, 10);
    }
    //自機のHPを表示する
    if (jiki.hp > 0) {
        let sz = (screenWidth - 20) * jiki.hp / jiki.mhp;
        let sz2 = (screenWidth - 20);
        vcon.fillStyle = "rgba(0,0,255,0.8)";
        vcon.fillRect(cameraX + 10, cameraY + screenHeight - 14, sz, 10);
        vcon.strokeStyle = "rgba(0,0,255,0.9)";
        vcon.strokeRect(cameraX + 10, cameraY + screenHeight - 14, sz2, 10);
    }

    //スコア表示
    vcon.fillStyle = "white";
    vcon.fillText("SCORE " + score, cameraX + 10, cameraY + 14);

    //仮想画面から実際のキャンバスにコピー
    con.drawImage(vcan, cameraX, cameraY, screenWidth, screenHeight, 0, 0, canvasWidth, canvasHeight)
}

//情報の表示
function putInfo() {
    con.fillStyle = "white";
    if (gameOver) {
        let s = "GAME OVER";
        let w = con.measureText(s).width;
        let x = canvasWidth / 2 - w / 2
        let y = canvasHeight / 2 - 20;
        con.fillText(s, x, y);
        s = "Push 'R' key to restart !";
        w = con.measureText(s).width;
        x = canvasWidth / 2 - w / 2
        y = canvasHeight / 2 - 20 + 20;
        con.fillText(s, x, y);
    }
}

//1コマの描画処理方法を関数定義
function gameLoop() {
    updateAll();
    drawAll();
    putInfo();
    if (gameOver) return;   //ゲームオーバーで敵の出現を無くす
    gameCount++;    //ゲームのカウント
    if (gameWave === 0) {
        if (rand(0, 20) === 1) {
            teki.push((new Teki(0, rand(0, fieldWidth) << 8, 0, 0, rand(300, 600))))
        }
        if (gameCount > 60 * 20) {
            gameWave++;
            gameCount = 0;
        }
    } else if (gameWave === 1) {
        if (rand(0, 15) === 1) {
            teki.push((new Teki(1, rand(0, fieldWidth) << 8, 0, 0, rand(300, 1200))))
        }
        if (gameCount > 60 * 20) {
            gameWave++;
            gameCount = 0;
        }
    } else if (gameWave === 2) {
        if (rand(0, 10) === 1) {
            let r = rand(0, 1)
            if (r === 0) {
                teki.push((new Teki(0, rand(0, fieldWidth) << 8, 0, 0, rand(300, 600))))
            } else {
                teki.push((new Teki(1, rand(0, fieldWidth) << 8, 0, 0, rand(300, 1200))))
            }
        }
        if (gameCount > 60 * 20) {
            gameWave++;
            gameCount = 0;
        }
    } else if (gameWave === 3) {
        if (rand(0, 10) === 1) {
            teki.push((new Teki(2, rand(0, fieldWidth) << 8, 0, 0, rand(200, 300))))
        }
        if (gameCount > 60 * 20) {
            gameWave++;
            gameCount = 0;
        }
    } else if (gameWave === 4) {
        if (rand(0, 15) === 1) {
            teki.push((new Teki(3, rand(0, fieldWidth) << 8, 0, 0, rand(600, 1500))))
        }
        if (gameCount > 60 * 20) {
            gameWave++;
            gameCount = 0;
        }
    } else if (gameWave === 5) {
        if (rand(0, 10) === 1) {
            let r = rand(0, 3)
            if (r === 0) {
                teki.push((new Teki(0, rand(0, fieldWidth) << 8, 0, 0, rand(300, 600))))
            } else if (r === 1) {
                teki.push((new Teki(1, rand(0, fieldWidth) << 8, 0, 0, rand(300, 1200))))
            } else if (r === 2) {
                teki.push((new Teki(2, rand(0, fieldWidth) << 8, 0, 0, rand(200, 300))))
            } else {
                teki.push((new Teki(3, rand(0, fieldWidth) << 8, 0, 0, rand(600, 1500))))
            }
        }
        if (gameCount > 60 * 20) {
            gameWave++;
            gameCount = 0;
            teki.push((new Teki(4, fieldWidth / 2 << 8, -(70 << 8), 0, 200)))
        }
    } else if (gameWave === 6) {
        if (teki.length === 0) {
            gameWave = 0;
            gameCount = 0;
        }
    }
}


// クリックでゲーム開始
// ゲーム開始画面
let checkButton = document.getElementById("buttonClick");
let element = document.getElementById("wholeSetting");
let lec = 0;
function buttonClick() {
    element.style.display = "none";
    gameInit();
}

if (lec === 0) {
    lec++;
    checkButton.addEventListener("click", buttonClick);
} else {
    // オンロードでゲーム開始
    window.onload = function () {
        gameInit();
    }
}
