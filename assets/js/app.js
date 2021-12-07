$(function () {
  "use strict";
  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Main Variables
  var
    body = $("body"),
    html = $("html"),
    preloader = $("#preloader"),
    moodIco = $("#color-mood i"),
    backToTopArrow = $(".back-to-top"),
    typed = $(".typed"),
    scrollableBody = $("html, body");

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Check LocalStorage Color Mode & Trigger Preloader
  $(window).on("load", (function () {
    "light" === localStorage.getItem("MS-Mood") ?
      (html.attr("data-theme", "light"), moodIco.attr("class", "bx bxs-moon"), $("#aboutImage").attr("src", "assets/img/illustration/light_illustration.svg"))
      : (html.attr("data-theme", "dark"), moodIco.attr("class", "bx bxs-sun"), $("#aboutImage").attr("src", "assets/img/illustration/dark_illustration.svg"));
    // Remove Preloader
    preloader.length && preloader.delay(500).fadeOut("slow", (function () {
      $(this).remove();
    }));
  }));

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Toggle Color Mode
  $("#color-mood").on("click", function () {
    "light" === html.attr("data-theme") ?
      (html.attr("data-theme", "dark"), moodIco.attr("class", "bx bxs-sun"), $("#aboutImage").attr("src", "assets/img/illustration/dark_illustration.svg"), localStorage.setItem("MS-Mood", "dark"))
      : (html.attr("data-theme", "light"), moodIco.attr("class", "bx bxs-moon"), $("#aboutImage").attr("src", "assets/img/illustration/light_illustration.svg"), localStorage.setItem("MS-Mood", "light"));
  });


  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Back To Top Functionality
  $(window).on("scroll", function () {
    $(this).scrollTop() > 100 ? backToTopArrow.fadeIn("slow") : backToTopArrow.fadeOut("slow");
  });
  backToTopArrow.on("click", function () {
    return scrollableBody.animate({scrollTop: 0}, 1500, "easeInOutExpo");
  });

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // TypedJS
  if (typed.length) {
    let typed_strings = typed.data("typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: !0,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 1500
    });
  }

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Smooth Scrolling
  $(document).on("click", ".nav-menu a, .scrollto", function (e) {
    if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") && location.hostname === this.hostname) {
      let target = $(this.hash);
      if (target.length) {
        e.preventDefault();
        let scrollto = target.offset().top;
        return scrollableBody.animate({scrollTop: scrollto}, 1500, "easeInOutExpo"), $(this).parents(".nav-menu, .mobile-nav").length && ($(".nav-menu .active, .mobile-nav .active").removeClass("active"), $(this).closest("li").addClass("active")), body.hasClass("mobile-nav-active") && (body.removeClass("mobile-nav-active"), $(".mobile-nav-toggle i").toggleClass("icofont-navigation-menu icofont-close")), !1;
      }
    }
  });

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Activate Smooth Scroll On Page Load With Hash Links In The URL
  $(document).on("ready", function () {
    if (window.location.hash) {
      let initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        let scrollto = $(initial_nav).offset().top;
        scrollableBody.animate({scrollTop: scrollto}, 1500, "easeInOutExpo");
      }
    }
  });

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Toggle Navbar On Mobile Screens
  $(document).on("click", ".mobile-nav-toggle", function () {
    body.toggleClass("mobile-nav-active");
    $(".mobile-nav-toggle i").toggleClass("icofont-navigation-menu icofont-close");
  });
  $(document).on("click", function (e) {
    let container = $(".mobile-nav-toggle");
    container.is(e.target) || 0 !== container.has(e.target).length || body.hasClass("mobile-nav-active") && (body.removeClass("mobile-nav-active"), $(".mobile-nav-toggle i").toggleClass("icofont-navigation-menu icofont-close"));
  });

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Navigation Active State On Scroll
  let
    nav_sections = $("section"),
    main_nav = $(".nav-menu, #mobile-nav");
  $(window).on("scroll", (function () {
    let cur_pos = $(this).scrollTop() + 300;
    nav_sections.each((function () {
      let top = $(this).offset().top, bottom = top + $(this).outerHeight();
      cur_pos >= top && cur_pos <= bottom && (cur_pos <= bottom && main_nav.find("li").removeClass("active"), main_nav.find("a[href=\"#" + $(this).attr("id") + "\"]").parent("li").addClass("active")), cur_pos < 200 && $(".nav-menu ul:first li:first").addClass("active");
    }));
  }));

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Skills Progress Bar
  $(".skills-content").waypoint((function () {
    $(".progress .progress-bar").each((function () {
      $(this).css("width", $(this).attr("aria-valuenow") + "%");
    }));
  }), {offset: "80%"});

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Init AOS
  AOS.init({duration: 1e3, once: !0});

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  /* Form Validation & Ajax Submission */

  // Get Form Elements
  let formName = document.getElementById("name");
  let formEmail = document.getElementById("email");
  let formSubject = document.getElementById("subject");
  let formMessage = document.querySelector("textarea");
  let formSubmit = document.querySelector("button[type='submit']");
  let alertContainer = document.querySelector(".form-alert");
  let alertContainerJQ = $(".form-alert");
  let formAlert;
  // Form Submit Button Listener
  formSubmit.addEventListener("click", formValidation);

  // Clicked Submit Button Counter
  let i = 0;

  // Form Validation
  function formValidation(e) {
    // Stop Form Loading
    e.preventDefault();
    if (i !== 0) {
      // Set Warning Alert
      setAlert("warning", "Warning", "You already sent a message. To send another one, please refresh the page");
      // Show Alert
      alertContainer.innerHTML = formAlert;
      alertContainerJQ.fadeIn();
    } else {
      // Check Empty Fields
      if (
        empty(formName.value) ||
        empty(formEmail.value) ||
        empty(formSubject.value) ||
        empty(formMessage.value)
      ) {
        setAlert("danger", "Error", "All Fields Are Required");
      }
      // Check Email Contain '@' Symbol
      else if (!isEmail(formEmail.value)) {
        setAlert("danger", "Error", "Enter a correct email");
      }
      // No Errors
      else {
        // Increase Button Submitted Counter
        i++;
        // Send Form Values
        $("#contact-form").ajaxForm();
        setAlert("success", "Success", "Your message has been sent");
      }
      // Show Alert
      alertContainer.innerHTML = formAlert;
      alertContainerJQ.fadeIn();
    }
    e.target.reset();
  }

  // Check Email Validation Function
  function isEmail(val) {
    // Regular Expression Constant
    const exp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // Return True Or False According To Email Value
    return exp.test(String(val).toLowerCase());
  }

  // Check Empty Validation Function
  function empty(val) {
    // Return True Or False According To Element Value
    return val.length <= 0;
  }

  // Set Alert Message
  function setAlert($color, $state, $message) {
    formAlert = `<div class="alert alert-${$color} alert-dismissible fade show">
    <a href="#" class="close" data-dismiss="alert" aria-label="close">
      &times;
    </a>
    <strong>${$state}!</strong> ${$message}
  </div>`;
  }

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Lazy Loading For Images, Then IsoTop Filter Trigger
  $(".lazy").lazy({
    effect: "fadeIn",
    effectTime: 2000,
    threshold: 0,
    beforeLoad: function (element) {
      element.parent().addClass("lazy-parent");
    },
    afterLoad: function (element) {
      // called after an element was successfully handled
      let certificationsIsotope = $("#certifications .portfolio-container").isotope({itemSelector: ".portfolio-item"});
      let portfolioIsotope = $("#portfolio .portfolio-container").isotope({itemSelector: ".portfolio-item"});
      let venobox = $(".venobox");
      $("#portfolio-flters li").on("click", function () {
        $("#portfolio-flters li").removeClass("filter-active"), $(this).addClass("filter-active"), portfolioIsotope.isotope({filter: $(this).data("filter")});
      });
      venobox.venobox({share: !1});
      $("#portfolio-filters li").on("click", function () {
        $("#portfolio-filters li").removeClass("filter-active"), $(this).addClass("filter-active"), certificationsIsotope.isotope({filter: $(this).data("filter")});
      });
      venobox.venobox({share: !1});
      element.parent().removeClass("lazy-parent");
    }
  });

  /* -------------------------------------------------------------------------------------------------------------------------------- */

  // Dynamic Current Year Date
  let currentDate = new Date();
  document.getElementById("footer-copyright-year").innerHTML = String(currentDate.getFullYear());
  document.getElementById("learning_journey_current_year").innerHTML = String(currentDate.getFullYear());
});
