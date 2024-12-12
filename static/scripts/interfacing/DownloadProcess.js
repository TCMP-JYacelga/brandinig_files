function changeFileFormat(format)
{
	if (format == FormatType.XML)
	{
		$('#divDelimited').attr('class','hidden');
		$('#divSampleFile').attr('class','block');
		$("#fileDelimiter").val("-1");
		$("#qualifier").val("-1");
		$("#txtFileDelimiter").val("");
		$("#txtQualifier").val("");
		$("#txtFileDelimiter").attr("disabled","disabled");	
		$("#txtFileDelimiter").addClass("hidden");
		$("#txtFileDelimiter").addClass("disabled");
		$("#txtQualifier").attr("disabled","disabled");	
		$("#txtQualifier").addClass("hidden");
		$("#txtQualifier").addClass("disabled");
		$("#divSwift").attr('class','hidden');
		//$("#divSwift").attr('class','block');
		$("#fileSwiftTypesLabel").attr('class','hidden');
		$("#swiftMessageType").attr('class','hidden');	
		$("#divFedwire1").attr('class','hidden');
		$("#divFedwire2").attr('class','hidden');
		//$("#divFedwire").attr('class','block');
		$("#fileFedwireTypesLabel").attr('class','hidden');
		$("#fedwireMessageType").attr('class','hidden');	
		$("#divBatchwire1").attr('class','hidden');
		$("#divBatchwire2").attr('class','hidden');
		//$("#divBatchwire").attr('class','block');
		$("#fileBatchwireTypesLabel").attr('class','hidden');
		$("#batchwireMessageType").attr('class','hidden');
		
	}
	else if(format == FormatType.DELIMITTER)
	{
		$('#divDelimited').attr('class','block');
		$('#divSampleFile').attr('class','hidden');
		if(pageMode == 'entry' || pageMode == 'Entry')
		{
			$("#fileDelimiter").attr("class","form-control");
			$("#fileDelimiter").removeAttr("disabled");
			$("#qualifier").attr("class","form-control");
			$("#qualifier").removeAttr("disabled");
			$("#fileDelimiter").val("-1");
			$("#qualifier").val("-1");
		}
		$("#txtFileDelimiter").val("");
		$("#txtQualifier").val("");
		$("#txtFileDelimiter").attr("disabled","disabled");	
		$("#txtFileDelimiter").addClass("disabled");
		$("#txtQualifier").attr("disabled","disabled");	
		$("#txtQualifier").addClass("disabled");
		$("#divFedwire1").attr('class','hidden');
		$("#divFedwire2").attr('class','hidden');
		//$("#divFedwire").attr('class','block');
		$("#fileFedwireTypesLabel").attr('class','hidden');
		$("#fedwireMessageType").attr('class','hidden');		
		$("#divSwift").attr('class','hidden');
		//$("#divSwift").attr('class','block');
		$("#fileSwiftTypesLabel").attr('class','hidden');
		$("#swiftMessageType").attr('class','hidden');
		$("#divBatchwire1").attr('class','hidden');
		$("#divBatchwire2").attr('class','hidden');
		//$("#divBatchwire").attr('class','block');
		$("#fileBatchwireTypesLabel").attr('class','hidden');
		$("#batchwireMessageType").attr('class','hidden');
		var ctrlFile = document.getElementById('sampleFile');
		var ctrlFileUploadFlag = document.getElementById('sampleFileUploadFlag');
		if (_blnSelected) 
		{
			$('#lnkUpload').find('span').text('Upload File');
			$('input[id=sampleFileType1]:radio').removeAttr("disabled");
			$('input[id=sampleFileType1]:radio').attr("class","intr_radio");
			$('input[id=sampleFileType2]:radio').removeAttr("disabled");
			$('input[id=sampleFileType2]:radio').attr("class","intr_radio");
			if (!$.browser.msie) {
				ctrlFile.value = '';
			} else {
				$("#sampleFile").replaceWith($("#sampleFile").clone(true));
			}
			_blnSelected = false;
			ctrlFileUploadFlag.value = "N";
			setDirtyBit();
		}
		var sampleType = document.getElementById('sampleFileType1');
		sampleType.checked = true;
	}
	else if( format == FormatType.SWIFT)
	{
		$('#divDelimited').attr('class','block');
		$('#divDelimited').attr('class','hidden');
		$('#divSampleFile').attr('class','hidden');
		$("#fileDelimiter").attr("class","block");
		$("#fileDelimiter").attr("class","hidden");
		$("#qualifier").attr("class","block");
		$("#qualifier").attr("class","hidden");
		$("#fileDelimiter").val("-1");
		$("#qualifier").val("-1");
		$("#txtFileDelimiter").val("");
		$("#txtQualifier").val("");
		$("#txtFileDelimiter").attr("disabled","disabled");	
		$("#txtFileDelimiter").addClass("hidden");
		$("#txtFileDelimiter").addClass("disabled");
		$("#txtQualifier").attr("disabled","disabled");	
		$("#txtQualifier").addClass("hidden");
		$("#txtQualifier").addClass("disabled");	
	
		$("#divSwift").removeAttr("disabled");
		$("#divSwift").removeAttr("class");
		$("#swiftMessageType").removeAttr("class");
		$("#swiftMessageType").removeAttr("class");
		$("#swiftMessageType").attr("class","codebox w17 rounded");
		$("#fileSwiftTypesLabel").removeAttr("class");
		$("#fileSwiftTypesLabel").attr("class","frmLabel required");
		$("#divFedwire1").attr('class','hidden');
		$("#divFedwire2").attr('class','hidden');
		//$("#divFedwire").attr('class','block');
		$("#fileFedwireTypesLabel").attr('class','hidden');
		$("#fedwireMessageType").attr('class','hidden');
		$("#divBatchwire1").attr('class','hidden');
		$("#divBatchwire2").attr('class','hidden');
		//$("#divBatchwire").attr('class','block');
		$("#fileBatchwireTypesLabel").attr('class','hidden');
		$("#batchwireMessageType").attr('class','hidden');
		
	}
	else if( format == FormatType.FEDWIRE)
	{
		$('#divDelimited').attr('class','block');
		$('#divDelimited').attr('class','hidden');
		$('#divSampleFile').attr('class','hidden');
		$("#fileDelimiter").attr("class","block");
		$("#fileDelimiter").attr("class","hidden");
		$("#qualifier").attr("class","block");
		$("#qualifier").attr("class","hidden");
		$("#fileDelimiter").val("-1");
		$("#qualifier").val("-1");
		$("#txtFileDelimiter").val("");
		$("#txtQualifier").val("");
		$("#txtFileDelimiter").attr("disabled","disabled");	
		$("#txtFileDelimiter").addClass("hidden");
		$("#txtFileDelimiter").addClass("disabled");
		$("#txtQualifier").attr("disabled","disabled");	
		$("#txtQualifier").addClass("hidden");
		$("#txtQualifier").addClass("disabled");	
		$("#divSwift").attr('class','hidden');
		$("#divSwift").attr('class','block');
		$("#fileSwiftTypesLabel").attr('class','hidden');
		$("#swiftMessageType").attr('class','hidden');	
		$("#divBatchwire1").attr('class','hidden');
		$("#divBatchwire1").attr('class','block');
		$("#divBatchwire2").attr('class','hidden');
		$("#divBatchwire2").attr('class','block');
		$("#fileBatchwireTypesLabel").attr('class','hidden');
		$("#batchwireMessageType").attr('class','hidden');
		$("#divFedwire1").removeAttr("disabled");
		$("#divFedwire1").removeAttr("class");
		$("#divFedwire2").removeAttr("disabled");
		$("#divFedwire2").removeAttr("class");
		$("#fedwireMessageType").removeAttr("class");
		$("#fedwireMessageType").removeAttr("class");
		$("#fedwireMessageType").attr("class","codebox w17 rounded");
		$("#fileFedwireTypesLabel").removeAttr("class");
		$("#fileFedwireTypesLabel").attr("class","frmLabel required");
		
	}
	else if( format == FormatType.BIGBATCH)
	{
		$('#divDelimited').attr('class','block');
		$('#divDelimited').attr('class','hidden');
		$('#divSampleFile').attr('class','hidden');
		$("#fileDelimiter").attr("class","block");
		$("#fileDelimiter").attr("class","hidden");
		$("#qualifier").attr("class","block");
		$("#qualifier").attr("class","hidden");
		$("#fileDelimiter").val("-1");
		$("#qualifier").val("-1");
		$("#txtFileDelimiter").val("");
		$("#txtQualifier").val("");
		$("#txtFileDelimiter").attr("disabled","disabled");	
		$("#txtFileDelimiter").addClass("hidden");
		$("#txtFileDelimiter").addClass("disabled");
		$("#txtQualifier").attr("disabled","disabled");	
		$("#txtQualifier").addClass("hidden");
		$("#txtQualifier").addClass("disabled");	
		$("#divSwift").attr('class','hidden');
		//$("#divSwift").attr('class','block');
		$("#fileSwiftTypesLabel").attr('class','hidden');
		$("#swiftMessageType").attr('class','hidden');	
		$("#divFedwire1").attr('class','hidden');
		$("#divFedwire2").attr('class','hidden');
		//$("#divFedwire").attr('class','block');
		$("#fileFedwireTypesLabel").attr('class','hidden');
		$("#fedwireMessageType").attr('class','hidden');
		$("#divBatchwire1").removeAttr("disabled");
		$("#divBatchwire1").removeAttr("class");
		$("#divBatchwire2").removeAttr("disabled");
		$("#divBatchwire2").removeAttr("class");
		$("#batchwireMessageType").removeAttr("class");
		$("#batchwireMessageType").removeAttr("class");
		$("#batchwireMessageType").attr("class","codebox w17 rounded");
		$("#fileBatchwireTypesLabel").removeAttr("class");
		$("#fileBatchwireTypesLabel").attr("class","frmLabel required");
		
	}
	else
	{
		$('#divDelimited').attr('class','hidden');
		$('#divSampleFile').attr('class','hidden');
		$("#fileDelimiter").val("-1");
		$("#qualifier").val("-1");
		$("#txtFileDelimiter").val("");
		$("#txtQualifier").val("");
		$("#txtFileDelimiter").attr("disabled","disabled");	
		$("#txtFileDelimiter").addClass("hidden");
		$("#txtFileDelimiter").addClass("disabled");		
		$("#txtQualifier").attr("disabled","disabled");	
		$("#txtQualifier").addClass("hidden");
		$("#txtQualifier").addClass("disabled");
		$("#divSwift").attr('class','hidden');
//		$("#divSwift").attr('class','block');		
		$("#fileSwiftTypesLabel").attr('class','hidden');
		$("#swiftMessageType").attr('class','hidden');
		$("#divFedwire1").attr('class','hidden');
		$("#divFedwire2").attr('class','hidden');
	//	$("#divFedwire").attr('class','block');
		$("#divBatchwire1").attr("class","hidden");
		$("#divBatchwire2").attr("class","hidden");
		$("#fileFedwireTypesLabel").attr('class','hidden');
		$("#fedwireMessageType").attr('class','hidden');
		var ctrlFile = document.getElementById('sampleFile');
		var ctrlFileUploadFlag = document.getElementById('sampleFileUploadFlag');
		if (_blnSelected) 
		{
			$('#lnkUpload').find('span').text('Upload File');
			$('input[id=sampleFileType1]:radio').removeAttr("disabled");
			$('input[id=sampleFileType1]:radio').attr("class","intr_radio");
			$('input[id=sampleFileType2]:radio').removeAttr("disabled");
			$('input[id=sampleFileType2]:radio').attr("class","intr_radio");
			if (!$.browser.msie) {
				ctrlFile.value = '';
			} else {
				$("#sampleFile").replaceWith($("#sampleFile").clone(true));
			}
			_blnSelected = false;
     		ctrlFileUploadFlag.value = "N";
			setDirtyBit();
		}
		var sampleType = document.getElementById('sampleFileType1');
		sampleType.checked = true;
	}		
}

