function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit(); 
}
function removeDisabled() {
	$("#clientId").removeAttr("disabled");
	$("#officeName").removeAttr("disabled");
	$('#sellerId').removeAttr('disabled');
	$('#clearingLocCode').removeAttr('disabled');
}
function combineSplittedValues() {
	
	if(document.getElementById("splitset1_telephoneCountryCode").value == '' || document.getElementById("splitset1_telephoneCountryCode").value == "" || document.getElementById("splitset1_telephoneCountryCode").value == null)
	{
		document.getElementById("telephone").value = "000"
			+ document.getElementById("splitset2_telephone").value;
	}
	else
	{
		document.getElementById("telephone").value = document
				.getElementById("splitset1_telephoneCountryCode").value
				+ document.getElementById("splitset2_telephone").value;
	}
}

function reloadData(){
	$("#clientId").val("");
	$("#clientDesc").val("");
}

jQuery.fn.FormatCountryCode = function(value) {
	$(this).each(function(index) {

		if (value.length == 2) {
			$(this).val("0" + $(this).val());
		}
		if (value.length == 1) {
			$(this).val("00" + $(this).val());
		}
	});
};
jQuery.fn.sellersClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "cpon/clientOfficeMst/clientNameSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$clientName : $('#clientDesc').val()
									},
									success : function(data) {
										var rec = data;
										response($.map(rec, function(item) {
													return {														
														label : item.CLIENT_NAME,														
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
							if (!isEmpty(data.CLIENT_NAME))
							{
								$('#clientId').val(data.CLIENT_ID);
								$('#clientDesc').val(data.CLIENT_NAME);
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

jQuery.fn.controllingBranchSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "cpon/clientOfficeMst/branchNameSeek.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$branchId : $('#branchDesc').val(),
										$filtercode1 : $('#sellerId').val()
									},
									success : function(data) {
										var rec = data;
										response($.map(rec, function(item) {
													return {														
														label : item.DISP_BRANCH_DESCRIPTION,														
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
							if (!isEmpty(data.DISP_BRANCH_DESCRIPTION))
							{
								$('#branchId').val(data.DISP_BRANCH_CODE);
								$('#branchDesc').val(data.DISP_BRANCH_DESCRIPTION);
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
					},
					change : function() {
						if($(this).val() == '')
						{
							$('#branchId').val("");
							$('#branchDesc').val("");
						}
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
jQuery.fn.validateZipcode = function() {
	return this
			.each(function() {
				$(this)
						.keydown(
								function(e) {
									var key = e.charCode || e.keyCode || 0;
									// allow backspace, tab, delete, numbers
									// keypad numbers, letters ONLY
									if (event.which) { // Netscape/Firefox/Opera
										keynum = event.which;
									}
									if (event.shiftKey || event.ctrlKey) {
										return false;
									}
									return (key == 8 || key == 9 || key == 46
											|| key == 190 || key == 189 || key == 32
											|| (key >= 37 && key <= 40)
											|| (key >= 48 && key <= 57)
											|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
								})
			})
};


jQuery.fn.SetSplittedSet1Values = function() {
	$(this)
			.each(
					function(index) {
						var elementId = $(this).attr("id").replace(
								"splitset1_", "").replace("CountryCode", "");
						var elementIdPhone = $(this).attr("id").replace(
								"splitset2_", "");
						if (null != document.getElementById(elementId)
								&& null != document.getElementById(elementId).value
								&& 0 != document.getElementById(elementId).value.length) {
							if(document.getElementById(elementId).value.length <= 10 && document.getElementById(elementIdPhone).value != "")
							{
								$(this).val('000');
							}
							else
							{
									$(this).val(
										$("#" + elementId).val().substring(
												0, 3));
							}
						}
					});
};


jQuery.fn.SetSplittedSet2Values = function() {
	$(this)
			.each(
					function(index) {
						var elementId = $(this).attr("id").replace(
								"splitset2_", "");
						if (null != document.getElementById(elementId)
								&& null != document.getElementById(elementId).value
								&& 0 != document.getElementById(elementId).value.length) {
							$(this).val(
									$("#" + elementId).val()
											.substring(3));
						}
					});
};

function resetMenuItems(elementId){
	if(elementId == 'returnOthrOfficeDesc') {
		$("#"+elementId).val('');
		$("#returnOthrOfficeId").val('');
	}
}

function enableDisableBilingProfile(elmt)
{
    if(elmt.id  == 'billingLevelO')
    {
        $('#lblBillingprofile').addClass("required");
        $("#billingProfileId").val('');
        $('#billingProfileDesc').removeClass('disabled');
        $('#billingProfileDesc').removeAttr("disabled");
        $('#billingProfileDesc').val('');
    }
    else
    {
        $('#lblBillingprofile').removeClass("required");
        $("#billingProfileId").val('');
        $('#billingProfileDesc').addClass('disabled');
        $('#billingProfileDesc').attr('disabled','true');
        $('#billingProfileDesc').val('');
    }
}
function populateStates(elmt, mState)
{
	var state = "";
	if(elmt.id == "country")
	{
		if(elmt.value == "")
		{
			$('#state').attr("disabled", "true");
			$('#state').val("");
		}
		else
		{
			$('#state').removeAttr("disabled");
			state = document.getElementById("state");
		}
	}
	
	if(elmt.value != "")
	{
		//blockClientUI(true);
		$.post('cpon/clientServiceSetup/clientCountryStateList.json', { $countryCode: elmt.value}, 
		function(data){
			populateData(state, data);
			if(mState != "")
				state.value = mState;
			//blockClientUI(false);
		})
		.fail(function() 
		{
			//blockClientUI(false);
		});
	}
}
function populateData(select, states)
{
	var x;
	select.length=1;
	
	for (x in states)
	{
		var option=document.createElement("option");
		option.text=states[x].STATE_DESC;
		option.value=states[x].STATE_CODE;
		select.add(option);
	}
}

function toggleCheckUncheck(imgElement, flag) {
    if (imgElement.src.indexOf("icon_unchecked_grey.gif") == -1) {
        if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
            imgElement.src = "static/images/icons/icon_checked.gif";
            $('#' + flag).val('Y');
        } else {
            imgElement.src = "static/images/icons/icon_unchecked.gif";
            $('#' + flag).val('N');
        }
    }
}

function toggleEnableDisable(imgElement, id) 
{
    if (imgElement.src.indexOf('icon_unchecked_grey.gif') == -1)
    {
        if (imgElement.src.indexOf('icon_unchecked.gif') > -1)
        {
            imgElement.src = 'static/images/icons/icon_checked.gif';
            $('#' + id).val('Y');
            if(id == 'cashPickup')
            {
            	enableCashPickUpFields();
            }
            else if(id == 'chqPickup')
            {
            	enableChqPickupFields();
            }
           }
           else
           {
            imgElement.src = 'static/images/icons/icon_unchecked.gif';
            $('#' + id).val('N');
            if(id == 'cashPickup')
            {
            	disableCashPickUpFields();
            	clearCashPickUpFields();
            }
            else if(id == 'chqPickup')
            {
            	disableChqPickupFields();
            	clearChqPickupFields();
            }
        }
    }
}

function enableCashPickUpFields()
{
	if(cashAgncyEnble == 'Y')
    {
        $('#cashAgencyDesc').removeAttr('disabled');
        $('#cashAgencyDesc').removeClass('disabled');
    }
    else
    {
        $('#cashAgencyCode').removeAttr('disabled');
        $('#cashAgencyCode').removeClass('disabled');
    }
    $('#cashAgencyOfficeID').removeAttr('disabled');
    $('#cashAgencyOfficeID').removeClass('disabled');
    $('#cashPickupAmountLimit').removeAttr('disabled');
    $('#cashPickupAmountLimit').removeClass('disabled');
    $('#cashAgencyChargeAmount').removeAttr('disabled');
    $('#cashAgencyChargeAmount').removeClass('disabled');
    $('#cashPickupType').removeAttr('disabled');
    $('#cashPickupType').removeClass('disabled');
    $('#cashRemarks').removeAttr('disabled');
    $('#cashRemarks').removeClass('disabled');
    $('#chkCashWithinCityLimit').attr('src','static/images/icons/icon_unchecked.gif');
    $('#chkCashVaulting').attr('src','static/images/icons/icon_unchecked.gif');
    cashFieldsAddRequired();
}

function disableCashPickUpFields()
{
	if(cashAgncyEnble == 'Y')
    {
        $('#cashAgencyDesc').attr('disabled','true');
        $('#cashAgencyDesc').addClass('disabled');
    }
    else
    {
        $('#cashAgencyCode').attr('disabled','true');
        $('#cashAgencyCode').addClass('disabled');
    }
    $('#cashAgencyOfficeID').attr('disabled','true');
    $('#cashAgencyOfficeID').addClass('disabled');
    $('#cashPickupAmountLimit').attr('disabled','true');
    $('#cashPickupAmountLimit').addClass('disabled');
    $('#cashAgencyChargeAmount').attr('disabled','true');
    $('#cashAgencyChargeAmount').addClass('disabled');
    $('#cashPickupType').attr('disabled','true');
    $('#cashPickupType').addClass('disabled');
    $('#cashRemarks').attr('disabled','true');
    $('#cashRemarks').addClass('disabled');
    $('#chkCashWithinCityLimit').attr('src','static/images/icons/icon_unchecked_grey.gif');
    $('#chkCashVaulting').attr('src','static/images/icons/icon_unchecked_grey.gif');
    cashFieldsRemoveRequired();
}

function enableChqPickupFields()
{
	if(chequeAgncyEnble == 'Y')
    {
        $('#chqAgencyDesc').removeAttr('disabled');
        $('#chqAgencyDesc').removeClass('disabled');
    }
    else
    {
        $('#chqAgencyCode').removeAttr('disabled');
        $('#chqAgencyCode').removeClass('disabled');
    }
    $('#chqAgencyOfficeID').removeAttr('disabled');
    $('#chqAgencyOfficeID').removeClass('disabled');
    $('#chqAgencyChargeAmount').removeAttr('disabled');
    $('#chqAgencyChargeAmount').removeClass('disabled');
    $('#chqRemarks').removeAttr('disabled');
    $('#chqRemarks').removeClass('disabled');
    $('#chkChqWithinCityLimit').attr('src','static/images/icons/icon_unchecked.gif');
    chqFieldsAddRequired();
}

function disableChqPickupFields()
{
	if(chequeAgncyEnble == 'Y')
    {
        $('#chqAgencyDesc').attr('disabled','true');
        $('#chqAgencyDesc').addClass('disabled');
    }
    else
    {
        $('#chqAgencyCode').attr('disabled','true');
        $('#chqAgencyCode').addClass('disabled');
    }
    $('#chqAgencyOfficeID').attr('disabled','true');
    $('#chqAgencyOfficeID').addClass('disabled');
    $('#chqAgencyChargeAmount').attr('disabled','true');
    $('#chqAgencyChargeAmount').addClass('disabled');
    $('#chqRemarks').attr('disabled','true');
    $('#chqRemarks').addClass('disabled');
    $('#chkChqWithinCityLimit').attr('src','static/images/icons/icon_unchecked_grey.gif');
    chqFieldsRemoveRequired();
}

function clearCashPickUpFields()
{
    if(cashAgncyEnble == 'Y')
    {
        $('#cashAgencyDesc').val('');
    }
    else
    {
        $('#cashAgencyCode').val('');
    }
    $('#cashAgencyOfficeID').val('');
    $('#cashPickupAmountLimit').val('');
    $('#cashAgencyChargeAmount').val('');
    $('#cashPickupType').val('');
    $('#cashRemarks').val('');
}

function clearChqPickupFields()
{
    if(chequeAgncyEnble == 'Y')
    {
        $('#chqAgencyDesc').val('');
    }
    else
    {
        $('#chqAgencyCode').val('');
    }
    $('#chqAgencyOfficeID').val('');
    $('#chqAgencyChargeAmount').val('');
    $('#chqRemarks').val('');
}

function cashFieldsAddRequired()
{
    if(cashNameRequired =='Y')
    {
        $('#lblCashAgencyName').addClass('required-lbl-right');
    }
    if(cashIdRequired =='Y')
    {
        $('#lblCashAgencyOfficeId').addClass('required-lbl-right');
    }
    if(cashLimitRequired =='Y')
    {
        $('#lblCashPickupLimit').addClass('required-lbl-right');
    }
    if(cashChargeRequired =='Y')
    {
        $('#lblCashAgencyChargeAmount').addClass('required-lbl-right');
    }
    if(cashTypeRequired =='Y')
    {
        $('#lblCashPickupType').addClass('required-lbl-right');
    }
    if(cashRemarksRequired =='Y')
    {
        $('#lblCashRemarks').addClass('required-lbl-right');
    }
}

function cashFieldsRemoveRequired()
{
    $('#lblCashAgencyName').removeClass('required-lbl-right');
    $('#lblCashAgencyOfficeId').removeClass('required-lbl-right');
    $('#lblCashPickupLimit').removeClass('required-lbl-right');
    $('#lblCashAgencyChargeAmount').removeClass('required-lbl-right');
    $('#lblCashPickupType').removeClass('required-lbl-right');
    $('#lblCashRemarks').removeClass('required-lbl-right');
}

function chqFieldsAddRequired()
{
    if(chqNameRequired =='Y')
    {
        $('#lblChequeAgencyName').addClass('required-lbl-right');
    }
    if(chqIdRequired =='Y')
    {
        $('#lblChequeAgencyOfficeId').addClass('required-lbl-right');
    }
    if(chqChargeRequired =='Y')
    {
        $('#lblChequeAgencyChargeAmount').addClass('required-lbl-right');
    }
    if(chqRemarksRequired =='Y')
    {
        $('#lblChequeRemarks').addClass('required-lbl-right');
    }
}

function chqFieldsRemoveRequired()
{
    $('#lblChequeAgencyName').removeClass('required-lbl-right');
    $('#lblChequeAgencyOfficeId').removeClass('required-lbl-right');
    $('#lblChequeAgencyChargeAmount').removeClass('required-lbl-right');
    $('#lblChequeRemarks').removeClass('required-lbl-right');
}