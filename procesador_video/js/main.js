window.onload = function () {
  createHTML();
  $(document).ready(function () {
    $("#container").hide();
    $("#play").hide();
    $("#video").hide();
    $("#getframe").hide();
    $("#select").hide();
  });
}

function putVideo (poster) {
  var video = document.getElementById("video");
  video.src = "video/" + poster.id + ".mp4";
  video.poster = poster.src;
  var style = getStyle(poster.id);
  document.getElementById("style").innerHTML = style;
  $(document).ready(function () {
    $("#video").show();
    $("#getframe").show();
    $("#posters").hide();
    $("#select").show();
  });
}

function getStyle (id) {
  var cssfile;
  switch(id) {
    case "moomen":
      cssfile = "rickymorty.css";
      break;
    case "muerteporkiki":
      cssfile = "futurama.css";
      break;
    case "thesimpsons":
      cssfile = "thesimpsons.css";
      break;
    default:
      return;
  }
  return "<link rel=stylesheet href=css/" + cssfile + ">";
}

function reset () {
  video.pause();
  video.currentTime = 0;
  document.getElementById("style").innerHTML = "";
  $(document).ready(function () {
    $("#container").hide();
    $("#getframe").hide();
    $("#posters").show();
    $("#select").hide();
    $("#video").hide();
    $("#play").hide();
  });
}

var imgData = {
  old : [],
  new : [],
  rgb : [],
  hsl : [],
  canvas : null,
  ctx : null
}

function init () {
  imgData.canvas = document.getElementById("canvas");
  imgData.ctx = canvas.getContext("2d");
  imgData.ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  imgData.old = imgData.ctx.getImageData(0, 0, canvas.width, canvas.height);
  imgData.new = imgData.ctx.getImageData(0, 0, canvas.width, canvas.height);
  imgData.rgb = [0, 0, 0];
  imgData.hsl = [0, 0, 0];
}

function getFrame () {
  var video = document.getElementById("video");
  video.pause();
  init();
  $(document).ready(function () {
    $("#container").show();
    $("#play").show();
    $("#video").hide();
    $("#getframe").hide();
    $(".rgboption").hide();
    $(".hsloption").hide();
    $(".greyoption").hide();
  });
}

function play () {
  $(document).ready(function () {
    $("#video").show();
    $("#getframe").show();
    $("#container").hide();
    $("#play").hide();
  });
  video.play();
}

function greyScale () {
  $(document).ready(function () {
    $(".rgboption").hide();
    $(".hsloption").hide();
    $(".greyoption").show();
  });
}

function rgbScale () {
  $(document).ready(function () {
    $(".rgboption").show();
    $(".hsloption").hide();
    $(".greyoption").hide();
  });
}

function hsl () {
  $(document).ready(function () {
    $(".rgboption").hide();
    $(".hsloption").show();
    $(".greyoption").hide();
  });
}

function chroma () {
  $(document).ready(function () {
    $(".rgboption").hide();
    $(".hsloption").hide();
    $(".greyoption").hide();
  });
}

function drawNew () {
  imgData.ctx.clearRect(0, 0, imgData.canvas.width, imgData.canvas.height);
  imgData.ctx.putImageData(imgData.new, 0, 0);
}

function returnOriginal () {
  var video = document.getElementById("video");
  imgData.ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  imgData.old = imgData.ctx.getImageData(0, 0, canvas.width, canvas.height);
  imgData.new = imgData.ctx.getImageData(0, 0, canvas.width, canvas.height);
  imgData.rgb = [0, 0, 0];
  imgData.hsl = [0, 0, 0];
}

function createHTML () {
  containerHTML();
  postersHTML();
  mainButtonsHTML();
  createRgbButtons();
  createHslButtons();
  createGreyButtons();
}

function postersHTML () {
  var div = document.getElementById("posters");
  div.innerHTML = "<p>Select any video:</p> \
                   <img class=poster id=moomen src=images/rickymorty.jpg onclick=putVideo(this)>\
                   <img class=poster id=muerteporkiki src=images/futurama.jpg onclick=putVideo(this)> \
                   <img class=poster id=thesimpsons src=images/thesimpsons.jpg onclick=putVideo(this)>";
}

function mainButtonsHTML () {
  var div = document.getElementById("mainbuttons");
  div.innerHTML = "<button id=play onclick=play()>Play</button> \
                   <button id=select onclick=reset()>Select another video</button> \
                   <video id=video src=# poster=# controls></video> \
                   <button id=getframe onclick=getFrame()>Get Frame</button>";
}   

function containerHTML () {
  var div = document.getElementById("container");
  div.innerHTML = "<canvas id=canvas></canvas> \
                   <button class=option onclick=greyScale()>Grey</button> \
                   <button class=option onclick=rgbScale()>RGB</button> \
                   <button class=option onclick=hsl()>HSL</button> \
                   <button class=option onclick=chroma()>Chroma</button> \
                   <span id=rgbop></span> \
                   <span id=hslop></span> \
                   <span id=greyop></span> \
                   <button id=return onclick=returnOriginal()>Return Original</button>";
}
