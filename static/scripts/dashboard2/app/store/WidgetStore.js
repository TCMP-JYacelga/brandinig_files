Ext.define('Cashweb.store.WidgetStore', {
			extend : 'Ext.data.Store',
			fields : ['widgetCode', {name : 'position',type : 'int'},
			          {name : 'widgetName'}, 'closable', 'refreshType', 'refreshInterval', 'widgetType', 'defaultUrl',
			          {name : 'settings'},'collapsedFlag','defaultWidgetFlag'],
			autoLoad : false,
			storeId: 'widget-store',
			proxy :{
				type: 'ajax',
				url : 'services/getUserWidgets.json',
				reader : {
					type: 'json',
					root : 'userwidgets'
				},
				actionMethods: {
			          read: 'POST'
			      }
			},
			getJSONDataArray : function(){
				var totalRecordsCount = this.getCount();
				var jsonArray =  new Array();
				var recordsArray = this.getRange(0,totalRecordsCount);
				for(var index = 0; index<recordsArray.length; index++){
					if(recordsArray[index].get('widgetCode') === 'BANNER'){
						for(var j = 0; j<jsonArray.length; j++){
							jsonArray[j].position = parseInt(jsonArray[j].position,10) + 1;
						}
						var record = {
							'widgetCode' : recordsArray[index].get('widgetCode'),
							'settings' : recordsArray[index].get('settings'),
							'position' : 0,
							'collapsedFlag' : recordsArray[index].get('collapsedFlag')
						};
						jsonArray.push( record );						
					} else 	{				
						var record = {
							'widgetCode' : recordsArray[index].get('widgetCode'),
							'settings' : recordsArray[index].get('settings'),
							'position' : parseInt(index,10),//recordsArray[index].get('position'),
							'collapsedFlag' : recordsArray[index].get('collapsedFlag')
						};
						jsonArray.push( record );
					}				
				}
				jsonArray.sort(function(a,b) { return parseInt(a.position,10) - parseInt(b.position,10) } );
				return jsonArray;
			}
});