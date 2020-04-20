import re
import time
import json
import requests

import datetime

with open('/var/log/syslog') as f:
    for line in f:
        print(line)
        m = re.match(r'(\d)\s(\w+\s{1,}\d{1,}\s\d{2}:\d{2}:\d{2})\s(.+)\s(\w+)\[(\d+)\]:\s(.+)', line)
        print(m)
        now = datetime.datetime.now()
        if m:
            d = {
                'level' : int(m.groups(1)[0]),
                'date': int(datetime.datetime.strptime(str(now.year) + ' ' + m.groups(1)[1], '%Y %b %d %H:%M:%S').timestamp()),
                'computerName': m.groups(1)[2],
                'processName': m.groups(1)[3],
                'processId': int(m.groups(1)[4]),
                'message': m.groups(1)[5]
            }

            response_post = requests.post('http://127.0.0.1:5000/logs', json=d)
            print(response_post.text)
 
 
with open('/var/log/syslog', "w") as f:
    f.write("")

