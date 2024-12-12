var checkAll = false;
var ctrlchkindex = "";

function showAdvancedFilter(fncCallbackName,strUrl)
{
	var dlg = $('#advanceFilter');
	dlg.dialog( { 
	              bgiframe:true, autoOpen:false, height:"auto", modal:true, 
	              resizable:true,width:840,title : 'Advanced Filter',
	              closeOnEscape: false,
				  buttons: 
				  { 
		             "Filter": function() 
		                         {
		                           $(this).dialog("close"); 
		                           fncCallbackName.call(null, strUrl);
		                         },
		    		 "Save and Filter": function() 
		                         {
		                           $(this).dialog("close"); 
		                           fncCallbackName.call(null, 'positivePaySaveAndFilter.form');
		                         },
			          Cancel :   function() 
					             {
			        	  			resetPositivePayForm('advanceFilter');
			        	  			persistADvancedFilterFields();
			        	  			$("#orderByFirstSort,#orderBySecondSort,#orderByThirdSort, #orderByFourthSort").change();
					          		$(this).dialog('close'); 
					             }
				  }
				}
			  );
			  
	dlg.dialog('open');
}

function showTxnReport(url)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = url;
	frm.method = "POST";
	frm.submit();
}
function changeAutoRefresh(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function advanceFilterList(strUrl)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();	
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
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

function checkUncheck(field,headerCheckbox)
{
		
	if(headerCheckbox.checked==true && field.length >0)
	{
		for (var i = 0; i < field.length; i++)
		{
			field[i].checked = true ;			
		}
		for (var j = 0; j < field.length; j++)
		{
			acceptRecord(field[j],j);				
		}		
	}
	else if(field.length >0)
	{
		for (i = 0; i < field.length; i++)
		{
			field[i].checked = false ;
		}
		for (j = 0; j < field.length; j++)
		{
			acceptRecord(field[j],j);
			field[j].className = "accept";	
		}				
	}
	else if(headerCheckbox.checked==true)
	{
	    field.checked = true ;	
		acceptRecord(field,0);
	}
	else
	{
	    field.checked = false ;
		acceptRecord(field,0);
		field[0].className = "accept";
	}		
}

function acceptRecord(ctrl, index)
{
    var disablebtn = "FALSE";
    var checkFlag  = "FALSE";
    var disablepaybtn = "FALSE";
    var checkreturnFlag  = "FALSE";
    var downloadBtn = false;
    selectedCheckBox = new Array();    
    
	   if (ctrl.className.indexOf("accept") > -1 && ctrl.className !='accepted')
	   {
		   ctrl.className = "accepted";
		   ctrlchkindex = index;
	   }
	   else
	   {
		   ctrl.className = "accept";
		   ctrlchkindex = -1
	   }
	   for (i=0; i<20; i++)
	   {	   
				   if(document.getElementById("chk_"+i)!=null)
				   {
					   if(document.getElementById("chk_"+i).className == "accepted"
						   && document.getElementById("chkrights_"+i).value == 'N')					   
					   {  
							   if(document.getElementById("enableFlag_"+i).value == "true")
							   {
								   disablebtn = "TRUE";
							   }
							   else
							   {
								   disablebtn = "FALSE";
							   }	   
					   }
					   if(document.getElementById("chk_"+i).className == "accepted") 				   
					   {
						   if(document.getElementById("enableFlag_"+i).value == "true")
						   {						   
							   checkFlag  = "TRUE" ;
						   }
						   else
						   {
							   checkFlag  = "FALSE" ;
						   }
					   }
				   }		   
				   if(document.getElementById("chk_"+i)!=null)
				   {
					   tmp = document.getElementById("chkRequestState_"+i).value;
		   				if(document.getElementById("chk_"+i).className == "accepted"
		   					&& (document.getElementById("chkRequestState_"+i).value == 3 || document.getElementById("chkRequestState_"+i).value == 1 ))				   
		   				{
							   if(document.getElementById("enableFlag_"+i).value == "true")
							   {		   					
								   disablepaybtn = "TRUE";
							   }
							   else
							   {
								   disablepaybtn = "FALSE";
							   }	   
		   				}	
		   				if(document.getElementById("chk_"+i).className == "accepted")				   
		   				{
							   if(document.getElementById("enableFlag_"+i).value == "true")
							   {		   					
								   checkreturnFlag  = "TRUE" ;
							   }
							   else
							   {
								   checkreturnFlag  = "FALSE" ;
							    }
		   				}
		   			}			   
			   if(null !=document.getElementById("chk_"+i))
			   {
				   if(document.getElementById("chk_"+i).checked == true)
		   			{
					   downloadBtn = true;
					   selectedCheckBox[i] = i;
		   			}
			   }		   
	   }
	   if(disablebtn == "FALSE" && checkFlag == "TRUE" && downloadBtn == true)
	   {
		   refreshButtons('11001');
	   }
	   else if(disablepaybtn == "FALSE" && checkreturnFlag == "TRUE" && downloadBtn == true)
	   {
		   refreshButtons('00111');
	   }
	   else
	   {
			if(downloadBtn == true)
			{	   	
				refreshButtons('00001');
			}	   
			else
			{	   	
				refreshButtons('00000');
			}
	   }	   
}

function refreshButtons(strActionButtons)
{
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<5; i++)
		{
			switch (i)
			{
						
				case 0: 
				if (strActionButtons.charAt(i)*1 ==1 && CAN_AUTH == 'true')
				{
					document.getElementById("btnAuth").className ="imagelink black inline button-icon icon-button-accept font_bold";
				}
				else
				{
					document.getElementById("btnAuth").className ="imagelink grey inline button-icon icon-button-accept-grey font-bold";
				}
				break;					
				
				case 1: 
				if (strActionButtons.charAt(i)*1 ==1 && CAN_AUTH == 'true')
				{
					document.getElementById("btnReject").className ="imagelink black inline button-icon icon-button-reject font_bold";
				}
				else
				{
					document.getElementById("btnReject").className ="imagelink grey inline button-icon icon-button-reject-grey font-bold";
				}
				break;
				
				case 2: 
				if (strActionButtons.charAt(i)*1 ==1 && CAN_EDIT == 'true')
				{
					document.getElementById("btnPay").className ="imagelink black inline button-icon icon-button-relese font_bold";
				}
				else
				{
					document.getElementById("btnPay").className ="imagelink grey inline button-icon icon-button-release-grey font-bold";
				}
				break;					
				
				case 3: 
				if (strActionButtons.charAt(i)*1 ==1 && CAN_EDIT == 'true')
				{
					document.getElementById("btnReturn").className ="imagelink black inline button-icon icon-button-stop font_bold";
				}
				else
				{
					document.getElementById("btnReturn").className ="imagelink grey inline button-icon icon-button-stop-grey font-bold";
				}
				break;
				
				case 4: 
				if (strActionButtons.charAt(i)*1 ==1)
				{
					document.getElementById("btnDownloadCsv").className ="imagelink black inline button-icon icon-button-accept font_bold";
				}
				else
				{
					document.getElementById("btnDownloadCsv").className ="imagelink grey inline button-icon icon-button-accept-grey font-bold";
				}
				break;				
			}
		}
	}
}
function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
function showViewPirForm(strUrl, index)
{
    var frm = document.forms["frmMain"]; 
    document.getElementById("txtIndex").value = index;
    document.getElementById("viewState").value = document.getElementById("pirViewState").value;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
function filterList(strUrl)
{
		resetPositivePayForm('advanceFilter');
		document.getElementById("txtCurrent").value = '';
		document.getElementById("txtIndex").value = 0;
		var frm = document.forms["frmMain"]; 
		frm.action = strUrl;
		frm.target = "";	
		frm.method = "POST";
		frm.submit();
}
function showImageForm(strUrl, index,chequeNo)
{
	var frm = document.forms["frmMain"];
	document.getElementById("fileName").value = chequeNo; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function showBackDetail(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function savePositive(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
function acceptrejectrecord()
{
 var disablebtn = "FALSE";
 var checkFlag  = "FALSE";
 ctrlchkindex = "";
    
    for (i=0; i<10; i++)
    {
	    if(document.getElementById("chk_"+i)!=null)
	    {
		    if(document.getElementById("chk_"+i).className == "accepted"
		       && document.getElementById("chkrights_"+i).value == 'Y')
		    {
		      ctrlchkindex = ctrlchkindex + i + ",";
		    }
		}
    } 
    
    for (i=0; i<10; i++)
    {
	    if(document.getElementById("chk_"+i)!=null)
	    {
		    if(document.getElementById("chk_"+i).className == "accepted"
		       && document.getElementById("chkrights_"+i).value == 'N')
		    {
		      disablebtn = "TRUE";
		    }
		    if(document.getElementById("chk_"+i).className == "accepted")
		    {
		       checkFlag  = "TRUE" ;
		    }
		}
    }
    
    if(disablebtn == "FALSE" && checkFlag == "TRUE")
    {
      return ctrlchkindex;
    }
    else
    {
       return '';
    }
}

function payreturnrecord()
{
 var disablepaybtn = "FALSE";
 var checkreturnFlag  = "FALSE";
 ctrlchkindex = "";
    
    for (i=0; i<10; i++)
    {
	    if(document.getElementById("chk_"+i)!=null)
	    {
		    if(document.getElementById("chk_"+i).className == "accepted"
		    	&& (document.getElementById("chkRequestState_"+i).value !== 3 && document.getElementById("chkRequestState_"+i).value !== 1 ))
		    {
		      ctrlchkindex = ctrlchkindex + i + ",";
		    }
		}
    } 
    
    for (i=0; i<10; i++)
    {
	    if(document.getElementById("chk_"+i)!=null)
	    {
		    if(document.getElementById("chk_"+i).className == "accepted"
		    	&& (document.getElementById("chkRequestState_"+i).value == 3 || document.getElementById("chkRequestState_"+i).value == 1 ))
		    {
		    	disablepaybtn = "TRUE";
		    }
		    if(document.getElementById("chk_"+i).className == "accepted")
		    {
		    	checkreturnFlag  = "TRUE" ;
		    }
		}
    }
    
    if(disablepaybtn == "FALSE" && checkreturnFlag == "TRUE")
    {
      return ctrlchkindex;
    }
    else
    {
       return '';
    }
}



function submitAuthRecord(strUrl)
{
    var ctrlchkindex1 =  acceptrejectrecord();
   
    if(ctrlchkindex1!="")
    {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = ctrlchkindex1;
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
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
		frm.action = 'positivePayReject.form';
		frm.method = 'POST';
		frm.submit();
	}
}

function submitRejectRecord(me, rejTitle, rejMsg)
{
   var ctrlchkindex1 =  acceptrejectrecord();
   if(ctrlchkindex1!="")
   {
     getRemarks(230, rejTitle, rejMsg, [ctrlchkindex1], rejectRecord);
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

function filterIssueType(strUrl, radioVal){
	var frm = document.forms["frmMain"];
	$('#advanceFilter').appendTo('#frmMain');
	var issueTypetmp = document.getElementById("issueType").value;
	document.getElementById("issueType").value = radioVal.value;
	var issueTypetmp2 = document.getElementById("issueType").value;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showImageInplace(strUrl, index,chequeNo,element)
{
	var viewState = $('#viewState').val();
	//var csrfTokenName = csrfTokenValue;
	var imageUrl = strUrl + '?' + '&fileName='+chequeNo+'&txtIndex='+index+'&viewState='+viewState+'&'+csrfTokenName+'='+csrfTokenValue;
//	+'&viewState='$('#viewState').val()+'&'+csrfTokenName+'='+csrfTokenValue;
	var $dialog = $('<div></div>')
		.load(imageUrl)
		.dialog({
			autoOpen: true,			
			width: 500,
			height: 300
		});	 
	return false;
//	var frm = document.forms["frmMain"];
//	document.getElementById("fileName").value = chequeNo; 
//	document.getElementById("txtIndex").value = index;
//	frm.action = strUrl;
//	frm.target = "";	
//	frm.method = "POST";
//	frm.submit();
	
}

function getReturnReason(intHeight, strTitle, lblTitle, arrData, fptrCallback) {
	var fld = document.getElementById('decExceptionReasonDialog');
	if (fld) {fld.value = "";}
	_objDialog = $('#returnDialog');
	$('#returnField').text(lblTitle);
	_objDialog.dialog({bgiframe:true, autoOpen:false, height:intHeight, modal:true, resizable:false, width:"320px",
					title: strTitle, open: function(){document.getElementById('taRemarks').focus();},
					buttons: {"Ok": function() {$(this).dialog("close"); _setRemarks(document.getElementById('decExceptionReasonDialog'), arrData, fptrCallback);},
					Cancel: function() {$(this).dialog('destroy');}}});
	_objDialog.dialog('open');
}

function submitReturnRecord(me, rejTitle, rejMsg)
{
   var ctrlchkindex1 =  payreturnrecord();
   if(ctrlchkindex1!="")
   {
	   getReturnReason(230, rejTitle, rejMsg, [ctrlchkindex1], returnRecord);
   }
}

function returnRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255)
	{
		alert("Scrap Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{	    
		frm.decExceptionReason.value = strRemarks;
		frm.txtIndex.value = arrData[0];
		frm.target = "";
		frm.action = 'positivePayReturn.form';
		frm.method = 'POST';
		frm.submit();
	}
}

function submitPayRecord(strUrl)
{
    var ctrlchkindex1 =  payreturnrecord();
   
    if(ctrlchkindex1!="")
    {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = ctrlchkindex1;
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}

function changeSortIcons(linkId, hiddenSortId) {	
	var sortVal = $('#' + hiddenSortId).val();
	switch (sortVal) {
		case 'A' :
			$('#' + linkId).removeClass("icon-collapse-blue");
			$('#' + linkId).addClass("icon-expand-blue");
			break;
		case 'D' :
			$('#' + linkId).removeClass("icon-expand-blue");
			$('#' + linkId).addClass("icon-collapse-blue");
			break;
	}
}
function popupateAdvancedFilterData(data, filterId) {
	var filterData = data.FILTER_DATA;
	resetPositivePayForm('advanceFilter');
	if (filterData) {
		$("#filterCode").val(filterId);
		$("#accountNmbr").val(filterData.accountNmbr);
		$("#instNmbrOption").val(filterData.instNmbrOption);
		$("#instNmbr").val(filterData.instNmbr);
		$("#reqState").val(filterData.reqState);
		$("#defaultAction").val(filterData.defaultAction);
		$("#decExceptionReason").val(filterData.decExceptionReason);
		$("#presentingbankbranch").val(filterData.presentingbankbranch);
		
		$("#amountOption").val(filterData.amountOption);
		$("#amount").val(filterData.amount);
		
		if (filterData.fromDate !== undefined) {
			var filterFromDate = filterData.fromDate;		   
			var fromDate = $.datepicker.parseDate("yy-mm-dd", filterFromDate);		   
			var fromDate = $.datepicker.formatDate(defaultDateFormat, fromDate);
			$('#fromDate').val(fromDate);
		}
		if (filterData.toDate !== undefined) {
			var filterToDate = filterData.toDate;		   
			var toDate = $.datepicker.parseDate("yy-mm-dd", filterToDate);		   
			var toDate = $.datepicker.formatDate(defaultDateFormat, toDate);
			$('#toDate').val(toDate);
		}
		if (filterData.instFromDate !== undefined) {
			var filterInstFromDate = filterData.instFromDate;		   
			var instFromDate = $.datepicker.parseDate("yy-mm-dd", filterInstFromDate);		   
			var instFromDate = $.datepicker.formatDate(defaultDateFormat, instFromDate);
			$('#instFromDate').val(instFromDate);
		}
		if (filterData.instToDate !== undefined) {
			var filterInstToDate = filterData.instToDate;		   
			var instToDate = $.datepicker.parseDate("yy-mm-dd", filterInstToDate);		   
			var instToDate = $.datepicker.formatDate(defaultDateFormat, instToDate);
			$('#instToDate').val(instToDate);
		}
		
		$("#issueType").val(filterData.issueType);
		$("#beneficiaryName").val(filterData.beneficiaryName);
		$("#descStatus").val(filterData.descStatus);
		$("#clearingDesc").val(filterData.clearingDesc);
		$("#decision").val(filterData.decision);
		$("#firstSort").val(filterData.firstSort);
		$("#secondSort").val(filterData.secondSort);
		$("#thirdSort").val(filterData.thirdSort);
		$("#fourthSort").val(filterData.fourthSort);

		$("#orderByFirstSort").val(filterData.orderByFirstSort);
		$("#orderBySecondSort").val(filterData.orderBySecondSort);
		$("#orderByThirdSort").val(filterData.orderByThirdSort);
		$("#orderByFourthSort").val(filterData.orderByFourthSort);
		
		//$("#orderByFirstSort,#orderBySecondSort,#orderByThirdSort, #orderByFourthSort").change();
	} else {
		$("#filterCode").val(filterId);
		$("#firstSort").val('A');
		$("#secondSort").val('A');
		$("#thirdSort").val('A');
		$("#fourthSort").val('A');

	}
	changeSortIcons("orderByFirst_a", "firstSort");
	changeSortIcons("orderBySecond_a", "secondSort");
	changeSortIcons("orderByThird_a", "thirdSort");
	changeSortIcons("orderByFourth_a", "fourthSort");
}

function getFilterData(ctrl, strURL) {
	var filterCodeSelected = ctrl.options[ctrl.selectedIndex].value;
	if(filterCodeSelected == "")
		{
		resetPositivePayForm('advanceFilter');
		$("#firstSort,#secondSort,#thirdSort,#fourthSort").val('A');
		changeSortIcons("orderByFirst_a", "firstSort");
		changeSortIcons("orderBySecond_a", "secondSort");
		changeSortIcons("orderByThird_a", "thirdSort");
		changeSortIcons("orderByFourth_a", "fourthSort");
	} else {
		
		var strData = {};
		strData['recKeyNo'] = ctrl.options[ctrl.selectedIndex].value;
		strData[csrfTokenName] = csrfTokenValue;	
		$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
		$.ajax({
		        type: 'POST',	
		        data:strData,
		        url: strURL,     
		        success: function(data)
		        {
		        	if (data!=null) 
		        	{ 
		        		popupateAdvancedFilterData(data, filterCodeSelected);
				   	}
				}       	
		});
	}
}

function resetPositivePayForm(frmId) {
	$("#"+frmId).find(':input').each(function() {
				switch (this.type) {
					case 'password' :
					case 'select-multiple' :
					case 'select-one' :
					case 'text' :
					case 'textarea' :
						$(this).val('');
						break;
					case 'checkbox' :
					case 'radio' :
						this.checked = false;
				}
			});
}
function changeSortIcons(linkId,hiddenSortId)
{
	var sortVal = $('#' + hiddenSortId).val();
	switch (sortVal) {
		case 'A' :
			$('#' + linkId).removeClass("icon-collapse-blue");
			$('#' + linkId).addClass("icon-expand-blue");
			break;
		case 'D' :
			$('#' + linkId).removeClass("icon-expand-blue");
			$('#' + linkId).addClass("icon-collapse-blue");
			break;
	}
}
function changeSortOrder(linkId,hiddenSortId)
{
	var sortVal = $('#' + hiddenSortId).val();
	switch (sortVal) {
		case 'D' :
			document.getElementById(hiddenSortId).value = "A";
			$('#' + linkId).removeClass("icon-collapse-blue");
			$('#' + linkId).addClass("icon-expand-blue");
			break;
		case 'A' :
			document.getElementById(hiddenSortId).value = "D";
			$('#' + linkId).removeClass("icon-expand-blue");
			$('#' + linkId).addClass("icon-collapse-blue");
			break;
	}
}