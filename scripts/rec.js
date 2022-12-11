var nats = [];
var nations = [];
var notify = true;
var originalTime2;
var originalTime;
var tem;
var nat;
var fd;
function login(){
	nat = document.querySelector('#NATION').value;
	tem = document.querySelector('#TEMPLATE').value;
	verif = document.querySelector('#VERIF').value;
	if(['the_ice_states', 'the_macabees', 'holy_marsh'].indexOf(nat.toLowerCase().replaceAll(' ', '_')) == -1){
		document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Nation is not an authorised recruiter for Greater Dienstad.</SPAN>'
	}else{
		var request = new XMLHttpRequest();
		request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?a=verify&nation=' + nat + '&checksum=' + verif, false);
		request.send();
		originalTime = (new Date()).getTime();
		if(request.responseText.indexOf('1') == -1){
			document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Verification code is incorrect. Please make sure that you have entered your nation name and verification code correctly. Regenerate a verification code using the same link.</SPAN>';
		}else{
			document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
			request = new XMLHttpRequest();
			request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nat + '&q=foundedtime', false);
			while((new Date()).getTime() < originalTime + 600){};
			request.send();
			originalTime = (new Date()).getTime();
			fd = eval(request.responseXML.querySelector('FOUNDEDTIME').innerHTML);
			start();
		}
	}
}
function start(){
	link = 'https://www.nationstates.net/page=compose_telegram?tgto=';
	var request2;
	request2 = new XMLHttpRequest();
	request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=newnations', false);
	while((new Date()).getTime() < originalTime + 600){};
	request2.send();
	originalTime = (new Date()).getTime();
	for (var item = 0; item < Math.min(8, request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length); item++){
		nations[nations.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
		nats[nats.length] = nations[item];
		link += nations[item] + ','};
	}
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
	}else{
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	}
}
function recBut(){
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="initiateRecruitGeneration()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
	}else{
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="initiateRecruitGeneration()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	}
}
function initiateRecruitGeneration(){
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
	}else{
		document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
	}if(fd + 47336400 > (new Date()).getTime()/1000){
		setTimeout(generateRecruits, 1000 * (13.25 + (fd - (new Date()).getTime()/1000) * 1.72 * 10**-7) * Math.min(8, nations.length) + 1);
	}else{
		setTimeout(generateRecruits, 6);
	}
}
function generateRecruits(){
	nations = [];
	var request2;
	request2 = new XMLHttpRequest();
	request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=newnations', false);
	while((new Date()).getTime() < originalTime + 600){};
	request2.send();
	originalTime = (new Date()).getTime();
	for (var item = 0; item < request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length; item++){
		if(nats.indexOf(request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item]) == -1){
			nations[nations.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length[item] + ',';
			nats[nats.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length[item];
		}
		if(nations.length == 8){break};
	}if(nations.length > 0){
		link = 'https://www.nationstates.net/page=compose_telegram?tgto=';
		for(var item = 0; item < Math.min(8, nations.length); item++){
			link += nations[item] + ',';
		}
		if(document.querySelector('#SOUND').checked){
			document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify';
		}else{
			document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
		}
	}else{
		setTimeout(generateRecruits, originalTime + 600 - new Date().getTime());
	}
}
