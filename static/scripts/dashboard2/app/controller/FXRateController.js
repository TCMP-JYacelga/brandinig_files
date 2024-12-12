Ext.define('Cashweb.controller.FXRateController', {
	extend : 'Ext.app.Controller',
	views : ['Cashweb.view.portlet.FXRate'],
	stores : ['FXRateStore'],
	models : ['FXRateModel'],
	mask : null,
	refs : [{
				ref : 'summaryPortlet',
				selector : 'fxrate'
			}],
	init : function() {
		var me = this;
		this.control({
					'fxrate' : {
						navigateToPayments : this.navigateToPayments
					}
				});
	},
	navigateToPayments : function(record) {
		var me = this;
		var strPmtType = record.get('paymentType');
		var strUrl = '', objFormData = {}, actionName = 'btnView';
		if (strPmtType === 'QUICKPAY')
			strUrl = 'viewPayment.form';
		else if (strPmtType === 'BB' || strPmtType === 'RR')
			strUrl = 'viewMultiPayment.form';
		objFormData.strLayoutType = !Ext.isEmpty(record.get('layout')) ? record
				.get('layout') : '';
		objFormData.strPaymentType = !Ext.isEmpty(record.get('paymentType'))
				? record.get('paymentType')
				: '';
		objFormData.strProduct = !Ext.isEmpty(record.get('productType'))
				? record.get('productType')
				: '';
		objFormData.strActionStatus = !Ext.isEmpty(record.get('actionStatus'))
				? record.get('actionStatus')
				: '';
		objFormData.strPhdnumber = !Ext.isEmpty(record.get('phdnumber'))
				? record.get('phdnumber')
				: '';
		objFormData.viewState = record.get('identifier');
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokVal));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtLayout',
				formData.strLayoutType));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				formData.viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct',
				formData.strProduct));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtPaymentType', formData.strPaymentType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtActionStaus', formData.strActionStatus));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber',
				formData.strPhdnumber));
		var paymentType = 'PAYMENT';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtEntryType',
				paymentType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'actionName',
				actionName));
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