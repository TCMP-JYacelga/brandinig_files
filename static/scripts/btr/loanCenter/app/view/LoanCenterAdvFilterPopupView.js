Ext.define( 'GCP.view.LoanCenterAdvFilterPopupView',
{
	extend : 'Ext.window.Window',
	width : 460,
	xtype : 'loanCenterAdvFilterPopupViewType',
	requires :
	[
		'GCP.view.LoanCenterAdvFilterCreateView', 'GCP.view.LoanCenterAdvFilterGridView'
	],
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
			itemId : 'advancedFilterTabItemId',
			items :
			[
				{
					title : getLabel( 'filters', 'Filters' ),
					itemId : 'filterSetTabItemId',
					items :
					[
						{
							xtype : 'loanCenterAdvFilterGridViewType',
							callerParent : me.parent
						}
					]
				},
				{
					title : getLabel( 'createNewFilter', 'Create New Filter' ),
					itemId : 'filterDetailsTabItemId',
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
