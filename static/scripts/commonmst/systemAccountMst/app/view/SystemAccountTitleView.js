Ext.define('GCP.view.SystemAccountTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'systemAccountTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls : 'ux_largepaddingtb ux_panel-background',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : 'Account Definition',//getLabel('systemBeneficiary', 'Bank Report Master Setup'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 25
				}
		];
		this.callParent(arguments);
	}

});