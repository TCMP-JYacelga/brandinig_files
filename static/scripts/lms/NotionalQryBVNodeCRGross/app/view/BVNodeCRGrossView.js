Ext.define( 'GCP.view.BVNodeCRGrossView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bVNodeCRGrossViewType',
	requires :
	[
		'GCP.view.BVNodeCRGrossAccruedGridView', 'GCP.view.BVNodeCRGrossApportionGridView',
		'GCP.view.BVNodeCRGrossSettledGridView','GCP.view.BVNodeCRGrossAccruedAccountGridView','GCP.view.BVNodeCRGrossSettledAccountGridView'
	],
	autoHeight : true,
	//minHeight : 400,
	initComponent : function()
	{
		var me = this;		
		me.items =
		[
			{
				xtype : 'panel',
				title : 'Bank Interest Accrued-Group',
				hidden : viewName == 'INTEREST_ACCRUED' ? false : true,
				autoHeight: true,
				cls : 'ft-margin-large-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeCRGrossAccruedGridViewType',
								margin : '0 0 10 0',
								enableColumnHide : false,
								hidden : accruedFlag == true ? true : false,
								parent : me,
								minHeight : 100,
								maxHeight : 280
					}
				]
			},
			{
				xtype : 'panel',
				title : 'Bank Interest Accrued-Account',
				hidden : viewName == 'INTEREST_ACCRUED' ? false : true,
				autoHeight: true,
				cls : 'ft-margin-large-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeCRGrossAccruedAccountGridViewType',
								margin : '0 0 10 0',
								enableColumnHide : false,
								hidden : accruedFlag == true ? true : false,
								parent : me,
								minHeight : 100,
								maxHeight : 280
					}
				]
			},
			{
				xtype : 'panel',
				title : 'Bank Interest Settled-Group',
				hidden : viewName == 'INTEREST_SETTLED' ? false : true,
				autoHeight: true,
				cls : 'ft-margin-large-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeCRGrossSettledGridViewType',
								margin : '0 0 10 0',
								enableColumnHide : false,
								minHeight : 100,
								maxHeight : 280,
								parent : me
					}
				]
			},
			{
				xtype : 'panel',
				title : 'Bank Interest Settled-Account',
				hidden : viewName == 'INTEREST_SETTLED' ? false : true,
				autoHeight: true,
				cls : 'ft-margin-large-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeCRGrossSettledAccountGridViewType',
								margin : '0 0 10 0',
								enableColumnHide : false,
								minHeight : 100,
								maxHeight : 280,
								parent : me
					}
				]
			},
			{
				xtype : 'panel',
				title : 'Apportionment',
				hidden : viewName == 'APPORTIONMENT' ? false : true,
				autoHeight: true,
				cls : 'ft-margin-large-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeCRGrossApportionGridViewType',
								margin : '0 0 10 0',
								enableColumnHide : false,
								minHeight : 100,
								maxHeight : 280,
								parent : me
					}
				]
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
