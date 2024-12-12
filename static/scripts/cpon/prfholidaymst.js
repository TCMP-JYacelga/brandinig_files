function getCancelConfirmPopUp(strUrl) {
	if (dityBitSet) {

		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		$('#confirmMsgPopup').dialog("open");
		
		$('#cancelConfirmMsgbtn').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneConfirmMsgbtn').bind('click',function(){
			showList(strUrl);
		});
		$('#textContent').focus();
	} else {
		showList(strUrl);
	}
}

function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function goToPage(strUrl)
{
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function submitHolidayProfile(strUrl)
{
	var frm = document.forms["frmMain"];
	if(dityBitSet)
		document.getElementById("dirtyBitSet").value = true;
	enableDisableForm(false);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function enableDisableForm(boolVal) {
	$('#Std').attr('disabled', boolVal);
	$('#custom').attr('disabled', boolVal);
	$('#profileName').attr('disabled', boolVal);
	$('#chargeType').attr('disabled', boolVal);
	$('#module').attr('disabled', boolVal);
	$('#canned').attr('disabled', boolVal);
	$('#holidayY').attr('disabled', boolVal);
	$('#holidayN').attr('disabled', boolVal);
}

function showAddholidayPopup(mode,record,blnViewOld,strOldUrl){
	setDirtyBit();
	var isFutureDate = false;
	var currApplDate = new Date(dtApplicationDate);
	var StrPopUpTitle = '';
	var errorsExists = false;
	$('#holidayPrfDtlErrorDiv').addClass('ui-helper-hidden');
	//No need of conversion if the date format is driven by language master.
	if(!isEmpty(record) && !isEmpty(record.data)) {
		var dtDate = record.data.holidayDate;
		var dateFromRecord = new Date(dtDate);
		if(currApplDate < dateFromRecord)
			isFutureDate = true;
	}
	
	if (!isEmpty(mode) && (mode == 'ADD')) {
		StrPopUpTitle = strAddHldLabel;
		$('#holydayProfCancel').show();
		$('#holydayProfClose').hide();
		$('#holydayProfSubmit').show();
		$('#holydayProfUpdate').hide();
		$('#holidayG,#holidayL').removeClass('disabled');
		$('#holidayG,#holidayL').attr('disabled', false);
		
		$('#holydayProfSubmit').bind('click',function(){
			errorsExists = validateErrorsForMandatoryFields();
			if(!errorsExists){
				submitHolidayProfileDtl('savePrfHolidayDtl.form');
				$('#addholidaypopup').dialog("close");
			}
		});
		if(!isEmpty(holidayType) && 'L' === holidayType) {	
			$('#holidayG').click();
		}
	}
	if(!isEmpty(mode) && (mode == 'EDIT')) {
		StrPopUpTitle = strEditHldLabel;
		$('#holydayProfCancel').show();
		$('#holydayProfClose').hide();
		$('#holydayProfSubmit').hide();
		$('#holydayProfUpdate').show();
		
      	 $('#holydayProfUpdate').bind('click',function(){
	     		if(!isEmpty(record)){
	     			var recordId = record.data.identifier;
	     			$('#viewStateDtl').val(recordId);
	     		}
	     		enableAllFields();
	     		errorsExists = validateErrorsForMandatoryFields();
				if(!errorsExists){
		     		submitHolidayProfileDtl('updatePrfHolidayDtl.form');
		     		$('#addholidaypopup').dialog("close");
				}
	     	});
	}
	if(!isEmpty(mode) && (mode == 'VIEW')) {
		if(blnViewOld == 'TRUE' && record.raw.changeState == 1)
		{
		    strOldUrl = strOldUrl + '&identifier=' + record.raw.identifier;
			Ext.Ajax.request({
				url: strOldUrl,
				method: 'POST',
				headers:
				{
					'Content-Type': 'application/json'
				},
				success: function (response) {
						if(response.responseText != '[]')
								   {
										var jsonData = Ext.decode(response.responseText);
										handleViewChanges(jsonData,record);
								   }
				
				},
				failure: function (response) {
					Ext.Msg.alert('Status', 'Request Failed.');

				}
			});
		}
		StrPopUpTitle = strViewHldLabel;
		$('#holydayProfCancel').hide();
		$('#holydayProfClose').show();
		$('#holydayProfSubmit').hide();
		$('#holydayProfUpdate').hide();
	}
	
	if (!isEmpty(mode) && (mode == 'CLONE')) {
		StrPopUpTitle = strAddHldLabel;
		$('#holydayProfCancel').show();
		$('#holydayProfClose').hide();
		$('#holydayProfSubmit').show();
		$('#holydayProfUpdate').hide();
		
		$('#holydayProfSubmit').bind('click',function(){
			errorsExists = validateErrorsForMandatoryFields();
			if(!errorsExists){
				submitHolidayProfileDtl('savePrfHolidayDtl.form');
				$('#addholidaypopup').dialog("close");
			}
		});
	}
	
	$('#holydayProfCancel').bind('click',function(){
		$('#addholidaypopup').dialog("close");
		$('#addholidaypopup').dialog('destroy');
	});
	
	$('#holydayProfClose').bind('click',function(){
		$('#addholidaypopup').dialog("close");
		$('#addholidaypopup').dialog('destroy');
	});
	
	$('#addholidaypopup').dialog({
		autoOpen : false,
		maxHeight : 550,
		minHeight:156,
		width : 500,
		modal : true,
		resizable: false,
		draggable: false,
		title : StrPopUpTitle,
      open:function(){
    	 var statesDesArray = null;
    	 var selectedStatesCodeArray = null;
    	 var locationDescArray = null;
    	 var selectedLocationCodeArray = null;
    	 var hType=null;
    	 // ADD MODE
    	 if((mode=='ADD') && (mode != 'EDIT') && (mode != 'VIEW') ){
    		$('#holidayDesc').val('');
    	  	$('#holidayDate').val('');
    	  	$('#holidayDesc').attr('disabled', false);
    		$('#holidayDate').attr('disabled', false);
    	  	$('#holidayDesc').removeClass('disabled');
       	  	$('#holidayDate').removeClass('disabled');
		   	// check if holiday type is 'L' or not
		  	if(!isEmpty(holidayType) && 'L' === holidayType){
		  		createStateMultiselect("multiStateCode",
		  				allStateData, null);
		  		createLocationMultiselect("multiClearingLocationCode",
		  				allClearingLocations, locationDescArray, selectedStatesCodeArray);
		  	}
    	 }
    	 // VIEW MODE
    	 else if(!isEmpty(mode) && (mode=='VIEW') && (mode != 'EDIT')){
    		if(!isEmpty(record) && !isEmpty(record.data)){
    			$('#holidayDesc').val(htmlUnescape(record.data.holidayDescription));
        		$('#holidayDate').val(dtDate);
        		
        		if(!isEmpty(record.data.holidayGridState)
      					 && !isEmpty(record.data.holidayDtlState)){
      				 statesDesArray = record.data.holidayGridState.split(',');
      				 selectedStatesCodeArray = record.data.holidayDtlState.split(',');
      			 }
        		savedStateCodeArray = !isEmpty(selectedStatesCodeArray)?selectedStatesCodeArray:savedStateCodeArray;
        		
        		if(!isEmpty(holidayType) && 'L' === holidayType){
        			if(!isEmpty(record.data.holidayType)){
        				hType = record.data.holidayType;
        				$('#holidayG,#holidayL').removeClass('disabled');
        				$('#holidayG,#holidayL').attr('disabled', false);
        				$('#holiday'+hType).click();
        			}        			
	       			 createStateMultiselect("multiStateCode",
	       					 allStateData, selectedStatesCodeArray);
	             		
	       			 if(!isEmpty(record.data.holidayGridLocation)){
	       				 locationDescArray = record.data.holidayGridLocation.split(',');
	       			 }
	       			 if(!isEmpty(record.data.holidayDtlLocation)){
	       				selectedLocationCodeArray = record.data.holidayDtlLocation.split(',');
	       			 }
	       			 createLocationMultiselect("multiClearingLocationCode",
	       					 allClearingLocations,
	       					selectedLocationCodeArray,
	       					 selectedStatesCodeArray);
        		}
    		}
    		$('#holidayDesc').attr('disabled', true);
    		$('#holidayDate').attr('disabled', true);
    		$('#holidayDesc').addClass('disabled');
       	  	$('#holidayDate').addClass('disabled');
	       	$('#holidayG,#holidayL').addClass('disabled');
			$('#holidayG,#holidayL').attr('disabled', true);
			$('#multiStateCode').multiselect('disableOptionsOnly');
			$('#multiClearingLocationCode').multiselect('disableOptionsOnly');
    	 }
    	 // EDIT MODE
    	 else if(mode == 'EDIT'){
    		 if(!isEmpty(record) && !isEmpty(record.data)){
     			 $('#holidayDesc').val(htmlUnescape(record.data.holidayDescription));
         		 $('#holidayDate').val(dtDate);
         		 
         		if(!isEmpty(record.data.holidayGridState)
      					 && !isEmpty(record.data.holidayDtlState)){
      				 statesDesArray = record.data.holidayGridState.split(',');
      				 selectedStatesCodeArray = record.data.holidayDtlState.split(',');
      			 }
         		savedStateCodeArray = !isEmpty(selectedStatesCodeArray)?selectedStatesCodeArray:savedStateCodeArray;
         		 
         		 if(!isEmpty(holidayType) && 'L' === holidayType){
         			 if(!isEmpty(record.data.holidayType)){
         				$('#holidayG,#holidayL').removeClass('disabled');
         				$('#holidayG,#holidayL').attr('disabled', false);
         				 hType = record.data.holidayType;
         				 $('#holiday'+hType).click();
         			 }
         			 
	       			 createStateMultiselect("multiStateCode",
	       					 allStateData, selectedStatesCodeArray);
	             		
	       			 if(!isEmpty(record.data.holidayGridLocation)){
	       				 locationDescArray = record.data.holidayGridLocation.split(',');
	       			 }
	       			 if(!isEmpty(record.data.holidayDtlLocation)){
	       				selectedLocationCodeArray = record.data.holidayDtlLocation.split(',');
	       			 }
	       			 createLocationMultiselect("multiClearingLocationCode",
	       					 allClearingLocations,
	       					selectedLocationCodeArray,
	       					 selectedStatesCodeArray);
         		 }
     		}
    		 if (isAuthorised === 'true' && record.data.isUpdated==false) {
    			 $('#holidayDesc').attr('disabled', false);
    			 $('#holidayDesc').removeClass('disabled');
    			 // if not future dated then disable
    			 if(!isFutureDate) {
    				 $('#holidayDate').attr('disabled', true);
	    			 $('#holidayDate').addClass('disabled');
    			 } else {
    				 $('#holidayDate').attr('disabled', false);
    				 $('#holidayDate').removeClass('disabled');
    			 }
    			 //$('#holidayG,#holidayL').addClass('disabled');
    			 //$('#holidayG,#holidayL').attr('disabled', true);
    			 //$('#multiStateCode').multiselect('disableOptionsOnly');
    			 //$('#multiClearingLocationCode').multiselect('disableOptionsOnly');
    		 } else {
    			 $('#holidayDesc').attr('disabled', false);
    			 $('#holidayDate').attr('disabled', false);
    			 $('#holidayDesc').removeClass('disabled');
    			 $('#holidayDate').removeClass('disabled');
    		 }
    	 }
    	 // CLONE MODE
    	 else if(mode == 'CLONE'){
	 		 if(!isEmpty(record) && !isEmpty(record.data)){
	 			 $('#holidayDesc').val(htmlUnescape(record.data.holidayDescription));
	 			 $('#holidayDate').val(dtDate);
	 			 
	 			 if(!isEmpty(record.data.holidayGridState)
	     				 && !isEmpty(record.data.holidayDtlState)){
	     			 statesDesArray = record.data.holidayGridState.split(',');
	     			 selectedStatesCodeArray = record.data.holidayDtlState.split(',');
	     		 }
	     		savedStateCodeArray = !isEmpty(selectedStatesCodeArray)?selectedStatesCodeArray:savedStateCodeArray;
	 			 
	 			 if(!isEmpty(holidayType) && 'L' === holidayType){
	 				 if(!isEmpty(record.data.holidayType)){
	 					 hType = record.data.holidayType;
	 					 $('#holiday'+hType).click();
	 				 }
		     		
		     		 createStateMultiselect("multiStateCode",
		     				 allStateData, selectedStatesCodeArray);
		           		
		     		 if(!isEmpty(record.data.holidayGridLocation)){
		     			 locationDescArray = record.data.holidayGridLocation.split(',');
		     		 }
		     		 if(!isEmpty(record.data.holidayDtlLocation)){
		     			 selectedLocationCodeArray = record.data.holidayDtlLocation.split(',');
		     		 }
		     		 createLocationMultiselect("multiClearingLocationCode", allClearingLocations,
		     				 selectedLocationCodeArray, selectedStatesCodeArray);
	     			 }
	 		 }
	 		 $('#holidayDesc').attr('disabled', false);
	 		 $('#holidayDate').attr('disabled', false);
	 		 $('#holidayDesc').removeClass('disabled');
	 		 $('#holidayDate').removeClass('disabled');
    	 }    	 
      },
	  close : function(){
		  if(blnViewOld == 'TRUE')
		  {
			  var eleVal = document.getElementById('holidayDescription');
			  if(eleVal!= null)
			  {
			   eleVal.removeChild(eleVal.lastChild);
			  }
				var eleVal = document.getElementById('holidayLocation');
				eleVal.removeChild(eleVal.lastChild);
				var eleVal = document.getElementById('holidayState');
				eleVal.removeChild(eleVal.lastChild);
			   $('#holidayTypeLocation').removeClass('deletedFieldValue');
			   $('#holidayTypeGeneral').removeClass('deletedFieldValue');
			  
		  }
		  $(this).dialog('destroy');
	  }
	});
	$('#addholidaypopup').dialog("open");
	$('#holidayDesc').focus();
}

function submitHolidayProfileDtl(strUrl){
	populateStateAndLocationList();
	var frm = document.forms["frmDtlMain"];
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'PAGEMODE', modeVal));
	document.body.appendChild(frm);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function populateStateAndLocationList()
{
	var myDropDownListValues = $("#multiStateCode").multiselect("getChecked").map(function()
	{
		return this.value;
	}).get();
	$('#holidayDtlState').val(myDropDownListValues + '');

	myDropDownListValues = $("#multiClearingLocationCode").multiselect("getChecked").map(function()
	{
		return this.value;
	}).get();
	$('#holidayDtlLocation').val(myDropDownListValues + '');
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
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecordList(strUrl)
{
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record");
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableRecordList(strUrl)
{
	var frm = document.forms["frmMain"]; 
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record");
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(me,strUrl)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record");
		return;
	}	
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function getRejectRecord(me, rejTitle, rejMsg,strUrl)
{
    var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record");
		return;
	}
	getRemarks(230, rejTitle, rejMsg, strUrl, rejectRecord);
}

function rejectRecord(arrData, strRemarks,strUrl)
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
		frm.target = "";
		frm.action = arrData;
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteList(me,strUrl)
{
    var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record");
		return;
	} 
	deleteRecord(document.getElementById("updateIndex").value,strUrl);
}

function deleteRecord(arrData,strUrl)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = arrData;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
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
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function selectRecord(ctrl, status, index, maker)
{
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if (index.length < 2)
	{
		index = '0' + index;
	}	
	var aPosition = strAuthIndex.indexOf(index);
    var mapPosition;	
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap = document.getElementById("bitmapval").value;
	var lenLooplen;
	if (aPosition >= 0)
	{
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 2),"");
		mapPosition = strActionMap.indexOf(index+":");
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 7),"");
	}
	else
	{
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		strCurrentAction = arrActionMap[status];
		document.getElementById("actionmap").value = index+":"+ strCurrentAction +","+document.getElementById("actionmap").value ;
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
		refreshButtons(maker);
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(maker);
	}	
}

