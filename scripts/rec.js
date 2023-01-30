var nats = [];
var nations = [];
var notify = true;
var blacklistHTML = '';
var blacklist = ['frostland', 'farmer'];
var originalTime2;
var originalTime;
var tem;
var nat;
var fd;
for(var item = 0; item < blacklist.length; item++){
	blacklistHTML += '<TR><TD>' + blacklist[item] + '</TD><TD><BUTTON ONCLICK="whitelist(' + item + ')" CLASS="WHITELIST">X</BUTTON></TD></TR>';
}

function whitelist(victim){
	blacklist.pop(eval(victim));
	for(var item = 0; item < blacklist.length; item++){
		blacklistHTML += '<TR><TD>' + blacklist[item] + '</TD><TD><BUTTON ONCLICK="whitelist(' + item + ')" CLASS="WHITELIST">X</BUTTON></TD></TR>';
	}
	document.querySelector('TBODY').innerHTML = blacklistHTML;
}
function add2blacklist(){
	var victim = document.querySelector('#VICTIM').value;
	if(victim){
		blacklist[blacklist.length] = victim;
		for(var item = 0; item < blacklist.length; item++){
			blacklistHTML += '<TR><TD>' + blacklist[item] + '</TD><TD><BUTTON ONCLICK="whitelist(' + item + ')" CLASS="WHITELIST">X</BUTTON></TD></TR>';
		}
		document.querySelector('TBODY').innerHTML = blacklistHTML;
	}else{
		alert('No string entered to blacklist.')
	}
}
function login(){
	nat = document.querySelector('#NATION').value;
	tem = document.querySelector('#TEMPLATE').value;
	verif = document.querySelector('#VERIF').value;
	if(['the_ice_states', 'the_macabees', 'holy_marsh'].indexOf(nat.toLowerCase().replaceAll(' ', '_')) == -1){
		document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Nation is not an authorised recruiter for Greater Dienstad.</SPAN>'
	}else{
		var request = new XMLHttpRequest();
		request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?a=verify&nation=' + nat + '&checksum=' + verif + '&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
		request.send();
		originalTime = (new Date()).getTime();
		if(request.responseText.indexOf('1') == -1){
			document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Verification code is incorrect. Please make sure that you have entered your nation name and verification code correctly. Regenerate a verification code using the same link.</SPAN>';
		}else{
			document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify <BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="victim"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
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
	var request2;
	request2 = new XMLHttpRequest();
	request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=newnations' + '&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
	while((new Date()).getTime() < originalTime + 600){};
	request2.send();
	originalTime = (new Date()).getTime();
	for (var item = 0; item < request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length; item++){
		if(nations.length < 8){
			var blacklisted = false;
			for(var jtem = 0; jtem < blacklist.length; jtem++){
				if(request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item].indexOf(blacklist[jtem]) != -1){
					blacklisted = true;
				}
			}
			if(!blacklisted){
				nations[nations.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
				link += nations[item] + ',';
			}
		}
		nats[nats.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
	}
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="victim"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}else{
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="victim"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}
}
function recBut(){
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="initiateRecruitGeneration()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="victim"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}else{
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="initiateRecruitGeneration()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="victim"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}
}
function initiateRecruitGeneration(){
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="victim"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}else{
		document.body.innerHTML = 'Loading...<BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="victim"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
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
	request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?q=newnations' + '&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
	while((new Date()).getTime() < originalTime + 600){};
	request2.send();
	originalTime = (new Date()).getTime();
	for (var item = 0; item < request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',').length; item++){
		if(nats.indexOf(request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item]) == -1){
			var blacklisted = false;
			for(var jtem = 0; jtem < blacklist.length; jtem++){
				if(request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item].indexOf(blacklist[jtem]) != -1){
					blacklisted = true;
				}
			}
			if(!blacklisted){
				nations[nations.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
				link += nations[item] + ',';
			}
			if(nations.length < 8){
				var blacklisted = false;
				for(var jtem = 0; jtem < blacklist.length; jtem++){
					if(request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item].indexOf(blacklist[jtem]) != -1){
						blacklisted = true;
					}
				}
				if(!blacklisted){
					nations[nations.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
				}
			};
			nats[nats.length] = request2.responseXML.querySelector('NEWNATIONS').innerHTML.split(',')[item];
		}
	}if(nations.length > 0){
		link = 'https://www.nationstates.net/page=compose_telegram?tgto=';
		for(var item = 0; item < Math.min(8, nations.length); item++){
			link += nations[item] + ',';
		}
		if(document.querySelector('#SOUND').checked){
			document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<AUDIO AUTOPLAY><SOURCE SRC="https://canineanimal.github.io/GDRecruit/ring.mp3" TYPE="audio/mpeg"></AUDIO><BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="victim"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
		}else{
			document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Recruit</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="victim"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
		}
	}else{
		setTimeout(generateRecruits, originalTime + 600 - new Date().getTime());
	}
}
