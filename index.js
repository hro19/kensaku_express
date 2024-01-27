const express = require('express');

const app = express();
const cors = require("cors");
const frequentData = require('./frequent.json'); // frequent.jsonファイルを読み込む

app.use(
  cors({
    credentials: true,
    // origin: ["http://localhost:5173", "https://kensaku-xy2e.vercel.app"],
  })
);
app.use(express.json()); // JSONデータを解析するために必要なミドルウェアを追加

app.get('/api/frequent', (req, res) => {
    res.cookie("name1", "umekomucookiebyexpress", {maxAge: 60000});
  res.json(frequentData.data); // frequentDataオブジェクトのdataプロパティを返す
});

app.post('/api/frequent', (req, res) => {
  const newData = req.body; // リクエストボディから新しいデータを取得
  frequentData.data.push(newData); // frequentDataオブジェクトのdataプロパティに新しいデータを追加
  res.json({ message: 'Data added successfully' }); // レスポンスとして追加が完了したことを通知する
});


const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = 8000; // ポート番号を指定
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
