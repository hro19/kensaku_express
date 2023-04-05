const express = require('express');
const cors = require('cors');
const app = express();

const axios = require("axios");
const cheerio = require("cheerio");

const rakutenUrl = "https://search.rakuten.co.jp/search/mall/drone/";
let rakutenData = []; // constではなくletで宣言

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
      const priceText = $(this).find(".price--OX_YW").text();
      const price = parseInt(priceText.replace(/[^\d]/g, ''));
      const img = $(this).find("._verticallyaligned").attr("src");
      const url = $(this).find(".content a").attr("href");
      rakutenData.push({ title,price,img,url });
    });
    res.json(rakutenData); // スクレイピング結果をレスポンスとして送信する位置を修正
  }).catch(error => console.log("error")); 
});


const url = require('url')
const http = require('http')

const sizeOf = require('image-size')



app.get('/api/size', (req, res) => {
  const imgUrls = ['http://abehiroshi.la.coocan.jp/abe-top-20190328-2.jpg',
    "http://abehiroshi.la.coocan.jp/abe-top-20190328-2.jpg",
    "http://abehiroshi.la.coocan.jp/abe-top-20190328-2.jpg",
    "http://abehiroshi.la.coocan.jp/abe-top-20190328-2.jpg"
  ];
  const options = url.parse(imgUrl);
  const datas = { message: 'サイズページの情報を取得しました' };

  http.get(options, function (response) {
    const chunks = [];
    response.on('data', function (chunk) {
      chunks.push(chunk);
    }).on('end', function () {
      const buffer = Buffer.concat(chunks);
      const { type, width, height } = sizeOf(buffer);
      datas.corpse = { type, width, height };
      res.json(datas);
    });
  });
});


const port = 3000; // ポート番号を指定
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
