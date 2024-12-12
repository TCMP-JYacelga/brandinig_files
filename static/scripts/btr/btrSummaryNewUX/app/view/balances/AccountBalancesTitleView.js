/**
 * @class GCP.view.balances.AccountBalancesTitleView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.balances.AccountBalancesTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountBalancesTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button',
			'Ext.toolbar.Toolbar'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		var me = this;
		var strSummaryLbl = getLabel('intraday', 'Intraday');
		if (typeof summaryType != 'undefined') {
			if (summaryType === 'previousday') {
				strSummaryLbl = getLabel('prevDay', 'Previous Day');
			}
		}
		me.items = [{
					xtype : 'label',
					text : strSummaryLbl,
					itemId : 'pageTitle',
					cls : 'page-heading thePointer page-heading-inactive',
					padding : '0 0 0 10',
					listeners : {
						element : 'el',
						click : function() {
							GCP.getApplication().fireEvent('showSummary');
						}
					}
				}, {
					xtype : 'label',
					html : ' &nbsp;>&nbsp;',
					cls : 'page-heading',
					padding : '0 0 0 10'
				}, {
					xtype : 'label',
					text : getLabel('balances', 'Balances'),
					itemId : 'txnTypeTitle',
					cls : 'page-heading',
					padding : '0 0 0 10'
				}, {
					xtype : 'toolbar',
					flex : 1,
					cls: 'ux_panel-background',
					items : ['->', {
						xtype : 'button',
						margin : '0 10 0 2',
						border : 0,
						text : getLabel('report', 'Report'),
						iconAlign : 'left',
						width : 80,
						textAlign : 'right',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf1c1@fontawesome',
						itemId : 'downloadReport',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('performReportAction', btn,
									opts);
						}
					}, {
						xtype : 'button',
						border : 0,
						text : getLabel('export', 'Export'),
						itemId : 'exportBtn',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf019@fontawesome',
						width : 75,
						menu : Ext.create('Ext.menu.Menu', {
									itemId : 'exportMenu',
									items : [{
										text : getLabel('xlsBtnText', 'XLS'),
										glyph : 'xf1c3@fontawesome',
										itemId : 'downloadXls',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent(
													'performReportAction', btn,
													opts);
										}
									}, {
										text : getLabel('csvBtnText', 'CSV'),
										glyph : 'xf0f6@fontawesome',
										itemId : 'downloadCsv',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent(
													'performReportAction', btn,
													opts);
										}
									}, {
										text : getLabel('tsvBtnText', 'TSV'),
										glyph : 'xf1c9@fontawesome',
										itemId : 'downloadTsv',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent(
													'performReportAction', btn,
													opts);
										}
									}, {
										text : getLabel('qbookBtnText',
												'QuickBooks'),
										iconCls : 'icon-button icon-download',
										itemId : 'downloadqbook',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent(
													'performReportAction', btn,
													opts);
										}
									}, {
										text : getLabel('quickenBtnText',
												'Quicken'),
										iconCls : 'icon-button icon-download',
										itemId : 'downloadquicken',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent(
													'performReportAction', btn,
													opts);
										}
									},{
										text : getLabel('withHeaderBtnText',
												'With Header'),
										xtype : 'menucheckitem',
										itemId : 'withHeaderId',
										checked : 'true'
									}]
								})
					}]
				}

		];
		me.on('beforerender', function(panel) {
					me.handleExportOptionByClientParamEnforcement(panel);
				});
		this.callParent(arguments);
	},
	handleExportOptionByClientParamEnforcement : function(panel) {
		var me = this;
		me.hideShowDownloadReportBtn(panel);
		me.hideShowExportBtn(panel);
		me.hideShowExportOptions(panel);

	},
	hideShowDownloadReportBtn : function(panel) {
		var me = this, downloadReportBtn, blnFlag = false;
		downloadReportBtn = panel.down('button[itemId="downloadReport"]');
		if (typeof objClientParameters != 'undefined') {
			if (!Ext.isEmpty(objClientParameters)
					&& !Ext.isEmpty(objClientParameters.enableReport)) {
				blnFlag = objClientParameters.enableReport;
			}
			if (!Ext.isEmpty(downloadReportBtn))
				downloadReportBtn.hidden = !blnFlag;
		}
	},
	hideShowExportBtn : function(panel) {
		var me = this, exportBtn;
		exportBtn = panel.down('button[itemId="exportBtn"]');
		if (typeof objClientParameters != 'undefined') {
			if (!Ext.isEmpty(objClientParameters)
					&& !Ext.isEmpty(objClientParameters.exportList)) {
				if (!Ext.isEmpty(exportBtn))
					exportBtn.hidden = false;
			} else {
				if (!Ext.isEmpty(exportBtn))
					exportBtn.hidden = true;
			}
		}
	},
	hideShowExportOptions : function(panel) {
		var me = this, exportMenu, exportArr, menuBtn = null;
		exportMenu = panel.down('menu[itemId="exportMenu"]');
		if (typeof objClientParameters != 'undefined') {
			if (!Ext.isEmpty(objClientParameters)
					&& !Ext.isEmpty(objClientParameters.exportList)) {
				exportArr = objClientParameters.exportList;
				if (!Ext.isEmpty(exportArr) && !Ext.isEmpty(exportMenu)) {
					Ext.each(exportArr, function(exprtEl) {
								menuBtn = null;
								switch (exprtEl) {
									case 'XS' :
										menuBtn = exportMenu
												.down('[itemId="downloadXls"]');
										if (menuBtn)
											menuBtn.hidden = false;
										break;
									case 'CS' :
										menuBtn = exportMenu
												.down('[itemId="downloadCsv"]');
										if (menuBtn)
											menuBtn.hidden = false;
										menuBtn = exportMenu
												.down('[itemId="downloadTsv"]');
										if (menuBtn)
											menuBtn.hidden = false;
										break;
									case 'PF' :
										break;
									case 'MT' :
										menuBtn = exportMenu
												.down('[itemId="downloadMt940"]');
										if (menuBtn)
											menuBtn.hidden = false;
										break;
									case 'BA' :
										menuBtn = exportMenu
												.down('[itemId="downloadBAl2"]');
										if (menuBtn)
											menuBtn.hidden = false;
										break;
									case 'QCK' :
										menuBtn = exportMenu
												.down('[itemId="downloadqbook"]');
										if (menuBtn)
											menuBtn.hidden = false;
										break;
									case 'QCKN' :
										menuBtn = exportMenu
												.down('[itemId="downloadquicken"]');
										if (menuBtn)
											menuBtn.hidden = false;
										break;
									default :
										break;
								}

							});
				}
			}
		}
	},
	setPageTitle : function(strLabel) {
		var me = this;
		var lbl = me.down('label[itemId="pageTitle"]');
		if (lbl)
			lbl.setText(strLabel);
	}
});