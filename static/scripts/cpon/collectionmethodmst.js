function enableDisableLineReversal(limitProcessing,prdCat)
{
	 if(prdCat==='LOCAL' || prdCat==='LNONBNK' || prdCat==='OUTSTN' || prdCat==='MIXEDPHYSICALS')
	 {
	 if($('#arrangementProfileId').val()!='')
		{
			 var arrange=$('#arrangementId').val($('#arrangementProfileId option:selected').text().split('-')[1].trim());	
			 var arrangement=arrange.val().split('+');
			 if(arrangement[0] == 'D') {
				 if(limitProcessing=='I')
            	 {
					 $('#rbInstCreditLevelI').attr('checked', true);
					 $('#rbInstCreditLevelI').val('I');
            	 }
				 else
				 {
					 $('#rbInstCreditLevelD').attr('checked', true);
	            	 $('#rbInstCreditLevelD').val('D');
				 }
			 } else {
				 $('#rbInstCreditLevelD').attr('checked', true);
            	 $('#rbInstCreditLevelD').val('D');
			 }
		 }
	 }
	
}

function enableDisableWorkflow(objPrdCat)
{
	if("PRELIQ"==$(objPrdCat).val())
	{
		$('#workflowProfileId').attr('disabled','disabled');
		$('#workflowProfileId').addClass('disabled');
		$('#workFlowLabel').removeClass('required-lbl-right');
	}
	else
	{
		$('#workflowProfileId').removeAttr('disabled');
		$('#workflowProfileId').removeClass('disabled');
		$('#workFlowLabel').addClass('required-lbl-right');		
	}
	
}

function enableDisableMandate(objPrdCat,flag)
{
	var imgMandateEnable = document.getElementById('chkMandateEnable');
	if("DIRECTDEBIT"==$(objPrdCat).val() && typeof flag=='undefined')
	{
		imgMandateEnable.src = "static/images/icons/icon_unchecked.gif";
		$(imgMandateEnable).attr('onclick','toggleCheckUncheck(this,"mandateEnable");');
		
	}
	/*else if(("CHECKS"==$('#productCatType').val() || "CASH"==$('#productCatType').val()))
	{
		imgMandateEnable.src = "static/images/icons/icon_unchecked_grey.gif";
		$(imgMandateEnable).removeAttr('onclick');
		$('#mandateEnable').val('N');
		
	}*/else if(typeof flag =='undefined'){
		imgMandateEnable.src = "static/images/icons/icon_unchecked_grey.gif";
		$(imgMandateEnable).removeAttr('onclick');
		$('#mandateEnable').val('N');
	
	}
	else{
		if(flag =='N' && "DIRECTDEBIT"!=$(objPrdCat).val()){
			imgMandateEnable.src = "static/images/icons/icon_unchecked_grey.gif";
			$(imgMandateEnable).removeAttr('onclick');
			$('#mandateEnable').val('N');
		}
		
	}
}

function enableDisableBackDatedTrans(productCategory) {
	var chkAllowBackDatedTxn = document.getElementById('chkAllowBackDatedTxn');
	if(productCategory == undefined) {
		if($('#productCatType').val() == 'CHECKS' || $('#productCatType').val() == 'CHECK' || $('#productCatType').val() == 'INWARDRECEIVABLES') {
			chkAllowBackDatedTxn.src = "static/images/icons/icon_unchecked.gif";
			$(chkAllowBackDatedTxn).attr('onclick','toggleCheckUncheck(this,"allowBackDatedTxn");setDirtyBit();enableDisableBackValue();');
		} else {
			chkAllowBackDatedTxn.src = "static/images/icons/icon_unchecked_grey.gif";
			$(chkAllowBackDatedTxn).removeAttr('onclick');
			$('#maxDaysBackDated').val('0');
			$('#maxDaysBackDated').attr('disabled',true);
			$('#maxDaysBackDated').addClass('disabled ml12');
		}
	} else {
		if(productCategory.val() == 'CHECKS' || productCategory.val() == 'CHECK' || $('#productCatType').val() == 'INWARDRECEIVABLES') {
			var allowBackDatedTxn = document.getElementById('allowBackDatedTxn');
			if($(allowBackDatedTxn).val() == 'N') {
				chkAllowBackDatedTxn.src = "static/images/icons/icon_unchecked.gif";
			} else {
				chkAllowBackDatedTxn.src = "static/images/icons/icon_checked.gif";
			}
		} else {
			chkAllowBackDatedTxn.src = "static/images/icons/icon_unchecked_grey.gif";
			$('#maxDaysBackDated').val('0');
			$('#maxDaysBackDated').attr('disabled',true);
			$('#maxDaysBackDated').addClass('disabled ml12');
		}
	}
}

