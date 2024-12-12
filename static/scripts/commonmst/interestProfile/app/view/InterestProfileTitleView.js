Ext.define('GCP.view.InterestProfileTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interestProfileTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	baseCls : 'page-heading',
	cls : 'ux_extralargepaddingtb ux_no-margin',
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
					text : getLabel('interestProfile','Interest Profile'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}
		];
		this.callParent(arguments);
	}

});