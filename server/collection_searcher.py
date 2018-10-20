import json

def search_by_id(collection, id):
    for k in collection.values():
        for c in k:
            if str(c['id']) == id: 
                return c
    return {}

def search_by_ku(collection, ku):
    for k in collection:
        if k == ku:
            return collection[ku]
    return {}

def search_by_juusho(collection, juusho):
    for k in collection.values():
        for c in k:
            if c['juusho'] == juusho: 
                return c
    return {}

def search_collection(collection, config, id, ku, kana1, kana2, juusho):
    result = collection

    if id:
        result = search_by_id(collection, id)
    elif ku:
        result = search_by_ku(collection, ku)
        if kana1:
            result = [c for c in result if c['kana1'] == kana1]
            if kana2:
                result = [c for c in result if c ['kana2'] == kana2]
    elif juusho:
        result = search_by_juusho(collection, juusho)
    else:
        if config['collection']:
            result = search_by_id(collection, config['collection'])
    return result