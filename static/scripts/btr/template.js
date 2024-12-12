function showList(strUrl)
{
	window.location = strUrl;
}

function addTemplateInstruction()
{
	window.location = "addTemplate.form";
}

function doFilter(strUrl)
{
	var frm = document.forms["frmMain"];

	if (strUrl != null)
		url = strUrl;

	frm.target ="";
	frm.action = url;
	frm.method = 'POST';
	frm.submit();
	return true;

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

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function setTemplateDisplay(t)
{	

	var element ;
	if (t == null || t == undefined)
 		return;
 	try
 	{
 		element = t.options[t.selectedIndex].value;
 	}
 	catch(e)
 	{
 	}
 	if (element == null || element == undefined)
 		return;
 	
	if (element == 'A')
	{
		document.getElementById("trUserCode").className = "hidden";
	}
	else if (element == 'U')
	{
		document.getElementById("trUserCode").className = "visible";
	}
}

function showViewTemplateForm(index,mode)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	if(mode == "AUTH")
	strUrl = "authViewTemplate.form";
	else 
	strUrl = "viewTemplate.form";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function setFilterFlag()
{
	document.getElementById("filterFlag").value="f";
}

function enableTemplateRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = "enableTemplate.form";
	frm.method = "POST";
	frm.submit();
}

function disableTemplateRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = "disableTemplate.form";
	frm.method = "POST";
	frm.submit();
}

function discardTemplate(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function trim(str)
{
    if(!str || typeof str != 'string')
        return null;
    var tempStr = str.replace(/^[\s]+/,'').replace(/[\s]+$/,'').replace(/[\s]{2,}/,'');
    return tempStr.valueof();
}

function rejectSubmit(arrData, retVal)
{
	var frm = document.forms["frmMain"]; 
	frm.target ="";
	frm.rejectRemarks.value = retVal;
	retVal = trim(retVal);
	if (retVal == null || retVal.length == 0 || retVal =="")
	{
		showErr("Reject Remarks Are Mandatory", null);	
		return false;
	}
	else if ( retVal.length > 255 )
	{
		showErr("Reject Remarks Length Cannot Be Greater than 255 Characters", null);	
		return false;
	}
	
	document.getElementById("txtIndex").value = arrData[1];
	frm.action = arrData[0];
	frm.method = "POST";
	frm.submit();
}

