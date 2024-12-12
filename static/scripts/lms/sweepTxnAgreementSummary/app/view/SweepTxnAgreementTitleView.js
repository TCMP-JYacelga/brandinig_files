Ext.define('GCP.view.SweepTxnAgreementTitleView', {
			extend : 'Ext.panel.Panel',
			xtype : 'sweepTxnAgreementTitleViewType',
			requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
			width : '100%',
			cls : 'ux_panel-background',

			layout : {
				type : 'hbox'
			},
			initComponent : function() {
				var me = this;
				this.items = [{
							xtype : 'label',
							text : getLabel('lblAgreement', 'Agreements'),
							itemId : 'pageTitleAgreements',
							padding : '0 0 0 10',
							cls : 'page-heading'
						}, {
							xtype : 'label',
							text : ' | ',
							cls : 'page-heading ',
							margin : '0 10 0 10',
							hidden : false
						}, {
							xtype : 'label',
							text : getLabel('lblTransactions', 'Transactions'),													
							itemId : 'pageTitleTransactions',
							cls : 'page-heading thePointer page-heading-inactive',
							padding : '0 0 0 10',
							hidden : false,
							listeners : {
								'render' : function(lbl) {
									lbl.getEl().on('click', function() {
											submitForm('lmsSweepTxnList.srvc');
									});
								}
							}
						}];
				
				this.callParent(arguments);
			}

		});

function goToTransactionsTab() {
	submitForm('lmsSweepTxnList.srvc');
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