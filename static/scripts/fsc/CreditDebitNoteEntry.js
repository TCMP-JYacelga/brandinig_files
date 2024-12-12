
function initCreditDebitNoteEntry() {
	handleBuyerSellerPopulation();
	handleProductTypePopulation();
	handleClientDropDown();
	$('#productPkgSearch').keyup(function() {
				handleProductTypePopulation();
			});
}
function initCreditDebitNoteEntryAutoComplete() {
	handleBuyerSellerPopulation();
	handleProductTypePopulation();
	$('#productPkgSearch').keyup(function() {
				handleProductTypePopulation();
			});
}
function handleBuyerSellerPopulation() {
	var objDiv, objUl, objLi, objAnchor,arrData=[];
	var noteType = $('#invoiceNoteType').val();
	if(noteType === 'CREDIT'){
		arrData = [{
					"code" : "SELLER",
					"desc" : getLabel("asseller","As Seller")
				}];
	}
	else{
		arrData = [{
					"code" : "BUYER",
					"desc" : getLabel("asbuyer","As Buyer")
				}, {
					"code" : "SELLER",
					"desc" : getLabel("asseller","As Seller")
				}];
	}
	var objList = $('#buyerSellerType-list');
	objList.empty();
	objDiv = $('<div>').attr({
				'id' : 'buyerSellerListDiv',
				'class' : ''
			});
	objUl = $('<ul>').attr({
				'class' : ''
			});
	objUl.appendTo(objDiv);
	objDiv.appendTo(objList);
	$.each(arrData, function(index, cfg) {
				objLi = $('<li>')
				objAnchor = $('<a>').attr({
							'buyerSellerData' : JSON.stringify(cfg),
							'code' : cfg.code,
							'desc' : cfg.desc
						}).html('<span class="">' + cfg.desc + '</span>').on(
						'click', function() {
							var strProductType = cfg.code;
							$('#userMode').val(strProductType);
							if (!$(this).hasClass('selected-dropdown')) {
								handleVisualIndication('buyerSellerListDiv',
										this);
								handlePurchaseTypeClickHandle(cfg);
								handleNextButtonVisiblity(true);
								}
						}).appendTo(objLi);
				var code = $(objAnchor[0]).attr("code");
				var buyerSellerMode = $('#userMode').val();
				if (code == buyerSellerMode) {
					$(objAnchor[0]).addClass('selected-dropdown');
				}
				objLi.appendTo(objUl);
			});

}

function resetSessionClient() {
	var noteType = $('#invoiceNoteType').val();
	strClient = $('#clientDescSelect').val();
	if (!isEmpty(strClient) && (strClient === 'all')) {
		resetClient();
		if(noteType === 'CREDIT')
			$('#userMode').val("SELLER");
		else
			$('#userMode').val("BUYER");
			
		$('#productPkgSearch').val('');
		initCreditDebitNoteEntry();
	} else if (!isEmpty(strClient)) {
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
	var strUrl = Ext.String.format('services/swclient/{0}.json', strClient);
	var noteType = $('#invoiceNoteType').val();
	Ext.Ajax.request({
				url : strUrl,
				method : "GET",
				success : function(response) {
					if(noteType === 'CREDIT')
						$('#userMode').val("SELLER");
					else
						$('#userMode').val("BUYER");
						
					$('#productPkgSearch').val('');
					handleBuyerSellerPopulation();
					handleProductTypePopulation();
					handleNextButtonVisiblity(true);
				},
				failure : function(response) {
				}
			});
}

function goToCenterPage(strUrl) {
	var frm;
	frm = document.getElementById('frmMain');
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName,
			tokenValue));
	frm.submit();;
}

function handleProductTypePopulation() {
	var prodPackageData = fetchProduct();
	populateProductTypePopulation(prodPackageData);
}

