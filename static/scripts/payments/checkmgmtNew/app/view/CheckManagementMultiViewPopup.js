Ext.define( 'GCP.view.CheckManagementMultiViewPopup',
{
	extend : 'Ext.panel.Panel',
	requires :['Ext.ux.gcp.SmartGrid'],
	xtype : 'checkManagementMultiViewPopup',
	itemId : 'gridChkMgmtMultiResp',
	//width : 800,
	//autoHeight : true,
	//parent : null,
	//title : getLabel('lbltxninfo', 'Check Inquiry Response'),
	//title : getLabel('lbltxninfo', 'Stop Pay Response'),
	//modal : true,
	//closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.items =
		[{
		 	    xtype : 'hidden',
		 	    name: csrfTokenName,
		 	    value: tokenValue
		 	},{
			xtype: 'container',
			width: 'auto',
			layout: 'vbox',
			defaults: {
				labelAlign: 'top',
				labelSeparator: ''
			},
			items: [{
					xtype : 'panel',
					width : '100%',
					itemId : 'chkMgmtMultiRespGrid',
					items : []
				}				
				]
		}];
		this.callParent( arguments );
	}
} );
