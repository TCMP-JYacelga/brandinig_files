function showList(strUrl)
{
	window.location = strUrl;
}

jQuery.fn.dateTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
							})
			})
};

function viewMoreAccountDetails(strType, strTypeDesc)
{
	var frm = document.forms["frmMain"]; 
	$("#txtType").val(strType);
	$("#txtTypeDesc").val(strTypeDesc);
	frm.action = "viewMoreAccountDetails.form";
	frm.method = "POST";
	frm.submit();
}

function viewMoreInvestmentAccountDetails(strType, strTypeDesc)
{
	var frm = document.forms["frmMain"]; 
	$("#txtType").val(strType);
	$("#txtTypeDesc").val(strTypeDesc);
	frm.action = "viewMoreInvestmentAccountDetails.form";
	frm.method = "POST";
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function filter(strUrl)
{
	document.getElementById("filterHit").value="Y";
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function filterListActivity(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	$('#advancedFilterPopup').appendTo('#frmMain');
	frm.submit();
	
}
function filterList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function btrDownload(strUrl)
{	
	var frm = document.forms["frmMain"]; 
	if ($('#btnWithHeader').hasClass('icon-checkbox-checked')) {
		frm.elements["withHeader"].value = "N";
		
	} else {
		frm.elements["withHeader"].value = "Y";
	}
	
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function savePref(strUrl,index)
{
	document.getElementById("filterHit").value="N";
	var temp = document.getElementById("btnSave");
	if (temp.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function downloadPDF(strUrl)
{		
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl
	frm.method = "POST";
	frm.submit();
}
function submitReqQuickIn(strUrl)
{
	
	var temp = document.getElementById("quickIn");
	if (temp && temp.className.startsWith("imagelink grey"))
		return;	
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl
	frm.method = "POST";
	frm.submit();
}

function submitReq(strUrl)
{		
	var temp = document.getElementById("btnmt940");
	if (temp && temp.className.startsWith("imagelink grey"))
		return;	
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl
	frm.method = "POST";
	frm.submit();
}

function viewRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showDateRange(ctrl) 
{
	var fromDate = new Date($('#fromDate').val());
	var toDate = new Date($('#toDate').val());

	if ("R" == ctrl.options[ctrl.selectedIndex].value)
	{
		$("#tdDateRange").css("display","block");
		$("#divDateRange").toggleClass("ui-helper-hidden", false);
		//if(frmName == 'ACTIVITY')
		//{
		//	if (Date.parse(applDate)  == Date.parse(fromDate) || Date.parse(applDate)  == Date.parse(toDate))
		//	{
			
		//	 alert('From and To Date should be less than Application Date');
			 //document.getElementById("fromDate").value  = new Date( fromDate - 1 );
			 //document.getElementById("toDate").value  = new Date( toDate - 1 );
		//	}
		//}
		
	}
	else 
	{
		$("#tdDateRange").css("display","none");
		$("#divDateRange").toggleClass("ui-helper-hidden", true);
	}
}

function showAdditionalInfo(intRec) {
	var dlg = $('#addiInfo');
	paintInfo(dlg, intRec);
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:630,
					beforeClose: function(event, ui) {},
					buttons: {"Ok": function() {$(this).dialog("destroy");}}});
	dlg.dialog('open');
}


function goToAccountSetPage(strUrl,frmId){
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 500)/2;
	var intLeft = (screen.availWidth - 550)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=700,height=530";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function getAccountSetPopup(frmMain) {
	
	var buttonsOpts = {};
	buttonsOpts[btnsArray['addBtn']] = function() {		
		goToAccountSetPage("addAccountSet.seek", frmMain);
	};
	buttonsOpts[btnsArray['editBtn']] = function() {
		
	};
	buttonsOpts[btnsArray['removeBtn']] = function() {
		
	};
	buttonsOpts[btnsArray['okBtn']] = function() {
		goToPage("btrFacList.form", frmMain);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	
	$('#accountSettingPopup').dialog({
				autoOpen : false,
				height : 300,
				width : 460,
				modal : true,
				buttons : buttonsOpts
			});
	$('#accountSettingPopup').dialog("open");
}


function showEmailPopUp() {
	
	var buttonsOpts = {};
	buttonsOpts[btnsArray['send']] = function() {
		$('#emailPopUp').dialog("close");
	}
	$('#emailPopUp').dialog({
		autoOpen : false,
		height : 540,
		width : 725,
		modal : true,
		buttons : buttonsOpts
	});
	$('#emailPopUp').dialog("open");
}

function showDetails(index,currency) {
	
	var strJson = document.getElementById("TEXTJSON"+index).value;
	var myJSONObject = JSON.parse(strJson);
	
	setValuesForViewPopUp(myJSONObject,currency);
	var buttonsOpts = {};
	buttonsOpts[btnsArray['close']] = function() {
		$('#btrDetailsPopup').dialog("close");
	}
	$('#btrDetailsPopup').dialog({
		autoOpen : false,
		height : 440,
		width : 600,
		modal : true,
		buttons : buttonsOpts
	});
	$('#btrDetailsPopup').dialog("open");
}
function showInvestmentDetails(index) {
		var strJson = document.getElementById("TEXTJSON"+index).value;
		var myJSONObject = JSON.parse(strJson);
		
		setValuesForInvViewPopUp(myJSONObject);
		var buttonsOpts = {};
		buttonsOpts[btnsArray['close']] = function() {
			$('#btrInvDetailsPopup').dialog("close");
		}
		$('#btrInvDetailsPopup').dialog({
			autoOpen : false,
			height : 390,
			width : 600,
			modal : true,
			buttons : buttonsOpts
	});
$('#btrInvDetailsPopup').dialog("open");
}
function setValuesForInvViewPopUp(obj) 
{
	$("#detailRecordKeyNo").val(obj.recordKeyNo);
    $("#detailTypeCodeDesc").text(obj.typeCodeDesc);
	var postingDate = $.datepicker.parseDate("yy-mm-dd",  obj.transactionDate);
	var postingDate = $.datepicker.formatDate(localeDatePickerFormat,postingDate);	
	$("#detailDescription").text(obj.txnRef);
    $("#detailTransactionDate").text(postingDate);
    $("#detailAmount").text(obj.amount);
    $("#detailText").val(obj.text);
    $("#remittanceText").val(obj.remittanceText);
}
function setValuesForViewPopUp(obj,currency) 
{
	$("#detailRecordKeyNo").val(obj.recordKeyNo);
    $("#detailAccountNumber").text(obj.accountNumber);
    $("#detailCurrency").text(currency);
	$("#detailBankReference").text(obj.bankReference);
    $("#detailCustomerReference").text(obj.customerReference);
    $("#detailTypeCodeDesc").text(obj.typeCodeDesc);
    $("#detailAmount").text(obj.amount);
    var postingDate = $.datepicker.parseDate("yy-mm-dd",  obj.transactionDate);
	var postingDate = $.datepicker.formatDate(localeDatePickerFormat,postingDate);	
    $("#detailTransactionDate").text(postingDate);
    $("#detailText").val(obj.text);
    $("#remittanceText").val(obj.remittanceText);
}
function paintInfo(dlg, intRec) 
{
	var cntr, row, lbl, spn;
	var data = activity_data[intRec-1];
 	dlg.children("#fld_accountId").text(data.acno);
	dlg.children("#fld_currency").text(data.currency);
	var valueDate = $.datepicker.parseDate("dd/mm/yy",  data.value_date);
	var valueDate = $.datepicker.formatDate(localeDatePickerFormat,valueDate);
	dlg.children("#fld_valueDate").text(valueDate);
 
	// Add dynamic fields
	var fldDiv = dlg.children("#info_fields").children("#lable");
	fldDiv.children().remove();
	
	cntr = 0;
	row = $('<tr></tr>');
	for (key in data) {
		if (key.match(/^INFO_/)) {
			cntr++;
			lblCol = null;
			dataCol = null;
			lblCol = $('<td class="leftAlign odd_column" width="25%">' + lblInfo_activity[key] + '&nbsp; </td>');
			dataCol = $('<td class="leftAlign" width="25%">' + data[key] + '</td>');
			row.append(lblCol);
			row.append(dataCol);
			if (cntr % 2 == 0) {
				fldDiv.append(row);
				row = $('<tr></tr>');
			}
		}
	}
	if (cntr % 2 != 0) {
		row.append(lblCol);
		row.append(dataCol);
		row.append($('<td>&nbsp;</td>'));
		row.append($('<td>&nbsp;</td>'));
		fldDiv.append(row);
	}
}

function showBalanceInfo() {
	var dlg = $('#balanceInfo');
	paintBalanceInfo(dlg);
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:640,
				open: function(event, ui) {
				$("ul.tabs li:first-child").addClass("active"); 
				$(".tab_content").hide();
				$(".tab_content:first").show();
				var activeTab = $(this).find("a").attr("href"); // Find the href attribute value to identify the active tab + content
			    $(activeTab).fadeIn(); // Fade in the active ID content
				return false;
				},
				beforeClose: function(event, ui) { },
				buttons: {"Ok": function() {
				$("ul.tabs li").removeClass("active");
				$(".tab_content").hide();
				$(this).dialog("destroy");}}});
	dlg.dialog('open');
}

function paintBalanceInfo(dlg) {
	var row, cntr, acTbl, balTbl, lblCol, dataCol;
	var acData = ba_data.account_info;
	var balData = ba_data.balance_info;
 
	acTbl = dlg.children('#tabContainer').children('#tab1').children("#acTable");
	acTbl.children('tbody').remove();
	cntr = 0;
	row = $('<tr></tr>');
	for (key in acData) {
		if (key.match(/^INFO_/)) {
			cntr++;
			lblCol = null;
			dataCol = null;
			lblCol = $('<td class="leftAlign grey" width="25%">' + lblInfo_account[key] + ' : </td>');
			dataCol = $('<td class="leftAlign" width="25%">' + acData[key] + '</td>');
			row.append(lblCol);
			row.append(dataCol);
			if (cntr % 2 == 0) {
				acTbl.append(row);
				row = $('<tr></tr>');
			}
		}
	}
	if (cntr % 2 != 0) {
		row.append(lblCol);
		row.append(dataCol);
		row.append($('<td>&nbsp;</td>'));
		row.append($('<td>&nbsp;</td>'));
		acTbl.append(row);
	}
 
	lblCol = null;
	dataCol = null;
	row = null;
	balTbl = dlg.children('#tabContainer').children('#tab2').children("#balTable");
	balTbl.children('tbody').remove();
	cntr = 0;
	row = $('<tr></tr>');
	for (key in balData) {
		if (key.match(/^INFO_/)) {
			cntr++;
			lblCol = null;
			dataCol = null;
			lblCol = $('<td class="leftAlign grey" width="25%">' + lblInfo_balance[key] + ' : </td>');
			dataCol = $('<td class="leftAlign" width="25%">' + balData[key] + '</td>');
			row.append(lblCol);
			row.append(dataCol);
			if (cntr % 2 == 0) {
				balTbl.append(row);
				row = $('<tr></tr>');
			}
		}
	}
	if (cntr % 2 != 0) {
		row.append(lblCol);
		row.append(dataCol);
		row.append($('<td>&nbsp;</td>'));
		row.append($('<td>&nbsp;</td>'));
		balTbl.append(row);
	}
}
 
function paintActivityInfo(dlg, intRec) {
	var cntr, lbl, spn;
	var data = activity_data[intRec];
 
	dlg.children("#fld_accountId").text(data.acno);
	dlg.children("#fld_currency").text(data.currency);
	dlg.children("#fld_reference").text(data.reference);
	dlg.children("#fld_valueDate").text(data.value_date);
 
	// Add dynamic fields
	var fldDiv = dlg.children("#info_fields");
	fldDiv.children().remove();
	for (key in data) {
		if (key.match(/^INFO_/)) {
			lbl = $('<label class="frmLabel">' + lblInfo_activity[key] + '</label>');
			spn = $('<span class="inline rounded readOnly w24">' + data[key] + '</span><br/>');
			fldDiv.append(lbl);
			fldDiv.append(spn);
		}
	}
}


function showEnrichments(frmName, intRec, accountNumber, summaryDate, accountCurrency, txnAmount, drCrFlag, accountId, sessionNumber, sequenceNmbr)
{
	var d = $.datepicker.parseDate("yy-mm-dd",  summaryDate);
	var datestrInNewFormat = $.datepicker.formatDate(localeDatePickerFormat,d);

	$('#btrAccNumber').val(accountNumber);
	$('#accountDateId').val(datestrInNewFormat);
	$('#accountAmount').val(txnAmount);
	$('#accountType').val(drCrFlag);
	$('.currencyLabel').text(accountCurrency);
	
	
	$('#btrAccNumber').attr("disabled","disabled");
	$('#accountDateId').attr("disabled","disabled");
	$('#accountAmount').attr("disabled","disabled");
	$('#accountType').attr("disabled","disabled");
	$('.currencyLabel').attr("disabled","disabled");
		
	$('#accountId').val(accountId);
	$('#sessionNumber').val(sessionNumber);
	$('#sequenceNmbr').val(sequenceNmbr);
	
	var dlg = $('#divEnrichments').clone();
		
	document.getElementById('txtIndex').value = intRec;
	dlg.attr('id', 'dlgDiv');	
	
	paintEnrichments(dlg, intRec);
	dlg.dialog({autoOpen:false,
				height:"auto",
				modal:true,
				width:450,
				buttons: [{
                          id:"btn-cancel",
                          text: "Cancel",
                          click: function() {
                        	  $(this).dialog("destroy");
                                }
                        },{
                        	id:"btn-ok",
                            text: "Ok",
                            click: function() {
							  var _values={};
								$(":input", $(this)).each(function(){_values[this.name]=$(this).val();});
												$(this).dialog("destroy");closeAndSubmit(frmName, _values);
                                }
                        }],

	open : function()
	{
		if(CAN_EDIT=="false")
			{
			$("#btn-ok").attr('disabled','disabled');
			}
	}
	});
	dlg.dialog('open');
}
 
function closeAndSubmit(frmName, arrValues) {

	for (key in arrValues) {		
		$('#divEnrichments').children('#' + key).val(arrValues[key]);		
	}
	var frm = document.getElementById('enrichmentForm');
	frm.action = 'saveEnrichment_btrActivity.form';
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	
}
 
function paintEnrichments(dlg, intRec) {
	var data,strId,childs;	
	data = enrich_data[intRec-1];	
	for (key in data) {			
		strId = "#enrichment" + key.substr(1);		
		dlg.children(strId).val(data[key]);
	}
}

function toggleFavorite(ctrl, strAc, intPage, intIdx)
{

	var frm, strTmp, arrTmp;
	var blnPresent = false;

	if (arrFavorites[strAc])
		blnPresent = true;
 
	frm = document.forms["frmMain"];
	strTmp = frm.favorites.value;
	
	if (isEmpty(strTmp))
		arrTmp = {};
	else
		arrTmp = JSON.parse(strTmp);
		
	var strKey = intPage + "_" + intIdx;
	

	if (arrTmp[strKey])
	{
		// We need to either remove the clicked account if it is not already a favorite account or mark it as to be removed
		// if it is already a favorite
		
		//delete arrTmp[strKey];
		
		var objJson = arrTmp[strKey]
		
		var flg =objJson['remove'];
		if (flg){
			objJson['remove'] = false;			
			}
		else {
			objJson['remove'] = true;			
			}
				
		if (!blnPresent)
		{
			$(ctrl).toggleClass('icon-misc-selfavorite icon-misc-nonfavorite');
		}
		else
		{
			$(ctrl).toggleClass('icon-misc-favorite icon-misc-nonfavorite');
		}
	}
	else
	{
		// Clicked account is to be marked as either favorite or non-favorite
		var objJson = {};
		objJson['account'] = strAc;
		if (blnPresent){
			objJson['remove'] = true;
		
			}
		else {
			objJson['remove'] = false;	
			
			}
		arrTmp[strKey] = objJson;
 
		if (blnPresent)
		{
			$(ctrl).toggleClass('icon-misc-favorite icon-misc-nonfavorite');
		}	
		else
		{
			$(ctrl).toggleClass('icon-misc-selfavorite icon-misc-nonfavorite');
		}
	}
	
	
	frm.favorites.value = JSON.stringify(arrTmp);
	
	for(key in arrTmp){
		var objJson = arrTmp[key];
		if(null != objJson){
			var flg =objJson['remove'];
			if(arrFavorites[objJson['account']]){
				if(flg){
					document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
					break;
				} else {
					document.getElementById("btnSave").className ="imagelink grey inline_block button-icon icon-button-save font_bold";
				}	
			} else {
				if(!flg){
					document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
					break;
				} else {
					document.getElementById("btnSave").className ="imagelink grey inline_block button-icon icon-button-save font_bold";					
				}
			}
		}
	}	
	return false;
}

function toggleSaveButton(equivBalances,filterFlagHit)
{
var frm = document.forms["frmMain"];
var arrTmp = {};
var objJson = {};
var newJsonString;	

if(isEmpty(frm.favorites.value))
{
for(var key in arrFavorites)
{
objJson['account'] = key;
objJson['remove'] = !arrFavorites[key];
arrTmp[key] = objJson;
newJsonString= JSON.stringify(arrTmp);
frm.favorites.value = newJsonString;
}

}

  var showEqui=document.getElementById("showEquiBalances");

  		if(showEqui.value=='Y')
  		{
  		$('#showEquiBalances').val('N');
  		$('.equibal').hide();
  		}
  		else
  		{
  		$('#showEquiBalances').val('Y');
  		$('.equibal').show();
  		}


	var actValue= $('#showEquiBalances').val();
	
	if(actValue != equivBalances){
					document.getElementById("btnSave").className ="imagelink black inline button-icon icon-button-submit font_bold";
				} else {
					document.getElementById("btnSave").className ="imagelink grey inline_block button-icon icon-button-save font_bold";
}
}

function showDialog() {
	var dlg = $('#mtRequestDialog');
	dlg.dialog({bgiframe:true, autoOpen:false, modal:true, resizable:false, width: 300,
					open: function(event, ui) {$(":checkbox", $(this)).each(function() {$(this).removeAttr("checked");})}, 
					buttons: {Cancel: function() {$(this).dialog("destroy");}, 
						Ok: function() {$(this).dialog("close"); _findValues($(this));}}});
	dlg.dialog("open");
}

function _findValues(dlg) {
	var values = [];
	$(":checked", dlg).each(function(idx) {
		values[idx] = $(this).attr('id');
	});
	dlg.dialog("destroy");
 
	for (key in values) {
		var strTmp = values[key];
		values[key] = "MT" + strTmp.substring(3);
	}
	var retVal = confirm("Are you sure, you want to generate MT920 for (" + values + ") ?");
	if (!retVal)
		alert("You do not want to generate MT920 for (" + values + ")");
	else
	{
		document.getElementById('mtRequest').value = values;
		submitReq(mtRequestUrl);
	}
}

function showBackPage(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showHistoryInfo(strFrmId, intRec, tokId, tokVal) {
	var strData = {};
	
	strData["txtIndex"] = intRec-1;
	strData["viewState"] = $('#viewState').val();
	strData[tokId] = tokVal;
	$.post('getInvHistoryInfo.form', strData, paintHistoryInfo, "json");
	return false;
}

function showHistoryGridInfo(strFrmId, intRec, tokId, tokVal) {
	 var strData = {};
	 strData["txtIndex"] = intRec-1;
	 strData["viewState"] = $('#viewState').val();
	 strData[tokId] = tokVal;
	 document.getElementById("txtRecordIndex").value = intRec;
	 $.post('getHistoryGridInfo.form', strData, paintHistoryInfo, "json");
	 return false;
	}

function paintHistoryInfo(data) {
	
	var cntr, row, lbl, spn;

	var actData = data.summaryData;
	var actLabels = data.summaryLabels;

	if (isEmpty(actData) || isEmpty(actLabels)) return false;

	var dlg = $('#addiInfo');

	dlg.children("#fld_accountId").text(actData.acno);
	dlg.children("#fld_currency").text(actData.currency);
	var valueDate = $.datepicker.parseDate("dd/mm/yy",  actData.value_date);
	var valueDate = $.datepicker.formatDate(localeDatePickerFormat,valueDate);	
	dlg.children("#fld_valueDate").text(valueDate);

	// Add dynamic fields
	var fldDiv = dlg.children("#info_fields").children("#lable");
	fldDiv.children().remove();
	
	cntr = 0;
	row = $('<tr></tr>');
	for (key in actData) {
		if (key.match(/^info_/)) {
			cntr++;
			lblCol = null;
			dataCol = null;
			lblCol = $('<td class="leftAlign grey odd_column" width="25%">' + actLabels[key] + '&nbsp; </td>');
			dataCol = $('<td class="leftAlign" width="25%">' + actData[key] + '</td>');
			row.append(lblCol);
			row.append(dataCol);
			if (cntr % 2 == 0) {
				fldDiv.append(row);
				row = $('<tr></tr>');
			}
		}
	}
	if (cntr % 2 != 0) {
		row.append(lblCol);
		row.append(dataCol);
		row.append($('<td>&nbsp;</td>'));
		row.append($('<td>&nbsp;</td>'));
		fldDiv.append(row);
	}
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:630,
				beforeClose: function(event, ui) {},
				buttons: {"Ok": function() {$(this).dialog("destroy");}}});
	dlg.dialog('open');
	return false;
}



function getUserPreferencePopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['saveBtn']] = function() {		
		var cboTo = document.getElementById('selectedColumns');
		
		for (i = 0; i < cboTo.length; i++) {
			cboTo.options[i].selected = true;
		}
		
		if($('#addSameUserPref').attr('checked')=='checked')
		{
			$('#addSameUserPref').val('Y');
		}
		
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
		$(this).dialog("close");		
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		userPreferenceCancel();	
		$(this).dialog("close");
	};
	$('#userPreferencePopup').dialog({
				autoOpen : false,
				height : 380,
				width : 770,
				modal : true,
				close: userPreferenceCancel,
				buttons : buttonsOpts
			});
	$('#userPreferencePopup').dialog("open");
}

function addSelected() {
	var cboFrom,cboTo;

	cboFrom = document.getElementById('availableColumns');
	cboTo = document.getElementById('selectedColumns');
	addRemove(cboFrom, cboTo);
}

function removeSelected() {
	var cboFrom,cboTo;

	cboFrom = document.getElementById('availableColumns');
	cboTo = document.getElementById('selectedColumns');
	addRemove(cboTo, cboFrom);
}

function addRemove(cboFrom, cboTo) {
	var opt, optNew;
	// Add selected element to cboTo
	for (var i = 0; i < cboFrom.length; i++) {
		opt = cboFrom.options[i];
		if (opt.selected) {
			optNew = document.createElement('option');
			optNew.text =  opt.text;
			optNew.value = opt.value;
			optNew.selected = true;
			cboTo.add(optNew, null);
		}
	}

	// Delete the selected element from cboFrom
	for (var i = cboFrom.length - 1; i >= 0; i--) {
		opt = cboFrom.options[i];
		if (opt.selected) cboFrom.remove(i);
	}
}

