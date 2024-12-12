/**
 * @class GCP.controller.PaymentInitiationController
 * @extends Ext.app.Controller
 * @author Vinay Thube
 */

/**
 * This controller is prime controller in Payment Summary which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like Payment Initiation.
 */

Ext.define('GCP.controller.PaymentInitiationController', {
	extend : 'Ext.app.Controller',
	requires : [Ext.ux.gcp.DateUtil],
	views : ['GCP.view.PaymentTranscationGridFilterView'],

	refs : [/*Quick Filter starts.... */
			{
				ref : 'filterView',
				selector : 'filterView'		
			},{
				ref:'paymentTranscationGridFilterView',
				selector:'paymentTranscationGridFilterView'
			},{
				ref :'batchProduct',
				selector:'paymentTranscationGridFilterView combo[itemId=batchProduct]'
			},{
				ref :'batchReceiverAccount',
				selector:'paymentTranscationGridFilterView combo[itemId=batchReceiverAccount]'		
			}, {
				ref :'batchReceiverName',
				selector:'paymentTranscationGridFilterView  textfield[itemId=batchReceiverName]'		
			},{
				ref:'batchInstrumentEntryInGridLayout',
				selector:'batchInstrumentEntryInGridLayout[itemId="batchInstrumentEntryInGridLayout"]'	
			}
			/*Quick Filter starts.... */
			],
	config : {
		selectedReceiverDirectoryCode : 'all',
		isSinglePayment : true,
		selectedReceiverDetails : null,
		selectedProduct : null,
		selectedDefineBankReciver : null,
		selectedInstType : null,
		selectedBeneType : null,
		selectedProdTemplateCategory : null,
		productFilterVal:'all',
		productFilterDesc: null,
		receiverAccountVal:'all',
		receiverAccountDesc: null,
		receiverNameVal:'',
		operatorVal: 'le',
		amoutVal: '',
		statusVal: 'all',
		defaultAction : true,
		isRcvrNameSelected : false,
		tempRcvrName : null
		
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		$(document).on('productComboSelect', function(event,comboValue, comboDesc) {
				me.productFilterVal=comboValue;
				me.productFilterDesc = comboDesc;
				me.handleProductChangeInQuickFilter();
		});
		$(document).on('receiverAccountComboSelect',function(event,comboValue,comboDesc){
			me.receiverAccountVal=comboValue;
			me.receiverAccountDesc = comboDesc;
			me.handleReceiverAccountChangeInQuickFilter();
			$('#txnFilterReceiverAccount').val(comboValue);
			txnFilterReceiverAccountSelected();
		});
		$(document).on("txnSearchActionClicked",function(event){
				me.handleFilterSearchAction();
		});
		$(document).on('advFilterReceiverNameSelected',function(event,value){
			me.receiverNameVal=value;
			me.getBatchReceiverName().setValue(value);
		});
		$(document).on('advFilterProductSelected',function(event,value){
			me.productFilterVal=value;
			me.getBatchProduct().setValue(value);
		});
		$(document).on('advFilterReceiverAccountSelected',function(event,value){
			me.receiverAccountVal=value;
			me.receiverAccountDesc = value;
			me.getBatchReceiverAccount().setValue(value);
		});
		$(document).on('paintSelectedReceiver',function(event,strMyProduct){
			batchUsingReceiver = true;
			me.paintSelectedReceiver(strMyProduct);
		});
		$(document).on('click', function(event) {
		  if (!$(event.target).closest('.x-grid-row-editor').length
		  && !$(event.target).closest('.x-boundlist').length
		  && !$(event.target).closest('.ui-dialog').length) {
		    var gridLayout = me.getBatchInstrumentEntryInGridLayout();
		    if (gridLayout) {
			    var grid = gridLayout.getGrid(); 
				if (grid && grid.rowEditor && false
					&& grid.rowEditor.editing) {
								//grid.rowEditor.getEditor().allowFirstFieldFocus = true;
								//grid.rowEditor.startEdit();
						$(function() {
							$( "#dialog-confirm" ).dialog({
							  resizable: false,
							  height:140,
							  modal: true,
							  buttons: {
								Save: function() {
									grid.rowEditor.completeEdit();
								    $( this ).dialog( "close" );
								},
								"Cancel Edit": function(){
									grid.rowEditor.cancelEdit();
									$( this ).dialog( "close" );
								}
							  },
							  onClose: function() {
								grid.rowEditor.getEditor().allowFirstFieldFocus = true;
								grid.rowEditor.startEdit();
							  }
							});
						});
						//event.preventDefailt();
					}
		    }
		  }
		});
		me.control({
			'filterView' : {
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					filterView = me.getFilterView();		
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}

				},
				appliedFilterDelete: function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showTransactionAdvanceFilterPopup();
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'paymentTranscationGridFilterView combo[itemId="batchProduct"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.productFilterVal)) {
						combo.setValue(me.productFilterVal);
					}
				}
			},
			'paymentTranscationGridFilterView combo[itemId="batchReceiverAccount"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.receiverAccountVal)) {
						combo.setValue(me.receiverAccountVal);
					}
				}
			},
			'paymentTranscationGridFilterView AutoCompleter[itemId="batchReceiverName"]' : {
				'select':function(combo,record){
					me.receiverName = record[0].data.VALUE;
					me.receiverNameAutoCompleterSelect(combo.getValue(),combo.getRawValue());
					me.isRcvrNameSelected = true;
				},
				'change' : function(combo, record, oldVal) {
					if (Ext.isEmpty(combo.getValue()) && me.defaultAction) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.receiverNameAutoCompleterChange(combo.getValue(),combo.getRawValue());
							me.isRcvrNameSelected = true;
							me.tempRcvrName = oldVal;
						}						
					}
					else{
						me.isRcvrNameSelected = false;
						me.tempRcvrName = oldVal;
					}
					me.defaultAction = true;
				},
				'keyup' : function(combo, e, eOpts){
					me.isRcvrNameSelected = false;
				},
				'blur' : function(combo, The, eOpts ){
					if(me.isRcvrNameSelected == false  
							&& !Ext.isEmpty(combo.getRawValue())
							&&  me.tempRcvrName != combo.getRawValue()){
						me.receiverNameAutoCompleterSelect(combo.getValue(),combo.getRawValue());
						me.tempRcvrName = combo.getRawValue();
					}
				}
			}
		});
	},
	/*---------------------------- Filter handling Starts---------------------------------*/
	handleProductChangeInQuickFilter:function(){
		var me = this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='Q',
			me.setDataForFilter();	
			ObjBatchEntryGridView.refreshData();
		}
	},
	handleReceiverAccountChangeInQuickFilter:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='Q',
			me.setDataForFilter();	
			ObjBatchEntryGridView.refreshData();
		}
	},
	handleReceiverNameAutoCompleteInQuickFilter:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='Q',
			me.setDataForFilter();	
			ObjBatchEntryGridView.refreshData();
		}
		
	},
	setDataForFilter:function(){		
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout(),
			filterView = me.getFilterView();
		  var arrQuickJson = {},filterJson =[];
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			if(ObjBatchEntryGridView.filterApplied==='Q'){
				ObjBatchEntryGridView.filterData = me.getQuickFilterQueryJson();
				me.filterData = me.getQuickFilterQueryJson();
				ObjBatchEntryGridView.advFilterData={};
				me.advFilterData={};
				me.resetAdvanceFilterPopupFields();
				filterJson = generateFilterArray(ObjBatchEntryGridView.filterData);				
			}else if(ObjBatchEntryGridView.filterApplied==='A'){
				ObjBatchEntryGridView.filterData = me.getQuickFilterQueryJson();
				var objJson = getTxnAdvanceFilterQueryJson();
			//	ObjBatchEntryGridView.advFilterData = getTxnAdvanceFilterQueryJson();
				 var reqJson = me.findInAdvFilterData(objJson,"ReceiverNamePDT");
			   	if(!Ext.isEmpty(reqJson)) {
				    arrQuickJson =ObjBatchEntryGridView.filterData;
				    arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,"RecieverName");
				    me.filterData = arrQuickJson;
				  } else {
					  	$("#txnFilterReceiverName").val("");
						receiverNameSelectedValue = null;
						me.defaultAction = false;
						me.getBatchReceiverName().reset();
						me.receiverNameVal = null;
				  }
				reqJson = me.findInAdvFilterData(objJson,"ProductType");
			   	if(!Ext.isEmpty(reqJson)) {
				    arrQuickJson =ObjBatchEntryGridView.filterData;
				    arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,"ProductType");
				    me.filterData = arrQuickJson;
				  }
				reqJson = me.findInAdvFilterData(objJson,"ReceiverAccount");
			   	if(!Ext.isEmpty(reqJson)) {
				    arrQuickJson =ObjBatchEntryGridView.filterData;
				    arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,"ReceiverAccount");
				    me.filterData = arrQuickJson;
				  }  
				ObjBatchEntryGridView.advFilterData=objJson;
				me.advFilterData=objJson;
				filterJson = generateFilterArray(ObjBatchEntryGridView.advFilterData);
			}
			filterView.updateFilterInfo(filterJson);
		}
	},
	removeFromAdvanceArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	 findInAdvFilterData : function(arr, key) { 
	  var reqJson = null;
	  for (var ai, i = arr.length; i--;)  {
	   if ((ai = arr[i]) && ai.field == key) {
	    reqJson = ai;
	   }
	  }
	  return reqJson;
	 },
	 findInQuickFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	getQuickFilterQueryJson:function(){
		var me=this;
		var jsonArray = [];
		if(me.productFilterVal!=null && me.productFilterVal!='all'){
			jsonArray.push({
				paramName : 'BankProduct',
				paramValue1 : me.productFilterVal,
				operatorValue : 'eq',
				dataType : 'S',
				displayType : 8,
				fieldLabel: getLabel('lblProduct','Product'),
				displayValue1 : me.productFilterDesc
			});
		}
		if (me.receiverAccountVal != null && me.receiverAccountVal != 'all') {
			var obj = {
				paramName : 'ReceiverAccount',
				paramValue1 : me.receiverAccountVal,
				operatorValue : 'eq',
				dataType : 'S',
				displayType : 4,
				fieldLabel : getLabel("batchReceiverAcc","Receiving Account"),
				displayValue1 : me.receiverAccountDesc
			};
			if (strLayoutType === 'ACCTRFLAYOUT') {
				var crDrFlag = paymentResponseHeaderData
						&& paymentResponseHeaderData.d
						&& paymentResponseHeaderData.d.paymentEntry
						&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
						&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag
						? paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag
						: '';
				var strLabel = (!isEmpty(crDrFlag) && crDrFlag === 'D')
						? getLabel("batchSendingAcc", "Sending Account")
						: (!isEmpty(crDrFlag) && crDrFlag === 'C'
								? getLabel("batchReceiverAcc",
										"Receiving Account")
								: getLabel("batchAccount", "Account"));
				obj.fieldLabel = strLabel || getLabel("batchReceiverAcc","Receiving Account");
			}
			jsonArray.push(obj);
		}
		if(Ext.isEmpty(me.receiverName))
		{
			me.receiverName = receiverNameSelected;
		}
		if(!Ext.isEmpty(me.receiverNameVal)){
			jsonArray.push({
				paramName : 'ReceiverNamePDT',
				paramValue1 : encodeURIComponent(me.receiverName),
				operatorValue : 'lk',
				dataType : 'S',
				displayType : 8,
				fieldLabel: strLayoutType == "TAXLAYOUT"? strSystemBeneCategoryLbl : getLabel("instrumentsColumnReceiverName","Receiver Name"),
				displayValue1 : me.receiverNameVal
			});
		}
		if(me.statusVal!=null && me.statusVal!='all'){
			jsonArray.push({
				paramName : 'Status',
				paramValue1 : me.statusVal,
				operatorValue : 'eq',
				dataType : 'S',
				fieldLabel: 'Status'
			});
		}
			
		return jsonArray;
	},
	handleFilterSearchAction:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='A',
			me.setDataForFilter();
			me.getBatchProduct().setValue(me.getBatchProduct().getStore().getAt(0));
			me.productFilterVal='all';
			if($("#txnFilterReceiverName").val() == ""){
				receiverNameSelectedValue = null;
				me.defaultAction = false;
				me.getBatchReceiverName().reset();
				me.receiverNameVal = null;
			}
			ObjBatchEntryGridView.refreshData();
		} 
	},
	handleClearSettings:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		me.receiverNameVal=null;
		me.getBatchReceiverName().reset();
		me.productFilterVal='all';
		me.getBatchProduct().setValue(me.getBatchProduct().getStore().getAt(0));
		me.receiverAccountVal='all';
		receiverAccountSelectedValue = null;
		me.getBatchReceiverAccount().setValue(me.getBatchReceiverAccount().getStore().getAt(0));
		ObjBatchEntryGridView.filterApplied = 'Q';
		$('#txnFilterReceiverName').val("");
		$('#txnFilterReceiverAccount').val($("#txnFilterReceiverAccount option:first").val());
		$("input[type='checkbox'][id='txtFilterCredit']").prop('checked', false);	
		$("input[type='checkbox'][id='txtFilterDebit']").prop('checked', false);
		me.statusVal = 'all';
		resetAllMenuItemsInMultiSelect("#txnStatus");
		$("input[type='radio'][id='txnFilterHoldZeroDollarAll']").prop('checked', true);
		$("input[type='radio'][id='txnFilterHoldZeroDollar']").prop('checked', false);
		$("input[type='radio'][id='txnFilterHoldAll']").prop('checked', true);
		$("input[type='radio'][id='txnFilterHold']").prop('checked', false);
		$("input[type='radio'][id='txnFilterHold']").removeAttr('checked');
		$("input[type='radio'][id='txnFilterPrenotesAll']").prop('checked', true);
		$("input[type='radio'][id='txtFilterPrenotes']").prop('checked', false);
		$("input[type='radio'][id='txtFilterPrenotes']").removeAttr('checked');
		$("#txnFilterAmountOperator").val('eq');
		$("#txnFilterAmountOperator").niceSelect('update');
		$("#txnFilterAmountFieldFrom").val("");
		$("#txnFilterAmountFieldTo").val("");
		$('#txnFilterReceiverId').val('');
		handleTxnFilterAmountOperatorChange();
		me.setDataForFilter();	
		ObjBatchEntryGridView.refreshData();
	},
	handleAppliedFilterDelete : function(btn) {		
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		if (!Ext.isEmpty(objData)) {
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson = null; 
			var reqJsonInAdv = null;
			// adv
			if (!Ext.isEmpty(advJsonData)) {
				reqJsonInAdv = me.findInAdvFilterData(advJsonData, paramName);
			}
			if (!Ext.isEmpty(reqJsonInAdv)) {
				arrAdvJson = advJsonData;
				arrAdvJson = me.removeFromAdvanceArrJson(arrAdvJson, paramName);
				me.advFilterData = arrAdvJson;
			}
			// quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							paramName);
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			ObjBatchEntryGridView.refreshData();
		}
	},
	resetFieldInAdvAndQuickOnDelete: function(objData){
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		if (strFieldName === 'ActionStatus') {
			me.statusVal = 'all';
			resetAllMenuItemsInMultiSelect("#txnStatus");
		}else if(strFieldName === 'ProductType'){			
			var objField = me.getBatchInstrumentEntryInGridLayout().down('combo[itemId="batchProduct"]');
			if (!Ext.isEmpty(objField)) {
				objField.setValue('all');
				me.productFilterVal = 'all';				
			}
		}else if(strFieldName === 'ReceiverAccount'){			
			var objField = me.getBatchInstrumentEntryInGridLayout().down('combo[itemId="batchReceiverAccount"]');
			if (!Ext.isEmpty(objField)) {
				objField.setValue('all');
				me.receiverAccountVal = 'all';
				receiverAccountSelectedValue = null;
				$('#txnFilterReceiverAccount').val($("#txnFilterReceiverAccount option:first").val());
			}
		}else if(strFieldName === 'ReceiverNamePDT'){
			var objField = me.getBatchInstrumentEntryInGridLayout().down('combo[itemId="batchReceiverName"]');
			if (!Ext.isEmpty(objField)) {
				objField.setValue('');
				me.receiverNameVal = '';
				$('#txnFilterReceiverName').val('');
			}
		}else if(strFieldName === 'Amount'){
			$("#txnFilterAmountOperator").val('eq');
			$("#txnFilterAmountOperator").niceSelect('update');
			$("#txnFilterAmountFieldFrom").val("");
			$("#txnFilterAmountFieldTo").val("");
			handleTxnFilterAmountOperatorChange();
		}else if(strFieldName === 'ReceiverId'){
			$('#txnFilterReceiverId').val('');
		}else if(strFieldName === 'CreditDebitFlag'){
			if(objData.displayValue1 === 'Credit')
				$("input[type='checkbox'][id='txtFilterCredit']").prop('checked', false);
			else if(objData.displayValue1 === 'Debit')	
				$("input[type='checkbox'][id='txtFilterDebit']").prop('checked', false);
			else if(objData.displayValue1 === 'Both'){
				$("input[type='checkbox'][id='txtFilterDebit']").prop('checked', false);
				$("input[type='checkbox'][id='txtFilterCredit']").prop('checked', false);
			}
		}else if(strFieldName === 'HoldZeroDollarTxn'){
			$("input[type='radio'][id='txnFilterHoldZeroDollarAll']").prop('checked', true);
			$("input[type='radio'][id='txnFilterHoldZeroDollar']").prop('checked', false);
		}else if(strFieldName === 'HoldTxn'){
			$("input[type='radio'][id='txnFilterHoldAll']").prop('checked', true);
			$("input[type='radio'][id='txnFilterHold']").prop('checked', false);
			$("input[type='radio'][id='txnFilterHold']").removeAttr('checked');
		}else if(strFieldName === 'Prenote'){
			$("input[type='radio'][id='txnFilterPrenotesAll']").prop('checked', true);
			$("input[type='radio'][id='txtFilterPrenotes']").prop('checked', false);
			$("input[type='radio'][id='txtFilterPrenotes']").removeAttr('checked');
		}
		
		me.setDataForFilter();
	},
	
	refreshData: function(){
		var me = this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.refreshData();			
		}
	},
	
	receiverNameAutoCompleterSelect : function(comboValue,comboDesc){
		var me = this;
		me.receiverNameVal=comboDesc;
		me.handleReceiverNameAutoCompleteInQuickFilter();
		$('#txnFilterReceiverName').val(comboDesc);
		txnFilterReceiverSelected(true);
	},
	
	receiverNameAutoCompleterChange : function(comboValue,comboDesc){
		var me = this;
		me.receiverNameVal=comboDesc;
		me.handleReceiverNameAutoCompleteInQuickFilter();
		$('#txnFilterReceiverName').val(comboDesc);
		txnFilterReceiverSelected(true);
	},
	
	resetAdvanceFilterPopupFields : function(){
		var me = this;
		me.statusVal = 'all';
		me.receiverName = "";
		resetAllMenuItemsInMultiSelect("#txnStatus");
		$("#txnFilterAmountOperator").val('eq');
		$("#txnFilterAmountOperator").niceSelect('update');
		$("#txnFilterAmountFieldFrom,#txnFilterAmountFieldTo").val("");
		handleTxnFilterAmountOperatorChange();
		$('#txnFilterReceiverId').val('');
		$("input[type='checkbox'][id='txtFilterCredit']").prop('checked', false);
		$("input[type='checkbox'][id='txtFilterDebit']").prop('checked', false);
		$("input[type='radio'][id='txnFilterHoldZeroDollarAll']").prop('checked', true);
		$("input[type='radio'][id='txnFilterHoldZeroDollar']").prop('checked', false);
	},
	/*---------------------------- Filter handling End---------------------------------*/
	/*---------------------------- Payment Using Receiver Batch Start -----------------*/
	paintSelectedReceiver : function(strMyProduct) {
		var me = this;
		var url = getReceiverUrl(strMyProduct);
		url = url + '&qfilter='+strSelectedReceiverDesc+'&query='+strSelectedReceiverDesc;
		Ext.Ajax.request({
			url : url,
			method : 'POST',
			success : function(jsonData) {
				var jsonRes = Ext.JSON
						.decode(jsonData.responseText);
				if ("Y"== $(window).attr('batchUsingRec') && jsonRes) {
					if(jsonRes.d.receivers[0].receiverName==strSelectedReceiverDesc)
						var data = jsonRes.d.receivers[0];
					else
						var data = jsonRes.d.receivers[1];
					var _strBankProduct = $('#bankProduct').val();
					toggleReceiver('R', true);
					applyControlFieldsValidation(strPaymentType);			
					toggleRegisteredReceiverMoreDetails(data.receiverCode);
										
					$('#drawerCodeR').val(data.receiverCode || '');
					$('#drawerDescriptionR').val(data.receiverName || '');
					$('#drawerDescriptionR').attr('oldValue', data.receiverName);
					if(strSecCode === 'RCK')
					{
						$('#receiverIDRDiv').addClass('hidden');
	}
					$('#receiverIDR').val(data.receiverIdentifier || '');
					$('#drawerMail_RInfoLbl').html(data.email || '');
					$('#drawerMailR').val(data.email || '');
					if(strSecCode === 'XCK')
					{
						$('#receiverIDRDiv').addClass('hidden');
						$('#drawerDescriptionR').addClass('hidden');
					}
					$('#drawerAccountNo_RInfoLbl').html(data.accountNumber || '');
					$('#drawerAccountNoR').val(data.accountNumber || '');
					$('#beneficiaryBankIDCode_RInfoLbl')
							.html(data.bankCode || '');
					$('#beneficiaryBankIDCodeR').val(data.bankCode || '');
					
					
					
					$('.drawerMailR_InstView').html(data.email || '');
					if(strSecCode === 'RCK' || strSecCode === 'XCK')
					{
						if(strSecCode === 'XCK')
							$('#drawerDescriptionR').addClass('hidden');
						$('#drawerMailRDIV').addClass('hidden');
					}	
					$('.drawerAccountNoR_InstView').html(data.accountNumber || '');
					$('.beneficiaryBankIDCodeR_InstView').html(data.bankCode || '');
					$('.beneficiaryBranchDescriptionR_InstView').html(data.adhocBrnchdesc || '');
					$('.beneAccountTypeR_InstView').html(data.accountType || '');
					$('.drawerCurrencyR_InstView').html(data.receiverCcy || '');
					$('.beneficiaryBankIDTypeR_InstView').html(data.bankType || '');
					if(null!=data.bankType && "IBAN"==data.bankType)
					{
						//$('#ibanDivR').show();
						$('#bankIdDiv').hide();
						$('#bankBranchNameDiv').hide();
						$('.ibanR_InstView').html(data.iban || '');
					}
					else
					{
						$('#bankIdDiv').show();
						$('#bankBranchNameDiv').show();			
						//$('#ibanDivR').hide();
					}
					$('.drawerAddress1R_InstView').html(data.address1 || '');
					$('.drawerAddress2R_InstView').html(data.address2 || '');
					$('.drawerAddress3R_InstView').html(data.address3 || '');
					
					$('.corrBankIdTypeR_InstView').html(data.corrBankIdType || '');
					$('.corrBankIDCodeR_InstView').html(data.corrBankBic || '');
					$('.corrBankDetails1R_InstView').html(data.corrBankDetails1 || '');
					$('.corrBankDetails2R_InstView').html(data.corrBankDetails2 || ''); 
					$('.corrBankDetails3R_InstView').html(data.corrBankDetails3 || ''); 
					$('.corrBankDetails4R_InstView').html(data.corrBankDetails4 || ''); 
					$('.corrBankNostroAccR_InstView').html(data.corrNostroAccount || ''); 
					
					$('.intBankIDTypeR_InstView').html(data.interBankType || '');
					$('.intBankIDCodeR_InstView').html(data.interBankBic || '');
					$('.intBankDetails1R_InstView').html(data.interBankDetails1 || '');
					$('.intBankDetails2R_InstView').html(data.interBankDetails2 || ''); 
					$('.intBankDetails3R_InstView').html(data.interBankDetails3 || ''); 
					$('.intBankDetails4R_InstView').html(data.interBankDetails4 || ''); 
					$('.intBankNostroAccR_InstView').html(data.corrNostroAccount || '');
					
					$('.rBankAddress1R_InstView').html(data.bankAddress1 || '');
					$('.rBankAddress2R_InstView').html(data.bankAddress2 || '');
					$('.rBankAddress3R_InstView').html(data.bankAddress3 || '');
					$('.drawerCellNoR_InstView').html(data.mobileNumber || '');
					
					
					
					$(this).attr('oldValue', data.receiverName);
					$(window).attr('batchUsingRec','');
					
				}else if (jsonRes) {
					me.getBatchInstrumentEntryInGridLayout().setReceiverDefValue(null, jsonRes);
				}
			},
			failure : function() {
			},
			complete : function(XMLHttpRequest, textStatus) {
				
			}
		});
	}
	
	/*---------------------------- Payment Using Receiver Batch End -------------------*/
});