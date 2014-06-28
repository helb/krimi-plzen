Template.adminArticleList.helpers({
  hide_button_text: function(published){
    if(published != true){
      return "Zobrazit"
    }
    return "Schovat"
  }
})

Template.adminArticleList.events({
  'click button.hide': function (event) {
    event.preventDefault();
    article = event.currentTarget.parentNode.parentNode.dataset.article;
    if(event.currentTarget.classList.contains("true")){
      Articles.update({_id: article}, {$set: {is_published: false}});
    }else{
      Articles.update({_id: article}, {$set: {is_published: true}});
    }
  },
  'click button.remove': function (event) {
    event.preventDefault();
    article = event.currentTarget.parentNode.parentNode.dataset.article;
    Articles.remove({_id: article});
  },
  'click td.category': function (event) {
    article_id =  event.currentTarget.parentNode.dataset.article;
    current_category = Articles.findOne({_id: article_id}).category;
    if(current_category == null){
      Articles.update({_id: article_id}, {$set: {category: "z"}});
    }else if (current_category == "z"){
      Articles.update({_id: article_id}, {$set: {category: "o"}});
    } else {
      Articles.update({_id: article_id}, {$set: {category: null}});
    }
  },
})