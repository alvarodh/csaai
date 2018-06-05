function randomphoto () {
  jQuery_uses.randomPhoto();
  cronometro.stop();
  cronometro.restart();
  fotos.start();
  scores.printRecords();
  document.addEventListener("keyDown", keyMove);
}

var fotos = {
  sesion : {first : "0", second : "0", third : "0"},
  start : function () {
    var v = 0;
    for (var pos in this.sesion) {
      v++;
      do {
        this.sesion[pos] = Math.floor(Math.random() * 10) + 1;
      } while (this.repeat(pos));
      document.getElementById("img" + v).src = "images/" + this.sesion[pos] + ".jpg";
    }
  },
  repeat : function (pos) {
    var samefirst = this.sesion[pos] == this.sesion["first"];
    var samesecond = this.sesion[pos] == this.sesion["second"];
    switch (pos) {
      case "first":
        return false;
        break;
      case "second":
        return samefirst;
        break;
      case "third":
        return samefirst || samesecond;
    }
  }
}

function quadrant (keyCode) {
  switch (keyCode) {
    case 97:
      return "31";
      break;
    case 98:
      return "32";
      break;
    case 99:
      return "33";
      break;
    case 100:
      return "21";
      break;
    case 101:
      return "22";
      break;
    case 102:
      return "23";
      break;
    case 103:
      return "11";
      break;
    case 104:
      return "12";
      break;
    case 105:
      return "13";
      break;
    default:
      return;
  }
}

function keyMove (event) {
  var q = quadrant(event.keyCode);
  var around = {
    left : (parseInt(q) - 1).toString(),
    right : (parseInt(q) + 1).toString(),
    up : (parseInt(q) - 10).toString(),
    down : (parseInt(q) + 10).toString()
  };
  for (dir in around) {
    if (puzzle.tab.pieces[around[dir]] != undefined && around[dir] == puzzle.tab.free){
      puzzle.changeQuadrant(q, around[dir]);
    }
  }
  puzzle.drawPuzzle();
  puzzle.checkWin();
}
