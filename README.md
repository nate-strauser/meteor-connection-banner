meteor-connection-banner
========================

A banner that displays when meteor server is disconnected with countdown and reconnect option.


## Usage

`{{>connectionBanner}}`  (best located right after the opening body tag)

-----

This package will look best with supporting packages `font-awesome` and `bootstrap-3`

![With font-awesome and bootstrap 3](images/with-fa-bs.png "With font-awesome and bootstrap 3")

Without either or both of these packages, it is still quite useful, but unstyled and plain

![Without font-awesome and bootstrap 3](images/without-fa-bs.png "Without font-awesome and bootstrap 3")

Element IDs can be used to directly style the banner if needed `#connection-lost-banner` and `#connection-try-reconnect`

----

####Using with a Bootstrap Fixed Top Navbar

If you have a fixed navbar at the top of the page, the connectionBanner will render invisibly behind it. You can use the following CSS to move the navbar down if the banner is rendered (or appear below the navbar).
```
#connection-lost-banner + div.navbar-fixed-top,
#connection-try-reconnect + div.navbar-fixed-top {
    top: 41px;
}
div.navbar-fixed-top + #connection-lost-banner,
div.navbar-fixed-top + #connection-try-reconnect {
    top: 51px;
}
```
And insert the template either directly before or after the navbar div, e.g.:
```
{{>connectionBanner}}
<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
  ...
</div>
```


-----

## Version History

###v0.2
* Adjustments to be blaze compatible
* Renamed some element IDs
```
#meteor-connection-lost-banner -> #connection-lost-banner
#meteor-connection-try-reconnect -> #connection-try-reconnect
```
* Renamed base template
```
meteorConnectionBanner -> connectionBanner
```
* Removed handlebars helper in favor of sub template include
```
{{meteorConnectionBanner}} -> {{>connectionBanner}}
```

###v0.1
* Initial Release
