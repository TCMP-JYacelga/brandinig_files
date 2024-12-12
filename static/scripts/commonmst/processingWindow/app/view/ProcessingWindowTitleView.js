Ext.define('GCP.view.ProcessingWindowTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'processingWindowTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls: 'ux_panel-background ux_largepaddingtb',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('processingWindow', 'System Processing Window'),
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