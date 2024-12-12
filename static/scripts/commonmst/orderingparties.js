function getRecord(json, elementId)
{
	 var myJSONObject = JSON.parse(json);
	 var inputIdArray = elementId.split("|");
	 for (i = 0; i < inputIdArray.length; i++) 
	 {
	   var field = inputIdArray[i];
	   if (document.getElementById(inputIdArray[i])) 
	   {
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

function setValueTo(element,setEleId){
	var value = 	element.value;
	$('#'+setEleId).val(value);
}

function changeCountry(strUrl) {
	var frm = document.forms["frmMain"];
	$('#benState').val('');
	$('#benCity').val('');
	$('#benPostCode').val('');
	enableDisableForm(false);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function submitForm(strUrl) {
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableDisableForm(boolVal) {
	$('#sellerId').attr('disabled', boolVal);
	$('#clientId').attr('disabled', boolVal);
	$('#orderCode').attr('disabled', boolVal);
}

/*function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
		showList(strUrl);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if(dirtyBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				height : 230,
				width : 430,
				modal : true,
				draggable: false,
				buttons : buttonsOpts
			});
	$('#confirmMsgPopup').dialog("open");
	}
	else
	{
		showList(strUrl);
	}
}*/

function getCancelConfirmPopUp(strUrl) {
	_objDialog = $('#confirmMsgPopup');
	_objDialog.dialog({
				autoOpen : false,
				height : 230,
				width : 430,
				modal : true,
				draggable: false,
				resizable : false,
				buttons :[{
						text : "Ok" ,
						tabindex :1,
						id: 'okBtn',
						click : function() {
							$(this).dialog("close");
							showList(strUrl);							
						},
						blur : function()
						{ 
							$("#cancelBtn").focus();
						}
					},
					{
						text  : "Cancel",
						tabindex : 1,
						id: 'cancelBtn',
						click : function() {						
						$(this).dialog("close");
						},
						blur : function()
						{ 
							$("#okBtn").focus();							
						}
					}]
	});
	if(dirtyBitSet)
	{
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');	
	$("#cancelBtn").focus();	
	}
	else
	{
		showList(strUrl);
	}
	
};

function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();	
}
function showListBack(strUrl)
{
	var frm = document.forms["frmMain"];
	if (document.getElementById("orderCode") != null)
		document.getElementById("orderCode").value = '';
	document.getElementById("orderDescription").value = '';
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();	
}
function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	document.getElementById("orderCode").value="";
	document.getElementById("orderDescription").value="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();	
}

function showHistoryForm(strAction, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	if ("AUTH" == strAction)
		frm.action = "orderingPartiesAuthHistory.hist";
	else
		frm.action = "orderingPartiesHistory.hist";
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(index,mode)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	if(mode == "AUTH")
	strUrl = "authViewOrderingParties.form";
	else 
	strUrl = "viewOrderingParties.form";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();	
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	document.getElementById("txtCurrent").value = '';
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	document.getElementById("viewState").value;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(arrData, strRemarks)
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
		frm.txtIndex.value = arrData[0];
		frm.target = "";
		frm.action = "rejectOrderingParties.form";
		frm.method = 'POST';
		frm.submit();
	}
}
function discardRecord(arrData)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = arrData[1];
	frm.action = arrData[0];
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}
function btnClick(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function checkKey()
{
   if(window.event.keyCode == 13)
   {
   		var totalpage = document.getElementById("total_pages").value;
   		goPgNmbr(mode,totalpage);
   }
}

function populateState(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	frm.action = strUrl;	
	frm.method = "POST";
	frm.submit();
}

function resetDocumentId(pageLoad)
{
	if (pageLoad === 'N')
		document.getElementById("documentId").value = "";
	var documentType = $('#documentType').val();
	if (!(documentType == "" || documentType == "N")) {
		$('#documentIdLbl').addClass('required');
	} else {
		$('#documentIdLbl').removeClass('required');
	}
}

function showSwiftMsg(code)
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <50a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	refreshSwiftMsg(code);
}
function refreshSwiftMsg(code)
{
	var orderCode = document.getElementById("orderDescription");
	var add1 = document.getElementById("addr1");
	var benCountry = document.getElementById("benCountry");
	var benState = document.getElementById("benState");
	var benCity = document.getElementById("benCity");
	var benPostCode = document.getElementById("benPostCode");
	var line4;
	if (orderCode != null && orderCode.value !== "")
		document.getElementById("line1").value = orderCode.value.substring(0,35);
	else
		document.getElementById("line1").value = code;
	if (add1 != null && add1.value !== "")
	{
		document.getElementById("line2").value = add1.value.substring(0,35);
		document.getElementById("line3").value = add1.value.substring(35,70);
	}
	if (benCountry != null && benCountry.value !== "")
		line4 = benCountry.value.substring(0,10);
	if (benState != null  && benState.value != 'NONE')
		line4 = line4 + benState.value.substring(0,10);
	if (benCity != null && benCity.value !== "")
		line4 = line4 + benCity.value.substring(0,10);
	if (benPostCode != null && benPostCode.value !== "0")
		line4 = line4 + benPostCode.value.substring(0,10);
	if (line4 != null)
		document.getElementById("line4").value = line4.substring(0,35);
	$('#line1span').text($('#line1').val());
	$('#line2span').text($('#line2').val());
	$('#line3span').text($('#line3').val());
	$('#line4span').text($('#line4').val());
}

jQuery.fn.sellersClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/orderPartySeek/orderingPartyAdminClientList.json?$sellerId="+$('#sellerId').val(),
									type: "POST",
									dataType : "json",
									data : {
										qfilter : request.term
									},
									success : function(data) {
										var rec = data.filterList;
										response($.map(rec, function(item) {
													return {														
														label : item.name.concat( " | ", item.value),	
														value : item.value,													
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
							if (!isEmpty(data.name))
							{
								$('#clientId').val(data.name);
								$('#clientDesc').val(data.value);
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