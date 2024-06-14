/// <reference path="../index.js" />
/// <reference path="../js/babylon.js" />

/// <reference path="../js/mainGame.js" />

/// <reference path="../js/Node.js" />





function Dog(id) {

    var self = this;



    this._currentNode = null;

    this._nextNode = null;

    //this._nextPath = 0;

    //this._impostor;

    this._directriz = BABYLON.Vector2.Zero();

    this._angle = 0;

    this._timeUpdater = 0;





    this.firstNode = null;

    this.end = [];

    this.id = id;

    this.mesh = {};

    this.skeletons = {};

    this.isReady = false;

    this.animating = false;

    this.isFreed = false;

    //this.isWatching = false;

    this.velocity = 1 / 10;

    //this.target = target;

    this.route = null;

    this.writingEvt = false;

    this.nRoute = 0;

    this.updating = true;



    // Manejando el comportamiento del perro

    this.controlActionUpdate = function () {

        if (self.updating) {

            if (!self.isFreed) {

                if (player._currentNode === self.firstNode) {

                    printEvent(5, true, "#72005f", "Presiona F para liberar al perro");

                    self.writingEvt = true;

                    // Animación de estar parado frente al jugador

                    if (self.animating) {

                        scene.beginAnimation(self.skeletons, 101, 123, true, 1.0);

                        self.animating = false;

                    }



                    //Asignando perro actual para que el jugador pueda liberarlo

                    currentDog = self;

                } else {

                    if (eventsCtrl[5] && self.writingEvt) {

                        printEvent(5, false, "#72005f", "Sin eventos");

                        // Quitando el perro actual

                        currentDog = null;

                    }

                    self.writingEvt = false;

                    // Animación de estar parado

                    if (!self.animating) {

                        scene.beginAnimation(self.skeletons, 0, 100, true, 1.0);

                        self.animating = true;

                    }

                }

            } else {



                // Si no existe ruta y el siguiente nodo no es el final crea la ruta

                if (!self.route) {

                    // Renovando nodos para hallar una nueva ruta

                    for (var i = 0; nodes.length > i; i++) {

                        for (var j = 0; nodes[i].length > j; j++) {

                            nodes[i][j].isVisited = false;

                            nodes[i][j].isClosed = false;

                            nodes[i][j].parent = null;

                        }

                    }



                    // Asignando posición fuera de la jaula

                    self.setCurrentNode(self.firstNode);



                    // Encontrando la ruta al siguiente path

                    self.route = self.firstNode.findRoute(nodes, self.end);

                }

                if (self.route[self.nRoute]) {

                    self._nextNode = self.route[self.nRoute];



                    self._directriz = self._nextNode.position.subtract(self._currentNode.position);

                    self._angle = Math.atan(self._directriz.x / self._directriz.y);



                    // Arreglando ángulo siempre en una sola dirección. Cuando la dirección en Z (Y según cordenadas 2D) es mayor a 0, se suma media vuelta

                    if (self._directriz.y < 0) {

                        self.mesh.rotation.y = self._angle;

                    }

                    else {

                        self.mesh.rotation.y = self._angle + Math.PI;

                    }



                    // Movimiento regulado

                    self.mesh.position.x += self._directriz.x * self.velocity;

                    self.mesh.position.z += self._directriz.y * self.velocity;



                    // Animación de correr

                    if (!self.animating) {

                        scene.beginAnimation(self.skeletons, 127, 134, true, 0.6);

                        self.animating = true;

                    }



                    // Define el nodo actual según la cercanía

                    self.defineActualNode();

                    if (self._currentNode === self.route[self.nRoute]) {

                        self.nRoute++;

                    }

                } else {

                    self.mesh.isVisible = false;

                    reduceDogCount();

                    self.updating = false;

                }

            }

        }

    };



}



// Agregar mesh u objeto 3D que representa al jugador

Dog.prototype.addMesh = function (meshName, meshDir, meshFile, scene, callback) {



    var self = this;

    // Callback externo ejecutado después del onMeshLoaded

    if (callback) {

        Player.prototype._onLoadMeshCallback = function () { };

        this._onLoadMeshCallback = callback;

    }



    BABYLON.SceneLoader.ImportMesh(meshName, meshDir, meshFile, scene, function (newMeshes, particleSystems, skeletons) {

        // Cosas para hacer después de la creación del mesh



        // Asignar referencias al mesh y a los esqueletos

        self.mesh = newMeshes[0];

        self.skeletons = skeletons[0];



        self.mesh.position.y = 0;

        self.mesh.rotationQuaternion = null;

        self.mesh.rotation.y = Math.PI;

        self.mesh.checkCollisions = false;

        // Impostor encargado de la colisión

        //self._impostor = BABYLON.Mesh.CreateBox("ImpostorP" + this.id, 10, scene);

        //self._impostor.checkCollisions = false;

        //self._impostor.isVisible = false;

        //self._impostor.ellipsoid = new BABYLON.Vector3(5, 10, 5);



        // Se activa bandera indicando que el enemigo está listo para usarse

        self.isReady = true;



        // Se ejecuta el callback indicado externamente

        if (self._onLoadMeshCallback) {

            self._onLoadMeshCallback(newMeshes, particleSystems, skeletons);

        }



    }); // ----- se pueden enviar 2 callbacks con ||?

};



Dog.prototype.setCurrentNode = function (node) {

    this._currentNode = node;

    this.setPosition(this._currentNode.position)

    //this.nodeList = nodes;

};



Dog.prototype.setPosition = function (pos) {

    this.mesh.position.x = pos.x;

    this.mesh.position.z = pos.y;

    this.mesh.position.y = 0;

    //this._impostor.position = this.mesh.position.clone();

    //this._impostor.position.y += 20;

};



Dog.prototype.defineActualNode = function () {

    var pos = new BABYLON.Vector2(this.mesh.position.x, this.mesh.position.z);

    //this._actualNode = new Nodo();

    var neighbors = Nodo.neighbors(nodes, this._currentNode)

    if (!this._currentNode.isCloseTo(pos).bRes) {

        var found = false;

        for (var i = 0; i < neighbors.length && !found; i++) {

            if (neighbors[i].isCloseTo(pos).bRes) {

                this._currentNode = neighbors[i];

                found = true;

            }

        }

    }

}
