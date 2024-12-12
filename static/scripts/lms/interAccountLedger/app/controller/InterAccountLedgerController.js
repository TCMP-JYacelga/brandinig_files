Ext
	.define(
		'GCP.controller.InterAccountLedgerController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
			 'Ext.ux.gcp.DateHandler', 'GCP.view.InterAccountLedgerGroupView', 'Ext.ux.gcp.PageSettingPopUp'
			],
			views :
			[
				'GCP.view.InterAccountFilterView'
			],
			refs :
			[
			 	{
					ref : 'interAccountFilterView',
				selector :'interAccountFilterView'
				},
				{
					ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
				},
				{
					ref : 'groupView',
				selector : 'interAccountFilterView groupView'
				},
				{
					ref : 'interAccountLedgerGroupView', //Groupview
				selector : 'interAccountFilterView interAccountLedgerGroupView'
				},
				{
					ref : 'filterView',
				selector : 'filterView'
				}, 
				{
					ref : "filterButton",
				selector : "groupView button[itemId=filterButton]"
				},
				{
					ref : 'interAccountLedgerFilterView',
				selector : 'interAccountLedgerFilterView'
				},
				{
					ref : 'fromDateLabel',
				selector : 'interAccountLedgerFilterView label[itemId="fromDateLabel"]'
				}
				/*{
					ref : 'summaryGridViewRef',
					selector : 'interAccountLedgerFilterViewType interAccountLedgerFilterGridViewType grid[itemId="summaryGridViewItemId"]'
				},
				{
					ref : 'summaryViewItemRef',
					selector : 'interAccountLedgerFilterViewType interAccountLedgerFilterGridViewType panel[itemId="ledgerSummaryViewItemId"]'
				},
				{
					ref : 'interAccountLedgerGridViewRef',
					selector : 'interAccountLedgerFilterViewType interAccountLedgerFilterGridViewType'
				}*/
			],
			config :
			{
				filterData : [],
				strGetModulePrefUrl : 'services/userpreferences/interaccledger/{0}.json',
				sellerFilterVal : seller,
				sellerFilterDesc : '',
				clientFilterVal : clientId,
				clientFilterDesc : '',
				agreementRecKey : agreementRecKey,
				participatingAcc : accountId1,
				participatingAccDesc : '',
				contraAcc : accountId2,
				contraAccDesc : '',
				datePickerSelectedDate : [],
				dateFilterVal : '',
				dateRangeFilterVal : '13',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getLabel('lblToday', 'Today'),
				strPageName : 'lmsIntAccLedger',
				dateHandler : null
			},
			init : function()
			{
				var me = this;
				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				/*$(document).on('goToInterAccountPage', function(event, actionName) {
							me.goToInterAccountPage();
				});	*/
				me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				/*GCP.getApplication().on(
					{
						getAgreementSummaryInfo : function()
						{
							me.getAgreementSummaryInfo();
						},
						getAgreementSummaryData : function()
						{
							me.callHandleLoadGridData();
						},
						changeSummaryDetails : function( changeId )
						{
							me.goTochangeSummaryDetails( changeId );
						}
					} );*/

				/*me.control(
				{
					'interAccountLedgerFilterGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},

					'interAccountLedgerFilterGridViewType smartgrid' :
					{
						render : function( grid )
						{
							me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
						{
						}
					}
				} );*/
			
				$(document).on('filterDateChange',
						function(event, filterType, btn, opts) {
							if (filterType == "fromDateQuickFilter") {
								me.dateRangeFilterVal = btn.btnValue;
								//me.datePickerSelectedDate = dates;
								//me.datePickerSelectedEntryDate = dates;
								me.dateFilterVal = me.dateRangeFilterVal;
								me.dateFilterLabel = btn.text;
								me.handleDateChange(btn.btnValue);
							} 
						});
				$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
				
				me.control({
				'interAccountFilterView groupView' : {
					'groupByChange' : function(menu, groupInfo) {
						// me.doHandleGroupByChange(menu, groupInfo);
					},
					'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
							newCard, oldCard) {					
						me.doHandleGroupTabChange(groupInfo, subGroupInfo,
								tabPanel, newCard, oldCard);
					//	me.setGridInfoSummary();
					},
					'gridRender' : function(groupInfo, subGroupInfo, grid, url, pgSize,
								newPgNo, oldPgNo, sorter, filterData) {					
							me.doHandleLoadGridData(groupInfo, subGroupInfo, grid, url, pgSize,
								newPgNo, oldPgNo, sorter, filterData);
							//me.setGridInfoSummary();
					},				
					'gridPageChange' : me.doHandleLoadGridData,
					'gridSortChange' : me.doHandleLoadGridData,
					'gridPageSizeChange' : me.doHandleLoadGridData,
					'gridColumnFilterChange' : me.doHandleLoadGridData,
					'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
					'gridStateChange' : function(grid) {					
					},
					/*'gridRowActionClick' : function(grid, rowIndex, columnIndex,
							actionName, record) {
						me.doHandleRowActions(actionName, grid, record);
					},
					'groupActionClick' : function(actionName, isGroupAction,
							maskPosition, grid, arrSelectedRecords) {
						if (isGroupAction === true)
							me.doHandleGroupActions(actionName, grid,
									arrSelectedRecords, 'groupAction');
					}*/
					'gridSettingClick' : function(){
						me.showPageSettingPopup('GRID');
					}
				},
				'interAccountLedgerFilterView combo[itemId="entitledSellerIdItemId"]' :
				{
					select : function( combo, record, index )
					{
						var objFilterPanel = me.getInterAccountLedgerFilterView();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientCodeItemId"]' );
						//objAutocompleter.cfgUrl = 'services/userseek/sweepTxnAdminClientIdSeek.json';
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : combo.getValue()
							}
						];
						me.handleSellerFilter( combo.getValue(),combo.getRawValue());
						//me.callHandleLoadGridData();
						
					}
				},
				'interAccountLedgerFilterView AutoCompleter[itemId="clientCodeItemId"]' :
				{
					
					select : function( combo, record, index )
					{
						var objFilterPanel = me.getInterAccountLedgerFilterView();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
						//objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
						//objAutocompleter.cfgSeekId = 'sweepTxnIdSeek';
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : combo.getValue()
							}
						];
						//me.clientFilterDesc = combo.getDisplayValue();
						me.handleClientFilter( combo.getValue(),combo.getRawValue());
						//me.callHandleLoadGridData();
					},
					'change' : function( combo, record, index )
					{				
						if(combo.value == ''|| combo.value == null)
						{
							var objFilterPanel = me.getInterAccountLedgerFilterView();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
							objAutocompleter.setValue( '' );
						}
					}
				},
				'interAccountLedgerFilterView combo[itemId="quickFilterClientCombo"]' :
				{
					
					select : function( combo, record, index )
					{
						var objFilterPanel = me.getInterAccountLedgerFilterView();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
						//objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
						//objAutocompleter.cfgSeekId = 'sweepTxnIdSeek';
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : combo.getValue()
							}
						];
						//me.clientFilterDesc = combo.getDisplayValue();
						me.handleClientFilter( combo.getValue(),combo.getRawValue() );
						//me.callHandleLoadGridData();
					},
					'change' : function( combo, record, index )
					{				
						if(combo.value == ''|| combo.value == null)
						{
							var objFilterPanel = me.getInterAccountLedgerFilterView();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
							objAutocompleter.setValue( '' );
						}
					}
				},
				'interAccountLedgerFilterView AutoCompleter[itemId="agreementItemId"]' :
				{
					
					select : function( combo, record, index )
					{
						var objFilterPanel = me.getInterAccountLedgerFilterView();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="participatingAccItemId"]' );
						//objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
						//objAutocompleter.cfgSeekId = 'sweepTxnIdSeek';
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : record[ 0 ].data.RECORD_KEY_NO
							}
						];
						//me.clientFilterDesc = combo.getDisplayValue();
						me.handleAgreementRecKeyFilter( record[ 0 ].data.RECORD_KEY_NO,combo.getRawValue() );
						//me.callHandleLoadGridData();
					},
					'change' : function( combo, record, index )
					{				
						if(combo.value == ''|| combo.value == null)
						{
							var objFilterPanel = me.getInterAccountLedgerFilterView();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="participatingAccItemId"]' );
							objAutocompleter.setValue( '' );
							agreementRecKey = '';
						}
					}
				},
				'interAccountLedgerFilterView AutoCompleter[itemId="participatingAccItemId"]' :
				{
					
					select : function( combo, record, index )
					{
						var me = this;
						var objFilterPanel = me.getInterAccountLedgerFilterView();
						var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="contraAccItemId"]' );
						//objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
						//objAutocompleter.cfgSeekId = 'sweepTxnIdSeek';
						objAutocompleter.setValue( '' );
						objAutocompleter.cfgExtraParams =
						[
							{
								key : '$filtercode1',
								value : agreementRecKey
							},
							{
								key : '$filtercode2',
								value : record[ 0 ].data.ACCTID
							}
						];
						//me.clientFilterDesc = combo.getDisplayValue();
						me.handleParticipatingAccFilter( record[ 0 ].data.ACCTID,combo.getRawValue() );
						//me.callHandleLoadGridData();
					},
					'change' : function( combo, record, index )
					{				
						if(combo.value == ''|| combo.value == null)
						{
							var objFilterPanel = me.getInterAccountLedgerFilterView();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="contraAccItemId"]' );
							objAutocompleter.setValue( '' );
							accountId1 = '';
						}
					}
				},
				'interAccountLedgerFilterView AutoCompleter[itemId="contraAccItemId"]' :
				{
					
					select : function( combo, record, index )
					{
						var me = this;
						me.handleContraAccFilter( record[ 0 ].data.ACCTID,combo.getRawValue() );
						
					},
					'change' : function( combo, record, index )
					{				
						if(combo.value == ''|| combo.value == null)
						{
							accountId2 = '';
						}
					}
						
				},
				'interAccountLedgerFilterView component[itemId="savedFiltersLabel22"]' : {
					render : function(c) {
						c.getEl().on('click', function() {
							me.searchButtonClicked = true;
							me.callHandleLoadGridData();
							me.searchButtonClicked = false;
								}, c);
					}
				},
				'interAccountLedgerFilterView component[itemId="InterAccfromDatePicker"]' : {
					render : function() {
						$('#fromDatePicker').datepick({
							monthsToShow : 1,
							changeMonth : true,
							dateFormat : strApplicationDateFormat,
							changeYear : true,
							rangeSeparator : ' to ',
							onClose : function(dates) {
								var strSqlDateFormat = 'Y-m-d';
								if (!Ext.isEmpty(dates)) {
									me.dateRangeFilterVal = '13';
									me.datePickerSelectedDate = dates;
									me.datePickerSelectedEntryDate = dates;
									me.dateFilterVal = me.dateRangeFilterVal;
									if (dates.length == 2){
									me.dateFilterLabel = getLabel('daterange',
										'Date Range');
									}
									else{
									me.dateFilterLabel = '';
									}
									me.handleDateChange(me.dateRangeFilterVal);
								}
							}
						});
						me.updateDate();
						
					}
				},
				/*'sweepTxnViewType sweepTxnFilterViewType button[itemId="btnSavePreferences"]' :
				{
					click : function( btn, opts )
					{
						//me.toggleSavePrefrenceAction( false );
						//me.handleSavePreferences();
					}
				},
				'sweepTxnViewType sweepTxnFilterViewType button[itemId="btnClearPreferences"]' :
				{
					click : function( btn, opts )
					{
						//me.toggleSavePrefrenceAction( false );
						//me.handleClearPreferences();
					}
				},*/
				
				'filterView button[itemId="clearSettingsButton"]' : {
					'click' : function() {
						me.handleClearSettings();
					}
				},
				'pageSettingPopUp' : {
					'applyPageSetting' : function(popup, data, strInvokedFrom) {
						me.applyPageSetting(data, strInvokedFrom);
					},
					'restorePageSetting' : function(popup, data, strInvokedFrom) {
						me.restorePageSetting(data, strInvokedFrom);
					},
					'savePageSetting' : function(popup, data, strInvokedFrom) {
						me.savePageSetting(data, strInvokedFrom);
					}
				}
				
				});
			
			
			},
			callHandleLoadGridData : function()
			{
				var me = this;
				var groupView = me.getGroupView();
				var gridObj = groupView.getGrid();//me.getSummaryGridViewRef();
				me.doHandleLoadGridData( groupView.cfgGroupByData[0],groupView.cfgGroupByData[0],gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1,gridObj.store.sorters, gridObj.store.filters );
			},
			
			doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
					newCard, oldCard) {
				var me = this;
				var objGroupView = me.getGroupView();
				var strModule = '', strUrl = null, args = null, strFilterCode = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
				// TODO : Need to refactor for non us market
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
				}else{
					me.preferenceHandler.readPagePreferences(me.strPageName, me.updateObjSweepTxnSummaryPref,args, me,false);
				}
			},
			updateObjSweepTxnSummaryPref : function(data){
				objSweepTxnSummaryPref = Ext.encode(data);
			},
			showPageSettingPopup : function(strInvokedFrom) {
				var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
				var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;

				me.pageSettingPopup = null;
				objColumnSetting = INTERACCOUNT_LEDGER_COLUMN_MODEL;
				if (!Ext.isEmpty(objSweepTxnSummaryPref)) {
					objPrefData = Ext.decode(objSweepTxnSummaryPref);
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
							: INTERACCOUNT_LEDGER_COLUMN_MODEL || [];

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
				//objData["filterUrl"] = 'services/userfilterslist/siGroupViewFilter.json';
				objData["rowPerPage"] = _AvailableGridSize;
				objData["groupByVal"] = objGroupByVal;
				objData["filterVal"] = objDefaultFilterVal;
				objData["gridSizeVal"] = objGridSizeVal;
				objData["rowPerPageVal"] = objRowPerPageVal;
				subGroupInfo = objGroupView.getSubGroupInfo() || {};
				strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
				"Column Settings")
				+ ' : ' + (subGroupInfo.groupDescription || '') : getLabel(
				"Settings", "Settings"));
				me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
							cfgPopUpData : objData,
							cfgGroupView : objGroupView,
							cfgDefaultColumnModel : objColumnSetting,
							cfgViewOnly : _IsEmulationMode,
							cfgInvokedFrom : strInvokedFrom,
							cfgGridHeight : 240,
							title : strTitle
						});
				me.pageSettingPopup.show();
				me.pageSettingPopup.center();
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
			toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferences();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );

			},
			toggleClearPrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnClearPreferences();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );
			},
			handleSavePreferences : function()
			{
				var me = this;
				me.savePreferences();
			},
			handleClearPreferences : function()
			{
				var me = this;
				me.toggleSavePrefrenceAction( false );
				me.clearWidgetPreferences();
			},
			savePreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.urlGridPref;
				var grid = me.getSweepTxnGridRef();
				var arrColPref = new Array();
				var arrPref = new Array();
				if( !Ext.isEmpty( grid ) )
				{
					arrCols = grid.headerCt.getGridColumns();
					for( var j = 0 ; j < arrCols.length ; j++ )
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
							&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
							&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction' )
							arrColPref.push(
							{
								colId : objCol.dataIndex,
								colDesc : objCol.text,
								colHidden : objCol.hidden
							} );

					}
					objPref.pgSize = grid.pageSize;
					objPref.gridCols = arrColPref;
					arrPref.push( objPref );
				}

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
								if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
									me.getBtnSavePreferences().setDisabled( false );
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
								title : getLabel( 'filterPopupTitle', 'Error' ),
								msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );

			},
			saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridFilterPref;
				var advFilterCode = null;
				var objFilterPref = {};

				var objQuickFilterPref = {};
				objQuickFilterPref.sellerId = me.sellerFilterVal;
				objQuickFilterPref.clientId = me.clientFilterVal;
				objQuickFilterPref.agreementCode = me.agreementFilterVal;
				objQuickFilterPref.transactionType = me.transactionType;
				objFilterPref.quickFilter = objQuickFilterPref;

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
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
							}
							else if( data.d.preferences && data.d.preferences.success === 'N' && data.d.error
								&& data.d.error.errorMessage )
							{
								if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
									me.toggleSavePrefrenceAction( true );
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
								title : getLabel( 'filterPopupTitle', 'Error' ),
								msg : getLabel( 'filterPopupMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			clearWidgetPreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null, objWdgtPref = null;
				var strUrl = me.commonPrefUrl + "?$clear=true";
				var grid = me.getSweepTxnGridRef();
				var arrColPref = new Array();
				var arrPref = new Array();
				if( !Ext.isEmpty( grid ) )
				{
					arrCols = grid.headerCt.getGridColumns();
					for( var j = 0 ; j < arrCols.length ; j++ )
					{
						objCol = arrCols[ j ];
						if( !Ext.isEmpty( objCol ) && !Ext.isEmpty( objCol.itemId )
							&& objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty( objCol.xtype )
							&& objCol.xtype !== 'actioncolumn' && objCol.itemId !== 'col_textaction'
							&& objCol.dataIndex != null )
							arrColPref.push(
							{
								colId : objCol.dataIndex,
								colDesc : objCol.text,
								colHidden : objCol.hidden
							} );

					}
					objWdgtPref = {};
					objWdgtPref.pgSize = grid.pageSize;
					objWdgtPref.gridCols = arrColPref;
					arrPref.push(
					{
						"module" : "",
						"jsonPreferences" : objWdgtPref
					} );
				}
				if( arrPref )
				{
					Ext.Ajax.request(
					{
						url : strUrl,
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
								if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
									me.toggleSavePrefrenceAction( true );
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
							{
								Ext.MessageBox.show(
								{
									title : title,
									msg : getLabel( 'prefClearedMsg', 'Preferences Cleared Successfully' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
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
			},
			doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
					objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;		
				var maskArray = new Array(), actionMask = '', objData = null;;
				if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push(buttonMask);
				for (var index = 0; index < arrSelectedRecords.length; index++) {
					objData = arrSelectedRecords[index];
					maskArray.push(objData.get('__metadata').__rightsMap);
				}
				actionMask = doAndOperation(maskArray, 10);
				objGroupView.handleGroupActionsVisibility(actionMask);
			},
			postHandleDoHandleGroupTabChange : function(data, args) {
				var me = args ? args.scope : this;
				me.handleReconfigureGrid(data);
			},
			handleReconfigureGrid : function(data) {
				var me = this;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getInterAccountFilterView(), gridModel = null, objData = null;
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
			handleSellerFilter : function( selectedValue,selectedValueDesc)
			{
				var me = this;
				seller = selectedValue;
				me.sellerFilterDesc = selectedValueDesc;
			},
			handleClientFilter : function( selectedValue,selectedValueDesc )
			{
				var me = this;
				clientId = selectedValue;
				me.clientFilterDesc = selectedValueDesc;
			},
			handleAgreementRecKeyFilter : function( selectedValue,selectedValueDesc )
			{
				var me = this;
				agreementRecKey = selectedValue;
				me.agreementdesc = selectedValueDesc;
			},
			handleParticipatingAccFilter : function( selectedValue,selectedValueDesc )
			{
				var me = this;
				accountId1 = selectedValue;
				me.participatingAccDesc = selectedValueDesc;
			},
			handleContraAccFilter : function( selectedValue,selectedValueDesc )
			{
				var me = this;
				accountId2 = selectedValue;
				me.contraAccDesc = selectedValueDesc;
			},
			handleDateChange : function(index) {
				var me = this;
				var objDateParams = me.getDateParam(index);
				var datePickerRef = $('#fromDatePicker');
				/*var toDatePickerRef = $('#entryDataToPicker');*/
				if (!Ext.isEmpty(me.dateFilterLabel)) {
					me.getFromDateLabel().setText(getLabel('date', 'Date')
							+ " (" + me.dateFilterLabel + ")");
				}
				else{
					me.getFromDateLabel().setText(getLabel('date', 'Date'));
				}

				/*var vFromDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue2, 'Y-m-d'),
						strExtApplicationDateFormat);*/
				
				var vFromDate = $.datepick.formatDate(strApplicationDateFormat,
					$.datepick.parseDate('yyyy-mm-dd', objDateParams.fieldValue1));
				var vToDate = $.datepick.formatDate(strApplicationDateFormat,
					$.datepick.parseDate('yyyy-mm-dd', objDateParams.fieldValue2));
				
				if (index == '13' || index == '14') {
					if (objDateParams.operator == 'eq') {
						datePickerRef.datepick('setDate', vFromDate);
					} else {
						datePickerRef.datepick('setDate', [vFromDate, vToDate]);
					}
				} else {
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							// datePickerRef.val(/*getLabel('till', 'Till') + '  ' +*/ vFromDate);
							datePickerRef.datepick('setDate', vFromDate); 
						} else {
							datePickerRef.datepick('setDate', vFromDate);
						}
					} else {
						datePickerRef.datepick('setDate', [vFromDate, vToDate]);
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
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '2' :
						// Yesterday
						fieldValue1 = Ext.Date.format(objDateHandler
										.getYesterdayDate(date), strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '3' :
						// This Week
						dtJson = objDateHandler.getThisWeekToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '4' :
						// Last Week To Date
						dtJson = objDateHandler.getLastWeekToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '5' :
						// This Month
						dtJson = objDateHandler.getThisMonthToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '6' :
						// Last Month To Date
						dtJson = objDateHandler.getLastMonthToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '8' :
						// This Quarter
						dtJson = objDateHandler.getQuarterToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '9' :
						// Last Quarter To Date
						dtJson = objDateHandler.getLastQuarterToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '10' :
						// This Year
						dtJson = objDateHandler.getYearToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '11' :
						// Last Year To Date
						dtJson = objDateHandler.getLastYearToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '12' :
						// Latest
						fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'le';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
						break;
					case '15' :
				    //last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
						break;
					case '15' :
				    //last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
						break;
					case '15' :
				    //last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
						break;
					case '15' :
				    //last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
						break;
					case '15' :
				    //last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
						break;
					case '15' :
				    //last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
						break;
					case '15' :
				    //last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
						break;
					case '15' :
				    //last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						break;
					case '13' :
						// Date Range
						if(!isEmpty(me.datePickerSelectedDate)){
						if (me.datePickerSelectedDate.length == 1) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
									strSqlDateFormat);
							fieldValue2 = fieldValue1;
							operator = 'eq';
							fromDate = fieldValue1;
							toDate = fieldValue2;
						} else if (me.datePickerSelectedDate.length == 2) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
									strSqlDateFormat);
							operator = 'bt';
							fromDate = fieldValue1;
							toDate = fieldValue2;
						}
						break;
						}
					case '14' :
						// Date Range to set app date on load
						fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						fromDate = fieldValue1;
						toDate = fieldValue2;
						
					}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
			},
			updateDate : function() {
				
				var me = this;
				me.handleDateChange('14');
			},
			generateFilterUrl : function(subGroupInfo, groupInfo) {
				var me = this;
				var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
				if (me.filterApplied === 'ALL' || me.filterApplied === 'Q') {
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
					if (!Ext.isEmpty(strQuickFilterUrl)) {
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
				} else if (me.filterApplied === 'A') {
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
			
			doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
					newPgNo, oldPgNo, sorter, filterData) {
				var me = this;
				var arrOfParseQuickFilter = [], arrOfFilteredApplied = [];
				var frmDt = toDt = null;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				objGroupView.handleGroupActionsVisibility(buttonMask);
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
				if(fromDate != null){
				frmDt = $.datepick.formatDate('mm/dd/yyyy',
						$.datepick.parseDate('yyyy-mm-dd', fromDate));
				}
				if(toDate != null){
				toDt = $.datepick.formatDate('mm/dd/yyyy',
						$.datepick.parseDate('yyyy-mm-dd', toDate));
				}
				if (!Ext.isEmpty( clientId ))
				{
					strUrl = strUrl + "&$clientId=" + clientId;
				}
				else if(Ext.isEmpty( clientId ) && !Ext.isEmpty( strClient ))
				{
					strUrl = strUrl + "&$clientId=" + strClient;
				}
				else
				{
					strUrl = strUrl + "&$clientId=" + '';	
				}	
				if( agreementRecKey == null )
				{
					strUrl = strUrl + "&$clientId=" + clientId;	
				}
				else
				{
					strUrl = strUrl + "&$agreementRecKey=" + agreementRecKey;
				}
				if( accountId1 == null )
				{
					strUrl = strUrl + "&$accountId1=" + '';	
				}
				else
				{
					strUrl = strUrl + "&$accountId1=" + accountId1;
				}
				if( accountId2 == null )
				{
					strUrl = strUrl + "&$accountId2=" + '';	
				}
				else
				{
					strUrl = strUrl + "&$accountId2=" + accountId2;
				}
				if( frmDt == null )
				{
					strUrl = strUrl + "&$fromDate=" + '';
				}
				else
				{
					strUrl = strUrl + "&$fromDate=" + frmDt;
				}
				
				if( toDt == null )
				{
					strUrl = strUrl + "&$toDate=" + '';
				}
				else
				{
					strUrl = strUrl + "&$toDate=" +  toDt;
				}
				
				me.setDataForFilter();
				if(!Ext.isEmpty(me.filterData)){
					if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
						arrOfParseQuickFilter = generateFilterArray(me.filterData);
					}
				}
				
				//Hide Client code
				if(entityType === '1' && (Ext.isEmpty(me.clientFilterDesc) || clientId === 'all')){
					arrOfParseQuickFilter = arrOfParseQuickFilter.filter(function(e){
						return !(e.hasOwnProperty('fieldId') && e['fieldId'] === 'clientId');
					});
				}
				
				if (arrOfParseQuickFilter) {
					arrOfFilteredApplied = arrOfParseQuickFilter;
					
					if (arrOfFilteredApplied)
						me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
				}
				
				me.reportGridOrder = strUrl;
				strUrl += me.generateFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
				if(!me.isValidFilterInputPramas())
					grid.loadGridData(strUrl, null, null, false);
			},
			setDataForFilter : function()
			{
				var me = this;
				var jsonArray = [];
				var frmDt = $.datepick.formatDate('mm/dd/yyyy',
						$.datepick.parseDate('yyyy-mm-dd', fromDate));
				var toDt = $.datepick.formatDate('mm/dd/yyyy',
						$.datepick.parseDate('yyyy-mm-dd', toDate));
				
				
				if( !Ext.isEmpty( clientId ) )
				{
					jsonArray.push(
									{
										paramName : 'clientId',
										paramValue1 : encodeURIComponent(clientId.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'eq',
										dataType : 'S',
										paramFieldLable :  getLabel("grid.column.company", "Company Name"),
										displayType : 5,
										displayValue1 : me.clientFilterDesc
									} );
						
				}
				if( !Ext.isEmpty( agreementRecKey ) )
				{
					jsonArray.push(
							{
								paramName : 'agreementRecKey',
								paramValue1 : encodeURIComponent(agreementRecKey.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S',
								paramFieldLable :  getLabel('AgreementCode', 'Agreement Code'),
								displayType : 5,
								displayValue1 : me.agreementdesc
							} );
				}
				if( !Ext.isEmpty( accountId1 ) )
				{
					jsonArray.push(
							{
								paramName : 'accountId1',
								paramValue1 : encodeURIComponent(accountId1.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S',
								paramFieldLable :  getLabel('Participating Account', 'Participating Account'),
								displayType : 5,
								displayValue1 : me.participatingAccDesc
							} );
				}
				if( !Ext.isEmpty( accountId2 ) )
				{
					jsonArray.push(
							{
								paramName : 'accountId2',
								paramValue1 : encodeURIComponent(accountId2.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'lk',
								dataType : 'S',
								paramFieldLable :  getLabel('ContraAccount', 'Contra Account'),
								displayType : 5,
								displayValue1 : me.contraAccDesc
							} );
				}
				if( !Ext.isEmpty( fromDate ) )
				{
					if(fromDate == toDate )
					{
						jsonArray.push(
								{
									paramName : 'fromDate',
									paramValue1 : fromDate,
									paramValue2 : toDate,
									operatorValue : 'eq',
									dataType : 'D',
									paramFieldLable :  getLabel('FromDate', 'Date')
									//displayValue1 : fromDate
								} );
					} else {
						jsonArray.push(
								{
									paramName : 'fromDate',
									paramValue1 : fromDate,
									paramValue2 : toDate,
									operatorValue : 'bt',
									dataType : 'D',
									paramFieldLable :  getLabel('FromDate', 'Date')
									//displayValue1 : fromDate
								} );
					}
					
				}
				me.filterData = jsonArray;
			},
			handleClearSettings:function(){
				var me=this;
				var interAccountLedgerFilterView = me.getInterAccountLedgerFilterView();
				if(!Ext.isEmpty(interAccountLedgerFilterView)){
				var agreementItemId = interAccountLedgerFilterView
						.down('combobox[itemId=agreementItemId]');

				var participatingAccItemId = interAccountLedgerFilterView
						.down('combobox[itemId=participatingAccItemId]');
				
				var contraAccItemId = interAccountLedgerFilterView
						.down('combobox[itemId=contraAccItemId]');
				
				if(isClientUser()){
					var clientCombo = interAccountLedgerFilterView.down('combobox[itemId=quickFilterClientCombo]');
					me.clientFilterVal = '';
					clientId = '';
					me.clientFilterDesc = 'all';
					clientCombo.setValue(me.clientFilterDesc);
				}else{
					interAccountLedgerFilterView.down('AutoCompleter[itemId=clientCodeItemId]').setValue("");
					clientId = '';
					
					
				}
				agreementItemId.setValue("");
				agreementRecKey = '';
				me.agreementdesc ='';
				participatingAccItemId.setValue("");
				accountId1='';
				me.participatingAccDesc ='';
				contraAccItemId.setValue("");
				accountId2 = '';
				me.contraAccDesc ='';
				
				me.clientFilterDesc='';
				me.clientFilterVal='';
				
				me.handleDateChange('14');
				me.getFromDateLabel().setText(getLabel('date', 'Date'));
				
				me.filterData=[];
				me.refreshData();
				}
			},
			refreshData : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				grid.removeAppliedSort();
				objGroupView.refreshData();
			},
			isValidFilterInputPramas : function(){
				var me = this;
					var mandatoryFieldsArray = [];
					var emptyString = null ;
					var arrError = [];
					var strTargetDivId = 'messageArea';
					var fromDateValue = fromDate;
					var isValid = true;
					//var toDateValue = document.getElementsByName( "toDate" )[0].value ;
					var clientValue = clientId;
					if(clientValue == null || clientValue == ''){
						clientValue = strClient;
					}
					//mandatoryFieldsArray.push({id:"Financial Institution",value:document.getElementById( "sellerId" ).value});
					mandatoryFieldsArray.push({id:"Client Name",value:clientValue});
					mandatoryFieldsArray.push({id:"Agreement Code",value:agreementRecKey});
					mandatoryFieldsArray.push({id:"Participating Account",value:accountId1});
					mandatoryFieldsArray.push({id:"Contra Account",value:accountId2});
					mandatoryFieldsArray.push({id:"From Date",value:fromDateValue});
					//mandatoryFieldsArray.push({id:"To Date",value:document.getElementsByName( "toDate" )[0].value});*/
					
					for( var i = 0 ; i < mandatoryFieldsArray.length ; i++ )
					{
						var fieldValue = mandatoryFieldsArray[ i ].value;
						if( fieldValue == null || fieldValue.trim() == '' )
						{
							if(emptyString == null )
							{
								emptyString = mandatoryFieldsArray[i].id ;
							}
							else
							{
								emptyString = emptyString + ',' + mandatoryFieldsArray[i].id ;
							}
							isValid = false;
						}
					}
					if(!isValid && me.searchButtonClicked){
						Ext.MessageBox.show({
											title : getLabel('lblError', 'Error'),
											msg : 'One or more Mandatory Fields are not Specified to Search!',
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
						});
					}
				}
		});		
			/*handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );

					if( clientId == null )
					{
						strUrl = strUrl + "&$clientId=" + '';	
					}
					else
					{
						strUrl = strUrl + "&$clientId=" + clientId;
					}
					if( agreementRecKey == null )
					{
						strUrl = strUrl + "&$agreementRecKey=" + '';	
					}
					else
					{
						strUrl = strUrl + "&$agreementRecKey=" + agreementRecKey;
					}
					if( accountId1 == null )
					{
						strUrl = strUrl + "&$accountId1=" + '';	
					}
					else
					{
						strUrl = strUrl + "&$accountId1=" + accountId1;
					}
					if( accountId2 == null )
					{
						strUrl = strUrl + "&$accountId2=" + '';	
					}
					else
					{
						strUrl = strUrl + "&$accountId2=" + accountId2;
					}
					if( fromDate == null )
					{
						strUrl = strUrl + "&$fromDate=" + '';
					}
					else
					{
						strUrl = strUrl + "&$fromDate=" + fromDate;
					}
					
					if( toDate == null )
					{
						strUrl = strUrl + "&$toDate=" + '';
					}
					else
					{
						strUrl = strUrl + "&$toDate=" +  toDate;
					}
				
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},*/
			/*handleSmartGridConfig : function()
			{
				var me = this;
				var summaryGrid = me.getSummaryGridViewRef();
				var objConfigMap = me.getSummaryGridConfig();

				if( !Ext.isEmpty( summaryGrid ) )
					summaryGrid.destroy( true );

				var arrColsPref = null;
				var data = null;

				if( !Ext.isEmpty( objGridViewPref ) )
				{
					data = Ext.decode( objGridViewPref );
					objPref = data[ 0 ];
					arrColsPref = objPref.gridCols;
					arrCols = me.getColumns( arrColsPref, objConfigMap );
				}
				else
					if( objDefaultGridViewPref )
					{
						data = objDefaultGridViewPref;
						objPref = data[ 0 ];
						arrColsPref = objPref.gridCols;
						arrCols = me.getColumns( arrColsPref, objConfigMap );
					}
					else
					{
						arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
					}
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel );
			},*/

			/*getSummaryGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"POSITION_DATE" : 290,
					"MOV_ID" : 290,
					"DR_CR" : 290,
					"AMOUNT" : 290
				};

				arrColsPref =
				[
					{
						"colId" : "POSITION_DATE",
						"colDesc" : getLabel( 'lblPositionDate', 'Date' )
					},
					{
						"colId" : "MOV_ID",
						"colDesc" : getLabel( 'lblDescription', 'Description' )
					},
					{
						"colId" : "DR_CR",
						"colDesc" : getLabel( 'lblDebitCredit', 'Debit/Credit' )
					},
					{
						"colId" : "AMOUNT",
						"colDesc" : getLabel( 'lblAmount', 'Amount' ),
						"colType" :"number"
					}
				];

				storeModel =
				{
					fields :
					[
						'POSITION_DATE','MOV_ID','DR_CR','AMOUNT'
					],
					proxyUrl : 'getLmsInterAccountLedgerList.srvc',
					rootNode : 'd.commonDataTable'
				};

				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : arrColsPref,
					"storeModel" : storeModel
				};
				return objConfigMap;
			},*/
			/*getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;

				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.colHidden;
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}

						cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},*/
			/*columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = value;
				var positionDate = record.get('POSITION_DATE');
				if(positionDate == null || positionDate == '' )
				{
					if(value == null)
					{
						value="";
					}
					strRetValue = '<font style="font-weight:bold;">'+value+'</font>';
				}
				return strRetValue;
			},*/
			/*handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				pgSize = 100;
				summaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'summaryGridViewItemId',
					itemId : 'summaryGridViewItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					padding : '12 0 0 0',
					cls:'t7-grid',
					autoExpandLastColumn  :false,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					maxHeight : 280,
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var summaryView = me.getSummaryViewItemRef();
				summaryView.add( summaryGrid );
				summaryView.doLayout();
			},*/
			/*getAgreementSummaryInfo : function() {
			var me = this;
			var sellerDesc = document.getElementById('sellerDesc').value;
			var clientName = document
					.getElementById('clientDescription').value;
			var participatingAcc = document
					.getElementById('accountOneDescription').value;
			var contraAcc = document
					.getElementById('accountTwoDescription').value;
			var fromDate = document.getElementById('fromDate').value;
			var endDate = document.getElementById('toDate').value;
			var agreementCode = document
					.getElementById('agreementCode').value;
			var agreementDescription = document
			.getElementById('agreementDescription').value;
			
			var objInterAccountLedgerGridViewRef = me
					.getInterAccountLedgerGridViewRef();
			var filterAccountPosId = $('#filterAccountPosId');

			var objReadOnlyFilterPnael = $('#readOnlyHeader');
			var objDownloadIcon = $('#btnSaveExcel');

			$('#sellerIdDesc').text('');
			$('#sellerIdDesc').text(sellerDesc);

			$('#clientIdDesc').text('');
			$('#clientIdDesc').text(clientName);

			$('#participatingAcc').text('');
			$('#participatingAcc').text(participatingAcc);

			$('#contraAcc').text('');
			$('#contraAcc').text(contraAcc);

			$('#fromDateId').text('');
			$('#fromDateId').text(fromDate);

			$('#toDateId').text('');
			$('#toDateId').text(endDate);

			$('#agreementCodeId').text('');
			$('#agreementCodeId').text(agreementCode);
			
			$('#agreementCodeDesc').text('');
			$('#agreementCodeDesc').text(agreementDescription);

			filterAccountPosId.addClass('ui-helper-hidden');
			objInterAccountLedgerGridViewRef
					.removeCls('ui-helper-hidden');
			objReadOnlyFilterPnael.removeClass('ui-helper-hidden');
			objDownloadIcon.css('display', 'inline');

		},*/
		/*goToInterAccountPage : function()
		{
			var me = this;
			var  objInterAccountLedgerGridViewRef = me.getInterAccountLedgerGridViewRef();			
			var filterAccountPosId = $('#filterAccountPosId');
			var objReadOnlyFilterPnael = $('#readOnlyHeader');
			
			var objDownloadIcon = $('#btnSaveExcel');									
			
			filterAccountPosId.removeClass('ui-helper-hidden');
			objReadOnlyFilterPnael.addClass('ui-helper-hidden');
			objInterAccountLedgerGridViewRef.addCls('ui-helper-hidden');
			
			objDownloadIcon.css('display','none');
		}	
		} );*/
/*function getAgreementSummary()
{
		doClearMessageSection();
			var arrError = null;
			var dateFlag = false;
			var strTargetDivId = 'messageArea';
			arrError = validateData();
			dateFlag = validateDate();
					
			if (arrError && arrError.length > 0) {
				$('#' + strTargetDivId).empty();
				$.each(arrError, function(index, error) {
					strMsg = error.errorMessage;
					element = $('<p>').text(strMsg);
					element.appendTo($('#' + strTargetDivId));
					$('#' + strTargetDivId + ', #messageContentDiv')
							.removeClass('hidden');
				});
			}
			else
			{
				assignData();				
				GCP.getApplication().fireEvent( 'getAgreementSummaryInfo' );
				GCP.getApplication().fireEvent( 'getAgreementSummaryData' );
			}
	
}*/
/*function goToInterAccount()
{
	$(document).trigger("goToInterAccountPage");
}*/