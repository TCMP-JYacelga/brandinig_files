Ext.define('GCP.view.BankPrinterMstTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankPrinterMstTitleView',
	requires : [ 'Ext.form.Label', 'Ext.Img', 'Ext.button.Button' ],
	width : '100%',
	defaults : {
		style : {
			padding : '0 0 0 0px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'label',
			text : getLabel('bankPrinter', 'Bank Printer Master'),
			itemId : 'pageTitle',
			cls : 'page-heading'
		},{
			xtype : 'label',
			flex : 25
		}];
		me.callParent(arguments);
	}
});
