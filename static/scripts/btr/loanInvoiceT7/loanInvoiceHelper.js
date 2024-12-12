var currencyData = new Array();
var currencySymbol= null;
function goToPage( strUrl, frmId )
{
	var frm = document.getElementById( frmId );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function payInvoice(record)
{
	document.getElementById( "payInvoiePopup" ).style.visibility = "visible";
	var dlg = $( '#payInvoiePopup' );
	dlg.dialog( {
		bgiframe : true,
		autoOpen : false,
		modal : true,
		resizable : true,
		draggable : false,
		dialogClass: 'ux-dialog ft-dialog',
		width : 900,
		title : 'Pay Invoice' 
	} ); 
	
	dlg.dialog( 'open' );
	$( '#payInvoiePopup' ).attr( "class", "block" );

	$("#tab_1").removeClass("ft-status-bar-li-done").addClass("ft-status-bar-li-active");
	$("#tab_2").removeClass("ft-status-bar-li-active");
	$("#payInvoiceBtn1").addClass("block ux_extralargepaddingtb");
	$("#submitBtn1").addClass("hidden");
	$("#payInvoiceBtn2").removeClass("hidden");
	$("#payInvoiceBtn2").addClass("block ux_extralargepaddingtb");
	$("#submitBtn2").addClass("hidden");

	$('.viewOnlySection').addClass('hidden');
	$('.entryOnlySection').removeClass('hidden');
	
	currencySymbol =record.get('currencySymbol');
	document.getElementById('totalInvoiceDueAmntDesc').value = record.get('paidAmount') ;
	document.getElementById('totalInvoiceDueAmnt').value = record.get('totalAmtDue') ;
	document.getElementById('invoicePayDueDate').value = record.get('dueDate') ;
	document.getElementById('obligorIDDesc').value = record.get('clientId') + " | "+record.get('accountName') ;
	document.getElementById('obligorID').value = record.get('clientId') ;
	document.getElementById('obligationIDDesc').value = record.get('clientDesc') ;
	$('#obligationIDDesc').attr('title',$('#obligationIDDesc').val() );
	document.getElementById('obligationID').value = record.get('accountId') ;
	//$('#obligationIDDesc').attr('title',$('#obligationID').val() );
	document.getElementById('invoiceNo').value = record.get('invoiceNumber') ;
	document.getElementById('routingNo').value = record.get('routingNumber') ;
	document.getElementById('principalBalAmnt').value = record.get('amountDue') ;
	document.getElementById('principalBalAmntDesc').value = record.get('amountDueDesc') ;
	document.getElementById('interestBalAmnt').value = record.get('interestDue') ;
	document.getElementById('interestBalAmntDesc').value = record.get('interestDueDesc') ;
	document.getElementById('feeBalAmnt').value = record.get('feeDue') ;
	document.getElementById('feeBalAmntDesc').value = record.get('feeDueDesc') ;
	document.getElementById('sellerId').value = record.get('sellerId') ;
	$("#dummyDebitAccNo").attr("disabled",false);
	$("#effectiveDate").attr("disabled",false);
	document.getElementById('effectiveDate').readOnly = true;
	document.getElementById('principalRepayAmnt').readOnly = false;
	$("#principalRepayAmnt").removeClass("disabled");
	document.getElementById('principalRepayAmnt').value = "0.00";
	document.getElementById('interestRepayAmnt').readOnly = false;
	$("#interestRepayAmnt").removeClass("disabled");
	document.getElementById('interestRepayAmnt').value = "0.00";
	document.getElementById('feeRepayAmnt').readOnly = false;
	$("#feeRepayAmnt").removeClass("disabled");
	document.getElementById('feeRepayAmnt').value = "0.00";
	document.getElementById('totalAmnt').value = "0.00";
	$("#invoicePayDueDate").addClass("disabled");
	$("#invoicePayDueDate").attr("disabled","disabled");
	$("#invoiceNo").addClass("disabled");
	$("#invoiceNo").attr("disabled","disabled");
	
	$( '#messageArea').empty();
	getDebitAccList();
	checkReqField();	
}
function checkReqField()
{
	var field = null, fieldId = null;
	$('#payInvoiePopup label.required').each(function() {
		fieldId = $(this).attr('for');
		field = $('#' + fieldId);
		if($('#' + fieldId).hasClass('jq-editable-combo'))
			field = $('#' + fieldId + "_jq");
		if($('#' + fieldId).hasClass('jq-nice-select'))
			field = $('#' + fieldId + "-niceSelect");	
		if (field && field.length != 0) {
			field.bind('blur', function () {
						markRequired($(this));						
					});
			field.bind('focus', function () {
				removeMarkRequired($(this));
			});
		}
	});
	}
function nextToPayInvoice()
{
	var principalBalanceAmnt = parseFloat($('#principalBalAmntDesc').val().replace(/[^0-9.]/g, ""),10);	
	var interestBalanceAmnt = parseFloat($('#interestBalAmntDesc').val().replace(/[^0-9.]/g, ""),10);
	var feeBalAmnt = parseFloat($('#feeBalAmntDesc').val().replace(/[^0-9.]/g, ""),10);
	var principalRepayAmnt = parseFloat($('#principalRepayAmnt').val().replace(/[^0-9.]/g, ""),10);
	var interestRepayAmnt = parseFloat($('#interestRepayAmnt').val().replace(/[^0-9.]/g, ""),10);
	var feeRepayAmnt = parseFloat($('#feeRepayAmnt').val().replace(/[^0-9.]/g, ""),10);
	var totalAmnt = parseFloat($('#totalAmnt').val().replace(/[^0-9.]/g, ""));
	
	if($('#dummyDebitAccNo option:selected').text()==="Select")
	{
		showErrorMessage("Debit Account is Required.");
		return false;
	}
	else if((document.forms[ 'frmTxn' ].elements[ 'effectiveDate' ].value == "") ||
		(document.forms[ 'frmTxn' ].elements[ 'debitAccCcy' ].value == "") ||
		(document.forms[ 'frmTxn' ].elements[ 'obligationID' ].value == ""))
	{
		showErrorMessage("Mandatory Fields are Required.");
		return false;
	}
	else if( principalRepayAmnt > principalBalanceAmnt )
	{
		showErrorMessage("Principle amount should be less than or equal to Principal Due.");
		return false;
	}
	else if( interestRepayAmnt > interestBalanceAmnt )
	{
		showErrorMessage("Interest amount should be less than or equal to Interest Due.");
		return false;
	}
	else if( feeRepayAmnt > feeBalAmnt )
	{
		showErrorMessage("Fees amount should be less than or equal to Fees Due.");
		return false;
	}
	else if( totalAmnt <= 0)
	{
		showErrorMessage("Total amount should be greater than zero.");
		return false;
	}
	else
	{
	$( '#messageArea' ).addClass( 'ui-helper-hidden' );
	$("#payInvoiceBtn1").addClass("hidden");
	$("#submitBtn1").addClass("block ux_extralargepaddingtb");
	$("#payInvoiceBtn2").addClass("hidden");
	$("#submitBtn2").removeClass("hidden");
	$("#submitBtn2").addClass("block ux_extralargepaddingtb");
	$('#tab_1').find('a').removeClass('active');
	$("#tab_2").find('a').addClass('active');
	
	$("#tab_1").removeClass("ft-status-bar-li-active").addClass("ft-status-bar-li-done");
	$("#tab_2").addClass("ft-status-bar-li-active");
	$('.entryOnlySection').addClass('hidden');
	$('.viewOnlySection').removeClass('hidden');
	$('#viewDetailsSection .separator').html(' : ');
	$('#viewDetailsSection label').removeClass('required');
	
	$('#payInvoice1 .totalInvoiceDueAmntDescViewOnly').text($('#totalInvoiceDueAmntDesc').val());
	$('#payInvoice1 .invoicePayDueDateViewOnly').text($('#invoicePayDueDate').val());
	$('#payInvoice1 .obligorIDDescViewOnly').text($('#obligorIDDesc').val());
	$('#payInvoice1 .obligorIDDescViewOnly').attr('title',$('#obligorIDDesc').val() );
	$('#payInvoice1 .obligationIDDescViewOnly').text($('#obligationIDDesc').val());
	$('#payInvoice1 .invoiceNoViewOnly').text($('#invoiceNo').val());
	$('#payInvoice1 .principalBalAmntDescViewOnly').text($('#principalBalAmntDesc').val());
	$('#payInvoice1 .interestBalAmntDescViewOnly').text($('#interestBalAmntDesc').val());
	$('#payInvoice1 .feeBalAmntDescViewOnly').text($('#feeBalAmntDesc').val());
			   
	$('#payInvoice1 .dummyDebitAccNoViewOnly').text($('#dummyDebitAccNo option:selected').text());
	$('#payInvoice1 .dummyDebitAccNoViewOnly').attr('title',$('#dummyDebitAccNo option:selected').text());
	var sellerIdVal =  $('#sellerId').val();
	$('#payInvoice1 .sellerIdViewOnly').text(sellerIdVal);
	if(!isEmpty(sellerIdVal) && sellerIdVal.length>13)
			$('#payInvoice1 .sellerIdViewOnly').addClass('popup-text-ellipsis').attr('title',sellerIdVal);
	$('#payInvoice1 .debitAccCcyViewOnly').text($('#debitAccCcy').val());
	$('#payInvoice1 .principalRepayAmntViewOnly').text(currencySymbol +" "+ $('#principalRepayAmnt').val());
	$('#payInvoice1 .interestRepayAmntViewOnly').text(currencySymbol +" "+ $('#interestRepayAmnt').val());
	$('#payInvoice1 .feeRepayAmntViewOnly').text(currencySymbol +" "+ $('#feeRepayAmnt').val());
	$('#payInvoice1 .effectiveDateViewOnly').text($('#effectiveDate').val());
	$('#payInvoice1 .totalAmntViewOnly').text(currencySymbol+" "+ totalAmnt.toFixed(2));
	
	}
	$( '#payInvoiePopup' ).dialog('option','position','center');
	setTimeout(function() { autoFocusOnFirstElement(null, 'payInvoiePopup', true); }, 50);
}
function crumbClick(id)
{
	$('.viewOnlySection').addClass('hidden');
	$('.entryOnlySection ').removeClass('hidden');
	if(id == 'tab_1')
	{
		$("#payInvoiceBtn1").addClass("block ux_extralargepaddingtb");
		$("#submitBtn1").addClass("hidden");
		$("#payInvoiceBtn2").removeClass("hidden");
		$("#payInvoiceBtn2").addClass("block ux_extralargepaddingtb");
		$("#submitBtn2").addClass("hidden");
		$('#tab_2').find('a').removeClass('active');
		$("#tab_1").find('a').addClass('active');
		
		$("#dummyDebitAccNo").attr("disabled",false);
		$("#effectiveDate").attr("disabled",false);
		document.getElementById('effectiveDate').readOnly = false;
		document.getElementById('principalRepayAmnt').readOnly = false;
		$("#principalRepayAmnt").removeClass("disabled");
		document.getElementById('interestRepayAmnt').readOnly = false;
		$("#interestRepayAmnt").removeClass("disabled");
		document.getElementById('feeRepayAmnt').readOnly = false;
		$("#feeRepayAmnt").removeClass("disabled");
		$( '#payInvoiePopup' ).dialog('option','position','center'); 
	}
	else
	{
		$("#payInvoiceBtn1").addClass("hidden");
		$("#submitBtn1").addClass("block ux_extralargepaddingtb");
		$("#payInvoiceBtn2").addClass("hidden");
		$("#submitBtn2").removeClass('hidden');
		$("#submitBtn2").addClass("block ux_extralargepaddingtb");
		$('#tab_1').find('a').removeClass('active');
		$("#tab_2").find('a').addClass('active');
		
		$("#dummyDebitAccNo").attr("disabled",true);
		$("#effectiveDate").attr("disabled",true);
		
		document.getElementById('effectiveDate').readOnly = true;
		document.getElementById('principalRepayAmnt').readOnly = true;
		$("#principalRepayAmnt").addClass("disabled");
		document.getElementById('interestRepayAmnt').readOnly = true;
		$("#interestRepayAmnt").addClass("disabled");
		document.getElementById('feeRepayAmnt').readOnly = true;
		$("#feeRepayAmnt").addClass("disabled");
		$( '#payInvoiePopup' ).dialog('option','position','center'); 
	}
}
function cancelPayInvoice()
{
	$( '#payInvoiePopup' ).dialog( 'close' );
}
function setDebitAccount(me)
{
	var debitAccountStr = me.value ;
	var strArray = debitAccountStr.split('|');
	document.getElementById('debitAccNo').value = strArray[0];
	if( debitAccountStr == '' )
		document.getElementById('debitAccCcy').value = '';
	else
		document.getElementById('debitAccCcy').value = strArray[1];

	makeNiceSelect('dummyDebitAccNo',true);
	setTimeout(function() { autoFocusOnFirstElement(null, 'payInvoice', true); }, 50);
}
function savePayInvoice(strUrl, frmId,saveAction)
{
	$("#submitId").addClass('disabled');
	$('#submitId').attr('disabled',true);
	if( displayVerificationFlag == 'false')
	{
		var principalBalanceAmnt = parseFloat($('#principalBalAmntDesc').val().replace(/[^0-9.]/g, ""),10);	
		var interestBalanceAmnt = parseFloat($('#interestBalAmntDesc').val().replace(/[^0-9.]/g, ""),10);
		var feeBalAmnt = parseFloat($('#feeBalAmntDesc').val().replace(/[^0-9.]/g, ""),10);
		var principalRepayAmnt = parseFloat($('#principalRepayAmnt').val().replace(/[^0-9.]/g, ""),10);
		var interestRepayAmnt = parseFloat($('#interestRepayAmnt').val().replace(/[^0-9.]/g, ""),10);
		var feeRepayAmnt = parseFloat($('#feeRepayAmnt').val().replace(/[^0-9.]/g, ""),10);
		var totalAmnt = parseFloat($('#totalAmnt').val().replace(/[^0-9.]/g, ""));
		if((document.forms[ 'frmTxn' ].elements[ 'effectiveDate' ].value == "") ||
			(document.forms[ 'frmTxn' ].elements[ 'debitAccCcy' ].value == "") ||
			(document.forms[ 'frmTxn' ].elements[ 'obligationID' ].value == ""))
		{
			showErrorMessage("Mandatory Fields are Required.");
			return false;
		}
		else if( principalRepayAmnt > principalBalanceAmnt )
		{
			showErrorMessage("Principle amount should be less than or equal to Principal Due.");
			return false;
		}
		else if( interestRepayAmnt > interestBalanceAmnt )
		{
			showErrorMessage("Interest amount should be less than or equal to Interest Due.");
			return false;
		}
		else if( feeRepayAmnt > feeBalAmnt )
		{
			showErrorMessage("Fees amount should be less than or equal to Fees Due.");
			return false;
		}
		else if( totalAmnt <= 0)
		{
			showErrorMessage("Total amount should be greater than zero.");
			return false;
		}
	}

	$("#effectiveDate").removeAttr("disabled");
	$("#principalRepayAmnt").removeAttr("disabled");
	$("#interestRepayAmnt").removeAttr("disabled");
	$("#feeRepayAmnt").removeAttr("disabled");
	$("#debitAccCcy").removeAttr("disabled");
	$("#invoiceNo").removeAttr("disabled");
	document.getElementById('saveAction').value = saveAction ; 
	var frm = document.getElementById( frmId );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getDebitAccList()
{
	var selectedOption = document.getElementById('obligorID').value ;
	var strUrl = 'getDebitAccDetails.srvc';
	var objParam={};
	objParam[csrfTokenName]=csrfTokenValue;
	objParam['$obligorIDFilter']=selectedOption;
	Ext.Ajax.request(
	{
		url : strUrl,
		method : "POST",
		params:objParam,
		success : function( response )
		{
			loadDebitAccData( Ext.decode( response.responseText ) );
		},
		failure : function( response )
		{
			console.log( 'Error Occured' );
		}
	} );
}
function loadDebitAccData( obligationList )
{
	var temp;
	var debitAccItemList = obligationList.DEBITACCOUNT;
	var strDisText = '';
	strDisText = obligationList.DISCLAIMER_TEXT;
	var sysParamDisFlag = '';
	sysParamDisFlag = obligationList.SYS_PARAM_DISCLAIMER_TEXT;

	if(sysParamDisFlag==='Y'){
			$("span[id='disclaimerText']").text(strDisText);
		}

	if( debitAccItemList.length > 0 )
	{
		for( var i = 0 ; i < debitAccItemList.length ; i++ )
		{
			temp = debitAccItemList[ i ].filterCode;
			currencyData[ i ] = temp.split( "|" );

			eval( 'document.forms["frmTxn"].elements["dummyDebitAccNo"].options[i]=' + 'new Option("'
					+ debitAccItemList[ i ].filterValue + '","' + debitAccItemList[ i ].filterCode + '")' );
		}
	}
	setDebitAccount(document.getElementById('dummyDebitAccNo'));
}

function showRealtimeResponsePopup()
{
	$( '#realtimeResPopup' ).dialog(
	{
		autoOpen : false,
		height : 500,
		width : '75%',
		modal : true,
		resizable : false,
		draggable : false,
		title : "Request in Process",

		open: function() {
			openResponseGrid();
        },

		close: function() {
			goToPage('loanInvoiceCenter.srvc', 'frmTxn');
        }
	} );
	//openResponseGrid();
	$( '#realtimeResPopup' ).dialog( "open" );
	
}
function closePopup( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
	
}
function hideUnhideBtns()
{
	$("#btnContInBackDiv").hide();
	$("#cancelDiv").show();
}

function calculatePayInvTotalAmnt()
{
	var principalRepayAmnt = parseFloat($('#principalRepayAmnt').val().replace(/[^0-9.]/g, ""));
	var interestRepayAmnt = parseFloat($('#interestRepayAmnt').val().replace(/[^0-9.]/g, ""));
	var feeRepayAmnt = parseFloat($('#feeRepayAmnt').val().replace(/[^0-9.]/g, ""));
	
	if (!isNaN(principalRepayAmnt) && !isNaN(interestRepayAmnt) && !isNaN(feeRepayAmnt))
	{
		$('#totalAmnt').val( principalRepayAmnt + interestRepayAmnt + feeRepayAmnt );
	}
	
	if (!isEmpty($('#totalAmnt').val()))
	{
		var val = $('#totalAmnt').val();
		val = parseFloat(val);
		$('#totalAmnt').val(val.toFixed(2));
	}
}
/**
 * Approval Confirmation Section Starts Here
 */
var approvalConfGrid = null;
var objArgs = null;
function showApprovalConfirmationPopup(arrSelectedRecords, arrColumnModel,
		storeFields, objDataArgs) {
	var grid;
	$("#approvalConfirmationPopupDiv").dialog({
		bgiframe : true,
		resizable : false,
		draggable : false,
		modal : true,
		width : "735px",
		title : getLabel('lblApprovalConfirmationPopup', 'Invoices Approval'),
		dialogClass : 'highZIndex',
		open : function(event, ui) {
			objArgs = objDataArgs;
			approvalConfGrid = null;
			$('#approvalConfirmationGrid').empty();
			approvalConfGrid = createApprovalConfirmationGrid(
					arrSelectedRecords, arrColumnModel, storeFields);
			$("#approvalConfirmationPopupDiv").dialog("option", "position", {
						my : "center",
						at : "center",
						of : window
					});
		},
		close : function(event, ui) {
		}
	});

}
function closeApprovalConfirmationPopup() {
	approvalConfGrid = null;
	$('#approvalConfirmationPopupDiv').dialog('close');
	$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
}

function approveSelectedRecords() {
	$(document).trigger("approvalConfirmed", [objArgs]);
	closeApprovalConfirmationPopup();
}
function createSelectRecordsGridStore(arrSelectedRecords, storeFields) {
	var me = this;
	var gridJson = {};
	var gridObjectJson = {};
	var arrRecords = [];
	for (i = 0; i < arrSelectedRecords.length; i++) {
		var arrItem = arrSelectedRecords[i];
		if(jQuery.isArray(arrItem) && !isEmpty(arrItem) && arrItem.length==1)
		arrRecords.push(arrItem[0].data);
	}

	if (arrRecords && arrRecords.length > 0) {
		gridJson['selectedRecords'] = arrRecords;
		gridJson['totalRows'] = arrRecords.length;
		gridJson['SUCCESS'] = true;
	}
	gridObjectJson['d'] = gridJson;

	var myStore = Ext.create('Ext.data.Store', {
				storeId : 'selectedRecordsStore',
				fields : storeFields,
				proxy : {
					type : 'pagingmemory',
					data : gridObjectJson,
					reader : {
						type : 'json',
						root : 'd.selectedRecords',
						totalProperty : 'totalRows',
						successProperty : 'SUCCESS'

					}
				}
			});
	myStore.load();
	return myStore;
}

function getColumns(arrColumnModel) {
	var me = this;
	var arrColsPref = arrColumnModel;
	var arrCols = [], objCol = null, cfgCol = null;
	if (!Ext.isEmpty(arrColsPref)) {
		for (var i = 0; i < arrColsPref.length; i++) {
			objCol = arrColsPref[i];
			cfgCol = {};
			cfgCol.dataIndex = objCol.colId;
			cfgCol.text = objCol.colHeader;
			cfgCol.width = objCol.width;
			cfgCol.colType = objCol.colType;
			cfgCol.resizable = objCol.resizable;
			cfgCol.hideable = false;
			cfgCol.draggable = false;
			if (!Ext.isEmpty(objCol.colType) && cfgCol.colType === "amount") {
				cfgCol.align = 'right';
			}
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}

function createApprovalConfirmationGrid(arrSelectedRecords, arrColumnModel,
		storeFields) {
	var store = createSelectRecordsGridStore(arrSelectedRecords, storeFields);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				width : 1100,
				overflowY : false,
				columns : getColumns(arrColumnModel),
				renderTo : 'approvalConfirmationGrid'
			});

	store.on('load', function(store, records, options) {
				$('#approvalConfirmationPopupDiv').dialog('option', 'position',
						'center');
			});
	return grid;
}
/**
 * Approval Confirmation Section Ends Here
 */

function showErrorMessage(errMessage)
{
	$("#submitId").removeClass('disabled');
	$('#submitId').attr('disabled',false);
	$( '#messageArea').empty();
	$('#messageArea').append("<span class='ft-bold-font'>ERROR : </span>");
	$( '#messageArea').append("<ul><li>"+ errMessage +"</ul></li>");
	$( '#messageArea' ).removeClass( 'ui-helper-hidden' );
}