function addAllSelected() {
	var cboFrom,cboTo;

	cboFrom = document.getElementById('availableColumns');
	cboTo = document.getElementById('selectedColumns');
	addRemoveAll(cboFrom, cboTo);
}

function removeAllSelected() {
	var cboFrom,cboTo;

	cboFrom = document.getElementById('availableColumns');
	cboTo = document.getElementById('selectedColumns');
	addRemoveAll(cboTo, cboFrom);
}

function addRemoveAll(cboFrom, cboTo) {
	var opt, optNew;
	// Add all element to cboTo
	for (var i = 0; i < cboFrom.length; i++) {
		opt = cboFrom.options[i];
		optNew = document.createElement('option');
		optNew.text =  opt.text;
		optNew.value = opt.value;
		optNew.selected = true;
		cboTo.add(optNew, null);		
	}
	// Delete the all element from cboFrom
	for (var i = cboFrom.length - 1; i >= 0; i--) {
		opt = cboFrom.options[i];
		cboFrom.remove(i);
	}
}

function moveSelected(direction) {
 
    var cboFrom = document.getElementById('selectedColumns');
    var selectedIndex = cboFrom.selectedIndex;
	
	
	if(checkMultipleSelection()){
		alert("Multiple selection not allowed !");
		    return;
	}
	 
    if(-1 == selectedIndex) {        
        return;
    }
 
    var increment = -1;
    if(direction == 'up')
        increment = -1;
    else
        increment = 1;
 
    if((selectedIndex + increment) < 0 ||
        (selectedIndex + increment) > (cboFrom.options.length-1)) {
        return;
    }
 
    var selValue = cboFrom.options[selectedIndex].value;
    var selText = cboFrom.options[selectedIndex].text;
    cboFrom.options[selectedIndex].value = cboFrom.options[selectedIndex + increment].value
    cboFrom.options[selectedIndex].text = cboFrom.options[selectedIndex + increment].text
 
    cboFrom.options[selectedIndex + increment].value = selValue;
    cboFrom.options[selectedIndex + increment].text = selText;
 
    cboFrom.selectedIndex = selectedIndex + increment;
}

