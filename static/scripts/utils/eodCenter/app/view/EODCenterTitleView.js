Ext.define('GCP.view.EODCenterTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'eodCenterTitleView',
	requires : [],
	width : '100%',
	//baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 0'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
						xtype : 'label',
						text : getLabel('eodCenterTitle', 'End of the day'),
						cls : 'page-heading',
						//margin : '0 0 10 0',
						padding : '0 0 0 10'
					 },
					{
						xtype : 'label',
						flex : 19
					}];

		this.callParent(arguments);
	}

});