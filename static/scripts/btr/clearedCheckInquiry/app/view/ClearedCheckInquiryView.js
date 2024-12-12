Ext.define( 'GCP.view.ClearedCheckInquiryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'clearedCheckInquiryView',
	requires :
	[
		'GCP.view.ClearedCheckInquiryGroupView'
	],
	width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'clearedCheckInquiryGroupView',
				width : 'auto',
				margin : '0 0 12 0'
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
