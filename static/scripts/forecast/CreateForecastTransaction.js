var arrFrequency = new Array({
			key : "D",
			value : "Daily"
		}, {
			key : "W",
			value : "Weekly"
		}, {
			key : "M",
			value : "Monthly"
		});

var strRefWeekDay = new Array("('Sunday',1)", "('Monday',2)", "('Tuesday',3)",
		"('Wednesday',4)", "('Thursday',5)", "('Friday',6)", "('Saturday',7)");
var arrPeriodWeek = new Array("('1-Weekly',1)", "('2-Fortnightly',2)", "('3-Every 3rd Week',3)", "('4-Every 4th Week',4)");		
var arrMonthlyPeriod = new Array("('1-Monthly',1)", "('2-Every 2nd Month',2)",
		"('3-Quarterly',3)", "('4-Every 4th Month',4)",
		"('5-Every 5th Month',5)", "('6-Semi Annually',6)",
		"('7-Every 7th Month',7)", "('8-Every 8th Month',8)",
		"('9-Every 9th Month',9)", "('10-Every 10th Month',10)",
		"('11-Every 11th Month',11)", "('12-Annually',12)");
var arrRefMonth = new Array("('1',1)", "('2',2)", "('3',3)", "('4',4)",
		"('5',5)", "('6',6)", "('7',7)", "('8',8)", "('9',9)", "('10',10)",
		"('11',11)", "('12',12)", "('13',13)", "('14',14)", "('15',15)",
		"('16',16)", "('17',17)", "('18',18)", "('19',19)", "('20',20)",
		"('21',21)", "('22',22)", "('23',23)", "('24',24)", "('25',25)",
		"('26',26)", "('27',27)", "('28',28)", "('29',29)", "('30',30)",
		"('31',31)");
var arrDailyPeriod = new Array("('1-Everyday',1)", "('2-Every 2nd Day',2)",
		"('3-Every 3rd Day',3)", "('4-Every 4th Day',4)",
		"('5-Every 5th Day',5)", "('6-Every 6th Day',6)",
		"('7-Every 7th Day',7)");
var strRefDay = new Array("('N/A',1)");
var strRefSpecificDay = new Array("('Sunday',1)", "('Monday',2)", "('Tuesday',3)",
		"('Wednesday',4)", "('Thursday',5)", "('Friday',6)", "('Saturday',7)");
var periodWeeklyJson = new Array({

});
function initializeForecastInitiation(){
	$("input:radio[name=forecastType]:first").attr('checked', true);
	handleClientDropDown();
	$('#forecastPackageSearch').keyup(function() {
		var prodPackageData=fetchProduct();
		handlePopulateForecastPackage(prodPackageData);
	});
}

function initializationForCreateForecast(){
	initializeRecurringFrequencySection();
	populateForecastAccountsDropdown();
}


function handleClientDropDown(){
	
	var objClient = $('#clientNameDropdown');
	var stUrl = 'services/userseek/foreuserclients.json';
	 
	 objClient.empty();
		    
	 $.ajax({
	    	type : 'POST',
	        url: stUrl,
	        data : {
				$sellerCode : strSeller,
				$top:-1
			},
	        success: function(data) {
	            if(!isEmpty(data)){
	            	data = data.d.preferences;
	            	if(strEntityType === '1'){
		            	opt = $('<option/>',{
		            		value: '',
	        				text: 'Select'
		            	});
		            	opt.appendTo(objClient);
	            	}
	            	$.each(data, function(index, cfg) {
	            		opt = $('<option />', {
	        				value: cfg.CODE,
	        				text: cfg.DESCR
	        			});
	        			opt.appendTo(objClient);
	            	});
	            	
	            	if(!isEmpty(selectedClient))
	            		objClient.val(selectedClient);
	            	
	            	objClient.niceSelect('update');
	            	
	            	if(strEntityType === '0') {
	                 	$("#corporationDiv").show();
	                }
	            	else if(strEntityType === '1' && data.length > 1){
	            		$("#corporationDiv").show();
	            	}
	            	else if(strEntityType === '1' && data.length == 1 || data.length == 0){
	            		$("#corporationDiv").hide();
	            	}
	            }
	        }
	    });
}


function createButton(btnKey, charIsPrimary) {
	var strCls = charIsPrimary === 'P'
			? 'ft-button canDisable ft-button-primary ft-margin-l'
			: (charIsPrimary === 'L' ? 'ft-btn-link canDisable ' : 'ft-button canDisable ft-button-light');
			
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'tabindex':1,
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'value' : mapLbl[btnKey]
			});
	return elt;
}


