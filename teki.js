//敵弾クラス
class Teta extends CharaBase {
    constructor(spriteNum, x, y, vx, vy) {
        super(spriteNum, x, y, vx, vy)
        this.r = 4;
    }

    update() {
        super.update();
        if (!jiki.damage && checkHit(
            /*矩形の場合
           this.x, this.y, this.w, this.h, teki[i].x, teki[i].y, teki[i].w, teki[i].h
           */
            this.x, this.y, this.r, jiki.x, jiki.y, jiki.r
        )
        ) {
            this.kill = true;
            jiki.damage = 10;
        } 
    }
}

//敵クラス(extendsは親クラスから同じクラスをコピーできる)
class Teki extends CharaBase {
    constructor(snum, x, y, vx, vy) {
        super(snum, x, y, vx, vy);
        this.flag = false;
        /*矩形の場合
        this.w = 20;
        this.h = 20;
        */
        this.r = 10;
    }
    update() {
        super.update()
        if (!this.flag) {
            if (jiki.x > this.x && this.vx < 120) {
                this.vx += 4;
            } else if (jiki.x < this.x && this.vx > -120) {
                this.vx -= 4;
            }
        } else {
            if (jiki.x < this.x && this.vx < 400) {
                this.vx += 30;
            } else if (jiki.x > this.x && this.vx > -400) {
                this.vx -= 30;

            }
        }

        if (Math.abs(jiki.y - this.y) < (100 << 8) && !this.flag) {
            this.flag = true;
            let angle, dx, dy;
            angle = Math.atan2(jiki.y - this.y, jiki.x - this.x); //自機と敵の角度を算出（ラジアン）
            angle += rand(-10, 10) * Math.PI / 180; //ラジアン角度にして掛け算
            dx = Math.cos(angle) * 1000;
            dy = Math.sin(angle) * 1000;
            teta.push(new Teta(15, this.x, this.y, dx, dy))
        }

        if (this.flag && this.vy > -800) {
            this.vy -= 30;
        }
        if (!jiki.damage && checkHit(
            /*矩形の場合
           this.x, this.y, this.w, this.h, teki[i].x, teki[i].y, teki[i].w, teki[i].h
           */
            this.x, this.y, this.r, jiki.x, jiki.y, jiki.r
        )
        ) {
            this.kill = true;
            jiki.damage = 10;
        }
    }
    draw() {
        super.draw()
    }
}


