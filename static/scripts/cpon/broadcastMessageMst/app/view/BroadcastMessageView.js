Ext.define('GCP.view.BroadcastMessageView', {
	extend : 'Ext.container.Container',
	xtype : 'broadcastMessageView',
	requires : ['Ext.container.Container', 'GCP.view.BroadcastMessageTitleView',
			'GCP.view.BroadcastMessageFilterView', 'GCP.view.BroadcastMessageSummaryView', 'GCP.view.BroadcastMessageGridView'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'broadcastMessageTitleView',
					width : '100%'
				}, {
					xtype : 'toolbar',
					itemId : 'btnActionToolBar',
					cls : 'ux_extralargepadding-bottom ux_panel-background',
					items : [ 
							  {
								xtype : 'button',
								border : 0,
								itemId : 'btnCreateBroadcastMessage',
								text : '<span>' + getLabel('broadcastMsg','Broadcast Message') +'</span>',
								glyph : 'xf055@fontawesome',
								cls : 'xn-btn ux-button-s ux_button-padding cursor_pointer',
								parent : this
								//padding : '0 0 2 0'
					        },
					        {
								xtype : 'label',
								flex : 19
							}
					/*	Moved this part in BroadcastMessageTitleView.js
					 	{
								xtype : 'button',
								border : 0,
								text : getLabel( 'lbl.loanCenter.report', 'Report' ),
								iconAlign : 'left',
								width : 58,
								textAlign : 'right',
								icon : 'static/images/icons/icon_report.png',
								cls : 'cursor_pointer xn-saved-filter-btnmenu',
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
								margin : '0 5 0 0'
							},
							{
								cls : 'black inline_block button-icon icon-button-pdf',
								flex : 0,
								padding : '20 14 0 0'
							},
							{
								xtype : 'button',
								border : 0,
								text : getLabel( 'lbl.loanCenter.export', 'Export' ),
								cls : 'cursor_pointer xn-saved-filter-btnmenu w4',
								menu : Ext.create( 'Ext.menu.Menu',
								{
									items :
									[
										{
											text : getLabel( 'xlsBtnText', 'XLS' ),
											iconCls : 'icon-button icon-download',
											itemId : 'downloadXls',
											parent : this,
											handler : function( btn, opts )
											{
												this.parent.fireEvent( 'performReportAction', btn, opts );
											}
										},
										{
											text : getLabel( 'csvBtnText', 'CSV' ),
											iconCls : 'icon-button icon-download',
											itemId : 'downloadCsv',
											parent : this,
											handler : function( btn, opts )
											{
												this.parent.fireEvent( 'performReportAction', btn, opts );
											}
										},
										{
											text : getLabel( 'tsvBtnText', 'TSV' ),
											iconCls : 'icon-button icon-download',
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
							} */
							]
				}, {
					xtype : 'broadcastMessageFilterView',
					width : '100%',
					title : '<span id="imgFilterInfo">'+getLabel('filterBy', 'Filter By: ')+'</span>'
							//+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
				}, {
					xtype : 'broadcastMessageSummaryView',
					width : '100%',
					title : getLabel('msgSummary', 'Summary Information')
				}, {
					xtype : 'broadcastMessageGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});