Ext.define( 'GCP.view.BVNodeDRGrossView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bVNodeDRGrossViewType',
	requires :
	[
	 	'GCP.view.BVNodeDRGrossAccruedGridView', 'GCP.view.BVNodeDRGrossSettledGridView',
	 	'GCP.view.BVNodeDRGrossApportionmentGridView','GCP.view.BVNodeDRGrossAccruedAccountGridView', 'GCP.view.BVNodeDRGrossSettledAccountGridView'
	 
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
								xtype : 'bVNodeDRGrossAccruedGridViewType',
								margin : '0 0 10 0',
								enableColumnHide : false,
								hidden : accruedFlag == true ? true : false,
								minHeight : 100,
								maxHeight : 280,
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
								xtype : 'bVNodeDRGrossAccruedAccountGridViewType',
								minHeight : 100,
								maxHeight : 280,
								margin : '0 0 10 0',
								enableColumnHide : false,
								hidden : accruedFlag == true ? true : false,
								parent : me
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
								xtype : 'bVNodeDRGrossSettledGridViewType',
								minHeight : 100,
								maxHeight : 280,
								enableColumnHide : false,
								margin : '0 0 10 0',
								parent : me
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
								xtype : 'bVNodeDRGrossSettledAccountGridViewType',
								minHeight : 100,
								maxHeight : 280,
								enableColumnHide : false,
								margin : '0 0 10 0',
								parent : me
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
								xtype : 'bVNodeDRGrossApportionmentGridViewType',
								minHeight : 100,
								maxHeight : 280,
								enableColumnHide : false,
								margin : '0 0 10 0',
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