function checkMultipleSelection(){
	var cboFrom = document.getElementById('selectedColumns');
	var cnt = 0;
	
        for (var i = 0, j = cboFrom.options.length; i < j; i++)
        {
            if (cboFrom.options[i].selected)
            {
                cnt++;				
            }
			if(cnt > 1){
				return true;
			}
        }
	return false;
}


function getFundPopUp(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['submitBtn']] = function() {
		$(this).dialog("close");
		start_blocking(blockMsgText,this );
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		
		resetForm(frmId);	
		$('#fundCreditCcy').val(fundAmountCurrency);
		$("#fundDebitAccount").get(0).options.length = 1;
		$('#fundAmount').val('');		
		$('#fundReference').val('');	
		$('#fundDate').val('');		
		$(this).dialog("close");
	};
	$('#fundPopUp').dialog({
				autoOpen : false,
				height : 310,
				width : 520,
				modal : true,
				buttons : buttonsOpts
			});
	$('#fundPopUp').dialog("open");
}

function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function moveTopBottom(direction){
	var cboFrom = document.getElementById('selectedColumns');
    var selectedIndex = cboFrom.selectedIndex;
		
	if(checkMultipleSelection()){
		alert("Multiple selection not allowed !");
		    return;
	}
	
    if(-1 == selectedIndex) {        
        return;
    }
	
	var increment = -1;
	if(direction == 'top')
        increment = 0;
    else
        increment = cboFrom.options.length-1;
	
	var selValue = cboFrom.options[selectedIndex].value;
    var selText = cboFrom.options[selectedIndex].text;
	
	if(direction == 'top'){
		for (var i = selectedIndex; i >= 1; i--) {
			cboFrom.options[i].value = cboFrom.options[i-1].value
			cboFrom.options[i].text = cboFrom.options[i-1].text		
		}
	} else {	
		for (var i = selectedIndex; i < cboFrom.options.length-1; i++) {		
			cboFrom.options[i].value = cboFrom.options[i+1].value
			cboFrom.options[i].text = cboFrom.options[i+1].text		
		}
	}
	
	cboFrom.options[increment].value = selValue;
    cboFrom.options[increment].text = selText;
	
	cboFrom.selectedIndex= increment;
	
}

function getPaymentPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['submitBtn']] = function() {
		$(this).dialog("close");
		start_blocking(blockMsgText,this );
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {		
		$('#paymentDateId').val('');	
		$('#paymentBeneCode').val('');	
		$('#paymentProductId').val('');	
		$('#payRateTypeId').val('');	
		$('#payReferenceId').val('');		
		$("#payRateTypeId").attr("disabled","disabled");	
		$('#payRateTypeLabId').removeClass('required');
		$('#payAmountId').val('');
		$('#payDebitCcyId').val(loanAmountCurrency);
		$('#payCurrencyCodeId').val(loanAmountCurrency);
		$(this).dialog("close");
	};
	$('#paymentPopup').dialog({
				autoOpen : false,
				height : 310,
				width : 520,
				modal : true,
				buttons : buttonsOpts
			});
	$('#paymentPopup').dialog("open");
}

function handleEnableDisablePayRateType(){
	var combo = document.getElementById('payRateTypeId');
	if ('' == $('#payCurrencyCodeId').val() || '' == $('#payDebitCcyId').val()) {
		$("#payRateTypeId").attr("disabled", "disabled");
		$('#payRateTypeLabId').removeClass('required');
	} else if ($('#payCurrencyCodeId').val() != $('#payDebitCcyId').val()) {
		$("#payRateTypeId").removeAttr("disabled");
		$('#payRateTypeLabId').addClass('required');

	} else {
		$("#payRateTypeId").attr("disabled", "disabled");
		$('#payRateTypeLabId').removeClass('required');
		combo.selectedIndex = 0;
	}
}

