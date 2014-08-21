Accounts.config({loginExpirationInDays: null, forbidClientAccountCreation: true});

Meteor.methods({
articleExists: function(slug) {
  article = Articles.findOne({'slug': slug});
  if(typeof article == 'undefined'){
    return false;
  } else {
    return true;
  }
}
});