function Vertex({
    position,
    fill = "black",
}: {
    position: [number, number],
    fill?: string,
}) {
    return <circle cx={position[0]} cy={position[1]} r="5" fill={fill} />
}

function Line({
    positions,
    color = 'black',
    dash = false,
    strokeWidth = 1
}: {
    positions: [[number, number], [number, number]],
    color?: string,
    dash?: boolean,
    strokeWidth?: number,
}) {
    return (
        <line x1={positions[0][0]} y1={positions[0][1]}
            x2={positions[1][0]} y2={positions[1][1]}
            stroke={color} strokeWidth={strokeWidth} strokeDasharray={dash ? 4 : undefined} />
    );
}

function Triangle({
    positions,
    withoutBoundary = false,
}: {
    positions: [[number, number], [number, number], [number, number]],
    withoutBoundary?: boolean,
}) {
    return (
        <polygon
            points={`${positions[0][0]},${positions[0][1]} ${positions[1][0]},${positions[1][1]} ${positions[2][0]},${positions[2][1]}`}
            fill="gray" fillOpacity="0.3"
            stroke={withoutBoundary ? undefined : "black"} strokeWidth={withoutBoundary ? undefined : 1}
        />
    );
}

export function SimplexDefinition() {
    const tetrahedronPoints = [[237, 150], [200, 200], [245, 230], [270, 195]] as [number, number][];
    return (
        <svg
            viewBox="0 0 300 300"
            width="300" height="300">
            <Vertex position={[75, 50]} />
            <text x="40" y="100">0-simplex</text>

            <Line positions={[[200, 25], [275, 75]]} />
            <text x="202" y="102">1-simplex</text>

            <Triangle positions={[[75, 150], [25, 225], [125, 225]]} />
            <text x="40" y="250">2-simplex</text>

            <Triangle positions={[tetrahedronPoints[0], tetrahedronPoints[1], tetrahedronPoints[2]]} withoutBoundary />
            <Triangle positions={[tetrahedronPoints[1], tetrahedronPoints[2], tetrahedronPoints[3]]} withoutBoundary />
            <Triangle positions={[tetrahedronPoints[2], tetrahedronPoints[3], tetrahedronPoints[0]]} withoutBoundary />
            <Triangle positions={[tetrahedronPoints[3], tetrahedronPoints[0], tetrahedronPoints[1]]} withoutBoundary />
            <Line positions={[tetrahedronPoints[0], tetrahedronPoints[1]]} />
            <Line positions={[tetrahedronPoints[1], tetrahedronPoints[2]]} />
            <Line positions={[tetrahedronPoints[2], tetrahedronPoints[3]]} />
            <Line positions={[tetrahedronPoints[3], tetrahedronPoints[0]]} />
            <Line positions={[tetrahedronPoints[0], tetrahedronPoints[2]]} />
            <Line positions={[tetrahedronPoints[1], tetrahedronPoints[3]]} dash />
            <text x="202" y="252">3-simplex</text>
        </svg>
    );
}

export function LineIntersection() {
    return (
        <svg
            viewBox="0 0 300 200"
            width="300" height="200">

            <Line positions={[[50, 50], [75, 110]]} />
            <Line positions={[[75, 110], [100, 50]]} />
            <Vertex position={[50, 50]} />
            <Vertex position={[75, 110]} />
            <Vertex position={[100, 50]} />
            <text x="45" y="170">Allowed</text>

            <Line positions={[[150, 20], [150, 190]]} dash />

            <Line positions={[[200, 50], [250, 110]]} />
            <Vertex position={[200, 50]} />
            <Vertex position={[250, 110]} />
            <Line positions={[[250, 50], [200, 110]]} />
            <Vertex position={[250, 50]} />
            <Vertex position={[200, 110]} />
            <circle cx="225" cy="80" r="5" fill="transparent" stroke="#dc2626" strokeWidth="2" />
            <text x="180" y="170">Not allowed</text>
        </svg>
    );
}

export function GeometricSimplicialComplex() {
    return (
        <svg
            viewBox="0 0 300 250"
            width="300" height="250">
            <Vertex position={[80, 100]} />
            <text x="75" y="90">a</text>
            <Vertex position={[150, 30]} />
            <text x="145" y="20">b</text>
            <Vertex position={[220, 100]} />
            <text x="215" y="90">c</text>
            <Vertex position={[150, 170]} />
            <text x="145" y="190">d</text>
            <Line positions={[[80, 100], [150, 30]]} />
            <Line positions={[[80, 100], [150, 170]]} />
            <Triangle positions={[[150, 30], [150, 170], [220, 100]]} />
            <text x="40" y="225">Geometric Simplicial Complex</text>
        </svg>
    );
}

