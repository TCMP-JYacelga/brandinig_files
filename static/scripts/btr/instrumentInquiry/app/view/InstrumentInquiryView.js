Ext.define( 'GCP.view.InstrumentInquiryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'instrumentInquiryView',
	requires :
	[
		'GCP.view.InstrumentInquiryGridView', 'GCP.view.InstrumentInquiryInformation', 'GCP.view.InstrumentInquiryFilterView'
	],
	width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				cls : 'ux_panel-background ux_largepaddingtb',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'label',
						text :getLabel( 'lblinstrumentinquiry', 'Deposit Ticket View'),
						cls : 'page-heading thePointer page-heading-inactive',
						parent : this,
						listeners : {
						element : 'el',
						click : function() {
							GCP.getApplication().fireEvent('handleCancelButtonAction');
						}
						}
						
					},
					{
					xtype : 'label',
					html : '&nbsp;>&nbsp;',
					cls : 'page-heading',
					padding : '0 0 0 10'
				}, {
					xtype : 'label',
					text : getLabel('lblItemDetails', 'Item Details'),
					itemId : 'txnTypeTitle',
					cls : 'page-heading',
					padding : '0 0 0 10'
				},
					{
						xtype : 'label',
						flex : 19
					},
					{
						xtype : 'button',
						border : 0,
						text : getLabel( 'lbl.loanCenter.report', 'Report' ),
						iconAlign : 'left',
						width : 80,
						textAlign : 'right',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf1c1@fontawesome',
						itemId : 'loanCenterDownloadPdf',
						parent : this,
						handler : function( btn, opts )
						{
							this.parent.fireEvent( 'performReportAction', btn, opts );
						}
					},
					{
						xtype : 'button',
						border : 0,
						text : getLabel( 'lbl.loanCenter.export', 'Export' ),
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf019@fontawesome',
						width: 75,
						menu : Ext.create( 'Ext.menu.Menu',
						{
							items :
							[
								{
									text : getLabel( 'xlsBtnText', 'XLS' ),
									glyph : 'xf1c3@fontawesome',
									itemId : 'downloadXls',
									parent : this,
									handler : function( btn, opts )
									{
										this.parent.fireEvent( 'performReportAction', btn, opts );
									}
								},
								{
									text : getLabel( 'csvBtnText', 'CSV' ),
									glyph : 'xf0f6@fontawesome',
									itemId : 'downloadCsv',
									parent : this,
									handler : function( btn, opts )
									{
										this.parent.fireEvent( 'performReportAction', btn, opts );
									}
								},
								{
									text : getLabel( 'tsvBtnText', 'TSV' ),
									glyph : 'xf1c9@fontawesome',
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
					}]
			},
			{
				xtype : 'instrumentInquiryFilterView',
				width : '100%',
				title : '<span id="imgFilterInfoGridView">'+ getLabel('filterBy', 'Filter By: ')+'</span>'

			},
			{
				xtype : 'instrumentInquiryInformation'
			},
			{
				xtype : 'instrumentInquiryGridView',
				width : '100%',
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
