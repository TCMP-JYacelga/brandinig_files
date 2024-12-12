Ext.define('GCP.view.UploadSummaryTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'uploadSummaryTitleView',
	requires : [],
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

		this.items = [
		         {
					xtype : 'label',
					text : getLabel('uploaddefinition', 'Import Definition'),
					cls : 'page-heading'
				 }

		];

		this.callParent(arguments);
	}

});