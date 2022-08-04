//弾クラス
class Tama extends CharaBase {
    constructor(x, y, vx, vy) {
        super(5, x, y, vx, vy)
        /*矩形の場合
        this.w = 4;
        this.h = 6;
        */
        this.r = 4;
    }
    update() {
        super.update()
        for (let i = 0; i < teki.length; i++) {
            if (!teki[i].kill) {
                if (checkHit(
                    /*矩形の場合
                   this.x, this.y, this.w, this.h, teki[i].x, teki[i].y, teki[i].w, teki[i].h
                   */
                    this.x, this.y, this.r, teki[i].x, teki[i].y, teki[i].r
                )
                ) {
                    teki[i].kill = true;
                    this.kill = true;
                    //爆発用
                    // expl.push(new Expl(20,teki[i].x,teki[i].y,teki[i].vx>>3,teki[i].vy>>3))
                    explosion(teki[i].x,teki[i].y,teki[i].vx>>3,teki[i].vy>>3);
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
        this.y = (fieldHeight / 2) << 8;
        this.speed = 512;
        this.anime = 0;
        this.reload = 0;
        this.reloadSecond = 0;
        this.r = 10;
        this.damage = 0;
    }
    //自機の移動
    update() {
        if(this.damage){
            this.damage--;
        }
        if (key[32] && this.reload === 0) {
            tama.push(new Tama(this.x + (4 << 8), this.y - (10 << 8), 0, -2000));
            tama.push(new Tama(this.x - (4 << 8), this.y - (10 << 8), 0, -2000));
            tama.push(new Tama(this.x + (8 << 8), this.y - (10 << 8), 80, -2000));
            tama.push(new Tama(this.x - (8 << 8), this.y - (10 << 8), -80, -2000));

            this.reload = 4;
            if (++this.reloadSecond === 4) {
                this.reload = 20;
                this.reloadSecond = 0;
            }
        }
        if (!key[32]) {
            this.reload = this.reloadSecond = 0;
        }

        if (this.reload > 0) {
            this.reload--;
        }


        if (key[37]) {
            this.x -= this.speed
            if (this.anime > -8) {
                this.anime--;
            }
        } else if (key[39]) {
            this.x += this.speed
            if (this.anime < 8) {
                this.anime++;
            }
        } else {
            if (this.anime > 0) {
                this.anime--;
            } else if (this.anime < 0) {
                this.anime++;
            }
        }

        if (key[38]) {
            this.y -= this.speed
        } else if (key[40]) {
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
        drawSprite(2 + (this.anime >> 2), this.x, this.y)
    }
}