function enableDisableAssignAccount(objPrdCat,flag)
{
	var strCategory = $(objPrdCat).val().trim();
	var assignAccountEnable = document.getElementById('chkAssignAccount');
	if(('INWARDRECEIVABLES' === $('#productCatType').val() || 'CHECK' === $('#productCatType').val() ||
			'CHECKS' === $('#productCatType').val() || 'CASH' === $('#productCatType').val())){
		assignAccountEnable.src = 'static/images/icons/icon_checked_grey.gif';
		$(assignAccountEnable).removeAttr('onclick');
		$('#assignAccount').val('Y');
	}
	else if( flag === 'Y') {
		assignAccountEnable.src = 'static/images/icons/icon_checked.gif';
		$(assignAccountEnable).attr('onclick','toggleCheckUncheck(this,"assignAccount");');
		$('#assignAccount').val('Y');
	} else {
		assignAccountEnable.src = 'static/images/icons/icon_unchecked.gif';
		$(assignAccountEnable).attr('onclick','toggleCheckUncheck(this,"assignAccount");');
		$('#assignAccount').val('N');
	}
}

function enableDisablePayerAnalysis(flag)
{
	var imgPayerMandatoryEnable = document.getElementById('chkPayerMandatoryEnable');
	var imgPayerAnalysisEnable = document.getElementById('chkPayerAnalysisEnable');

	if(imgPayerMandatoryEnable.getAttribute('src').indexOf('/icon_checked')!=-1 && flag!='Y')
	{		
     	imgPayerAnalysisEnable.src = "static/images/icons/icon_unchecked.gif";
		$(imgPayerAnalysisEnable).attr('onclick','toggleCheckUncheck(this,"payerAnalysisEnable");');
		$('#payerAnalysisEnable').val('N');
	}
	else if(typeof flag!='undefined' && flag=="Y"){
		imgPayerAnalysisEnable.src = "static/images/icons/icon_checked.gif";
		$(imgPayerAnalysisEnable).attr('onclick','toggleCheckUncheck(this,"payerAnalysisEnable");');
		$('#payerAnalysisEnable').val('Y');
	}
	else {
		if(typeof flag=='undefined' || flag=="N"){
			imgPayerAnalysisEnable.src = "static/images/icons/icon_unchecked_grey.gif";
			$(imgPayerAnalysisEnable).removeAttr('onclick');
			$('#payerAnalysisEnable').val('N');
		}
	}
}

