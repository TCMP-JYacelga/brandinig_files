Ext.define('GCP.view.FileUploadCenterTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'fileUploadCenterTitleView',
	requires : [],
	width : '100%',
	//baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 0'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [
		         {
					xtype : 'label',
					text : getLabel('fileUploadCenter', 'File Upload Center'),
					cls : 'page-heading',
					//margin : '0 0 10 0',
					padding : '0 0 0 10'
				 },
					{
						xtype : 'label',
						flex : 19
					},
					{
						xtype : 'button',
						border : 0,
						text : getLabel( 'lbl.loanCenter.report', 'Report' ),
						iconAlign : 'left',
						//margin : '0 10 0 0',
						margin : '0 10 0 2',
						//textAlign : 'right',
						//cls : 'ux_report',
						//glyph : 'xf1c1@fontawesome',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf1c1@fontawesome',
						width: 80,
						//icon : 'static/images/icons/icon_report.png',
						itemId : 'loanCenterDownloadPdf',
						parent : this,
						handler : function( btn, opts )
						{
							this.parent.fireEvent( 'performReportAction', btn, opts );
						}
					},
					/*{
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 18,
						margin : '0 5 0 0'
					},
					{
						cls : 'black inline_block button-icon icon-button-pdf',
						flex : 0,
						padding : '20 14 0 0'
					},*/
					{
						xtype : 'button',
						border : 0,
						text : getLabel( 'lbl.loanCenter.export', 'Export' ),
						padding : '0 3',
						//cls : 'cursor_pointer xn-saved-filter-btnmenu w4',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf019@fontawesome',
						width : 75,
						menu : Ext.create( 'Ext.menu.Menu',
						{
							items :
							[
								{
									text : getLabel( 'xlsBtnText', 'XLS' ),
									//iconCls : 'icon-button icon-download',
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
									//iconCls : 'icon-button icon-download',
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
									//iconCls : 'icon-button icon-download',
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
					}
		];

		this.callParent(arguments);
	}

});