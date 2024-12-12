function setDirtyBit() {
	document.getElementById("dirtyBit").value = "1";
}

function enabledisableTextField(fieldVal,disableVal) {
		$('#'+fieldVal).attr('disabled',disableVal);
}

function setCheckUncheck(flag, field)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/icons/icon_checked.gif');
	}
	else
	{
		$('#'+field).attr('src','static/images/icons/icon_unchecked.gif');
	}
	
	if("chkChildEnrichFlag" === field){
		hideShowApiIOParamDiv(flag);
	}
}

function hideShowApiIOParamDiv(flag){
	if('Y' === flag){
		
		$('#objectApiDetailsDiv').show();
		if(apiIOParamlist.length <= 2 && !apiName){
			disableIpRowAddLink();
			disableOpRowAddLink();
		}
	}
}

function toggleCheckbox(elem,fieldVal) {
	var image = elem.getElementsByTagName("IMG")[0];
	if (image.src.indexOf("icon_checked.gif") == -1) {
		image.src = "static/images/icons/icon_checked.gif";
		$('#'+fieldVal).val('Y');
	} else {
		image.src = "static/images/icons/icon_unchecked.gif";
		$('#'+fieldVal).val("N");
	}
}

function toggleCheckboxYesNo(elem,fieldVal,actVal) {
	var image = elem.getElementsByTagName("IMG")[0];
	if (image.src.indexOf("icon_checked.gif") == -1) {
		image.src = "static/images/icons/icon_checked.gif";
	} else {
		image.src = "static/images/icons/icon_unchecked.gif";
	}
	$('#'+fieldVal).val(actVal);
}

