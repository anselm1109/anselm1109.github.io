---
---
  
  /* Timer creation and music player
================================= */
  $("#prayer-timer").TimeCircles({
    "start": false,
    "bg_width": 0.4,
    "total_duration": 1201,
    "fg_width": 0.04666666666666667,
    "time": {
        "Days": {
            "show": false
        },
        "Hours": {
            "show": false
        },
        "Minutes": {
            "text": "Minutes",
            "color": "#45cafc",
            "show": true
        },
        "Seconds": {
            "show": false
        }
    }
  }); 

  
  var audio = new Audio('{{site.url}}/sounds/quiet-thought-clip.m4a');
  $("#start-timer").click(function(){ $("#prayer-timer").TimeCircles().start().addListener(function(unit, value, total){
        
    if (total==0){ 
        audio.currentTime = 0;
        audio.play();
      }

  },"all");});
  $("#stop-timer").click(function(){ $("#prayer-timer").TimeCircles().stop(); 
      if (audio) { audio.pause();}
  });
  $("#restart-timer").click(function(){ $("#prayer-timer").TimeCircles().restart(); }); 
  $("#make-timer").click(function(){$("#prayer-timer").TimeCircles().rebuild(); }); 

  $('#prayer-carousel').on('slid.bs.carousel', function () {
   if ($('#prayer-timer-item').hasClass('active')){
    $("#prayer-timer").TimeCircles().rebuild();
   }
})
// ./ end Timer Javascript



/* Daily Psalm javascript
================================= */
var $chapterHTML = '';

