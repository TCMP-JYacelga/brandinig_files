function initializationForCreatePayment(){
	 $('#payTypeSearch').keyup(function() {
		 handlePaymentPackage();
	});
	 
	 $('#payCatSearch').keyup(function() {
		 handlePaymentCategoryPopulation();
	});
	
	 $('#payTempSearch').keyup(function() {
		 handlePaymentTemplate();
	});
	 
	 $('#paySysBeneCatSearch').keyup(function() {
		 handlePaySystemBene();
	});
	 
	 $('#payReceiverSearch').keyup(function() {
		 handlePaymentReceiver();
	});
	 
	 $('#billUnpaidSearch').keyup(function() {
		 handleUnpaidBills();
	});
	 
	 if(strEntityType === '1')
	 handleClientDropDown();
	 
	 if(strEntryType ==="TEMPLATE" || strEntryType ==="SI"){
		 $('#templateOpt').remove();
		 $("input:radio[name=createPayment]:first").attr('checked', true);
		 handleReceiverEnforcement();
	 }
	 
	 if(strEntryType ==="PAYMENT"){
		 if(!template){
			 $('#templateOpt').remove();
			 $("input:radio[name=createPayment]:first").attr('checked', true);
			 handleReceiverEnforcement();
		 }
	
		 if(canShowPayUsingTemplate){
				$('#freeFormOpt').hide();
				$('#receiverOpt').hide();
		 }
		 else{
			   $('#freeFormOpt').show();
			   $('#receiverOpt').show();
			   handleReceiverEnforcement();
			 }
	 }
	 
	var objPaySelectionMode = getPaymentSelectionMode();
	if(!isEmpty(objPaySelectionMode))
		handlePaymentSelectionDisplay(objPaySelectionMode);
}

function handleReceiverEnforcement(){
	if(isReceiverAllow === 'N'){
		 $('#receiverOpt').remove();
	 }
	 else if(isReceiverAllow === 'Y'){
		 if(paymentType === 'single' || paymentType === 'createPay'){
			 $('#receiverOpt').show();
		 }
		 else if(paymentType === 'multi'){
			 $('#receiverOpt').hide();
		 }
	 }
}

function handleClientDropDown(){
	var objClient = $('#clientDescAutoCompleter');
	var stUrl = 'services/userseek/payuser.json?$top=-1',opt=null,PmtType = 'PYB';
	 
	 objClient.empty();
	 if (paymentType == 'single')
		 PmtType = 'SNGP';
	 else if (paymentType == 'multi')
	    	PmtType = 'BP';
	    
	 $.ajax({
	    	type : 'POST',
	        url: stUrl,
	        data: {
                $filtercode1: PmtType
            },
	        success: function(data) {
	            if(!isEmpty(data)){
	            	data = data.d.preferences;
	            	$.each(data, function(index, cfg) {
	            		opt = $('<option />', {
	        				value: cfg.CODE,
	        				text: cfg.DESCR
	        			});
	        			opt.appendTo(objClient);
	            	});
	            	
	            	 objClient.niceSelect()
	            	 
	            	if(!isEmpty(selectedClient)){
	            		$("#clientDescAutoCompleter").val(selectedClient);
	            		$('#clientDescAutoCompleter').niceSelect('update');	
	            	}
	            	
	            	
	            	if(strEntityType === '0') {
	                 	$("#corporationDiv").show();
	                }
	            	else if(strEntityType === '1' && data.length > 1){
	            		$("#corporationDiv").show();
	            	}
	            	else if(strEntityType === '1' && data.length == 1 || data.length == 0){
	            		$("#corporationDiv").hide();
	            		clearErrorMsg();
                	    $.each(data, function(index, cfg) {
                             if('Y' == cfg.CLIENTDISABLEDFLAG){
                                isTxnInitiationAllowed = false;
                                showErrorMsg(getLabel('txnNotAllowed', 'Transaction not allowed'));
                                return;
                              }
                              isTxnInitiationAllowed = true;
                        });
	            	}
	            	objClient.niceSelect('update');            	
	            }
	        }
	    });
}



function handlePaymentCategoryPopulation(){
	 var methodScreenUrl = 'services/paymentTypeWithBeneCategories.json';
	 var objList,objPaySelectionMode,multiWireVal='N';
	 var source = "O";
	 objPaySelectionMode = getPaymentSelectionMode();
	 if(objPaySelectionMode === 'multiWireTemp')
		 multiWireVal = 'Y';
	 else
		 multiWireVal = 'N';
	 
	 if(objPaySelectionMode === "template")
		 payUsingtemplate = 'Y';
	 else
		 payUsingtemplate = 'N';
	 
	methodScreenUrl = methodScreenUrl+"?$multitxn="+multiWireVal+"&$payusingtemplate="+payUsingtemplate;
	var useFor = 'P';
	if(strEntryType === 'TEMPLATE'){
		useFor = 'T';
	}
	else if(strEntryType == 'SI'){
		useFor = 'SI';
	}

	methodScreenUrl = methodScreenUrl+'&$usefor='+useFor;
	if( objPaySelectionMode == 'receiver' )
	{
		source = "R";
		methodScreenUrl += '&$source='+source;
	}
	 objList = $("#pay-cat-list");
	 objList.empty();
	    $.ajax({
	    	type : 'POST',
	        url: methodScreenUrl,
	        success: function(data) {
	            paintPaymentCategoryPanel(data,objPaySelectionMode);
			
	        }
	    });
}

// START : new code for tabbing

// on list focus functions : start
function onPayTypeFocusList()
{
	document.activeElement.firstChild.focus();
	var currObj = document.activeElement.getElementsByTagName("a")[0];
	//currObj.className = "selected-dropdown";
	payTypeClick(currObj, JSON.parse(currObj.attributes["payCatData"].value), currObj.attributes["paySelectionMode"].value);
}

function onSysBeneFocusList()
{
	document.activeElement.firstChild.focus();
	var currObj = document.activeElement.getElementsByTagName("a")[0];
	//currObj.className = "selected-dropdown";
	var pkgData = JSON.parse(currObj.attributes["payPackageData"].value);
	if( pkgData.beneficiaryOrPackageFlag === 'B' )
	{
		payPkgClick(currObj, JSON.parse(currObj.attributes["sysBeneData"].value), currObj.attributes["paySelectionMode"].value, 'sysBeneListDiv', pkgData.myProductDescription, '#paySysBeneCatSearch', false);
	}
	else
	{
		payPkgClick(currObj, JSON.parse(currObj.attributes["payPackageData"].value), currObj.attributes["paySelectionMode"].value, 'sysBeneListDiv', pkgData.myProductDescription, '#paySysBeneCatSearch', true);
	}
}

function onPayPkgFocusList()
{
	document.activeElement.firstChild.focus();
	var currObj = document.activeElement.getElementsByTagName("a")[0];
	//currObj.className = "selected-dropdown";
	var pkgData = JSON.parse(currObj.attributes["payPackageData"].value);
	if( pkgData.beneficiaryOrPackageFlag === 'B' )
	{
		payPkgClick(currObj, JSON.parse(currObj.attributes["sysBeneData"].value), currObj.attributes["paySelectionMode"].value, 'sysBeneListDiv', pkgData.receiverName, '#paySysBeneCatSearch', false);
	}
	else
	{
		payPkgClick(currObj, JSON.parse(currObj.attributes["payPackageData"].value), currObj.attributes["paySelectionMode"].value, 'payPackageListDiv', pkgData.myProductDescription, '#payTypeSearch', true);
	}
}

function onReceiverFocusList()
{
	document.activeElement.firstChild.focus();
	var currObj = document.activeElement.getElementsByTagName("a")[0];
	//currObj.className = "selected-dropdown";
	payReceiverClick(currObj, JSON.parse(currObj.attributes["payReceiverData"].value));
}

function onPayTempFocusList()
{
	document.activeElement.firstChild.focus();
	var currObj = document.activeElement.getElementsByTagName("a")[0];
	//currObj.className = "selected-dropdown";
	payTempClick(currObj, JSON.parse(currObj.attributes["payTempData"].value), currObj.attributes["paySelectionMode"].value);
}
// on list focus functions : end

// on list click functions : start
function payTypeClick(thisObj, cfg, paySelectionMode)
{
	handleVisualIndication('payCatListDiv',thisObj);
	handleNextButtonVisiblity(true);
	handlePayCatClickHandle(cfg, paySelectionMode);
}

function payPkgClick(thisObj, cfg, paySelectionMode, divName, descField, searchId, isMultiwireChk)
{
		var objUnpiadBillDiv =$('#billUnpaidDiv');
		if(!isEmpty(objUnpiadBillDiv))
			objUnpiadBillDiv.addClass('ui-helper-hidden'); 
	//console.log( 'divName : ' + divName + ' descField : ' + descField + ' isMultiwireChk : ' + isMultiwireChk );
	if( !$( thisObj ).hasClass( 'selected-dropdown' ) )
	{
		handleVisualIndication( divName, thisObj );
		var strDesc = descField;
		if( !isEmpty( strDesc ) )
		{
			//$( '#paySysBeneCatSearch' ).val( strDesc );
			//$('#' + searchId ).val( strDesc );
			$( searchId ).val( strDesc );
		}
		if( paySelectionMode === 'template' || ( isMultiwireChk && paySelectionMode === 'multiWireTemp') )
		{
			handleNextButtonVisiblity( true );
			$('#payTempSearch').val( '' );
			handlePaymentTemplate();
		}
		else if(!isEmpty(cfg.billerCat) && paySelectionMode === 'freeForm' && (cfg.billerCat === 'R' || cfg.billerCat === 'A')){
			if(cfg.billerCat === 'R'){
				handleNextButtonVisiblity(true);
				$('#billUnpaidSearch').val('');
				handleUnpaidBills();
			}
			else if(cfg.billerCat === 'A'){
				handleNextButtonVisiblity(false);
				$('#billUnpaidSearch').val('');
				$('#billUnpaidDiv').addClass('ui-helper-hidden');
				$('#chevron2').addClass('ui-helper-hidden');
			}
		}
		else
		{
			handleNextButtonVisiblity( false );
		}
	}
}

function payReceiverClick(thisObj, cfg)
{
	handleVisualIndication('payReceiverListDiv',thisObj);
	var strReceDesc = cfg.receiverDesc;
	if( !isEmpty( strReceDesc ) )
	{
		$('#payReceiverSearch').val( strReceDesc );
	}
	if( !isEmpty( cfg.myProduct ) )
	{
		handlePaymentReceiverClick();
	}
}

function payTempClick(thisObj, cfg, paySelectionMode)
{
	var strPayTempDesc;
	if(paySelectionMode === 'multiWireTemp')
	{
		if( !$( thisObj ).hasClass( 'selected-dropdown' ) )
		{
			handleVisualIndicationForMultiWire( 'payTempListDiv', thisObj );
			var dispVal,strTempSearchVal;
			strPayTempDesc = cfg.myProductDescription; 
			strTempSearchVal = $( '#payTempSearch' ).val();
			if( !isEmpty( strTempSearchVal ) && !isEmpty( strPayTempDesc ) )
			{
				dispVal = strTempSearchVal + ',' + strPayTempDesc;
			}
			else
			{
				dispVal = strPayTempDesc;
			}
			$('#payTempSearch').val(dispVal);
			handlePaymentTemplateClick();
		}
	}
	else
	{
		if( !$( thisObj ).hasClass('selected-dropdown'))
		{
			handleVisualIndication( 'payTempListDiv', thisObj );
			strPayTempDesc = cfg.myProductDescription; 
			if(!isEmpty(strPayTempDesc))
			{
				$('#payTempSearch').val(strPayTempDesc);
			}
			handlePaymentTemplateClick();
		}
	}
}
// on list click functions : end

