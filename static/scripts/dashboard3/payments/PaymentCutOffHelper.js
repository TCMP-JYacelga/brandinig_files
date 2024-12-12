PaymentCutOffHelper = {};


PaymentCutOffHelper.takeCutOffTranAction = function(cutOffInst,index, productList,flipFlag, widgetId) {
	if(cutOffInst.instruments.length > index )
	{	
		if(PaymentHelper.countdownTimerVal > 0)
			PaymentCutOffHelper.showCutOffPopup(cutOffInst,index, productList, flipFlag);
	}
	else if(PaymentHelper.countdownTimerVal > 0)
	{
		// when no instrument is pending to take action and timer is still running, clear it out.
		clearTimeout(countdown);
		PaymentHelper.isCutOff=  false;
		widgetMap[widgetId].api.refresh();
	}
	else
	{	// when cutoff times has expired and cutoff popup action not taken or not yet completed
		PaymentHelper.isCutOff=  false;
		// to close all popup windows if any open. for example of reject action, reject Remark
		widgetMap[widgetId].api.refresh();
	}
},
PaymentCutOffHelper.showCutOffTimer = function(countdown_number) {
	let inLabel = "in " ;
	let colen = ":";
		
	mins = Math.floor(countdown_number / 60);
	let sec = countdown_number % 60;
	if (mins <= 9) {
		mins = "0" + mins;
	}
	if (sec <= 9) {
		sec = "0" + sec;
	}
	if (mins < 1) {
		mins = "00";
	}
	
	if (countdown_number > 0) {
		countdown_number--;
		PaymentHelper.countdownTimerVal = countdown_number;
		if (countdown_number > 0) {
			countdown = setTimeout(function() {
			$("#timePartDisplay").text(getDashLabel('popup.fxPopupDisclaimer') + ' ' + inLabel + mins
					+ colen + sec);
			$("#timePartInfoIcon").addClass('fa fa-info-circle');
			PaymentCutOffHelper.showCutOffTimer(countdown_number);	
			}, 1000);
		} else {
			$('#payaction_fxPopup').modal('hide');
			clearTimeout(countdown);
		}
	}			
}
PaymentCutOffHelper.showCutOffPopup = function(cutOffInst,index, productList,flipFlag){
	
	let me = this,records = [];
	let paymentFxInfo = cutOffInst.instruments[index].paymentFxInfo;
	let strAction = cutOffInst.instruments[index].strAction;
	let widgetId = cutOffInst.instruments[index].widgetId;
	let record = cutOffInst.instruments[index].record;
	let errorCode = cutOffInst.instruments[index].errorCode;
	
//	let groupView = me.getGroupView();
	let fxRateVal = paymentFxInfo.fxInfoRate;
	records.push(record);
	
	if (typeof fxRateVal == "undefined") {
		fxRateVal = '';
	}
	
	if(FXCNTRGET == 'Y' && !CommonUtility.isEmpty(paymentFxInfo.debitCurrency)  && 
			!CommonUtility.isEmpty(paymentFxInfo.paymentCurrency) && paymentFxInfo.debitCurrency !=  paymentFxInfo.paymentCurrency )
	{
		let fxRateRef = document.getElementById("fxRateInfo");
		fxRateRef.innerHTML = fxRateVal;
		fxRateRef.setAttribute('title', fxRateVal);
		$('#fxRateInfoDiv').removeClass('d-none');
		$('#timePartDiv').removeClass('d-none');
		$('#debitAmtDiv').removeClass('d-none');
		
	}
	else
	{
		$('#fxRateInfoDiv').addClass('d-none');
		$('#timePartDiv').addClass('d-none');
		$('#debitAmtDiv').addClass('d-none');
	}
	// on popup render by default first remove the text already present for timer part along with info icon.
	$("#timePartDisplay").text('');
	$("#timePartInfoIcon").removeClass('fa fa-info-circle');
	
	let debitAmntVal = paymentFxInfo.debitAmount;
	
	if (typeof debitAmntVal == "undefined") {
		debitAmntVal = '';
	}
	
	$('#payaction_fxPopup').modal({backdrop: 'static', keyboard: false});
	commonStringFormatting();
	$('#fxPopupClose').unbind('click');
	$('#fxPopupClose').bind('click', function() {
		//groupView.setLoading(false);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});
	$('#cancelFxBtn').unbind('click');
	$('#cancelFxBtn').bind('click', function() {
		//groupView.setLoading(false);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});
	$('#okFxBtn').unbind('click');
	$('#okFxBtn').bind('click', function() {
		PaymentHelper.doHandleGroupActions(strAction, widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});
	$('#discardBtnNoRollover').unbind('click');
	$('#discardBtnNoRollover').bind('click', function() {
		PaymentHelper.doHandleGroupActions('discard', widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});
	$('#discardBtnForWARN').unbind('click');
	$('#discardBtnForWARN').bind('click', function() {
		PaymentHelper.doHandleGroupActions('discard', widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});		
	$('#discardBtn').unbind('click');
	$('#discardBtn').bind('click', function() {
		PaymentHelper.doHandleGroupActions('discard', widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});
	$('#discardPopupBtn').unbind('click');
	$('#discardPopupBtn').bind('click', function() {
		PaymentHelper.doHandleGroupActions('discard', widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});
	$('#rolloverBtn').unbind('click');
	$('#rolloverBtn').bind('click', function() {
		PaymentHelper.doHandleGroupActions(strAction, widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});
	$('#rolloverBtnForWARN').unbind('click');
	$('#rolloverBtnForWARN').bind('click', function() {
		PaymentHelper.doHandleGroupActions(strAction, widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});		
	$('#rejectBtn').unbind('click');
	$('#rejectBtn').bind('click', function() {
		PaymentHelper.doHandleGroupActions('reject', widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});
	$('#rejectPopupBtn').unbind('click');
	$('#rejectPopupBtn').bind('click', function() {
		PaymentHelper.doHandleGroupActions('reject', widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
		PaymentCutOffHelper.takeCutOffTranAction(cutOffInst,index+1,productList,flipFlag,widgetId);
	});
	
	$('#flipBtnForWARNBtn').unbind('click');
	$('#flipBtnForWARNBtn').bind('click', function() {
		//clearTimeout(countdown);
		let field = $('#flipList');
		$('#flipProductList').removeClass('d-none');
		if(null == productList)
		{
			$('#productErrorDiv').removeClass('d-none');
			$('#productListDiv').addClass('d-none');
			$('#breachedProductListDiv').addClass('d-none'); 
			$('#productListselectDiv').addClass('d-none');				
		}
		else{
			$("#productListselectDiv").empty();
			PaymentCutOffHelper.createFlipView(productList);
		}
	});
	$('#flipNRBtn').unbind('click');
	$('#flipNRBtn').bind('click', function() {
		clearTimeout(countdown);
		let field = $('#flipList');
		$('#flipProductList').removeClass('d-none');
		if(null == productList)
		{
			$('#productErrorDiv').removeClass('d-none');
			$('#productListDiv').addClass('d-none');
			$('#breachedProductListDiv').addClass('d-none');
			$('#productListselectDiv').addClass('d-none');
			$('#cancelFlipButonsUl').removeClass('d-none');
			$('#FlipButonsUl').addClass('d-none');
			
		}
		else{
			$("#productListselectDiv").empty();
			PaymentCutOffHelper.createFlipView(productList);
		}			
	});
	
	$('#flipPopupBtn').unbind('click');
	$('#flipPopupBtn').bind('click', function() {
		clearTimeout(countdown);
		let field = $('#flipList');
		$('#flipProductList').removeClass('d-none');
		if(null == productList)
		{
			$('#productErrorDiv').removeClass('d-none');
			$('#productListDiv').addClass('d-none');
			$('#breachedProductListDiv').addClass('d-none');
			$('#productListselectDiv').addClass('d-none');
			$('#cancelFlipButonsUl').removeClass('d-none');
			$('#FlipButonsUl').addClass('d-none');
			
		}
		else{
			$("#productListselectDiv").empty();
			PaymentCutOffHelper.createFlipView(productList);
		}			
	});
	
	$('#discardFlipBtn').unbind('click');
	$('#discardFlipBtn').bind('click', function() {
		clearTimeout(countdown);
		PaymentHelper.doHandleGroupActions('discard', widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
	});
	$('#rejectFlipBtn').unbind('click');
	$('#rejectFlipBtn').bind('click', function() {
		clearTimeout(countdown);
		PaymentHelper.doHandleGroupActions('reject', widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
	});
	$('#rolloverFlipBtn').unbind('click');
	$('#rolloverFlipBtn').bind('click', function() {
		clearTimeout(countdown);
		PaymentHelper.doHandleGroupActions(strAction, widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#payaction_fxPopup').modal('hide');
	});		
	
	$('#okFlipBtn').unbind('click');
	$('#okFlipBtn').bind('click', function() {
					
		let newproductmap = PaymentCutOffHelper.getNewProductMap();
		if(newproductmap == ""){
			$('#messageContentDivFlip').removeClass('d-none');
			$('#messageAreaFlip').empty().removeClass('d-none').append("Please select flip product for all products or take other cut off action.")
			return false;
		}	
		clearTimeout(countdown);
		flipProduct = newproductmap;
		PaymentHelper.doHandleGroupActions(strAction, widgetId, records, 'rowAction',
				paymentFxInfo.encryptedFxInfo);
		$('#flipProductList').addClass('d-none');
		$('#payaction_fxPopup').modal('hide');
	});
	$('#flipBtn').unbind('click');
	$('#flipBtn').bind('click', function() {
		//clearTimeout(countdown);
		$('#flipProductList').removeClass('d-none');
		if(null == productList)
		{
			$('#productErrorDiv').removeClass('d-none');
			$('#productListDiv').addClass('d-none');
			$('#breachedProductListDiv').addClass('d-none');
			$('#productListselectDiv').addClass('d-none');
			$('#cancelFlipButonsUl').removeClass('d-none');
			$('#FlipButonsUl').addClass('d-none');
		}
		else{
			$("#productListselectDiv").empty();
			PaymentCutOffHelper.createFlipView(productList);
		}
		
	});
	
	if ('auth' === strAction
			&& (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER' || errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER')) {
		$('#cutoffAuthRLButtonsUl').removeClass('d-none');
		$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl, #cutoffAuthRLFPButtonsUl')
				.addClass('d-none');
	} else if ('auth' === strAction
			&& (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD' || errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD')) {
		$('#cutoffAuthNRButtonsUl').removeClass('d-none');
		$('#cutoffAuthRLButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl, #cutoffAuthRLFPButtonsUl')
				.addClass('d-none');
	} else if (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER'
			|| errorCode == 'SHOWPOPUP,FX,CUTOFF,ROLLOVER') {
		$('#cutoffRLButtonsUl').removeClass('d-none');
		$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl, #cutoffAuthRLFPButtonsUl')
				.addClass('d-none');
	} else if (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD'
			|| errorCode == 'SHOWPOPUP,FX,CUTOFF,DISCARD') {
		$('#cutoffNRButtonsUl').removeClass('d-none');
		$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#fxButonsUl,cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl, #cutoffAuthRLFPButtonsUl')
				.addClass('d-none');
	} else if ('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER,FLIP' || errorCode == 'SHOWPOPUP,CUTOFF,FX,ROLLOVER,FLIP')  ) {
		$('#cutoffAuthRLFPButtonsUl').removeClass('d-none');
		$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLButtonsUl,#cutoffRLFlipButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl')
				.addClass('d-none');
	}
	else if('auth' === strAction && (errorCode == 'SHOWPOPUP,CUTOFF,DISCARD,FLIP' || errorCode == 'SHOWPOPUP,CUTOFF,FX,DISCARD,FLIP')  ) {
		$('#cutoffAuthNRFlipButtonsUl').removeClass('d-none');
		$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,#cutoffAuthRLButtonsUl,#cutoffAuthRLFPButtonsUl')
				.addClass('d-none');
	}
	else if (errorCode == 'SHOWPOPUP,CUTOFF,ROLLOVER,FLIP' || errorCode == 'SHOWPOPUP,CUTOFF,FX,ROLLOVER,FLIP') {
		$('#cutoffRLFlipButtonsUl').removeClass('d-none');
		$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,cutoffAuthRLButtonsUl,#cutoffAuthRLFPButtonsUl, #cutoffNRFlipButtonsUl, #cutoffAuthNRFlipButtonsUl')
				.addClass('d-none');
	}
	else if(errorCode == 'SHOWPOPUP,CUTOFF,DISCARD,FLIP' || errorCode == 'SHOWPOPUP,CUTOFF,FX,DISCARD,FLIP' ) {
		$('#cutoffNRFlipButtonsUl').removeClass('d-none');
		$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl,#cutoffAuthRLButtonsUl,#cutoffAuthRLFPButtonsUl,#cutoffRLFlipButtonsUl, #cutoffAuthNRFlipButtonsUl')
				.addClass('d-none');
	}
	else if (errorCode == 'SHOWPOPUP,FX') {
		$('#fxButonsUl').removeClass('d-none');
		$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#cutoffAuthRLFPButtonsUl')
				.addClass('d-none');
	}
	if (errorCode.indexOf('FX') != -1 && errorCode.indexOf('CUTOFF') != -1) {
		$('#disclaimerTextcutoffFXDivView').removeClass('d-none');
		$('#disclaimerTextcutoffDivView, #disclaimerTextFXDivView')
				.addClass('d-none');
		$('#fxDiscalimer').removeClass('d-none');
	} else if (errorCode.indexOf('CUTOFF') != -1) {
		$('#disclaimerTextcutoffDivView').removeClass('d-none');
		$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
				.addClass('d-none');
		$('#fxDiscalimer').addClass('d-none');
	}
	else if (errorCode.indexOf('WARN') != -1 && 'Y' == flipFlag && 'submit' != strAction) {
		$('#disclaimerTextcutoffDivView').removeClass('d-none');
		$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
				.addClass('d-none');
		$('#fxDiscalimer').addClass('d-none');
		$('#cutoffAuthRLFPButtonsUl').addClass('d-none');
		$('#cutoffRLFlipButtonsUl').removeClass('d-none');			
	}	
	else if (errorCode.indexOf('WARN') != -1) {
		$('#disclaimerTextcutoffDivView').removeClass('d-none');
		$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
				.addClass('d-none');
		$('#fxDiscalimer').addClass('d-none');
		$('#cutoffRLButtonsUl').removeClass('d-none');
		$('#cutoffAuthRLButtonsUl,#cutoffAuthNRButtonsUl,#cutoffNRButtonsUl,#fxButonsUl')
		.addClass('d-none');
	}	
	else if (errorCode.indexOf('GD0002') != -1 && 'Y' == flipFlag) {
		$('#disclaimerTextcutoffDivView').removeClass('d-none');
		$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
				.addClass('d-none');
		$('#fxDiscalimer').addClass('d-none');
		$('#cutoffNRFlipButtonsUl').removeClass('d-none');
	}	
	else if (errorCode.indexOf('GD0002') != -1) {
		$('#disclaimerTextcutoffDivView').removeClass('d-none');
		$('#disclaimerTextcutoffFXDivView, #disclaimerTextFXDivView')
				.addClass('d-none');
		$('#fxDiscalimer').addClass('d-none');
		$('#cutoffNRButtonsUl').removeClass('d-none');
		$('#cutoffAuthNRButtonsUl,#cutoffRLButtonsUl,#cutoffNRButtonsUl,#fxButonsUl')
		.addClass('d-none');
	}		
	else if (errorCode.indexOf('FX') != -1) {
		$('#disclaimerTextFXDivView').removeClass('d-none');
		$('#disclaimerTextcutoffDivView, #disclaimerTextcutoffFXDivView')
				.addClass('d-none');
		$('#fxDiscalimer').removeClass('d-none');
	}
	let confidentialFlag = paymentFxInfo.confidentialFlag;
	let formattedAmtValue = paymentFxInfo.formattedAmtValue;
	if(confidentialFlag == 'Y')
	{
		
		let debitAmtRef = document.getElementById("debitAmt");
		debitAmtRef.innerHTML = formattedAmtValue;
		let debitCcyRef = document.getElementById("debitCcy");
		debitCcyRef.innerHTML = "";
		debitAmtRef.setAttribute('title', debitAmntVal);
		debitCcyRef.setAttribute('title', debitAmntVal);
		let paymentAmtRef = document.getElementById("paymentAmt");
		paymentAmtRef.innerHTML = formattedAmtValue;
		let paymentCcyRef = document.getElementById("paymentCcy");
		if (typeof paymentFxInfo.paymentCurrency == "undefined") {
			paymentFxInfo.paymentCurrency = '';
		}
		paymentCcyRef.innerHTML = "";
		paymentAmtRef.setAttribute('title', paymentFxInfo.paymentAmount);
		paymentCcyRef.setAttribute('title', paymentFxInfo.paymentAmount);
		}
	else
	{
		let debitAmtRef = document.getElementById("debitAmt");
		debitAmtRef.innerHTML = debitAmntVal;
		let debitCcyRef = document.getElementById("debitCcy");
		debitCcyRef.innerHTML = paymentFxInfo.debitCurrency;
		debitAmtRef.setAttribute('title', debitAmntVal+' '+paymentFxInfo.debitCurrency);
		debitCcyRef.setAttribute('title', debitAmntVal+' '+paymentFxInfo.debitCurrency);
		let paymentAmtRef = document.getElementById("paymentAmt");
		paymentAmtRef.innerHTML = paymentFxInfo.paymentAmount;
		let paymentCcyRef = document.getElementById("paymentCcy");
		paymentCcyRef.innerHTML = paymentFxInfo.paymentCurrency;
		paymentAmtRef.setAttribute('title', paymentFxInfo.paymentAmount+' '+paymentFxInfo.paymentCurrency);
		paymentCcyRef.setAttribute('title', paymentFxInfo.paymentAmount+' '+paymentFxInfo.paymentCurrency);
	}
	let valueDateRef = document.getElementById("valueDate");
	valueDateRef.innerHTML = paymentFxInfo.valueDate;
	let paymentRef = document.getElementById("paymentRef");
	if (typeof paymentFxInfo.paymentRef == "undefined")	
	{
		paymentRef.innerHTML = '';
	}
	else
	{
		paymentRef.innerHTML = paymentFxInfo.paymentRef;
	}
	paymentRef.setAttribute('title', paymentRef.innerHTML);		
}
PaymentCutOffHelper.createFlipView = function (productList){
	var rows = 1;
	for(m in productList){
		
		 var select = $("<select></select>").attr("id", "flipList"+rows).attr("name",  "flipList"+rows)
		 .attr("cssClass", "w15_7 rounded ux_no-margin")
		 .attr("class", "nice-select form-control jq-nice-select")
		 .attr("maxlength","40");
		 select.append($("<option></option>").attr("value", "").text("Select Product").attr("selected", "true"));
		 for(var i=0; i<productList[m].length;i++){
			var newProduct = productList[m][i];
			var optionValue =newProduct.substring(0,newProduct.indexOf(":"));
			var optionText = newProduct.substring(eval(newProduct.indexOf(":")+1));
			if(!isEmpty($.trim(newProduct))){
				select.append($("<option></option>").attr("value", optionValue).text(optionText));
			}
		}
		var divBreached = $("<div>"+m.substring(m.indexOf("-")+1)+"</div>").attr("class", "col-sm-3 form-group");
		select.attr("oldproduct" ,  m.substring(0, m.indexOf("-")))
		var divNew = $("<div></div>").attr("class", "col-sm-3 ").append(select);
		var flipRowDiv = $("<div></div").attr("class", "row form-group").append(divBreached).append(divNew);
		
		$("#productListselectDiv").append(flipRowDiv);
		rows++;
	}
}
PaymentCutOffHelper.getNewProductMap = function(){
	
	var newProductMap = {};
	var newProductSelectlist = $("select[id^='flipList']");
	for(var i=0; i<newProductSelectlist.size();i++){
		if($(newProductSelectlist[i]).attr("value") != undefined && $(newProductSelectlist[i]).attr("value") !="" ){
			newProductMap[$(newProductSelectlist[i]).attr("oldproduct")] = $(newProductSelectlist[i]).attr("value");
		}else{
			newProductMap = "";
			break;
		}
	}
	
	return newProductMap;
}