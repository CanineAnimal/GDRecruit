var nats = [];
var time = 6;
var originalTime2;
var notify = true;
var originalTime;
var tem;
var nat;
var fd;
function login(){
	nat = document.querySelector('#NATION').value;
	tem = document.querySelector('#TEMPLATE').value;
	verif = document.querySelector('#VERIF').value;
	var request = new XMLHttpRequest();
	request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nat + '&q=region+foundedtime', false);
	request.send();
	if(request.responseXML.querySelector('REGION').innerHTML == 'Greater Dienstad'){
		var request2 = new XMLHttpRequest();
		request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?a=verify&nation=' + nat + '&checksum=' + verif, false);
		request2.send()
		if (request2.responseText.indexOf('1') != -1){
			document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
			fd = eval(request.responseXML.querySelector('FOUNDEDTIME').innerHTML;
			start();
		}else{
			document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Verification code is incorrect. Please make sure that you have entered your nation name and verification code correctly. Regenerate a verification code using the same link.</SPAN>'
		}
	}else{
		document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Nation is not an authorised recruiter for Greater Dienstad.</SPAN>'
	}
}function start(){
	var nations = [];
	var request2;
	originalTime = (new Date()).getTime();
	request2 = new XMLHttpRequest();
	request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=newnations', false);
	while((new Date()).getTime() < originalTime + 0.6){};
	request2.send();
	originalTime = (new Date()).getTime();
	for (var item = 0; item < Math.min(8, request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length); item++){
		nations[nations.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
	}
	link = 'https://www.nationstates.net/page=compose_telegram?tgto=';
	for(var item = 0; item < Math.min(8, nations.length); item++){
		link += nations[item] + ',';
		nats[nats.length] = nations[item];
	}
	link += '&message=' + tem;
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
	}else{
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	}
}function recBut(){
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="generateRecruits()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
	}else{
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="generateRecruits()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	}
}function generateRecruits(){
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
	}else{
		document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	}
	originalTime2 = (new Date()).getTime();
	if(fd + 47336400 > (new Date()).getTime()/1000){
		time = ((13.25 - (fd - (new Date()).getTime()/1000) * 10**-7)) * nats.length + 1;
	}
	var nations = [];
	var request2;
	originalTime = (new Date()).getTime();
	request2 = new XMLHttpRequest();
	request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=newnations', false);
	while((new Date()).getTime() < originalTime + 0.6){};
	request2.send();
	originalTime = (new Date()).getTime();
	for (var item = 0; item < Math.min(8, request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length); item++){
		if(nats.indexOf(request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item]) == -1){
			nations[nations.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
		}
	}
	if(nations.length > 0){
		link = 'https://www.nationstates.net/page=compose_telegram?tgto=';
		for(var item = 0; item < Math.min(8, nations.length); item++){
			link += nations[item] + ',';
			nats[nats.length] = nations[item];
		}
		setTimeout(postRecruits, originalTime2 + time * 1000 - new Date().getTime());
	else{
		generateRecruits()
	}
}function postRecruits(){
	link += '&message=' + tem;
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify <AUDIO AUTOPLAY><SOURCE SRC="https://canineanimal.github.io/GDRecruit/ring.mp3" TYPE="audio/mpeg"></AUDIO>';
	}else{
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	}
}
