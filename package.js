Package.describe({
    summary: "A banner that displays when meteor server is disconnected with countdown and reconnect option",
    name: "natestrauser:connection-banner",
    version: "0.4.3",
    git: "https://github.com/nate-strauser/meteor-connection-banner.git"
});

Package.on_use(function (api) {
	api.versionsFrom("METEOR@0.9.0");
	api.use([
	    'deps',
	    'templating',
	    'session']
	  , 'client');

    api.add_files(['client/banner.css','client/banner.html','client/banner.js'], 'client');
});
