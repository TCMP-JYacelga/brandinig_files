Ext.define('Cashweb.model.PaymentsModel', {
			extend : 'Ext.data.Model',
			fields : [{
						name : 'activationDate',
						type : 'date'
					}, 'productType', 'recieverName', 'currency', {
						name : 'amount',
						type : 'number'
					}, 'actionStatus']
		});