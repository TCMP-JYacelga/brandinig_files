Ext.define('Cashweb.controller.PayPendingApprController', {
	extend : 'Ext.app.Controller',
	views : ['portlet.PayPendingAppr'],
	stores : ['PayPendingApprStore'],
	models : ['PayPendingApprModel'],
	mask : null,
	refs : [{
				ref : 'summaryPortlet',
				selector : 'paypendingappr'
			}],
	init : function() {
		var me = this;
		this.control({
					'paypendingappr' : {
						navigateToPayments : this.navigateToPayments,
						seeMorePaymentRecords : this.seeMorePaymentRecords
					}
				});
	},
	seeMorePaymentRecords : function(strFilter, filterJson) {
		var me = this;
		var strUrl = 'paymentSummary.form';
		var frm = document.createElement('FORM');
		if (!Ext.isEmpty(strFilter)) {
			frm.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterUrl',
					strFilter));
			frm.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterJson',
					JSON.stringify(filterJson)));		
			frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokVal));
		}
		frm.action = strUrl;
		frm.name = 'frmMain';
		frm.id = 'frmMain';
		frm.method = "POST";
		document.body.appendChild(frm);
		frm.submit();
		document.body.removeChild(frm);
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
		objFormData.strProduct = !Ext.isEmpty(record.get('paymentMethod'))
				? record.get('paymentMethod')
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