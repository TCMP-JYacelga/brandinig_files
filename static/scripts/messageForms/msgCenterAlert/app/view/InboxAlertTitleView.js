Ext.define('GCP.view.InboxAlertTitleView', {
			extend : 'Ext.panel.Panel',
			xtype : 'inboxAlertTitleView',
			requires : [],
			width : '100%',
			baseCls : 'page-heading-bottom-border',
			defaults : {
				style : {
					padding : '0 0 0 0'
				}
			},
			initComponent : function() {
				var me = this;
				this.items = [{
							xtype : 'label',
							text : getLabel("inboxmsg", "Alerts"),
							itemId : 'pageTitle',
							cls : 'page-heading',
							padding : '0 0 0 10'
						}, {
							xtype : 'label',
							text : ' | ',
							cls : 'page-heading ',
							margin : '0 10 0 10',
							hidden : manageAlertFlag == 'true'? true : false
						}, {
							xtype : 'label',
							text : getLabel('managealerts', 'Manage Alerts'),
							itemId : 'pageTitleNavigation',
							cls : 'page-heading thePointer page-heading-inactive',
							padding : '0 0 0 10',
							hidden : manageAlertFlag == 'true'? true : false,
							listeners : {
								'render' : function(lbl) {
									lbl.getEl().on('click', function() {
												submitForm('manageAlertCenter.srvc');
											});
								}
							}
						}];
				this.callParent(arguments);
			}
		});

function gotoManageAlert() {
	submitForm('manageAlertCenter.srvc');
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