function enableDisablePayerMandatory(flag)
{
	var imgPayerMandatoryEnable = document.getElementById('chkPayerMandatoryEnable');	
	if("DIRECTDEBIT"==$('#productCatType').val() || "SEPADIRECTDEBIT"==$('#productCatType').val())
	{
			imgPayerMandatoryEnable.src = "static/images/icons/icon_checked_grey.gif";
			$(imgPayerMandatoryEnable).removeAttr('onclick');
			$('#payerMandatoryEnable').val('Y');
		
	}
	else if(("INWARDRECEIVABLES"==$('#productCatType').val() || "CHECKS"==$('#productCatType').val() || "CHECK"==$('#productCatType').val() || "CASH"==$('#productCatType').val()) && typeof flag=='undefined')
	{		
	     	imgPayerMandatoryEnable.src = "static/images/icons/icon_checked.gif";
			$(imgPayerMandatoryEnable).attr('onclick','toggleCheckUncheck(this,"payerMandatoryEnable");enableDisablePayerAnalysis();');
			$('#payerMandatoryEnable').val('Y');
	}	
	else 
	{	
		if(typeof flag=='undefined'){
			imgPayerMandatoryEnable.src = "static/images/icons/icon_checked.gif";
			$(imgPayerMandatoryEnable).attr('onclick','toggleCheckUncheck(this,"payerMandatoryEnable");enableDisablePayerAnalysis();');
			$('#payerMandatoryEnable').val('Y');
		}
		
	}
	if($('#productCatType').val() == "") {
		imgPayerMandatoryEnable.src = "static/images/icons/icon_unchecked_grey.gif";
	}
}

function isPDCApplicable()
{
	return ("LNONBNK"==$('#productCatType').val()
			|| "LOCAL"==$('#productCatType').val()
			|| "OUTSTN"==$('#productCatType').val()
			|| "MIXEDPHYSICALS"==$('#productCatType').val());
}

function enableDisablePdc(objPrdCat,flag)
{
	var imgPdc = document.getElementById('chkPdcEnable');
	if( isPDCApplicable() && (typeof flag=='undefined' || flag=='N'))
	{		
		imgPdc.src = "static/images/icons/icon_unchecked.gif";
		$(imgPdc).attr('onclick','toggleCheckUncheck(this,"pdcEnable");enableDisablePdcDiscounting();');
		$('#pdcEnable').val('N');
	}
	else if( isPDCApplicable() && flag=='Y')
	{		
		imgPdc.src = "static/images/icons/icon_checked.gif";
		$(imgPdc).attr('onclick','toggleCheckUncheck(this,"pdcEnable");enableDisablePdcDiscounting();');
		$('#pdcEnable').val('Y');
	}
	else{
		if(typeof flag=='undefined' || flag=="N"){
			imgPdc.src = "static/images/icons/icon_unchecked_grey.gif";
			$(imgPdc).removeAttr('onclick');
			$('#pdcEnable').val('N');
		}	
	}
}

function enableDisablePdcDiscounting(objPrdCat,flag)
{
	var imgPdc = document.getElementById('chkPdcEnable');
	var imgPdcDiscount = document.getElementById('chkPdcDiscountingEnable');

	if(imgPdc.getAttribute('src').indexOf('/icon_checked')!=-1 && flag!='Y')
	{		
     	imgPdcDiscount.src = "static/images/icons/icon_unchecked.gif";
		$(imgPdcDiscount).attr('onclick','toggleCheckUncheck(this,"pdcDiscountingEnable");');
		$('#pdcDiscountingEnable').val('N');
	}
	else if(typeof flag!='undefined' && flag=="Y"){
		imgPdcDiscount.src = "static/images/icons/icon_checked.gif";
		$(imgPdcDiscount).attr('onclick','toggleCheckUncheck(this,"pdcDiscountingEnable");');
		$('#pdcDiscountingEnable').val('Y');
	}
	else {
		if(typeof flag=='undefined' || flag=="N"){
			imgPdcDiscount.src = "static/images/icons/icon_unchecked_grey.gif";
			$(imgPdcDiscount).removeAttr('onclick');
			$('#pdcDiscountingEnable').val('N');
		}	
	}
}

function enableDisableRiskManager(flag) {
	if($('#arrangementProfileId').val()!='')
		{
			var arrange=$('#arrangementId').val($('#arrangementProfileId option:selected').text().split('-')[1].trim());	
			var arrangement=arrange.val().split('+');
			if(arrangement[0] == 'D') {
			$('#riskManagerId').attr('disabled',false);
				$('#riskManagerLabel').addClass('required-lbl-right');
			} else {
				$('#riskManagerId').attr('disabled',true);
				$('#riskManagerId').removeAttr('onclick');
				$('#riskManagerId').val('');
				$('#riskManagerLabel').removeClass('required-lbl-right');
			}
		}
	else
		{
			$('#riskManagerId').attr('disabled',true);
			$('#riskManagerId').removeAttr('onclick');
			$('#riskManagerId').val('');
			$('#riskManagerLabel').removeClass('required-lbl-right');
		}
}

