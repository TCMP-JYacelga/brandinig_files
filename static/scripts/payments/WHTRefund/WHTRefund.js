var WHTRefundGridColumn = [ {
	'colId' : 'clientDescription',
	'colHeader' : getLabel('companyName', 'Company Name'),
	'hidden' : false,
	'width' : 200,
	'sortable' : true
}, {
	'colId' : 'productDesc',
	'colHeader' : getLabel('productDesc', 'Product Description'),
	'hidden' : false,
	'width' : 200,
	'sortable' : true
}, {
	'colId' : 'customerAccountNo',
	'colHeader' : getLabel('custAccNo', 'Sending Account'),
	'hidden' : false,
	'width' : 200,
	'sortable' : true
}, {
	'colId' : 'chargePostingDate',
	'colHeader' : getLabel('chargePostingDate', 'Charge Posting Date'),
	'width' : 200,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'chargeReceiptNo',
	'colHeader' : getLabel('chargeReceiptNo', 'Charge Receipt'),
	'hidden' : false,
	'width' : 200,
	'sortable' : true
}, {
	'colId' : 'chargeAmount',
	'colHeader' : getLabel('chargeAmt', 'Charge Amount'),
	'colType' : 'number',
	'width' : 200,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'whtRate',
	'colHeader' : getLabel('whtRate', 'WHT Rate'),
	'width' : 200,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'whtAmount',
	'colHeader' : getLabel('whtAmt', 'WHT Amount'),
	'colType' : 'number',
	'width' : 200,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'refundDate',
	'colHeader' : getLabel('refundDate', 'Refund Date'),
	'width' : 200,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'requestStateDesc',
	'colHeader' : getLabel('statusId', 'Status'),
	'width' : 200,
	'hidden' : false,
	'sortable' : true
} ];

var gridStoreModel = getGridStoreModel();

function getGridStoreModel() {
	var storeModel = {
		fields : [ 'chargePostingDate','productCode','chargeReceiptNo','whtAmount','whtRate', 'clientId','sellerId','identifier','history','recordKeyNo','productDesc',
		           'postingJournalNmbr','refundJournalNmbr','requestStateDesc','chargeAmount','clientDescription','customerAccountNo','refundDate','__metadata'],
		proxyUrl : 'services/whtRefundGridList.json',
		rootNode : 'd.profile',
		totalRowsNode : 'd.__count'
	};
	return storeModel;
}

var mapActions = {

	'rowActions' : [ 'Submit Refund', 'Approve', 'Reject'],
	'groupActions' : [ 'Submit Refund', 'Approve', 'Reject' ]

};

var mapWHTRefundActionModel = {
	'Submit Refund' : {
		itemText : getLabel('submitRefund', 'Submit Refund'),
		text : getLabel('submitRefund', 'Submit Refund'),
		actionName : 'submit',
		itemId : 'submit',
		maskPosition : 3
	},
	'Approve' : {
		itemText : getLabel('accept', 'Accept'),
		text : getLabel('accept', 'Accept'),
		actionName : 'accept',
		itemId : 'accept',
		maskPosition : 4
	},
	'Reject' : {
		itemText : getLabel('reject', 'Reject'),
		text : getLabel('reject', 'Reject'),
		actionName : 'reject',
		itemId : 'reject',
		maskPosition : 5
	}

};
var mapRowActions = [ 'btnView', 'btnHistory' ];
var mapRowActionModel = {
	'btnView' : {
		itemId : 'btnView',
		itemCls : 'grid-row-action-icon icon-view',
		toolTip : getLabel('viewToolTip', 'View Record'),
		itemLabel : getLabel('viewToolTip', 'View Record'),
		maskPosition : 1
	},
	'btnHistory' : {
		itemId : 'btnHistory',
		itemCls : 'grid-row-action-icon icon-history',
		toolTip : getLabel('historyToolTip', 'View History'),
		itemLabel : getLabel('historyToolTip', 'View History'),
		maskPosition : 2
	}
};
