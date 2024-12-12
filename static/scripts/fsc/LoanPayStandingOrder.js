function showAddNewOrderForm(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "loanPayStandingOrderEntry.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function filter()
{
	var frm = document.getElementById('frmMain');
	frm.action = "filterLoanPayStandingOrder.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewOrderData(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function acceptRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function rejectRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	document.getElementById("txtSORejectRemark").value = $('#txtAreaRejectRemark').val();	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function disableRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function enableRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function discardRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editOrderData(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function historyPage(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
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
function getRejectPopupNew(strUrl, frmId, rowIndex) {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		close: function() {$("#reject_"+rowIndex).attr("checked", false);},
		buttons : {
				"Ok" : function() {
					rejectRecord(strUrl, frmId, rowIndex);
				},
				"Cancel" : function() {
					$("#reject_"+rowIndex).attr("checked", false);
					$(this).dialog("close");
					}
		}
	});
	$('#rejectPopup').dialog("open");
}
function fetchAddtionalData(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "loanStandingOrderEntry_ref.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}	
function updateOrder(frmId)
{
	$('#scmProductCode').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = "updateLoanPayStandingOrder.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}	
function addNewOrder(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "saveLoanPayStandingOrder.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setDaysOnChange()
{
	var strValue = $('#frequencyType option:selected').val();
	if (isEmpty(strValue)) 
	{
		return;
	}
	if(strValue == 'LOAN_DUEDATE_M_X' || strValue == 'LOAN_DUEDATE_P_X')
	{
		$('#lbldays').hide();
		$('#lblx_days').show();
		$('#day').attr("disabled","disabled");
		$('#days').hide();
		$('#x_days').show();
		$('#xday').removeAttr("disabled");
	}
}

function getSelectProductPopUpNew(strUrl, frmId) {


	buttonsOpts[btns['okBtn']]=function() {
					showAddNewOrderForm(frmId);
				};
	buttonsOpts[btns['cancelBtn']]=function() {
					$(this).dialog("close");
					};

	$('#selectProductTypePopUp').dialog( {
		autoOpen : false,
		height : 150,
		width : 420,
		modal : true,
		buttons : buttonsOpts
	});
	$('#selectProductTypePopUp').dialog("open");
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}
function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
	});
	$('#confirmPopup').dialog("open");

	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		var frm = document.forms[frmId];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	});
	$('#textContent').focus();
}

jQuery.fn.lineInvoiceClientAutoComplete= function() {
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
								fetchAddtionalData('frmMain');
							}
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
function verifyOrder(frmId)
{
	$('#scmProductCode').removeAttr("disabled");
	$('#supplierCode').removeAttr("disabled");
	$('#clientId').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = "verifyLoanPayStandingOrder.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function submitOrder(frmId)
{
	$('#scmProductCode').removeAttr("disabled");
	$('#supplierCode').removeAttr("disabled");

	var frm = document.getElementById(frmId);
	frm.action = "submitLoanPayStandingOrder.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getDiscardConfirmationPopup(frmId, strUrl)
{
	$('#discardConfirmPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
	});
	$('#discardConfirmPopup').dialog("open");

	$('#discardCancelBtn').bind('click',function(){
		$('#discardConfirmPopup').dialog("close");
	});

	$('#discardDoneBtn').bind('click',function(){
		var frm = document.forms[frmId];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	});
	$('#discardTextContent').focus();
}
function goToBack(frmId,strUrl)
{
    var frm = document.getElementById(frmId);
    frm.action = strUrl;
    frm.target = "";
    frm.method = "POST";
    frm.submit();
}