let request = require('request');
let cheerio = require('cheerio');

const getDay = (date) => {
  const dateSplitted = date.split(' - ');
  const d = dateSplitted.length > 0 ? dateSplitted[0].trim() : '';
  return d;
}

const getHour = (date) => {
  const dateSplitted = date.split(' - ');
  const h = dateSplitted.length > 0 ? dateSplitted[1].trim() : '';
  return h;
}

const printDay = (d) => {
  return console.log('[' + d + ']');
}

const formatTeamName = (teamStr = '') => {
  let teamName = teamStr + '             ';
  teamName = teamName.substr(0,13);
  return teamName;
}

request('https://esporte.uol.com.br/futebol/campeonatos/brasileirao/jogos/', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    let $ = cheerio.load(html);

    $('.confrontos-10').each(function(i, element) {

      let games = $(element).find('article');
      let datetime = $(games[0]).find('time').text();
      let currentDay = getDay(datetime);

      if(currentDay !== '') {
        console.log('\nMatchday ' + parseInt(i+1));
        printDay(currentDay);

        $(games).each(function(j, el) {
          let datetime = $(el).find('time').text();
          let homeTeam = $(el).find('.time1 abbr').attr('title');
          let awayTeam = $(el).find('.time2 abbr').attr('title');
          let local = $(el).find('.local').text();
          let day = getDay(datetime);
          let hour = getHour(datetime);

          if(currentDay !== day) {
            currentDay = day;
            printDay(currentDay);
          }

          console.log(formatTeamName(homeTeam) + '  -  ' + formatTeamName(awayTeam) + '  #  @ ' + local + ' ' + hour);
        });
      }
    });
  }
});
