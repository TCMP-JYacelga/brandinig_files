function getCancelConfirmPopUp(strUrl) {
	if (dityBitSet) {
		
		$('#confirmMsgPopup').dialog({
				autoOpen : false,
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				//height : 150,
				modal : true,
				resizable: false,
				draggable: false//,
				//buttons : buttonsOpts
			});
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
function getNotificationMap(strUrl, element) {
		var eventName = $('#eventName').val();
		var eventSource = $('#eventSource').val();
		var sellerCode = $('#sellerId').val();
		var strUrl =  "services/" + strUrl + "?eventName="
							+ eventName+"&eventSource="+eventSource+"&sellerCode="+sellerCode;
		$.ajax({
					url :strUrl,
					contentType : "application/json",
					type : 'POST',
					data : {},
					success : function(data) {
						//var x;
						if(null!=data && data.length!=0 && null != data.notify){
						//for (x in data) {
							enableDisableNotifications('chkattachmentNotify', 'msgTemplateNameAttachment', data.notify.ATTACHMENT_NOTIFY,'attachmentNotify');
							enableDisableNotifications('chkemailNotify', 'msgTemplateNameEmail', data.notify.EMAIL_NOTIFY,'emailNotify');
							enableDisableNotifications('chkfaxNotify', 'msgTemplateNameFax', data.notify.FAX_NOTIFY,'faxNotify');
							enableDisableNotifications('chkscreenNotify', 'msgTemplateNameScreen', data.notify.SCREEN_NOTIFY,'screenNotify');
							enableDisableNotifications('chksmsNotify', 'msgTemplateNameSms' ,data.notify.SMS_NOTIFY,'smsNotify');
							if(null != data){
								var y;
								var select;
								var option;
								if(null != data.attachMentList){
									select = document.getElementById("msgTemplateNameAttachment");
									select.length = 1;
									for(y in data.attachMentList)
									{
										option = document.createElement("option");
										option.text = data.attachMentList[y];
										option.value = y;
										select.add(option);
									}
								}
								if(null != data.emailList){
									select = document.getElementById("msgTemplateNameEmail");
									select.length = 1;
									for(y in data.emailList)
									{
										option = document.createElement("option");
										option.text = data.emailList[y];
										option.value = y;
										select.add(option);
									}
								}
								if(null != data.smsList){
									select = document.getElementById("msgTemplateNameSms");
									select.length = 1;
									for(y in data.smsList)
									{
										option = document.createElement("option");
										option.text = data.smsList[y];
										option.value = y;
										select.add(option);
									}
								}
								if(null != data.onScreenList){
									select = document.getElementById("msgTemplateNameScreen");
									select.length = 1;
									for(y in data.onScreenList)
									{
										option = document.createElement("option");
										option.text = data.onScreenList[y];
										option.value = y;
										select.add(option);
									}
								}
								if(null != data.faxList){
									select = document.getElementById("msgTemplateNameFax");
									select.length = 1;
									for(y in data.faxList)
									{
										option = document.createElement("option");
										option.text = data.faxList[y];
										option.value = y;
										select.add(option);
									}
								}
							}
						//}
						}
						
						if(modeVal == 'EDIT' || modeVal =='VIEW'){
							document.getElementById("msgTemplateNameEmail").value = msgTemplateNameEmail;
							document.getElementById("msgTemplateNameAttachment").value = msgTemplateNameAttachment;
							document.getElementById("msgTemplateNameSms").value = msgTemplateNameSms;
							document.getElementById("msgTemplateNameScreen").value = msgTemplateNameScreen;
							enableReportFields('msgTemplateNameAttachment');
							document.getElementById("msgTemplateNameFax").value = msgTemplateNameFax;
							if(document.getElementById('subcriptionCategory').value == "CE") {
								enableDisableNotifications('chkscreenNotify', 'msgTemplateNameScreen', 'N','screenNotify');
								$('#screenNotify').val('N');
								$('#mobilePushNotify').val('N');
								$('#msgTemplateNameScreen').attr("disabled",true);
								$('#msgTemplateNameScreen').val('');
							}
						}
					}
				});
	}
jQuery.fn.eventNameAutoComplete= function(minLength) {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/eventNameSeek.json?$eventModule="+$('#eventModule').val()+"&$eventGroup="+$('#eventGroup').val()+"&$sellerCode="+$('#sellerId').val(),
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
						if(modeVal === 'ADD'){
							document.getElementById('recipientName').value = '';
							document.getElementById('subcriptionCategory').value = '';
						}
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.value)){
								$('#eventName').val(data.value);
								$('#eventSource').val(data.featureType);
								mobilePushApplicableFlag = data.applicableFlag;
								$("#subcriptionCategory").removeAttr("disabled");
							}
							callRecipientTypeService('getRecipientTypes.json', 'eventDesc', false);
						}						
						getNotificationMap('getNotificationMap.json','eventName');
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
function gotoPage(strUrl) {
	$("#sellerId").removeAttr("disabled");
	$("#eventName").removeAttr("disabled");
	$("#eventSource").removeAttr("disabled");
	$("#recipientType").removeAttr("disabled");
	$("#eventModule").removeAttr("disabled");
	$("#eventGroup").removeAttr("disabled");
	$("#eventDesc").removeAttr("disabled");
	$("#subcriptionCategory").removeAttr("disabled");
	$("#recipientName").removeAttr("disabled");
	$("#description").removeAttr("disabled");
	$("#msgTemplateNameEmail").removeAttr("disabled");
	$("#msgTemplateNameSms").removeAttr("disabled");
	$('input:radio').removeAttr("disabled");
	var frm = document.forms["frmMain"];	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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