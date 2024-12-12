Ext.define('GCP.view.ReportDefinitionTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'reportDefinitionTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
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
					text : getLabel('lblReportDefinition', 'Report Definition'),
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