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

function showAddNewForm(strUrl)
{
	var frmMain = document.forms["frmMain"]; 
	var frm = document.forms["frmChild"];
	frm.target ="";
	frm.viewState.value = frmMain.viewState.value
	frm.clientId.value = $('#clientId').val();
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showViewForm(strAction, index)
{
	var frmMain = document.forms["frmMain"]; 
	var frm = document.forms["frmChild"];
	frm.target ="";
	frm.viewState.value = frmMain.viewState.value
	frm.current_index.value = index
	if ("AUTH_DETAIL" == strAction)
		frm.action = "";
	else if ("VIEW" == strAction)
		frm.action = "headerViewDepositDetail.form";
	else
		frm.action = "viewDepositDetail.form";
	
	frm.method = "POST";
	frm.submit();
}

function showEditForm(index)
{
	var frmMain = document.forms["frmMain"]; 
	var frm = document.forms["frmChild"];
	frm.target ="";
	frm.viewState.value = frmMain.viewState.value
	frm.current_index.value = index
	frm.action = "editDepositDetail.form";
	frm.method = "POST";
	frm.submit();
}

function deleteRecord(ctrl, index)
{
	var frm = document.forms["frmMain"];
	ctrl.className = "linkbox discardedlink";
	document.getElementById("current_index").value = index;
	frm.target ="";
	frm.action = "deleteDepositDetail.form";
	frm.method = "POST";
	frm.submit();
}

function showBackPage(strAction)
{
	var strUrl;
	var frm = document.forms["frmMain"];

	frm.target ="";
 	if ("AUTHVIEW" == strAction)
		strUrl = "";
	else
		strUrl = "showDepositList.form";

	if (frm.myProduct1)
		frm.myProduct1.value = "";
	if (frm.myProduct)
		frm.myProduct.value = "";
	if (frm.bankProduct)
		frm.bankProduct.value = "";
	if (frm.referenceNo)
		frm.referenceNo.value = "";
	if (frm.entryDate)
		frm.entryDate.value = "";
	if (frm.txnCurrency)
		frm.txnCurrency.value = "";
	if (frm.amount)
		frm.amount.value = "";
	if (frm.totalNo)
		frm.totalNo.value = "";
	if (frm.fileName)
		frm.fileName.value = "";

	frm.viewState.value = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
	return true;
}

function submitOnChange(strAction)
{
	var frm = document.forms["frmMain"]; 
	frm.target ="";
	if (strAction == "ADD" || strAction == "SAVE")
		frm.action = "changeDataAdd.form";
	else
		frm.action = "changeDataEdit.form";
	frm.method = "POST";
	frm.submit();

}

function submitOnMyProductChange(strAction)
{
	var frm = document.forms["frmMain"]; 
	frm.target ="";
	if (strAction == "ADD" || strAction == "SAVE")
		frm.action = "changeMyProductAdd.form";
	else
		frm.action = "changeMyProductEdit.form";
	frm.method = "POST";
	frm.submit();
	
}

function setFormAction(strAction)
{
	document.getElementById("clientId").disabled=false;
	var frm = document.forms["frmMain"]; 
	frm.target ="";
	if (strAction == "ADD" || strAction == "SAVE")
		frm.action = "saveDepositHeader.form";
	else
		frm.action = "updateDepositHeader.form";
	if(strAction == "UPDATE" || strAction == "EDIT")	
	   $('<input>').attr({type: 'hidden', id: 'clientId',name: 'clientId', value : $('#clientId').val()}).appendTo(frm);
	frm.method = "POST";
	frm.submit();
}

function closeRecord()
{
	var frm = document.forms["frmMain"]; 
	frm.target ="";
	frm.action = "closeDeposit.form";
	
	frm.method = "POST";
	frm.submit();
}

function getRecord(json,elementId)
{	
	var myJSONObject = JSON.parse(json);	
    var inputIdArray = elementId.split("|");
    for (i=0; i < inputIdArray.length; i++)
	{
    	if (document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			if (null == myJSONObject.columns[i].value)
				myJSONObject.columns[i].value = "";
    		var type = document.getElementById(inputIdArray[i]).type;
    		if (type == 'text')
    			document.getElementById(inputIdArray[i]).value = myJSONObject.columns[i].value;
    		else
    			document.getElementById(inputIdArray[i]).innerHTML = myJSONObject.columns[i].value; 
    	}
	}    
}

function toggleRecordSelection(ctrl, authLevel, requestState, module, index)
{
	var blnFirst = true;
	var blnIndexCurrentStatus;

	if (module != _module)
		return false;
	blnIndexCurrentStatus = objJsonIndicesStatus[index];
	
	if (blnIndexCurrentStatus == undefined) blnIndexCurrentStatus = false;

	if (blnIndexCurrentStatus)
	{
		objJsonIndicesStatus[index] = false;
		delete objJsonPossibleActions[index];
		ctrl.className = "linkbox acceptlink";
	}
	else
	{
		objJsonIndicesStatus[index] = true;
		if (authLevel == '1')
			objJsonPossibleActions[index] = arrDepositRightsMap[requestState];
		else
			objJsonPossibleActions[index] = arrDepositInstRightsMap[requestState];
		ctrl.className = "linkbox acceptedlink";
	}

	_strValidActionBitset = "00000000";
	for (var key in objJsonPossibleActions)
	{
		if (objJsonPossibleActions.hasOwnProperty(key))
		{
		    if (blnFirst)
		    {
		    	_strValidActionBitset = objJsonPossibleActions[key];
		    	blnFirst = false;
		    }
		    else
		    	_strValidActionBitset = performAnd(_strValidActionBitset, objJsonPossibleActions[key]);
		}
	}
	refreshButtons(authLevel, requestState, module);
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

	if (!requestState) return;
	if (authLevel == '1')
		_strValidActionBitset = arrDepositRightsMap[requestState];
	if (!_strValidActionBitset || module != _module) _strValidActionBitset = "00000000";

	// DO THE ANDING WITH SERVER BITMAP
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

function closeRecords(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	
	frm.target ="";
	frm.action = "closeMultiActionDeposit.form";
	frm.method = "POST";
	frm.submit();
}

function acceptRecords(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;

	frm.target ="";
	frm.action = "acceptMultiActionDeposit.form";
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
		frm.action = "rejectMultiActionDeposit.form";
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
	frm.action = "sendMultiActionDeposit.form";
	frm.method = "POST";
	frm.submit();
}

function deleteRecords(ctrl, rejTitle, rejMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;

	getRemarks(350, rejTitle, rejMsg, document.getElementById("current_index").value, deleteMultiActionRecord);
}

function deleteMultiActionRecord(objJsonData, strRemarks)
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
		frm.action = "deleteMultiActionDeposit.form";
		frm.method = 'POST';
		frm.submit();
	}
}
function acceptInstRecords(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	document.getElementById("current_index").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("current_index").value.indexOf("true") < 0)
	{
		alert("Select Atlease One Record");
		return;
	}
	frm.target ="";
	frm.action = "acceptMultiActionDepositInst.form";
	frm.method = "POST";
	frm.submit();
}

