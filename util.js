let jsondata = ""
let currSection = null
let activePopups = []; // Track active popups
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

// Inject rotating and expanding popup CSS if not already present
if (!document.getElementById('rotating-expanding-popup-style')) {
  const style = document.createElement('style');
  style.id = 'rotating-expanding-popup-style';
  style.textContent = `
    @keyframes rotateExpand {
      0% {
        transform: translateX(-50%) scale(1) rotate(0deg);
      }
      100% {
        transform: translateX(-50%) scale(1.2) rotate(360deg);
      }
    }
    .rotating-expanding-popup {
      animation: rotateExpand 3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      will-change: transform;
    }
  `;
  document.head.appendChild(style);
}

function showFact(goombaIndex) {

  
  const fact = jsondata["Other Facts"][goombaIndex].points[0];
  
  // Create popup element
  let popup = document.createElement("div");
  popup.className = 'rotating-expanding-popup';
  popup.style.cssText = `
    position: fixed;
    left: 50%;
    background: rgba(255, 255, 255, 0.95);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    font-family: 'YourFontName', Arial, sans-serif;
    font-size: 18px;
    color: #333;
    text-align: center;
    max-width: 300px;
    border: 2px solid #ddd;
    transition: top 0.3s ease, opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1);
    opacity: 0;
    transform: translateX(-50%) scale(1);
  `;
  
  popup.textContent = fact;
  
  document.body.appendChild(popup);
  activePopups.push(popup);
  updatePopupPositions();

  // Animate in (fade in)
  requestAnimationFrame(() => {
    popup.style.opacity = '1';
  });

  // Remove after 3 seconds with fade out
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
        const index = activePopups.indexOf(popup);
        if (index > -1) {
          activePopups.splice(index, 1);
        }
        updatePopupPositions();
      }
    }, 1200); // Wait for transition to finish
  }, 3000);
}

function updatePopupPositions() {
  const popupHeight = 80; // Approximate height of each popup
  const spacing = 20; // Space between popups
  const screenHeight = window.innerHeight;
  const totalHeight = activePopups.length * (popupHeight + spacing) - spacing; // Total height of all popups
  const startY = (screenHeight - totalHeight) / 2; // Center the stack vertically
  
  activePopups.forEach((popup, index) => {
    const newTop = startY + (index * (popupHeight + spacing));
    popup.style.top = newTop + 'px';
    // Always keep both translateX and scale
    const scale = popup.style.opacity === '1' ? 1 : 0.8;
    popup.style.transform = `translateX(-50%) scale(${scale})`;
  });
}

