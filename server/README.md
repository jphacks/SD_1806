# ゴミ収集日(仙台市限定)検索機能付きゴミ箱API

## 導入
``` bash
$ python -m venv server
$ cd server
$ source bin/activate
$ pip install -r requirements.txt
$ python server.py
```

## API仕様

|エンドポイント|メソッド|パラメータ|説明|
|:--|:--|:--|:--|
|/amount|GET|なし|現在のゴミの量を取得．0~4の5段階|
|/config|GET|なし|現在の設定ファイル(*1)の状態を取得する|
|/config|POST|(*2)に記載|現在の設定ファイルの状態を変更する|
|/fcmsetup|POST|id|FCMConfigに端末のIDを設定する．|
|/collection|GET|id,ku,kana1,kana2,juusho|地域を検索し，ゴミ収集日の検索結果(*2)を返す|
|/today|GET|なし|設定ファイルのカテゴリと収集地域IDから今日が収集日かを返す．(*4)|
|/tomorrow|GET|なし|設定ファイルのカテゴリと収集地域IDから明日が収集日かを返す．(*4)|
|/notify|GET|なし|条件(*5)を満たしている場合，FCMConfigの端末IDを使ってプッシュ通知を行う|

*1: 設定ファイルには，以下に示すものが含まれる
- name: ゴミ箱につける名前
- category: ゴミ箱のカテゴリ．以下の4つのいずれかを指定する
    - katei: 家庭ゴミ
    - pura: プラゴミ
    - kanbin: 缶，ビン
    - kamirui: 紙類
- collction: 収集地域ID
- notify_for_today: "1"の時，当日がゴミ捨ての日ならば通知する
- notify_for_tomorrow: "1"の時，翌日がゴミ捨ての日ならば通知する
- notification_time_for_today: 当日ゴミ捨ての通知を行う時間を設定する．例： "07:00"
- notification_time_for_tomorrow: 翌日ゴミ捨ての通知を行う時間を設定する1．例： "19:00"

*2: 以下のように検索を行う
- idを指定： idが指定したidに一致する地域のゴミ収集日情報(*3)を返す
- kuを指定： 指定した区の地域のゴミ収集日情報リストを返す
  - kuとkana1を指定： 指定した区の中で，最初の文字がkana1である地域のゴミ収集日情報リストを返す
    - kuとkana1とkana2を指定：　指定した区の中で，最初の文字がkana1かつ次の文字が最初の文字がkana2である地域のゴミ収集日情報リストを返す
- juushoを指定：　住所が指定した住所に一致する地域のゴミ収集日情報を返す．
- パラメータ指定なし
    - configファイルにゴミ収集日情報のIDが登録されていればそのゴミ収集日情報を返す
    - configファイルにゴミ収集日情報のIDが登録されていなければ，全てのゴミ収集日情報を返す

*3: ゴミ収集日情報は，以下のように構成される．
- id: id
- kana1: 住所の1文字目のカタカナ,
- kana2: 住所の2文字目のカタカナ,
- juusho: 住所,
- katei: 家庭ゴミの収集日,
- pura: プラゴミの収集日,
- kanbin: カン，ビンの収集日,
- kamirui: 紙類の収集日

*4: configも同時に返す．カテゴリか収集日が設定されていなければnullを返す．

*5: ゴミの量が一定値を超えていて，かつ当日または翌日の通知設定がオンになっているとき通知を行う
