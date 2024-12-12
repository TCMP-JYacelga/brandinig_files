Ext.define('GCP.view.PaymentPackageTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentPackageTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls : 'ux_panel-background',
	padding : '10 0 10 0',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('paymentPackageMst', 'Payment Package Master Setup'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}];
		this.callParent(arguments);
	}

});