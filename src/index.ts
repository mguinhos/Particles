const WIDTH = document.body.clientWidth;
const HEIGHT = document.body.clientHeight;
const DEPTH = (WIDTH + HEIGHT) / 2;

const HALF_WIDTH = WIDTH / 2;
const HALF_HEIGHT = HEIGHT / 2;
const HALF_DEPTH = DEPTH / 2;

const RADIANS = Math.PI / 180;
const DEGREES = 180 / Math.PI;

let canvas_element = document.getElementById('canvas_element') as HTMLCanvasElement;

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

function clear_canvas(ctx: CanvasRenderingContext2D) {
    return ctx.clearRect(-HALF_WIDTH, -HALF_HEIGHT, WIDTH, HEIGHT);
}

function draw_arrow(ctx: CanvasRenderingContext2D, theta: number, radius: number, x: number, y: number) {
    let cos_theta = Math.cos(theta * RADIANS);
    let sin_theta = Math.sin(theta * RADIANS);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (cos_theta * radius), y + (sin_theta * radius));
    ctx.closePath();

    ctx.stroke();
}

function random_in_range(min: number, max: number) {
    return min + Math.round(Math.random() * (max - min));
}

class Position {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(position: Position): Position {
        return new Position(
            this.x + position.x,
            this.y + position.y,
        );
    }

    sub(position: Position): Position {
        return new Position(
            this.x - position.x,
            this.y - position.y,
        );
    }

    mul(position: Position): Position {
        return new Position(
            this.x * position.x,
            this.y * position.y,
        );
    }

    div(position: Position): Position {
        return new Position(
            this.x / position.x,
            this.y / position.y,
        );
    }

    modulo(position: Position): Position {
        return new Position(
            this.x % position.x,
            this.y % position.y,
        );
    }

    direction(position: Position): number {
        let delta = position.sub(this);
        let theta = Math.atan2(delta.y, delta.x) * DEGREES;

        return theta;
    }

    distance(position: Position): number {
        let delta = position.sub(this);
        let distance = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2));

        return distance;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 360);
        ctx.closePath();

        ctx.stroke();
    }

    static random(min: number, max: number): Position {
        return new Position(
            random_in_range(min, max),
            random_in_range(min, max),
        );
    }

    static from_constant(value: number): Position {
        return new Position(
            value,
            value,
        );
    }
}

class Velocity extends Position { }
class Acceleration extends Position { }

class Particle {
    mass: number
    position: Position
    velocity: Velocity
    tail: Array<Position>

    constructor(mass: number, position: Position, velocity: Velocity) {
        this.mass = mass;
        this.position = position;
        this.velocity = velocity;
        this.tail = new Array();
    }

    accelerate(acceleration: Acceleration) {
        this.velocity = this.velocity.add(acceleration);
    }

    step() {
        this.position = this.position.add(this.velocity);
        this.tail.push(this.position);

        if (this.tail.length > 32) {
            this.tail.shift();
        }
    }

    render(ctx: CanvasRenderingContext2D) {
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

    static random(min: number, max: number): Particle {
        return new Particle(
            random_in_range(1, 10),
            Position.random(min, max),
            Velocity.random(0, 0),
        );
    }
}

class Simulation {
    particles: Array<Particle>
    paused: boolean

    constructor() {
        this.particles = new Array();
        this.paused = false;

        /*
        for (let i=0; i < 3; i++) {
            this.particles.push(Particle.random(-100, 100));
        }
        */

        this.particles.push(new Particle(
            0.000001,
            new Position(0, 0),
            new Velocity(0, 0),
        ));

        this.particles.push(new Particle(
            -1,
            new Position(-100, 0),
            new Velocity(0, 10),
        ));

        this.particles.push(new Particle(
            -1,
            new Position(100, 0),
            new Velocity(0, -10),
        ));
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

                    acceleration = acceleration.add(
                        new Acceleration(
                            (Math.round(cos_theta * 10) / 10),
                            (Math.round(sin_theta * 10) / 10),
                        )
                    );
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

    render(ctx: CanvasRenderingContext2D) {
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
    
    let mass = e.button == 0? 0.01 : -0.01;

    simulation.particles.push(new Particle(
        mass,
        new Position(mouse_x, mouse_y),
        new Velocity(0, 0),
    ));
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