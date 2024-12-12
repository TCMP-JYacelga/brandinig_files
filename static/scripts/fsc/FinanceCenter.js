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
						financeFilter('simpleFilterFinance.form','frmMain');
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


function viewFinanceInvoiceData(strUrl, frmId, invoiceInternalRef)
{
	document.getElementById("txtInvIntRefNum").value = invoiceInternalRef;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewFinance(strUrl, frmId, invoiceInternalRef)
{
	document.getElementById("txtFinIntRefNum").value = invoiceInternalRef;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editInvoiceFinance(strUrl, frmId, rowIndex)
{
	document.getElementById("txtFinIntRefNum").value = rowIndex;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function authorizeFinance(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtFinIntRefNum").value = selectedFINCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnAuth').removeAttr('onclick').click(function(){});
	$('#btnAuth').unbind('click');
	$('#btnAuth').removeClass('black');
	$('#btnAuth').addClass('grey');
}

function authorizeViewedFinance(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtFinIntRefNum").value = selectedFINCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function sendFinance(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtFinIntRefNum").value = selectedFINCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnSend').removeAttr('onclick').click(function(){});
	$('#btnSend').unbind('click');
	$('#btnSend').removeClass('black');
	$('#btnSend').addClass('grey');
}

function rejectFinance(strUrl, frmId)
{
	document.getElementById("txtFinIntRefNum").value =selectedFINCheckBox;
	document.getElementById("txtAreaRejectRemarks").value =document.getElementById("txtAreaRejectRemark").value;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function sendViewedFinance(strUrl, frmId)
{
	document.getElementById("txtFinIntRefNum").value =selectedFINCheckBox;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function deleteFinance(strUrl, frmId)
{
	frm = document.getElementById(frmId);
	document.getElementById("txtFinIntRefNum").value = selectedFINCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnDelete').removeAttr('onclick').click(function(){});
	$('#btnDelete').unbind('click');
	$('#btnDelete').removeClass('black');
	$('#btnDelete').addClass('grey');
}
function getFinanceHistoryPage(strUrl,frmId,rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtFinIntRefNum").value = rowIndex;
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

function getFinanceRejectPopup(strUrl, frmId) {
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
					rejectFinance(strUrl, frmId);
				}
		}
	});
	$('#rejectPopup').dialog("open");
}

function getFinanceAdvancedFilterPopup(strUrl, frmId)
{
	     var defaultFromDate=btns['defaultFromDate'];
		var defaultToDate=btns['defaultToDate'];
		var fromDate=$('#fromDate').val();
		var toDate= $('#toDate').val();
		var dueFromDate= $('#fromDueDate').val();
		var dueToDate= $('#toDueDate').val();   
	if(fromDate==null || fromDate=="")
    {
	 $('#fromDate').addClass('grey');
	 $('#fromDate').val(defaultFromDate);
	 }
	if(toDate==null || toDate=="")
	{
	 $('#toDate').addClass('grey');
	 $('#toDate').val(defaultToDate);
	}
	if(dueFromDate==null || dueFromDate=="")
    {
	 $('#fromDueDate').addClass('grey');
	 $('#fromDueDate').val(defaultFromDate);
	 }
	if(dueToDate==null || dueToDate=="")
	{
	 $('#toDueDate').addClass('grey');
	 $('#toDueDate').val(defaultToDate);
	}
	
	
	buttonsOpts[btns['cancelBtn']]=function() {
					$('#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";
							dueFromDate="";
							dueToDate="";
							/*
							 * loanReleaseFromDate=""; loanReleaseToDate="";
							 * loanDueFromDate=""; loanDueToDate="";
							 */
							
					});
					$(this).dialog("close");
				};
				
	buttonsOpts[btns['clearBtn']] = function() {
		var itemId, defaultItemValue;
		$('form#filterForm').find('input:visible, select:visible').each(function(index, item) {
			item = $(item);
			itemId = item.attr('id');
			defaultItemValue = '';
			if(itemId === 'fromDate' || itemId === 'fromDueDate') {
				defaultItemValue = defaultFromDate;
			} else if(itemId === 'toDate' || itemId === 'toDueDate') {
				defaultItemValue = defaultToDate;
			}
			if(defaultItemValue !== '') {
				item.addClass('grey');
			}
			item.val(defaultItemValue);
		});
	};
				
	buttonsOpts[btns['goBtn']]=function() {
					if ($('#fromDate').val() == defaultFromDate) {
						$('#fromDate').val("");
					}
					if ($('#fromDueDate').val() == defaultFromDate) {
						$('#fromDueDate').val("");
					}
					if ($('#toDate').val() == defaultToDate) {
						$('#toDate').val("");
					}
					if ($('#toDueDate').val() == defaultToDate) {
						$('#toDueDate').val("");
					}
										
					if ($('#txtAmount').val() == "") {
						$('#txtAmount').val("0");
					}
			
					$(this).dialog("close");
					goToPage(strUrl, frmId);
				};
	/*
	 * if(loanReleaseFromDate==null || loanReleaseFromDate=="") {
	 * $('#fromLoanDate').css('color','gray');
	 * $('#fromLoanDate').val(defaultFromDate); } if(loanReleaseToDate==null ||
	 * loanReleaseToDate=="") { $('#toLoanDate').css('color','gray');
	 * $('#toLoanDate').val(defaultToDate); } if(loanDueFromDate==null ||
	 * loanDueFromDate=="") { $('#fromLoanDueDate').css('color','gray');
	 * $('#fromLoanDueDate').val(defaultFromDate); } if(loanDueToDate==null ||
	 * loanDueToDate=="") { $('#toLoanDueDate').css('color','gray');
	 * $('#toLoanDueDate').val(defaultToDate); }
	 */
	
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 400,
		width : 510,
		modal : true,
		buttons : buttonsOpts,
		open: function(){
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
			$('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').attr("title","Go");
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
		}
	});
	$('#advancedFilterPopup').dialog("open");
}

