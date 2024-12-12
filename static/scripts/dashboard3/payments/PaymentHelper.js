var PaymentHelper = {};
PaymentHelper.action = {};
PaymentHelper.strCloneUrl = 'services/paymentsbatch/clone.json';
PaymentHelper.strCopyToTemplateUrl = 'services/paymentsbatch/copytotemplate.json';
PaymentHelper.strBatchActionUrl = 'services/paymentsbatch';
PaymentHelper.strValidateAmountUrl='services/paymentsbatch/validateAmount.json';

var objArgs = null;
var flipProduct = null;
var disableCutoffBtns;
PaymentHelper.countdownTimerVal = null,
PaymentHelper.tranInfoSection = false,
PaymentHelper.isCutOff = false // set true when cutoff instruments exist and set false once all cutOff popup action is taken or times goes off

PaymentHelper.setPaymentParams = function(record)
{
	objFormData = {};
	objFormData.strLayoutType = (record.layout != null && record.layout != '') ? record.layout
			: '';
	objFormData.strPaymentType = (record.paymentType != null && record.paymentType != '') ? record.paymentType
			: '';
	objFormData.strProduct = (record.productType != null && record.productType != '') ? record.productType
			: '';
	objFormData.strActionStatus = (record.actionStatus != null && record.actionStatus != '') ? record.actionStatus
			: '';
	objFormData.strPhdnumber = (record.phdnumber != null && record.phdnumber != '') ? record.phdnumber
			: '';
	objFormData.strPirMode = (record.pirMode != null && record.pirMode != '') ? record.pirMode
			: '';
	objFormData.viewState = record.identifier;
	objFormData.buttonIdentifier = record.buttonIdentifier;
	objFormData.txtBenefCode = record.systemBenefCode;
	return objFormData;
}
PaymentHelper.handleRecordAction = function(actionName, record, widgetId) {

	let _this = this;
	let strPmtType = record.paymentType;
	if ((strPmtType != 'QUICKPAY') && actionName === 'ACCEPT'
			&& record.authLevel == 0) {
		actionName = 'VIEW';
	}
	if (actionName === 'sweep')
	{
		PaymentHelper.action.sweepAction(actionName, widgetId, [record], 'rowAction');
	}
	else if (actionName === 'submit' || actionName === 'discard'
		|| actionName === 'verify' || actionName === 'auth'
		|| actionName === 'send' || actionName === 'hold' 
		|| actionName === 'release'	|| actionName === 'stop' 
		|| actionName === 'reversal' || actionName === 'reject') 
	{
		_this.doHandleGroupActions(actionName, widgetId, [record], 'rowAction');
	}
	else if (actionName === 'VIEWHISTORY') 
	{
		var recHistory = record.HistoryURL;
		console.log(record.HistoryURL);
	}
	else if (actionName === 'VIEW' || actionName === 'EDIT'
			|| actionName === 'CLONE' || actionName === 'CLONETEMPLATE') 
	{
		if (strPmtType != null && strPmtType != '') {
			let strUrl = '', objFormData = {};
			strUrl = _this.fetchServiceUrl(actionName, strPmtType);
			objFormData = _this.setPaymentParams(record);
			
			if ((strUrl != null && strUrl != '')
					&& (actionName === 'VIEW' || actionName === 'EDIT')) {
				_this.submitForm(strUrl, objFormData, actionName, widgetId);
			} else if (actionName === 'CLONE'
					|| actionName === 'CLONETEMPLATE') {
				let strActionUrl = actionName === 'CLONE' ? _this.strCloneUrl : _this.strCopyToTemplateUrl;
				_this.callAjax(strActionUrl, 'POST', objFormData, actionName, strUrl, widgetId, record);
			}
		}
	}
}
PaymentHelper.myCallbackFunction = function() {
	return;
}
PaymentHelper.action.approvalConfirmationPopup = function(strUrl, remark, widgetId,
		arrSelectedRecords, strActionType, strAction) {
	let _this = this;
	let flag = false;
	let localSelectedRecords = JSON.parse(JSON.stringify(arrSelectedRecords));
	
	$('#approvalVerify_errorDiv').empty();
	$('#payaction_approvalVerify').modal({backdrop: 'static', keyboard: false});  

	$.each(localSelectedRecords, function(index, cfg) { 
		if(cfg.recKeyCheck == 'Y'){
			flag = true;
		}
		cfg.amount = '0.00';
	});
	
//	flag = true;
	if(flag)
	{
		DatatableWithStaticData.createStaticDatatable('approvalVerificationGrid', 'approvalVerification', 
				PAYMENT_APPROVAL_VERIFICATION_COLUMN_MODEL, localSelectedRecords);
		var table = $('#datatable_approvalVerification').DataTable();
		table.MakeCellsEditable({ "columns": [3],"inputTypes": [{"column":3, "type":"amountBox"}],
			"onUpdate":PaymentHelper.myCallbackFunction() });	
		objArgs = [strUrl, remark, widgetId, localSelectedRecords,strActionType,strAction];
	}
	else
	{
		DatatableWithStaticData.createStaticDatatable('approvalVerificationGrid', 'approvalVerification', 
				PAYMENT_APPROVAL_VERIFICATION_COLUMN_MODEL, arrSelectedRecords);	
		objArgs = [strUrl, remark, widgetId, arrSelectedRecords,strActionType,strAction];
	}
	
	$('#payaction_approveSubmit').unbind('click');
	$('#payaction_approveSubmit').click(function(){
		
		if(dataTableDirtyBit == 1 || (flag && PaymentHelper.action.doAmountEmptyValidation(arrSelectedRecords)))
		{
			$( "#approvalVerify_errorDiv" ).empty();
			 $( "#approvalVerify_errorDiv" ).append('<label for="amount" style="color:red;">'+ 
					 getDashLabel('payments.amountRequired')+'</label>');
		}
		else
		{
			$('#payaction_approvalVerify').modal('hide');
			PaymentHelper.action.validateAmount(objArgs,widgetId,strUrl,strActionType,strAction);
		}
		
	});
}
PaymentHelper.action.doAmountEmptyValidation = function(arrSelectedRecords)
{
	let flag = false;
	let myTable = $("#datatable_approvalVerification").DataTable();
	if(myTable && myTable.rows() && myTable.rows().data())
		form_data= myTable.rows().data();
	if(form_data && form_data.length > 0)
	{
		$.each(arrSelectedRecords, function(index, cfg) 
		{
			if(cfg && (cfg.amount == null || cfg.amount == '' || parseFloat(cfg.amount) == 0))
			{
				flag = true;
			}
		});
	}
	return flag;
}

