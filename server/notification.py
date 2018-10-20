def notify_for_today(pb):
    pb.push_note("スマートゴミ箱", "ゴミ箱がいっぱいです．今すぐ捨てに行きましょう！")
    return "Take out the garbage TODAY!"

def notify_for_tomorrow(pb):
    pb.push_note("スマートゴミ箱", "ゴミ箱がいっぱいです．明日までに捨てましょう！")
    return "Take out the garbage Tomorrow!"