var params = {
  container: document.querySelector("#lottie6"),
  renderer: "canvas",
  loop: true,
  autoplay: true,
  path: "static/json/FAQ.json",
};

var anim;

anim = lottie.loadAnimation(params);
