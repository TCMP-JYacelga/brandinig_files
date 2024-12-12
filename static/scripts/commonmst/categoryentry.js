jQuery.fn.CorporationAutoComplete = function() {
	if(enityType == 1)
	{
		var seekUrl = "services/userseek/customerRolesCorporation.json?$top=-1";
	}
	else
	{
		var seekUrl = "services/userseek/adminRolesCorporation.json?$top=-1";
	}
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : seekUrl,
							dataType : "json",
							data : {
								$autofilter : request.term,
								$sellerCode: sessionSellerCode
							},
							success : function(data) {
								var rec = data.d.preferences;
								response($.map(rec, function(item) {
											return {
												label : item.DESCR,
												value :item.DESCR,
												code : item.CODE
											}
										}));
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
			
				/*log(ui.item ? "Selected: " + ui.item.label + " -show lbl:"
						+ ui.item.lbl : "Nothing selected, input was "
						+ this.value);*/
						var val = ui.item.code;
					$('#corporationCode').val(val);
					$('#corporationDesc').val(ui.item.label);
					
					/*if (!isEmpty($('#clientID').val()) && !isEmpty($('#userID').val())){
						$("#btnSubmit").attr('disabled',false);
					}*/
					refreshServices($('#sellerCode').val(),val,mode);	
					$('#subsidiary').show();					
					$('#chkImg_copyCat').attr('src','static/images/icons/icon_unchecked.gif');
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
					+ ' </ul></ol></a>';					
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
function refreshServices(sellerCode, corpCode, mode)
{
	var frm = document.forms["frmMain"]; 	
	if	(mode == "ADD"){
		frm.action = "addUserAdminCategory.form";		
	}
	if(mode == "UPDATE"){
		frm.action = "updateUserAdminCategory.form";
	}
	if(mode == "EDIT"){
		frm.action = "editUserAdminCategory.form";
	}
	if(document.getElementById('sellerCode'))
	{
		document.getElementById('sellerCode').value = sellerCode;
	}
	document.getElementById('corporationCode').value = corpCode;
	
	frm.method = "POST";
	frm.submit();
}
selectedCheckBox = new Array();
selectedClientCodes = new Array();
removeClientCodes = new Array();
selectedCheckBoxAccount = new Array();
selectedAccounts = new Array();
removeAccounts = new Array();
selectedProducts = new Array();
removeProducts = new Array();
selectedEvents = new Array();
removeEvents = new Array();
selectedReports = new Array();
removeReports = new Array();
selectedTemplates = new Array();
removeTemplates = new Array();
selectedMsgforms = new Array();
removeMsgforms = new Array();
selectedCompanyIds = new Array();
removeCompanyIds = new Array();
selectedBankReports = new Array();
removeBankReports = new Array();

function saveCategory(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function goToPage(strUrl, frmId) {	
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function handleLinkageError(funcPointer,strUrl, frmId)
{
	if(removeClientCodes.length > 0){
		$('#confirm').modal({
			close:false,
			position: ["30%"],
			overlayId:'confirmModalOverlay',
			containerId:'confirmModalContainer',
			onShow: function (dialog) {
				dialog.data.find('.message').append(strDeleteMsg);

	            dialog.data.find('.btnCancel').click(function() {
	                $.modal.close();
	            });
				dialog.data.find('.btnOk').click(function() {
					$.modal.close();
					 funcPointer(strUrl, frmId);
				});
	}
  });
 }else{
	 funcPointer(strUrl, frmId);
 }
}

function categoryClientFilter(strUrl, frmId)
{
	populateRightsSerials();
	handleLinkageError(goToPage,strUrl, frmId);
}

function categoryViewClientFilter(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showBackPage(strAction)
{
	var strUrl;
	var frm = document.forms["frmMain"];
	frm.target ="";
	if ("AUTHVIEW" == strAction || "AUTHFILTER" == strAction || "AUTH" == strAction)
		strUrl = "authUserCategory.form";
	else
		strUrl = "userCategoryList.form";
		
	if (frm.categoryCode)
		frm.categoryCode.value = "";
	frm.viewState.value = "";

	if ($('#dirtyBit').val() == "1")
		getConfirmationPopup('frmMain', strUrl);
		else
		{
			frm.action = strUrl;
			frm.method = 'POST';
			frm.submit();
		}
}
// handling on header checkbox of clientLinkage tab
function checkUncheckCategoryClient(field, headerCheckbox) {
	var removeIndex;
	if(checkPoint==1){
		removeClientCodes.splice(1,removeClientCodes.length);
		selectedClientCodes.splice(1,selectedClientCodes.length);
		for(var i=0; i< autoSelectedClientCodes.length;i++){
			selectedClientCodes.push(autoSelectedClientCodes[i]);
	}
	}
	checkPoint++;
	selectedCheckBox.splice(0, selectedCheckBox.length);
	if (headerCheckbox.checked == true && field.length > 0) {
		for (var i = 0; i < field.length; i++) 
			{
			field[i].checked = true;
			var chkId = field[i].getAttribute("id");
			var chkIndex = chkId.substr(chkId.lastIndexOf('_')+1);
			if(chkIndex)
			{
				selectedCheckBox[selectedCheckBox.length] = chkIndex;
				if(getIndex(autoSelectedClientCodes, chkIndex) == -1)
					{
					autoSelectedClientCodes.push(chkIndex);
				}
			}
		}
	} else if (field.length > 0) {
		for (var j = 0; j < field.length; j++) 
			{
			field[j].checked = false;
			var chkId = field[j].getAttribute("id");
			var chkIndex = chkId.substr(chkId.lastIndexOf('_')+1);
			if(chkIndex)
			{
				if((ind = getIndex(autoSelectedClientCodes, chkIndex)) > -1){
					autoSelectedClientCodes.splice(ind,1);
				}
			}
		}
		selectedCheckBox.splice(0, selectedCheckBox.length);
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
			var chkId = field.getAttribute("id");
			var chkIndex = chkId.substr(chkId.lastIndexOf('_')+1);
			if(chkIndex)
			{
				selectedCheckBox[selectedCheckBox.length] = chkIndex;
			}
	} else {
		field.checked = false;
		selectedCheckBox.splice(0, selectedCheckBox.length);
	}
	
}
//Row wise handling of clientLinkage tab
function rowSelectClient(checkBoxId, rowIndex) {
	var ind;
	var removeIndex;
	if(checkPoint==1){
		for(var i=0; i< autoSelectedClientCodes.length;i++){
			selectedClientCodes.push(autoSelectedClientCodes[i]);
		}
	}
		checkPoint++;
		if (checkBoxId.checked == true) {			
			if(getIndex(autoSelectedClientCodes, rowIndex) == -1)
			{
				// Need to add id here
				autoSelectedClientCodes.push(rowIndex);
			}
		} else {
			if((ind = getIndex(autoSelectedClientCodes, rowIndex)) > -1)
			{
				autoSelectedClientCodes.splice(ind,1);
			}
			$('#headerCheckbox').removeAttr("checked");
		}		
}

function checkUncheckCategoryAccount(field, headerCheckbox) {
	var removeIndex;
	if(accountCheckPoint==1){
		removeAccounts.splice(1,removeAccounts.length);
		selectedAccounts.splice(1,selectedAccounts.length);
		for(var i=0; i< autoSelectedAccounts.length;i++){
			selectedAccounts.push(autoSelectedAccounts[i]);
	}
	}
	accountCheckPoint++;
	if (headerCheckbox.checked == true && field.length > 0) {
		for (var i = 0; i < field.length; i++) {
			field[i].checked = true;
			
			if(getIndex(autoSelectedAccounts, field[i].getAttribute("id")) == -1){
				autoSelectedAccounts.push(field[i].getAttribute("id"));
			}
		}
	} else if (field.length > 0) {
		for (var j = 0; j < field.length; j++) {
			field[j].checked = false;
			if((ind = getIndex(autoSelectedAccounts, field[j].getAttribute("id"))) > -1){
				autoSelectedAccounts.splice(ind,1);
			}
		}
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
		autoSelectedAccounts[selectedCheckBox.length] = field.getAttribute("id");
	} else {
		field.checked = false;
		autoSelectedAccounts.splice(0, selectedCheckBox.length);
	}
	
}
function rowSelectAccount(checkBoxId, index) {
	var index;
	var ind;
	var removeIndex;
	if(accountCheckPoint == 1){
		removeAccounts.splice(1,removeAccounts.length);
		selectedAccounts.splice(1,selectedAccounts.length);
		for(var i=0; i< autoSelectedAccounts.length;i++)
		{
			selectedAccounts.push(autoSelectedAccounts[i]);
	}
	}
	accountCheckPoint++;
		if (checkBoxId.checked == true) {
			if(getIndex(autoSelectedAccounts, checkBoxId.getAttribute("id")) == -1){
				autoSelectedAccounts.push(checkBoxId.getAttribute("id"));
			}
		} else {
			if((ind = getIndex(autoSelectedAccounts,checkBoxId.getAttribute("id"))) > -1){
				autoSelectedAccounts.splice(ind,1);
			}
			$('#headerCheckboxAccount').removeAttr("checked");
		}
}

function checkUncheckCategoryProduct(field, headerCheckbox) {
	var removeIndex;
	if(productCheckPoint==1){
		removeProducts.splice(1,removeProducts.length);
		selectedProducts.splice(1,selectedProducts.length);
		for(var i=0; i< autoSelectedProducts.length;i++){
			selectedProducts.push(autoSelectedProducts[i]);
	}
	}
	productCheckPoint++;
	if (headerCheckbox.checked == true && field.length > 0) {
		for (var i = 0; i < field.length; i++) {
			field[i].checked = true;
			
			if(getIndex(autoSelectedProducts, field[i].getAttribute("id")) == -1){
				autoSelectedProducts.push(field[i].getAttribute("id"));
			}
		}
	} else if (field.length > 0) {
		for (var j = 0; j < field.length; j++) {
			field[j].checked = false;
			if((ind = getIndex(autoSelectedProducts, field[j].getAttribute("id"))) > -1){
				autoSelectedProducts.splice(ind,1);
			}
		}
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
		autoSelectedProducts[selectedCheckBox.length] = field.getAttribute("id");
	} else {
		field.checked = false;
		autoSelectedProducts.splice(0, selectedCheckBox.length);
	}
}
function rowSelectProduct(checkBoxId, index) {
	var index;
	var ind;
	var removeIndex;
	if(productCheckPoint == 1){
		removeProducts.splice(1,removeProducts.length);
		selectedProducts.splice(1,selectedProducts.length);
		for(var i=0; i< autoSelectedProducts.length;i++)
		{
			selectedProducts.push(autoSelectedProducts[i]);
	}
	}
	productCheckPoint++;
		if (checkBoxId.checked == true) {
			if(getIndex(autoSelectedProducts, checkBoxId.getAttribute("id")) == -1){
				autoSelectedProducts.push(checkBoxId.getAttribute("id"));
			}
		} else {
			if((ind = getIndex(autoSelectedProducts, checkBoxId.getAttribute("id"))) > -1){
				autoSelectedProducts.splice(ind,1);
			}
			$('#headerCheckboxProduct').removeAttr("checked");
		}
}
function checkUncheckCategoryReport(field, headerCheckbox) {
	var removeIndex;
	if(reportCheckPoint==1){
		removeReports.splice(1,removeReports.length);
		selectedReports.splice(1,selectedReports.length);
		for(var i=0; i< autoSelectedReports.length;i++){
			selectedReports.push(autoSelectedReports[i]);
	}
	}
	reportCheckPoint++;
	if (headerCheckbox.checked == true && field.length > 0) {
		for (var i = 0; i < field.length; i++) {
			field[i].checked = true;
			
			if(getIndex(autoSelectedReports, field[i].getAttribute("id")) == -1){
				autoSelectedReports.push(field[i].getAttribute("id"));
			}
		}
	} else if (field.length > 0) {
		for (var j = 0; j < field.length; j++) {
			field[j].checked = false;
			if((ind = getIndex(autoSelectedReports, field[j].getAttribute("id"))) > -1){
				autoSelectedReports.splice(ind,1);
			}
		}
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
		autoSelectedReports[selectedCheckBox.length] = field.getAttribute("id");
	} else {
		field.checked = false;
		autoSelectedReports.splice(0, selectedCheckBox.length);
	}
	
}
function rowSelectReport(checkBoxId, index) {
	var ind;
	var removeIndex;
	if(reportCheckPoint == 1){
		removeReports.splice(1,removeReports.length);
		selectedReports.splice(1,selectedReports.length);
		for(var i=0; i< autoSelectedReports.length;i++)
		{
			selectedReports.push(autoSelectedReports[i]);
	}
	}
	reportCheckPoint++;
		if (checkBoxId.checked == true) {
			if(getIndex(autoSelectedReports, checkBoxId.getAttribute("id")) == -1){
				autoSelectedReports.push(checkBoxId.getAttribute("id"));
			}
		} else {
			if((ind = getIndex(autoSelectedReports, checkBoxId.getAttribute("id"))) > -1){
				autoSelectedReports.splice(ind,1);
			}
			$('#headerCheckboxReport').removeAttr("checked");
		}
}

function checkUncheckCategoryEvent(field, headerCheckbox) {
	var removeIndex;
	if(eventCheckPoint==1){
		removeEvents.splice(1,removeEvents.length);
		selectedEvents.splice(1,selectedEvents.length);
		for(var i=0; i< autoSelectedEvents.length;i++){
			selectedEvents.push(autoSelectedEvents[i]);
	}
	}
	eventCheckPoint++;
	if (headerCheckbox.checked == true && field.length > 0) {
		for (var i = 0; i < field.length; i++) {
			field[i].checked = true;
			
			if(getIndex(autoSelectedEvents, field[i].getAttribute("id")) == -1){
				autoSelectedEvents.push(field[i].getAttribute("id"));
			}
		}
	} else if (field.length > 0) {
		for (var j = 0; j < field.length; j++) {
			field[j].checked = false;
			if((ind = getIndex(autoSelectedEvents, field[j].getAttribute("id"))) > -1){
				autoSelectedEvents.splice(ind,1);
			}
		}
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
		autoSelectedEvents[selectedCheckBox.length] = field.getAttribute("id");
	} else {
		field.checked = false;
		autoSelectedEvents.splice(0, selectedCheckBox.length);
	}
}
function rowSelectEvent(checkBoxId, index) {
	var index;
	var ind;
	var removeIndex;
	if(eventCheckPoint == 1){
		for(var i=0; i< autoSelectedEvents.length;i++)
		{
			selectedEvents.push(autoSelectedEvents[i]);
	}
	}
	eventCheckPoint++;
		if (checkBoxId.checked == true) {
			if(getIndex(autoSelectedEvents,checkBoxId.getAttribute("id")) == -1){
				autoSelectedEvents.push(checkBoxId.getAttribute("id"));
			}
		} else {
			if((ind = getIndex(autoSelectedEvents, checkBoxId.getAttribute("id"))) > -1){
				autoSelectedEvents.splice(ind,1);
			}
			$('#headerCheckboxEvent').removeAttr("checked");
		}
}

function checkUncheckCategoryTemplate(field, headerCheckbox) {
	var removeIndex;
	if(templateCheckPoint==1){
		removeTemplates.splice(1,removeTemplates.length);
		selectedTemplates.splice(1,selectedTemplates.length);
		for(var i=0; i< autoSelectedTemplates.length;i++){
			selectedTemplates.push(autoSelectedTemplates[i]);
	}
	}
	templateCheckPoint++;
	if (headerCheckbox.checked == true && field.length > 0) {
		for (var i = 0; i < field.length; i++) {
			field[i].checked = true;
			
			if(getIndex(autoSelectedTemplates, field[i].getAttribute("id")) == -1){
				autoSelectedTemplates.push(field[i].getAttribute("id"));
			}
		}
	} else if (field.length > 0) {
		for (var j = 0; j < field.length; j++) {
			field[j].checked = false;
			if((ind = getIndex(autoSelectedTemplates, field[j].getAttribute("id"))) > -1){
				autoSelectedTemplates.splice(ind,1);
			}
		}
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
		autoSelectedTemplates[selectedCheckBox.length] = field.getAttribute("id");
	} else {
		field.checked = false;
		autoSelectedTemplates.splice(0, selectedCheckBox.length);
	}
	
}
function rowSelectTemplate(checkBoxId, index) {
	var index;
	var ind;
	var removeIndex;
	if(templateCheckPoint == 1){
		removeTemplates.splice(1,removeTemplates.length);
		selectedTemplates.splice(1,selectedTemplates.length);
		for(var i=0; i< autoSelectedTemplates.length;i++)
		{
			selectedTemplates.push(autoSelectedTemplates[i]);
	}
	}
	templateCheckPoint++;
		if (checkBoxId.checked == true) {
			if(getIndex(autoSelectedTemplates, checkBoxId.getAttribute("id")) == -1){
				autoSelectedTemplates.push(checkBoxId.getAttribute("id"));
			}
		} else {
			if((ind = getIndex(autoSelectedTemplates,checkBoxId.getAttribute("id"))) > -1){
				autoSelectedTemplates.splice(ind,1);
			}
			$('#headerCheckboxTemplate').removeAttr("checked");
		}
}

function checkUncheckCategoryMsgforms(field, headerCheckbox) {
	var removeIndex;
	if(msgformsCheckPoint==1){
		removeMsgforms.splice(1,removeMsgforms.length);
		selectedMsgforms.splice(1,selectedMsgforms.length);
		for(var i=0; i< autoSelectedMsgforms.length;i++){
			selectedMsgforms.push(autoSelectedMsgforms[i]);
	}
	}
	msgformsCheckPoint++;
	if (headerCheckbox.checked == true && field.length > 0) {
		for (var i = 0; i < field.length; i++) {
			field[i].checked = true;
			
			if(getIndex(autoSelectedMsgforms, field[i].getAttribute("id")) == -1){
				autoSelectedMsgforms.push(field[i].getAttribute("id"));
			}
		}
	} else if (field.length > 0) {
		for (var j = 0; j < field.length; j++) {
			field[j].checked = false;
			if((ind = getIndex(autoSelectedMsgforms, field[j].getAttribute("id"))) > -1){
				autoSelectedMsgforms.splice(ind,1);
			}
		}
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
		autoSelectedMsgforms[selectedCheckBox.length] = field.getAttribute("id");
	} else {
		field.checked = false;
		autoSelectedMsgforms.splice(0, selectedCheckBox.length);
	}
	
}
function rowSelectMsgforms(checkBoxId, index) {
	var index;
	var ind;
	var removeIndex;
	if(msgformsCheckPoint == 1){
		removeMsgforms.splice(1,removeMsgforms.length);
		selectedMsgforms.splice(1,selectedMsgforms.length);
		for(var i=0; i< autoSelectedMsgforms.length;i++)
		{
			selectedMsgforms.push(autoSelectedMsgforms[i]);
	}
	}
	msgformsCheckPoint++;
		if (checkBoxId.checked == true) {
			if(getIndex(autoSelectedMsgforms, checkBoxId.getAttribute("id")) == -1){
				autoSelectedMsgforms.push(checkBoxId.getAttribute("id"));
			}
		} else {
			if((ind = getIndex(autoSelectedMsgforms,checkBoxId.getAttribute("id"))) > -1){
				autoSelectedMsgforms.splice(ind,1);
			}
			$('#headerCheckboxMsgforms').removeAttr("checked");
		}
}

function checkUncheckCategoryCompanyId(field, headerCheckbox) {
	var removeIndex;
	if(companyIdsCheckPoint==1){
		removeCompanyIds.splice(1,removeCompanyIds.length);
		selectedCompanyIds.splice(1,selectedCompanyIds.length);
		for(var i=0; i< autoSelectedCompanyIds.length;i++){
			selectedCompanyIds.push(autoSelectedCompanyIds[i]);
	}
	}
	companyIdsCheckPoint++;
	if (headerCheckbox.checked == true && field.length > 0) {
		for (var i = 0; i < field.length; i++) {
			field[i].checked = true;
			
			if(getIndex(autoSelectedCompanyIds, field[i].getAttribute("id")) == -1){
				autoSelectedCompanyIds.push(field[i].getAttribute("id"));
			}
		}
	} else if (field.length > 0) {
		for (var j = 0; j < field.length; j++) {
			field[j].checked = false;
			if((ind = getIndex(autoSelectedCompanyIds, field[j].getAttribute("id"))) > -1){
				autoSelectedCompanyIds.splice(ind,1);
			}
		}
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
		autoSelectedCompanyIds[selectedCheckBox.length] = field.getAttribute("id");
	} else {
		field.checked = false;
		autoSelectedCompanyIds.splice(0, selectedCheckBox.length);
	}
	
}

function rowSelectCompanyId(checkBoxId, index) {
	var index;
	var ind;
	var removeIndex;
	if(companyIdsCheckPoint == 1){
		removeCompanyIds.splice(1,removeCompanyIds.length);
		selectedCompanyIds.splice(1,selectedCompanyIds.length);
		for(var i=0; i< autoSelectedCompanyIds.length;i++)
		{
			selectedCompanyIds.push(autoSelectedCompanyIds[i]);
	}
	}
	companyIdsCheckPoint++;
		if (checkBoxId.checked == true) {
			if(getIndex(autoSelectedCompanyIds, checkBoxId.getAttribute("id")) == -1){
				autoSelectedCompanyIds.push(checkBoxId.getAttribute("id"));
			}
		} else {
			if((ind = getIndex(autoSelectedCompanyIds,checkBoxId.getAttribute("id"))) > -1){
				autoSelectedCompanyIds.splice(ind,1);
			}
			$('#headerCheckboxCompanyId').removeAttr("checked");
		}
}

function checkUncheckCategoryBankReport(field, headerCheckbox) {
	var removeIndex;
	if(bankReportsCheckPoint==1){
		removeBankReports.splice(1,removeBankReports.length);
		selectedBankReports.splice(1,selectedBankReports.length);
		for(var i=0; i< autoSelectedBankReports.length;i++){
			selectedBankReports.push(autoSelectedBankReports[i]);
	}
	}
	bankReportsCheckPoint++;
	if (headerCheckbox.checked == true && field.length > 0) {
		for (var i = 0; i < field.length; i++) {
			field[i].checked = true;
			
			if(getIndex(autoSelectedBankReports, field[i].getAttribute("id")) == -1){
				autoSelectedBankReports.push(field[i].getAttribute("id"));
			}
		}
	} else if (field.length > 0) {
		for (var j = 0; j < field.length; j++) {
			field[j].checked = false;
			if((ind = getIndex(autoSelectedBankReports, field[j].getAttribute("id"))) > -1){
				autoSelectedBankReports.splice(ind,1);
			}
		}
	} else if (headerCheckbox.checked == true) {
		field.checked = true;
		autoSelectedBankReports[selectedCheckBox.length] = field.getAttribute("id");
	} else {
		field.checked = false;
		autoSelectedBankReports.splice(0, selectedCheckBox.length);
	}
	
}

function rowSelectBankReport(checkBoxId, index) {
	var index;
	var ind;
	var removeIndex;
	if(bankReportsCheckPoint == 1){
		removeBankReports.splice(1,removeBankReports.length);
		selectedBankReports.splice(1,selectedBankReports.length);
		for(var i=0; i< autoSelectedBankReports.length;i++)
		{
			selectedBankReports.push(autoSelectedBankReports[i]);
	}
	}
	bankReportsCheckPoint++;
		if (checkBoxId.checked == true) {
			if(getIndex(autoSelectedBankReports, checkBoxId.getAttribute("id")) == -1){
				autoSelectedBankReports.push(checkBoxId.getAttribute("id"));
			}
		} else {
			if((ind = getIndex(autoSelectedBankReports,checkBoxId.getAttribute("id"))) > -1){
				autoSelectedBankReports.splice(ind,1);
			}
			$('#headerCheckboxBankReport').removeAttr("checked");
		}
}

function selectedExists(checkID) {
	for ( var i = 0; i < selectedCheckBoxAccount.length; i++) {
		if (selectedCheckBoxAccount[i] == checkID) {
			return i;
		}
	}
	return 0;
}


function getIndex(items, checkItem) {
	for ( var i = 0; i < items.length; i++) {
		if (items[i] == checkItem) {
			return i;
		}
	}
	return -1;
}

function getRecord(json,elementId)
{
   var myJSONObject = JSON.parse(json);
   var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
{
     var field = inputIdArray[i];
     if(document.getElementById(inputIdArray[i]))
   {
     var type = document.getElementById(inputIdArray[i]).type;
     if(type=='text'){
      document.getElementById(inputIdArray[i]).value = JSON.parse(myJSONObject).columns[0].value;}
   else {
   document.getElementById(inputIdArray[i]).innerHTML = JSON.parse(myJSONObject).columns[0].value;} 
   }
}    
}

function getConfirmationPopup(frmId, strUrl, strUrlSave)
{
	$('#confirmPopup').modal({
			close:false,
			position: ["30%"],
			width:'500px',
			overlayId:'confirmModalOverlay',
			containerId:'confirmModalContainer',
			onShow: function (dialog) {
				dialog.data.find('.message').append(strDeleteMsg);
	            dialog.data.find('.btnCancel').click(function() {
	                $.modal.close();
	            });
				dialog.data.find('.btnOk').click(function() {
					$.modal.close();
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
				});
	}
  });
}

function getCategoryDetails()
{
	var frm = document.forms["frmMain"];
	frm.action = "copyUserCategoryDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function warnBeforeCancel(strUrl) {
	$('#confirmMsgPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
		/*buttons : {
			"Ok" : function() {
				var frm = document.forms["frmMain"];
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			},
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}*/
	});
	$('#confirmMsgPopup').dialog("open");
	
	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmMsgPopup').dialog("close");
	});
	
	$('#doneConfirmMsgbutton').bind('click',function(){
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	});
	$('#textContent').focus();
}
function populateCorporationList()
{
	$('#corporationDesc').val("");
	$(".selector").autocomplete({delay:3000});
	$("#corporationDesc").CorporationAutoComplete();
}
function paintUserAdminCategoryActionList(userMode,recordKeyNo)
{
	var elt = null, eltSubmit = null, eltCancel = null, eltSave = null, eltUpdate = null,eltNext = null,canShow = true;
	$('#userRoleActionButtonListLT,#userRoleActionButtonListRT, #userRoleActionButtonListLB, #userRoleActionButtonListRB')
			.empty();
	var strBtnLTLB = '#userRoleActionButtonListLT,#userRoleActionButtonListLB';
	var strBtnRTRB = '#userRoleActionButtonListRT,#userRoleActionButtonListRB';
	
	if(userMode ==='VIEW')
	{
		eltCancel = createButton('btnCancel', 'S', getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					saveCategory('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");

		if((userMode === 'EDIT' || userMode === 'UPDATE' || userMode === 'UPDATE_NEXT') && null !== recordKeyNo)
		{
			eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
			eltUpdate.click(function() {
						saveCategory('updateUserAdminCategory.form');
					});
			eltUpdate.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		else
		{
			//eltSave = createButton('btnSave', 'P', 'Save');
			//eltSave.click(function() {
			//			saveCategory('saveUserAdminCategory.form');
			//		});
			//eltSave.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
	}
	else
	{
		eltCancel = createButton('btnCancel', 'S',  getLabel('btnCancel','Cancel'));
		eltCancel.click(function() {
					warnBeforeCancel('userAdminCategoryList.form');
				});
		eltCancel.appendTo($(strBtnLTLB));
		$(strBtnLTLB).append("&nbsp;");
		if((userMode === 'EDIT' || userMode === 'UPDATE' || userMode === 'UPDATE_NEXT') && null !== recordKeyNo)
		{
			eltUpdate = createButton('btnUpdate', 'P', getLabel('btnUpdate','Update'));
			eltUpdate.click(function() {
						saveCategory('updateUserAdminCategory.form');
					});
			eltUpdate.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
		else
		{
			eltSave = createButton('btnSave', 'P',getLabel('btnSave','Save'));
			eltSave.click(function() {
						saveCategory('saveUserAdminCategory.form');
					});
			eltSave.appendTo($(strBtnRTRB));
			$(strBtnRTRB).append("&nbsp;");
		}
	}
	if((userMode === 'EDIT' || userMode === 'UPDATE' || userMode === 'UPDATE_NEXT') && null !== recordKeyNo)
	{
		eltNext = createButton('btnNext', 'P',getLabel('btnNext','Next'));
		eltNext.click(function() {
					saveCategory('upateAndNextUserCategory.form');
				});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else if(userMode ==='VIEW')
	{
		eltNext = createButton('btnNext', 'P',getLabel('btnNext','Next'));
		eltNext.click(function() {
					saveCategory(defaultServiceNavigationCategoryViewMode);
				});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	else
	{
		eltNext = createButton('btnNext', 'P', getLabel('btnNext','Next'));
		eltNext.click(function() {
					saveCategory('saveAndNextUserCategory.form');
				});
		eltNext.appendTo($(strBtnRTRB));
		$(strBtnRTRB).append("&nbsp;");
	}
	
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