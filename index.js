const express = require('express');
const cors = require('cors');
const app = express();

const axios = require("axios");
const cheerio = require("cheerio");

const rakutenUrl = "https://search.rakuten.co.jp/search/mall/drone/";
const rakutenData = [];

const frequentData = require('./frequent.json'); // frequent.jsonファイルを読み込む

app.use(cors()); // CORSを有効にする
app.use(express.json()); // JSONデータを解析するために必要なミドルウェアを追加

app.get('/api/frequent', (req, res) => {
  res.json(frequentData.data); // frequentDataオブジェクトのdataプロパティを返す
});

app.post('/api/frequent', (req, res) => {
  const newData = req.body; // リクエストボディから新しいデータを取得
  frequentData.data.push(newData); // frequentDataオブジェクトのdataプロパティに新しいデータを追加
  res.json({ message: 'Data added successfully' }); // レスポンスとして追加が完了したことを通知する
});


//楽天スクレイピング
app.get('/api/rakuten', (req, res) => {
  axios(rakutenUrl).then((response) => {
    const htmlParser = response.data;
    const $ = cheerio.load(htmlParser);
    $(".searchresultitem", htmlParser).each(function () {
      const title = $(this).find(".title").text();
      const price = $(this).find(".price--OX_YW").text();
      const img = $(this).find("._verticallyaligned").attr("src");
      rakutenData.push({ title,price,img });
    })
  }).catch(error => console.log("error")); 
  res.json(rakutenData);
});

const port = 3000; // ポート番号を指定
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});