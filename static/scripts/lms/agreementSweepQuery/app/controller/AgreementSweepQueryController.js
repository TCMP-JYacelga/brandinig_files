Ext
		.define(
				'GCP.controller.AgreementSweepQueryController',
				{
					extend : 'Ext.app.Controller',
					requires : [ 'GCP.view.AgreementSweepQueryTitleView',
									'GCP.view.AgreementSweepQueryFilterView',
									'GCP.view.AgreementSweepQueryGridView',
									'GCP.view.AgreementSweepQueryView', 'Ext.Ajax' ],
					views : [ 'GCP.view.AgreementSweepQueryTitleView',
							'GCP.view.AgreementSweepQueryFilterView',
							'GCP.view.AgreementSweepQueryGridView',
							'GCP.view.AgreementSweepQueryView'],
					/**
					 * Array of configs to build up references to views on page.
					 */
					refs : [
							{
								ref : 'agreementSweepQueryView',
								selector : 'agreementSweepQueryView'
							},
							{
								ref : 'groupView',
								selector : 'agreementSweepQueryView agreementSweepQueryGridView groupView'
							},
							{
								ref : 'filterView',
								selector : 'filterView'
							},
							{
								ref : 'entryDateLabel',
								selector : 'agreementSweepQueryFilterView label[itemId="entryDateLabel"]'
							},
							{
								ref : 'specificFilterPanel',
								selector : 'agreementSweepQueryView agreementSweepQueryFilterView panel[itemId="specificFilter"]'
							},
							{
								ref : 'agreementSweepQueryTitleViewRef',
								selector : 'agreementSweepQueryView agreementSweepQueryTitleView  button[itemId="sweepXlsButton"]'
							},
							{
								ref : 'agreementSweepQueryGridListView',
								selector : 'agreementSweepQueryView agreementSweepQueryGridView panel[itemId="agreementSweepQueryGridListView"]'
							},
							{
								ref : 'agreementSweepQueryGrid',
								selector : 'agreementSweepQueryView agreementSweepQueryGridView groupView smartgrid'
							},
							{
								ref : 'searchTextInput',
								selector : 'agreementSweepQueryGridView textfield[itemId="searchTextField"]'
							},
							{
								ref : 'matchCriteria',
								selector : 'agreementSweepQueryView radiogroup[itemId="matchCriteria"]'
							},
							{
								ref : 'agreementSweepQueryFilterViewRef',
								selector : 'agreementSweepQueryView agreementSweepQueryFilterView'
							},
							{
								ref : 'grid',
								selector : 'agreementSweepQueryGridView smartgrid'
							},
							{
								ref : 'sellerCode',
								selector : 'agreementSweepQueryView agreementSweepQueryViewFilterView combo[itemId=sweepQuerySellerIdItemId]'
							},
							{
								ref : 'clientCodeAutocompleter',
								selector : 'agreementSweepQueryView agreementSweepQueryFilterView AutoCompleter[itemId=clientCodeItemId]'
							},
							{
								ref : 'clientCodeCombo',
								selector : 'agreementSweepQueryView agreementSweepQueryFilterView combo[itemId=clientCombo]'
							},
							{
								ref : 'agreementCodeCombo',
								selector : 'agreementSweepQueryView agreementSweepQueryFilterView AutoCompleter[itemId=agreementCodeItemId]'
							},
							{
								ref : 'requestDateRef',
								selector : 'agreementSweepQueryView agreementSweepQueryView datefield[itemId="requestDateItemId"]'
							},
							{
								ref : 'fromDate',
								selector : 'agreementSweepQueryFilterView datefield[itemId="fromDate"]'
							},
							{
								ref : 'toDate',
								selector : 'agreementSweepQueryFilterView datefield[itemId="toDate"]'
							},
							{
								ref : 'agreementSweepSnapShotPopup',
								selector : 'agreementSweepSnapShotPopup'
							},
							{
								ref : 'snapShotGrid',
								selector : 'agreementSweepSnapShotPopup grid[itemId="snapShotGrid"]'
							},
							{
								ref : 'agreementSweepQueryViewGrid',
								selector : 'agreementSweepQueryView agreementSweepQueryGridView'
							},
							{
								ref : 'agreementSweepQueryViewFilter',
								selector : 'agreementSweepQueryView agreementSweepQueryFilterView'
							},
							{
								ref : 'noPostStructureId',
								selector : 'agreementSweepQueryView agreementSweepQueryFilterView combo[itemId=noPostStructureId]'
							},
							{
								ref : 'status',
								selector : 'agreementSweepQueryView agreementSweepQueryFilterView combo[itemId="status"]'
							}],
					config : {
						savePrefAdvFilterCode : null,
						filterCodeValue : null,
						sellerFilterVal : 'all',
						clientFilterVal : 'all',
						agreementCodeFilterVal : 'all',
						//fromDateFilterVal : '',
						//toDateFilterVal : '',
						dateFilterVal : '12', // Set to Today
						dateFilterLabel : getLabel('latest', 'Latest'),
						statusFilterVal : 'all',
						statusFilterDesc : 'All',
						filterData : [],
						filterApplied : 'ALL',
						strPageName : 'sweepQuery',
						strGetModulePrefUrl : 'services/userpreferences/sweepQuery/{0}.json',
						dateHandler : null,
						isSelectClient  : false,
						isSelectAggrCode : false,
						noPostStructurePrefCode:'all',
						noPostStructurePrefDesc:null
					},
					/**
					 * A template method that is called when your application
					 * boots. It is called before the Application's launch
					 * function is executed so gives a hook point to run any
					 * code before your Viewport is created.
					 */
					init : function() {
						var me = this;
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
						me.updateConfig();
						$(document).on('loadResponseSmartGrid', function(event,record) {
							me.loadResponseSmartGrid(record);
						});
						
						/*$(document).on('handleFilterPanelVisibility', function(event, actionName) {
							me.handleFilterPanelVisibility();
				      });*/
						$(document).on('handleReportAction', function(event, actionName) {
							me.handleReportAction();
				      });

					$(document).on('performPageSettings', function(event){
						me.showPageSettingPopup('PAGE');
					});
					$(document).on('filterDateChange', function(event, filterType, btn, opts) {
						if (filterType == "entryDateQuickFilter") {
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.handleDateChange(btn.btnValue);	
								me.setDataForFilter();
								me.callHandleLoadGridData(true);
						}
					});	
						if(strSellerId != ""){
							me.sellerFilterVal = strSellerId;
						}
						//if(strClientId != ""){
						//	me.clientFilterVal = strClientId;
						//}
						//me.fromDateFilterVal = dtFilterFromDate ;
						//me.toDateFilterVal = dtFilterToDate ;
						me.control({
//									'agreementSweepQueryView agreementSweepQueryFilterView' : {
//										render : function() {
//											me.setInfoTooltip();
//										},
//										filterChangeFromDate : function(
//												oldValue, newValue) {
//											me.fromDateFilterVal = Ext.util.Format
//													.date(me.getFromDate()
//															.getValue(),
//															'Y-m-d');
//											frmDateVal=me.fromDateFilterVal;
//										},
//										filterChangeToDate : function(oldValue,
//												newValue) {
//											me.toDateFilterVal = Ext.util.Format
//													.date(me.getToDate()
//															.getValue(),
//															'Y-m-d');
//											toDateVal=me.toDateFilterVal;
//											
//										}
//									},
//									'agreementSweepQueryView agreementSweepQueryFilterView button[itemId="btnFilter"]' : {
//										click : function(btn, opts) {
//											 var errorSpan=$('#errorSpan');
//											 var errorText1=$('#errorText1');
//											 var errorText2=$('#errorText2');
//											 var errorText3=$('#errorText3');
//											 
//											 var toDateField=me.getToDate();
//											 var fromDateField=me.getFromDate();
//											 
//											 var objFilterPanel = me.getAgreementSweepQueryFilterViewRef();
//											 var aggrementValueCombo = objFilterPanel.down('AutoCompleter[itemId="agreementCodeItemId"]');
//											  if(!Ext.isEmpty(aggrementValueCombo.getValue()) && !Ext.isEmpty(toDateField.getValue()) && !Ext.isEmpty(fromDateField.getValue())){
//												  	errorSpan.addClass('ui-helper-hidden');
//													me.handleHeaderFilterPanelVisibility();
//													me.callHandleLoadGridData();
//											  }else{
//												  errorSpan.removeClass('ui-helper-hidden');
//												  if(Ext.isEmpty(aggrementValueCombo.getValue()) || aggrementValueCombo.getValue()==''){
//												    errorText1.text("Ageement code is required");
//												  }
//												  else{
//													  errorText1.text("");
//												  }
//												  if(Ext.isEmpty(fromDateField.getValue()) || fromDateField.getValue()==""){
//													  errorText2.text("From date is required");
//												  }else{
//													  errorText2.text("");
//												  }
//												  if(Ext.isEmpty(toDateField.getValue()) || toDateField.getValue==""){
//													  errorText3.text("To date is required");
//												  }else{
//													  errorText3.text("");
//												  }
//												  
//												    
//												  
//											  }
//										}
//									},
//									'agreementSweepQueryGridView' : {
//										render : function(panel) {
//											me.handleSmartGridConfig();
//										}
//									},
									'pageSettingPopUp' : {
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
									'filterView' : {
										appliedFilterDelete : function(btn) {
											me.handleAppliedFilterDelete(btn);
										}
									},
									'agreementSweepQueryView agreementSweepQueryGridView groupView' : {
										'groupTabChange' : function(groupInfo, subGroupInfo,
												tabPanel, newCard, oldCard) {
											me.doHandleGroupTabChange(groupInfo, subGroupInfo,
													tabPanel, newCard, oldCard);

										},
										'gridPageChange' : me.handleLoadGridData,
										'gridSortChange' : me.handleLoadGridData,
										'gridRender' : me.handleLoadGridData,
										'gridStateChange' : function(grid) {
//											me.disablePreferencesButton("savePrefMenuBtn", false);
//											me.disablePreferencesButton("clearPrefMenuBtn", false);
										},
										'gridRowActionClick' : function(grid, rowIndex, columnIndex,
												actionName, record) {
											me.handleRowIconClick(actionName, grid, record, rowIndex);
											},

										'gridSettingClick' : function(){
											me.showPageSettingPopup('GRID');
										}
										},
									'agreementSweepQueryGridView textfield[itemId="searchTextField"]' : {
										change : function(btn, opts) {
											me.searchOnPage();
										}
									},
									'agreementSweepQueryGridView radiogroup[itemId="matchCriteria"]' : {
										change : function(btn, opts) {
											me.searchOnPage();
										}
									},
//									'agreementSweepQueryGridView smartgrid' : {
//										render : function(grid) {
//											me.handleLoadGridData(grid,
//													grid.store.dataUrl,
//													grid.pageSize, 1, 1, null);
//											if(modeValue == 'readView'){
//												me.handleHeaderFilterPanelVisibility();
//											}
//										},
//										gridPageChange : me.handleLoadGridData,
//										gridSortChange : me.handleLoadGridData,
//										gridRowSelectionChange : function(grid,
//												record, recordIndex, records,
//												jsonData) {
//											me.enableValidActionsForGrid(grid,
//													record, recordIndex,
//													records, jsonData);
//										}
//									},
									'agreementSweepQueryFilterView combo[itemId="sweepQuerySellerIdItemId"]' : {
										select : function(combo, record, index) {
											var objFilterPanel = me
													.getAgreementSweepQueryFilterViewRef();
											var objAutocompleter = objFilterPanel
													.down('AutoCompleter[itemId="clientCodeItemId"]');
											objAutocompleter.setValue('');
											objAutocompleter.cfgExtraParams = entity_type == '1' ? [{
												key : '$filtercode1',
												value : strUserCode
											}] :[{
												key : '$filtercode1',
												value : record[0].data.sellerCode
											}];
											var objAutocompleter2 = objFilterPanel
													.down('AutoCompleter[itemId="agreementCodeItemId"]');
											objAutocompleter2.setValue('');
											objAutocompleter2.cfgExtraParams = entity_type == '1' ? [{
												key : '$filtercode1',
												value : strUserCode
											}] :[{
												key : '$filtercode1',
												value : record[0].data.sellerCode
											}];
											me.handleSellerFilter(record[0].data.sellerCode);
											sellerDisc=combo.getRawValue();
											sellerVal=combo.getValue();
											me.setDataForFilter();
											me.callHandleLoadGridData(true);
										}
									},
									'agreementSweepQueryFilterView AutoCompleter[itemId="clientCodeItemId"]' : {
										change : function(combo, record, index) {
											var objFilterPanel = me
											.getAgreementSweepQueryFilterViewRef();
											var objAutocompleter = objFilterPanel
													.down('AutoCompleter[itemId="agreementCodeItemId"]');
											
											if(sessionClientVal!=''){
												objAutocompleter.setValue(sessionagreementValue);
											}
											if(combo.getRawValue()==""){
												objAutocompleter.setValue('');
											}
											var agreementAutoCompleterSeekId;
											if( entity_type === '0' ) {
												agreementAutoCompleterSeekId = 'sweepQueryAgreementIdSeekAll';
											}
											else {
												agreementAutoCompleterSeekId = 'sweepQueryAgreementIdSeekClient';
											}
											objAutocompleter.cfgSeekId = agreementAutoCompleterSeekId;
											me.handleClientFilter('all');
											me.isSelectClient = true;
											if(combo.getRawValue()==""){
												clientDisc="";
												clientValue="";
												me.isSelectClient = false;
												me.setDataForFilter();
												me.callHandleLoadGridData(false);
											}
										},
										select : function(combo, record, index) {
											
											if(combo.getValue()=="all"){
												clientDisc="";
												clientValue="";
												me.setDataForFilter();
												me.isSelectClient = false;
												me.callHandleLoadGridData(true);
											} else {
												var objFilterPanel = me
														.getAgreementSweepQueryFilterViewRef();
												var objAutocompleter = objFilterPanel
														.down('AutoCompleter[itemId="agreementCodeItemId"]');
												objAutocompleter.setValue('');											
												objAutocompleter.cfgSeekId = "sweepQueryAgreementIdSeek";
												objAutocompleter.cfgExtraParams = [ {
													key : '$filtercode1',
													value : record[0].data.CODE
												} ];
												me.handleClientFilter(record[0].data.CODE);
												clientDisc=combo.getRawValue();
												clientValue=record[0].data.CODE;
												me.setDataForFilter();
												me.callHandleLoadGridData(true);
												me.isSelectClient = true;
											}
										},
										keyup : function(combo, e, eOpts){
											me.isSelectClient = false;
										},
										blur : function(combo, The, eOpts ){
											if(me.isSelectClient == false  
													&& !Ext.isEmpty(combo.getRawValue()) 
													&& clientDisc != combo.getRawValue() ){
												
												if(combo.getValue()=="all"){
													clientDisc="";
													clientValue="";
													me.setDataForFilter();
													me.isSelectClient = false;
													me.callHandleLoadGridData(true);
												} else {
													var objFilterPanel = me
															.getAgreementSweepQueryFilterViewRef();
													var objAutocompleter = objFilterPanel
															.down('AutoCompleter[itemId="agreementCodeItemId"]');
													objAutocompleter.setValue('');											
													objAutocompleter.cfgSeekId = "sweepQueryAgreementIdSeek";
													objAutocompleter.cfgExtraParams = [ {
														key : '$filtercode1',
														value : combo.getRawValue()
													} ];
													me.handleClientFilter(combo.getRawValue());
													clientDisc=combo.getRawValue();
													clientValue=combo.getRawValue();
													me.setDataForFilter();
													me.callHandleLoadGridData(true);
												}
											}
										}
									},
									'agreementSweepQueryFilterView combo[itemId="clientCombo"]' : {
										select : function(combo, record, index) {
											var objFilterPanel = me
													.getAgreementSweepQueryFilterViewRef();
											var objAutocompleter = objFilterPanel
													.down('AutoCompleter[itemId="agreementCodeItemId"]');
											objAutocompleter.setValue('');
											if(record[0].data.CODE != 'all') { 
												objAutocompleter.cfgSeekId = "sweepQueryAgreementIdSeek";
											objAutocompleter.cfgExtraParams = [ {
												key : '$filtercode1',
												value : record[0].data.CODE
											} ];
											} else{
												objAutocompleter.cfgSeekId = "sweepTxnAgreementIdSeekAll";
												objAutocompleter.cfgExtraParams = [];
											}
											me.handleClientFilter(record[0].data.CODE);
											clientDisc=combo.getRawValue();
											clientValue=record[0].data.CODE;
											me.setDataForFilter();
											me.callHandleLoadGridData(true);
										}
									},
									'agreementSweepQueryFilterView AutoCompleter[itemId="agreementCodeItemId"]' : {
										select : function(combo, record, index) {
											if(combo.cfgSeekId === "sweepTxnAgreementIdSeekAll"){
												me.handleAgreementFilter(record[0].data.RECORD_KEY_NO);
												agreementValueCode=record[0].data.RECORD_KEY_NO;
											} else {
												me.handleAgreementFilter(record[0].data.RECKEY);
												agreementValueCode=record[0].data.RECKEY;
											}	
											agreementValue=combo.getValue();
											agreementDisc=record[0].data.DESCRIPTION;
											me.isSelectAggrCode = true;
											me.setDataForFilter();
											me.callHandleLoadGridData(true);
										},
										change : function(combo, record, index) {
											me.handleAgreementFilter('all');
											if(combo.getRawValue()==""){
												agreementDisc="";
												agreementValueCode="";
												me.isSelectAggrCode = true;
												agreementValue="";
												me.setDataForFilter();
												me.callHandleLoadGridData(false);
											}
										},
										keyup : function(combo, e, eOpts){
											me.isSelectAggrCode = false;
										},
										blur : function(combo, The, eOpts ){
											if(me.isSelectAggrCode == false  
													&& !Ext.isEmpty(combo.getRawValue()) 
													&& agreementDisc != combo.getRawValue() ){
												me.handleAgreementFilter( combo.getRawValue() );
												agreementValueCode= combo.getRawValue();
												agreementValue=combo.getRawValue();
												agreementDisc=combo.getRawValue();
												me.setDataForFilter();
												me.callHandleLoadGridData(true);
											}
										}
									},
									
									'agreementSweepQueryFilterView  combo[itemId="noPostStructureId"]' : {
										select : function(combo, record, index) {
											me.noPostStructurePrefCode = record[0].data.noPostStructureKey;
											me.noPostStructurePrefDesc = record[0].data.noPostStructureValue;
											me.handlenoPostStructureFilter(combo);
											me.setDataForFilter();
											me.callHandleLoadGridData(true);
										}
									},

									'agreementSweepQueryFilterView component[itemId="paymentEntryDataPicker"]' : {
										render : function() {
											$('#entryDataPicker').datepick({
												monthsToShow : 1,
												changeMonth : true,
												dateFormat : strApplicationDateFormat,
												changeYear : true,
												rangeSeparator : ' to ',
												onClose : function(dates) {
													if (!Ext.isEmpty(dates)) {
														me.dateRangeFilterVal = '13';
														me.datePickerSelectedDate = dates;
														me.datePickerSelectedEntryDate = dates;
														me.dateFilterVal = me.dateRangeFilterVal;
														me.dateFilterLabel = getLabel('daterange',
															'Date Range');
														me.handleDateChange(me.dateRangeFilterVal);
														me.setDataForFilter();
														me.callHandleLoadGridData(true);
													}
												}
											});
											
										}
									},
									'agreementSweepQueryFilterView combobox[itemId=status]' : {
										'select' : function(combo,selectedRecords) {
											combo.isQuickStatusFieldChange = true;
										},
										'blur':function(combo,record){
											me.handleStatusClick(combo);
										},
										'boxready' : function(combo, width, height, eOpts){
												if (!Ext.isEmpty(me.statusFilterDesc) && me.statusFilterDesc != 'All' && me.statusFilterDesc != 'all' && 
													!Ext.isEmpty(me.statusFilterVal) && me.statusFilterVal != 'All' && me.statusFilterVal != 'all') {
													if(!Ext.isEmpty(me.statusFilterVal)){
													combo.setValue(me.statusFilterVal);
													}
													else{
														combo.setValue(me.statusFilterVal);
														me.statusFilterVal = '';
													}
												}
											}
									},
									/*'agreementSweepQueryView agreementSweepQueryTitleView  button[itemId="sweepXlsButton"]' : {
										click : function(btn, opts, record) {
											me.handleReportAction(btn, opts, record);
										}

									},*/
									'filterView button[itemId="clearSettingsButton"]' : {
										'click' : function() {
											me.resetAllFilters();
										}
									}

								});
					},
					handleStatusClick : function(combo) {
						var me = this;
						var allSelected= null;
						combo.isQuickStatusFieldChange = false;
						allSelected = combo.isAllSelected();
						if(allSelected === true){
							me.statusFilterVal = 'all';
							me.statusFilterDesc = 'All';
						} else {
							me.statusFilterVal = combo.getSelectedValues();
							me.statusFilterDesc = combo.getRawValue();
						}
						me.setDataForFilter();
						me.applyFilter();
					},
					handleNoPostStructureFilterClick : function(combo) {
						var me = this;
						combo.isQuickNoPostStructureFieldChange = false;
						me.noPostStructurePrefCode = combo.getSelectedValues();
						me.noPostStructurePrefDesc = combo.getRawValue();
						
					},	
					applyFilter : function() {
						var me = this;						
						var objGroupView = me.getGroupView();
						var groupInfo = objGroupView.getGroupInfo();
						me.refreshData();
					},
					refreshData : function() {
						var me = this;
						var objGroupView = me.getGroupView();
						var grid = objGroupView.getGrid();
						objGroupView.refreshData();
					},
					updateConfig : function() {
						var me = this;
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
					},
					handleAppliedFilterDelete : function(btn) {
						var me = this;
						var objData = btn.data;
						if(!Ext.isEmpty(objData)) {
							me.resetFieldOnDelete(objData);
						}
						me.getGroupView().refreshData();
					},
					resetFieldOnDelete : function(objData) {
						var me = this, strFieldName;
						if (!Ext.isEmpty(objData))
							strFieldName = objData.paramName || objData.field;
						if (strFieldName === "agreementCode") {
							if (!Ext.isEmpty(me.getAgreementCodeCombo()))
								me.getAgreementCodeCombo().setValue('');
							agreementDisc = "";
							agreementValueCode = "";
							agreementValue = "";
						} else if (strFieldName === "clientCode") {
							if (!Ext.isEmpty(me.getClientCodeCombo()))
								me.getClientCodeCombo().reset();
							if (!Ext.isEmpty(me.getClientCodeAutocompleter()))
								me.getClientCodeAutocompleter().setValue('');
							clientDisc = "";
							clientValue = "";
						} else if (strFieldName === "requestDate") {
							var datePickerRef = $('#entryDataPicker');
							var toDatePickerRef = $('#entryDataToPicker');
							me.dateFilterVal = '12';
							me.dateFilterLabel = 'Latest';
							me.handleDateChange(me.dateFilterVal);
							me.getEntryDateLabel().setText(
									getLabel('date', 'Date'));
							datePickerRef.val('');
							toDatePickerRef.val('');
						} else if (strFieldName === "sellerCode") {
							if (!Ext.isEmpty(me.getSellerCode()))
								me.getSellerCode().reset();
						} else if(strFieldName === 'noPostStructure'){
						   var noPostSructureObj = me.getAgreementSweepQueryFilterViewRef().down('combo[itemId="noPostStructureId"]');
						   if(!Ext.isEmpty(noPostSructureObj)){
						   noPostSructureObj.setValue('all');
						   me.noPostStructurePrefCode = 'all';
						   me.noPostStructureFilterVal = 'all';						
					     }
				       } else if(strFieldName === 'status'){
						 var statusObj = me.getAgreementSweepQueryFilterViewRef().down('combo[itemId="status"]');
						 if(!Ext.isEmpty(statusObj)){
						 	statusObj.reset();
						   	me.statusFilterVal = 'all';
							statusObj.selectAllValues();
						 }
						   					
				       }

					},
					handleDateChange : function(index) {
						var me = this;
						var vFromDate;
						var vToDate;
						var objDateParams = me.getDateParam(index);						
						var datePickerRef = $('#entryDataPicker');
						if (!Ext.isEmpty(me.dateFilterLabel)) {
							me.getEntryDateLabel().setText(getLabel('date', 'Date')
									+ " (" + me.dateFilterLabel + ")");
						}					
						
						if (index == '13') {
							vFromDate = me.datePickerSelectedDate[0];
							 vToDate = me.datePickerSelectedDate[1];
							if (objDateParams.operator == 'eq') {
								datePickerRef.setDateRangePickerValue(vFromDate);
							} else {
								datePickerRef.setDateRangePickerValue([
										vFromDate, vToDate]);
							}
						} else {
							vFromDate = objDateParams.fieldValue1;
							 vToDate = objDateParams.fieldValue2;
							if (index === '1' || index === '2'){ 
									datePickerRef.setDateRangePickerValue(vFromDate);
						} else {
							datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
						}
						}
					},
					getDateParam : function(index, dateType) {
						var me = this;
						me.dateRangeFilterVal = index;
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
								fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
								operator = 'bt';
								break;
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
							case '12' :
								// Latest
							   if (!Ext.isEmpty(filterday) && filterday !== '999') {
									var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
									var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
									fieldValue1 = Ext.Date.format(fromDate, strSqlDateFormat);
									fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
									operator = 'bt';
									label = 'Latest';
								}
								else {
									fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
									fieldValue2 = fieldValue1;
									operator = 'le';
									label = 'Latest';
								}
							case '13' :
								// Date Range
								if(!isEmpty(me.datePickerSelectedDate)){
									if (me.datePickerSelectedDate.length == 1) {
										fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
												strSqlDateFormat);
										fieldValue2 = fieldValue1;
										operator = 'eq';
									} else if (me.datePickerSelectedDate.length == 2) {
										fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
												strSqlDateFormat);
										fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
												strSqlDateFormat);
										operator = 'bt';
									}
								}
						}
						retObj.fieldValue1 = fieldValue1;
						retObj.fieldValue2 = fieldValue2;
						retObj.operator = operator;
						return retObj;
					},
					resetAllFilters : function() {
						var me = this, objGroupView = me.getGroupView();	
						var datePickerRef = $('#entryDataPicker');
						var toDatePickerRef = $('#entryDataToPicker');
						me.dateFilterVal = '12'; // Set to Today
						me.dateFilterLabel = getLabel('latest', 'Latest');
						me.handleDateChange(me.dateFilterVal);
						me.getEntryDateLabel().setText(getLabel('latest', 'Latest'));
						datePickerRef.val('');
						toDatePickerRef.val('');
						if(!Ext.isEmpty(me.getSellerCode()))
								me.getSellerCode().reset();
						if(!Ext.isEmpty(me.getClientCodeAutocompleter()))
								me.getClientCodeAutocompleter().setValue('');
						if(!Ext.isEmpty(me.getClientCodeCombo()))
								me.getClientCodeCombo().reset();
						if(!Ext.isEmpty(me.getAgreementCodeCombo()))
								me.getAgreementCodeCombo().setValue('');
						clientDisc="";
						clientValue="";

						agreementDisc="";
						agreementValueCode="";
						agreementValue="";
						if(!Ext.isEmpty(me.getAgreementSweepQueryFilterViewRef().down('combo[itemId="noPostStructureId"]'))){
						   var noPostSructureObj = me.getAgreementSweepQueryFilterViewRef().down('combo[itemId="noPostStructureId"]');
						   noPostSructureObj.setValue('all');
						   me.noPostStructurePrefCode = 'all';
						   me.noPostStructureFilterVal = 'all';						
						}
						
						if(!Ext.isEmpty(me.getAgreementSweepQueryFilterViewRef().down('combo[itemId="status"]'))){
						   var statusObj = me.getAgreementSweepQueryFilterViewRef().down('combo[itemId="status"]');
						   statusObj.reset();
						   me.statusFilterVal = 'all';
						   statusObj.selectAllValues();					
						}
						
						if (objGroupView){
							objGroupView.toggleFilterIcon(false);
							objGroupView.setFilterToolTip('');
						}	
						me.setDataForFilter();
						me.callHandleLoadGridData(true);
					},
					/*############### Page setting handling (START) ###############*/
					
					applyPageSetting : function(arrPref, strInvokedFrom) {
						var me = this, args = {};
						if (!Ext.isEmpty(arrPref)) {
							if (strInvokedFrom === 'GRID'
									&& _charCaptureGridColumnSettingAt === 'L') {
								/**
								 * This handling is required for non-us market
								 */
								var groupView = me.getGroupView(), subGroupInfo = groupView
										.getSubGroupInfo()
										|| {}, objPref = {}, groupInfo = groupView
										.getGroupInfo()
										|| '{}', strModule = subGroupInfo.groupCode;
								Ext.each(arrPref || [], function(pref) {
											if (pref.module === 'ColumnSetting') {
												objPref = pref.jsonPreferences;
											}
										});
								args['strInvokedFrom'] = strInvokedFrom;
								args['objPref'] = objPref;
								
								strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
										+ strModule : strModule;
								me.preferenceHandler.saveModulePreferences(me.strPageName,
										strModule, objPref, me.postHandlePageGridSetting, args,
										me, false);
							} else {
								me.preferenceHandler.savePagePreferences(me.strPageName,
										arrPref, me.postHandlePageGridSetting, args, me, false);
							}
						}
					},
					savePageSetting : function(arrPref, strInvokedFrom) {
						/* This will be get invoked from page level setting always */
						var me = this, args = {};
						if (!Ext.isEmpty(arrPref)) {
							me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
									me.postHandleSavePageSetting, args, me, false);
						}
					},
					postHandleSavePageSetting : function(data, args, isSuccess) {
						var me = this, args = {};
						if (isSuccess === 'N')  {
							Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle', 'Error'),
								msg : getLabel('errorMsg', 'Error while apply/restore setting'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
						}
						else{
							me.preferenceHandler.readPagePreferences(me.strPageName, me.updateObjSweepQueryPref,args, me,false);
						}
					},

					updateObjSweepQueryPref : function(data){		
						objAgreementQueryPref = Ext.encode(data);
					},
					restorePageSetting : function(arrPref, strInvokedFrom) {
						var me = this;
						if (strInvokedFrom === 'GRID'
								&& _charCaptureGridColumnSettingAt === 'L') {
							var groupView = me.getGroupView(), subGroupInfo = groupView
									.getSubGroupInfo()
									|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
									|| '{}', strModule = subGroupInfo.groupCode, args = {};
							strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
									+ strModule : strModule;
							args['strInvokedFrom'] = strInvokedFrom;
							Ext.each(arrPref || [], function(pref) {
										if (pref.module === 'ColumnSetting') {
											pref.module = strModule;
											return false;
										}
									});
							me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
									me.postHandleRestorePageSetting, args, me, false);
						} else
							me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
									me.postHandleRestorePageSetting, null, me, false);
					},
					postHandlePageGridSetting : function(data, args, isSuccess) {
						if (isSuccess === 'Y') {
							var me = this;
							if (args && args.strInvokedFrom === 'GRID'
									&& _charCaptureGridColumnSettingAt === 'L') {
								var objGroupView = me.getGroupView(), gridModel = null;
								if (args.objPref && args.objPref.gridCols)
									gridModel = {
										columnModel : args.objPref.gridCols
									}
								// TODO : Preferences and existing column model need to be
								// merged
								objGroupView.reconfigureGrid(gridModel);
							} else
								window.location.reload();
						} else {
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
						if (isSuccess === 'Y') {
							var me = this;
							if (args && args.strInvokedFrom === 'GRID'
									&& _charCaptureGridColumnSettingAt === 'L') {
								var objGroupView = me.getGroupView();
								if (objGroupView)
									objGroupView.reconfigureGrid(null);
							} else
								window.location.reload();
						} else {
							Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle', 'Error'),
								msg : getLabel('errorMsg', 'Error while apply/restore setting'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
						}
					},
					showPageSettingPopup : function(strInvokedFrom) {
						
						var me = this,
							objData = {},
							objGroupView = me.getGroupView(),
							objPrefData,
							objGeneralSetting,
							objGridSetting,
							objColumnSetting,
							strTitle = null, 
							subGroupInfo;
						
						var objGroupByVal = '',
							objDefaultFilterVal = '',
							objGridSizeVal = '',
							objRowPerPageVal = _GridSizeTxn;
						
						me.pageSettingPopup = null;
							
						if(!Ext.isEmpty(objAgreementQueryPref)) {
							objPrefData = Ext.decode(objAgreementQueryPref);
							
							objGeneralSetting = objPrefData && objPrefData.d.preferences
								&& objPrefData.d.preferences.GeneralSetting
								? objPrefData.d.preferences.GeneralSetting
								: null;
							objGridSetting = objPrefData && objPrefData.d.preferences
								&& objPrefData.d.preferences.GridSetting
								? objPrefData.d.preferences.GridSetting
								: null;
								
							if (!Ext.isEmpty(objGeneralSetting)) {
								objGroupByVal = objGeneralSetting.defaultGroupByCode;
								objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
							} if (!Ext.isEmpty(objGridSetting)) {
								objGridSizeVal = objGridSetting.defaultGridSize;
								objRowPerPageVal = objGridSetting.defaultRowPerPage;
							}
							
						}
						
						if(objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting && objPrefData.d.preferences.ColumnSetting.gridCols) {
							objColumnSetting = objPrefData.d.preferences.ColumnSetting.gridCols;
						} else {
							objColumnSetting = SWEEP_QUERY_DEFAULT_COLUMN_MODEL || [];
						}
						
						objData["groupByData"] = objGroupView ? objGroupView.cfgGroupByData : [];
						objData["filterUrl"] = 'services/userfilterslist/' + me.strPageName;
						objData["rowPerPage"] = _AvailableGridSize;
						objData["groupByVal"] = objGroupByVal;
						objData["filterVal"] = objDefaultFilterVal;
						objData["gridSizeVal"] = objGridSizeVal;
						objData["rowPerPageVal"] = objRowPerPageVal;
						
						subGroupInfo = objGroupView.getSubGroupInfo() || {};
						strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
						"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
						me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
							cfgPopUpData : objData,
							cfgGroupView : objGroupView,
							cfgDefaultColumnModel : objColumnSetting,
							cfgViewOnly : _IsEmulationMode,
							cfgInvokedFrom : strInvokedFrom,
							title : strTitle
						});
						
						me.pageSettingPopup.show();
						me.pageSettingPopup.center();
					},
					/*############### Page setting handling ( END ) ###############*/

					doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
							newCard, oldCard) {
						var me=this;
						var objGroupView = me.getGroupView();
						var args = null;
						var strModule = '', strUrl = null, args = null, strFilterCode = null;
						groupInfo = groupInfo || {};
						subGroupInfo = subGroupInfo || {};
						if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
							args = {
								scope : me
							};
							strModule = subGroupInfo.groupCode
							strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
							me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);

						} else 
						me.postHandleDoHandleGroupTabChange();
					},
					postHandleDoHandleGroupTabChange : function(data, args) {
						var me = args ? args.scope : this;
						me.handleReconfigureGrid(data);
					},

					handleReconfigureGrid : function(data) {
						var me = this;
						var objGroupView = me.getGroupView();
						var objSummaryView = me.getAgreementSweepQueryViewGrid(), gridModel = null, objData = null;
						var colModel = null, arrCols = null;
						if (data && data.preference)
							objData = Ext.JSON.decode(data.preference)
						if (_charCaptureGridColumnSettingAt === 'L' && objData
								&& objData.gridCols) {
							arrCols = objData.gridCols;
							colModel = arrCols;
							if (colModel) {
								gridModel = {
									columnModel : colModel
								}
							}
						}
						// TODO : Preferences and existing column model need to be merged
						objGroupView.reconfigureGrid(gridModel);
					},
					setDataForFilter : function() {
						var me = this;
						if (this.filterApplied === 'Q'
								|| this.filterApplied === 'ALL') {
							this.filterData = this.getQuickFilterQueryJson();
						}
						me.updateFilterInfo();
					},
					updateFilterInfo : function() {
						me=this;
						var arrInfo = generateFilterArray(me.filterData);
						
						//if(entity_type === "1") {
							//if(!multipleClientsAvailable) {
								var clientFilterIndex = -1;
								arrInfo.forEach(function(appliedFilterObj, appliedFilterObjIndex) {
									if(appliedFilterObj.fieldId == "clientCode" && (Ext.isEmpty(appliedFilterObj.fieldValue) 
											|| appliedFilterObj.fieldValue === 'all')) clientFilterIndex = appliedFilterObjIndex;
								});
								
								if(clientFilterIndex !== -1) {
									arrInfo.splice(clientFilterIndex, 1);
								}
							//}	
						//}
						if(!multipleSellersAvailable) {
							var sellerFilterIndex = -1;
							arrInfo.forEach(function(appliedFilterObj, appliedFilterObjIndex) {
								if(appliedFilterObj.fieldId == "sellerCode") sellerFilterIndex = appliedFilterObjIndex;
							});
							
							if(sellerFilterIndex !== -1) {
								arrInfo.splice(sellerFilterIndex, 1);
							}
						}
						me.getFilterView().updateFilterInfo(arrInfo);
					},
					getQuickFilterQueryJson : function() {
						var me = this;
						var jsonArray = [];
						// 1 FI
						if(sessionSellerVal!='' && typeof sessionSellerVal!='undefined'){
							me.sessionSellerVal=sessionSellerVal;
						}
						if (me.sellerFilterVal != 'all') {
							jsonArray.push({
								paramName : 'sellerCode',
								paramValue1 : encodeURIComponent(me.sellerFilterVal.replace(new RegExp("'", 'g'), "\''")),
								paramFieldLable : getLabel( 'financialinstitution', 'Financial Institution'),
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								displayValue1 : me.sellerFilterVal
							});
						}
						if(sessionClientVal!=''&& typeof sessionClientVal!='undefined'){
							me.clientFilterVal=sessionClientVal;
						}
						// 2 Client Code
						if (me.clientFilterVal != 'all') {
							jsonArray.push({
								paramName : 'clientCode',
								paramFieldLable : getLabel('lblcompany', 'Company'),
								paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								displayValue1 : clientDisc
							});
						}
						
						// 3 Agreement Code
						if(sessionAggrementCode!='' && typeof sessionAggrementCode!='undefined' ){
							me.agreementCodeFilterVal=sessionAggrementCode;
						}
						if (!Ext.isEmpty(me.agreementCodeFilterVal)
								&& me.agreementCodeFilterVal != 'all'
								&& me.agreementCodeFilterVal != ''
								&& !Ext.isEmpty(agreementDisc)
								&& agreementDisc != '') {
							jsonArray.push({
								paramName : 'agreementCode',
								paramValue1 : encodeURIComponent(me.agreementCodeFilterVal.replace(new RegExp("'", 'g'), "\''")),
								paramFieldLable : getLabel( 'agreementCode', 'Agreement Code' ),
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								displayValue1 : agreementDisc
							});
						}
						// 4 live/non live
						if (me.noPostStructurePrefCode != 'all') {
							jsonArray.push({
								paramName : 'noPostStructure',
								paramFieldLable : getLabel('noPostStructure', 'Live / Non Live'),
								paramValue1 : encodeURIComponent(me.noPostStructurePrefCode.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S',
								displayType : 5,
								displayValue1 : me.noPostStructurePrefDesc
							});
						}
//						var vFromDate;
//						var vToDate;
//						//if( null  == me.fromDateFilterVal || "" == me.fromDateFilterVal )
//						//{
//						//	me.fromDateFilterVal = 	Ext.Date.parse(dtApplicationDate,strExtApplicationDateFormat);
//						//	
//						//}
//						vFromDate = Ext.util.Format.date(me.fromDateFilterVal,'Y-m-d') ;
//						if(sessionfrmDateVal==''){
//							frmDateVal=vFromDate;
//						}else{
//							frmDateVal=sessionfrmDateVal;
//						}
//						//if( null  == me.toDateFilterVal || "" == me.toDateFilterVal )
//						//{
//						//	me.toDateFilterVal = 	Ext.Date.parse(dtApplicationDate,strExtApplicationDateFormat);
//						//	
//						//}
//						vToDate = Ext.util.Format.date(me.toDateFilterVal,'Y-m-d') ;
//						if(sessiontoDateVal==''){
//						toDateVal=vToDate;
//						}
//						else{
//							toDateVal=sessiontoDateVal;
//						}
						var index = me.dateFilterVal;
						var objDateParams = me.getDateParam(index);
						if(!Ext.isEmpty(index))
						{
							jsonArray.push({
								paramName : 'requestDate',
								paramIsMandatory : true,
								paramValue1 : objDateParams.fieldValue1,
								paramValue2 : objDateParams.fieldValue2,
								paramFieldLable : getLabel( 'date', 'Date' ),
								operatorValue : objDateParams.operator,
								dataType : 'D'
							});
							me.handleDateChange(index);
						}
						var statusFilterValue = me.statusFilterVal;
						var statusFilterDesc = me.statusFilterDesc;
						if (statusFilterValue != null && statusFilterValue != 'all'
						 && statusFilterValue.length > 0)
							jsonArray.push(
							   {
									paramName : 'status',
									paramValue1 : statusFilterValue,
									operatorValue : 'in',
									dataType : 'S',
									displayValue1 : statusFilterDesc,
									paramFieldLable : getLabel('executionStatus', 'Status'),
									displayType : 5
							   } );
						return jsonArray;
					},
					callHandleLoadGridData : function(loadingFlag) {
						var me = this;
						if(loadingFlag)
							me.getGroupView().toggleLoadingIndicator();
						var gridObj = me.getAgreementSweepQueryGrid();
						me.handleLoadGridData(null, null, gridObj, gridObj.store.dataUrl,
								gridObj.pageSize, 1, 1, null, loadingFlag);
					},
					handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
							newPgNo, oldPgNo, sorter, loadingFlag) {
						var me = this;
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,
								oldPgNo, sorter);
						me.setDataForFilter();
						strUrl = strUrl + me.getFilterUrl() + "&"
								+ csrfTokenName + "=" + csrfTokenValue;
						grid.loadGridData(strUrl, null, null, false);
						
						grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
							var clickedColumn = tableView.getGridColumns()[cellIndex];
							var columnType = clickedColumn.colType;
							if(Ext.isEmpty(columnType)) {
								var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
								columnType = containsCheckboxCss ? 'checkboxColumn' : '';
							}
							me.handleGridRowClick(record, grid, columnType);
						});
						if(loadingFlag)
							me.getGroupView().toggleLoadingIndicator();
					},
					handleGridRowClick : function(record, grid, columnType) {
						if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
							var me = this;
							var columnModel = null;
							var columnAction = null;
							if (!Ext.isEmpty(grid.columnModel)) {
								columnModel = grid.columnModel;
								for (var index = 0; index < columnModel.length; index++) {
									if (columnModel[index].colId == 'actioncontent') {
										columnAction = columnModel[index].items;
										break;
									}
								}
							}
							var arrVisibleActions = [];
							var arrAvailableActions = [];
							if (!Ext.isEmpty(columnAction))
								arrAvailableActions = columnAction;
							var store = grid.getStore();
							var jsonData = store.proxy.reader.jsonData;
							if (!Ext.isEmpty(arrAvailableActions)) {
								for (var count = 0; count < arrAvailableActions.length; count++) {
									var btnIsEnabled = false;
									if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
										btnIsEnabled = grid.isRowIconVisible(store, record,
												jsonData, arrAvailableActions[count].itemId,
												arrAvailableActions[count].maskPosition);
										if (btnIsEnabled == true) {
											arrVisibleActions.push(arrAvailableActions[count]);
											btnIsEnabled = false;
										}
									}
								}
							}
							if (!Ext.isEmpty(arrVisibleActions)) {
								me.handleRowIconClick(arrVisibleActions[0].itemId, grid, record);
							}
						} else {
						}
					},
					handleRowIconClick : function(actionName, objGrid, record) {
						var me = this;
						if (actionName === 'btnView') {
							me.submitExtForm(
									'agreementSweepQueryResultCenter.srvc',
									record, null);
						}
						else if(actionName === 'btnSnapshot')
						{
							showExecutionSnapshot(record);
						}
					},

					getFilterUrl : function() {
						var me = this;
						var strQuickFilterUrl = '';
						strQuickFilterUrl = me
								.generateUrlWithFilterParams(this);
						/*
						 * strQuickFilterUrl = strQuickFilterUrl + '&$fromDate=' +
						 * fromDate + '&$toDate=' + toDate;
						 */
						return strQuickFilterUrl;
					},

					generateUrlWithFilterParams : function(thisClass) {
						var filterData = thisClass.filterData;
						var isFilterApplied = false;
						var strFilter = '&$filter=';
						var strTemp = '';
						var strFilterParam = '';

						for (var index = 0; index < filterData.length; index++) {
							if (isFilterApplied)
								strTemp = strTemp + ' and ';
							switch (filterData[index].operatorValue) {
							case 'bt':
								if (filterData[index].dataType === 'D') {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + 'date\''
											+ filterData[index].paramValue1
											+ '\'' + ' and ' + 'date\''
											+ filterData[index].paramValue2
											+ '\'';
								} else {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + '\''
											+ filterData[index].paramValue1
											+ '\'' + ' and ' + '\''
											+ filterData[index].paramValue2
											+ '\'';
								}
								break;
							case 'in' :
								var arrId = filterData[index].paramValue1;
								var objData = (arrId).map(function(v) {
								  return  v;
								});
								objData.forEach( function(val,indx){
											joinVal = val.indexOf('^') > -1 ? val.replace(/\^/g,',') : val;
											objData[indx]=joinVal;
										});
								
								objData = objData.toString();
								objData = objData.split(',');
								if (0 != objData.length) {
									strTemp = strTemp + '(';
									for (var count = 0; count < objData.length; count++) {
										strTemp = strTemp + filterData[index].paramName
												+ ' eq ' + '\'' + objData[count] + '\'';
										if (count != objData.length - 1) {
											strTemp = strTemp + ' or ';
										}
									}
									strTemp = strTemp + ' ) ';
								}
								break;	
							default:
								// Default opertator is eq
								if (filterData[index].dataType === 'D') {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + 'date\''
											+ filterData[index].paramValue1
											+ '\'';
								} else {
									strTemp = strTemp
											+ filterData[index].paramName + ' '
											+ filterData[index].operatorValue
											+ ' ' + '\''
											+ filterData[index].paramValue1
											+ '\'';
								}
								break;
							}
							isFilterApplied = true;
						}
						if (isFilterApplied)
							strFilter = strFilter + strTemp;
						else
							strFilter = '';
						return strFilter;
					},

