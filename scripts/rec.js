var time = 5.25;
var originalTime;
var tem;
var nat;

function login(){
	nat = document.querySelector('#NATION').value;
	tem = document.querySelector('#TEMPLATE').value;
	verif = document.querySelector('#VERIF').value;
	
	var request = new XMLHttpRequest();
	request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nation + '&q=region', false);
	request.send();
	if(request.responseXML.querySelector('REGION').innerHTML == 'Greater Dienstad'){
		var request2 = new XMLHttpRequest();
		request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?a=verify&nation=' + nat + '&checksum=' + verif, false);
		request2.send()
		if (request2.responseText == '1'){
			stRecruit(nat, tem);
		}else{
			document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Verification code is incorrect. Please make sure that you have entered your nation name and verification code correctly. Regenerate a verification code using the same link.</SPAN>'
		}
	}else{
		document.body.innerHTML += '<BR/><BR/><SPAN CLASS="ERROR">Error: Nation is not an authorised recruiter for Greater Dienstad.</SPAN>'
	}
}

function stRecruit(){
	var request = new XMLHttpRequest();
	request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nat + '&q=foundedtime', false);
	request.send();
	
	if((eval(request.responseXML.querySelector('FOUNDEDTIME').innerHTML) - (new Date()).getTime()/100) <= 47336400){
		time = 19 - (eval(request.responseXML.querySelector('FOUNDEDTIME').innerHTML) - (new Date()).getTime()/100) * 1.719 * 10**-7);
	}
	
	var nations = [];
	var cont = true;
	var request2;
	var originalTime = (new Date()).getTime();
	
	while (cont){
		request2 = new XMLHttpRequest();
		request2.open('GET', 'https://www.nationstates.net/page=ajax2/a=reports/view=world/filter=founding', false);
		while((new Date()).getTime() > originalTime){};
		request2.send();
		originalTime = (new Date()).getTime();
		for (var item = 0; item < request2.responseXML.length; item++){
			var happ = request2.responseXML[item].innerHTML;
			if(happ.indexOf('was founded in') != -1){
				nations[nations.length] = request2.responseXML[item].querySelector('.nnameblock').innerHTML;
			}
		}
	}
	
	link = 'https://www.nationstates.net/page=compose_telegram?tgto=';
	for(var item = 0; item < Math.min(8, nations.length); item++){
		link += nations[item] + ',';
	};
	link += '&message=' + tem;
	document.body.innerHTML = '<A CLASS="TG" HREF="' + link + '" ONCLICK="funcrecruit()">Recruit</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
}

function funcrecruit(){
	var request = new XMLHttpRequest();
	request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nat + '&q=foundedtime', false);
	request.send();
	
	if((eval(request.responseXML.querySelector('FOUNDEDTIME').innerHTML) - (new Date()).getTime()/100) <= 47336400){
		time = 19 - (eval(request.responseXML.querySelector('FOUNDEDTIME').innerHTML) - (new Date()).getTime()/100) * 1.719 * 10**-7);
	}
	
	var nations = [];
	var cont = true;
	var request2;
	var originalTime = (new Date()).getTime();
	
	while (cont){
		request2 = new XMLHttpRequest();
		request2.open('GET', 'https://www.nationstates.net/page=ajax2/a=reports/view=world/filter=founding', false);
		while((new Date()).getTime() > originalTime){};
		request2.send();
		originalTime = (new Date()).getTime();
		for (var item = 0; item < request2.responseXML.length; item++){
			var happ = request2.responseXML[item].innerHTML;
			if(happ.indexOf('was founded in') != -1){
				nations[nations.length] = request2.responseXML[item].querySelector('.nnameblock').innerHTML;
			}
		}
	}
	
	link = 'https://www.nationstates.net/page=compose_telegram?tgto=';
	for(var item = 0; item < Math.min(8, nations.length); item++){
		link += nations[item] + ',';
	};
	link += '&message=' + tem;
	document.body.innerHTML = '<A CLASS="TG" HREF="' + link + '" ONCLICK="funcrecruit()">Recruit</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify';
}
