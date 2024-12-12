Ext.define('GCP.controller.PositivePayController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.PositivePayExceptionGroupView','GCP.view.PositivePayFilterView','Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.PositivePayView','GCP.view.PositivePayGridViewInfo','GCP.view.PositivePayBeneViewInfo',
	         'Ext.ux.gcp.SmartGridPager','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			},{
				ref : 'positivePayView',
				selector : 'positivePayView'
			},	
			{
				ref : 'positivePayExceptionGroupView',
				selector : 'positivePayView positivePayExceptionGroupView'
			},
			{
				ref : 'groupView',
				selector : 'positivePayExceptionGroupView groupView'
			},	
			/*{
				ref : 'positivePayDecisionToolBar',
				selector : 'positivePayView positivePayFilterView toolbar[itemId="positivePayDecisionToolBar"]'
			},*/
			{
				ref : 'positivePayGridViewInfoDtlRef',
				selector : 'positivePayGridViewInfo[itemId="viewInfoPopupId"] container[itemId="positivePayViewInfoItemId"]'
			},
			{
				ref : 'positivePayInfoRef',
				selector : 'positivePayGridViewInfo[itemId="viewInfoPopupId"]'
			},
			{
				ref : 'payBtn',
				selector : 'positivePayGridViewInfo[itemId="viewInfoPopupId"]  button[itemId="payBtn"]'
			},
			{
				ref : 'returnBtn',
				selector : 'positivePayGridViewInfo[itemId="viewInfoPopupId"]  button[itemId="returnBtn"]'
			},
			{
				ref : 'positivePayBeneInfoRef',
				selector : 'positivePayBeneViewInfo[itemId="beneInfoPopupId"]'
			},
			{
				ref : 'positivePayBeneViewInfoDtlRef',
				selector : 'positivePayBeneViewInfo[itemId="beneInfoPopupId"] container[itemId="positivePayBeneInfoItemId"]'
			},
			{
				ref : 'positivePayBeneViewInfoCondDtlRef',
				selector : 'positivePayBeneViewInfo[itemId="beneInfoPopupId"] container[itemId="payOnItemsConditionID"]'
			},
			{
				ref : 'positivePayViewInfoTitleBarRef',
				selector : 'positivePayGridViewInfo[itemId="viewInfoPopupId"] container[itemId="positivePayViewInfoTitleBar"]'
			},
			{
				ref : 'retunDecisionsRef',
				selector : 'returnDecisionPopUp[itemId="returnDecisionPopUpId"] container[itemId="returnComboId"]'
			},
			{
				ref : 'currencyRef',
				selector : 'positivePayBeneViewInfo[itemId="beneInfoPopupId"] container[itemId="ccyCode"]'
			},
			{
				ref : 'retunDecisionsPopUpRef',
				selector : 'returnDecisionPopUp[itemId="returnDecisionPopUpId"]'
			},									
			{
				ref : 'positivePayFilter',
				selector : 'positivePayFilterView' 
			},
			{
				ref : 'filterView',
				selector : 'filterView'
			} 
			],
	config :
	{
		isPageBarAdded : false,
		selectedPPay : 'positivePay',
		filterData : [],
		filterSeller : '',
		//typeFilterVal : 'all',
		filterApplied : 'ALL',
		actionFilterVal : 'all',
		actionFilterDesc : 'all',
		//typeFilterDesc : 'all',
		dateFilterVal : '15',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		dateFilterLabel : getLabel('showAll', 'Show All'),
		objViewInfoPopup:null,
		objViewBeneInfoPopup : null,		
		objEditPositivePayPopup : null,
		objReturnDecisionPopup : null,		
		gridSelectedRecords : [],
		gridViewSelectedRecord : [],
		isSingleRecordViewAction : false,
		arrCols : [],
		accList : [],
		decisionTypeFilterVal : 'A',
		accTypeFilterVal : 'All',
		accTypeFilterDesc :'All',
		pendingDecision : '',
		actionTaken : '',
		//pageSize : 2,
		recordsCount : null,
		urlGridPref : 'userpreferences/positivepay/gridView.srvc',
		urlGridFilterPref : 'userpreferences/positivepay/gridViewFilter.srvc',
		commonPrefUrl : 'services/userpreferences/positivepay.json',
		strGetModulePrefUrl : 'services/userpreferences/positivepay/{0}.json',
		filterCodeValue : null,
		dateHandler : null,
		arrSorter:[],
		strDefaultMask : '000000000000000000',
		reportGridOrder : null,
		advFilterCodeApplied : null,
		savedFilterVal : '',
		clientFilterVal : 'all',
		clientFilterDesc : getLabel('allCompanies', 'All companies'),
		strPageName:'positivepay',
		preferenceHandler:null,
		selectedSubGroupDescription : null,
		firstCall : true
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		var id = null;
		me.firstCall = true;
		me.clientFilterVal =$("#summaryClientFilterSpan").val(),
		me.clientFilterDesc = $("#summaryClientFilterSpan").text(),
		me.updateFilterConfig();
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
		//$('#issuanceAdvDate').datepick('option', 'minDate', clientFromDate);
		$(document).on('savePreference', function(event) {
			//	me.toggleSavePrefrenceAction(false);
				me.handleSavePreferences();
		});
		$(document).on('clearPreference', function(event) {
				me.handleClearPreferences();
		});
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
		});
		$(document).on('saveAndSearchActionClicked', function() {
			me.saveAndSearchActionClicked(me);
		});
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
			me.filterCodeValue=null;
		});
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		/*$(document).on('deleteFilterEvent', function(event, grid, rowIndex) {
			me.deleteFilterSet(grid, rowIndex);
		});*/
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
		$(document).on('handleBeneSaveAction', function() {
			me.handleBeneStatusUpdate();
		});
		$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});
		$(document).on('handleMandatoryFilterName', function(event) {
			me.handleMandatoryFilterName();
		});
		$(document).on('handleReturnReason', function() {
			me.handleReturnReasonStatus();
		});
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",false);	
			me.handleClientChangeInQuickFilter(isSessionClientFilter);
		});
		$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
		});
		$(document).on("datePickPopupSelectedDate",function(event, filterType, dates) {
			if (filterType == "issuanceAdvDate") {
				me.datePickerSelectedDate = dates;
				me.handleAdvFilterIssueDateChange(me.dateRangeFilterVal);
			}else if(filterType=="checkDate"){
				me.datePickerSelectedDate = dates;
				me.handleAdvFilterCheckDateChange(me.dateRangeFilterVal);
			}
		});
		$(document).on('filterDateChange',function(event, filterType, btn, opts) {
            me.creationDateFilterLabel= btn.text;
             if (filterType == "issuanceAdvDate"){
                 me.handleIssuanceAdvDateChange(btn.btnValue);
             }
        }); 
		GCP.getApplication().on(
				{
					callPopulateDepositImage : function( imageNmbr, side, recIdentifier )
					{
						me.populateDepositImage( imageNmbr, side, recIdentifier );
					},
					callDecision: function( btn )
					{
						me.decision(btn);
					},
					showReport: function()
					{
						me.showReport();
					},						
					handleBeneIconClick : function(beneName,beneAccountNmbr,amountType,fromBeneAmount,toBeneAmount,beneCcy,identifier)
					{
						me.handleBeneIconClickPopUp(beneName,beneAccountNmbr,amountType,fromBeneAmount,toBeneAmount,beneCcy,identifier);
					},
					selectRecords : function(rightsMap, makerId ,buttonMask,identifier,decision,rowIndex,isChecked)
					{
						me.pushRightsMap(rightsMap,makerId ,buttonMask,identifier,decision,rowIndex,isChecked);
					},
					setGridInformationSummary : function(pendingDecisions, actionRaken)
					{
						me.pendingDecision = pendingDecisions;
						me.actionTaken = actionRaken;	
						me.setGridInfoSummary();
					},
					showHideBtn: function( record, btnPay, btnReturn )
					{
						me.hidePayRtnBtn(record, btnPay, btnReturn);
					},
					verifyOkBtnClick : function(strActionUrl, text, grid, arrSelectedRecords, strActionType, strAction)
					{
						me.preHandleGroupActions(strActionUrl, text,
									grid, arrSelectedRecords,
									strActionType, strAction);
					}
				} );
		me.objReturnDecisionPopup = Ext.create( 'GCP.view.ReturnDecisionPopUp',
				{
					parent : 'positivePayView',
					itemId : 'returnDecisionPopUpId',
					callerParent : 'positivePayView'
				} );
		me.objViewInfoPopup = Ext.create( 'GCP.view.PositivePayGridViewInfo',
				{
					parent : 'positivePayView',
					itemId : 'viewInfoPopupId'
				} );
		me.objViewBeneInfoPopup = Ext.create( 'GCP.view.PositivePayBeneViewInfo',
				{
					parent : 'positivePayView',
					itemId : 'beneInfoPopupId'
				} );
		
	//	me.updateAdvFilterConfig();
		me.control({
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
			
			'positivePayView' : {
			beforerender : function(panel, opts) {
				//me.setDisclaimer();
			},
			afterrender : function(panel, opts) {

			}
		},
		
		'positivePayExceptionGroupView groupView' : {
			'groupByChange' : function(menu, groupInfo) {
				// me.doHandleGroupByChange(menu, groupInfo);
			},
			'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
					newCard, oldCard) {
				//me.toggleSavePrefrenceAction(true);
				me.doHandleGroupTabChange(groupInfo, subGroupInfo,
						tabPanel, newCard, oldCard);
				//me.disablePreferencesButton("savePrefMenuBtn",false);
				//me.disablePreferencesButton("clearPrefMenuBtn",false);				
			},
			'gridRender' : function(groupInfo, subGroupInfo, grid, url, pgSize,
						newPgNo, oldPgNo, sorter, filterData) {
				
					if(!Ext.isEmpty(subGroupInfo.groupDescription))
						me.selectedSubGroupDescription = subGroupInfo.groupDescription;
				
					me.addGridCellEditEvents(grid);
					me.doHandleLoadGridData(groupInfo, subGroupInfo, grid, url, pgSize,
						newPgNo, oldPgNo, sorter, filterData)
			},
			'gridPageChange' : me.doHandleLoadGridData,
			'gridSortChange' : me.doHandleLoadGridData,
			'gridPageSizeChange' : me.doHandleLoadGridData,
			'gridColumnFilterChange' : me.doHandleLoadGridData,
			'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
			'gridStateChange' : function(grid) {
				//me.toggleSavePrefrenceAction(true);
				me.disablePreferencesButton("savePrefMenuBtn",false);
				me.disablePreferencesButton("clearPrefMenuBtn",false);		
			},
			'gridRowActionClick' : function(grid, rowIndex, columnIndex,
					actionName, record) {
				me.doHandleRowActions(actionName, grid, record);
			},
			'groupActionClick' : function(actionName, isGroupAction,
					maskPosition, grid, arrSelectedRecords) {
				if (isGroupAction === true)
					me.doHandleGroupActions(actionName, grid,
							arrSelectedRecords, 'groupAction');
			},
			'render' : function() {
					populateAdvancedFilterFieldValue();
					me.firstTime = true;
					if (objPreference) {
						var objJsonData = Ext.decode(objPreference);
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							}
						}
					}
				},
			
			'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
			},
			
			afterrender : function() {
				
			}
		},
					
			'positivePayGridViewInfo[itemId="viewInfoPopupId"]' :
			{
				closeViewInfoPopup : function( btn )
				{
					me.closeViewInfoPopup( btn );
				},
				handlePayActionGridView : function( btn )
				{
					me.handleViewActions(btn);
				}
			},
			/*'positivePayBeneViewInfo[itemId="beneInfoPopupId"]' :
			{
				closeBeneInfoPopup : function( btn )
				{
					me.closeBeneInfoPopup( btn );
				},
				handleBeneActionGridView : function( btn )
				{
					me.handleBeneStatusUpdate(btn);
				}
			},*/
			/*'returnDecisionPopUp[itemId="returnDecisionPopUpId"]' :
			{
				handleReturnReason : function( btn )
				{
					me.handleReturnReasonStatus(btn);
				},
				closeReturnReasonPopUp : function(btn)
				{
					me.closeReturnReasonPopUp(btn);
				}
				
			},*/
			'positivePayBeneViewInfo[itemId=beneInfoPopupId] radiogroup[itemId="beneRadioId"]' :
			{
				change : function( btn, opts )
				{
					var me = this;
				}
			},
			'positivePayGridEditInfo[itemId=editPositivePayPopup] editPositivePayInfoPopUp':
			{
				closeEditInfoPopup : function(btn)
				{
					me.closeEditPopup( btn );
				}
			},

			'positivePayView ' : {
				afterrender : function() {
				}
			},	
			'positivePayFilterView' : {
				afterrender : function(btn, opts) {
					//me.setInfoTooltip();	
					var positivePayFilterView=me.getPositivePayFilter();
								positivePayFilterView.down('combo[itemId="savedFiltersCombo"]').setValue(me.savedFilterVal);
				},				
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				},				
				/*handleClientChangeInQuickFilter : function(combo) {
					me.handleClientChangeInQuickFilter(combo);
				},*/
				handleAccountChangeInQuickFilter : function(combo) {
					me.handleAccountChangeInQuickFilter(combo);
					//me.disablePreferencesButton("savePrefMenuBtn",false);
					//me.disablePreferencesButton("clearPrefMenuBtn",false);		
				}			
			},
			'positivePayFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
			/*'positivePayFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},*/
			'positivePayFilterView  combo[itemId="quickFilterAccountCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.accTypeFilterVal)) {
						combo.setValue(me.accTypeFilterVal);
					}
				}
			},
			
			'filterView' : {				
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
					setActionStatusMenuItems('actionStatus');
				}
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
			}
		});
	},
	createPager : function(positivePayStore,positivePayGrid)
	{
		var me = positivePayGrid;
		var arrItem = new Array();
		var rowList = _AvailableGridSize;
		if (!Ext.isEmpty(rowList) && Ext.isArray(rowList) && rowList.length > 0) {
			var intMinValue = Ext.Array.min(rowList);
			var arrData = new Array();
			var pgSize = !Ext.isEmpty(me.pageSize) ? me.pageSize : _GridSizeTxn;
			me.pageSize = pgSize;
			if (Ext.Array.contains(rowList, pgSize)) {
				arrItem.push('-');
				for (var i = 0; i < rowList.length; i++)
					arrData.push({
								key : rowList[i],
								value : rowList[i]
							});
				arrItem.push({
							xtype : 'combobox',
							itemId : 'pgSize',
							name : 'pgSize',
							editable : false,
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							margins : '-1 2 3 5',
							value : pgSize,
							displayField : 'value',
							valueField : 'key',
							matchFieldWidth : true,
							maxWidth : 43,
							listConfig : {
								minWidth : 15
							},
							store : Ext.create('Ext.data.Store', {
										fields : ['key', 'value'],
										data : arrData
									}),
							listeners : {
								change : function(combo, newValue, oldValue)
								{
									me.pageSize = newValue;
									me.store.pageSize = newValue;
									me.store.currentPage = 1;
									combo.ownerCt.doRefresh();
								}
							}
						});
			}

		}
		return Ext.create('Ext.ux.gcp.SmartGridPager', {
					baseCls : 'xn-paging-toolbar',
					itemId : 'pagerId',
					store : positivePayStore,
					dock : 'bottom',
					displayInfo : true,
					grid : me,
					minPgSize : intMinValue,
					items : arrItem
				});
	},
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var counter = 0;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (actionName === 'accept' || actionName === 'reject' 	|| actionName === 'pay' || actionName === 'return')
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory) && !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			id = record.data.identifier; 
			me.gridViewSelectedRecord = [];
			me.isSingleRecordViewAction = true;
			var type = "C";
			if( !Ext.isEmpty(record.data.txnType) || 
					!Ext.isEmpty(record.data.companyId) ||
					!Ext.isEmpty(record.data.secCode) )
			{
				type = 'ACH';
			}
			me.gridViewSelectedRecord.push(
			{
				serialNo : counter,
				identifier : record.data.identifier,
				type : type
			});
			//me.viewInfoPopUp(record);
			showPositivePayViewPopUp(record);
		} else if (actionName === 'btnViewIssue') {
			id = record.data.identifier; 
			var strUrl = 'positivePayList/getIssuance.srvc?';
			Ext.Ajax.request({
				url : strUrl,
				jsonData : Ext.encode(id),
				method : 'POST',
				success : function(response) {
					var record ;
					if(response.responseText != "" && response.responseText != null)
						record = Ext.JSON.decode(response.responseText);
					showPositivePayViewIssuePopUp(record);
				},
			failure : function() {
				//var record = Ext.JSON.decode(response.responseText);
				showPositivePayViewIssuePopUp(record);
			}
			});
			
		} else if(actionName === 'btnBene'){
			//me.viewBeneInfo(record);
			showPositivePayBenePopUp(record);
		}
		if (actionName === 'viewImage') 
		{
			var side = 'F';
			var checkImgNumber = record.get("checkImgNmbr");
			var recordIdentifier = record.get('identifier');
			me.populateDepositImage( checkImgNumber, side, recordIdentifier );
		}		
	},
	showHistory : function(url, id) {
	var historyPopup = 	Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					identifier : id
				}).show();
	historyPopup.center();
	},
	showVerificationPopup : function(strAction, grid, arrSelectedRecords,strActionType, strActionUrl) {
		var verificationPopup = 	Ext.create('GCP.view.PositivePayVerifyPopup', {
					action : strAction,
					grid : grid,
					selectedRecords : arrSelectedRecords,
					actionType : strActionType,
					actionUrl : strActionUrl
				}).show();
	verificationPopup.center();
	},
	/*viewInfoPopUp : function(record)
	{
		var me = this;
		var objCreateViewInfoPanel = me.getPositivePayGridViewInfoDtlRef();
		me.getViewInfoPopupValue(objCreateViewInfoPanel,record);
		me.setReadOnly(objCreateViewInfoPanel,true);
	
		if( !Ext.isEmpty( me.objViewInfoPopup ) )
		{
			me.objViewInfoPopup.show();
		}
		else
		{
			me.objViewInfoPopup = Ext.create( 'GCP.view.PositivePayGridViewInfo' );
			me.objViewInfoPopup.show();
		}
	},
	getViewInfoPopupValue : function(objCreateViewInfoPanel,record)
	{
		objCreateViewInfoPanel.down( 'textfield[itemId="accountNmbr"]' ).setValue( record.get('accountNmbr') );
		objCreateViewInfoPanel.down( 'textfield[itemId="instNmbr"]' ).setValue( record.get('instNmbr') );
		if(Ext.isEmpty(record.get('amount')))
		{
			objCreateViewInfoPanel.down( 'textfield[itemId="amount"]' ).setValue( "0.00" );	
		}
		else
		{
			objCreateViewInfoPanel.down( 'textfield[itemId="amount"]' ).setValue( "$"+ record.get('amount') );
		}
		objCreateViewInfoPanel.down( 'textfield[itemId="instDate"]' ).setValue( record.get('instDate') );
		objCreateViewInfoPanel.down( 'textfield[itemId="beneficiaryName"]' ).setValue( record.get('beneficiaryName') );
		objCreateViewInfoPanel.down( 'textfield[itemId="exceptionReason"]' ).setValue( record.get('exceptionReason') );
		objCreateViewInfoPanel.down( 'textfield[itemId="decisionStatus"]' ).setValue( record.get('decisionStatus') );
		if(record.get('decision')!= null && record.get('decision') === 'P')
		{
			objCreateViewInfoPanel.down( 'textfield[itemId="decision"]' ).setValue("Pay");
		}
		else if(record.get('decision')!= null && record.get('decision') === 'R')
		{
			objCreateViewInfoPanel.down( 'textfield[itemId="decision"]' ).setValue("Return");
		}
		
		if(record.get('defaultAction')!= null && record.get('defaultAction') === 'P')
		{
			objCreateViewInfoPanel.down( 'textfield[itemId="defaultAction"]' ).setValue( "Pay" );
		}
		else if(record.get('defaultAction')!= null && record.get('defaultAction') === 'R')
		{
			objCreateViewInfoPanel.down( 'textfield[itemId="defaultAction"]' ).setValue( "Return" );
		}
		
		objCreateViewInfoPanel.down( 'textfield[itemId="decisionReason"]' ).setValue( record.get('decisionReason') );
		objCreateViewInfoPanel.down( 'textfield[itemId="fileImportDate"]' ).setValue( record.get('fileImportDate') );
	},*/
	setReadOnly : function(objCreateViewInfoPanel,boolVal)
	{
		objCreateViewInfoPanel.down( 'textfield[itemId="accountNmbr"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="instNmbr"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="amount"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="instDate"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="beneficiaryName"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="exceptionReason"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="decisionStatus"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="decision"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="defaultAction"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="decisionReason"]' ).setReadOnly( boolVal );
		objCreateViewInfoPanel.down( 'textfield[itemId="fileImportDate"]' ).setReadOnly( boolVal );
	},
	handleAdvFilterIssueDateChange : function() {
		var me = this;
		var index = '13';
		var dateToField;
		var objDateParams = me.getDateParam(index, null);
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);		
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#issuanceAdvDate').setDateRangePickerValue(vFromDate);
			} else {
				$('#issuanceAdvDate').setDateRangePickerValue([vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCheckDateFilter = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
	},
	handleIssuanceAdvDateChange : function(index) {
        var me = this;
        var dateToField;
        var objDateParams = me.getDateParam(index,'issuanceAdvDate');

        if (!Ext.isEmpty(me.creationDateFilterLabel)) {
            $('label[for="issunceDateAdvLabel"]').text(getLabel('issuanceAdvDate',
                    'Issuance Date')
                    + " (" + me.creationDateFilterLabel + ")");
        }
        
            /*var vFromDate = Ext.util.Format.date(Ext.Date.parse(
                            objDateParams.fieldValue1, 'Y-m-d'),
                    strExtApplicationDateFormat);
            var vToDate = Ext.util.Format.date(Ext.Date.parse(
                            objDateParams.fieldValue2, 'Y-m-d'),
                    strExtApplicationDateFormat);*/
			var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
			var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
            var filterOperator=objDateParams.operator;
            
            if (index == '13') {
                if (filterOperator == 'eq') {
                    $('#issuanceAdvDate').setDateRangePickerValue(vFromDate);
                } else {
                    $('#issuanceAdvDate').setDateRangePickerValue([
                            vFromDate, vToDate]);
                }
                if(filterOperator=='eq')
                    dateToField="";
                else
                    dateToField=vToDate;
                selectedCheckDateFilter={
                    operator:filterOperator,
                    fromDate:vFromDate,
                    toDate:dateToField
                };
            } else {
                if (index === '1' || index === '2' || index === '12') {
                    if (index === '12') {
                        $('#issuanceAdvDate').val('Till' + '  ' + vFromDate);
                    } else {
                        $('#issuanceAdvDate').setDateRangePickerValue(vFromDate);
                    }
                } else {
                    $('#issuanceAdvDate').setDateRangePickerValue([
                            vFromDate, vToDate]);
                }
                if(filterOperator=='eq')
                    dateToField="";
                else
                    dateToField=vToDate;
                selectedCheckDateFilter={
                    operator:filterOperator,
                    fromDate:vFromDate,
                    toDate:dateToField
                };
            }
    },
	handleAdvFilterIssueDateOnLoad : function() {
		var me = this;
		var index = '15';
		var dateToField;
		var objDateParams = me.getDateParam(index, null);
		/*var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);*/
		var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
		var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
		var filterOperator = objDateParams.operator;

		if (index == '15') {
			if (filterOperator == 'eq') {
				$('#issuanceAdvDate').setDateRangePickerValue(vFromDate);
			} else {
				$('#issuanceAdvDate').setDateRangePickerValue([vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCheckDateFilter = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
	},
	
	getDateParam : function(index) {
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
		case '1':
			// Today
			fieldValue1 = Ext.Date.format( date, strSqlDateFormat );
			fieldValue2 = fieldValue1;
			operator = 'eq';
			break;
		case '2':
			// Yesterday
			fieldValue1 = Ext.Date.format( objDateHandler.getYesterdayDate( date ), strSqlDateFormat );
			fieldValue2 = fieldValue1;
			operator = 'eq';
			break;
		case '3':
			// This Week
			dtJson = objDateHandler.getThisWeekToDate( date );
			fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
			fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
			operator = 'bt';
			break;
		case '4':
			// Last Week To Date
			dtJson = objDateHandler.getLastWeekToDate( date );
			fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
			fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
			operator = 'bt';
			break;
		case '5':
			// This Month
			dtJson = objDateHandler.getThisMonthToDate( date );
			fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
			fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
			operator = 'bt';
			break;
		case '6':
			// Last Month To Date
			dtJson = objDateHandler.getLastMonthToDate( date );
			fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
			fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
			operator = 'bt';
			break;
	//	case '7':
			// Date Range
			/*var frmDate = me.getFromEntryDate().getValue();
			var toDate = me.getToEntryDate().getValue();
			fieldValue1 = Ext.Date.format( frmDate, strSqlDateFormat );
			fieldValue2 = Ext.Date.format( toDate, strSqlDateFormat );
			operator = 'bt';*/
			//break;
		case '8':
			// This Quarter
			dtJson = objDateHandler.getQuarterToDate( date );
			fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
			fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
			operator = 'bt';
			break;
		case '9':
			// Last Quarter To Date
			dtJson = objDateHandler.getLastQuarterToDate( date );
			fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
			fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
			operator = 'bt';
			break;
		case '10':
			// This Year
			dtJson = objDateHandler.getYearToDate( date );
			fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
			fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
			operator = 'bt';
			break;
		case '11':
			// Last Year To Date
			dtJson = objDateHandler.getLastYearToDate( date );
			fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
			fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
			operator = 'bt';
			break;
		case '12':
			// Latest
			fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
			fieldValue2 = fieldValue1;
			operator = 'le';
			break;
		case '13' :
				// Date Range
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
				 break;
		 case '15' :
				var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
				var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
				fieldValue1 = Ext.Date.format(
						fromDate,
						strSqlDateFormat);
				fieldValue2 = Ext.Date.format(
						toDate,
						strSqlDateFormat);
				operator = 'bt';
				label = 'Latest';
		
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
	viewBeneInfo : function(beneName,beneAccountNmbr,amountType,fromBeneAmount,toBeneAmount,beneCcy,identifier)
	{
		var me = this;
		var objCreateBeneInfoPanel = me.getPositivePayBeneViewInfoDtlRef();
		me.getBeneValues(objCreateBeneInfoPanel,beneName,beneAccountNmbr,amountType,fromBeneAmount,toBeneAmount,beneCcy,identifier);
	
		if( !Ext.isEmpty( me.objViewBeneInfoPopup ) )
		{
			me.objViewBeneInfoPopup.show();
		}
		else
		{
			me.objViewBeneInfoPopup = Ext.create( 'GCP.view.PositivePayBeneViewInfo' );
			me.objViewBeneInfoPopup.show();
		}
	},
	getBeneValues : function(objCreateBeneInfoPanel,beneName,beneAccountNmbr,amountType,fromBeneAmount,toBeneAmount,beneCcy,identifier)
	{
		var me = this;
		objCreateBeneInfoPanel.down('textfield[itemId="beneAccountNmbr"]').setValue(beneAccountNmbr);
		objCreateBeneInfoPanel.down('textfield[itemId="beneficiaryName"]').setValue(beneName);
		if(Ext.isEmpty(fromBeneAmount))
		{
			objCreateBeneInfoPanel.down('textfield[itemId="fromBeneAmount"]').setValue("0.00");
		}
		else
		{
			objCreateBeneInfoPanel.down('textfield[itemId="fromBeneAmount"]').setValue("$"+fromBeneAmount);
		}
		if(Ext.isEmpty(toBeneAmount))
		{
		}
		else
		{
		}
		
		objCreateBeneInfoPanel.down('hidden[itemId="decisionNmbr"]').setValue(identifier);
		objCreateBeneInfoPanel.down( 'textfield[itemId="beneAccountNmbr"]' ).setReadOnly( true );
		objCreateBeneInfoPanel.down( 'textfield[itemId="beneficiaryName"]' ).setReadOnly( true );
	},
	setGridInfoSummary : function()
	{
		var me = this;
		/*var positivePayInfo = me.getPositivePayGridInformationView();

		//pendingAuth
		var pendingAuthCountId = positivePayInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="pendingAuthCountItemId"]' );
		var pendingAuthTotalId = positivePayInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="pendingAuthTotalItemId"]' );
		
		var pendingAuthData = me.actionTaken;
		if (!Ext.isEmpty(pendingAuthData))
		{
			var authData = pendingAuthData.split(' ');
			pendingAuthCountId.setText('#' +authData[0].trim());
			pendingAuthTotalId.setText(authData[1].trim());
		}
		
		//pendingException
		var pendingExceptionCountId = positivePayInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="pendingExceptionCountItemId"]' );
		var pendingExceptionTotalId = positivePayInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="pendingExceptionTotalItemId"]' );
		
		var pendingExceptionData = me.pendingDecision;
		if (!Ext.isEmpty(pendingExceptionData))
		{
			var exceptionData = pendingExceptionData.split(' ');
			pendingExceptionCountId.setText('#'+exceptionData[0].trim());
			pendingExceptionTotalId.setText(exceptionData[1].trim());
		}
		*/
		var decisionCount = 0;
		var decisionTotal = 0;
		var actionTakenCount = 0;
		var actionTakenTotal = 0;
		if (!Ext.isEmpty(me.pendingDecision))
		{
			var exceptionData = me.pendingDecision.split(' ');
			decisionCount = exceptionData[0].trim();
			decisionTotal = exceptionData[1].trim();
		}
		if (!Ext.isEmpty(me.actionTaken))
		{
			var authData = me.actionTaken.split(' ');
			actionTakenCount = authData[0].trim();
			actionTakenTotal = authData[1].trim();
		}
		
		var summaryData = [
			{			
				"description": "Pending Decision",
				"summaryTotal": decisionTotal,
				"summaryCount": decisionCount
			},
			{
				"description": "Action Taken",
				"summaryTotal": actionTakenTotal,
				"summaryCount": actionTakenCount
			}		
		];
		
		$('#summaryCarousal').carousel({
				data : summaryData,
				titleNode : "description",
				contentRenderer: function(value) {
					return  value.summaryTotal + ' (#'+ value.summaryCount +')';
				}								
		});
		$('#summaryCarousal .slick-next').addClass('slick-disabled')
	},	
	generateUrl : function(strUrl, pageSize, newPgNo, oldPgNo, sorterJson)
	{
		var me = this;
		var strSortUrl = null;
		//me.store.currentPage = newPgNo;
		if (me.showAllRecords === true)
			strUrl = strUrl + '?$top=-1';
		else if (!Ext.isEmpty(pageSize))
			strUrl = strUrl + '?$top=' + pageSize;
		else
			strUrl = strUrl + '?$top=20';

		if (!Ext.isEmpty(newPgNo))
			strUrl = strUrl + '&$skip=' + newPgNo;
		else
			strUrl = strUrl + '&$skip=1';

		strUrl = strUrl + '&$inlinecount=allpages';


		return strUrl;
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
			me.preferenceHandler.readPagePreferences(me.strPageName, me.updateObjPositivePaySummaryPref,args, me,false);
		}
	},
	updateObjPositivePaySummaryPref : function(data){		
		objPreference = Ext.encode(data);
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
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
		var objSummaryView = me.getPositivePayExceptionGroupView();
		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objPreference)) {
			objPrefData = Ext.decode(objPreference);
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
					: (objSummaryView.getDefaultColumnModel() || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/positivepayFilter.json';
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
	/* Page setting handling ends here */

	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
			args = {
				scope : me
			};
			strModule = subGroupInfo.groupCode;
			strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
			me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);

			/*strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
			strUrl = strUrl +'?'+csrfTokenName+'='+csrfTokenValue;
			me.getSavedPreferences(strUrl, me.postHandleDoHandleGroupTabChange,
					args);*/
		}else 
		me.postHandleDoHandleGroupTabChange();
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
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getPositivePayExceptionGroupView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		
		var decisionStore = new Ext.data.SimpleStore({
			  fields: [ "code", "description" ],
			  data: [
			  [ "N", "None" ],
			  [ "P", "Pay" ],
			  [ "R", "Return" ]
			  ]
			});
		
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			//arrCols = objPref.gridCols || null;
			//intPgSize = objPref.pgSize || _GridSizeTxn;
			if(!Ext.isEmpty(objPref.gridCols)){
				Ext.each(objPref.gridCols, function(col,index) {
					if(col.colId == "decision") {
						col.editor = {
							xtype: 'combobox',
							typeAhead: true,					
							selectOnTab: true,
							displayField : 'description',
							valueField : 'code',
							itemId : 'decision',
							store: decisionStore,
							blankText : 'code',
							name : 'decision',
							listClass: 'x-combo-list-small'
						}
					} else if(col.colId == "decisionReason") {
						col.editor = {
								xtype: 'combobox',
								itemId : 'decisionReason',
								typeAhead: true,					
								selectOnTab: true,
								blankText : 'code',
								displayField : 'description',
								valueField : 'code',
								listClass: 'x-combo-list-small'
							}
					}
				});
			}
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumnModel(arrCols);
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
                    }
				};
			}
		}
		objGroupView.reconfigureGrid(gridModel);
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
			
		if(strFieldName === 'accountNmbr' || strFieldName === 'accountId'){
			var objField =me.getPositivePayFilter().down('combo[itemId="quickFilterAccountCombo"]');
			if(!Ext.isEmpty(objField)){
				objField.selectAllValues();
				me.accTypeFilterVal = 'All';
			}
			resetAllMenuItemsInMultiSelect("#accountSelect");
		}
		else if(strFieldName === 'instDate'){
			$("#issuanceAdvDate").val("");
			selectedCheckDateFilter={};
		}else if(strFieldName === 'status'){
			//$("#actionStatus").val("");
			resetAllMenuItemsInMultiSelect("#actionStatus");
		}else if(strFieldName === 'checkNmbr'){
			$("#checkNmbr").val("");
		}else if(strFieldName === 'decision'){
			$("#decision").val("");		
		}else if(strFieldName === 'amount'){
			$("#amountOperator").val($("#amountOperator option:first").val());
			$("#amountFieldFrom").val("");
		}else if(strFieldName === 'receiverName'){
			$("#payeeText").val("");
		}else if(strFieldName === 'clientCode'){
			if(isClientUser()){
			var clientComboBox = me.getPositivePayFilter()
						.down('combo[itemId="quickFilterClientCombo"]');
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
			}
		}
		else
			if(strFieldName == 'secCode' )
			{
				resetAllMenuItemsInMultiSelect("#secCode");
			}
			else
			if(strFieldName == 'txnType' )
			{
				resetAllMenuItemsInMultiSelect("#txnType");
			}
		
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this,columns=null;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if(Ext.isEmpty(me.advFilterData) && me.firstCall === true) {
			me.handleAdvFilterIssueDateOnLoad();
			me.filterApplied = 'A';
			me.advFilterData = getAdvancedFilterQueryJson(me.firstCall);
			me.firstCall=false;
		}
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue+this.filterSeller;
		columns = grid.columns; 
		if(!Ext.isEmpty(columns)){
	        Ext.each(columns, function(col) { 
	                if (col.itemId == 'col_checkImgNmbr') { 
	                        col.sortable = false; 
	                } 
	        });
		}
		me.reportGridOrder = strUrl;
		
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'Seller');
					quickJsonData = arrQuickJson;
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData);
			}
		}

		if (!Ext.isEmpty(me.advFilterData)) {
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = arrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);
				
			if (arrOfFilteredApplied)
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		grid.loadGridData(strUrl, me.postLoadGridData, null, false, me);
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if(Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			if(clickedColumn.itemId != 'col_decision' && clickedColumn.itemId != 'col_decisionReason') {
				me.handleGridRowClick(record, grid, columnType);
			}
		});
	},
	postLoadGridData : function(grid, data, args) {
		var me = this;
		me.getGroupView().setLoading(false);
		me.loadSummaryInfo(grid, data, args);
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
		} else {
		}
	},
	loadSummaryInfo : function(grid, data, args) {
		var me = this;
		if (data && data.d && data.d.positivePay && data.d.positivePay[0])
		{
			var pendingDecision = data.d.positivePay[0].pendingDecisions;
			var actionTaken = data.d.positivePay[0].actionRaken;			
			setGridSummary(pendingDecision, actionTaken);
		}
		else
		{
			//TODO: should be seller ccy symbol
			var summaryData = [
			       			{			
			       				"description": "Pending Decision",
			       				"summaryTotal": '$0'
			       			},
			       			{
			       				"description": "Action Taken",
			       				"summaryTotal": '$0'
			       			}		
			       		];
			       		
			       		$('#summaryCarousal').carousel({
			       				data : summaryData,
			       				titleNode : "description",
			    				contentRenderer: function(value) {
			    					return  value.summaryTotal;
			    				}								
			       		});
			       		$('#summaryCarousal .slick-next').addClass('slick-disabled')
		}
	},
	getAdvancedFilterQueryJson : function(objOfCreateNewFilter) {
		var objJson = null;

		var jsonArray = [];

		var Ref = objOfCreateNewFilter
				.down('textfield[itemId="Reference"]').getValue();
		if (!Ext.isEmpty(Ref)) {
			jsonArray.push({
				field : 'Reference',
				operator : 'lk',
				value1 : objOfCreateNewFilter
						.down('textfield[itemId="Reference"]').getValue(),
				value2 : '',
				dataType : 0,
				displayType : 0
			});
		}
		var CheckNum = objOfCreateNewFilter
				.down('textfield[itemId="CheckNum"]').getValue();
		if (!Ext.isEmpty(CheckNum)) {
			jsonArray.push({
						field : 'CheckNum',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('textfield[itemId="CheckNum"]')
								.getValue(),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		var acc = objOfCreateNewFilter.down('AutoCompleter[itemId="Account"]')
				.getValue();
		if (!Ext.isEmpty(acc)) {
			jsonArray.push({
						field : 'Account',
						operator : 'lk',
						value1 : objOfCreateNewFilter
								.down('AutoCompleter[itemId="Account"]').getValue(),
						value2 : '',
						dataType : 0,
						displayType : 5
					});
		}
		var amount = objOfCreateNewFilter.down('numberfield[itemId="Amount"]')
				.getValue();
		var amtOptr = objOfCreateNewFilter
				.down('combobox[itemId="rangeCombo"]').getValue();
		if (!Ext.isEmpty(amount) && !Ext.isEmpty(amtOptr)
				&& amtOptr != 'Operator') {

			jsonArray.push({
						field : 'Amount',
						operator : objOfCreateNewFilter
								.down('combobox[itemId="rangeCombo"]')
								.getValue(),
						value1 : objOfCreateNewFilter
								.down('numberfield[itemId="Amount"]')
								.getValue(),
						value2 : '',
						dataType : 2,
						displayType : 2
					});

		}
		
		var statusFilter = objOfCreateNewFilter.down( 'combobox[itemId="RequestState"]' ).getValue();
		if( !Ext.isEmpty( statusFilter ) && (statusFilter !=="0.A"  && statusFilter !== "All") && (statusFilter != "8.13.14"  && statusFilter !== "All"))
		{
			jsonArray.push(
			{
				field : 'RequestState',
				operator : 'eq',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="RequestState"]' ).getValue(),
				value2 : ''
			} );
		}
		else if( !Ext.isEmpty( statusFilter) && (statusFilter =="8.13.14"  && statusFilter !== "All") )
		{
			jsonArray.push(
			{
				field : 'RequestState',
				operator : 'in',
				value1 : objOfCreateNewFilter.down( 'combobox[itemId="RequestState"]' ).getValue()
			} );
		}
		else if( !Ext.isEmpty( statusFilter) && (statusFilter =="0.A"  && statusFilter !== "All") )
		{
			jsonArray.push(
			{
				field : 'RequestState',
				operator : 'eq',
				value1 : '0' 
			} );
			jsonArray.push(
					{
						field : 'makerId',
						operator : 'ne',
						value1 : USER
					} );
		}
		
		var entryDate = objOfCreateNewFilter.down('datefield[itemId="EntryDate"]').getValue();
		  if(!Ext.isEmpty(entryDate)) { 
			  jsonArray.push({
				  field :'EntryDate',
				  operator :'eq',
				  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="EntryDate"]').getValue(),'Y-m-d'),
				  value2 : '',
				  dataType: 1,
				  displayType:5});
	    }
	  var Checkdate = objOfCreateNewFilter.down('datefield[itemId="CheckDate"]').getValue();
	  if(!Ext.isEmpty(Checkdate)) { 
		  jsonArray.push({
			  field :'CheckDate',
			  operator :'eq',
			  value1 :Ext.util.Format.date(objOfCreateNewFilter.down('datefield[itemId="CheckDate"]').getValue(),'Y-m-d'),
			  value2 : '',
			  dataType: 1,
			  displayType:5});
      }
	  if (!jQuery.isEmptyObject(selectedCheckDateFilter)) {
			jsonArray.push({
						field : 'instDate',
						operator : selectedCheckDateFilter.operator,
						value1 : Ext.util.Format.date(selectedCheckDateFilter.fromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty(selectedCheckDateFilter.toDate))? Ext.util.Format.date(selectedCheckDateFilter.toDate,'Y-m-d'): '',
						dataType : 1,
						paramFieldLable : getLabel('issueDate', 'Issue Date'),
	                    displayType : 5,
	                    displayValue1 : Ext.util.Format.date(
								selectedCheckDateFilter.fromDate, 'Y-m-d')
					});
		}

		objJson = jsonArray;
		return objJson;
	},
	setDataForFilter : function() {
		var me = this;
		var arrQuickJson = {};
			me.filterData = this.getQuickFilterQueryJson();
			var objJson = getAdvancedFilterQueryJson();
			
			if (!Ext.isEmpty(objJson)){
				arrQuickJson = me.filterData;
				var reqJson = me.findInAdvFilterData(objJson, "accountNmbr");
				if (!Ext.isEmpty(reqJson)) {
					arrQuickJson = me.removeFromAdvanceArrJson(arrQuickJson, "accountNmbr");
				}
				me.filterData = arrQuickJson;
			}
			me.advFilterData = objJson;
			var filterCode = $("input[type='text'][id='savedFilterAs']").val();
			me.advFilterCodeApplied = filterCode;
		if (this.filterApplied === 'ALL') {
			this.advFilterData = [];
			this.filterData = this.getQuickFilterQueryJson();
		}
		me.setSellerFilterParam();
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
	setSellerFilterParam : function(){
		var me = this;
		var sellerVal = '';		
		sellerVal = strSellerId;		
		if (!Ext.isEmpty(sellerVal) && sellerVal !== null) 
		{
			this.filterSeller = '&$seller=';
		}
	 },
	getQuickFilterQueryJson : function() {
		
		var me = this;		
		var actionFilterVal = this.actionFilterVal;
		var jsonArray = [];
		
		var accTypeFilterVal = me.accTypeFilterVal;
		var tempAccData=accTypeFilterVal;
		if (!Ext.isEmpty(tempAccData)) {
		if(!Ext.isEmpty(filterAccountDataCount)){
			var accountCodesArray=accTypeFilterVal.split(',');
			if(filterAccountDataCount==accountCodesArray.length)
				tempAccData='All';
		}
		/*if(tempAccData!='All'){
		jsonArray.push({
					field : 'accountNmbr',
					operatorValue : 'in',
					paramValue1 : encodeURIComponent(tempAccData.replace(new RegExp("'", 'g'), "\''")),
					dataType :'S',
					displayType : 5,
					paramFieldLable :  getLabel( 'accounts', 'Accounts' ),
                    displayValue1 : tempAccData
				});
		}*/
	}

		if (!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal != 'all') {
			jsonArray.push({
						field : 'clientCode',
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('compay', 'Company Name'),
                        displayType : 5,
                        displayValue1 : me.clientFilterDesc
					});
		}
		return jsonArray;
	},
	handleAccountFieldSync : function(type,statusData,statusDataDesc){
		var me = this;
		if(!Ext.isEmpty(type)){
			if(type === 'Q'){
				var objAccountField = $("#accountSelect");
				var objQuickAccountField = me.getPositivePayFilter().down('combo[itemId="quickFilterAccountCombo"]');
				if(!Ext.isEmpty(statusData)){
					objAccountField.val([]);
					objAccountField.val(statusData);
				}
				else if(Ext.isEmpty(statusData)){
					objAccountField.val([]);
				}
				objAccountField.multiselect("refresh");
				if(objQuickAccountField.isAllSelected()) {
					me.accTypeFilterVal = 'All';
				}
			}
			if(type === 'A'){
				var objAccountField = me.getPositivePayFilter().down('combo[itemId="quickFilterAccountCombo"]');
				if(!Ext.isEmpty(statusData)) {
					me.accTypeFilterVal = 'All';
					objAccountField.setValue(statusData);
					objAccountField.selectedOptions = statusData;
				} else {
					objAccountField.setValue(statusData);
					me.accTypeFilterVal = '';
				}
			}
		}
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', strActionStatusUrl = '', isFilterApplied = 'false';
		var isFilter = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
		if( !Ext.isEmpty( strQuickFilterUrl ) )
		{
			strUrl += '&$filter=' + strQuickFilterUrl;
			isFilterApplied = true;
			isFilter = true;
		}
		strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams( me );
		if( !Ext.isEmpty( strAdvancedFilterUrl ) )
		{
			if( Ext.isEmpty( strUrl ) )
				strUrl += '&$filter=' + strAdvancedFilterUrl;
			else
				strUrl += ' and ' + strAdvancedFilterUrl;
			isFilterApplied = true;
		}
		if (!Ext.isEmpty(strGroupQuery)) {
			if(strGroupQuery.indexOf("file_imported_date") != -1){
				if (!Ext.isEmpty(strUrl))
				{
					if(isFilter)
						strUrl += 'fileImportDate lt date' + '\'' + dtTodayDate + '\'';
					else
						strUrl += ' and ' + 'fileImportDate lt date' + '\'' + dtTodayDate + '\'';
				}
				else
				{
					if(strGroupQuery.indexOf("cuttofftime") != -1)
						{
							strGroupQuery=strGroupQuery.replace("cuttofftime",deccutOffTime);
							strUrl += '&$filter=' + strGroupQuery;	
						}
					else
					strUrl += '&$filter=' + strGroupQuery;				
				//strUrl += ' and ' + 'fileImportDate lt date' + '\'' + dtTodayDate + '\'';
				}
			}
			else
			{
				if(strGroupQuery.indexOf("cuttofftime") != -1)
				{
					strGroupQuery=strGroupQuery.replace("cuttofftime",deccutOffTime);
				}
				if (!Ext.isEmpty(strUrl))
				{
					if(isFilter)
						strUrl += strGroupQuery;
					else
						strUrl += ' and ' + strGroupQuery;
				}
				else
				{
					strUrl += '&$filter=' + strGroupQuery;
				}
			}
		}
		if (!Ext.isEmpty(subGroupInfo.groupCode) && subGroupInfo.groupCode === 'HISTORY') {
			strUrl += '&$showHist=Y';
		}
		if (!Ext.isEmpty(subGroupInfo.groupCode) && subGroupInfo.groupCode === 'all' ) {
			if( !Ext.isEmpty( strAdvancedFilterUrl ) &&  strAdvancedFilterUrl.indexOf("(status eq '3')") != -1)
				strUrl += '&$showHist=Y';
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
						
						
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operatorValue + ' '
								+ 'datetime\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'datetime\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				case 'in' :
					var reg = new RegExp(/[\(\)]/g);
					var objValue = filterData[index].paramValue1;
					objValue = decodeURIComponent(objValue);
					// objValue = objValue.replace(reg, '');
					var objArray = objValue.split(',');
					if (objArray.length > 0) {
						if (objArray[0] != 'All') {
							if (isFilterApplied) {
								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl + ' and ';
								} else {
									// strTemp = strTemp + ' and ';
									strTemp = strTemp;
								}
							} else {
								isFilterApplied = true;
							}

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
											+ filterData[index].field
											+ ' eq ';
									strDetailUrl = strDetailUrl + '\''
											+ objArray[i] + '\'';
									if (i != objArray.length - 1)
										strDetailUrl = strDetailUrl + ' or ';
								} else {
									strTemp = strTemp
											+ filterData[index].field
											+ ' eq ';
									strTemp = strTemp + '\'' + objArray[i]
											+ '\'';
									if (i != objArray.length - 1)
										strTemp = strTemp + ' or ';

								}
							}
							if (filterData[index].detailFilter
									&& filterData[index].detailFilter === 'Y') {
								strDetailUrl = strDetailUrl + ')';
							} else {
								strTemp = strTemp + ')';
							}
						}
					}
					break;
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operatorValue + ' '
								+ 'datetime\'' + filterData[index].paramValue1
								+ '\'';
					} else {
						
						strTemp = strTemp + filterData[index].field + ' '
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

	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;		
		var tempMaskArray = null;
		var maskArray = new Array(), actionMask = '', objData = null;;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		me.gridSelectedRecords = [];
		var checkCounter = 0,achCounter = 0;
		
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];	
			if( !Ext.isEmpty(objData.data.txnType) || !Ext.isEmpty(objData.data.companyId) || !Ext.isEmpty(objData.data.txnType) )
			{
				achCounter++;
			}
			else
			{
				checkCounter++;
			}
			
			tempMaskArray = objData.get('__metadata').__rightsMap;
			
			if( objData.raw.exceptionReasonCode == '0' )
			{
				tempMaskArray = me.setCharAt( tempMaskArray, 2, "0" );
				tempMaskArray = me.setCharAt( tempMaskArray, 3, "0" );
			}
			if( achCounter != 0 && checkCounter != 0 )
			{
				tempMaskArray = me.setCharAt( tempMaskArray, 3, "0" );
			}
			maskArray.push(tempMaskArray);
			
			me.gridSelectedRecords.push(
			{
				serialNo : index,
				identifier : arrSelectedRecords[index].data.identifier
			});
		}

		actionMask = doAndOperation(maskArray, 9);
		objGroupView.handleGroupActionsVisibility(actionMask);
	},
	
	setCharAt : function(str, index, chr ) 
	{
		if(index > str.length-1) return str;
		return str.substr(0,index) + chr + str.substr(index+1);
	},
	
	searchTrasactionChange : function() {
		var me = this;
		var searchValue = me.getSearchTxnTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getPositivePayGrid();
		grid.view.refresh();

		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

		if (searchValue !== null) {
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
							});
							// update cell html
							cell.dom.innerHTML = cellHTML;
							td = td.next();
						}
					}
				}, me);
			}
		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl = Ext.String.format('{0}List/{1}.srvc',	me.selectedPPay, strAction);
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		}
		else if( strAction === 'accept' && !isHidden('showVerifyPopupaccept')){
			me.showVerificationPopup(strAction, grid, arrSelectedRecords,strActionType, strUrl);
		}
		else if(strAction === 'submit' && !isHidden('showVerifyPopupsubmitForDecision') )
		{
			me.showVerificationPopup(strAction, grid, arrSelectedRecords,strActionType, strUrl);
		}
		else if (strAction === 'return') {
			//me.viewReturnDecisionPopUp();
			var type = "C";
			if( !Ext.isEmpty(arrSelectedRecords[0].data.txnType) || 
					!Ext.isEmpty(arrSelectedRecords[0].data.companyId) ||
					!Ext.isEmpty(arrSelectedRecords[0].data.secCode) )
			{
				type = 'ACH';
			}
			showReturnReasonPopUp(type);
		} else {
			me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
	},
	viewReturnDecisionPopUp : function()
	{
		var me = this;
		var objReturnPopup = me.getRetunDecisionsRef();
		if( !Ext.isEmpty( me.objReturnDecisionPopup ) )
		{
			me.objReturnDecisionPopup.show();
		}
		else
		{
			me.objReturnDecisionPopup = Ext.create( 'GCP.view.ReturnDecisionPopUp' );
			me.objReturnDecisionPopup.show();
		}
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark' );
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
			title : titleMsg,
			msg : fieldLbl,
			buttons : Ext.Msg.OKCANCEL,
			multiline : 4,
			cls : 't7-popup',
			width: 355,
			height : 270,
			bodyPadding : 0,
			fn : function(btn, text) {
				if (btn == 'ok') {
					me.preHandleGroupActions(strActionUrl, text,
								grid, arrSelectedRecords,
								strActionType, strAction);
				}
			}
		});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {		
		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var me = this;
			if (!Ext.isEmpty(grid)) {
				var arrayJson = new Array();
				var records = (arrSelectedRecords || []);
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : grid.getStore()
										.indexOf(records[index])
										+ 1,
								identifier : records[index].data.identifier,
								userMessage : remark
							});
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				groupView.setLoading(true);
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								groupView.setLoading(false);
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								if(jsonRes != null && jsonRes.d != null && jsonRes.d.instrumentActions && 
										   jsonRes.d.instrumentActions[0] != null  &&
										   jsonRes.d.instrumentActions[0].errors != null)
								{
									var errorMsg = jsonRes.d.instrumentActions[0].errors[1].errorMessage;
								}
							 if(errorMsg != 'undefined' && errorMsg != null && errorMsg != '')
								{
									Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg  : errorMsg,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
								}
							 if(jsonRes != null && jsonRes.d != null && !jsonRes.d.auth )
								me.refreshData();
							},
							failure : function() {
								var errMsg = "";
								groupView.setLoading(false);
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		}
	},
	handleRequest : function(strUrl, remark ,identifier) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			arrayJson.push({
						serialNo    :  1 + 1,
						identifier  : identifier,
						userMessage :  remark
					});
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							groupView.handleGroupActionsVisibility(me.strDefaultMask);
							me.refreshData();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
		
	},
	hidePayRtnBtn : function(record, btnPay, btnReturn) {
		
		var me = this;
		var maskArray = new Array();
		var groupView = me.getGroupView();
		var grid = groupView.getGrid()
		var store = grid.getStore();
		var jsonData = store.proxy.reader.jsonData;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		
			tempMaskArray = record.data.__metadata.__rightsMap;
			if( record.raw.exceptionReasonCode == '0' )
			{
				tempMaskArray = me.setCharAt( tempMaskArray, 2, "0" );
				tempMaskArray = me.setCharAt( tempMaskArray, 3, "0" );
			}
		
		maskArray.push(tempMaskArray);
		actionMask = doAndOperation(maskArray, 8);
		
		retValue = isActionEnabled(actionMask, 2);
		if(!retValue)
		{
			
			btnPay.hide();
		}
		else
		{
			
			btnPay.show();
		}
		retValue = isActionEnabled(actionMask, 3);
		if(!retValue)
		{
			
			btnReturn.hide();
		}
		else
		{
			
			btnReturn.show();
		}
	},
	decision : function(btn) {
		var me = this;
		var strAction =null;
		//me.getChkInquiryRequestPopup().close();
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if(btn === 'btnPay')
			{
			   strAction  = 'pay'
			}
		else
			{
				strAction = 'return';
			}
		if(strAction === 'return')
			{
			//me.viewReturnDecisionPopUp();
			showReturnReasonPopUp(me.gridViewSelectedRecord[0].type);
			}
		else
		{
		var strUrl = Ext.String.format('{0}List/{1}.srvc',	me.selectedPPay, strAction);
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
					arrayJson.push({
							serialNo : 1,
							identifier : id
							//userMessage : remark
						});
			
			
			groupView.setLoading(true);
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(jsonData) {
							var jsonRes = Ext.JSON
									.decode(jsonData.responseText);
							groupView.setLoading(false);
							$('#positivePayView').dialog('close');
							me.refreshData();
						},
						failure : function() {
							var errMsg = "";
							groupView.setLoading(false);
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	 }
	},
	showReport : function(){
		var me = this;
		var reportType = 'posPayExceptionDetailReport';	
		var identifier = id;
		var strUrl = 'services/positivePay/getDynamicReport.pdf';
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'$reportType', reportType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'$identifier', identifier));	
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 9;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);

		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);

		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		}
		return retValue;
	},
	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'positivePayFilterView-1130_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var paymentTypeVal = '';							
							var dateFilter = me.dateFilterLabel;

							if (me.filterApplied == 'ALL') {
								paymentTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else {
								paymentTypeVal = me.accTypeFilterDesc;
								
							}

							
							var advfilter = me.showAdvFilterCode;
							if (advfilter == '' || advfilter == null)
							{
								advfilter = getLabel('none', 'None');
							}
							

							tip.update('Account'
									+ ' : ' + paymentTypeVal + '<br/>'									
									+getLabel('advancedFilter', 'Advance Filter') + ':'
									+ advfilter);
						}
					}
				});
	},
	toggleSavePrefrenceAction : function(isVisible) {
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
	},	
	closeViewInfoPopup : function(btn){
			var me = this;
			me.getPositivePayInfoRef().close();
	},
	closeBeneInfoPopup : function(btn){
			var me = this;
			me.getPositivePayBeneInfoRef().close();
	},
	closeEditPopup : function(btn){
		var me = this;
		me.getPositivePayGridEditInfo().close();
	},
	
	handleReturnReasonStatus : function(){
		var me = this;
		var strUrl = Ext.String.format('{0}List/{1}.srvc',	me.selectedPPay, 'return');
		var returnReason  = $("select[id='decisionReasons']").val();
		if(returnReason == '&lt;') {
			returnReason = Ext.String.htmlDecode('&lt;')
		} else
		if(returnReason == '&gt;') {
			returnReason = Ext.String.htmlDecode('&gt;')
		}
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			if( me.isSingleRecordViewAction == true )
			{
				var records = me.gridViewSelectedRecord;
				me.isSingleRecordViewAction = false;
			}
			else
			{
				var records = me.gridSelectedRecords;
			}
			
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : records[index].serialNo + 1,
							identifier : records[index].identifier,
							userMessage : returnReason
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {

							groupView.setLoading(false);
							var jsonRes = Ext.JSON
							.decode(response.responseText);
							if(jsonRes != null && jsonRes.d != null && jsonRes.d.instrumentActions && 
									   jsonRes.d.instrumentActions[0] != null  &&
									   jsonRes.d.instrumentActions[0].errors != null)
							{
								var errorMsg = jsonRes.d.instrumentActions[0].errors[1].errorMessage;
							}
						 if(errorMsg != 'undefined' && errorMsg != null && errorMsg != '')
							{
								Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg  : errorMsg,
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
							}
							groupView.handleGroupActionsVisibility(me.strDefaultMask);
							if(jsonRes != null && jsonRes.d != null && !jsonRes.d.auth )
							me.refreshData();
							$('#returnReasonPopUp').dialog('close');
							//me.closeReturnReasonPopUp();
							//me.getPositivePayInfoRef().close();
							$('#positivePayView').dialog('close');
							arrayJson = new Array();
						},
						failure : function() {
							var errMsg = "";
							me.getPositivePayInfoRef().close();
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
							arrayJson = new Array();

						}
					});
		}
	},
	closeReturnReasonPopUp : function(btn){
		var me = this;
		me.getRetunDecisionsPopUpRef().close();
	},
	handleBeneStatusUpdate : function(btn)
	{
		var me = this;
		var strUrl = null;
		var decisionNmbr  = $("#decisionNmbr").val();
		var bdFromBeneAmt = $("#beneAmount").val();
		if(!Ext.isEmpty(bdFromBeneAmt) && bdFromBeneAmt.indexOf("$") != -1)
		{
			bdFromBeneAmt = bdFromBeneAmt.substring(1,bdFromBeneAmt.length+1);
		}
		var beneAccNmbr   = $("#beneAccountNmbr").val();
		
		var form, inputField;
		strUrl = 'positivePayWhitelistBeneUpdate.srvc';
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'decisionNmbr',	decisionNmbr));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'amountType', '1'));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'fromBeneAmount', bdFromBeneAmt));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'beneAccountNmbr', beneAccNmbr));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	applyFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = 'positivePayList.srvc';
			var strUrl = me.generateUrl(strUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue+this.filterSeller;
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null, null, me);
		}
	},
	applyQuickFilter : function() {
		var me = this;	
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		
		me.filterApplied = 'Q';
		objGroupView.setFilterToolTip('');
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		
		me.refreshData();
		/*if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = 'positivePayList.srvc';
			var strUrl = me.generateUrl(strUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue+this.filterSeller;
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null, null, me);
		}*/
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
			me.disablePreferencesButton("savePrefMenuBtn",true);
			me.disablePreferencesButton("clearPrefMenuBtn",false);		
		}
	},
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
								'sortState' : gridState.sortState,
								'gridSetting' : groupView.getGroupViewState().gridSetting
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
	handleClearPreferences : function() {
		var me = this;
		//me.toggleSavePrefrenceAction(false);
		if ($("#clearPrefMenuBtn").attr('disabled'))
			event.preventDefault();
		else{
			me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",true);
		}	
	},
	
	isInCondition : function(data) {
		var retValue = false;
		var displayType = data.displayType;
		var strValue = data.value1;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		if (displayType && displayType === 4 && strValue && strValue.match(reg)) {
			retValue = true;
		}

		return retValue;

	},
	getFilterPreferences:function(){
		var me=this;
		var advFilterCode = null;
		var objFilterPref = {};		
		//var filterViewCollapsed = (me.getFilterView().getCollapsed() === false) ? false : true; 		
		if (!Ext.isEmpty(me.savedFilterVal)) {
			advFilterCode = me.savedFilterVal;
		}
		var objQuickFilterPref = {};		
		objQuickFilterPref.accountId = me.accTypeFilterVal;
		objQuickFilterPref.clientId = me.clientFilterVal;
		objQuickFilterPref.clientDesc = me.clientFilterDesc;
		

		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = objQuickFilterPref;
		
		return objFilterPref;
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
	/*handleTypeLoading : function(panel) {
		var me = this;
		var strUrlAll = 'positivePayList.srvc?';
		var strUrl = strUrlAll + '$filter=' +'&'+csrfTokenName+'='+csrfTokenValue;
		Ext.Ajax.request({
					url : strUrl,
					method : "GET",
					success : function(response) {
						me.loadChkTypes(Ext.decode(response.responseText));
					},
					failure : function(response) {
						console.log('Error Occured');
					}
				});
	},
	loadChkTypes : function(data) {
		var me = this;
		var objTbar = me.getPositivePayTypeToolBar();
		var arrItem;

		if (!Ext.isEmpty(objTbar)) {
			var tbarItems = objTbar.items;
			if (!Ext.isEmpty(tbarItems)) {
				if (tbarItems.length > 0)
					tbarItems.each(function(item, index, length) {
								if (index > 0)
									objTbar.remove(item);
							});
			}
			
			if (data.d.positivePay) {
				var positivePayType = data.d.positivePay;
				
				var countlength = '';
				if(positivePayType.length >  2)
					countlength = 2;
				else
					countlength = positivePayType.length;
				

					for (var i = 0; i < countlength; i++) {
						var cnt = positivePayType[i].count;
						
					var strCls = '';
					if (me.typeFilterVal !== 'all'
						&& me.typeFilterVal === positivePayType[i].requestType) {
					if (objTbar.down('button[btnId="allPaymentType"]'))
						objTbar.down('button[btnId="allPaymentType"]')
								.removeCls('xn-custom-heighlight')
					strCls = 'xn-custom-heighlight';
				}
				else
				{
					if (objTbar.down('button[btnId="allPaymentType"]'))
						objTbar.down('button[btnId="allPaymentType"]')
								.addCls('xn-account-filter-btnmenu')
					strCls = 'xn-account-filter-btnmenu';
				}
		     }	
		}
	}
	},*/	
	handleEditIconClick : function()
	{
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var strUrl = 'positivePayUpdate.srvc?';
		var objCreateViewInfoPanel = me.getPositivePayGridViewInfoDtlRef();
		var decision = objCreateViewInfoPanel.down('textfield[itemId="decision"]').getValue();
		var decisionNmbr = objCreateViewInfoPanel.down( 'hidden[itemId="decisionNumber"]' ).getValue();
		if(decision !== "")
		{
			strUrl = 'positivePayUpdate.srvc?$decisionNumber='+ decisionNmbr +'&$decision='+ decision + '&' + csrfTokenName + "="+ csrfTokenValue;
			Ext.Ajax.request({
				url : strUrl,
				method : "POST",
				success : function(response) {
					me.getPositivePayInfoRef().close();
					grid.refreshData();
				},
				failure : function(response) {
					console.log('Error Occured');
				}
			});
		}
		
	},
	handleViewActions : function(btn)
	{
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName) ? btn.actionName : btn.itemId;
		var strUrl = Ext.String.format('{0}List/{1}.srvc',	me.selectedPPay, strAction);
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var objCreateViewInfoPanel = me.getPositivePayGridViewInfoDtlRef();
		var identifier = objCreateViewInfoPanel.down( 'hidden[itemId="identifierVal"]' ).getValue();
		
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
				arrayJson.push({
							serialNo : 0,
							identifier : identifier
						});
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							me.getPositivePayInfoRef().close();
							grid.refreshData();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},
	setCcyComboListVal : function()
	{
		var me = this;
		var field = 'beneCcy';
		var defaultValue = 'Select';
		var currencyRef = me.getCurrencyRef();
		var objStore = null;
		var strDisplayField, strValueField;
		if (currencyCodesList && currencyCodesList.length > 0) {
			objStore = Ext.create('Ext.data.Store', {
					fields : ['code', 'description'],
					autoLoad : true,
					data : currencyCodesList && currencyCodesList.length > 0
							? currencyCodesList
							: []
					});
			strDisplayField = 'description';
			strValueField = 'code';
		}
		var field = Ext.create('Ext.form.field.ComboBox', {
					displayField : strDisplayField,
					width : '135',
					fieldCls :'xn-form-field' ,
					triggerBaseCls : 'xn-form-trigger',
					valueField : strDisplayField,
					itemId : field,
					name : field,
					editable : false,											
					value : defaultValue ? defaultValue : '',
					defValue : defaultValue ? defaultValue : '',
					store : objStore,
					padding : '0 8 0 95'
				});
		currencyRef.add(field);
	},
	handleBeneIconClickPopUp : function(beneName,beneAccountNmbr,amountType,fromBeneAmount,toBeneAmount,beneCcy,identifier)
	{
		var me=this;
		me.viewBeneInfo(beneName,beneAccountNmbr,amountType,fromBeneAmount,toBeneAmount,beneCcy,identifier);
	},	
	
	populateDepositImage : function( imageNmbr, side, recIdentifier )
	{
		var me = this;
		if(daejaViewONESupport)
		{
			me.showDepositImageDaejaViewONE(imageNmbr, side, recIdentifier);
		}
		else
		{
			me.showDepositImageJqueryPopup(imageNmbr, side, recIdentifier);
		}
	},
	
	showDepositImageDaejaViewONE : function( imageNmbr, side, recIdentifier )
	{
		$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
		var me = this;
		var strUrl = 'positivePayList/getCheckImage.srvc?$isDaejaViewer=Y&$imageNmbr=' + imageNmbr + '&' + csrfTokenName + "="+ csrfTokenValue+'&$side='+side
		 + '&identifier=' + Ext.encode(recIdentifier);
		
		if(document.getElementById("viewONE"))
		{
			document.getElementById("viewONE").setView(3);
			document.getElementById("viewONE").openFile(strUrl, 1);
		}
		else
		{
			addViewer('depImageDiv', strUrl);
		}
		$( '#depImageDiv' ).dialog(
		{
			autoOpen : false,
			height : "800",
			modal : true,
			resizable : true,
			width : "1000",
			title : getLabel('image', 'Image'),
			position: 'center',
			buttons :
			[{
				text : "Close",
				"class": 'pull-left ft-button-light',
				click : function()
				{
					$( this ).dialog( "close" );
				}
			}]
		} );
		$( '#depImageDiv' ).dialog( 'open' );
	},
	
	showDepositImageJqueryPopup : function( imageNmbr, side, recIdentifier )
	{
		//$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
		var me = this;
		var groupView = me.getGroupView();
		groupView.setLoading(true);

		var strUrl = 'positivePayList/getCheckImage.srvc?$imageNmbr=' + imageNmbr + '&' + csrfTokenName + "="+ csrfTokenValue+'&$side='+side
		 + '&identifier=' + Ext.encode(recIdentifier);
		$.ajax(
		{
			type : 'POST',
			//data : JSON.stringify( arrayJson ),
			url : strUrl,
			//contentType : "application/json",
			dataType : 'html',
			success : function( data )
			{
				//$.unblockUI();
				groupView.setLoading(false);
				var $response = $( data );

				if( $response.find( '#imageAppletDiv' ).length == 0 )
				{
					$( '#depImageDiv' ).html( '<img src="data:image/jpeg;base64,' + data + '"/>' );
				}
				else
				{
					$( '#depImageDiv' ).html( $response.find( '#imageAppletDiv' ) );
				}

				$( '#depImageDiv' ).dialog(
				{
					bgiframe : true,
					autoOpen : false,
					height : "700",
					modal : true,
					resizable : true,
					width : "1200",
					title : getLabel('image', 'Image'),
					buttons :
					{
						"Cancel" : function()
						{
							$( this ).dialog( "close" );
						},
						"Flip Over" : function()
						{
							if(modelBytes=='Front')
							{
								$( this ).dialog( "close" );
								me.populateDepositImage( imageNmbr, 'B', Ext.encode(recIdentifier) );
								modelBytes = 'Back';
							 }
							 else
							 {
								$( this ).dialog( "close" );
								me.populateDepositImage( imageNmbr, 'F', Ext.encode(recIdentifier) );
								modelBytes = 'Front';
							 }
						},
						"Print" : function()
						{
							var strFrontUrl = 'positivePayList/getCheckImage.srvc?$imageNmbr=' + imageNmbr + '&' + csrfTokenName + "="+ csrfTokenValue+'&$side=F'
							 + '&identifier=' + Ext.encode(recIdentifier);
							var strBackUrl = 'positivePayList/getCheckImage.srvc?$imageNmbr=' + imageNmbr + '&' + csrfTokenName + "="+ csrfTokenValue+'&$side=B'
							 + '&identifier=' + Ext.encode(recIdentifier);
							printFrontImage(strFrontUrl,strBackUrl);
						}
					},
					open : function()
					{
						$('.ui-dialog-buttonpane').find('button:contains("Print")').css('color','#4a4a4a')
						.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a');
						$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').css('color','#4a4a4a')
						.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a');
					}
				} );
				$( '#dialogMode' ).val( '1' );
				$( '#depImageDiv' ).dialog( 'open' );
			},
			error : function( request, status, error )
			{
				//$.unblockUI();
				groupView.setLoading(false);
				$( '#depImageDiv' ).html( '<img src="./static/images/misc/no_image.jpg"/>' );
				$( '#depImageDiv' ).dialog(
				{
					bgiframe : true,
					autoOpen : false,
					height : "300",
					modal : true,
					resizable : true,
					width : "285",
					zIndex: '29001',				
					title : getLabel('image', 'Image'),
					buttons : 
					{
						"Cancel" : function()
						{
							$( this ).dialog( "close" );
						}
					}
				} );
				$( '#dialogMode' ).val( '1' );
				$( '#depImageDiv' ).dialog( 'open' );
			}
		} );
	},
	
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
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
		var temp = new Array();
		var counter = 0;
		var objOfSelectedGridRecord = null, objOfGridSelected = null;
		var groupView = me.getGroupView();
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		
		strExtension = arrExtension[actionName];
		strUrl = 'services/positivePay/getDynamicReport.' + strExtension;
		strUrl += '?$skip=1';
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue+this.filterSeller;
		var strOrderBy = me.reportGridOrder;
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
		var groupView = me.getGroupView();
		
		 var arrSelectedrecordsId = [];
	        if (!Ext.isEmpty(groupView))
	            grid = groupView.getGrid();

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
		
		// cnt counter startes with 2 as 0th and 1st column are action columns. (not GRID columns)
		for (var cnt = 1; cnt < grid.columns.length ; cnt ++)
		{
			if( grid.columns[cnt].hidden == false )
			{
				temp[counter++] = grid.columns[cnt];
			}
		}
		viscols = temp;
		for (var j = 0; j < viscols.length; j++) {
			col = viscols[j];
			if (col.dataIndex && arrSortColumn[col.dataIndex]) {
				if (colMap[arrSortColumn[col.dataIndex]]) {
				} else {
					colMap[arrSortColumn[col.dataIndex]] = 1;
					colArray.push(arrSortColumn[col.dataIndex]);
				}
			}
		}
		if (colMap != null) {

			visColsStr = visColsStr + colArray.toString();
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
		 for(var i=0; i<arrSelectedrecordsId.length; i++){
	            form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier',
	                    arrSelectedrecordsId[i]));
	        }    
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
		},
	createReturnDecisionCombo : function()
	{
		var me = this;
		var field = 'decExceptionReason';
		var defaultValue = 'Select';
		var width = "200";
		var fieldCls = 'xn-form-field w14 inline_block';
		var padding =  '10 20 15 0';
		var objReturnDecisionPanel = me.getRetunDecisionsRef();
		var itemArray =me.createComboField(field, defaultValue,width,fieldCls,padding, arrDecisionReasons);
		objReturnDecisionPanel.add(itemArray);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	pushRightsMap : function(rightsMap,makerId ,buttonMask,identifier,decision,rowIndex,isChecked)
	{
		var me = this;
		var recordIndex = null;
		/*if(!Ext.isEmpty(decision) && decision === 'P')
		{
			rightsMap = "0" + rightsMap.substr(1,8) ;
		}
		else if(decision === 'R')
		{
			rightsMap = rightsMap.substr(1,1) + 0 +rightsMap.substr(2,8) ;
		}*/
		if(isChecked)
		{
			me.gridSelectedRecords.push(
			{
				rowRightsMap : rightsMap,
				rowMakerId : makerId,
				rowIdentifier : identifier,
				rowIndex : rowIndex
			});
		}
		else
		{
			for( var index = 0 ; index < me.gridSelectedRecords.length ; index++ )
			{
				recordIndex = me.gridSelectedRecords[ index ];
				if(recordIndex.rowIndex === rowIndex)
				{
					me.gridSelectedRecords.splice(index , 1);
				}
			}
		}
		me.getSelectedRecordsId(me.gridSelectedRecords,buttonMask)
	},
	
	getSelectedRecordsId : function(selectedRecords,buttonMask)
	{
		var me = this;
		var maskSize = 9;
		var maskArray = new Array(), actionMask = '', objData = null;
		var groupView = me.getGroupView();
		var isSameUser = true;
		maskArray.push( buttonMask );
		for( var index = 0 ; index < selectedRecords.length ; index++ )
		{
			objData = selectedRecords[ index ];
			maskArray.push( objData.rowRightsMap );
			if( objData.rowMakerId === USER )
			{
				isSameUser = false;
			}
		}
		actionMask = doAndOperation( maskArray, maskSize );
		//me.enableDisableGroupActions( actionMask, isSameUser );
		groupView.handleGroupActionsVisibility(actionMask);
	},
	refreshData : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		var oldPageNum = 1;
		var current = 1;
		groupView.refreshData();		
	},
	
	disableDecision : function()
	{
		var me = this;
		//me.getDecisionTypeToolBar().hide();
	},
	updateFilterConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		var arrJsn = new Array(),advFilterCode;
		if (!Ext.isEmpty(objPreference)) {
			var objJsonData = Ext.decode(objPreference);
			var data = objJsonData.d.preferences.gridViewFilter;
			if( data != 'undefined' && !Ext.isEmpty(data)){
				var quickFilterClient = data.quickFilter.clientId;			
				var quickFilterAccount = data.quickFilter.accountId;	
				var quickFilterClientDesc=data.quickFilter.clientDesc;
				
				me.accTypeFilterVal = !Ext.isEmpty( quickFilterAccount ) ? quickFilterAccount : 'All';
				me.clientFilterVal = !Ext.isEmpty( quickFilterClient ) ? quickFilterClient : 'all';
				me.savedFilterVal = data.advFilterCode;
				me.clientFilterDesc=quickFilterClientDesc;
				if (entityType == '1') {
					$("#summaryClientFilterSpan").text(me.clientFilterDesc);
				}else if(entityType=='0'){
					$("#summaryClientFilter").val(me.clientFilterDesc);
				}
			}
		}
		if(!Ext.isEmpty(me.accTypeFilterVal) && me.accTypeFilterVal != 'All')
		{
			arrJsn.push({
				    paramName : 'accountId',
				    operatorValue : 'eq',
					paramValue1 : me.accTypeFilterVal,
					dataType :'S'
			});
		}
		if (!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal != 'all') {
			arrJsn.push({
						paramName : 'clientCode',
						paramValue1 : me.clientFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(me.savedFilterVal)) {
				me.doHandleSavedFilterItemClick(me.savedFilterVal);
				
		}
		me.filterApplied = 'Q';
		me.filterData = arrJsn;
	}, 					
	/*handleFilterItemClick : function( filterCode, btn )
	{

		var me = this;
		var objToolbar = me.getAdvFilterActionToolBar();

		objToolbar.items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
		} );
		if(null!=btn)
			btn.addCls( 'xn-custom-heighlight' );

		if( !Ext.isEmpty( filterCode ) )
		{
			var applyAdvFilter = true;
			this.getSavedFilterData( filterCode, this.populateSavedFilter, applyAdvFilter );
		}

		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		//me.toggleSavePrefrenceAction( true );
		//me.toggleClearPrefrenceAction(true);
	},*/
	searchActionClicked : function(me) {
		var me = this, objGroupView = null,savedFilterCombobox = me.getPositivePayFilter().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		} else {
			me.doSearchOnly();
			if(savedFilterCombobox)
				savedFilterCombobox.setValue('');
			objGroupView = me.getGroupView();
			objGroupView.setFilterToolTip('');
			$('#advancedFilterPopup').dialog('close');
		}
	},
		
	saveAndSearchActionClicked : function(me) {
		me.handleSaveAndSearchAction();
	},	
	postDoSaveAndSearch : function()
	{
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
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
	

	doSearchOnly : function()
	{
		var me = this;
		
		var accChangedValue = $("#accountSelect").getMultiSelectValue();
		var accValueDesc = [];
		$('#accountSelect :selected').each(function(i, selected){
			accValueDesc[i] = $(selected).text();
		});
		
		me.handleAccountFieldSync('A', accChangedValue,accValueDesc.toString());
		me.applyAdvancedFilter();
	},
	
	applyAdvancedFilter : function(filterData)
	{
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
	//	me.applyFilter();
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
		
	},	
	handleSaveAndSearchAction : function( btn )
	{
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal=null;
		var FilterCode = $("#savedFilterAs").val();
		
			if(Ext.isEmpty(FilterCode)){
				paintError('#advancedFilterErrorDiv','#advancedFilterErrorMessage',getLabel('filternameMsg','Please Enter Filter Name'));
				return;
			}else{
				hideErrorPanel("#advancedFilterErrorDiv");
				me.filterCodeValue=FilterCode;
				strFilterCodeVal=me.filterCodeValue;
			}	
		me.savePrefAdvFilterCode = strFilterCodeVal;
				
		hideErrorPanel("#advancedFilterErrorDiv");
		me.postSaveFilterRequest(me.filterCodeValue, callBack);
		
	},
		
	postSaveFilterRequest : function( FilterCodeVal, fncallBack )
	{
		var me = this;
		var strUrl = 'userfilters/positivepayFilter/{0}.srvc';
		strUrl = Ext.String.format( strUrl, FilterCodeVal );
		var objJson = getAdvancedFilterValueJson(FilterCodeVal);
		Ext.Ajax.request(
		{
			url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
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
						buttons : Ext.MessageBox.OK,
						icon : imgIcon
					} );

				}

				if( FilterCodeVal && isSuccess && isSuccess === 'Y' )
				{
					$('#advancedFilterPopup').dialog('close');
					fncallBack.call(me);
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
	
	handleMandatoryFilterName : function(){
		var objSaveFilterChkBoxLbl = $("#savedFilterAsLbl");
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
		if (objSaveFilterChkBoxLbl && SaveFilterChkBoxVal === true) {
			objSaveFilterChkBoxLbl.addClass('required');
		}
		else if(objSaveFilterChkBoxLbl && SaveFilterChkBoxVal !== true){
			objSaveFilterChkBoxLbl.removeClass('required');
		}
	},
	
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		setActionStatusMenuItems('actionStatus');
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
		me.handleMandatoryFilterName();
	},

	/*reloadGridRawData : function()
	{
		var me = this;
		var strUrl = 'userfilterslist/positivepayFilter.srvc?';
		var gridView = me.getAdvFilterGridView();
		Ext.Ajax.request(
		{
			url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
				gridView.store.loadRawData( arrJson );
				me.addAllSavedFilterCodeToView( decodedJson.d.filters );
			},
			failure : function( response )
			{
				// console.log("Ajax Get data Call Failed");
			}
		} );
	},
	handleRangeFieldsShowHide : function( objShow )
	{
		var me = this;

		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var toobj = objCreateNewFilterPanel.down( 'numberfield[itemId="toAmt"]' );
		var tolabelObj = objCreateNewFilterPanel.down( 'label[itemId="Tolabel"]' );
		if( toobj && tolabelObj )
		{
			if( objShow )
			{
				toobj.show();
				tolabelObj.show();
			}
			else
			{
				toobj.hide();
				tolabelObj.hide();
			}
		}
	},*/
	orderUpDown : function( grid, rowIndex, direction )
	{
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
	deleteFilterSet : function( filterCode )
	{
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objField =me.getPositivePayFilter().down('combo[itemId="quickFilterAccountCombo"]');
		var objComboStore=null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
			
		me.filterCodeValue = null;

		if (me.savePrefAdvFilterCode == objFilterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}

		if (savedFilterCombobox) {
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
			savedFilterCombobox.setValue('');
		}
		
		if(!Ext.isEmpty(objField)){
			objField.selectAllValues();
			me.accTypeFilterVal = 'All';
		}
			resetAllMenuItemsInMultiSelect("#accountSelect");
			resetAllMenuItemsInMultiSelect("#actionStatus");
			if(achPositivePay == 'true' )
			{
				resetAllMenuItemsInMultiSelect("#secCode");
				resetAllMenuItemsInMultiSelect("#txnType");
			}
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb();
	},
	
	deleteFilterCodeFromDb : function( objFilterName, store)
	{
		var me = this;
		if( !Ext.isEmpty( objFilterName ) )
		{
			var strUrl = 'userfilters/positivepayFilter/{0}/remove.srvc?' + csrfTokenName + '=' + csrfTokenValue;
			strUrl = Ext.String.format( strUrl, objFilterName );

			Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				success : function( response ) {
					
				},
				failure : function( response )
				{
					console.log( "Error Occured" );
				}
			} );
		}
	},

	sendUpdatedOrderJsonToDb : function(  )
	{
		var me = this;
		var objJson = {};
		var FiterArray = [];
		
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
				
		objJson.filters = FiterArray;
		Ext.Ajax.request(
		{
			url : 'userpreferences/positivepay/advanceFilterOrderList.srvc?' + csrfTokenName + '='
				+ csrfTokenValue,
			method : 'POST',
			jsonData : objJson,
			async : false,
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
		
	/*updateAdvActionToolbar : function()
	{
		var me = this;
		Ext.Ajax.request(
		{
			url : 'userpreferences/positivepay/positivepayGridViewAdvanceFilter.srvc?' + csrfTokenName + '='
				+ csrfTokenValue,
			method : 'GET',			
			success : function( response )
			{
				var responseData = Ext.decode( response.responseText );

				var filters = JSON.parse( responseData.preference );

				me.addAllSavedFilterCodeToView( filters.filters );

			},
			failure : function()
			{
				console.log( "Error Occured - Addition Failed" );

			}

		} );
	},*/
	viewFilterData : function( grid, rowIndex )
	{
		var me = this;
		me.resetAllFields();
		me.filterCodeValue=null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		me.getSavedFilterData(filterCode, this.populateSavedFilter, applyAdvFilter);
		changeAdvancedFilterTab(1);		
	},
	editFilterData : function( grid, rowIndex )
	{

		var me = this;
		me.resetAllFields();
		me.filterCodeValue=null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(filterCode);
			filterCodeRef.prop('disabled', true);
		}
		var applyAdvFilter = false;

		me.filterCodeValue = filterCode;

		me.getSavedFilterData(filterCode, this.populateSavedFilter, applyAdvFilter);
		changeAdvancedFilterTab(1);

	},
	getSavedFilterData : function( filterCode, fnCallback, applyAdvFilter )
	{
		var me = this;		
		var objJson;
		var strUrl = 'userfilters/positivepayFilter/{0}.srvc';
		strUrl = Ext.String.format( strUrl, filterCode );
		Ext.Ajax.request(
		{
			url : strUrl,
			headers: objHdrCsrfParams,
			method : 'GET',
			async : false,
			success : function( response )
			{
				if (!Ext.isEmpty(response)
								&& !Ext.isEmpty(response.responseText)) {
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
	
	/*populateAndDisableSavedFilter : function( filterCode, filterData, applyAdvFilter )
	{

		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		for( i = 0 ; i < filterData.filterBy.length ; i++ )
		{
			var fieldName = filterData.filterBy[ i ].field;

			var fieldVal = filterData.filterBy[ i ].value1;

			var fieldOper = filterData.filterBy[ i ].operator;

			if( fieldOper != 'eq' )
			{
				objCreateNewFilterPanel.down( 'combobox[itemId="rangeCombo"]' ).setValue( fieldOper );
			}

			if( fieldName === 'receiverName' || fieldName === 'checkNmbr'  || fieldName === 'decision')
			{
				var fieldType = 'textfield';
			}
			else if( fieldName === 'amount' )
			{
				var fieldType = 'numberfield';
			}
			else if(fieldName === 'accountNmbr')
			{
				var fieldType = 'combobox';
			}			


			var fieldObj = objCreateNewFilterPanel.down( '' + fieldType + '[itemId="' + fieldName + '"]' );

			fieldObj.setValue( fieldVal );

		}

	},*/
	// This function will called only once
	updateAdvFilterConfig : function()
	{	
		var me = this;
		if (!Ext.isEmpty(objPreference)) {
			var objJsonData = Ext.decode(objGridViewFilter);
			
			var advFilterCode = objJsonData.advFilterCode;
			if (!Ext.isEmpty(advFilterCode)) {
				me.doHandleSavedFilterItemClick(advFilterCode);
			}
		}
		
		/*var me = this;
		if( !Ext.isEmpty( objGridViewFilter ) )
		{
			var data = Ext.decode( objGridViewFilter );
			if( !Ext.isEmpty( data.advFilterCode ) )
			{
				me.showAdvFilterCode = data.advFilterCode;
				me.savePrefAdvFilterCode = data.advFilterCode;
				var strUrl = 'userfilters/positivepayFilter/{0}.srvc';
				strUrl = Ext.String.format( strUrl, data.advFilterCode );
				Ext.Ajax.request(
				{
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
					async : false,
					method : 'GET',					
					success : function( response )
					{
						if(!Ext.isEmpty(response.responseText))
						{
							var responseData = Ext.decode( response.responseText );

							var applyAdvFilter = false;
							me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
							var objOfCreateNewFilter = me.getCreateNewFilter();
							var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );

							me.advFilterData = objJson;
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
			}
		}
		*/
	},
	populateSavedFilter : function( filterCode, filterData, applyAdvFilter )
	{
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
		advFilterSelectedClients = "";
		setActionStatusMenuItems('actionStatus');
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if (fieldName === 'accountNumber') {
				me.checkUnCheckMenuItems(fieldName, fieldVal);
				advFilterSelectedClients = fieldVal;
			}
			else if (fieldName === 'checkdate') {
				me.setSavedFilterDates(fieldName, currentFilterData);
			}
			else if (fieldName === 'checkNmbr') {
				$("#checkNmbr").val(fieldVal);
			} 
			else if (fieldName === 'decision') {
				$("#decision").val(fieldVal);
			}
			else if (fieldName === 'status') 
			{			
				//$("#actionStatus").val(fieldVal);
				me.checkUnCheckMenuItems(fieldName, fieldVal);
			}			
			else if (fieldName === 'amount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
			}
			else if (fieldName === 'receiverName') {
				$("#payeeText").val(fieldVal);
			}
			else if(fieldName == 'secCode' || fieldName == 'txnType')
			{
				me.checkUnCheckMenuItems(fieldName, fieldVal);
			}
			else if (fieldName === 'clientId') 
			{			
				me.checkUnCheckMenuItems(fieldName, fieldVal);
			}
		}
		
		if (!Ext.isEmpty(filterCode)) {
			$('#savedFilterAs').val(filterCode);
			$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
			$("#msSavedFilter").multiselect("refresh");
			var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
			saveFilterChkBox.prop('checked', true);
		}

		if (applyAdvFilter) {
			me.showAdvFilterCode = filterCode;
			me.applyAdvancedFilter(filterData);
		}
	},
	/*getAllSavedAdvFilterCode : function( panel )
	{
		var me = this;
		Ext.Ajax.request(
		{
			url : 'userfilterslist/positivepayFilter.srvc?' + csrfTokenName + '=' + csrfTokenValue,
			method : 'GET',
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
	addAllSavedFilterCodeToView : function( arrFilters )
	{
		var me = this;
		var objToolbar = this.getAdvFilterActionToolBar();

		if( objToolbar.items && objToolbar.items.length > 0 )
			objToolbar.removeAll();

		if( arrFilters && arrFilters.length > 0 )
		{

			var toolBarItems = [];
			var item;
			for( var i = 0 ; i < 2 ; i++ )
			{

				item = Ext.create( 'Ext.Button',
				{
					cls : 'cursor_pointer xn-account-filter-btnmenu',
					text : arrFilters[ i ],
					itemId : arrFilters[ i ],
					handler : function( btn, opts )
					{
						objToolbar.fireEvent( 'handleSavedFilterItemClick', btn.itemId, btn );
					}
				} );
				toolBarItems.push( item );
			}
			item = Ext.create( 'Ext.Button',
			{
				cls : 'cursor_pointer xn-account-filter-btnmenu',
				text : '<span class="button_underline">' + getLabel( 'moreText', 'more' ) + '>></span>',
				itemId : 'AdvMoreBtn',
				handler : function( btn, opts )
				{
					me.handleMoreAdvFilterSet( btn.itemId );
				}
			} );
			toolBarItems.push( '-' );
			toolBarItems.push( item );
			objToolbar.removeAll();
			objToolbar.add( toolBarItems );
		}
	},
	handleMoreAdvFilterSet : function( btnId )
	{
		var me = this;
		if( !Ext.isEmpty( me.objAdvFilterPopup ) )
		{
			me.objAdvFilterPopup.show();
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab( 0 );
			var filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
		}
		else
		{
			me.objAdvFilterPopup = Ext.create( 'GCP.view.PositivePayAdvancedFilterPopup' );
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab( 0 );
			me.objAdvFilterPopup.show();
			var filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle( getLabel( 'filterDetails', 'Filter Details' ) );
		}
	},*/
	generateUrlWithAdvancedFilterParams : function( me )
	{
		var thisClass = this;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = false;
		var isOrderByApplied = false;
		var strFilter = '';
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
					&& ( operator === 'bt' || operator === 'eq' || operator === 'lk' || operator === 'gt' || operator === 'lt' ) )
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
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						objValue = decodeURIComponent(objValue);
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
		if( isFilterApplied )
		{
			strFilter = strFilter + strTemp;
		}
		else if( isOrderByApplied )
			strFilter = strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	columnFormatBeforeEdit : function (edit, e)
	{
		var me = this;
		var field = edit.context.field;
		var value = e.record.data.columnFormat;
		var width = "120";
		var fieldCls = 'xn-form-field';
		var padding = '0 0 0 0';
		e.column.setEditor(me.createComboField(field, value, width ,fieldCls,padding,arrDecisionReasons));
		return true;
	},
	decisionColumnFormatBeforeEdit : function (edit, e)
	{
		var me = this;
		var field = edit.context.field;
		var value = e.record.data.columnFormat;
		var width = "120";
		var fieldCls = 'xn-form-field';
		var padding = '0 0 0 0';
		e.column.setEditor(me.createDecisionComboField(field, value, width ,fieldCls,padding));
		return true;
	},
	createDecisionComboField : function(fieldId, defaultValue,width,fieldCls,padding)
	{
		var decisionStore = new Ext.data.SimpleStore({
			  fields: [ "code", "description" ],
			  data: [
			  [ "N", "  None" ],
			  [ "P", "  Pay" ],
			  [ "R", "  Return" ]
			  ]
			});
			
			var field = Ext.create('Ext.form.field.ComboBox', {
					displayField : 'description',
					width : width,
					fieldCls :fieldCls ,
					triggerBaseCls : 'xn-form-trigger',
					valueField : 'code',
					itemId : fieldId,
					name : fieldId,
					editable : false,
					store : decisionStore,
					padding : padding
				});
		return field;
	},
	createComboField : function(fieldId, defaultValue,width,fieldCls,padding, optionsValue)
	{
		var objStore = null;
		var strDisplayField, strValueField;
			if (optionsValue && optionsValue.length > 0) {
				objStore = Ext.create('Ext.data.Store', {
						fields : ['code', 'description'],
						autoLoad : true,
						data : optionsValue && optionsValue.length > 0
								? optionsValue
								: []
						});
				strDisplayField = 'description';
				strValueField = 'code';
			}
		
		var field = Ext.create('Ext.form.field.ComboBox', {
					displayField : strDisplayField,
					width : width,
					fieldCls :fieldCls ,
					triggerBaseCls : 'xn-form-trigger',
					valueField : strValueField,
					itemId : fieldId,
					name : fieldId,
					editable : false,
					store : objStore,
					padding : padding,
					listConfig:{
						tpl: [
			            '<ul><tpl for=".">',
			                '<li role="option" class="x-boundlist-item" data-qtip="{description}">' +
			                '{description}</li>',
			            '</tpl></ul>'
			           ]
				 }
				});
		return field;
	},	
	resetAllFields : function() {
		var me = this;		
		resetAllMenuItemsInMultiSelect("#actionStatus");
		$("#accountSelect" + ' option').prop('selected', false);
		$("#accountSelect").multiselect("refresh");		
		$("#clientSelect" + ' option').prop('selected', false);
		$("#clientSelect").multiselect("refresh");	
		$("#issuanceAdvDate").val("");
		selectedCheckDateFilter={};
		//$("#actionStatus").val("");
		$("#checkNmbr").val("");
		$("#decision").val("");		
		$("#amountOperator").val($("#amountOperator option:first").val());
		$("#amountFieldFrom").val("");		
		$("#payeeText").val("");
		
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
		if( achPositivePay == 'true' )
		{
			$("#secCode"+' option').prop('selected', false);
			$("#secCode").multiselect("refresh");			
			$("#txnType"+' option').prop('selected', false);
			$("#txnType").multiselect("refresh");
		}
		me.handleMandatoryFilterName();
	},
	checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;		

		if (componentName === 'clientId') {
			menuRef = $("select[id='clientSelect']");
			elementId = '#clientSelect';
		}else if (componentName === 'accountNmbr' || componentName === 'accountNumber') {
			menuRef = $("select[id='accountSelect']");
			elementId = '#accountSelect';
		}else if (componentName === 'status') {
			menuRef = $("select[id='actionStatus']");
			elementId = '#actionStatus';
		}else if (componentName === 'secCode') {
			menuRef = $("select[id='secCode']");
			elementId = '#secCode';
		}else if (componentName === 'txnType') {
			menuRef = $("select[id='txnType']");
			elementId = '#txnType';
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
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {

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
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRef = null;
			var dateOperator = data.operator;

			if (dateType === 'checkdate') {
				dateFilterRef = $('#issuanceAdvDate');
			}

			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),strExtApplicationDateFormat);
					$(dateFilterRef).val(formattedFromDate);
				}
			} else if (dateOperator === 'bt') {	
				 var fromDate = data.value1;
				 if (!Ext.isEmpty(fromDate)) { 
					 var formattedFromDate = Ext.Date.parse(fromDate, 'Y-m-d');
					 var toDate = data.value2; 
					 if (!Ext.isEmpty(toDate)) { 
						 var formattedToDate = Ext.Date.parse(toDate, 'Y-m-d');
					 $(dateFilterRef).setDateRangePickerValue([formattedFromDate,formattedToDate]);
					 }
				 }
			}
			if (dateType === 'checkdate') {
					selectedCheckDateFilter={
						operator:dateOperator,
						fromDate:formattedFromDate,
						toDate:formattedToDate
					};
				 } 
		}else {
			// console.log("Error Occured - date filter details found empty");
		}	
	},
	setAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#amountFieldFrom");
		var amountFieldRefTo = $("#amountFieldTo");

		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#amountOperator').val(operator);
				amonutFieldRefFrom.val(amountFromFieldValue);
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator == "bt") {
						$("#amountFieldFrom").removeClass("hidden");
						amountFieldRefTo.val(amountToFieldValue);
					}
				}
			}
		}
	},
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode
			me.showAdvFilterCode = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
			me.handleMandatoryFilterName();
		}
		var accChangedValue = $("#accountSelect").getMultiSelectValue();
				var accValueDesc = [];
				$('#accountSelect :selected').each(function(i, selected){
					accValueDesc[i] = $(selected).text();
				});
		
			me.handleAccountFieldSync('A', accChangedValue,accValueDesc.toString());
		
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	
	updateSavedFilterComboInQuickFilter:function(){
		var me=this;
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterCombobox) && savedFilterCombobox.getStore().find('code', me.filterCodeValue) >= 0) {
			savedFilterCombobox.getStore().reload();
			if(me.filterCodeValue!=null){
				me.savedFilterVal=me.filterCodeValue;
			}else{
				me.savedFilterVal='';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
			me.filterCodeValue=null;
			
		}
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
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientFilterVal = selectedFilterClient;			
		me.clientFilterDesc = selectedFilterClientDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal == 'all') {
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}

		if( me.clientFilterVal == 'all' || me.clientFilterVal == '' )
		{
			resetClient();
		}
		else
		{
			switchClient(selectedFilterClient);
		}
	},
	handleAccountChangeInQuickFilter : function(combo) {
		var me = this;	
		var accountFilterVal= combo.getSelectedValues();
		me.accTypeFilterVal = combo.getValue();
		me.accTypeFilterDesc = combo.getRawValue();	
		
		me.handleAccountFieldSync('Q',accountFilterVal,null);
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
		/*
		if (me.accTypeFilterVal == 'All') {
			me.savedFilterVal = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
		*/
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		me.savedFilterVal = '';
		if(isClientUser()){
			var clientComboBox = me.getPositivePayFilter()
					.down('combo[itemId="quickFilterClientCombo"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
		}
		var savedFilterComboBox = me.getPositivePayFilter()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);		
		me.accTypeFilterVal = 'All';
		var savedAccountComboBox = me.getPositivePayFilter()
				.down('combo[itemId="quickFilterAccountCombo"]');
		savedAccountComboBox.setValue(me.accTypeFilterVal);
		savedAccountComboBox.selectAllValues();
		
		me.filterApplied = 'Q';
		
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		me.advFilterData = {};
		me.filterData = [];
		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();
	},

	/*setDisclaimer : function(  )
	{
		var me = this,objDisPanel,objDicText = null;
		
			objDisPanel = $('#disclaimerText');
		if(strApplyDisclaimerSysParam == 'Y' && !Ext.isEmpty(strDisclaimerText)){
			objDisPanel.text(strDisclaimerText);
			objDisPanel.show();
		}
		else if(Ext.isEmpty(strDisclaimerText)){
			objDisPanel.hide();
		}
	},*/
	assignSavedFilter: function(){
		var me= this;
		if(me.firstTime){
			me.firstTime = false;
			
			if (objPreference) {
				var objJsonData = Ext.decode(objPreference);
				if (!Ext.isEmpty(objJsonData.d.preferences)) {
					if (!Ext
							.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext
								.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							if(advData === me.getPositivePayFilter().down('combo[itemId="savedFiltersCombo"]').getValue()){
								$("#msSavedFilter option[value='"+advData+"']").attr("selected",true);
								$("#msSavedFilter").multiselect("refresh");
								me.savedFilterVal = advData;
								me.handleSavedFilterClick();
							}
						}
					}
				}
			}
		}
	},
	handleAfterGridDataLoad : function(grid, data, args)
	{
		var me = this,objDisPanel;
		if (data && data.d && data.d.__defaultDisclaimer && entityType == 0)
		{
			objDisPanel = $('#disclaimerText');
			objDisPanel.text(Ext.util.Format.htmlDecode(data.d.__defaultDisclaimer));;
			objDisPanel.show();
		}
	},
	addGridCellEditEvents : function(grid) {
		var me = this,buttonMask = [];
		grid.on('beforeedit', function(edit, e) {
			if(e && e.record && e.record.store && e.record.store.proxy && 
					e.record.store.proxy.reader && e.record.store.proxy.reader.jsonData && 
					e.record.store.proxy.reader.jsonData.d && e.record.store.proxy.reader.jsonData.d.__buttonMask) {
				buttonMask = e.record.store.proxy.reader.jsonData.d.__buttonMask;
			}
			if (edit.context.field === 'decision') 
			{
				var flag = true;
				if(e.record.get('decisionStatus') === 'Action Taken' 
					|| e.record.get('decisionStatus') === 'For My Approval' 
					|| e.record.get('decisionStatus') ===  'For Approval'
						|| e.record.get('decisionStatus') === 	'Decision Pending Submit'	
					|| me.selectedSubGroupDescription == 'History')
				{
					return false;
				}
				if( buttonMask.length > 0 && e.record.get('__metadata') && 
						e.record.get('__metadata').__rightsMap )
				{
					flag = isActionEnabled(buttonMask,2);
					if( flag == false )
						return false;
					flag = isActionEnabled(buttonMask,3);
					if( flag == false )
						return false;
					flag = isActionEnabled(e.record.get('__metadata').__rightsMap,2);
					if( flag == false )
						return false;
					flag = isActionEnabled(e.record.get('__metadata').__rightsMap,3);
					if( flag == false )
						return false;
				}
				if(flag)
				{
					if(e.record.get('hasReachedCutOff') === '0')
					{
						me.decisionColumnFormatBeforeEdit(edit, e);
						return true;
					}
					else
						return false;
				}
			}
			if (edit.context.field === 'decisionReason') 
			{
				if(e.record.get('decisionStatus') === 'Action Taken' 
					|| e.record.get('decisionStatus') === 'For My Approval' 
					|| e.record.get('decisionStatus') ===  'For Approval'
					|| me.selectedSubGroupDescription == 'History')
				{
					return false;
				}
				else if(e.record.get('decision') === 'R' )
				{							
					me.columnFormatBeforeEdit(edit, e);
					return true;
				}
				else
				{
					return false;
				}
			}
		});
		grid.on('edit',function(e,context)
		{
			 var sendRequest='N';
			 var record = context.record;
			 var recordData = record.getData();
			 var decisionReason = '';
			 if(e.context.field==='decision')
			 {
				 if( record.raw.exceptionReasonCode == '0' )
				 {
						Ext.MessageBox.show(
						{
							title : getLabel( 'positivePayExcepPopUpTitle', 'Error' ),
							msg : getLabel( 'errorPopUpMsg', 'You can not perform any action for this record!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
						record.set("decision", "N");
				 }
				 else
				 {
					 if(e.context.originalValue!=recordData.decision && recordData.decision=='P')
						 sendRequest='pay';
					 else if(e.context.originalValue!=recordData.decision && recordData.decision=='R')
					 {
						 record.set("decisionReason", "Select Decision Reason");
					 }
				 }
					 
			 }
			 else if(e.context.field==='decisionReason' && e.context.originalValue!=recordData.decisionReason && recordData.decision=='R')
			 {
				 sendRequest='return';	
				 decisionReason = recordData.decisionReason;
				 if(decisionReason == '&lt;') {
					decisionReason = Ext.String.htmlDecode('&lt;')
				 } else if(decisionReason == '&gt;') {
					decisionReason = Ext.String.htmlDecode('&gt;')
				 }
				 record.set("decisionReason", $("[name='decisionReason']").val());
			 }
			 
			 if(sendRequest!=='N')
			 {
				 var strUrl = Ext.String.format('{0}List/{1}.srvc',	me.selectedPPay, sendRequest);
				 me.handleRequest(strUrl,decisionReason, recordData.identifier);
			 }
		});
	}
});
function getPopulateBeneInfoPopUp(beneName,beneAccountNmbr,fromBeneAmount,beneStatus,identifier)
{
	//GCP.getApplication().fireEvent( 'handleBeneIconClick', beneName,beneAccountNmbr,amountType,fromBeneAmount,toBeneAmount,beneCcy,identifier );
	showPositivePayBenePopUp(beneName,beneAccountNmbr,fromBeneAmount,beneStatus,identifier);
}
function getCheckNmbrImage( imageNmbr, side, recIdentifier  )
{
	GCP.getApplication().fireEvent( 'callPopulateDepositImage', imageNmbr, side, recIdentifier );
}
function setCheckBoxValue(rightsMap, checkBox, makerId ,buttonMask ,identifier ,decision,rowIndex)
{
	var isChecked = checkBox.checked;
    GCP.getApplication().fireEvent( 'selectRecords', rightsMap, makerId , buttonMask,identifier ,decision,rowIndex ,isChecked);
}
function setGridSummary(pendingDecision, actionTaken)
{
	GCP.getApplication().fireEvent( 'setGridInformationSummary', pendingDecision, actionTaken);
}