// on list keydown functions : start
function onPayTypeKeyDownList(event)
{
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	var otherObj;
	switch(keyPressed)
	{
		case 38: // if the UP key is pressed
			event.preventDefault();
			if(document.activeElement.previousSibling)
			{
				otherObj = document.activeElement.previousSibling.getElementsByTagName("a")[0];
				payTypeClick(otherObj, JSON.parse(otherObj.attributes["payCatData"].value), otherObj.attributes["paySelectionMode"].value);
				document.activeElement.previousSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 40: // if the DOWN key is pressed
			event.preventDefault();
			if(document.activeElement.nextSibling)
			{
				otherObj = document.activeElement.nextSibling.getElementsByTagName("a")[0];
				payTypeClick(otherObj, JSON.parse(otherObj.attributes["payCatData"].value), otherObj.attributes["paySelectionMode"].value);
				document.activeElement.nextSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 9:
			event.preventDefault();
			if(!event.shiftKey)
			{
				if($("#paySysBeneCatDiv").is(":visible"))
				{
					$("#paySysBeneCatSearch").focus();
				}
				else if($("#payPackageDiv").is(":visible"))
				{
					$("#payTypeSearch").focus();
				}
				else if($("#payReceiver").is(":visible"))
				{
					$("#payReceiverSearch").focus();
				}
			}
			break;
	}
}

function onSysBeneKeyDownList(event)
{
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	var otherObj;
	var pkgData;
	switch(keyPressed)
	{
		case 38: // if the UP key is pressed
			event.preventDefault();
			if(document.activeElement.previousSibling)
			{
				otherObj = document.activeElement.previousSibling.getElementsByTagName("a")[0];
				pkgData = JSON.parse(otherObj.attributes["payPackageData"].value);
				if( pkgData.beneficiaryOrPackageFlag === 'B' )
				{
					payPkgClick(otherObj, JSON.parse(otherObj.attributes["sysBeneData"].value), otherObj.attributes["paySelectionMode"].value, 'sysBeneListDiv', pkgData.myProductDescription, '#paySysBeneCatSearch', false);
				}
				else
				{
					payPkgClick(otherObj, JSON.parse(otherObj.attributes["payPackageData"].value), otherObj.attributes["paySelectionMode"].value, 'sysBeneListDiv', pkgData.myProductDescription, '#paySysBeneCatSearch', true);
				}
				document.activeElement.previousSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 40: // if the DOWN key is pressed
			event.preventDefault();
			if(document.activeElement.nextSibling)
			{
				otherObj = document.activeElement.nextSibling.getElementsByTagName("a")[0];
				pkgData = JSON.parse(otherObj.attributes["payPackageData"].value);
				if( pkgData.beneficiaryOrPackageFlag === 'B' )
				{
					payPkgClick(otherObj, JSON.parse(otherObj.attributes["sysBeneData"].value), otherObj.attributes["paySelectionMode"].value, 'sysBeneListDiv', pkgData.myProductDescription, '#paySysBeneCatSearch', false);
				}
				else
				{
					payPkgClick(otherObj, JSON.parse(otherObj.attributes["payPackageData"].value), otherObj.attributes["paySelectionMode"].value, 'sysBeneListDiv', pkgData.myProductDescription, '#paySysBeneCatSearch', true);
				}
				document.activeElement.nextSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 9:
			event.preventDefault();
			if(!event.shiftKey)
			{
				if($("#payTempSearch").is(":visible"))
				{
					$("#payTempSearch").focus();
				}
				else if($("#btnCreatePayCancel").is(":visible") && $("#btnCreatePayCancel").is(":enabled"))
				{
					$("#btnCreatePayCancel").focus();
				}
			}
			break;
	}
}

function onPayPkgKeyDownList(event)
{
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	var otherObj;
	var pkgData;
	switch(keyPressed)
	{
		case 38: // if the UP key is pressed
			event.preventDefault();
			if(document.activeElement.previousSibling)
			{
				otherObj = document.activeElement.previousSibling.getElementsByTagName("a")[0];
				pkgData = JSON.parse(otherObj.attributes["payPackageData"].value);
				if( pkgData.beneficiaryOrPackageFlag === 'B' )
				{
					payPkgClick(otherObj, JSON.parse(otherObj.attributes["sysBeneData"].value), otherObj.attributes["paySelectionMode"].value, 'sysBeneListDiv', pkgData.receiverName, '#paySysBeneCatSearch', false);
				}
				else
				{
					payPkgClick(otherObj, JSON.parse(otherObj.attributes["payPackageData"].value), otherObj.attributes["paySelectionMode"].value, 'payPackageListDiv', pkgData.myProductDescription, '#payTypeSearch', true);
				}
				document.activeElement.previousSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 40: // if the DOWN key is pressed
			event.preventDefault();
			if(document.activeElement.nextSibling)
			{
				otherObj = document.activeElement.nextSibling.getElementsByTagName("a")[0];
				pkgData = JSON.parse(otherObj.attributes["payPackageData"].value);
				if( pkgData.beneficiaryOrPackageFlag === 'B' )
				{
					payPkgClick(otherObj, JSON.parse(otherObj.attributes["sysBeneData"].value), otherObj.attributes["paySelectionMode"].value, 'sysBeneListDiv', pkgData.receiverName, '#paySysBeneCatSearch', false);
				}
				else
				{
					payPkgClick(otherObj, JSON.parse(otherObj.attributes["payPackageData"].value), otherObj.attributes["paySelectionMode"].value, 'payPackageListDiv', pkgData.myProductDescription, '#payTypeSearch', true);
				}
				document.activeElement.nextSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 9:
			event.preventDefault();
			if(!event.shiftKey)
			{
				if($("#payTempSearch").is(":visible"))
				{
					$("#payTempSearch").focus();
				}
				else if($("#btnCreatePayCancel").is(":visible") && $("#btnCreatePayCancel").is(":enabled"))
				{
					$("#btnCreatePayCancel").focus();
				}
			}
			break;
	}
}

function onPayTempKeyDownList(event)
{
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	var otherObj;
	switch(keyPressed)
	{
		case 38: // if the UP key is pressed
			event.preventDefault();
			if(document.activeElement.previousSibling)
			{
				otherObj = document.activeElement.previousSibling.getElementsByTagName("a")[0];
				payTempClick(otherObj, JSON.parse(otherObj.attributes["payTempData"].value), otherObj.attributes["paySelectionMode"].value);
				document.activeElement.previousSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 40: // if the DOWN key is pressed
			event.preventDefault();
			if(document.activeElement.nextSibling)
			{
				otherObj = document.activeElement.nextSibling.getElementsByTagName("a")[0];
				payTempClick(otherObj, JSON.parse(otherObj.attributes["payTempData"].value), otherObj.attributes["paySelectionMode"].value);
				document.activeElement.nextSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 9:
			event.preventDefault();
			if(!event.shiftKey)
			{
				if($("#btnCreatePayCancel").is(":visible") && $("#btnCreatePayCancel").is(":enabled"))
				{
					$("#btnCreatePayCancel").focus();
				}
			}
			break;
	}
}

function onPkgReceiverKeyDownList(event)
{
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	var otherObj;
	switch(keyPressed)
	{
		case 38: // if the UP key is pressed
			event.preventDefault();
			if(document.activeElement.previousSibling)
			{
				otherObj = document.activeElement.previousSibling.getElementsByTagName("a")[0];
				payReceiverClick(otherObj, JSON.parse(otherObj.attributes["payReceiverData"].value));
				document.activeElement.previousSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 40: // if the DOWN key is pressed
			event.preventDefault();
			if(document.activeElement.nextSibling)
			{
				otherObj = document.activeElement.nextSibling.getElementsByTagName("a")[0];
				payReceiverClick(otherObj, JSON.parse(otherObj.attributes["payReceiverData"].value));
				document.activeElement.nextSibling.focus();
				//window.scrollTo(0,0);
			}
			break;
		case 9:
			event.preventDefault();
			if(!event.shiftKey)
			{
				if($("#payTempSearch").is(":visible"))
				{
					$("#payTempSearch").focus();
				}
				else if($("#btnCreatePayCancel").is(":visible") && $("#btnCreatePayCancel").is(":enabled"))
				{
					$("#btnCreatePayCancel").focus();
				}
			}
			break;
	}
}
// on list keydown functions : end

// on button keydown functions : start
function onCancelKeyDown(event)
{
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	if(!event.shiftKey && keyPressed == 9)
	{
		event.preventDefault();
		if($("#btnCreatePayNext").is(":visible") && $("#btnCreatePayNext").is(":enabled"))
		{
			$("#btnCreatePayNext").focus();
		}
		else
		{
			autoFocusOnFirstElement(event, 'headerRadioGroupDiv', false);
		}
	}
}
// on button keydown functions : end

// END : new code for tabbing

function paintPaymentCategoryPanel(data,objPaySelectionMode){
		var searchTerm,arrData,objList,objUl,objDiv,objLi,objAnchor;
		searchTerm = $('#payCatSearch').val().toUpperCase();
		if((!isEmpty(data)) && (!isEmpty(data.d)) && (!isEmpty(data.d.instrumentType)) && (data.d.instrumentType.length>0) ){
			arrData = data.d.instrumentType;
			if(!isEmpty(searchTerm) && searchTerm.indexOf('%')>-1)
			{
				searchTerm = searchTerm.replaceAll('%','');
			}
			if(!isEmpty(searchTerm)){
		    	arrData = arrData.filter(function(val) {
		        	var instTypeDescription = val.instTypeDescription.toUpperCase();
					return instTypeDescription.indexOf(searchTerm)>-1;
				});
		    }
		    objList = $("#pay-cat-list");
		    objList.empty();
		    objDiv = $('<div>').attr({
		    				'id' : 'payCatListDiv',
		    				'class' : ''
		    			 });
		    objUl = $('<ul>').attr({
		    				'class' : '',
		    				'id' : 'payCatList',
		    				'tabindex' : 1
		    				})
		    				.on('focus', function(){onPayTypeFocusList();});
		    objUl.appendTo(objDiv);
		    objDiv.appendTo(objList);
		    
		    if((!isEmpty(arrData)) && arrData.length >0) {
			    $.each(arrData, function(index, cfg) {
			    	if(objPaySelectionMode === 'receiver' && cfg.strIsSysBeneCategory == 'Y')
			    		return;
			    	else if((objPaySelectionMode === 'template' ||  objPaySelectionMode === 'multiWireTemp') && (cfg.strIsSysBeneCategory == 'Y' && cfg.isBiller == 'Y'))
			    		return;
			    	else{
						var instTypeCode = (NONUSUSER == 'N' && cfg.instTypeCode == "WIRE")? getLabel(cfg.instTypeCode+"_US",cfg.instTypeDescription) : getLabel(cfg.instTypeCode,cfg.instTypeDescription);
			    				
				    	objLi = $('<li>').attr({
				    			'payCatData' : cfg,
				    			'tabindex' : 1
				    			})
				    			.on('keydown', function(event){onPayTypeKeyDownList(event);});
				    	objAnchor = $('<a>').attr({
				    						'code' :cfg.instTypeCode,
				    						'payType' : cfg.strPaymentType,
				    						'payCatData' : JSON.stringify(cfg),
				    						'paySelectionMode' : objPaySelectionMode})
				    						.html('<span class="">'+ instTypeCode +'</span>')
				    						.on('click',function(){
				    							if(!$(this).hasClass('selected-dropdown')){
					    							//handleVisualIndication('payCatListDiv',this);
					    							//handleNextButtonVisiblity(true);
					    							//handlePayCatClickHandle(cfg,objPaySelectionMode);
					    							payTypeClick(this, cfg, objPaySelectionMode);
				    							}
				    							else if($(this).hasClass('selected-dropdown')){
				    								handlePayTypeClear();
				    							}
				    						}).appendTo(objLi);
				    	objLi.appendTo(objUl);
			    	}
			    });
		    }
		    else{
		    	paintNoDataMsg($("#pay-cat-list"),'payCatListDiv');
		    }
		}
		else{
			paintNoDataMsg($("#pay-cat-list"),'payCatListDiv');
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
	  objAnchor = $('<span>').attr({'class' : 'ft-padding'}).html(getLabel('noDatapresent', 'No Data Present')).appendTo(objLi);
	 objLi.appendTo(objUl);
}

function handlePayCatClickHandle(cfgPayCat,objPaySelectionMode){
	var strIsSysBene = cfgPayCat.strIsSysBeneCategory;
	var strPayCatDesc =  getLabel(cfgPayCat.instTypeCode,cfgPayCat.instTypeDescription)
	var strIsBiller = cfgPayCat.isBiller;
	var objPackageDiv,objTaxAgency,objUnpiadBillDiv,objchevron2Div;
	objchevron2Div = $("#chevron2");
	objPackageDiv = $("#payPackageDiv");
	objTaxAgency = $("#paySysBeneCatDiv");
	objUnpiadBillDiv =$('#billUnpaidDiv');
	var instrumentTypeCode = cfgPayCat.instTypeCode;
    if(!isEmpty(instrumentTypeCode) && NONUSUSER == 'N' && instrumentTypeCode == 'WIRE')
    {
        instrumentTypeCode = instrumentTypeCode+'_US';
    }
	if(!isEmpty(strPayCatDesc))
		$('#payCatSearch').val(getLabel(instrumentTypeCode,cfgPayCat.instTypeDescription));
	
	if(strIsSysBene === 'N'){
		if(!isEmpty(objPaySelectionMode) && (objPaySelectionMode === 'freeForm' || objPaySelectionMode === 'template' || objPaySelectionMode === 'multiWireTemp')){
			if(!isEmpty(objPackageDiv))
				objPackageDiv.removeClass('ui-helper-hidden');
			if(!isEmpty(objTaxAgency))
				objTaxAgency.addClass('ui-helper-hidden');
			if(!isEmpty(objUnpiadBillDiv))
				objUnpiadBillDiv.addClass('ui-helper-hidden');
			if(!isEmpty(objchevron2Div))
				objchevron2Div.addClass('ui-helper-hidden');
			
			handleVisualIndication('sysBeneListDiv', null);
			
			if(objPaySelectionMode === 'freeForm'){
				$('#payTypeSearch').val('');
				handlePaymentPackage();
			}
			else if(objPaySelectionMode === 'template' || objPaySelectionMode === 'multiWireTemp'){
				if(!isEmpty(objchevron2Div))
					objchevron2Div.removeClass('ui-helper-hidden');
				$('#payTypeSearch').val('');
				$('#payTempSearch').val('');
				handlePaymentPackage();
				handlePaymentTemplate();
			}
		}
		else if(!isEmpty(objPaySelectionMode) && objPaySelectionMode === 'receiver'){
			$('#payReceiverSearch').val('');
			handlePaymentReceiver();
		}
	}
	else if(strIsSysBene === 'Y'){
		if(!isEmpty(objchevron2Div))
			objchevron2Div.addClass('ui-helper-hidden');
		if(!isEmpty(objUnpiadBillDiv))
			objUnpiadBillDiv.addClass('ui-helper-hidden');
		if(!isEmpty(objPackageDiv))
			objPackageDiv.addClass('ui-helper-hidden');
		if(!isEmpty(objTaxAgency))
		{
			objTaxAgency.removeClass('ui-helper-hidden');
			$('#billerLblSpan').text(strPayCatDesc);
		}
		
		handleVisualIndication('payPackageListDiv', null);
		
		$('#paySysBeneCatSearch').val('');
		if(!isEmpty(objPaySelectionMode) && (objPaySelectionMode === 'template' || objPaySelectionMode === 'multiWireTemp')){
			handlePaySystemBene();
			handlePaymentTemplate();
		}
		else{
			handlePaySystemBene();
			/*if(strIsBiller)
				handleBillerSelection(strIsBiller,strPayCatDesc);*/
		}
	}
}
function handleUnpaidBills(){
	var objUnPaidDiv = $('#billUnpaidDiv');
	var filter,paySelectionMode,objSelectedPayCat,instType,filter,unpaidBillsList,objList,objchevron2Div;
	objchevron2Div = $("#chevron2");
	paySelectionMode = getPaymentSelectionMode();
	objSelectedPayCat = getSelectedPaymentCategory();
	if(!isEmpty(objUnPaidDiv))
		objUnPaidDiv.removeClass('ui-helper-hidden');
	if(!isEmpty(objchevron2Div))
		objchevron2Div.removeClass('ui-helper-hidden');
	
	objList = $("#bill-Unpaid-list");
    objList.empty();
	if(!isEmpty(objSelectedPayCat))
		instType=objSelectedPayCat.attr('code');
	
	filter = "services/userseek/billList.json";
		
	unpaidBillsList = fetchUnpaidBillsList(filter);
    populateUnPaidBillsList('bill-Unpaid-list', unpaidBillsList, paySelectionMode);
	
}
function fetchUnpaidBillsList(filterUrl){
	var strUrl = filterUrl,responseData = null,strData='',strBillerCode='';
	var objSelFreeFormNode,objPayCategoryData,payCatData;
	objPayCategoryData = getSelectedPaymentCategory();
	
	if(!isEmpty(objPayCategoryData)){
		payCatData = $.parseJSON(objPayCategoryData.attr('payCatData'));
	}
	
	if(!isEmpty(payCatData) && payCatData.strIsSysBeneCategory === 'Y'){
		objSelFreeFormNode = getSelectedTaxAgency();
	}
	else{
		objSelFreeFormNode = getSelectedPaymentPackage();
	}
	
	
	if(!isEmpty(objSelFreeFormNode)){
		strData =  $.parseJSON(objSelFreeFormNode.attr('payPackageData'));
		strBillerCode = strData.myProduct;
	}
    $.ajax({
    	type : 'POST',
        url: strUrl,
        async: false,
        data :{
        	$filtercode1: strBillerCode 
        },
        success: function(data) {
        	responseData=data;
        }
    });
    
 return responseData;
}
/*function handleBillerSelection(strIsBiller,strPayCatDesc){
	var lblSysBene = $('#paySysBeneCatLbl');
	var lblBiller = $('#billerLbl');
	if(strIsBiller === 'Y'){
		if(!isEmpty(lblBiller))
			lblBiller.removeClass('hidden');
		if(!isEmpty(lblSysBene))
			lblSysBene.addClass('hidden');
	}
	else if(strIsBiller === 'N'){
		if(!isEmpty(lblBiller))
			lblBiller.addClass('hidden');
		if(!isEmpty(lblSysBene))
		{
			lblSysBene.removeClass('hidden');
			$('#paySysBeneCatLbl').text(strPayCatDesc);
	}
}
}*/

function populateUnPaidBillsList(objDiv,unpaidBillsList,paySelectionMode){
	var searchTerm,arrData,objList,objUl,objDiv,objLi,objAnchor;
	searchTerm = $('#billUnpaidSearch').val().toUpperCase();
	var payType = "S";
    if (paymentType == 'multi') {
    	payType = "M";
    }
	if((!isEmpty(unpaidBillsList))&&(!isEmpty(unpaidBillsList.d))&&(!isEmpty(unpaidBillsList.d.preferences))&&(unpaidBillsList.d.preferences.length>0)){
		arrData = unpaidBillsList.d.preferences;
		if(!isEmpty(searchTerm) && searchTerm.indexOf('%')>-1)
		{
			searchTerm = searchTerm.replaceAll('%','');
		}
		if(!isEmpty(searchTerm)){
	    	arrData = arrData.filter(function(val) {
	    		var unpaidbills = val.BILLREFERENCE.toUpperCase();
				return unpaidbills.indexOf(searchTerm)>-1;
			});
	    }
	    objList = $("#"+objDiv);
	    objList.empty();
	    objDiv = $('<div>').attr({
	    				'id' : 'unPaidListdiv',
	    				'class' : ''
	    			 });
	    objUl = $('<ul>').attr({
	    				'class' : ''
	    			});	
	    objUl.appendTo(objDiv);
	    objDiv.appendTo(objList);
	    
	    if(paymentType === 'createPay'){
	    	$.each(arrData, function(index, cfg) {
	    		objLi = $('<li>').attr({
	    			'unpaidBillData' : cfg
	    			});
		    		objAnchor = $('<a>').attr({
					    			'code' :cfg.BILLERCODE,
									'unPaidBillMyprod' : cfg.MYPPRODUCT,
									'unpaidBillData' : JSON.stringify(cfg)})
		    						.html('<span class="">'+ cfg.BILLREFERENCE+'</span>')
		    						.on('click',function(){
		    							if(cfg.BILLTYPE === 'B' || cfg.BILLTYPE === 'M'){
											if(!$(this).hasClass('selected-dropdown')){
			    								handleVisualIndicationForMultiWire('unPaidListdiv',this);
			    								var dispVal,strPayTempDesc,strTempSearchVal;
			    								strPayTempDesc = cfg.BILLREFERENCE; 
			    								strTempSearchVal = $('#billUnpaidSearch').val();
			    								if(!isEmpty(strTempSearchVal) && !isEmpty(strPayTempDesc))
			    									dispVal = strTempSearchVal +','+strPayTempDesc;
			    								else
			    									dispVal = strPayTempDesc;
			    								
			    								$('#billUnpaidSearch').val(dispVal);
			    								handleNextButtonVisiblity(false);
		    								}
											else if($(this).hasClass('selected-dropdown')){
												var strPayTempDesc,strTempSearchVal,arrVal,valPos;
												$(this).removeClass('selected-dropdown');
												strPayTempDesc = cfg.BILLREFERENCE; 
												strTempSearchVal = $('#billUnpaidSearch').val();
												arrVal = strTempSearchVal.split(',');

												if(!isEmpty(arrVal)){
													valPos = arrVal.indexOf(strPayTempDesc);
													if(valPos > -1){
														arrVal.splice(valPos, 1);
													}
													strTempSearchVal = arrVal.toString();
												}
												
												$('#billUnpaidSearch').val(strTempSearchVal);
											}
		    							}
		    							else{
			    							if(!$(this).hasClass('selected-dropdown')){
				    							handleVisualIndication('unPaidListdiv',this);
				    							var strBillNumber= cfg.BILLREFERENCE;
				    							if(!isEmpty(strBillNumber))
				    								$('#billUnpaidSearch').val(strBillNumber);
				    							if(paySelectionMode === 'freeForm'){
				    								handleNextButtonVisiblity(false);
				    							}
				    							else{
				    								handleNextButtonVisiblity(false);
				    							}
			    							}
			    							else if($(this).hasClass('selected-dropdown')){
			    								handlebillUnpaidClear();
			    							}
		    							}
		    						}).appendTo(objLi);
		    	objLi.appendTo(objUl);
		    });
	    }
	    else{
	    	$.each(arrData, function(index,cfg){
	    		if (cfg.BILLTYPE === payType){
	    			objLi = $('<li>').attr({
		    			'unpaidBillData' : cfg
		    			});
	    			objAnchor = $('<a>').attr({
	    							'code' :cfg.BILLERCODE,
	    							'unPaidBillMyprod' : cfg.MYPPRODUCT,
	    							'unpaidBillData' : JSON.stringify(cfg)})
	    							.html('<span class="">'+ cfg.BILLREFERENCE+'</span>')
		    						.on('click',function(){
										if(cfg.BILLTYPE === 'B' || cfg.BILLTYPE === 'M'){
											if(!$(this).hasClass('selected-dropdown')){
			    								handleVisualIndicationForMultiWire('unPaidListdiv',this);
			    								var dispVal,strPayTempDesc,strTempSearchVal;
			    								strPayTempDesc = cfg.BILLREFERENCE; 
			    								strTempSearchVal = $('#billUnpaidSearch').val();
			    								if(!isEmpty(strTempSearchVal) && !isEmpty(strPayTempDesc))
			    									dispVal = strTempSearchVal +','+strPayTempDesc;
			    								else
			    									dispVal = strPayTempDesc;
			    								
			    								$('#billUnpaidSearch').val(dispVal);
			    								handleNextButtonVisiblity(false);
		    								}
											else if($(this).hasClass('selected-dropdown')){
												var strPayTempDesc,strTempSearchVal,arrVal,valPos;
												$(this).removeClass('selected-dropdown');
												strPayTempDesc = cfg.BILLREFERENCE; 
												strTempSearchVal = $('#billUnpaidSearch').val();
												arrVal = strTempSearchVal.split(',');

												if(!isEmpty(arrVal)){
													valPos = arrVal.indexOf(strPayTempDesc);
													if(valPos > -1){
														arrVal.splice(valPos, 1);
													}
													strTempSearchVal = arrVal.toString();
												}
												
												$('#billUnpaidSearch').val(strTempSearchVal);
											}
		    							}
										else{
		    							if(!$(this).hasClass('selected-dropdown')){
				    							handleVisualIndication('unPaidListdiv',this);
				    							var strBillNumber= cfg.BILLREFERENCE;
				    							if(!isEmpty(strBillNumber))
				    								$('#billUnpaidSearch').val(strBillNumber);
				    							if(paySelectionMode === 'freeForm'){
				    								handleNextButtonVisiblity(false);
				    							}
				    							else{
				    								handleNextButtonVisiblity(false);
				    							}
			    							}
			    							else if($(this).hasClass('selected-dropdown')){
			    								handlebillUnpaidClear();
			    							}
										}
		    						}).appendTo(objLi);
	    			objLi.appendTo(objUl);
	    		}
	    	});
	    }
	}
	else{
		objList = $("#"+objDiv);
		objList.empty();
		objDiv = $('<div>').attr({
			'id' : 'unPaidListdiv',
			'class' : ''
		 });
		 objUl = $('<ul>').attr({
				'class' : ''
			});	
		 objUl.appendTo(objDiv);
		 objDiv.appendTo(objList);
		 objLi= $('<li>');
		  objAnchor = $('<span>').attr({'class' : 'ft-padding'}).html(getLabel('noDatapresent', 'No Data Present')).appendTo(objLi);
		 objLi.appendTo(objUl);
	}
}

function handlePaySystemBene(){
	var filter,paySelectionMode,objSelectedPayCat,instType,filter,bankBeneListData,objList;
	paySelectionMode = getPaymentSelectionMode();
	objSelectedPayCat = getSelectedPaymentCategory();
	objList = $("#pay-taxagency-list");
    objList.empty();
	if(!isEmpty(objSelectedPayCat))
		instType=objSelectedPayCat.attr('code');
	if(!isEmpty(instType)){
		if(paymentType === 'single')
			filter = "services/paymentmyproduct.json?$findreceiveragency=T";
		else if(paymentType === 'multi' || paymentType === 'createPay')
			filter = "services/paymentmyproduct.json?$findreceiveragency=T";
	}
	bankBeneListData = fetchBankBeneList(filter);
    populateBankBeneList('pay-taxagency-list', bankBeneListData, paySelectionMode);
}

function populateBankBeneList(objDiv,bankBeneListData,paySelectionMode){
	var searchTerm,arrData,objList,objUl,objDiv,objLi,objAnchor,objSelectedPayCat,objPayCatData,blnIsBiller='N';
	searchTerm = $('#paySysBeneCatSearch').val().toUpperCase();
	var payType = 'Q';
    if (paymentType == 'multi') {
    	payType = 'B';
    }
    
    objSelectedPayCat = getSelectedPaymentCategory();
    if(!isEmpty(objSelectedPayCat)){
    	objPayCatData = $.parseJSON(objSelectedPayCat.attr('payCatData'));
    	if(!isEmpty(objPayCatData)){
    		blnIsBiller = objPayCatData.isBiller;
    	}
    }
    
	if((!isEmpty(bankBeneListData))&&(!isEmpty(bankBeneListData.d))&&(!isEmpty(bankBeneListData.d.myproductsandtemplates))&&(bankBeneListData.d.myproductsandtemplates.length>0)){
		arrData = bankBeneListData.d.myproductsandtemplates;
		if(!isEmpty(searchTerm) && searchTerm.indexOf('%')>-1)
		{
			searchTerm = searchTerm.replaceAll('%','');
		}
		if(!isEmpty(searchTerm)){
	    	arrData = arrData.filter(function(val) {
	    		var receiverName = val.myProductDescription.toUpperCase();
				return receiverName.indexOf(searchTerm)>-1;
			});
	    }
	    objList = $("#"+objDiv);
	    objList.empty();
	    objDiv = $('<div>').attr({
	    				'id' : 'sysBeneListDiv',
	    				'class' : ''
	    			 });
	    objUl = $('<ul>').attr({
	    				'class' : '',
	    				'id' : 'sysBeneList',
	    				'tabindex' : 1
	    			})
	    			.on('focus', function(){onSysBeneFocusList();});
	    objUl.appendTo(objDiv);
	    objDiv.appendTo(objList);
	    
	    if(paymentType === 'createPay'){
	    	$.each(arrData, function(index, cfg) {
	    		objLi = $('<li>').attr({
	    			'payPackageData' : cfg,
	    			'tabindex' : 1
	    			})
	    			.on('keydown', function(event){onSysBeneKeyDownList(event);});
		    	if(cfg.beneficiaryOrPackageFlag === 'B'){
		    		objAnchor = $('<a>').attr({
		    						'code' :cfg.identifier,
		    						'payPackageData' : JSON.stringify(cfg),
		    						'sysbenereceivercode' : cfg.myProduct,
		    						'sysBeneData' : JSON.stringify(cfg),
		    						'paySelectionMode' : paySelectionMode})
		    						.html('<span class="">'+ cfg.myProductDescription+'</span>')
		    						.on('click',function(){
		    							if(!$(this).hasClass('selected-dropdown')){
		    								/*
			    							handleVisualIndication('sysBeneListDiv',this);
			    							var strSysBeneDesc= cfg.myProductDescription;
			    							if(!isEmpty(strSysBeneDesc))
			    								$('#paySysBeneCatSearch').val(strSysBeneDesc);
			    							if(paySelectionMode === 'template'){
			    								handleNextButtonVisiblity(true);
			    								$('#payTempSearch').val('');
			    								handlePaymentTemplate();
			    							}
			    							else if(!isEmpty(blnIsBiller) && paySelectionMode === 'freeForm' && blnIsBiller === 'Y'){
			    								if(cfg.billerCat === 'R'){
				    								handleNextButtonVisiblity(true);
				    								$('#billUnpaidSearch').val('');
				    								$('#billUnpaidDiv').removeClass('ui-helper-hidden');
				    								$('#chevron2').removeClass('ui-helper-hidden');
				    								handleUnpaidBills();
			    								}
			    								else if(cfg.billerCat === 'A'){
			    									handleNextButtonVisiblity(false);
				    								$('#billUnpaidSearch').val('');
				    								$('#billUnpaidDiv').addClass('ui-helper-hidden');
				    								$('#chevron2').addClass('ui-helper-hidden');
			    								}
			    							}
			    							else{
			    								handleNextButtonVisiblity(false);
			    							}
			    							*/
		    								payPkgClick(this, cfg, paySelectionMode, 'sysBeneListDiv', cfg.myProductDescription, '#paySysBeneCatSearch', false);
		    							}
		    							else if($(this).hasClass('selected-dropdown')){
		    								handlePaySysBeneCatClear();
		    							}
		    						}).appendTo(objLi);
		    	}
		    	else{
	    			objAnchor = $('<a>').attr({
	    						'code' :cfg.myProduct,
	    						'payPackageData' : JSON.stringify(cfg),
	    						'paySelectionMode' : paySelectionMode})
	    						.html('<span class="">'+ cfg.myProductDescription+'</span>')
	    						.on('click',function(){
	    							if(!$(this).hasClass('selected-dropdown')){
		    							/*
		    							handleVisualIndication('payPackageListDiv',this);
		    							var strPackageDesc = cfg.myProductDescription;
		    							if(!isEmpty(strPackageDesc))
		    								$('#payTypeSearch').val(strPackageDesc);
		    							if(paySelectionMode === 'template' || paySelectionMode === 'multiWireTemp'){
		    								handleNextButtonVisiblity(true);
		    								$('#payTempSearch').val('');
		    								handlePaymentTemplate();
		    							}
		    							else if(!isEmpty(blnIsBiller) && paySelectionMode === 'freeForm' && blnIsBiller === 'Y'){
		    								if(cfg.billerCat === 'R'){
			    								handleNextButtonVisiblity(true);
			    								$('#billUnpaidSearch').val('');
			    								handleUnpaidBills();
		    								}
		    								else if(cfg.billerCat === 'A'){
		    									handleNextButtonVisiblity(false);
			    								$('#billUnpaidSearch').val('');
			    								$('#billUnpaidDiv').addClass('ui-helper-hidden');
			    								$('#chevron2').addClass('ui-helper-hidden');
		    								}
		    							}
		    							else 
		    								handleNextButtonVisiblity(false);
		    							*/
	    								payPkgClick(this, cfg, paySelectionMode, 'sysBeneListDiv', cfg.myProductDescription, '#paySysBeneCatSearch', true);
	    							}
	    							else if($(this).hasClass('selected-dropdown')){
	    								handlePaySysBeneCatClear();
	    							}
	    						}).appendTo(objLi);
		    	}
		    	objLi.appendTo(objUl);
		    });
	    }
	    else{
	    	$.each(arrData, function(index, cfg) {
	    		if (cfg.paymentType === 'M' || cfg.paymentType === payType){
	    			objLi = $('<li>').attr({
		    			'payPackageData' : cfg,
		    			'tabindex' : 1
		    			})
		    			.on('keydown', function(event){onPayPkgKeyDownList(event);});
	    			objAnchor = $('<a>').attr({
	    							'code' :cfg.identifier,
	    							'payPackageData' : JSON.stringify(cfg),
	    							'sysbenereceivercode' : cfg.myProduct,
	    							'sysBeneData' : JSON.stringify(cfg),
	    							'paySelectionMode' : paySelectionMode})
	    							.html('<span class="">'+ cfg.myProductDescription+'</span>')
		    						.on('click',function(){
		    							if(!$(this).hasClass('selected-dropdown')){
		    								/*
			    							handleVisualIndication('sysBeneListDiv',this);
			    							var strSysBeneDesc= cfg.myProductDescription;
			    							if(!isEmpty(strSysBeneDesc))
			    								$('#paySysBeneCatSearch').val(strSysBeneDesc);
			    							if(paySelectionMode === 'template'){
			    								handleNextButtonVisiblity(true);
			    								$('#payTempSearch').val('');
			    								handlePaymentTemplate();
			    							}
			    							else if(!isEmpty(blnIsBiller) && paySelectionMode === 'freeForm' && blnIsBiller === 'Y'){
			    								if(cfg.billerCat === 'R'){
				    								handleNextButtonVisiblity(true);
				    								$('#billUnpaidSearch').val('');
				    								handleUnpaidBills();
			    								}
			    								else if(cfg.billerCat === 'A'){
			    									handleNextButtonVisiblity(false);
				    								$('#billUnpaidSearch').val('');
				    								$('#billUnpaidDiv').addClass('ui-helper-hidden');
				    								$('#chevron2').addClass('ui-helper-hidden');
			    								}
			    							}
			    							else{
			    								handleNextButtonVisiblity(false);
			    							}
			    							*/
		    								payPkgClick(this, cfg, paySelectionMode, 'sysBeneListDiv', cfg.myProductDescription, '#paySysBeneCatSearch', false);
		    							}
		    							else if($(this).hasClass('selected-dropdown')){
		    								handlePaySysBeneCatClear();
		    							}
		    						}).appendTo(objLi);
	    			objLi.appendTo(objUl);
	    		}
	    	});
	    }
	}
	else{
		objList = $("#"+objDiv);
		objList.empty();
		objDiv = $('<div>').attr({
			'id' : 'sysBeneListDiv',
			'class' : ''
		 });
		 objUl = $('<ul>').attr({
				'class' : ''
			});	
		 objUl.appendTo(objDiv);
		 objDiv.appendTo(objList);
		 objLi= $('<li>');
		  objAnchor = $('<span>').attr({'class' : 'ft-padding'}).html(getLabel('noDatapresent', 'No Data Present')).appendTo(objLi);
		 objLi.appendTo(objUl);
	}
}

function fetchBankBeneList(filterUrl){
	var strUrl = filterUrl,responseData = null;
	var useFor = 'P';
    var filterVal ='';
	if(strEntryType === 'TEMPLATE'){
		useFor = 'T';
	}
	else if(strEntryType == 'SI'){
		useFor = 'SI';
	}
	strUrl = strUrl+'&$usefor='+useFor;
	var objSelectedPayCat = getSelectedPaymentCategory();
	if(!isEmpty(objSelectedPayCat))
		filterVal = "PRODUCTTYPE eq '" + objSelectedPayCat.attr('payType')+"'";
	strUrl = strUrl+'&$filter='+filterVal;
    $.ajax({
    	type : 'POST',
        url: strUrl,
        async: false,
        success: function(data) {
        	responseData=data;
        }
    });
    
 return responseData;
}

function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}

function handlePaymentPackage(){
	var filter,paySelectionMode,objSelectedPayCat,instType,payType,filter,payPackageData,objList,multiWireVal='N';
	paySelectionMode = getPaymentSelectionMode();
	objSelectedPayCat = getSelectedPaymentCategory();
	objList = $("#pay-package-list");
    objList.empty();
    var filterVal ='';
    var strUrl = 'services/paymentmyproduct.json?$ProductTemplateType=P';
    
    if(paySelectionMode === "multiWireTemp")
    	multiWireVal = 'Y'
    else
    	multiWireVal = 'N';
    

	 if(paySelectionMode === "template")
		 payUsingtemplate = 'Y';
	 else
		 payUsingtemplate = 'N';
	 
    strUrl = strUrl+"&$multitxn="+multiWireVal+"&$payusingtemplate="+payUsingtemplate;
    
	if(!isEmpty(objSelectedPayCat)){
		if(filterVal.length > 0)
		{
			filterVal+= ' and ';
		}
		filterVal += "PRODUCTTYPE eq '" + objSelectedPayCat.attr('payType')+"'";
	    strUrl = strUrl+"&$findreceiveragency=P";
	}
	else{
	    strUrl = strUrl+"&$findreceiveragency=B";
	}
	if(!isEmpty(instType)){
		strUrl = strUrl+'&$ProductCategory='+instType+'&$PaymentType='+payType;
	}
	var useFor = 'P';
	if(strEntryType === 'TEMPLATE'){
		useFor = 'T';
	}
	else if(strEntryType == 'SI'){
		useFor = 'SI';
	}
	strUrl = strUrl+'&$usefor='+useFor;
	if($('#payTypeSearch').val()){
		
		if(filterVal.length > 0)
		{
			filterVal+= ' and ';
		}
		filterVal+= "MYPDESCRIPTION lk '%" + $('#payTypeSearch').val().toUpperCase()+"%'";
	}
	if(filterVal.length > 0){
		strUrl+= '&$filter='+filterVal;
	}
	payPackageData = fetchPaymentProducts(strUrl);
    populatePaymentPackage('pay-package-list', payPackageData, paySelectionMode);
}

function populatePaymentPackage(objDiv,payPackageData, paySelectionMode){
	var searchTerm,arrData,objList,objUl,objDiv,objLi,objAnchor;
	var hasPackage  = false;
	var hasTaxAgency  = false;
	var payType = 'Q';
    if (paymentType == 'multi') {
    	payType = 'B';
    }
	if((!isEmpty(payPackageData))&&(!isEmpty(payPackageData.d))&&(!isEmpty(payPackageData.d.myproductsandtemplates))&&(payPackageData.d.myproductsandtemplates.length>0)){
		arrData = payPackageData.d.myproductsandtemplates;
	    objList = $("#"+objDiv);
	    objList.empty();
	    objDiv = $('<div>').attr({
	    				'id' : 'payPackageListDiv',
	    				'class' : ''
	    			 });
	    objUl = $('<ul>').attr({
	    				'class' : '',
	    				'tabindex' : 1
	    			})
	    			.on('focus', function(){onPayPkgFocusList();});
	    objUl.appendTo(objDiv);
	    objDiv.appendTo(objList);
	    
	    if(paymentType === 'createPay'){
	    	$.each(arrData, function(index, cfg) {
	    		if((paySelectionMode === 'template'||paySelectionMode === 'multiWireTemp') && (cfg.billerCat === 'A' || cfg.billerCat === 'R' ))
		    		return;
	    		objLi = $('<li>').attr({
	    			'payPackageData' : cfg,
	    			'tabindex' : 1
	    			})
	    			.on('keydown', function(event){onPayPkgKeyDownList(event);});
		    	if(cfg.beneficiaryOrPackageFlag === 'B'){
		    		hasTaxAgency = true;
		    		objAnchor = $('<a>').attr({
		    						'payPackageData' : JSON.stringify(cfg),
		    						'code' :cfg.systemBenePackageId,
		    						'sysbenereceivercode' : cfg.myProduct,
		    						'sysBeneData' : JSON.stringify(cfg),
		    						'paySelectionMode' : paySelectionMode})
		    						.html('<span class="">'+ cfg.myProductDescription+'</span>')
		    						.on('click',function(){
		    							payPkgClick(this, cfg, paySelectionMode, 'sysBeneListDiv', cfg.receiverName, '#paySysBeneCatSearch', false);
		    						}).appendTo(objLi);
		    	}
		    	else{
					hasPackage = true;
					objAnchor = $('<a>').attr({
	    						'code' :cfg.myProduct,
	    						'payPackageData' : JSON.stringify(cfg),
	    						'paySelectionMode' : paySelectionMode})
	    						.html('<span class="">'+ cfg.myProductDescription+'</span>')
	    						.on('click',function(){
	    							payPkgClick(this, cfg, paySelectionMode, 'payPackageListDiv', cfg.myProductDescription, '#payTypeSearch', true);
	    						}).appendTo(objLi);
		    	}
	    		objLi.appendTo(objUl);
	    	});
	    	if(hasPackage && hasTaxAgency){
	    		$('#payPackageLblSpan').text(getLabel('lblPackageAgency', 'Payment Package/Tax Agency/Biller'));
	    	}
	    	else if(hasTaxAgency){
	    		$('#payPackageLblSpan').text(getLabel('lblTaxAgency', 'Tax Agency'));
	    	}
	    	else{
	    		$('#payPackageLblSpan').text(getLabel('lblPaymentPackage', 'Payment Package'));
	    	}
	    }
	    else{
	    	$.each(arrData, function(index, cfg) {
	    		if(cfg.beneficiaryOrPackageFlag === 'B' && cfg.billerCat != 'N')
		    		hasTaxAgency = true;
	    		else
	    			hasPackage = true;
	    		
	    		if((paySelectionMode === 'template'||paySelectionMode === 'multiWireTemp') && (cfg.billerCat === 'A' || cfg.billerCat === 'R' ))
		    		return;
	    		if (cfg.paymentType === 'M' || cfg.paymentType === payType){
	    			objLi = $('<li>').attr({
		    			'payPackageData' : cfg,
		    			'tabindex' : 1
		    			})
		    			.on('keydown', function(event){onPayPkgKeyDownList(event);});
	    			objAnchor = $('<a>').attr({
		    						'code' :cfg.myProduct,
		    						'payPackageData' : JSON.stringify(cfg),
		    						'paySelectionMode' : paySelectionMode})
		    						.html('<span class="">'+ cfg.myProductDescription+'</span>')
		    						.on('click',function(){
		    							payPkgClick(this, cfg, paySelectionMode, 'payPackageListDiv', cfg.myProductDescription, '#payTypeSearch', true);
		    						}).appendTo(objLi);
	    			objLi.appendTo(objUl);
	    		}
	    	});
	    	if(hasPackage && hasTaxAgency){
	    		$('#payPackageLblSpan').text(getLabel('lblPackageAgencyBiller', 'Payment Package/Biller'));
	    	}
	    	else if(hasTaxAgency){
	    		$('#payPackageLblSpan').text(getLabel('lblTaxAgencyBiller', 'Biller'));
	    	}
	    	else{
	    		$('#payPackageLblSpan').text(getLabel('lblPaymentPackage', 'Payment Package'));
	    	}
	    }
	}
	else{
		objList = $("#"+objDiv);
		objList.empty();
		objDiv = $('<div>').attr({
			'id' : 'payPackageListDiv'
		 });
		 objUl = $('<ul>').attr({
				'class' : ''
			});	
		 objUl.appendTo(objDiv);
		 objDiv.appendTo(objList);
		 objLi= $('<li>');
		  objAnchor = $('<span>').attr({'class' : 'ft-padding'}).html(getLabel('noDatapresent', 'No Data Present')).appendTo(objLi);
		 objLi.appendTo(objUl);
	}
}

function handlePaymentTemplate(){
	var filter,payType,objSelectedPayCat,objSelectedPayPackage,instType,paySelectionMode,payPackage,filter,payTempData,objList,objSelectedTaxAgency,payTaxAgency,multiWireVal='N';
	paySelectionMode = getPaymentSelectionMode();
	objSelectedPayCat = getSelectedPaymentCategory();
	objList = $("#pay-temp-list");
	objList.empty();
	var strUrl = 'services/paymenttemplate.json?$ProductTemplateType=T';
	
	if(paySelectionMode === "multiWireTemp")
    	multiWireVal = 'Y'
    else
    	multiWireVal = 'N';
	

	 if(paySelectionMode === "template")
		 payUsingtemplate = 'Y';
	 else
		 payUsingtemplate = 'N';
    
    strUrl = strUrl+"&$multitxn="+multiWireVal+"&$payusingtemplate="+payUsingtemplate;
    
    var filterVal ='';
	if(!isEmpty(objSelectedPayCat)){
		if(filterVal.length > 0)
		{
			filterVal+= ' and ';
		}
		filterVal += "PRODUCTTYPE eq '" + objSelectedPayCat.attr('payType')+"'";
	}

	objSelectedPayPackage = getSelectedPaymentPackage();
	if(!isEmpty(objSelectedPayPackage))
		payPackage=objSelectedPayPackage.attr('code');
	if(!isEmpty(payPackage)){
		if(filterVal.length > 0)
		{
			filterVal+= ' and ';
		}
		filterVal += "PACKAGEID eq '" + payPackage+"'";
	}
	if($('#payTempSearch').val()){
		
		if(filterVal.length > 0)
		{
			filterVal+= ' and ';
		}
		filterVal+= "TEMPLATENAME lk '%" + $('#payTempSearch').val().toUpperCase()+"%'";
	}
	objSelectedTaxAgency = getSelectedTaxAgency();
	if(!isEmpty(objSelectedTaxAgency))
		payTaxAgency = objSelectedTaxAgency.attr('sysbenereceivercode');
	if(!isEmpty(payTaxAgency)){
		strUrl = strUrl+'&$SystemBeneCode='+payTaxAgency;
		if(objSelectedTaxAgency.attr('paypackagedata')){
			var payPackageData = $.parseJSON(objSelectedTaxAgency.attr('paypackagedata'));
			if((!isEmpty(payPackageData))&&(!isEmpty(payPackageData.systemBenePackageId))){
				if(filterVal.length > 0)
				{
					filterVal+= ' and ';
				}
				filterVal += "PACKAGEID eq '" + payPackageData.systemBenePackageId+"'";
			}
		}
	}
	if(filterVal.length > 0){
		strUrl+= '&$filter='+filterVal;
	}
	
	var useFor = 'P';
	
	strUrl = strUrl+"&$usefor="+useFor;
	
	payTempData = fetchPaymentProducts(strUrl);
	populatePaymentTemplateValue('pay-temp-list', payTempData, paySelectionMode);
    
}

function populatePaymentTemplateValue(objDiv,payTempData, paySelectionMode){
	var arrData,objList,objUl,objDiv,objLi,objAnchor;
	
	var payType = '';
	var count = 0;
	var temDiv = objDiv;
    if (paymentType == 'multi') {
    	payType = 'B';
    }else if(paymentType == 'single'){
    	payType = 'Q';
    }
	
	if((!isEmpty(payTempData))&&(!isEmpty(payTempData.d))&&(!isEmpty(payTempData.d.myproductsandtemplates))&&(payTempData.d.myproductsandtemplates.length>0)){
		arrData = payTempData.d.myproductsandtemplates;
	    objList = $("#"+objDiv);
	    objList.empty();
	    objDiv = $('<div>').attr({
	    				'id' : 'payTempListDiv',
	    				'class' : ''
	    			 });
	    objUl = $('<ul>').attr({
	    				'class' : '',
	    				'tabindex' : 1
	    			})
	    			.on('focus', function(){onPayTempFocusList();});
	    objUl.appendTo(objDiv);
	    objDiv.appendTo(objList);
	    
	    $.each(arrData, function(index, cfg) {
	    if ((payType != '' && (cfg.paymentType === 'M' || cfg.paymentType === payType)) || payType == ''){
	    	objLi = $('<li>').attr({
	    			'payTempData' : cfg,
	    			'tabindex' : 1
	    			})
	    			.on('keydown', function(event){onPayTempKeyDownList(event);});
	    	objAnchor = $('<a>').attr({
	    						'code' :cfg.myProduct,
	    						'payTempData' : JSON.stringify(cfg),
	    						'paySelectionMode' : paySelectionMode})
	    						.html('<span class="">'+ cfg.myProductDescription+'</span>')
	    						.on('click',function(){
	    							/*
	    							if(paySelectionMode === 'multiWireTemp'){
	    								if(!$(this).hasClass('selected-dropdown')){
		    								handleVisualIndicationForMultiWire('payTempListDiv',this);
		    								var dispVal,strPayTempDesc,strTempSearchVal;
		    								strPayTempDesc = cfg.myProductDescription; 
		    								strTempSearchVal = $('#payTempSearch').val();
		    								if(!isEmpty(strTempSearchVal) && !isEmpty(strPayTempDesc))
		    									dispVal = strTempSearchVal +','+strPayTempDesc;
		    								else
		    									dispVal = strPayTempDesc;
		    								
		    								$('#payTempSearch').val(dispVal);
		    								handlePaymentTemplateClick();
	    								}
	    							}
	    							else{
		    							if(!$(this).hasClass('selected-dropdown')){
			    							handleVisualIndication('payTempListDiv',this);
			    							var strPayTempDesc = cfg.myProductDescription; 
			    							if(!isEmpty(strPayTempDesc))
			    								$('#payTempSearch').val(strPayTempDesc);
			    							handlePaymentTemplateClick();
		    							}
	    							}
	    							*/
	    							payTempClick(this, cfg, paySelectionMode);
	    						}).appendTo(objLi);
	    		objLi.appendTo(objUl);
	    		count++;
	    	}
	    
	    });
	   if(count == 0)
		   {
		   		   objDiv =temDiv;
				   objList = $("#"+objDiv);
				   objList.empty();
				   objDiv = $('<div>').attr({
						'id' : 'payTempListDiv',
						'class' : ''
					 });
					 objUl = $('<ul>').attr({
							'class' : ''
						});	
					 objUl.appendTo(objDiv);
					 objDiv.appendTo(objList);
					 objLi= $('<li>');
					  objAnchor = $('<span>').attr({'class' : 'ft-padding'}).html(getLabel('noDatapresent', 'No Data Present')).appendTo(objLi);
					 objLi.appendTo(objUl);
		   
		   }
	}
	else{
		objList = $("#"+objDiv);
		objList.empty();
		objDiv = $('<div>').attr({
			'id' : 'payTempListDiv',
			'class' : ''
		 });
		 objUl = $('<ul>').attr({
				'class' : ''
			});	
		 objUl.appendTo(objDiv);
		 objDiv.appendTo(objList);
		 objLi= $('<li>');
		  objAnchor = $('<span>').attr({'class' : 'ft-padding'}).html(getLabel('noDatapresent', 'No Data Present')).appendTo(objLi);
		 objLi.appendTo(objUl);
	}
}
function handlePaymentReceiver(){
	var filter,paySelectionMode,objSelectedPayCat,instType,payType,filterUrl,payReceiverData,objList;
	paySelectionMode = getPaymentSelectionMode();
	objSelectedPayCat = getSelectedPaymentCategory();
	objList = $("#pay-Receiver-list");
	objList.empty();
	if(!isEmpty(objSelectedPayCat)){
		instType=objSelectedPayCat.attr('code');
		payType=objSelectedPayCat.attr('payType');
	}
	
	if(!isEmpty(instType) && !isEmpty(payType))
		filterUrl = 'services/recieverseekusingpaymenttype.json?$top=-1&$PaymentType='+payType+'&$ProductCategory='+instType;
	else
		filterUrl = 'services/recieverseekusingpaymenttype.json?$top=-1';
	
	payReceiverData = fetchPaymentReceivers(filterUrl);
    populatePaymentReceivers('pay-Receiver-list', payReceiverData, paySelectionMode);
}

function fetchPaymentReceivers(filterUrl){
	 var strUrl = filterUrl,responseData = null;
	    $.ajax({
	    	type : 'POST',
	        url: strUrl,
	        async: false,
	        success: function(data) {
	        	responseData=data;
	        }
	    });
	    
	 return responseData;
}

function populatePaymentReceivers(objDiv,payReceiverData,payType){
	var searchTerm,arrData,objList,objUl,objDiv,objLi,objAnchor;
	searchTerm = $('#payReceiverSearch').val().toUpperCase();
	if((!isEmpty(payReceiverData)) && (!isEmpty(payReceiverData.d)) && (!isEmpty(payReceiverData.d.receivers)) && (payReceiverData.d.receivers.length>0)){
		arrData = payReceiverData.d.receivers;
		if(!isEmpty(searchTerm) && searchTerm.indexOf('%')>-1)
		{
			searchTerm = searchTerm.replaceAll('%','');
		}
		if(!isEmpty(searchTerm)){
	    	arrData = arrData.filter(function(val) {
	    		var receiverName = val.receiverName.toUpperCase();
				return receiverName.indexOf(searchTerm)>-1;
			});
	    }
	    objList = $("#"+objDiv);
	    objList.empty();
	    objDiv = $('<div>').attr({
	    				'id' : 'payReceiverListDiv',
	    				'class' : ''
	    			 });
	    objUl = $('<ul>').attr({
	    				'class' : '',
	    				'tabindex' : 1
	    			})
	    			.on('focus', function(){onReceiverFocusList();});
	    objUl.appendTo(objDiv);
	    objDiv.appendTo(objList);
	    
	    $.each(arrData, function(index, cfg) {
	    	objLi = $('<li>').attr({
	    			'payReceiverData' : cfg,
	    			'tabindex' : 1
	    			})
	    			.on('keydown', function(event){onPkgReceiverKeyDownList(event);});
	    	objAnchor = $('<a>').attr({
	    						'code' :cfg.myProduct,
	    						'payReceiverData' : JSON.stringify(cfg)})
	    						.html('<span class="">'+ cfg.receiverName+'</span>')
	    						.on('click',function(){
	    							payReceiverClick(this, cfg);
	    						}).appendTo(objLi);
	    	objLi.appendTo(objUl);
	    });
	}
	else{
		objList = $("#"+objDiv);
		objList.empty();
		objDiv = $('<div>').attr({
			'id' : 'payReceiverListDiv',
			'class' : ''
		 });
		 objUl = $('<ul>').attr({
				'class' : ''
			});	
		 objUl.appendTo(objDiv);
		 objDiv.appendTo(objList);
		 objLi= $('<li>');
		  objAnchor = $('<span>').attr({'class' : 'ft-padding'}).html(getLabel('noDatapresent', 'No Data Present')).appendTo(objLi);
		 objLi.appendTo(objUl);
	}
}

function fetchPaymentProducts(strUrl) {
    var strUrl = strUrl;
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
        }
    });
    return responseData;
}

function handlePaymentSelectionDisplay(objPaySelType){
	var objchevron2Div,objTemplateDiv,objPackageDiv,objReceiverDiv,objTaxAgencyDiv,objUnpaidBillsDiv;
	handleNextButtonVisiblity(true);
	objchevron2Div = $("#chevron2");
	objTemplateDiv = $("#tempDiv");
	objPackageDiv = $("#payPackageDiv");
	objReceiverDiv = $('#payReceiver');
	objTaxAgencyDiv = $('#paySysBeneCatDiv');
	objUnpaidBillsDiv = $('#billUnpaidDiv');
	$('#payCatSearch').val('');
	$('#payTypeSearch').val('');
	$('#payReceiverSearch').val('');
	$('#paySysBeneCatSearch').val('');
	$('#payTempSearch').val('');
	$('#billUnpaidSearch').val('');
	
	if(!isEmpty(objPaySelType)){
		if(objPaySelType === 'template'){
			
			objchevron2Div.removeClass('ui-helper-hidden');
			objTemplateDiv.removeClass('ui-helper-hidden');
			objPackageDiv.removeClass('ui-helper-hidden');
			
			objReceiverDiv.addClass('ui-helper-hidden');
			objTaxAgencyDiv.addClass('ui-helper-hidden');
			objUnpaidBillsDiv.addClass('ui-helper-hidden');
			
				handlePaymentCategoryPopulation();
				handlePaymentPackage();
				handlePaymentTemplate();
				
		}
		else if(objPaySelType === 'freeForm'){
			objchevron2Div.addClass('ui-helper-hidden');
			objTemplateDiv.addClass('ui-helper-hidden');
			objReceiverDiv.addClass('ui-helper-hidden');
			objTaxAgencyDiv.addClass('ui-helper-hidden');
			objUnpaidBillsDiv.addClass('ui-helper-hidden');
			
			objPackageDiv.removeClass('ui-helper-hidden');
            
            	handlePaymentCategoryPopulation();
    			handlePaymentPackage();
            	
		}
		else if(objPaySelType === 'receiver'){
			objchevron2Div.addClass('ui-helper-hidden');
			objTemplateDiv.addClass('ui-helper-hidden');
			objPackageDiv.addClass('ui-helper-hidden');
			objTaxAgencyDiv.addClass('ui-helper-hidden');
			objUnpaidBillsDiv.addClass('ui-helper-hidden');
			
			objReceiverDiv.removeClass('ui-helper-hidden');
			
			handlePaymentCategoryPopulation();
			handlePaymentReceiver();
		
		}
		else if(objPaySelType === 'multiWireTemp'){
			objchevron2Div.removeClass('ui-helper-hidden');
			objTemplateDiv.removeClass('ui-helper-hidden');
			objPackageDiv.removeClass('ui-helper-hidden');
			
			objReceiverDiv.addClass('ui-helper-hidden');
			objTaxAgencyDiv.addClass('ui-helper-hidden');
			objUnpaidBillsDiv.addClass('ui-helper-hidden');
			
			handlePaymentCategoryPopulation();
			handlePaymentPackage();
			handlePaymentTemplate();			
		}
	}
}

function getSelectedUnpaidBills(){
	var objSelectedUnpaidBills;
	$('#unPaidListdiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedUnpaidBills = $(this);
			return false;
		}
	});
	return objSelectedUnpaidBills;
}

function getSelectedUnpaidBillsList(){
	var objSelectedUnpaidBillsList = [];
	$('#unPaidListdiv').find('li a').each(function(index,val){
		if($(val).hasClass('selected-dropdown')){
			objSelectedUnpaidBillsList.push($(val));
		}
	});
	return objSelectedUnpaidBillsList;
}

function getSelectedPaymentCategory(){
	var objSelectedPayCat;
	$('#payCatListDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedPayCat = $(this);
			return false;
		}
	});
	return objSelectedPayCat;
}

function getSelectedPaymentPackage(){
	var objSelectedPayPackage;
	$('#payPackageListDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedPayPackage = $(this);
			return false;
		}
	});
	return objSelectedPayPackage;
}

