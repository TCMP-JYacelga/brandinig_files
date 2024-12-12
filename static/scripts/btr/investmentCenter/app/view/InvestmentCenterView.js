/**
 * @class GCP.view.PrfMstView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define( 'GCP.view.InvestmentCenterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'investmentCenterView',
	requires :
	[
		'GCP.view.InvestmentCenterGridView', 'GCP.view.InvestmentCenterGridInformationView',
		'GCP.view.InvestmentCenterFilterView', 'GCP.view.AddNewInvestmentPopup', 'GCP.view.AddNewRedemptionPopup'
	],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	cls : 'ux_panel-background',
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				cls : 'ux_largepaddingtb ux_no-border',
				defaults :
				{
					style :
					{
						padding : '0 0 0 0'
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
						text : 'Investment Center',
						cls : 'page-heading',
						padding : '0 0 0 10'
					},
					{
						xtype : 'label',
						flex : 19
					},
					{
						xtype : 'image',
						src : 'static/images/icons/icon_report.png',
						height : 14,
						cls : 'ux_hide-image',
						margin : '2 0 0 0'
					},
					{
						xtype : 'button',
						itemId : 'downloadPdf',
						margin : '0 0 0 0',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf1c1@fontawesome',
						border : 0,
						width : 80,
						text : getLabel( 'reports', 'Report' ),
						parent : this,
						handler : function( btn, opts )
						{
							this.parent.fireEvent( 'performReportAction', btn, opts );
						}
					},
					{
						cls : 'extralargeleftpadding black inline_block button-icon icon-button-pdf ux_hide-image',
						flex : 0
					},
					{
						xtype : 'button',
						border : 0,
						text : getLabel( 'export', 'Export' ),
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf019@fontawesome',
						width: 75,
						menu : Ext.create( 'Ext.menu.Menu',
						{
							items :
							[
								{
									text : getLabel( 'btnXLSText', 'XLS' ),
									glyph : 'xf1c3@fontawesome',
									itemId : 'downloadXls',
									parent : this,
									handler : function( btn, opts )
									{
										this.parent.fireEvent( 'performReportAction', btn, opts );
									}
								},
								{
									text : getLabel( 'btnCSVText', 'CSV' ),
									glyph : 'xf0f6@fontawesome',
									itemId : 'downloadCsv',
									parent : this,
									handler : function( btn, opts )
									{
										this.parent.fireEvent( 'performReportAction', btn, opts );
									}
								},
								{
									text : getLabel( 'btnTSVText', 'TSV' ),
									glyph : 'xf1c9@fontawesome',
									itemId : 'downloadTsv',
									parent : this,
									handler : function( btn, opts )
									{
										this.parent.fireEvent( 'performReportAction', btn, opts );
									}
								},
								{
									text : getLabel( 'btnWithHeaderText', 'With Header' ),
									xtype : 'menucheckitem',
									itemId : 'withHeaderId',
									checked : 'true'
								}
							]
						} )
					}
				]
			},
			{
				xtype : 'panel',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'label',
						//margin : '7 0 3 0',
						cls : 'ux_hide-image',
						text : getLabel( 'createNew', 'Create New : ' )
					},
					{
						xtype : 'button',
						itemId : 'investmentRequestId',
						name : 'alert',
						margin : '7 0 5 0',
						text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">' + getLabel( 'investmentRequest', 'Investment Request' )
							+ '</span>',
						cls : 'xn-account-filter-btnmenu',
					    hidden : isHidden('Invest')

					},
					{
						xtype : 'button',
						itemId : 'redemptionRequestId',
						name : 'alert',
						margin : '7 0 5 0',
						text : '<span class="button_underline thePoniter ux_font-size14-normal underlined">' + getLabel( 'redemmtionRequest', 'Redemption Request' )
							+ '</span>',
						cls : 'xn-account-filter-btnmenu',
						hidden : isHidden('Redeem')

					}
				]
			},
			{
				xtype : 'investmentCenterFilterView',
				width : '100%',
				margin : '12 0 0 0',
				title : getLabel( 'filterBy', 'Filter By: ' )
					+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},
			{
				xtype : 'investmentCenterGridInformationView',
				margin : '12 0 0 0'
			},
			{
				xtype : 'investmentCenterGridView',
				cls : 'ux_panel-transparent-background',
				width : '100%',
				margin : '12 0 0 0',
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
