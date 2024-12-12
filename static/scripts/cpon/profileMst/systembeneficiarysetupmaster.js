function combineSplittedValues() {
	document.getElementById("hidden_mobileNmbr").value = document
			.getElementById("splitset1_mobileNmbrCountryCode").value
			+ document.getElementById("splitset2_mobileNmbr").value;
	document.getElementById("hidden_alternateMobile").value = document
			.getElementById("splitset1_alternateMobileCountryCode").value
			+ document.getElementById("splitset2_alternateMobile").value;
	document.getElementById("hidden_faxNmbr").value = document
			.getElementById("splitset1_faxNmbrCountryCode").value
			+ document.getElementById("splitset2_faxNmbr").value;
}

jQuery.fn.SetSplittedSet1Values = function() {
	$(this)
			.each(
					function(index) {
						var elementId = $(this).attr("id").replace(
								"splitset1_", "").replace("CountryCode", "");
						if (null != document.getElementById("hidden_"
								+ elementId)
								&& null != document.getElementById("hidden_"
										+ elementId).value
								&& 0 != document.getElementById("hidden_"
										+ elementId).value.length) {
							$(this).val(
									$("#hidden_" + elementId).val().substring(
											0, 3));
						}
					});
};

jQuery.fn.SetSplittedSet2Values = function() {
	$(this)
			.each(
					function(index) {
						var elementId = $(this).attr("id").replace(
								"splitset2_", "");
						if (null != document.getElementById("hidden_"
								+ elementId)
								&& null != document.getElementById("hidden_"
										+ elementId).value
								&& 0 != document.getElementById("hidden_"
										+ elementId).value.length) {
							$(this).val(
									$("#hidden_" + elementId).val()
											.substring(3));
						}
					});
};

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

function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function goToPage(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function reloadPage()
{
	var frm = document.forms["frmMain"];
	if(mode=='ADD')
	{
		frm.action = "addSystemBeneficiarySetupMaster.form";	
	}
	else
	{
		frm.action = "editSystemBeneficiarySetupMaster.form";
	}
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

function getRecord(json, elementId)
{
	var myJSONObject = JSON.parse(json);
	var inputIdArray = elementId.split("|");
	for (i = 0; i < inputIdArray.length; i++) {
		var field = inputIdArray[i];
		if (document.getElementById(inputIdArray[i])) {
			var type = document.getElementById(inputIdArray[i]).type;
			if (type == 'text') {
				document.getElementById(inputIdArray[i]).value = JSON
						.parse(myJSONObject).columns[0].value;
			} else {
				document.getElementById(inputIdArray[i]).innerHTML = JSON
						.parse(myJSONObject).columns[0].value;
			}
		}
	}
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
						return false;
					}
					return (key == 8 || key == 9 || key == 46 || key == 190
							|| (key >= 37 && key <= 40)
							|| (key >= 48 && key <= 57)
							|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
				})
			})
};

function setDirtyBit()
{
	dityBitSet=true;
}

function getCancelConfirmPopUp(strUrl) {
	if(dityBitSet)
	{
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
		$('#cancelConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			goToPage(strUrl);
		});
		$('#textContent').focus();
	}
	else
	{
		gotoPage(strUrl);
	}
}

