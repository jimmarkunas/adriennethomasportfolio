(function ($) {
    "use strict";

    document.documentElement.classList.add("js-enabled");

    if (typeof WOW !== "undefined") {
        new WOW().init();
    }

    $(document).ready(function () {
        var $testimonials = $(".testimonial-slider");
        if ($testimonials.length > 0 && $.fn.owlCarousel) {
            $testimonials.owlCarousel({
                loop: true,
                center: false,
                margin: 40,
                items: 3,
                autoplay: true,
                autoplayTimeout: 3500,
                autoplayHoverPause: false,
                nav: false,
                responsive: {
                    0: { items: 1 },
                    768: { items: 2 },
                    991: { items: 3 }
                },
                onInitialized: function (event) {
                    $(event.target).trigger("play.owl.autoplay", [3500]);
                }
            });

            // Safety restart for first paint timing edge-cases.
            setTimeout(function () {
                $testimonials.trigger("play.owl.autoplay", [3500]);
            }, 900);
        }

        var $scroll = $(".scroll-area");
        if ($scroll.length > 0) {
            $scroll.on("click", function () {
                $("html").animate({ scrollTop: 0 }, 700);
                return false;
            });

            $(window).on("scroll", function () {
                if ($(window).scrollTop() > 400) {
                    $scroll.slideDown(300);
                } else {
                    $scroll.slideUp(200);
                }
            });
        }

        var revealNodes = document.querySelectorAll(
            "section .section-title, section .hero-content, section .hero-img, section .service-item, " +
                "section .counter-single, section .img-wrapper, section .about-info, section .testimonial-slider .item-wrapper, " +
                "section .process-card, section .faq-item, section .cta-panel-card, footer .ft-single, footer .footer-bottom"
        );

        if (revealNodes.length > 0) {
            revealNodes.forEach(function (el, idx) {
                el.classList.add("reveal-in");
                el.style.transitionDelay = Math.min(idx, 12) * 0.05 + "s";
            });

            var revealAll = function () {
                revealNodes.forEach(function (el) {
                    el.classList.add("is-visible");
                });
            };

            if ("IntersectionObserver" in window) {
                var revealObserver = new IntersectionObserver(
                    function (entries, obs) {
                        entries.forEach(function (entry) {
                            if (entry.isIntersecting) {
                                entry.target.classList.add("is-visible");
                                obs.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
                );

                revealNodes.forEach(function (el) {
                    revealObserver.observe(el);
                });

                setTimeout(revealAll, 2800);
            } else {
                revealAll();
            }
        }

        var $counters = $(".counter");
        if ($counters.length > 0) {
            $counters.each(function () {
                var endVal = parseInt($(this).text(), 10);
                if (!isNaN(endVal)) {
                    $(this).attr("data-target", endVal);
                    $(this).text("0");
                }
            });

            var animateCounter = function (el) {
                var end = parseInt(el.getAttribute("data-target"), 10);
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
                        this.dataset.counted = "true";
                        animateCounter(this);
                    }
                });
            };

            if ("IntersectionObserver" in window) {
                var counterObserver = new IntersectionObserver(
                    function (entries, obs) {
                        entries.forEach(function (entry) {
                            if (entry.isIntersecting && !entry.target.dataset.counted) {
                                entry.target.dataset.counted = "true";
                                animateCounter(entry.target);
                                obs.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.4 }
                );

                $counters.each(function () {
                    counterObserver.observe(this);
                });

                setTimeout(triggerCounters, 1800);
            } else {
                triggerCounters();
            }
        }
    });

    $(window).on("scroll", function () {
        var scroll = $(window).scrollTop();
        if (scroll < 100) {
            $(".header-area").removeClass("sticky");
        } else {
            $(".header-area").addClass("sticky");
        }
    });

    $(window).on("load", function () {
        setTimeout(function () {
            $(".preloader").fadeOut(450);
        }, 350);
    });
})(jQuery);
