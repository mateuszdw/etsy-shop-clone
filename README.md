sinatra-heroku-etsy-shop
========================

Copy in minutes your Etsy Shop (etsy.com) using Etsy Api on your custom domain.
Etsy Shop on custom domain is usefull, when you need better control over adwords campaign or other marketing actions.

This App use memcached only, no database needed.

Installation on Heroku (heroku.com)
========================
You must install RVM (Ruby Version Manager) https://rvm.io/rvm/install 
and Heroku Toolbelt - https://toolbelt.heroku.com/

Then type in console:
git clone https://github.com/magicmat/sinatra-heroku-etsy-shop.git
cd ./sinatra-heroku-etsy-shop
bundle install
heroku apps:create your-app-name
git init
git add .
git commit -m "init app"
git push heroku master

Go to your App url your-app-name.herokuapp.com

Bind your Custom Domain to Heroku - https://devcenter.heroku.com/articles/custom-domains


License
========================
This application is released under the MIT license.
