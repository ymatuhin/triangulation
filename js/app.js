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
        checkPoint: function (point) {
            var rez = true;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].x == point.x || arr[i].y == point.y) {
                    console.log('checkPoint');
                    rez = false;
                }
            };
            return rez;
        },
        addNewDot: function () {
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
        getRgbColor: function (type) {
            if (type == 'start') {
                this.red = 50;
                this.green = 30;
                this.blue = 0;
                this.genericRgb =  'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
            } else {
//                this.red += (this.getRandomInt(0, 1)) ? 10 : -10;
//                this.green += (this.getRandomInt(0, 1)) ? 10 : -10;
//                this.blue += (this.getRandomInt(0, 1)) ? 10 : -10;

                this.red += 2;
                this.green += 1;

//                this.red += (this.red > 255) ? -15 : (this.red < 0) ? 15 : 0;
//                this.green += (this.red > 255) ? -15 : (this.red < 0) ? 15 : 0;
//                this.blue += (this.red > 255) ? -15 : (this.red < 0) ? 15 : 0;


                this.genericRgb =  'rgb(' + this.red + ',' + this.green + ',' + this.blue + ')';
            }
            return this.genericRgb
        }
    },
    canvas: {
        el: document.getElementById('canv'),
        ctx: undefined,
        w: undefined,
        h: undefined,
        setCanvasProp: function () {
            this.ctx = this.el.getContext('2d');
            this.w = this.el.width;
            this.h = this.el.height;
        },
        drawTriangle: function (obj1, obj2, obj3, color) {
            console.log(obj1);

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
        }
    },
    init: function () {
        this.canvas.setCanvasProp();
        this.dots.genOutline();


        for (var i = 0; i < 55; i++) {
             point = {x: app.additional.getRandomInt(0, app.canvas.w - 40), y: app.additional.getRandomInt(0, app.canvas.h - 40)};
             var pt = new poly2tri.Point(point.x, point.y);
             this.swctx.addPoint(pt);
        }

        console.log(this.swctx);
        this.swctx.triangulate();
        var triangles = this.swctx.getTriangles();
        console.log(triangles.length);
        this.additional.getRgbColor('start');
        console.log('triangles.length', triangles.length);

        triangles.sort(function(a, b){
            return Math.min(a.points_[0].x, a.points_[1].x, a.points_[2].x) - Math.min(b.points_[0].x, b.points_[1].x, b.points_[2].x)
        });

        for (var i = 0; i < triangles.length; i++) {
            this.canvas.drawTriangle(triangles[i].points_[0], triangles[i].points_[1], triangles[i].points_[2], this.additional.getRgbColor())
        };

    }
};

app.init();