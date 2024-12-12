/**
 * @class GCP.view.activity.AccountActivityTitleView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.tranSearchTiltleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'tranSearchTiltleView',
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
		me.items = [{
					xtype : 'label',
					text : getLabel('transactionSearch', 'Transaction Search'),
					itemId : 'txnTypeTitle',
					cls : 'page-heading',
					padding : '0 0 0 10'
				}, {
					xtype : 'toolbar',
					cls : 'ux_panel-background',
					flex : 1,
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
										text : getLabel('mt940BtnText', 'MT940'),
										iconCls : 'icon-button icon-download',
										itemId : 'downloadMt940',
										hidden : true,
										parent : this,
										handler : function(btn, opts) {
											this.parent.fireEvent(
													'performReportAction', btn,
													opts);
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
				}

		];
		me.on('beforerender', function(panel) {
					me.handleExportOptionByClientParamEnforcement(panel);
				});
		me.callParent(arguments);
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
										if (typeof summaryType != 'undefined') {
												if (summaryType === 'previousday') {
													if (menuBtn)
															menuBtn.hidden = false;
											}
										}
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
									default :
										break;
								}

							});
				}
			}
		}
	}

});