//					applyFilter : function() {
//						var me = this;
//						var grid = me.getGrid();
//						if (!Ext.isEmpty(grid)) {
//							var strDataUrl = grid.store.dataUrl;
//							var store = grid.store;
//							var strUrl = grid.generateUrl(strDataUrl,
//									grid.pageSize, 1, 1, store.sorters);
//							strUrl = strUrl + me.getFilterUrl();
//							me.getGrid().setLoading(true);
//							grid.loadGridData(strUrl,
//									me.handleAfterGridDataLoad, null);
//						}
//					},
					loadResponseSmartGrid : function(record){
						var me = this;
						var smartGridPanel = Ext.create( 'GCP.view.AgreementSweepSnapShotPopup',{
									renderTo : 'agreementExecutionSnapShotGridId'
								});
						me.handleSnapShotGridConfig(record);
					},
					handleSnapShotGridConfig : function(record)
					{
						var me = this;
						var objSnapShotGrid = me.getSnapShotGrid();
						var objConfigMap = me.getAgreementSweepSnapShotPopup().getSnapShotGridConfig();
						var arrCols = new Array();
						arrCols = me.getAgreementSweepSnapShotPopup().getSnapGridColumns(objConfigMap.arrColsPref, objConfigMap.objWidthMap,record );
						if(!Ext.isEmpty(objSnapShotGrid))
							objSnapShotGrid.destroy( true );
						me.getAgreementSweepSnapShotPopup().handleSnapShotGridLoading(arrCols, objConfigMap.storeModel, record);
					},
					
