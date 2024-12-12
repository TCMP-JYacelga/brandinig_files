function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showDetailViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	/*if(mode == "AUTH" || mode =="AUTH_VIEW_DETAIL")
		strUrl = "authViewAuthMatrix.form";
	else 
		strUrl = "viewAuthMatrix.form";	*/
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showAddDetail(strUrl)
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
		filter(mode,'glId');
	}
	if(str=='F2')
	{
		showAddNewForm('addDrIntRate.form');
	}
	if(str=='F12')
	{
		showList('welcome.jsp');
	}
	
	if(str=='F11')
	{
		return Save();
	}
		if(str=='F7')
	{
		showAddDetail('addAuthMatrixDetail.form');
	}

}

/************************************************************************
Name      : PopulateUsers() 
Purpose   : Selects the User from the addUser ListBox and adds it to the
	    axsUser List Box.	
Parameters: None
Return    : Nothing.
************************************************************************/
function PopulateUsers()  
{
	var i,cntr;
	var isNew = true;
	
	if (document.getElementById("addUser").selectedIndex !=-1)
	{
		var RemLength = document.getElementById("axsUser").length;	
		var AddLength = document.getElementById("addUser").length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
		
		for (i=0; i<=AddLength-1; i++)
		{			
			if (document.getElementById("addUser").options[i].selected)
			{					
				selectedItem = document.getElementById("addUser").selectedItem;				     
				selectedText = document.getElementById("addUser").options[i].text;		
				selectedValue = document.getElementById("addUser").options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById("axsUser").options[RemLength] = newoption;					
				RemLength = document.getElementById("axsUser").length;
			}
		}
		i=0;
		cntr=0;

		while(i<AddLength)
		{	
			if (document.getElementById("addUser").options[cntr].selected)
			{					
				document.getElementById("addUser").options[cntr]=null;
				cntr--;
			}
			 cntr++;
			 i++;
		} 
		document.getElementById("addUser").selectedIndex=-1;
	}
}


/************************************************************************
Name      : PopulateAll() 
Purpose   : Selects the User from the addUser ListBox and adds it to the
	    axsUser List Box.	
Parameters: None
Return    : Nothing.
************************************************************************/
function PopulateAll()  
{
		var i,cntr;
		var isNew = true;	
		var RemLength = document.getElementById("axsUser").length;	
		var AddLength = document.getElementById("addUser").length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
	
		for (i=0; i<=AddLength-1; i++)
		{	
				selectedItem = document.getElementById("addUser").selectedItem;				     
				selectedText = document.getElementById("addUser").options[i].text;		
				selectedValue = document.getElementById("addUser").options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById("axsUser").options[RemLength] = newoption;					
				RemLength = document.getElementById("axsUser").length;
		}
		i=0;	
		cntr = -1;
		for (i=0; i<=AddLength-1; i++)
		{	
			cntr++;		
			document.getElementById("addUser").options[cntr]=null;
			cntr--;	
		} 
}



/************************************************************************
Name      : PopulateAll() 
Purpose   : Selects the User from the addUser ListBox and adds it to the
	    axsUser List Box.	
Parameters: None
Return    : Nothing.
************************************************************************/
function RemoveAll()  
{
		var i,cntr;
		var isNew = true;
		var RemLength = document.getElementById("axsUser").length;	
		var AddLength = document.getElementById("addUser").length;		
		var selectedItem; 
		var selectedText;		
		var selectedValue ;				
		var cntr;
	
		for (i=0; i<=RemLength-1; i++)
		{			
				selectedItem = document.getElementById("axsUser").selectedItem;				     
				selectedText = document.getElementById("axsUser").options[i].text;		
				selectedValue = document.getElementById("axsUser").options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById("addUser").options[AddLength] = newoption;					
				AddLength = document.getElementById("addUser").length;
		}
		i=0;	
		cntr = -1;
		for (i=0; i<=RemLength-1; i++)
		{	
			cntr++;		
			document.getElementById("axsUser").options[cntr]=null;
			cntr--;	
		} 
}
function RemoveUsers()  
{
	var i,cntr;
	var isNew = true;
	
	if (document.getElementById("axsUser").selectedIndex !=-1)
	{
		var RemLength = document.getElementById("axsUser").length;	
		var AddLength = document.getElementById("addUser").length;		
		var selectedItem; 		
		var selectedText;		
		var selectedValue ;				
		var cntr;
		
		for (i=0; i<RemLength; i++)
		{			
			if (document.getElementById("axsUser").options[i].selected)
			{	
				selectedItem = document.getElementById("axsUser").selectedItem;				     
				selectedText = document.getElementById("axsUser").options[i].text;		
				selectedValue = document.getElementById("axsUser").options[i].value;		
				newoption = new Option(selectedText, selectedValue, false, false);
				document.getElementById("addUser").options[AddLength] = newoption;				
				AddLength = document.getElementById("addUser").length;

			}

		}
		i=0;
		cntr=0;

		while(i<RemLength)
		{	
			if (document.getElementById("axsUser").options[cntr].selected)
			{					
				document.getElementById("axsUser").options[cntr]=null;
				cntr--;
			}
			 cntr++;
			 i++;
		} 

		document.getElementById("axsUser").selectedIndex=-1;
	}
}

function RetriveUsers(users,ssoid)  
{
		   var strSSOloginid;
		   strUser=new String(users.value);		
		   strUser = strUser.split(",");
		   strSSOloginid = ssoid.split(":");	
	 		
		for (i=0; i<strUser.length; i++)
		{		     
				newoption = new Option(strUser[i], strSSOloginid[i+1], false, false);
				document.frmMain.axsUser.options[i] = newoption;
		}
		
}
function selectAll()
{
    var obj = document.getElementById("axsUser");
    for (var i=0;i<obj.options.length; i++)
	{
	  obj.options[i].value=obj.options[i].value;
      obj.options[i].selected = true;
	  }
	return true;
}
 // List navigation
function prevDetPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;	
	document.getElementById("txtDetail").value = intPg;
 	frm.target ="";
	if(formName=="View")
		strUrl = "viewAuthMatrixDetail.form"
	else	
		strUrl = "editAuthMatrixDetail.form"
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
	if(formName=="View")
		strUrl = "viewAuthMatrixDetail.form"
	else	
		strUrl = "editAuthMatrixDetail.form"
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function goDetPgNmbr(strUrl, totalPages)
{	
	var frm = document.forms["frmMain"];
	frm.target ="";
	var pgNmbr = document.getElementById("goPageNumbr").value;	
	document.getElementById("txtDetail").value = pgNmbr - 1 ;
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
	if(formName=="View")
		strUrl = "viewAuthMatrixDetail.form"
	else	
		strUrl = "editAuthMatrixDetail.form"
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

function onlyNumbers(evt)
{
	var charCode = (evt.which) ? evt.which : evt.keyCode;
	if ((charCode > 31 && (charCode < 48 || charCode > 57)) && !(charCode == 46))
		return false;
	if (charCode == 46)
		return false; 
	return true;
} 


jQuery.fn.sellersClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						var strUrl = "services/authMatrixSeek/avmSvmAdminClientList.json?$sellerId="+$('#sellerId').val();
						if(!isEmpty($('#clientDesc').val()))
						{
							strUrl = strUrl+"&qfilter="+$('#clientDesc').val();
						}
						$.ajax({
									url : strUrl,
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.filterList;
										response($.map(rec, function(item) {
													return {														
														label : item.value,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.value))
							{
								$('#clientId').val(data.name);
								$('#clientDesc').val(data.value);
							}
							reloadForm('addApprovalMatrix.form');
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};