function validateNumber(rowIndex,key)
{	
	//Function to allow only numbers to textbox

		//getting key code of pressed key
		var keycode = (key.which) ? key.which : key.keyCode;
		var phn = document.getElementById('mappingDetails['+ rowIndex +'].decimalValue');
		//comparing pressed keycodes
		if (!(keycode==8 || keycode==9)&&(keycode < 48 || keycode > 57))
			{
			return false;
			}
		else 
			{			
			return true;
			}
}
function setFileFormat(format)
{
	if( null != format && '' != format)
	{
		$('#divDelimited').attr('class','hidden');
		$('#divSampleFile').attr('class','hidden');
		if (format == FormatType.XML)
		{
			$('#divSampleFile').attr('class','block');	
		}
		else if(format == FormatType.DELIMITTER)
		{
			$('#divDelimited').attr('class','block');
		}
	}
}
function onFileDelimiterSelect(ctrl, delimiter)
{
	if(!isEmpty(delimiter) && delimiter == 'O')
	{
		$("#txtFileDelimiter").val("");
		$("#txtFileDelimiter").removeAttr("disabled");
		$("#txtFileDelimiter").removeClass("hidden");
		$("#txtFileDelimiter").removeClass("disabled");
	}
	else
	{
		$("#txtFileDelimiter").val("");
		$("#txtFileDelimiter").attr("disabled","disabled");	
		$("#txtFileDelimiter").addClass("hidden");
		$("#txtFileDelimiter").addClass("disabled");
	}
}
function onFileBandDelimiterSelect(ctrl, delimiter)
{
	if(!isEmpty(delimiter) && delimiter == 'O')
	{
		$("#txtBandFileDelimiter").val("");
		$("#txtBandFileDelimiter").removeAttr("disabled");
		$("#txtBandFileDelimiter").removeClass("hidden");
		$("#txtBandFileDelimiter").removeClass("disabled");
		$("#txtBandFileDelimiter").addClass("form-control");
		var outer = $('#addBandPopUp').outerHeight();
		if(outer < 270)
			$('#addBandPopUp').height(outer + 28);
	}
	else
	{
		$("#txtBandFileDelimiter").val("");
		$("#txtBandFileDelimiter").attr("disabled","disabled");	
		$("#txtBandFileDelimiter").addClass("form-control hidden");
		$("#txtBandFileDelimiter").addClass("disabled");
		var outer = $('#addBandPopUp').outerHeight();
		if(outer > 270 && $('#bandQualifier').val() != 'O')
			$('#addBandPopUp').height(outer - 28);
	}
}
function onQualifierSelect(ctrl, qualifier)
{
	if(!isEmpty(qualifier) && qualifier == 'O')
	{
		$("#txtQualifier").val("");
		$("#txtQualifier").removeAttr("disabled");
		$("#txtQualifier").removeClass("disabled");
		$("#txtQualifier").removeClass("hidden");
	}
	else
	{
		$("#txtQualifier").val("");
		$("#txtQualifier").attr("disabled","disabled");
		$("#txtQualifier").addClass("disabled");
		$("#txtQualifier").addClass("hidden");
	}
}
function onBandQualifierSelect(ctrl, qualifier)
{
	if(!isEmpty(qualifier) && qualifier == 'O')
	{
		$("#txtBandQualifier").val("");
		$("#txtBandQualifier").removeAttr("disabled");
		$("#txtBandQualifier").removeClass("disabled");
		$("#txtBandQualifier").removeClass("hidden");
		$("#txtBandQualifier").addClass("form-control");
		var outer = $('#addBandPopUp').outerHeight();
		if(outer < 245)
			$('#addBandPopUp').height(outer + 28);
	}
	else
	{
		$("#txtBandQualifier").val("");
		$("#txtBandQualifier").attr("disabled","disabled");
		$("#txtBandQualifier").addClass("form-control hidden");
		$("#txtBandQualifier").addClass("disabled");
		var outer = $('#addBandPopUp').outerHeight();
		if(outer > 270 && $('#bandFileDelimitter').val() != 'O')
			$('#addBandPopUp').height(outer - 28);
	}
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}
function setPostUpdationType()
{
	var type = document.getElementById('postUpdationType').value;
	if(type == 'P' || type == 'J')
	{
		$('#postUpdationLabel').attr('class','frmLabel required');
		$("#postUpdationRoutine").removeAttr("disabled");
		$("#postUpdationRoutine").attr("class","form-control");
	}
	else
	{
		$('#postUpdationLabel').attr('class','frmLabel');
		$("#postUpdationRoutine").val("");
		$("#postUpdationRoutine").attr("disabled","disabled");
		$("#postUpdationRoutine").attr("class","form-control disabled");
	}
}

function setPostProcessType()
{
	var type = document.getElementById('postProcessType').value;
	if(type == 'P' || type == 'J')
	{
		$('#postProcessLabel').attr('class','frmLabel required');
		$("#postProcessRoutine").removeAttr("disabled");
		$("#postProcessRoutine").attr("class","form-control");
	}
	else
	{
		$('#postProcessLabel').attr('class','frmLabel');
		$("#postProcessRoutine").val("");
		$("#postProcessRoutine").attr("disabled","disabled");
		$("#postProcessRoutine").attr("class","form-control disabled");
	}
}

