Ext.define('Cashweb.store.WidgetStore', {
			extend : 'Ext.data.Store',
			fields : ['widgetCode', {name : 'position',type : 'int'},
			          {name : 'widgetName'}, 'closable', 'refreshType', 'refreshInterval', 'widgetType', 'defaultUrl'],
			autoLoad : false,
			storeId: 'widget-store',
			proxy :{
				type: 'ajax',
				url : './getDashboardWidgetPreferences.rest',
				reader : {
					type: 'json',
					root : 'userwidgets'
				}
			},
			getJSONDataArray : function(){
				var totalRecordsCount = this.getCount();
				var jsonArray =  new Array();
				var recordsArray = this.getRange(0,totalRecordsCount);
				for(index in recordsArray){
					jsonArray.push(
						recordsArray[index].get('widgetCode')
					)
				}
				return jsonArray;
			}
});