//					handleSmartGridConfig : function() {
//						var me = this;
//						var agreementSweepQueryGrid = me
//								.getAgreementSweepQueryGrid();
//						var objConfigMap = me
//								.getAgreementSweepQueryGridConfiguration();
//						var arrCols = new Array();
//						if (!Ext.isEmpty(agreementSweepQueryGrid))
//							agreementSweepQueryGrid.destroy(true);
//
//						arrCols = me.getColumns(objConfigMap.arrColsPref,
//								objConfigMap.objWidthMap);
//						me.handleSmartGridLoading(arrCols,
//								objConfigMap.storeModel);
//
//					},
					handleSellerFilter : function(selectedValue) {
						var me = this;
						me.sellerFilterVal = selectedValue;
					},
					handleClientFilter : function(selectedValue) {
						var me = this;
						me.clientFilterVal = selectedValue;
					},
					handleAgreementFilter : function(selectedValue) {
						var me = this;
						me.agreementCodeFilterVal = selectedValue;
					},
					handlenoPostStructureFilter : function(combo) {
						var me = this;
						me.noPostStructureFilterVal = combo.getValue();
						me.noPostStructureFilterDesc = combo.getRawValue();
					},
//					handleSmartGridLoading : function(arrCols, storeModel) {
//						var me = this;						
//						var agreementSweepQueryGrid = Ext
//								.create(
//										'Ext.ux.gcp.SmartGrid',
//										{
//											id : 'agreementSweepQueryGridId',
//											itemId : 'agreementSweepQueryGridId',
//											pageSize : _GridSizeMaster,
//											stateful : false,
//											showEmptyRow : true,
//											padding : '0 0 0 0',
//											rowList : _AvailableGridSize,
//											minHeight : 0,
//											columnModel : arrCols,
//											cls:'t7-grid',
//											storeModel : storeModel,
//											isRowIconVisible : me.isRowIconVisible,
//											handleRowMoreMenuClick : me.handleRowMoreMenuClick,
//											hideRowNumbererColumn : true,
//											showCheckBoxColumn :false,
//
//											handleRowIconClick : function(
//													tableView, rowIndex,
//													columnIndex, btn, event,
//													record) {
//												me.handleRowIconClick(
//														tableView, rowIndex,
//														columnIndex, btn,
//														event, record);
//											},
//
//											handleMoreMenuItemClick : function(
//													grid, rowIndex, cellIndex,
//													menu, event, record) {
//												var dataParams = menu.dataParams;
//												me.handleRowIconClick(
//														dataParams.view,
//														dataParams.rowIndex,
//														dataParams.columnIndex,
//														menu, null,
//														dataParams.record);
//											}
//										});
//
//						var agreementSweepQueryGridListView = me
//								.getAgreementSweepQueryGridListView();
//						agreementSweepQueryGridListView
//								.add(agreementSweepQueryGrid);
//						agreementSweepQueryGridListView.doLayout();
//					},
					handleRowIconClick : function(actionName, grid, record, rowIndex) {
						var me = this;
						if (actionName === 'btnView') {
							me.submitExtForm(
									'agreementSweepQueryResultCenter.srvc',
									record, rowIndex);
						}
						else if(actionName === 'btnSnapshot')
						{
							showExecutionSnapshot(record);
						}
					},
					submitExtForm : function(strUrl, record, rowIndex) {
						var me = this;
						var updateIndex = rowIndex;
						var form, inputField;
						strUrl = strUrl + "?" + csrfTokenName + "="
								+ csrfTokenValue;
						form = document.createElement('FORM');
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'agerExecId', record.get('AGEREXECID')));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'clientCode', record.get('CLIENT_CODE')));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'clientCodeFltr', record.get('CLIENT_NAME')));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'refCode', record.get('REF_CODE')));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'executionStatus', record
										.get('EXECUTION_STATUS')));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'agreementName', record.get('AGREEMENT_NAME')));
						
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'sellerDisc', sellerDisc));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'sellerValue', sellerVal));
						
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'clientDisc', clientDisc));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'clientValue', clientValue));
						
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'frmDateview', frmDateVal));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'toDateview', toDateVal));
						
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'agreementCode', agreementValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'agreementValueCode', agreementValueCode));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'agreementDisc', agreementDisc));
						
						
						/*
						 * form.appendChild(me.createFormField('INPUT',
						 * 'HIDDEN', 'executionDate',
						 * record.get('NEXT_EXECUTION_DATE')));
						 */
						
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
					},
					/*showExecutionSnapshot : function(record) {
						var me = this;
						var form, inputField;
						strUrl = "viewExecutionSnapshot.srvc" + "?" + csrfTokenName + "="
								+ csrfTokenValue;
						form = document.createElement('FORM');
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'agerExecId', record.get('AGEREXECID')));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'viewState', record.get('viewState')));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'fltrToDate',  Ext.util.Format.date(me.toDateFilterVal,'Y-m-d')));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								'fltrFromDate', Ext.util.Format.date(me.fromDateFilterVal,'Y-m-d')));
						
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
					},*/

