/*jslint browser: true*/
/*global window, document, Widget, $ */
(function($){

	window.widgetMap = window.widgetMap || {};
	window.widgetConfig = {};
	window.embedded = true;
	
	window.createWidgetEmbeder = function (widgetId, widgetType, parentElId, widgetConfig) {
		widgetId = widgetId + "_" + getNextUniqueId();
		var parentEl = $('#' + parentElId);
		var layoutId = "dash-left-container";
		if (widgetType === "btrAccountType") 
		{
			layoutId = "dash-top-container";
		} else if (widgetConfig.layoutId) 
		{
			layoutId = widgetConfig.layoutId;
		}
		var embedDashboard = {
			"dashboardId": "financeExecutive",
			"layouts":[
			 {
				"layoutId": layoutId,
				"class":"",
				"groupContainers" : [
					{
						"id":'customContainers',
						"position": 1,
						"colSpan": 2,
						"rowSpan": 1,
						"widgetContainers": [
							{
								"widgetId" : widgetId,
								"widgetType": widgetType
							}				  
						]
					}
				]		
			  }
			]
		};
		window.widgetConfig[widgetId] = widgetConfig;
		var widgetEmbeder = {
			dashboardMap: {},
			widgetMap: {},
			WidgetGroupContainerClass: undefined,
			widgetSetting: undefined,
			usrDashboardPref: {},
			init: function(config) {
				var _this = config;
				var parentEl = _this.parentEl;
				widgetEmbeder.usrDashboardPref.widgets = {};
				widgetEmbeder.dashboardMap.financeExecutive = embedDashboard;
				widgetEmbeder.usrDashboardPref.dashboard = widgetEmbeder.dashboardMap.financeExecutive;

				parentEl.html("");
				parentEl.append('<div id="pageLoadingIndicator" class="loading-indicator"></div>');
				parentEl.append('<div id="' + layoutId + '"></div>');
		
				_this.metadata = widgetEmbeder.dashboardMap.financeExecutive;
				widgetMetaData.init(_this.metadata);
				
				widgetMap[widgetId].config = config;
				if (widgetMap[widgetId].applyConfiguration) {
					widgetMap[widgetId].applyConfiguration(config);
				}
				parentEl.find('#pageLoadingIndicator').remove();
				$.each(_this.metadata.layouts, function(index, _oLayout) {
					var targetedLayoutId = _oLayout.layoutId;
					var groupContainers = _oLayout.groupContainers;
					widgetEmbeder.paintGroupContainer(targetedLayoutId, groupContainers);			
				});
			},
			paintGroupContainer: function(_oTargetedLayoutId, _oGroupContainers) {
				$.each(_oGroupContainers, function(index,_oContainer) {
					let colSpan = 6 * parseInt(_oContainer.colSpan);
					let widgetContainer = widgetGroupContainer.initialize(_oContainer.toggleSlider, _oContainer.id, _oContainer.widgetContainers, widgetEmbeder.usrDashboardPref);
					
					if(widgetContainer.groupContainer)
					{
						var widgetContainerDiv = document.createElement('div');
						var className = 'col-md-'+colSpan;
						widgetContainerDiv.className = className;
		                widgetContainerDiv.id =  index;
						
						widgetContainerDiv.appendChild(widgetContainer.groupContainer);
						parentEl.find('#' + _oTargetedLayoutId).append(widgetContainerDiv.outerHTML);
					}			
				});
			}
		};
		// before initializing widget initialize common resources
		window.initializeCommonResources(widgetConfig);
		// initialize widget for embedding
		widgetEmbeder.init({
			"metadata": embedDashboard,
			"parentElId": parentElId,
			"parentEl": parentEl,
			"config": widgetConfig
		});
		return widgetEmbeder;
	};
	
	window.updateDashboardPref = function() {
		// don't do anything
		window.console.log("Call to updateDashboardPref() but doing nothing as it is in embed mode");
	}
	
})(jQuery);
