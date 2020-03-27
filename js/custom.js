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
const today = new Date();
const oneDay = 1000*60*60*22; //22 hours instead of 24 just to make sure each morning is a new psalm

//check for stored variables
if (!localStorage.getItem('psalmNumber')){ // no stored psalm so set defaults

  lastViewDate = today.toLocaleDateString();
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

  let dayDiff = (today.getTime() - lastViewDate.getTime())/oneDay;

    // more than 20 hours have passed since lastViewDate? Increase psalmNumber by 1 and update last view date
    if (dayDiff>1) {  
         psalmNumber++;
         if(psalmNumber==172){psalmNumber=1};//reset to first psalm if we have reached the last psalm
         localStorage.setItem('psalmNumber', psalmNumber);
          localStorage.setItem("lastViewDate", today.toLocaleDateString())
     } 


}




  
 
/* ================================
                                  |
Functions needed on every page    |
for UI to work                    |
                                  |
===================================*/
/* get page and search params
==============================*/
const prayersCsv = "{{site.url}}/prayers.csv";
const page = window.location.pathname.slice(1).replace(".html","");
const queryString = window.location.search; // see https://www.sitepoint.com/get-url-parameters-with-javascript/ for how to use this.
const urlParams = new URLSearchParams(queryString);


/* Sliding Side Bar Javascript controls
========================*/
 
      $("#sidebar").mCustomScrollbar({
          theme: "minimal"
      });

      $('#dismiss, .overlay').on('click', function () {
          $('#sidebar').removeClass('active');
        //  $('.overlay').removeClass('active');
      });

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').addClass('active');
        //  $('.overlay').addClass('active');
          $('.collapse.in').toggleClass('in');
          $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });


/* Side bar settings controls
========================*/
//set the paslm and store it for the future  
$("#psalm-select").change(function(){
  if(page=="" || page == "index"){
    populateDailyPsalm($(this).val()); // update the view
  }
  localStorage.setItem("psalmNumber",$(this).val());
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

        
          /* Jump to Slide if param is set
           ================================= */
          var slideNumber = Number(urlParams.get("slide"));
          if ($.isNumeric(slideNumber)) {
            $("#prayer-carousel").carousel(slideNumber);
          }



        /* Daily Psalm javascript
        ================================= */
              /* 
              set psalm numbers
              */

        function populateDailyPsalm(psNumber){
              let $chapterNumber = psNumber;
              let ps19BlockId = 1;

              if (psNumber >= 119 && psNumber <= 140) {
                $chapterNumber = 119;
                ps19BlockId = psNumber - 119;
              } else if (psNumber > 140) {
                $chapterNumber = psNumber - 21;
              }

              $.ajax({
              type: "GET",
              url: "{{site.url}}/bible/19-Ps.xml",
              dataType: "xml",
              success: function(xml) {
                  var $chapterHTML = '';
                  var chapter = $(xml).find('chapter[id="psalms.'+$chapterNumber+'"]');
                  var $mainText = $("#daily-psalm");
                  

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
              }); // ./ Read and format XML 
          }
          populateDailyPsalm(psalmNumber);
          

        /* Index page custom controls 
        ==========================*/

        // Timer related controls
            var audio = new Audio('{{site.url}}/sounds/quiet-thought-clip.m4a');
            var prayerTimer = $("#prayer-timer");//document.getElementById('prayer-timer');

            $("#start-timer").click(function(){ 
                audio.currentTime = 0;    
                prayerTimer.get(0).play();
            });

            $("#stop-timer").click(function(){ 
                prayerTimer.get(0).pause(); 
                  audio.pause();
            });

            $("#restart-timer").click(function(){ 
                prayerTimer.get(0).currentTime = 0;
                prayerTimer.get(0).play();

            }); 

            //play the ending sound when video ends
            prayerTimer.get(0).addEventListener('ended',myHandler,false);
            function myHandler(e) {
                audio.play();
            }



        

          
  



} // ./ Main Switch Function




}); // ./ $(document).ready(function ()