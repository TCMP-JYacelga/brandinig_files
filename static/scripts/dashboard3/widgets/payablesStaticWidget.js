widgetMetaData.payablesStaticWidget = function(widgetId, widgetType)
{
	let metadata = {
	          'title': getDashLabel('payableStatic.title','Payable Static'),
	          'desc': getDashLabel('payableStatic.desc','Payable Static for demo'),
			  'type': 'datatable',
			  "widgetType" : widgetType,
			  "cloneMaxCount": 4,
			  'subType': '',  
			  'icon':'',
			  'fields': {
				'columns': [],
				'rows':{}	
			  },
			  'actions' : {
				  'custom' : {
					  'title' : getDashLabel('setting','Settings'),
					  'callbacks' : {
						  'click' : function(metaData){
						  }
					  }
				  },
				  'refresh' : {
					  'callbacks' : {
						  'init' : function(addData, metaData){
  							  $('#widget-body-'+widgetId).prepend($('<img>',{id:'theImg',src: rootUrl 
								  + '/static/scripts/dashboard3/widgets/cash-flow.jpg', width: "100%"}))
						  }
					  }
				  }
			  }
	}
	return metadata;
}

