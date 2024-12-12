var USER_CATEGORY_GENERIC_COLUMN_MODEL = [{
							"colId" : "clientDesc",
							"colHeader" : getLabel('clientDesc','Client'),
						      width : 175
						}, {
							"colId" : "drawerId",
							"colHeader" : getLabel('payerCode','Payer Short Code'),
							width : 175
						}, {
							"colId" : "drawerName",
							"colHeader" : getLabel('payerName','Payer Name'),
							width : 175
						},{
							"colId" : "payerAcctNmbr",
							"colHeader" : getLabel('payerAcct','Payer Account'),
							width : 175,
							"hidden" : true
						},{
							"colId" : "payerAccountCcy",
							"colHeader" : getLabel('payerAcctCCY','Payer Account CCY'),
							width : 200,
							"hidden" : true
						},{
							"colId" : "requestStateDesc",
							"colHeader" : getLabel('status','Status'),
							"sortable":false,
							width : 150
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
                     		
var drawerStatus = 	[
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
                       		"code": "3.N",
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
                       	  }
                       	];