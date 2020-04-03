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


const today = new Date();
const oneDay = 1000*60*60*22; //22 hours instead of 24 just to make sure each morning is a new psalm

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
  psalmNumber: 1,
  lastViewDate: today.getTime()
}

//storage.lastViewDate = today.toLocaleDateString();

// check all local storage variables and set to default if they don't exist;

for (let value of Object.entries(storage)) {
   if(localStorage.getItem(value[0])===null || localStorage.getItem(value[0])===undefined || localStorage.getItem(value[0])==='') {
      localStorage.setItem(value[0],value[1]);    
   } else {
     storage[value[0]]=localStorage.getItem(value[0]);
   }
}

// If psalm not saved in local storage start at one or dispaly the next psalm ever 22 hours
// there is a locally stored psalm already so read those 

  //let storedDate = new Date(storage.lastViewDate);
  let dayDiff = (today.getTime() - storage.lastViewDate)/oneDay;
  console.log("dayDiff= "+dayDiff);
     // more than 22 hours have passed since lastViewDate? Increase psalmNumber by 1 and update last view date
    if (dayDiff>1) {  
         storage.psalmNumber++;
           if(storage.psalmNumber==172){storage.psalmNumber=1};//reset to first psalm if we have reached the last psalm
         localStorage.setItem('psalmNumber', storage.psalmNumber);
         localStorage.setItem("lastViewDate", today.getTime())
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
          $("#prayer-timer").get(0).src = timerFileName;
      }







/* ================================
                                  |
Side Bar controls and settings    |
                                  |
===================================*/

/* Sliding Side Bar Javascript controls
========================*/
 
      $("#sidebar").mCustomScrollbar({
          theme: "minimal"
      });

      $('#dismiss').on('click', function () {
          $('#sidebar').removeClass('active');
      });

      $('#sidebarCollapse').on('click', function () {
          $('#sidebar').addClass('active');
       
          $('.collapse.in').toggleClass('in');
          $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });


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







/* Toggle Dark Mode 
=================================*/

//functions that set the appropriate dark or light classes
function darkModeOn () {
  $(".card, .card-text").addClass("text-white black");
  $('textarea, .card-title, .source').addClass('text-white');
  $(".note").removeClass('note-info').addClass("note-dark");
  $(".navbar").removeClass('nav-blue-gradient').addClass("nav-dark-gradient");
  //change timer to dark timer
  if(page=="" || page == "index"){
    storage.darkModeState = "true";
    populateTimer(storage.silentPrayerTime); // update the view
  }
}
function lightModeOn () {
  $(".card, .card-text").removeClass("text-white black");
  $('textarea, card-title, .source').removeClass('text-white');
  $(".note").removeClass('note-dark').addClass("note-info");
  $(".navbar").removeClass('nav-dark-gradient').addClass("nav-blue-gradient");
  //change timer to light timer
  if(page=="" || page == "index"){
    storage.darkModeState = "false";
    populateTimer(storage.silentPrayerTime); // update the view
  }
}

/* Enable the dark mode toggle button in sidebar settings*/
$("#darkModeSwitch").change(function(){
  if($( this ).is(':checked')) {
    darkModeOn();
    localStorage.setItem("darkModeState", "true");
} else {
    lightModeOn();  // unchecked
    localStorage.setItem("darkModeState", "false");
}
});

//On page load check for the status of darkModeStatus and set the toggle and classes accordingly.
if (storage.darkModeState == "true") {
  darkModeOn();
  $("#darkModeSwitch").prop('checked', true);
 
} else {
  lightModeOn();
  $("#darkModeSwitch").prop('checked', false);
}



/* Toggles for Psalm reading verse numbers and line breaks
=================================*/


function toggleVerseRefs (setval) {
  if (setval=="true") {
    $(".bible-chapter").removeClass('hide-verse-refs');
   
  } else {
    $(".bible-chapter").addClass('hide-verse-refs');
    
  }
}

