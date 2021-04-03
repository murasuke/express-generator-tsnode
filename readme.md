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

* ファイル変更時にリコンパイル＆再起動を行うため、package.jsonに「dev」を追加します。
```json
  "scripts": {
    "start": "node ./bin/www",
    "dev": "nodemon --ext js,ts ./bin/www"
  },
```

これでファイル変更時にリロードされるようになります。
```bash
npm run dev
```

* ここまでのソース
https://github.com/murasuke/express-generator-tsnode/tree/chapter2

## 3部 requireをimportに変えて型定義の恩恵にあずかる

2章まで目的のts化は果たしていますが、require()で読み込んだモジュールはany扱いとなり
typescriptの恩恵にあずかれないため、importに書き換えます。

exportの書き換えも必要ですが、元のmodule.exportに加えて、export defaultを追加することで読み込み側は変更を強制されなくなります。
```typescript
// importでもrequire()でも読み込めるように2種類export
module.exports = app;
export default app;
```

### 変更前(app.ts)

```typescript
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
```



### 変更後(app.ts)
```typescript
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// module.exportsとexport default両方使っているので
// 読み込み側はimportでもrequire()でも使えます
// ちょっとずつ変更していくためには便利です
var indexRouter = require('./routes/index');
import usersRouter from './routes/users';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// importでもrequire()でも読み込めるように2種類export
module.exports = app;
export default app;
```

### 変更後(index.ts)
```typescript
import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// importでもrequire()でも読み込めるように2種類export
module.exports = router;
export default router;
```
* ここまでのソース
https://github.com/murasuke/express-generator-tsnode/tree/chapter2