# Expressをディレクトリ構成変えずに最小限の手間でTypescriptにする手順

# 目的

TypeScriptにするためにディレクトリ構成を変更するなどせず、拡張子を変える ＋ αのおまじない程度でTypeScript化します。

ソースを変えた際に自動で再起動する機能も持っています。

create-react-appのTypeScript用テンプレートのように、フォルダ構成を意識しなくて済むので
導入に最適です。

（tsconfigファイルの設定で頭を悩ます必要はないです）

## 3部構成です

1. express-generatorインストール＋プロジェクトテンプレート作成
2. 拡張子の変更 ＋ おまじない(www.jsでts-nodeを使い、tsファイルをロードする)
3. requireをimportに変えて型定義の恩恵に預かる


## 1部 expressとTypeScriptの導入

```bash
npx express-generator --no-view --git ./express-generator-tsnode
cd express-generator-tsnode/
npm install
```
* RestAPI用に作るので、viewエンジンは未使用にしています(--no-view)
* --git を付けて「.gitignore」を作っています(楽をするため)

この時点でexpressをサーバとして動作させることができます。「http://localhost:3000」
```bash
npm run start
```

* 次にTypeScriptと、型定義をインストールします
```bash
npm i -D typescript nodemon ts-node @types/cookie-parser @types/express @types/morgan 
```
* Typescriptの設定ファイルを作成します(tsconfig.json)
```bash
npx tsc --init
```

## 2部 拡張子の変更 ＋ おまじない(www.jsでts-nodeを使い、tsファイルをロードする)

この章がメインです。

1. 生成されたjsファイルの拡張子を全て「ts」に変更します

    ./route/index.js ⇒ ./route/index.ts

    ./route/users.ts  ⇒ ./route/users.ts

    ./bin/wwww.js　 ⇒ ./bin/wwww.ts


2. ./bin フォルダに「www.js」を追加し下記の内容を追記します。
```javascript
require('ts-node').register();
require('./www.ts');
```

3. tsconfig.json のコメントを1行外します

    jsソースのままでも動作可能とするためです。

```json
"noImplicitAny": false,
```

* これでtypescript化したexpressアプリケーションが動作します。
```bash
npm run start
```