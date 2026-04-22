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

        var sectionRevealSelector = [
            ".section-title",
            ".section-title2",
            "#about p",
            "#about .personal-info li",
            "#about .about-info a",
            ".timeline-entry",
            ".testimonial-slider .owl-item",
            ".testimonial-slider .item-wrapper",
            ".skills-block",
            ".skill-pill",
            ".cert-item",
            ".ambassador-intro",
            ".ambassador-card",
            ".impact-intro",
            ".impact-card",
            ".cta-panel-card"
        ].join(", ");

        var sliderSection = document.querySelector(".stat-strip-area");
        var revealGroups = [];
        var allRevealTargets = [];

        var collectTargets = function (root, selector) {
            if (!root) return [];
            var nodes = root.querySelectorAll(selector);
            return Array.prototype.slice.call(nodes);
        };

        if (sliderSection) {
            var section = sliderSection.nextElementSibling;
            while (section) {
                if (section.tagName && section.tagName.toLowerCase() === "section") {
                    var targets = collectTargets(section, sectionRevealSelector);
                    if (targets.length === 0) {
                        targets = [section];
                    }

                    var deduped = [];
                    targets.forEach(function (node) {
                        if (deduped.indexOf(node) === -1) {
                            deduped.push(node);
                        }
                    });

                    deduped.forEach(function (el, idx) {
                        el.classList.add("reveal-in");
                        el.style.transitionDelay = Math.min(idx, 8) * 0.06 + "s";
                        allRevealTargets.push(el);
                    });

                    revealGroups.push({ trigger: section, targets: deduped });
                }
                section = section.nextElementSibling;
            }
        }

        var footer = document.querySelector(".footer-area");
        if (footer) {
            var footerTargets = collectTargets(
                footer,
                ".ft-logo, .footer-brand-copy, .ft-social, .ft-title, .col-contact p, .footer-bottom"
            );
            if (footerTargets.length === 0) {
                footerTargets = [footer];
            }

            footerTargets.forEach(function (el, idx) {
                el.classList.add("reveal-in");
                el.style.transitionDelay = Math.min(idx, 6) * 0.06 + "s";
                allRevealTargets.push(el);
            });

            revealGroups.push({ trigger: footer, targets: footerTargets });
        }

        if (allRevealTargets.length > 0) {
            var revealGroup = function (group) {
                group.targets.forEach(function (el) {
                    el.classList.add("is-visible");
                });
            };

            var revealAll = function () {
                revealGroups.forEach(function (group) {
                    revealGroup(group);
                });
            };

            if ("IntersectionObserver" in window) {
                var sectionObserver = new IntersectionObserver(
                    function (entries, obs) {
                        entries.forEach(function (entry) {
                            if (entry.isIntersecting) {
                                var match = null;
                                revealGroups.forEach(function (group) {
                                    if (group.trigger === entry.target) {
                                        match = group;
                                    }
                                });
                                if (match) {
                                    revealGroup(match);
                                }
                                obs.unobserve(entry.target);
                            }
                        });
                    },
                    { threshold: 0.12, rootMargin: "0px 0px -12% 0px" }
                );

                revealGroups.forEach(function (group) {
                    sectionObserver.observe(group.trigger);
                });
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
