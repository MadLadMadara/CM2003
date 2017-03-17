$(document).foundation();




// var x = function(a,b,c){
// c=new XMLHttpRequest;
// c.open('GET',a);
// c.onload=b;
// c.send()
// };
$(document).ready(function(){
  var yql=function(a,b){
    return 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent('select * from '+b+' where url=\"'+a+'\"')+'&format=json';
  };
  function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
  var sky = yql('http://feeds.skynews.com/feeds/rss/world.xml', 'xml');
  var bbc = yql('http://feeds.bbci.co.uk/news/rss.xml','xml');
  var gar = yql('https://www.theguardian.com/world/rss', 'xml');
  var fox = yql('http://feeds.foxnews.com/foxnews/world?format=xml', 'xml');
  var ajn = yql('http://www.aljazeera.com/xml/rss/all.xml', 'xml');
  var nyt = yql('http://rss.nytimes.com/services/xml/rss/nyt/World.xml', 'xml');

  $.getJSON(bbc, function(res) {

      //console.log(res);
      createChannel(res, "bbc");
   }, "jsonp");

   $.getJSON(sky, function(res) {

      // console.log(res);
       createChannel(res, "sky");
    }, "jsonp");

    $.getJSON(gar, function(res) {

        //console.log(res);
        createChannel(res, "gar");
     }, "jsonp");
     $.getJSON(fox, function(res) {


         createChannel(res, "fox");
      }, "jsonp");

      $.getJSON(ajn, function(res) {


          createChannel(res, "ajn");
       }, "jsonp");

       $.getJSON(nyt, function(res) {

           console.log(res);
           createChannel(res, "nyt");
        }, "jsonp");




    function createChannel(res, outlet){

      var channel = res.query.results.rss.channel;
     display = '<div class="small-6 medium-4 large-2 float-left columns newschannel" id="'+outlet+'">';

       display +='<div class="small-12 text-center columns distributor">';
         display +='<img class="distributorimg" src="'+channel.image.url+'" >';
         display +='<hr>';
       display +='</div>';

       display +='<div class="small-12 columns storys">';
       // loop through items
       $.each(channel.item, function(index, value){
         display +='<div class="small-12 columns story" id="'+outlet+index+'">';
           display +='<div class="small-12 columns headline headlineFont" >';

           display +='  <h4>'+strip(value.title)+'</h4>';
           display +='</div>';

           display +='<div class="small-12 columns thumbnail text-center">';
            if(outlet == "gar" ){
              if(value.content.length > 0){
                display +='<img  src="'+value.content[0].url+'" >';
              }
            }else if(outlet == "sky" || outlet == "bbc"){
              display +='<img  src="'+value.thumbnail.url+'" >';
            }else if(outlet == "nyt"){
              if(value.content != null){
                display +='<img  src="'+value.content.url+'" >';
              }

            }

           display +='</div>';
           display +='<div class="small-12 columns description mainContentFont">';
              if(outlet == "sky"){
                display +='<p>'+strip(value.description[0])+'</p>';
              }else{
                display +='<p>'+strip(value.description)+'</p>';
              }

           display +='</div>';
           display +='<div class="small-12 columns gotooutlet">';

           display +='</div>';
           display +='<div class="small-12 columns readstory">';

           display +='</div>';
           display +='<hr>';
         display +='</div>';


       });

         //end story

       display +='</div>';
       // end storys
     display +='</div>';
     $(display).appendTo('#main')
   }




});
