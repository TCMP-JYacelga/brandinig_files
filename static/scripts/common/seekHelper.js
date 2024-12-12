function seekFirstPage(totPages, seekUrl)
{
     var frm = document.forms["frmSeek"]; 
     var url = seekUrl + "_seek_first.seek";
     frm.action = url;
     frm.method = "POST";
     frm.submit();
}                              

function navigateTo(index, totPages, seekUrl)
{
     var frm = document.forms["frmSeek"]; 
	 if (index == 1)
	    frm.action = seekUrl + "_seek_next.seek";
	 else 
	    frm.action = seekUrl + "_seek_previous.seek";
     frm.method = "POST";
     frm.submit();
}                              

function seekLastPage(totPages, seekUrl)
{
      var frm = document.forms["frmSeek"]; 
      frm.action = seekUrl + "_seek_last.seek";
      frm.method = "POST";
      frm.submit();
}

function selectRecord(json, elementId, fptrCallback)
{		  
	hWin = window.opener;
	hWin.getRecord(JSON.stringify(json), elementId, fptrCallback);
	window.close();
}

function selectQuickPayRecord(json, elementId, fptrCallback)
{		  
	hWin = window.opener;
	hWin.getQuickPayRecord(JSON.stringify(json), elementId, fptrCallback);
	window.close();
}

function selectRightMenuRecord(json, elementId, fptrCallback)
{		  
	hWin = window.opener;
	hWin.getRightMenuRecord(JSON.stringify(json), elementId, fptrCallback);
	window.close();
}

function selectReportsRecord(json, elementId,inputElementParameter, fptrCallback)
{		  
	hWin = window.opener;
	hWin.getReportsRecord(JSON.stringify(json), elementId,inputElementParameter, fptrCallback);
	window.close();
}

function doOrderBy(index, sortDirection)
{
    var frm = document.forms["frmSeek"]; 

    if (sortDirection == 0)
      document.getElementById("sortDirection").value = "1";
    else
      document.getElementById("sortDirection").value = "0";

    document.getElementById("orderBy").value = index;
    frm.method = "POST";
    frm.submit();
}

function selectBankBranchRecord(json, elementId )
{		  
	window.opener.getBankBranchRecord(JSON.stringify(json),elementId);
	window.close();
}

function filterList()
{
	var frm = document.forms["frmSeek"]; 
	var url = stripExtension(frm.action) + "_first.seek";
	frm.action = url;
	frm.method = "POST";
	frm.submit();	
}	
function stripExtension(strUrl) {
	if (isEmpty(strUrl)) {return strUrl;}
	var pos = strUrl.lastIndexOf("_");
	if (pos > -1) {return strUrl.substring(0, pos);}
	return strUrl;
}

function selectAccount(json, elementId, fptrCallback) {
	hWin = window.opener;
	hWin.getSelectedAccount(JSON.stringify(json), elementId, fptrCallback);
	window.close();
}