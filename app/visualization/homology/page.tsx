"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaTrash } from 'react-icons/fa';

interface SimplicialComplexEditorProps {
    vertices: [number, number][],
    setVertices: Dispatch<SetStateAction<[number, number][]>>,
    edges: [number, number][],
    setEdges: Dispatch<SetStateAction<[number, number][]>>,
    triangles: [number, number, number][],
    setTriangles: Dispatch<SetStateAction<[number, number, number][]>>,
    setView: Dispatch<SetStateAction<'editor' | 'homology'>>,
}

function SimplicialComplexEditor({ vertices, setVertices, edges, setEdges, triangles, setTriangles, setView }: SimplicialComplexEditorProps) {
    const [[screenWidth, screenHeight], setScreenDimensions] = useState<[number, number]>([0, 0]);
    const [drag, setDrag] = useState<null | { vertexIndex: number, dragOffsetFromCenter: [number, number] }>(null);
    const [addSimplex, setAddSimplex] = useState<null | { vertices: number[], type: 'edge' | 'triangle' }>(null);

    useEffect(() => {
        setScreenDimensions([window.innerWidth, window.innerHeight]);

        function onResize() {
            setScreenDimensions([window.innerWidth, window.innerHeight]);
        }

        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    let SVGX = screenWidth - Math.floor(screenWidth * 0.75);
    let SVGY = 40; // nav height
    let SVGWidth = Math.floor(screenWidth * 0.75);
    let SVGHeight = screenHeight - 40;

    if (screenWidth < 640) {
        SVGX = 0;
        SVGY = 40;
        SVGWidth = screenWidth;
        SVGHeight = Math.floor(0.5 * screenHeight);
    }

    useEffect(() => {
        if (drag) {
            const onMove = (e: MouseEvent) => {
                const x = e.clientX - SVGX - SVGWidth / 2;
                const y = e.clientY - SVGY - SVGHeight / 2;
                setVertices(vertices => ([
                    ...vertices.slice(0, drag.vertexIndex),
                    [x - drag.dragOffsetFromCenter[0], y - drag.dragOffsetFromCenter[1]],
                    ...vertices.slice(drag.vertexIndex + 1)
                ]));
            };
            const onMouseUp = (e: MouseEvent) => {
                const x = e.clientX - SVGX - SVGWidth / 2;
                const y = e.clientY - SVGY - SVGHeight / 2;
                setVertices(vertices => ([
                    ...vertices.slice(0, drag.vertexIndex),
                    [x - drag.dragOffsetFromCenter[0], y - drag.dragOffsetFromCenter[1]],
                    ...vertices.slice(drag.vertexIndex + 1)
                ]));
                setDrag(null);
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onMouseUp);
            return () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onMouseUp);
            }
        }
    }, [drag, SVGX, SVGY, SVGHeight, SVGWidth, screenWidth, screenHeight, setVertices]);

    // https://stackoverflow.com/a/4407335
    return (
        <div className="flex-grow flex flex-col-reverse justify-end sm:flex-row sm:justify-start h-full overflow-hidden">
            <div className="w-full sm:w-3/12 p-3 border-r-2 space-y-2 max-h-full overflow-auto">
                {!addSimplex && (<div className="flex flex-wrap gap-2">
                    {vertices.length >= 1 && <button className="bg-gray-200 p-1 rounded" onClick={() => {
                        setView('homology');
                    }}>View homology</button>}
                    {vertices.length >= 2 && <button className="bg-gray-200 p-1 rounded" onClick={() => {
                        setDrag(null);
                        setAddSimplex({
                            vertices: [],
                            type: 'edge',
                        });
                    }}>Add edge</button>}
                    {vertices.length >= 3 && <button className="bg-gray-200 p-1 rounded" onClick={() => {
                        setDrag(null);
                        setAddSimplex({
                            vertices: [],
                            type: 'triangle',
                        });
                    }}>Add triangle</button>}
                </div>)}
                {addSimplex && (
                    <div className="flex flex-wrap gap-2">
                        <span>Creating {addSimplex.type}</span>
                        <button className="bg-gray-200 p-1 rounded" onClick={() => {
                            setAddSimplex(null);
                        }}>Cancel</button>
                    </div>
                )}
                <p>Vertices</p>
                <div>
                    {vertices.map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <span>Vertex {i + 1}</span>
                            {!addSimplex && (<button onClick={() => {
                                setDrag(null);
                                setVertices([...vertices.slice(0, i), ...vertices.slice(i + 1)]);
                                setEdges(edges.filter(edge => !edge.includes(i)).map(edge => edge.map(vertex => vertex > i ? vertex - 1 : vertex) as [number, number]));
                                setTriangles(triangles.filter(triangle => !triangle.includes(i)).map(triangle => triangle.map(vertex => vertex > i ? vertex - 1 : vertex) as [number, number, number]));
                            }}><FaTrash /></button>)}
                        </div>
                    ))}
                </div>
                <p>Edges</p>
                <div>
                    {edges.map((edge, i) => (
                        <div key={i} className="flex justify-between">
                            <span>Edge {JSON.stringify(edge.map(vertex => vertex + 1))}</span>
                            {!addSimplex && (<button onClick={() => {
                                setDrag(null);
                                setEdges([...edges.slice(0, i), ...edges.slice(i + 1)]);
                                setTriangles(triangles.filter(triangle => !triangle.includes(edges[i][0]) || !triangle.includes(edges[i][1])));
                            }}><FaTrash /></button>)}
                        </div>
                    ))}
                </div>
                <p>Triangles</p>
                <div>
                    {triangles.map((triangle, i) => (
                        <div key={i} className="flex justify-between">
                            <span>Triangle {JSON.stringify(triangle.map(vertex => vertex + 1))}</span>
                            {!addSimplex && (<button onClick={() => {
                                setDrag(null);
                                setTriangles([...triangles.slice(0, i), ...triangles.slice(i + 1)]);
                            }}><FaTrash /></button>)}
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full sm:w-9/12 flex justify-center items-center">
                <svg viewBox={`${-SVGWidth / 2} ${-SVGHeight / 2} ${SVGWidth} ${SVGHeight}`} width={SVGWidth} height={SVGHeight}
                    onMouseDown={(e) => {
                        if (!drag && !addSimplex) {
                            const x = e.clientX - SVGX - SVGWidth / 2;
                            const y = e.clientY - SVGY - SVGHeight / 2;
                            setDrag({ vertexIndex: vertices.length, dragOffsetFromCenter: [0, 0] });
                            setVertices([...vertices, [x, y]]);
                        }
                    }}>
                    {vertices.length === 0 && <text fontFamily="monospace" fontSize="30" x="-82" className="select-none">Click here</text>}
                    {triangles.map((triangle, i) => <polygon key={i} points={`${vertices[triangle[0]][0]},${vertices[triangle[0]][1]}, ${vertices[triangle[1]][0]},${vertices[triangle[1]][1]}, ${vertices[triangle[2]][0]},${vertices[triangle[2]][1]}`} fill="rgb(200,200,200)" fillOpacity={addSimplex ? 0.3 : 1.0} />)}
                    {edges.map((edge, i) => <line key={i} x1={vertices[edge[0]][0]} y1={vertices[edge[0]][1]} x2={vertices[edge[1]][0]} y2={vertices[edge[1]][1]} stroke="black" strokeOpacity={addSimplex ? 0.3 : 1.0} strokeWidth={3} />)}
                    {vertices.map((vertex, i) => (
                        <g key={i}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                if (addSimplex) {
                                    let simplexVertices: number[];
                                    if (addSimplex.vertices.includes(i)) {
                                        simplexVertices = addSimplex.vertices.filter(vertex => vertex !== i);
                                    } else {
                                        simplexVertices = [...addSimplex.vertices, i];
                                    }

                                    if (addSimplex.type === 'edge' && simplexVertices.length === 2) {
                                        setAddSimplex(null);

                                        simplexVertices.sort((a, b) => a - b);
                                        setEdges([
                                            ...edges.filter(e => JSON.stringify(e) !== JSON.stringify(simplexVertices)),
                                            simplexVertices as [number, number],
                                        ]);
                                    } else if (addSimplex.type === 'triangle' && simplexVertices.length === 3) {
                                        setAddSimplex(null);

                                        const triangleEdges = [
                                            [simplexVertices[0], simplexVertices[1]].sort(),
                                            [simplexVertices[0], simplexVertices[2]].sort(),
                                            [simplexVertices[1], simplexVertices[2]].sort()
                                        ] as [number, number][];
                                        const newEdges = [...edges];
                                        triangleEdges.forEach(triangleEdge => {
                                            if (newEdges.findIndex(e => JSON.stringify(e) === JSON.stringify(triangleEdge)) === -1) {
                                                newEdges.push(triangleEdge);
                                            }
                                        });
                                        setEdges(newEdges);

                                        simplexVertices.sort((a, b) => a - b);
                                        setTriangles([
                                            ...triangles.filter(triangle => JSON.stringify(triangle) !== JSON.stringify(simplexVertices)),
                                            simplexVertices as [number, number, number],
                                        ]);
                                    } else {
                                        setAddSimplex({
                                            vertices: simplexVertices,
                                            type: addSimplex.type,
                                        });
                                    }
                                } else {
                                    const x = e.clientX - SVGX - SVGWidth / 2;
                                    const y = e.clientY - SVGY - SVGHeight / 2;
                                    const dragOffsetFromCenter: [number, number] = [x - vertex[0], y - vertex[1]];
                                    setDrag({ vertexIndex: i, dragOffsetFromCenter });
                                }
                            }}>
                            <circle cx={vertex[0]} cy={vertex[1]} r="20"
                                fill="white" stroke="black" strokeWidth="3"
                                strokeOpacity={addSimplex ? (addSimplex.vertices.includes(i) ? 1.0 : 0.3) : 1.0}
                                className="cursor-pointer" />
                            <text x={vertex[0] - 5 * Math.floor(1 + Math.log10(i + 1))} y={vertex[1] + 5}
                                fontFamily="monospace" fontSize="20" className="select-none"
                                fillOpacity={addSimplex ? (addSimplex.vertices.includes(i) ? 1.0 : 0.3) : 1.0} >{i + 1}</text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}

interface Column {
    label: Set<number>,
    entries: Set<number>,
}

// Applies the unique last transformation to columns,
// and returns the indices of the non-zero columns.
function applyUniqueLastTransformation(columns: Column[]) {
    const lastToColumnIndex = new Map<number, number>();

    for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        while (true) {
            let last: null | number = null;
            column.entries.forEach((entry) => {
                if (last === null || last < entry) {
                    last = entry;
                }
            });

            if (last === null) {
                break;
            }

            const columnIndexWithSameLast = lastToColumnIndex.get(last);
            if (columnIndexWithSameLast === undefined) {
                lastToColumnIndex.set(last, i);
                break;
            }
            const columnWithSameLast = columns[columnIndexWithSameLast];

            columnWithSameLast.label.forEach(labelIndex => {
                if (column.label.has(labelIndex)) {
                    column.label.delete(labelIndex);
                } else {
                    column.label.add(labelIndex);
                }
            });

            columnWithSameLast.entries.forEach(entryIndex => {
                if (column.entries.has(entryIndex)) {
                    column.entries.delete(entryIndex);
                } else {
                    column.entries.add(entryIndex);
                }
            });
        }
    }

    return new Set(lastToColumnIndex.values());
}

interface HomologyViewerProps {
    vertices: [number, number][],
    edges: [number, number][],
    triangles: [number, number, number][],
    setView: Dispatch<SetStateAction<'editor' | 'homology'>>,
}

function HomologyViewer({ vertices, edges, triangles, setView }: HomologyViewerProps) {
    const edgeToIndex = new Map<string, number>();
    edges.forEach((edge, index) => {
        edgeToIndex.set(JSON.stringify(edge), index);
    });

    const edgeBoundaryMatrix = edges.map((edge, index) => ({
        label: new Set([index]),
        entries: new Set(edge)
    }));
    const triangleBoundaryMatrix = triangles.map((triangle, index) => ({
        label: new Set([index]),
        entries: new Set([
            edgeToIndex.get(JSON.stringify([triangle[0], triangle[1]])) as number,
            edgeToIndex.get(JSON.stringify([triangle[0], triangle[2]])) as number,
            edgeToIndex.get(JSON.stringify([triangle[1], triangle[2]])) as number,
        ]),
    }));

    const edgeBoundaryNonZeroColumnIndices = applyUniqueLastTransformation(edgeBoundaryMatrix);
    const edgeBoundaryZeroColumnIndices = [];
    for (let i = 0; i < edgeBoundaryMatrix.length; i++) {
        if (!edgeBoundaryNonZeroColumnIndices.has(i)) {
            edgeBoundaryZeroColumnIndices.push(i);
        }
    }
    const triangleBoundaryNonZeroColumnIndices = applyUniqueLastTransformation(triangleBoundaryMatrix);

    // Columns of B0 followed by columns of Z0.
    const BZ0 = [
        ...[...edgeBoundaryNonZeroColumnIndices].map(column => ({
            label: new Set<number>(),
            entries: new Set(
                edgeBoundaryMatrix[column].entries
            ),
        })),
        ...vertices.map((_, i) => (
            {
                label: new Set<number>(),
                entries: new Set([i]),
            }
        )),
    ];
    // Columns of BZ0 after the first B0 columns.
    const H0Columns = [...applyUniqueLastTransformation(BZ0)].filter(i => i >= edgeBoundaryNonZeroColumnIndices.size);
    // Columns of B1 followed by columns of Z1.
    const BZ1 = [
        ...[...triangleBoundaryNonZeroColumnIndices].map(column => ({
            label: new Set<number>(),
            entries: new Set(triangleBoundaryMatrix[column].entries)
        })),
        ...edgeBoundaryZeroColumnIndices.map(column => ({
            label: new Set<number>(),
            entries: new Set(edgeBoundaryMatrix[column].label),
        }))
    ];
    // Columns of BZ1 after the first B1 columns.
    const nonZeroH1Columns = [...applyUniqueLastTransformation(BZ1)].filter(i => i >= triangleBoundaryNonZeroColumnIndices.size);

    let maxCoordinate = 0;
    vertices.forEach(vertex => {
        maxCoordinate = Math.max(maxCoordinate, Math.abs(vertex[0]), Math.abs(vertex[1]));
    });
    const svgViewBox = `${- maxCoordinate - 25} ${- maxCoordinate - 25} ${2 * (maxCoordinate + 25)} ${2 * (maxCoordinate + 25)}`;

    const trianglePolygons = (
        triangles.map((triangle, i) => 
            <polygon key={i}
                points={`${vertices[triangle[0]][0]},${vertices[triangle[0]][1]}, ${vertices[triangle[1]][0]},${vertices[triangle[1]][1]}, ${vertices[triangle[2]][0]},${vertices[triangle[2]][1]}`}
                fill="rgb(200,200,200)" />)
    );
    const edgesLines = (
        edges.map((edge, i) => 
            <line key={i}
                x1={vertices[edge[0]][0]} y1={vertices[edge[0]][1]} x2={vertices[edge[1]][0]} y2={vertices[edge[1]][1]}
                stroke="black" strokeWidth={3} />)
    );
    const vertexCircles = (
        vertices.map((vertex, i) => <circle key={i} cx={vertex[0]} cy={vertex[1]} r="5" />)
    );

    return (
        <div className="max-w-2xl p-5 flex-grow">
            <div>
                <button className="bg-gray-200 p-1 rounded" onClick={() => {
                    setView('editor');
                }}>Back to editor</button>
            </div>
            <p className="text-2xl">Homology</p>
            <svg
                viewBox={svgViewBox}
                width="300"
            >
                {trianglePolygons}
                {edgesLines}
                {vertices.map((vertex, i) => (
                    <g key={i}>
                        <circle cx={vertex[0]} cy={vertex[1]} r="20"
                            fill="white" stroke="black" strokeWidth="3"
                            className="cursor-pointer" />
                        <text x={vertex[0] - 5 * Math.floor(1 + Math.log10(i + 1))} y={vertex[1] + 5}
                            fontFamily="monospace" fontSize="20" className="select-none">{i + 1}</text>
                    </g>
                ))}
            </svg>
            <p className="text-xl">Z0</p>
            <div className="flex flex-wrap gap-2">
                {vertices.map((vertex, i) => (
                    <svg viewBox={svgViewBox} key={i} width="300" height="300">
                        <g fillOpacity={0.5} strokeOpacity={0.5}>
                            {trianglePolygons}
                            {edgesLines}
                            {vertexCircles}
                        </g>
                        <circle cx={vertex[0]} cy={vertex[1]} r="10"/>
                    </svg>
                ))}
            </div>
            <p className="text-xl">B0</p>
            <div className="flex flex-wrap gap-2">
                {[...edgeBoundaryNonZeroColumnIndices].map(column => (
                    <svg viewBox={svgViewBox} key={column} width="300" height="300">
                        <g fillOpacity={0.5} strokeOpacity={0.5}>
                            {trianglePolygons}
                            {edgesLines}
                            {vertexCircles}
                        </g>
                        {[...edgeBoundaryMatrix[column].entries].map(vertexIndex => (
                            <circle cx={vertices[vertexIndex][0]} cy={vertices[vertexIndex][1]} r="10" key={vertexIndex} />
                        ))}
                    </svg>
                ))}
            </div>
            <p className="text-xl">H0</p>
            <div className="flex flex-wrap gap-2">
                {[...H0Columns].map(column => (
                    <svg viewBox={svgViewBox} key={column} width="300" height="300">
                        <g fillOpacity={0.5} strokeOpacity={0.5}>
                            {trianglePolygons}
                            {edgesLines}
                            {vertexCircles}
                        </g>
                        {[...BZ0[column].entries].map(vertexIndex => (
                            <circle cx={vertices[vertexIndex][0]} cy={vertices[vertexIndex][1]} r="10" key={vertexIndex} />
                        ))}
                    </svg>
                ))}
            </div>
            <p className="text-xl">Z1</p>
            <div className="flex flex-wrap gap-2">
                {edgeBoundaryZeroColumnIndices.map(column => (
                    <svg viewBox={svgViewBox} key={column} width="300" height="300">
                        <g fillOpacity={0.5} strokeOpacity={0.5}>
                            {trianglePolygons}
                            {edgesLines}
                            {vertexCircles}
                        </g>
                        {[...edgeBoundaryMatrix[column].label].map(edgeIndex => (
                            <line x1={vertices[edges[edgeIndex][0]][0]} y1={vertices[edges[edgeIndex][0]][1]}
                                x2={vertices[edges[edgeIndex][1]][0]} y2={vertices[edges[edgeIndex][1]][1]}
                                strokeWidth={3} stroke="black"
                                key={edgeIndex} />
                        ))}
                    </svg>
                ))}
            </div>
            <p className="text-xl">B1</p>
            <div className="flex flex-wrap gap-2">
                {[...triangleBoundaryNonZeroColumnIndices].map(column => (
                    <svg viewBox={svgViewBox} key={column} width="300" height="300">
                        <g fillOpacity={0.5} strokeOpacity={0.5}>
                            {trianglePolygons}
                            {edgesLines}
                            {vertexCircles}
                        </g>
                        {[...triangleBoundaryMatrix[column].entries].map(edgeIndex => (
                            <line x1={vertices[edges[edgeIndex][0]][0]} y1={vertices[edges[edgeIndex][0]][1]}
                                x2={vertices[edges[edgeIndex][1]][0]} y2={vertices[edges[edgeIndex][1]][1]}
                                strokeWidth={3} stroke="black"
                                key={edgeIndex} />
                        ))}
                    </svg>
                ))}
            </div>
            <p className="text-xl">H1</p>
            <div className="flex flex-wrap gap-2">
                {[...nonZeroH1Columns].map(column => (
                    <svg viewBox={svgViewBox} key={column} width="300" height="300">
                        <g fillOpacity={0.5} strokeOpacity={0.5}>
                            {trianglePolygons}
                            {edgesLines}
                            {vertexCircles}
                        </g>
                        {[...BZ1[column].entries].map(edgeIndex => (
                            <line x1={vertices[edges[edgeIndex][0]][0]} y1={vertices[edges[edgeIndex][0]][1]}
                                x2={vertices[edges[edgeIndex][1]][0]} y2={vertices[edges[edgeIndex][1]][1]}
                                strokeWidth={3} stroke="black"
                                key={edgeIndex} />
                        ))}
                    </svg>
                ))}
            </div>
        </div>
    );
}

export default function Homology() {
    // Coordinates of the vertices
    const [vertices, setVertices] = useState<[number, number][]>([]);
    // Indices of the vertices making up the simplex
    const [edges, setEdges] = useState<[number, number][]>([]);
    const [triangles, setTriangles] = useState<[number, number, number][]>([]);

    const [view, setView] = useState<'editor' | 'homology'>('editor');

    if (view === 'editor') {
        return (
            <SimplicialComplexEditor vertices={vertices} setVertices={setVertices}
                edges={edges} setEdges={setEdges}
                triangles={triangles} setTriangles={setTriangles}
                setView={setView} />
        );
    } else {
        return (
            <HomologyViewer vertices={vertices} edges={edges} triangles={triangles} setView={setView} />
        );
    }

}