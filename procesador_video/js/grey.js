function greyFilter () {
  for (var i = 0; i < imgData.new.data.length; i += 4) {
    var color = greyColor(imgData.old.data[i], imgData.old.data[i + 1], imgData.old.data[i + 2])
    imgData.new.data[i] = color;
    imgData.new.data[i + 1] = color;
    imgData.new.data[i + 2] = color;
  }
}

function greyColor (r, g, b) {
  return (r + g + b) / 3;
}

function createGreyButtons () {
  var div = document.getElementById("greyop");
  div.innerHTML = "<div class=greyoption>\
                     <button id=button onclick=greyFilter();drawNew();>Add</button> \
                   </div>";
}
