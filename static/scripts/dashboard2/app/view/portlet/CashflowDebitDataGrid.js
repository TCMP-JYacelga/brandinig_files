Ext.define('Cashweb.view.portlet.CashflowDebitDataGrid', {

	extend : 'Ext.grid.Panel',
	border : false,
	//emptyText :null,
	width:'100%',
	autoHeight : true,
	hidden : true,
	xtype : 'cashflowDebitDataGrid',
	requires: ['Ext.data.Store'],
	padding : '20 0 0 10',
	total:null,
	config : {
		viewConfig : {
			stripeRows : false
		},
		hideHeaders : true,
		store : null
	},
	cls : 'widget-grid',
	features: [{
        ftype: 'summary'
    }],
	initComponent : function() {
		var me = this;
		//me.emptyText = label_map.noDataFound;
		me.columns = [{
			sortable : false,
			hideable : false,
			menuDisabled:true,
			draggable :false,
			resizable : false,
			flex: 20,
			dataIndex: 'name',
			align : 'left',
			summaryRenderer: function(value, summaryData, dataIndex) {
			
				            return '<span style="font-weight:bold;font-size : 13px;">' + "Debits" + "</span>";
				    }
		}, {
			sortable : false,
			hideable : false,
			menuDisabled:true,
			draggable :false,
			resizable : false,
			flex: 20,
			dataIndex: 'amount',
			align : 'right',
			summaryType: 'sum',
		    summaryRenderer: function(value, summaryData, dataIndex) {
		    	             return '<span style="color:#00CCFF !important;font-weight:bold;font-size :13px;">' + me.total + "</span>";
				    },
			renderer: function (value, metadata, record) {
			   var amnt=record.get('amount');
			   var currency=record.get('Currency');
			   var returnCurrency=currency+' '+amnt;
			   return returnCurrency;
            }
			
		},{
			sortable : false,
			hideable : false,
			menuDisabled:true,
			draggable :false,
			resizable : false,
			flex: 8,
			dataIndex: 'precentage',
			align : 'left',
			renderer: function (value, metadata, record) {
                 var per=record.get('precentage').toFixed(2);
				 return per +'%';
            }
		}];
		
		var store = Ext.create('Ext.data.Store', {
			autoLoad: false,
			fields:['name', 'Currency','amount', 'precentage']
		});
		me.setStore(store);
		me.callParent(arguments);
	},
	getSettingsPanel : function() {
		var settingsPanel = Ext.create('Ext.panel.Panel',{
			getSettings : function () {	
				var me = this;
				var jsonArray = [];
				return jsonArray;
			}	
		});
		return settingsPanel;
	},
	getDataPanel : function () {
		return this;
	}
});