function handleCreateForecastNext(){
	var strUrl = "",form = "";
	var objProdData = null;
	strUrl = "forecastDetailsEntry.form";
	var objProdSelected = getSelectedProdPackage();
	if(!isEmpty(objProdSelected))
		objProdData = $.parseJSON(objProdSelected.attr('productPackageData'));
	form = document.createElement('FORM');
    form.name = 'frmMain';
    form.id = 'frmMain';
    form.method = 'POST';
    form.action = strUrl;
	if (strEntityType === "1")
		selectedClient = $("#clientNameDropdown").val();
	form.appendChild(createFormField('INPUT', 'HIDDEN',
	        csrfTokenName, tokenValue));
	if (!Ext.isEmpty(selectedClient)) {
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'clientCode',
	            selectedClient));
	}
	if (!Ext.isEmpty(forecastType)) {
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'allowRepititive',
	            forecastType));
	}
	if(!isEmpty(objProdData)){
	    	productCode=objProdData.productCode;
	    	if(!Ext.isEmpty(productCode))
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'productCode',productCode));
	}
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

function goToCenterPage(){
	
	var strUrl = "",form = "";
	
	strUrl = "forecastTranscationCenter.srvc";
	
	form = document.createElement('FORM');
    form.name = 'frmMain';
    form.id = 'frmMain';
    form.method = 'POST';
    form.action = strUrl;
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}

function paintForecastEntryActionButtons(){

	$('#forecastHdrActionButtonListLB,#forecastHdrActionButtonListRB').empty();
	var strBtnLeft = '#forecastHdrActionButtonListLB' , strBtnRight = "#forecastHdrActionButtonListRB";
	
	var btnBack = null , btnDiscard = null, btnClose = null, btnCancel= null , btnVerify = null;
	
	//back button 
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function(){
		if(strPageMode === 'ADD'){
			goToPage('forecastInitiation.form', 'frmMain');
		}else if(strPageMode === 'EDIT'){
			goToPage('forecastTranscationCenter.srvc', 'frmMain');
		}
	});
	btnBack.appendTo($(strBtnLeft));
	
	//discard button
	btnDiscard = createButton('btnDiscard', 'L');
	btnDiscard.click(function() {
		getDiscardConfirmationPopup();
	});
	if(requestState != '3')
	btnDiscard.appendTo($(strBtnLeft));
	
	btnVerify = createButton('btnVerify' , 'P');
	btnVerify.click(function(){
		if(strPageMode === "ADD"){
			calculateForecastAmount();
			goToPage('saveForecastTransaction.form', 'frmMain');
		}else if(strPageMode === "EDIT"){
			calculateForecastAmount();
			goToPage('updateForecastTransaction.form', 'frmMain');
		}
		
	});
	btnVerify.appendTo($(strBtnRight));
	
}

function paintForecastViewActionButtons(){
	
	$('#forecastViewActionButtonListLB,#forecastViewActionButtonListRB').empty();
	var strBtnLeft = '#forecastViewActionButtonListLB' , strBtnRight = "#forecastViewActionButtonListRB";
	
	var btnBack = null , btnClose = null, btnSubmit= null , btnApprove = null , btnReject = null , btnDiscard = null , buttonType="";
	
	//back button 
	btnBack = createButton('btnBack', 'S');
	btnBack.click(function(){
		goToPage('editForecastTransaction.form', 'frmMain');
	});
	
	if(strPageMode === 'VIEW'){
		buttonType = 'S';
	}else if(strPageMode === 'VERIFY'){
		buttonType = 'L';
	}
	//close button
	btnClose = createButton('btnClose', buttonType);
	btnClose.click(function() {
		goToCenterPage();
	});
	
	//submit button
	btnSubmit = createButton('btnSubmit' , 'P');
	btnSubmit.click(function(){
		if(!isEmpty(parentRecordKey) && (requestState == 1 || requestState == 3)){
			getModifySubsequentTransactionsConfirmationPopup();
		}else{
			submitForecastTransaction('N');
		}
	});
	
	//Approve button
	btnApprove = createButton('btnApprove' , 'P');
	btnApprove.click(function(){
		var msg = ""; 
		var arrayJson = new Array();
		arrayJson.push({
			serialNo : 1,
			identifier : indentifier,
			userMessage : ''
		});
		
		$.ajax({
			url : "services/cff/auth",
			type : 'POST',
			contentType : "application/json",
			data : JSON.stringify(arrayJson),
			success :function(data){
				var result = data[0];
				var isSuccess = data[0].success;
				var msg="";
				if(isSuccess == 'N')
				{
						Ext.each(result.errors, function(error) {
							msg = msg + error.code + ' : ' + error.errorMessage;
							errCode = error.code;
							});
						var arrActionMsg = [];
						 arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							actionMessage : msg,
							reference : forecastReference
						});
						 getRecentActionResult(arrActionMsg);
				}else{
					goToPage('forecastTranscationCenter.srvc','frmMain');
				}
			},
			error : function(data){
			}
		});
	});
	
	//reject button
	btnReject = createButton('btnReject' , 'P');
	btnReject.click(function(){
		getRejectPopup();
	});
	
	//discard button
	btnDiscard = createButton('btnDiscard' , 'L');
	btnDiscard.click(function(){
		getDiscardConfirmationPopup();
	});
	
	if(strPageMode === 'VERIFY'){
		btnBack.appendTo($(strBtnLeft));
		btnClose.appendTo($(strBtnLeft));
		btnSubmit.appendTo($(strBtnRight));
		
	}else if(strPageMode === 'VIEW'){
		
		
		btnClose.appendTo($(strBtnLeft));
		
		if((requestState == 0 && isSubmitted !== 'Y' && isValid === 'Y' )|| 
		   ((requestState == 7 || requestState == 8 || requestState == 9)&&(isSubmitted === 'Y' && isValid === 'Y' )) || 
		   (requestState == 10 && isSubmitted === 'Y' && isValid === 'N' )){
			
			btnDiscard.appendTo($(strBtnLeft));
		}
		
		//approve and reject
		if((((requestState == 0 || requestState == 1  ||requestState == 4 ) && (isSubmitted === 'Y' && isValid === 'Y')) || 
		   (requestState == 5 && isSubmitted === 'Y' && isValid === 'N' )) && (userCode != makerCode)){
				
				btnReject.appendTo($(strBtnRight));	
				btnApprove.appendTo($(strBtnRight));
				
			}
			
		//submit on view
		if((requestState == 0||requestState == 1) && (isSubmitted !== 'Y' && isValid === 'Y')){
			btnSubmit.appendTo($(strBtnRight));
		}
		
	}
}

