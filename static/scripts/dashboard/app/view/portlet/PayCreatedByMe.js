Ext.define('Cashweb.view.portlet.PayCreatedByMe', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.paycreatedbyme',
	requires : ['Cashweb.store.PayCreatedByMeStore'],
	border : false,
	padding : '5 10 10 10',
	emptyText : null,
	taskRunner : null,
	 total:0,
	minHeight : 50,
	cls : 'widget-grid',
	features: [{
        ftype: 'summary'
    }],
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		this.store = new Cashweb.store.PayCreatedByMeStore();
		this.columns = [{
					dataIndex : 'MAKER_DATETIME',
					sortable : false,
					hideable : false,
					flex : 23
				}, {
					header : label_map.reference,
					dataIndex : 'PHDREFERENCE',
					sortable : false,
					hideable : false,
					flex : 23,
					renderer : function(value, meta, record, row, column, store) {
								return value +" "+ '<span style="color:blue" class="underlined cursor_pointer"> see </span>';
							
					}
				}, {
					header : "#",
					dataIndex : 'PHDTOTALNO',
					align : 'left',
					sortable : false,
					hideable : false,
					flex : 8
				}, {
					header : label_map.amount,
					dataIndex : 'TXN_AMNT',
					align : 'right',
					sortable : false,
					hideable : false,
					flex : 23,
					summaryRenderer: function(value, summaryData, dataIndex) {
						 return '<span class="font_bold">'+thisClass.total+'</span>';
				    },
					renderer : function(value, meta, record, row, column, store) {
						if (!Ext.isEmpty(record.data.TXN_AMNT))
							return record.data.phdpayccy + " "+record.data.TXN_AMNT;
					}
				}, {
					header : label_map.status,
					dataIndex : 'statusDescription',
					align : 'right',
					sortable : false,
					hideable : false,
					flex : 23
				}];

		this.callParent();
	}
});