PaymentHelper.action.createAmountValidateRecList = function(arrSelectedRecords,arrAmountValidate,arrRecordsToApprove,arrValidateRecords)
{
	let form_data = null, strAmtValue = null;
	let isAmountEmpty = false;
	let myTable = $("#datatable_approvalVerification").DataTable();
	if(myTable && myTable.rows() && myTable.rows().data())
		form_data= myTable.rows().data();
	
	$.each(arrSelectedRecords, function(index, cfg) {
		if(cfg.recKeyCheck == 'Y'){
			strAmtValue = null;
			cfg.popupSerialNo = index+1;
			arrValidateRecords.push(cfg);	
			if(form_data)
			{
				let objGridRecordAmt = (form_data[index] && form_data[index].amount) ? form_data[index].amount : '';

				if(!CommonUtility.isEmpty(objGridRecordAmt)){
					let obj = $('<input type="text">');
					obj.autoNumeric('init');
					obj.val(objGridRecordAmt);
					strAmtValue = obj.autoNumeric('get');
					obj.remove();
				}
				if(!CommonUtility.isEmpty(strAmtValue))					
					arrAmountValidate.push(parseFloat(strAmtValue));
				else
					isAmountEmpty = true;					
	
			}else if (cfg.recKeyCheck == 'N'){
				arrRecordsToApprove.push(cfg);
			}
		}
	});	
	return isAmountEmpty;
}
PaymentHelper.action.createAmountValidateRecJSON = function(arrSelectedRecords,arrAmountValidate,arrRecordsToApprove,arrValidateRecords)
{
	let arrayJson = new Array();
	let records = (arrValidateRecords || []);
	for (let index = 0; index < records.length; index++) {
		arrayJson.push({
					serialNo :  index+1,//  summaryGrid.getStore().indexOf(records[index])+ 1,
					popupSerialNo : index+1, // records[index].popupSerialNo,
					identifier : records[index].identifier,
					userMessage : arrAmountValidate[index]
				});
	}
	if (arrayJson)
		arrayJson = arrayJson.sort(function(valA, valB) {
					return valA.serialNo - valB.serialNo
				});	
	return arrayJson;
}
PaymentHelper.action.validateAmountAjax = function(widgetId,arrRecordsToReject,arrSelectedRecords,arrRecordsToApprove,arrayJson,
		strUrl,strActionType, strAction)
{
	let arrResponse = [];
	$('#widget-body-'+widgetId).empty().html('<div class="loading-indicator"></div>');
	$.ajax({
		url : PaymentHelper.strValidateAmountUrl,
		type: 'POST',
		data : JSON.stringify(arrayJson),
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
	})
	.done(function(data, textStatus, jqXHR)        
	{
		let jsonRes = data;
		let srNos = '';
		let objRec = null;
		let text = '';
		let showRejectConf = false;
		if(jsonRes && jsonRes.d && jsonRes.d.instrumentActions)
		{
			arrResponse = jsonRes.d.instrumentActions;
			$.each(arrResponse, function(index, cfg) 
			{
				if(cfg.success == 'Y'){
//					objRec = summaryGrid.getStore().getAt(cfg.serialNo-1)
//					objRec.set('recKeyIdentifier',cfg.recKeyValidation);
//					objRec.commit();
					arrRecordsToApprove.push(arrSelectedRecords[cfg.serialNo-1]);
				}else if(cfg.success == 'N'){
					srNos+=cfg.popupSerialNo+',';
//					arrRecordsToReject.push(summaryGrid.getStore().getAt(cfg.serialNo-1));
					arrRecordsToReject.push(arrSelectedRecords[cfg.serialNo-1]);
					showRejectConf = true;
				}
			});
			objArgs[3] = arrRecordsToApprove;
			if(showRejectConf){
			//	showReckeyRejectConfirmationPopup(arrRecordsToReject,[objArgs],arrSelectedRecords,arrRecordsToApprove);
				$('.srNos').text(srNos.slice(0,-1));
				$('#payaction_amountValidationRejectPopup').modal({backdrop: 'static', keyboard: false});
				$('#payaction_rejectSubmit').unbind('click');
				$('#payaction_rejectSubmit').click(function(){
					
					if(arrResponse != null && arrResponse.length > 0 && arrResponse[0].errors &&
							arrResponse[0].errors.length > 0 && arrResponse[0].errors[0] && 
							arrResponse[0].errors[0].errorMessage)
						text = arrResponse[0].errors[0].errorMessage;
					$('#payaction_rejectRemark').modal('hide');
					PaymentHelper.preHandleGroupActions(PaymentHelper.strBatchActionUrl + '/reject.json', text, widgetId,
							arrSelectedRecords, strActionType,
							strAction);
				});
			}else{
				PaymentHelper.action.approvalConfirmed([objArgs]);
				//closeApprovalConfirmationPopup();
			}
		}		
	})
    .fail(function(jqXHR, textStatus, errorThrown) { 
		$('#payaction_webserviceFail').modal({backdrop: 'static', keyboard: false});
    })
    .always(function(jqXHROrData, textStatus, jqXHROrErrorThrown)
     { 
		$('#widget-body-'+widgetId).empty();
		widgetMap[widgetId].api.refresh();
     });
}
PaymentHelper.action.validateAmount = function(objArgs,widgetId,strUrl,strActionType, strAction){
	
	let arrValidateRecords= [],arrRecordsToReject= [],arrRecordsToApprove= [];
	let arrAmountValidate=[],strAmtValue='',objGridRecordAmt='';
	
	let showRejectConf = false, isAmountEmpty =false;
	let arrSelectedRecords = objArgs[3];
	
	isAmountEmpty = PaymentHelper.action.createAmountValidateRecList(arrSelectedRecords,arrAmountValidate,
			arrRecordsToApprove,arrValidateRecords);
	
	if(isAmountEmpty)
	{
		$('#payaction_amountRequired').modal({backdrop: 'static', keyboard: false});
	}
	else if (arrValidateRecords != null && arrValidateRecords.length > 0 &&
			  arrAmountValidate != null && arrValidateRecords.length == arrAmountValidate.length) {
		
		let arrayJson = PaymentHelper.action.createAmountValidateRecJSON(arrSelectedRecords,arrAmountValidate,arrRecordsToApprove,
				arrValidateRecords);
		PaymentHelper.action.validateAmountAjax(widgetId,arrRecordsToReject,arrSelectedRecords,arrRecordsToApprove,arrayJson,
				strUrl,strActionType, strAction);
	}
	else
	{
		PaymentHelper.action.approvalConfirmed(objArgs);
	}	
}
PaymentHelper.action.approvalConfirmed = function(objArgs) {
	let strUrl = objArgs[0];
	let remarks = objArgs[1];
	let widgetId = objArgs[2];
	let arrSelectedRecords = objArgs[3];
	let strActionType = objArgs[4];
	let strAction = objArgs[5];
	PaymentHelper.preHandleGroupActions(strUrl, remarks, widgetId, arrSelectedRecords,
			strActionType, strAction);	
}

