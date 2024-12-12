const RefreshActionUtils = {
	actionIds : {
	   'actionBtnId' : 'actionbtn_refresh_'
	},   
	
	actionClasses : {}
};

var refresh = function(){
   return RefreshAction();
 };

function RefreshAction(){
  var _this = {};
  _this.filterAction = filter();
  _this.constructor = function(widgetId, label, icon, metadata, callback) {
		this.widgetId = widgetId;
		this.label = label;
		this.icon = icon;
		this.metadata = metadata;
		this.callback = callback;
		this.utils = RefreshActionUtils;		
		this.action = '';
		this.appliedFilter = undefined;
		this.filterAction.constructor(widgetId, null, null, metadata, null);
		
		this.initialize();
    };
	
  _this.initialize= function(){
		this.action = this.createAction();
		this.bindAction()
	};
	
  _this.createAction = function(){
		let menuOption = document.createElement('button');
		menuOption.className = 'btn btn-dark pl-2 mr-1 pt-1 pb-1';
		menuOption.id = this.utils.actionIds.actionBtnId + this.widgetId;
		menuOption.setAttribute('href','javascript:void(0);');
		menuOption.innerHTML = this.icon;
		
		return menuOption;
	};
	
	_this.getAction = function(){
		return this.action;
	};
	
	_this.bindAction = function(){	
		let _this = this;
		let actionId = _this.utils.actionIds.actionBtnId + _this.widgetId;
		$('#'+actionId).ready(function(){
			_this.callback ? _this.callback(_this) : _this.callAction();
			$('#'+actionId).unbind('click');
			$('#'+actionId).click(function(){
				_this.callback ? _this.callback(_this) : _this.callAction();
			});			
		});
		
		widgetMap[_this.widgetId].api = {'refresh' : function(){_this.callAction()}}
	};
	
	_this.callAction = function(){
		
		let widgetFactory = _widgetFactory();
		widgetFactory.constructor(_this.metadata.type);
		let localFilter = null;
		let filterData;
		let groupFields = [];
		
		let localStore = localStorage.getItem(this.widgetId);
		if(localStore)
		{
			localStore = JSON.parse(localStorage.getItem(this.widgetId));
			localFilter = localStore.localSavedFilter;
			groupFields = localStore.group;
			filterData = localFilter ? localFilter :  this.filterAction.getDefaultFilter();
		}
		else if(usrDashboardPref.widgets && usrDashboardPref.widgets[this.widgetId]  
        &&  usrDashboardPref.widgets[this.widgetId].defalutFilter
		&&  usrDashboardPref.widgets[this.widgetId].defalutFilter != 'Default' 
		&&  usrDashboardPref.widgets[this.widgetId].defalutFilter != '-1')
		{
			let defalutFilter = usrDashboardPref.widgets[this.widgetId].defalutFilter;		
				filterData = {
						filter : usrDashboardPref.widgets[this.widgetId].savedFilter[defalutFilter]
					}
			if(filterData.filter && filterData.filter.group)
			{
				groupFields = filterData.filter.group;
			}	           			
		}
		else
		{
			filterData = this.filterAction.getDefaultFilter();
		}
		
		var url = this.metadata.url;
		if(this.metadata.actions && this.metadata.actions.filter && this.metadata.actions.filter.callbacks && this.metadata.actions.filter.callbacks.adaptUrl)
		{
			url = this.metadata.actions.filter.callbacks.adaptUrl(filterData);
		}
		var reqData = filterData;
		if(this.metadata.actions && this.metadata.actions.filter && this.metadata.actions.filter.callbacks && this.metadata.actions.filter.callbacks.adaptPostData)
		{
			reqData = this.metadata.actions.filter.callbacks.adaptPostData(filterData);
		}
		var seeMoreUrl = this.metadata.seeMoreUrl;
		if(this.metadata.actions && this.metadata.actions.filter && this.metadata.actions.filter.callbacks && this.metadata.actions.filter.callbacks.adaptSeeMoreUrl)
		{
			seeMoreUrl = this.metadata.actions.filter.callbacks.adaptSeeMoreUrl(filterData);
		}
		
		// Unsubscribe for event that were previously subscribed using eventbus APIs
		if(this.metadata.actions && this.metadata.actions.refresh && this.metadata.actions.refresh.callbacks && this.metadata.actions.refresh.callbacks.unsubscribe)
		{
			this.metadata.actions.refresh.callbacks.unsubscribe();
		}

		widgetFactory.createWidget({
			'widgetId' : this.widgetId,
			'target'   : 'widget-body-'+this.widgetId,
			'dataMethod' : this.metadata.dataMethod,
			'data'     : this.metadata.data,
			'rootData'     : this.metadata.rootData,
			'url'      : url,
			'method'   : this.metadata.requestMethod,
			'reqData'  : reqData,
			'resRoot'  : this.metadata.responseRoot,
			'adaptData': this.metadata.adaptData,
			'fields'   : this.metadata.fields,
			'chart'    : this.metadata.chart,
			'chartType': this.metadata.subType,
            'sortMethod' : this.metadata.sortMethod ? this.metadata.sortMethod : 'sort',
			'sorting'  : this.metadata.sorting,
			'grouping' : groupFields,
			'actions'  : this.metadata.actions,
			'widgetType' : this.metadata.widgetType,
			'maxRecords' : this.metadata.maxRecords,
			'seeMoreUrl' : seeMoreUrl
		});
		
		if(this.metadata.actions && this.metadata.actions.filter && this.metadata.actions.filter.callbacks && this.metadata.actions.filter.callbacks.apply)
		{
			this.metadata.actions.filter.callbacks.apply(filterData);
		}
		
		// Subscribe for events using eventbus APIs
		if(this.metadata.actions && this.metadata.actions.refresh && this.metadata.actions.refresh.callbacks && this.metadata.actions.refresh.callbacks.subscribe)
		{
			this.metadata.actions.refresh.callbacks.subscribe();
		}
		
		// auto-refresh feature
		if (this.metadata.autoRefreshInterval !== undefined && this.metadata.autoRefreshInterval > 5  // valid value > 5
			&& (widgetMap[_this.widgetId].autoRefreshScheduled === undefined || widgetMap[_this.widgetId].autoRefreshScheduled === false)) // check if auto-refresh is already scheduled
		{
			var timeout = window.setTimeout(function() {
					widgetMap[_this.widgetId].autoRefreshScheduled = false;
					window.clearTimeout(timeout);
					if (widgetMap[_this.widgetId] !== undefined && widgetMap[_this.widgetId].api.refresh !== undefined) { // check if widget still exists and refresh can be done
						widgetMap[_this.widgetId].api.refresh();
					}
				}, 
				this.metadata.autoRefreshInterval * 1000
			);
			widgetMap[_this.widgetId].autoRefreshScheduled = true;
		}
	}
	return _this;
}
