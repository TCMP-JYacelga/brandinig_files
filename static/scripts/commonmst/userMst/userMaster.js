var USER_GENERIC_COLUMN_MODEL =[];
if (entity_type === '0')
{
	 USER_GENERIC_COLUMN_MODEL = [{
					"colId" : "corporationDesc",
					"colHeader" : "Corporation",
					"width" : 200,
					"hidden" : false
				}, {
					"colId" : "usrDescription",
					"colHeader" : "User Name",
					"width" : 200,
					"hidden" : false
				}, {
					"colId" : "usrCode",
					"colHeader" : "Login ID",
					"width" : 200,
					"hidden" : false
				}, {
					"colId" : "usrCategory",
					"colHeader" : "Role",
					"width" : 200,
					"hidden" : false
				},{
					"colId" : "requestStateDesc",
					"colHeader" : "Status",
					"width" : 150,
					"locked" : false,
					"lockable" : false,
					"sortable" : false,
					"hideable" : false,
					"resizable" : false,
					"draggable" : false,
					"hidden" : false
				},{
					"colId" : "checkLoginStatus",
					"colHeader" : "Login Status",
					"width" : 150,
					"hidden" : false
				},{
					"colId" : "makerId",
					"colHeader" : "Created By",
					"hidden" : false
				},
					{
					"colId" : "makerStamp",
					"colHeader" : "Date Created",
					"width" : 150,
					"hidden" : true
				},{
					"colId" : "checkerId",
					"colHeader" : "Approved By",
					"hidden" : false
				},{
					"colId" : "usrFirstName",
					"colHeader" : "User First Name",
					"width" : 150,
					"hidden" : true
				},{
					"colId" : "usrLastName",
					"colHeader" : "User Last Name",
					"width" : 150,
					"hidden" : true
				},{
					"colId" : "department",
					"colHeader" : "Department",
					"width" : 150,
					"hidden" : true
				},{
					"colId" : "usrLastLogon",
					"colHeader" : "Last Access Date/Time",
					"width" : 150,
					"hidden" : true
				}
				];
}				
else
{
 USER_GENERIC_COLUMN_MODEL = [{
						"colId" : "usrDescription",
						"colHeader" : "User Name",
						"width" : 200
					}, {
						"colId" : "usrCode",
						"colHeader" : "Login ID",
						"width" : 200
					}, {
						"colId" : "usrCategory",
						"colHeader" : "Role",
						"width" : 200
					},{
						"colId" : "requestStateDesc",
						"colHeader" : "Status",
						"width" : 150,
						"locked" : false,
						"lockable" : false,
						"sortable" : false,
						"hideable" : false,
						"resizable" : false,
						"draggable" : false,
						"hidden" : false
					},{
						"colId" : "checkLoginStatus",
						"colHeader" : "Login Status",
						"width" : 70,
						"hidden" : false
					},{
						    "colId" : "makerId",
							"colHeader" : "Created By",
							"hidden" : false
						},{
						"colId" : "makerStamp",
						"colHeader" : "Date Created",
						"width" : 150,
						"hidden" : true
					},	{
							"colId" : "checkerId",
							"colHeader" : "Approved By",
							"hidden" : false
						},
						{
						"colId" : "usrFirstName",
						"colHeader" : "User First Name",
						"width" : 150,
						"hidden" : true
					},{
						"colId" : "usrLastName",
						"colHeader" : "User Last Name",
						"width" : 150,
						"hidden" : true
					},{
						"colId" : "department",
						"colHeader" : "Department",
						"width" : 150,
						"hidden" : true
					},{
						"colId" : "usrLastLogon",
						"colHeader" : "Last Access Date/Time",
						"width" : 150,
						"hidden" : true}
					];
}

var arrSortByUserFields = [{
						"colId" : "usrDescription",
						"colHeader" : "User Name"
					}, {
						"colId" : "usrCode",
						"colHeader" : "Login ID"
					}, {
						"colId" : "usrCategory",
						"colHeader" : "Role"
					},{
						"colId" : "requestStateDesc",
						"colHeader" : "Status"
				}];
var arrUserStatus = [{
			'code' : '0',
			'desc' : 'Draft'
		}, {
			'code' : '1',
			'desc' : 'Pending Submit'
		}, {
			'code' : '2',
			'desc' : 'Pending My Approval'
		}, {
			'code' : '3',
			'desc' : 'Pending Approval'
		}, {
			'code' : '4',
			'desc' : 'Pending Send'
		}, {
			'code' : '5',
			'desc' : 'Rejected'
		}, {
			'code' : '6',
			'desc' : 'On Hold'
		}, {
			'code' : '7',
			'desc' : 'Sent To Bank'
		}, {
			'code' : '8',
			'desc' : 'Deleted'
		}, {
			'code' : '9',
			'desc' : 'Pending Repair'
		}, {
			'code' : '13',
			'desc' : 'Debit Failed'
		}, {
			'code' : '14',
			'desc' : 'Debited'
		}, {
			'code' : '15',
			'desc' : 'Processed'
		}, {
			'code' : '18',
			'desc' : 'Stopped'
		}, {
			'code' : '19',
			'desc' : 'For Stop Auth'
		}, {
			'code' : '43',
			'desc' : 'WareHoused'
		}, {
			'code' : '75',
			'desc' : 'Reversal Pending Auth'
		}, {
			'code' : '76',
			'desc' : 'Reversal Aproved'
		}, {
			'code' : '77',
			'desc' : 'Reversal Rejected'
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
	
var arrSortColumnReport	 = {
	'usrDescription' : 'usrDescription',
	'usrCode' : 'usrCode',
	'usrCategory' : 'usrCategory',
	'requestStateDesc' : 'requestStateDesc',
	'makerId' : 'makerId',
	'makerStamp' : 'makerStamp',
	'checkerId' : 'checkerId',
	'checkLoginStatus' : 'checkLoginStatus',
    'usrFirstName' : 'usrFirstName',	
    'usrLastName' :	'usrLastName',	
    'department' : 'department',	
    'usrLastLogon' : 'usrLastLogon'
}; 