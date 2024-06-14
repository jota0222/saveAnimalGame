/// <reference path="./babylon.js" />

/// <reference path="./mainGame.js" />

/// <reference path="./Node.js" />



function Player(id) {

    var self = this;

    var pressedKey = [];



    this._impostor = null;

    this._radius = null;

    this._currentNode = null;



    this.id = id;

    this.followCamera;

    this.mesh = {};

    this.skeletons = [];

    this.isReady = false;

    this.animating = false;

    this.velocity = 0.9;

    this.lives = 3;

    this.controlPoint = null;



    // Manejando el movimiento del jugador

    this.controlActionUpdate = function () {

        if (self._currentNode === nodes[0][12]) {

            if (!pressedKey[70]) {

                printEvent(5, true, "#72005f", "Presiona F para salir");

            }

        } else {

            pressedKey[70] = false;

        }



        if (pressedKey[87] || pressedKey[83] || pressedKey[68] || pressedKey[65]) { // Entra solo si se ha presionado alguna tecla

            var rotation = self.followCamera.alpha;

            var direction = rotation;

            var z = 0,

                x = 0;



            if (pressedKey[87]) { // arriba: W

                z -= Math.sin(direction) * self.velocity;

                x -= Math.cos(direction) * self.velocity;

                rotation -= Math.PI / 2;

            }

            if (pressedKey[83]) { // abajo: S

                z += Math.sin(direction) * self.velocity;

                x += Math.cos(direction) * self.velocity;

                rotation += Math.PI / 2;

            }

            if (pressedKey[68]) { // derecha: D

                z += Math.sin(direction + Math.PI / 2) * self.velocity;

                x += Math.cos(direction + Math.PI / 2) * self.velocity;

                rotation -= Math.PI;

            }

            if (pressedKey[65]) { // izquierda: A

                z -= Math.sin(direction + Math.PI / 2) * self.velocity;

                x -= Math.cos(direction + Math.PI / 2) * self.velocity;

            }



            // Movimiento en diagonal

            if (pressedKey[87] && pressedKey[68] || pressedKey[87] && pressedKey[65] || pressedKey[83] && pressedKey[68] || pressedKey[83] && pressedKey[65]) {

                // Fix para rotación en diagonal Abajo-Derecha, no aplican las mismas fórmulas

                if (pressedKey[83] && pressedKey[68]) {

                    self.mesh.rotation.y = -(self.followCamera.alpha + rotation) / 2 + Math.PI;

                }

                else {

                    self.mesh.rotation.y = -(self.followCamera.alpha + rotation) / 2;

                }



                var diagFix = (Math.sqrt(2) * self.velocity - self.velocity) / 2; // Para evitar que la velocidad de movimiento sea mayor en diagonal



                if (z < 0)

                    z += diagFix;

                else

                    z -= diagFix;

                if (x < 0)

                    x += diagFix;

                else

                    x -= diagFix;

            }

            else {

                self.mesh.rotation.y = -rotation;

            }



            // Comienza animación si no la hay

            if (!self.animating) {

                scene.beginAnimation(self.skeletons[0], 300, 320, true, 1.0);

                self.animating = true;

            }



            // Aplicando el movimiento

            self._impostor.moveWithCollisions(new BABYLON.Vector3(x, 0, z));

            self.mesh.position.x = self._impostor.position.x;

            self.mesh.position.z = self._impostor.position.z;

            self.followCamera.target.z = self.mesh.position.z;

            self.followCamera.target.x = self.mesh.position.x;



            self.defineActualNode();



            //self.followCamera.checkCollisions = true;

            //self.followCamera.radius = radius;

            //this.node.

        }



        self.updateCamera();



    };



    // Escuchan las teclas que son presionadas

    this.controlPressListener = function (evt) {

        pressedKey[evt.keyCode] = true;



    };

    this.controlLibereListener = function (evt) {

        if (evt.keyCode == 70) {

            if (currentDog) {

                currentDog.isFreed = true;

                currentDog = null;

            } else {

                if (self._currentNode === nodes[0][12]) {

                    if (dogCount == 0) {

                        if (bMusic) {

                            music.stop();

                            sounds[0].play();

                        }

                        pause();

                        paused = false;

                        printEvent(0, true, "green", "¡Has ganado!, felicidades :)");

                        let retryModal = document.getElementById("retry");
                        if (!retryModal) return;
                        retryModal.style.visibility = "visible";

                        let eventsConsole = document.getElementById("events");
                        if (!eventsConsole) return;
                        eventsConsole.style.zIndex = "3";

                        let eventsHUD = document.getElementById("eventsHUD");
                        if (!eventsHUD) return;
                        eventsHUD.style.zIndex = "3";
                    } else {

                        printEvent(3, true, "yellow", "¡No salgas!, te faltan " + dogCount + " perros");

                    }

                }

            }

        } else {

            pressedKey[evt.keyCode] = false;

            scene.beginAnimation(self.skeletons[0], 0, 298, true, 1.0);

            self.animating = false;

        }

    };





}



// Agregar mesh u objeto 3D que representa al jugador

