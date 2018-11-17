from urllib.request import urlopen
from bs4 import BeautifulSoup
import json, os

urls = [
    ['http://www.city.sendai.jp/haiki-shido/kurashi/machi/genryo/gomi/yobi/ichiran-a.html', '青葉区'],
    ['http://www.city.sendai.jp/haiki-shido/kurashi/machi/genryo/gomi/yobi/ichiran-i.html', '泉区'],
    ['http://www.city.sendai.jp/haiki-shido/kurashi/machi/genryo/gomi/yobi/ichiran-t.html', '太白区'],
    ['http://www.city.sendai.jp/haiki-shido/kurashi/machi/genryo/gomi/yobi/ichiran-m.html', '宮城野区'],
    ['http://www.city.sendai.jp/haiki-shido/kurashi/machi/genryo/gomi/yobi/ichiran-w.html', '若林区']
]

ku_list = [url[1] for url in urls]

def crawl():
    result = []

    for url in urls:
        responseHtml = urlopen(url[0])
        bs = BeautifulSoup(responseHtml, 'html.parser')

        datatables = bs.find_all('table', attrs={"class": "datatable"})

        ku_id = ku_list.index(url[1])

        for datatable_id, datatable in enumerate(datatables):
            if datatable_id == 0: continue

            rows = datatable.find_all('tr')

            for row_id, row in enumerate(rows):
                if row_id == 0: continue

                data = row.find_all('td')
                if data[0].find('a'):
                    kanas = data[0].find('a').text
                else:
                    kanas = data[0].text

                result.append({
                    'pref_id': '0',
                    'city_id': '0',
                    'ku_id': ku_id,
                    'kana1': kanas[0].strip(),
                    'kana2': kanas[1].strip(),
                    'juusho': data[1].text.strip(),
                    'katei': data[2].text.strip(),
                    'pura': data[3].text.strip(),
                    'kanbin': data[4].text.strip(),
                    'kamirui': data[5].text.strip()
                })

    return result
