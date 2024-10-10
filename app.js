let vertexA;
let vertexB;
let mouseIsDown = false;

let startColor, endColor;
let backgroundColor;

let pivots = [];

let curve;

function setup(){
	frameRate(60)
	createCanvas(windowWidth, windowHeight + 10);

	startColor = createVector(67, 255, 54);
	endColor = createVector(30, 127, 255);

	backgroundColor = color(20, 33, 61);

	vertexA = createVector(windowWidth/2-200, windowHeight/2);
	vertexB = createVector(windowWidth/2+200, windowHeight/2);

	curve = new BezierCurve(vertexA, vertexB, startColor, endColor);
	curve.addPivot(windowWidth/2-150, windowHeight/2-50, 0.30);
	curve.addPivot(windowWidth/2+150, windowHeight/2-100, 0.5);
	curve.addPivot(windowWidth/2-100, windowHeight/2+100, 0.70);

	background(backgroundColor);
	curve.drawCurve();
}

function draw() {
	if(mouseIsDown) {
		background(backgroundColor);

		let mPos = createVector(mouseX, mouseY);

		curve.updatePivots(mPos);
		curve.drawCurve();

	};
}

window.addEventListener("mousedown", (e) => {
	mouseIsDown = true;
	let mPos = createVector(mouseX, mouseY);
	curve.checkSelected(mPos);
});

window.addEventListener("mouseup", (e) => {
	mouseIsDown = false;
	curve.unselect();
})

window.addEventListener("contextmenu", (e) => {
	e.preventDefault();
	let mPos = createVector(mouseX, mouseY);
	curve.checkDeletion(mPos);
})