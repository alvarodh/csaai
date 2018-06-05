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
