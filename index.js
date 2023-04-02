const express = require('express');
const cors = require('cors');
const app = express();
const frequentData = require('./frequent.json'); // frequent.jsonファイルを読み込む

app.use(cors()); // CORSを有効にする
app.use(express.json()); // JSONデータを解析するために必要なミドルウェアを追加

app.get('/api/frequent', (req, res) => {
  res.json(frequentData.data); // frequentDataオブジェクトのdataプロパティを返す
});

app.post('/api/frequent', (req, res) => {
  const newData = req.body; // リクエストボディから新しいデータを取得
  const lastId = frequentData.data[frequentData.data.length - 1].id; // 最後尾のオブジェクトのIDを取得
  const newId = lastId + 1; // 新しいIDを生成
  newData.id = newId; // 新しいデータのIDプロパティに新しいIDを設定
  frequentData.data.push(newData); // frequentDataオブジェクトのdataプロパティに新しいデータを追加
  res.json({ message: 'Data added successfully', newId }); // レスポンスとして追加が完了したことと、新しいIDを返す
});

const port = 3000; // ポート番号を指定
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});