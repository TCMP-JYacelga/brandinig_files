var mapQueueGridColumn = {
	'V' : [{
				'colId' : 'statusDesc',
				'colHeader' : getLabel('queueStatus','Status'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			},  {
				'colId' : 'hostRemark',
				'colHeader' : getLabel('hostRemark','Host Remark'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			},
			{
				'colId' : 'verificationReason',
				'colHeader' : getLabel('queueReason','Reason'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'productDescription',
				'colHeader' : getLabel('queuePayProduct','Payment Product'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'instAmount',
				'colHeader' : getLabel('queueInstAmt','Instrument Amount'),
				'colType' : 'number',
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'fxRate',
				'colHeader' : getLabel('queueFxRate','FX Rate'),
				'colType' : 'number',
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'effectiveDate',
				'colHeader' : getLabel('queueEffDate','Effective Date'),
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'receiverName',
				'colHeader' : getLabel('queueRecName','Receiver Name'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'sendingAcc',
				'colHeader' : getLabel('queueSenAcc','Sending Account'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'reference',
				'colHeader' : getLabel('queueRef','Batch Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'cwPirNmbr',
				'colHeader' : getLabel('queueCashwebBatchRef','Cashweb Batch Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'clientRef',
				'colHeader' : getLabel('queueClientRef','Payment Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'cwInstNmbr',
				'colHeader' : getLabel('queueCashwebInstNo','Cashweb Instrument Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'dispatchBank',
				'colHeader' : getLabel('queueDispBank','Dispatch Bank'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'dealReference',
				'colHeader' : getLabel('queueDealRef','Deal Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receivedDate',
				'colHeader' : getLabel('ququeRecOn','Received On'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'instCashinStatus',
				'colHeader' : getLabel('queueCashinStatus','Cashin status'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'makerAction',
				'colHeader' : getLabel('queueChangeType','Last Action Taken'),
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'changeDate',
				'colHeader' : getLabel('ququeNewVal','New Value'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receiverAcc',
				'colHeader' : getLabel('ququeRecAccount','Receiver Account'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'receiverBank',
				'colHeader' : getLabel('ququeRecBank','Receiver Bank'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'receiverBranch',
				'colHeader' : getLabel('ququeRecBranch','Receiver Branch'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'activationDate',
				'colHeader' : getLabel('queueActDate','Activation Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'clientDebitDate',
				'colHeader' : getLabel('queueClientDrDate','Client Debit Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'processDate',
				'colHeader' : getLabel('queueProcessDt','Process Date'),
				'hidden' : true,
				'sortable' : true
			},{
				'colId' : 'effectiveTime',
				'colHeader' : getLabel('effectiveTime','Effective Time'),
				'hidden' : true,
				'sortable' : true
			}],
	'L' : [{
				'colId' : 'statusDesc',
				'colHeader' : getLabel('status', 'Status'),
				'hidden' : false,
				'width' : 200,
				'sortable' : true
			},{
				'colId' : 'hostRemark',
				'colHeader' : getLabel('hostRemark', 'Host Remark'),
				'hidden' : false,
				'width' : 200,
				'sortable' : true
			},{
				'colId' : 'clientName',
				'colHeader' : getLabel('clientName', 'Client'),
				'hidden' : false,
				'width' : 200,
				'sortable' : true
			},  {
				'colId' : 'clientRef',
				'colHeader' : getLabel('queueBatchRef','Client Reference'),
				'hidden' : false,
				'sortable' : true
			},{
				'colId' : 'paymentPkgName',
				'colHeader' :  getLabel('payPackage', 'Payment Package'),
				'hidden' : false,
				'sortable' : true
			},{
				'colId' : 'productDescription',
				'colHeader' : getLabel('queuePayProduct','Payment Product'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			},{
				'colId' : 'instAmount',
				'colHeader' : getLabel('queueInstAmt','Instrument Amount'),
				'colType' : 'number',
				'hidden' : false,
				'width' : 200,
				'sortable' : true
			},{
				'colId' : 'sendingAcc',
				'colHeader' : getLabel('sendAcc', 'Sending Account'),
				'hidden' : false,
				'sortable' : true
			},{
				'colId' : 'processDate',
				'colHeader' :  getLabel('debitDate', 'Debit Date'),
				'hidden' : false,
				'sortable' : true
			},	{
				'colId' : 'receiverName',
				'colHeader' :  getLabel('receiverName', 'Receiver Name'),
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'effectiveDate',
				'colHeader' : getLabel('effDate', 'Effective Date'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receivedDate',
				'colHeader' : getLabel('receivedOn', 'Received On'),
				'hidden' : true,
				'sortable' : true
			},{
				'colId' : 'cwInstNmbr',
				'colHeader' : getLabel('queueCashwebInstNo','Cashweb Instrument Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'cwPirNmbr',
				'colHeader' :  getLabel('cwPirNmbr', 'Cashweb Batch Number'),
				'hidden' : true,
				'sortable' : true
			},  {
	      	 		'colId' : 'pirNmbr',
				'colHeader' :  getLabel('pirNmbr', 'Cashin Batch Number'),
				'hidden' : true,
				'sortable' : true
	      	}, {
				'colId' : 'makerId',
				'colHeader' :  getLabel('makerId', 'Maker Id'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'makerAction',
				'colHeader' :  getLabel('changeType', 'Change Type'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receiverAcc',
				'colHeader' :  getLabel('receiverAcc', 'Receiver Account'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receiverBank',
				'colHeader' :  getLabel('receiverBank', 'Receiver Bank'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receiverBranch',
				'colHeader' :  getLabel('receiverBranch', 'Receiver Branch'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'activationDate',
				'colHeader' :  getLabel('activationDate', 'Activation Date'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'clientDebitDate',
				'colHeader' :  getLabel('clDebitDate', 'Client Debit Date'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'utrNmbr',
				'colHeader' :  getLabel('utrNmbr', 'UTR No / RRN No.'),
				'hidden' : false,
				'sortable' : true
			}],
	'W' : [{
				'colId' : 'effectiveDate',
				'colHeader' : getLabel('queueEffDate','Effective Date'),
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'productDescription',
				'colHeader' : getLabel('queuePayProduct','Payment Product'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'instAmount',
				'colHeader' : getLabel('queueInstAmt','Instrument Amount'),
				'colType' : 'number',
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'statusDesc',
				'colHeader' : getLabel('queueStatus','Status'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'receiverName',
				'colHeader' : getLabel('queueRecName','Receiver Name'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'sendingAcc',
				'colHeader' : getLabel('queueSenAcc','Sending Account'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'reference',
				'colHeader' : getLabel('queueRef','Batch Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'cwPirNmbr',
				'colHeader' : getLabel('queueCashwebBatchRef','Cashweb Batch Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'clientRef',
				'colHeader' : getLabel('queueClientRef','Payment Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'cwInstNmbr',
				'colHeader' : getLabel('queueCashwebInstNo','Cashweb Instrument Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'dispatchBank',
				'colHeader' : getLabel('queueDispBank','Dispatch Bank'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'dealReference',
				'colHeader' : getLabel('queueDealRef','Deal Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'fxRate',
				'colHeader' : getLabel('queueFxRate','FX Rate'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receivedDate',
				'colHeader' : getLabel('ququeRecOn','Received On'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'makerAction',
				'colHeader' : getLabel('queueChangeType','Last Action Taken'),
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'changeDate',
				'colHeader' : getLabel('ququeNewVal','New Value'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receiverAcc',
				'colHeader' : getLabel('ququeRecAccount','Receiver Account'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'receiverBank',
				'colHeader' : getLabel('ququeRecBank','Receiver Bank'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'receiverBranch',
				'colHeader' : getLabel('ququeRecBranch','Receiver Branch'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'activationDate',
				'colHeader' : getLabel('queueActDate','Activation Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'clientDebitDate',
				'colHeader' : getLabel('queueClientDrDate','Client Debit Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'processDate',
				'colHeader' : getLabel('queueProcessDt','Process Date'),
				'hidden' : true,
				'sortable' : true
			},{
				'colId' : 'effectiveTime',
				'colHeader' : getLabel('effectiveTime','Effective Time'),
				'hidden' : true,
				'sortable' : true
			}],
	'D' : [{
				'colId' : 'statusDesc',
				'colHeader' : getLabel('queueStatus','Status'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'instAmount',
				'colHeader' : getLabel('queueInstAmt','Instrument Amount'),
				'colType' : 'number',
				'hidden' : false,
				'sortable' : true
			},  {
				'colId' : 'clientRef',//changed as per new wireframe
				'colHeader' : getLabel('queueClientRef','Payment Reference'),
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'receiverName',//changed as per new wireframe
				'colHeader' : getLabel('queueRecName','Receiver Name'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'effectiveDate',
				'colHeader' : getLabel('queueEffDate','Effective Date'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'reference',
				'colHeader' : getLabel('queueRef','Batch Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'cwPirNmbr',
				'colHeader' : getLabel('queueCashwebBatchRef','Cashweb Batch Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			},/*{
				'colId' : 'cwInstNmbr',
				'colHeader' : getLabel('queueCashwebInstNo','Cashweb Instrument Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			},*/ {
				'colId' : 'dispatchBank',
				'colHeader' : getLabel('queueDispBank','Dispatch Bank'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receivedDate',
				'colHeader' : getLabel('ququeRecOn','Received On'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'makerAction',
				'colHeader' : getLabel('queueChangeType','Last Action Taken'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'changeDate',
				'colHeader' : getLabel('ququeNewVal','New Value'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receiverAcc',
				'colHeader' : getLabel('ququeRecAccount','Receiver Account'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'receiverBank',
				'colHeader' : getLabel('ququeRecBank','Receiver Bank'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'receiverBranch',
				'colHeader' : getLabel('ququeRecBranch','Receiver Branch'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'activationDate',
				'colHeader' : getLabel('queueActDate','Activation Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'clientDebitDate',
				'colHeader' : getLabel('queueClientDrDate','Client Debit Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'processDate',
				'colHeader' : getLabel('queueProcessDt','Process Date'),
				'hidden' : true,
				'sortable' : true
			},{
				'colId' : 'effectiveTime',
				'colHeader' : getLabel('effectiveTime','Effective Time'),
				'hidden' : true,
				'sortable' : true
			}],
	'Q' : [{
				'colId' : 'statusDesc',
				'colHeader' : getLabel('queueStatus','Status'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'instAmount',
				'colHeader' : getLabel('queueInstAmt','Instrument Amount'),
				'colType' : 'number',
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'clientRef',
				'colHeader' : getLabel('queueClientRef','Payment Reference'),
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'receiverName',
				'colHeader' : getLabel('queueRecName','Receiver Name'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'receiverAcc',
				'colHeader' : getLabel('ququeRecAccount','Receiver Account'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'receiverBank',
				'colHeader' : getLabel('ququeRecBank','Receiver Bank'),
				'hidden' : false,
				'sortable' : true
			},{
				'colId' : 'receiverBranch',
				'colHeader' : getLabel('ququeRecBranch','Receiver Branch'),
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'receiverAccType',
				'colHeader' : getLabel('queueRecAccType','Receiver Account Type'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'bankRoutingNumber',
				'colHeader' : getLabel('ququeRoutingNo','Routing Number'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'batchReference',
				'colHeader' : getLabel('queueRef','Batch Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'cwPirNmbr',
				'colHeader' : getLabel('queueCashwebBatchRef','Cashweb Batch Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, /*{
				'colId' : 'cwInstNmbr',
				'colHeader' : getLabel('queueCashwebInstNo','Cashweb Instrument Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			},*/ {
				'colId' : 'dispatchBank',
				'colHeader' : getLabel('queueDispBank','Dispatch Bank'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'dealReference',
				'colHeader' : getLabel('queueDealRef','Deal Reference'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'activationDate',
				'colHeader' : getLabel('queueActDate','Activation Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'clientDebitDate',
				'colHeader' : getLabel('queueClientDrDate','Client Debit Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'processDate',
				'colHeader' : getLabel('queueProcessDt','Process Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'effectiveTime',
				'colHeader' : getLabel('effectiveTime','Effective Time'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'utrNmbr',
				'colHeader' : getLabel('utrNmbr', 'UTR No / RRN No.'),
				'hidden' : true,
				'sortable' : true
			}],
	'R' :  [{
				'colId' : 'statusDesc',
				'colHeader' : getLabel('queueStatus','Status'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'rejectRemarks',
				'colHeader' : getLabel('queueRejReason','Reject Reason'),//changed as per new wireframe
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'productDescription',
				'colHeader' : getLabel('queuePayProduct','Payment Product'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'effectiveDate',
				'colHeader' : getLabel('queueEffDate','Effective Date'),
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'instAmount',
				'colHeader' : getLabel('queueInstAmt','Instrument Amount'),
				'colType' : 'number',
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'receiverName',
				'colHeader' : getLabel('queueRecName','Receiver Name'),
				'width' : 200,
				'hidden' : false,
				'sortable' : true
			}, {
				'colId' : 'batchReference',
				'colHeader' : getLabel('queueBatchRef','Batch Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'clientRef',
				'colHeader' : getLabel('queueClientRef','Payment Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'cwPirNmbr',
				'colHeader' : getLabel('queueCashwebBatchRef','Cashweb Batch Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'cwInstNmbr',
				'colHeader' : getLabel('queueCashwebInstNo','Cashweb Instrument Number'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'sendingAcc',
				'colHeader' : getLabel('queueDebAcc','Debit Account'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'dispatchBank',
				'colHeader' : getLabel('queueDispBank','Dispatch Bank'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'dealReference',
				'colHeader' : getLabel('queueDealRef','Deal Reference'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'fxRate',
				'colHeader' : getLabel('queueFxRate','FX Rate'),
				'colType' : 'number',
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'receivedDate',
				'colHeader' : getLabel('ququeRecOn','Received On'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'makerRemark',
				'colHeader' : getLabel('queueRemarks','Remarks'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'makerAction',
				'colHeader' : getLabel('queueChangeType','Last Action Taken'),
				'hidden' : true,
				'sortable' : true
			}, {
				'colId' : 'changeDate',
				'colHeader' : getLabel('ququeNewVal','New Value'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'activationDate',
				'colHeader' : getLabel('queueActDate','Activation Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'clientDebitDate',
				'colHeader' : getLabel('queueClientDrDate','Client Debit Date'),
				'hidden' : true,
				'sortable' : true
			},
			{
				'colId' : 'processDate',
				'colHeader' : getLabel('queueProcessDt','Process Date'),
				'hidden' : true,
				'sortable' : true
			},{
				'colId' : 'effectiveTime',
				'colHeader' : getLabel('effectiveTime','Effective Time'),
				'hidden' : true,
				'sortable' : true
			}],
	 'C' :	[
	      	 {
	      		 	'colId' : 'statusDesc',
	      		 	'colHeader' : getLabel('queueStatus','Status'),
	      		 	'hidden' : false,
	      		 	'sortable' : true
	      	 },
	      	 {
	      		 	'colId' : 'instAmount',
	      		 	'colHeader' : getLabel('queueInstAmt','Instrument Amount'),
					'colType' : 'number',
	      		 	'hidden' : false,
	      		 	'sortable' : true
	      	 },
	      	 {
		      		'colId' : 'clientRef',
					'colHeader' : getLabel('queueClientRef','Payment Reference'),
					'hidden' : false,
					'sortable' : true
	      	 },
	      	 {
		      		'colId' : 'receiverName',
					'colHeader' : getLabel('queueRecName','Receiver Name'),
					'hidden' : false,
					'sortable' : true
	      	 },
	      	 {
		      		'colId' : 'reference',
					'colHeader' : getLabel('queueBatchRef','Batch Reference'),
					'hidden' : true,
					'sortable' : true
	      	 },
	      	 {
	      		 	'colId' : 'cwPirNmbr',
	      		 	'colHeader' : getLabel('queueCashwebBatchRef','Cashweb Batch Number'),
	      		 	'hidden' : true,
	      		 	'sortable' : true
	      	 },
	      	 /*{
	      		 	'colId' : 'cwInstNmbr',
	      		 	'colHeader' : getLabel('queueCashwebInstNo','Cashweb Instrument Number'),
					'colType' : 'number',
	      		 	'hidden' : true,
	      		 	'sortable' : true
	      	 },*/
	      	 {
	      		 	'colId' : 'dispatchBank',
	      		 	'colHeader' : getLabel('queueDispBank','Dispatch Bank'),
	      		 	'hidden' : true,
	      		 	'sortable' : true
	      	 },
	      	 {
	      		 	'colId' : 'receivedDate',
	      		 	'colHeader' : getLabel('ququeRecOn','Received On'),
	      		 	'hidden' : true,
	      		 	'sortable' : true
	      	 },
	      	 {
	      		 	'colId' : 'makerAction',
	      		 	'colHeader' : getLabel('queueChangeType','Last Action Taken'),
	      		 	'hidden' : true,
	      		 	'sortable' : true
	      	 },
	      	 {
	      		 	'colId' : 'changeDate',
	      		 	'colHeader' : getLabel('ququeNewVal','New Value'),
	      		 	'hidden' : true,
	      		 	'sortable' : true
	      	 },
			 {
	      		 'colId' : 'activationDate',
	      		 'colHeader' : getLabel('queueActDate','Activation Date'),
	      		 'hidden' : true,
	      		 'sortable' : true
			 },
			 {
				'colId' : 'clientDebitDate',
				'colHeader' : getLabel('queueClientDrDate','Client Debit Date'),
				'hidden' : true,
				'sortable' : true
			 },
			 {
				'colId' : 'processDate',
				'colHeader' : getLabel('queueProcessDt','Process Date'),
				'hidden' : true,
				'sortable' : true
			 },{
					'colId' : 'effectiveTime',
					'colHeader' : getLabel('effectiveTime','Effective Time'),
					'hidden' : true,
					'sortable' : true
				}
	      	],
	   	 'CW' : [
		      	 {
		      		 	'colId' : 'statusDesc',
		      		 	'colHeader' : getLabel('queueStatus','Status'),
						'width' : 200,
		      		 	'hidden' : false,
		      		 	'sortable' : true
		      	 },
		      	 {
		      		 	'colId' : 'instAmount',
		      		 	'colHeader' : getLabel('queueInstAmt','Instrument Amount'),
						'colType' : 'number',
		      		 	'hidden' : false,
		      		 	'sortable' : true
		      	 },
		      	 {
			      		'colId' : 'clientRef',
						'colHeader' : getLabel('queueClientRef','Payment Reference'),
						'width' : 200,
						'hidden' : false,
						'sortable' : true
		      	 },
		      	 {
			      		'colId' : 'receiverBank',
						'colHeader' : getLabel('queueRecBankNm','Receiver Bank Name'),
						'width' : 150,
						'hidden' : false,
						'sortable' : true
		      	 },
		      	 {
			      		'colId' : 'receiverBranch',
						'colHeader' : getLabel('queueRecBranchName','Receiver Branch Name'),
						'width' : 150,
						'hidden' : false,
						'sortable' : true
		      	 },
		      	 {
			      		'colId' : 'receiverAcc',
						'colHeader' : getLabel('queueRecAccNo','Receiver Account'),
						'width' : 150,
						'hidden' : false,
						'sortable' : true
		      	 },
		      	 {
			      		'colId' : 'receiverAccType',
						'colHeader' : getLabel('queueRecAccType','Receiver Account Type'),
						'colType' : 'number',
						'width' : 150,
						'hidden' : false,
						'sortable' : true
		      	 },
		      	 {
			      		'colId' : 'bankRoutingNumber',
						'colHeader' : getLabel('ququeRoutingNo','Routing Number'),
						'colType' : 'number',
						'hidden' : false,
						'sortable' : true
		      	 },
		      	 {
			      		'colId' : 'batchReference',
						'colHeader' : getLabel('queueBatchRef','Batch Reference'),
						'hidden' : true,
						'sortable' : true
		      	 },
		      	 {
		      		 	'colId' : 'cwPirNmbr',
		      		 	'colHeader' : getLabel('queueCashwebBatchRef','Cashweb Batch Number'),
						'colType' : 'number',
		      		 	'hidden' : true,
		      		 	'sortable' : true
		      	 },
		      	 {
		      		 	'colId' : 'cwInstNmbr',
		      		 	'colHeader' : getLabel('queueCashwebInstNo','Cashweb Instrument Number'),
						'colType' : 'number',
		      		 	'hidden' : true,
		      		 	'sortable' : true
		      	 },
		      	 {
		      		 	'colId' : 'dispatchBank',
		      		 	'colHeader' : getLabel('queueDispBank','Dispatch Bank'),
		      		 	'hidden' : true,
		      		 	'sortable' : true
		      	 },
				{
					'colId' : 'activationDate',
					'colHeader' : getLabel('queueActDate','Activation Date'),
					'hidden' : true,
					'sortable' : true
				},
				{
					'colId' : 'clientDebitDate',
					'colHeader' : getLabel('queueClientDrDate','Client Debit Date'),
					'hidden' : true,
					'sortable' : true
				},
				{
					'colId' : 'processDate',
					'colHeader' : getLabel('queueProcessDt','Process Date'),
					'hidden' : true,
					'sortable' : true
				}
		      	]
};

var gridStoreModel = getGridStoreModel();

function getGridStoreModel() {
	var storeModel = {
		fields : ['history', 'clientName', 'reference', 'sendingAcc',
				'productDescription', 'processDate', 'receivedDate',
				'effectiveDate', 'instAmount', 'totalTxns','clientDebitDate','activationDate',
				'nextDownloadSchedule', 'hostErrorCode', 'hostErrorReason',
				'queueType', 'transactionType', 'statusDesc', 'status',
				'makerAction', 'changeDate', 'identifier', 'cwPirNmbr',
				'repairQueue', 'debitQueue', 'clearingQueue', 'myProduct',
				'pirNmbr', 'clientId', '__metadata', '__subTotal', 'product',
				'filename', 'channelCode', 'paymentPkgName', 'makerId',
				'glAttempt', 'verificationReason', 'totVerifyInst',
				'totVerifyCancelInst', 'dealReference', 'cashinStatus',
				'totWarehouseInst', 'totWarehouseCancelInst', 'fxRate',
				'hostRemark', 'receiverName', 'dispatchBank', 'batchReference',
				'clientRef', 'cwInstNmbr', 'verificationReason', 'remark',
				'makerRemark','receiverBank','receiverBranch','receiverAcc',
				'instStatus', 'receiverAccType','bankRoutingNumber','rejectRemarks','effectiveTime','utrNmbr'],
		proxyUrl : 'getBankProcessingQueueInst.srvc',
		rootNode : 'd.bankProcessingQueueInst',
		totalRowsNode : 'd.__count'
	};
	if (strPaymentQueueType === 'Q') {
		storeModel['proxyUrl'] = 'getInstQueryData.srvc';
	}
	return storeModel;
}

var mapActions = {
	'V' : {
		'rowActions' : [getLabel('lblQueueVerify','Verify'), getLabel('lblQueueCancel','Cancel')],
		'groupActions' : [getLabel('lblQueueVerify','Verify'), getLabel('lblQueueCancel','Cancel')]
	},
	'W' : {
		'rowActions' : [getLabel('lblQueueAdv','Advance'), getLabel('lblQueueChangeDt','ChangeDate'), getLabel('lblQueueCancel','Cancel')],
		'groupActions' : [getLabel('lblQueueAdv','Advance'), getLabel('lblQueueCancel','Cancel')]
	},
	'D' : {
		'rowActions' : [getLabel('lblQueueCancel','Cancel')],
		'groupActions' : [getLabel('lblQueueCancel','Cancel')]
	},
	'Q' : {
		'rowActions' : [],
		'groupActions' : []
	},
	'R' : {
		'rowActions' : [getLabel('lblQueueValidate','Validate'), getLabel('lblQueueCancel','Cancel')],
		'groupActions' : [getLabel('lblQueueValidate','Validate'), getLabel('lblQueueCancel','Cancel')]
	},
	'C' : {
		'rowActions' : [getLabel('lblQueueCancel','Cancel')],
		'groupActions' : [getLabel('lblQueueCancel','Cancel')]
	},
	'CW' : {
		'rowActions' : [],
		'groupActions' : []
	},
	'L' : {
		'rowActions' : [],
		'groupActions' : []
	}
};

var mapQueueActionModel = {
	'V' : {
		'Verify' : {
			text : getLabel('vqueue.verify', 'Verify'),
			actionName : 'verificationVerify',
			itemId : 'verificationVerify',
			maskPosition : 1
		},
		'Cancel' : {
			text : getLabel('vqueue.cancel', 'Cancel'),
			actionName : 'verificationCancle',
			itemId : 'verificationCancle',
			maskPosition : 2
		},
		'Submit' : {
			text : getLabel('vqueue.submit', 'Submit'),
			actionName : 'verifySubmit',
			itemId : 'verifySubmit',
			maskPosition : 5
		},
		'Authorize' : {
			text : getLabel('vqueue.authorize', 'Authorize'),
			actionName : 'accept',
			itemId : 'accept',
			maskPosition : 7
		},
		'Reject' : {
			text : getLabel('vqueue.reject', 'Reject'),
			actionName : 'reject',
			itemId : 'reject',
			maskPosition : 8
		}
	},
	'W' : {
		'Advance' : {
			text : getLabel('wqueue.advance', 'Advance'),
			actionName : 'warehouseAdvance',
			itemId : 'warehouseAdvance',
			maskPosition : 3
		},
		'Cancel' : {
			text : getLabel('wqueue.cancel', 'Cancel'),
			actionName : 'warehouseCancle',
			itemId : 'warehouseCancle',
			maskPosition : 2
		},
		'ChangeDate' : {
			text : getLabel('wqueue.ChangeDate', 'Change Date'),
			actionName : 'changeDate',
			itemId : 'changeDate',
			maskPosition : 1
		},
		'DealChange' : {
			text : getLabel('wqueue.DealChange', 'Deal Change'),
			actionName : 'dealChange.srvc',
			itemId : 'dealChange',
			maskPosition : 4
		},
		'Submit' : {
			text : getLabel('wqueue.submit', 'Submit'),
			actionName : 'warehouseSubmit',
			itemId : 'warehouseSubmit',
			maskPosition : 5
		},
		'Authorize' : {
			text : getLabel('wqueue.authorize', 'Authorize'),
			actionName : 'accept',
			itemId : 'accept',
			maskPosition : 7
		},
		'Reject' : {
			text : getLabel('wqueue.reject', 'Reject'),
			actionName : 'reject',
			itemId : 'reject',
			maskPosition : 8
		}
	},
	'D' : {
		'ChangeDate' : {
			text : getLabel('dqueue.ChangeDate', 'Change Date'),
			actionName : 'changeDate',
			itemId : 'changeDate',
			maskPosition : 1
		},
		'GLReattempt' : {
			text : getLabel('dqueue.GLReattempt', 'Retry'),
			actionName : 'reSend',
			itemId : 'reSend',
			maskPosition : 3
		},
		'ManualConfirm' : {
			text : getLabel('dqueue.ManualConfirm', 'Manual Confirm'),
			actionName : 'confirm',
			itemId : 'confirm',
			maskPosition : 4
		},
		'ManualReject' : {
			text : getLabel('dqueue.ManualReject', 'Manual Reject'),
			actionName : 'debitReject',
			itemId : 'debitReject',
			maskPosition : 6
		},
		'ForceDebit' : {
			text : getLabel('dqueue.ForceDebit', 'Force Debit'),
			actionName : 'enforceDebit',
			itemId : 'enforceDebit',
			maskPosition : 5
		},
		'Cancel' : {
			text : getLabel('dqueue.Cancel', 'Cancel'),
			actionName : 'cancelPayment',
			itemId : 'cancelPayment',
			maskPosition : 2
		},
		'Authorize' : {
			text : getLabel('dqueue.authorize', 'Authorize'),
			actionName : 'accept',
			itemId : 'accept',
			maskPosition : 7
		},
		'Reject' : {
			text : getLabel('dqueue.reject', 'Reject'),
			actionName : 'reject',
			itemId : 'reject',
			maskPosition : 8
		},
		'Submit' : {
			text : getLabel('dqueue.submit', 'Submit'),
			actionName : 'debitSubmit',
			itemId : 'debitSubmit',
			maskPosition : 13
		}
	},
	'R' : {
		'Validate' : {
			text : getLabel('rqueue.Validate', 'Validate'),
			actionName : 'repairValidate',
			itemId : 'repairValidate',
			maskPosition : 1
		},
		'Cancel' : {
			text : getLabel('rqueue.cancel', 'Cancel'),
			actionName : 'repairReject',
			itemId : 'repairReject',
			maskPosition : 2
		},
		'Submit' : {
			text : getLabel('rqueue.submit', 'Submit'),
			actionName : 'repairSubmit',
			itemId : 'repairSubmit',
			maskPosition : 5
		},
		'Authorize' : {
			text : getLabel('rqueue.authorize', 'Authorize'),
			actionName : 'accept',
			itemId : 'accept',
			maskPosition : 7
		},
		'Reject' : {
			text : getLabel('rqueue.reject', 'Reject'),
			actionName : 'reject',
			itemId : 'reject',
			maskPosition : 8
		}
	},
	'C' : {
		'Cancel' : {
			text : getLabel('cqueue.cancel', 'Cancel'),
			actionName : 'cancel',
			itemId : 'cancel',
			maskPosition : 2
		}
	}
};
var mapRowActions = {
	'V' : ['btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark'],
	'W' : ['btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark'],
	'D' : ['btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark'],
	'Q' : ['btnView'],
	'R' : ['btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark'],
	'C' : ['btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark'],
	'CW' : ['btnView'],
	'L' : ['btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark']
};
var mapRowActionModel = {
	'btnView' : {
		itemId : 'btnView',
		itemCls : 'grid-row-action-icon icon-view',
		toolTip : getLabel('viewToolTip', 'View Record'),
		itemLabel : getLabel('viewToolTip', 'View Record')
		//maskPosition : 10
	},
	'btnHistory' : {
		itemId : 'btnHistory',
		itemCls : 'grid-row-action-icon icon-history',
		toolTip : getLabel('historyToolTip', 'View History'),
		itemLabel : getLabel('historyToolTip', 'View History'),
		maskPosition : 10
	},
	'btnViewRemark' : {
		itemId : 'btnViewRemark',
		itemCls : 'grid-row-action-icon icon-remark',
		toolTip : getLabel('viewRemarkToolTip', 'View Remark'),
		itemLabel : getLabel('viewRemarkToolTip', 'View Remark'),
		maskPosition : 11
	},
	'btnAddRemark' : {
		itemId : 'btnAddRemark',
		itemCls : 'grid-row-action-icon icon-remark',
		toolTip : getLabel('addRemarkToolTip', 'Add Remark'),
		itemLabel : getLabel('addRemarkToolTip', 'Add Remark'),
		maskPosition : 12
	}
};
var arrPmtQueueType = {
	V : getLabel('verification', 'Verification'),
	R : getLabel('repairTxns', 'Repair'),
	D : getLabel('debitTxns', 'Debit'),
	C : getLabel('clearingDownloadTxns', 'Clearing Download'),
	W : getLabel('warehouseTxns', 'Warehouse'),
	Q : getLabel('lblbatchquery', 'Batch Query'),
	CW : getLabel('cashwebbatchquery', 'Cashweb Batch Query'),
	L : getLabel('hostRejected', 'Host Rejected')
};
var arrShowCheckBoxColumn = {
		V : true,
		D : true,
		W : true,
		R : true,
		Q : false,
		C : true,
		L : false,
		CW : false
};
