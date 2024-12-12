var AVM_SVM_GENERIC_COLUMN_MODEL=[{
					"colId" : "clientDesc",
					"colHeader" : getLabel('avmsvm.client','Company Name'),
					"colDesc"	: getLabel('avmsvm.client','Company Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1,
				     width : 230						
				}, {
					"colId" : "axmType",
					"colHeader" : getLabel('avmsvm.matrixType', 'Matrix Type'),
					"colDesc"	: getLabel('avmsvm.matrixType', 'Matrix Type'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2,
					 width : 270
				}, {
					"colId" : "axmName",
					"colHeader" : getLabel('avmsvm.matrixName', 'Matrix Name'),
					"colDesc"	: getLabel('avmsvm.matrixName', 'Matrix Name'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3,
					 width : 270
				}, {
					"colId" : "axmCurrency",
					"colHeader" : getLabel('avmsvm.currency', 'Currency'),
					"colDesc" : getLabel('avmsvm.currency', 'Currency'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4,
					 width : 180
				}, {
					"colId" : "noOfSlabs",
					"colHeader" : getLabel('avmsvm.tiers', 'Number of Amount Tiers'),
					"colDesc" : getLabel('avmsvm.tiers', 'Number of Amount Tiers'),
					"colType" : "number",
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5,
					 width : 180
				}, {
					"colId" : "requestStateDesc",
					"colHeader" : getLabel('avmsvm.status', 'Status'),
					"colDesc" : getLabel('avmsvm.status', 'Status'),
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6,
					 width : 180
				}]
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