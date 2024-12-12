Ext.define('GCP.view.ManageAlertsView', {
	extend : 'Ext.container.Container',
	xtype : 'manageAlertsView',
	requires : ['Ext.container.Container', 'GCP.view.ManageAlertTitleView',
			'GCP.view.ManageAlertsFilterView', 'GCP.view.ManageAlertsGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		var alertInitiationToolBar = me.createAlertInitiationToolBar();
		me.items = [{
						xtype : 'manageAlertTitleView',
						width : '100%',
						cls : 'ux_no-border ux_panel-background'
					}, alertInitiationToolBar,    
		        {
					xtype : 'manageAlertsFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By ')
				}, {
					xtype : 'manageAlertsGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	createAlertInitiationToolBar : function() {
		var me = this;
		var toolBar = Ext.create('Ext.toolbar.Toolbar', {
					itemId : 'initAlertActionToolBar',
					padding : '12 0 12 0',
					cls : 'ux_toolbar ux-toolbar-background',
					items : [ {
						xtype : 'button',
						border : 0,
						text : getLabel('createNewAlert',
								'Alert'),
						cls : 'xn-btn ux-button-s',
						glyph : 'xf055@fontawesome',
						parent : this,
						padding : '4 0 2 0',
						hidden : true,
						itemId : 'btnCreateNewAlert'
					}
					//***Code is moved to manageAlertTitleView***
					/*,'->',	{
							xtype : 'button',
							border : 0,
							text : getLabel( 'lbl.loanCenter.report', 'Report' ),
							margin : '0 10 0 2',
							textAlign : 'right',
							itemId : 'downloadPdf',
							cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
							glyph : 'xf1c1@fontawesome',
							width: 80,
							itemId : 'loanCenterDownloadPdf',
							parent : this,
							handler : function( btn, opts )
							{
								this.parent.fireEvent( 'performReportAction', btn, opts );
							}
						},
						{
							xtype : 'button',
							padding : '0 3',
							border : 0,
							textAlign : 'right',
							cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
							glyph : 'xf019@fontawesome',
							width: 75,
							margin : '0 0 0 0',
							text : getLabel( 'lbl.loanCenter.export', 'Export' ),							
							menu : Ext.create( 'Ext.menu.Menu',
							{
								items :
								[
									{
										text : getLabel( 'xlsBtnText', 'XLS' ),
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
						}*/]
				});
		return toolBar;
	}	
});