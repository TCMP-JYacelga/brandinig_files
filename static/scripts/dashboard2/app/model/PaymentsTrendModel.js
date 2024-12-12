Ext.define('Cashweb.model.PaymentsTrendModel', {
			extend : 'Ext.data.Model',
			fields: ['Month', 'Failed', 'Processed','ProcessedAmount','FailedAmount','batchCount','batchAmount','processedBatchCount','failedBatchCount']
		});