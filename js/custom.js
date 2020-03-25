---
---
$(document).ready(function () {
/* Local Storage
============================*/
/* 
variables that need stored
  psalmNumber
  lastViewDate (only update psalm # if a different day)
  openingPrayerId
  prayerOfIntentId
  silentPrayerTime
  closingPrayerId


  === functions:
  getSetting() gets the localstorage variable
  updateSetting() updates the variable


  
*/
var psalmNumber, lastViewDate, openingPrayerId, prayerOfIntentId, silentPrayerTime, closingPrayerId;
var today = new Date();

//check for stored variables
if (!localStorage.getItem('psalmNumber')){ // no stored psalm so set defaults

  lastViewDate = today.toLocaleDateString();//getFullYear()+', '+(today.getMonth()+1)+', '+today.getDate();
  psalmNumber = 1;
  openingPrayerId = 0;
  prayerOfIntentId = 1; 
  silentPrayerTime = 20;
  closingPrayerId = 2;

  localStorage.setItem('lastViewDate', lastViewDate);
  localStorage.setItem('psalmNumber', psalmNumber);
  localStorage.setItem('openingPrayerId', openingPrayerId);
  localStorage.setItem('prayerOfIntentId', prayerOfIntentId);
  localStorage.setItem('silentPrayerTime', silentPrayerTime);
  localStorage.setItem('closingPrayerId', closingPrayerId);


} else { // there are locally stored variables already so read those 

  lastViewDate = new Date(localStorage.getItem('lastViewDate'));
  psalmNumber = localStorage.getItem('psalmNumber');
  openingPrayerId = localStorage.getItem('openingPrayerId');
  prayerOfIntentId = localStorage.getItem('prayerOfIntentId'); 
  silentPrayerTime = localStorage.getItem('silentPrayerTime');
  closingPrayerId = localStorage.getItem('closingPrayerId');

    if (today > lastViewDate) {  
         console.log("today date:"+today);  
         console.log("last view date:"+lastViewDate);  
     }else {  
         console.log("Today Date is less than last view date.");  
     }  
  
     localStorage.clear();
}


// compare lastViewDate to today
    // if lastViewDate is older than today, 
        // increase psalmNumber by 1
        // update lastViewDate to today
    // else 
        // do not increase psalmNumber or change lastViewDate

// 



  

/* ================================
                                  |
Functions needed on every page    |
for UI to work                    |
                                  |
===================================*/

/* Sliding Side Bar Javascript controls
========================*/

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




/* ================================
                                  |
Generic Functions used by code    |
below                             |
                                  |
===================================*/




/* ================================
                                  |
Main switch statement for to run  |
different code depending on page  | 
called                            |
                                  |
===================================*/



  /* get page and search params
  ==============================*/
  const prayersCsv = "{{site.url}}/prayers.csv";
  const page = window.location.pathname.slice(1).replace(".html","");
  const queryString = window.location.search; // see https://www.sitepoint.com/get-url-parameters-with-javascript/ for how to use this.
  const urlParams = new URLSearchParams(queryString);








switch (page) { //depending on which page is being called do the code associated with it.

/* This is prayer.html
  ==============================*/
  case 'prayer': //display single prayer

    //get prayerid param
    var prayerId = Number(urlParams.get("prayerId"));
    var numberOfPrayers=0;


function setPrayers(results){ // this is called by the Papa parse object below after it parses the csv file
          numberOfPrayers = Object.keys(results.data).length;
          //make tags into links if tags exist
          let tagsCode = "";
          if (results.data[prayerId].tags != ""){
            let tags = results.data[prayerId].tags.split(",");
            if (tags.length > 0) {
              tagsCode = "<strong>Tags:</strong> "
              for (const i in tags) {
                tagsCode += '<a class="badge badge-info" href="{{site.url}}/tag.html?tag='+tags[i]+'">'+tags[i]+'</a> ';
                
              }
            }
          }
          
          //Set source code if there is a source in the CSV
          let sourceCode = "";
          if (results.data[prayerId].source != "") {
              sourceCode = "Source:&nbsp;" + '<a href="' + results.data[prayerId].sourceLink + '">' + results.data[prayerId].source + '</a>';
          }

        $("#prayer-title").html(results.data[prayerId].title);
        $("#prayer-tags").html(tagsCode);
        $("#prayer-content").html(results.data[prayerId].content);
        $("#prayer-source").html(sourceCode);
}

// parse CSV file and call the setPrayers Function above
    Papa.parse(prayersCsv, {
      download: true,
      header: true,
      complete: function(results){setPrayers(results);} //Have to do this complicated thing so that I can access global variables
    });

// make prev and next buttons on main nav switch between prayers   
    $("#next").click(function(){
      if(Number(prayerId)>=(numberOfPrayers-1)){prayerId = numberOfPrayers-1}else{prayerId=prayerId+1}
      window.location.assign("{{site.url}}/prayer.html?prayerId="+prayerId);
    });
    $("#prev").click(function(){
      if (prayerId=="0"){prayerId = 0;}else{prayerId=prayerId-1;}
      window.location.assign("{{site.url}}/prayer.html?prayerId="+prayerId);
    });
    break;
/* end prayers.html code
=========================*/



  case 'tags': //display list of prayers tagged with parameter
  
    break;

 /* we are on the main page so do all the magic
 =======================================*/   
  case 'index'://main page so do all the magic    
  default: // or main page so 


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
      /* 
      store psalm # in local storage and rotate through 172
      */
      $.ajax({
      type: "GET",
      url: "{{site.url}}/bible/19-Ps.xml",
      dataType: "xml",
      success: function(xml) {
          var $chapterNumber = 119; 
          var $chapterHTML = '';
          var chapter = $(xml).find('chapter[id="psalms.119"]');
          var $mainText = $("#daily-psalm");
          var ps19BlockId = 21;

      /*format xml for ps 119
      ==========================*/
        if ($chapterNumber == 119) {
          $chapterHTML += '<div class="bible-chapter" data-chapter="119"><h4>Psalm 119</h4>';
          var $thisPoetryBlocks = chapter.find('poetryblock');
        
          $thisPoetryBlocks.each(function(index){
            if (index == ps19BlockId ){
              var $thisPoetryBlock = $(this);
              var $sectionName = $thisPoetryBlock.prev();
              $chapterHTML +='<strong>'+ $sectionName.text() +'</strong>';

              $thisPoetryBlock.each(function(){
                var $this = $(this);
                  
                let $thisList = $(this);
                    $chapterHTML += '<ul class="scripture-list poetry-list">';
                    $chapterHTML += $thisList.html().replace(/<poem>/g,'<li>').replace(/<\/poem>/g,' </li>');
                    $chapterHTML += '</ul>';

              });

            }
          });
          
          $chapterHTML += '</div>';
          



        } else { 
      /*format xml for all other chapters
      ==========================*/
          chapter.each(function () {
            var $thisChapter = $(this);

            $chapterHTML += '<div class="bible-chapter" data-chapter="' + $thisChapter.attr('display') + '">';

            if ($mainText.attr('data-current-book-title') === 'Psalms') {
              $chapterHTML += '<h4>Psalm ' + $thisChapter.attr('display') + '</h4>';
            } else {
              $chapterHTML += '<h4>Chapter ' + $thisChapter.attr('display') + '</h4>';
            }
            

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
          
            $chapterHTML += '</div>';
          });
        }
          
          //Set the daily reading to the formatted HTML
        
          $mainText.html($chapterHTML);
      },

      error: function() {
      alert("The XML File could not be processed correctly.");
      }
      });
      // ./ Read and format XML 

} // ./ Main Switch Function




}); // ./ $(document).ready(function ()