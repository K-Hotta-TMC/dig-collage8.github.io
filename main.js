//デバッグ表示
const DEBUG = true;
let drawCount = 0;
let fps = 0;
let lastTime = Date.now();

//スムージング
const Smoothing = false;

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
なので、でっかい画面でゲームができるように、「仮想画面にもう一つcanvasを作って、それを拡大させたものを実画面に表示する」という手順をとっています。
*/
const fieldAspectRatio = 1.1
const fieldWidth = screenWidth * fieldAspectRatio;
const fieldHeight = screenHeight * fieldAspectRatio;

//フィールド（仮想画面）を作成
let vcan = document.createElement("canvas"); //新しいcanvasの要素を作成
let vcon = vcan.getContext("2d")  //2D画面描写のドキュメントを取得する
vcan.width = fieldWidth;
vcan.height = fieldHeight;

//CANVAS作成
let can = document.getElementById("can"); //htmlにCANVASを表示させる
let con = can.getContext("2d")  //2D画面描写のドキュメントを取得する
can.width = canvasWidth;
can.height = canvasHeight;
con.mozimageSmoothingEnagbled = Smoothing;
con.webkitimageSmoothingEnabled = Smoothing;
con.msimageSmoothingEnabled = Smoothing;
con.imageSmoothingEnabled = Smoothing;


//フィールド（仮想画面）を作成＞カメラ座標
let cameraX = 0;
let cameraY = 0;

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
    //一定時間毎に処理を繰り返す
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
    updateObj(teki);
    updateObj(teta);
    updateObj(expl);
    jiki.update();
}

//描画の処理
function drawAll() {
    vcon.fillStyle = (jiki.damage) ? "red" : "black";
    vcon.fillRect(cameraX, cameraY, screenWidth, screenHeight);
    drawObj(teki);
    drawObj(teta);
    drawObj(star);
    drawObj(tama);
    drawObj(expl);
    jiki.draw();

    //自機の範囲0〜fieldWidth
    //カメラの範囲０〜(fieldWidth-screenWidth)
    cameraX = (jiki.x >> 8) / fieldWidth * (fieldWidth - screenWidth);
    cameraY = (jiki.y >> 8) / fieldHeight * (fieldHeight - screenHeight);

    //仮想画面から実際のキャンバスにコピー
    con.drawImage(vcan, cameraX, cameraY, screenWidth, screenHeight, 0, 0, canvasWidth, canvasHeight)
}


//情報の表示
function putInfo() {
    if (DEBUG) {
        drawCount++
        if (lastTime + 1000 <= Date.now()) {
            fps = drawCount;
            drawCount = 0;
            lastTime = Date.now()
        }
        con.font = "20px ' Impact'";
        con.fillStyle = "white";
        con.fillText("fps:" + fps, 20, 20);
        con.fillText("Tama:" + tama.length, 20, 40);
        con.fillText("Teki:" + teki.length, 20, 60);
        con.fillText("Teta:" + teta.length, 20, 80);
    }
}

//1コマの描画処理方法を関数定義
function gameLoop() {
    //テスト的に敵を出す
    if (rand(0, 10) === 1) {
        teki.push((new Teki(39, rand(0, fieldWidth) << 8, 0, 0, rand(300, 1200))))
    }

    updateAll();
    drawAll();
    putInfo();
}

//オンロードでゲーム開始
window.onload = function () {
    gameInit();
}