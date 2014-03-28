require 'rubygems'
require 'digest/sha1'
require 'dalli'
require 'sinatra/base'
require 'etsy'
require 'sinatra/assetpack'
require 'sinatra/partial'

Etsy.api_key = 'your etsy api key'
Etsy.api_secret = 'your etsy api secret'
Etsy.environment = :production

module Sinatra
  module MemCached
    module Helpers
      def cached(cache_key)
        if result = settings.cache.get(cache_key)
          return result
        else
          result = yield
          settings.cache.set(cache_key, result,  60*120)

          return result
        end
      end      
    end

    # register sinatra memcached helper
    def self.registered(app)
      app.helpers MemCached::Helpers

      if app.settings.development?
        # connects to locahost on development
        app.set :cache, Dalli::Client.new

      elsif app.settings.production?
        # user memcachier variables on heroku production
        app.set :cache,
          Dalli::Client.new(ENV["MEMCACHIER_SERVERS"].split(","),
            {:username => ENV["MEMCACHIER_USERNAME"],
             :password => ENV["MEMCACHIER_PASSWORD"]
            })
      end

      # flush memcached when app start
      app.settings.cache.flush
    end
  end
  register MemCached
end


class App < Sinatra::Base
  register Sinatra::Partial
  register Sinatra::AssetPack
  register Sinatra::MemCached

  set :root, File.dirname(__FILE__)

  set :raise_errors, false
  set :show_exceptions, false
  set :partial_template_engine, :erb
  
  enable :logging

  assets do
    js_compression  :yui, :munge => true
    css_compression  :yui

    js :app, [
      '/js/init/*.js',
      '/js/*.js'
    ]
    css :app, [
      '/css/init/*.css',
      '/css/*.css'
    ]

    prebuild false

  end

  helpers do
    # clean urls
    def to_param(string, sep = '-')
      # turn unwanted chars into the separator
      string = string.gsub(/[^a-z0-9\-_]+/i, sep)
      unless sep.nil? || sep.empty?
        re_sep = Regexp.escape(sep)
        # no more than one of the separator in a row
        string = string.gsub(/#{re_sep}{2,}/, sep)
        # remove leading/trailing separator.
        string = string.gsub(/^#{re_sep}|#{re_sep}$/i, '')
      end
      string = string.downcase
    end
  end

  before do
    path = request.path_info.split('/')[1]
    pass unless path.nil? || %w[product isalive].include?(path) # do before url / and /product

    # cache shop request
    @shop = cached('user'+request.path_info) do
      Etsy::Shop.find('annadw')
    end

    # cache shop sections request
    @sections = cached('sections'+request.path_info) do
      Etsy::Section.find_by_shop(@shop).select {|section| section.active_listing_count != 0 }
    end
  end

  get '/' do
    @header_fixed = true
    
    cached("sections_listings") do
      erb :index
    end
  end

  get '/product/:product_id' do
    product_id = params['product_id'].to_i
    @header_fixed = false

    # cache whole view
    cached("product"+product_id.to_s) do
      @listing = Etsy::Listing.find(product_id,:includes=>['ShippingInfo:limit:100'])
      @section_listings = Etsy::Listing.find_all_by_section(@shop.id,@listing.result['shop_section_id'].to_i,:state=>:active,:limit => 6,:includes=>['Images'])
      @shippings = @listing.shippings.select do |si|
          si if si.region_id.nil? || si.destination_country_id.nil?
      end.reverse

      erb :products
    end
  end

  # receive requests to keep-alive free heroku dyno
  get '/isalive' do
    cache_control :public, :max_age => 30    
    @header_fixed = true

    # cache index page
    cached = cached("sections_listings") do
      erb :index
    end

    "SHA1:#{Digest::SHA1.hexdigest(cached)} Random:#{Random.rand(9999)}"
  end

end

# exted etsy gem modules
module Etsy
  class BasicClient
    def get(endpoint)
      puts "Etsy Request: #{endpoint}"
      client.get(endpoint)      
    end
  end

  class Listing
    association :shipping, :from => 'ShippingInfo'

    def shippings
      if associated_shipping
        @shippings ||= associated_shipping.map {|assoc_results| ShippingInfo.new(assoc_results) }
      else
        @shippings ||= ShippingInfo.find_by_listing_id(id)
      end
    end

    def images
      if associated_image
        @images ||= associated_image.map {|assoc_results| Image.new(assoc_results) }
      else
        @images ||= Image.find_all_by_listing_id(id)
      end  
    end

    def self.find_all_by_section(shop_id,section_id, options = {})
      active = options[:state] == :active ? "/active" : ""
      get_all("/shops/#{shop_id}/sections/#{section_id}/listings#{active}", options)
    end    
  end

  class ShippingInfo
    include Etsy::Model

    attribute :id, :from => :shipping_info_id
    attributes :region_id, :currency_code, :primary_cost, :secondary_cost,
      :destination_country_id, :destination_country_name, :origin_country_name

    def self.find_by_listing_id(listing_id, options = {})
      get_all("/listings/#{listing_id}/shipping/info", options)
    end
  end
end