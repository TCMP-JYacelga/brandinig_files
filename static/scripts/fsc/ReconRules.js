function getEnrichments(frmId,recKey,crt)
{
	
	var frm = document.getElementById(frmId);
	if(recKey != null && recKey != '')
	{
		document.getElementById("collectProduct").value = crt.val();
		frm.action = "invoiceRules_enrich.form";
	}
	else
	{
		frm.action = "newinvoiceReconRule.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

//function showAddNewRuleForm(frmId)
//{
//	var frm = document.getElementById(frmId);
//	frm.action = "newinvoiceReconRule.form";
//	frm.target = "";
//	frm.method = "POST";
//	frm.submit();
//}
//
function addNewReconRule(frmId, strUrl)
{
	$(':input').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function populateFields(crt)
{
	if(crt.value == 'N')
	{
		$('#inpInvoiceField').val('T');
		$('#inpFieldName').val('Invoice Amount');
		$('#inpFieldName').removeClass('hidden');
		$('#inpFieldNameEnrich').addClass('hidden');
		$('#inpOperator').val('=');
		$('#receiptField').removeClass('hidden');
		$('#inpReceiptField').val('T');
		$('#fieldName').removeClass('hidden');
		$('#inpRFieldName').removeClass('hidden');
		$('#fieldNameText').addClass('hidden');
		$('#inpRFieldNameEnrich').addClass('hidden');
		$('#inpRFieldNameText').addClass('hidden');
		$('#inpRFieldName').val('Receipt Amount');
		$('#inpInvoiceField').attr("disabled","disabled");
		$('#inpFieldName').attr("disabled","disabled");
		$('#inpOperator').attr("disabled","disabled");
		$('#inpReceiptField').attr("disabled","disabled");
		$('#inpRFieldName').attr("disabled","disabled");
	}
	else
	{
		$('#inpInvoiceField').removeAttr("disabled");
		$('#inpFieldName').val("");
		$('#inpFieldName').removeAttr("disabled");
		$('#inpOperator').val("");
		$('#inpOperator').removeAttr("disabled");
		$('#txtFixedValue').val("");
		$('#txtFactor').val("");
		$('#inpReceiptField').removeAttr("disabled");
		$('#inpRFieldName').val("");
		$('#inpRFieldName').removeAttr("disabled");
		if($('#inpReceiptField').val() == 'T')
		{
			$('#fieldNameText').addClass('hidden');
			$('#inpRFieldName').removeClass('hidden');
			$('#inpRFieldNameEnrich').addClass('hidden');
			$('#inpRFieldNameText').addClass('hidden');
		}
		else
		{
			$('#fieldNameText').addClass('hidden');
			$('#inpRFieldNameEnrich').removeClass('hidden');
			$('#inpRFieldName').addClass('hidden');
			$('#inpRFieldNameText').addClass('hidden');
		}
	}
	$('select').niceSelect('update');
	$('#inpMatchType-niceSelect').focus();	
}

function deleteRuleDetail(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDetailRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function clientChanged(client)
{
	var frm = document.getElementById("frmMain");
	$('#clientCode').val(client);
	$(":input").removeAttr('disabled');
	frm.action = "newinvoiceReconRule.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function reloadOnPackageChange(data)
{
	//var scmProduct = $('#scmMyProductCode option:selected').attr('scmProductCode');
	//$("#scmProductCode").val(scmProduct);
	var frm = document.getElementById("frmMain");
	$(":input").removeAttr('disabled');
	$('#scmMyProductCode').val(data.CODE);
	$("#scmProductCode").val(data.SCMPRD);
	frm.action = "newinvoiceReconRule.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function verifyReconRule(frmId, strUrl)
{
	$(':input').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function submitReconRule(frmId, strUrl)
{
	$(':input').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getRejectPopupNew(strUrl, frmId, rowIndex) {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		close: function() {$("#rejectCheck"+rowIndex).attr("checked", false);},
		buttons : {
				"Ok" : function() {
					rejectRecord(strUrl, frmId, rowIndex);
				},
				"Cancel" : function() {				
					$("#rejectCheck"+rowIndex).attr("checked", false);
					$(this).dialog("close");
					}
		}
	});
	$('#rejectPopup').dialog("open");
}
//function rejectRecord(strUrl, frmId, rowIndex)
//{
//	var frm = document.getElementById(frmId);
//	document.getElementById("txtRecordIndex").value = rowIndex;
//	document.getElementById("txtTermRejectRemark").value = $('#txtAreaRejectRemark').val();	
//	frm.action = strUrl;
//	frm.target = "";
//	frm.method = "POST";
//	frm.submit();
//}
//
//function discardRecord(strUrl, frmId, rowIndex)
//{
//	var frm = document.getElementById(frmId);
//	document.getElementById("txtRecordIndex").value = rowIndex;
//	frm.action = strUrl;
//	frm.target = "";
//	frm.method = "POST";
//	frm.submit();
//}

function getHistoryPageInfo(strUrl, frmId, rowIndex)
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

function enableRuleDetailEdit(rowIndex)
{
	if($("#matchType"+rowIndex))
	{
		$('#matchType'+rowIndex).removeAttr("disabled");
	}	
	if($("#invoiceField"+rowIndex))
	{
		$('#invoiceField'+rowIndex).removeAttr("disabled");
	}	
	if($("#fieldName"+rowIndex))
	{
		$('#fieldName'+rowIndex).removeAttr("disabled");
		$('#fieldName1'+rowIndex).removeAttr("disabled");
	}	
	//if($("#tolerance"+rowIndex))
	if($("#fixedValue"+rowIndex))
	{
		/*var value = $("#tolerance"+rowIndex).text();
		$("#tolerance"+rowIndex).after('<input id="txtRTolerance'+rowIndex+'" name="txtRTolerance'+rowIndex+'" class=""  value="'+value+'"/>');
		$("#tolerance"+rowIndex).addClass('hidden');*/
		var value = $("#fixedValue"+rowIndex).text();
		$("#fixedValue"+rowIndex).after('<input id="txtRFixedValue'+rowIndex+'" name="txtRFixedValue'+rowIndex+'" class="amountBox" align="middle"  value="'+value+'"/>');
		$("#fixedValue"+rowIndex).addClass('hidden');
	}
	if($("#pm"+rowIndex))
	{
	  $('#pm'+rowIndex).removeAttr("disabled");
	}
	if($("#factor"+rowIndex))
	{	
		var value = $("#factor"+rowIndex).text();
		$("#factor"+rowIndex).after('<input id="txtRFactor'+rowIndex+'" name="txtRFactor'+rowIndex+'" class="amountBox" align="middle" value="'+value+'"/>');
		$("#factor"+rowIndex).addClass('hidden');
		enableDisableToleranceEdit(rowIndex);
	}	
	if($("#operator"+rowIndex))
	{
		$('#operator'+rowIndex).removeAttr("disabled");
	}	
	if($("#receiptField"+rowIndex))
	{
		$('#receiptField'+rowIndex).removeAttr("disabled");
	}	
	if($("#receiptFieldName"+rowIndex))
	{
		$('#receiptFieldName'+rowIndex).removeAttr("disabled");
		$('#receiptFieldName1'+rowIndex).removeAttr("disabled");
	}
	/*if($("#mT${row.rowIndex}"+rowIndex))
	{
		$('#matchType'+rowIndex).removeAttr("disabled");
	}	
	if($("#invoiceField"+rowIndex))
	{
		$('#invoiceField'+rowIndex).removeAttr("disabled");
	}	
	if($("#fieldName"+rowIndex))
	{
		$('#fieldName'+rowIndex).removeAttr("disabled");
		$('#fieldName1'+rowIndex).removeAttr("disabled");
	}	
	if($("#tolerance"+rowIndex))
	{
		var value = $("#tolerance"+rowIndex).text();
		$("#tolerance"+rowIndex).after('<input id="txtRTolerance'+rowIndex+'" name="txtRTolerance'+rowIndex+'" class=""  value="'+value+'"/>');
		$("#tolerance"+rowIndex).addClass('hidden');
		enableDisableToleranceEdit(rowIndex);
	}	
	if($("#operator"+rowIndex))
	{
		$('#operator'+rowIndex).removeAttr("disabled");
	}	
	if($("#receiptField"+rowIndex))
	{
		$('#receiptField'+rowIndex).removeAttr("disabled");
	}	
	if($("#receiptFieldName"+rowIndex))
	{
		$('#receiptFieldName'+rowIndex).removeAttr("disabled");
		$('#receiptFieldName1'+rowIndex).removeAttr("disabled");
	}*/
	$("#cancelRuleDetail"+rowIndex).removeClass('hidden');
	$("#saveRuleDetail"+rowIndex).removeClass('hidden');
	$("#editRuleDetail"+rowIndex).addClass('hidden');	
}

function disableRuleDetailEdit(strUrl, frmId, rowIndex)
{
	$("#cancelRuleDetail"+rowIndex).addClass('hidden');
	$("#saveRuleDetail"+rowIndex).addClass('hidden');
	$("#editRuleDetail"+rowIndex).removeClass('hidden');
	$('#matchType'+rowIndex).attr("disabled", "true");
	$('#invoiceField'+rowIndex).attr("disabled", "true");
	$('#fieldName'+rowIndex).attr("disabled", "true");
	$('#fieldName1'+rowIndex).attr("disabled", "true");
	/*$("#txtRTolerance"+rowIndex).remove();
	$("#tolerance"+rowIndex).removeClass('hidden');*/
	$("#txtRFixedValue"+rowIndex).remove();
	$("#fixedValue"+rowIndex).removeClass('hidden');
	$("#txtRFactor"+rowIndex).remove();
	$("#factor"+rowIndex).removeClass('hidden');
	$('#pm'+rowIndex).attr("disabled", "true");
	$('#operator'+rowIndex).attr("disabled", "true");
	$('#receiptField'+rowIndex).attr("disabled", "true");
	$('#receiptFieldName'+rowIndex).attr("disabled", "true");
	$('#receiptFieldName1'+rowIndex).attr("disabled", "true");
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changeInvoiceFieldNames()
{
	document.getElementById("iField").value = $('#inpInvoiceField').val();
	var v = document.getElementById("iField").value;
	$('#inpOperator').removeAttr("disabled");
	$('#inpReceiptField').removeAttr("disabled");
	$('#inpRFieldName').removeAttr("disabled");
	if($('#inpInvoiceField').val() == 'E')
	{
	 $("#inpFieldNameEnrich").removeClass('hidden');
	 $("#inpFieldName").addClass('hidden');
	}
	else
	{
	 $("#inpFieldNameEnrich").addClass('hidden');
	 $("#inpFieldName").removeClass('hidden');
	}
	$("#inpFieldNameEnrich,#inpFieldName,#inpOperator,#inpReceiptField,#inpRFieldName").niceSelect('update');
}

function changeReceiptFieldNames()
{
	if($('#inpReceiptField').val() == 'E')
	{
	 $("#inpRFieldNameEnrich").removeClass('hidden');
	 $("#inpRFieldName").addClass('hidden');
	}
	else
	{
	 $("#inpRFieldNameEnrich").addClass('hidden');
	 $("#inpRFieldName").removeClass('hidden');
	}
	$("#inpRFieldNameEnrich,#inpRFieldName").niceSelect('update');
}

function enableDisableTolerance() {
	if ($('#inpMatchType').val() === 'N'
			&& $('#inpFieldName').val() == 'Invoice Amount'
			&& $('#inpOperator').val() === '=') {
		$('#txtFixedValue').removeAttr("disabled");
		$('#inpPm').removeAttr("disabled");
		$('#txtFactor').removeAttr("disabled");
	} else {
		$('#txtFixedValue').val('').attr("disabled", "true");
		$('#inpPm').val('+').attr("disabled", "true");
		$('#txtFactor').val('').attr("disabled", "true");
	}
	$('#inpPm').niceSelect('update');
}

function changeInvoiceFieldNamesEdit(rowIndex)
{
	document.getElementById("iField").value = $('#invoiceField'+rowIndex).val();
	var v = document.getElementById("iField").value;
	if($('#invoiceField'+rowIndex).val() == 'E')
	{
		$("#fieldName"+rowIndex).removeClass('hidden');
		$("#fieldName1"+rowIndex).addClass('hidden');	
	}
	else
	{
		$("#fieldName"+rowIndex).addClass('hidden');
		$("#fieldName1"+rowIndex).removeClass('hidden');		
	}
}

function changeReceiptFieldNamesEdit(rowIndex)
{
	if($('#receiptField'+rowIndex).val() == 'E')
	{
	 $('#receiptFieldName'+rowIndex).removeClass('hidden');
	 $('#receiptFieldName1'+rowIndex).addClass('hidden');
	}
	else
	{
		$('#receiptFieldName'+rowIndex).addClass('hidden');
		$('#receiptFieldName1'+rowIndex).removeClass('hidden');
	}
}
function setVal(crt)
{
	if(crt.value == 'Invoice Amount')
		{
			$('#inpOperator').val('=');
			$('#inpOperator').attr("disabled","true").niceSelect('update');
		}
	populateReceiptFieldName();
	$('#inpFieldName-niceSelect').focus();
}
function setValForPayer(crt)
{
	if(crt.value === 'Payer')
	{
		$('#inpRFieldName').removeClass('hidden');
		$('#inpRFieldNameEnrich').addClass('hidden');
		$('#inpRFieldNameText').addClass('hidden');
		$('#inpRFieldName').val('Drawer');
		$('#inpRFieldName').attr("disabled","true");
		$('#inpOperator').val('=');
		$('#inpOperator').attr("disabled","true");
		$('#inpReceiptField').val('T');
		$('#inpReceiptField').attr("disabled","true");
	}
	else 
	{
		$('#inpRFieldName').removeAttr("disabled");
		$('#inpOperator').removeAttr("disabled");
		$('#inpReceiptField').removeAttr("disabled");
		if($('#inpReceiptField').val() === 'T')
		{
			$('#inpRFieldName').removeClass('hidden');
			$('#inpRFieldNameEnrich').val('').addClass('hidden');
			$('#inpRFieldNameText').val('').addClass('hidden');
		}
		else
		{
			$('#inpRFieldNameEnrich').removeClass('hidden');
			$('#inpRFieldName').val('').addClass('hidden');
			$('#inpRFieldNameText').val('').addClass('hidden');
		}
	}
	populateReceiptFieldName();
	$('#inpFieldName,#inpRFieldNameEnrich,#inpRFieldNameText,#inpRFieldName,#inpOperator,#inpReceiptField').niceSelect('update');
}
function populateReceiptFieldName()
{
	if($('#inpOperator').val() === 'F')
	{
		$('#fieldNameText').removeClass('hidden');
		$('#inpRFieldNameText').removeClass('hidden');
		$('#fieldName').addClass('hidden');
		$('#inpRFieldNameEnrich').addClass('hidden');
		$('#inpRFieldName').addClass('hidden');
		$('#receiptField').addClass('hidden');
		$('#fieldName,#inpRFieldNameEnrich,#inpRFieldName,#receiptField').val('').niceSelect('update');
	}
	else
	{
		$('#receiptField').removeClass('hidden');
		if($('#inpReceiptField').val() === 'T')
		{
			$('#fieldName').removeClass('hidden');
			$('#inpRFieldName').removeClass('hidden');
			$('#fieldNameText').val('').addClass('hidden');
			$('#inpRFieldNameEnrich').addClass('hidden');
			$('#inpRFieldNameText').val('').addClass('hidden');
			$('#inpRFieldNameEnrich').val('').niceSelect('update');
		}
		else
		{
			$('#fieldName').removeClass('hidden');
			$('#inpRFieldNameEnrich').removeClass('hidden');
			$('#fieldNameText').val('').addClass('hidden');
			$('#inpRFieldName').addClass('hidden');
			$('#inpRFieldNameText').val('').addClass('hidden');
			$('#inpRFieldNameEnrich,#inpRFieldName').val('').niceSelect('update');
		}
	}
	$('#inpFieldName,#inpRFieldNameEnrich,#inpRFieldNameText,#inpRFieldName,#inpOperator,#inpReceiptField').niceSelect('update');
	$('#inpOperator-niceSelect').focus();
}

function getDiscardConfirmationPopup(frmId, strUrl)
{
	$('#confirmDiscardPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
	});
	$('#confirmDiscardPopup').dialog("open");
	$('#confirmDiscardPopup').dialog("option","position","center");
	$('#cancelDiscardConfirmMsg').bind('click',function(){
		$('#confirmDiscardPopup').dialog("close");
	});

	$('#doneConfirmDiscardbutton').bind('click',function(){
		discardReconRule(strUrl,frmId,1);
	});
	$('#textContent').focus();
}
function discardReconRule(strUrl, frmId, index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goToBack(frmId, strUrl, strUrlSave)
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
function addNewSCMProduct(frmId, strUrl)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}
function getConfirmationPopup(frmId, strUrl, strUrlSave)
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
								$('#clientCode').val(data.CODE);
								$('#clientId').val(data.CODE);
								clientChanged(data.CODE);
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

jQuery.fn.reconRuleScfPackageAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/reconRulesProductseek.json",
									type: "POST",
									dataType : "json",
									data : {
										$filtercode1 :strClientCode,
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,	
														code: item.CODE,
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
								reloadOnPackageChange(data);
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
			var titleText= item.code + ' | '+item.label ;
			var inner_html = '<a title="'+titleText+'"><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.code +' | '+ item.label +'</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
jQuery.fn.reconRuleCollectionProductAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/reconRulesCollectionProductseek.json",
									type: "POST",
									dataType : "json",
									data : {
										$filtercode1 :strClientCode,
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,	
														code: item.CODE,
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
								$('#collectionProduct').val(data.CODE);
								enableLimitMatching($('#collectionProduct'));
								getEnrichments('frmMain',strRecKey,$('#collectionProduct'))
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
			var titleText= item.code + ' | '+item.label ;
			var inner_html = '<a title="'+titleText+'"><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.code +' | '+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};