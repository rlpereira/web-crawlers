let request = require('request');
let cheerio = require('cheerio');

let championships = ['brasileirao', 'serieb'];
let urls = {
    'brasileirao': 'http://www.cbf.com.br/competicoes/brasileiro-serie-a/tabela/2017',
    'serieb': 'http://www.cbf.com.br/competicoes/brasileiro-serie-b/tabela/2017',
    'seriec': 'http://www.cbf.com.br/competicoes/brasileiro-serie-c/tabela/2017',
    'seried': 'http://www.cbf.com.br/competicoes/brasileiro-serie-d/tabela/2017'
}

const printResults = (url, round) => {
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html);
      let roundText = '';

      $('.carousel-inner').find('.item').each((i, r) => {
        roundText = $(r).find('h3').text().trim();

        if(i >= round) {
          return false;
        }

        console.log('\n' + roundText);
        $(r).children().each((j, row) => {
          var isGame = $(row).hasClass('row');
          var isDate = $(row).hasClass('headline');

          if(isDate) {
            var d = $(row).find('h4').text().trim();
            var weekDay = d.substr(0,3);
            var monthDay = d.split(' ')[1].trim();
            var month = d.split(' ')[3].trim();
            console.log('[' + weekDay + ', ' + monthDay + '/' + month + ']');
          }

          if(isGame) {
            var homeTeam = $(row).find('.game-team-1 span').text().split(' - ')[0].trim().concat('                         ').substr(0, 25);
            var awayTeam = $(row).find('.game-team-2 span').text().split(' - ')[0].trim();
            var score = $(row).find('.game-score').find('span');
            score = score.text().replace(/(\r\n|\n|\r| )/gm,"").replace('X', ' - ');
            console.log(homeTeam + ' ' + score + '   ' + awayTeam);
          }
        })

        // console.log('\n');
      })
    }
  });
}

let championship = process.argv.length > 2 ? process.argv[3] : 'brasileirao';
let round = process.argv.length > 4 ? process.argv[5] : 38;

printResults(urls[championship], round);
