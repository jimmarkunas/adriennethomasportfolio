(function ($) {
    "use strict";
    document.documentElement.classList.add('js-enabled');
     // WOW JS
    new WOW().init();

       
    $(document).ready(function () {
        /*---------------------------------------------------
            mainmenu
        ----------------------------------------------------*/
        $('.mainmenu').meanmenu({
            meanMenuContainer: '.mobile-menu',
            meanScreenWidth: '1199',
        });

        $(".sidebar-toggle-btn").on("click", function () {
            $(".sidebar-wrap").addClass("sidebar-opened");
//            $(".body-overlay").addClass("opened");
        });
        $(".sidebar-close-btn").on("click", function () {
            $(".sidebar-wrap").removeClass("sidebar-opened");
//            $(".body-overlay").removeClass("opened");
        });
        

        

      
        /*---------------------------------------------------
            slider carousel
        ----------------------------------------------------*/
       ///testimonial
        var $full = $('.testimonial-slider');
        if($full.length > 0 && $.fn.owlCarousel){
            $full.owlCarousel({
                loop:true,
                center:false,
                margin:40,
                items:3,
                autoplay: true,
                autoplayTimeout: 3500,
                autoplayHoverPause: false,
                nav: false,
                responsive : {
                    0 : {
                       items:1,
                    },
                    768 : {
                         items:2,
                    },
                     991 : {
                         items:3,
                    }
                },
                onInitialized: function(event) {
                    $(event.target).trigger('play.owl.autoplay', [3500]);
                }
            });

            // Safety restart for live environments where autoplay may pause on first render.
            setTimeout(function () {
                $full.trigger('play.owl.autoplay', [3500]);
            }, 900);
        }

    });


    /*---------------------------------------------------
        sticky header
    ----------------------------------------------------*/
    $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll < 100) {
            $(".header-area").removeClass("sticky");
        } else {
            $(".header-area").addClass("sticky");
        }
    });
    
    if('.marquee_text'.length){
      $('.marquee_text').marquee({
        direction: 'left',
        duration: 50000,
        gap: 50,
        delayBeforeStart: 0,
        duplicated: true,
        startVisible: true,
      });
    }
    /*---------------------------------------------------
        Scroll Area
    ----------------------------------------------------*/
    var $scroll = $('.scroll-area');
        if($scroll.length > 0){
            $(document).ready(function(){
                $('.scroll-area').click(function(){
                $('html').animate({
                    'scrollTop' : 0,
                },700);
                return false;
            });
            $(window).on('scroll',function(){
                var a = $(window).scrollTop();
                if(a>400){
                    $('.scroll-area').slideDown(300);
                }else{
                    $('.scroll-area').slideUp(200);
                }
                });
            });
        }

        /*---------------------------------------------------
            global reveal animations
        ----------------------------------------------------*/
        var revealNodes = document.querySelectorAll(
            'section .section-title, section .hero-content, section .hero-img, section .service-item, ' +
            'section .counter-single, section .img-wrapper, section .about-info, section .testimonial-slider .item-wrapper, ' +
            'section .process-card, section .faq-item, section .cta-panel-card, footer .ft-single, footer .footer-bottom'
        );

        if (revealNodes.length > 0) {
            revealNodes.forEach(function (el, idx) {
                el.classList.add('reveal-in');
                el.style.transitionDelay = (Math.min(idx, 12) * 0.05) + 's';
            });

            var revealAll = function () {
                revealNodes.forEach(function (el) {
                    el.classList.add('is-visible');
                });
            };

            if ('IntersectionObserver' in window) {
                var revealObserver = new IntersectionObserver(function (entries, obs) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            obs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

                revealNodes.forEach(function (el) {
                    revealObserver.observe(el);
                });

                // Safety fallback if observer timing misses anything.
                setTimeout(revealAll, 2800);
            } else {
                revealAll();
            }
        }
    
        /*---------------------------------------------------
        preloader
        ----------------------------------------------------*/
        $(window).on('load', function () {
            setTimeout(function () {
                $('.preloader').fadeOut(450);
            }, 350);
        });

      /*================================================================= 
          //ui
        ==================================================================*/
      
        var $tab = $('#tabs');
        if($tab.length > 0){
        $( function() {
            $( "#tabs" ).tabs();
          } );
        }

        let menuToggle = document.querySelector('.menuToggle');
        if (menuToggle) {
            menuToggle.onclick = function () {
                menuToggle.classList.toggle('active');
            }
        }
       
     /*---------------------------------------------------
        onePageNav
    ----------------------------------------------------*/
    var $nav = $('#nav_header');
        if($nav.length > 0){
           $('#nav_header').onePageNav({
            currentClass: 'current',
            changeHash: false,
            scrollSpeed: 750,
            scrollThreshold: 0.5,
            filter: '',
            easing: 'swing',
        }); 
         
      }
      

        /*================================================================= 
            Animating numbers
        ==================================================================*/
        var $counters = $('.counter');
        if($counters.length > 0){
            $counters.each(function () {
                var endVal = parseInt($(this).text(), 10);
                if (!isNaN(endVal)) {
                    $(this).attr('data-target', endVal);
                    $(this).text('0');
                }
            });

            var animateCounter = function (el) {
                var end = parseInt(el.getAttribute('data-target'), 10);
                if (isNaN(end)) return;
                var duration = 1600;
                var startTime = null;

                var step = function (timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    el.textContent = Math.floor(progress * end);
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    } else {
                        el.textContent = end;
                    }
                };

                window.requestAnimationFrame(step);
            };

            var triggerCounters = function () {
                $counters.each(function () {
                    if (!this.dataset.counted) {
                        this.dataset.counted = 'true';
                        animateCounter(this);
                    }
                });
            };

            if ('IntersectionObserver' in window) {
                var observer = new IntersectionObserver(function (entries, obs) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting && !entry.target.dataset.counted) {
                            entry.target.dataset.counted = 'true';
                            animateCounter(entry.target);
                            obs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.4 });

                $counters.each(function () {
                    observer.observe(this);
                });

                // Fallback: if observer misses due layout/render timing, still run once.
                setTimeout(triggerCounters, 1800);
            } else {
                triggerCounters();
            }
        }

      
        
}(jQuery));

function menuclick12(){
     $(".sidebar-wrap").removeClass("sidebar-opened");
 }
