//星クラス作成
class StarDraw {
    constructor() {
        this.x = rand(0, fieldWidth) << 8; //x座標
        this.y = rand(0, fieldHeight) << 8; //y座標
        this.vx = 0; //x方向のベクトル
        this.vy = rand(30, 200); //y方向のベクトル
        this.size = rand(1, 2); //星の大きさ
    }
    draw() {
        let x = this.x >> 8
        let y = this.y >> 8
        if (x < cameraX || x >= cameraX + screenWidth || y < cameraY || y >= cameraY + screenHeight) {
            return; //画面外は描画しない
        } else {
            vcon.fillStyle = rand(0, 2) != 0 ? "#66f" : "#aef";
            vcon.fillRect(x, y, this.size, this.size);
        }
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y > fieldHeight << 8) {
            this.y = 0;
            this.x = rand(0, fieldWidth) << 8;
        }
    }
}

//キャラクターのベースクラス
class CharaBase {
    constructor(snum, x, y, vx, vy) {
        this.spriteNum = snum;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.kill = false; //自身を消すフラグ
        this.count = 0;
    }
    update() {
        this.count++;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x + (100 << 8) < 0 || this.x - (100 << 8) > fieldWidth << 8 || this.y + (100 << 8) < 0 || this.y - (100 << 8) > fieldHeight << 8) {
            this.kill = true; //画面外は表示しない
        }
    }
    draw() {
        drawSprite(this.spriteNum, this.x, this.y)
    }
}

//爆発クラス
class Expl extends CharaBase {
    constructor(c, x, y, vx, vy) {
        super(0, x, y, vx, vy);
        this.timer = c;
    }
    update() {
        if (this.timer) {
            this.timer--;
            return;
        }
        super.update();
    }
    draw() {
        if (this.timer) return;
        this.spriteNum = 16 + (this.count >> 2);
        if (this.spriteNum === 27) {
            this.kill = true;
            return;
        }
        super.draw();
    }
}

//派手な爆発を描画
function explosion(x, y, vx, vy) {
    expl.push(new Expl(0, x, y, vx, vy));
    for (let i = 0; i < 10; i++) {
        let evx = vx + (rand(-10, 10) << 6);
        let evy = vy + (rand(-10, 10) << 6);
        expl.push(new Expl(i, x, y, evx, evy));
    }
}

//スプライトを描画
function drawSprite(spriteNum, x, y) {
    let spriteX = sprite[spriteNum].x;
    let spriteY = sprite[spriteNum].y;
    let spriteW = sprite[spriteNum].w;
    let spriteH = sprite[spriteNum].h;
    let px = (x >> 8) - spriteW / 2;
    let py = (y >> 8) - spriteH / 2;
    if (px + spriteW < cameraX || px >= cameraX + screenWidth || py + spriteH < cameraY || py >= cameraY + screenHeight) {
        return; //画面外は描画しない
    } else {
        vcon.drawImage(spriteImage, spriteX, spriteY, spriteW, spriteH, px, py, spriteW, spriteH)
    }
}

//整数のランダム関数を作成
function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//当たり判定を関数化
function checkHit(x1, y1, r1, x2, y2, r2) {
    let a = (x1 - x2) >> 8
    let b = (y1 - y2) >> 8
    let r = r1 + r2;
    return r * r >= a * a + b * b;
}

//キーボードを押されたとき
document.onkeydown = function (e) {
    key[e.keyCode] = true;
    if (gameOver && e.keyCode === 82) {
        delete jiki;
        jiki = new Jiki();
        gameOver = false;
        score = 0;
    }
}
document.onkeyup = function (e) {
    key[e.keyCode] = false;
}
