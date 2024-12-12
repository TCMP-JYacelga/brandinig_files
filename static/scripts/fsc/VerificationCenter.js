jQuery.fn.clientCodeSeekAutoComplete= function() {
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
								$('#txtLCMyClientDesc').val(data.DESCR);
								$('#txtLCMyClientCode').val(data.CODE);
							}
						}
						verificationFilter('simpleFilterVerification.form','frmMain')
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
function viewInvoiceVerification(strUrl, frmId, rowIndex)
{
	document.getElementById("txtInvVerIntRefNum").value = rowIndex;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getVerificationHistoryPage(strUrl,frmId,rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvVerIntRefNum").value = rowIndex;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=300";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function sendVerification(strUrl, frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvVerIntRefNum").value = selectedVERCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnSend').removeAttr('onclick').click(function(){});
	$('#btnSend').unbind('click');
	$('#btnSend').removeClass('black');
	$('#btnSend').addClass('grey');
}
function deleteVerification(strUrl, frmId) 
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvVerIntRefNum").value = selectedVERCheckBox;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
	frm.target = "";
	$('#btnDelete').removeAttr('onclick').click(function(){});
	$('#btnDelete').unbind('click');
	$('#btnDelete').removeClass('black');
	$('#btnDelete').addClass('grey');
}
function authorizeVerification(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvVerIntRefNum").value = selectedVERCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnAuth').removeAttr('onclick').click(function(){});
	$('#btnAuth').unbind('click');
	$('#btnAuth').removeClass('black');
	$('#btnAuth').addClass('grey');
}
function getVerificationRejectPopup(strUrl, frmId) {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Cancel" : function() {
				$(this).dialog("close");
				},
				"Go" : function() {
					rejectVerification(strUrl, frmId);
				}
		}
	});
	$('#rejectPopup').dialog("open");
}

