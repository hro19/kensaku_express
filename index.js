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
app.get("/api/rakuten", (req, res) => {
  axios(rakutenUrl)
    .then((response) => {
      const htmlParser = response.data;
      const $ = cheerio.load(htmlParser);
      const rakutenData = {}; // データを一時的に格納するためのオブジェクトを使用

      $(".searchresultitem", htmlParser).each(function () {
        const title = $(this).find("._verticallyaligned").attr("alt");
        const priceText = $(this).find(".price--OX_YW").text();
        const price = parseInt(priceText.replace(/[^\d]/g, ""));
        const img = $(this).find("._verticallyaligned").attr("src");
        const url = $(this).find(".searchresultitem").attr("href");

        // もしrakutenDataに同じURLが存在しなければ、新しいデータとして追加する
        if (!rakutenData[url]) {
          rakutenData[url] = { title, price, img, url };
        }
      });

      // オブジェクトのキー（一意のURL）を配列に変換する
      const uniqueRakutenData = Object.values(rakutenData);

      res.json(uniqueRakutenData); // スクレイピング結果をレスポンスとして送信する
    })
    .catch((error) => console.log("error"));
});


const url = require('url');
const https = require('https');
const sizeOf = require('image-size');

app.get('/api/size', async (req, res) => {
  const imgUrls = [
    'https://gimon-sukkiri.jp/wp-content/uploads/2018/05/shutterstock_558269638-e1526514205779.jpg',
    'https://xn--n8jvdy13k5sk1s1d.net/wp/wp-content/uploads/2017/03/kawa.jpg',
    'https://www.worldfolksong.com/songbook/france/img/durance_river.jpg',
    'https://images.pexels.com/photos/4652275/pexels-photo-4652275.jpeg?auto=compress&cs=tinysrgb&h=350.jpg',
    "https://tcd-theme.com/wp-content/uploads/2019/04/retina-790x480.jpg",
    "https://liginc.co.jp/wp-content/uploads/2015/05/797.png",
    "https://japan.zdnet.com/storage/2022/05/25/6c37adbb10e2d44b26e6d71f585f8c34/imagen-text-to-image-ai-composites-2022-promo.jpg",
  ];

  const promises = imgUrls.map((imgUrl) => {
    return new Promise((resolve, reject) => {
      const options = url.parse(imgUrl);
      https.get(options, (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const { type, width, height } = sizeOf(buffer);
          resolve({ imgUrl, type, width, height });
        });
      }).on('error', (err) => reject(err));
    });
  });

  try {
    const results = await Promise.all(promises);
    res.json({ message: 'サイズページの情報を取得しました', corpses: results });
  } catch (error) {
    res.status(500).json({ message: 'サイズ情報の取得中にエラーが発生しました' });
  }
});


const port = 3000; // ポート番号を指定
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
