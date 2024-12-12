var widgetActions = {
  fnFilter : function(e,widgetId,meta){
	 $.ajax({
	  type: "GET",
	  crossDomain : true,
	  url: 'http://localhost:5051/dashboard/filter.json',
	  data: [],
	  success: function(res){
		new WidgetFilter(res).load({
		   "save" : function(data){
             let dataConfig = {
				  'target':	'widgetBody_'+widgetId,
				  'url': meta.url,
				  'responseRoot': meta.responseRoot,
				  'type': meta.type,
				  'subType': meta.subType,		  
				  'fields': meta.fields
			  }
             new WidgetData(dataConfig).resetData("$filter=EntryDate bt date'2020-01-01' and date'2020-01-13'");
		   },
		  "apply" : function(data){
             alert('Apply');
		   }
		});
	  }
	});
  },  
  fnCallback : function(e,widgetId,meta){
	 alert(widgetId);
  }
}