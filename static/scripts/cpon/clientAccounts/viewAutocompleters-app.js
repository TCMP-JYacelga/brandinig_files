var objBankAutoCompleter = null;
var objBranchAutoCompleter = null;
var objChargeAccountAutoCompleter= null;
var objCreditAccountAutoCompleter= null;
var objGstAccountAutoCompleter= null;
var objCollChargeAccountAutoCompleter= null;
var objCollGstAccountAutoCompleter= null;

Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

Ext
		.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/clientPayService/app',
			// appFolder : 'app',
			controllers : [],
			requires : [ 'Ext.ux.gcp.AutoCompleter' ],
			launch : function() {
				
				var disabledFlag = false;
				if( autoOrManual == 'AUTO' && mode == 'EDIT' )
				{
					disabledFlag = true;
				}
				
				var fieldGreyClass = 'xn-form-text w15_7 xn-suggestion-box';
				if (isAuthorised && mode == 'EDIT' &&  isUpdated=='false') {
					fieldGreyClass  ='xn-form-text w15_7 xn-suggestion-box grey'
				}
				objBankAutoCompleter = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 2',
					fieldCls : fieldGreyClass,
					name : 'name',
					width : 307,
					itemId : 'bankFilter',
					cfgUrl : 'cpon/clientServiceSetup/bankFilterList.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : 20,
					cfgSeekId : 'name',
					enableQueryParam:false,
					cfgRootNode : 'd.filter',
					disabled : disabledFlag,
					cfgDataNode1 : 'value',
					minChars : 1,
					renderTo : 'systemBankDiv',
					listeners : {
						'change' : function(combo, newValue, oldValue, eOpts) {	
						if (Ext.isEmpty(newValue)) {					
							$("#bankCode").val('');
							$("#systemBank").val('');
							
						}
						if(oldValue != undefined && newValue != oldValue )
						{
							if (objBranchAutoCompleter != undefined)
								objBranchAutoCompleter.setValue('');
						}
					}
					}
				});

				$.ajax({
					url : "cpon/clientServiceSetup/bankFilterDesc.json",
				//	contentType : "application/json",
					type : "POST",
					data : {
						query:systemBankCode,
						systemBankFlag:systemBankFlagVar,
						id:encodeURIComponent(parentkey)
					},
					success : function(data) {						
						if (data.d.filter[0]) {							
							objBankAutoCompleter
									.setValue(data.d.filter[0].value);
							systemBankDescDefault = data.d.filter[0].name;							
							$("#bankCode").val(systemBankDescDefault);							
						}

					}
				});

				if (("Y" == systemBankFlagVar) || (isAuthorised === 'true' && mode == 'EDIT' && isUpdated=='false') || acctName  == 'PDCL_CHQPC' || acctName  == 'CL_CHQPC' || acctName  == 'CL_WTAX' || acctName  == 'PAYOUT_ACC') {
					objBankAutoCompleter.setDisabled(true);
				} else {
					objBankAutoCompleter.setDisabled(false);
				}
				objBankAutoCompleter.cfgExtraParams = [ {
					key : 'systemBankFlag',
					value : systemBankFlagVar
				}, {
					key : 'id',
					value : encodeURIComponent(parentkey)
				} ];
				objBankAutoCompleter
						.on(
								'collapse',
								function() {
									if (objBankAutoCompleter.valueModels) {
										var bcode = objBankAutoCompleter.valueModels[0].raw.name;										
										objBranchAutoCompleter.enable();
										objBranchAutoCompleter.cfgExtraParams = [
												{
													key : 'bankCode',
													value : bcode
												},
												{
													key : 'systemBankFlag',
													value : systemBankFlagVar
												},
												{
													key : 'id',
													value : encodeURIComponent(parentkey)
												} ];
										systemBankCode = bcode;									
										$("#bankCode").val(systemBankCode);
									}
								});
				objBranchAutoCompleter = Ext
						.create(
								'Ext.ux.gcp.AutoCompleter',
								{
									padding : '1 0 0 2',
									fieldCls : fieldGreyClass,
									name : 'bankDesc',
									width : 307,
									itemId : 'branchFilter',
									cfgUrl : 'cpon/clientServiceSetup/branchFilterList.json',
									cfgProxyMethodType : 'POST',
									cfgQueryParamName : 'qfilter',
									cfgRecordCount : 20,
									cfgSeekId : 'branchSeek',
									enableQueryParam:false,
									cfgRootNode : 'd.filter',
									cfgDataNode1 : 'name',
									disabled : disabledFlag,
									minChars : 1,
									renderTo : 'systemBranchDiv',
									listeners : {
										'change' : function(combo, newValue, oldValue, eOpts) {	
										if (Ext.isEmpty(newValue)) {					
											$("#systemBranch").val('');		
										}
									}
									}
								});
				if ( (partyOnboardFlg== 'E' && "Y" == systemBankFlagVar) || acctName  == 'PDCL_CHQPC' || acctName  == 'CL_CHQPC' || acctName  == 'CL_WTAX' || acctName  == 'PAYOUT_ACC') {
					objBranchAutoCompleter.setDisabled(true);
				}
				if (objBankAutoCompleter.valueModels) {
				objBranchAutoCompleter.cfgExtraParams = [
												{
													key : 'bankCode',
													value : systemBankCode
												},
												{
													key : 'systemBankFlag',
													value : systemBankFlagVar
												},
												{
													key : 'id',
													value : encodeURIComponent(parentkey)
												} ];
				}
				if((mode == 'ADD' || mode == 'EDIT') &&!Ext.isEmpty(systemBranchCode))
				{
				var branchURL = "cpon/clientServiceSetup/branchFilterList.json?systemBankFlag="
										+ systemBankFlagVar
										+ "&bankCode="
										+ systemBankCode
										+ "&id="
										+ encodeURIComponent(parentkey);
				if (!Ext.isEmpty(systemBranchCode))
					branchURL = branchURL + "&branchCode="+systemBranchCode;
				var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
				 while (arrMatches = strRegex.exec(branchURL)) {
			    	 objParam[arrMatches[1]] = arrMatches[2];
			   	 }
			   	 var strGeneratedUrl = branchURL.substring(0, branchURL.indexOf('?'));
			     branchURL = strGeneratedUrl		
					$.ajax({
								url : branchURL,
							//	contentType : "application/json",
								type : "POST",
								data : objParam,
								success : function(data) {									
									if (data.d.filter) {
									if(!Ext.isEmpty(systemBranchCode) && !Ext.isEmpty(strBranchIdType))
									{	
										var sysBranchDescRetrived = false;
										$.each( data.d.filter, function( index, objBranch ) {
											  if(strBranchIdType === objBranch.featureType && systemBranchCode === objBranch.value)
											  {
													objBranchAutoCompleter.setValue(objBranch.name); 
													$("#systemBranchRelativeId").val(objBranch.featureType);
													$("#branchIdType").val(objBranch.featureType);
													$("#psd2Flag").val(objBranch.featureMode);
													$("#mt920Flag").val(objBranch.mt920Mode);
													sysBranchDescRetrived = true;
											  }
											});
										if(strBranchIdType==='SYSTEM' && !sysBranchDescRetrived
												&& (acctName  === 'PDCL_CHQPC' || acctName  === 'CL_CHQPC'))
										{
											objBranchAutoCompleter.setValue(systemBranchDesc);
											$("#systemBranchRelativeId").val(strBranchIdType);
											$("#branchIdType").val(strBranchIdType);
										}
									}
									else
									{
										if ( partyOnboardFlg!= 'E')
										{
											objBranchAutoCompleter
											.setValue(data.d.filter[0].name); 
										}										
										systemBranchDescDefault = data.d.filter[0].value;										
										$("#systemBranch").val(systemBranchDescDefault);
										$("#systemBranchRelativeId").val(data.d.filter[0].featureType);
										$("#branchIdType").val(data.d.filter[0].featureType);
										$("#psd2Flag").val(data.d.filter[0].featureMode);
										$("#mt920Flag").val(data.d.filter[0].mt920Mode);
									}
										
									}

								}
							});
				}
				
				objBranchAutoCompleter
						.on(
								'collapse',
								function() {
									if (objBranchAutoCompleter.valueModels) {
										var brcode = objBranchAutoCompleter.valueModels[0].raw.value;
										systemBranchCode = brcode;										
										$("#systemBranch").val(systemBranchCode);
										$("#systemBranchRelativeId").val(objBranchAutoCompleter.valueModels[0].raw.featureType);
										$("#branchIdType").val(objBranchAutoCompleter.valueModels[0].raw.featureType);
										$("#psd2Flag").val(objBranchAutoCompleter.valueModels[0].raw.featureMode);
										$("#mt920Flag").val(objBranchAutoCompleter.valueModels[0].raw.mt920Mode);
										$("input[name='lmsBalanceRetrieval'][value='N']").prop('checked', true);
										$('#mt920ResType').val('');
										$('#MT920Select').hide();
										showPSD2Flag();
										showPSD2BalRetLMS();
										showPSD2MoveHandLMS();
										showMT920Flag();
									}
								});
				
				if($('#linkedChargeAcctDiv').length !== 0) {
				//Charge Account
				objChargeAccountAutoCompleter = Ext
						.create(
								'Ext.ux.gcp.AutoCompleter',
								{
									padding : '1 0 0 2',
									fieldCls : fieldGreyClass,
									name : 'pLinkedChargeAcct',
									width : 307,
									itemId : 'pLinkedChargeAcct',
									cfgUrl : 'cpon/clientServiceSetup/getAccountList.json',
									editable : true,
									cfgProxyMethodType : 'POST',
									cfgQueryParamName : 'qfilter',
									cfgRecordCount : 20,
									cfgSeekId : 'chargeAcctSeek',
									enableQueryParam : false,
									cfgRootNode : 'd.filter',
									cfgDataNode1 : 'name',
									disabled : disabledFlag,
									triggerAction : null != $("#ccyCode").val(),
									minChars : 1,
									renderTo : 'linkedChargeAcctDiv',
									listeners : {
										'change' : function(combo, newValue, oldValue, eOpts) {	
										if (!Ext.isEmpty(newValue)) {					
											objChargeAccountAutoCompleter.cfgExtraParams = getParamValues('DISB_CHG',newValue);
										}
									}
									}
								});
				if ((mode == 'ADD' || mode == 'EDIT')) {
					if ($("#hiddenService_paymentChargeAcct").val() == "Y") {
						objChargeAccountAutoCompleter.setValue("");
						objChargeAccountAutoCompleter.setDisabled(true);
					}
					if (!Ext.isEmpty(pLinkedChargeAcct)) {
						objChargeAccountAutoCompleter.setValue(pLinkedChargeAcct);
					}
				}
			}
				if($('#linkedCreditAcctDiv').length !== 0) {
				// Credit Account
				objCreditAccountAutoCompleter = Ext
						.create(
								'Ext.ux.gcp.AutoCompleter',
								{
									padding : '1 0 0 2',
									fieldCls : fieldGreyClass,
									name : 'pLinkedCreditAcct',
									width : 307,
									itemId : 'pLinkedCreditAcct',
									cfgUrl : 'cpon/clientServiceSetup/getAccountList.json',
									editable : true,
									cfgProxyMethodType : 'POST',
									cfgQueryParamName : 'qfilter',
									cfgRecordCount : 20,
									cfgSeekId : 'creditAcctSeek',
									enableQueryParam : false,
									cfgRootNode : 'd.filter',
									cfgDataNode1 : 'name',
									disabled : disabledFlag,
									minChars : 1,
									renderTo : 'linkedCreditAcctDiv',
									listeners : {
										'change' : function(combo, newValue, oldValue, eOpts) {	
										if (!Ext.isEmpty(newValue)) {					
											objCreditAccountAutoCompleter.cfgExtraParams = getParamValues('DISB_DEBIT',newValue);
										}
									}
									}
								});
				if ((mode == 'ADD' || mode == 'EDIT')) {
					if($("#hiddenService_paymentCreditAcc").val() == "Y") {
			        	objCreditAccountAutoCompleter.setValue("");
			        	objCreditAccountAutoCompleter.setDisabled(true);
			        }
					if (!Ext.isEmpty(pLinkedCreditAcct)) {
						objCreditAccountAutoCompleter.setValue(pLinkedCreditAcct);
					}
				}
			}
				if($('#linkedGstAcctDiv').length !== 0) {
				// Gst Account
				objGstAccountAutoCompleter = Ext
						.create(
								'Ext.ux.gcp.AutoCompleter',
								{
									padding : '1 0 0 2',
									fieldCls : fieldGreyClass,
									name : 'pLinkedGstAcct',
									width : 307,
									itemId : 'pLinkedGstAcct',
									cfgUrl : 'cpon/clientServiceSetup/getAccountList.json',
									editable : true,
									cfgProxyMethodType : 'POST',
									cfgQueryParamName : 'qfilter',
									cfgRecordCount : 20,
									cfgSeekId : 'gstAcctSeek',
									enableQueryParam : false,
									cfgRootNode : 'd.filter',
									cfgDataNode1 : 'name',
									disabled : disabledFlag,
									minChars : 1,
									renderTo : 'linkedGstAcctDiv',
									listeners : {
										'change' : function(combo, newValue, oldValue, eOpts) {	
										if (!Ext.isEmpty(newValue)) {					
											objGstAccountAutoCompleter.cfgExtraParams = getParamValues('GST_PAY',newValue);
										}
									}
									}
								});
					if (mode == 'ADD' || mode == 'EDIT') {
						if ($("#hiddenService_paymentGstAcct").val() == "Y") {
							objGstAccountAutoCompleter.setValue("");
							objGstAccountAutoCompleter.setDisabled(true);
						}
						if (!Ext.isEmpty(pLinkedGstAcct)) {
							objGstAccountAutoCompleter.setValue(pLinkedGstAcct);
						}
					}
				}
				if($('#collLinkedChargeAccountDiv').length !== 0) {
				// Collection Charge Account
				objCollChargeAccountAutoCompleter = Ext
						.create(
								'Ext.ux.gcp.AutoCompleter',
								{
									padding : '1 0 0 2',
									fieldCls : fieldGreyClass,
									name : 'collLinkedChargeAcct',
									width : 307,
									itemId : 'collLinkedChargeAcct',
									cfgUrl : 'cpon/clientServiceSetup/getAccountList.json',
									editable : true,
									cfgProxyMethodType : 'POST',
									cfgQueryParamName : 'qfilter',
									cfgRecordCount : 20,
									enableQueryParam : false,
									cfgRootNode : 'd.filter',
									cfgDataNode1 : 'name',
									disabled : disabledFlag,
									minChars : 1,
									renderTo : 'collLinkedChargeAccountDiv',
									listeners : {
										'change' : function(combo, newValue, oldValue, eOpts) {	
										if (!Ext.isEmpty(newValue)) {					
											objCollChargeAccountAutoCompleter.cfgExtraParams = getParamValues('CL_CHG',newValue);
										}
									}
									}
								});
				if((mode == 'ADD' || mode == 'EDIT') &&!Ext.isEmpty(collLinkedChargeAccount))
				{
					objCollChargeAccountAutoCompleter.setValue(collLinkedChargeAccount);
				}
				
				if("Y" == $("#hiddenService_collectionsChargeAcct").val())
				{
					objCollChargeAccountAutoCompleter.setDisabled(true);
				}
				}
				if($('#collLinkedGstAccountDiv').length !== 0) {
				//Collection Gst Account
				objCollGstAccountAutoCompleter = Ext
						.create(
								'Ext.ux.gcp.AutoCompleter',
								{
									padding : '1 0 0 2',
									fieldCls : fieldGreyClass,
									name : 'collLinkedGstAcct',
									width : 307,
									itemId : 'collLinkedGstAcct',
									cfgUrl : 'cpon/clientServiceSetup/getAccountList.json',
									editable : true,
									cfgProxyMethodType : 'POST',
									cfgQueryParamName : 'qfilter',
									cfgRecordCount : 20,
									enableQueryParam : false,
									cfgRootNode : 'd.filter',
									cfgDataNode1 : 'name',
									disabled : disabledFlag,
									minChars : 1,
									renderTo : 'collLinkedGstAccountDiv',
									listeners : {
										'change' : function(combo, newValue, oldValue, eOpts) {	
										if (!Ext.isEmpty(newValue)) {					
											objCollGstAccountAutoCompleter.cfgExtraParams = getParamValues('GST_COL',newValue);
										}
									}
									}
								});
				if((mode == 'ADD' || mode == 'EDIT') &&!Ext.isEmpty(collLinkedGstAccount))
				{
					objCollGstAccountAutoCompleter.setValue(collLinkedGstAccount);
				}
				
				if("Y" == $("#hiddenService_collectionsGstAcct").val())
				{
					objCollGstAccountAutoCompleter.setDisabled(true);
				}
				}
			}
		
		
		

		});