function getDiscardConfirmationPopup() {
	var objDialog = $('#discardConfirmationPopup');
	objDialog.dialog({
				autoOpen : false,
				modal : true,
				resizable : false,
				draggable : false,
				width : "320px",
				buttons : {
					"Ok" : function() {
						var arrayJson = new Array();
						arrayJson.push({
						serialNo : 1,
						identifier : identifier,
						userMessage : ''
						});
						$.ajax({
								url : "services/cff/discard",
								type : 'POST',
								contentType : "application/json",
								data : JSON.stringify(arrayJson),
								success :function(data){
									goToPage('forecastTranscationCenter.srvc','frmMain');
								},
								error : function(data){
								}
						});
						$(this).dialog("close");
						
						//goToPage('discardForecastTransaction.form','frmMain');
					},
					Cancel : function() {
						$(this).dialog('destroy');
					}
				}
			});
	objDialog.dialog('open');
	objDialog.dialog('option', 'position', 'center');
};

function getModifySubsequentTransactionsConfirmationPopup() {
	var objDialog = $('#recurringTransactionsConfirmationPopup');
	objDialog.dialog({
				autoOpen : false,
				modal : true,
				resizable : false,
				draggable : false,
				width : 540,
				title : "Message",
				buttons : {
					"Ok" : function() {
						$(this).dialog("close");
						var flag = $('input[name=modifySubsequent]:checked').val();
						$('#modifySubsequentForecasts').val(flag);
						submitForecastTransaction(flag);
					},
					Cancel : function() {
						$(this).dialog('destroy');
					}
				}
			});
	objDialog.dialog('open');
	objDialog.dialog('option', 'position', 'center');
};


function populateForecastFrequencyField() {
	$("#forecastFrequency").empty();
	for (var i = 0; i < arrFrequency.length; i++) {
			$('#forecastFrequency').append($("<option />")
					.val(arrFrequency[i].key).text(arrFrequency[i].value));
	}
	$("#forecastFrequency option:first").attr('selected','selected');
	$('#forecastFrequency').val(frequencyCode);
	$("#forecastFrequency").niceSelect('update');
	
	populatePeriodAndRefrenceDay();
}

function getForecastSelectionMode(){
	 var objForecastSelectionMode='';
	 objForecastSelectionMode =  $("input[type='radio'][name='forecastType']:checked").val(); 
	 return objForecastSelectionMode;
}

function getSelectedForecastPackage(){
	var objSelectedForecastPackage;
	$('#forecastPackageDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedForecastPackage = $(this);
			return false;
		}
	});
	return objSelectedForecastPackage;
}

function handleForecastPackageClear(){
	 var objForecastPackageSelected = getSelectedForecastPackage();
	 $('#forecastPackageSearch').val('');
	 var prodPackageData=fetchProduct();
	 handlePopulateForecastPackage(prodPackageData); //used to populate forecast packages
	 handleNextButtonVisiblity(true);
}

function handleNextButtonVisiblity(isDisabled){
	var objNextButton = $("#btnCreateForecastNext");
	if(isDisabled === true){
		objNextButton.prop('disabled',true);
	}
	else if(isDisabled === false){
		objNextButton.prop('disabled',false);
	}
}

