/**
 * @class GCP.view.BankScheduleView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define( 'GCP.view.BankScheduleView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankScheduleView',
	requires :
	[
		'GCP.view.BankScheduleTitleView', 'GCP.view.BankScheduleGridView', 'GCP.view.BankScheduleGridInformationView',
		'GCP.view.BankScheduleFilterView'
	],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[

			{
				xtype : 'bankScheduleTitleView',
				width : '100%'
			},
			{
				xtype : 'panel',
				width : '100%',
				hidden : true,
				baseCls : 'page-heading-bottom-border',
				defaults :
				{
					style :
					{
						padding : '0 0 0 4px'
					}
				},
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'label',
						margin : '7 0 3 0',
						text : getLabel( 'createNew', 'Create New : ' )
					},
					{
						xtype : 'button',
						itemId : 'myBankInterfaceId',
						name : 'myReport',
						margin : '7 0 5 0',
						text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">' + getLabel( 'myReport', 'Bank Interface' )
							+ '</span>',
						cls : 'xn-account-filter-btnmenu'
					},
					{
						xtype : 'button',
						itemId : 'myReportRegistrationId',
						name : 'myInterface',
						margin : '7 0 5 0',
						text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">' + getLabel( 'myInterface', 'Report Registration' )
							+ '</span>',
						cls : 'xn-account-filter-btnmenu'
					}
				]
			},

			{
				xtype : 'bankScheduleFilterView',
				width : '100%',
				margin : '0 0 10 0',
				title : getLabel( 'filterBy', 'Filter By: ' )
					+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},
			{
				xtype : 'bankScheduleGridInformationView',
				margin : '5 0 5 0'
			},
			{
				xtype : 'bankScheduleGridView',
				width : '100%',
				margin : '3 0 10 0',
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
