Ext.define( 'GCP.view.NotionalQryBVInterestView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'notionalQryBVInterestViewType',
	requires :
	[
	 	'GCP.view.NotionalQryBVIntAccruedGridView', 'GCP.view.NotionalQryBVIntSettledGridView',
	 	'GCP.view.NotionalQryBVIntApportionmentGridView'
	],
	
	
	autoHeight : true,
	minHeight : 400,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			
		 	{
				xtype : 'notionalQryBVIntAccruedGridViewType',
				autoHeight : true,
				minHeight : 50,
				//hidden : accruedFlag == true ? true : false,
				parent : me,
				margin : '0 0 10 0',
				border : '0 0 0 0'
			},
			{
				xtype : 'notionalQryBVIntSettledGridViewType',
				autoHeight : true,
				minHeight : 50,
				margin:'0 0 10 0',
				parent : me
			},
			{
				xtype : 'notionalQryBVIntApportionmentGridViewType',
				autoHeight : true,
				minHeight : 50,
				margin:'0 0 0 0',
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
