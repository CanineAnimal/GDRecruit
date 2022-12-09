var nats = [];
var time = 6;
var originalTime2;
var notify = true;
var originalTime;
var tem;
var nat;

function login(){
	nat = document.querySelector('#NATION').value;
	tem = document.querySelector('#TEMPLATE').value;
	verif = document.querySelector('#VERIF').value;
	var request = new XMLHttpRequest();
	request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nat + '&q=region', false);
	request.send();
	if(request.responseXML.querySelector('REGION').innerHTML == 'Greater Dienstad'){
		var request2 = new XMLHttpRequest();
		request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?a=verify&nation=' + nat + '&checksum=' + verif, false);
		request2.send()
		if (request2.responseText.indexOf('1') != -1){
			document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
			document.querySelector('#SOUND').checked = notify;
			start();
		}else{
			document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Verification code is incorrect. Please make sure that you have entered your nation name and verification code correctly. Regenerate a verification code using the same link.</SPAN>'
		}
	}else{
		document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Nation is not an authorised recruiter for Greater Dienstad.</SPAN>'
	}
}

function start(){
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
	notify = document.querySelector('#SOUND').checked;
	document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	document.querySelector('#SOUND').checked = notify;
}

function recBut(){
	notify = document.querySelector('#SOUND').checked;
	document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="generateRecruits()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	document.querySelector('#SOUND').checked = notify;
}

function generateRecruits(){
	document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify'
	originalTime2 = (new Date()).getTime();
	var request = new XMLHttpRequest();
	request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nat + '&q=foundedtime', false);
	request.send();
	if(eval(request.responseXML.querySelector('FOUNDEDTIME').innerHTML) > (new Date()).getTime()/1000 - 47336400){
		time = ((13.25 - (eval(request.responseXML.querySelector('FOUNDEDTIME').innerHTML) - (new Date()).getTime()/1000) * 10**-7)) * nats.length + 1;
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
	link = 'https://www.nationstates.net/page=compose_telegram?tgto=';
	for(var item = 0; item < Math.min(8, nations.length); item++){
		link += nations[item] + ',';
		nats[nats.length] = nations[item];
	}
	setTimeout(postRecruits, originalTime2 + time * 1000 - new Date().getTime());
}

function postRecruits(){
	link += '&message=' + tem;
	notify = document.querySelector('#SOUND').checked;
	if(notify){
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
		document.body.innerHTML += '<AUDIO AUTOPLAY><SOURCE SRC="ring.mp3" TYPE="audio/mpeg"></AUDIO>';
	}else{
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	}
}
