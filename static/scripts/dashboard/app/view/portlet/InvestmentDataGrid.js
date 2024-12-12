Ext.define('Cashweb.view.portlet.InvestmentDataGrid', {

	extend : 'Ext.grid.Panel',
	border : false,
	emptyText :null,
	width:'100%',
	xtype : 'investmentdatagrid',
	requires: ['Cashweb.model.InvestmentGridModel'],
	config : {
		viewConfig : {
			stripeRows : false
		},
		hideHeaders : true,
		store : null,
		collapsible : true,
		currency: null
		
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
				if(record.data.title == label_map.totalpurchase) {
					return value;
				}else if(record.data.title == label_map.totalredeem){
					return value;
				}else if(record.data.title == label_map.availableunits) {
					return Ext.util.Format.number(value , '0,000.00');
				}else if(record.data.title == label_map.netassetvalue){ 
					return thisClass.config.currency+" "+Ext.util.Format.number(value , '0,000.00');
				} else
					return thisClass.config.currency+" "+Ext.util.Format.number(value , '0,000.00');
			}
		}];
		
		var store = Ext.create('Ext.data.Store', {
			autoLoad: false,
			model: 'Cashweb.model.InvestmentGridModel'
		});
		this.setStore(store);
		this.callParent(arguments);
	}
});
