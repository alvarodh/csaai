var PACMAN = (function () {

  var state        = WAITING, // estado de la partida
      audio        = null,
      ghosts       = [],
      ghostSpecs   = ["red"],
      allGhosts    = ["red", "green", "orange", "purple", "lime", "blue", "brown", "pink", "dodgerblue", "black", "transparent", "yellow"],
      eatenCount   = 0, // fantasmas comidos
      level        = 0,
      tick         = 0,
      ghostPos, // posicion fantasma
      userPos, // posicion usuario
      stateChanged = true, // cambio de estado
      timerStart   = null,
      lastTime     = 0,
      ctx          = null,
      timer        = null,
      map          = null,
      user         = null,
      stored       = null,
      show_scores  = false;

  function getTick() {
    return tick;
  };

  function drawScore(text, position) {
    ctx.fillStyle = "yellow";
    ctx.fillText(text, (position["new"]["x"] / 10) * map.blockSize, ((position["new"]["y"] + 5) / 10) * map.blockSize);
  }

  function dialog(text, font) { // comentario dentro del tablero
    ctx.fillStyle = "yellow";
    ctx.font      = "20px " + font;
    var width = ctx.measureText(text).width + 10,
        x     = ((map.width * map.blockSize) - width) / 2;
    ctx.fillText(text, x, (map.height * 6.5));
  }

  function soundDisabled() { // apagar sonido
    return localStorage["soundDisabled"] === "true";
  };

  function startLevel(new_level) { // comenzar partida/nivel
    user.resetPosition();
    if (level <= allGhosts.length && level !== 1 && new_level) {
      ghostSpecs.push(allGhosts[level - 1]);
      var ghost = new Pacman.Ghost({
        "getTick" : getTick
      }, map, ghostSpecs[level - 1]);
      ghosts.push(ghost);
    }
    for (var i = 0; i < ghosts.length; i++) {
      ghosts[i].reset();
    }
    audio.play("start"); // audio de inicio
    timerStart = tick;
    setState(COUNTDOWN); // cambiar estado cuenta atras
  };

  function startNewGame() {
    setState(WAITING);
    level = 1;
    user.reset();
    map.reset();
    map.draw(ctx);
    startLevel(true);
  };

  function keyDown(e) {
    if (e.keyCode === KEY.N && state !== PLAYING) { // comenzar partida
      startNewGame();
    } else if (e.keyCode === KEY.M) { // mutear
      mute();
    } else if (e.keyCode === KEY.P && state === PAUSE) { // quitar pausa
      endPause();
    } else if (e.keyCode === KEY.P) { // pausar
      pause();
    } else if (e.keyCode === KEY.R && show_scores) { // ocultar records
      scores.hideScores();
      show_scores = false;
    } else if (e.keyCode === KEY.R && state !== PLAYING && state !== COUNTDOWN) { // mostrar records
      scores.showScores();
      show_scores = true;
    } else if (state !== PAUSE) { // movimiento de usuario
      return user.keyDown(e);
    }
      return true;
  };

  function pause() { // pausar
    stored = state;
    setState(PAUSE);
    audio.pause();
    map.draw(ctx);
    dialog("paused", "pacman-font"); // escribir en tablero
    crono.stop();
  };

  function endPause() { // acabar pausa
    audio.resume();
    map.draw(ctx);
    setState(stored);
    crono.start();
  };

  function mute() { // mutear
    audio.disableSound();
    localStorage["soundDisabled"] = !soundDisabled();
  };

  function loseLife() { // perder vida
    setState(WAITING);
    user.loseLife();
    if (user.getLives() > 0) { // continuar jugando
      crono.stop();
      startLevel(false);
    } else { // acabar partida
      endGame();
      crono.restart();
    }
  };

  function endGame() { // acabar partida
    $(document).ready(function () { // jquery
      $("#crono").hide();
      $("#pacman").hide();
      $("#controls").hide();
      $("#name").show();
    });
    var time = crono.getTime();
    var score = user.theScore();
    scores.saveScore(score, time, level); // guardar record
    charge(); // reiniciar
  }

  function setState(nState) { // cambiar estado
    state = nState;
    stateChanged = true;
  };

  function collided(user, ghost) { // colision
    return (Math.sqrt(Math.pow(ghost.x - user.x, 2) + Math.pow(ghost.y - user.y, 2))) < 10;
  };

  function drawFooter() { // dibujar parte de abajo del tablero
    var topLeft  = (map.height * map.blockSize),
    textBase = topLeft + 17;
    ctx.fillStyle = "black";
    ctx.fillRect(0, topLeft, (map.width * map.blockSize), 30);
    ctx.fillStyle = "yellow";
    for (var i = 0; i < user.getLives(); i++) { // dibujar tantos pacman como vidas tenga
      ctx.fillStyle = PACMAN_COLOUR;
      ctx.beginPath();
      ctx.moveTo(150 + (25 * i) + map.blockSize / 2, (topLeft + 1) + map.blockSize / 2);
      ctx.arc(150 + (25 * i) + map.blockSize / 2, (topLeft + 1) + map.blockSize / 2,
      map.blockSize / 2, Math.PI * 0.25, Math.PI * 1.75, false);
      ctx.fill();
    }
    ctx.fillStyle = !soundDisabled() ? "green" : "red"; // si esta muteado se pone rojo, si no verde
    ctx.font = "16px pacman-font";
    ctx.fillText("s", 10, textBase);
    ctx.fillStyle = "yellow";
    ctx.font = "14px monospace";
    ctx.fillText("SCORE: " + user.theScore(), 30, textBase); // puntuacion
    ctx.fillText("LEVEL: " + level, 260, textBase); // nivel
  }

  function redrawBlock(pos) { // borrar mapa y objetos [dejar solo en tablero]
    map.drawBlock(Math.floor(pos.y / 10), Math.floor(pos.x / 10), ctx);
    map.drawBlock(Math.ceil(pos.y / 10), Math.ceil(pos.x / 10), ctx);
  }

  function mainDraw() { // dibujar todo
    var diff, u, i, len, nScore;
        ghostPos = []; // variables para el dibujo
    for (i = 0, len = ghosts.length; i < len; i++) {
      ghostPos.push(ghosts[i].move(ctx)); // añadir movimiento de fantasma
    }
    u = user.move(ctx); // movimiento de usuario
    for (i = 0, len = ghosts.length; i < len; i++) {
      redrawBlock(ghostPos[i].old); // borrar fantasmas
    }
    redrawBlock(u.old); // borrar posicion antigua de usuario
    for (i = 0, len = ghosts.length; i < len; i++) {
      ghosts[i].draw(ctx); // dibujar fantasma
    }
    user.draw(ctx); // dibujar usuario
    userPos = u["new"]; // cambiar posicion
    for (i = 0, len = ghosts.length; i < len; i++) {
      if (collided(userPos, ghostPos[i]["new"])) { // comprobar colisiones
        if (ghosts[i].isVunerable()) { // si se puede comer al fantasma
          audio.play("eatghost");
          ghosts[i].eat();
          eatenCount++;
          nScore = eatenCount * 50;
          drawScore(nScore, ghostPos[i]);
          user.addScore(nScore);
          setState(EATEN_PAUSE); // cambio de estado
          timerStart = tick;
        } else if (ghosts[i].isDangerous()) { // si no se puede comer al fantasma
          audio.play("die");
          setState(DYING); // cambio de estado
          timerStart = tick;
        }
      }
    }
  };

  function mainLoop() { // bucle principal
    var diff;
    if (state !== PAUSE) { // no esta en pausa
      ++tick;
    }
    map.drawPills(ctx); // dibujar bolitas del tablero
    if (state === PLAYING) {
      mainDraw(); // dibujar todo
    } else if (state === WAITING && stateChanged) { // al comienzo de la partida
      stateChanged = false;
      map.draw(ctx);
      dialog("get ready", "pacman-font");
    } else if (state === EATEN_PAUSE && (tick - timerStart) > (Pacman.FPS / 3)) { // comenzar partida
      map.draw(ctx);
      setState(PLAYING);
    } else if (state === DYING) {
      if (tick - timerStart > (Pacman.FPS * 2)) {
        loseLife(); // perder vida
      } else {
        redrawBlock(userPos); // borrar posicion de usuario
        for (i = 0; i < ghosts.length; i++) {
          redrawBlock(ghostPos[i].old); // borrar posicion de fantasma
          ghostPos.push(ghosts[i].draw(ctx)); // colocar fantasma en posicion inicial
        }
        user.drawDead(ctx, (tick - timerStart) / (Pacman.FPS * 2)); // dibujar muerte de usuario
      }
    } else if (state === COUNTDOWN) { // cuenta atras
      diff = 5 + Math.floor((timerStart - tick) / Pacman.FPS);
      if (diff === 0) { // si se acaba la cuenta atras
        map.draw(ctx);
        setState(PLAYING); // cambia estado
        crono.start();
      } else { // cuenta atras
        if (diff !== lastTime) {
          lastTime = diff;
          map.draw(ctx);
          dialog("Starting in: " + diff, "monospace");
        }
      }
    }
    drawFooter(); // dibujar
  }

  function eatenPill() { // comer bola gorda
    audio.play("eatpill");
    timerStart = tick;
    eatenCount = 0;
    for (i = 0; i < ghosts.length; i++) {
      ghosts[i].makeEatable(ctx); // cambiar color de los fantasmas
    }
  };

  function completedLevel() { // nivel completado
    setState(WAITING); // estado de espera
    level++;
    map.reset(); // reseteo de nivel
    user.newLevel(); // reseteo de usuario
    crono.stop(); // parar crono
    startLevel(true); // comenzar nivel
  };

  function keyPress(e) { // si se mantiene pulsada una tecla
    if (state !== WAITING && state !== PAUSE) {
      e.preventDefault();
      e.stopPropagation(); // evita que se cuenten todas las teclas, es decir, se cuenta solo una
    }
  };

  function init(wrapper, root) { // crar pacman
    var i, len, ghost,
        blockSize = wrapper.offsetWidth / 19, // tamaño bloque
        canvas = document.getElementById("canvas");
        canvas.setAttribute("width", (blockSize * 19) + "px");
        canvas.setAttribute("height", (blockSize * 22) + 30 + "px");
        wrapper.appendChild(canvas);
    ctx  = canvas.getContext('2d');
    // crear objetos de partida
    audio = new Pacman.Audio({
      "soundDisabled" : soundDisabled
    });
    map   = new Pacman.Map(blockSize);
    user  = new Pacman.User({
      "completedLevel" : completedLevel,
      "eatenPill"      : eatenPill,
      "allPills"       : 182
    }, map);
    crono = new Pacman.Crono();
    crono.create("crono");
    scores = new Pacman.Scores();
    for (i = 0; i < ghostSpecs.length; i++) {
      ghost = new Pacman.Ghost({
        "getTick" : getTick
      }, map, ghostSpecs[i]);
      ghosts.push(ghost);
    }
    map.draw(ctx); // dibujar mapa
    dialog("loading ...", "pacman-font");
    var extension = Modernizr.audio.ogg ? 'ogg' : 'mp3'; // posibles extensiones
    var audio_files = [
      ["start", root + "audio/opening_song." + extension],
      ["die", root + "audio/die." + extension],
      ["eatghost", root + "audio/eatghost." + extension],
      ["eatpill", root + "audio/eatpill." + extension],
      ["eating", root + "audio/eating.short." + extension],
      ["eating2", root + "audio/eating.short." + extension]
    ];
    load(audio_files, function() { loaded(); });
  };

  function load(arr, callback) { // cargar
    if (arr.length === 0) {
      callback();
    } else {
      var x = arr.pop();
      audio.load(x[0], x[1], function() { load(arr, callback); });
    }
  };

  function loaded() { // una vez cargado
    document.addEventListener("keydown", keyDown, true);
    document.addEventListener("keypress", keyPress, true);
    timer = window.setInterval(mainLoop, 1000 / Pacman.FPS);
  };

  return {
    "init" : init
  };

}());

Object.prototype.clone = function () { // creacion de objeto
  var i, newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i === 'clone') {
      continue;
    }
    if (this[i] && typeof this[i] === "object") {
      newObj[i] = this[i].clone();
    } else {
      newObj[i] = this[i];
    }
  }
  return newObj;
};