PaymentHelper.preHandleGroupActions = function(strUrl, remark, widgetId, arrSelectedRecords,
		strActionType, strAction) {
	let _this = this;
	let counter = 1;
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : counter++,
							identifier : records[index].identifier,
							userMessage : remark,
							flipProduct : flipProduct,
							filterValue1 : (records[index].recKeyIdentifier) ? records[index].recKeyIdentifier : ''
						});
			}
//			if (arrayJson)
//				arrayJson = arrayJson.sort(function(valA, valB) {
//							return valA.serialNo - valB.serialNo
//						});
			if(strUrl.indexOf("?")>0)
				strUrl+="&"+csrfTokenName+"="+csrfTokenValue;
			else	
				strUrl+="?"+csrfTokenName+"="+csrfTokenValue;
			
			$('#widget-body-'+widgetId).empty().html('<div class="loading-indicator"></div>');
			$.ajax({
				   type : "POST",
				   url : strUrl,
				   data : JSON.stringify(arrayJson),
				   accept   : "application/json;charset=UTF-8",
				   contentType: "application/json;charset=UTF-8",
				   dataType : "json"
			})
			.done (function(res, textStatus, jqXHR) { 
				$('#widget-body-'+widgetId).empty();
//				me.tranInfoSection = true;
				PaymentHelper.postHandleGroupAction(res, widgetId,
						strActionType, strAction, records);
//				if (showRealTime === 'Y' && ('auth' === strAction
//						|| 'send' === strAction
//						|| 'submit' === strAction)) {
//					processRealTimePirs(jsonRes, strUrl,
//							strAction);
//				widgetMap[widgetId].api.refresh();
			})
			.fail (function(jqXHR, textStatus, errorThrown) { 
				$('#payaction_webserviceFail').modal({backdrop: 'static', keyboard: false});

			})
			.always (function(jqXHROrData, textStatus, jqXHROrErrorThrown) {
				$('#widget-body-'+widgetId).empty();
				widgetMap[widgetId].api.refresh();
			});
},
PaymentHelper.doHandleGroupActions =function(strAction, widgetId, arrSelectedRecords,
		strActionType, paymentFxInfo)
{
	let _this = this;
	let isRekeyVerificationApplicable = false;
	var strUrl = _this.strBatchActionUrl + '/' + strAction + '.json';
	$.each(arrSelectedRecords, function(index, cfg) {
		if(cfg && cfg.recKeyCheck && cfg.recKeyCheck == 'Y'){
				isRekeyVerificationApplicable = true;
				return false;
		}					
	});
	if (strAction === 'verify' || strAction === 'reject') {
		PaymentHelper.action.verifyReject(strAction, strUrl, widgetId,arrSelectedRecords, strActionType);
	} else if (strAction === 'submit' || strAction === 'auth' || strAction === 'send' ) {
			if (paymentFxInfo) {
				_this.preHandleGroupActions(strUrl, paymentFxInfo,
						widgetId, arrSelectedRecords,
							strActionType, strAction);
			} else {
				if (('Y' === _chrApprovalConfirmationAllowed || isRekeyVerificationApplicable)
						&& strAction === 'auth')
					_this.action.approvalConfirmationPopup(strUrl,
							'', widgetId, arrSelectedRecords,
							strActionType, strAction);
				else
					_this.preHandleGroupActions(strUrl, '', widgetId,
							arrSelectedRecords, strActionType,
							strAction);
			}

	} else if (strAction === 'reversal') {
		_this.action.reversal(strUrl, '', widgetId,
				arrSelectedRecords, strActionType, strAction);
	}else {
		_this.preHandleGroupActions(strUrl, '', widgetId, arrSelectedRecords,
				strActionType, strAction);
	}


}
PaymentHelper.postHandleGroupAction = function(jsonData, widgetId, strActionType, strAction, records)
{
	let actionData;
	if (jsonData && jsonData.d && jsonData.d.instrumentActions)
		actionData = jsonData.d.instrumentActions;
	
	PaymentHelper.processResultRecords(actionData, records, strAction, widgetId);
	
}
PaymentHelper.processResultErrors = function(result)
{
	let popup = 'N', productCutOff = 'N', flag = 'N', message = '',code = '',  products; 
	
	$.each(result.errors, function(index, error){
		message = message + error.code + ' : ' + error.errorMessage;
		code = error.code;
		if (!CommonUtility.isEmpty(code)	&& (code.substr(0, 4) === 'WARN' || code === 'GD0002'))
		{
			productCutOff = 'Y';
			popup = 'Y';
			 if(error.flag == 'Y')
				{ 
				 	flag = error.flag;
				 	products = error.productMap;
				 	if(!CommonUtility.isEmpty(error.disableCutoffBtn)){
				 		disableCutoffBtns = error.disableCutoffBtn;  
					  }
				}
		}
		if (code.indexOf('SHOWPOPUP') != -1) {
			popup = 'Y';
		}
		if("SHOWPOPUP,CUTOFF,ROLLOVER,FLIP" == code )
		{
			products = error.productMap;
			if(!CommonUtility.isEmpty(error.disableCutoffBtn)){
				disableCutoffBtns = error.disableCutoffBtn;  
			  }
		}
	});
	let resMap = new Map();
	resMap.set('showPopup',popup);
	resMap.set('strIsProductCutOff',productCutOff);
	resMap.set('productList',products);
	resMap.set('flipFlag',flag);
	resMap.set('msg',message);
	resMap.set('errCode',code);
	return resMap;
}