function getSelectedPaymentTemplate(){
	var objSelectedPayTemp;
	$('#payTempListDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedPayTemp = $(this);
			return false;
		}
	});
	return objSelectedPayTemp;
}

function getSelectedMultiPayTemplate(){
	var objSelectedPayTemp = [];
	$('#payTempListDiv').find('li a').each(function(index,val){
		if($(val).hasClass('selected-dropdown')){
			objSelectedPayTemp.push($(val));
		}
	});
	return objSelectedPayTemp;
}

function getSelectedTaxAgency(){
	var objSelectedPayTaxAgency;
	$('#sysBeneListDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedPayTaxAgency = $(this);
			return false;
		}
	});
	return objSelectedPayTaxAgency;
}

function getSelectedReceiver(){
	var objSelectedReceiver;
	$('#payReceiverListDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedReceiver = $(this);
			return false;
		}
	});
	return objSelectedReceiver;
}

 function handleVisualIndication(div,selectedAnchor){
	 var objDiv = $('#'+div);
	 objDiv.find('a').each(function(){ $(this).removeClass('selected-dropdown') });
	 if(!isEmpty(selectedAnchor) && selectedAnchor !== null)
		 $(selectedAnchor).addClass('selected-dropdown');
 }
 
 function handleVisualIndicationForMultiWire(div,selectedAnchor){
	 if(!isEmpty(selectedAnchor) && selectedAnchor !== null){
			$(selectedAnchor).addClass('selected-dropdown');
	 }
 }
 
 function handlePaymentTemplateClick(){
	 handleNextButtonVisiblity(false);
 }
 
 function handlePaymentReceiverClick(){
	 handleNextButtonVisiblity(false);
 }
 
 function handlePayTypeClear(){
	 var objPayUsingMode = getPaymentSelectionMode();
	 var objPayTypeSelected = getSelectedPaymentCategory();
	 var objPayPackageDiv, objPaySysBeneDiv,objUnpaidBillsDiv,objchevron2Div;
	 objchevron2Div = $("#chevron2");
	 objPayPackageDiv = $("#payPackageDiv");
	 objPaySysBeneDiv = $("#paySysBeneCatDiv");
	 objUnpaidBillsDiv = $("#billUnpaidDiv");
	 
	 $('#payCatSearch').val('');
	 handlePaymentCategoryPopulation();
	 
	 if(!isEmpty(objPayTypeSelected)) {
		 handleNextButtonVisiblity(true);
		 if(objPayUsingMode === 'template' ||  objPayUsingMode === 'multiWireTemp'){
			 $('#payTypeSearch').val('');
			 $('#payTempSearch').val('');
			 $('#paySysBeneCatSearch').val('');
			 $('#billUnpaidSearch').val('');
			 
			 objPayPackageDiv.removeClass("ui-helper-hidden");
			 objPaySysBeneDiv.addClass("ui-helper-hidden");
			 
			 handlePaymentPackage();
			 handlePaymentTemplate();
		 }
		 else if(objPayUsingMode === 'freeForm'){
			 $('#payTypeSearch').val('');
			 $('#paySysBeneCatSearch').val('');
			 $('#billUnpaidSearch').val('');
			 
			 objPayPackageDiv.removeClass("ui-helper-hidden");
			 objPaySysBeneDiv.addClass("ui-helper-hidden");
			 objUnpaidBillsDiv.addClass("ui-helper-hidden");
			 objchevron2Div.addClass("ui-helper-hidden");
			 
			 handlePaymentPackage();
			 handlePaySystemBene();
		 }
		 else if(objPayUsingMode === 'receiver'){
			 $('#payReceiverSearch').val('');
			 handlePaymentReceiver();
		 }
	 }
 }
 
 function handlePayPackageClear(){
	 var objPayUsingMode = getPaymentSelectionMode(),objUnpaidBillsDiv,objchevron2Div;
	 var objPayPackageSelected = getSelectedPaymentPackage();
	 objUnpaidBillsDiv = $("#billUnpaidDiv");
	 objchevron2Div = $("#chevron2");
	 $('#payTypeSearch').val('');
	 handlePaymentPackage();
	 
	 $('#billUnpaidSearch').val('');
	 if(!isEmpty(objUnpaidBillsDiv))
		 objUnpaidBillsDiv.addClass("ui-helper-hidden");
	 if(!isEmpty(objchevron2Div))
		 objchevron2Div.addClass("ui-helper-hidden");
	 
	 if(!isEmpty(objPayPackageSelected)){
		 handleNextButtonVisiblity(true);
		 if(objPayUsingMode === 'template' || objPayUsingMode === 'multiWireTemp'){
			 $('#payTempSearch').val('');
			 handlePaymentTemplate();
			 if(!isEmpty(objchevron2Div))
				 objchevron2Div.removeClass("ui-helper-hidden");
		 }
	 }
 }
 
 function handlePayTempClear(){
	 handleNextButtonVisiblity(true);
	 $('#payTempSearch').val('');
	 handlePaymentTemplate();
 }
 
 function handlebillUnpaidClear(){
	 handleNextButtonVisiblity(true);
	 $('#billUnpaidSearch').val('');
	 handleUnpaidBills();
 }
 
 function handlePayReceiverClear(){
	 handleNextButtonVisiblity(true);
	 $('#payReceiverSearch').val('');
	 handlePaymentReceiver();
 }
 
 function handlePaySysBeneCatClear(){
	 var objPayUsingMode = getPaymentSelectionMode(),objUnpaidBillsDiv,objchevron2Div;
	 var objSysBeneSelected = getSelectedTaxAgency();
	 var objSelectedPayCat = getSelectedPaymentCategory(),blnIsBiller='N';
	 
	 objchevron2Div = $("#chevron2");
	 objUnpaidBillsDiv = $("#billUnpaidDiv");
	 
	 if(!isEmpty(objSelectedPayCat)){
	    	objPayCatData = $.parseJSON(objSelectedPayCat.attr('payCatData'));
	    	if(!isEmpty(objPayCatData)){
	    		blnIsBiller = objPayCatData.isBiller;
	    	}
	 }
	 
	 handleNextButtonVisiblity(true);
	 
	 objchevron2Div.addClass('ui-helper-hidden');
	 objUnpaidBillsDiv.addClass('ui-helper-hidden');
	 
	 $('#paySysBeneCatSearch').val('');
	 	handlePaySystemBene();
	 
	 if(!isEmpty(objSysBeneSelected)){
		 if(objPayUsingMode === 'template'){
			 $('#payTempSearch').val('');
			 handlePaymentTemplate();
		 }
	 }
 }
 
 function getPaymentSelectionMode(){
	 var objPaySelectionMode='';
	 objPaySelectionMode =  $("input[type='radio'][name='createPayment']:checked").val(); 
	 return objPaySelectionMode;
 }
 
 function goToCenterPage()
 {
 	var frm;
 	var strUrl;
 	if(strEntryType === 'PAYMENT')
 		strUrl = 'paymentSummary.form';
 	else if(strEntryType === 'TEMPLATE')
 		strUrl = 'templateSummary.form';
 	else if(strEntryType === 'SI')
 		strUrl = 'SISummary.form';
 	
 	
 	frm = document.createElement('FORM');
 	frm.name = 'frmMain';
 	frm.id = 'frmMain';
 	frm.action = strUrl;
 	frm.target = "";
 	frm.method = "POST";
 	frm.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	document.body.appendChild(frm);		
 	frm.submit();
	document.body.removeChild( frm );
 }
 
