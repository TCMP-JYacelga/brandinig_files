Ext.define( 'GCP.view.ClearedCheckInqAdvancedFilterPopup',
{
	extend : 'Ext.window.Window',
	xtype : 'clearedCheckInqAdvancedFilterPopup',
	requires :
	[
		'GCP.view.ClearedCheckInqCreateNewAdvFilter', 'GCP.view.ClearedCheckInqAdvFilterGridView'
	],
	width : 530,
	//height : 400,
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
			//height : 380,
			itemId : 'advancedFilterTab',
			items :
			[
				{
					title : getLabel( 'filters', 'Filters' ),
					itemId : 'FilterSetTab',
					items :
					[
						{
							xtype : 'clearedCheckInqAdvFilterGridView',
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
					 * { xtype:'pmtCreateNewAdvFilter', margin :'4 0
					 * 0 0', callerParent : me.parent }
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
