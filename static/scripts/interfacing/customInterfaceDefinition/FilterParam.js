function addFilterParamPopUp()
{
	//$("#newSave").attr("class","block");
	//$("#updateSave").attr("class","hidden");
	$('#addFilterParamPopUp').dialog( {
		title:'Add Filter Parameter Details',		
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 735,
		modal : true,
		resizable: false,
		draggable: false
		/*buttons : [{
			text:getLabel('btnSave','Save'),
			click : function() {
				//addFilterParam();
				addFilterParam('N');
				closePopup('addFilterParamPopUp');
				$(this).dialog('close');				
				}
		   },{
			 text:getLabel('btnSaveAndAddNew','Save and Add New'),  
			 click : function() {
				addFilterParam('Y');
				$(this).dialog("close");
			 }
		   }*/
			/*"Cancel" : function() {
				$('#addFilterParamForm').each (function(){
					this.reset();	
					$('#parameterName').val("");
					$('#parameterDesc').val("");
					$('#dataType').val("");
					$('#columnFormat').val("");
					$('#columnFormat').attr('disabled','disabled');
					$('#columnFormat').attr('class','textBox w14 rounded disabled');
					$('#defaultValue').val("");
					$('.number').val("");
					$('.single').val("");
					$("input[id='derivation'][value='N']").attr('checked', 'checked');
					$('#addFilterParamForm > #derivationValue').attr('disabled','disabled');
					$('#addFilterParamForm > #derivationValue').val("");
					$('#addFilterParamForm > #derivationValue').attr('class','rounded topAlign ');
					$('#fieldSelect').attr('class','rounded w14 hidden');
					$('#lblFieldSelect').attr('class','frmLabel hidden');
					$('#derivationValue').val("");
				});
				$(this).dialog("close");
			}*/
		//]
	});
	$('#btnUpdate').hide();
	$('#btnUpdateAndAddNew').hide();
	$('#btnSave').show();
	$('#btnSaveAndAddNew').show();
	var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0)   
    {
    	$('#derivationValue').attr('cols', 25);
    }   
    else{                 
	if(screen.width==1024)
		$('#derivationValue').attr('cols', 25);	
	else
		$('#derivationValue').attr('cols', 25);
    }
	$('#paramType').removeAttr('disabled');
	$('#addFilterParamPopUp').dialog('open');
	$('#addFilterParamPopUp').dialog('option','position','center');
	$('#addFilterParamForm').each (function(){
		this.reset();
		$('#paramType').val("I");
		$('#parameterName').val("");
		$('#parameterDesc').val("");
		$('#dataType').val("");
		$('#columnFormat').val("");
		$('#columnFormat').attr('disabled','disabled');
		$('#columnFormat').attr('class','form-control disabled');
		$('#defaultValue').val("");
		$('.number').val("");
		$('.single').val("");
		$("input[id='parameterType']").attr('checked', 'checked');
		$("input[id='derivation'][value='N']").attr('checked', 'checked');
		$('#addFilterParamForm > #derivationValue').attr('disabled','disabled');
		$('#addFilterParamForm > #derivationValue').val("");
		$('#addFilterParamForm > #derivationValue').attr('class','rounded topAlign ');
		$('#fieldSelect').attr('class','form-control hidden');
		$('#lblFieldSelect').attr('class','frmLabel hidden');
		$('#derivationValue').val("");
		setFilterList('I', 'parameterName');
		console.log("hh");
		handleListValueTypeVisibility();
	});		
	$('#parameterType').niceSelect();
	$('#parameterType').niceSelect('update');
	$('#parameterName').niceSelect();
	$('#parameterName').niceSelect('update');
	$('#newDefaultValue').editablecombobox();
	$('#newDefaultValue').editablecombobox('refresh');
	initateValidation();
	autoFocusOnFirstElement(null, 'addFilterParamPopUp', true)
}

function initateValidation() {
	$('#parameterName-niceSelect').bind('blur', function () {
		markRequired($(this));
	});
	$('#parameterType-niceSelect').bind('focus', function () {
		removeMarkRequired($(this));
	});
	$('#parameterName-niceSelect').bind('blur', function () {
		markRequired($(this));
	});
	$('#parameterName-niceSelect').bind('focus', function () {
		removeMarkRequired($(this));
	});
	$('#newDefaultValue_jq').bind('blur', function () {
		markRequired($(this));
	});
	$('#newDefaultValue_jq').bind('focus', function () {
		removeMarkRequired($(this));
	});
}
function save(){
	addFilterParam('N');
	closePopup('addFilterParamPopUp');
	$(this).dialog('close');
}

