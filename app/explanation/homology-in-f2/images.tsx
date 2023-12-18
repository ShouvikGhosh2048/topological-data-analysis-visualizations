import './table.css';

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
    [30, 25],
    [60, 85],
    [90, 25],
    [120, 85],
    [150, 25],
    [180, 85],
    [210, 25],
    [240, 85],
    [270, 25]
] as [number, number][];

function HomologyExampleTrianglesAndEdges() {
    return (
        <>
            <Triangle positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[2]]} />
            <Triangle positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} />
            <Triangle positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[7]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[1]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[2]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[2]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[5]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[7]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[8]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[7]]} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[7], HOMOLOGY_EXAMPLE_POINTS[8]]} />
        </>
    );
}

function HomologyExampleVertices() {
    return (
        <>
            {HOMOLOGY_EXAMPLE_POINTS.map((point, i) => <Vertex position={point} key={i} />)}
        </>
    );
}

function HomologyExampleLabels() {
    return (
        <>
            {HOMOLOGY_EXAMPLE_POINTS.map((point, i) => <text x={point[0] - 3} y={point[1] + (i % 2 == 0 ? (-10) : 20)} key={i}>{'abcdefghi'[i]}</text>)}
        </>
    );
}

export function HomologyExample() {
    return (
        <svg
            viewBox="0 0 300 110"
            width="300" height="110">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleVertices />
            <HomologyExampleLabels />
        </svg>
    );
}

export function HomologyExample2() {
    return (
        <svg
            viewBox="0 0 300 110"
            width="300" height="110">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#86198f" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#86198f" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#86198f" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[7]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[7]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
            <HomologyExampleLabels />
        </svg>
    );
}

export function AddingBoundaryOfAnEdge() {
    return (
        <svg
            viewBox="0 0 300 180"
            width="300" height="180">
            <Line positions={[[20, 30], [80, 30]]} />
            <text x="47" y="50">0</text>
            <text x="95" y="33">+</text>
            <Line positions={[[120, 30], [180, 30]]} />
            <Vertex position={[120, 30]} />
            <Vertex position={[180, 30]} />
            <text x="195" y="33">=</text>
            <text x="132" y="50">a + b</text>
            <Line positions={[[220, 30], [280, 30]]} />
            <Vertex position={[220, 30]} />
            <Vertex position={[280, 30]} />
            <text x="232" y="50">a + b</text>

            <Line positions={[[20, 80], [80, 80]]} />
            <Vertex position={[20, 80]} />
            <text x="47" y="100">a</text>
            <text x="95" y="83">+</text>
            <Line positions={[[120, 80], [180, 80]]} />
            <Vertex position={[120, 80]} />
            <Vertex position={[180, 80]} />
            <text x="132" y="100">a + b</text>
            <text x="195" y="83">=</text>
            <Line positions={[[220, 80], [280, 80]]} />
            <Vertex position={[280, 80]} />
            <text x="246" y="100">b</text>

            <Line positions={[[20, 130], [80, 130]]} />
            <Vertex position={[20, 130]} />
            <Vertex position={[80, 130]} />
            <text x="33" y="150">a + b</text>
            <text x="95" y="133">+</text>
            <Line positions={[[120, 130], [180, 130]]} />
            <Vertex position={[120, 130]} />
            <Vertex position={[180, 130]} />
            <text x="132" y="150">a + b</text>
            <text x="195" y="133">=</text>
            <Line positions={[[220, 130], [280, 130]]} />
            <text x="246" y="150">0</text>
        </svg>
    )
}

export function HomologyExampleVertexCycleTransformation1() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleLabels />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[0]} />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[4]} />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[7]} />
            <text x="105" y="140">a + e + h</text>
        </svg>
    );
}

export function HomologyExampleVertexCycleTransformation2() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleLabels />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[0]} />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[4]} />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[5]} />
            <text x="105" y="140">a + e + f</text>
        </svg>
    );
}

