Ext.define('Cashweb.store.AvailableWidgetStore', {
			extend : 'Ext.data.Store',
			fields : ['widgetCode', {name : 'position',type : 'int'},
			          {name : 'widgetName'}, 'widgetType', 'defaultUrl'],
			autoLoad : false,
			storeId: 'available-widget-store',
			config: {
			},
			proxy : {
				type : 'ajax',
				url : 'services/getClientWidgets.json',
				reader : {
					type : 'json',
					root : 'clientwidgets'
				},
				actionMethods: {
			          read: 'POST'
			      }
			}
			
		});