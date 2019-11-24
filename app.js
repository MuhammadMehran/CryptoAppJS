const express = require('express');
const axios = require('axios');
const hbs = require('express-handlebars');
const app = express();
const port = 3000;
app.use(express.urlencoded())

app.engine( 'hbs', hbs( {
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/pages/',
    partialsDir: __dirname + '/views/partials/'
  }));
app.set('view engine', 'hbs');

app.set('views',__dirname + '/views');

app.get('/', (req, res) => {
    let prices_endpoint = "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,XRP,BCH,EOS,LTC,XLM,XDA,USDT,MIOTA,TRX&tsyms=USD"
    let news_endpoint = "https://min-api.cryptocompare.com/data/v2/news/?lang=EN"
    const request_prices = axios.get(prices_endpoint);
    const request_news = axios.get(news_endpoint);
    axios.all([request_prices, request_news]).then(axios.spread((...responses) => {
        const response_prices = responses[0]
        const response_news = responses[1]
        console.log(response_news)
        res.render('home', {layout: 'default', template: 'home-template', response_prices: response_prices.data, response_news: response_news.data, title: 'Home'});
      })).catch(errors => {
        console.log(errors)
        res.status(500).json('Sever Error');
      });
    
});

app.get('/prices',(req, res) =>{
    res.render('prices_get', {layout: 'default', template: 'home-template', title: 'Prices'});
});

app.post('/prices',(req, res) =>{
    console.log(req.body)
    axios.get('https://min-api.cryptocompare.com/data/pricemultifull?fsyms='+req.body.qoute.replace(' ', '').toUpperCase()+'&tsyms=USD')
    .then(function (response) {
        console.log(response.data)
        res.render('prices', {layout: 'default', template: 'home-template', title: 'Prices', crypto: response.data});
    })
    .catch(function (error) {
        res.status(500).json('Sever Error');
        console.log(error);
    })
    
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))