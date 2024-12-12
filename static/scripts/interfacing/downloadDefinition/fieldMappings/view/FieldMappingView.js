Ext.define( 'GCP.view.FieldMappingView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'fieldMappingView',
	requires :
	[
		'GCP.view.FieldMappingEditGrid', 'GCP.view.FieldMappingInformation', 'GCP.view.FieldMappingBandDetails'
	],
	width : '100%',
	//autoHeight : true,
	//minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'fieldMappingEditGrid',
				width : '100%',
				parent : me
			}

		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
