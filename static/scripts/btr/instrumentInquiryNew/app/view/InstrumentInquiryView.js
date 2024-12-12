Ext.define( 'GCP.view.InstrumentInquiryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'instrumentInquiryView',
	requires :['GCP.view.InstrumentInquiryGroupView'],
	width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'instrumentInquiryGroupView',
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
