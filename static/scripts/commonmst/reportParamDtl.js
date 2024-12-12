function enableDisableDefValue(objFlag)
{
	var imgHidden=document.getElementById("chkEditableFlag");
	var imgMandatory=document.getElementById("chkValueMandatory");
	if(objFlag=="editableFlag")
	{
		if(imgHidden.src.indexOf("icon_checked.gif") > -1)
		{
			if (imgMandatory.src.indexOf("icon_checked.gif") > -1)
			{
				imgMandatory.src = "static/images/icons/icon_unchecked.gif";	
			}
			$('#defaultValue').val('');
			$('#defValLabel').addClass('required-lbl-right');
			$('#valueMandatory').val('N');
		}
		else
		{
			$('#defValLabel').removeClass('required-lbl-right');
			if($('#dataType').val()=='DATE')
			{
				$('#defaultValue').val('SYS_APPL_DATE');
			}
			else if($('#dataType').val()=='NUMBER' || $('#dataType').val()=='TEXT')
			{
				$('#defaultValue').val('(ALL)');
			}
			else
			{
				$('#defaultValue').val('');
			}			
		}
	}	
	if(objFlag=="valueMandatory")
	{
		$('#defValLabel').removeClass('required-lbl-right');
		if(imgMandatory.src.indexOf("icon_checked.gif") > -1)
		{
			if (imgHidden.src.indexOf("icon_checked.gif") > -1)
			{
				imgHidden.src = "static/images/icons/icon_unchecked.gif";	
			}		
			$('#editableFlag').val('N');
		}
		else
		{
		}
		if($('#dataType').val()=='DATE')
		{
			$('#defaultValue').val('SYS_APPL_DATE');
		}
		else if($('#dataType').val()=='NUMBER' || $('#dataType').val()=='TEXT')
		{
			$('#defaultValue').val('(ALL)');
		}
		else
		{
			$('#defaultValue').val('');
		}			
	}
}

function enableDisableLov()
{
	if('DATE'==$('#dataType').val() || 'DECIMAL'==$('#dataType').val() || 'AS_OF_DATE'==$('#dataType').val() )
	{
		$('#listOfValues').attr('disabled','true');
		$('#listOfValues').val('');
	}
	else
	{
		$('#listOfValues').removeAttr('disabled');
	}
	
	if($('#editableFlag').val()=='N')
	{
		if($('#dataType').val()=='DATE' || $('#dataType').val()=='AS_OF_DATE')
		{
			$('#defaultValue').val('SYS_APPL_DATE');
		}
		else if($('#dataType').val()=='NUMBER' || $('#dataType').val()=='TEXT')
		{
			$('#defaultValue').val('(ALL)');
		}
		else
		{
			$('#defaultValue').val('');
		}	
	}
}

function hideShowDiv(flag, section)
{
	if($('#'+flag).val()=='Y')
	{
		$('#'+section).show();
	}
	else
	{
		$('#'+section).hide();		
	}	
	if('N'==$('#filterFlag').val())
	{
		var imgHidden=document.getElementById("chkEditableFlag");
		var imgMandatory=document.getElementById("chkValueMandatory");	
		if (imgMandatory.src.indexOf("icon_checked.gif") > -1)
		{
			imgMandatory.src = "static/images/icons/icon_unchecked.gif";	
		}	
		if (imgHidden.src.indexOf("icon_checked.gif") > -1)
		{
			imgHidden.src = "static/images/icons/icon_unchecked.gif";	
		}		
		$('#dataType').val('');
		$('#defaultValue').val('');
		$('#defaultValue').attr('disabled','disabled');
		$('#listOfValueType').val('');
		$('#listOfValues').val('');
		$('#editableFlag').val('N');
		$('#valueMandatory').val('N');
	}	
	if('N'==$('#columnFlag').val())
	{
		var imgDefColumn=document.getElementById("chkDefaultColumnFlag");
		var imgSortable=document.getElementById("chkSortable");	
		if (imgSortable.src.indexOf("icon_checked.gif") > -1)
		{
			imgSortable.src = "static/images/icons/icon_unchecked.gif";	
		}	
		if (imgDefColumn.src.indexOf("icon_checked.gif") > -1)
		{
			imgDefColumn.src = "static/images/icons/icon_unchecked.gif";	
		}
		$('#defaultColumnFlag').val('N');
		$('#sortable').val('N');		
	}
}

function enableDisableLovType()
{
	if('DATE'==$('#dataType').val() || 'DECIMAL'==$('#dataType').val() || 'AS_OF_DATE'==$('#dataType').val())
	{
		$('#listOfValueType').val('N');
		$('#listOfValueType').attr('disabled','true');
	}
	else
	{
		$('#listOfValueType').val('');
		$('#listOfValueType').removeAttr('disabled');
	}
}

