$(document).foundation(); // init zurb foundation

$(document).ready(function(){
  // create urls for rss feed


  var yql=function(a,b){
    return 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent('select * from '+b+' where url=\"'+a+'\"')+'&format=json';
  };
  // remove html tags from string
  function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
  //  url for rss feeds
  var sky = yql('http://feeds.skynews.com/feeds/rss/world.xml', 'xml');
  var bbc = yql('http://feeds.bbci.co.uk/news/rss.xml','xml');
  var gar = yql('https://www.theguardian.com/world/rss', 'xml');
  var fox = yql('http://feeds.foxnews.com/foxnews/world?format=xml', 'xml');
  var ajn = yql('http://www.aljazeera.com/xml/rss/all.xml', 'xml');
  var nyt = yql('http://rss.nytimes.com/services/xml/rss/nyt/World.xml', 'xml');

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
           if(Date.parse(channel.item[0].pubDate) > $('.'+outletTitle+'lastUpdate').val()){
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

  // create dom elements, the channel init function
  // will only be used once per news outlet
  function createChannel(outlet, outletTitle){

      var channel = outlet.query.results.rss.channel;
     display = '<div class="small-6 medium-4 large-2 float-left columns newschannel" id="'+outletTitle+'">';

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
           display +='<button type="button" class="small-12 button readstory">Read Story</button>';
           display +='<hr>';
         display +='</div>';


       });

         //end story

       display +='</div>';
       // end storys

     display +='</div>';
     $(display).appendTo('#main');
   }
   // only updates the content of story and last updated value
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
         display +='<button type="button" class="button readstory">Read story?</button>';
         display +='<hr>';
       display +='</div>';


     });

     $('.'+outletTitle+'lastUpdate').val(date);
     $('#storys'+outletTitle+'').html(display);
   }


   // website scraper
   function scraper(url, contentTag, imageTag){

   }


   // runtime

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


  // buttons






});
