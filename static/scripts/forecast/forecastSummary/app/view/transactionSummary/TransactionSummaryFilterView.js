Ext.define("GCP.view.transactionSummary.TransactionSummaryFilterView", {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'transactionSummaryFilterView',
	layout : 'vbox',
	initComponent : function() {
		var me = this, strUrl = '';

		me.items = [{
			xtype : 'container',
			itemId : 'parentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
					xtype : 'container',
					itemId : 'accountNumContainer',
					layout : 'vbox',
					width : '25%',
					padding : '0 30 0 0',
					items : [{
								xtype : 'label',
								itemId : 'accountNoLabel',
								text : getLabel('accountNmbr', 'Account Number')
							}, {
								xtype : 'combo',
								displayField : 'DESCR',
								valueField : 'CODE',
								queryMode : 'local',
								editable : false,
								disabled : true,
								width : '100%',
								padding : '-4 0 0 0',
								itemId : 'accountCombo',
								listeners : {
									select : function(combo, record, eOpts) {
//										changeClientAndRefreshGrid(combo.getValue(), combo.getDisplayValue());
									}
								}
							}]
				},{
				xtype : 'container',
				itemId : 'periodDateContainer',
				layout : 'vbox',
				width : '50%',
				padding : '0 30 0 0',
				items : [{
					xtype : 'panel',
					itemId : 'periodDatePanel',
					height : 23,
					flex : 1,
					layout : 'hbox',
					items : [{
						xtype : 'label',
						itemId : 'periodDateLabel',
						text : getLabel('date1', 'Period')
					}]
				}, {
					xtype : 'container',
					itemId : 'periodDateContainer',
					layout : 'hbox',
					width : '50%',
					items : [{
						xtype : 'component',
						width : '82%',
						itemId : 'periodicDatePicker',
						disabled : true,
						filterParamName : 'PeriodDate',
						html : '<input type="text"  id="periodicDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'icon-calendar disabled input-group-addon',
						disabled : true,
						margin : '1 0 0 0',
						html : '<span class="disabled"><i class="fa fa-calendar"></i></span>'
					}]
				}]
			}]
		}];
		this.callParent(arguments);
	}
});