//					isRowIconVisible : function(store, record, jsonData, itmId,
//							maskPosition) {
//						if (record.get('isEmpty'))
//							{
//								return false;
//							}
//						else{
//								return true;}
//					},

//					getColumns : function(arrColsPref, objWidthMap) {
//						var me = this;
//						var arrCols = new Array(), objCol = null, cfgCol = null;
//						/* arrCols.push(me.createGroupActionColumn()); */						
//						arrCols.push(me.createActionColumn())
//						if (!Ext.isEmpty(arrColsPref)) {
//							for (var i = 0; i < arrColsPref.length; i++) {
//								objCol = arrColsPref[i];
//								cfgCol = {};
//								cfgCol.colHeader = objCol.colDesc;
//								cfgCol.colId = objCol.colId;
//								if (!Ext.isEmpty(objCol.colType)) {
//									cfgCol.colType = objCol.colType;
//									if (cfgCol.colType === "number")
//										cfgCol.align = 'right';
//								}
//
//								cfgCol.width = !Ext
//										.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId]
//										: 120;
//
//								cfgCol.fnColumnRenderer = me.columnRenderer;
//								arrCols.push(cfgCol);
//							}
//						}
//						return arrCols;
//					},
//					createActionColumn : function() {
//						var me = this;
//						var objActionCol = {
//								colType : 'actioncontent',
//								colId : 'actionId',
//								width : 60,
//								colHeader: getLabel('action', 'Action'),
//								sortable : false,
//								locked : true,
//								lockable: false,
//								hideable: false,
//							visibleRowActionCount : 1,
//							items : [ {
//								itemId : 'btnView',
//								itemCls : 'grid-row-action-icon icon-view',
//								toolTip : getLabel('viewToolTip', 'View Record'),
//								itemLabel : 'View Record',
//								maskPosition : 3
//							},
//							{
//								itemId : 'btnSnapshot',
//								itemCls : 'grid-row-action-icon icon-clone',
//								itemLabel : 'Execution Sanpshot',
//								toolTip : getLabel('viewSnapshot', 'Execution Sanpshot'),
//								maskPosition : 4
//							}
//							]
//						};
//						return objActionCol;
//
//					},

					handleRowMoreMenuClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var menu = btn.menu;
						var arrMenuItems = null;
						var blnRetValue = true;
						var store = tableView.store;
						var jsonData = store.proxy.reader.jsonData;

						btn.menu.dataParams = {
							'record' : record,
							'rowIndex' : rowIndex,
							'columnIndex' : columnIndex,
							'view' : tableView
						};
						if (!Ext.isEmpty(menu.items)
								&& !Ext.isEmpty(menu.items.items))
							arrMenuItems = menu.items.items;
						/*
						 * if (!Ext.isEmpty(arrMenuItems)) { for (var a = 0; a <
						 * arrMenuItems.length; a++) { blnRetValue =
						 * me.isRowIconVisible(store, record, jsonData, null,
						 * arrMenuItems[a].maskPosition);
						 * arrMenuItems[a].setVisible(blnRetValue); } }
						 */
						menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
					},

					columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {
						if (record.get('isEmpty')) {
							if (rowIndex === 0 && colIndex === 0) {
								meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
								return getLabel('gridNoDataMsg',
										'No records found !!!');											
							}
						} else
							return value;
					},
