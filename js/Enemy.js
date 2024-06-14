/// <reference path="../index.js" />

/// <reference path="./babylon.js" />

/// <reference path="./mainGame.js" />

/// <reference path="./Node.js" />





function Enemy(id, target) {

    var self = this;

    

    this._currentNode = null;

    this._nextNode = null;

    this._nextPath = 0;

    this._impostor = null;

    this._directriz = BABYLON.Vector2.Zero();

    this._angle = 0;

    this._timeUpdater = 0;





    this.firstNode = null;

    this.paths = []; 

    this.id = id;

    this.mesh = {};

    this.skeletons = {};

    this.isReady = false;

    this.animating = false;

    this.isWatching = false;

    this.velocity = 1/20;

    this.target = target;

    this.route = null;



    // Manejando el comportamiento del enemigo

    this.controlActionUpdate = function () {

        // Posiciones 2D para encontrar distancia

        var myPos = new BABYLON.Vector2(self.mesh.position.x, self.mesh.position.z),

            targetPos = new BABYLON.Vector2(self.target.mesh.position.x, self.target.mesh.position.z);



        // distancia hasta el jugador

        var distance = BABYLON.Vector2.Distance(myPos, targetPos);



        // Si está lo suficientemente cerca, entra, si no, busca el siguiente path

        if (distance < 120) {

            if (distance > 100){

                if(eventsCtrl[1]){

                    printEvent(1, false, "#72005f", "Sin eventos");

                }

            } else {

                printEvent(1, true, "yellow", "¡Cuidado!, hay un guardia cerca");

            }



            var direction = targetPos.subtract(myPos);

            var newAngle = Math.atan(direction.x / direction.y);

            var rangeAngle;



            // Los ángulos con respecto a los ejes cambian si Y>0 y si Y<0, por tanto, cuando ambos tienen

            // el mismo signo, se restan, en caso contrario se suman para hallar el rango de visión.

            if ((self._directriz.y < 0 && direction.y < 0) || (self._directriz.y >= 0 && direction.y >= 0)) {

                rangeAngle = self._angle - newAngle;

            } else {

                rangeAngle = self._angle + newAngle;

            }



            var continua = true;

            // Si la suma de los ángulos es es menor al rango previsto porq los ángulos con respecto al eje son pequeños,

            // ingresa generando que el enemigo mire hacia atrás cuando el vector dirección está a un ángulo pequeño.

            if ((newAngle < 1 || newAngle > -1) && (self._angle < 1 || self._angle > -1)) {

                if ((self._directriz.y * direction.y) < 0)

                    continua = false;

            }



            if (rangeAngle <= 1 && rangeAngle >= -1 && continua) {

                if (!self.isWatching) {

                    //var rayDirection = self.target.mesh.position.subtract(self.mesh.position);

                    //rayDirection.normalize();



                    var see = BABYLON.Ray.CreateNewFromTo(self.mesh.position, self.target.mesh.position);



                    var onSee = scene.pickWithRay(see, function (item) {

                        if (item.name.indexOf("wall") == 0) {// El rayo solo toma las paredes como referencia... 

                            return true;

                        }

                        else                                // ... lo demás se descarta

                            return false;

                    });

                    self.isWatching = onSee.pickedPoint == null;

                }

            }

            if (self.isWatching) { // Si es no nulo es porque hay una pared, entra si no la hay

                if (self._currentNode) {

                    // Renovando nodos para hallar una nueva ruta

                    for (var i = 0; self.route && nodes.length > i; i++) {

                        for (var j = 0; nodes[i].length > j; j++) {

                            nodes[i][j].isVisited = false;

                            nodes[i][j].isClosed = false;

                            nodes[i][j].parent = null;

                        }

                    }



                    // Encontrando la ruta hasta el otro punto hacia el objetivo

                    self.route = self._currentNode.findRoute(nodes, self.target._currentNode);

                    printEvent(0, true, "red", "¡Te han visto!, ¡que no te atrapen!");

                    if (self.route.length > 8) {

                        self.isWatching = false;

                        printEvent(0, false, "green", "por poco");

                    }

                }

            }

        } else {

            self.isWatching = false;

        }

        var waitTime = Date.now() - self._timeUpdater;

        if (waitTime > 4000) {

            if (!self.isWatching) {

                // Renovando nodos para hallar una nueva ruta

                for (var i = 0; self.route && nodes.length > i; i++) {

                    for (var j = 0; nodes[i].length > j; j++) {

                        nodes[i][j].isVisited = false;

                        nodes[i][j].isClosed = false;

                        nodes[i][j].parent = null;

                    }

                }



                // Encontrando la ruta al siguiente path

                self.route = self._currentNode.findRoute(nodes, self.paths[self._nextPath]);



                // Si no hay más en la ruta cambia de path

                if (!self.route[0]) {

                    if (self._nextPath === (self.paths.length - 1)) {

                        self._nextPath = 0;

                    }

                    else

                        self._nextPath++;

                    self._timeUpdater = Date.now();

                }

            }

        }

        // Si existe una ruta, entra

        if (self.route[0]) {



            self._nextNode = self.route[0];



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

                scene.beginAnimation(self.skeletons, 300, 320, true, 1.0);

                self.animating = true;

            }



            // Define el nodo actual según la cercanía

            self.defineCurrentNode();



        } else {

            // Animación de estar parado

            if (self.animating) {

                scene.beginAnimation(self.skeletons, 0, 298, true, 1.0);

                self.animating = false;

            }

            if (self.isWatching) {

                decreaseLife();

            }

        }

    };

}



// Agregar mesh u objeto 3D que representa al jugador

Enemy.prototype.addMesh = function (meshName, meshDir, meshFile, scene, callback) {



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



        self.mesh.position.y = 17;

        self.mesh.rotationQuaternion = null;

        self.mesh.rotation.y = Math.PI;

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



Enemy.prototype.setFirstNode = function (node) {

    this.firstNode = node;

    this._currentNode = node;

    this.setPosition(this._currentNode.position)

    //this.nodeList = nodes;

};



Enemy.prototype.setPosition = function (pos) {

    this.mesh.position.x = pos.x;

    this.mesh.position.z = pos.y;

    this.mesh.position.y = 17;

    //this._impostor.position = this.mesh.position.clone();

    //this._impostor.position.y += 20;

};



Enemy.prototype.defineCurrentNode = function () {

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
