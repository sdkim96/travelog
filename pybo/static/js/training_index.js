(function () {
  const slideList = document.querySelector('.slide_list');  // Slide parent dom
  const slideList2 = document.querySelector('.slide_list2');  // Slide parent dom

  const slideContents = document.querySelectorAll('.slide_content');  // each slide dom
  const slideContents2 = document.querySelectorAll('.slide_content2');  // each slide dom

  const slideBtnNext = document.querySelector('.slide_btn_next'); // next button
  const slideBtnPrev = document.querySelector('.slide_btn_prev'); // prev button

  const slideBtnNext2 = document.querySelector('.slide_btn_next2'); // next button
  const slideBtnPrev2 = document.querySelector('.slide_btn_prev2'); // prev button
  
  const pagination = document.querySelector('.slide_pagination');
  const pagination2 = document.querySelector('.slide_pagination2');

  const slideLen = slideContents.length;  // slide length
  const slideWidth = 400; // slide width
  const slideSpeed = 300; // slide speed
  const startNum = 0; // initial slide index (0 ~ 4)

  const startNum2 = 0; // initial slide index (0 ~ 4)
  
  slideList.style.width = slideWidth * (slideLen + 2) + "px";
  slideList2.style.width = slideWidth * (slideLen + 2) + "px";
  
  // Copy first and last slide
  let firstChild = slideList.firstElementChild;
  let lastChild = slideList.lastElementChild;
  let clonedFirst = firstChild.cloneNode(true);
  let clonedLast = lastChild.cloneNode(true);

  // Copy first and last slide 2
  let firstChild2 = slideList2.firstElementChild;
  let lastChild2 = slideList2.lastElementChild;
  let clonedFirst2 = firstChild2.cloneNode(true);
  let clonedLast2 = lastChild2.cloneNode(true);

  // Add copied Slides
  slideList.appendChild(clonedFirst);
  slideList.insertBefore(clonedLast, slideList.firstElementChild);

  // Add copied Slides 2
  slideList2.appendChild(clonedFirst2);
  slideList2.insertBefore(clonedLast2, slideList2.firstElementChild);

  // Add pagination dynamically
  let pageChild = '';
  for (var i = 0; i < slideLen; i++) {
    pageChild += '<li class="dot';
    pageChild += (i === startNum) ? ' dot_active' : '';
    pageChild += '" data-index="' + i + '"><a href="#"></a></li>';
  }
  pagination.innerHTML = pageChild;
  const pageDots = document.querySelectorAll('.dot'); // each dot from pagination

  slideList.style.transform = "translate3d(-" + (slideWidth * (startNum + 1)) + "px, 0px, 0px)";

  let curIndex = startNum; // current slide index (except copied slide)
  let curSlide = slideContents[curIndex]; // current slide dom
  curSlide.classList.add('slide_active');

  // Add pagination dynamically 2
  let pageChild2 = '';
  for (var i = 0; i < slideLen; i++) {
    pageChild2 += '<li class="dot2';
    pageChild2 += (i === startNum2) ? ' dot_active2' : '';
    pageChild2 += '" data-index2="' + i + '"><a href="#"></a></li>';
  }
  pagination2.innerHTML = pageChild2;
  const pageDots2 = document.querySelectorAll('.dot2'); // each dot from pagination

  slideList2.style.transform = "translate3d(-" + (slideWidth * (startNum2 + 1)) + "px, 0px, 0px)";

  let curIndex2 = startNum2; // current slide index (except copied slide)
  let curSlide2 = slideContents2[curIndex2]; // current slide dom
  curSlide2.classList.add('slide_active2');

  /** Next Button Event */
  slideBtnNext.addEventListener('click', function() {
    if (curIndex <= slideLen - 1) {
      slideList.style.transition = slideSpeed + "ms";
      slideList.style.transform = "translate3d(-" + (slideWidth * (curIndex + 2)) + "px, 0px, 0px)";
    }
    if (curIndex === slideLen - 1) {
      setTimeout(function() {
        slideList.style.transition = "0ms";
        slideList.style.transform = "translate3d(-" + slideWidth + "px, 0px, 0px)";
      }, slideSpeed);
      curIndex = -1;
    }
    curSlide.classList.remove('slide_active');
    pageDots[(curIndex === -1) ? slideLen - 1 : curIndex].classList.remove('dot_active');
    curSlide = slideContents[++curIndex];
    curSlide.classList.add('slide_active');
    pageDots[curIndex].classList.add('dot_active');
  });

  /** Prev Button Event */
  slideBtnPrev.addEventListener('click', function() {
    if (curIndex >= 0) {
      slideList.style.transition = slideSpeed + "ms";
      slideList.style.transform = "translate3d(-" + (slideWidth * curIndex) + "px, 0px, 0px)";
    }
    if (curIndex === 0) {
      setTimeout(function() {
        slideList.style.transition = "0ms";
        slideList.style.transform = "translate3d(-" + (slideWidth * slideLen) + "px, 0px, 0px)";
      }, slideSpeed);
      curIndex = slideLen;
    }
    curSlide.classList.remove('slide_active');
    pageDots[(curIndex === slideLen) ? 0 : curIndex].classList.remove('dot_active');
    curSlide = slideContents[--curIndex];
    curSlide.classList.add('slide_active');
    pageDots[curIndex].classList.add('dot_active');
  });

  /** Next Button Event2 */
  slideBtnNext2.addEventListener('click', function() {
    if (curIndex2 <= slideLen - 1) {
      slideList2.style.transition = slideSpeed + "ms";
      slideList2.style.transform = "translate3d(-" + (slideWidth * (curIndex2 + 2)) + "px, 0px, 0px)";
    }
    if (curIndex2 === slideLen - 1) {
      setTimeout(function() {
        slideList2.style.transition = "0ms";
        slideList2.style.transform = "translate3d(-" + slideWidth + "px, 0px, 0px)";
      }, slideSpeed);
      curIndex2 = -1;
    }
    curSlide2.classList.remove('slide_active2');
    pageDots2[(curIndex2 === -1) ? slideLen - 1 : curIndex2].classList.remove('dot_active2');
    curSlide2 = slideContents2[++curIndex2];
    curSlide2.classList.add('slide_active2');
    pageDots2[curIndex2].classList.add('dot_active2');
  });

  /** Prev Button Event2 */
  slideBtnPrev2.addEventListener('click', function() {
    if (curIndex2 >= 0) {
      slideList2.style.transition = slideSpeed + "ms";
      slideList2.style.transform = "translate3d(-" + (slideWidth * curIndex2) + "px, 0px, 0px)";
    }
    if (curIndex2 === 0) {
      setTimeout(function() {
        slideList2.style.transition = "0ms";
        slideList2.style.transform = "translate3d(-" + (slideWidth * slideLen) + "px, 0px, 0px)";
      }, slideSpeed);
      curIndex2 = slideLen;
    }
    curSlide2.classList.remove('slide_active2');
    pageDots2[(curIndex2 === slideLen) ? 0 : curIndex2].classList.remove('dot_active2');
    curSlide2 = slideContents2[--curIndex2];
    curSlide2.classList.add('slide_active2');
    pageDots2[curIndex2].classList.add('dot_active2');
  });

  /** Pagination Button Event */
  let curDot;
  Array.prototype.forEach.call(pageDots, function (dot, i) {
    dot.addEventListener('click', function (e) {
      e.preventDefault();
      curDot = document.querySelector('.dot_active');
      curDot.classList.remove('dot_active');
      
      curDot = this;
      this.classList.add('dot_active');

      curSlide.classList.remove('slide_active');
      curIndex = Number(this.getAttribute('data-index'));
      curSlide = slideContents[curIndex];
      curSlide.classList.add('slide_active');
      slideList.style.transition = slideSpeed + "ms";
      slideList.style.transform = "translate3d(-" + (slideWidth * (curIndex + 1)) + "px, 0px, 0px)";
    });
  });

  /** Pagination Button Event2 */
  let curDot2;
  Array.prototype.forEach.call(pageDots2, function (dot2, i) {
    dot2.addEventListener('click', function (e) {
      e.preventDefault();
      curDot2 = document.querySelector('.dot_active2');
      curDot2.classList.remove('dot_active2');
      
      curDot2 = this;
      this.classList.add('dot_active2');

      curSlide2.classList.remove('slide_active2');
      curIndex2 = Number(this.getAttribute('data-index2'));
      curSlide2 = slideContents2[curIndex2];
      curSlide2.classList.add('slide_active2');
      slideList2.style.transition = slideSpeed + "ms";
      slideList2.style.transform = "translate3d(-" + (slideWidth * (curIndex2 + 1)) + "px, 0px, 0px)";
    });
  });
})();