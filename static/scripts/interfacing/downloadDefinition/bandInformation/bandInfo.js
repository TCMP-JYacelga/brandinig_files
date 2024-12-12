function showAddBandPopUp()
{
	$("#messageArea").empty();
	$('#messageArea').removeAttr('class');
	$("#addBandForm div[id=messageArea]").empty();
	$('#addBandForm div[id=messageArea]').removeAttr('class');
	$("#newSave").attr("class","block");
	$("#updateSave").attr("class","hidden");
	$('#addBandPopUp').dialog( {
		autoOpen : false,
//		height : 'auto',
		minHeight : 156,
		maxHeight : 550,
		width : 735,
		modal : true,
		resizable : false,
		draggable : false
		/*buttons : [{
			text:getLabel('btnSave','Save'),
			click : function() {
				start_blocking('Please Wait',this );
				addBand('addBandForm','N');
				closePopup('addBandPopUp');
				$(this).dialog('close');				
			}
		 },{
			 text:getLabel('btnSaveAndAddNew','Save and Add New'),	
			 click : function() {
				start_blocking('Please Wait',this );
				addBand('addBandForm','Y');
				$(this).dialog("close");
			}
		}]*/
	});
	$('#btnUpdate').hide();
	$('#btnUpdateAndAddNew').hide();
	$('#btnSave').show();
	$('#btnSaveAndAddNew').show();
	$('#addBandPopUp').dialog('open');
	$('#addBandForm').each (function(){
		$("#bandName").val('');
	    $("#bandId").val('');
	    $("#absoluteXpath1").val('');
	   // $("#bandIdLength").val('');
	    //$("#bandIdPosition").val('');
	    //$("#bandSequence").val('');

	    $("#recordLevel").val('');
	    $("#parentBand").val('');
	    
		if( 1 == INTERFACING_ENTITY_TYPE || 'false' == isBankInterfaceMapBand)
		{
			$('#bandSequence').attr("disabled","disabled");
			$('#parentBand').attr("disabled","disabled")
		}//Client mode disable few fields
	});
	$("#bandName").removeAttr("disabled"); 
	if(null != $('#fileFormat') && 'Database' != $('#fileFormat').val())
	{
		$("#absoluteXpath1").attr("readonly","readonly");
	}
	
	var height = $('#addBandPopUp').height();
	//if(height<140)
	//$('#addBandPopUp').height(height + 48);
	if($('#messageArea').html()==null || $('#messageArea').html()=="")
		$('#addBandPopUp').height(height + 12);
	if(($('#messageArea').html()==null || $('#messageArea').html()=="") && height<210)
		$('#addBandPopUp').height(height + 36);
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

function showAddBandPopUpAfterError()
{
	$("#updateSave").attr("class","hidden");
	$("#newSave").attr("class","block");
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
			click : function() {
				start_blocking('Please Wait',this );
				addBand('addBandForm','N');
				closePopup('addBandPopUp');
				$(this).dialog('close');				
			}
		 },{
			 text:getLabel('btnSaveAndAddNew','Save and Add New'),	
			 click : function() {
				start_blocking('Please Wait',this );
				addBand('addBandForm','Y');
				$(this).dialog("close");
			}
		}]*/
	});
	$('#btnUpdate').hide();
	$('#btnUpdateAndAddNew').hide();
	$('#btnSave').show();
	$('#btnSaveAndAddNew').show();
	$('#addBandPopUp').dialog('open');
	$('#addBandForm').each (function(){
		if( 1 == INTERFACING_ENTITY_TYPE || 'false' == isBankInterfaceMapBand)
		{
			$('#bandSequence').attr("disabled","disabled");
			$('#parentBand').attr("disabled","disabled")
		}//Client mode disable few fields
	});
	$("#bandName").removeAttr("disabled");
	var formatType = getFormatType();
	if(formatType != 'Database'){
		$("#absoluteXpath1").attr("readonly","readonly");
	}
	
	if($('#messageArea').html().length!=0){
		var height=$('#addBandPopUp').height();
		$('#addBandPopUp').height(height+38);
		}
	showAddBandLevelFormatters();
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
	if(document.getElementById("bandSequence").value == null
			|| document.getElementById("bandSequence").value == "")
	{
		document.getElementById("bandSequence").value = 0 ;
	}
	
	var frm = document.getElementById(frmId);
	frm.action = "saveDownloadBand.srvc";
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
	if(document.getElementById("bandSequence").value == null
			|| document.getElementById("bandSequence").value == "")
	{
		document.getElementById("bandSequence").value = 0 ;
	}
	frm.action = "editDownloadBand.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function deleteBand(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	if(document.getElementById("bandSequence").value == null
			|| document.getElementById("bandSequence").value == "")
	{
		document.getElementById("bandSequence").value = 0 ;
	}
	frm.action = "deleteDownloadBand.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getBandViewPopup(record) 
{
	$("#messageArea").empty();
	$('#messageArea').removeAttr('class');
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
	
	$('#bandViewPopup').dialog("open");
	$('#vbandnameDiv').focus();
	/*if ('undefined' != record.get('parentBand'))
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
	if ('undefined' != record.get('parentBand'))
	{
		$("#vparentband").text(record.get('parentBand'));
		$("#vparentband").prop('title',record.get('parentBand'));
	}
	$("#vbandname").text( record.get('bandName'));
	$("#vbandidentifier").text(record.get('bandId'));
	$("#vbandname").prop('title', record.get('bandName'));
	$("#vbandidentifier").prop('title',record.get('bandId'));
	
	var dataStoreType = getFormatType();//$('#fileFormat').val();
	
	  if(dataStoreType == FormatType.SWIFT || dataStoreType ==  FormatType.FEDWIRE || dataStoreType == FormatType.BIGBATCH  ){
		   // $("#vpath").val(record.get('relativeXpath'));
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
