/// <reference path="./index.html" />
/// <reference path="js/babylon.js" />
/// <reference path="js/Player.js" />
/// <reference path="js/Node.js" />
/// <reference path="js/Enemy.js" />
/// <reference path="js/LevelGrid.js" />
/// <reference path="js/Dog.js" />

/** @type {{getElementById: (id: string)=> any}} */
var doc = document;
var count = 420;
var counter;
var paused = false;
var bMusic = true;

function timer() {
    count = count - 1;
    if (count <= 10) {
        doc.getElementById("CTview").style.color = "red";
        printEvent(2, true, "red", "¡Ten cuidado!, ¡se agota el tiempo!");
    }
    if (count <= 0) {
        clearInterval(counter);
        lose();
    }
    /** @type {string | number} */
    var minutes = (count - (count % 60)) / 60;
    /** @type {string | number} */
    var seconds = count % 60;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    doc.getElementById("CTview").innerHTML = minutes + ":" + seconds; // watch for spelling
}

function pause() {
    if (!paused) {
        clearInterval(counter);
        paused = true;
        engine.stopRenderLoop();
        scene.activeCamera.detachControl(canvas);
        printEvent(0, true, "blue", "Juego en pausa");
    } else {
        counter = setInterval(timer, 1000);
        paused = false;
        engine.runRenderLoop(updater);
        scene.activeCamera.attachControl(canvas);
        printEvent(0, false, "#72005f", "Sin eventos");
    }
}

function gameStart() {
    counter = setInterval(timer, 1000);
    scene.setActiveCameraByName(player.followCamera.name);
    scene.activeCamera.attachControl(canvas);
    // Asignando listeners
    window.addEventListener("keydown", player.controlPressListener, false);
    window.addEventListener("keyup", player.controlLibereListener, false);

    doc.getElementById("livesHUD").style.visibility = "visible";
    doc.getElementById("timeHUD").style.visibility = "visible";
    doc.getElementById("pausaHUD").style.visibility = "visible";
    doc.getElementById("dogsHUD").style.visibility = "visible";
    doc.getElementById("eventsHUD").style.visibility = "visible";
    doc.getElementById("lives").style.visibility = "visible";
    doc.getElementById("dogs").style.visibility = "visible";
    doc.getElementById("countdown").style.visibility = "visible";
    doc.getElementById("events").style.visibility = "visible";

    doc.getElementById("nav-bar").style.visibility = "hidden";
    doc.getElementById("container").style.visibility = "hidden";
}

function restart() {
    music.stop();
    sounds[0].stop();
    sounds[1].stop();
    count = 450;
    doc.getElementById("retry").style.visibility = "hidden";
    doc.getElementById("events").style.zIndex = "0";
    doc.getElementById("eventsHUD").style.zIndex = "0";
    printEvent(0, false, "#72005f", "Libera a los perros sin que te atrapen");
    doc.getElementById("lives").style.height = "340px";
    doc.getElementById("dogs").style.height = "550px";
    //counter = setInterval(timer, 1000);
    startAnimals();

    doc.getElementById("CTview").style.color = "#72005f";

    doc.getElementById("livesHUD").style.visibility = "hidden";
    doc.getElementById("timeHUD").style.visibility = "hidden";
    doc.getElementById("pausaHUD").style.visibility = "hidden";
    doc.getElementById("dogsHUD").style.visibility = "hidden";
    doc.getElementById("eventsHUD").style.visibility = "hidden";
    doc.getElementById("lives").style.visibility = "hidden";
    doc.getElementById("dogs").style.visibility = "hidden";
    doc.getElementById("countdown").style.visibility = "hidden";
    doc.getElementById("events").style.visibility = "hidden";
    doc.getElementById("begin").innerHTML = "Cargando...";

    doc.getElementById("nav-bar").style.visibility = "visible";
    doc.getElementById("container").style.visibility = "visible";
}

function decreaseLife() {
    player.lives--;
    if (player.lives == 0) {
        lose();
        doc.getElementById("lives").style.height = "50px";
    } else {
        enemies[0].setFirstNode(nodes[11][5]);
        enemies[1].setFirstNode(nodes[21][3]);
        enemies[2].setFirstNode(nodes[26][6]);
        enemies[3].setFirstNode(nodes[42][14]);
        for (var i in enemies) {
            //enemies[i].route = null;
            enemies[i].isWatching = false;
            //enemys[i]
        }
        player.setActualNode(player.controlPoint);
        printEvent(0, false, "red", "Te atraparon, vuelve a intentarlo");
        doc.getElementById("lives").style.height = 340 - 136 / player.lives + "px";
    }
}
function reduceDogCount() {
    dogCount--;
    if (dogCount > 0) {
        var conteo = 6;
        conteo -= dogCount;
        printEvent(6, true, "green", "Has liberado un perro, faltan " + dogCount);
        doc.getElementById("dogs").style.height = 550 - (conteo * 420) / 6 + "px";
        if (dogCount == 5) {
            player.controlPoint = nodes[35][10];
        }
    } else {
        printEvent(6, true, "green", "Has liberado a todos, sal del lugar");
        doc.getElementById("dogs").style.height = "50px";
    }
}
function soundC() {
    if (bMusic) {
        bMusic = false;
        music.setVolume(0);
        for (let i = 0; i < sounds.length; i++) {
            sounds[i].setVolume(0);
        }
        doc.getElementById("sound").src = "images/HUD_sound2.png";
    } else {
        bMusic = true;
        music.setVolume(0.2);
        for (let i = 0; i < sounds.length; i++) {
            sounds[i].setVolume(1);
        }
        doc.getElementById("sound").src = "images/HUD_sound1.png";
    }
}
