#!/usr/bin/env python
'''
Filename format is as follows:
    SITE_combined2_YYYY_MM_DD_hh_mm_ss_mss.txt

    Columns inside the file are as follows:

        Column[0] txp_id
        Column[1] frequency (constant value; ignore)
        Column[2] cnr
        Column[3] mer
        Column[4] frequency (constant value; ignore)
        Column[5] lock_count
        Column[6] effective_frequency
        Column[7] relock_count
        Column[8] power
        Column[9] esno

        The timestamp of first transponder measurement in file is the filename
        timestamp
        The timestamp of the last transponder measurement is in the last line
        of the file: End:  YYYY/MM/DD  hh:mm:ss.mss

        Assume that all transponders are measured in equal amounts of time.
        Increment = ((timestamp 1st TXP) - (timestamp last TXP)) / (#TXPs - 1)

                1st TXP timestamp = filename timestamp
                2nd TXP timestamp = filename timestamp + Increment
                3rd TXP timestamp = filename timestamp + 2*Increment
                4th TXP timestamp = filename timestamp + 3*Increment
                ...
                ...
                ...
                last TXP timestamp = timestamp in the last line of the file
'''

import os
import pymongo
import json
import mmap
import urllib2

from fnmatch import fnmatch
from datetime import datetime
from contextlib import closing


db = pymongo.MongoClient().rfcc_data
esno_thresh = db.data_type.find({'type': 'esno'})[0]
cnr_thresh = db.data_type.find({'type': 'cnr'})[0]
mer_thresh = db.data_type.find({'type': 'mer'})[0]
power_thresh = db.data_type.find({'type': 'power'})[0]
ef_thresh = db.data_type.find({'type': 'eff_freq'})[0]


def verify_value(val, expected):
    alert = 'clean'
    val = float(val)

    if val >= expected['upperDanger']:
        alert = 'danger'
    if val >= expected['upperWarning'] and val < expected['upperDanger']:
        alert = 'warning'
    if val <= expected['lowerWarning'] and val > expected['lowerDanger']:
        alert = 'warning'
    if val <= expected['lowerDanger']:
        alert = 'danger'
    return alert


def check_all_thresholds(doc):
    esno_alert = verify_value(doc['esno'], esno_thresh)
    cnr_alert = verify_value(doc['cnr'], cnr_thresh)
    mer_alert = verify_value(doc['mer'], mer_thresh)
    power_alert = verify_value(doc['power'], power_thresh)

    if esno_alert != 'clean':
        create_alert(doc, 'esno', esno_alert)
    if cnr_alert != 'clean':
        create_alert(doc, 'cnr', cnr_alert)
    if mer_alert != 'clean':
        create_alert(doc, 'mer', mer_alert)
    if power_alert != 'clean':
        create_alert(doc, 'power', power_alert)
#   Effective Frequenct currently doesn't have thresholds set
#   Disabling for now
#    if ef_alert != 'clean':
#        create_alert(doc, 'eff_freq', ef_alert)

'''{
    "alert": {
        "site": "LACA",
        "sat": "f1234",
        "transponder": "TXP-22",
        "data_type": "esno",
        "threshold": 3.2,
        "current_value": 1.5,
        "category": "danger",
    }
}'''


def create_alert(doc, val_name, category):
    alert = {'alert': {}}
    existing_alert = db.alerts.find({'data_type': val_name,
                                     'site': doc['site'],
                                     'transponder': doc['txp_id']}).count()
    update_alert = True if existing_alert == 1 else False
#   Check for dup, if dup, update
#   else create new
    if update_alert:
        print('duplicate alert')
    else:
        alert['alert']['data_type'] = val_name
        alert['alert']['category'] = category
        alert['alert']['current_value'] = doc[val_name]
        alert['alert']['site'] = doc['site']
        alert['alert']['transponder'] = doc['txp_id']
        print json.dumps(alert, indent=2)
        req = urllib2.Request('http://localhost:3000/alerts/insert')
        req.add_header('Content-Type', 'application/json')
        urllib2.urlopen(req, json.dumps(alert))


def get_filelist():
    for filename in os.listdir('.'):
        if fnmatch(filename, '*.txt'):
            split_name = filename.split('_', 2)
            str_starttime = split_name[2][:-4]
            site = split_name[0]
#           print('Importing: {0} @ {1}:{2}, {3}/{4}/{5}').format(site, hour,
#                                                                  minute, day,
#                                                                  month, year)
            starttime = datetime.strptime(str_starttime,
                                          '%Y_%m_%d_%H_%M_%S_%f')
            interval = get_interval(starttime, filename)
            i = 0
            file = open(filename, 'r')
            lines = file.readlines()
            lines = lines[1:-1]
            docs = []
            for line in lines:
                columns = line.split()
                doc = {}
                doc['site'] = site
                doc['txp_id'] = columns[0][5:]
                doc['cnr'] = columns[2]
                doc['mer'] = columns[3]
                doc['lock_count'] = columns[5]
                doc['eff_freq'] = columns[6]
                doc['relock_count'] = columns[7]
                doc['power'] = columns[8]
                doc['esno'] = columns[9]
                doc['date_time'] = (starttime+(interval * i)).isoformat() + 'Z'
                check_all_thresholds(doc)
                docs.append(doc)
                i += 1
            db.main_data.insert_many(docs)
            file.close()
            os.remove(filename)


def get_interval(starttime, file):

    str_endtime = ''

    with open(file, 'r+b') as f:
        with closing(mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_WRITE)) as mm:
            startofline = mm.rfind(b'\n', 0, len(mm) - 1) + 1
            str_endtime = mm[startofline:].rstrip(b'\r\n')

    pruned_time = str_endtime.split(' ', 1)[1]
    endtime = datetime.strptime(pruned_time, ' %Y/%m/%d %H:%M:%S.%f')

#   Since we are counting the header & end when calculating num_of_pts
#   We subtract by 3 instead of 1
    num_of_pts = get_pts_num(file)

    interval = (endtime - starttime) / (num_of_pts)
    return interval


def get_pts_num(filename):
    return sum(1 for line in open(filename))


def main():
    get_filelist()

if __name__ == '__main__':
    main()