function saveAndAddNew(){
	addFilterParam('Y');
	$(this).dialog("close");
}

function resetFilterParamPopUp()
{
	$('#addFilterParamForm').each (function(){
		this.reset();
		$('#paramType').val("I");
		$('#parameterName').val("");
		$('#parameterDesc').val("");
		$('#dataType').val("");
		$('#columnFormat').val("");
		$('#columnFormat').attr('disabled','disabled');
		$('#columnFormat').attr('class','form-control disabled');
		$('#defaultValue').val("");
		$('.number').val("");
		$('.single').val("");
		$("input[id='parameterType']").attr('checked', 'checked');
		$("input[id='derivation'][value='N']").attr('checked', 'checked');
		$('#addFilterParamForm > #derivationValue').attr('disabled','disabled');
		$('#addFilterParamForm > #derivationValue').val("");
		$('#addFilterParamForm > #derivationValue').attr('class','rounded');
		$('#fieldSelect').attr('class','form-control hidden');
		$('#lblFieldSelect').attr('class','hidden');
		$('#derivationValue').val("");
		setFilterList('I', 'parameterName');
		handleListValueTypeVisibility();
	});		
}

function editFilterParamPopUp(record)
{
	currentRecord = record;
	//$("#newSave").attr("class","hidden");
	//$("#updateSave").attr("class","block");
	$('#addFilterParamPopUp').dialog( {
		title:'Modify Filter Parameter Details',
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 735,
		resizable: false,
		draggable: false,
		modal : true
		/*buttons : [{
			text:getLabel('btnUpdate','Update'),
			click : function() {
				//updateFilterParam(rowIndex);
				updateFilterParam('N');
				closePopup('addFilterParamPopUp');
				$(this).dialog('close');				
			}
		},{
			text:getLabel('btnUpdateAndAddNew','Update and Add New'),
			click : function() {
				updateFilterParam('Y');
				//$('#addFilterParamForm').each (function(){
				//	this.reset();						
				//});
				$(this).dialog("close");
			}*/
			/*"Cancel" : function() {
				$('#addFilterParamForm').each (function(){
					this.reset();						
				});
				$(this).dialog("close");
			}*/
		//}]
	});
	$('#btnUpdate').show();
	$('#btnUpdateAndAddNew').show();
	$('#btnSave').hide();
	$('#btnSaveAndAddNew').hide();
	var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0)   
    {
    	$('#derivationValue').attr('cols', 25);
    }   
    else{                 
	if(screen.width==1024)
		$('#derivationValue').attr('cols', 25);	
	else
		$('#derivationValue').attr('cols', 25);
    }
	$('#addFilterParamPopUp').dialog('open'); 
	$('#addFilterParamPopUp').dialog('option','position','center');
	$('#addFilterParamForm > .disabled').removeAttr("disabled");
	/*var objstr = document.getElementById("TEXTPARAM"+rowIndex).value;
	var obj = eval("(" + objstr + ")");*/
	$('#defaultValue').val(record.get('defaultValue'));
	
	//$('#addFilterParamForm > #txtParamIndex').val(rowIndex);
	/*IRISADM-194 : Accepting PARAMETER_TYPE on Filter Parameter screen. */

	var parameterType = record.get('parameterType');
	if( 'Internal' == parameterType )
	{
		$('#paramType').val('I');	
		setFilterList('I', 'parameterName');	
	}
	else if( 'External' == parameterType )
	{
		$('#paramType').val('E');	
		setFilterList('E', 'parameterName');	
	}
	if( 'Hidden' == parameterType )
	{
		$('#paramType').val('H');	
		setFilterList('H', 'parameterName');	
	}
	$('#parameterName').val(record.get('parameterName'));
	$('#parameterDesc').val(record.get('parameterDesc'));
	$('#mandateType').val(record.get('mandateType'));
	
	$('#dataType').val(record.get('dataType'));
	$('#length').val(record.get('length'));
	setColumnFormat();
	if (record.get('dataType') == 'DECIMAL')
	{	
		$('.number').val(record.get('defaultValue'));
		/*IRISADM-190 : Column Format disappear if user click on edit button for Number Data-type*/
		$('#columnFormat').val(record.get('columnFormat'));	
	}
	else
	{		
		$('.simple').val(record.get('defaultValue'));
	}
	if( record.get('dataType') == 'DATE')
	{
		$('#columnFormat').val(record.get('columnFormat'));	
	}	
	if ( record.get('derivation') == 'Q')
	{
		$("input[id='derivation'][value='Q']").attr('checked', 'checked');
		$('#derivationValue').removeAttr('disabled','disabled');
		$('#derivationValue').val("");
		$('#derivationValue').attr('class','rounded');
		$('#fieldSelect').attr('class','form-control');
		//$('#lblFieldSelect').attr('class','frmLabel');
	}
	else if (record.get('derivation') == 'S')
	{
		$("input[id='derivation'][value='S']").attr('checked', 'checked');
		$('#addFilterParamForm > #derivationValue').removeAttr('disabled','disabled');
		$('#addFilterParamForm > #derivationValue').attr('class','rounded');
		$('#fieldSelect').attr('class','form-control hidden');
		$('#lblFieldSelect').attr('class','hidden');
	}
	else if (record.get('derivation') == 'N')
	{
		$("input[id='derivation'][value='N']").attr('checked', 'checked');
		$('#addFilterParamForm > #derivationValue').attr('disabled','disabled');
		$('#addFilterParamForm > #derivationValue').val("");
		$('#addFilterParamForm > #derivationValue').attr('class','rounded');
		$('#fieldSelect').attr('class','form-control hidden');
		$('#lblFieldSelect').attr('class','hidden');
	}
	$('#derivationValue').val(record.get('derivationValue'));
	$('#viewParamState').val(record.get('viewParamState'));
	document.getElementById("viewParamState").value = record.get('viewParamState');
	setParamDtl(record.get('parameterName'));
	
	if( 'true' == isBankInterfaceMapFormat )
	{
		$('#paramType').removeAttr('disabled');
		$('#parameterName').removeAttr('disabled');
		$('#derivationValue').removeAttr('disabled');
		$('#fieldSelect').removeAttr('disabled');
	}//if
	else if( 'false' == isBankInterfaceMapFormat )
	{
		$('#paramType').attr('disabled','disabled');
		$('#parameterName').attr('disabled','disabled');
		$('#derivationValue').attr('disabled','disabled');
		$('#fieldSelect').attr('disabled','disabled');
	}//else
	$('#fieldListValueType').val(record.get('listValueType'));
	handleListValueTypeVisibility();
}

