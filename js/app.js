$(document).foundation();
var bbc;



// var x = function(a,b,c){
// c=new XMLHttpRequest;
// c.open('GET',a);
// c.onload=b;
// c.send()
// };

var yql=function(a,b){
  return 'http://query.yahooapis.com/v1/public/yql?q='+encodeURIComponent('select * from '+b+' where url=\"'+a+'\"')+'&format=json';
};

  // x(yql('http://feeds.bbci.co.uk/news/rss.xml','xml'),function()
  // {
  //
  // var res = JSON.parse(this.response);
  // var channel = res.query.results.rss.channel;
  // console.log(channel);
  // bbc = channel.copyright;
  // console.log(bbc);
  //
  // }

  var yql = yql('http://feeds.bbci.co.uk/news/rss.xml','xml');

   $.getJSON(yql, function(res) {
      var channel = res.query.results.rss.channel;
       console.log(res);
       console.log(channel);

   }, "jsonp");
