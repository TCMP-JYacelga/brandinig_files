jQuery.fn.scmProductSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/scmProductsSeek.json?$productCode="+$('#productDesc').val(), // $('#sellerCode').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.filterList;
										
										response($.map(rec, function(item) {
													return {														
														label : item.productDescription,														
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
							if (!isEmpty(data.productCode))
							{
								$('#productCode').val(data.productCode);
								$('#productDesc').val(data.productDescription);
								$('#productWorkflow').val(data.productWorkflow);
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

function setProductCatCode(prdCatCode)
{
	productCatCode = prdCatCode;
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

function setEnableDisable(imgElement, flagId, selectId) {
	var value = $('#' + flagId).val();
	if (value == 'N') {
		$('#' + selectId).attr('disabled', true);
	} else {
		$('#' + selectId).attr('disabled', false);
	}
}

function getCancelConfirmPopUp(strUrl) {
	if (dityBitSet) {		
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
		
		$('#doneBackConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			goToPage(strUrl);
		});
		
		$('#textContent').focus();
	} else {
		goToPage(strUrl);
	}
}

function setDirtyBit()
{
	dityBitSet = true;
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

function submitFinSetupMstProfile(strUrl) {
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableDisableForm(boolVal) {
	$('#Std').attr('disabled', boolVal);
	$('#custom').attr('disabled', boolVal);
	$('#profileName').attr('disabled', boolVal);
	$('#entityType').attr('disabled', boolVal);
}

function submitFinWorkflowMstProfile(strUrl) {
	var frm = document.forms["frmMain"];
	enableDisableFinWorkflowForm(false);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableDisableFinWorkflowForm(boolVal) {
	$('#loanTypeCode').attr('disabled', boolVal);
	$('#loanBookingEvent').attr('disabled', boolVal);
	$('#loanReleaseEvent').attr('disabled', boolVal);
}

function submitFinInterestProfile(strUrl) {
	var frm = document.forms["frmMain"];
	enableDisableFinInterestProfile(false);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableDisableFinInterestProfile(boolVal) {
	$('#loanTypeCode').attr('disabled', boolVal);
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
jQuery.fn.ForceAmountOnly = function() {
	return this
			.each(function() {
				$(this)
						.keydown(
								function(event) {
									var keynum;
									var keychar;
									if (window.event) { // IE
										keynum = event.keyCode;
									}
									if (event.which) { // Netscape/Firefox/Opera
										keynum = event.which;
									}
									if (event.shiftKey) {
										return false;
									}
									if ((keynum == 8
											|| keynum == 9
											|| keynum == 27
											|| keynum == 46
											||
											// Allow: Ctrl+A
											(keynum == 65 && event.ctrlKey === true)
											||
											// Allow: home, end, left, right
											(keynum >= 35 && keynum <= 40)
											|| (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))) {
										if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
												&& (this.value.indexOf('.') != -1 && (this.value
														.substring(this.value
																.indexOf('.'))).length > 4))
											return false;
										return true;
									} else if (keynum == 110 || keynum == 190) {
										var checkdot = this.value;
										var i = 0;
										for (i = 0; i < checkdot.length; i++) {
											if (checkdot[i] == '.')
												return false;
										}
										if (checkdot.length == 0)
											this.value = '0';
										return true;
									} else {
										// Ensure that it is a number and stop
										// the keypress
										if (event.shiftKey
												|| (keynum < 48 || keynum > 57)
												&& (keynum < 96 || keynum > 105)) {
											event.preventDefault();
										}
									}

									keychar = String.fromCharCode(keynum);

									return !isNaN(keychar);
								})
			})
};
jQuery.fn.OnlyNumbers = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var prevKey = -1, prevControl = '';
							var keynum;							
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if (event.shiftKey)
							{
							  return false;
							}							
							return((keynum == 8 || keynum == 9 || keynum == 17 || keynum == 46 || (keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105) || (keynum == 65 && prevKey == 17 && prevControl == event.currentTarget.id)));							
							})
			})
};
jQuery.fn.ForcePositiveAndNegativeNumbersOnly = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(event) {
							var keynum;
							console.log(keynum + " < keynum");
							var keychar;
							if (window.event) { // IE
								keynum = event.keyCode;
							}
							if (event.which) { // Netscape/Firefox/Opera
								keynum = event.which;
							}
							if (event.shiftKey)
							{
							  return false;
							}
							if ((keynum == 8
									|| keynum == 9
									|| keynum == 27
									|| keynum == 46
									||
									// Allow: Ctrl+A
									(keynum == 65 && event.ctrlKey === true)
									||
									// Allow: home, end, left, right
									(keynum >= 35 && keynum <= 40) || (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))) {
								if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
										&& (this.value.indexOf('.') != -1 && (this.value
												.substring(this.value
														.indexOf('.'))).length > 2))
									return false;
								return true;
							} 
							else {
								// Ensure that it is a number and stop
								// the keypress
								if (event.shiftKey
										|| (keynum < 48 || keynum > 57)
										&& (keynum < 96 || keynum > 105)) {
										
									if ((keynum == 173 ||  keynum == 109 ||  keynum == 189) && this.value.length == 0)
									{
									return true;
									}
									else
									{									
									event.preventDefault();
									}
								}
							}

							keychar = String.fromCharCode(keynum);

							return !isNaN(keychar);
							})
			})
};
function validateAndNavigate(strUrl, frmId) {
	$('#checkFlag').val("1");
	if ($('#dirtyBit').val() == "1")
		getNavigationPopup(frmId, strUrl);
	else
		goToPage(strUrl);
}
function getNavigationPopup(frmId, strUrl) {
	$('#navigatePopup').dialog({
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
	$('#navigatePopup').dialog("open");
}
function setMandatoryPostingEvents()
{
	if($('#intrDeductionTypeFlag').val() == "U")
	{
		disableElement('intrPostingPeriodTypeFlag','postingevents');
		enableAndMandatory('intrToFlag','chargeto');
		disableElement('intrPostingFrequencyFlag','postingfrequency');
		disableElement('intrPostingPeriodValue','period');
		disableElement('intrPostingPeriodDay','specificday');
	}
	else if($('#intrDeductionTypeFlag').val() == "R")
	{
		enableAndMandatory('intrPostingPeriodTypeFlag','postingevents');
		enableAndMandatory('intrToFlag','chargeto');
		disableElement('intrPostingFrequencyFlag','postingfrequency');
		disableElement('intrPostingPeriodValue','period');
		disableElement('intrPostingPeriodDay','specificday');
	}
	else if($('#intrDeductionTypeFlag').val() == "P")
	{
		disableElement('intrPostingPeriodTypeFlag','postingevents');
		disableElement('intrToFlag','chargeto');
		disableElement('intrPostingFrequencyFlag','postingfrequency');
		disableElement('intrPostingPeriodValue','period');
		disableElement('intrPostingPeriodDay','specificday');
	}
}	
function setPostingFrequency()
{
	if($('#intrPostingPeriodTypeFlag').val() == "P")
	{
		enableAndMandatory('intrPostingFrequencyFlag','postingfrequency');
		enableElement('intrPostingPeriodValue');
		enableElement('intrPostingPeriodDay');
	}
	else
	{
		disableElement('intrPostingFrequencyFlag','postingfrequency');
		disableElement('intrPostingPeriodValue','period');
		disableElement('intrPostingPeriodDay','specificday');
	}
}
function enableDisableRates()
{
	if($('#intrRateTypeCode').val() == "X")
	{
		enableElement('fixedRateValue');
		disableElement('intrBasisPoints','basispoints');
		disableElement('baseRateCode','baserate');
	}
	else
	{
		disableElement('fixedRateValue','fixedrate');
		enableElement('intrBasisPoints');
		enableElement('baseRateCode');
	}
}
function enableDisableElement(me, element)
{
	if($('#'+me).val() == "D")
	{
		$('#' +element).val("");
		$('#' +element).attr('disabled',true);
	}
	else
	{
		$('#' +element).val("");
		$('#' +element).attr('disabled',false);
	}
}
function enableElement(element)
{
	$('#' + element).val("");
	$('#' + element).attr('disabled',false);
}
function enableAndMandatory(element, label)
{
	$('#' + element).val("");
	$('#' + label).addClass('required');
	$('#' + element).attr('disabled',false);
}
function disableElement(element, label)
{
	$('#' + element).val("");
	$('#' + label).removeClass('required');
	$('#' + element).attr('disabled',true);
}