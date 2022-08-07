//敵の弾クラス
class Teta extends CharaBase {
    constructor(spriteNum, x, y, vx, vy, t) {
        super(spriteNum, x, y, vx, vy)
        this.r = 4;
        if (t === undefined) {
            this.timer = 0;
        } else {
            this.timer = t;
        }
    }
    update() {
        if (this.timer) {
            this.timer--;
            return;
        }
        super.update();
        if (!gameOver && !jiki.muteki && checkHit(
            this.x, this.y, this.r, jiki.x, jiki.y, jiki.r
        )
        ) {
            this.kill = true;
            if ((jiki.hp -= 30) <= 0) {
                gameOver = true;
            } else {
                jiki.damage = 10;
                jiki.muteki = 60;

            }
        }
        this.spriteNum = 14 + ((this.count >> 3) & 1);
    }
}

//敵クラス(extendsは親クラスから同じクラスをコピーできる)
class Teki extends CharaBase {
    constructor(t, x, y, vx, vy) {
        super(0, x, y, vx, vy);
        this.tnum = tekiMaster[t].tnum;
        this.r = tekiMaster[t].r;   //敵の半径
        this.mhp = tekiMaster[t].hp;
        this.hp = this.mhp;
        this.score = tekiMaster[t].score;
        this.flag = false;
        this.dr = 90;   //弾の方向
        this.relo = 0;  //敵の弾のリロード時間を定義
    }
    update() {
        //共通アップデート
        if (this.relo) this.relo--;
        super.update()

        //個別のアップデート
        tekiFuncArray[this.tnum](this);

        //当たり判定
        if (!gameOver && !jiki.muteki && checkHit(
            this.x, this.y, this.r, jiki.x, jiki.y, jiki.r
        )
        ) {
            if (this.mhp < 100) {
                this.kill = true;
            }

            if ((jiki.hp -= 30) <= 0) {
                gameOver = true;
            } else {
                jiki.damage = 10;
                jiki.muteki = 60;
            }
        }
    }
    draw() {
        super.draw()
    }
}

function tekiShot(obj, speed) {
    if (gameOver) return;

    let px = (obj.x >> 8);
    let py = (obj.y >> 8);
    if (px - 40 < cameraX || px + 40 >= cameraX + screenWidth || py - 40 < cameraY || py + 40 >= cameraY + screenHeight) {
        return; //画面外から発射しない
    }
    let angle, dx, dy;
    angle = Math.atan2(jiki.y - obj.y, jiki.x - obj.x); //自機と敵の角度を算出（ラジアン）
    angle += rand(-10, 10) * Math.PI / 180; //ラジアン角度にして掛け算
    dx = Math.cos(angle) * speed;
    dy = Math.sin(angle) * speed;
    teta.push(new Teta(15, obj.x, obj.y, dx, dy))
}

//移動パターン
function tekiMove01(obj) {
    if (!obj.flag) {
        if (jiki.x > obj.x && obj.vx < 120) {
            obj.vx += 4;
        } else if (jiki.x < obj.x && obj.vx > -120) {
            obj.vx -= 4;
        }
    } else {
        if (jiki.x < obj.x && obj.vx < 400) {
            obj.vx += 30;
        } else if (jiki.x > obj.x && obj.vx > -400) {
            obj.vx -= 30;
        }
    }
    if (Math.abs(jiki.y - obj.y) < (100 << 8) && !obj.flag) {
        obj.flag = true;
        tekiShot(obj, 600);
    }
    if (obj.flag && obj.vy > -800) {
        obj.vy -= 30;
    }
    const ptn = [39, 40, 39, 41];
    obj.spriteNum = ptn[(obj.count >> 3) & 3]
}

function tekiMove02(obj) {
    if (!obj.flag) {
        if (jiki.x > obj.x && obj.vx < 600) {
            obj.vx += 30;
        } else if (jiki.x < obj.x && obj.vx > -600) {
            obj.vx -= 30;
        }
    } else {
        if (jiki.x < obj.x && obj.vx < 600) {
            obj.vx += 30;
        } else if (jiki.x > obj.x && obj.vx > -600) {
            obj.vx -= 30;
        }
    }
    if (Math.abs(jiki.y - obj.y) < (100 << 8) && !obj.flag) {
        obj.flag = true;
        tekiShot(obj, 1200);
    }
    const ptn = [33, 34, 33, 35];
    obj.spriteNum = ptn[(obj.count >> 3) & 3]
}


