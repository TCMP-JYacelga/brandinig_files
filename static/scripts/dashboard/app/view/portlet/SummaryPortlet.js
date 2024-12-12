Ext.define('Cashweb.view.portlet.SummaryPortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.cash_frcst',
	requires : ['Cashweb.store.SummaryStore'],
	padding : '0 0 0 5',
	emptyText : null,
	taskRunner: null,
	minHeight: 100,
	config : {
		hideHeaders : true,
		viewConfig : {
			stripeRows : false
		},
		currency: null
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		
		this.store = new Cashweb.store.SummaryStore();
		this.columns = [{
					dataIndex : 'balanceType',
					flex : 1
				}, {
					dataIndex : 'balanceAmount',
					align : 'right',
					flex : 1,
					renderer: function(value) {
						return thisClass.config.currency+" " + Ext.util.Format.number(value , '0,000.00');
					}
				}];
		this.callParent();
	}
});
