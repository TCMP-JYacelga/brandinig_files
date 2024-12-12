Ext.define( 'GCP.view.PassThruFileACHBatchHeaderGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'passThruFileACHBatchHeaderGridType',
	padding : '12 0 12 0',
	componentCls : 'gradiant_back',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				collapsible : true,
				width : '100%',
				cls : 'xn-ribbon ux_border-bottom',
				title : getLabel( 'fileRecap', 'File Recap' ),
				itemId : 'passThruFileBatchHeaderViewItemId'
			}
		];
		this.callParent( arguments );
	}
} );
