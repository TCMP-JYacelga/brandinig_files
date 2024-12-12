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
						filter('frmMain');
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

jQuery.fn.clientAutoComplete= function() {
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
function applySortOnProduct(sortCol, sorOrd, colId)
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
		frm.action = "sortLcMyProductList.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}
function changePage(navType, newPage) 
{
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}	
	var curPage=$('.pcontrol input', this.pDiv).val();
	var totPage='<c:out value="${total_pages}"/>';
		
	switch(navType) 
	{
		case 'first':
			frm.action = 'lcMyProduct_first.form';
			break;
		case 'prev':
			frm.action = 'lcMyProduct_previous.form';
			break;
		case 'next':
		if(curPage==totPage)
				  return false;
			frm.action = 'lcMyProduct_next.form';
			break;
		case 'last':
			frm.action = 'lcMyProduct_last.form';
			break;
		case 'input':
			$('#page_number').val(curPage);
			frm.action = 'lcMyProduct_goto.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showAddNewProductForm(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "newLcMyProduct.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showBnkProd()
{
	var strValue = $('#productType option:selected').val();	
	if (isEmpty(strValue)) 
	{
		return;
	}	
	if (strValue == 'LC')
	{
		$('.sblc').attr("disabled","true");
		$('.gty').attr("disabled","true");
		$('#sblcId').hide();
		$('#gtyId').hide();
		$('#lcId').show();
		$('.lc').removeAttr("disabled");
	}
	if (strValue == 'SBLC')
	{
		$('.lc').attr("disabled","true");
		$('.gty').attr("disabled","true");
		$('#lcId').hide();
		$('#gtyId').hide();
		$('#sblcId').show();
		$('.sblc').removeAttr("disabled");
	}
	if (strValue == 'GTY')
	{
		$('.lc').attr("disabled","true");
		$('.sblc').attr("disabled","true");
		$('#lcId').hide();
		$('#sblcId').hide();
		$('#gtyId').show();
		$('.gty').removeAttr("disabled");
	}
}
function filter(frmId)
{
	if('0'==strEntity)
	 {
		if($('#txtLCMyClientDesc').val()== null || $('#txtLCMyClientDesc').val()=='')
		{
			$('#txtLCMyClientCode').val('');
		}
		else
		{
			if($('#txtLCMyClientCode').val()== null|| $('#txtLCMyClientCode').val()=='')
			{
				$('#txtLCMyClientCode').val($('#txtLCMyClientDesc').val());  
			}		  
		}
	 }
	var frm = document.getElementById(frmId);
	frm.action = "filterLcMyProductList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editProductData(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewProductData(strUrl, frmId, rowIndex)
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
function updateProductData(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 0;
	frm.action = "updateLCMyProductMaster.form";
	frm.target = "";
	frm.method = "POST";
	$('.disabled').removeAttr('disabled');
	frm.submit();
}
function addProductData(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "saveLCMyProductMaster.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function MakeTabActive(ctrlId, tabId, divId)
{
	if($("#"+tabId).hasClass('ui-state-active'))
	{
		return;
	}
	if($("#tab-1").hasClass('ui-state-active'))
	{
		$("#tab-1").removeClass('ui-state-active');
		$('#divTabs-1').hide();
	}
	if($("#tab-2").hasClass('ui-state-active'))
	{
		$("#tab-2").removeClass('ui-state-active');
		$('#divTabs-2').hide();
	}
	if($("#tab-3").hasClass('ui-state-active'))
	{
		$("#tab-3").removeClass('ui-state-active');
		$('#divTabs-3').hide();
	}	
	$("#"+tabId).addClass('ui-state-active');
	$("#"+divId).show();	
}
function goToBack(frmId, strUrl)
{
	if($('#dirtyBit').val()=="1")
	{	
		getConfirmationPopup(frmId, strUrl);
	}	
	else
    {	
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
    }	
}
function goBackToAuthCenter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "lcMyProductAuthList.form";
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
	document.getElementById("txtMyProductRejectRemark").value = $('#txtAreaRejectRemark').val();	
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
function getRejectPopupNew(checkBox,strUrl, frmId, rowIndex) {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
				"OK" : function() {
					rejectRecord(strUrl, frmId, rowIndex);
				},
				"Cancel" : function() {
					checkBox.checked = false;
					$('#txtAreaRejectRemark').val("");
					$(this).dialog("close");
					}
		}
	});
	$('#rejectPopup').dialog("open");
}
function checkApprFlag() {
	var autoApprFlag = document.getElementById('autoApprFlag');
	if (autoApprFlag.value == "Y")
	{
		$('#autoApprLimit').attr('disabled','true');
		if($('#lblApprLimit').hasClass('required'))
		{
		$('#lblApprLimit').removeClass('required');
		}
	}
	else
	{
		$('#autoApprLimit').removeAttr('disabled');
		$('#lblApprLimit').addClass('required');
	}
}
function messagePopup() 
{
	$('#messagePopup').dialog( {
		autoOpen : true,
		height : 150,
		width : 350,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');
				}
		}
	});
	$('#messagePopup').dialog('open');
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
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
function setClientDesc()
{
	$('#txtLCMyClientDesc').val($('#txtLCMyClientCode option:selected').text());
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