function rejectVerification(strUrl, frmId)
{
	var txtInvIntRefNumstr="";
	for(var i=0;i<selectedVERCheckBox.length-1;i++)
	{
		txtInvIntRefNumstr=txtInvIntRefNumstr+selectedVERCheckBox[i]+",";
	}
	if(selectedVERCheckBox.length>0)
	{
		txtInvIntRefNumstr=txtInvIntRefNumstr+selectedVERCheckBox[i];
	}
	document.getElementById("txtInvVerIntRefNum").value =txtInvIntRefNumstr;
	document.getElementById("txtAreaRejectRemarks").value =document.getElementById("txtAreaRejectRemark").value;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

selectedVERCheckBox = new Array(); 						//This Array Used For Getting Selected Invoices.
selectedACCMakerArray=new Array();
function rowVERSelect(checkBoxId, jsonString,isAuth)
{
	var index;
	if ((index = selectedVERExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedVERCheckBox[selectedVERCheckBox.length] = checkBoxId.getAttribute("id");
			selectedACCMakerArray[selectedACCMakerArray.length]=isAuth;
		}
		else
		{
			$('#headerCheckbox').removeAttr("checked");
			selectedVERCheckBox.splice(index, 1);
			selectedACCMakerArray.splice(index, 1);
		}
	}
	enableDisableVERAuthorizeLink(true);
	enableDisableVERSendLink();
	enableDisableVERRejectLink(true);
	enableDisableVERDeleteLink();
	
}

function selectedVERExists(checkID) 
{
	for ( var i = 0; i < selectedVERCheckBox.length; i++) 
	{
		if (selectedVERCheckBox[i] == checkID)
		{
			return i;
     	}
	}
	return 0;
}

function enableDisableVERAuthorizeLink(isAuth)
{
	var authorizeValue;
	if (selectedVERCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedACCMakerArray[0];
		authorizeValue = obj.canAuthorise && isAuth && canAuth;
	}
	for ( var i = 1; i < selectedVERCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedACCMakerArray[i];
		authorizeValue = authorizeValue && obj.canAuthorise && canAuth;
	}
	if (authorizeValue == true && CAN_AUTH=='true') 
	{
	    
		$('#btnAuth').unbind('click');
		ToggleAttribute("btnAuth", true, "href");
		
		$('#btnAuth').click(function()
		{
			authorizeVerification('authVerification.form','frmMain');
		});
			
	}
	else 
	{
		ToggleAttribute("btnAuth", false, "href");
		$('#btnAuth').removeAttr('onclick').click(function()
				{});
		$('#btnAuth').unbind('click');
	}
	
}

function enableDisableVERRejectLink(isAuth)
{
	var rejectValue;
	if (selectedVERCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedACCMakerArray[0];
		rejectValue = obj.canReject && isAuth && canAuth;
	}
	for ( var i = 1; i < selectedVERCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedACCMakerArray[i];
		rejectValue = rejectValue && obj.canReject && canAuth;
	}
	if (rejectValue == true && CAN_AUTH=='true') 
	{
		$('#btnReject').unbind('click');
		ToggleAttribute("btnReject", true, "href");
		$('#btnReject').click(function()
		{
			getVerificationRejectPopup('rejectVerification.form','frmMain');
		});
			
	} 
	else
	{
		ToggleAttribute("btnReject", false, "href");
		$('#btnReject').removeAttr('onclick').click(function()
				{});
		$('#btnReject').unbind('click');
	}
}

function enableDisableVERDownloadLink()
{
	var downloadValue;
	if (selectedVERCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = obj.canDownload;
	}
	for ( var i = 1; i < selectedVERCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = downloadValue && obj.canDownload;
	}
	if (downloadValue == true) 
	{
		$('#btnDownload').unbind('click');
		ToggleAttribute("btnDownload", true, "href");
	} 
	else
	{
		ToggleAttribute("btnDownload", false, "href");
		$('#btnDownload').unbind('click');		
	}
}

function enableDisableVERSendLink()
{
	var sendValue;
	if (selectedVERCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = obj.canSend;
	}
	for ( var i = 1; i < selectedVERCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = sendValue && obj.canSend;
	}
	if (sendValue == true && (CAN_EDIT=='true' || CAN_AUTH=='true'))
	{
		$('#btnSend').unbind('click');
		ToggleAttribute("btnSend", true, "href");
		$('#btnSend').click(function()
		{
			sendVerification('sendVerification.form','frmMain');
		});
		}
	else
	{
		ToggleAttribute("btnSend", false, "href");
		$('#btnSend').unbind('click');
		$('#btnSend').removeAttr('onclick').click(function()
				{});
	}
}

function enableDisableVERDeleteLink()
{
	var deleteValue;
	if (selectedVERCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = obj.canDelete;
	}
	for ( var i = 1; i < selectedVERCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedVERCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = deleteValue && obj.canDelete;
	}
	if (deleteValue == true && CAN_EDIT=='true') 
	{
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
			$('#btnDelete').click(function()
			{
				deleteVerification('deleteVerification.form','frmMain');
			});
			} 
	else
	{
		ToggleAttribute("btnDelete", false, "href");
		$('#btnDelete').unbind('click');
		$('#btnDelete').removeAttr('onclick').click(function()
				{});
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
		cssClass = cssClass.replaceFirst("grey", " black ");
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
		cssClass = cssClass.replaceFirst(" black", " grey ");
		obj.setAttribute("class", cssClass);
	}
}
function checkVERUncheck(field,headerCheckbox)
{
	
		selectedVERCheckBox.splice(0, selectedVERCheckBox.length);
		selectedACCMakerArray.splice(0, selectedACCMakerArray.length);
		if(headerCheckbox.checked==true && field.length >0)
		{
			for (i = 0; i < field.length; i++)
			{
				field[i].checked = true ;
				selectedVERCheckBox[selectedVERCheckBox.length]=field[i].getAttribute("id");
				selectedACCMakerArray[selectedACCMakerArray.length]=objMakerData[i+1];
			}
		}
		else if(field.length >0)
		{
			for (i = 0; i < field.length; i++)
			{
				field[i].checked = false ;
			}
			selectedVERCheckBox.splice(0, selectedVERCheckBox.length);
			selectedACCMakerArray.splice(0, selectedACCMakerArray.length);
		}
		else if(headerCheckbox.checked==true)
		{
		        field.checked = true ;
		        selectedVERCheckBox[selectedVERCheckBox.length]=field.getAttribute("id");
				selectedACCMakerArray[selectedACCMakerArray.length]=objMakerData[1];
		}
		else
		{
		    field.checked = false ;
			selectedVERCheckBox.splice(0, selectedVERCheckBox.length);
			selectedACCMakerArray.splice(0, selectedACCMakerArray.length);
		}
		enableDisableVERAuthorizeLink(true);
		enableDisableVERSendLink();
		enableDisableVERRejectLink(true);
		enableDisableVERDeleteLink();
		
}
function verificationFilter(strUrl, frmId)
{ 
	if($("#txtLCMyClientDesc").length)
	 {
		if($('#txtLCMyClientDesc').val()== null || $('#txtLCMyClientDesc').val()=='')
		{
			$('#txtLCMyClientCode').val('');
		}
		else
		{
			if($('#txtLCMyClientCode').val()== null || $('#txtLCMyClientCode').val()=='')
			{
				//$('#txtLCMyClientCode').val($('#txtLCMyClientDesc').val());  
			}		  
		}
	 }
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
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