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

  var yql = yql('http://feeds.bbci.co.uk/news/rss.xml','xml');

  $.getJSON(yql, function(res) {

      display = '<div class="small-2 columns newschannel">';
        display+= '<div class="small-12 columns headline headlineFont" >';
          display+= '<h4>Pilot errors led to Shoreham air crash, says AAIB</h4>';


      var channel = res.query.results.rss.channel;
      console.log(res);
      console.log(channel);
      createChannel(channel);
   }, "jsonp");

    function createChannel(chan){
     display = '<div class="small-2 columns newschannel" id="0">';

       display +='<div class="small-12 text-center columns distributor">';
         display +='<img src="http://news.bbcimg.co.uk/nol/shared/img/bbc_news_120x60.gif" >';
         display +='<hr>';
       display +='</div>';

       display +='<div class="small-12 columns storys">';

         display +='<div class="small-12 columns story" id="0">';
           display +='<div class="small-12 columns headline headlineFont" >';
           display +='  <h4>Pilot errors led to Shoreham air crash, says AAIB</h4>';
           display +='</div>';
           display +='<div class="small-12 columns thumbnail text-center">';
             display +='<img src="http://c.files.bbci.co.uk/D31A/production/_94924045_shoreham_car.jpg" >';
           display +='</div>';
           display +='<div class="small-12 columns description mainContentFont">';
               display +='<p>A jet crashed on the A27 killing 11 men because it was too low for a manoeuvre, investigators say.</p>';
           display +='</div>';
           display +='<div class="small-12 columns gotooutlet">';

           display +='</div>';
           display +='<div class="small-12 columns readstory">';

           display +='</div>';
           display +='<hr>';
         display +='</div>';
         //end story

       display +='</div>';
       // end storys
     display +='</div>';
     $(display).appendTo('#main')
   }




});
