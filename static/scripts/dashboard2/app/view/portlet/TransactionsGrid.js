Ext.define('Cashweb.view.portlet.TransactionsGrid',{

	extend: 'Ext.grid.Panel',
	border : false,
	emptyText :null,
	requires: ['Cashweb.model.TransactionsModel'],
	xtype : 'transactionsgrid',
	width : '100%',
	config : {
		viewConfig : {
			stripeRows : false
		},
		store : null,
		collapsible : true,
		forceFit : true,
		currency: null
	},
	
	initComponent : function(){
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		this.title = label_map.lastFiveTrans;
		this.columns = [{
			header : label_map.transactionGridDate,
			dataIndex : 'date',
			sortable : false,
			hideable : false,
			menuDisabled:true,
			draggable :false,
			resizable : false
		}, {
			header : label_map.transactionGridTypeCode,
			dataIndex : 'typecode',
			sortable : false,
			hideable : false,
			menuDisabled:true,
			draggable :false,
			resizable : false
		}, {
			dataIndex : 'amount',
			header : label_map.transactionGridAmount,
			align:'right',
			sortable : false,
			hideable : false,
			menuDisabled:true,
			draggable :false,
			resizable : false,
			renderer : function(value,metaData ,record, rowIndex, colIndex){
				var formattedAmount = "";
				if(record.data.debit_credit == 'D'){
					var renderValue = value;
					if(value < 0){
						renderValue = renderValue * (-1);
					}
					formattedAmount = '<span class="debit-renderer">'+Ext.util.Format.number(renderValue , '0,000.00') + ' </span>'; 
				}else {
					formattedAmount = Ext.util.Format.number(value , '0,000.00');
				}
				return thisClass.config.currency+" " + formattedAmount;
			}
		}];
		var store = Ext.create('Ext.data.Store',{
			autoLoad : false,
			model : 'Cashweb.model.TransactionsModel'
		});
		
		this.setStore(store);
		this.callParent(arguments);
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