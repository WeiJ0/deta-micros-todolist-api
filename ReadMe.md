# Node.js + Express.js + deploy to Deta Micros

## 簡述

因 heroku 免費方案即將下架，於是找了 Deta 來當作替代方案。使用了 Express 當作伺服器並練習使用 Deta Base 當作資料庫，建立 API 供之前憐惜的 TodoList 串接。

## 開發模式下

開啟 108 行註解啟動

```js title="index.js"
app.listen(3032, () => {
  console.log("server is running");
});
```

```shell
node index
```

## 部屬至 Deta Micros

詳細步驟參考 [Deta Micros 部屬 Express 程式](https://weij0.github.io/Web/docs/Deta/Deta_Micros)

將 app.listen 註解，伺服器使用 `module.exports = app;`

```shell
deta deploy
```

## API

BaseURL

```
https://3vqmlj.deta.dev
```

```js
-GET /todos/ 
- 取得所有 todos， message [Array]
//response
{
    "success": true,
    "message": [
        {
            "content": [string],
            "isFinished": [boolean],
            "key": [string],
        },
    ],
};
```

```js
-POST /todos/add
- 產生新的一筆 todos
//request
{
    "content": [string], //[必填] 內容
    "isFinished": [boolean], //是否完成, 未填則預設為 false
    "key": [string] //唯一值，可自行定義，未填系統亂數產生
}

//response
{
    "success": true,
    "message": {
        "content": [content],
        "isFinished": [isFinished],
        "key": [key]
    }
}
```

```js
-PATCH /todos/:key
- 修改是否完成狀態

//response
{
    "success": true,
    "message": null
}
```

```js
-DELETE /todos/:key
- 刪除某一筆 todo

//response
{
    "success": true,
    "message": null
}
```

```js
-DELETE /todos/all
- 刪除已完成 todo

//response
{
    "success": true,
    "message": null
}
```

## DEMO 
[DEMO CodePen](https://codepen.io/weijlin/pen/bGMpeNG?editors=0010)