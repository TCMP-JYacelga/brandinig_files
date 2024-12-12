var USER_CATEGORY_GENERIC_COLUMN_MODEL = [{
			"colId" : "corporationDesc",
			"colHeader" : "Corporation",
			width : 250,
			"hidden" : false
		},{
			"colId" : "categoryCode",
			"colHeader" : "Role Name",
			width : 221,
			"hidden" : false
		},{
			"colId" : "categoryDesc",
			"colHeader" : "Role Description",
			width : 250,
			"hidden" : false
		},{
			"colId" : "requestStateDesc",
			"colHeader" : "Status",
			"locked" : false,
			"lockable" : false,
			"sortable" : false,
			"hideable" : false,
			"resizable" : false,
			"draggable" : false,
			"hidden" : false
		},{
			"colId" : "makerId",
			"colHeader" : "Created By",
			"hidden" : false
		},{
			"colId" : "makerStamp",
			"colHeader" : "Date Created",
			"width" : 150,
			"hidden" : false
		},{
			"colId" : "checkerId",
			"colHeader" : "Approved By",
			"hidden" : false
		}];

if (entity_type === '1')
{
	USER_CATEGORY_GENERIC_COLUMN_MODEL.shift();
}

if (brEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "brEnable",
				"colHeader" : "BR",
				"hidden" : true
			});
}
if (paymentEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "paymentEnable",
				"colHeader" : "Payment",
				"hidden" : true
			});
}
if (incomingAchEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "incomingAchEnable",
				"colHeader" : "Incoming ACH",
				"hidden" : true
			});
}
if (incomingWireEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "incomingWireEnable",
				"colHeader" : "Incoming Wires",
				"hidden" : true
			});
}
if (positivePayEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "positivePayEnable",
				"colHeader" : "Positive Pay",
				"hidden" : true
			});
}
if (checksEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "checksEnable",
				"colHeader" : "Checks",
				"hidden" : true
			});
}
if (adminEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "adminEnable",
				"colHeader" : "Admin",
				"hidden" : true
			});
}
if (fscEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "fscEnable",
				"colHeader" : "FSC",
				"hidden" : true
			});
}
if (forecastEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "forecastEnable",
				"colHeader" : "Forecast",
				"hidden" : true
			});
}
if (tradeEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "tradeEnable",
				"colHeader" : "eTrade",
				"hidden" : true
			});
}
if (loansEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "loansEnable",
				"colHeader" : "Loans",
				"hidden" : true
			});
}
if (investmentEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "investmentEnable",
				"colHeader" : "Investments",
				"hidden" : true
			});
}
if (depositsEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "depositsEnable",
				"colHeader" : "Imaging View",
				"hidden" : true
			});
}
if (lmsEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "lmsEnable",
				"colHeader" : "Liquidity",
				"hidden" : true
			});
}
if (limitEnable == 'Y') {
	USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
				"colId" : "limitEnable",
				"colHeader" : "Limit",
				"hidden" : true
			});
}

/*USER_CATEGORY_GENERIC_COLUMN_MODEL.push({
			"colId" : "requestStateDesc",
			"colHeader" : "Status",
			"hidden" : true
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
	"brEnable" : "brEnable",
	"paymentEnable" : "paymentEnable",
	"incomingAchEnable" : "incomingAchEnable",
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