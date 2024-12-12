var dashboardMap = dashboardMap || {};
var widgetMap = widgetMap || {};
var WidgetGroupContainerClass;
var widgetSetting;
var usrSortingPref = {};
var usrDashboardPref = {};
var initialContainer = [];
var widgetCloneNumberMap = new Map();
var dashBoard = {
	'init' : function(_oMetadata) {
		let _this = _oMetadata;
		usrDashboardPref.widgets = {};
		usrDashboardPref.dashboard = dashboardMap.financeExecutive;
		usrSortingPref.widgets = {};
		$('body').append('<div id="pageLoadingIndicator" class="loading-indicator"></div>');
        $('#dash-top-container').empty();
		$('#dash-left-container').empty();
		$('#dash-right-container').empty();
		$.ajax({
			url : rootUrl+'/services/getWidgetPreferences',
			dataType : 'JSON',
			data : []
		})
		.done (function(res, textStatus, jqXHR) { 
			if(res && res[0])
			{
				 usrDashboardPref = res[0];				 
				_this.metadata = usrDashboardPref.dashboard;
                                 
				if (typeof isCustomWidget !== 'undefined' && isCustomWidget == true)
				{
					_this.metadata = dashboardMap.financeExecutive;
				}
			}
		})
		.fail (function(jqXHR, textStatus, errorThrown) {})
		.always (function(jqXHROrData, textStatus, jqXHROrErrorThrown) {
			widgetMetaData.init(_this.metadata);
			let clientLevelWidgets = fetchAvailableWidgets();
            // Cloning usrDashboardPref.dashboard.layouts
            var prefJson= JSON.stringify(usrDashboardPref.dashboard.layouts);
            initialContainer = JSON.parse(prefJson);
			getWidgetsForCloneCount();
			parseRestData(clientLevelWidgets);
			_this.metadata = dashBoard.applicableWidgetMetaData(_this.metadata, clientLevelWidgets);
			$('#pageLoadingIndicator').remove();
			$.each(_this.metadata.layouts, function(index,_oLayout){
				let targetedLayoutId = _oLayout.layoutId;
				let groupContainers = _oLayout.groupContainers;
				dashBoard.paintGroupContainer(targetedLayoutId, groupContainers);			
			});
			$('#dash-right-container').on( "sortupdate", function( event, ui ) {
			   var changedPosArray = $('#dash-right-container').sortable('toArray');
			   var newRightContainer = [];
			   $.each(changedPosArray , function(index, value){
				  newRightContainer.push(initialContainer[2].groupContainers[Number(value)]);
			   });
			  usrDashboardPref.dashboard.layouts[2].groupContainers = newRightContainer;
			  updateDashboardPref();
            });
			$('#dash-left-container').on( "sortupdate", function( event, ui ) {
			   var changedPosLeftArray = $('#dash-left-container').sortable('toArray');
			   var newLeftContainer = [];
			   $.each(changedPosLeftArray , function(index, value){
				   newLeftContainer.push(initialContainer[1].groupContainers[Number(value)]);
			   });
			  usrDashboardPref.dashboard.layouts[1].groupContainers = newLeftContainer;
			  updateDashboardPref();
            });

		});
	},
	'applicableWidgetMetaData' : function(_oUserMetaData, _oClientMetaData)
	{
		let applicableWidgetTypeSet = new Set();
		let finalWidgetMetaData = null;
		// create applicable client widget set 
		if(_oClientMetaData && _oClientMetaData.clientwidgets && _oClientMetaData.clientwidgets.length > 0)
		{
			$(_oClientMetaData.clientwidgets).each(function (index,data){
				applicableWidgetTypeSet.add(data.widgetCode);
			});
		}
		// use applicableWidgetTypeSet to create final applicable widget metadata
		finalWidgetMetaData = dashBoard.parseDashboardforWidgetTypes(_oUserMetaData, applicableWidgetTypeSet);
		return finalWidgetMetaData;
	},
	'parseDashboardforWidgetTypes' : function(_oDashBoardMetaData, _oApplicableWidgetTypeSet) {
		   let _index, _index2, _index3;
		   let widgetArray = [];
		   $(_oDashBoardMetaData.layouts).each(function(index, layout){
			   _index = index;
			   $(layout.groupContainers).each(function(index2, layout2){
				   _index2 = index2;
				  widgetArray = [];
				  if (layout2) {
					  for(let counter = 0; counter < layout2.widgetContainers.length; counter++)
					  {
						 if(_oApplicableWidgetTypeSet.size > 0 &&  _oApplicableWidgetTypeSet.has(layout2.widgetContainers[counter].widgetType) == true)
						 {
							 widgetArray.push(layout2.widgetContainers[counter]);
						 }
					  }					  
				  _oDashBoardMetaData.layouts[_index].groupContainers[_index2].widgetContainers = widgetArray;
				  }
			   });
		   });
		   return _oDashBoardMetaData;
	},
	'paintGroupContainer': function(_oTargetedLayoutId, _oGroupContainers){
		$.each(_oGroupContainers, function(index,_oContainer){
			let colSpan = 6*parseInt(_oContainer.colSpan);
			let widgetContainer = widgetGroupContainer.initialize(_oContainer.toggleSlider, _oContainer.id, _oContainer.widgetContainers);
			
			if(widgetContainer.groupContainer)
			{
				let widgetContainerDiv = document.createElement('div');
				let className = 'col-md-'+colSpan;
				widgetContainerDiv.className = className;
                widgetContainerDiv.id =  index;
				
				
				widgetContainerDiv.appendChild(widgetContainer.groupContainer);
				$('#'+_oTargetedLayoutId).append(widgetContainerDiv.outerHTML);
				
			}			
		});
	}
};


function updateDashboardPref(){
	$.ajax({
		url : rootUrl+'/services/updateWidgetPreferences',
		dataType : 'JSON',
		method : 'POST',
		async : false,
		data : {
			"$dashboardWidgets" : JSON.stringify(usrDashboardPref)
		},
		success : function(data){
		}
	});	
}
