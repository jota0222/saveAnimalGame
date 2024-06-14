/// <reference path="../index.js" />

/// <reference path="./babylon.js" />

/// <reference path="./mainGame.js" />

/// <reference path="./Node.js" />

/// <reference path="./LevelGrid.js" />

/// <reference path="./Dog.js" />



var createLevel = function (nivel) {



    // Creando nivel

    BABYLON.SceneLoader.Load("", "level" + nivel + ".babylon", engine, function (newScene) {
        
        scene = newScene;

        // Wait for textures and shaders to be ready    

        scene.executeWhenReady(function () {

            // Attach camera to canvas inputs

            //scene.activeCamera.attachControl(canvas);

            

            scene.collisionsEnabled = true;

            var layout = levelGrid(nivel);



            //skybox

            //var skybox = BABYLON.Mesh.CreateBox("skyBox", 600.0, scene);

            //var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);



            //skybox.position.y += 50;

            //skyboxMaterial.backFaceCulling = false;

            //skybox.material = skyboxMaterial;

            //skybox.infiniteDistance = true;

            //skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

            //skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

            //skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("./scenes/Textures/skybox/skybox", scene);

            //skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

            //skybox.renderingGroupId = 0;



            // Ocultando impostors

            for (var i = 1; i < 6; i++) {

                scene.getMeshByName("coli00" + i).isVisible = false;

            }

            

            music = new BABYLON.Sound("Music", "sounds/song.mp3", scene, null, { loop: true, autoplay: true });

            sounds[0] = new BABYLON.Sound("win", "sounds/win.mp3", scene, null, { loop: true, autoplay: false });

            sounds[1] = new BABYLON.Sound("lose", "sounds/lose.mp3", scene, null, { loop: false, autoplay: false });

            music.setVolume(0.2);



            // Creando mapa de nodos

            nodes = Nodo.createMapMatrix(44, 22, { width: 260, height: 520 }, layout);



            // Asignando paths a los enemigos

            enemies[0].paths = [nodes[11][18], nodes[11][5]];

            enemies[1].paths = [nodes[21][2], nodes[19][20], nodes[19][20]];

            enemies[2].paths = [nodes[26][5], nodes[24][8], nodes[26][11], nodes[28][8]];

            enemies[3].paths = [nodes[42][15], nodes[32][15], nodes[32][6], nodes[37][8], nodes[40][4]];



            //scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), new BABYLON.OimoJSPlugin());



            // Asignando nodo inicial y final alos perros

            dogs[0].firstNode = nodes[42][18];

            dogs[0].end = nodes[0][12];



            dogs[1].firstNode = nodes[34][18];

            dogs[1].end = nodes[0][12];



            dogs[2].firstNode = nodes[39][3];

            dogs[2].end = nodes[0][12];



            dogs[3].firstNode = nodes[34][3];

            dogs[3].end = nodes[0][12];



            dogs[4].firstNode = nodes[33][3];

            dogs[4].end = nodes[0][12];



            dogs[5].firstNode = nodes[40][3];

            dogs[5].end = nodes[0][12];



            player.addMesh("player", "./scenes/meshes/player/", "player.babylon", scene, function (newMeshes, particleSystems, skeletons) {

                newMeshes[0].scaling.x = 30;

                newMeshes[0].scaling.y = 30;

                newMeshes[0].scaling.z = 30;



                //newMeshes[0].rotation.x = Math.PI;

                //newMeshes[0].position.x = 0.5;

                //newMeshes[0].position.y = 30;

                //newMeshes[0].position.z = 0.5;

                player.controlPoint = nodes[3][12];

                player.setActualNode(nodes[3][12]);

                //newMeshes[0].setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 0, friction: 0.01, restitution: 0.2 });

                

                enemies[0].addMesh("player", "./scenes/meshes/enemy/", "enemy.babylon", scene, function (newMeshes, particleSystems, skeletons) {

                    newMeshes[0].scaling.x = 30;

                    newMeshes[0].scaling.y = 35;

                    newMeshes[0].scaling.z = 30;



                    enemies[0].setFirstNode(nodes[11][5]);





                    enemies[1].mesh = enemies[0].mesh.clone("ene2");

                    enemies[1].mesh.skeleton = enemies[0].skeletons.clone("ske4");

                    enemies[1].skeletons = enemies[1].mesh.skeleton;

                    //enemys[1].mesh.position = new BABYLON.Vector3.Zero();

                    enemies[1].setFirstNode(nodes[21][3]);





                    enemies[2].mesh = enemies[0].mesh.clone("ene3");

                    enemies[2].mesh.skeleton = enemies[0].skeletons.clone("ske3");

                    enemies[2].skeletons = enemies[2].mesh.skeleton;

                    //enemys[2].mesh.position = new BABYLON.Vector3.Zero();

                    enemies[2].setFirstNode(nodes[26][6]);



                    enemies[3].mesh = enemies[0].mesh.clone("ene4");

                    enemies[3].mesh.skeleton = enemies[0].skeletons.clone("ske4");

                    enemies[3].skeletons = enemies[3].mesh.skeleton;

                    //enemys[3].mesh.position = new BABYLON.Vector3.Zero();

                    enemies[3].setFirstNode(nodes[42][14]);



                    //for (i = 1; i < enemys.length; i++) { 

                    //    var c = [];



                    //    for (j = 1; j < newMeshes.length; j++) {

                    //        c[j] = newMeshes[j].clone("c" + j);

                    //        c[j].skeleton = newMeshes[j].skeleton.clone();

                    //    }

                    //    enemys[i].mesh = c;

                    //}

                    //enemys[0].renderingGroupId = 1;

                    //enemys[0].setPosition(new BABYLON.Vector3(-7, 0, -200));

                    //newMeshes[0].setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 0, friction: 0.01, restitution: 0.2 });

                    dogs[0].addMesh("dog", "./scenes/meshes/dog/", "dog.babylon", scene, function (newMeshes, particleSystems, skeletons) {

                        newMeshes[0].scaling.x = 0.2;

                        newMeshes[0].scaling.y = 0.2;

                        newMeshes[0].scaling.z = 0.2;



                        dogs[0].setCurrentNode(nodes[42][20]);

                        dogs[0].mesh.rotation.y = Math.PI / 2;



                        dogs[1].mesh = dogs[0].mesh.clone("dog1");

                        dogs[1].mesh.skeleton = dogs[0].skeletons.clone("SDog1");

                        dogs[1].mesh.rotation.y = Math.PI / 2;

                        dogs[1].skeletons = dogs[1].mesh.skeleton;

                        //dogs[1].mesh.position = new BABYLON.Vector3.Zero();

                        dogs[1].setCurrentNode(nodes[34][20]);





                        dogs[2].mesh = dogs[0].mesh.clone("dog2");

                        dogs[2].mesh.skeleton = dogs[0].skeletons.clone("SDog2");

                        dogs[2].mesh.rotation.y = -Math.PI / 2;

                        dogs[2].skeletons = dogs[2].mesh.skeleton;

                        //dogs[2].mesh.position = new BABYLON.Vector3.Zero();

                        dogs[2].setCurrentNode(nodes[39][1]);



                        dogs[3].mesh = dogs[0].mesh.clone("dog3");

                        dogs[3].mesh.skeleton = dogs[0].skeletons.clone("SDog3");

                        dogs[3].mesh.rotation.y = -Math.PI / 2;

                        dogs[3].skeletons = dogs[3].mesh.skeleton;

                        //dogs[3].mesh.position = new BABYLON.Vector3.Zero();

                        dogs[3].setCurrentNode(nodes[34][1]);



                        dogs[4].mesh = dogs[0].mesh.clone("dog4");

                        dogs[4].mesh.skeleton = dogs[0].skeletons.clone("SDog4");

                        dogs[4].mesh.rotation.y = Math.PI;

                        dogs[4].skeletons = dogs[4].mesh.skeleton;

                        //dogs[3].mesh.position = new BABYLON.Vector3.Zero();

                        dogs[4].setCurrentNode(nodes[31][3]);



                        dogs[5].mesh = dogs[0].mesh.clone("dog5");

                        dogs[5].mesh.skeleton = dogs[0].skeletons.clone("SDog5");

                        dogs[5].mesh.rotation.y = 0;

                        dogs[5].skeletons = dogs[5].mesh.skeleton;

                        //dogs[3].mesh.position = new BABYLON.Vector3.Zero();

                        dogs[5].setCurrentNode(nodes[42][3]);



                        scene.beginAnimation(player.skeletons[0], 0, 298, true, 1.0);

                        scene.activeCamera.detachControl(canvas);

                        welcomeCam = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(39, 23, -176), scene);

                        welcomeCam.rotation = new BABYLON.Vector3(0.25, 3.95, 0.57);

                        scene.setActiveCameraByName("FreeCamera");
                        
                        //.activeCamera.detachControl(canvas);
                        
                        const startButton = document.getElementById("begin");

                        if (!startButton) return;
                        
                        startButton.style.pointerEvents = "all";

                        startButton.innerHTML = "Jugar ya";



                        engine.runRenderLoop(updater);

                    });

                });

            });

            

            

            //    //------------TO DO: Aplicar CELLSHADING a toda la escena

            //    // Generando efecto cellshadding si todo logra cargar

            //    //try {

            //    //    CreateCellShading();

            //    //}

            //    //catch (e) { console.log(e) }

            //    //var material23 = new BABYLON.ShaderMaterial("2", scene, "./scenes/shaders/default",

            //    //    {

            //    //        attributes: ["position", "normal", "uv"],

            //    //        uniforms: ["world", "viewProjection"]

            //    //    });

            //    //var amigaTexture = new BABYLON.Texture("./scenes/meshes/2.jpg", scene);

            //    //material23.setTexture("textureSampler", amigaTexture);

            //    //scene.getMeshByName(" / 2").material = material23;

            //    //scene.getMeshByName(" / 4").material.setVector3("cameraPosition", BABYLON.Vector3.Zero());

            //    //scene.getMeshByName(" / 2").material.backFaceCulling = false;



        });

    }, function (progress) {

        // --------- To do: give progress feedback to user

    });

};
