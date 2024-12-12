Ext.define('GCP.controller.TransactionController', {
	extend : 'Ext.app.Controller',
	xtype : 'transactionController',
	requires : ['GCP.view.CashPositionCenter','Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp',
			'GCP.view.transaction.TransactionView',
			'GCP.view.transaction.TransactionFilterView', 'Ext.ux.gcp.DateUtil','Ext.form.field.ComboBox'],
	refs : [{
				ref : 'cashPositionCenter',
				selector : 'cashPositionCenter'
			}, {
				ref : 'transactionView',
				selector : 'transactionView'
			},  {
				ref : 'txnGenericFilterView',
				selector : 'filterView'
			}, {
				ref : 'groupView',
				selector : 'transactionView groupView'
			}, {
				ref : 'filterView',
				selector : 'transactionFilterView'
			}, {
				ref : 'transAccountCombo',
				selector : 'transactionFilterView combobox[itemId="transactionAccount"]'
			}, {
				ref : 'transTxnCombo',
				selector : 'transactionFilterView combobox[itemId="transactionCategory"]'
			},
			{
				ref : 'transFilterCombo',
				selector : 'transactionFilterView combobox[itemId="savedFiltersCombo"]'
			},{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp[itemId="pageSettingPopUpTxn"]'
			}],
	config : {
		filterUIData : {},
		txnCategory:null,
		txnCategoryDesc : null,
		dateHandler : null,
		dateFilterFromVal : '',
		dateFilterToVal : '',
		navigatedTxnCategory:null,
		navigatedAccountId:null,
		accountFilter : 'ALL',
		accountFilterDesc : null,
		filterData : [],
		advFilterData : [],
		advSortByData : [],
		dateRangeFilterVal : '13',
		datePickerSelectedDate : [],
		preferenceHandler : null,
		filterApplied : 'ALL',
		postingDateFilterLabel : "",
		requestDateFilterVal : "",
		amountFilterVal : '',
		strReadSummaryInfoUrl : 'services/cashPositionsummary/summarytypecodes',
		amountFilterLabel : getLabel('lessThanEqTo','Less Than Equal To'),
		filterCodeValue : null,
		objAdvFilterPopup : null,
		savePrefAdvFilterCode : null,
		SearchOrSave : false,
		filterMode : '',
		accountNumber:"ALL",
		objTransactionGridPref:null,
		strServiceParam:null,
		strPageName : 'cashPositionTransaction',
		strModifySavedFilterUrl : 'services/userfilters/cashpositiontxn/{0}.json',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/cashpositiontxn.json',
		strGetSavedFilterUrl : 'services/userfilters/cashpositiontxn/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/cashpositiontxn/{0}/remove.json',
		reportGridOrder:null,
		pageSettingPopup : null, 
		advFilterCodeAppliedFlag : false,
		firstLoad : false
	},
	init : function() {
		var me = this;
			me.updateConfig();
			me.firstLoad = true;
		$(document).on("datePickPopupSelectedDate",function(event,filterType,dates){
				me.datePickerSelectedDate=dates;
				//me.postingDateFilterVal = me.dateRangeFilterVal;
				//me.postingDateFilterLabel = "Date Range";
				me.handlePostingDateChange(me.dateRangeFilterVal);
			
		});
		$(document).on('performBackTransactionActivity', function(event) {
						me.doHandleBackAction(me);
					});
		$(document).on('click','.ui-dialog-titlebar-close',function(){
    					closePopup();
			});
		$(document).on('searchActionClicked', function() {
				me.handleSearchAction(me);
				});
		$(document).on('saveAndSearchActionClicked', function() {
					me.handleSaveAndSearchAction(me);
				});
		$(document).on('filterDateChange',function(event, evnetName, dates) {
					me.dateRangeFilterVal = '13';
					me.datePickerSelectedDate = dates;
					me.requestDateFilterVal = me.dateRangeFilterVal;
					me.postingDateFilterLabel = getLabel('daterange', 'Date Range');
					me.handlePostingDateChange(me.dateRangeFilterVal);
					 
				});	
		$(document).on('amountTypeChange',function(event, filterType, btn, opts) {
					me.amountTypeChange(btn);
				});	
		$(document).on('editActivityFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
		$(document).on('viewActivityFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
		/*$(document).on('deleteActivityFilterEvent', function(event, grid, rowIndex) {
					me.deleteFilterSet(grid, rowIndex);
				});*/
		$(document).on('orderUpGridEvent',function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
		$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();					
				});
		$(document).on('performPageSettingsTransaction', function(event) 
				{
					me.showPageSettingPopup('PAGE');
				});
		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) 
				{
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
		$(document).on('handleSavedFilterClick', function(event) 
		{
					me.handleSavedFilterClick();
		});
		$(document).on('deleteActivityFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
		});
		GCP.getApplication().on({
			'showTranscation' : function(record, strSummaryType, filterData, calledFromAccountSection) {
			  if(typeof summaryFilterPanel !='undefined'){
					summaryFilterPanel.destroy();
				}
			  	isAccountViewOn = false;
				istransactionViewOn = true;
				calledFromAccount=calledFromAccountSection;
				if(calledFromAccountSection){
				$('#brsummraytitle').html(getLabel('txnSummaryTitle2', 'Account / Cash Position Summary / Account View / Transactions View'));
				}
				else{
					$('#brsummraytitle').html(getLabel('txnSummaryTitle3', 'Account / Cash Position Summary / Transactions View'));
				}
				if(typeof accountFilterpanel!='undefined'){
					accountFilterpanel.destroy();
				}
				me.filterPref();
				me.updateAdvFilterConfig()
			
				var container = me.getCashPositionCenter();
				if (!Ext.isEmpty(container)) {
					var Veiw = Ext.create(
							'GCP.view.transaction.TransactionView', {
								gridModel : me.getGridModel(),
								filterData : filterData
							});
					container.updateView(Veiw);
					container.setActiveCard(1);
					objSummaryView=Veiw;

				}
				var strSummarySubLbl = getLabel('cpSummary',
						'Cash Position Summary');

				$("ul.ft-extra-nav")
						.html('<li id="accBalLink"><a href="#" id="cpsummary">'
								+ strSummarySubLbl
								+ '</a> > '
								+ getLabel('cpTransaction', 'Transactions View')
								+ '</li>');

				$('#accBalLink').click(function(){
				if (!Ext.isEmpty(me.getFilterView()) && !Ext.isEmpty(me.getFilterView().up('filterView'))) {
						me.getFilterView().up('filterView').destroy();
					}
					GCP.getApplication().fireEvent('showTranscation');
				});

				$('#cpsummarybackdiv').show();
				
				var strLocalPrefPageName = me.strPageName+'_TempPref'
				me.preferenceHandler.readPagePreferences(strLocalPrefPageName,
					me.updateObjLocalPref, null, me, false);
					
				var objJsonData='', objLocalJsonData='';
					if (objTxnGroupByPref || objSavedLocalTxnPref) {
						objJsonData = Ext.decode(objTxnGroupByPref);
						objLocalJsonData = Ext.decode(objSavedLocalTxnPref); 
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
							if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									me.savePrefAdvFilterCode=objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
									savedFilterCombobox.setValue(objLocalJsonData.d.preferences.tempPref.advFilterCode);
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateSavedFilter(me.savePrefAdvFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
								}
								else if (!Ext.isEmpty(objJsonData.d.preferences)) {
									if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
											me.savePrefAdvFilterCode=objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
											me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
											me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
											var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
											savedFilterCombobox.setValue(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
									}
								}
							}
							else if (!Ext.isEmpty(objJsonData.d.preferences)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									me.savePrefAdvFilterCode=objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
									var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
									savedFilterCombobox.setValue(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
								}
							}
						}
					}
			},
			 'transactionSavePreference' : function() {
				me.handleSavePreferences();
			},
		   'transactionClearPreference' : function() {
				me.handleClearPreferences();
		}
		});
		me.control({
			'ribbonView[itemId="summaryCarousal"]' : {
						expand : function(panel) {
							console.log('creating caousals');
							 me.handleSummaryInformationRender();				
							panel.doLayout();
						}	
					},
					'transactionView' : {
						'render' : function(panel) {
							// $('#summaryCarousal').empty();
							  var jsonArray = [];
							me.filterUIData = panel.filterData;
							me.txnCategory=me.filterUIData.txncatType;
							me.txnCategoryDesc=me.filterUIData.txnCategoryDesc;
							me.accountFilter=me.filterUIData.accountID;
							me.navigatedTxnCategory=me.txnCategory;
							me.accountNumber=me.filterUIData.accountNumber
							me.navigatedAccountId=me.accountFilter
							
							if (me.txnCategory != null && me.txnCategory != 'ALL' && me.txnCategory != '') {
								jsonArray.push({
											paramName : 'txnCatType',
											paramValue1 : encodeURIComponent(me.txnCategory.replace(new RegExp("'", 'g'), "\''")),
											operatorValue : 'eq',
											dataType : 'S',
											displayType : 5,
											paramFieldLable :getLabel('lblsavedTransaction','Transaction Category'),
											displayValue1 : me.txnCategoryDesc
										});
								txnCategoryValue = me.txnCategory;
								txnCategoryFlag = true;
							}
							
							me.filterData=jsonArray;
						}
					},
					'transactionView groupView' : {
						'groupTabChange' : function(groupInfo, subGroupInfo,
								tabPanel, newCard, oldCard) {
							me.doHandleGroupTabChange(groupInfo, subGroupInfo,
									tabPanel, newCard, oldCard);

						},
						'gridRender' : me.handleLoadGridData,
						'gridPageChange' : me.handleLoadGridData,
						'gridSortChange' : me.handleLoadGridData,
						'gridRowSelectionChange' : function(grid, record,
								recordIndex, records, jsonData) {
						},
						'gridRowActionClick' : function(grid, rowIndex,
								columnIndex, actionName, record) {
							me.doHandleRowIconClick(grid, rowIndex,
									columnIndex, actionName, record);
						},
						'gridStateChange' : function(grid) {
							me.disablePreferencesButton("savePrefMenuBtn", false);
							me.disablePreferencesButton("clearPrefMenuBtn", false);	
							//me.toggleSavePrefrenceAction(true);
						},
						'render' : function() 
						{
							var me = this;
							populateAdvancedFilterValues(me.advFilterCodeAppliedFlag);
						},						
						'gridSettingClick' : function(){
							me.showPageSettingPopup('GRID');
						},
						'gridPageSizeChange' : me.handleLoadGridData
						

					},
					'transactionFilterView combobox[itemId="transactionAccount"]' : {
						'select' : function() {
							me.filterApplied = 'Q';
							me.setDataForFilter();
							me.applyFilter();
						}

					},
					'transactionFilterView combobox[itemId="transactionCategory"]' : {
						'select' : function() {
							me.filterApplied = 'Q';
							me.setDataForFilter();
							me.applyFilter();
						}
					},
					'filterView label[itemId="createAdvanceFilterLabel"]' : {
				       'click' : function() {
				    	   			var me = this;
									showTransactionAdvanceFilterPopup();			
							}
						},
						'filterView button[itemId="clearSettingsButton"]' : {
							'click' : function() {
								me.handleTransClearSettings();
							}
						},
						'pageSettingPopUp[itemId="pageSettingPopUpTxn"]' : {
							'applyPageSetting' : function(popup, data,strInvokedFrom) {
								me.applyPageSetting(data,strInvokedFrom);
							},
							'savePageSetting' : function(popup, data,strInvokedFrom) {
								me.savePageSetting(data,strInvokedFrom);
							},
							'restorePageSetting' : function(popup,data,strInvokedFrom) {
								me.restorePageSetting(data,strInvokedFrom);
							}
						},
						'transactionView groupView smartgrid' : 
						{
							'cellclick' : me.handleGridRowClick
						},
						 'filterView' : 
						 {
							appliedFilterDelete : function(btn)
							{
								if(istransactionViewOn)
								{
									me.handleAppliedFilterDelete(btn);
								}
							}
						},
					'transactionFilterView':{
					    beforerender:function(){
					    	txnDetailFilterPanel=me.getTxnGenericFilterView();
					    	
					   var useSettingsButton = me.getTxnGenericFilterView()
							.down('button[itemId="useSettingsbutton"]');
							if (!Ext.isEmpty(useSettingsButton)) {
								useSettingsButton.hide();
							}
							
					  },
					  render:function(){
					  	var accountCombo=me.getTransAccountCombo();
	                    var txnCombo=me.getTransTxnCombo();
	                    if(me.accountNumber=='ALL' || typeof me.accountFilter=='undefined'){	
		                  accountCombo.setValue("ALL");
					    }else{
					    	  accountCombo.setValue(me.accountNumber);
					    }
					 if( me.txnCategory!="ALL"){
					    txnCombo.setValue(me.txnCategory)
					 }
					  },
					  'afterrender' : function(tbar, opts) {
						var txnCombo = me.getTransTxnCombo();
						if (me.txnCategory != "ALL") {
						txnCombo.setValue(me.txnCategory)
						}
					
							var objLocalJsonData='';
							if (objSavedLocalTxnPref) {
								objLocalJsonData = Ext.decode(objSavedLocalTxnPref);
								if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
									if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
										if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
											me.populateTempFilter(objLocalJsonData.d.preferences.tempPref.quickFilterJson);
										}
									}
								}
							}
						},
					  'handleSavedFilterItemClick' : function(comboValue, comboDesc) {
					  	   me.resetAllFields();
					      me.doHandleSavedFilterItemClick(comboValue);
				     }
			     },
			     'transactionFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					combo.getStore().on( 'load', function( store, records, options ) {
						//Check if saved filter from Preference is present in the list
					    if (!Ext.isEmpty(me.objFilterPref)){
							var prefValuePresent=false;
							me.savedFilterVal = me.objFilterPref.advFilterCode;
							if (!Ext.isEmpty(me.savedFilterVal)){
								var storeData = combo.getStore().data.items;
								for(var i = 0; i<storeData.length; i++){
									if(me.savedFilterVal==storeData[i].data.filterName){
										prefValuePresent=true;
										break;
									}
								}
							}
							if(prefValuePresent)
								combo.setValue(me.savedFilterVal);
							else
								me.savedFilterVal='';
						}
					});  	
				}
			    }
						
				});
	},
	handleSearchAction : function(btn) {
		var me = this;
		var savedFilterComboBox = me.getTransFilterCombo();
		savedFilterComboBox.setValue($("#msSavedFilter").val());
		me.savePrefAdvFilterCode = $("#msSavedFilter").val();
		selectedFilter = $("#msSavedFilter").val();
		me.doSearchOnly();
	},
	doSearchOnly : function() {
		var me = this;
		me.applyAdvancedFilter();
	},
	applyAdvancedFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.refreshData();
        //me.handleAdvanceFilterCleanUp();
	    me.closeFilterPopup();
	},
	
	closeFilterPopup : function(btn) {
		var me = this;
		$('#activityAdvFilterPopup').dialog("close");
		//me.getAdvanceFilterPopup().close();
	},
