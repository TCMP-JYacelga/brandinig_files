/**
 * @class GCP.controller.SweepTxnController
 * @extends Ext.app.Controller
 * @author Vivek Bhurke
 */
Ext
	.define(
		'GCP.controller.SweepTxnController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
			 	'Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'
			],
			views :
			[
				'GCP.view.SweepTxnView','GCP.view.SweepTxnFilterView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'sweepTxnViewRef',
					selector : 'sweepTxnViewType'
				},
				{
					ref : 'pageSettingPopUp',
					selector : 'pageSettingPopUp'
				},
				{
					ref : 'groupView',
					selector : 'sweepTxnViewType groupView'
				},
				{
					ref : 'filterView',
					selector : 'filterView'
				},
				{
					ref : "filterButton",
					selector : "groupView button[itemId=filterButton]"
				},
				/*{
					ref : 'sweepTxnGridViewRef',
					selector : 'sweepTxnViewType sweepTxnGridViewType'
				},
				{
					ref : 'sweepTxnDtlViewRef',
					selector : 'sweepTxnViewType sweepTxnGridViewType panel[itemId="sweepTxnDtlViewItemId"]'
				},
				{
					ref : 'sweepTxnGridRef',
					selector : 'sweepTxnViewType sweepTxnGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'sweepTxnViewType sweepTxnGridViewType sweepTxnGroupActionViewType'
				},*/
				{
					ref : 'sweepTxnFilterViewRef',
					selector : 'sweepTxnViewType sweepTxnFilterViewType'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'sweepTxnViewType sweepTxnFilterViewType button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'sweepTxnViewType sweepTxnFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'strStructureTypeValueLabel',
					selector : 'sweepTxnViewType sweepTxnFilterViewType label[itemId="strStructureTypeValue"]'
				},
				{
					ref : 'noPostStructureId',
					selector : 'sweepTxnViewType sweepTxnViewType combo[itemId=noPostStructureId]'
				}
			],
			config :
			{
				savePrefAdvFilterCode : null,
				filterCodeValue : null,
				sellerFilterVal : strSellerId,
				sellerFilterDesc : '',
				clientFilterVal : 'all',
				clientFilterDesc : 'all',
				agreementFilterVal : 'all',
				transactionType : 'all',
				transactionDesc : '',
				filterData : [],
				filterApplied : 'All',
				urlGridPref : 'userpreferences/sweepTxn/gridView.srvc?',
				urlGridFilterPref : 'userpreferences/sweepTxn/gridViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/sweepTxn.json',
				strPageName : 'lmsSweepTxnList',
				strDefaultMask : '000000000000000000',
				isSelectClient  : false,
				isSelectAggrCode : false,
				noPostStructureFilterVal : 'all',
				objLocalData : null,
				firstLoad : false
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
				
				me.firstLoad = true;
				if(objSaveLocalStoragePref){
					me.objLocalData = Ext.decode(objSaveLocalStoragePref);
					objQuickPref = me.objLocalData && me.objLocalData.d.preferences
										&& me.objLocalData.d.preferences.tempPref 
										&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
					
					me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
					
				}
				
				me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				$(document).on('aggreementLink', function(event) {
					submitForm('lmsSweepAgreementTxnList.srvc');
				});
				
				var btnClearPref = me.getBtnClearPreferences();
				if( btnClearPref )
				{
					btnClearPref.setEnabled( false );
				}

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				me.updateFilterConfig();
				$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
				me.control(
				{
					'sweepTxnViewType' :
					{
						render : function( panel )
						{
						}
					},
					/*'sweepTxnGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},
					'sweepTxnGridViewType smartgrid' :
					{
						render : function( grid )
						{
							me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
						{
							me.enableValidActionsForGrid( grid, record, recordIndex, records, jsonData );
						},
						statechange : function( grid )
						{
							me.toggleSavePrefrenceAction( true );
						},
						pagechange : function( pager, current, oldPageNum )
						{
							me.toggleSavePrefrenceAction( true );
						}
					},
					'sweepTxnViewType sweepTxnGridViewType toolbar[itemId=groupActionBarItemId]' :
					{
						performGroupAction : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					},*/
					'filterView' : {
						appliedFilterDelete : function(btn){
							me.handleAppliedFilterDelete(btn);
						}
					},
					
					'filterView button[itemId="clearSettingsButton"]' : {
						'click' : function() {
							me.handleClearSettings();
						}
					},
					
					'sweepTxnViewType groupView' : {
						'groupByChange' : function(menu, groupInfo) {
							me.doHandleGroupByChange(menu, groupInfo);
						},
						'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
								newCard, oldCard) {
							me.doHandleGroupTabChange(groupInfo, subGroupInfo,
									tabPanel, newCard, oldCard);
						},
						'gridRender' : me.doHandleLoadGridData,
						'gridPageChange' : me.doHandleLoadGridData,
						'gridSortChange' : me.doHandleLoadGridData,
						'gridPageSizeChange' : me.doHandleLoadGridData,
						'gridColumnFilterChange' : me.doHandleLoadGridData,
						'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
						/*'gridStateChange' : function(grid) {
							me.disablePreferencesButton("savePrefMenuBtn", false);
						},*/
						'toggleGridPager' : function() {
							me.disablePreferencesButton("savePrefMenuBtn", false);
						},
						'gridStoreLoad' : function(grid, store) {
							isGridLoaded = true;
							//disableGridButtons(false);
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
							me.applyPreferences();
						},
						'gridSettingClick' : function(){
							me.showPageSettingPopup('GRID');
						}
					},
					
					'sweepTxnViewType sweepTxnFilterViewType' :
					{
						render : function( panel, opts )
						{
							me.setInfoTooltip();
						},
						expand : function( panel )
						{
							me.toggleSavePrefrenceAction( true );
						},
						collapse : function( panel )
						{
							me.toggleSavePrefrenceAction( true );
						},
						filterTransactionType : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( true );
							me.handleTransactionTypeFilter( btn );
							me.callHandleLoadGridData();
						}
					},
					'sweepTxnFilterViewType combo[itemId="entitledSellerIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getSweepTxnFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientIdItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/sweepTxnAdminClientIdSeek.json';
							objAutocompleter.setValue( '' );
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : combo.getValue()
								}
							];
							me.handleSellerFilter( combo,combo.getValue() );
							me.callHandleLoadGridData();
							
						},
						render : function(){
							if (!Ext.isEmpty(me.sellerFilterDesc)) {
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var combo = objFilterPanel.down( 'combo[itemId="entitledSellerIdItemId"]' );
								combo.setValue(me.sellerFilterDesc);
							}
						}
					},
					'sweepTxnFilterViewType combo[itemId="clientCodeId"]' :
					{
						
						change : function( combo, record, index )
						{
							//TODO
							if(combo.value == 'all' || combo.value == ''|| combo.value == null) {
								
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var objAutocompleter = objFilterPanel
									.down( 'AutoCompleter[itemId="agreementItemId"]' );
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
								objAutocompleter.cfgSeekId = "sweepTxnIdSeekAll";
								me.handleAgreementCodeFilter('all');
								me.clientFilterDesc = 'all';
								me.handleClientFilter('all' );
								me.callHandleLoadGridData();
							}else{
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
								objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
								objAutocompleter.cfgSeekId = 'sweepTxnIdSeek';
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : combo.getRawValue()
									},
									{
										key : '$filtercode2',
										value : entity_type
									}
								];
								me.clientFilterDesc = combo.getDisplayValue();
								me.handleClientFilter( me.clientFilterVal );
								me.callHandleLoadGridData();
							}
						},
						render : function(){
							if (!Ext.isEmpty(me.clientFilterDesc) && me.clientFilterDesc != 'all') {
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var combo = objFilterPanel.down( 'combo[itemId="clientCodeId"]' );
								combo.setValue(me.clientFilterDesc);
							}
						}
					},
					'sweepTxnFilterViewType AutoCompleter[itemId="clientIdItemId"]' :
					{
						change : function( combo, record, oldVal )
						{
							//TODO
							if(Ext.isEmpty(combo.getRawValue())) {
								if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
								
								
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var objAutocompleter = objFilterPanel
									.down( 'AutoCompleter[itemId="agreementItemId"]' );
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
								objAutocompleter.cfgSeekId = "sweepTxnIdSeekAll";
								me.handleAgreementCodeFilter('all');
								me.clientFilterDesc = 'all';
								me.handleClientFilter('all' );
								objAutocompleter.cfgExtraParams =
									[
										{
											key : '$filtercode1',
											value : combo.getValue()
										},
										{
											key : '$filtercode2',
											value : entity_type
										}
									];
								me.setDataForFilter();		
								me.isSelectClient = true;
								me.callHandleLoadGridData();
								}
							}else{
								me.isSelectClient = false;
							}
						},
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getSweepTxnFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
							objAutocompleter.cfgSeekId = "sweepTxnIdSeek";
							objAutocompleter.setValue( '' );
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : record[ 0 ].data.CODE
								},
								{
									key : '$filtercode2',
									value : entity_type
								}
							];
							me.clientFilterDesc = record[ 0 ].data.DESCRIPTION;
							me.handleClientFilter( record[ 0 ].data.CODE );
							me.isSelectClient = true;
							me.callHandleLoadGridData();
						},
						keyup : function(combo, e, eOpts){
							me.isSelectClient = false;
						},
						blur : function(combo, The, eOpts ){
							if(me.isSelectClient == false  
									&& !Ext.isEmpty(combo.getRawValue()) 
									&& me.clientFilterDesc != combo.getRawValue() ){
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
								objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
								objAutocompleter.cfgSeekId = "sweepTxnIdSeek";
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgExtraParams =
									[
										{
											key : '$filtercode1',
											value : combo.getRawValue()
										},
										{
											key : '$filtercode2',
											value : entity_type
										}
									];
								me.clientFilterDesc = combo.getValue();
								me.handleClientFilter( combo.getValue() );
								me.callHandleLoadGridData();
							}
						},
						render : function(){
							if (!Ext.isEmpty(me.clientFilterDesc) && me.clientFilterDesc != 'all') {
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var combo = objFilterPanel.down( 'AutoCompleter[itemId="clientIdItemId"]' );
								combo.setValue(me.clientFilterDesc);
							}
						}
					},
					'sweepTxnFilterViewType AutoCompleter[itemId="agreementItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.handleAgreementCodeFilter( record[ 0 ].data.CODE );
							me.isSelectAggrCode = true;
							me.callHandleLoadGridData();
						},					
						change : function(combo, record, oldVal) {
							if(Ext.isEmpty(combo.getRawValue())) {
								if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
									me.handleAgreementCodeFilter('all');
									me.isSelectAggrCode = true;
									me.callHandleLoadGridData();
								}
							}else{
								me.isSelectAggrCode = false;
							}
						},
						keyup : function(combo, e, eOpts){
							me.isSelectAggrCode = false;
						},
						blur : function(combo, The, eOpts ){
							if(me.isSelectAggrCode == false  
									&& !Ext.isEmpty(combo.getRawValue()) 
									&& me.agreementFilterVal != combo.getRawValue() ){
								me.handleAgreementCodeFilter( combo.getValue() );
								me.callHandleLoadGridData();
							}
						},
						render : function(){
							if (!Ext.isEmpty(me.agreementFilterVal) && me.agreementFilterVal != 'all') {
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var combo = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
								combo.setValue(me.agreementFilterVal);
							}
						}
					},
					'sweepTxnViewType sweepTxnFilterViewType button[itemId="btnSavePreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleSavePreferences();
						}
					},
					'sweepTxnViewType sweepTxnFilterViewType button[itemId="btnClearPreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleClearPreferences();
						}
					},
					'sweepTxnViewType sweepTxnFilterViewType combo[itemId="noPostStructureId"]' : {
						select : function(combo, record, index) {
							me.handlenoPostStructureFilter(combo);
							me.callHandleLoadGridData();
						},
						render : function(){
							if (!Ext.isEmpty(me.noPostStructureFilterDesc) && me.noPostStructureFilterDesc != 'ALL') {
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var combo = objFilterPanel.down( 'combo[itemId="noPostStructureId"]' );
								combo.setValue(me.noPostStructureFilterDesc);
							}
						}
					},
					'sweepTxnViewType sweepTxnFilterViewType combo[itemId="transactionTypeId"]' : {
						render : function(){
							if (!Ext.isEmpty(me.transactionDesc)) {
								var objFilterPanel = me.getSweepTxnFilterViewRef();
								var combo = objFilterPanel.down( 'combo[itemId="transactionTypeId"]' );
								combo.setValue(me.transactionDesc);
							}
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
					
				} );
			},
			setDataForFilter : function()
			{
				var me = this;
				if( this.filterApplied === 'Q' || this.filterApplied === 'All' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				if( me.sellerFilterVal != 'all' )
				{
					if(Ext.isEmpty(me.sellerFilterDesc)){
						me.sellerFilterDesc = strSellerDesc;
					}
					jsonArray.push(
					{
						paramName : 'sellerCode',
						paramValue1 : encodeURIComponent(me.sellerFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('financialInstitution','Financial Institution'),
						displayValue1 : me.sellerFilterDesc
					} );
				}
				if( me.clientFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'clientCode',
						paramValue1 : me.clientFilterVal,
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('lblcompany', 'Company'),
						displayValue1 : me.clientFilterDesc	
					} );
				}
				if( me.agreementFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'agreementCode',
						paramValue1 : me.agreementFilterVal,
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('agreementCode', 'Agreement'),
						displayValue1 : me.agreementFilterVal
						
					} );
				}
				if( me.transactionType != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'transactionType',
						paramValue1 : me.transactionType,
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel( 'transactionType', 'Transaction Type' ),
						displayValue1 : me.transactionDesc

					} );
				}
				if (me.noPostStructureFilterVal != 'all') {
					jsonArray.push({
						paramName : 'noPostStructure',
						paramValue1 : me.noPostStructureFilterVal,
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('noPostStructure', 'Live / Non Live'),
						displayValue1 : me.noPostStructureFilterDesc
					});
				}
				/*if( entity_type != '' )
				{
					jsonArray.push(
					{
						paramName : 'entityType',
						paramValue1 : entity_type,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}*/
				return jsonArray;
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var sweepTxn = me.getSweepTxnGridRef();
				var objConfigMap = me.getSweepTxnConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( sweepTxn ) )
				{
					if( !Ext.isEmpty( objGridViewPref ) )
					{
						data = Ext.decode( objGridViewPref );
						objPref = data[ 0 ];
						arrColsPref = objPref.gridCols;
						arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
						pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 5;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
					else if( objConfigMap.arrColsPref )
					{
						arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
						pgSize = 5;
						me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
					}
				}
				else
				{
					me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
				}
			},

			handleSmartGridLoading : function( arrCols, storeModel, pgSize )
			{
				var me = this;
				var pgSize = null;
				var alertSummaryGrid = null;
				pgSize = 100;
				sweepTxn = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					checkBoxColumnWidth : _GridCheckBoxWidth,
					pageSize : _GridSizeMaster,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : true,
					cls:'t7-grid',
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					padding : '5 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,					
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},
					handleRowMoreMenuItemClick : function( menu, event )
					{
						var dataParams = menu.ownerCt.dataParams;
						me.handleRowIconClick( dataParams.view, dataParams.rowIndex, dataParams.columnIndex, this,
							event, dataParams.record );
					}
				} );

				var sweepTxnDtlView = me.getSweepTxnDtlViewRef();
				sweepTxnDtlView.add( sweepTxn);
				sweepTxnDtlView.doLayout();
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				//Action Name - auth , reject ,History
				if( actionName === 'accept' || actionName === 'reject')
					me.handleGroupActions( btn, record );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ) );
					}
				}
			},
			showHistory : function( url, id )
			{
				var historyPopup = Ext.create( 'GCP.view.SweepTxnHistory',
				{
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					identifier : id
				} );
				historyPopup.show();
				historyPopup.center();
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
			getSweepTxnConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"agreementCode" : 200,
					"agreementName" : 220,
					"clientDesc" : 220,
					"transactionType" : 150,
					"transactionRemarks" : 300
				};
				arrColsPref =
				[
					{
						"colId" : "agreementCode",
						"colDesc" : getLabel( 'agreementCode', 'Agreement Code' )
					},
					{
						"colId" : "agreementName",
						"colDesc" : getLabel( 'agreementDesc', 'Agreement Description' )
					},
					{
						"colId" : "clientDesc",
						"colDesc" : getLabel( 'grid.column.company', 'Company Name' )
					},
					{
						"colId" : "transactionType",
						"colDesc" : getLabel( 'transactionType', 'Transaction Type' )
					},
					{
						"colId" : "transactionRemarks",
						"colDesc" : getLabel( 'lblRemarks', 'Remarks' )
					}
					
				];

				storeModel =
				{
					fields :
					[
						'changeId','agreementCode', 'agreementName', 'clientDesc', 'sellerDesc',
						'__metadata','identifier','history','transactionType','transactionRemarks'
					],
					proxyUrl : 'getLmsSweepTxnList.srvc',
					rootNode : 'd.sweepTxnList',
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
			handleSellerFilter : function( combo,selectedValue )
			{
				var me = this;
				me.sellerFilterVal = selectedValue;
				me.sellerFilterDesc = combo.getRawValue();
			},
			handleClientFilter : function( selectedValue )
			{
				var me = this;
				me.clientFilterVal = selectedValue;
			},
			handleAgreementCodeFilter : function( selectedValue )
			{
				var me = this;
				me.agreementFilterVal = selectedValue;
			},
			handleTransactionTypeFilter : function( btn )
			{
				var me = this;
				me.transactionType = btn.value;
				me.transactionDesc = btn.rawValue;
			},
			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getGroupView().getGrid();
				me.setDataForFilter();				
				var objGroupView = me.getGroupView();
				objGroupView.refreshData();			
			},
			handlenoPostStructureFilter : function(combo) {
				var me = this;
				me.noPostStructureFilterVal = combo.getValue();
				me.noPostStructureFilterDesc = combo.getRawValue();
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
				
					//quick
					var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
					if (!Ext.isEmpty(reqJsonInQuick) && paramName == "clientCode"){
						arrQuickJson = quickJsonData;
						arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
						arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,"agreementCode");
						me.filterData = arrQuickJson;
					}else{
						arrQuickJson = quickJsonData;
						arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
						me.filterData = arrQuickJson;
					}
					me.resetFieldInQuickOnDelete(objData);
					var objGroupView = me.getGroupView();
					objGroupView.refreshData();
					var grid = objGroupView.getGrid();
					grid.removeAppliedSort();
					//me.refreshData();
				}
			},
			
			resetFieldInQuickOnDelete : function(objData){
				var me = this,strFieldName;
				if(!Ext.isEmpty(objData))
					strFieldName = objData.paramName || objData.field;
				if(strFieldName ==='clientCode'){			
					var agreementItem = me.getSweepTxnFilterViewRef()
							.down('combo[itemId="agreementItemId]');
					agreementItem.reset();
					me.agreementFilterVal = 'all'; 
					if(entity_type === "1" ){ 
						var clientComboBox = me.getSweepTxnFilterViewRef()
								.down('combo[itemId="clientCodeId"]');
						me.clientFilterVal = 'all';
						me.clientFilterDesc = '';
						clientComboBox.setValue(me.clientFilterVal);						
					} else {
						var clientComboBox = me.getSweepTxnFilterViewRef()
								.down('combo[itemId="clientIdItemId]');
						clientComboBox.reset();
						me.clientFilterVal = 'all';
						me.clientFilterDesc = '';
					}
					
				}else if(strFieldName === 'transactionType'){
					var objField = me.getSweepTxnFilterViewRef().down('combo[itemId="transactionTypeId"]');
					if(!Ext.isEmpty(objField)){
						me.transactionType = 'all';
						me.transactionDesc = '';
						objField.setValue(me.transactionType);		
					}
				}else if(strFieldName === 'agreementCode'){
					var clientComboBox = me.getSweepTxnFilterViewRef()
							.down('combo[itemId="agreementItemId]');
					clientComboBox.reset();
					me.agreementFilterVal = 'all';
				}
				else if(strFieldName === 'noPostStructure'){
					var noPostSructureObj = me.getSweepTxnFilterViewRef().down('combo[itemId="noPostStructureId"]');
					if(!Ext.isEmpty(noPostSructureObj)){
						noPostSructureObj.setValue('all');
						me.noPostStructureFilterVal = 'all';
					}
				}
				else if(strFieldName === 'sellerCode'){
					if(multipleSellersAvailable == true  && entity_type === '0'){
						var sellercomboObj = me.getSweepTxnFilterViewRef()
							.down('combo[itemId="entitledSellerIdItemId]');
						if(!Ext.isEmpty(sellercomboObj))
							sellercomboObj.setValue('');
						me.sellerFilterVal = 'all';
						me.sellerFilterDesc = 'all';
					}
				}
			},
			
			handleClearSettings : function() {
				var me = this,strFieldName;
				
				if(multipleSellersAvailable == true  && entity_type === '0'){
					var sellercomboObj = me.getSweepTxnFilterViewRef()
						.down('combo[itemId="entitledSellerIdItemId]');
					if(!Ext.isEmpty(sellercomboObj))
						sellercomboObj.setValue('');
					me.sellerFilterVal = 'all';
					me.sellerFilterDesc = 'all';
				}
				
				var agreementItem = me.getSweepTxnFilterViewRef()
						.down('combo[itemId="agreementItemId]');
				agreementItem.reset();
				me.agreementFilterVal = 'all'; 
				
				if(entity_type === "1" ){ 
					var clientComboBox = me.getSweepTxnFilterViewRef()
							.down('combo[itemId="clientCodeId"]');
					me.clientFilterVal = 'all';
					me.clientFilterDesc = '';
					clientComboBox.setValue(me.clientFilterVal);						
				} else {
					var clientComboBox = me.getSweepTxnFilterViewRef()
							.down('combo[itemId="clientIdItemId]');
					clientComboBox.reset();
					me.clientFilterVal = 'all';
					me.clientFilterDesc = '';
				}

				var objField = me.getSweepTxnFilterViewRef().down('combo[itemId="transactionTypeId"]');
				if(!Ext.isEmpty(objField)){
					me.transactionType = 'all';
					me.transactionDesc = '';
					objField.setValue(me.transactionType);		
				}
				
				var noPostSructureObj = me.getSweepTxnFilterViewRef().down('combo[itemId="noPostStructureId"]');
				if(!Ext.isEmpty(noPostSructureObj)){
					noPostSructureObj.setValue('all');
					me.noPostStructureFilterVal = 'all';
				}
				
				me.setDataForFilter();
				var objGroupView = me.getGroupView();
				objGroupView.refreshData();
				var grid = objGroupView.getGrid();
				grid.removeAppliedSort();
			},			
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
				grid.loadGridData( strUrl, null );
			},
			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', isFilterApplied = 'false';

				if( me.filterApplied === 'All' || me.filterApplied === 'Q' )
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += strQuickFilterUrl;
						isFilterApplied = true;
					}
					return strUrl;
				}
			},
			generateUrlWithQuickFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '';
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
			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '00000000';
				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < selectedRecords.length ; index++ )
				{
					objData = selectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
				}
				actionMask = doAndOperation( maskArray, 8 );
				me.enableDisableGroupActions( actionMask, isSameUser );
			},
			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'sweepTxn/{0}.srvc?', strAction );
				strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, record );
				}
				else
				{
					this.preHandleGroupActions( strUrl, '', record );
				}
			},
			showRejectVerifyPopUp : function( strAction, strActionUrl, record )
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					titleMsg = getLabel( 'rejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					fieldLbl = getLabel( 'rejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls : 't7-popup',
					style :
					{
						height : 400
					},
					bodyPadding : 0,
					fn : function( btn, text )
					{
						if(text.length >255) {
							Ext.Msg.alert(getLabel('filterPopupTitle','Error'), getLabel('rejectRestrictionError','Reject remark should be less than 255 characters'));
							return false;
						}
						if( btn == 'ok' )
						{
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel('filterPopupTitle','Error'),  getLabel('rejectRemarkError','Reject Remark field can not be blank'));
							}
							else
							{
								me.preHandleGroupActions( strActionUrl, text, record );
							}
						}
					}
				} );
			},
			preHandleGroupActions : function( strUrl, remark, record )
			{
				var me = this;
				//var grid = this.getSweepTxnGridRef();
				var groupView = me.getGroupView();
				var grid = groupView.getGrid();
				if( !Ext.isEmpty( grid ) )
				{
					var arrayJson = new Array();
					var records = grid.getSelectedRecords();
					records = ( !Ext.isEmpty( records ) && Ext.isEmpty( record ) ) ? records :  record ; //record || [] ; 
					if(!Ext.isEmpty(records.length)){
						//For Multiple records
						for( var index = 0 ; index < records.length ; index++ )
						{
							arrayJson.push(
							{
								serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
								identifier : records[ index ].data.identifier,
								userMessage : remark
							} );
						}
					}else{
						//For Single record
						arrayJson.push(
								{
									serialNo : grid.getStore().indexOf( records ) + 1,
									identifier : records.data.identifier,
									userMessage : remark
								} );
					}
					
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						});
					Ext.Ajax.request(
					{
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),
						success : function( response )
						{
							var jsonRes = Ext.JSON.decode(response.responseText);
							var errors = '';
							for (var i in jsonRes.d.instrumentActions) {
								if (jsonRes.d.instrumentActions[i].errors) {
									for (var j in jsonRes.d.instrumentActions[i].errors) {
										errors += jsonRes.d.instrumentActions[i].errors[j].errorMessage + "<br\>";
									}
								}
							}
							if (errors != '') {
								Ext.MessageBox.show(
								{
									title : getLabel( 'filterPopupTitle', 'Error' ),
									msg : errors,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
							//me.enableDisableGroupActions( '00000000', true );
							//grid.refreshData();
							groupView.handleGroupActionsVisibility(me.strDefaultMask);
							grid.refreshData();
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
				}

			},
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 8;
				var maskArray = new Array();
				var actionMask = '';
				var rightsMap = record.data.__metadata.__rightsMap;
				var buttonMask = '';
				var retValue = true;
				var bitPosition = '';
				if( !Ext.isEmpty( maskPosition ) )
				{
					bitPosition = parseInt( maskPosition,10 ) - 1;
					maskSize = maskSize;
				}
				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push( buttonMask );
				maskArray.push( rightsMap );
				actionMask = doAndOperation( maskArray, maskSize );
				var isSameUser = true;
				if( record.raw.makerId === USER )
				{
					isSameUser = false;
				}
				if( Ext.isEmpty( bitPosition ) )
					return retValue;
				retValue = isActionEnabled( actionMask, bitPosition );
				if( ( maskPosition === 7 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 8 && retValue )
				{
					retValue = retValue && isSameUser;
				}
				return retValue;
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
			enableDisableGroupActions : function( actionMask, isSameUser )
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 7 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 8 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
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
				//arrCols.push( me.createGroupActionColumn() );
				arrCols.push( me.createActionColumn() );
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
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				if (record.get('isEmpty')) {
					if (rowIndex === 0 && colIndex === 0) {
						meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
						return getLabel('gridNoDataMsg',
								'No records found !!!');											
					}
				} else
					return value;
			},
			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'action',
					sortable : false,
					align : 'left',
					width : 70,
					locked : true,
					items :
					[
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							toolTip : getLabel( 'historyToolTip', 'View History' ),
							maskPosition : 1
						}
					]
				};
				return objActionCol;
			},
			/*createGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'action',
					colId : 'deleteActionDtl',
					width : 100,
					sortable : false,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'accept',
							itemCls : 'grid-row-text-icon icon-auth-text',
							toolTip : getLabel( 'approve', 'Approve' ),
							maskPosition : 2
						},
						{
							itemId : 'reject',
							itemCls : 'grid-row-text-icon icon-reject-text',
							toolTip : getLabel( 'reject', 'Reject' ),
							maskPosition : 3
						}
					]
				};
				return objActionCol;
			},*/
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
						// Change content dynamically depending on which
						// element
						// triggered the show.
						beforeshow : function( tip )
						{
							var sellerFilter = me.sellerFilterVal;
							var clientFilter = me.clientFilterDesc;
							var agreementFilter = me.agreementFilterVal;
							var transactionType = me.transactionType ;
							
							var objTransactionTypeLbl =
							{
								'1' : getLabel( 'lblAdjustment', 'Adjustment' ),
								'2' : getLabel( 'lblTransfer', 'Transfer' ),
								'3' : getLabel( 'lblExecute', 'Execute' ),
								'4' : getLabel( 'lblSimulate', 'Simulate' ),
								'5' : getLabel( 'lblCancelSchedule', 'Cancel Schedule' ),
								'all':'All'
							};
							
							tip.update( getLabel( 'lbl.notionalMst.seller', 'Financial Institution' ) + ' : ' + sellerFilter + '<br/>'
								+ getLabel( 'grid.column.company', 'Company Name' ) + ':' + clientFilter +  '<br/>'
								+ getLabel( 'agreementCode', 'Agreement Code' ) + ':' + agreementFilter +  '<br/>'
								+ getLabel( 'transactionType', 'Transaction Type' ) + ':' + objTransactionTypeLbl[transactionType] );
						}
					}
				} );
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
			updateFilterConfig : function()
			{
				var me = this;
				var arrJsn = new Array();
				// TODO : Localization to be handled..

				if( !Ext.isEmpty( objDefaultGridViewPref ) )
				{
					var data = Ext.decode( objDefaultGridViewPref );
					me.sellerFilterVal = data.quickFilter.sellerId;
					me.clientFilterVal = data.quickFilter.clientId;
					me.agreementFilterVal = data.quickFilter.agreementCode
					me.transactionType = data.quickFilter.tranactionType
				}
				me.filterData = me.getQuickFilterQueryJson();
			},
			doHandleGroupByChange : function(menu, groupInfo) {
				var me = this;
				/*if (me.previouGrouByCode === 'PAYSUM_OPT_ADVFILTER') {
					me.savePrefAdvFilterCode = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
				}
				if (groupInfo && groupInfo.groupTypeCode === 'PAYSUM_OPT_ADVFILTER') {
					me.previouGrouByCode = groupInfo.groupTypeCode;
				} else
					me.previouGrouByCode = null;*/
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
			postHandleDoHandleGroupTabChange : function(data, args) {
				var me = args ? args.scope : this;
				me.handleReconfigureGrid(data);
			},
			handleReconfigureGrid : function(data) {
				var me = this;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getSweepTxnViewRef(), gridModel = null, objData = null;
				var colModel = null, arrCols = null;

				var intPageSize = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
				  && me.objLocalData.d.preferences.tempPref
				  && me.objLocalData.d.preferences.tempPref.pageSize
				  ? me.objLocalData.d.preferences.tempPref.pageSize
				  : '';
				var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
						&& me.objLocalData.d.preferences.tempPref
						&& me.objLocalData.d.preferences.tempPref.pageNo
						? me.objLocalData.d.preferences.tempPref.pageNo
						: 1;
				var sortState = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
					&& me.objLocalData.d.preferences.tempPref
					&& me.objLocalData.d.preferences.tempPref.sorter
					? me.objLocalData.d.preferences.tempPref.sorter
					: [];
				
				if (data && data.preference)
					objData = Ext.JSON.decode(data.preference)
				if (_charCaptureGridColumnSettingAt === 'L' && objData
						&& objData.gridCols) {
					arrCols = objData.gridCols;
					colModel = objSummaryView.getColumnModel(arrCols);
					if (colModel) {
						gridModel = {
							columnModel : colModel,
							pageSize : intPageSize,
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
				// TODO : Preferences and existing column model need to be merged
				objGroupView.reconfigureGrid(gridModel);
			},
			doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
					newPgNo, oldPgNo, sorter, filterData) {
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
				
				objGroupView.handleGroupActionsVisibility(buttonMask);
				
				me.setDataForFilter(); 
				
				if(allowLocalPreference === 'Y')
					me.handleSaveLocalStorage();
				
				var intPageNo = me.objLocalData.d && me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.pageNo
				? me.objLocalData.d.preferences.tempPref.pageNo
				: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
				
				if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
					intNewPgNo = intPageNo;
					intOldPgNo = intPageNo;
				}

				me.firstLoad = false;
				
				var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
				var filterUrl = me.generateFilterUrl(subGroupInfo, groupInfo);
				var columnFilterUrl = me.generateColumnFilterUrl(filterData);
				if (!Ext.isEmpty(filterUrl)) {
					strUrl += filterUrl;
					if (!Ext.isEmpty(columnFilterUrl))
						strUrl += ' and ' + columnFilterUrl;
				} else {
					if (!Ext.isEmpty(columnFilterUrl))
						strUrl += "&$filter=" + columnFilterUrl;
				}

				if (!Ext.isEmpty(me.filterData)) {
					if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
						if(multipleSellersAvailable == true  && entity_type === '0'){
							arrOfParseQuickFilter = generateFilterArray(me.filterData);
						}
						else{
							var quickJsonData = me.filterData;
							var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'sellerCode');
							if (!Ext.isEmpty(reqJsonInQuick)) {
								arrQuickJson = quickJsonData;
								arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'sellerCode');
								quickJsonData = arrQuickJson;
							}
							arrOfParseQuickFilter = generateFilterArray(quickJsonData);
						}
					}
				}

				if (!Ext.isEmpty(me.advFilterData)) {
					if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
						arrOfParseAdvFilter = generateFilterArray(me.advFilterData, strApplicationDateFormat);
					}
				}

				if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
					arrOfFilteredApplied = arrOfParseQuickFilter
							.concat(arrOfParseAdvFilter);
						
					if (arrOfFilteredApplied)
						me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
				}

				me.reportGridOrder = strUrl;
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
			doHandleRowActions : function(actionName, objGrid, record) {
				var me = this;
				if( actionName === 'approve' || actionName === 'reject')
					//me.handleGroupActions( actionName, record );
					me.doHandleGroupActions(actionName, objGrid, record, 'rowAction');
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ) );
					}
				}
			},
			generateFilterUrl : function(subGroupInfo, groupInfo) {
				var me = this;
				var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
					me.setDataForFilter();
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
					if (!Ext.isEmpty(strQuickFilterUrl)) {
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
					
				if (!Ext.isEmpty(strGroupQuery)) {
					if (!Ext.isEmpty(strUrl))
						strUrl += ' and ' + strGroupQuery;
					else
						strUrl += '&$filter=' + strGroupQuery;
				}
				strUrl+= '&'+csrfTokenName+'='+csrfTokenValue;
				return strUrl;
			},
			generateColumnFilterUrl : function(filterData) {
				var strTempUrl = '';
				var obj = null, arrValues = null;
				var arrNested = null
				// TODO: This is currently handled only for type list, to be handled for
				// rest types
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
				return strTempUrl;
			},
			doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
					objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
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
				}
				if (isSameUser == false) {
					buttonMask = me.replaceCharAtIndex(6, '0', buttonMask);
					buttonMask = me.replaceCharAtIndex(7, '0', buttonMask);
					maskArray.push(buttonMask);
				}
				actionMask = doAndOperation( maskArray, 8 );
				objGroupView.handleGroupActionsVisibility(actionMask);
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
			replaceCharAtIndex : function(index, character, strInput) {
				return strInput.substr(0, index) + character
						+ strInput.substr(index + 1);
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
				} else{
					me.handleClearLocalPrefernces();
					me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
							me.postHandleRestorePageSetting, null, me, false);
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
				objColumnSetting = SWEEP_TXN_GENERIC_COLUMN_MODEL;
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
							: SWEEP_TXN_GENERIC_COLUMN_MODEL || [];

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
							title : strTitle
						});
				me.pageSettingPopup.show();
				me.pageSettingPopup.center();
			},
			doHandleGroupActions : function(strAction, grid, record,
					strActionType) {
				var me = this;
				var strUrl = Ext.String.format( 'sweepTxn/{0}.srvc?', strAction );
				strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, record );
				}
				else
				{
					this.preHandleGroupActions( strUrl, '', record);
				}
			},
			applyPreferences : function(){
				var me = this, objJsonData='', objLocalJsonData='';
				if (objSweepTxnSummaryPref || objSaveLocalStoragePref) {
								objJsonData = Ext.decode(objSweepTxnSummaryPref);
								objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
								
								if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
										if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
											var quickPref = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
											for(var i=0;i<quickPref.length;i++){
												if(quickPref[i].paramName == "sellerCode"){
													me.sellerFilterVal = quickPref[i].paramValue1;
													me.sellerFilterDesc = quickPref[i].displayValue1;
												}
												if(quickPref[i].paramName == "clientCode"){
													me.clientFilterVal = quickPref[i].paramValue1;
													me.clientFilterDesc = quickPref[i].displayValue1;
												}
												if(quickPref[i].paramName == "agreementCode"){
													me.agreementFilterVal = quickPref[i].paramValue1;
												}
												if(quickPref[i].paramName == "transactionType"){
													me.transactionType = quickPref[i].paramValue1;
													me.transactionDesc = quickPref[i].displayValue1;
												}
												if(quickPref[i].paramName == "noPostStructure"){
													me.noPostStructureFilterVal = quickPref[i].paramValue1;
													me.noPostStructureFilterDesc = quickPref[i].displayValue1;
												}
											}
										}
								}
							}
			},
		/* State handling at local storage starts */
			
			handleSaveLocalStorage : function(){
				var me=this,arrSaveData = [], objSaveState = {},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
				if (objGroupView)
					subGroupInfo = objGroupView.getSubGroupInfo();
				
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
			}
		} );