function performAnd(validAction,currentAction)
{
	var strOut = "";
	var i = 0;
	if (validAction.length = currentAction.length)
	{
		for (i=0; i<5; i++)
		{
			strOut = strOut +((validAction.charAt(i)*1) && (currentAction.charAt(i)*1));
		}
	}
	return strOut;
}

function refreshButtons(maker)
{
	var strPopultedButtons=document.getElementById("bitmapval").value;
	var strActionButtons;	
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd(strPopultedButtons,_strServerBitmap);	
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<5; i++)
		{
				switch (i)
				{
					case 0: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					}
					else
					{
						document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					}
					break;					
					
					case 1: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
					}
					else
					{
						document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					}
					break;
					
					case 2: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnEnable").className ="imagelink black inline_block button-icon icon-button-enable font_bold";
					}
					else
					{
						document.getElementById("btnEnable").className ="imagelink grey inline_block button-icon icon-button-enable-grey font-bold";
					}
					break;
					
					case 3: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnDisable").className ="imagelink black inline_block button-icon icon-button-disable font_bold";
					}
					else
					{
						document.getElementById("btnDisable").className ="imagelink grey inline_block button-icon icon-button-disable-grey font-bold";
					}
					break;
						
					case 4: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
					}
					else
					{
						document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					}
					break;
				}
		}
	}	
}

