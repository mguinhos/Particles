/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
const WIDTH = document.body.clientWidth;
const HEIGHT = document.body.clientHeight;
const DEPTH = (WIDTH + HEIGHT) / 2;
const HALF_WIDTH = WIDTH / 2;
const HALF_HEIGHT = HEIGHT / 2;
const HALF_DEPTH = DEPTH / 2;
const RADIANS = Math.PI / 180;
const DEGREES = 180 / Math.PI;
let canvas_element = document.getElementById('canvas_element');
canvas_element.width = WIDTH;
canvas_element.height = HEIGHT;
let canvas_context = canvas_element.getContext('2d');
canvas_context.translate(HALF_WIDTH, HALF_HEIGHT);
canvas_context.strokeStyle = 'white';
canvas_context.fillStyle = 'white';
let mouse_x = 0;
let mouse_y = 0;
canvas_element.addEventListener('mousemove', e => {
    mouse_x = e.x - HALF_WIDTH;
    mouse_y = e.y - HALF_HEIGHT;
});
function clear_canvas(ctx) {
    return ctx.clearRect(-HALF_WIDTH, -HALF_HEIGHT, WIDTH, HEIGHT);
}
function draw_arrow(ctx, theta, radius, x, y) {
    let cos_theta = Math.cos(theta * RADIANS);
    let sin_theta = Math.sin(theta * RADIANS);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (cos_theta * radius), y + (sin_theta * radius));
    ctx.closePath();
    ctx.stroke();
}
function random_in_range(min, max) {
    return min + Math.round(Math.random() * (max - min));
}
class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(position) {
        return new Position(this.x + position.x, this.y + position.y);
    }
    sub(position) {
        return new Position(this.x - position.x, this.y - position.y);
    }
    mul(position) {
        return new Position(this.x * position.x, this.y * position.y);
    }
    div(position) {
        return new Position(this.x / position.x, this.y / position.y);
    }
    modulo(position) {
        return new Position(this.x % position.x, this.y % position.y);
    }
    direction(position) {
        let delta = position.sub(this);
        let theta = Math.atan2(delta.y, delta.x) * DEGREES;
        return theta;
    }
    distance(position) {
        let delta = position.sub(this);
        let distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));
        return distance;
    }
    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 360);
        ctx.closePath();
        ctx.stroke();
    }
    static random(min, max) {
        return new Position(random_in_range(min, max), random_in_range(min, max));
    }
    static from_constant(value) {
        return new Position(value, value);
    }
}
class Velocity extends Position {
}
class Acceleration extends Position {
}
class Particle {
    constructor(mass, position, velocity) {
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
        this.tail = new Array();
    }
    accelerate(acceleration) {
        this.velocity = this.velocity.add(acceleration);
    }
    step() {
        this.position = this.position.add(this.velocity);
        this.tail.push(this.position);
        if (this.tail.length > 32) {
            this.tail.shift();
        }
    }
    render(ctx) {
        if (this.mass < 0) {
            ctx.strokeStyle = 'red';
        }
        else {
            ctx.strokeStyle = 'white';
        }
        ctx.beginPath();
        for (let position of this.tail) {
            ctx.moveTo(position.x, position.y);
            ctx.lineTo(position.x, position.y + 1);
        }
        ctx.closePath();
        ctx.stroke();
        return this.position.render(ctx);
    }
    static random(min, max) {
        return new Particle(random_in_range(1, 10), Position.random(min, max), Velocity.random(0, 0));
    }
}
class Simulation {
    constructor() {
        this.particles = new Array();
        this.paused = false;
        /*
        for (let i=0; i < 3; i++) {
            this.particles.push(Particle.random(-100, 100));
        }
        */
        this.particles.push(new Particle(0.000001, new Position(0, 0), new Velocity(0, 0)));
        this.particles.push(new Particle(-1, new Position(-100, 0), new Velocity(0, 10)));
        this.particles.push(new Particle(-1, new Position(100, 0), new Velocity(0, -10)));
    }
    step() {
        if (this.paused) {
            return;
        }
        if (this.particles.length > 1) {
            for (let [i, particle] of this.particles.entries()) {
                let acceleration = new Acceleration(0, 0);
                let quantity = 0;
                for (let [j, particle1] of this.particles.entries()) {
                    if (i == j) {
                        continue;
                    }
                    let mass = Math.abs(particle.mass - particle1.mass);
                    let distance = Math.ceil(1 / particle.position.distance(particle1.position));
                    if (mass == 0) {
                        continue;
                    }
                    quantity++;
                    let influence = mass * distance;
                    let theta = particle.position.direction(particle1.position);
                    let sin_theta = influence * Math.sin(theta * RADIANS);
                    let cos_theta = influence * Math.cos(theta * RADIANS);
                    acceleration = acceleration.add(new Acceleration((Math.round(cos_theta * 10) / 10), (Math.round(sin_theta * 10) / 10)));
                }
                acceleration = acceleration.div(Position.from_constant(quantity));
                particle.accelerate(acceleration);
            }
        }
        for (let particle of this.particles) {
            particle.step();
            if (particle.position.x < -HALF_WIDTH) {
                particle.position.x = HALF_WIDTH;
            }
            else if (particle.position.x > HALF_WIDTH) {
                particle.position.x = -HALF_WIDTH;
            }
            if (particle.position.y < -HALF_HEIGHT) {
                particle.position.y = HALF_HEIGHT;
            }
            else if (particle.position.y > HALF_HEIGHT) {
                particle.position.y = -HALF_HEIGHT;
            }
        }
    }
    render(ctx) {
        for (let particle of this.particles) {
            particle.render(ctx);
        }
    }
    pause() {
        this.paused = true;
    }
    resume() {
        this.paused = false;
    }
}
let simulation = new Simulation();
function animation_frame() {
    clear_canvas(canvas_context);
    simulation.render(canvas_context);
    simulation.step();
    return requestAnimationFrame(animation_frame);
}
canvas_element.oncontextmenu = e => {
    e.preventDefault();
};
canvas_element.addEventListener('mousedown', e => {
    e.preventDefault();
    let mass = e.button == 0 ? 0.01 : -0.01;
    simulation.particles.push(new Particle(mass, new Position(mouse_x, mouse_y), new Velocity(0, 0)));
});
document.body.addEventListener('keydown', e => {
    if (e.key == 'p') {
        simulation.pause();
    }
    else if (e.key == 'r') {
        simulation.resume();
    }
});
requestAnimationFrame(animation_frame);

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLE9BQU87QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCIsInNvdXJjZXMiOlsid2VicGFjazovL2dyYXBoaWNzdHVkaW8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgV0lEVEggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuY29uc3QgSEVJR0hUID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XG5jb25zdCBERVBUSCA9IChXSURUSCArIEhFSUdIVCkgLyAyO1xuY29uc3QgSEFMRl9XSURUSCA9IFdJRFRIIC8gMjtcbmNvbnN0IEhBTEZfSEVJR0hUID0gSEVJR0hUIC8gMjtcbmNvbnN0IEhBTEZfREVQVEggPSBERVBUSCAvIDI7XG5jb25zdCBSQURJQU5TID0gTWF0aC5QSSAvIDE4MDtcbmNvbnN0IERFR1JFRVMgPSAxODAgLyBNYXRoLlBJO1xubGV0IGNhbnZhc19lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhc19lbGVtZW50Jyk7XG5jYW52YXNfZWxlbWVudC53aWR0aCA9IFdJRFRIO1xuY2FudmFzX2VsZW1lbnQuaGVpZ2h0ID0gSEVJR0hUO1xubGV0IGNhbnZhc19jb250ZXh0ID0gY2FudmFzX2VsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbmNhbnZhc19jb250ZXh0LnRyYW5zbGF0ZShIQUxGX1dJRFRILCBIQUxGX0hFSUdIVCk7XG5jYW52YXNfY29udGV4dC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG5jYW52YXNfY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xubGV0IG1vdXNlX3ggPSAwO1xubGV0IG1vdXNlX3kgPSAwO1xuY2FudmFzX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgZSA9PiB7XG4gICAgbW91c2VfeCA9IGUueCAtIEhBTEZfV0lEVEg7XG4gICAgbW91c2VfeSA9IGUueSAtIEhBTEZfSEVJR0hUO1xufSk7XG5mdW5jdGlvbiBjbGVhcl9jYW52YXMoY3R4KSB7XG4gICAgcmV0dXJuIGN0eC5jbGVhclJlY3QoLUhBTEZfV0lEVEgsIC1IQUxGX0hFSUdIVCwgV0lEVEgsIEhFSUdIVCk7XG59XG5mdW5jdGlvbiBkcmF3X2Fycm93KGN0eCwgdGhldGEsIHJhZGl1cywgeCwgeSkge1xuICAgIGxldCBjb3NfdGhldGEgPSBNYXRoLmNvcyh0aGV0YSAqIFJBRElBTlMpO1xuICAgIGxldCBzaW5fdGhldGEgPSBNYXRoLnNpbih0aGV0YSAqIFJBRElBTlMpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHgsIHkpO1xuICAgIGN0eC5saW5lVG8oeCArIChjb3NfdGhldGEgKiByYWRpdXMpLCB5ICsgKHNpbl90aGV0YSAqIHJhZGl1cykpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICBjdHguc3Ryb2tlKCk7XG59XG5mdW5jdGlvbiByYW5kb21faW5fcmFuZ2UobWluLCBtYXgpIHtcbiAgICByZXR1cm4gbWluICsgTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpO1xufVxuY2xhc3MgUG9zaXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgYWRkKHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zaXRpb24odGhpcy54ICsgcG9zaXRpb24ueCwgdGhpcy55ICsgcG9zaXRpb24ueSk7XG4gICAgfVxuICAgIHN1Yihwb3NpdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uKHRoaXMueCAtIHBvc2l0aW9uLngsIHRoaXMueSAtIHBvc2l0aW9uLnkpO1xuICAgIH1cbiAgICBtdWwocG9zaXRpb24pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbih0aGlzLnggKiBwb3NpdGlvbi54LCB0aGlzLnkgKiBwb3NpdGlvbi55KTtcbiAgICB9XG4gICAgZGl2KHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zaXRpb24odGhpcy54IC8gcG9zaXRpb24ueCwgdGhpcy55IC8gcG9zaXRpb24ueSk7XG4gICAgfVxuICAgIG1vZHVsbyhwb3NpdGlvbikge1xuICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uKHRoaXMueCAlIHBvc2l0aW9uLngsIHRoaXMueSAlIHBvc2l0aW9uLnkpO1xuICAgIH1cbiAgICBkaXJlY3Rpb24ocG9zaXRpb24pIHtcbiAgICAgICAgbGV0IGRlbHRhID0gcG9zaXRpb24uc3ViKHRoaXMpO1xuICAgICAgICBsZXQgdGhldGEgPSBNYXRoLmF0YW4yKGRlbHRhLnksIGRlbHRhLngpICogREVHUkVFUztcbiAgICAgICAgcmV0dXJuIHRoZXRhO1xuICAgIH1cbiAgICBkaXN0YW5jZShwb3NpdGlvbikge1xuICAgICAgICBsZXQgZGVsdGEgPSBwb3NpdGlvbi5zdWIodGhpcyk7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhkZWx0YS54LCAyKSArIE1hdGgucG93KGRlbHRhLnksIDIpKTtcbiAgICAgICAgcmV0dXJuIGRpc3RhbmNlO1xuICAgIH1cbiAgICByZW5kZXIoY3R4KSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgMTAsIDAsIDM2MCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBzdGF0aWMgcmFuZG9tKG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zaXRpb24ocmFuZG9tX2luX3JhbmdlKG1pbiwgbWF4KSwgcmFuZG9tX2luX3JhbmdlKG1pbiwgbWF4KSk7XG4gICAgfVxuICAgIHN0YXRpYyBmcm9tX2NvbnN0YW50KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zaXRpb24odmFsdWUsIHZhbHVlKTtcbiAgICB9XG59XG5jbGFzcyBWZWxvY2l0eSBleHRlbmRzIFBvc2l0aW9uIHtcbn1cbmNsYXNzIEFjY2VsZXJhdGlvbiBleHRlbmRzIFBvc2l0aW9uIHtcbn1cbmNsYXNzIFBhcnRpY2xlIHtcbiAgICBjb25zdHJ1Y3RvcihtYXNzLCBwb3NpdGlvbiwgdmVsb2NpdHkpIHtcbiAgICAgICAgdGhpcy5tYXNzID0gbWFzcztcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdmVsb2NpdHk7XG4gICAgICAgIHRoaXMudGFpbCA9IG5ldyBBcnJheSgpO1xuICAgIH1cbiAgICBhY2NlbGVyYXRlKGFjY2VsZXJhdGlvbikge1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy52ZWxvY2l0eS5hZGQoYWNjZWxlcmF0aW9uKTtcbiAgICB9XG4gICAgc3RlcCgpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMudmVsb2NpdHkpO1xuICAgICAgICB0aGlzLnRhaWwucHVzaCh0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRoaXMudGFpbC5sZW5ndGggPiAzMikge1xuICAgICAgICAgICAgdGhpcy50YWlsLnNoaWZ0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKGN0eCkge1xuICAgICAgICBpZiAodGhpcy5tYXNzIDwgMCkge1xuICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3JlZCc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgZm9yIChsZXQgcG9zaXRpb24gb2YgdGhpcy50YWlsKSB7XG4gICAgICAgICAgICBjdHgubW92ZVRvKHBvc2l0aW9uLngsIHBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhwb3NpdGlvbi54LCBwb3NpdGlvbi55ICsgMSk7XG4gICAgICAgIH1cbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLnJlbmRlcihjdHgpO1xuICAgIH1cbiAgICBzdGF0aWMgcmFuZG9tKG1pbiwgbWF4KSB7XG4gICAgICAgIHJldHVybiBuZXcgUGFydGljbGUocmFuZG9tX2luX3JhbmdlKDEsIDEwKSwgUG9zaXRpb24ucmFuZG9tKG1pbiwgbWF4KSwgVmVsb2NpdHkucmFuZG9tKDAsIDApKTtcbiAgICB9XG59XG5jbGFzcyBTaW11bGF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgLypcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKFBhcnRpY2xlLnJhbmRvbSgtMTAwLCAxMDApKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZSgwLjAwMDAwMSwgbmV3IFBvc2l0aW9uKDAsIDApLCBuZXcgVmVsb2NpdHkoMCwgMCkpKTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMucHVzaChuZXcgUGFydGljbGUoLTEsIG5ldyBQb3NpdGlvbigtMTAwLCAwKSwgbmV3IFZlbG9jaXR5KDAsIDEwKSkpO1xuICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKG5ldyBQYXJ0aWNsZSgtMSwgbmV3IFBvc2l0aW9uKDEwMCwgMCksIG5ldyBWZWxvY2l0eSgwLCAtMTApKSk7XG4gICAgfVxuICAgIHN0ZXAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhdXNlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBbaSwgcGFydGljbGVdIG9mIHRoaXMucGFydGljbGVzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGxldCBhY2NlbGVyYXRpb24gPSBuZXcgQWNjZWxlcmF0aW9uKDAsIDApO1xuICAgICAgICAgICAgICAgIGxldCBxdWFudGl0eSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgW2osIHBhcnRpY2xlMV0gb2YgdGhpcy5wYXJ0aWNsZXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IGopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBtYXNzID0gTWF0aC5hYnMocGFydGljbGUubWFzcyAtIHBhcnRpY2xlMS5tYXNzKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5jZWlsKDEgLyBwYXJ0aWNsZS5wb3NpdGlvbi5kaXN0YW5jZShwYXJ0aWNsZTEucG9zaXRpb24pKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hc3MgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHkrKztcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZmx1ZW5jZSA9IG1hc3MgKiBkaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRoZXRhID0gcGFydGljbGUucG9zaXRpb24uZGlyZWN0aW9uKHBhcnRpY2xlMS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzaW5fdGhldGEgPSBpbmZsdWVuY2UgKiBNYXRoLnNpbih0aGV0YSAqIFJBRElBTlMpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgY29zX3RoZXRhID0gaW5mbHVlbmNlICogTWF0aC5jb3ModGhldGEgKiBSQURJQU5TKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjZWxlcmF0aW9uID0gYWNjZWxlcmF0aW9uLmFkZChuZXcgQWNjZWxlcmF0aW9uKChNYXRoLnJvdW5kKGNvc190aGV0YSAqIDEwKSAvIDEwKSwgKE1hdGgucm91bmQoc2luX3RoZXRhICogMTApIC8gMTApKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFjY2VsZXJhdGlvbiA9IGFjY2VsZXJhdGlvbi5kaXYoUG9zaXRpb24uZnJvbV9jb25zdGFudChxdWFudGl0eSkpO1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLmFjY2VsZXJhdGUoYWNjZWxlcmF0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBwYXJ0aWNsZSBvZiB0aGlzLnBhcnRpY2xlcykge1xuICAgICAgICAgICAgcGFydGljbGUuc3RlcCgpO1xuICAgICAgICAgICAgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnggPCAtSEFMRl9XSURUSCkge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggPSBIQUxGX1dJRFRIO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUucG9zaXRpb24ueCA+IEhBTEZfV0lEVEgpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ID0gLUhBTEZfV0lEVEg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFydGljbGUucG9zaXRpb24ueSA8IC1IQUxGX0hFSUdIVCkge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSBIQUxGX0hFSUdIVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLnBvc2l0aW9uLnkgPiBIQUxGX0hFSUdIVCkge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgPSAtSEFMRl9IRUlHSFQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKGN0eCkge1xuICAgICAgICBmb3IgKGxldCBwYXJ0aWNsZSBvZiB0aGlzLnBhcnRpY2xlcykge1xuICAgICAgICAgICAgcGFydGljbGUucmVuZGVyKGN0eCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcGF1c2UoKSB7XG4gICAgICAgIHRoaXMucGF1c2VkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmVzdW1lKCkge1xuICAgICAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIH1cbn1cbmxldCBzaW11bGF0aW9uID0gbmV3IFNpbXVsYXRpb24oKTtcbmZ1bmN0aW9uIGFuaW1hdGlvbl9mcmFtZSgpIHtcbiAgICBjbGVhcl9jYW52YXMoY2FudmFzX2NvbnRleHQpO1xuICAgIHNpbXVsYXRpb24ucmVuZGVyKGNhbnZhc19jb250ZXh0KTtcbiAgICBzaW11bGF0aW9uLnN0ZXAoKTtcbiAgICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbl9mcmFtZSk7XG59XG5jYW52YXNfZWxlbWVudC5vbmNvbnRleHRtZW51ID0gZSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xufTtcbmNhbnZhc19lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGUgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBsZXQgbWFzcyA9IGUuYnV0dG9uID09IDAgPyAwLjAxIDogLTAuMDE7XG4gICAgc2ltdWxhdGlvbi5wYXJ0aWNsZXMucHVzaChuZXcgUGFydGljbGUobWFzcywgbmV3IFBvc2l0aW9uKG1vdXNlX3gsIG1vdXNlX3kpLCBuZXcgVmVsb2NpdHkoMCwgMCkpKTtcbn0pO1xuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZSA9PiB7XG4gICAgaWYgKGUua2V5ID09ICdwJykge1xuICAgICAgICBzaW11bGF0aW9uLnBhdXNlKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGUua2V5ID09ICdyJykge1xuICAgICAgICBzaW11bGF0aW9uLnJlc3VtZSgpO1xuICAgIH1cbn0pO1xucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGlvbl9mcmFtZSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=