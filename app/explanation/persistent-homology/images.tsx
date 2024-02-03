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

interface SimplicalComplexProps {
    vertices: [number, number][],
    edges: [number, number][],
    triangles: [number, number, number][],
}

function SimplicalComplex({ vertices, edges, triangles }: SimplicalComplexProps) {
    return (
        <>
            {triangles.map(([v1, v2, v3], i) => (
                <polygon key={i}
                    points={`${vertices[v1][0]},${vertices[v1][1]} ${vertices[v2][0]},${vertices[v2][1]} ${vertices[v3][0]},${vertices[v3][1]}`}
                    fill="rgb(200,200,200)"/>
            ))}
            {edges.map(([v1, v2], i) => (
                <line key={i}
                    x1={vertices[v1][0]} y1={vertices[v1][1]}
                    x2={vertices[v2][0]} y2={vertices[v2][1]}
                    stroke="black"/>
            ))}
            {vertices.map((vertex, i) => (
                <circle cx={vertex[0]} cy={vertex[1]} r="5" fill="black" key={i} />
            ))}
        </>
    );
}

export function ExampleFiltration() {
    const vertices: [number, number][] = [
        [45, 150],
        [150, 45],
        [255, 150],
        [150, 255],
    ];

    const edges: [number, number][] = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [3, 1],
    ];

    const triangles: [number, number, number][] = [
        [0, 1, 3],
        [1, 2, 3],
    ];

    const vertexLabels = [
        <text key={1} x="20" y="155">v1</text>,
        <text key={2} x="142" y="35">v2</text>,
        <text key={3} x="263" y="155">v3</text>,
        <text key={4} x="142" y="275">v4</text>,
    ];

    const edgeLabels = [
        <text key={1} x="81" y="95">e1</text>,
        <text key={2} x="202" y="95">e2</text>,
        <text key={3} x="202" y="215">e3</text>,
        <text key={4} x="81" y="215">e4</text>,
        <text key={5} x="152" y="155">e5</text>,
    ];

    const faceLabels = [
        <text key={1} x="100" y="155">f1</text>,
        <text key={2} x="190" y="155">f2</text>,
    ];

    const complexes = [
        {
            numberOfEdges: 3,
            numberOfFaces: 0
        },
        {
            numberOfEdges: 4,
            numberOfFaces: 0
        },
        {
            numberOfEdges: 5,
            numberOfFaces: 0
        },
        {
            numberOfEdges: 5,
            numberOfFaces: 1
        },
        {
            numberOfEdges: 5,
            numberOfFaces: 2
        },
    ];

    return (
        <div className="flex flex-wrap justify-around gap-5">
            {complexes.map(({numberOfEdges, numberOfFaces}, i) => (
                <div key={i} className="flex flex-col items-center my-5">
                    <svg viewBox="0 0 300 300" width="300px" height="300px">
                        <SimplicalComplex vertices={vertices} edges={edges.slice(0, numberOfEdges)} triangles={triangles.slice(0, numberOfFaces)}/>
                        {vertexLabels}
                        {edgeLabels.slice(0, numberOfEdges)}
                        {faceLabels.slice(0, numberOfFaces)}
                    </svg>
                    <span className="font-bold text-xl">F<sub>{i+1}</sub></span>
                </div>
            ))}
        </div>
    );
}

function Arrow({ from, to }: { from: [number, number], to: [number, number] }) {
    let arrowLength = Math.sqrt((to[0] - from[0]) * (to[0] - from[0]) + (to[1] - from[1]) * (to[1] - from[1]));
    let arrowDirection = [(to[0] - from[0])/arrowLength, (to[1] - from[1])/arrowLength];
    let perpendicularDirection = [arrowDirection[1], -arrowDirection[0]];

    return (
        <>
            <line x1={to[0] - 5 * arrowDirection[0] + 5 * perpendicularDirection[0]}
                  y1={to[1] - 5 * arrowDirection[1] + 5 * perpendicularDirection[1]}
                  x2={to[0]} y2={to[1]} stroke="black"/>
            <line x1={to[0] - 5 * arrowDirection[0] - 5 * perpendicularDirection[0]}
                  y1={to[1] - 5 * arrowDirection[1] - 5 * perpendicularDirection[1]}
                  x2={to[0]} y2={to[1]} stroke="black"/>
            <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke="black"/>
        </>
    );
}

