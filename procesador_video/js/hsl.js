function hslHue (op) {
  (op === "+") ? imgData.hsl[0] += 0.1 : imgData.hsl[0] -= 0.1;
  hslFilter();
}

function hslSaturation (op) {
  (op === "+") ? imgData.hsl[1] += 0.1 : imgData.hsl[1] -= 0.1;
  hslFilter();
}

function hslLightness (op) {
  (op === "+") ? imgData.hsl[2] += 0.1 : imgData.hsl[2] -= 0.1;
  hslFilter();
}

function hslFilter () {
  var datahsl = rgbToHsl();
  for (var i = 0; i < datahsl.length; i++) {
    datahsl[i][0] += imgData.hsl[0];
    datahsl[i][1] += imgData.hsl[1];
    datahsl[i][2] += imgData.hsl[2];
  }
  transform(datahsl);
  drawNew();
}

function transform (hsl) {
  var list = hslToRgb(hsl);
  for (var i = 0; i < imgData.new.data.length; i += 4) {
    imgData.new.data[i] = list[i];
    imgData.new.data[i + 1] = list[i + 1];
    imgData.new.data[i + 2] = list[i + 2];
  }
}


function hslToRgb (hsl) {
  var list = [];
  for (var i = 0; i < hsl.length; i++) {
    var rgb = pxtorgb(hsl[i][0], hsl[i][1], hsl[i][2]);
    list.push(rgb[0]);
    list.push(rgb[1]);
    list.push(rgb[2]);
    list.push(255);
  }
  return list;
}

function pxtorgb(h, s, l) {
  var r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3){
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    }
    var q = (l < 0.5) ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

function rgbToHsl () {
  var list = [];
  for (var i = 0; i < imgData.old.data.length; i += 4) {
    list.push(pxtohsl(imgData.old.data[i], imgData.old.data[i + 1], imgData.old.data[i + 2]));
  }
  return list;
}

function pxtohsl (r, g, b) {
  r /= 255,
  g /= 255,
  b /= 255;
  var max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      h,
      s,
      l = (max + min) / 2;
  if (max === min) {
    h = 0;
    s = 0
  } else {
    var d = max - min;
    s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        //
    }
    h /= 6;
  }
  return [h, s, l];
}

function createHslButtons () {
  var div = document.getElementById("hslop");
  div.innerHTML = "<div class=hsloption id=red> \
                     Hue → \
                     <button id=button onclick=hslHue('+')>+</button> \
                     <button id=button onclick=hslHue('-')>-</button> \
                   </div> \
                   <div class=hsloption id=green> \
                     Saturation → \
                     <button id=button onclick=hslSaturation('+')>+</button> \
                     <button id=button onclick=hslSaturation('-')>-</button> \
                   </div> \
                   <div class=hsloption id=blue> \
                     Lightness → \
                     <button id=button onclick=hslLightness('+')>+</button> \
                     <button id=button onclick=hslLightness('-')>-</button> \
                  </div>"
}
