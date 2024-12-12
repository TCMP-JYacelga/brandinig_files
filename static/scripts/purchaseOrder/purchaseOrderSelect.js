function initializationForCreatePurchaseOrderAutoComplete() {
	resetClient();
	handlePurchaseOrderTypePopulation();
	handleProductTypePopulation();
	handleClientDropDownAutocomplete();
	$('#productPkgSearch').keyup(function() {
				handleProductTypePopulation();
			});
}
function initializationForCreatePurchaseOrder() {
	resetClient();
	handlePurchaseOrderTypePopulation();
	handleClientDropDown();
	handleProductTypePopulation();
	$('#productPkgSearch').keyup(function() {
				handleProductTypePopulation();
			});
}
function resetSessionClient() {
	if (strEntityType === "0") {
		var strClient = $('#company').val();
	}
	if (strEntityType === "1") {
		var strClient = $('#clientDescSelect').val();
		var strClientDesc = $('#clientDescSelect').text();
	}
		if (!isEmpty(strClient) && (strClient === 'all') ) {
			selectedClientDesc ='';
			selectedClient='';
			resetClient();
			 $('#purchaseOrderType').val("BUYER");
             $('#receivablePkgSearch').val('');
            if (strEntityType === "1")
			    initializationForCreatePurchaseOrder();
		    if (strEntityType === "0")
			    initializationForCreatePurchaseOrderAutoComplete();
		}
		else if(!isEmpty(strClient)){
			selectedClientDesc = strClientDesc;
            selectedClient = strClient;
            if (strEntityType === "1")
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
           $('#purchaseOrderType').val("BUYER");
           $('#productPkgSearch').val('');
            handlePurchaseOrderTypePopulation();
            handleProductTypePopulation();
           handleNextButtonVisiblity(true);
        },
        failure: function(response) {
        }
    });
}
function goToCenterPage(){
 	var frm;
 	var strUrl;
 	strUrl = 'purchaseOrderCenter.form';
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
function handleProductTypePopulation(){
var prodPackageData=fetchProduct();
populateProductTypePopulation(prodPackageData);
}
function populateProductTypePopulation(packageData){
	var arrData=packageData,objList,objUl,objLi,objAnchor;
	var searchTerm=$('#productPkgSearch').val().toUpperCase();
	var objDiv='product-package-list';
	if(searchTerm){
		    	arrData = arrData.filter(function(val) {
		        	var myProductDescription = val.mypDescription.toUpperCase();
					return myProductDescription.indexOf(searchTerm)>-1;
				});
		 }
	if(!isEmpty(arrData)){
	objList = $("#"+objDiv);
	objList.empty();
	objDiv = $('<div>').attr({
	    'id' : 'prodPackageListDiv',
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
		    						'productCode' :cfg.mypProduct,
		    						'productRelClient' : cfg.mypRelClient,
		    						'productlient' : cfg.mypclient,
		    						'productWorkflow':cfg.productWorkflow})
		    						.html('<span class="">'+ cfg.mypDescription+'</span>')
		    						.on('click',function(){
		    							if(!$(this).hasClass('selected-dropdown')){
			    							handleVisualIndication('prodPackageListDiv',this);
			    							var strProductPkgDesc = cfg.mypDescription; 
			    							if(!isEmpty(strProductPkgDesc))
			    								$('#productPkgSearch').val(strProductPkgDesc);
					    					handleNextButtonVisiblity(false);
		    							}
		    						}).appendTo(objLi);
	    		objLi.appendTo(objUl);
	    	});
	    }
	    else{
	    	paintNoDataMsg($("#product-package-list"),'prodPackageListDiv');
	    }
	}
	else{
		paintNoDataMsg($("#product-package-list"),'prodPackageListDiv');
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
function handleProductPackageClear(){
	 var objPayPackageSelected = getSelectedProdPackage();
	 $('#productPkgSearch').val('');
	 handleProductTypePopulation();
	 handleNextButtonVisiblity(true);
 }
 function getSelectedProdPackage(){
	var objSelectedPayCat;
	$('#prodPackageListDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
			objSelectedPayCat = $(this);
			return false;
		}
	});
	return objSelectedPayCat;
}
function getSelectedPOType(){
	var objSelectedPO,objPOData;
	$('#purchaseOrderListDiv').find('li a').each(function(){
		if($(this).hasClass('selected-dropdown')){
		objSelectedPO = $(this);
		objPOData = $.parseJSON(objSelectedPO.attr('poData'));
		selectedFilterLogger=objPOData.code;
		return false;
		}
	});
	return objSelectedPO;
}
function handleCreatePONext(){
var form,inputField,strUrl = '',code = null;
var productCode= null,ProductName,ProductRelClient,ProductClient,enrichType,prodWorkflow;
    var objPOSelected = getSelectedPOType();
    var objProdSelected = getSelectedProdPackage();
   if(!isEmpty(objPOSelected))
		objPOData = $.parseJSON(objPOSelected.attr('poData'));
	if(!isEmpty(objProdSelected))
		objProdData = $.parseJSON(objProdSelected.attr('productPackageData'));
	strUrl = 'newPurchaseOrder.form';	
	    form = document.createElement('FORM');
	    form.name = 'frmMain';
	    form.id = 'frmMain';
	    form.method = 'POST';
	    form.appendChild(createFormField('INPUT', 'HIDDEN',
	        csrfTokenName, tokenValue));
	        if(!isEmpty(objPOData))
	         code=objPOData.code;
		if (!Ext.isEmpty(code)) {
	        form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtClientMode',
	            code));
	    }
	    if(!isEmpty(objProdData)){
	    	productCode=objProdData.mypProduct;
	    	if(!Ext.isEmpty(productCode))
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtProductCode',productCode));
	    
	    	ProductName=objProdData.mypDescription;
	    	if(!Ext.isEmpty(ProductName))
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtProductName',ProductName));
	    
	    	ProductRelClient=objProdData.mypRelClient;
	    	if(!Ext.isEmpty(ProductRelClient))
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtProductRelClient',ProductRelClient));
	    
	    	ProductClient=objProdData.mypclient;
	    	if(!Ext.isEmpty(ProductClient))
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtProductClient',ProductClient));
	    
	    enrichType="PO";
	    	if(!Ext.isEmpty(enrichType))
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'enrichTypePO',enrichType));
	    
	    prodWorkflow=objProdData.productWorkflow;
	    	if(!Ext.isEmpty(prodWorkflow))
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'productWorkflow',prodWorkflow));
	    
	    if(!isEmpty(ProductClient))
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'enteredByClient',ProductClient));
	    
	    if(!isEmpty(enteredByClientDesc))
	    form.appendChild(createFormField('INPUT', 'HIDDEN', 'enteredByClientDesc',enteredByClientDesc));
		    else
		     if(!isEmpty(selectedFilterClientDesc))	{
		    form.appendChild(createFormField('INPUT', 'HIDDEN', 'enteredByClientDesc',selectedFilterClientDesc));
		    }
	    }
	    
	    if(!isEmpty(selectedFilterLogger)){
	       form.appendChild(createFormField('INPUT', 'HIDDEN', 'selectedFilterLogger',selectedFilterLogger));
	    }
	    form.action = strUrl;
	    document.body.appendChild(form);
	    form.submit();
	    document.body.removeChild(form);
}
function handlePurchaseOrderTypePopulation(){
    var objDiv,objUl,objLi,objAnchor;
	var arrData=[{
		"code": "BUYER",
		"desc": getLabel("asbuyer","As Buyer"),
	  },{
		"code": "SELLER",
		"desc": getLabel("AsSeller(OnBehalfofBuyer)","As Seller(On Behalf of Buyer)"),
	  }];
	var objList = $('#purchaseOrderType-list');
	objList.empty();
	objDiv = $('<div>').attr({
	    'id' : 'purchaseOrderListDiv',
	    'class' : ''
	 });
	objUl = $('<ul>').attr({
	    				'class' : ''
	    			});
	objUl.appendTo(objDiv);
	objDiv.appendTo(objList);
	$.each(arrData, function(index, cfg) {
				    	objLi = $('<li>').attr({
				    			'poType' : cfg
				    			});
				    	objAnchor = $('<a>').attr({
				    		                'poData' : JSON.stringify(cfg),
				    						'code' :cfg.code,
				    						'desc' : cfg.desc})
				    						.html('<span class="">'+ cfg.desc+'</span>')
				    						.on('click',function(){
				    							var strProductType=cfg.code;
				    							$('#purchaseOrderType').val(strProductType);
				    							if(!$(this).hasClass('selected-dropdown')){
					    							handleVisualIndication('purchaseOrderListDiv',this);
					    							handlePurchaseTypeClickHandle(cfg);
				    							}
				    						}).appendTo(objLi);
				    					var code=$(objAnchor[0]).attr("code");
				    					var poType=$('#purchaseOrderType').val();
				    					if(code==poType){
				    						$(objAnchor[0]).addClass('selected-dropdown');
				    						}
				    	objLi.appendTo(objUl);
			    });

}
function handlePurchaseTypeClickHandle(cfgType){
var stPOTypeDesc = cfgType.code;
	if(!isEmpty(stPOTypeDesc))
		$('#purchaseOrderType').val(stPOTypeDesc);
	$('#productPkgSearch').val('');
	handleProductTypePopulation();
}
 function handleVisualIndication(div,selectedAnchor){
	 var objDiv = $('#'+div);
	 objDiv.find('a').each(function(){ $(this).removeClass('selected-dropdown') });
	 if(!isEmpty(selectedAnchor) && selectedAnchor !== null)
		 $(selectedAnchor).addClass('selected-dropdown');
 }
 function fetchProduct() {
 	var createPOVal = $('#purchaseOrderType').val();
	var selectedClient=selectedFilterClient;
	if(!isMultipleClientFlag){
		if(selectedClient === 'all'){
			selectedClient = '';
		}
	}
	if (strEntityType === "0")
		var clientDesc = $("#company").val();
	if (strEntityType === "1")
		var clientDesc = $("#clientDescSelect").val();
	var strUrl = 'services/purchaseOrderEntry/products/' + createPOVal
			+ '.json';
	if (clientDesc != null && clientDesc != 'all' && (!isEmpty(clientDesc)) )
		selectedClient = clientDesc;
	if (!isEmpty(selectedClient))
		strUrl += '?$clientFilter=' + selectedClient;
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
function handleClientDropDown(){
	var objClient = $('#clientDescSelect');
	var stUrl ='services/userseek/userclients.json&$sellerCode='+ strSeller,opt=null;
	 
	 objClient.empty();
	    
	 $.ajax({
	    	type : 'POST',
	        url: stUrl,
	        async : false,
	        success: function(data) {
	            if(!isEmpty(data)){
	            	data = data.d.preferences;
	            		if(data.length > 1){
	            			isMultipleClientFlag = true;
	            		}
		            	opt = $('<option/>',{
		            		value: 'all',
	        				text: 'Select'
		            	});
		            	opt.appendTo(objClient);
	            	$.each(data, function(index, cfg) {
	            		opt = $('<option />', {
	        				value: cfg.CODE,
	        				text: cfg.DESCR
	        			});
	        			opt.appendTo(objClient);
	            	});
	            	$('#clientDescSelect').niceSelect("destroy");
	            	$('#clientDescSelect').niceSelect();
	            	if(!isEmpty(selectedClient)){
	            		$("#clientDescSelect").val(selectedClient);
	            		$('#clientDescSelect').niceSelect('update');
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
	            	}
	            }
	        }
	    });
}
function handleClientDropDownAutocomplete() {
	var objClient = $('#clientDescSelect');
	objClient.empty();
	var stUrl = 'services/userseek/userclients.json';
	$.ajax({
				type : 'POST',
				url : stUrl,
				success : function(data) {
					if (!isEmpty(data)) {
						dataClient = data.d.preferences;
						if (!isEmpty(selectedClient)) {
							for (i = 0; i < dataClient.length; i++) {
								if (dataClient[i].CODE === selectedClient)
									selectedClientDesc = dataClient[i].DESCR;
							}
						}
						if (!isEmpty(selectedClientDesc))
							$("#clientDescSelect").val(selectedClientDesc);
						$("#company").val(selectedClient)
						if (strEntityType === '0') {
							$("#corporationDiv").show();
							$("#HLineDiv").show();
						} else if (strEntityType === '1'
								&& dataClient.length > 1) {
							$("#corporationDiv").show();
							$("#HLineDiv").show();
						} else if (strEntityType === '1'
								&& dataClient.length == 1
								|| dataClient.length == 0) {
							$("#corporationDiv").hide();
							$("#HLineDiv").hide();
						}
					}
				}
			});
}
function handleNextButtonVisiblity(isDisabled){
	var objNextButton = $("#btnCreateReceNext");
	if(isDisabled === true){
		objNextButton.prop('disabled',true);
	}
	else if(isDisabled === false){
		objNextButton.prop('disabled',false);
	}
}
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
												label: getLabel('suggestionBoxEmptyText', 'No match found.'),
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
						$('#purchaseOrderType').val("BUYER");
						$('#productPkgSearch').val('');
						$('#company').val(rec.CODE);
						enteredByClientDesc=rec.DESCR;
						handlePurchaseOrderTypePopulation();
						handleProductTypePopulation();
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