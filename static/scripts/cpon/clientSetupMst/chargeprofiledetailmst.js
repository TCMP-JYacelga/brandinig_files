function setDirtyBit()
{
	$('#dirtyBit').val('1');
}

function handleEODPickupEvent()
{
    if ( $('#eventCode').val() == 'EODPICKUP')
    {
        $('#tierDiv').hide();
        $('#minMaxChargeRoundingDiv').hide();
        $('#variableDiv').hide();
    }
}

function submitForm(strUrl)
{
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	removeAutoNumeric();
	frm.action = strUrl;
	frm.method = "POST";
	$('#computationType').removeAttr("disabled");
	$('#interestPeriod').removeAttr("disabled");
	frm.submit();
}

function enableDisableForm(boolVal) {
	$('#chargeUnitDescription').attr('disabled', boolVal);
	$('#chargeUnitGroup').attr('disabled', boolVal);
	$('#slabCcyCode').attr('disabled', boolVal);
	$('#minChargeAmnt').attr('disabled', boolVal);
	$('#maxChargeAmnt').attr('disabled', boolVal);
	$('[id$="comparisonValue"]').removeAttr('disabled');
	$('#computationType').attr('disabled', boolVal);
	$('#interestPeriod').attr('disabled', boolVal);
	$('#baseRateCode').attr('disabled', boolVal);
	$('[id^=slabList]').removeAttr('disabled');
}

function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showHistoryForm(strUrl, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecordList(strUrl)
{
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableRecordList(strUrl)
{
	var frm = document.forms["frmMain"]; 
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(me,strUrl)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}	
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function getRejectRecord(me, rejTitle, rejMsg,strUrl)
{
    var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, strUrl, rejectRecord);
}

function rejectRecord(arrData, strRemarks,strUrl)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255)
	{
		alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.target = "";
		frm.action = arrData;
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteList(me,strUrl)
{
    var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record");
		return;
	} 
	deleteRecord(document.getElementById("updateIndex").value,strUrl);
}

function deleteRecord(arrData,strUrl)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = arrData;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}


// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function convertOnlyAlphabetToUpperCase(strObj)
{
	var strToConvert = $(strObj).val();
	var strLengh;
	var finalString='';
	if(null!=strToConvert)
	{
		strLengh = strToConvert.length;
		for ( var i=0; i < strLengh; i++)
		{
				var singleChar  = strToConvert.charAt(i);
                if (/^[a-zA-Z()]+$/.test(singleChar))
				{
					singleChar = singleChar.toUpperCase();	
				}
				finalString=finalString.concat(singleChar);
		}
	}
	$(strObj).val(finalString);
}

function selectRecord(ctrl, status, index, maker)
{
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if (index.length < 2)
	{
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
	if (aPosition >= 0)
	{
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 2),"");
		mapPosition = strActionMap.indexOf(index+":");
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 7),"");
	}
	else
	{
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		strCurrentAction = arrActionMap[status];
		document.getElementById("actionmap").value = index+":"+ strCurrentAction +","+document.getElementById("actionmap").value ;
	}
	if (ctrl.className.indexOf("acceptlink") > -1)
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	// perform the operation of bitwise anding
	lenDelimAction = document.getElementById("actionmap").value.length;
	if (lenDelimAction > 1)
	{
		strDelimAction = document.getElementById("actionmap").value;
		strDelimAction = strDelimAction.substring(0, lenDelimAction-1);		
		strArrSplitAction = strDelimAction.split(",");		
		for (var i=0;i<strArrSplitAction.length;i++)
		{
			strArrSplitAction[i] = strArrSplitAction[i].substring(strArrSplitAction[i].indexOf(":")+1);
		}
		
		if (strArrSplitAction.length==1)
		{
			strFinalBitmap = strArrSplitAction[0];
		}
		else
		{
				lenLooplen =strArrSplitAction.length-1;
				for (var j=0; j<lenLooplen ; j++)
				{
					if (j==0)
					{
						strFinalBitmap = performAnd(strArrSplitAction[j],strArrSplitAction[j+1]);						
					}
					else
					{
						strFinalBitmap = performAnd(strFinalBitmap,strArrSplitAction[j+1]);
					}
				}
		}		
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(maker);
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(maker);
	}	
}

function performAnd(validAction,currentAction)
{
	var strOut = "";
	var i = 0;
	if (validAction.length = currentAction.length)
	{
		for (i=0; i<5; i++)
		{
			strOut = strOut +((validAction.charAt(i)*1) && (currentAction.charAt(i)*1));
		}
	}
	return strOut;
}

