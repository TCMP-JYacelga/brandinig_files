widgetMetaData.exceptionTrends = function(widgetId, widgetType)
{
	let metadata = {

				"title": getDashLabel("exceptionTrends.title"),
				"desc": getDashLabel("exceptionTrends.desc"),
				"type": "card",
				"widgetType" : widgetType,
				"cloneMaxCount": 4,
				"subType": "",
				"icon":'<span class="material-icons"> account_balance </span>',
				"fields": {
					"columns": [],
					"rows":{}	
				},
				"actions" : 
				{
					"refresh" : {
						"callbacks" : {
							"init": function(addData, metaData) {
								var container = $("#widget-body-" + widgetId);
								var width = container.width() - 30;
								container.html("<div class='container w100 h100'>" +
								"<div class='row'>" + 
								"<div class='col-sm'>" + 
								"<h2></h2>" + 
								"<h5></h2>" + 
								"</div>" +  
								"</div>" +  
								"<div class='row'>" + 
								"<div class='col-sm'>" + 
								"<img class='h100' style='width: " + width + "px; object-fit: fit' src='static/scripts/dashboard3/widgets/excepTrend.png'/>" + 
								"</div>" +  
								"</div>" +  
								"</div>");
							}
						}
					}
				}
	}
	return metadata;
}
