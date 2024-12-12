Ext.define('GCP.view.HolidaySummaryTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'holidaySummaryTitleView',
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
					text : getLabel('holidaySummary',' General Holidays'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}
		];
		this.callParent(arguments);
	}

});