PaymentHelper.getActionMessageArray = function(strAction, errCode, result, msg, strIsProductCutOff, record)
{
	let arrActionMsg = [];
	let strActionSuccess = getDashLabel('payable.'+strAction);
	let warnLimit = getDashLabel('warningLimit')
	let strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';
	if (!CommonUtility.isEmpty(strAction)) {
		if (strAction === 'auth' || strAction === 'release') {
			if (!CommonUtility.isEmpty(errCode)
					&& errCode.substr(0, 4) === 'WARN') {
				strIsRollover = 'Y';
				strIsReject = 'Y';
				strIsDiscard = 'Y';
			} else if (!CommonUtility.isEmpty(errCode)
					&& errCode === 'GD0002') {
				strIsReject = 'Y';
				strIsDiscard = 'Y';
			}
		} else if (strAction === 'save' || strAction === 'submit'
				|| strAction === 'send') {
			if (!CommonUtility.isEmpty(errCode)
					&& errCode.substr(0, 4) === 'WARN') {
				strIsRollover = 'Y';
				strIsDiscard = 'Y';
			} else if (!CommonUtility.isEmpty(errCode)
					&& errCode === 'GD0002') {
				strIsDiscard = 'Y';
			}
		}
	}
	let strActionMessage = result.success === 'Y'
						? strActionSuccess
						: (result.success === 'W02'
								? warnLimit
								: msg);
	if(result.success === 'Y' && result.isWarning === 'Y'){
		strActionMessage += ' <p class="error_font">'+ msg + '</p>';
	}
	arrActionMsg.push({
		success : result.success,
		actualSerailNo : result.serialNo,
		isProductCutOff : strIsProductCutOff,
		isRollover : strIsRollover,
		isReject : strIsReject,
		isDiscard : strIsDiscard,
		actionTaken : 'Y',
		lastActionUrl : strAction,
		reference : CommonUtility.isEmpty(record) ? '' : record.clientReference,
		actionMessage :strActionMessage
	});	
	return arrActionMsg;
}
PaymentHelper.processResultRecords= function(actionData, records, strAction, widgetId)
{
	let strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N', flipFlag = 'N',productList;
	let msg = '', strIsProductCutOff = 'N', errCode = '', arrActionMsg = [];
	let record = '', row = null, intSerialNo, arrMsg, strActionMessage = '';
	var cutOffInst =   {"instruments":[]};
	
	$.each(actionData, function(index, result){
	//	intSerialNo = parseInt(result.serialNo,10);
	//	record = grid.getRecord(intSerialNo);
		record = records[index];
	//	row = grid.getRow(intSerialNo);
		msg = '';strIsProductCutOff = 'N';strIsRollover = 'N';strIsReject = 'N';strIsDiscard = 'N';	let showPopup = 'N';
		let resultMap = PaymentHelper.processResultErrors(result);
		
		showPopup = resultMap.get('showPopup');
		strIsProductCutOff = resultMap.get('strIsProductCutOff');
		productList = resultMap.get('productList');
		flipFlag = resultMap.get('flipFlag');
		msg = resultMap.get('msg');
		errCode = resultMap.get('errCode');

		if (showPopup === 'Y') {
			if (isNaN(_strFxTimer))
				_strFxTimer = 10;
			var countdown_number = 60 * _strFxTimer;
				cutOffInst.instruments.push({
					    "paymentFxInfo": result.paymentFxInfo,
					    "strAction":strAction,
					    "widgetId":widgetId,
					    "record" : record,
					    "errorCode" : errCode
					  });
		} else {
			
//		//	row = grid.getRow(intSerialNo);
//			me.handleVisualIndication(row, record, result,
//					strIsProductCutOff, true);
//			grid.deSelectRecord(record);
//			row = grid.getLockedGridRow(intSerialNo);
//			me.handleVisualIndication(row, record, result,
//					strIsProductCutOff, false);
			
			arrActionMsg = PaymentHelper.getActionMessageArray(strAction, errCode, result, msg,strIsProductCutOff,record);
		}
	});	
	if(cutOffInst && cutOffInst.instruments && cutOffInst.instruments.length > 0)
	{
		PaymentHelper.countdownTimerVal = null;
		PaymentHelper.isCutOff=  true;
		if (isNaN(_strFxTimer))
			fxTimer = 10;
		var countdown_number = 60 * _strFxTimer;
		PaymentHelper.countdownTimerVal = countdown_number;
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,0, productList,flipFlag, widgetId) 
		PaymentCutOffHelper.showCutOffTimer(PaymentHelper.countdownTimerVal);
	}
