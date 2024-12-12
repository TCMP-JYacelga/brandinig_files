Ext.define( 'GCP.view.BVNodeNetView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bVNodeNetViewType',
	requires :
	[
	 	'GCP.view.BVNodeNetAccruedGridView', 'GCP.view.BVNodeNetSettledGridView','Ext.util.Point',
	 	'GCP.view.BVNodeNetApportionmentGridView','GCP.view.BVNodeNetAccruedAccountGridView', 'GCP.view.BVNodeNetSettledAccountGridView'
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
								xtype : 'bVNodeNetAccruedGridViewType',
								enableColumnHide : false,
								minHeight : 100,
								maxHeight : 280,
								hidden : accruedFlag == true ? true : false,
								parent : me
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
								xtype : 'bVNodeNetAccruedAccountGridViewType',
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
				hidden : viewName == 'INTEREST_SETTLED' ? false : true,
				title : getLabel( 'lblBankIntSettled', 'Bank Interest Settled-Group' ), 
				autoHeight: true,
				cls : 'ft-margin-large-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeNetSettledGridViewType',
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
				hidden : viewName == 'INTEREST_SETTLED' ? false : true,
				title : getLabel( 'lblBankIntSettled', 'Bank Interest Settled-Account' ), 
				autoHeight: true,
				cls : 'ft-margin-large-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeNetSettledAccountGridViewType',
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
				title : getLabel( 'lblApportionment', 'Apportionment' ), 
				autoHeight: true,
				cls : 'ft-margin-large-t ft-grid-header',
				bodyCls: 'ft-grid-body',
				items :
				[
					{
								xtype : 'bVNodeNetApportionmentGridViewType',
								margin : '0 0 10 0',
								enableColumnHide : false,
								parent : me,
								minHeight : 100,
								maxHeight : 280
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