//					getAgreementSweepQueryGridConfiguration : function() {
//						var me = this;
//						var objConfigMap = null;
//						var objWidthMap = null;
//						var arrColsPref = null;
//						var storeModel = null;
//						objWidthMap = {
//
//							"CLIENT_NAME" : '20%',
//							"REF_CODE" : '10%',
//							"EXECUTION_MODE" : '10%',
//							"EXECUTION_DATE" : '17%',
//							"EXECUTION_STATUS" : '15%',
//							"FAILURE_REASON" : '27.6%'
//						};
//
//						arrColsPref = [ {
//							"colId" : "CLIENT_NAME",
//							"colDesc" : "Client Name"
//						}, {
//							"colId" : "REF_CODE",
//							"colDesc" : "Agreement Code"
//						}, {
//							"colId" : "EXECUTION_MODE",
//							"colDesc" : "Execution Mode"
//						}, {
//							"colId" : "EXECUTION_DATE",
//							"colDesc" : "Execution Date Time"
//						}, {
//							"colId" : "EXECUTION_STATUS",
//							"colDesc" : "Execution Status"
//						}, {
//							"colId" : "FAILURE_REASON",
//							"colDesc" : "Remarks"
//						} ];
//						storeModel = {
//							fields : [ 'CLIENT_CODE','CLIENT_NAME', 'REF_CODE',
//									'EXECUTION_MODE', 'EXECUTION_DATE',
//									'EXECUTION_STATUS', 'FAILURE_REASON',
//									'AGEREXECID','viewState',
//									'AGREEMENT_NAME' ],
//							proxyUrl : 'agreementSweepQueryList.srvc',
//							rootNode : 'd.commonDataTable',
//							totalRowsNode : 'd.__count'
//						};
//
//						objConfigMap = {
//							"objWidthMap" : objWidthMap,
//							"arrColsPref" : arrColsPref,
//							"storeModel" : storeModel
//						};
//						return objConfigMap;
//					},
					handleReportAction : function(btn,opts) {
						var me = this;
						me.downloadReport();
					},
					downloadReport : function() {
						var me = this;
						var arrExtension = {
							downloadXls : 'xls'
						};
						var currentPage = 1;
						var strExtension = '';
						var strUrl = '';
						var strSelect = '';
						var activeCard = '';
						var viscols;
						var col = null;
						var visColsStr = "";
						var colMap = new Object();
						var colArray = new Array();
						var grid = me.getAgreementSweepQueryGrid();

						//strExtension = arrExtension[ actionName ];
						//strUrl = 'services/agreementMst/getDynamicReport.' + strExtension;
						strUrl = 'downloadXlsAgreementSweepQueryList.srvc?';
						//strUrl += '?$skip=1';
						strUrl = grid.generateUrl(strUrl, grid.pageSize, grid.store.currentPage,
								1, grid.store.sorters);
						me.setDataForFilter();
						strUrl = strUrl + me.getFilterUrl() + "&"
								+ csrfTokenName + "=" + csrfTokenValue;
						//alert(strUrl);
						viscols = grid.getAllVisibleColumns();
						for (var j = 0; j < viscols.length; j++) {
							col = viscols[j];
							if (col.dataIndex
									&& arrReportSortColumn[col.dataIndex]) {
								if (colMap[arrReportSortColumn[col.dataIndex]]) {
									// ; do nothing
								} else {
									colMap[arrReportSortColumn[col.dataIndex]] = 1;
									colArray
											.push(arrReportSortColumn[col.dataIndex]);

								}
							}

						}
						if (colMap != null) {

							visColsStr = visColsStr + colArray.toString();
							strSelect = '&$select=[' + colArray.toString()
									+ ']';
						}

						strUrl = strUrl + strSelect;
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
						document.body.removeChild(form);
					},
