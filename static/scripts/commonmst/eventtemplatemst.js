function getCancelConfirmPopUp(strUrl) {
	if (dityBitSet) {
		/*var buttonsOpts = {};
		buttonsOpts[btnsArray['okBtn']] = function() {
			$('#confirmMsgPopup').dialog("close");
			gotoPage(strUrl);
		};
		buttonsOpts[btnsArray['cancelBtn']] = function() {
			$('#confirmMsgPopup').dialog("close");
		};*/
		$('#confirmMsgPopup').dialog({
				autoOpen : false,
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				modal : true,
				resizable: false,
				draggable: false
			});
		$('#confirmMsgPopup').dialog("open");
		$('#cancelBackConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#confirmMsgPopup').dialog("open");
		
		$('#doneBackConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			gotoPage(strUrl);
		});
	} else {
		gotoPage(strUrl);
	}
}
jQuery.fn.eventNameAutoComplete= function(minLength) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/eventTemplateEventNameSeek.json?$eventModule="+$('#eventModule').val()+"&$eventGroup="+$('#eventGroup').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data;
										if( rec.length == 0 ) {
											$('#eventDesc').val('');
											results = [{
														label : '',
														code : 'No Match Found'}
														];
											response(results);
										}
										else {
										response($.map(rec, function(item) {
													return {														
														label : item.name,														
														bankDtl : item
													}
												}
										
										));												
									}
								}
						});
					},
					minLength : minLength,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.value))
							{
								$('#eventName').val(data.value);
								$('#eventSource').val(data.featureType);
							}
							enableDelMed();
							enableEventAttr();
							callDeliveryMediumService('getDeliveryMediumList.json', 'eventName', 'eventSource');
							callEventAttributeService('getEventAttributeList.json', 'eventName', 'eventSource');
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
			
			var inner_html;
			if( item.code == 'No Match Found' ) {
				inner_html = '<a><ol class="xn-autocompleter"><ul">'+ item.code + ' '+'</ul"><ul">' + item.label
				+ '</ul"></ol></a>';
			}
			else{
			inner_html = '<a title="'+item.label+'"><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';			
		}
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
	}*/
	});
};

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

