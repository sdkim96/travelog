var params = {
    container: document.querySelector("#lottie6"),
    renderer: "canvas",
    loop: true,
    autoplay: true,
    path: "static/js/FAQ.json",
};

var anim;

anim = lottie.loadAnimation(params);