export function HomologyExampleVertexCycleTransformation3() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleLabels />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[0]} />
            <text x="140" y="140">a</text>
        </svg>
    );
}

export function HomologyExampleVertexCycleTransformation4() {
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

export function ExampleVertexCycleEquivalenceClass1() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150"
            className="my-10">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleLabels />
        </svg>
    );
}

export function ExampleVertexCycleEquivalenceClass2() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150"
            className="my-10">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleLabels />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[0]} />
        </svg>
    );
}

export function ExampleVertexCycleEquivalenceClass3() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150"
            className="my-10">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleLabels />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[4]} />
        </svg>
    );
}

export function ExampleVertexCycleEquivalenceClass4() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150"
            className="my-10">
            <HomologyExampleTrianglesAndEdges />
            <HomologyExampleLabels />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[0]} />
            <Vertex position={HOMOLOGY_EXAMPLE_POINTS[4]} />
        </svg>
    );
}

export function AddingBoundaryOfATriangle() {
    return (
        <svg
            viewBox="0 0 300 330"
            width="300" height="330">
            <Triangle positions={[[50, 0], [20, 50], [80, 50]]} withoutBoundary />
            <Line positions={[[50, 0], [20, 50]]} dash />
            <Line positions={[[50, 0], [80, 50]]} dash />
            <Line positions={[[20, 50], [80, 50]]} dash />
            <text x="46" y="67">0</text>
            <text x="100" y="25">+</text>
            <Triangle positions={[[150, 0], [120, 50], [180, 50]]} />
            <Line positions={[[150, 0], [120, 50]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[150, 0], [180, 50]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[120, 50], [180, 50]]} color="#0369a1" strokeWidth={3} />
            <text x="104" y="67">ab + bc + ca</text>
            <text x="200" y="25">=</text>
            <Triangle positions={[[250, 0], [220, 50], [280, 50]]} withoutBoundary />
            <Line positions={[[250, 0], [220, 50]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[250, 0], [280, 50]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[220, 50], [280, 50]]} color="#0369a1" strokeWidth={3} />
            <text x="204" y="67">ab + bc + ca</text>

            <Triangle positions={[[50, 83], [20, 133], [80, 133]]} withoutBoundary />
            <Line positions={[[50, 83], [20, 133]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[50, 83], [80, 133]]} dash />
            <Line positions={[[20, 133], [80, 133]]} dash />
            <text x="42" y="150">ab</text>
            <text x="100" y="108">+</text>
            <Triangle positions={[[150, 83], [120, 133], [180, 133]]} />
            <text x="104" y="150">ab + bc + ca</text>
            <text x="200" y="108">=</text>
            <Line positions={[[150, 83], [120, 133]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[150, 83], [180, 133]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[120, 133], [180, 133]]} color="#0369a1" strokeWidth={3} />
            <Triangle positions={[[250, 83], [220, 133], [280, 133]]} withoutBoundary />
            <Line positions={[[250, 83], [220, 133]]} dash />
            <Line positions={[[250, 83], [280, 133]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[220, 133], [280, 133]]} color="#0369a1" strokeWidth={3} />
            <text x="224" y="150">bc + ca</text>

            <Triangle positions={[[50, 166], [20, 216], [80, 216]]} withoutBoundary />
            <Line positions={[[50, 166], [20, 216]]} dash />
            <Line positions={[[50, 166], [80, 216]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[20, 216], [80, 216]]} color="#0369a1" strokeWidth={3} />
            <text x="25" y="233">ca + bc</text>
            <text x="100" y="191">+</text>
            <Triangle positions={[[150, 166], [120, 216], [180, 216]]} />
            <Line positions={[[150, 166], [120, 216]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[150, 166], [180, 216]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[120, 216], [180, 216]]} color="#0369a1" strokeWidth={3} />
            <text x="104" y="233">ab + bc + ca</text>
            <text x="200" y="191">=</text>
            <Triangle positions={[[250, 166], [220, 216], [280, 216]]} withoutBoundary />
            <Line positions={[[250, 166], [220, 216]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[250, 166], [280, 216]]} dash />
            <Line positions={[[220, 216], [280, 216]]} dash />
            <text x="242" y="233">ab</text>

            <Triangle positions={[[50, 249], [20, 299], [80, 299]]} withoutBoundary />
            <Line positions={[[50, 249], [20, 299]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[50, 249], [80, 299]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[20, 299], [80, 299]]} color="#0369a1" strokeWidth={3} />
            <text x="7" y="316">ab + bc + ca</text>
            <text x="100" y="274">+</text>
            <Triangle positions={[[150, 249], [120, 299], [180, 299]]} />
            <Line positions={[[150, 249], [120, 299]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[150, 249], [180, 299]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[[120, 299], [180, 299]]} color="#0369a1" strokeWidth={3} />
            <text x="104" y="316">ab + bc + ca</text>
            <text x="200" y="274">=</text>
            <Triangle positions={[[250, 249], [220, 299], [280, 299]]} withoutBoundary />
            <Line positions={[[250, 249], [220, 299]]} dash />
            <Line positions={[[250, 249], [280, 299]]} dash />
            <Line positions={[[220, 299], [280, 299]]} dash />
            <text x="246" y="316">0</text>
        </svg>
    )
}

export function HomologyExample3() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[1]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[0], HOMOLOGY_EXAMPLE_POINTS[2]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[1], HOMOLOGY_EXAMPLE_POINTS[2]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[7]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[7], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
            <HomologyExampleLabels />
        </svg>
    );
}

