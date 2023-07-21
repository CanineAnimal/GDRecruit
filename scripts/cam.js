var nats = [];
var nations = [];
var notify = true;
var freeNations = [];
var blacklistHTML = '';
var blacklist = [];
var originalTime;
var recips = 0;
var delNo = 0;
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
		document.querySelector('TBODY').innerHTML = blacklistHTML + '<TR><TD>Blacklist nation: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR>';

	}else{
		alert('No string entered to blacklist.')
	}
}
function login(){
	nat = document.querySelector('#NATION').value;
	tem = document.querySelector('#TEMPLATE').value;
	verif = document.querySelector('#VERIF').value;
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
    delRequest = new XMLHttpRequest();
    delRequest.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?wa=1&q=delegates&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
    while((new Date()).getTime() < originalTime + 600){};
    delRequest.send();
    originalTime = (new Date()).getTime();
    dels = request.responseXML.querySelector('DELEGATES').innerHTML.split(',');
    delNo = dels.indexOf(prompt('Enter last nation telegrammed if resuming manual campaign (you can view this on your telegram template, as the bottommost sent telegram). If starting campaign, leave the prompt blank and press OK.')) + 1;
    start();
	}
}
function start(){
	link = 'https://www.nationstates.net/page=compose_telegram?tgto=';  var delsGotten = [];
  while(delsGotten.length < 8){
    // Check that Delgate can receive campaign telegrams
  	request2 = new XMLHttpRequest();
	  request2.open('GET', 'https://www.nationstates.net/cgi-bin/api.cgi?nation=' + dels[delNo] + '&q=tgcancampaign&user_agent=GDRecruit maintained by the Ice States GitHub https://github.com/CanineAnimal/GDRecruit user ' + nat, false);
	  while((new Date()).getTime() < originalTime + 600){};
	  request2.send();
	  originalTime = (new Date()).getTime();
    
    // If so, check that Delegate is not blacklisted
    if(request2.responseXML.querySelector('TGCANCAMPAIGN').innerHTML == '1'){
      var blacklisted = false;
			for(var jtem = 0; jtem < blacklist.length; jtem++){
				if(dels[delNo] == blacklist[jtem].toLowerCase().replaceAll(' ', '_')){
					blacklisted = true;
				}
			}

      // If Delegate is not blacklisted, add to list and link etc
      if(!blacklisted){
        delsGotten[delsGotten.length] = dels[delNo];
        link += dels[delNo] + ',';
      }
    }
    delNo++;
    
    // If we already reached the last Delegate for some reason, break out of loop
    if(delNo == dels.length){
      break;
    }
  }

  // Post link
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Campaign</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}else{
		document.body.innerHTML = '<A CLASS="TG" TARGET="_BLANK" HREF="' + link + '&message=' + tem + '" ONCLICK="recBut()">Campaign</A><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}
}
function recBut(){
	if(document.querySelector('#SOUND').checked){
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="start()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND" CHECKED/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}else{
		document.body.innerHTML = '<BUTTON CLASS="TG" ONCLICK="start()">Acknowledge</BUTTON><BR/><BR/><INPUT TYPE="CHECKBOX" ID="SOUND"/> Notify<BR/><BR/><TABLE><THEAD><TH>Blacklisted string</TH><TH>Remove</TH></THEAD><TBODY>' + blacklistHTML + '<TR><TD>Blacklist string: <INPUT ID="VICTIM"></INPUT></TD><TD><BUTTON ONCLICK="add2blacklist()" CLASS="BLACKLIST">Add</BUTTON></TD></TR></TBODY></TABLE>';
	}
}
