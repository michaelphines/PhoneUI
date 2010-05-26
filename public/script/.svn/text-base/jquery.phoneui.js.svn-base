/**
 * phoneUI
 * Copyright (c) 2010 Michael Hines - mike@michaelphines.net
 *
 * @projectDescription Connect to a PhoneUI server and accept messages.
 *
 * @author Michael Hines
 * @version 1.0.0
 */
(function($) {
	phoneUI = {
		defaults: {
	    swfDir: "/swf/",
			mqServer: {
				host: document.location.hostname
			},
			restServer: document.location.host
	  },
		
		initialize: function(options) {
		  settings = jQuery.extend({
		    swfDir: "/swf/",
				mqServer: {
					host: document.location.hostname
				},
				restServer: document.location.host
		  }, options);
		
			$(function() {
				$("body").append($("<div id='AMQPProxy'>"))
		    swfobject.embedSWF(
		        settings.swfDir + "amqp-debug.swf",
		        "AMQPProxy",
		        "0",
		        "0",
		        "9",
		        settings.swfDir + "expressInstall.swf",
		        {},
		        {
		            allowScriptAccess: "always",
		            wmode: "transparent"
		        },
		        {}
		    );
			});

	    MQ.configure({
	        host: settings.mqServer.host
	    });
		},
	
		serverConnected: function(callback) {
			MQ.on("connect", function() {
	      callback();
	    });
		},
	
		serverDisconnected: function(callback) {
			MQ.on("disconnect", function() {
	      callback();
	    });
		},

		clientLoaded: function(callback) {
			MQ.on("load", function() {
	      callback();
	    });		
		},
	
		connected: function(callback) {
			MQ.queue("auto").bind("connected", "#").callback(function(message) {
				callback(message);
			});
		},
	
		disconnected: function(callback) {
			MQ.queue("auto").bind("disconnected", "#").callback(function(message) {
				callback(message);
			});
		},
	
		responded: function(callback) {
			MQ.queue("auto").bind("responded", "*.*").callback(function(message) {
				callback(message);
			});
		},

		//mode, continuous, prompt, noinput, nomatch, noreprompt, reply, grammar
		dialog: function(session_id, options) {
			dialog_id++;
			grammar = []
			jQuery.each(options.grammar, function(utterance, callback){
				MQ.queue("dialog."+dialog_id+"."+utterance).bind("responded", session_id + "." + dialog_id).callback(function(message) {
					if (message.data.field == utterance) {
						callback(message);
					}
				});
				grammar.push(utterance);
			});
			options.grammar = grammar;
			//Post and call the dialog
			jQuery.get("http://"+settings.restServer+"/"+session_id+"/dialog", options, function() {
				jQuery.get("http://"+settings.restServer+"/"+session_id+"/dialog/"+dialog_id+"/call")
			});
		},
		
		reloadDialog: function(session_id) {
			jQuery.get("http://"+settings.restServer+"/"+session_id+"/dialog/"+dialog_id+"/call")
		},
		
		killDialog: function(session_id) {
			jQuery.get("http://"+settings.restServer+"/"+session_id+"/dialog/kill")
		}
	}
	var settings = phoneUI.defaults;
	var dialog_id = 0;
})(jQuery)