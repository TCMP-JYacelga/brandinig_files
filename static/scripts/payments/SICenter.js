function showTxnReport(url)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = url;
	frm.method = "POST";
	frm.submit();
}
function showAddPayment()
{
	$('#addPayment').dialog( {autoOpen: false, width : 550,title : 'New Payment',modal : true});
	$('#dialogDisplayMode').val('1');
	$('#addPayment').dialog('open');
}
function showAdvancedFilter()
{
	$('#advanceFilter').dialog( {autoOpen: false, width : 550,title : 'Advanced Filter',modal : true});
	$('#dialogDisplayMode').val('2');
	$('#advanceFilter').dialog('open');
}
function cancel()
{
	$('#addPayment').dialog('close');
	$('#advanceFilter').dialog('close');
	$('#dialogDisplayMode').val('0');
}
function populateBankProducts(me)
{
	$('#addPayment').appendTo('#frmMain');
	$('#addPayment').hide();
	$('#dialogDisplayMode').val('1');
	document.getElementById("myProduct").value=me.value;
	var frm = document.forms["frmMain"];	
	frm.target ="";
	frm.action = "showSIListBatch.form";
	frm.method = "POST";
	frm.submit();
}

function populateMyproducts(me, val)
{
	document.getElementById("myProduct").value=me;
	
	if (val.charAt(0) == "B")
		document.getElementById("isBatch").value = '1';
	else if (val.charAt(0) == "Q")
		document.getElementById("isBatch").value = '2';
	showAddNewPirForm();
}

function acceptRecord(ctrl, mode, status, index)
{
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if (index.length < 2)
	{
		index = '0' + index;
	}
	var aPosition = strAuthIndex.indexOf(index);
    var mapPosition;	
	//alert('index' + index);
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap =document.getElementById("bitmapval").value;
	var lenLooplen;
	if (aPosition >= 0)
	{
		//alert('Removing');
		//alert('stractionmap' + strActionMap);
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 3),"");
		mapPosition = strActionMap.indexOf(index+":");
		//alert('map position' + mapPosition);
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 12),"");
		//alert('Final Value' +  document.getElementById("actionmap").value) ;	
	}
	else
	{
		//alert('Adding');
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		//alert('mode ' + mode + 'Request state ' +  status);
		if (mode =='1')
			strCurrentAction = arrBatchPir[status];
		else
			strCurrentAction = arrBatchInst[status];
		
		if (!strCurrentAction)
			strCurrentAction = "00000000";
		
		document.getElementById("actionmap").value = index+":"+ strCurrentAction +","+document.getElementById("actionmap").value ;
		//alert('Final Value' +  document.getElementById("actionmap").value) ;		
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
	//alert(mode +":"+ _strValidActions + ":" +status);
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
		//alert('Binaries :: ' + strArrSplitAction);
		
		if (strArrSplitAction.length==1)
		{
			strFinalBitmap = strArrSplitAction[0];
		}
		else
		{
				lenLooplen =strArrSplitAction.length-1;
				//alert('Loop len' + lenLooplen);
				for (var j=0; j<lenLooplen ; j++)
				{
					if (j==0)
					{
						//alert('Anding the first');
						strFinalBitmap = performAnd(strArrSplitAction[j],strArrSplitAction[j+1]);						
					}
					else
					{
						//alert('Anding the Subsequent');
						strFinalBitmap = performAnd(strFinalBitmap,strArrSplitAction[j+1]);
					}
				}
		}
		//alert('Final Bitmap ::: ' + strFinalBitmap);
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
	if (validAction.length = currentAction.length)
	{
		for (i=0; i<8; i++)
		{
			strOut = strOut +((validAction.charAt(i)*1) && (currentAction.charAt(i)*1));
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
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<8; i++)
		{
				switch (i)
				{
					case 0:
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnSubmit").className ="imagelink black inline_block button-icon icon-button-submit font_bold";
						else
							document.getElementById("btnSubmit").className ="imagelink grey inline_block button-icon icon-button-submit-grey font-bold";
						break;

					case 1:
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
						else
							document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
						break;

					case 2:
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
						else
							document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
						break;

					case 3:
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
						else
							document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
						break;

					case 4:
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnDisable").className ="imagelink black inline_block button-icon icon-button-relese font_bold";
						else
							document.getElementById("btnDisable").className ="imagelink grey inline_block button-icon icon-button-release-grey font-bold";
						break;

					case 5:
						if (strActionButtons.charAt(i)*1 ==1)
							document.getElementById("btnEnable").className ="imagelink black inline_block button-icon icon-button-relese font_bold";
						else
							document.getElementById("btnEnable").className ="imagelink grey inline_block button-icon icon-button-release-grey font-bold";
						break;
				}
		}
	}	
}