export function HomologyExample4() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[7]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[7], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
            <HomologyExampleLabels />
        </svg>
    );
}

export function HomologyExample5() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[6]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
            <HomologyExampleLabels />
        </svg>
    );
}

export function HomologyExample6() {
    return (
        <svg
            viewBox="0 0 300 150"
            width="300" height="150">
            <HomologyExampleTrianglesAndEdges />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[5], HOMOLOGY_EXAMPLE_POINTS[3]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
            <HomologyExampleLabels />
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
            <HomologyExampleLabels />
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
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
            <HomologyExampleLabels />
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
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[7]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[8]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[7], HOMOLOGY_EXAMPLE_POINTS[8]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
            <HomologyExampleLabels />
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
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[4]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[3], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[4], HOMOLOGY_EXAMPLE_POINTS[5]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[7]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[6], HOMOLOGY_EXAMPLE_POINTS[8]]} color="#0369a1" strokeWidth={3} />
            <Line positions={[HOMOLOGY_EXAMPLE_POINTS[7], HOMOLOGY_EXAMPLE_POINTS[8]]} color="#0369a1" strokeWidth={3} />
            <HomologyExampleVertices />
            <HomologyExampleLabels />
        </svg>
    );
}

export function HomologyCalculation() {
    return (
        <svg
            viewBox="0 0 300 250"
            width="300" height="250">
            <Vertex position={[80, 100]} />
            <text x="72" y="90">v1</text>
            <Vertex position={[150, 30]} />
            <text x="142" y="20">v2</text>
            <Vertex position={[220, 100]} />
            <text x="212" y="90">v4</text>
            <Vertex position={[150, 170]} />
            <text x="142" y="190">v3</text>
            <Line positions={[[80, 100], [150, 30]]} />
            <Line positions={[[80, 100], [150, 170]]} />
            <Triangle positions={[[150, 30], [150, 170], [220, 100]]} />
            <text x="102" y="57">e1</text>
            <text x="102" y="155">e2</text>
            <text x="127" y="105">e3</text>
            <text x="180" y="57">e4</text>
            <text x="180" y="155">e5</text>
            <text x="170" y="105">f1</text>
        </svg>
    );
}