function setPreProcessType()
{
	var type = document.getElementById('preProcessType').value;
	if(type == 'P' || type == 'J')
	{
		$('#preProcessLabel').attr('class','frmLabel required');
		$("#preProcessRoutine").removeAttr("disabled");
		$("#preProcessRoutine").attr("class","form-control");
	}
	else
	{
		$('#preProcessLabel').attr('class','frmLabel');
		$("#preProcessRoutine").val("");
		$("#preProcessRoutine").attr("disabled","disabled");
		$("#preProcessRoutine").attr("class","form-control disabled");
	}
}
function addUpdateProcess(frmId, strUrl)
{	
	$('.disabled').removeAttr("disabled");	
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function autoUpdateProcess(frmId, strUrl, popupKey, rowIndex, bandName)
{
	if($('#dirtyBit').val()=="1")
	{
		if (typeof(window.pageYOffset) == 'number') {
			document.getElementById("txtWindowYOffset").value = window.pageYOffset;
		}
		else {
			document.getElementById("txtWindowYOffset").value = document.documentElement.scrollTop;
		}
		document.getElementById("txtPopUpBand").value = bandName;
		document.getElementById("txtPopUpIndex").value = rowIndex;
		document.getElementById("txtPopUpKey").value = popupKey;
		$('.disabled').removeAttr("disabled");
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	else
	{
		if (null != popupKey && '' != popupKey)
		{
			switch(parseInt(popupKey,10))
			{
			case 101: // ADD Band 		
				showAddBandPopUp();	
				break;
			case 102: // EDIT Band 		
				showEditBandPopUp('frmMain', rowIndex);
				break;
			case 104: // ADD Custom Field 		
				showAddCFieldPopUp('frmMain', bandName);
				break;
			}
		}
	}
}
function goToBack(frmId, strUrl)
{
	if($('#dirtyBit').val()=="1")
	{	
		getConfirmationPopup(frmId, strUrl);
	}
	else
	{
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}
function downloadMapping(frmId, strUrl, bandName)
{
	document.getElementById("txtPopUpBand").value = bandName;
	document.getElementById("txtIsPrint").value = '';
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function printMapping(frmId, strUrl, bandName)
{
	document.getElementById("txtPopUpBand").value = bandName;
	document.getElementById("txtIsPrint").value = 'TRUE';
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setSelectedBand(selectedBand)
{
	document.getElementById("lblBandFieldDesc").innerHTML = selectedBand +' : '+ document.getElementById('cmbComplexFieldRef').value;
}
function setFunctionDesc(id, desc)
{
	document.getElementById(id).innerHTML = desc;
}
function checkMasterModel()
{
	setDirtyBit();
	
	var frm = document.getElementById('frmMain');
	frm.action = "checkMasterModel.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changeSellerId()
{
	setDirtyBit();
	var frm = document.getElementById('frmMain');
	frm.action = "showDownloadProcessForm.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getProductCodes()
{
	setDirtyBit();
	var frm = document.getElementById('frmMain');
	frm.action = "getProductCodes.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getTaxAgencyCodes()
{
	setDirtyBit();
	
	var frm = document.getElementById('frmMain');
	frm.action = "getTaxAgencyCodes.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getEditTaxAgencyCodes()
{
	setDirtyBit();
	
	var frm = document.getElementById('frmMain');
	frm.action = "getEditTaxAgencyCodes.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmBackPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmBackPopup').dialog("open");
}
function hideAllDiv()
{
	$('#divReferenced').attr("class","hidden");
	$('#divFunction').attr("class","hidden");
	$('#divCodemap').attr("class","hidden");
	$('#divComplex').attr("class","hidden");
	$('#divConstant').attr("class","hidden");
	$('#divRunningno').attr("class","hidden");
	$('#divFilterParam').attr("class","hidden");
	$('#divGlobalFunction').attr("class","hidden");
	
	$('#lblGlobalFunctionDesc').hide();	
	$('#refHelp').hide();
	$('#refHide').hide();
	$('#divListOfValues').hide();
}
function clearAllAdvancedFields()
{
	$("#cmbBandRef").val("");
	$("#cmbFieldRef").val("");
	$("#txtFunction").val("");
	$("#cmbCodeMapRef").val("");
	$("#txtComplexFunction").val("");
	$("#txtConstant").val("");
	$("#cmbResetBand").val("");
	$("#txtPrevBandRef").val("");
	$("#cmbFunctions").val("");
	$("#cmbGlobalFunctions").val("");	
	$("#lblBandFieldDesc").text("");
	$("#cmbComplexFieldRef").val("");
	$("#cmbComplexBandRef").val("");
	$("#cmbComplexFunctions").val("");
	$("#cmbFilter").val("");	
	$("#txtGlobalFunction").val("");
	$("#txtListOfValues").val("");
	hideHelp();
	//IRISADM-205
	document.getElementById('lblDefault1').innerHTML = lblDefault;
	document.getElementById('lblUpConstant1').innerHTML = lblUpConstant;
}

function hideHelp()
{
	document.getElementById('lblFunctionDesc').innerHTML = "";
	document.getElementById('lblComplexFunctionDesc').innerHTML = "";
	document.getElementById('lblGlobalFunctionDesc').innerHTML = "";
	document.getElementById('lblFunctionDesc').style.display= "none";
	document.getElementById('lblComplexFunctionDesc').style.display= "none";
	document.getElementById('lblGlobalFunctionDesc').style.display= "none";
	$('#refHideC').hide();
	$('#refHideG').hide();
	$('#refHideF').hide();
	$('#refHelpF').hide();
	$('#refHelpG').hide();
	$('#refHelpC').hide();
}
function changeAdvMapType(mapType)
{
	clearAllAdvancedFields();
	if (mapType == 0 || mapType == 8)
	{
		hideAllDiv();
	}
	else if (mapType == 1)
	{
		hideAllDiv();
		$("#divReferenced").attr("class","block");
	}
	else if (mapType == 2)
	{
		hideAllDiv();
		$('#divFunction').attr("class","block");
	}
	else if (mapType == 3)
	{
		hideAllDiv();		
		$('#divCodemap').attr("class","block");
	}
	else if (mapType == 4)
	{
		hideAllDiv();		
		$('#divComplex').attr("class","block");
	}
	else if (mapType == 5)
	{
		hideAllDiv();
		$('#divConstant').attr("class","block");
	}
	else if (mapType == 6)
	{
		hideAllDiv();		
		$('#divRunningno').attr("class","block");
	}
	else if (mapType == 9)
	{
		hideAllDiv();		
		$('#divFilterParam').attr("class","block");
	} 
	else if (mapType == 10)
	{
		hideAllDiv();
		$('#divGlobalFunction').attr("class","block");
	}
	else if (mapType == 15)
	{
		hideAllDiv();
		$('#divListOfValues').attr("class","block");
	}
}
//IRISADM-79: Passing the current bandname in advanced mapping
function addAdvanceMapping(rowIndex,intField,dataType,Length,fieldType,bandName)
{
	$('#advancedPopup').dialog( {
		autoOpen : false,
		height : 380,
		width : 540,
		modal : true,
		
		buttons : {
			"Save" : function() {
					saveAdvancedValues(rowIndex);
					clearAllAdvancedFields();
					$(this).dialog("close");
					},
			"Cancel" : function() {
					clearAllAdvancedFields();
					$(this).dialog("close");
					}
		}
	});
	changeAdvMapType(document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value);
	setExistingValues(rowIndex,intField,dataType,Length,fieldType,bandName);
	setFilterBandValue(dataType);
	$('#advancedPopup').dialog("open");
	
}
function setExistingValues(rowIndex,intField,dataType,Length,fieldType,bandName)
{
	
	$("#txtFieldRemarks").val(document.getElementById('mappingDetails['+ rowIndex +'].fieldRemarks').value);
	$("#txtDefaultValue").val(document.getElementById('mappingDetails['+ rowIndex +'].defaultValue').value);
	$('#interfaceField').val(intField);
	$('#dataType').val(dataType);
	$('#length').val(document.getElementById('mappingDetails['+ rowIndex +'].size').value);
	$('#bandName1').val(bandName);
	
	if (dataType != 'NUMBER')/*IRISADM-120 : Running No. will be applicable only for NUMBER fields*/
	{
		$("#cmbMapType option[value='6']").remove();
	}
	else
	{
		
		if(dataType == 'NUMBER' && $("#cmbMapType option[value='6']").length <= 0)
		{
			var opt = document.createElement("option");              
			document.getElementById('cmbMapType').options.add(opt);       
			opt.text = lblRunningNo;
			opt.value = '6';
		}
	}
	setFunctionList(dataType,'cmbFunctions');
	setFunctionList(dataType,'cmbComplexFunctions');
	setFunctionList(dataType,'cmbGlobalFunctions');
	//FT:Added to set the bandlist for referenced mapping
	setBandList(bandName,'cmbBandRef');
	setResetBandList(bandName,'cmbResetBand');
	$('#cmbMapType').val(document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value);
	var mapType = $('#cmbMapType').val();
	if (mapType == 1)
	{
		$("#cmbBandRef").val(document.getElementById('mappingDetails['+ rowIndex +'].bandNameRef').value);
		setRefFieldList($("#cmbBandRef").val(),'cmbFieldRef','dataType','length','bandName1','interfaceField');
		$("#cmbFieldRef").val(document.getElementById('mappingDetails['+ rowIndex +'].fieldIdRef').value);
	}
	else if (mapType == 2)
	{
		$("#txtFunction").val(document.getElementById('mappingDetails['+ rowIndex +'].translationFunctionName').value);
	}
	else if (mapType == 3)
	{
		$("#cmbCodeMapRef").val(document.getElementById('mappingDetails['+ rowIndex +'].codeMapRef').value);
	}
	else if (mapType == 4)
	{
		$("#txtComplexFunction").val(document.getElementById('mappingDetails['+ rowIndex +'].translationFunctionName').value);
	}
	else if (mapType == 5)
	{
		$("#txtConstant").val(document.getElementById('mappingDetails['+ rowIndex +'].constantValue').value);
	}
	else if (mapType == 6)
	{
		$("#cmbResetBand").val(document.getElementById('mappingDetails['+ rowIndex +'].resetRunningNoBand').value);
	}
	
	else if (mapType == 7)
	{
		document.getElementById('mappingDetails['+ rowIndex +'].defaultValue').disabled = true;	
	}
	else if (mapType == 9)
	{
		$('#divFilterParam').attr("class","block");
		$("#cmbFilter").val(document.getElementById('mappingDetails['+ rowIndex +'].fieldIdRef').value);
	}
	else if (mapType == 10)
	{
		$("#txtGlobalFunction").val(document.getElementById('mappingDetails['+ rowIndex +'].translationFunctionName').value);
	}
	else if (mapType == 15)
	{
		$("#txtListOfValues").val(document.getElementById('mappingDetails['+ rowIndex +'].constantValue').value);
	}
}
function saveAdvancedValues(rowIndex)
{
	document.getElementById('mappingDetails['+ rowIndex +'].fieldRemarks').value = $("#txtFieldRemarks").val();
	document.getElementById('mappingDetails['+ rowIndex +'].defaultValue').value = $("#txtDefaultValue").val();
	//document.getElementById('mappingDetails['+ rowIndex +'].fieldType').value = $("#txtIntField").val();	
	document.getElementById('lblDefault1').innerHTML = lblDefault;
	document.getElementById('lblUpConstant1').innerHTML = lblUpConstant;
	
	var mapType = $('#cmbMapType').val();
	var dataStoreType = getFormatType(); //$('#fileFormat').val();
	
	if (dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE && dataStoreType != FormatType.BIGBATCH)
	{
		document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').disabled = false;
	}
	var dataType = document.getElementById('mappingDetails['+ rowIndex +'].dataType').value;
	if(dataType == 'DATE' || dataType == 'DECIMAL' || dataType == 'DATETIME')
	{
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').disabled = false;
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = false;
	}
	else
	{
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').disabled = true;
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = true;
	}
	document.getElementById('mappingDetails['+ rowIndex +'].defaultValue').disabled = false;
	document.getElementById('mappingDetails['+ rowIndex +'].mandatory').disabled = false;
	document.getElementById('mappingDetails['+ rowIndex +'].constantValue').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].translationFunctionName').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].resetRunningNoBand').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].bandNameRef').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].fieldIdRef').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].codeMapRef').value = "";
	if (mapType == 0)
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblDirect;
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
	}
	else if (mapType == 1) //Referenced
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblReferenced;
		document.getElementById('mappingDetails['+ rowIndex +'].bandNameRef').value = $("#cmbBandRef").val();
		document.getElementById('mappingDetails['+ rowIndex +'].fieldIdRef').value = $("#cmbFieldRef").val();
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
		if (dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE && dataStoreType != FormatType.BIGBATCH)
		{
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').value = "";
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').disabled = true;
		}
		else
		{
			document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').value = "";
			//document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').disabled = true;
		}
	}
	else if (mapType == 2)  //Function
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblFunction;
		document.getElementById('mappingDetails['+ rowIndex +'].translationFunctionName').value = $("#txtFunction").val();
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
		
		//IRISADM-118 Format and Precision disabled for Mapping type 2
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').value = "";
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').disabled = true;
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').value = "";
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = true;
	}
	else if (mapType == 3)
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblCodeMap;
		document.getElementById('mappingDetails['+ rowIndex +'].codeMapRef').value = $("#cmbCodeMapRef").val();
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
	}
	else if (mapType == 4) // Complex
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblComplex;
		document.getElementById('mappingDetails['+ rowIndex +'].translationFunctionName').value = $("#txtComplexFunction").val();
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
		//IRISADM-117 Sequence disabled for Mapping type 1,2,4,5,8
		if (dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE && dataStoreType != FormatType.BIGBATCH)
		{
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').value = "";
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').disabled = true;
		}
		else
		{
			document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').value = "";
			//document.getElementById('mappingDetails['+ rowIndex +'].xpath').disabled = true;
		}
	}
	else if (mapType == 5) // Constant
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblConstant;
		document.getElementById('mappingDetails['+ rowIndex +'].constantValue').value = $("#txtConstant").val();
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
		if (dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT  && dataStoreType != FormatType.FEDWIRE && dataStoreType != FormatType.BIGBATCH)
		{
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').value = "";
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').disabled = true;
		}
		else
		{
			document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').value = "";
			//document.getElementById('mappingDetails['+ rowIndex +'].xpath').disabled = true;
		}
	}
	else if (mapType == 6) // Running No.
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblRunningNo;
		document.getElementById('mappingDetails['+ rowIndex +'].resetRunningNoBand').value = $("#cmbResetBand").val();
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
		if (dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE && dataStoreType != FormatType.BIGBATCH)
		{
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').value = "";
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').disabled = true;
		}
		else
		{
			document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').value = "";
			//document.getElementById('mappingDetails['+ rowIndex +'].xpath').disabled = true;
		}
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').disabled = true;
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = true;
		document.getElementById('mappingDetails['+ rowIndex +'].defaultValue').disabled = true;		
	}
	else if (mapType == 8) // Internal
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblInternal;
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
		if (dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE && dataStoreType != FormatType.BIGBATCH)
		{
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').value = "";
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').disabled = true;
		}
		else
		{
			document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').value = "";
			//document.getElementById('mappingDetails['+ rowIndex +'].xpath').disabled = true;
		}
		document.getElementById('mappingDetails['+ rowIndex +'].mandatory').disabled = true;
	}
	else if (mapType == 9)
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblFilterParam;
		document.getElementById('mappingDetails['+ rowIndex +'].fieldIdRef').value = $("#cmbFilter").val();
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
		if (dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE && dataStoreType != FormatType.BIGBATCH && dataStoreType != FormatType.NACHA)
		{
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').value = "";
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').disabled = true;
		}
		else
		{
			document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').value = "";
			//document.getElementById('mappingDetails['+ rowIndex +'].xpath').disabled = true;
		}
	}
	else if (mapType == 10)  // Global Function
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblGlobalFunction;
		document.getElementById('mappingDetails['+ rowIndex +'].translationFunctionName').value = $("#txtGlobalFunction").val();
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
		
		
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').value = "";
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').disabled = true;
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').value = "";
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = true;
	}
	else if (mapType == 15)  // List of values
	{
		document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblListOfValues;
		document.getElementById('mappingDetails['+ rowIndex +'].constantValue').value = $("#txtListOfValues").val();
		document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = mapType;
		if (dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT  && dataStoreType != FormatType.FEDWIRE && dataStoreType != FormatType.BIGBATCH)
		{
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').value = "";
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').disabled = true;
		}
		else
		{
			document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').value = "";
			//document.getElementById('mappingDetails['+ rowIndex +'].xpath').disabled = true;
		}
	}
}
function showAddCFieldPopUp(frmId, bandId)
{
	$('#customFieldPopup').dialog( {
		autoOpen : false,
		height : 250,
		width : 450,
		modal : true,
		buttons : {
				"Save" : function() {
					start_blocking('Please Wait',this );
					saveCustomField(frmId);
					clearAllCustomFields();
					$(this).dialog("close");
				},
				"Cancel" : function() {
					clearAllCustomFields();
					$(this).dialog("close");
				}
		}
	});
	$("#custBandName").val(bandId);
	$('#customFieldPopup').dialog("open");
}
function clearAllCustomFields()
{
	$("#FieldName").val("");
	$("#DataType").val("");
	$("#Length").val("");
	$("#Mandatory").val("");
}
function saveCustomField(frmId)
{
	$("#custFieldName").val($("#FieldName").val());
	$("#custDataType").val($("#DataType").val());
	$("#custLength").val($("#Length").val());
	$("#custMandatory").val($("#Mandatory").val());
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = "saveCustomField.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function deleteCustomField(frmId, popupkey, rowIndex)
{
	$('.disabled').removeAttr("disabled");
	document.getElementById("txtPopUpKey").value = popupkey;
	document.getElementById("txtMapIndex").value = rowIndex;
	var frm = document.getElementById(frmId);
	frm.action = "deleteCustomField.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function resetMapping(rowIndex, fieldType)
{	
	var dataStoreType = $('#formatType').val();
	document.getElementById('mappingDetails['+ rowIndex +'].lblMappingType').innerHTML = lblDirect;
	document.getElementById('mappingDetails['+ rowIndex +'].mappingType').value = 0;
	
	if (fieldType == 2 && fieldType == 4)
	{
		document.getElementById('mappingDetails['+ rowIndex +'].mandatory').value = "";		
	}
	document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').value = "";
	if (null != document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr'))
	{
		document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').value = "";
	}
	
	if (dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE && dataStoreType != FormatType.BIGBATCH && dataStoreType != FormatType.NACHA)
	{
		if( null != document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr') )
		{
			document.getElementById('mappingDetails['+ rowIndex +'].seqNmbr').disabled = false;	
		}
	}
	
	else
	{
		//document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').disabled = false;
		document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').value = "";
	}
	var dataType = document.getElementById('mappingDetails['+ rowIndex +'].dataType').value;
	if(dataType == 'DATE' || dataType == 'NUMBER')
	{
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').disabled = false;
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = false;
	}
	else
	{
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').disabled = true;
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = true;
	}
	document.getElementById('mappingDetails['+ rowIndex +'].defaultValue').disabled = false;
	document.getElementById('mappingDetails['+ rowIndex +'].mandatory').disabled = false;
	
	document.getElementById('mappingDetails['+ rowIndex +'].size').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].defaultValue').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].bandNameRef').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].fieldIdRef').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].translationFunctionName').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].codeMapRef').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].constantValue').value = "";
	document.getElementById('mappingDetails['+ rowIndex +'].resetRunningNoBand').value = "";
	
	if("NUMBER" == document.getElementById('mappingDetails['+ rowIndex +'].dataType').value)
	{
		document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').disabled = false;
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = false;
	}
	else if("DATE" == document.getElementById('mappingDetails['+ rowIndex +'].dataType').value) 
	{
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = false;
		document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = true;
	}
	else
	{
	  document.getElementById('mappingDetails['+ rowIndex +'].columnFormat').disabled = true;
	  document.getElementById('mappingDetails['+ rowIndex +'].decimalValue').disabled = true;
	}
	
	if (null != document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1'))
	{
		document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').value = "";
	}
	if( null != document.getElementById('mappingDetails['+ rowIndex +'].relativeXpath') )
	{
		document.getElementById('mappingDetails['+ rowIndex +'].relativeXpath').value = "";
	}
}

