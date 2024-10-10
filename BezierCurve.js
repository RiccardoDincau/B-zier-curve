class BezierCurve {
    constructor(startPos, endPos, startColor, endColor) {
        this.startPos = new PivotPoint(startPos.x, startPos.y, 0);
        this.endPos = new PivotPoint(endPos.x, endPos.y, 1);
        this.startColor = startColor;
        this.endColor = endColor;

        this.pivots = [];
        this.pivots.push(this.startPos);
        this.pivots.push(this.endPos);

        this.selectedPivotIndex = -1;
        this.pivotSelectRadius = 15;
        this.pointSelectRadius = 7;

        this.pivotsStrokeWeight = 15;
        this.curveStrokeWeight = 8;

        this.steps = 100;
    }

    computeCurve() {
        let linePoints = [];

        for (let i = 0; i < this.steps; i++) {
            let lerpPoints = [];

            for (let p of this.pivots) lerpPoints.push(p.getPos());

            let newPoints = [];

            while (lerpPoints.length != 1) {
                if (newPoints.length != 0) lerpPoints = newPoints.reverse();
                newPoints = [];

                for (let j = lerpPoints.length-1; j > 0; j--) {
                    let px = lerp(lerpPoints[j-1].x, lerpPoints[j].x, i / this.steps);
                    let py = lerp(lerpPoints[j-1].y, lerpPoints[j].y, i / this.steps);
                    newPoints.push(createVector(px,py));
                }
            }

            linePoints.push({
                x: lerpPoints[0].x, 
                y: lerpPoints[0].y,
            })
        }

        return linePoints;
    }

    drawCurve() {
        let linePoints = this.computeCurve();

        strokeWeight(this.pointSelectRadius);

        let prevPoint = this.startPos.pos;
        for (let i = 0; i < linePoints.length; i++) {
            let p = linePoints[i];
            stroke(this.lerpColor(i / linePoints.length));
            line(prevPoint.x, prevPoint.y, p.x, p.y);
            prevPoint = p;
        }

        let p = this.endPos.pos;
        stroke(this.lerpColor(1));
        line(prevPoint.x, prevPoint.y, p.x, p.y);

        strokeWeight(2);
        stroke("white");
        prevPoint = this.startPos.pos;
        for (let p of this.pivots) {
            line(prevPoint.x, prevPoint.y, p.pos.x, p.pos.y);
            prevPoint = p.pos;
        }

        strokeWeight(1);
        stroke("white");

        for (let p of this.pivots) {
            fill(this.lerpColor(p.t));
            circle(p.pos.x, p.pos.y, this.pivotSelectRadius);
        }
    }

    updatePivots(mPos) {
        if (this.selectedPivotIndex >= 0) {
            this.pivots[this.selectedPivotIndex].pos = mPos;
        }
    }

    checkSelected(mPos) {
        for (let i = 0; i < this.pivots.length; i++) {
            let p = this.pivots[i];
            if (p.pos.dist(mPos) < this.pivotSelectRadius) {
                this.selectedPivotIndex = i;
                return;
            }
        }

        let curvePoints = this.computeCurve();

        for (let i = 0; i < curvePoints.length; i++) {
            let p = curvePoints[i];
            if (dist(p.x, p.y, mPos.x, mPos.y) < this.pointSelectRadius && this.selectedPivotIndex < 0) {
                let newPivotIndex = this.addPivot(mPos.x, mPos.y, i / this.steps);
                this.selectedPivotIndex = newPivotIndex;
            }
        }
    }

    checkDeletion(mPos) {
        for (let i = 0; i < this.pivots.length; i++) {
            let p = this.pivots[i];
            if (i != 0 && i != this.pivots.length - 1 && p.pos.dist(mPos) < this.pivotSelectRadius) {
                this.pivots.splice(i, 1);
                return;
            }
        }
    }

    unselect() {
        this.selectedPivotIndex = -1;
    }

    addPivot(x, y, t) {
        let newP = new PivotPoint(x, y, t);
        let i = 0;
        while (i < this.pivots.length && this.pivots[i].t < newP.t) { i++; }
        this.pivots.splice(i, 0, newP);
        return i;
    }

    lerpColor(t) {
        let c = p5.Vector.lerp(startColor, endColor, t);
        return color(c.x, c.y, c.z);
    }
}

class PivotPoint {
	constructor(x, y, t) {
		this.pos = createVector(x, y);
		this.color = this.lerpColor();
		this.t = t;
	}

	getPos() { return this.pos }

	draw() {
		strokeWeight(15);
		stroke(color(this.color));
		point(this.pos.x, this.pos,y);
	}

	translate(x, y) {
		this.pos.x = x; 
		this.pos.y = y;
	}

	lerpColor() {
		return p5.Vector.lerp(startColor, endColor, this.t);
	}
}