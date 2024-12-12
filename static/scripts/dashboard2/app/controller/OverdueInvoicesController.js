Ext.define('Cashweb.controller.OverdueInvoicesController', {
	extend : 'Ext.app.Controller',
	views : ['Cashweb.view.portlet.OverdueInvoices'],
	stores : ['OverdueInvoicesStore'],
	models : ['OverdueInvoicesModel'],
	mask : null,
	refs : [{
				ref : 'summaryPortlet',
				selector : 'overdueinvoices'
			}],
	init : function() {
		var me = this;
		this.control({
					'overdueinvoices' : 
					{
						navigateToInvoice : this.navigateToInvoice,
						seeMoreInvoiceRecords : this.seeMoreInvoiceRecords
					}
				});
	},
	seeMoreInvoiceRecords : function(a, b) {
		var me = this;
		for(var i=0;i<b.length;i++){
			if(b[i].field == "SellerOrBuyerrCombo"){
				me.sellerOrBuyerValue = b[i].value1;
			}
		}
		var objJson = {"loggedInAs" : me.sellerOrBuyerValue};
		var strUrl = 'services/userpreferences/invoiceCenter/screenFilters.json';
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
		var strUrl = '', objFormData = {}, actionName = 'btnMore';
		strUrl = 'invoiceCenter.form'		
		if (!Ext.isEmpty(strUrl)) 
		{
			me.doSubmitForm(strUrl, objFormData, actionName);
		}
	},
	navigateToInvoice : function(record,clientCode) {
		//TODO : Need to map proper action after invoice center BNR changes.
		var me = this;
		var strUrl = '', objFormData = {}, actionName = 'btnView';
		strUrl = 'viewFinanceInvoice.form';
		
		objFormData.invNo = record.get('CW_INVOICE_INT_REF_NMBR');
		objFormData.client = clientCode;
		if (!Ext.isEmpty(strUrl)) 
		{
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

		form.appendChild(me.createFormField('INPUT', 'HIDDEN',csrfTokenName, tokVal));

		if('btnView' === actionName)
		{
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtInvIntRefNum',formData.invNo));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPOCenterClientCode',formData.client));
		}
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
	}
});