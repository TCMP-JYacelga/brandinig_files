Ext.define( 'GCP.view.PassThruFileACHAdvancedFilterPopup',
{
	extend : 'Ext.window.Window',
	xtype : 'passThruFileACHAdvancedFilterPopupType',
	requires :
	[
		'GCP.view.PassThruFileACHCreateAdvFilter', 'GCP.view.PassThruFileACHSummaryAdvFilterGridView'
	],
	//width : 370,
	width : 480,
	height : 350,
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
			//width : 600,
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
							xtype : 'passThruFileACHSummaryAdvFilterGridViewType',
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
					/*
					 * { xtype:'pmtCreateNewAdvFilter', margin :'4 0 0 0',
					 * callerParent : me.parent }
					 */]
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
