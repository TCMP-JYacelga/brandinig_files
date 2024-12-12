function toggleCheckUncheck(imgElement, flag) {

	if (imgElement.src.indexOf("icon_unchecked_grey.gif") == -1) {

		if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
			imgElement.src = "static/images/icons/icon_checked.gif";
			$('#' + flag).val('Y');
		} else {
			imgElement.src = "static/images/icons/icon_unchecked.gif";
			$('#' + flag).val('N');
		}
	}
}



function toggleCheckUncheckAllowConfidential(imgElement,imgElement_confidential, flag) {
var ele=document.getElementById(imgElement_confidential);
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
		imgElement.src = "static/images/icons/icon_checked.gif";
		ele.src="static/images/icons/icon_unchecked.gif";
		$('#' + flag).val('Y');
	} else {
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		ele.src="static/images/icons/icon_unchecked_grey.gif";
		$('#' + flag).val('N');
		$('#' + confidentialMandatoryFlag).val('N');
	}
}

function onLoadToggleCheckUncheckAllowConfidential(imgElement,imgElement_confidential, flag) 
{ 
        var ele=document.getElementById(imgElement_confidential); 
        if( imgElement.src.indexOf("icon_unchecked.gif") > -1) 
        { 
                ele.src="static/images/icons/icon_unchecked_grey.gif"; 
                $('#' + flag).val('N'); 
        } 
        else 
        { 
                if( ele.src.indexOf("icon_checked.gif") > -1) 
                        ele.src="static/images/icons/icon_checked.gif"; 
                else 
                        ele.src="static/images/icons/icon_unchecked.gif"; 
                
                $('#' + flag).val('Y'); 
                $('#' + confidentialMandatoryFlag).val('N');
        } 
}  

function setProductCatCode(prdCatCode)
{
	productCatCode = prdCatCode;
}

function getCustomLayouts()
{
	if($('#paymentType').val() != ''){
    $.ajax({
        url: "services/customlayouts/"+ $('#paymentType').val() + ".json",
        type: "POST",
        async: false,
        data: {$data: null},
		complete: function(XMLHttpRequest, textStatus) {
			$.unblockUI();
			if ("error" == textStatus)
				alert("Unable to complete your request!");
		},
        success: function( data ) {
    		$("#customLayoutId").find('option').remove();
        	if(data && data.length > 0){
        		if(modeVal!='VIEW' && modeVal!='VERIFY')
        			{
            	$.each(data, function(data, item) {
            		$("#customLayoutId").append("<option value='"+ this.name+ "'>"+ this.value +"</option>");
                });	 
        			}
        		else
        			{
        			$.each(data, function(data, item) {
        				if(customLayoutId === this.name)
                		$("#customeProfileId").text(this.value);
                    });	 
        			}
        	}
        	else
        	{
        		$("#customLayoutId").append("<option value='MIXEDLAYOUT'>Mixed Layout</option>");
        	}
        } 
    });
	}
	
}

function setDefaultCrossCurrency(){
	if($('#paymentType').val() != ''){
		var valProductCat = $('#paymentType').val();
		document.getElementById('chkCrossCurrencyFlag');
		var imgElement = document.getElementById('chkCrossCurrencyFlag');
		var flag = $('#crossCurrencyFlag');
		if(imgElement != null && imgElement != 'undefined')
		{
			if(valProductCat === 'INTPAY'){
					if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
						imgElement.src = "static/images/icons/icon_checked.gif";
						flag.val('Y');
					} 
			}
			else {
				imgElement.src = "static/images/icons/icon_unchecked.gif";
				flag.val('N');
			}
		}
		
	}
}

function setRecurrPayFlag(){
	if($('#paymentType').val() != ''){
		var valPrdCat = $('#paymentType').val();
		if(valPrdCat == 'DD' || valPrdCat == 'CK' || valPrdCat == 'PO' || valPrdCat == 'CASH'){
			$('#chkUseForSI').hide();
			$('#lblRecuPay').hide();
		}else{
			$('#chkUseForSI').show();
			$('#lblRecuPay').show();
		}
	}
}