function refreshButtons(maker)
{
	var strPopultedButtons=document.getElementById("bitmapval").value;
	var strActionButtons;	
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd(strPopultedButtons,_strServerBitmap);	
	//alert('the final bitmap::' + strActionButtons);
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<5; i++)
		{
				switch (i)
				{
					case 0: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					}
					else
					{
						document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					}
					break;					
					
					case 1: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
					}
					else
					{
						document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					}
					break;
					
					case 2: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnEnable").className ="imagelink black inline_block button-icon icon-button-enable font_bold";
					}
					else
					{
						document.getElementById("btnEnable").className ="imagelink grey inline_block button-icon icon-button-enable-grey font-bold";
					}
					break;
					
					case 3: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnDisable").className ="imagelink black inline_block button-icon icon-button-disable font_bold";
					}
					else
					{
						document.getElementById("btnDisable").className ="imagelink grey inline_block button-icon icon-button-disable-grey font-bold";
					}
					break;
						
					case 4: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
					}
					else
					{
						document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					}
					break;
				}
		}
	}	
}

// Details
function addDetail(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function editUnit(strUrl,unitCode)
{
	document.getElementById('selectedUnit').value=unitCode;
	removeAutoNumeric();
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function viewUnit(strUrl,unitCode)
{
	document.getElementById('selectedUnit').value=unitCode;
	removeAutoNumeric();
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function deleteUnit(strUrl,unitCode)
{
	document.getElementById('selectedUnit').value=unitCode;
	removeAutoNumeric();
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function deleteRule(strUrl,ruleRecordKeyNmbr)
{
	document.getElementById('selectedUnit').value=ruleRecordKeyNmbr;
	removeAutoNumeric();
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function deleteSlab(strUrl,index)
{
	if(index == 'ALL')
		document.getElementById('selectedUnit').value = index;
	else
		document.getElementById('selectedUnit').value=document.getElementById('slabList['+index+'].recordKeyNo').value;
	
	removeAutoNumeric();
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function removeAutoNumeric()
{
	var minChargeAmnt = document.getElementById("minChargeAmnt");
	var maxChargeAmnt = document.getElementById("maxChargeAmnt");
	var roundingValueAmnt = document.getElementById("roundingValueAmnt");
	var fixedAmnt = document.getElementById("fixedAmnt");
	var variableRate = document.getElementById("variableRate");
	var blnAutoNumeric = true;
	// jquery autoNumeric formatting
	blnAutoNumeric = isAutoNumericApplied("minChargeAmnt");
	if (blnAutoNumeric)
		minChargeAmnt.value = $("#minChargeAmnt").autoNumeric('get');
	else
		minChargeAmnt.value = $("#minChargeAmnt").val();
		
	blnAutoNumeric = isAutoNumericApplied("maxChargeAmnt");
	if (blnAutoNumeric)
		maxChargeAmnt.value = $("#maxChargeAmnt").autoNumeric('get');
	else
		maxChargeAmnt.value = $("#maxChargeAmnt").val();
	
	blnAutoNumeric = isAutoNumericApplied("roundingValueAmnt");
	if (blnAutoNumeric)
		roundingValueAmnt.value = $("#roundingValueAmnt").autoNumeric('get');
	else
		roundingValueAmnt.value = $("#roundingValueAmnt").val();
		
	blnAutoNumeric = isAutoNumericApplied("fixedAmnt");
	if (blnAutoNumeric)
		fixedAmnt.value = $("#fixedAmnt").autoNumeric('get');
	else
		fixedAmnt.value = $("#fixedAmnt").val();
	
	blnAutoNumeric = isAutoNumericApplied("variableRate");
	if (blnAutoNumeric)
		variableRate.value = $("#variableRate").autoNumeric('get');
	else
		variableRate.value = $("#variableRate").val();
	// jquery autoNumeric formatting
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}

jQuery.fn.commissionAccountSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
					var strUrl = "services/userseek/commissionAccountList.json?";
					if(!isEmpty($('#commAcctNmbrDesc').val()))
					{
						strUrl = strUrl+"&qfilter="+$('#commAcctNmbrDesc').val();
					}
					$.ajax({
								url : strUrl,
								type: "POST",
								dataType : "json",
								data : {
									$autofilter : request.term
								},
								success : function(data) {
									var rec = data.d.preferences;
									response($.map(rec, function(item) {
												return {
													label : item.COMMACCTNMBR + " [" + item.COMMACCTCCYCODE+ " " + item.COMMACCTBRANCHCODE + "]", 
													bankDtl : item
												}
											}));
								}
							});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (!isEmpty(data) && !isEmpty(data.COMMACCTNMBR))
						{
							var accNo = data.COMMACCTNMBR;
							var accCcy = data.COMMACCTCCYCODE;
							var accBranch = data.COMMACCTBRANCHCODE;
							var accProductCode = data.PRODUCTCODE;
							var accIntId = data.COMMACCTINTERNALID;
							$('#commAcctNmbr').val(accNo);
							$('#commAcctCcyCode').val(accCcy);
							$('#commAcctbranchCode').val(accBranch);
							$('#productCode').val(accProductCode);
							$('#commAcctInternalID').val(accIntId);
						}
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

