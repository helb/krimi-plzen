# Krimi Plzeň

Local news website. Live @ [krimi-plzen.cz](https://www.krimi-plzen.cz/).

> **This is version 2.x, rewritten from scratch**, based on Django/Python/PostgreSQL.

## Architecture

### Backend

- [Python](https://www.python.org/)
- [Django](https://www.djangoproject.com/)
- [Django Channels](http://channels.readthedocs.io/en/latest/)
- [Celery](http://www.celeryproject.org/)
- [Redis](http://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [nginx](https://nginx.org/)

### Frontend

- [Django templates](https://docs.djangoproject.com/en/1.9/topics/templates/)
- [Gulp](http://gulpjs.com/) (using [django-gulp](https://github.com/beaugunderson/django-gulp))
- [Babel](https://babeljs.io/)
- [Sass](http://sass-lang.com/)

[Sentry](https://getsentry.com) is used for error reporting both on back- and frontend.

## Setting up

### External dependencies

- Python 3
- pip
- Node.js and npm
- running Redis server
- running PostgreSQL server

### Cloning Git repository

Most recent source lives in `master` branch of this repository. So it's just:

```
$ git clone https://github.com/helb/krimi-plzen
$ cd krimi-plzen
```

### Creating virtualenv

This is not mandatory, but it's handy to create separate environment for each project, so you don't have to install (possibly conflicting) dependencies system-wide.

There are good tutorials for virtualenv [available](https://iamzed.com/2009/05/07/a-primer-on-virtualenv/) [online](http://docs.python-guide.org/en/latest/dev/virtualenvs/), but essentially it's just this:

```
$ virtualenv venv
$ source venv/bin/activate
```

### Installing project dependencies (python and js)

```
$ ./install.sh
$ cd krimiplzen
```

The install script just activates the virtualenv for itself and then installs dependencies from `requirements*.txt` (for Python) and `package.json` (for JS). You can do that by hand if you want to…

### Setting up database

```
$ createdb krimiplzen-dev
$ ./manage.py migrate
$ ./manage.py createsuperuser
```

Use `-p /path/to/python3` parameter for `virtualenv` if it's not the default implementation on your system.

## Running

### Development server

```
$ ./manage.py runserver
```

### Celery cron and workers

```
$ celery -A krimiplzen beat -l info
$ celery -A krimiplzen worker -l info
```

## Deploying

### Requirements

- Python 3
- running PostgreSQL
- running Redis
- nginx

### nginx configuration

## Old version

Original website was built with [Node.js](https://nodejs.org/)/[Meteor](https://www.meteor.com/)/[MongoDB](https://www.mongodb.com/). It was great for prototyping – most of the core functionality was created practically overnight – but once the site gained some traction (~50k+ visitors a day), the performance went to hell due to large websocket count (Meteor uses ws for _everything_).

> One does not cache websocket easily.

Another issue was rendering HTML server-side for search engines, Facebook previews etc. Meteor has handy [spiderable package](https://atmospherejs.com/meteor/spiderable) for rendering using PhantomJS. It's really easy to setup, but it didn't work all that well under some load (`spiderable: phantomjs failed`). So, for the new version, I wanted a solid HTML renderer. There is currently no server-side renderer for Blaze (Meteor's default view layer).

Moreover, MongoDB has some issues on it's own and plugging another DB backend to Meteor was kinda hard at the time (it got better now, with [Apollo  data stack](https://github.com/apollostack/apollo)).

In the last days of it's life (summer 2016), it was running on 4 servers in different locations (3-node MongoDB cluster, 7 app instances with nginx in front of them):

```
.                                              +------------+
                                          +----+ Meteor app |
        +------------+    +---------+     |    +------------+
        | CloudFlare |    | Flickr  |     |
        |   CDN      |    | photos  |     |    +------------+
        +----+-------+    +---------+     +----+ Meteor app |
             |            |               |    +------------+
             +            |               |                     +---------+
          HTTP----+-------+               |    +------------+   | MongoDB |
          |       |                       +----+ Meteor app |   +----+----+
          |       |   +-------------------+    +------------+       |
+---------+       +---+  nginx            |                         |
| browser |           |                   |    +------------+       |
+---------+           |  • load balancer  +----+ Meteor app |   +----+----+
          +----WS-----+  • static files   |    +------------+   | MongoDB |
                      +-------------------+                     +----+----+
                                          |    +------------+        |
                                          +----+ Meteor app |        |
                                          |    +------------+        |
                                          |                     +----+----+
                                          |    +------------+   | MongoDB |
                                          +----+ Meteor app |   +---------+
                                          |    +------------+
                                          |  
                                          |    +------------+
                                          +----+ Meteor app |
                                               +------------+
```
