/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
const WIDTH = document.body.clientWidth;
const HEIGHT = document.body.clientHeight;
const HALF_WIDTH = WIDTH / 2;
const HALF_HEIGHT = HEIGHT / 2;
let canvas_element = document.getElementById('canvas_element');
let canvas_context = canvas_element.getContext('2d');
canvas_element.width = WIDTH;
canvas_element.height = HEIGHT;
canvas_context.translate(HALF_WIDTH, HALF_HEIGHT);
canvas_context.strokeStyle = 'white';
canvas_context.fillStyle = 'white';
class Vector {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class Atom {
    constructor(position) {
        this.position = position;
    }
    render(ctx) {
        ctx.ellipse(this.position.x, this.position.y, 10, 10, 0, 0, 360);
        ctx.stroke();
    }
}
let atoms = [new Atom(new Vector(0, 0, 0))];
function render() {
    canvas_context.clearRect(-HALF_WIDTH, -HALF_HEIGHT, WIDTH, HEIGHT);
    for (let atom of this.atoms) {
        atom.render(canvas_context);
    }
    return requestAnimationFrame(render);
}
requestAnimationFrame(render);

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZ3JhcGhpY3N0dWRpby8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBXSURUSCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XG5jb25zdCBIRUlHSFQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcbmNvbnN0IEhBTEZfV0lEVEggPSBXSURUSCAvIDI7XG5jb25zdCBIQUxGX0hFSUdIVCA9IEhFSUdIVCAvIDI7XG5sZXQgY2FudmFzX2VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzX2VsZW1lbnQnKTtcbmxldCBjYW52YXNfY29udGV4dCA9IGNhbnZhc19lbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG5jYW52YXNfZWxlbWVudC53aWR0aCA9IFdJRFRIO1xuY2FudmFzX2VsZW1lbnQuaGVpZ2h0ID0gSEVJR0hUO1xuY2FudmFzX2NvbnRleHQudHJhbnNsYXRlKEhBTEZfV0lEVEgsIEhBTEZfSEVJR0hUKTtcbmNhbnZhc19jb250ZXh0LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbmNhbnZhc19jb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG5jbGFzcyBWZWN0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHgsIHksIHopIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy56ID0gejtcbiAgICB9XG59XG5jbGFzcyBBdG9tIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgfVxuICAgIHJlbmRlcihjdHgpIHtcbiAgICAgICAgY3R4LmVsbGlwc2UodGhpcy5wb3NpdGlvbi54LCB0aGlzLnBvc2l0aW9uLnksIDEwLCAxMCwgMCwgMCwgMzYwKTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbn1cbmxldCBhdG9tcyA9IFtuZXcgQXRvbShuZXcgVmVjdG9yKDAsIDAsIDApKV07XG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgY2FudmFzX2NvbnRleHQuY2xlYXJSZWN0KC1IQUxGX1dJRFRILCAtSEFMRl9IRUlHSFQsIFdJRFRILCBIRUlHSFQpO1xuICAgIGZvciAobGV0IGF0b20gb2YgdGhpcy5hdG9tcykge1xuICAgICAgICBhdG9tLnJlbmRlcihjYW52YXNfY29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbn1cbnJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9