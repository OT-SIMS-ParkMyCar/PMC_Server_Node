var db = require('../models');

exports.list =  function(req, res) {
  db.Article.findAll().success(function (articles) {
    res.send({
      articles: articles
    });
  });
};
