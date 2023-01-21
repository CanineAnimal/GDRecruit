var regrequest = new XMLHttpRequest();
regrequest.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?region=greater_dienstad&q=nations', false);
regrequest.send();
var nations = regrequest.responseXML.querySelector('NATIONS').innerHTML.split(':');
var item = 0;
var interval = setInterval(function(){
	var request = new XMLHttpRequest();
	request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nations[item] + '&q=lastlogin', false);
	request.send();
	if(item < nations.length){
		if((((new Date()).getTime()/1000 - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) > 237600) && ((new Date()).getTime()/1000 - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) < 246240)) || ((new Date()).getTime()/1000 - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) > 5140800)){
			document.body.querySelector('#OUTPUT').innerHTML += nations[item] + ' will CTE next update! Oh dear. <BR/>';
		}
		item++;
	}else{
		document.body.querySelector('#LOADING').innerHTML = 'Process complete.'
		clearInterval(interval);
	}
}, 650);