updateConfig : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},
 postingDateChange : function(btn, opts) {
		var me = this;
		me.postingDateFilterVal = btn.btnValue;
		me.postingDateFilterLabel = btn.text;
		me.handlePostingDateChange(btn.btnValue);
	},
handlePostingDateChange:function(index){
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index,null);

		if (!Ext.isEmpty(me.postingDateFilterLabel)) {
			$('label[for="PostingDateLabel"]').text(getLabel('postingDate',
					'Date')
					+ " (" + me.postingDateFilterLabel + ")");
		}
			var vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			var vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			var filterOperator=objDateParams.operator;
			
			if (index == '13') {
			if (filterOperator == 'eq') {
				$('#postingDate').datepick('setDate', vFromDate);
				}
			if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedPostingDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField
				};
			}
			/*if (index == '13') {
				if (filterOperator == 'eq') {
					$('#postingDate').setDateRangePickerValue(vFromDate);
				} else {
					$('#postingDate').setDateRangePickerValue([
							vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedPostingDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField
				};
			} else {
				if (index === '1' || index === '2' || index === '12') {
					if (index === '12') {
						$('#postingDate').val('Till' + '  ' + vFromDate);
					} else {
						$('#postingDate').setDateRangePickerValue(vFromDate);
					}
				} else {
					$('#postingDate').setDateRangePickerValue([
							vFromDate, vToDate]);
				}
				if(filterOperator=='eq')
					dateToField="";
				else
					dateToField=vToDate;
				selectedPostingDate={
					operator:filterOperator,
					fromDate:vFromDate,
					toDate:dateToField
				};
			}*/
	},
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val() || me.savedFilterVal;
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='filterCode']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
		}

		$("#msSavedFilter option[value='" + savedFilterVal + "']").attr(
					"selected", true);
		$("#msSavedFilter").multiselect("refresh");
					
		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var FilterCodeVal;
		
		if (me.filterCodeValue === null) {
			var FilterCode = $("#filterCode").val();
			if (Ext.isEmpty(FilterCode)) 
			{
				paintError('#advancedFltrErrorDiv','#advancedFilterErrMessage',getLabel('filternameMsg','Please Enter Filter Name'));
				return;
			}
			else
			{
				hideErrorPanel("advancedFltrErrorDiv");
				me.filterCodeValue=FilterCode;
				var FilterCodeVal = me.filterCodeValue;
			}
		}
		else 
		{
			FilterCodeVal = me.filterCodeValue;
		}
		me.savePrefAdvFilterCode = FilterCodeVal;
		if (Ext.isEmpty(FilterCodeVal)) 
		{
			paintError('#advancedFltrErrorDiv','#advancedFilterErrMessage',getLabel('filternameMsg','Please Enter Filter Name'));	
			return;	
		} 
		else 
		{
			hideErrorPanel("advancedFltrErrorDiv");
			me.postSaveFilterRequest(FilterCodeVal, callBack);
		}
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format(me.strModifySavedFilterUrl, FilterCodeVal);
		strUrl += '?$mode=' + me.filterMode;
		var objJson;
		objJson = getAdvancedFilterValueJson(FilterCodeVal);
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : Ext.encode(objJson),
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var isSuccess;
						var title, strMsg, imgIcon;
						if (responseData.d.filters
								&& responseData.d.filters.success)
							isSuccess = responseData.d.filters.success;

						if (isSuccess && isSuccess === 'N') {
							title = getLabel('instrumentSaveFilterPopupTitle',
									'Message');
							strMsg = responseData.d.filters.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							$('#advFilterPopup').dialog('close');
							fncallBack.call(me);
							me.updateSavedFilterComboInQuickFilter();
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel('errorPopUpTitle', 'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	
	postDoSaveAndSearch : function() {
		var me = this;
		objGroupView = null, savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
		if (savedFilterCombobox) {
			savedFilterCombobox.getStore().reload();
			savedFilterCombobox.setValue(me.filterCodeValue);
		}
		var objAdvSavedFilterComboBox = $("#msSavedFilter");
		if (objAdvSavedFilterComboBox) {
			blnOptionPresent = $("#msSavedFilter option[value='"
					+ me.filterCodeValue + "']").length > 0;
			if (blnOptionPresent === true) {
				objAdvSavedFilterComboBox.val(me.filterCodeValue);
			} else if (blnOptionPresent === false) {
				$(objAdvSavedFilterComboBox).append($('<option>', {
							value : me.filterCodeValue,
							text : me.filterCodeValue
						}));

				if (!Ext.isEmpty(me.filterCodeValue))
					arrValues.push(me.filterCodeValue);
				objAdvSavedFilterComboBox.val(arrValues);
				objAdvSavedFilterComboBox.multiselect("refresh");
			}
		}
		me.doSearchOnly();
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip(me.filterCodeValue || '');
	},
	getDateParam : function(index) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtSellerDate;
		var dtFormat = strExtApplicationDateFormat;
		if (!Ext.isEmpty(me.accountCalDate) && index === '2') {
			dtFormat = 'Y-m-d';
			strAppDate = me.accountCalDate;
		}
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		if (me.datePickerSelectedDate.length == 1) {
									fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
									fieldValue2 = fieldValue1;
									operator = 'eq';
								}
		/*switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '12':
						fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'le';
						break;
			case '13' :			
					if (me.datePickerSelectedDate.length == 1) {
									fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
									fieldValue2 = fieldValue1;
									operator = 'eq';
								}else if (me.datePickerSelectedDate.length == 2) {
									fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
									fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
										operator = 'bt';
								}
					break;
		}
		// comparing with client filter condition
         */
		if (!me.isFirstRequest
				&& Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
			fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {
		var me = this;

		var objLocalJsonData = '';
		if (objSavedLocalTxnPref)
					objLocalJsonData = Ext.decode(objSavedLocalTxnPref);
						
		var intPageNo = objLocalJsonData.d && objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.pageNo
				? objLocalJsonData.d.preferences.tempPref.pageNo
				: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
				
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		me.firstLoad = false;		
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		var balancesView = me.getTransactionView();
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		if (balancesView)
			balancesView.setLoading(true);
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) 
			{
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findNodeInJsonData(me.advFilterData,'field','Account');
				if (!Ext.isEmpty(reqJsonInQuick)) 
				{
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'accountFilter');
					quickJsonData = arrQuickJson;
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData);
			}
		}
		
		
			
		if (!Ext.isEmpty(me.advFilterData)) 
		{
			var advJsonData = (me.advFilterData).map(function(v) {
			  return  v;
			});
			
			if (!Ext.isEmpty(advJsonData) && advJsonData.length >= 1) {
				//remove sort by fields
				advJsonData = advJsonData.filter(function(a){ return (a.field != "SortBy" && a.field != "FirstThenSortBy" && a.field != "SecondThenSortBy" )});
				arrOfParseAdvFilter = generateFilterArray(advJsonData);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) 
		{
			arrOfFilteredApplied = arrOfParseQuickFilter.concat(arrOfParseAdvFilter);
			if ( arrOfFilteredApplied )
				me.getTxnGenericFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		
		if (!Ext.isEmpty(accountId) && Ext.isEmpty(me.filterData)) {
			me.getTransAccountCombo().setValue(accountId);
		}
		
		me.reportGridOrder = strUrl;	
		grid.loadGridData(strUrl, me.postHandleLoadGridData, null, false, me);
		if (isSaveLocalPreference)
			me.handleSaveLocalStorage();
	},
	postHandleLoadGridData : function(grid, data, scope) {
		var me = this;
		var balancesView = me.getTransactionView();
		if (balancesView)
			balancesView.setLoading(false);
			
			
	},
	
	generateFilterUrl : function(groupInfo, subGroupInfo) {
		var me = this;
		
		if(!Ext.isEmpty(widgetFilterUrl))
		{
			var strUrl = widgetFilterUrl;
			widgetFilterUrl = '';
			return strUrl;
		}
		var me = this, strUrl = '',isFilterApplied = false;
		var strModule = '', args=null ,fieldVal1 , filedVal2;
		var dtObj = (me.getDateParam(me.dateFilterVal) || {});
		if (me.filterApplied === 'A') {
			strAdvancedFilterUrl = me
					.generateUrlWithAdvancedFilterParams(isFilterApplied);
			
			if (!Ext.isEmpty(strAdvancedFilterUrl)) {
				strUrl += "&$filter=";
				strUrl += strAdvancedFilterUrl;
				isFilterApplied = true;
			}
			strUrl += '&$accountFilter=' + me.accountFilter;
			strUrl += '&$txnCatType=' + me.txnCategory;
		}
	if(me.filterApplied =='Q' || me.filterApplied == 'ALL'){
			if (!Ext.isEmpty(me.txnCategory)) {
			strUrl += '&$txnCatType=' + me.txnCategory;
		}
		
		strUrl += '&$summaryType=' + 'I';
		
	  if (Ext.isEmpty(me.accountFilter) || me.accountFilter=="ALL" ) {
				strUrl += '&$accountFilter=ALL';
		} else {
				strUrl += '&$accountFilter=' + me.accountFilter;
			}
	 }
		
		
		if(!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all' && !Ext.isEmpty(me.advTypeCode))
			strUrl += '&$typeCode=' + (me.txnFilter).join() +","+ (me.advTypeCode).join();  // for both
		else if (!Ext.isEmpty(me.txnFilter) && me.txnFilter !== 'all')
			strUrl += '&$typeCode=' + (me.txnFilter).join();                // only quick 
		else if(!Ext.isEmpty(me.advTypeCode))
			strUrl += '&$typeCode=' + (me.advTypeCode).join();              //adv type code
	
		
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupTypeCode)) {
			strModule = subGroupInfo.groupCode;
		}
		else
		{
			strModule = groupInfo.groupTypeCode;
		}
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupQuery)) {
			strUrl += '&'+subGroupInfo.groupQuery;
		}
		else
		{
			strUrl += '&$filterOn=&$filterValue=';
		}
		args = {
				'module' : strModule
		};
		
		strUrl += '&$serviceType='+mapService['BR_TXN_SRC_GRID'];
		strUrl += '&$serviceParam='+mapService['BR_GRIDVIEW_GENERIC'];
		/*if(me.filterApplied !== 'A'){
			//me.accountFilter = 'ALL';
			if(me.filterApplied != 'ALL') {
				strUrl += '&$$accountFilter=' + me.accountFilter;
			}
		}*/
		return strUrl;
	},
	
	handleSummaryInformationRender : function() {
		var me = this;
		//summary not rendering properly incase of it is collapsed from other screen.
		var typeCodeUrl = me.generateTypeCodeUrl();
		me.populateSummaryInformationView(typeCodeUrl, false);
	},
	generateTypeCodeUrl : function() {
		var me = this;
		var typeCodeUrl = me.strReadSummaryInfoUrl;
		return typeCodeUrl;
	},
	populateSummaryInformationView : function(strUrl, updateFlag) {
		  var me = this;
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							summaryData = data.d.summary;
							$('#summaryCarousalTxnTargetDiv').carousel({
								 data : summaryData,
								 titleNode : "txnDescription",
								 //contentNode:"typeCodeAmount",
								 contentRenderer: function(value) {
										return  value.currenySymbol + " " + Ext.util.Format.number(value.typeCodeAmount , '0,000.00') ;	
									},	
								 transactionNode:'txnCount'	
								});
						}
					},
					failure : function(response) {
						
					}
				});                        
	},

	getGridModel : function() {
		var me = this;
		var gridCols = null;
		var gridModel = null;
		var model=null;
		if (typeof me.objTransactionGridPref != 'undefined'
				&& !Ext.isEmpty(me.objTransactionGridPref)
				&& 'null' !== me.objTransactionGridPref)
			gridModel = me.objTransactionGridPref;
	else{
			model=me.getTxnModel();
			gridModel = gridModel || {
			"pgSize" : 10,
			"gridCols" : model
		};
		}
		
		
		return gridModel;
	},
	getTxnModel:function(){
		var gridModel = null;
		gridModel = [{
					"colId" : "accountNumber",
					"colHeader" : getLabel('account', 'Account')

				}, {
					"colId" : "accountName",
					"colHeader" : getLabel('accName', 'Account Name')

				}, {
					"colId" : "transactionDate",
					"colHeader" : getLabel('positionDate', 'Posting Date'),
					 width : 150

				}, {
					"colId" : "accountType",
					"colHeader" : getLabel('accType', 'Account Type'),
					 width:160

				},  {
					"colId" : "typeCode",
					"colHeader" : getLabel('typeCode', 'Type Code'),
					align : 'right',
					width:60

				}, {
					"colId" : "typeCodeDesc",
					"colHeader" : getLabel('typeDesc', 'Type Description'),
					width : 150

				}, {
					"colId" : "customerReference",
					"colHeader" : getLabel('custRef', 'Customer Ref')

				}, {
					"colId" : "bankReference",
					"colHeader" : getLabel('bankRef', 'Bank Ref'),
					width:100

				}, {
					"colId" : "textField",
					"colHeader" : getLabel('text', 'Text'),
					width:180

				}, {
					"colId" : "noteText",
					"colHeader" : getLabel('notes', 'Notes')

				}, {
					"colId" : "credit",
					"colHeader" : getLabel('credit', 'Credit'), 
					align:'right'

				}, {
					"colId" : "debit",
					"colHeader" : getLabel('debit', 'Debit'),
					align:'right'

				}]
		return gridModel;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me=this;		
		var objGroupView = me.getGroupView();		
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Commented the code.
		me.handleSummaryInformationRender();
		if (groupInfo && groupInfo.groupTypeCode) {
			if (groupInfo.groupTypeCode === 'CASHTXN_OPT_ADVFILTER' ) {
						strFilterCode = subGroupInfo.groupCode;
						if (strFilterCode !== 'all') {
					if (!Ext.isEmpty(strFilterCode)) {
							   me.resetAllFields();
								me.savedFilterVal = strFilterCode;
								me.showAdvFilterCode = strFilterCode;
								me.doHandleSavedFilterItemClick(strFilterCode);
							}
							// me.toggleSavePrefrenceAction(true);
						} else {
							me.savePrefAdvFilterCode = null;
							me.showAdvFilterCode = null;
							me.filterApplied = 'ALL';
							args = {
								scope : me
							};
							strModule = subGroupInfo.groupCode;
							strUrl = Ext.String.format(me.strPageName,
									strModule);
							
						me.preferenceHandler.readModulePreferences(me.strPageName,
				        	strModule, me.postDoHandleGroupTabChange, args, me, true);
						}
						
			} else{
			if (groupInfo.groupTypeCode === 'CASHTXN_OPT_ACCTYP') {
				strModule = subGroupInfo.groupCode;
			} else {
				strModule = groupInfo.groupTypeCode
			}
			args = {
				'module' : strModule
			};
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postDoHandleGroupTabChange, args, me, true);
		}
	} 
	},
	postDoHandleGroupTabChange : function(data, args, isSuccess) {
		var me=this;		
		var arrSortState=new Array(),objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		var objGroupView = me.getGroupView();	
		var objTransactionView=me.getTransactionView();
		var objLocalJsonData = '';
		if (objSavedLocalTxnPref)
					objLocalJsonData = Ext.decode(objSavedLocalTxnPref);
						
		var intPageSize = objLocalJsonData.d && objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.pageSize
				? objLocalJsonData.d.preferences.tempPref.pageSize
				: '';
		var intPageNo =objLocalJsonData &&objLocalJsonData.d &&objLocalJsonData.d.preferences
						&&objLocalJsonData.d.preferences.tempPref
						&&objLocalJsonData.d.preferences.tempPref.pageNo
						?objLocalJsonData.d.preferences.tempPref.pageNo
						: 1;
		var sortState =objLocalJsonData &&objLocalJsonData.d &&objLocalJsonData.d.preferences
					&&objLocalJsonData.d.preferences.tempPref
					&&objLocalJsonData.d.preferences.tempPref.sorter
					?objLocalJsonData.d.preferences.tempPref.sorter
					: [];
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = intPageSize || objPref.pgSize || _GridSizeTxn;
			colModel = objTransactionView.getDefaultColumnModel(arrCols);
			showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;		
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel:{
					  sortState:objPref.sortState
                    },
                     pageNo : intPageNo
				}
			}
		}
		if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
			gridModel = gridModel ? gridModel : {};
			gridModel.pageSize = intPageSize;
			gridModel.pageNo = intPageNo;
			gridModel.storeModel = {sortState: sortState};
			
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	doHandleRowIconClick : function(grid, rowIndex, columnIndex, actionName,
			record) {
		var me = this;
		var strEventName = null;
		var recId = record.raw.identifier;
		showTxnDetailsPopup(record,record.get('accountID'),record.get('accountType'));	
	},
	doHandleBackAction : function(btn) {
	var me = this;
			if (!Ext.isEmpty(me.getFilterView())&& !Ext.isEmpty(me.getFilterView().up('filterView'))) 
			{
				me.getFilterView().up('filterView').destroy();
			}
			GCP.getApplication().fireEvent('showSummary');
	},
	setDataForFilter : function() {
		var me=this;
		var transactionFilterView = me.getFilterView();
	    var arrQuickJson;
		var me = this;
		if (me.filterApplied === 'Q' || me.filterApplied === 'ALL') {
		if (!Ext.isEmpty(transactionFilterView)) {
			var accountCombo = me.getTransAccountCombo();
			var txnCombo = me.getTransTxnCombo();
			if(!Ext.isEmpty(accountCombo.getValue()) && accountCombo.getValue()!="ALL"){
				me.accountFilter = accountCombo.getValue();
				quickAccountName = accountCombo.getRawValue();
				quickAccountFlag = true;
			}else if(typeof me.navigatedAccountId !=undefined){
				me.accountFilter=me.navigatedAccountId;
			}else{
				me.accountFilter="ALL";
			}
			if(txnCombo.getValue()=='ALL'){
				me.txnCategory="ALL";
			}else
			{
			  me.txnCategory = txnCombo.getValue();
			  $('#category').val(me.txnCategory);
			}
		
		me.filterData = me.getQuickFilterQueryJson();
		me.advSortByData = [];
		}
		}
		else if (me.filterApplied === 'A') 
		{
			var txnCombo = me.getTransTxnCombo();
			txnCombo.setValue($('#category').val());
			me.filterData = me.getQuickFilterQueryJson();
			var objJson = getAdvancedFilterQueryJson();	
			var reqJson = me.findNodeInJsonData(objJson,'field','txnCategory');
			if(!Ext.isEmpty(reqJson))
			{
				me.updateQuicktxnCategory(reqJson.value1,reqJson.value2);
			}
			reqJson = me.findInAdvFilterData(objJson, "postingDate");
			if (!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "postingDate");
				me.filterData = arrQuickJson;
			}
			reqJson = me.findInAdvFilterData(objJson, "txnCategory");
			if (!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "txnCatType");
				me.filterData = arrQuickJson;
			}
			
			var sortByData=getAdvancedFilterSortByJson();
			if (!Ext.isEmpty(sortByData) && sortByData.length > 0) {
				me.advSortByData = sortByData;
			} else {
				me.advSortByData = [];
			}
			
			objJson = objJson.filter(function(a) {
				return (a.field != "SortBy" && a.field != "FirstThenSortBy" && a.field != "SecondThenSortBy")
			});

			for (var i = 0; i < sortByData.length; i++) {
				objJson.push(sortByData[i]);
			} 
			
			var filterCode = $("input[type='text'][id='filterCode']").val();
			me.advFilterCodeApplied = filterCode;
			me.advFilterCodeAppliedFlag = true;
			
			me.advFilterData = objJson;
		}
		
	},
	updateQuicktxnCategory : function(value,desc){
		var me = this;
		var transactionFilterView = me.getFilterView();
		if(!Ext.isEmpty(transactionFilterView)){
	    var txnCombo=me.getTransTxnCombo();
		txnCombo.setValue(value);
		}
		//txnCombo.setRawValue(desc);
		
	},
  updateQuickAccountCategory:function(value,desc){
     	var me = this;
		var transactionFilterView = me.getFilterView();
		if(!Ext.isEmpty(transactionFilterView)){
		var accountCombo=me.getTransAccountCombo();
		accountCombo.setValue(value);
		}
		//accountCombo.setRawValue(desc);
	},
		generateUrlWithAdvancedFilterParams : function(blnFilterApplied) {
		var me = this;
		var filterData = me.advFilterData;
		var isFilterApplied = blnFilterApplied;
		var isOrderByApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;
	  //	var pmtCreateNewAdvFilterRef = me.getCreateNewFilter();
		me.accountFilter = 'ALL';
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
						var fieldName = filterData[index].field;
				if(fieldName === 'Account')
					me.accountFilter = filterData[index].value1;
				else if(fieldName === 'AccountSet')
					me.accountFilter = filterData[index].value1;
				else if(fieldName === 'txnCategory')
					me.txnCategory=filterData[index].value1;
				else if(fieldName === 'typeCode')
					me.advTypeCode.push(filterData[index].value1);
				else{
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'lk')
						&& !isEmpty(strTemp)) {
					strTemp = strTemp + ' and ';
				}

				switch (operator) {
				case 'bt' :
					isFilterApplied = true;
					if (filterData[index].dataType === 1 || filterData[index].dataType === 'D' ) {
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operator + ' '
								+ 'date\'' + filterData[index].value1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].value2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operator + ' ' + '\''
								+ filterData[index].value1 + '\'' + ' and '
								+ '\'' + filterData[index].value2 + '\'';
					}
					break;
					
				case 'btamt' :
					if (isFilterApplied)
						strTemp = strTemp + ' and ';
					strTemp = strTemp + filterData[index].field + ' '
								+ ' bt ' + ' ' + '\''
								+ filterData[index].value1 + '\'' + ' and '
								+ '\'' + filterData[index].value2 + '\''
								+ ' or ' + filterData[index].field + ' '
								+ ' bt ' + ' ' + '\''
								+ (filterData[index].value2*(-1)) + '\'' + ' and '
								+ '\'' + (filterData[index].value1*(-1)) + '\'';
					isFilterApplied = true;
					break;
				
				case 'st' :
					if (!isOrderByApplied) {
						strTemp = strTemp + ' &$orderby=';
						isOrderByApplied = true;
					} else {
						strTemp = strTemp + ',';
					}
					strTemp = strTemp + filterData[index].value1 + ' '
							+ filterData[index].value2;
					break;
				case 'lk' :
					isFilterApplied = true;
					strTemp = strTemp + filterData[index].field + ' '
							+ filterData[index].operator + ' ' + '\''
							+ filterData[index].value1 + '\'';
					break;
				case 'eq' :
					var reg = new RegExp(/[\(\)]/g);
					var objValue = filterData[index].value1;
					if (objValue != 'All') {
						if (isFilterApplied) {
							strTemp = strTemp + ' and ';
						} else {
							isFilterApplied = true;
						}
						
						if (filterData[index].dataType === 1 || filterData[index].dataType === 'D'  ) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + objValue
									+ '\'';
						} else {
								strTemp = strTemp + filterData[index].field + ' '
										+ filterData[index].operator + ' ' + '\''
										+ objValue + '\'';
						}
						isFilterApplied = true;
					}
					break;
					
				case 'eqamt' :
					var reg = new RegExp(/[\(\)]/g);
					var objValue = filterData[index].value1;
					if (objValue != 'All') {
						if (isFilterApplied) {
							strTemp = strTemp + ' and ';
						} else {
							isFilterApplied = true;
						}
						strTemp = strTemp + filterData[index].field + ' '
								+ ' eq ' + ' ' + '\''
								+ objValue + '\'' + ' or '
								+ filterData[index].field + ' '
								+ ' eq ' + ' ' + '\''
								+ (objValue * (-1)) + '\'';
						isFilterApplied = true;
					}
					break;
				
				case 'gt' :
				case 'lt' :
					if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					} else {
						isFilterApplied = true;
					}
					if (filterData[index].dataType === 1) {
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operator + ' '
								+ 'date\'' + filterData[index].value1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operator + ' ' + '\''
								+ filterData[index].value1 + '\'';
					}
					break;
				case 'gte' :
					if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					} else {
						isFilterApplied = true;
					}
					strTemp = strTemp + '(';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + '\'' + filterData[index].value1
							+ '\'';
					strTemp = strTemp + ' or ';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'gt' + ' ' + '\'' + filterData[index].value1
							+ '\'';
					strTemp = strTemp + ')';
					break;
					
				case 'gteqtoamt' :
					if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					} else {
						isFilterApplied = true;
					}
					strTemp = strTemp + '(';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + '\'' + filterData[index].value1
							+ '\'';
					strTemp = strTemp + ' or ';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'gt' + ' ' + '\'' + filterData[index].value1
							+ '\'';
					strTemp = strTemp + ')' + ' or '
					+ '(';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + '\'' + (filterData[index].value1 * (-1))
							+ '\'';
					strTemp = strTemp + ' or ';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'gt' + ' ' + '\'' + (filterData[index].value1 * (-1))
							+ '\'' + ' and ';
					strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + '\'' + 0
							+ '\'';
					strTemp = strTemp + ')';
					break;
				
				case 'lte' :
					if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					} else {
						isFilterApplied = true;
					}
					if (filterData[index].dataType === 1) {
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + 'date\'' + filterData[index].value1
							+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + 'date\'' + filterData[index].value1
							+ '\'';
						strTemp = strTemp + ')';
					} else {
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + '\'' + filterData[index].value1
							+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + '\'' + filterData[index].value1
							+ '\'';
						strTemp = strTemp + ')';
					}
					break;
				
				case 'lteqtoamt' :
					if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					} else {
						isFilterApplied = true;
					}
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + '\'' + filterData[index].value1
							+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + '\'' + filterData[index].value1
							+ '\'' + ' and ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'gt' + ' ' + '\'' + 0
							+ '\''; 
						strTemp = strTemp + ')' + ' or ';
						
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'eq' + ' ' + '\'' + (filterData[index].value1 * (-1))
							+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + '\'' + (filterData[index].value1 * (-1))
							+ '\'' + ' and ';
						strTemp = strTemp + filterData[index].field + ' '
							+ 'lt' + ' ' + '\'' + 0
							+ '\''; 
						strTemp = strTemp + ')';
					break;
				
				case 'lteqtoorgt':
				if (isFilterApplied) {
						strTemp = strTemp + ' and ';
					} else {
						isFilterApplied = true;
					}
					if("valueDate"==filterData[index].field)
					{
						strTemp = strTemp + '(';
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
								+ 'eq' + ' ' + 'date\'' + filterData[index].value1
								+ '\'';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + filterData[index].field + ' '
								+ 'lt' + ' ' + 'date\'' + filterData[index].value1
								+ '\'';
						strTemp = strTemp + ')';
						strTemp = strTemp + ' or ';
						strTemp = strTemp + '(';
						strTemp = strTemp + filterData[index].field + ' '
									+ 'gt' + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'';
						strTemp = strTemp + ')';
						strTemp = strTemp + ')';
					}
					break;
				case 'in' :
					var reg = new RegExp(/[\(\)]/g);
					var objValue = filterData[index].value1;
					objValue = objValue.replace(reg, '');
					var objArray = objValue.split(',');
					if (objArray.length > 0) {
						if (objArray[0] != 'All') {
							if (isFilterApplied) {
								strTemp = strTemp + ' and ';
							} else {
								isFilterApplied = true;
							}

							strTemp = strTemp + '(';
							for (var i = 0; i < objArray.length; i++) {
								strTemp = strTemp + filterData[index].field
										+ ' eq ';
								strTemp = strTemp + '\'' + objArray[i]
										+ '\'';
								if (i != objArray.length - 1)
									strTemp = strTemp + ' or ';
							}
							strTemp = strTemp + ')';
						}
					}
					break;
			}
				
				}
			}
		}
		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied)
			strFilter = strTemp;
		else
			strFilter = '';
		// console.log(strFilter);
		return strFilter;
	},
	
	applyFilter : function() {
		var me = this;
		me.filterAppiled = 'Q';
		me.refreshData();
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		if(objGroupView){
		var grid = objGroupView.getGrid();
		if (grid) {
			if (!Ext.isEmpty(me.advSortByData)) {
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			} else {
				grid.removeAppliedSort();
			}
		}
		objGroupView.refreshData();
		}
	},
	getSortByJsonForSmartGrid : function() {
		  var me = this;
		  var jsonArray = [];
		  var sortDirection = '';
		  var fieldId = '';
		  var sortOrder = '';
		  var sortByData = me.advSortByData;
		  var debitChecked  = $("input[type='checkbox'][id='debitCheckBox']").is(':checked');
		  var creditChecked = $("input[type='checkbox'][id='creditCheckBox']").is(':checked');
		  if (!Ext.isEmpty(sortByData)) {
		   for (var index = 0; index < sortByData.length; index++) {
		    fieldId = sortByData[index].value1;
		    sortOrder = sortByData[index].value2;

		    if (sortOrder != 'asc')
		     sortDirection = 'DESC';
		    else
		     sortDirection = 'ASC';

		    
		    
		    if(fieldId=='amount'){
		    if(creditChecked)
		     jsonArray.push({
		        property : 'credit',
		        direction : sortDirection,
		        root : 'data'
		       });
		    if(debitChecked)
		    jsonArray.push({
		        property : 'debit',
		        direction : sortDirection,
		        root : 'data'
		       });  
		    }else{ 
		     jsonArray.push({
		        property : fieldId,
		        direction : sortDirection,
		        root : 'data'
		       });
		    }  
		   }

		  }
		  return jsonArray;
		 },
	viewFilterData : function(grid, rowIndex) {	
		var me = this;
		me.resetAllFields();
		me.filterCodeValue = null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter,'VIEW');
		changeAdvancedFltrTab(1);
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
				me.resetAllFields();
				me.filterCodeValue=null;
				var record = grid.getStore().getAt(rowIndex);
				var filterCode = record.data.filterName;
		
				var filterCodeRef = $("input[type='text'][id='filterCode']");
				if (!Ext.isEmpty(filterCodeRef)) {
					filterCodeRef.val(filterCode);
					filterCodeRef.prop('disabled', true);
				}
				var applyAdvFilter = false;
		
				me.filterCodeValue = filterCode;
		
				me.getSavedFilterData(filterCode, this.populateSavedFilter,
						applyAdvFilter,'EDIT');
				changeAdvancedFltrTab(1);

	},
	deleteFilterSet : function(filtercode) {
		/*var me = this;
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		grid.getStore().remove(record);

		if (me.savePrefAdvFilterCode == record.data.filterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			// me.refreshData();
			me.closeFilterPopup();
		}

		var store = grid.getStore();
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb(store);*/
		
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objComboStore = null;
		if ( !Ext.isEmpty(filtercode) )
			objFilterName = filtercode;
		me.filterCodeValue = null;

		if (me.savePrefAdvFilterCode == objFilterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}
		if (savedFilterCombobox) 
		{
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
			savedFilterCombobox.setValue('');
		}
		//var store = grid.getStore();
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb();

		
	},
	sendUpdatedOrderJsonToDb : function(store) {
		var me = this;
		var preferenceArray = [];

		store.each(function(rec) {
					var singleFilterSet = rec.raw;
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		var FiterArray = [];
		for (i = 0; i < preferenceArray.length; i++) {
			FiterArray.push(preferenceArray[i].filterName);
		}
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/btrSummaryActNewUX/advanceFilterPrefsOrder.json',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				me.updateSavedFilterComboInQuickFilter();
			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");

			}

		});
	},
	sendUpdatedOrderJsonToDb : function() {
		var me = this;
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() 
		{
					FiterArray.push($(this).val());
		});
		
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/btrSummaryActNewUX/advanceFilterPrefsOrder.json',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) 
			{
				me.updateSavedFilterComboInQuickFilter();
			},
			failure : function() 
			{}
		});
	},
	deleteFilterCodeFromDb : function(objFilterName) {
		var me = this;
		if (!Ext.isEmpty(objFilterName)) {
			var strUrl = me.strRemoveSavedFilterUrl;
			strUrl = Ext.String.format(strUrl, objFilterName);
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						success : function(response) {

						},
						failure : function(response) {
							// console.log('Bad : Something went wrong with your
							// request');
						}
					});
		}
	},
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);

		var store = grid.getStore();
		if (!record) {
			return;
		}
		var index = rowIndex;

		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
			var beforeRecord = store.getAt(index);
			store.remove(beforeRecord);
			store.remove(record);

			store.insert(index, record);
			store.insert(index + 1, beforeRecord);
		} else {
			if (index >= grid.getStore().getCount() - 1) {
				return;
			}
			var currentRecord = record;
			store.remove(currentRecord);
			var afterRecord = store.getAt(index);
			store.remove(afterRecord);
			store.insert(index, afterRecord);
			store.insert(index + 1, currentRecord);
		}
		this.sendUpdatedOrderJsonToDb(store);
	},
	resetAllFields : function() {
		var me = this;
		var date = Ext.util.Format.date(dtSellerDate,
					strExtApplicationDateFormat);
		$("input[type='checkbox'][id='debitCheckBox']")
				.prop('checked', false);
		$("input[type='checkbox'][id='creditCheckBox']").prop('checked',
				false);
		$("input[type='checkbox'][id='postedTxnsCheckBox']")
				.prop('checked', false);
		$("input[type='checkbox'][id='expectedTxnsCheckBox']").prop('checked',
				false);
		$("input[type='checkbox'][id='hasImageCheckBox']").prop('checked',
				false);
		$("input[type='checkbox'][id='hasAttachmentCheckBox']").prop('checked',
				false);
		$("input[type='checkbox'][id='saveFilterChkBox']")
		.prop('checked', false);
		//resetAllMenuItemsInMultiSelect("#msProductCategory");
		$('#accountRadio1').prop('checked', true);
		$('#accAutoComp').val('');
		$("input[type='text'][id='amountField']").val("");
		selectedAmountType={};
		$('#amountOperator').val('');
		$("input[type='text'][id='notes']").val("");
		selectedPostingDate={
					operator:"eq",
					fromDate:date,
					toDate:''
				};
		$('#postingDate').val(date);
		selectedValueDate={};
		$('#valueDate').val("");
		$("#typeCode").val("");
		me.advTypeCode = [];
		$("#msSortBy1").val("");
		$('#msSortBy2 option').remove();
		
		/*$("#category").append($('<option />', {
					value : "",
					text : "Select"
		}));*/
		$("#category").val("Select");
		$("#msSortBy2").append($('<option />', {
			value : "None",
			text : "None"
			}));
		$('#msSortBy3 option').remove();
		$("#msSortBy3").append($('<option />', {
			value : "None",
			text : "None"
			}));
		$('#msSortBy2').attr('disabled',true);
		$('#msSortBy3').attr('disabled',true);
		$('#bankReference').val("");
		$('#customerReference').val("");
		$("input[type='text'][id='filterCode']").val("");
		$("input[type='text'][id='filterCode']").prop('disabled', false);
		$('label[for="PostingDateLabel"]').text(getLabel('postingDate', 'Date'));
		
		$("#accTyp option:selected").attr("selected",false); 
		$('#accTyp').multiselect("refresh");
		me.filterCodeValue = null;
		$("#msSortBy1").niceSelect('update');
		$("#msSortBy2").niceSelect('update');
		$("#msSortBy3").niceSelect('update');
		/*me.filterMode = 'ADD';*/
		
	},
	amountTypeChange : function(btn) {
		var operator = '';
		var me = this;		
		me.amountFilterVal = btn.btnValue;
		me.amountFilterLabel = btn.text;
		
		if (!Ext.isEmpty(me.amountFilterLabel)) {
			$('label[for="AmountLabel"]').text(getLabel('amount',
					'Amount')
					+ " (" + me.amountFilterLabel + ")");
		}
		switch (btn.btnId) {
			case 'btnLtEqTo' :
				// Less Than Equal To
				operator = 'lteqto';
				break;
			case 'btnGtEqTo' :
				// Greater Than Equal To
				operator = 'gteqto';
				break;
			case 'btnEqTo' :
				// Equal To
				operator = 'eq';
				break;
			case 'btnAmtRange' :
				// AmountRange
				operator = 'bt';
				break;
		}
		
		selectedAmountType={
					operator:operator			
				};
		
	//	me.handleAmountChange(me.amountFilterVal);
		
	/*	if (!Ext.isEmpty(me.getAmountTypeBtn())) {
			me.getAmountTypeBtn().amtOperator = operator;
		}
		
		var menuItems = me.getAmountMenu();
		var itemMenu = menuItems.down("[btnValue=" + operator + "]")
		if (!Ext.isEmpty(itemMenu)) {
			var textVal = itemMenu.text;
			me.getAmountLabel().setText(getLabel('amount', 'Amount') + "("
					+ textVal + ")");
		}*/
	},
	handleTransClearSettings:function()
		{
		var me=this;
		var objGroupView = me.getGroupView();
		me.filterApplied = 'Q';
		me.filterData = [];
		me.advFilterData = [];
		var txnFilterView = me.getFilterView();
		$('#msSavedFilter').val("Select");
		$('#msSavedFilter').multiselect("refresh");
		if(!Ext.isEmpty(txnFilterView))
		{
			var accountCombo = me.getTransAccountCombo();
		    var txnCombo = me.getTransTxnCombo();
		    var transFilterCombo = me.getTransFilterCombo();
		    quickAccountFlag = false;
		    accountId="All"; 
			accountCombo.setValue("ALL");
			txnCombo.setValue("ALL");
			me.txnCategory= "ALL";
			
			if(!Ext.isEmpty(me.navigatedAccountId))
			{
				me.accountFilter=me.navigatedAccountId;
			}
			else
			{
				me.accountFilter='ALL';
			}
			transFilterCombo.setValue("");
			
			var postingDateRef = $('#postingDate');
			postingDateRef.val('');
			
			if(!Ext.isEmpty(me.savedFilterVal))
				me.savedFilterVal = "";
			me.resetAllFields();
		}
		me.setDataForFilter();
		me.refreshData();
	
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter, mode) {
		var me = this;		
		var objJson;
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						if (!Ext.isEmpty(response.responseText)) {
							var responseData = Ext
									.decode(response.responseText);
							fnCallback.call(me, filterCode, responseData,
									applyAdvFilter,mode);
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									cls : 't7_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
		populateSavedFilter : function(filterCode, filterData, applyAdvFilter, mode) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var currentFilterData = '';
		var fieldType = '';
		var columnId = '';
		var sortByOption = '';
		var buttonText = '';
		var operatorValue = '';
		var objSellerAutoComp = null;
		me.savedFilterVal=filterCode;
		$('#filterCode').val(filterCode);
		
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			
			if(fieldName === 'category' ){			
				$('#category').attr('checked',true);
				$('#category').val(fieldVal);
				me.txnCategory = fieldVal;
			}
			if(fieldName === 'Account' ){			
				$('#accountRadio1').attr('checked',true);
				$('#accAutoComp').val(fieldSecondVal);
				accountId = fieldVal;
				var accountCombo=me.getTransAccountCombo();
				accountCombo.setValue(fieldVal);
			}
			else if(fieldName === 'AccountSet')
			{
				$('#accountRadio2').attr('checked',true);
				$('#accAutoComp').val(fieldSecondVal);
				accountId = fieldVal;
				
			}else if (fieldName === 'SortBy' || fieldName === 'FirstThenSortBy'
					|| fieldName === 'SecondThenSortBy') {
				columnId = fieldVal;
				sortByOption = fieldSecondVal;
				buttonText = getLabel("ascending", "Ascending");
				if (sortByOption !== 'asc')
					buttonText = getLabel("descending", "Descending");
				me.setSortByComboFields(fieldName, columnId, buttonText, true);
			}
			
			
			else if	(fieldName === 'typeCode'){
			$('#typeCode').val(fieldVal);
			}	
			else if(fieldName === 'bankReference'){
				$('#bankReference').val(fieldVal);
			}	
			else if(fieldName === 'customerReference'){
				$('#customerReference').val(fieldVal);              
			}	
			else 	if(fieldName === 'noteText'){
				$('#notes').val(fieldVal);
			}	
			
	
			else if (fieldName === 'amount') {
				$("#amountField").val(fieldVal);
				//selectedAmountType.operator = operatorValue;
				$("#amountOperator").val(operatorValue);
			/*	var amtLabel = operatorValue === 'lte' ? 'Less Than Equal To' : operatorValue === 'gte' ? 'Greater Than Equal To' : 'Equal To';
				$('label[for="AmountLabel"]').text(getLabel('amount','Amount') + " (" + amtLabel + ")");*/
			}

			
			else if(fieldName === 'debitFlag')
			{
				$('#debitCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'creditFlag')
			{
				$('#creditCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'postedTxnsFlag')
			{
				$('#postedTxnsCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'expectedTxnsFlag')
			{
				$('#expectedTxnsCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'hasImageFlag')
			{
				$('#hasImageCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if(fieldName === 'hasAttachmentFlag')
			{
				$('#hasAttachmentCheckBox').prop('checked', fieldVal === 'N' ? false : true );
			}
			else if (fieldName === 'postingDate') {
					selectedPostingDate.operator = operatorValue;
					selectedPostingDate.fromDate = new Date(fieldVal),
					selectedPostingDate.toDate = Ext.isEmpty(fieldSecondVal) ? '' : new Date(fieldSecondVal);
					$('#postingDate').setDateRangePickerValue([selectedPostingDate.fromDate, selectedPostingDate.toDate]);
			} else if (fieldName === 'selectedValueDate') {
					selectedValueDate.operator = operatorValue;
					selectedValueDate.fromDate = new Date(fieldVal),
					selectedValueDate.toDate = Ext.isEmpty(fieldSecondVal) ? '' : new Date(fieldSecondVal);
					$('#valueDate').setDateRangePickerValue([selectedValueDate.fromDate, selectedValueDate.toDate]);
			}
			else if(fieldName === 'subFacilityCode'){				
				me.checkUnCheckMenuItems(fieldName, fieldVal);
			}
			else if (fieldName === 'debitCreditFlag')
			{
				fieldVal  = fieldVal.replace(/%20/g, ' ');
				fieldVal = fieldVal.replace(/%2C/g, ',');
				var array = fieldVal.split(',');

				for (var cnt = 0; cnt < array.length; cnt++) {
					var arrVal = array[cnt];
					arrVal = arrVal.replace(/^\s*/, "").replace(/\s*$/, "");
					if (arrVal == 'Debit')
					{
						$("#debitCheckBox").prop('checked', fieldVal === 'N' ? false : true );
					}else if (arrVal == 'Credit')
					{
						$("#creditCheckBox").prop('checked', fieldVal === 'N' ? false : true );
					}else if (arrVal == 'Posted Transactions')
					{
						$("#postedTxnsCheckBox").prop('checked', fieldVal === 'N' ? false : true );
					}else if (arrVal == 'Expected Transactions')
					{
						$("#expectedTxnsCheckBox").prop('checked', fieldVal === 'N' ? false : true );
					}
				}
			}
		}

		if (applyAdvFilter)
			me.applyAdvancedFilter();

	},
	checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if (componentName === 'subFacilityCode') {
			menuRef = $("select[id='accTyp']");
			elementId = '#accTyp';
		} 

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");

			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}

			var dataArray = data.split(',');
			if (componentName === 'subFacilityCode') {
				me.paymentTypeFilterVal = dataArray;
			}
			
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (dataArray[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=" + itemArray[index].value
								+ "]").prop("selected", true);
						break;
					}
				}
			}
			$(elementId).multiselect("refresh");
		}
	},
	setSortByComboFields : function(fieldName, columnId, buttonText,
			disableFlag) {
		if (!Ext.isEmpty(fieldName)) {

			if (fieldName === 'SortBy') {
				// sortBySortOptionButton
				if (!Ext.isEmpty(buttonText)) {
					var sortByLabelRef = $("#sortBy1AscDescLabel");
					if (!Ext.isEmpty(sortByLabelRef)){
						sortBy1ComboSelected(columnId);
						sortByLabelRef.text(buttonText);
					}
				}

				// Sort By
				if (!Ext.isEmpty(columnId)) {
					var sortByComboRef = $("#msSortBy1");
					if (!Ext.isEmpty(sortByComboRef)) {
						sortByComboRef.val(columnId);
						$("#msSortBy1").niceSelect('update');
						$('#msSortBy2').attr('disabled',false);
						$("#msSortBy2").niceSelect();
					}
				}

			} else if (fieldName === 'FirstThenSortBy') {
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = $("#sortBy2AscDescLabel");
					if (!Ext.isEmpty(thenSortByButtonRef)){
						sortBy2ComboSelected(columnId);
						thenSortByButtonRef.text(buttonText);
					}
				}

				// First Then Sort By
				if (!Ext.isEmpty(columnId)) {
					var firstThenSortByCombo = $("#msSortBy2");
					if (!Ext.isEmpty(firstThenSortByCombo)) {
						firstThenSortByCombo.val(columnId);
						$("#msSortBy2").niceSelect('update');
						$('#msSortBy3').attr('disabled',false);
						$("#msSortBy3").niceSelect();
					}
				}

			} else if (fieldName === 'SecondThenSortBy') {
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = $("#sortBy3AscDescLabel");
					if (!Ext.isEmpty(thenSortByButtonRef)){
						//sortBy2ComboSelected();
						thenSortByButtonRef.text(buttonText);
					}
				}

				// Second Then Sort By
				if (!Ext.isEmpty(columnId)) {
					var secondThenSortByComboRef = $("#msSortBy3");
					if (!Ext.isEmpty(secondThenSortByComboRef)) {
						secondThenSortByComboRef.val(columnId);
						$("#msSortBy3").niceSelect('update');
					}
				}
			}
		}
	},
	doHandleSavedFilterItemClick : function(filterCode) {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val()  || me.savedFilterVal;
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) 
		{
			filterCodeRef.val(savedFilterVal);
		}
		
		$("#msSavedFilter option[value='" + savedFilterVal + "']").attr(
					"selected", true);
		$("#msSavedFilter").multiselect("refresh");
		
		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);
			
		if ( !Ext.isEmpty(filterCode) ) 
		{
			me.SearchOrSave = true;
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true , null);
		}
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	updateSavedFilterComboInQuickFilter : function() {
		  var me = this;
		  var savedFilterCombobox;
		  
		  if(!Ext.isEmpty(me.getFilterView()))
		   savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		   
		  if (!Ext.isEmpty(savedFilterCombobox)) 
		  {
			savedFilterCombobox.getStore().reload();
		   if (me.filterCodeValue != null) 
		   {
				me.savedFilterVal = me.filterCodeValue;
		   }
		   else 
		   {
				me.savedFilterVal = '';
		   }
		   
		   me.savePrefAdvFilterCode=me.savedFilterVal
		   savedFilterCombobox.setValue(me.savedFilterVal);
		   me.filterCodeValue = null;
		   
		  }
	},
	handleSavePreferences : function() {
		var me = this;
		if ($("#savePrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{
			var arrPref = me.getPreferencesToSave(false);
			if (arrPref) {
				me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
						me.postHandleSavePreferences, null, me, true);
			}
		}
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var arrPref = [], objFilterPref = null, grid = null, gridState = null;
		var infoPanelCollapsed = false, graphPanelCollapsed = false;
		var groupInfo = null, subGroupInfo = null;
		// Summary Information Panel

		
		objFilterPref = me.getFilterPreferences();
		var groupView = me.getGroupView();
		if(groupView){
		var state = groupView.getGroupViewState();
		groupInfo = groupView.getGroupInfo() || '{}';
		subGroupInfo = groupView.getSubGroupInfo() || {};
	
			arrPref.push({
		               "module" : "groupByPref",
					    "jsonPreferences" : {
									groupCode : groupInfo.groupTypeCode,
									subGroupCode : subGroupInfo.groupCode
								}
					});
		arrPref.push({
					"module" : subGroupInfo.groupCode,
						"jsonPreferences" : {
						'gridCols' : state.grid.columns,
						'pgSize' : state.grid.pageSize,
						'sortState':state.grid.sortState,
						'gridSetting' : state.gridSetting 
						}
					});
		arrPref.push({
						"module" : "filterPref",
						"jsonPreferences" : objFilterPref
					});	
		}
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this;
		var objFilterPref = {};
		//objFilterPref.txnCategory = me.txnCategory;
		//objFilterPref.accountFilter = me.accountFilter;
		objFilterPref.advFilterCode = me.savePrefAdvFilterCode;
		return objFilterPref;
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'N') {
				me.disablePreferencesButton("savePrefMenuBtn", false);	
				me.disablePreferencesButton("clearPrefMenuBtn", true);	
		} else {
			me.disablePreferencesButton("clearPrefMenuBtn", false);	
			me.disablePreferencesButton("savePrefMenuBtn", true);	
		}
	},
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
	handleClearPreferences : function() {
		var me = this;
		if ($("#clearPrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
		}		
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			me.disablePreferencesButton("savePrefMenuBtn", false);	
			me.disablePreferencesButton("clearPrefMenuBtn", true);	
		} else {
			me.disablePreferencesButton("clearPrefMenuBtn", false);	
			me.disablePreferencesButton("savePrefMenuBtn", true);	
		}
	},
	 postDoHandleReadPagePref : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data) && !Ext.isEmpty(data.d.preferences)) {
				me.objTransactionGridPref = data.d.preferences[me.strServiceParam];
			}
		}
	},
	filterPref : function() {
		var me = this;
			if (objTxnGroupByPref) {
			        var objJsonData = Ext.decode(objTxnGroupByPref);
			        me.objTransactionGridPref = objJsonData.d.preferences.gridCols;
			         me.objFilterPref = objJsonData.d.preferences.filterPref;
			         if( me.objFilterPref){
			         	// me.txnCategory= me.objFilterPref.txnCategory
			         	 //me.accountFilter= me.objFilterPref.accountFilter
			         }
		         }
			
		
	},
	updateAdvFilterConfig : function() {
		var me = this;
		if (!Ext.isEmpty(me.objFilterPref)) {
			var objJsonData = me.objFilterPref;
			if (!Ext.isEmpty(objJsonData.advFilterCode)) {
				var advFilterCode = objJsonData.advFilterCode;
				if (!Ext.isEmpty(advFilterCode)) {
					me.savePrefAdvFilterCode=advFilterCode;
					me.doHandleSavedFilterItemClick(advFilterCode);
				}
			}
		}
		else
		{
			me.savePrefAdvFilterCode = '';
			me.advFilterData = [];
		}
	},
	findNodeInJsonData : function(arr, paramName, key) { // Find array element which
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai[paramName] == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	downloadReportTxn : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadReport : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2',
			downloadMt940 : 'mt940',
			downloadqbook : 'quickbooks',
			downloadquicken : 'quicken'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';
		var args=null;
		var strModule = '';
		var visColsStr = "";
		strExtension = arrExtension[actionName];
		strUrl = 'services/cashPositionTxn/generateReport.' + strExtension;
		strUrl += '?$skip=1';
		
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo() || '{}';	
		var subGroupInfo = objGroupView.getSubGroupInfo() || {};
		//var groupInfo = '{}';	
		//var subGroupInfo = {};
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		
		var strOrderBy = me.reportGridOrder;
		if (!Ext.isEmpty(strOrderBy)) {
			var orderIndex = strOrderBy.indexOf('orderby');
			if (orderIndex > 0) {
				strOrderBy = strOrderBy.substring(orderIndex,
						strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if (indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0, indexOfamp);
				strUrl += '&$' + strOrderBy;
			}
		}
		
		if (!Ext.isEmpty(objGroupView)) {
			colMap = new Object();
			colArray = new Array();

			grid = objGroupView.getGrid();

			if (!Ext.isEmpty(grid)) {
				viscols = grid.getAllVisibleColumns();

				for (var j = 0; j < viscols.length; j++) {
					col = viscols[j];
					if (col.dataIndex && arrDownloadTxnReportColumn[col.dataIndex]) {
						if (colMap[arrDownloadTxnReportColumn[col.dataIndex]]) {
							// ; do nothing
						} else {
							colMap[arrDownloadTxnReportColumn[col.dataIndex]] = 1;
							colArray
									.push(arrDownloadTxnReportColumn[col.dataIndex]);

						}
					}

				}
			}
			if (colMap != null) {
				visColsStr = visColsStr + colArray.toString();
				strSelect = '&$select=[' + colArray.toString() + ']';
			}
		}
		strUrl = strUrl + strSelect;
		
		var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
			while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
		   }
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));	
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		
		Object.keys(objParam).map(function(key) { 
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					key, objParam[key]));
		});
					
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	removeFromAdvanceArrJson : function(arr,key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	findInAdvFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
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
	getQuickFilterQueryJson : function() {
		var me = this;
		
	    var accountCombo = me.getTransAccountCombo();
		var txnCombo = me.getTransTxnCombo();
		me.accountFilter = accountCombo.getValue();
		me.txnCategory = txnCombo.getValue();
		me.accountFilterDesc = accountCombo.getRawValue();
		me.txnCategoryDesc = txnCombo.getRawValue();
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		
		var jsonArray = [];
		if (!Ext.isEmpty(clientFilterVal) && clientFilterVal != 'ALL') {
			jsonArray.push({
						paramName : 'Client',
						paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						displayValue1 : clientFilterVal
					});
		}
		if (me.txnCategory != null && me.txnCategory != 'ALL' && me.txnCategory != '') {
			jsonArray.push({
						paramName : 'txnCatType',
						paramValue1 : encodeURIComponent(me.txnCategory.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable :getLabel('lblsavedTransaction','Transaction Category'),
						displayValue1 : me.txnCategoryDesc
					});
		}
		if (me.accountFilter != null && me.accountFilter != 'ALL') {
			jsonArray.push({
						paramName : 'accountFilter',
						paramValue1 : me.accountFilter,
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('labelSavedAccount','Account'),
						displayValue1 : me.accountFilterDesc
					});
		}

		return jsonArray;
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) 
	{
		var me = this;
		if (isSessionClientFilter)
			me.clientFilterVal = selectedFilterClient;
		else
			me.clientFilterVal = isEmpty(selectedClient)? 'all': selectedClient;
			
		me.clientFilterDesc = selectedClientDesc;
		quickFilterClientValSelected = me.clientFilterVal;
		quickFilterClientDescSelected = me.clientFilterDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') 
		{
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();

		} 
		else 
		{
			me.applyQuickFilter();
		}
	},
	handleAppliedFilterDelete : function(btn)
    {       
		    var me = this;
			var objData = btn.data;
			var quickJsonData = me.filterData;
			var advJsonData = me.advFilterData;
			
			if(!Ext.isEmpty(objData))
			{
				var paramName = objData.paramName || objData.field;
				var reqJsonInAdv = null;
				var arrAdvJson =null;
				//adv
				var reqJsonInAdv = me.findInAdvFilterData(advJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInAdv)) {
					arrAdvJson = advJsonData;
					arrAdvJson = me
							.removeFromAdvanceArrJson(arrAdvJson,paramName);
					me.advFilterData = arrAdvJson;
				}
				// quick
				else {
					var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
					if (!Ext.isEmpty(reqJsonInQuick)) {
						arrQuickJson = quickJsonData;
						arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
						me.filterData = arrQuickJson;
					}
				}
				me.resetFieldInAdvAndQuickOnDelete(objData);
				me.refreshData();
			}
    },
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		var accountFilter = me.accountFilter;
		
		if(strFieldName ==='accountId')
		{
		var accountComboBox = me.getGenericFilterView().down('combo[itemId="viewAccountCombo"]');
			me.accountFilter = 'ALL';
			accountComboBox.setValue(me.accountFilter);
		}
		else if(strFieldName ==='txnCatType')
		{
			var txnCombo = me.getTransTxnCombo();
			txnCombo.setValue("ALL");
			me.txnCategory= "ALL";
			$("#category").val("Select");
		}
		else if(strFieldName ==='categoryId')
		{
			var cateGoryComboBox = me.getGenericFilterView().down('combo[itemId="viewcategoryCombo"]');
			me.txncategory = 'ALL';
			cateGoryComboBox.setValue(me.txncategory);
		}
		else if(strFieldName ==='Client')
		{			
			if(isClientUser())
			{
				var clientComboBox = me.getGenericFilterView().down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'ALL';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
			} 
			else 
			{
				var clientComboBox = me.getGenericFilterView().down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}
		else if(strFieldName ==='postingDate')
		{	
				var datePickerRef = $('#postingDate');
				datePickerRef.val('');
				me.dateRangeFilterVal = '13';
				me.datePickerSelectedDate = {};
				me.requestDateFilterVal = '';
				me.postingDateFilterLabel = getLabel('daterange', 'Date Range');
				selectedPostingDate = {};
		}

	},savePageSetting : function(arrPref, strInvokedFrom) { 
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else
		{
			var me = this;
			me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);
		}
	},
	applyPageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
			{
				/**
				 * This handling is required for non-us market
				 */
				var groupView = me.getGroupView(), 
				subGroupInfo = groupView.getSubGroupInfo()|| {}, 
				objPref = {},
				groupInfo = groupView.getGroupInfo()|| '{}', 
				strModule = subGroupInfo.groupCode;
				Ext.each(arrPref || [], function(pref) 
						{
							if (pref.module === 'ColumnSetting') 
							{
								objPref = pref.jsonPreferences;
							}
						});
				args['strInvokedFrom'] = strInvokedFrom;
				args['objPref'] = objPref;
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
				me.preferenceHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} 
			else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
				if(!Ext.isEmpty(arrPref[0].jsonPreferences.defaultFilterCode))
				{
					me.doHandleSavedFilterItemClick(arrPref[0].jsonPreferences.defaultFilterCode);
					var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
					savedFilterCombobox.setValue(arrPref[0].jsonPreferences.defaultFilterCode);
				}
			}
		}
	},
