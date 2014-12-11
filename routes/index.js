var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('http://localhost:3001/', function(req, res) {
  res.render('http://localhost:3001/', { title: 'Express' });
});

router.get("/crear_sala",function(req,res){
	res.render("crear_sala",{});
});

module.exports = router;
