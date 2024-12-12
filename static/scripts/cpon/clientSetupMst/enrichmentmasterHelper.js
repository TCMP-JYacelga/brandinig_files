function getLabel(key, defaultText) {
	return (cponLabelsMap && !Ext.isEmpty(cponLabelsMap[key])) ? cponLabelsMap[key]
			: defaultText
}
function enableDisableforAuthorized(validFlag){
	if(validFlag=='Y' && null!=parentRecKeyNo){
		$('#custom').attr('disabled','true');
		$('#Std').attr('disabled','true');
	}
}
function enableDisableSetName(enrichType)
{
	if('M' === enrichType)
	{
		$('#enrichSetname').val(' ');
		$('#enrichSetname').attr("disabled","true");
	}
	else
	{
		$('#enrichSetname').removeAttr("disabled");
	}
}

function enableDisableEnriMinMaxLength(formateDataType){
	
	if('S' == formateDataType || 'N' == formateDataType)
	{ 
		$('#enrichMinLength').attr("disabled",false);
		$('#enrichMaxLength').attr("disabled",false);
		
		if($('#enrFieldType').val() == 'T' ){
			$('#enrichMinLengthId').addClass('required-lbl-right');
			$('#enrichMaxLengthId').addClass('required-lbl-right');
			}
		else{
			$('#enrichMinLengthId').removeClass('required-lbl-right');
			$('#enrichMaxLengthId').removeClass('required-lbl-right');
		}
	}
	else
	{
		$('#enrichMinLength').attr("disabled",true);
		$('#enrichMaxLength').attr("disabled",true);
		
		$('#enrichMinLengthId').removeClass('required-lbl-right');
		$('#enrichMaxLengthId').removeClass('required-lbl-right');
	}
}

