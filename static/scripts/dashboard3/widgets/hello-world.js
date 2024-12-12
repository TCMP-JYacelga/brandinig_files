/*jslint browser: true*/
/*global window, document, Widget, $ */

if (window.ensureWidgetLauncherLoaded === undefined)
{
    window.afterWidgetLauncherScriptIsLoaded = function (callback)
    {
        'use strict';

        if (window.WidgetLauncher)
        {
            window.console.log('WidgetLauncher instance is loaded without waiting');
            callback();
            return;
        }
        var timerId = window.setInterval(function ()
        {
            if (window.WidgetLauncher === undefined)
            {
                window.console.log('WidgetLauncher instance creation is in-progress');
                return;
            }
            window.clearInterval(timerId);
            window.console.log('WidgetLauncher instance is loaded');
            callback();
        }, 50);
    };

    window.ensureWidgetLauncherLoaded = function (callback)
    {
        'use strict';

        if (window.WidgetLauncher)
        {
            window.console.log('WidgetLauncher instance is already loaded');
            callback();
            return;
        }
        var scriptEl = document.createElement("script");
        scriptEl.type = "text/javascript";

        if (scriptEl.readyState)
        { //IE
            scriptEl.onreadystatechange = function ()
            {
                if (scriptEl.readyState === "loaded" || scriptEl.readyState === "complete")
                {
                    scriptEl.onreadystatechange = null;
                    window.afterWidgetLauncherScriptIsLoaded(callback);
                }
            };
        }
        else
        { //Others
            scriptEl.onload = function ()
            {
                window.afterWidgetLauncherScriptIsLoaded(callback);
            };
        }

        window.console.log('WidgetLauncher script is being loaded');
        scriptEl.src = window.widgetBaseUrl + "static/scripts/dashboard3/common/WidgetLauncher.js";
        document.getElementsByTagName("body")[0].appendChild(scriptEl);
    };
}

if (window.HelloWorldWidget === undefined)
{
    window.HelloWorldWidget = function (id, config)
    {
        'use strict';

        var outEvents = [],
            inEvents = [],
            render = function (self, data)
            {
                if (!data)
                {
                    // to please ESLint
                    // DO NOTHING
                    window.console.log('INFO: No data provided');
                }
                var content = '<div class="card bg-info text-white">' +
                    '  <div class="card-body">Hello World!<br>' + (!config.data ? '' : config.data) + '</div>' +
                    '</div>';
                $(self.parent).html(content);
            },
            dependencies = [
            ],
            helloWorldWidget = new Widget(
                id,
                'HelloWorld',
                config,
                render,
                dependencies,
                outEvents,
                inEvents
            );

        return helloWorldWidget;
    };
}

window.ensureWidgetLauncherLoaded(function ()
{
    'use strict';

    window.WidgetLauncher.registerWidget('hello-world', window.HelloWorldWidget);
});