function populatePeriodAndRefrenceDay(){

	var frequency="" ,period="", referenceDay="", i, intDay, intMonth, intclear, intPeriod, strPostFix = '', strfreqArrStart = '0', clsHide = 'hidden';
	var weeklyOfDays = [];
	
	if (isEmpty(frequency))
		frequency = $("#forecastFrequency").val();

	if (isEmpty(period))
		period = $("#period").val();

	if (isEmpty(referenceDay))
		referenceDay = $("#refrenceDay").val();	
	
	if(!isEmpty(frequency)){
		$("#period").empty();
		$("#refrenceDay").empty();
	}else
	{
		return false;
	}
	
	if (frequency == "W") {
		
		for (var i = 0; i < arrPeriodWeek.length; i++) {
			eval("document.getElementById('period').options[i]=" + "new Option" + arrPeriodWeek[i]);
			if (parseInt(i,10) + 1 == period) {
				$('#period option:eq(' + i + ')').attr(
						'selected', true);
			}
		}
		
		var flag = false;
		var eleId = 'refrenceDay';
		for (var i = 0; i < strRefWeekDay.length; i++) {
			flag = false;
			if (jQuery.inArray('' + i, weeklyOfDays) != -1)
				flag = true;
			if (flag === true)
				continue;
			else if (flag === false) {
				var ele = document.getElementById('refrenceDay');
				eval("document.getElementById('refrenceDay').options[" + ele.options.length + "]="
						+ "new Option" + strRefWeekDay[i]);
			}
		}
		$("#" + eleId + " option").each(function() {
					if ($(this).val() === referenceDay)
						$(this).attr('selected', true);
				});
		
		$("#period").val(period);
		$('#periodDiv').removeClass(clsHide);
		$('#refrenceDayDiv').removeClass(clsHide);
		$('#specificDayDiv').addClass(clsHide);
		$('#period').val(forecastPeriod);
		$('#refrenceDay').val(forecastReferenceDay);
		$("#period").niceSelect('update');
		$("#refrenceDay").niceSelect('update');
		
	}else{
		intPeriod = 7;
		if(frequency == "M"){
			
			intPeriod = arrMonthlyPeriod.length;
			for (var i = 0; i < intPeriod; i++) {
				eval("document.getElementById('period').options[i]=" + "new Option" + arrMonthlyPeriod[i]);
				if (parseInt(i,10) + 1 == period) {
					$('#period option:eq(' + i + ')').attr(
							'selected', true);
				}
			}
			
			for (var i = 0; i < arrRefMonth.length; i++) {
				eval("document.getElementById('refrenceDay').options[i]=" + "new Option" + arrRefMonth[i]);
			}
			$("#" + eleId + " option").each(function() {
				if ($(this).val() === referenceDay)
					$(this).attr('selected', true);
			});
			
			$("#period").val(period);
			$('#periodDiv').removeClass(clsHide);
			$('#refrenceDayDiv').removeClass(clsHide);
			$('#specificDayDiv').addClass(clsHide);
			$('#period').val(forecastPeriod);
			$('#refrenceDay').val(forecastReferenceDay);
			$("#period").niceSelect('update');
			$("#refrenceDay").niceSelect('update');
			
		}else if(frequency == "D"){
			
			for (var i = 0; i < intPeriod; i++) {
				eval("document.getElementById('period').options[i]=" + "new Option" + arrDailyPeriod[i]);
				if (parseInt(i,10) + 1 == period) {
					$('#period option:eq(' + i + ')').attr(
							'selected', true);
				}
			}
			for (var i = 0; i < strRefDay.length; i++) {
				eval("document.getElementById('refrenceDay').options[i]=" + "new Option" + strRefDay[i]);
				if (parseInt(i,10) + 1 == referenceDay) {
					$('#refDay option:eq(' + i + ')').attr(
							'selected', true);
				}
			}
			
			$("#period").val(period);
			$('#periodDiv').removeClass(clsHide);
			$('#refrenceDayDiv').addClass(clsHide);
			$('#specificDayDiv').addClass(clsHide);
			$('#period').val(forecastPeriod);
			$('#refrenceDay').val(forecastReferenceDay);
			$("#period").niceSelect('update');
			$("#refrenceDay").niceSelect('update');
			
		}
	}
	
}

function initializeRecurringFrequencySection(){
		
	populateForecastFrequencyField();
}

var accountNumberData = {};
function populateForecastAccountsDropdown(){
		
		var objAccountNumber = $('#accountNumber');
		var accountNumberVal = $('#glId').val();
		var strUrl = "";
		
		if(strEntityType === "1"){
			strUrl = "forecastTransactionEntryAccountSeek.json";
		}else if(strEntityType === "0"){
			strUrl = "forecastTransactionEntryAccountSeekAdmin.json";
		}
	 	
		$.ajax({
	    	type : 'POST',
	        url: "services/userseek/"+strUrl,
	        data : {
	       	$filtercode1 : strClientCode,
				$filtercode2 : strUserCategory,
				$top:-1
			},
	        success: function(data) {
	            if(!isEmpty(data)){
	            	data = data.d.preferences;
	            	accountNumberData = data;
		            	opt = $('<option/>',{
		            		value: '',
	        				text: 'Select'
		            	});
		            	opt.appendTo(objAccountNumber);
	            	$.each(data, function(index, cfg) {
	            		opt = $('<option />', {
	        				value: cfg.ACCOUNT_NUMBER,
	        				text: cfg.ACCOUNT_NUMBER +' | '+cfg.ACCOUNT_NAME
	        			});
	        			opt.appendTo(objAccountNumber);
	            	});
	            	if(!isEmpty(accountNumberVal) && null != accountNumberVal){
	            		objAccountNumber.val(accountNumberVal);
	            	}
	            	objAccountNumber.editablecombobox('refresh');
	           }
	        }
	    });
	}