function getMappingViewPopup(frmId, rowIndex, varmap) 
{
	$('#mapViewPopup').dialog( {
		autoOpen : false,
		height : 450,
		width : 490,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				$(this).dialog("close");
			}
		}
	});	
	$('#mapViewPopup').dialog("open");
	var objstr = document.getElementById(""+varmap+""+rowIndex).value;
	var obj = eval("(" + objstr + ")");
	$('#minterfaceField').val(obj.interfaceField);
	$('#mdataType').val(obj.dataType);
	$('#mlength').val(obj.length);	
	$('#mcmbfieldType').val(obj.fieldType);
	$('#mcmbMapType').val(obj.mappingType);
	$('#mcmbmandatory').val(obj.mandatory);
	$('#mcolumnFormat').val(obj.columnFormat);
	$('#mdecimalValue').val(obj.decimalValue);
	$('#mseqNmbr').val(obj.seqNmbr);
	$('#msize').val(obj.size);
	$("#mdefaultValue").val(obj.defaultValue);	
	$("#mBandRef").val(obj.bandNameRef);
	$("#mFieldRef").val(obj.fieldIdRef);
	$("#mFunction").val(obj.translationFunctionName);
	$("#mCodeMapRef").val(obj.codeMapRef);
	$("#mConstant").val(obj.constantValue);
	$("#mResetBand").val(obj.resetRunningNoBand);
}

function showAdvanceMapping(defaultValue,rowIndex, intField, dataType, Length, mappingType,bandLevel)
{
	$('#viewAdvancedPopup').dialog( {
		autoOpen : false,
		height : 300,
		width : 500,
		modal : true,
		
		buttons : {
				"OK" : function() {
					$(this).dialog("close");
					}
		}
	});
	hideAllViewDiv();
	$('#txtDefaultValueView').val(defaultValue);
	$('#interfaceFieldView').val(intField);
	$('#dataTypeView').val(dataType);
	$('#lengthView').val(Length);
	$('#cmbMapTypeView').val(mappingType);
	var mapType = document.getElementById('mappingType'+rowIndex).value;	
	if (mapType == 1)
	{
		$("#divReferencedView").attr("class","block");
		$("#cmbBandRefView").val(document.getElementById('bandNameRef' + rowIndex).value);
		$("#cmbFieldRefView").val(document.getElementById('fieldIdRef' + rowIndex).value);
	}
	else if (mapType == 2)
	{
		$('#divFunctionView').attr("class","block");
		$("#txtFunctionView").val(document.getElementById('translationFunctionName' + rowIndex).value);
		if( 'true' == isBankInterfaceMapFormat )
		{
			$("#txtFunctionView").removeAttr('disabled');
		}
		else if( 'false' == isBankInterfaceMapFormat )
		{
			$("#txtFunctionView").attr('disabled','disabled');
		}
	}
	else if (mapType == 3)
	{
		$('#divCodemapView').attr("class","block");
		$("#cmbCodeMapRefView").val(document.getElementById('codeMapRef' + rowIndex).value);
	}
	else if (mapType == 4)
	{
		$('#divComplexView').attr("class","block");
		$("#txtComplexFunctionView").val(document.getElementById('translationFunctionName' + rowIndex).value);
		
		if( 'true' == isBankInterfaceMapFormat )
		{
			$("#txtComplexFunctionView").removeAttr('disabled');
		}
		else if( 'false' == isBankInterfaceMapFormat )
		{
			$("#txtComplexFunctionView").attr('disabled','disabled');
		}

	}
	else if (mapType == 5)
	{
		$('#divConstantView').attr("class","block");
		$("#txtConstantView").val(document.getElementById('constantValue' + rowIndex).value);
	}
	else if (mapType == 6)
	{
		$('#divRunningnoView').attr("class","block");
		$("#cmbResetBandView").val(document.getElementById('resetRunningNoBand' + rowIndex).value);
	}
	else if (mapType == 10)
	{
		$('#divGlobalFunctionView').attr("class","block");
		$("#txtGlobalFunctionView").val(document.getElementById('translationFunctionName' + rowIndex).value);
		if( 'true' == isBankInterfaceMapFormat )
		{
			$("#txtGlobalFunctionView").removeAttr('disabled');
		}
		else if( 'false' == isBankInterfaceMapFormat )
		{
			$("#txtGlobalFunctionView").attr('disabled','disabled');
		}
	}
	
	$('#viewAdvancedPopup').dialog("open");
}
function hideAllViewDiv()
{
	$('#divReferencedView').attr("class","hidden");
	$('#divFunctionView').attr("class","hidden");
	$('#divCodemapView').attr("class","hidden");
	$('#divComplexView').attr("class","hidden");
	$('#divConstantView').attr("class","hidden");
	$('#divRunningnoView').attr("class","hidden");
	$('#divGlobalFunction').attr("class","hidden");
}
function setColFormatSize(rowIndex, format)
{
	if (format != "")
	{
		document.getElementById('mappingDetails['+ rowIndex +'].size').setAttribute("class","rounded w3 zeroPad number disabled");
		document.getElementById('mappingDetails['+ rowIndex +'].size').setAttribute("disabled","disabled");
		document.getElementById('mappingDetails['+ rowIndex +'].size').value = format.length;
	}
	else
	{
		document.getElementById('mappingDetails['+ rowIndex +'].size').setAttribute("class","rounded w3 zeroPad number");
		document.getElementById('mappingDetails['+ rowIndex +'].size').removeAttribute("disabled");
		document.getElementById('mappingDetails['+ rowIndex +'].size').value = "";
	}	
}
function showUploadDialog(hlnk) 
{
	var ctrlFile = document.getElementById('sampleFile');
	var ctrlFileUploadFlag = document.getElementById('sampleFileUploadFlag');
	if (_blnSelected) 
	{
		$(hlnk).text('Upload File');
		$("#viewAttachmentSampleFile").addClass("ui-helper-hidden");
		$('input[id=sampleFileType1]:radio').removeAttr("disabled");
		$('input[id=sampleFileType1]:radio').attr("class","intr_radio");
		$('input[id=sampleFileType2]:radio').removeAttr("disabled");
		$('input[id=sampleFileType2]:radio').attr("class","intr_radio");
		if (!$.browser.msie) {
			ctrlFile.value = '';
		} else {
			$("#sampleFile").replaceWith($("#sampleFile").clone(true));
		}
		_blnSelected = false;
		ctrlFileUploadFlag.value = "N";
		setDirtyBit();
	} else {
		var dlg = $('#divFilUpload');
		dlg.dialog({
			bgiframe : true,
			autoOpen : false,
			//height : "auto",
			minHeight : 156,
			maxHeight : 550,
			modal : true,
			resizable : false,
			draggable : false,
			width : 400,
			/*hide : "explode",*/
			buttons : [
							{
							text : getLabel('btnCancel','Cancel'),
							click : function() {
								if (!$.browser.msie) {
									ctrlFile.value = '';
								} else {
									$("#sampleFile")
											.replaceWith($("#sampleFile")
															.clone(true));
								}
								_blnSelected = false;
								$(hlnk).text('Upload File');
								$(this).dialog('destroy');
								ctrlFileUploadFlag.value = "N";
								$('input[id=sampleFileType1]:radio')
										.removeAttr("disabled");
								$('input[id=sampleFileType1]:radio').attr(
										"class", "intr_radio");
								$('input[id=sampleFileType2]:radio')
										.removeAttr("disabled");
								$('input[id=sampleFileType2]:radio').attr(
										"class", "intr_radio");
							},
							style : 'right:223%'
						},
						{
							text : getLabel('btnUpload','Upload'),
							class : 'ui-button-next',
							click : function() {
								if (ctrlFile.value != null
										&& ctrlFile.value != "") {
									var fileText = 'Remove File '
											+ ctrlFile.value;
									var ft = fileText;
									if (fileText.length > 12)
										var fileText1 = fileText.substring(0,
												27);
									$(hlnk).text(fileText1 + "..");
									$(hlnk).attr("title", ft);
									_blnSelected = true;
									ctrlFileUploadFlag.value = "Y";
									$('input[id=sampleFileType1]:radio').attr(
											"disabled", true);
									$('input[id=sampleFileType1]:radio').attr(
											"class", "intr_radio disabled");
									$('input[id=sampleFileType2]:radio').attr(
											"disabled", true);
									$('input[id=sampleFileType2]:radio').attr(
											"class", "intr_radio disabled");
								}
								$(this).dialog("close");
							},
							style : 'left:5%'
						}
					]
		});
		dlg.parent().appendTo($('#frmMain'));
		dlg.dialog('open');
	}
}