export function ExampleFiltrationPersistentFunctionTree() {
    return (
        <svg viewBox="0 0 300 320" width="300px" height="320px">
            <text x="0" y="20" className="text-xl">F1</text>
            <text x="40" y="20" className="text-xl">[0]</text>

            <Arrow from={[51, 30]} to={[51, 70]}/>

            <text x="0" y="90" className="text-xl">F2</text>
            <text x="40" y="90" className="text-xl">[0]</text>
            <text x="170" y="90" className="text-xl">[1234]</text>

            <Arrow from={[51, 100]} to={[51, 140]}/>
            <Arrow from={[197, 100]} to={[197, 140]}/>

            <text x="0" y="160" className="text-xl">F3</text>
            <text x="40" y="160" className="text-xl">[0]</text>
            <text x="170" y="160" className="text-xl">[1234]</text>
            <text x="90" y="160" className="text-xl">[145]</text>
            <text x="240" y="160" className="text-xl">[235]</text>

            <Arrow from={[51, 170]} to={[51, 210]}/>
            <Arrow from={[197, 170]} to={[253, 210]}/>
            <Arrow from={[112, 170]} to={[60, 210]}/>
            <Arrow from={[262, 170]} to={[262, 210]}/>

            <text x="0" y="230" className="text-xl">F4</text>
            <text x="40" y="230" className="text-xl">[0]</text>
            <text x="240" y="230" className="text-xl">[235]</text>

            <Arrow from={[51, 240]} to={[51, 280]}/>
            <Arrow from={[262, 240]} to={[60, 280]}/>

            <text x="0" y="300" className="text-xl">F5</text>
            <text x="40" y="300" className="text-xl">[0]</text>
        </svg>
    )
}

export function ExampleFiltrationPersistentHomology() {
    return (
        <svg viewBox="0 0 300 320" width="300px" height="320px">
            <text x="0" y="20" className="text-xl">F1</text>
            <text x="40" y="20" className="text-xl">[0]</text>

            <Arrow from={[51, 30]} to={[51, 70]}/>

            <text x="0" y="90" className="text-xl">F2</text>
            <text x="40" y="90" className="text-xl">[0]</text>
            <text x="170" y="90" className="text-xl">[1234]</text>
            <rect x="33" y="71" width="37" height="28" fill="transparent" stroke="black" strokeWidth={2}/>
            <rect x="163" y="71" width="70" height="28" fill="transparent" stroke="black" strokeWidth={2}/>

            <Arrow from={[51, 100]} to={[51, 140]}/>
            <Arrow from={[197, 100]} to={[197, 140]}/>

            <text x="0" y="160" className="text-xl">F3</text>
            <text x="40" y="160" className="text-xl">[0]</text>
            <text x="170" y="160" className="text-xl">[1234]</text>
            <text x="90" y="160" className="text-xl">[145]</text>
            <text x="240" y="160" className="text-xl">[235]</text>
            <rect x="33" y="141" width="37" height="28" fill="transparent" stroke="black" strokeWidth={2}/>
            <rect x="163" y="141" width="70" height="28" fill="transparent" stroke="black" strokeWidth={2}/>

            <Arrow from={[51, 170]} to={[51, 210]}/>
            <Arrow from={[197, 170]} to={[253, 210]}/>
            <Arrow from={[112, 170]} to={[60, 210]}/>
            <Arrow from={[262, 170]} to={[262, 210]}/>

            <text x="0" y="230" className="text-xl">F4</text>
            <text x="40" y="230" className="text-xl">[0]</text>
            <text x="240" y="230" className="text-xl">[235]</text>
            <rect x="33" y="211" width="37" height="28" fill="transparent" stroke="black" strokeWidth={2}/>
            <rect x="230" y="211" width="64" height="28" fill="transparent" stroke="black" strokeWidth={2}/>

            <Arrow from={[51, 240]} to={[51, 280]}/>
            <Arrow from={[262, 240]} to={[60, 280]}/>

            <text x="0" y="300" className="text-xl">F5</text>
            <text x="40" y="300" className="text-xl">[0]</text>
            <rect x="33" y="281" width="37" height="28" fill="transparent" stroke="black" strokeWidth={2}/>
        </svg>
    )
}

