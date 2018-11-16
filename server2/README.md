# すごいゴミ箱のAPI on Heroku

## 導入
``` bash
$ python -m venv server2
$ cd server2
$ source bin/activate
$ pip install -r requirements.txt
$ python server.py
```

Windowsは`$ Script\activate` でactivateする

## API仕様

|エンドポイント|メソッド|パラメータ|説明|
|:--|:--|:--|:--|
|/|GET|なし|ヘルスチェック|
|/amount|GET|limit(デフォルト:1)|0~4の5段階で表されるゴミの量の最新のログを取得する．limitパラメータで取得件数を指定できる．|
|/amount|POST|amount|ゴミの量のログを追加する．|
|/amount/total|GET|なし|当月の総ゴミ排出量を算出する．|
|/smell|GET|limit(デフォルト:1)|0〜1013で表されるゴミの臭いの強さの最新のログを取得する．limitパラメータで取得件数を指定できる．|
|/smell|POST|smell|ゴミの臭いの強さのログを追加する．(*2)の条件に加え，(*3)の2を満たしている場合，push通知を行う．|
|/config|GET|なし|現在の設定情報を取得する．設定の種類は(*1)を参照|
|/config|POST|(*1)に記載|現在の設定ファイルの状態を変更する．|
|/token|POST|token|プッシュ通知用のトークンを設定する．|
|/notify|GET|なし|条件(*2)に加え，(*3)の1and(2or3)を満たしている場合，プッシュ通知を行う．|
|/notify/test|GET|msg(デフォルト:これはテスト通知です．)|条件(*2)を満たしていればプッシュ通知を行う．|

*1: 設定ファイルには，以下に示すものが含まれる
- name: ゴミ箱につける名前
- nth: 第何曜日が収集日かを設定する．例: 「1,2」「13」のように，第何曜日かの数字を複数設定できる．空なら毎週になる．
- weekday: 何曜日が収集日かを設定する．例: 「0,3」「25」のように，月曜日を0とした曜日を数字で複数設定できる．空なら全ての曜日になる．
- notification: 何かしらの文字が1文字入っていれば通知を行い，空ならば行わない．
- time: プッシュ通知を行う時間を`HH:MM`形式で設定します．例: 「07:00」 

*2: プッシュ通知が行われるには，以下の条件が最低限必要になる．
1. Herokuに環境変数`FCM_API_KEY`が設定されている．
2. Configのtokenが設定されている．
3. Configのnotificationが空でない．

*3: プッシュ通知が行われるには，(*2)の条件に加えて以下の条件がある．
1. ゴミの量の最新のログが3以上である．
2. 今日がゴミ収集日である．
3. 明日がゴミ収集日である．
4. ゴミの臭いの強さの最新のログが500以上である．

## Herokuへのデプロイ
herokuにはmasterブランチのプッシュが必要で，リポジトリの一部のみをpushするのってめんどそうなのでフォルダにコピーしてgit initしてpushする．

Heroku CLIの導入
``` bash
$ brew install heroku/brew/heroku
```

``` bash
$ pwd
/hoge/fuga/jphacks/SD_1806/
$ cp -r server2 ../server2
$ cd ../server2
$ heroku login
ログイン情報は直接伝えます．
$ git init
$ git remote add heroku git@heroku.com:sugoigomibako.git
$ git add .
$ git commit -m "commit comment"
$ git push heroku master

うまくいかなければ
$ heroku keys:add
$ git push heroku master -f
```

これで[https://sugoigomibako.herokuapp.com/](https://sugoigomibako.herokuapp.com/)へアクセスするとデプロイが適用されている．

## テーブル仕様
- Amount: ゴミの総量のログを記録するテーブル
    - recorded: 記録時間
    - amount: ゴミの量，0~4
- Smell: ゴミの臭いの強さのログを記録するテーブル
    - recorded: 記録時間
    - smell: ゴミの臭いの強さ，0~1013
- Config: ゴミ箱の設定を記録するテーブル，基本的に1行のみ
    - name: ゴミ箱の名前
    - nth: 第何曜日がゴミの収集日かを示す，複数の1~4の数字による文字列．nullなら毎週を示す．
    - weekday: どの曜日がゴミ収集日かを示す，複数の0~6の数字による文字列．0は月曜を表す．nullなら全ての曜日を示す．
    - 通知を行うかどうかを示す．空なら通知しない，そうでなければ通知をする．
    - time: 通知を行う時間を`HH:MM`形式で指定する．デフォルトは`07:00`
- Token: プッシュ通知用のトークンテーブル，基本的に1行のみ
    - token: プッシュ通知用のトークン 

テーブルのスキーマが変更になったときはリセットする．
- まずHerokuダッシュボードのSetting -> Config Varsにある`RESET_DB_BY_INIT`を1にする
- 変更を加えたソースコードをHerokuにプッシュする．
- Open appすると初期化処理と一緒にテーブルリセット処理がデプロイ後初回だけ走り，変更したスキーマが適用される．
- `RESET_DB_BY_INIT`を0に戻しておく．