function viewChanges(strUrl,viewMode)
{
	var frm = document.forms["frmMain"];
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			'VIEW_MODE', viewMode));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}


function createFormField(element, type, name, value) 
{
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function toggleCheckUncheckPkgType(imgElement, flag) {
	var singleChk = document.getElementById('pkgTypeQ');
	var multiChk = document.getElementById('pkgTypeB');
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
		imgElement.src = "static/images/icons/icon_checked.gif";
	} else {
		imgElement.src = "static/images/icons/icon_unchecked.gif";
	}

	if (singleChk.src.indexOf("icon_checked.gif") > -1
			&& multiChk.src.indexOf("icon_checked.gif") > -1)
	{
		$('#' + flag).val('M');
	} 
	else if (singleChk.src.indexOf("icon_checked.gif") > -1) 
	{
		$('#' + flag).val('Q');
	} 
	else if (multiChk.src.indexOf("icon_checked.gif") > -1)
	{
		$('#' + flag).val('B');
	}
	else
		$('#' + flag).val('N');
}

function toggleCheckUncheckAndEnable(imgElement, flagId, selectId) {
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
		imgElement.src = "static/images/icons/icon_checked.gif";
		$('#' + flagId).val('Y');
		$('#' + selectId).attr('disabled', false);
	} else {
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#' + flagId).val('N');
		$('#' + selectId).attr('disabled', true);
	}
}

function setEnableDisable(imgElement, flagId, selectId) {
	var value = $('#' + flagId).val();
	if (value == 'N') {
		$('#' + selectId).attr('disabled', true);
	} else {
		$('#' + selectId).attr('disabled', false);
	}
}

function setCheckUnchek(flag, field) {
	if (flag == 'Y') {
		$('#' + field).attr('src', 'static/images/icons/icon_checked.gif');
	} else {
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked.gif');
	}
}

function setCheckUnchekIban(flag, field, sysparam) {
	if (sysparam == 'Y') {
		if (flag == 'Y') {
			$('#' + field).attr('src', 'static/images/icons/icon_checked.gif');
		}else {
				$('#' + field).attr('src', 'static/images/icons/icon_unchecked.gif');			
		}
	} else {
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		$('#' + field).attr('disabled','disabled');
	}
}

function setGreyCheckUnchekIban(flag, field, sysparam){	
	if (sysparam == 'Y') {
		if (flag == 'Y') {
			$('#' + field).attr('src', 'static/images/icons/icon_checked_grey.gif');
		} 
		else {	
				$('#' + field).attr('src', 'static/images/icons/icon_unchecked_grey.gif');
	}
	} else {
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		$('#' + field).attr('disabled','disabled');
	}
}


function setCheckUnchek_confidential(flag, field , allowfield) {
	var ele=document.getElementById(allowfield);
	if(ele.src.indexOf("icon_checked.gif") >-1)
		{
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked.gif');
	if (flag == 'Y') {
		$('#' + field).attr('src', 'static/images/icons/icon_checked.gif');
	} else {
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked.gif');
	}
		}
		else if(ele.src.indexOf("icon_checked_grey.gif") >-1)
		{
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked_grey.gif');
	if (flag == 'Y') {
		$('#' + field).attr('src', 'static/images/icons/icon_checked_grey.gif');
	} else {
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked_grey.gif');
	}
		}
}

function setGreyCheckUnchek(flag, field) {
	if (flag == 'Y') {
		$('#' + field).attr('src', 'static/images/icons/icon_checked_grey.gif');
	} else {
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked_grey.gif');
	}
}

function setCheckUnchekPkgType(flag, fieldSingle, fieldMulti) {
	if (flag == 'M') {
		$('#' + fieldSingle)
				.attr('src', 'static/images/icons/icon_checked.gif');
		$('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked.gif');
	} else if (flag == 'Q') {
		$('#' + fieldSingle)
				.attr('src', 'static/images/icons/icon_checked.gif');
	} else if (flag == 'B') {
		$('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked.gif');
	} else {
		$('#' + fieldSingle).attr('src',
				'static/images/icons/icon_unchecked.gif');
		$('#' + fieldMulti).attr('src',
				'static/images/icons/icon_unchecked.gif');
	}
}

