var params = {
  container: document.querySelector("#lottie3"),
  renderer: "canvas",
  loop: true,
  autoplay: true,
  path: "static/json/graph.json",
};

var anim;

anim = lottie.loadAnimation(params);
