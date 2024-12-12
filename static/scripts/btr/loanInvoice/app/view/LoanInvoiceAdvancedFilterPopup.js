Ext.define( 'GCP.view.LoanInvoiceAdvancedFilterPopup',
{
	extend : 'Ext.window.Window',
	xtype : 'loanInvoiceAdvancedFilterPopupType',
	requires :
	[
		'GCP.view.LoanInvoiceCreateAdvFilter', 'GCP.view.LoanInvoiceSummaryAdvFilterGridView'
	],
	width : 470,
	//height : 350,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		var Advancedfiltertab = null;

		this.title = getLabel( 'btnAdvancedFilter', 'Advance Filter' );

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
							xtype : 'loanInvoiceSummaryAdvFilterGridViewType',
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
