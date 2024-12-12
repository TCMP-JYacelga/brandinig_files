Ext.define('GCP.view.SystemBeneficiaryTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'systemBeneficiaryTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls : 'ux_largepaddingtb ux_panel-background',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('systemBeneficiaryMst', 'Bank Beneficiary Master Setup'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}];
		this.callParent(arguments);
	}

});