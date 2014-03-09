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
			Session.set('MeteorConnection-retryTimeSeconds', 0);
			Session.set('MeteorConnection-failedReason', null);
		}else{
			if(Session.equals('MeteorConnection-wasConnected', true)){
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
	