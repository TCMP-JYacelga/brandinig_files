/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var actionsForWidget = ['Submit','Discard','Enable','Disable'];
var BANK_GENERIC_COLUMN_MODEL = [
		{
			"colId" : "entityDesc",
			"colHeader" : getLabel( 'client', 'Company Name' ),
			"hidden" : true
		},
		{
			"colId" : "reportName",
			"colHeader" : getLabel( 'name', 'Name' ),
			"hidden" : false
		},
		{
			"colId" : "reportDesc",
			"colHeader" : getLabel( 'description', 'Description' ),
			"hidden" : false
		},
		{
			"colId" : "reportTypeDesc",
			"colHeader" : getLabel( 'schedulingType', 'Type' ),
			"hidden" : false
		},  {
			"colId" : "schCnt",
			"colHeader" : getLabel( 'schedules', 'Schedules' ),
			"hidden" : false
		}, 
		{
			"colId" : "securityProfile",
			"colHeader" : getLabel( 'securityProfile', 'Security Profile' ),
			"hidden" : false
			
		},
		
		/*{
			"colId" : "pregen",
			"colHeader" : "Pregenerated",
			"hidden" : false
			
		},*/ {
			"colId" : "moduleName",
			"colHeader" : getLabel( 'moduleName', 'Module Name' ),
			"hidden" : false
		}];
var objGridWidthMap =
		{
			"entityDesc" : 200,
			"reportName" : 250,
			"reportDesc" : 260,
			"reportTypeDesc" : 200,
			"schCnt" : 100,
			//"securityProfile" : 120,
			//"pregen" : 100,
			"moduleName" : 140
		};		

var arrSortByPaymentFields = [{
			"colId" : "recieverName",
			"colDesc" : getLabel('receiverName', 'Receiver Name')
		}, {
			"colId" : "amount",
			"colDesc" : "Amount"
		}, {
			"colId" : "count",
			"colDesc" : "Count"
		}, {
			"colId" : "actionStatus",
			"colDesc" : "Status"
		}, {
			"colId" : "productTypeDesc",
			"colDesc" : "My Product"
		}, {
			"colId" : "activationDate",
			"colDesc" : "Effective Date"
		}, {
			"colId" : "sendingAccount",
			"colDesc" : "Sending Account"
		}, {
			"colId" : "templateName",
			"colDesc" : "Template Name"
		}, {
			"colId" : "recieverAccount",
			"colDesc" : getLabel('receiverAccountCCY','Receiving Account + CCY')
		}, {
			"colId" : "entryDate",
			"colDesc" : "Entry Date"
		}, {
			"colId" : "valueDate",
			"colDesc" : "Process Date"
		}, {
			"colId" : "client",
			"colDesc" : "Client Description"
		}, {
			"colId" : "bankProduct",
			"colDesc" : "Bank Product"
		}, {
			"colId" : "phdnumber",
			"colDesc" : "Tracking #"
		}, {
			"colId" : "clientReference",
			"colDesc" : "Payment Reference"
		}, {
			"colId" : "currency",
			"colDesc" : "Sending Account + CCY"
		}, {
			"colId" : "creditAmount",
			"colDesc" : "Credit Amount"
		}, {
			"colId" : "debitAmount",
			"colDesc" : "Debit Amount"
		}, {
			"colId" : "txnType",
			"colDesc" : "Type of Transaction"
		}, {
			"colId" : "maker",
			"colDesc" : "Entry User"
		}, {
			"colId" : "hostMessage",
			"colDesc" : "Host Message"
		}];
var arrPaymentStatus = [{
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
			'code' : '28',
			'desc' : 'Debited'
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
		['18', 'Stopped'], ['19', 'For Stop Auth'], ['28', 'Debited'],
		['43', 'WareHoused'], ['75', 'Reversal Pending Auth'],
		['76', 'Reversal Aproved'], ['77', 'Reversal Rejected'],
		['78', 'Reversal Pending My Auth']];

function setCponEnforcement(client)
{
	var strData = {};
	var strUrl = 'getBankCponEnforcementFlag.srvc';
	
	strData[ '$clientId' ] = client;
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function( response )
		{
			isScheduleAllow = response.SCHEDULEALLOWFLAG;
			isSecPrfAllow = response.SECPROFILEFLAG ;
			GCP.getApplication().fireEvent( 'callHandleQuickFilterChange');
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );
}
function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}