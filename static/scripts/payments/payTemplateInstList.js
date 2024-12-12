function showMyproductTemplate(url,selectType,selectDesc)
{
	var strData = {};	  
	strData[csrfTokenName] = csrfTokenValue;	
	strData["selectType"] = selectType;	
	strData["selectDesc"] = selectDesc
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',		    	
	        data:strData,
	        url: url,	       
			async:false,
	        success: function(data)
	        {	 
	           if (data['ALLMYPRODUCTS']!=null) 
			   { 
	        	   var allMyProducts = data['ALLMYPRODUCTS'];
				   $('#myProductListBatch').html('');
	        	   
					for (i=0;i<allMyProducts.length;i++)
					{						
						var $ctrl = $(document.createElement('a'));
						$ctrl.attr("href", "#");
						$($ctrl).attr('prdId', i);
						$($ctrl).bind("click",function(e){
								 var prdid = $(this).attr('prdId');
								 return populateMyproducts(allMyProducts[prdid].mypProduct,
														   allMyProducts[prdid].mypuseFor,allMyProducts[prdid].mypBnkProduct,allMyProducts[prdid].recordKeyNo);
							});
						var $span = $(document.createElement('span')).attr("title", allMyProducts[i].mypDescription).addClass("link_color topAlign");
						var $val = allMyProducts[i].mypDescription;
						$span.append($val);
						$ctrl.append($span);
						var $br = $(document.createElement('br')).addClass("clear");
						var $spanTemplate = $(document.createElement('span')).attr("title", "Template").addClass("grdlnk-notify-icon icon-gln-billpay");
						$spanTemplate.attr("htmlEscape","true");
						$spanTemplate.attr("javaScriptEscape","true");
						
						if((allMyProducts[i].mypuseFor).substring(0,1) == 'Q'){						
							var $span = $(document.createElement('span')).attr("title", "Quick Pay").addClass("grdlnk-notify-icon icon-gln-quickpay");
							$span.attr("htmlEscape","true");
							$span.attr("javaScriptEscape","true");
							
							if(allMyProducts[i].mypBnkProduct == ' '){
								$('#myProductListBatch').append($ctrl,$spanTemplate,$span,$br);
							}else{
								$('#myProductListBatch').append($ctrl,$span,$br);
							}
						}else{
							if(allMyProducts[i].mypBnkProduct == ' '){
								$('#myProductListBatch').append($ctrl,$spanTemplate,$br);
							}else{
								$('#myProductListBatch').append($ctrl,$br);
							}
						}		
					}
					 
			   }	          
	        }
	    });
	strData = "";	
}
function showAddPayment(fptrCallback)
{
	var dlg = $('#addPayment');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:480,title : 'Create Template',
					buttons: {Cancel: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
}

function showAdvancedFilter(fptrCallback)
{
	var dlg = $('#advanceFilterInst');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:650,title : 'Advanced Filter/Sort',
					buttons: {"Continue": function() {$(this).dialog("close"); showQueryHeaderList('showPayTemplateInstList.form');},
								"Save & Filter": function() {if(document.getElementById('saveAs').value == ''){ alert("Plase provide a filter name"); return false;}; $(this).dialog("close"); showQueryHeaderList('showPayTemplateInstList.form');},
								"Reset All": function(){resetAll()},
								Cancel: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
} 
function resetAll()
{
	document.getElementById("qryPhdReference").value = "(ALL)";
	document.getElementById("transmittedRef").value = "";
	document.getElementById("clientId").value = "";
	document.getElementById("myProduct1").value = "";
	document.getElementById("bankProduct1").value = "";
	document.getElementById("drawerDescription").value = "";
	document.getElementById("txnCurrency").value = "";
	document.getElementById("txnDate").value = "";
	document.getElementById("accountNo").value = "ALL";
	document.getElementById("amount").value = "";
	document.getElementById("fromDate").value = "";
	document.getElementById("toDate").value = "";
	document.getElementById("PHDTotalAmountFilterOption").value = "";
	document.getElementById("amount").value = "";
	document.getElementById("micrNo").value = "";
	document.getElementById("reqState").value = "";
	document.getElementById("deliveryStatus").value = "";
	document.getElementById("fileName").value = "";
	document.getElementById("channelCode").value = "";
	document.getElementById("purposeCode").value = "";
	document.getElementById("docVerificationFlag").value = "";
	document.getElementById("contractRefNo").value = "";
	
	document.getElementById("sortField1").value = "NONE";
	document.getElementById("orderField1").value = "asc";
	document.getElementById("sortField2").value = "NONE";
	$('#' + "sortField2" ).attr('disabled', true);
	document.getElementById("orderField2").value = "asc";
	$('#' + "orderField2" ).attr('disabled', true);
	document.getElementById("sortField3").value = "NONE";
	$('#' + "sortField3" ).attr('disabled', true);
	document.getElementById("orderField3").value = "asc";
	$('#' + "orderField3" ).attr('disabled', true);
	document.getElementById("sortField4").value = "NONE";
	$('#' + "sortField4" ).attr('disabled', true);
	document.getElementById("orderField4").value = "asc";
	$('#' + "orderField4" ).attr('disabled', true);
}
function populateMyproducts(me, val)
{
	document.getElementById("myProduct").value = me;
	if (val.charAt(0) == "B")
	{
		document.getElementById("isBatch").value = '1';
		strUrl = "BBaddPir.form";
	}
	else if (val.charAt(0) == "Q")
	{
		document.getElementById("isBatch").value = '2';
		strUrl = "QUICKPAYaddDetail.form";
	}
	else
		strUrl = "showPayTemplateInstList.form";
	
	document.getElementById("txnCurrency").value = "";
	document.getElementById("module").value = "";
	document.getElementById("amount").value = "";
	document.getElementById("accountNo").value = "";
	document.getElementById("bankProduct").value = "";
	document.getElementById("pirMode").value = "TP";
	
	if (val.length > 1)
	{
		var bPrd = val.substring(1, val.length)
		document.getElementById("bankProduct").value = bPrd;
	}

	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();		
}
function showAddNewPirForm(strUrl)
{
	if (document.getElementById("isBatch").value == '1')
    	strUrl = "BBaddPir.form";
	else if (document.getElementById("isBatch").value == '2')
		strUrl = "QUICKPAYaddDetail.form";
	else
		return;
    
	$('#addPayment').appendTo('#frmMain');
	$('#advanceFilterInst').appendTo('#frmMain');
	$('#txnCurrency').text('');
	$('#accountNo').text('');
	$('#module').text('');
	$('#addPayment').hide();
	
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showInstQueryList(strUrl)
{
	$('#advanceFilterInst').appendTo('#frmMain');
	$('#advanceFilterInst').hide();
	document.getElementById("cboPayFilter").value = 7;
	document.getElementById("myProduct").value=document.getElementById("myProduct1").value;
	document.getElementById("bankProduct").value=document.getElementById("bankProduct1").value;
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showInstHeaderList(strUrl, me)
{
	$('#advanceFilterInst').appendTo('#frmMain');
	$('#advanceFilterInst').hide();
	if (me.value == "0")
	{
		$('#myProduct').val('');
		$('#bankProduct').val('');
		$('#qryPhdReference').val('');
		$('#txnCurrency').val('');
		$('#PHDTotalAmountFilterOption').val('');
		$('#amount').val('');
		$('#filename').val('');
		$('#txnDate').val('');
		$('#AccountNo').val('');
		$('#fileName').val('');
		$('#drawerDescription').val('');
		$('#micrNo').val('');
	}
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	if(index =="")
	{
		index =document.getElementById("txtIndex").value;
	}

	
	strUrl = strUrl+"editDetail.form";
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function acceptRecord(ctrl, mode, status, module, index)
{
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if(_module == 'C')
	{
		if (module != _module) return false;
	}
	if (index.length < 2)
	{
		index = '0' + index;
	}
	var strFinalBitmap = document.getElementById("bitmapval").value;
	var aPosition = strAuthIndex.indexOf(index);
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var lenLooplen;
	if (aPosition >= 0)
	{
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 3), "");
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(aPosition, aPosition + 13), "");
	}
	else
	{
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		if (mode == '1')
			strCurrentAction = arrPir[status];
		else
			strCurrentAction = arrInst[status];
		
		if (!strCurrentAction)
			strCurrentAction = "000000000";

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
		refreshButtons();
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons();
	}	
}

function performAnd(validAction,currentAction)
{
	var strOut="";
	var i=0;
	if (validAction.length == currentAction.length)
	{
		for (i=0; i<10; i++)
		{
			strOut = strOut +((validAction.charAt(i)*1) && (currentAction.charAt(i)*1));
		}
	}
	return strOut;
}

function refreshButtons()
{
	var populateButtons = document.getElementById("bitmapval").value;
	var strActionButtons = performAnd(populateButtons, _strServerBitmap);
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<10; i++)
		{
			switch (i)
			{
				case 0: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnSubmit").className ="imagelink black inline button-icon icon-button-submit font_bold";
					else
						document.getElementById("btnSubmit").className ="imagelink grey inline button-icon icon-button-submit-grey font-bold";
				break;
				
				case 1: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnAuth").className ="imagelink black inline button-icon icon-button-accept font_bold";
					else
						document.getElementById("btnAuth").className ="imagelink grey inline button-icon icon-button-accept-grey font-bold";
					break;
					
				case 2:
					if (strActionButtons.charAt(i)*1 == 1)
						document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
					else
						document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					break; 

				case 4: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnDiscard").className ="imagelink black inline button-icon icon-button-discard font_bold";
					else
						document.getElementById("btnDiscard").className ="imagelink grey inline button-icon icon-button-discard-grey font-bold";
					break;
				case 9: 
					if (strActionButtons.charAt(i)*1 ==1)
						document.getElementById("btnRollback").className ="imagelink black button-icon icon-button-discard font_bold";
					else
						document.getElementById("btnRollback").className ="imagelink grey button-icon icon-button-discard-grey font-bold";
					break;
			}
		}
	}	
}