function toggleCheckUnchekEnable(imgElement,fieldId)
{
    var enrichDataTypeVal =  $('#enrichDataType').val();
    
    if(enrichDataTypeVal){
		if(enrichDataTypeVal === "D"){
			fieldId = fieldId;	
			
		}else if(enrichDataTypeVal === "N"){
			fieldId = fieldId;
			
		}else if(enrichDataTypeVal === "A"){
			fieldId = fieldId;		
		}	
     }
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
	{
		imgElement.src = "static/images/icons/icon_checked.gif";
		$('#'+fieldId).removeAttr("disabled");
		if( fieldId === 'minValue' || fieldId === 'maxValue')
		{
			$('#'+fieldId).val((0).toFixed(strMinFraction));
			if( fieldId === 'minValue')
				$('#minValueFlag').val('Y');
			if( fieldId === 'maxValue')
				$('#maxValueFlag').val('Y');
		}
		if( fieldId === 'minValueDate')
		{
			$('#'+fieldId).removeAttr("disabled");
			if( fieldId === 'minValueDate')
				$('#minValueFlag').val('Y');
		}
		if( fieldId === 'maxValueDate')
		{
			$('#'+fieldId).removeAttr("disabled");
			if( fieldId === 'maxValueDate')
				$('#maxValueFlag').val('Y');
		}
		if( fieldId === 'minValueNumber')
		{
			$('#'+fieldId).val((0));
			$('#'+fieldId).removeAttr("disabled");
			if( fieldId === 'minValueNumber')
				$('#minValueFlag').val('Y');
		}
		if( fieldId === 'maxValueNumber')
		{
			$('#'+fieldId).val((0));
			$('#'+fieldId).removeAttr("disabled");
			if( fieldId === 'maxValueNumber')
				$('#maxValueFlag').val('Y');
		}
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		
		if( fieldId === 'minValue' || fieldId === 'maxValue')
		{
			$('#'+fieldId).val((0).toFixed(strMinFraction));
			if( fieldId === 'minValue')
				$('#minValueFlag').val('N');
			if( fieldId === 'maxValue')
				$('#maxValueFlag').val('N');
		}
		else if( fieldId === 'minValueDate')
		{
			$('#'+fieldId).val(' ');
			$('#'+fieldId).attr("disabled","true");
			if( fieldId === 'minValueDate')
				$('#minValueFlag').val('N');
		}
		else if( fieldId === 'maxValueDate')
		{
			$('#'+fieldId).val(' ');	
			$('#'+fieldId).attr("disabled","true");		
			if( fieldId === 'maxValueDate')
				$('#maxValueFlag').val('N');
		}else if( fieldId === 'minValueNumber')
		{
			$('#'+fieldId).val((0));
			$('#'+fieldId).attr("disabled","true");
			if( fieldId === 'minValueNumber')
				$('#minValueFlag').val('N');
			
		}else if( fieldId === 'maxValueNumber')
		{
			$('#'+fieldId).val((0));
			$('#'+fieldId).attr("disabled","true");
			if( fieldId === 'maxValueNumber')
				$('#maxValueFlag').val('N');
		}
		else {
			$('#'+fieldId).val(' ');
			$('#'+fieldId).attr("disabled","true");
		}
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

function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function submitEnrichmentDefinition(strUrl) {
	if($(event.target).attr("disabled") != "disabled")
	{
		$(event.target).attr("disabled","disabled");
		clearCustomErrorMessageDiv();
		var frm = document.forms["frmMain"];
		enableDisableForm(false);
		frm.action = strUrl;
		frm.target = "";
		populateEnrichmentMinMaxLengthForRadioButton();
		populateAllListValuesDetails();
		populateIpParamDetails();
		populateOpParamDetails();
		frm.method = "POST";
		frm.submit();
	}
}

function populateIpParamDetails()
{
	var strTempIpParamJson;	
		var values = [];		
		$('[id^=inputParamNm]').each(function() {
			values.push($(this).val());
		});	
		var codes = [];
		$('[id^=inputFieldType]').each(function() {
			codes.push($(this).val());
		});	
		var descs = [];
		$('[id^=inputFieldName]').each(function() {
			descs.push($(this).val());
		});		
		var constVal = [];
		$('input:text[id^=inputConstValue]').each(function() {
			constVal.push($(this).val());
		});	
		var recKeys = [];
		$('input:hidden[id^=ipRecKey]').each(function() {
			recKeys.push($(this).val());
		});	
		var deleteKeys = [];
		$('#gridLstInputValueTable input:hidden[id^=isDelete]').each(function() {
			deleteKeys.push($(this).val());
		});		
		var modifiedKeys = [];
		$('#gridLstInputValueTable input:hidden[id^=isModified]').each(function() {
			modifiedKeys.push($(this).val());
		});

		for(i=0;i<values.length;i++)
		{
			strTempIpParamJson = '{value:"'+values[i]+'",code:"'+codes[i]+'",desc:"'+descs[i]+'",const:"'+constVal[i]+'",isDelete:"'+deleteKeys[i]+'",recKeyNo:"'+recKeys[i]+'",isModified:"'+modifiedKeys[i]+'"}';
			if(i==0)
			{
				$('#ipFieldDtlJson').val('['+strTempIpParamJson);
			}
			else
			{
				$('#ipFieldDtlJson').val($('#ipFieldDtlJson').val()+','+strTempIpParamJson);	
			}
		}
		if($('#ipFieldDtlJson').val()!=''){
			$('#ipFieldDtlJson').val($('#ipFieldDtlJson').val()+']');
		}
}

function populateOpParamDetails()
{
	var strTempOpParamJson;	
		var opValues = [];		
		$('[id^=outputParamNm]').each(function() {
			opValues.push($(this).val());
		});	
		var codes = [];
		$('[id^=outputFieldType]').each(function() {
			codes.push($(this).val());
		});	
		var descs = [];
		$('[id^=outputFieldName]').each(function() {
			descs.push($(this).val());
		});		
		var defVal = [];
		$('input:text[id^=outputDefValue]').each(function() {
			defVal.push($(this).val());
		});				
		var recKeys = [];
		$('input:hidden[id^=opRecKey]').each(function() {
			recKeys.push($(this).val());
		});		
		var deleteKeys = [];
		$('#gridLstOutputValueTable input:hidden[id^=isDelete]').each(function() {
			deleteKeys.push($(this).val());
		});
		var editableFlags = [];
		$('input:hidden[id^=outputEditableCheckValue]').each(function() {
			editableFlags.push($(this).val());
		});		
		var modifiedKeys = [];
		$('#gridLstOutputValueTable input:hidden[id^=isModified]').each(function() {
			modifiedKeys.push($(this).val());
		});	
		
		for(i=0;i< opValues.length;i++)
		{
			strTempOpParamJson = '{value:"'+opValues[i]+'",code:"'+codes[i]+'",desc:"'+descs[i]+'",const:"'+defVal[i]+'",isDelete:"'+deleteKeys[i]+'",recKeyNo:"'+recKeys[i]+'",editableFlag:"'+editableFlags[i]+'",isModified:"'+modifiedKeys[i]+'"}';
			if(i==0)
			{
				$('#opFieldDtlJson').val('['+strTempOpParamJson);
			}
			else
			{
				$('#opFieldDtlJson').val($('#opFieldDtlJson').val()+','+strTempOpParamJson);	
			}
		}		
		if($('#opFieldDtlJson').val()!=''){
			$('#opFieldDtlJson').val($('#opFieldDtlJson').val()+']');
		}
}

function populateAllListValuesDetails()
{
	var strTempLstValueJson='';	
	var checkedFvRb = $('input[name=valiationType]:radio:checked').val();
		if(checkedFvRb=='P')
		{
			var values = [];		
			$('input:text[id^=paramValue]').each(function() {
				values.push($(this).val());
			});	
		}
		var codes = [];
		$('input:text[id^=paramCode]').each(function() {
			codes.push($(this).val());
		});	
		var descs = [];
		$('input:text[id^=paramDesc]').each(function() {
			descs.push($(this).val());
		});		
		var recKeys = [];
		$('input:hidden[id^=paramRecKey]').each(function() {
			recKeys.push($(this).val());
		});		
		
		var parentOptCodes = [];
		$('select:[id^=paramValue]').each(function() {
			parentOptCodes.push($(this).val());
		});
		
		var deleteKeys = [];
		$('input:hidden[id^=isDelete]').each(function() {
			deleteKeys.push($(this).val());
		});
		
		var valueNmbrKeys = [];
		$('input:hidden[id^=valueNmbr]').each(function() {
			valueNmbrKeys.push($(this).val());
		});
		
		var modifiedKeys = [];
		$('input:hidden[id^=isModified]').each(function() {
			modifiedKeys.push($(this).val());
		});	
		for(i=1;i<=codes.length;i++)
		{			
			if(checkedFvRb=='P')
			{
				strTempLstValueJson = '{value:"'+values[i-1]+'",code:"'+codes[i-1]+'",desc:"'+descs[i-1]+'",isDelete:"'+deleteKeys[i-1]+'",valueNmbr:"'+valueNmbrKeys[i-1]+'",recKeyNo:"'+recKeys[i-1]+'",parentOptCode:"'+parentOptCodes[i-1]+'",isModified:"'+modifiedKeys[i]+'"}';
				//console.log(strTempLstValueJson);
			}
			if(checkedFvRb=='Y')
			{
				strTempLstValueJson = '{code:"'+codes[i-1]+'",desc:"'+descs[i-1]+'",isDelete:"'+deleteKeys[i-1]+'",valueNmbr:"'+valueNmbrKeys[i-1]+'",recKeyNo:"'+recKeys[i-1]+'",isModified:"'+modifiedKeys[i]+'"}';
			}
			if (i == 1) {
				$('#parentListDtlJson').val('[' + strTempLstValueJson);
			} else if (!isEmpty($('#parentListDtlJson').val())) {
				$('#parentListDtlJson').val($('#parentListDtlJson').val() + ','
						+ strTempLstValueJson);
			} else {
				$('#parentListDtlJson').val(strTempLstValueJson);
			}
			
		}		
		if($('#parentListDtlJson').val() != '')
		$('#parentListDtlJson').val($('#parentListDtlJson').val()+']');
}


function enableDisableForm(boolVal) {
	$('#productCode').attr('disabled', boolVal);
	$('#enrichmentCode').attr('disabled', boolVal);
	$('#enrichLabelDescription').attr('disabled',boolVal);
	$('#enrichMinLength').attr('disabled', boolVal);
	$('#enrichMaxLength').attr('disabled',boolVal);
	$('#enrFieldType').attr('disabled',boolVal);
	$('#custom').attr('disabled',boolVal);
}

function getCancelConfirmPopUp(strUrl) {
	if (document.getElementById("dirtyBit").value == '1') 
	{	
		$('#textContent').text(updateMsgText);
		
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
	$('#cancelBackConfirmMsg').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});
	
	$('#doneBackConfirmMsgbutton').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
		goToPage(strUrl);
	});	
	$('#textContent').focus();	
	}
	else
	{
		goToPage(strUrl);
	}	
	
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
function goToPage(strUrl) {
	clearCustomErrorMessageDiv();
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showViewForm(strUrl, index)
{
	clearCustomErrorMessageDiv();
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	clearCustomErrorMessageDiv();
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
		alert("Select Atlease One Record")
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
		alert("Select Atlease One Record")
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
		alert("Select Atlease One Record")
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
		alert("Select Atlease One Record")
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
	//alert('the final bitmap::' + strActionButtons);
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

function enrFieldTypeOnChangeRender( value, onLoadFlag )
{
	if( value == 'T' || value == '' )
	{
		if( !onLoadFlag )
		{
			document.getElementById("enrichDataType").selectedIndex = 0;
			$('#enrichDataType').removeAttr('disabled');
			
			document.getElementById('custom').checked = false;
			
			if('CB'!=txnType && 'PB'!=txnType )
			{ 
				$('#custom').removeAttr('disabled');
				$('#Std').removeAttr('disabled');
			}
			document.getElementById('Std').checked = true;
			
			$('#enrichMinLength').val('');
			$('#enrichMinLength').removeAttr('disabled');
			$('#enrichMaxLength').val('');
			$('#enrichMaxLength').removeAttr('disabled');
			$('#enrichMinLengthId').removeClass('required-lbl-right');
			$('#enrichMaxLengthId').removeClass('required-lbl-right');
			
			document.getElementById("enrichFormat").selectedIndex = 0;
			$('#enrichFormat').removeAttr('disabled');			
	
			if(value == '')
			{
				$('#minValue').val('');
				$('#minValue').attr("disabled","true");
				$('#maxValue').val('');
				$('#maxValue').attr("disabled","true");
				$('#chkminValue').removeAttr("onclick");		
				$('#chkmaxValue').removeAttr("onclick");
				$('#chkminValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');		
				$('#chkmaxValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
			}
			document.getElementById("useInTxnAmtComputation").selectedIndex = 0;
			$('#useInTxnAmtComputation').removeAttr('disabled');			
			
			$('input[name="valiationType"][id="novalidation"]').prop('checked', true);
			hideShowLstValueDiv(document.getElementById("novalidation"));
			for( var cnt = 0; cnt < gridLstValuesTable.rows.length - 1; cnt++ )
			{
				deleteLstValuesRow(cnt);
			}
			//addLstValuesRow();
	    	$('input[name="valiationType"]').removeAttr('disabled');
	    	
	    	$('#childEnrichmentsandotherfields').attr('onclick',"hideShowObjectApiDiv(this,'childEnrichFlag')");
			$('#chkChildEnrichFlag').attr('src', 'static/images/icons/icon_unchecked.gif');
		}
		
	}
	else if( value == 'C' )
	{
		document.getElementById("enrichDataType").selectedIndex = 1;
		$('#enrichDataType').attr('disabled','true');
		if('CB'!=txnType && 'PB'!=txnType )
		{
			$('#custom').removeAttr( 'disabled' );
		    $('#Std').removeAttr('disabled');
		}

		if(!onLoadFlag){
			$('#enrichMinLength').val('');
			$('#enrichMaxLength').val('');
		}

		$('#enrichMinLength').attr("disabled","true");

		$('#enrichMaxLength').attr("disabled","true");

		document.getElementById("enrichFormat").selectedIndex = 0;
		$('#enrichFormat').attr('disabled','true');

		$('#minValue').val('');
		$('#minValue').attr("disabled","true");
		$('#maxValue').val('');
		$('#maxValue').attr("disabled","true");
		$('#chkminValue').removeAttr("onclick");
		$('#chkmaxValue').removeAttr("onclick");
		$('#chkminValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		$('#chkmaxValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		$('#enrichMinLengthId').removeClass('required-lbl-right');
		$('#enrichMaxLengthId').removeClass('required-lbl-right');

		document.getElementById("useInTxnAmtComputation").selectedIndex = 0;
		$('#useInTxnAmtComputation').attr('disabled','true');

		$('input[name="valiationType"][id="novalidation"]').prop('checked', true);
		hideShowLstValueDiv(document.getElementById("novalidation"));
		for( var cnt = 0; cnt < gridLstValuesTable.rows.length - 1; cnt++ )
		{
			deleteLstValuesRow(cnt);
		}
		$('input[name="valiationType"]').attr('disabled', 'disabled');
		$('#childEnrichmentsandotherfields').removeAttr("onclick");
		$('#chkChildEnrichFlag').attr('src', 'static/images/icons/icon_unchecked_grey.gif');

		$('#chkChildEnrichFlag').val("N");
		$(".ipRow").remove();
		$(".opRow").remove();
		$('#objApiName').val('');
		$('#objectApiDetailsDiv').hide();

	}
	else if( value == 'R' )
	{
		document.getElementById("enrichDataType").selectedIndex = 1;
		$('#enrichDataType').attr('disabled','true');
		if('CB'!=txnType && 'PB'!=txnType )
		{
			$('#custom').removeAttr( 'disabled' );
		    $('#Std').removeAttr('disabled');
		}

		if(!onLoadFlag){
			$('#enrichMinLength').val('');
			$('#enrichMaxLength').val('');
		}
		$('#enrichMinLength').attr("disabled","true");
		$('#enrichMaxLength').attr("disabled","true");
		
		document.getElementById("enrichFormat").selectedIndex = 0;
		$('#enrichFormat').attr('disabled','true');
		
		$('#minValue').val('');
		$('#minValue').attr("disabled","true");
		$('#maxValue').val('');
		$('#maxValue').attr("disabled","true");
		$('#chkminValue').removeAttr("onclick");		
		$('#chkmaxValue').removeAttr("onclick");
		$('#chkminValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');		
		$('#chkmaxValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		$('#enrichMinLengthId').removeClass('required-lbl-right');
		$('#enrichMaxLengthId').removeClass('required-lbl-right');		
		document.getElementById("useInTxnAmtComputation").selectedIndex = 0;
		$('#useInTxnAmtComputation').attr('disabled','true');
		
		if( !onLoadFlag )
		{
			$('input[name="valiationType"][id="lstOfValues"]').prop('checked', true);
			hideShowLstValueDiv(document.getElementById("lstOfValues"));
			lstValueCnt = lstValueCnt - 1;
			addLstValuesRow();
			for( var cnt = 0; cnt < gridLstValuesTable.rows.length - 1; cnt++ )
			{
				deleteLstValuesRow(cnt);
			}
		}
		if( errFlag == 'true' )
		{
			$('input[name="valiationType"][id="lstOfValues"]').prop('checked', true);
			hideShowLstValueDiv(document.getElementById("lstOfValues"));
		}
		$('#lovOrPDiv').hide();
		$('#adhocValueFlag').val("N");
		$('input[name="valiationType"][id="novalidation"]').attr('disabled', 'disabled');
		$('input[name="valiationType"][id="depenlstOfValues"]').attr('disabled', 'disabled');
		
		$('#childEnrichmentsandotherfields').removeAttr("onclick");
		$('#chkChildEnrichFlag').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		
		$('#chkChildEnrichFlag').val("N");
		$(".ipRow").remove();
		$(".opRow").remove();
		$('#objApiName').val('');
		$('#objectApiDetailsDiv').hide();	
	}
}
function disableAddButton()
{
	if( $("#enrFieldType").val() == 'R' && gridLstValuesTable.rows.length == 3 )
	{
		$("#lstValueRowAddLink").unbind('click');
	}
}
// Shows tooltip on hover; useful when the field value is too long to accomodate.
jQuery.fn.showToolTip = function()
{
	return this
			.each(function() {
				var text = $(this).text();
				$(this).attr("title", text);
			})
};
function populateEnrichmentMinMaxLengthForRadioButton() {
	var chrEnrFieldType = $('#enrFieldType').val();
	if (chrEnrFieldType === 'R') {
		var intMaxLength = 0, intMinLength = 0;
		var objMinParamField = $('input:text[id^=paramCode]')[0];
		intMinLength = isEmpty($(objMinParamField).val()) ? 0 : $(objMinParamField).val().length;
		$('input:text[id^=paramCode]').each(function() {
			if (!isEmpty($(this).val())) {
				intMaxLength = $(this).val().length > intMaxLength ? $(this)
						.val().length : intMaxLength;
				intMinLength = $(this).val().length < intMinLength ? $(this)
						.val().length : intMinLength;
			}
		});
		$('#enrichMaxLength').val(intMaxLength);
		$('#enrichMinLength').val(intMinLength);
	} else if (chrEnrFieldType === 'C') {
		var intMaxLength = 1, intMinLength = 1;
		$('#enrichMaxLength').val(intMaxLength);
		$('#enrichMinLength').val(intMinLength);
	}
}
function handleEnrichmentSetName() {
	var strIncludeEnrichInValue = $('#includeEnrichIn').val();
	var strEnrichType = $('input[name="enrichType"]:radio:checked').val();
	if(strEnrichType=="M")
	{
		$('#includeEnrichIn').attr('disabled','disabled');
		$('#includeEnrichIn').addClass('disabled');
	}
	else
	{
		$('#includeEnrichIn').removeAttr('disabled');
		$('#includeEnrichIn').removeClass('disabled');
	}		
	if ((strIncludeEnrichInValue === 'A' || txnType === 'PCT' || txnType === 'PCD') && strEnrichType==='S') {
		$('#enrichSetnameLbl').addClass('required-lbl-right');
	} else {
		$('#enrichSetnameLbl').removeClass('required-lbl-right');
	}
}
function showMaximumTwoValuesForRadioButtonError() {
	clearCustomErrorMessageDiv();
	if (!isEmpty(strErrorExists) && strErrorExists === "[]") {
		var objErrorParentDiv = $('<div>').attr('id', 'customErrorDiv');
		$(objErrorParentDiv).empty();
		var objWrapperDiv = $('<div>').addClass('col-sm-12');
		var objErrorDiv = $('<div>').addClass('ft-error-message');
		var objErrorTitle = $('<span>').addClass('ft-bold-font');
		$(objErrorTitle).text('ERROR:');
		var objErrorMessageDiv = $('<p>');
		$(objErrorMessageDiv)
				.html(getLabel('radioButtonMaximumValueCustomError',
						'Maximum two values can be added for field type Radio Button.'));
		$(objErrorTitle).appendTo($(objErrorDiv));
		$(objErrorMessageDiv).appendTo($(objErrorDiv));
		$(objErrorDiv).appendTo($(objWrapperDiv));
		$(objWrapperDiv).appendTo($(objErrorParentDiv));
		$(objErrorParentDiv).prependTo($('#entryFormDiv'));
	}
}
function clearCustomErrorMessageDiv(){
	$('#customErrorDiv').remove();
}
function showHideUploadMandFlag()
{
	if($('#mandatoryFlag').val() == 'Y' && $('#allowAttachmentUploadFlag').val()  == 'Y' )
	{
		$('#uploadMandatoryCheckBox').removeAttr('disabled');
		$('#uploadMandatoryCheckBox').attr("onclick","toggleCheckbox(this,'uploadMandatoryFlag')");
		$('#uploadMandatory').attr('src','static/images/icons/icon_unchecked.gif');
	}
	else{
		$('#uploadMandatoryCheckBox').attr('disabled','true');
		$('#uploadMandatoryCheckBox').removeAttr('onclick');
		$('#uploadMandatoryFlag').val('N');
		$('#uploadMandatory').attr('src','static/images/icons/icon_unchecked_grey.gif');
	}
}
function setCheckUncheckGrey(flag,mandatoryFlag,uploadFlag,field)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/icons/icon_checked.gif');
	}
	else
	{
		if( mandatoryFlag == 'Y' && uploadFlag == 'Y' )
			$('#'+field).attr('src','static/images/icons/icon_unchecked.gif');	
		else
			$('#'+field).attr('src','static/images/icons/icon_unchecked_grey.gif');
	}	
}
function viewChanges(strUrl)
{
	var frm = document.forms['frmMain'];
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			'VIEW_MODE', 'VIEW_CHANGES'));
	frm.action = strUrl;
	frm.target = '';
	frm.method = 'POST';
	frm.submit();
}