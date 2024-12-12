/**
 * @class GCP.view.PositivePayIssuanceTitleView
 * @extends Ext.panel.Panel
 * @author Ashwini Pawar
 */
Ext.define('GCP.view.PositivePayIssuanceTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'positivePayIssuanceTitleView',
	requires : [],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var positivePayIssuanceToolBar = me.createPositivePayIssuanceToolBar();
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			width: '100%',
			defaults : {
				labelAlign : 'top'
			},
			items : [{
					xtype : 'label',
					text : getLabel('positivePayIssuance',
							'Positive Pay Issuance'),
					cls : 'page-heading',
					padding : '0 0 0 10'
				}, {
					xtype : 'toolbar',
					flex : 1,
					items : []
				},{
						xtype : 'label',
						flex : 19
				},{
					xtype : 'container',
					layout : 'hbox',
					defaults : {
						labelAlign : 'top',
						pack: 'end'
					},
					items : [{
						xtype : 'button',
						textAlign : 'right',
						itemId : 'downloadPdf',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf1c1@fontawesome',
						border : 0,
						margin : '0 0 0 0',
						width : 75,
						text : getLabel('reportIcon', 'Report'),
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('performExportAction', btn, opts);
						}
					}, {
						xtype : 'button',
						border : 0,
						textAlign : 'right',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf019@fontawesome',
						margin : '0 0 0 0',
						width : 75,
						text : getLabel('export', 'Export'),
						menuAlign : 'tr-br',
						menu : Ext.create('Ext.menu.Menu', {
									items : [ {
										text : getLabel('btnXLSText', 'XLS'),
										glyph : 'xf1c3@fontawesome',
										itemId : 'downloadXls',
										// hidden : isHidden('XLS'),
										// parent : this,
										handler : function(btn, opts) {
											me.fireEvent('performExportAction',
													btn, opts);
										}
									}, {
										text : getLabel('btnCSVText', 'CSV'),
										glyph : 'xf0f6@fontawesome',
										itemId : 'downloadCsv',
										// parent : this,
										// hidden : isHidden('CSVTSV'),
										handler : function(btn, opts) {
											me.fireEvent('performExportAction',
													btn, opts);
										}
									}, {
										text : getLabel('btnTSVText', 'TSV'),
										glyph : 'xf1c9@fontawesome',
										itemId : 'downloadTsv',
										// parent : this,
										// hidden : isHidden('CSVTSV'),
										handler : function(btn, opts) {
											me.fireEvent('performExportAction',
													btn, opts);
										}
									}, {
										text : getLabel('btnNACHAText', 'NACHA'),
										glyph : 'xf1c9@fontawesome',
										itemId : 'downloadNacha',
										// parent : this,
										// hidden : isHidden('CSVTSV'),
										disabled : true,
										handler : function(btn, opts) {
											me.fireEvent('performExportAction',
													btn, opts);
										}
									}, {
										text : getLabel('btnWithHeaderText',
												'With Header'),
										xtype : 'menucheckitem',
										itemId : 'withHeaderId',
										checked : 'true'
									}]
								})	
						}]
					}]
				}, positivePayIssuanceToolBar];
		this.callParent(arguments);
	},
	
	createPositivePayIssuanceToolBar : function() {
		var me = this;
		var hide=(strcanEdit=='false'?true:false);
		var toolBar = Ext.create('Ext.toolbar.Toolbar', {
			itemId : 'positivePayIssuanceToolBar',
			// margin : '0 0 1 2',
			// cls : 'xn-custom-toolbar',
			cls : 'ux_toolbar ux-toolbar-background',
			width : '100%',
			items : [{
						xtype : 'button',
						border : 0,
						text : getLabel('createNewIssuance',
								'Create New Issuance'),
						glyph : 'xf055@fontawesome',
						cls : 'xn-btn ux-button-s',
						parent : this,
						hidden : hide,
						handler : function(btn, opts) {
							me.fireEvent('createNewIssuanceEntry', btn, opts);
						}
					}, '-', {
						xtype : 'button',
						border : 0,
						text : getLabel('importIssuance', 'Import Issuance'),
						glyph : 'xf055@fontawesome',
						cls : 'xn-btn ux-button-s',
						hidden : hide,
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('importIssuance', btn, opts);
						}
					}]
		});
		return toolBar;
	}
});
