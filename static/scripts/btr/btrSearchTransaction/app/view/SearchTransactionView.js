Ext.define('GCP.view.SearchTransactionView', {
			extend : 'Ext.panel.Panel',
			xtype : 'searchTransactionView',
			requires : ['Ext.panel.Panel', 'Ext.container.Container',
					'Ext.Img', 'Ext.form.Label', 'Ext.button.Button',
					'Ext.form.field.Text',
					'GCP.view.SearchTransactionFilterView',
					'GCP.view.SearchTransactionFilterSummaryView'],
			autoHeight : true,
			width : '100%',
			initComponent : function() {
				var me = this;
				me.items = [{
					xtype : 'panel',
					layout : 'hbox',
					baseCls : 'page-heading-bottom-border',
					items : [{
						xtype : 'label',
						text : getLabel('txnsearchtemplate',
								'Transaction Search Template'),
						cls : 'page-heading'
					}, {
						xtype : 'label',
						flex : 13
					}, {
						xtype : 'button',
						border : 0,
						text : getLabel('report', 'Report'),
						iconAlign : 'left',
						width : 58,
						textAlign : 'right',
						icon : 'static/images/icons/icon_report.png',
						cls : 'cursor_pointer xn-saved-filter-btnmenu',
						itemId : 'downloadReport',
						parent : this,
						handler : function(btn, opts) {
							/*this.parent.fireEvent('performReportAction', btn,
									opts);*/
						}
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						itemId : 'spacerIcon',
						height : 18,
						margin : '0 5 0 5'
					}, {
						cls : 'black inline_block button-icon icon-button-pdf',
						itemId : 'exportBtnIcon',
						flex : 0,
						padding : '20 14 0 0'
					}, {
						xtype : 'button',
						border : 0,
						text : getLabel('export', 'Export'),
						itemId : 'exportBtn',
						cls : 'cursor_pointer xn-saved-filter-btnmenu w3',
						menu : Ext.create('Ext.menu.Menu', {
									itemId : 'exportMenu',
									items : [{
										text : getLabel('bai2BtnText', 'BAl2'),
										iconCls : 'icon-button icon-download',
										itemId : 'downloadBAl2',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											/*this.parent.fireEvent(
													'performReportAction', btn,
													opts);*/
										}
									}, {
										text : getLabel('xlsBtnText', 'XLS'),
										iconCls : 'icon-button icon-download',
										itemId : 'downloadXls',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
										/*	this.parent.fireEvent(
													'performReportAction', btn,
													opts);*/
										}
									}, {
										text : getLabel('csvBtnText', 'CSV'),
										iconCls : 'icon-button icon-download',
										itemId : 'downloadCsv',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											/*this.parent.fireEvent(
													'performReportAction', btn,
													opts);*/
										}
									}, {
										text : getLabel('tsvBtnText', 'TSV'),
										iconCls : 'icon-button icon-download',
										itemId : 'downloadTsv',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											/*this.parent.fireEvent(
													'performReportAction', btn,
													opts);*/
										}
									}, {
										text : getLabel('mt940BtnText', 'MT940'),
										iconCls : 'icon-button icon-download',
										itemId : 'downloadMt940',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											/*this.parent.fireEvent(
													'performReportAction', btn,
													opts);*/
										}
									}, {
										text : getLabel('qbookBtnText',
												'Quick Book'),
										iconCls : 'icon-button icon-download',
										itemId : 'downloadqbook',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											/*this.parent.fireEvent(
													'performReportAction', btn,
													opts);*/
										}
									}, {
										text : getLabel('withHeaderBtnText',
												'With Header'),
										xtype : 'menucheckitem',
										itemId : 'withHeaderId',
										checked : 'true'
									}]
								})
					}]
				}, {
					xtype : 'searchTransactionFilterView',
					margin : '5 0 5 0'
				}, {
					xtype : 'searchTransactionFilterSummaryView',
					margin : '5 0 5 0'
				}, {
					xtype : 'panel',
					layout : 'hbox',
					padding : '0 0 5 0',
					items : [{
								xtype : 'label',
								flex : 1
							}, {
								xtype : 'container',
								layout : 'hbox',
								items : [{
									xtype : 'button',
									border : 0,
									itemId : 'SearchTxnIdBal',
									text : getLabel('searchOnPage',
											'Search on Page'),
									cls : 'xn-custom-button cursor_pointer',
									margin : '5 0 0 10',
									menu : Ext.create('Ext.menu.Menu', {
												items : [{
													xtype : 'radiogroup',
													itemId : 'matchCriteriaBal',
													vertical : true,
													columns : 1,
													items : [{
														boxLabel : getLabel(
																'exactMatch',
																'Exact Match'),
														name : 'searchTxnBal',
														inputValue : 'exactMatchBal'
													}, {
														boxLabel : getLabel(
																'anyMatch',
																'Any Match'),
														name : 'searchTxnBal',
														inputValue : 'anyMatchBal',
														checked : true
													}]

												}]
											})
								}, {
									xtype : 'textfield',
									itemId : 'searchTxnTextFieldBal',
									cls : 'w10',
									padding : '2 0 0 5'

								}]
							}]
				}, {
					xtype : 'panel',
					cls : 'xn-panel',
					items : [{
						xtype : 'panel',
						width : '100%',
						cls : 'gradiant_back',
						margin : '0 0 0 0',
						padding : '5 0 5 15',
						items : [{
									xtype : 'label',
									text : getLabel('transactions',
											'Transactions'),
									cls : 'font_bold'
								}]
					}, {
						xtype : 'container',
						itemId : 'gridPanel',
						items : []
					}]

				}];

				me.on('resize', function() {
							me.doLayout();
						});
				me.callParent(arguments);
			}

		});