function toggleCheckUncheck(imgElement, flag) {
	if (imgElement.src.indexOf("icon_unchecked_grey.gif") == -1) {
		if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
			imgElement.src = "static/images/icons/icon_checked.gif";
			$('#' + flag).val('Y');
		} else {
			imgElement.src = "static/images/icons/icon_unchecked.gif";
			$('#' + flag).val('N');
		}
	}
}

function toggleCheckUncheckAllowConfidential(imgElement,imgElement_confidential, flag) {
var ele=document.getElementById(imgElement_confidential);
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
		imgElement.src = "static/images/icons/icon_checked.gif";
		ele.src="static/images/icons/icon_unchecked.gif";
		$('#' + flag).val('Y');
	} else {
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		ele.src="static/images/icons/icon_unchecked_grey.gif";
		$('#' + flag).val('N');
	}
}

function setProductCatCode(prdCatCode)
{
	productCatCode = prdCatCode;
}

function getCustomLayouts()
{
	if($('#productCatType').val() != ''){
    $.ajax({
        url: "services/collectionCustomLayouts/"+ $('#productCatType').val() + ".json",
        type: "POST",
        async: false,
        data: {$data: null},
		complete: function(XMLHttpRequest, textStatus) {
			$.unblockUI();
			//if ("error" == textStatus)
				//alert("Unable to complete your request!");
		},
        success: function( data ) {
    		$("#customLayoutId").find('option').remove();
    		$("#customLayoutId").append("<option value=''>"+ getLabel('select','Select') +"</option>");
        	if(data && data.length > 0){
            	$.each(data, function(data, item) {
            		$("#customLayoutId").append("<option value='"+ this.name+ "'>"+ this.value +"</option>");
                });	            
        	}
        	else
        	{
        		$("#customLayoutId").append("<option value='MIXEDLAYOUT'>Mixed Layout</option>");
        	}
        } 
    });
	}
	else
	{
		$("#customLayoutId").find('option').remove();
		$("#customLayoutId").append("<option value=''>"+ getLabel('select','Select') +"</option>");
	}	
}

function setCheckUnchekGrey(flag, field)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/icons/icon_checked_grey.gif');
	}
	else
	{
		$('#'+field).attr('src','static/images/icons/icon_unchecked_grey.gif');		
	}	
}

function viewChanges(strUrl,viewMode)
{
	var frm = document.forms["frmMain"];
	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			'VIEW_MODE', viewMode));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}


function createFormField(element, type, name, value) 
{
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function toggleCheckUncheckPkgType(imgElement, flag) {
	var singleChk = document.getElementById('chkSinglePkgType');
	var multiChk = document.getElementById('chkMultiPkgType');
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
		imgElement.src = "static/images/icons/icon_checked.gif";
	} else {
		imgElement.src = "static/images/icons/icon_unchecked.gif";
	}
	if (singleChk.src.indexOf("icon_checked.gif") > -1
			&& multiChk.src.indexOf("icon_checked.gif") > -1)
	{
		$('#' + flag).val('M');
	} 
	else if (singleChk.src.indexOf("icon_checked.gif") > -1) 
	{
		$('#' + flag).val('Q');
	} 
	else if (multiChk.src.indexOf("icon_checked.gif") > -1)
	{
		$('#' + flag).val('B');
	}
	else
		$('#' + flag).val('N');
}

function toggleCheckUncheckAndEnable(imgElement, flagId, selectId) {
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1) {
		imgElement.src = "static/images/icons/icon_checked.gif";
		$('#' + flagId).val('Y');
		$('#' + selectId).attr('disabled', false);
	} else {
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#' + flagId).val('N');
		$('#' + selectId).attr('disabled', true);
	}
}

