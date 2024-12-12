var objDefaultAdminGridViewPref =
[
	{
		"pgSize" : 50,
		"gridCols" :
		[
		 	{
		 		"colId" : "clientDesc",
				"colHeader" : "Company Name"
		 	},
			{
				"colId" : "depositTicketNmbr",
				"colHeader" : "Deposit Ticket No."
			},
			{
				"colId" : "depSeqNmbr",
				"colHeader" : "Seq. No."
			},
			{
				"colId" : "depositAmount",
				"colHeader" : "Deposit Amount",
				"colType" : "number"
			},
			{
				"colId" : "itemCount",
				"colHeader" : "Items Count"
			},
			{
				"colId" : "depositAccount",
				"colHeader" : "Deposit Account"
			},
			{
				"colId" : "postingDate",
				"colHeader" : "Deposit Date"
			},
			{
				"colId" : "lockBoxId",
				"colHeader" : "Lockbox ID"
			}
		]
	}
];

var objDefaultClientGridViewPref =
	[
		{
			"pgSize" : 50,
			"gridCols" :
			[
				{
					"colId" : "depositTicketNmbr",
					"colHeader" : "Deposit Ticket No."
				},
				{
					"colId" : "depSeqNmbr",
					"colHeader" : "Seq. No."
				},
				{
					"colId" : "depositAmount",
					"colHeader" : "Deposit Amount",
					"colType" : "number"
				},
				{
					"colId" : "itemCount",
					"colHeader" : "Items Count"					
				},
				{
					"colId" : "depositAccount",
					"colHeader" : "Deposit Account"
				},
				{
					"colId" : "postingDate",
					"colHeader" : "Deposit Date"
				},
				{
					"colId" : "lockBoxId",
					"colHeader" : "Lockbox ID"
				}
			]
	}
];

var arrSortColumnReport = {
		'depositTicketNmbr' : 'depositTicketNmbr',
		'depositAccount' : 'depositAccount',
		'depositAmount' : 'depositAmount',
		'itemCount' : 'itemCount',
		'postingDate' : 'postingDate',
		'depSerialNmbr' : 'depSerialNmbr',
		'lockBoxId' : 'lockBoxId',
		'depSeqNmbr' : 'depSeqNmbr'
	};
	
if(entity_type === '0')
{
	var DEPOSIT_GENERIC_COLUMN_MODEL=[{
		"colId" : "clientDesc",
		"colHeader" : getLabel('client', 'Company Name'),
		"colDesc"	: getLabel('client', 'Company Name'),
		"locked"	: false,
		"hidden"	: false,
		"hideable"	: true,
		"colSequence":1,
		 width : 120
	},{
		"colId" : "depositAccount",
		"colHeader" : getLabel('depositAccount','Deposit Account'),
		"colDesc"	: getLabel('depositAccount','Deposit Account'),
		"locked"	: false,
		"hidden"	: false,
		"hideable"	: true,
		"colSequence":3,
		 width : 130
	},{
		"colId" : "postingDate",
		"colHeader" : getLabel('postingDate','Posting Date'),
		"colDesc"	: getLabel('postingDate','Posting Date'),
		"locked"	: false,
		"hidden"	: false,
		"hideable"	: true,
		"colSequence":5,
		 width : 100
	}]
	
	if(filterFields.indexOf('depositTicket') !== -1)
	{
		DEPOSIT_GENERIC_COLUMN_MODEL.push({
			"colId" : "depositTicketNmbr",
			"colHeader" : getLabel('depositTicketNmbr','Deposit Ticket No.'),
			"colDesc"	: getLabel('depositTicketNmbr','Deposit Ticket No.'),
			"locked"	: false,
			"hidden"	: false,
			"hideable"	: true,
			"colSequence":2,
			 width : 160
		});
	}
	if(filterFields.indexOf('depositAmount') !== -1)
	{
		DEPOSIT_GENERIC_COLUMN_MODEL.push({
			"colId" : "depositAmount",
			"colHeader" : getLabel('depositAmount','Deposit Amount'),
			"colDesc"	: getLabel('depositAmount','Deposit Amount'),
			"locked"	: false,
			"hidden"	: false,
			"hideable"	: true,
			"colSequence":4,
			 width : 140
		});
	}
	if(filterFields.indexOf('lockBoxNmbr') !== -1)
	{
		DEPOSIT_GENERIC_COLUMN_MODEL.push({
			"colId" : "lockBoxId",
			"colHeader" : getLabel('StorelockBoxId','Store Id/Lockbox'),
			"colDesc"	: getLabel('StorelockBoxId','Store Id/Lockbox'),
			"locked"	: false,
			"hidden"	: false,
			"hideable"	: true,
			"colSequence":6,
			 width : 150
		});
	}
}
else
{
	var DEPOSIT_GENERIC_COLUMN_MODEL=[{
		"colId" : "depositAccount",
		"colHeader" : getLabel('depositAccount','Deposit Account'),
		"colDesc"	: getLabel('depositAccount','Deposit Account'),
		"locked"	: false,
		"hidden"	: false,
		"hideable"	: true,
		"colSequence":2,
		 width : 130
	},{
		"colId" : "postingDate",
		"colHeader" : getLabel('postingDate','Posting Date'),
		"colDesc"	: getLabel('postingDate','Posting Date'),
		"locked"	: false,
		"hidden"	: false,
		"hideable"	: true,
		"colSequence":4,
		 width : 100
	}]
	if(filterFields.indexOf('depositTicket') !== -1)
	{
		DEPOSIT_GENERIC_COLUMN_MODEL.push({
			"colId" : "depositTicketNmbr",
			"colHeader" : getLabel('depositTicketNmbr','Deposit Ticket No.'),
			"colDesc"	: getLabel('depositTicketNmbr','Deposit Ticket No.'),
			"locked"	: false,
			"hidden"	: false,
			"hideable"	: true,
			"colSequence":1,
			 width : 160
		});
	}
	if(filterFields.indexOf('depositAmount') !== -1)
	{
		DEPOSIT_GENERIC_COLUMN_MODEL.push({
			"colId" : "depositAmount",
			"colHeader" : getLabel('depositAmount','Deposit Amount'),
			"colDesc"	: getLabel('depositAmount','Deposit Amount'),
			"locked"	: false,
			"hidden"	: false,
			"hideable"	: true,
			"colSequence":3,
			 width : 140
		});
	}
	if(filterFields.indexOf('lockBoxNmbr') !== -1)
	{
		DEPOSIT_GENERIC_COLUMN_MODEL.push({
			"colId" : "lockBoxId",
			"colHeader" : getLabel('StorelockBoxId','Store Id/Lockbox'),
			"colDesc"	: getLabel('StorelockBoxId','Store Id/Lockbox'),
			"locked"	: false,
			"hidden"	: false,
			"hideable"	: true,
			"colSequence":5,
			 width : 150
		})
	}
}
	