function enableDisablePaymentLink(url)
{	
	if (String(isPaymentAccount) == 'true' && CAN_EDIT =='true')
	{
		$('#btnpayment').unbind('click');
		ToggleAttribute("btnpayment", true, "href");
		$('#btnpayment').click(function()
		{
			getPaymentPopup(url, 'paymentForm');
		});
	}
	else
	{
		ToggleAttribute("btnpayment", false, "href");
		$('#btnpayment').removeAttr('onclick').click(function()
		{});
		$('#btnpayment').unbind('click');
	}	
}


function enableDisableFundLink(url)
{	
	if (String(isFundAccount) == 'true' && CAN_EDIT =='true')
	{
		$('#btnFund').unbind('click');
		ToggleAttribute("btnFund", true, "href");
		$('#btnFund').click(function()
		{
			getFundPopUp(url, 'fundForm');
		});
	}
	else
	{
		ToggleAttribute("btnFund", false, "href");
		$('#btnFund').removeAttr('onclick').click(function()
		{});
		$('#btnFund').unbind('click');
	}	
}

function ToggleAttribute(obj, DoEnable, TagName) 
{
    
	obj = document.getElementById(obj);
	if (DoEnable) 
	{
		var TagValue = obj.getAttribute("back_" + TagName);
		if (TagValue != null) 
		{
			obj.setAttribute(TagName, TagValue);
			obj.removeAttribute("back_" + TagName);
		}
		var cssClass = obj.getAttribute("class");
		cssClass = cssClass.replace(" grey ", " black ");
		obj.setAttribute("class", cssClass);
	}
	else 
	{
		var TagValue = obj.getAttribute(TagName);
		if (TagValue != null)
		{
			obj.setAttribute("back_" + TagName, TagValue);
		}
		obj.removeAttribute(TagName);
		var cssClass = obj.getAttribute("class");
		cssClass = cssClass.replace(" black ", " grey ");
		obj.setAttribute("class", cssClass);
	}
}


