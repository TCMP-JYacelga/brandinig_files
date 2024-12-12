var ORDERING_PARTY_GENERIC_COLUMN_MODEL = [{
							"colId" : "clientDesc",
							"colHeader" : getLabel('client', 'Company Name'),
							"colDesc"	: getLabel('client', 'Company Name'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":1,
						      width : 230
						}, {
							"colId" : "orderDescription",
							"colHeader" : getLabel('orderPartyName', 'Ordering Party Name'),
							"colDesc" : getLabel('orderPartyName', 'Ordering Party Name'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":2,
							width : 270
						}, {
							"colId" : "orderCode",
							"colHeader" : getLabel('orderingPartyID', 'Ordering Party ID'),
							"colDesc" : getLabel('orderingPartyID', 'Ordering Party ID'),
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":3,
							width : 230
						}, {
							"colId" : "requestStateDesc",
							"colHeader" : getLabel('status', 'Status'),
							"colDesc" : getLabel('status', 'Status'),
							"locked"	: false,
							"sortable"  :false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":4,
							width : 400
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
var arrStatus = 	[
 	  {
 		"code": "0",
 		"desc": "New"
 	  },
 	  {
 		"code": "3",
 		"desc": "Approved"
 	  },
 	  {
 		"code": "1",
 		"desc": "Modified"
 	  },	  
 	  {
 		"code": "4",
 		"desc": "Enable Request"
 	  },
 	  {
 		"code": "5",
 		"desc": "Suspend Request"
 	  },
 	  {
 		"code": "11",
 		"desc": "Suspended"
 	  },
 	  {
 		"code": "7",
 		"desc": "New Rejected"
 	  },
 	  {
 		"code": "8",
 		"desc": "Modified Rejected"
 	  },	  
 	  {
 		"code": "9",
 		"desc": "Suspend Request Rejected"
 	  },
 	  {
 		"code": "10",
 		"desc": "Enable Request Rejected"
 	  },
 	  {
 		"code": "12",
 		"desc": "Submitted"
      }
 	];