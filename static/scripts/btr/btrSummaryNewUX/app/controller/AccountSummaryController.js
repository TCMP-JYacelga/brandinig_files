/**
 * @class GCP.controller.AccountSummaryController
 * @extends Ext.app.Controller
 * @author Vinay Thube
 */
/**
 * This controller is prime controller in Account Summary T7 Controller which
 * handles all measure events fired from GroupView. This controller has
 * important functionality like on any change on grid status or quick filter
 * change, it forms required URL and gets data which is then shown on Summary
 * Grid.
 */
Ext.define('GCP.controller.AccountSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.summary.AccountSummaryView', 'GCP.view.summary.AccountSetEntryView',
			'GCP.view.summary.AccountSetPopUpView','GCP.view.summary.AccountSetGridView',
			'GCP.view.summary.SummaryInformationView', 'Ext.ux.gcp.DateUtil',
			'Ext.ux.gcp.PreferencesHandler','GCP.view.common.SummaryTypeCodeSettingPopup',
			'GCP.view.summary.popup.AccountSummaryAdditioalInfoPopUp','GCP.view.summary.AccountSetEntryGridView',
			'GCP.view.summary.popup.AccountSummaryEstatementInfoPopUp'],
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp[itemId="summarySetting"]'
			}, 
			{
				ref : 'typeCodeSettingPopUp',
				selector : 'summaryTypeCodeSettingPopup[itemId="summaryDialog"]'
			},
			{
				ref : 'accountCenter',
				selector : 'accountCenter'
			}, {
				ref : 'accountSummaryView',
				selector : 'accountSummaryView'
			}, {
				ref : 'groupView',
				selector : 'accountSummaryView groupView'
			}, {
				ref : 'genericFilterView',
				selector : 'filterView'
			},{
				ref : 'filterView',
				selector : 'accountSummaryFilterView'
			},{
				ref : 'btnAllAcc',
				selector : 'accountSummaryView accountSummaryFilterView button[itemId="allAcc"]'
			},{
				ref : 'accountSetPopUp',
				selector : 'accountSetPopUpView[itemId="AccountSetPopUpView"]'
			}, {
				ref : 'summaryInfoView',
				selector : 'accountSummaryView summaryInformationView'
			}, {
				ref : 'btnSavePreferences',
				selector : 'accountSummaryView accountSummaryFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : 'accountSummaryView accountSummaryFilterView button[itemId="btnClearPreferences"]'
			}/*, {
				ref : 'withHeaderReportCheckbox',
				selector : 'accountSummaryView accountSummaryTitleView menuitem[itemId="withHeaderId"]'
			}*/, {
				ref : 'fromEntryDate',
				selector : 'accountSummaryFilterView datefield[itemId="fromDate"]'
			}, {
				ref : 'toEntryDate',
				selector : 'accountSummaryFilterView datefield[itemId="toDate"]'
			}, {
				ref : 'accountSetEntryView',
				selector : 'accountSetEntryView'
			}, {
				ref : 'accountSetGridView',
				selector : 'accountSetGridView'
			}, {
				ref : 'dateFilterTitle',
				selector : 'accountSummaryFilterView label[itemId="dateFilterTitle"]'
			},{
				ref : 'accountTypeCombo',
				selector : 'accountSummaryFilterView combo[itemId="viewAccountCombo"]'
			},{
				ref : 'clientCombo',
				selector : 'accountSummaryFilterView combo[itemId="clientCombo"]'
			},{
				ref : 'latestBtn',
				selector : 'accountSummaryFilterView label[itemId="latestBtn"]'
			},{
				ref : 'realTimeBtn',
				selector : 'accountSummaryFilterView label[itemId="realTimeBtn"]'
			},
			{
				ref : 'accountSetEntryGridView',
				selector : 'accountSetEntryGridView'
			}],
	config : {
		additionalInfoPopup : null,
		estatementInfoPopUp : null,
		accountTypeFilter : [],
		accountTypeFilterDesc : [],
		accountSets : [],
		accountFilter : 'ALL',
		accountFilterName : 'all',
		selectedClientFilter : '',
		selectedClientFilterDesc : '',
		deletedAcc: null,
		arrFavAccounts : [],
		datePickerSelectedDate : [],
		equiCcy : 'USD',
		equiCcySymbol : '$',
		summaryType : null,
		dateHandler : null,
		preferenceHandler : null,
		dateFilterFromVal : null,
		dateFilterToVal : null,
		dateFilterText : getDateIndexLabel(defaultDateIndex), // getLabel('latest', 'Latest'),
		dateFilterIndex : defaultDateIndex,
		dateRangeFilterVal : '13',
		strDate : null,
		accountSetSaveFlag : null,
		reportGridOrder : null,
		clientParams : objClientParameters,
		mapUrlDetails : {
			'strPrefferdAccount' : {
				moduleName : 'preferredaccounts'
			},
			'strPrefferdAccountSets' : {
				moduleName : 'accountsets'
			},
			'strPrefferdTypeCodes' : {
				moduleName : 'typecodesummary'
			}
		},
		strIntraDaySummaryRibbonUrl : 'services/balancesummary/intraday/summarytypecodes',
		strPreviousDaySummaryRibbonUrl : 'services/balancesummary/previousday/summarytypecodes',
		strPageName : strSummaryPageName,
		strRibbonPageName : strRibbonPageName,
		accountTypes : [],
		pageSettingPopup : null,
		widgetDtfilter : false,
		widgetAccountSet : false,
		firstLoad : false
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		Ext.data.Connection.override({
		    request: function(options){
		        var me = this;
		        if(!options.headers)
		           options.headers = {};
		            
		        var actionUrl = options.url;
				options.headers[csrfTokenName] = csrfTokenValue;
				
		        return me.callOverridden(arguments);
		    }
		});
		me.firstLoad = true;
		if(!Ext.isEmpty(filterJson))
			arrFilterJson = JSON.parse(filterJson);
		if(Ext.isEmpty(filterUrl))
			me.updateConfigs();
		else {
			me.setWidgetFilters();
		}
		me.createPopUps();
		$(document).on('loadAccountSetGrid', function(event) {
					me.loadAccountSetGrid();
				});
		$(document).on('setValueForCompany', function(event,value) {
			me.setValueForCompany(value);
		});
		$(document).on('loadAccountSetEntryGrid', function(event) {
					me.loadAccountSetEntryGrid('ADD');
				});
		$(document).on('deleteFilterEvent', function(event, rowIndex) {
					me.doDeleteAccountSet(rowIndex);
				});
		$(document).on('accountSetOrderChange', function(event, grid, rowIndex, intPosition,
						strDirection) {
			me.doAccountSetOrderChange(grid, rowIndex, intPosition,
						strDirection);
		});
		$(document).on('viewAccountSet', function(event, grid, rowIndex) {
			me.doHandleViewAccountSet(grid,rowIndex);
		});
		$(document).on('showSelectedFilterPopup', function(event, selectedFilter) {
			me.doHandleShowSelectedFilter(selectedFilter);
		});
		$(document).on('filterGridData', function(event,ObjValue) {
			me.filterGridData(ObjValue);
		});
		$(document).on('doHandleSaveClick', function(event,txtFieldVal,strMode) {
			me.doHandleSaveClick(txtFieldVal,strMode);
		});
		$(document).on('doClearSelction', function(event) {
			me.clearSelection();
		});
		$(document).on('saveLocalPreference', function(event) {
			if (isSaveLocalPreference)
				me.handleSaveLocalStorage();
		});
		
		GCP.getApplication().on({
					'showSummary' : function(record, strSummaryType) {
							var container = me.getAccountCenter();
							$('#actAccountIdSpan').addClass('hidden');
							$('#intraPrevDisclaimerText').removeClass('ui-helper-hidden');
							if( summaryType == 'intraday')
								$('#brsummraytitle').html(getLabel('intradayAccountSummaryTitle', 'Account / Account Summary / Intraday'));
							else
								$('#brsummraytitle').html(getLabel('previousdayAccountSummaryTitle', 'Account / Account Summary / Previous Day'));
							if (!Ext.isEmpty(container)) {
								container.updateView(null);
								container.setActiveCard(0);
							}
							if (me.getGroupView())
								me.getGroupView().getGrid().getView().refresh();
							me.pageTitleLoad();
							summaryDownloadOptions();
							isActivityOn = false;
							isBalanceOn = false;
							me.populateSummaryCcyInfo();
							me.handleAccountTypeLoading();
							me.handleSummaryInformationRender();
							$('#graphBar').addClass('ui-helper-hidden');
							$('#brsummarybackdiv').hide();	
							me.firstLoad = true;
							//$('#graphCarousal').empty();							
					},
					'backToParentView' : function() {
						GCP.getApplication().fireEvent('showSummary');
					}
				});
		$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});	
				
		$(document).on('performPageSettingsSummary', function(event) {
					me.showPageSettingPopup('PAGE');
				});
		
		$(document).on('handleSavedFilterClick', function(event,rowIndex) {
			var grid = me.getAccountSetGridView();
			$( "#currencyAutoComp" ).attr('value', '');
			$( "#bankAutoComp" ).attr('value', '');
			$('#faclilityFilter').val("All");
			$('#faclilityFilter').niceSelect();
			$('#faclilityFilter').niceSelect('update');			
			if(rowIndex >= 0)
				me.doHandleViewAccountSet(grid,rowIndex);
			else
				me.clearSelection();
		});
		$(document).on('currencyChanged', function(event, currentCurrency, currentCurrencySymbol) {
					me.doHandleCurrencyChange(currentCurrency, currentCurrencySymbol);
				});
		// TODO: Need to change the below logic		
		$(document).on('savePreference', function(event) {											
				if($('#accBalLink').length > 0)
					GCP.getApplication().fireEvent('balanceSavePreference');
				else if($('#accActivityLink').length > 0)
					GCP.getApplication().fireEvent('activitySavePreference');
				else
					me.handleSavePreferences();
		});
		$(document).on('clearPreference', function(event) {
				if($('#accBalLink').length > 0)
					GCP.getApplication().fireEvent('balanceClearPreference');
				else if($('#accActivityLink').length > 0)
					GCP.getApplication().fireEvent('activityClearPreference');
				else					
					me.handleClearPreferences();
		});
		
		me.on('deleteAccountSet', function(grid, rowIndex) {
					me.doDeleteAccountSet(grid, rowIndex);
				});
		/*me.on('accountSetOrderChange', function(grid, rowIndex, intPosition,
						strDirection) {
					me.doAccountSetOrderChange(grid);
				});

		me.on('viewAccountSet', function(record) {
					me.doHandleViewAccountSet(record);
				});*/
		me.control({
			'pageSettingPopUp[itemId="summarySetting"]' : {
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
			'summaryTypeCodeSettingPopup[itemId="summaryDialog"]' : {
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
			'ribbonView[itemId="summaryCarousal"]' : {
				'ribbonSettingClick' : function() {
					me.showRibbonSetting();
				},
				'afterrender' : function() {
					/*$.ajax({
						url : 'services/userseek/paymentccy.json?$top=-1',
						success : function(data) {
								if(!Ext.isEmpty(data) && !Ext.isEmpty(data.d) && !Ext.isEmpty(data.d.preferences)){
									var arrCurrOptions = data.d.preferences;									
								}
								
								var field = $('<select>').attr({
									'id' : 'currencyList',
									'name' : 'currencyList',
									'tabindex':1,
									'width' : '20',
									'class' : 'form-control '
								});
								field.append($("<option />").val('').text('Select'))
								if (arrCurrOptions && arrCurrOptions.length > 0) {
									$.each(arrCurrOptions, function(index, opt) {
											if ((!isEmpty(strSellerCcy) && strSellerCcy == opt.CODE))
												// || index == 0)
												field.append($('<option selected="true"/>')
														.val(opt.CODE).text(opt.DESCR + " (" + opt.CODE + ") " ));
											else
												field.append($("<option />").val(opt.CODE)
														.text(opt.DESCR + " (" + opt.CODE + ") " ));
									});
								}
								if($("#summaryCarousal_SPAN").find("select").length == 0){
									field.appendTo($('#summaryCarousal_SPAN'));
								}
								field.editablecombobox({emptyText : 'Currency'});
								$('#currencyList_jq').css({"display":"inline-block","width":"20%"});
								//$('#currencyList_jq').addClass("summary-combobox");
								$('#summaryCarousal_SPAN').css({"padding-left":"10"});
								
								if(!objClientParameters.enableEqvCcy){
									$('#currencyList_jq').editablecombobox("destroy");
									$('#currencyList_jq').attr('disabled','disabled');
									$('#currencyList_jq').addClass("summary-combobox");
								}
								
								$('#currencyList').change(function(e) {
									$(document).trigger("currencyChanged",[e.target.value,e.target.value]);
			                	});
								
						},
						failure : function() {
							var arrError = new Array();
							arrError.push({
										"errorCode" : "Message",
										"errorMessage" : mapLbl['unknownErr']
									});
							paintErrors(arrError);
						}
					});*/
					var generalSettings =  objSummaryTypeCodePopupPref 
										&& Ext.decode(objSummaryTypeCodePopupPref).d.preferences
										&& Ext.decode(objSummaryTypeCodePopupPref).d.preferences.GeneralSetting
										? Ext.decode(objSummaryTypeCodePopupPref).d.preferences.GeneralSetting
										: '';
										
					var currencyDesc =  generalSettings && generalSettings.defaultCcyDesc 
									  ? generalSettings.defaultCcyDesc  : me.equiCcy;
										  
					var currencyCode = generalSettings && generalSettings.defaultCcyCode 	
					  				 ? generalSettings.defaultCcyCode  : me.equiCcy;
					 
					var currencySymbol = generalSettings && generalSettings.defaultCcySymbol && generalSettings.defaultCcySymbol != '�' 	
					  				 ? generalSettings.defaultCcySymbol  : me.equiCcySymbol;  				 
					  				 
					  					 
					  if(objClientParameters.enableEqvCcy){
							 me.doHandleCurrencyChange(currencyCode, currencySymbol);
					  }
						
					/*var field = Ext.create('Ext.form.Label', {
						itemId : 'equvivalentCurrency',
						hidden : !objClientParameters.enableEqvCcy,
						renderTo : 'summaryCarousal_SPAN',
						padding: '0 0 0 12',
						text : currencyCode
					});*/
					if(!Ext.isEmpty(currencyCode) && !Ext.isEmpty(equivalentCCY))
						$('#summaryCarousal_SPAN').text(' in ' + currencyCode);
				},
				'expand' : function(panel) {
					afterCreateCarouselReq();
					panel.doLayout();
				}
			},
			'accountSummaryView' : {
				'addFavoriteAccount' : function(strAccId) {
					me.doSavePrefferedAccounts(strAccId);
				},
				'removeFavoriteAccount' : function(strAccId) {
					me.doDeletePrefferedAccounts(strAccId);
				},
				'beforerender' : function() {
					me.getAccountSummaryView().equiCcy = me.equiCcy;
					me.getAccountSummaryView().equiCcySymbol = me.equiCcySymbol;
					
				},
				'render' : function() {
					me.populateSummaryCcyInfo();
					me.handleAccountTypeLoading();					
					//me.handleSummaryInformationRender();
				},
				'afterrender' : function() {
					objFilterPanelView = me.getAccountSummaryView();
					if(!Ext.isEmpty(selectedClient))
					{
						me.selectedClientFilter = selectedClient;
						$(document).trigger("setValueForCompany",selectedClient);
					}
					/*if(me.infoPanelPref==true){
							$('#btrSummaryListId').addClass("ft-accordion-item ft-accordion-collapsed");
				     }	*/
				}
			},
			'accountSummaryFilterView combo[itemId="clientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					var storeData = combo.getStore().data.items;
					/*First we will check whether data is present in preference or not*/
					if(! Ext.isEmpty(selectedClient))
					combo.setValue(selectedClient);	
				}
			},
			'accountSummaryView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
					// me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					//me.toggleSavePrefrenceAction(true);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);	
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);	
					//me.toggleSavePrefrenceAction(true);
				},
				'toggleGridPager' : function() {
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActionClick(grid, rowIndex, columnIndex,
							actionName, record);
				},
				'render' : function() {
					if (objAccountSummaryGroupByPref) {
						var objJsonData = Ext
								.decode(objAccountSummaryGroupByPref || {});
						objGroupByPref = objJsonData;
						if (!Ext.isEmpty(objGroupByPref)) {
							//me.toggleSavePrefrenceAction(false);
							//me.toggleClearPrefrenceAction(true);
						}
					}
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				}
			},
			'accountSummaryFilterView' : {
				'render' : function(panel) {
					me.addAllAccountSet();
					//me.handleAccountsFilterLoading();
					//var filterView = me.getFilterView();
					//filterView.handleInfoToolTip();
				},
				'beforerender' : function() {
					
						var createAdvanceFilterLabel = me.getGenericFilterView()
						.down('label[itemId="createAdvanceFilterLabel"]');
						var clearSettingButton = me.getGenericFilterView()
						.down('button[itemId="clearSettingsButton"]');
	
						if (!Ext.isEmpty(createAdvanceFilterLabel)) {
							
							if(entityType == '1')
							{
								createAdvanceFilterLabel.setText(getLabel('manageAccountset', 'Manage Account Set'));
							}
							else
							{
								createAdvanceFilterLabel.hide('');
								if( !Ext.isEmpty(clearSettingButton) )
									clearSettingButton.hide();
							}
							
						}						
					var useSettingsButton = me.getGenericFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				'afterrender' : function(panel) {
					/*panel.setFilterDateLabel(
							me.getSummaryDateFilterText(me.dateFilterIndex),
							me.strDate);
					panel.setFilterDateTitle(me.dateFilterText);*/
					me.handleDateChange(me.dateFilterIndex);
						var objLocalJsonData='';
					if (objSaveLocalStoragePref) {
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
						if (!Ext.isEmpty(objLocalJsonData.d.preferences)) {
							if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
									me.populateTempFilter(objLocalJsonData.d.preferences.tempPref.quickFilterJson);
								}
							}
						}
					}
					me.getAccountTypeCombo().addListener('change', function(combo, newValue, oldValue,
							eOpts) {
						var me = this;						
						me.handleAccount(newValue);
						selectedFilter = newValue.btnId;
						me.disablePreferencesButton("savePrefMenuBtn", false);
					}, me);
				},
				'setFavoriteArray' : function(arrFavoriteAccounts) {
					me.arrFavAccounts = arrFavoriteAccounts;
				},
				'handleAccountsFilterClick' : function(btn) {
					me.doHandleAccountsFilterClick(btn);
				},
				'switchSummary' : function() {
					me.doHandleSwitchTo();
				},
				'dateChange' : function(btn, opts) {
					me.dateFilterText = btn.text;
					me.dateFilterLabel = btn.text;
					me.dateFilterIndex = btn.btnValue;
					me.handleDateChange(btn.btnValue);
					if (btn.btnValue !== '7') {
						//me.toggleSavePrefrenceAction(true);
						me.doHandleChangeDateFilter();
					}
				},
				'dateRangeChange' : function(btn) {
					me.doHandleChangeDateFilter();
					//me.toggleSavePrefrenceAction(true);
				}
			},
			'accountSummaryFilterView combo[itemId="viewAccountCombo"]' : {
				'render' : function() {
					me.accountTypeComboRender();
				}
			},
			'accountSummaryFilterView label[itemId="latestBtn"]' : {
				'click' : function(btn) {
					var realTimeBtn = me.getRealTimeBtn();
					realTimeBtn.removeCls('ui-datepicker-header');
					btn.addCls('ui-datepicker-header');	
					me.doHandleInformationFilterClick(btn);					
				}
			},
			'accountSummaryFilterView label[itemId="realTimeBtn"]' : {
				'click' : function(btn) {
					var latestBtn = me.getLatestBtn();
					latestBtn.removeCls('ui-datepicker-header');
					btn.addCls('ui-datepicker-header');	
					me.doHandleInformationFilterClick(btn);
				}
			},
			'accountSummaryFilterView component[itemId="displayDate"]' : {
				render : function() {
					$('#displayDataPicker').datepick({
								dateFormat : strjQueryDatePickerDateFormat, 
								monthsToShow : 1,
								changeMonth : true,
								changeYear : true,
								minDate : dtHistoryDate,
								rangeSeparator : '  to  ',
								maxDate : me.getPreviousDate(dtApplicationDate),
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										var strSqlDateFormat = 'Y-m-d';
										me.datePickerSelectedDate[0] = Ext.Date.format(dates[0],strSqlDateFormat);
										me.datePickerSelectedDate[1] = Ext.Date.format(dates[1],strSqlDateFormat);
										me.dateFilterIndex = me.dateRangeFilterVal;
										me.dateFilterLabel = getLabel('daterange', 'Date Range');
										me.handleDateChange(me.dateRangeFilterVal);
										me.doHandleChangeDateFilter();
									//	me.toggleSavePrefrenceAction(true);
									}
								}
					});
				}
			},
			'accountSetPopUpView[itemId="accountSetPopUpView"]' : {
				'deleteAccountSet' : function(grid, rowIndex) {
					me.doDeleteAccountSet(grid, rowIndex);
				},
				'accountSetOrderChange' : function(grid, rowIndex, intPosition,
						strDirection) {
					me.doAccountSetOrderChange(grid);
				},
				'saveAccountSet' : function(grid, data) {
					me.doSaveAccountSet(grid, data);
				}

			},
			'accountSummaryView summaryInformationView' : {
				'render' : function(panel) {
					me.handleSummaryInformationRender(panel);
				},
				'saveSummaryTypeCodes' : function(arrTypeCodes) {
					me.doSaveSummaryTypeCodes(arrTypeCodes);
				}				
			},			
			'accountSummaryView accountSummaryTitleView' : {
				'performReportAction' : function(btn, opts) {
					me.downloadReport(btn.itemId);
				},
				'switchSummary' : function() {
					me.doHandleSwitchTo();
				}
			},
			'tooltip[itemId="infoToolTip"]' : {
				'beforeshow' : function(tip) {
					me.setInfoToolTipVal(tip);
				}
			},			
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					if(isActivityOn)
						GCP.getApplication().fireEvent('activityCreateAdvanceFilterLabel');
					else
						showAdvanceFilterPopup(me);
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					if(isBalanceOn)
					GCP.getApplication().fireEvent('balanceHandleClearSettings');
					else if(isActivityOn)
						GCP.getApplication().fireEvent('activityHandleClearSettings');
					else
						me.handleClearSettings();
				}
			}
		});
	},	
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getAccountSummaryView(), gridModel = null, objData = null;
		var colModel = null, arrCols = null;
		if (data && data.preference)
			objData = Ext.JSON.decode(data.preference)
		if (_charCaptureGridColumnSettingAt === 'L' && objData
				&& objData.gridCols) {
			arrCols = objData.gridCols;
			colModel = objSummaryView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel
				}
			}
		}
		// TODO : Preferences and existing column model need to be merged
		objGroupView.reconfigureGrid(gridModel);
	},
	
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
				me.preferenceHandler.saveModulePreferences(me.strRibbonPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.preferenceHandler.savePagePreferences(me.strRibbonPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
	restoreSummaryTypeCodePageSetting : function(arrPref, strInvokedFrom) {
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
			me.preferenceHandler.clearPagePreferences(me.strRibbonPageName, arrPref,
					me.postHandlePageGridSetting, args, me, false);
		} else
			me.preferenceHandler.clearPagePreferences(me.strRibbonPageName, arrPref,
					me.postHandlePageGridSetting, null, me, false);
	},
	saveSummaryTypeCodePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from summary ribbon page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strRibbonPageName, arrPref,
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
			me.preferenceHandler.readPagePreferences(me.strRibbonPageName,
						me.postDoHandleSaveRibbonPagePref, null, me, true);
		}
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
		} else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
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
				if (me.getAccountSummaryView()) {
					objGroupView =me.getAccountSummaryView().createGroupView();
					me.getAccountSummaryView().add(objGroupView);
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
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
		
		me.pageSettingPopup = null;
		var arrCols = null, args = null;
		var groupView = me.getGroupView();
		var strModule = groupView.getSubGroupInfo().groupCode;
		var objSummaryView = me.getAccountSummaryView();

		if (!Ext.isEmpty(objSummaryPref)) {
			objPrefData = Ext.decode(objSummaryPref);
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
					: Ext.decode(me.getJsonObj(arrGenericGridColumnModel) || '[]');

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		if (strModule!='all' && objPrefData.d.preferences.ColumnSetting == null)
		{
			args = {
					'module' : strModule
				};
			if (!Ext.isEmpty(objDefPref['SUMMARY']['GRID'][args['module']]))
				{
					objColumnSetting = objDefPref['SUMMARY']['GRID'][args['module']]['columnModel']
						|| objSummaryView.getDefaultColumnPreferences() || null;
				}
			else
				{
					objColumnSetting = objSummaryView.getDefaultColumnPreferences() || null;
				}
		}
		
		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/groupViewFilter.json';
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
					itemId : 'summarySetting',
					cfgDefaultColumnModel : objColumnSetting,
					showAdvanceFilter : false,
					cfgViewOnly : _IsEmulationMode,
					cfgInvokedFrom : strInvokedFrom,
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	/* Page setting handling ends here */

	setWidgetFilters : function() {
		var me = this;		
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		for (var i = 0; i < arrFilterJson.length; i++) {
			if (arrFilterJson[i].field === 'summaryFromDate') {
				//widgetDtfilter = true;
				me.dateFilterFromVal = arrFilterJson[i].value1;
				me.dateFilterIndex = arrFilterJson[i].displayType;
				me.dateFilterLabel = arrFilterJson[i].dateLabelwidget;
				me.datePickerSelectedDate[0]=Ext.Date.parse(arrFilterJson[i].value1, 'Y-m-d');;
			}
			else if (arrFilterJson[i].field === 'summaryToDate') {
				//widgetDtfilter = true;
				me.dateFilterToVal = arrFilterJson[i].value1;
				me.datePickerSelectedDate[1]=Ext.Date.parse(arrFilterJson[i].value1, 'Y-m-d');;
				me.dateFilterLabel = arrFilterJson[i].dateLabelwidget;
				me.dateFilterIndex = arrFilterJson[i].displayType;
			}
			else if (arrFilterJson[i].field === 'accountset'){
				//widgetAccountSet = true;
				me.accountFilterName = arrFilterJson[i].value2;
				me.accountFilter = arrFilterJson[i].value1;
			}
		}
		objSaveLocalStoragePref = '';
		me.getQuickJsonData();
	},
	updateConfigs : function() {
		var me = this;
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var strSqlDateFormat = 'Y-m-d';
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strCcy = null, data = null, strCcySymbol = null;
		var	args = {
				'module' : 'panels'
			};
		if (typeof objAccountSummaryGroupByPref != 'undefined'
				&& objAccountSummaryGroupByPref) {
			data = Ext.decode(objAccountSummaryGroupByPref);
			strCcy = data['equiCcy'];
			strCcySymbol = data['equiCcySymbol'];
		}
		if (typeof objAccountSummaryPanelPref != 'undefined'
				&& objAccountSummaryPanelPref) {
			data = Ext.decode(objAccountSummaryPanelPref);
			filterRibbonCollapsed = data['filterPanel'];
			infoRibbonCollapsed = data['infoPanel'];
		}
		me.equiCcy = strCcy
				|| (!Ext.isEmpty(strSellerCcy) ? strSellerCcy : 'USD');
		me.equiCcySymbol = strCcySymbol
				|| (!Ext.isEmpty(strSellerCcySymbol) ? strSellerCcySymbol : '$');
		me.summaryType = summaryType;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if (!me.isIntraDay()) {
			me.dateFilterIndex = '2';
			me.dateFilterFromVal = me.dateHandler.getYesterdayDate(date);
			me.dateFilterFromVal = me.dateFilterFromVal;
		} else {
			me.dateFilterIndex = '1';
			me.dateFilterFromVal = date;
			me.dateFilterToVal = date;
		}
		me.strDate = Ext.Date.format(me.dateFilterFromVal, dtFormat);
		if (!Ext.isEmpty(me.clientParams)
				&& !Ext.isEmpty(me.clientParams.filterDays))
			clientFromDate = me.dateHandler.getDateBeforeDays(date,
					me.clientParams.filterDays);
		/*me.preferenceHandler.readModulePreferences(me.strPageName,
					'panels', me.postReadPanelPrefrences, args, me, true);*/
		me.preferenceHandler.readModulePreferences(me.strPageName,
					'filterPref', me.postReadfilterPrefrences, args, me, true);	

			var	args = {
				'module' : 'panels'
			};
		me.preferenceHandler.readModulePreferences(me.strPageName,
					'panels', me.postReadPanelPrefrences, args, me, true);					
					
	},
	postReadPanelPrefrences : function (data, args, isSuccess) {
		var me = this;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			//filterRibbonCollapsed = objPref.filterPanel;
			
				infoRibbonCollapsed = objPref.infoPanel;
				
				me.infoPanelPref = infoRibbonCollapsed;
				
				/*if(infoRibbonCollapsed == false)
					$('#btrSummaryListId').addClass("");
				else
					$('#btrSummaryListId').addClass("ft-accordion-item ft-accordion-collapsed");*/
		}

		
	},
	submitForm : function( url )
	{
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.action = url;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	postReadfilterPrefrences : function (data, args, isSuccess) {
		var me = this;
		var objDateLbl = {
			'' : getLabel('latest', 'Latest'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel('accsummary.lastweektodate', 'Last Week'),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel('accsummary.lastMonthToDate', 'Last Month'),
			'8' : getLabel('thisquarter', 'This Quarter'),
			'9' : getLabel('accsummary.lastQuarterToDate', 'Last Quarter'),
			'12' : getLabel('latest', 'Latest'),
			'13' : getLabel('daterange', 'Date Range')
		};
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			me.accountFilterName = objPref.accSetName;
			me.accountFilter = objPref.accSetArray;
			if(objPref.displayDate) {
				me.dateFilterLabel = objDateLbl[objPref.displayDate.displayDateFilterIndex];
				me.dateFilterIndex = objPref.displayDate.displayDateFilterIndex;
				if(me.dateFilterIndex === '13') {
					var strDtFrmValue = objPref.displayDate.displayDateFrom;
					var strDtToValue = objPref.displayDate.displayDateTo;
				
					if (!Ext.isEmpty(strDtFrmValue)) {
						me.dateFilterFromVal = strDtFrmValue;
						me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d');
					}
					if (!Ext.isEmpty(strDtToValue)) {
						me.dateFilterToVal = strDtToValue;
						me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d');
					}
				}
			}
		}	
	},
	getQuickJsonData : function (){
		var me=this;
		var jsonData = {
			    d: []
			};
		if(!Ext.isEmpty(me.accountFilterName) && me.accountFilterName !== 'all' && me.accountFilterName !== 'allAcc'){
		jsonData.d.push({ 
			        "dataType" : "S",
			        "displayType"  : 5,
			        "displayValue1" : me.accountFilterName,
			        "operatorValue" : "lk",
			        "paramFieldLable" : getLabel('lblsavedaccountset',	'Account Set'),
			        "paramName" : 'accountSet',
			        "paramValue1" : encodeURIComponent(me.accountFilterName.replace(new RegExp("'", 'g'), "\''")),
			        "valueArray" : me.accountFilter
			    });
		}
		if((!Ext.isEmpty(me.selectedClientFilter) && entityType === "0"))
		{
			jsonData.d.push({ 
				        "dataType" : "S",
				        "displayType"  : 5,
				        "displayValue1" : me.selectedClientFilterDesc,
				        "operatorValue" : "eq",
				        "paramFieldLable" : getLabel('lblcompany', 'Company Name'),
				        "paramName" : 'client',
				        "paramValue1" : encodeURIComponent(me.selectedClientFilter.replace(new RegExp("'", 'g'), "\''"))
				    });
			}
		if (!me.isIntraDay()) {
			var dtObj = me.getDateJson(me.dateFilterIndex);
			var operatorValue = "bt";
			if(dtObj.fromDate === dtObj.toDate)
				operatorValue = "eq";
			if (dtObj) {
			var convertedDate = me.convertDate(dtObj.fromDate);				
			
					jsonData.d.push({ 
			        "dataType" : "D",
			        "operatorValue"  :operatorValue,
			        "paramFieldLable" : getLabel('date', 'Date'),
			        "paramName" : "EntryDate",
			        "paramIsMandatory" : true,
			        "paramValue1" : dtObj.fromDate,
			        "paramValue2" : dtObj.toDate,
			        "dateFilterIndex" : me.dateFilterIndex
			    });
			}				
			}
		return jsonData.d;
	},
	convertDate : function(dateVal){
		var dtFormat = strExtApplicationDateFormat ? strExtApplicationDateFormat : "m/d/Y";
		var formattedDateVal = Ext.util.Format.date(Ext.Date.parse(dateVal, 'Y-m-d'),dtFormat);
		return formattedDateVal;
	},	
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objLocalJsonData = '';
		if (objSaveLocalStoragePref)
					objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
						
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
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		selectedFilter=me.accountFilterName;
		if((!me.isIntraDay()) ||(me.accountFilterName !== 'all' && me.accountFilterName !== 'allAcc')){
		var arrOfParseQuickFilter = generateFilterArray(me.getQuickJsonData());
			if (arrOfParseQuickFilter){
				me.getGenericFilterView().updateFilterInfo(arrOfParseQuickFilter);
			}
		}else{
			me.getGenericFilterView().updateFilterInfo([]);
		}
		if((entityType === "0" && me.selectedClientFilter !== '' && null!=me.selectedClientFilterDesc))
		{
			var arrOfParseQuickFilter = generateFilterArray(me.getQuickJsonData());
			if (arrOfParseQuickFilter)
			{
				me.getGenericFilterView().updateFilterInfo(arrOfParseQuickFilter);
			}
		}
		me.reportGridOrder = strUrl;
		strUrl = strUrl + '&' + csrfTokenName + "=" + csrfTokenValue;
		grid.loadGridData(strUrl, null, null, false);
				
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
			me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
		}
	}		
	},
	doHandleRowActions : function(actionName,grid,record) {
		var me = this;
		var strEventName = null;
		var recId = record.raw.identifier;
		var strActivityType = 'ALL';
		if (actionName === 'btnActivity') {
			strEventName = 'showActivity';
			//strActivityType = 'LATEST';
		} else if (actionName === 'btnLatestActivity') {
			strEventName = 'showActivity';
			strActivityType = 'DATERANGE';
		} else if (actionName === 'btnBalances') {
			strEventName = 'showBalances';
		} else if (actionName === 'btnAdditionalInfo') {
			/*me.additionalInfoPopup.recordId = recId;
			me.additionalInfoPopup.record = record;
			me.additionalInfoPopup.show();*/
			showAdditionalInfoPopup(record);
		} else if (actionName === 'btneStatements') {
			showEstatementInfoPopup(record);
		}
		if (strEventName) {
			var group = me.getGroupView();
			if (!Ext.isEmpty(group))
			{
				var filterButton = group.down('button[itemId="filterButton"]');
				if (filterButton) {					
					if (filterButton.filterVisible) {
						filterButton.panel.hide();
						filterButton.filterVisible = false;
						filterButton.removeCls('filter-icon-hover');
					}
				}
			}
			if ((actionName === 'btnActivity' || actionName === 'btnLatestActivity'
				|| actionName === 'btnBalances') && brPrvSumLoad) {
				record.set('preSumFromDate', me.getDateJson(me.dateFilterIndex).fromDate);
				record.set('preSumToDate', me.getDateJson(me.dateFilterIndex).toDate);
			}
			if (actionName === 'btnActivity'
					|| actionName === 'btnLatestActivity') {
				GCP.getApplication().fireEvent(strEventName, record,
						me.summaryType, strActivityType);

			} else {
				GCP.getApplication().fireEvent(strEventName, record,
						me.summaryType);
			}
		}
	},
	doHandleRowActionClick : function(grid, rowIndex, columnIndex, actionName,
			record) {
		var me = this;
		var strEventName = null;
		var recId = record.raw.identifier;
		var strActivityType = 'ALL';
		if (actionName === 'btnActivity') {
			strEventName = 'showActivity';
			//strActivityType = 'LATEST';
		} else if (actionName === 'btnLatestActivity') {
			strEventName = 'showActivity';
			strActivityType = 'DATERANGE';
		} else if (actionName === 'btnBalances') {
			strEventName = 'showBalances';
		} else if (actionName === 'btnAdditionalInfo') {
			/*me.additionalInfoPopup.recordId = recId;
			me.additionalInfoPopup.record = record;
			me.additionalInfoPopup.show();*/
			showAdditionalInfoPopup(record);
		} else if (actionName === 'btneStatements') {
			showEstatementInfoPopup(record);
		}
		if (strEventName) {
			var group = me.getGroupView();
			if (!Ext.isEmpty(group))
			{
				var filterButton = group.down('button[itemId="filterButton"]');
				if (filterButton) {					
					if (filterButton.filterVisible) {
						filterButton.panel.hide();
						filterButton.filterVisible = false;
						filterButton.removeCls('filter-icon-hover');
					}
				}
			}
			if ((actionName === 'btnActivity'
				|| actionName === 'btnBalances' || actionName === 'btnLatestActivity') && brPrvSumLoad) {
				record.set('preSumFromDate', me.getDateJson(me.dateFilterIndex).fromDate);
				record.set('preSumToDate', me.getDateJson(me.dateFilterIndex).toDate);
			}
			if (actionName === 'btnActivity'
					|| actionName === 'btnLatestActivity') {
				GCP.getApplication().fireEvent(strEventName, record,
						me.summaryType, strActivityType);

			}
			else if (actionName === 'btnBalances') {
				GCP.getApplication().fireEvent(strEventName, record,
						me.summaryType,me.dateFilterIndex);

			}			
			else {
				GCP.getApplication().fireEvent(strEventName, record,
						me.summaryType);
			}
		}
	},
	generateFilterUrl : function(groupInfo, subGroupInfo) {
		var me = this, strUrl = '&$summaryType={0}&$accountID={1}&$eqCurrency={2}&';
		if(!Ext.isEmpty(filterUrl))
		{
			var filter=filterUrl;
			if(filterUrl.indexOf('summaryType=previousday') != -1){
				me.summaryType = 'previousday';
			}
			else if(filterUrl.indexOf('summaryType=intraday') != -1){
				me.summaryType = 'intraday';
			}
			filterUrl='';
			
			return filter;
		}
		
		var strModule = '', args=null;
		strUrl = Ext.String.format(strUrl, me.summaryType, me.accountFilter,
				me.equiCcy);
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupTypeCode)) {
			strModule = subGroupInfo.groupCode;
		}
		else
		{
			strModule = groupInfo.groupTypeCode;
		}
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupQuery)) {
			strUrl += subGroupInfo.groupQuery;
		}
		else
		{
			if (strModule === 'ACCSUM_OPT_ASSET') {
				strUrl += '$filterOn=ASSET&$filterValue=ALL'
			} else if (strModule === 'ACCSUM_OPT_LIABILITY') {
				strUrl += '$filterOn=LIABILITY&$filterValue=ALL'
			} else
				strUrl += '$filterOn=&$filterValue=';
		}
		args = {
				'module' : strModule
		};
		if (!Ext.isEmpty(objDefPref['SUMMARY']['GRID'][args['module']]))
		{
			strUrl += '&$serviceType='+objDefPref['SUMMARY']['GRID'][args['module']]['serviceType'];
			strUrl += '&$serviceParam='+objDefPref['SUMMARY']['GRID'][args['module']]['serviceParam'];
		}
		else
		{
			strUrl += '&$serviceType='+mapService['BR_STD_SUMM_GRID'];
			strUrl += '&$serviceParam='+mapService['BR_GRIDVIEW_GENERIC'];
		}
		// dateFilterIndex 12 : latest
		if (!me.isIntraDay()) {
			var dtObj = me.getDateJson(me.dateFilterIndex);
			if (dtObj) {
				strUrl += '&$summaryFromDate=' + dtObj.fromDate;
				strUrl += '&$summaryToDate=' + dtObj.toDate;
			}
		}
		strUrl += '&$pageName=' + me.strPageName;
		return strUrl;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Commented the code.
		// me.handleSummaryInformationRender();
		if (groupInfo && groupInfo.groupTypeCode) {
			strModule = subGroupInfo.groupCode;
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			args = {
				'module' : strModule
			};
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postDoHandleGroupTabChange, args, me, true);
		} else {
			objGroupView.reconfigureGrid(null);
		}
	},		
	postDoHandleGroupTabChange : function(data, args, isSuccess) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getAccountSummaryView(),arrSortState=new Array(),objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		
		var objLocalJsonData = '';
		if (objSaveLocalStoragePref)
					objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
						
		
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
		
		if (data && data.preference) {
			//me.toggleClearPrefrenceAction(true);
			objPref = Ext.decode(data.preference);
			if(objPref && objPref.gridCols){
				arrCols = objPref.gridCols
					|| objSummaryView.getDefaultColumnPreferences() || null;
			}
			else if ((objDefPref['SUMMARY']['GRID'])&&(objDefPref['SUMMARY']['GRID'][args['module']])&&!Ext.isEmpty(objDefPref['SUMMARY']['GRID'][args['module']]))
			{
			arrCols = objPref.gridCols
					|| objDefPref['SUMMARY']['GRID'][args['module']]['columnModel']
					|| objSummaryView.getDefaultColumnPreferences() || null;
			}
			arrCols = arrCols
					|| objSummaryView.getDefaultColumnPreferences() || null;
			
			intPgSize = intPageSize || objPref.pgSize || _GridSizeTxn;
			arrSortState=objPref.sortState;
			colModel = objSummaryView.getColumns(arrCols);
			showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;	
		} else {
			intPgSize = intPageSize || _GridSizeTxn;
			if (!Ext.isEmpty(objDefPref['SUMMARY']['GRID'][args['module']]))
			{
			arrCols = objDefPref['SUMMARY']['GRID'][args['module']]['columnModel']
					|| objSummaryView.getDefaultColumnPreferences() || null;
			}
			else
			{
			arrCols = objSummaryView.getDefaultColumnPreferences() || null;
			}
			
			colModel = objSummaryView.getColumns(arrCols);
		}
		if (colModel) {
			gridModel = {
				columnModel : colModel,
				pageSize : intPageSize,
				pageNo : intPageNo
			};
		}
		if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
			gridModel = gridModel ? gridModel : {};
			gridModel.pageSize = intPageSize;
			gridModel.pageNo = intPageNo;
			gridModel.storeModel = {sortState: sortState};
			
		}
		me.handleSummaryInformationRender();
		objGroupView.reconfigureGrid(gridModel);
	},
	doDeletePrefferedAccounts : function(strAccountId) {
		var me = this;
		var arrPrefferedAccounts = me.arrFavAccounts || [], jsonPost = {};
		var summaryView = me.getAccountSummaryView();
		if (!Ext.isEmpty(strAccountId))
			arrPrefferedAccounts = Ext.Array.remove(arrPrefferedAccounts,
					strAccountId);

		jsonPost['accounts'] = arrPrefferedAccounts;
		me.arrFavAccounts = arrPrefferedAccounts;
		me.flagFavSet = true;
		me.savePrefferedAccounts();
	},
	doSavePrefferedAccounts : function(strAccountId) {
		var me = this;
		var arrPrefferedAccounts = me.arrFavAccounts || [], jsonPost = {};
		var summaryView = me.getAccountSummaryView();
		if (!Ext.isEmpty(strAccountId))
			arrPrefferedAccounts.push(strAccountId);

		me.arrFavAccounts = arrPrefferedAccounts;
		me.flagFavSet = true;
		me.savePrefferedAccounts();
	},
	savePrefferedAccounts : function() {
		var me = this;
		var jsonPost = {};
		var summaryView = me.getAccountSummaryView();
		var filterView = me.getFilterView();
		jsonPost['accounts'] = me.arrFavAccounts || [];

		summaryView.setLoading(true);
		me.preferenceHandler.saveModulePreferences(
				me.strPageName,
				me.mapUrlDetails['strPrefferdAccount'].moduleName, jsonPost,
				me.postHandlesavePrefferedAccounts, null, me, true);
	},	
	postHandlesavePrefferedAccounts : function(data, args, isSuccess) {
		var me = this;
		var summaryView = me.getAccountSummaryView();
		summaryView.setLoading(false);
		
		var accountTypeCombo = me.getAccountTypeCombo();
		
		if(accountTypeCombo) {
			var accountTypeFav = accountTypeCombo.getStore().getAt(1);
			var favAttrBtn = {
				btnId : 'Favorites',
				accArray : me.arrFavAccounts
			};
			accountTypeFav.set('text', getLabel('favorites', 'Favorites') + "(" + me.arrFavAccounts.length + ")");
			accountTypeFav.set('btn', favAttrBtn);
		}
		// TODO : Favourite Account Count to be updated
	},
	
	/*postHandlesavePrefferedAccounts : function(data, args, isSuccess) {
		var me = this;
		var filterView = me.getFilterView();
		var summaryView = me.getAccountSummaryView();
		summaryView.setLoading(false);
		if (filterView) {
			filterView.updateFavoriteAccountCount(me.arrFavAccounts);
		}

	},*/
	handleAccountsFilterLoading : function() {
		var me = this;
		me.preferenceHandler.readModulePreferences(
				me.strPageName,
				me.mapUrlDetails['strPrefferdAccount'].moduleName,
				me.postHandleAccountsFilterLoading, null, me, true);
	},
	postHandleAccountsFilterLoading : function(data, args, isSuccess) {
		var me = this;
		var filterView = me.getFilterView();
		if (filterView) {
			filterView.updateAccountsFilterView(data, me.accountFilterName);
			filterView.updateFavoriteAccountCount(me.arrFavAccounts);
		}
		me.handleAccountSetLoading();
	},
	handleAccountSetLoading : function() {
		var me = this;
		me.preferenceHandler.readModulePreferences(
				me.strPageName,
				me.mapUrlDetails['strPrefferdAccountSets'].moduleName,
				me.postHandleAccountSetLoading, null, me, true);
	},
	postHandleAccountSetLoading : function(data, args, isSuccess) {
		var me = this;
		var filterView = me.getFilterView();
		var arrData = (data && data.preference)
				? JSON.parse(data.preference)
				: null;
		if (filterView)
			filterView.addAccountSets(arrData, me.accountFilterName);
	},
	doHandleAccountsFilterClick : function(btn) {
		var me = this;
		var groupView = me.getGroupView();
		me.accountFilter = btn.accArray;
		me.accountFilterName = btn.btnId;
		me.handleSummaryInformationRender();
		if (groupView)
			groupView.refreshData();
	},
	doDeleteAccountSet : function(delValue) {
		var me = this;
		var grid = me.getAccountSetGridView();
		var store = grid.getStore();
		var preferenceArray = [];
		var rowIndex = -1; 
		var args = {
			'grid' : grid
		};
		if (store)
		{
			var recordToDel = null;
			 store.each(function(record)   
			  {   
		      	if(record.get('accountSetName') === delValue){
		      		recordToDel = record;
		      		rowIndex = store.indexOf(record);
		      	}
			  });
			
			store.remove(recordToDel);
		}
		if (rowIndex == 0 || rowIndex == 1) {
			me.accSetChangeFlag = true;
		}

		if (!Ext.isEmpty(store)) {
			store.each(function(rec) {
						preferenceArray.push(rec.raw);
					});
		}
		args['data'] = preferenceArray;
		var objField = me.getGenericFilterView().down('combo[itemId="viewAccountCombo"]');
		if(!Ext.isEmpty(objField)){
			me.accountFilterName = 'all';
			me.accountFilter = 'ALL';
			var comboBox = me.getAccountTypeCombo();						
			comboBox.setValue(me.accountFilter);
		}
		me.handleClearSettings();
		me.preferenceHandler.saveModulePreferences(
				me.strPageName,
				me.mapUrlDetails['strPrefferdAccountSets'].moduleName,
				preferenceArray, me.postHandleDoDeleteAccountSet, args, me,
				false);
	},	
	doAccountSetOrderChange : function(grid) {
		var me = this;
		var store = grid.getStore();
		var preferenceArray = [];
		var args = {
			'grid' : grid
		};
		if (!Ext.isEmpty(store)) {
			store.each(function(rec) {
						preferenceArray.push(rec.raw);
					});
		}
		args['data'] = preferenceArray;
		me.preferenceHandler.saveModulePreferences(
				me.strPageName,
				me.mapUrlDetails['strPrefferdAccountSets'].moduleName,
				preferenceArray, me.postHandleAccountSetChange, args, me, false);
	},
	postHandleAccountSetChange : function(data, args, isSuccess) {
		var me = this;
		var title, strMsg, imgIcon;
		if (data && isSuccess && isSuccess === 'N') {
			title = getLabel('instrumentSaveFilterPopupTitle',
					'Message');
			strMsg = data.d.preferences.error.errorMessage;
			imgIcon = Ext.MessageBox.ERROR;
			Ext.MessageBox.show({
						title : title,
						msg : strMsg,
						width : 200,
						buttons : Ext.MessageBox.OK,
						cls : 'ux_popup',
						icon : imgIcon
					});
			me.accountSetSaveFlag = false;
		}
		else
		{
			var me = this;
			var grid = args['grid'];
			var filterView = me.getFilterView();
			if (filterView) {
				//filterView.addAccountSets(args['data'], me.accountFilterName);
			}
			me.accountSetSaveFlag = true;
		}
	},
	doSaveAccountSet : function(grid, record) {
		var me = this;
		var store = grid.getStore();
		var preferenceArray = [];
		var isRecordAdded = false;
		var args = {
			'grid' : grid
		};
		if (!Ext.isEmpty(store)) {
			store.each(function(rec) {
						if (record.accountSetName === rec.raw.accountSetName) {
							isRecordAdded = true;
							preferenceArray.push(record);
						} else
							preferenceArray.push(rec.raw);
					});
		}
		if (!isRecordAdded)
			preferenceArray.push(record);

		args['data'] = preferenceArray;
		me.preferenceHandler.saveModulePreferences(
				me.strPageName,
				me.mapUrlDetails['strPrefferdAccountSets'].moduleName,
				preferenceArray, me.postHandleAccountSetChange, args, me, false);
	},
	showRibbonSetting : function() {
		/*$("#summaryDialog").dialog({ 
			title:"Type Codes",
			autoOpen: false,
			resizable : false,
			draggable : false,
			modal: true,
			minHeight : 156,
			maxHeight : 550,
			//width : 320,
			minWidth : 400,
			maxWidth : 735,
			open: function(event, ui){	
				//reset summary settings combo
				$('#summarySettingsCombo').empty();
				$.each(summaryData, function (i, item) {
					//create summary settings combo 
					$('#summarySettingsCombo').append($('<option>', { 
						value: item[carouselAmount],
						text : item[carouselTitle],
						typeCode : item[typeCode]
					}));
				});
			}
		});		
		$('#summaryDialog').dialog("open");*/
		var me=this;
		var objTypeCodePrf = Ext.decode(objSummaryTypeCodePopupPref);
		var objTypecodeColumnSetting = objTypeCodePrf && objTypeCodePrf.d.preferences
					&& objTypeCodePrf.d.preferences.ColumnSetting
					&& objTypeCodePrf.d.preferences.ColumnSetting.gridCols
					? me.getJsonObj(objTypeCodePrf.d.preferences.ColumnSetting.gridCols)
					: Ext.decode(me.getJsonObj(arrGenericRibbonColumnModel) || '[]');
		me.typeCodeSettingsPopup = Ext.create(
				'GCP.view.common.SummaryTypeCodeSettingPopup',
				{
					itemId : 'summaryDialog',
					cfgDefaultColumnModel : objTypecodeColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgPopUpData : {
						currencyUrl : 'services/userseek/eqvcurrency.json?$top=-1',
						cfgData : Ext.decode(objSummaryTypeCodePopupPref)
					}
				});
		me.typeCodeSettingsPopup.show();
		me.typeCodeSettingsPopup.center();
	},
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
	populateSummaryInformationView : function(strUrl, updateFlag) {
		var me = this;
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		while (arrMatches = strRegex.exec(strUrl)) {
     		objParam[arrMatches[1]] = arrMatches[2];
    	}
        var strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
        strUrl = strGeneratedUrl;
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					params:objParam,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							summaryData = me.getTypeCodeJsonObj(data.d.summary);
							/*var summaryInfoView = me.getSummaryInfoView();
							if (!Ext.isEmpty(summaryInfoView)) {
								summaryInfoView.updateSummaryInfoView(
										summaryData, eqCcy);
							}*/
						var objTypeCodePrf = Ext.decode(objSummaryTypeCodePopupPref);
							var colPrefSettings = objTypeCodePrf && objTypeCodePrf.d.preferences
					&& objTypeCodePrf.d.preferences.ColumnSetting
					&& objTypeCodePrf.d.preferences.ColumnSetting.gridCols
					? objTypeCodePrf.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericRibbonColumnModel || '[]');
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
							equiCcyLogo = me.equiCcySymbol;
							afterCreateCarouselReq();
							$('#currentCurrencyLabelId').html(me.equiCcy);
							currencysymbol = me.equiCcySymbol;
							$('#currAutoCompleter').val(me.equiCcy);
							/*$('#summaryCarousalTargetDiv').carousel({
								data : summaryData,
								titleNode : "typeCodeDescription",
								contentRenderer: function(value) {
									if (value.dataType === 'count')
										return  value.typeCodeAmount ? value.typeCodeAmount :"";
									else
										return  value.typeCodeAmount ?  me.equiCcySymbol + " " + value.typeCodeAmount : "";
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
	generateTypeCodeUrl : function() {
		var me = this;
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var strSqlDateFormat = 'Y-m-d';
		var parsedDate = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var summaryDateParam = "",strModule="",args=null;
		var groupView = me.getGroupView();
		var typeCodeUrl; 
		if(me.summaryType==null)
			me.summaryType = summaryType;
		if (me.summaryType === "intraday") {
			typeCodeUrl = me.strIntraDaySummaryRibbonUrl;
		} else if (me.summaryType === "previousday") {
			typeCodeUrl = me.strPreviousDaySummaryRibbonUrl;
		}
		groupInfo = groupView.getGroupInfo() || '{}';
		subGroupInfo = groupView.getSubGroupInfo() || {};
		typeCodeUrl += '?$pageName='+me.strPageName+'&$moduleName=typecodesummaryNewUX';
		if(Ext.isEmpty(filterUrl)){
		typeCodeUrl += '&$eqCurrency=' + me.equiCcy;
		typeCodeUrl += '&$summaryType=' + me.summaryType;
		
		if(!Ext.isEmpty(me.accountFilter) && me.accountFilter != "ALL")
			typeCodeUrl += '&$accountID=' + me.accountFilter;
		
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupTypeCode)) {
			strModule = subGroupInfo.groupCode;
		}
		else
		{
			strModule = groupInfo.groupTypeCode;
		}
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupQuery)) {
			typeCodeUrl += '&'+subGroupInfo.groupQuery;
		}
		else
		{
			typeCodeUrl += '&$filterOn=&$filterValue=';
		}
		args = {
				'module' : strModule
		};
		if (!Ext.isEmpty(objDefPref['SUMMARY']['RIBBON'][args['module']]))
		{
			typeCodeUrl += '&$serviceType='+objDefPref['SUMMARY']['RIBBON'][args['module']]['serviceType'];
			typeCodeUrl += '&$serviceParam='+objDefPref['SUMMARY']['RIBBON'][args['module']]['serviceParam'];
		}
		else
		{
			typeCodeUrl += '&$serviceType=BR_STD_SUMM_RIBBON';
			typeCodeUrl += '&$serviceParam=BR_RIBBON_GENERIC';
		}

		// dateFilterIndex 12 : latest
		if (!me.isIntraDay()) {
			var dtObj = me.getDateJson(me.dateFilterIndex);
			if (dtObj) {
				typeCodeUrl += '&$summaryFromDate=' + dtObj.fromDate;
				typeCodeUrl += '&$summaryToDate=' + dtObj.toDate;
			}
		}
		}
		else{
			typeCodeUrl += filterUrl;	
		}
		
		return typeCodeUrl;
	},
	getDateJson : function(strDateFilterIndex) {
		var me = this;
		var retJson = null;
		var objDates = me.getDateParam(strDateFilterIndex);
		retJson = {
			fromDate : objDates.fieldValue1,
			toDate : objDates.fieldValue2
		};
		return retJson;
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
	isIntraDay : function() {
		var retValue = false;
		var me = this;
		if (!Ext.isEmpty(me.summaryType) && me.summaryType === 'intraday')
			retValue = true;
		return retValue;
	},
	doSaveSummaryTypeCodes : function(arrTypeCode) {
		var me = this;
		var jsonPost = {};
		jsonPost['typeCodes'] = arrTypeCode || [];
		me.preferenceHandler.saveModulePreferences(
				me.strPageName,
				me.mapUrlDetails['strPrefferdTypeCodes'].moduleName, jsonPost,
				me.postHandleDoSaveSummaryTypeCodes, null, me, false);
	},
	postHandleDoSaveSummaryTypeCodes : function(data, args, isSuccess) {
		var me = this;
		me.handleSummaryInformationRender();
	},
	doHandleCurrencyChange : function(strCcy, strCcySymbol) {
		var me = this;
		var objGroupView = me.getGroupView();
		me.equiCcy = strCcy;
		me.equiCcySymbol = strCcySymbol;
		me.getAccountSummaryView().equiCcy = me.equiCcy;
		me.getAccountSummaryView().equiCcySymbol = me.equiCcySymbol;
		//me.handleSummaryInformationRender();
		me.disablePreferencesButton("savePrefMenuBtn",false);
		me.disablePreferencesButton("clearPrefMenuBtn",false);
		if (objGroupView)
			objGroupView.refreshData();

	},
	doHandleSwitchTo : function() {
		var me = this;
		var url = me.strPageName +".form";
		if (!Ext.isEmpty(url))
			me.submitSwitchForm(url);
	},
	submitSwitchForm : function(url) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.action = url;
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
	/*----------------------------Preferences Handling Starts----------------------------*/
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
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		
		if (isSuccess && isSuccess === 'Y') {
						  me.disablePreferencesButton("savePrefMenuBtn",true);
			              me.disablePreferencesButton("clearPrefMenuBtn",false);	
						}
		
		/*if (isSuccess === 'N') {
			if (!Ext.isEmpty(me.getBtnSavePreferences()))
				me.toggleSavePrefrenceAction(true);
		} else {
			me.toggleClearPrefrenceAction(true);
		}*/
	},
	handleClearPreferences : function() {
		var me = this;
		if ($("#clearPrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{	
			var arrPref = me.getPreferencesToSave(false);
			 me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					 me.postHandleClearPreferences, null, me, true);
			
				me.disablePreferencesButton("savePrefMenuBtn", false);
				me.disablePreferencesButton("clearPrefMenuBtn", true);
		}	
	},
	
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
		               if (isSuccess && isSuccess === 'Y') {
							me.disablePreferencesButton("savePrefMenuBtn", false);
							me.disablePreferencesButton("clearPrefMenuBtn", true);	
						}
						
	},
	postDoHandleReadPagePrefNew : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			if (!Ext.isEmpty(data)) {				
				objSummaryPref = Ext.encode(data);
				me.handleSummaryInformationRender();
			}
		}
	},	
	postDoHandleSaveRibbonPagePref : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			objSummaryTypeCodePopupPref = Ext.encode(data);
		}
	},	
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null, strModule = null;
		var infoPanelCollapsed = false;
		var infoPanel = me.getSummaryInfoView(); 
		var state = null;
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			
			
			// Summary Information Panel
		var summaryInfoPanel = $('#btrSummaryListId');
		if(summaryInfoPanel.hasClass('ft-accordion-collapsed'))
			infoPanelCollapsed = true;
			
			/*if (groupInfo.groupTypeCode === 'acctype') {
				strModule = state.subGroupCode;
			} else {
				strModule = state.groupCode
			}*/
			arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : state.groupCode,
							subGroupCode : state.subGroupCode,
							equiCcy : me.equiCcy,
							equiCcySymbol : me.equiCcySymbol
						}
					});
			arrPref.push({
						"module" : subGroupInfo.groupCode,
						"jsonPreferences" : {
							'gridCols' : state.grid.columns,
							'pgSize' : state.grid.pageSize,
							'sortState':state.grid.sortState,
							'gridSetting' : groupView.getGroupViewState().gridSetting
						}
					});			
			arrPref.push({
						"module" : "panels",
						"jsonPreferences" : {
							'infoPanel' : infoPanelCollapsed
						}
					});		
			arrPref.push({
						"module" : "filterPref",
						"jsonPreferences" : {
							'accSetName' : me.accountFilterName,
							'accSetArray' : me.accountFilter,
							'displayDate' : me.getDatePref()
						}
					});			
		}
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this, objPref = {};
		return objPref;
	},
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
	/*----------------------------Preferences Handling Ends----------------------------*/
	
	
	downloadReport : function(actionName) {
		var me = this;
		var accountList = '';
		var withHeaderFlag = $("#headerCheckBox").is(':checked');
		var includeActivitiesPDFFlag = 'N';
		var includeActivitiesExportFlag = 'N';
		
		if (me.summaryType == 'previousday')
		  {	
			includeActivitiesPDFFlag = document.getElementById("includeActivitiesPDFReportCheckbox").checked;
			includeActivitiesExportFlag = document.getElementById("includeActivitiesExportReportCheckbox").checked;
		  }
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadReport : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2',
			downloadMt940 : 'mt940',
			downloadqbook : 'quickbooks',
			downloadquicken : 'quicken',
			downloadFedwire : 'fedwire'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';
		var args=null;
		var strModule = '';
		var grid = null, objOfSelectedGridRecord = null, objOfGridSelected = null;
		var arrSelectedrecordsId = [];
		// Get subGroupInfo
		var groupView = me.getGroupView();
		groupInfo = groupView.getGroupInfo() || '{}';		
		
		//Added for FTGCPPRD-1822
		if (!Ext.isEmpty(groupView))
			grid = groupView.getGrid();
		if (!Ext.isEmpty(grid)) {
			var objOfRecords = grid.getSelectedRecords();
			if (!Ext.isEmpty(objOfRecords)) {
				objOfGridSelected = grid;
				objOfSelectedGridRecord = objOfRecords;
				if( actionName == 'downloadqbook' || actionName == 'downloadquicken' )
				{
					for (var i = 0; i < objOfSelectedGridRecord.length; i++) {
						accountList= accountList + grid.getStore().data.items[i].data.accountId + ',';
			}
					if( accountList.length > 0 )
						accountList = accountList.substring(0, accountList.length-1);
		}
			}
			else
			{
				if( actionName == 'downloadqbook' || actionName == 'downloadquicken' )
				{
					if( grid && grid.getStore() && grid.getStore().data
							 && grid.getStore().data.items && grid.getStore().data.items.length > 0 )
						{
							for(var i= 0; i < grid.getStore().data.items.length; i++)
							{
								accountList= accountList + grid.getStore().data.items[i].data.accountId + ',';
							}
							if( accountList.length > 0 )
								accountList = accountList.substring(0, accountList.length-1);
						
						}
				}
			}
		}
		if ((!Ext.isEmpty(objOfGridSelected))
				&& (!Ext.isEmpty(objOfSelectedGridRecord))) {
			for (var i = 0; i < objOfSelectedGridRecord.length; i++) {
				arrSelectedrecordsId.push(objOfSelectedGridRecord[i].data.identifier);
			}
		}
		
		strExtension = arrExtension[actionName];
		strUrl = 'services/balancesummary/'+me.summaryType +'/generateReport.' + strExtension;
		strUrl += '?$skip=1';

		strUrl += '&$expand=liquidity';// + index.groupByType;

		// var strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
		// Added for new Query
		strUrl += '&$filter=';// + strQuickFilterUrl;
		strUrl += '&$summaryType=' + me.summaryType;
		if( ( actionName == 'downloadqbook' || actionName == 'downloadquicken') && accountList.length > 0 )
		{
			strUrl += '&$strAccountId=' + accountList;
		}
		else 
		{
		strUrl += '&$strAccountId=' + me.accountFilter;
		}
		
		// Get subGroupInfo
		var groupView = me.getGroupView();
		groupInfo = groupView.getGroupInfo() || '{}';		
		subGroupInfo = groupView.getSubGroupInfo() || {};
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupTypeCode)) {
			strModule = subGroupInfo.groupCode;
		}
		else
		{
			strModule = groupInfo.groupTypeCode;
		}
		if (subGroupInfo && !Ext.isEmpty(subGroupInfo.groupQuery)) {
			strUrl += '&'+subGroupInfo.groupQuery;
		} else {
			strUrl += '&$filterOn=&$filterValue=';
		}
		args = {
				'module' : strModule
		};
		if (!Ext.isEmpty(objDefPref['SUMMARY']['GRID'][args['module']]))
		{
			strUrl += '&$serviceType='+objDefPref['SUMMARY']['GRID'][args['module']]['serviceType'];
			strUrl += '&$serviceParam='+objDefPref['SUMMARY']['GRID'][args['module']]['serviceParam'];
		}
		else
		{
			strUrl += '&$serviceType='+mapService['BR_STD_SUMM_GRID'];
			strUrl += '&$serviceParam='+mapService['BR_GRIDVIEW_GENERIC'];
		}
		// dateFilterIndex 12 : latest
		if (!me.isIntraDay()) {
			var dtObj = me.getDateJson(me.dateFilterIndex);
			if (dtObj) {
				strUrl += '&$strSummaryFromDate=' + dtObj.fromDate;
				strUrl += '&$strSummaryToDate=' + dtObj.toDate;
			}
		}

		strUrl += '&$eqCurrency=' + me.equiCcy;
		var wdgt = null, grid = null, colMap, colArray, viscols, visColsStr = "", objGroupView, col = null;
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
		objGroupView = me.getGroupView();

		if (!Ext.isEmpty(objGroupView)) {
			colMap = new Object();
			colArray = new Array();

			grid = objGroupView.getGrid();

			if (!Ext.isEmpty(grid)) {
				viscols = grid.getAllVisibleColumns();

				for (var j = 0; j < viscols.length; j++) {
					col = viscols[j];
					//if (col.dataIndex && arrDownloadReportColumn[col.dataIndex]) {
					if (col.dataIndex) {
						//if (colMap[arrDownloadReportColumn[col.dataIndex]]) {
						if (colMap[col.dataIndex]) {							
							// ; do nothing
						} else {
							//colMap[arrDownloadReportColumn[col.dataIndex]] = 1;
							colMap[col.dataIndex] = 1;
							//colArray.push(arrDownloadReportColumn[col.dataIndex]);
							colArray.push(col.dataIndex);

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
			
		for(var i=0; i<arrSelectedrecordsId.length; i++){
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier',
					arrSelectedrecordsId[i]));
		}	
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		//if (me.summaryType == 'previousday')
		 // {	
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'includeActivitiesPDFFlag',
				includeActivitiesPDFFlag));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'includeActivitiesExportFlag',
				includeActivitiesExportFlag));
		 // }
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

	},
	createPopUps : function() {
		var me = this;
		if (Ext.isEmpty(me.additionalInfoPopup)) {
			me.additionalInfoPopup = Ext.create(
					'GCP.view.summary.popup.AccountSummaryAdditioalInfoPopUp',
					{
						itemId : 'accountSummaryAdditioalInfoPopUp'
					});
		}
	},
	createPopUps : function() {
		var me = this;
		if (Ext.isEmpty(me.estatementInfoPopUp)) {
			me.estatementInfoPopUp = Ext.create(
					'GCP.view.summary.popup.AccountSummaryEstatementInfoPopUp',
					{
						itemId : 'accountSummaryEstatementInfoPopUp'
					});
		}
	},
	setInfoToolTipVal : function(tip) {
		var me = this;
		var account = '', date = '', filterView;
		var strText = '', strLastReceived = '';
		if (me.dateFilterIndex === '1' || me.dateFilterIndex === '2') {
			strText = me.getSummaryDateFilterText(me.dateFilterIndex);
		} else
			strText = me.dateFilterText;
		if (!Ext.isEmpty(tip)) {
			if (me.accountFilterName == 'allAcc'
					|| me.accountFilterName == 'all')
				account = getLabel('setAll', 'ALL');
			else
				account = me.accountFilterName;

			if (null == me.dateFilterFromVal)
				date = Ext.Date.format(Ext.Date.parse(dtApplicationDate,
								strExtApplicationDateFormat),
						strExtApplicationDateFormat);
			else
				date = Ext.Date.format(me.dateFilterFromVal,
						strExtApplicationDateFormat);
			if (me.isIntraDay()) {
				strLastReceived = getLabel('information', 'Information')
						+ ' : ' + getLabel('lastRecieved', 'Last Received')
						+ '<br/>';
			}
			tip.update(strLastReceived + getLabel('date', 'Date') + ' : '
					+ strText + '<br/>' + getLabel('account', 'Account')
					+ ' : ' + account);
		}
	},
	doHandleChangeDateFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		me.handleSummaryInformationRender();
		if (groupView)
			groupView.refreshData();
	},
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef=$('#displayDataPicker');
		
		if (index === '1' || index === '2' || index === '12') 
		{
			me.getDateFilterTitle().setText(getLabel('date', 'Date')
				+ " (" + me.getSummaryDateFilterText(index) + ")");				
		}
		else if (!Ext.isEmpty(me.dateFilterLabel)) 
		{
			me.getDateFilterTitle().setText(getLabel('date', 'Date')
				+ " (" + me.dateFilterLabel + ")");
		}
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),strExtApplicationDateFormat);
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate',vFromDate);
			} else {
				datePickerRef.datepick('setDate',[vFromDate, vToDate]);
			}
		} else {
				if (index === '1' || index === '2' ) {
						datePickerRef.datepick('setDate',vFromDate);
						} else{
					datePickerRef.datepick('setDate',[vFromDate, vToDate]);
				}
		}
	},
	getSummaryDateFilterText : function(index) {
		var strDateText = getLabel("latest", "Latest");
		if (index === '1' || index === '2')
			strDateText = index === '1'
					? getLabel("asontoday", "As on Today")
					: getLabel("asonyesterday", "As of Yesterday");
		return strDateText;
	},
	getDateParam : function(index) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat)), dtToDate = null, dtLatestToDate = null ;
		var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		if (!me.isIntraDay())
		{
			dtToDate = objDateHandler.getYesterdayDate(date);
			dtLatestToDate = objDateHandler.getYesterdayDate(toDate);
		}
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(dtToDate, strSqlDateFormat);
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
				dtJson = objDateHandler.getLastWeekStartAndEndDate(date);
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
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate,
						strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate ,
						strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
				// Date Range
				/*var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';*/
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
				dtJson = objDateHandler.getLastQuarter(dtToDate);
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
				fieldValue2 = Ext.Date.format(dtToDate || dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '12' :
				// Latest
				if (!me.isIntraDay())
				{
					var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
					fieldValue1 = Ext.Date.format(fromDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(dtLatestToDate,
							strSqlDateFormat);
					operator = 'bt';
				}
				else
				{
					fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'le';
				}
				break;
			case '14' :
			    //last month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
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
					{
						fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
					}
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
	doHandleInformationFilterClick : function(strFilterText) {
		var me = this;
		var jsonData = {};
		var summaryView = me.getAccountSummaryView();
		var objGroupView = me.getGroupView();
		summaryView.setLoading(true);
		Ext.Ajax.request({
			url : 'services/balancesummary/refreshBalances?'+csrfTokenName+'='+csrfTokenValue,
			method : 'POST',
			jsonData : jsonData,
			success : function(response) {
				if (response.responseText) {
					var data = Ext.decode(response.responseText);
					if (data) {
						if (data.d.SUCCESS === 'SUCCESS') {
							me.handleSummaryInformationRender();
							if (objGroupView)
								objGroupView.refreshData();
						} else {
							Ext.MessageBox.show({
										title : getLabel('errorPopUpTitle',
												'Info'),
										msg : getLabel('balanceErrorPopUpMsg',
												'No Balance Information available for the given Criteria.'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.INFO
									});
						}
					}
					summaryView.setLoading(false);
				}
			},
			failure : function() {
				summaryView.setLoading(false);
			}
		});
	},
	addAllAccountSet : function() {
		var me = this;
		me.preferenceHandler.readModulePreferences(
				me.strPageName,
				me.mapUrlDetails['strPrefferdAccountSets'].moduleName,
				me.loadAllAccountSets, me.accountTypes, me, true);
	},
	// TODO: This is to be moved at View File
	loadAllAccountSets : function(data, arrItem, strIsSuccess) {
		var me = this;
		var objWgtCt = me.getAccountTypeCombo();

		if (!Ext.isEmpty(data)) {
			var jsonData = null;
			if (!Ext.isEmpty(data.preference))
				jsonData = JSON.parse(data.preference);

			if (null == jsonData)
				var count = 0;
			else
				var count = jsonData.length;

			if (count !== 0 && null == data.error) {
				var jsonData = JSON.parse(data.preference);
				me.accountSets = jsonData;

				for (var i = 0; i < count; i++) {
					var accSetName = jsonData[i].accountSetName;

					var accSetCount = jsonData[i].accounts.length;
					var accSetArray = jsonData[i].accounts;
					var strcls = '';

					if (this.accountFilterName === accSetName) {
						strcls = 'xn-custom-heighlight';
					} else {
						strcls = 'cursor_pointer xn-account-filter-btnmenu';
					}
					arrItem.push({
								text : accSetName + "(" + accSetCount + ")",
								btn : {
									btnId : accSetName,
									accArray : accSetArray
								}
							});

				}
			}
		}
		objWgtCt.getStore().loadData(arrItem);

		var accountTypeFav = objWgtCt.getStore().getAt(1);
		var favAttrBtn = {
			btnId : 'Favorites',
			accArray : me.arrFavAccounts
		};
		accountTypeFav.set('text', getLabel('favorites', 'Favorites') + "(" + me.arrFavAccounts.length + ")");
		accountTypeFav.set('btn', favAttrBtn);
		
	},
	
	accountTypeComboRender : function () {
		var me = this;
		var objWgtCt = me.getAccountTypeCombo();
		
		if (me.accountFilterName == "all" || me.accountFilterName == undefined) {
			objWgtCt.setRawValue('ALL');			
		} else {
			objWgtCt.setRawValue(me.accountFilterName + "("
					+ me.accountFilter.length + ")");
		}
	},
	handleAccount : function(btn) {
		var me = this;
		if (btn.accArray != 'undefined' && btn!== 'ALL') {
			me.accountFilter = btn.accArray;
			me.accountFilterName = btn.btnId;
			me.handleSummaryInformationRender();
			me.getGroupView().refreshData(null);
		}
	},
	handleAccountTypeLoading : function(panel) {
		var me = this;
		me.preferenceHandler.readModulePreferences(
				me.strPageName,
				me.mapUrlDetails['strPrefferdAccount'].moduleName,
				me.loadAccountTypes, null, me, true);
	},
	// TODO: This is to be moved at View File
	loadAccountTypes : function(data, args, isSuccess) {
		var me = this;
		var arrItem = [];
		var strcls = '';
		if (this.accountFilterName === 'allAcc'
				|| this.accountFilterName === 'all') {
			strcls = 'xn-custom-heighlight';
		} else {
			strcls = 'cursor_pointer xn-account-filter-btnmenu';
		}
		arrItem.push({
					text : getLabel('Setall', 'ALL'),
					btn : {
						btnId : 'allAcc',
						accArray : 'ALL'
					}
				});
		var favstrcls = '';
		if (this.accountFilterName === 'Favorites') {
			favstrcls = 'xn-custom-heighlight';
		} else {
			favstrcls = 'cursor_pointer xn-account-filter-btnmenu';
		}
		if (data && data.error != null) {
			if (data.error.errorCode === 'INV001') {

				arrItem.push({
							text : getLabel('favorites', 'Favorites') + "(0)",
							btn : {
								btnId : 'Favorites',
								accArray : []
							}
						});
			}
		} else {
			var jsonData = data ? JSON.parse(data.preference) : {};
			var accSetArray = jsonData.accounts || [];
			var accFavArrInt = [];
			for (i = 0; i < accSetArray.length; i++) {
				accFavArrInt.push(parseInt(accSetArray[i],10))
			}
			me.arrFavAccounts = accFavArrInt;
			arrItem.push({
						text : getLabel('favorites', 'Favorites') + "("
								+ accFavArrInt.length + ")",
						btn : {
							btnId : 'Favorites',
							accArray : accSetArray
						}
					});
		}
		me.accountTypes = arrItem;
	},
	tabChanged : function(index) {
		var me = this;
		me.getAccountSetEntryView().fireEvent('clearAccountSetFormFields');
		me.getAccountSetEntryView().mode = "VIEW";
	},	
	postHandleDoDeleteAccountSet : function(data, args, isSuccess) {
		var me = this;
           me.handleAccountTypeLoading();
		    me.addAllAccountSet();
		//me.loadAccountTypeComboData(args['data']);
	},
	doHandleViewAccountSet : function(grid,rowIndex) {
		var me = this;
		var record = grid.getStore().getAt(rowIndex);
		me.doSetAccountSetFormFields(record);
	},
	doHandleShowSelectedFilter : function(selectedFilter) {
		var me = this;
		var grid = me.getAccountSetGridView();
		var store = grid.getStore();
		var preferenceArray = [];
		var rowIndex = -1; 
		var args = {
			'grid' : grid
		};
		if (store && typeof selectedFilter !== 'undefined')
		{
			var recordToDel = null;
			 store.each(function(record)   
			  {   
		      	if(record.get('accountSetName') === selectedFilter){
		      		recordToDel = record;
		      		rowIndex = store.indexOf(record);
		      		if(rowIndex >= 0){
		      			$("#msSavedFilter").val(selectedFilter);
		      			$("#msSavedFilter").multiselect("refresh");
						 me.doHandleViewAccountSet(grid,rowIndex);
		      		}
		      	}
			  });
			 
		}
        if(selectedFilter === 'allAcc' || selectedFilter === 'Favorites' || selectedFilter === 'all'){
			me.clearSelection();
			makeNiceSelect('faclilityFilter', true);
		}
	},
	saveAccountSet : function(callback) {
		var data = null, me = this, entryForm = me.getAccountSetEntryView(), grid = me
				.getAccountSetGridView(), mode = me.getAccountSetEntryView().mode;

		if (entryForm && entryForm.validateEntryForm(mode)) {
			data = entryForm.getAccountSetFormData();
			me.doSaveAccountSet(grid, data, callback);
		}
	},
	pageTitleLoad : function() {
		var me = this;
		var isLinkHidden = false;
		var strSummaryLbl = getLabel('intraday', 'Intraday');
		var strNavigation = getLabel('prevDay', 'Previous Day');
		var canIntraDayView = false;
		var canPrevDayView = false;

		if (typeof objClientParameters != 'undefined'
				&& !Ext.isEmpty(objClientParameters)) {
			if (!Ext.isEmpty(objClientParameters.canIntraDayView)) {
				canIntraDayView = objClientParameters.canIntraDayView;
			}
			if (!Ext.isEmpty(objClientParameters.canPrevDayView)) {
				canPrevDayView = objClientParameters.canPrevDayView;
			}
		}
		if (typeof summaryType != 'undefined') 
		{
			if(canIntraDayView && canPrevDayView )
			{				
			if (summaryType === 'intraday') {
				$("ul.ft-extra-nav").html('<li class="ft-extra-active"><a>' + strSummaryLbl + '</a></li><li id="accountSummary"><a href="#">' + strNavigation + '</a></li>');
			} else if (summaryType === 'previousday') {
				$("ul.ft-extra-nav").html('<li id="accountSummary"><a href="#">' + strSummaryLbl + '</a></li>'
				+ '<li class="ft-extra-active"><a>' + strNavigation + '</a></li>'
				);
			}
			}
			else if(canIntraDayView)
			$("ul.ft-extra-nav").html('<li class="ft-extra-active"><a>' +  getLabel('intraday', 'Intraday') + '</a></li>');
			else if(canPrevDayView)
			$("ul.ft-extra-nav").html('<li class="ft-extra-active"><a>' + getLabel('prevDay', 'Previous Day') + '</a></li>');
		}

		$('#accountSummary').click(function(){
			if(!isLinkHidden) 
				me.doHandleSwitchTo();
		});	
	},
	populateSummaryCcyInfo : function() {
		var me = this;		
	},
	handleClearSettings : function() {
		var me = this;		
		me.accountFilter = 'ALL';
		me.accountFilterName = 'all';
		me.dateFilterIndex = '2';
		me.dateFilterLabel = getDateIndexLabel('2');
		if (!Ext.isEmpty(me.summaryType) && me.summaryType === 'intraday')
		{
			me.dateFilterIndex = '1';
			var realTimeBtn = me.getRealTimeBtn();
			realTimeBtn.removeCls('ui-datepicker-header');
			var latestBtn = me.getLatestBtn();
			latestBtn.addCls('ui-datepicker-header');	
		}		
		var comboBox = me.getAccountTypeCombo();						
		comboBox.setValue(me.accountFilter); 		
		
		var facilityCombo = $('#faclilityFilter :selected').text();

		if (!Ext.isEmpty(facilityCombo))
		{
			$("#faclilityFilter option:first").attr("selected", true);
			$("#faclilityFilter-niceSelect").find('.current').html("All");
		}
		me.handleDateChange(me.dateFilterIndex);	
		var objGroupView = me.getGroupView();		
		me.getAccountSummaryView().equiCcy = me.equiCcy;
		me.getAccountSummaryView().equiCcySymbol = me.equiCcySymbol;
		me.handleSummaryInformationRender();
		if (objGroupView)
			objGroupView.refreshData();		
	},
	loadAccountSetGrid : function()
	{
		var me = this;
		$('#filterList').empty();
		
		var grid = me.getAccountSetGridView();
		Ext.Ajax.request({
					url : 'services/userpreferences/'+me.strPageName+'/accountsets.json',
					method : "GET",
					async : false,
					success : function(response) {
						if (!Ext.isEmpty(response.responseText)) {
							var data = Ext.decode(response.responseText);
							pref = Ext.decode(data.preference);
							var jsonData = JSON.parse(data.preference);
							me.accountSets = jsonData;
							if (grid) {
								grid.store.removeAll(true);
								grid.loadRawData(pref);
							}
							$('#msSavedFilter').empty();
							$('#msSavedFilter').append($('<option>', { 
								value: '',
								text : getLabel('select','Select'),
								selected : false
								}));
							if(pref.length > 0){
								$.each(pref,function(index,item){
									$('#msSavedFilter').append($('<option>', { 
										value: pref[index].accountSetName,
                                        text : pref[index].accountSetName + '(' + pref[index].accounts.length + ')',
										selected : pref[index].accountSetName === selectedFilter ? true : false
										}));
								});
							 }
							$('#msSavedFilter').multiselect('refresh');
						}
					}
				});
		panel = Ext.create('GCP.view.summary.AccountSetGridView', {		
								accountSetStoreData : me.accountSets,		
								renderTo : 'filterList'
							});
	},
	setValueForCompany : function(value){
		var me = this;
		var companyCombobox = me.getFilterView().down('combo[itemId="clientCombo"]');
		if (companyCombobox) 
		{
			companyCombobox.setValue(value);
			selectedClient=value;
			me.selectedClientFilter = value;
			me.selectedClientFilterDesc = companyCombobox.getRawValue();
		}
	},
	loadAccountSetEntryGrid : function(mode)
	{
		if(mode === 'ADD')
		{
			//$('#entrySetGridList').empty();
			$('#errorPanelList').empty();
		}
		if(Ext.isEmpty(accountEntryGrid)){
		accountEntryGrid = Ext.create('GCP.view.summary.AccountSetEntryGridView', {								
								renderTo : 'entrySetGridList'
							});
		}
	},
	filterGridStore : function()
	{
		var store = Ext.create('Ext.data.Store', {
		fields : ['accountId', 'accountName', 'accountNumber',
				'facilityCode'],
		proxy : {
			type : 'ajax',
			url : 'services/balancesummary/'+me.summaryType+'/btruseraccounts.json',
			reader : {
				type : 'json'
			}
		},
		loadRawData : function(data, append) {
			var objStore = store;
			result = objStore.proxy.reader.read(data), records = result.records;
			if (result.success) {
				objStore.currentPage = objStore.currentPage === 0
						? 1
						: objStore.currentPage;
				objStore.totalCount = result.total;
				objStore.loadRecords(records, append
								? objStore.addRecordsOptions
								: undefined);
				objStore.fireEvent('load', objStore, records, true);
			}
		},
		autoLoad : false
	});
	Ext.Ajax.request({
		url : 'services/balancesummary/'+me.summaryType+'/btruseraccounts.json',
		method : 'GET',
		success : function(response) {
			var data = Ext.decode(response.responseText);
			var btruseraccounts = data.d.btruseraccount;
			if (!Ext.isEmpty(btruseraccounts))
				store.loadRawData(btruseraccounts);
		},
		failure : function(response) {
			// console.log("Ajax Get account sets call failed");
		}

	});
	return store;
	},
	filterGridData : function(objValue) {
		console.log('filterGridData');
		var filter = [];
		var recordsToSelect = [];
		if(!Ext.isEmpty(objValue.fascCode) && objValue.fascCode != 'all' ){
			filter.push({property:'facilityCode' , value: objValue.fascCode});
		}
		if(!Ext.isEmpty(objValue.ccyCode)){
			filter.push({property:'accountCcy',value:objValue.ccyCode});
		}
		if(!Ext.isEmpty(objValue.bankCode)){
			filter.push({property:'bankCode' , value:objValue.bankCode});
		}
		
		
			var me = this;
			var grid = me.getAccountSetEntryGridView();
			var store = grid.getStore();
			grid.getStore().clearFilter();
			grid.getStore().filter(filter);
			
			if (!Ext.isEmpty(strAccountList)) {
				store.each(function(rec) {
							if (Ext.Array.contains(strAccountList, rec
											.get('accountId'))) {		
								recordsToSelect.push(rec);
							}
						});
			}
			grid.getSelectionModel().select(recordsToSelect);
	},
	doHandleSaveClick : function(txtFieldVal,strMode) {
		var me = this;
		var errorMsg = null;
		var grid = me.getAccountSetGridView();
		var data = null;
		var txtField = $("input[type='text'][id='nickNameTextField']").val();
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
		data = me.getAccountSetFormData(txtFieldVal);
		var arrError = [];
		if (Ext.isEmpty(data.accounts) && data.accounts !== 'undefined') 
			{
				errorMsg = getLabel('selectAtleastAccount',
					'Select at least one record to search.');
				arrError.push({
					"errorCode" : "",
					"errorMessage" : getLabel('selectAtleastAccount',
					'Select at least one record to search.')
				});
			}
		if (SaveFilterChkBoxVal === true && Ext.isEmpty(txtField)) {
			markRequired($('#nickNameTextField'));
			arrError.push({
				"errorCode" : "",
				"errorMessage" : getLabel('filternameMsg',
				'Please Enter Account Set Name.')});
		}
		if(!Ext.isEmpty(arrError))
		{
			paintErrors('advancedFilterErrorDiv','advancedFilterErrorMessage',arrError);
		}
		else
		{
		if(strMode !== 'Search'){
			if(strMode === 'ADD')
			{
				data = me.getAccountSetFormData(txtFieldVal);
				if ((!Ext.isEmpty(data.accounts) && data.accounts !== 'undefined') &&(txtFieldVal !=='' || txtFieldVal!== 'undefined')) {
					me.doSaveAccountSet(grid, data);
				if (me.accountSetSaveFlag && !Ext.isEmpty(data.accounts) && data.accounts !== 'undefined') {
						me.accountFilter = data.accounts;
						me.accountFilterName = txtFieldVal;
						var comboBox = me.getAccountTypeCombo();						
						me.accountTypeComboRender();
						me.handleSummaryInformationRender();
						me.getGroupView().refreshData(null);
//						comboBox.setValue(txtFieldVal);
//						me.getGroupView().refreshData(null);
				}
					$( "#errorPanelList" ).text('');
					$('#advancedFilterPopup').dialog("close");
				} else if(data.accounts.length==0){
					errorMsg = getLabel('selectAtleastAccount',
					'Select atleast one record to search.');
					$( "#errorPanelList" ).text(errorMsg);
				} else{
					errorMsg = getLabel('selectAtleastName',
					'Enter the account set name.');
					$( "#errorPanelList" ).text(errorMsg);
				}
			}
			else if(strMode === 'Update')
			{
				data = me.getAccountSetFormData(txtFieldVal);
				me.doSaveAccountSet(grid, data);
				if (me.accountSetSaveFlag && !Ext.isEmpty(data.accounts) && data.accounts !== 'undefined') {
					me.accountFilter = data.accounts;
					me.handleSummaryInformationRender();
					me.getGroupView().refreshData(null);
				}
				$('#advancedFilterPopup').dialog("close");
			}
			me.handleAccountTypeLoading();
			me.addAllAccountSet();
	}
		else
		{
			data = me.getAccountSetFormData(txtFieldVal);
			if (!Ext.isEmpty(data.accounts) && data.accounts !== 'undefined') {
				me.accountFilter = data.accounts;
				me.handleSummaryInformationRender();
				me.getGroupView().refreshData(null);
				$('#advancedFilterPopup').dialog("close");
			}
			else
			{
				errorMsg = getLabel('selectAtleastAccount',
							'Select atleast one record to search.');
				$( "#errorPanelList" ).text(errorMsg);
			}
			//$('#advancedFilterPopup').dialog("close");
		 }
		}
	},
	validateEntryForm : function(strMode,nickNameField) {
		var me = this;
		var grid = me.getAccountSetEntryGridView();
		var accountSetGrid = me.getAccountSetGridView();
		var store = grid ? grid.getStore() : null;
		var retValue = true;
		var strNickName = nickNameField;

		if (Ext.isEmpty(strNickName))
			retValue = false;
		if (store && Ext.isEmpty(grid.getSelectionModel().getSelection()))
			retValue = false;
		store = accountSetGrid ? accountSetGrid.getStore() : null;
		if (store
				&& !Ext
						.isEmpty(store
								.findRecord('accountSetName', strNickName))
				&& strMode !== 'VIEW')
			retValue = false;
		return retValue;
	},
	getAccountSetFormData : function(nickNameField) {
		var me = this;
		var grid = me.getAccountSetEntryGridView();
		var store = grid ? grid.getStore() : null;
		var arrRecords = null;

		var recData = {};
		recData['accountSetName'] = nickNameField || '';
		recData['accounts'] = [];

		arrRecords = grid.getSelectionModel().getSelection()/*store.queryBy(function(record) {
					return record.get('accountIdCheckbox') === true;
				})*/ || [];
		/*arrRecords.each(function(record) {
					recData['accounts'].push(record.get('accountId'));
				});*/
		/*arrRecords.each(function(record) {
					recData['accounts'].push(record.get('accountId'));
				});*/		
		for(var i=0;i<arrRecords.length;i++)
			recData['accounts'].push(arrRecords[i].data.accountId);	
		return recData;
	},
	doClearAccountSetFormFields : function(mode,record) {
		var me = this;
		var data = null;
		var nickNameTextField = record.get('accountSetName');
		var grid = me.getAccountSetEntryGridView();
		var store = grid ? grid.getStore() : null;
		var facilityCombo = $('#faclilityFilter :selected').text();
		var strLabel = mode === 'VIEW'
				? getLabel('lblUpdateAndSearch', 'Update and Search')
				: getLabel('lblSaveAndSearch', 'Save and Search');

		if (!Ext.isEmpty(nickNameTextField)) {
			$("#nickNameTextField").removeAttr("disabled", "disabled"); 
			$("#nickNameTextField").attr('value', '');
			
		}
		 $("#advFilterSave button").text( strLabel );
					
		if (!Ext.isEmpty(store)) {
			store.each(function(record) {
						record.set('accountIdCheckbox', false);
					});
		}
		if (!Ext.isEmpty(facilityCombo))
			$("#faclilityFilter option:first").attr("selected", true);		
	},
	doSetAccountSetFormFields : function(record) {
		var me = this;
		me.doClearAccountSetFormFields('VIEW',record);
		var savedFilterVal = $("#msSavedFilter").val();
		var nickNameTextField = record.get('accountSetName');
		var grid = me.getAccountSetEntryGridView();
		var store = grid ? grid.getStore() : null;
		var arrAccountId = record.get('accounts');
		strAccountList = null;
		strAccountList=record.get('accounts');
		if (!Ext.isEmpty(nickNameTextField)) {
			$("#nickNameTextField").attr('value', record.get('accountSetName') || '');
		}
		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
		{
			saveFilterChkBoxRef.prop('checked', true);
			$("#lblAccSetName").addClass("required");
		}
		
		$('#clearFilterLink').show();
		$('#save').show();
		Ext.Ajax.request({
					url : 'services/balancesummary/'+me.summaryType+'/btruseraccounts.json?$calledFrom='+me.summaryType,
					method : 'GET',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var recordsToSelect = [];
						var btruseraccounts = data.d.btruseraccount;
						if (!Ext.isEmpty(btruseraccounts))
						{
							grid.getStore().clearFilter();	
							grid.getStore().loadRawData(btruseraccounts);
						}
							if (!Ext.isEmpty(arrAccountId)) {
								store.each(function(rec) {
											if (Ext.Array.contains(arrAccountId, rec
															.get('accountId'))) {
												/*rec.set('accountIdCheckbox', true);*/			
												recordsToSelect.push(rec);
											}
										});
							}
						grid.getSelectionModel().select(recordsToSelect);	
					},
					failure : function(response) {
						// console.log("Ajax Get account sets call failed");
					}

				});
		/*if (!Ext.isEmpty(arrAccountId)) {
			store.each(function(rec) {
						if (Ext.Array.contains(arrAccountId, rec
										.get('accountId'))) {
							rec.set('accountIdCheckbox', true);
						}
					});
		}*/
	},
	getDatePref : function() {
		var me = this;
		var objReturn = {};
		var strSqlDateFormat = 'Y-m-d';
		me.dateFilterFromVal = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
		me.dateFilterToVal = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
		if (me.datePickerSelectedDate.length == 1) {
			objReturn.displayDateFrom = me.dateFilterFromVal;
		} else if(me.datePickerSelectedDate.length == 2) {
			objReturn.displayDateFrom = me.dateFilterFromVal;
			objReturn.displayDateTo = me.dateFilterToVal;
		}
		objReturn.displayDateFilterIndex = me.dateFilterIndex;
		return objReturn;
	},
	clearSelection : function(){
		$("#nickNameTextField").attr('value', '');
		$( "#errorPanelList" ).attr('value', '');
		$( "#currencyAutoComp" ).attr('value', '');
		$( "#bankAutoComp" ).attr('value', '');
        $('#faclilityFilter').val("All");
        $('#faclilityFilter').niceSelect();
        $('#faclilityFilter').niceSelect('update');
		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef))
		{
			saveFilterChkBoxRef.prop('checked', false);
			$("#lblAccSetName").removeClass("required");
		}
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		var me = this;
		var grid = me.getAccountSetEntryGridView();
		grid.getSelectionModel().deselectAll();
		strAccountList = null;
		if(grid && grid.getStore())
			grid.getStore().clearFilter();
		$( "#errorPanelList" ).text('');
	
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
		
		if(strFieldName === 'accountSet'){
			var objField = me.getGenericFilterView().down('combo[itemId="viewAccountCombo"]');
			if(!Ext.isEmpty(objField)){
//				objField.selectAllValues();
				me.accountFilterName = 'all';
				me.accountFilter = 'ALL';
				var comboBox = me.getAccountTypeCombo();						
				comboBox.setValue(me.accountFilter);
			}
			resetAllMenuItemsInMultiSelect("#msSavedFilter");
		}
		
		if(strFieldName === 'EntryDate'){
			var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
			if (!me.isIntraDay()) {
				me.dateFilterIndex = defaultDateIndex;
				me.dateFilterFromVal = me.dateHandler.getYesterdayDate(date);
				me.dateFilterFromVal = me.dateFilterFromVal;
				me.handleDateChange(me.dateFilterIndex);
			}
		}
	},
	getPreviousDate : function (strAppDate){
		var me = this;
		var objDateHandler = me.getDateHandler();
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var yesterdayDate = objDateHandler.getYesterdayDate(date);
		return yesterdayDate;
	},
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid(), groupInfo = null ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView){
		       groupInfo = objGroupView.getGroupInfo();
			subGroupInfo = objGroupView.getSubGroupInfo();
		}
		
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.getQuickJsonData()) ? me.getQuickJsonData() : {};
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
	populateTempFilter : function (filterData)
	{
		if(gridOrSummary != null && gridOrSummary === 'widget')
			return;
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var operatorValue = '';
		var formattedFromDate, formattedToDate;
		var valueArray = '';
		for (i = 0; i < filterData.length; i++) {
			fieldName = filterData[i].paramName;
			fieldVal = filterData[i].paramValue1;
			fieldSecondVal = filterData[i].paramValue2;
			operatorValue = filterData[i].operatorValue;
			valueArray = filterData[i].valueArray;
			if (fieldName === 'EntryDate') {
				
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
				var dateIndex = filterData[i].dateFilterIndex;
				me.dateFilterIndex = dateIndex;
				if (!Ext.isEmpty(fieldVal))
					formattedFromDate = Ext.util.Format.date(Ext.Date.parse(
									fieldVal, 'Y-m-d'),
							strExtApplicationDateFormat);
				if (!Ext.isEmpty(fieldSecondVal))
					formattedToDate = Ext.util.Format.date(Ext.Date.parse(
									fieldSecondVal, 'Y-m-d'),
							strExtApplicationDateFormat);

				if (operatorValue === 'eq' && (!Ext.isEmpty(formattedFromDate))) {
					$('#displayDataPicker').val(formattedFromDate);
				} else if (operatorValue === 'bt') {
					$('#displayDataPicker').datepick('setDate',
							[formattedFromDate, formattedToDate]);
				}
				
				me.datePickerSelectedDate[0] = fieldVal;
				me.datePickerSelectedDate[1] = fieldSecondVal;
				
				for( j=1;j<15;j++)
				{
				if(j==dateIndex)
					{
					 me.dateFilterLabel = objDateLbl[j];
					 if (!Ext.isEmpty(me.dateFilterLabel)) {
							me.getDateFilterTitle().setText(getLabel('date',
									'Date')
									+ " (" + me.dateFilterLabel + ")");
						}
						break;
				}
			} 
			} else if (fieldName === 'accountSet') {
				var accComboBox = me.getAccountTypeCombo();
				accComboBox.setValue(decodeURIComponent(fieldVal));
				me.accountFilterName = decodeURIComponent(fieldVal);
				if (fieldVal !== 'Favorites')
				{
				me.accountFilter = valueArray;
				accComboBox.setRawValue(decodeURIComponent(fieldVal) + "("+ valueArray.length+ ")");
			}
				else
                {
					me.accountFilter = me.arrFavAccounts;
					accComboBox.setRawValue(decodeURIComponent(fieldVal) + "("+ me.arrFavAccounts.length+ ")");
				}
			}
			else if (fieldName === 'client') {
				var clientComboBox = me.getClientCombo();
				clientComboBox.setValue(fieldVal);
				me.selectedClientFilter = fieldVal;
				me.selectedClientFilterDesc = filterData[i].displayValue1;
				me.setValueForCompany(fieldVal);
			}
		}
		
	},
	updateObjLocalPref : function (data){
		var me = this;
		objSaveLocalStoragePref = Ext.encode(data);
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
			objSaveLocalStoragePref = '';
			me.objLocalData = '';
			me.accountFilterName = '';
			me.accountFilter = '';
			if (!me.isIntraDay())
				me.dateFilterIndex = defaultDateIndex;
			var accComboBox = me.getAccountTypeCombo();
			me.accountFilterName = "all";
			accComboBox.setRawValue("ALL");
		}
	}
});