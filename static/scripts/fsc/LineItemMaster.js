function clientChanged(client, desc)
{
	var frm = document.getElementById("frmMain");
	$('#clientCode').val(client);
	$(":input").removeAttr('disabled');
	frm.action = "invLineItemEntry.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	
}
function goToThePage(strUrl)
	{
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		$(":input").removeAttr('disabled');
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
function getHistory(strUrl, frmId, invoiceNumber) {
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = invoiceNumber;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop = (screen.availHeight - 300) / 2;
	var intLeft = (screen.availWidth - 600) / 2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=300";
	window.open("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function editLineitem(strUrl,frmId,index,recIdentifier)
{
	$('#lineItemType').removeAttr("disabled");
	$('#lineItemCode').removeAttr("disabled");
	
	var frm = document.getElementById(frmId);
	document.getElementById("txtLineItemIndex").value = index;
	document.getElementById("clientCode").value = selectedFilterClient;//document.getElementById("txtLineInvoiceClientCode").value;
	
	var productCode=scmProductCode;//$('#mypProduct').val();
	$('#txtProductCode').val(productCode);
	$('#mypFilterProduct').val(productCode);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addLineItem(strUrl, frmId,productCode) 
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtLineItemIndex").value = productCode;	
	document.getElementById("clientCode").value = selectedFilterClient;
	$('#mypFilterProduct').val(productCode);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewInvoiceData(strUrl, frmId, index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(checkBox,strUrl, frmId, index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = index;
	var element=document.createElement("hidden");
	element.setAttribute("name","checkvalue");
	if(checkBox.checked==true)
	{
		element.value="true";
	}
	else if(checkBox.checked==false)
	{
		element.value="false";
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRejectRecord(strUrl, frmId, index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = index;
	document.getElementById("rejectRemark").value =$('#txtAreaRejectRemark').val() ;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function discardLineItem(strUrl, frmId, index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function rejectRecord(strUrl, frmId, index)
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 473,
		modal : true,
		close: function() {$("#rejectCheck"+index).attr("checked", false);},
		buttons : {
				"OK" : function() 
				{
					acceptRejectRecord(strUrl, frmId, index);
				},
				"CANCEL":function() 
				{
					$("#rejectCheck"+index).attr("checked", false);
					$(this).dialog("close");
				}
		}
		
	});
	$('#rejectPopup').dialog("open");
}
function filterLineItem(strUrl,frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function enableDisableLineItem(checkBox,strUrl, frmId, index)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtInvIntRefNum").value = index;
	document.getElementById("txtCheckboxValue").value = checkBox.checked;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function messagePopup() {
	$('#messagePopup').dialog( {
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
		/*buttons : {
				"Ok" : function() {
					$(this).dialog('close');
				}
		}*/
	});
	$('#messagePopup').dialog('open');
}
/* javascript for LineItemList.jsp  */
function addMasterLineItem()
{
	$('#lineItemCode').removeAttr("disabled");
	$('#lineItemType').removeAttr("disabled");
	$('#lineItemDesc').removeAttr("disabled");
	var productCode=$('#mypProduct').val();
	$('#lineItemCode').val("");
	$('#lineItemType').val("");
	$('#lineItemDesc').val("");
	if(doButtonDisabled()!=true)
	AddLineItemMasterPopup(scmProductCode);
}

function EditLineItemMaster(lineCode,lineType,lineDesc,index,identifier)
{
	$('#lineItemCode').val(lineCode);
	$('#lineItemType').val(lineType);
	$('#lineItemDesc').val(lineDesc);
	$('#recIdentifier').val(identifier);
	
	
	$('#lineItemCode').attr("readOnly","true");
	$('#lineItemType').attr("disabled","true");
	EditLineItemMasterPopup(index);
}

function viewInvoiceMasterLineItem(lineCode,lineType,lineDesc)
{
	$('#lineItemCode').val(lineCode);
	$('#lineItemType').val(lineType);
	$('#lineItemDesc').val(lineDesc);
	$('#lineItemCode').attr("disabled", "true");
	$('#lineItemType').attr("disabled", "true");
	$('#lineItemDesc').attr("disabled", "true");
	InvoiceLineItem();
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}

function getConfirmationPopup(frmId, strUrl)
{
	if($("#dirtyBit").val()>0){
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
	}else{
		goToThePage('invoiceLineItemsList.form');
	}
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

	$('#cancelDiscardConfirmMsg').bind('click',function(){
		$('#confirmDiscardPopup').dialog("close");
	});

	$('#doneConfirmDiscardbutton').bind('click',function(){
		discardLineItem('discardInvoiceLineItem.form','frmMain',1);
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
								clientChanged(data.CODE, data.DESCR);
							}
							//doProductDisabled();
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
/* javascript for LineItemList.jsp ends */

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