restorePageSetting : function(arrPref, strInvokedFrom) { 
		//For US, NON US market		
		var me = this;
		if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
				{
					var groupView = me.getGroupView(), subGroupInfo = groupView.getSubGroupInfo()
					|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
					|| '{}', strModule = subGroupInfo.groupCode, args = {};

			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'+ strModule : strModule;
			args['strInvokedFrom'] = strInvokedFrom;
			Ext.each(arrPref || [], function(pref) 
			{
				if (pref.module === 'ColumnSetting') 
				{
					pref.module = strModule;
					return false;
				}
			});
			me.preferenceHandler.clearPagePreferences(me.strPageName,
			arrPref,me.postHandleRestorePageSetting, args, me, false);
		} 
		else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
		}
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') 
		{
			var me = this;
			var objGroupView = me.getGroupView();			
			var gridModel = null, objData = null;
			if (args && args.strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
			{
				var objGroupView = me.getGroupView(), gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = 
					{
						columnModel : args.objPref.gridCols
					}
				objGroupView.reconfigureGrid(gridModel);
			}
			else
			{
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getTransactionView()) {
					objGroupView =me.getTransactionView().createGroupView();
					me.getTransactionView().add(objGroupView);	
				}
			}
		} 
		else 
		{
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') 
		{
			var me = this;
			var objGroupView = me.getGroupView();
			if (args && args.strInvokedFrom === 'GRID'&& _charCaptureGridColumnSettingAt === 'L') 
			{
				var objGroupView = me.getGroupView();
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} 
			else
			{//window.location.reload();
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getTransactionView()) {
					objGroupView =me.getTransactionView().createGroupView();
					me.getTransactionView().add(objGroupView);	
				}
			}
		} 
		else 
		{
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	showPageSettingPopup : function(strInvokedFrom) 
	{
		var me = this, objData = {}, objGroupView =  me.getGroupView(), 
		objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '',
		objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
		me.pageSettingPopup = null;

					if (!Ext.isEmpty(objTxnGroupByPref))
					{
						//Replace as per screen saved preferences
						objPrefData = Ext.decode(objTxnGroupByPref); //Replace as per screen saved preferences
						
						objGeneralSetting = objPrefData && objPrefData.d.preferences &&
						objPrefData.d.preferences.GeneralSetting ? objPrefData.d.preferences.GeneralSetting : null;
						
						objGridSetting = objPrefData && objPrefData.d.preferences && 
						objPrefData.d.preferences.GridSetting ? objPrefData.d.preferences.GridSetting : null;
						/**
						 * This default column setting can be taken from
						 * preferences/gridsets/under defined( js file)
						 */
						objColumnSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting
								&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
								: (CASH_POSITION_GENERIC_TXN_COLUMN_MODEL || '[]'); 
						// For Dynamic profile will change column model as per grid set profile define at filter view js file
								
						if (!Ext.isEmpty(objGeneralSetting)) 
						{
							objGroupByVal = objGeneralSetting.defaultGroupByCode;
							objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
						}
						if (!Ext.isEmpty(objGridSetting)) 
						{
							objGridSizeVal = objGridSetting.defaultGridSize;
							objRowPerPageVal = objGridSetting.defaultRowPerPage;
						}
					}

					objData["groupByData"] = objGroupView? objGroupView.cfgGroupByData : [];
					objData["filterUrl"] = 'services/userfilterslist/cashpositiontxn';
					objData["rowPerPage"] = _AvailableGridSize;
					objData["groupByVal"] = objGroupByVal;
					objData["filterVal"] = objDefaultFilterVal;
					objData["gridSizeVal"] = objGridSizeVal;
					objData["rowPerPageVal"] = objRowPerPageVal;
					subGroupInfo = objGroupView.getSubGroupInfo() || {};
					strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings","Column Settings") 
							+ ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
					
					me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
								cfgPopUpData : objData,
								cfgGroupView : objGroupView,
								cfgDefaultColumnModel : objColumnSetting,
								cfgViewOnly : _IsEmulationMode,
								cfgInvokedFrom : strInvokedFrom,
								title : strTitle,
								itemId : 'pageSettingPopUpTxn'
							});
					me.pageSettingPopup.show();
					me.pageSettingPopup.center();
	},
	postDoHandleReadPagePrefNew : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data)) {				
				objTxnGroupByPref = Ext.encode(data);
			}
		}
	},
	handleGridRowClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts )
	{
		var me = this;
		var clickedColumn = view.getGridColumns()[cellIndex];
		var columnType = clickedColumn.colType;
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
			var objGroupView = me.getGroupView();
			var grid = objGroupView.getGrid();
			me.doHandleRowIconClick(grid, rowIndex, null, null, record);
		}
		
	},
	/* State handling at local storage starts */
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,groupInfo= null,subGroupInfo = null,quickFilterState = {};
		if (objGroupView){
    		groupInfo = objGroupView.getGroupInfo();
			subGroupInfo = objGroupView.getSubGroupInfo();
		}
		if(!Ext.isEmpty(me.savePrefAdvFilterCode))
			objSaveState['advFilterCode'] = me.savePrefAdvFilterCode;
		if(!Ext.isEmpty(me.advFilterData)){
			objAdvJson['filterBy'] = me.advFilterData;
			objSaveState['advFilterJson'] = objAdvJson;
		}
		objSaveState['filterAppliedType'] = "Q";
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['groupTypeCode'] = (groupInfo || {}).groupTypeCode;
		objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objSaveState['sorter'] = grid && !Ext.isEmpty(grid.getSortState()) ? grid.getSortState() :  [];
		
		arrSaveData.push({
			"module" : "tempPref",
			"jsonPreferences" : objSaveState
		});
		
		me.saveLocalPref(arrSaveData);
	},
	saveLocalPref : function(arrSaveData){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (!Ext.isEmpty(arrSaveData)) {
			args['tempPref'] = arrSaveData;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, arrSaveData,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this,strLocalPrefPageName = me.strPageName+'_TempPref';
		var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else {
			if(!Ext.isEmpty(args)){
				jsonSaved = args && args.tempPref && args.tempPref[0] && args.tempPref[0].jsonPreferences ? args.tempPref[0].jsonPreferences : {};
				objTemp['tempPref'] = jsonSaved;
				objTempPref['preferences'] = objTemp;
				objLocalPref['d'] = objTempPref;
				
				me.updateObjLocalPref(objLocalPref);
			}
		}
	},
	updateObjLocalPref : function (data){
		var me = this;
		objSavedLocalTxnPref = Ext.encode(data);
	},
	populateTempFilter : function (filterData)
	{
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var operatorValue = '';
		var valueArray = '';
		var formattedFromDate, formattedToDate;
		for (i = 0; i < filterData.length; i++) {
			fieldName = filterData[i].paramName;
			fieldVal = filterData[i].paramValue1;
			fieldSecondVal = filterData[i].paramValue2;
			operatorValue = filterData[i].operatorValue;
			displayValue = filterData[i].displayValue1;
			if (fieldName === 'accountFilter') {
				var accountCombo=me.getTransAccountCombo();
				me.accountFilter = fieldVal;
				me.accountFilterDesc = displayValue;
				accountCombo.setValue(me.accountFilter);
				if (me.accountFilter != null && me.accountFilter != 'ALL') {
				var jsonArray = me.filterData;
				jsonArray.push({
						paramName : 'accountFilter',
						paramValue1 : me.accountFilter,
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('labelSavedAccount','Account'),
						displayValue1 : displayValue
					});
					me.filterData=jsonArray;
				}
			}
		}
		
	},
	handleClearLocalPrefernces : function(){
		var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';;
		
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
	},
	postHandleClearLocalPreference : function(data, args, isSuccess){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('localerrorMsg', 'Error while clear local setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else if(isSuccess === 'Y') {
			objSavedLocalTxnPref = '';
			me.objLocalData = '';
			var objGroupView = me.getGroupView();
		me.filterApplied = 'Q';
		me.filterData = [];
		me.advFilterData = [];
		var txnFilterView = me.getFilterView();
		$('#msSavedFilter').val("Select");
		$('#msSavedFilter').multiselect("refresh");
		if(!Ext.isEmpty(txnFilterView))
		{
			var accountCombo = me.getTransAccountCombo();
		    var txnCombo = me.getTransTxnCombo();
		    var transFilterCombo = me.getTransFilterCombo();
		    quickAccountFlag = false;
		    accountId="All"; 
			accountCombo.setValue("ALL");
			txnCombo.setValue("ALL");
			me.txnCategory= "ALL";
			
			if(!Ext.isEmpty(me.navigatedAccountId))
			{
				me.accountFilter=me.navigatedAccountId;
			}
			else
			{
				me.accountFilter='ALL';
			}
			transFilterCombo.setValue("");
			
			var postingDateRef = $('#postingDate');
			postingDateRef.val('');
			
			if(!Ext.isEmpty(me.savedFilterVal))
				me.savedFilterVal = "";
			me.resetAllFields();
		}
		}
	}
});