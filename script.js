// Language state
let currentLanguage = localStorage.getItem("language") || "en";

// Translation function
function t(key) {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

// Update DOM with translations
function updatePageLanguage() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const text = t(key);
    
    // Find and replace only the first text node, preserving nested elements
    let foundTextNode = false;
    for (let node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = text;
        foundTextNode = true;
        break;
      }
    }
    
    // If no text node exists, prepend as text node
    if (!foundTextNode) {
      el.textContent = text;
    }
  });
}

// Language toggle setup
const languageCheckbox = document.getElementById("language-checkbox");
languageCheckbox.checked = currentLanguage === "zh";
languageCheckbox.addEventListener("change", () => {
  currentLanguage = languageCheckbox.checked ? "zh" : "en";
  localStorage.setItem("language", currentLanguage);
  updatePageLanguage();
});

// Update page on load
updatePageLanguage();

// Dark/Light mode toggle
const body = document.body;
const checkbox = document.getElementById("theme-checkbox");
checkbox.addEventListener("change", () => {
  const theme = checkbox.checked ? "light" : "dark";
  body.setAttribute("data-theme", theme);
  // optional: redraw stars immediately
  drawStars();
});

// On load
const savedTheme = localStorage.getItem("theme");
if(savedTheme) {
  body.setAttribute("data-theme", savedTheme);
  checkbox.checked = savedTheme === "light";
}

// On change
checkbox.addEventListener("change", () => {
  const theme = checkbox.checked ? "light" : "dark";
  body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
});

// ===== Lightbox setup =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");
const leftArrow = document.querySelector(".lightbox .arrow.left");
const rightArrow = document.querySelector(".lightbox .arrow.right");
const artNameElem = document.querySelector(".lightbox-caption .art-name");
const artDescElem = document.querySelector(".lightbox-caption .art-desc");

// Gather artworks
const artworks = Array.from(document.querySelectorAll(".gallery-grid img")).map(img => ({
  src: img.src,
  alt: img.alt,
  name: img.getAttribute("data-name") || img.alt,
  desc: img.getAttribute("data-desc") || "",
  link: img.getAttribute("data-link") || ""
}));

let currentIndex = 0;

// ===== Functions =====
function showLightbox(index) {
  const art = artworks[index];
  lightbox.style.display = "flex";
  lightboxImg.src = art.src;
  lightboxImg.alt = art.alt;
  artNameElem.textContent = art.name;
  // Display description with clickable link if present
  if(art.link) {
    artDescElem.innerHTML = `${art.desc} <a href="${art.link}" target="_blank" rel="noopener">Link to Artist</a>`;
  } else {
    artDescElem.textContent = art.desc;
  }
  currentIndex = index; // important!
}

// Navigate lightbox
function showNext() { showLightbox((currentIndex + 1) % artworks.length); }
function showPrev() { showLightbox((currentIndex - 1 + artworks.length) % artworks.length); }

// ===== Event Listeners =====

// Open lightbox when clicking gallery image
document.querySelectorAll(".gallery-grid img").forEach((img, i) => {
  img.addEventListener("click", () => showLightbox(i));
});

// Close lightbox
closeBtn.addEventListener("click", () => lightbox.style.display = "none");
lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) lightbox.style.display = "none";
});

// Prevent clicking link from closing lightbox
artDescElem.addEventListener("click", e => e.stopPropagation());

// Arrow buttons
leftArrow.addEventListener("click", e => { e.stopPropagation(); showPrev(); });
rightArrow.addEventListener("click", e => { e.stopPropagation(); showNext(); });

// Keyboard navigation
document.addEventListener("keydown", e => {
  if(lightbox.style.display === "flex") {
    switch(e.key){
      case "ArrowLeft": showPrev(); break;
      case "ArrowRight": showNext(); break;
      case "Escape": lightbox.style.display = "none"; break;
    }
  }
});

// Smooth open/close animations for details
document.querySelectorAll("details.animated").forEach((details) => {
  const summary = details.querySelector("summary");
  const content = details.querySelector(".details-content");
  details.style.overflow = "hidden";
  summary.addEventListener("click", (e) => {
    e.preventDefault();
    if (details.open) {
      const height = content.offsetHeight;
      content.animate([{ height: height + "px" }, { height: "0px" }], { duration: 300, easing: "ease-in-out" }).onfinish = () => {
        details.open = false;
        content.style.height = "";
      };
    } else {
      details.open = true;
      const height = content.offsetHeight;
      content.style.height = "0px";
      content.animate([{ height: "0px" }, { height: height + "px" }], { duration: 300, easing: "ease-in-out" }).onfinish = () => {
        content.style.height = "";
      };
    }
  });
});

// Star background animation
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

function initStars() {
  stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      d: Math.random() * 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  const isLight = body.getAttribute("data-theme") === "light";
  const time = Date.now() * 0.002; // calculate once
  stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    const alpha = 0.5 + 0.5 * Math.sin(time + s.d * 10);
    ctx.fillStyle = isLight ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`;
    ctx.fill();

    s.x += s.dx;
    s.y += s.dy;
    if (s.x < 0) s.x = width;
    if (s.x > width) s.x = 0;
    if (s.y < 0) s.y = height;
    if (s.y > height) s.y = 0;
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  initStars();
});

initStars();
drawStars();