function fetchProduct() {
 	var selectedClientID=selectedClient;
	if(!isMultipleClientFlag){
		if(selectedClientID === 'all'){
			selectedClientID = '';
		}
	}
	if (strEntityType === "0")
		var clientDesc = $("#clientNameDropdown").val();
	if (strEntityType === "1")
		var clientDesc = $("#clientNameDropdown").val();
	var strUrl = 'services/forecastMyProducts.json';
			+ '.json';
	if (clientDesc != null && clientDesc != 'all' && (!isEmpty(clientDesc)) )
		selectedClientID = clientDesc;
	//if (!isEmpty(selectedClientID))
		strUrl += '?$client=' + selectedClientID;
	if(forecastType != null){
		strUrl += '&$forecastType=' + forecastType;
	}
	var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = {}, arrMatches, strGeneratedUrl;
		while (arrMatches = strRegex.exec(strUrl)) {
			objParam[arrMatches[1]] = arrMatches[2];
		}
		strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
	strGeneratedUrl = !isEmpty(strGeneratedUrl)
			? strGeneratedUrl
			: strUrl;
    var responseData = null;
    $.ajax({
    	type : 'POST',
        url: strGeneratedUrl,
        data : objParam,
        async: false,
        success: function(data) {
            responseData = data;
			if(isEmpty(responseData)){
				responseData = [];
			}
        }
    });
    return responseData;
}

function handlePopulateForecastPackage(packageData)
{
	var arrData=packageData,objList,objUl,objLi,objAnchor;
	var searchTerm=$('#forecastPackageSearch').val().toUpperCase();
	var objDiv='forecast-package-list';
	if(searchTerm){
		    	arrData = arrData.filter(function(val) {
		        	var myProductDescription = val.productDesc.toUpperCase();
					return myProductDescription.indexOf(searchTerm)>-1;
				});
		 }
	if(!isEmpty(arrData)){
	objList = $("#"+objDiv);
	objList.empty();
	objDiv = $('<div>').attr({
	    'id' : 'forecastPackageDiv',
	    'class' : ''
	 });
	objUl = $('<ul>').attr({
	    				'class' : ''
	    			});	
	objUl.appendTo(objDiv);
	objDiv.appendTo(objList);
	if(!isEmpty(arrData) && arrData.length > 0){
	    $.each(arrData, function(index, cfg) {
	    		objLi = $('<li>').attr({
	    			'productPackageData' : cfg
	    			});
		    		hasTaxAgency = true;
		    		objAnchor = $('<a>').attr({
		    						'productPackageData' : JSON.stringify(cfg),
		    						'productCode' :cfg.productCode,
									'productDesc' : cfg.productDesc,
		    						'allowRepititive':cfg.allowRepititive})
		    						.html('<span class="">'+ cfg.productDesc+'</span>')
		    						.on('click',function(){
		    							if(!$(this).hasClass('selected-dropdown')){
			    							handleVisualIndication('forecastPackageDiv',this);
			    							var strProductPkgDesc = cfg.productDesc; 
			    							if(!isEmpty(strProductPkgDesc))
			    								$('#forecastPackageSearch').val(strProductPkgDesc);
					    					handleNextButtonVisiblity(false);
		    							}
		    						}).appendTo(objLi);
	    		objLi.appendTo(objUl);
	    	});
	    }
	    else{
	    	paintNoDataMsg($("#forecast-package-list"),'prodPackageListDiv');
	    }
	}
	else{
		paintNoDataMsg($("#forecast-package-list"),'prodPackageListDiv');
	}
	
}

