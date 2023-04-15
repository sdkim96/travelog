var pcFlag = false;
var moFlag = false;
var menuClick;

$(function () {
    if ($(window).width() < 1080) {
        pcFlag = false;
        moFlag = true;
    } else {
        pcFlag = true;
        moFlag = false;
    }

    var winSc = $(window).scrollTop();
    gnbActive(winSc);
    if ($(window).width() >= 1080) {
        if (winSc >= 118) {
            $('body').addClass('fixed');
        } else {
            $('body').removeClass('fixed');
        }
    } else {
        if (winSc >= 50) {
            $('body').addClass('fixed');
        } else {
            $('body').removeClass('fixed');
        }
    }

    var swiperMain = new Swiper('.kv_slider', {
        autoplay: {
            delay: 4000,
        },
        effect: 'fade',
        slidesPerView: 1,
    });

    var swiperAI = new Swiper('.cate_slider', {
        slidesPerView: 1,
        pagination: {
            el: '.cate_slider_section .swiper-pagination',
            clickable: true,
        },
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.cate_slider_section .swiper-button-next',
            prevEl: '.cate_slider_section .swiper-button-prev',
        },
        loop: true,
    });

    var swiperService = new Swiper('.service_list_section', {
        slidesPerView: 'auto',
        navigation: {
            nextEl: '.service_list_section .swiper-button-next',
            prevEl: '.service_list_section .swiper-button-prev',
        },
        pagination: {
            el: '.service_list_section .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 1,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: true,
                },
            },
            1920: {
                slidesPerView: 'auto',
            },
        },
        on: {
            init: function () {
                setTimeout(function () {
                    serviceListCheck();
                }, 300);
            },
            transitionEnd: function () {
                serviceListCheck();
            },
            resize: function () {
                serviceListCheck();
                var deviceSize = $(window).innerWidth();
                var autoplayState = document.querySelector('.service_list_section').swiper.autoplay.running;
                if (deviceSize > 768 && autoplayState == true) {
                    document.querySelector('.service_list_section').swiper.autoplay.stop();
                }
            },
        },
    });

    $('.cate_item').on('click', function () {
        if ($(this).hasClass('is_disabled')) {
            var originText = $(this).data('originText');
            var $this = $(this);
            $(this).addClass('is_active');
            $(this).text('준비중');
            setTimeout(function () {
                $this.text(originText);
                $this.removeClass('is_active');
            }, 1500);
        }
    });

    $('.tip_box .btn_tip').on('click', function () {
        var tipCont = $(this).closest('.tip_box');
        tipCont.toggleClass('is-show');
    });

    $('.tip_box .btn_close').on('click', function () {
        var tipCont = $(this).closest('.tip_box');
        tipCont.removeClass('is-show');
    });

    /* Footer */
    $('.btn_site').on('click', function () {
        var $siteBox = $(this).closest('.site_select');
        var openCheck = 'is_open';
        if ($siteBox.hasClass(openCheck)) {
            $siteBox.removeClass(openCheck);
        } else {
            $siteBox.addClass(openCheck);
        }
    });

    //Tab
    $('[data-tab-button]').on('click', function () {
        var $tabs = $(this).closest('[data-tabs=wrapper]');
        var active = 'is_active';
        var tabCont = $(this).data('tabButton');

        $(this).closest('.tab_item').addClass(active).siblings().removeClass(active);

        $tabs.find('[data-tab-button]').each(function () {
            var tabLink = $(this).data('tabButton');

            if (tabLink == tabCont) {
                $('[data-tab=' + tabLink + ']').addClass(active);
            } else {
                $('[data-tab=' + tabLink + ']').removeClass(active);
            }
        });
    });

    //b2b contact layer
    $('[data-button]').on('click', function () {
        var layerLink = $(this).data('button');
        $('[data-layer=' + layerLink + ']').addClass('is-open');
        $('body').css('overflow', 'hidden');
    });

    $('.b2b_contact .btn_close').on('click', function () {
        $('[data-layer=b2bContact]').removeClass('is-open');
        $('body').css('overflow', '');
        $('.tab-content').removeClass('is_finished');
    });

    //위로가기
    $('.btnTop').on('click', function () {
        $('html, body').stop().animate(
            {
                scrollTop: 0,
            },
            500
        );
    });

    //산업 선택
    $('.openSelect .btn_sel').on('click', function (e) {
        var $this = $(this);

        if ($this.closest('.openSelect').hasClass('able')) {
            $(this).closest('.selBox').toggleClass('open');

            if (myScroll != null) {
                myScroll.refresh();
            }

            if ($(window).width() < 1080) {
                if ($('.b2b_contact').find('.scroll_dim').length < 1) {
                    $('.b2b_contact').prepend('<div class="scroll_dim"></div>');
                }
            }
        }
    });

    $('.scrollBox_close').on('click', function (e) {
        var $this = $(this);
        $('.scroll_dim').remove();
        $this.closest('.selBox').removeClass('open');
    });

    $('.selBox label').on('click', function (e) {
        if (!$(e.target).hasClass('btn_tooltip')) {
            var elText = $(this).find('.sel_txt').text();
            $(this).closest('.selBox').toggleClass('open');
            $(this).closest('.selBox').find('.openSelect input').val(elText);
            $(this).closest('.step_box').find('.next').addClass('able');
            $('.tooltip_cont').removeClass('active');

            if ($(window).width() < 1080) {
                $('.scroll_dim').remove();
            }
        }
    });

    $('.btn_down').on('click', function () {
        $('body, html')
            .stop()
            .animate(
                {
                    scrollTop: $(window).innerHeight() + 1,
                },
                400
            );
    });

    $('.btn_menu, .btn_close_menu').on('click', function () {
        $('.all_menu_wrap').toggleClass('is-active');
        if ($('.all_menu_wrap').hasClass('is-active')) {
            $('body').css('overflow-y', 'hidden');
        } else {
            $('body').css('overflow-y', '');
        }
    });



    $('.form_inp input, .form_inp textarea')
        .on('focus', function (e) {
            $(e.currentTarget).closest('.form_item').addClass('is_active');
        })
        .on('blur', function (e) {
            $(e.currentTarget).closest('.form_item').removeClass('is_active');
        });

    $(window).on({
        scroll: function () {
            var winSc = $(window).scrollTop();
            gnbActive(winSc);

            if ($(window).width() >= 1080) {
                if (winSc >= 118) {
                    $('body').addClass('fixed');
                } else {
                    $('body').removeClass('fixed');
                }
            } else {
                if (winSc >= 50) {
                    $('body').addClass('fixed');
                } else {
                    $('body').removeClass('fixed');
                }
                if (winSc >= $('.sec_life').offset().top - $(window).innerHeight() / 3) {
                    if (swiperService !== null) {
                        if (!$('.service_list_section').hasClass('play_start')) {
                            $('.service_list_section').addClass('play_start');
                            swiperService.autoplay.start();
                        }
                    }
                }
            }
        },
        load: function () {
            AOS.init();
            var winSc = $(window).scrollTop();

            if ($('.sc_01').length) {
                //Iscroll
                myScroll = new IScroll('.sc_01', {
                    scrollbars: true,
                    mouseWheel: true,
                    interactiveScrollbars: true,
                    tab: true,
                    click: false,
                    snap: true,
                    fadeScrollbars: false,
                    bounce: false,
                    momentum: false,
                    preventDefaultException: { tagName: /.*/ },
                });
            }
            if ($(window).width() < 1080) {
                if (winSc >= $('.sec_life').offset().top - $(window).innerHeight() / 3) {
                    if (swiperService !== null) {
                        if (!$('.service_list_section').hasClass('play_start')) {
                            $('.service_list_section').addClass('play_start');
                            swiperService.autoplay.start();
                        }
                    }
                }
            }
        },
        resize: function () {
            var winSc = $(window).scrollTop();

            if ($(window).width() < 1080) {
                if (moFlag === false) {
                    moFlag = true;
                    pcFlag = false;

                    if ($('.selBox').hasClass('open')) {
                        $('.selBox').removeClass('open');
                    }
                }
            } else {
                if (pcFlag === false) {
                    pcFlag = true;
                    moFlag = false;
                }
            }

            gnbActive(winSc);
        },
    });

    function gnbActive(winTop) {
        $('[data-menu-idx]').each(function (item) {
            var activeIdx = $(this).data('menuIdx');
            var nextSec = $("[data-menu-idx='" + (activeIdx + 1) + "']");
            var nextSecCheck;
            if (nextSec.length) {
                nextSecCheck = winTop < nextSec.offset().top;
            } else {
                nextSecCheck = true;
            }

        });
    }

    function serviceListCheck() {
        var wrapSize = $('.service_list_section')[0].getBoundingClientRect();
        var activeSlide = [];

        $('.service_list_section')
            .find('.service_item')
            .each(function (idx) {
                var itemLeft = this.getBoundingClientRect().left;
                var itemRight = $(this).find('.service_box')[0].getBoundingClientRect().right;

                if (itemLeft >= wrapSize.left && itemRight <= wrapSize.right) {
                    activeSlide.push(idx);
                }
            });

        $('.service_list_section').find('.service_item').removeClass('now-show');
        for (var active in activeSlide) {
            $('.service_list_section').find('.service_item').eq(activeSlide[active]).addClass('now-show');
        }
    }
});

//팝업노출
function popOpen(el) {
    $(el).show();
    $('body').css('overflow-y', 'hidden');
    $('body').addClass('popOpen');
}

function popClose(el) {
    $(el).hide();
}

function validateEmail(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(email).toLowerCase()
    );
}
