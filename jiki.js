//弾クラス
class Tama extends CharaBase {
    constructor(x, y, vx, vy) {
        super(6, x, y, vx, vy)
        this.r = 4;
    }
    update() {
        super.update()
        for (let i = 0; i < teki.length; i++) {
            if (!teki[i].kill) {
                if (checkHit(
                    this.x, this.y, this.r, teki[i].x, teki[i].y, teki[i].r
                )
                ) {
                    this.kill = true;
                    //爆発用
                    if ((teki[i].hp -= 10) <= 0) {
                        teki[i].kill = true;
                        explosion(teki[i].x, teki[i].y, teki[i].vx >> 3, teki[i].vy >> 3);
                        score += teki[i].score;
                    } else {
                        expl.push(new Expl(0, this.x, this.y, 0, 0));
                    }
                    if (teki[i].mhp >= 1000) {
                        bossHP = teki[i].hp;
                        bossMHP = teki[i].mhp;
                    }
                    break;
                }
            }
        }
    }
    draw() {
        super.draw();
    }
}

//自機クラスを定義
class Jiki {
    constructor() {
        this.x = (fieldWidth / 2) << 8;
        this.y = (fieldHeight / 2 + 100) << 8;
        this.speed = 512;
        this.anime = 0;
        this.reload = 0;
        this.reloadSecond = 0;
        this.r = 10;
        this.damage = 0;
        this.muteki = 0;
        this.count = 0;
        this.mhp = 100;
        this.hp = this.mhp;
    }
    //自機の移動
    update() {
        this.count++;
        if (this.damage) {
            this.damage--;
        }
        if (this.muteki) {
            this.muteki--;
        }
        //弾の発射
        if (key[32] && this.reload === 0) {
            tama.push(new Tama(this.x + (6 << 8), this.y - (10 << 8), 0, -2000));
            tama.push(new Tama(this.x - (6 << 8), this.y - (10 << 8), 0, -2000));
            tama.push(new Tama(this.x + (8 << 8), this.y - (5 << 8), 200, -2000));
            tama.push(new Tama(this.x - (8 << 8), this.y - (5 << 8), -200, -2000));
            this.reload = 4;
            if (++this.reloadSecond === 4) {
                this.reload = 20;
                this.reloadSecond = 0;
            }
        }
        //弾数制限
        if (!key[32]) {
            this.reload = this.reloadSecond = 0;
        }
        if (this.reload > 0) {
            this.reload--;
        }

        //自機の移動
        if (key[37]) {
            this.x -= this.speed
            if (this.anime > -8) {
                this.anime--;
            }
        }
        if (key[39]) {
            this.x += this.speed
            if (this.anime < 8) {
                this.anime++;
            }
        }
        if (this.anime > 0) {
            this.anime--;
        } else if (this.anime < 0) {
            this.anime++;
        }
        if (key[38]) {
            this.y -= this.speed
        }
        if (key[40]) {
            this.y += this.speed
        }
        //範囲チェック
        if (this.x < 0) {
            this.x = 0;
        } else if (this.x >= (fieldWidth << 8)) {
            this.x = (fieldWidth << 8) - 1;
        } else if (this.y < 0) {
            this.y = 0;
        } else if (this.y >= (fieldHeight << 8)) {
            this.y = (fieldHeight << 8) - 1;
        }
    }
    //自機の描画
    draw() {
        if (this.muteki && (this.count & 1)) return;
        drawSprite(2 + (this.anime >> 2), this.x, this.y)
        if (this.count & 1) return;
        drawSprite(9 + (this.anime >> 2), this.x, this.y + (24 << 8))
    }
}