selectedFINCheckBox = new Array(); 						// This Array Used For
														// Getting Selected
selectedFINMakerArray=new Array();														// Invoices.

function rowFINSelect(checkBoxId, jsonString,canAuth)
{
	var index;
	if ((index = selectedFINExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedFINCheckBox[selectedFINCheckBox.length] = checkBoxId.getAttribute("id");
			selectedFINMakerArray[selectedFINMakerArray.length]=canAuth;
		}
		else
		{
			$('#headerCheckbox').removeAttr("checked");
			selectedFINCheckBox.splice(index, 1);
			selectedFINMakerArray.splice(index, 1);
		}
	}
	enableDisableFINAuthorizeLink(true);
	enableDisableFINSendLink();
	enableDisableFINRejectLink(true);
	enableDisableFINDeleteLink();
}

function selectedFINExists(checkID) 
{
	for ( var i = 0; i < selectedFINCheckBox.length; i++) 
	{
		if (selectedFINCheckBox[i] == checkID)
		{
			return i;
     	}
	}
	return 0;
}

function enableDisableFINAuthorizeLink(isAuth)
{
	var authorizeValue;
	if (selectedFINCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedFINMakerArray[0];
		authorizeValue = obj.canAuthorise && isAuth && canAuth;
	}
	for ( var i = 1; i < selectedFINCheckBox.length; i++) 
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedFINMakerArray[i];
		authorizeValue = authorizeValue && obj.canAuthorise && isAuth && canAuth;
	}
	
	if (authorizeValue == true  && CAN_AUTH=='true') 
	{
	   	$('#btnAuth').unbind('click');
		ToggleAttribute("btnAuth", true, "href");
		$('#btnAuth').click(function()
				{authorizeFinance('authFinance.form','frmMain');});
	}
	else 
	{
		$('#btnAuth').removeAttr('onclick').click(function() 
		{
		});
		ToggleAttribute("btnAuth", false, "href");
		$('#btnAuth').unbind('click');
	}
	
}

