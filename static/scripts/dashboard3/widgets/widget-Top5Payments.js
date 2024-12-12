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
        scriptEl.src = (window.WidgetBaseUrlMap["widget-Top5Payments"] || window.widgetBaseUrl) + "static/scripts/dashboard3/common/WidgetLauncher.js";
        document.getElementsByTagName("body")[0].appendChild(scriptEl);
    };
}

if (window.Top5PaymentsWidget === undefined)
{
    window.Top5PaymentsWidget = function (widgetId, config)
    {
        'use strict';

        var outEvents = [],
            inEvents = [],
            render = function (self, data)
            {
				$(document).ready(function() {
					config.sortMethod = "none";
					var widgetEmbeder = window.createWidgetEmbeder('top5Payments', 'top5Payments', self.parentElId, config);
				});
            },
            dependencies = [],
            Top5PaymentsWidget = new Widget(
                widgetId,
                'Top5Payments',
                config,
                render,
                dependencies,
                outEvents,
                inEvents
            );

        return Top5PaymentsWidget;
    };
}

window.ensureWidgetLauncherLoaded(function ()
{
    'use strict';

    window.WidgetLauncher.registerWidget('widget-Top5Payments', window.Top5PaymentsWidget);
});
