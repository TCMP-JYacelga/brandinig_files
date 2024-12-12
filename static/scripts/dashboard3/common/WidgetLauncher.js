/*jslint browser: true*/
/*global window, document */
if (window.ensureWidgetResourceLoaded === undefined) {
    window.afterWidgetResourceScriptIsLoaded = function (callback) {
        'use strict';

        if (window.WidgetResourceLoader) {
            window.console.log('WidgetResourceLoader instance is loaded without waiting');
            callback();
            return;
        }
        var timerId = window.setInterval(function () {
            if (window.WidgetResourceLoader === undefined) {
                window.console.log('WidgetResourceLoader instance creation is in-progress');
                return;
            }
            window.clearInterval(timerId);
            window.console.log('WidgetResourceLoader instance is loaded');
            callback();
        }, 50);
    };

    window.ensureWidgetResourceLoaded = function (callback) {
        'use strict';

        if (window.WidgetResourceLoader) {
            window.console.log('WidgetResourceLoader instance is already loaded');
            callback();
            return;
        }
        var scriptEl = document.createElement("script");
        scriptEl.type = "text/javascript";

        if (scriptEl.readyState) { //IE
            scriptEl.onreadystatechange = function () {
                if (scriptEl.readyState === "loaded" || scriptEl.readyState === "complete") {
                    scriptEl.onreadystatechange = null;
                    window.console.log('WidgetResourceLoader script is loaded in IE');
                    window.afterWidgetResourceScriptIsLoaded(callback);
                }
            };
        } else { //Others
            scriptEl.onload = function () {
                window.console.log('WidgetResourceLoader script is loaded in non-IE');
                window.afterWidgetResourceScriptIsLoaded(callback);
            };
        }

        window.console.log('WidgetResourceLoader script is being loaded');
        var baseUrl = window.widgetBaseUrl;
        if (window.WidgetBaseUrlMap && window.WidgetBaseUrlMap.widgetBaseUrl)
        {
        	baseUrl = window.WidgetBaseUrlMap.widgetBaseUrl;
        }
        scriptEl.src = baseUrl + "static/scripts/dashboard3/common/WidgetResourceLoader.js";
        document.getElementsByTagName("body")[0].appendChild(scriptEl);
    };
}