function paintNoDataMsg(listId,divId){
		var objList,objUl,objDiv,objLi,objAnchor;
		objList = listId
		objList.empty();
		objDiv = $('<div>').attr({
			'id' : divId
		 });
		 objUl = $('<ul>').attr({
				'class' : ''
			});	
		 objUl.appendTo(objDiv);
		 objDiv.appendTo(objList);
		 objLi= $('<li>');
		 objAnchor = $('<span>').attr({'class' : 'ft-padding'}).html('No Data Present').appendTo(objLi);
		 objLi.appendTo(objUl);
	}
	
	 function handleVisualIndication(div,selectedAnchor){
		 var objDiv = $('#'+div);
		 objDiv.find('a').each(function(){ $(this).removeClass('selected-dropdown') });
		 if(!isEmpty(selectedAnchor) && selectedAnchor !== null)
			 $(selectedAnchor).addClass('selected-dropdown');
	}
	
	function fetchProductsOnClientSelection(){
		$('#forecastPackageSearch').val('');
		var prodPackageData=fetchProduct();
		handlePopulateForecastPackage(prodPackageData);
	}
	function handleForecastSelectionDisplay(productType)
	{
		forecastType = productType;
		$('#forecastPackageSearch').val('');
		var prodPackageData=fetchProduct();
		handlePopulateForecastPackage(prodPackageData);
		handleNextButtonVisiblity(true);
	}
	
	 function getSelectedProdPackage(){
		var objSelectedPayCat;
		$('#forecastPackageDiv').find('li a').each(function(){
			if($(this).hasClass('selected-dropdown')){
				objSelectedPayCat = $(this);
				return false;
			}
		});
		return objSelectedPayCat;
	}
	
	jQuery.fn.companyAutoComplete = function() {
	var stUrl = 'services/userseek/foreuserclients.json';
	return this.each(function() {
				$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : stUrl,
									dataType : "json",
									type : 'POST',
									data : {
										top : -1,
										$autofilter : request.term
									},
									success : function(data) {
										var clientData = data.d.preferences;
										if(isEmpty(clientData) || (isEmpty(data.d)) || clientData.length === 0)
            		              	    {
										var rec = [{
												label:'No match found.',
												value: ""
		       	    		            	}];
										response($.map(rec, function(item) {
										return {
											label : item.label,  
											value : item.value
											}
										}));
        	        		    
            		                 }
            		                else{
            		                	var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DESCR,
														record : item
													}
												}));
            		                
            		                }
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var rec = ui.item.record;
						$('#forecastPackageSearch').val('');
						$('#company').val(rec.CODE);
						selectedClient = rec.CODE;
						var prodPackageData=fetchProduct();
						handlePopulateForecastPackage(prodPackageData);
						handleNextButtonVisiblity(true);
					},
					change : function(event, ui) {

					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>'
							+ item.label + '</ul></ol></a>';
					return $("<li></li>").data("item.autocomplete", item)
							.append(inner_html).appendTo(ul);
				};*/
			});
	
};
	function goToPage(strUrl, frmID)
	{
		var frm = document.forms["frmMain"];
		enableDisableForm(false);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	
	function enableDisableForm(boolVal) {
		$('input').removeAttr("disabled");
		$('select').removeAttr("disabled");
		$('#expectation').removeAttr("disabled");
		$('#startDate').removeAttr("disabled");
		$('#endDate').removeAttr("disabled");
	}
	
	
	function updateExpectation(forecastType){
	var selectedForecastType = forecastType.value;
	
	if(!isEmpty(arrOfExpectations) && !isEmpty(selectedForecastType)){
		for(var i = 0 ;i < arrOfExpectations.length ; i++){
			if(arrOfExpectations[i].forecastType == selectedForecastType && !isEmpty(arrOfExpectations[i].expectationPercentage)){
				$('#expectation').val(arrOfExpectations[i].expectationPercentage);
				calculateForecastAmount();
				if(arrOfExpectations[i].editableFlag != 'Y'){
					$('#expectation').attr('disabled','disabled');
				}else{
					$('#expectation').removeAttr('disabled');
				}
			}
		}
	}else {
		$('#expectation').autoNumeric('set',0);
		calculateForecastAmount();
	}
}
	
function calculateForecastAmount(){
	
	var transactionAmount = parseFloatingPointNumbers($('#transactionAmount').val());
	var expectation = (parseFloatingPointNumbers($('#expectation').val()))/100;
	var settledAmount = parseFloatingPointNumbers($('#settledAmount').val());
	var forecastAmount = strPlaceHolder;
	
	if((!checkEmptyAndNull(transactionAmount) && !checkEmptyAndNull(expectation))){
		
		forecastAmount = (transactionAmount*expectation) - settledAmount;
		if(forecastAmount < 0){
			$('#forecastAmount').autoNumeric('set',0);
		}else{
			$('#forecastAmount').autoNumeric('set',forecastAmount);
		}
		
	}else{
		$('#forecastAmount').autoNumeric('set',0);
	}
}

function checkEmptyAndNull(value){
	if(isEmpty(value) || null === value || value <= 0.00 || isNaN(value)){
		return true;
	}else{
		return false;
	}
}

function validateTransactionAmount(){
	var transactionAmount = parseFloatingPointNumbers($('#transactionAmount').val());
	var settledAmount = parseFloatingPointNumbers($('#settledAmount').val());
	
	if(transactionAmount < settledAmount){
		$('#messageContentDiv').removeClass('hidden');
		$('#messageArea').html('<p>Transaction Amount should be greater than Settled Amount</p>');
	}else{
		$('#messageContentDiv').addClass('hidden');
	}
}

function parseFloatingPointNumbers(value){
	 if(value == null || value == ''){
		return 0;
	 }
	var temp = value.replace(/[^\d\.\-]/g, ""); 
	var floatingNumber = parseFloat(temp);
	return floatingNumber;
}
//showForecastTxnInfoPopup
function showForecastTxnInfoPopup() {
	$('#forecastTrasanctionInfoSectionDiv').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title : 'Transaction Information',
				open : function() {
					$('#forecastTrasanctionInfoSectionDiv').removeClass('hidden');
					$("#importedTxnDetailsInfoGrid").empty();
					var auditData = getForecastTxnInfo(identifier);
					paintForecastTxnInfo(auditData)
					
					if(null != auditData && auditData.history.length>0)
						paintForecastTransactionAuditInfoGrid(auditData.history, $(this));
					$('#forecastTrasanctionInfoSectionDiv').dialog('option','position','center'); 
				}
			});
	$('#forecastTrasanctionInfoSectionDiv').dialog("open");
	$('#forecastTrasanctionInfoSectionDiv').dialog('option','position','center');
}
//getForecastTxnInfo
function getForecastTxnInfo(strIdentifier) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = 'services/forecastTxnInfo/id.json';
		$.ajax({
					url : strUrl,
					type : 'POST',
					data :{'id': strIdentifier},
					async : false,
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
						}
					},
					success : function(data) {
						if (data && data.d)
							objResponseData = data.d;
					}
				});
	}
	return objResponseData;
}
//paintForecastTxnInfo
function paintForecastTxnInfo(data) {
	if (null != data){
		
		if(data.companyInfo)
		{
			var objInfo = data.companyInfo;
				var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
				strText += '<br/>'
						+ (!isEmpty(objInfo.companyAddress)
								? objInfo.companyAddress
								: '');
				$(".hdrCompanydetails_InfoSpan").html(strText); 
			
		}
		$(".hdrStatus_InfoSpan").text(data.status);
		$(".hdrForecastSource_InfoSpan").text(data.enteredBy);
		$(".hdrPackage_InfoSpan").text(cffProduct);
	}
}
//createAuditInfoGridStore
function createAuditInfoGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['userCode', 'logDate',
						'rejectRemarks',
						'statusDesc'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}
