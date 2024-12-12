function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function filterList(strUrl)
{
	document.getElementById("txtCurrent").value = '';
	document.getElementById("txtIndex").value = 0;
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function stopCancelTxns(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function stopCancelAuthTxns(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
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

function back()
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function call(str)
{
	if(str=='F3')
	{
		filterList('stopRequestList.form');
	}
}

function rejectRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255)
	{
		alert("Stop Request Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.txtIndex.value = arrData[0];
		frm.target = "";
		frm.action = "rejectStopRequest.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function stopRequest(strUrl,index)
{
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function cancelTxnsArray(ctrl, index)
{
	var strheldIndex=document.getElementById("cancelTxns").value;
	var aPosition = strheldIndex.indexOf(index);
	if (aPosition>=0)
	{
		document.getElementById("cancelTxns").value=strheldIndex.replace(strheldIndex.substring(aPosition,aPosition+2),"");
	}
	else
	{
		document.getElementById("cancelTxns").value = index+ ","+document.getElementById("cancelTxns").value ;
	}
	if( ctrl.className.indexOf("enablelink") > -1)
	{
		ctrl.className = "linkbox enabledlink";
	}
	else
	{
		ctrl.className = "linkbox enablelink";
	}
}

function stopTxnsArray(ctrl, index)
{
	var strRejectIndex=document.getElementById("stopTxns").value;
	var bPosition = strRejectIndex.indexOf(index);
	if (bPosition>=0)
	{
		document.getElementById("stopTxns").value=strRejectIndex.replace(strRejectIndex.substring(bPosition,bPosition+2),"");
	}
	else
	{
		document.getElementById("stopTxns").value = index+ ","+document.getElementById("stopTxns").value ;
	}
	if( ctrl.className.indexOf("enablelink") > -1)
	{
		ctrl.className = "linkbox enabledlink";
	}
	else
	{
		ctrl.className = "linkbox enablelink";
	}
}

function authTxnsArray(ctrl, index)
{
	var strRejectIndex=document.getElementById("authTxns").value;
	var bPosition = strRejectIndex.indexOf(index);
	if (bPosition>=0)
	{
		document.getElementById("authTxns").value=strRejectIndex.replace(strRejectIndex.substring(bPosition,bPosition+2),"");
	}
	else
	{
		document.getElementById("authTxns").value = index+ ","+document.getElementById("authTxns").value ;
	}
	if( ctrl.className.indexOf("enablelink") > -1)
	{
		ctrl.className = "linkbox enabledlink";
	}
	else
	{
		ctrl.className = "linkbox enablelink";
	}
}