export function ExampleFilter() {
    const vertices: [number, number][] = [
        [45, 150],
        [150, 45],
        [255, 150],
        [150, 255],
    ];

    const edges: [number, number][] = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [3, 1],
    ];

    const triangles: [number, number, number][] = [
        [0, 1, 3],
        [1, 2, 3],
    ];

    const complexes = [
        {
            numberOfVertices: 0,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We start with no simplices.</>,
        },
        {
            numberOfVertices: 1,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We add v<sub>1</sub>. This results in a new connected component.</>,
        },
        {
            numberOfVertices: 2,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We add v<sub>2</sub>. This results in another connected component.</>,
        },
        {
            numberOfVertices: 3,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We add v<sub>3</sub>. This results in another connected component.</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We add v<sub>4</sub>. This results in another connected component.</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 1,
            numberOfFaces: 0,
            text: <>We add e<sub>1</sub>. This results in two connected components combining into 1.</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 2,
            numberOfFaces: 0,
            text: <>We add e<sub>2</sub>. This results in two connected components combining into 1.</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 3,
            numberOfFaces: 0,
            text: <>We add e<sub>3</sub>. This results in two connected components combining into 1.</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 4,
            numberOfFaces: 0,
            text: <>We add e<sub>4</sub>. This results in a new cycle of edges forming a hole.</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 5,
            numberOfFaces: 0,
            text: <>We add e<sub>5</sub>. This results in a new cycle of edges forming a hole.</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 5,
            numberOfFaces: 1,
            text: <>We add f<sub>1</sub>. This results in a cycle of edges becoming a boundary, thus killing a hole.</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 5,
            numberOfFaces: 2,
            text: <>We add f<sub>2</sub>. This results in a cycle of edges becoming a boundary, thus killing a hole.</>,
        },
    ];

    return (
        <div className="gap-5">
            {complexes.map(({numberOfVertices, numberOfEdges, numberOfFaces, text}, i) => (
                <div key={i} className="flex items-center my-5 gap-5">
                    <div>
                        <svg viewBox="0 0 300 300" width="150px" height="150px" className="border">
                            <SimplicalComplex vertices={vertices.slice(0, numberOfVertices)}
                                                edges={edges.slice(0, numberOfEdges)}
                                                triangles={triangles.slice(0, numberOfFaces)}/>
                        </svg>
                    </div>
                    <span>{text}</span>
                </div>
            ))}
        </div>
    );
}

