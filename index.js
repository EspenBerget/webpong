class Game {
    constructor() {
        this.canvas = document.querySelector("#display");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');

        this.reset();
    }

    setupEvents() {
        window.addEventListener("keydown", event => {
            if (["w", "s"].indexOf(event.key) != -1) {
                let dir = event.key === "w" ? "up" : "down";
                this.left.setMove(dir);
            }
            if (["ArrowUp", "ArrowDown"].indexOf(event.key) != -1) {
                let dir = event.key === "ArrowUp" ? "up" : "down";
                this.right.setMove(dir);
            }
        }, true);

        window.addEventListener("keyup", event => {
            switch (event.key) {
                case "w":
                case "s":
                    this.left.stop();
                    break;
                case "ArrowUp":
                case "ArrowDown":
                    this.right.stop();
                    break;
            }
        }, true);
    }

    ballHit() {
        let { x: ballX, y: ballY } = this.ball.pos();
        if (ballX < 3) {
            const x = this.left.inside(ballY); 
            if (x) {
                this.ball.flip(x);
            } else {
                alert("Right won!");
                this.reset();
            }
        } else if (ballX > window.innerWidth) {
            const y = this.right.inside(ballY); 
            if (y) {
                this.ball.flip(y);
            } else {
                alert("Left won!");
                this.reset();
            }
        } 
    }

    reset() {
        this.clear();
        this.left = new Paddle(0);
        this.right = new Paddle(window.innerWidth-10);
        this.ball = new Ball();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render() {
        this.left.render(this.ctx);
        this.right.render(this.ctx);
        this.ball.render(this.ctx);
    }

    animate() {
        window.requestAnimationFrame(() => this.animate());
        this.clear();
        this.left.move();
        this.right.move();
        this.ball.move();
        this.ballHit();
        this.render();
    }

    begin() {
        this.setupEvents();
        this.animate();
    }
}

class Ball {
    constructor() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;
        this.speedX = random(10, 5); 
        this.speedY = random(10, 1);
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle="#ff0000";
        ctx.fill();
        ctx.closePath();
    }

    move() {
        if (this.y <= 0 || this.y >= window.innerHeight) this.speedY *= -1;
        this.x += this.speedX;
        this.y += this.speedY;
    }

    flip(x) {
        this.speedX *= x;
    }

    pos() {
        const x = this.x;
        const y = this.y;
        return { x, y };
    }
}


class Paddle {
    constructor(x) {
        this.x = x;
        this.y = window.innerHeight / 2 - 100;
        this.speed = 0;
    }

    render(ctx) {
        ctx.fillStyle="#00ff00";
        ctx.fillRect(this.x, this.y, 10, 200);
    }

    setMove(dir) { 
        if (dir === "up") {
            this.speed = this.speed === 0 ? -10 : this.speed;
        } else if (dir === "down") {
            this.speed = this.speed === 0 ? 10 : this.speed;
        }
    }
    
    move() {
        if ((this.speed < 0 && this.y > 0) 
         || (this.speed > 0 && this.y+200 < window.innerHeight)) {
            this.y += this.speed;
            this.speed *= 1.05;
        }
    }

    inside(y) {
        const hit = 
            (this.y < y && y < this.y+200);        

        if (hit) {
            // find distance from paddle center
            let c = this.y+100 - y;
            // fold
            c = c < 0 ? -c : c;
            // normalize
            c /= 100;
            // turn negative
            c *= -1;
            // slide from 0 -> -1 to -0.5 -> -1.5;
            c -= 0.5;
            return c;
        } 
        return 0;
    }

    stop() {
        this.speed = 0;
    }
}


function random(max, min) {
    let sign = Math.random() > 0.5 ? -1 : 1;
    let rand = Math.floor(Math.random() * (max-min)) + min;
    return rand * sign;
}


const game = new Game();
game.begin();


