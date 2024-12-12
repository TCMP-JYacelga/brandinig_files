function initializationForCreateReceivable(){
	 $('#receivablePkgSearch').keyup(function() {
		 handleReceivablePackagePopulation();
	});
	 
	 $('#receivableCatSearch').keyup(function() {
		 handleReceivableCategoryPopulation();
	});
	if(strEntityType === '1')
		handleClientDropDown();
	handleReceivableCategoryPopulation();
	handleReceivablePackagePopulation();
}
function handleClientDropDown(){
	var objClient = $('#clientDescSelect');
	var stUrl = 'services/userseek/recvuser.json?$top=-1',opt=null,PmtType = 'BP';
	 
	 objClient.empty();
	    
	 $.ajax({
	    	type : 'POST',
	        url: stUrl,
	        data: {
                $filtercode1: PmtType
            },
	        success: function(data) {
	            if(!isEmpty(data)){
	            	data = data.d.preferences;
	            	if(strEntityType === '0'){
		            	opt = $('<option/>',{
		            		value: 'all',
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
	            	objClient.niceSelect();
	            	
	            	if(!isEmpty(selectedClient)) {
	            		$("#clientDescSelect").val(selectedClient);
	            		$("#clientDescSelect").niceSelect('update');
	            	}
	            	
	            	if(strEntityType === '0') {
	                 	$("#corporationDiv").show();
	                 	$("#HLineDiv").show();
	                }
	            	else if(strEntityType === '1' && data.length > 1){
	            		$("#corporationDiv").show();
	            		$("#HLineDiv").show();
	            	}
	            	else if(strEntityType === '1' && data.length == 1 || data.length == 0){
	            		$("#corporationDiv").hide();
	            		$("#HLineDiv").hide();
	            		clearErrorMsg();
                        $.each(data, function(index, cfg) {
                             if('Y' == cfg.CLIENTDISABLEDFLAG || 'Y' == cfg.CREDITCARDCLIENT){
                                isTxnInitiationAllowed = false;
                                if('Y' == cfg.CLIENTDISABLEDFLAG)
                                    showErrorMsg(getLabel('txnNotAllowed', 'Transaction not allowed'));
                                else if ( 'Y' == cfg.CREDITCARDCLIENT)
                                    showErrorMsg(getLabel('ccTxnNotAllowed', 'Transactions are not allowed for Credit Card Customer'));
                                return;
                              }
                              isTxnInitiationAllowed = true;
                        });
	            	}
	            }
	        }
	    });
}
function handleReceivableCategoryPopulation(){
	 var methodScreenUrl = 'services/receivableMethod.json';
	 var objList;
	 objList = $("#receivable-cat-list");
	 objList.empty();
	    $.ajax({
	    	type : 'POST',
	        url: methodScreenUrl,
	        success: function(data) {
	            paintReceivableCategoryPanel(data);
			
	        }
	    });
}
function paintReceivableCategoryPanel(data){
		var searchTerm,arrData,objList,objUl,objDiv,objLi,objAnchor;
		searchTerm = $('#receivableCatSearch').val().toUpperCase();
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
		    objList = $("#receivable-cat-list");
		    objList.empty();
		    objDiv = $('<div>').attr({
		    				'id' : 'receivableCatListDiv',
		    				'class' : ''
		    			 });
		    objUl = $('<ul>').attr({
		    				'class' : '',
							'tabindex' : 1
		    			}).on('focus', function(){onReceTypeFocusList();});	
		    objUl.appendTo(objDiv);
		    objDiv.appendTo(objList);
		    
		    if((!isEmpty(arrData)) && arrData.length >0){
			    $.each(arrData, function(index, cfg) {
				    	objLi = $('<li>').attr({
				    			'receCatData' : cfg,
				    			'tabindex' : 1
				    			}).on('keydown', function(event){onReceTypeKeyDownList(event);});
				    	objAnchor = $('<a>').attr({
				    						'code' :cfg.instTypeCode,
				    						'receCatData' : JSON.stringify(cfg)})
				    						.html('<span class="">'+ getLabel(cfg.instTypeCode,cfg.instTypeDescription)+'</span>')
				    						.on('click',function(){
				    							if(!$(this).hasClass('selected-dropdown')){
					    							handleVisualIndication('receivableCatListDiv',this);
					    							handleNextButtonVisiblity(true);
					    							handleReceivableCatClickHandle(cfg);
				    							}
				    						}).appendTo(objLi);
				    	objLi.appendTo(objUl);
			    });
		    }
		    else{
		    	paintNoDataMsg($("#receivable-cat-list"),'receivableCatListDiv');
		    }
		}
		else{
			paintNoDataMsg($("#receivable-cat-list"),'receivableCatListDiv');
		}
}

function onReceTypeKeyDownList(event)
{
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	var otherObj;
	switch(keyPressed)
	{
		case 38: 
			event.preventDefault();
			if(document.activeElement.previousSibling)
			{
				otherObj = document.activeElement.previousSibling.getElementsByTagName("a")[0];
				receTypeClick(otherObj, JSON.parse(otherObj.attributes["receCatData"].value));
				document.activeElement.previousSibling.focus();
			}
			break;
		case 40:
			event.preventDefault();
			if(document.activeElement.nextSibling)
			{
				otherObj = document.activeElement.nextSibling.getElementsByTagName("a")[0];
				receTypeClick(otherObj, JSON.parse(otherObj.attributes["receCatData"].value));
				document.activeElement.nextSibling.focus();
			}
			break;
		case 9:
			event.preventDefault();
			if(!event.shiftKey)
			{
				if($("#receivableCatClearSpan").is(":visible"))
				{
					$("#receivableCatClearSpan").focus();
				}
			}
			break;
	}
}
function onReceTypeFocusList()
{
	document.activeElement.firstChild.focus();
	var currObj = document.activeElement.getElementsByTagName("a")[0];
	receTypeClick(currObj, JSON.parse(currObj.attributes["receCatData"].value));
	}
function receTypeClick(thisObj, cfg, paySelectionMode)
{
	handleVisualIndication('receivableCatListDiv',thisObj);
	handleNextButtonVisiblity(true);
	handleReceivableCatClickHandle(cfg);
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
function handleReceivableCatClickHandle(cfgCat,objPaySelectionMode){
	var strReceCatDesc = getLabel(cfgCat.instTypeCode,cfgCat.instTypeDescription);
	if(!isEmpty(strReceCatDesc))
		$('#receivableCatSearch').val(strReceCatDesc);
	
		$('#receivablePkgSearch').val('');
				handleReceivablePackagePopulation();

}
function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}
function handleReceivablePackagePopulation(){
	var objSelectedReceCat,recePackageData,objList;
	objSelectedReceCat = getSelectedReceivableCategory();
	objList = $("#receivable-package-list");
    objList.empty();
    var filterVal ='';
	if(!isEmpty(objSelectedReceCat)){
		if(filterVal.length > 0)
		{
			filterVal+= ' and ';
		}
		filterVal += Ext.String.format("PRODUCTCATEGORY eq '{0}' ", objSelectedReceCat.attr('code'));

	}
	recePackageData = fetchReceivableProductPkg(filterVal);
    populateReceivablePackage('receivable-package-list', recePackageData);
}
function populateReceivablePackage(objDiv,recePackageData){
	var searchTerm,arrData,objList,objUl,objDiv,objLi,objAnchor;
	searchTerm = $('#receivablePkgSearch').val().toUpperCase();
	if((!isEmpty(recePackageData))&&(!isEmpty(recePackageData.d))&&(!isEmpty(recePackageData.d.myproductsandtemplates))&&(recePackageData.d.myproductsandtemplates.length>0)){
		arrData = recePackageData.d.myproductsandtemplates;
		if(!isEmpty(searchTerm) && searchTerm.indexOf('%')>-1)
		{
			searchTerm = searchTerm.replaceAll('%','');
		}
		if(!isEmpty(searchTerm)){
		    	arrData = arrData.filter(function(val) {
		        	var myProductDescription = val.myProductDescription.toUpperCase();
					return myProductDescription.indexOf(searchTerm)>-1;
				});
		 }
	objList = $("#"+objDiv);
	objList.empty();
	objDiv = $('<div>').attr({
	    'id' : 'recePackageListDiv',
	    'class' : ''
	 });
	objUl = $('<ul>').attr({
	    				'class' : '',
						'tabindex' : 1
	    			}).on('focus', function(){onRecePkgFocusList();});	
	objUl.appendTo(objDiv);
	objDiv.appendTo(objList);
	if(!isEmpty(arrData) && arrData.length > 0){
	    $.each(arrData, function(index, cfg) {
	    		objLi = $('<li>').attr({
	    			'recePackageData' : cfg,
					'tabindex' : 1
					}).on('keydown', function(event){onRecePkgKeyDownList(event);});
		    		hasTaxAgency = true;
		    		objAnchor = $('<a>').attr({
		    						'recePackageData' : JSON.stringify(cfg),
		    						'code' :cfg.systemBenePackageId,
		    						'sysbenereceivercode' : cfg.myProduct,
		    						'sysBeneData' : JSON.stringify(cfg)})
		    						.html('<span class="">'+ cfg.myProductDescription+'</span>')
		    						.on('click',function(){
		    							if(!$(this).hasClass('selected-dropdown')){
			    							handleVisualIndication('recePackageListDiv',this);
			    							var strRecePkgDesc = cfg.myProductDescription; 
			    							if(!isEmpty(strRecePkgDesc))
			    								$('#receivablePkgSearch').val(strRecePkgDesc);
					    					handleNextButtonVisiblity(false);
		    							}
		    						}).appendTo(objLi);
	    		objLi.appendTo(objUl);
	    	});
	    }
	    else{
	    	paintNoDataMsg($("#receivable-package-list"),'recePackageListDiv');
	    }
	}
	else{
		paintNoDataMsg($("#receivable-package-list"),'recePackageListDiv');
	}
}
function onRecePkgKeyDownList(){
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	var otherObj;
	switch(keyPressed)
	{
		case 38:
			event.preventDefault();
			if(document.activeElement.previousSibling)
			{
				otherObj = document.activeElement.previousSibling.getElementsByTagName("a")[0];
				recePkgClick(otherObj, JSON.parse(otherObj.attributes["recepackagedata"].value));
				document.activeElement.previousSibling.focus();
			}
			break;
		case 40:
			event.preventDefault();
			if(document.activeElement.nextSibling)
			{
				otherObj = document.activeElement.nextSibling.getElementsByTagName("a")[0];
				recePkgClick(otherObj, JSON.parse(otherObj.attributes["recepackagedata"].value));
				document.activeElement.nextSibling.focus();
			}
			break;
		case 9:
			event.preventDefault();
			if(!event.shiftKey)
			{
				if($("#receivableTypeClearSpan").is(":visible"))
				{
					$("#receivableTypeClearSpan").focus();
				}
			}
			break;
	}
}
function onCancelKeyDown(event)
{
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	if(!event.shiftKey && keyPressed == 9)
	{
		event.preventDefault();
		if($("#btnCreateReceNext").is(":visible") && $("#btnCreateReceNext").is(":enabled"))
		{
			$("#btnCreateReceNext").focus();
		}
		else
		{
			if($('#corporationDiv').is(':visible')){
				autoFocusOnFirstElement(event, 'corporationDiv', false);
			}
			else{
				autoFocusOnFirstElement(event, 'receivableCatDiv', false);
			}
			
		}
	}
}
function onNextKeyDown(event)
{
	var keyPressed = event.charCode || event.keyCode || event.which || 0;
	if(!event.shiftKey && keyPressed == 9)
	{
		event.preventDefault();		
		if($('#corporationDiv').is(':visible')){
			autoFocusOnFirstElement(event, 'corporationDiv', false);
		}
		else{
			autoFocusOnFirstElement(event, 'receivableCatDiv', false);
		}
	}
}

function onRecePkgFocusList(){
	document.activeElement.firstChild.focus();
	var currObj = document.activeElement.getElementsByTagName("a")[0];
	recePkgClick(currObj, JSON.parse(currObj.attributes["recepackagedata"].value));
}
function recePkgClick(thisObj, cfg, paySelectionMode)
{
	handleVisualIndication('recePackageListDiv',thisObj);
	handleNextButtonVisiblity(true);
	var strRecePkgDesc = cfg.myProductDescription; 
	if(!isEmpty(strRecePkgDesc)){
		$('#receivablePkgSearch').val(strRecePkgDesc);
		handleNextButtonVisiblity(false);
	}
}
function fetchReceivableProductPkg(filter) {
    var strUrl = 'services/receivabletemplatesmyproduct.json'; 
    if(!isEmpty(filter))
   	 strUrl += '?$filter=' + filter;
    else
    	return;
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
function getSelectedReceivableCategory(){
	var objSelectedPayCat;
	$('#receivableCatListDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedPayCat = $(this);
			return false;
		}
	});
	return objSelectedPayCat;
}

function getSelectedRecePackage(){
	var objSelectedPayPackage;
	$('#recePackageListDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedPayPackage = $(this);
			return false;
		}
	});
	return objSelectedPayPackage;
}
 function handleVisualIndication(div,selectedAnchor){
	 var objDiv = $('#'+div);
	 objDiv.find('a').each(function(){ $(this).removeClass('selected-dropdown') });
	 if(!isEmpty(selectedAnchor) && selectedAnchor !== null)
		 $(selectedAnchor).addClass('selected-dropdown');
 }
 function handleReceCatClear(){
	 var objPayTypeSelected = getSelectedReceivableCategory();
	 $('#receivableCatSearch').val('');
	 $('#receivablePkgSearch').val('');
	 handleReceivableCategoryPopulation();
	 handleReceivablePackagePopulation();
	handleNextButtonVisiblity(true);
 }
 
 function handleRecePackageClear(){
	 var objPayPackageSelected = getSelectedRecePackage();
	 $('#receivablePkgSearch').val('');
	 handleReceivablePackagePopulation();
	 handleNextButtonVisiblity(true);
 }
