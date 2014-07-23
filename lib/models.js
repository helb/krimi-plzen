Articles = new Meteor.Collection("articles", {
  schema: new SimpleSchema({
    title: {
      type: String,
      label: "Název",
      max: 120,
      optional:  false
    },
    author_id: {
      type:  String,
      label: "Autor"
    },
    timestamp: {
      type: Date,
      label: "Čas vytvoření",
      optional:  false
    },
    slug:  {
      type:  String,
      max: 120,
      optional:  false
    },
    category:  {
      type:  String,
      max: 2,
      optional:  true
    },
    intro:  {
      type:  String,
      optional:  false
    },
    text: {
      type: String,
      optional:  false
    },
    is_published:  {
      type:  Boolean
    },
    is_recommended:  {
      type:  Boolean
    },
    photo_url:  {
      type:  String,
      optional:  true
    },
    photoset:  {
      type:  String,
      optional:  true
    },
    author_name:  {
      type:  String,
      optional:  true
    },
    photoset_placement:  {
      type: Number,
      optional:  true
    },
    youtube_url:  {
      type:  String,
      optional:  true
    },
  })
});

Articles.helpers({
  author_name: function () {
    if(this.author_name == null){
      return this.author_name;
    } else {
      return "Miki";
    }
  },
  time: function () {
    return this.timestamp.getHours() + ":" + (this.timestamp.getMinutes() < 10 ? '0' : '') + this.timestamp.getMinutes();
  },
  date: function () {
    day = this.timestamp.getDate();
    month = this.timestamp.getMonth() + 1;
    year = this.timestamp.getFullYear();
    return day + ". " + month + ". " + year;
  },
  day_name:   function () {
    var weekday = new Array(7);
    weekday[0] = "neděle";
    weekday[1] = "pondělí";
    weekday[2] = "úterý";
    weekday[3] = "středa";
    weekday[4] = "čtvrtek";
    weekday[5] = "pátek";
    weekday[6] = "sobota";
    return weekday[this.timestamp.getDay()];
  },
  category_name: function () {
    switch (this.category) {
    case "o":
      return "Pátrání po osobách";
    case "z":
      return "Zbraně";
    default:
      return null;
    }
  }
});

Articles.allow({
  insert: function (userId, doc) {
    return !!userId;
  },
  update: function (userId, doc, fields, modifier) {
    return !!userId;
  },
  remove: function (userId, doc) {
    return !!userId;
  }
});