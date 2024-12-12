Ext.define('Cashweb.model.PayPendingApprModel', {
			extend : 'Ext.data.Model',
			fields : ['MAKER_DATE', 'PHDREFERENCE','PHDTOTALNO','TXN_AMNT','USRDESCRIPTION','PHDPAYCCY','CCY_SYMBOL',
			'BANKPRODUCTDESCRIPTION','paymentType','identifier','productType','actionStatus','phdnumber','HOST_MESSAGE','PHDPRODUCTDESC',
			'PROCESS_DATE','APPROVER_COUNT','paymentMethod']
		});