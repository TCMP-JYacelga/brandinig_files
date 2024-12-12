Ext.define( 'GCP.view.BVNodeGrossView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bVNodeGrossViewType',
	requires :
	[
		'GCP.view.BVNodeGrossAccruedGridView', 'GCP.view.BVNodeGrossSettledGridView', 'GCP.view.BVNodeGrossApportionmentGridView',
		'GCP.view.BVNodeGrossAccruedAccountGridView', 'GCP.view.BVNodeGrossSettledAccountGridView'
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
				cls : 'ft-margin-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeGrossAccruedGridViewType',
								margin : '0 0 10 0',
								hidden : accruedFlag == true ? true : false,
								enableColumnHide : false,
								parent : me,
								minHeight : 100,
								//height : 200,
								maxHeight : 300
							}
				]
			},{
				xtype : 'panel',
				title : 'Bank Interest Accrued-Account',
				hidden : viewName == 'INTEREST_ACCRUED' ? false : true,
				autoHeight: true,
				cls : 'ft-margin-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeGrossAccruedAccountGridViewType',
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
				cls : 'ft-margin-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeGrossSettledGridViewType',
								margin : '0 0 10 0',
								enableColumnHide : false,
								parent : me,
								minHeight : 100,
								maxHeight : 280
					}
				]
			},{
				xtype : 'panel',
				title : 'Bank Interest Settled-Account',
				hidden : viewName == 'INTEREST_SETTLED' ? false : true,
				autoHeight: true,
				cls : 'ft-margin-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeGrossSettledAccountGridViewType',
								margin : '0 0 10 0',
								enableColumnHide : false,
								parent : me,
								minHeight : 100,
								maxHeight : 280
					}
				]
			},
			{
				xtype : 'panel',
				hidden : viewName == 'APPORTIONMENT' ? false : true,
				title : 'Apportionment',
				autoHeight: true,
				cls : 'ft-margin-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeGrossApportionmentGridViewType',
								margin : '0 0 10 0',
								parent : me,
								enableColumnHide : false,
								minHeight : 100,
								//height : 200,
								maxHeight : 300
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