function HomologyCalculationEdgeBoundaryMatrix() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>e<sub>1</sub></th>
                    <th>e<sub>2</sub></th>
                    <th>e<sub>3</sub></th>
                    <th>e<sub>4</sub></th>
                    <th>e<sub>5</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>v<sub>1</sub></td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>2</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>3</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>v<sub>4</sub></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
    );
}

export function HomologyCalculationTriangleBoundaryMatrix() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>f<sub>1</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>e<sub>1</sub></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>e<sub>2</sub></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>e<sub>3</sub></td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>e<sub>4</sub></td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>e<sub>5</sub></td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
    );
}

export function HomologyCalculationMatrix1() {
    return (
        <div className="flex gap-9">
            <HomologyCalculationEdgeBoundaryMatrix />
            <HomologyCalculationTriangleBoundaryMatrix />
        </div>
    )
}

export function HomologyCalculationMatrix2() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>e<sub>1</sub></th>
                    <th>e<sub>2</sub></th>
                    <th>e<sub>3</sub></th>
                    <th>e<sub>4</sub></th>
                    <th>e<sub>5</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>v<sub>1</sub></td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>2</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>3</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>v<sub>4</sub></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
    );
}

export function HomologyCalculationMatrix3() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>e<sub>1</sub></th>
                    <th>e<sub>2</sub></th>
                    <th>e<sub>2</sub> + e<sub>3</sub></th>
                    <th>e<sub>4</sub></th>
                    <th>e<sub>5</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>v<sub>1</sub></td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>2</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>3</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>v<sub>4</sub></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
    );
}

export function HomologyCalculationMatrix4() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>e<sub>1</sub></th>
                    <th>e<sub>2</sub></th>
                    <th>e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub></th>
                    <th>e<sub>4</sub></th>
                    <th>e<sub>5</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>v<sub>1</sub></td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>2</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>3</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>v<sub>4</sub></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
    );
}

export function HomologyCalculationMatrix5() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>e<sub>1</sub></th>
                    <th>e<sub>2</sub></th>
                    <th>e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub></th>
                    <th>e<sub>4</sub></th>
                    <th>e<sub>4</sub> + e<sub>5</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>v<sub>1</sub></td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>2</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>v<sub>3</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>v<sub>4</sub></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
            </tbody>
        </table>
    );
}

export function HomologyCalculationMatrix6() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>e<sub>1</sub></th>
                    <th>e<sub>2</sub></th>
                    <th>e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub></th>
                    <th>e<sub>4</sub></th>
                    <th>e<sub>2</sub> + e<sub>4</sub> + e<sub>5</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>v<sub>1</sub></td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>v<sub>2</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>v<sub>3</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>4</sub></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
            </tbody>
        </table>
    );
}

export function HomologyCalculationMatrix7() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>e<sub>1</sub></th>
                    <th>e<sub>2</sub></th>
                    <th>e<sub>1</sub> + e<sub>2</sub> + e<sub>3</sub></th>
                    <th>e<sub>4</sub></th>
                    <th>e<sub>1</sub> + e<sub>2</sub> + e<sub>4</sub> + e<sub>5</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>v<sub>1</sub></td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>2</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>3</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>v<sub>4</sub></td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
            </tbody>
        </table>
    );
}

export function HomologyCalculationMatrix8() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>B<sub>1</sub></th>
                    <th colSpan={2}>Z<sub>1</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>e<sub>1</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>e<sub>2</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>e<sub>3</sub></td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>e<sub>4</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>e<sub>5</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>1</td>
                </tr>
            </tbody>
        </table>
    );
}

export function HomologyCalculationMatrix9() {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>B<sub>1</sub></th>
                    <th colSpan={2}>Z<sub>1</sub></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>e<sub>1</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>e<sub>2</sub></td>
                    <td>0</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>e<sub>3</sub></td>
                    <td>1</td>
                    <td>1</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>e<sub>4</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>e<sub>5</sub></td>
                    <td>1</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
            </tbody>
        </table>
    );
}