Ext.define('GCP.view.CollectionMethodTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'collectionMethodTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	cls : 'ux_panel-background ux_largepaddingtb',
	width : '100%',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('collectionmethod', 'Receivable Package'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}];
		this.callParent(arguments);
	}

});