Meteor.startup(function(){
	Template.connectionBanner.events({
		'click #connection-try-reconnect': function(event, template){
			event.preventDefault();
			Meteor.reconnect();
		}
	});

	Template.connectionBanner.helpers({
		'wasConnected': function(event, template){
			return Session.equals('MeteorConnection-wasConnected', true);
		},
		'isDisconnected': function(event, template){
			return Session.equals('MeteorConnection-isConnected', false);
		},
		'retryTimeSeconds': function(event, template){
			return Session.get('MeteorConnection-retryTimeSeconds');
		},
		'failedReason': function(event, template){
			return Session.get('MeteorConnection-failedReason');
		},
		'connectionLostText': function(event, template){
			var defaultText = "Connection to Server Lost!";
			if(Meteor.settings && Meteor.settings.public && Meteor.settings.public.connectionBanner && Meteor.settings.public.connectionBanner.connectionLostText)
				return Meteor.settings.public.connectionBanner.connectionLostText;
			else
				return defaultText;
		},
		'tryReconnectText': function(event, template){
			var defaultText = "Click to try reconnecting now";
			if(Meteor.settings && Meteor.settings.public && Meteor.settings.public.connectionBanner && Meteor.settings.public.connectionBanner.tryReconnectText)
				return Meteor.settings.public.connectionBanner.tryReconnectText;
			else
				return defaultText;
		},
		'reconnectBeforeCountdownText': function(event, template){
			var defaultText = "Automatically attempting to reconnect in";
			if(Meteor.settings && Meteor.settings.public && Meteor.settings.public.connectionBanner && Meteor.settings.public.connectionBanner.reconnectBeforeCountdownText)
				return Meteor.settings.public.connectionBanner.reconnectBeforeCountdownText;
			else
				return defaultText;
		},
		'reconnectAfterCountdownText': function(event, template){
			var defaultText = "seconds.";
			if(Meteor.settings && Meteor.settings.public && Meteor.settings.public.connectionBanner && Meteor.settings.public.connectionBanner.reconnectAfterCountdownText)
				return Meteor.settings.public.connectionBanner.reconnectAfterCountdownText;
			else
				return defaultText;
		}
	});

	Session.setDefault('MeteorConnection-isConnected', true);
	Session.setDefault('MeteorConnection-wasConnected', false);
	Session.setDefault('MeteorConnection-retryTimeSeconds', 0);
	Session.setDefault('MeteorConnection-failedReason', null);
	var connectionRetryUpdateInterval;

	Deps.autorun(function(){
		var isConnected = Meteor.status().connected;
		if(isConnected){
			Session.set('MeteorConnection-wasConnected', true);
			Meteor.clearInterval(connectionRetryUpdateInterval);
			connectionRetryUpdateInterval = undefined;
			Session.set('MeteorConnection-retryTimeSeconds', 0);
			Session.set('MeteorConnection-failedReason', null);
		}else{
			if(Session.equals('MeteorConnection-wasConnected', true)){
				if(!connectionRetryUpdateInterval)
					connectionRetryUpdateInterval = Meteor.setInterval(function(){
						var retryIn = Math.round((Meteor.status().retryTime - (new Date()).getTime())/1000);
						if(isNaN(retryIn))
							retryIn = 0;
						Session.set('MeteorConnection-retryTimeSeconds', retryIn);
						Session.set('MeteorConnection-failedReason', Meteor.status().reason);
					},500);
			}
		}
		Session.set('MeteorConnection-isConnected', isConnected);
	});
});
	