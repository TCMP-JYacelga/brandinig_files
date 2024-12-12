Ext.define('Cashweb.model.OverdueInvoicesModel', {
			extend : 'Ext.data.Model',
			fields : ['REFERENCES', 'SCM_PROD', 'DUE_DATE', 'OS_Amount', 'INVOICE_DATE','INVOICE_NO','COUNTER_PARTY','PRINCIPAL_AMOUNT','CW_INVOICE_INT_REF_NMBR']
		});