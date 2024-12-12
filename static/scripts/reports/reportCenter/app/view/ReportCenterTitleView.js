Ext.define( 'GCP.view.ReportCenterTitleView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'reportCenterTitleView',
	requires :
	[
		'Ext.form.Label', 'Ext.Img', 'Ext.button.Button'
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
	layout :
	{
		type : 'hbox'
	},
	initComponent : function()
	{

		this.items =
		[
			{
				xtype : 'label',
				text : 'Reports and Upload Center',
				cls : 'page-heading'
			},
			{
				xtype : 'label',
				flex : 19
			}/*,
			{
				xtype : 'button',
				border : 0,
				text : getLabel( 'report', 'Report' ),
				iconAlign : 'left',
				width : 58,
				textAlign : 'right',
				icon : 'static/images/icons/icon_report.png',
				cls : 'cursor_pointer xn-saved-filter-btnmenu',
				itemId : 'downloadPdf',
				parent : this,
				handler : function( btn, opts )
				{
					this.parent.fireEvent( 'performReportAction', btn, opts );
				}
			},
			{
				xtype : 'image',
				src : 'static/images/icons/icon_spacer.gif',
				height : 18,
				margin : '0 5 0 0'
			},
			{
				cls : 'black inline_block button-icon icon-button-pdf',
				flex : 0,
				padding : '20 14 0 0'
			},
			{
				xtype : 'button',
				border : 0,
				text : getLabel( 'export', 'Export' ),
				cls : 'cursor_pointer xn-saved-filter-btnmenu w4',
				menu : Ext.create( 'Ext.menu.Menu',
				{
					items :
					[
						{
							text : getLabel( 'xlsBtnText', 'XLS' ),
							iconCls : 'icon-button icon-download',
							itemId : 'downloadXls',
							parent : this,
							handler : function( btn, opts )
							{
								this.parent.fireEvent( 'performReportAction', btn, opts );
							}
						},
						{
							text : getLabel( 'csvBtnText', 'CSV' ),
							iconCls : 'icon-button icon-download',
							itemId : 'downloadCsv',
							parent : this,
							handler : function( btn, opts )
							{
								this.parent.fireEvent( 'performReportAction', btn, opts );
							}
						},
						{
							text : getLabel( 'tsvBtnText', 'TSV' ),
							iconCls : 'icon-button icon-download',
							itemId : 'downloadTsv',
							parent : this,
							handler : function( btn, opts )
							{
								this.parent.fireEvent( 'performReportAction', btn, opts );
							}
						},
						{
							text : getLabel( 'withHeaderBtnText', 'With Header' ),
							xtype : 'menucheckitem',
							itemId : 'withHeaderId',
							checked : 'true'
						}
					]
				} )
			}*/

		];
		this.callParent( arguments );
	}

} );
