Pacman.Ghost = function (game, map, colour) {
  // variables
  var position  = null,
      direction = null,
      eatable   = null,
      eaten     = null,
      due       = null;

  function getNewCoord(dir, current) { // movimiento
    var speed  = isVunerable() ? 1 : isHidden() ? 4 : 2, xSpeed = (dir === LEFT && -speed || dir === RIGHT && speed || 0), ySpeed = (dir === DOWN && speed || dir === UP && -speed || 0);
    return {
      "x": addBounded(current.x, xSpeed),
      "y": addBounded(current.y, ySpeed)
    };
  };

  function addBounded(x1, x2) {
    var rem    = x1 % 10,
        result = rem + x2;
    if (rem !== 0 && result > 10) {
      return x1 + (10 - rem);
    } else if(rem > 0 && result < 0) {
      return x1 - rem;
    }
    return x1 + x2;
  };

  function isVunerable() { // se le puede comer
    return eatable !== null;
  };

  function isDangerous() { // no se le puede comer
    return eaten === null;
  };

  function isHidden() { // se le han comido
    return eatable === null && eaten !== null;
  };

  function getRandomDirection() { // direccion random
    var moves = (direction === LEFT || direction === RIGHT) ? [UP, DOWN] : [LEFT, RIGHT];
    return moves[Math.floor(Math.random() * 2)];
  };

  function reset() { // reseteo
    eaten = null;
    eatable = null;
    position = {"x": 90, "y": 80};
    direction = getRandomDirection();
    due = getRandomDirection();
  };

  function onWholeSquare(x) {
    return x % 10 === 0;
  };

  function oppositeDirection(dir) { // cambio de direccion
    return dir === LEFT && RIGHT || dir === RIGHT && LEFT || dir === UP && DOWN || UP;
  };

  function makeEatable() { // al comerse el usuario una bola grande
    direction = oppositeDirection(direction);
    eatable = game.getTick();
  };

  function eat() { // se le comen
    eatable = null;
    eaten = game.getTick();
  };

  function pointToCoord(x) {
    return Math.round(x / 10);
  };

  function nextSquare(x, dir) {
    var rem = x % 10;
    if (rem === 0) {
      return x;
    } else if (dir === RIGHT || dir === DOWN) {
      return x + (10 - rem);
    } else {
      return x - rem;
    }
  };

  function onGridSquare(pos) {
    return onWholeSquare(pos.y) && onWholeSquare(pos.x);
  };

  function secondsAgo(tick) {
    return (game.getTick() - tick) / Pacman.FPS;
  };

  function getColour() { // cambiar color dependiendo del estado
    if (eatable) {
      if (secondsAgo(eatable) > 5) {
        return game.getTick() % 20 > 10 ? "#FFFFFF" : "#0000BB";
      } else {
        return "#0000BB";
      }
    } else if(eaten) {
      return "#222";
    }
    return colour;
  };

  function draw(ctx) { // dibujar
    var s    = map.blockSize,
        top  = (position.y / 10) * s,
        left = (position.x / 10) * s;
    if (eatable && secondsAgo(eatable) > 8) { // si han pasado mas de 8 segundos, vuelve a ser peligroso
      eatable = null;
    }
    if (eaten && secondsAgo(eaten) > 3) { // si han pasado 3 segundos desde que se lo comieron, vuelve a ser peligroso
      eaten = null;
    }
    var tl = left + s;
    var base = top + s - 3;
    var inc = s / 10;
    var high = game.getTick() % 10 > 5 ? 3  : -3;
    var low  = game.getTick() % 10 > 5 ? -3 : 3;
    // dibujar fantasma
    ctx.fillStyle = getColour();
    ctx.beginPath();
    ctx.moveTo(left, base);
    ctx.quadraticCurveTo(left, top, left + (s / 2),  top); // parte de abajo
    ctx.quadraticCurveTo(left + s, top, left + s,  base);
    for (var i = 1; i < 6; i++) {
      var par   = 2 * i,
          impar = (2 * i) - 1;
      if (i % 2 === 0) {
        ctx.quadraticCurveTo(tl - (inc * impar), base + low, tl - (inc * par),  base);
      } else {
        ctx.quadraticCurveTo(tl - (inc * impar), base + high, tl - (inc * par),  base);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "#FFF";
    ctx.arc(left + 6, top + 6, s / 6, 0, 300, false);
    ctx.arc((left + s) - 6, top + 6, s / 6, 0, 300, false);
    ctx.closePath();
    ctx.fill();
    var f = s / 12;
        off = {};
    off[RIGHT] = [f, 0];
    off[LEFT]  = [-f, 0];
    off[UP]    = [0, -f];
    off[DOWN]  = [0, f];
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.arc(left + 6 + off[direction][0], top + 6 + off[direction][1], s / 15, 0, 300, false);
    ctx.arc((left + s) - 6 + off[direction][0], top + 6 + off[direction][1], s / 15, 0, 300, false);
    ctx.closePath();
    ctx.fill();
  };

  function pane(pos) {
    if (pos.y === 100 && pos.x >= 190 && direction === RIGHT) {
      return {
        "y": 100,
        "x": -10
      };
    }
    if (pos.y === 100 && pos.x <= -10 && direction === LEFT) {
      return position = {
        "y" : 100,
        "x" : 190
      };
    }
    return false;
  };

  function move(ctx) { // mover
    var oldPos = position,
        onGrid = onGridSquare(position),
        npos   = null;
    if (due !== direction) {
      npos = getNewCoord(due, position);
      if (onGrid && map.isFloorSpace({"y" : pointToCoord(nextSquare(npos.y, due)), "x" : pointToCoord(nextSquare(npos.x, due))})) {
        direction = due;
      } else {
        npos = null;
      }
    }
    if (npos === null) {
      npos = getNewCoord(direction, position);
    }
    if (onGrid && map.isWallSpace({"y" : pointToCoord(nextSquare(npos.y, direction)), "x" : pointToCoord(nextSquare(npos.x, direction))})) {
      due = getRandomDirection();
    return move(ctx);
    }
    position = npos;
    var tmp = pane(position);
    if (tmp) {
      position = tmp;
    }
    due = getRandomDirection();
    return {
      "new" : position,
      "old" : oldPos
    };
  };

  return {
    "eat"         : eat,
    "isVunerable" : isVunerable,
    "isDangerous" : isDangerous,
    "makeEatable" : makeEatable,
    "reset"       : reset,
    "move"        : move,
    "draw"        : draw
  };
};
