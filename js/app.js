
// !!!!!!   SEE BOTTOM OF CODE FOR PROGRAM RUNTIME EVERYTHING ABOVE IS HELPER FUNCTIONS
// foundation and checking if the dom is ready
$(document).foundation();
$(document).ready(function(){

  // !!! HELPER FUNCTIONS !!!
  // create urls for rss feed

  // creates a url string that pulls rss feeds via http://query.yahooapis.com in the form of xml
  var yql=function(a,b,f){
    return 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent('select * from '+b+' where url=\"'+a+'\"')+'&format='+f;
  };
  // remove html tags from string
  function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}


// load data from rss and display on dom, this creates the inital channel cards
  function loadChannel(outlet, outletTitle){
    $.getJSON(outlet, function(res) {
        console.log(res);
        createChannel(res, outletTitle);
     }, "jsonp");
  }
  // update storys in the channel cards if the rss has updated this can be forced
  function updateChannel(outlet, outletTitle, force){


    $.getJSON(outlet, function(res) {
      var channel = res.query.results.rss.channel;
      if(!$( '#storys'+outletTitle+'' ).length) return;


      if(outletTitle == "ajn" || outletTitle == "fox"){


            console.log(outletTitle+Date.parse(channel.item[0].pubDate) + " " +$("."+outletTitle+"lastUpdate").val());
           if(Date.parse(channel.item[0].pubDate) > $('.'+outletTitle+'lastUpdate').val() || force){
             updateStorys(channel, outletTitle);
             console.log(outletTitle+"updateStorys");


           }

      }else if(outletTitle == "gar"){
        console.log(outletTitle+Date.parse(channel.pubDate) + " " +$("."+outletTitle+"lastUpdate").val());
        if(Date.parse(channel.pubDate) > $("."+outletTitle+"lastUpdate").val() || force){
          updateStorys(channel, outletTitle);
          console.log(outletTitle+"updateStorys");
        }
      }else{
        console.log(outletTitle+Date.parse(channel.lastBuildDate) + " " +$("."+outletTitle+"lastUpdate").val());
        if( Date.parse(channel) > $("."+outletTitle+"lastUpdate").val() || force){
          updateStorys(channel, outletTitle);
          console.log(outletTitle+"updateStorys");
        }
      }

     }, "jsonp");
  }

  // create dom elements channel cards, the channel init function
  // will only be used once per news outlet
  function createChannel(outlet, outletTitle){

      var channel = outlet.query.results.rss.channel;
     display = '<div class="small-12 medium-4 large-2 float-left columns newschannel" id="'+outletTitle+'">';

     if(outletTitle == "ajn" || outletTitle == "fox"){

      display += '<input type="hidden" name="lastUpDate" class="'+outletTitle+'lastUpdate" value="'+Date.parse(channel.item[0].pubDate)+'">';


     }else if(outletTitle == "gar"){
       display += '<input type="hidden" name="lastUpDate" class="'+outletTitle+'lastUpdate" value="'+Date.parse(channel.pubDate)+'">';

     }else{
       display += '<input type="hidden" name="lastUpDate" class="'+outletTitle+'lastUpdate" value="'+Date.parse(channel.lastBuildDate)+'">';
     }


       display +='<div class="small-12 text-center columns distributor">';
         display +='<img class="distributorimg" src="'+channel.image.url+'" >';
         display +='<hr>';
       display +='</div>';

       display +='<div class="small-12 columns storys" id="storys'+outletTitle+'">';
       // loop through items


       $.each(channel.item, function(index, value){

         display +='<div class="small-12 columns story" id="'+outletTitle+index+'">';
           display +='<div class="small-12 columns headline headlineFont" >';

           display +='  <h4>'+strip(value.title)+'</h4>';
           display +='</div>';

           display +='<div class="small-12 columns thumbnail text-center">';
            if(outletTitle == "gar" ){
              if(value.content.length > 0){
                display +='<img  src="'+value.content[0].url+'" >';
              }
            }else if(outletTitle == "sky" || outletTitle == "bbc"){
              display +='<img  src="'+value.thumbnail.url+'" >';
            }else if(outletTitle == "nyt"){
              if(value.content != null){
                display +='<img  src="'+value.content.url+'" >';
              }

            }

           display +='</div>';
           display +='<div class="small-12 columns description mainContentFont">';
              if(outletTitle == "sky"){
                display +='<p>'+strip(value.description[0])+'</p>';
              }else{
                display +='<p>'+strip(value.description)+'</p>';
              }

           display +='</div>';
           display +='<div class="small-12 columns gotooutlet">';

           display +='</div>';
           if("link" in value){
             if(outletTitle == "nyt"){
               // link is an array [0] url string [1] objecy
               // object .href is the link .rel no idea
                 display +='<button type="button" class="small-12 button readstory">Read Story</button>';
                 display += '<input type="hidden" name="linkToArtical" class="linkToArtical" value="'+value.link[0]+'">';

             }else{
                 display +='<button type="button" class="small-12 button readstory">Read Story</button>';
                 display += '<input type="hidden" name="linkToArtical" class="linkToArtical" value="'+value.link+'">';

            }
          }
           display +='<hr>';
         display +='</div>';


       });

         //end story

       display +='</div>';
       // end storys

     display +='</div>';
     $(display).appendTo('#main');
     // create listener for read story button
     $("#storys"+outletTitle+" .readstory" ).click(function() {
       displayStoryModel($(this), "#sideNewsPanel");
     });
   }
   // updates the content of story and last updated value
   function updateStorys(channel, outletTitle){
     display = "";
     date = "";
     if(outletTitle == "ajn" || outletTitle == "fox"){

      date = Date.parse(channel.item[0].pubDate);

     }else if(outletTitle == "gar"){
       date = Date.parse(channel.pubDate);
     }else{
       date = Date.parse(channel.lastBuildDate);
     }
     $.each(channel.item, function(index, value){

       display +='<div class="small-12 columns story" id="'+outletTitle+index+'">';
         display +='<div class="small-12 columns headline headlineFont" >';

         display +='  <h4>'+strip(value.title)+'</h4>';
         display +='</div>';

         display +='<div class="small-12 columns thumbnail text-center">';
          if(outletTitle == "gar" ){
            if(value.content.length > 0){
              display +='<img  src="'+value.content[0].url+'" >';
            }
          }else if(outletTitle == "sky" || outletTitle == "bbc"){
            display +='<img  src="'+value.thumbnail.url+'" >';
          }else if(outletTitle == "nyt"){
            if(value.content != null){
              display +='<img  src="'+value.content.url+'" >';
            }

          }

         display +='</div>';
         display +='<div class="small-12 columns description mainContentFont">';
            if(outletTitle == "sky"){
              display +='<p>'+strip(value.description[0])+'</p>';
            }else{
              display +='<p>'+strip(value.description)+'</p>';
            }

         display +='</div>';
         display +='<div class="small-12 columns gotooutlet">';

         display +='</div>';
         // button creation and hiden value link
         if("link" in value){
           if(outletTitle == "nyt"){
             // link is an array [0] url string [1] objecy
             // object .href is the link .rel no idea
               display +='<button type="button" class="small-12 button readstory">Read Story</button>';
               display += '<input type="hidden" name="linkToArtical" class="linkToArtical" value="'+value.link[0]+'">';

           }else{
               display +='<button type="button" class="small-12 button readstory">Read Story</button>';
               display += '<input type="hidden" name="linkToArtical" class="linkToArtical" value="'+value.link+'">';

          }
        }


         display +='<hr>';
       display +='</div>';


     });

     $('.'+outletTitle+'lastUpdate').val(date);
     $('#storys'+outletTitle+'').html(display);
     $("#storys"+outletTitle+" .readstory" ).click(function() {
       displayStoryModel($(this), "#sideNewsPanel");
     });

   }

   // website scraper
   function newsSiteContentScraper(url, outletTitle, modelId){


       $.ajax({
         url: yql(url, 'html', "html"),
         dataType: 'html',
         success: function(res) {
           if(outletTitle == "bbc"){
             $(modelId).html(res);

           }

         }
       });





   }

   // !!! EVENTS !!!

   var count = 0;

   // read story button event
   // opens model and displays outlet content
   // listeners are created in the createChannel and updateStorys functions these functions call this
   var safeClick = true; // to stop double clicks when ajax request are being preformed
   function displayStoryModel(btnElement, modelId){
     // work around for button firing multible times
     if($(modelId).attr("aria-hidden") == "true" && safeClick){
       safeClick = false;
       count++;
       var url = btnElement.parent().find('.linkToArtical').val();
       var outletTitle = btnElement.parent().parent().parent().attr('id');
       newsSiteContentScraper(url, outletTitle, modelId);
       $(modelId).foundation('open'); // needs to be moved to newsSiteContentScraper function
       safeClick = true;
     }
     console.log(count);

   }


   // !!! RUNTIME !!!

   //  url for rss feeds
   var sky = yql('http://feeds.skynews.com/feeds/rss/world.xml', 'xml', "json");
   var bbc = yql('http://feeds.bbci.co.uk/news/rss.xml','xml', "json");
   var gar = yql('https://www.theguardian.com/world/rss', 'xml', "json");
   var fox = yql('http://feeds.foxnews.com/foxnews/world?format=xml', 'xml', "json");
   var ajn = yql('http://www.aljazeera.com/xml/rss/all.xml', 'xml', "json");
   var nyt = yql('http://rss.nytimes.com/services/xml/rss/nyt/World.xml', 'xml', "json");

   // create inital channel cards
   loadChannel(bbc, "bbc");
   loadChannel(sky, "sky");
   loadChannel(gar, "gar");
   loadChannel(fox, "fox");
   loadChannel(ajn, "ajn");
   loadChannel(nyt, "nyt");


   // update channel cards storys every 5 seconds
   setInterval(function(){
     updateChannel(bbc, "bbc", false);
     updateChannel(sky, "sky", false);
     updateChannel(gar, "gar", false);
     updateChannel(fox, "fox", false);
     updateChannel(ajn, "ajn", false);
     updateChannel(nyt, "nyt", false);
    console.log("update");
  }, 10000);


});
