function checkBalanceBatch(selectedSeccode)
{
	var isOffsetTxnAllow = false;
	var seccodeRecord;
	if (secCodeJsonArray) 
	{
		seccodeRecord = JSON.parse(secCodeJsonArray).find(function (d) {return d.SUBTYPE === selectedSeccode;});		
		if(seccodeRecord)
		{
			isOffsetTxnAllow = seccodeRecord.ALLOW_OFFSET_TXN === 'Y' ? true : false;
		}
	}
	return isOffsetTxnAllow;
}	
	
		
function handleSeccodeChange(me)
{
	if($('#balBatchFlag').val()=='N')
	{
		$('#offsetTxnDiv').hide();
		$('#offsetTxnFlag').val('N');
		$('#imgOffsetTxn').attr("src", "static/images/icons/icon_unchecked.gif");
	}
	else
	{
		if (checkBalanceBatch(me.value))
			$('#offsetTxnDiv').show();
		else
		{
			$('#offsetTxnDiv').hide();
			$('#offsetTxnFlag').val('N');
			$('#imgOffsetTxn').attr("src", "static/images/icons/icon_unchecked.gif");
		}
	}
}

function splitTime(time)
{
	var timeArray = new Array();
	do
	{
		timeArray.push(time.substring(0, 2));
	} 
	while((time = time.substring(2, time.length)) != "");
	return timeArray;
}



function goToPage(frmId) {
	
	var frm = document.getElementById(frmId);
	frm.action = "bankProductMasterList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts['OK'] = function() {
		$(this).dialog("close");
		gotoPage(strUrl,'frmMain');
	};
	buttonsOpts['Cancel'] = function() {
		$(this).dialog("close");
	};
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				height : 150,
				width : 430,
				modal : true,
				buttons : buttonsOpts
			});
	$('#confirmMsgPopup').dialog("open");
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
function hideShowParameters(instCodeId)
{
	var image;
	var seller = document.getElementById('sellerCode').value;
	var $widget;
	var prodType;
	if(""==instCodeId||undefined==instCodeId){
		$('#fieldform').hide();
	}
	else
	{ 	  
		$('#fieldform').show();
		prodType = obj[instCodeId].productTypeCode;
		if(prodType=='D'||prodType=='O'||prodType=='B'||prodType=='N')
		{
			showValidationRules(prodType, seller);
		}else
		{
			$('#ruleCode').empty();	
		}
		
	if(instCodeId =='62'){
		$('#divSecCode').show();
		$('#batchDiv').show();
		$('#allowSameDayACHDiv').show();
		$('#divHoldZero').show();
		if (document.getElementById("secCode"))
				handleSeccodeChange(document.getElementById("secCode"));	
	}else{
		$('#divSecCode').hide();
		$('#batchDiv').hide();
		$('#allowSameDayACHDiv').hide();
		$('#divHoldZero').hide();
		$('#secCode').val("");
		$('#balBatchFlag').val('N');
		if (document.getElementById("secCode"))
				handleSeccodeChange(document.getElementById("secCode"));	
		image = document.getElementById("imgBatch");
		image.src = "static/images/icons/icon_unchecked_grey.gif";
	}
	if(obj[instCodeId].crDrFlag =='B')
	{
		$('#crDrDiv').show();
		$('#divBoth').show();
	}
	else if(obj[instCodeId].crDrFlag =='D')
	{
		$('#crDrDiv').hide();
	}else
	{
		$('#crDrDiv').hide();
	}
	if(obj[instCodeId].reversalFlag =='Y'){
		$('#divReversal').show();
	}else{
		$('#divReversal').hide();
	}
	if(obj[instCodeId].prenoteFlag =='Y'){
		$('#divPrenote').show();
	}else{
		$('#divPrenote').hide();
	}
	if(obj[instCodeId].warehouseFlag =='Y'){
		$('#divWareHouse').show();
	}else{
		$('#divWareHouse').hide();
	}
	if(obj[instCodeId].txnProcessingFlag =='Y'){
		$('#txnHandOffDiv').show(); 
	}else{
		$('#txnHandOffDiv').hide();
	}
	if(obj[instCodeId].allowTargetBalFlag =='Y'){
		$('#targetBalTypeDiv').show(); 
	}else{
		$('#targetBalTypeDiv').hide();
	}
	if(obj[instCodeId].instrumentType =='E'||obj[instCodeId].instrumentType =='I')
	{
		
		$('.divElex').show();
		$('.divPhy').hide();
		/*if(instCodeId =='06')
		{
			$('#chargeTypeDiv').hide();
		}*/
		if(obj[instCodeId].cashFlag === 'Y')
		{
			$('#divBankCodes').hide();
		}
		if('Y'==document.getElementById("notVerifyBankCodesFlag").value)
		{
			$('#divBankRepairFlag').hide();
		}
		else
		{
			$('#divBankRepairFlag').show();
		}
		
	}else if(obj[instCodeId].instrumentType =='P')
	{ 
		$('.divPhy').show();
		$('.divElex').hide();
	}
	if(obj[instCodeId].bankToBankInfo == 'N')
	{
		$('#banktoBankInfoDIV1').hide();
		$('#banktoBankInfoDIV2').hide();
	}
	else
	{
		$('#banktoBankInfoDIV1').show();
		$('#banktoBankInfoDIV2').show();
	}
	
	if(obj[instCodeId].paymentDetailsInfo === 'N')
	{
		$('#paymentMethodDIV').hide();
		$('#destinationTemplateDIV').hide();
		$('#sendingNumberDIV').hide();
		
	}
	else
	{
		$('#paymentMethodDIV').show();
		$('#destinationTemplateDIV').show();
		$('#sendingNumberDIV').show();
		
	}
	}
	if(instCodeId == '07' || instCodeId == '01' || instCodeId == '02'){
		$('.phyParameters').show();
		
	}else{
		$('.phyParameters').hide();
		
	}
	
}
