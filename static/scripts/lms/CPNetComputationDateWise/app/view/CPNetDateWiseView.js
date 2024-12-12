Ext.define( 'GCP.view.CPNetDateWiseView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'cpNetDateWiseViewType',
	requires :
	[
	 	'GCP.view.CPNetDetailGridView'
	],
	//width : '100%',
	autoHeight : true,
	minHeight : 400,
	initComponent : function()
	{
		var me = this;
		me.items =
		[

		 	{
				xtype : 'cpNetDetailGridViewType',
			//	autoHeight: true,
			//	minHeight : 50,
				parent : me
			},
			{
				xtype : 'cpNetBankInterestGridViewType',
			//	autoHeight: true,
			//	minHeight : 50,
				parent : me
			},
			{
				xtype : 'notionalTreeGridViewType',
			//	autoHeight: true,
			//	minHeight : 50,
				hidden : true,
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
