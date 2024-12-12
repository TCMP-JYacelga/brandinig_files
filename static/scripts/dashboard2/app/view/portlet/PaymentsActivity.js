Ext.define('Cashweb.view.portlet.PaymentsActivity', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.paymentsactivity',
	requires : ['Cashweb.store.PaymentsActivityStore'],
	border : false,
	emptyText : null,
	taskRunner : null,
	minHeight : 50,
	cols : 3,
	cls: 'widget-grid',
    total:0,
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
		this.store = new Cashweb.store.PaymentsActivityStore();
		this.columns = [{
					header : label_map.period,
					dataIndex : 'REQUEST_DATE',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 1,
					renderer : function(value, meta, record, row, column, store) {
						if(!Ext.isEmpty(value)){
							if(row === 0)
								return value + " to Date";
							else
								return value;
						}
					}
				}, {
					header : '#',
					dataIndex : 'TOTAL_TXN',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					align : 'right',
					flex : 1,
					renderer : function(value, meta, record, row, column, store) {
						if (!Ext.isEmpty(record.data.TOTAL_TXN))
							return record.data.CCY_SYMBOL + " "+record.data.TOTAL_TXN;
					}
				}, {
					header : label_map.payAmnt,
					dataIndex : 'TOTAL_AMNT',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 1,
					summaryRenderer: function(value, summaryData, dataIndex) {
						 return '<span class="font_bold">'+thisClass.total+'</span>';
				    },
					renderer : function(value, meta, record, row, column, store) {
						var balance = record.data.PAY_AMNT;
						if (!Ext.isEmpty(record.data.TOTAL_AMNT)
								&& !Ext.isEmpty(record.data.CCY_SYMBOL)) {
							if (balance < 0) {
								return ' (' + '<span class="red">'
										+ record.data.CCY_SYMBOL + " "
										+ record.data.TOTAL_AMNT + '</span>' + ')';
							} else {
								return record.data.CCY_SYMBOL + " "
										+ record.data.TOTAL_AMNT;
							}
						}
					}
				}, {
					header : '#',
					dataIndex : 'FAILED_COUNT',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 1,
					renderer : function(value, meta, record, row, column, store) {
						if (!Ext.isEmpty(record.data.FAILED_COUNT))
							return record.data.FAILED_COUNT;
					}
				}, {
					header : label_map.faliedPmnt,
					dataIndex : 'FAILED_AMNT',
					align : 'right',
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					flex : 1,
					renderer : function(value, meta, record, row, column, store) {
						var balance = record.data.FAILED_AMNT;
						if (!Ext.isEmpty(record.data.FAILED_AMNT)
								&& !Ext.isEmpty(record.data.CCY_SYMBOL)) {
							if (balance < 0) {
								return ' (' + '<span class="red">'
										+ record.data.CCY_SYMBOL + " "
										+ record.data.FAILED_AMNT + '</span>' + ')';
							} else {
								return record.data.CCY_SYMBOL + " "
										+ record.data.FAILED_AMNT;
							}
						}
					}
				}];

		this.callParent();
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