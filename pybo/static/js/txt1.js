var scrollTop;

// delay 초 후에 active 시킨다.
function JhsAppear__setTimeActive($node) {
  var delay = $node.attr("data-jhs-appear-delay");
  delay = delay ? parseInt(delay) : 1;

  setTimeout(function () {
    if ($node.hasClass("jhs-appear-found")) {
      $node.addClass("jhs-appear-active");
    } else {
      $node.removeClass("jhs-appear-active");
    }
  }, delay);
}

// jhs appear 엘리먼트 발견 콜백
function JhsAppear__onFound($node) {}

// jhs appear 엘리먼트들 초기화
function JhsAppear__init() {
  var $jhsAppearEl = $(".jhs-appear");

  setInterval(function () {
    scrollTop = $(window).scrollTop();
    var scrollHeight = $("body").prop("scrollHeight");
    var windowHeight = $(window).height();

    $jhsAppearEl.each(function (index, node) {
      var $node = $(node);

      var jhsAppearTriggerElSelector = $node.attr("data-jhs-appear-trigger-el");
      var $jhsAppearTriggerEl = jhsAppearTriggerElSelector
        ? $(jhsAppearTriggerElSelector)
        : $node;

      var jhsAppearTriggerElAddiTop = $node.attr(
        "data-jhs-appear-trigger-el-addi-top"
      );

      jhsAppearTriggerElAddiTop = jhsAppearTriggerElAddiTop
        ? jhsAppearTriggerElAddiTop
        : "0";

      if (jhsAppearTriggerElAddiTop.indexOf("% of window height") !== false) {
        jhsAppearTriggerElAddiTop =
          jhsAppearTriggerElAddiTop.split("% of window height");
        jhsAppearTriggerElAddiTop = jhsAppearTriggerElAddiTop[0];
        jhsAppearTriggerElAddiTop =
          (windowHeight * parseInt(jhsAppearTriggerElAddiTop)) / 100;
      } else {
        jhsAppearTriggerElAddiTop = parseInt(jhsAppearTriggerElAddiTop);
      }

      var top = $jhsAppearTriggerEl.offset().top;

      var condi = scrollTop + windowHeight > top + jhsAppearTriggerElAddiTop;

      if ($node.hasClass("jhs-appear-active-only-visible")) {
        condi =
          condi &&
          scrollTop + windowHeight <
            top + jhsAppearTriggerElAddiTop + windowHeight;
      }

      if (condi) {
        if ($node.hasClass("jhs-appear-found") === false) {
          JhsAppear__onFound($node);

          $node.addClass("jhs-appear-found");
          JhsAppear__setTimeActive($node);
        }
      } else {
        if (
          $node.hasClass("jhs-appear-found") &&
          $node.hasClass("jhs-appear") === false
        ) {
          $node.removeClass("jhs-appear-found");
          $node.removeClass("jhs-appear-active");
        }
      }
    });
  }, 200);
}

$(function () {
  JhsAppear__init();
});
