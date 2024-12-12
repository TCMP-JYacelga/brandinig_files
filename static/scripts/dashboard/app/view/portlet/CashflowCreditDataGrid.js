Ext.define('Cashweb.view.portlet.CashflowCreditDataGrid', {
	extend : 'Ext.grid.Panel',
	border : false,
	//emptyText :null,
	width:'100%',
	autoHeight : true,
	hidden : true,
	xtype : 'cashflowCreditDataGrid',
	requires: ['Ext.data.Store'],
	padding : '20 0 0 10',
	config : {
		viewConfig : {
			stripeRows : false
		},
		hideHeaders : true,
		store : null
	},
	total:null,
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
			flex: 20,
			dataIndex: 'name',
			align : 'left',
			summaryRenderer: function(value, summaryData, dataIndex) {
				             return '<span style="font-weight:bold;">' + "Credits" + "</span>";
				    }
		}, {
			sortable : false,
			hideable : false,
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
			//model: 'Cashweb.model.CashPositionModel'
			fields:['name', 'amount', 'Currency','precentage']
		});
		me.setStore(store);
		me.callParent(arguments);
	}
});