function showHideFields()
{
	if('N'==$('#selectable').val() && 'N'==$('#sortable').val())
	{
		$('#dataTypeDiv,#defValueDiv,#lovTypeDiv,#lovDiv').show();
	}
	else
	{
		$('#dataTypeDiv,#defValueDiv,#lovTypeDiv,#lovDiv').hide();
	}
}

function setCheckUnchek(flag, field)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/icons/icon_checked.gif');
	}
	else
	{
		$('#'+field).attr('src','static/images/icons/icon_unchecked.gif');		
	}	
}

function setCheckUnchekGrey(flag, field)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/icons/icon_checked_grey.gif');
	}
	else
	{
		$('#'+field).attr('src','static/images/icons/icon_unchecked_grey.gif');		
	}	
}

function toggleCheckUncheck(imgElement,flag) 
{
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
	{
		imgElement.src = "static/images/icons/icon_checked.gif";	
		$('#'+flag).val('Y');
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#'+flag).val('N');
	}
}

function setDirtyBit()
{
	dityBitSet=true;
}

function saveProfile(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	$('#selectedLanguages').val(selectedLanguageList);
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
		gotoPage(strUrl);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if(dityBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				height : 150,
				width : 430,
				modal : true,
				buttons : buttonsOpts
			});
	$('#confirmMsgPopup').dialog("open");
	}
	else
	{
		gotoPage(strUrl);
	}
}

function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	$("input").removeAttr('disabled');
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

jQuery.fn.ForceNoSpecialSymbol = function() {
	return this.each(function() {
				$(this).keydown(function(event) {
					var key = event.charCode || event.keyCode || 0;
					// allow backspace, tab, delete, numbers
					// keypad numbers, letters ONLY
					if (window.event) { // IE
						key = event.keyCode;
					}
					if (event.which) { // Netscape/Firefox/Opera
						key = event.which;
					}
					if (event.shiftKey) {
						if(key==189 || key==53)
							return true
						else	
							return false;
					}
					return (key == 8 || key == 9 || key == 46 
							|| (key >= 37 && key <= 40)
							|| (key >= 48 && key <= 57)
							|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
				})
			})
};

jQuery.fn.ParameterCodeAutoComplete = function() {

	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : 'services/reportParamCodeList.json',
							dataType : "json",
							type : "POST",
							data : {
								$autoFilter : request.term
							},
							success : function(data) {
								if (data.d && data.d.details) {
									var rec = data.d.details;
									response($.map(rec, function(item) {
												return {
													label : item.parameterDesc,
													value : item.parameterCode,
													details : item
												}
											}));
								}
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				if (ui.item) {
					var paramDetails = ui.item.details;
					$(this).val(paramDetails.parameterCode);
					$('#parameterDesc').val(paramDetails.parameterDesc);
					//$('#filterFlag').val(paramDetails.filterFlag);
					$('#dataType').val(paramDetails.dataType);
					//$('#editableFlag').val(paramDetails.editableFlag);
					$('#defaultValue').val(paramDetails.defaultValue);
					$('#listOfValueType').val(paramDetails.listOfValueType);
					$('#listOfValues').val(paramDetails.listOfValues);
					if(('N' == $('#filterFlag').val() && 'Y' == paramDetails.filterFlag) || ('Y' == $('#filterFlag').val() && 'N' == paramDetails.filterFlag))
					{
						$('#chkFilterFlag').click();
						if(('N' == $('#editableFlag').val() && 'Y' == paramDetails.editableFlag) || ('Y' == $('#editableFlag').val() && 'N' == paramDetails.editableFlag))
						{
							$('#chkEditableFlag').click();
						}
					}
					//$('#columnFlag').val(paramDetails.columnFlag);
					if(('N' == $('#columnFlag').val() && 'Y' == paramDetails.columnFlag) || ('Y' == $('#columnFlag').val() && 'N' == paramDetails.columnFlag))
					{
						$('#chkColumnFlag').click();
					}
					//$('#defaultColumnFlag').val(paramDetails.defaultColumnFlag);
					//$('#sortable').val(paramDetails.sortable);
					if(('N' == $('#defaultColumnFlag').val() && 'Y' == paramDetails.defaultColumnFlag) || ('Y' == $('#defaultColumnFlag').val() && 'N' == paramDetails.defaultColumnFlag))
					{
						$('#chkDefaultColumnFlag').click();
					}
					if(('N' == $('#sortable').val() && 'Y' == paramDetails.sortable) || ('Y' == $('#sortable').val() && 'N' == paramDetails.sortable))
					{
						$('#chkSortable').click();
					}
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {			
			var val = item.value;
			var desc = item.label;
			
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;" class="inline">'
					+ val
					+ '</ul><ul style="width:200px;">'
					+ desc + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		}*/
	});

};