Ext.define('GCP.controller.InstrumentPrintingController',
		{
	extend : 'Ext.app.Controller',
	requires : [ 'Ext.ux.gcp.PageSettingPopUp' ],
	views : ['GCP.view.InstrumentPrintingFilterView',
		'GCP.view.InstrumentPrintingSummaryView',
		'GCP.view.InstrumentPrintingDetailViewPanel',
		'GCP.view.InstrumentPrintingLotInfoPanel'],
		refs : [
			{
				ref : 'groupView',
				selector : 'instrumentPrintingSummaryView groupView'
			},
			{
				ref : 'grid',
				selector : 'instrumentPrintingSummaryView groupView smartgrid'
			},
			{
				ref : 'filterView',
				selector : 'instrumentPrintingSummaryView groupView filterView'
			},
			{
				ref : 'instrumentPrintingSummaryView',
				selector : 'instrumentPrintingSummaryView'
			},
			{
				ref : 'entryDateLabel',
				selector : 'instrumentPrintingFilterView label[itemId="entryDateLabel"]'

			},
			{
				ref : 'assignToBankCombo',
				selector : 'instrumentPrintingFilterView combo[itemId="assignToBankCombo"]'

			},
			{
				ref : 'instrPrintDtlGrid',
				selector : 'instrumentPrintingDetailViewPanel grid[itemId="instrPrintViewDtlGrid"]'
			},
			{
				ref : 'instrPrintDtlPanel',
				selector : 'instrumentPrintingDetailViewPanel'
			},
			{
				ref : 'instrPrintLotInfoGrid',
				selector : 'InstrumentPrintingLotInfoPanel grid[itemId="instPrintLotInfoGrid"]'
			},
			{
				ref : 'instrPrintLotInfoPanel',
				selector : 'InstrumentPrintingLotInfoPanel'
			}],
			config : {
				strPageName : 'instrumentPrintingSummary',
				pageSettingPopup : null,
				entryDateQuickFilterVal : '',
				entryDateQuickFilterLabel : '',
				isAssignToBankSelected : false,
				isCompanySelected : false,
				preferenceHandler : null,
				strDefaultMask : '000000000000000000',
				dateHandler : null,
				userStatusPrefCode : '',
				userStatusPrefDesc : '',
				filterAssignToBankCode : 'All',
				filterAssignToBankDesc : getLabel('all','All'),
				selectedFilterClient : '',
				isPdfFileSelected : false,
				isPayRefSelected : false,
				firstLoad : false,
				objLocalData : null,
				objInstrPrintDtlViewPopup : null,
				objInstrPrintLotInfoPanel : null,
				isBeneSelected : false,
				isDebitAccountSelected : false,
				filterBeneName : null,
				filterBeneDesc : null,
				filterDebitAccountName : null,
				filterDebitAccountDesc : null,
				reportGridOrder : null
			},
			init : function() {
				var me = this;
				me.firstLoad = true;
				me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
				if (objSaveLocalStoragePref) {
					me.objLocalData = Ext
					.decode(objSaveLocalStoragePref);
					objQuickPref = me.objLocalData
					&& me.objLocalData.d.preferences
					&& me.objLocalData.d.preferences.tempPref
					&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson
							: {};

							me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref
									: [];

				}
				me.updateConfig();
				$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});

				me
				.control({
					'instrumentPrintingSummaryView groupView' : {
						'groupTabChange' : me.doHandleGroupTabChange,
						'gridRender' : me.doHandleLoadGridData,
						'gridPageChange' : me.doHandleLoadGridData,
						'gridSortChange' : me.doHandleLoadGridData,
						'gridPageSizeChange' : me.doHandleLoadGridData,
						'gridColumnFilterChange' : me.doHandleLoadGridData,
						'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
						'gridSettingClick' : function() {
							me.showPageSettingPopup('GRID');
						},
						'gridRowActionClick' : function(grid,
								rowIndex, columnIndex,
								actionName, record) {
							me.doHandleRowIconClick(actionName,
									grid, record, rowIndex);
						},
						'groupActionClick' : function(
								actionName, isGroupAction,
								maskPosition, grid,
								arrSelectedRecords) {
							if (isGroupAction === true) {
								me.doHandleGroupActions(
										actionName, grid,
										arrSelectedRecords,
										'groupAction');
							}
						},
						'gridStoreLoad' : function(grid, store) {
							me.disableActions(false);
						},
						'render' : function() {
							var me = this, objLocalJsonData = '';
							if (objInstrumentPrintingPref
									|| objSaveLocalStoragePref) {
								objLocalJsonData = Ext
								.decode(objSaveLocalStoragePref);

								if (!Ext
										.isEmpty(objLocalJsonData.d.preferences)
										&& (!Ext
												.isEmpty(objLocalJsonData.d.preferences.tempPref))
												&& allowLocalPreference === 'Y'
												&& !Ext
												.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)) {
									me.updateConfig();
								}
							}
						}

					},
					'pageSettingPopUp' : {
						'applyPageSetting' : function(popup,
								data, strInvokedFrom) {
							me.applyPageSetting(data,
									strInvokedFrom);
						},
						'savePageSetting' : function(popup,
								data, strInvokedFrom) {
							me.savePageSetting(data,
									strInvokedFrom);
						},
						'restorePageSetting' : function(popup,
								data, strInvokedFrom) {
							me.restorePageSetting(data,
									strInvokedFrom);
						}
					},
					'filterView' : {
						appliedFilterDelete : function(btn) {
							me.handleAppliedFilterDelete(btn);
						},
						afterrender : function() {
							me.selectedFilterClient = me.clientCode;
							me.selectedFilterClientDesc = me.clientDesc;
							me
							.handleClientChangeInQuickFilter();
							me.setFilterRetainedValues();
						}
					},
					'filterView button[itemId="clearSettingsButton"]' : {
						click : function() {
							me.resetAllFilters();
						}
					},
					'instrumentPrintingFilterView' : {
						dateChange : function(btn, opts) {
							me.entryDateQuickFilterVal = btn.btnValue;
							me.entryDateQuickFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							if (btn.btnValue !== '7') {
								me.setDataForFilter();
								me.applyFilter();
							}
						}
					},
					'instrumentPrintingFilterView combo[itemId="clientCombo"]' : {
						select : function(combo, record) {
							me.selectedFilterClient = combo
							.getValue();
							me.selectedFilterClientDesc = combo
							.getDisplayValue();
							me
							.handleClientChangeInQuickFilter();
							me.isCompanySelected = true;

						},
						change : function(combo, record, oldVal) {
							me.selectedFilterClient = combo
							.getValue();
							me.selectedFilterClientDesc = combo
							.getDisplayValue();
							me
							.handleClientChangeInQuickFilter();
							me.isCompanySelected = true;
						},
						afterrender : function(combo, width,
								height, eOpts) {
							var me = this;
							if (!Ext.isEmpty(me.clientCode)
									&& 'ALL' !== me.clientCode
									&& 'all' !== me.clientCode) {
								combo.setValue(me.clientCode);
								me.selectedFilterClient = me.clientCode;
							} else {
								if (strEntityType == 0
										|| clientCount > 1) {
									combo.setValue(combo
											.getStore()
											.getAt(0));
								}

							}

						}
					},
					'instrumentPrintingFilterView AutoCompleter[itemId="clientAuto"]' : {
						select : function(combo, record) {
							me.selectedFilterClient = combo
							.getValue();
							me.selectedFilterClientDesc = combo
							.getDisplayValue();
							me
							.handleClientChangeInQuickFilter();
							me.isCompanySelected = true;
							strClient = me.selectedFilterClient;
							$(document)
							.trigger(
									'handleClientChangeInQuickFilter',
									false);
						},
						change : function(combo, record, oldVal) {
							if (Ext
									.isEmpty(combo
											.getRawValue())) {
								if (!Ext.isEmpty(oldVal)
										&& oldVal.replace(
												/[%]/g, '') !== '') {

									me.selectedFilterClient = combo
									.getValue();
									me.selectedFilterClientDesc = combo
									.getDisplayValue();
									me
									.handleClientChangeInQuickFilter();
									me.isCompanySelected = true;
								}
							} else {
								me.isCompanySelected = false;
							}
						},
						keyup : function(combo, e, eOpts) {
							me.isCompanySelected = false;
						},
						blur : function(combo, The, eOpts) {
							if (me.isCompanySelected == false
									&& !Ext.isEmpty(combo
											.getRawValue())) {
								selectedFilterClient = combo
								.getValue();
								selectedFilterClientDesc = combo
								.getValue();
								me
								.handleClientChangeInQuickFilter();
								me.isCompanySelected = true;
							}
						},
						boxready : function(combo, width,
								height, eOpts) {
							if (!Ext
									.isEmpty(me.selectedFilterClient)) {
								combo
								.setValue(me.selectedFilterClientDesc);
							}
						}
					},
					'instrumentPrintingFilterView combo[itemId="assignToBankCombo"]' : {
						select : function(combo, record) {
							me.filterAssignToBankCode = combo
							.getValue();
							me.filterAssignToBankDesc = combo
							.getRawValue();
							me.isAssignToBankSelected = true;
							me.setDataForFilter();
							me.applyFilter();
						},

						change : function(combo, record, oldVal) {
							if (Ext
									.isEmpty(combo
											.getRawValue())
											|| 'ALL' === combo
											.getRawValue()) {
								if (!Ext.isEmpty(oldVal)
										&& oldVal.replace(
												/[%]/g, '') !== '') {
									me.filterAssignToBankCode = '';
									me.filterAssignToBankDesc = '';
									me.setDataForFilter();
									me.applyFilter();
									me.isAssignToBankSelected = true;
								}
							} else {
								me.isAssignToBankSelected = false;
							}
						},
						keyup : function(combo, e, eOpts) {
							me.isAssignToBankSelected = false;
						},
						blur : function(combo, The, eOpts) {
							if (me.isAssignToBankSelected == false
									&& !Ext.isEmpty(combo
											.getRawValue())) {

								me.filterAssignToBankCode = combo
								.getRawValue();
								me.filterAssignToBankDesc = combo
								.getRawValue();
								me.setDataForFilter();
								me.applyFilter();
								me.isAssignToBankSelected = true;
							}
						},
						boxready : function(combo, width,
								height, eOpts) {
							if (!Ext
									.isEmpty(me.filterAssignToBankDesc
											&& me.filterAssignToBankDesc != 'ALL')) {
								combo
								.setValue(me.filterAssignToBankCode);
								combo
								.setRawValue(me.filterAssignToBankDesc);
							}
						}
					},
					'instrumentPrintingFilterView  combo[itemId="statusCombo"]' : {
						'select' : function(combo,
								selectedRecords) {
							combo.isQuickStatusFieldChange = true;
						},
						change : function(combo, record, oldVal) {
							if (Ext
									.isEmpty(combo
											.getRawValue())
											|| 'ALL' === combo
											.getRawValue()) {
								if (!Ext.isEmpty(oldVal)
										&& oldVal.replace(
												/[%]/g, '') !== '') {
									var me = this;
									combo.isQuickStatusFieldChange = false;
									me.userStatusPrefCode = '';
									me.userStatusPrefDesc = '';
									me.setDataForFilter();
									me.applyFilter();
								}
							} else {
								combo.isQuickStatusFieldChange = false;
							}
						},
						'blur' : function(combo, record) {
							if (combo.isQuickStatusFieldChange) {
								me
								.handleStatusFilterClick(combo);
							}
						},
						boxready : function(combo, width,
								height, eOpts) {
							if (!Ext
									.isEmpty(me.userStatusPrefDesc)
									&& me.userStatusPrefDesc != 'All'
									&& me.userStatusPrefDesc != 'all'
										&& !Ext
										.isEmpty(me.userStatusPrefCode)
										&& me.userStatusPrefCode != 'All'
											&& me.userStatusPrefCode != 'all') {
								var tempArr = [];
								tempArr = me.userStatusPrefCode
								.split(',');
								if (!Ext.isEmpty(tempArr)) {
									me.statusFilterVal = 'all';
									combo.setValue(tempArr);
									combo.selectedOptions = tempArr;
								} else {
									combo.setValue(tempArr);
									me.statusFilterVal = '';
								}
							}
						}
					},
					'instrumentPrintingFilterView component[itemId="entryDatePicker"]' : {
						render : function() {
							$('#entryDatePicker')
							.datepick(
									{
										monthsToShow : 1,
										changeMonth : true,
										changeYear : true,
										dateFormat : strApplicationDateFormat,
										rangeSeparator : ' to ',
										onClose : function(
												dates) {
											if (!Ext
													.isEmpty(dates)) {
												me.dateRangeFilterVal = '13';
												me.datePickerSelectedDate = dates;
												me.datePickerSelectedEntryDate = dates;
												me.entryDateQuickFilterVal = me.dateRangeFilterVal;
												me.entryDateQuickFilterLabel = getLabel(
														'daterange',
												'Date Range');
												me
												.handleDateChange(me.dateRangeFilterVal);
												me
												.setDataForFilter();
												me
												.applyFilter();
											}
										}
									});
							if (!Ext
									.isEmpty(me.entryDateQuickFilterVal)
									&& !Ext
									.isEmpty(me.entryDateQuickFilterLabel)) {
								me
								.handleDateChange(me.entryDateQuickFilterVal);
							}
							else if(!me.objLocalData
									|| !me.objLocalData.d
									|| !me.objLocalData.d.preferences
									|| !me.objLocalData.d.preferences.tempPref){
								me.dateFilterVal = '1'; // Set to Today
								me.dateFilterLabel = getLabel('today', 'Today');
								me.handleDateChange(me.dateFilterVal);
								me.setDataForFilter();
							}
						}
					}/*,
					'instrumentPrintingFilterView textfield[itemId="pdfFileNameText"]' : {
						keyup : function(combo, e, eOpts) {
							me.isPdfFileSelected = false;
						},
						blur : function(textfield, The, eOpts) {
							me.filterPdfFileName = textfield
							.getRawValue();
							me.filterPdfFileDesc = textfield
							.getRawValue();
							me.setDataForFilter();
							me.applyFilter();
							me.isPdfFileSelected = true;

						},
						boxready : function(text, width,
								height, eOpts) {
							if (!Ext
									.isEmpty(me.filterPdfFileName)) {
								text
								.setValue(me.filterPdfFileName);
								text
								.setRawValue(me.filterPdfFileDesc);
							}
						}
					}*/,
					'instrumentPrintingFilterView textfield[itemId="payRefText"]' : {
						keyup : function(combo, e, eOpts) {
							me.isPayRefSelected = false;
						},
						blur : function(textfield, The, eOpts) {
							me.filterPayRefName = textfield
							.getRawValue();
							me.filterPayRefDesc = textfield
							.getRawValue();
							me.setDataForFilter();
							me.applyFilter();
							me.isPayRefSelected = true;

						},
						boxready : function(text, width,
								height, eOpts) {
							if (!Ext
									.isEmpty(me.filterPayRefName)) {
								text
								.setValue(me.filterPayRefName);
								text
								.setRawValue(me.filterPayRefDesc);
							}
						}
					},'instrumentPrintingFilterView AutoCompleter[itemId="beneAutocompleter"]' : {
						select : function(combo, record) {
							me.filterBeneName = combo.getValue();
							me.filterBeneDesc = combo.getRawValue();
							me.isBeneSelected = true;
							me.setDataForFilter();
							me.applyFilter();
						},
						change : function( combo, record, oldVal )
						{
							if(Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
								if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
									me.filterBeneName = "";
									me.filterBeneDesc = "";
									me.setDataForFilter();
									me.applyFilter();
									me.isBeneSelected = true;
								}
							}else{
								me.isBeneSelected = false;
							}
						},
						keyup : function(combo, e, eOpts){
							me.isBeneSelected = false;
						},
						blur : function(combo, The, eOpts ){
							if(me.isBeneSelected == false  
									&& !Ext.isEmpty(combo.getRawValue()) ){
										me.filterBeneName = combo.getRawValue();
										me.filterBeneDesc = combo.getRawValue();
										me.setDataForFilter();
										me.applyFilter();
										me.isBeneSelected = true;
							}
						}
					},'instrumentPrintingFilterView AutoCompleter[itemId="debitAccountAutocompleter"]' : {
						select : function(combo, record) {
							me.filterDebitAccountName = combo.getValue();
							me.filterDebitAccountDesc = combo.getRawValue();
							me.isDebitAccountSelected = true;
							me.setDataForFilter();
							me.applyFilter();
						},
						change : function( combo, record, oldVal )
						{
							if(Ext.isEmpty(combo.getRawValue()) || "ALL" === combo.getRawValue()) {
								if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
									me.filterDebitAccountName = "";
									me.filterDebitAccountDesc = "";
									me.setDataForFilter();
									me.applyFilter();
									me.isDebitAccountSelected = true;
								}
							}else{
								me.isDebitAccountSelected = false;
							}
						},
						keyup : function(combo, e, eOpts){
							me.isDebitAccountSelected = false;
						},
						blur : function(combo, The, eOpts ){
							if(me.isDebitAccountSelected == false  
									&& !Ext.isEmpty(combo.getRawValue()) ){
										me.filterDebitAccountName = combo.getRawValue();
										me.filterDebitAccountDesc = combo.getRawValue();
										me.setDataForFilter();
										me.applyFilter();
										me.isDebitAccountSelected = true;
							}
						}
					}
				});
				$(document).on('handleClientChangeInQuickFilter',
						function(event) {
					me.handleClientChangeInQuickFilter();
				});
				$(document).on('loadLotInfoSmartGrid', function(event,record) {
					me.loadLotInfoSmartGrid(record);
				});
				$(document).on('loadInstrPrintDtlViewSmartGrid', function(event,record) {
					me.loadInstrPrintDtlViewSmartGrid(record);
				});
				$(document).on('performReportAction', function(event, actionName,type) {
					me.downloadReport(actionName,type);
				});
			},
			handleStatusFilterClick : function(combo) {
				var me = this;
				combo.isQuickStatusFieldChange = false;
				me.userStatusPrefCode = combo.getSelectedValues();
				me.userStatusPrefDesc = combo.getRawValue();
				me.setDataForFilter();
				me.applyFilter();
			},
			resetAllFilters : function() {
				var me = this;
				if (entityType === '1') {
					var clientCombo = me.getFilterView().down(
					"combo[itemId='clientCombo']");
					if (clientCombo.getStore().getCount() > 1) {
						var record = clientCombo.getStore().getAt(0);
						clientCombo.setValue(record);
						$(document).trigger(
								'handleClientChangeInQuickFilter');

					} else {
						$(document).trigger(
								'handleClientChangeInQuickFilter');
					}
				} else {
					me.resetClientAutocompleter();
				}
				
				var beneAutocompleter = me.getFilterView().down('AutoCompleter[itemId="beneAutocompleter"]');
				beneAutocompleter.setValue("");
				
				var debitAccountAutocompleter = me.getFilterView().down('AutoCompleter[itemId="debitAccountAutocompleter"]');
				debitAccountAutocompleter.setValue("");

				var datePickerRef = $('#entryDatePicker');
				me.entryDateFilterVal = '';
				datePickerRef.val('');
				me.entryDateQuickFilterVal = '';

				var statusFltId = me.getFilterView().down(
				'combo[itemId=statusCombo]');
				statusFltId.reset();
				me.userStatusPrefCode = 'all';
				statusFltId.selectAllValues();
				var assignToBankCombo = me.getFilterView().down(
						"combo[itemId='assignToBankCombo']");
				assignToBankCombo.setValue( getLabel('all','All'));
				me.filterAssignToBankCode = '';
				me.filterAssignToBankDesc = '';

				/*var pdfFile = me.getFilterView().down(
				"textfield[itemId='pdfFileNameText']");
				pdfFile.setValue('');
				me.filterPdfFileName = '';
				me.filterPdfFileDesc = '';*/
				
				var payRef = me.getFilterView().down(
				"textfield[itemId='payRefText']");
				payRef.setValue('');
				me.filterPayRefName = '';
				me.filterPayRefDesc = '';

				me.setDataForFilter();
				me.refreshData();
			},
			handleClientChangeInQuickFilter : function() {
				var me = this;
				me.clientCode = me.selectedFilterClient;
				if ('all' !== me.selectedFilterClient) {
					me.clientDesc = me.selectedFilterClientDesc;
				}
				me.updateFilterParams();
				me.setDataForFilter();
				me.applyFilter();
			},
			updateFilterParams : function() {
				var me = this;
				var beneAutocompleter = me.getFilterView().down('AutoCompleter[itemId="beneAutocompleter"]');
				beneAutocompleter.cfgExtraParams = [];
				var debitAccountAutocompleter = me.getFilterView().down('AutoCompleter[itemId="debitAccountAutocompleter"]');
				debitAccountAutocompleter.cfgExtraParams = [];
				if(me.clientCode && 'all' !== me.clientCode) {
					var clientFilter = {
						key : '$filtercode1',
						value : me.clientCode
					};
					beneAutocompleter.cfgExtraParams.push(clientFilter);
					debitAccountAutocompleter.cfgExtraParams.push(clientFilter);
				}
				beneAutocompleter.setValue("");
				debitAccountAutocompleter.setValue("");
			},
			handleGroupActions : function(strUrl, remark, grid,
					arrSelectedRecords) {
				var me = this;
				var groupView = me.getGroupView();
				if (!Ext.isEmpty(groupView)) {
					var arrayJson = [];
					var records = (arrSelectedRecords || []);
					for (var index = 0; index < records.length; index++) {
						arrayJson
						.push({
							serialNo : grid.getStore().indexOf(
									records[index]) + 1,
									identifier : records[index].data.identifier,
									userMessage : remark
						});
					}
					if (arrayJson) {
						arrayJson = arrayJson
						.sort(function(valA, valB) {
							return valA.serialNo
							- valB.serialNo;
						});
					}

					Ext.Ajax
					.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							var errorMessage = '';
							if (response.responseText != '[]') {
								var jsonData = Ext
								.decode(response.responseText);
								if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
										&& !Ext.isEmpty(jsonData.d.instrumentActions)){
									jsonData = jsonData.d.instrumentActions;
									for (var i = 0; i < jsonData.length; i++) {
										var arrError = jsonData[i].errors;
										if (!Ext
												.isEmpty(arrError)) {
											for (var j = 0; j < arrError.length; j++) {
												errorMessage = errorMessage
												+ arrError[j].code
												+ ' : '
												+ arrError[j].errorMessage
												+ '<br/>';
											}
										}

									}
								}
							}
							if (!Ext.isEmpty(errorMessage)) {
								me.showMessagePopup(getLabel('errorTitle','Error'), errorMessage);
							}
							else
							{
								groupView.refreshData();
							}
						},
						failure : function() {
							me.showMessagePopup(getLabel('errorTitle','Error'), getLabel('errorPopUpMsg','Error while fetching data..!'));
						}
					});
				}
			},
			doHandleRowIconClick : function(actionName, grid, record,
					rowIndex) {
				var me = this;
				switch(actionName)
				{
					case 'instrumentFile':
					case 'adviceFile':
					case 'whtFile':
						me.handleDownloadAction(actionName, grid, record,rowIndex);
						break;
					case 'confirm':
					case 'assign':
						me.doHandleGroupActions(actionName, grid,
								[ record ], 'rowAction');
						break;
					case 'view':
						showInstrPrintViewPopUp(record);
						break;
					case 'lotInfo':
						showLotInfoPopUp(record);
						break;
					default: break;
				}
			},
			handleDownloadAction : function(actionName, grid, record, rowIndex)
			{
				//Using XMLHttpRequest discouraged
				me = this; 
				var form = null;

				form = document.createElement('FORM');
				form.name = 'frmDownload';
				form.id = 'frmDownload';
				form.method = 'POST';
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokenValue));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier',
						record.data.identifier));
				form.action = 'services/instrumentPrinting/download/'+actionName;
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
				setTimeout(function(){
					me.getGroupView().refreshData();
				},2000)
			},
			createFormField : function(element, type, name, value) {
				var inputField;
				inputField = document.createElement(element);
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},
			doHandleGridRowSelectionChange : function(groupInfo,
					subGroupInfo, objGrid, objRecord, intRecordIndex,
					arrSelectedRecords, jsonData) {
				var me = this;
				var buttonMask = me.strDefaultMask;
				var maskArray = [], actionMask = '', objData = null;
				if (!Ext.isEmpty(jsonData)
						&& !Ext.isEmpty(jsonData.d.__buttonMask)) {
					buttonMask = jsonData.d.__buttonMask;
				}
				maskArray.push(buttonMask);
				for (var index = 0; index < arrSelectedRecords.length; index++) {
					objData = arrSelectedRecords[index];
					maskArray
					.push(objData.get('__metadata').__rightsMap);
				}
				actionMask = doAndOperation(maskArray, 5);
				me.enableDisableGroupActions(actionMask);
			},

			enableDisableGroupActions : function(actionMask) {
				var me = this;
				var objGroupView = me.getGroupView();
				var actionBar = objGroupView
				.down('toolbar[itemId="groupActionToolBar"]');
				var blnEnabled = false, strBitMapKey = null, arrItems = null;
				if (!Ext.isEmpty(actionBar)
						&& !Ext.isEmpty(actionBar.items.items)) {
					arrItems = actionBar.items.items;
					Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							item.setDisabled(!blnEnabled);
						}
					});
				}
			},
			refreshData : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				objGroupView.refreshData();

			},
			updateFilterInfo : function() {
				var me = this;
				var arrInfo = generateFilterArray(me.filterData);

				me.getFilterView().updateFilterInfo(arrInfo);
			},
			doHandleGroupTabChange : function(groupInfo, subGroupInfo,
					tabPanel, newCard, oldCard) {
				var me = this;
				var strModule = '';
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
				if (groupInfo
						&& _charCaptureGridColumnSettingAt === 'L') {
					strModule = subGroupInfo.groupCode;
					strModule = strModule === 'all' ? groupInfo.groupTypeCode
							+ '-' + strModule
							: strModule;
					me.preferenceHandler.readModulePreferences(
							me.strPageName, strModule,
							me.postHandleDoHandleGroupTabChange, null,
							me, false);

				} else {
					me.postHandleDoHandleGroupTabChange();
				}
			},

			postHandleDoHandleGroupTabChange : function(data, args) {
				var me = this;
				var objGroupView = me.getGroupView();
				var objSummaryView = me
				.getInstrumentPrintingSummaryView(), objPref = null, gridModel = null, intPgSize = null, showPager = true, heightOption = null;
				var colModel = null, arrCols = null;

				var intPageSize = me.objLocalData
				&& me.objLocalData.d
				&& me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.pageSize ? me.objLocalData.d.preferences.tempPref.pageSize
						: '';
				var intPageNo = me.objLocalData
				&& me.objLocalData.d
				&& me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.pageNo ? me.objLocalData.d.preferences.tempPref.pageNo
						: 1;
				var sortState = me.objLocalData
				&& me.objLocalData.d
				&& me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.sorter ? me.objLocalData.d.preferences.tempPref.sorter
						: [];

				if (data && data.preference) {
					objPref = Ext.decode(data.preference);
					arrCols = objPref.gridCols || null;
					colModel = objSummaryView.getColumnModel(arrCols);
					showPager = objPref.gridSetting
					&& !Ext
					.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager
							: true;
					heightOption = objPref.gridSetting
					&& !Ext
					.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption
							: null;
					if (colModel) {
						gridModel = {
								columnModel : colModel,
								showPagerForced : showPager,
								heightOption : heightOption,
								storeModel : {
									sortState : objPref.sortState
								}
						};
					}
				}
				if (!Ext.isEmpty(intPageSize)
						&& !Ext.isEmpty(intPageNo)) {
					gridModel = gridModel ? gridModel : {};
					gridModel.pageSize = intPageSize;
					gridModel.pageNo = intPageNo;
					gridModel.storeModel = {
							sortState : sortState
					};
				}
				objGroupView.reconfigureGrid(gridModel);
			},

			doHandleLoadGridData : function(groupInfo, subGroupInfo,
					grid, url, pgSize, newPgNo, oldPgNo, sorter,
					filterData) {
				var me = this;
				var objGroupView = me.getGroupView();

				if (allowLocalPreference === 'Y') {
					me.handleSaveLocalStorage();
				}
				var intPageNo = me.objLocalData
				&& me.objLocalData.d
				&& me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.pageNo ? me.objLocalData.d.preferences.tempPref.pageNo
						: null, intOldPgNo = oldPgNo, intNewPgNo = newPgNo;

				if (!Ext.isEmpty(intPageNo) && me.firstLoad) {
					intNewPgNo = intPageNo;
					intOldPgNo = intPageNo;
				}
				me.firstLoad = false;

				var strUrl = grid.generateUrl(url, pgSize, intNewPgNo,
						intOldPgNo, sorter)
						+ me.getFilterUrl(subGroupInfo, groupInfo);
				var columns = grid.columns;
				Ext.each(columns, function(col) {
					if (col.dataIndex == 'decodedStatus') {
						col.sortable = false;
					}
				});
				me.reportGridOrder = strUrl;
				me.updateFilterInfo();
				grid.loadGridData(strUrl, null, null, false);
				objGroupView
				.handleGroupActionsVisibility(me.strDefaultMask);

				grid
				.on(
						'cellclick',
						function(tableView, td, cellIndex,
								record, tr, rowIndex, e) {
							var clickedColumn = tableView
							.getGridColumns()[cellIndex];
							var columnType = clickedColumn.colType;
							if (Ext.isEmpty(columnType)) {
								var containsCheckboxCss = (clickedColumn.cls
										.indexOf('x-column-header-checkbox') > -1);
								columnType = containsCheckboxCss ? 'checkboxColumn'
										: '';
							}
							me.handleGridRowClick(record, grid,
									columnType);
						});
			},

			handleGridRowClick : function(record, grid, columnType) {
				if (columnType !== 'actioncontent'
					&& columnType !== 'checkboxColumn') {
					var me = this;
					me.doHandleRowIconClick('view', grid,record);
				}
			},

			updateConfig : function() {
				var me = this;
				me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
				me.preferenceHandler = Ext
				.create('Ext.ux.gcp.PreferencesHandler');
				if (!Ext.isEmpty(objSaveLocalStoragePref)) {
					var objLocalJsonData = Ext
					.decode(objSaveLocalStoragePref);
					if (!Ext.isEmpty(objLocalJsonData)
							&& (!Ext
									.isEmpty(objLocalJsonData.d.preferences))
									&& (!Ext
											.isEmpty(objLocalJsonData.d.preferences.tempPref))
											&& (!Ext
													.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson))) {
						var data = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
						for (var i = 0; i < data.length; i++) {
							/*if (data[i].paramName === 'pdfFileName') {
								me.filterPdfFileDesc = data[i].displayValue1;
								me.filterPdfFileName = data[i].paramValue1;
							} else*/ if (data[i].paramName === 'phdReference') {
								me.filterPayRefDesc = data[i].displayValue1;
								me.filterPayRefName = data[i].paramValue1;
							} else if (data[i].paramName === 'status') {
								me.userStatusPrefCode = data[i].paramValue1;
								me.userStatusPrefDesc = data[i].displayValue1;
							} else if (data[i].paramName === 'clientCode') {
								me.clientCode = data[i].paramValue1;
								me.clientDesc = data[i].displayValue1;
								selectedFilterClient = me.clientCode;
								selectedFilterClientDesc = me.clientDesc;
							} else if (data[i].paramName === 'assignToBank') {
								me.filterAssignToBankCode = data[i].paramValue1;
								me.filterAssignToBankDesc = data[i].displayValue1;
							}  else if (data[i].paramName === 'receiver') {
								me.filterBeneName = data[i].paramValue1;
								me.filterBeneDesc = data[i].displayValue1;
							}else if (data[i].paramName === 'debitAccount') {
								me.filterDebitAccountName = data[i].paramValue1;
								me.filterDebitAccountDesc = data[i].displayValue1;
							}else if (data[i].paramName === 'entryDate') {
								me.entryDateQuickFilterVal = '13';
								me.entryDateQuickFilterLabel = data[i].dateLabel;
								var yy = null, mm = null, dd = null, yyTo = null, mmTo = null, ddTo = null;
								me.datePickerSelectedDate = [];
								if (data[i].paramValue1 === data[i].paramValue2) {
									yy = data[i].paramValue1.substring(
											0, 4);
									mm = data[i].paramValue1.substring(
											5, 7);
									dd = data[i].paramValue1.substring(
											8, 10);
									me.datePickerSelectedDate
									.push(new Date(yy, mm - 1,
											dd));
								} else {
									yy = data[i].paramValue1.substring(
											0, 4);
									mm = data[i].paramValue1.substring(
											5, 7);
									dd = data[i].paramValue1.substring(
											8, 10);
									me.datePickerSelectedDate
									.push(new Date(yy, mm - 1,
											dd));

									yyTo = data[i].paramValue2
									.substring(0, 4);
									mmTo = data[i].paramValue2
									.substring(5, 7);
									ddTo = data[i].paramValue2
									.substring(8, 10);
									me.datePickerSelectedDate
									.push(new Date(yyTo,
											mmTo - 1, ddTo));
								}
							}
						}
					}
				}
			},
			doHandleGroupActions : function(strAction, grid,
					arrSelectedRecords, strActionType) {
				var me = this;
				var strUrl = Ext.String.format(
						'services/instrumentPrinting/{0}', strAction);
				if (strAction === 'confirm' || strAction === 'assign') {
					me.showConfirmPopUp(strAction, strUrl, grid, arrSelectedRecords);

				} else {
					me.handleGroupActions(strUrl, '', grid,
							arrSelectedRecords, strActionType,
							strAction);
				}	


			},
			showConfirmPopUp : function(strAction, strUrl, grid, arrSelectedRecords) {
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if (strAction === 'confirm' ) {
					fieldLbl = getLabel('userConfirmPopUpTitle', 'Selected files will be marked as Print Confirm. Do you want to proceed ?');
					titleMsg = getLabel('userConfirmPopUpFldLbl', 'Print Confirm');
				}
				if (strAction === 'assign') {
					fieldLbl = getLabel('userAssignToBankPopUpTitle', 'Selected files will be assigned to bank. Do you want to proceed?');
					titleMsg = getLabel('userAssignToBankPopUpFldLbl', 'Assign To Bank');
				}
				var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					buttonText: {
						ok: getLabel('btnOk', 'OK'),
						cancel: getLabel('cancel', 'Cancel')
					},
					cls : 't7-popup',
					width :455,
					height : 200,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.handleGroupActions(strUrl, '', grid,
									arrSelectedRecords);
						}
					}
				});
			},
			setDataForFilter : function() {
				var me = this;
				me.filterData = me.getFilterQueryJson();
			},
			getFilterQueryJson : function() {
				var me = this, clientParamName = null, clientNameOperator = null, clientCodeVal = null, statusFilterValArray = [], statusFilterDescArray = [], statusFilterVal = me.userStatusPrefCode, statusFilterDesc = me.userStatusPrefDesc, jsonArray = [];
				if (!Ext.isEmpty(me.clientDesc)
						&& !Ext.isEmpty(me.clientCode)
						&& 'all' !== me.clientCode) {
					clientParamName = 'clientCode';
					clientNameOperator = 'eq';
					clientCodeVal = me.clientCode;
					jsonArray.push({
						paramName : clientParamName,
						paramValue1 : encodeURIComponent(clientCodeVal
								.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : clientNameOperator,
								dataType : 'S',
								paramFieldLable : getLabel('lblcompany',
								'Company Name'),
								displayType : 5,
								displayValue1 : me.clientDesc
					});
				}
				/*if (!Ext.isEmpty(me.filterPdfFileName)) {
					me.filterPdfFileName = me.filterPdfFileName
					.toLocaleUpperCase();
					jsonArray
					.push({
						paramName : 'pdfFileName',
						operatorValue : 'lk',
						paramValue1 : encodeURIComponent(me.filterPdfFileName
								.replace(new RegExp("'", 'g'),
								"\''")),
								dataType : 'S',
								paramFieldLable : getLabel(
										'pdfFileName', 'PDF File Name'),
										displayType : 5,
										displayValue1 : me.filterPdfFileDesc
					});
				}*/
				if (!Ext.isEmpty(me.filterPayRefName)) {
					me.filterPayRefName = me.filterPayRefName
					.toLocaleUpperCase();
					jsonArray
					.push({
						paramName : 'phdReference',
						operatorValue : 'lk',
						paramValue1 : encodeURIComponent(me.filterPayRefName
								.replace(new RegExp("'", 'g'),
								"\''")),
								dataType : 'S',
								paramFieldLable : getLabel(
										'phdReference', 'Payment Reference'),
										displayType : 5,
										displayValue1 : me.filterPayRefDesc
					});
				}
				var index = me.entryDateQuickFilterVal;
				var objDateParams = me.getDateParam(index);
				if (!Ext.isEmpty(index)) {
					jsonArray.push({
						paramName : 'entryDate',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('entryDate',
						'Entry Date'),
						dateLabel : objDateParams.label
					});
				}
				// Status Query
				if (statusFilterVal != null && statusFilterVal != 'All'
					&& statusFilterVal != 'all'
						&& statusFilterVal.length >= 1) {
					statusFilterValArray = statusFilterVal.toString();

					if (statusFilterDesc != null
							&& statusFilterDesc != 'All'
								&& statusFilterDesc != 'all'
									&& statusFilterDesc.length >= 1) {
						statusFilterDescArray = statusFilterDesc
						.toString();
					}

					jsonArray.push({
						paramName : 'status',
						paramValue1 : statusFilterValArray,
						operatorValue : 'statusFilterOp',
						dataType : 'S',
						paramFieldLable : getLabel('status', 'Status'),
						displayType : 5,
						displayValue1 : statusFilterDescArray
					});
				}
				if (!Ext.isEmpty(me.filterAssignToBankCode)
						&& (me.filterAssignToBankCode !== getLabel('all','All'))) {
					jsonArray.push({
						paramName : 'assignToBank',
						operatorValue : 'eq',
						paramValue1 : me.filterAssignToBankCode,
						dataType : 'S',
						paramFieldLable : getLabel('assignToBank',
						'Assign To Bank'),
						displayType : 5,
						displayValue1 : me.filterAssignToBankDesc
					});
				}
				if(!Ext.isEmpty(me.filterBeneName)) {
					jsonArray.push({
						paramName : 'receiver',
						operatorValue : 'lk',
						paramValue1 : encodeURIComponent(me.filterBeneName.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						dataType : 'S',
						paramFieldLable : getLabel('beneName', 'Receiver Name'),
						displayType : 5,
						displayValue1 : me.filterBeneDesc,
						detailFilter : 'Y'
					});
				}
				if(!Ext.isEmpty(me.filterDebitAccountName)) {
					jsonArray.push({
						paramName : 'debitAccount',
						operatorValue : 'lk',
						paramValue1 : encodeURIComponent(me.filterDebitAccountName.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						dataType : 'S',
						paramFieldLable : getLabel('debitAccount', 'Debit Account'),
						displayType : 5,
						displayValue1 : me.filterDebitAccountDesc,
						detailFilter : 'Y'
					});
				}
				return jsonArray;
			},
			getFilterUrl : function(subGroupInfo, groupInfo) {
				var me = this;
				var strQuickFilterUrl = '';
				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery) ? subGroupInfo.groupQuery
						: '';
				strQuickFilterUrl = me.generateUrlWithFilterParams();
				if (!Ext.isEmpty(strGroupQuery)) {
					if (!Ext.isEmpty(strQuickFilterUrl)) {
						strQuickFilterUrl += ' and ' + strGroupQuery;
					} else {
						strQuickFilterUrl += '&$filter='
							+ strGroupQuery;
					}
				}
				return strQuickFilterUrl;
			},
			handleDateChange : function(index) {
				var me = this;
				var objDateParams = me.getDateParam(index);
				var datePickerRef = $('#entryDatePicker');
				if (!Ext.isEmpty(me.entryDateQuickFilterLabel)) {
					me.getEntryDateLabel().setText(
							getLabel('entryDate', 'Entry Date')
							+ ' ('
							+ me.entryDateQuickFilterLabel
							+ ')');
				}

				var vFromDate = $.datepick.formatDate(
						strApplicationDateFormat, $.datepick.parseDate(
								'yy-mm-dd', objDateParams.fieldValue1));
				var vToDate = $.datepick.formatDate(
						strApplicationDateFormat, $.datepick.parseDate(
								'yy-mm-dd', objDateParams.fieldValue2));

				if (index == '13') {
					if (objDateParams.operator == 'eq') {
						datePickerRef.datepick('setDate', vFromDate);
					} else {
						datePickerRef.datepick('setDate', [ vFromDate,
							vToDate ]);
					}
				} else {
					if (index === '1' || index === '2'
						|| index === '12') {
						if (index === '12' && !Ext.isEmpty(filterDays)
								&& filterDays !== '999') {
							datePickerRef.datepick('setDate', vToDate);
						} else if (index === '12') {
							datePickerRef
							.datepick('setDate', vFromDate);
						} else {
							datePickerRef
							.datepick('setDate', vFromDate);
						}
					} else {
						datePickerRef.datepick('setDate', [ vFromDate,
							vToDate ]);
					}
				}
				if (!Ext.isEmpty(vFromDate) || !Ext.isEmpty(vToDate)) {
					me.entryDateQuickFilterVal = index;
				}

			},
			getDateParam : function(index, dateType) {
				var me = this;
				me.dateRangeFilterVal = index;
				var objDateHandler = me.getDateHandler();
				var strAppDate = dtApplicationDate;
				var dtFormat = strExtApplicationDateFormat;
				var date = new Date(Ext.Date
						.parse(strAppDate, dtFormat));
				var strSqlDateFormat = 'Y-m-d';
				var fieldValue1 = '', fieldValue2 = '', operator = '', label = '';
				var retObj = {};
				var dtJson = {};
				switch (index) {
					case '1':
						// Today
						fieldValue1 = Ext.Date.format(date,
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Today';
						break;
					case '2':
						// Yesterday
						fieldValue1 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Yesterday';
						break;
					case '3':
						// This Week
						dtJson = objDateHandler.getThisWeekToDate(date);
						fieldValue1 = Ext.Date.format(dtJson.fromDate,
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate,
								strSqlDateFormat);
						operator = 'bt';
						label = 'This Week';
						break;
					case '4':
						// Last Week To Date
						dtJson = objDateHandler.getLastWeekToDate(date);
						fieldValue1 = Ext.Date.format(dtJson.fromDate,
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate,
								strSqlDateFormat);
						operator = 'bt';
						label = 'Last Week To Date';
						break;
					case '5':
						// This Month
						dtJson = objDateHandler.getThisMonthToDate(date);
						fieldValue1 = Ext.Date.format(dtJson.fromDate,
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate,
								strSqlDateFormat);
						operator = 'bt';
						label = 'This Month';
						break;
					case '6':
						// Last Month To Date
						dtJson = objDateHandler.getLastMonthToDate(date);
						fieldValue1 = Ext.Date.format(dtJson.fromDate,
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate,
								strSqlDateFormat);
						operator = 'bt';
						label = 'Last Month To Date';
						break;
					case '7':
						// Widget Date Filter
						if (!isEmpty(me.datePickerSelectedEntryAdvDate)) {
							if (me.datePickerSelectedEntryAdvDate.length == 1) {
								fieldValue1 = me.datePickerSelectedEntryAdvDate[0];
								fieldValue2 = fieldValue1;
								operator = 'eq';
							} else if (me.datePickerSelectedEntryAdvDate.length == 2) {
								fieldValue1 = me.datePickerSelectedEntryAdvDate[0];
								fieldValue2 = me.datePickerSelectedEntryAdvDate[1];
								if (fieldValue1 == fieldValue2) {
									operator = 'eq';
								} else {
									operator = 'bt';
								}
							}
						}
						break;
					case '8':
						// This Quarter
						dtJson = objDateHandler.getQuarterToDate(date);
						fieldValue1 = Ext.Date.format(dtJson.fromDate,
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate,
								strSqlDateFormat);
						operator = 'bt';
						label = 'This Quarter';
						break;
					case '9':
						// Last Quarter To Date
						dtJson = objDateHandler.getLastQuarterToDate(date);
						fieldValue1 = Ext.Date.format(dtJson.fromDate,
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate,
								strSqlDateFormat);
						operator = 'bt';
						label = 'Last Quarter To Date';
						break;
					case '10':
						// This Year
						dtJson = objDateHandler.getYearToDate(date);
						fieldValue1 = Ext.Date.format(dtJson.fromDate,
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate,
								strSqlDateFormat);
						operator = 'bt';
						label = 'This Year';
						break;
					case '11':
						// Last Year To Date
						dtJson = objDateHandler.getLastYearToDate(date);
						fieldValue1 = Ext.Date.format(dtJson.fromDate,
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate,
								strSqlDateFormat);
						operator = 'bt';
						label = 'Last Year To Date';
						break;
					case '12':
						// Latest
						if (!Ext.isEmpty(filterDays)
								&& filterDays !== '999') {
							fieldValue1 = Ext.Date.format(dtHistoryDate,
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(date,
									strSqlDateFormat);
							operator = 'bt';
							label = 'Latest';
						} else {
							fieldValue1 = Ext.Date.format(date,
									strSqlDateFormat);
							fieldValue2 = fieldValue1;
							operator = 'le';
							label = 'Latest';
						}
						break;
					case '14':
						// Last Month only
						dtJson = objDateHandler
						.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date.format(dtJson.fromDate,
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate,
								strSqlDateFormat);
						operator = 'bt';
						label = 'Last Month only';
						break;
					case '13':
						// Date Range
						if (!isEmpty(me.datePickerSelectedDate)) {
							if (me.datePickerSelectedDate.length == 1) {
								fieldValue1 = Ext.Date.format(
										me.datePickerSelectedDate[0],
										strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
								label = 'Date Range';
							} else if (me.datePickerSelectedDate.length == 2) {
								fieldValue1 = Ext.Date.format(
										me.datePickerSelectedDate[0],
										strSqlDateFormat);
								fieldValue2 = Ext.Date.format(
										me.datePickerSelectedDate[1],
										strSqlDateFormat);
								operator = 'bt';
								label = 'Date Range';
							}
						}
						break;
					default:
						break;

				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				retObj.label = label;

				return retObj;
			},
			applyFilter : function() {
				var me = this;
				me.filterApplied = 'Q';
				me.refreshData();

			},
			disableActions : function(canDisable) {
				if (canDisable) {
					$('.canDisable').addClass('button-grey-effect');
				} else {
					$('.canDisable').removeClass('button-grey-effect');
				}
			},
			handleAppliedFilterDelete : function(btn) {
				var me = this;
				var objData = btn.data;
				if (!Ext.isEmpty(objData)) {
					me.resetFieldOnDelete(objData);
				}
			},
			resetFieldOnDelete : function(objData) {
				var me = this, strFieldName;
				if (!Ext.isEmpty(objData)) {
					strFieldName = objData.paramName || objData.field;
				}
				if (strFieldName === 'clientCode') {
					if (entityType === '1') {
						var clientCombo = me.getFilterView().down(
						"combo[itemId='clientCombo']");
						if (clientCombo.getStore().getCount()) {
							var record = clientCombo.getStore()
							.getAt(0);
							clientCombo.setValue(record);
							$(document).trigger(
									'handleClientChangeInQuickFilter');
						} else {
							$(document).trigger(
									'handleClientChangeInQuickFilter');
						}
					} else {
						me.resetClientAutocompleter();
					}
				} else if (strFieldName === 'assignToBank') {
					var assignToBankCombo = me.getFilterView().down(
					'combo[itemId="assignToBankCombo"]');
					assignToBankCombo.setValue( getLabel('all','All'));
					me.filterAssignToBankCode = '';
					me.filterAssignToBankDesc = '';
					me.setDataForFilter();
					me.applyFilter();
				} else if (strFieldName === 'entryDate') {

					var datePickerRef = $('#entryDatePicker');
					me.entryDateFilterVal = '';
					me.getEntryDateLabel().setText(
							getLabel('entryDate', 'Entry Date'));
					datePickerRef.val('');
					me.entryDateQuickFilterVal = '';
					me.entryDateQuickFilterLabel = '';
					me.handleDateChange(me.entryDateQuickFilterVal);
					me.setDataForFilter();
					me.applyFilter();
				} else if (strFieldName === 'phdReference') {
					var payRefText = me.getFilterView().down(
					'textfield[itemId="payRefText"]');
					payRefText.setValue('');
					me.filterPayRefName = '';
					me.setDataForFilter();
					me.applyFilter();
				}/* else if (strFieldName === 'pdfFileName') {
					var pdfFileNameText = me.getFilterView().down(
					'textfield[itemId="pdfFileNameText"]');
					pdfFileNameText.setValue('');
					me.filterPdfFileName = '';
					me.setDataForFilter();
					me.applyFilter();
				}else*/ if (strFieldName === 'status') {
					var statusFltId = me.getFilterView().down(
					'combo[itemId=statusCombo]');
					statusFltId.reset();
					me.userStatusPrefCode = 'all';
					statusFltId.selectAllValues();
					me.setDataForFilter();
				}else if(strFieldName === 'receiver') {
					var beneAutocompleter = me.getFilterView().down('AutoCompleter[itemId="beneAutocompleter"]');
					beneAutocompleter.setValue("");
					me.setDataForFilter();
					me.applyFilter();
				}else if(strFieldName === 'debitAccount') {
					var debitAccountAutocompleter = me.getFilterView().down('AutoCompleter[itemId="debitAccountAutocompleter"]');
					debitAccountAutocompleter.setValue("");
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			resetClientAutocompleter : function() {
				var me = this;
				var clientAuto = me.getFilterView().down(
						"combo[itemId='clientAuto']");
				clientAuto.setRawValue('');
				me.selectedFilterClient = '';
				me.selectedFilterClientDesc = '';
				$(document).trigger('handleClientChangeInQuickFilter');
			},

			generateUrlWithFilterParams : function() {
				var me = this;
				var filterData = me.filterData;
				var strFilter = '';
				var strTemp = '';
				var isFilterApplied = false;
				var blnDtlFilterApplied = false;
				var strDetailUrl = '';
				if (!Ext.isEmpty(filterData)) {
					for (var index = 0; index < filterData.length; index++) {
						if (Ext
								.isEmpty(filterData[index].operatorValue)) {
							continue;
						}
						if (filterData[index].detailFilter
								&& filterData[index].detailFilter === 'Y') {
							if(blnDtlFilterApplied)
								strDetailUrl = strDetailUrl + ' and ';
						}else if (isFilterApplied) {
							strTemp = strTemp + ' and ';
						}
						switch (filterData[index].operatorValue) {
							case 'bt':

								if (filterData[index].dataType === 'D') {

									strTemp = strTemp
									+ filterData[index].paramName
									+ ' '
									+ filterData[index].operatorValue
									+ ' ' + 'date\''
									+ filterData[index].paramValue1
									+ '\'' + ' and ' + 'date\''
									+ filterData[index].paramValue2
									+ '\'';
								} else {
									strTemp = strTemp
									+ filterData[index].paramName
									+ ' '
									+ filterData[index].operatorValue
									+ ' ' + '\''
									+ filterData[index].paramValue1
									+ '\'' + ' and ' + '\''
									+ filterData[index].paramValue2
									+ '\'';
								}
								isFilterApplied = true;
								break;

							case 'in':
								var objValue = filterData[index].paramValue1;
								var objArray = objValue.split(',');
								if (objArray.length > 0
										&& objArray[0] != 'All') {
									/*if (isFilterApplied) {
										if (filterData[index].detailFilter
												&& filterData[index].detailFilter === 'Y') {
											strDetailUrl = strDetailUrl
											+ ' and ';
										} else {
											strTemp = strTemp;
										}
									} else {
										isFilterApplied = true;
									}*/

									if (filterData[index].detailFilter
											&& filterData[index].detailFilter === 'Y') {
										strDetailUrl = strDetailUrl + '(';
									} else {
										strTemp = strTemp + '(';
									}
									for (var i = 0; i < objArray.length; i++) {
										if (filterData[index].detailFilter
												&& filterData[index].detailFilter === 'Y') {
											strDetailUrl = strDetailUrl
											+ filterData[index].paramName
											+ ' eq ';
											strDetailUrl = strDetailUrl
											+ '\'' + objArray[i]
											+ '\'';
											if (i != objArray.length - 1) {
												strDetailUrl = strDetailUrl
												+ ' or ';
											}
										} else {
											strTemp = strTemp
											+ filterData[index].paramName
											+ ' eq ';
											strTemp = strTemp + '\''
											+ objArray[i] + '\'';
											if (i != objArray.length - 1) {
												strTemp = strTemp + ' or ';
											}
										}
									}
									if (filterData[index].detailFilter
											&& filterData[index].detailFilter === 'Y') {
										strDetailUrl = strDetailUrl + ')';
										blnDtlFilterApplied = true;
									} else {
										strTemp = strTemp + ')';
										isFilterApplied = true;
									}
								}
								break;
							case 'statusFilterOp':
								var objValue = filterData[index].paramValue1;
								var objArray = objValue.split(',');
								if (objArray.length >= 1) {
									strTemp = strTemp + '(';
								}
								for (var i = 0; i < objArray.length; i++) {
									strTemp = strTemp
									+ "(status eq '"
									+ objArray[i] + "')";
									if (i != (objArray.length - 1)) {
										strTemp = strTemp + ' or ';
									}

								}
								if (objArray.length >= 1) {
									strTemp = strTemp + ')';
									isFilterApplied = true;
								}
								break;
							default:
								// Default opertator is eq
								if (filterData[index].dataType === 'D') {

									strTemp = strTemp
									+ filterData[index].paramName
									+ ' '
									+ filterData[index].operatorValue
									+ ' ' + 'date\''
									+ filterData[index].paramValue1
									+ '\'';
									isFilterApplied = true;
								} else {
									if (filterData[index].detailFilter
											&& filterData[index].detailFilter === 'Y') {
										strDetailUrl = strDetailUrl
												+ filterData[index].paramName + ' '
												+ filterData[index].operatorValue + ' ' + '\''
												+ filterData[index].paramValue1 + '\'';
												blnDtlFilterApplied = true;
									} 
									else
									{
										strTemp = strTemp+ filterData[index].paramName+ ' '
										+ filterData[index].operatorValue+ ' ' + '\''
										+ filterData[index].paramValue1+ '\'';
										isFilterApplied = true;
									}
								}
							break;
						}
					}
				}
				if (isFilterApplied) {
					strFilter = '&$filter=' + strTemp;
				}
				if (blnDtlFilterApplied) {
					strFilter += "&$filterDetail=" + strDetailUrl;
				}
				return strFilter;
			},
			/* Page setting handling starts here */
			savePageSetting : function(arrPref, strInvokedFrom) {
				/*
				 * This will be get invoked from page level setting
				 * always
				 */
				var me = this, args = {};
				if (!Ext.isEmpty(arrPref)) {
					me.preferenceHandler.savePagePreferences(
							me.strPageName, arrPref,
							me.postHandleSavePageSetting, args, me,
							false);
				}
			},
			postHandleSavePageSetting : function(data, args, isSuccess) {
				var me = this, args = {};
				if (isSuccess === 'N') {
					me.showMessagePopup(getLabel('instrumentErrorPopUpTitle','Error'), getLabel('prfErrorMsg','Error while apply/restore setting'));
				} else {
					me.preferenceHandler.readPagePreferences(
							me.strPageName, me.updateObjSummaryPref,
							args, me, false);
				}
			},
			updateObjSummaryPref : function(data) {
				objInstrumentPrintingPref = Ext.encode(data);
			},
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

						strModule = strModule === 'all' ? groupInfo.groupTypeCode
								+ '-' + strModule
								: strModule;
						me.preferenceHandler.saveModulePreferences(
								me.strPageName, strModule, objPref,
								me.postHandlePageGridSetting, args, me,
								false);
					} else {
						me.handleClearLocalPrefernces();
						me.preferenceHandler.savePagePreferences(
								me.strPageName, arrPref,
								me.postHandlePageGridSetting, args, me,
								false);
					}
				}
			},
			restorePageSetting : function(arrPref, strInvokedFrom) {
				var me = this;
				if (strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
					var groupView = me.getGroupView(), subGroupInfo = groupView
					.getSubGroupInfo()
					|| {}, groupInfo = groupView.getGroupInfo()
					|| '{}', strModule = subGroupInfo.groupCode, args = {};

					strModule = strModule === 'all' ? groupInfo.groupTypeCode
							+ '-' + strModule
							: strModule;
					args['strInvokedFrom'] = strInvokedFrom;
					Ext.each(arrPref || [], function(pref) {
						if (pref.module === 'ColumnSetting') {
							pref.module = strModule;
							return false;
						}
					});
					me.preferenceHandler.clearPagePreferences(
							me.strPageName, arrPref,
							me.postHandleRestorePageSetting, args, me,
							false);
				} else {
					me.handleClearLocalPrefernces();
					me.preferenceHandler.clearPagePreferences(
							me.strPageName, arrPref,
							me.postHandleRestorePageSetting, null, me,
							false);
				}
			},

			postHandlePageGridSetting : function(data, args, isSuccess) {
				if (isSuccess === 'Y') {
					var me = this;
					if (args && args.strInvokedFrom === 'GRID'
						&& _charCaptureGridColumnSettingAt === 'L') {
						var objGroupView = me.getGroupView(), gridModel = null;
						if (args.objPref && args.objPref.gridCols) {
							gridModel = {
									columnModel : args.objPref.gridCols
							};
						}
						objGroupView.reconfigureGrid(gridModel);
					} else {
						window.location.reload();
					}
				} else {
					me.showMessagePopup(getLabel('instrumentErrorPopUpTitle','Error'), getLabel('prfErrorMsg','Error while apply/restore setting'));
				}
			},

			postHandleRestorePageSetting : function(data, args,
					isSuccess) {
				if (isSuccess === 'Y') {
					var me = this;
					if (args && args.strInvokedFrom === 'GRID'
						&& _charCaptureGridColumnSettingAt === 'L') {
						var objGroupView = me.getGroupView();
						if (objGroupView) {
							objGroupView.reconfigureGrid(null);
						}
					} else {
						window.location.reload();
					}
				} else {
					me.showMessagePopup(getLabel('instrumentErrorPopUpTitle','Error'), getLabel('errorMsg','Error while apply/restore setting'));
				}
			},
			showPageSettingPopup : function(strInvokedFrom) {
				var me = this, objData = {}, objGroupView = me
				.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
				var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

				me.pageSettingPopup = null;

				if (!Ext.isEmpty(objInstrumentPrintingPref)) {
					objPrefData = Ext.decode(objInstrumentPrintingPref);
					objGeneralSetting = objPrefData
					&& objPrefData.d.preferences
					&& objPrefData.d.preferences.GeneralSetting ? objPrefData.d.preferences.GeneralSetting
							: null;
					objGridSetting = objPrefData
					&& objPrefData.d.preferences
					&& objPrefData.d.preferences.GridSetting ? objPrefData.d.preferences.GridSetting
							: null;
					/**
					 * This default column setting can be taken from
					 * preferences/gridsets/user defined( js file)
					 */
					objColumnSetting = objPrefData
					&& objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
							: (INSTR_PRINT_COLUMNS || '[]');

					if (!Ext.isEmpty(objGeneralSetting)) {
						objGroupByVal = objGeneralSetting.defaultGroupByCode;
						objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
					}
					if (!Ext.isEmpty(objGridSetting)) {
						objGridSizeVal = objGridSetting.defaultGridSize;
						objRowPerPageVal = objGridSetting.defaultRowPerPage;
					}
				} else if (Ext.isEmpty(objInstrumentPrintingPref)) {
					objColumnSetting = INSTR_PRINT_COLUMNS;
				}

				objData['groupByData'] = objGroupView ? objGroupView.cfgGroupByData
						: [];
				objData['filterUrl'] = 'services/userfilterslist/instrumentPrinting.json';
				objData['rowPerPage'] = _AvailableGridSize;
				objData['groupByVal'] = objGroupByVal;
				objData['filterVal'] = objDefaultFilterVal;
				objData['gridSizeVal'] = objGridSizeVal;
				objData['rowPerPageVal'] = objRowPerPageVal;
				subGroupInfo = objGroupView.getSubGroupInfo() || {};
				strTitle = (strInvokedFrom === 'GRID' ? getLabel(
						'columnSettings', 'Column Settings')
						+ ' : ' + (subGroupInfo.groupDescription || '')
						: getLabel('Settings', 'Settings'));
				me.pageSettingPopup = Ext.create(
						'Ext.ux.gcp.PageSettingPopUp', {
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
			/* Page setting handling ends here */
			handleClearLocalPrefernces : function() {
				var me = this, args = {}, strLocalPrefPageName = me.strPageName
				+ '_TempPref';
				;

				me.preferenceHandler.clearPagePreferences(
						strLocalPrefPageName, null,
						me.postHandleClearLocalPreference, args, me,
						false);
			},
			postHandleClearLocalPreference : function(data, args,
					isSuccess) {
				var me = this, args = {};
				if (isSuccess === 'N') {
					me.showMessagePopup(getLabel('instrumentErrorPopUpTitle','Error'), getLabel('prfLocalErrorMsg','Error while clear local setting'));
				} else if (isSuccess === 'Y') {
					objSaveLocalStoragePref = '';
					me.objLocalData = '';
				}
			},
			handleSaveLocalStorage : function() {
				var me = this, arrSaveData = [], objSaveState = {}, objAdvJson = {}, objGroupView = me
				.getGroupView(), grid = objGroupView.getGrid(), subGroupInfo = null;
				if (objGroupView) {
					subGroupInfo = objGroupView.getSubGroupInfo();
				}
				if (!Ext.isEmpty(me.filterData)) {
					objAdvJson['filterBy'] = me.filterData;
					objSaveState['quickFilterJson'] = objAdvJson;
				}
				objSaveState['quickFilterJson'] = !Ext
				.isEmpty(me.filterData) ? me.filterData : {};
				objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
				objSaveState['pageSize'] = grid
				&& !Ext.isEmpty(grid.getPageSize()) ? grid
						.getPageSize() : null;
						objSaveState['pageNo'] = grid
						&& !Ext.isEmpty(grid.getCurrentPage()) ? grid
								.getCurrentPage() : 1;
								objSaveState['sorter'] = grid
								&& !Ext.isEmpty(grid.getSortState()) ? grid
										.getSortState() : [];

										arrSaveData.push({
											'module' : 'tempPref',
											'jsonPreferences' : objSaveState
										});

										me.saveLocalPref(arrSaveData);
			},
			saveLocalPref : function(objSaveState) {
				var me = this, args = {}, strLocalPrefPageName = me.strPageName
				+ '_TempPref';
				if (!Ext.isEmpty(objSaveState)) {
					args['tempPref'] = objSaveState;
					me.preferenceHandler
					.savePagePreferences(strLocalPrefPageName,
							objSaveState,
							me.postHandleSaveLocalPref, args,
							me, false);
				}
			},
			postHandleSaveLocalPref : function(data, args, isSuccess) {
				var me = this;
				var objLocalPref = {}, objTemp = {}, objTempPref = {}, jsonSaved = {};
				if (isSuccess === 'N') {
					me.showMessagePopup(getLabel('instrumentErrorPopUpTitle','Error'), getLabel('prfErrorMsg','Error while apply/restore setting'));
				} else {
					if (!Ext.isEmpty(args)) {
						jsonSaved = args && args.tempPref
						&& args.tempPref[0]
						&& args.tempPref[0].jsonPreferences ? args.tempPref[0].jsonPreferences
								: {};
								objTemp['tempPref'] = jsonSaved;
								objTempPref['preferences'] = objTemp;
								objLocalPref['d'] = objTempPref;

								me.updateObjLocalPref(objLocalPref);
					}
				}
			},
			updateObjLocalPref : function(data) {
				var me = this;
				objSaveLocalStoragePref = Ext.encode(data);
				me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			},
			setFilterRetainedValues : function() {
				var me = this;
				var filterView = me.getFilterView();
				if(!Ext.isEmpty(filterView)){

					/*var pdfFile = filterView.down("textfield[itemId='pdfFileNameText']");
					pdfFile.setValue(me.filterPdfFileName);*/

					var beneAutocompleter = filterView.down('AutoCompleter[itemId="beneAutocompleter"]');
					beneAutocompleter.setValue(me.filterBeneDesc);
					
					var debitAccountAutocompleter = filterView.down('AutoCompleter[itemId="debitAccountAutocompleter"]');
					debitAccountAutocompleter.setValue(me.filterDebitAccountDesc);

					var payRef = filterView.down("textfield[itemId='payRefText']");
					payRef.setValue(me.filterPayRefDesc);
				}
			},
			loadInstrPrintDtlViewSmartGrid : function(record) {
				var me = this;
				if (Ext.isEmpty(me.objInstrPrintDtlViewPopup)) {
					me.objInstrPrintDtlViewPopup = Ext.create('GCP.view.InstrumentPrintingDetailViewPanel',
							{
						parentRecord : record,
						renderTo : 'instPrintViewGridList'
							});
				}else {
					//Set currently selected record to pop-up & reset the grid
					me.objInstrPrintDtlViewPopup.parentRecord = record;
					me.resetSmartGrid(me.getInstrPrintDtlGrid());
				}
			},
			loadLotInfoSmartGrid : function(record){
				var me = this;
				if (Ext.isEmpty(me.objInstrPrintLotInfoPanel)) {
					me.objInstrPrintLotInfoPanel = Ext.create('GCP.view.InstrumentPrintingLotInfoPanel',
							{
						parentRecord : record,
						renderTo : 'instPrintlotInfoGridList'
							});
				}else {
					me.objInstrPrintLotInfoPanel.parentRecord = record;
					me.resetSmartGrid(me.getInstrPrintLotInfoGrid());
				}
			},
			resetSmartGrid : function(dtlGrid)
			{
				if(dtlGrid){
					dtlGrid.store.sorters.clear();
					dtlGrid.down('toolbar[xtype="smartGridPager"]').moveFirst();
				}
			},
			showMessagePopup : function(popupTitle, message)
			{
				Ext.MessageBox.show({
					title : popupTitle,
					msg : message,
					buttons : Ext.MessageBox.OK,
					cls : 'ux_popup',
					icon : Ext.MessageBox.ERROR
				});
			},
			downloadReport : function(actionName,type) {
				var me = this;
				var withHeaderFlag = document.getElementById('headerCheckbox').checked;
				var arrExtension = {
						downloadXls : 'xls',
						downloadCsv : 'csv',
						downloadPdf : 'pdf',
						downloadTsv : 'tsv'
				};
				var currentPage = 1;
				var strExtension = '', strUrl = '', strSelect = '', strOrderBy = '',visColsStr = '',clientId = '';

				var grid = null, objOfSelectedGridRecord = null, objOfGridSelected = null,colArray = null;
				var objGroupView = me.getGroupView();
				var arrSelectedrecordsId = [];
				var visColsStr = '';
				strExtension = arrExtension[actionName];
				strUrl = 'services/generateInstrumentPrintingListReport.' + strExtension;
				strUrl += '?$skip=1';
				strUrl +='&$reportType='+type;
				if (type === 'lotInfo') {
					withHeaderFlag  = document.getElementById('headerLotInfoCheckbox').checked;
					grid = me.getInstrPrintLotInfoGrid();
					if(grid && me.getInstrPrintLotInfoPanel()){
						strOrderBy = me.getInstrPrintLotInfoPanel().reportGridOrder;
						if (arrAvailableLotInfoGridColumn && arrAvailableLotInfoGridColumn.length > 0) {
							strSelect = '&$select=[' + arrAvailableLotInfoGridColumn.toString() + ']';
						}
						arrSelectedrecordsId.push(me.getInstrPrintLotInfoPanel().productId);
						clientId = me.getInstrPrintLotInfoPanel().clientId;
						var viscols = grid.getAllVisibleColumns();
						colArray = sortVisibleColumns(arrSortColumnLotInfoReport,viscols);
					}
				} else if (type === 'detailView') {
					withHeaderFlag  = document.getElementById('headerViewCheckbox').checked;
					grid = me.getInstrPrintDtlGrid();
					strOrderBy = me.getInstrPrintDtlPanel().reportGridOrder;
					if (arrAvailableDetailViewGridColumn && arrAvailableDetailViewGridColumn.length > 0) {
						strSelect = '&$select=[' + arrAvailableDetailViewGridColumn.toString() + ']';
					}
					if (!Ext.isEmpty(grid)) {
						var record = grid.getStore().getAt(0);
						if(!Ext.isEmpty(record)){
							arrSelectedrecordsId.push(record.data.printNmbr);
						}

						var viscols = grid.getAllVisibleColumns();
						colArray = sortVisibleColumns(arrSortColumnDetailViewReport,viscols);
					}
				}
				else {
					if (!Ext.isEmpty(objGroupView)){
						grid = objGroupView.getGrid();
					}
					if (!Ext.isEmpty(grid)) {
						var objOfRecords = grid.getSelectedRecords();
						if (!Ext.isEmpty(objOfRecords)) {
							objOfGridSelected = grid;
							objOfSelectedGridRecord = objOfRecords;
						}
					}
					if ((!Ext.isEmpty(objOfGridSelected)) && (!Ext.isEmpty(objOfSelectedGridRecord))) {
						for (var i = 0; i < objOfSelectedGridRecord.length; i++) {
							arrSelectedrecordsId.push(objOfSelectedGridRecord[i].data.identifier);
						}
					}
					var objGroupView = me.getGroupView();
					var groupInfo = objGroupView.getGroupInfo();
					var subGroupInfo = objGroupView.getSubGroupInfo();
					strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
					strOrderBy = me.reportGridOrder;

					var objGroupView = me.getGroupView();

					if (!Ext.isEmpty(objGroupView)) {
						if (!Ext.isEmpty(objGroupView)) {
							grid = objGroupView.getGrid();
						}
						if (arrAvailableGridColumn && arrAvailableGridColumn.length > 0) {
							strSelect = '&$select=[' + arrAvailableGridColumn.toString() + ']';
						}
						if (!Ext.isEmpty(grid)) {
							var viscols = grid.getAllVisibleColumns();
							colArray = sortVisibleColumns(arrSortColumnReport,viscols);
						}
					}
				}
				if(colArray != null){
					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}
				strUrl = strUrl + strSelect;

				if (!Ext.isEmpty(strOrderBy)) {
					var orderIndex = strOrderBy.indexOf('orderby');
					if (orderIndex > 0) {
						strOrderBy = strOrderBy.substring(orderIndex, strOrderBy.length);
						var indexOfamp = strOrderBy.indexOf('&$');
						if (indexOfamp > 0){
							strOrderBy = strOrderBy.substring(0, indexOfamp);
						}
						strUrl += '&$' + strOrderBy;
					}
				}

				var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
				while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
				strUrl = strUrl.substring(0, strUrl.indexOf('?'));

				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';

				Object.keys(objParam).map(function(key) {
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', key, objParam[key]));
				});

				form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent', currentPage));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'visColsStr', visColsStr));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag));
				for (var i = 0; i < arrSelectedrecordsId.length; i++) {
					if(type === 'lotInfo' || type === 'detailView'){
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientId', clientId));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'recordId', arrSelectedrecordsId[i]));
					}
					else{
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier', arrSelectedrecordsId[i]));
					}
				}
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
			}
		});

function sortVisibleColumns(arrSortColumnReport,viscols){
	var col = null;
	var colMap = null,colArray=null;
	if(!Ext.isEmpty(arrSortColumnReport)){
		colArray=[];
		colMap = new Object();
		for (var j = 0; j < viscols.length; j++) {
			col = viscols[j];
			if (col.dataIndex && arrSortColumnReport[col.dataIndex]) {
				if (colMap[arrSortColumnReport[col.dataIndex]]) {
					// ; do nothing
				}
				else {
					colMap[arrSortColumnReport[col.dataIndex]] = 1;
					colArray.push(arrSortColumnReport[col.dataIndex]);
				}
			}
		}
	}
	if (colMap != null) {
		return colArray;
	}else{
		return null;
	}
}