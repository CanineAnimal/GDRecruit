# Module imports
import xml.etree.ElementTree as ExtraTerrestrial
import requests
import time
import gzip

tries = 0

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
fetch_start = input('Enter first dump to fetch as yyyy-mm-dd: ').split('-')
fetch_end = input('Enter last dump to fetch as yyyy-mm-dd: ').split('-')
user_name = input('Enter your nation name: ')

if(int(fetch_start[0]) < 2021 or int(fetch_start[1]) > 12 or int(fetch_start[1]) < 1 or int(fetch_start[2]) < 1 or int(fetch_start[2]) > months[int(fetch_start[1])]):
	raise # Invalid fetch_start entered
elif(int(fetch_end[0]) < 2021 or int(fetch_end[1]) > 12 or int(fetch_end[1]) < 1 or int(fetch_end[2]) < 1 or int(fetch_end[2]) > months[int(fetch_end[1])]):
	raise # Invalid fetch_end entered
else:
	# Convert fetch_start and fetch_end to fetch_start_id and fetch_end_id for easier comparison with dumps.txt
	fetch_start[0] = int(fetch_start[0])
	fetch_start[1] = int(fetch_start[1])
	fetch_start[2] = int(fetch_start[2])
	fetch_end[0] = int(fetch_end[0])
	fetch_end[1] = int(fetch_end[1])
	fetch_end[2] = int(fetch_end[2])
	
	# Deal with leap years
	if fetch_start[0] % 4 == 0:
		months[2] = 29
	else:
		months[2] = 28
	
	fetch_start_id = fetch_start[2] + (fetch_start[0] - 2021) * 365
	month = 1
	while month < fetch_start[1]:
		fetch_start_id += months[month]
		month += 1
	fetch_end_id = fetch_end[2] + (fetch_end[0] - 2021) * 365
	month = 1
	while month < fetch_end[1]:
		fetch_end_id += months[month]
		month += 1

	# Check if fetching dump is needed
	dump_needed = False
	try:
		saved_dumps.index(str(fetch_start_id))
	except:
		dump_needed = True

	if dump_needed:
		# Dump needed; fetch dump
		try:
			print('Fetching dump from ' + str(fetch_start[0]).zfill(4) + '-' + str(fetch_start[1]).zfill(2) + '-' + str(fetch_start[2]).zfill(2))
			dump = ExtraTerrestrial.fromstring(gzip.decompress(requests.get('https://www.nationstates.net/pages/nations.xml.gz', headers={'User-Agent':'Daily dump download script created by the Ice States and used by ' + user_name}).content))
			print('Locating nation in dump')
			for nation in dump:
				if nation.findall('REGION').text.lower() == region_name.lower():
					print('Saving dump')
					f = open('dumps/' + str(fetch_start_id) + '.xml', 'w')
					f.write(ExtraTerrestrial.tostring(nation, encoding='unicode'))
					f.close()
					print('Updating dumps.txt')
					f = open('dumps/dumps.txt', 'a')
					f.write('\n' + str(fetch_start_id))
					f.close()
			tries = 0
			print('Dump saved.')
		except:
			print('Failed to fetch dump')
			tries += 1
			if tries == 3:
				# Stop trying after three consecutive failures
				raise
		
		# Rate limit requests
		time.sleep(6.5)
