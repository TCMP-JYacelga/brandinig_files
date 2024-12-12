Ext.define('GCP.view.ManageAlertTitleView', {
			extend : 'Ext.panel.Panel',
			xtype : 'manageAlertTitleView',
			requires : [],
			width : '100%',
			baseCls : 'page-heading-bottom-border',
			defaults : {
				style : {
					padding : '0 0 0 0'
				}
			},
			layout :
				{
					type : 'hbox',
					align : 'stretch'
				},
			initComponent : function() {
				var me = this;
				this.items = [{
							xtype : 'container',
							layout : 'hbox',
							align : 'leftFloating',
							flex : 0.5,
							width : '50%',
							defaults : {
								labelAlign : 'top'
							},
						items : [{
							xtype : 'label',
							text : getLabel("inboxmsg", "Alerts"),
							itemId : 'pageTitle',
							cls : 'page-heading thePointer page-heading-inactive',
							padding : '0 0 0 10',
							listeners : {
								'render' : function(lbl) {
									lbl.getEl().on('click', function() {
												submitForm('inboxAlertCenter.srvc');
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
							text : getLabel('managealerts', 'Manage Alerts'),
							itemId : 'pageTitleNavigation',
							cls : 'page-heading',
							padding : '0 0 0 10',
							hidden : false
						}]},
							{
							xtype : 'container',
							layout : 'hbox',
							align : 'rightFloating',
							defaults : {
								labelAlign : 'top'
							},
						items : [
						{
							xtype : 'button',
							border : 0,
							text : getLabel( 'lbl.loanCenter.report', 'Report' ),
							margin : '0 10 0 2',
							textAlign : 'right',
							itemId : 'downloadPdf',
							cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
							glyph : 'xf1c1@fontawesome',
							width: 80,
							parent : this,
							handler : function( btn, opts )
							{
								this.parent.fireEvent( 'performReportAction', btn, opts );
							}
					}, 	{
							xtype : 'button',
							border : 0,
							text : getLabel('lbl.messageCenter.export',
									'Export'),
							cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
							glyph : 'xf019@fontawesome',
							margin : '0 0 0 0',
							width : 75,
							menu : Ext.create('Ext.menu.Menu', {
										items : [{
											text : getLabel('xlsBtnText', 'XLS'),
											glyph : 'xf1c3@fontawesome',
											itemId : 'downloadXls',
											parent : this,
											handler : function(btn, opts) {
												this.parent.fireEvent(
														'performReportAction',
														btn, opts);
											}
										}, {
											text : getLabel('csvBtnText', 'CSV'),
											glyph : 'xf0f6@fontawesome',
											itemId : 'downloadCsv',
											parent : this,
											handler : function(btn, opts) {
												this.parent.fireEvent(
														'performReportAction',
														btn, opts);
											}
										}, {
											text : getLabel('tsvBtnText', 'TSV'),
											glyph : 'xf1c9@fontawesome',
											itemId : 'downloadTsv',
											parent : this,
											handler : function(btn, opts) {
												this.parent.fireEvent(
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
					}];
				this.callParent(arguments);
			}
		});

function gotoInboxAlert() {
	submitForm('inboxAlertCenter.srvc');
}

function submitForm(Url) {
	var me = this;
	var form;
	var strUrl = Url;
	var errorMsg = null;
	if (!Ext.isEmpty(strUrl)) {
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}
}