//	me.hideQuickFilter();
	objActionResult = {	'order' : []};
	arrMsg = (PaymentHelper.populateActionResult(arrActionMsg) || null);
	if (!CommonUtility.isEmpty(arrMsg)) {
		PaymentHelper.getRecentActionResult(arrMsg);
	}
//	groupView.handleGroupActionsVisibility(me.strDefaultMask);
//	groupView.setLoading(false);
	// refresh Grid here only when there is no cutoff popup else refresh after cutoff popup actions. check function takeCutOffTranAction below
//	if(!PaymentHelper.isCutOff)
//		setTimeout(function(){widgetMap[widgetId].api.refresh(); }, 2000); 
}
PaymentHelper.getRecentActionResult = function(records) {
    let intSrNo = 0;
    $("#toastSec").empty();

    for(let i=0;i<records.length;i++){
        intSrNo = records[i].actualSerailNo;
        let delimitor='-';
        let msg = getDashLabel('payments.referenceNo')+' : '+records[i].reference+delimitor+records[i].actionMessage;
        let toastMsgDiv =  CommonUtility.createToast(records[i].success==='N' ? 'Error' : 'Information', msg , 
        		records[i].success==='N' ? 'error' : 'check_circle', '5000', i+1);
        $("#toastSec").append(toastMsgDiv);
        CommonUtility.showToast(toastMsgDiv.id);
    }    
}
PaymentHelper.populateActionResult = function(arrActionMsg) {
	var me = this, arrResult = [];
	if (!CommonUtility.isEmpty(objActionResult)) {
		$.each((arrActionMsg || []), function(index, cfgMsg){
			if (!objActionResult.order.indexOf(cfgMsg.actualSerailNo) ==-1)
				objActionResult.order.push(cfgMsg.actualSerailNo);
			objActionResult[cfgMsg.actualSerailNo] = JSON.parse(JSON.stringify(cfgMsg));			
		});

		$.each((objActionResult.order || []), function(key) {
			if (objActionResult.order[key]) {
				arrResult.push(objActionResult[objActionResult.order[key]]);
			}
		});
	}
	return arrResult;
},

