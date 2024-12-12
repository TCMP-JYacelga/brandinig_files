function showAddBandPopUp()
{
	//$("#newSave").attr("class","block");
	//$("#updateSave").attr("class","hidden");
	$('#addBandPopUp').dialog( {
		autoOpen : false,
		minHeight : 156,
		maxHeight : 550,
		width : 735,
		modal : true,
		resizable : false,
		draggable : false
		/*buttons : [{
			text:getLabel('btnSave','Save'),
			"class" : 'ft-button-secondary',
			click : function() {
				start_blocking('Please Wait',this );
				addBand('addBandForm','N');
				closePopup('addBandPopUp');
				$(this).dialog('close');				
			 }
			},{
			text:getLabel('btnSaveAndAddNew','Save and Add New'),
			"class" : 'ft-button-primary',
			click : function() {
				start_blocking('Please Wait',this );
				addBand('addBandForm','Y');
				$(this).dialog("close");
			}
		}]*/
	});
	//$('#popupContainer').css({"overflowY":"auto"});
	$('#btnUpdate').hide();
	$('#btnUpdateAndAddNew').hide();
	$('#btnSave').show();
	$('#btnSaveAndAddNew').show();
	$('#addBandPopUp').dialog('open');
	$('#addBandForm').each (function(){
		this.reset();
		if( 1 == INTERFACING_ENTITY_TYPE || 'false' == isBankInterfaceMapBand)
		{
			$('#bandSequence').attr("disabled","disabled");
			$('#parentBand').attr("disabled","disabled")
			$('#mandatory').attr("disabled","disabled")					
		}//Client mode disable few fields
	});
	$("#bandType").removeAttr("disabled");
	$("#bandName").removeAttr("disabled"); 
	$("#mandatory").removeAttr("disabled");
	document.getElementById("parentBand").innerHTML = "";
	var opt = document.createElement("option");              
	document.getElementById("parentBand").options.add(opt);       
	opt.text = lblSelect;
	opt.value = "";
	var bandType = document.getElementById("bandType").value;
	if(!bandType || isEmpty(bandType));
	else
	{
		onBandTypeSelect(bandType, document.getElementById("bandType"));
		$("#parentBand").val($("#txtParentBand").val());		
	}
	if(null != $('#fileFormat') && 'Database' != $('#fileFormat').val())
	{
		$("#absoluteXpath1").attr("readonly","readonly");
	}
	$('#addBandPopUp').height('auto');
	showAddBandLevelFormatters();
}

function save(){
	start_blocking('Please Wait',$('#btnSave')[0] );
	addBand('addBandForm','N');
	closePopup('addBandPopUp');
	$(this).dialog('close');
}

function saveAndAddNew(){
	start_blocking('Please Wait',$('#btnSaveAndAddNew')[0] );
	addBand('addBandForm','Y');
	$(this).dialog("close");
}

