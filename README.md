Etsy Shop Clone
========================

This App copy your existing Etsy (etsy.com) shop in minutes using Etsy Api. 
Etsy shop on custom domain is usefull, when you need better control over adwords campaign or other marketing actions.

This App use memcached only, no database needed.

Installation on Heroku (heroku.com)
========================
You must install RVM (Ruby Version Manager) https://rvm.io/rvm/install, 
Heroku Toolbelt - https://toolbelt.heroku.com/ and GIT

    $ git clone https://github.com/mateuszdw/etsy-clone-open-source.git
    $ cd ./etsy-clone-open-source
    $ bundle install
    $ git init
    $ git add .
    $ git commit -m "init app"
    $ heroku apps:create your-app-name
    $ git push heroku master

Etsy Clone Shop use Memcachier Heroku Addon:

    $ heroku addons:add memcachier:dev

If something goes wrong with Memcachier Addon read more on https://devcenter.heroku.com/

Configure
========================
1) go to https://www.etsy.com/developers/register and follow by instruction to register your Etsy Shop Clone and obtain Etsy api keys.

2) then go to app.rb file and use your keys
 
    Etsy.api_key = 'your etsy api key'
    Etsy.api_secret = 'your etsy api secret'

3) go to your App url your-app-name.herokuapp.com

Bind your Custom Domain to Heroku - https://devcenter.heroku.com/articles/custom-domains


License
========================
The MIT License - Copyright (c) 2015 Mateusz Dw
