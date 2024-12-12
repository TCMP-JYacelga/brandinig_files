Ext.define('GCP.view.BroadcastMessageTitleView', {
			extend : 'Ext.panel.Panel',
			xtype : 'broadcastMessageTitleView',
			requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
			width : '100%',
			// baseCls : 'page-heading-bottom-border',
			cls : ' ux_panel-background',
			defaults : {
				style : {
					padding : '0 0 0 4px'
				}
			},
			layout : {
				type : 'hbox',
				align : 'stretch'
			},
			initComponent : function() {
				var me = this;

				this.items = [{

					xtype : 'panel',
					width : '100%',
					cls : 'ux_largepaddingtb ux_no-border',
					defaults : {
						style : {
							padding : '0 0 0 0'
						}
					},
					layout : {
				type : 'hbox',
				align : 'stretch'
			},
					items : [{
								xtype : 'label',
								text : getLabel("inboxmsg", "Inbox"),
								itemId : 'pageTitleInbox',
								cls : 'page-heading thePointer page-heading-inactive',
								padding : '0 0 0 10',
								listeners : {
									'render' : function(lbl) {
										lbl.getEl().on('click', function() {
													goToInboxCenter();
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
								text : getLabel('lbl.messageCenter.outbox',
										'Outbox'),
								itemId : 'pageTitleOutBox',
								cls : 'page-heading thePointer page-heading-inactive',
								padding : '0 0 0 10',
								hidden : false,
								listeners : {
									'render' : function(lbl) {
										lbl.getEl().on('click', function() {
													goToOutboxCenter();
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
								text : getLabel(
										'lbl.messageCenter.broadcastmesg',
										'Broadcast Message'),
								itemId : 'pageTitleBroadCast',
								cls : 'page-heading',
								padding : '0 0 0 10',
								hidden : false,
								listeners : {
									'render' : function(lbl) {
										lbl.getEl().on('click', function() {
													goToBroadcastCenter();
												});
									}
								}
							},{
								xtype : 'label',
								flex : 19
						},{
						xtype : 'container',
						layout : 'hbox',
						align : 'rightFloating',
						defaults : {
							labelAlign : 'top'
						}/*,
						items : [{
							xtype : 'button',
							border : 0,
							text : getLabel('lbl.messageCenter.report',
									'Report'),
							iconAlign : 'left',
							width : 80,
							textAlign : 'right',
							cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
							glyph : 'xf1c1@fontawesome',
							itemId : 'DownloadPdf',
							//parent : this,
							handler : function(btn, opts) {
								me.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							cls : 'black inline_block button-icon icon-button-pdf ux_hide-image',
							flex : 0
						}, {
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
						}]*/
					}]
				}];
				this.callParent(arguments);
			}
		});

function goToInboxCenter() {
	submitForm('messageInboxCenter.srvc');
}

function goToOutboxCenter() {
	submitForm('messageSentCenter.srvc');
}

function goToBroadcastCenter() {
	submitForm('broadcastMessageMstList.form');
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