function chooseFileClicked() {
	$('#sampleFile').click();
}

function newfileselected () {
	var filename = $('#sampleFile').val();
	if(filename) {
		$('#selectedFile').html(filename.substring(filename.lastIndexOf('\\')+1));
	} else {
		$('#selectedFile').html("No file chosen");
	}
	$('#selectedFile').attr('title', filename); 
}

function cancelFileUpload(){
	var ctrlFile = document.getElementById('sampleFile');
	var ctrlFileUploadFlag = document.getElementById('sampleFileUploadFlag');
	if (!$.browser.msie) {
		ctrlFile.value = '';
	} else {
		$("#sampleFile")
				.replaceWith($("#sampleFile")
								.clone(true));
	}
	_blnSelected = false;
	$(this).text('Upload File');
	$(this).dialog('destroy');
	ctrlFileUploadFlag.value = "N";
	$('input[id=sampleFileType1]:radio')
			.removeAttr("disabled");
	$('input[id=sampleFileType1]:radio').attr(
			"class", "intr_radio");
	$('input[id=sampleFileType2]:radio')
			.removeAttr("disabled");
	$('input[id=sampleFileType2]:radio').attr(
			"class", "intr_radio");
}

function uploadFile(){
	var ctrlFile = document.getElementById('sampleFile');
	var ctrlFileUploadFlag = document.getElementById('sampleFileUploadFlag');
	if (ctrlFile.value != null
			&& ctrlFile.value != "") {
		var fileText = 'Remove File '
				+ ctrlFile.value;
		var ft = fileText;
		if (fileText.length > 12)
			var fileText1 = fileText.substring(0,
					27);
		$(this).text(fileText1 + "..");
		$(this).attr("title", ft);
		_blnSelected = true;
		ctrlFileUploadFlag.value = "Y";
		$('input[id=sampleFileType1]:radio').attr(
				"disabled", true);
		$('input[id=sampleFileType1]:radio').attr(
				"class", "intr_radio disabled");
		$('input[id=sampleFileType2]:radio').attr(
				"disabled", true);
		$('input[id=sampleFileType2]:radio').attr(
				"class", "intr_radio disabled");
	}
	$(this).dialog("close");
}

function viewSampleFileAttachment(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "showDownloadSampleFile.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showView(ctrl, index)
{
	$('#view-btnIntView'+index).hide();
	$('#view-btnCustView'+index).hide();
	$('#view-btnDynamicView'+index).hide();
	$('#view-btnFileView'+index).hide();
	$('#view-btnAll'+index).hide();
	$('#divAddCustom'+index).hide();
	$('#divDownload'+index).hide();	
	if($(ctrl).hasClass('fg-button1'))
    {
       	$('#view-btnIntView'+index).show();
    }        	
	if($(ctrl).hasClass('fg-button2'))
	{
     	$('#view-btnCustView'+index).show();
    }
    if($(ctrl).hasClass('fg-button3'))
    {
      	$('#view-btnFileView'+index).show();
      	$('#divDownload'+index).show();
    }
    if($(ctrl).hasClass('fg-button5'))
    {
      	$('#view-btnDynamicView'+index).show();
    }
    if($(ctrl).hasClass('fg-button4'))
    {
      	$('#view-btnAll'+index).show();
    	$('#divAddCustom'+index).show();
    	$('#divDownload'+index).hide();
      	$('.fg-button-toggleable').removeClass("ui-state-active");
    }
}

function showCustumFields(frmId,bandName,idposition)
{
	var frm = document.getElementById('frmMain');
	document.getElementById('currentbandName').value=bandName;
	document.getElementById('idPosition').value=idposition;
	frm.action = "getCustomFields.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getBandTreeView(strUrl,frmId, txtPathComponent)
{
	var frm = document.getElementById(frmId);
	document.getElementById('txtPathComponent').value = txtPathComponent;
	document.getElementById('txtMapPathComponent').value = "";
	document.getElementById('txtPathEntered').value = $("#absoluteXpath1").val();
	document.getElementById('relativeComponent1').value ='relativeXpath';
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=400,resizable=1";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}
function getMappingTreeView(strUrl,frmId, index)
{
	var frm = document.getElementById(frmId);
	document.getElementById('txtMapPathComponent').value = 'mappingDetails['+ index +'].absoluteXpath1';
	document.getElementById('txtPathComponent').value = "";
	//alert("bandpath 2"+document.getElementById('mappingDetails['+ index +'].bandName').value);
	document.getElementById('txtMapBandPath').value = getBandPath(document.getElementById('mappingDetails['+ index +'].bandName').value);
	//alert("mapbandPath"+document.getElementById('txtMapBandPath').value);
	document.getElementById('txtPathEntered1').value = document.getElementById('mappingDetails['+ index +'].absoluteXpath1').value;
	document.getElementById('relativeComponent').value ='mappingDetails['+ index +'].relativeXpath';
	if(null != document.getElementById('relativexpathmapping') && null != document.getElementById('mappingDetails['+ index +'].relativeXpath'))
	{
		document.getElementById('relativexpathmapping').value = document.getElementById('mappingDetails['+ index +'].relativeXpath').value;	
	}
	
	/*IRISADM-150 : Implicit Dataype conversion*/
	document.getElementById('mappedDatatype').value = document.getElementById('mappingDetails['+index+'].dataType').value;	
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=650";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function showInputParam(strUrl,frmId, type, routineId)
{	
	var routine = document.getElementById(routineId);
	if (routine.value != '' )
	{
		document.getElementById('txtRoutineName').value = routine.value;		
	}
	else
	{
		document.getElementById('txtRoutineName').value = '';				
	}
	document.getElementById('txtRoutineType').value = type;		
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 474)/2;
	var intLeft = (screen.availWidth - 555)/2;
	strAttr = "dependent=yes,scrollbars=no,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=555,height=400";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}
function doUploadUnload(seekFrm)
{
	window.opener.reloadUProcess();
	window.close();
}
function reloadUProcess()
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById("frmMain");
	frm.action = "reloadUploadProcess.form";
	frm.target = "";
	frm.method = "POST";
	start_blocking(BLOCK_MESSAGE,frm );
	frm.submit();
}
function showFilterParam(strUrl,frmId)
{	
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 488)/2;
	var intLeft = (screen.availWidth - 1006)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=1006,height=400";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
	
	/*$('#advancedFilterPopup').dialog( {
		autoOpen : false,
		height : 500,
		width : 800,
		modal : true,
		buttons : {
			"CLOSE" : function() {
				$(this).dialog("close");
				}
		}
	});
	$('#advancedFilterPopup').dialog("open");*/
}

function showHooksAlertPopup()
{
	$('#hookAlertPopup').dialog( {
		autoOpen : false,
		height : 150,
		width : 350,
		modal : true,
		buttons : {
			"OK" : function() {
				$(this).dialog("close");
				}
		}
	});
	$('#hookAlertPopup').dialog("open");
}
function setCheckBoxValue(rowIndex,checkbox)
{
	if (checkbox.checked)
	{
		document.getElementById('mappingDetails['+ rowIndex +'].checkMapping').value = "Y";
	}
	else
	{
		document.getElementById('mappingDetails['+ rowIndex +'].checkMapping').value = "N";
	}
}
function setHooksDirtyBit()
{
	document.getElementById("hooksdirtyBit").value = "1";	
}
function setPathTitle(inputId,inputValue)
{
	var inpuBox=document.getElementById(inputId);
}
function onActSizeChange(actSize, rowIndex)
{
	if(actSize.length != 0)
	{
		document.getElementById('lblLenID['+rowIndex+']').innerHTML = actSize;
		document.getElementById('mappingDetails['+rowIndex+'].length').value = actSize;
	}
}
function disablePosLength(bandID)
{
	$('#lblbandidposition').attr("class","frmLabel");
	$('#lblbandidlength').attr("class","frmLabel");
	$('#lblbandSequence').attr("class","frmLabel");
	$("#bandIdPosition").val("0");
	$("#bandIdLength").val("0");
	$("#bandSequence").val("1");
	$("#bandIdPosition").attr("class","form-control disabled");
	$("#bandIdLength").attr("class","form-control disabled");
	$("#bandIdPosition").attr("disabled","true");
	$("#bandIdLength").attr("disabled","true");
}
function enablePosLength(bandID)
{
	$('#lblbandidposition').addClass('frmLabel required');
	$('#lblbandidlength').addClass('frmLabel required');
	$('#lblbandSequence').addClass('frmLabel required');
	$("#bandIdPosition").removeAttr("disabled");
	$("#bandIdPosition").attr("class","form-control");
	$("#bandIdPosition").focus();
	$("#bandIdLength").val(bandID.value.length);
	$("#bandIdLength").removeAttr("disabled");
	$("#bandIdLength").attr("class","form-control");
}
function togglePosLength()
{
	if( 'false' == isBankInterfaceMapBand )
	{
		return;
	}
	var bandID = document.getElementById('bandId');
	if (bandID) 
	{
		if(bandID.value.length == 0)
		{
			disablePosLength(bandID);
		}
		else
		{
			enablePosLength(bandID);
		}
	}
}
function goToTab()
{
	var tabId = document.getElementById('tabId').value;
	var strUrl = null ;
	var frm = document.getElementById("frmMain");
	frm.target = "";
	frm.method = "POST";
	//Band Info
	if(tabId == 'tab_e')
	{
		strUrl = 'downloadInterfaceBandDetails.srvc';
	}
	//format def
	else if(tabId == 'tab_c')
	{
		strUrl = 'editDownloadProcess.srvc';
	}
	//field mapping
	else if(tabId == 'tab_f')
	{
		strUrl = 'showDownloadInterfaceFieldMapping.srvc';
	}
	//hooks
	else if(tabId == 'tab_h')
	{
		strUrl = 'downloadInterfaceHooksInfo.srvc?$viewState=' + encodeURIComponent( viewState )
			+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState ) + '&'
			+ csrfTokenName + '=' + csrfTokenValue;
	}
	//verify and submit
	else if(tabId == 'tab_v')
	{
		strUrl = 'showVerifySubmitDownloadForm.srvc';
	}
	//summary page
	else if(tabId == 'tab_s')
	{
		strUrl = 'uploadInterfaceCenter.srvc';
		// to be removed
		frm.method = "GET";
	}
	frm.action = strUrl;
	frm.submit();
}
function closePopup(dlgId)
{
	$( dlgId ).dialog( 'close' );
}
function resetPopupField()
{
	/*$('#addBandForm').each (function(){
		this.reset();				
	});*/
	document.getElementById("addBandForm").reset();
	if( null != document.getElementById("messageArea") &&
		'undefined' != document.getElementById("messageArea"))
	{
		document.getElementById("messageArea").innerHTML = '';
		$('#messageArea').removeAttr('class');
	}
	if( 1 == INTERFACING_ENTITY_TYPE )
	{
		$('#bandSequence').attr("disabled","disabled");
		$('#parentBand').attr("disabled","disabled")
		$('#mandatory').attr("disabled","disabled")					
	}//Client mode disable few fields
}
function setAdvanceFilter(selectId,me)
{
	if(me.value == null || me.value == '')
	{
		$("#"+selectId).addClass("hidden");
	}
	else
	{
		$("#"+selectId).removeClass("hidden");
	}
}