function enableDisableDateFormat(selectEle){ 
	
	enableDisableEnriMinMaxLength(selectEle.value);
	if('D' == selectEle.value)
	{	
		$('#chkminValue').removeAttr("onclick");		
		$('#chkmaxValue').removeAttr("onclick");
		$('#chkminValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');		
		$('#chkmaxValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		$('#minValue').val('');
		$('#minValue').attr("disabled","true");
		$('#maxValue').val('');
		$('#maxValue').attr("disabled","true");		
		$('#useInTxnAmtComputation').attr("disabled",true);
		$('#useInTxnAmtComputationLabel').removeClass('required-lbl-right');
		$('#enrichFormat').attr("disabled",false);
		$('#enrichFormatLabel').addClass('required-lbl-right');
		var dropdownlistbox = document.getElementById("enrichFormat")
		for(var x=0;x < dropdownlistbox.length -1 ; x++)
		{
		   if(selectEle.value == dropdownlistbox.options[x].text)
		 
		      dropdownlistbox.selectedIndex = x;
		}		 
	}else if ('A' == selectEle.value){
		$('#chkminValue').attr('onclick',"toggleCheckUnchekEnable(this,'minValue')");			
		$('#chkmaxValue').attr('onclick',"toggleCheckUnchekEnable(this,'maxValue')");	
		$('#chkminValue').attr('src', 'static/images/icons/icon_unchecked.gif');		
		$('#chkmaxValue').attr('src', 'static/images/icons/icon_unchecked.gif');		
		$('#useInTxnAmtComputation').attr("disabled",false);	
		$('#useInTxnAmtComputationLabel').addClass('required-lbl-right');		
		$("#enrichFormat option:selected").prop("selected", false);
		$('#enrichFormat').attr("disabled",true);
		$('#enrichFormatLabel').removeClass('required-lbl-right');
	}
	else
	{
		$('#chkminValue').removeAttr("onclick");		
		$('#chkmaxValue').removeAttr("onclick");
		$('#chkminValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');		
		$('#chkmaxValue').attr('src', 'static/images/icons/icon_unchecked_grey.gif');
		$('#minValue').val('');
		$('#minValue').attr("disabled","true");
		$('#maxValue').val('');
		$('#maxValue').attr("disabled","true");		
		$('#useInTxnAmtComputation').attr("disabled",true);		
		$('#useInTxnAmtComputationLabel').removeClass('required-lbl-right');
		$("#enrichFormat option:selected").prop("selected", false);
		$('#enrichFormat').attr("disabled",true);
		$('#enrichFormatLabel').removeClass('required-lbl-right');
	}
}
function hideShowObjectApiDiv(elem,fieldVal)
{
	var image = elem.getElementsByTagName("IMG")[0];
	if (image.src.indexOf("icon_checked.gif") == -1) 
	{
		image.src = "static/images/icons/icon_checked.gif";
		$('#'+fieldVal).val('Y');
		$('#objectApiDetailsDiv').show();
		 disableIpRowAddLink();
		 disableOpRowAddLink();
	} else
	{
		image.src = "static/images/icons/icon_unchecked.gif";
		$('#'+fieldVal).val("N");
		$(".ipRow").remove();
		$(".opRow").remove();
		$('#objApiName').val('');
		$('#objectApiDetailsDiv').hide();
	}
}	

function hideShowLstValueDiv(rbId)
{
	
	//addLstValuesRow();
	
	if($(rbId).val()=='N')
	{
		$('#lstValuesDiv').hide();
		$('#linkChkAdhocValueFlag').removeAttr("onclick");
		 $('#parentEnrichCode').val('');
		$('#lovOrPDiv').hide();
	}
	else
   {
		
		$('#lovOrPDiv').show();
		$('#linkChkAdhocValueFlag').attr("onclick","toggleCheckbox(this,'adhocValueFlag');");
		$('#lstValuesDiv').show();
		 $(".lvRow").remove();
		 if($(rbId).val()=='Y')
		{
			 enableLovAddLink();
			 $('.lstValueColumn').hide();
			 $('#parentEnrichCode').val('');
			 $('#parentEnrichCode').attr('disabled','disabled');
			 $('#lblPrentFieldName').removeClass('required-lbl-right');
			 $('#divParentFieldName').hide();
			 
		}
		 else
		{
			 disableLovAddLink();
			 $('#parentEnrichCode').removeAttr('disabled');
			 $('#lblPrentFieldName').addClass('required-lbl-right');
			 $('.lstValueColumn').show();
			 $('#divParentFieldName').show();
		}
		
   }
}

function enableLovAddLink()
{
	$('#lstValueRowAddLink').attr("onClick","addLstValuesRow(true);");
	$('#lstValueRowAddLink').attr("class","button_underline thePoniter ux_font-size14-normal");
}
function disableLovAddLink()
{
	$('#lstValueRowAddLink').removeAttr("onClick");
	$('#lstValueRowAddLink').attr("class","linkgrey");
}

function enableIpRowAddLink()
{
	$('#ipRowAddLink').attr("onClick","addIpLstValuesRow();");
	$('#ipRowAddLink').attr("class","button_underline ux_font-size14-normal");
}
function disableIpRowAddLink()
{
	$('#ipRowAddLink').removeAttr("onClick");
	$('#ipRowAddLink').attr("class","button_underline ux_font-size14-normal");
}

function enableOpRowAddLink()
{
	$('#opRowAddLink').attr("onClick","addOpLstValuesRow();");
	$('#opRowAddLink').attr("class","button_underline ux_font-size14-normal");
}
function disableOpRowAddLink()
{
	$('#opRowAddLink').removeAttr("onClick");
	$('#opRowAddLink').attr("class","button_underline ux_font-size14-normal");
}

function addRemoveRowOfParent(parentVal)
{
	var checkedRb = $('input[name=valiationType]:radio:checked').val();
	if(checkedRb=='P')
	{
		if(parentVal != '' && parentVal != ' ')
		{
			$(".lvRow").remove();
			lstValueIndex = 1;
			lstValueCnt = lstValueCnt - 1;
			enableLovAddLink();
			addLstValuesRow();
			
		}
		else if(parentVal === '' || parentVal === ' ')
		{
			disableLovAddLink()
			$(".lvRow").remove();
			lstValueIndex = 0;
		}
	}
}
function addRemoveRowObjectApi(parentVal)
{
	
		if(parentVal != '' && parentVal != ' ')
		{
			ipRowCnt = 1;
			ipRowIndex = 0;
			opRowCnt = 1;
			opRowIndex = 0;
			$(".ipRow").remove();
			$(".opRow").remove();
			enableIpRowAddLink();
			enableOpRowAddLink();
			addIpLstValuesRow();
			addOpLstValuesRow();				
		}
		else if(parentVal === '' || parentVal === ' ')
		{
			$(".ipRow").remove();
			$(".opRow").remove();
			disableIpRowAddLink();
			disableOpRowAddLink()
			ipRowIndex = 0;
			opRowIndex = 0;
		}
	
}
function addLstValuesRow(isClicked)
{
	if( $('#enrFieldType').val() == 'R' )
	{
		if(gridLstValuesTable.rows.length < 3)
		{
			var checkedRb = $('input[name=valiationType]:radio:checked').val();
			if(checkedRb=='P')
			{
				$('#gridLstValuesTable').append('<tr id="lvRow'+lstValueCnt+'" class="lvRow"><td><select class="rounded w10" id="paramValue'+lstValueCnt+'"><option value=""><spring:message code="lbl.select" text="select"/></option></select></td><td style="background:inherit;border:0"><input type="text" class="rounded w14" id="paramCode'+lstValueCnt+'"/></td><td><input type="text" class="rounded w14" id="paramDesc'+lstValueCnt+'"/></td><td><a href="#" onclick="deleteLstValuesRow('+lstValueCnt+');" class="rmRow delete_icon_link"></a></td><input type="hidden" value="N" id="isDelete'+lstValueCnt+'"/><input type="hidden" value="'+lstValueCnt+'" id="valueNmbr'+lstValueCnt+'"/></tr>');
				populateEnrichValues('paramValue'+lstValueCnt);			
			}
			else
			{
				$('#gridLstValuesTable').append('<tr id="lvRow'+lstValueCnt+'" class="lvRow"><td style="background:inherit;border:0"><input type="text" class="rounded w14" id="paramCode'+lstValueCnt+'"/></td><td><input type="text" class="rounded w14" id="paramDesc'+lstValueCnt+'"/></td><td><a href="#" onclick="deleteLstValuesRow('+lstValueCnt+');" class="rmRow delete_icon_link"></a></td><input type="hidden" value="N" id="isDelete'+lstValueCnt+'"/><input type="hidden" value="'+lstValueCnt+'" id="valueNmbr'+lstValueCnt+'"/></tr>');			
			}		
			lstValueCnt = lstValueCnt+1;
			lstValueIndex = lstValueIndex+1;
		} else if(gridLstValuesTable.rows.length === 3 && isClicked){
			showMaximumTwoValuesForRadioButtonError();
		}
	}
	else if( $('#enrFieldType').val() == 'T' )
	{
		var checkedRb = $('input[name=valiationType]:radio:checked').val();
		if(checkedRb=='P')
		{
			$('#gridLstValuesTable').append('<tr id="lvRow'+lstValueCnt+'" class="lvRow"><td><select class="rounded w10" id="paramValue'+lstValueCnt+'"><option value=""><spring:message code="lbl.select" text="select"/></option></select></td><td style="background:inherit;border:0"><input type="text" class="rounded w14" id="paramCode'+lstValueCnt+'"/></td><td><input type="text" class="rounded w14" id="paramDesc'+lstValueCnt+'"/></td><td><a href="#" onclick="deleteLstValuesRow('+lstValueCnt+');" class="rmRow delete_icon_link"></a></td><input type="hidden" value="N" id="isDelete'+lstValueCnt+'"/><input type="hidden" value="'+lstValueCnt+'" id="valueNmbr'+lstValueCnt+'"/></tr>');
			populateEnrichValues('paramValue'+lstValueCnt);			
		}
		else
		{
			$('#gridLstValuesTable').append('<tr id="lvRow'+lstValueCnt+'" class="lvRow"><td style="background:inherit;border:0"><input type="text" class="rounded w14" id="paramCode'+lstValueCnt+'"/></td><td><input type="text" class="rounded w14" id="paramDesc'+lstValueCnt+'"/></td><td><a href="#" onclick="deleteLstValuesRow('+lstValueCnt+');" class="rmRow delete_icon_link"></a></td><input type="hidden" value="N" id="isDelete'+lstValueCnt+'"/><input type="hidden" value="'+lstValueCnt+'" id="valueNmbr'+lstValueCnt+'"/></tr>');			
		}		
		lstValueCnt = lstValueCnt+1;
		lstValueIndex = lstValueIndex+1;
	}
	
}

function deleteLstValuesRow(cnt)
{	
	if($('#lvRow'+cnt) != null)
	{
		$('#isDelete'+cnt).val("Y");
		$('#lvRow'+cnt).hide();
	}
}
function handleConstantValue(selectElement){
	var id = 'inputConstValue';
	var rowNum = (selectElement.id).substr(14);
	if(selectElement.id.indexOf("outputFieldType") > -1)
		rowNum = (selectElement.id).substr(15);
	if('D' === selectElement.value ){
		$('#' + id + rowNum).val("");
		$('#' + id + rowNum).attr("disabled",false);
	}else{
		$('#' + id + rowNum).val("");
		$('#' + id + rowNum).attr("disabled",true);
	}
	if(selectElement.id == 'inputFieldType'+rowNum)
		populateFieldNameListOnChange('inputFieldName' + rowNum , selectElement.value);
	else
		populateFieldNameListOnChange('outputFieldName' + rowNum , selectElement.value);
}
function addIpLstValuesRow()
{
	$('#gridLstInputValueTable').append('<tr id="ipRow'+ipRowCnt+'" class="ipRow"><td class="centerAlign black">'+ipRowCnt+'</td><td><select class="rounded w10  ipSelect" id="inputParamNm'+ipRowCnt+'"><option value=""><spring:message code="lbl.select" text="select"/></option></select></td><td style="background:inherit;border:0"><select class="rounded w10"  id="inputFieldType'+ipRowCnt+'" onchange="javascript:handleConstantValue(this);"><option value=""><spring:message code="lbl.select" text="select"/></option></td><td><select class="rounded w10" id="inputFieldName'+ipRowCnt+'"><option value=""><spring:message code="lbl.select" text="select"/></option></td><td><input type="text" class="rounded w10" id="inputConstValue'+ipRowCnt+'"/></td><td><a href="#" onclick="deleteIpLstValuesRow('+ipRowCnt+');" class="rmRow delete_icon_link"></a></td><input type="hidden" value="N" id="isDelete'+ipRowCnt+'"/></tr>');
	populateInPutParamNameList('inputParamNm'+ipRowCnt);
	populateInPutFieldType('inputFieldType'+ipRowCnt);
	populateFieldNameList('inputFieldName'+ipRowCnt, 'inputFieldType'+ipRowCnt);
	ipRowCnt = ipRowCnt+1;
	ipRowIndex = ipRowIndex+1;
}	

function deleteIpLstValuesRow(cnt)
{	

	if($('#ipRow'+cnt) != null)
	{
		$('#isDelete'+cnt).val("Y");
		$('#ipRow'+cnt).hide();			
	}
}
function addOpLstValuesRow()
{
	
$('#gridLstOutputValueTable').append('<tr id="opRow'+opRowCnt+'" class="opRow"><td class="centerAlign black">'+opRowCnt+'</td><td><select class="rounded w10  opSelect" id="outputParamNm'+opRowCnt+'"><option value=""><spring:message code="lbl.select" text="select"/></option></select></td><td style="background:inherit;border:0"><select class="rounded w10" id="outputFieldType'+opRowCnt+'" onchange="javascript:handleConstantValue(this);"><option value=""><spring:message code="lbl.select" text="select"/></option></td><td><select class="rounded w10" id="outputFieldName'+opRowCnt+'"><option value=""><spring:message code="lbl.select" text="select"/></option></td><td><input type="text" class="rounded w8" id="outputDefValue'+opRowCnt+'"/></td><td><img  id="outputEditableCheck'+opRowCnt+'" class="middleAlign ml12" src="static/images/icons/icon_unchecked.gif" width="16" height="16" border="0" onclick="toggleCheckUncheck(this,'+ opRowCnt+ ')"/><input type="hidden" id="outputEditableCheckValue'+opRowCnt+'"></td><td><a href="#" onclick="deleteOpLstValuesRow('+opRowCnt+');" class="rmRow delete_icon_link"></a></td><input type="hidden" value="N" id="isDelete'+opRowCnt+'"/></tr>');
		populateOutPutParamNameList('outputParamNm' + opRowCnt);
		populateOutPutFieldType('outputFieldType' + opRowCnt);
		populateFieldNameList('outputFieldName' + opRowCnt, 'outputFieldType' + opRowCnt);
		opRowCnt = opRowCnt + 1;
		opRowIndex = opRowIndex + 1;
}

function deleteOpLstValuesRow(cnt)
{		
	if($('#opRow'+cnt) != null)
	{
		$('#isDelete'+cnt).val("Y");
		$('#opRow'+cnt).hide();
	}
}

function getMyRowCnt(tblId) {
	var cnt = $('#' + tblId + ' >tbody > tr').length;
	return cnt;
}
function populateInPutFieldType(selectId) {
	$('#' + selectId)
			.append(
					'<option value="T" ><spring:message code="lbl.enrich.fieldtype.T"/></option>');
	$('#' + selectId)
			.append(
					'<option value="A" ><spring:message code="lbl.enrich.fieldtype.E"/></option>');
	$('#' + selectId)
			.append(
					'<option value="D" ><spring:message code="lbl.enrich.fieldtype.D"/></option>');
}

function populateOutPutFieldType(selectId) {
	$('#' + selectId)
			.append(
					'<option value="T" ><spring:message code="lbl.enrich.fieldtype.T"/></option>');
	$('#' + selectId)
			.append(
					'<option value="A" ><spring:message code="lbl.enrich.fieldtype.E"/></option>');
}
function toggleCheckUncheck(imgElement, opcnt) {
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
		imgElement.src = "static/images/icons/icon_checked.gif";
		$('#outputEditableCheckValue' + opcnt).val('Y');
	} else {
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#outputEditableCheckValue' + opcnt).val('N');
	}
}