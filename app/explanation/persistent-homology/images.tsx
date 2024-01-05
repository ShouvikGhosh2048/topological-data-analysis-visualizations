function examplePoints() {
    const radius1 = 0.3;
    const radius2 = 0.5;
    const numberOfPoints1 = 7;
    const numberOfPoints2 = 21;

    const center1 = -radius2;
    const center2 = radius1;

    const points: [number, number][] = [];
    for (let i = 0; i < numberOfPoints1; i++) {
        points.push([
            center1 + radius1 * Math.cos(2 * Math.PI * i / numberOfPoints1),
            radius1 * Math.sin(2 * Math.PI * i / numberOfPoints1),
        ]);
    }
    for (let i = 1; i < numberOfPoints2; i++) {
        // Skip i = 0 as that was added in the previous loop.
        points.push([
            center2 - radius2 * Math.cos(2 * Math.PI * i / numberOfPoints2),
            radius2 * Math.sin(2 * Math.PI * i / numberOfPoints2),
        ]);
    }
    return points;
}

export function ExamplePointsSVG() {
    return (
        <svg viewBox="-1 -0.6 2 1.2" width="300px" height="180px" className="my-5">
            {examplePoints().map((point, i) => <circle key={i} cx={point[0]} cy={point[1]} r="0.03"/>)}
        </svg>
    );
}

function distance(point1: [number, number], point2: [number, number]) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}

export function ExampleVietorisRipsSVG({ d }: { d: number }) {
    const points = examplePoints();

    const triangles = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            for (let k = j + 1; k < points.length; k++) {
                if (Math.max(
                        distance(points[i], points[j]),
                        distance(points[j], points[k]),
                        distance(points[k], points[i]),
                    ) <= d) {
                    triangles.push(
                        <polygon key={i * points.length * points.length + j * points.length + k}
                            points={`${points[i][0]},${points[i][1]} ${points[j][0]},${points[j][1]} ${points[k][0]},${points[k][1]}`}
                            fill="gray"/>
                    );
                }
            }
        }
    }

    const lines = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            if (distance(points[i], points[j]) <= d) {
                lines.push(<line key={points.length * i + j}
                                x1={points[i][0]} y1={points[i][1]}
                                x2={points[j][0]} y2={points[j][1]}
                                strokeWidth="0.01" stroke="black"/>);
            }
        }
    }

    return (
        <svg viewBox="-1 -0.6 2 1.2" width="300px" height="180px" className="my-5">
            {triangles}
            {lines}
            {points.map((point, i) => <circle key={i} cx={point[0]} cy={point[1]} r="0.03"/>)}
        </svg>
    );
}

export function ExampleDifferentVietorisRips() {
    const values = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 2.0];
    return (
        <div className="flex flex-wrap justify-around">
            {values.map(value => (
                <div key={value} className="flex flex-col items-center my-5">
                    <ExampleVietorisRipsSVG d={value}/>
                    <span className="text-xl font-bold">d = {value}</span>
                </div>
            ))}
        </div>
    );
}