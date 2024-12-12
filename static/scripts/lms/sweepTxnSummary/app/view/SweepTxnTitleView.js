Ext.define('GCP.view.SweepTxnTitleView', {
			extend : 'Ext.panel.Panel',
			xtype : 'sweepTxnTitleViewType',
			requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
			width : '100%',
			cls : 'ux_panel-background ',

			layout : {
				type : 'hbox'
			},
			initComponent : function() {
				var me = this;
				this.items = [{
							xtype : 'label',
							text : getLabel('lblAgreement', 'Agreements'),						
							itemId : 'pageTitleAgreements',
							cls : 'page-heading thePointer page-heading-inactive',
							padding : '0 0 0 10',
							listeners : {
								'render' : function(lbl) {
									lbl.getEl().on('click', function() {
										submitForm('lmsSweepAgreementTxnList.srvc');
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
							itemId : 'pageTitleTransactions',
							text : getLabel('lblTransactions', 'Transactions'),	
							cls : 'page-heading',
							padding : '0 0 0 10',
							hidden : false
						}];
				this.callParent(arguments);
			}
		});

function goToAgreementsTab() {
	submitForm('lmsSweepAgreementTxnList.srvc');
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