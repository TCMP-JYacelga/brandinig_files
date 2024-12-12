function setDirtyBit()
{
	dityBitSet=true;
}
//function hideShowOnMoreClick(){
//	$('#etiDiv').toggleClass("ui-helper-hidden ");
//	$("#contactdtlshowhide").remove("i");
//	if($('#etiDiv').hasClass('ui-helper-hidden')){
//		$('#contactdtlshowhide').text(' Show Payer Details ');
//		$("#contactdtlshowhide").prepend("<i class='fa fa-caret-down'></i>");
//	}
//	else{
//		$('#contactdtlshowhide').text(' Hide Payer Details ');
//		$("#contactdtlshowhide").prepend("<i class='fa fa-caret-up'></i>");
//	}
//}
function goToPage(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function submitForm(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	if(strEntityTYpe=='1')
	{
		$('#clientDesc').val(strClientDesc);	
	}	
	frm.target = "";
	frm.method = "POST";
	if(!validateAndPaintReceiverBankIDsErrors())
	{
		if ($('#payerAccountCcy').attr('disabled'))
			$('#payerAccountCcy').attr('disabled', false);
		if (isEmpty($('#payerAccountCcy').val()))
			$('#payerAccountCcy').val(defaultSeller);	
		frm.submit();
	}		
}
function getCancelConfirmPopUp(strUrl) {
	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		$(this).dialog("close");
		gotoPage(strUrl);
	});
	if(dityBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				maxHeight: 550,
				width : 430,
				modal : true,
				resizable: false,
				draggable: false
			});
	$('#confirmMsgPopup').dialog("open");
	$('#textContent').focus();
	}
	else
	{
		gotoPage(strUrl);
	}
}
function getDiscardConfirmPopUp(strUrl) {
	$('#cancelDiscardConfirmMsg').bind('click',function(){
		$('#discardMsgPopup').dialog("close");
	});
	$('#doneConfirmDiscardbutton').bind('click',function(){
		$(this).dialog("close");
		discardProfile(strUrl);
	});
	$('#discardMsgPopup').dialog({
				autoOpen : false,
				maxHeight: 550,
				width : 430,
				modal : true,
				resizable: false,
				draggable: false,
				title : getLabel('Message',
				'Message')
			});
	$('#discardMsgPopup').dialog("open");
	$('#textContent').focus();
}
function discardProfile(strUrl){
var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	if(strEntityTYpe=='1')
	{
		$('#clientDesc').val(strClientDesc);	
	}	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showhideEtiDiv()
{
	 	    $('#etiDiv').toggleClass("ui-helper-hidden ");
	 	    if($('#moreLessLbl').text()==moreLable)
	 	    {
	 	    	$('#moreLessLbl').text(lessLable);
	 	    }
	 	    else
	 	    {
	 	    	$('#moreLessLbl').text(moreLable);
	 	    }
}

jQuery.fn.sellersClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/sellersClientSeek.json?$sellerCode="+$('#sellerId').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.filterList;
										response($.map(rec, function(item) {
													return {														
														label : item.name,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					autoFocus: true,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.value))
							{
								$('#clientId').val(data.value);
								$('#clientDesc').val(data.name);
								populateBankIds();
							}
						}
					},
					change:function(event,ui){
					 var val=ui.item;
					if(val===null)
					clearClient();
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				})/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function populateBankIds (){
	$.ajax({
		url : 'services/userseek/payerBankIdSeek.json',
		method : "GET",
		async : false,
		data : {
			$autofilter : $('#clientId').val()
		},
		success : function(response) {
			
			if($("#ibanOrAcctFlag").val() == 'I')
			{
				$('#bankIdType').empty().append($('<option>', {
					value: '',
					text : 'Select',
					selected:false
				}));
				$.each(response.d.preferences, function (i, item) {
					if(item.CODE == 'BIC')
					{
						$('#bankIdType').empty().append($('<option>', { 
							value: item.CODE,
							text : item.DESCRIPTION,
							selected:true
						}));
						return false;
					}
				});
			}else{
				$('#bankIdType').empty().append($('<option>', {
					value: '',
					text : 'Select',
					selected:true
				}));
				$.each(response.d.preferences, function (i, item) {
					$('#bankIdType').append($('<option>', { 
						value: item.CODE,
						text : item.DESCRIPTION 
					}));
				});
			}
			$('#bankIdType').niceSelect();
			$('#bankIdType').niceSelect("update");
		},
		failure : function(response) {
		}
	});
}

