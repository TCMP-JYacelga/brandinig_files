var USER_CATEGORY_GENERIC_COLUMN_MODEL = [{
							"colId" : "clientDesc",
							"colHeader" : getLabel('client', 'Company Name'),
							"colDesc"	: getLabel('client', 'Company Name'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":1,
						      width : 200
						},{
							"colId" : "receiverCode",
							"colHeader" : getLabel('receiverCode', 'Receiver Code'),
							"colDesc"	: getLabel('client', 'Receiver Code'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":2,
							width : 200
						},{
							"colId" : "drawerDesc",
							"colHeader" : getLabel('receiverName', 'Receiver Name'),
							"colDesc"	: getLabel('receiverName', 'Receiver Name'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":3,
							width : 250
						}, {
							"colId" : "defaultAccountFlag",
							"colHeader" : getLabel('defaultaccount#', 'Default Account'),
							"colDesc"	: getLabel('defaultaccount#', 'Default Account'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":4,
							width : 200
						}, {
							"colId" : "beneAcctNmbr",
							"colHeader" : getLabel('receiverAccount#', 'Account'),
							"colDesc"	: getLabel('receiverAccount#', 'Account'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":6,
							width : 200
						}, {
							"colId" : "beneAccountCcy",
							"colHeader" : getLabel('currency', 'Currency'),
							"colDesc"	: getLabel('currency', 'Currency'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":7,
							width : 85
						},{
							"colId":"paymentTypeDesc",
							"colHeader": getLabel('paymentType', 'Payment Type'),
							"colDesc"	: getLabel('paymentType', 'Payment Type'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":8,
							width:200
						}, 	
						{
							"colId" : "requestStateDesc",
							"colHeader" : getLabel('Status', 'Status'),
							"colDesc"	: getLabel('Status', 'Status'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"sortable":false,
							"colSequence":11,
							width : 130
						},{
							"colId" : "bankIdType",
							"colHeader" : getLabel('bankIdType','Bank ID Type'),
							"colDesc"	: getLabel('bankIdType', 'Bank ID Type'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":12,
							width : 200
						},{
							"colId" : "bankId",
							"colHeader" : getLabel('bankIdValue','Bank ID'),
							"colDesc"	: getLabel('bankIdValue', 'Bank ID'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":13,
							width : 200
						},{
							"colId" : "channelCode",
							"colHeader" : getLabel('channelCode', 'Channel'),
							"colDesc"	: getLabel('client', 'Channel'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: false,
							"hideable"	: true,
							"colSequence":14,
							width : 200
						},{
							"colId" : "additionalInfo7",
							"colHeader" : getLabel('additionalInfo7', 'Old Receiver Name'),
							"colDesc"	: getLabel('additionalInfo7', 'Old Receiver Name'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: true,
							"hideable"	: true,
							"colSequence":15,
							width : 250
						},{
							"colId" : "additionalInfo1",
							"colHeader" : getLabel('additionalInfo1', 'Host Validation Status'),
							"colDesc"	: getLabel('additionalInfo1', 'Host Validation Status'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: true,
							"hideable"	: true,
							"colSequence":16,
							width : 130
						},{
							"colId" : "response_ref_nmbr",
							"colHeader" : getLabel('response_ref_nmbr', 'Host Reference'),
							"colDesc"	: getLabel('response_ref_nmbr', 'Host Reference'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: true,
							"hideable"	: true,
							"colSequence":17,
							width : 130
						},{
							"colId" : "response_datetime",
							"colHeader" : getLabel('response_datetime', 'Host Date\Time'),
							"colDesc"	: getLabel('response_datetime', 'Host Date\Time'),
							"colType"	: "string",
							"locked"	: false,
							"hidden"	: true,
							"hideable"	: true,
							"colSequence":18,
							width : 130
						}];

if(anyid_pay_allowed_flag == 'Y')
{
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
		"colId":"anyIdType",
		"colHeader": getLabel('AnyIDType', 'Any ID Type'),
		"colDesc"	: getLabel('AnyIDType', 'Any ID Type'),
		"colType"	: "string",
		"locked"	: false,
		"hidden"	: false,
		"hideable"	: true,
		"colSequence":9,
		width:200
	});
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
		"colId":"anyIdValue",
		"colHeader": getLabel('AnyIDValue', 'Any ID Value'),
		"colDesc"	: getLabel('AnyIDValue', 'Any ID Value'),
		"colType"	: "string",
		"locked"	: false,
		"hidden"	: false,
		"hideable"	: true,
		"colSequence":10,
		width:200
	});
	
}



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