function saveProfile(strUrl)
{
	$('#sellerId').removeAttr('disabled');
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
jQuery.fn.showToolTip = function()
{
	return this.each(function() {
		var text = $(this).text();
		if (text) {
			text = text.trim();
		}
		$(this).attr('title', text);
	});
};

function getCurrency()
{
	var strPayProd = $('#paymentProduct').val();	
	$.ajax({
		url : "services/productCurrency.json",
		type: "POST",
		data:{
			$payProd: strPayProd
			},
				dataType : "text",
				success : function(data) {
					var rec = data;
					$('#currency').val(rec);
					getBankIDTypeList(null,true,rec)
				}
		
	});	
};

function getProductId()
{
	var strPayProd = $('#paymentProduct').val();	
	$.ajax({
		url : "services/productId.json",
		type: "POST",
		data:{
			$payProd: strPayProd
			},
				dataType : "text",
				success : function(data) {
					var rec = data;
					$('#productId').val(rec);
				
				}
		
	});	
};


function getBankIDTypeList(objPayType,isPaymentTypeChanged,data) {
	var strPayProd;
	var curr;
	if(null!=objPayType)
	{
		strPayProd = objPayType;
	}
	else
	{
		strPayProd = $('#paymentProduct').val();	
	}
	curr=$('#currency').val();
	$.ajax({
		url : "services/beneBankCodeTypeList.json",
		type: "POST",
		data:{
			$sellerCode:$('#sellerCode').val(),
			$payProd: strPayProd,
			$currency:data
			
		},
				dataType : "json",
				success : function(data) {
					var rec = data;
							$('#bankTypeCode')
							.empty()
							.append('<option value="">Select</option>');
					if(rec && rec.length > 0){
						$.each(rec, function(index, cfg) {
							if(rec.length==1)
							{
								var opt = $('<option />', {
											value : cfg.filterCode,
											text : cfg.filterValue
										});
								opt.attr('selected', 'selected');
								opt.appendTo($('#bankTypeCode'));
								
								$('#bankIdSpanText').removeClass('hidden');
								$('#bankIdSpanText').val(cfg.filterValue);
								
								$('#bankTypeCode').val(cfg.filterCode);
								$('#bankTypeCode').hide();
							}
							else
							{
								var strProductId = $('#productId').val();
								if(strProductId=='04')
									{
									if(cfg.filterCode=='SYSTEM')
										{
										var opt = $('<option />', {
											value : cfg.filterCode,
											text : cfg.filterValue
										});
								opt.attr('selected', 'selected');
								opt.appendTo($('#bankTypeCode'));
								
										$('#bankIdSpanText').removeClass('hidden');
										$('#bankIdSpanText').val(cfg.filterValue);
										$('#bankTypeCode').val(cfg.filterCode);
										$('#bankTypeCode').hide();
										}
									else
										{
										$('#bankTypeCode').show();
										$('#bankIdSpanText').addClass('hidden');
										$('#bankTypeCode').append($('<option>', { 
											value: cfg.filterCode,
											text : cfg.filterValue
										}));
										
										}
									}
								else
									{
								$('#bankTypeCode').show();
								$('#bankIdSpanText').addClass('hidden');
								$('#bankTypeCode').append($('<option>', { 
									value: cfg.filterCode,
									text : cfg.filterValue
								}));
									}
							}   
						});			
						var strProductId = $('#productId').val();
					if (strProductId == '04')
						setBeneficiaryBankDetailsForBookTransfer();	
					verifyAndRestoreBeneBankDetails();
				}
					else
						{
						$('#bankTypeCode').show();
						$('#bankIdSpanText').addClass('hidden');
						}
				}
	});	
};

function populateCategoryDependentFieldPopulation() {
	var strProductId = $('#productId').val();
	if (strProductId == '04' && !isEmpty($('#bankTypeCode').val()))
		setBeneficiaryBankDetailsForBookTransfer();
	
}

function setBeneficiaryBankDetailsForBookTransfer() {
	$.ajax({
				url : "services/userseek/beneBranchSeek.json",
				dataType : "json",
				type : 'POST',
				data : {
					$top:1,
					$autofilter : '%',
					$filtercode1 : $('#sellerCode').val(),
					$filtercode2 : $('#bankTypeCode').val(),
					$filtercode3 : $('#productId').val() =='04' ? 'BOOK' : ''
				},
				success : function(response) {
					var data = response.d.preferences;
					if (data && data.length > 0) {
						var objBankDetails = data[0];
						if (!isEmpty(objBankDetails.BRANCHDESCRIPTION))
							$('#bankBranch').val(objBankDetails.BRANCHDESCRIPTION);
						if (!isEmpty(objBankDetails.ROUTINGNUMBER))
							$('#bankId').val(objBankDetails.ROUTINGNUMBER);
						isReceiverBankIDSelected=true;	
				}
				}
			});
}
function clearReceiverBankDetails(){
	persistBeneficiaryBankDetails();
	$('#bankId').val('');
	$('#bankTypeCode').val('');
	$('#bankIdSpanText').val('');
	//isReceiverBankIDSelected = false;
	clearBankDetails('RECEIVER_BANK_ID');
	
}

function clearBankDetails(infoType)
{
	if(infoType == 'RECEIVER_BANK_ID'){
		$('#bankBranch').val('');
	}
	//	$('#bankIdNotFound').empty();
	
}

function clearReceiverBank(){
	$('#bankId').val('');
	//isReceiverBankIDSelected = false;
	clearBankDetails('RECEIVER_BANK_ID');
	
}

function persistBeneficiaryBankDetails() {
	objOldBeneDetails['bankTypeCode'] = $('#bankTypeCode').val();
	objOldBeneDetails['bankBranch'] = $('#bankBranch').val();
	objOldBeneDetails['bankId'] = $('#bankId').val();
	objOldBeneDetails['isReceiverBankIDSelected'] = isReceiverBankIDSelected;
}

function resetBeneficiaryBankDetails() {
	objOldBeneDetails = {};
}

				

jQuery.fn.BankCodeAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : "services/userseek/benebankidseek.json",
							type : 'POST',
							dataType : "json",
							data : {
								$top : 20,
								$filtercode1 : $('#sellerCode').val(),
								$autofilter : request.term,
								$filtercode2 : $('#bankTypeCode').val()
										? $('#bankTypeCode').val() :'BIC'
							},
							success : function(data) {
								isReceiverBankIDSelected = false;
								var rec = data.d.preferences;
								if (rec.length > 0) {
									response($.map(rec, function(item) {
												return {
													label : item.BRANCHDESCRIPTION,
													bankDesc : item.BANKDESCRIPTION,
													value : item.ROUTINGNUMBER,
													bankDtl : item
												}
											}));
								}/* else {
									validateAndPaintReceiverBankIDsErrors();
								}*/
								
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.bankDtl;
				var strText = '';
				if (data) {
					
					if(!isEmpty(data.ROUTINGNUMBER)){
						$('#bankId').val(data.ROUTINGNUMBER);
					}	
					
					if (!isEmpty(data.BRANCHDESCRIPTION))
						$('#bankBranch').val(data.BRANCHDESCRIPTION);
				
					$('#bankBranchDesc').removeClass('required');
				}
				resetBeneficiaryBankDetails();
			},
			
			open : function() {
				/*
				 * $(this).removeClass("ui-corner-all")
				 * .addClass("ui-corner-top");
				 */
			},
			close : function() {
				/*
				 * $(this).removeClass("ui-corner-top")
				 * .addClass("ui-corner-all");
				 */
			}
		}).live("blur", function(event) {
	        var autocomplete = $(this).data("autocomplete");
	        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
	        autocomplete.widget().children(".ui-menu-item").each(function() 
	          {
	            var item = $(this).data("item.autocomplete");
	            if (matcher.test(item.label || item.value || item)) {
	                //There was a match, lets stop checking
	                autocomplete.selectedItem = item;
	                return;
	            }
	        });

	        if (autocomplete.selectedItem) {
	            autocomplete._trigger("select", event, {
	                item: autocomplete.selectedItem
	            });
	        //there was no match, clear the input
	        } else {
	            $(this).val('');
	        }
			
			});/*.data("autocomplete")._renderItem = function(ul, item) {
			
			 * var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
			 * +item.value +' - '+ item.label + '</ul><ul  >' + item.bankDesc + '</ul></ol></a>';
			 
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.value + '  ' + '</ul><ul">' + item.label + '</ul></ol></a>';
			ul.addClass('bankid_autocompleter');
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function verifyAndRestoreBeneBankDetails() {
	if (!isEmpty(objOldBeneDetails)
			&& !isEmpty(objOldBeneDetails['bankTypeCode'])
			&& !isEmpty($('#bankTypeCode').val())
			&& objOldBeneDetails['bankTypeCode'] == $('#bankTypeCode').val()) {
		restoreBeneficiaryBankDetails();
	}
}

function restoreBeneficiaryBankDetails() {
	$('#bankTypeCode').val(objOldBeneDetails['bankTypeCode']);
	$('#bankBranch').val(objOldBeneDetails['bankBranch']);
	$('#bankId').val(objOldBeneDetails['bankId']);
	isReceiverBankIDSelected = objOldBeneDetails['isReceiverBankIDSelected'];
}

jQuery.fn.BankBranchAutoComplete = function() {
	
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url :'services/userseek/bankBranchSeek.json',
									dataType : "json",
									type:'POST',
									data : {
										$top:20,
										$filtercode1:$('#sellerCode').val(),
										$autofilter : request.term,
										$filtercode2 : $('#bankTypeCode').val()
										
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.BRANCHDESCRIPTION,
														bankDesc : item.BANKDESCRIPTION,
														value : item.BRANCHDESCRIPTION,															
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						var strText = '';
						if (data) {
														
							if (!isEmpty(data.BRANCHDESCRIPTION))								
								$('#bankBranch').val(data.BRANCHDESCRIPTION);								
							if (!isEmpty(data.ROUTINGNUMBER))
								$('#bankId').val(data.ROUTINGNUMBER);
							
							}
						resetBeneficiaryBankDetails();	
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				}).live("blur", function(event) {
			        var autocomplete = $(this).data("autocomplete");
			        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val()) + "$", "i");
			        autocomplete.widget().children(".ui-menu-item").each(function() 
			          {
			            var item = $(this).data("item.autocomplete");
			            if (matcher.test(item.label || item.value || item)) {
			                //There was a match, lets stop checking
			                autocomplete.selectedItem = item;
			                return;
			            }
			        });

			        if (autocomplete.selectedItem) {
			            autocomplete._trigger("select", event, {
			                item: autocomplete.selectedItem
			            });
			        //there was no match, clear the input
			        } else {
			            $(this).val('');
			        }
					
					});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label
					+ '</ul><ul  >'
					+ item.bankDesc + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};