function goToCenterPage(){
 	var frm;
 	var strUrl;
 	strUrl = 'showDepositList.form';
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
		var strCollectionInitiationClient;
		if(strEntityType === '0')
		{	
			strCollectionInitiationClient = code;
			strClientDesc = desc;
		}
		else
		{
			strCollectionInitiationClient = $('#clientDescSelect').val();
			strClientDesc = $('#clientDescSelect').text();
		}
		if (!isEmpty(strCollectionInitiationClient) && (strCollectionInitiationClient === 'all') ) {
			selectedClientDesc ='';
			selectedClient='';
			resetClient();
			initializationForCreateReceivable();
		}
		else if(!isEmpty(strCollectionInitiationClient)){
			selectedClientDesc = strClientDesc;
            selectedClient = strCollectionInitiationClient;
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
           $('#receivableCatSearch').val('');
           $('#receivablePkgSearch').val('');
           handleReceivableCategoryPopulation();
		   handleReceivablePackagePopulation();
           handleNextButtonVisiblity(true);
        },
        failure: function(response) {
            // console.log('Error Occured');
        }
    });
}

function handleCreateReceivableNext(){
	var form,inputField,strUrl = '',code = null,payUsing = 'P',productType = null,myProduct = null,layout = null,objRecePkgData,objReceCatData;
    var objPayPackageSelected = getSelectedRecePackage();
    var objReceCatSelected = getSelectedReceivableCategory();
    
    if(!isEmpty(objPayPackageSelected))
		objRecePkgData = $.parseJSON(objPayPackageSelected.attr('recePackageData'));
	if(!isEmpty(objReceCatSelected))
		objReceCatData = $.parseJSON(objReceCatSelected.attr('receCatData'));
	if(!isEmpty(objRecePkgData))
		code = objRecePkgData.myProduct;
	if(!isEmpty(objReceCatData))
		productType = objReceCatData.code;
		
		payUsing = 'P';
	
	
	strUrl = 'batchReceivablesEntry.form';	
	
	    form = document.createElement('FORM');
	    form.name = 'frmMain';
	    form.id = 'frmMain';
	    form.method = 'POST';
	   
	    form.appendChild(createFormField('INPUT', 'HIDDEN',
	        csrfTokenName, tokenValue));
		if (!Ext.isEmpty(code)) {
	        form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtCode',
	            code));
	    }
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtLayout',layout));
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