function getPayRateTypes(item) {
	$("#payRateTypeId").get(0).options.length = 2;
	$("#payRateTypeId").get(0).selectedIndex = 0;	
	var debCur = $('#payDebitCcyId').val();
	var payCur = $('#payCurrencyCodeId').val();

	if (debCur != payCur) {
		for (key in rates) {
			var data = rates[key];
			var sellCur = data["s" + key];
			var buyCur = data["b" + key];
			if (buyCur == debCur && sellCur == payCur) {
				var opt = document.createElement("option");
				document.getElementById("payRateTypeId").options.add(opt);
				opt.text = data["c" + key];
				opt.value = data["c" + key];
			}
		}
	}
	handleEnableDisablePayRateType();
}

function handleEnableDisableFundRateType(){
	var combo = document.getElementById('fundRateType');	
		if('' == $('#fundCurrencyCode').val()){
			$("#fundRateType").attr("disabled","disabled");
			$('#rateTypeLabForFund').removeClass('required');
		} else if($('#fundCurrencyCode').val() == $('#fundCreditCcy').val()){
			$("#fundRateType").attr("disabled","disabled");
			$('#rateTypeLabForFund').removeClass('required');
		} else {
			$("#fundRateType").removeAttr("disabled","disabled");
			$('#rateTypeLabForFund').addClass('required');			
			combo.selectedIndex = 0;						
		}
		if($('#fundRateType').val() != ''){
			$("#fundRateType").removeAttr("disabled","disabled");
			$('#rateTypeLabForFund').addClass('required');			
		}
}

function getMsgPopup() {
$('#confirmMsgPopup').dialog( {
	autoOpen : true,
	height : 150,
	width : 350,
	modal : true,
	buttons :[
		{
			text:getLabel('btnOk','Ok'),
			click : function() {
				$(this).dialog("close");
			}
	}
	]
});
$('#confirmMsgPopup').dialog('open');
}

function submitReqBai2(strUrl)
{		
	var temp = document.getElementById("btnbai2");
	if (temp && temp.className.startsWith("imagelink grey"))
		return;	
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl
	frm.method = "POST";
	frm.submit();
}

function btrShowImage(strFrmId, url, checkDepositeNo) 
{
	var frm = document.getElementById(strFrmId);
	$('#checkDepositeNo').val(checkDepositeNo);
	frm.action = url;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=700,height=350";
	var winPopup = window.open ("", "hWinSeek", strAttr);
	winPopup.focus();
	frm.submit();
	frm.target = "";
}

function getAdvancedFilterPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['filterBtn']] = function() {
		$(this).dialog("close");
		$('#advancedFilterPopup').appendTo('#frmMain');
		goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['saveFilterBtn']] = function() {
		$(this).dialog("close");
		$('#advancedFilterPopup').appendTo('#frmMain');
		goToPage('btrActivitySaveAndFilter.form', frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetBtrAdvanceFilterForm();
		$(this).dialog("close");
	};
	$('#advancedFilterPopup').dialog({
				autoOpen : false,
				height : 490,
				width : 473,
				modal : true,
				buttons : buttonsOpts
			});
	$('#advancedFilterPopup').dialog("open");
}

function getFilterData(ctrl) {
	var filterCode=ctrl.options[ctrl.selectedIndex].value;
		if(filterCode)
		{
		var strData = {};
			strData['recKeyNo'] = filterCode;
			strData["screenId"] = 'Btr_Activity';
			strData[csrfTokenName] = csrfTokenValue;	
			$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
			$.ajax({
			        type: 'POST',	
			        data:strData,
			        url: "btrActivityFilterValues.formx",	       
			        success: function(data)
			        {
			           if (data!=null) 
					   { 
			        	   advFilterResetForm('advancedFilterPopup');
			        	   ctrl.value = filterCode;
			        	   valuesRetrieved(data);							   
					   }       	
			        }
			});
			}
			else{
			advFilterResetForm('advancedFilterPopup');
			resetBtrAdvanceFilterFormOnSelect();
			}
		
	}

