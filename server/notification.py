TITLE = "スマートゴミ箱"
MESSAGE_TODAY = "ゴミ箱がいっぱいです．今日はゴミの日なので捨てに行きましょう！"
MESSAGED_TOMORROW = "ゴミ箱がいっぱいです．明日はゴミの日なので捨てに行きましょう！"

def notify_for_today(ps, config):
    return ps.notify_single_device(registration_id=config['id'], message_title=TITLE, message_body=MESSAGE_TODAY)

def notify_for_tomorrow(ps, config):
    return  ps.notify_single_device(registration_id=config['id'], message_title=TITLE, message_body=MESSAGED_TOMORROW)