// Details
function addDetail(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

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

function htmlUnescape(value){
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function enableAllFields(){
	$('#holidayDesc').attr('disabled', false);
	$('#holidayDesc').removeClass('disabled');
	$('#holidayDate').attr('disabled', false);
	$('#holidayDate').removeClass('disabled');
	$('#holidayG,#holidayL').removeClass('disabled');
	$('#holidayG,#holidayL').attr('disabled', false);
	$('#multiStateCode').multiselect('enableOptionsOnly');
	$('#multiClearingLocationCode').multiselect('enableOptionsOnly');
}

function validateErrorsForMandatoryFields(){
	var returnValue = false;
	$('#holidayPrfDtlErrorMessage').empty();
	
	if($('#holidayDesc').val().trim() === ''){
		paintHolidayError('#holidayPrfDtlErrorDiv','#holidayPrfDtlErrorMessage','Holiday Description is required.');
		returnValue = true;
	}
	
	if($('#holidayDate').val() === ''){
		paintHolidayError('#holidayPrfDtlErrorDiv','#holidayPrfDtlErrorMessage','Holiday Date is required.');
		returnValue = true;
	}
	
	if($('#holidayL').is(':checked')){
		if($("#multiClearingLocationCode").multiselect("getChecked").length == 0)
		{
			paintHolidayError('#holidayPrfDtlErrorDiv','#holidayPrfDtlErrorMessage','Location is required.');
			returnValue = true;
		}
	}
	
	return returnValue;
}

function paintHolidayError(errorDiv,errorMsgDiv,errorMsg){
	if(!isEmpty(errorMsg) && !$(errorDiv).is(':visible') ){
		$(errorDiv).removeClass('ui-helper-hidden');
	}
	element = $('<li class="error-msg-color">').text(errorMsg);
	element.appendTo(errorMsgDiv);
}
function viewChanges(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			'VIEW_MODE', "VIEW_CHANGES"));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function handleViewChanges(jsonData,record)
{
    var oldHolidayDesc = jsonData.holidayDescription;
	var oldHolidayType = jsonData.holidayType;
	var oldGridState = jsonData.holidayGridState;
	var oldGridLoc = jsonData.holidayGridLocation;
	if(oldHolidayDesc !='' && oldHolidayDesc != record.raw.holidayDescription)
	{
		var ele = document.getElementById('holidayDescription');
		var div = getElementDiv(ele,oldHolidayDesc,"modifiedFieldValue");
	    ele.append(div);
	}
	if(oldHolidayType!='' && oldHolidayType != record.raw.holidayType)
	{
		if(jsonData.holidayType == 'G')
		{
			var ele = document.getElementById('holidayTypeGeneral');
		}
		else
		{
		   var ele = document.getElementById('holidayTypeLocation');
		}
		ele.className += "deletedFieldValue";
	}
	if(oldGridLoc !='' && oldGridLoc != record.raw.holidayGridLocation)
	{
	  
	  var newLocList = record.raw.holidayGridLocation;
		//$("#holidayLocation").multiselect({multiple:true});
		var ele = document.getElementById('holidayLocation');
		var div = getElementDiv(ele,oldGridLoc,"modifiedFieldValue");
		ele.append(div);
		//comparelist and find new,deleteList
		var newList,delList,diffList;
		if(newLocList.includes(',') && oldGridLoc.includes(','))
		{
			var oldLocArray =  oldGridLoc.split(",");
		    var newLocArray =  newLocList.split(",");
	        diffList = oldLocArray.filter(x => newLocArray.indexOf(x) === -1);
			delList = diffList.filter(x => newLocArray.indexOf(x) === -1);	
			diffList = newLocArray.filter(x => oldLocArray.indexOf(x) === -1);
			newList = diffList.filter(x => oldLocArray.indexOf(x) === -1);
			
       			newList = newLocArray.filter(x => oldLocArray.indexOf(x) === -1);
				$("#multiClearingLocationCode option").each(function(){			
				     if(jQuery.inArray($(this).context.outerText, newList) != -1){		
						$('input[value="' + $(this).val() +'"]').parent().addClass("newFieldGridValue")		
					}	
				});			
			
			
				delList = oldLocArray.filter(x => newLocArray.indexOf(x) === -1);
				$("#multiClearingLocationCode option").each(function(){			
				     if(jQuery.inArray($(this).context.outerText, delList) != -1){		
						$('input[value="' + $(this).val() +'"]').parent().addClass("deletedFieldValue")		
					}	
				});
			
		}
	}
	if(oldGridState!='' && oldGridState != record.raw.holidayGridState)
	{
		var ele = document.getElementById('holidayState');
		var div = getElementDiv(ele,oldGridState,"modifiedFieldValue");
		ele.append(div);
		//comparelist and find new,deleteList
		var newStateList = record.raw.holidayGridState;
		var diffList,newList,delList,newStateArray,oldStateArray;
		if(newStateList.includes(',') && oldGridState.includes(','))
		{
			oldStateArray =  oldGridState.split(", ");
		    newStateArray =  newStateList.split(", ");
			diffList = oldStateArray.filter(x => newStateArray.indexOf(x) === -1);
			delList = diffList.filter(x => newStateArray.indexOf(x) === -1);	
			diffList = newStateArray.filter(x => oldStateArray.indexOf(x) === -1);
			newList = diffList.filter(x => oldStateArray.indexOf(x) === -1);
			$("#multiStateCode option").each(function(){			
				     if(jQuery.inArray($(this).context.outerText,newList) != -1){		
						$('input[value="' + $(this).val() +'"]').parent().addClass("newFieldGridValue")		
					}	
			});	
           $("#multiStateCode option").each(function(){			
				     if(jQuery.inArray($(this).context.outerText,delList) != -1){		
						$('input[value="' + $(this).val() +'"]').parent().addClass("deletedFieldValue")		
					}	
			});
		}
	}
}