function saveInputParameter(strUrl)
{
	var txtRoutineName = document.getElementById('txtRoutineName').value;
	var txtRoutineType = document.getElementById('txtRoutineType').value; 
	
	var store = inputParameterGrid.getStore();
	var arrayJson = new Array();
	strUrl = 'updateDownloadInputParameters.srvc?$viewState='+encodeURIComponent(strViewState)
		+ '&interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
		+'&$routineType='+txtRoutineType+'&$routineName='+txtRoutineName+'&'+csrfTokenName+'='+csrfTokenValue;
	store.each(function(record) {
		arrayJson.push({
			interfaceCode : record.data.interfaceCode,
			processCode : record.data.processCode,
			parameterName :record.data.fieldName,
			bandName : record.data.bandName,
			fieldName : record.data.fieldName,
			routineName : txtRoutineName,
			routineType : txtRoutineType,
			seqNmbr : record.data.seqNmbr,
			checked : record.data.checked,
			selected : record.data.selected,
			recordKeyNo : record.data.recordKeyNo
				});
	});
	$.ajax(
		{
			type : 'POST',
			data : JSON.stringify( arrayJson ),
			url : strUrl,
			contentType : "application/json",
			dataType : 'html',
			success : function( data )
			{
				var $response = $( data );
				window.opener.checkDiv(data);
				window.close();
			},
			error : function( request, status, error )
			{
				window.close();
			}
		} );
}

function addInputParameterField()
{
	document.getElementById( "addFieldPopUpForm" ).style.visibility = "visible";
	var dlg = $( '#addFieldPopUp' );
	dlg.dialog( {
		autoOpen : false,
		height : "auto",
		modal : true,
		width : 450,
		title : 'Add Field'
	} );
	dlg.dialog( 'open' );
}
function saveAddFieldToGrid()
{
	var bandNameDesc = document.addFieldForm.bandName.value ;
	var fieldNameDesc = document.addFieldForm.fieldName.value ;
	if(bandNameDesc == null || bandNameDesc == '' )
	{
		showErrorMessage('Select Band Name !','Error');
	}
	else if(fieldNameDesc == null || fieldNameDesc == '' )
	{
		showErrorMessage('Select Field Name !','Error');
	}
	else
	{
		inputParameterGrid.store.add({checked:"N",bandName:bandNameDesc,fieldName:fieldNameDesc,selected:"N"});
		$( '#addFieldPopUpView' ).dialog( 'close' );
	}
}
function closeAddFieldPopup()
{
	$( '#addFieldPopUpView' ).dialog( 'close' );
	$( '#addFieldPopUp' ).dialog( 'close' );
}
function getFieldList(me)
{
	var bandName = me.value;
	strUrl = 'getDownloadFieldList.srvc?$viewState='+encodeURIComponent(strViewState)
		+ '&interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
		+'&$bandName='+bandName+'&'+csrfTokenName+'='+csrfTokenValue;
	$.ajax( {
		type : 'POST',
		url : strUrl,
		contentType : "application/json",
		dataType : 'html',
		success : function( data )
		{
			var $response = $( data );
			$( '#addFieldPopUpView' ).html(
					$response.find( '#addFieldPopUpForm' ) );
			$( '#addFieldPopUpView' ).dialog( {
				autoOpen : false,
				height : "auto",
				modal : true,
				width : 450,
				title : 'Add Field'
			} );
			$( '#dialogMode' ).val( '1' );
			document.getElementById( "addFieldPopUp" ).style.visibility = "hidden";
			$( '#addFieldPopUp' ).dialog( 'close' );
			$( '#addFieldPopUpView' ).dialog( 'open' );
			$('#addFieldPopUpView').find('#bandName').val(bandName);
			$('#addFieldPopUp').find('#bandName').val("");
		}
	} );
}
function checkDiv(data)
{
	var $response = $( data );
	if( $response.find( '#errorDiv' ).length != 0 )
	{
		$( '#messageAreaError' ).html( $response.find( '#errorDiv' ) );
		document.getElementById( "viewState" ).value = document.getElementById( "inputParameterViewState" ).value;
		document.getElementById( "interfaceMapMasterViewState" ).value = document.getElementById( "interfaceMapMasterViewParamState" ).value;
	}	
}
function showConfirmPopup(tabId)
{
	document.getElementById('tabId').value = tabId;
	var recordKeNo = document.getElementById('crumbsRecordKeyNo').value
	document.getElementById( "confirmPopup" ).style.visibility = "visible";
	if($('#dirtyBit').val()=="1" || recordKeNo == null ||  recordKeNo == '')
	{
		var dlg = $( '#confirmPopup' );
		dlg.dialog( {
			autoOpen : false,
			height : "auto",
			modal : true,
			width : 420,
			title : 'Message'
		} );
		dlg.dialog( 'open' );
	}
	else
	{
		goToTab();
	}
	
}
function blockConfirmPopup(tabId)
{
	document.getElementById('tabId').value = tabId;
	var recordKeNo = document.getElementById('crumbsRecordKeyNo').value
	goToTab();
}
function showNextTabForBand(strUrl)
{
 $('#datastoreType').removeAttr("disabled");
 document.getElementById('nextPageUrl').value = strUrl;
	$('input:radio[name=interfaceScope]').removeAttr("disabled");
	var interfaceScope = null;
	interfaceScope = $('input:radio[name=interfaceScope]:checked').val();
	var recordKeNo = document.getElementById('txtRecordKeyNo').value
	if(interfaceScope == 'G' && strEntityType == '0')
	{
		$('#clientId').val('');
	}
	$('input[id=sampleFileType1]:radio').removeAttr("disabled",true);
	$('input[id=sampleFileType2]:radio').removeAttr("disabled",true);
	$('#fileFormat').removeAttr("disabled",true);
	if($('#dirtyBit').val()=="1" || recordKeNo == null ||  recordKeNo == '')
	{
	 $('#pageAction').val('saveAndNext');
	}
	else
	{
	 $('#pageAction').val('next');
	}
	goToNextpage();
}
function showNextTab(strUrl)
{
	document.getElementById('nextPageUrl').value = strUrl;
	var recordKeNo = document.getElementById('txtRecordKeyNo').value
	document.getElementById( "confirmNextPopup" ).style.visibility = "visible";
	if($('#dirtyBit').val()=="1" || recordKeNo == null ||  recordKeNo == '')
	{
		var dlg = $( '#confirmNextPopup' );		
		dlg.dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		dlg.dialog( 'open' );
	}
	else
	{
		goToNextpage();
	}
}
function closeConfirmPopup()
{
	$('#confirmPopup').dialog("close");
}
function closeConfirmNextPopup()
{
	$( '#confirmNextPopup' ).dialog( 'close' );
}
function goToNextpage()
{
	var strUrl = document.getElementById('nextPageUrl').value ;
	var frm = document.getElementById('frmMain');
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit(); 
}
function goToHome(isBankInterfaceMap)
{
	var frm = document.getElementById('frmMain');
	if( isBankInterfaceMap == 'true' )
	{
		frm.action = 'interfaceMapCenter.srvc';		
	}
	else
	{
		frm.action = 'clientInterfaceMapCenter.srvc';		
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit(); 
}
function showErrorMessage(strMsg,strTitle)
{
	$("#errorMsg").empty();
	var dlg = $( '#errorMsg' );
	dlg.dialog( {
		autoOpen : false,
		height : "auto",
		modal : true,
		width : 300,
		title : strTitle,
		buttons : {
			"Ok" : function() {
				$(this).dialog("close");
				}
	}
	} );
	$('<p>'+strMsg+'</p>').appendTo('#errorMsg');
	dlg.dialog( 'open' );
}
function setFieldLabel()
{
	document.getElementById("lblField").innerHTML =  $("#cmbFieldType").val() + "." + $("#cmbField").val(); 
}
function setParamLabel(value,labelId)
{
	if(!isEmpty(value))
	{
		document.getElementById('lblParameter').innerHTML = value;
	}
	else
	{
		document.getElementById('lblParameter').innerHTML = '';
	}
}
function addParamLabel()
{
	var param = document.getElementById('cmbDownloadParam').value;	
	var oldvalue = document.getElementById('whereClause').value;
	if(!isEmpty(oldvalue) && !isEmpty(param))
	{
		var newValue = oldvalue + ' ' + param;		
		document.getElementById('whereClause').value = newValue;
	}
	else if(!isEmpty(param))
	{
		document.getElementById('whereClause').value = param;
	}	
}
function onClickOperator(value)
{
	document.getElementById("whereClause").value += ' ' + value ;
}
function onEditOperator()
{
	 $("#whereClause").removeAttr('readonly');
     $("#whereClause").removeClass('disabled');
}
function onClearOperator()
{
	document.getElementById("whereClause").value = ' ' ;
}
function onSelectConditionFields(me)
{
	document.getElementById("whereClause").value += ' ${' + me.value + '}';
}
function onSelectParameterConditionFields(me)
{
	document.getElementById("whereClause").value += ':' + me.value;
}
function createFormField(element, type, name, value )
{
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
function enableSplitFileAdvance(me)
{
	if(me.checked == true)
	{
		$('#fileSplitDiv').attr('class','block');
	}
	else
	{
		$('#fileSplitDiv').attr('class','hidden');
	}	
}
function populateClientList(obj)
{
	$('#interface').val(obj.value);
	$(".selector").autocomplete({delay : 3000});
    $("#clientDesc").ClientAutoComplete();
}
jQuery.fn.ClientAutoComplete = function() {
    return this.each(function() {
                    $(this).autocomplete({
                                    source : function(request, response) {
                                                    $.ajax({
                                                            url : "services/userseek/bankUserClientSeek.json?$top=20",
                                                            dataType : "json",
                                                            data : {
                                                                            $autofilter : request.term,
                                                                            $sellerCode : $('#interface').val() //selected seller Code  
                                                            },
                                                            success : function(data) {
                                                                            var rec = data.d.preferences;
                                                                            response($.map(rec, function(item) {
                                                                                        return {
                                                                                                        label : item.DESCR,
																										value : item.CODE,
																										code  : item.CODE
																										
                                                                                        }
                                                                        }));
                                                            }
                                            });
                                    },
                                    minLength : 1,
                                    select : function(event, ui) {
                                                    log(ui.item ? "Selected: " + ui.item.label + " -show lbl:"
                                                                                    + ui.item.lbl : "Nothing selected, input was "
                                                                                    + this.value);
                                                                                    var val = ui.item.code;
                                                                    $('#clientId').val(val);
																	$('#clientDesc').val(ui.item.label);
																	changeSellerId();
                                    },
                                    open : function() {
                                                    $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
                                    },
                                    close : function() {
                                                    $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
                                    }
                    });/*.data("autocomplete")._renderItem = function(ul, item) {
									
                                    var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:100px;" class="inline">'
                                                                    + item.label
                                                                    + '</ul><ul style="width:200px;font-size:0.8em;color:#06C;" class=inline>'
                                                                    + '</ul></ol></a>';                                                                       
                                    return $("<li></li>").data("item.autocomplete", item)
                                                                    .append(inner_html).appendTo(ul);
                    };*/
    });
};

function getInterfaceModelList()
{
	var strData = {};
	var strUrl = 'getInterfaceModelList.srvc';
	var sellerId = document.getElementById( "sellerId" ).value;
	var clientId = document.getElementById( "clientId" ).value;
	
	strData[ '$sellerId' ] = sellerId;
	strData[ '$clientId' ] = clientId;
	strData[ csrfTokenName ] = csrfTokenValue;
	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function( response )
		{
			loadInterfaceModel( response.interafaceList );
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );
}
// blnOnLoadFlag to decide from where call has arrived
function setIncrDownloadField( value, blnModelSelectFlag )
{
	var strData = {};
	var strUrl = 'getIncrDownloadFlagValue.srvc';
	
	if( value != null && value != '' && value != 'Select' )
	{
		strData[ '$model' ] = value;
		strData[ csrfTokenName ] = csrfTokenValue;
		$.ajax(
		{
			cache : false,
			data : strData,
			dataType : 'json',
			success : function( response )
			{
				hideUnhideIncrDownloadFlag( response.INCR_DOWNLOAD_FLAG, blnModelSelectFlag );
			},
			error : ajaxError,
			url : strUrl,
			type : 'POST'
		} );
	}
	
}
function hideUnhideIncrDownloadFlag( value, blnModelSelectFlag )
{
	if( value == 'undefined' )
	{
		$('#increDownloadFlagDiv').hide();
	}
	else
	{
		
		if( value == 'Y' )
		{
			$('#increDownloadFlagDiv').show();
			if( blnModelSelectFlag )
			{
				var checkBoxObj = document.getElementById("incrDownloadFlag");
				if( checkBoxObj )
				{
					$('#incrDownloadFlag').attr('checked',false);
				}
				else
				{
					$('#incrDownloadFlag1').attr('checked',false);
				}
			}
		}
		else
		{
			$('#increDownloadFlagDiv').hide();
		}
		
	}
	
}
function loadInterfaceModel(modelList)
{
	var interfaceCode = document.getElementById('interfaceCode').value;
	$( '#interfaceCode' ).empty();
	$( '#interfaceCode' ).append( $( "<option></option>" ).attr( "value", -1 ).text( "Select" ) );
	$.each( modelList, function( key, val )
	{
		$( '#interfaceCode' ).append( $( "<option></option>" ).attr( "value", key ).text( key +' : '+val ) );
	} );
}
function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}
function paintInterfaceEntry(pageMode,isBankInterfaceMapFormat)
{
	var elt = null, eltCancel = null, eltSave = null, eltNext = null;
	$('#interfaceActionButtonListLT,#interfaceActionButtonListLB, #interfaceActionButtonListRB, #interfaceActionButtonListRT').empty();
	var strBtnLTLB = '#interfaceActionButtonListLT,#interfaceActionButtonListLB';
	var strBtnRTRB = '#interfaceActionButtonListRT,#interfaceActionButtonListRB';
	
	if(pageMode !== 'View')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
					$.blockUI();
					submitEntryForm("saveDownloadProcessDefinition.srvc");
					$(this).unbind("click");
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
	eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
	eltCancel.click(function() {
		goToHome(isBankInterfaceMapFormat);
	});
	eltCancel.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
	
	eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
	eltNext.click(function() {
		$.blockUI();
		$('#datastoreType').removeAttr("disabled");
		$("#pageAction").val("saveAndNext");
		showNextTabForBand('downloadInterfaceBandDetails.srvc');
		$(this).unbind("click");
	});
	eltNext.appendTo($(strBtnRTRB));
	$(strBtnRTRB).append("&nbsp;");
}

function validateAndNavigate(url)
{
	$('#datastoreType').removeAttr("disabled");
	if(url=='downloadInterfaceHooksInfo.srvc')
	{
	 url = 'downloadInterfaceHooksInfo.srvc?$viewState=' + encodeURIComponent( viewState )
			+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState ) + '&'
			+ csrfTokenName + '=' + csrfTokenValue;
	}
	showNextTab(url);
}

