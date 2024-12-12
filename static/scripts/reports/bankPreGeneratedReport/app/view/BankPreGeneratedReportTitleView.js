/**
 * @class GCP.view.summary.BankPreGeneratedReportTitleView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */

Ext.define( 'GCP.view.BankPreGeneratedReportTitleView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankPreGeneratedReportTitleViewType',
	requires :
	[
		'Ext.form.Label', 'Ext.Img', 'Ext.button.Button', 'Ext.toolbar.Toolbar'
	],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults :
	{
		style :
		{
			padding : '0 0 0 4px'
		}
	},

	initComponent : function()
	{
		var me = this;

		me.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				baseCls : 'page-heading-bottom-border',
				//padding : '10 0 10 10',
				cls : 'ux_no-border ux_panel-background',

				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'label',
						text : getLabel( 'titlePreGeneratedReport', 'PREGENERATED REPORTS & DOWNLOADS' ),
						itemId : 'pageTitle',
						cls : 'page-heading',
						padding : '0 0 0 10'
					//
					}
				]
			}
		]
		me.callParent( arguments );
	}

} );
