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

if (window.PaymentsGridWidget === undefined)
{
    window.PaymentsGridWidget = function (id, config)
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
                var table = '<table id="tbl' + id + '" class="display" style="width:100%">' +
                    '<thead><tr><th>Name</th><th>Position</th><th>Office</th><th>Extn.</th><th>Start date</th><th>Salary</th></tr></thead><tfoot><tr><th>Name</th>' +
                    '<th>Position</th><th>Office</th><th>Extn.</th>' +
                    '<th>Start date</th><th>Salary</th></tr></tfoot></table>';

                $(self.parent).html(table);
                $('#tbl' + id).DataTable(
                {
                    // TODO: pass SSO token
                    "ajax": {
                    	url: window.rootUrl + 'services/getCustomPaymentRecords?SEC_TKN=' + config.ssoToken,
				        xhrFields: {
				            withCredentials: true
				        }
                    },
                    "dataSrc": 'records',
                    "columns": [
                    	{"data": "name"},
                    	{"data": "designation"},
                    	{"data": "location"},
                    	{"data": "account"},
                    	{"data": "date"},
                    	{"data": "amount"}
                    ]
                });
            },
            dependencies = [
            	new Datatables()
            ],
            paymentsGridWidget = new Widget(
                id,
                'PaymentsGrid',
                config,
                render,
                dependencies,
                outEvents,
                inEvents
            );

        return paymentsGridWidget;
    };
}

window.ensureWidgetLauncherLoaded(function ()
{
    'use strict';

    window.WidgetLauncher.registerWidget('payments-grid', window.PaymentsGridWidget);
});