function getLabel(key, defaultText) {
	return (cponLabelsMap && !Ext.isEmpty(cponLabelsMap[key])) ? cponLabelsMap[key]
			: defaultText
}

function getFilterQuery(newValue) {
	var query = "activeflag eq 'Y' " ;
	
	if(null != $("#ccyCode").val())
		query = query + " and ccy eq '" + $("#ccyCode").val() + "'";
	
	if(null != objBranchAutoCompleter && 'Y' === sysbranchOption)
		query = query + " and accsystembr eq '" + systemBranchCode + "'";
	
	if(null != newValue && "%" !== newValue)
		query = query + " and cmstAccountNmbr lk '" + newValue + "'";
	
	return query;
}


function setcfgExtraParams(){
	
	if (null != objChargeAccountAutoCompleter && objChargeAccountAutoCompleter.valueModels) {
		objChargeAccountAutoCompleter.cfgExtraParams = getParamValues('DISB_CHG');
	}
	if (null != objCreditAccountAutoCompleter && objCreditAccountAutoCompleter.valueModels) {
		objCreditAccountAutoCompleter.cfgExtraParams = getParamValues('DISB_DEBIT');
	}
	if (null != objGstAccountAutoCompleter && objGstAccountAutoCompleter.valueModels) {
		objGstAccountAutoCompleter.cfgExtraParams = getParamValues('GST_PAY');
	}
	if (null != objCollChargeAccountAutoCompleter && objCollChargeAccountAutoCompleter.valueModels) {
		objCollChargeAccountAutoCompleter.cfgExtraParams = getParamValues('CL_CHG');
	}
	if (null != objCollGstAccountAutoCompleter && objCollGstAccountAutoCompleter.valueModels) {
		objCollGstAccountAutoCompleter.cfgExtraParams = getParamValues('GST_COL');
	}
}


function getParamValues(acctType,newValue){
	return [ {
		key : '$filter',
		value : getFilterQuery(newValue)
	}, {
		key : '$id',
		value : encodeURIComponent(parentkey)
	}, {
		key : '$acctType',
		value : acctType
	}, {
		key : '$ccy',
		value : $("#ccyCode").val()
	}, {
		key : '$sysBankFlag',
		value : $("#hiddenService_systemBankFlag").val()
	}, {
		key : '$clientId',
		value : clientId
	},{
		key : '$accoutNumber',
		value : $("#acctNmbr").val()
	}
	];
}