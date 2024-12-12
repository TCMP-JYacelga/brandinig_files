/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var SI_GENERIC_COLUMN_MODEL = [{
			"colId" : "clientReference",
			"colHeader" : getLabel("clientReference","Payment Reference"),
			"hidden" : false
		},{
			"colId" : "productCategoryDesc",
			"colHeader" : getLabel("productCategoryDesc","Payment Type"),
			"hidden" : false
		}, {
			"colId" : "payType",
			"colHeader" : getLabel("payType","Payment Type"),
			"hidden" : true
		}, {
			"colId" : "amount",
			"colType" : "amount",
			"colHeader" : getLabel("amount","Amount"),
			"hidden" : false
		}, {
			"colId" : "count",
			"colHeader" : getLabel("count","Count"),
			"hidden" : false
		}, {
			"colId" : "siNextExecutionDate",
			"colHeader" : getLabel("siNextExecutionDate","Next Date"),
			"hidden" : false
		}, {
			"colId" : "actionStatus",
			"colHeader" : getLabel("actionStatus","Status"),
			"hidden" : false
		}, {
			"colId" : "siEffectiveDate",
			"colHeader" : getLabel("siEffectiveDate","Start Date"),
			"hidden" : false
		}, {
			"colId" : "siTerminationDate",
			"colHeader" : getLabel("siTerminationDate","End Date"),
			"hidden" : false
		}, {
			"colId" : "productTypeDesc",
			"colHeader" : getLabel("productTypeDesc","My Product"),
			"hidden" : true
		}, {
			"colId" : "bankProduct",
			"colHeader" : getLabel("bankProduct","Bank Product"),
			"hidden" : true
		}, {
			"colId" : "phdnumber",
			"colHeader" : getLabel("phdnumber","Tracking No."),
			"hidden" : true
		}, {
			"colId" : "sendingAccountDescription",
			"colHeader" : getLabel("sendingAccountDescription","Sending Account + CCY"),
			"hidden" : true
		}, {
			"colId" : "creditAmount",
			"colHeader" : getLabel("creditAmount","Credit Amount"),
			"hidden" : true
		}, {
			"colId" : "debitAmount",
			"colHeader" : getLabel("debitAmount","Debit Amount"),
			"hidden" : true
		}, {
			"colId" : "recieverName",
			"colHeader" : getLabel("recieverName","Receiver Name"),
			"hidden" : true
		}, {
			"colId" : "recieverAccount",
			"colHeader" : getLabel("recieverAccount","Receiver Account + CCY"),
			"hidden" : true
		}, {
			"colId" : "templateName",
			"colHeader" : getLabel("templateName","Template Name"),
			"hidden" : true
		}, {
			"colId" : "txnType",
			"colHeader" : getLabel("txnType","Type of Transaction"),
			"hidden" : true
		}, {
			"colId" : "maker",
			"colHeader" : getLabel("maker","Entry User"),
			"hidden" : true
		}, {
			"colId" : "hostMessage",
			"colHeader" : getLabel("hostMessage","Host Message"),
			"hidden" : true
		}];

var arrSortByPaymentFields = [{
			"colId" : "siTerminationDate",
			"colDesc" : getLabel("siTerminationDate","End Date")
		}, {
			"colId" : "siEffectiveDate",
			"colDesc" : getLabel("siEffectiveDate","Start Date")
		}, {
			"colId" : "siNextExecutionDate",
			"colDesc" : getLabel("siNextExecutionDate","Next Date")
		},{
			"colId" : "productCategoryDesc",
			"colDesc" : getLabel("productCategoryDesc","Payment Type")
		}, {
			"colId" : "payType",
			"colDesc" : getLabel("payType","Payment Type")
		}, {
			"colId" : "recieverName",
			"colDesc" : getLabel("recieverName","Receiver Name")
		}, {
			"colId" : "amount",
			"colDesc" : getLabel("amount","Amount")
		}, {
			"colId" : "count",
			"colDesc" : getLabel("count","Count")
		}, {
			"colId" : "actionStatus",
			"colDesc" : getLabel("actionStatus","Status")
		}, {
			"colId" : "productTypeDesc",
			"colDesc" : getLabel("productTypeDesc","My Product")
		}, {
			"colId" : "txnDate",
			"colDesc" : getLabel("txnDate","Effective Date")
		}, {
			"colId" : "sendingAccount",
			"colDesc" : getLabel("sendingAccount","Sending Account")
		}, {
			"colId" : "templateName",
			"colDesc" : getLabel("templateName","Template Name")
		}, {
			"colId" : "recieverAccount",
			"colDesc" : getLabel("recieverAccount","Receiver Account + CCY")
		}, {
			"colId" : "entryDate",
			"colDesc" : getLabel("entryDate","Entry Date")
		}, {
			"colId" : "valueDate",
			"colDesc" : getLabel("valueDate","Process Date")
		}, {
			"colId" : "client",
			"colDesc" : getLabel("client","Client Description")
		}, {
			"colId" : "bankProduct",
			"colDesc" : getLabel("bankProduct","Bank Product")
		}, {
			"colId" : "phdnumber",
			"colDesc" : getLabel("phdnumber","Tracking No.")
		}, {
			"colId" : "clientReference",
			"colDesc" : getLabel("clientReference","Payment Reference")
		}, {
			"colId" : "currency",
			"colDesc" : getLabel("currency","Sending Account + CCY")
		}, {
			"colId" : "creditAmount",
			"colDesc" : getLabel("creditAmount","Credit Amount")
		}, {
			"colId" : "debitAmount",
			"colDesc" : getLabel("debitAmount","Debit Amount")
		}, {
			"colId" : "txnType",
			"colDesc" : getLabel("txnType","Type of Transaction")
		}, {
			"colId" : "maker",
			"colDesc" : getLabel("maker","Entry User")
		}, {
			"colId" : "hostMessage",
			"colDesc" : getLabel("hostMessage","Host Message")
		}];

