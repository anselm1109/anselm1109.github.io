---
---
$(document).ready(function () {
/* Local Storage
============================*/
/* 

create array of prayers here. 

  
*/



const prayersArr = [
  {% assign prayers = site.data.prayers %}
  {% for prayer in prayers %}
    [  
    `{{prayer.title}}`,`{{prayer.source}}`,`{{prayer.sourceLink}}`,`{{prayer.tags}}`,`{{prayer.content}}`
    ],
  {% endfor %}
];

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
//const prayersCsv = "{{site.url}}/prayers.csv";
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

//set silent prayer time and store it for the future  
$("#silent-prayer-select").change(function(){
  if(page=="" || page == "index"){
    populateTimer($(this).val()); // update the view
  }
  localStorage.setItem("silentPrayerTime",$(this).val());
});

//set opening prayer
$("#opening-prayer-select").change(function(){
  let id = Number($(this).val())
  if(page=="" || page == "index"){
    populatePrayers("opening-prayer",id);
  }
  localStorage.setItem("openingPrayerId",id);
});

//set  prayer of intent
$("#prayer-of-intent-select").change(function(){
  let id = Number($(this).val())
  if(page=="" || page == "index"){
    populatePrayers("prayer-of-intent",id);
  }
  localStorage.setItem("prayerOfIntentId",id);
});

// set closing prayer
$("#closing-prayer-select").change(function(){
  let id = Number($(this).val())
  if(page=="" || page == "index"){
    populatePrayers("closing-prayer",id);
  }
  localStorage.setItem("closingPrayerId",id);
});






/* ================================
                                  |
Generic Functions used by code    |
below                             |
                                  |
===================================*/




/* ================================
                                  |
Main switch statement for routing |
                                  |
===================================*/



switch (page) { //depending on which page is being called do the code associated with it.

/* This is prayer.html
  ==============================*/
case 'prayer': //display single prayer

    //get prayerid param
    var prayerId = Number(urlParams.get("prayerId"));
    var numberOfPrayers=0;


    function setPrayers(){ // this is called by the Papa parse object below after it parses the csv file
          numberOfPrayers = prayersArr.length;
          //make tags into links if tags exist
          let tagsCode = "";
          if (prayersArr[prayerId][3] != ""){
            let tags = prayersArr[prayerId][3].split(",");
            if (tags.length > 0) {
              tagsCode = "Tags: "
              for (const i in tags) {
                tagsCode += '<a class="badge badge-primary" href="{{site.url}}/tag.html?tag='+tags[i]+'">'+tags[i]+'</a> ';
                
              }
            }
          }
          
          //Set source code if there is a source in the CSV
          let sourceCode = "";
          if (prayersArr[prayerId][1] != "") {
              sourceCode = "Source:&nbsp;" + '<a href="' + prayersArr[prayerId][2] + '">' + prayersArr[prayerId][1] + '</a>';
          }

        $("#prayer-title").html(prayersArr[prayerId][0]);
        $("#prayer-tags").html(tagsCode);
        $("#prayer-content").html(prayersArr[prayerId][4]);
        $("#prayer-source").html(sourceCode);
    }
    setPrayers();
    /* parse CSV file and call the setPrayers Function above
        Papa.parse(prayersCsv, {
          download: true,
          header: true,
          complete: function(results){setPrayers(results);} //Have to do this complicated thing so that I can access global variables
        });*/

    // make prev and next buttons on main nav switch between prayers   
        $("#next, #prayer-next").click(function(){
          if(Number(prayerId)>=(numberOfPrayers-1)){prayerId = numberOfPrayers-1}else{prayerId=prayerId+1}
          setPrayers();
          return false;
        });
        $("#prev, #prayer-prev").click(function(){
          if (prayerId=="0"){prayerId = 0;}else{prayerId=prayerId-1;}
          setPrayers(); 
          return false;
        });
break;
/* end prayers.html code*/

/* prayer book home page
=========================*/
case 'prayer-book':


break;

case 'tags': //display list of prayers tagged with parameter

break;

/* we are on the main page so do all the magic
=======================================*/   
case 'index'://main page so do all the magic    
case '': // or main page so 
       




/* Populate the prayers accordingly
========================*/

        function populatePrayers(prayerCard,prayerId) {
           prayerCard="#"+prayerCard;
            $(prayerCard+"-title").html(prayersArr[prayerId][0]);
            $(prayerCard+"-content").html(prayersArr[prayerId][4]);
            $(prayerCard+"-source").html("Source: " + '<a href="' + prayersArr[prayerId][2] + '" target="_blank">' + prayersArr[prayerId][1] + '</a>'); 
                 
        } 
    
    

        
       
          /* Jump to Slide if param is set
           ================================= */
          var slideNumber = Number(urlParams.get("slide"));
          if ($.isNumeric(slideNumber)) {
            $("#prayer-carousel").carousel(slideNumber);
          }

        /* populate the silent prayer timer with correct time
        ================================= */
        function populateTimer(prayerTime){
            let timerFileName = "video/" + prayerTime + "mins.mp4";
            $("#prayer-timer").get(0).src = timerFileName;
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





          //Run these functions on home page load
          populatePrayers("opening-prayer",openingPrayerId);
          populatePrayers("closing-prayer",closingPrayerId);
          populatePrayers("prayer-of-intent",prayerOfIntentId);
          populateDailyPsalm(psalmNumber);
          populateTimer(silentPrayerTime);
          

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