function resetSessionClient(code, desc) {
	var strPaymentInitiationClient;
		if(strEntityType === '0')
		{	
			strPaymentInitiationClient = code;
			strClientDesc = desc;
		}
		else
		{
			strPaymentInitiationClient = $('#clientDescAutoCompleter').val();
			strClientDesc = $('#clientDescAutoCompleter').text();
		}
		
		if (!isEmpty(strPaymentInitiationClient) && (strPaymentInitiationClient === 'all') ) {
			selectedClientDesc ='';
			selectedClient='';
			resetClient();
			initializationForCreatePayment();
			//$('#clientDescAutoCompleter').val('');
		}
		else if(!isEmpty(strPaymentInitiationClient)){
			selectedClientDesc = strClientDesc;
            selectedClient = strPaymentInitiationClient;
            handleClientComboChange();
		}
}

function resetClient() {
	$.ajax({
				url : 'services/swclient/_RESET.json',
				success : function(response) {

				}
			});
}
function handleClientComboChange() {
    var strUrl = Ext.String.format('services/swclient/{0}.json', selectedClient);
    Ext.Ajax.request({
        url: strUrl,
        method: "GET",
        success: function(response) {
            var value = null;
            value = $('input[name=createPayment]:checked').val();
            if(!isEmpty(value))
        		handlePaymentSelectionDisplay(value);
        },
        failure: function(response) {
            // console.log('Error Occured');
        }
    });
}

