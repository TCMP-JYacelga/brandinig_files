Ext.define('Cashweb.controller.PaymentRequestController', {
	extend : 'Ext.app.Controller',
	xtype : 'paymentRequestController',
	views : ['Cashweb.view.portlet.PaymentRequest',
			'Cashweb.view.portlet.CashflowCreditDataGrid'],
	stores : [],
	models : [],
	mask : null,
	chartServiceData : null,
	totalBalance : null,
	sellerCurrency : null,
	ccyUrl : '',
	piChartAmount : '0k',
	refs : [{
				ref : 'paymentrequest',
				selector : 'paymentrequest'
			}],

	init : function() {
		var me = this;
		me.control({
					'paymentrequest' : {
						boxready : this.onBoxReady,
						seeMorePaymentRecords : this.seeMorePaymentRecords
					}
				});

	},	
	seeMorePaymentRecords : function(strFilter, filterJson) {
		var me = this;
		var strUrl = 'paymentSummary.form';
		var frm = document.createElement('FORM');
		if (!Ext.isEmpty(strFilter)) {
			strFilter = strFilter.replace(/AccountNoPDTPayReq/g,'AccountNoPDT');
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
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	onBoxReady : function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	}
});