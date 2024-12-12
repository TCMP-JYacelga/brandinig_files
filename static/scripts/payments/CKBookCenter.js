function addCKBook(strUrl)
{
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function reloadCKBook()
{
	var frm = document.forms["frmMain"];
	var ckCity = frm.ckBookCity;
	if (ckCity != null)
		ckCity.value = "";
	
    if (mode == 'ADD')
    	frm.action = "showReloadAdd.form";
    else if (mode == 'EDIT' || mode == 'UPDATE')
    	frm.action = "showCKBookEdit.form";
    else
    	return;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function reloadDeliveryMode()
{
	 var frm = document.forms["frmMain"];
	    if (mode == 'ADD')
	    	frm.action = "showCKBookAdd.form";
	    else if (mode == 'EDIT' || mode == 'UPDATE')
	    	frm.action = "showReloadEdit.form";
	    else
	    	return;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
}
function showCKBookList()
{
    var frm = document.forms["frmMain"];
	frm.action = "showCKBookListBatch.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showAdvancedFilter(fptrCallback)
{
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:650,title : 'Advanced Filter/Sort',
					buttons: {"Continue": function() {$(this).dialog("close"); fptrCallback.call(null, 'showCKBookListBatch.form');},
								"Save & Filter": function() {if(document.getElementById('saveAs').value == ''){ alert("Plase provide a filter name"); return false;}; $(this).dialog("close"); fptrCallback.call(null, 'showCKBookListBatch.form');},
								"Reset All": function(){resetAll()},
								Cancel: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
}
function resetAll()
{
	document.getElementById("qryReference").value = "(ALL)";
	document.getElementById("qryAccNo").value = "";
	document.getElementById("qryLeaves").value = "";
	document.getElementById("qryBooklets").value = "";
	document.getElementById("qryFromDate").value = "";
	document.getElementById("qryToDate").value = "";
	
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

function showQueryList(strUrl)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(ctrl, status, index, maker)
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
	var strFinalBitmap = document.getElementById("bitmapval").value;
	var lenLooplen;
	if (aPosition >= 0)
	{
		//alert('Removing');
		//alert('stractionmap' + strActionMap);
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 2),"");
		mapPosition = strActionMap.indexOf(index+":");
		//alert('map position' + mapPosition);
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 7),"");
		//alert('Final Value' +  document.getElementById("actionmap").value) ;	
	}
	else
	{
		//alert('Adding');
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		//alert('mode ' + mode + 'Request state ' +  status);
		strCurrentAction = arrActionMap[status];
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
		for (i=0; i<3; i++)
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
		for (i=0; i<3; i++)
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

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
    document.getElementById("txtCurrent").value = 0;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target = "";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
    document.getElementById("txtCurrent").value = 0;
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
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function deleteList(arrData)
{
	var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	} 
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = arrData[1];
	frm.action = arrData[0];
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
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
		frm.action = "rejectCKBookList.form";
		frm.method = 'POST';
		frm.submit();
	}
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
	frm.action = "acceptCKBookList.form";
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


String.prototype.startsWith = function(str) 
{return (this.match("^"+str)==str)}

function saveCK()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "showCKBookSave.form";
	frm.method = "POST";
	frm.submit();
}

function updateCK()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "showCKBookUpdate.form";
	frm.method = "POST";
	frm.submit();
}
function showCKBatchList(strUrl, me)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	if (me.value == "0")
	{
		$('#qryReference').val('');
		$('#qryAccNo').val('');
		$('#qryLeaves').val('');
		$('#qryBooklets').val('');
		$('#qryDelMode').val('');
		$('#qryStatus').val('');
		$('#qryFromDate').val('');
		$('#qryToDate').val('');
	}
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getRecord(json,elementId)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(IsJsonString(myJSONObject))
		{
			myJSONObject = JSON.parse(myJSONObject);
		}
    	if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
    		var type = document.getElementById(inputIdArray[i]).type;
    		if(type=='text')
    		{
    			document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
    		}
    		else if(type=='hidden')
	        {
	        	document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
	        }
    		else 
    		{
    			document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;
    		} 
    	}
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
		frm.action = 'showCKBookListBatch_first.form';
		break;
	case 'prev':
		frm.action = 'showCKBookListBatch_previous.form';
		break;
	case 'next':
			if(curPage==totPage)
			  return false;
		
		frm.action = 'showCKBookListBatch_next.form';
		break;
	case 'last':
		frm.action = 'showCKBookListBatch_last.form';
		break;
	case 'input':
		$('#page_number').val(curPage);
		frm.action = 'showCKBookListBatch_goto.form';
		break;
	default:
		alert(_errMessages.ERR_NAVIGATE);
		return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changePaymentsListSort(sortCol, sortOrd,colId) {
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(colId)) 
	{
		document.getElementById("txtSortColId").value=colId;
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value= sortOrd;
   		frm.action = 'showCKBookListBatch.form';
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