function advFilterResetForm(frmId) {
	$("#" + frmId).find(':input').each(function() {
				switch (this.type) {
					case 'password' :
					case 'select-multiple' :
					case 'select-one' :
					case 'text' :
					case 'textarea' :
						$(this).val('');
						break;
					case 'checkbox' :
					case 'radio' :
						this.checked = false;
				}
			});
}

function valuesRetrieved(data) {

	 for (key in data.FILTER_DATA) {
	     switch (key) {
	     case 'filterCode':
	            break;
       case 'filterName':
           document.getElementById('filterName').value = '';
           break;
       case 'accountID':
           document.getElementById('filterAccountID').value = data.FILTER_DATA[key];
           break;
       case 'amountFilterOption':
           document.getElementById('amountFilterOption').value = data.FILTER_DATA[key];
           break;
       case 'txnAmount':
       	document.getElementById('txnAmount').value = data.FILTER_DATA[key];
           break;
       case 'fromDate':
    	   var vDate = data.FILTER_DATA[key];		   
    	   var vFromDate = $.datepicker.parseDate("yy-mm-dd", vDate);		   
   		   var vFromDate = $.datepicker.formatDate(defaultDateFormat, vFromDate);		   
           document.getElementById('fromPostingDate').value = vFromDate;
           break;
       case 'toDate':
		   var vDate = data.FILTER_DATA[key];		   
    	   var vToDate = $.datepicker.parseDate("yy-mm-dd", vDate);		   
   		   var vToDate = $.datepicker.formatDate(defaultDateFormat, vToDate);	
   		   document.getElementById('toPostingDate').value = vToDate;
           break;
       case 'drCrFlag':
           document.getElementById('drCrFlag').value = data.FILTER_DATA[key];
           break;
       case 'typeCodeDesc':
           document.getElementById('typeCodeDesc').value = data.FILTER_DATA[key];
           break;
       case 'bankReference':
           document.getElementById('bankReference').value = data.FILTER_DATA[key];
           break;
       case 'customerReference':
           document.getElementById('customerReference').value = data.FILTER_DATA[key];
           break;    
	     }
	}
}
function showCurrentActivity(url,frmId,date,account)
{
	document.getElementById('fromDate').value = date;
	document.getElementById('toDate').value	= date;
	document.getElementById('accountId').value	= account;
	document.getElementById('dateType').value	= "R";
	goToPage(url, frmId);
}

function showDateRangeSummary(ctrl) 
{
	if ("R" == ctrl.options[ctrl.selectedIndex].value)
	{
		$("#divDateRange").toggleClass("ui-helper-hidden", false);
		$("#dateRangeAlternate").addClass("ui-helper-hidden");
	}
	else 
	{
		$("#divDateRange").toggleClass("ui-helper-hidden", true);
		$("#dateRangeAlternate").removeClass("ui-helper-hidden");
	}
}
function showExportPoup(frmId)
{
	var url;
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		url = $("#fileFormat").val();
		if ('' == url)
		{
			$("#errorDiv").show();
		}
		else
		{
			$(this).dialog("close");
			switch (url)
			{
			case 'noval':
				return false;
			case 'mt940':
				submitReq('btrActivityMt940.form');
				return false;
			case 'priorQuickIn':
				submitReqQuickIn('btrPriorQuickIn.form');
			return false;
			case 'quickIn':
				submitReqQuickIn('btrActivityQuickIn.form');
			return false;
			default:
				btrDownload(url);
			}
		}
		
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$("#fileFormat").val("");
		if ($("#btnWithHeader").hasClass("icon-checkbox-unchecked"))
		{
			$("#btnWithHeader").toggleClass("icon-checkbox-checked icon-checkbox-unchecked");
			$("#btnWithHeader").trigger('show');
		}
		$(this).dialog("close");
	};
	$("#fileFormat").val("");
	if ($("#btnWithHeader").hasClass("icon-checkbox-unchecked"))
		{
			$("#btnWithHeader").toggleClass("icon-checkbox-checked icon-checkbox-unchecked");
			$("#btnWithHeader").trigger('show');
		}
	$("#withHeader").val("Y");
	$("#errorDiv").hide();
	$('#btrExportPopup').dialog({
				autoOpen : false,
				height : 240,
				width : 410,
				modal : true,
				buttons : buttonsOpts
			});
	$('#btrExportPopup').dialog("open");
}

selectedCheckBox = new Array();

function accountSetRowSelect(checkBoxId, index) {
	var index;
	
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1) {
		if (checkBoxId.checked == true) {
			selectedCheckBox[selectedCheckBox.length] = checkBoxId
					.getAttribute("id");			
		} else {			
			selectedCheckBox.splice(index, 1);
		}
	}
}

function selectedExists(checkID) {
	for ( var i = 0; i < selectedCheckBox.length; i++) {
		if (selectedCheckBox[i] == checkID) {
			return i;
		}
	}
	return 0;
}

function saveAccountSet(strUrl, frmId){
	document.getElementById("selectedIndex").value = selectedCheckBox;
	goToPage(strUrl, frmId);
}