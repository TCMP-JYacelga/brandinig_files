Ext.define('GCP.view.ClientOfficeTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientOfficeTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
//	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 0px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('clientOfficeMessage', 'Client Office'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}

		];
		this.callParent(arguments);
	}

});