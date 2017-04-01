var express = require('express');
var app = express();

let port = 3000;

app.set('views', './views');
app.set('view engine', 'jade');
app.use('/static', express.static('public'));
app.get('/', (req, res) => {
  res.render('player', { 
    videosrc: '/static/video.mp4',
    scripts: ['/static/app.js'],
    title: 'WECHECK'
  });
});
app.listen(port, () => {
  console.log(`Server running on localhost:${port}`);
});
