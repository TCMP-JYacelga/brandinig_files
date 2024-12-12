jQuery.fn.clientAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/userclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#clientDesc').val(data.DESCR);
								$('#clientId').val(data.CODE);
							}
						}
						submitOnChange(strMode);
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

var _objDialog;

function showBackPage(strAction)
{
	var strUrl;
	var frm = document.forms["frmMain"];
	
	frm.target ="";
	if ("AUTHVIEW_DETAIL" == strAction)
		strUrl = "";
	else if ("HVIEW_DETAIL" == strAction)
		strUrl = "viewDepositHeader.form";
	else if ("CVIEW_DETAIL" == strAction || "CEDIT_DETAIL" == strAction || "CUPDATE_DETAIL" == strAction
			|| "CSAVE_DETAIL" == strAction)
		strUrl = "showDepositInstList.form";
	else
		strUrl = "editDepositHeader.form";
	
	if (frm.myProduct1)
		frm.myProduct1.value = "";
	if (frm.myProduct)
		frm.myProduct.value = "";
	if (frm.bankProduct)
		frm.bankProduct.value = "";
	if (frm.referenceNo)
		frm.referenceNo.value = "";
	if (frm.txnCurrency)
		frm.txnCurrency.value = "";
	if (frm.accountNo)
		frm.accountNo.value = "";
	if (frm.amount)
		frm.amount.value = "";
	if (frm.instrumentNumber)
		frm.instrumentNumber.value = "";
	if (frm.drawerDescription)
		frm.drawerDescription.value = "";
	if (frm.fileName)
		frm.fileName.value = "";

	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function submitOnChange(strAction)
{
	var frm = document.forms["frmMain"]; 
	
	frm.target ="";
	if (strAction == "ADD_DETAIL" || strAction == "SAVE_DETAIL")
		frm.action = "changeDetailDataAdd.form";
	else if(strAction == "CADD_DETAIL" ||  strAction == "CSAVE_DETAIL")
		frm.action = "cChangeDetailDataAdd.form";
	else if(strAction == "CEDIT_DETAIL" ||  strAction == "CUPDATE_DETAIL")
		frm.action = "cChangeDetailDataEdit.form";
	else
		frm.action = "changeDetailDataEdit.form";

	frm.method = "POST";
	frm.submit();
}

function setFormAction(strAction)
{
	var strUrl;
	var frm = document.forms["frmMain"]; 
	
	frm.target ="";
	if (strAction == "ADD_DETAIL" || strAction == "SAVE_DETAIL")
		frm.action = "saveDepositDetail.form";
	else if (strAction == "CADD_DETAIL" || strAction == "CSAVE_DETAIL")
		frm.action = "cSaveDepositDetail.form";
	else if (strAction == "CEDIT_DETAIL" || strAction == "CUPDATE_DETAIL")
		frm.action = "cUpdateDepositDetail.form";
	else
		frm.action = "updateDepositDetail.form";

	frm.method = 'POST';
	frm.submit();
}

function toggleReadOnly(ctrl, elementId)
{
	var frm = document.forms["frmMain"]; 

	if (ctrl.checked)
		frm[elementId].readOnly = false;
	else
	{
		frm[elementId].value = "";
		frm[elementId].readOnly = true;
	}
}

function showDenomForm(strAction, strDenomAction)
{
	var strUrl;
	var frm = document.forms["frmMain"]; 
	
	frm.target ="";
	if ("AUTHVIEW_DETAIL" == strAction)
		strUrl = "";
	else if ("ADD_DETAIL" == strAction || "SAVE_DETAIL" == strAction || "EDIT_DETAIL" == strAction
			|| "UPDATE_DETAIL" == strAction)
	{
		if ("ADD" == strDenomAction)
			strUrl = "addDepositDenomination.form";
		else
			strUrl = "editDepositDenomination.form";
	}
	else if ("VIEW_DETAIL" == strAction)
		strUrl = "viewDepositDenomination.form";
	else if ("HVIEW_DETAIL" == strAction)
		strUrl = "headerViewDepositDenomination.form";
	else if ("CVIEW_DETAIL" == strAction)
		strUrl = "commonViewDepositDenomination.form";
	else if ("CADD_DETAIL" == strAction || "CSAVE_DETAIL" == strAction || "CEDIT_DETAIL" == strAction
			|| "CUPDATE_DETAIL" == strAction)
	{
		if ("ADD" == strDenomAction)
			strUrl = "cAddDepositDenomination.form";
		else
			strUrl = "commonEditDepositDenomination.form";
	}

	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function showEnrichmentForm(strAction, strEnrichAction)
{
	var strUrl;
	var frm = document.forms["frmMain"];
	
	frm.target ="";
	if ("AUTHVIEW_DETAIL" == strAction)
		strUrl = "";
	else if ("ADD_DETAIL" == strAction || "SAVE_DETAIL" == strAction || "EDIT_DETAIL" == strAction
			|| "UPDATE_DETAIL" == strAction)
	{
		if ("ADD" == strEnrichAction)
			strUrl = "addDepositEnrichment.form";
		if ("EDIT" == strEnrichAction)
			strUrl = "editDepositEnrichment.form";
		else if ("MULTISET" == strEnrichAction)
			strUrl = "depositEnrichmentEditList.form";
	}
	else if ("VIEW_DETAIL" == strAction)
	{
		 if ("MULTISET" == strEnrichAction)
			 strUrl = "depositEnrichmentViewList.form";
		 else
			 strUrl = "viewDepositEnrichment.form";
	}
	else if ("HVIEW_DETAIL" == strAction)
	{
		if ("MULTISET" == strEnrichAction)
			strUrl = "depositEnrichmentHViewList.form";
		else
			strUrl = "headerViewDepositEnrichment.form";
	}
	else if ("CVIEW_DETAIL" == strAction)
	{
		if ("MULTISET" == strEnrichAction)
			strUrl = "depositEnrichmentCommonViewList.form";
		else
			strUrl = "commonViewDepositEnrichment.form";
	}
	else if ("CADD_DETAIL" == strAction || "CSAVE_DETAIL" == strAction || "CEDIT_DETAIL" == strAction
			|| "CUPDATE_DETAIL" == strAction)
	{
		if ("ADD" == strEnrichAction)
			strUrl = "cAddDepositEnrichment.form";
		else if ("EDIT" == strEnrichAction)
			strUrl = "commonEditDepositEnrichment.form";
		else if ("MULTISET" == strEnrichAction)
			strUrl = "depositEnrichmentCommonEditList.form";
	}
	
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

/**
 * A generic function to display the modal dialog for inputting Adhoc Drawer . This function assumes that
 * @param intWidth The width of the dialog in pixels.
 * @param intHeight The width of the dialog in pixels.
 * @param strTitle The text to be displayed in dialog's title bar.
 * @param lblTitle The title to be used for the remarks field.
 * @return Nothing
 * @author Anuj Choudhary
 * @date July 22, 2010
 */
function getAdhocDrawer(intWidth, intHeight, strTitle, lblTitle, blnDirectDebitFlag)
{
	_populateDrawer();
	_objDialog = $('#adDialog');
	$('#adField').text(lblTitle);
	_objDialog.dialog({bgiframe:true, autoOpen:false, height:intHeight, modal:true, resizable:false, width:intWidth,
					title: strTitle, buttons: {"Continue": function() {_setAdhocDrawer(blnDirectDebitFlag);},
					Cancel: function() {$(this).dialog('destroy');}}});
    _objDialog.dialog('open');
}

/**
 * @return Nothing
 * @author Anuj Choudhary
 * @date July 22, 2010
 */
function _setAdhocDrawer(blnDirectDebitFlag)
{
	var strBankDesc = document.getElementById('adtxtBankDesc').innerHTML;
	var strBranchDesc = document.getElementById('adtxtBranchDesc').innerHTML;
	var strDwrCcy = document.getElementById('adtxtAccountCurrency').value;

	if (document.getElementById('adchkSaveDrawer').checked)
	{
		if (isEmpty(trim(document.getElementById('adtxtDrawerCode').value)))
		{
			alert(adhocDrawerLocMessages["ERR_DRAWERCODE"]);
			return false;
		}
	}
	if (isEmpty(trim(document.getElementById('adtxtDrawerName').value)))
	{
		alert(adhocDrawerLocMessages.ERR_DRAWERNAME);
		return false;
	}
	if (isEmpty(trim(document.getElementById('adtxtDrawerAddress').value)))
	{
		alert(adhocDrawerLocMessages.ERR_DRAWERADD);	
		return false;
	}
	
	if (blnDirectDebitFlag || document.getElementById('adchkSaveDrawer').checked)
	{
		if (isEmpty(trim(document.getElementById('adtxtAccountNo').value)))
		{
			alert(adhocDrawerLocMessages.ERR_DRAWERACC);	
			return false;
		}

		if (isEmpty(trim(document.getElementById('adtxtAccountCurrency').value)))
		{
			alert(adhocDrawerLocMessages.ERR_DRAWERCCY);	
			return false;
		}
	}
	
	document.getElementById('drawerCode').value = document.getElementById('adtxtDrawerCode').value;
	document.getElementById('drawerDescription').value = document.getElementById('adtxtDrawerName').value;
	document.getElementById('drawerAccountNo').value = document.getElementById('adtxtAccountNo').value;
	document.getElementById('drawerBankCode').value = document.getElementById('adtxtBankCode').value;
	document.getElementById('drawerBankDesc').innerHTML = isEmpty(trim(strBankDesc)) ? "&nbsp;" : strBankDesc;
	document.getElementById('drawerBranchCode').value = document.getElementById('adtxtBranchCode').value;
	document.getElementById('drawerBranchDesc').innerHTML = isEmpty(trim(strBranchDesc)) ? "&nbsp;" : strBranchDesc;
	document.getElementById('drawerAccountNo').value = document.getElementById('adtxtAccountNo').value ;
	document.getElementById('drawerCCY').innerHTML = isEmpty(trim(strDwrCcy)) ? "&nbsp;" : strDwrCcy;
	document.getElementById('drawerCurrency').value = document.getElementById('adtxtAccountCurrency').value;
	document.getElementById('drawerAddress').value = document.getElementById('adtxtDrawerAddress').value;
	document.getElementById('drawerTelephone').value = document.getElementById('adtxtDrawerMobile').value;
	document.getElementById('drawerMail').value = document.getElementById('adtxtDrawerEmail').value;
	document.getElementById('drawerBankBic').value = document.getElementById('adtxtBIC').value;
	document.getElementById('drawerBankAddress').value = document.getElementById('adtxtBankAddress').value;
	document.getElementById('iban').value = document.getElementById('adtxtIBAN').value;
	document.getElementById('receivingCorBic').value = document.getElementById('adtxtRCBIC').value;
	document.getElementById('drawerBankCountry').value = document.getElementById('drawerCountry').value;

	if (document.getElementById('adchkSaveDrawer').checked)
		document.getElementById('adhocDrawerFlag').value = "S";
	else
		document.getElementById('adhocDrawerFlag').value = "A";
	
	if (document.frmAdhocDwr.adhocDwrBankFlag[1].checked)
		document.getElementById('adhocBankFlag').value = "Y";
	else
		document.getElementById('adhocBankFlag').value = "N";

	_objDialog.dialog('destroy');
}

function _populateDrawer()
{
	var adhocBankCtrl = document.getElementById('adhocBankFlag');
	var strMICRNo;
	var strAdhocBankFlag = adhocBankCtrl.value;
	var blnMICREntered = false;

	if (document.getElementById('micrNo'))
	{
		strMICRNo = document.getElementById('micrNo').value;
		if (!isEmpty(strMICRNo) && trim(strMICRNo).length == 9)
			blnMICREntered = true;
	}

	if ("A" == document.getElementById('adhocDrawerFlag').value
		|| "S" == document.getElementById('adhocDrawerFlag').value)
	{
		document.getElementById('adtxtDrawerCode').value = document.getElementById('drawerCode').value;
		document.getElementById('adtxtDrawerName').value = document.getElementById('drawerDescription').value;
		document.getElementById('adtxtAccountNo').value = document.getElementById('drawerAccountNo').value;
		document.getElementById('adtxtAccountCurrency').value = document.getElementById('drawerCurrency').value;
		document.getElementById('adtxtBankCode').value = document.getElementById('drawerBankCode').value;
		document.getElementById('adtxtBankDesc').innerHTML = document.getElementById('drawerBankDesc').innerHTML;
		document.getElementById('adtxtBranchCode').value = document.getElementById('drawerBranchCode').value;
		document.getElementById('adtxtBranchDesc').innerHTML = document.getElementById('drawerBranchDesc').innerHTML;
		document.getElementById('adtxtAccountNo').value = document.getElementById('drawerAccountNo').value;
		document.getElementById('adtxtDrawerAddress').value = document.getElementById('drawerAddress').value;
		document.getElementById('adtxtDrawerMobile').value = document.getElementById('drawerTelephone').value;
		document.getElementById('adtxtDrawerEmail').value = document.getElementById('drawerMail').value;
		document.getElementById('adtxtBIC').value = document.getElementById('drawerBankBic').value;
		document.getElementById('adtxtBankAddress').value = document.getElementById('drawerBankAddress').value;
		document.getElementById('adtxtIBAN').value = document.getElementById('iban').value;
		document.getElementById('adtxtRCBIC').value = document.getElementById('receivingCorBic').value;
		document.getElementById('drawerCountry').value = document.getElementById('drawerBankCountry').value;
		document.getElementById('adhocDwrBankFlag').value = document.getElementById('adhocBankFlag').value;

		if ("S" == document.getElementById('adhocDrawerFlag').value)
			document.getElementById('adchkSaveDrawer').checked = true;
	}
	_toggleBankBranch(adhocBankCtrl, 'adseekBankBranch', 'adtxtBankBranchCode', 'adtxtBankCode', 'adtxtBankDesc',
						'adtxtBranchCode', 'adtxtBranchDesc', 'adtxtBIC', 'adtxtBankAddress', 'drawerCountry');
	if (blnMICREntered)
	{
		document.getElementById('adtxtBankBranchCode').readOnly = true;
		document.getElementById('adseekBankBranch').className = "hidden";
		document.frmAdhocDwr.adhocDwrBankFlag[0].checked = true;
		document.frmAdhocDwr.adhocDwrBankFlag[0].disabled = true;
		document.frmAdhocDwr.adhocDwrBankFlag[1].disabled = true;
	}
	else
	{
		document.getElementById('adtxtBankBranchCode').readOnly = false;
		document.getElementById('adseekBankBranch').className = "seeklink inline_block";
		document.frmAdhocDwr.adhocDwrBankFlag[0].disabled = false;
		document.frmAdhocDwr.adhocDwrBankFlag[1].disabled = false;
		if ("Y" == strAdhocBankFlag)
			document.frmAdhocDwr.adhocDwrBankFlag[1].checked = true;
		else
			document.frmAdhocDwr.adhocDwrBankFlag[0].checked = true;
	}
}

function selectRegisteredDrawer()
{
		document.getElementById('adtxtDrawerCode').value = "";
		document.getElementById('adtxtDrawerName').value = "";
		document.getElementById('adtxtAccountNo').value = "";
		document.getElementById('adtxtAccountCurrency').value = "";
		document.getElementById('adtxtBankCode').value = "";
		document.getElementById('adtxtBankDesc').innerHTML = "&nbsp;";
		document.getElementById('adtxtBranchCode').value = "";
		document.getElementById('adtxtBranchDesc').innerHTML = "&nbsp;";
		document.getElementById('adtxtAccountNo').value = "";
		document.getElementById('adtxtDrawerAddress').value = "";
		document.getElementById('adtxtDrawerMobile').value = "";
		document.getElementById('adtxtDrawerEmail').value = "";
		document.getElementById('adtxtBIC').value = "";
		document.getElementById('adtxtBankAddress').value = "";
		document.getElementById('adtxtIBAN').value = "";
		document.getElementById('adtxtRCBIC').value = "";
		document.getElementById('adhocDrawerFlag').value = "R";
		document.getElementById('adchkSaveDrawer').checked = false;
		document.getElementById('drawerAddress').value = "";
		document.getElementById('drawerTelephone').value = "";
		document.getElementById('drawerMail').value = "";
		document.getElementById('drawerBankBic').value = "";
		document.getElementById('drawerBankAddress').value = "";
		document.getElementById('iban').value = "";
		document.getElementById('receivingCorBic').value = "";
		if ("Y" == document.getElementById('adhocBankFlag').value)
		{
			document.getElementById('drawerBankCode').value = "";
			document.getElementById('drawerBankDesc').innerHTML = "&nbsp;";
			document.getElementById('drawerBranchCode').value = "";
			document.getElementById('drawerBranchDesc').innerHTML = "&nbsp;";
		}
		document.getElementById('adhocBankFlag').value = "N";
		document.frmAdhocDwr.adhocDwrBankFlag[0].checked = true; 
		document.getElementById('drawerBankCountry').value = "";
		document.getElementById('drawerCountry').value = "";
}

function checkSaveDrawer(ctrl, elementId)
{
	if(ctrl.checked)
	{
		document.getElementById(elementId).readOnly = false;
	}
	else
	{
		document.getElementById(elementId).value = "";
		document.getElementById(elementId).readOnly = true;
	}
}

function _toggleBankBranch(ctrl, seekId, elementId1, elementId2, elementId3, elementId4, elementId5,
		elementId6, elementId7, elementId8)
{
	if (ctrl.type == 'radio')
	{
		document.getElementById(elementId1).value = "";
		document.getElementById(elementId2).value = "";
		document.getElementById(elementId3).innerHTML = "&nbsp;";
		document.getElementById(elementId4).value = "";
		document.getElementById(elementId5).innerHTML = "&nbsp;";
		document.getElementById(elementId6).value = "";
		document.getElementById(elementId7).value = "";
		document.getElementById(elementId8).value = "";
	}

	if ((ctrl.type == 'radio' && document.frmAdhocDwr.adhocDwrBankFlag[1].checked)
		|| (ctrl.type == 'hidden' && "Y" == ctrl.value))
	{
		document.getElementById(elementId1).readOnly = true;
		document.getElementById(elementId2).readOnly = false;
		document.getElementById(elementId4).readOnly = false;
		document.getElementById(elementId6).readOnly = false;
		document.getElementById(elementId7).readOnly = false;
		document.getElementById(elementId8).disabled= false;
		document.getElementById(seekId).className = "hidden";
	}
	else
	{
		document.getElementById(elementId1).readOnly = false;
		document.getElementById(elementId2).readOnly = true;
		document.getElementById(elementId4).readOnly = true;
		document.getElementById(elementId6).readOnly = true;
		document.getElementById(elementId7).readOnly = true;
		document.getElementById(elementId8).disabled=true;
		document.getElementById(seekId).className = "seeklink inline_block";
	}
}

function getRecord(json, elementId)
{	
	var myJSONObject   = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for (i=0; i < inputIdArray.length; i++)
	{
    	if (document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
    		var type = document.getElementById(inputIdArray[i]).type;

    		if (null == myJSONObject.columns[i].value)
    			myJSONObject.columns[i].value = "";

    		if (type == 'text')
    			document.getElementById(inputIdArray[i]).value = myJSONObject.columns[i].value;
    		else
    			document.getElementById(inputIdArray[i]).innerHTML = myJSONObject.columns[i].value; 
    	}
	}

    if (document.getElementById('seekUrl').value == "drawer")
    	selectRegisteredDrawer();
    if (document.getElementById('seekUrl').value == "bank" || document.getElementById('seekUrl').value == "branch")
    	selectRegisteredBankBranch(document.getElementById('seekUrl').value);
    if (document.getElementById('seekUrl').value == "mandate")
    	submitOnChange(_strMode);
}

function _toggleDrawerBankDetails(blnSetEmptyFields, blnDrawerDetailsEnabled)
{
	var strMICRNo = "";

	if (blnDrawerDetailsEnabled)
	{
		if (document.getElementById('micrNo'))
			strMICRNo = document.getElementById('micrNo').value;
		
		if (!isEmpty(strMICRNo) && trim(strMICRNo).length == 9)
		{
			if (blnSetEmptyFields)
			{
				document.getElementById('drawerBankCode').value = "";
				document.getElementById('drawerBankDesc').innerHTML = "&nbsp;";
				document.getElementById('drawerBranchCode').value = "";
				document.getElementById('drawerBranchDesc').innerHTML = "&nbsp;";
				document.getElementById('clearingLocationDesc').innerHTML = "&nbsp;";
				document.getElementById('clearingLocation').value = "";
			}
	
			document.getElementById('drawerBankCode').readOnly = true;
			document.getElementById('drawerBankCode').className = "codeBox rounded disabled";
			document.getElementById('drawerBankCodeSeek').className = "hidden";
			document.getElementById('drawerBranchCode').readOnly = true;
			document.getElementById('drawerBranchCode').className = "codeBox rounded disabled";
			document.getElementById('drawerBranchCodeSeek').className = "hidden";
			document.getElementById('clearingLocation').readOnly = true;
			document.getElementById('clearingLocation').className = "codeBox rounded disabled";
			document.getElementById('clearingLocationSeek').className = "hidden";
		}
		else
		{
			document.getElementById('drawerBankCode').readOnly = false;
			document.getElementById('drawerBankCode').className = "codeBox rounded";
			document.getElementById('drawerBankCodeSeek').className = "seeklink inline_block";
			document.getElementById('drawerBranchCode').readOnly = false;
			document.getElementById('drawerBranchCode').className = "codeBox rounded";
			document.getElementById('drawerBranchCodeSeek').className = "seeklink inline_block";
			document.getElementById('clearingLocation').readOnly = false;
			document.getElementById('clearingLocation').className = "codeBox rounded";
			document.getElementById('clearingLocationSeek').className = "seeklink inline_block";
		}
	}
	else
		return false;
}

function selectRegisteredBankBranch(strSeekType)
{
		document.getElementById('adtxtBankCode').value = "";
		document.getElementById('adtxtBankDesc').innerHTML = "&nbsp;";
		document.getElementById('adtxtBranchCode').value = "";
		document.getElementById('adtxtBranchDesc').innerHTML = "&nbsp;";
		document.getElementById('adtxtBIC').value = "";
		document.getElementById('adtxtBankAddress').value = "";
		document.getElementById('adtxtIBAN').value = "";
		document.getElementById('adtxtRCBIC').value = "";
		document.getElementById('drawerBankBic').value = "";
		document.getElementById('drawerBankAddress').value = "";
		document.getElementById('iban').value = "";
		document.getElementById('receivingCorBic').value = "";
		if ("Y" == document.getElementById('adhocBankFlag').value)
		{
			if ("bank" == strSeekType)
			{
				document.getElementById('drawerBranchCode').value = "";
				document.getElementById('drawerBranchDesc').innerHTML = "&nbsp;";
			}
			else
			{
				document.getElementById('drawerBankCode').value = "";
				document.getElementById('drawerBankDesc').innerHTML = "&nbsp;";
			}
		}
		document.getElementById('adhocBankFlag').value = "N";
		document.frmAdhocDwr.adhocDwrBankFlag[0].checked = true; 
		document.getElementById('drawerBankCountry').value = "";
		document.getElementById('drawerCountry').value = "";
}

function performAnd(strValidActions, strCurrentIndexActions)
{
	var strReturn = "";
	var i = 0;
	if (strValidActions.length == strCurrentIndexActions.length)
	{
		for (i=0; i<8; i++)
		{
			strReturn = strReturn + (strValidActions.charAt(i) & strCurrentIndexActions.charAt(i));
		}
	}
	return strReturn;
}

function refreshButtons(authLevel, requestState, module)
{
	var i = 0;
	var strActionBitset;
	// DO THE ANDING WITH SERVER BITMAP

	if (!requestState) return;
	if (authLevel == '1') return;
	
	_strValidActionBitset = arrDepositInst[requestState];
	if (!_strValidActionBitset || _module != module) _strValidActionBitset = "00000000";

	strActionBitset = performAnd(_strValidActionBitset, _strServerBitset);	
	if (strActionBitset.length > 0)
	{
		for (i=0; i<8; i++)
		{
			switch (i)
			{
				case 1: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					else
						document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					break;					

				case 2: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
					else
						document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					break;

				case 3: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnSend").className ="imagelink black inline_block button-icon icon-button-send font_bold";
					else
						document.getElementById("btnSend").className ="imagelink grey inline_block button-icon icon-button-send-grey font-bold";
					break;

				case 4: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
					else
						document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					break;

				case 5: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnHold").className ="imagelink black inline_block button-icon icon-button-hold font_bold";
					else
						document.getElementById("btnHold").className ="imagelink grey inline_block button-icon icon-button-hold-grey font-bold";
					break;

				case 6: 
					if (strActionBitset.charAt(i) == 1)
						document.getElementById("btnRelease").className ="imagelink black inline_block button-icon icon-button-relese font_bold";
					else
						document.getElementById("btnRelease").className ="imagelink grey inline_block button-icon icon-button-release-grey font-bold";
					break;
			}
		}
	}	
}

function acceptRecords(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;

	frm.target ="";
	frm.action = "acceptMultiActionInst.form";
	frm.method = "POST";
	frm.submit();
}


function rejectRecords(ctrl, rejTitle, rejMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;

	getRemarks(350, rejTitle, rejMsg, document.getElementById("current_index").value, rejectRecord);
}

function rejectRecord(objJsonData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Reject Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		//document.getElementById("current_index").value = objJsonData;
		frm.target = "";
		frm.action = "rejectMultiActionInst.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function sendRecords(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;

	frm.target ="";
	frm.action = "sendMultiActionInst.form";
	frm.method = "POST";
	frm.submit();
}

function deleteRecords(ctrl, rejTitle, rejMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;

	getRemarks(350, rejTitle, rejMsg, document.getElementById("current_index").value, deleteRecord);
}

function deleteRecord(objJsonData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Reject Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		//document.getElementById("current_index").value = objJsonData;
		frm.target = "";
		frm.action = "deleteMultiActionInst.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function getHoldRecord(ctrl, holdTitle, holdMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	getRemarks(230, holdTitle, holdMsg, [document.getElementById("current_index").value], holdRecord);
}

function holdRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 
	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Holding Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.target = "";
		frm.action = "holdMultiActionInst.form";
		frm.method = 'POST';
		frm.submit();
	}
}
function getReleaseRecord(ctrl, relTitle, relMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	getRemarks(230, relTitle, relMsg, [document.getElementById("current_index").value], releaseRecord);
}

function releaseRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Releasing Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.target = "";
		frm.action = "releaseMultiActionInst.form";
		frm.method = 'POST';
		frm.submit();
	}

}

function processDetail(blnProceed, arrData)
{
	if (!blnProceed) return;
	var frm = document.forms["frmMain"]; 
	frm.target = "";
	document.getElementById("prdCutoffFlag").value = 'Y';
	if (!isEmpty(arrData[0]))
		frm.action = arrData[0];
	frm.method = "POST";
	frm.submit();
}

function setCurrency(txnCurrency,mode)
{
	if (document.getElementById("amount") != null && document.getElementById("amount").value != "")
	{		
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = txnCurrency;
	}
	else
	{
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = "";
	}
	if (mode == 'HVIEW_DETAIL')
	{
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = txnCurrency;
	}
}
jQuery.fn.ForceAlphaNumericAndPercentOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9 || keycode == 37)
								return true;

							return false;
						})
			})
};