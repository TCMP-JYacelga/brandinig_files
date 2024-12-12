Ext.define('Cashweb.view.portlet.AccountSummary', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.accountsummary',
	requires : ['Cashweb.store.AccountSummaryStore'],
	border : false,
	padding : '5 10 10 10',
	emptyText : null,
	taskRunner : null,
	minHeight : 50,
	cls : 't7-grid',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		this.store = new Cashweb.store.AccountSummaryStore();
		this.columns = [{
					header : label_map.accountNo,
					dataIndex : 'ACCOUNT_NMBR',
					sortable : false,
					hideable : false,
					flex : 1,
					renderer : function(value, meta, record, row, column, store) {
						if (!Ext.isEmpty(record.data.ACCOUNT_NMBR))
							return record.data.ACCOUNT_NMBR;
					}
				}, {
					header : label_map.accountName,
					dataIndex : 'ACCOUNT_NAME',
					sortable : false,
					hideable : false,
					flex : 1,
					renderer : function(value, meta, record, row, column, store) {
						if (!Ext.isEmpty(record.data.ACCOUNT_NAME))
							return record.data.ACCOUNT_NAME;
					}
				}, {
					header : label_map.ledgerBal,
					dataIndex : 'BALANCE',
					align : 'right',
					sortable : false,
					hideable : false,
					flex : 1,
					renderer : function(value, meta, record, row, column, store) {
						var balance = record.data.BALANCE;
						if (!Ext.isEmpty(record.data.BALANCE)
								&& !Ext.isEmpty(record.data.CCY_SYMBOL)) {
							if (balance > 0) {
								return record.data.CCY_SYMBOL + " "
										+ record.data.BALANCE;
							} else {
								//balance = balance*-1;
								return '<span class="red">'+' ('
										+ record.data.CCY_SYMBOL + " "
										+ balance + ')' + '</span>' ;
							}
						}
					}
				}, {
					header : label_map.projectEODBalance,
					dataIndex : 'TOTAL_ECB',
					align : 'right',
					sortable : false,
					hideable : false,
					flex : 1,
					renderer : function(value, meta, record, row, column, store) {
						var balance = record.data.TOTAL_ECB;
						if (!Ext.isEmpty(record.data.TOTAL_ECB)
								&& !Ext.isEmpty(record.data.CCY_SYMBOL)) {
							if (balance > 0) {
								return record.data.CCY_SYMBOL + " "
										+ record.data.TOTAL_ECB;
							} else {
								//balance = balance*-1;
								return  '<span class="red1">'+' ('
										+ record.data.CCY_SYMBOL + " "
										+ balance + ')' + '</span>' ;
							}
						}
					}
				}];

		this.callParent();
	}
});