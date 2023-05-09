# Module imports
import xml.etree.ElementTree as ExtraTerrestrial
from datetime import date
import requests
import time
import gzip
import os

tries = 0
cont = False

# Get dumps already fetched
try:
	f = open('dumps/dumps.txt', 'r')
	saved_dumps = f.read().split('\n')
	f.close()
except:
	# Create dumps.txt if it somehow does not exist
	if not os.path.exists('./dumps'):
		os.makedirs('./dumps')
	f = open('dumps/dumps.txt', 'x')
	f.close()
	saved_dumps = []

# Months of the year for advance etc
months = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

# Find what API dumps to get
region_name = input('Enter region name (use spaces instead of underscores): ')
user_name = input('Enter your nation name: ')

# Convert date_raw to date_id for easier comparison with dumps.txt
date_raw = [date.fromtimestamp(time.time()).year, date.fromtimestamp(time.time()).month, date.fromtimestamp(time.time()).day]

# Deal with leap years
if date_raw[0] % 4 == 0:
	months[2] = 29
else:
	months[2] = 28

date_id = date_raw[2] + (date_raw[0] - 2021) * 365
month = 1
while month < date_raw[1]:
	date_id += months[month]
	month += 1

# Check if fetching dump is needed
dump_needed = False
try:
	saved_dumps.index(str(date_id))
except:
	dump_needed = True

while dump_needed:
	# Dump needed; fetch dump
	try:
		print('Fetching dump from ' + str(date_id))
		dump = ExtraTerrestrial.fromstring(gzip.decompress(requests.get('https://www.nationstates.net/pages/nations.xml.gz', headers={'User-Agent':'Daily dump download script created by the Ice States and used by ' + user_name}).content))
		print('Locating nations in dump')
		f = open('dumps/' + str(date_id) + '.xml', '1')
		f.write('<ROOT>')
		f.close()
		for nation in dump:
			if nation.findall('REGION')[0].text.lower() == region_name.lower():
				try:
					f = open('dumps/' + str(date_id) + '.xml', 'a')
					f.write('<NATION>' + ExtraTerrestrial.tostring(nation.findall('NAME')[0]).decode('utf8') + ExtraTerrestrial.tostring(nation.findall('LASTLOGIN')[0]).decode('utf8') + '</NATION>')
					f.close()
				except:
					cont = True
					f = open('dumps/' + str(date_id) + '.xml', 'a')
					f.write('<NATION>' + ExtraTerrestrial.tostring(nation.findall('NAME')[0]).decode('utf8') + ExtraTerrestrial.tostring(nation.findall('LASTLOGIN')[0]).decode('utf8') + '</NATION>')
					f.close()
				
				if cont:
					try:
						f = open('dumps/' + str(date_id) + '.xml', 'a')
						f.write('<NATION>' + ExtraTerrestrial.tostring(nation.findall('NAME')[0]).decode('utf8') + ExtraTerrestrial.tostring(nation.findall('LASTLOGIN')[0]).decode('utf8') + '</NATION>')
						f.close()	
					except:
						pass
		
		f = open('dumps/' + str(date_id) + '.xml', '1')
		f.write('</ROOT>')
		f.close()
		
		print('Updating dumps.txt')
		f = open('dumps/dumps.txt', 'a')
		f.write('\n' + str(date_id))
		f.close()
		tries = 0
		print('Dump saved.')
		break
	except:
		print('Failed to fetch dump')
		tries += 1
		if tries == 3:
			# Stop trying after three consecutive failures
			raise
	
	# Rate limit requests
	time.sleep(6.5)
while dump_needed:
	# Dump needed; fetch dump
	try:
		print('Fetching dump from ' + str(date_id))
		dump = ExtraTerrestrial.fromstring(gzip.decompress(requests.get('https://www.nationstates.net/pages/nations.xml.gz', headers={'User-Agent':'Daily dump download script created by the Ice States and used by ' + user_name}).content))
		print('Locating nation in dump')
		for nation in dump:
			if nation.findall('REGION').text.lower() == region_name.lower():
				print('Saving dump')
				f = open('dumps/' + str(date_id) + '.xml', 'w')
				f.write(ExtraTerrestrial.tostring(nation, encoding='unicode'))
				f.close()
				print('Updating dumps.txt')
				f = open('dumps/dumps.txt', 'a')
				f.write('\n' + str(date_id))
				f.close()
		tries = 0
		print('Dump saved.')
		break
	except:
		print('Failed to fetch dump')
		tries += 1
		if tries == 3:
			# Stop trying after three consecutive failures
			raise
	
	# Rate limit requests
	time.sleep(6.5)
