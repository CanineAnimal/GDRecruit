document.querySelector('BUTTON').onclick = function(){
	var nation = document.querySelector('INPUT').value;
	var updates = Number.parseInt(document.querySelector('#UPDATES').value);
	if(nation == ''){
		alert('Please enter your nation name to proceed.')
	}else if (updates == NaN){
		alert('Entered number of updates is invalid.')
	}else{
		document.querySelector('#LOADING').innerHTML = 'Loading...'
		regrequest = new XMLHttpRequest();
		regrequest.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?region=greater_dienstad&q=nations&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nation, false);
		regrequest.send();
		nations = regrequest.responseXML.querySelector('NATIONS').innerHTML.split(':');
		item = 0;
		jtem = 0;
		mins = (new Date()).getHours() * 60 + (new Date()).getMinutes();
		major = 60 * (new Date(1672553100000)).getHours() + (new Date(1672553100000)).getMinutes();
		minor = 60 * (new Date(1672508520000)).getHours() + (new Date(1672508520000)).getMinutes();
		nextMajor = (new Date());
		nextMinor = (new Date());
		nextIsMajor = undefined;
		while (true){
			jtem++;
			mins = 1 + (mins % 1440);
			if(mins == major){
				nextMajor.setTime(Math.floor((nextMajor.getTime() + jtem * 60000)/1000) * 1000);
				if(nextIsMajor == false){
					break;
				}else{
					nextIsMajor = true;
				}
			} if (mins == minor){
				nextMinor.setTime(Math.floor((nextMinor.getTime() + jtem * 60000)/1000) * 1000);
				if(nextIsMajor == true){
					break;
				}else{
					nextIsMajor = false;
				}
			}
		}
		if(updates/2 == Math.floor(updates/2)){
			checkMajor = !nextIsMajor
			days = updates/2 - 1
		}else{
			days = updates/2 - 0.5
		} var interval = setInterval(function(){
			if(item < nations.length){
				var request = new XMLHttpRequest();
				request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nations[item] + '&q=lastlogin&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nation, false);
				request.send();

				if(checkMajor && (nextMajor.getTime()/1000 + days * 86400 - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) > 2419200) && ((nextMinor.getTime()/1000 - 86400) - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) < 2419200)){
					document.body.querySelector('#OUTPUT').innerHTML += nations[item] + ' will CTE next update! Oh dear. <BR/>';
				} else if (!checkMajor && (nextMinor.getTime()/1000 + days * 86400 - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) > 2419200) && ((nextMajor.getTime()/1000 - 86400) - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) < 2419200)){
					document.body.querySelector('#OUTPUT').innerHTML += nations[item] + ' will CTE next update! Oh dear. <BR/>';
				}
				item++;
			}else{
				document.body.querySelector('#LOADING').innerHTML = 'Process complete.'
				clearInterval(interval);
			}
		}, 650);
	}
}
