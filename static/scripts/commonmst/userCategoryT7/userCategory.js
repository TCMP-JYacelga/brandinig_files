var USER_CATEGORY_GENERIC_COLUMN_MODEL = [];

//Changes for SBSA-TPFA
if (autousrcode != 'PRODUCT') {			
		USER_CATEGORY_GENERIC_COLUMN_MODEL = [{
			"colId" : "corporationDesc",
			"colHeader" : getLabel('corporationDesc', 'Company Name'),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":1
		},{
			"colId" : "categoryCode",
			"colHeader" : getLabel('role', 'Role'),
			 width : 160,
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":2
		},{
			"colId" : "categoryDesc",
			"colHeader" :getLabel('description', 'Description'),
			width : 250,
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":3
		},{
			"colId" : "requestStateDesc",
			"colHeader" : getLabel('status', 'Status'),
			"sortable" : false,
			"locked"	: false,
			"hidden" : false,
			"hideable"	: true,
			"colSequence":4
		}/*,{
			"colId" : "makerId",
			"colHeader" : getLabel('createdBy', 'Created By'),
			 width : 160,
			"hidden" 	: (autousrcode != 'PRODUCT') ? true : false ,
			"locked"	: false,
			"hideable"	: true,			
			"colSequence":5
		}*/,{
			"colId" : "makerStamp",
			"colHeader" : getLabel('dateCreated', 'Date Created'),
			"width" : 160,
			"locked"	: false,
			"hidden" : false,
			"hideable"	: true,
			"colSequence":6
		}/*,{
			"colId" : "checkerId",
			"colHeader" : getLabel('approvedBy', 'Approved By'),
			width : 160,
			"hidden" 	: (autousrcode != 'PRODUCT') ? true : false ,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":7
		}*/,{
			"colId" : "checkerStamp",
			"colHeader" : getLabel('dateApproved', 'Date Approved'),
			"width" : 160,
			"locked"	: false,
			"hidden" : false,
			"hideable"	: true,
			"colSequence":8
		},{
			"colId" : "authSyncStatus",
			"colHeader" : getLabel('authSyncStatus', 'Synchronization Status'),
			"width" : 200,
			"locked"	: false,
			"hidden" : false,
			"hideable"	: true,
			"sortable" : false,
			"colSequence":20
		}] ;
	} else {
		
		USER_CATEGORY_GENERIC_COLUMN_MODEL = [{
			"colId" : "corporationDesc",
			"colHeader" : getLabel('corporationDesc', 'Company Name'),
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":1
		},{
			"colId" : "categoryCode",
			"colHeader" : getLabel('role', 'Role'),
			 width : 160,
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":2
		},{
			"colId" : "categoryDesc",
			"colHeader" :getLabel('description', 'Description'),
			width : 250,
			"hidden" : false,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":3
		},{
			"colId" : "requestStateDesc",
			"colHeader" : getLabel('status', 'Status'),
			"sortable" : false,
			"locked"	: false,
			"hidden" : false,
			"hideable"	: true,
			"colSequence":4
		},{
			"colId" : "makerId",
			"colHeader" : getLabel('createdBy', 'Created By'),
			 width : 160,
			"hidden" 	: (autousrcode != 'PRODUCT') ? true : false ,
			"locked"	: false,
			"hideable"	: true,			
			"colSequence":5
		},{
			"colId" : "makerStamp",
			"colHeader" : getLabel('dateCreated', 'Date Created'),
			"width" : 160,
			"locked"	: false,
			"hidden" : false,
			"hideable"	: true,
			"colSequence":6
		},{
			"colId" : "checkerId",
			"colHeader" : getLabel('approvedBy', 'Approved By'),
			width : 160,
			"hidden" 	: (autousrcode != 'PRODUCT') ? true : false ,
			"locked"	: false,
			"hideable"	: true,
			"colSequence":7
		},{
			"colId" : "checkerStamp",
			"colHeader" : getLabel('dateApproved', 'Last Approved Date'),
			"width" : 160,
			"locked"	: false,
			"hidden" : false,
			"hideable"	: true,
			"colSequence":8
		},{
			"colId" : "authSyncStatus",
			"colHeader" : getLabel('authSyncStatus', 'Synchronization Status'),
			"width" : 200,
			"locked"	: false,
			"hidden" : false,
			"hideable"	: true,
			"sortable" : false,
			"colSequence":20
		}] ;
	}
		