export function ExamplePersistentAlgorithm() {
    const vertices: [number, number][] = [
        [45, 150],
        [150, 45],
        [255, 150],
        [150, 255],
    ];

    const edges: [number, number][] = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [3, 1],
    ];

    const triangles: [number, number, number][] = [
        [0, 1, 3],
        [1, 2, 3],
    ];

    const vertexLabels = [
        <text key={1} x="20" y="155">v1</text>,
        <text key={2} x="142" y="35">v2</text>,
        <text key={3} x="263" y="155">v3</text>,
        <text key={4} x="142" y="275">v4</text>,
    ];

    const edgeLabels = [
        <text key={1} x="81" y="95">e1</text>,
        <text key={2} x="202" y="95">e2</text>,
        <text key={3} x="202" y="215">e3</text>,
        <text key={4} x="81" y="215">e4</text>,
        <text key={5} x="152" y="155">e5</text>,
    ];

    const faceLabels = [
        <text key={1} x="100" y="155">f1</text>,
        <text key={2} x="190" y="155">f2</text>,
    ];

    const complexes = [
        {
            numberOfVertices: 0,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We start with no simplices. The lists are 0basis = [ ], 1basis = [ ].</>,
        },
        {
            numberOfVertices: 1,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We add v<sub>1</sub>. This is a positive simplex as vertices are cycles themselves. Thus we set 0basis = [ v<sub>1</sub> ].</>,
        },
        {
            numberOfVertices: 2,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We add v<sub>2</sub>. 0basis = [ v<sub>1</sub>, v<sub>2</sub> ].</>,
        },
        {
            numberOfVertices: 3,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We add v<sub>3</sub>. 0basis = [ v<sub>1</sub>, v<sub>2</sub>, v<sub>3</sub> ].</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 0,
            numberOfFaces: 0,
            text: <>We add v<sub>4</sub>. 0basis = [ v<sub>1</sub>, v<sub>2</sub>, v<sub>3</sub>, v<sub>4</sub> ].</>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 1,
            numberOfFaces: 0,
            text: <>
                <div>
                    We add e<sub>1</sub>. This is a negative simplex as adding it forms a new 0-boundary.
                    The boundary of e<sub>1</sub> = v<sub>1</sub> + v<sub>2</sub>.
                </div>
                <div>
                    Since (v<sub>1</sub>) + (v<sub>2</sub>) becomes a boundary,
                    and v<sub>1</sub> and v<sub>2</sub> are in the list,
                    we take their corresponding simplices v<sub>1</sub>, v<sub>2</sub> and
                    choose the one appearing last in the sequence, v<sub>2</sub>.
                </div>
                <div>
                    Thus we assign v<sub>2</sub> to e<sub>1</sub>, and set 0basis = [ v<sub>1</sub>, v<sub>3</sub>, v<sub>4</sub> ].
                </div>
            </>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 2,
            numberOfFaces: 0,
            text: <>
                <div>
                    We add e<sub>2</sub>. This is a negative simplex as adding it forms a new 0-boundary.
                    The boundary of e<sub>2</sub> = v<sub>2</sub> + v<sub>3</sub>.
                </div>
                <div>
                    Since (v<sub>1</sub>) + (v<sub>3</sub>) becomes a boundary,
                    and v<sub>1</sub> and v<sub>3</sub> are in the list,
                    we take their corresponding simplices v<sub>1</sub>, v<sub>3</sub> and
                    choose the one appearing last in the sequence, v<sub>3</sub>.
                </div>
                <div>
                    Thus we assign v<sub>3</sub> to e<sub>2</sub>, and set 0basis = [ v<sub>1</sub>, v<sub>4</sub> ].
                </div>
            </>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 3,
            numberOfFaces: 0,
            text: <>
            <div>
                We add e<sub>3</sub>. This is a negative simplex as adding it forms a new 0-boundary.
                The boundary of e<sub>3</sub> = v<sub>3</sub> + v<sub>4</sub>.
            </div>
            <div>
                    Since (v<sub>1</sub>) + (v<sub>4</sub>) becomes a boundary,
                    and v<sub>1</sub> and v<sub>4</sub> are in the list,
                    we take their corresponding simplices v<sub>1</sub>, v<sub>4</sub> and
                    choose the one appearing last in the sequence, v<sub>4</sub>.
                </div>
            <div>
                Thus we assign v<sub>4</sub> to e<sub>3</sub>, and set 0basis = [ v<sub>1</sub> ].
            </div>
        </>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 4,
            numberOfFaces: 0,
            text: <>
                We add e<sub>4</sub>. This is a positive simplex. We set 1basis = [e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub> + e<sub>4</sub>].
            </>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 5,
            numberOfFaces: 0,
            text: <>
                We add e<sub>5</sub>. This is a positive simplex. We set 1basis = [e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub> + e<sub>4</sub>, e<sub>2</sub> + e<sub>3</sub> + e<sub>5</sub>].
            </>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 5,
            numberOfFaces: 1,
            text: <>
                <div>
                    We add f<sub>1</sub>. This is a negative simplex as adding it forms a new 1-boundary.
                    The boundary of f<sub>1</sub> = e<sub>1</sub> + e<sub>4</sub> + e<sub>5</sub>.
                </div>
                <div>
                    Since (e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub> + e<sub>4</sub>)
                    + (e<sub>2</sub> + e<sub>3</sub> + e<sub>5</sub>) becomes a boundary,
                    and e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub> + e<sub>4</sub> and e<sub>2</sub> + e<sub>3</sub> + e<sub>5</sub> are in the list,
                    we take their corresponding simplices e<sub>4</sub> and v<sub>5</sub> and
                    choose the one appearing last in the sequence, e<sub>5</sub>.
                </div>
                <div>
                    Thus we assign e<sub>5</sub> to f<sub>1</sub>, and set 1basis = [ e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub> + e<sub>4</sub>].
                </div>
            </>,
        },
        {
            numberOfVertices: 4,
            numberOfEdges: 5,
            numberOfFaces: 2,
            text: <>
                <div>
                    We add f<sub>2</sub>. This is a negative simplex as adding it forms a new 1-boundary.
                    The boundary of f<sub>2</sub> = e<sub>2</sub> + e<sub>3</sub> + e<sub>5</sub>.
                </div>
                <div>
                    Since (e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub> + e<sub>4</sub>) becomes a boundary,
                    and e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub> + e<sub>4</sub> is in the list,
                    we take the corresponding simplex e<sub>4</sub>.
                </div>
                <div>
                    Thus we assign e<sub>4</sub> to f<sub>2</sub>, and set 1basis = [ ].
                </div>
            </>,
        },
    ];

    return (
        <div className="gap-5">
            {complexes.map(({numberOfVertices, numberOfEdges, numberOfFaces, text}, i) => (
                <div key={i} className="flex items-center my-5 gap-5">
                    <div>
                        <svg viewBox="0 0 300 300" width="300px" height="300px" className="border">
                            <SimplicalComplex vertices={vertices.slice(0, numberOfVertices)}
                                                edges={edges.slice(0, numberOfEdges)}
                                                triangles={triangles.slice(0, numberOfFaces)}/>
                            {vertexLabels.slice(0, numberOfVertices)}
                            {edgeLabels.slice(0, numberOfEdges)}
                            {faceLabels.slice(0, numberOfFaces)}
                        </svg>
                    </div>
                    <span>{text}</span>
                </div>
            ))}
        </div>
    );
}