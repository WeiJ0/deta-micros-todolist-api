require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Deta } = require("deta");
const deta = Deta(process.env.PROJECT_KEY);
const db = deta.Base("todos");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello World!"));

const fetchDBData = async (queryObject = {}) => {
  let list = await db.fetch(queryObject);
  let allItems = await list.items;

  while (list.last) {
    list = await db.fetch(queryObject, { last: list.last });
    allItems = allItems.concat(list.items);
  }

  return allItems;
};

app.get("/todos/", async (req, res) => {
  res.json({ success: true, message: await fetchDBData() });
});

app.post("/todos/add", async (req, res) => {
  const { content, isFinished = false } = req.body;
  
  if (!content) {
    res.status(200).json({ success: false, message: "請輸入內容" });
    return;
  }

  try {
    const result = await db.put({ content, isFinished });
    res.status(201).json({ success: true, message: result });
  } catch (ex) {
    await res.json({ success: false, message: ex });
  }
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    await res.json({ success: false, message: "需要輸入 id" });
    return;
  }

  const item = await db.get(id);

  if (!item) {
    await res.json({ success: false, message: "查無該ID資料" });
    return;
  }

  try {
    const update = { isFinished: !item.isFinished };
    const result = await db.update(update, id);
    await res.json({ success: true, message: result });
  } catch (ex) {
    await res.json({ success: false, message: ex });
  }
});

app.delete("/todos/all", async (req, res) => {
  try {
    const items = await fetchDBData({ isFinished: true });
    items
      .map((item) => item.key)
      .forEach(async (key) => {
        await db.delete(key);
      });
    await res.json({ success: true, message: "" });
  } catch (ex) {
    await res.json({ success: false, message: ex });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    await res.json({ success: false, message: "需要輸入 id" });
    return;
  }

  try {
    const result = await db.delete(id);
    await res.json({ success: true, message: result });
  } catch (ex) {
    await res.json({ success: false, message: ex });
  }
});

/* 開發使用 */
/* app.listen(3032, () => {
  console.log("server is running");
}); */

module.exports = app;
