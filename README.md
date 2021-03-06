# すごいゴミ箱

## 紹介動画
[![PV](http://img.youtube.com/vi/rz9x2mWWMG0/0.jpg)](https://www.youtube.com/watch?v=rz9x2mWWMG0)]

## 製品外観
![Gomibako](gomi.jpg)

## 製品概要
### ゴミ箱 × Tech

ゴミ出しをついついわすれてしまうあなたのためのIoTゴミ箱「すごいゴミ箱」！

### 背景（製品開発のきっかけ、課題等）

スマートスピーカーやスマートホームなどの普及により、我々の生活のIoT化が進んでいます。
特に電化製品においては自動化や、音声認識が進み利便性が高まっています。しかし、ゴミ箱においては多くの課題を抱えながらも何年も大きな進化がありませんでした。

ゴミ箱やゴミ捨てに対する課題は以下のようなものが挙げられます。

- 朝のバタバタした中で、ゴミの捨て忘れが多い。
- そもそもいつゴミを捨てる日なのか分からない。
- 気付いた時にはかなりの量のゴミが溜まっている。
- 悪臭やコバエ等の発生。
- 世界的にゴミの問題が深刻化している現状の一方で、各家庭ごとのゴミの量を可視化するすべがない。

これらの課題は生活に大きく影響がでないため、ついつい後回しにしがちです。そして、課題解決の対象となるのは、面倒くさがりな人です。スマホアプリとして課題解決を考えると、継続して使われない可能性がありました。そのため、アプリはできるだけ簡略化し、受け身でも利用可能なデバイスを作ることが有効だと考えました。

### 製品説明（具体的な製品の説明）
ゴミ箱の状態やゴミ捨てを管理するIoTデバイスを開発しました。ごみ収集業者向けのゴミ箱管理システムは存在しますが、家庭や学校で利用できるようなシンプルなものはありません。私たちは、赤外線センサーや人感センサー、臭気センサーを用いたIoTデバイスとアプリを開発し課題に挑戦しました。


### 特長

#### 1. 特長1 設置するだけでラクラクゴミ管理
やることはデバイスを設置し簡単な設定をするだけ。自分から働きかけずとも、ゴミ箱が呼びかけてくれます。

#### 2. 特長2 ゴミ捨て日の通知
自分の設定したタイミングで手元のスマホにPUSH通知が届きます。また、ゴミ捨て前日などにゴミ箱の前を通ると、音声でゴミ捨てを知らせてくれます。

ゴミ捨て日の通知だけであれば、リマインダーや自治体のサービスを用いれば容易に実現できます。
ですが、一週間のほとんどは何かのゴミの回収日です。毎日来る煩わしい通知は次第に無意味なものになってしまうでしょう。

このプロダクトでは**全ての通知はゴミ箱が一杯の時だけ**くるので、そんなことにはなりません。

#### 3. 特長3 ゴミの状況を管理
赤外線センサー、臭気センサーに反応し、ゴミ箱の空き容量やゴミ箱の臭さをリアルタイムチェックできます。ゴミが溜まってきた時、ゴミ箱の臭さが一定を超えた時にユーザーに通知されます。

将来的には、ゴミ排出量の可視化と収集を通して、社会問題となっている大量の家庭ごみを削減するための糸口になればいいと考えています。

例えば、１年に自分の家から出したゴミがどのくらいなのか、平均より高いのか低いのか、私たちのほとんどは知りません。そうした情報を可視化するだけでも、価値があると考えています。さらに、このゴミ箱が普及すれば、世帯ごとのごみ排出量の分布がわかります。自治体がそれを使えばごみ削減の活動をより効率的に行えるかもしれません。


### 解決出来ること
ゴミ捨てやゴミ管理を数値化しスマートに行うことができる。個人だけでなく学校や会社でもの利用でき、ゴミ管理への関心が高まる。
また、これまでデータとして数値化されていなかったローカルなゴミ排出量を可視化することで、ゴミ問題への貢献ができる。

### 今後の展望
温度・湿度センサーなどを実装し、ゴミ箱の不快指数を評価。

各家庭のゴミ管理情報という新たなデータからの分析や研究への発展。



## 開発内容・開発技術
### 活用した技術
#### API・データ

* ~~ゴミ収集日取得API （オープンデータプラットフォーム）~~
* サーバーがメンテされておらずレスポンスが500番だったので仙台市について自前で実装

#### フレームワーク・ライブラリ・モジュール
* Firebase
* Flask
* React Native
  - Native Base

#### デバイス
* Raspberry Pi 3
* 赤外線遮断センサー(回路まで自作)
* 人感センサー
* 臭気センサー

### 研究内容・事前開発プロダクト（任意）

* 特になし 

### 独自開発技術（Hack Dayで開発したもの）
#### 2日間に開発した独自の機能・技術
* リアルタイムにゴミの内容量をモニタリング、適切なタイミングで通知をしてくれるIoTゴミ箱

* ハードウェア
  - 筐体（レゴブロックにて自作）
<img src="bodyoverall.jpg" width=500 />
  ラズパイ、センサ基盤3枚、電源回路、スピーカー、赤外線遮断センサ5対が全て筐体内に収まるように設計した。  
  (スピーカーはデモの際は音量の問題から外部に設置した。)  
  人を検知する人感センサのみ外部に設置。  
<img src="body.jpg" width=500 />
  - 赤外線センサーの回路設計
  - 赤外線センサーの回路の作成  
<img src="handa.jpg" width=500 />

* ソフトウェア
 - ゴミ箱の内容量をリアルタイムで確認、ゴミ箱の設定変更ができるモバイルアプリケーション
 - ゴミ出し日の取得API(仙台市のみ)
 - ゴミ箱のドライバ
　