function setEnableDisable(imgElement, flagId, selectId) {
	var value = $('#' + flagId).val();
	if (value == 'N') {
		$('#' + selectId).attr('disabled', true);
	} else {
		$('#' + selectId).attr('disabled', false);
	}
}

function setCheckUnchek(flag, field) {
	if (flag == 'Y') {
		$('#' + field).attr('src', 'static/images/icons/icon_checked.gif');
	} else {
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked.gif');
	}
}

function setCheckUnchek_confidential(flag, field , allowfield) {
	var ele=document.getElementById(allowfield);
	if(ele.src.indexOf("icon_checked.gif") >-1)
		{
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked.gif');
	if (flag == 'Y') {
		$('#' + field).attr('src', 'static/images/icons/icon_checked.gif');
	} else {
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked.gif');
	}
		}
}

function setGreyCheckUnchek(flag, field) {
	if (flag == 'Y') {
		$('#' + field).attr('src', 'static/images/icons/icon_checked_grey.gif');
	} else {
		$('#' + field).attr('src', 'static/images/icons/icon_unchecked_grey.gif');
	}
}

function setCheckUnchekPkgType(flag, fieldSingle, fieldMulti) {
	if (flag == 'M') {
		$('#' + fieldSingle)
				.attr('src', 'static/images/icons/icon_checked.gif');
		$('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked.gif');
	} else if (flag == 'Q') {
		$('#' + fieldSingle)
				.attr('src', 'static/images/icons/icon_checked.gif');
	} else if (flag == 'B') {
		$('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked.gif');
	} else {
		$('#' + fieldSingle).attr('src',
				'static/images/icons/icon_unchecked.gif');
		$('#' + fieldMulti).attr('src',
				'static/images/icons/icon_unchecked.gif');
	}
}

function setGreyCheckUnchekPkgType(flag, fieldSingle, fieldMulti) {
	if (flag == 'M') {
		$('#' + fieldSingle)
				.attr('src', 'static/images/icons/icon_checked_grey.gif');
		$('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked_grey.gif');
	} else if (flag == 'Q') {
		$('#' + fieldSingle)
				.attr('src', 'static/images/icons/icon_checked_grey.gif');
	} else if (flag == 'B') {
		$('#' + fieldMulti).attr('src', 'static/images/icons/icon_checked_grey.gif');
	} else {
		$('#' + fieldSingle).attr('src',
				'static/images/icons/icon_unchecked_grey.gif');
		$('#' + fieldMulti).attr('src',
				'static/images/icons/icon_unchecked_grey.gif');
	}
}

function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
		goToPage(strUrl);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if (dityBitSet) {
		$('#confirmMsgPopup').dialog({
					autoOpen : false,
					height : 150,
					width : 430,
					modal : true,
					buttons : buttonsOpts
				});
		$('#confirmMsgPopup').dialog("open");
	} else {
		goToPage(strUrl);
	}
}

function goToPage(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	if(strUrl=="updateCollectionMethodDtl.form")
		{
	if($('#arrangementProfileId option:selected').val().length > 0){
		$('#arrangementId').val($('#arrangementProfileId option:selected').text().split('-')[1].trim());	
	}else{
		$('#arrangementId').val("");
	}	
		}
	frm.submit();
}

