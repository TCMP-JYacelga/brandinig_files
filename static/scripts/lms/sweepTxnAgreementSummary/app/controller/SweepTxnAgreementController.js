Ext
	.define(
		'GCP.controller.SweepTxnAgreementController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
			 	'Ext.ux.gcp.DateHandler','Ext.ux.gcp.PageSettingPopUp'
			],
			views :
			[
			 	'GCP.view.SweepTxnAgreementView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			},{
				ref : 'sweepTxnAgreementViewType',
				selector : 'sweepTxnAgreementViewType'
			},{
				ref : 'groupView',
				selector : 'sweepTxnAgreementViewType groupView'
			},{
				ref : 'filterView',
				selector : 'filterView'
			},{
				ref : 'sweepTxnAgreementFilterViewType',
				selector : 'sweepTxnAgreementFilterViewType'
			},
				{
					ref : 'sweepTxnAgreementGridViewRef',
					selector : 'sweepTxnAgreementViewType sweepTxnAgreementGridViewType'
				},
				{
					ref : 'sweepTxnAgreementDtlViewRef',
					selector : 'sweepTxnAgreementViewType sweepTxnAgreementGridViewType panel[itemId="sweepTxnAgreementDtlViewItemId"]'
				},
				{
					ref : 'sweepTxnAgreementGridRef',
					selector : 'sweepTxnAgreementViewType sweepTxnAgreementGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'sweepTxnAgreementViewType sweepTxnAgreementGridViewType sweepTxnAgreementGroupActionViewType'
				},
				{
					ref : 'sweepTxnAgreementFilterViewRef',
					selector : 'sweepTxnAgreementViewType sweepTxnAgreementFilterViewType'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'sweepTxnAgreementViewType sweepTxnAgreementFilterViewType button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'sweepTxnAgreementViewType sweepTxnAgreementFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'strStructureTypeValueLabel',
					selector : 'sweepTxnAgreementViewType sweepTxnAgreementFilterViewType label[itemId="strStructureTypeValue"]'
				},
				{
					ref : 'noPostStructureId',
					selector : 'sweepTxnAgreementViewType sweepTxnAgreementFilterViewType combo[itemId=noPostStructureId]'
				}
			],
			config :
			{
				savePrefAdvFilterCode : null,
				filterCodeValue : null,
				globalRecord : null ,
				sellerFilterVal : strSellerId,
				sellerFilterDesc : '',
				clientFilterVal : 'all',
				clientFilterDesc : 'all',
				agreementFilterVal : 'all',
				structureType : 'all',
				structureTypeDesc : '',
				statusType : 'all',
				filterData : [],
				filterApplied : 'All',
				urlGridPref : 'userpreferences/sweepTxnAgreement/gridView.srvc?',
				urlGridFilterPref : 'userpreferences/sweepTxnAgreement/gridViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/sweepTxnAgreement.json',
				strDefaultMask : '000000000',
				pageSettingPopup : null,
				strPageName : 'sweepTxnAgreement',
				preferenceHandler : null,
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
				
				$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
				
				var btnClearPref = me.getBtnClearPreferences();
				if( btnClearPref )
				{
					btnClearPref.setEnabled( false );
				}

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				//me.updateFilterConfig();
				me.control(
				{
					
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
					'sweepTxnAgreementViewType groupView' : {
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
						'gridStateChange' : function(grid) {
						},
						'toggleGridPager' : function() {
						},
						'gridStoreLoad' : function(grid, store) {
							//isGridLoaded = true;
							//disableGridButtons(false);
						},
						'gridRowActionClick' : function(grid, rowIndex, columnIndex,
								actionName, record) {
							me.doHandleRowActions(actionName, grid, record);
						},
						'groupActionClick' : function(actionName, isGroupAction,
								maskPosition, grid, arrSelectedRecords) {
							if (isGroupAction === true)
								me.handleGroupActions(actionName, grid,
										arrSelectedRecords);
						},
						'render' : function() {
							me.applyPreferences();
						},
						'gridSettingClick' : function(){
							me.showPageSettingPopup('GRID');
						}
					},
					'filterView button[itemId="clearSettingsButton"]' : {
						'click' : function() {
							me.handleClearSettings();
						}
					},
					'filterView' : {
						appliedFilterDelete : function(btn){
							me.handleAppliedFilterDelete(btn);
						}
					},
					
				/*	
					'sweepTxnAgreementViewType' :
					{
						render : function( panel )
						{
						}
					},*/
					/*'sweepTxnAgreementGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},*/
					/*'sweepTxnAgreementGridViewType smartgrid' :
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
					},*/
					/*'sweepTxnAgreementViewType sweepTxnAgreementGridViewType toolbar[itemId=groupActionBarItemId]' :
					{
						performGroupAction : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					},*/
					'sweepTxnAgreementFilterViewType combo[itemId="structureTypeId"]' :
					{
						select : function( combo, record, index ){
							me.handleStructureTypeFilter(combo);
							me.refreshData();
						},
						boxready : function(combo, width, height, eOpts){
							if (!Ext.isEmpty(me.structureTypeDesc)) {
								combo.setValue(me.structureTypeDesc);
							}
						}
					},
					'sweepTxnAgreementFilterViewType combo[itemId="entitledSellerIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getSweepTxnAgreementFilterViewRef();
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
							strSellerId = combo.getValue();
							objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
							objAutocompleter.setValue( '' );
							objAutocompleter.cfgSeekId = entity_type === '1' ? 
									'sweepTxnAgreementIdSeek' : 'sweepTxnAgreementIdSeekAll',
							objAutocompleter.cfgExtraParams = entity_type === '1' ? [{
								key : '$filtercode1',
								value : strClientId
							  } ] : [{
							  	key : '$filtercode1',
								value : strSellerId
							  }];
							me.handleSellerFilter(combo ,combo.getValue());
						},
						boxready : function(combo, width, height, eOpts){
							if (!Ext.isEmpty(me.sellerFilterDesc)) {
								combo.setValue(me.sellerFilterDesc);
							}
						}
					},
					'sweepTxnAgreementFilterViewType combo[itemId="clientCodeId"]' :
					{
						
						change : function( combo, record, index )
						{
							strClientId = combo.getValue();
							if(combo.value == ''|| combo.value == null) {								
								var objFilterPanel = me.getSweepTxnAgreementFilterViewRef();
								var objAutocompleter = objFilterPanel
									.down( 'AutoCompleter[itemId="agreementItemId"]' );
								objAutocompleter.cfgSeekId = entity_type === '1' ?
										'sweepTxnAgreementIdSeek' : 'sweepTxnAgreementIdSeekAll';
								objAutocompleter.cfgExtraParams = entity_type === '1' ? [{
									key : '$filtercode1',
									value : strClientId
								  } ] : [{
								  	key : '$filtercode1',
									value : strSellerId
								  }]
								objAutocompleter.setValue( '' );
								me.handleAgreementCodeFilter('all');
								me.clientFilterDesc = 'all';
								me.handleClientFilter('all' );
								me.refreshData();
							}
						},
						select : function( combo, record, index )
						{
							strClientId = combo.getValue();
							var objFilterPanel = me.getSweepTxnAgreementFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
							objAutocompleter.cfgSeekId = entity_type === '1' ?
									'sweepTxnAgreementIdSeek' : 'sweepTxnAgreementIdAdminSeek';
							objAutocompleter.cfgExtraParams = entity_type === '1' ? [{
									key : '$filtercode1',
									value : strClientId
								 } ] : [{
									key : '$filtercode2',
									value : strClientId
								 },{
								  	key : '$filtercode1',
									value : strSellerId
								 }];
							objAutocompleter.setValue( '' );
							me.clientFilterDesc = combo.getDisplayValue();
							me.handleClientFilter( combo.getValue() );
							me.refreshData();
						},
						boxready : function(combo, width, height, eOpts){
							if (!Ext.isEmpty(me.clientFilterDesc) && me.clientFilterDesc != 'all') {
								combo.setValue(me.clientFilterDesc);
							}
						}
					},
					'sweepTxnAgreementFilterViewType AutoCompleter[itemId="clientIdItemId"]' :
					{
						change : function( combo, record, oldVal )
						{
							if(Ext.isEmpty(combo.getRawValue())) {
								if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
									var objFilterPanel = me.getSweepTxnAgreementFilterViewRef();
									var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
									objAutocompleter.setValue('');
									objAutocompleter.cfgSeekId = "sweepTxnAgreementIdSeekAll";
									me.handleAgreementCodeFilter('all');
									me.clientFilterDesc = 'all';
									me.handleClientFilter('all' );
									objAutocompleter.cfgExtraParams =
										[
											{
												key : '$filtercode1',
												value : strSellerId
											}
										];
									me.isSelectClient = true;
									me.refreshData();
								}
							}else{
								me.isSelectClient = false;
							}
						},						
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getSweepTxnAgreementFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
							objAutocompleter.cfgSeekId = entity_type === '1' ?
									'sweepTxnAgreementIdSeek' : 'sweepTxnAgreementIdAdminSeek';
							strClientId = record[0].data.CODE;
							objAutocompleter.cfgExtraParams = entity_type === '1' ? [{
									key : '$filtercode1',
									value : strClientId
								 } ] : [{
									key : '$filtercode2',
									value : strClientId
								 },{
								  	key : '$filtercode1',
									value : strSellerId
								 }];
							objAutocompleter.setValue( '' );
							me.clientFilterDesc = record[ 0 ].data.DESCRIPTION;
							me.handleClientFilter( record[ 0 ].data.CODE );
							me.isSelectClient = true;
							me.refreshData();
						},
						keyup : function(combo, e, eOpts){
							me.isSelectClient = false;
						},
						blur : function(combo, The, eOpts ){
							if(me.isSelectClient == false  
									&& !Ext.isEmpty(combo.getRawValue()) 
									&& me.clientFilterDesc != combo.getRawValue() ){
								var objFilterPanel = me.getSweepTxnAgreementFilterViewRef();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
								objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
								objAutocompleter.cfgSeekId = "sweepTxnAgreementIdSeek";
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgExtraParams =
									[
										{
											key : '$filtercode1',
											value : combo.getRawValue()
										}
									];
								me.clientFilterDesc = combo.getValue();
								me.handleClientFilter( combo.getValue() );
								me.refreshData();
							}
						},
						boxready : function(combo, width, height, eOpts){
							if (!Ext.isEmpty(me.clientFilterDesc) && me.clientFilterDesc != 'all') {
								combo.setValue(me.clientFilterDesc);
							}
						}
					},
					'sweepTxnAgreementFilterViewType AutoCompleter[itemId="agreementItemId"]' :
					{
						select : function(combo, record, index) {
							me.handleAgreementCodeFilter( record[ 0 ].data.CODE );
							me.isSelectAggrCode = true;
							me.refreshData();
						},					
						change : function(combo, record, oldVal) {
							if(Ext.isEmpty(combo.getRawValue())) {
								if(!Ext.isEmpty(oldVal) && oldVal.replace(/[%]/g,"") !== "") {
									me.handleAgreementCodeFilter('all');
									me.refreshData();
								}
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
								me.refreshData();
							}
						},
						boxready : function(combo, width, height, eOpts){
							if (!Ext.isEmpty(me.agreementFilterVal) && me.agreementFilterVal != 'all') {
								combo.setValue(me.agreementFilterVal);
							}
						}
					},
					/*'sweepTxnAgreementViewType sweepTxnAgreementFilterViewType button[itemId="btnSavePreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleSavePreferences();
						}
					},
					'sweepTxnAgreementViewType sweepTxnAgreementFilterViewType button[itemId="btnClearPreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleClearPreferences();
						}
					},*/
					/*'sweepTxnAgreementViewType sweepTxnAgreementFilterViewType button[itemId="btnFilter"]' : {
						click : function(btn, opts) {
							me.callHandleLoadGridData();
						}
					}*/
					'sweepTxnAgreementFilterViewType combo[itemId="noPostStructureId"]' : {
						select : function(combo, record, index) {
						me.handlenoPostStructureFilter(combo);
							me.refreshData();
						},
						boxready : function(combo, width, height, eOpts){
							if (!Ext.isEmpty(me.noPostStructureFilterDesc) && me.noPostStructureFilterDesc != 'ALL') {
								combo.setValue(me.noPostStructureFilterDesc);
							}
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
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel("grid.column.company", "Company Name"),
						displayValue1 : me.clientFilterDesc
					} );
				}
				if( me.agreementFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'agreementCode',
						paramValue1 : encodeURIComponent(me.agreementFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 8,
						paramFieldLable : getLabel('agreementCode', 'Agreement Code'),
						displayValue1 : me.agreementFilterVal
					} );
				}
				if( me.structureType != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'structureType',
						paramValue1 : encodeURIComponent(me.structureType.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('structureType', 'Structure Type'),
						displayValue1 : me.structureTypeDesc
					} );
				}
				if (me.noPostStructureFilterVal != 'all') {
					jsonArray.push({
						paramName : 'noPostStructure',
						paramValue1 : encodeURIComponent(me.noPostStructureFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('noPostStructure', 'Live / Non Live'),
						displayValue1 : me.noPostStructureFilterDesc
					});
				}
				return jsonArray;
			},
			/*handleSmartGridConfig : function()
			{
				var me = this;
				var sweepTxnAgreement = me.getSweepTxnAgreementGridRef();
				var objConfigMap = me.getSweepTxnAgreementConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( sweepTxnAgreement ) )
				{
					if( !Ext.isEmpty( objGridViewPref ) )
					{
						data = Ext.decode( objGridViewPref );
						objPref = data[ 0 ];
						arrColsPref = objPref.gridCols;
						arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
						pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize ) : 5;
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
			},*/

			/*handleSmartGridLoading : function( arrCols, storeModel, pgSize )
			{
				var me = this;
				var pgSize = null;
				var alertSummaryGrid = null;
				pgSize = 100;
				sweepTxnAgreement = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : _GridSizeMaster,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : true,
					cls:'t7-grid',
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					padding : '0 0 0 0',
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

				var sweepTxnAgreementDtlView = me.getSweepTxnAgreementDtlViewRef();
				sweepTxnAgreementDtlView.add( sweepTxnAgreement );
				sweepTxnAgreementDtlView.doLayout();
			},*/
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				
				if( actionName === 'btnHistory' )
				{
					
				}
			},
			showHistory : function( product,url, id )
			{
				Ext.create( 'GCP.view.SweepTxnAgreementHistory',
				{
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					productName : product,
					identifier : id
				} ).show();
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
/*			getSweepTxnAgreementConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"agreementCode" : 200,
					"agreementName" : 200,
					"clientDesc" : 200,
					"structureTypeDesc" : 150,
					"effectiveFromDate" : 135,
					"scheduleExecutionDate" : 200
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
						"colDesc" : getLabel( 'lbl.notionalMst.client', 'Client Name' )
					},
					{
						"colId" : "structureTypeDesc",
						"colDesc" : getLabel( 'structureType', 'Structure Type' )
					},
					{
						"colId" : "effectiveFromDate",
						"colDesc" : getLabel( 'effectiveFrom', 'Effective From' )
					},
					{
						"colId" : "scheduleExecutionDate",
						"colDesc" : getLabel( 'scheduleExecution', 'Schedule Execution' )
					}
					
				];

				storeModel =
				{
					fields :
					[
						'changeId','agreementCode', 'agreementName', 'clientDesc', 'sellerDesc', 'effectiveFromDate',
						'__metadata','identifier','history','structureTypeDesc','scheduleExecutionDate',
						'clientId','agreementRecKey','structureType','viewState','sellerId','agreementExeId'
					],
					proxyUrl : 'getLmsSweepAgreementTxnList.srvc',
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
			},*/
			handleSellerFilter : function(combo,selectedValue )
			{
				var me = this;
				me.sellerFilterVal = selectedValue;
				me.sellerFilterDesc = combo.getRawValue();
				me.refreshData();
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
			handleStructureTypeFilter : function(combo)
			{
				var me = this;
				me.structureType = combo.getValue();
				me.structureTypeDesc = combo.getRawValue();
			},
			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getSweepTxnAgreementGridRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},
			handlenoPostStructureFilter : function(combo) {
				var me = this;
				me.noPostStructureFilterVal = combo.getValue();
				me.noPostStructureFilterDesc = combo.getRawValue();
			},
			/*handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
				me.enableDisableGroupActions( '000000000');
				grid.setLoading(true);
				grid.loadGridData( strUrl, null );
			},*/
			getFilterUrl : function(subGroupInfo, groupInfo)
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
				var strFilter = '&$filter=';
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
			/*enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '00000000';
				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				if(selectedRecords.length > 1 )
				{
					buttonMask = '00000000';
				}
				me.globalRecord = record ;
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
			},*/
			handleGroupActions : function( strAction, grid, record)
			{
				var me = this;
				var strAction = strAction;
				var strUrl = Ext.String.format( 'sweepTxnAgreement/{0}.srvc?', strAction );
				//var record = arrSelectedRecords[arrSelectedRecords.length-1];
				strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
				if( strAction === 'btnAdjustment')
				{
					doAdjustmentTxn(record);
				}
				else if( strAction === 'btnTransfer')
				{
					doTransferTxn(record);
				}
				else if(strAction === 'btnExecute')
				{
					doExecuteTxn(record);
				}
				else if(strAction === 'btnSimulate')
				{
					doSimulationTxn(record);
				}
				else if(strAction === 'btnCancelSchedule')
				{
					doCancelTxn(record);
				}
				else if(strAction === 'btnHistory')
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get('agreementName') ,record.get( 'history' ).__deferred.uri, record.get( 'identifier' ) );
					}
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
					style :
					{
						height : 400
					},
					bodyPadding : 0,
					fn : function( btn, text )
					{
						if( btn == 'ok' )
						{
							me.preHandleGroupActions( strActionUrl, text, record );
						}
					}
				} );
			},
			preHandleGroupActions : function( strUrl, remark, record )
			{
				var me = this;
				var grid = this.getSweepTxnAgreementGridRef();
				if( !Ext.isEmpty( grid ) )
				{
					var arrayJson = new Array();
					var records = grid.getSelectedRecords();
					records = ( !Ext.isEmpty( records ) && Ext.isEmpty( record ) ) ? records :
					[
						record
					];
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
							me.enableDisableGroupActions( '00000000', true );
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
			/*isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
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
					bitPosition = parseInt( maskPosition ) - 1;
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
				if( ( maskPosition === 2 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 3 && retValue )
				{
					retValue = retValue && isSameUser;
				}
				return retValue;
			},*/
			/*isRowMoreMenuVisible : function( store, record, jsonData, itmId, menu )
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
			},*/
			/*enableDisableGroupActions : function( actionMask, isSameUser )
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition ) - 1;
						if( strBitMapKey )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 2 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 3 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled( false );
						}
					} );
				}
			},*/
			/*getColumns : function( arrColsPref, objWidthMap )
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
			},*/
			/*columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				if (record.get('isEmpty')) {
					if (rowIndex === 0 && colIndex === 0) {
						meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
						return getLabel('gridNoDataMsg',
								'No records found !!!');											
					}
				} else
					return value;
			},*/
			/*createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'actionId',
					width : 60,
					colHeader: getLabel('action', 'Action'),
					sortable : false,
					locked : true,
					lockable: false,
					hideable: false,
					visibleRowActionCount : 1,
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
			},*/
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
			/*handleRowMoreMenuClick : function( tableView, rowIndex, columnIndex, btn, event, record )
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
			},*/
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
							var structureType = me.structureType ;
							
							var objStructureTypeLbl =
							{
								'101' : getLabel( 'lblSweep', 'Sweep' ),
								'201' : getLabel( 'lblFlexible', 'Flexible' ),
								'501' : getLabel( 'lblHybrid', 'Hybrid' ),
								'all':'All'
							};
							
							tip.update( getLabel( 'lbl.notionalMst.seller', 'Financial Institution' ) + ' : ' + sellerFilter + '<br/>'
								+ getLabel( 'grid.column.company', 'Company Name' ) + ':' + clientFilter +  '<br/>'
								+ getLabel( 'agreementCode', 'Agreement Code' ) + ':' + agreementFilter +  '<br/>'
								+ getLabel( 'structureType', 'Structure Type' ) + ':' + objStructureTypeLbl[structureType] );
						}
					}
				} );
			},
			/*toggleSavePrefrenceAction : function( isVisible )
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
			},*/
			/*handleSavePreferences : function()
			{
				var me = this;
				me.savePreferences();
			},
			handleClearPreferences : function()
			{
				var me = this;
				me.toggleSavePrefrenceAction( false );
				me.clearWidgetPreferences();
			},*/
			savePreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.urlGridPref;
				var grid = me.getSweepTxnAgreementGridRef();
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
				objQuickFilterPref.structureType = me.structureType;
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
				var grid = me.getSweepTxnAgreementGridRef();
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
				var objSummaryView = me.getSweepTxnAgreementViewType(), gridModel = null, objData = null;
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
				var arrOfParseQuickFilter = [], arrOfFilteredApplied = [];
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
				
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
			
					var filterUrl = me.getFilterUrl(subGroupInfo, groupInfo);
					
					if (!Ext.isEmpty(filterUrl)) {
						strUrl += filterUrl;
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

					arrOfFilteredApplied = arrOfParseQuickFilter;
						
					if (arrOfFilteredApplied)
						me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
				

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
			doHandleRowActions : function(actionName, objGrid, record) {
				var me = this;
				var groupView = me.getGroupView();
				var grid = groupView.getGrid();
				me.handleGroupActions(actionName, objGrid, record);
			},
			doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
					objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				var blnAuthInstLevel = false;
				var maskArray = new Array(), actionMask = '', objData = null;

				if (!Ext.isEmpty(jsonData)
						&& !Ext.isEmpty(jsonData.d.__buttonMask))
					buttonMask = jsonData.d.__buttonMask;

				maskArray.push(buttonMask);
				for (var index = 0; index < arrSelectedRecords.length; index++) {
					objData = arrSelectedRecords[index];
					maskArray.push(objData.get('__metadata').__rightsMap);
				}
				
				actionMask = doAndOperation(maskArray, 8);
				objGroupView.handleGroupActionsVisibility(actionMask);
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
			refreshData : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				
				objGroupView.refreshData();
				
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
			handleClearSettings : function() {
				var me = this, objGroupView = me.getGroupView();
				if(entity_type === '0'){
					var clientComboBox = me.getSweepTxnAgreementFilterViewType()
							.down('AutoCompleter[itemId="clientIdItemId"]');
					me.clientFilterDesc = 'all';
					me.clientFilterVal = 'all';
					clientComboBox.setValue('');
				} else if(entity_type === '1') {
					var clientComboBox = me.getSweepTxnAgreementFilterViewType()
							.down('combo[itemId="clientCodeId]');
					clientComboBox.reset();
					me.clientFilterDesc = 'all';
					me.clientFilterVal = 'all';
				}

				var agrCodeObj = me.getSweepTxnAgreementFilterViewType().down('AutoCompleter[itemId="agreementItemId]');
				if(!Ext.isEmpty(agrCodeObj)){
					agrCodeObj.setValue('');
					me.agreementFilterVal = 'all';
				}
				
				var structureTypeObj = me.getSweepTxnAgreementFilterViewType().down('combobox[itemId="structureTypeId]');
				if(!Ext.isEmpty(structureTypeObj)){
					structureTypeObj.setValue('all');
					me.structureType = 'all'
					me.structureTypeDesc = 'all'
				}
				
				var noPostSructureObj = me.getSweepTxnAgreementFilterViewType().down('combo[itemId="noPostStructureId"]');
				if(!Ext.isEmpty(noPostSructureObj)){
					noPostSructureObj.setValue('all');
					me.noPostStructureFilterVal = 'all';
				}
				me.refreshData();
			},
			handleAppliedFilterDelete : function(btn){
				var me = this;
				var objData = btn.data;
				var quickJsonData = me.filterData;
				if(!Ext.isEmpty(objData)){
					var paramName = objData.paramName || objData.field;
					var reqJsonInQuick = null;
					var arrQuickJson =null;
					
					var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
					if (!Ext.isEmpty(reqJsonInQuick)) {
						arrQuickJson = quickJsonData;
						arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
						me.filterData = arrQuickJson;
					}
					
					me.resetFieldInAdvAndQuickOnDelete(objData);
					me.refreshData();
				}
			},
			resetFieldInAdvAndQuickOnDelete : function(objData){
				var me = this,strFieldName;
				if(!Ext.isEmpty(objData))
					strFieldName = objData.paramName || objData.field;
				
				if(strFieldName === 'sellerCode'){
					if(multipleSellersAvailable == true  && entity_type === '0'){
						var sellercomboObj = me.getSweepTxnAgreementFilterViewType()
							.down('combo[itemId="entitledSellerIdItemId]');
						if(!Ext.isEmpty(sellercomboObj))
							sellercomboObj.setValue('');
						me.sellerFilterVal = 'all';
						me.sellerFilterDesc = 'all';
					}
				}
				else if(strFieldName === 'clientCode'){
					if(entity_type === '0'){
						var clientComboBox = me.getSweepTxnAgreementFilterViewType()
								.down('AutoCompleter[itemId="clientIdItemId"]');
						me.clientFilterDesc = 'all';
						me.clientFilterVal = 'all';
						clientComboBox.setValue('');
					} else if(entity_type === '1') {
						var clientComboBox = me.getSweepTxnAgreementFilterViewType()
								.down('combo[itemId="clientCodeId]');
						clientComboBox.reset();
						me.clientFilterDesc = 'all';
						me.clientFilterVal = 'all';
					}	
				}
				else if(strFieldName === 'agreementCode'){
					var agrCodeObj = me.getSweepTxnAgreementFilterViewType().down('AutoCompleter[itemId="agreementItemId]');
					if(!Ext.isEmpty(agrCodeObj)){
						agrCodeObj.setValue('');
						me.agreementFilterVal = 'all';
					}	
				}
				else if(strFieldName === 'structureType'){
					var structureTypeObj = me.getSweepTxnAgreementFilterViewType().down('combobox[itemId="structureTypeId]');
					if(!Ext.isEmpty(structureTypeObj)){
						structureTypeObj.setValue('all');
						me.structureType = 'all'
						me.structureTypeDesc = 'all'
					}	
				}
				else if(strFieldName === 'noPostStructure'){
					var noPostSructureObj = me.getSweepTxnAgreementFilterViewType().down('combo[itemId="noPostStructureId"]');
					if(!Ext.isEmpty(noPostSructureObj)){
						noPostSructureObj.setValue('all');
						me.noPostStructureFilterVal = 'all';
					}
				}
			},
			showPageSettingPopup : function(strInvokedFrom) {
				var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
				var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
				var arrCols = me.getSweepTxnAgreementViewType().getDefaultColumnModel();
				me.pageSettingPopup = null;

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
							? objPrefData.d.preferences.ColumnSetting.gridCols
							: arrCols;

					if (!Ext.isEmpty(objGeneralSetting)) {
						objGroupByVal = objGeneralSetting.defaultGroupByCode;
						objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
					}
					if (!Ext.isEmpty(objGridSetting)) {
						objGridSizeVal = objGridSetting.defaultGridSize;
						objRowPerPageVal = objGridSetting.defaultRowPerPage;
					}
				}
				if (Ext.isEmpty(objColumnSetting)) {
                    objColumnSetting = arrCols;
                }
				objData["groupByData"] = objGroupView
						? objGroupView.cfgGroupByData
						: [];
				objData["filterUrl"] = '';
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
					me.preferenceHandler.readPagePreferences(me.strPageName, me.updateObjPaymentSummaryPref,args, me,false);
				}
			},
			updateObjPaymentSummaryPref : function(data){		
				objSummaryPref = Ext.encode(data);
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
			applyPreferences : function(){
				var me = this, objJsonData='', objLocalJsonData='';
				if (objSummaryPref || objSaveLocalStoragePref) {
								objJsonData = Ext.decode(objSummaryPref);
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
												if(quickPref[i].paramName == "structureType"){
													me.structureType = quickPref[i].paramValue1;
													me.structureTypeDesc = quickPref[i].displayValue1;
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
			/*updateFilterConfig : function()
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
					me.structureType = data.quickFilter.structureType
				}
				me.filterData = me.getQuickFilterQueryJson();
			}*/
			
		} );