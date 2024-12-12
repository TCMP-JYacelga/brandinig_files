/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var actionsForWidget = ['Submit','Discard','Enable','Disable'];
if(client_count != null && client_count > 1)
{
	var REPORT_GENERIC_COLUMN_MODEL = [
        /*{
  			"colId" : "entityDesc",
  			"colHeader" : getLabel("Client",
  			"hidden" : false
  		},
  		*/
        {
  			"colId" : "reportName",
  			"colHeader" : getLabel("reportName","Name"),
  			"hidden" : false
  		},
  		{
  			"colId" : "reportDesc",
  			"colHeader" : getLabel("reportDesc","Description"),
  			"hidden" : false
  		},
  		{
  			"colId" : "reportTypeDesc",
  			"colHeader" : getLabel("reportTypeDesc","Type"),
  			"hidden" : false
  		},{
  			"colId" : "entityDesc",
  			"colHeader" : getLabel("Client","Company Name"),
  			"hidden" : false
  		},  {
  			"colId" : "securityProfile",
  			"colHeader" : getLabel("securityProfile","Security Profile"),
  			"hidden" : false
  		}, {
  			"colId" : "moduleName",
  			"colHeader" : getLabel("moduleName","Module Name"),
  			"hidden" : false
  		},{
  			"colId" : "reportStatus",
  			"colHeader" : getLabel("reportStatus","Status"),
  			"hidden" : false
  		}];
}
else
{
	var REPORT_GENERIC_COLUMN_MODEL = [
         /*{
			"colId" : "entityDesc",
			"colHeader" : getLabel("Client",
			"hidden" : false
		},
		*/
         {
			"colId" : "reportName",
			"colHeader" : getLabel("reportName","Name"),
			"hidden" : false
		},
		{
			"colId" : "reportDesc",
			"colHeader" : getLabel("reportDesc","Description"),
			"hidden" : false
		},
		{
			"colId" : "reportTypeDesc",
			"colHeader" : getLabel("reportTypeDesc","Type"),
			"hidden" : false
		},  {
			"colId" : "securityProfile",
			"colHeader" : getLabel("securityProfile","Security Profile"),
			"hidden" : false
		}, {
			"colId" : "moduleName",
			"colHeader" : getLabel("moduleName","Module Name"),
			"hidden" : false
		},{
			"colId" : "reportStatus",
			"colHeader" : getLabel("reportStatus","Status"),
			"hidden" : false
		}];
}
var objGridWidthMap =
		{
			"entityDesc" : 150,
			"reportName" : 200,
			"reportDesc" : 200,
			"reportTypeDesc" : 120,
			"schCnt" : 120,
			"securityProfile" : 120,
			"reportStatus" : 110,
			"moduleName" : 130
		};		

var arrSortByPaymentFields = [{
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
			"colId" : "activationDate",
			"colDesc" : getLabel("activationDate","Effective Date")
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
			"colDesc" : getLabel("phdnumber","Tracking #")
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
var arrPaymentStatus =
[
		{
			'code' : '0',
			'desc' : getLabel('drafeStatus','Draft')
		},
		{
			'code' : '1',
			'desc' : getLabel('pendingSubmitStatus','Pending Submit')
		},
		{
			'code' : '2',
			'desc' : getLabel('pendingMApprovalStatus','Pending My Approval')
		},
		{
			'code' : '3',
			'desc' : getLabel('PendingApprovalStatus','Pending Approval')
		},
		{
			'code' : '4',
			'desc' : getLabel('pendingSendStatus','Pending Send')
		},
		{
			'code' : '5',
			'desc' : getLabel('rejectedStatus','Rejected')
		},
		{
			'code' : '6',
			'desc' : getLabel('onHoldStatus','On Hold')
		},
		{
			'code' : '7',
			'desc' : getLabel('sentToBnkStatus','Sent To Bank')
		},
		{
			'code' : '8',
			'desc' : getLabel('deletedStatus','Deleted')
		},
		{
			'code' : '9',
			'desc' : getLabel('PendingrepairStatus','Pending Repair')
		},
		{
			'code' : '13',
			'desc' : getLabel('debitFailedStatus','Debit Failed')
		},
		{
			'code' : '14',
			'desc' : getLabel('debitedStatus','Debited')
		},
		{
			'code' : '15',
			'desc' : getLabel('processedStatus','Processed')
		},
		{
			'code' : '18',
			'desc' : getLabel('stoppedStatus','Stopped')
		},
		{
			'code' : '19',
			'desc' : getLabel('ForStopAuthStatus','For Stop Auth')
		},
		{
			'code' : '28',
			'desc' : getLabel('debitedStatus','Debited')
		},
		{
			'code' : '43',
			'desc' : getLabel('wareHousedStatus','WareHoused')
		},
		{
			'code' : '75',
			'desc' : getLabel('ReversalPendingAauth','Reversal Pending Auth')
		},
		{
			'code' : '76',
			'desc' : getLabel('reversalApproved','Reversal Aproved')
		},
		{
			'code' : '77',
			'desc' : getLabel('reversalRejected','Reversal Rejected')
		}
	];

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
	var strUrl = 'getCponEnforcementFlag.srvc';
	
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
function showSecurityProfilePopup(record, reportName, clientCode, sellerCode){
$('#securityProfilePopupDiv').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight : 156,
		width : 400,
		modal : true,
		resizable: false,
		draggable: false,
		open:function(){
			$("#reportTextField").text(reportName);
			$("#reportTextField").prop('title',reportName);
			if( !Ext.isEmpty( record ) && !Ext.isEmpty( record.raw ))
			{
				$("#repReportCode").attr('value', record.raw.reportCode);
				$("#repReportType").attr('value', record.raw.reportType);
				$("#repEntityType").attr('value', record.raw.entityType);
				if(!Ext.isEmpty( record.raw.entityCode ))
					$("#repEntityCode").attr('value', record.raw.entityCode);
				
			}
			addProfileMenuItemsToPopUp(clientCode, sellerCode);
			if(record && record.raw && record.raw.securityProfileId){
				$('#securityProfileCombo').val(record.raw.securityProfileId);
				$('#securityProfileCombo').niceSelect('update');
			}
			
		}
	});
	$('#securityProfilePopupDiv').dialog("open");
}
function addProfileMenuItemsToPopUp(clientCode, sellerCode) {
	var strUrl = 'getSecurityProfile.srvc?' + csrfTokenName + '=' + csrfTokenValue + '&$sellerFilter=' + sellerCode + '&$clientFilter=' + clientCode;
	if(clientCode != null && sellerCode != null)
	{
		Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				async : false,
				success : function(response) {						
					var data = Ext.decode( response.responseText );
					loadProfileMenuItemsToPopUp(data);					   
				},
				failure : function() {
					// console.log("Error Occured - Addition Failed");
				}
			});
	}
}
 function loadProfileMenuItemsToPopUp (data) {
		 var elementId='securityProfileCombo';
		var el = $("#"+elementId);
		el.empty();
		for(index=0;index<data.length;index++)
		{
			var opt = $('<option />', {
				value: data[index].filterCode,
				text: data[index].filterValue
			});
			opt.appendTo( el );		
		}
		el.niceSelect('update');
	}