function gotoPage(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function saveMst(strUrl)
{
	var frm = document.forms["frmMain"];
	$('#sellerId').removeAttr('disabled');
	$('#eventModule').removeAttr('disabled');
	$('#eventGroup').removeAttr('disabled');
	$('#eventDesc').removeAttr('disabled');
	$('#deliveryMedium').removeAttr('disabled');
	$('#eventTemplateDesc').removeAttr('disabled');
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

//javascript functions called from EventTemplateMstEntry.jsp
function addToSubject()
{
	var strEventAttribute = document.getElementById('eventAttribute').value;
	if(strEventAttribute != '')
	{
		var strEventSubject = document.getElementById('eventSubject').value;
		strEventSubject = strEventSubject + ' <' + strEventAttribute + '> ';
		$('#eventSubject').val(strEventSubject);
	}
}

function addToMsg()
{
	var strEventAttribute = document.getElementById('eventAttribute').value;
	var startPos = document.getElementById('eventMessage').selectionStart;
 	var endPos = document.getElementById('eventMessage').selectionEnd;
	if(strEventAttribute != '')
	{
		var strEventMsg = document.getElementById('eventMessage').value;
        strEventMsg = strEventMsg.substring(0, startPos) +
        ' <' + strEventAttribute + '> ' + strEventMsg.substring(endPos, strEventMsg.length);

		strEventMsg = strEventMsg ;
		$('#eventMessage').val(strEventMsg);
	}
}

function enableDisableSubject()
{
	var dm = document.getElementById("deliveryMedium").value;
	
	$('#eventSubject').val('');
	$('#eventMessage').val('');
	
	if((dm!='EMAIL' && dm!='EMAILATTACHMENT'))
	{
		if(dm!='ONSCREEN')
		{
			$('#subjectDiv').hide();
			$('#subjectDivLink').hide();
		}
		else
		{
			$('#subjectDiv').show();
			$('#subjectDivLink').show();
		}
	}
	else
	{
		$('#subjectDiv').show();
		$('#subjectDivLink').show();
	}
}

function enableModule(onload)
{
	if(onload==1){
	$('#eventModule').removeAttr('disabled');
	$('#eventGroup').removeAttr('disabled');	
	$('#eventDesc').removeAttr('disabled');
	$('#deliveryMedium').removeAttr('disabled');
	$('#eventAttribute').removeAttr('disabled');
	} else {
	$('#eventModule').removeAttr('disabled');
	$('#eventModule').val('');
	$('#eventGroup').attr('disabled','true');
	$('#eventGroup').val('');
	$('#eventDesc').attr('disabled','true');
	$('#eventDesc').val('');
	$('#deliveryMedium').attr('disabled','true');
	$('#deliveryMedium').val('');
	$('#eventAttribute').attr('disabled','true');
	$('#eventAttribute').val('');
	}
	enableDisableSubject();
}

function enableGroup()
{
	$('#eventGroup').removeAttr('disabled');
	$('#eventGroup').val('');
	$('#eventDesc').attr('disabled','true');
	$('#eventDesc').val('');
	$('#deliveryMedium').attr('disabled','true');
	$('#deliveryMedium').val('');
	enableDisableSubject();
	$('#eventAttribute').attr('disabled','true');
	$('#eventAttribute').val('');
}

function enableEvent()
{
	$('#eventDesc').removeAttr('disabled');
	$('#eventDesc').val('');
	$('#deliveryMedium').attr('disabled','true');
	$('#deliveryMedium').val('');
	enableDisableSubject();
	$('#eventAttribute').attr('disabled','true');
	$('#eventAttribute').val('');
}

function enableDelMed()
{
	$('#deliveryMedium').removeAttr('disabled');
	$('#deliveryMedium').val('');
	enableDisableSubject();
}

function enableEventAttr()
{
	$('#eventAttribute').removeAttr('disabled');
	$('#eventAttribute').val('');
}

function enableTableAttributeFieldsOnClick(textOrHtml)
{
	if(textOrHtml.value == "H")
	{
		$('#tableAttrDivLink').show();
		$('#tableAttributeDiv').show();
	}
	else
	{
		$('#tableAttrDivLink').hide();
		$('#tableAttributeDiv').hide();
	}
}

function enableTableAttributeFields(textOrHtml)
{
	if(textOrHtml == "H")
	{
		$('#tableAttrDivLink').show();
		$('#tableAttributeDiv').show();
	}
	else
	{
		$('#tableAttrDivLink').hide();
		$('#tableAttributeDiv').hide();
	}
}

function enableTextOrHtml(textOrHtml)
{
	if(isAllowTextOrHtml == 'Y')
	{
		$('#textOrHtmlDiv').show();
		enableTableAttributeFields(textOrHtml);
	}
	else
	{
		$('#textOrHtmlDiv').hide();
		$('#tableAttrDivLink').hide();
		$('#tableAttributeDiv').hide();
	}
}

function addToTableAttribute()
{
	var strEventAttribute = document.getElementById('eventAttribute').value;
	var startPos = document.getElementById('tableAttributeText').selectionStart;
 	var endPos = document.getElementById('tableAttributeText').selectionEnd;
	if(strEventAttribute != '')
	{
		var strTableAttributeMsg = document.getElementById('tableAttributeText').value;
		strTableAttributeMsg = strTableAttributeMsg.substring(0, startPos) +
        ' <' + strEventAttribute + '> ' + strTableAttributeMsg.substring(endPos, strTableAttributeMsg.length);

		strTableAttributeMsg = strTableAttributeMsg ;
		$('#tableAttributeText').val(strTableAttributeMsg);
	}
}