Player.prototype.addMesh = function (meshName, meshDir, meshFile, scene, callback) {



    var self = this;

    // Callback externo ejecutado después del onMeshLoaded

    if (callback) {

        Player.prototype.onLoadMeshCallback = function () { };

        this.onLoadMeshCallback = callback;

    }



    if (!this.followCamera) {

        this.followCamera = new BABYLON.ArcRotateCamera("fllwCamPl" + this.id, -Math.PI / 2, Math.PI / 4, 6, BABYLON.Vector3.Zero(), scene);

    }



    BABYLON.SceneLoader.ImportMesh(meshName, meshDir, meshFile, scene, function (newMeshes, particleSystems, skeletons) {

        // Cosas para hacer después de la creación del mesh



        // Asignar referencias al mesh y a los esqueletos

        self.mesh = newMeshes[0];

        self.skeletons = skeletons;



        self.mesh.rotationQuaternion = null;

        self.mesh.rotation.y = Math.PI;



        // Impostor encargado de la colisión

        self._impostor = BABYLON.Mesh.CreateBox("ImpostorP" + this.id, 10, scene);

        self._impostor.checkCollisions = true;

        self._impostor.isVisible = false;

        self._impostor.ellipsoid = new BABYLON.Vector3(5, 10, 5);

        //self._impostor.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, {friction:0.1});

        //self._impostor.ellipsoid = BABYLON.Vector3(10, 30, 10);

        //self._impostor.ellipsoidOffset = BABYLON.Vector3(0.5, 0, 0.5);

        //self._impostor.isVisible = true;

        //self._impostor.parent = self.mesh;



        // Asignando control a la cámara que mira al jugador y algunos parámetros necesarios

        scene.activeCamera.detachControl(canvas);

        self.followCamera.target = self.mesh.position.clone();

        self.followCamera.target.y += 20;

        self.followCamera.radius = 48.5;

        //self.followCamera.collisionRadius = 20;

        //self.followCamera.checkCollisions = true;

        self.followCamera.lowerRadiusLimit = 25;

        self.followCamera.upperRadiusLimit = 55;

        self.followCamera.lowerBetaLimit = .2;

        self.followCamera.upperBetaLimit = 1.3;

        //this.camera.cameraDirection.y = 3;

        //camera.cameraDirection.z = 5;

        //camera.camerarotation.y = 0.31;

        //scene.activeCamera = self.followCamera;



        // Asignando cámara activa y su control

        scene.setActiveCameraByName(self.followCamera.name);

        scene.activeCamera.attachControl(canvas);



        // Se activa bandera indicando que el jugador está listo para usarse

        self.isReady = true;



        // Se ejecuta el callback indicado externamente

        if (self.onLoadMeshCallback) {

            self.onLoadMeshCallback(newMeshes, particleSystems, skeletons);

        }



    }); // ----- se pueden enviar 2 callbacks con ||?

};



// Si se cambia la posición del Player se debe asignar al mesh, camara e impostor

Player.prototype.setPosition = function (pos) {

    this.mesh.position = pos;

    this.followCamera.target = this.mesh.position.clone();

    this.followCamera.target.y += 20;

    this._impostor.position = this.mesh.position.clone();

    this._impostor.position.y += 20;

    this.mesh.position.y = 15;

    //new BABYLON.AbstractMesh().subMeshes..

    //this.mesh.position.y = 15;

};



// Indica el nodo principal para que eljugador se posicione

Player.prototype.setActualNode = function (node) {

    this._currentNode = node;

    var pos = new BABYLON.Vector3(this._currentNode.position.x, 0, this._currentNode.position.y);

    this.setPosition(pos);

};



// Encuentra el nuevo nodo actual en el momento en que el jugador entra en movimiento

Player.prototype.defineActualNode = function () {

    var pos = new BABYLON.Vector2(this.mesh.position.x, this.mesh.position.z);

    var cercanos = [];

    var found = false;

    //this._actualNode = new Nodo();

    var neighbors = Nodo.neighbors(nodes, this._currentNode);

    if (!this._currentNode.isCloseTo(pos).bRes) {

        for (var i = 0; i < neighbors.length && !found; i++) {

            var res = neighbors[i].isCloseTo(pos);

            if (res.bRes && neighbors[i].isActive) {

                this._currentNode = neighbors[i];

                found = true;

            } else {

                if (neighbors[i].isActive) {

                    cercanos[i] = res.res;

                } else {

                    cercanos[i] = 100;

                }

            }

        }

        if (!found) {

            var min = 0;

            for (let i = 0; i < cercanos.length; i++) {
                if (cercanos[min] > cercanos[i]) {

                    min = i;

                }

            }

            this._currentNode = neighbors[min];

        }

    }

};

Player.prototype.updateCamera = function () {

    // If the last position of the camera is diferent, then compute the colision and new position

    if (!this.followCamera.position.equals(this.followCamera.lastPosition)) {

        // If in this moment the camera is in collision mode (zooming to target), then restore the original position

        if (this.followCamera.zooming) {

            this.followCamera.radius = this.followCamera.actualRadius;

            this.followCamera.lowerRadiusLimit = this.followCamera.minimRadius;

        }

        this.followCamera._getViewMatrix();



        // Detecting the view colission.

        this.followCamera.realPosRay = BABYLON.Ray.CreateNewFromTo(this.followCamera.position, this.mesh.position);



        var onSee = scene.pickWithRay(this.followCamera.realPosRay, function (item) {

            if (item.name.indexOf("wall") == 0) {// in this case, only "wall" is wanted but is useful with all other objects 

                return true;

            }

            else

                return false;

        });



        // If is colliding, then calculate the new view position...

        if (onSee != null && onSee.pickedPoint != null) {

            this.followCamera.zooming = true;



            this.followCamera.actualRadius = this.followCamera.radius;

            this.followCamera.minimRadius = this.followCamera.lowerRadiusLimit;

            this.followCamera.radius = this.followCamera.radius - onSee.distance - 2;



            // If the new radius is lower than the limit, adjust the new limit

            if (this.followCamera.radius < this.followCamera.lowerRadiusLimit) {

                this.followCamera.lowerRadiusLimit = this.followCamera.radius;

            }

        } else { // ...else isn't colliding and the view is the original

            this.followCamera.zooming = false;

        }



        // Get the last position for the next call

        this.followCamera._getViewMatrix();

        this.followCamera.lastPosition = this.followCamera.position.clone();

    }

};
