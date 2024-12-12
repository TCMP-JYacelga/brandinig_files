Ext
	.define(
		'GCP.controller.LoanCenterController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.LoanCenterGridView', 'Ext.ux.gcp.DateHandler','Ext.ux.gcp.PreferencesHandler'
			],
			views :
			[
				'GCP.view.LoanCenterView', 'GCP.view.LoanCenterLoanRepaymentPopupView',
				'GCP.view.LoanCenterLoanDrawdownPopupView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'loanCenterViewRef',
					selector : 'loanCenterViewType'
				},
				{
					ref : 'loanCenterGridViewRef',
					selector : 'loanCenterViewType loanCenterGridViewType'
				},
				{
					ref : 'groupView',
					selector : 'loanCenterGridViewType groupView'
				},
				{
					ref : 'loanCenterFilterView',
					selector : 'loanCenterFilterViewType' 
				},			
				{
					ref : 'loanCenterDtlViewRef',
					selector : 'loanCenterViewType loanCenterGridViewType panel[itemId="loanCenterDtlViewItemId"]'
				},
				{
					ref : 'loanCenterGridRef',
					selector : 'loanCenterViewType loanCenterGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'loanCenterGridViewType radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'loanCenterGridViewType textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'loanCenterViewType loanCenterGridViewType loanCenterGroupActionBarViewType'
				},
				{
					ref : 'btnSavePreferencesRef',
					selector : ' loanCenterFilterViewType button[itemId="btnSavePreferencesItemId"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : ' loanCenterFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'requestDateRef',
					selector : ' loanCenterFilterViewType button[itemId="requestDateItemId"]'
				},
				{
					ref : 'fromDateLabelRef',
					selector : ' loanCenterFilterViewType label[itemId="dateFilterFromLabelItemId"]'
				},
				{
					ref : 'toDateLabelRef',
					selector : ' loanCenterFilterViewType label[itemId="dateFilterToLabelItemId"]'
				},
				{
					ref : 'requestDateLabelRef',
					selector : ' loanCenterFilterViewType label[itemId="requestDateLabelItemId"]'
				},
				{
					ref : 'fromDateFieldRef',
					selector : ' loanCenterFilterViewType datefield[itemId="fromDateFieldItemId"]'
				},
				{
					ref : 'toDateFieldRef',
					selector : ' loanCenterFilterViewType datefield[itemId="toDateFieldItemId"]'
				},
				{
					ref : 'dateRangeComponentRef',
					selector : ' loanCenterFilterViewType container[itemId="dateRangeComponentItemId"]'
				},
				{
					ref : 'advFilterActionToolBarRef',
					selector : 'loanCenterFilterViewType toolbar[itemId="advFilterActionToolBarItemId"]'
				},
				{
					ref : 'loanCenterTypeToolBarRef',
					selector : ' loanCenterFilterViewType toolbar[itemId="loanCenterTypeToolBarItemId"]'
				},
				{
					ref : 'loanCenterObligationIdButtonRef',
					selector : ' loanCenterFilterViewType button[itemId="loanCenterObligationIdButtonItemId"]'
				},
				{
					ref : 'loanCenterGridInformationViewRef',
					selector : 'loanCenterGridInformationViewType'
				},
				{
					ref : 'infoSummaryLowerPanel',
					selector : 'loanCenterGridInformationViewType panel[itemId="infoSummaryLowerPanel"]'
				},
				{
					ref : 'advanceFilterPopupRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"]'
				},
				{
					ref : 'advanceFilterTabPanelRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] tabpanel[itemId="advancedFilterTabItemId"] '
				},
				{
					ref : 'createNewFilterRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] loanCenterAdvFilterCreateViewType'
				},
				{
					ref : 'advFilterGridViewRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] loanCenterAdvFilterGridViewType'
				},
				{
					ref : 'saveSearchBtnRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] loanCenterAdvFilterCreateViewType button[itemId="saveAndSearchBtnItemId"]'
				},
				{
					ref : 'filterDetailsTabRef',
					selector : 'loanCenterAdvFilterPopupViewType[itemId="gridViewAdvancedFilterItemId"] tabpanel[itemId="advancedFilterTabItemId"] panel[itemId="filterDetailsTabItemId"]'
				},
				{
					ref : 'loanCenterLoanRepaymentPopupViewRef',
					selector : 'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"]'
				},
				{
					ref : 'loanCenterLoanDrawdownPopupViewRef',
					selector : 'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"]'
				},
				{
					ref : 'withHeaderCheckboxRef',
					selector : 'loanCenterViewType menuitem[itemId="withHeaderId"]'
				},
				{
					ref : 'loanCenterTxnTabRef',
					selector : 'loanCenterViewType loanCenterTitleViewType button[itemId="loanCenterTxnTabItemId"]'
				},
				{
					ref : 'loanCenterSiTabRef',
					selector : 'loanCenterViewType loanCenterTitleViewType button[itemId="loanCenterSiTabItemId"]'
				},
				{
				ref:'filterView',
				selector:'filterView'	
				},{
				ref:"filterButton",
				selector : "groupView button[itemId=filterButton]"
				}
			],
			config :
			{
				isEditMode : true,
				savePrefAdvFilterCode : null,
				reportOrderURL : null,				
				filterCodeValue : null,
				filterDeleted : false,
				objCreateNewRepaymentPopup : null,
				objCreateNewDrawdownPopup : null,
				objAdvFilterPopup : null,
				advFilterCodeApplied : null,
				selectedLoanCenter : 'alert',
				filterData : [],
				copyByClicked : '',
				activeFilter : null,
				advFilterData : [],
				strDefaultMask : '00000',
				filterApplied : 'ALL',
				strGetModulePrefUrl : isSiTabSelected == 'Y' ? 'services/userpreferences/loanCenterSiSummary/{0}.json'
					: 'services/userpreferences/loanCenterTxnSummary/{0}.json',
				urlGridPref : isSiTabSelected == 'Y' ? 'userpreferences/loanCenterSiGridFilter/gridView.srvc?'
					: 'userpreferences/loanCenterTxnGridFilter/gridView.srvc?',
				urlGridFilterPref : isSiTabSelected == 'Y' ? 'userpreferences/loanCenterSiGridFilter/gridViewFilter.srvc?'
					: 'userpreferences/loanCenterTxnGridFilter/gridViewFilter.srvc?',
				commonPrefUrl : isSiTabSelected == 'Y' ? 'services/userpreferences/loanCenterSiGridFilter.json'
					: 'services/userpreferences/loanCenterTxnGridFilter.json',
				showAdvFilterCode : null,
				loanCenterTypeFilterVal : 'all',
				loanCenterTypeFilterDesc : 'all',
				dateFilterVal : '12',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel( 'latest', 'Latest' ),
				gridInfoDateFilterLabel : getLabel( 'today', 'Today' ),
				dateHandler : null,
				clientCode : null,
				clientDesc : '',
				arrSorter:[],
				datePickerSelectedDate : [],
				datePickerSelectedEntryAdvDate : [],
				dateRangeFilterVal : '13',
				preferenceHandler : null,
				entryDateChanged : false,
				strPageName : isSiTabSelected == 'Y' ? 'loanCenterSiGridFilter' : 'loanCenterTxnGridFilter' 
				
			},
			/**
			 * A template method that is called when your application boots. It
			 * is called before the Application's launch function is executed so
			 * gives a hook point to run any code before your Viewport is
			 * created.
			 */
			init : function()
			{
				var me = this;
				me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
				var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
				clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
				me.updateConfig();
				me.updateFilterConfig();
				$(document).on('savePreference', function(event) {		
						me.handleSavePreferences();
				});
				$(document).on('clearPreference', function(event) {
						me.handleClearPreferences();
				});
				$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});	
				$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});				
				$(document).on('filterDateChange',function(event, filterType, btn, opts) {			
					if (filterType=="entryDateQuickFilter" || filterType=="entryDate"){
						 me.handleEntryDateChange(filterType,btn,opts);
					 }
				});
				$(document).on("datePickPopupSelectedDate",
						function(event, filterType, dates) {
							if (filterType == "entryDateFrom" && !Ext.isEmpty(dates) ) {
								me.dateRangeFilterVal = '13';
								me.datePickerSelectedDate = dates;
								me.dateFilterVal = me.dateRangeFilterVal;
								me.dateFilterLabel = getLabel('daterange', 'Date Range');
								me.handleDateChange(me.dateRangeFilterVal);
								me.handleEntryDateInAdvFilterChange(me.dateRangeFilterVal);
							}
						});
				$(document).on('searchActionClicked', function() {
					me.handleSearchActionGridView(me);
				});
				$(document).on('saveAndSearchActionClicked', function() {
					me.handleSaveAndSearchGridAction(me);
				});
				$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields(false);
					me.filterCodeValue=null;
				});
				$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
				$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
				$(document).on('orderUpGridEvent',function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
				$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
				$(document).on('editFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
				$(document).on('addLoanRepaymentEvent',function(event) {
						me.isEditMode = true;
						me.showLoanCenterLoanRepaymentPopupView("");
				});
				$(document).off('savePaydownForm');
				$(document).on('savePaydownForm',function(event, objJson) {
					me.savePaydownForm(objJson);
				});
				$(document).off('saveAdvancedForm');
				$(document).on('saveAdvancedForm',function(event, objJson) {
					me.saveAdvancedForm(objJson);
				});				
				$(document).on('addLoanDrawdownEvent',function(event) {
					me.isEditMode = true;
					me.showLoanCenterLoanDrawdownPopupView("");
				});
				$(document).off('approvalConfirmed');
				$(document).on('approvalConfirmed', function(eventName, objArgs) {
					var strUrl = objArgs[0];
					var remarks = objArgs[1];
					var grid = objArgs[2];
					var arrSelectedRecords = objArgs[3];
					var strActionType = objArgs[4];
					var strAction = objArgs[5];
					me.preHandleGroupActions(strUrl, remarks, grid, arrSelectedRecords,
							strActionType, strAction);
				});
				
				var btnClearPref = me.getBtnClearPreferences();
				if(btnClearPref)
				{
					btnClearPref.setEnabled(false);
				}
				me.objCreateNewRepaymentPopup = Ext.create( 'GCP.view.LoanCenterLoanRepaymentPopupView',
				{
					parent : 'loanCenterViewType',
					itemId : 'loanCenterLoanRepaymentCreateViewItemId',
					filterPanel :
					{
						xtype : 'loanCenterLoanRepaymentCreateViewType',
						margin : '4 0 0 0',
						callerParent : 'loanCenterViewType'
				}
				});

				me.objCreateNewDrawdownPopup = Ext.create( 'GCP.view.LoanCenterLoanDrawdownPopupView',
				{
					parent : 'loanCenterViewType',
					itemId : 'loanCenterLoanDrawdownCreateViewItemId',
					filterPanel :
					{
						xtype : 'loanCenterLoanDrawdownCreateViewType',
						margin : '4 0 0 0',
						callerParent : 'loanCenterViewType'
					}
				} );

				me.objAdvFilterPopup = Ext.create( 'GCP.view.LoanCenterAdvFilterPopupView',
				{
					parent : 'loanCenterViewType',
					itemId : 'gridViewAdvancedFilterItemId',
					filterPanel :
					{
						xtype : 'loanCenterAdvFilterCreateViewType',
						margin : '4 0 0 0',
						callerParent : 'loanCenterViewType'
					}
				} );

				me
					.control(
					{
						'loanCenterViewType' :
						{
							beforerender : function( panel, opts )
							{
								// me.loadDetailCount();
							},
							addAlertEvent : function( btn )
							{
								me.handleAddNewProfileMaster( btn );
							},
							performReportAction : function( btn, opts )
							{
								me.handleReportAction( btn, opts );
							}
						},
						'pageSettingPopUp' : {
							'applyPageSetting' : function(popup, data,strInvokedFrom) {
								me.applyPageSetting(data,strInvokedFrom);
							},
							'savePageSetting' : function(popup, data,strInvokedFrom) {
								me.savePageSetting(data,strInvokedFrom);
							},
							'restorePageSetting' : function(popup,strInvokedFrom) {
								me.restorePageSetting();
							}
						},
						'loanCenterGridViewType groupView' : {
							/**
							 * This is to be handled if grid model changes as per group by
							 * category. Otherewise no need to catch this event. If captured
							 * then GroupView.reconfigureGrid(gridModel) should be called
							 * with gridModel as a parameter
							 */
							'groupByChange' : function(menu, groupInfo) {
								me.doHandleGroupByChange(menu, groupInfo);
							},
							'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
									newCard, oldCard) {
								//me.disablePreferencesButton("savePrefMenuBtn",false);
								//me.disablePreferencesButton("clearPrefMenuBtn",false);			
								me.doHandleGroupTabChange(groupInfo, subGroupInfo,
										tabPanel, newCard, oldCard);
							},
							'gridRender' : me.handleLoadGridData,
							'gridPageChange' : me.handleLoadGridData,
							'gridSortChange' : me.handleLoadGridData,
							'gridPageSizeChange' : me.handleLoadGridData,
							'gridColumnFilterChange' : me.handleLoadGridData,
						//	'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
							'gridStateChange' : function(grid) {
								me.disablePreferencesButton("savePrefMenuBtn",false);
							},
							'gridRowActionClick' : function(grid, rowIndex, columnIndex,
									actionName, record) {
								me.doHandleRowActions(actionName, grid, record,rowIndex);
							},
							'groupActionClick' : function(actionName, isGroupAction,
									maskPosition, grid, arrSelectedRecords) {
								if (isGroupAction === true)
									me.handleGroupActions(actionName, grid,
											arrSelectedRecords, 'groupAction');
							},
							'gridStoreLoad' : function(grid, store) {
								me.disableActions(false);
							},
							'render' : function() {
								populateAdvancedFilterFieldValue();
								me.applyPreferences();
							},							
							'gridSettingClick' : function(){
								me.showPageSettingPopup('GRID');
							},								
							'gridRowSelectionChange' : me.enableValidActionsForGrid
						},
						
					'filterView label[itemId="createAdvanceFilterLabel"]' : {
							'click' : function() {
								showAdvanceFilterPopup();
								me.assignSavedFilter();
								
							}
						},
						'filterView button[itemId="clearSettingsButton"]' : {
							'click' : function() {
								me.handleClearSettings();
							}
						},
						
						'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"] loanCenterLoanRepaymentCreateViewType' :
						{
							
							closeLoanRepaymentViewPopup : function( btn )
							{
								me.closeLoanRepaymentViewPopup( btn );
							}
						},
						'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"] AutoCompleter[itemId="loanAccNmbrFieldItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();
								objCreateNewRepaymentPanel.down( 'hidden[itemId="paymentCcyFieldItemId"]' ).setValue(
									record[ 0 ].data.CURRENCY );
								me.populateLoanRepaymentAmount( record[ 0 ].data.CODE );
							}
						},
						'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"] AutoCompleter[itemId="debitAccNmbrFieldItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();
								objCreateNewRepaymentPanel.down( 'hidden[itemId="debitCcyFieldItemId"]' ).setValue(
									record[ 0 ].data.CURRENCY );
							}
						},

						'loanCenterLoanRepaymentPopupViewType[itemId="loanCenterLoanRepaymentCreateViewItemId"] radiogroup[itemId="amountRadioItemId"]' :
						{
							change : function( btn, opts )
							{
								if( me.isEditMode )
								{
									var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();
									me.setLoanRepaymentAmountField( objCreateNewRepaymentPanel );
								}
							}
						},

						'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"] radiogroup[itemId="productTypeRadioItemId"]' :
						{
							change : function( btn, opts )
							{
								if( me.isEditMode )
								{
									var objCreateNewDrawdownPanel = me.getLoanCenterLoanDrawdownPopupViewRef();
									var objAutocompleter = objCreateNewDrawdownPanel
										.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' );
									objAutocompleter.setValue( '' );
									objAutocompleter.cfgExtraParams =
									[
										{
											key : '$filtercode1',
											value : opts.productType
										}
									];
								}
							}
						},
						'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"] loanCenterLoanDrawdownCreateViewType' :
						{
							
							closeLoanDrawdownViewPopup : function( btn )
							{
								me.closeLoanDrawdownViewPopup( btn );
							}
						},
						'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"] AutoCompleter[itemId="loanAccNmbrFieldItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objCreateNewDrawdownPanel = me.getLoanCenterLoanDrawdownPopupViewRef();
								objCreateNewDrawdownPanel.down( 'hidden[itemId="paymentCcyFieldItemId"]' ).setValue(
									record[ 0 ].data.CURRENCY );
							}
						},
						'loanCenterLoanDrawdownPopupViewType[itemId="loanCenterLoanDrawdownCreateViewItemId"] AutoCompleter[itemId="debitAccNmbrFieldItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objCreateNewDrawdownPanel = me.getLoanCenterLoanDrawdownPopupViewRef();
								objCreateNewDrawdownPanel.down( 'hidden[itemId="debitCcyFieldItemId"]' ).setValue(
									record[ 0 ].data.CURRENCY );
							}
						},

						'loanCenterFilterViewType button[itemId="newFilterItemId"]' :
						{
							click : function( btn, opts )
							{
								me.advanceFilterPopUp( btn );
							}
						},
					'loanCenterFilterViewType component[itemId="loanCenterEntryDataPicker"]' : {
						render : function() {
							$('#entryDataPicker').datepick({
									monthsToShow : 1,
									changeMonth : true,
									changeYear : true,
									dateFormat : strApplicationDefaultFormat,
									rangeSeparator : '  to  ',
									minDate:dtHistoryDate,
									onClose : function(dates) {
										if (!Ext.isEmpty(dates)) {
											me.datePickerSelectedDate = dates;
											me.dateFilterVal = me.dateRangeFilterVal;
											me.dateFilterLabel = getLabel('daterange', 'Date Range');
											me.handleDateChange(me.dateRangeFilterVal);
											me.resetSavedFilterCombo();
											me.setDataForFilter();
											me.applyQuickFilter();
										
										}
									}
						    });
							if (!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true) {
								var entryDateLableVal = $('label[for="requestDateLabelItemId"]').text();
								var entryDateField = $("#entryDateFrom");
								me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
//							
							} else{
								me.dateFilterVal = '12'; // Set to Today
								me.dateFilterLabel = getLabel('latest', 'Latest');
								me.handleDateChange(me.dateFilterVal);
								me.setDataForFilter();
								me.applyQuickFilter();
							}
				        }
			        },
					'loanCenterFilterViewType' :
					{
						render : function( panel, opts )
						{
							if (!Ext.isEmpty(modelSelectedMst))
								me.selectedMst = modelSelectedMst;
								var useSettingsButton = me.getFilterView().down('button[itemId="useSettingsbutton"]');
								if (!Ext.isEmpty(useSettingsButton))
								{
									useSettingsButton.hide();
								}
								me.setInfoTooltip();
								me.getAllSavedAdvFilterCode( panel );
							},
							filterType : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( true );
								me.toggleClearPrefrenceAction(true);
							},
							dateChange : function( btn, opts )
							{
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.handleDateChange( btn.btnValue );
								if( btn.btnValue !== '7' )
								{
									me.setDataForFilter();
									me.applyQuickFilter();
									me.disablePreferencesButton("savePrefMenuBtn",false);
									me.disablePreferencesButton("clearPrefMenuBtn",true);
								}
							},	
							handleClientChange : function(clientCode, clientDesc){
									me.clientCode = clientCode;
									me.clientDesc = clientDesc;
									me.resetSavedFilterCombo();
									me.setDataForFilter();
									me.applyQuickFilter();
									me.disablePreferencesButton("savePrefMenuBtn",false);
									me.disablePreferencesButton("clearPrefMenuBtn",false);
								
							},
							afterrender : function( panel, opts )
							{
								me.updateFilterFields();
							},
							handleSavedFilterItemClick:function(comboValue,comboDesc){
								me.savedFilterVal = comboValue;
								me.doHandleSavedFilterItemClick(comboValue);
							}
						},
						'loanCenterFilterViewType combo[itemId="savedFiltersCombo"]' : {
							'afterrender' : function(combo, newValue, oldValue, eOpts) {
								if (!Ext.isEmpty(me.savedFilterVal)) {
									var strFilterUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?' : 'userfilterslist/loanCenterTxnAdvFltr.srvc?';
									Ext.Ajax.request({
										url : strFilterUrl ,
										headers: objHdrCsrfParams,
										success : function(response) {
											var responseData = Ext.decode(response.responseText);
											var arrFilters = [];
											var filterData = responseData.d.filters;
											if (filterData) {
												arrFilters = filterData;
												if(arrFilters.indexOf(me.savedFilterVal)>-1)
												{
													combo.setValue(me.savedFilterVal);
												}		
											}						
										},
										failure : function(response) {
											console
													.log('Bad : Something went wrong with your request');
										}
									});
								}
							}
						},						
						'loanCenterViewType loanCenterFilterViewType toolbar[itemId="dateToolBarItemId"]' :
						{
							afterrender : function( tbar, opts )
							{
								me.updateDateFilterView();
							}
						},
						'loanCenterViewType loanCenterFilterViewType button[itemId="goBtnItemId"]' :
						{
							click : function( btn, opts )
							{
								var frmDate = me.getFromDateFieldRef().getValue();
								var toDate = me.getToDateFieldRef().getValue();

								if( !Ext.isEmpty( frmDate ) && !Ext.isEmpty( toDate ) )
								{
									var dtParams = me.getDateParam( '7' );
									me.dateFilterFromVal = dtParams.fieldValue1;
									me.dateFilterToVal = dtParams.fieldValue2;
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePrefrenceAction( true );
									me.toggleClearPrefrenceAction(true);
									
								}
							}
						},
						
						'loanCenterGridInformationViewType' :
						{
							render : this.onLoanCenterInformationViewRender
						},
						'filterView' : {
							appliedFilterDelete : function(btn){
								me.resetSavedFilterCombo();
								me.handleAppliedFilterDelete(btn);
							}
						}					
					});
					
					GCP.getApplication().on({
						showLoanCenterLoanRepaymentPopupView : function( yes )
						{
							me.showLoanCenterLoanRepaymentPopupView( yes );
						},
						showLoanCenterLoanDrawdownPopupView : function( yes )
						{
							me.showLoanCenterLoanDrawdownPopupView( yes );
						},
						showInvoiceCenterPopupView : function( url, record, remark )
						{
							me.showInvoiceCenterPopupView( url, record, remark );
						}
					});
					$(document).off('showInvoiceCenterPopupView');
					$(document).on('showInvoiceCenterPopupView',function(event, url, record, remark) {
							me.showInvoiceCenterPopupView(url, record, remark)
					});
			},

			
	
			handleTabAction : function()
			{
				var me = this;
				var btn;
				if( isSiTabSelected == 'Y' )
				{
					btn = me.getLoanCenterSiTabRef();
				}
				else
				{
					btn = me.getLoanCenterTxnTabRef();
				}
			},
			updateConfig : function() {
						var me = this;
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
			},
		handleClearSettings:function()
		{
		var me=this, clientFilterId=null;
		var loanCenterFilterView = me.getLoanCenterFilterView();
		var isHandleClearSettings = true;
		if(!isClientUser()){
				clientFilterId=loanCenterFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');			
				me.clientCode = "";
				me.clientDesc = "";		
				clientFilterId.suspendEvents();
				clientFilterId.reset();
				clientFilterId.resumeEvents();
		}else{
			clientFilterId=loanCenterFilterView.down('combo[itemId="clientBtn"]');
			me.clientDesc=getLabel('allCompanies', 'All companies');
			me.clientCode='all';
			clientFilterId.setRawValue(getLabel('allCompanies', 'All companies'));	
		}
		
		var savedFiltersComboVal= loanCenterFilterView.down('combo[itemId="savedFiltersCombo"]');
		me.savedFilterVal = '';
		savedFiltersComboVal.setValue(me.savedFilterVal);	

		me.dateFilterVal = '12'; // Set to Today
		me.dateFilterLabel = getLabel('latest', 'Latest');
		me.handleDateChange(me.dateFilterVal);
		me.filterApplied = 'Q';
		me.filterData=[];
		me.resetAllFields(isHandleClearSettings);
		me.setDataForFilter();
		me.handleClearAppliedFilterDelete();
		me.refreshData();
	
	},
	
	resetSavedFilterCombo : function() {
		var me = this;
		me.savedFilterVal='';
		var savedFilterComboBox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterComboBox))
			savedFilterComboBox.setValue(me.savedFilterVal);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
		markAdvFilterNameMandatory('saveFilterChkBox','advFilterNameLabel','filterCode', true);
	},
		doHandleGroupByChange : function(menu, groupInfo) {
				var me = this;
				if (me.previouGrouByCode === 'LONTXNSUMM_OPT_ADVFILTER' || me.previouGrouByCode === 'LONSISUMM_OPT_ADVFILTER') {
					me.savePrefAdvFilterCode = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
				}
				if (groupInfo && (groupInfo.groupTypeCode === 'LONTXNSUMM_OPT_ADVFILTER' || groupInfo.groupTypeCode === 'LONSISUMM_OPT_ADVFILTER')) {
					me.previouGrouByCode = groupInfo.groupTypeCode;
				} else
					me.previouGrouByCode = null;
			},
			
			doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) { 	
				var me = this;
				var strModule = '',  args = null, strFilterCode = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
								if (groupInfo)
				{
					if (groupInfo.groupTypeCode === 'LONTXNSUMM_OPT_ADVFILTER' || groupInfo.groupTypeCode === 'LONSISUMM_OPT_ADVFILTER')
					{
						strFilterCode = subGroupInfo.groupCode;
						if (strFilterCode !== 'all')
						{
							if (!Ext.isEmpty(strFilterCode))
							{
								me.savePrefAdvFilterCode = strFilterCode;
								var savedFiltersComboVal= me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
								savedFiltersComboVal.setRawValue(strFilterCode);									
								me.showAdvFilterCode = strFilterCode;
								me.doHandleSavedFilterItemClick(strFilterCode);
							}
						} else
						{
							me.savePrefAdvFilterCode = null;
							me.showAdvFilterCode = null;
							me.filterApplied = 'ALL';
							me.advFilterData = [];
						}
					}
				}
				if (groupInfo && _charCaptureGridColumnSettingAt === 'L')
				{
					args = {
						scope : me
					};
					strModule = subGroupInfo.groupCode
					strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
					me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);
				}
				else 
				{	
					me.postHandleDoHandleGroupTabChange();
				}				
			},
			doHandleSavedFilterItemClick : function(filterCode) {
				var me = this;
				if (!Ext.isEmpty(filterCode)) {
					me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
				}
				me.savePrefAdvFilterCode = filterCode;
				me.showAdvFilterCode = filterCode;
				me.disablePreferencesButton("savePrefMenuBtn",false);
			
			},
			getSavedPreferences : function(strUrl, fnCallBack, args) {
					var me = this;
					Ext.Ajax.request({
								url : strUrl,
								method : 'GET',
								success : function(response) {
									var data = null;
									if (response && response.responseText)
										data = Ext.decode(response.responseText);
									Ext.Function.bind(fnCallBack, me);
									if (fnCallBack)
										fnCallBack(data, args);
								},
								failure : function() {
								}

							});
			},			
	disablePreferencesButton: function(btnId,boolVal){
			$("#"+btnId).attr("disabled",boolVal);
			if(boolVal)
				{
					$("#"+btnId).css("color",'grey');			
					$("#"+btnId).css('cursor','default').removeAttr('href');
					$("#"+btnId).css('pointer-events','none');
				}
			else
				{
					$("#"+btnId).css("color",'#FFF');
					$("#"+btnId).css('cursor','pointer').attr('href','#');
					$("#"+btnId).css('pointer-events','all');				
				}
		},
			postHandleDoHandleGroupTabChange : function(data, args) {
			
			var me = args ? args.scope : this;
			me.handleReconfigureGrid(data);				
			},
	
			
			handleReportAction : function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn.itemId );
			},
			downloadReport : function( actionName )
			{
				var me = this;
				//var withHeaderFlag = me.getWithHeaderCheckboxRef().checked;
				var withHeaderFlag = document.getElementById("headerCheckbox").checked;
				var arrExtension =
				{
					downloadXls : 'xls',
					downloadCsv : 'csv',
					loanCenterDownloadPdf : 'pdf',
					downloadPdf : 'pdf',
					downloadTsv : 'tsv',
					downloadBAl2 : 'bai2'
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

				strExtension = arrExtension[ actionName ];
				
				var grid = null, count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
				var objGroupView = me.getGroupView();
				var arrSelectedrecordsId = [];
				if (!Ext.isEmpty(objGroupView))
					grid = objGroupView.getGrid();

				if (!Ext.isEmpty(grid)) {
					var objOfRecords = grid.getSelectedRecords();
					if (!Ext.isEmpty(objOfRecords)) {
						objOfGridSelected = grid;
						objOfSelectedGridRecord = objOfRecords;
					}
				}
				if ((!Ext.isEmpty(objOfGridSelected))
						&& (!Ext.isEmpty(objOfSelectedGridRecord))) {
					for (var i = 0; i < objOfSelectedGridRecord.length; i++) {
						arrSelectedrecordsId.push(objOfSelectedGridRecord[i].data.identifier);
					}
				}
				if(isSiTabSelected==='Y')
					strUrl = 'services/getSIList/getDynamicReport.' + strExtension;
				else
					strUrl = 'services/getLoanCenterList/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.getFilterUrl();
				//strUrl += strQuickFilterUrl;
				//strUrl = strUrl + me.generateFilterUrl();
				var groupView = me.getGroupView();
				var subGroupInfo = groupView.getSubGroupInfo()|| '{}';
				var	groupInfo = groupView.getGroupInfo()|| '{}';
				me.setDataForFilter();
				strUrl = strUrl + me.generateFilterUrl(subGroupInfo, groupInfo);
				var strOrderBy = me.reportOrderURL;
				if(!Ext.isEmpty(strOrderBy)){
					var orderIndex = strOrderBy.indexOf('orderby');
					if(orderIndex > 0){
						strOrderBy = strOrderBy.substring(orderIndex,strOrderBy.length);
						var indexOfamp = strOrderBy.indexOf('&$');
						if(indexOfamp > 0)
							strOrderBy = strOrderBy.substring(0,indexOfamp);
						strUrl += '&$'+strOrderBy;
					}
				}
				
				var grid = objGroupView.getGrid();
				viscols = grid.getAllVisibleColumns();
				for( var j = 0 ; j < viscols.length ; j++ )
				{
					col = viscols[ j ];
					if( col.dataIndex && arrSortColumn[ col.dataIndex ] )
					{
						if( colMap[ arrSortColumn[ col.dataIndex ] ] )
						{
							// ; do nothing
						}
						else
						{
							colMap[ arrSortColumn[ col.dataIndex ] ] = 1;
							colArray.push( arrSortColumn[ col.dataIndex ] );

						}
					}

				}
				if( colMap != null )
				{

					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}
				strUrl = strUrl + "&" + "$isSiTabSelected" + "=" + isSiTabSelected;	
				strUrl = strUrl + strSelect;
				var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
				while (arrMatches = strRegex.exec(strUrl)) {
						objParam[arrMatches[1]] = arrMatches[2];
					}
				strUrl = strUrl.substring(0, strUrl.indexOf('?'));
				
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				
				Object.keys(objParam).map(function(key) { 
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							key, objParam[key]));
					});
					
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
				for(var i=0; i<arrSelectedrecordsId.length; i++){
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier',
							arrSelectedrecordsId[i]));
				}	
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},
			populateLoanRepaymentAmount : function( loanAccNmbr )
			{
				var me = this;
				var strUrl = 'getLoanCenterLoanAccAmount.srvc?$loanAccNmbr=' + loanAccNmbr + '&' + csrfTokenName + '='
					+ csrfTokenValue;
				Ext.Ajax.request(
				{
					url : strUrl,
					method : 'POST',
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						// fnCallback.call( me, filterCode, responseData,
						// applyAdvFilter );
						me.setLoanRepaymentAmountValue( responseData );

					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
			},

			setLoanRepaymentAmountValue : function( loanAmnt )
			{
				var me = this;
				var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();
				objCreateNewRepaymentPanel.down( 'hidden[itemId="loanAmntFieldItemId"]' ).setValue( loanAmnt );
				me.setLoanRepaymentAmountField( objCreateNewRepaymentPanel );
			},

			setLoanRepaymentAmountField : function( objCreateNewRepaymentPanel )
			{
				var amountPaymentType = objCreateNewRepaymentPanel.down( 'radiogroup[itemId="amountRadioItemId"]' )
					.getValue();
				if( 'F' === amountPaymentType.paymentType )
				{
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' )
						.setReadOnly( true );
				}
				else
				{
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setReadOnly(
						false );
				}
				objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setValue(
					objCreateNewRepaymentPanel.down( 'hidden[itemId="loanAmntFieldItemId"]' ).getValue() );
			},

			closeLoanRepaymentViewPopup : function( btn )
			{
				var me = this;
				me.getLoanCenterLoanRepaymentPopupViewRef().close();
			},

			closeLoanDrawdownViewPopup : function( btn )
			{
				var me = this;
				me.getLoanCenterLoanDrawdownPopupViewRef().close();
			},

			handleSaveAndSearchGridAction : function( btn )
			{
				var me = this;
				var callBack = me.postDoSaveAndSearch;
				var strFilterCodeVal=null;
				if (me.filterCodeValue === null) {
					var FilterCode = $("#saveFilterAs").val();
					if(Ext.isEmpty(FilterCode)){
						paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage',getLabel('filternameMsg','Please Enter Filter Name'));
						return;
					}else{
						hideErrorPanel("advancedFilterErrorDiv");
						me.filterCodeValue=FilterCode;
						strFilterCodeVal=me.filterCodeValue;
					}	
				} else {
					strFilterCodeVal = me.filterCodeValue;
				}
				if (Ext.isEmpty(strFilterCodeVal)) {
					paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage',getLabel('filternameMsg','Please Enter Filter Name'));	
					return;	
				} else {
					hideErrorPanel("advancedFilterErrorDiv");
					me.postSaveFilterRequest(me.filterCodeValue, callBack);
				}
			},
			closeGridViewAdvFilterPopup : function( btn )
			{
				var me = this;
				me.getAdvanceFilterPopupRef().close();
			},
			postSaveFilterRequest : function( filterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = isSiTabSelected == 'Y' ? 'userfilters/loanCenterSiAdvFltr/{0}.srvc'
					: 'userfilters/loanCenterTxnAdvFltr/{0}.srvc';
				strUrl = Ext.String.format( strUrl, filterCodeVal );
				/*if(selectedEntryDate.fromDate == "" || selectedEntryDate.fromDate == undefined)
				{
					me.handleEntryDateInAdvFilterChange(me.dateFilterVal);
				}*/
				var objJson = getAdvancedFilterValueJson( filterCodeVal);
				Ext.Ajax.request(
				{
					url : strUrl + "?" + csrfTokenName + "=" + csrfTokenValue,
					method : 'POST',
					jsonData : Ext.encode( objJson ),
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var isSuccess;
						var title, strMsg, imgIcon;
						if( responseData.d.filters && responseData.d.filters.success )
							isSuccess = responseData.d.filters.success;
						if( isSuccess && isSuccess === 'N' )
						{
							title = getLabel( 'instrumentSaveFilterPopupTitle', 'Message' );
							strMsg = responseData.d.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show(
							{
								title : title,
								msg : strMsg,
								width : 200,
								cls : 't7-popup',
								buttons : Ext.MessageBox.OK,
								icon : imgIcon
							} );
						}
						if( filterCodeVal && isSuccess && isSuccess === 'Y' )
						{
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call( me );          
							me.updateSavedFilterComboInQuickFilter();   
						}
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );

			},
			reloadFilters: function(store){
				store.reload({
										callback : function() {
											var storeGrid = filterGridStore();
											store.loadRecords(
													storeGrid.getRange(0, storeGrid
																	.getCount()), {
														addRecords : false
													});
		
										}
									});
			},
			handleEntryDateChange:function(filterType,btn,opts){
				var me=this;
				if(filterType=="entryDateQuickFilter"){
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					me.filterAppiled='Q';
					me.resetSavedFilterCombo();
					me.setDataForFilter();
					me.applyQuickFilter();					
				} else if (filterType == "entryDate") {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					//me.handleDateChange(btn.btnValue);
					me.filterAppiled='A';
					me.handleEntryDateInAdvFilterChange(btn.btnValue);
				}
				//me.updateSavedFilterComboInQuickFilter();
			},
			handleEntryDateInAdvFilterChange : function(index) {
				var me = this;
				var dateToField;
				var objDateParams = me.getDateParam(index, 'requestDate');
				if (!Ext.isEmpty(me.dateFilterLabel)) {
					$('label[for="requestDateLabelItemId"]').text(getLabel('requestDate',
							'Request Date')
							+ " (" + me.dateFilterLabel + ")");
				}
				var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
				var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
				var filterOperator = objDateParams.operator;
				
				if (index == '13') {
					if (filterOperator == 'eq') {
						$('#entryDateFrom').datepick('setDate', vFromDate);
					} else {
						$('#entryDateFrom').datepick('setDate', [vFromDate, vToDate]);
					}
					if (filterOperator == 'eq')
						dateToField = "";
					else
						dateToField = vToDate;
					selectedEntryDate = {
						operator : filterOperator,
						fromDate : objDateParams.fieldValue1,
						toDate : objDateParams.fieldValue2,
						dateLabel : me.dateFilterLabel
					};
				} else {
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
							$('#entryDateFrom').datepick('setDate', vToDate);
						} else if(index === '12'){
							$('#entryDateFrom').datepick('setDate', vFromDate);
						} else {
							$('#entryDateFrom').datepick('setDate', vFromDate);
						}
					} else {
						$('#entryDateFrom').datepick('setDate', [vFromDate, vToDate]);
					}
					if (filterOperator == 'eq')
						dateToField = "";
					else
						dateToField = vToDate;
					selectedEntryDate = {
						operator : filterOperator,
						fromDate : objDateParams.fieldValue1,
						toDate : objDateParams.fieldValue2,
						dateLabel : me.dateFilterLabel
					};
				}
				var vParamName = 'requestDate';
				var entryDateApplied = false;
				 $.each(me.filterData,function(index,element){       
				      if (element.paramName === vParamName ) {
				    	  element.paramValue1 = selectedEntryDate.fromDate;
				    	  element.paramValue2 = selectedEntryDate.toDate; 
				    	  element.paramFieldLable = getLabel('lblreqdate', 'Request Date'); 
			    		  element.operatorValue = selectedEntryDate.operator; 
			    		  element.dataType = 'D'; 
			    		  entryDateApplied = true;
				    	  return false;
				      }
				    });
				 if(!entryDateApplied){
					 me.filterData.push(
								{
									paramName : 'requestDate',
									paramIsMandatory : true,
									paramValue1 : selectedEntryDate.fromDat,
									paramValue2 : selectedEntryDate.toField,
									operatorValue : selectedEntryDate.operator,
									dataType : 'D',
									paramFieldLable : getLabel('lblreqdate', 'Request Date')
								} );
				 }
			},
			postDoSaveAndSearch : function()
			{
				var me = this, objGroupView = null, savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
				if (savedFilterCombobox) {
					savedFilterCombobox.getStore().reload();
					savedFilterCombobox.setValue(me.filterCodeValue);
				}
				objAdvSavedFilterComboBox = $("#msSavedFilter");
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
				me.applyAdvancedFilter();
				objGroupView = me.getGroupView();
				objGroupView.setFilterToolTip(me.filterCodeValue || '');
			},
			handleSearchActionGridView : function( btn )
			{
				var me = this, objGroupView = null, savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				me.filterDeleted = false;
				me.filterData=[];
				var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
						.is(':checked');
				if($('#entryDateFrom').val() == "")
				{
					selectedEntryDate = {};
				}
				if (SaveFilterChkBoxVal === true) {
					me.handleSaveAndSearchAction();
				} else {
					me.applyAdvancedFilter();
					if (savedFilterCombobox)
						savedFilterCombobox.setValue('');
					objGroupView = me.getGroupView();
					objGroupView.setFilterToolTip('');
					$('#advancedFilterPopup').dialog("close");
				}
			},
			handleSaveAndSearchAction : function(btn) {
				var me = this;
				var callBack = this.postDoSaveAndSearch;
				var strFilterCodeVal = null;
				var FilterCode = $("#filterCode").val();
				if (Ext.isEmpty(FilterCode)) {
					paintError('#advancedFilterErrorDiv',
							'#advancedFilterErrorMessage', getLabel('filternameMsg',
									'Please Enter Filter Name'));
					return;
				}else {
					hideErrorPanel("advancedFilterErrorDiv");
					$('#advancedFilterPopup').dialog("close");
					me.filterCodeValue = FilterCode;
					me.savedFilterVal = FilterCode;
					strFilterCodeVal = me.filterCodeValue;
				}
				me.savePrefAdvFilterCode = strFilterCodeVal;
				hideErrorPanel("advancedFilterErrorDiv");
				me.postSaveFilterRequest(strFilterCodeVal, callBack);
			},			
			doAdvSearchOnly : function()
			{
				var me = this;
				me.applyAdvancedFilter();
			},
			applyAdvancedFilter : function()
			{
				var me = this;
				
				var entryDateLableVal = $('label[for="requestDateLabelItemId"]').text();
				var entryDateField = $("#entryDateFrom");
				me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
				me.filterApplied = 'A';
				me.setDataForFilter();
				me.refreshData();
				//me.resetAllFields();     
			},
			handleAfterGridDataLoad : function( grid, jsonData )
			{
				var me = grid.ownerCt;
				me.setLoading( false );
			},
			showLoanCenterLoanRepaymentPopupView : function( btn )
			{
				//goToPage(  'addPayDown.srvc', 'frmMain', 'P', 'Y', btn );
			},

			showLoanCenterLoanDrawdownPopupView : function( btn )
			{
				//goToPage( 'addAdvance.srvc', 'frmMain', 'D', 'Y', btn );
				// showAdvancePopup();
			},
			setDataForFilter : function()
			{
				var me = this, objJson = null, reqJson = null, arrQuickJson = null;
				me.filterData = me.getQuickFilterQueryJson();
				if (me.filterApplied === 'Q' || me.filterApplied === 'ALL') {
				//this.filterData = {};
				var objJson = getAdvancedFilterQueryJson();
				reqJson = me.findInAdvFilterData(objJson, "requestDate");
				if (!Ext.isEmpty(reqJson)) {
					arrQuickJson = objJson;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "requestDate");
					me.advFilterData = arrQuickJson;
				}
				if (me.clientCode !== null)
				{
					objJson = getAdvancedFilterQueryJson();
					if(me.clientCode!='all')
					{	
						objJson.push({
							field : 'clientCode',
							operator : 'in',
							value1 : encodeURIComponent(me.clientCode.replace(new RegExp("'", 'g'), "\''")),
							value2 : '',
							dataType : 0,
							displayType : 11,
							detailFilter : 'Y',
							fieldLabel : getLabel('lblClient','Company Name'),
							displayValue1 : me.clientDesc
						});
					}	
					me.advFilterData = objJson;
				}
				}
				
				else if( me.filterApplied === 'A'  && me.filterDeleted == false)
				{
					objJson = getAdvancedFilterQueryJson();
					me.advFilterData = objJson;
					var filterCode = $("input[type='text'][id='saveFilterAs']").val();
					me.advFilterCodeApplied = filterCode;
				}
			},
			/*Page setting handling starts here*/
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
					me.preferenceHandler.readPagePreferences(me.strPageName, me.updateObjLoanSummaryPref,args, me,false);
				}				
			},
			updateObjLoanSummaryPref : function(data){
				objLoanCenterPref = Ext.encode(data);
			},				
			applyPageSetting : function(arrPref,strInvokedFrom) {
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
				 {
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
					} 
					else					
						me.loadSummaryPage();
				} else {
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle', 'Error'),
								msg : getLabel('errorMsg',
										'Error while apply/restore setting'),
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
						me.loadSummaryPage();
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
				var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
				var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster, strTitle = null, subGroupInfo;

				me.pageSettingPopup = null;

				if (!Ext.isEmpty(objLoanCenterPref)) {
					objPrefData = Ext.decode(objLoanCenterPref);
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
							? objPrefData.d.preferences.ColumnSetting.gridCols
							: (LOANCENTER_GENERIC_COLUMN_MODEL || '[]');

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
				 'userfilterslist/?'
				objData["filterUrl"] = 'services/userfilterslist/' +( isSiTabSelected == 'Y' ? 'loanCenterSiAdvFltr.srvc?' : 'loanCenterTxnAdvFltr.srvc?') +csrfTokenName + '=' + csrfTokenValue;
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
							cfgInvokedFrom : strInvokedFrom,
							title : strTitle,
							cfgViewOnly : _IsEmulationMode
							//,cfgHideGroupBy : true
						});
				me.pageSettingPopup.show();
				me.pageSettingPopup.center();
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
			findInAdvFilterData : function(arr, key) {
				var reqJson = null;
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.field == key) {
						reqJson = ai;
					}
				}
				return reqJson;
			},
			removeFromAdvanceArrJson : function(arr,key){
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.field == key) {
						arr.splice(i, 1);
					}
				}
				return arr;
			},			
			handleAppliedFilterDelete : function(btn){
				var me = this;
				var objData = btn.data;
				var advJsonData = me.advFilterData;
				var quickJsonData = me.filterData;
				if(!Ext.isEmpty(objData)){
					var paramName = objData.paramName || objData.field;
					var reqJsonInAdv = null;
					var arrAdvJson =null;
					//adv
					var reqJsonInAdv = me.findInAdvFilterData(advJsonData,paramName);
					if (!Ext.isEmpty(reqJsonInAdv)) {
						arrAdvJson = advJsonData;
						arrAdvJson = me.removeFromAdvanceArrJson(arrAdvJson,paramName);
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
					// only for Date filter which is in Quick as well as Adv filter following code is applicable
					if(!Ext.isEmpty(paramName) && ( paramName == 'effectiveDate' || paramName == 'requestDate' ))
					{
						me.filterDeleted = true;
					}
					me.resetFieldInAdvAndQuickOnDelete(objData);
					me.refreshData();
				}
			},			
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var index = me.dateFilterVal;
				var loanCenterTypeFilterVal = me.loanCenterTypeFilterVal;
				var objDateParams = me.getDateParam( index );

					jsonArray.push(
					{
						paramName : isSiTabSelected == 'Y' ? 'requestDate' : 'requestDate',
						paramIsMandatory : true,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('lblreqdate', 'Request Date')
					} );
				

				if( loanCenterTypeFilterVal != null && loanCenterTypeFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'paymentType',
						paramValue1 : encodeURIComponent(me.loanCenterTypeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'in',
						dataType : 'A'
					} );
				}

				if( isSiTabSelected == 'Y' )
				{
					jsonArray.push(
					{
						paramName : 'siEnabled',
						paramValue1 : 'Y',
						operatorValue : 'eq',
						dataType : 'S'
					} );
					jsonArray.push(
					{
						paramName : 'requestStatus',
						paramValue1 : '3',
						operatorValue : 'ge',
						dataType : 'S'
					} );					
				}
				else
				{
					jsonArray.push(
					{
						paramName : 'txnType',
						paramValue1 : 1,
						operatorValue : 'ne',
						dataType : 'S'
					} );
				}
				
				if(me.clientCode != null && !Ext.isEmpty(me.clientCode) && me.clientCode != 'all' && 'undefined' != me.clientCode)
				jsonArray.push(
					{
						paramName : 'clientCode',
						paramValue1 : encodeURIComponent(me.clientCode.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						displayValue1 : me.clientDesc								
					} );

				// me.filterData = jsonArray;
				return jsonArray;
			},
			applyQuickFilter : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				var groupInfo = objGroupView.getGroupInfo();
				me.filterApplied = 'Q';
				if (groupInfo && (groupInfo.groupTypeCode === 'LONTXNSUMM_OPT_ADVFILTER' || groupInfo.groupTypeCode === 'LONSISUMM_OPT_ADVFILTER')) {
					objGroupView.setActiveTab('all');
				} else
					me.refreshData();
			},
			
			refreshData : function() {
				var me = this;
				var objGroupView = me.getGroupView();
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
			//	me.hideQuickFilter();
			},
			hideQuickFilter: function(){
				var me = this;
				if(!Ext.isEmpty(me.getFilterView()))
				{
					me.getFilterView().hide();
					me.getFilterButton().filterVisible = false;
					me.getFilterButton().removeCls('filter-icon-hover');
				}
			},
			doHandleRowActions : function(actionName, grid, record, rowIndex) {
				var me = this;
				// var actionName = actName; //btn.itemId;
				if (actionName === 'accept' || actionName === 'reject') {
					var chrLoanReqType = record && record.get('paymentType') ? record
							.get('paymentType') : '';
					if (!Ext.isEmpty(chrLoanReqType)) {
						if (chrLoanReqType === 'F')
							actionName = actionName === 'accept'
									? 'acceptPaydown'
									: 'rejectPaydown';
						if(chrLoanReqType === 'P')
							strAction = actionName === 'accept'
								? 'acceptPartialPaydown'
								: 'rejectPartialPaydown';	
						if(chrLoanReqType === 'O')
							strAction = actionName === 'accept'
								? 'acceptPayOffPaydown'
								: 'rejectPayOffPaydown';
						if (chrLoanReqType === 'I')
							actionName = actionName === 'accept'
									? 'acceptInvoice'
									: 'rejectInvoice';
						if (chrLoanReqType === 'D')
							actionName = actionName === 'accept'
									? 'acceptAdvance'
									: 'rejectAdvance';
						me.handleGroupActions(actionName, grid, [record], 'rowAction');
					}
				} else if (actionName === 'discard' || actionName === 'enable'
						|| actionName === 'disable') {
					me.handleGroupActions(actionName, grid, [record], 'rowAction');
				} else if (actionName === 'btnHistory') {
					var recHistory = record.get('history');
					if (!Ext.isEmpty(recHistory)
							&& !Ext.isEmpty(recHistory.__deferred.uri)) {
						me.showHistory(record.get('history').__deferred.uri, record
										.get('identifier'));
					}
				} else if (actionName === 'btnView') {
					var me = this;
					//me.submitForm('viewLoanCenterRecord.srvc', record, rowIndex);
					// condition added to avoid double call from grid cell click
					if(ifFirstTimeClicked)
					{
						ifFirstTimeClicked = false;
						showLaonCenterView(record);
					}
				}
				else if( actionName === 'btnClone' )
				{
					var me = this;
					//me.submitForm( 'cloneLoanPayment.srvc', record, rowIndex );
					CloneLoanCenter(record);
				}
			},
			populateDataInViewPopup : function( record, strPaymentType )
			{
				var me = this;
				if( strPaymentType == 'D' )
				{
					var objCreateNewDrawdownPanel = me.getLoanCenterLoanDrawdownPopupViewRef();

					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="loanAccNmbrFieldItemId"]' ).setValue(
						record.get( 'loanAccNmbr' ) );
					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="beneCodeFilterItemId"]' ).setValue(
						record.get( 'beneCode' ) );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setValue(
						record.get( 'requestedAmnt' ) );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="requestReferenceFieldItemId"]' ).setValue(
						record.get( 'requestReference' ) );
					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' ).setValue(
						record.get( 'productCode' ) );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="scheduledDateFieldItemId"]' ).setValue(
						record.get( 'scheduledDate' ) );
					objCreateNewDrawdownPanel.down( 'radiogroup[itemId="productTypeRadioItemId"]' ).setValue(
					{
						productType : record.get( 'productType' )
					} );

					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="loanAccNmbrFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="beneCodeFilterItemId"]' ).setReadOnly( true );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setReadOnly( true );
					objCreateNewDrawdownPanel.down( 'textfield[itemId="requestReferenceFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewDrawdownPanel.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewDrawdownPanel.down( 'datefield[itemId="scheduledDateFieldItemId"]' ).setReadOnly( true );
					objCreateNewDrawdownPanel.down( 'radiogroup[itemId="productTypeRadioItemId"]' ).setReadOnly( true );
					objCreateNewDrawdownPanel.down( 'button[itemId="saveBtnItemId"]' ).hide();
				}
				else
				{
					var objCreateNewRepaymentPanel = me.getLoanCenterLoanRepaymentPopupViewRef();

					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="loanAccNmbrFieldItemId"]' ).setValue(
						record.get( 'loanAccNmbr' ) );
					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="debitAccNmbrFieldItemId"]' ).setValue(
						record.get( 'debitAccNmbr' ) );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' ).setValue(
						record.get( 'requestedAmnt' ) );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestReferenceFieldItemId"]' ).setValue(
						record.get( 'requestReference' ) );
					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' ).setValue(
						record.get( 'productCode' ) );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="scheduledDateFieldItemId"]' ).setValue(
						record.get( 'scheduledDate' ) );
					objCreateNewRepaymentPanel.down( 'radiogroup[itemId="amountRadioItemId"]' ).setValue(
					{
						paymentType : record.get( 'paymentType' )
					} );

					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="loanAccNmbrFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="debitAccNmbrFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestedAmntFieldItemId"]' )
						.setReadOnly( true );
					objCreateNewRepaymentPanel.down( 'textfield[itemId="requestReferenceFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewRepaymentPanel.down( 'AutoCompleter[itemId="productCodeFieldItemId"]' ).setReadOnly(
						true );
					objCreateNewRepaymentPanel.down( 'datefield[itemId="scheduledDateFieldItemId"]' )
						.setReadOnly( true );
					objCreateNewRepaymentPanel.down( 'radiogroup[itemId="amountRadioItemId"]' ).setReadOnly( true );
					objCreateNewRepaymentPanel.down( 'button[itemId="saveBtnItemId"]' ).hide();
				}
			},

			submitForm : function( strUrl, record, rowIndex )
			{
				var me = this;
				var paymentType = record.get( 'paymentType' );
				if( paymentType == 'F' )
					paymentType = 'P';
				var form;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				// form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
				// 'txtRecordIndex', rowIndex ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'selectedPayType', paymentType ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'isOpenPopup', 'Y' ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$isSiTabSelected', isSiTabSelected ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.get( 'identifier' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record.get( 'version' ) ) );				
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'appliedQuickFilter', JSON.stringify(me.filterData)) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'appliedAdvanceFilter', JSON.stringify(me.advFilterData)) );		
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
			},
			
			loadSummaryPage : function()
			{
				if(isSiTabSelected ==='Y')
					submitForm('loanCenterSiNew.srvc');
				else	
					submitForm('loanCenterNew.srvc');
			},

			showHistory : function( url, id )
			{
			 var historyPopup =	Ext.create(
					'GCP.view.LoanCenterHistoryPopupView',
					{
						historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue + "&" + "$isSiTabSelected" + "="
							+ isSiTabSelected,
						identifier : id
					} ).show();
				historyPopup.center();
				Ext.getCmp('btnLoanCenterHistoryPopupClose').focus();
			},
			createFormField : function( element, type, name, value )
			{
				var inputField;
				inputField = document.createElement( element );
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},

			loadDetailCount : function( sortOrder )
			{
				var me = this;
				Ext.Ajax.request(
				{
					url : 'prfCountDetails.srvc',
					async : false,
					method : "GET",
					success : function( response )
					{
						var data = Ext.decode( response.responseText );
						prfMstCnt = data;
					},
					failure : function( response )
					{
						console.log( 'Error Occured' );
					}
				} );
			},

			getLoanCenterGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				
				if( !Ext.isEmpty( objGridViewPref ) )
					{
						var data = Ext.decode( objGridViewPref );
						var objPref = data[ 0 ];
						me.arrSorter = objPref.sortState;
					}
				if( isSiTabSelected == 'Y' )
				{
					objWidthMap =
					{
						"requestReference" : 90,
						"obligorID" : 100,
						"obligationID" : 120,
						"accountName" : 120,
						"requestedAmnt" : 100,
						"effectiveDate" : 90,
						"paymentTypeDesc" : 90,
						"siRequestStatusDesc" : 90
					};
				}
				else
				{
					objWidthMap =
					{
						"requestReference" : 90,
						"obligorID" : 90,
						"obligationID" : 120,
						"accountName" : 120,
						"requestedAmnt" : 90,
						"requestDate" : 100,
						"paymentTypeDesc" : 90,
						"requestStatusDesc" : 90,
						"hostResponseMsg" : 120
					};
				}

				if( isSiTabSelected == 'Y' )
				{
					arrColsPref =
					[
						{
							"colId" : "requestReference",
							"colHeader" : getLabel( 'reference', 'Reference' )
						},
						{
							"colId" : "obligorID",
							"colHeader" : getLabel( 'obligorNumber', 'Obligor Id' )
						},
						{
							"colId" : "obligationID",
							"colHeader" : getLabel( 'obligationNumber', 'Obligation Id' )
						},
						{
							"colId" : "accountName",
							"colHeader" : getLabel( 'accountName', 'Account Name' )
						},
						{
							"colId" : "requestedAmnt",
							"colHeader" : getLabel( 'requestedAmnt', 'Amount' ),
							"colType" : "number"
						},
						{
							"colId" : "effectiveDate",
							"colHeader" : getLabel( 'effectiveDate', 'Effective Date' )
						},
						{
							"colId" : "paymentTypeDesc",
							"colHeader" : getLabel( 'paymentTypeDesc', 'Type' )
						},
						{
							"colId" : "siRequestStatusDesc",
							"colHeader" : getLabel( 'statusDesc', 'Status' )
						}
					];
				}
				else
				{
					arrColsPref =
					[
						{
							"colId" : "requestReference",
							"colHeader" : getLabel( 'reference', 'Reference' )
						},
						{
							"colId" : "obligorID",
							"colHeader" : getLabel( 'obligorID', 'Obligor Id' )
						},
						{
							"colId" : "obligationID",
							"colHeader" : getLabel( 'obligationID', 'Obligation Id' )
						},
						{
							"colId" : "accountName",
							"colHeader" : getLabel( 'accountName', 'Account Name' )
						},
						{
							"colId" : "requestedAmnt",
							"colHeader" : getLabel( 'requestedAmnt', 'Amount' ),
							"colType" : "number"
						},
						{
							"colId" : "requestDate",
							"colHeader" : getLabel( 'requestDate', 'Request Date' )
						},
						{
							"colId" : "paymentTypeDesc",
							"colHeader" : getLabel( 'paymentTypeDesc', 'Type' )
						},
						{
							"colId" : "requestStatusDesc",
							"colHeader" : getLabel( 'statusDesc', 'Status' )
						},
						{
							"colId" : "hostResponseMsg",
							"colHeader" : getLabel( 'hostResponseMessage', 'Host Message' )
						}
					];
				}

				storeModel =
				{
					fields :
					[
						'requestReference', 'obligorID', 'obligationID', 'accountName', 'requestedAmnt', 'requestDate',
						'effectiveDate', 'paymentTypeDesc', 'requestStatusDesc', 'siRequestStatusDesc',
						'hostResponseMsg', 'paymentType', 'recordKeyNo', 'version', 'history', 'identifier',
						'countPaydown','countAdvance','countInvoice','bdAmountPaydown','bdAmountAdvance','bdAmountInvoice',
						'__metadata', '__subTotal'
					],
					proxyUrl : 'getLoanCenterList.srvc',
					rootNode : 'd.loanCenterTxn',
					sortState : me.arrSorter,
					totalRowsNode : 'd.__count'
				};

				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : arrColsPref,
					"storeModel" : storeModel
				};
				return objConfigMap;
			},

			setGridInfoSummary : function( grid )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				var summaryData;
				var dataStore=grid.getStore();
				dataStore.on( 'load', function( store, records )
				{
					var i = records.length - 1;
					if( i >= 0 )
					{	
						summaryData=[{
							title:getLabel( 'lblTotalPaydownOutstanding', 'Total Paydown Requests' ),
							amount:records[ i ].get( 'bdAmountPaydown' )+" (#"+records[ i ].get( 'countPaydown' )+")"
						},{
							title: getLabel( 'lblTotalAdvanceOutstanding', 'Total Advance Requests' ),
							amount:records[ i ].get( 'bdAmountAdvance' )+" (#"+records[ i ].get( 'countAdvance' )+")"
						},{
							title:getLabel( 'lblTotalInvoicesOutstanding', 'Total Pay Invoice Requests' ),
							amount:records[ i ].get( 'bdAmountInvoice' )+" (#"+records[ i ].get( 'countInvoice' )+")" 
						}]	
					}
					else
					{
						summaryData=[{
							title:getLabel( 'lblTotalPaydownOutstanding', 'Total Paydown Requests' ),
							amount:"$0.000 (#0)"
						},{
							title: getLabel( 'lblTotalAdvanceOutstanding', 'Total Advance Requests' ),
							amount:"$0.000 (#0)"
						},{
							title:getLabel( 'lblTotalInvoicesOutstanding', 'Total Pay Invoice Requests' ),
							amount:"$0.000 (#0)"
						}]		
					}
					$('#summaryCarousal').carousel({
						data : summaryData,
						titleNode : "title",
						contentNode :"amount"
					});
				} );
			},			
			handleReconfigureGrid : function(data) {
				var me = this;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getLoanCenterGridViewRef(), gridModel = null, objData = null;
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
			handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
					newPgNo, oldPgNo, sorter, filterData) {
				var me = this;
				var objLableFound = false;		
				var tempFilterData =[];
				var objFilterArray =[]; 	
				var objGroupView = me.getGroupView();
				var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];	
				
				//saving local prefrences
				if(allowLocalPreference === 'Y')
					me.handleSaveLocalStorage();
				if(!Ext.isEmpty(strAppliedQuickFilter))
				{
					me.filterData = JSON.parse(strAppliedQuickFilter);
					me.filterApplied = '';
					strAppliedQuickFilter = null;
				}		
				if(!Ext.isEmpty(strAppliedAdvanceFilter))
				{
					me.advFilterData = JSON.parse(strAppliedAdvanceFilter);				
					me.filterApplied = '';
					strAppliedAdvanceFilter = null;
				}				
				var buttonMask = me.strDefaultMask;
				objGroupView.handleGroupActionsVisibility(buttonMask);
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
				//me.reportGridOrder = strUrl;
				me.disableActions(true);
				me.setDataForFilter();
				strUrl = strUrl + "&" + "$isSiTabSelected" + "=" + isSiTabSelected;
				strUrl = strUrl + me.generateFilterUrl(subGroupInfo, groupInfo);
				strUrl = strUrl + '&' + csrfTokenName + '=' + csrfTokenValue;
				strUrl += me.generateColumnFilterUrl(filterData,strUrl);
				me.reportOrderURL = strUrl;
				if(!Ext.isEmpty(me.filterData)){
					if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
						me.tempFilterData=me.filterData;
						$.each(me.tempFilterData, function( index, value ) {
							  if(  me.tempFilterData[index].paramName =='siEnabled' )
							  {
								  me.tempFilterData.splice(index, 1);
								  return false;
							  }
						});
						$.each(me.tempFilterData, function( index, value ) {
							  if( me.tempFilterData[index].paramName == 'requestStatus' )
							  {
								  me.tempFilterData.splice(index, 1);
								  return false;
							  }
						});
						arrOfParseQuickFilter = generateFilterArray(me.tempFilterData);
					}
				}
				if (!Ext.isEmpty(me.advFilterData)) {
					if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {
						arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
					}
				}				
				if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
					arrOfFilteredApplied = arrOfParseQuickFilter.concat(arrOfParseAdvFilter);
				}
				if(arrOfFilteredApplied) {
						objFilterArray = arrOfFilteredApplied;	
						$.each(objFilterArray, function(index, cfgFilter) {							
							if(null!=cfgFilter && cfgFilter !=undefined)
							{
								if(null!=cfgFilter && cfgFilter !=undefined)
								{															
									if(cfgFilter.fieldId == "txnType")
									{
										objFilterArray.splice(index, 1);
									}								
								}
								if(objLableFound)
								{
									objFilterArray.splice(index, 1);
									objLableFound = false;
								}
							}
						});							
						$.each(objFilterArray, function(index, cfgFilter) {
							if(null!=cfgFilter && cfgFilter !=undefined)
							{
								if(cfgFilter.fieldId == "siValidFlag")
								{
									objFilterArray.splice(index, 1);
								}																						
							}	
						});	
						$.each(objFilterArray, function(index, cfgFilter) {
							if(null!=cfgFilter && cfgFilter !=undefined)
							{
								if(cfgFilter.fieldId == "makerId")
								{
									objFilterArray.splice(index, 1);
								}																						
							}	
						});						
						$.each(objFilterArray, function(index, cfgFilter) {
							if(null!=cfgFilter && cfgFilter !=undefined)
							{
								if(cfgFilter.fieldId == "siEnabled")
								{
									objFilterArray.splice(index, 1);
								}																						
							}	
						});							
						me.getFilterView().updateFilterInfo(objFilterArray);
				}
				me.reportGridOrder = strUrl;
				grid.loadGridData(strUrl, null, null, false);
				if(isSiTabSelected=='N'){
					me.setGridInfoSummary();
				}
				grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
					var clickedColumn = tableView.getGridColumns()[cellIndex];
					var columnType = clickedColumn.colType;
					if(Ext.isEmpty(columnType)) {
						var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
						columnType = containsCheckboxCss ? 'checkboxColumn' : '';
					}
					me.handleGridRowClick(record, grid, columnType);
				});
						
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
						me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
					}
				}
			},
			
			resetFieldInAdvAndQuickOnDelete : function(objData){
				var me = this,strFieldName;			
				if(!Ext.isEmpty(objData))
					strFieldName = objData.paramName || objData.field;
				if (strFieldName === 'requestReference')
					$("#requestReferenceAdvFilter").val("");
				else if (strFieldName === 'obligorID')
					$("#obligorIDAdvFilter").val("");
				else if (strFieldName === 'obligationID')
					$("#obligationIDAdvFilter").val("");
				else if (strFieldName === 'accountName')
				{
					$("#accountNameAdvFilter").val("");
				}else if(strFieldName === 'siReqStateValidFlag' || strFieldName === 'requestStatus'){
					$('#statusAdvFilter option').prop('selected', true);
					$('#statusAdvFilter').multiselect("refresh");
				}
				else if (strFieldName === 'requestedAmnt'){
					$("#requestedAmntAdvFilter").val("");
					$("#operatorAmntAdvFilter").val("eq");
				}
				else if(strFieldName === 'requestDate' || strFieldName ==='effectiveDate'){
						var objDateParams = me.getDateParam('1');
						var vFromDate = objDateParams.fieldValue1;
						var dateFilterRef = $('#entryDataPicker');
						
						if (!Ext.isEmpty(vFromDate)) {
							formattedFromDate = Ext.util.Format.date(Ext.Date.parse(vFromDate, 'Y-m-d'), strExtApplicationDateFormat);
							$(dateFilterRef).val(formattedFromDate);
						}
						
						selectedEntryDate = {
								operator : 'eq',
								fromDate : formattedFromDate,
								toDate : formattedFromDate,
								dateLabel : 'Today'
							};
						$('label[for="requestDateLabelItemId"]').text(getLabel('requestDate','Request Date')
										+ " (" + selectedEntryDate.dateLabel + ")");
						
				}				
				else if(strFieldName ==='clientCode'){					
					if(isClientUser()){
						var clientComboBox = me.getLoanCenterFilterView()
								.down('combo[itemId="clientBtn"]');
						me.clientCode = 'all';
						me.clientDesc = '';
						clientComboBox.setValue(me.clientCode);
					} else {
						var clientComboBox = me.getLoanCenterFilterView()
								.down('combo[itemId="clientAutoCompleter]');
						clientComboBox.reset();
						me.clientCode = 'all';
						me.clientDesc = '';
					}
				}					
			},			
			
			handleSavedFilterClick : function() {
				var me = this;
				var savedFilterVal = $("#msSavedFilter").val();
				me.resetAllFields();
				me.filterCodeValue = null;

				var filterCodeRef = $("input[type='text'][id='filterCode']");
				if (!Ext.isEmpty(filterCodeRef)) {
					filterCodeRef.val(savedFilterVal);
					me.savedFilterVal = savedFilterVal;
				}

				var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
				if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
					saveFilterChkBoxRef.prop('checked', true);

				var applyAdvFilter = false;
				me.filterCodeValue = savedFilterVal;
				me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
						applyAdvFilter);
			},			
			generateColumnFilterUrl : function(filterData,url) {
				var strUrl = '', strTempUrl = '';
				var obj = null, arrValues = null;
				var arrNested = null
				if (filterData) {
					for (var key in filterData) {
						obj = filterData[key] || {};
						arrValues = obj.value || [];
						if (obj.type === 'list') {
							Ext.each(arrValues, function(item) {
										if (item) {
											arrNested = item.split(',');
											Ext.each(arrNested, function(value) {
														strTempUrl += strTempUrl
																? ' or '
																: '';
														strTempUrl += arrSortColumn[key]
																+ ' eq \''
																+ value
																+ '\'';
													});
										}
									});
							if (strTempUrl)
								strTempUrl = '( ' + strTempUrl + ' )';
						}
					}
				}
				if (strTempUrl)
				{
				 if(!Ext.isEmpty(url) && url.indexOf('$filter')> -1)
				   {
					strUrl = ' and ' + strTempUrl;
					}
					else
					{
					  strUrl ='&$filter=' + strTempUrl;
					}
					
				}
				return strUrl;
			},
			generateFilterUrl : function(subGroupInfo, groupInfo) {
				var me = this;
				var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
				me.removeDuplicateEntryDateParamAdvFilterData();
				if (me.filterApplied === 'ALL') {
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
					if (!Ext.isEmpty(strQuickFilterUrl)) {
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
				} else {
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
					if (!Ext.isEmpty(strQuickFilterUrl)) {
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
					strAdvancedFilterUrl = me
							.generateUrlWithAdvancedFilterParams(isFilterApplied);
					if (!Ext.isEmpty(strAdvancedFilterUrl)) {
						if (Ext.isEmpty(strUrl)) {
							strUrl = "&$filter=";
						}
						strUrl += strAdvancedFilterUrl;
						isFilterApplied = true;
					}
				}
				if (!Ext.isEmpty(strGroupQuery)) {
					if (!Ext.isEmpty(strUrl))
						strUrl += ' and ' + strGroupQuery;
					else
						strUrl += '&$filter=' + strGroupQuery;
				}
				return strUrl;
			},
			/*
			 * getFilterUrl : function() { var me = this; var strQuickFilterUrl =
			 * ''; strQuickFilterUrl = me.generateUrlWithFilterParams( this );
			 * return strQuickFilterUrl; },
			 */

			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', strActionStatusUrl = '', isFilterApplied = 'false';
				// strActionStatusUrl = me.generateActionStatusUrl();

				if( me.filterApplied === 'ALL')
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += '&$filter=' + strQuickFilterUrl;
						//isFilterApplied = true;
					}
				}
				else
				{	
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
					if (!Ext.isEmpty(strQuickFilterUrl)) {
						strUrl += '&$filter=' + strQuickFilterUrl;
						//isFilterApplied = true;
					}
					strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
					if (!Ext.isEmpty(strAdvFilterUrl))
					{
						if( strUrl == '' )
							strUrl += '&$filter=' + strAdvFilterUrl;
						else
							strUrl += ' and ' + strAdvFilterUrl;
					}
					if( !Ext.isEmpty( strActionStatusUrl ) )
					{
						if( isFilterApplied )
							strUrl += ' and ' + strActionStatusUrl;
						else
							strUrl += '&$filter=' + strActionStatusUrl;
					}
				}
				return strUrl;
			},

			generateUrlWithQuickFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '';//'&$filter=';
				var strTemp = '';
				var strFilterParam = '';

				for( var index = 0 ; index < filterData.length ; index++ )
				{
					if( isFilterApplied )
						strTemp = strTemp + ' and ';
					switch( filterData[ index ].operatorValue )
					{
						case 'bt':
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'' + ' and ' + 'date\''
									+ filterData[ index ].paramValue2 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'' + ' and ' + '\'' + filterData[ index ].paramValue2 + '\'';
							}
							break;
						case 'in':
							var arrId = filterData[ index ].paramValue1;
							if( 0 != arrId.length )
							{
								strTemp = strTemp + '(';
								for( var count = 0 ; count < arrId.length ; count++ )
								{
									strTemp = strTemp + filterData[ index ].paramName + ' eq ' + '\'' + arrId[ count ]
										+ '\'';
									if( count != arrId.length - 1 )
									{
										strTemp = strTemp + ' or ';
									}
								}
								strTemp = strTemp + ' )';
							}
							break;
						default:
							// Default opertator is eq
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'';
							}
							break;
					}
					isFilterApplied = true;
				}
				if( isFilterApplied )
					strFilter = strFilter + strTemp;
				else
					strFilter = '';
				return strFilter;
			},
			removeDuplicateEntryDateParamAdvFilterData : function ()
			{
				var me = this;
				var paramName = isSiTabSelected == 'Y' ? 'requestDate': 'requestDate';
				if( this.filterApplied === 'Q' || this.filterApplied === 'ALL' )
				{
					// adv
					var advJsonData = me.advFilterData;
					var arrAdvJson = null;
					var reqJsonInAdv = me.findInAdvFilterData(advJsonData, paramName);
					if (!Ext.isEmpty(advJsonData))
					{
						arrAdvJson = advJsonData;
						arrAdvJson = me.removeFromAdvanceArrJson(advJsonData, paramName);
						me.advFilterData = arrAdvJson;
					}
				}
				if( this.filterApplied === 'A'  && me.filterDeleted == false)
				{
					// quick
					var arrQuickJson = null;
					var reqJsonInQuick = me.findInAdvFilterData(me.advFilterData,paramName);
					if (!Ext.isEmpty(reqJsonInQuick))
					{
						arrQuickJson = me.filterData;
						arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
						me.filterData = arrQuickJson;
					}
					else 
					{
						if(jQuery.isEmptyObject(selectedEntryDate))
						{
							arrQuickJson = me.filterData;
							arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
							me.filterData = arrQuickJson;
							$('#entryDataPicker').val('');
						}
					}
				}
			},			
			generateUrlWithAdvancedFilterParams : function( me )
			{
				var thisClass = this;
				
				var filterData = thisClass.advFilterData;
				var isFilterApplied = me;
				var isOrderByApplied = false;
				var strFilter = '';	//'&$filter=';
				var strTemp = '';
				var strFilterParam = '';
				var operator = '';
				var isInCondition = false;

				if( !Ext.isEmpty( filterData ) )
				{
					for( var index = 0 ; index < filterData.length ; index++ )
					{
						isInCondition = false;
						operator = filterData[ index ].operator;
						if( isFilterApplied
							&& ( operator === 'bt' || operator === 'eq' || operator === 'lk' || operator === 'gt'
								|| operator === 'lt' || operator === 'ne' || operator === 'in' ) )
							strTemp = strTemp + ' and ';
						switch( operator )
						{
							case 'bt':
								isFilterApplied = true;
								if( filterData[ index ].dataType === 1 )
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + 'date\'' + filterData[ index ].value1 + '\'' + ' and ' + 'date\''
										+ filterData[ index ].value2 + '\'';
								}
								else
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + '\'' + filterData[ index ].value1 + '\'' + ' and ' + '\''
										+ filterData[ index ].value2 + '\'';
								}
								break;
							case 'st':
								if( !isOrderByApplied )
								{
									strTemp = strTemp + ' &$orderby=';
									isOrderByApplied = true;
								}
								else
								{
									strTemp = strTemp + ',';
								}
								strTemp = strTemp + filterData[ index ].value1 + ' ' + filterData[ index ].value2;
								break;
							case 'lk':
								isFilterApplied = true;
								strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
									+ ' ' + '\'' + filterData[ index ].value1 + '\'';
								break;
							case 'eq':
								isInCondition = this.isInCondition( filterData[ index ] );
								if( isInCondition )
								{
									var reg = new RegExp( /[\(\)]/g );
									var objValue = filterData[ index ].value1;
									objValue = objValue.replace( reg, '' );
									var objArray = objValue.split( ',' );
									isFilterApplied = true;
									for( var i = 0 ; i < objArray.length ; i++ )
									{
										strTemp = strTemp + filterData[ index ].field + ' '
											+ filterData[ index ].operator + ' ' + '\'' + objArray[ i ] + '\'';
										if( i != objArray.length - 1 )
											strTemp = strTemp + ' or '
									}
									break;
								}
							case 'gt':
							case 'lt':
								isFilterApplied = true;
								if( filterData[ index ].dataType === 1 )
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + 'date\'' + filterData[ index ].value1 + '\'';
								}
								else
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + '\'' + filterData[ index ].value1 + '\'';
								}
								break;
							case 'ne':
								strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
									+ ' ' + '\'' + filterData[ index ].value1 + '\'';
								break;
							case 'in':
								isFilterApplied = true;
								//var arrId = null;
								var temp = filterData[ index ].value1;
								
								var arrId = temp.split("^");
								if (arrId[0] != 'All') {
									if( 0 != arrId.length )
									{
										strTemp = strTemp + '(';
										for( var count = 0 ; count < arrId.length ; count++ )
										{
											if(filterData[ index ].field == "siReqStateValidFlag")
											{
												strTemp = strTemp + filterData[ index ].field + ' eq ' + '\'' + arrId[ count ]
													+ '\'';
												
											}
											else
											{
												strTemp = strTemp + filterData[ index ].field + ' eq ' + '\'' + arrId[ count ]
													+ '\'';
											}
											if( count != arrId.length - 1 )
											{
												strTemp = strTemp + ' or ';
											}
										}
										strTemp = strTemp + ' )';
									}
								}
								break;	
						}
					}
				}
				if( isFilterApplied )
				{
					strFilter = strFilter + strTemp;
				}
				else if( isOrderByApplied )
				{
					strFilter = strTemp;
				}
				else
				{
					strFilter = '';
				}
				return strFilter;
			},
			isInCondition : function( data )
			{
				var retValue = false;
				var displayType = data.displayType;
				var strValue = data.value1;
				var reg = new RegExp( /^\((\d\d*,)*\d\d*\)$/ );
				if( displayType && displayType === 4 && strValue && strValue.match( reg ) )
				{
					retValue = true;
				}
				return retValue;
			},
			generateActionStatusUrl : function()
			{
				var me = this;
				var strRetValue = '';
				var arrActionStatus = me.arrActionStatus;
				if( !Ext.isEmpty( arrActionStatus ) )
				{
					for( var i = 0 ; i < arrActionStatus.length ; i++ )
					{
						if( i == 0 )
							strRetValue += Ext.String.format( "ActionStatus eq '{0}'", arrActionStatus[ i ] );
						else
							strRetValue += Ext.String.format( " or ActionStatus eq '{0}'", arrActionStatus[ i ] );
					}
				}
				if( !Ext.isEmpty( strRetValue ) )
					strRetValue = '(' + strRetValue + ')';
				return strRetValue;
			},

			/*
			 * generateUrlWithFilterParams : function( thisClass ) { var
			 * filterData = thisClass.filterData; var isFilterApplied = false;
			 * var strFilter = '&$filter='; var strTemp = ''; var strFilterParam =
			 * ''; for( var index = 0 ; index < filterData.length ; index++ ) {
			 * if( isFilterApplied ) strTemp = strTemp + ' and '; switch(
			 * filterData[ index ].operatorValue ) { case 'bt': if( filterData[
			 * index ].dataType === 'D' ) { strTemp = strTemp + filterData[
			 * index ].paramName + ' ' + filterData[ index ].operatorValue + ' ' +
			 * 'date\'' + filterData[ index ].paramValue1 + '\'' + ' and ' +
			 * 'date\'' + filterData[ index ].paramValue2 + '\''; } else {
			 * strTemp = strTemp + filterData[ index ].paramName + ' ' +
			 * filterData[ index ].operatorValue + ' ' + '\'' + filterData[
			 * index ].paramValue1 + '\'' + ' and ' + '\'' + filterData[ index
			 * ].paramValue2 + '\''; } break; default: // Default opertator is
			 * eq if( filterData[ index ].dataType === 'D' ) { strTemp = strTemp +
			 * filterData[ index ].paramName + ' ' + filterData[ index
			 * ].operatorValue + ' ' + 'date\'' + filterData[ index
			 * ].paramValue1 + '\''; } else { strTemp = strTemp + filterData[
			 * index ].paramName + ' ' + filterData[ index ].operatorValue + ' ' +
			 * '\'' + filterData[ index ].paramValue1 + '\''; } break; }
			 * isFilterApplied = true; } if( isFilterApplied ) strFilter =
			 * strFilter + strTemp; else strFilter = ''; return strFilter; },
			 */
		/*	orderUpDown : function( grid, rowIndex, direction )
			{
				var record = grid.getStore().getAt( rowIndex );
				if( !record )
				{
					return;
				}
				var index = rowIndex;
				if( direction < 0 )
				{
					index--;
					if( index < 0 )
					{
						return;
					}
				}
				else
				{
					index++;

					if( index >= grid.getStore().getCount() )
					{
						return;
					}
				}
				var store = grid.getStore();
				store.remove( record );
				store.insert( index, record );
				this.sendUpdatedOrederJsonToDb( store );
			},*/
		orderUpDown : function( grid, rowIndex, direction )
		{
			var record = grid.getStore().getAt( rowIndex );
			if( !record )
			{
				return;
			}
			var index = rowIndex;
			if( direction < 0 )
			{
				index--;
				if( index < 0 )
				{
					return;
				}
			}
			else
			{
				index++;
				if( index >= grid.getStore().getCount() )
				{
					return;
				}
			}
			var store = grid.getStore();
			store.remove( record );
			store.insert( index, record );
	
			this.sendUpdatedOrderJsonToDb( store );
		},
			sendUpdatedOrderJsonToDb : function( store )
			{
				var me = this;
				var objJson = {};
				var FiterArray = [];
				
				var strURL = isSiTabSelected == 'Y' ? 'userpreferences/loanCenterSiAdvFltr/gridViewAdvanceFilter.srvc?'
					: 'userpreferences/loanCenterTxnAdvFltr/gridViewAdvanceFilter.srvc?';
				$("#msSavedFilter option").each(function() {
							FiterArray.push($(this).val());
						});
				objJson.filters = FiterArray;
				Ext.Ajax.request(
				{
					url : strURL + csrfTokenName + "="+ csrfTokenValue,
					method : 'POST',
					jsonData : objJson,
					success : function( response )
					{
						me.updateSavedFilterComboInQuickFilter();
						me.resetAllFields();
					},
					failure : function()
					{
						console.log( "Error Occured - Addition Failed" );
					}
				} );
			},
			updateSavedFilterComboInQuickFilter : function() {
				var me = this;
				var savedFilterCombobox = me.getFilterView()
						.down('combo[itemId="savedFiltersCombo"]');
				if (!Ext.isEmpty(savedFilterCombobox)
						&& savedFilterCombobox.getStore().find('code',
								me.filterCodeValue) >= 0) {
					savedFilterCombobox.getStore().reload();
					if (me.filterCodeValue != null) {
						me.savedFilterVal = me.filterCodeValue;
					} else {
						me.savedFilterVal = '';
					}
					savedFilterCombobox.setValue(me.savedFilterVal);
					me.filterCodeValue = null;
				}
			},
			getAllSavedAdvFilterCode : function( panel )
			{
				var me = this;
				var strUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?'
					: 'userfilterslist/loanCenterTxnAdvFltr.srvc?';
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					async : false,
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var arrFilters = [];
						var filterData = responseData.d.filters;
						if( filterData )
						{
							arrFilters = filterData;
						}
//						me.addAllSavedFilterCodeToView( arrFilters );
					},
					failure : function( response )
					{
						console.log( 'Bad : Something went wrong with your request' );
					}
				} );
			},
			getAllSavedAdvTooBarCode : function()
			{
				var me = this;
				var strUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?'
					: 'userfilterslist/loanCenterTxnAdvFltr.srvc?';
				Ext.Ajax.request(
				{
					url : strUrl,
					headers: objHdrCsrfParams,
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var arrFilters = [];
						var filterData = responseData.d.filters;
						if( filterData )
						{
							arrFilters = filterData;
						}
						me.addAllSavedFilterCodeToView( arrFilters );
					},
					failure : function( response )
					{
						console.log( 'Bad : Something went wrong with your request' );
					}
				} );
			},
			getSavedFilterData : function( filterCode, fnCallback, applyAdvFilter )
			{
				var me = this;
				var objOfCreateNewFilter = me.getCreateNewFilterRef();
				var objJson;
				var urlForm = isSiTabSelected == 'Y' ? 'userfilters/loanCenterSiAdvFltr/{0}.srvc?'
					: 'userfilters/loanCenterTxnAdvFltr/{0}.srvc?';
				var strUrl = urlForm ;
				strUrl = Ext.String.format( strUrl, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl,
					headers: objHdrCsrfParams,
					jsonData : objJson,
					method : 'GET',
					success : function( response )
					{
						if (!Ext.isEmpty(response)	&& !Ext.isEmpty(response.responseText)) {						
							var responseData = Ext.decode( response.responseText );
							fnCallback.call( me, filterCode, responseData, applyAdvFilter );
						}
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
			},
			populateSavedFilter : function( filterCode, filterData, applyAdvFilter )
			{
				var me = this;
				var fieldName = '';
				var fieldOper = '';
				var fieldVal = '';
				var fieldSecondVal = '';
				var currentFilterData = '';
				me.filterDeleted = false ;
				// clear all previously selected filter while setting values of newly selected filter
				me.resetAllFields();
				for( i = 0 ; i < filterData.filterBy.length ; i++ )
				{
					fieldName = filterData.filterBy[ i ].field;
					fieldOper = filterData.filterBy[ i ].operator;
					fieldVal = filterData.filterBy[ i ].value1;
					fieldSecondVal = filterData.filterBy[i].value2;
					currentFilterData = filterData.filterBy[i];
					displayValue = filterData.filterBy[i].displayValue1;
		
					if(fieldName==="requestReference"){
						$('#requestReferenceAdvFilter').val(decodeURIComponent(fieldVal));
					}else if(fieldName==="obligorID"){
						$('#obligorIDAdvFilter').val(decodeURIComponent(displayValue));
					}else if(fieldName==="obligationID"){
						$('#obligationIDAdvFilter').val(decodeURIComponent(fieldSecondVal));
						selectedObligationId = fieldVal ;
					}else if(fieldName==="accountName"){
						$('#accountNameAdvFilter').val(decodeURIComponent(fieldVal));
					}else if(fieldName==="requestStatus" || fieldName==="siReqStateValidFlag" ){
						 me.checkUnCheckMenuItems(fieldName, fieldSecondVal);
					}else if(fieldName==="requestedAmnt"){
						$("#operatorAmntAdvFilter").val(fieldOper).niceSelect('update');
						//$("#requestedAmntAdvFilter").val(fieldVal);
						$('#requestedAmntAdvFilter').autoNumeric('set', fieldVal);
					}else if(fieldName==="requestDate" || fieldName==="effectiveDate"){
						me.setSavedFilterDates(fieldName, currentFilterData);
					}
				}
				if(!Ext.isEmpty(filterCode))
				{
					$('#filterCode').val(filterCode);
					$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
					$("#msSavedFilter").multiselect("refresh");
					var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
					saveFilterChkBox.prop('checked', true);
					markAdvFilterNameMandatory('saveFilterChkBox','advFilterNameLabel','filterCode', false);
				}
				if( applyAdvFilter )
				{
					me.applyAdvancedFilter();
				}
			},

			checkUnCheckMenuItems : function(componentName, data) {
				var menuRef = null;
				var elementId = null;
				var me = this;
				var clientContainer = null;

				if (componentName === 'siReqStateValidFlag' || componentName === 'requestStatus')  {
					menuRef = $("select[id='statusAdvFilter']");
					elementId = '#statusAdvFilter';
				}

				if (!Ext.isEmpty(menuRef)) {
					var itemArray = $(elementId + " option");

					if (data === 'All') {
						$(elementId + ' option').prop('selected', true);
					} else {
						$(elementId + ' option').prop('selected', false);
						$(elementId).multiselect("refresh");
					}

					var dataDecoded = decodeURIComponent(data);
					var dataArray = dataDecoded.split(',');
					if(!Ext.isEmpty(dataArray))
					{
						for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
								for (var index = 0; index < itemArray.length; index++) {
									var dataArrayIndxVal = (dataArray[dataIndex].indexOf('^')>-1) ? dataArray[dataIndex].split('^') : dataArray[dataIndex];
									if (dataArrayIndxVal == itemArray[index].value) {
										$(elementId + " option[value=\""
												+ itemArray[index].value + "\"]").prop(
												"selected", true);
										break;
									}
								}
							}
					}
					$(elementId).multiselect("refresh");
				}
			},

			setSavedFilterDates : function(dateType, data) {
				if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
					var me = this;
					var dateFilterRefFrom = null;
					var dateFilterRefPicker = null;
					var formattedFromDate, fromDate, toDate, formattedToDate;
					var dateOperator = data.operator;
					var dateLabel = data.dropdownLabel;

					fromDate = data.value1;
					if (!Ext.isEmpty(fromDate))
						formattedFromDate = Ext.util.Format
								.date(Ext.Date.parse(fromDate, 'Y-m-d'),
										strExtApplicationDateFormat);

					toDate = data.value2;
					if (!Ext.isEmpty(toDate))
						formattedToDate = Ext.util.Format.date(Ext.Date.parse(toDate,
										'Y-m-d'), strExtApplicationDateFormat);

					if (dateType === 'requestDate' || dateType === 'effectiveDate') {
						selectedEntryDate = {
							operator : dateOperator,
							fromDate : fromDate,
							toDate : toDate,
							dateLabel : dateLabel
						};
						dateFilterRefFrom = $('#entryDateFrom');
						dateFilterRefPicker = $('#entryDataPicker');
						me.getRequestDateLabelRef().setText(getLabel('date', 'Request Date')+
								" (" + dateLabel + ")");
						$('label[for="requestDateLabelItemId"]').text(getLabel('requestDate','Request Date')+ " ("
								+ dateLabel + ")");
						var dateLableTT = " (" + dateLabel + ")";
						updateToolTip('entryDate', dateLableTT);
					}

					if (dateOperator === 'eq') {
							$(dateFilterRefFrom).val(formattedFromDate);
							$(dateFilterRefPicker).val(formattedFromDate);
					} else if (dateOperator === 'bt') {
							$(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
							$(dateFilterRefPicker).datepick('setDate', [formattedFromDate, formattedToDate]);
					}
				} else {
					// console.log("Error Occured - date filter details found empty");
				}
			},
			editFilterData : function( grid, rowIndex )
			{
				var me = this;
				me.resetAllFields();
				me.filterCodeValue=null;
				var record = grid.getStore().getAt(rowIndex);
				var filterCode = record.data.filterName;
		
				var filterCodeRef = $("input[type='text'][id='saveFilterAs']");
				if (!Ext.isEmpty(filterCodeRef)) {
					filterCodeRef.val(filterCode);
					filterCodeRef.prop('disabled', true);
				}
				var applyAdvFilter = false;
		
				me.filterCodeValue = filterCode;
		
				me.getSavedFilterData(filterCode, this.populateSavedFilter,
						applyAdvFilter);
				changeAdvancedFilterTab(1);
			},
			deleteFilterSet : function(filterCode)
			{
				var me = this;
				var objFilterName;
				var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				var objComboStore=null;
				if (!Ext.isEmpty(filterCode))
					objFilterName = filterCode;
				me.filterCodeValue = null;

				if (this.savePrefAdvFilterCode == objFilterName) {
					strAppliedAdvanceFilter = null;
					me.advFilterData = [];
					me.filterApplied = 'A';
					me.filterDeleted = true;
					//me.applyFilter();
					me.refreshData();
				}
				if (savedFilterCombobox) {
					objComboStore = savedFilterCombobox.getStore();
					objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
					if(savedFilterCombobox.getValue() == objFilterName)
						savedFilterCombobox.setValue('');
				}
				me.deleteFilterCodeFromDb(objFilterName);
				me.sendUpdatedOrderJsonToDb();
			},
			deleteFilterCodeFromDb : function( objFilterName,advGridstore )
			{
				var me = this;
				var urlForm = isSiTabSelected == 'Y' ? 'userfilters/loanCenterSiAdvFltr/{0}/remove.srvc?'
					: 'userfilters/loanCenterTxnAdvFltr/{0}/remove.srvc?';
				if( !Ext.isEmpty( objFilterName ) )
				{
					var strUrl = urlForm + csrfTokenName + '=' + csrfTokenValue;
					strUrl = Ext.String.format( strUrl, objFilterName );

					Ext.Ajax.request(
					{
						url : strUrl,
						method : "POST",
						success : function( response )
						{
							//me.sendUpdatedOrderJsonToDb(advGridstore);
							//me.reloadFilters(advGridstore);
						},
						failure : function( response )
						{
							console.log( "Error Occured" );
						}
					} );
				}
			},
			viewFilterData : function( grid, rowIndex )
			{
				var me = this;
				me.resetAllFields();
				me.filterCodeValue=null;
				var record = grid.getStore().getAt(rowIndex);
				var filterCode = record.data.filterName;
				var applyAdvFilter = false;
				me.getSavedFilterData(filterCode, this.populateSavedFilter,
						applyAdvFilter);
				changeAdvancedFilterTab(1);
			},
			updateAdvFilterConfig : function()
			{
				var me = this;
				if( !Ext.isEmpty( objGridViewFilterPref ) )
				{
					var data = Ext.decode( objGridViewFilterPref );
					if( !Ext.isEmpty( data.advFilterCode ) )
					{
						me.showAdvFilterCode = data.advFilterCode;
						me.savePrefAdvFilterCode = data.advFilterCode;
						var strUrl = isSiTabSelected == 'Y' ? 'userfilters/loanCenterSiAdvFltr/{0}.srvc'
							: 'userfilters/loanCenterTxnAdvFltr/{0}.srvc';
						strUrl = Ext.String.format( strUrl, data.advFilterCode );
						Ext.Ajax.request(
						{
							url : strUrl + "?" + csrfTokenName + "=" + csrfTokenValue,
							async : false,
							method : 'POST',
							success : function( response )
							{
								var responseData = Ext.decode( response.responseText );

								var applyAdvFilter = false;
								me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
								var objJson = getAdvancedFilterQueryJson();
								me.advFilterData = objJson;

							},
							failure : function()
							{
								var errMsg = "";
								Ext.MessageBox.show(
								{
									title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
									msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );

							}
						} );
					}
				}
			},
			enableValidActionsForGrid : function(groupInfo, subGroupInfo, objGrid,objRecord, intRecordIndex, arrSelectedRecords, jsonData) 
			{
				var me = this;
				var buttonMask = '00000';
				var maskSize = 5;
				var chrLoanReqType = '';
				var isSameLoanType = true;
				if( isSiTabSelected == 'Y' )
				{
					buttonMask = '0000000';
					maskSize = 7;
				}

				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < arrSelectedRecords.length ; index++ )
				{
					objData = arrSelectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
// DHGCPNG44-4754
//					if(!Ext.isEmpty(objData.get('paymentType')) && Ext.isEmpty(chrLoanReqType))
//						chrLoanReqType = objData.get('paymentType');
//						
//					isSameLoanType = chrLoanReqType === objData.get('paymentType') ? true : false;
				}
				actionMask = doAndOperation( maskArray, maskSize );
				me.enableDisableGroupActions( actionMask, isSameUser,isSameLoanType );        
			},

			searchTrasactionChange : function()
			{
				var me = this;
				var searchValue = me.getSearchTxnTextInput().value;
				var anyMatch = me.getMatchCriteria().getValue();
				if( 'anyMatch' === anyMatch.searchOnPage )
				{
					anyMatch = false;
				}
				else
				{
					anyMatch = true;
				}

				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				grid.view.refresh();

				// detects html tag
				var tagsRe = /<[^>]*>/gm;
				// DEL ASCII code
				var tagsProtect = '\x0f';
				// detects regexp reserved word
				var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

				if( searchValue !== null )
				{
					searchRegExp = new RegExp( searchValue, 'g' + ( anyMatch ? '' : 'i' ) );

					if( !Ext.isEmpty( grid ) )
					{
						var store = grid.store;

						store.each( function( record, idx )
						{
							var td = Ext.fly( grid.view.getNode( idx ) ).down( 'td' ), cell, matches, cellHTML;
							while( td )
							{
								cell = td.down( '.x-grid-cell-inner' );
								matches = cell.dom.innerHTML.match( tagsRe );
								cellHTML = cell.dom.innerHTML.replace( tagsRe, tagsProtect );

								if( cellHTML === '&nbsp;' )
								{
									td = td.next();
								}
								else
								{
									// populate indexes array, set
									// currentIndex, and
									// replace
									// wrap matched string in a span
									cellHTML = cellHTML.replace( searchRegExp, function( m )
									{
										return '<span class="xn-livesearch-match">' + m + '</span>';
									} );
									// restore protected tags
									Ext.each( matches, function( match )
									{
										cellHTML = cellHTML.replace( tagsProtect, match );
									} );
									// update cell html
									cell.dom.innerHTML = cellHTML;
									td = td.next();
								}
							}
						}, me );
					}
				}
			},
			handleGroupActions : function(actionName, grid, arrSelectedRecords,strActionType, fxType)
			{
				var me = this;
				var strAction = actionName; //!Ext.isEmpty( actionName ) ? actionName : btn.itemId;
				for (var index = 0; index < arrSelectedRecords.length; index++) {
					var record = arrSelectedRecords[index];
					if (actionName === 'accept' || actionName === 'reject') {
						var chrLoanReqType = record && record.get('paymentType')
								? record.get('paymentType')
								: '';
						if (!Ext.isEmpty(chrLoanReqType)) {
							if (chrLoanReqType === 'F')
								strAction = actionName === 'accept'
										? 'acceptPaydown'
										: 'rejectPaydown';
							if(chrLoanReqType === 'P')
								strAction = actionName === 'accept'
									? 'acceptPartialPaydown'
									: 'rejectPartialPaydown';
							if(chrLoanReqType === 'O')
								strAction = actionName === 'accept'
									? 'acceptPayOffPaydown'
									: 'rejectPayOffPaydown';
							if (chrLoanReqType === 'I')
								strAction = actionName === 'accept'
										? 'acceptInvoice'
										: 'rejectInvoice';
							if (chrLoanReqType === 'D')
								strAction = actionName === 'accept'
										? 'acceptAdvance'
										: 'rejectAdvance';
						}
					}
				}
				var strUrl = Ext.String.format( 'getLoanCenterList/{0}.srvc?', strAction );
				strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;

				strUrl = strUrl + "&" + "$isSiTabSelected" + "=" + isSiTabSelected;

				if( actionName === 'reject' || actionName === 'rejectAdvance' || actionName === 'rejectInvoice'|| actionName === 'rejectPaydown')
				{
					this.showRejectVerifyPopUp(strAction, strUrl, grid,arrSelectedRecords, strActionType);
				}
				else
				{
					if ('Y' === chrApprovalConfirmationAllowed
					&& (actionName === 'accept' || (strActionType === "rowAction" && (actionName === "acceptPaydown"
							|| actionName === "acceptInvoice" || actionName === "acceptAdvance"))))
						this.showApprovalConfirmationView(strUrl, '', grid,
								arrSelectedRecords, strActionType, strAction);
					else
						this.preHandleGroupActions(strUrl, '', grid,
								arrSelectedRecords, strActionType, strAction);
				}
			},

			showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType)
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'rejectPartialPaydown' ||strAction === 'reject' || strAction === 'rejectAdvance' || strAction === 'rejectInvoice' || strAction === 'rejectPaydown')
				{
					fieldLbl = getLabel( 'prfRejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					titleMsg = getLabel( 'prfRejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				var msgbox = Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					bodyPadding : 0,
					cls:'t7-popup',
					width: 355,
					height : 270,
					fn : function( btn, text )
					{
						if( btn == 'ok' )
						{
							//not required
							me.preHandleGroupActions(strActionUrl, text, grid,arrSelectedRecords, strActionType,strAction);
						}
					}
				} );
				msgbox.textArea.enforceMaxLength = true;
				msgbox.textArea.inputEl.set({
					maxLength : 255
				});
			},

			preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,strActionType, strAction)
			{
				var me = this;
				var objGroupView = me.getGroupView();
			//	var grid = objGroupView.getGrid();
				if( !Ext.isEmpty( grid ) )
				{
					var arrayJson = new Array();
					var eventList = "";
					var records=arrSelectedRecords;
				//	var records = grid.getSelectedRecords();
					var fromGrid = "Y";
				/*	records = ( !Ext.isEmpty( records ) && Ext.isEmpty( record ) ) ? records :
					[
						record
					];*/
					for( var index = 0 ; index < records.length ; index++ )
					{
						
						if("Paydown"==records[ index ].data.paymentTypeDesc)
						{
							eventList = eventList + 'LNPAYDOWN,';
						}
						if("Pay Invoice"==records[ index ].data.paymentTypeDesc)
						{
							eventList = eventList + 'LNINVPAY,';
						}
						if("Advance"==records[ index ].data.paymentTypeDesc)
						{
							eventList = eventList + 'LNADVANCE,';
						}
						arrayJson.push(
						{
							serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
							identifier : records[ index ].data.identifier,
							userMessage : remark
						} );
					}
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						} );
					document.getElementById("effectiveDate").value = records[0].data.effectiveDate;
					checkCutOffTime(eventList,strUrl,records,remark,fromGrid);
				}
			},

			showInvoiceCenterPopupView : function( url, records, remark )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				var siRequestState = null;
				
				if( isSiTabSelected == 'Y' &&  records && records[0]
				   && records[0].raw && records[0].raw.siRequestState)
				{
					siRequestState = records[0].raw.siRequestState;
				}
				if( !Ext.isEmpty( grid ) )
				{
					var arrayJson = new Array();
					var eventList = "";
					for( var index = 0 ; index < records.length ; index++ )
					{
						arrayJson.push(
						{
							serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
							identifier : records[ index ].data.identifier,
							userMessage : remark
						} );
					}
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						} );
				}
				
				Ext.Ajax.request(
					{
						url : url,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),
						success : function( response )
						{
							// TODO : Action Result handling to be done here
							
								var responseData = Ext.decode(response.responseText);
								if(!responseData.d.auth)
								{
								
								if( isSiTabSelected == 'Y' )
								{
									// real time call only in case of Enable Request Approval.
									if(url.indexOf('accept') != -1 && siRequestState == 4 )
										callRealTimeresponse(responseData,url, null);
								}
								else
								{
									// real time call only in case of accept url.
									if(url.indexOf('accept') != -1 )
									{
										callRealTimeresponse(responseData,url, null);
									}
									else
									{
										grid.refreshData();
									}
								}

								if( isSiTabSelected == 'Y' )
								{
									me.enableDisableGroupActions( '00000', true, false);
									grid.refreshData();
								}
								else
									me.enableDisableGroupActions( '0000000', true, false);
								//grid.refreshData();
							}
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			isRowMoreMenuVisible : function( store, record, jsonData, itmId, menu )
			{
				var me = this;
				if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
					return false;
				var arrMenuItems = null;
				var isMenuVisible = false;
				var blnRetValue = true;
				if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
					arrMenuItems = menu.items.items;

				if( !Ext.isEmpty( arrMenuItems ) )
				{
					for( var a = 0 ; a < arrMenuItems.length ; a++ )
					{
						blnRetValue = me.isRowIconVisible( store, record, jsonData, itmId,
							arrMenuItems[ a ].maskPosition );
						isMenuVisible = ( isMenuVisible || blnRetValue ) ? true : false;
					}
				}
				return isMenuVisible;
			},
			enableDisableGroupActions : function( actionMask, isSameUser,isSameLoanType )
			{
				//var actionBar = this.getActionBarSummDtl();
				var me = this;
				var chrLoanReqType = '';
				var objGroupView = me.getGroupView();
				var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey || strBitMapKey == 0 )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if(item.maskPosition === 1 && blnEnabled)
							{
								blnEnabled = blnEnabled && isSameUser && isSameLoanType;
							}
							else if( item.maskPosition === 2 && blnEnabled)
							{
								blnEnabled = blnEnabled && isSameUser && isSameLoanType;
							}
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},
			getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if( isSiTabSelected == 'Y' )
				{
					arrCols.push( me.createSiGroupActionColumn() );
				}
				else
				{
					arrCols.push( me.createGroupActionColumn() );
				}

				arrCols.push( me.createActionColumn() );
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colHeader;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.hidden;
						cfgCol.locked = objCol.locked;
						cfgCol.width = objCol.width;
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						else if( objCol.colId === 'requestedAmnt' )
						{
							cfgCol.align = 'right';
						}

						if( objCol.colId === 'requestReference' ) // to show
						// the
						// summary
						// row
						// description
						{
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var strSubTotal;
								var objGroupView = me.getGroupView();
								var grid = objGroupView.getGrid();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										strSubTotal = data.d.__subTotal;
									}
								}
								if( null != strSubTotal && strSubTotal != '$0.00' )
								{
									strRet = getLabel( 'subTotal', 'Sub Total' );
								}
								return strRet;
							}
						}

						if( objCol.colId === 'requestedAmnt' ) // to show
						// subtotal
						// value
						{
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var objGroupView = me.getGroupView();
								var loanCenterGrid = objGroupView.getGrid();
								if( !Ext.isEmpty( loanCenterGrid ) && !Ext.isEmpty( loanCenterGrid.store ) )
								{
									var data = loanCenterGrid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										if( data.d.__subTotal != '$0.00' )
											strRet = data.d.__subTotal;
									}
								}
								return strRet;
							}
						}
						cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width : 120;
						if(cfgCol.width === 120)
							cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				if( colId === 'col_copyTo' )
				{
					if( value > 0 )
					{
						strRetValue = '<a class="underlined cursor_pointer" onclick="showClientPopup(\''
							+ record.get( 'profileId' ) + '\')">' + value + '</a>';
					}
					else
					{
						strRetValue = value;
					}
				}
				else
				{
					strRetValue = value;
				}
				return strRetValue;
			},

			createGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 130,
					align : 'right',
					visibleRowActionCount : 1,
					locked : true,
					items :
					[
						{
							itemId : 'accept',
							//itemCls : 'grid-row-text-icon icon-auth-text',
							text : getLabel( 'auth', 'Approve' ),
							hidden : isHidden( 'approvalRequired' ),
							maskPosition : 1
						},
						{
							itemId : 'reject',
							//itemCls : 'grid-row-text-icon icon-reject-text',
							text : getLabel( 'reject', 'Reject' ),
							hidden : isHidden( 'approvalRequired' ),
							maskPosition : 2
						}
					],
					moreMenu :
					{
						fnMoreMenuVisibilityHandler : function( store, record, jsonData, itmId, menu )
						{
							return me.isRowMoreMenuVisible( store, record, jsonData, itmId, menu );
						},
						fnMoreMenuClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record )
						{
							me.handleRowMoreMenuClick( tableView, rowIndex, columnIndex, btn, event, record );
						},
						items :
						[
							{
								itemId : 'discard',
								// itemCls : 'grid-row-text-icon
								// icon-discard-text',
								itemLabel : getLabel( 'discard', 'Discard' ),
								maskPosition : 3
							}
						]
					}
				};
				return objActionCol;
			},

			createSiGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 120,
					align : 'right',
					locked : true,
					visibleRowActionCount : 1,
					items :
					[
						{
							itemId : 'accept',
							itemCls : 'grid-row-text-icon icon-auth-text',
							itemLabel : getLabel( 'auth', 'Auth' ),
							hidden : isHidden( 'approvalRequired' ),
							maskPosition : 1
						},
						{
							itemId : 'reject',
							itemCls : 'grid-row-text-icon icon-reject-text',
							itemLabel : getLabel( 'reject', 'Reject' ),
							hidden : isHidden( 'approvalRequired' ),
							maskPosition : 2
						}
					],
					moreMenu :
					{
						fnMoreMenuVisibilityHandler : function( store, record, jsonData, itmId, menu )
						{
							return me.isRowMoreMenuVisible( store, record, jsonData, itmId, menu );
						},
						fnMoreMenuClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record )
						{
							me.handleRowMoreMenuClick( tableView, rowIndex, columnIndex, btn, event, record );
						},
						items :
						[
							{
								itemId : 'discard',
								// itemCls : 'grid-row-text-icon
								// icon-discard-text',
								itemLabel : getLabel( 'discard', 'Discard' ),
								maskPosition : 3
							},
							{
								itemId : 'enable',
								// itemCls : 'grid-row-text-icon
								// icon-enable-text',
								itemLabel : getLabel( 'enable', 'Enable' ),
								maskPosition : 6
							},
							{
								itemId : 'disable',
								// itemCls : 'grid-row-text-icon
								// icon-disable-text',
								itemLabel : getLabel( 'disable', 'Disable' ),
								maskPosition : 7
							}
						]
					}
				};
				return objActionCol;
			},

			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'action',
					width : 80,
					align : 'center',
					locked : true,
					items :
					[
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							toolTip : getLabel( 'historyToolTip', 'View History' ),
							maskPosition : 4
						},
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 5
						}
					]
				};
				return objActionCol;
			},

			handleRowMoreMenuClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var menu = btn.menu;
				var arrMenuItems = null;
				var blnRetValue = true;
				var store = tableView.store;
				var jsonData = store.proxy.reader.jsonData;

				btn.menu.dataParams =
				{
					'record' : record,
					'rowIndex' : rowIndex,
					'columnIndex' : columnIndex,
					'view' : tableView
				};
				if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
					arrMenuItems = menu.items.items;
				if( !Ext.isEmpty( arrMenuItems ) )
				{
					for( var a = 0 ; a < arrMenuItems.length ; a++ )
					{
						blnRetValue = me.isRowIconVisible( store, record, jsonData, null,
							arrMenuItems[ a ].maskPosition );
						arrMenuItems[ a ].setVisible( blnRetValue );
					}
				}
				menu.showAt( event.xy[ 0 ] + 5, event.xy[ 1 ] + 5 );
			},
			setInfoTooltip : function()
			{
				var me = this;
				var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoGridView',
					listeners :
					{
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function( tip )
						{
							var loanCenterTypeVal = '';
							var dateFilter = me.dateFilterLabel;
							var client = '';
							if( me.loanCenterTypeVal == 'all' && me.filterApplied == 'ALL' )
							{
								loanCenterTypeVal = 'All';
								me.showAdvFilterCode = null;
							}
							else
							{
								loanCenterTypeVal = me.loanCenterTypeFilterDesc;
							}

							var advfilter = me.showAdvFilterCode;
							if( advfilter == '' || advfilter == null )
							{
								advfilter = getLabel( 'none', 'None' );
							}
							if((me.clientDesc == "" || me.clientDesc == null) && entityType == 1)
								client = 'All Companies'
							else 
							if((me.clientDesc == "" || me.clientDesc == null) && entityType == 0)
								client = 'None'
							else
								client = me.clientDesc;
							tip.update( getLabel('clientName','Client Name')+" : "+client+'<br>'+'Type' + ' : ' + loanCenterTypeVal + '<br/>' + getLabel( 'date', 'Date' )
								+ ' : ' + dateFilter + '<br/>' + getLabel( 'advancedFilter', 'Advanced Filter' ) + ':'
								+ advfilter );
						}
					}
				} );
			},
			/*toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferencesRef();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );

			},
			toggleClearPrefrenceAction : function(isVisible) {
				var me = this;
				var btnPref = me.getBtnClearPreferences();
				if (!Ext.isEmpty(btnPref))
					btnPref.setDisabled(!isVisible);
			},*/
			updateDateFilterView : function()
			{
				var me = this;
				var dtEntryDate = null;
				if( !Ext.isEmpty( me.dateFilterVal ) )
				{
					me.handleDateChange( me.dateFilterVal );
					if( me.dateFilterVal === '7' )
					{
						if( !Ext.isEmpty( me.dateFilterFromVal ) )
						{
							dtEntryDate = Ext.Date.parse( me.dateFilterFromVal, "Y-m-d" );
							me.getFromDateFieldRef().setValue( dtEntryDate );
						}
						if( !Ext.isEmpty( me.dateFilterToVal ) )
						{
							dtEntryDate = Ext.Date.parse( me.dateFilterToVal, "Y-m-d" );
							me.getToDateFieldRef().setValue( dtEntryDate );
						}
					}
				}

			},
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef=$('#entryDataPicker');
		
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getRequestDateLabelRef().setText(getLabel('date', 'Request Date')
					+ " (" + me.dateFilterLabel + ")");
			$('label[for="requestDateLabelItemId"]').text(getLabel('requestDate','Request Date')
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
			selectedEntryDate = {
					operator : objDateParams.operator,
					fromDate : objDateParams.fieldValue1,
					toDate : objDateParams.fieldValue2,
					dateLabel : me.dateFilterLabel
				};
		} else {
			if (index === '1' || index === '2') {
						datePickerRef.setDateRangePickerValue(vFromDate);
						selectedEntryDate = {
								operator : objDateParams.operator,
								fromDate : objDateParams.fieldValue1,
								toDate : objDateParams.fieldValue2,
								dateLabel : me.dateFilterLabel
							};
				}	
				 else {
					datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
					selectedEntryDate = {
							operator : objDateParams.operator,
							fromDate : objDateParams.fieldValue1,
							toDate : objDateParams.fieldValue2,
							dateLabel : me.dateFilterLabel
						};
				}
		}
		me.handleEntryDateSync('Q', me.getRequestDateLabelRef().text, " (" + me.dateFilterLabel + ")", datePickerRef);		
	},
	handleEntryDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		me.entryDateChanged = true;
		labelToChange = (valueChangedAt === 'Q') ? $('label[for="requestDateLabelItemId"]') : me.getRequestDateLabelRef();
		valueControlToChange = (valueChangedAt === 'Q') ? $('#entryDateFrom') : $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();
		
		if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
			if(valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('entryDate', sourceToolTipText);
			} else {
				labelToChange.setText(sourceLable);
			}
			if(!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.setDateRangePickerValue(updatedDateValue);
			}
		}
	},	
		
			getDateParam : function( index, dateType )
			{
				var me = this;
				var objDateHandler = me.getDateHandler();
				var strAppDate = dtApplicationDate;
				var dtFormat = strExtApplicationDateFormat;
				var date = new Date( Ext.Date.parse( strAppDate, dtFormat ) );
				var strSqlDateFormat = 'Y-m-d';
				var fieldValue1 = '', fieldValue2 = '', operator = '';
				var retObj = {};
				var dtJson = {};
				switch( index )
				{
					case '1':
						// Today
						fieldValue1 = Ext.Date.format( date, strSqlDateFormat );
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = getDateIndexLabel(index);
						break;
					case '2':
						// Yesterday
						fieldValue1 = Ext.Date.format( objDateHandler.getYesterdayDate( date ), strSqlDateFormat );
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = getDateIndexLabel(index);
						break;
					case '3':
						// This Week
						dtJson = objDateHandler.getThisWeekToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '4':
						// Last Week To Date
						dtJson = objDateHandler.getLastWeekToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '5':
						// This Month
						dtJson = objDateHandler.getThisMonthToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '6':
						// Last Month To Date
						dtJson = objDateHandler.getLastMonthToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '7':
						// Date Range
					/*	var frmDate = me.getFromDateFieldRef().getValue();
						var toDate = me.getToDateFieldRef().getValue();
						fieldValue1 = Ext.Date.format( frmDate, strSqlDateFormat );						
						fieldValue2 = Ext.Date.format( toDate, strSqlDateFormat );						
						operator = 'bt';
						label = getDateIndexLabel(index);*/
						break;
					case '8':
						// This Quarter
						dtJson = objDateHandler.getQuarterToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '9':
						// Last Quarter To Date
						dtJson = objDateHandler.getLastQuarterToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '10':
						// This Year
						dtJson = objDateHandler.getYearToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '11':
						// Last Year To Date
						dtJson = objDateHandler.getLastYearToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '12':
						// Latest
						var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
					    var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));		
						 
						fieldValue1 = Ext.Date.format(
									fromDate,
									strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
									toDate,
									strSqlDateFormat);
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '14' :
						//last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
							.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						label = getDateIndexLabel(index);
						break;
					case '13' :
						// Date Range
						if (me.datePickerSelectedDate.length == 1) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
							fieldValue2 = fieldValue1;
							operator = 'eq';
						}else if (me.datePickerSelectedDate.length == 2) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
							fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
								operator = 'bt';
						}
						if ('entryDate' === dateType
								&& !isEmpty(me.datePickerSelectedEntryAdvDate)) {
							if (me.datePickerSelectedEntryAdvDate.length == 1) {
								fieldValue1 = Ext.Date.format(
										me.datePickerSelectedEntryAdvDate[0],
										strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
							} else if (me.datePickerSelectedEntryAdvDate.length == 2) {
								fieldValue1 = Ext.Date.format(
										me.datePickerSelectedEntryAdvDate[0],
										strSqlDateFormat);
								fieldValue2 = Ext.Date.format(
										me.datePickerSelectedEntryAdvDate[1],
										strSqlDateFormat);
								operator = 'bt';
							}
						}
						label = getDateIndexLabel(index);
						break;
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				retObj.label = label;
				return retObj;
			},
			onLoanCenterInformationViewRender : function()
			{
				var me = this;
				if( isSiTabSelected == 'N' )
				{
					var accSummInfoViewRef = me.getLoanCenterGridInformationViewRef();
					accSummInfoViewRef.createSummaryLowerPanelView();
				//	me.setGridInfoSummary();
				}
			},

			handleSavePreferences : function()
			{
				var me = this;
				/*if($("#savePrefMenuBtn").attr('disabled')) 
					event.preventDefault();
				else
					me.savePreferences();*/
				var arrPref = me.getPreferencesToSave(false);
					if (arrPref) {
							me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
							me.postHandleSavePreferences, null, me, true);
							}
				me.disablePreferencesButton("savePrefMenuBtn",true);
				me.disablePreferencesButton("clearPrefMenuBtn",false);		
			},
			postHandleSavePreferences : function(data, args, isSuccess) {
			var me = this;			
		},
			handleClearPreferences : function() {
				var me = this;
			//	me.toggleSavePrefrenceAction(false);
				/*if($("#clearPrefMenuBtn").attr('disabled')) 
					event.preventDefault();
				else
				{
					me.clearWidgetPreferences();
				}*/
				me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					me.postHandleClearPreferences, null, me, true);
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",true);	
			},
			postHandleClearPreferences : function(data, args, isSuccess) {
						var me = this;						
					},
			/*savePreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.urlGridPref;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				var gridState=grid.getGridState();
				//var arrColPref = new Array();
				var arrPref = new Array();
				//if( !Ext.isEmpty( grid ) )
				//{
				//	arrCols = grid.headerCt.getGridColumns();
					/*for( var j = 0 ; j < arrCols.length ; j++ )
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
							&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
							&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction' 
							&& objCol.itemId !== 'col_groupaction')
							arrColPref.push(
							{
								colId : objCol.dataIndex,
								colDesc : objCol.text,
								colHidden : objCol.hidden,
								colType : objCol.type
							} );

					}* /
					objPref.pgSize = gridState.pageSize;
					objPref.gridCols = gridState.columns;
					objPref.sortState = gridState.sortState;
					arrPref.push( objPref );
				//}

				if( arrPref )
					Ext.Ajax.request(
					{
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( arrPref ),
						success : function( response )
						{
							var responseData = Ext.decode( response.responseText );
							var isSuccess;
							var title, strMsg, imgIcon;
							if( responseData.d.preferences && responseData.d.preferences.success )
								isSuccess = responseData.d.preferences.success;
							if( isSuccess && isSuccess === 'N' )
							{
								if( !Ext.isEmpty( me.getBtnSavePreferencesRef() ) )
									me.getBtnSavePreferencesRef().setDisabled( false );
								title = getLabel( 'SaveFilterPopupTitle', 'Message' );
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show(
								{
									title : title,
									msg : strMsg,
									width : 200,
									buttons : Ext.MessageBox.OK,
									icon : imgIcon
								} );
							}
							else
								me.saveFilterPreferences();
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},*/
			getPreferencesToSave : function(localSave) {
				var me = this;
				var groupView = me.getGroupView();
				var grid = null;
				var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
				var groupInfo = null, subGroupInfo = null;
				  if(groupView){
					grid=groupView.getGrid()
					var gridState=grid.getGridState();				
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};
					var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
					
							
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
								'gridCols' : gridState.columns,
								'pgSize' : gridState.pageSize,
								'gridSetting' : groupView.getGroupViewState().gridSetting,
								'sortState' : gridState.sortState
							}
						});
				
				}
				objFilterPref = me.getFilterPreferences();
					arrPref.push({
								"module" : "gridViewFilter",
								"jsonPreferences" : objFilterPref
							});
				return arrPref;
			},
			getFilterPreferences : function() {
				var me = this;
				//var strUrl = me.urlGridFilterPref;
				var advFilterCode = null;
				var objFilterPref = {};
				var infoPanel = me.getLoanCenterGridInformationViewRef();
			//	var filterViewCollapsed = (me.getLoanCenterFilterView().getCollapsed() === false) ? false : true; 
			//	var infoViewCollapsed = infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.paymentType = me.loanCenterTypeFilterVal;
				objQuickFilterPref.entryDate = me.dateFilterVal;
				if( me.dateFilterVal === '7' )
				{
					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{
						objQuickFilterPref.fromEntryDate = me.dateFilterFromVal;
						objQuickFilterPref.toEntryDate = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromEntryDate().getValue();
						var toDate = me.getToEntryDate().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						objQuickFilterPref.fromEntryDate = fieldValue1;
						objQuickFilterPref.toEntryDate = fieldValue2;
					}
				}

				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = objQuickFilterPref;
				objFilterPref.filterSelectedClientCode = me.clientCode; 
				objFilterPref.filterSelectedClientDesc = me.clientDesc;
			//	objFilterPref.filterPanelCollapsed = filterViewCollapsed;
			//	objFilterPref.infoPanelCollapsed = infoViewCollapsed;
				return objFilterPref;
			},
			saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridFilterPref;
				var advFilterCode = null;
				var objFilterPref = {};
				var infoPanel = me.getLoanCenterGridInformationViewRef();
			//	var filterViewCollapsed = (me.getLoanCenterFilterView().getCollapsed() === false) ? false : true; 
			//	var infoViewCollapsed = infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
				if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var objQuickFilterPref = {};
				objQuickFilterPref.paymentType = me.loanCenterTypeFilterVal;
				objQuickFilterPref.entryDate = me.dateFilterVal;
				if( me.dateFilterVal === '7' )
				{
					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{
						objQuickFilterPref.fromEntryDate = me.dateFilterFromVal;
						objQuickFilterPref.toEntryDate = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getFromEntryDate().getValue();
						var toDate = me.getToEntryDate().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						objQuickFilterPref.fromEntryDate = fieldValue1;
						objQuickFilterPref.toEntryDate = fieldValue2;
					}
				}

				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = objQuickFilterPref;
				objFilterPref.filterSelectedClientCode = me.clientCode; 
				objFilterPref.filterSelectedClientDesc = me.clientDesc;
			//	objFilterPref.filterPanelCollapsed = filterViewCollapsed;
			//	objFilterPref.infoPanelCollapsed = infoViewCollapsed;

				if( objFilterPref )
					Ext.Ajax.request(
					{
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( objFilterPref ),
						success : function( response )
						{
							var data = Ext.decode( response.responseText );
							var title = getLabel( 'SaveFilterPopupTitle', 'Message' );
							if( data.d.preferences && data.d.preferences.success === 'Y' )
							{
								Ext.MessageBox.show(
								{
									title : title,
									msg : getLabel( 'prefSavedMsg', 'Preferences Saved Successfully' ),
									cls:'t7-popup',
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
								me.disablePreferencesButton("savePrefMenuBtn",true);
								me.disablePreferencesButton("clearPrefMenuBtn",false);		
							}
							else if( data.d.preferences && data.d.preferences.success === 'N' && data.d.error
								&& data.d.error.errorMessage )
							{
								if( !Ext.isEmpty( me.getBtnSavePreferencesRef() ) )
//									me.toggleSavePrefrenceAction( true );
//									me.toggleClearPrefrenceAction(false);
									me.disablePreferencesButton("savePrefMenuBtn",false);
									me.disablePreferencesButton("clearPrefMenuBtn",true);	
								Ext.MessageBox.show(
								{
									title : title,
									msg : data.d.error.errorMessage,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								cls:'t7-popup',
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},			
		
			updateFilterConfig : function()
			{
				var me = this;
				var arrJsn = new Array();
				// TODO : Localization to be handled..
				var objDateLbl =
				{
					'12' : getLabel( 'latest', 'Latest' ),
					'1' : getLabel( 'today', 'Today' ),
					'2' : getLabel( 'yesterday', 'Yesterday' ),
					'3' : getLabel( 'thisweek', 'This Week' ),
					'4' : getLabel( 'lastweek', 'Last Week To Date' ),
					'5' : getLabel( 'thismonth', 'This Month' ),
					'6' : getLabel( 'lastmonth', 'Last Month To Date' ),
					'14' : getLabel( 'lastmonthonly', 'Last Month Only' ),
					'7' : getLabel( 'daterange', 'Date Range' ),
					'8' : getLabel( 'thisquarter', 'This Quarter' ),
					'9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
					'10' : getLabel( 'thisyear', 'This Year' ),
					'11' : getLabel( 'lastyeartodate', 'Last Year To Date' )
				};

				if( !Ext.isEmpty( objLoanCenterPref ) )
				{
					var objJsonData = Ext.decode( objLoanCenterPref );
					var data = objJsonData.d.preferences.gridViewFilter;
					if( data != 'undefined' && !Ext.isEmpty(data))
					{
						var strDtValue = data.quickFilter.entryDate;
						var strDtFrmValue = data.quickFilter.fromEntryDate;
						var strDtToValue = data.quickFilter.toEntryDate;
						var strPaymentType = data.quickFilter.paymentType;
						if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
							me.clientCode = data.filterSelectedClientCode;
							me.clientDesc = data.filterSelectedClientDesc;
							strClientCode = data.filterSelectedClientCode;
							strClientDescr = data.filterSelectedClientDesc;
						}			
						me.filterCodeValue = data.advFilterCode;		
						filterPanelCollapsed = data.filterPanelCollapsed;
						infoPanelCollapsed = data.infoPanelCollapsed;
					}	
					if( !Ext.isEmpty( strDtValue ) )
					{
						me.dateFilterLabel = objDateLbl[ strDtValue ];
						me.dateFilterVal = strDtValue;
						if( strDtValue === '7' )
						{
							if( !Ext.isEmpty( strDtFrmValue ) )
								me.dateFilterFromVal = strDtFrmValue;

							if( !Ext.isEmpty( strDtToValue ) )
								me.dateFilterToVal = strDtToValue;
						}
						me.loanCenterTypeFilterVal = !Ext.isEmpty( strPaymentType ) ? strPaymentType : 'all';
					}
				}

				if( !Ext.isEmpty( me.dateFilterVal ) )
				{
					var strVal1 = '', strVal2 = '', strOpt = 'eq';
					if( me.dateFilterVal !== '7' )
					{
						var dtParams = me.getDateParam( me.dateFilterVal );
						if( !Ext.isEmpty( dtParams ) && !Ext.isEmpty( dtParams.fieldValue1 ) )
						{
							strOpt = dtParams.operator;
							strVal1 = dtParams.fieldValue1;
							strVal2 = dtParams.fieldValue2;
						}
					}
					else
					{
						if( !Ext.isEmpty( me.dateFilterVal ) && !Ext.isEmpty( me.dateFilterFromVal ) )
						{
							strVal1 = me.dateFilterFromVal;

							if( !Ext.isEmpty( me.dateFilterToVal ) )
							{
								strOpt = 'bt';
								strVal2 = me.dateFilterToVal;
							}
						}
					}
					if( me.dateFilterVal != '12' )
					{
						arrJsn.push(
						{
							paramName : 'requestDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D',
							paramFieldLable : getLabel('lblreqdate', 'Request Date')							
						} );
					}
				}

				if( !Ext.isEmpty( me.loanCenterTypeFilterVal ) && me.loanCenterTypeFilterVal != 'all' )
				{
					arrJsn.push(
					{
						paramName : 'paymentType',
						paramValue1 : encodeURIComponent(me.loanCenterTypeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}

				me.filterData = arrJsn;
			},
			updateFilterFields:function(){
				var me=this;
				var clientCodesFltId;
				var loanCenterFilterView = me.getLoanCenterFilterView();
				if (!isClientUser()) {
					clientCodesFltId = loanCenterFilterView.down('combobox[itemId=clientAutoCompleter]');
					if(undefined != me.clientCode && me.clientCode != ''){		
						clientCodesFltId.suspendEvents();
						clientCodesFltId.setValue(me.clientCode);
						clientCodesFltId.resumeEvents();
					}else{
						me.clientCode = 'all';			
					}
					
				} else {
					clientCodesFltId = loanCenterFilterView.down('combo[itemId="clientBtn"]');
					if(undefined != me.clientCode && me.clientCode != ''){	
					   //  clientCodesFltId.setValue(me.clientDesc);
						clientCodesFltId.setRawValue(me.clientDesc);			
					}	
					else{	
						clientCodesFltId.setRawValue(getLabel('allCompanies', 'All Companies'));
						me.clientCode = 'all';
					}
				}
				
				if(me.filterCodeValue != null) { 
					var savedFilterCombo=loanCenterFilterView.down('combo[itemId="savedFiltersCombo"]');
						savedFilterCombo.setValue(me.filterCodeValue);
				}	
			//	me.handleDateChange(me.dateFilterVal);
			},
			reloadGridRawData : function()
			{
				var me = this;
				var strUrl = isSiTabSelected == 'Y' ? 'userfilterslist/loanCenterSiAdvFltr.srvc?'
					: 'userfilterslist/loanCenterTxnAdvFltr.srvc?';
				var gridView = me.getAdvFilterGridViewRef();
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					method : 'GET',
					success : function( response )
					{
						var decodedJson = Ext.decode( response.responseText );
						var arrJson = new Array();

						if( !Ext.isEmpty( decodedJson.d.filters ) )
						{
							for( i = 0 ; i < decodedJson.d.filters.length ; i++ )
							{
								arrJson.push(
								{
									"filterName" : decodedJson.d.filters[ i ]
								} );
							}
						}
						gridView.loadRawData( arrJson );
						me.addAllSavedFilterCodeToView( decodedJson.d.filters );
					},
					failure : function( response )
					{
						// console.log("Ajax Get data Call Failed");
					}
				} );
			},
			resetAllFields:function(isHandleClearSettings){
				var me=this;
				selectedObligationId = '';
				$('#requestReferenceAdvFilter').val("");
				$('#saveFilterChkBox').attr('checked',false);
				markAdvFilterNameMandatory('saveFilterChkBox','advFilterNameLabel','filterCode', true);
				$('#obligorIDAdvFilter').val("");
				$('#obligationIDAdvFilter').val("");
				$('#accountNameAdvFilter').val("");
				$("#operatorAmntAdvFilter").val("eq");
				$("#operatorAmntAdvFilter").niceSelect('update');
				$("#requestedAmntAdvFilter").val("");
				$('#statusAdvFilter option').prop('selected', true);
				$('#statusAdvFilter').multiselect("refresh");
				$('#statusAdvFilter').niceSelect('update');
				$("#msSavedFilter").val("");
				$("#msSavedFilter").multiselect("refresh");				
				
				if(!isHandleClearSettings){
					me.dateFilterVal = defaultDateIndex;
					selectedEntryDate = {};
					me.datePickerSelectedEntryAdvDate = [];
					me.resetAdvEntryDate();
				}
			},
			
			resetAdvEntryDate: function(){
				var me = this;
				var formattedFromDate,formattedToDate;
				var objDateParams = me.getDateParam('12');
				var vFromDate = objDateParams.fieldValue1;
				var vToDate = objDateParams.fieldValue2;				
				var dateFilterRef = $('#entryDateFrom');
				
				if (!Ext.isEmpty(vFromDate)) {
					formattedFromDate = Ext.util.Format.date(Ext.Date.parse(vFromDate, 'Y-m-d'), strExtApplicationDateFormat);
					formattedToDate = Ext.util.Format.date(Ext.Date.parse(vToDate, 'Y-m-d'), strExtApplicationDateFormat);
					$(dateFilterRef).datepick('setDate', [formattedFromDate, formattedToDate]);
				}
				dateFilterRef.setDateRangePickerValue([formattedFromDate,formattedToDate]);
				selectedEntryDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate,
						dateLabel : objDateParams.label
					};
				$('label[for="requestDateLabelItemId"]').text(getLabel('requestDate','Request Date')
								+ " (" + selectedEntryDate.dateLabel + ")");
				var dateLableTT = " (" + selectedEntryDate.dateLabel + ")";
				updateToolTip('entryDate', dateLableTT);
			},
			
			resetEntryDateAsDefault : function() {
				var me = this;
				me.dateFilterVal = defaultDateIndex;
				me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
				me.handleDateChange(me.dateFilterVal);
			},
			disableActions : function(canDisable) {
				if (canDisable)
					$('.canDisable').addClass('button-grey-effect');
				else
					$('.canDisable').removeClass('button-grey-effect');
			},
			showApprovalConfirmationView : function(strUrl, remark, grid,
					arrSelectedRecords, strActionType, strAction) {
				var arrColumnModel = APPROVAL_CONFIRMATION_COLUMN_MODEL;
				var storeFields = ['requestReference', 'obligorID', 'obligationID',
						'accountName', 'requestedAmnt', 'effectiveDate',
						'paymentTypeDesc', 'requestStatusDesc', 'siRequestStatusDesc',
						'hostResponseMsg', 'paymentType', 'countPaydown',
						'countAdvance', 'countInvoice', 'bdAmountPaydown',
						'bdAmountAdvance', 'bdAmountInvoice','requestDate'];
				showApprovalConfirmationPopup(arrSelectedRecords, arrColumnModel,
						storeFields, [strUrl, remark, grid, arrSelectedRecords, strActionType,
								strAction]);
					},
	handleClearAppliedFilterDelete : function(btn) {
		var me = this;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		$.each(quickJsonData, function( index, value ) {
			  if(  quickJsonData[index].paramName =='siEnabled' )
			  {
				  quickJsonData.splice(index, 1);
				  return false;
			  }
		});
		$.each(quickJsonData, function( index, value ) {
			  if( quickJsonData[index].paramName == 'requestStatus' )
			  {
				  quickJsonData.splice(index, 1);
				  return false;
			  }
		});
		
		$.each(quickJsonData, function( index, value ) {
			  if( quickJsonData[index].paramName == 'txnType' )
			  {
				  quickJsonData.splice(index, 1);
				  return false;
			  }
		});
		
		for (var ai, i = advJsonData.length; i--;) {
			paramName = advJsonData[i].field;
			arrAdvJson = advJsonData;
			arrAdvJson = me.removeFromAdvanceArrJson(arrAdvJson, paramName);
			me.advFilterData = arrAdvJson;
		}

		for (var ai, i = quickJsonData.length; i--;) {
			paramName = quickJsonData[i].field;
			arrQuickJson = quickJsonData;
			arrQuickJson = me.removeFromAdvanceArrJson(arrQuickJson, paramName);
			me.advFilterData = arrQuickJson;
		}
	},
	savePaydownForm : function(objJson) {
		var me = this;
		Ext.Ajax.request({
			url : 'saveLoanCenterTxnPaydownDetails.srvc',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				var responseData = Ext.decode(response.responseText);
				var isSuccess;
				var title, strMsg;
				if(!responseData.d.auth)
				{
					if (responseData.d.instrumentActions
							&& responseData.d.instrumentActions[0].success)
						isSuccess = responseData.d.instrumentActions[0].success;
					if (isSuccess && isSuccess === 'N') {
						title = getLabel('instrumentSaveFilterPopupTitle', 'Message');
						var errorMsg = '';
						var errorsList = responseData.d.instrumentActions[0].errors;
						Ext.each(errorsList, function(error, index) {
										errorMsg+=error.errorMessage + '<br>';
								});
						showErrorMessage(errorMsg);
	
					} else {
						var newRecid = responseData.d.instrumentActions[0].updatedStatusCode;
						if (!Ext.isEmpty(newRecid)) {
							callRealTimeresponse('responseData','newRec/accept.srvc', newRecid);
						}
						$('#payDownPopup').dialog("close");
						grid.refreshData();
					}
				}
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show(
				{
					title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
					cls:'t7-popup',
					msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		});

	},
	saveAdvancedForm : function(objJson) {
		var me = this;
		Ext.Ajax.request({
			url : 'saveLoanCenterTxnAdvanceDetails.srvc',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				
				var responseData = Ext.decode(response.responseText);
				var isSuccess;
				var title, strMsg;
				if (responseData.d.instrumentActions
						&& responseData.d.instrumentActions[0].success)
					isSuccess = responseData.d.instrumentActions[0].success;
				if (isSuccess && isSuccess === 'N') {
					title = getLabel('instrumentSaveFilterPopupTitle', 'Message');
					var errorMsg = '';
					var errorsList = responseData.d.instrumentActions[0].errors;
					Ext.each(errorsList, function(error, index) {
									errorMsg+=error.errorMessage + '<br>';
							});
					showAdvanceErrorMessage(errorMsg);

				} else {
					var newRecid = responseData.d.instrumentActions[0].updatedStatusCode;
					if (!Ext.isEmpty(newRecid)) {
						callRealTimeresponse('responseData','newRec/accept.srvc', newRecid);
					}
					$('#advancedPopup').dialog("close");
					grid.refreshData();
				}
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show(
				{
					title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
					cls:'t7-popup',
					msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		});

	},
	assignSavedFilter : function() {
		var me = this, objJsonData='', objLocalJsonData='', savedFilterCode='';
		me.resetAllFields();
		if (objLoanCenterPref || objSaveLocalStoragePref) {
			objJsonData = Ext.decode(objLoanCenterPref);
			objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
			if (!Ext.isEmpty(objLocalJsonData.d.preferences) 
					&& (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
					if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
						savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
						me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
					}
					if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
						me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,false);
						var entryDateLableVal = $('label[for="requestDateLabelItemId"]').text();
						var entryDateField = $("#entryDataPicker");
						me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
					}
			}
		}
	},
	/* State handling at local storage starts */
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		if(!Ext.isEmpty(me.savedFilterVal))
			objSaveState['advFilterCode'] = me.savedFilterVal;
		if(!Ext.isEmpty(me.advFilterData)){
			objAdvJson['filterBy'] = me.advFilterData;
			objSaveState['advFilterJson'] = objAdvJson;
		}
		objSaveState['filterAppliedType'] = me.filterApplied;
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
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
		var me = this,strLocalPrefPageName = me.strPageName+'_TempPref';
		var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting_4'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else {
			if(args && args.tempPref){
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
		objSaveLocalStoragePref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSaveLocalStoragePref);
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
		}
	},
	/* State handling at local storage End */
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='',savedFilterCode='';
		if (objLoanCenterPref || objSaveLocalStoragePref) {
			objJsonData = Ext.decode(objLoanCenterPref);
			objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
			if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
				if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
					savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
					me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
				}
				if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
					me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
					var entryDateLableVal = $('label[for="requestDateLabelItemId"]').text();
					var entryDateField = $("#entryDataPicker");
					me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
				}
			}
			else
			{
				me.applySavedDefaultPreference(objJsonData);
			}
		}	
	},
	applySavedDefaultPreference : function(objJsonData){
		var me = this;
		if (!Ext.isEmpty(objJsonData.d.preferences)) {
			if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
				if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
					var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
					me.doHandleSavedFilterItemClick(advData);
					me.savedFilterVal = advData;
				}
			}
		}
	},
} );
		
	function loanPayDown( yes )
	{
		disable();
	}
	function loanAdvance( yes )
	{
		advanceDisable();
	}
	function invoicePay( url, record, remark )
	{
		if(url.indexOf("payDown") < 0) {url = url+'&$payDown=N';}
		if(url.indexOf("advance") < 0) {url = url+'&$advance=N';}
		if(url.indexOf("loanInvoice") < 0) {url = url+'&$loanInvoice=N';}
		
		//GCP.getApplication().fireEvent( 'showInvoiceCenterPopupView', url, record, remark );
		$(document).trigger('showInvoiceCenterPopupView',[url, record, remark]);
	}