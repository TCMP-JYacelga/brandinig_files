Ext.define('GCP.view.MsgCenterAlertTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'msgCenterAlertTitleView',
	requires : [],
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

		this.items = [{
					xtype : 'label',
					text : getLabel('messageCenter', 'Message Center - Alerts'),
					cls : 'page-heading'
				},{
					xtype : 'label',
					flex : 19
				}, {
					xtype : 'image',
					src : 'static/images/icons/icon_report.png',
					height : 14,
					margin : '2 0 0 0'
				}, {
					xtype : 'button',
					itemId : 'downloadPdf',
					margin : '0 0 0 2',
					cls : 'cursor_pointer xn-account-filter-btnmenu ',
					border : 0,
					text : getLabel('reportIcon', 'Report')
				}, {
					xtype : 'image',
					src : 'static/images/icons/icon_spacer.gif',
					height : 18,
					padding : '0 3'
				}, {
					cls : 'extralargeleftpadding black inline_block button-icon icon-button-pdf',
					flex : 0,
					padding : '20 16 0 0'
				}, {
					xtype : 'button',
					border : 0,
					text : getLabel('export', 'Export'),
					cls : 'cursor_pointer xn-saved-filter-btnmenu w3',
					menu : Ext.create('Ext.menu.Menu', {
						items : [{
							text : getLabel('btnXLSText', 'XLS'),
							iconCls : 'icon-button icon-download',
							itemId : 'downloadXls',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('btnCSVText', 'CSV'),
							iconCls : 'icon-button icon-download',
							itemId : 'downloadCsv',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('btnTSVText', 'TSV'),
							iconCls : 'icon-button icon-download',
							itemId : 'downloadTsv',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('btnWithHeaderText', 'With Header'),
							xtype : 'menucheckitem',
							itemId : 'withHeaderId',
							checked : 'true'
						}]
					})
				}

		];

		this.callParent(arguments);
	}

});