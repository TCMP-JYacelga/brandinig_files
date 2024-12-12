/**
 * @class GCP.controller.ReceivableViewController
 * @extends Ext.app.Controller
 * @author Vinay Thube
 */

/**
 * This controller is prime controller in Payment Summary which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like Payment Initiation.
 */

Ext.define('GCP.controller.ReceivableViewController', {
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
				selector:'receivableTranscationGridFilterView textfield[itemId=batchProduct]'
			},{
				ref :'batchReceiverAccount',
				selector:'receivableTranscationGridFilterView combo[itemId=batchReceiverAccount]'		
			}, {
				ref :'batchReceiverName',
				selector:'receivableTranscationGridFilterView  textfield[itemId=batchReceiverName]'		
			},{
				ref:'batchInstrumentViewInGridLayout',
				selector:'batchInstrumentViewInGridLayout[itemId="batchInstrumentViewInGridLayout"]'	
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
		productFilterVal:'',
		receiverAccountVal:'',
		receiverNameVal:'',
		dateHandler : null,
		dateFilterLabel :  getLabel('today', 'Today'),
		dateFilterVal : '1',
		dateRangeFilterVal : '13'
		
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		//var valDate = $('#valueDate');
		//var vFromDate = Ext.util.Format.date(dtApplicationDate, 'Y/m/d');	
		//valDate.setDateRangePickerValue(Ext.util.Format.date(dtApplicationDate, 'Y/m/d'));
		$(document).on('productComboSelect', function(event,comboValue, comboDesc) {
				me.handleClearAdvancedFilterFields();
				me.productFilterVal=comboDesc;
				me.handleProductChangeInQuickFilter();
				$('#txnAdvFilterTxnRef').val(comboDesc);
		});
		$(document).on('receiverAccountComboSelect',function(event,comboValue,comboDesc){
				me.handleClearAdvancedFilterFields();
				me.receiverAccountVal=comboDesc;
				me.handleReceiverAccountChangeInQuickFilter();
				$('#txnAdvFilterPayerName').val(comboDesc);
		});
		$(document).on('receiverNameAutoCompleterSelect',function(event,comboValue,comboDesc){
				me.handleClearAdvancedFilterFields();
				me.receiverNameVal=comboDesc;
				me.handleReceiverNameAutoCompleteInQuickFilter();
				$('#txnAdvFilterInstNo').val(comboDesc);
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
			me.getBatchReceiverAccount().setValue(value);
		});
		$(document).on('filterDateChange',
				function(event, filterType, btn, opts) {
					if (filterType == "instDate") {
						me.instDateChange(btn, opts);
					} else if (filterType == "valueDate") {
						me.valueDateChange(btn, opts);
					}	
				});
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "instDate") {
						me.datePickerSelectedDate = dates;
						me.instDateFilterVal = me.dateRangeFilterVal;
						me.instDateFilterLabel = "Date Range";
						me.handleInstDateChange(me.dateRangeFilterVal);
					}
				});
		$(document).on("handleSelectedDate",
				function(event, filterType, index) {
					if (filterType == "instDate") {
						me.handleInstDateChange(index);
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
			}
		});
	},
	/*---------------------------- Filter handling Starts---------------------------------*/
	handleClearAdvancedFilterFields:function(){
		var me = this;
		$('#valueDate').val('');
		$('#txnFilterBankId').val('');
		$('#txnAdvFilterClearingLoc').val('');
		$('#txnFilterAmountFieldFrom').val('');
		$('#txnFilterAmountFieldTo').val('');
		$('#instDate').val('');
		$("#txnFilterAmountOperator").val($("#txnFilterAmountOperator option:first").val());
		$("#txnFilterAmountOperator").niceSelect('update');
		resetAllMenuItemsInMultiSelect("#txnStatus");
		var transRef = me.getBatchProduct().getValue();
		var payerName = me.getBatchReceiverAccount().getValue();
		var instrument = me.getBatchReceiverName().getValue();
		if(!Ext.isEmpty(transRef))
		{
			me.productFilterVal = transRef;
		}
		if(!Ext.isEmpty(payerName))
		{
			me.receiverAccountVal = payerName;
		}
		if(!Ext.isEmpty(instrument))
		{
			me.receiverNameVal = instrument;
		}
		$('#pdcDiscountY').attr('checked',true);
	},
	handleProductChangeInQuickFilter:function(){
		var me = this;
		var ObjBatchEntryGridView=me.getBatchInstrumentViewInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='Q',
			me.setDataForFilter();	
			ObjBatchEntryGridView.refreshData();
		}
	},
	handleReceiverAccountChangeInQuickFilter:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentViewInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='Q',
			me.setDataForFilter();	
			ObjBatchEntryGridView.refreshData();
		}
	},
	handleReceiverNameAutoCompleteInQuickFilter:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentViewInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='Q',
			me.setDataForFilter();	
			ObjBatchEntryGridView.refreshData();
		} 
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
	handleAppliedFilterDelete : function(btn) {		
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;		
		var ObjBatchEntryGridView=me.getBatchInstrumentViewInGridLayout();
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
		if(strFieldName === 'txnRef' || strFieldName === 'txnRefNo'){		
			var objField = me.getReceivableTranscationGridFilterView().down('textfield[itemId="batchProduct"]');
			if (!Ext.isEmpty(objField)) {
				objField.setValue('');
				me.productFilterVal = '';
				$('#txnAdvFilterTxnRef').val('');
			}
		}else if(strFieldName === 'PayerName'){			
			var objField = me.getReceivableTranscationGridFilterView().down('AutoCompleter[itemId="batchReceiverAccount"]');
			if (!Ext.isEmpty(objField)) {
				me.receiverAccountVal = '';
				objField.setValue("");
				me.receiverAccountVal = '';
				$('#txnAdvFilterPayerName').val('');
			}
		}else if(strFieldName === 'InstNo'){
			var objField = me.getReceivableTranscationGridFilterView().down('textfield[itemId="batchReceiverName"]');
			if (!Ext.isEmpty(objField)) {
				me.receiverNameVal = '';
				objField.setValue("");
				$('#txnAdvFilterInstNo').val('');
			}
		}else if(strFieldName === 'ActionStatusDtl'){
			resetAllMenuItemsInMultiSelect('#txnStatus');			
		}else if(strFieldName === 'PayerBankId'){
			$('#txnFilterBankId').val('');
		}else if(strFieldName === 'ClearingLocationDesc'){
			$('#txnAdvFilterClearingLoc').val('');
		}else if(strFieldName === 'AmountDdt'){
			$('#txnFilterAmountFieldTo').val('');
			$('#txnFilterAmountFieldFrom').val('');
		}else if(strFieldName === 'InstDate'){
			selectedInstDate = '';
			$('#instDate').val('');
		}else if(strFieldName === 'DiscountedFlag'){
			$('#pdcDiscountY').attr('checked',true);
		}
		me.setDataForFilter();
	},
	setDataForFilter:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentViewInGridLayout();
		  var arrQuickJson = {},filterJson =[];
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			if(ObjBatchEntryGridView.filterApplied==='Q'){
				ObjBatchEntryGridView.filterData = me.getQuickFilterQueryJson();
				me.filterData = me.getQuickFilterQueryJson();
				ObjBatchEntryGridView.advFilterData={};
				me.handleClearAdvancedFilterFields();
				me.advFilterData={};
				filterJson = generateFilterArray(ObjBatchEntryGridView.filterData);
			}else if(ObjBatchEntryGridView.filterApplied==='A'){
				ObjBatchEntryGridView.filterData = me.getQuickFilterQueryJson();
				var objJson =getTxnAdvanceFilterQueryJson();
			//	ObjBatchEntryGridView.advFilterData = getTxnAdvanceFilterQueryJson();
				 var reqJson = me.findInAdvFilterData(objJson,"RecieverName");
			   	if(!Ext.isEmpty(reqJson)) {
				    arrQuickJson =ObjBatchEntryGridView.filterData;
				    arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,"RecieverName");
				    me.filterData = arrQuickJson;
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
	removeFromQuickArrJson : function(arr, key){
	  for (var ai, i = arr.length; i--;)  {
	   if ((ai = arr[i]) && ai.paramName == key) {
	    arr.splice(i, 1);
	   }
	  }
	  return arr;
 	},
 	removeFromAdvanceArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
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
	getQuickFilterQueryJson:function(){
		var me=this;
		var jsonArray = [];
		if(!Ext.isEmpty(me.productFilterVal)){
			me.productFilterVal = me.productFilterVal.toLowerCase();
			if(payCollDtl === "13" || payCollDtl === "08")
			{	
				jsonArray.push({
					paramName : 'txnRef',
					paramValue1 : me.productFilterVal,
					operatorValue : 'lk',
					dataType : 'S',
					displayType : 5,
					fieldLabel: 'Transaction Reference',
					displayValue1 : me.productFilterVal
					
				});
			}
			else{
				jsonArray.push({
					paramName : 'txnRefNo',
					paramValue1 : me.productFilterVal,
					operatorValue : 'lk',
					dataType : 'S',
					displayType : 5,
					fieldLabel: getLabel('colQryAdvFltTxnRefNo', 'Transaction Reference'),
					displayValue1 : me.productFilterVal
					
				});
			}
		}
		if(!Ext.isEmpty(me.receiverAccountVal)){
				jsonArray.push({
				paramName : 'PayerName',
				paramValue1 : me.receiverAccountVal,
				operatorValue : 'lk',
				dataType : 'S',
				displayType : 5,
				fieldLabel: getLabel('payerName', 'Payer Name'),
				displayValue1 : me.receiverAccountVal
			});
		}
		if(!Ext.isEmpty(me.receiverNameVal)){
			jsonArray.push({
				paramName : 'InstNo',
				paramValue1 : me.receiverNameVal,
				operatorValue : 'eq',
				dataType : 'S',
				displayType : 5,
				fieldLabel: getLabel('colQryAdvFltInstrument', 'Instrument'),
				displayValue1 : me.receiverNameVal
			});
		}
			
		return jsonArray;
	},
	handleFilterSearchAction:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentViewInGridLayout();
		if(!Ext.isEmpty(ObjBatchEntryGridView)){
			ObjBatchEntryGridView.filterApplied='A';
			me.handleFieldSync();
			me.setDataForFilter();	
			ObjBatchEntryGridView.refreshData();		
		} 
	},
	handleFieldSync:function(){
		var me = this;
		var txnRef = $('#txnAdvFilterTxnRef').val();
		if(txnRef != null && txnRef !="")
		{
			var transactionName = me.getBatchProduct();
			transactionName.setValue(txnRef);
		}
		else
		{
			var transactionName = me.getBatchProduct();
			transactionName.setValue("");
		}
		var payerName = $('#txnAdvFilterPayerName').val();
		if(payerName != null && payerName !="")
		{
			var payerNameAuto = me.getBatchReceiverAccount();
			payerNameAuto.setValue(payerName);
		}
		else
		{
			var payerNameAuto = me.getBatchReceiverAccount();
			payerNameAuto.setValue("");
		}
		var instNo = $('#txnAdvFilterInstNo').val();
		if(instNo != null && instNo !="")
		{
			var instrument = me.getBatchReceiverName();
			instrument.setValue(instNo);
		}
		else
		{
			var instrument = me.getBatchReceiverName();
			instrument.setValue("");
		}
	},
	handleClearSettings:function(){
		var me=this;
		var ObjBatchEntryGridView=me.getBatchInstrumentViewInGridLayout();
		me.receiverNameVal=null;
		me.getBatchReceiverName().reset();
		me.receiverAccountVal='';
		me.productFilterVal='';
		me.getBatchReceiverAccount().reset();
		me.getBatchProduct().reset();
		ObjBatchEntryGridView.filterApplied = 'Q';
		me.resetAdvanceFilterPopupFields();
		me.setDataForFilter();	
		ObjBatchEntryGridView.refreshData();
	},
	resetAdvanceFilterPopupFields:function(){
		resetAllMenuItemsInMultiSelect('#txnStatus');
		$('#txnAdvFilterTxnRef').val('');
		$('#txnFilterAmountFieldFrom').val('');
		$('#txnFilterAmountFieldTo').val('');
		$('#txnAdvFilterInstNo').val('');
		$('#txnAdvFilterPayerName').val('');
		$('#txnFilterBankId').val('');
		$('#txnAdvFilterClearingLoc').val('');
		$('#instDate').val('');
		selectedInstDate = '';
		$('#pdcDiscountY').attr('checked',true);
	},
	instDateChange : function(btn, opts) {
		var me = this;
		me.instDateFilterVal = btn.btnValue;
		me.instDateFilterLabel = btn.text;
		me.handleInstDateChange(btn.btnValue);
	},
	handleInstDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, null);

		if (!Ext.isEmpty(me.instDateFilterLabel)) {
			$('label[for="InstDateLabel"]').text(getLabel('instDate',
					'Instrument Date')
					+ " (" + me.instDateFilterLabel + ")");
		}
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#instDate').datepick('setDate',vFromDate);
			} else {
				$('#instDate').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = objDateParams.fieldValue2;
			selectedInstDate = {
				operator : filterOperator,
				fromDate : objDateParams.fieldValue1,
				toDate : dateToField,
				dateLabel : me.instDateFilterLabel,
				index :index
			};
		} else {
			if (index === '1' || index === '2') {
				$('#instDate').datepick('setDate',vFromDate);
			} else {
				$('#instDate').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = objDateParams.fieldValue2;
			selectedInstDate = {
				operator : filterOperator,
				fromDate : objDateParams.fieldValue1,
				toDate : dateToField,
				dateLabel : me.instDateFilterLabel,
				index :index
			};
		}
	},
	getDateParam : function(index, dateType) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.util.Format.date(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.util.Format.date(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.util.Format.date(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.util.Format.date(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.util.Format.date(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.util.Format.date(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.util.Format.date(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.util.Format.date(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.util.Format.date(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.util.Format.date(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				fieldValue1 = Ext.util.Format.date(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.util.Format.date(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.util.Format.date(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.util.Format.date(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.util.Format.date(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.util.Format.date(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.util.Format.date(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.util.Format.date(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '12' :
				// Latest
				var fromDate = new Date(Ext.Date.parse(collFromDate, dtFormat));
                var toDate = new Date(Ext.Date.parse(collToDate, dtFormat));
				fieldValue1 = Ext.util.Format.date(fromDate, strSqlDateFormat);
				fieldValue2 = Ext.util.Format.date(toDate, strSqlDateFormat);;
				operator = 'bt';
				break;
			case '13' :
				// Date Range
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = Ext.util.Format.date(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'eq';
				} else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = Ext.util.Format.date(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = Ext.util.Format.date(me.datePickerSelectedDate[1],
							strSqlDateFormat);
					operator = 'bt';
				}
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	}
	/*---------------------------- Filter handling End---------------------------------*/
});