function handleNextButtonVisiblity(isDisabled){
    var objNextButton = $(".btnCreateReceNext");
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

function getLabel(key, defaultText) {
	return (paymentLabelsMap && !Ext.isEmpty(paymentLabelsMap[key]))
			? paymentLabelsMap[key]
			: defaultText
}

function resetCompany(){
	if(isEmpty($('#clientAutoCompleterId').val())){
		selectedClientDesc ='';
		selectedClient='';
		resetClient();
		initializationForCreateReceivable();
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
                if('Y' == rec.CLIENTDISABLEDFLAG || 'Y' == rec.CREDITCARDCLIENT){
                    $('#clientAutoCompleterId').val('');
                    if('Y' == rec.CLIENTDISABLEDFLAG)
                        showErrorMsg(getLabel('txnNotAllowed', 'Transaction not allowed'));
                    else if('Y' == rec.CREDITCARDCLIENT)
                        showErrorMsg(getLabel('ccTxnNotAllowed', 'Transactions are not allowed for Credit Card Customer'));
                    $('#receivableCatSearch').val('');
                    $('#receivablePkgSearch').val('');
                    paintNoDataMsg($("#receivable-cat-list"),'receivableCatListDiv');
                    handleReceivablePackagePopulation();
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
            var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';
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

function handleClientCodeSeek(clientCode){
    var stUrl = 'services/userseek/transcationclientseek.json';
    $.ajax({
        type : 'POST',
        url: stUrl,
        data: {
            top : -1,
            $filtercode1 : clientCode
        },
        success: function(data) {
            var companyDetail = data.d.preferences;
            clearErrorMsg();
            if(!isEmpty(companyDetail) && companyDetail.length >0){
                $.each(companyDetail, function (index, rec) {
                   if(strEntityType == 0){
                        $('#clientDescSelect').val(rec.DESCR);
                    }
                    if('Y' == rec.CLIENTDISABLEDFLAG || 'Y' == rec.CREDITCARDCLIENT){
                        $('#clientAutoCompleterId').val('');
                        if('Y' == rec.CLIENTDISABLEDFLAG)
                            showErrorMsg(getLabel('txnNotAllowed', 'Transaction not allowed'));
                        else if('Y' == rec.CREDITCARDCLIENT)
                            showErrorMsg(getLabel('ccTxnNotAllowed', 'Transactions are not allowed for Credit Card Customer'));
                        $('#receivableCatSearch').val('');
                        $('#receivablePkgSearch').val('');
                        paintNoDataMsg($("#receivable-cat-list"),'receivableCatListDiv');
                        paintNoDataMsg($("#receivable-package-list"),'recePackageListDiv');
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
                paintNoDataMsg($("#receivable-cat-list"),'receivableCatListDiv');
            }
        }
    });
}

function showErrorMsg(errMsg){
    $('#ReceivableError').removeClass('ui-helper-hidden');
    $('#ReceivableErrorMsg').text(errMsg);
}

function clearErrorMsg(){
    $('#ReceivableErrorMsg').empty();
    $('#ReceivableError').addClass('ui-helper-hidden');
}

function populatePayTypeAndPkgForClientEntity(){
    handleNextButtonVisiblity(true);
    isTxnInitiationAllowed = true;
    var clientCode = $('#clientDescSelect').val();
    if(null != clientCode){
        handleClientCodeSeek(clientCode);
    }
}