// Ensure to invoke callback after WidgetResourceLoader script is loadded correctly
window.ensureWidgetResourceLoaded(function () {
    'use strict';

    if (window.WidgetLauncherLoadingLock) {
        window.console.log("Widget launcher loading lock found and hence skipping loading of WidgetLauncher");
        return;
    }
    window.WidgetLauncherLoadingLock = true;
    if (window.createLauncherV1_1 === undefined) {
        var baseUrl = window.widgetBaseUrl;
        if (window.WidgetBaseUrlMap && window.WidgetBaseUrlMap.widgetBaseUrl)
        {
        	baseUrl = window.WidgetBaseUrlMap.widgetBaseUrl;
        }
    	
        window.createLauncherV1_1 = function () {

            var launcher = {
                version: "1.1",
                baseUrl: baseUrl,
                registry: {},
                css: [
                    "static/styles/uxp-themes/font/font.css",
                    "static/plugins/material-icons/css/material-icons.css",
                    "static/plugins/material-icons-outlined/css/material-icons-outlined.css",
                    "static/plugins/currency-flag/currency-flags.css",
                    "static/plugins/bootstrap-material/css/bootstrap-material-design.min.css",
                    "static/plugins/datatable/DataTables-1.10.20/css/dataTables.bootstrap4.min.css",
                    "static/plugins/datatable/Responsive-2.2.3/css/responsive.bootstrap4.min.css",
                    "static/plugins/datepicker/css/datepicker.css",
                    "static/plugins/select2/css/select2.min.css",
                    "static/plugins/select2/css/select2-bootstrap4.min.css",
                    "https://cdn.datatables.net/rowgroup/1.1.2/css/rowGroup.dataTables.min.css",
                    //"static/plugins/bootstrap-4.5.0/css/bootstrap.min.css",
                    //"static/plugins/fontawesome/4.7.0/css/font-awesome.min.css",
                    //"static/plugins/datatable/DataTables-1.10.20/css/jquery.dataTables.min.css",
                    "static/styles/uxp-themes/theme.css",
                    "static/styles/uxp-themes/toast.css",
                    "static/fcm-uxp/libs/components.css",
                    "static/scripts/dashboard3/common/embed.css"
                ],
                bootstrapJs: [
                    "static/plugins/jquery/3.4.1/jquery-3.4.1.min.js"
                ],
                common2Js: [
                    "static/plugins/datatable/DataTables-1.10.20/js/jquery.dataTables.min.js",
                    "static/scripts/dashboard3/common/uxp-labels.js"
                ],
                commonJs: [
                    "static/scripts/dashboard3/common/embed-common.js",
                ],
                js: [
                    "static/plugins/jquery-timeago-1.4.1/jquery.timeago.js",
                    "static/plugins/jquery-ui/1.12.1/jquery-ui.js",
                    "static/plugins/jquery/3.4.1/popper.min.js",
                    "static/plugins/bootstrap-4.5.0/js/bootstrap.min.js",
                    //"static/plugins/bootstrap-material/js/bootstrap-material-design.min.js",
                    "static/js/jquery/autoNumeric-min.js",
                    "static/plugins/d3/v5/d3.min.js",
                    "static/scripts/dashboard3/eventbus.js",
                    "static/scripts/dashboard3/alert.js", // do we need this? NO
                    "static/fcm-uxp/libs/components/widgets/js/containers/widgetContainer.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/containerAction.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/chartToggleAction.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/exportAction.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/refreshAction.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/topLabelAction.js", // do we need this ?
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/filterAction.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/removeAction.js", // do we need this ?
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/editTitleAction.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/printAction.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/summaryAction.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/viewOptionsAction.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/columnChooserAction.js",
					"static/fcm-uxp/libs/components/addwidget/addWidget.js", // do we need this ? NO
					"static/fcm-uxp/libs/components/widgets/js/widgets/widget.js",
					"static/fcm-uxp/libs/components/widgets/js/widgets/cardWidget.js",
					"static/fcm-uxp/libs/components/widgets/js/widgets/chartWidget.js",
					"static/fcm-uxp/libs/components/widgets/js/widgets/datatableWidget.js",
					"static/fcm-uxp/libs/components/widgets/js/widgets/customWidget.js",
					"static/fcm-uxp/libs/components/widgets/js/widgets/widgetFactory.js",
					"static/fcm-uxp/libs/components/widgets/js/containers/actions/customAction.js",
					"static/scripts/dashboard3/widgetMetaData.js",
					//"static/scripts/dashboard3/dashboard.js", // we need to adapt this to support single widget in given container element
					"static/scripts/dashboard3/embed.js", // adaptation of dashboard.js file 
                    "static/fcm-uxp/libs/components/widgets/js/containers/widgetGroupContainer.js",
                    "static/fcm-uxp/libs/components/widgets/js/widgets/utils/datarender.js",
                    "static/fcm-uxp/libs/components/widgets/js/widgets/utils/actionButtonRenderer.js",
                    "static/scripts/dashboard3/payments/PaymentHelper.js", // do we need this ?
                    "static/scripts/dashboard3/btr/BTRBalancesHelper.js",
                    "static/scripts/dashboard3/payments/PaymentCutOffHelper.js", // do we need this ?
                    "static/scripts/dashboard3/payments/PaymentColumnModel.js", // do we need this ?
                    "static/scripts/dashboard3/payments/PaymentRealtime.js", // do we need this ?
                    "static/scripts/dashboard3/common/DatatableWithStaticData.js",
                    "static/scripts/dashboard3/common/CommonUtility.js",
                    "static/scripts/dashboard3/widgets/VAMUtils.js",
                    "static/scripts/dashboard3/BTRUtils.js",
                    "static/scripts/dashboard3/widgets/Top5Payments.js",
                    "static/scripts/dashboard3/widgets/BTRAccountType.js",
                    
                    "static/plugins/datatable/DataTables-1.10.20/js/dataTables.bootstrap4.min.js",
                    "static/plugins/datatable/Responsive-2.2.3/js/dataTables.responsive.min.js",
                    "static/plugins/datatable/Responsive-2.2.3/js/responsive.bootstrap4.min.js",
                    "static/plugins/datatable/RowGroup-1.1.1/js/dataTables.rowGroup.min.js",
                    "static/plugins/plotly/js/plotly-latest.min.js",
                    "static/plugins/select2/js/select2.full.js",
                    "static/plugins/datatable/DataTables-1.10.20/js/dataTables.cellEdit.js", // Do we need this ?
                    "static/fcm-uxp/libs/components/embed/common.js",
                    "static/fcm-uxp/libs/components/embed/widget.js",
                    "static/scripts/dashboard3/commonResources.js",
                    "static/scripts/common/commonUX.js",
                    "static/scripts/currencyMapping.js",
                    //"ux/custom/csrf" // This is to get CSRF token in the form of javascript
                ],
                init: function () {
                    window.console.log('Initializing WidgetLauncher');
                    this.loadStyles();
                    this.loadScripts();
                },
                isLoaded: function () {
                    return this.cssLoaded && this.jsLoaded;
                },
                registerWidget: function (widgetId, widgetFn) {
                    window.console.log('Regsitering widget :: ' + widgetId + " = " + widgetFn);
                    this.registry[widgetId] = widgetFn;
                },
                getWidgetFunction: function (widgetId) {
                    return this.registry[widgetId];
                },
                internalLoadStyles: function (arr, callback) {
                    var self = this,
                    	i = 0;
                    for (i = 0; i < arr.length; i += 1) {
                    	var url = arr[i];
                    	if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
                    		url = self.baseUrl + arr[i];
                    	}
                        window.WidgetResourceLoader.loadCSS(url, callback);
                    }
                },
                loadStyles: function () {
                    var self = this,
                        count = 0,
                        timerId;
                    if (!this.js || this.js.length === 0) {
                        window.console.log('WidgetLauncher styles are already loaded');
                        self.cssLoaded = true;
                        return;
                    }
                    window.console.log('WidgetLauncher styles are being loaded');
                    this.internalLoadStyles(this.css, function () {
                        count += 1;
                    });
                    timerId = window.setInterval(function () {
                        if (count < self.css.length) {
                            return;
                        }
                        window.clearInterval(timerId);
                        window.console.log('WidgetLauncher styles are loaded');
                        self.cssLoaded = true;
                    }, 50);
                },
                internalLoadScripts: function (arr, callback) {
                    var self = this,
                    	i = 0;
                    for (i = 0; i < arr.length; i += 1) {
                    	var url = arr[i];
                    	if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
                    		url = self.baseUrl + arr[i];
                    	}
                        window.WidgetResourceLoader.loadJS(url, callback);
                    }
                },
                loadJsScripts: function(scriptSet, arrJS, callback) {
                	var self = this,
                	count = 0,
                    timerId;
                    if (!arrJS || arrJS.length === 0) {
                        callback();
                        window.console.log(scriptSet + ' - WidgetLauncher no scripts to be loaded');
                        return;
                    }
                    window.console.log(scriptSet + ' - WidgetLauncher scripts are being loaded');
                    self.internalLoadScripts(arrJS, function () {
                        count += 1;
                    });
                    timerId = window.setInterval(function () {
                        if (count < arrJS.length) {
                            return;
                        }
                        window.clearInterval(timerId);
                        window.console.log(scriptSet + ' - WidgetLauncher scripts are loaded');
                        callback();
                    }, 50);
                },
                loadScripts: function () {
	                var self = this;
	                self.loadJsScripts('bootstrap', self.bootstrapJs, function() { // level 1
		                self.loadJsScripts('common2', self.common2Js, function() { // level 2
			                self.loadJsScripts('common', self.commonJs, function() { // level 3
				                self.loadJsScripts('js', self.js, function() { // level 4
				                	self.jsLoaded = true;
				                });
			                });
		                });
	                });
                },
                internalLoad: function (widgetId, config) {
                    var self = this,
                        widget,
                        widgetFn = self.getWidgetFunction(widgetId);
                    if (widgetFn === undefined) {
                        window.console.log("ERROR: No widget found for given widgetId - " + widgetId);
                        return;
                    }
                    widget = widgetFn(widgetId, config);
                    return widget;
                },
                load: function (widgetId, config, callback) {
                    var self = this,
                        timerId,
                        widget;
                    if (window.Widget) {
                        widget = self.internalLoad(widgetId, config);
                        callback(widget);
                        return;
                    }
                    timerId = window.setInterval(function () {
                        if (window.Widget === undefined) {
                            window.console.log("INFO: Waiting for availability of Widget resources");
                            return;
                        }
                        window.clearInterval(timerId);
                        var widget = self.internalLoad(widgetId, config);
                        callback(widget);
                    });
                },
                launchWidget: function (widget, divElId) {
                    var divEl = $('#' + divElId);
                    //divEl.bootstrapMaterialDesign();
                    widget.parent = divEl;
                    widget.parentElId = divElId; 
                    widget.render(widget, {});
                    $('#pageLoadingIndicator').remove();
                },
                create: function (version) {
                    var self = this;
                    self.version = version;
                    self.init();
                    return self;
                }
            };
            return launcher.create("1.1");
        };
        window.console.log('Createing Widget Launcher v1.1');
        var launcherInstance = window.createLauncherV1_1(),
            timerId = window.setInterval(function () {
                if (!launcherInstance.isLoaded()) {
                    window.console.log('Widget Launcher v1.1 creation is in-progress');
                    return;
                }
                window.clearInterval(timerId);
                window.console.log('Widget Launcher v1.1 created');
                window.WidgetLauncher = launcherInstance;
            });
    }
});
