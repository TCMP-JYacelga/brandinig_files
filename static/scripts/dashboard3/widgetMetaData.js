var widgetMetaData = {};


// empty widgetMap neesd to be defined

widgetMetaData.init = function(_oMetadata){
	let _this = _oMetadata;
	$.each(_this.layouts, function(index,_oLayout){
		let targetedLayoutId = _oLayout.layoutId;
		let _oGroupContainers = _oLayout.groupContainers;
		$.each(_oGroupContainers, function(index,_oContainer){
			if(_oContainer.widgetContainers.length > 0)
			{
				$.each(_oContainer.widgetContainers, function(index,_widget){
					if ( widgetMetaData[_widget.widgetType] ){
						widgetMap[_widget.widgetId] = widgetMetaData[_widget.widgetType](_widget.widgetId, _widget.widgetType);
					}
				});
			}
		});		
	});
}