function handleCreatePaymentNext(){
	var paySelectionMode = getPaymentSelectionMode();
	var code = null,payUsing = 'P',productType = null,myProduct = null,errorMsg = null,layout = null,beneDetails = null,sysBeneCodeForBatch = null, 
	strSystemBeneCategory= null,strIdentifier=null, sysBeneDescForBatch = null;
	var strUrl,form,inputField;
	var payCatData ,objPayCategoryData,objFreeFormData,objSelFreeFormNode,objTempData,objSelTempNode,objReceiverData,objSelReceNode,objTaxAgencyData,objSelTaxAgencyNode,
	objUnPaidBillNode , arrUnPaidBillNode=[], arrSelMultiTempNode =[],arrMultiTempData=[],arrUnpaidBillData=[];
	var selectedReceiverDetails={},selectedDefineBankReceiver ={};
	
	objPayCategoryData = getSelectedPaymentCategory();
	
	if(!isEmpty(paySelectionMode)){
		if(paySelectionMode === 'freeForm' || paySelectionMode === 'receiver'){
			var singleEntryUrl,batchEntryUrl;
			
			if(strEntryType === 'TEMPLATE'){
				singleEntryUrl = 'singleTemplateEntry.form';
				batchEntryUrl = 'multiTemplateEntry.form';
			}
			else if(strEntryType === 'PAYMENT' || strEntryType === 'SI'){
				singleEntryUrl = 'singlePaymentEntry.form';
				batchEntryUrl = 'multiPaymentEntry.form';	
			}
			
			if(!isEmpty(objPayCategoryData)){
				payCatData = $.parseJSON(objPayCategoryData.attr('payCatData'));
			}
			if(!isEmpty(payCatData) && payCatData.strIsSysBeneCategory === 'Y'){
				strSystemBeneCategory = payCatData.instTypeDescription;
				objSelFreeFormNode = getSelectedTaxAgency();
			}
			else{
				objSelFreeFormNode = getSelectedPaymentPackage();
			}
			if(!isEmpty(objPayCategoryData)){
				productType = objPayCategoryData.attr('code');
			}
			if(!isEmpty(objSelFreeFormNode)){
				objFreeFormData = $.parseJSON(objSelFreeFormNode.attr('payPackageData'));
			}
			if(paySelectionMode === 'freeForm'){
				payUsing = 'P';
				if(!isEmpty(objFreeFormData)){
					if(objFreeFormData.billerCat === 'A' && objFreeFormData.beneficiaryOrPackageFlag === 'B'){
						code = objFreeFormData.myProduct;
						sysBeneCodeForBatch = objFreeFormData.systemBenePackageId;
						sysBeneDescForBatch = objFreeFormData.myProductDescription;
						payUsing = 'B';
						myProduct = objFreeFormData.systemBenePackageId;
					}
					else if(objFreeFormData.billerCat === 'R' && objFreeFormData.beneficiaryOrPackageFlag === 'B'){
						if(objFreeFormData.paymentType === 'S' ||objFreeFormData.paymentType === 'Q'){
							objUnPaidBillNode = getSelectedUnpaidBills();
							if(!isEmpty(objUnPaidBillNode)){
								var tempBills = {};
								tempBills.billNumber =  $.parseJSON(objUnPaidBillNode.attr('unpaidBillData')).BILLNO;
								tempBills.billReference = $.parseJSON(objUnPaidBillNode.attr('unpaidBillData')).BILLREFERENCE;
								tempBills.billStatus = $.parseJSON(objUnPaidBillNode.attr('unpaidBillData')).STATUS;
								arrUnpaidBillData[0] = tempBills;
							}
							
							code = objFreeFormData.myProduct;
							sysBeneCodeForBatch = objFreeFormData.systemBenePackageId;
							sysBeneDescForBatch = objFreeFormData.myProductDescription;
							payUsing = 'B';
							myProduct = objFreeFormData.systemBenePackageId;
						}
						else if(objFreeFormData.paymentType === 'B' || objFreeFormData.paymentType === 'M'){
							arrUnPaidBillNode = getSelectedUnpaidBillsList();
							if(!isEmpty(arrUnPaidBillNode))
							$.each(arrUnPaidBillNode, function(index, cfg) {
								var tempBills = {};
								if(cfg){
									tempBills.billNumber = $.parseJSON(cfg.attr('unpaidBillData')).BILLNO;
									tempBills.billReference = $.parseJSON(cfg.attr('unpaidBillData')).BILLREFERENCE;
									tempBills.billStatus = $.parseJSON(cfg.attr('unpaidBillData')).STATUS;
									arrUnpaidBillData[index] = tempBills;
								}
							});
							
							code = objFreeFormData.systemBenePackageId;
							sysBeneCodeForBatch = objFreeFormData.myProduct;
							sysBeneDescForBatch = objFreeFormData.myProductDescription;
							payUsing = 'B';
						}
					}
					else if(objFreeFormData.beneficiaryOrPackageFlag === 'B'){
						code = objFreeFormData.systemBenePackageId;
						sysBeneCodeForBatch = objFreeFormData.myProduct;
						sysBeneDescForBatch = objFreeFormData.myProductDescription;
						payUsing = 'B';
					}
					else{
						myProduct = objFreeFormData.myProduct;
					}
					if(paymentType === 'createPay'){
						if(objFreeFormData.billerCat === 'A')
							strUrl = singleEntryUrl;
						else if(objFreeFormData.paymentType === "M")
							strUrl = batchEntryUrl;
						else if(objFreeFormData.paymentType === "Q")
							strUrl = singleEntryUrl;
						else if(objFreeFormData.paymentType === "B")
							strUrl = batchEntryUrl;
					}
					else if(paymentType === 'single'){
						strUrl = singleEntryUrl;
					}
					else if(paymentType === 'multi'){
						if(objFreeFormData.billerCat === 'A')
							strUrl = singleEntryUrl;
						else
							strUrl = batchEntryUrl;
					}
				}
				
			}
			else if(paySelectionMode === 'receiver'){
				objSelReceNode = getSelectedReceiver();
				if(!isEmpty(objSelReceNode))
					objReceiverData = $.parseJSON(objSelReceNode.attr('payReceiverData'));
					if(!isEmpty(objReceiverData)){
						selectedReceiverDetails={
								 code: objReceiverData.receiverCode,
								 receiverName: objReceiverData.receiverDesc,
								 accountNumber:objReceiverData.accountNumber,
								 bankName:objReceiverData.bankName,
								 myProduct:objReceiverData.myProduct,
								 anyIdProduct:(objReceiverData.anyIdType) ? 'Y' : 'N'
							}
						beneDetails = selectedReceiverDetails;
						code = objReceiverData.receiverCode;
						myProduct = objReceiverData.myProduct;
						payUsing = 'B';
					}
					if(paymentType === 'createPay'){
						if(objReceiverData.pkgType === 'B'){
							strUrl = batchEntryUrl;
						}else{
							strUrl = singleEntryUrl;
						}
					}else if(paymentType === 'single'){
						strUrl = singleEntryUrl;
					}else if(paymentType === 'multi'){
						strUrl = batchEntryUrl;
					}
			}
			
				if(!isEmpty(arrUnpaidBillData) && arrUnpaidBillData.length > 0){
					var blnTxnInDraft=false;
					$.each(arrUnpaidBillData, function(index, cfg) {
						if(cfg){
							if('P' === cfg.billStatus){
								blnTxnInDraft = true;
							}
						}
					});
					if(blnTxnInDraft === true){
						showWarningPopup();
						return;
					}
				}
			    form = document.createElement('FORM');
			    form.name = 'frmMain';
			    form.id = 'frmMain';
			    form.method = 'POST';
			   
			    form.appendChild(createFormField('INPUT', 'HIDDEN',
			        csrfTokenName, tokenValue));
			    form.appendChild(createFormField('INPUT', 'HIDDEN',
							'txtMyProduct', myProduct));
			    if (!Ext.isEmpty(code)){
			    	if(paySelectionMode === 'freeForm'  && (!isEmpty(objFreeFormData) && (objFreeFormData.billerCat === 'A' || objFreeFormData.billerCat === 'R') && objFreeFormData.beneficiaryOrPackageFlag === 'B')){
			    		 form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtSysBeneCode',
					        		sysBeneCodeForBatch));
							form.appendChild(createFormField('INPUT', 'HIDDEN',
								'txtBeneDesc', sysBeneDescForBatch));
					    	form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtCode',
						            code));
					    	if(!isEmpty(arrUnpaidBillData) && arrUnpaidBillData.length > 0){
						    	$.each(arrUnpaidBillData, function(index, cfg) {
						    		if(cfg){
						    			delete cfg['billStatus'];
						    			delete cfg['billReference'];
						    		}
						    	});
					    	}
					    	form.appendChild(createFormField('INPUT', 'HIDDEN', 'pendingBillsList',
					    			JSON.stringify(arrUnpaidBillData||[])));
			    	}
			    	else if((paymentType === 'single' || paymentType === 'multi' || paymentType === 'createPay') && payUsing==='B' && paySelectionMode === 'freeForm') {
				        form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtSysBeneCode',
				        		sysBeneCodeForBatch));
						form.appendChild(createFormField('INPUT', 'HIDDEN',
							'txtBeneDesc', sysBeneDescForBatch));
				    	form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtCode',
					            code));
				    } 
			    }
			    if(!isEmpty(strSystemBeneCategory))
			    	form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtSystemBeneCategory',
			    			strSystemBeneCategory));
			    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtLayout',layout));
			    if (payUsing === 'B' && beneDetails) {
					form.appendChild(createFormField('INPUT', 'HIDDEN',
							'txtBeneDesc', beneDetails.receiverName));
					form.appendChild(createFormField('INPUT', 'HIDDEN',
							'txtBeneAccNo', beneDetails.accountNumber));
					form.appendChild(createFormField('INPUT', 'HIDDEN',
							'txtBeneBankName', beneDetails.bankName));
			    	form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtCode',
					            code));
					form.appendChild(createFormField('INPUT', 'HIDDEN', 'PAY_FROM_ANYID_REC',
					            beneDetails.anyIdProduct));
				}
			    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtPayUsing',
			        payUsing));
			    if (!Ext.isEmpty(productType)) {
			        form.appendChild(createFormField('INPUT', 'HIDDEN',
			            'txtPaymentMethod', productType));
			    }
			    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtEntryType',strEntryType));
			    form.action = strUrl;
			    document.body.appendChild(form);
			    form.submit();
			    document.body.removeChild(form);
		}
		
		else if(paySelectionMode === 'template'){
			
			var singleEntryUrl = 'singlePaymentTemplateEntry.form';
			var batchEntryUrl = 'multiPaymentTemplateEntry.form';	
			
			objSelTempNode = getSelectedPaymentTemplate();	
			if(!isEmpty(objSelTempNode)){
				objTempData = $.parseJSON(objSelTempNode.attr('payTempData'));
				
				if (!Ext.isEmpty(objTempData.identifier))
					strIdentifier = objTempData.identifier;
				if (!Ext.isEmpty(objTempData.bankProduct))
					myProduct = objTempData.bankProduct;
				if( Ext.isEmpty(myProduct) )
				{
					myProduct = objTempData.phdProduct;
				}
				if(objTempData.paymentType === "M")
					strUrl = batchEntryUrl;
				else if(objTempData.paymentType === "Q")
					strUrl = singleEntryUrl;
				else if(objTempData.paymentType === "B")
					strUrl = batchEntryUrl;
				
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokenValue));
				form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
						strIdentifier));
				 if (!Ext.isEmpty(myProduct)) {
				        form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtMyProduct',
				            myProduct));
				    }
				form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtEntryType',strEntryType));
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
			}
		}
		else if(paySelectionMode === 'multiWireTemp'){
			var entryUrl = 'multiWirePaymentEntry.form';
			arrSelMultiTempNode = getSelectedMultiPayTemplate();
			if(!isEmpty(arrSelMultiTempNode)){
				$.each(arrSelMultiTempNode, function(index, cfg) {
					var tempIdentifier = {};
					if(cfg){
						tempIdentifier.identifier = $.parseJSON(cfg.attr('payTempData')).identifier;
						arrMultiTempData[index] = tempIdentifier;
					}
				});
				
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokenValue));
				form.appendChild(createFormField('INPUT', 'HIDDEN', 'multiTxnData',
						JSON.stringify(arrMultiTempData)));
				form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtEntryType',strEntryType));
				form.action = entryUrl;
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
			}
		}
	}
}