function setGreyCheckUnchekPkgType(flag, fieldSingle, fieldMulti) {
	if (flag == 'M') {
		$('#' + fieldSingle)
				.attr('src', 'static/images/icons/icon_checked_grey.gif');
		$('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked_grey.gif');
	} else if (flag == 'Q') {
		$('#' + fieldSingle)
				.attr('src', 'static/images/icons/icon_checked_grey.gif');
	} else if (flag == 'B') {
		$('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked_grey.gif');
	} else {
		$('#' + fieldSingle).attr('src',
				'static/images/icons/icon_unchecked_grey.gif');
		$('#' + fieldMulti).attr('src',
				'static/images/icons/icon_unchecked_grey.gif');
	}
}

function getCancelConfirmPopUp(strUrl) {
	if (dityBitSet) {
		var buttonsOpts = {};
		buttonsOpts[btnsArray['okBtn']] = function() {
			$('#confirmMsgPopup').dialog("close");
			gotoPage(strUrl);
		};
		buttonsOpts[btnsArray['cancelBtn']] = function() {
			$('#confirmMsgPopup').dialog("close");
		};
		$('#confirmMsgPopup').dialog({
				autoOpen : false,
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				height : 150,
				modal : true,
				resizable: false,
				draggable: false,
				buttons : buttonsOpts
			});
		$('#confirmMsgPopup').dialog("open");
		$('#cancelConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			goToPage(strUrl);
		});
		$('#textContent').focus();
	} else {
		goToPage(strUrl);
	}
}

