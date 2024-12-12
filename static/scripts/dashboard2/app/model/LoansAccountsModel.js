Ext.define('Cashweb.model.LoansAccountsModel', {
			extend : 'Ext.data.Model',
			fields : ['obligorId', 'obligationNo', 'accountName', 'principleAmount', 'maturityDate','totalDue','dateTimeOfRefreshUpdate','accountId']
		});