function cancelPaymentProduct(strUrl)
{
	var frm = document.forms["frmMain"];
	$('#viewState').val($('#hdrViewState').val());
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function submitCollectionMethod(strUrl) {
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	//var flagMixed = false;
	if($('#productCatType').is(":disabled")){
		flag = true;
		$('#productCatType').removeAttr('disabled');
	}
	if($('#customLayoutId').is(":disabled")){
		flag = true;
		$('#customLayoutId').removeAttr('disabled');
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	/*if(flagMixed){
		$('#productCatType').attr('disabled', 'disabled');
	}*/
}

function enableDisableForm(boolVal) {
	$('#Std').attr('disabled', boolVal);
	$('#custom').attr('disabled', boolVal);
	$('#packageName').attr('disabled', boolVal);
	$('#packageId').attr('disabled', boolVal);
	$('#packageIdFlag').attr('disabled', boolVal);
}

function showList(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showAddNewForm(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showHistoryForm(strUrl, index) {
	var intTop = (screen.availHeight - 300) / 2;
	var intLeft = (screen.availWidth - 400) / 2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecordList(strUrl) {
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "") {
		//alert("Select Atlease One Record");
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableRecordList(strUrl) {
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "") {
		//alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(me, strUrl) {
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "") {
		//alert("Select Atlease One Record")
		return;
	}
	frm.target = "";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function getRejectRecord(me, rejTitle, rejMsg, strUrl) {
	var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "") {
		//alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, strUrl, rejectRecord);
}

function rejectRecord(arrData, strRemarks, strUrl) {
	var frm = document.forms["frmMain"];
	if (strRemarks.length > 255) {
		//alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");
		return false;
	} else {
		frm.rejectRemarks.value = strRemarks;
		frm.target = "";
		frm.action = arrData;
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteList(me, strUrl) {
	var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "") {
		//alert("Select Atlease One Record");
		return;
	}
	deleteRecord(document.getElementById("updateIndex").value, strUrl);
}

function deleteRecord(arrData, strUrl) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = arrData;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

// List navigation
function prevPage(strUrl, intPg) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg) {
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function selectRecord(ctrl, status, index, maker) {
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if (index.length < 2) {
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
	if (aPosition >= 0) {
		document.getElementById("updateIndex").value = strAuthIndex.replace(
				strAuthIndex.substring(aPosition, aPosition + 2), "");
		mapPosition = strActionMap.indexOf(index + ":");
		document.getElementById("actionmap").value = strActionMap.replace(
				strActionMap.substring(mapPosition, mapPosition + 7), "");
	} else {
		document.getElementById("updateIndex").value = index + ","
				+ document.getElementById("updateIndex").value;
		strCurrentAction = arrActionMap[status];
		document.getElementById("actionmap").value = index + ":"
				+ strCurrentAction + ","
				+ document.getElementById("actionmap").value;
	}
	if (ctrl.className.indexOf("acceptlink") > -1) {
		ctrl.className = "linkbox acceptedlink";
	} else {
		ctrl.className = "linkbox acceptlink";
	}
	// perform the operation of bitwise anding
	lenDelimAction = document.getElementById("actionmap").value.length;
	if (lenDelimAction > 1) {
		strDelimAction = document.getElementById("actionmap").value;
		strDelimAction = strDelimAction.substring(0, lenDelimAction - 1);
		strArrSplitAction = strDelimAction.split(",");
		for (var i = 0; i < strArrSplitAction.length; i++) {
			strArrSplitAction[i] = strArrSplitAction[i]
					.substring(strArrSplitAction[i].indexOf(":") + 1);
		}

		if (strArrSplitAction.length == 1) {
			strFinalBitmap = strArrSplitAction[0];
		} else {
			lenLooplen = strArrSplitAction.length - 1;
			for (var j = 0; j < lenLooplen; j++) {
				if (j == 0) {
					strFinalBitmap = performAnd(strArrSplitAction[j],
							strArrSplitAction[j + 1]);
				} else {
					strFinalBitmap = performAnd(strFinalBitmap,
							strArrSplitAction[j + 1]);
				}
			}
		}
		document.getElementById("bitmapval").value = strFinalBitmap;
		refreshButtons(maker);
	} else {
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value = strFinalBitmap;
		refreshButtons(maker);
	}
}

function performAnd(validAction, currentAction) {
	var strOut = "";
	var i = 0;
	if (validAction.length = currentAction.length) {
		for (i = 0; i < 5; i++) {
			strOut = strOut
					+ ((validAction.charAt(i) * 1) && (currentAction.charAt(i) * 1));
		}
	}
	return strOut;
}

function refreshButtons(maker) {
	var strPopultedButtons = document.getElementById("bitmapval").value;
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd(strPopultedButtons, _strServerBitmap);
	// alert('the final bitmap::' + strActionButtons);
	var i = 0;
	if (strActionButtons.length > 0) {
		for (i = 0; i < 5; i++) {
			switch (i) {
				case 0 :
					if (strActionButtons.charAt(i) * 1 == 1
							&& maker != _strUserCode) {
						document.getElementById("btnAuth").className = "imagelink black inline_block button-icon icon-button-accept font_bold";
					} else {
						document.getElementById("btnAuth").className = "imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					}
					break;

				case 1 :
					if (strActionButtons.charAt(i) * 1 == 1
							&& maker != _strUserCode) {
						document.getElementById("btnReject").className = "imagelink black inline_block button-icon icon-button-reject font_bold";
					} else {
						document.getElementById("btnReject").className = "imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					}
					break;

				case 2 :
					if (strActionButtons.charAt(i) * 1 == 1) {
						document.getElementById("btnEnable").className = "imagelink black inline_block button-icon icon-button-enable font_bold";
					} else {
						document.getElementById("btnEnable").className = "imagelink grey inline_block button-icon icon-button-enable-grey font-bold";
					}
					break;

				case 3 :
					if (strActionButtons.charAt(i) * 1 == 1) {
						document.getElementById("btnDisable").className = "imagelink black inline_block button-icon icon-button-disable font_bold";
					} else {
						document.getElementById("btnDisable").className = "imagelink grey inline_block button-icon icon-button-disable-grey font-bold";
					}
					break;

				case 4 :
					if (strActionButtons.charAt(i) * 1 == 1) {
						document.getElementById("btnDiscard").className = "imagelink black inline_block button-icon icon-button-discard font_bold";
					} else {
						document.getElementById("btnDiscard").className = "imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					}
					break;
			}
		}
	}
}

// Details
function addDetail(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function deleteDetail(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index) {
	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function hideShowFields()
{
	var productCat = $('#productCatType').val();
	var imgPayerMandatoryEnable = document
			.getElementById('chkPayerMandatoryEnable');
	$('#backDateDiv').hide();
	$('#ibanValidationDiv').hide();
	$('#backDateTextDiv').hide();

	if (productCat === 'LOCAL' || productCat === 'LNONBNK'
			|| productCat === 'OUTSTN' || productCat === 'MIXEDPHYSICALS') {
		$('#transCurr').show();
	} else {
		$('#transCurr').hide();
	}

	if (productCat === 'PRELIQ') {
		$('#workflowDiv').hide();
	} else {
		$('#workflowDiv').show();
	}

	if (productCat === 'LOCAL' || productCat === 'LNONBNK'
			|| productCat === 'OUTSTN' || productCat === 'PRELIQ'
			|| productCat === 'CASHCOLL' || productCat === 'MIXEDPHYSICALS') {
		$('#mandateDiv').hide();
		$('#futureDiv').hide();
		$('#futureTextDiv').hide();
		$('#batchParam').hide();
	} else {
		$('#mandateDiv').show();
		$('#futureDiv').show();
		$('#futureTextDiv').show();
		$('#batchParam').show();
	}
	if (productCat === 'PRELIQ' || productCat === 'CASHCOLL'
			|| productCat === "DIRECTDEBIT" || productCat === "SEPADIRECTDEBIT") {

		$('#pdcDiv').hide();
		if (productCat === 'PRELIQ' || productCat === 'CASHCOLL') {
			imgPayerMandatoryEnable.src = "static/images/icons/icon_unchecked.gif";
			$(imgPayerMandatoryEnable).attr('onclick',
					'toggleCheckUncheck(this,"payerMandatoryEnable");');
			$('#payerMandatoryEnable').val('N');
			$('#payerDiv').hide();
			$('#useForDiv').hide();
		} else {
			imgPayerMandatoryEnable.src = "static/images/icons/icon_checked_grey.gif";
			$(imgPayerMandatoryEnable).removeAttr('onclick');
			$('#payerMandatoryEnable').val('y');
			$('#payerDiv').show();
			$('#useForDiv').show();
			if (productCat === "DIRECTDEBIT"
					|| productCat === "SEPADIRECTDEBIT") {
				if (allowIBANValidation == "Y")
					$('#ibanValidationDiv').show();
			}

		}
	} else {
		$('#payerDiv').show();
		$('#pdcDiv').show();
		$('#useForDiv').show();
	}
}

function pdcAfterAuth(auth,flag1,flag2)
{
	var imgPdc = document.getElementById('chkPdcEnable');
	var imgPdcDiscounting = document.getElementById('chkPdcDiscountingEnable');
	if( auth=='Y' && (typeof flag1=='undefined' || flag1=='N'))
	{		
		imgPdc.src = "static/images/icons/icon_unchecked_grey.gif";
		$(imgPdc).removeAttr('onclick');
		$('#pdcEnable').val('N');
	}
	else if( auth=='Y' && flag1=='Y')
	{		
		imgPdc.src = "static/images/icons/icon_checked_grey.gif";
		$(imgPdc).removeAttr('onclick');
		$('#pdcEnable').val('Y');
	}
	if(auth=='Y' && (typeof flag2=='undefined' || flag2=='N'))
	{
		imgPdcDiscounting.src = "static/images/icons/icon_unchecked_grey.gif";
		$(imgPdcDiscounting).removeAttr('onclick');
		$('#pdcDiscountingEnable').val('N');
	}
	else if( auth=='Y' && flag2=='Y')
	{		
		imgPdcDiscounting.src = "static/images/icons/icon_checked_grey.gif";
		$(imgPdcDiscounting).removeAttr('onclick');
		$('#pdcDiscountingEnable').val('Y');
	}
	
}

function enableDisableCustomLayout(objCusLayout)
{
	if("PRELIQ" == objCusLayout)
	{
		$('#customLayoutId').attr('disabled','disabled');
		$('#customLayoutId').addClass('disabled');
		$('#customLayoutLayout').removeClass('required-lbl-right');
	}
	else
	{
		$('#customLayoutId').removeAttr('disabled');
		$('#customLayoutId').removeClass('disabled');
		$('#customLayoutLayout').addClass('required-lbl-right');
	}
}

function getCustomLayouts()
{
	var prodCatType = $('#productCatType').val();
	if(prodCatType != '' && prodCatType != 'PRELIQ'){
			if(requestState == 0){
				enableDisableCustomLayout(prodCatType);	
			}else{
				$('#customLayoutId').attr('disabled','disabled');
				$('#customLayoutId').addClass('disabled');
				$('#customLayoutLayout').removeClass('required-lbl-right');
			}		
			
			$.ajax({
				url: "services/collectionCustomLayouts/"+ $('#productCatType').val() + ".json",
				type: "POST",
				async: false,
				data: {$data: null},
				complete: function(XMLHttpRequest, textStatus) {
					$.unblockUI();
					if ("error" == textStatus)
						alert("Unable to complete your request!");
				},
				success: function( data ) {
					$("#customLayoutId").find('option').remove();
					if(data && data.length > 0)
					{
						if(modeVal!='VIEW' && modeVal!='VERIFY')
						{
							$.each(data, function(data, item) {
								$("#customLayoutId").append("<option value='"+ item.name+ "'>"+ item.value +"</option>");
							});
						}
						else
						{
							$.each(data, function(data, item) {
								if(customLayoutId === item.name)
								$("#customeProfileId").text(item.value);
							});	 
						}
					}
				} 
			});
	}else if(prodCatType == 'PRELIQ'){
		$("#customLayoutId").html("<option value=''>Select</option>");
		enableDisableCustomLayout(prodCatType);
	}
	
}