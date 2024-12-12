Ext.define('Cashweb.model.OverdueBillsModel', {
			extend : 'Ext.data.Model',
			fields : ['BILL_REF','OUTSTANDING_AMOUNT','LC_REF','BILL_ISSUE_DATE','BILL_DUE_DATE','COUNTER_PARTY']
		});