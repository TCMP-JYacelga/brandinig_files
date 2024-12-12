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

function holdRecord(arrData)
{
	var frm = document.forms["frmMain"]; 
    frm.txtIndex.value = arrData[1];
    frm.action = arrData[0];
    frm.method = "POST";
    frm.target = ""; 
	frm.submit();
}

function releaseRecord(arrData)
{
	var frm = document.forms["frmMain"]; 
    frm.txtIndex.value = arrData[1];
    frm.action = arrData[0];
    frm.method = "POST";
    frm.target = ""; 
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
		filterList('sendPirList.form');
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

function showInstList(index)
{
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index ; 
	frm.action = "holdReleaseInstShowAllList.form";
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