PaymentHelper.callAjax = function(url, method, objFormData, actionName, strUrl, widgetId, record)
{
	let _this = this;
	let jsonPost = [ {
		serialNo : 1,
		identifier : objFormData.viewState,
		userMessage : ''
	} ];
	
	$('#widget-body-'+widgetId).empty().html('<div class="loading-indicator"></div>');
	$.ajax({
		url : url,
		type: method,
		data : JSON.stringify(jsonPost),
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
	})
	.done(function(data, textStatus, jqXHR)        
			{  
				if (data && data.d && data.d.instrumentActions) 
				{
					let result = data.d.instrumentActions[0];
					if (result) {
						if (result.success === 'Y') {
							objFormData.viewState = result.identifier;
							objFormData.strCloneAction = 'Y'
							_this.submitForm(strUrl, objFormData, actionName, widgetId);
						} else if (result.success === 'N') 
						{
	//						me.tranInfoSection = true;
							PaymentHelper.postHandleGroupAction(
									data, widgetId,
									'rowAction',
									actionName, record);
						}
					}
			
				}
			})
    .fail(function(jqXHR, textStatus, errorThrown) { 
		$('#payaction_webserviceFail').modal({backdrop: 'static', keyboard: false});
    })
    .always(function(jqXHROrData, textStatus, jqXHROrErrorThrown)
     { 
		$('#widget-body-'+widgetId).empty();
		widgetMap[widgetId].api.refresh();
     });
}
PaymentHelper.fetchServiceUrl = function(actionName, strPmtType) {
	if (actionName === 'VIEW' && strPmtType === 'QUICKPAY')
		return 'viewPayment.form';
	else if ((strPmtType === 'BB' || strPmtType === 'RR')
			&& actionName === 'EDIT')
		return 'editMultiPayment.form';
	else if ((strPmtType === 'BB' || strPmtType === 'RR')
			&& actionName === 'VIEW')
		return 'viewMultiPayment.form';
	else if (actionName === 'EDIT' && strPmtType === 'QUICKPAY')
		return 'editPayment.form';
	else if (actionName === 'CLONE' && strPmtType === 'QUICKPAY')
		return 'editPayment.form';
	else if ((strPmtType === 'BB' || strPmtType === 'RR')
			&& actionName === 'CLONE')
		return 'editMultiPayment.form';
	else if (actionName === 'CLONETEMPLATE' && strPmtType === 'QUICKPAY')
		return 'editTemplate.form';
	else if (actionName === 'CLONETEMPLATE'
			&& (strPmtType === 'BB' || strPmtType === 'RR'))
		return 'editMultiTemplate.form';
}
PaymentHelper.submitForm = function(strUrl, formData, actionName, widgetId) {
	var me = this;
	var form = null;
	
	$('#widget-body-'+widgetId).empty().html('<div class="loading-indicator"></div>');
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', csrfTokenName,
			csrfTokenValue));

	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtLayout',
			formData.strLayoutType));

	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
			formData.viewState));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtProduct',
			formData.strProduct));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtPaymentType',
			formData.strPaymentType));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtActionStaus',
			formData.strActionStatus));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber',
			formData.strPhdnumber));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN',
			'buttonIdentifier', formData.buttonIdentifier));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtPirMode',
			formData.strPirMode));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtBenefCode',
			formData.txtBenefCode));

	var paymentType = 'PAYMENT';
	if (strUrl != null && strUrl != ''
			&& strUrl.toLowerCase().indexOf('template') != -1) {
		paymentType = 'TEMPLATE';
	}
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtEntryType',
			paymentType));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'actionName',
			actionName));
	form.appendChild(this.createFormField('INPUT', 'HIDDEN', 'txtCloneAction',
			formData.strCloneAction || 'N'));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

