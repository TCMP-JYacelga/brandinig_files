/**
 * @class GCP.controller.AccountBalancesController
 * @extends Ext.app.Controller
 * @author Shraddha Chauhan
 */
Ext.define('GCP.controller.AccountBalancesController', {
	extend : 'Ext.app.Controller',
	xtype : 'accountBalancesController',
	requires : ['GCP.view.AccountCenter','Ext.ux.gcp.PageSettingPopUp',
			'GCP.view.balances.AccountBalancesFilterView',
			'GCP.view.common.SummaryRibbonView',
			'GCP.view.balances.AccountBalancesGraphView',
			'GCP.view.balances.AccountBalancesView',
			'GCP.view.balances.popup.AccountBalancesAdditioalInfoPopUp',
			'Ext.ux.gcp.DateUtil'],
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp[itemId="balanceSetting"]'
			},{
				ref : 'typeCodeSettingPopUp',
				selector : 'summaryTypeCodeSettingPopup[itemId="summaryDialog"]'
			},
			{
				ref : 'accountCenter',
				selector : 'accountCenter'
			}, {
				ref : 'accountBalancesView',
				selector : 'accountBalancesView'
			}, {
				ref : 'accountBalancesGraphView',
				selector : 'accountBalancesGraphView'
			}, {
				ref : 'summaryInfoView',
				selector : 'accountBalancesView summaryRibbonView'
			}, {
				ref : 'genericFilterView',
				selector : 'accountBalancesView filterView'
			},{
				ref : 'groupView',
				selector : 'accountBalancesView groupView'
			}, {
				ref : 'filterView',
				selector : 'accountBalancesFilterView'
			}, {
				ref : 'fromDateLabel',
				selector : 'accountBalancesFilterView label[itemId="dateFilterFrom"]'
			}, {
				ref : 'toDateLabel',
				selector : 'accountBalancesFilterView label[itemId="dateFilterTo"]'
			}, {
				ref : 'dateRangeComponent',
				selector : 'accountBalancesFilterView container[itemId="dateRangeComponent"]'
			}, {
				ref : 'graphPanel',
				selector : 'accountBalancesView panel[itemId="historyGraphPanel"]'
			},  {
				ref : 'dateLabel',
				selector : 'accountBalancesFilterView label[itemId="dateLabel"]'
			}, {
				ref : 'selectDateButton',
				selector : 'accountBalancesFilterView button[itemId="postingDate"]'
			}, {
				ref : 'fromEntryDate',
				selector : 'accountBalancesFilterView datefield[itemId="fromDate"]'
			}, {
				ref : 'toEntryDate',
				selector : 'accountBalancesFilterView datefield[itemId="toDate"]'
			}, {
				ref : 'withHeaderReportCheckbox',
				selector : 'accountBalancesView accountBalancesTitleView menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'balancesGrid',
				selector : 'accountBalancesView smartgrid'
			}, {
				ref : 'btnSavePreferences',
				selector : 'accountBalancesView accountBalancesFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : 'accountBalancesView accountBalancesFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'infoAllBtn',
				selector : 'accountBalancesFilterView label[itemId="infoAllBtn"]'
			},{
				ref : 'infoNewBtn',
				selector : 'accountBalancesFilterView label[itemId="infoNewBtn"]'
			}],
	config : {
		dateFilter : null,
		dateFilterVal : '1',
		dateRangeFilterVal : '13',
		dateFilterLabel : 'Today',
		dateHandler : null,
		dateFilterFromVal : '',
		dateFilterToVal : '',
		accountFilter : '',
		typeCodePopup : null,
		equiCcy : strSellerCcy,
		equiCcySymbol : strSellerCcySymbol,
		strIntraDaySummaryRibbonUrl : 'services/balancesummary/intraday/summarytypecodes',
		strPreviousDaySummaryRibbonUrl : 'services/balancesummary/previousday/summarytypecodes',
		customizePopup : null,
		additionalInfoPopup : null,
		currentAccountNumber : null,
		typeCodeColumns : [],
		datePickerSelectedDate : [],
		pageKey : 'btrHistoryViewPref',
		accountCalDate : null,
		preferenceHandler : null,
		strPageName : strBalancePageName,
		objBalancesGridPref : null,
		selectedAccCcy : null,
		graphPanelPref:null,
		selectedAccSymbol : null,
		strServiceType : mapService['BR_STD_BAL_GRID'],
		strServiceParam : null,
		defaultTypecode : '703',
		selectedTypecode : '',
		strRibbonPageName : strBalHistoryRibbonPageName,
		firstLoad : false
	},
	init : function() {
		var me = this;
		me.firstLoad = true;
		me.updateFilterConfig();
		me.createPopUps();
		me.selectedTypecode = me.defaultTypecode;
		$(document).on('graphDivClicked',function() {		
			if(!$('#graghSummaryId').hasClass('ft-accordion-collapsed')){
				if(!Ext.isEmpty(accountGraphView))
					accountGraphView.doLayout();
			}				
		});
		$(document).on('performPageSettingsBalance', function(event) {
					me.showPageSettingPopup('PAGE');
		});
		$(document).on('dateChangeBal', function(event, filterType, btn, opts) {
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			me.disablePreferencesButton("savePrefMenuBtn", false);
			me.disablePreferencesButton("clearPrefMenuBtn", false);
			if (btn.btnValue !== '7') {
				me.setDataForFilter();
				me.applyQuickFilter();
				//me.toggleSavePrefrenceAction(true);
			}
		});
		$(document).on('performBackBalance', function(event) {
					me.doHandleBackAction(me);
		});
		GCP.getApplication().on({
			showBalances : function(record, strSummaryType, prevdateFilterVal) {
				me.strServiceParam = record.data.subFacilityCode;
				$('#intraPrevDisclaimerText').addClass('ui-helper-hidden');
				$('#brsummarybackdiv').show();
				if( summaryType == 'intraday')
				{
					$('#brsummraytitle').html(getLabel('intradayBalanceHistoryTitle', 'Account / Account Summary / Intraday / Balance History'));
				}
				else
				{
					$('#brsummraytitle').html(getLabel('previousdayBalanceHistoryTitle', 'Account / Account Summary / Previous day / Balance History'));
				}
				isActivityOn = false;
				isBalanceOn = true;
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePref, null, me, true);				
				var	args = {
						'module' : 'panels'
					};
				me.preferenceHandler.readModulePreferences(me.strPageName,
							'panels', me.postReadPanelPrefrences, args, me, true);			
				/*
				 * var strAppDate = dtSellerDate; var dtFormat =
				 * strExtApplicationDateFormat; var date = new
				 * Date(Ext.Date.parse(strAppDate, dtFormat)); var filterDate =
				 * new Date(Ext.Date.parse( record.data.summaryISODate,
				 * 'Y-m-d')); var fieldValue1 = Ext.Date.format(date, dtFormat);
				 * var fieldValue2 = Ext.Date.format(filterDate, dtFormat); if
				 * (fieldValue1 === fieldValue2) { me.dateFilterVal = '1'; }
				 * else { me.dateFilterVal = '2'; }
				 */
				//me.dateFilterVal = defaultDateIndex;
				if(summaryType == 'previousday' && me.strPageName== 'btrBalancePreviousday' )
				{
					me.dateFilterVal = prevdateFilterVal;
					me.dateFilterLabel = me.getDateDropDownLabel(me.dateFilterVal);
				}
				else{
					me.dateFilterVal = defaultDateIndex;
					me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
				}
				me.accountFilter = record.data.accountId;
				me.currentAccountNumber = record.data.accountNumber;
				me.selectedAccCcy = record.data.currencyCode;
				me.selectedAccCcySymbol = record.data.currencySymbol;
				me.equiCcy = record.data.currencyCode;
				me.equiCcySymbol = record.data.currencySymbol;
				me.accountCalDate = record.data.accountCalDate;
				me.strServiceParam = record.data.subFacilityCode;
				//me.dateFilterLabel = me.getDateDropDownLabel(me.dateFilterVal);
				//me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
				//me.handleDateChange(me.dateFilterVal);
				
				if ($('#graphBar').hasClass('ui-helper-hidden'))
				{
					var blnIsGraphHidden = objClientParameters['enableGraph'] == true
					? false
					: true;
					if (blnIsGraphHidden === false)
					{
						$('#graphBar').removeClass('ui-helper-hidden');
						$('#graghSummaryId').removeClass("ft-accordion-collapsed");
						me.loadBalanceGraph();
						if(me.graphPanelPref==true){
						 $('#graghSummaryId').addClass("ft-accordion-collapsed");
						}
					}
				}
				if(summaryType == 'previousday' && brPrvSumLoad)
				{
					if(!Ext.isEmpty(record.get('preSumFromDate')) && !Ext.isEmpty(record.get('preSumToDate')))
					{
						me.summaryISODate1 = record.get('preSumFromDate');
						me.summaryISODate2 = record.get('preSumToDate');
					}
					//me.dateFilterVal = '13';
					//me.dateFilterLabel = getLabel('daterange', 'Date Range');
					me.dateFilterVal = prevdateFilterVal;
					me.dateFilterLabel = me.getDateDropDownLabel(me.dateFilterVal);
					var datePickerRef=$('#postingDataPicker');
					if (me.summaryISODate1 && me.summaryISODate2) {
						vFromDate = me.summaryISODate1;
						vToDate = me.summaryISODate2;
						datePickerRef.setDateRangePickerValue([
								vFromDate, vToDate]);
						me.datePickerSelectedDate =	[vFromDate, vToDate];	
					}
					me.setDataForFilter();
				}				
				var container = me.getAccountCenter();
				if (!Ext.isEmpty(container)) {
					var balancesVeiw = Ext.create(
							'GCP.view.balances.AccountBalancesView', {
								accountFilter : me.accountFilter,
								gridModel : me.getGridModel()
							});
					container.updateView(balancesVeiw);
					container.setActiveCard(1);
				}
				
				$('#accBalLink').click(function(){
					me.destroyFilterView();
					if(!Ext.isEmpty(me.getAccountBalancesGraphView()))
						me.getAccountBalancesGraphView().destroy();
					GCP.getApplication().fireEvent('showSummary');
				});
//Reports & Download dropdown code for balance	
				me.balanceDownloadOptions();
					
				var objJsonData='', objLocalJsonData='';
				var fieldName = '';
				var fieldVal = '';
				var fieldSecondVal = '';
				var index = '';
				if(summaryType != 'previousday' && me.strPageName != 'btrBalancePreviousday' )
				{
					if (objActivityPref || objSaveBalancesLocalStoragePref) {
						objJsonData = Ext.decode(objActivityPref);
						objLocalJsonData = Ext.decode(objSaveBalancesLocalStoragePref); 
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
							if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
									var localPref =  objLocalJsonData.d.preferences.tempPref.quickFilterJson;
									for (i = 0; i < localPref.length; i++) {
												fieldName = localPref[i].paramName;
												fieldVal = localPref[i].paramValue1;
												fieldSecondVal = localPref[i].paramValue2;
												index = localPref[i].dtIndex;
												if (fieldName === 'EntryDate') {
													me.dateFilterVal = index;
													
													var objDateLbl = {
														'' : getLabel('latest', 'Latest'),
														'2':getLabel('yesterday', 'Yesterday'),
														'3' : getLabel('thisweek', 'This Week'),
														'4' : getLabel('lastweektodate', 'Last Week To Date'),
														'5' : getLabel('thismonth', 'This Month'),
														'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
														'8' : getLabel('thisquarter', 'This Quarter'),
														'9' : getLabel('lastQuarterToDate','Last Quarter To Date'),
														'10':getLabel('accsummary.thisyear', 'This Year'),
														'11':getLabel('lastyeartodate',	'Last Year to date'),
														'12' : getLabel('latest', 'Latest'),
														'13' : getLabel('daterange', 'Date Range'),
														'14':getLabel('lastmonthonly', 'Last Month Only')
													}; 
												
													me.datePickerSelectedDate[0] = fieldVal;
													me.datePickerSelectedDate[1] = fieldSecondVal;
													for (j = 1; j < 15; j++) {
														if (j == index) {
															me.dateFilterLabel = objDateLbl[j];
															
															break;
														}
													} 
												}
											}
								}
							}
					}
				}
			}				
				me.handleDateChange(me.dateFilterVal);
				
			},
			'balanceSavePreference' : function() {
				me.handleSavePreferences();
			},
			'balanceClearPreference' : function() {
				me.handleClearPreferences();
			},
			'balanceHandleClearSettings' : function() {
				me.handleClearSettings();
			}			
		});
		me.control(
			{
			'pageSettingPopUp[itemId="balanceSetting"]' : {
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
			/*Balance summary information pop up starts here*/
			'summaryTypeCodeSettingPopup[itemId="balanceDialog"]' : {
				'applyPageSetting' : function(popup, data,strInvokedFrom) {
					me.applySummaryTypeCodePageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.saveSummaryTypeCodePageSetting(data,strInvokedFrom);
				},
				'restorePageSetting' : function(popup,data,strInvokedFrom) {
					me.restoreSummaryTypeCodePageSetting(data,strInvokedFrom);
				}
			},
			'ribbonView[itemId="summaryCarousalBalance"]' : {
				'ribbonSettingClick' : function() {
					me.showRibbonSetting();
				},
				'afterrender' : function() {
					var generalSettings =  objAccHistoryTypeCodePopupPref 
										&& Ext.decode(objAccHistoryTypeCodePopupPref).d.preferences
										&& Ext.decode(objAccHistoryTypeCodePopupPref).d.preferences.GeneralSetting
										? Ext.decode(objAccHistoryTypeCodePopupPref).d.preferences.GeneralSetting
										: '';
										
					var currencyDesc =  generalSettings && generalSettings.defaultCcyDesc 
									  ? generalSettings.defaultCcyDesc  : me.equiCcy;
										  
					var currencyCode = generalSettings && generalSettings.defaultCcyCode 	
					  				 ? generalSettings.defaultCcyCode  : me.equiCcy;
					 
					var currencySymbol = generalSettings && generalSettings.defaultCcySymbol 	
					  				 ? generalSettings.defaultCcySymbol  : me.equiCcySymbol;  				 
					  				 
					  					 
					  if(objClientParameters.enableEqvCcy){
							 me.doHandleCurrencyChange(currencyCode, currencySymbol);
					  }
						
					if(!Ext.isEmpty(currencyCode) && !Ext.isEmpty(equivalentCCY))
						$('#summaryCarousal_SPAN').text(' in ' + currencyCode);
				},
				'expand' : function(panel) {
					afterCreateCarouselReq();
					panel.doLayout();
				}
			},
			
			
			/*Balance summary information pop up ends here*/
			
			
			
			'accountBalancesView' : {
				'render' : function() {	
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
				//	me.populateSummaryAccountInfo();
					me.handleSummaryInformationRender();
					me.populateBalanceGraphTypecodeInfo();
				},
				'afterrender' : function() {
					objFilterPanelView = me.getAccountBalancesView();
				}
			},
			'accountBalancesView groupView' : {
				'groupTabChange' : function(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard) {
						me.doHandleGroupTabChange(groupInfo, subGroupInfo,
								tabPanel, newCard, oldCard);

					},
				'gridRender' : me.handleLoadGridData,
				'gridPageChange' : me.handleLoadGridData,
				'gridSortChange' : me.handleLoadGridData,
				'gridRowSelectionChange' : function(grid, record, recordIndex,
						records, jsonData) {
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowIconClick(grid, rowIndex, columnIndex,
							actionName, record);
				},
				'gridStateChange' : function(grid) {
				//	me.toggleSavePrefrenceAction(true);
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
				},
				'gridPageSizeChange' :me.handleLoadGridData,
				'showActivityPage' : function(record, summaryType) {
					me.showActivityPage(record, summaryType);
				}

			},
			'accountBalancesView summaryRibbonView' : {
				'render' : function(panel) {
					//me.handleSummaryInformationRender(panel);
				},
				'saveSummaryTypeCodes' : function(arrTypeCodes) {
					me.doSaveSummaryTypeCodes(arrTypeCodes);
				},
				'accountChange' : function(btn) {
					me.doHandleAccountChange(btn);
				}
			},
			'accountBalancesView ribbonView' : {
				'expand' : function(panel) {
					afterCreateCarouselReq('summaryCarousalBalanceTargetDiv');
					panel.doLayout();
				}
			},
			'accountBalancesFilterView' : {
				'render' : function(panel) {					
					//var filterView = me.getFilterView();
					//filterView.handleInfoToolTip();
				},
				'beforerender' : function() {
					var filterViewRef = me.getFilterView().up('filterView');
					var createAdvanceFilterLabel = filterViewRef
							.down('label[itemId="createAdvanceFilterLabel"]');
					if (!Ext.isEmpty(createAdvanceFilterLabel)) {
						createAdvanceFilterLabel.hide();
					}
					
					var useSettingsButton = filterViewRef
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				'afterrender' : function(panel, opts) {
					me.handleDateChange(me.dateFilterVal);
					me.handleSummaryTypeChange(me.summaryType);
					me.loadBalancesGraph(me.defaultTypecode);
				},
				'dateChangeBal' : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
					if (btn.btnValue !== '7') {
						me.setDataForFilter();
						me.applyQuickFilter();
						//me.toggleSavePrefrenceAction(true);
					}
				}				
			},
			'accountBalancesView accountBalancesTitleView' : {
				'performReportAction' : function(btn, opts) {
					me.downloadReport(btn.itemId);
					$('.ft-dropdown-menu').hide();
				}
			},			
			'tooltip[itemId="balancesInfoToolTip"]' : {
				'beforeshow' : function(tip) {
					me.setInfoToolTipVal(tip);
				}
			},
			'accountBalancesFilterView component[itemId="postingDate"]' : {
				render : function() {
					$('#postingDataPicker').datepick({
								monthsToShow : 1,
								changeMonth : false,
								dateFormat : strjQueryDatePickerDateFormat,
								rangeSeparator : '  to  ',
								maxDate : me.getBalanceHistoryDate(dtSellerDate),
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										var strSqlDateFormat = 'Y-m-d';
										me.datePickerSelectedDate[0] = Ext.Date.format(dates[0],strSqlDateFormat);
										me.datePickerSelectedDate[1] = Ext.Date.format(dates[1],strSqlDateFormat);
										me.dateFilterVal = me.dateRangeFilterVal;
										me.dateFilterLabel = getLabel('daterange', 'Date Range');
										me.handleDateChange(me.dateRangeFilterVal);
										me.setDataForFilter();
										me.applyQuickFilter();
										me.disablePreferencesButton("savePrefMenuBtn", false);
										me.disablePreferencesButton("clearPrefMenuBtn", false);
									//	me.toggleSavePrefrenceAction(true);
									}
								}
					});
				}
			},
			'accountBalancesFilterView label[itemId="infoAllBtn"]' : {
				'click' : function(btn) {
					var latestBtn = me.getInfoNewBtn();
					latestBtn.removeCls('ui-datepicker-header');
					btn.addCls('ui-datepicker-header');	
					me.handleInformationFilterChange('all');					
				}
			},
			'accountBalancesFilterView label[itemId="infoNewBtn"]' : {
				'click' : function(btn) {					
					var allBtn = me.getInfoAllBtn();
					allBtn.removeCls('ui-datepicker-header');
					btn.addCls('ui-datepicker-header');	
					me.handleInformationFilterChange('latest');
				}
			},
			'accountBalancesGraphView' : {
				'render' : function(panel) {
					me.loadBalancesGraph(me.defaultTypecode);
				}
			},
			'accountBalancesFilterView' : {
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			}
		});
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objBalanceView = me.getAccountBalancesView(), gridModel = null, objData = null;
		var colModel = null, arrCols = null;
		if (data && data.preference)
			objData = Ext.JSON.decode(data.preference)
		if (_charCaptureGridColumnSettingAt === 'L' && objData
				&& objData.gridCols) {
			arrCols = objData.gridCols;
			colModel = objBalanceView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel
				}
			}
		}
		// TODO : Preferences and existing column model need to be merged
		objGroupView.reconfigureGrid(gridModel);
	},
	
	/* Balalnce summary ribbon info setting popup statrs here*/
	showRibbonSetting : function() {
		var me=this;
		var objTypeCodePrf = Ext.decode(objAccHistoryTypeCodePopupPref);
		var objTypecodeColumnSetting = objTypeCodePrf && objTypeCodePrf.d.preferences
					&& objTypeCodePrf.d.preferences.ColumnSetting
					&& objTypeCodePrf.d.preferences.ColumnSetting.gridCols
					? me.getJsonObj(objTypeCodePrf.d.preferences.ColumnSetting.gridCols)
					: Ext.decode(me.getJsonObj(arrBalanceRibbonColumnModel) || '[]');
		me.typeCodeSettingsPopup = Ext.create(
				'GCP.view.common.SummaryTypeCodeSettingPopup',
				{
					itemId : 'balanceDialog',
					cfgDefaultColumnModel : objTypecodeColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgPopUpData : {
						currencyUrl : 'services/userseek/eqvcurrency.json?$top=-1',
						cfgData : Ext.decode(objAccHistoryTypeCodePopupPref),
						selectedAccCcy : me.equiCcy
					}
				});
		me.typeCodeSettingsPopup.show();
		me.typeCodeSettingsPopup.center();
	},
	
	/* Balalnce summary ribbon info setting popup statrs here*/
	
	/* Page setting handling starts here */
	savePageSetting : function(arrPref, strInvokedFrom) {
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
				title : getLabel('errorPopUpTitle', 'Error'),
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
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
	//History ribbon popup starts
	applySummaryTypeCodePageSetting : function(arrPref, strInvokedFrom) {
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
				me.preferenceHandler.saveModulePreferences(strRibbonPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				var tmpPref = {};
				tmpPref.d = {};
				tmpPref.d.preferences = {};
				tmpPref.d.preferences.ColumnSetting = {};
				tmpPref.d.preferences.GeneralSetting = {};
				Ext.each(arrPref || [], function(pref) {
							if (pref.module === 'ColumnSetting') {
								tmpPref.d.preferences.ColumnSetting = pref.jsonPreferences;
							}
							if (pref.module === 'GeneralSetting') {
								tmpPref.d.preferences.GeneralSetting = pref.jsonPreferences;
							}
						});
				args['objPref'] = tmpPref;
				me.preferenceHandler.savePagePreferences(strRibbonPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
	restoreSummaryTypeCodePageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
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
			me.preferenceHandler.clearPagePreferences(strRibbonPageName, arrPref,
					me.postHandlePageGridSetting, args, me, false);
		} else{
			var tmpPref = {};
			tmpPref.d = {};
			tmpPref.d.preferences = {};
			tmpPref.d.preferences.ColumnSetting = {};
			tmpPref.d.preferences.GeneralSetting = {};
			Ext.each(arrPref || [], function(pref) {
						if (pref.module === 'ColumnSetting') {
							tmpPref.d.preferences.ColumnSetting = pref.jsonPreferences;
						}
						if (pref.module === 'GeneralSetting') {
							tmpPref.d.preferences.GeneralSetting = pref.jsonPreferences;
						}
					});
			args['objPref'] = tmpPref;
			me.preferenceHandler.clearPagePreferences(strRibbonPageName, arrPref,
					me.postHandlePageGridSetting, args, me, false);
		}
	},
	saveSummaryTypeCodePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from summary ribbon page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			var tmpPref = {};
			tmpPref.d = {};
			tmpPref.d.preferences = {};
			tmpPref.d.preferences.ColumnSetting = {};
			tmpPref.d.preferences.GeneralSetting = {};
			Ext.each(arrPref || [], function(pref) {
						if (pref.module === 'ColumnSetting') {
							tmpPref.d.preferences.ColumnSetting = pref.jsonPreferences;
						}
						if (pref.module === 'GeneralSetting') {
							tmpPref.d.preferences.GeneralSetting = pref.jsonPreferences;
						}
					});
			args['objPref'] = tmpPref;
			me.preferenceHandler.savePagePreferences(strRibbonPageName, arrPref,
					me.postHandleSummaryTypeCodeSavePageSetting, args, me, false);
		}
	},
	postHandleSummaryTypeCodeSavePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('errorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while Save setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else
		{
			var me = this;
			me.preferenceHandler.readPagePreferences(strRibbonPageName,
						me.postDoHandleSaveRibbonPagePref, null, me, true);
		}
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
			{
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);
				objAccHistoryTypeCodePopupPref = JSON.stringify(args['objPref']);
				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getAccountBalancesView()) {
					objGroupView =me.getAccountBalancesView().createGroupView();
					me.getAccountBalancesView().add(objGroupView);		
				}
			}
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
	
	//History ribboon popup ends
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
		} else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
		}
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			var objGroupView = me.getGroupView();
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				 var gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = {
						columnModel : args.objPref.gridCols
					}
				// TODO : Preferences and existing column model need to be
				// merged
				objGroupView.reconfigureGrid(gridModel);
			} else {
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);
				objAccHistoryTypeCodePopupPref = JSON.stringify(args['objPref']);
				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getAccountBalancesView()) {
					objGroupView =me.getAccountBalancesView().createGroupView();
					me.getAccountBalancesView().add(objGroupView);
				}
				//window.location.reload();
			}
				
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
			var objGroupView = me.getGroupView();
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} else
			{
				//window.location.reload();
				me.preferenceHandler.readPagePreferences(me.strPageName,
						me.postDoHandleReadPagePrefNew, null, me, true);

				if (objGroupView)
					objGroupView.destroy(true);
				if (me.getAccountBalancesView()) {
					objGroupView =me.getAccountBalancesView().createGroupView();
					me.getAccountBalancesView().add(objGroupView);
				}
			}
				
		} else {
			Ext.MessageBox.show({
				title : getLabel('errorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	getJsonObj : function(jsonObject) {
        var jsonObj ='';
        if(jsonObject  instanceof Object ==false)
               jsonObj =JSON.parse(jsonObject);
        if(jsonObject  instanceof Array)
               jsonObj =jsonObject;
        for (var i = 0; i < jsonObj.length; i++) {
               jsonObj[i].colDesc =  getLabel(jsonObj[i].colId,jsonObj[i].colDesc);
               jsonObj[i].colHeader =  getLabel(jsonObj[i].colId,jsonObj[i].colHeader);;
        }
        if(jsonObject  instanceof Object ==false)
               jsonObj = JSON.stringify(jsonObj)
        return jsonObj;
	 },
	 getTypeCodeJsonObj : function(jsonObject) {
			var jsonObj ='';
			if(jsonObject  instanceof Object ==false)
				jsonObj =JSON.parse(jsonObject);
			if(jsonObject  instanceof Array)
				jsonObj =jsonObject;
			for (var i = 0; i < jsonObj.length; i++) {
				jsonObj[i].typeCodeDescription =  getLabel(jsonObj[i].typeCode,jsonObj[i].typeCodeDescription);
			}
			if(jsonObject  instanceof Object ==false)
				jsonObj = JSON.stringify(jsonObj)
			return jsonObj;
		},
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
		
		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objHistoryPref)) {
			objPrefData = Ext.decode(objHistoryPref);
			objGeneralSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GeneralSetting
					? objPrefData.d.preferences.GeneralSetting
					: null;
			objGridSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GridSetting
					? objPrefData.d.preferences.GridSetting
					: null;
			/**
			 * This default column setting can be taken from
			 * preferences/gridsets/uder defined( js file)
			 */
			objColumnSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols
					? me.getJsonObj(objPrefData.d.preferences.ColumnSetting.gridCols)
					: Ext.decode(me.getJsonObj(arrGenericBalanceColumnModel) || '[]');

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/'+me.strPageName+'.json';
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = "{}";//objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
				"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					itemId : 'balanceSetting',
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

	getDateParam : function(index) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtSellerDate;
		var dtFormat = strExtApplicationDateFormat;
		var isIntraday = me.isIntraDay();
		// TODO : Not to be used..Need to remove after confirmation
		if (false && !Ext.isEmpty(me.accountCalDate)
				&& me.summaryType === 'previousday') {
			dtFormat = 'Y-m-d';
			strAppDate = me.accountCalDate;
		}
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		
		var latestToDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
		var dtToDate = null, dtLatestToDate = null ;
		var yesterdayDate = objDateHandler.getYesterdayDate(date);
		if (!me.isIntraDay())
		{
			dtToDate = objDateHandler.getYesterdayDate(date);
			//dtLatestToDate = objDateHandler.getYesterdayDate(latestToDate);
		}
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		// isIntraday = false;
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
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(dtToDate||dtJson.toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
				// Date Range
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			 case '14' :
			    //last month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			 case '12' :
					// Latest
					if (!me.isIntraDay())
					{
						var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
						fieldValue1 = Ext.Date.format(fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtToDate,strSqlDateFormat);
						operator = 'bt';
					}
					else
					{
						fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'le';
					}
					break;
			case '13' :
				// Date Range
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = me.datePickerSelectedDate[0];
					fieldValue2 = fieldValue1;
					operator = 'eq';
				}else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = me.datePickerSelectedDate[0];
					//fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
					if ( !me.isIntraDay() && gridOrSummary != null && gridOrSummary === 'widget')
			        	fieldValue2 = Ext.Date.format(dtToDate, strSqlDateFormat);
			        else
			        {
						fieldValue2 = me.datePickerSelectedDate[1];
						if (Ext.isEmpty(fieldValue2))
							fieldValue2 = me.datePickerSelectedDate[0];
			        }
						operator = 'bt';
				}
		}
		// comparing with client filter condition
		if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
			fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
		}

		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	getQuickJsonData : function (fromDate,toDate){
		var me=this;
		var jsonData = {
			    d: []
			};
		if(typeof fromDate !== 'undefined' && typeof toDate!== 'undefined'){
			var operatorValue = "bt";
			if(fromDate === toDate)
				operatorValue = "eq";
			jsonData.d.push({ 
		        "dataType" : "D",
		        "operatorValue"  :operatorValue,
		        "paramFieldLable" : getLabel('date', 'Date'),
		        "paramName" : "EntryDate",
		        "paramIsMandatory" : true,
		        "paramValue1" : fromDate,
		        "paramValue2" : toDate,
		        "dtIndex" : me.dateFilterVal
		    });
		}
				
		return jsonData.d;
	},
	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {
		var me = this, index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
			
		var objLocalJsonData = '';
		if (objSaveBalancesLocalStoragePref)
					objLocalJsonData = Ext.decode(objSaveBalancesLocalStoragePref);
						
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
		var balancesView = me.getAccountBalancesView();
		// strUrl += me.generateFilterUrl();
		// strUrl += me.generateDollarSelectUrl();
		strUrl += '&$summaryType=' + me.summaryType;
		strUrl += '&$summaryFromDate=' + objDateParams.fieldValue1;
		strUrl += '&$summaryToDate=' + objDateParams.fieldValue2;
		strUrl += '&$accountID=' + me.accountFilter;
		strUrl += '&$serviceType=' + me.strServiceType;
		strUrl += '&$serviceParam=' + me.strServiceParam;
		$('#postingDataPicker').setDateRangePickerValue([
						objDateParams.fieldValue1, objDateParams.fieldValue2]);
		
		var arrOfParseQuickFilter = generateFilterArray(me.getQuickJsonData(objDateParams.fieldValue1,objDateParams.fieldValue2));
			if (arrOfParseQuickFilter){
				me.getGenericFilterView().updateFilterInfo(arrOfParseQuickFilter);
			}
		
		if (balancesView)
			balancesView.setLoading(true);
		grid.loadGridData(strUrl, me.postHandleLoadGridData, null, false, me);
		
		grid.on('cellclick', function(dataView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = dataView.getGridColumns()[cellIndex];
			var columnId = clickedColumn.itemId;			
			me.handleGridRowClick(record, grid, columnId);			
		});
		
		if (isSaveLocalPreference)
			me.handleSaveLocalStorage();
	},
	handleGridRowClick : function(record, grid, columnId) {
		if(columnId && columnId !== 'col_actioncontent' && columnId !== 'col_favorite' && columnId !== 'col_checkboxColumn') {
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
			//me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
			me.doHandleRowIconClick(grid, null, columnId,
							arrVisibleActions[0].itemId, record);
		}
	}		
	},
	postHandleLoadGridData : function(grid, data, scope) {
		var me = this;
		var balancesView = me.getAccountBalancesView();
		if (balancesView)
			balancesView.setLoading(false);
	},
	generateDollarSelectUrl : function() {
		var me = this;
		var strUrl = '';
		var strFinalUrl = '';
		var grid = me.getBalancesGrid();
		var arrCols = [];
		if (grid) {
			arrCols = grid.getAllColumns();
			if (arrCols && arrCols.length > 0) {
				var count = 0;
				Ext.each(arrCols, function(col) {
							if (col.metaInfo && col.metaInfo.isTypeCode === 'Y') {
								strUrl += (col.itemId).substring(4);
								if (count < arrCols.length - 1) {
									strUrl += ',';
								}
							}
							count++;
						});
			}
		}
		if (!Ext.isEmpty(strUrl)) {
			strFinalUrl += '&$select=' + strUrl;
		}
		return strFinalUrl;
	},
	generateFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strUrl = '';
		me.setDataForFilter();
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(me) {
		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';

			switch (filterData[index].operatorValue) {
				case 'bt' :
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				case 'in' :
					var arrId = filterData[index].paramValue1;
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
					}
					break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
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
	setDataForFilter : function() {
		var me = this;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		jsonArray.push({
					paramName : 'summaryDate',
					paramValue1 : objDateParams.fieldValue1,
					paramValue2 : objDateParams.fieldValue2,
					operatorValue : objDateParams.operator,
					dataType : 'D'
				});

		if (!Ext.isEmpty(me.accountFilter)) {
			jsonArray.push({
						paramName : 'accountId',
						paramValue1 : me.accountFilter,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		me.filterData = jsonArray;
	},
	applyQuickFilter : function() {
		var me = this;
		me.handleSummaryInformationRender();
		me.loadBalancesGraph(me.selectedTypecode);
		me.getBalancesGrid().refreshData();
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgActivityInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var date = '';
							var index = me.dateFilterVal;
							if (index != 7) {
								if (index === '1' || index === '2') {
									date = me.getFromDateLabel().text;
								} else {
									date = me.getFromDateLabel().text
											+ me.getToDateLabel().text;
								}
							} else {
								var dtParams = me.getDateParam('7');
								var from = Ext.Date.format(me
												.getFromEntryDate().getValue(),
										strExtApplicationDateFormat);
								var to = Ext.Date.format(me.getToEntryDate()
												.getValue(),
										strExtApplicationDateFormat);
								date = from + '-' + to;
							}
							tip.update(getLabel('information', 'Information')
									+ ' : '
									+ getLabel('lastRecieved', 'Last Received')
									+ '<br/>' + getLabel('date', 'Date')
									+ ' : ' + date);
						}
					}
				});
	},
	doHandleRowIconClick : function(grid, rowIndex, columnIndex, strActionName,
			record) {
		var me = this;
		// TODO: To be fix
		var recId = record.get('identifier');
		me.additionalInfoPopup.recordId = recId;
		me.additionalInfoPopup.currentAccountNumber = me.currentAccountNumber;
		me.additionalInfoPopup.record = record;
		me.additionalInfoPopup.selectedAccCcy = me.selectedAccCcy;
		me.additionalInfoPopup.show();
		me.additionalInfoPopup.center();
	},
	loadBalancesGraph : function(typecodeValue) {
		var me = this;
		var graphData = [], gridData = [];
		var arrayJson = new Array();
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		var objChart = me.getAccountBalancesGraphView();
		arrayJson.push({
					fromDate : objDateParams.fieldValue1,
					toDate : objDateParams.fieldValue2,
					accountId : me.accountFilter,
					summaryType : me.summaryType,
					serviceParam : me.strServiceParam,
					serviceType : 'BR_STD_BAL_GRID'
				});
		if (objChart) {
			objChart.loadGraph(arrayJson, typecodeValue);
			accountGraphView = me.getAccountBalancesGraphView();
		}
	},
	isIntraDay : function() {
		var retValue = false;
		var me = this;
		if (!Ext.isEmpty(me.summaryType) && me.summaryType === 'intraday')
			retValue = true;
		return retValue;
	},
	generateDollarTypeCodeUrl : function() {
		var me = this;
		var strUrl = '';
		var strFinalUrl = '';
		var grid = me.getBalancesGrid();
		var arrCols = [];
		if (grid) {
			arrCols = grid.getAllColumns();
			if (arrCols && arrCols.length > 0) {
				var count = 0;
				Ext.each(arrCols, function(col) {
							if (col.metaInfo && col.metaInfo.isTypeCode === 'Y') {
								strUrl += col.metaInfo.colId;
								if (count < arrCols.length - 1) {
									strUrl += ',';
								}
							}
							count++;
						});
			}
		}
		if (!Ext.isEmpty(strUrl)) {
			strFinalUrl += '&$typeCode=' + strUrl;
		}
		return strFinalUrl;
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	/** ****** Summary Info handling ******* */
	handleSummaryInformationRender : function() {
		var me = this;
		//summary not rendering properly incase of it is collapsed from other screen.
		if ($('#btrSummaryListId').hasClass('ft-accordion-collapsed'))						
		{
			$("#btrSummaryListId").removeClass('ft-accordion-collapsed');
		} 	
		var typeCodeUrl = me.generateTypeCodeUrl();
		me.populateSummaryInformationView(typeCodeUrl, false);
	},
	generateTypeCodeUrl : function() {
		var me = this;
		var strAppDate = dtSellerDate;
		var dtFormat = strExtApplicationDateFormat;
		/*
		 * if (false && !Ext.isEmpty(me.accountCalDate) && me.summaryType ===
		 * 'previousday') { dtFormat = 'Y-m-d'; strAppDate = me.accountCalDate; }
		 */
		var strSqlDateFormat = 'Y-m-d';
		var parsedDate = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		var fromDate = objDateParams.fieldValue1;
		var toDate = objDateParams.fieldValue2;
		var typeCodeUrl;
		
		if (me.summaryType === "intraday") {
			typeCodeUrl = me.strIntraDaySummaryRibbonUrl;
		} else if (me.summaryType === "previousday") {
			typeCodeUrl = me.strPreviousDaySummaryRibbonUrl;
		}
		
		typeCodeUrl += '?$eqCurrency=' + me.equiCcy;
		typeCodeUrl += '&$summaryType=' + me.summaryType;
		typeCodeUrl += '&$accountID=' + me.accountFilter;
		
		if (!Ext.isEmpty(objDefPref['BALANCE']['RIBBON'][me.strServiceParam]))
		{
			typeCodeUrl += '&$serviceType='+objDefPref['BALANCE']['RIBBON'][me.strServiceParam]['serviceType'];
			typeCodeUrl += '&$serviceParam='+objDefPref['BALANCE']['RIBBON'][me.strServiceParam]['serviceParam'];
		}
		else
		{
			typeCodeUrl += '&$serviceType='+mapService['BR_STD_BAL_RIBBON'];
			typeCodeUrl += '&$serviceParam='+mapService['BR_RIBBON_GENERIC'];
		}
		typeCodeUrl += '&$summaryFromDate=' + fromDate;
		typeCodeUrl += '&$summaryToDate=' + toDate;
		typeCodeUrl += '&$pageName=' + me.strPageName;
		//typeCodeUrl += '&$moduleName=' + 'SUBFAC0301NewUX';
		return typeCodeUrl;

	},
	populateSummaryInformationView : function(strUrl, updateFlag) {
		var me = this;
		var eqCcy = me.selectedAccCcySymbol;
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		while (arrMatches = strRegex.exec(strUrl)) {
     		objParam[arrMatches[1]] = arrMatches[2];
    	}
        var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
        strUrl = strGeneratedUrl		
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					params:objParam,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							summaryData = me.getTypeCodeJsonObj(data.d.summary);
							var objTypeCodePrf = Ext.decode(objAccHistoryTypeCodePopupPref);
							var colPrefSettings = objTypeCodePrf && objTypeCodePrf.d.preferences
					&& objTypeCodePrf.d.preferences.ColumnSetting
					&& objTypeCodePrf.d.preferences.ColumnSetting.gridCols
					? objTypeCodePrf.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrBalanceRibbonColumnModel || '[]');
							var summaryPrefData = [],k=0;
							
							for(var i=0 ; i < summaryData.length ; i++){
								for(var j=0; j < colPrefSettings.length ; j++ ){
									if(summaryData[i].typeCode == colPrefSettings[j].colId && colPrefSettings[j].hidden != true){
										summaryPrefData[k] = summaryData[i];
										summaryPrefData[k].colSequence  = colPrefSettings[j].colSequence;
										summaryPrefData[k].hidden  = colPrefSettings[j].hidden;
										k++;
									}
								}
							}							
							summaryPrefData.sort(function(a, b){
								 return a.colSequence-b.colSequence
							});
							summaryData = summaryPrefData;
							equiCcyLogo = me.equiCcy;
							afterCreateCarouselReq('summaryCarousalBalanceTargetDiv');
							/*var summaryInfoView = me.getSummaryInfoView();
							if (!Ext.isEmpty(summaryInfoView)) {
								summaryInfoView.updateSummaryInfoView(
										summaryData, eqCcy);
							}*/
							
							//$('#currentCurrencyLabelId').html(me.equiCcy);
							/*$('#summaryCarousalBalanceTargetDiv').carousel({
								data : summaryData,
								titleNode : "typeCodeDescription",
								contentRenderer: function(value) {
									if (value.dataType === 'count')
									{
										return  value.typeCodeAmount  || '';
									}
									else
									{
										var amount  = (Ext.isEmpty(value.typeCodeAmount) ? '' : value.typeCodeAmount);
										return  Ext.isEmpty(amount) ? '' : eqCcy + amount;
									}
									}								
								});*/
						}
					},
					failure : function(response) {
						// console.log("Error Occured - In SummaryData
						// renderer");
					}
				});
	},
	doSaveSummaryTypeCodes : function(arrTypeCode) {
		var me = this;
		var jsonPost = {};
		jsonPost['typeCodes'] = arrTypeCode || [];
		me.preferenceHandler.saveModulePreferences(
				'btrBalanceSummaryNewUX',
				me.strServiceParam, jsonPost,
				me.postHandleDoSaveSummaryTypeCodes, null, me, false);
	},
	postHandleDoSaveSummaryTypeCodes : function(data, args, isSuccess) {
		var me = this;
		me.handleSummaryInformationRender();
	},
	doHandleCurrencyChange : function(strCcy) {
		var me = this;
		var objGroupView = me.getGroupView();
		me.equiCcy = strCcy;
		//me.getAccountSummaryView().equiCcy = me.equiCcy;
		me.handleSummaryInformationRender();
		if (objGroupView)
			objGroupView.refreshData();

	},
	/** ****** Summary Info handling end******* */
	updateFilterConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.summaryType = summaryType;
		me.dateFilterVal='5';
	},
	postReadPanelPrefrences : function (data, args, isSuccess) {
		var me = this;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			filterRibbonCollapsed = objPref.filterPanel;
			infoRibbonCollapsed = objPref.infoPanel;
			grafRibbonCollpased = objPref.grafPanel;
			 if(summaryType==objPref.pageName){
			if(grafRibbonCollpased == false)
				$('#graghSummaryId').addClass("");
			else{
				//$('#graghSummaryId').addClass("ft-accordion-collapsed");
				me.graphPanelPref=grafRibbonCollpased;
			}
			/*if(infoRibbonCollapsed == false)
					$('#btrSummaryListId').addClass("");
			else
					$('#btrSummaryListId').addClass("ft-accordion-item ft-accordion-collapsed");*/
		   }
		}	
	},
	doHandleAccountChange : function(btn) {
		var me = this;
		me.identifier = null;
		me.accountCalDate = btn.accountCalDate;
		//me.handleDateChange(me.dateFilterVal);
		me.accountFilter = btn.codeVal;
		me.currentAccountNumber = btn.accNumber;
		me.selectedAccCcy = btn.accCurrency;
		me.selectedAccCcySymbol = btn.accCurrencySymbol;
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	/** ********* Filter view ********** */
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef=$('#postingDataPicker');
		
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('date', 'Entry Date')
					+ " (" + me.dateFilterLabel + ")");
		}
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),strExtApplicationDateFormat);
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([
						vFromDate, vToDate]);
			}
		} else {
				if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							datePickerRef.val('Thru' + '  ' + vFromDate);
						} else{
							datePickerRef.setDateRangePickerValue(vFromDate);
						}	
				} else {
					datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
				}
		}
	},
	/**
	 * strFilterType can be 'all' / 'latest'
	 */
	handleInformationFilterChange : function(strFilterType) {
		var me = this;
		var filterView = me.getFilterView();
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtSellerDate;
		var dtFormat = strExtApplicationDateFormat;
		var fromDate = new Date(Ext.Date.parse(dtLastLogin, dtFormat));
		var toDate = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var defDateFilter = me.getDefaultDateFilter();
		var strDateFilterValue = strFilterType === 'latest'
				? '7'
				: defDateFilter.code;
		var strDateFilterLabel = strFilterType === 'latest' ? getLabel(
				'daterange', 'Date Range') : defDateFilter.text;

		me.identifier = null;
		me.isHistoryFlag = null;
		me.dateFilterVal = strDateFilterValue;
		me.dateFilterLabel = strDateFilterLabel;
		me.handleDateChange(me.dateFilterVal);
		if (strDateFilterValue === '7') {
			if (!Ext.isEmpty(me.getFromEntryDate())) {
				me.getFromEntryDate().setMaxValue(fromDate);
				me.getFromEntryDate().setValue(fromDate);
				me.getFromEntryDate().setMinValue(clientFromDate);
			}
			if (!Ext.isEmpty(me.getToEntryDate())) {
				me.getToEntryDate().setMaxValue(toDate);
				me.getToEntryDate().setValue(toDate);
			}
		}
		me.dateFilterFromVal = Ext.Date.format(fromDate, strSqlDateFormat);
		me.dateFilterToVal = Ext.Date.format(toDate, strSqlDateFormat);
		me.setDataForFilter();
		me.applyQuickFilter();
		//me.toggleSavePrefrenceAction(true);
	},		
	getDefaultDateFilter : function() {
		var me = this;
		var retValue = retValue = {
			text : getLabel('daterange', 'Date Range'),
			code : '7'
		};
		var intFilterDays = objClientParameters
				&& !Ext.isEmpty(objClientParameters['filterDays'])
				&& objClientParameters['filterDays'] !== 0
				? parseInt(objClientParameters['filterDays'],10)
				: '';

		if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			retValue = {
				text : getLabel('yesterday', 'Yesterday'),
				code : '2'
			};
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
			retValue = {
				text : getLabel('thisweek', 'This Week'),
				code : '3'
			};
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
			retValue = {
				text : getLabel('lastweektodate', 'Last Week To Date'),
				code : '4'
			};
		return retValue;
	},

	handleSummaryTypeChange : function(summaryType) {
		var me = this;
		if (me.dateFilterVal === '4')
			me.getDateLabel().setText(getLabel('dateLabelLastWeekToDate',
					'Date (Last Week To Date)'));
		/*else
			me.getDateLabel().setText(getLabel('dateLabelYest',
					'Date (Yesterday)'));*/
//		me.getSelectDateButton().show();
	},
	/** **************** download report ********************* */
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = $("#headerCheckbox").is(':checked');
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadReport : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2',
			downloadMt940 : 'mt940',
			downloadMt950 : 'mt950',
			downloadqbook : 'quickbooks',
			downloadquicken : 'quicken'
		};
		var currentPage = 1, strExtension = '', strUrl = '', strSelect = '';
		var objDateParams = me.getDateParam(me.dateFilterVal);
		var grid = me.getBalancesGrid();

		strExtension = arrExtension[actionName];
		strUrl = 'services/btrBalanceHistory/'+summaryType+'/generateReport.' + strExtension;
		strUrl += '?$skip=1';
		strUrl += '&$summaryType=' + me.summaryType;
		strUrl += '&$serviceType=' + me.strServiceType;
		strUrl += '&$serviceParam=' + me.strServiceParam;
		strUrl += '&$summaryFromDate=' + objDateParams.fieldValue1;
		strUrl += '&$summaryToDate=' + objDateParams.fieldValue2;
		strUrl += '&$accountID=' + me.accountFilter;
		strUrl += me.generateFilterUrl();
		strUrl += me.generateDollarTypeCodeUrl();

		arrColumn = grid.getAllVisibleColumns();
		if (arrColumn) {
			var col = null;
			var colArray = new Array();
			for (var i = 0; i < arrColumn.length; i++) {
				col = arrColumn[i];
				if (col.dataIndex
						&& arrDownloadReportBalanceColumn[col.dataIndex])
					colArray
							.push(arrDownloadReportBalanceColumn[col.dataIndex]);
			}
			if (colArray.length > 0)
				strSelect = '&$select=[' + colArray.toString() + ']';
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
	createPopUps : function() {
		var me = this;
		if (Ext.isEmpty(me.additionalInfoPopup)) {
			me.additionalInfoPopup = Ext
					.create(
							'GCP.view.balances.popup.AccountBalancesAdditioalInfoPopUp',
							{
								itemId : 'accBalAdditionalInfoPopup'
							});
		}
	},
	getGridModel : function() {
		var me = this;
		var gridCols = null;
		var gridModel = null;
		var model=null;
		if (typeof me.objBalancesGridPref != 'undefined'
				&& !Ext.isEmpty(me.objBalancesGridPref)
				&& 'null' !== me.objBalancesGridPref)
			gridModel = me.objBalancesGridPref;

		if(!Ext.isEmpty(objDefPref['BALANCE']['GRID'][me.strServiceParam]))	
			model = objDefPref['BALANCE']['GRID'][me.strServiceParam]['columnModel'];
		gridModel = gridModel || {
			"pgSize" : 10,
			"gridCols" : model || objDefPref['BALANCE']['GRID'][mapService['BR_GRIDVIEW_GENERIC']]['columnModel']
		};
		return gridModel;
	},
	/* ********************** Preferences Handling start **************** */
	/*toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},*/
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
		var arrPref = [];
		var filterPanelCollapsed = true, infoPanelCollapsed = true, grafPanelCollapsed = true,objFilterPref = null;
		var infoPanel = me.getSummaryInfoView(); 
	//	filterPanelCollapsed = (me.getFilterView().getCollapsed() === false) ? false : true; 
	//	grafPanelCollapsed = (me.getGraphPanel().getCollapsed() === false) ? false : true;
	//	infoPanelCollapsed = infoPanel.down('image[itemId="summInfoShowHideStdView"]').hasCls("icon_expand_summ");
		var  grafPanelCollapsed = $('#graghSummaryId').hasClass("ft-accordion-item ft-accordion-collapsed") ? true : false;
	    var  infoPanelCollapsed = $('#btrSummaryListId').hasClass("ft-accordion-item ft-accordion-collapsed") ? true : false;
		grid = me.getBalancesGrid();
		var groupView = me.getGroupView();
		var state = groupView.getGroupViewState();
		
		objFilterPref = me.getFilterPreferences();
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : objFilterPref
					});
		
		arrPref.push({
					"module" : me.strServiceParam,
					"jsonPreferences" : {
						'gridCols' : state.grid.columns,
						'pgSize' : state.grid.pageSize,
						'sortState':state.grid.sortState,
						'gridSetting' : state.gridSetting
					}
				});	
		arrPref.push({
					"module" : "panels",
					"jsonPreferences" : {
						'pageName' : summaryType,
						'infoPanel' : infoPanelCollapsed,
						'grafPanel' : grafPanelCollapsed
					}
				});	
		return arrPref;
	},
	
	getFilterPreferences : function() {
		var me = this;
		var objFilterPref = {},strSqlDateFormat = 'Y-m-d';;
		
		var quickPref = {};
		quickPref.entryDate = me.dateFilterVal;
		if (me.dateFilterVal === '13') {
			me.dateFilterFromVal = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
			me.dateFilterToVal = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);				
			if (me.datePickerSelectedDate.length == 1) {
				quickPref.entryDateFrom = me.dateFilterFromVal;	
			}	
			else if(me.datePickerSelectedDate.length == 2){
				quickPref.entryDateFrom = me.dateFilterFromVal;	
				quickPref.entryDateTo = me.dateFilterToVal;			
			}
		}
		objFilterPref.quickFilter = quickPref;
		if (!Ext.isEmpty(me.clientFilterVal))
			objFilterPref.filterClientSelected = me.clientFilterVal;
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
	handleClearPreferences : function() {
		var me = this;
		if ($("#clearPrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
	},
	doHandleBackAction : function(btn) {
		var me = this;
		me.destroyFilterView();
		if(!Ext.isEmpty(me.getAccountBalancesGraphView()))
			me.getAccountBalancesGraphView().destroy();
			GCP.getApplication().fireEvent('showSummary');					
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
	getDateDropDownLabel:function(dropDownCode){
		var objDateLbl = {
			'' : getLabel('latest', 'Latest'),
			'1' : getLabel('today', 'Today'),
			'2' : getLabel('yesterday', 'Yesterday'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel('lastweektodate', 'Last Week To Date'),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
			'14' : getLabel('lastmonthonly', 'Last Month Only'),
			'8' : getLabel('thisquarter', 'This Quarter'),
			'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
			'10' : getLabel('thisyear', 'This Year'),
			'11' : getLabel('lastyeartodate', 'Last Year To Date'),
			'13' : getLabel('daterange', 'Date Range'),
			'12' : getLabel('latest', 'Latest')
		};
		return objDateLbl[dropDownCode];
	},
	postDoHandleReadPagePrefNew : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data)) {				
				objHistoryPref = Ext.encode(data);
				me.handleSummaryInformationRender();
			}
		}
	},
	postDoHandleReadPagePref : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data) && !Ext.isEmpty(data.d.preferences)) {
				me.objBalancesGridPref = data.d.preferences[me.strServiceParam];
				if( typeof data.d.preferences.groupViewFilterPref !== 'undefined'){
					var prefFilterData=data.d.preferences.groupViewFilterPref;
					 me.dateFilterVal =  prefFilterData.quickFilter.entryDate;
					 var strDtFrmValue = prefFilterData.quickFilter.entryDateFrom;
					 var strDtToValue =  prefFilterData.quickFilter.entryDateTo;
					 if (me.dateFilterVal === '13') {
							if (!Ext.isEmpty(strDtFrmValue))
								me.dateFilterFromVal = strDtFrmValue;
								me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d')
							if (!Ext.isEmpty(strDtToValue))
								me.dateFilterToVal = strDtToValue;
								me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d')
						}
					}
					me.dateFilterLabel = me.getDateDropDownLabel(me.dateFilterVal);
			}
		}
	},
	/* ********************** Preferences Handling end **************** */
	setInfoToolTipVal : function(tip) {
		var me = this;
		var date = '', filterView;
		if (!Ext.isEmpty(tip)) {
			var index = me.dateFilterVal;
			if (index != 7) {
				if (index === '1' || index === '2') {
					date = me.getFromDateLabel().text;
				} else {
					date = me.getFromDateLabel().text
							+ me.getToDateLabel().text;
				}
			} else {
				var dtParams = me.getDateParam('7');
				var from = Ext.Date.format(me.getFromEntryDate().getValue(),
						strExtApplicationDateFormat);
				var to = Ext.Date.format(me.getToEntryDate().getValue(),
						strExtApplicationDateFormat);
				date = from + '-' + to;
			}
			tip.update(getLabel('information', 'Information') + ' : '
					+ getLabel('all', 'All') + '<br/>'
					+ getLabel('date', 'Date') + ' : ' + date);
		}
	},
	populateSummaryAccountInfo : function() {
		var me = this;
		$("#currentCurrencyLabelId").show();
		$("#currencyDropdown").show();		
		$("#currAutoCompleter").parent().hide();
		$("#currentCurrencyLabelId").empty();
		$("#currencyCodedropDownId").empty();
		var ctrl = $('#actAccountId'),objOpt = null,objDtl = null,objBtn = null;
		ctrl.empty();
		ctrl.unbind('change');
		Ext.Ajax.request({
					url : 'services/balancesummary/'+summaryType+'/btruseraccounts.json',
					method : 'GET',
					success : function(response) {
						if (response && response.responseText) {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data)) {
								var accArrayNew  = data.d.btruseraccount || [];
								var accArray =  new Array();
								var i=0;
								if(isGranularPermissionForClient == "Y")
								{
							    for (var j = 0; j < accArrayNew.length; j++) {							
									if(accArrayNew[j].previousDaySummaryflag == "Y")
										{
											accArray[i] = accArrayNew[j];
											i++;
										}
									}								
								}
								else
									accArray = accArrayNew;
		
								if (undefined != accArray) {
									$.each(accArray, function(index, item) {
										objOpt = {
											value : item.accountId,
											text : item.accountNumber + ' , ' + item.accountName
										};
										if (me.accountFilter == item.accountId)
												objOpt.selected = true;
											ctrl.append($('<option>', objOpt));
									});
								if (ctrl.find('option').length > 0) {
									$('#actAccountIdSpan').removeClass('hidden');
									ctrl.bind('change', function(e) {
										objDtl = me.getObjectByKey(accArray,
												'accountId', $(this).val())
												|| {};
										me.doHandleAccountChange({
											codeVal : objDtl.accountId,
											accNumber : objDtl.accountNumber,
											accName : objDtl.accountName,
											accCurrency : objDtl.accountCcy,
											accCurrencySymbol : objDtl.accountCcySymbol,
											accountCalDate : objDtl.accountCalDate
										});
	
									});
							} else
								$('#actAccountIdSpan').addClass('hidden');
							ctrl.editablecombobox("destroy")
							ctrl.editablecombobox({
										emptyText : 'Select Account'
									});
						}
					}
				}
					},
					failure : function(response) {
						// console.log("Error Occured - In SummaryData
						// renderer");
					}
				});
	},
	getObjectByKey : function(arrObjects, strKey, strVal) {
		var arr = arrObjects || [];
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][strKey] == strVal) {
				return arr[i];
			}
		}
		return null;
	},
	balanceDownloadOptions : function() {
		var me = this;		
		$('.ft-pdf-btn').unbind( "click" );
		if (typeof objClientParameters != 'undefined' && !Ext.isEmpty(objClientParameters)
				&& !Ext.isEmpty(objClientParameters.enableReport)) {				
			if(objClientParameters.enableReport)
			{
				$('.ft-pdf-btn').on("click", function(e) {
					me.downloadReport("downloadReport");			
				});
			}
		} 
		
		$("#downloadDropDownItem").empty();				
		$("#downloadReportDropDownItem").empty();
		$("#dropDownPDF").remove();
		$("#historyPDF").removeClass('hidden');
		if (typeof objClientParameters != 'undefined' && !Ext.isEmpty(objClientParameters)
				&& !Ext.isEmpty(objClientParameters.exportList)) {
				var exportArr = objClientParameters.exportList;
				if (!Ext.isEmpty(exportArr)) {
					Ext.each(exportArr, function(exprtEl) {								
								switch (exprtEl) {
									case 'XS' :
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadXls" href="#">'+getLabel("xls","XLS")+'</a></li>');
										break;
									case 'CS' :
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadCsv" href="#">'+getLabel("csv","CSV")+'</a></li>');
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadTsv" href="#">'+getLabel("tsv","TSV")+'</a></li>');
										$("#downloadDropDownItem").append('<div class="ft-dropdown-content-btr"><label class="headerCheckBox"> <input id="headerCheckbox" type="checkbox">'+getLabel("withheader","With Header")+'</label></div>');
										break;
									case 'PF' :
										break;
									case 'MT' :
										if(summaryType=='previousday')									
											$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadMt940" href="#">'+getLabel("mt940","MT940")+'</a></li>');
										break;
									case 'MT2' :
										if(summaryType=='intraday')									
										    $("#downloadDropDownItem").append('<li><a data-downloadExt="downloadMt942" href="#">'+getLabel("mt942","MT942")+'</a></li>');
										break;
									case 'MT3' :
										if(summaryType=='previousday')									
										    $("#downloadDropDownItem").append('<li><a data-downloadExt="downloadMt950" href="#">'+getLabel("mt950","MT950")+'</a></li>');
										break;
									case 'BA' :										
										break;
									case 'QCK' :
										if(summaryType=='previousday')		
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadqbook" href="#">'+getLabel("quickbooks","QuickBooks")+'</a></li>');
										break;
									case 'QCKN' :
										if(summaryType=='previousday')		
										$("#downloadDropDownItem").append('<li><a data-downloadExt="downloadquicken" href="#">'+getLabel("quicken","Quicken")+'</a></li>');
										break;
									default :
										break;
								}

							});
				}
				$('#downloadDropDownItem li').on("click", function(event) {
					var actionName = $(event.target).attr("data-downloadExt");
					me.downloadReport(actionName);			
				});
			}
	},	
	handleClearSettings : function() {
		var me = this;		
		if(summaryType=='intraday')
			me.dateFilterVal = '1';
		else if(summaryType=='previousday')
			me.dateFilterVal = '2';
		me.dateFilterLabel= me.getDateDropDownLabel(me.dateFilterVal)
		//var latestBtn = me.getInfoNewBtn();
		//latestBtn.removeCls('ui-datepicker-header');
		//var allBtn = me.getInfoAllBtn();
		//allBtn.addCls('ui-datepicker-header');	
		me.handleDateChange(me.dateFilterVal);
		me.handleSummaryTypeChange(me.summaryType);
		me.setDataForFilter();
		me.applyQuickFilter();		
	},
	destroyFilterView : function() {	
		var me = this;
		if (!Ext.isEmpty(me.getFilterView()) && !Ext.isEmpty(me.getFilterView().up('filterView'))) {
			me.getFilterView().up('filterView').destroy();
		}
	},
	showActivityPage : function(record, summaryType) {	
		var me = this;
		me.destroyFilterView();
		GCP.getApplication().fireEvent('showActivity', record, summaryType);
	},
	loadBalanceGraph : function(mode)
	{
		$('#graphCarousal').empty();
		var panel = Ext.create('GCP.view.balances.AccountBalancesGraphView', {								
			renderTo : 'graphCarousal'
		});
	},
	populateBalanceGraphTypecodeInfo : function() {
		var me = this;
		var balances = [
		        {"typeCode":"703", "description":"Available Balance"},
		        {"typeCode":"040", "description":"Opening Available"},
		        {"typeCode":"045", "description":"Closing Available"},
		        {"typeCode":"060", "description":"Current Available"},
		        {"typeCode":"010", "description":"Opening Ledger"},
		        {"typeCode":"015", "description":"Closing Ledger"},
		        {"typeCode":"030", "description":"Current Ledger"}
		    ];
		$('#typecodeDropdown').show();
		$('#typecodeDropdownId').empty();
		$('#currentTypecodeLabelId').show();
		$('#currentTypecodeLabelId').empty();
		$('#graphTitleLabelId').text('Graph Against');
		$.each(balances, function(index, item) {
			$('#typecodeDropdownId').append('<li index='+item.typeCode+'><a href="#">'+item.description+'</a></li>');
			if(item.typeCode == me.defaultTypecode)
				$('#currentTypecodeLabelId').html(item.description);
		});
		$('#typecodeDropdownId li').on('click', function(e) {
			var text = $(this).text();
			me.selectedTypecode = $(this).attr('index');
			$('#currentTypecodeLabelId').html(text);
			me.loadBalancesGraph(me.selectedTypecode);
		});
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me=this;		
		var objGroupView = me.getGroupView();	
		var gridModel = null;
		var objLocalJsonData = '';
		if (objSaveBalancesLocalStoragePref)
					objLocalJsonData = Ext.decode(objSaveBalancesLocalStoragePref);
					
		var intPageSize = objLocalJsonData && objLocalJsonData.d
				&& objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.pageSize
				? objLocalJsonData.d.preferences.tempPref.pageSize
				: '';
		var intPageNo = objLocalJsonData && objLocalJsonData.d
				&& objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.pageNo
				? objLocalJsonData.d.preferences.tempPref.pageNo
				: 1;
		var sortState = objLocalJsonData && objLocalJsonData.d
				&& objLocalJsonData.d.preferences
				&& objLocalJsonData.d.preferences.tempPref
				&& objLocalJsonData.d.preferences.tempPref.sorter
				? objLocalJsonData.d.preferences.tempPref.sorter
				: [];
		if(!Ext.isEmpty(intPageSize)){
			gridModel = {
					pageSize : intPageSize,
					pageNo : intPageNo
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
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.getQuickJsonData();
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson =null;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
					me.filterData = arrQuickJson;
				}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.getGroupView().refreshData();
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
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if(strFieldName === 'EntryDate'){
			var date = new Date(Ext.Date.parse(dtSellerDate, strExtApplicationDateFormat));
			if (!me.isIntraDay()) {
				me.dateFilterVal = '5';
				me.handleSummaryInformationRender();
			}
		}
	},
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
				
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.getQuickJsonData(objDateParams.fieldValue1,objDateParams.fieldValue2)) ? 
															me.getQuickJsonData(objDateParams.fieldValue1,objDateParams.fieldValue2) : {};
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
	saveLocalPref : function(objSaveState){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this, strLocalPrefPageName = me.strPageName+'_TempPref';
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
		objSaveBalancesLocalStoragePref = Ext.encode(data);
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
			objSaveBalancesLocalStoragePref = '';
			me.objLocalData = '';
			//me.handleClearSettings();
			me.dateFilterVal = '5';	
		me.dateFilterLabel= me.getDateDropDownLabel(me.dateFilterVal)
		me.handleDateChange(me.dateFilterVal);
		me.handleSummaryTypeChange(me.summaryType);
	}
	},
	getBalanceHistoryDate : function (strAppDate){
		var me = this;
		var objDateHandler = me.getDateHandler();
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var yesterdayDate = objDateHandler.getYesterdayDate(date);
		if(!me.isIntraDay())
			return yesterdayDate;
		else
			return date;
	}
});
