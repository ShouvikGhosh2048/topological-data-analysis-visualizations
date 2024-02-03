function distance(a: [number, number], b: [number, number]) {
    return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
}

// Applies last value operation and returns a map from lasts to column indices.
function applyLastValueOperation(matrix: {
    labels: Set<number>,
    entries: Set<number>,
}[]) {
    const lastToColumnIndex = new Map<number, number>();

    matrix.forEach((column, i) => {
        while (true) {
            let columnLast = -1;
            column.entries.forEach(entry => {
                if (entry > columnLast) {
                    columnLast = entry;
                }
            });
    
            if (columnLast === -1) {
                return;
            }
    
            const columnWithSameLastIndex = lastToColumnIndex.get(columnLast);
            if (columnWithSameLastIndex === undefined) {
                lastToColumnIndex.set(columnLast, i);
                return;
            }
    
            const columnWithSameLast = matrix[columnWithSameLastIndex];
            columnWithSameLast.labels.forEach(label => {
                if (column.labels.has(label)) {
                    column.labels.delete(label);
                } else {
                    column.labels.add(label);
                }
            });
            columnWithSameLast.entries.forEach(entry => {
                if (column.entries.has(entry)) {
                    column.entries.delete(entry);
                } else {
                    column.entries.add(entry);
                }
            });
        }
    });

    return lastToColumnIndex;
}

onmessage = (e) => {
    const vertices: [number, number][] = e.data;

    const levels = new Map<number, {
        edges: [number, number][],
        triangles: [number, number, number][]
    }>();

    for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
            const levelValue = distance(vertices[i], vertices[j]);
            let level = levels.get(levelValue);
            if (!level) {
                level = {
                    edges: [],
                    triangles: []
                };
                levels.set(levelValue, level);
            }
            level.edges.push([i, j]);
        }
    }

    for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
            for (let k = j + 1; k < vertices.length; k++) {
                const levelValue = Math.max(
                    distance(vertices[i], vertices[j]),
                    distance(vertices[i], vertices[k]),
                    distance(vertices[j], vertices[k])
                );
                let level = levels.get(levelValue);
                if (!level) {
                    level = {
                        edges: [],
                        triangles: []
                    };
                    levels.set(levelValue, level);
                }
                level.triangles.push([i, j, k]);
            }
        }
    }

    const levelsArray: [number, {
        edges: [number, number][],
        triangles: [number, number, number][]
    }][] = [];
    for (const level of levels.entries()) {
        levelsArray.push(level);
    }
    levelsArray.sort((level1, level2) => level1[0] - level2[0]);

    // Order the edges
    const edges: [number, number][] = [];
    const edgeToIndex = new Map<number, number>();
    const triangles: [number, number, number][] = [];

    // We hash a edge using edge[0] * numberOfVertices + edge[1].
    const hashedEdge = (edge: [number, number]) => {
        return edge[0] * vertices.length + edge[1];
    }
    
    levelsArray.forEach(([_, level]) => {
        level.edges.forEach(edge => {
            edges.push(edge);
            edgeToIndex.set(hashedEdge(edge), edges.length - 1);
        });

        level.triangles.forEach(triangle => {
            triangles.push(triangle);
        });
    });

    const boundary1: {
        labels: Set<number>,
        entries: Set<number>
    }[] = [];
    levelsArray.forEach(([_, { triangles }]) => {
        triangles.forEach(triangle => {
            const newBoundary = {
                labels: new Set([boundary1.length]),
                entries: new Set([
                    edgeToIndex.get(hashedEdge([triangle[0], triangle[1]]))!,
                    edgeToIndex.get(hashedEdge([triangle[0], triangle[2]]))!,
                    edgeToIndex.get(hashedEdge([triangle[1], triangle[2]]))!,
                ])
            };
            boundary1.push(newBoundary);
        });
    });

    const lastToColumnIndex = applyLastValueOperation(boundary1);

    const persistence1: {
        birth: number,
        death: number,
        edges: [number, number][],
    }[] = [];
    lastToColumnIndex.forEach((columnIndex, last) => {
        const lastEdge = edges[last];
        const lastEdgeDistance = distance(vertices[lastEdge[0]], vertices[lastEdge[1]]);

        const lastTriangle = triangles[columnIndex];
        const lastTriangleDistance = Math.max(
            distance(vertices[lastTriangle[0]], vertices[lastTriangle[1]]),
            distance(vertices[lastTriangle[0]], vertices[lastTriangle[2]]),
            distance(vertices[lastTriangle[1]], vertices[lastTriangle[2]])
        );

        if (lastEdgeDistance !== lastTriangleDistance) {
            persistence1.push({
                birth: lastEdgeDistance,
                death: lastTriangleDistance,
                edges: [...boundary1[columnIndex].entries].map(edgeIndex => edges[edgeIndex]),
            });
        }
    });

    postMessage(persistence1);
}