function authSubmit(me, txn_sign_appl)
{
	var actionName ;
	if (txn_sign_appl == "Y")
	{
		actionName = "acceptSignInstAuth.form";
	}
	else
	{
		actionName = "acceptPayTemplateInstList.form";	
	}
	if (me.className.startsWith("imagelink grey"))
		return;
	
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = actionName;
	frm.method = "POST";
	frm.submit();
}

function populateData(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function clearForm(formIdent) 
{ 
  var form, elements, i, elm; 
  form = document.getElementById 
    ? document.getElementById(formIdent) 
    : document.forms[formIdent]; 

    if (document.getElementsByTagName)
	{
		elements = form.getElementsByTagName('input');
		for( i=0, elm; elm=elements.item(i++); )
		{
			if (elm.getAttribute('type') == "text")
			{
				elm.value = '';
			}
		}
		elements = form.getElementsByTagName('select');
		for( i=0, elm; elm=elements.item(i++); )
		{
			elm.options.selectedIndex=0;
		}
	}

	// Actually looking through more elements here
	// but the result is the same.
	else
	{
		elements = form.elements;
		for( i=0, elm; elm=elements[i++]; )
		{
			if (elm.type == "text")
			{
				elm.value ='';
			}
		}
	}
}

function deleteRecord(me, scrapTitle, scrapMsg)
{
	var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, scrapTitle, scrapMsg, [document.getElementById("updateIndex").value], scrapRecord);
}

function scrapRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 
	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Scrap Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData;
		frm.target ="";
		frm.action = "deletePayTemplateInstList.form";
		frm.method = "POST";
		frm.submit();
	}
	
	
}

function getRejectRecord(me, rejTitle, rejMsg)
{
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, [document.getElementById("updateIndex").value], rejectRecord);
}

function getRollbackRecord(me, rejTitle, rejMsg)
{
	//var temp = document.getElementById("btnReject");
	//if (temp.className.startsWith("imagelink grey"))
	//	return;
	var frm = document.forms["frmMain"]; 
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	else
	{
		
		//document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "rollbackPayTemplateInstList.form";
		frm.method = 'POST';
		frm.submit();
		
	}
	
	//getRemarks(230, rejTitle, rejMsg, [document.getElementById("updateIndex").value], rollbackRecord);
}

function cancelDelete(){
	$('#DeleteDialog').dialog('close');
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = "";
	frm.target = "";
	frm.action = "";
}

function showEditPirFormTR(strUrl, index)
{
	$('#DeleteDialog').dialog( {autoOpen: false, width : 400,title : 'About To Edit',modal : true,position: 'center'});
	$('#dialogMode').val('1');
	$('#DeleteDialog').dialog('open');
	document.getElementById("txtIndex").value = index;
	 
	/*$('#addendanumber').val(parseInt(index));
	$('#addendanumber').text(parseInt(index));*/

}

function rejectRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255 || isEmpty(strRemarks))
	{
		alert("Reject Remarks Length should be between 1 and 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "rejectTempInstAuth.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function closeRecord(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "submitPayTemplateInstList.form";
	frm.method = "POST";
	frm.submit();
}

String.prototype.startsWith = function(str) 
{return (this.match("^"+str)==str)}

function showHistoryForm(strUrl, index)
{	
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=550,height=350";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	strUrl = strUrl+"viewDetail.form";
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function saveExcelList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function selectAllRecords()
{
	var selectedIndices = "";
	var selectedActionMap = "";
	//var startIndex = _intPageSize * (_intCurPage - 1);
	//var endIndex = startIndex + _intPageSize - 1;
	var status;
	var authLevel;
	var module;
	var current_record_details;
	var strCurrentAction;
	var strFinalBitmap;
	var blnFirst = true;
	var ctrl = document.getElementById("imgSelectAll");
	var isSelectAction = ctrl.src.indexOf("icon_uncheckmulti") > -1;

	if (isSelectAction)
		ctrl.src = "static/images/icons/icon_checkmulti.gif";
	else
		ctrl.src = "static/images/icons/icon_uncheckmulti.gif";

	for (var index = startIndex; index <= endIndex; index++)
	{
		current_record_details = all_record_details[index];
		status = current_record_details["status"];
		authLevel = current_record_details["authlevel"];
		module = current_record_details["module"];

		//alert("status:" + status);
		//alert("authLevel:" + authLevel);
		//alert("module:" + module);

		if (module != _module)
			continue;

		if (!isSelectAction)
		{
			document.getElementById("select-record-" + index).className = "linkbox acceptlink";
			$('#select-record-' + index).parents('tr').removeClass('row-selected');
			strFinalBitmap = _strValidActions;
		}
		else
		{
			document.getElementById("select-record-" + index).className = "linkbox acceptedlink";
			$('#select-record-' + index).parents('tr').addClass('row-selected');
			
			index += '';

			if (index.length < 2)
				index = '0' + index;

			if (authLevel == 1)
				strCurrentAction = arrPir[status];
			else
				strCurrentAction = arrInst[status];
			
			if (!strCurrentAction)
				strCurrentAction = "000000000";

			if (blnFirst)
			{
				blnFirst = false;
				strFinalBitmap = strCurrentAction;
			}
			else
				strFinalBitmap = performAnd(strFinalBitmap, strCurrentAction);

			selectedIndices = index + "," + selectedIndices;
			selectedActionMap = index + ":" + strCurrentAction + "," + selectedActionMap;
		}

		document.getElementById("updateIndex").value = selectedIndices;
		document.getElementById("actionmap").value = selectedActionMap;
		document.getElementById("bitmapval").value = strFinalBitmap;
		refreshButtons();
	}
}

function ProcessDetail(arrData)
{
	var frm = document.forms["frmMain"]; 
	frm.target = "";
//	/document.getElementById("txtIndex").value = index;
	document.getElementById("prdCutoffFlag").value = 'Y';
	frm.action = arrData[0];
	frm.method = "POST";
	frm.submit();
}

function changePage(navType, newPage) {
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	var curPage=$('.pcontrol input', this.pDiv).val();
	var totPage='<c:out value="${total_pages}"/>';
	switch (navType) {
	case 'first':
		frm.action = 'showPayTemplateInstList_first.form';
		break;
	case 'prev':
		frm.action = 'showPayTemplateInstList_previous.form';
		break;
	case 'next':
			if(curPage==totPage)
			  return false;
		
		frm.action = 'showPayTemplateInstList_next.form';
		break;
	case 'last':
		frm.action = 'showPayTemplateInstList_last.form';
		break;
	case 'input':
		$('#page_number').val(curPage);
		frm.action = 'showPayTemplateInstList_goto.form';
		break;
	default:
		alert(_errMessages.ERR_NAVIGATE);
		return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function changePayInstListSort (sortCol, sortOrd, colId) {
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(sortCol)) 
	{
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value= sortOrd;
		document.getElementById("txtSortColId").value= colId;
   		frm.action = 'showPayTemplateInstList.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}
 function showQueryHeaderList(strUrl)
    {
    	$('#advanceFilter').appendTo('#frmMain');
    	$('#advanceFilter').hide();
    	$('#advanceFilter').dialog('close');
    	$('#cboPayFilter').val('0');
		$('#saveAs').appendTo('#frmMain');
		$('#transmittedRef').appendTo('#frmMain');
		$('#templateName').appendTo('#frmMain');
		$('#clientId').appendTo('#frmMain');
		$('#myProduct1').appendTo('#frmMain');
		$('#paymentMethod').appendTo('#frmMain');
		$('#bankProduct1').appendTo('#frmMain');
		$('#drawerDescription').appendTo('#frmMain');
		$('#txnCurrency').appendTo('#frmMain');
		$('#txnDate').appendTo('#frmMain');
		$('#accountNo').appendTo('#frmMain');
		$('#fromDate').appendTo('#frmMain');
		$('#toDate').appendTo('#frmMain');
		$('#PHDTotalAmountFilterOption').appendTo('#frmMain');
		$('#amount').appendTo('#frmMain');
		$('#micrNo').appendTo('#frmMain');
		$('#reqState').appendTo('#frmMain');
		$('#fileName').appendTo('#frmMain');
		$('#contractRefNo').appendTo('#frmMain');
		$('#orderField1').appendTo('#frmMain');
		$('#orderField2').appendTo('#frmMain');
		$('#orderField3').appendTo('#frmMain');
		$('#orderField4').appendTo('#frmMain');
    	//alert(document.getElementById('saveAs').value)
        var frm = document.forms["frmMain"];
    	frm.action = strUrl;
    	frm.target = "";
    	frm.method = "POST";
    	frm.submit();
    }

    function clearForm(formIdent) 
    { 
      var form, elements, i, elm; 
      form = document.getElementById 
        ? document.getElementById(formIdent) 
        : document.forms[formIdent]; 

        if (document.getElementsByTagName)
    	{
    		elements = form.getElementsByTagName('input');
    		for( i=0, elm; elm=elements.item(i++); )
    		{
    			if (elm.getAttribute('type') == "text")
    			{
    				elm.value = '';
    			}
    		}
    		elements = form.getElementsByTagName('select');
    		for( i=0, elm; elm=elements.item(i++); )
    		{
    			elm.options.selectedIndex=0;
    		}
    	}

    	// Actually looking through more elements here
    	// but the result is the same.
    	else
    	{
    		elements = form.elements;
    		for( i=0, elm; elm=elements[i++]; )
    		{
    			if (elm.type == "text")
    			{
    				elm.value ='';
    			}
    		}
    	}
    }
    function cancelPrompt(){
    	$('#addPayment').dialog('close');
    	$('#addPayment').hide();
    	$('#advanceFilter').dialog('close');
    	$('#advanceFilter').hide();
    }


    function doDownload(strUrl)
    {
    	var frm = document.forms["frmMain"];
    	frm.target ="";
    	frm.action = strUrl;
    	frm.method = "POST";
    	frm.submit();
    }

    function editRecord(strUrl)
    {
        $('#addPayment').appendTo('#frmMain');
        
      var frm = document.forms["frmMain"]; 
      	frm.action = strUrl;
    	frm.method = "POST";
    	frm.target = "";
    	frm.submit();
    }
    function showTxnReport(url)
    {
    	var frm = document.forms["frmMain"];
    	frm.target ="";
    	frm.action = url;
    	frm.method = "POST";
    	frm.submit();
    }
    function showEditFormTR(strUrl, index)
    {
    	$('#DeleteDialog').dialog( {autoOpen: false, width : 400,title : 'About To Edit',modal : true,position: 'center'});
    	$('#dialogMode').val('1');
    	$('#DeleteDialog').dialog('open');
    	document.getElementById("txtIndex").value = index;
    	 
    	/*$('#addendanumber').val(parseInt(index));
    	$('#addendanumber').text(parseInt(index));*/

    }