function rejectInstRecords(ctrl, rejTitle, rejMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	document.getElementById("current_index").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("current_index").value.indexOf("true") < 0)
	{
		alert("Select Atlease One Record");
		return;
	}
	getRemarks(350, rejTitle, rejMsg, document.getElementById("current_index").value, rejectInstRecord);
}

function rejectInstRecord(objJsonData, strRemarks)
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
		frm.action = "rejectMultiActionDepositInst.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function sendInstRecords(ctrl)
{
	var frm = document.forms["frmMain"];
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	document.getElementById("current_index").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("current_index").value.indexOf("true") < 0)
	{
		alert("Select Atlease One Record");
		return;
	}
	frm.target ="";
	frm.action = "sendMultiActionDepositInst.form";
	frm.method = "POST";
	frm.submit();
}

function deleteInstRecords(ctrl, rejTitle, rejMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	document.getElementById("current_index").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("current_index").value.indexOf("true") < 0)
	{
		alert("Select Atleast One Record");
		return;
	}
	getRemarks(350, rejTitle, rejMsg, document.getElementById("current_index").value, deleteInstRecord);
}

function deleteInstRecord(objJsonData, strRemarks)
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
		frm.action = "deleteMultiActionDepositInst.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function getSearchInstDtl(strAction)
{
	var frm = document.forms["frmMain"];
	if (strAction == "VIEW")
		frm.action = 'viewDepositHeader.form';
	else	
		frm.action = 'editDepositHeader.form';

	frm.target ="";
	frm.method = "POST";
	frm.submit();
}
function getHoldRecord(ctrl, holdTitle, holdMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	document.getElementById("current_index").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("current_index").value.indexOf("true") < 0)
	{
		alert("Select Atlease One Record");
		return;
	}
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
		frm.action = "holdMultiActionDepositInst.form";
		frm.method = 'POST';
		frm.submit();
	}
}
function getReleaseRecord(ctrl, relTitle, relMsg)
{
	if (ctrl.className.startsWith("imagelink grey"))
		return;
	document.getElementById("current_index").value = JSON.stringify(objJsonIndicesStatus);
	if (document.getElementById("current_index").value.indexOf("true") < 0)
	{
		alert("Select Atlease One Record");
		return;
	}
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
		frm.action = "releaseMultiActionDepositInst.form";
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
		if (txnCurrency != '(ALL)')
		{
			if (document.getElementById("amountCurrency") != null)
				document.getElementById("amountCurrency").innerHTML = txnCurrency;
			if (document.getElementById("balancedAmountCurrency") != null)
				document.getElementById("balancedAmountCurrency").innerHTML = txnCurrency;
		}
	}
	else
	{		
		if (document.getElementById("amountCurrency") != null)
			document.getElementById("amountCurrency").innerHTML = "";
		if (document.getElementById("balancedAmountCurrency") != null)
			document.getElementById("balancedAmountCurrency").innerHTML = "";
	}
	if (mode == 'VIEW')
	{
		if (txnCurrency != '(ALL)')
		{
			if (document.getElementById("amountCurrency") != null)
				document.getElementById("amountCurrency").innerHTML = txnCurrency;
			if (document.getElementById("balancedAmountCurrency") != null)
				document.getElementById("balancedAmountCurrency").innerHTML = txnCurrency;
		}
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