function submitEntryForm(url)
{
	var frm = document.getElementById('frmMain');
	frm.action = url;
	frm.target = "";
	frm.method = "POST";
	$('#datastoreType').removeAttr("disabled");
	$('input:radio[name=interfaceScope]').removeAttr("disabled");
	var interfaceScope = null;
	interfaceScope = $('input:radio[name=interfaceScope]:checked').val();
	if(interfaceScope == 'G' && strEntityType == '0')
	{
		$('#clientId').val('');
	}
	$('input[id=sampleFileType1]:radio').removeAttr("disabled",true);
	$('input[id=sampleFileType2]:radio').removeAttr("disabled",true);
	$('#fileFormat').removeAttr("disabled",true);
	frm.submit();  
}
function paintInterfaceBandInfo(pageMode,isBankInterfaceMapFormat)
{
	var elt = null, eltCancel = null, eltSave = null, eltNext = null,eltBack = null;
	$('#bandActionButtonListLT,#bandActionButtonListLB, #bandActionButtonListRB, #bandActionButtonListRT').empty();
	var strBtnLTLB = '#bandActionButtonListLT,#bandActionButtonListLB';
	var strBtnRTRB = '#bandActionButtonListRT,#bandActionButtonListRB';
	
	if(pageMode !== 'View')
	{
		eltSave = createButton('btnSave', 'P',getLabel('btnSave','Save'));
		eltSave.click(function() {
					$.blockUI();
					$.unblockUI();
					return true;
				});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
	eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
	eltCancel.click(function() {
		goToHome(isBankInterfaceMapFormat);
	});
	eltCancel.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
	
	eltBack = createButton('btnBack', 'S', getLabel('btnBack','Back'));
	eltBack.click(function() {
		$.blockUI();
		document.getElementById('tabId').value = 'tab_c';
		goToTab();
	});
	eltBack.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
	
	eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
	eltNext.click(function() {
		$.blockUI();
		$('#datastoreType').removeAttr("disabled");
		showNextTab('showDownloadInterfaceFieldMapping.srvc');
	});
	eltNext.appendTo($(strBtnRTRB));
	$(strBtnRTRB).append("&nbsp;");
}
function paintVerifyActionButtons(submitFlag,requasteState,viewState,isBankInterfaceMapFormat,pageMode,entityType)
{
	var elt = null, eltCancel = null, eltSubmit = null,eltBack = null;
	$('#verifyActionButtonListLT,#verifyActionButtonListLB, #verifyActionButtonListRB, #verifyActionButtonListRT').empty();
	var strBtnLTLB = '#verifyActionButtonListLT,#verifyActionButtonListLB';
	var strBtnRTRB = '#verifyActionButtonListRT,#verifyActionButtonListRB';
	
	if(submitFlag === 'N' && (requasteState == 0 || requasteState == 1) && pageMode !== 'View')
	{
		eltSubmit = createButton('btnSubmit', 'P', getLabel('btnSubmit','Submit'));
		eltSubmit.click(function() {
					submitForm(viewState);
					$(this).unbind("click");
				});
		eltSubmit.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
	eltCancel.click(function() {
		goToHome(isBankInterfaceMapFormat);
	});
	eltCancel.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
	
	eltBack = createButton('btnBack', 'S', getLabel('btnBack','Back'));
	eltBack.click(function() {
		$.blockUI();
		if(entityType == 0)
			document.getElementById('tabId').value = 'tab_h';
		else
			document.getElementById('tabId').value = 'tab_f';
		goToTab();
	});
	eltBack.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
}
function paintDownloadHooksActions(pageMode,isBankInterfaceMapFormat)
{
	var elt = null, eltCancel = null, eltSave = null, eltNext = null,eltBack = null;
	$('#downloadHooksActionButtonListLT,#downloadHooksActionButtonListLB, #downloadHooksActionButtonListRB, #downloadHooksActionButtonListRT').empty();
	var strBtnLTLB = '#downloadHooksActionButtonListLT,#downloadHooksActionButtonListLB';
	var strBtnRTRB = '#downloadHooksActionButtonListRT,#downloadHooksActionButtonListRB';
	
	if(pageMode !== 'View')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
			$.blockUI();
			submitDownloadHooksForm();
			$(this).unbind("click");
		});
		eltSave.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
	eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
	eltCancel.click(function() {
		goToHome(isBankInterfaceMapFormat);
	});
	eltCancel.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
	
	eltBack = createButton('btnBack', 'S', getLabel('btnBack','Back'));
	eltBack.click(function() {
		$.blockUI();
		document.getElementById('tabId').value = 'tab_f';
		goToTab();
	});
	eltBack.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
	
	eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
	eltNext.click(function() {
		$.blockUI();
		$("#pageAction").val("saveAndNext");
		submitDownloadHooksFormAndNext('showVerifySubmitDownloadForm.srvc');
		$(this).unbind("click");
	});
	eltNext.appendTo($(strBtnRTRB));
	$(strBtnRTRB).append("&nbsp;");
}
function submitDownloadHooksFormAndNext(strUrl)
{
	var frm = document.getElementById('frmMain');
	document.getElementById('nextPageUrl').value = strUrl;
	var recordKeNo = document.getElementById('txtRecordKeyNo').value
	$("#columnBox3 option").attr("selected","selected"); 
	$('#columnBox3 :selected').each(function(i, selectedElement) 
	{
		frm.appendChild( createFormField( 'INPUT', 'HIDDEN', 'splitFileParameters['+i+'].fieldName', $(selectedElement).val() ) );
	});
	goToNextpage();
}
function submitDownloadHooksForm()
{
	var frm = document.getElementById('frmMain');
	$("#columnBox3 option").attr("selected","selected"); 
	$('#columnBox3 :selected').each(function(i, selectedElement) 
	{
		frm.appendChild( createFormField( 'INPUT', 'HIDDEN', 'splitFileParameters['+i+'].fieldName', $(selectedElement).val() ) );
	});
	frm.action = "updateDownloadHooks.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit(); 
}
function createButton(btnKey, charIsPrimary,btnVal) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button-primary'
			: 'ft-button-secondary';
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'class' : 'ft-button ft-button-lg ' + strCls,
				'id' : 'button_' + btnKey,
				'value' : btnVal
			});
	return elt;
}