PaymentHelper.createFormField = function(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}


PaymentHelper.action.reversal = function(strUrl, remark, widgetId,
		arrSelectedRecords, strActionType, strAction)
{
	$('#payaction_reversal').modal({backdrop: 'static', keyboard: false});
	$('#payaction_reversalOk').unbind('click');
	$('#payaction_reversalOk').click(function(){
		$('#payaction_reversal').modal('hide');
		PaymentHelper.preHandleGroupActions(strUrl, remark, widgetId,
				arrSelectedRecords, strActionType,
				strAction);
	});
}
PaymentHelper.action.verifyReject = function(strAction, strUrl, widgetId,arrSelectedRecords, strActionType)
{
	$('#'+strAction+'Remark').val('');
	$('#'+strAction+'Remark').parent().find('#rejectRemark-error').remove();
	$('#payaction_'+strAction+'Remark').modal({backdrop: 'static', keyboard: false});
	$('#payaction_'+strAction+'RemarkSubmit').unbind('click');
	$('#payaction_'+strAction+'RemarkSubmit').click(function(){
		let text = $('#'+strAction+'Remark').val();
		if(text && text.length > 0)
		{
			$('#payaction_'+strAction+'Remark').modal('hide');
			let text = $('#'+strAction+'Remark').val();
			PaymentHelper.preHandleGroupActions(strUrl, text, widgetId,
					arrSelectedRecords, strActionType,
					strAction);			
		}
		else
		{
			$('#'+strAction+'Remark').parent().find('#rejectRemark-error').remove();
			$('#'+strAction+'Remark').parent().append('<label id="rejectRemark-error" class="error" for="rejectRemark">'
					 +getDashLabel('popup.requiredField')+'</label>')
		}
	});
	$('#rejectRemark').blur(function(){
		let text = $('#rejectRemark').val();
		if(text != null && text.length == 0)
		{
			let text = $('#'+strAction+'Remark').val();
			$('#'+strAction+'Remark').parent().find('#rejectRemark-error').remove();
			$('#'+strAction+'Remark').parent().append('<label id="rejectRemark-error" class="error" for="rejectRemark">'
					 +getDashLabel('popup.requiredField')+'</label>')		
		}
	});
}

