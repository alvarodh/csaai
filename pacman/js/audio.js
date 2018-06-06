Pacman.Audio = function(game) {
  // variables audio
  var files          = [],
      endEvents      = [],
      progressEvents = [],
      playing        = [];

  function load(name, path, cb) { // cargar
    var f = files[name] = document.createElement("audio"); // crear elemento audio
    progressEvents[name] = function(event) {
      progress(event, name, cb); 
    };
    f.addEventListener("canplaythrough", progressEvents[name], true);
    f.setAttribute("preload", "true");
    f.setAttribute("autobuffer", "true");
    f.setAttribute("src", path);
    f.pause();
  };

  function progress(event, name, callback) {
    if (event.loaded === event.total && typeof callback === "function") {
      callback();
      files[name].removeEventListener("canplaythrough", progressEvents[name], true);
    }
  };

  function disableSound() { // quitar sonido
    for (var i = 0; i < playing.length; i++) {
      files[playing[i]].pause();
      files[playing[i]].currentTime = 0;
    }
    playing = [];
  };

  function ended(name) { // sonido acabado
    var i, tmp = [], found = false;
    files[name].removeEventListener("ended", endEvents[name], true);
    for (i = 0; i < playing.length; i++) {
      if (!found && playing[i]) {
        found = true;
      } else {
        tmp.push(playing[i]);
      }
    }
    playing = tmp;
  };

  function play(name) { // sonido de inicio
    if (!game.soundDisabled()) {
      endEvents[name] = function() { ended(name); };
      playing.push(name);
      files[name].addEventListener("ended", endEvents[name], true);
      files[name].play();
    }
  };

  function pause() { // sonido de pausa
    for (var i = 0; i < playing.length; i++) {
      files[playing[i]].pause();
    }
  };

  function resume() { // volver a empezar
    for (var i = 0; i < playing.length; i++) {
      files[playing[i]].play();
    }
  };

  return {
    "disableSound" : disableSound,
    "load"         : load,
    "play"         : play,
    "pause"        : pause,
    "resume"       : resume
  };
};
