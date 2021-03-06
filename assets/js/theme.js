(function($) {
  'use strict';

  function getScrollBarWidth() {
    var outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

    document.body.appendChild(outer);
    var widthNoScroll = outer.offsetWidth; // force scrollbars

    outer.style.overflow = 'scroll'; // add innerdiv

    var inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);
    var widthWithScroll = inner.offsetWidth; // remove divs

    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
  }

  function detectElementScrollbarY(element) {
    return element.scrollHeight > element.offsetHeight;
  }

  // throttle
  function throttle(func, ms) {
    var isThrottled = false;
    var savedArgs;
    var savedThis;

    function wrapper() {
      if (isThrottled) {
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments);
      isThrottled = true;
      setTimeout(function () {
        isThrottled = false;

        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

  // platformDetect
  var detectBrowser = {
    isOpera: (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,// eslint-disable-line
    isFirefox: typeof InstallTrigger !== 'undefined',
    isSafari: /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor),
    isIE: /* @cc_on!@*/false || !!document.documentMode,
    isEdge: !function () {this.isIE;} && !!window.StyleMedia, // eslint-disable-line
    isChrome: !!window.chrome && !!window.chrome.webstore,
    isBlink: (function () {this.isChrome;} || function () {this.isOpera;}) && !!window.CSS // eslint-disable-line
  };

  var detectMobile = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  };

  svg4everybody();

  $('.animsition').animsition({
    inClass: 'fade-in',
    outClass: 'fade-out',
    inDuration: 500,
    outDuration: 500,
    linkElement: 'a:not([target="_blank"]):not([href^="#"])',
    loading: true,
    loadingParentElement: 'body',
    //animsition wrapper element
    loadingClass: 'animsition-loading2',
    loadingInner: "<div class=\"spinner\">\n        <div class=\"double-bounce1\"></div>\n      <div class=\"double-bounce2\"></div>\n      </div>",
    timeout: false,
    timeoutCountdown: 5000,
    onLoadEvent: true,
    browser: ['animation-duration', '-webkit-animation-duration'],
    // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
    // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
    overlay: false,
    overlayClass: 'animsition-overlay-slide',
    overlayParentElement: 'body',
    transition: function transition(url) {
      window.location.href = url;
    }
  });

  // header
  (function () {
    var button = $('.header__menu-button');
    var panel = $('.header__menu');
    var overlay = $('.header__overlay');

    function openMenu() {
      var scrollBarWidth = window.innerWidth > document.querySelector('body').offsetWidth ? getScrollBarWidth() : 0;
      $('body').css({
        overflow: 'hidden',
        paddingRight: "".concat(scrollBarWidth, "px")
      });
      button.css({
        marginRight: "".concat(scrollBarWidth, "px")
      });
      $(overlay).fadeIn(300);
    };

    function hideMenu() {
      $('body').css({
        overflow: '',
        paddingRight: ''
      });
      button.css({
        marginRight: ''
      });
      $(overlay).fadeOut(300);
    };

    button.on('click', function () {
      button.toggleClass('header__menu-button_cross');
      button.toggleClass('header__menu-button_burger', !button.hasClass('header__menu-button_cross'));
      panel.toggleClass('header__menu_opened');

      if (button.hasClass('header__menu-button_cross')) {
        openMenu();
      } else {
        hideMenu();
      }
    });

    overlay.on('click', function () {
      button.toggleClass('header__menu-button_cross');
      button.toggleClass('header__menu-button_burger', !button.hasClass('header__menu-button_cross'));
      panel.toggleClass('header__menu_opened');

      if (button.hasClass('header__menu-button_cross')) {
        openMenu();
      } else {
        hideMenu();
      }
    });

    if ($('.header_fixed').length) {
      var headerElement = document.querySelector('.header');
      var nav_offset_top = headerElement.classList.contains('header_offset') ? window.innerHeight : headerElement.offsetHeight + 30;
      var headerContainer = document.querySelector('.header__container');
      $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        if (scroll >= nav_offset_top) {
          $('.header_fixed').addClass('header_is_fixed');
          headerContainer.style.top = "-".concat(headerContainer.offsetHeight, "px");
        } else {
          $('.header_fixed').removeClass('header_is_fixed');
          headerContainer.style.top = '';
        }
      });
    }
  })();

  // parallax-image
  (function () {
    if ($('.parallax-image').length) {
      $(window).on('load', function () {
        var rellax = new Rellax('.parallax-image__image');
      });
    }
  })();

  // zoom-image-head
  (function () {
    var bodyWrapper = document.querySelector('.zoom-image-head');
    var body = document.querySelector('.zoom-image-head__body');
    var bg = document.querySelector('.zoom-image-head__bg');
    var bg2 = document.querySelector('.zoom-image-head__bg2');
    var content = document.querySelector('.zoom-image-head__content');
    var contentSubtitle = document.querySelector('.zoom-image-head__subtitle');
    var contentTitle = document.querySelector('.zoom-image-head__title');
    var contentText = document.querySelector('.zoom-image-head__text');
    var contentIcon = document.querySelector('.zoom-image-head__icon');
    var counterBlock = document.querySelector('.js-demo-title');
    var counterTitle = document.querySelector('.js-demo-description');
    var counterText = document.querySelector('.js-demo-content');

    if (body && !detectMobile.isMobile) {
      var checkPosition = function checkPosition() {
        var scroll = $(window).scrollTop();
        var height = bodyWrapper.offsetHeight;
        var opacity = (1 - scroll / height) * 2;
        opacity = opacity > 1 ? 1 : opacity;
        var contentOpacity = (1 - scroll / height) * 1.5;
        contentOpacity = contentOpacity > 1 ? 1 : contentOpacity;
        var scale = 1 + scroll / height * 0.5;
        var bgX = "".concat(scroll / height * -15, "%");
        var bgY = "".concat(scroll / height * -12, "%");
        var bg2X = "".concat(scroll / height * 4, "%");
        var bg2Y = "".concat(scroll / height * 15, "%");
        tl2.set(bg, {
          opacity: opacity,
          scale: scale,
          x: bgX,
          y: bgY
        }).set(bg2, {
          opacity: opacity,
          scale: scale,
          x: bg2X,
          y: bg2Y
        }).set(content, {
          opacity: contentOpacity,
          y: "".concat(scroll / height * -15, "%")
        });

        if (scroll > height) {
          tl2.set(body, {
            display: 'none'
          });
        } else {
          tl2.set(body, {
            display: ''
          });
        }

        if (scroll > height && !contentIsVisible) {
          tl2.to(counterBlock, 0.5, {
            x: 0,
            opacity: 1
          }).to(counterTitle, 0.5, {
            y: 0,
            opacity: 1
          }).to(counterText, 0.5, {
            y: 0,
            opacity: 1
          });
          contentIsVisible = true;
        }
      };

      var tl = new TimelineLite({
        onComplete: function onComplete() {
          checkPosition();
          $(window).scroll(function () {
            checkPosition();
          });
        }
      });
      tl.set(bg, {
        opacity: 0,
        scale: 1.5,
        x: '-15%',
        y: '-12%'
      }).set(bg2, {
        opacity: 0,
        scale: 1.5,
        x: '4%',
        y: '15%'
      }).set([contentSubtitle, contentTitle, contentText, contentIcon], {
        opacity: 0,
        y: 30
      }).call(function () {
        document.querySelector('html').scrollTop = 0;
      }, null, null, '+=1').to(bg, 1.5, {
        opacity: 1,
        scale: 1,
        x: '0%',
        y: '0%'
      }).to(bg2, 1.5, {
        opacity: 1,
        scale: 1,
        x: '0%',
        y: '0%'
      }, '-=1.5').staggerTo([contentSubtitle, contentTitle, contentText, contentIcon], 1, {
        opacity: 1,
        y: 0
      }, .2, '-=.6');
      body.style.position = 'fixed';
      var contentIsVisible = false;
      var tl2 = new TimelineLite();
      tl2.set(counterBlock, {
        x: -100,
        opacity: 0
      }).set(counterTitle, {
        y: 20,
        opacity: 0
      }).set(counterText, {
        y: 20,
        opacity: 0
      });
    }
  })();
})(jQuery);