if (entity_type === '1')
{
	USER_CATEGORY_GENERIC_COLUMN_MODEL.shift();
}

if (brEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "brEnable",
				"colHeader" :  getLabel('br', 'BR'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":8
			});
}
if (paymentEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "paymentEnable",
				"colHeader" : getLabel('payment', 'Payment'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":9
			});
}
/*if (incomingAchEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "incomingAchEnable",
				"colHeader" :  getLabel('inAch', 'Incoming ACH'),
				"hidden" : false,
				"sortable":false
			});
}*/
if (incomingWireEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "incomingWireEnable",
				"colHeader" : getLabel('inWire', 'Incoming Wires'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":10
			});
}
if (positivePayEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "positivePayEnable",
				"colHeader" : getLabel('poPay', 'Positive Pay'),
				"hidden" : false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":11
			});
}
if (checksEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "checksEnable",
				"colHeader" : getLabel('checks', 'Checks'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":12
			});
}
if (adminEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "adminEnable",
				"colHeader" : getLabel('admin', 'Admin'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":13
			});
}
if (fscEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "fscEnable",
				"colHeader" : getLabel('fsc', 'SCF'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":14
			});
}
if (forecastEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "forecastEnable",
				"colHeader" : getLabel('forecast', 'Forecast'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":15
			});
}
if (tradeEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "tradeEnable",
				"colHeader" : getLabel('eTrade', 'eTrade'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":16
			});
}
if (lmsEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "lmsEnable",
				"colHeader" : getLabel('liquidity', 'Liquidity'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":17
			});
}
if (limitEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "limitEnable",
				"colHeader" : getLabel('limit', 'Limit'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable":false,
				"colSequence":18
			});
}
if (subAcctEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "subAcctEnable",
				"colHeader" : getLabel('subAcctEnable', 'Sub Accounts'),
				"hidden" : false,
				"locked"	: false,
				"hideable"	: true,
				"sortable": false,
				"colSequence":19
			});
}

/*USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
			"colId" : "requestStateDesc",
			"colHeader" : "Status",
			"hidden" : false
		});*/


var arrActionColumnStatus = [['0', 'Draft'], ['1', 'Pending Submit'],
                     		['2', 'Pending My Approval'], ['3', 'Pending Approval'],
                     		['4', 'Pending Send'], ['5', 'Rejected'], ['6', 'On Hold'],
                     		['7', 'Sent To Bank'], ['8', 'Deleted'], ['9', 'Pending Repair'],
                     		['13', 'Debit Failed'], ['14', 'Debited'], ['15', 'Processed'],
                     		['18', 'Stopped'], ['19', 'For Stop Auth'],
                     		['43', 'WareHoused'], ['75', 'Reversal Pending Auth'],
                     		['76', 'Reversal Aproved'], ['77', 'Reversal Rejected'],
                     		['78', 'Reversal Pending My Auth']];

var arrSortColumnReport = {
		"corporationDesc" : "corporationDesc",
		"categoryCode" : "categoryCode",
		"categoryDesc" : "categoryDesc",
		"requestStateDesc" : "requestStateDesc",
		"makerId" :"makerId",
		"makerStamp" :"makerStamp",
		"checkerId" :"checkerId",
		"checkerStamp" :"checkerStamp",
		"brEnable" : "brEnable",
		"paymentEnable" : "paymentEnable",
		/*"incomingAchEnable" : "incomingAchEnable",*/
		"incomingWireEnable" : "incomingWireEnable",
		"positivePayEnable" : "positivePayEnable",
		"checksEnable" : "checksEnable",
		"adminEnable" : "adminEnable",
		"fscEnable" : "fscEnable",
		"tradeEnable" : "tradeEnable",
		"loansEnable" : "loansEnable",
		"investmentEnable" : "investmentEnable",
		"forecastEnable" : "forecastEnable",
		"depositsEnable" : "depositsEnable",
		"lmsEnable" : "lmsEnable",
		"limitEnable" : "limitEnable"	
};