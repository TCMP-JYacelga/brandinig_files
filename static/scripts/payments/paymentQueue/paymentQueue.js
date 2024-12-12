var mapQueueGridColumn = {
    'V' : [ {
        'colId' : 'statusDesc',
        'colHeader' : getLabel('status', 'Status'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'verificationReason',
        'colHeader' : getLabel('reason', 'Reason'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'clientName',
        'colHeader' : getLabel('companyName', 'Company Name'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'paymentCategory',
        'colHeader' : getLabel('payProduct', 'Payment Category'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalInstAmount',
        'colHeader' : getLabel('amt', 'Amount'),
        'colType' : 'number',
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalTxns',
        'colHeader' : getLabel('count', 'Count'),
        'colType' : 'number',
        'width' : 80,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'fxRate',
        'colHeader' : getLabel('fxRate', 'FX Rate'),
        'colType' : 'number',
        'width' : 80,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'effectiveDate',
        'colHeader' : getLabel('effDate', 'Effective Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'receivedDate',
        'colHeader' : getLabel('receivedOn', 'Received On'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totVerifyInst',
        'colHeader' : getLabel('instForVerification', 'Instrument For Verification'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totVerifyCancelInst',
        'colHeader' : getLabel('instCancelled', 'Instrument Cancelled'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'sendingAcc',
        'colHeader' : getLabel('sendAcc', 'Sending Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fileName',
        'colHeader' : getLabel('fileName', 'File Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'reference',
        'colHeader' : getLabel('paymentqueue.reference', 'Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'channelCode',
        'colHeader' : getLabel('channel', 'Channel'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'cwPirNmbr',
        'colHeader' : getLabel('cashwebBatchNumber', 'Customer Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'paymentPkgName',
        'colHeader' : getLabel('payPackage', 'Payment Package'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverName',
        'colHeader' : getLabel('receiverName', 'Receiver Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'dealReference',
        'colHeader' : getLabel('dealRef', 'Deal Ref'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'batchCashinStatus',
        'colHeader' : getLabel('batchCashinStatus', 'Batch Cashin status'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerId',
        'colHeader' : getLabel('makerId', 'Maker Id'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerAction',
        'colHeader' : getLabel('chgType', 'Last Action Taken'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'changeDate',
        'colHeader' : getLabel('lblnewvalue', 'New Value'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverAcc',
        'colHeader' : getLabel('receiverAcc', 'Receiver Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBank',
        'colHeader' : getLabel('receiverBank', 'Receiver Bank'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBranch',
        'colHeader' : getLabel('receiverBranch', 'Receiver Branch'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'activationDate',
        'colHeader' : getLabel('activationDate', 'Activation Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'clientDebitDate',
        'colHeader' : getLabel('clDebitDate', 'Client Debit Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'processDate',
        'colHeader' : getLabel('processDate', 'Process Date'),
        'hidden' : true,
        'sortable' : true
    } ],
    'L' : [ {
        'colId' : 'statusDesc',
        'colHeader' : getLabel('status', 'Status'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'hostRemark',
        'colHeader' : getLabel('hostRemark', 'Host Remark'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'glAttempt',
        'colHeader' : getLabel('hostAttempt', 'Host Attempt'),
        'colType' : 'number',
        'width' : 100,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'clientName',
        'colHeader' : getLabel('clientName', 'Client'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'reference',
        'colHeader' : getLabel('batchRef', 'Batch Reference'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'productDescription',
        'colHeader' : getLabel('payProduct', 'Payment Product'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'paymentCategory',
        'colHeader' : getLabel('payCat', 'Payment Category'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'totalInstAmount',
        'colHeader' : getLabel('debitAmt', 'Debit Amount'),
        'colType' : 'number',
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalTxns',
        'colHeader' : getLabel('count', 'Count'),
        'colType' : 'number',
        'width' : 80,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'processDate',
        'colHeader' : getLabel('debitDate', 'Debit Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'fxRate',
        'colHeader' : getLabel('fxRate', 'FX Rate'),
        'colType' : 'number',
        'width' : 80,
        'hidden' : true,
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
    }, {
        'colId' : 'sendingAcc',
        'colHeader' : getLabel('sendAcc', 'Sending Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'cwPirNmbr',
        'colHeader' : getLabel('cwPirNmbr', 'Cashweb Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'paymentPkgName',
        'colHeader' : getLabel('payPackage', 'Payment Package'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverName',
        'colHeader' : getLabel('receiverName', 'Receiver Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'dealReference',
        'colHeader' : getLabel('dealRef', 'Deal Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'pirNmbr',
        'colHeader' : getLabel('pirNmbr', 'Cashin Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerId',
        'colHeader' : getLabel('makerId', 'Maker Id'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerAction',
        'colHeader' : getLabel('changeType', 'Change Type'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverAcc',
        'colHeader' : getLabel('receiverAcc', 'Receiver Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBank',
        'colHeader' : getLabel('receiverBank', 'Receiver Bank'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBranch',
        'colHeader' : getLabel('receiverBranch', 'Receiver Branch'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'channelCode',
        'colHeader' : getLabel('channel', 'Channel'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'activationDate',
        'colHeader' : getLabel('activationDate', 'Activation Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'clientDebitDate',
        'colHeader' : getLabel('clDebitDate', 'Client Debit Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'utrNmbr',
        'colHeader' : getLabel('utrNmbr', 'UTR No / RRN No.'),
        'hidden' : true,
        'sortable' : true
    } ],
    'W' : [ {
        'colId' : 'statusDesc',
        'colHeader' : getLabel('status', 'Status'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'effectiveDate',
        'colHeader' : getLabel('effDate', 'Effective Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'clientName',
        'colHeader' : getLabel('companyName', 'Company Name'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'paymentCategory',
        'colHeader' : getLabel('payCat', 'Payment Category'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalInstAmount',
        'colHeader' : getLabel('amt', 'Amount'),
        'colType' : 'number',
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalTxns',
        'colHeader' : getLabel('count', 'Count'),
        'colType' : 'count',
        'width' : 80,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'receivedDate',
        'colHeader' : getLabel('receivedOn', 'Received On'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totWarehouseInst',
        'colHeader' : getLabel('instInWareHouse', 'Instrument in Warehouse'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totWarehouseCancelInst',
        'colHeader' : getLabel('instCancelled', 'Instrument Cancelled'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'channelCode',
        'colHeader' : getLabel('channel', 'Channel'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fileName',
        'colHeader' : getLabel('fileName', 'File Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'reference',
        'colHeader' : getLabel('paymentqueue.reference', 'Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'cwPirNmbr',
        'colHeader' : getLabel('cashwebBatchNumber', 'Customer Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'paymentPkgName',
        'colHeader' : getLabel('payPackage', 'Payment Package'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'sendingAcc',
        'colHeader' : getLabel('sendAcc', 'Sending Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverName',
        'colHeader' : getLabel('receiverName', 'Receiver Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'dealReference',
        'colHeader' : getLabel('dealRef', 'Deal Ref'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fxRate',
        'colHeader' : getLabel('fxRate', 'FX Rate'),
        'colType' : 'number',
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerId',
        'colHeader' : getLabel('makerId', 'Maker Id'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerAction',
        'colHeader' : getLabel('chgType', 'Last Action Taken'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'changeDate',
        'colHeader' : getLabel('lblnewvalue', 'New Value'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverAcc',
        'colHeader' : getLabel('receiverAcc', 'Receiver Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBank',
        'colHeader' : getLabel('receiverBank', 'Receiver Bank'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBranch',
        'colHeader' : getLabel('receiverBranch', 'Receiver Branch'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'activationDate',
        'colHeader' : getLabel('activationDate', 'Activation Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'clientDebitDate',
        'colHeader' : getLabel('clDebitDate', 'Client Debit Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'processDate',
        'colHeader' : getLabel('processDate', 'Process Date'),
        'hidden' : true,
        'sortable' : true
    } ],
    'D' : [ {
        'colId' : 'statusDesc',
        'colHeader' : getLabel('status', 'Status'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'hostRemark',
        'colHeader' : getLabel('hostRemark', 'Host Remark'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'glAttempt',
        'colHeader' : getLabel('glAttempt', 'GL Attempt'),
        'colType' : 'number',
        'width' : 80,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'clientName',
        'colHeader' : getLabel('companyName', 'Company Name'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'productDescription',
        'colHeader' : getLabel('payProduct', 'Payment Product'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalInstAmount', // Debit Amount
        'colHeader' : getLabel('debitAmt', 'Debit Amount'),
        'colType' : 'number',
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalTxns',
        'colHeader' : getLabel('count', 'Count'),
        'colType' : 'number',
        'width' : 60,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'sendingAcc',
        'colHeader' : getLabel('debitAcc', 'Debit Account'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'processDate',
        'colHeader' : getLabel('debitDate', 'Debit Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receivedDate',
        'colHeader' : getLabel('receivedOn', 'Received On'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'paymentCategory',
        'colHeader' : getLabel('payCat', 'Payment Category'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fileName',
        'colHeader' : getLabel('fileName', 'File Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'reference',
        'colHeader' : getLabel('batchRef', 'Batch Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'debitAmount',
        'colHeader' : getLabel('amt', 'Amount'),
        'colType' : 'number',
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'channelCode',
        'colHeader' : getLabel('channel', 'Channel'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'cwPirNmbr',
        'colHeader' : getLabel('cashwebBatchNumber', 'Customer Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'pirNmbr',
        'colHeader' : getLabel('cashInBatchNo', 'Bank Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'paymentPkgName',
        'colHeader' : getLabel('payPackage', 'Payment Package'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'effectiveDate',
        'colHeader' : getLabel('effDate', 'Effective Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverName',
        'colHeader' : getLabel('receiverName', 'Receiver Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'dealReference',
        'colHeader' : getLabel('dealRef', 'Deal Ref'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fxRate',
        'colHeader' : getLabel('fxRate', 'FX Rate'),
        'colType' : 'number',
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerId',
        'colHeader' : getLabel('makerId', 'Maker Id'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerAction',
        'colHeader' : getLabel('chgType', 'Last Action Taken'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'changeDate',
        'colHeader' : getLabel('lblnewvalue', 'New Value'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverAcc',
        'colHeader' : getLabel('receiverAcc', 'Receiver Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBank',
        'colHeader' : getLabel('receiverBank', 'Receiver Bank'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBranch',
        'colHeader' : getLabel('receiverBranch', 'Receiver Branch'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'activationDate',
        'colHeader' : getLabel('activationDate', 'Activation Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'clientDebitDate',
        'colHeader' : getLabel('clDebitDate', 'Client Debit Date'),
        'hidden' : true,
        'sortable' : true
    },
    {
        'colId' : 'requestDateTime',
        'colHeader' : getLabel('requestDateTime', 'Request DateTime'),
        'hidden' : false,
        'sortable' : true
    },
    {
        'colId' : 'errorClassification',
        'colHeader' : getLabel('errorClassification', 'Error Classification'),
        'hidden' : (!Ext.isEmpty(ecEnable) && ecEnable == 'N')? true : false,
        'sortable' : true
    }],
    'Q' : [ {
        'colId' : 'statusDesc',
        'colHeader' : getLabel('status', 'Status'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'productDescription',
        'colHeader' : getLabel('payProduct', 'Payment Product'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'clientName',
        'colHeader' : getLabel('companyName', 'Company Name'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'totalInstAmount',
        'colHeader' : getLabel('batchAmt', 'Batch Amount'),
        'colType' : 'number',
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalTxns',
        'colHeader' : getLabel('count', 'Count'),
        'colType' : 'number',
        'width' : 80,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'sendingAcc',
        'colHeader' : getLabel('sendAcc', 'Sending Account'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'clientDebitDate',
        'colHeader' : getLabel('debitDate', 'Debit Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'processDate',
        'colHeader' : getLabel('processDate', 'Process Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'effectiveDate',
        'colHeader' : getLabel('effDate', 'Effective Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'channelCode',
        'colHeader' : getLabel('channel', 'Channel'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'paymentCategory',
        'colHeader' : getLabel('payCat', 'Payment Category'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fileName',
        'colHeader' : getLabel('fileName', 'File Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'reference',
        'colHeader' : getLabel('paymentqueue.reference', 'Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'cwPirNmbr',
        'colHeader' : getLabel('cashwebBatchNumber', 'Customer Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'pirNmbr',
        'colHeader' : getLabel('cashInBatchNo', 'Bank Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'paymentPkgName',
        'colHeader' : getLabel('payPackage', 'Payment Package'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverName',
        'colHeader' : getLabel('receiverName', 'Receiver Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'dealReference',
        'colHeader' : getLabel('dealRef', 'Deal Ref'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fxRate',
        'colHeader' : getLabel('fxRate', 'FX Rate'),
        'colType' : 'number',
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBank',
        'colHeader' : getLabel('receiverBank', 'Receiver Bank'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBranch',
        'colHeader' : getLabel('receiverBranch', 'Receiver Branch'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverAcc',
        'colHeader' : getLabel('receiverAcc', 'Receiver Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverAccType',
        'colHeader' : getLabel('receiverAccType', 'Receiver Account Type'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'bankRoutingNumber',
        'colHeader' : getLabel('routingNumber', 'Routing Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'activationDate',
        'colHeader' : getLabel('activationDate', 'Activation Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'effectiveTime',
        'colHeader' : getLabel('effectiveTime', 'Effective Time'),
        'hidden' : true,
        'sortable' : true
    } ],
    'R' : [ {
        'colId' : 'statusDesc',
        'colHeader' : getLabel('status', 'Status'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'rejectRemarks',
        'colHeader' : getLabel('rejectReason', 'Reject Reason'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'clientName',
        'colHeader' : getLabel('companyName', 'Company Name'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'paymentCategory',
        'colHeader' : getLabel('payCat', 'Payment Category'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalInstAmount',
        'colHeader' : getLabel('amt', 'Amount'),
        'colType' : 'number',
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalTxns',
        'colHeader' : getLabel('count', 'Count'),
        'colType' : 'number',
        'width' : 80,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'effectiveDate',
        'colHeader' : getLabel('effDate', 'Effective Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'receivedDate',
        'colHeader' : getLabel('receivedOn', 'Received On'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totVerifyInst',
        'colHeader' : getLabel('instRepair', 'Inst. For Repair'),
        'colType' : 'number',
        'width' : 100,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totVerifyCancelInst',
        'colHeader' : getLabel('instCancelled', 'Inst. Cancelled'),
        'colType' : 'number',
        'width' : 100,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'fileName',
        'colHeader' : getLabel('fileName', 'File Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'reference',
        'colHeader' : getLabel('batchRef', 'Batch Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'cwPirNmbr',
        'colHeader' : getLabel('cashwebBatchNumber', 'Customer Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'channelCode',
        'colHeader' : getLabel('channel', 'Channel'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'paymentPkgName',
        'colHeader' : getLabel('payPackage', 'Payment Package'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'sendingAcc',
        'colHeader' : getLabel('debitAcc', 'Debit Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverName',
        'colHeader' : getLabel('receiverName', 'Receiver Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'dealReference',
        'colHeader' : getLabel('dealRef', 'Deal Ref'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fxRate',
        'colHeader' : getLabel('fxRate', 'FX Rate'),
        'colType' : 'number',
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerId',
        'colHeader' : getLabel('makerId', 'Maker Id'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerAction',
        'colHeader' : getLabel('chgType', 'Last Action Taken'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'changeDate',
        'colHeader' : getLabel('lblnewvalue', 'New Value'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'activationDate',
        'colHeader' : getLabel('activationDate', 'Activation Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'clientDebitDate',
        'colHeader' : getLabel('clDebitDate', 'Client Debit Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'processDate',
        'colHeader' : getLabel('processDate', 'Process Date'),
        'hidden' : true,
        'sortable' : true
    } ],
    'C' : [ {
        'colId' : 'statusDesc',
        'colHeader' : getLabel('status', 'Status'),
        'width' : 200,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'processDate',
        'colHeader' : getLabel('processDate', 'Process Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'effectiveDate',
        'colHeader' : getLabel('effDate', 'Effective Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'productDescription',
        'colHeader' : getLabel('payProduct', 'Payment Product'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'clientName',
        'colHeader' : getLabel('companyName', 'Company Name'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalInstAmount',
        'colHeader' : getLabel('txnAmt', 'Txn Amount'),
        'colType' : 'number',
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalTxns',
        'colHeader' : getLabel('count', 'Count'),
        'colType' : 'number',
        'width' : 80,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'receivedDate',
        'colHeader' : getLabel('receivedOn', 'Received On'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'paymentCategory',
        'colHeader' : getLabel('payCat', 'Payment Category'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fileName',
        'colHeader' : getLabel('fileName', 'File Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'reference',
        'colHeader' : getLabel('batchRef', 'Batch Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'channelCode',
        'colHeader' : getLabel('channel', 'Channel'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'cwPirNmbr',
        'colHeader' : getLabel('cashwebBatchNumber', 'Customer Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'pirNmbr',
        'colHeader' : getLabel('cashInBatchNo', 'Bank Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'paymentPkgName',
        'colHeader' : getLabel('payPackage', 'Payment Package'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverName',
        'colHeader' : getLabel('receiverName', 'Receiver Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'dealReference',
        'colHeader' : getLabel('dealReference', 'Deal Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fxRate',
        'colHeader' : getLabel('fxRate', 'FX Rate'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerId',
        'colHeader' : getLabel('makerId', 'Maker Id'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'makerAction',
        'colHeader' : getLabel('chgType', 'Last Action Taken'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'changeDate',
        'colHeader' : getLabel('lblnewvalue', 'New Value'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'activationDate',
        'colHeader' : getLabel('activationDate', 'Activation Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'clientDebitDate',
        'colHeader' : getLabel('clDebitDate', 'Client Debit Date'),
        'hidden' : true,
        'sortable' : true
    } ],
    'CW' : [ {
        'colId' : 'statusDesc',
        'colHeader' : getLabel('status', 'Status'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'clientName',
        'colHeader' : getLabel('companyName', 'Company Name'),
        'hidden' : false,
        'width' : 200,
        'sortable' : true
    }, {
        'colId' : 'paymentCategory',
        'colHeader' : getLabel('payCat', 'Payment Category'),
        'width' : 120,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalInstAmount',
        'colHeader' : getLabel('amt', 'Amount'),
        'colType' : 'number',
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'totalTxns',
        'colHeader' : getLabel('count', 'Count'),
        'colType' : 'number',
        'width' : 50,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'effectiveDate',
        'colHeader' : getLabel('effDate', 'Effective Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'channelCode',
        'colHeader' : getLabel('channel', 'Channel'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'reference',
        'colHeader' : getLabel('batchRef', 'Batch Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fileName',
        'colHeader' : getLabel('fileName', 'File Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'cwPirNmbr',
        'colHeader' : getLabel('cashwebBatchNumber', 'Customer Batch Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'paymentPkgName',
        'colHeader' : getLabel('payPackage', 'Payment Package'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'sendingAcc',
        'colHeader' : getLabel('debitAcc', 'Debit Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverName',
        'colHeader' : getLabel('receiverName', 'Receiver Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'dealReference',
        'colHeader' : getLabel('dealReference', 'Deal Reference'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'fxRate',
        'colHeader' : getLabel('fxRate', 'FX Rate'),
        'colType' : 'number',
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverBranch',
        'colHeader' : getLabel('receiverBranchName', 'Receiver Branch Name'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverAcc',
        'colHeader' : getLabel('receiverAccNo', 'Receiver Account'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'receiverAccType',
        'colHeader' : getLabel('receiverAccType', 'Receiver Account Type'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'bankRoutingNumber',
        'colHeader' : getLabel('routingNumber', 'Routing Number'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'activationDate',
        'colHeader' : getLabel('activationDate', 'Activation Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'clientDebitDate',
        'colHeader' : getLabel('clDebitDate', 'Client Debit Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'processDate',
        'colHeader' : getLabel('processDate', 'Process Date'),
        'hidden' : true,
        'sortable' : true
    } ]
};

var gridStoreModel = getGridStoreModel();

function getGridStoreModel() {
	var storeModel = {
	    fields : [ 'history', 'clientName', 'reference', 'sendingAcc', 'productDescription', 'processDate', 'receivedDate',
	            'effectiveDate', 'totalInstAmount', 'totalTxns', 'nextDownloadSchedule', 'hostErrorCode', 'hostErrorReason',
	            'queueType', 'transactionType', 'statusDesc', 'status', 'makerAction', 'changeDate', 'identifier', 'cwPirNmbr',
	            'repairQueue', 'debitQueue', 'clearingQueue', 'myProduct', 'pirNmbr', 'clientId', '__metadata', '__subTotal',
	            'product', 'fileName', 'channelCode', 'paymentPkgName', 'makerId', 'glAttempt', 'verificationReason',
	            'totVerifyInst', 'totVerifyCancelInst', 'dealReference', 'batchCashinStatus', 'totWarehouseInst',
	            'totWarehouseCancelInst', 'fxRate', 'hostRemark', 'receiverName', 'remark', 'makerRemark', 'clientDebitDate',
	            'activationDate', 'receiverBank', 'receiverBranch', 'receiverAcc', 'txnStatus', 'rejectRemarks', 'paymentCategory',
	            'amount', 'customerStatus', 'companyID', 'sendingSeller', 'sendingFinSeller', 'sendingAccName', 'sendingAccNick',
	            'sendingCCY', 'receivingSeller', 'debitAmount', 'totalAmount', 'amountType', 'transitFileName', 'onUsFileName',
	            'templateName', 'clientFileName', 'entryDate', 'effectiveTime', 'utrNmbr','requestDatetime','errorClassification' ],
	    proxyUrl : 'getBankProcessingQueueList.srvc',
	    rootNode : 'd.bankProcessingQueue',
	    totalRowsNode : 'd.__count'
	};
	if (strPaymentQueueType === 'Q') {
		storeModel['proxyUrl'] = 'getBatchQueryData.srvc';
	}
	return storeModel;
}

var mapActions = {
    'V' : {
        'rowActions' : [ 'Verify', 'Cancel', 'Submit', 'Authorize', 'Reject' ],
        'groupActions' : [ 'Verify', 'Cancel', 'Submit', 'Authorize', 'Reject' ]
    },
    'W' : {
        'rowActions' : [ 'Advance', 'ChangeDate', 'Cancel', 'Submit', 'Authorize', 'Reject' ],
        'groupActions' : [ 'Advance', 'Cancel', 'Submit', 'Authorize', 'Reject' ]
    },
    'D' : {
        'rowActions' : [ 'ChangeDate', 'GLReattempt', 'ManualConfirm', 'ManualReject', 'ForceDebit', 'Cancel', 'Authorize',
                'Reject', 'Submit' ],
        'groupActions' : [ 'GLReattempt', 'ManualConfirm', 'ManualReject', 'ForceDebit', 'Cancel', 'Authorize', 'Reject', 'Submit' ]
    },
    'Q' : {
        'rowActions' : [],
        'groupActions' : []
    },
    'R' : {
        'rowActions' : [ 'Validate', 'Cancel', 'Submit', 'Authorize', 'Reject', 'LimitBurst' ],
        'groupActions' : [ 'Validate', 'Cancel', 'Submit', 'Authorize', 'Reject', 'LimitBurst' ]
    },
    'C' : {
        'rowActions' : [ 'Cancel', 'ChangeDate', 'Hold', 'Release', 'Submit', 'Authorize', 'Reject' ],
        'groupActions' : [ 'Cancel', 'Hold', 'Release', 'Submit', 'Authorize', 'Reject' ]
    },
    'L' : {
        'rowActions' : [ 'ChangeDate' ],
        'groupActions' : [ 'GLReattempt', 'Return', 'Authorize', 'Reject' ]
    },
    'CW' : {
        'rowActions' : [],
        'groupActions' : []
    }
};

var mapQueueActionModel = {
    'V' : {
        'Verify' : {
            itemText : getLabel('vqueue.verify', 'Verify'),
            text : getLabel('vqueue.verify', 'Verify'),
            actionName : 'verificationVerify',
            itemId : 'verificationVerify',
            maskPosition : 1
        },
        'Cancel' : {
            itemText : getLabel('vqueue.cancel', 'Cancel'),
            text : getLabel('vqueue.cancel', 'Cancel'),
            actionName : 'verificationCancle',
            itemId : 'verificationCancle',
            maskPosition : 2
        },
        'Submit' : {
            itemText : getLabel('vqueue.submit', 'Submit'),
            text : getLabel('vqueue.submit', 'Submit'),
            actionName : 'verifySubmit',
            itemId : 'verifySubmit',
            maskPosition : 5
        },
        'Authorize' : {
            itemText : getLabel('vqueue.authorize', 'Authorize'),
            text : getLabel('vqueue.authorize', 'Authorize'),
            actionName : 'accept',
            itemId : 'accept',
            maskPosition : 7
        },
        'Reject' : {
            itemText : getLabel('vqueue.reject', 'Reject'),
            text : getLabel('vqueue.reject', 'Reject'),
            actionName : 'reject',
            itemId : 'reject',
            maskPosition : 8
        }
    },
    'W' : {
        'Advance' : {
            itemText : getLabel('wqueue.advance', 'Advance'),
            text : getLabel('wqueue.advance', 'Advance'),
            actionName : 'warehouseAdvance',
            itemId : 'warehouseAdvance',
            maskPosition : 3
        },
        'Cancel' : {
            itemText : getLabel('wqueue.cancel', 'Cancel'),
            text : getLabel('wqueue.cancel', 'Cancel'),
            actionName : 'warehouseCancle',
            itemId : 'warehouseCancle',
            maskPosition : 2
        },
        'ChangeDate' : {
            itemText : getLabel('wqueue.ChangeDate', 'Change Date'),
            text : getLabel('wqueue.ChangeDate', 'Change Date'),
            actionName : 'changeDate',
            itemId : 'changeDate',
            maskPosition : 1
        },
        'DealChange' : {
            itemText : getLabel('wqueue.DealChange', 'Deal Change'),
            text : getLabel('wqueue.DealChange', 'Deal Change'),
            actionName : 'dealChange',
            itemId : 'dealChange',
            maskPosition : 4
        },
        'Submit' : {
            itemText : getLabel('wqueue.submit', 'Submit'),
            text : getLabel('wqueue.submit', 'Submit'),
            actionName : 'warehouseSubmit',
            itemId : 'warehouseSubmit',
            maskPosition : 5
        },
        'Authorize' : {
            itemText : getLabel('wqueue.authorize', 'Authorize'),
            text : getLabel('wqueue.authorize', 'Authorize'),
            actionName : 'accept',
            itemId : 'accept',
            maskPosition : 7
        },
        'Reject' : {
            itemText : getLabel('wqueue.reject', 'Reject'),
            text : getLabel('wqueue.reject', 'Reject'),
            actionName : 'reject',
            itemId : 'reject',
            maskPosition : 8
        }
    },
    'D' : {
        'ChangeDate' : {
            itemText : getLabel('dqueue.ChangeDate', 'Change Date'),
            text : getLabel('dqueue.ChangeDate', 'Change Date'),
            actionName : 'changeDate',
            itemId : 'changeDate',
            maskPosition : 1
        },
        'GLReattempt' : {
            itemText : getLabel('dqueue.GLReattempt', 'Retry'),
            text : getLabel('dqueue.GLReattempt', 'Retry'),
            actionName : 'reSend',
            itemId : 'reSend',
            maskPosition : 3
        },
        'ManualConfirm' : {
            itemText : getLabel('dqueue.ManualConfirm', 'Manual Confirm'),
            text : getLabel('dqueue.ManualConfirm', 'Manual Confirm'),
            actionName : 'confirm',
            itemId : 'confirm',
            maskPosition : 4
        },
        'ManualReject' : {
            itemText : getLabel('dqueue.ManualReject', 'Manual Reject'),
            text : getLabel('dqueue.ManualReject', 'Manual Reject'),
            actionName : 'debitReject',
            itemId : 'debitReject',
            maskPosition : 6
        },
        'ForceDebit' : {
            itemText : getLabel('dqueue.ForceDebit', 'Force Debit'),
            text : getLabel('dqueue.ForceDebit', 'Force Debit'),
            actionName : 'enforceDebit',
            itemId : 'enforceDebit',
            maskPosition : 5
        },
        'Cancel' : {
            itemText : getLabel('dqueue.Cancel', 'Cancel'),
            text : getLabel('dqueue.Cancel', 'Cancel'),
            actionName : 'cancelPayment',
            itemId : 'cancelPayment',
            maskPosition : 2
        },
        'Authorize' : {
            itemText : getLabel('dqueue.authorize', 'Authorize'),
            text : getLabel('dqueue.authorize', 'Authorize'),
            actionName : 'accept',
            itemId : 'accept',
            maskPosition : 7
        },
        'Reject' : {
            itemText : getLabel('dqueue.reject', 'Reject'),
            text : getLabel('dqueue.reject', 'Reject'),
            actionName : 'reject',
            itemId : 'reject',
            maskPosition : 8
        },
        'Submit' : {
            itemText : getLabel('dqueue.submit', 'Submit'),
            text : getLabel('dqueue.submit', 'Submit'),
            actionName : 'debitSubmit',
            itemId : 'debitSubmit',
            maskPosition : 13
        }
    },
    'R' : {
        'Validate' : {
            itemText : getLabel('rqueue.Validate', 'Validate'),
            text : getLabel('rqueue.Validate', 'Validate'),
            actionName : 'repairValidate',
            itemId : 'repairValidate',
            maskPosition : 1
        },
        'Cancel' : {
            itemText : getLabel('rqueue.cancel', 'Cancel'),
            text : getLabel('rqueue.cancel', 'Cancel'),
            actionName : 'repairReject',
            itemId : 'repairReject',
            maskPosition : 2
        },
        'Submit' : {
            itemText : getLabel('rqueue.submit', 'Submit'),
            text : getLabel('rqueue.submit', 'Submit'),
            actionName : 'repairSubmit',
            itemId : 'repairSubmit',
            maskPosition : 5
        },
        'Authorize' : {
            itemText : getLabel('rqueue.authorize', 'Authorize'),
            text : getLabel('rqueue.authorize', 'Authorize'),
            actionName : 'accept',
            itemId : 'accept',
            maskPosition : 7
        },
        'Reject' : {
            itemText : getLabel('rqueue.reject', 'Reject'),
            text : getLabel('rqueue.reject', 'Reject'),
            actionName : 'reject',
            itemId : 'reject',
            maskPosition : 8
        },
        'LimitBurst' : {
            itemText : getLabel('rqueue.limit', 'Limit Override'),
            text : getLabel('cqueue.limit', 'Limit Override'),
            actionName : 'repairLimit',
            itemId : 'repairLimit',
            maskPosition : 13
        }
    },
    'C' : {
        'Cancel' : {
            itemText : getLabel('cqueue.cancel', 'Cancel'),
            text : getLabel('cqueue.cancel', 'Cancel'),
            actionName : 'cancel',
            itemId : 'cancel',
            maskPosition : 2
        },
        'ChangeDate' : {
            itemText : getLabel('cqueue.ChangeDate', 'Change Date'),
            text : getLabel('cqueue.ChangeDate', 'Change Date'),
            actionName : 'changeDate',
            itemId : 'changeDate',
            maskPosition : 1
        },
        'Hold' : {
            itemText : getLabel('cqueue.hold', 'Hold'),
            text : getLabel('cqueue.hold', 'Hold'),
            actionName : 'hold',
            itemId : 'hold',
            maskPosition : 3
        },
        'Release' : {
            itemText : getLabel('cqueue.release', 'Release'),
            text : getLabel('cqueue.release', 'Release'),
            actionName : 'release',
            itemId : 'release',
            maskPosition : 4
        },
        'Submit' : {
            itemText : getLabel('cqueue.submit', 'Submit'),
            text : getLabel('cqueue.submit', 'Submit'),
            actionName : 'clearingSubmit',
            itemId : 'clearingSubmit',
            maskPosition : 5
        },
        'Authorize' : {
            itemText : getLabel('cqueue.authorize', 'Authorize'),
            text : getLabel('cqueue.authorize', 'Authorize'),
            actionName : 'accept',
            itemId : 'accept',
            maskPosition : 7
        },
        'Reject' : {
            itemText : getLabel('cqueue.reject', 'Reject'),
            text : getLabel('cqueue.reject', 'Reject'),
            actionName : 'reject',
            itemId : 'reject',
            maskPosition : 8
        }
    },
    'L' : {
        'ChangeDate' : {
            itemText : getLabel('liqueue.changeDate', 'Change Date'),
            text : getLabel('liqueue.changeDate', 'Change Date'),
            actionName : 'changeDate',
            itemId : 'changeDate',
            maskPosition : 1
        },
        'GLReattempt' : {
            itemText : getLabel('liqueue.GLReattempt', 'Retry'),
            text : getLabel('liqueue.GLReattempt', 'Retry'),
            actionName : 'reSend',
            itemId : 'reSend',
            maskPosition : 3
        },
        'Return' : {
            itemText : getLabel('liqueue.return', 'Return'),
            text : getLabel('liqueue.return', 'Return'),
            actionName : 'return',
            itemId : 'return',
            maskPosition : 4
        },
        'Authorize' : {
            itemText : getLabel('liqueue.authorize', 'Authorize'),
            text : getLabel('liqueue.authorize', 'Authorize'),
            actionName : 'accept',
            itemId : 'accept',
            maskPosition : 7
        },
        'Reject' : {
            itemText : getLabel('liqueue.reject', 'Reject'),
            text : getLabel('liqueue.reject', 'Reject'),
            actionName : 'reject',
            itemId : 'reject',
            maskPosition : 8
        }
    }
};
var mapRowActions = {
    'V' : [ 'btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark' ],
    'W' : [ 'btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark' ],
    'D' : [ 'btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark' ],
    'Q' : [ 'btnView' ],
    'R' : [ 'btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark' ],
    'C' : [ 'btnView', 'btnHistory', 'btnViewRemark', 'btnAddRemark' ],
    'L' : [ 'btnView', 'btnHistory', 'btnViewRemark' ],
    'CW' : [ 'btnView' ]
};
var mapRowActionModel = {
    'btnView' : {
        itemId : 'btnView',
        itemCls : 'grid-row-action-icon icon-view',
        toolTip : getLabel('viewToolTip', 'View Record'),
        itemLabel : getLabel('viewToolTip', 'View Record'),
        maskPosition : 9
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
    C : getLabel('clearingDownload', 'Clearing Download'),
    L : getLabel('hostRejected', 'Host Rejected'),
    W : getLabel('warehouseTxns', 'Warehouse'),
    Q : getLabel('lblbatchquery', 'Batch Query'),
    CW : getLabel('cashwebbatchquery', 'Cashweb Batch Query')
};

var arrQueues = getProcessingQueues();

function getProcessingQueues() {
	var retArr = null, arr = [ {
	    'code' : 'V',
	    'name' : getLabel('verification', 'Verification')
	}, {
	    'code' : 'W',
	    'name' : getLabel('warehouseTxns', 'Warehouse')
	}, {
	    'code' : 'D',
	    'name' : getLabel('debitTxns', 'Debit')
	}, {
	    'code' : 'R',
	    'name' : getLabel('repairTxns', 'Repair')
	}, {
	    'code' : 'C',
	    'name' : getLabel('clearingDownload', 'Clearing Download')
	}, {
	    'code' : 'L',
	    'name' : getLabel('hostRejected', 'Host Rejected')
	} ];
	if (strPaymentQueueType === 'Q' || strPaymentQueueType === 'CW')
		retArr = arr.concat([ {
		    'code' : 'Q',
		    'name' : getLabel('lblbatchquery', 'Batch Query')
		} ]);
	else
		retArr = arr;
	// Logic to check permissions for Queue
	availableQueues = availableQueues.split(",");
	var arrAvailableQueues = [];
	for (var i = 0; i < availableQueues.length; i++) {
		for (var j = 0; j < retArr.length; j++) {
			if (availableQueues[i] === retArr[j].code) {
				arrAvailableQueues.push(retArr[j]);
			}
		}
	}
	if (Ext.isEmpty(strPaymentQueueType)) {
		strPaymentQueueType = selectedQueue;
	}
	return arrAvailableQueues;
}

// For Advance Filter
var arrAmountOptFilter = [ {
    'key' : 'ge',
    'value' : '>='
}, {
    'key' : 'le',
    'value' : '<='
}, {
    'key' : 'eq',
    'value' : '='
}, {
    'key' : 'gt',
    'value' : '>'
}, {
    'key' : 'lt',
    'value' : '<'
} ];
var arrSortColumn = {
    'statusDesc' : 'statusDesc',
    'verificationReason' : 'verificationReason',
    'clientName' : 'clientName',
    'paymentCategory' : 'paymentCategory',
    'totalInstAmount' : 'totalInstAmount',
    'totalTxns' : 'totalTxns',
    'fxRate' : 'fxRate',
    'effectiveDate' : 'effectiveDate',
    'receivedDate' : 'receivedDate',
    'totVerifyInst' : 'totVerifyInst',
    'totVerifyCancelInst' : 'totVerifyCancelInst',
    'sendingAcc' : 'sendingAcc',
    'fileName' : 'fileName',
    'reference' : 'reference',
    'channelCode' : 'channelCode',
    'cwPirNmbr' : 'cwPirNmbr',
    'paymentPkgName' : 'paymentPkgName',
    'receiverName' : 'receiverName',
    'dealReference' : 'dealReference',
    'batchCashinStatus' : 'batchCashinStatus',
    'makerId' : 'makerId',
    'makerAction' : 'makerAction',
    'changeDate' : 'changeDate',
    'receiverAcc' : 'receiverAcc',
    'receiverBank' : 'receiverBank',
    'receiverBranch' : 'receiverBranch',
    'activationDate' : 'activationDate',
    'clientDebitDate' : 'clientDebitDate',
    'processDate' : 'processDate',
    'totWarehouseInst' : 'totWarehouseInst',
    'totWarehouseCancelInst' : 'totWarehouseCancelInst',
    'hostRemark' : 'hostRemark',
    'glAttempt' : 'glAttempt',
    'productDescription' : 'productDescription',
    'debitAmount' : 'debitAmount',
    'pirNmbr' : 'pirNmbr',
    'rejectRemarks' : 'rejectRemarks',
    'effectiveTime' : 'effectiveTime'
};
var arrShowCheckBoxColumn = {
    V : true,
    D : true,
    W : true,
    Q : false,
    R : true,
    C : true,
    L : true,
    CW : false
};
var arrBatchStatusData = {
    'V' : [ {
        'key' : 'All',
        'value' : 'All'
    }, {
        'key' : 1,
        'value' : 'For Verify'
    }, {
        'key' : 2,
        'value' : 'Instrument Pending Verification'
    }, {
        'key' : 3,
        'value' : 'Verified'
    }, {
        'key' : 4,
        'value' : 'For Auth'
    }, {
        'key' : 5,
        'value' : 'For MyAuth'
    }, {
        'key' : 6,
        'value' : 'Auth-Reject'
    }, {
        'key' : 7,
        'value' : 'Verification NA'
    }, {
        'key' : 8,
        'value' : 'Cancelled'
    }, {
        'key' : 9,
        'value' : 'For Submit'
    }, {
        'key' : 10,
        'value' : 'Batch Pending Verification'
    }, /*{
        'key' : 11,
        'value' : 'For Verify'
    }, */{
        'key' : 12,
        'value' : 'FraudHold'
    } ],
    'L' : [ {
        'key' : 'All',
        'value' : 'All'
    }, {
        'key' : 1,
        'value' : 'Liquidation Pending'
    }, {
        'key' : 4,
        'value' : 'For Auth'
    }, {
        'key' : 5,
        'value' : 'For MyAuth'
    }, {
        'key' : 6,
        'value' : 'Auth-Reject'
    } ],
    'D' : [ {
        'key' : 'All',
        'value' : 'All'
    }, {
        'key' : 1,
        'value' : 'Debit Pending'
    }, {
        'key' : 2,
        'value' : 'Debit Failed'
    }, {
        'key' : 4,
        'value' : 'For Auth'
    }, {
        'key' : 5,
        'value' : 'For MyAuth'
    }, {
        'key' : 6,
        'value' : 'Auth-Reject'
    }, {
        'key' : 8,
        'value' : 'Cancelled'
    }, {
        'key' : 9,
        'value' : 'For Submit'
    }, {
        'key' : 10,
        'value' : 'Batch Pending'
    }, {
        'key' : 11,
        'value' : 'Warehoused'
    }, {
        'key' : 12,
        'value' : 'For Cancel'
    } ],
    'W' : [ {
        'key' : 'All',
        'value' : 'All'
    }, {
        'key' : 1,
        'value' : 'Warehoused'
    }, {
        'key' : 2,
        'value' : 'Instruments Warehoused'
    }, {
        'key' : 3,
        'value' : 'Modified'
    }, {
        'key' : 4,
        'value' : 'For Auth'
    }, {
        'key' : 5,
        'value' : 'For MyAuth'
    }, {
        'key' : 6,
        'value' : 'Auth-Reject'
    }, {
        'key' : 7,
        'value' : 'Warehoused NA'
    }, {
        'key' : 8,
        'value' : 'Cancelled'
    }, {
        'key' : 9,
        'value' : 'For Submit'
    }, {
        'key' : 10,
        'value' : 'Batch Warehoused'
    } ],
    'R' : [ {
        'key' : 'All',
        'value' : 'All'
    }, {
        'key' : 1,
        'value' : 'For Repair'
    }, {
        'key' : 3,
        'value' : 'Ok'
    }, {
        'key' : 4,
        'value' : 'For Auth'
    }, {
        'key' : 5,
        'value' : 'For MyAuth'
    }, {
        'key' : 6,
        'value' : 'Auth-Reject'
    }, {
        'key' : 8,
        'value' : 'Cancelled'
    }, {
        'key' : 9,
        'value' : 'For Submit'
    } ],
    'Q' : [ {
        'key' : 'All',
        'value' : 'All'
    }, {
        'key' : 'MC',
        'value' : 'Manual Confirm'
    }, {
        'key' : 'MR',
        'value' : 'Manual Reject'
    }, {
        'key' : 'AA',
        'value' : 'After Auth'
    }, {
        'key' : 'GC',
        'value' : 'Debited'
    }, {
        'key' : 'MP',
        'value' : 'Partially Processed'
    }, {
        'key' : 'GP',
        'value' : 'Debit Pending'
    }, {
        'key' : 'SG',
        'value' : 'Downloaded'
    }, {
        'key' : 'PA',
        'value' : 'Print Auth'
    }, {
        'key' : 'PN',
        'value' : 'Print Entry'
    }, {
        'key' : 'RD',
        'value' : 'Pending Download'
    }, {
        'key' : 'LA',
        'value' : 'Processed'
    }, {
        'key' : 'RP',
        'value' : 'Ready for Printing'
    }, {
        'key' : 'LN',
        'value' : 'Liquidation Entry'
    }, {
        'key' : 'GR',
        'value' : 'Debit Failed'
    }, {
        'key' : 'BA',
        'value' : 'Before Auth'
    }, {
        'key' : 'C',
        'value' : 'Cancelled'
    }, {
        'key' : 'S',
        'value' : 'Stopped'
    }, {
        'key' : 'WC',
        'value' : 'Warehoused'
    } ],
    'C' : [ {
        'key' : 'All',
        'value' : 'All'
    }, {
        'key' : 1,
        'value' : 'Pending Download'
    }, {
        'key' : 3,
        'value' : 'Schedule Downloaded'
    }, {
        'key' : 4,
        'value' : 'For Auth'
    }, {
        'key' : 5,
        'value' : 'For MyAuth'
    }, {
        'key' : 6,
        'value' : 'Auth-Reject'
    }, {
        'key' : 7,
        'value' : 'Hold'
    }, {
        'key' : 8,
        'value' : 'Cancelled'
    }, {
        'key' : 9,
        'value' : 'For Submit'
    }, {
        'key' : 10,
        'value' : 'Batch Pending'
    }, {
        'key' : 13,
        'value' : 'Warehoused'
    } ],
    'CW' : [ {
        'key' : 'All',
        'value' : 'All'
    }, {
        'key' : '0',
        'value' : 'Draft'
    }, {
        'key' : '1',
        'value' : 'Pending Submit'
    }, {
        'key' : '2',
        'value' : 'Pending My Approval'
    }, {
        'key' : '3',
        'value' : 'Pending Approval'
    }, {
        'key' : '4',
        'value' : 'Pending Send'
    }, {
        'key' : '5',
        'value' : 'Rejected'
    }, {
        'key' : '6',
        'value' : 'On Hold'
    }, {
        'key' : '7',
        'value' : 'Sent To Bank'
    }, {
        'key' : '8',
        'value' : 'Deleted'
    }, {
        'key' : '9',
        'value' : 'Pending Repair'
    }, {
        'key' : '10',
        'value' : 'For Bank Send'
    }, {
        'key' : '11',
        'value' : 'Received at Bank'
    }, {
        'key' : '12',
        'value' : 'Check Issued'
    }, {
        'key' : '13',
        'value' : 'Debit Failed'
    }, {
        'key' : '14',
        'value' : 'Debited'
    }, {
        'key' : '15',
        'value' : 'Processed'
    }, {
        'key' : '16',
        'value' : 'Payment Failed'
    }, {
        'key' : '17',
        'value' : 'Rejected'
    }, {
        'key' : '18',
        'value' : 'Cancelled'
    }, {
        'key' : '19',
        'value' : 'For Stop Auth'
    }, {
        'key' : '20',
        'value' : 'Enabled'
    }, {
        'key' : '21',
        'value' : 'Disabled'
    }, {
        'key' : '22',
        'value' : 'Pending Enable Auth'
    }, {
        'key' : '23',
        'value' : 'Pending Disabled Auth'
    }, {
        'key' : '24',
        'value' : 'Submitted'
    }, {
        'key' : '25',
        'value' : 'Cancellation Auth'
    }, {
        'key' : '26',
        'value' : 'For Bank Send'
    }, {
        'key' : '27',
        'value' : 'Received At Bank'
    }, {
        'key' : '28',
        'value' : 'Debited'
    }, {
        'key' : '29',
        'value' : 'Stop Requested'
    }, {
        'key' : '31',
        'value' : 'Pending Verification'
    }, {
        'key' : '32',
        'value' : 'Verifier Rejected'
    }, {
        'key' : '109',
        'value' : 'Partially Verified'
    }, {
        'key' : '33',
        'value' : 'Enabled'
    }, {
        'key' : '34',
        'value' : 'Pending My Partial Auth'
    }, {
        'key' : '35',
        'value' : 'Partial Auth'
    }, {
        'key' : '43',
        'value' : 'WareHoused'
    }, {
        'key' : '50',
        'value' : 'Returned to Maker'
    }, {
        'key' : '44',
        'value' : 'Prenote Pending'
    }, {
        'key' : '45',
        'value' : 'Prenote Sent'
    }, {
        'key' : '46',
        'value' : 'Prenote Verified'
    }, {
        'key' : '47',
        'value' : 'Prenote Failed'
    }, {
        'key' : '49',
        'value' : 'Partial Prenote Pending'
    }, {
        'key' : '48',
        'value' : 'Hold Until'
    }, {
        'key' : '73',
        'value' : 'Modified Rejected'
    }, {
        'key' : '97',
        'value' : 'Mixed'
    }, {
        'key' : '75',
        'value' : 'Reversal Pending Auth'
    }, {
        'key' : '76',
        'value' : 'Reversal Aproved'
    }, {
        'key' : '77',
        'value' : 'Reversal Rejected'
    }, {
        'key' : '78',
        'value' : 'Reversal Pending My Auth'
    }, {
        'key' : '98',
        'value' : 'Under Process '
    } ]
};
if (PHYSICAL_PAY_APPLY == false) {
	arrBatchStatusData.CW.push({
	    'key' : '106',
	    'value' : 'Technical Return '
	}, {
	    'key' : '107',
	    'value' : 'Stopped'
	});
}
var errorStatusData =[
	{
        'key' : 'All',
        'value' : 'All'
    },{
        'key' : 'FU',
        'value' : getLabel('errorClassification.FU', 'Functional')
    },{
        'key' : 'TE',
        'value' : getLabel('errorClassification.TE', 'Technical')
}];