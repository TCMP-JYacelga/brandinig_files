Ext.define('GCP.view.TaxRateMstTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'taxRateMstTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
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
					text : getLabel('taxRateSummary','Tax Rate Summary'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}
		];
		this.callParent(arguments);
	}

});