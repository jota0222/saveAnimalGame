/// <reference path="./babylon.js" />

/// <reference path="./mainGame.js" />

/// <reference path="./BinaryHeap.js" />



function Nodo(position, size, posRow, posCol) {

    this.isActive = true;

    this.isClosed = null;

    this.isVisited = null;

    this.parent = null;

    this.cost = 1;

    this.f = 0;

    this.g = 0;

    this.h = 0;



    this.col = posCol;

    this.row = posRow;



    this.position = position;

    this.width = size.width;

    this.height = size.height;

}







// Indica si el objeto con la posición dada está en el radio de cercanía

Nodo.prototype.itIsInRadius = function (itPosition) {

    var itPos = {

        x: itPosition.x,

        y: itPosition.z

    }

    if (itPosition.x < 0) itPos.x *= -1;

    if (itPosition.y < 0) itPos.y *= -1;

    var difX = this.position.x + this.width.x / 2 - itPos.x;

    var difY = this.position.y + this.width.y / 2 - itPos.y;

    if (difX >= 0 && difX >= 0) return true;

    return false;

};



// Encuentra la ruta más óptima al nodo buscado 

Nodo.prototype.findRoute = function (grid, end) {

    

    var start = this;

    var openHeap = Nodo.heap();

    var heuristic = function (pos0, pos1) {

        var d1 = Math.abs(pos1.x - pos0.x);

        var d2 = Math.abs(pos1.y - pos0.y);

        return d1 + d2;

    };



    openHeap.push(start);



    while (openHeap.size() > 0) {



        // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.

        var currentNode = openHeap.pop();



        // End case -- result has been found, return the traced path.

        if (currentNode === end) {

            var curr = currentNode;

            var ret = [];

            while (curr.parent) {

                ret.push(curr);

                curr = curr.parent;

            }

            return ret.reverse();

        }



        // Normal case -- move currentNode from open to closed, process each of its neighbors.

        currentNode.isClosed = true;



        // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).

        var neighbors = Nodo.neighbors(grid, currentNode);

        for (var i = 0, il = neighbors.length; i < il; i++) {

            var neighbor = neighbors[i];



            if (neighbor.isClosed || !neighbor.isActive) {

                // Not a valid node to process, skip to next neighbor.

                continue;

            }

            // The g score is the shortest distance from start to current node.

            // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.

            var gScore = currentNode.g + neighbor.cost;

            var beenVisited = neighbor.isVisited;



            if (!beenVisited || gScore < neighbor.g) {



                // Found an optimal (so far) path to this node.  Take score for node to see how good it is.

                neighbor.isVisited = true;

                neighbor.parent = currentNode;

                neighbor.h = heuristic(neighbor.position, end.position);

                neighbor.g = gScore;

                neighbor.f = neighbor.g + neighbor.h;



                if (!beenVisited) {

                    // Pushing to heap will put it in proper place based on the 'f' value.

                    openHeap.push(neighbor);

                }

                else {

                    // Already seen the node, but since it has been rescored we need to reorder it in the heap

                    openHeap.rescoreElement(neighbor);

                }

            }

        }

    }

    // No result was found - empty array signifies failure to find path.

    return [];

}



// Crea una matrix de Nodos teniendo en cuenta el tamaño del mapa y la cantidad de filas y columnas de división del mapa

Nodo.createMapMatrix = function (rows, cols, mapSize, mapping) {

    var nodes = new Array(rows);

    var position;

    var size = {

        width: mapSize.width / cols,

        height: mapSize.height / rows

    };

    for (var i = 0; i < nodes.length; i++) {

        nodes[i] = new Array(cols);

        for (var j = 0; j < nodes[i].length; j++) {

            position = new BABYLON.Vector2.Zero();

            position.x = -mapSize.width / 2 + size.width / 2 + j * size.width;

            position.y = -mapSize.height / 2 + size.height / 2 + i * size.height;

            nodes[i][j] = new Nodo(position, size, i, j);

            if (mapping[i][j] == 1) {

                nodes[i][j].isActive = false;

            }

        }

    }

    return nodes;

};



Nodo.neighbors = function (grid, node) {

    var ret = [];

    var x = node.row;

    var y = node.col;



    // West

    if (grid[x - 1] && grid[x - 1][y]) {

        ret.push(grid[x - 1][y]);

    }



    // East

    if (grid[x + 1] && grid[x + 1][y]) {

        ret.push(grid[x + 1][y]);

    }



    // South

    if (grid[x] && grid[x][y - 1]) {

        ret.push(grid[x][y - 1]);

    }



    // North

    if (grid[x] && grid[x][y + 1]) {

        ret.push(grid[x][y + 1]);

    }



    // Southwest

    if (grid[x - 1] && grid[x - 1][y - 1]) {

        ret.push(grid[x - 1][y - 1]);

    }



    // Southeast

    if (grid[x + 1] && grid[x + 1][y - 1]) {

        ret.push(grid[x + 1][y - 1]);

    }



    // Northwest

    if (grid[x - 1] && grid[x - 1][y + 1]) {

        ret.push(grid[x - 1][y + 1]);

    }



    // Northeast

    if (grid[x + 1] && grid[x + 1][y + 1]) {

        ret.push(grid[x + 1][y + 1]);

    }



    return ret;

};



Nodo.heap = function () {

    return new BinaryHeap(function (node) {

        return node.f;

    });

}



Nodo.prototype.isCloseTo = function (pos) {

    var res = BABYLON.Vector2.Distance(this.position, pos);

    if (res < this.width/2) {

        return { bRes: true, res: res }

    }

    return { bRes: false, res: res };

}
