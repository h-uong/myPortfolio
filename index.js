const isMobile = window.matchMedia("(max-width: 768px)").matches;
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------------------
// NAV MENU TOGGLE
// ---------------------------

const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("nav-menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
  });
}

// ---------------------------
// TYPEWRITER / REVEAL
// ---------------------------

  const reveals = document.querySelectorAll(".type-reveal");

  const typeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { threshold: 0.6 });

  reveals.forEach(reveal => typeObserver.observe(reveal));


// ---------------------------
// RUNNER ANIMATION
// ---------------------------

const runner = document.getElementById("runnerImg");


if (runner) {
  const frames = [
    "./project-one/runningman00.svg",
    "./project-one/runningman02.svg",
    "./project-one/runningman03.svg"
  ];

  let i = 0;

  setInterval(() => {
    i = (i + 1) % frames.length;
    runner.src = frames[i];
  }, 150);
}

// ---------------------------
// DOG ANIMATION
// ---------------------------

const dog = document.getElementById("dogImg");

if (dog) {
  const frames = [
    "./project-four/Plato_Sit.svg",
    "./project-four/Plato_Sit_Excited.svg"
  ];

  let frame = 0;

  setInterval(() => {
    frame = (frame + 1) % frames.length;
    dog.src = frames[frame];
  }, 400);
}

// ---------------------------
// SUZE ANIMATION
// ---------------------------

document.addEventListener("DOMContentLoaded", () => {
  const suze = document.getElementById("suzeImg");
  if (!suze) return;

  const frames = [
    "./project-five/Croqui_Suze_Pose1.png",
    "./project-five/Croqui_Suze_Pose2.png",
    "./project-five/Croqui_Suze_Pose3.png",
    "./project-five/Croqui_Suze_Pose4.png"
  ];

  let frame = 0;

  setInterval(() => {
    frame = (frame + 1) % frames.length;
    suze.src = frames[frame];
  }, 400);
});

// ---------------------------
// SCROLL CARDS ANIMATION
// ---------------------------
const section = document.querySelector('.stack-section');
const cards = document.querySelectorAll('.card');

let ticking = false;
let displayedProgress = 0;
let currentProgress = 0;
let hoverTimeout = null;

// --- Helpers ---
function clamp(value, min, max){ return Math.max(min, Math.min(value, max)); }
function easeInOutCubic(t){ return t<0.5? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
function lerp(start, end, amount){ return start + (end-start)*amount; }

// --- Scroll animation ---
function updateAnimation(){
  const isMobile = window.innerWidth <= 768;
  if(isMobile) return;

  const rect = section.getBoundingClientRect();
  let rawProgress = 0;

  if(rect.top <=0 && rect.bottom >= window.innerHeight){
    const scrollRange = section.offsetHeight - window.innerHeight;
    rawProgress = -rect.top / scrollRange;
  } else if(rect.bottom < window.innerHeight *2){
    rawProgress = 1;
  }

  rawProgress = clamp(rawProgress,0,1);

  const expandPhase = 1;
  const mappedProgress = rawProgress <= expandPhase ? rawProgress/expandPhase : 1;
  const eased = easeInOutCubic(mappedProgress);

  displayedProgress = lerp(displayedProgress,eased,0.08);
  currentProgress = displayedProgress;

  animateCards(displayedProgress);
  ticking = false;
}

window.addEventListener('scroll', ()=>{
  if(!ticking){ requestAnimationFrame(updateAnimation); ticking = true; }
});

// --- Animate cards ---
function animateCards(progress){
  const isMobile = window.innerWidth <= 768;
  if(isMobile) return;

  const vw = window.innerWidth;

  // --- Dynamic spread multipliers based on screen width ---
  let spreadMultiplier = 1;
  if(vw < 1400) spreadMultiplier = 0.7;
  if(vw < 1200) spreadMultiplier = 0.55;
  if(vw < 992)  spreadMultiplier = 0.45;

  const baseMaxDistance = 700 * spreadMultiplier;
  const maxDistance = baseMaxDistance * progress;

  const transforms = [
    `translateX(0px) scale(1)`,                            // center
    `translateX(-${maxDistance*0.5}px) scale(${0.97+0.03*progress})`, // left inner
    `translateX(${maxDistance*0.5}px) scale(${0.97+0.03*progress})`,  // right inner
    `translateX(-${maxDistance}px) scale(${0.94+0.05*progress})`,     // left outer
    `translateX(${maxDistance}px) scale(${0.94+0.05*progress})`       // right outer
  ];

  cards.forEach((card,i)=>{
    card.dataset.baseTransform = transforms[i];
    if(!card.classList.contains("active-focus")){
      card.style.transform = transforms[i];
      card.style.zIndex = "";
    }
  });
}

// --- Hover / focus ---
function activateCard(index){
  const isMobile = window.innerWidth <= 768;
  if(isMobile) return;

  cards.forEach(c=>c.classList.remove("active-focus"));
  cards[index].classList.add("active-focus");

  const vw = window.innerWidth;

  // --- Hover multipliers adjust for smaller desktops ---
  let hoverMultiplier = 1;
  if(vw < 1400) hoverMultiplier = 1.3;
  if(vw < 1200) hoverMultiplier = 1.6;
  if(vw < 992)  hoverMultiplier = 2;

  const compressionAmount = 25 * displayedProgress;

  cards.forEach((other,i)=>{
    const base = other.dataset.baseTransform;
    if(i===index){
      let extraX = 0;
      if(index===3 || index===4){
        const baseExtra = 60;
        extraX = index===3 ? baseExtra*hoverMultiplier : -baseExtra*hoverMultiplier;
      }
      other.style.transform = `${base} translateX(${extraX}px) translateY(-25px) scale(${1+0.05*displayedProgress})`;
      other.style.zIndex = 20;
    } else {
      const direction = i<index?-1:1;
      other.style.transform = `${base} translateX(${direction*compressionAmount}px) scale(${0.95 - 0.03*displayedProgress})`;
      other.style.zIndex = 5;
    }
  });
}

function resetCards(){
  cards.forEach(c=>{
    c.classList.remove("active-focus");
    c.style.zIndex = "";
    c.style.transform = c.dataset.baseTransform;
  });
}

// --- Event listeners ---
cards.forEach((card,index)=>{
  card.addEventListener("mouseenter", ()=> hoverTimeout=setTimeout(()=>activateCard(index),120));
  card.addEventListener("mouseleave", ()=>{ clearTimeout(hoverTimeout); resetCards(); });
  card.addEventListener("focus", ()=>activateCard(index));
  card.addEventListener("blur", ()=>resetCards());
});

// --- Responsive resize ---
window.addEventListener("resize", ()=>{
  const isMobile = window.innerWidth <= 768;
  if(isMobile){
    cards.forEach((card,i)=>{
      card.style.transform = "translateX(0px) scale(1)";
      card.style.zIndex = i===4?10:"";
    });
  } else {
    animateCards(currentProgress);
  }
});

// --- Initial setup ---
animateCards(0);
