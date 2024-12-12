Ext.define('Cashweb.controller.FscOverdueLoansController', {
	extend : 'Ext.app.Controller',
	views : ['portlet.FscOverdueLoans'],
	stores : ['FscOverdueLoansStore'],
	models : ['FscOverdueLoansModel'],
	mask : null,
	refs : [{
			ref : 'summaryPortlet',
			selector : 'fscoverdueloans'
			}],
	init : function() {
		var me = this;
		this.control({
					'fscoverdueloans' : 
					{
						navigateToFsc : this.viewLoanInvoice,
						seemoreFSCRecords : this.seemoreFSCRecords
					}
				});
	},
	seemoreFSCRecords : function(a,b) {
		var me = this;
		for(var i=0;i<b.length;i++){
			if(b[i].field == "SellerOrBuyerrCombo"){
				me.sellerOrBuyerValue = b[i].value1;
			}
		}
		var objJson = {"loggedInAs" : me.sellerOrBuyerValue};
		var strUrl = 'services/userpreferences/loanRepaymentCenterSavedMode/screenFilters.json';
				Ext.Ajax.request({
					url : Ext.String.format(strUrl),
					method : 'POST',
					jsonData : objJson,
					async : false,
					success : function(response) {
					},
					failure : function() {

					}

				});
		var strUrl = '', objFormData = {}, actionName = 'btnView';
			strUrl = 'loanRepaymentCenter.form';
		if (!Ext.isEmpty(strUrl)) {
			me.doSubmitForm(strUrl, objFormData, actionName);
		}
	},
	doSubmitForm : function(strUrl, formData, actionName) {
		var me = this;
		var form = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	viewLoanInvoice : function(selectedRecord) {
		var me = this;
		var strUrl = "viewFinanceInvoice.form";
		var invNo = selectedRecord.get('CW_INVOICE_INT_REF_NMBR');
		var clientCode = selectedRecord.get('CLIENT_CODE');
		var invPoFlag = selectedRecord.get('INVOICE_PO_FLAG');
		if(invPoFlag == 'P')
			strUrl = 'viewFinancePO.form';
		if (!Ext.isEmpty(invNo) && !Ext.isEmpty(clientCode)) {
			var form = null;
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.action = strUrl;
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',csrfTokenName, tokVal));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtInvIntRefNum', invNo));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtPOCenterClientCode', clientCode));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'backUrl', 'loanRepaymentCenter.form'));
				
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}
	}
});