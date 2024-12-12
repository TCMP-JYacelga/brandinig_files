function showLCEditViewDetails(frmId,rowIndex)
{
	var frm = document.getElementById(frmId);
	var mode = document.getElementById("MODE").value;
	var pagemode = document.getElementById("pageMode").value;
	document.getElementById("txtRecordIndex").value = rowIndex;
		if(pagemode!=='AMEND'){
		    if (mode=='VIEW')
			{
				frm.action = "viewImportLcMasterDetails.form";
			}
			else
			{
				frm.action = "editImportLc.form";
			}
		}
		else{
				frm.action = "amendImportLc.form";
		}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showUploadPopup(fptrCallback)
{
	var dlg = $('#uploadInstrumentFile');	
	var btnsArr={};	
	btnsArr[labels.uploadBtn]=function() {$(this).dialog("close"); fptrCallback.call(null, 'lcDocUpload.form');};
	btnsArr[labels.cancelBtn]=function() {$(this).dialog('close');};	
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:true, width:550,title : labels.uploadFileTitle,
					buttons: btnsArr});
	dlg.dialog('open');
}

function showAdvancedFilter(fptrCallback)
{
	$('#upName').val('');
	var dlg = $('#advanceFilter');	
	var btnsArr={};	
	//btnsArr[labels.filterBtn]=function() {$(this).dialog("close"); fptrCallback.call(null, 'custUploadDownloadList.form');}
	btnsArr[labels.filterBtn]=function() {$(this).dialog("close"); fptrCallback.call(null, 'lcDocUploadDownloadList.form');}
	btnsArr[labels.cancelBtn]=function() {$(this).dialog('close');};	
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:true, width:480,title : labels.advFilterTitle,
					buttons: btnsArr});
	dlg.dialog('open');
}

function uploadFile(strUrl)
{	
	$('#uploadInstrumentFile').appendTo('#frmMain');
	$('#uploadInstrumentFile').hide();
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showWelcomePage()
{
	window.location = "/WEB-INF/secure/welcome.jsp";
}

function showList(strUrl)
{
	window.location = strUrl;
}

function getRejectRecord(me,rejTitle, rejMsg)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230,rejTitle, rejMsg, [document.getElementById("updateIndex").value], rejectRecord);
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
		frm.action = "custFileUploadReject.form";	
		frm.method = 'POST';
		frm.submit();
	}
}

function showHistoryForm(strUrl, index)
{	
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=390,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function downloadFile(strUrl, index, status,seqNmber)
{	
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if(status == "3" || status == "0")
	{
		frm.action = strUrl;
		frm.target = "";	
		frm.method = "POST";
		frm.submit();
	}
	else
	{
		$('#CustDownloadMsgDialog').dialog( {autoOpen: false, width : 300,title : labels.custFileDownloadTitle, modal : true});
		$('#CustDownloadMsgDialog').dialog('open');

	}
}

function downloadFile(strUrl, index,seqNmber)
{	
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = seqNmber-1;
		frm.action = strUrl;
		frm.target = "";	
		frm.method = "POST";
		frm.submit();
}

function closeCustDownloadMsg(){
	$('#CustDownloadMsgDialog').dialog('close');
}

// Accept and Reject requests
function filterList(strUrl)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(ctrl, status, index, maker, cheker)
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
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 2),"");
		//alert(index + '::stractionmap1::' + strActionMap);
		mapPosition = strActionMap.indexOf(index+":");
		//alert('map position' + mapPosition);
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 8),"");
		//alert('Final Value' +  document.getElementById("actionmap").value) ;	
	}
	else
	{
		//alert('Adding');
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		//alert('Request state ' +  status);
		strCurrentAction = arrBatchFile[status];
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
		refreshButtons(maker, cheker);
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(maker, cheker);
	}	
}


function authSubmit(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "custFileUploadAuth.form";
	frm.method = "POST";
	frm.submit();
}

function deleteList(me)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "custFileUploadDelete.form";
	frm.method = "POST";
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
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;	

	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

function goPgNmbr(mode, totalPages)
{	
	var frm = document.forms["frmMain"];
	var strUrl = null; 
	frm.target ="";
	
	strUrl = "taskStatusList.form"
 
	var pgNmbr = document.getElementById("goPageNumbr").value;	
	document.getElementById("txtCurrent").value = pgNmbr - 1 ;
	if (isNaN(pgNmbr) || isNaN(totalPages))
	{
		showError("Page number can accept integer only",null);
		return false;
	}
	
	if (pgNmbr > totalPages)	
	{
		showError('Page Number cannot be greater than total number of pages!',null);
			return;
	}
	else if (pgNmbr<=0)
	{
		showError('Page Number cannot be Zero or less!',null);
			return;
	}
	
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
	
}	
	

// Details
function deleteDetail(strUrl, index, sequenceNo)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = sequenceNo-1;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function unassignRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function assignRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function discardRecord(strUrl, index)
{

	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

function back()
{
	window.location = strUrl;
}

function getRejectRemarks(strUrl)
{	
	window.opener.document.getElementById("rejectRemarks").value = document.getElementById("rejectRemarks").value;
	var frm = window.opener.document.forms["frmMain"];	

	frm.action = strUrl;		
	frm.method = "POST";
	frm.submit();
	window.close();
			
}


function call(str)
{
	if(str=='F3')
	{
			filterList('taskStatusList.form');
	}
	if(str=='F12')
	{
		showList('welcome.jsp');
	}			
}
function filterRefresh(){
	filterList('taskStatusList.form');
}

function Refresher(t){
	if(t) refresh = setTimeout("document.location='javascript:filterRefresh()';",t*1000);
}

function trim (str) {
	var	str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

function performAnd(validAction,currentAction)
{
	var strOut="";
	var i=0;
	if (validAction.length = currentAction.length)
	{
		for (i=0; i<4; i++)
		{
			strOut = strOut +((validAction.charAt(i)*1) && (currentAction.charAt(i)*1));
		}
	}
	return strOut;
}

function refreshButtons(maker, cheker)
{
	var strPopultedButtons=document.getElementById("bitmapval").value;
	
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd(strPopultedButtons,_strServerBitmap);	
	//alert('the final bitmap::' + strActionButtons);
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<4; i++)
		{
				switch (i)
				{
					case 0: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnUpld").className ="imagelink black inline_block button-icon icon-button-new font_bold";
					}
					else
					{
						document.getElementById("btnUpld").className ="imagelink black inline_block button-icon icon-button-new-grey font_bold";
					}
					break;
					
					case 1: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					}
					else
					{
						document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					}
					break;					
					
					case 2: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						//alert("Inside reject if::" );
						document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
					}
					else
					{
						//alert("Inside reject else::" + strActionButtons.charAt(i)*1 +" :: " +  maker);
						document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					}
					break;
					
					case 3: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						//alert("Inside discard if::" );
						document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
					}
					else
					{
						//alert("Inside discard else::" + strActionButtons.charAt(i)*1 +" :: " +  cheker);
						document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					}
					break;
					
				}
		}
	}	
}



