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
							goToPage('searchByLoanRef.form','frmMain');
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

selectedCheckBox=new Array();
 //This Array Used For Getting Selected Invoices.

function rowLoanRePaymentSelect(checkBoxId)
{
	
	var index;
	if ((index = selectedExists(checkBoxId.getAttribute("id"))) != -1)
	{
		if (checkBoxId.checked == true)
		{	
			selectedCheckBox[selectedCheckBox.length] = checkBoxId.getAttribute("id");
		}
		else
		{
			selectedCheckBox.splice(index, 1);
		}
	}
	enableDisablePayNowLink();
	
}
function enableDisablePayNowLink()
{
	
	if (selectedCheckBox.length > '0' )//&& CAN_EDIT == 'true'
	{
		togglesAttribute("btPayNow", true, "href");
		$('#btPayNow').removeClass('ui-button-disabled ui-state-disabled');
		$('#btPayNow').addClass('ux_button-padding ux_button-background-color');
		$('#btPayNow').unbind('click');
		
		$('#btPayNow').click(function(e)
			{
				loanInitiate('showFiancePaymentEntry.form', 'frmMain'); 
		   });
		   
	} 
	else
	{
		togglesAttribute("btPayNow", false, "href");
		$('#btPayNow').removeAttr('onclick').click(function() 
		{
		});
		$('#btPayNow').unbind('click');
		$('#btPayNow').addClass('ux_button-padding ux_button-background-color ui-button-disabled ui-state-disabled');
	}
}
function togglesAttribute(obj, DoEnable, TagName) 
{
	obj = document.getElementById("btPayNow");
	if(null == obj )
	{
		return;
	}
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
function selectedExists(checkID) 
{
	for ( var i = 0; i < selectedCheckBox.length; i++) 
	{
		if (selectedCheckBox[i] == checkID)
		{
			return i;
     	}
	}
	return 0;
}

function loanInitiate(strUrl, frmId) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = selectedCheckBox;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	$('#btnNew').removeAttr('onclick').click(function(){});
	$('#btnNew').unbind('click');
	$('#btnNew').removeClass('black');
	$('#btnNew').addClass('grey');
}
function loanInitiateFromRowlevel(strUrl, frmId,index) 
{
	frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getLoanRepaymentAdvancedFilterPopup(strUrl, frmId) {
	var defaultFromDate=btns['defaultFromDate'];
	var defaultToDate=btns['defaultToDate'];
	
	var fromDate=$('#fromLoanReleaseDate').val();
	var toDate= $('#toLoanReleaseDate').val();
	var dueFromDate= $('#fromDueDate').val();
	var dueToDate= $('#toDueDate').val();
	var fromloanDueDate=$('#fromLoanDueDate').val();
	var toLoanDueDate=$('#toLoanDueDate').val();
	if(fromDate==null || fromDate=="")
     {
	 $('#fromLoanReleaseDate').addClass('grey');
	 $('#fromLoanReleaseDate').val(defaultFromDate);
	 }
	if(toDate==null || toDate=="")
	{
	 $('#toLoanReleaseDate').addClass('grey');
	 $('#toLoanReleaseDate').val(defaultToDate);
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
	if(fromloanDueDate==null || fromloanDueDate=="")
    {
	 $('#fromLoanDueDate').addClass('grey');
	 $('#fromLoanDueDate').val(defaultFromDate);
	 }
	if(toLoanDueDate==null || toLoanDueDate=="")
	{
	 $('#toLoanDueDate').addClass('grey');
	 $('#toLoanDueDate').val(defaultToDate);
	}
	buttonsOpts[btns['cancelBtn']]=function() {
					$('#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";
							dueFromDate="";
							dueToDate="";
							
					});
					$(this).dialog("close");
				};
	buttonsOpts[btns['clearBtn']]=function() {
		var itemId, defaultItemValue;
		$('form#filterForm').find('input:visible, select:visible').each(function(index, item) {
			item = $(item);
			itemId = item.attr('id');
			defaultItemValue = '';
			if(itemId === 'fromLoanReleaseDate' || itemId === 'fromDueDate' || itemId === 'fromLoanDueDate') {
				defaultItemValue = defaultFromDate;
			} else if(itemId === 'toLoanReleaseDate' || itemId === 'toDueDate' || itemId === 'toLoanDueDate') {
				defaultItemValue = defaultToDate;
			}
			if(defaultItemValue !== '') {
				item.addClass('grey');
			}
			item.val(defaultItemValue);
		});
	};
	buttonsOpts[btns['goBtn']]=function() {
					if ($('#fromLoanReleaseDate').val() == defaultFromDate) {
						$('#fromLoanReleaseDate').val("");
					}
					if ($('#fromDueDate').val() == defaultFromDate) {
						$('#fromDueDate').val("");
					}
					if ($('#toLoanReleaseDate').val() == defaultToDate) {
						$('#toLoanReleaseDate').val("");
					}
					if ($('#toDueDate').val() ==defaultToDate) {
						$('#toDueDate').val("");
					}
					if ($('#fromLoanDueDate').val() == defaultFromDate) {
						$('#fromLoanDueDate').val("");
					}
					if ($('#toLoanDueDate').val() == defaultToDate) {
						$('#toLoanDueDate').val("");
					}
					if ($('#txtAmount').val() == "") {
						$('#txtAmount').val("0");
					}
					if ($('#txtLoanOSAmount').val() == "") {
						$('#txtLoanOSAmount').val("0");
					}
					$(this).dialog("close");
					var selectedClientCode = $('#txtLCMyClientCode').val();					
					strUrl = strUrl + '?selectedClientCode=' + selectedClientCode;
					goToPage(strUrl, frmId);
				};
	
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 350,
		width : 510,
		modal : true,
		buttons : buttonsOpts,
		open:function(){
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
            
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("cancelBtn")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');

            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').attr("title","Go");
            $('.ui-dialog-buttonpane').find('button:contains("goBtn")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
		}
	});
	$('#advancedFilterPopup').dialog("open");
}
function checkUncheckLoanRepayment(field,headerCheckbox)
{
		selectedCheckBox.splice(0, selectedCheckBox.length);
		selectedVerifyArray.splice(0, selectedVerifyArray.length);
		selectedAcceptArray.splice(0, selectedAcceptArray.length);
		selectedMakerArray.splice(0, selectedMakerArray.length);
		
		if(headerCheckbox.checked==true && field.length >0)
		{
			for (i = 0; i < field.length; i++)
			{
				field[i].checked = true ;
				selectedCheckBox[selectedCheckBox.length]=field[i].getAttribute("id");
			}
		}
		else if(field.length >0)
		{
			for (i = 0; i < field.length; i++)
			{
				field[i].checked = false ;
			}
			selectedCheckBox.splice(0, selectedCheckBox.length);
			selectedVerifyArray.splice(0, selectedVerifyArray.length);
			selectedAcceptArray.splice(0, selectedAcceptArray.length);
			selectedMakerArray.splice(0, selectedMakerArray.length);
		}
		else if(headerCheckbox.checked==true)
		{
		        field.checked = true ;
		        selectedCheckBox[selectedCheckBox.length]=field.getAttribute("id");
		}
		else
		{
		    field.checked = false ;
			selectedCheckBox.splice(0, selectedCheckBox.length);
			selectedVerifyArray.splice(0, selectedVerifyArray.length);
			selectedAcceptArray.splice(0, selectedAcceptArray.length);
			selectedMakerArray.splice(0, selectedMakerArray.length);
		}
	enableDisablePayNowLink();
}

