$(document).ready(function () {
  $("html").animate({ scrollTop: 0 }, "slow"); // para IE, FF
  $("body").animate({ scrollTop: 0 }, "slow"); // Para Chrome
  document.oncontextmenu = function () {
    return false;
  };
});
var sonido = document.getElementById("sonido2");

function playVid() {
  sonido.play();
}

function pauseVid() {
  sonido.pause();
}
function des() {
  document.getElementById("intro").className = "desaparecer";
}
function sderecho() {
  document.getElementById("s-derecho").className = "efecto-derecha";
}
function sizquierdo() {
  document.getElementById("s-izquierdo").className = "efecto-izquierda";
}
function scroll() {
  document.getElementById("html").className = "con-scroll";
}

function funciones() {
  des();

  sderecho();

  sizquierdo();

  scroll();

  playVid();
}
const second = 1000,
  minute = second * 60,
  hour = minute * 60,
  day = hour * 24;

let countDown = new Date("May 23, 2026 15:00:00").getTime(),
  x = setInterval(function () {
    let now = new Date().getTime(),
      distance = countDown - now;

    (document.getElementById("days").innerText = Math.floor(distance / day)),
      (document.getElementById("hours").innerText = Math.floor(
        (distance % day) / hour
      )),
      (document.getElementById("minutes").innerText = Math.floor(
        (distance % hour) / minute
      )),
      (document.getElementById("seconds").innerText = Math.floor(
        (distance % minute) / second
      ));
  }, second);
wow = new WOW({
  animateClass: "animated",
  offset: 100,
  callback: function (box) {
    console.log("WOW: animating <" + box.tagName.toLowerCase() + ">");
  },
});
wow.init();
document.getElementById("moar").onclick = function () {
  var section = document.createElement("section");
  section.className = "section--purple wow fadeInDown";
  this.parentNode.insertBefore(section, this);
};

document.oncontextmenu = function () {
  return false;
};
