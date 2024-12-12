var ORDERING_PARTY_GENERIC_COLUMN_MODEL = [{
							"colId" : "clientDesc",
							"colHeader" : "Client",
						      width : 200
						}, {
							"colId" : "orderDescription",
							"colHeader" : "Ordering Party Name",
							width : 250
						}, {
							"colId" : "orderCode",
							"colHeader" : "Ordering Party ID",
							width : 200
						}, {
							"colId" : "requestStateDesc",
							"colHeader" : "Status",
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