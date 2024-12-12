var mapQueueGridColumn = {
    'I' : [ {
        'colId' : 'clientName',
        'colHeader' : getLabel('queryClientName', 'Client'),
        'width' : 150,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'productDescription',
        'colHeader' : getLabel('queryProduct', 'Payment Product'),
        'width' : 150,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'instAmount',
        'colHeader' : getLabel('instAmnt', 'Instrument Amount'),
        'colType' : 'number',
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'sendingAcc',
        'colHeader' : getLabel('querySendingAcc', 'Sending Account'),
        'width' : 150,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'statusDesc',
        'colHeader' : getLabel('queryStatus', 'Status'),
        'width' : 150,
        'hidden' : false,
        'sortable' : false
    }, {
        'colId' : 'receiverName',
        'colHeader' : getLabel('queryreceiverName', 'Receiver Name'),
        'width' : 150,
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'paymentLocation',
        'colHeader' : getLabel('queryPayLocation', 'Payment Location'),
        'width' : 150,
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'clientDebitDate',
        'colHeader' : getLabel('queryClientDrDate', 'Debit Date'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'processDate',
        'colHeader' : getLabel('queryProcessDt', 'Processing Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'effectiveDate',
        'colHeader' : getLabel('queryEffectiveDt', 'Effective Date'),
        'hidden' : false,
        'sortable' : true
    },{
        'colId' : 'scheduleNmbr',
        'colHeader' : getLabel('queryScheduleNmbr', 'Schedule Number'),
        'hidden' : false,
        'sortable' : true
    },{
        'colId' : 'batchReference',
        'colHeader' : getLabel('queryBatchRef', 'Batch Reference'),
        'hidden' : false,
        'sortable' : true
    }, {
        'colId' : 'liquidationBranch',
        'colHeader' : getLabel('queryLiquidationBranch', 'Liquidation Branch'),
        'width' : 150,
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'printBranch',
        'colHeader' : getLabel('queryPrintBranch', 'Print Branch'),
        'width' : 150,
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'liquidationDate',
        'colHeader' : getLabel('queryLiquidationDt', 'Liquidation Date'),
        'hidden' : true,
        'sortable' : true
    }, {
        'colId' : 'cwInstNmbr',
        'colHeader' : getLabel('queryInstNmbr', 'Instrument Number'),
        'width' : 150,
        'hidden' : true,
        'sortable' : true
    } ]
};

var gridStoreModel = getGridStoreModel();

function getGridStoreModel() {
    var storeModel = {
        fields : [ 'instStatus', 'instAmount', 'cwInstNmbr', 'clientId', 'clientName', 'sendingAcc', 'clientDebitDate',
                'processDate', 'effectiveDate', 'scheduleNmbr','paymentPkgName', 'product', 'productDescription', 'paymentPkgName', 'pirNmbr',
                'cwPirNmbr', 'batchReference', 'receiverName', 'paymentLocation', 'liquidationBranch', 'printBranch',
                'liquidationDate', 'utrNmbr', 'queueType', 'sourceType', 'statusDesc', 'identifier', '__metadata', '__subTotal' ],
        proxyUrl : 'getPaymentInstQueryData.srvc',
        rootNode : 'd.bankProcessingQueueInst',
        totalRowsNode : 'd.__count'
    };
    return storeModel;
}

var mapActions = {
    'I' : {
        'rowActions' : [],
        'groupActions' : []
    }
};

var mapQueueActionModel = {};
var mapRowActions = {
    'I' : [ 'btnView' ]
};
var mapRowActionModel = {
    'btnView' : {
        itemId : 'btnView',
        itemCls : 'grid-row-action-icon icon-view',
        toolTip : getLabel('viewToolTip', 'View Record'),
        itemLabel : getLabel('viewToolTip', 'View Record'),
        maskPosition : 9
    }
};
var arrPmtQueueType = {
    I : getLabel('cashwebinstquery', 'Instrument Query')
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

    if (strPaymentQueueType === 'I') {
        retArr = arr.concat([ {
            'code' : 'I',
            'name' : getLabel('lblInstquery', 'Instrument Query')
        } ]);
    }
    else {
        retArr = arr;
    }
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
        strPaymentQueueType = arrAvailableQueues[0].code;
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
    'clientName' : 'clientName',
    'productDescription' : 'productDescription',
    'instAmount' : 'instAmount',
    'sendingAcc' : 'sendingAcc',
    'receiverName' : 'receiverName',
    'paymentLocation' : 'paymentLocation',
    'clientDebitDate' : 'clientDebitDate',
    'processDate' : 'processDate',
    'effectiveDate' : 'effectiveDate',
    'scheduleNmbr' : 'scheduleNmbr',
    'batchReference' : 'batchReference',
    'liquidationBranch' : 'liquidationBranch',
    'printBranch' : 'printBranch',
    'liquidationDate' : 'liquidationDate',
    'cwInstNmbr' : 'cwInstNmbr'
};
var arrShowCheckBoxColumn = {
    I : false
};
var arrInstStatusData = {
    'I' : [ {
        'key' : 'All',
        'value' : 'All'
    }, {
        'key' : 'CA',
        'value' : 'Cancel Auth'
    }, {
        'key' : 'SCA',
        'value' : 'Stop Payment Confirm Auth'
    }, {
        'key' : 'SCE',
        'value' : 'Stop Payment Confirm'
    }, {
        'key' : 'CE',
        'value' : 'Cancel Entry'
    }, {
        'key' : 'SN',
        'value' : 'Stop Payment Entry'
    }, {
        'key' : 'SA',
        'value' : 'Stop Payment Auth'
    }, {
        'key' : 'LA',
        'value' : 'Liquidation Auth'
    }, {
        'key' : 'SG',
        'value' : 'Schedule Generated'
    }, {
        'key' : 'RD',
        'value' : 'Ready for Schedule'
    }, {
        'key' : 'RP',
        'value' : 'Ready for Printing'
    }, {
        'key' : 'DP',
        'value' : 'Deffered Printing'
    },{
        'key' : 'LN',
        'value' : 'Liquidation Entry'
    }, {
        'key' : 'GP',
        'value' : 'Debit Pending'
    }, {
        'key' : 'GR',
        'value' : 'Debit Failed'
    } , {
        'key' : 'MR',
        'value' : 'Manual Reject'
    }, {
        'key' : 'LT',
        'value' : 'Technical Return'
    }]
};
var arrRequestTypeData = {
    'I' : [ {
        'key' : 'S',
        'value' : 'Stop Pay'
    }, {
        'key' : 'C',
        'value' : 'Cancel'
    } ]
}
