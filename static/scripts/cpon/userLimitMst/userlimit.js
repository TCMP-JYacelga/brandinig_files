var USER_LIMIT_GENERIC_COLUMN_MODEL = [
	{
		"colId" : "clientDescription",
		"colDesc" : getLabel('clientDesc','Company Name'),
		"colHeader" : getLabel('clientDesc', 'Company Name'),
		"sortable" :false,
		"colSequence":1
	},
	{
		"colId" : "profileName",
		"colDesc" : getLabel('profileName','Profile Name'),
		"colHeader" : getLabel('profileName','Profile Name'),
		"sortable" :false,
		"colSequence":2
	}, {
		"colId" : "ccyCode",
		"colDesc" :  getLabel('ccy','CCY'),
		"colHeader" :  getLabel('ccy','CCY'),
		"sortable" :false,
		"colSequence":3
	}, {
		"colId" : "requestStateDesc",
		"colDesc" :  getLabel('status','Status'),
		"colHeader" :  getLabel('status','Status'),
		"sortable" :false,
		"colSequence":4
	}, {
		"colId" : "dlyTrfCreditLimitAmt",
		"colDesc" : getLabel('trfCr','Transfer Credit Limit'),
		"colHeader" : getLabel('trfCr','Transfer Credit Limit'),
		"colType" : "number",
		"sortable" :false,
		"colSequence":5
	}, {
		"colId" : "dlyTrfDebitLimitAmt",
		"colDesc" :  getLabel('trfDr','Transfer Debit Limit'),
		"colHeader" : getLabel('trfDr','Transfer Debit Limit'),
		"colType" : "number",
		"sortable" :false,
		"colSequence":6
	},{
		"colId" : "periodType",
		"colDesc" :  getLabel('periodType','Period Type'),
		"colHeader" :  getLabel('periodType','Period Type'),
		"sortable" :false,
		"colSequence":7
	},{
		"colId" : "clTrfCreditLimitAmt",
		"colDesc" :  getLabel('trfCrLimit','Cumulative Transfer Credit Limit'),
		"colHeader" :  getLabel('trfCrLimit','Cumulative Transfer Credit Limit'),
		"colType" : "number",
		"sortable" :false,
		"colSequence":8
	},{
		"colId" : "clTrfDebitLimitAmt",
		"colDesc" :  getLabel('trfDrLimit','Cumulative Transfer Debit Limit'),
		"colHeader" :  getLabel('trfDrLimit','Cumulative Transfer Debit Limit'),
		"colType" : "number",
		"sortable" :false,
		"colSequence":9
	},{
		"colId" : "clMaxNoTrfAmt",
		"colDesc" :  getLabel('maxNoOfTranf','Maximum Number Of Transfer'),
		"colHeader" :  getLabel('maxNoOfTranf','Maximum Number Of Transfer'),
		"colType" : "number",
		"sortable" :false,
		"colSequence":10
	},{
		"colId" : "warningCreditLimitAmt",
		"colDesc" :  getLabel('warnCrLimit','Warning Credit Limit'),
		"colHeader" :  getLabel('warnCrLimit','Warning Credit Limit'),
		"colType" : "number",
		"sortable" :false,
		"colSequence":11
	},{
		"colId" : "warningDebitLimitAmt",
		"colDesc" :  getLabel('warnDrLimit','Warning Debit Limit'),
		"colHeader" :  getLabel('warnDrLimit','Warning Debit Limit'),
		"colType" : "number",
		"sortable" :false,
		"colSequence":12
	}];
var arrStatus = 	[
	  {
		"code": "0",
		"desc": "New"
	  },
	  {
		"code": "12",
		"desc": "New Submitted"
      },
	  {
		"code": "1",
		"desc": "Modified"
	  },
	  {
		"code": "14",
		"desc": "Modified Submitted"
	  },	  
	  {
		"code": "3",
		"desc": "Approved"
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
		"code": "13",
		"desc": "Pending My Approval"
	  }
	];
var arrActionColumnStatus = [['0', 'Draft'], ['1', 'Pending Submit'],
		['2', 'Pending My Approval'], ['3', 'Pending Approval'],
		['4', 'Pending Send'], ['5', 'Rejected'], ['6', 'On Hold'],
		['7', 'Sent To Bank'], ['8', 'Deleted'], ['9', 'Pending Repair'],
		['13', 'Debit Failed'], ['14', 'Debited'], ['15', 'Processed'],
		['18', 'Stopped'], ['19', 'For Stop Auth'],
		['43', 'WareHoused'], ['75', 'Reversal Pending Auth'],
		['76', 'Reversal Aproved'], ['77', 'Reversal Rejected'],
		['78', 'Reversal Pending My Auth']];