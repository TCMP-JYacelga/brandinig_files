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
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:650,title : 'Advanced Filter/Sort',
					buttons: {"Continue": function() {$(this).dialog("close"); showQueryHeaderList('showPayTemplateBatchList.form');},
								"Save & Filter": function() {if(document.getElementById('saveAs').value == ''){ alert("Plase provide a filter name"); return false;}; $(this).dialog("close"); showQueryHeaderList('showPayTemplateBatchList.form');},
								"Reset All": function(){resetAll()},
								Cancel: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
}
function resetAll()
{
	document.getElementById("qryPhdReference").value = "(ALL)";
	document.getElementById("clientId").value = "";
	document.getElementById("myProduct1").value = "";
	document.getElementById("paymentMethod1").value = "";
	document.getElementById("bankProduct1").value = "";
	document.getElementById("txnCurrency").value = "";
	document.getElementById("amount").value = "";
	document.getElementById("totalNo").value = "";
	document.getElementById("reqState").value = "ALL";
	document.getElementById("fileName").value = "";
	document.getElementById("channelCode").value = "";
	document.getElementById("fromDate").value = "";
	document.getElementById("toDate").value = "";
	
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
		//alert('Removing');
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 3), "");
		mapPosition = strActionMap.indexOf(index + ":");
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 13), "");
	}
	else
	{
		//alert('Adding');
		if (mode =='1')
			strCurrentAction = arrBatchPir[status];
		else
			strCurrentAction = arrBatchInst[status];
		
		if (!strCurrentAction)
			strCurrentAction = "000000000";
		
		document.getElementById("actionmap").value = index + ":" + strCurrentAction + "," + document.getElementById("actionmap").value ;
		
		document.getElementById("updateIndex").value = index+ "," + document.getElementById("updateIndex").value ;
	}
	if (ctrl.className.indexOf("acceptlink") > -1)
		ctrl.className = "linkbox acceptedlink";
	else
		ctrl.className = "linkbox acceptlink";

	// perform the operation of bitwise anding
	lenDelimAction = document.getElementById("actionmap").value.length;
	if (lenDelimAction > 1)
	{
		strDelimAction = document.getElementById("actionmap").value;
		strDelimAction = strDelimAction.substring(0, lenDelimAction-1);		
		strArrSplitAction = strDelimAction.split(",");		

		for (var i = 0; i < strArrSplitAction.length; i++)
		{
			strArrSplitAction[i] = strArrSplitAction[i].substring(strArrSplitAction[i].indexOf(":") + 1);
		}

		if (strArrSplitAction.length==1)
		{
			strFinalBitmap = strArrSplitAction[0];
		}
		else
		{
				lenLooplen = strArrSplitAction.length-1;
				for (var j=0; j<lenLooplen ; j++)
				{
					if (j==0)
					{
						//alert('Anding the first');
						strFinalBitmap = performAnd(strArrSplitAction[j], strArrSplitAction[j+1]);						
					}
					else
					{
						//alert('Anding the Subsequent');
						strFinalBitmap = performAnd(strFinalBitmap, strArrSplitAction[j+1]);
					}
				}
		}
		document.getElementById("bitmapval").value =	strFinalBitmap;
		refreshButtons();
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value =	strFinalBitmap;
		refreshButtons();
	}	
}

function performAnd(validAction,currentAction)
{
	var strOut = "";
	var i = 0;
	if (validAction.length = currentAction.length)
	{
		for (i=0; i<10; i++)
		{
			strOut = strOut +((validAction.charAt(i) * 1) && (currentAction.charAt(i) * 1));
		}
	}
	return strOut;
}