function handleNextButtonVisiblity(isDisabled){
    var objNextButton = $(".btnCreatePayNext");
    if(!isTxnInitiationAllowed){
        objNextButton.prop('disabled',true);
        return;
    }
	if(isDisabled === true){
		objNextButton.prop('disabled',true);
	}
	else if(isDisabled === false){
		objNextButton.prop('disabled',false);
	}
}

function handleNextButtonUnableDisable(){
	var objPaySelectionMode = getPaymentSelectionMode();
	var objPayCatNode,objPayPackageNode,objPayTempNode,objPayReceiverNode,objPayTaxAgencyNode;
	var allowPayNext = false;
	if(!isEmpty(objPaySelectionMode)){
		if(objPaySelectionMode === 'template'){
			
		}
		else if(objPaySelectionMode === 'freeForm'){
			objPayCatNode = getSelectedPaymentCategory();
			objPayPackageNode = getSelectedPaymentPackage();
			if(!isEmpty(objPayCatNode) && !isEmpty(objPayPackageNode)){
				allowPayNext = true;
			}
		}
	}
	return allowPayNext;
}

function getLabel(key, defaultText) {
	return (paymentLabelsMap && !Ext.isEmpty(paymentLabelsMap[key]))
			? paymentLabelsMap[key]
			: defaultText
}


