Ext.define('GCP.view.CustomerFileMappingSummaryTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'customerFileMappingSummaryTitleView',
	requires : ['Ext.layout.container.HBox','Ext.form.Label'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		
		var lableTitle = null;
		
		if(isBankFlag === 'true')
		{
			lableTitle = getLabel('bankInterfaceCenter', 'Bank Interface Center');
		}
		else
		{
			lableTitle = getLabel('customInterfaceCenter', 'Customer Interface Center');
		}
		
		this.items = [
		         {
					xtype  : 'label',
					itemId : 'lblBank',
					text : lableTitle,
					cls : 'page-heading'
				 }
		];

		this.callParent(arguments);
	}

});