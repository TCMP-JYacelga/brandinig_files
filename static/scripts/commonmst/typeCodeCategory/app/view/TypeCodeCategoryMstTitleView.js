Ext.define('GCP.view.TypeCodeCategoryMstTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'typeCodeCategoryTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls : 'ux_panel-background',
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
					text : getLabel('tpcmstTypeCodeCategoryID','Type Code Category'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}
		];
		this.callParent(arguments);
	}

});