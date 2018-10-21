# Firebase Cloud Messenger (FCM) Webアプリからスマホに通知を送る(Android)

[ここ](https://qiita.com/flatfisher/items/bdec83caf3c7f9c8917c)をベースに実装
より高度なことをしたいときは[公式](https://firebase.google.com/docs/cloud-messaging/android/client)
Webアプリは[pyfcm](https://pypi.org/project/pyfcm/)を使う

## スマホアプリを作成
AndroidでHelloWorldなプロジェクトを作成し，パッケージ名をコピー

## Firebase Consoleでの作業
- 新規プロジェクトの作成＞作成＞AndroidアプリにFirebaseを追加
- パッケージ名を貼り付けて進む
- 指示に従いgoogle-services.jsonをスマホアプリのプロジェクトに配置

## スマホアプリの設定
プロジェクトレベルのbuild.gradleに以下を追加
```
buildscript {
  dependencies {
    // ここに追加
    classpath 'com.google.gms:google-services:3.0.0'
  }
}
```
アプリレベルのbuild.gradleに以下を追加
```
dependencies {
    // ...省略
    implementation 'com.google.firebase:firebase-core:16.0.4'
    implementation 'com.google.firebase:firebase-messaging:17.3.4'
}
// 末尾に追加
apply plugin: 'com.google.gms.google-services'
```

この状態でSyncすると，`FirebaseInstanceId.getInstance().token`によって端末のトークンを得られる．
そのトークンを記録しておく

## Webアプリ側の設定
Pythonを使う．
Firebase Console >　設定 ＞ クラウドメッセージング ＞ サーバーキーをコピー

pyfcmをインストールする
``` bash
$ pip install pyfcm
```

次のソースを参考に好きなタイミングで`notify_single_device'を呼んでプッシュメッセージを送信する．
``` python
from pyfcm import FCMNotification

push_service = FCMNotification(api_key="<api-key>")

registration_id = "<device registration_id>"
message_title = "Uber update"
message_body = "Hi john, your customized news for today is ready"
result = push_service.notify_single_device(registration_id=registration_id, message_title=message_title, message_body=message_body)
```