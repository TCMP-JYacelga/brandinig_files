Ext.define('GCP.view.InterfaceMapSummaryTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interfaceMapSummaryTitleView',
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
			lableTitle = getLabel('uploadBankdefinition', 'Bank Interface Center');
		}
		else
		{
			lableTitle = getLabel('uploadClientdefinition', 'Customer Interface Center');
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