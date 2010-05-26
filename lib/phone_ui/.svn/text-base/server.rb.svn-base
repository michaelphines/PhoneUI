require 'rubygems'
require 'sinatra/base'
require 'sinatra/async'
require 'thread'
require 'json'
require 'mq'
require 'net/http'
require 'phone_ui/key_value_store'

module PhoneUi
  class Server < Sinatra::Base
    register Sinatra::Async
    set :views, File.join(File.dirname(__FILE__), '..', '..', 'views')
    set :public, File.join(File.dirname(__FILE__), '..', '..', 'public')

    configure do
      @@settings = YAML.load_file('config.yml')["phoneui"]
    end
    
    helpers do
      def callbacks
        @@callbacks ||= KeyValueStore.new
      end
      def dialogs
        @@dialogs ||= KeyValueStore.new
      end
      def mq
        @@amq ||= MQ.new(AMQP.connect(@@settings["amqp_server"]))
      end
    end
    
    ###############################
    # CCXML/VoiceXML Callbacks
    ###############################
    aget '/control' do
      content_type "applicaton/ccxml+xml"
      body { erb :control }
    end

    aget '/:session_id/ivr' do |session_id|
      @options = dialogs[session_id] || {}
      content_type "applicaton/voicexml+xml"
      body { erb :ivr }
    end
    
    ###############################
    # CCXML/VoiceXML Callbacks
    ###############################
    apost '/connected' do
      p params
      session_id = params["session_id"]
      callback_uri = params["callback_uri"]
      callbacks[session_id] = callback_uri
      mq.topic("connected").publish(params.to_json, :routing_key => session_id)
      body params
    end
    
    apost '/disconnected' do
      p params
      session_id = params["session_id"]
      mq.topic("disconnected").publish(params.to_json, :routing_key => session_id)
      body params
    end
    
    apost '/:session_id/:dialog_id/responded' do |session_id, dialog_id|
      p params
      mq.topic("responded").publish(params.to_json, :routing_key => "#{session_id}.#{dialog_id}")
      body params
    end

    ###############################
    # REST API Callbacks
    ###############################
    
    aget '/:session_id/raise/:event' do |session_id, event|
      raise_event(session_id, event, params)
      body ""
    end
    
    aget '/:session_id/dialog' do |session_id|
      p params
      dialogs[session_id] = params
      body ""
    end

    aget '/:sessionid/dialog/:dialog_id/call' do |session_id, dialog_id|
      p params
      raise_event(session_id, "callDiag", :dialog_id => dialog_id)
      body ""
    end

    aget '/:sessionid/dialog/kill' do |session_id|
      raise_event(session_id, "killDiag")
      body ""
    end
    
    helpers do
      def raise_event(session_id, event, options={})
        uri = callbacks[session_id]
        if uri
          options["sessionid"] = session_id
          options["eventname"] = event
          response = Net::HTTP.post_form(URI.parse(uri), options)
          body({:response => response}.to_json)
        else
          body({:error => "not connected"}.to_json)
        end
      end
    end
  end
end