function populateProductTypePopulation(packageData) {
	var arrData = packageData, objList, objUl, objLi, objAnchor;
	var searchTerm = $('#productPkgSearch').val().toUpperCase();
	var objDiv = 'product-package-list';
	if (searchTerm) {
		arrData = arrData.filter(function(val) {
					var myProductDescription = val.mypDescription.toUpperCase();
					return myProductDescription.indexOf(searchTerm) > -1;
				});
	}
	if (!isEmpty(arrData)) {
		objList = $("#" + objDiv);
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
		if (!isEmpty(arrData) && arrData.length > 0) {
			$.each(arrData, function(index, cfg) {
						objLi = $('<li>');
						hasTaxAgency = true;
						objAnchor = $('<a>').attr({
									'productPackageData' : JSON.stringify(cfg)
								}).html('<span class="">' + cfg.mypDescription
								+ '</span>').on('click', function() {
							if (!$(this).hasClass('selected-dropdown')) {
								handleVisualIndication('prodPackageListDiv',
										this);
								var strProductPkgDesc = cfg.mypDescription;
								if (!isEmpty(strProductPkgDesc))
									$('#productPkgSearch')
											.val(strProductPkgDesc);
								var objByerSeller = getSelectedBuyerSeller();
								var buyerSellerCode = $(objByerSeller[0]).attr("code");
								var noteType = $('#invoiceNoteType').val();
								if(buyerSellerCode === 'BUYER' && noteType === 'CREDIT')
									handleNextButtonVisiblity(true);
								else
									handleNextButtonVisiblity(false);
							}
						}).appendTo(objLi);
						objLi.appendTo(objUl);
					});
		} else {
			paintNoDataMsg($("#product-package-list"), 'prodPackageListDiv');
		}
	} else {
		paintNoDataMsg($("#product-package-list"), 'prodPackageListDiv');
	}
}

function paintNoDataMsg(listId, divId) {
	var objList, objUl, objDiv, objLi, objAnchor;
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
	objLi = $('<li>');
	objAnchor = $('<span>').attr({
				'class' : 'ft-padding'
			}).html(getLabel('noDatapresent', 'No Data Present')).appendTo(objLi);
	objLi.appendTo(objUl);
}

function handleProductPackageClear() {
	var objPayPackageSelected = getSelectedProdPackage();
	$('#productPkgSearch').val('');
	handleProductTypePopulation();
	handleNextButtonVisiblity(true);
}

function getSelectedProdPackage() {
	var objSelectedPayCat;
	$('#prodPackageListDiv').find('li a').each(function() {
				if ($(this).hasClass('selected-dropdown')) {
					objSelectedPayCat = $(this);
					return false;
				}
			});
	return objSelectedPayCat;
}

function getSelectedBuyerSeller() {
	var objSelectedPO;
	$('#buyerSellerListDiv').find('li a').each(function() {
				if ($(this).hasClass('selected-dropdown')) {
					objSelectedPO = $(this);
					return false;
				}
			});
	return objSelectedPO;
}

function handleCreatePONext(strUrl) {
	var form, inputField, code = null;
	var productCode = null, productName, productRelClient, productClient;
	var objProdSelected = getSelectedProdPackage();
	if (!isEmpty(objProdSelected))
		objProdData = $.parseJSON(objProdSelected.attr('productPackageData'));
	form = document.getElementById('frmMain');
	form.method = 'POST';

	form.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName,
			tokenValue));

	if (!isEmpty(objProdData)) {
		productCode = objProdData.mypProduct;
		if (!Ext.isEmpty(productCode))
			form.appendChild(createFormField('INPUT', 'HIDDEN', 'scmMyProduct',
					productCode));

		productName = objProdData.mypDescription;
		if (!Ext.isEmpty(productName))
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					'scmMyProductName', productName));

		productRelClient = objProdData.mypRelClient;
		if (!Ext.isEmpty(productRelClient))
			form.appendChild(createFormField('INPUT', 'HIDDEN', 'clientCode',
					productRelClient));

		productClient = objProdData.mypclient;
		if (!Ext.isEmpty(productClient))
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					'enteredByClient', productClient));
					
		if (!Ext.isEmpty(strClientDesc))
			form.appendChild(createFormField('INPUT', 'HIDDEN',
					'enteredByClientDesc', strClientDesc));

	}
	form.action = strUrl;
	form.submit();
}

