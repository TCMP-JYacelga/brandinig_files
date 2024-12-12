var checkAll = false;
var checkAction = 2;   // 0 - Select all , 1 for unselect All ,2 for select single instrument
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

function sendAll()
{
	var i ;
	var parentTrElement;
	var parentImgElement;
	var rowIndex = document.getElementById("rowOutPutted").value;
	if (checkAll)
	{
	 checkAction =0;
	  document.getElementById("SelectALL").innerHTML=btnSelectAll;
	  checkAll = false;
	}
	else
	{	  
	 checkAction = 1;
	  document.getElementById("SelectALL").innerHTML=btnUnselectAll;
	  checkAll = true;
	 }
	for(i=0; i <= rowIndex; i++)
	{
	  if (document.getElementById("chkPir_"+ i).value =='1')
	  {
	  	parentTrElement = document.getElementById("node-"+ i)
	  	parentImgElement = parentTrElement.cells[2].childNodes[0];
	  	sendInstrumentArray(parentImgElement ,i);
	  }	
	}
	checkAction = 2;
}

function sendList()
{
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = document.getElementById("updateIndex").value;
	frm.target ="";
	frm.action = "sendPirAction.form";
	frm.method = "POST";
	frm.submit();
}

function sendInstrumentArray(ctrl, index)
{
	var strSendInstrIndex=document.getElementById("updateIndex").value;
	var aPosition = strSendInstrIndex.indexOf(index);
	if (aPosition>=0)
	{
		if (checkAction != 1)
		{
			document.getElementById("updateIndex").value=strSendInstrIndex.replace(strSendInstrIndex.substring(aPosition,aPosition+2),"");
		}	
	}
	else
	{
		if (checkAction != 0)
		{
			document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		}	
	}
	if (checkAction == 0)
	{
		ctrl.className = "linkbox enablelink";
	}
	else if (checkAction == 1)
	{
		ctrl.className = "linkbox enabledlink";
	}
	else
	{
		if  ( ctrl.className.indexOf("enablelink") > -1)
		{
			ctrl.className = "linkbox enabledlink";
		}
		else
		{
			ctrl.className = "linkbox enablelink";
		}
	}	
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

function rejectRecord(arrData, strRemarks)
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
		frm.action = "scrapPirAction.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function showInstList(index)
{
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index ; 
	frm.action = "showInstructionActionAll.form";
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
