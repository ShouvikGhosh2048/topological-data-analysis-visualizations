"use client";

import { useEffect, useRef, useState } from "react";

function squaredDistance(a: [number, number], b: [number, number]) {
    return (b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1]);
}

export default function VietorisRips() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<[number, number][]>([]);
    const [distance, setDistance] = useState<number>(0);
    const [drag, setDrag] = useState<{
        type: 'vertex'
        index: number,
        dragOffset: [number, number]
    } | {
        type: 'empty',
        initialPosition: [number, number],
        newPointIndex: number,
    } | null>(null);
    const [selected, setSelected] = useState<null | number>(null);

    // Resize canvas for HiDPI.
    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        const dpr = window.devicePixelRatio;
        canvas.width = 400 * dpr;
        canvas.height = 400 * dpr;
        canvas.style.width = '400px';
        canvas.style.height = '400px';
        ctx.scale(dpr, dpr);
    }, []);

    // Handle mouse drag
    useEffect(() => {
        if (drag) {
            if (drag.type === "vertex") {
                const mouseMove = (e: MouseEvent) => {
                    const canvasBoundingBox = canvasRef.current!.getBoundingClientRect();
                    const mousePosition: [number, number] = [e.clientX - canvasBoundingBox.x, e.clientY - canvasBoundingBox.y];
                    setPoints(points => [
                        ...points.slice(0, drag.index),
                        [mousePosition[0] - drag.dragOffset[0], mousePosition[1] - drag.dragOffset[1]],
                        ...points.slice(drag.index + 1)
                    ]);
                };

                const mouseUp = (e: MouseEvent) => {
                    mouseMove(e);
                    setDrag(null);
                };

                window.addEventListener('mousemove', mouseMove);
                window.addEventListener('mouseup', mouseUp);
                return () => {
                    window.removeEventListener('mousemove', mouseMove);
                    window.removeEventListener('mouseup', mouseUp);
                };
            } else {
                let create = true;

                const mouseMove = (e: MouseEvent) => {
                    const canvasBoundingBox = canvasRef.current!.getBoundingClientRect();
                    const mousePosition: [number, number] = [e.clientX - canvasBoundingBox.x, e.clientY - canvasBoundingBox.y];
                    if (squaredDistance(mousePosition, drag.initialPosition) >= 100) {
                        create = false;
                    }
                };

                const mouseUp = (e: MouseEvent) => {
                    mouseMove(e);

                    if (create) {
                        const canvasBoundingBox = canvasRef.current!.getBoundingClientRect();
                        const mousePosition: [number, number] = [e.clientX - canvasBoundingBox.x, e.clientY - canvasBoundingBox.y];
                        setPoints(points => [
                            ...points,
                            mousePosition,
                        ]);
                        setSelected(drag.newPointIndex);
                    }

                    setDrag(null);
                };

                window.addEventListener('mousemove', mouseMove);
                window.addEventListener('mouseup', mouseUp);
                return () => {
                    window.removeEventListener('mousemove', mouseMove);
                    window.removeEventListener('mouseup', mouseUp);
                };
            }
        }
    }, [drag]);

    // Draw complex
    useEffect(() => {
        const ctx = canvasRef.current!.getContext("2d");
        if (!ctx) {
            return;
        }

        const dpr = window.devicePixelRatio;

        ctx.clearRect(0, 0, 400, 400);

        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                for (let k = j + 1; k < points.length; k++) {
                    if (
                        squaredDistance(points[i], points[j]) <= distance * distance
                        && squaredDistance(points[i], points[k]) <= distance * distance
                        && squaredDistance(points[j], points[k]) <= distance * distance
                    ) {
                        ctx.fillStyle = 'gray';
                        ctx.beginPath();
                        ctx.moveTo(points[i][0], points[i][1]);
                        ctx.lineTo(points[j][0], points[j][1]);
                        ctx.lineTo(points[k][0], points[k][1]);
                        ctx.fill();
                    }
                }
            }
        }
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                if (squaredDistance(points[i], points[j]) <= distance * distance) {
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(points[i][0], points[i][1]);
                    ctx.lineTo(points[j][0], points[j][1]);
                    ctx.stroke();
                }
            }
        }

        points.forEach((point, i) => {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.ellipse(point[0], point[1], 10, 10, 0, 0, Math.PI * 2);
            ctx.fill();
        });

        if (selected !== null) {
            const selectedPoint = points[selected];
            ctx.fillStyle = '#eab308';
            ctx.beginPath();
            ctx.ellipse(selectedPoint[0], selectedPoint[1], 10, 10, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }, [points, distance, selected]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Delete' && selected !== null) {
                setPoints(points => [
                    ...points.slice(0, selected),
                    ...points.slice(selected + 1),
                ]);
                setSelected(null);
                setDrag(null);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [selected]);

    return (
        <div className="max-w-3xl p-3 flex justify-between mx-auto gap-20">
            <div className="max-w-md space-y-5">
                <div className="flex justify-between">
                        <button className="bg-slate-300 rounded px-2 py-1"
                                onClick={() => {
                                    setPoints([]);
                                    setDrag(null);
                                    setSelected(null);
                                }}>Reset</button>
                </div>
                <div className="flex gap-5 items-center">
                    <span className="w-28">Distance = {distance}</span>
                    <input type="range" value={distance}
                            min="0" max="566"
                            className="flex-grow"
                            onChange={(e) => { setDistance(Number(e.target.value)); setDrag(null); }}/>
                </div>
                <p className="text-xl">Instructions</p>
                <p>
                    You can place and drag vertices on the canvas using the left mouse button.
                </p>
                <p>
                    You can delete the selected vertex with the delete key.
                </p>
                <p>
                    Drag the slider to change the distance at which simplices are formed.
                </p>
            </div>
            <div>
                <canvas width="400px" height="400px"
                        className="border-2 border-black" ref={canvasRef}
                        onMouseDown={(e) => {
                            const canvasBoundingBox = canvasRef.current!.getBoundingClientRect();
                            const position: [number, number] = [e.clientX - canvasBoundingBox.x, e.clientY - canvasBoundingBox.y];
                            for (let i = 0; i < points.length; i++) {
                                if (squaredDistance(points[i], position) <= 100) {
                                    setDrag({
                                        type: "vertex",
                                        index: i,
                                        dragOffset: [position[0] - points[i][0], position[1] - points[i][1]],
                                    });
                                    setSelected(i);
                                    return;
                                }
                            }

                            setDrag({
                                type: "empty",
                                initialPosition: position,
                                newPointIndex: points.length,
                            });
                            setSelected(null);
                        }}/>
            </div>
        </div>
    );
}