jQuery.fn.DrawerStateAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				var strUrl = "services/userseek/state.json?$top=10";

					if (!isEmpty($('#drawerCountryCode').val())) {
						strUrl += '&$filtercode1='
								+ $('#drawerCountryCode').val();
					} else
						return false;					
				$.ajax({
							url : strUrl,
							dataType : "json",
							data : {
								$autofilter : request.term
							},
							success : function(data) {
								var rec = data.d.preferences;
								response($.map(rec, function(item) {
											return {
												label : item.DESCRIPTION,
												objState : item
											}
										}));
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.objState;
				if (data) {
					if (!isEmpty(data.CODE))
					{						
						$('#drawerState').val(data.CODE);
						$('#drawerStateDesc').val(data.DESCRIPTION);
					}
				}
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;">'
					+ '</ul><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};


jQuery.fn.DrawerCountryAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/country.json?$top=10",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DESCRIPTION,
														objState : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.objState;
						for(var i=0;i<=50;i++)
						{  
						
						}
						if (data) {
							if (!isEmpty(data.CODE))
							{
								//$('#drawerState').val('');
								//$('#drawerStateDesc').val('');
								$('#drawerCountryCode').val(data.CODE);
								$('#drawerCountryDesc').val(data.DESCRIPTION);
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
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;">'
					+ '</ul><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function saveProfile(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	if(strEntityTYpe=='1')
	{
		$('#clientDesc').val(strClientDesc);	
	}	
	frm.target = "";
	frm.method = "POST";
	if(!validateAndPaintReceiverBankIDsErrors())
	{
		if ($('#payerAccountCcy').attr('disabled'))
			$('#payerAccountCcy').attr('disabled', false);
		if (isEmpty($('#payerAccountCcy').val()))
			$('#payerAccountCcy').val(defaultSeller);	
		frm.submit();
	}	
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
					if ((event.shiftKey )&&( key == 35 ||  key == 36 ||key == 37 || key == 39 || key == 9)) {
						return true;
					}
					else if(event.shiftKey){
						return false;
					}
					return (key == 8 || key == 9 || key == 46 || key == 190
							|| (key >= 35 && key <= 40)
							|| (key >= 48 && key <= 57)
							|| (key >= 96 && key <= 105) || (key >= 65 && key <= 90));
				})
			})
};

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

jQuery.fn.BankIdAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : "services/userseek/drwMandEntryDrawerbank.json",
							type : 'POST',
							dataType : "json",
							data : {
								$top : 20,
								$filtercode1 : $('#sellerId').val(),
								$autofilter : request.term,
								$filtercode2 : $('#bankIdType').val()
										? $('#bankIdType').val() :'BIC',
								$filtercode3 : ''
							},
							success : function(data) {
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
					$('#payerBankCode').attr("disabled", "true");
					isReceiverBankIDSelected = true;
					
					if (!isEmpty(data.BANKCODE)) {
						$('#payerBankCode').val(data.BANKCODE);
						//$('#payerBankDesc').val(data.BANKDESCRIPTION);
					}
					if(!isEmpty(data.ROUTINGNUMBER)){
						$('#bankId').val(data.ROUTINGNUMBER);
						$('#payerSearchText').val(data.ROUTINGNUMBER);
					}	
					if (!isEmpty(data.BRANCHCODE))
						$('#payerBranchCode').val(data.BRANCHCODE);
					if (!isEmpty(data.BRANCHDESCRIPTION))
						$('#payerBranchDesc').val(data.BRANCHDESCRIPTION);
					//if (!isEmpty(data.ADDRESS))
					//	$('#payerAddress2').val(data.ADDRESS);					
				}
				resetBeneficiaryBankDetails();
			},
			focus:function(event,ui){
				 var item=ui.item;
				 $(".ui-autocomplete > li").attr("title",item.value+' | '+item.label);
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
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			
			 * var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
			 * +item.value +' - '+ item.label + '</ul><ul  >' + item.bankDesc + '</ul></ol></a>';
			 
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.value + ' | ' + '</ul><ul">' + item.label + '</ul></ol></a>'
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function getBankIDTypeList(objPayType,isPaymentTypeChanged) {
	var strPayType;
	if(null!=objPayType)
	{
		strPayType = objPayType;
	}
	/*else
	{
		strPayType = $('#paymentType').val();	
	}
	*/
	$.ajax({
		url : "services/payerBankIDTypeList.json",
		type: "POST",
		data:{
			$sellerCode:$('#sellerId').val(),
			$payType:strPayType,
			$clientCode:$('#clientId').val()
		},
				dataType : "json",
				success : function(data) {
					var rec = data;
							$('#bankIdType')
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
								opt.appendTo($('#bankIdType'));
								$('#spBankIdType').hide();								
								$('#bankIdSpanText').removeClass('hidden');
								$('#bankIdSpanText').text(cfg.filterValue);
								
								$('#bankIdType').val(cfg.filterCode);
								$('#bankIdType').hide();
							}
							else
							{
								$('#bankIdType').show();
								$('#bankIdSpanText').addClass('hidden');
								$('#bankIdType').append($('<option>', { 
									value: cfg.filterCode,
									text : cfg.filterValue
								}));								
							}   
						});			
					//if (!isEmpty($('#bankIdType').val()))
						//setBeneficiaryBankDetailsForBookTransfer();	
					}
					//if BankId is same as of previous Payment Type/ Payment Package selection
					verifyAndRestoreBeneBankDetails();
					//$('#bankIdType').val(bankIdTypeVal);
				}
	});	
};