function addBand(frmId,addNew)
{
	$('#addBandForm').each (function(){
		$(":disabled").removeAttr("disabled");				
	});
	document.getElementById("saveAdd").value =addNew; 
	if(document.getElementById("recordLevel").value == null
		|| document.getElementById("recordLevel").value == "")
	{
		document.getElementById("recordLevel").value = 0 ;
	}
	var frm = document.getElementById(frmId);
	frm.action = "saveUBand.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function updateBand(frmId,addNew)
{
	$('#addBandForm').each (function(){
		$(":disabled").removeAttr("disabled");				
	});
	document.getElementById("updateAdd").value =addNew;
	var frm = document.getElementById(frmId);
	frm.action = "editUBand.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function deleteBand(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = "deleteUBand.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getBandViewPopup(record) 
{
	$('#bandViewPopup').dialog( {
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 735,
		modal : true,
		resizable: false,
		draggable: false
		
		/*buttons : {
			"Close" : function() 
			{
				$(this).dialog("close");
			}
		}*/
	});
	/*
	$('#bandViewPopup').dialog("open");
	$("#vbandtype").val(record.get('bandType'));
	if ('undefined' != record.get('parentBand'))
	{
		$("#vparentband").val(record.get('parentBand'));
	}
	$("#vbandname").val( record.get('bandName'));
	$("#vbandidentifier").val(record.get('bandId'));
	var dataStoreType = getFormatType();//$('#fileFormat').val();
	
	  if(dataStoreType == FormatType.SWIFT || dataStoreType ==  FormatType.FEDWIRE || dataStoreType == FormatType.BIGBATCH  )
		    $("#vpath").val(record.get('relativeXpath'));
	  else
		  {
		  	$("#vpath").val(record.get('xpath'));
		  }
	$("#vbandIdLength").val(record.get('bandIdLength'));
	$("#vbandIdSequence").val(record.get('bandSequence'));
	$("#vbandIdPosition").val(record.get('bandIdPosition'));
	if('Y' == record.get('mandatory'))
		document.getElementById("vmandatory").value = 'Yes';
	else
		document.getElementById("vmandatory").value = 'No';
	var formatType = getFormatType(); // $("#fileFormat").val();
	if( formatType == FormatType.DELIMITTER || formatType == FormatType.FIXEDWIDTH)
	{
		formatType = record.get('bandFormatType');
		$("#vbandFormatter").val(formatType);		
		if( formatType == FormatType.DELIMITTER )
		{
			$("#vdivBandDelimitter").attr("class","block");
			var fileDelimitter = record.get('bandFileDelimitter');
			if(fileDelimitter == 'O')
			{
				$("#vbandFileDelimitter").val('Other');
				$("#vtxtBandFileDelimiter").removeClass("hidden");
				$("#vtxtBandFileDelimiter").val(record.get('txtBandFileDelimiter'));
			}
			else if( fileDelimitter == 'P')
			{
				$("#vbandFileDelimitter").val('Pipe (|)');
				$("#vtxtBandFileDelimiter").attr("class","hidden");
			}
			else if( fileDelimitter == 'C')
			{
				$("#vbandFileDelimitter").val('Comma (,)');
				$("#vtxtBandFileDelimiter").attr("class","hidden");				
			}
			else
			{
				$("#vbandFileDelimitter").val('Other');
				$("#vtxtBandFileDelimiter").removeClass("hidden");
				$("#vtxtBandFileDelimiter").val(record.get('txtBandFileDelimiter'));
			}
						
			var qualifier = record.get('bandQualifier');
			if( qualifier == 'O')
			{
				$("#vbandQualifier").val('Other');
				$("#vtxtBandQualifier").removeClass("hidden");
				$("#vtxtBandQualifier").val(record.get('txtBandQualifier'));
			}
			else if( qualifier == 'Q')
			{
				$("#vbandQualifier").val('Double Quote ()');
				$("#vtxtBandQualifier").attr("class","hidden");
			}
			else if( qualifier == 'C')
			{
				$("#vbandQualifier").val('Comma (,)');
				$("#vtxtBandQualifier").attr("class","hidden");
			}
			else if( qualifier == 'S')
			{
				$("#vbandQualifier").val('Single Quote ()');
				$("#vtxtBandQualifier").attr("class","hidden");
			}
			else
			{
				$("#vbandQualifier").val('Other');
				$("#vtxtBandQualifier").removeClass("hidden");
				$("#vtxtBandQualifier").val(record.get('txtBandQualifier'));				
			}
		}//if
		else
		{
			$("#vdivBandDelimitter").attr("class","hidden");
		}//else
	}//if 
	*/
	
	$('#bandViewPopup').dialog("open");
	$('#vbandnameDiv').focus();
	
	$("#vbandtype").text(record.get('bandType'));
	$("#vbandtype").prop('title',record.get('bandType'));
	
	if ('undefined' != record.get('parentBand'))
	{
		$("#vparentband").text(record.get('parentBand'));
		$("#vparentband").prop('title',record.get('parentBand'));
	}
	$("#vbandname").text(record.get('bandName'));
	$("#vbandname").prop('title',record.get('bandName'));

	$("#vbandidentifier").text(record.get('bandId'));
	$("#vbandidentifier").prop('title',record.get('bandId'));
	
	var dataStoreType = getFormatType();//$('#fileFormat').val();
	
	  if(dataStoreType == FormatType.SWIFT || dataStoreType ==  FormatType.FEDWIRE || dataStoreType == FormatType.BIGBATCH  ){
		    $("#vpath").text(record.get('relativeXpath'));
			$("#vpath").prop('title',record.get('relativeXpath'));
	  }
	  else{
		  	$("#vpath").text(record.get('xpath'));
			$("#vpath").prop('title',record.get('xpath'));
	  }
	$("#vbandIdLength").text(record.get('bandIdLength'));
	$("#vbandIdSequence").text(record.get('bandSequence'));
	$("#vbandIdPosition").text(record.get('bandIdPosition'));
	
	$("#vbandIdLength").prop('title',record.get('bandIdLength'));
	$("#vbandIdSequence").prop('title',record.get('bandSequence'));
	$("#vbandIdPosition").prop('title',record.get('bandIdPosition'));
	
	if('Y' == record.get('mandatory')){
		$("#vmandatory").text(getLabel('Yes','Yes'));
	}
	else{
		$("#vmandatory").text(getLabel('No','No'));
	}
	
	var formatType = getFormatType(); // $("#fileFormat").val();
	if( formatType == FormatType.DELIMITTER || formatType == FormatType.FIXEDWIDTH)
	{
		formatType = record.get('bandFormatType');
		$("#vbandFormatter").text(formatType);
		$("#vbandFormatter").prop('title',formatType);

		if( formatType == FormatType.DELIMITTER )
		{
			$("#vdivBandDelimitter").attr("class","block");
			var fileDelimitter = record.get('bandFileDelimitter');
			if(fileDelimitter == 'O')
			{
				$("#vbandFileDelimitter").text(getLabel('Other','Other'));
				$("#vtxtBandFileDelimiter").removeClass("hidden");
				$("#vtxtBandFileDelimiter").text(record.get('txtBandFileDelimiter'));
				$("#vtxtBandFileDelimiter").prop('title',record.get('txtBandFileDelimiter'));
			}
			else if( fileDelimitter == 'P')
			{
				$("#vbandFileDelimitter").text(getLabel('Pipe','Pipe (|)'));
				$("#vtxtBandFileDelimiter").attr("class","hidden");
			}
			else if( fileDelimitter == 'C')
			{
				$("#vbandFileDelimitter").text(getLabel('Comma','Comma (,)'));
				$("#vtxtBandFileDelimiter").attr("class","hidden");				
			}
			else if( fileDelimitter == 'T')
			{
				$("#vbandFileDelimitter").text(getLabel('Tab','Tab (\\t)'));
				$("#vtxtBandFileDelimiter").attr("class","hidden");				
			}
			else
			{
				$("#vbandFileDelimitter").text(getLabel('Other','Other'));
				$("#vtxtBandFileDelimiter").removeClass("hidden");
				$("#vtxtBandFileDelimiter").text(record.get('txtBandFileDelimiter'));
				$("#vtxtBandFileDelimiter").prop('title',record.get('txtBandFileDelimiter'));
			}
						
			var qualifier = record.get('bandQualifier');
			if( qualifier == 'O')
			{
				$("#vbandQualifier").text(getLabel('Other','Other'));
				$("#vtxtBandQualifier").removeClass("hidden");
				$("#vtxtBandQualifier").text(record.get('txtBandQualifier'));
				$("#vtxtBandQualifier").prop('title',record.get('txtBandQualifier'));
			}
			else if( qualifier == 'Q')
			{
				$("#vbandQualifier").text(getLabel('DoubleQuote','Double Quote ()'));
				$("#vtxtBandQualifier").attr("class","hidden");
			}
			else if( qualifier == 'C')
			{
				$("#vbandQualifier").text(getLabel('Comma','Comma (,)'));
				$("#vtxtBandQualifier").attr("class","hidden");
			}
			else if( qualifier == 'S')
			{
				$("#vbandQualifier").text(getLabel('singleQuote','Single Quote ()'));
				$("#vtxtBandQualifier").attr("class","hidden");
			}
			else
			{
				$("#vbandQualifier").text(getLabel('Other','Other'));
				$("#vtxtBandQualifier").removeClass("hidden");
				$("#vtxtBandQualifier").text(record.get('txtBandQualifier'));
				$("#vtxtBandQualifier").prop('title',record.get('txtBandQualifier'));
			}
		}//if
		else
		{
			$("#vdivBandDelimitter").attr("class","hidden");
		}//else
	}//if 
	
}
