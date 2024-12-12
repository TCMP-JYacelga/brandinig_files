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
	{
		"colId" : "entityDesc",
		"colHeader" : getLabel('client', 'Company Name'),
		"hidden" : true
	},
	
	{
		"colId" : "genDateTimeStr",
		"colHeader" : getLabel('generationDate', 'Generation Date'),
		"hidden" : false
	},
	{
		"colId" : "srcDescription",
		"colHeader" : getLabel('reportName', 'Report Name'),
		"hidden" : false
	},
	{
		"colId" : "moduleName",
		"colHeader" : getLabel('moduleName', 'Module Name'),
		"hidden" : false
	},
	{
		"colId" : "fileName",
		"colHeader" : getLabel('fileName', 'File Name'),
		"hidden" : false
	},
	{
		"colId" : "size",
		"colHeader" : getLabel('size', 'Size'),
		"hidden" : false
	},
	{
		"colId" : "fileExtension",
		"colHeader" : getLabel('fileExtension', 'Del Info'),
		"hidden" : false
	},
	{
		"colId" : "reportTypeDesc",
		"colHeader" : getLabel('gridtype', 'Type'),
		"hidden" : false
	},
	{
		"colId" : "channelName",
		"colHeader" : getLabel('reportStatus', 'Status'),
		"hidden" : false
	}
];

var objGridWidthMap =
{
	"genDateTimeStr" : 150,
	"srcName" : 150,
	"moduleName" : 150,
	"fileName" : 150,
	"size" :150,
	"fileExtension" : 150,
	"reportTypeDesc" : 150,
	"channelName" :150,
	"srcDescription" : 150
};

var arrSortByPaymentFields =
[
	{
		"colId" : "recieverName",
		"colDesc" : getLabel('receiverName', 'Receiver Name')
	},
	{
		"colId" : "amount",
		"colDesc" : "Amount"
	},
	{
		"colId" : "count",
		"colDesc" : "Count"
	},
	{
		"colId" : "actionStatus",
		"colDesc" : "Status"
	},
	{
		"colId" : "productTypeDesc",
		"colDesc" : "My Product"
	},
	{
		"colId" : "activationDate",
		"colDesc" : "Effective Date"
	},
	{
		"colId" : "sendingAccount",
		"colDesc" : "Sending Account"
	},
	{
		"colId" : "templateName",
		"colDesc" : "Template Name"
	},
	{
		"colId" : "recieverAccount",
		"colDesc" : getLabel('receiverAccountCCY', 'Receiver Account + CCY')
	},
	{
		"colId" : "entryDate",
		"colDesc" : "Entry Date"
	},
	{
		"colId" : "valueDate",
		"colDesc" : "Process Date"
	},
	{
		"colId" : "client",
		"colDesc" : "Client Description"
	},
	{
		"colId" : "bankProduct",
		"colDesc" : "Bank Product"
	},
	{
		"colId" : "phdnumber",
		"colDesc" : "Tracking #"
	},
	{
		"colId" : "clientReference",
		"colDesc" : "Payment Reference"
	},
	{
		"colId" : "currency",
		"colDesc" : "Sending Account + CCY"
	},
	{
		"colId" : "creditAmount",
		"colDesc" : "Credit Amount"
	},
	{
		"colId" : "debitAmount",
		"colDesc" : "Debit Amount"
	},
	{
		"colId" : "txnType",
		"colDesc" : "Type of Transaction"
	},
	{
		"colId" : "maker",
		"colDesc" : "Entry User"
	},
	{
		"colId" : "hostMessage",
		"colDesc" : "Host Message"
	}
];
var arrPaymentStatus =
[
	{
		'code' : '0',
		'desc' : 'Draft'
	},
	{
		'code' : '1',
		'desc' : 'Pending Submit'
	},
	{
		'code' : '2',
		'desc' : 'Pending My Approval'
	},
	{
		'code' : '3',
		'desc' : 'Pending Approval'
	},
	{
		'code' : '4',
		'desc' : 'Pending Send'
	},
	{
		'code' : '5',
		'desc' : 'Rejected'
	},
	{
		'code' : '6',
		'desc' : 'On Hold'
	},
	{
		'code' : '7',
		'desc' : 'Sent To Bank'
	},
	{
		'code' : '8',
		'desc' : 'Deleted'
	},
	{
		'code' : '9',
		'desc' : 'Pending Repair'
	},
	{
		'code' : '13',
		'desc' : 'Debit Failed'
	},
	{
		'code' : '14',
		'desc' : 'Debited'
	},
	{
		'code' : '15',
		'desc' : 'Processed'
	},
	{
		'code' : '18',
		'desc' : 'Stopped'
	},
	{
		'code' : '19',
		'desc' : 'For Stop Auth'
	},
	{
		'code' : '28',
		'desc' : 'Debited'
	},
	{
		'code' : '43',
		'desc' : 'WareHoused'
	},
	{
		'code' : '75',
		'desc' : 'Reversal Pending Auth'
	},
	{
		'code' : '76',
		'desc' : 'Reversal Aproved'
	},
	{
		'code' : '77',
		'desc' : 'Reversal Rejected'
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