function formatBible(theChapter) {
    var $this = $(theChapter),
        $thisType = $this[0].nodeName;

    if ($thisType === 'p') {

      $this.find('head1').each(function () {
        var $thisHeading = $(this),
            $thisText = $thisHeading.text();

        $thisHeading.replaceWith('<h4>' + $thisText + '</h4>');
      });

      $this.find('otquote').each(function () {
        var $thisQuote = $(this);

        $thisQuote.replaceWith('<strong>' + $thisQuote.html() + '</strong>');
      });

      $chapterHTML += '<p>' + $this.html() + '</p>';
    } else if ($thisType == 'dynprose') {
      $chapterHTML += '<blockquote>' + $this.html() + '</blockquote>';
    } else if ($thisType == 'supertitle') {
      $chapterHTML += '<h4>' + $this.text() + '</h4>';
    } else if ($thisType == 'head1') {
      $chapterHTML += '<h5>' + $this.text() + '</h5>';
    } else if ($thisType == 'head2' || $thisType == 'head3') {
      $chapterHTML += '<p><em>' + $this.html().replace(/'/g, '') + '</em></p>';
    } else if ($thisType == 'otquote') {
      $chapterHTML += '<strong>' + $this.html() + '</strong>';
    } else if ($thisType == 'psalm') {
      $chapterHTML += '';
    } else if ($thisType == 'blockindent' || $thisType == 'otquote') {
      $chapterHTML += '<blockquote>' + $this.html() + '</blockquote>';
    } else if ($thisType == 'list' || $thisType == 'listtenwords') {
      var $thisList = $(this);
      $chapterHTML += '<ul class="scripture-list">';
      $thisList.children().each(function () {
        var $thisItem = $(this);

        if ($thisItem[0].nodeName === 'verse') {
          var $thisReference = $thisItem.attr('reference');
          var $thisNumber = $thisItem.attr('display-number');

          $chapterHTML += '<verse reference="' + $thisReference + '" display-number="' + $thisNumber + '">';
          $thisItem.children().each(function() {
            $thisChild = $(this);
            $chapterHTML += '<li>' + $thisChild.html() + '</li>';
          });
          $chapterHTML += '</verse>';
        } else {
          $chapterHTML += '<li>' + $thisItem.html() + '</li>';
        }
      });
      $chapterHTML += '</ul>';
    } else if ($thisType == 'poetryblock') {
      let $thisList = $(this);
      $chapterHTML += '<ul class="scripture-list poetry-list">';
      $chapterHTML += $thisList.html().replace(/<poem>/g,'<li>').replace(/<\/poem>/g,' </li>');
      $chapterHTML += '</ul>';
    } else if ($thisType == 'listtable') {
      let $thisList = $(this);
      $chapterHTML += '<ul class="scripture-list">';
      $chapterHTML += $thisList.html().replace(/<row>/g, '<li>').replace(/<\/row>/g, '</li>');
      $chapterHTML += '</ul>';
    } else if ($thisType == 'otdynprose') {
      let $this = $(this);

      $this.find('otquote').each(function () {
        var $thisQuote = $(this);

        $thisQuote.replaceWith('<strong>' + $thisQuote.text() + '</strong>');
      });

      $chapterHTML += $this.html();
    } else if ($thisType == 'verse') {
      var $thisVerse = $this;
      var $thisReference = $thisVerse.attr('reference');
      var $thisNumber = $thisVerse.attr('display-number');

      $chapterHTML += '<verse reference="' + $thisReference + '" display-number="' + $thisNumber + '">';
      $thisVerse.children().each(function () {
        var $this = $(this),
            $thisType = $this[0].nodeName;

        if ($thisType === 'p') {

          $this.find('head1').each(function () {
            var $thisHeading = $(this),
                $thisText = $thisHeading.text();

            $thisHeading.replaceWith('<h4>' + $thisText + '</h4>');
          });

          $this.find('otquote').each(function () {
            var $thisQuote = $(this);

            $thisQuote.replaceWith('<strong>' + $thisQuote.text() + '</strong>');
          });

          $chapterHTML += '<p>' + $this.html() + '</p>';
        } else if ($thisType == 'dynprose') {
          $chapterHTML += '<blockquote>' + $this.html() + '</blockquote>';
        } else if ($thisType == 'supertitle') {
          $chapterHTML += '<h4>' + $this.text() + '</h4>';
        } else if ($thisType == 'head1') {
          $chapterHTML += '<h5>' + $this.text() + '</h5>';
        } else if ($thisType == 'head2' || $thisType == 'head3') {
          $chapterHTML += '<p><em>' + $this.html().replace(/'/g, '') + '</em></p>';
        } else if ($thisType == 'otquote') {
          $chapterHTML += '<strong>' + $this.text() + '</strong>';
        } else if ($thisType == 'psalm') {
          $chapterHTML += '';
        } else if ($thisType == 'blockindent' || $thisType == 'otquote') {
          $chapterHTML += '<blockquote>' + $this.html() + '</blockquote>';
        } else if ($thisType == 'list' || $thisType == 'listtenwords') {
          var $thisList = $(this);
          $chapterHTML += '<ul class="scripture-list">';
          $thisList.find('item').each(function () {
            var $thisItem = $(this);
            $chapterHTML += '<li>' + $thisItem.html() + '</li>';
          });
          $chapterHTML += '</ul>';
        } else if ($thisType == 'poetryblock') {
          let $thisList = $(this);
          $chapterHTML += '<ul class="scripture-list poetry-list">';
          $chapterHTML += $thisList.html().replace(/<poem>/g,'<li>').replace(/<\/poem>/g,' </li>');
          $chapterHTML += '</ul>';
        } else if ($thisType === 'listtable') {
          let $thisList = $(this);
          $chapterHTML += '<ul class="scripture-list">';
          $chapterHTML += $thisList.html().replace(/<row>/g, '<li>').replace(/<\/row>/g, '</li>');
          $chapterHTML += '</ul>';
        } else if ($thisType == 'otdynprose') {
          let $this = $(this);

          $this.find('otquote').each(function () {
            var $thisQuote = $(this);

            $thisQuote.replaceWith('<strong>' + $thisQuote.text() + '</strong>');
          });

          $chapterHTML += $this.html();
        } else {
          let $this = $(this);
          $chapterHTML += '<p>' + $this.html() + '</p>';
        }
      });
      $chapterHTML += '</verse>';
    } else {
      let $this = $(this);
      $chapterHTML += '<p>' + $this.html() + '</p>';
    }
  }










$.ajax({
type: "GET",
url: "{{site.url}}/bible/19-Ps.xml",
dataType: "xml",
success: function(xml) {
    
    var chapter = $(xml).find('chapter[id="psalms.119"]');
    var $mainText = $("#daily-psalm");

    

/*This javascript reads and formats the XML
==========================*/
    chapter.each(function () {
      var $thisChapter = $(this);

      $chapterHTML += '<div class="bible-chapter" data-chapter="' + $thisChapter.attr('display') + '">';

      if ($mainText.attr('data-current-book-title') === 'Psalms') {
        $chapterHTML += '<h4>Psalm ' + $thisChapter.attr('display') + '</h4>';
      } else {
        $chapterHTML += '<h4>Chapter ' + $thisChapter.attr('display') + '</h4>';
      }
      $thisChapter.children().each(formatBible($thisChapter));
/*
      $thisChapter.children().each(function () {
        var $this = $(this),
            $thisType = $this[0].nodeName;

        if ($thisType === 'p') {

          $this.find('head1').each(function () {
            var $thisHeading = $(this),
                $thisText = $thisHeading.text();

            $thisHeading.replaceWith('<h4>' + $thisText + '</h4>');
          });

          $this.find('otquote').each(function () {
            var $thisQuote = $(this);

            $thisQuote.replaceWith('<strong>' + $thisQuote.html() + '</strong>');
          });

          $chapterHTML += '<p>' + $this.html() + '</p>';
        } else if ($thisType == 'dynprose') {
          $chapterHTML += '<blockquote>' + $this.html() + '</blockquote>';
        } else if ($thisType == 'supertitle') {
          $chapterHTML += '<h4>' + $this.text() + '</h4>';
        } else if ($thisType == 'head1') {
          $chapterHTML += '<h5>' + $this.text() + '</h5>';
        } else if ($thisType == 'head2' || $thisType == 'head3') {
          $chapterHTML += '<p><em>' + $this.html().replace(/'/g, '') + '</em></p>';
        } else if ($thisType == 'otquote') {
          $chapterHTML += '<strong>' + $this.html() + '</strong>';
        } else if ($thisType == 'psalm') {
          $chapterHTML += '';
        } else if ($thisType == 'blockindent' || $thisType == 'otquote') {
          $chapterHTML += '<blockquote>' + $this.html() + '</blockquote>';
        } else if ($thisType == 'list' || $thisType == 'listtenwords') {
          var $thisList = $(this);
          $chapterHTML += '<ul class="scripture-list">';
          $thisList.children().each(function () {
            var $thisItem = $(this);

            if ($thisItem[0].nodeName === 'verse') {
              var $thisReference = $thisItem.attr('reference');
              var $thisNumber = $thisItem.attr('display-number');

              $chapterHTML += '<verse reference="' + $thisReference + '" display-number="' + $thisNumber + '">';
              $thisItem.children().each(function() {
                $thisChild = $(this);
                $chapterHTML += '<li>' + $thisChild.html() + '</li>';
              });
              $chapterHTML += '</verse>';
            } else {
              $chapterHTML += '<li>' + $thisItem.html() + '</li>';
            }
          });
          $chapterHTML += '</ul>';
        } else if ($thisType == 'poetryblock') {
          let $thisList = $(this);
          $chapterHTML += '<ul class="scripture-list poetry-list">';
          $chapterHTML += $thisList.html().replace(/<poem>/g,'<li>').replace(/<\/poem>/g,' </li>');
          $chapterHTML += '</ul>';
        } else if ($thisType == 'listtable') {
          let $thisList = $(this);
          $chapterHTML += '<ul class="scripture-list">';
          $chapterHTML += $thisList.html().replace(/<row>/g, '<li>').replace(/<\/row>/g, '</li>');
          $chapterHTML += '</ul>';
        } else if ($thisType == 'otdynprose') {
          let $this = $(this);

          $this.find('otquote').each(function () {
            var $thisQuote = $(this);

            $thisQuote.replaceWith('<strong>' + $thisQuote.text() + '</strong>');
          });

          $chapterHTML += $this.html();
        } else if ($thisType == 'verse') {
          var $thisVerse = $this;
          var $thisReference = $thisVerse.attr('reference');
          var $thisNumber = $thisVerse.attr('display-number');

          $chapterHTML += '<verse reference="' + $thisReference + '" display-number="' + $thisNumber + '">';
          $thisVerse.children().each(function () {
            var $this = $(this),
                $thisType = $this[0].nodeName;

            if ($thisType === 'p') {

              $this.find('head1').each(function () {
                var $thisHeading = $(this),
                    $thisText = $thisHeading.text();

                $thisHeading.replaceWith('<h4>' + $thisText + '</h4>');
              });

              $this.find('otquote').each(function () {
                var $thisQuote = $(this);

                $thisQuote.replaceWith('<strong>' + $thisQuote.text() + '</strong>');
              });

              $chapterHTML += '<p>' + $this.html() + '</p>';
            } else if ($thisType == 'dynprose') {
              $chapterHTML += '<blockquote>' + $this.html() + '</blockquote>';
            } else if ($thisType == 'supertitle') {
              $chapterHTML += '<h4>' + $this.text() + '</h4>';
            } else if ($thisType == 'head1') {
              $chapterHTML += '<h5>' + $this.text() + '</h5>';
            } else if ($thisType == 'head2' || $thisType == 'head3') {
              $chapterHTML += '<p><em>' + $this.html().replace(/'/g, '') + '</em></p>';
            } else if ($thisType == 'otquote') {
              $chapterHTML += '<strong>' + $this.text() + '</strong>';
            } else if ($thisType == 'psalm') {
              $chapterHTML += '';
            } else if ($thisType == 'blockindent' || $thisType == 'otquote') {
              $chapterHTML += '<blockquote>' + $this.html() + '</blockquote>';
            } else if ($thisType == 'list' || $thisType == 'listtenwords') {
              var $thisList = $(this);
              $chapterHTML += '<ul class="scripture-list">';
              $thisList.find('item').each(function () {
                var $thisItem = $(this);
                $chapterHTML += '<li>' + $thisItem.html() + '</li>';
              });
              $chapterHTML += '</ul>';
            } else if ($thisType == 'poetryblock') {
              let $thisList = $(this);
              $chapterHTML += '<ul class="scripture-list poetry-list">';
              $chapterHTML += $thisList.html().replace(/<poem>/g,'<li>').replace(/<\/poem>/g,' </li>');
              $chapterHTML += '</ul>';
            } else if ($thisType === 'listtable') {
              let $thisList = $(this);
              $chapterHTML += '<ul class="scripture-list">';
              $chapterHTML += $thisList.html().replace(/<row>/g, '<li>').replace(/<\/row>/g, '</li>');
              $chapterHTML += '</ul>';
            } else if ($thisType == 'otdynprose') {
              let $this = $(this);

              $this.find('otquote').each(function () {
                var $thisQuote = $(this);

                $thisQuote.replaceWith('<strong>' + $thisQuote.text() + '</strong>');
              });

              $chapterHTML += $this.html();
            } else {
              let $this = $(this);
              $chapterHTML += '<p>' + $this.html() + '</p>';
            }
          });
          $chapterHTML += '</verse>';
        } else {
          let $this = $(this);
          $chapterHTML += '<p>' + $this.html() + '</p>';
        }
      });
*/
      $chapterHTML += '</div>';
    });
    
    //Set the daily reading to the formatted HTML
   
    $mainText.html($chapterHTML);
},

error: function() {
alert("The XML File could not be processed correctly.");
}
});
// ./ Read and format XML 




/* Sliding Side Bar Javascript controls
========================*/
  $(document).ready(function () {
      $("#sidebar").mCustomScrollbar({
          theme: "minimal"
      });

      $('#dismiss, .overlay').on('click', function () {
          $('#sidebar').removeClass('active');
          $('.overlay').removeClass('active');
      });

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').addClass('active');
          $('.overlay').addClass('active');
          $('.collapse.in').toggleClass('in');
          $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });
  });
