/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var actionsForWidget =
[
	'Submit', 'Discard', 'Enable', 'Disable'
];
var REPORT_GENERIC_COLUMN_MODEL =
[
	/*{
	"colId" : "entityDesc",
	"colHeader" : "Client",
	"hidden" : false
	},
	*/
	{
		"colId" : "genDateTimeStr",
		"colHeader" : getLabel("genDateTimeStr","Generation Date"),
		"hidden" : false
	},
	{
		"colId" : "srcDescription",
		"colHeader" : getLabel("srcName","Report Name"),
		"hidden" : false
	},
	{
		"colId" : "moduleName",
		"colHeader" : getLabel("moduleName","Module Name"),
		"hidden" : false
	},
	{
		"colId" : "fileName",
		"colHeader" : getLabel("fileName","File Name"),
		"hidden" : false
	},
	{
		"colId" : "size",
		"colHeader" : getLabel("size","Size"),
		"hidden" : false
	},
	{
		"colId" : "fileExtension",
		"colHeader" : getLabel("fileExtension","File Format"),
		"hidden" : false
	},
	{
		"colId" : "reportTypeDesc",
		"colHeader" : getLabel("reportTypeDesc","Report Type"),
		"hidden" : false
	}
];

var objGridWidthMap =
{
	"genDateTimeStr" : 145,
	"srcName" : 170,
	"moduleName" : 100,
	"fileName" : 170,
	"size" : 130,
	"fileExtension" : 60,
	"reportTypeDesc" : 75,
	"channelName" : 85
};

var arrSortByPaymentFields =
[
	{
		"colId" : "recieverName",
		"colDesc" : getLabel("recieverName","Receiver Name")
	},
	{
		"colId" : "amount",
		"colDesc" : getLabel("amount","Amount")
	},
	{
		"colId" : "count",
		"colDesc" : getLabel("count","Count")
	},
	{
		"colId" : "actionStatus",
		"colDesc" : getLabel("actionStatus","Status")
	},
	{
		"colId" : "productTypeDesc",
		"colDesc" : getLabel("productTypeDesc","My Product")
	},
	{
		"colId" : "activationDate",
		"colDesc" : getLabel("activationDate","Effective Date")
	},
	{
		"colId" : "sendingAccount",
		"colDesc" : getLabel("sendingAccount","Sending Account")
	},
	{
		"colId" : "templateName",
		"colDesc" : getLabel("templateName","Template Name")
	},
	{
		"colId" : "recieverAccount",
		"colDesc" : getLabel("recieverAccount","Receiver Account + CCY")
	},
	{
		"colId" : "entryDate",
		"colDesc" : getLabel( "entryDate","Entry Date")
	},
	{
		"colId" : "valueDate",
		"colDesc" : getLabel("valueDate","Process Date")
	},
	{
		"colId" : "client",
		"colDesc" : getLabel("client","Client Description")
	},
	{
		"colId" : "bankProduct",
		"colDesc" : getLabel("bankProduct","Bank Product")
	},
	{
		"colId" : "phdnumber",
		"colDesc" : getLabel("phdnumber","Tracking #")
	},
	{
		"colId" : "clientReference",
		"colDesc" : getLabel("clientReference","Payment Reference")
	},
	{
		"colId" : "currency",
		"colDesc" : getLabel("currency","Sending Account + CCY")
	},
	{
		"colId" : "creditAmount",
		"colDesc" : getLabel("creditAmount","Credit Amount")
	},
	{
		"colId" : "debitAmount",
		"colDesc" : getLabel("debitAmount","Debit Amount")
	},
	{
		"colId" : "txnType",
		"colDesc" : getLabel("txnType","Type of Transaction")
	},
	{
		"colId" : "maker",
		"colDesc" : getLabel("maker","Entry User")
	},
	{
		"colId" : "hostMessage",
		"colDesc" : getLabel("hostMessage","Host Message")
	}
];
var arrPaymentStatus =
[
	{
		'code' : '0',
		'desc' : getLabel('drafeStatus','Draft')
	},
	{
		'code' : '1',
		'desc' : getLabel('pendingSubmitStatus','Pending Submit')
	},
	{
		'code' : '2',
		'desc' : getLabel('pendingMApprovalStatus','Pending My Approval')
	},
	{
		'code' : '3',
		'desc' : getLabel('PendingApprovalStatus','Pending Approval')
	},
	{
		'code' : '4',
		'desc' : getLabel('pendingSendStatus','Pending Send')
	},
	{
		'code' : '5',
		'desc' : getLabel('rejectedStatus','Rejected')
	},
	{
		'code' : '6',
		'desc' : getLabel('onHoldStatus','On Hold')
	},
	{
		'code' : '7',
		'desc' : getLabel('sentToBnkStatus','Sent To Bank')
	},
	{
		'code' : '8',
		'desc' : getLabel('deletedStatus','Deleted')
	},
	{
		'code' : '9',
		'desc' : getLabel('PendingrepairStatus','Pending Repair')
	},
	{
		'code' : '13',
		'desc' : getLabel('debitFailedStatus','Debit Failed')
	},
	{
		'code' : '14',
		'desc' : getLabel('debitedStatus','Debited')
	},
	{
		'code' : '15',
		'desc' : getLabel('processedStatus','Processed')
	},
	{
		'code' : '18',
		'desc' : getLabel('stoppedStatus','Stopped')
	},
	{
		'code' : '19',
		'desc' : getLabel('ForStopAuthStatus','For Stop Auth')
	},
	{
		'code' : '28',
		'desc' : getLabel('debitedStatus','Debited')
	},
	{
		'code' : '43',
		'desc' : getLabel('wareHousedStatus','WareHoused')
	},
	{
		'code' : '75',
		'desc' : getLabel('ReversalPendingAauth','Reversal Pending Auth')
	},
	{
		'code' : '76',
		'desc' : getLabel('reversalApproved','Reversal Aproved')
	},
	{
		'code' : '77',
		'desc' : getLabel('reversalRejected','Reversal Rejected')
	}
];

var arrActionColumnStatus =
[
	[
		'0', 'Draft'
	],
	[
		'1', 'Pending Submit'
	],
	[
		'2', 'Pending My Approval'
	],
	[
		'3', 'Pending Approval'
	],
	[
		'4', 'Pending Send'
	],
	[
		'5', 'Rejected'
	],
	[
		'6', 'On Hold'
	],
	[
		'7', 'Sent To Bank'
	],
	[
		'8', 'Deleted'
	],
	[
		'9', 'Pending Repair'
	],
	[
		'13', 'Debit Failed'
	],
	[
		'14', 'Debited'
	],
	[
		'15', 'Processed'
	],
	[
		'18', 'Stopped'
	],
	[
		'19', 'For Stop Auth'
	],
	[
		'28', 'Debited'
	],
	[
		'43', 'WareHoused'
	],
	[
		'75', 'Reversal Pending Auth'
	],
	[
		'76', 'Reversal Aproved'
	],
	[
		'77', 'Reversal Rejected'
	],
	[
		'78', 'Reversal Pending My Auth'
	]
];