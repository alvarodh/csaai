var MAIN;

function charge () {
  var videos_id = ["camera1", "camera2", "camera3", "camera4"],
      id = videos_id[Math.floor(Math.random() * 4)];
  document.getElementById("maincamera").src = document.getElementById(id).src;
  document.getElementById(id).style = "border: 10px solid #00FF00; width: 22.5%";
  MAIN = id;
}

function playPause () {
  var videos_id = ["maincamera", "camera1", "camera2", "camera3", "camera4"];
  for (var i = 0; i < videos_id.length; i++) {
    var video = document.getElementById(videos_id[i]);
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
  }
}

function makeMain (video) {
  var main = document.getElementById("maincamera");
  video.style = "border: 10px solid #00FF00; width: 22.5%";
  document.getElementById(MAIN).style = "border: 1px solid white; width: 20%";
  MAIN = video.id;
  main.src = video.src;
  main.currentTime = video.currentTime;
  if (!video.paused) {
    main.play();
  }
}

setInterval(clock, 1000);

function clock () {
  var c = document.getElementById(MAIN);
  var s = Math.floor(c.currentTime),
      div = document.getElementById("time");
  if (s < 10) {
    t = "00:00:0" + s;
  } else {
    if (s >= 60) {
      m = 0;
      do {
        m++;
        s -= 60;
      } while (s >= 60);
      if (m > 10) {
        if (s > 10) {
          t = "00:" + m + ":" + s;
        } else {
          t = "00:" + m + ":0" + s;
        }
      } else {
        if (s > 10) {
          t = "00:0" + m + ":" + s;
        } else {
          t = "00:0" + m + ":0" + s;
        }
      }
    } else {
      t = "00:00:" + s;
    }
  }
  div.innerHTML = t;
}
