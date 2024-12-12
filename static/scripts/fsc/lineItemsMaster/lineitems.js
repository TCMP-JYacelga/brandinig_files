var USER_CATEGORY_GENERIC_COLUMN_MODEL = [ {
							"colId" : "clientDesc",
							"colHeader" : getLabel('companyname', 'Company Name'),
							"colDesc"	: getLabel('companyname', 'Company Name'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: false,
							"colSequence":1,
							width : 250
						},{
							"colId" : "scfPackage",
							"colHeader" : getLabel('scfpackage', 'Package'),
							"colDesc"	: getLabel('scfpackage', 'Package'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: false,
							"colSequence":2,
							width : 250
						}, {
							"colId" : "lineDesc",
							"colHeader" : getLabel('lineItemDesc', 'Description'),
							"colDesc"	: getLabel('lineItemDesc', 'Description'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":4,
							width : 200
						},  {
							"colId" : "requestStateDesc",
							"colHeader" : getLabel('Status', 'Status'),
							"colDesc"	: getLabel('Status', 'Status'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"sortable":false,
							"colSequence":5,
							width : 130
						}];




var arrActionColumnStatus = [['0', 'Draft'], ['1', 'Pending Submit'],
                     		['2', 'Pending My Approval'], ['3', 'Pending Approval'],
                     		['4', 'Pending Send'], ['5', 'Rejected'], ['6', 'On Hold'],
                     		['7', 'Sent To Bank'], ['8', 'Deleted'], ['9', 'Pending Repair'],
                     		['13', 'Debit Failed'], ['14', 'Debited'], ['15', 'Processed'],
                     		['18', 'Stopped'], ['19', 'For Stop Auth'],
                     		['43', 'WareHoused'], ['75', 'Reversal Pending Auth'],
                     		['76', 'Reversal Aproved'], ['77', 'Reversal Rejected'],
                     		['78', 'Reversal Pending My Auth']];