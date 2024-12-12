function getMsgPopup() {
	$('#confirmMsgPopup').dialog({
		autoOpen : true,
		height : 200,
		width : 350,
		modal : true,
		buttons :[
			{
				text:getLabel('btnOk','Ok'),
				click : function() {
					$(this).dialog("close");
				}
			}
		]
	});
	$('#confirmMsgPopup').dialog('open');
}
function deleteTemplate(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById('searchCriteria').value = JSON.stringify(curData);
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function download(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function saveTemplate(strUrl) {
	//var frm = document.forms["frmMain"];
	var frm=document.getElementById("frmMain");
	document.getElementById('searchCriteria').value = JSON.stringify(curData);
	if (document.getElementById('newRequest').value == 'Y')
		strUrl = 'saveAsTemplate.form';
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function saveTemplateOnly(strUrl) {
	document.getElementById('templateName').value=$('#templateName_1').val();
	document.getElementById('templateDesc').value=$('#templateDesc_1').val();
	var isChecked = $('#templateType1').attr('checked')?true:false;
	if(isChecked)
		document.getElementById('templateType').value="P";
	else
		document.getElementById('templateType').value="";
	var frm = document.forms["frmMain"];
	document.getElementById('searchCriteria').value = "{}";
	if (document.getElementById('newRequest').value == 'Y')
		strUrl = 'saveAsTemplate.form';
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function populateFields() {
	var fld, opt, strTmp;
	var cboFields = document.getElementById('fields');
	for (key in fields) {
		fld = fields[key];
		opt = document.createElement('option');
		opt.text = fld.fieldName;
		opt.value = key;
		cboFields.add(opt, null);
	}
	strTmp = cboFields.options[0].value;
	fld = fields[strTmp];
	populateOperators(fld.dataType);
}

function populateOperators(intType) {
	var opt, objTmp;
	var cboOpr = document.getElementById('operators');
	for (key in operators) {
		switch (key) {
		case "EQ":
			opt = document.createElement('option');
			opt.text = operators[key];
			opt.value = key;
			cboOpr.add(opt, null);
			break;
		case "LK":
			if (intType == 0) {
				opt = document.createElement('option');
				opt.text = operators[key];
				opt.value = key;
				cboOpr.add(opt, null);
			}
			break;
		case "G":
		case "GE":
		case "L":
		case "LE":
		case "IN":
			if (intType != 0) {
				opt = document.createElement('option');
				opt.text = operators[key];
				opt.value = key;
				cboOpr.add(opt, null);
			}
			break;
		}
		opt = null;
	}

	if($("#toValue").val()=='' || $("#toValue").val()!='IN')
	{
	$('#toValue').hide();
	$('#labeltotxn').hide();
	}
	
	//document.getElementById('toValue').display = (cboOpr.options[0].value != "IN");
}

function validateFields(ctrl) {
	var strId = ctrl.options[ctrl.selectedIndex].value;
	var curField = fields[strId];
	var cboOpr = document.getElementById('operators');
	while (cboOpr.length > 0) {
		cboOpr.remove(0);
	}
	populateOperators(curField.dataType);
	$("#toValue,#fromValue").val('');
	validateFiledDataType(curField.dataType);
}

function validateFiledDataType(dataType){
	switch (""+dataType)
	{
	case "0" :
		$("#toValue,#fromValue").unbind();
		$("#toValue,#fromValue").datepicker('destroy');
	break;
	case "1" :
		$("#toValue,#fromValue").unbind();
		$("#toValue,#fromValue").datepicker('destroy');
		$("#toValue,#fromValue").ForcePositiveAndNegativeNumbersOnly();
	break;
	case "2" : 
		$("#toValue,#fromValue").unbind();
		$("#toValue,#fromValue").datepicker('destroy');
		$("#toValue,#fromValue").dateBox();		 		
		$("#toValue").datepicker({dateFormat: datePickDateFormat});		
		$("#fromValue").datepicker({dateFormat: datePickDateFormat, appendText: dateFormatText});;
	break;
	}
}

function validateOperators(ctrl) {
	//var opt = ctrl.options[ctrl.selectedIndex].value;
	//document.getElementById('toValue').disabled = (opt != "IN");
	var cboOpr=ctrl.options[ctrl.selectedIndex];

	if(cboOpr.value != "IN")
	{	
		if($("#toValue").hasClass("hasDatepicker")){
			$("#toValue").unbind();
			$("#toValue").datepicker('destroy');		
			$("#toValue").datepicker({dateFormat: datePickDateFormat});
		}
		$('#toValue').hide();
		$('#labeltotxn').hide();
	}
	else
	{
	if($("#toValue").hasClass("hasDatepicker")){
		$("#toValue").unbind();
		$("#toValue").datepicker('destroy');
		$("#toValue").datepicker({dateFormat: datePickDateFormat, appendText: dateFormatText});;
	}
	$('#toValue').show();
	$('#labeltotxn').show();
	}
}

function addField() {
	var cboFields = document.getElementById('fields');
	var cboOpr = document.getElementById('operators');
	var strId = cboFields.options[cboFields.selectedIndex].value;
	var fldDef = fields[strId];
	var curOpr = cboOpr.options[cboOpr.selectedIndex].value;
	
	var lblSetToValue=lblArray['setToValue'];
	var lblSetForValue=lblArray['setForValue'];
	var lblSetEqui=lblArray['setEqui'];

	if($("#toValue").val()=='' || $("#toValue").val()!='IN')
	{
	$('#toValue').hide();
	$('#labeltotxn').hide();
	}
	
	if (fldDef.dataType == 0 && ("EQ" != curOpr && "LK" != curOpr)) {
		alert(lblSetEqui+" "
				+ fldDef.fieldName);
		return false;
	}

	var toVal = document.getElementById('toValue');
	if ("IN" === curOpr && isEmpty(toVal.value)) {
		alert(lblSetToValue);
		return false;
	}
	var fromVal = document.getElementById('fromValue');
	if (isEmpty(fromVal.value)) {
		alert(lblSetForValue+" " + fldDef.fieldName);
		return false;
	}

	if (curData[strId] != null) {
		alert("Field " + fldDef.fieldName + " already added!");
		return false;
	}

	var fldDiv = $('#divFields');
	renderField(fldDiv, 0, strId, fldDef.fieldName, fldDef.dataType, curOpr,
			fromVal.value, toVal.value);

	var newField = {};
	newField.fieldName = fldDef.fieldName;
	newField.dataType = fldDef.dataType;
	newField.operator = curOpr;
	newField.fromValue = fromVal.value;
	if (fldDef.dataType != 0 && curOpr === "IN") {
		newField.toValue = toVal.value;
	}
	document.getElementById('fromValue').value = "";
	document.getElementById('toValue').value = "";
	curData[strId] = newField;
	return false;
}

function collapseforEdit()
{
$('#title_templateInfo').children('a').toggleClass("icon-expand icon-collapse");
$('#title_templateInfo').next().slideToggle("fast");
}

function resetOrderByFields(){
document.getElementById('col1').value = '0';
//console.log("document.getElementById('col1').value" + document.getElementById('col1').value);
document.getElementById('col2').value = '0';
document.getElementById('col3').value = '0';
document.getElementById('col4').value = '0';
document.getElementById('col5').value = '0';

document.getElementById('col1Order').value = 'A';
document.getElementById('col2Order').value = 'A';
document.getElementById('col3Order').value = 'A';
document.getElementById('col4Order').value = 'A';
document.getElementById('col5Order').value = 'A';
}
function loadTemplate(intId) {	
	resetOrderByFields();
	curData = {};
	searchId = intId;
	var fldDiv = $('#divFields');
	fldDiv.children().remove();
	document.getElementById('txtIndex').value = intId;
	document.getElementById('newRequest').value = 'N';
	$('#current_index').val(intId);
	var t = templates['template_' + intId];
	for (key in t.fields) {
		var fldDef = fields[key];
		if(fldDef){
		renderField(fldDiv, intId, key, fldDef.fieldName, fldDef.dataType,
				t.fields[key].operator, t.fields[key].fromValue,
				t.fields[key].toValue);

		var newField = {};
		newField.fieldName = fldDef.fieldName;
		newField.dataType = fldDef.dataType;
		newField.fromValue = t.fields[key].fromValue;
		if (fldDef.dataType != 0 && t.fields[key].operator === "IN") {
			newField.toValue = t.fields[key].toValue;
		}
		newField.operator = t.fields[key].operator;
		curData[key] = newField;
	}
	}
	document.getElementById('templateName').value = t.templateName;
	persistOrderByValue(t);
	populateOrderByValue(t);
	$("#tmpName").text(t.templateName+" Definition");
	$("#fieldDiv").show();
	if('none'==$("#gridDiv2").css('display'))
		{
			$("#title_templateFieldInfo").click();
		}
	if ('Y' == _isSuperUser) {
		if ('S' == t.templateType || 'E' == t.templateType)
			document.getElementById('templateType1').checked = false;
		else
			document.getElementById('templateType1').checked = true;
	}
	$("#btnSaveAs").button({
		disabled : false
	});
	$("#btnSave").button({
		disabled : false
	});
	if ("N" == _isSuperUser && ("S" == t.templateType || "E" == t.templateType))
		$("#btnSave").button({
			disabled : true
		});
	else if ('Y' == _isSuperUser && t.templateType != "S")
		$("#btnSave").button({
			disabled : true
		});
	return false;
}

function loadSearchTemplate(intId, strCriteria) {	
	curData = {};
	searchId = intId;
	var objJson = JSON.parse(strCriteria);
	var fldDiv = $('#divFields');
	fldDiv.children().remove();
	document.getElementById('txtIndex').value = intId;
	document.getElementById('newRequest').value = 'N';
	$('#current_index').val(intId);
	var t = templates['template_' + intId];
	for (key in objJson) {
		var fldDef = fields[key];
		var fld = objJson[key];		
		renderField(fldDiv, 0, key, fldDef.fieldName, fldDef.dataType,
				fld.operator, fld.fromValue, fld.toValue);

		var newField = {};
		newField.fieldName = fldDef.fieldName;
		newField.dataType = fldDef.dataType;
		newField.operator = fld.operator;
		newField.fromValue = fld.fromValue;
		if (fldDef.dataType != 0 && fld.operator === "IN") {
			newField.toValue = fld.toValue;
		}
		curData[key] = newField;
	}
	document.getElementById('templateName').value = t.templateName;	
	persistOrderByValue(t);
	populateOrderByValue(t);
	$("#tmpName").text(t.templateName+" Definition");	
	$("#fieldDiv").show();	
	collapseforEdit();	
	if('none'==$("#gridDiv2").css('display'))
		{
			$("#title_templateFieldInfo").click();
		}
		
	if ('Y' == _isSuperUser) {
		if ('S' == t.templateType || 'E' == t.templateType)
			document.getElementById('templateType1').checked = false;
		else
			document.getElementById('templateType1').checked = true;
	}
	$("#btnSaveAs").button({
		disabled : false
	});
	$("#btnSave").button({
		disabled : false
	});
	if ("N" == _isSuperUser && ("S" == t.templateType || "E" == t.templateType))
		$("#btnSave").button({
			disabled : true
		});
	else if ('Y' == _isSuperUser && t.templateType != "S")
		$("#btnSave").button({
			disabled : true
		});
	return false;
}


function persistOrderByValue(t)
{
	$('#orderByFirst').val(t.col1);
	$('#orderBySecond').val(t.col2);
	$('#orderByThird').val(t.col3);
	$('#orderByFourth').val(t.col4);
	$('#orderByFifth').val(t.col5);
	
	$('#firstSort').val(t.col1Order);
	$('#secondSort').val(t.col2Order);
	$('#thirdSort').val(t.col3Order);
	$('#fourthSort').val(t.col4Order);
	$('#fifthSort').val(t.col5Order);
	
	changeSortIcons("orderByFirst_a","firstSort");
	changeSortIcons("orderBySecond_a","secondSort");
	changeSortIcons("orderByThird_a","thirdSort");
	changeSortIcons("orderByFourth_a","fourthSort");
	changeSortIcons("orderByFifth_a","fifthSort");
}

function populateOrderByValue(t)
{
	generateOrderByString(t.col1,t.col2,t.col3,t.col4,t.col5,t.col1Order,t.col2Order,t.col3Order,t.col4Order,t.col5Order)
}

function cancelOrderByValue()
{
	var col1=$('#col1').val();
	var col2=$('#col2').val();
	var col3=$('#col3').val();
	var col4=$('#col4').val();
	var col5=$('#col5').val();
	var col1Order = $('#col1Order').val();
	var col2Order = $('#col2Order').val();
	var col3Order = $('#col3Order').val();
	var col4Order = $('#col4Order').val();
	var col5Order = $('#col5Order').val();
	generateOrderByString(col1,col2,col3,col4,col5,col1Order,col2Order,col3Order,col4Order,col5Order);
	$('#orderByFirst').val(col1);
	$('#orderBySecond').val(col2);
	$('#orderByThird').val(col3);
	$('#orderByFourth').val(col4);
	$('#orderByFifth').val(col5);
	
	$('#firstSort').val(col1Order);
	$('#secondSort').val(col2Order);
	$('#thirdSort').val(col3Order);
	$('#fourthSort').val(col4Order);
	$('#fifthSort').val(col5Order);
	
	changeSortIcons("orderByFirst_a","firstSort");
	changeSortIcons("orderBySecond_a","secondSort");
	changeSortIcons("orderByThird_a","thirdSort");
	changeSortIcons("orderByFourth_a","fourthSort");
	changeSortIcons("orderByFifth_a","fifthSort");
}

function addOrderByValue()
{
	var col1=$('#orderByFirst').val();
	var col2=$('#orderBySecond').val();
	var col3=$('#orderByThird').val();
	var col4=$('#orderByFourth').val();
	var col5=$('#orderByFifth').val();
	var col1Order = $('#firstSort').val();
	var col2Order = $('#secondSort').val();
	var col3Order = $('#thirdSort').val();
	var col4Order = $('#fourthSort').val();
	var col5Order = $('#fifthSort').val();
	generateOrderByString(col1,col2,col3,col4,col5,col1Order,col2Order,col3Order,col4Order,col5Order);
}

function generateOrderByString(col1,col2,col3,col4,col5,col1Order,col2Order,col3Order,col4Order,col5Order)
{ 	
	var fld;
	var orderByDiv = $('#orderByFields');
	var orderByStr="";
	var chkExist = false;
	orderByDiv.children().remove();
	if(col1 && col1!=0)
	{
		fld = fields['field_'+col1];
		orderByStr = orderByStr+' '+fld.fieldName;
		orderByStr = col1Order === 'A' ? orderByStr+'(Asc)&nbsp;':orderByStr+'(Desc)&nbsp; ';
		chkExist=true;
	}
		if(col2 && col2!=0)
	{
		fld = fields['field_'+col2];
		orderByStr = orderByStr+' '+fld.fieldName;
		orderByStr = col2Order === 'A' ? orderByStr+'(Asc)&nbsp; ':orderByStr+'(Desc)&nbsp; ';
		chkExist=true;
	}
		if(col3 && col3!=0)
	{
		fld = fields['field_'+col3];
		orderByStr = orderByStr+' '+fld.fieldName;
		orderByStr = col3Order === 'A'  ?orderByStr+'(Asc)&nbsp; ':orderByStr+'(Desc)&nbsp; ';
		chkExist=true;
	}
		if(col4 && col4!=0)
	{
		fld = fields['field_'+col4];
		orderByStr = orderByStr+' '+fld.fieldName;
		orderByStr = col4Order === 'A' ? orderByStr+'(Asc)&nbsp; ':orderByStr+'(Desc)&nbsp; ';
		chkExist=true;
	}
		if(col5 && col5!=0)
	{
		fld = fields['field_'+col5];
		orderByStr = orderByStr+' '+fld.fieldName;
		orderByStr = col5Order === 'A' ? orderByStr+'(Asc)&nbsp; ':orderByStr+'(Desc)&nbsp; ';
		chkExist=true;
	}
	orderByDiv.hide();
	if(chkExist)
	{
			var lbl = $('<label>Order By</label>');
			lbl.addClass('frmLabel font_bold');
			lbl.appendTo(orderByDiv);
			
			var lblOp = $('<label class="inline_block">' + orderByStr+ '</label>');
			lblOp.appendTo(orderByDiv);
			orderByDiv.show();
	}
}
function deleteField(event) {
	var fldId;

	var re = new RegExp("t_(\\d+)_(.*)", "gi");
	var arrMatch = re.exec(event.data.elId);
	if (arrMatch != null) {
		fldId = arrMatch[2];
	}
	if (!isEmpty(fldId)) {
		delete curData[fldId];
		$('#divFields').children('#div_' + fldId).remove();
	}
	return false;
}

function renderField(parent, tmplId, fieldId, strLbl, intType, pOp, fromVal,
		toVal, isUpdate) 
	{
	var elDiv;
	
	if (null == isUpdate) {
		isUpdate = false;
	}

	if (isUpdate) {
		$('#' + 'div_' + fieldId).empty();
		elDiv = $('#' + 'div_' + fieldId);
	} else {
		elDiv = $('<div class="bottomAlign" id="' + 'div_' + fieldId
				+ '"></div>');
	}
	if (parent.children().length > 0)
		elDiv.addClass('border_top_thin border_solid border_lgrey');

	var lbl = $('<label>' + strLbl + '</label>');
	lbl.addClass('frmLabel');
	lbl.appendTo(elDiv);

	var lblOp = $('<label class="inline_block w10">(' + operators[pOp]
			+ ')&nbsp;</label>');
	lblOp.appendTo(elDiv);

	var fldVal = $('<input type="text" onchange="updateField(this);" style="border:0px;" readonly="true"/>');
	fldVal.attr('id', 't_' + tmplId + "_from_" + fieldId);
	fldVal.attr('name', 't_' + tmplId + "_from_" + fieldId);
	fldVal.attr('value', fromVal);
	if (intType === 2) {
		fldVal.addClass('textBox rounded w80p');
		//fldVal.datepicker({dateFormat : 'dd/mm/yy'});
	} else {
		fldVal.addClass('textBox rounded mw10');
	}
	fldVal.appendTo(elDiv);

	if (intType != 0 && pOp === "IN") {
		var fldTo = $('<input type="text" onchange="updateField(this);" style="border:0px;" readonly="true"/>');
		fldTo.attr('id', 't_' + tmplId + "_to_" + fieldId);
		fldTo.attr('name', 't_' + tmplId + "_to_" + fieldId);
		fldTo.attr('value', toVal);
		if (intType === 2) {
			fldTo.addClass('textBox rounded w80p');
			//fldTo.datepicker({dateFormat : 'dd/mm/yy'});
		} else {
			fldTo.addClass('textBox rounded mw10');
		}
		elDiv.append(" & ");
		fldTo.appendTo(elDiv);
	}
		var btnDivedit = $('<div style="display:inline;border-width:0;float:right;padding:4px 3px 0 0;"></div>');		
		var editBtn = $('<a class="grid-link-icon editlink" href="#"></a>');
		editBtn.bind("click", {
			elId : 't_' + tmplId + "_" + fieldId
		}, getEditFieldPopup);
		editBtn.appendTo(btnDivedit);
		btnDivedit.appendTo(elDiv);			
	
		var btnDiv = $('<div style="display:inline;border-width:0;float:right;padding:6px 1px 0 0;"></div>');
		var lnkBtn = $('<a class="imagelink black inline button-icon icon-button-discard font-bold" href="#"></a>');
		lnkBtn.bind("click", {
			elId : 't_' + tmplId + "_" + fieldId
		}, deleteField);
		lnkBtn.appendTo(btnDiv);
		btnDiv.appendTo(elDiv);
	if(!isUpdate){
		elDiv.appendTo(parent);
	}
}

function clearTemplate() {
	var fldDiv = $('#divFields');
	fldDiv.children().remove();
	document.getElementById('templateName').value = "";
	document.getElementById('newRequest').value = 'Y';
	$("#btnSaveAs").button({
		disabled : true
	});
	$("#btnSave").button({
		disabled : false
	});
	$('#current_index').val(-1);
	curData = {};
}

function updateField(ctrl) {
	var re = new RegExp("(?:t_\\d+_(from|to)_)(.*)", "g");
	var arrMatch = re.exec(ctrl.id);
	if (arrMatch != null) {
		var id = arrMatch[2];
		if ("from" === arrMatch[1]) {
			curData[id].fromValue = ctrl.value;
		} else {
			curData[id].toValue = ctrl.value;
		}
	}
	return false;
}

function doSearch(flgSearchAndSave) {

	var noCriteria= lblArray['noCriteria'];
	 if (jQuery.isEmptyObject(curData)) {
	  alert(noCriteria);
	  return false;
	 }

	 $
	   .blockUI({
	    message : '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2>',
	    timeout : 10000,
	    css : {
	     height : '32px',
	     padding : '8px 0 0 0'
	    }
	   });

	 document.getElementById('searchCriteria').value = JSON.stringify(curData);

	 if(flgSearchAndSave == null || flgSearchAndSave == 'undefined' || flgSearchAndSave == false ){
	  var txn_frm = document.forms["frmMain"];
	 var input_requesturl = document.createElement("input");
	 input_requesturl.setAttribute("type", "hidden");
	 input_requesturl.setAttribute("id", "flagForTemplates");
	 input_requesturl.setAttribute("name", "flagForTemplates");
	 input_requesturl.setAttribute("value", "true");
	  
	 txn_frm.appendChild(input_requesturl); 
	 
	 var input_requesturl2 = document.createElement("input");
	 input_requesturl2.setAttribute("type", "hidden");
	 input_requesturl2.setAttribute("id", "searchIdSet");
	 input_requesturl2.setAttribute("name", "searchIdSet");
	 input_requesturl2.setAttribute("value", searchId);
	 txn_frm.appendChild(input_requesturl2);
	 
	 
	 document.getElementById('frmMain').action = "searchBtrTxn.form";
	 }
	 else {
	  document.getElementById('frmMain').action = 'searchAndSaveTxn.form';
	 }
	 curData = {};
	 document.getElementById('frmMain').submit();
	}
//function doSearch() {
//
//	if (jQuery.isEmptyObject(curData)) {
//		alert("No search criteria specified!");
//		return false;
//	}
//
//	$
//			.blockUI({
//				message : '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing YOUR request...</h2>',
//				timeout : 10000,
//				css : {
//					height : '32px',
//					padding : '8px 0 0 0'
//				}
//			});
//
//	document.getElementById('searchCriteria').value = JSON.stringify(curData);
//
//	document.getElementById('frmMain').action = "searchBtrTxn.form";
//	curData = {};
//	document.getElementById('frmMain').submit();
//}

function showActivityInfo(strFrmId, intRec, tokId, tokVal) {
	var strData = {};
	strData["recordIndex"] = intRec-1;
	strData["viewState"] = $('#viewState').val();
	strData[tokId] = tokVal;
	$.post('getTxnSearchInfo.form', strData, paintActivityInfo, "json");
	return false;
}

function paintActivityInfo(data) {
	var cntr, lbl, spn;

	var actData = data.activityData;
	var actLabels = data.activityLabels;

	if (isEmpty(actData) || isEmpty(actLabels))
		return false;

	var dlg = $('#addiInfo');

	dlg.children("#fld_accountId").text(actData.acno);
	dlg.children("#fld_currency").text(actData.currency);
	var valueDate = $.datepicker.parseDate("dd/mm/yy",  actData.value_date);
	var valueDate = $.datepicker.formatDate(datePickDateFormat,valueDate);	
	dlg.children("#fld_valueDate").text(valueDate);

	// Add dynamic fields
	var fldDiv = dlg.children("#info_fields").children("#lable");
	fldDiv.children().remove();
	
	cntr = 0;
	row = $('<tr></tr>');
	for (key in actData) {		
		if (key.match(/^info_/)) {
			cntr++;
			lblCol = null;
			dataCol = null;
			
			var lableVal =actLabels[key];
			if( null == lableVal){
			lableVal = "";
			}			
			lblCol = $('<td class="leftAlign odd_column" width="25%">' + lableVal+ '&nbsp; :</td>');
			dataCol = $('<td class="leftAlign" width="25%">' + actData[key] + '</td>');
			row.append(lblCol);
			row.append(dataCol);
			if (cntr % 2 == 0) {
				fldDiv.append(row);
				row = $('<tr></tr>');
			}
		}
	}
	if (cntr % 2 != 0) {
		row.append(lblCol);
		row.append(dataCol);
		row.append($('<td>&nbsp;</td>'));
		row.append($('<td>&nbsp;</td>'));
		fldDiv.append(row);
	}
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:520,
				beforeClose: function(event, ui) {},
				buttons: {"Ok": function() {$(this).dialog("destroy");}}});
	dlg.dialog('open');
	return false;
}


function showEnrichments(strFrmId, intRec, tokId, tokVal) {

	var strData = {};
	document.getElementById('accountId').value = intRec;
	strData["accountId"] = intRec;
	strData["viewState"] = $('#viewState').val();
	strData[tokId] = tokVal;
	$.post('getActivityEnrichments.form', strData, paintEnrichments, "json");
	return false;
}

function btrShowEnrichments(strFrmId, intRec, accountId,accNumber, strSessionNumber, intSequenceNo, transactionDate, transactionType, amount, currency, tokId, tokVal) {

	var d = $.datepicker.parseDate("yy-mm-dd",  transactionDate);
	var datestrInNewFormat = $.datepicker.formatDate(datePickDateFormat, d);
	
	$('#btrSearchAccNumber').val(accNumber);
	$('#btrSearchAccountDate').val(datestrInNewFormat);
	$('#btrSearchAccountAmount').val(amount);
	$('#btrSearchAccountType').val(transactionType);
	$('.currencyLabel').text(currency);
	
	
	$('#btrSearchAccNumber').attr("disabled","disabled");
	$('#btrSearchAccountDate').attr("disabled","disabled");
	$('#btrSearchAccountAmount').attr("disabled","disabled");
	$('#btrSearchAccountType').attr("disabled","disabled");
	$('.currencyLabel').attr("disabled","disabled");

	var strData = {};
	document.getElementById('recordIndex').value = intRec-1;
	strData["recordIndex"] = intRec-1;
	strData["accountId"] = accountId;
	strData["viewState"] = $('#viewState').val();
	strData[tokId] = tokVal;
	strData["sessionNumber"] = strSessionNumber;
	strData["SequenceNo"] = intSequenceNo;
	$.post('getActivityEnrichments.form', strData, paintEnrichments, "json");
	return false;
}

function paintEnrichments(data) {

	var eData, lData, labels;
	var dlg = $('#divEnrichments').clone(false);
	dlg.attr('id', 'dlgDiv');

	eData = data.enrich_data;
	lData = data.enrichment_labels;

	var accountBasicInfo = data.accountBasicInfo;
	
	 var flag = false;
	
	if (lData) {	
		for ( var cntr = 1; cntr < 11; cntr++) {
			flag =false
			labels = lData[cntr-1];	
				for (key in labels) {
					flag = true;
					var k = "e" + (cntr-1);
					var m = "m" + (cntr-1);
					dlg.children("#elabel_" + cntr).text(labels[k]);
					if('Y' == labels[m]){
						dlg.children("#elabel_" + cntr).addClass('required');
					}
				}
				if(flag == false){
					dlg.children("#elabel_" + cntr).hide();
					dlg.children("#enrichment" + cntr).hide();
				}
		}
	}
			
	if (eData) {
		for (key in eData) {			
			dlg.children("#enrichment" + key.substr(1)).val(eData[key]);
		}
	}
	
	dlg.dialog({
		bgiframe : true,
		autoOpen : false,
		height : "auto",
		modal : true,
		resizable : false,
		width : 480,
		buttons: [{
            id:"btn-cancel",
            text: "Cancel",
            click: function() {
				$(this).dialog("destroy");
				$(this).remove();
                  }
          },{
          	id:"btn-ok",
              text: "Ok",
              click: function() {
            		var _values = {};
    				$(":input", $(this)).each(function() {
    					_values[this.name] = $(this).val();
    				});
    				$(this).dialog("destroy");
    				$(this).remove();
    				closeAndSubmit(_values, accountBasicInfo);
                  }
          }],
          open : function()
      	{
      		if(CAN_EDIT=="false")
      			{
      			$("#btn-ok").attr('disabled','disabled');
      			}
      	}
      	});

	dlg.dialog('open');
	return false;
}


function closeAndSubmit(arrValues, accountBasicInfo) {
	for (key in arrValues) {
		$('#divEnrichments').children('#' + key).val(arrValues[key]);
	}
	document.forms["frmMain"].action = 'saveBtrEnrichment.form';
	document.getElementById('frmMain').submit();
}


function getEditFieldPopup(event) {
	var buttonsOpts = {};	
	var fldId;
	var re = new RegExp("t_(\\d+)_(.*)", "gi");
	var arrMatch = re.exec(event.data.elId);
	if (arrMatch != null) {
		fldId = arrMatch[2];
	}
	
	buttonsOpts[btnsArray['updateBtn']] = function() {
		updateCriteria(fldId);
		$(this).dialog("close");		
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {		
		resetForm("addFieldPopup");
		$(this).dialog("close");		
	};
	$('#addFieldPopup').dialog({
				autoOpen : false,
				height : 200,
				width : 540,
				modal : true,
				buttons : buttonsOpts,
				title:  updatePopupTitleText,
				open: function(ev, ui) {populateEditFileds(fldId);}

			});
	$('#addFieldPopup').dialog("open");
}

function updateCriteria(fldId) {
if (!isEmpty(fldId)) {
	var  newField = curData[fldId];
	var cboFields = document.getElementById('fields');
	var cboOpr = document.getElementById('operators');
	var strId = cboFields.options[cboFields.selectedIndex].value;
	var fldDef = fields[strId];
	var curOpr = cboOpr.options[cboOpr.selectedIndex].value;
	var lblSetToValue=lblArray['setToValue'];
	var lblSetForValue=lblArray['setForValue'];
	var lblSetEqui=lblArray['setEqui'];

	if($("#toValue").val()=='' || $("#toValue").val()!='IN')
	{
	$('#toValue').hide();
	$('#labeltotxn').hide();
	}
	
	if (fldDef.dataType == 0 && ("EQ" != curOpr && "LK" != curOpr)) {
		alert(lblSetEqui+" "
				+ fldDef.fieldName);
		return false;
	}

	var toVal = document.getElementById('toValue');
	if ("IN" === curOpr && isEmpty(toVal.value)) {
		alert(lblSetToValue);
		return false;
	}
	var fromVal = document.getElementById('fromValue');
	if (isEmpty(fromVal.value)) {
		alert(lblSetForValue +" " + fldDef.fieldName);
		return false;
	}

	var fldDiv = $('#divFields');
	
	renderField(fldDiv, 0, strId, fldDef.fieldName, fldDef.dataType, curOpr,
			fromVal.value, toVal.value, true);

	newField.fieldName = fldDef.fieldName;
	newField.dataType = fldDef.dataType;
	newField.operator = curOpr;
	newField.fromValue = fromVal.value;
	if (fldDef.dataType != 0 && curOpr === "IN") {
		newField.toValue = toVal.value;
	}
	document.getElementById('fromValue').value = "";
	document.getElementById('toValue').value = "";
}
	return false;
}

function populateEditFileds(fldId){
	
	if (!isEmpty(fldId)) {	
	 var  newField = curData[fldId];
	 var fname =  newField.fieldName;
	if (newField.dataType != 0 && newField.operator === "IN") {
			newField.toValue = newField.toValue;
	}		
	$('#fields').val(fldId);	
	$("#operators").get(0).options.length = 0;
	populateOperators(newField.dataType)
	$('#operators').val(newField.operator);
	$('#fromValue').val(newField.fromValue);
	validateFiledDataType(newField.dataType);
	validateOperators(document.getElementById('operators'));
	if (newField.dataType != 0 && newField.operator === "IN") {
			 $('#toValue').val(newField.toValue);			
	}
	$("#fields").attr("disabled","disabled");
  }
}


function getAddPopup(strUrl, frmId) {
	var buttonsOpts = {};	
	buttonsOpts[btnsArray['goBtn']] = function() {
		$(this).dialog("close");
		addField();
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm("addFieldPopup");
		$(this).dialog("close");
	};
	$('#addFieldPopup').dialog({
				autoOpen : false,
				height : 200,
				width : 540,
				modal : true,
				buttons : buttonsOpts,
				title: addPopupTitleText,
				open: function(event, ui) {$("#fields").removeAttr("disabled"); resetForm("addFieldPopup"); validateFields(document.getElementById('fields'));}

			});
	$('#addFieldPopup').dialog("open");
}

function getAddTemplatePopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['goBtn']] = function() {
		$(this).dialog("close");
		saveTemplateOnly('saveAsTemplate.form');
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm("addTemplatePopup");
		$(this).dialog("close");
	};
	$('#addTemplatePopup').dialog({
				autoOpen : false,
				height : 220,
				width : 473,
				modal : true,
				buttons : buttonsOpts
			});
	$('#addTemplatePopup').dialog("open");
}

function getOrderByPopup(strUrl, frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['goBtn']] = function() {
		$(this).dialog("close");
		setOrderByField();
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		cancelOrderByValue();
		$(this).dialog("close");
	};
	$('#orderByPopup').dialog({
				autoOpen : false,
				height : 265,
				width : 480,
				modal : true,
				buttons : buttonsOpts
			});
	$('#orderByPopup').dialog("open");
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

function setOrderByField()
{
	if("" != $('#orderByFirst').val()){
		$('#col1').val(parseInt($('#orderByFirst').val(),10));
	}else {
		$('#col1').val(0);
	}
	if("" != $('#orderBySecond').val()){
		$('#col2').val(parseInt($('#orderBySecond').val(),10));
	}else {
		$('#col2').val(0);
	}
	if("" != $('#orderByThird').val()){
		$('#col3').val(parseInt($('#orderByThird').val(),10));
	}else {
		$('#col3').val(0);
	}
	if("" != $('#orderByFourth').val()){
		$('#col4').val(parseInt($('#orderByFourth').val(),10));
	}else {
		$('#col4').val(0);
	}
	if("" != $('#orderByFifth').val()){
		$('#col5').val(parseInt($('#orderByFifth').val(),10));
	}else {
		$('#col5').val(0);
	}
	/*$('#col3').val($('#orderByThird').val());
	$('#col4').val($('#orderByFourth').val());
	$('#col5').val($('#orderByFifth').val());*/
	$('#col1Order').val($('#firstSort').val());
	$('#col2Order').val($('#secondSort').val());
	$('#col3Order').val($('#thirdSort').val());
	$('#col4Order').val($('#fourthSort').val());
	$('#col5Order').val($('#fifthSort').val());
	addOrderByValue();
		
}



function resetForm(divId){
	$("#"+divId).find(':input').each(function() {	
        switch(this.type) {	            	            
	            case 'text':
	            case 'textarea':
	                $(this).val('');
	                break;
				case 'select-multiple':
	            case 'select-one':
					$(this).prop('selectedIndex', 0);
	                break;
	            case 'checkbox':
	            case 'radio':
	                this.checked = false;
	        }
    });	
}


function btrShowImage(strFrmId, url, checkDepositeNo) {
	var frm = document.getElementById(strFrmId);
	$('#checkDepositeNo').val(checkDepositeNo);
	frm.action = url;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=700,height=350";
	var winPopup = window.open ("", "hWinSeek", strAttr);
	winPopup.focus();
	frm.submit();
	frm.target = "";
}
function showDetails(index) {
	
	var strJson = document.getElementById("TEXTJSON"+index).value;
	var myJSONObject = JSON.parse(strJson);
	
	setValuesForViewPopUp(myJSONObject);
	var buttonsOpts = {};
	buttonsOpts[btnsArray['close']] = function() {
		$('#btrDetailsPopup').dialog("close");
	}
	$('#btrDetailsPopup').dialog({
		autoOpen : false,
		height : 440,
		width : 600,
		modal : true,
		buttons : buttonsOpts
	});
$('#btrDetailsPopup').dialog("open");
}
function setValuesForViewPopUp(obj) 
{
	$("#detailRecordKeyNo").val(obj.recordKeyNo);
    $("#detailAccountNumber").text(obj.accountNumber);
    $("#detailCurrency").text(obj.currency);
	$("#detailBankReference").text(obj.bankReference);
    $("#detailCustomerReference").text(obj.customerReference);
    $("#detailTypeCodeDesc").text(obj.typeCodeDesc);
    $("#detailAmount").text(obj.amount);
    $("#detailTransactionDate").text(obj.transactionDate);
    $("#detailText").val(obj.text);
    $("#remittanceText").val(obj.remittanceText);
}


