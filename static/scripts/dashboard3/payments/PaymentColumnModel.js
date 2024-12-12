var PAYMENT_APPROVAL_VERIFICATION_COLUMN_MODEL = [
	  {
			"fieldName": "clientReference",
			"label": getDashLabel('payments.referenceNo'),
			"type": "text",
			"editable": false
	  },	  
	  {
			"fieldName": "sendingAccount",
			"label": getDashLabel('payments.accountNo'),
			"type": "text",
			"editable": false
	  },
	  {
			"fieldName": "recieverName",
			"label": getDashLabel('payments.receiverName'),
			"type": "text",
			"editable": false
	  },
	  {
			"fieldName": "amount",
			"label": getDashLabel('payments.amount'),
			"type": "amount",
			"editable": true,
			"render": function (data, type, row) {
				let currency;
				if(type == 'sort') return data;

				if(row && row.currency)
				{
					currency = decodeURIComponent(row.currency);
				}
				if(row.recKeyCheck == 'Y')
				{
					console.log(12121);
				}
				else if(data != null && data != '' && data != '--CONFIDENTIAL--')
				{
					return  currency + ' '+ DataRender.amountFormatter(data, {
						groupSeparator    : _strGroupSeparator, 
						decimalSeparator  : _strDecimalSeparator, 
						amountMinFraction : _strAmountMinFraction, 
					});					
				}
				else
				{
					return data;
				}
			}			
	  },
	  {
			"fieldName": "count",
			"label": getDashLabel('payments.count'),
			"type": "text",
			"editable": false
	  },		  
	  {
			"fieldName": "productCategoryDesc",
			"label": getDashLabel('payments.paymentType'),
			"type": "text",
			"editable": false
	  },
	  {
			"fieldName": "productTypeDesc",
			"label": getDashLabel('payments.paymentPackage'),
			"type": "text",
			"editable": false
	  },	  
	  {
			"fieldName": "txnDate",
			"label": getDashLabel('payments.effectiveDate'),
			"type": "date",
			"editable": false
	  },
	  {
			"fieldName": "file",
			"label": getDashLabel('payments.filename'),
			"type": "text",
			"editable": false
	  }];

var PAYMENT_REALTIME_POPUP_COLUMN_MODEL = [
	  {
			"fieldName": "requestReference",
			"label": getDashLabel('payments.realtime.trackingNo'),
			"type": "text"
	  },	  
	  {
			"fieldName": "debitAccNo",
			"label": getDashLabel('payments.realtime.debitAccNo'),
			"type": "text"
	  },
	  {
			"fieldName": "creditAccNo",
			"label": getDashLabel('payments.realtime.receivingAccount'),
			"type": "text"
	  },
	  {
			"fieldName": "instAmount",
			"label": getDashLabel('payments.realtime.amount'),
			"type": "amount",
			"render": function (data, type, row) {
			
			}
	  },
	  {
			"fieldName": "instStatus",
			"label": getDashLabel('payments.realtime.status'),
			"type": "text"
	  },		  
	  {
			"fieldName": "hostResponseMsg",
			"label": getDashLabel('payments.hostMessage'),
			"type": "text"
	  }];