//					/**
//					 * Finds all strings that matches the searched value in each
//					 * grid cells.
//					 * 
//					 * @private
//					 */
//					searchOnPage : function() {
//						var me = this;
//						var searchValue = me.getSearchTextInput().value;
//						var anyMatch = me.getMatchCriteria().getValue();
//						if ('anyMatch' === anyMatch.searchOnPage) {
//							anyMatch = false;
//						} else {
//							anyMatch = true;
//						}
//
//						var grid = me.getGrid();
//						grid.view.refresh();
//
//						// detects html tag
//						var tagsRe = /<[^>]*>/gm;
//						// DEL ASCII code
//						var tagsProtect = '\x0f';
//						// detects regexp reserved word
//						var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;
//
//						if (searchValue !== null) {
//							searchRegExp = new RegExp(searchValue, 'g'
//									+ (anyMatch ? '' : 'i'));
//
//							if (!Ext.isEmpty(grid)) {
//								var store = grid.store;
//
//								store
//										.each(
//												function(record, idx) {
//													var td = Ext
//															.fly(
//																	grid.view
//																			.getNode(idx))
//															.down('td'), cell, matches, cellHTML;
//													while (td) {
//														cell = td
//																.down('.x-grid-cell-inner');
//														matches = cell.dom.innerHTML
//																.match(tagsRe);
//														cellHTML = cell.dom.innerHTML
//																.replace(
//																		tagsRe,
//																		tagsProtect);
//
//														if (cellHTML === '&nbsp;') {
//															td = td.next();
//														} else {
//															// populate indexes
//															// array, set
//															// currentIndex, and
//															// replace
//															// wrap matched
//															// string in a span
//															cellHTML = cellHTML
//																	.replace(
//																			searchRegExp,
//																			function(
//																					m) {
//																				return '<span class="xn-livesearch-match">'
//																						+ m
//																						+ '</span>';
//																			});
//															// restore protected
//															// tags
//															Ext
//																	.each(
//																			matches,
//																			function(
//																					match) {
//																				cellHTML = cellHTML
//																						.replace(
//																								tagsProtect,
//																								match);
//																			});
//															// update cell html
//															cell.dom.innerHTML = cellHTML;
//															td = td.next();
//														}
//													}
//												}, me);
//							}
//						}
//					},
					setInfoTooltip : function() {
						var me = this;
						var infotip = Ext.create('Ext.tip.ToolTip', {
							target : 'imgFilterInfo',
							listeners : {
								// Change content dynamically depending on which
								// element
								// triggered the show.
								beforeshow : function(tip) {
									var seller = '';
									var profileName = '';
									var status = '';

									var sellerFltId = me.getSellerCombo();
									if (!Ext.isEmpty(sellerFltId)
											&& !Ext.isEmpty(sellerFltId
													.getValue())) {
										seller = sellerFltId.getValue();
									} else {
										seller = getLabel('all', 'ALL');
									}

									/*
									 * var profileNameRef =
									 * me.getProfileNameField(); if(
									 * !Ext.isEmpty( profileNameRef ) &&
									 * !Ext.isEmpty( profileNameRef.getValue() ) ) {
									 * profileName = profileNameRef.getValue(); }
									 * else { profileName = getLabel( 'none',
									 * 'None' ); }
									 * 
									 * if( !Ext.isEmpty( me.getStatusFilter() ) &&
									 * !Ext.isEmpty(
									 * me.getStatusFilter().getValue() ) ) { var
									 * combo = me.getStatusFilter(); status =
									 * combo.getRawValue() } else { status =
									 * getLabel( 'all', 'ALL' ); }
									 */
									tip.update(getLabel("seller", "Seller")
											+ ' : ' + seller + '<br/>');

									/*
									 * tip.update( getLabel( "seller", "Seller" ) + ' : ' +
									 * seller + '<br/>' + getLabel(
									 * "profileName", "Profile Name" ) + ' : ' +
									 * profileName + '<br/>' + getLabel(
									 * 'status', 'Status' ) + ' : ' + status );
									 */

								}
							}
						});
					},
					createFormField : function(element, type, name, value) {
						var inputField;
						inputField = document.createElement(element);
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
					}
