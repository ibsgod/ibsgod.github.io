let jsondata = ""
let currSection = null
document.addEventListener("DOMContentLoaded", function () {
  fetch('text.json')
    .then(response => response.json())
    .then(data => {
      jsondata = data;
    });
})

function changeSection(text) {
  document.getElementById("fademain").animate([
    {
      opacity:0
    },
    {
      opacity:1
    }
  ], {
    duration: 1000,
  });
  currSection = text
  let sound = new Audio("block.mp3")
  sound.play();
  document.getElementById("section").innerText = text;
  let listMain = document.getElementsByClassName("hlist")[0]
  let mouse = document.getElementById("mouse")
  if (mouse) {
    document.getElementById("fademain").removeChild(document.getElementById("mouse"))
  }
  var arr = Array.prototype.slice.call(listMain.childNodes)
    arr.forEach(element => {
      listMain.removeChild(element)
    });
  for (let i = 0; i < jsondata[text].length; i++) {
    let newListItem = document.createElement("div")
    newListItem.classList.add("hlistitem")
    listMain.appendChild(newListItem)
    let newHeading = document.createElement("h3")
    newHeading.classList.add("listheading")
    let newTextNode = document.createTextNode(jsondata[text][i].title)
    newListItem.appendChild(newHeading)
    if (jsondata[text][i].link) {
      let newLink = document.createElement("a")
      newLink.appendChild(newTextNode)
      newHeading.appendChild(newLink)
      newLink.href = jsondata[text][i].link
    }
    else {
      newHeading.appendChild(newTextNode)
    }
    for (let j = 0; j < jsondata[text][i].points.length; j++) {
      let newPoint = document.createElement("p")
      newPoint.classList.add("itempoint")
      newTextNode = document.createTextNode(jsondata[text][i].points[j])
      newPoint.appendChild(newTextNode)
      newListItem.appendChild(newPoint)
    }
  }
}

function pointInBox(x, y, box) {
  if (x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h) {
    return true
  }
  return false
}

