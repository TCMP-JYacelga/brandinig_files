function setItemCodeCurrency(item)
{
	var strValue = $('#lineCode option:selected').text();
	if (isEmpty(strValue)) 
	{
		return;
	}
	var pos = strValue.lastIndexOf("-");
	if (pos > -1) {
		var lineType = strValue.substring(pos+1, strValue.length);
		if (lineType == 'TI' || lineType == 'T' || lineType == 'F') 
		{
			document.getElementById("amountOperator").value="+";
		}
		else if(lineType == 'A')
		{
			document.getElementById("amountOperator").value="-";
		}
	}
}
function sectionCollapseExpandOnLoad()
{		
		if(!isEmpty($("#certType1").val()))
		{
			$("#title_CertificatesDtls").children('a').toggleClass("icon-expand-minus icon-collapse-plus");
			$("#title_CertificatesDtls").next().slideToggle("fast");
			if(!isEmpty($("#certType2").val()))
			{
				$("#moreCertOpts2").show();
			}
			if(!isEmpty($("#certType3").val()))
			{
				$("#moreCertOpts3").show();
			}
		}
		$("#moreOpts :input").each(function(){
			if(!isEmpty($(this).val()))
			{
				$("#moreOpts").show();
				return;
			}
		});
}
function showMoreActions(ctrl, divId) 
{
   	if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).show();
	$(ctrl).hide();
	return false;
}
function hideMoreActions(ctrl, divId,moreLink) 
{
    $("#" + divId).hide();
	$("#" + moreLink).show();
	return false;
}
function checkValue(balAmount)
{
	var enteredValue = $("#lineAmount").val();
	var op = $("#amountOperator").val();
}
function showActions(ctrl, divId) 
{
	if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).show();
	return false;
}
function hideActions(ctrl, divId) 
{
	if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).hide();
	return false;
}
function _alertLineResult(blnRet, fptrCallback, arrData1, arrData2, arrData3)
{
	_objDialog.dialog('destroy');
	fptrCallback(blnRet, arrData1, arrData2, arrData3);
}
function showLineAlert(intHeight, intWidth, strTitle, strMsg, fptrCallback, arrData1, arrData2, arrData3) 
{
	_objDialog = $("#alertDialog");
	$("#alertDialog").removeClass('hidden');
	$("#alertMsg").text(strMsg);
	_objDialog.dialog({bgiframe:true, autoOpen:false, height:intHeight, modal:true, resizable:false, width:intWidth,
					title: strTitle, buttons: {"Yes": function() {$(this).dialog("close"); _alertLineResult(true, fptrCallback, arrData1, arrData2, arrData3);},
					"No": function() {$(this).dialog("close"); _alertLineResult(false, fptrCallback, arrData1, arrData2, arrData3);}}});
	_objDialog.dialog('open');
}
function goBackToInvoice(backUrl, frmId)
{
	if($('#dirtyBit').val()=="1")
		getConfirmationPopup(frmId, backUrl);
	else
    {
	var frm = document.getElementById(frmId);	
	frm.action = backUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	}
	//showLineAlert(120, 250, "Message", "Do you want to save changes?", performAction, strUrl, backUrl, frmId);	
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
function performAction(flag, strUrl, backUrl, frmId)
{
	var frm = document.getElementById(frmId);	
	if(flag==true)
	{		
		frm.action = strUrl;
	}
	else
	{
		frm.action = backUrl;		
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();		
}
function addInvoiceLineItem(strUrl, frmId)
{
	$("#divCertInfo").html="";
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function updateInvoiceLine(strUrl, frmId)
{
	$("#divCertInfo").html="";
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function GetInfo(ctrl, index)
{
	if( ctrl.value == 'COUNTRY'){
		var temp = $("#countryInfo"+index).html();
		$("#fields"+index).html(temp);
	}
	else if(ctrl.value == 'QUALITY'){
		var temp = $("#qualityInfo"+index).html();
		$("#fields"+index).html(temp);
	}
	else if(ctrl.value == 'ANALYSIS'){
		var temp = $("#analysisInfo"+index).html();
		$("#fields"+index).html(temp);
	}
	else if(ctrl.value == 'WEIGHT'){
		var temp = $("#weightInfo"+index).html();
		$("#fields"+index).html(temp);
	}
	else if(ctrl.value == 'QUANTITY'){
		var temp = $("#quantityInfo"+index).html();
		$("#fields"+index).html(temp);
	}
	else if(ctrl.value == 'HEALTHCHECK'){
		var temp = $("#healthInfo"+index).html();
		$("#fields"+index).html(temp);
	}
	else if(ctrl.value == 'PHYTOSANITARY'){
		var temp = $("#PhytoInfo"+index).html();
		$("#fields"+index).html(temp);
	}
	else{
		$("#fields"+index).html("");		
	}		
}

