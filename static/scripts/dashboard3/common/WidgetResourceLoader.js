/*jslint browser: true*/
/*global window, document */

if (window.createWidgetResourceLoader === undefined)
{
    if (window.widgetResourceLoaderLock)
    {
        window.console.log("Widget Resource Loader is being loaded...");
    }
    else
    {
        window.widgetResourceLoaderLock = true;
        window.console.log("Widget Resource Loader lock is acquired.");
        window.createWidgetResourceLoader = function ()
        {

            'use strict';

            return {
                resourceLoaded: "",
                isLoaded: function ()
                {
                    return true;
                },
                checkResourceExist: function (url)
                {
                    if (this.resourceLoaded.indexOf(url) !== -1)
                    {
                        return false;
                    }
                },
                registerLoadedResource: function (url)
                {
                    this.resourceLoaded += "[" + url + "]";
                },

                loadJS: function (url, callback)
                {
                    var self = this,
                        scriptEl;
                    if (self.checkResourceExist(url))
                    {
                        window.console.log("Already loaded resource - " + url);
                        return;
                    }
                    scriptEl = document.createElement("script");
                    scriptEl.type = "text/javascript";

                    if (scriptEl.readyState)
                    { //IE
                        scriptEl.onreadystatechange = function ()
                        {
                            if (scriptEl.readyState === "loaded" || scriptEl.readyState === "complete")
                            {
                                scriptEl.onreadystatechange = null;
                                self.registerLoadedResource(url);
                                callback();
                            }
                        };
                    }
                    else
                    { //Others
                        scriptEl.onload = function ()
                        {
                            self.registerLoadedResource(url);
                            callback();
                        };
                    }

                    scriptEl.src = url;
                    document.getElementsByTagName("body")[0].appendChild(scriptEl);
                },
                loadCSS: function (url, callback)
                {
                    var self = this,
                        linkEl;
                    if (self.checkResourceExist(url))
                    {
                        window.console.log("Already loaded resource - " + url);
                        return;
                    }
                    linkEl = document.createElement("link");
                    linkEl.type = "text/css";
                    linkEl.rel = "stylesheet";

                    if (linkEl.readyState)
                    { //IE
                        linkEl.onreadystatechange = function ()
                        {
                            if (linkEl.readyState === "loaded" || linkEl.readyState === "complete")
                            {
                                linkEl.onreadystatechange = null;
                                self.registerLoadedResource(url);
                                callback();
                            }
                        };
                    }
                    else
                    { //Others
                        linkEl.onload = function ()
                        {
                            self.registerLoadedResource(url);
                            callback();
                        };
                    }

                    linkEl.href = url;
                    document.getElementsByTagName("head")[0].appendChild(linkEl);
                }
            };
        };
        var resourceLoaderInstance = window.createWidgetResourceLoader();
        var timerId = window.setInterval(function ()
        {
            'use strict';

            if (!resourceLoaderInstance.isLoaded())
            {
                return;
            }
            window.clearInterval(timerId);
            window.WidgetResourceLoader = resourceLoaderInstance;
        });
    }
}
