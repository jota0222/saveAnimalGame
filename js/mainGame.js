/// <reference path="./babylon.js" />

/// <reference path="./Player.js" />

/// <reference path="./gameScene.js" />

/// <reference path="./Enemy.js" />

/// <reference path="./Dog.js" />

var welcomeCam;

var canvas;

var engine;

var scene;

/** @type {Player} */
var player;

/** @type {Enemy[]} */
var enemies = [];

var nodes; //= new Array(44);

var eventsCtrl = [];

var currentDog;

var dogCount;

/** @type {Dog[]} */
var dogs = [];

var music;

var sounds = [];

//Número de jugadores

var nPlayers = 0;

document.addEventListener("DOMContentLoaded", startAnimals, false);

function startAnimals() {
    if (BABYLON.Engine.isSupported()) {
        dogCount = 6;

        //Obteniendo el lienzo

        canvas = document.getElementById("gameCanvas");

        //Creando el motor 3D e indicandole el lienzo

        engine = new BABYLON.Engine(canvas, true);

        //Creando jugador

        player = new Player(nPlayers);

        //Creando enemigos

        enemies[0] = new Enemy(1, player);

        enemies[1] = new Enemy(2, player);

        enemies[2] = new Enemy(3, player);

        enemies[3] = new Enemy(4, player);

        //Creando perros a rescatar

        dogs[0] = new Dog(0);

        dogs[1] = new Dog(1);

        dogs[2] = new Dog(2);

        dogs[3] = new Dog(3);

        dogs[4] = new Dog(4);

        dogs[5] = new Dog(5);

        //Creando la escenea o el nivel

        createLevel(1);
    }
}

function updater() {
    //for (var i = 0; i<scene.meshes.length; i++){

    //    shaderMaterial = scene.getMaterialByName("shader"+i);

    //    shaderMaterial.setFloat("time", time);

    //    time += 0.02;

    //    shaderMaterial.setVector3("cameraPosition", scene.activeCamera.position);

    //}

    for (var i in enemies) {
        enemies[i].controlActionUpdate();
    }

    for (var i in dogs) {
        dogs[i].controlActionUpdate();
    }

    player.controlActionUpdate();

    scene.render();

    engine.resize();
}

function printEvent(evtID, bActive, color, text) {
    if (eventsCtrl[0] && evtID != 0) return;

    const eventConsole = document.getElementById("evtView");

    if (!eventConsole) return;

    eventConsole.style.color = color;

    eventConsole.innerHTML = text;

    for (var i in eventsCtrl) {
        eventsCtrl[i] = false;
    }

    eventsCtrl[evtID] = bActive;
}

function lose() {
    if (bMusic) {
        music.stop();

        sounds[1].play();
    }

    pause();

    paused = false;

    printEvent(0, true, "red", "Has perdido :(");

    let retryModal = document.getElementById("retry");
    if (!retryModal) return;
    retryModal.style.visibility = "visible";

    let eventsConsole = document.getElementById("events");
    if (!eventsConsole) return;
    eventsConsole.style.zIndex = "3";

    let eventsHUD = document.getElementById("eventsHUD");
    if (!eventsHUD) return;
    eventsHUD.style.zIndex = "3";
}