function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function handlePurchaseTypeClickHandle(cfgType) {
	var strBuyerSeller = cfgType.code;
	if (!isEmpty(strBuyerSeller))
		$('#userMode').val(strBuyerSeller);
	$('#productPkgSearch').val('');
	handleProductTypePopulation();
}
function handleVisualIndication(div, selectedAnchor) {
	var objDiv = $('#' + div);
	objDiv.find('a').each(function() {
				$(this).removeClass('selected-dropdown')
			});
	if (!isEmpty(selectedAnchor) && selectedAnchor !== null)
		$(selectedAnchor).addClass('selected-dropdown');
}

function fetchProduct() {
	var clientDesc;
	var invoiceNoteType = $('#invoiceNoteType').val();
	var buyerSeller = $('#userMode').val();
	var selectedClient = strClient;
	var objFilterParam = {};
	if(strEntityType==="1"){
	clientDesc = $("#clientDescSelect").val();
	}
	if(strEntityType==="0"){
	clientDesc = $("#company").val();
	}
	var strUrl = 'services/creditDebitNoteProducts/' + buyerSeller + '.json';
	if (clientDesc != null && clientDesc != 'all')
		selectedClient = clientDesc;
	if (!isEmpty(selectedClient))
		objFilterParam["$clientFilter"] = selectedClient;
	if (!isEmpty(invoiceNoteType))
		objFilterParam["$invoiceNoteType"] = invoiceNoteType;

	var responseData = null;
	$.ajax({
				type : 'POST',
				url : strUrl,
				data : objFilterParam,
				async : false,
				success : function(data) {
					responseData = data;
				}
			});
	return responseData;
}

function handleClientDropDown() {
	var objClient = $('#clientDescSelect');
	var stUrl = 'services/userseek/userclients.json&$sellerCode=' + strSeller, opt = null;

	objClient.empty();

	$.ajax({
				type : 'POST',
				url : stUrl,
				success : function(data) {
					if (!isEmpty(data)) {
						data = data.d.preferences;

						opt = $('<option/>', {
									value : 'all',
									text : getLabel('select','Select')
								});
						opt.appendTo(objClient);
						
						$.each(data, function(index, cfg) {
									opt = $('<option />', {
												value : cfg.CODE,
												text : cfg.DESCR
											});
									opt.appendTo(objClient);
								});
						$('#clientDescSelect').niceSelect("destroy");
						$('#clientDescSelect').niceSelect();
						if (!isEmpty(strClient)){
							$("#clientDescSelect").val(strClient);
							$("#clientDescSelect").niceSelect('update');
						}
							
						if (strEntityType === '0') {
							$("#corporationDiv").show();
							$("#HLineDiv").show();
						} else if (strEntityType === '1' && data.length > 1) {
							$("#corporationDiv").show();
							$("#HLineDiv").show();
						} else if (strEntityType === '1' && data.length == 1
								|| data.length == 0) {
							$("#corporationDiv").hide();
							$("#HLineDiv").hide();
						}
					}
				}
			});
}

function handleNextButtonVisiblity(isDisabled) {
	var objNextButton = $("#btnCreateReceNext");
	if (isDisabled === true) {
		objNextButton.prop('disabled', true);
	} else if (isDisabled === false) {
		objNextButton.prop('disabled', false);
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
						$('#company').val(rec.CODE);
						strClientDesc=rec.DESCR;
						var noteType = $('#invoiceNoteType').val();
						if(noteType === 'CREDIT')
						$('#userMode').val("SELLER");
					else
						$('#userMode').val("BUYER");
						
					$('#productPkgSearch').val('');
					handleBuyerSellerPopulation();
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