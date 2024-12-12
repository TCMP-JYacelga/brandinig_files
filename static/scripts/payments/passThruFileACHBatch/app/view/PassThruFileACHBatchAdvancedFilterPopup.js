Ext.define( 'GCP.view.PassThruFileACHBatchAdvancedFilterPopup',
{
	extend : 'Ext.window.Window',
	xtype : 'passThruFileACHBatchAdvancedFilterPopupType',
	requires :
	[
		'GCP.view.PassThruFileACHBatchCreateAdvFilter', 'GCP.view.PassThruFileACHBatchSumAdvFilterGridView'
	],
	//width : 550,
	//height : 460,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		var Advancedfiltertab = null;
		this.title = getLabel( 'btnAdvancedFilter', 'Advanced Filter' );

		Advancedfiltertab = Ext.create( 'Ext.tab.Panel',
		{
			width : 500,
			//height : 450,
			itemId : 'advancedFilterTab',
			items :
			[
				{
					title : getLabel( 'filters', 'Filters' ),
					itemId : 'FilterSetTab',
					items :
					[
						{
							xtype : 'passThruFileACHBatchSumAdvFilterGridViewType',
							callerParent : me.parent
						}
					]
				},
				{
					title : getLabel( 'createNewFilter', 'Create New Filter' ),
					itemId : 'filterDetailsTab',
					items :
					[
						me.filterPanel
					]
				}
			]
		} );

		me.items =
		[
			Advancedfiltertab
		];

		this.callParent( arguments );
	}
} );