// paintForecastTransactionAuditInfoGrid
function paintForecastTransactionAuditInfoGrid(data, parent) {
	var renderToDiv = parent.find('#auditInfoGridDiv');
	var renderToDivId = '';
	if (!isEmpty(renderToDiv)) {
		renderToDivId = "auditInfoGridDiv";
	}
	if (!isEmpty(renderToDivId) && (typeof hideTxnInfoAuditSection === 'undefined' || !hideTxnInfoAuditSection)) {
		parent.find("#audit_InfoSpan").removeClass('hidden');
		$('#'+renderToDivId).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [{
						dataIndex : 'userCode',
						text : mapLbl['txnUser'],
						width : 150,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'logDate',
						text : mapLbl['txnDateTime'],
						width : 200,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'statusDesc',
						text : mapLbl['txnAction'],
						width : 150,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'rejectRemarks',
						text : mapLbl['txnRemarks'],
						flex : 1,
						draggable : false,
						resizable : false,
						hideable : false,
						sortable: false,
						renderer : this.getRejectRemarkTooltip
					}]
			//,			renderTo : renderToDivId
			});
		var layout = Ext.create('Ext.container.Container',{
			width: 'auto',
			items: [grid],
           renderTo: renderToDivId
		});
		auditGrid=layout;
		return layout;
	}
}

function getRejectRemarkTooltip(value, metaData) {
	var strRetVal = value;
	if(!Ext.isEmpty(strRetVal)) {
		metaData.tdAttr = 'title="' + strRetVal + '"';
	}
	return strRetVal;
}

function getRejectPopup()
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		bgiframe : true,
		resizable : false,
		width : 380,
		modal : true,
		draggable : false,
		buttons : {
				"OK" : function() {
					var userMessage = $('#txtAreaRejectRemark').val();
					var arrayJson = new Array();
					arrayJson.push({
						serialNo : 1,
						identifier : indentifier,
						userMessage : userMessage
					});
					$.ajax({
						url : "services/cff/reject",
						type : 'POST',
						contentType : "application/json",
						data : JSON.stringify(arrayJson),
						success : function(data){
							var result = data[0];
							var isSuccess = data[0].success;
							var msg="";
							if(isSuccess == 'N')
							{
									Ext.each(result.errors, function(error) {
										msg = msg + error.code + ' : ' + error.errorMessage;
										errCode = error.code;
										});
									var arrActionMsg = [];
									 arrActionMsg.push({
										success : result.success,
										actualSerailNo : result.serialNo,
										actionTaken : 'Y',
										actionMessage : msg,
										reference : forecastReference
									});
									 getRecentActionResult(arrActionMsg);
									 $('#rejectPopup').dialog("close");
							}else{
								$('#txtAreaRejectRemark').val('');
								goToPage('forecastTranscationCenter.srvc','frmMain');
							}
						},
						error : function(data){
						}
					});
				},
				"Cancel" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#rejectPopup').dialog("open");
}