function verifyAndRestoreBeneBankDetails() {
	if (!isEmpty(objOldBeneDetails)
			&& !isEmpty(objOldBeneDetails['bankIdType'])
			&& !isEmpty($('#bankIdType').val())
			&& objOldBeneDetails['bankIdType'] == $('#bankIdType').val()) {
		restoreBeneficiaryBankDetails();
	}
}
function restoreBeneficiaryBankDetails() {
	$('#bankIdType').val(objOldBeneDetails['bankIdType']);
//	$('#beneBankCode').val(objOldBeneDetails['beneBankCode']);
//	$('#beneBranchCode').val(objOldBeneDetails['beneBranchCode']);
//	$('#beneAddress2').val(objOldBeneDetails['beneAddress2']);
	$('#payerBranchDesc').val(objOldBeneDetails['payerBranchDesc']);
//	$('#beneBankDesc').val(objOldBeneDetails['beneBankDesc']);
	$('#bankSearchText').val(objOldBeneDetails['bankSearchText']);
	isReceiverBankIDSelected = objOldBeneDetails['isReceiverBankIDSelected'];
}


jQuery.fn.beneBankSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/payerDrawBankSeek.json?$sellerCode="+$('#sellerId').val()+"&$country="+$('#tempCountry').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.filterList;
										response($.map(rec, function(item) {
													return {														
														label : item.value,														
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
							if (!isEmpty(data.value))
							{
								$('#payerBankCode').val(data.value);
								$('#payerBankDesc').val(data.value);								
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.beneBankBranchSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/payerDrawBankBranchSeek.json?$sellerCode="+$('#sellerId').val()+"&$country="+$('#tempCountry').val()+"&$branch="+$('#payerBankCode').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
											var rec = data.filterList;
											response($.map(rec, function(item) {
														return {														
															label : item.value,														
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
							if (!isEmpty(data.value))
							{
								$('#payerBranchDesc').val(data.value);
								$('#payerBranchCode').val(data.value);
							}
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					focus:function(event,ui){
					var item=ui.item;
					 $(".ui-autocomplete > li").attr("title", item.value);
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.BankBranchAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
							url : "services/userseek/drwMandEntryDrawerbank.json?$top=20&$filtercode1="+$('#tempCountry').val()+"&$filtercode2="+$('#sellerCode').val(),
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.BANKDESCRIPTION,
														value : item.BANKCODE,
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
							
							if (!isEmpty(data.BANKCODE))
								$('#payerBankCode').val(data.BANKCODE);
																
							if (!isEmpty(data.BRANCHCODE))
								$('#payerBranchCode').val(data.BRANCHCODE);
								$('#payerBranchDesc').val(data.BRANCHDESCRIPTION);								
						}
					}					
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.value
					+ '</ul><ul>'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
//Used for Bene Branch Description
jQuery.fn.BankByNameAutoComplete = function() {
	
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url :'services/userseek/beneBranchSeek.json',
									dataType : "json",
									type:'POST',
									data : {
										$top:20,
										$filtercode1:$('#sellerId').val(),
										$autofilter : request.term,
										$filtercode2 : $('#bankIdType').val()
										? $('#bankIdType').val() :'BIC',
										$filtercode3 : ''
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
							if (!isEmpty(data.BANKCODE))
							{
								$('#payerBankCode').val(data.BANKCODE);
							}							
							if (!isEmpty(data.BRANCHCODE))
								$('#payerBranchCode').val(data.BRANCHCODE);								
							if (!isEmpty(data.BRANCHDESCRIPTION))								
								$('#payerBranchDesc').val(data.BRANCHDESCRIPTION);
							if (!isEmpty(data.ROUTINGNUMBER))
								$('#bankSearchText').val(data.ROUTINGNUMBER);							
						//	setDefaultBeneCountry();
							}
						resetBeneficiaryBankDetails();	
					},
					open : function() {
					},
					close : function() {
					},
					focus:function(event,ui){
					$(".ui-autocomplete > li").attr("title", ui.item.label+' | '+ui.item.bankDesc);	
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.label + ' | '+
					+ '</ul><ul">'
					+ item.bankDesc + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.BeneReceiverCountryAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/country.json?",
									dataType : "json",
									type:'POST',
									data : {
										$top:10,
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DESCRIPTION,
														value : item.CODE
													}
												}));
									}
								});
					},
					minLength : 1
					});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.value
					+ '</ul><ul  >'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function persistBeneficiaryBankDetails() {
	objOldBeneDetails['bankIdType'] = $('#bankIdType').val();
	objOldBeneDetails['payerBankCode'] = $('#payerBankCode').val();
	objOldBeneDetails['payerBranchCode'] = $('#payerBranchCode').val();
	//objOldBeneDetails['payerAddress2'] = $('#payerAddress2').val();
	objOldBeneDetails['payerBranchDesc'] = $('#payerBranchDesc').val();
	//objOldBeneDetails['payerBankDesc'] = $('#payerBankDesc').val();
	objOldBeneDetails['bankSearchText'] = $('#bankSearchText').val();	
}

