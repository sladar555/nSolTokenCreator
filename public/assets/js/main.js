
/*

  dark to light
  headerFixed
  dropdown
  flatAccordion
  flatCounter
  flattabs
  loadmore
  progress
  preloader

*/

;(function($) {

    'use strict'

    // Dark to light
    if (localStorage.getItem("theme-color") === "dark" || (!("theme-color" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      document.getElementById("dark-mode")?.classList.add("dark--version");
    } 
    if (localStorage.getItem("theme-color") === "light") {
      document.documentElement.classList.remove("dark");
      document.getElementById("dark-mode")?.classList.remove("dark--version");
    } 
    const lightToDarkButton = document.getElementById("dark-mode");
    lightToDarkButton?.addEventListener("click", function () {
        if (localStorage.getItem("theme-color")) {
          if (localStorage.getItem("theme-color") === "light") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme-color", "dark");
            lightToDarkButton?.classList.add("dark--version");
          } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme-color", "light");
            lightToDarkButton?.classList?.remove("dark--version");
          }
        } else {
          if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
            lightToDarkButton?.classList?.remove("dark--version");
            localStorage.setItem("theme-color", "light");
          } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme-color", "dark");
            lightToDarkButton?.classList.add("dark--version");
          }
        }
    });
  
    var headerFixed = function() {
      if ( $('header').hasClass('header-fixed') ) {
          var nav = $('.sticky-area-wrap');
          if ( nav.length ) {
              var
              offsetTop = nav.offset().top,
              headerHeight = nav.height(),
              injectSpace = $('<div>', {
                  height: headerHeight
              });
              if ( $('header').hasClass('header-fixed') ) {
                  injectSpace.insertAfter(nav)
              }
              $(window).on('load scroll', function(){
                  if ( $(window).scrollTop() > offsetTop + headerHeight ) {
                      nav.addClass('hide');
                      injectSpace.show();
                  } else {
                      nav.removeClass('hide');
                      injectSpace.hide();
                  }
  
                  if ( $(window).scrollTop() > 300 ) {
                      nav.addClass('show');
                  } else {
                      nav.removeClass('show');
                  }
              })
          }
      }     
    };
  
    var dropdown =function() {
      $('.mobi-home.mobi-item-has-children').on('click', function () {
        $(".mobi-home .mobi-item-has-children-list").slideToggle("block");
        $(".mobi-home .arrow-down").toggleClass("rotate-180")
      });
      $('.mobi-pages.mobi-item-has-children').on('click', function () {
        $(".mobi-pages .mobi-item-has-children-list").slideToggle("block");
        $(".mobi-pages .arrow-down").toggleClass("rotate-180")
      });
      $('.btn-menu').on('click', function () {
        $(".btn-menu-1").toggleClass("hidden")
        $(".btn-menu-2").toggleClass("btn-menu-active-1")
        $(".btn-menu-3").toggleClass("btn-menu-active-2")
        $("#main-nav-mobi").slideToggle("block")
      });
    }
    
    var flatAccordion = function () {
        var args = { duration: 600 };
        $('.flat-toggle .toggle-title.active').siblings('.toggle-content').show();
        $('.flat-toggle.enable .toggle-title').on('click', function () {
            $(this).closest('.flat-toggle').find('.toggle-content').slideToggle(args);
            $(this).toggleClass('active');
        });
        $('.flat-accordion .toggle-title').on('click', function () {
            if (!$(this).is('.active')) {
                $(this).closest('.flat-accordion').find('.toggle-title.active').toggleClass('active').next().slideToggle(args);
                $(this).toggleClass('active');
                $(this).next().slideToggle(args);
            } else {
                $(this).toggleClass('active');
                $(this).next().slideToggle(args);
            }
        }
      );

    };
      
      
    var flatCounter = function () {
      if ($(document.body).hasClass("counter-scroll")) {
        var a = 0;
        $(window).scroll(function () {
          var oTop = $(".counter").offset().top - window.innerHeight;
          if (a == 0 && $(window).scrollTop() > oTop) {
            if ($().countTo) {
              $(".counter")
                .find(".number")
                .each(function () {
                  var to = $(this).data("to"),
                    speed = $(this).data("speed");
                  $(this).countTo({
                    to: to,
                    speed: speed,
                  });
                });
            }
            a = 1;
          }
        });
      }
    };

    var flattabs = function(){
      $('.flat-tabs').each(function(){
          $(this).find('.content-tab').children().hide();
          $(this).find('.content-tab').children().first().show();
          $(this).find('.menu-tab').children('li').on('click',function(){
              var liActive = $(this).index();
              var contentActive=$(this).siblings().removeClass('active').parents('.flat-tabs').find('.content-tab').children().eq(liActive);
              contentActive.addClass('active').fadeIn("slow");
              contentActive.siblings().removeClass('active');
              $(this).addClass('active').parents('.flat-tabs').find('.content-tab').children().eq(liActive).siblings().hide();
          });
      });
    };

    // loadmore
    $(".fl-item").slice(0, 6).show();
    $(".fl-item2").slice(0, 9).show();
    $("#loadmore").on("click", function(e){
      e.preventDefault();
      $(".fl-item:hidden").slice(0, 3).slideDown();
      $(".fl-item2:hidden").slice(0, 3).slideDown();

      if($(".fl-item:hidden").length == 0) {
        $("#loadmore").hide();
      }
      if($(".fl-item2:hidden").length == 0) {
        $("#loadmore").hide();
      }
    });
       
    var bars = document.querySelectorAll('.meter > span');
    setInterval(function(){
    bars.forEach(function(bar){
        var getWidth = parseFloat(bar.dataset.progress);
        
        for(var i = 0; i < getWidth; i++) {
        bar.style.width = i + '%';
        }
    });
    }, 500);

    // Dom Ready
      $(function() { 
        headerFixed();
        dropdown();
        flatAccordion();
        flatCounter();
        flattabs();
      });
  })(jQuery);
  
  
      