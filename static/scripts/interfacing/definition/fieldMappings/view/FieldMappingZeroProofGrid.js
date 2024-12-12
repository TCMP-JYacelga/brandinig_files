Ext.define( 'GCP.view.FieldMappingZeroProofGrid',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'fieldMappingZeroProofGridType',		
	parent : null,
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{				
				itemId : 'zeroProofGridViewItemId'				
			}
		];

		this.callParent( arguments );
	}

} );
