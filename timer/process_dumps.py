# Module imports
import xml.etree.ElementTree as ExtraTerrestrial
from datetime import datetime
import requests
import time

# Get dumps already fetched
f = open('dumps/dumps.txt', 'r')
saved_dumps = f.read().split('\n')
saved_dumps.sort()
f.close()

# Data variables
cont = True
next_major = 0
some_major = 60 * datetime.fromtimestamp(1680498300).hour + datetime.fromtimestamp(1680498300).minute

# Inputs
user_name = input('Enter your nation name: ')
days = input('Enter amount of days for which to scan CTEs: ')

nats = ExtraTerrestrial.parse(open('dumps/' + saved_dumps[len(saved_dumps) - 1] + '.xml')).findall('NATION')
gd_nations = ExtraTerrestrial.fromstring(requests.get('https://www.nationstates.net/cgi-bin/api.cgi?region=greater_dienstad&q=nations', headers={'User-Agent':'CTE timer script created by the Ice States and used by ' + user_name}).text)[0].text.split(':')
original_time = time.time_ns();
for nation in nats:
	# Find next major update
	item = time.time()
	while True:
		if(60 * datetime.fromtimestamp(item).hour + datetime.fromtimestamp(item).minute == some_major):
			next_major = item
			break
		item += 1
	try:
		gd_nations.index(nation[0].text)
		cont = True
	except:
		cont = False

	if cont:
	# Check if nation last log in is within CTE range
		last_login = eval(nation.findall('LASTLOGIN')[0].text)
		if(next_major - last_login > (28 - days) * 86400 and next_major - last_login < (29 - days) * 86400):
			# Nation is not on vacation mode and may CTE; check that nation has not been logged into since dump
			if time.time_ns() < original_time + 650000000:
				time.sleep(original_time + 650000000 - time.time()) # Rate limit to avoid violating API rules
			actual_last_login = eval(ExtraTerrestrial.fromstring(requests.get('https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nation[0].text + '&q=lastlogin', headers={'User-Agent':'CTE timer script created by the Ice States and used by ' + user_name}).text)[0].text)
			if(next_major - actual_last_login > (28 - (days - 1)) * 86400 and next_major - actual_last_login < (29 - (days - 1)) * 86400):
				print(nation[0].text + ' will CTE by next major update.')
		
		if(next_major - last_login > (60 - (days - 1)) * 86400 and next_major - last_login < (61 - (days - 1)) * 86400):
			# Nation is on vacation mode and may CTE; check that nation has not been logged into since dump
			if time.time_ns() < original_time + 650000000:
				time.sleep(original_time + 650000000 - time.time()) # Rate limit to avoid violating API rules
			actual_last_login = eval(ExtraTerrestrial.fromstring(requests.get('https://www.nationstates.net/cgi-bin/api.cgi?nation=' + nation[0].text + '&q=lastlogin', headers={'User-Agent':'CTE timer script created by the Ice States and used by ' + user_name}).text)[0].text)
			if(next_major - actual_last_login > (28 - days) * 86400 and next_major - actual_last_login < (29 - days) * 86400):
				print(nation[0].text + ' will CTE by next major update, and is on vacation mode.')