function addNewIrisFunction()
{
	$( '#irisFunctionPopup' ).dialog(
	{
		autoOpen : false,
		//height : 'auto',
		//width : 'auto',
		minHeight : 156,
		maxHeight : 550,
		width : 650,
		minWidth : 400,
		maxWidth : 735,
		modal : true,
		resizable : false,
		draggable : false,
		dialogClass : 'ux-dialog'
		/*buttons : [{
			id : 'customFieldSave',
			text : 'Save',
			click : function() {				
				saveCustomField( 'addCustomFieldForm' ); clearAllCustomFields(); closePopup('customFieldPopup');	
			}
		 }, {
			id : 'customFieldCancel',
			text : 'Cancel',
			click : function() {
				$(this).dialog("close");
			}
		}]*/
	} );
	$( '#irisFunctionPopup' ).dialog( "open" );
}

function cancelIrisFunctionPopup()
{
	$( '#irisFunctionPopup' ).dialog( "close" );
}

function saveIrisFunctionDetails()
{
	/*var objJson = {};
	objJson.functionName = $( '#irisFunctionPopup #functionName' ).val();
	objJson.functionDescription= $( '#irisFunctionPopup #functionDescription' ).val();
	objJson.dataType= $( '#irisFunctionPopup #dataType' ).val();
	objJson.mappingType= $( '#irisFunctionPopup #mappingType' ).val();
	objJson.mappedClass= $( '#irisFunctionPopup #mappedClass' ).val();
	$.ajax({
			url : 'services/saveIrisFunction.json',
			type : 'POST',
			contentType : "application/json",
			data : Ext.encode(objJson),
			success :function(data){
			},
			error : function(data){
			}
		});
	*/	
		
	$( '.disabled' ).removeAttr( "disabled" );
	var frm = document.getElementById( "irisFunctionPoup" );
	frm.action = "saveDownloadIrisCustomFunction.srvc" + '?viewState=' + encodeURIComponent( viewState ) 
		+ '&interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
		+ '&' + csrfTokenName + '='
		+ csrfTokenValue;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function handleSavedFunctionClick()
{
	var functionName = $( '#irisFunctionPopup #savedfunction' ).val();
	clearFunctionPopupvalues();
	$('#isNew').val("N");
	$('#btnIrisFunctionSave').text("Add");
	$.ajax({
			url : 'services/getIrisFunctionList.json?$functionName='+functionName,
			type : 'POST',
			contentType : "application/json",
			//data : Ext.encode(objJson),
			success :function(data){
				if(!Ext.isEmpty(data) && !Ext.isEmpty(data[0]))
				{
					ApplyValuesToFunctionPopupFields(data[0]);
				}
				else
				{
					//Error Message to add
				}
			},
			error : function(data){
			}
		});
}
function ApplyValuesToFunctionPopupFields(objJson)
{
	$( '#irisFunctionPopup #functionName' ).val(objJson.functionName);
	$( '#irisFunctionPopup #functionDescription' ).val(objJson.functionDescription);
	$( '#irisFunctionPopup #dataType' ).val(objJson.dataType);
	$( '#irisFunctionPopup #mappingType' ).val(objJson.mappingType);
	$( '#irisFunctionPopup #mappedClass' ).val(objJson.mappedClass);
	$('#isNew').val("Y");
	$('#btnIrisFunctionSave').text("Update");
}

function clearFunctionPopupvalues()
{
	$( '#irisFunctionPopup #functionName' ).val("");
	$( '#irisFunctionPopup #functionDescription' ).val("");
	$( '#irisFunctionPopup #dataType' ).val("");
	$( '#irisFunctionPopup #mappingType' ).val("");
	$( '#irisFunctionPopup #mappedClass' ).val("");
}

function addToFunction(functionType, functionElementId, functionTxtArea)
{
	var txtarea = document.getElementById(functionTxtArea);
	var funName = $('#'+functionElementId).val();
	if(funName == '' || funName == null)
		return;
   var start = txtarea.selectionStart;
   var end = txtarea.selectionEnd;
   var sel = txtarea.value.substring(start, end);
  
   if(txtarea.value.charAt(end-1) == ')')
   {
	 funName = "$;"+funName;
   }
   var finText = txtarea.value.substring(0, start) + funName+"()" + txtarea.value.substring(end);
   txtarea.value = finText;
   txtarea.focus();
   txtarea.selectionEnd= end + funName.length + 1;
	
}

function addFieldToFunction(functionType, bandElementId, fieldElementId, functionTxtArea)
{
	var fieldValue ="";
	if(functionType == 'GLOBAL')
		fieldValue = $("#divGlobalBandType #"+bandElementId).val();
	else
		fieldValue = $("#"+bandElementId).val();
	if(fieldValue == '' || fieldValue == null || $("#"+fieldElementId).val() == '')
		return;
	if(fieldValue == '' || fieldValue == null)
		return;
	fieldValue = fieldValue +"."+ $("#"+fieldElementId).val();
	var txtarea = document.getElementById(functionTxtArea);
   var start = txtarea.selectionStart;
   var end = txtarea.selectionEnd;
   var sel = txtarea.value.substring(start, end);
   if(!(txtarea.value.substring(0, start).charAt(txtarea.value.substring(0, start).length - 1) == '(' && txtarea.value.substring(end).charAt(txtarea.value.substring(end).length -1) == ')'))
   {
	 fieldValue = ","+fieldValue;
   } 
   var finText = txtarea.value.substring(0, start) + fieldValue+ txtarea.value.substring(end);
   txtarea.value = finText;
   txtarea.focus();
   txtarea.selectionEnd= end + fieldValue.length;
}

function showAddMediumPopup()
{
	$( '#addMediumPopUp' ).dialog(
	{
		autoOpen : false,
		//height : 'auto',
		//width : 'auto',
		minHeight : 156,
		maxHeight : 550,
		width : 650,
		minWidth : 400,
		maxWidth : 735,
		modal : true,
		resizable : false,
		draggable : false,
		dialogClass : 'ux-dialog'
		/*buttons : [{
			id : 'customFieldSave',
			text : 'Save',
			click : function() {				
				saveCustomField( 'addCustomFieldForm' ); clearAllCustomFields(); closePopup('customFieldPopup');	
			}
		 }, {
			id : 'customFieldCancel',
			text : 'Cancel',
			click : function() {
				$(this).dialog("close");
			}
		}]*/
	} );
	$( '#addMediumPopUp' ).dialog( "open" );
}

function cancelAddMediumPopup()
{
	$( '#addMediumPopUp' ).dialog( "close" );
}

function saveIrisMediumDetails()
{
	/*var objJson = {};
	objJson.functionName = $( '#irisFunctionPopup #functionName' ).val();
	objJson.functionDescription= $( '#irisFunctionPopup #functionDescription' ).val();
	objJson.dataType= $( '#irisFunctionPopup #dataType' ).val();
	objJson.mappingType= $( '#irisFunctionPopup #mappingType' ).val();
	objJson.mappedClass= $( '#irisFunctionPopup #mappedClass' ).val();
	$.ajax({
			url : 'services/saveIrisFunction.json',
			type : 'POST',
			contentType : "application/json",
			data : Ext.encode(objJson),
			success :function(data){
			},
			error : function(data){
			}
		});
	*/	
	$( '#addMediumPopUp #mediumType' ).attr("disabled", false);
	$( '#addMediumPopUp #modelType' ).attr("disabled", false);
	$( '#addMediumPopUp #formatType' ).attr("disabled", false);
	$( '#addMediumPopUp #mediumName' ).attr("disabled", false);	
	$( '.disabled' ).removeAttr( "disabled" );
	var frm = document.getElementById( "addMedium" );
	frm.action = "saveDownloadIrisMedium.srvc" + '?viewState=' + encodeURIComponent( viewState ) 
		+ '&interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
		+ '&' + csrfTokenName + '='
		+ csrfTokenValue;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function handleSavedMediumClick()
{
	var functionName = $( '#addMediumPopUp #savedMedium' ).val();
	clearMediumPopupvalues();
	$('#isNew').val("N");
	$('#btnIrisMediumSave').text("Add");
	if(functionName != ''){
	$.ajax({
			url : 'services/getIrisMediumList.json?$functionName='+functionName,
			type : 'POST',
			contentType : "application/json",
			//data : Ext.encode(objJson),
			success :function(data){
				if(!Ext.isEmpty(data) && !Ext.isEmpty(data[0]))
				{
					ApplyValuesToMediumPopupFields(data[0]);
				}
				else
				{
					//Error Message to add
				}
			},
			error : function(data){
			}
		});
	}
}

function clearMediumPopupvalues()
{
	$( '#addMediumPopUp #mediumType' ).val("");
	$( '#addMediumPopUp #modelType' ).val("");
	$( '#addMediumPopUp #formatType' ).val("");
	$( '#addMediumPopUp #mediumName' ).val("");
	$( '#addMediumPopUp #description' ).val("");
	$( '#addMediumPopUp #lineSeperator' ).val("");
	$( '#addMediumPopUp #executionClass' ).val("");
	$( '#addMediumPopUp #formatterClass' ).val("");
	
	$( '#addMediumPopUp #mediumType' ).attr("disabled", false);
	$( '#addMediumPopUp #modelType' ).attr("disabled", false);
	$( '#addMediumPopUp #formatType' ).attr("disabled", false);
	$( '#addMediumPopUp #mediumName' ).attr("disabled", false);
}

function ApplyValuesToMediumPopupFields(objJson)
{
	$( '#addMediumPopUp #mediumType' ).val(objJson.mediumType);
	$( '#addMediumPopUp #modelType' ).val(objJson.modelType);
	$( '#addMediumPopUp #formatType' ).val(objJson.formatType);
	$( '#addMediumPopUp #mediumName' ).val(objJson.mediumName);
	$( '#addMediumPopUp #mediumType' ).attr("disabled", true);
	$( '#addMediumPopUp #modelType' ).attr("disabled", true);
	$( '#addMediumPopUp #formatType' ).attr("disabled", true);
	$( '#addMediumPopUp #mediumName' ).attr("disabled", true);
	
	$( '#addMediumPopUp #description' ).val(objJson.description);
	$( '#addMediumPopUp #lineSeperator' ).val(objJson.lineSeperator);
	$( '#addMediumPopUp #executionClass' ).val(objJson.executionClass);
	$( '#addMediumPopUp #formatterClass' ).val(objJson.formatterClass);
	$('#btnIrisMediumSave').text("Update");
}