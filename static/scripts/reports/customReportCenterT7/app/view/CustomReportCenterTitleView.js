/**
 * @class GCP.view.summary.CustomReportCenterTitleView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */

Ext.define( 'GCP.view.CustomReportCenterTitleView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'customReportCenterTitleViewType',
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
				cls : 'ux_panel-background',
				//width : '100%',
				items :
				[
					{
						//xtype : 'panel',//Commented as Button text was being overlapped.
						xtype : 'toolbar',
						itemId : 'uploadId',
						margin : '12 0 0 0',
						layout :
						{
							type : 'hbox'
						},
						items :
						[
							{
								xtype : 'button',
								itemId : 'btnCreateReport',
								name : 'createReport',
								//margin : '12 0 0 0',
								//text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">' + getLabel( 'uploadFile', 'Import File' ) + '</span>',
								//cls : 'xn-account-filter-btnmenu'
								border : 0,
								text : getLabel( 'createrep', 'Create Report' ),
								glyph : 'xf055@fontawesome',
								cls : 'ux_toolbar xn-btn ux-button-s'
							}
						]
					}
				]
			}
		]
		me.callParent( arguments );
	}

} );