//					handleHeaderFilterPanelVisibility: function(){
//						var me = this;
//						
//						var agreementSweepQueryGrid = me.getAgreementSweepQueryViewGrid();
//						
//						var objFilterPanel = me.getAgreementSweepQueryViewFilter();
//						var objReadOnlyFilterPanel = $('#headerReadOnlyDiv');
//						
//						$('#sweepQuerylViewSellerSpanId').text('');
//						$('#sweepQuerylViewSellerSpanId').text(sellerDisc);
//						
//						$('#sweepQueryClientSpanId').text('');
//						$('#sweepQueryClientSpanId').text(clientDisc);
//						
//						$('#sweepQueryAgreementSpanId').text('');
//						$('#sweepQueryAgreementSpanId').text(agreementValue);
//						
//						$('#sweepQueryAgreementDiscSpanId').text('');
//						$('#sweepQueryAgreementDiscSpanId').text(agreementDisc);
//						
//						$('#sweepQueryfrmDateSpanId').text('');
//						$('#sweepQueryfrmDateSpanId').text(frmDateVal);
//						
//						$('#sweepQuerytoDateSpanId').text('');
//						$('#sweepQuerytoDateSpanId').text(toDateVal);
//						
//						/*sellerDisc="";
//						clientDisc="";
//						agreementValue="";
//						agreementDisc="";
//						frmDateVal="";
//						toDateVal="";*/
//						if(!Ext.isEmpty(objFilterPanel)){
//							objFilterPanel.hide();
//						}
//						if(!Ext.isEmpty(agreementSweepQueryGrid)){
//							agreementSweepQueryGrid.removeCls('ui-helper-hidden');
//						}
//						objReadOnlyFilterPanel.removeClass('ui-helper-hidden');
//						
//						
//					},
//					handleFilterPanelVisibility: function(){
//						var me = this;
//						var objFilterPanel = me.getAgreementSweepQueryViewFilter();
//						var objGridPanel = me.getAgreementSweepQueryViewGrid();
//						var objReadOnlyFilterPanel = $('#headerReadOnlyDiv');		
//						var agreementCode = objFilterPanel
//						.down('AutoCompleter[itemId="agreementCodeItemId"]');
//						var sellerValue = objFilterPanel
//						.down('combo[itemId="sweepQuerySellerIdItemId"]');
//						var clientValueFilter = objFilterPanel
//						.down('AutoCompleter[itemId="clientCodeItemId"]');
//						
//						var fromDate=me.getFromDate();
//						var toDate=me.getToDate();
//						
//						if(!Ext.isEmpty(agreementCode) && sessionAggrementCode !=''){
//							
//							agreementCode.setValue(sessionagreementValue);
//						}else{
//							if(agreementValueCode!=''){
//								agreementCode.setValue(agreementValue);
//							   
//							}else{
//								 agreementCode.setValue('');
//							}
//						}
//						
//						if(!Ext.isEmpty(sellerValue) && sessionSellerVal !=''){
//							
//							sellerValue.setValue(sessionSellerVal);
//						}else{
//							sellerValue.setValue('');
//						}
//						
//						if(!Ext.isEmpty(clientValueFilter) && sessionClientVal !=''){
//							
//							clientValueFilter.setValue(sessionclientDisc);
//						}else{
//							if(clientValue!='')
//								clientValueFilter.setValue(clientDisc);
//							else{
//								clientValueFilter.setValue('');
//							}
//						}
//						
//						if(!Ext.isEmpty(fromDate) && sessionfrmDateVal!=''){
//							fromDate.setValue(sessionfrmDateVal);
//						}
//						if(!Ext.isEmpty(toDate) && sessiontoDateVal!=''){
//							toDate.setValue(sessiontoDateVal);
//						}
//						sessionClientVal='';
//						sessiontoDateVal='';
//						sessionfrmDateVal='';
//						sessionSellerVal='';
//						sessionagreementValue='';
//						sessionAggrementCode='';
//						
//						objFilterPanel.show();
//						objReadOnlyFilterPanel.addClass('ui-helper-hidden');
//						objGridPanel.addCls('ui-helper-hidden');
//						
//						
//						
//						
//					},
				});