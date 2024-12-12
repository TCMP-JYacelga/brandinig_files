var LotClosureGridColumn = [ {
	'colId' : 'dispBankDesc',
	'colHeader' : getLabel('dispBankDesc', 'Bank'),
	'hidden' : false,
	'width' : 200,
	'sortable' : true
}, {
	'colId' : 'sysBranchDesc',
	'colHeader' : getLabel('sysBranchDesc', 'System Branch'),
	'hidden' : false,
	'width' : 200,
	'sortable' : true
}, {
	'colId' : 'clientDesc',
	'colHeader' : getLabel('clientDesc', 'Company Name'),
	'hidden' : false,
	'width' : 200,
	'sortable' : true
}, {
	'colId' : 'accountBranchDesc',
	'colHeader' : getLabel('accountBranchDesc', 'Client Linked Branch'),
	'hidden' : false,
	'width' : 200,
	'sortable' : true
}, {
	'colId' : 'productDesc',
	'colHeader' : getLabel('productDesc', 'Product'),
	'hidden' : false,
	'width' : 150,
	'sortable' : true
}, {
	'colId' : 'accountNmbr',
	'colHeader' : getLabel('accountNmbr', 'Actual Account'),
	'hidden' : false,
	'width' : 100,
	'sortable' : true
}, {
	'colId' : 'instrumentCode',
	'colHeader' : getLabel('instrumentCode', 'Instument Code'),
	'width' : 100,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'lotNmbr',
	'colHeader' : getLabel('lotNmbr', 'Lot Number'),
	'width' : 120,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'totalInstruments',
	'colHeader' : getLabel('totalInstruments', 'Total Instruments'),
	'colType' : 'number',
	'width' : 120,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'totalPrintedInst',
	'colHeader' : getLabel('totalPrintedInst', 'Total Printed Instruments'),
	'colType' : 'number',
	'width' : 150,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'totalWastedInst',
	'colHeader' : getLabel('totalWastedInst', 'Total Wasted Instruments'),
	'colType' : 'number',
	'width' : 150,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'totalUnusedInst',
	'colHeader' : getLabel('totalUnusedInst', 'Total Unused Instruments'),
	'colType' : 'number',
	'width' : 150,
	'hidden' : false,
	'sortable' : true
}, {
	'colId' : 'requestStateDesc',
	'colHeader' : getLabel('status', 'Status'),
	'width' : 120,
	'hidden' : false,
	'sortable' : false
} ];

var gridStoreModel = getGridStoreModel();

function getGridStoreModel() {
	var storeModel = {
		fields : [ 'accountBranch','accountBranchDesc','dispBankCode','dispBankDesc','clientCode','clientDesc','instrumentCode',
			'sysBranchCode','sysBranchDesc','accountNmbr','lotNmbr','productCode','productDesc','beanName','isSubmitted','validFlag',
			'sellerCode','totalPrintedInst','totalWastedInst','totalUnusedInst','totalInstruments','requestState','requestStateDesc',
			'lastRequestState','history','identifier','__metadata'],
		proxyUrl : 'services/lotClosureGridList.json',
		rootNode : 'd.profile',
		totalRowsNode : 'd.__count'
	};
	return storeModel;
}

var mapActions = {

	'rowActions' : [ 'Submit', 'Approve', 'Reject','Discard'],
	'groupActions' : [ 'Submit', 'Approve', 'Reject','Discard' ]

};

var mapLotClosureActionModel = {
	'Discard' : {
		    itemText : getLabel('discard', 'Discard'),
		    text : getLabel('discard', 'Discard'),
		    actionName : 'discard',
		    itemId : 'discard',
		    maskPosition : 2
			},
	'Submit' : {
		itemText : getLabel('submit', 'Submit'),
		text : getLabel('submit', 'Submit'),
		actionName : 'submit',
		itemId : 'submit',
		maskPosition : 3
	},
	'Approve' : {
		itemText : getLabel('accept', 'Approve'),
		text : getLabel('accept', 'Approve'),
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
	},
	

};
var mapRowActions = [ 'btnHistory' ];
var mapRowActionModel = {
		
	'btnHistory' : {
		itemId : 'btnHistory',
		itemCls : 'grid-row-action-icon icon-history',
		toolTip : getLabel('historyToolTip', 'View History'),
		itemLabel : getLabel('historyToolTip', 'View History'),
		maskPosition : 1
	}
};
