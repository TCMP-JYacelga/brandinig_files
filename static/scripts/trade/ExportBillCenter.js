function changeBillPage(navType, newPage) 
{
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}	
	var curPage=$('.pcontrol input', this.pDiv).val();
	var totPage='<c:out value="${total_pages}"/>';		
	switch(navType) 
	{
		case 'first':
		frm.action = 'exportBillCenter_first.form';
		break;
		case 'prev':
		frm.action = 'exportBillCenter_previous.form';
		break;
		case 'next':
		if(curPage>=totPage)
			return false;
		frm.action = 'exportBillCenter_next.form';
		break;
		case 'last':
		frm.action = 'exportBillCenter_last.form';
		break;
		case 'input':
		$('#page_number').val(curPage);
		frm.action = 'exportBillCenter_goto.form';
		break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function changeSort(sortCol, sorOrd, colId)
{
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if(!isEmpty(colId))
	{
		document.getElementById("txtSortColId").value = colId;
		if(!isEmpty(sortCol))
		{
			document.getElementById("txtSortColName").value = sortCol;
		}
		if(!isEmpty(sorOrd))
		{
			document.getElementById("txtSortOrder").value = sorOrd;			
		}
		frm.action = "sortExportBillList.form";
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
function simpleFilter(frmId)
{
	var frm = document.getElementById(frmId);
	
	if($("#txtBillMyClientDesc").length)
	{
		if($('#txtBillMyClientDesc').val()== null || $('#txtBillMyClientDesc').val()=='')
		{
			$('#txtBillMyClientCode').val('');
		}
		else
		{
			if($('#txtBillMyClientCode').val()== null || $('#txtBillMyClientCode').val()=='')
			{
				$('#txtBillMyClientCode').val($('#txtBillMyClientDesc').val());  
			}		  
		}
	 }	
	frm.action = "simpleFilterExportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showExportLoanReqForm(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("hiddenBillRef").value = selectedCheckBox;
	frm.action = "newLoanRequestFromExportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showLoanReqForm(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("hiddenBillRef").value = rowIndex;
	frm.action = "newLoanRequestFromExportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getAdvancedBillFilterPopup(frmId) 
{
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		height : 360,
		width : 473,
		modal : true,
		buttons : {			
			"Filter" : function() {
				filterBill(frmId);
			
			},				
			"Clear" : function() {
				$('#filterForm').each (function(){
					this.reset();
						$('#txtAmount').val("0.00");
						fromDate="";
						toDate="";
						$('#txtReference').val("");
						$('#dropdownBeneCode').val("");
				});
			},							
			"Cancel" : function() {
				$('#filterForm').each (function(){
					this.reset();
						$('#txtAmount').val("0.00");
						fromDate="";
						toDate="";
						$('#txtReference').val("");	
						$('#dropdownBeneCode').val("");
				});
				$(this).dialog("close");
			}
		},
		open: function() {
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
            $('.ui-dialog-buttonpane').find('button:contains("Clear")').attr("title","Clear");
            
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
            
            $('.ui-dialog-buttonpane').find('button:contains("Filter")').attr("title","Filter");
            $('.ui-dialog-buttonpane').find('button:contains("Filter")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
            
        }
	});
	$('#advancedFilterPopup').dialog("open");
}

function filterBill(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "advanceFilterExportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function getExportBillHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "exportBillHistory.hist";
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=700,height=300";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
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
selectedCheckBox = new Array(); 						
// This Array Used For Getting Selected bills
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
function rowBillSelect(checkBoxId, jsonString, makerId)
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
	enableDisableLoanReqLink();
}
function enableDisableLoanReqLink()
{
	var loanReqValue;
	var ccy1;
	var ccyMatch = true;	
	if (selectedCheckBox.length > 0)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[0]).value;
		var obj = eval("(" + objstr + ")");
		loanReqValue = obj.canLoanReq;		
		var objstr1 = document.getElementById("TEXTBILL" + selectedCheckBox[0]).value;
		var obj1 = eval("(" + objstr1 + ")");
		 ccy1 = obj1.currency;		
	}
	for ( var i = 1; i < selectedCheckBox.length; i++)
	{
		var objstr = document.getElementById("TEXT" + selectedCheckBox[i]).value;
		var obj = eval("(" + objstr + ")");
		loanReqValue = loanReqValue && obj.canLoanReq;		
		var objstr2 = document.getElementById("TEXTBILL" + selectedCheckBox[i]).value;
		var obj2 = eval("(" + objstr2 + ")");
		var ccy2 = obj2.currency;		
		if(ccy1 != ccy2)
			{ ccyMatch = false;  break; }		
	}
	if (loanReqValue == true && CAN_EDIT == 'true' && ccyMatch)
	{
		$('#btnLoanReq').unbind('click');		
		ToggleAttribute("btnLoanReq", true, "href");
		$('#btnLoanReq').click(function()
				{
					showExportLoanReqForm('frmMain');
				});
	} 
	else 
	{
		ToggleAttribute("btnLoanReq", false, "href");
		$('#btnLoanReq').removeAttr('onclick').click(function() 
		{});
		$('#btnLoanReq').unbind('click');
	}
}

function addLoanRequestData(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "saveExportBillLoanRequest.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function viewBillData(frmId, rowIndex)
{
	document.getElementById("txtRecordIndex").value = rowIndex;
	var frm = document.getElementById(frmId);
	frm.action = "viewExportBill.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();		
}

function checkUncheck(field,headerCheckbox)
{
		selectedCheckBox.splice(0, selectedCheckBox.length);		
		
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
	}
	enableDisableLoanReqLink();
}

jQuery.fn.clientCodeExportSeekAutoComplete= function() {
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
								$('#txtBillMyClientDesc').val(data.DESCR);
								$('#txtBillMyClientCode').val(data.CODE);
							}
							simpleFilter('frmMain');
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