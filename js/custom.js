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


const now = moment();


var storage = {
  personalPrayers: "Personal prayers go here", 
  openingPrayerId: 0, 
  prayerOfIntentId: 1, 
  silentPrayerTime: 20,
  closingPrayerId:2,
  darkModeState: "false",
  displayPersonalPrayers: "false",
  verseRefs: "true",
  versesInline: "false",
  psalmNumber: 0,
  lastPsalmChange: now.toISOString(true),
  psalmChangeTime1: '5',
  psalmChangeTime2: 'none',
  psalmChangeCount: 0,
  showStartScreen: "true",
  isaacMode: "false",
  setStore: function (kee,val) {
   localStorage.setItem(kee,val);
    this[kee] = val;
  },
}

 

// check all local storage variables and set to default if they don't exist;

for (let value of Object.entries(storage)) {
  if (value[0]!="setStore") {//prevent my object's method from being over written
   if(localStorage.getItem(value[0])===null || localStorage.getItem(value[0])===undefined || localStorage.getItem(value[0])==='') {
      localStorage.setItem(value[0],value[1]);    
   } else { // since localStorage does exist set the storage object properties to those values
     storage[value[0]]=localStorage.getItem(value[0]);
   }
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
const prayerTimer = $("#prayer-timer");
const navControls = $(".nav-control");


/* populate the silent prayer timer with correct time
        ================================= */
        function populateTimer(prayerTime){
          // prayerTime is a basic number either 10 15 20 25 or 30
          // light mode filename is format 20Mins.mp4 | Dark mode file name is 20minsDark.mp4
          let darkFile = ""
          if (storage.darkModeState === "true" ) {
             darkFile = "Dark";
          } else {
             darkFile = "";
          }
          
          let timerFileName = "video/" + prayerTime + "mins" + darkFile + ".mp4";
          prayerTimer.get(0).src = timerFileName;
      }








/* ================================
                                  |
Main switch statement for routing |
                                  |
===================================*/



switch (page) { //depending on which page is being called do the code associated with it.

/* This is prayer.html
  ==============================*/
case 'prayer': //display single prayer
    navControls.addClass("nav-control-active");
    const setPrayer = $(".set-prayer");
    //get prayerid param
    var prayerId = Number(urlParams.get("prayerId"));
    var numberOfPrayers=0;

    // populate all the divs and such on the page with the correct information from the prayer array
    function setPrayers(){ 
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
        setPrayer.each(function(){
          $( this ).data("prayerCard",$(this).attr("data-prayer"));
        });
        setPrayer.data("prayerId",prayerId);
    }
    setPrayers(); //makes the above function run on first page load
  

    // make prev and next buttons on main nav switch between prayers without having to reload the page
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

    //Update localStorage based on link click of set prayers to divs
    setPrayer.click(function(){
      localStorage.setItem($( this ).data("prayerCard"),$( this ).data("prayerId"));
     
      $('.toast').toast('show');
    });




break;
/* end prayers.html code*/

/* ================================
                                  |
Welcoming Prayer page code        |
                                  |
===================================*/
case "welcoming-prayer":
  navControls.addClass("nav-control-active");
    const slides = $("#welcoming-carousel").children();
    slides.each(function (index) {
      $(this).css("display","grid");
      if (index > 0) {$(this).hide();}
    });
    const len = slides.length;
  
    let slideIndex = 0;

    // make prev and next buttons on main nav switch between animations without having to reload the page
    $("#next, .carousel-control-next").click(function(){
        for (i=0; i<len; i++) {
          if (slides.eq(i).css("display")=="grid") {
            slideIndex=i;
          }
        }      
        slides.eq(slideIndex).fadeOut(500);
          if (slideIndex == len-1) {
            slideIndex=0;
          } else {
            slideIndex++;
          }
        slides.eq(slideIndex).delay(500).fadeIn(500);    
        return false;
    });


    $("#prev, .carousel-control-prev").click(function(){
      for (i=0; i<len; i++) {
        if (slides.eq(i).css("display")=="grid") {
          slideIndex=i;
        }
      }      
      // 

      slides.eq(slideIndex).fadeOut(500);

        if (slideIndex == 0) {
          slideIndex=len-1;
        } else {
          slideIndex--;
        }
    slides.eq(slideIndex).delay(500).fadeIn(500);   
      return false;
    });



break;
case "personal-prayers":
/* ================================
                                  |
Prayers for self and others code  |
                                  |
===================================*/
navControls.addClass("nav-control-inactive");
/* on personal-prayers.html only : save the textarea content to local storage
======================================================*/
  const personalPrayersTextarea = $("#personal-prayers-textarea");
  personalPrayersTextarea.val(localStorage.getItem("personalPrayers").replace(/%%/g,"\n"));


  $("#personal-prayers-save").click(function(){
      localStorage.setItem('personalPrayers',personalPrayersTextarea.val().replace(/\r?\n/g,"%%"));
      $('.toast').toast('show');
  });



break;
case 'prayer-book':
  navControls.addClass("nav-control-inactive");


 break;
 case 'breathe':
  navControls.addClass("nav-control-inactive");


 break;

case 'index'://main page so do all the magic    
case '': // or main page so 




/*===========================================================
===========================================================
===========================================================
===========================================================
===========================================================*/



/* ============================================================
                                                              |
Index page functions                                          |
                                                              |
==============================================================*/ 


navControls.addClass("nav-control-active"); // make arrows in nav bar visable.


/* add or subtract breathe and  welcoming cards */
if (storage.isaacMode == "false") {
  $('.breathe-card, .welcoming-card').remove();
}


/* ================================
                                  |
Change the psalm per users        |
settings                          |
                                  |
===================================*/

var psalmChangeTime1 = false;
var psalmChangeTime2 = false;
function nextPsalm(changeCount){
       // add one to psalm number
      if(Number(storage.psalmNumber)==171){ //reset to first psalm if we have reached the last psalm
          storage.setStore('psalmNumber', "1");
        } else {
          storage.setStore('psalmNumber', Number(storage.psalmNumber)+1);
        }
      storage.setStore("lastPsalmChange", now.toISOString(true),);
      storage.setStore("psalmChangeCount", changeCount);
}


if (storage.psalmChangeTime1 != "none") { // make psalmChangeTime1 today at the right hour 
   psalmChangeTime1 = moment(now).hour(storage.psalmChangeTime1).minute(0).second(0).millisecond(0);
}

if (storage.psalmChangeTime2 != "none") { // make psalmChangeTime2 today at the right hour
   psalmChangeTime2 = moment(now).hour(storage.psalmChangeTime2).minute(0).second(0).millisecond(0);
} 


// if now is the next day after the last psalm update && psalmChangeTime1 is set && now is after today at the hour of psalmChange time 1
if (now.isAfter(storage.lastPsalmChange, 'day')){ //its the next day after last update
    storage.setStore("psalmChangeCount", "0");
}



if (now.isAfter(psalmChangeTime1) && Number(storage.psalmChangeCount) == 0) {
    // now is a new day 
    if (now.isAfter(psalmChangeTime2)) { // now is after the second psalm change time
      nextPsalm("2");
    } else { // now is after first psalm change time
      nextPsalm("1");
      
    }
    
}

if (now.isAfter(psalmChangeTime2) && Number(storage.psalmChangeCount) == 1) {
    nextPsalm("2");
}









/* Get personal prayers and write code on index.html
======================================================*/
function togglePersonalPrayers(){
  let slideHtml = "";


  if (storage.personalPrayers != null && storage.displayPersonalPrayers == "true") {
    let personalPrayersArr = storage.personalPrayers.split("%%");
    let personalPrayersHtml = '<ul>';
    personalPrayersArr.forEach(element => {
      personalPrayersHtml += "<li>" + element + "</li>";
    });
    personalPrayersHtml += '</ul>';
  
    //if (storage.darkModeState=="true") {
    //  darkModeClasses=" text-white black ";
    //}


    
    slideHtml = `
    <div class="carousel-item" id="personal-prayers">
                            <div class="d-flex justify-content-center flexbox-card-container">
                                    <div class="card"> 
                                        <div class="card-body "> 
                                            <div class="card-title">
                                              <h4 class="text-primary text-center">Personal Prayers</h4>     
                                            </div>                        
                                            <div class="card-text" id="personal-prayer-content">
                                                ${personalPrayersHtml}
                                                <div class="pt-5 source" id="personal-prayer-source"><a href="{{site.url}}/personal-prayers.html">Edit these prayers</a></div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                </div>
    `;
    $("#prayer-timer-item").after(slideHtml);
  } else {
      if ($('#personal-prayers').length){
        window.location.reload(); // I need to do this in order to load the carousel item when this option is turned on.
      }
  }


} 
togglePersonalPrayers(); //run on page load



/* Populate the prayers accordingly
========================*/

        function populatePrayers(prayerCard,prayerId) {
           prayerCard="#"+prayerCard;
            $(prayerCard+"-title").html(prayersArr[prayerId][0]);
            $(prayerCard+"-content").html(prayersArr[prayerId][4]);
            $(prayerCard+"-source").html("Source: " + '<a href="' + prayersArr[prayerId][2] + '" target="_blank">' + prayersArr[prayerId][1] + '</a>'); 
                 
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
                 
              
                 // set the classes for inline and verserefs on .bible-chapter div
                 var classes = ""; 
                 if(storage.verseRefs=="false") {
                   
                   classes += " hide-verse-refs ";
                   
                 }
                 if(storage.versesInline=="true") {
                   classes += " verses-inline ";
                 }

              /*format xml for ps 119
              ==========================*/
                if ($chapterNumber == 119) {
                  $chapterHTML += '<div class="bible-chapter' + classes +'" data-chapter="119"><h4>Psalm 119</h4>';
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


                    $chapterHTML += '<div class="bible-chapter' + classes + '" data-chapter="' + $thisChapter.attr('display') + '">';

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
          populatePrayers("opening-prayer",storage.openingPrayerId);
          populatePrayers("closing-prayer",storage.closingPrayerId);
          populatePrayers("prayer-of-intent",storage.prayerOfIntentId);
          populateDailyPsalm(storage.psalmNumber);
          populateTimer(storage.silentPrayerTime);
          
          

           /* Jump to Slide if param is set
           ================================= */
           var slideNumber = Number(urlParams.get("slide"));

           // This function sets the slide number and enables the back button on the index.html page
           //
           const prayerCarousel = $("#prayer-carousel");
           if ($.isNumeric(slideNumber)) { // this ensures that I've got a number or nothing.
              if (storage.showStartScreen=="false" && slideNumber === 0) {
                prayerCarousel.carousel(1);
              } else {
                prayerCarousel.carousel(slideNumber);
              }
           } 
           
 
           prayerCarousel.on('slide.bs.carousel', function (e) {
             let url = "{{site.ulr}}/?slide="+e.to;
             history.pushState({url}, null, url);
           })


       

        /* Index page custom controls 
        ==========================*/

        // Timer related controls
            var audio = new Audio('{{site.url}}/sounds/quiet-thought-clip.m4a');

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



        

          
  

break;

} // ./ Main Switch Function














/* ================================
                                  |
Side Bar controls and settings    |
                                  |
===================================*/

/* Sliding Side Bar Javascript controls
========================*/
 const sideBar = $("#sidebar");
 const dismissCover = $('#dismiss-cover');
 sideBar.mCustomScrollbar({
  theme: "minimal"
});

$('#dismiss, #dismiss-cover').on('click', function () {
  sideBar.removeClass('active');
  dismissCover.removeClass('active');
});

$('#sidebarCollapse').on('click', function () {
  sideBar.toggleClass('active');
  dismissCover.toggleClass('active');

//  $('.collapse.in').toggleClass('in');
  $('a[aria-expanded=true]').attr('aria-expanded', 'false');
});


//set the paslm and store it for the future  
const $psalmSelect = $("#psalm-select");
const $psalmChangeTime1 =$("#psalm-change-time1");
const $psalmChangeTime2 = $("#psalm-change-time2");
const $silentPrayerSelect = $("#silent-prayer-select"); 
const $openingPrayerSelect = $("#opening-prayer-select");
const $prayerOfIntentSelect = $("#prayer-of-intent-select");
const $closingPrayerSelect = $("#closing-prayer-select");


$psalmSelect.change(function(){
  if(page=="" || page == "index"){
  populateDailyPsalm($(this).val()); // update the view
  }
  storage.setStore("psalmNumber",$(this).val());
  storage.setStore("lastPsalmChange",now.toISOString(true));
});

$psalmChangeTime1.change(function(){
  storage.setStore("psalmChangeTime1",$(this).val());
});
$psalmChangeTime2.change(function(){
  storage.setStore("psalmChangeTime2",$(this).val());
});


// make select boxs match what is stored
$psalmSelect.val(storage.psalmNumber).attr('selected','selected');
$psalmChangeTime1.val(storage.psalmChangeTime1).attr('selected','selected');
$psalmChangeTime2.val(storage.psalmChangeTime2).attr('selected','selected');
$silentPrayerSelect.val(storage.silentPrayerTime).attr('selected','selected');
$openingPrayerSelect.val(storage.openingPrayerId).attr('selected','selected');
$prayerOfIntentSelect.val(storage.prayerOfIntentId).attr('selected','selected');
$closingPrayerSelect.val(storage.closingPrayerId).attr('selected','selected');


//set silent prayer time and store it for the future  
$silentPrayerSelect.change(function(){
if(page=="" || page == "index"){
populateTimer($(this).val()); // update the view
}
storage.setStore("silentPrayerTime",parseInt($(this).val(),10));
});

//set opening prayer
$openingPrayerSelect.change(function(){
let id = Number($(this).val())
if(page=="" || page == "index"){
populatePrayers("opening-prayer",id);
}
storage.setStore("openingPrayerId",id);
});

//set  prayer of intent
$prayerOfIntentSelect.change(function(){
let id = Number($(this).val())
if(page=="" || page == "index"){
populatePrayers("prayer-of-intent",id);
}
storage.setStore("prayerOfIntentId",id);
});

// set closing prayer
$closingPrayerSelect.change(function(){
let id = Number($(this).val())
if(page=="" || page == "index"){
populatePrayers("closing-prayer",id);
}
storage.setStore("closingPrayerId",id);
});







/* Toggle Dark Mode 
=================================*/

//functions that set the appropriate dark or light classes
function darkModeOn () {
darkMode("true")
localStorage.setItem("darkModeState", "true");
//change timer to dark timer
if(page=="" || page == "index"){
storage.darkModeState = "true";
populateTimer(storage.silentPrayerTime); // update the view
}
}
function lightModeOn () {
darkMode("false");
storage.setStore("darkModeState", "false");

//change timer to light timer*/
if(page=="" || page == "index"){
populateTimer(storage.silentPrayerTime); // update the view
}
}

/* Enable the dark mode toggle button in sidebar settings*/
const $darkModeSwitch = $("#darkModeSwitch");
$darkModeSwitch.change(function(){
if($( this ).is(':checked')) {
darkModeOn();
} else {
lightModeOn();  // unchecked
}
});

//On page load check for the status of darkModeStatus and set the toggle and classes accordingly.
if (storage.darkModeState == "true") {
darkModeOn();
$darkModeSwitch.prop('checked', true);

} else {
lightModeOn();
$darkModeSwitch.prop('checked', false);
}



/* Toggles for Psalm reading verse numbers and line breaks
=================================*/



function toggleVerseRefs (setval) {
  let $bibleChapter = $(".bible-chapter");
if (setval=="true") {
$bibleChapter.removeClass('hide-verse-refs');

} else {
$bibleChapter.addClass('hide-verse-refs');

}
}

function toggleVersesInline (setval) {
  let $bibleChapter = $(".bible-chapter");
if (setval=="true") {
$bibleChapter.addClass('verses-inline');
} else {
$bibleChapter.removeClass('verses-inline');
}
}


/* Enable the verse refes toggle button in sidebar settings*/
const $verseRefsSwitch = $("#VerseRefsSwitch");
$verseRefsSwitch.change(function(){
if($( this ).is(':checked')) {
  toggleVerseRefs("true");
  storage.setStore("verseRefs", "true");
} else {
  toggleVerseRefs("false");
  storage.setStore("verseRefs", "false");
}
});

/* Enable the versesInlineSwitch toggle button in sidebar settings*/
const $versesInlineSwitch = $("#versesInlineSwitch");
$versesInlineSwitch.change(function(){
  if($( this ).is(':checked')) {
  toggleVersesInline("true");
  storage.setStore("versesInline", "true");
} else {
  toggleVersesInline("false");
  storage.setStore("versesInline", "false");
}
});

//On page load check for the status of versesInline and verseRefs and set the toggle accordingly.

// 
const verseRefsBool = (storage.verseRefs == "true");
$verseRefsSwitch.prop('checked', verseRefsBool);


const versesInlineBool = (storage.versesInline == "true");
$versesInlineSwitch.prop('checked', versesInlineBool);








// enable the toggle switch for personal prayer
const $personalPrayerSwitch = $("#personalPrayersSwitch")
$personalPrayerSwitch.change(function(){
if($( this ).is(':checked')){
  storage.setStore('displayPersonalPrayers', 'true');
  togglePersonalPrayers();
} else {
  storage.setStore('displayPersonalPrayers', 'false');
  togglePersonalPrayers();
}
});

if (storage.displayPersonalPrayers == "true") {
$personalPrayerSwitch.prop('checked', true);
} else {
$personalPrayerSwitch.prop('checked', false);
}

const $showStartScreenSwitch = $("#showStartScreenSwitch");
$showStartScreenSwitch.change(function(){
  if($( this ).is(':checked')) {
    storage.setStore("showStartScreen", "true");
  } else {
    storage.setStore("showStartScreen", "false");
  }
  });
if (storage.showStartScreen == "true") {
  $showStartScreenSwitch.prop('checked', true);
  } else {
  $showStartScreenSwitch.prop('checked', false);
  }

  const $isaacMode = $("#isaacMode");
  $isaacMode.change(function(){
    if($( this ).is(':checked')) {
      storage.setStore("isaacMode", "true");
      window.location.reload(); // I need to do this in order to load the carousel item when this option is turned on.
    } else {
      storage.setStore("isaacMode", "false");
      window.location.reload(); // I need to do this in order to load the carousel item when this option is turned on.
    }
    });
  if (storage.isaacMode == "true") {
    $isaacMode.prop('checked', true);
    } else {
    $isaacMode.prop('checked', false);
    }
// ./ Sidebar settings


}); // ./ $(document).ready(function ()

$(window).on('load', function () {
  $('.loader-container').delay(500).fadeOut('slow');
});