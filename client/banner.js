var isConnected = new ReactiveVar(true);
var wasConnected = new ReactiveVar(false);
var retryTimeSeconds = new ReactiveVar(0);
var failedReason = new ReactiveVar(null);

Meteor.startup(function () {
	Deps.autorun(function () {
		var connectionRetryUpdateInterval;
		var connectedStatus = Meteor.status().connected;

		if (connectedStatus) {
			wasConnected.set(true);
			Meteor.clearInterval(connectionRetryUpdateInterval);
			connectionRetryUpdateInterval = undefined;
			retryTimeSeconds.set(0);
			failedReason.set(null);
		} else {
			if (wasConnected.get()){
				if (!connectionRetryUpdateInterval)
					connectionRetryUpdateInterval = Meteor.setInterval(function () {
						var retryIn = Math.round((Meteor.status().retryTime - (new Date()).getTime())/1000);
						if (isNaN(retryIn)) {
							retryIn = 0;
						}
						retryTimeSeconds.set(retryIn);
						failedReason.set(Meteor.status().reason);
					}, 500);
			}
		}
		isConnected.set(connectedStatus);
	});
});

Template.connectionBanner.events({
	'click #connection-try-reconnect': function (event, template) {
		event.preventDefault();
		Meteor.reconnect();
	}
});

var getSetting = function (key, defaultText) {
	if (checkObjHasKeys(Meteor, ['settings', 'public', 'connectionBanner', key])) {
		return Meteor.settings.public.connectionBanner[key];
	}
	else {
		return defaultText;
	}
};

Template.connectionBanner.helpers({
	showBanner: function () {
		return wasConnected.get() && !isConnected.get();
	},
	retryTimeSeconds: function () {
		return retryTimeSeconds.get();
	},
	failedReason: function () {
		return failedReason.get();
	},
	connectionLostText: function () {
		return getSetting('connectionLostText', 'Connection to Server Lost!');
	},
	tryReconnectText: function () {
		return getSetting('tryReconnectText', 'Click to try reconnecting now');
	},
	reconnectBeforeCountdownText: function () {
		return getSetting('reconnectBeforeCountdownText', 'Automatically attempting to reconnect in');
	},
	reconnectAfterCountdownText: function () {
		return getSetting('reconnectAfterCountdownText', 'seconds.');
	}
});