function getRecentActionResult(record){
	if ($('#actionResultInfoDiv').children('.row').length > 0) {
		$('#actionResultInfoDiv').children('.row').remove();
	}
	var intSrNo = 0;
	for(var i=0;i<record.length;i++){
		intSrNo = record[i].actualSerailNo;
		$('#actionResultDiv').removeClass('ui-helper-hidden');
		//add a row
		var rowDiv=document.createElement('div');
		$(rowDiv).addClass('row form-control-static');
		var delimitor='&nbsp;'
		if(record[i].success==='N'){
		delimitor='<br/>';
		}
		if(record[i].reference == '' || record[i].reference == null){
			delimitor='';
		}
		var fontColor=getRecentActionResultFontColor(record[i]);
		$(rowDiv).append($('<p>',{
		'class':'col-sm-10 '+fontColor,
		id:'actionMsg'+intSrNo,
		style : 'margin-left : 5px',
		html :record[i].reference+delimitor+record[i].actionMessage
		}));
		//add row to main div
		$(rowDiv).appendTo('#actionResultInfoDiv');
	}
}

function getRecentActionResultFontColor(record){
	if(record.success==='Y'){
		return 'success_font';
	}
	else if (record.success === 'N')
		return 'error_font ';
}

function submitForecastTransaction(subsequentModificationFlag){
	var msg = ""; 
	var arrayJson = new Array();
	arrayJson.push({
		serialNo : 1,
		identifier : identifier,
		userMessage : subsequentModificationFlag
	});
	
	$.ajax({
		url : "services/cff/submit",
		type : 'POST',
		contentType : "application/json",
		data : JSON.stringify(arrayJson),
		success :function(data){
			var result = data[0];
			var isSuccess = data[0].success;
			var msg="";
			if(isSuccess == 'N')
			{
					Ext.each(result.errors, function(error) {
						msg = msg + error.code + ' : ' + error.errorMessage;
						errCode = error.code;
						});
					var arrActionMsg = [];
					 arrActionMsg.push({
						success : result.success,
						actualSerailNo : result.serialNo,
						actionTaken : 'Y',
						actionMessage : msg,
						reference : forecastReference
					});
					 getRecentActionResult(arrActionMsg);
			}else{
				goToPage('forecastTranscationCenter.srvc','frmMain');
			}
		},
		error : function(data){
		}
	});
}

function paintRecurringFrequencySection(frequencyCode,forecastPeriod,forecastReference){
	var periodArray=[];
	var refDayArray= [];
	//frequency Code
	if(!isEmpty(frequencyCode) && null != frequencyCode){
		for(var i=0; i<arrFrequency.length ; i++){
			if(arrFrequency[i].key === frequencyCode){
				$('#frequency').html(arrFrequency[i].value);
			}
		}
		
		//forecast period
		if('M' === frequencyCode){
			periodArray = arrMonthlyPeriod;
			refDayArray = arrRefMonth;
		}else if('D' === frequencyCode){
			periodArray = arrDailyPeriod;
			refDayArray = strRefDay;
		}else if('W' === frequencyCode){
			periodArray = arrPeriodWeek;
			refDayArray = strRefWeekDay
		}
		
		
		if(!isEmpty(forecastPeriod) && null != forecastPeriod){
			
		if(!isEmpty(forecastPeriod) && null != forecastPeriod){
			for(var i=0; i<periodArray.length ; i++){
				var x = eval("new Option" + periodArray[i]);
				if(x.value == forecastPeriod)
				{
					$('#period').html(x.label);
				}
				//if(periodArray[i]);
			}
				/*if(periodArray[i].key === frequencyCode){
					$('#frequency').html(periodArray[i].value);
				}*/
			}
		}
		
		//forecast reference
		if(!isEmpty(forecastReference) && null != forecastReference){
			for(var i=0; i<refDayArray.length ; i++){
				var x = eval("new Option" + refDayArray[i]);
				if(x.value == forecastReference)
				{
					$('#refrenceDay').html(x.label);
				}
				//if(periodArray[i]);
			}
			
		}
	}
	
	//forecast period
}

function populateCurrencyCode(){
		var accountNumber = $('#accountNumber').val();
		if(!isEmpty(accountNumber) && null !=accountNumber){
			if(!isEmpty(accountNumberData) && null!=accountNumberData){
				for(i=0 ; i<accountNumberData.length ;i++){
					if(accountNumber == accountNumberData[i].ACCOUNT_NUMBER){
						$('.currencyCode').text("("+accountNumberData[i].CCY_CODE+")");
						$('#forecastCurrencyCode').val(accountNumberData[i].CCY_CODE);
						$('#glId').val(accountNumberData[i].ACCOUNT_NUMBER);
					}
				}
			}
		}else{
			$('.currencyCode').text("");
			$('#forecastCurrencyCode').val("");
			$('#glId').val("");
		}
	 }