function clearReceiverBankDetails(){
	//persistBeneficiaryBankDetails();
	$('#bankSearchText').val('');
	$('#payerBranchDesc').val('');
	$('#payerBranchCode').val('');
	$('#payerBankCode').val('');
	//isReceiverBankIDSelected = false;
	//clearBankDetails('RECEIVER_BANK_ID');
}
function resetBeneficiaryBankDetails() {
	objOldBeneDetails = {};
}

function validateAndPaintReceiverBankIDsErrors(){
	var arrError = new Array();
	
	doBankIDValidation($('#bankIdType').val(), $('#bankSearchText').val(), arrError, 'Receiver');
	//Following fields are not being used in current implementation hence commented.
	//doBankIDValidation('BIC', $('#corrBankBic').val(), arrError, 'Corrospondent');
	//doBankIDValidation('BIC', $('#intBankBic').val(), arrError, 'Intermediatory' );
	
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strErrorCode = error.errorCode || error.code;
					strMsg = !isEmpty(strErrorCode) ? strErrorCode : '';
					if (!isEmpty(strMsg))
						strMsg += ' : ';
					strMsg += error.errorMessage;
					if (!isEmpty(strErrorCode)) {
						$('#errorDiv').empty();
						element = $('<p>').text(error.errorMessage);
						element.appendTo($('#' + strTargetDivId));
						$('#' + strTargetDivId + ', #messageContentDiv')
								.removeClass('hidden');
					}
				});

	} else {
		$('#messageArea').empty();
		$('#' + strTargetDivId + ', #messageContentDiv').addClass('hidden');
	}

	if(arrError.length > 0)
		return true;
	else 
		return false;
}
function doBankIDValidation(bankIDType, bankId, arrError, field) {
	
	var strBankIdType = null;
	var strBankID = null;
	var strValidationFlag = null;
	strBankIdType = bankIDType;
	strBankID = bankId;
	if (true) {
		if (!isEmpty(strBankID)) {
			switch (strBankIdType) {
				case 'FED' :
					strValidationFlag = isValidFedAba(strBankID);
					if (false === strValidationFlag)
						arrError.push({
							"errorCode" : field+" Bank ID",
							"errorMessage" : "ABA Routing number validation failed"
						});
					break;
				case 'BIC' :
					strValidationFlag = isValidBIC(strBankID);
					if (false === strValidationFlag)
						arrError.push({
							"errorCode" : field+" Bank ID",
							"errorMessage" : "BIC Routing number validation failed"
						});
					break;
				case 'ACH' :
					strValidationFlag = isValidCHIPSUID(strBankID);
					if (false === strValidationFlag)
						arrError.push({
							"errorCode" : field+" Bank ID",
							"errorMessage" : "CHIPS UID Routing number validation failed"
						});
					break;
				case 'ACHA' :
					strValidationFlag = isValidFedAba(strBankID);
					if (false === strValidationFlag)
						arrError.push({
							"errorCode" : field+" Bank ID",
							"errorMessage" : "FED ACH Routing number validation failed"
						});
					break;	
				default :
					break;
			}
		}

	}
	
}
function isValidFedAba(strRelatedID) {
	var bReturnCode = true;
	var iAbaTotal = 0;
	var iAbaCheckDigit = 0;
	var rt9digit = new RegExp(/^\d{9}$/);
	if (strRelatedID.search(rt9digit) != -1) {
		var abaCheckDigit;

		var abaNumber = parseFloat(strRelatedID);
		abaCheckDigit = computeFedABACheckDigit(strRelatedID.substr(0, 8)) + "";
		if (bReturnCode == true) {
			if (strRelatedID.substr(8, 1) != abaCheckDigit) {
				bReturnCode = false;
			}
		}
	} else {
		bReturnCode = false;
	}

	return bReturnCode;
}

