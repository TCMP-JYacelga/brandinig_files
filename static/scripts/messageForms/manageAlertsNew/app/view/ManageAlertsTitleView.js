Ext
		.define(
				'GCP.view.ManageAlertsTitleView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'manageAlertsTitleViewType',
					requires : [ 'Ext.form.Label', 'Ext.Img',
							'Ext.button.Button' ],
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
						this.items = [ {
							xtype : 'container',
							layout : 'hbox',
							align : 'left',
							defaults : {
								labelAlign : 'top'
							},
							items : [
									/*{
										xtype : 'button',
										text : '<span class="button_underline thePoniter ux_font-size14-normal">'
												+ getLabel(
														'lbl.messageCenter.Inbox',
														'Inbox') + '</span>',
										itemId : 'inboxTabItemId',
										parent : this,
										handler : function(btn, opts) {
											goToPage('messageInboxCenter.srvc',
													'frmMain');
										}
									},
									{
										xtype : 'label',
										flex : 19
									},
									{
										xtype : 'button',
										text : '<span class="button_underline thePoniter ux_font-size14-normal">'
												+ getLabel(
														'lbl.messageCenter.outbox',
														'Outbox') + '</span>',
										itemId : 'outBoxTabItemId',
										parent : this,
										handler : function(btn, opts) {
											goToPage('messageSentCenter.srvc',
													'frmMain');
										}
									},
									{
										xtype : 'label',
										flex : 19
									}, */
									{
										xtype : 'button',
										text : '<span class="button_underline thePoniter ux_font-size14-normal">'
												+ getLabel(
														'lbl.messageCenter.manageAlerts',
														'Manage Alerts')
												+ '</span>',
										itemId : 'loanCenterSiTabItemId',
										parent : this,
										cls : 'xn-custom-heighlight',
										handler : function(btn, opts) {
											goToPage('manageAlertCenter.srvc',
													'frmMain');
										}
									} ]
						} ];
						me.on('render', function() {
							me.preHandleTabPermissions();
						});
						this.callParent(arguments);
					},
					preHandleTabPermissions : function(btn,	opts) {
						this.fireEvent('preHandleTabPermissions', btn,
								opts);
					}

				});