function showViewPir(strPayMode, index)
{
	
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
    document.getElementById("txtCurrent").value =0;
    if(strPayMode =='B'){
    	frm.action = 'STIviewPir.form';	
		}else{
			frm.action = 'QUICKPAYSTIviewPir.form';	
		}
	
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

function showEditPirForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
        document.getElementById("txtCurrent").value = 0;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function cloneRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function deleteList(me,rejTitle, rejMsg)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	} 
	getRemarks(230,rejTitle, rejMsg, [document.getElementById("updateIndex").value], deleteRecord);
}

function deleteRecord(arrData, strRemarks)
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
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "STIdiscardPir.form";
		frm.method = 'POST';
		frm.submit();
	}
}


function getRejectRecord(me, rejTitle, rejMsg)
{
	if (me.className.startsWith("imagelink grey"))
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

	if (strRemarks.length > 255)
	{
		alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtIndex").value = arrData;
		frm.target = "";
		frm.action = "rejectSTIGenAuthorization.form";
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
	frm.action = "closeSIList.form";
	frm.method = "POST";
	frm.submit();
}

function enableSI(me)
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
	frm.action = "STIListEnablePir.form";
	frm.method = "POST";
	frm.submit();
}
function disableSI(me)
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
	frm.action = "STIListDisablePir.form";
	frm.method = "POST";
	frm.submit();
}

function authSubmit(me)
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
	frm.action = "acceptSTIGenAuthorization.form";
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

function showAddNewPirForm(strUrl)
{
	if (document.getElementById("isBatch").value == '1')
    	strUrl = "STIaddPir.form";
	else if (document.getElementById("isBatch").value == '2')
		strUrl = "QUICKPAYSTIaddDetail.form";
    else
		return;
    
	$('#addPayment').dialog('close');
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
	$('#advanceFilter').dialog('close');
	$('#cboPayFilter').val('0');
	document.getElementById("cboPayFilter").value = 7;
	document.getElementById("myProduct").value=document.getElementById("myProduct1").value;
    var frm = document.forms["frmMain"];
	frm.action = 'showSIListBatch.form';
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showBatchHeaderList(strUrl, me)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	$('#advanceFilter').dialog('close');
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
	$('#dialogDisplayMode').val('0');
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

String.prototype.startsWith = function(str) 
{return (this.match("^"+str)==str)}

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
		frm.action = 'showSIListBatch_first.form';
		break;
	case 'prev':
		frm.action = 'showSIListBatch_previous.form';
		break;
	case 'next':
			if(curPage==totPage)
			  return false;
		
		frm.action = 'showSIListBatch_next.form';
		break;
	case 'last':
		frm.action = 'showSIListBatch_last.form';
		break;
	case 'input':
		$('#page_number').val(curPage);
		frm.action = 'showSIListBatch_goto.form';
		break;
	default:
		alert(_errMessages.ERR_NAVIGATE);
		return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changeSIListSort(sortCol, sortOrd,colId) {
	
	
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(sortCol)) 
	{
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value= sortOrd;
		document.getElementById("txtSortColId").value=colId;
		
   		frm.action = 'showSIListBatch.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}
function showAdvancedFilter(fptrCallback)
{
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:650,title : 'Advanced Filter/Sort',
					buttons: {"Continue": function() {$(this).dialog("close"); showQueryHeaderList('showSIListBatch.form');},
								"Save & Filter": function() {if(document.getElementById('saveAs').value == ''){ alert("Plase provide a filter name"); return false;}; $(this).dialog("close"); showQueryHeaderList('showSIListBatch.form');},
								"Reset All": function(){resetAll()},
								Cancel: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
} 

function resetAll()
{
	document.getElementById("qryPhdReference").value = "(ALL)";
	document.getElementById("myProduct1").value = "";
	document.getElementById("txnCurrency").value = "";
	document.getElementById("PHDTotalAmountFilterOption").value = "";
	document.getElementById("amount").value = "";
	document.getElementById("totalNo").value = "";
	document.getElementById("reqState").value = "";
    document.getElementById("siFromDate").value = "";
	document.getElementById("siToDate").value = "";
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


function showSIReport(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}
