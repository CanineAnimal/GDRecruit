document.querySelector('BUTTON').onclick = function(){
	var nation = document.querySelector('INPUT').value;
	if(nation == ''){
		alert('Please enter your nation name to proceed.')
	}else{
		document.querySelector('#LOADING').innerHTML = 'Loading...'
		var regrequest = new XMLHttpRequest();
		regrequest.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?region=greater_dienstad&q=nations&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nation, false);
		regrequest.send();
		var nations = regrequest.responseXML.querySelector('NATIONS').innerHTML.split(':');
		var item = 0;
		var mins = (new Date()).getHours() * 60 + (new Date()).getMinutes();
		var originalMins = mins;
		var major = 60 * (new Date(1672553100000)).getHours() + (new Date(1672553100000)).getMinutes();
		var minor = 60 * (new Date(1672508520000)).getHours() + (new Date(1672508520000)).getMinutes();
		var nextMajor = (new Date());
		var nextMinor = (new Date());
		var nextIsMajor;
		while (true){
			mins = 1 + (mins % 1440);
			if(mins == major){
				nextMajor.setTime(nextMajor.getTime() + (mins - originalMins) * 60000));
				if(nextIsMajor == false){
					break;
				}else{
					nextIsMajor = true;
				}
			} if (mins == minor){
				nextMinor.setTime(nextMinor.getTime() + (mins - originalMins) * 60000));
				if(nextIsMajor == true){
					break;
				}else{
					nextIsMajor = false;
				}
			}
		}
		var interval = setInterval(function(){
			if(item < nations.length){
				var request = new XMLHttpRequest();
				request.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nations[item] + '&q=lastlogin&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nation, false);
				request.send();

				if(nextIsMajor && (nextMajor.getTime()/1000 - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) > 2419200) && ((nextMinor.getTime()/1000 - 86400) - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) > 2419200)){
					document.body.querySelector('#OUTPUT').innerHTML += nations[item] + ' will CTE next update! Oh dear. <BR/>';
				} else if (nextIsMinor && (nextMinor.getTime()/1000 - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) > 2419200) && ((nextMajor.getTime()/1000 - 86400) - eval(request.responseXML.querySelector('LASTLOGIN').innerHTML) > 2419200)){
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
