/**
 * @class GCP.view.PaymentQueueTitleView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.PaymentQueueTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentQueueTitleView',
	requires : ['Ext.button.Button', 'Ext.toolbar.Toolbar', 'Ext.menu.Menu'],
	width : '100%',
	cls : 'ux_no-border ux_largepaddingtb ux_panel-background',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('payments', 'Payments'),
					cls : 'page-heading',
					padding : '0 0 0 10'
				}, {
					xtype : 'toolbar',
					flex : 1,
					cls: 'ux_panel-background',
					items : ['->',/*{
								xtype : 'button',
								border : 0,
								text : getLabel('lbl.loanCenter.report',
										'Report'),
								iconAlign : 'left',
								width : 80,
								textAlign : 'right',
								cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
								glyph : 'xf1c1@fontawesome',
								itemId : 'processingQReportPdf',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent(
											'performReportAction', btn, opts);
								}
							}*/, {
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 18,
								cls : 'ux_hide-image'
							}, {
								cls : 'black inline_block button-icon icon-button-pdf ux_hide-image',
								flex : 0
							} ,{
								xtype : 'button',
								border : 0,
								text : getLabel('export',
										'Export'),
								itemId : 'processingQDownloadPdf',
								cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
								glyph : 'xf019@fontawesome',
								width : 75,
								menu : Ext.create('Ext.menu.Menu', {
											items : [{
												text : getLabel('btnXLSText',
														'XLS'),
												glyph : 'xf1c3@fontawesome',
												itemId : 'downloadXls',
												parent : this,
												handler : function(btn, opts) {
													this.parent
															.fireEvent(
																	'performReportAction',
																	btn, opts);
												}
											}, {
												text : getLabel('btnCSVText',
														'CSV'),
												glyph : 'xf0f6@fontawesome',
												itemId : 'downloadCsv',
												parent : this,
												handler : function(btn, opts) {
													this.parent
															.fireEvent(
																	'performReportAction',
																	btn, opts);
												}
											}, {
												text : getLabel('btnTSVText',
														'TSV'),
												glyph : 'xf1c9@fontawesome',
												itemId : 'downloadTsv',
												parent : this,
												handler : function(btn, opts) {
													this.parent
															.fireEvent(
																	'performReportAction',
																	btn, opts);
												}
											}, {
												text : getLabel(
														'withHeaderBtnText',
														'With Header'),
												xtype : 'menucheckitem',
												itemId : 'withHeaderId',
												checked : 'true'
											}]
										})
								}]
				}

		];

		this.callParent(arguments);
	}

});