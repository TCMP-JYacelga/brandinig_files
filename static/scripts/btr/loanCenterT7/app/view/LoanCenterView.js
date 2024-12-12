/**
 * @class GCP.view.LoanCenterView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define('GCP.view.LoanCenterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'loanCenterViewType',
	requires : ['GCP.view.LoanCenterTitleView', 'GCP.view.LoanCenterGridView',
			'GCP.view.LoanCenterGridInformationView',
			'GCP.view.LoanCenterFilterView'],
	
	autoHeight : true,
	initComponent : function() {
		var me = this;
		if(!isHidden('isSiViewEnabled'))
		{
			var hideFlag = false
		}
		else
		{
			var hideFlag = true;
		}
		me.items = [ 
		/*{
			xtype : 'panel',
			cls : 'ux_no-border',
			defaultAlign : 'right',
			defaults : {
				style : {
					padding : '0 0 0 0'
				}
			},
			layout : {
				type : 'hbox'
			},
			items : [
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
					cls : 'page-heading',
					padding : '0 0 0 10',
					listeners : {
						'render' : function(lbl) {
							lbl.getEl().on('click', function() {
								goToPage('loanCenterNew.srvc', 'frmMain', 'P',
										'N');
							});
							if (isSiTabSelected === 'Y') {
								this.removeCls('page-heading');
								this
										.addCls('page-heading thePointer page-heading-inactive');
							}
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
					cls : 'page-heading thePointer page-heading-inactive',
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
					hidden : hideFlag
				}, {
					xtype : 'label',
					text : getLabel('loanRecurringPayment', 'Recurring Payment'),
					cls : 'page-heading thePointer page-heading-inactive',
					padding : '0 0 0 10',
					hidden : hideFlag,
					listeners : {
						'render' : function(lbl) {
							lbl.getEl().on('click', function() {
								goToPage('loanCenterSiNew.srvc', 'frmMain',
										'P', 'N');
							});
							if (isSiTabSelected === 'Y') {
								this
										.removeCls('page-heading thePointer page-heading-inactive');
								this.addCls('page-heading');
							}
						}
					}
				}]
			}, {
				xtype : 'panel',
				cls : 'ux_largepaddingtb ux_no-border',
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
								text : getLabel('lbl.loanCenter.report',
										'Report'),
								iconAlign : 'left',
								width : 80,
								textAlign : 'right',
								cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
								glyph : 'xf1c1@fontawesome',
								itemId : 'loanCenterDownloadPdf',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent(
											'performReportAction', btn, opts);
								}
							}, {
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 18,
								cls : 'ux_hide-image'
							}, {
								cls : 'black inline_block button-icon icon-button-pdf ux_hide-image',
								flex : 0
							}, {
								xtype : 'button',
								border : 0,
								text : getLabel('lbl.loanCenter.export',
										'Export'),
								cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
								glyph : 'xf019@fontawesome',
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
			}]
		}, */
		/*{
			xtype : 'loanCenterTitleViewType',
			width : '100%'
		}, {
			xtype : 'container',
			padding : '12 0 12 0',
			layout : 'hbox',
			cls : 'ux_panel-background ux_extralargepaddingtb',
			width : '100%',
			items : [{
						xtype : 'button',
						itemId : 'loanRepaymentRequestItemId',
						parent : this,
						//width :80,
						text : '<span class="ux_margin-left20">'
								+ getLabel('lblPaydown', 'Paydown') + '</span>',
						glyph : 'xf055@fontawesome',
						cls : 'xn-btn ux-button-s ux_button-padding',
						hidden : isSiTabSelected == 'Y'
								? true
								: isHidden('paydownFeature'),
						//hidden : false,
						handler : function() {
							this.fireEvent('addLoanRepaymentEvent', this);
						}
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						hidden : isSiTabSelected == 'Y' ? true : false,
						height : 16,
						cls : 'ux_hide-image ux_button-padding'
					}, {
						xtype : 'label',
						html : "&nbsp; &nbsp; &nbsp;"
					}, {
						xtype : 'button',
						itemId : 'loanDrawdownRequestItemId',
						parent : this,
						//width :80,
						text : '<span class="ux_margin-left20">'
								+ getLabel('lblAdvance', 'Advance') + '</span>',
						glyph : 'xf055@fontawesome',
						cls : 'xn-btn ux-button-s ux_button-padding',
						hidden : isSiTabSelected == 'Y'
								? true
								: isHidden('drawdownFeature'),
						//hidden : false,
						handler : function() {
							this.fireEvent('addLoanDrawdownEvent', this);
						}
					}]
		},*/ 
			/*{
			xtype : 'loanCenterFilterViewType',
			width : '100%',
			margin : '0 0 12 0',
			collapsible : true,
			collapsed : filterPanelCollapsed,
			title : '<span id=imgFilterInfoGridView>'+getLabel('filterBy', 'Filter By ')+'</span>'
				//+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},*/
		 /*{
			xtype : 'loanCenterGridInformationViewType',
			margin : '0 0 12 0'
		},*/ {
			xtype : 'loanCenterGridViewType',		
			parent : me
		}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});
