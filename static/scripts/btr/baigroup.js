function showList(strUrl)
{
	window.location = strUrl;
}

function showWelcomePage()
{
	window.location = "/WEB-INF/secure/welcome.jsp";
}

function fupper(o)
{	
	o.value=o.value.toUpperCase().replace(/([^0-9A-Z])/g,"");
}

function goPgNmbr(strUrl, totalPages)
{	
	var frm = document.forms["frmMain"];
	var pgNmbr = document.getElementById("goPageNumbr").value;	
	document.getElementById("txtCurrent").value = pgNmbr - 1 ;
	if(isNaN(pgNmbr))
	{
		showError('Page Number Cannot be alphabet',null);
			return;
	}
	if (pgNmbr > totalPages)	
	{
		showError('Page Number cannot be greater than total number of pages!',null);
			return;
	}
	else if (pgNmbr<=0)
	{
		showError('Page Number cannot be Zero!',null);
			return;
	}
	
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}


function Save()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = actionUrl;
	frm.method = "POST";
	frm.submit();
	return true;
}

function call(str)
{
	if(str=='F2')
	{
		showAddNewForm('addBaiGroup.form');
	}
	if(str=='F12')
	{
		showList('welcome.jsp');
	}

	if(str=='F11')
	{
		return Save();
	}
	if(str=='F3')
	{
		if(mode == "AUTH")
			filter('baigroupAuthList.form');
		else
			filter('baigroupList.form')
	}	
}

function Save()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = actionUrl;
	frm.method = "POST";
	frm.submit();
	return true;
}

function showAddNewForm(strUrl)
{
	window.location = strUrl;
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

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if(mode == "AUTH")
	{
		strUrl = "authBaiViewGroup.form";
	}
	else
	{
		strUrl = "viewBaiGroup.form";
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	document.getElementById("txtCurrent").value = "";
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
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
			frm.action = "rejectBaiGroup.form";
			frm.method = 'POST';
			frm.submit();
		}
	}

// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddDetail(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
function showListEntry(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function discardRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function filter(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function populateState(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	frm.action = strUrl;	
	frm.method = "POST";
	frm.submit();
}
function nextDetPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"];
	var strUrl = null; 
	document.getElementById("txtDetail").value = intPg;
 	frm.target ="";
	strUrl = "editBaiGroup.form"
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function prevDetPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;	
	document.getElementById("txtDetail").value = intPg;
 	frm.target ="";
	strUrl = "editBaiGroup.form"
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function saveDetail(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function updateDetail(strUrl)
{
    	selectAll();
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}	

function saveHeader(strUrl)
{
    	selectAll();
	var frm = document.forms["frmMain"]; 
	frm.target ="";	
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}	


function getRecord(json,elementId)
{	
	var myJSONObject = JSON.parse(json);	
    var inputIdArray = elementId.split("|");
    for (i=0; i < inputIdArray.length; i++)
	{
    	if (document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			if (null == myJSONObject.columns[i].value)
				myJSONObject.columns[i].value = "";
    		var type = document.getElementById(inputIdArray[i]).type;
    		if (type == 'text')
    			document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
    		else
    			document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value; 
    	}
	}    
}

/************************************************************************
Name      : PopulateBAITypeCode() 
Purpose   : Selects the User from the groupListFrom ListBox and adds it to the
	    groupList List Box.	
Parameters: None
Return    : Nothing.
************************************************************************/
function PopulateBAITypeCode()  
{
	var i,cntr;
	var isNew = true;
	
	if (document.getElementById("groupListFrom").selectedIndex !=-1)
	{
		var RemLength = document.getElementById("groupList").length;	
		var AddLength = document.getElementById("groupListFrom").length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
		
		for (i=0; i<=AddLength-1; i++)
		{			
			if (document.getElementById("groupListFrom").options[i].selected)
			{					
				selectedItem = document.getElementById("groupListFrom").selectedItem;				     
				selectedText = document.getElementById("groupListFrom").options[i].text;		
				selectedValue = document.getElementById("groupListFrom").options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById("groupList").options[RemLength] = newoption;					
				RemLength = document.getElementById("groupList").length;
			}
		}
		i=0;
		cntr=0;

		while(i<AddLength)
		{	
			if (document.getElementById("groupListFrom").options[cntr].selected)
			{					
				document.getElementById("groupListFrom").options[cntr]=null;
				cntr--;
			}
			 cntr++;
			 i++;
		} 
		document.getElementById("groupListFrom").selectedIndex=-1;
	}
}


/************************************************************************
Name      : PopulateAll() 
Purpose   : Selects the User from the groupListFrom ListBox and adds it to the
	    groupList List Box.	
Parameters: None
Return    : Nothing.
************************************************************************/
function PopulateAll()  
{
		var i,cntr;
		var isNew = true;	
		var RemLength = document.getElementById("groupList").length;	
		var AddLength = document.getElementById("groupListFrom").length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
	
		for (i=0; i<=AddLength-1; i++)
		{	
				selectedItem = document.getElementById("groupListFrom").selectedItem;				     
				selectedText = document.getElementById("groupListFrom").options[i].text;		
				selectedValue = document.getElementById("groupListFrom").options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById("groupList").options[RemLength] = newoption;					
				RemLength = document.getElementById("groupList").length;
		}
		i=0;	
		cntr = -1;
		for (i=0; i<=AddLength-1; i++)
		{	
			cntr++;		
			document.getElementById("groupListFrom").options[cntr]=null;
			cntr--;	
		} 
}



/************************************************************************
Name      : PopulateAll() 
Purpose   : Selects the User from the groupListFrom ListBox and adds it to the
	    groupList List Box.	
Parameters: None
Return    : Nothing.
************************************************************************/
function RemoveAll()  
{
		var i,cntr;
		var isNew = true;
		var RemLength = document.getElementById("groupList").length;	
		var AddLength = document.getElementById("groupListFrom").length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
	
		for (i=0; i<=RemLength-1; i++)
		{			
				selectedItem = document.getElementById("groupList").selectedItem;				     
				selectedText = document.getElementById("groupList").options[i].text;		
				selectedValue = document.getElementById("groupList").options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById("groupListFrom").options[AddLength] = newoption;					
				AddLength = document.getElementById("groupListFrom").length;
		}
		i=0;	
		cntr = -1;
		for (i=0; i<=RemLength-1; i++)
		{	
			cntr++;		
			document.getElementById("groupList").options[cntr]=null;
			cntr--;	
		} 
}
function RemoveBAITypeCode()  
{
	var i,cntr;
	var isNew = true;
	
	if (document.getElementById("groupList").selectedIndex !=-1)
	{
		var RemLength = document.getElementById("groupList").length;	
		var AddLength = document.getElementById("groupListFrom").length;		
		var selectedItem; 		
		var selectedText;		
		var selectedValue ;				
		var cntr;
		
		for (i=0; i<RemLength; i++)
		{			
			if (document.getElementById("groupList").options[i].selected)
			{	
				selectedItem = document.getElementById("groupList").selectedItem;				     
				selectedText = document.getElementById("groupList").options[i].text;		
				selectedValue = document.getElementById("groupList").options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById("groupListFrom").options[AddLength] = newoption;				
				AddLength = document.getElementById("groupListFrom").length;

			}

		}
		i=0;
		cntr=0;

		while(i<RemLength)
		{	
			if (document.getElementById("groupList").options[cntr].selected)
			{					
				document.getElementById("groupList").options[cntr]=null;
				cntr--;
			}
			 cntr++;
			 i++;
		} 

		document.getElementById("groupList").selectedIndex=-1;
	}
}

function selectAll()
{
    var obj = document.getElementById("groupList");
    for (var i=0;i<obj.options.length; i++)
	{
	  obj.options[i].value=obj.options[i].value;
      obj.options[i].selected = true;
	  }
	return true;
}
function changePage(navType, newPage) 
{
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}	
	var curPage=$('.pcontrol input', this.pDiv).val();
	var totPage='<c:out value="${total_pages}"/>';
		
	switch(navType) 
	{
		case 'first':
			if(mode == "AUTH")
				frm.action = 'baigroupAuthList_first.form';
			else				
				frm.action = 'baigroupList_first.form';
			break;
		case 'prev':
			if(mode == "AUTH")
				frm.action = 'baigroupAuthList_previous.form';
			else
			frm.action = 'baigroupList_previous.form';
			break;
		case 'next':
		if(curPage==totPage)
				  return false;
			if(mode == "AUTH")
				frm.action = 'baigroupAuthList_next.form';
			else		
				frm.action = 'baigroupList_next.form';
			break;
		case 'last':
			if(mode == "AUTH")
				frm.action = 'baigroupAuthList_last.form';
			else			
			frm.action = 'baigroupList_last.form';
			break;
		case 'input':
			$('#page_number').val(curPage);
			if(mode == "AUTH")
				frm.action = 'baigroupAuthList_goto.form';
			else			
			frm.action = 'baigroupList_goto.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function sortBAIGroupList(sortCol, sorOrd, colId)
{
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if(!isEmpty(colId))
	{
		document.getElementById("txtSortColId").value = colId;
		if(!isEmpty(sortCol))
		{
			document.getElementById("txtSortColName").value = sortCol;
		}
		if(!isEmpty(sorOrd))
		{
			document.getElementById("txtSortOrder").value = sorOrd;			
		}
		if(mode == "AUTH")
			frm.action = 'sortBaiGroupAuthList.form';
		else		
		frm.action = "sortBaiGroupList.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}