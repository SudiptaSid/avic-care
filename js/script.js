// Preloader
jQuery(window).on("load", function () {
  jQuery(".preloader").fadeOut(500);
});

// Back to top
jQuery(function ($) {
  if ($("#backToTop").length) {
    var scrollTrigger = 100, // px
      backToTop = function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > scrollTrigger) {
          $("#backToTop").addClass("show");
        } else {
          $("#backToTop").removeClass("show");
        }
      };
    backToTop();
    $(window).on("scroll", function () {
      backToTop();
    });
    $("#backToTop").on("click", function (e) {
      e.preventDefault();
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        1000
      );
    });
  }
});

// Sticky Navbar
$(window).scroll(function () {
  if ($(window).scrollTop() >= 100) {
    $(".mainHeader").addClass("sticky");
  } else {
    $(".mainHeader").removeClass("sticky");
  }
});

// Hero Home
$(".heroHomeSlider").owlCarousel({
  items: 1,
  nav: true,
  navText: [
    "<em class='fa fa-angle-left'></em>",
    "<em class='fa fa-angle-right'></em>",
  ],
  dots: false,
  loop: true,
  autoplayTimeout: 8000,
  autoplay: true,
  autoHeight: true,
});

// About Slider
$(".aboutSlider").owlCarousel({
  loop: true,
  margin: 10,
  nav: true,
  dots: false,
  items: 1,
  autoplay: true,
  autoplayTimeout: 3000,
  autoplayHoverPause: true,
  navText: [
    '<i class="fas fa-chevron-left"></i>',
    '<i class="fas fa-chevron-right"></i>',
  ]
});

// Testimonial Slider
$(".testimonialSlider").owlCarousel({
  loop: true,
  margin: 30,
  nav: true,
  dots: false,
  autoplay: true,
  autoplayTimeout: 5000,
  autoplayHoverPause: true,
  navText: [
    '<i class="fas fa-chevron-left"></i>',
    '<i class="fas fa-chevron-right"></i>',
  ],
  responsive: {
    0: {
      items: 1,
    },
    768: {
      items: 2,
    },
    992: {
      items: 3,
    }
  }
});

// number count for stats, using jQuery animate
$('.counting').each(function() {
  var $this = $(this),
      countTo = $this.attr('data-count');
  
  $({ countNum: $this.text()}).animate({
    countNum: countTo
  },
  {
    duration: 3000,
    easing:'linear',
    step: function() {
      $this.text(Math.floor(this.countNum));
    },
    complete: function() {
      $this.text(this.countNum);
      //alert('finished');
    }
  });
});

// Upload Button
(function ($) {
  // Browser supports HTML5 multiple file?
  var multipleSupport = typeof $("<input/>")[0].multiple !== "undefined",
    isIE = /msie/i.test(navigator.userAgent);

  $.fn.customFile = function () {
    return this.each(function () {
      var $file = $(this).addClass("uploadHidden"), // the original file input
        $wrap = $('<div class="uploadWrapper">'),
        $input = $('<input type="text" class="uploadInput" />'),
        // Button that will be used in non-IE browsers
        $button = $(
          '<button type="button" class="uploadBtn">Upload CV</button>'
        ),
        // Hack for IE
        $label = $(
          '<label class="uploadBtn" for="' + $file[0].id + '">Upload CV</label>'
        );

      $wrap.insertAfter($file).append($file, $input, isIE ? $label : $button);

      // Prevent focus
      $file.attr("tabIndex", -1);
      $button.attr("tabIndex", -1);

      $button.click(function () {
        $file.focus().click(); // Open dialog
      });

      $file.change(function () {
        var files = [],
          fileArr,
          filename;

        // If multiple is supported then extract
        // all filenames from the file array
        if (multipleSupport) {
          fileArr = $file[0].files;
          for (var i = 0, len = fileArr.length; i < len; i++) {
            files.push(fileArr[i].name);
          }
          filename = files.join(", ");

          // If not supported then just take the value
          // and remove the path to just show the filename
        } else {
          filename = $file.val().split("\\").pop();
        }

        $input
          .val(filename) // Set the value
          .attr("title", filename) // Show filename in title tootlip
          .focus(); // Regain focus
      });

      $input.on({
        blur: function () {
          $file.trigger("blur");
        },
        keydown: function (e) {
          if (e.which === 13) {
            // Enter
            if (!isIE) {
              $file.trigger("click");
            }
          } else if (e.which === 8 || e.which === 46) {
            // Backspace & Del
            // On some browsers the value is read-only
            // with this trick we remove the old input and add
            // a clean clone with all the original events attached
            $file.replaceWith(($file = $file.clone(true)));
            $file.trigger("change");
            $input.val("");
          } else if (e.which === 9) {
            // TAB
            return;
          } else {
            // All other keys
            return false;
          }
        },
      });
    });
  };

  // Old browser fallback
  if (!multipleSupport) {
    $(document).on("change", "input.customfile", function () {
      var $this = $(this),
        // Create a unique ID so we
        // can attach the label to the input
        uniqId = "customfile_" + new Date().getTime(),
        $wrap = $this.parent(),
        // Filter empty input
        $inputs = $wrap
          .siblings()
          .find(".uploadInput")
          .filter(function () {
            return !this.value;
          }),
        $file = $(
          '<input type="file" id="' +
            uniqId +
            '" name="' +
            $this.attr("name") +
            '"/>'
        );

      // 1ms timeout so it runs after all other events
      // that modify the value have triggered
      setTimeout(function () {
        // Add a new input
        if ($this.val()) {
          // Check for empty fields to prevent
          // creating new inputs when changing files
          if (!$inputs.length) {
            $wrap.after($file);
            $file.customFile();
          }
          // Remove and reorganize inputs
        } else {
          $inputs.parent().remove();
          // Move the input so it's always last on the list
          $wrap.appendTo($wrap.parent());
          $wrap.find("input").focus();
        }
      }, 1);
    });
  }
})(jQuery);

$("input[type=file]").customFile();