function refreshButtons()
{
	var strPopultedButtons=document.getElementById("bitmapval").value;
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd(strPopultedButtons,_strServerBitmap);	
	//alert('the final bitmap::' + strActionButtons);
	var i = 0;
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
						document.getElementById("btnDiscard").className ="imagelink black button-icon icon-button-discard font_bold";
					else
						document.getElementById("btnDiscard").className ="imagelink grey button-icon icon-button-discard-grey font-bold";
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

function showViewPir(strPirMode, index)
{
	var strUrl;
	strUrl = _strViewAction;
	
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
    document.getElementById("txtCurrent").value =0;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

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

function showEditPirFormTR(strUrl, index)
{
	$('#DeleteDialog').dialog( {autoOpen: false, width : 400,title : 'About To Edit',modal : true,position: 'center'});
	$('#dialogMode').val('1');
	$('#DeleteDialog').dialog('open');
	document.getElementById("txtIndex").value = index;
	 
	/*$('#addendanumber').val(parseInt(index));
	$('#addendanumber').text(parseInt(index));*/

}
function cancelDelete(){
	$('#DeleteDialog').dialog('close');
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = "";
	frm.target = "";
	frm.action = "";
}
function showEditPirForm(strUrl, index)
{
	
		if(index =="")
		{
			index =document.getElementById("txtIndex").value;
		}
	
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
        document.getElementById("txtCurrent").value = 0;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}


function deleteList(me, rejTitle, rejMsg)
{
	var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, [document.getElementById("updateIndex").value], deleteRecord);
}

function deleteRecord(arrData, strRemarks)
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
		frm.action = "deletePayTemplateBatchList.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function closeSubmit(me)
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
	frm.action = "submitPayTemplateBatchList.form";
	frm.method = "POST";
	frm.submit();
}

function authSubmit(me, txn_sign_appl)
{
	var actionName ;
	if (txn_sign_appl == "Y")
	{
		actionName = "signPayTemplateBatchList.form";
	}
	else
	{
		actionName = "acceptPayTemplateBatchList.form";	
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
		strUrl = "showPayTemplateBatchList.form";
	if (val.length > 1)
	{
		var bPrd = val.substring(1, val.length)
		document.getElementById("bankProduct").value = bPrd;
	}
	document.getElementById("txnCurrency").value = "";
	document.getElementById("module").value = "";
	document.getElementById("amount").value = "";
	document.getElementById("totalNo").value = "";
	document.getElementById("pirMode").value = "TP";
	
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
	$('#advanceFilter').appendTo('#frmMain');
	$('#txnCurrency').text('');
	$('#module').text('');
	$('#addPayment').hide();
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showQueryHeaderList(strUrl)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	document.getElementById("cboPayFilter").value = 7;
	document.getElementById("myProduct").value=document.getElementById("myProduct1").value;
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showBatchHeaderList(strUrl, me)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	if (me.value == "0")
	{
		$('#myProduct').val('');
		$('#myProduct1').val('');
		$('#qryPhdReference').val('');
		$('#txnCurrency').val('');
		$('#PHDTotalAmountFilterOption').val('');
		$('#amount').val('');
		$('#totalNo').val('');
		$('#filename').val('');
	}

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

function saveExcelList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

String.prototype.startsWith = function(str) 
{
	return (this.match("^"+str)==str)
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
				strCurrentAction = arrBatchPir[status];
			else
				strCurrentAction = arrBatchInst[status];
			
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
		frm.action = 'showPayTemplateBatchList_first.form';
		break;
	case 'prev':
		frm.action = 'showPayTemplateBatchList_previous.form';
		break;
	case 'next':
			if(curPage==totPage)
			  return false;
		
		frm.action = 'showPayTemplateBatchList_next.form';
		break;
	case 'last':
		frm.action = 'showPayTemplateBatchList_last.form';
		break;
	case 'input':
		$('#page_number').val(curPage);
		frm.action = 'showPayTemplateBatchList_goto.form';
		break;
	default:
		alert(_errMessages.ERR_NAVIGATE);
		return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changePaymentsListSort(sortCol, sortOrd, colId) {
    var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(colId)) 
	{
		document.getElementById("txtSortColId").value=colId;
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value=sortOrd;
			
   		frm.action = 'showPayTemplateBatchList.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}
function showTxnReport(url)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = url;
	frm.method = "POST";
	frm.submit();
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
		frm.action = "rollbackPayTemplateBatchList.form";
		frm.method = 'POST';
		frm.submit();
		
	}
	
	//getRemarks(230, rejTitle, rejMsg, [document.getElementById("updateIndex").value], rollbackRecord);
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
		frm.action = "rejectPayTemplateBatchList.form";
		frm.method = 'POST';
		frm.submit();
	}
}