function showWarningPopup(){
	var _objDialog = $('#txnExistsWarningPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				buttons :[
					{
						text:getLabel('btnOk','Ok'),
						click : function() {
							$(this).dialog("close");
						}
					}
					]
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option','position','center');
}

function resetCompany(){
	if(isEmpty($('#clientAutoCompleter').val())){
		selectedClientDesc ='';
		selectedClient='';
		resetClient();
		initializationForCreatePayment();
	}
}
var isClientSelected = false;
jQuery.fn.companyAutoComplete = function() {
    var stUrl = 'services/userseek/userclients.json';
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
                                    label: getLabel('suggestionBoxEmptyText', 'No match found..'),
                                    value: ""
                                   }];
                            response($.map(rec, function(item) {
                                return {
                                    label : item.label,
                                    value : item.value
                                }
                            }));
                        }
                        else
                        {
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
                clearErrorMsg();
                handleNextButtonVisiblity(true);
                isClientSelected = true;
                if('Y' == rec.CLIENTDISABLEDFLAG){
                    $('#clientAutoCompleterId').val('');
                    showErrorMsg(getLabel('txnNotAllowed', 'Transaction not allowed'));
                    paintNoDataMsg($("#pay-cat-list"),'payCatListDiv');
                    return;
                }
                $('#clientAutoCompleterId').val(rec.CODE);
                resetSessionClient(rec.CODE, rec.DESCR);
            },
            open : function() {
                $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
            },
            close : function() {
                $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
            }
        }).data("autocomplete")._renderItem = function(ul, item) {
            var inner_html = '<a><ol class="t7-autocompleter"><ul>'+ item.label + '</ul></ol></a>';
            return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
        };
        $(this).on('keydown',function(e){
            var keycode = e.which || e.keyCode || 0;
            if('Y' == txnClientCodeBlurEvent && keycode == 9){
                if(!isClientSelected)
                    $('#clientAutoCompleterId').val('');
                handleClientCodeBlurEvent(this.value);
            }
        });
    });
};

