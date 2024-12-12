var objRecord;

// for Custom Fields - START
function showAddCFieldPopUp()
{
	$( '#customFieldPopup' ).dialog(
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
			id : 'customFieldCancel',
			text : 'Cancel',
			click : function() {
				$(this).dialog("close");
			}
		},{
			id : 'customFieldSave',
			text : 'Save',
			click : function() {				
				saveCustomField( 'addCustomFieldForm' ); clearAllCustomFields(); closePopup('customFieldPopup');	
			}
		 }]*/
	} );
	$( '#customFieldPopup' ).dialog( "open" );
}
function clearAllCustomFields()
{
	$( "#FieldName" ).val( "" );
	$( "#DataType" ).val( "" );
	$( "#Length" ).val( "" );
	$( "#Mandatory" ).val( "" );
}
function saveCustomField( frmId )
{
	$( '.disabled' ).removeAttr( "disabled" );
	var frm = document.getElementById( frmId );
	frm.elements[ "custBandName" ].value = selectedBand;
	frm.action = "saveDownloadCustomField.srvc" + '?viewState=' + encodeURIComponent( viewState ) 
		+ '&interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState )
		+ '&' + csrfTokenName + '='
		+ csrfTokenValue;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
// for Custom Fields - END

function closePopup( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
}

// for Advanced Mapping Fields - START
// function addAdvanceMapping( rowIndex, intField, dataType, Length, fieldType,
// bandName )
function addAdvanceMapping( record )
{

	$( '#advancedPopup' ).dialog(
	{
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 735,
		modal : true,
		resizable : false,
		draggable : false
		/*buttons : [{
			id : 'advanceMappingSave',			
			text : getLabel('btnSave','Save'),
			disabled : pageMode == 'View' ? true : false,
			click : function() {				
				if(isAdvanceValuesValid())
				{
					saveAdvancedValues(); clearAllAdvancedFields(); closePopup('advancedPopup');
				}
				else
				{
							Ext.MessageBox.show({
										title : "Error",
										msg : 'Band, Field and Code Map reference Fields are mandotary',
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
							});				
				}
				$(this).dialog("close");
			}
		 }, {
			id : 'advanceMappingCancel',
			text : getLabel('btnCancel','Cancel'),
			click : function() {
				$(this).dialog("close");
			}
		}]*/
	} );
	objRecord = record;
	
	setFilterBandValue( record.get( 'dataType' ) );
	if( pageMode == 'View')
	{
		$('#advancedPopup').find('input, textarea, select').attr('disabled','disabled');
		$('#advanceMappingSave').find('button:first').hide();
		$('#advanceMappingCancel').find('button').hide();
	}
	else
	{
		$('#advancedPopup').find('input, textarea, button, select').removeAttr('disabled');	
		$('#advanceMappingSave').find('button:last').hide();
	}
	changeAdvMapType( record.get( 'mappingType' ) );
	setExistingValues( record );
	$('#dataType').attr("readOnly","true");
	$('#interfaceField').attr("readOnly","true");
	$('#length').attr("readOnly","true");
	$( '#advancedPopup' ).dialog( "open" );
}

function cancelAdvancedPopup()
{	
	$('#advancedPopup').dialog('close');
}

function saveAdvancedPopup(){
	if(isAdvanceValuesValid())
	{
		saveAdvancedValues(); clearAllAdvancedFields(); cancelAdvancedPopup();
	}
	else
	{
				Ext.MessageBox.show({
							title : "Error",
							msg : 'Band, Field and Code Map reference Fields are mandatary',
							buttons : Ext.MessageBox.OK,
							cls : 'ux_popup',
							icon : Ext.MessageBox.ERROR
				});				
	}
	$(this).dialog('close');
}

function changeAdvMapType( mapType )
{
	clearAllAdvancedFields();
	if( mapType == 0 || mapType == 8 )
	{
		hideAllDiv();
	}
	else if( mapType == 1 )
	{
		hideAllDiv();
		$( "#divReferenced" ).attr( "class", "block" );
	}
	else if( mapType == 2 )
	{
		hideAllDiv();
		$( '#divFunction' ).attr( "class", "block" );
	}
	else if( mapType == 3 )
	{
		hideAllDiv();
		$( '#divCodemap' ).attr( "class", "block" );
	}
	else if( mapType == 4 )
	{
		hideAllDiv();
		$( '#divComplex' ).attr( "class", "block" );
	}
	else if( mapType == 5 )
	{
		hideAllDiv();
		$( '#divConstant' ).attr( "class", "block" );
	}
	else if( mapType == 6 )
	{
		hideAllDiv();
		$( '#divRunningno' ).attr( "class", "block" );
	}
	else if( mapType == 7 )
	{
		hideAllDiv();
		$( '#divBatchTotal' ).attr( "class", "block" );
	}
	else if( mapType == 9 )
	{
		hideAllDiv();
		$( '#divFilterParam' ).attr( "class", "block" );
	}
	else if( mapType == 10 )
	{
		hideAllDiv();
		$( '#divGlobalFunction' ).attr( "class", "block" );
	}
	else if (mapType == 11)
	{
		hideAllDiv();	
		$('#divNamespace').attr("class","block");
	}
	else if( mapType == 13 )
	{
		hideAllDiv();
		$( "#divReferenced" ).attr( "class", "block" );
		$( '#divCodemap' ).attr( "class", "block" );
	}
	else if (mapType == 15)
	{
		hideAllDiv();
		$('#divListOfValues').attr("class","block");
	}
}

function setExistingValues( record )
{
	$( "#txtFieldRemarks" ).val( record.get( 'fieldRemarks' ) );
	$( "#txtDefaultValue" ).val( record.get( 'defaultValue' ) );
	$( '#interfaceField' ).val( record.get( 'interfaceField' ) );
	$( '#dataType' ).val( record.get( 'dataType' ) );
	$( '#length' ).val( record.get( 'length' ) );
	$( '#bandName1' ).val( record.get( 'bandName' ) );
	$( '#priority' ).val( record.get( 'priority' ) );
	$( '#order' ).val( record.get( 'order' ) );
	
	if ("DESC" == record.get( 'order' ) )
	{
		document.getElementById('Asc').checked = false;
		document.getElementById('Desc').checked = true;		
	}
	else if ("ASC" == $("#order").val())
	{
		document.getElementById('Asc').checked = true;
		document.getElementById('Desc').checked = false;		
	}
	else
	{
		document.getElementById('Asc').checked = false;
		document.getElementById('Desc').checked = false;
	}
	
	if ((record.get( 'dataType' ) != 'NUMBER')&&(record.get( 'dataType' ) != 'DECIMAL'))/*IRISADM-120 : Running No. will be applicable only for NUMBER fields*/
	{
		$("#cmbMapType option[value='6']").remove();
		$("#cmbMapType option[value='7']").remove();
	}
	else
	{ 
		if((record.get( 'dataType' ) == 'NUMBER' || record.get( 'dataType' ) == 'DECIMAL') && $("#cmbMapType option[value='6']").length <= 0)
			{
				var opt = document.createElement("option");              
				document.getElementById('cmbMapType').options.add(opt);       
				opt.text = lblRunningNo;
				opt.value = '6';
			}
		/*IRISADM-116 - Changes in Advanced Mapping - Batch Total*/
		if((record.get( 'dataType' ) == 'NUMBER' || record.get( 'dataType' ) == 'DECIMAL') && $("#cmbMapType option[value='7']").length <= 0)
		{
			var opt = document.createElement("option");              
			document.getElementById('cmbMapType').options.add(opt);       
			opt.text = lblBatchTotal;
			opt.value = '7';		
		}				
	}
	setFunctionList( record.get( 'dataType' ), 'cmbFunctions' );
	setFunctionList( record.get( 'dataType' ), 'cmbComplexFunctions' );
	setFunctionList( record.get( 'dataType' ), 'cmbGlobalFunctions' );

	//FT:Added to set the bandlist for referenced mapping
	setBandList( record.get( 'bandName' ), 'cmbBandRef' );
	setResetBandList( record.get( 'bandName' ), 'cmbResetBand' );

	var mapType =  record.get( 'mappingType' );
	
	var complexFound = false;
	var functionFound = false;
	var globalFound = false;
	$("#cmbMapType > option").each(function() 
	{
	    //alert(this.text + ' ' + this.value);
		if( 'Complex' == this.text )
		{
			complexFound = true;
		}//if
		else if( 'Global Function' == this.text )
		{
			globalFound = true;
		}
		else if( 'Function' == this.text )
		{
			functionFound = true;
		}
	}
	);
	/*
	 * In case of customer UI need to append function manually
	 */
	/* Commenting the Code, As 'Function','Complex', 'Global Function' options are not required for Client User */
	/*if( !functionFound )
	{
		$("#cmbMapType").append(new Option('Function',2));	
	}
	if( !complexFound )
	{
		$("#cmbMapType").append(new Option('Complex',4));
	}
	if( !globalFound )
	{
		$("#cmbMapType").append(new Option('Global Function',10));		
	}
	*/
	
	$("#cmbMapType").val(mapType);
	
	
	if( mapType == 1 )
	{
		$( "#cmbBandRef" ).val( record.get( 'bandNameRef' ) ).prop('selected',true);
		setRefFieldList( $( "#cmbBandRef" ).val(), 'cmbFieldRef', 'dataType', 'length', 'bandName1', 'interfaceField' );
		$( "#cmbFieldRef" ).val( record.get( 'fieldIdRef' ) ).prop('selected',true);
	}
	else if( mapType == 2 )
	{
		$( "#txtFunction" ).val( record.get( 'translationFunctionName' ) );
		if( 'true' == isBankInterfaceMapFormat )
		{
			$("#cmbFunctions").removeAttr('disabled');
		}
		else if( 'false' == isBankInterfaceMapFormat )
		{
			$("#txtFunction").attr('disabled','disabled');
			$("#cmbFunctions").attr('disabled','disabled');			
			$("#cmbMapType").attr('disabled','disabled');
			$("#cmbMapType").val(2);
		}
	}
	else if( mapType == 3 )
	{
		$( "#cmbCodeMapRef" ).val( record.get( 'codeMapRef' ) );
	}
	else if( mapType == 4 )
	{
		$( "#txtComplexFunction" ).val( record.get( 'translationFunctionName' ) );
		if( 'true' == isBankInterfaceMapFormat )
		{
			$("#cmbFunctions").removeAttr('disabled');
			$("#cmbMapType").val(4);
		}
		else if( 'false' == isBankInterfaceMapFormat )
		{
			$("#txtComplexFunction").attr('disabled','disabled');
			$("#cmbFunctions").attr('disabled','disabled');
			$("#cmbMapType").attr('disabled','disabled');
		}
	}
	else if( mapType == 5 )
	{
		$( "#txtConstant" ).val( record.get( 'constantValue' ) );
	}
	else if( mapType == 6 )
	{
		$( "#cmbResetBand" ).val( record.get( 'resetRunningNoBand' ) );
	}
	else if( mapType == 7 )
	{
		$( "#type" ).val(record.get( 'batchTotalType' ));
		$( "#cmbBatchFieldType" ).val(record.get( 'bandNameRef' ));
		setRefFieldList($( "#cmbBatchFieldType" ).val(),'cmbBatchFieldRef','dataType','length','bandName1','interfaceField');
		$( "#cmbBatchFieldRef" ).val(record.get( 'fieldIdRef' ));
	}
	else if( mapType == 9 )
	{
		$( '#divFilterParam' ).attr( "class", "block" );
		$("#cmbFilter").val( record.get( 'fieldIdRef' ) );
	}
	else if( mapType == 10 )
	{
		$( "#txtGlobalFunction" ).val( record.get( 'translationFunctionName' ) );
		if( 'true' == isBankInterfaceMapFormat )
		{
			$("#cmbFunctions").removeAttr('disabled');
		}
		else if( 'false' == isBankInterfaceMapFormat )
		{
			$("#txtGlobalFunction").attr('disabled','disabled');
			$("#cmbFunctions").attr('disabled','disabled');
			$("#cmbMapType").attr('disabled','disabled');
			$("#cmbMapType").val(10);
		}
	}
	else if ( mapType == 11)
	{
		$( "#xmlNamespace" ).val( record.get( 'xmlNamespace' ) );
		$( "#xmlNamespaceURI" ).val( record.get( 'xmlNamespaceURI' ) );
	}
	else if( mapType == 13)
	{
		$( "#cmbBandRef" ).val( record.get( 'bandNameRef' ) ).prop('selected',true);
		setRefFieldList( $( "#cmbBandRef" ).val(), 'cmbFieldRef', 'dataType', 'length', 'bandName1', 'interfaceField' );
		$( "#cmbFieldRef" ).val( record.get( 'fieldIdRef' ) ).prop('selected',true);
		$( "#cmbCodeMapRef" ).val( record.get( 'codeMapRef' ) );
	}
	else if( mapType == 15 )
	{
		$( "#txtListOfValues" ).val( record.get( 'constantValue' ) );
	}
}

function hideAllDiv()
{
	$( '#divReferenced' ).attr( "class", "hidden" );
	$( '#divFunction' ).attr( "class", "hidden" );
	$( '#divCodemap' ).attr( "class", "hidden" );
	$( '#divComplex' ).attr( "class", "hidden" );
	$( '#divConstant' ).attr( "class", "hidden" );
	$( '#divRunningno' ).attr( "class", "hidden" );
	$( '#divFilterParam' ).attr( "class", "hidden" );
	$( '#divGlobalFunction' ).attr( "class", "hidden" );
	$( '#divNamespace').attr( "class", "hidden" );
	$( '#divBatchTotal').attr( "class", "hidden" );
	$( '#lblGlobalFunctionDesc' ).hide();
	$( '#refHelp' ).hide();
	$( '#refHide' ).hide();
	$('#divListOfValues').attr( "class", "hidden" );
}

function clearAllAdvancedFields()
{
	$( "#cmbBandRef" ).val( "" );
	$( "#cmbFieldRef" ).val( "" );
	$( "#txtFunction" ).val( "" );
	$( "#cmbCodeMapRef" ).val( "" );
	$( "#txtComplexFunction" ).val( "" );
	$( "#txtConstant" ).val( "" );
	$( "#cmbResetBand" ).val( "" );
	$( "#txtPrevBandRef" ).val( "" );
	$( "#cmbFunctions" ).val( "" );
	$( "#cmbGlobalFunctions" ).val( "" );
	$( "#lblBandFieldDesc" ).text( "" );
	$( "#cmbComplexFieldRef" ).val( "" );
	$( "#cmbComplexBandRef" ).val( "" );
	$( "#cmbComplexFunctions" ).val( "" );
	$( "#cmbFilter" ).val( "" );
	$( "#txtGlobalFunction" ).val( "" );
	$("#txtListOfValues").val("");
	hideHelp();
	document.getElementById( 'lblDefault1' ).innerHTML = lblDefault;
	document.getElementById( 'lblUpConstant1' ).innerHTML = lblUpConstant;
}
function hideHelp()
{
	document.getElementById( 'lblFunctionDesc' ).innerHTML = "";
	document.getElementById( 'lblComplexFunctionDesc' ).innerHTML = "";
	document.getElementById( 'lblGlobalFunctionDesc' ).innerHTML = "";
	document.getElementById( 'lblFunctionDesc' ).style.display = "none";
	document.getElementById( 'lblComplexFunctionDesc' ).style.display = "none";
	document.getElementById( 'lblGlobalFunctionDesc' ).style.display = "none";
	$( '#refHideC' ).hide();
	$( '#refHideG' ).hide();
	$( '#refHideF' ).hide();
	$( '#refHelpF' ).hide();
	$( '#refHelpG' ).hide();
	$( '#refHelpC' ).hide();
}

function saveAdvancedValues()
{
	objRecord.set( 'fieldRemarks', $( "#txtFieldRemarks" ).val() );
	objRecord.set( 'defaultValue', $( "#txtDefaultValue" ).val() );
	document.getElementById( 'lblDefault1' ).innerHTML = lblDefault;
	document.getElementById( 'lblUpConstant1' ).innerHTML = lblUpConstant;

	var dataStoreType = getFormatType();
	if( dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE
		&& dataStoreType != FormatType.BIGBATCH )
	{
		// seqNmbr disabled = false;
	}

	var dataType = objRecord.get( 'dataType' );
	if( dataType == 'DATE' || dataType == 'DECIMAL' || dataType == 'DATETIME' )
	{
		// columnFormat disabled = false;
		// decimalValue disabled = false;
	}
	else
	{
		// columnFormat disabled = true;
		// decimalValue disabled = true;
	}

	// defaultValue disabled = false;
	// mandatory disabled = false;

	objRecord.set( 'constantValue', '' );
	objRecord.set( 'translationFunctionName', '' );
	objRecord.set( 'resetRunningNoBand', '' );
	objRecord.set( 'bandNameRef', '' );
	objRecord.set( 'fieldIdRef', '' );
	objRecord.set( 'codeMapRef', '' );
	
	objRecord.set( 'order', $("#order").val() );
	objRecord.set( 'priority', $("#priority").val() );

	var mapType = $( '#cmbMapType' ).val();
	if( mapType == 0 )
	{
		objRecord.set( 'bandMappingDesc', lblDirect );
		objRecord.set( 'mappingType', mapType );
	}
	else if( mapType == 1 ) //Referenced
	{
		objRecord.set( 'bandMappingDesc', lblReferenced );
		objRecord.set( 'bandNameRef', $( "#cmbBandRef" ).val() );
		objRecord.set( 'fieldIdRef', $( "#cmbFieldRef" ).val() );
		objRecord.set( 'mappingType', mapType );

		if(dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE
			&& dataStoreType != FormatType.BIGBATCH )
		{
			objRecord.set( 'seqNmbr', "" );
			// seqNmbr disabled = true;
		}
		else
		{
			//objRecord.set( 'absoluteXpath1', "" );
		}
	}
	else if( mapType == 2 ) //Function
	{
		objRecord.set( 'bandMappingDesc', lblFunction );
		objRecord.set( 'translationFunctionName', $( "#txtFunction" ).val() );
		objRecord.set( 'mappingType', mapType );

		objRecord.set( 'columnFormat', "" );
		// columnFormat disabled = true;
		objRecord.set( 'decimalValue', "" );
		// decimalValue disabled = true;
	}
	else if( mapType == 3 )
	{
		objRecord.set( 'bandMappingDesc', lblCodeMap );
		objRecord.set( 'codeMapRef', $( "#cmbCodeMapRef" ).val() );
		objRecord.set( 'mappingType', mapType );
	}
	else if( mapType == 4 ) // Complex
	{
		objRecord.set( 'bandMappingDesc', lblComplex );
		objRecord.set( 'translationFunctionName', $( "#txtComplexFunction" ).val() );
		objRecord.set( 'mappingType', mapType );

		if( dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE
			&& dataStoreType != FormatType.BIGBATCH )
		{
			objRecord.set( 'seqNmbr', "" );
			// seqNmbr disabled = true;
		}
		else
		{
			//objRecord.set( 'absoluteXpath1', "" );
		}
	}
	else if( mapType == 5 ) // Constant
	{
		objRecord.set( 'bandMappingDesc', lblConstant );
		objRecord.set( 'constantValue', $( "#txtConstant" ).val() );
		objRecord.set( 'mappingType', mapType );

		if( dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE
			&& dataStoreType != FormatType.BIGBATCH )
		{
			objRecord.set( 'seqNmbr', "" );
			// seqNmbr disabled = true;
		}
		else
		{
			//objRecord.set( 'absoluteXpath1', "" );
		}
	}
	else if( mapType == 6 ) // Running No.
	{
		objRecord.set( 'bandMappingDesc', lblRunningNo );
		objRecord.set( 'resetRunningNoBand', $( "#cmbResetBand" ).val() );
		objRecord.set( 'mappingType', mapType );
		if( dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE
			&& dataStoreType != FormatType.BIGBATCH )
		{
			objRecord.set( 'seqNmbr', "" );
			// seqNmbr disabled = true;
		}
		else
		{
			//objRecord.set( 'absoluteXpath1', "" );
		}
		// columnFormat disabled = true;
		// decimalValue disabled = true;
		// defaultValue disabled = true;
	}
	else if (mapType == 7)
	{		
		objRecord.set( 'batchTotalType', $( "#type" ).val() );
		objRecord.set( 'bandNameRef', $( "#cmbBatchFieldType" ).val() );
		objRecord.set( 'fieldIdRef', $( "#cmbBatchFieldRef" ).val() );
		objRecord.set( 'bandMappingDesc', lblBatchTotal );
		objRecord.set( 'mappingType', mapType );
	}
	else if( mapType == 8 ) // Internal
	{
		objRecord.set( 'bandMappingDesc', lblInternal );
		objRecord.set( 'mappingType', mapType );
		if( dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE
			&& dataStoreType != FormatType.BIGBATCH )
		{
			objRecord.set( 'seqNmbr', "" );
			// seqNmbr disabled = true;
		}
		else
		{
			//objRecord.set( 'absoluteXpath1', "" );
		}
		// mandatory disabled = true;
	}
	else if( mapType == 9 )
	{
		objRecord.set( 'bandMappingDesc', lblFilterParam );
		objRecord.set( 'fieldIdRef', $( "#cmbFilter" ).val() );
		objRecord.set( 'mappingType', mapType );
		if( dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE
			&& dataStoreType != FormatType.BIGBATCH && dataStoreType != FormatType.NACHA )
		{
			objRecord.set( 'seqNmbr', "" );
			// seqNmbr disabled = true;
		}
		else
		{
			//objRecord.set( 'absoluteXpath1', "" );
		}
	}
	else if( mapType == 10 ) // Global Function
	{
		objRecord.set( 'bandMappingDesc', lblGlobalFunction );
		objRecord.set( 'translationFunctionName', $( "#txtGlobalFunction" ).val() );
		objRecord.set( 'mappingType', mapType );
		objRecord.set( 'columnFormat', "" );
		// columnFormat disabled = true;
		objRecord.set( 'decimalValue', "" );
		// decimalValue disabled = true;
	}
	else if( mapType == 11 ) // XML Namespace
	{
		objRecord.set( 'bandMappingDesc', lblXMLNamespace );
		objRecord.set( 'mappingType', mapType );
		objRecord.set( 'relativeXpath', $("#xmlNamespace").val() );
		objRecord.set( 'constantValue', $("#xmlNamespaceURI").val() );
		//document.getElementById('mappingDetails['+ rowIndex +'].absoluteXpath1').disabled = true;
	}
	else if( mapType == 13 ) // Referenced Code Map
	{
		objRecord.set( 'bandMappingDesc', lblReferenced );
		objRecord.set( 'bandMappingDesc', lblCodeMap );
		objRecord.set( 'bandNameRef', $( "#cmbBandRef" ).val() );
		objRecord.set( 'fieldIdRef', $( "#cmbFieldRef" ).val() );
		objRecord.set( 'codeMapRef', $( "#cmbCodeMapRef" ).val() );
		objRecord.set( 'mappingType', mapType );

		if( dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE
			&& dataStoreType != FormatType.BIGBATCH )
		{
			objRecord.set( 'seqNmbr', "" );
			// seqNmbr disabled = true;
		}
		else
		{
			//objRecord.set( 'absoluteXpath1', "" );
		}
	}
	else if (mapType == 15)  // List of values
	{
		objRecord.set( 'bandMappingDesc', lblListOfValues );
		objRecord.set( 'constantValue', $( "#txtListOfValues" ).val() );
		objRecord.set( 'mappingType', mapType );

		if( dataStoreType != FormatType.XML && dataStoreType != FormatType.SWIFT && dataStoreType != FormatType.FEDWIRE
			&& dataStoreType != FormatType.BIGBATCH )
		{
			objRecord.set( 'seqNmbr', "" );
			// seqNmbr disabled = true;
		}
		else
		{
			//objRecord.set( 'absoluteXpath1', "" );
		}
	}
}
function setField(type)
{
    if(type == 'C')
    {
        $('#cmbBatchFieldRef').attr("disabled","disabled");
    }
    else if(!$("#lblSourceField").hasClass("required"))
    {
        $("#cmbBatchFieldRef").removeAttr("disabled");
    }
}
//for Advanced Mapping Fields - END

function paintFieldMappingActionList(entityType)
{
	var elt = null, eltCancel = null, eltSave = null, eltNext = null,canShow = true,eltBack = null;
	$('#fieldMappingActionButtonListLT,#fieldMappingActionButtonListRT, #fieldMappingActionButtonListLB, #fieldMappingActionButtonListRB')
			.empty();
	var strBtnLTLB = '#fieldMappingActionButtonListLT,#fieldMappingActionButtonListLB';
	var strBtnRTRB = '#fieldMappingActionButtonListRT,#fieldMappingActionButtonListRB';
	
	if(pageMode !='View')
	{
		eltSave = createButton('btnSave', 'P', getLabel('btnSave','Save'));
		eltSave.click(function() {
					$.blockUI();
					callUpdateInterfaceFieldMapping();
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
		document.getElementById('tabId').value = 'tab_e';
		goToTab();
	});
	eltBack.appendTo($(strBtnLTLB));
	$(strBtnLTLB).append("&nbsp;");
		
	
	eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
	eltNext.click(function() {
		$.blockUI();
		$("#pageAction").val("saveAndNext");
				if(entityType == 0){
					if(pageMode=="View")
						{
						var url = 'downloadInterfaceHooksInfo.srvc?$viewState=' + encodeURIComponent( viewState )
						+ '&?interfaceMapMasterViewState=' + encodeURIComponent( interfaceMapMasterViewState ) + '&'
						+ csrfTokenName + '=' + csrfTokenValue;
						showNextTab(url);
						}
					else
					   callUpdateInterfaceFieldMappingAndNext();
					   $(this).unbind("click");
				} else {
					showNextTab('showVerifySubmitDownloadForm.srvc');
				}
	});
	eltNext.appendTo($(strBtnRTRB));
	$(strBtnRTRB).append("&nbsp;");
	
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
function isAdvanceValuesValid()
{
	var mapType = $( '#cmbMapType' ).val();
	var result = true;
	if(mapType == '13')
	{
		if( Ext.isEmpty($( "#cmbBandRef" ).val()) || Ext.isEmpty($( "#cmbFieldRef" ).val()) || Ext.isEmpty($( "#cmbCodeMapRef" ).val()))
		{	
			result = false;
		}
	}
	return result;
}
$.fn.fieldMappingCarousel = function(config) {
		var me = this;
		drawCarousel();

		$(document).on('hideShowSidebar', function() {
					drawCarousel();
				});
		function drawCarousel() {
			var configration = me.config;
			me.addClass('ft-carousel-slick-wrapper');
			var slickListDiv = document.createElement('div');
			$(slickListDiv).addClass('ft-carousel-slick-list');
			me.html(slickListDiv);

			$.each(config.data, function(index, value) {
						var summaryCaroItemDiv = document.createElement('div');
						$(summaryCaroItemDiv)
								.addClass("ft-carousel-slick-item");
						$(summaryCaroItemDiv).css("height", "45px");
						
						if(selectedBand != null && selectedBand != ''){
							if(value.bandName == selectedBand){
								$(summaryCaroItemDiv).addClass("ft-carousel-slick-active");
							}
						}
						else if(index == 0){
							$(summaryCaroItemDiv).addClass("ft-carousel-slick-active");
						}
							
						// title div
						var titleDiv = document.createElement('div');
						if (config.titleNode != undefined
								&& config.titleNode !== '') {
							$(titleDiv).html(value[config.titleNode]);
						} else {
							if (config.titleRenderer != undefined
									&& config.titleRenderer !== '') {
								$(titleDiv).html(config.titleRenderer.apply(
										this, [value]));
							}
						}
						$(titleDiv).prop('title', value[config.titleNode])
						$(titleDiv).addClass("ft-carousel-slick-title");
						$(titleDiv).appendTo(summaryCaroItemDiv);

						// amount div
						var amountDiv = document.createElement('div');
						if (config.contentNode != undefined
								&& config.contentNode !== '') {
							$(amountDiv).html(value[config.contentNode]);
						} else {
							if (config.contentRenderer != undefined
									&& config.contentRenderer !== '') {
								$(amountDiv).html(config.contentRenderer.apply(
										this, [value]));
							}
						}
						$(amountDiv).addClass("ft-carousel-slick-value");
						$(amountDiv).prop('title', value[config.contentNode]);
						$(amountDiv).appendTo(summaryCaroItemDiv);
						$(summaryCaroItemDiv).appendTo(slickListDiv);
					});// end of for loop
			var numberOfSlideToShow = ((me.width()) / 180);
			numberOfSlideToShow = (numberOfSlideToShow - numberOfSlideToShow
					% 1)

			var list = $(slickListDiv);
			var event = 'click.slick_carousel';
			var str = '.ft-carousel-slick-item';
			var a = 'ft-carousel-slick-active';
			var options = {
				draggable : false,
				infinite : false,
				slidesToShow : numberOfSlideToShow,
				slidesToScroll : numberOfSlideToShow
			};

			list.each(function() {
				var el = $(this);
				// Remove the carousel.
				el.unslick();
				// Add the carousel.
				el.slick(options);

					// Watch for click events.
					/*
					 * el.off(event).on(event, str, function() { var item =
					 * $(this); var others = item.siblings(str); // Add active
					 * to this item. item.addClass(a); // Remove active from
					 * others. others.removeClass(a); });
					 */
				});
		}
	};