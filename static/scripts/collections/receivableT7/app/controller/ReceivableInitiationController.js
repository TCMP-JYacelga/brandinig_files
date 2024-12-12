/**
 * @class GCP.controller.ReceivableInitiationController
 * @extends Ext.app.Controller
 * @author Vinay Thube
 */

/**
 * This controller is prime controller in Payment Summary which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like Payment Initiation.
 */

Ext.define('GCP.controller.ReceivableInitiationController', {
	extend : 'Ext.app.Controller',
	requires : [Ext.ux.gcp.DateUtil],
	views : ['GCP.view.ReceivableTranscationGridFilterView'],

	refs : [/*Quick Filter starts.... */
			{
				ref : 'filterView',
				selector : 'filterView'		
			},{
				ref:'receivableTranscationGridFilterView',
				selector:'receivableTranscationGridFilterView'
			},{
				ref :'batchProduct',
				selector:'receivableTranscationGridFilterView combo[itemId=batchProduct]'
			},{
				ref :'batchReceiverAccount',
				selector:'receivableTranscationGridFilterView combo[itemId=batchReceiverAccount]'		
			}, {
				ref :'batchReceiverName',
				selector:'receivableTranscationGridFilterView  textfield[itemId=batchReceiverName]'		
			},{
				ref:'batchInstrumentEntryInGridLayout',
				selector:'batchInstrumentEntryInGridLayout[itemId="batchInstrumentEntryInGridLayout"]'	
			},{
				ref :'batchClrLocation',
				selector:'receivableTranscationGridFilterView combo[itemId=batchClrLocation]'		
			},{
				ref :'batchInstProduct',
				selector:'receivableTranscationGridFilterView combo[itemId=batchInstProduct]'		
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
		receiverAccountVal:'',
		clrLocationVal:'',
		clrLocationDesc:'',
		instProductVal:'',
		instProductDesc:'',
		receiverNameVal:'',
		isRcvrNameSelected : false,
		isRcvrAccountSelected : false,
		isClrLocationSelected : false,
		isInstProductSelected : false,
		tempRcvrName : null,
		tempRcvrAccount : null,
		tempClrLocation : null,
		tempInstProduct : null,
		defaultActionP : true,
		defaultActionM : true
		
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
				me.handleProductChangeInQuickFilter(comboValue);
				
		});
		$(document).on('receiverAccountComboSelect',function(event,comboValue,comboDesc){
				me.receiverAccountVal=comboValue;
				$('#txnAdvFilterPayerName').val(comboValue);
				txnFilterReceiverSelected();
		});
		$(document).on('receiverNameAutoCompleterSelect',function(event,comboValue,comboDesc){
				me.receiverNameVal=comboDesc;
		});
		$(document).on("txnSearchActionClicked",function(event){
				me.handleFilterSearchAction();
		});
		$(document).on("clrLocationComboSelect",function(event,comboValue,comboDesc){
				me.clrLocationVal=comboValue;
		});
		$(document).on("instProductComboSelect",function(event,comboValue,comboDesc){
				me.instProductVal=comboValue;
		});
		$(document).on('advFilterPayerNameSelected',function(event,value){
			me.receiverAccountVal=value;
			me.getBatchReceiverAccount().setValue(value);
		});
		$(document).on('advFilterPayerAccountSelected',function(event,value){
			me.productFilterVal=value;
			me.getBatchProduct().setValue(value);
		});
		$(document).on('advFilterProductSelected',function(event,value){
			me.productFilterVal=value;
			me.getBatchProduct().setValue(value);
		});
		$(document).on('advFilterReceiverAccountSelected',function(event,value){
			me.receiverAccountVal=value;
			me.getBatchReceiverAccount().setValue(value);
		});
		$(document).on('advFilterClrLocationSelected',function(event,comboValue,comboDesc){
			me.clrLocationVal=comboValue;			
			me.clrLocationDesc=comboDesc;
			me.getBatchClrLocation().setValue(comboDesc);
		});
		$(document).on('advFilterInstProductSelected',function(event,comboValue,comboDesc){
			me.instProductVal=comboValue;
			me.instProductDesc=comboDesc;
			me.getBatchInstProduct().setValue(comboDesc);			
		});
		$(document).on('clearAllFilters',function(event){
			me.handleClearSettings();			
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
				appliedFilterDelete:function(btn){
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
			'receivableTranscationGridFilterView combo[itemId="batchProduct"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.productFilterVal)) {
						combo.setValue(me.productFilterVal);
					}
				}
			},
			'receivableTranscationGridFilterView combo[itemId="batchReceiverAccount"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.receiverAccountVal)) {
						combo.setValue(me.receiverAccountVal);
					}
				}
			},
			'receivableTranscationGridFilterView AutoCompleter[itemId="batchClrLocation"]' : {
				'select':function(combo,record){
					me.clrLocationAutoCompleterSelect(combo.getValue(),combo.getRawValue());
					me.isClrLocationSelected = true;
				},
				'change' : function(combo, record, oldVal) {
					if (Ext.isEmpty(combo.getValue()) && me.defaultActionP) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.clrLocationAutoCompleterSelect(combo.getValue(),combo.getRawValue());
							me.isClrLocationSelected = true;
							me.tempClrLocation = oldVal;
						}						
					}
					else{
						me.isClrLocationSelected = false;
						me.tempClrLocation = oldVal;
					}
					me.defaultActionP = true;
				},
				'keyup' : function(combo, e, eOpts){
					me.isClrLocationSelected = false;
				},
				'blur' : function(combo, The, eOpts ){
					if(me.isClrLocationSelected == false  
							&& !Ext.isEmpty(combo.getValue())
							&&  me.tempClrLocation != combo.getValue()){
						me.clrLocationAutoCompleterSelect(combo.getValue(),combo.getRawValue());
						me.tempClrLocation = combo.getValue();
					}
				}
			},
			'receivableTranscationGridFilterView combo[itemId="batchInstProduct"]' : {
				'select':function(combo,record){
					me.instProductAutoCompleterSelect(combo.getValue(),combo.getRawValue());
					me.isInstProductSelected = true;
				},
				'change' : function(combo, record, oldVal) {
					if (Ext.isEmpty(combo.getValue()) && me.defaultActionP) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.instProductAutoCompleterSelect(combo.getValue(),combo.getRawValue());
							me.isInstProductSelected = true;
							me.tempInstProduct = oldVal;
						}						
					}
					else{
						me.isInstProductSelected = false;
						me.tempInstProduct = oldVal;
					}
					me.defaultActionP = true;
				},
				'keyup' : function(combo, e, eOpts){
					me.isInstProductSelected = false;
				},
				'blur' : function(combo, The, eOpts ){
					if(me.isInstProductSelected == false  
							&& !Ext.isEmpty(combo.getValue())
							&&  me.tempInstProduct != combo.getValue()){
						me.instProductAutoCompleterSelect(combo.getValue(),combo.getRawValue());
						me.tempInstProduct = combo.getValue();
					}
				}
			},
			'receivableTranscationGridFilterView AutoCompleter[itemId="batchReceiverAccount"]' : {
				'select':function(combo,record){
					me.receiverNameAutoCompleterSelect(combo.getValue(),combo.getRawValue());
					me.isRcvrAccountSelected = true;
				},
				'change' : function(combo, record, oldVal) {
					if (Ext.isEmpty(combo.getValue()) && me.defaultActionP) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.receiverNameAutoCompleterChange(combo.getValue(),combo.getRawValue());
							me.isRcvrAccountSelected = true;
							me.tempRcvrAccount = oldVal;
						}						
					}
					else{
						me.isRcvrAccountSelected = false;
						me.tempRcvrAccount = oldVal;
					}
					me.defaultActionP = true;
				},
				'keyup' : function(combo, e, eOpts){
					me.isRcvrAccountSelected = false;
				},
				'blur' : function(combo, The, eOpts ){
					if(me.isRcvrAccountSelected == false  
							&& !Ext.isEmpty(combo.getRawValue())
							&&  me.tempRcvrAccount != combo.getRawValue()){
						me.receiverNameAutoCompleterSelect(combo.getValue(),combo.getRawValue());
						me.tempRcvrAccount = combo.getRawValue();
					}
				}
			},
			'receivableTranscationGridFilterView AutoCompleter[itemId="batchReceiverName"]' : {
				'select':function(combo,record){
					me.manDebRefAutoCompleterSelect(combo.getValue(),combo.getRawValue());
					me.isRcvrNameSelected = true;
				},
				'change' : function(combo, record, oldVal) {
					if (Ext.isEmpty(combo.getValue()) && me.defaultActionM) {
						if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
							me.manDebRefAutoCompleterChange(combo.getValue(),combo.getRawValue());
							me.isRcvrNameSelected = true;
							me.tempRcvrName = oldVal;
						}						
					}
					else{
						me.isRcvrNameSelected = false;
						me.tempRcvrName = oldVal;
					}
					me.defaultActionM = true;
				},
				'keyup' : function(combo, e, eOpts){
					me.isRcvrNameSelected = false;
				},
				'blur' : function(combo, The, eOpts ){
					if(me.isRcvrNameSelected == false  
							&& !Ext.isEmpty(combo.getRawValue())
							&&  me.tempRcvrName != combo.getRawValue()){
						me.manDebRefAutoCompleterSelect(combo.getValue(),combo.getRawValue());
						me.tempRcvrName = combo.getRawValue();
					}
				}
			}
		});
	},
	/*---------------------------- Filter handling Starts---------------------------------*/
	handleProductChangeInQuickFilter:function(comboValue){
		var me = this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='Q',
			me.setDataForFilter();	
			ObjBatchEntryGridView.refreshData();
			$('#txnAdvFilterPayerAccount').val(comboValue);
			$('#txnAdvFilterPayerAccount').niceSelect('update');
			txnAdvFilterPayerAccountSelected();
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
	handleClrLocationChangeInQuickFilter:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='Q',
			me.setDataForFilter();	
			ObjBatchEntryGridView.refreshData();
		}
	},
	handleInstProductChangeInQuickFilter:function(){
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
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		  var arrQuickJson = {},filterJson =[];
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			if(ObjBatchEntryGridView.filterApplied==='Q'){				
				ObjBatchEntryGridView.filterData = me.getQuickFilterQueryJson();
				me.filterData = me.getQuickFilterQueryJson();
				ObjBatchEntryGridView.advFilterData={};
				me.advFilterData={};
				me.resetAdvanceFilterPopupOtherFields();
				filterJson = generateFilterArray(ObjBatchEntryGridView.filterData);
			}else if(ObjBatchEntryGridView.filterApplied==='A'){
				ObjBatchEntryGridView.filterData = me.getQuickFilterQueryJson();
				var objJson =getTxnAdvanceFilterQueryJson();				
				ObjBatchEntryGridView.advFilterData=objJson;
				me.advFilterData=objJson;
				filterJson = generateFilterArray(ObjBatchEntryGridView.advFilterData);
			}
			filterView.updateFilterInfo(filterJson);
		}
	},
	removeFromQuickArrJson : function(arr, key){
	  for (var ai, i = arr.length; i--;)  {
	   if ((ai = arr[i]) && (ai.field == key || ai.paramName == key)) {
	    arr.splice(i, 1);
	   }
	  }
	  return arr;
 	},
	 findInAdvFilterData : function(arr, key) { 
	  var reqJson = null;
	  for (var ai, i = arr.length; i--;)  {
	   if ((ai = arr[i]) && (ai.field == key || ai.paramName == key)) {
	    reqJson = ai;
	   }
	  }
	  return reqJson;
	 },
	getQuickFilterQueryJson:function(){
		var me=this;
		var jsonArray = [];
		if(!Ext.isEmpty(me.productFilterVal) && me.productFilterVal!=null && me.productFilterVal!='all'){
			jsonArray.push({
				paramName : 'PayerAcctNo',
				paramValue1 : me.productFilterVal,
				operatorValue : 'eq',
				dataType : 'S',
				displayType : 5,
				fieldLabel: getLabel('payerAcct','Payer Account'),
				displayValue1 : me.productFilterVal
			});
		}
		if(!Ext.isEmpty(me.receiverAccountVal)){
				jsonArray.push({
				paramName : 'PayerName',
				paramValue1 : me.receiverAccountVal,
				operatorValue : 'lk',
				dataType : 'S',
				fieldLabel: getLabel('payerName','Payer Name')
			});
		}
		if(!Ext.isEmpty(me.receiverNameVal)){
			jsonArray.push({
				paramName : 'DebtorRef',
				paramValue1 : me.receiverNameVal,
				operatorValue : 'lk',
				dataType : 'S',
				fieldLabel: getLabel('selectDebtorRef','Mandate Debtor Reference')
			});
		}
		if(!Ext.isEmpty(me.clrLocationVal)){
			jsonArray.push({
				paramName : 'ClrLocation',
				paramValue1 : me.clrLocationVal,
				operatorValue : 'lk',
				dataType : 'S',
				fieldLabel: 'Clearing Location',
				displayValue1 : me.clrLocationDesc,
				displayType : 5				
			});
		}
		
		if(!Ext.isEmpty(me.instProductVal)){
			jsonArray.push({
				paramName : 'ProductDescription',
				paramValue1 : me.instProductVal,
				operatorValue : 'lk',
				dataType : 'S',
				fieldLabel: 'Product',
				displayValue1 : me.instProductDesc,
				displayType : 5
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
			ObjBatchEntryGridView.refreshData();		
		} 
	},
	handleClearSettings:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentEntryInGridLayout();
		me.receiverNameVal=null;
		me.getBatchReceiverName().reset();
		me.productFilterVal='all';
		me.getBatchProduct().reset();
		me.getBatchProduct().setValue('all');
		me.receiverAccountVal='';
		me.clrLocationVal='',
		me.clrLocationDesc='',
		me.getBatchClrLocation().reset();
		me.instProductVal='',
		me.instProductDesc='',
		me.getBatchInstProduct().reset();
		me.getBatchReceiverAccount().reset();
		ObjBatchEntryGridView.filterApplied = 'Q';
		me.resetAdvanceFilterPopupFields();
		me.setDataForFilter();	
		ObjBatchEntryGridView.refreshData();
	},
	resetAdvanceFilterPopupFields : function(){
		var me = this;
		resetAllMenuItemsInMultiSelect("#txnStatus");
		$("#txnFilterAmountOperator").val($("#txnFilterAmountOperator option:first").val());
		$("#txnFilterAmountOperator").niceSelect('update');
		$("#txnFilterAmountFieldFrom,#txnFilterAmountFieldTo").val("");
		handleTxnFilterAmountOperatorChange();
		$('#txnAdvFilterPayerName').val('');
		$('#txnAdvFilterPayerAccount').val('all');
		payerAccountSelectedValue = '';
		$('#txnAdvFilterPayerAccount').niceSelect('update');
		$('#txnFilterBankId').val('');
		$('#txnAdvFilterPayerCode').val('');
		$('#txnAdvFilterClrLocation').val('');
		$('#txnAdvFilterClrLocationCode').val('');
		$('#txnAdvFilterProduct').val('');
		$('#txnAdvFilterProductCode').val('');
		$('#txnAdvFilterDraweeBank').val('');
		$('#txnAdvFilterDraweeBankCode').val('');
		$('#txnAdvFilterDraweeBranch').val('');
		$('#txnAdvFilterDraweeBranchCode').val('');
		
	},
	resetAdvanceFilterPopupOtherFields : function(){
		var me = this;
		resetAllMenuItemsInMultiSelect("#txnStatus");		
		$('#txnFilterBankId').val('');		
		$("#txnFilterAmountOperator").val($("#txnFilterAmountOperator option:first").val());
		$("#txnFilterAmountOperator").niceSelect('update');
		$("#txnFilterAmountFieldFrom,#txnFilterAmountFieldTo").val("");		
		handleTxnFilterAmountOperatorChange();
		$('#txnFilterBankId').val('');
		$('#txnAdvFilterPayerCode').val('');
		
		/*$('#txnAdvFilterPayerName').val('');
		$('#txnAdvFilterPayerAccount').val('all');
		payerAccountSelectedValue = '';
		$('#txnAdvFilterPayerAccount').niceSelect('update');
		
		
		$('#txnAdvFilterClrLocation').val('');
		$('#txnAdvFilterClrLocationCode').val('');
		$('#txnAdvFilterProduct').val('');
		$('#txnAdvFilterProductCode').val('');
		$('#txnAdvFilterDraweeBank').val('');
		$('#txnAdvFilterDraweeBankCode').val('');
		$('#txnAdvFilterDraweeBranch').val('');
		$('#txnAdvFilterDraweeBranchCode').val('');*/
		
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
	removeFromAdvanceArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && (ai.field == key || ai.paramName == key)) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	findInQuickFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && (ai.field == key || ai.paramName == key)) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	resetFieldInAdvAndQuickOnDelete: function(objData){
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		if(strFieldName === 'PayerAcctNo'){			
			var objField = me.getBatchInstrumentEntryInGridLayout().down('combo[itemId="batchProduct"]');
			if (!Ext.isEmpty(objField)) {
				objField.setValue('all');
				me.productFilterVal = 'all';
				$('#txnAdvFilterPayerAccount').val('all');
				payerAccountSelectedValue = '';
				$('#txnAdvFilterPayerAccount').niceSelect('update');
			}
		}else if(strFieldName === 'PayerName'){			
			var objField = me.getBatchInstrumentEntryInGridLayout().down('AutoCompleter[itemId="batchReceiverAccount"]');
			if (!Ext.isEmpty(objField)) {
				objField.setValue('');
				me.receiverAccountVal='',
				$('#txnAdvFilterPayerName').val('');
				advPayerNameSelectedValue = null;
			}
		}else if(strFieldName === 'ClrLocation'){			
			var objField = me.getBatchInstrumentEntryInGridLayout().down('AutoCompleter[itemId="batchClrLocation"]');
			if (!Ext.isEmpty(objField)) {
				objField.setValue('');
				me.clrLocationVal='';
				me.clrLocationDesc='';
				$('#txnAdvFilterClrLocation').val('');
				$('#txnAdvFilterClrLocationCode').val('');
				advClrLocationSelectedValue = null;
			}
		}else if(strFieldName === 'ProductDescription'){		
			var objField = me.getBatchInstrumentEntryInGridLayout().down('AutoCompleter[itemId="batchInstProduct"]');
			if (!Ext.isEmpty(objField)) {
				objField.setValue('');
				me.instProductVal='';
				me.instProductDesc='';
				$('#txnAdvFilterProduct').val('');
				$('#txnAdvFilterProductCode').val('');
				advInstProductSelectedValue = null;
			}
		}else if(strFieldName === 'DraweeBank'){		
			$('#txnAdvFilterDraweeBank').val('');
			$('#txnAdvFilterDraweeBankCode').val('');
		}else if(strFieldName === 'DraweeBankBranch'){		
			$('#txnAdvFilterDraweeBranch').val('');
			$('#txnAdvFilterDraweeBranchCode').val('');
		}else if(strFieldName === 'PayerCode'){		
			$('#txnAdvFilterPayerCode').val('');
		}else if(strFieldName === 'DebtorRef'){
			var objField = me.getBatchInstrumentEntryInGridLayout().down('combo[itemId="batchReceiverName"]');
			if (!Ext.isEmpty(objField)) {
				objField.setValue('');
				me.receiverNameVal=''
			}
		}else if(strFieldName === 'InstAmount'){
			$("#txnFilterAmountOperator").val($("#txnFilterAmountOperator option:first").val());
			$("#txnFilterAmountFieldFrom").val("");
			$("#txnFilterAmountFieldTo").val("");
			handleTxnFilterAmountOperatorChange();
		}else if(strFieldName === 'PayerBankId'){
			$('#txnFilterBankId').val('');
		}else if(strFieldName === 'ActionStatus'){
			resetAllMenuItemsInMultiSelect("#txnStatus");
		}
		me.setDataForFilter();
	},
	receiverNameAutoCompleterChange : function(comboValue,comboDesc){
		var me = this;
		me.receiverAccountVal=comboDesc;
		me.handleReceiverNameAutoCompleteInQuickFilter();
		$('#txnAdvFilterPayerName').val(comboDesc);
		txnFilterReceiverSelected(true);
	},
	receiverNameAutoCompleterSelect : function(comboValue,comboDesc){
		var me = this;
		me.receiverAccountVal=comboDesc;
		me.handleReceiverNameAutoCompleteInQuickFilter();
		$('#txnAdvFilterPayerName').val(comboDesc);
		txnFilterReceiverSelected(true);
	},
	manDebRefAutoCompleterSelect : function(comboValue,comboDesc){
		var me = this;
		me.receiverNameVal=comboDesc;
		me.handleReceiverNameAutoCompleteInQuickFilter();
		//$('#txnAdvFilterPayerName').val(comboDesc);
		//txnFilterReceiverSelected(true);
	},
	manDebRefAutoCompleterChange : function(comboValue,comboDesc){
		var me = this;
		me.receiverNameVal=comboDesc;
		me.handleReceiverNameAutoCompleteInQuickFilter();
		//$('#txnAdvFilterPayerName').val(comboDesc);
		//txnFilterReceiverSelected(true);
	},
	clrLocationAutoCompleterSelect : function(comboValue,comboDesc){
		var me = this;
		me.clrLocationVal=comboValue;
		me.clrLocationDesc=comboDesc;
		me.handleClrLocationChangeInQuickFilter();
		$('#txnAdvFilterClrLocation').val(comboDesc);
		$('#txnAdvFilterClrLocationCode').val(comboValue);
		txnFilterClrLocationSelected(true);
	},
	instProductAutoCompleterSelect : function(comboValue,comboDesc){
		//Nishant Changes
		var me = this;
		me.instProductVal=comboValue;
		me.instProductDesc=comboDesc;
		me.handleInstProductChangeInQuickFilter();
		$('#txnAdvFilterProduct').val(comboDesc);
		$('#txnAdvFilterProductCode').val(comboValue);
		txnFilterInstProductSelected(true);
	}
	/*---------------------------- Filter handling End---------------------------------*/
});