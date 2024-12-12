/**
 * @class GCP.view.ReportCenterView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define( 'GCP.view.ReportCenterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'reportCenterView',
	requires :
	[
		'GCP.view.ReportCenterTitleView', 'GCP.view.ReportCenterGridView', 'GCP.view.ReportCenterGridInformationView',
		'GCP.view.ReportCenterFilterView'
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
				xtype : 'reportCenterTitleView',
				width : '100%'
			},
			{
				xtype : 'panel',
				width : '100%',
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
						cls : 'x-custom-header-font',
						text : getLabel( 'createNew', 'Create New : ' ),
						hidden : true,
						id : 'createCustReportLbl'
					},
					{
						xtype : 'button',
						itemId : 'myReportId',
						name : 'myReport',
						hidden : true,
						margin : '7 0 5 0',
						text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">' + getLabel( 'myReport', 'Custom Report' ) + '</span>',
						cls : 'xn-account-filter-btnmenu',
						id : 'custReport'
					}
				]
			},

			{
				xtype : 'reportCenterFilterView',
				width : '100%',
				margin : '0 0 10 0',
				title : getLabel( 'filterBy', 'Filter By: ' )
					+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},
			{
				xtype : 'reportCenterGridView',
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