PaymentHelper.action.sweepAction = function (strAction, strUrl, widgetId,arrSelectedRecords, strActionType)
{
	if ($('#popoverContent').length === 0) {
		$('body').append('<div id="popoverContent"> </div>');
		return;
	}

	$.get('./static/scripts/dashboard3/payments/Popover.html?d=' + (new Date().getUTCMilliseconds()), function(data) {
		$('#popoverContent').html(data);
		$('#paymentDetailsPopover').html($('#paymentDetails').html());
		$('#tranInfoPopup').modal({
			keyboard: true
		});
		$('#tranInfoPopup').modal('show');
		//PaymentHelper.paySweepDialog.dialog( "open" );

	})
	
	
	return;

//	options = { "data-content":"Disabled popover" };
//	$('#example').popover(options);	
}



PaymentHelper.action.sweepAction = function (strAction, strUrl, widgetId,arrSelectedRecords, strActionType)
{
	if ($('#popoverContent').length === 0) {
		$('body').append('<div id="popoverContent"> </div>');
		return;
	}

	$.get('./static/scripts/dashboard3/payments/Popover.html?d=' + (new Date().getUTCMilliseconds()), function(data) {
		$('#popoverContent').html(data);
		$('#paymentDetailsPopover').html($('#paymentDetails').html());
		$('#tranInfoPopup').modal({
			keyboard: true
		});
		$('#tranInfoPopup').modal('show');
		//PaymentHelper.paySweepDialog.dialog( "open" );

	})
	
	
	return;

//	options = { "data-content":"Disabled popover" };
//	$('#example').popover(options);	
}


