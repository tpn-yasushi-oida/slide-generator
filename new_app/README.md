# ロジックを整理
## 参考サイト
- [【神回】Googleスライドが一瞬で完成する"奇跡"のプロンプト教えます](https://note.com/majin_108/n/n39235bcacbfc)
- [【必見】"改良版"まじん式プロンプト！](https://note.com/majin_108/n/nd11d1f88a939)
## 指定できる要素
- プライマリーカラー #145599
- フォント 
- フッターテキスト
- ヘッダーロゴ https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaWj9IAldlS2r14RkWuKTyOvLs2csIH8rsxA&s
- クロージングロゴ https://www.holdings.toppan.com/assets/ja/img/brand/toppan_brand_link_anime.png


## データの流れ
1. ユーザーの入力
    - プレゼン内容
    - プライマリーカラー
    - フォント
    - フッターテキスト
    - ヘッダーロゴ
    - クロージングロゴ


2. プレゼンデータをJSONで定義
    - 構造化出力でJSONで出力
    - スライド選定をするための具体的な情報は含めておく必要あり

    
3. GASでJSONをスライドに変換
    - GASテンプレートを用意
    - 前のステップからJSONを受け取って、JSオブジェクト配列に格納
    - ユーザー入力


4. スライドURLをフロントエンドのボタンに配置


# TODO
- [ ] 色あらかじめ複数用意
- [ ] デフォルトカラー,デフォルト画像用意
- [ ] デフォルト適用ボタン追加
- [ ] 旧バージョンに戻るボタン
- [ ] 新バージョンに戻るボタン