function isValidBIC(strRelatedID) {
	if( strRelatedID != '%')
	{
	var bReturnCode = false;
	var iLength = strRelatedID.length;
	if ((iLength === 8) || (iLength === 11)) {
		for (var i = 0; i < iLength; i++) {
			var iDigit = strRelatedID.substr(i, 1);
			var alnumRegex = /^[0-9a-zA-Z]+$/;
			if (alnumRegex.test(iDigit)) {
				bReturnCode = true;
			} else {
				bReturnCode = false;
				break;
			}
		}
	}
	return (bReturnCode);
	}
	else
		return true;	
}

function isValidCHIPSUID(strRelatedID) {
	var bReturnCode = false;
	var iLength = strRelatedID.length;
	if (iLength === 6) {
		for (var i = 0; i < iLength; i++) {
			var iDigit = parseInt(strRelatedID.substr(i, 1), 10);
			var intRegex = /^\d+$/;
			if (intRegex.test(iDigit)) {
				bReturnCode = true;
			} else {
				bReturnCode = false;
				break;
			}
		}

	}

	return (bReturnCode);

}

function computeFedABACheckDigit(strRelatedID) {
	var bReturnCode = true;
	var iAbaTotal = 0;
	var iAbaCheckDigit = 0;
	var abaCheckDigit = 0;

	for (var iAbaIndex = 0; iAbaIndex < 8 && bReturnCode == true; iAbaIndex++) {
		var iDigit = parseInt(strRelatedID.substr(iAbaIndex, 1), 10);

		switch (iAbaIndex % 3) {
			case 0 :
				iAbaTotal += iDigit * 3;
				break;
			case 1 :
				iAbaTotal += iDigit * 7;
				break;
			case 2 :
				iAbaTotal += iDigit * 1;
				break;
		}
	}

	iAbaCheckDigit = iAbaTotal % 10;

	if (iAbaCheckDigit != 0) {
		iAbaCheckDigit = 10 - iAbaCheckDigit;
	}
	return iAbaCheckDigit;
}

function clientChange(frmId) 
{
	var frm = document.getElementById(frmId);
	frm.action = "addDrawerMaster.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function getLabel(key, defaultText) {
	return (paymentLabelsMap)
			? (paymentLabelsMap[key] ? paymentLabelsMap[key] : defaultText)
			: defaultText
}




function toggleRadioAcctIban(value,payerAcctNmbr)
{
	if(value == 'I')
	{
		$("#ibanFlagLbl").addClass("required");
		$("#ibanOrAcctFlag").val('I');
		$('#bankAcTypeLbl').removeClass("required");	
	}
	else
	{
		$("#ibanFlagLbl").removeClass("required");
		$("#ibanOrAcctFlag").val('A');
		if($('#payerAcctNmbr').val().length > 0){
			$('#bankAcTypeLbl').addClass("required");
		}else{
			$('#bankAcTypeLbl').removeClass("required");
		}
		$('#bankSearchText').attr('disabled', false);
		$('#payerBranchDesc').attr('disabled', false);		
	}
	if(!isEmpty($('#clientId').val()) && isEmpty(payerAcctNmbr)){
		populateBankIds();
	}
	if(isEmpty(payerAcctNmbr)){
		clearReceiverBankDetails();		
		resetIbanFields();
	}
}