var arrPaymentStatus = [{
			'code' : '0',
			'desc' : getLabel('draftStatus','Draft')
		}, {
			'code' : '1',
			'desc' : getLabel('submtiStatus','For Submit')
		}, {
			'code' : '2,3',
			'desc' : getLabel('newStatus','New')
		}, {
			'code' : '4',
			'desc' : getLabel('enabledStatus','Enabled')
		}, {
			'code' : '5',
			'desc' : getLabel('myEnableAuthStatus','For My Enable Auth')
		}, {
			'code' : '6',
			'desc' : getLabel('enableAuthStatus','For Enable Auth')
		}, {
			'code' : '7',
			'desc' : getLabel('myDisableAuthStatus','For My Disable Auth')
		}, {
			'code' : '8',
			'desc' : getLabel('disableAuthStatus','For Disable Auth')
		},{
			'code' : '9',
			'desc' : getLabel('rejectRepairStatus','Reject Repair')
		}, {
			'code' : '86',
			'desc' : getLabel('disabledrejByAppStat','Disable Rejected By Approver')
		},{
			'code' : '87',
			'desc' : getLabel('enabledrejByAppStatus','Enable Rejected By Approver')
		}, {
			'code' : '11',
			'desc' : getLabel('rejectedStatus','Rejected')
		}, {
			'code' : '12',
			'desc' : getLabel('deletedStatus','Deleted')
		}, {
			'code' : '13',
			'desc' : getLabel('disabledStatus','Disabled')
		}, {
			'code' : '34',
			'desc' : getLabel('pendingMyPartAuthstatus','Pending My Partial Auth')
		},  {
			'code' : '35',
			'desc' : getLabel('partialAuthStatus','Partial Auth')
		},{
			'code' : '84',
			'desc' : getLabel('expiredStatus','Expired')
		}];

var arrActionColumnStatus = [['0', 'Draft'], ['1', 'For Submit'],
		['2,3', 'New'], ['4', 'Enabled'],
		['5', 'For My Enable Auth'], ['6', 'For Enable Auth'],
		['7', 'For My Disable Auth'], ['8', 'For Disable Auth'],
		['9', 'Reject Repair'],
		['86', 'Disable Rejected By Approver'],
		['87', 'Enable Rejected By Approver'],
		['11', 'Rejected'],
		['12', 'Deleted'], ['13', 'Disabled'],
		['34', 'Pending My Partial Auth'],['35', 'Partial Auth'], ['84', 'Expired']];

function setActionStatusMenuItems(elementId){
	var data = [
		{"filterCode" : "0", "filterValue" : "Pending Approval"},
		{"filterCode" : "9", "filterValue" : "Pending My Approval"},
		{"filterCode" : "3,1", "filterValue" : "Approved"},
		{"filterCode" : "4", "filterValue" : "Pending Submit"},
		{"filterCode" : "2", "filterValue" : "Rejected"},
		{"filterCode" : "12", "filterValue" : "Deleted"}
	];
	filterActionStatusDataCount = data.length;
	addDataInActionStatusMultiSelect(elementId, data);
}

function addDataInActionStatusMultiSelect(elementId,data)
{
	var el = $(elementId).multiselect();
	el.attr('multiple',true);
	for(index=0;index<data.length;index++)
	{
		var opt = $('<option />', {
			value: data[index].filterCode,
			text: data[index].filterValue
		});
		opt.attr('selected','selected');
		opt.appendTo( el );
	}
	el.multiselect('refresh');
}