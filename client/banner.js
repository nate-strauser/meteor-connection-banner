const isConnected = new ReactiveVar(true);
const wasConnected = new ReactiveVar(false);
const retryTimeSeconds = new ReactiveVar(0);
const failedReason = new ReactiveVar(null);

let connectionRetryUpdateInterval;

Meteor.startup(function () {
	Tracker.autorun(function () {
		const connectedStatus = Meteor.status().connected;

		if (connectedStatus) {
			wasConnected.set(true);
			Meteor.clearInterval(connectionRetryUpdateInterval);
			connectionRetryUpdateInterval = undefined;
			retryTimeSeconds.set(0);
			failedReason.set(null);
		} else if (wasConnected.get() && !connectionRetryUpdateInterval) {
			connectionRetryUpdateInterval = Meteor.setInterval(function () {
				let retryIn = Math.round((Meteor.status().retryTime - (new Date()).getTime())/1000);

				if (isNaN(retryIn))
					retryIn = 0;

				retryTimeSeconds.set(retryIn);
				failedReason.set(Meteor.status().reason);
			}, 500);
		}

		isConnected.set(connectedStatus);
	});
});

Template.connectionBanner.events({
	'click #connection-try-reconnect'(event) {
		event.preventDefault();
		Meteor.reconnect();
	}
});

const getSetting = function (key, defaultText) {
	if (checkObjHasKeys(Meteor, ['settings', 'public', 'connectionBanner', key]))
		return Meteor.settings.public.connectionBanner[key];

	return defaultText;
};

Template.connectionBanner.helpers({
	showBanner() {
		return wasConnected.get() && !isConnected.get() && Meteor.status().retryCount > 2;
	},
	retryTimeSeconds() {
		return retryTimeSeconds.get();
	},
	failedReason() {
		return failedReason.get();
	},
	connectionLostText() {
		return getSetting('connectionLostText', 'Connection to Server Lost!');
	},
	tryReconnectText() {
		return getSetting('tryReconnectText', 'Click to try reconnecting now');
	},
	reconnectBeforeCountdownText() {
		return getSetting('reconnectBeforeCountdownText', 'Automatically attempting to reconnect in');
	},
	reconnectAfterCountdownText() {
		return getSetting('reconnectAfterCountdownText', 'seconds.');
	},
	connectionLostTextIcon() {
		return getSetting('connectionLostTextIcon', 'fa fa-exclamation-triangle fa-lg');
	},
	tryReconnectTextIcon() {
		return getSetting('tryReconnectTextIcon', 'fa fa-refresh fa-lg');
	},
});
