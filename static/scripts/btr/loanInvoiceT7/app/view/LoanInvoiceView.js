/**
 * @class GCP.view.LoanInvoiceView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define('GCP.view.LoanInvoiceView', {
	extend : 'Ext.panel.Panel',
	xtype : 'loanInvoiceNewViewType',
	requires : ['GCP.view.LoanInvoiceGridView'],
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'panel',		
			layout : {
				type : 'hbox'
			}
		/*	items : [
			{
				xtype : 'container',
				flex : 50,
				cls : 'ux_largepaddingtb ux_no-border',
				layout : 'hbox',
				align : 'left',
				items : [

				{
					xtype : 'label',
					text : getLabel('loantxnSummary', 'Transaction Summary'),
					//itemId : 'pageTitle',
					cls : 'page-heading thePointer page-heading-inactive',
					padding : '0 0 0 10',
					listeners : {
						'render' : function(lbl) {
							lbl.getEl().on('click', function() {
								goToPage('loanCenterNew.srvc', 'frmMain', 'P',
										'N');
							});
						}
					}
				}, {
					xtype : 'label',
					text : ' | ',
					cls : 'page-heading ',
					margin : '0 10 0 10',
					hidden : false
				}, {
					xtype : 'label',
					text : getLabel('loanInvoices', 'Invoices'),
					cls : 'page-heading',
					padding : '0 0 0 10',
					listeners : {
						'render' : function(lbl) {
							lbl.getEl().on('click', function() {
								goToPage('loanInvoiceCenter.srvc', 'frmMain',
										'P', 'N');
							});
						}
					}
				}, {
					xtype : 'label',
					text : ' | ',
					cls : 'page-heading ',
					margin : '0 10 0 10',
					hidden : false
				}, {
					xtype : 'label',
					text : getLabel('loanRecurringPayment', 'Recurring Payment'),
					cls : 'page-heading thePointer page-heading-inactive',
					padding : '0 0 0 10',
					listeners : {
						'render' : function(lbl) {
							lbl.getEl().on('click', function() {
								goToPage('loanCenterSiNew.srvc', 'frmMain',
										'P', 'N');
							});
						}
					}
				}]
			}, 
			{
				xtype : 'panel',
				cls : 'ux_largepaddingtb ux_no-border',
				layout : {
					type : 'hbox'
				},
				items : [{
							xtype : 'label',
							flex : 19
						}, {
							xtype : 'container',
							layout : 'hbox',
							align : 'rightFloating',
							defaults : {
								labelAlign : 'top'
							},
							items : [{
								xtype : 'button',
								border : 0,
								text : getLabel('lbl.loanInvoices.report',
										'Report'),
								iconAlign : 'left',
								width : 80,
								textAlign : 'right',
								cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
								glyph : 'xf1c1@fontawesome',
								itemId : 'loanInvoiceDownloadPdf',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent(
											'performReportAction', btn, opts);
								}
							}, {
								xtype : 'button',
								border : 0,
								text : getLabel('lbl.loanCenter.export',
										'Export'),
								cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
								glyph : 'xf019@fontawesome',
								margin : '0 0 0 0',
								width : 75,
								menu : Ext.create('Ext.menu.Menu', {
											items : [{
												text : getLabel('xlsBtnText',
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
												text : getLabel('csvBtnText',
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
												text : getLabel('tsvBtnText',
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
						}]
			}]*/
		}, /*{
			xtype : 'loanInvoiceTitleViewType',
			width : '100%'
		},*/ /*{
			xtype : 'loanInvoiceNewFilterViewType',
			width : '100%',
			title : '<span id=imgFilterInfoGridView>'+getLabel('filetrBy', 'Filter By')+'</sapn>',
			collapsible : true,
			collapsed : filterRibbonCollapsed
				//+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},*/
			/*{
			xtype : 'loanInvoiceNewGridInformationViewType'
		}, */
		{
			xtype : 'loanInvoiceNewGridViewType',
			width : '100%',
			parent : me
		}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});