function update(){
	updateFilterParam('N');
	closePopup('addFilterParamPopUp');
	$(this).dialog('close');
}

function updateAndAddNew(){
	updateFilterParam('Y');
	$(this).dialog('close');
}

function updateFilterParam(addNew)
{
	if ($("#dataType").val() == 'DECIMAL')
	{
		$('.simple').remove();
	}
	else
	{
		$('.number').remove();	
	}
	$('#addFilterParamForm > .disabled').removeAttr("disabled");
	document.getElementById("updateAdd").value =addNew;
	var frm = document.getElementById("addFilterParamForm");
	var type = document.getElementById("txtProcessType").value;
	$('#dataType').removeAttr('disabled');
	$('#paramType').removeAttr('disabled');
	$('#parameterName').removeAttr('disabled');
	$('#derivationValue').removeAttr('disabled');
	$('#fieldSelect').removeAttr('disabled');
	
	frm.action = "updateCustomInterfaceFilterParam.srvc";
	var jecValue = $("#newDefaultValue_jq").val();
	if(( null == jecValue ||( null != jecValue && '' == jecValue)) && ($('#paramType').val() != 'I'))
	{
		jecValue = $("#newDefaultValue").val();
	}
	$("#defaultValue").val(jecValue);		
	/*var objstr = document.getElementById("TEXTPARAM"+rowIndex).value;
	var obj = eval("(" + objstr + ")");
	document.getElementById("txtSeqNmbr").value = obj.seqNmbr;*/
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function addFilterParam(addNew)
{
	if ($("#dataType").val() == 'DECIMAL')
	{
		$('.simple').remove();
	}
	else
	{
		$('.number').remove();	
	}
	var frm = document.getElementById("addFilterParamForm");
	document.getElementById("saveAdd").value =addNew; 
	var type = document.getElementById("txtProcessType").value;
	frm.action = "saveCustomInterfaceFilterParam.srvc";
	var jecValue = $("#newDefaultValue_jq").val();
	if( null == jecValue ||( null != jecValue && '' == jecValue))
	{
		jecValue = $("#newDefaultValue").val();
	}
	$("#defaultValue").val(jecValue);	
	$('#addFilterParamForm > .disabled').removeAttr("disabled");
	$("#dataType").removeAttr('disabled','disabled');
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function deleteFilterParam(frmId)
{
	//document.getElementById("txtParamIndex").value = rowIndex;
	$('#addFilterParamForm > .disabled').removeAttr("disabled");
	var type = document.getElementById("txtProcessType").value;
	var frm = document.getElementById(frmId);
	frm.action = "deleteCustomInterfaceFilterParam.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function viewFilterParameter(record)
{
	$('#viewFilterParamPopUp').dialog( {
		title:'View Filter Parameter Details',		
		autoOpen : false,
		dialogCls : 'ux-dialog',
		maxHeight: 550,
		minHeight:156,
		width : 735,
		modal : true,
		resizable: false,
		draggable: false,
		overflow : 'auto'
		/*buttons : {
			"OK" : function() 
			{
				$(this).dialog("close");
				$('#dwnldParamView').each (function(){
					this.reset();						
				});
			}
		}*/
	});
	
	/*$('#viewFilterParamPopUp').dialog("open");
	//var objstr = document.getElementById("TEXTPARAM"+rowIndex).value;
	//var obj = eval("(" + objstr + ")");
	$('#vparameterName').val(record.get('parameterName'));
	$('#vparameterDesc').val(record.get('parameterDesc'));
	//IRISADM-149  Varchar to String
	if (record.get('dataType') == 'STRING')
	{
		$('#vdataType').val(lblVChar);
	}
	else if (record.get('dataType') == 'DECIMAL')
	{
		$('#vdataType').val(lblNum);
	}
	else if (record.get('dataType') == 'DECIMAL')
	{
		$('#vdataType').val(lblDec);
	}
	else if (record.get('dataType') == 'DATE')
	{
		$('#vdataType').val(lblDate);
	}
	else if (record.get('dataType') == 'DATETIME')
	{
		$('#vdataType').val(lblDateTime);
	}
	$('#vcolumnFormat').val(record.get('columnFormat'));
	$('#vdefaultValue').val(record.get('defaultValue'));
	$('#vlength').val(record.get('length'));
	$('#qderivation').removeAttr('checked');
	$('#sderivation').removeAttr('checked');
	$('#nderivation').removeAttr('checked');
	if (record.derivation == 'Q')
	{
		$('#qderivation').attr('checked', 'checked');
	}
	else if (record.get('derivation') == 'S')
	{
		$('#sderivation').attr('checked', 'checked');
	}
	else if (record.get('derivation') == 'N')
	{		
		$('#nderivation').attr('checked', 'checked');
	}
	$('#vderivationValue').val(record.get('derivationValue'));
	$('#vderivationValue').attr('disabled','disabled');
	$('#vderivationValue').attr('class','rounded topAlign w10_3');
	$('#vparameterName').attr('disabled','disabled');
	$('#vparameterDesc').attr('disabled','disabled');
	$('#vdataType').attr('disabled','disabled');
	$('#vlength').attr('disabled','disabled');
	$('#vcolumnFormat').attr('disabled','disabled');
	$('#vdefaultValue').attr('disabled','disabled');
	//IRISADM-194 : Accepting PARAMETER_TYPE on Filter Parameter screen. 
	if( null != record.get('parameterType') )
	{
		if( 'I' == record.get('parameterType') )
		{
			$('#vparameterType').val('Internal');		
		}
		else if( 'E' == record.get('parameterType') )
		{
			$('#vparameterType').val('External');
		}
		else if( 'H' == record.get('parameterType') )
		{
			$('#vparameterType').val('Hidden');
		}
		else 
		{
			$('#vparameterType').val(record.get('parameterType'));
		}
	}
	
	$('#vmandate').val(record.get('mandateType'));
	$('#vfieldListValueType').val(record.get('listValueType'));
	
	if(record.get('parameterType') == 'External' && record.get('dataType') != 'DATE' && record.derivation != 'N')
	{
		$('#vlblfieldListValueType').show();
		$('#vfieldListValueType').show();
	}
	else
	{
		$('#vlblfieldListValueType').hide();
		$('#vfieldListValueType').hide();
	}*/
	
	
	$('#viewFilterParamPopUp').dialog("open");
	$('#viewFilterParamPopUp').dialog('option','position','center');
	$('#vparameterTypeDiv').focus();
	;
	$('#vparameterName').text(record.get('parameterName'));
	$('#vparameterName').prop('title',record.get('parameterName'));
	
	$('#vparameterDesc').text(record.get('parameterDesc'));
	$('#vparameterDesc').prop('title',record.get('parameterDesc'));

	
	//IRISADM-149  Varchar to String
	if (record.get('dataType') == 'STRING')
	{
		$('#vdataType').text(lblVChar);
		$('#vdataType').prop('title',lblVChar);
	}
	else if (record.get('dataType') == 'DECIMAL')
	{
		$('#vdataType').text(lblNum);
		$('#vdataType').prop('title',lblNum);
		
	}
	else if (record.get('dataType') == 'DECIMAL')
	{
		$('#vdataType').text(lblDec);
		$('#vdataType').prop('title',lblDec);
	}
	else if (record.get('dataType') == 'DATE')
	{
		$('#vdataType').text(lblDate);
		$('#vdataType').prop('title',lblDate);
	}
	else if (record.get('dataType') == 'DATETIME')
	{
		$('#vdataType').text(lblDateTime);
		$('#vdataType').prop('title',lblDateTime);
	}
	$('#vcolumnFormat').text(record.get('columnFormat'));
	$('#vdefaultValue').text(record.get('defaultValue'));
	$('#vlength').text(record.get('length'));
	$('#vcolumnFormat').prop('title',record.get('columnFormat'));
	$('#vdefaultValue').prop('title',record.get('defaultValue'));
	$('#vlength').prop('title',record.get('length'));
	

	if (record.derivation == 'Q')
	{
		$('#vderivationTypeValue').text(getLabel('Query','Query'));
	}
	else if (record.get('derivation') == 'S')
	{
		$('#vderivationTypeValue').text(getLabel('Static','Static'));
	}
	else if (record.get('derivation') == 'N')
	{		
		$('#vderivationTypeValue').text(getLabel('None','None'));
	}
	
	$('#vderivationValue').text(record.get('derivationValue'));
	
	//IRISADM-194 : Accepting PARAMETER_TYPE on Filter Parameter screen. 
	if( null != record.get('parameterType') )
	{
		if( 'I' == record.get('parameterType')||'Internal' == record.get('parameterType') )
		{
			$('#vparameterType').text(getLabel('Internal','Internal'));
			$('#vparameterType').prop('title',getLabel('Internal','Internal'));
		}
		else if( 'E' == record.get('parameterType')||'External' == record.get('parameterType'))
		{
			$('#vparameterType').text(getLabel('External','External'));
			$('#vparameterType').prop('title',getLabel('External','External'));
		}
		else if( 'H' == record.get('parameterType')||'Hidden' == record.get('parameterType') )
		{
			$('#vparameterType').text(getLabel("Hidden",'Hidden'));
			$('#vparameterType').prop('title',getLabel("Hidden",'Hidden'));
		}
		else 
		{
			$('#vparameterType').text(record.get('parameterType'));
			$('#vparameterType').prop('title',record.get('parameterType'));
		}
	}
	
	if('Y'==record.get('mandateType')){
		$('#vmandate').text(getLabel('Yes','Yes'));
		$('#vmandate').prop('title',getLabel('Yes','Yes'));
	}else if('N' == record.get('mandateType')){
		$('#vmandate').text(getLabel('No','No'));
		$('#vmandate').prop('title',getLabel('No','No'));
	}else{
		$('#vmandate').text(record.get('mandateType'));
		$('#vmandate').prop('title',record.get('mandateType'));
	}
	
	$('#vfieldListValueType').text(record.get('listValueType'));
	$('#vfieldListValueType').prop('title',record.get('listValueType'));

	if(record.get('parameterType') == 'External' && record.get('dataType') != 'DATE' && record.derivation != 'N')
	{
		$('#vlblfieldListValueType').show();
		$('#vfieldListValueType').show();
	}
	else
	{
		$('#vlblfieldListValueType').hide();
		$('#vfieldListValueType').hide();
	}
}
function reloadUProcess()
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById("frmMain");
	frm.action = "reloadUploadProcess.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function reloadProcess()
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById("frmMain");
	frm.action = "reloadDownloadProcess.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function filterPopupClose()
{
	$('#addFilterParamPopUp').dialog("close");
}