function goToPage(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function cancelPaymentProduct(strUrl)
{
	var frm = document.forms["frmMain"];
	$('#viewState').val($('#hdrViewState').val());
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function submitPmtPkgProfile(strUrl) {
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	var flagMixed = false;
	$('#sellerId').removeAttr('disabled');
	$('#sysBeneType').prop('disabled', false);
	if($('#paymentType').is(":disabled")){
		flag = true;
		$('#paymentType').removeAttr('disabled');
		$('#customLayoutId').removeAttr('disabled');
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	if(flagMixed){
		$('#paymentType').attr('disabled', 'disabled');
		$('#customLayoutId').attr('disabled', 'disabled');
	}
}

function enableDisableForm(boolVal) {
	$('#Std').attr('disabled', boolVal);
	$('#custom').attr('disabled', boolVal);
	$('#packageName').attr('disabled', boolVal);
	$('#packageId').attr('disabled', boolVal);
}

function showList(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showAddNewForm(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showHistoryForm(strUrl, index) {
	var intTop = (screen.availHeight - 300) / 2;
	var intLeft = (screen.availWidth - 400) / 2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecordList(strUrl) {
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "") {
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableRecordList(strUrl) {
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "") {
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(me, strUrl) {
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "") {
		alert("Select Atlease One Record")
		return;
	}
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function getRejectRecord(me, rejTitle, rejMsg, strUrl) {
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "") {
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, strUrl, rejectRecord);
}

function rejectRecord(arrData, strRemarks, strUrl) {
	var frm = document.forms["frmMain"];

	if (strRemarks.length > 255) {
		alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");
		return false;
	} else {
		frm.rejectRemarks.value = strRemarks;
		frm.target = "";
		frm.action = arrData;
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteList(me, strUrl) {
	var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "") {
		alert("Select Atlease One Record");
		return;
	}
	deleteRecord(document.getElementById("updateIndex").value, strUrl);
}

function deleteRecord(arrData, strUrl) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = arrData;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

// List navigation
function prevPage(strUrl, intPg) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg) {
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function selectRecord(ctrl, status, index, maker) {
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if (index.length < 2) {
		index = '0' + index;
	}
	var aPosition = strAuthIndex.indexOf(index);
	var mapPosition;
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap = document.getElementById("bitmapval").value;
	var lenLooplen;
	if (aPosition >= 0) {
		document.getElementById("updateIndex").value = strAuthIndex.replace(
				strAuthIndex.substring(aPosition, aPosition + 2), "");
		mapPosition = strActionMap.indexOf(index + ":");
		document.getElementById("actionmap").value = strActionMap.replace(
				strActionMap.substring(mapPosition, mapPosition + 7), "");
	} else {
		document.getElementById("updateIndex").value = index + ","
				+ document.getElementById("updateIndex").value;
		strCurrentAction = arrActionMap[status];
		document.getElementById("actionmap").value = index + ":"
				+ strCurrentAction + ","
				+ document.getElementById("actionmap").value;
	}
	if (ctrl.className.indexOf("acceptlink") > -1) {
		ctrl.className = "linkbox acceptedlink";
	} else {
		ctrl.className = "linkbox acceptlink";
	}
	// perform the operation of bitwise anding
	lenDelimAction = document.getElementById("actionmap").value.length;
	if (lenDelimAction > 1) {
		strDelimAction = document.getElementById("actionmap").value;
		strDelimAction = strDelimAction.substring(0, lenDelimAction - 1);
		strArrSplitAction = strDelimAction.split(",");
		for (var i = 0; i < strArrSplitAction.length; i++) {
			strArrSplitAction[i] = strArrSplitAction[i]
					.substring(strArrSplitAction[i].indexOf(":") + 1);
		}

		if (strArrSplitAction.length == 1) {
			strFinalBitmap = strArrSplitAction[0];
		} else {
			lenLooplen = strArrSplitAction.length - 1;
			for (var j = 0; j < lenLooplen; j++) {
				if (j == 0) {
					strFinalBitmap = performAnd(strArrSplitAction[j],
							strArrSplitAction[j + 1]);
				} else {
					strFinalBitmap = performAnd(strFinalBitmap,
							strArrSplitAction[j + 1]);
				}
			}
		}
		document.getElementById("bitmapval").value = strFinalBitmap;
		refreshButtons(maker);
	} else {
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value = strFinalBitmap;
		refreshButtons(maker);
	}
}

function performAnd(validAction, currentAction) {
	var strOut = "";
	var i = 0;
	if (validAction.length = currentAction.length) {
		for (i = 0; i < 5; i++) {
			strOut = strOut
					+ ((validAction.charAt(i) * 1) && (currentAction.charAt(i) * 1));
		}
	}
	return strOut;
}

function refreshButtons(maker) {
	var strPopultedButtons = document.getElementById("bitmapval").value;
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd(strPopultedButtons, _strServerBitmap);
	// alert('the final bitmap::' + strActionButtons);
	var i = 0;
	if (strActionButtons.length > 0) {
		for (i = 0; i < 5; i++) {
			switch (i) {
				case 0 :
					if (strActionButtons.charAt(i) * 1 == 1
							&& maker != _strUserCode) {
						document.getElementById("btnAuth").className = "imagelink black inline_block button-icon icon-button-accept font_bold";
					} else {
						document.getElementById("btnAuth").className = "imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					}
					break;

				case 1 :
					if (strActionButtons.charAt(i) * 1 == 1
							&& maker != _strUserCode) {
						document.getElementById("btnReject").className = "imagelink black inline_block button-icon icon-button-reject font_bold";
					} else {
						document.getElementById("btnReject").className = "imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					}
					break;

				case 2 :
					if (strActionButtons.charAt(i) * 1 == 1) {
						document.getElementById("btnEnable").className = "imagelink black inline_block button-icon icon-button-enable font_bold";
					} else {
						document.getElementById("btnEnable").className = "imagelink grey inline_block button-icon icon-button-enable-grey font-bold";
					}
					break;

				case 3 :
					if (strActionButtons.charAt(i) * 1 == 1) {
						document.getElementById("btnDisable").className = "imagelink black inline_block button-icon icon-button-disable font_bold";
					} else {
						document.getElementById("btnDisable").className = "imagelink grey inline_block button-icon icon-button-disable-grey font-bold";
					}
					break;

				case 4 :
					if (strActionButtons.charAt(i) * 1 == 1) {
						document.getElementById("btnDiscard").className = "imagelink black inline_block button-icon icon-button-discard font_bold";
					} else {
						document.getElementById("btnDiscard").className = "imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					}
					break;
			}
		}
	}
}

// Details
function addDetail(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function deleteDetail(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function setTemplateTypes(isApproved) {
	var strProductCategory = $('#paymentType').val();
	var objCategory = objCategories[strProductCategory];
	if(objCategory) {
	var blnIsRepetitiveApplicable = objCategory['isRepetitive'];
	var blnIsSemiRepetitiveApplicable = objCategory['isSemiRepetitive'];
	var blnIsNonRepetitiveApplicable = objCategory['isNonRepetitive'];

	disableTemplateType('chkRepTemplate', 'repTemplate', strModelRepTemplate,
			blnIsRepetitiveApplicable, isApproved);
	disableTemplateType('chkSemiRepTemplate', 'semiRepTemplate',
			strModelSemiRepTemplate, blnIsSemiRepetitiveApplicable, isApproved);
	disableTemplateType('chkNonRepTemplate', 'nonRepTemplate',
			strModelNonRepTemplate, blnIsNonRepetitiveApplicable, isApproved);
	}
}
function disableTemplateType(strImageElementId, strPathId, strModelValue,
		isApplicable, isApproved) {
	var objImageElement = $('#' + strImageElementId);
	var isEditable = strModelValue === "Y" ? false : true;
	if (isApplicable) {
		if ("Y" === $('#' + strPathId).val()) {
			if (!isApproved) {
				$(objImageElement)[0].src = "static/images/icons/icon_checked.gif";
				$(objImageElement).attr('onclick', '').unbind('click');
				$(objImageElement).bind('click', function() {
							toggleCheckUncheck(this, strPathId);
							validateAllowTxnAdd();
							setDirtyBit();
						});
			} else {
				$(objImageElement)[0].src = "static/images/icons/icon_checked_grey.gif";
				$(objImageElement).attr('onclick', '').unbind('click');
			}
			$('#' + strPathId).val('Y');

		} else {
			if (isEditable) {
				$(objImageElement)[0].src = "static/images/icons/icon_unchecked.gif";
				$(objImageElement).attr('onclick', '').unbind('click');
				$(objImageElement).bind('click', function() {
							toggleCheckUncheck(this, strPathId);
							validateAllowTxnAdd();
							setDirtyBit();
						});
			} else {
				$(objImageElement)[0].src = "static/images/icons/icon_checked_grey.gif";
				$(objImageElement).attr('onclick', '').unbind('click');
			}
			$('#' + strPathId).val('N');
		}
	} else {
		if (strModelValue === "Y") {
			$(objImageElement)[0].src = "static/images/icons/icon_checked_grey.gif";
			$('#' + strPathId).val('Y');
		} else {
			$(objImageElement)[0].src = "static/images/icons/icon_unchecked_grey.gif";
			$('#' + strPathId).val('N');
		}
		$(objImageElement).attr('onclick', '').unbind('click');
	}
}

function validateAllowTxnAdd(strAllowTxnAdd, strRepTemplate, strSemiRepTemplate, strNonRepTemplate){
	return;
	if(!strAllowTxnAdd) strAllowTxnAdd = $('#allowTxnAdd').val();
	if(!strRepTemplate) strRepTemplate = $('#repTemplate').val();
	if(!strSemiRepTemplate) strSemiRepTemplate = $('#semiRepTemplate').val();
	if(!strNonRepTemplate) strNonRepTemplate = $('#nonRepTemplate').val();
	if(strRepTemplate === 'Y' || strSemiRepTemplate === 'Y' || strNonRepTemplate === 'Y'){
		if(document.getElementById('chkAllowTxnAdd').src.indexOf("unchecked_grey.gif") != -1)
		{
			$('#allowTxnAdd').val('Y');
			setCheckUnchek('Y','chkAllowTxnAdd');
			$('#chkAllowTxnAdd').click(function (){
				toggleCheckUncheck(document.getElementById('chkAllowTxnAdd'),'allowTxnAdd');
			});
		}
	}
	else{
		setGreyCheckUnchek('N','chkAllowTxnAdd');
		$('#chkAllowTxnAdd').unbind('click');
		$('#chkAllowTxnAdd').removeAttr('onclick');
		$('#allowTxnAdd').val('N');
	}
}

function handleDebitLevel(element){
	var _debitLevel;
	var layoutId;
	if(element.length == 1)
		_debitLevel = element[0].value;
	else
		_debitLevel = element.value;
		
	layoutId = $('#customLayoutId').val();
	if( !isEmpty(_debitLevel) && _debitLevel=="B")
	{
		$('#chkFxRateLevel').attr('disabled', 'disabled');
		$('#chkFxRateLevel').attr('src','static/images/icons/icon_unchecked_grey.gif');
		$('#chkFxRateLevel').removeAttr("onclick");
		
			$('#productLevel').val("I");
			$('#debitAccountLevel').val("I");
			$('#valueDateLevel').val("I");
			$('#fxRateLevel').val("I");
			$('#chkProductLevel').attr('src','static/images/icons/icon_unchecked.gif');
	
			$('#chkProductLevel').removeAttr('disabled');
			$('#chkProductLevel').attr("onclick","toggleCheckUncheckBatchLevels(this,'productLevel');setDirtyBit()");
			
			$('#chkDebitAccountLevel').attr('src','static/images/icons/icon_unchecked.gif');
				
			$('#chkDebitAccountLevel').removeAttr('disabled');
			$('#chkDebitAccountLevel').attr("onclick","toggleCheckUncheckBatchLevels(this,'debitAccountLevel');setDirtyBit()");
			$('#chkValueDateLevel').attr('src','static/images/icons/icon_unchecked.gif');
			$('#chkValueDateLevel').removeAttr('disabled');
			$('#chkValueDateLevel').attr("onclick","toggleCheckUncheckBatchLevels(this,'valueDateLevel');setDirtyBit()");
	}
	else 
	{
		$('#chkFxRateLevel').attr('disabled', 'disabled');
		$('#chkFxRateLevel').attr('src','static/images/icons/icon_unchecked_grey.gif');
		$('#chkFxRateLevel').removeAttr("onclick");
		$('#productLevel').val("I");
		$('#debitAccountLevel').val("I");
		$('#valueDateLevel').val("I");
		$('#fxRateLevel').val("I");
		
		$('#chkProductLevel').attr('src','static/images/icons/icon_unchecked.gif');
	
		$('#chkProductLevel').removeAttr('disabled');
		$('#chkProductLevel').attr("onclick","toggleCheckUncheckBatchLevels(this,'productLevel');setDirtyBit()");
		
		$('#chkDebitAccountLevel').attr('src','static/images/icons/icon_unchecked.gif');
			
		$('#chkDebitAccountLevel').removeAttr('disabled');
		$('#chkDebitAccountLevel').attr("onclick","toggleCheckUncheckBatchLevels(this,'debitAccountLevel');setDirtyBit()");
		$('#chkValueDateLevel').attr('src','static/images/icons/icon_unchecked.gif');
		$('#chkValueDateLevel').removeAttr('disabled');
		$('#chkValueDateLevel').attr("onclick","toggleCheckUncheckBatchLevels(this,'valueDateLevel');setDirtyBit()");
	}
}

function toggleCheckUncheckBatchLevels(imgElement,flag){
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
	{
		imgElement.src = "static/images/icons/icon_checked.gif";
		$('#'+flag).val('B');
		if( !isEmpty($('#customLayoutId').val()) && ($('#customLayoutId').val() === 'MIXEDLAYOUT' || $('#customLayoutId').val() === 'CHECKSLAYOUT') && ($('#productLevel').val() === 'B' || $('#debitAccountLevel').val() === 'B' || $('#valueDateLevel').val() === 'B' )){
			$('#fxRateLevel').val('I');
			$('#chkFxRateLevel').removeAttr('onclick');
			$('#chkFxRateLevel').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		}
		else if($('#productLevel').val() === 'B' && $('#debitAccountLevel').val() === 'B' && $('#valueDateLevel').val() === 'B' ){
			$('#chkFxRateLevel').attr("onclick","toggleCheckUncheckFxLevels(this,'chkFxRateLevel');setDirtyBit()");
			$('#chkFxRateLevel').attr('src', 'static/images/icons/icon_checked.gif');
			$('#fxRateLevel').val('B');
		}
		else{
			$('#fxRateLevel').val('I');
			$('#chkFxRateLevel').removeAttr('onclick');
			$('#chkFxRateLevel').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		}
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#'+flag).val('I');
		if(flag != 'fxRateLevel'){
			$('#fxRateLevel').val('I');
			$('#chkFxRateLevel').removeAttr('onclick');
			$('#chkFxRateLevel').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		}
		
	}
}

function toggleGrayCheckUncheckLevels(imgElement, fieldId, flag, isGray)
{
	$('#'+fieldId).val(flag);
	
	if (flag === 'B')
	{
		if(isGray === true) {
			$(imgElement).attr('src','static/images/icons/icon_checked_grey.gif');
			$(imgElement).removeAttr('onclick');
		}
		else {
			$(imgElement).attr('src','static/images/icons/icon_checked.gif');
			
			if(fieldId != 'fxRateLevel')
				$(imgElement).attr("onclick","toggleCheckUncheckBatchLevels(this, '"+fieldId+"');setDirtyBit()");
			else
				$(imgElement).attr("onclick","toggleCheckUncheckFxLevels(this, '"+fieldId+"');setDirtyBit()");
		}
	}
	else
	{
		if(isGray === true) {
			$(imgElement).attr('src','static/images/icons/icon_unchecked_grey.gif');
			$(imgElement).removeAttr('onclick');
		}
		else {
			$(imgElement).attr('src','static/images/icons/icon_unchecked.gif');
			
			if(fieldId != 'fxRateLevel')
				$(imgElement).attr("onclick","toggleCheckUncheckBatchLevels(this, '"+fieldId+"');setDirtyBit()");
			else
				$(imgElement).attr("onclick","toggleCheckUncheckFxLevels(this, '"+fieldId+"');setDirtyBit()");
		}
	}
	
}
	
function setCheckUnchekBatchHeaders(debitLevel,strProduct,strDebitAcc, strValueDate, strFxRate, validFlag)
{
		var isGray = false;
		var isMixedOrChecksLayout = (!isEmpty($('#customLayoutId').val()) && ($('#customLayoutId').val() === 'MIXEDLAYOUT' || $('#customLayoutId').val() === 'CHECKSLAYOUT')) ? true : false;
		var isBatchFields = (strProduct === 'B' && strDebitAcc === 'B' && strValueDate === 'B') ? true: false ;
		if(validFlag === 'Y')
		{
			isGray = true;
			toggleGrayCheckUncheckLevels('#chkFxRateLevel','fxRateLevel',strFxRate,true);
		}
		if(validFlag === 'N')
		{
			if(debitLevel === 'B')
			{
				toggleGrayCheckUncheckLevels('#chkFxRateLevel','fxRateLevel',isMixedOrChecksLayout ? 'I' : 'B',true);
				isGray = !(isMixedOrChecksLayout);
			}			
			
			if(debitLevel === 'I' || debitLevel === 'P')
			{				
				isGray = false;
				toggleGrayCheckUncheckLevels('#chkFxRateLevel','fxRateLevel',strFxRate,isBatchFields ? false : true);
			}				
		}
		
			
		toggleGrayCheckUncheckLevels('#chkProductLevel','productLevel',strProduct,isGray);
		toggleGrayCheckUncheckLevels('#chkDebitAccountLevel','debitAccountLevel',strDebitAcc,isGray);
		toggleGrayCheckUncheckLevels('#chkValueDateLevel','valueDateLevel',strValueDate,isGray);
		
		
}	