function handleClientCodeBlurEvent(company){
    clearErrorMsg();
    isClientSelected = false;
    handleNextButtonVisiblity(true);
    if("Y" == txnClientCodeBlurEvent && !isEmpty(company)){
        resetCompany();
        if(!isEmpty($('#clientAutoCompleterId').val())){
            company = $('#clientAutoCompleterId').val();
        }
        handleClientCodeSeek(company);
    }
}

function handleClientCodeSeek(clientId){
    var stUrl = 'services/userseek/transcationclientseek.json';
    $.ajax({
        type : 'POST',
        url: stUrl,
        data: {
            top : -1,
            $filtercode1 : clientId
        },
        success: function(data) {
            var companyDetail = data.d.preferences;
            clearErrorMsg();
            if(!isEmpty(companyDetail) && companyDetail.length >0){
                $.each(companyDetail, function (index, rec) {
                  if(strEntityType == 0){
                        $('#clientDescAutoCompleter').val(rec.DESCR);
                   }
                   if('Y' == rec.CLIENTDISABLEDFLAG){
                        $('#clientAutoCompleterId').val('');
                        showErrorMsg(getLabel('txnNotAllowed', 'Transaction not allowed'));
                        paintNoDataMsg($("#pay-cat-list"),'payCatListDiv');
                        if(strEntityType == 1){
                           isTxnInitiationAllowed = false;
                        }
                        return;
                   }
                   $('#clientAutoCompleterId').val(rec.CODE);
                   resetSessionClient(rec.CODE,rec.DESCR);
                });
            }else{
                showErrorMsg(getLabel('invalidClientCode', 'Invalid Client Code'));
                paintNoDataMsg($("#pay-cat-list"),'payCatListDiv');
            }
        }
    });
}

function showErrorMsg(errMsg){
    $('#PaymentrError').removeClass('ui-helper-hidden');
    $('#PaymentErrorMsg').text(errMsg);
}

function clearErrorMsg(){
    $('#PaymentErrorMsg').empty();
    $('#PaymentrError').addClass('ui-helper-hidden');
}

function populatePayTypeAndPkgForClientEntity(){
    handleNextButtonVisiblity(true);
    isTxnInitiationAllowed = true;
    var clientCode = $('#clientDescAutoCompleter').val();
    if(null != clientCode){
        handleClientCodeSeek(clientCode);
    }
}
