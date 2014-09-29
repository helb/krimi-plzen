Template.adminArticleList.helpers({
  hide_button_text: function(published){
    if(published != true){
      return "Zobrazit"
    }
    return "Schovat"
  }
})

Template.adminArticleList.events({
  'click button.hide-article': function (event) {
    event.preventDefault();
    article_id = event.currentTarget.parentNode.parentNode.dataset.article;
    if(event.currentTarget.classList.contains("true")){
      Articles.update({_id: article_id}, {$set: {is_published: false}});
    }else{
      Articles.update({_id: article_id}, {$set: {is_published: true}});
    }
  },
  'click button.remove': function (event) {
    event.preventDefault();
    article_id = event.currentTarget.parentNode.parentNode.dataset.article;
    var r = confirm("Opravdu smazat?");
    if (r == true) {
        Articles.remove({_id: article_id});
    }
  },
  'click td.category': function (event) {
    article_id =  event.currentTarget.parentNode.dataset.article;
    current_category = Articles.findOne({_id: article_id}).category;
    if(current_category == "o"){
      Articles.update({_id: article_id}, {$set: {category: "pravni-minimum-ulice"}});
    }else if (current_category == "z"){
      Articles.update({_id: article_id}, {$set: {category: "o"}});
    }else if (current_category == "pravni-minimum-ulice"){
      Articles.update({_id: article_id}, {$set: {category: 'zachranari'}});
    }else if (current_category == "zachranari"){
      Articles.update({_id: article_id}, {$set: {category: null}});
    } else {
      Articles.update({_id: article_id}, {$set: {category: "z"}});
    }
  },

  'click input.recommend': function (event) {
    article_id =  event.currentTarget.parentNode.parentNode.dataset.article;
    // console.log(!event.currentTarget.checked);
    Articles.update({_id: article_id}, {$set: {is_recommended: event.currentTarget.checked}});
  },
})