function toggleVersesInline (setval) {
  if (setval=="true") {
    $(".bible-chapter").addClass('verses-inline');
  } else {
    $(".bible-chapter").removeClass('verses-inline');
  }
}


/* Enable the verse refes toggle button in sidebar settings*/
$("#VerseRefsSwitch").change(function(){
  if($( this ).is(':checked')) {
    toggleVerseRefs("true");
    localStorage.setItem("verseRefs", "true");
} else {
  toggleVerseRefs("false");
  localStorage.setItem("verseRefs", "false");
}
});

/* Enable the versesInlineSwitch toggle button in sidebar settings*/
$("#versesInlineSwitch").change(function(){
  if($( this ).is(':checked')) {
    toggleVersesInline("true");
    localStorage.setItem("versesInline", "true");
} else {
  toggleVersesInline("false");
  localStorage.setItem("versesInline", "false");
}
});

//On page load check for the status of versesInline and verseRefs and set the toggle accordingly.

// 
  const verseRefsBool = (storage.verseRefs == "true");
  $("#VerseRefsSwitch").prop('checked', verseRefsBool);

  
  const versesInlineBool = (storage.versesInline == "true");
  $("#versesInlineSwitch").prop('checked', versesInlineBool);



/* ================================
                                  |
Prayers for self and others code  |
                                  |
===================================*/

/* on personal-prayers.html only : save the textarea content to local storage
======================================================*/
if (page == "personal-prayers") {
  $("#personal-prayers-textarea").val(localStorage.getItem("personalPrayers").replace(/%%/g,"\n"));


  $("#personal-prayers-save").click(function(){
      localStorage.setItem('personalPrayers',$("#personal-prayers-textarea").val().replace(/\r?\n/g,"%%"));
      $('.toast').toast('show');
  });
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
    
    
    slideHtml = `
    <div class="carousel-item" id="personal-prayers">
                            <div class="d-flex justify-content-center flexbox-card-container">
                                    <div class="card"> 
                                        
                                        <div class="card-body "> 
                                            <h4 class="text-primary text-center">Personal Prayers</h4>                             
                                            <div class="card-text" id="personal-prayer-content">
                                                ${personalPrayersHtml}
                                            </div>
                                            <div class="text-left pt-5 source" id="personal-prayer-source"><a href="{{site.url}}/personal-prayers.html">Edit these prayers</a></div>
                                        </div>
                                    </div>
                                </div>
                </div>
    `;
    $("#prayer-timer-item").after(slideHtml);
  } else {
      if ($('#personal-prayers').length){
        window.location.reload();
      }
  }


} 
togglePersonalPrayers(); //run on page load

// enable the toggle switch for personal prayer
$("#personalPrayersSwitch").change(function(){
  if($( this ).is(':checked')){
    storage.displayPersonalPrayers = "true";
    togglePersonalPrayers();
    localStorage.setItem('displayPersonalPrayers', 'true');
  } else {
    storage.displayPersonalPrayers = "false";
    togglePersonalPrayers();
    localStorage.setItem('displayPersonalPrayers', 'false');
  }
});

if (storage.displayPersonalPrayers == "true") {
  $("#personalPrayersSwitch").prop('checked', true);
} else {
  $("#personalPrayersSwitch").prop('checked', false);
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

    //get prayerid param
    var prayerId = Number(urlParams.get("prayerId"));
    var numberOfPrayers=0;


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
    }
    setPrayers();
  

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







/* tags page
=========================*/
case 'tags': //display list of prayers tagged with parameter

break;






/* Main index.html page
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
                    
                    // set the classes for inline and verserefs
                    var classes = ""; 
                    if(storage.verseRefs=="false") {
                      
                      classes += " hide-verse-refs ";
                      
                    }
                    if(storage.versesInline=="true") {
                      classes += " verses-inline ";
                    }


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