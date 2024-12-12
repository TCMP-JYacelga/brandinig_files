Ext.define('Cashweb.view.portlet.CashPositionDataGrid', {

	extend : 'Ext.grid.Panel',
	border : false,
	emptyText :null,
	width:'100%',
	xtype : 'cashpositiondatagrid',
	requires: ['Cashweb.model.CashPositionModel'],
	config : {
		viewConfig : {
			stripeRows : false
		},
		hideHeaders : true,
		store : null,
		collapsible : true,
		currency: null,
		creditCount: null,
		debitCount: null
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		
		this.columns = [{
			sortable : false,
			hideable : false,
			width: 120,
			dataIndex: 'title'
		}, {
			sortable : false,
			hideable : false,
			width: 120,
			dataIndex: 'value',
			renderer: function(value, metadata, record) {
				var countRenderer = '';
				if(record.data.title == label_map.credits) {
					countRenderer = '<span class="debit-renderer">'+thisClass.config.creditCount + '</span>'; 
					return thisClass.config.currency+" "+Ext.util.Format.number(value , '0,000.00')+"("+countRenderer+")";
				} else if(record.data.title == label_map.debits) {
					countRenderer = '<span class="debit-renderer">'+thisClass.config.debitCount + '</span>'; 
					return thisClass.config.currency+" "+Ext.util.Format.number(value , '0,000.00')+"("+countRenderer+")";
				} else
					return thisClass.config.currency+" "+Ext.util.Format.number(value , '0,000.00');
			}
		}];
		
		var store = Ext.create('Ext.data.Store', {
			autoLoad: false,
			model: 'Cashweb.model.CashPositionModel'
		});
		this.setStore(store);
		this.callParent(arguments);
	}
});