function goBackValidate(strUrl, frmId)
{
	getConfirmationPopup(frmId, strUrl);
}
function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}
function viewFinanceInvoiceData(strUrl, frmId, invoiceInternalRef)
{
	document.getElementById("txtInvIntRefNum").value = invoiceInternalRef;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setSearchRefTextOnFocus() {
	var referenceVal = $('#searchReference').val();
	$('#searchReference').css("color", "black");
	if (referenceVal == "" || referenceVal == null) {
		$('#searchReference').css("color", "gray");
		$('#searchReference').val("Reference No");
	} else if (referenceVal == "Reference No") {
		$('#searchReference').val("");
	}
}

function setSearchRefText() {
	var referenceVal = $('#searchReference').val();
	if (referenceVal == "" || referenceVal == null) {
		$('#searchReference').css("color", "gray");
		$('#searchReference').val("Reference No");
	}
}
function changeRepaymentSort(sortCol, sortOrd, colId) {
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(colId)) 
	{
		document.getElementById("txtSortColId").value=colId;
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value=sortOrd;
   		frm.action = 'sortLoanRepaymentList.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}
function invoicePayments(strUrl, frmId)
{
	var txtInvIntRefNumstr="";
	for(var i=0;i<selectedCheckBox.length-1;i++)
	{
		txtInvIntRefNumstr=txtInvIntRefNumstr+selectedCheckBox[i]+",";
	}
	if(selectedCheckBox.length>0)
	{
	var	txtInvPayIntRefNum=txtInvIntRefNumstr+selectedCheckBox[i];
	}

	//document.getElementById("txtInvPayIntRefNum2").value =txtInvIntRefNumstr;

	// document.getElementById("txtAreaRejectRemarks").value
	// =document.getElementById("txtAreaRejectRemark").value;
	var frm = document.getElementById(frmId);

	frm.action = strUrl;
	frm.target = "";
	frm.txtInvPayIntRefNum.value = txtInvPayIntRefNum;
	frm.method = "POST";
	frm.submit();
	/*$('#btnPayNow').removeAttr('onclick').click(function(){});
	$('#btnPayNow').unbind('click');
	$('#btnPayNow').removeClass('black');
	$('#btnPayNow').addClass('grey');*/
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