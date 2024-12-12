/**
 * @class GCP.view.PrfMstView
 * @extends Ext.panel.Panel
 * @author Ashwini Pawar
 */
Ext.define('GCP.view.DepositInquiryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'depositInquiryView',
	requires : ['GCP.view.DepositInquiryGridView', 'GCP.view.DepositInquiryInformation','GCP.view.DepositInquiryFilterView'],
	width : 'auto',
	autoHeight : true,
	cls : 'ux_panel-background',
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'panel',
					width : '100%',
					cls : 'ux_largepaddingtb',
					defaults : {
						style : {
							padding : '0 0 0 0'
						}
					},
					layout : {
						type : 'hbox'
					},
					items : [{
								xtype : 'label',
								text : getLabel('lbldepositinquiry', 'Deposit Inquiry'),
								cls : 'page-heading'
								//padding : '0 0 0 10'
							},							
							{
								xtype : 'label',
								flex : 19
							},
							{
								xtype : 'button',
								border : 0,
								margin : '0 0 0 0',
								text : getLabel( 'lbl.loanCenter.report', 'Report' ),
								iconAlign : 'left',
								width: 80,
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
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 18,
								margin : '0 5 0 0',
								cls : 'ux_hide-image'
							},
							{
								cls : 'black inline_block button-icon icon-button-pdf ux_hide-image',
								flex : 0,
								padding : '20 14 0 0'
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
					xtype : 'depositInquiryFilterView',
					width : 'auto',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By: '),
					collapsible : true,
					collapsed: filterPanelCollapsed

				},
				{
					xtype : 'depositInquiryInformation',
					//margin : '5 0 5 0'
					margin : '12 0 0 0'
				},
				{
					xtype : 'depositInquiryGridView',
					width : '100%',
					cls : 'ux_panel-transparent-background',
					margin : '12 0 0 0',
					parent : me
				}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});