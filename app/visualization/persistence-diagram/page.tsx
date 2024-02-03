"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Chart, Scatter, getElementAtEvent } from "react-chartjs-2";
import { Chart as ChartJS, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

function distance(a: [number, number], b: [number, number]) {
    return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
}

interface EditorProps {
    vertices: [number, number][],
    setVertices: Dispatch<SetStateAction<[number, number][]>>,
    shapes: [[number, number], [number, number]][],
    setShapes: Dispatch<SetStateAction<[[number, number], [number, number]][]>>,
    setView: Dispatch<SetStateAction<'editor' | 'viewer'>>,
}

type Drag = null | {
    type: 'vertex',
    vertexIndex: number,
    offsetFromCenter: [number, number],
} | {
    type: 'shape',
    shapeIndex: number,
    offsetFromFirstVertex: [number, number],
} | {
    type: 'shapeAnchor',
    shapeIndex: number,
    anchorIndex: 0 | 1,
    offsetFromAnchorCenter: [number, number],
} | {
    type: 'empty',
    start: [number, number],
    newIndex: number,
};

function Editor({
    vertices, setVertices, shapes, setShapes, setView,
}: EditorProps) {
    const [screenDimensions, setScreenDimensions] = useState([0, 0]);
    const [newShape, setNewShape] = useState<null | [[number, number], [number, number]]>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<'shape' | 'vertex'>('vertex');
    const [drag, setDrag] = useState<Drag>(null);
    const [selected, setSelected]
        = useState<{
            type: 'vertex' | 'shape',
            index: number,
        } | null>(null);

    // Resize
    useEffect(() => {
        const onResize = () => {
            const canvas = canvasRef.current!;
            const dpr = window.devicePixelRatio;
            canvas.width = (window.innerWidth - 288) * dpr;
            canvas.height = (window.innerHeight - 40) * dpr;
            canvas.style.width = `${window.innerWidth - 288}px`;
            canvas.style.height = `${window.innerHeight - 40}px`;
            const ctx = canvas.getContext('2d')!;
            ctx.scale(dpr, dpr);
            setScreenDimensions([window.innerWidth - 288, window.innerHeight - 40]);
        };

        onResize();
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // Draw
    useEffect(() => {
        const canvasLeft = 288;
        const canvasTop = 40;
        const canvasWidth = window.innerWidth - canvasLeft;
        const canvasHeight = window.innerHeight - canvasTop;
        const canvasCenterX = canvasLeft + canvasWidth / 2;
        const canvasCenterY = canvasTop + canvasHeight / 2;

        if (mode === 'vertex') {
            const ctx = canvasRef.current!.getContext('2d')!;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            vertices.forEach(([x, y]) => {
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(canvasWidth/2 + x, canvasHeight/2 + y, 10, 0, Math.PI * 2);
                ctx.fill();
            });
            if (selected && selected.type === 'vertex') {
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(
                    canvasWidth/2 + vertices[selected.index][0],
                    canvasHeight/2 + vertices[selected.index][1],
                    10, 0, Math.PI * 2
                );
                ctx.fill();
            }

            if (!drag) {
                const onMouseDown = (e: MouseEvent) => {
                    e.preventDefault();
                    const clickedPoint: [number, number] = [
                        e.clientX - canvasCenterX,
                        e.clientY - canvasCenterY
                    ];
    
                    let resultDrag: Drag = null;
                    if (e.button === 2) {
                        resultDrag = {
                            type: 'empty',
                            start: clickedPoint,
                            newIndex: vertices.length,
                        }
                    }
                    if (e.button === 0) {
                        vertices.forEach((vertex, i) => {
                            if (distance(vertex, clickedPoint) <= 10) {
                                resultDrag = {
                                    type: 'vertex',
                                    vertexIndex: i,
                                    offsetFromCenter: [
                                        clickedPoint[0] - vertex[0],
                                        clickedPoint[1] - vertex[1]
                                    ],
                                };
                            }
                        });
                        if (selected && selected.type === 'vertex' && distance(vertices[selected.index], clickedPoint) <= 10) {
                            resultDrag = {
                                type: 'vertex',
                                vertexIndex: selected.index,
                                offsetFromCenter: [
                                    clickedPoint[0] - vertices[selected.index][0],
                                    clickedPoint[1] - vertices[selected.index][1],
                                ],
                            };
                        }
                    }

                    if (resultDrag && resultDrag.type === "vertex") {
                        setSelected({
                            type: 'vertex',
                            index: resultDrag.vertexIndex,
                        });
                    } else {
                        setSelected(null);
                    }

                    setDrag(resultDrag);
                }

                const canvas = canvasRef.current!;
                canvas.addEventListener('mousedown', onMouseDown);
                return () => {
                    canvas.removeEventListener('mousedown', onMouseDown);
                };
            }
        } else {
            const ctx = canvasRef.current!.getContext('2d')!;
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            shapes.forEach((rect) => {
                ctx.fillStyle = 'gray';
                ctx.fillRect(
                    canvasWidth/2 + Math.min(rect[0][0], rect[1][0]),
                    canvasHeight/2 + Math.min(rect[0][1], rect[1][1]),
                    Math.abs(rect[1][0] - rect[0][0]), Math.abs(rect[1][1] - rect[0][1]),
                );
            });
            if (selected && selected.type === 'shape') {
                const rect = shapes[selected.index];
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(
                    canvasWidth/2 + Math.min(rect[0][0], rect[1][0]),
                    canvasHeight/2 + Math.min(rect[0][1], rect[1][1]),
                    Math.abs(rect[1][0] - rect[0][0]), Math.abs(rect[1][1] - rect[0][1]),
                );
                ctx.fillStyle = 'black';
                ctx.beginPath();
                ctx.arc(canvasWidth/2 + rect[0][0], canvasHeight/2 + rect[0][1], 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(canvasWidth/2 + rect[1][0], canvasHeight/2 + rect[1][1], 10, 0, Math.PI * 2);
                ctx.fill();
            }

            if (newShape) {
                ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
                ctx.fillRect(
                    canvasWidth/2 + Math.min(newShape[0][0], newShape[1][0]),
                    canvasHeight/2 + Math.min(newShape[0][1], newShape[1][1]),
                    Math.abs(newShape[1][0] - newShape[0][0]), Math.abs(newShape[1][1] - newShape[0][1]),
                );
            }

            if (!drag) {
                const onMouseDown = (e: MouseEvent) => {
                    const clickedPoint: [number, number] = [
                        e.clientX - canvasCenterX,
                        e.clientY - canvasCenterY
                    ];
    
                    let resultDrag: Drag = null;
                    if (e.button === 2) {
                        resultDrag = {
                            type: 'empty',
                            start: clickedPoint,
                            newIndex: shapes.length,
                        };
                    }
                    if (e.button === 0) {
                        shapes.forEach((rect, i) => {
                            if (
                                Math.min(rect[0][0], rect[1][0]) <= clickedPoint[0]
                                && clickedPoint[0] <= Math.max(rect[0][0], rect[1][0])
                                && Math.min(rect[0][1], rect[1][1]) <= clickedPoint[1]
                                && clickedPoint[1] <= Math.max(rect[0][1], rect[1][1])
                            ) {
                                resultDrag = {
                                    type: 'shape',
                                    shapeIndex: i,
                                    offsetFromFirstVertex: [
                                        clickedPoint[0] - rect[0][0],
                                        clickedPoint[1] - rect[0][1]
                                    ],
                                };
                            }
                        });
                        if (selected && selected.type === 'shape') {
                            const rect = shapes[selected.index];
                            
                            if (
                                Math.min(rect[0][0], rect[1][0]) <= clickedPoint[0]
                                && clickedPoint[0] <= Math.max(rect[0][0], rect[1][0])
                                && Math.min(rect[0][1], rect[1][1]) <= clickedPoint[1]
                                && clickedPoint[1] <= Math.max(rect[0][1], rect[1][1])
                            ) {
                                resultDrag = {
                                    type: 'shape',
                                    shapeIndex: selected.index,
                                    offsetFromFirstVertex: [
                                        clickedPoint[0] - rect[0][0],
                                        clickedPoint[1] - rect[0][1]
                                    ],
                                };
                            }
    
                            for (let i = 0; i < 2; i++) {
                                if (distance(rect[i], clickedPoint) <= 10) {
                                    resultDrag = {
                                        type: 'shapeAnchor',
                                        shapeIndex: selected.index,
                                        anchorIndex: i as 0 | 1,
                                        offsetFromAnchorCenter: [
                                            clickedPoint[0] - rect[i][0],
                                            clickedPoint[1] - rect[i][1],
                                        ]
                                    };
                                }
                            }
                        }
                    }

                    if (resultDrag === null || resultDrag.type === 'empty') {
                        setSelected(null);
                    }
                    else {
                        setSelected({
                            type: 'shape',
                            index: resultDrag.shapeIndex,
                        });
                    }
                    setDrag(resultDrag);
                }

                const canvas = canvasRef.current!;
                canvas.addEventListener('mousedown', onMouseDown);
                return () => {
                    canvas.removeEventListener('mousedown', onMouseDown);
                };
            }
        }
    });

    // Drag
    useEffect(() => {
        const canvasLeft = 288;
        const canvasTop = 40;
        const canvasWidth = window.innerWidth - canvasLeft;
        const canvasHeight = window.innerHeight - canvasTop;
        const canvasCenterX = canvasLeft + canvasWidth / 2;
        const canvasCenterY = canvasTop + canvasHeight / 2;

        if (drag) {
            if (drag.type === 'vertex') {
                const mouseMove = (e: MouseEvent) => {
                    const mousePosition = [
                        e.clientX - canvasCenterX,
                        e.clientY - canvasCenterY
                    ];

                    setVertices(vertices => [
                        ...vertices.slice(0, drag.vertexIndex),
                        [
                            mousePosition[0] - drag.offsetFromCenter[0],
                            mousePosition[1] - drag.offsetFromCenter[1],
                        ],
                        ...vertices.slice(drag.vertexIndex + 1),
                    ])
                };

                const mouseUp = (e: MouseEvent) => {
                    mouseMove(e);
                    setDrag(null);
                }

                window.addEventListener('mousemove', mouseMove);
                window.addEventListener('mouseup', mouseUp);
                return () => {
                    window.removeEventListener('mousemove', mouseMove);
                    window.removeEventListener('mouseup', mouseUp);
                };
            } else if (drag.type === 'shape') {
                const mouseMove = (e: MouseEvent) => {
                    console.log('Move shape');
                    const mousePosition = [
                        e.clientX - canvasCenterX,
                        e.clientY - canvasCenterY
                    ];

                    setShapes(shapes => {
                        const rect = shapes[drag.shapeIndex];

                        const vertex1: [number, number] = [
                            mousePosition[0] - drag.offsetFromFirstVertex[0],
                            mousePosition[1] - drag.offsetFromFirstVertex[1]
                        ];
                        const vertex2: [number, number] = [
                            rect[1][0] + (vertex1[0] - rect[0][0]),
                            rect[1][1] + (vertex1[1] - rect[0][1]),
                        ];

                        return [
                            ...shapes.slice(0, drag.shapeIndex),
                            [ vertex1, vertex2 ],
                            ...shapes.slice(drag.shapeIndex + 1),
                        ];
                    });
                };

                const mouseUp = (e: MouseEvent) => {
                    mouseMove(e);
                    setDrag(null);
                }

                window.addEventListener('mousemove', mouseMove);
                window.addEventListener('mouseup', mouseUp);
                return () => {
                    window.removeEventListener('mousemove', mouseMove);
                    window.removeEventListener('mouseup', mouseUp);
                };
            } else if (drag.type === "shapeAnchor") {
                const mouseMove = (e: MouseEvent) => {
                    const mousePosition = [
                        e.clientX - canvasCenterX,
                        e.clientY - canvasCenterY
                    ];

                    setShapes(shapes => {
                        const rect: [[number, number], [number, number]] = [...shapes[drag.shapeIndex]];
                        rect[drag.anchorIndex] = [
                            mousePosition[0] - drag.offsetFromAnchorCenter[0],
                            mousePosition[1] - drag.offsetFromAnchorCenter[1],
                        ];
                        return [
                            ...shapes.slice(0, drag.shapeIndex),
                            rect,
                            ...shapes.slice(drag.shapeIndex + 1),
                        ];
                    });
                };

                const mouseUp = (e: MouseEvent) => {
                    mouseMove(e);
                    setDrag(null);
                }

                window.addEventListener('mousemove', mouseMove);
                window.addEventListener('mouseup', mouseUp);
                return () => {
                    window.removeEventListener('mousemove', mouseMove);
                    window.removeEventListener('mouseup', mouseUp);
                };
            } else if (mode === 'vertex') {
                const mouseUp = (e: MouseEvent) => {
                    setVertices(vertices => [
                        ...vertices,
                        [
                            e.clientX - canvasCenterX,
                            e.clientY - canvasCenterY,
                        ],
                    ]);
                    setSelected({
                        type: 'vertex',
                        index: drag.newIndex,
                    });
                    setDrag(null);
                }

                window.addEventListener('mouseup', mouseUp);
                return () => {
                    window.removeEventListener('mouseup', mouseUp);
                };
            } else {
                const mouseMove = (e: MouseEvent) => {
                    const mousePosition: [number, number] = [
                        e.clientX - canvasCenterX,
                        e.clientY - canvasCenterY
                    ];
                    setNewShape([ drag.start, mousePosition ]);
                };

                const mouseUp = (e: MouseEvent) => {
                    const mousePosition: [number, number] = [
                        e.clientX - canvasCenterX,
                        e.clientY - canvasCenterY
                    ];
                    setShapes(shapes => [
                        ...shapes,
                        [drag.start, mousePosition],
                    ]);
                    setSelected({
                        type: 'shape',
                        index: drag.newIndex,
                    });
                    setDrag(null);
                    setNewShape(null);
                }

                window.addEventListener('mousemove', mouseMove);
                window.addEventListener('mouseup', mouseUp);
                return () => {
                    window.removeEventListener('mousemove', mouseMove);
                    window.removeEventListener('mouseup', mouseUp);
                };
            }
        }
    }, [drag, mode, setVertices, setShapes]);

    // Keyboard
    useEffect(() => {
        const onKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Delete') {
                if (selected) {
                    if (selected.type === 'vertex') {
                        setVertices(vertices => [
                            ...vertices.slice(0, selected.index),
                            ...vertices.slice(selected.index + 1),
                        ]);
                        setSelected(null);
                    } else {
                        setShapes(shapes => [
                            ...shapes.slice(0, selected.index),
                            ...shapes.slice(selected.index + 1),
                        ]);
                        setSelected(null);
                    }
                }
            }
        };

        window.addEventListener('keydown', onKeyPress);
        return () => {
            window.removeEventListener('keydown', onKeyPress);
        };
    }, [selected, setVertices, setShapes]);

    return (
        <div className="flex-grow flex overflow-hidden">
            <div className="w-72 border-r-2 p-2 space-y-5 overflow-auto">
                <div className="flex justify-between">
                    <button className="bg-slate-200 px-2 py-1 rounded"
                        onClick={() => {
                            setVertices([]);
                            setShapes([]);
                            setDrag(null);
                            setSelected(null);
                        }}>Reset</button>
                    { vertices.length > 0 && (
                        <button className="bg-slate-200 px-2 py-1 rounded"
                                onClick={() => {
                                    setView('viewer');
                                }}>View persistent homology</button>
                    )}
                </div>
                <div className="flex justify-between">
                    <button className={`${mode === 'shape' ? 'bg-slate-900 text-white' : 'bg-slate-200'}
                                    px-2 py-1 rounded`}
                                onClick={() => { 
                                    setDrag(null);
                                    setSelected(null);
                                    setMode('shape');
                                }}>Shape mode</button>
                    <button className={`${mode === 'vertex' ? 'bg-slate-900 text-white' : 'bg-slate-200'}
                                px-2 py-1 rounded`}
                            onClick={() => { 
                                setDrag(null);
                                setSelected(null);
                                setMode('vertex');
                            }}>Vertex mode</button>
                </div>
                {mode === 'shape' && (
                    <div>
                        {shapes.length > 0 && (
                            <button className="bg-slate-200 px-2 py-1 rounded"
                            onClick={() => {
                                setDrag(null);
                                setSelected(null);
                                setMode('vertex');

                                const minX = shapes.reduce((minX, shape) => Math.min(minX, shape[0][0], shape[1][0]), shapes[0][0][0]);
                                const minY = shapes.reduce((minY, shape) => Math.min(minY, shape[0][1], shape[1][1]), shapes[0][0][1]);
                                const maxX = shapes.reduce((maxX, shape) => Math.max(maxX, shape[0][0], shape[1][0]), shapes[0][0][0]);
                                const maxY = shapes.reduce((maxY, shape) => Math.max(maxY, shape[0][1], shape[1][1]), shapes[0][0][1]);

                                const newVertices: [number, number][] = [];
                                for (let i = 0; i < 10000; i++) {
                                    const randomX = minX + Math.random() * (maxX - minX);
                                    const randomY = minY + Math.random() * (maxY - minY);
                                    const containedInShapes = shapes.findIndex(shape => (
                                        Math.min(shape[0][0], shape[1][0]) <= randomX
                                        && randomX <= Math.max(shape[0][0], shape[1][0])
                                        && Math.min(shape[0][1], shape[1][1]) <= randomY
                                        && randomY <= Math.max(shape[0][1], shape[1][1])
                                    )) !== -1;
                                    if (containedInShapes) {
                                        newVertices.push([randomX, randomY]);
                                        if (newVertices.length === 100) {
                                            break;
                                        }
                                    }
                                }
                                setVertices(newVertices);
                            }}>
                                Sample random points
                            </button>
                        )}
                    </div>
                )}
                <p className="text-xl">Instructions</p>
                {mode === "vertex" && (
                    <>
                        <p>Place vertices with the right mouse button.</p>
                        <p>Drag vertices with the left mouse button.</p>
                        <p>Delete vertices with the delete key.</p>
                    </>
                )}
                {mode === "shape" && (
                    <>
                        <p>Create rectangles by clicking and draging using the right mouse button.</p>
                        <p>Drag rectangles and their anchors with the left mouse button.</p>
                        <p>Delete rectangles with the delete key.</p>
                    </>
                )}
            </div>
            <div className="flex-grow">
                <canvas ref={canvasRef} onContextMenu={(e) => { e.preventDefault(); }}/>
            </div>
        </div>
    );
}

interface PersistentHomologyViewerProps {
    vertices: [number, number][],
    setView: Dispatch<SetStateAction<'editor' | 'viewer'>>
}

function PersistentHomologyViewer({ vertices, setView }: PersistentHomologyViewerProps) {
    const [persistence, setPersistence] = useState<null | {
        birth: number,
        death: number,
        edges: [number, number][]
    }[]>(null);
    const [selectedPersistence, setSelectedPersistence] = useState<null | number>(null);
    const chartRef = useRef();

    useEffect(() => {
        // https://vitejs.dev/guide/features.html#import-with-constructors
        // https://stackoverflow.com/a/67318031
        // https://stackoverflow.com/questions/71519442/web-worker-not-loading-properly-when-using-typescript-on-nextjs
        const persistentHomologyWorker = new Worker(new URL('./worker.ts', import.meta.url));

        persistentHomologyWorker.onmessage = (e) => {
            setPersistence(e.data);
        };
        persistentHomologyWorker.postMessage(vertices);

        return () => {
            persistentHomologyWorker.terminate();
        };
    }, [vertices]);

    if (persistence === null) {
        return (
            <div className="p-5 space-y-3">
                <div>
                    <button className="bg-slate-200 px-2 py-1 rounded"
                        onClick={() => {
                            setView('editor');
                        }}>Back to editor</button>
                </div>
                <p>Loading...</p>
            </div>
        );
    }

    let diagonalEndpoint = 100;
    persistence.forEach(({ death }) => {
        diagonalEndpoint = Math.max(diagonalEndpoint, death + 10);
    });

    let minX = 0;
    let minY = 0;
    let maxX = 0;
    let maxY = 0;
    if (vertices.length > 0) {
        minX = vertices.reduce((minX, vertex) => Math.min(minX, vertex[0]), vertices[0][0]);
        minY = vertices.reduce((minY, vertex) => Math.min(minY, vertex[1]), vertices[0][1]);
        maxX = vertices.reduce((maxX, vertex) => Math.max(maxX, vertex[0]), vertices[0][0]);
        maxY = vertices.reduce((maxY, vertex) => Math.max(maxY, vertex[1]), vertices[0][1]);
    }

    return (
        <div className="p-5 space-y-3">
            <div>
                <button className="bg-slate-200 px-2 py-1 rounded"
                    onClick={() => {
                        setView('editor');
                    }}>Back to editor</button>
            </div>
            <p>
                This is the persistence diagram for dimension 1.
                When you click on points on the graph, a cycle with the corresponding birth and death times is shown on the right.
            </p>
            <div className="flex">
                <div className="w-96 h-96">
                    <Chart type="scatter" data={{
                        datasets: [{
                            data: persistence.map(({birth, death}, i) => 
                                    ({
                                        x: birth,
                                        y: death,
                                        i,
                                    })),
                            backgroundColor: 'red',
                            label: 'Persistence'
                        }, {
                            data: [{ x: 0, y: 0, i: -1}, { x: diagonalEndpoint, y: diagonalEndpoint, i: -1}],
                            backgroundColor: 'black',
                            borderColor: 'black',
                            type: "line",
                            label: "Diagonal",
                        }]
                    }}
                    options={{
                        aspectRatio: 1,
                        maintainAspectRatio: true,
                        scales: {
                            x: {
                                min: 0,
                                max: diagonalEndpoint,
                            },
                            y: {
                                min: 0,
                                max: diagonalEndpoint,
                            }
                        }
                    }}
                    ref={chartRef}
                    onClick={(e) => {
                        const element = getElementAtEvent(chartRef.current!, e)[0];
                        if (element) {
                            setSelectedPersistence(element.index);
                        }
                    }}/>
                </div>
                <div className="p-5">
                    <svg className="w-96 h-96" viewBox={`${minX - 5} ${minY - 5} ${maxX - minX + 10} ${maxY - minY + 10}`}>
                        {selectedPersistence !== null && (
                            persistence[selectedPersistence].edges.map(([i, j], index) => 
                                <line key={index} x1={vertices[i][0]} y1={vertices[i][1]}
                                        x2={vertices[j][0]} y2={vertices[j][1]} stroke="red" strokeWidth="2"/>)
                        )}
                        {vertices.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5"/>)}
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default function PersistentHomology() {
    const [vertices, setVertices] = useState<[number, number][]>([]);
    const [shapes, setShapes] = useState<[[number, number], [number, number]][]>([]);
    const [view, setView] = useState<'editor' | 'viewer'>('editor');

    if (view === 'editor') {
        return <Editor vertices={vertices} setVertices={setVertices}
                    shapes={shapes} setShapes={setShapes}
                    setView={setView}/>;
    } else {
        return <PersistentHomologyViewer vertices={vertices} setView={setView}/>;
    }
}