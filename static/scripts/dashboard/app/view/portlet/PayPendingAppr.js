Ext.define('Cashweb.view.portlet.PayPendingAppr', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.paypendingappr',
	requires : ['Cashweb.store.PayPendingApprStore'],
	border : false,
	padding : '5 10 10 10',
	emptyText : null,
	cls: 'widget-grid',
	taskRunner : null,
	minHeight : 50,
	total:0,
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	features: [{
        ftype: 'summary'
    }],
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		this.store = new Cashweb.store.PayPendingApprStore();
		this.columns = [{
					header : "Effective Date",
					dataIndex : 'MAKER_DATE',
					sortable : false,
					hideable : false,
					flex : 23
				}, {
					header : "Reference",
					dataIndex : 'PHDREFERENCE',
					sortable : false,
					hideable : false,
					flex : 23
					/*renderer : function(value, meta, record, row, column, store) {
								return value +"	"+ '<span style="color:blue" class="underlined cursor_pointer"> see </span>';
							
					}*/
				}, {
					header : "#",
					dataIndex : 'PHDTOTALNO',
					align : 'right',
					sortable : false,
					hideable : false,
					flex : 8
				}, {
					header : "Amount",
					dataIndex : 'TXN_AMNT',
					align : 'right',
					sortable : false,
					hideable : false,
					flex : 23,
					summaryRenderer: function(value, summaryData, dataIndex) {
				             return '<span class="font_bold">'+thisClass.total+'</span>';
				    },
					renderer : function(value, meta, record, row, column, store) {
						return record.get('CCY_SYMBOL') +value;
					}
				}, {
					header : "Maker",
					dataIndex : 'USRDESCRIPTION',
					align : 'right',
					sortable : false,
					hideable : false,
					flex : 23
				}];

		this.callParent();
	}
});