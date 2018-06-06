function rgbRed (op) {
  (op === "+") ? imgData.rgb[0] += 0.25 : imgData.rgb[0] -= 0.25;
  rgbFilter();
  drawNew();
}

function rgbGreen (op) {
  (op === "+") ? imgData.rgb[1] += 0.25 : imgData.rgb[1] -= 0.25;
  rgbFilter();
  drawNew();
}

function rgbBlue (op) {
  (op === "+") ? imgData.rgb[2] += 0.25 : imgData.rgb[2] -= 0.25;
  rgbFilter();
  drawNew();
}

function rgbFilter () {
  for (var i = 0; i < imgData.new.data.length; i += 4) {
    color = [
      (imgData.rgb[0] + 1) * imgData.new.data[i],
      (imgData.rgb[1] + 1) * imgData.new.data[i + 1],
      (imgData.rgb[2] + 1) * imgData.new.data[i + 2]
    ];
    imgData.new.data[i] = color[0];
    imgData.new.data[i + 1] = color[1];
    imgData.new.data[i + 2] = color[2];
  }
}

function createRgbButtons () {
  var div = document.getElementById("rgbop");
  div.innerHTML = "<div class=rgboption id=red>Red → \
                     <button id=button onclick=rgbRed('+')>+</button> \
                     <button id=button onclick=rgbRed('-')>-</button> \
                   </div> \
                   <div class=rgboption id=green>Green → \
                     <button id=button onclick=rgbGreen('+')>+</button> \
                     <button id=button onclick=rgbGreen('-')>-</button> \
                   </div> \
                   <div class=rgboption id=blue>Blue → \
                     <button id=button onclick=rgbBlue('+')>+</button> \
                     <button id=button onclick=rgbBlue('-')>-</button> \
                   </div>"
}