function enableDisableFINRejectLink(isAuth)
{
	var rejectValue;
	if (selectedFINCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedFINMakerArray[0];
		rejectValue = obj.canReject && isAuth && canAuth;
	}
	for ( var i = 1; i < selectedFINCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		var canAuth=selectedFINMakerArray[i];
		rejectValue = rejectValue && obj.canReject && isAuth &&  canAuth;
	}
	if (rejectValue == true && CAN_AUTH=='true') 
	{
		$('#btnReject').unbind('click');
		ToggleAttribute("btnReject", true, "href");
		$('#btnReject').click(function()
				{
			getFinanceRejectPopup('rejectFinance.form','frmMain');
				});
	} 
	else
	{
		$('#btnReject').removeAttr('onclick').click(function()
		{});
		ToggleAttribute("btnReject", false, "href");
		$('#btnReject').unbind('click');
	}
}

function enableDisableFINDownloadLink()
{
	var downloadValue;
	if (selectedFINCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		downloadValue = obj.canDownload;
	}
	for ( var i = 1; i < selectedFINCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[i]).value;
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

function enableDisableFINSendLink()
{
	var sendValue;
	if (selectedFINCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = obj.canSend;
	}
	for ( var i = 1; i < selectedFINCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		sendValue = sendValue && obj.canSend;
	}
	if (sendValue == true && (CAN_EDIT=='true' || CAN_AUTH=='true'))
	{
		$('#btnSend').unbind('click');
		ToggleAttribute("btnSend", true, "href");
		$('#btnSend').click(function()
		{
			sendFinance('sendFinance.form','frmMain');
		});
	}
	else
	{
		$('#btnSend').removeAttr('onclick').click(function()
		{});
		ToggleAttribute("btnSend", false, "href");
		$('#btnSend').unbind('click');
	}
}

function enableDisableFINDeleteLink()
{
	var deleteValue;
	if (selectedFINCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[0]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = obj.canDelete;
	}
	for ( var i = 1; i < selectedFINCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedFINCheckBox[i]).value;
		var obj = eval("(" + objstr + ')');
		deleteValue = deleteValue && obj.canDelete;
	}
	if (deleteValue == true && CAN_EDIT=='true') 
	{
		$('#btnDelete').unbind('click');
		ToggleAttribute("btnDelete", true, "href");
		$('#btnDelete').click(function()
		{
			deleteFinance('deleteFinance.form','frmMain')
		});
	} 
	else
	{
		$('#btnDelete').removeAttr('onclick').click(function()
		{});
		ToggleAttribute("btnDelete", false, "href");
		$('#btnDelete').unbind('click');
		
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
function checkFINUncheck(field,headerCheckbox)
{
	selectedFINCheckBox.splice(0, selectedFINCheckBox.length);
	selectedFINMakerArray.splice(0, selectedFINMakerArray.length);
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = true ;
			selectedFINCheckBox[selectedFINCheckBox.length]=field[i].getAttribute("id");
			selectedFINMakerArray[selectedFINMakerArray.length]=objMakerData[i+1];
		}
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		selectedFINCheckBox.splice(0, selectedFINCheckBox.length);
		selectedFINMakerArray.splice(0, selectedFINMakerArray.length);
	}
	else if(headerCheckbox.checked==true)
	{
	        field.checked = true ;
	        selectedFINCheckBox[selectedFINCheckBox.length]=field.getAttribute("id");
	        selectedFINMakerArray[selectedFINMakerArray.length]=objMakerData[1];
	}
	else
	{
	    field.checked = false ;
	    selectedFINCheckBox.splice(0, selectedFINCheckBox.length);
	    selectedFINMakerArray.splice(0, selectedFINMakerArray.length);
	}
	enableDisableFINAuthorizeLink(true);
	enableDisableFINSendLink();
	enableDisableFINRejectLink(true);
	enableDisableFINDeleteLink();
	enableDisableFINDownloadLink();
}

function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}

function goToBack(strUrl,frmId, strUrlSave)
{
	if($('#dirtyBit').val()=="1")
		getConfirmationPopup(frmId, strUrl, strUrlSave);
	else
    {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	}
}

function goToPage(strUrl, frmId)
{
	 var frm = document.getElementById(frmId);
	 frm.action = strUrl;
	 frm.target = "";
	 frm.method = "POST";
	 frm.submit();
}
function financeFilter(strUrl, frmId)
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
