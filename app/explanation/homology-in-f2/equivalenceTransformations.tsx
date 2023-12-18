"use client";

import { useState } from "react";

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

const HOMOLOGY_EXAMPLE_LINES = [
    [0, 1],
    [1, 2],
    [0, 2],
    [3, 5],
    [5, 7],
    [4, 6],
    [6, 8],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
] as [number, number][];

const HOMOLOGY_EXAMPLE_TRIANGLES = [
    [0, 1, 2],
    [4, 5, 6],
    [5, 6, 7],
];

function HomologyExampleLabels() {
    return (
        <>
            {HOMOLOGY_EXAMPLE_POINTS.map((point, i) =>
                <text x={point[0] - 3} y={point[1] + (i % 2 == 0 ? (-10) : 20)} key={i}>{'abcdefghi'[i]}</text>)}
        </>
    );
}

export function EdgeEquivalenceTransformations() {
    const [vertices, setVertices] = useState(new Set([0, 4, 7]));

    return (
        <div className="w-full flex flex-col items-center my-10">
            <svg viewBox="0 0 300 110" width="100%" height="300">
                {HOMOLOGY_EXAMPLE_TRIANGLES.map((triangle, i) =>
                    <polygon key={i}
                        points={`${HOMOLOGY_EXAMPLE_POINTS[triangle[0]][0]},${HOMOLOGY_EXAMPLE_POINTS[triangle[0]][1]} ${HOMOLOGY_EXAMPLE_POINTS[triangle[1]][0]},${HOMOLOGY_EXAMPLE_POINTS[triangle[1]][1]} ${HOMOLOGY_EXAMPLE_POINTS[triangle[2]][0]},${HOMOLOGY_EXAMPLE_POINTS[triangle[2]][1]}`}
                        fill="gray" />)}
                {HOMOLOGY_EXAMPLE_LINES.map((line, i) =>
                    <line key={i} strokeWidth={10} stroke="transparent" className="cursor-pointer"
                        x1={HOMOLOGY_EXAMPLE_POINTS[line[0]][0]} y1={HOMOLOGY_EXAMPLE_POINTS[line[0]][1]}
                        x2={HOMOLOGY_EXAMPLE_POINTS[line[1]][0]} y2={HOMOLOGY_EXAMPLE_POINTS[line[1]][1]}
                        onClick={() => {
                            const newVertices = new Set(vertices);
                            if (newVertices.has(line[0])) {
                                newVertices.delete(line[0]);
                            } else {
                                newVertices.add(line[0]);
                            }
                            if (newVertices.has(line[1])) {
                                newVertices.delete(line[1]);
                            } else {
                                newVertices.add(line[1]);
                            }
                            setVertices(newVertices);
                        }}/>)}
                {HOMOLOGY_EXAMPLE_LINES.map((line, i) =>
                    <line key={i} strokeWidth={2} stroke="black" className="cursor-pointer pointer-events-none"
                        x1={HOMOLOGY_EXAMPLE_POINTS[line[0]][0]} y1={HOMOLOGY_EXAMPLE_POINTS[line[0]][1]}
                        x2={HOMOLOGY_EXAMPLE_POINTS[line[1]][0]} y2={HOMOLOGY_EXAMPLE_POINTS[line[1]][1]} />)}
                {[...vertices].map((vertex, i) => <circle key={vertex}
                    cx={HOMOLOGY_EXAMPLE_POINTS[vertex][0]} cy={HOMOLOGY_EXAMPLE_POINTS[vertex][1]} r="5" />)}
            </svg>
            <p>Click on a edge to apply a move.</p>
        </div>
    );
}

export function TriangleEquivalenceTransformations() {
    const [edges, setEdges] = useState<[number, number][]>([
        [0, 1],
        [1, 2],
        [0, 2],
        [3, 4],
        [3, 5],
        [4, 6],
        [5, 7],
        [6, 7],
    ]);

    return (
        <div className="w-full flex flex-col items-center my-10">
            <svg viewBox="0 0 300 110" width="100%" height="300">
                {HOMOLOGY_EXAMPLE_TRIANGLES.map((triangle, i) =>
                    <polygon key={i}
                        points={`${HOMOLOGY_EXAMPLE_POINTS[triangle[0]][0]},${HOMOLOGY_EXAMPLE_POINTS[triangle[0]][1]} ${HOMOLOGY_EXAMPLE_POINTS[triangle[1]][0]},${HOMOLOGY_EXAMPLE_POINTS[triangle[1]][1]} ${HOMOLOGY_EXAMPLE_POINTS[triangle[2]][0]},${HOMOLOGY_EXAMPLE_POINTS[triangle[2]][1]}`}
                        fill="rgb(200,200,200)"
                        className="cursor-pointer"
                        onClick={() => {
                            const newEdges = [...edges];
                            const triangleEdges = [
                                [triangle[0], triangle[1]],
                                [triangle[1], triangle[2]],
                                [triangle[0], triangle[2]],
                            ] as [number, number][];
                            triangleEdges.forEach(edge => {
                                // This works as triangles and edges have their vertices in sorted order.
                                const edgeIndex = newEdges.findIndex(e => e[0] === edge[0] && e[1] === edge[1]);
                                if (edgeIndex !== -1) {
                                    newEdges.splice(edgeIndex, 1);
                                } else {
                                    newEdges.push(edge);
                                }
                            });
                            setEdges(newEdges);
                        }}/>)}
                {HOMOLOGY_EXAMPLE_LINES.map((line, i) =>
                    <line key={i} strokeWidth={2} stroke="rgb(150, 150, 150)"
                        x1={HOMOLOGY_EXAMPLE_POINTS[line[0]][0]} y1={HOMOLOGY_EXAMPLE_POINTS[line[0]][1]}
                        x2={HOMOLOGY_EXAMPLE_POINTS[line[1]][0]} y2={HOMOLOGY_EXAMPLE_POINTS[line[1]][1]} />)}
                {edges.map((edge, i) => 
                    <line key={i} strokeWidth={2} stroke="black"
                        x1={HOMOLOGY_EXAMPLE_POINTS[edge[0]][0]} y1={HOMOLOGY_EXAMPLE_POINTS[edge[0]][1]}
                        x2={HOMOLOGY_EXAMPLE_POINTS[edge[1]][0]} y2={HOMOLOGY_EXAMPLE_POINTS[edge[1]][1]} />)}
            </svg>
            <p>Click on a face to apply a move.</p>
        </div>
    );
}