var params = {
  container: document.querySelector("#lottie2"),
  renderer: "canvas",
  loop: true,
  autoplay: true,
  path: "static/json/Feature.json",
};

var anim;

anim = lottie.loadAnimation(params);
