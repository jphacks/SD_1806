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

def crawl():
    id = 0
    result = {}
    for url in urls:
        ward_result = []
        responseHtml = urlopen(url[0])
        bs = BeautifulSoup(responseHtml, 'html.parser')
        datatables = bs.find_all('table', attrs={"class": "datatable"})
        for datatable_id, datatable in enumerate(datatables):
            if datatable_id == 0: continue
            rows = datatable.find_all('tr')
            for row_id, row in enumerate(rows):
                if row_id == 0: continue
                data = row.find_all('td')
                kanas = data[0].find('a').text if data[0].find('a') else data[0].text
                town_result = {
                    'id': id,
                    'kana1': kanas[0],
                    'kana2': kanas[1],
                    'juusho': data[1].text,
                    'katei': data[2].text,
                    'pura': data[3].text,
                    'kanbin': data[4].text,
                    'kamirui': data[5].text
                }
                ward_result.append(town_result)
                id += 1
        result[url[1]] = ward_result

    with open('collection.json', 'w') as collection:
        json.dump(result, collection, ensure_ascii=False)

def init_collection(collection_file):
    if not os.path.exists(collection_file):
        crawl()

if __name__ == '__main__':
    crawl()