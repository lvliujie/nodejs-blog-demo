var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//all可以作为前期中间件，过滤器的作用，为一些路由接受参数提前做好统一校验，再通过next继续走到下一步路由
router.all('/:username', function(req, res, next) {
  console.log('all methods captured');
  next();
});

router.get('/:username', function(req, res, next) {
  res.send('get user:'+req.params.username);
});

module.exports = router;
