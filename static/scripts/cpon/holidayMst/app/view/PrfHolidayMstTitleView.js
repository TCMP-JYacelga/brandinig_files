Ext.define('GCP.view.PrfHolidayMstTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'prfHolidayTitleView',
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
					text : getLabel('holidayProfile','Holiday Profile'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}
		];
		this.callParent(arguments);
	}

});