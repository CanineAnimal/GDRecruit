var nats = [];
var nations = [];
var notify = true;
var freeNations = [];
var blacklistHTML = '';
var blacklist = [];
var originalTime2;
var originalTime;
var recips = 0;
var request2;
var tem;
var nat;
var fd;

function whitelist(victim){
	blacklist.splice(eval(victim), 1);
	blacklistHTML = '';
	for(var item = 0; item < blacklist.length; item++){
		blacklistHTML += '<TR><TD>' + blacklist[item] + '</TD><TD><BUTTON ONCLICK="whitelist(' + item + ')" CLASS="WHITELIST">X</BUTTON></TD></TR>';
	}
	document.querySelector('TBODY').innerHTML = blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR>';
}
function add2blacklist(){
	var victim = document.querySelector('#VICTIM').value;
	blacklistHTML = '';
	if(victim){
		blacklist[blacklist.length] = victim;
		for(var item = 0; item < blacklist.length; item++){
			blacklistHTML += '<TR><TD>' + blacklist[item] + '</TD><TD><BUTTON ONCLICK="whitelist(' + item + ')" CLASS="WHITELIST">X</BUTTON></TD></TR>';
		}
		var newFreeNations = [];
		for(var item = 0; item < freeNations.length; item++){
			if(freeNations[item].indexOf(victim.toLowerCase().replaceAll(' ', '_')) == -1){
				newFreeNations[newFreeNations.length] = freeNations[item];
			}
		}
		freeNations = newFreeNations;
		var newNations = [];
		for(var item = 0; item < nations.length; item++){
			if(nations[item].indexOf(victim.toLowerCase().replaceAll(' ', '_')) == -1){
				newNations[newNations.length] = nations[item];
			}
		}
		nations = newNations;
		document.querySelector('TBODY').innerHTML = blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR>';

	}else{
		alert('No string entered to blacklist.')
	}
}
function login(){
	nat = document.querySelector('#NATION').value;
	tem = document.querySelector('#TEMPLATE').value;
	verif = document.querySelector('#VERIF').value;
	if(['the_ice_states', 'the_macabees', 'holy_marsh', 'dobbastan', 'ardenfontein', 'union_of_the_orklanders'].indexOf(nat.toLowerCase().replaceAll(' ', '_')) == -1){
		document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Nation is not an authorised recruiter for Greater Dienstad.</SPAN>'
	}else{
		var request = new XMLHttpRequest();
		request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?a=verify&nation=' + nat + '&checksum=' + verif + '&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
		request.send();
		originalTime = (new Date()).getTime();
		if(request.responseText.indexOf('1') == -1){
			document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Verification code is incorrect. Please make sure that you have entered your nation name and verification code correctly. Regenerate a verification code using the same link.</SPAN>';
		}else{
			document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify <BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
			request = new XMLHttpRequest();
			request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nat + '&q=foundedtime' + '&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
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
	request2 = new XMLHttpRequest();
	request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=newnations' + '&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
	while((new Date()).getTime() < originalTime + 600){};
	request2.send();
	originalTime = (new Date()).getTime();
	for (var item = 0; item < request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length; item++){
		if(nations.length < 8){
			var blacklisted = false;
			for(var jtem = 0; jtem < blacklist.length; jtem++){
				if(request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item].indexOf(blacklist[jtem].toLowerCase().replaceAll(' ', '_')) != -1){
					blacklisted = true;
				}
			}
			if(!blacklisted){
				nations[nations.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
				link += nations[item] + ',';
				recips++;
			}
		}
		nats[nats.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
	}
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}else{
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}
}
function recBut(){
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="initiateRecruitGeneration()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}else{
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="initiateRecruitGeneration()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}
}
function initiateRecruitGeneration(){
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}else{
		document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}if(fd + 47336400 > (new Date()).getTime()/1000){
		setTimeout(generateRecruits, 1000 * (13.25 + (fd - (new Date()).getTime()/1000) * 1.72 * 10**-7) * recips + 1000);
	}else{
		setTimeout(generateRecruits, 5000 * recips + 1000);
	}
}
function generateRecruits(){
	recips = 0;
	nations = [];
	try{
		request2 = new XMLHttpRequest();
		request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=newnations' + '&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
		while((new Date()).getTime() < originalTime + 600){};
		request2.send();
		originalTime = (new Date()).getTime();
		processRecruits();
	}catch(e){
		try{
			// Try again if request fails
			originalTime = (new Date()).getTime();
			request2 = new XMLHttpRequest();
			request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=newnations' + '&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
			while((new Date()).getTime() < originalTime + 600){};
			request2.send();
			originalTime = (new Date()).getTime();
			processRecruits();
		}catch(e){
			// If request fails again, post alert, thus stopping the program until user clicks Ok.
			originalTime = (new Date()).getTime();
			alert('Failed to load new recruits. Press Ok below to resume.');
			setTimeout(generateRecruits, originalTime + 600 - new Date().getTime());
		}
	}
}
function processRecruits(){
	for (var item = 0; item < request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length; item++){
		if(nats.indexOf(request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item]) == -1){
			var blacklisted = false;
			for(var jtem = 0; jtem < blacklist.length; jtem++){
				if(request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item].indexOf(blacklist[jtem].toLowerCase().replaceAll(' ', '_')) != -1){
					blacklisted = true;
				}
			}
			if(!blacklisted){
				nations[nations.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
			}
			nats[nats.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
		}
	}if(nations.length > 0){
		link = 'https://www.nationstates.net/page=compose_telegram?tgto=';
		var item = 0;
		while (item < Math.max(8, nations.length)){
			if(item >= 8){
				freeNations[freeNations.length] = nations[item];
				while(freeNations.length > 32){
					freeNations.pop();
				}
			}else if(item < nations.length){
				link += nations[item] + ',';
				recips++;
			}else if(freeNations[0]){
				link += freeNations[0] + ',';
				recips++;
				freeNations.shift();
			}
			item++;
		}
		if(document.querySelector('#SOUND').checked){
			document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<AUDIO AUTOPLAY><SOURCE SRC="https://canineanimal.github.io/GDRecruit/ring.mp3" TYPE="audio/mpeg"></AUDIO><BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
		}else{
			document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
		}
	}else{
		setTimeout(generateRecruits, originalTime + 600 - new Date().getTime());
	}
}