function populateIbanDetails() {	
	if($("#iban").is(":checked") && $("#payerAcctNmbr").val() != ""){
		 $('#errorDiv').empty();
		 $('#messageArea').empty();	
		 $('#messageArea, #messageContentDiv').addClass('hidden');
		 $.ajax({
			url : './services/receivabledetail/ibandetails/'+$("#payerAcctNmbr").val()+'.json',
			data : {
				"sellerId": $('#sellerId').val()
			},
			method : 'GET',
			success : function(responseData) {
				var isError =  false;
				var errorMsg = "";
				if(responseData.systemAllowValidate)
				{
					$('#bankSearchText').attr('disabled', true);
					$('#payerBranchDesc').attr('disabled', true);
					if(responseData.valid){
						var bicNumber = responseData.bic;
						var bank = responseData.bank;
						var branch = responseData.branch;
						$("#bankSearchText").val(bicNumber);
						populateIbanResponse(bicNumber,bank,branch);					
					}else{
						isError = true;
						$('#payerBranchDesc').val("");
						$('#payerBranchCode').val("");
						$("#payerBankCode").val("");
						$("#bankSearchText").val("");
						if(responseData.errors){
							$( responseData.errors ).each(function( index ) {
							  errorMsg = errorMsg + "<p>"+responseData.errors[index]+"</p>";
							});
						}											
					}
					if(isError){
						$('#errorDiv').empty();
						$('#messageArea').empty();
						$('#messageArea').append(errorMsg);
						$('#messageArea, #messageContentDiv')
							.removeClass('hidden');
					}
				}else
				{
					$('#bankSearchText').attr('disabled', false);
					$('#payerBranchDesc').attr('disabled', false);
					$('#payerBranchDesc').val("");
					$('#payerBranchCode').val("");
					$("#payerBankCode").val("");
					$("#bankSearchText").val("");
					console.log("System not allow to validate IBAN");		
				}				
			}
		});
	}else{		
		$('#bankSearchText').val("");
		$('#payerBranchDesc').val("");
		$('#payerBranchCode').val("");
		$("#payerBankCode").val("");
		$('#bankSearchText').attr('disabled', false);
		$('#payerBranchDesc').attr('disabled', false);
	}
}

function populateIbanResponse(bicNumber,bank,branch) {
	$.ajax({
		url : 'services/userseek/drwMandEntryDrawerbank.json',
		data : {
			$top : 20,
			$filtercode1 : $('#sellerId').val(),
			$autofilter : bicNumber,
			$filtercode2 : $('#bankIdType').val()
					? $('#bankIdType').val() :'BIC',
			$filtercode3 : ''
		},
		method : 'POST',
		success : function(responseData) {
			var rec = responseData.d.preferences;
			if (rec.length > 0) {
				$.map(rec, function(item) {
					var data = item;
					if (data) {
						$('#payerBankCode').attr("disabled", "true");
						isReceiverBankIDSelected = true;
						
						if (!isEmpty(data.BANKCODE)) {
							$('#payerBankCode').val(data.BANKCODE);
							//$('#payerBankDesc').val(data.BANKDESCRIPTION);
						}
						if(!isEmpty(data.ROUTINGNUMBER)){
							$('#bankId').val(data.ROUTINGNUMBER);
							$('#payerSearchText').val(data.ROUTINGNUMBER);
						}	
						if (!isEmpty(data.BRANCHCODE))
							$('#payerBranchCode').val(data.BRANCHCODE);
						if (!isEmpty(data.BRANCHDESCRIPTION))
							$('#payerBranchDesc').val(data.BRANCHDESCRIPTION);
						//if (!isEmpty(data.ADDRESS))
						//	$('#payerAddress2').val(data.ADDRESS);					
					}
					resetBeneficiaryBankDetails();
				});				
			}
			else
			{
				$('#payerBranchDesc').val("");
				$('#payerBranchCode').val("");
				$("#payerBankCode").val("");
				$("#bankSearchText").val("");
				$('#errorDiv').empty();
				$('#messageArea').empty();
				$('#messageArea').append("BIC ("+bicNumber+") not present in the system for bank ("+bank+") and branch ("+branch+")");
				$('#messageArea, #messageContentDiv')
					.removeClass('hidden');
			}
		}
	});
}

function resetIbanFields(){
	if($("#iban").is(":checked")){
		$('#bankSearchText').val("");
		$('#payerBranchDesc').val("");
		$('#payerBranchCode').val("");
		$("#payerBankCode").val("");
		$('#payerAcctNmbr').val("");
	}	
}
