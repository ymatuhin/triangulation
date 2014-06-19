window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var app = {
    swctx: '',
    dots: {
        arr: [],
        outine: [],
        inner: [],
        genOutline: function () {
            var range = 20;
            var dotInLine = 5;

            function genLine () {
                var dots = [];
                var betweenDots = 0;

                dots.push({x: app.additional.getRandomInt(-range, 0), y: app.additional.getRandomInt(-range, 0)});

                dots.push({ x: app.additional.getRandomInt(range, app.canvas.w/3),
                            y: app.additional.getRandomInt(-range, 0)});
                dots.push({ x: app.additional.getRandomInt(app.canvas.w/3, app.canvas.w/3*2),
                            y: app.additional.getRandomInt(-range, 0)});
                dots.push({ x: app.additional.getRandomInt(app.canvas.w/3*2, app.canvas.w - range),
                            y: app.additional.getRandomInt(-range, 0)});



                dots.push({x: app.additional.getRandomInt(app.canvas.w, app.canvas.w + range), y: app.additional.getRandomInt(-range, 0)});

                dots.push({x: app.additional.getRandomInt(app.canvas.w, app.canvas.w + range), y: app.additional.getRandomInt(app.canvas.h/2 - range, app.canvas.h/2 + range)});


                dots.push({x: app.additional.getRandomInt(app.canvas.w, app.canvas.w + range), y: app.additional.getRandomInt(app.canvas.h, app.canvas.h + range)});
                dots.push({x: app.additional.getRandomInt(app.canvas.w/3*2, app.canvas.w - range), y: app.additional.getRandomInt(app.canvas.h, app.canvas.h + range)});
                dots.push({x: app.additional.getRandomInt(app.canvas.w/3, app.canvas.w/3*2), y: app.additional.getRandomInt(app.canvas.h, app.canvas.h + range)});
                dots.push({x: app.additional.getRandomInt(range, app.canvas.w/3), y: app.additional.getRandomInt(app.canvas.h, app.canvas.h + range)});


                dots.push({x: app.additional.getRandomInt(app.additional.getRandomInt(-range, 0)), y: app.additional.getRandomInt(app.canvas.h, app.canvas.h + range)});
                dots.push({x: app.additional.getRandomInt(app.additional.getRandomInt(-range, 0)), y: app.additional.getRandomInt(app.canvas.h/2, app.canvas.h/2 + range)});


                app.dots.outine = dots;
            }

            genLine();

            app.swctx = new poly2tri.SweepContext(app.dots.outine);
        },
        genInnerDots: function () {
            for (var i = 0; i < 100; i++) {
                point = {x: app.additional.getRandomInt(0, app.canvas.w - 40), y: app.additional.getRandomInt(0, app.canvas.h - 40)};

                if (this.checkPoint(point)) {
                    this.inner.push(point);
                    var pt = new poly2tri.Point(point.x, point.y);
                    app.swctx.addPoint(pt);
                } else {
                    --i;
                }
            }
        },
        checkPoint: function (point) {
            var rez = true;
            for (var i = 0; i < this.inner.length; i++) {
                if (this.inner[i].x == point.x || this.inner[i].y == point.y) {
                    rez = false;
                }
            };
            return rez;
        }
    },
    additional: {
        clone: function (obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        },
        getRandomInt: function (min, max) {
            var rand = min + Math.random() * (max + 1 - min);
            return rand ^ 0;
        },
        getRH: function () {
            return this.getRandomInt(0, app.canvas.h);
        },
        getRW: function () {
            return this.getRandomInt(0, app.canvas.w);
        },
        randomHexColor: function () {
            // число 16777215 (дес. система) равно 0xffffff (шестн. система),
            // поэтому можно записать и как return '#'+Math.floor(Math.random()*0xffffff).toString(16);
            return '#' + Math.floor(Math.random() * 16777215).toString(16);
        },
        changeColor: function (colors) {
            if (this.red.dir == '+') {
                if (colors.red.val + colors.red.change > colors.red.max) {
                    colors.red.dir = '-';
                    colors.green.dir = '-';
                    colors.red.val -= colors.red.change;
                } else {
                    colors.red.val += colors.red.change;
                }
            } else {
                if (colors.red.val < colors.red.min) {
                    colors.red.dir = '+';
                    colors.green.dir = '+';
                    colors.red.val += colors.red.change;
                } else {
                    colors.red.val -= colors.red.change;
                }
            }

            if (colors.green.dir == '+') {
                if (colors.green.val + colors.green.change > colors.green.max) {
                    colors.green.dir = '-';
                    colors.red.dir = '-';
                    colors.green.val -= colors.green.change;
                } else {
                    colors.green.val += colors.green.change;
                }
            } else {
                if (colors.green.val < colors.green.min) {
                    colors.green.dir = '+';
                    colors.red.dir = '+';
                    colors.green.val += colors.green.change;
                } else {
                    colors.green.val -= colors.green.change;
                }
            }
        },
        generateRgbColor: function (type) {
            if (type == 'start') {
                this.red = {
                    val: 150,
                    dir: '+',
                    max: 255,
                    min: 150,
                    change: 1
                };
                this.green = app.additional.clone(this.red);
                this.green.max = 150;
                this.green.min = 30;
                this.green.val = 30;
                this.green.change = .5;

                this.blue = app.additional.clone(this.red);
                this.blue.val = 0;
                return this.getRgbColor()
            } else {
                this.changeColor(this);
            }
        },
        getRgbColor: function () {
            return this.genericRgb = 'rgb(' + this.red.val + ',' + this.green.val + ',' + this.blue.val + ')';
        },
        getColorObj: function () {
            return {red: this.red, green: this.green, blue: this.blue}
        }
    },
    canvas: {
        el: document.getElementById('canv'),
        ctx: undefined,
        w: undefined,
        h: undefined,
        clearCanvas: function () {
            this.ctx.save();
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.clearRect(0, 0, this.w, this.h);
            this.ctx.restore();
        },
        setCanvasProp: function () {
            this.ctx = this.el.getContext('2d');
            this.w = this.el.width;
            this.h = this.el.height;
        },
        drawTriangle: function (obj1, obj2, obj3, color) {
            var ctx = this.ctx;
            ctx.beginPath();
            ctx.moveTo(obj1.x, obj1.y);
            ctx.quadraticCurveTo(obj1.x, obj1.y, obj2.x, obj2.y);
            ctx.quadraticCurveTo(obj2.x, obj2.y, obj3.x, obj3.y);
            ctx.closePath();
            ctx.lineWidth = 0;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.fill();
            ctx.stroke();
        },
        drawStartCanvas: function () {
            app.swctx.triangulate();
            this.triangles = app.swctx.getTriangles();
            app.additional.generateRgbColor('start');

            this.triangles.sort(function(a, b){
                return Math.min(a.points_[0].x, a.points_[1].x, a.points_[2].x) - Math.min(b.points_[0].x, b.points_[1].x, b.points_[2].x)
            });


            for (var i = 0, lg = this.triangles.length; i < lg; i++) {
                this.triangles[i].color = app.additional.getColorObj();
                app.additional.generateRgbColor();
                this.drawTriangle(this.triangles[i].points_[0], this.triangles[i].points_[1], this.triangles[i].points_[2], app.additional.getRgbColor())
            }
        },
        colorAnim: function () {
            app.canvas.clearCanvas();
            for (var i = 0, lg = app.canvas.triangles.length; i < lg; i++) {
                app.additional.changeColor(app.canvas.triangles[i].color);
                app.canvas.drawTriangle(app.canvas.triangles[i].points_[0], app.canvas.triangles[i].points_[1], app.canvas.triangles[i].points_[2], app.additional.getRgbColor())
            }
            setTimeout(function () {
                requestAnimationFrame(app.canvas.colorAnim);
            }, 60)
        }
    },
    init: function () {
        this.canvas.setCanvasProp();
        this.dots.genOutline();
        this.dots.genInnerDots();
        this.canvas.drawStartCanvas();

        requestAnimFrame(app.canvas.colorAnim);

        console.log('triangles', this.canvas.triangles);

    }
};

app.init();