Ext.define('Cashweb.model.FscOverdueLoansModel', {
			extend : 'Ext.data.Model',
			fields : ['REFERENCES','SCM_PROD','DUE_DATE','OS_Amount','TYPE_OF_LOAN','INVOICE_NO','COUNTER_PARTY','PRINCIPAL_AMOUNT','ANCHOR_CLIENT','CW_INVOICE_INT_REF_NMBR','CLIENT_CODE','INVOICE_PO_FLAG']
		});