function tekiMove03(obj) {
    if (!obj.flag) {
        if (jiki.x > obj.x && obj.vx < 120) {
            obj.vx += 4;
        } else if (jiki.x < obj.x && obj.vx > -120) {
            obj.vx -= 4;
        }
    } else {
        if (jiki.x < obj.x && obj.vx < 400) {
            obj.vx += 30;
        } else if (jiki.x > obj.x && obj.vx > -400) {
            obj.vx -= 30;
        }
    }
    if (Math.abs(jiki.y - obj.y) < (100 << 8) && !obj.flag) {
        obj.flag = true;
        tekiShot(obj, 600);
    }
    if (obj.flag && obj.vy > -800) {
        obj.vy -= 30;
    }
    const ptn = [51, 52, 51, 53];
    obj.spriteNum = ptn[(obj.count >> 3) & 3]
}

function tekiMove04(obj) {
    if (!obj.flag) {
        if (jiki.x > obj.x && obj.vx < 600) {
            obj.vx += 30;
        } else if (jiki.x < obj.x && obj.vx > -600) {
            obj.vx -= 30;
        }
    } else {
        if (jiki.x < obj.x && obj.vx < 600) {
            obj.vx += 30;
        } else if (jiki.x > obj.x && obj.vx > -600) {
            obj.vx -= 30;
        }
    }
    if (Math.abs(jiki.y - obj.y) < (100 << 8) && !obj.flag) {
        obj.flag = true;
        tekiShot(obj, 1500);
    }
    const ptn = [45, 46, 45, 47];
    obj.spriteNum = ptn[(obj.count >> 3) & 3]
}
function tekiMove05(obj) {
    if (!obj.flag && (obj.y >> 8) >= 50) {
        obj.flag = 1;
    }
    if (obj.flag === 1) {
        if ((obj.vy -= 2) <= 0) {
            obj.flag = 2;
            obj.vy = 0;
        }
    } else if (obj.flag === 2) {
        if (obj.vx < 300) {
            obj.vx += 10
        }
        if ((obj.x >> 8) > (fieldWidth - 100)) {
            obj.flag = 3;
        }
    } else if (obj.flag === 3) {
        if (obj.vx > -300) {
            obj.vx -= 10
        }
        if ((obj.x >> 8) < 100) {
            obj.flag = 2;
        }
    }

    //球の発射
    let angle, dx, dy;
    if (obj.flag > 1) {
        angle = obj.dr * Math.PI / 180; //ラジアン角度にして掛け算
        dx = Math.cos(angle) * 300;
        dy = Math.sin(angle) * 300;
        let x2 = (Math.cos(angle) * 70) << 8;
        let y2 = (Math.sin(angle) * 70) << 8;
        teta.push(new Teta(15, obj.x + x2, obj.y + y2, dx, dy, 60))
        if ((obj.dr += 25) >= 360) {
            obj.dr = 0;
        }
    }
    //攻撃追加
    if (obj.hp < obj.mhp / 2) {
        let c = obj.count % (60 * 5);
        if ((c / 10) < 4 && c % 10 === 0) {
            angle = (90 + 45 - (c / 10) * 30) * Math.PI / 180; //ラジアン角度にして掛け算
            dx = Math.cos(angle) * 300;
            dy = Math.sin(angle) * 300;
            let x2 = (Math.cos(angle) * 70) << 8;
            let y2 = (Math.sin(angle) * 70) << 8;
            teki.push(new Teki(5, obj.x + x2, obj.y + y2, dx, dy, 60))
        }
    }
    //スプライト変更
    obj.spriteNum = 75;
}

function tekiMove06(obj) {
    if (obj.count === 10) {
        obj.vx = obj.vy = 0;
    }
    if (obj.count === 60) {
        if (obj.x > jiki.x) {
            obj.vx = -30;
        } else {
            obj.vx = 30;
        }
        obj.vy = 200;
    }
    if (obj.count > 100 && !obj.relo) {
        if (rand(0, 100) === 1) {
            tekiShot(obj, 300);
            obj.relo = 200;
        }
    }
    const ptn = [33, 34, 33, 35];
    obj.spriteNum = ptn[(obj.count >> 3) & 3]
}

let tekiFuncArray = [tekiMove01, tekiMove02, tekiMove03, tekiMove04, tekiMove05, tekiMove06]



