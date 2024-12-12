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

function authSubmit()
{
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "acceptGenAuthorization.form";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(ctrl, index)
{
	var strAuthIndex = document.getElementById("updateIndex").value;
	var aPosition = strAuthIndex.indexOf(index);
	if (aPosition >= 0)
	{
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 2),"");
	}
	else
	{
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
	}
	if (ctrl.className.indexOf("acceptlink") > -1)
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
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
		frm.action = "rejectGenAuthorization.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function scrapRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255)
	{
		alert("Scrap Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.txtIndex.value = arrData[0];
		frm.target = "";
		frm.action = "scrapGenAuthorization.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function showBack(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}