const HOMOLOGY_EXAMPLE_POINTS = [
    [15, 30],
    [60, 130],
    [105, 30],
    [150, 130],
    [195, 30],
    [240, 130],
    [285, 30]
] as [number, number][];

function HomologyExampleTrianglesAndEdges() {
    return (
        <>
            <Triangle positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[2]]} />
            <Triangle positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} />
            <Triangle positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[2]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[4]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[3]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[5]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[1]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[1]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[2]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[3]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} />
        </>
    );
}

function HomologyExampleVertices() {
    return (
        <>
            {HOMOLOGY_EXAMPLE_POINTS.map((point, i) => <g key={i}><Vertex position={point} /><text x={point[0] - 5} y={point[1] + (i % 2 == 0 ? (-10) : 20)}>{'abcdefg'[i]}</text></g>)}
        </>
    );
}

export function HomologyExample() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleVertices />
        </svg>
    );
}

export function HomologyExample2() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#86198f" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[2]]} color="#86198f" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#86198f" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
        </svg>
    );
}

export function AddingBoundaryOfATriangle() {
    return (
        <svg
            viewBox="0 0 300 300"
            width="300" height="300">
            <Triangle positions={[[50, 0], [20, 50], [80, 50]]} withoutBoundary />
            <Line positions={[[50, 0], [20, 50]]} dash />
            <Line positions={[[50, 0], [80, 50]]} dash />
            <Line positions={[[20, 50], [80, 50]]} dash />
            <text x="100" y="25">+</text>
            <Triangle positions={[[150, 0], [120, 50], [180, 50]]} />
            <text x="200" y="25">=</text>
            <Triangle positions={[[250, 0], [220, 50], [280, 50]]} withoutBoundary />
            <Line positions={[[250, 0], [220, 50]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[250, 0], [280, 50]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[220, 50], [280, 50]]} color="#0369a1" strokeWidth={3} />

            <Triangle positions={[[50, 83], [20, 133], [80, 133]]} withoutBoundary />
            <Line positions={[[50, 83], [20, 133]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[50, 83], [80, 133]]} dash />
            <Line positions={[[20, 133], [80, 133]]} dash />
            <text x="100" y="108">+</text>
            <Triangle positions={[[150, 83], [120, 133], [180, 133]]} />
            <text x="200" y="108">=</text>
            <Triangle positions={[[250, 83], [220, 133], [280, 133]]} withoutBoundary />
            <Line positions={[[250, 83], [220, 133]]} dash />
            <Line positions={[[250, 83], [280, 133]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[220, 133], [280, 133]]} color="#0369a1" strokeWidth={3} />

            <Triangle positions={[[50, 166], [20, 216], [80, 216]]} withoutBoundary />
            <Line positions={[[50, 166], [20, 216]]} dash />
            <Line positions={[[50, 166], [80, 216]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[20, 216], [80, 216]]} color="#0369a1" strokeWidth={3} />
            <text x="100" y="191">+</text>
            <Triangle positions={[[150, 166], [120, 216], [180, 216]]} />
            <text x="200" y="191">=</text>
            <Triangle positions={[[250, 166], [220, 216], [280, 216]]} withoutBoundary />
            <Line positions={[[250, 166], [220, 216]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[250, 166], [280, 216]]} dash />
            <Line positions={[[220, 216], [280, 216]]} dash />

            <Triangle positions={[[50, 249], [20, 299], [80, 299]]} withoutBoundary />
            <Line positions={[[50, 249], [20, 299]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[50, 249], [80, 299]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[20, 299], [80, 299]]} color="#0369a1" strokeWidth={3} />
            <text x="100" y="274">+</text>
            <Triangle positions={[[150, 249], [120, 299], [180, 299]]} />
            <text x="200" y="274">=</text>
            <Triangle positions={[[250, 249], [220, 299], [280, 299]]} withoutBoundary />
            <Line positions={[[250, 249], [220, 299]]} dash />
            <Line positions={[[250, 249], [280, 299]]} dash />
            <Line positions={[[220, 299], [280, 299]]} dash />
        </svg>
    )
}

export function HomologyExample3() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[2]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[1]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[2]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
        </svg>
    );
}

export function HomologyExample4() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
        </svg>
    );
}

export function HomologyExample5() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
        </svg>
    );
}

export function HomologyExample6() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
        </svg>
    );
}

export function HomologyExample7() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150"
            className="my-10">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleVertices />
        </svg>
    );
}

export function HomologyExample8() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150"
            className="my-10">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[2]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
        </svg>
    );
}

export function HomologyExample9() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150"
            className="my-10">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
        </svg>
    );
}

export function HomologyExample10() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150"
            className="my-10">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[2]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[2], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
        </svg>
    );
}