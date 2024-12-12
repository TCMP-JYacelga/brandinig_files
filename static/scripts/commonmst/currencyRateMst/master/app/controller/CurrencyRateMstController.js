Ext
	.define(
		'GCP.controller.CurrencyRateMstController',
		{
			extend : 'Ext.app.Controller',
			requires : [],
			views :
			[
				'GCP.view.CurrencyRateMstView', 'GCP.view.CurrencyRateMstGridView', 'GCP.view.HistoryPopup'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'currencyRateMstViewRef',
					selector : 'currencyRateMstViewType'
				},
				{
					ref : 'groupView',
					selector : 'currencyRateMstViewType groupView'
				},
				{
					ref : 'createNewToolBar',
					selector : 'currencyRateMstViewType currencyRateMstGridViewType toolbar[itemId="btnCreateNewToolBar"]'
				},
				{
					ref : 'currencyRateMstFilterViewRef',
					selector : 'currencyRateMstViewType currencyRateMstFilterViewType'
				},
				{
					ref : 'specificFilterPanel',
					selector : 'currencyRateMstViewType currencyRateMstFilterViewType panel[itemId="specificFilter"]'
				},
				{
					ref : 'currencyRateMstGridViewRef',
					selector : 'currencyRateMstViewType currencyRateMstGridViewType'
				},
				{
					ref : 'currencyRateMstDtlViewRef',
					selector : 'currencyRateMstViewType currencyRateMstGridViewType panel[itemId="currencyRateMstDtlViewItemId"]'
				},
				{
					ref : 'gridHeader',
					selector : 'currencyRateMstViewType currencyRateMstGridViewType panel[itemId="currencyRateMstDtlViewItemId"] container[itemId="gridHeader"]'
				},
				{
					ref : 'currencyRateMstGridRef',
					selector : 'currencyRateMstViewType currencyRateMstGridViewType grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'searchTextInput',
					selector : 'currencyRateMstGridViewType textfield[itemId="searchTextField"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'currencyRateMstGridViewType radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'grid',
					selector : 'currencyRateMstGridViewType smartgrid'
				},
				{
					ref : "statusFilter",
					selector : 'currencyRateMstViewType currencyRateMstFilterViewType combobox[itemId="statusFilter"]'
				},
				{
					ref : 'withHeaderCheckbox',
					selector : 'currencyRateMstViewType currencyRateMstTitleViewType menuitem[itemId="withHeaderId"]'
				},
				{
					ref : 'groupActionBar',
					selector : 'currencyRateMstViewType currencyRateMstGridViewType currencyRateMstGroupActionBarViewType'
				},
				{
					ref : 'uploadDateFieldRef',
					selector : 'currencyRateMstViewType currencyRateMstFilterViewType datefield[itemId="uploadDateFieldItemId"]'
				},
				{
					ref : 'sellerCodeFieldRef',
					selector : 'currencyRateMstViewType currencyRateMstFilterViewType combobox[itemId="sellerCodeComboBox"]'
				}
			],
			config :
			{
				selectedMst : 'client',
				clientListCount : 0,
				clientCode : '',
				clientDesc : '',
				brandingPkgListCount : 0,
				filterData : [],
				copyByClicked : '',
				filterApplied : 'ALL',
				sellerFilterVal : null,
				clientFilterVal : null,
				clientFilterDesc : null,
				reportGridOrder : null,
				sellerCodeVal : null
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
				me.sellerFilterVal = strSellerId;
				GCP.getApplication().on(
				{
					showClientPopup : function( brandingpkg )
					{

					}

				} );

				me.control(
				{
					'currencyRateMstGridViewType' : {
						render : function(panel) {
							me.handleSmartGridConfig();
						}
					},
					'currencyRateMstGridViewType smartgrid' :
					{
						render : function(grid) {
							me.handleLoadGridData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function(grid, record, recordIndex,
								records, jsonData) {
							me.enableValidActionsForGrid(grid, record, recordIndex,
									records, jsonData);
						}

					},


					'currencyRateMstViewType currencyRateMstFilterViewType' :
					{
						'handleClientChange' : function( client, clientDesc )
						{
							if( client === 'all' )
							{
								me.clientFilterVal = '';
								me.clientFilterDesc = '';
								me.clientFilterDesc = '';
							}
							else
							{
								me.clientFilterVal = client;
								me.clientFilterDesc = clientDesc;
								me.clientFilterDesc = clientDesc;
							}
							me.applySeekFilter();
						},
						render : function( panel, opts )
						{
							me.setInfoTooltip();
						}
					},

					'currencyRateMstViewType currencyRateMstFilterViewType combobox[itemId=orderPartyCodeFltId]' :
					{
						select : function( btn, opts )
						{
							me.setDataForFilter();
							me.applyFilter();
						},
						change : function( combo, newValue, oldValue, eOpts )
						{
							if( newValue == '' || null == newValue )
							{
								me.setDataForFilter();
								me.applyFilter();
							}
						}
					},

					'currencyRateMstViewType currencyRateMstFilterViewType combobox[itemId=orderPartyNameFltId]' :
					{
						select : function( btn, opts )
						{
							me.setDataForFilter();
							me.applyFilter();
						},
						change : function( combo, newValue, oldValue, eOpts )
						{
							if( newValue == '' || null == newValue )
							{
								me.setDataForFilter();
								me.applyFilter();
							}
						}
					},

					'currencyRateMstViewType button[itemId="btnCreateCurrencyRatesItemId"]' :
					{
						click : function()
						{
							me.handleClientEntryAction( true );
						}
					},

					'currencyRateMstTitleViewType' :
					{
						performReportAction : function( btn, opts )
						{
							me.handleReportAction( btn, opts );
						}
					},

					'currencyRateMstViewType currencyRateMstFilterViewType button[itemId="btnFilter"]' :
					{
						click : function( btn, opts )
						{
							me.callHandleLoadGridData();
						}
					},
					'currencyRateMstGridViewType toolbar[itemId=currencyRateMstGroupActionBarView_clientDtl]' : {
						performGroupAction : function(btn, opts) {
							me.handleGroupActions(btn);
						}
					}

				} );
			},

//			doHandleGroupByChange : function( menu, groupInfo )
//			{
//				var me = this;
//				/*if (me.previouGrouByCode === 'ADVFILTER') {
//					me.savePrefAdvFilterCode = null;
//					me.showAdvFilterCode = null;
//					me.filterApplied = 'ALL';
//				}
//				if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
//					me.previouGrouByCode = groupInfo.groupTypeCode;
//				} else
//					me.previouGrouByCode = null;*/
//			},
//
//			doHandleGroupTabChange : function( groupInfo, subGroupInfo, tabPanel, newCard, oldCard )
//			{
//				var me = this;
//				var objGroupView = me.getGroupView();
//				var strModule = '', strUrl = null, args = null, strFilterCode = null;
//				groupInfo = groupInfo || {};
//				subGroupInfo = subGroupInfo || {};
//				if( groupInfo )
//				{
//					args =
//					{
//						scope : me
//					};
//					var colPrefModuleName = ( subGroupInfo.groupCode === 'all' ) ? ( groupInfo.groupTypeCode + subGroupInfo.groupCode )
//						: subGroupInfo.groupCode;
//					strModule = colPrefModuleName;
//					//me.getSavedPreferences(strUrl,
//					//		me.postHandleDoHandleGroupTabChange, args);
//					var data = null;
//					me.postHandleDoHandleGroupTabChange( data, args );
//
//				}
//			},
//
//			postHandleDoHandleGroupTabChange : function( data, args )
//			{
//				var me = args.scope;
//				var objGroupView = me.getGroupView();
//				var objSummaryView = me.getCurrencyRateMstViewRef(), objPref = null, gridModel = null, intPgSize = null;
//				var colModel = null, arrCols = null;
//				if( data && data.preference )
//				{
//					objPref = Ext.decode( data.preference );
//					arrCols = objPref.gridCols || null;
//					intPgSize = objPref.pgSize || _GridSizeTxn;
//					colModel = objSummaryView.getColumnModel( arrCols );
//					if( colModel )
//					{
//						gridModel =
//						{
//							columnModel : colModel,
//							pageSize : intPgSize,
//							storeModel :
//							{
//								sortState : objPref.sortState
//							}
//						}
//					}
//				}
//				objGroupView.reconfigureGrid( gridModel );
//			},

			callHandleLoadGridData : function()
			{
				var me = this;
				me.getGrid().getStore()
				me.handleLoadGridData( me.getGrid(), me.getGrid().getStore().dataUrl, me
					.getGrid().pageSize, 1, 1, null );
			},
//			doHandleLoadGridData : function( groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter,
//				filterData )
//			{
//				var me = this;
//				var objGroupView = me.getGroupView();
//				var buttonMask = me.strDefaultMask;
//				//objGroupView.handleGroupActionsVisibility(buttonMask);
//				me.setDataForFilter();
//				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
//				strUrl += me.getFilterUrl( subGroupInfo, groupInfo );
//				me.reportGridOrder = strUrl;
//				grid.loadGridData( strUrl, null, null, false );
//			},

			setFilterRetainedValues : function()
			{
				var me = this;
				var currencyRateMstFilterViewRef = me.getCurrencyRateMstFilterViewRef();
				me.changeFilterParams();
			},

			applySeekFilter : function()
			{
				var me = this;
				me.changeFilterParams();
				me.setDataForFilter();
				me.applyFilter();
			},

			changeFilterParams : function()
			{
				var me = this;
				var currencyRateMstFilterViewRef = me.getCurrencyRateMstFilterViewRef();
				var clientCodesFltId = currencyRateMstFilterViewRef.down( 'AutoCompleter[itemId=clientCodeId]' );
				var orderPartyNameFltAuto = currencyRateMstFilterViewRef
					.down( 'AutoCompleter[itemId=orderPartyNameFltId]' );
				var orderPartyCodeFltAuto = currencyRateMstFilterViewRef
					.down( 'AutoCompleter[itemId=orderPartyCodeFltId]' );

				if( entityType == 0 && !Ext.isEmpty( clientCodesFltId ) )
				{
					clientCodesFltId.cfgExtraParams = new Array();
				}
				if( !Ext.isEmpty( orderPartyNameFltAuto ) )
				{
					orderPartyNameFltAuto.cfgExtraParams = new Array();
				}
				if( !Ext.isEmpty( orderPartyCodeFltAuto ) )
				{
					orderPartyCodeFltAuto.cfgExtraParams = new Array();
				}

				if( !Ext.isEmpty( orderPartyNameFltAuto ) && !Ext.isEmpty( strSellerId ) )
				{
					orderPartyNameFltAuto.cfgExtraParams.push(
					{
						key : '$sellerId',
						value : me.sellerFilterVal
					} );
				}
				if( !Ext.isEmpty( orderPartyCodeFltAuto ) && !Ext.isEmpty( strSellerId ) )
				{
					orderPartyCodeFltAuto.cfgExtraParams.push(
					{
						key : '$sellerId',
						value : me.sellerFilterVal
					} );
				}

				if( !Ext.isEmpty( clientCodesFltId ) && me.clientFilterVal != 'all' && me.clientFilterVal != null )
				{
					if( !Ext.isEmpty( orderPartyNameFltAuto ) )
					{
						orderPartyNameFltAuto.cfgExtraParams.push(
						{
							key : '$clientId',
							value : me.clientFilterVal
						} );
					}
					if( !Ext.isEmpty( orderPartyCodeFltAuto ) && me.clientFilterVal != 'all'
						&& me.clientFilterVal != null )
					{
						orderPartyCodeFltAuto.cfgExtraParams.push(
						{
							key : '$clientId',
							value : me.clientFilterVal
						} );
					}
				}
			},

			handleSpecificFilter : function()
			{
				var me = this;
				me.getSearchTextInput().setValue( '' );
				// me.getStatusFilter().setValue('');
				var corporationTextfield = Ext.create( 'Ext.ux.gcp.AutoCompleter',
				{
					padding : '1 0 0 10',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					name : 'corporationName',
					itemId : 'corporationFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'corporationSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				} );

				var clientTextfield = Ext.create( 'Ext.ux.gcp.AutoCompleter',
				{
					padding : '1 0 0 5',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					name : 'clientName',
					itemId : 'clientFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'clientSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				} );

				var brandingPkgNameTextfield = Ext.create( 'Ext.ux.gcp.AutoCompleter',
				{
					padding : '1 0 0 10',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					name : 'brandingPkgName',
					itemId : 'corporationFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'brandingPkgNameSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				} );

				var filterPanel = me.getSpecificFilterPanel();
				if( !Ext.isEmpty( filterPanel ) )
				{
					filterPanel.removeAll();
				}
				// filterPanel.columnWidth = 0.56;

			},

			// method to handle client list and branding pkg list link click
			handleGridHeader : function()
			{
				var me = this;
				var gridHeaderPanel = me.getGridHeader();
				var createNewPanel = me.getCreateNewToolBar();
				if( !Ext.isEmpty( gridHeaderPanel ) )
				{
					gridHeaderPanel.removeAll();
				}
				if( !Ext.isEmpty( createNewPanel ) )
				{
					createNewPanel.removeAll();
				}

				createNewPanel.add(
				{
					xtype : 'button',
					border : 0,
					text : getLabel( 'lbl.create.currencyRates', 'Create FX Rates' ),
					// cls : 'cursor_pointer',
					cls : 'cursor_pointer xn-btn ux-button-s ux_create-receiver',
					glyph : 'xf055@fontawesome',
					parent : this,
					padding : '4 0 2 0',
					itemId : 'btnCreateClient'
				} );

			},

			showClientList : function( btn, opts )
			{
				var me = this;
				me.selectedMst = 'client';
				me.handleSmartGridConfig();
			},
			
			handleSmartGridConfig : function() {
				var me = this;
				var clientGrid = me.getCurrencyRateMstGridRef();
//				var objConfigMap = me.getClientSetupConfiguration();
				var arrCols = new Array();
				if (!Ext.isEmpty(clientGrid))
					clientGrid.destroy(true);
					
				arrCols = me.getClientSetupConfiguration(CURRENCY_RATE_MST_GENERIC_COLUMN_MODEL);
				/*if (!Ext.isEmpty(clientGrid)) {
					var store = clientGrid.createGridStore(objConfigMap.storeModel);
					var columns = clientGrid.createColumns(arrCols);
					clientGrid.reconfigure(store, columns);
					clientGrid.down('pagingtoolbar').bindStore(store);
					clientGrid.refreshData();
					
				} else {*/
				
					me.handleSmartGridLoading(arrCols);
				
			},
			handleSmartGridLoading : function(arrCols) {
				var me = this;
				var pgSize = null;
				pgSize = _GridSizeMaster;
				clientGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							id : 'gridViewMstId',
							itemId : 'gridViewMstId',
							pageSize : pgSize,
							stateful : false,
							showEmptyRow : false,
							padding : '5 0 0 0',
							rowList : _AvailableGridSize,
							minHeight : 0,
							columnModel : arrCols,
							storeModel :
							{
								fields :
								[
									'uploadNmbr', 'uploadDate', 'uploadTime', 'uploadDateTime', 'isSubmitted', 'validFlag',
									'requestStateDesc', '__metadata', 'history', 'identifier', 'viewState'
								],
								proxyUrl : 'services/currencyRateMstList.json',
								rootNode : 'd.profile',
								totalRowsNode : 'd.__count'
							},
							isRowIconVisible : me.isRowIconVisible,
//							isRowMoreMenuVisible : me.isRowMoreMenuVisible,
							handleRowMoreMenuClick : me.handleRowMoreMenuClick,
							cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',

					handleRowIconClick : function(tableView, rowIndex, columnIndex,
							btn, event, record) {
						me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
								event, record);
					},

					handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
													menu, event, record) {
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
								dataParams.columnIndex, menu, null, dataParams.record);
					}
			    });

				var clntSetupDtlView = me.getCurrencyRateMstDtlViewRef();
				clntSetupDtlView.add(clientGrid);
				clntSetupDtlView.doLayout();
			},
			getClientSetupConfiguration : function( arrCols )
			{
				var me = this;
				var arrRowActions =
				[
					{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel( 'viewToolTip', 'View Record' ),
						itemLabel : getLabel( 'viewToolTip', 'View Record' ),
						maskPosition : 3
					},
					{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel( 'editToolTip', 'Edit' ),
						itemLabel : getLabel( 'editToolTip', 'Edit' ),
						maskPosition : 2
					},
					{
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel( 'historyToolTip', 'View History' ),
						toolTip : getLabel( 'historyToolTip', 'View History' ),
						maskPosition : 4
					}
				];
				//arrCols.push(me.createGroupActionColumn());
				var colGroupAction = me.createActionColumn();
				colGroupAction.items = arrRowActions.concat( colGroupAction.items || [] );
				var arrColumns =
				[
					colGroupAction
				];
				var arrColsPref = new Array();
				if (!Ext.isEmpty(arrCols)) {
					for (var i = 0; i < arrCols.length; i++) {
						objCol = arrCols[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colHeader;
						cfgCol.colId = objCol.colId;
						cfgCol.draggable = objCol.draggable;
						if(objCol.colId == 'requestStateDesc')
						{
							cfgCol.locked = false;
							cfgCol.lockable = false;
							cfgCol.sortable = false;
							cfgCol.hideable = false;
							cfgCol.resizable = false;
							cfgCol.draggable = false;
							cfgCol.hidden = false;
						}
						
						if (!Ext.isEmpty(objCol.colType)) {
							cfgCol.colType = objCol.colType;
							if (cfgCol.colType === "number")
								cfgCol.align = 'right';
						}
						cfgCol.sortable=objCol.sortable;
						cfgCol.width = objCol.width;

						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrColsPref.push(cfgCol);
					}
				}
				return arrColumns.concat( arrColsPref || [] );
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				strRetValue = value;
				return strRetValue;
			},
			createActionColumn : function()
			{
				var me = this;
				var colItems = [];
				var actionsForWidget =
				[
					'Submit', 'Discard', 'Approve', 'Reject', 'Enable', 'Disable'
				];
				colItems = me.createGroupActionColumn( actionsForWidget );
				var objActionCol =
				{
					colId : 'actioncontent',
					colType : 'actioncontent',
					width : 90,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					draggable : false,
					items : colItems,
					visibleRowActionCount : 2
				};
				return objActionCol;
			},
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 11;
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
				if( ( maskPosition === 6 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 7 && retValue )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 2 && retValue )
				{
					var reqState = record.raw.requestState;
					var submitFlag = record.raw.isSubmitted;
					var validFlag = record.raw.validFlag;
					var isDisabled = ( reqState === 3 && validFlag == 'N' );
					var isSubmitModified = ( reqState === 1 && submitFlag == 'Y' );
					retValue = retValue && ( !isDisabled ) && ( !isSubmitModified );
				}
				else if( maskPosition === 10 && retValue )
				{
					var reqState = record.raw.requestState;
					var submitFlag = record.raw.isSubmitted;
					var submitResult = ( reqState === 0 && submitFlag == 'Y' );
					retValue = retValue && ( !submitResult );
				}
				else if( maskPosition === 8 && retValue )
				{
					var validFlag = record.raw.validFlag;
					var reqState = record.raw.requestState;
					retValue = retValue && ( reqState == 3 && validFlag == 'N' );
				}
				else if( maskPosition === 9 && retValue )
				{
					var validFlag = record.raw.validFlag;
					var reqState = record.raw.requestState;
					retValue = retValue && ( reqState == 3 && validFlag == 'Y' );
				}
				return retValue;
			},
			createGroupActionColumn : function( availableActions )
			{
				var itemsArray = [];
				if( !Ext.isEmpty( availableActions ) )
				{
					for( var count = 0 ; count < availableActions.length ; count++ )
					{
						switch( availableActions[ count ] )
						{
							case 'Submit':
								itemsArray.push(
								{
									text : getLabel( 'prfMstActionSubmit', 'Submit' ),
									actionName : 'submit',
									itemId : 'submit',
									maskPosition : 5
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
								} );
								break;
							case 'Discard':
								itemsArray.push(
								{
									text : getLabel( 'prfMstActionDiscard', 'Discard' ),
									actionName : 'discard',
									itemId : 'discard',
									maskPosition : 10
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
								} );
								break;
							case 'Approve':
								itemsArray.push(
								{
									text : getLabel( 'prfMstActionApprove', 'Approve' ),
									itemId : 'accept',
									actionName : 'accept',
									maskPosition : 6
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
								} );
								break;
							case 'Reject':
								itemsArray.push(
								{
									text : getLabel( 'prfMstActionReject', 'Reject' ),
									itemId : 'reject',
									actionName : 'reject',
									maskPosition : 7
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
								} );
								break;
							case 'Enable':
								itemsArray.push(
								{
									text : getLabel( 'prfMstActionEnable', 'Enable' ),
									itemId : 'enable',
									actionName : 'enable',
									maskPosition : 8
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
								} );
								break;
							case 'Disable':
								itemsArray.push(
								{
									text : getLabel( 'prfMstActionDisable', 'Disable' ),
									itemId : 'disable',
									actionName : 'disable',
									maskPosition : 9
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
								} );
								break;
						}
					}
				}
				return itemsArray;
			},

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				me.setDataForFilter();
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				strUrl = strUrl + me.getFilterUrl();
				grid.loadGridData( strUrl, null );
			},
			enableValidActionsForGrid : function(grid, record, recordIndex,
					selectedRecords, jsonData) {
				var me = this;
				var buttonMask = '0000000000';
				var maskArray = new Array(), actionMask = '', objData = null;;

				if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				var isDisabled = false;
				var isSubmit = false;
				maskArray.push(buttonMask);
				for (var index = 0; index < selectedRecords.length; index++) {
					objData = selectedRecords[index];
					maskArray.push(objData.get('__metadata').__rightsMap);
					if (objData.raw.makerId === USER) {
						isSameUser = false;
					}
					if (objData.raw.validFlag != 'Y') {
						isDisabled = true;
					}
					if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
						isSubmit = true;
					}
				}
				actionMask = doAndOperation(maskArray, 10);
				me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,isSubmit);
			},
			enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
				var actionBar = this.getGroupActionBar();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
					arrItems = actionBar.items.items;
					Ext.each(arrItems, function(item) {
								strBitMapKey = parseInt(item.maskPosition,10) - 1;
								if (strBitMapKey) {
									blnEnabled = isActionEnabled(actionMask,
											strBitMapKey);
											
									if((item.maskPosition === 6 && blnEnabled)){
										blnEnabled = blnEnabled && isSameUser;
									} else  if(item.maskPosition === 7 && blnEnabled){
										blnEnabled = blnEnabled && isSameUser;
									}else if (item.maskPosition === 8 && blnEnabled) {
										blnEnabled = blnEnabled && isDisabled;
									} else if (item.maskPosition === 9 && blnEnabled) {
										blnEnabled = blnEnabled && !isDisabled;
									} else if (item.maskPosition === 10 && blnEnabled) {
										blnEnabled = blnEnabled && !isSubmit;
									}
									item.setDisabled(!blnEnabled);
								}
							});
				}
			},

			getFilterUrl : function( subGroupInfo, groupInfo )
			{
				var me = this;
				var strQuickFilterUrl = '';
				var strGroupQuery = ( subGroupInfo && subGroupInfo.groupQuery ) ? subGroupInfo.groupQuery : '';
				strQuickFilterUrl = me.generateUrlWithFilterParams( this );
				if( !Ext.isEmpty( strGroupQuery ) )
				{
					if( !Ext.isEmpty( strQuickFilterUrl ) )
						strQuickFilterUrl += ' and ' + strGroupQuery;
					else
						strQuickFilterUrl += '&$filter=' + strGroupQuery;
				}
				return strQuickFilterUrl;
			},

			generateUrlWithFilterParams : function( thisClass )
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
							strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue
								+ ' ' + '\'' + filterData[ index ].paramValue1 + '\'' + ' and ' + '\''
								+ filterData[ index ].paramValue2 + '\'';
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
								strTemp = strTemp + ' ) ';
							}
							break;
						case 'statusFilterOp' :
							var objValue = filterData[index].paramValue1;
							var objUser = filterData[index].makerUser;
							var objArray = objValue.split(',');
							for (var i = 0; i < objArray.length; i++) {
									if( i== 0)
									strTemp = strTemp + '(';
									if(objArray[i] == 12){
										strTemp = strTemp + "(requestState eq 0 and isSubmitted eq 'Y')";
									}
									else if(objArray[i] == 14){
										strTemp = strTemp + "(requestState eq 1 and isSubmitted eq 'Y')";
									}
									else if(objArray[i] == 3){
										strTemp = strTemp + "(requestState eq 3 and validFlag eq 'Y')";
									}
									else if(objArray[i] == 11){
										strTemp = strTemp + "(requestState eq 3 and validFlag eq 'N')";
									}
									else if(objArray[i] == 13){
										strTemp = strTemp + "(((isSubmitted eq 'Y' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5'))and makerId ne '"+objUser+"' )";
									}
									else if(objArray[i] == 0 || objArray[i] == 1){
										strTemp = strTemp + "(requestState eq "+objArray[i]+" and isSubmitted eq 'N')";
									}
									else{
										strTemp = strTemp + "(requestState eq "+objArray[i]+")";
									}
									if(i != (objArray.length -1)){
										strTemp = strTemp + ' or ';
									}
									if(i == (objArray.length -1))
									strTemp = strTemp + ')';
							}
							break;
						default:
							// Default opertator is eq
							
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

			setDataForFilter : function()
			{
				var me = this;
				//me.getSearchTextInput().setValue('');
				this.filterData = this.getFilterQueryJson();
			},

			getFilterQueryJson : function()
			{
				var me = this;
				var uploadDate = null;
				var sellerCode = null;
				var formattedDate = null;
				var strSqlDateFormat = 'Y-m-d';
				var jsonArray = [];

				uploadDate = me.getUploadDateFieldRef().getValue();
				formattedDate = Ext.Date.format( uploadDate, strSqlDateFormat );
				
				jsonArray.push(
				{
					paramName : 'uploadDate',
					paramValue1 : formattedDate,
					operatorValue : 'eq',
					dataType : 'D'
				} );

				sellerCode = me.getSellerCodeFieldRef().getValue();

				if( !Ext.isEmpty( sellerCode ) && sellerCode != null )
				{
					if( sellerCode == sellerDesc )
					{
						me.sellerCodeVal = strSellerId;
					}
					else
					{
						me.sellerCodeVal = sellerCode;
					}

				}

				if( !Ext.isEmpty( me.sellerCodeVal ) && me.sellerCodeVal != '' )
				{
					jsonArray.push(
					{
						paramName : 'sellerCode',
						paramValue1 : encodeURIComponent(me.sellerCodeVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				
				if (!Ext.isEmpty(me.getStatusFilter())
						&& !Ext.isEmpty(me.getStatusFilter().getValue())) {
					statusVal = me.getStatusFilter().getValue();
				}
				if (!Ext.isEmpty(statusVal) && "ALL" != statusVal) {
					jsonArray.push({
								paramName : me.getStatusFilter().filterParamName,
								paramValue1 : encodeURIComponent(statusVal.replace(new RegExp("'", 'g'), "\''")),
								makerUser : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'statusFilterOp',
								dataType : 'S'
							});
				}

				return jsonArray;
			},

			applyFilter : function()
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var groupInfo = objGroupView.getGroupInfo();
				me.refreshData();
			},

			refreshData : function()
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				if( grid )
				{
					/*if (!Ext.isEmpty(me.advSortByData)) {
						appliedSortByJson = me.getSortByJsonForSmartGrid();
						grid.removeAppliedSort();
						grid.applySort(appliedSortByJson);
					} else {
						grid.removeAppliedSort();
					}*/
				}
				grid.removeAppliedSort();
				objGroupView.refreshData();
			},

			doHandleRowActions : function( actionName, objGrid, record )
			{
				var me = this;
				var groupView = me.getGroupView();
				var grid = groupView.getGrid();
				var selectedRecord = grid.getSelectionModel().getSelection()[ 0 ];
				var rowIndex = grid.store.indexOf( selectedRecord );
				if( actionName === 'submit' || actionName === 'discard' || actionName === 'accept'
					|| actionName === 'reject' || actionName === 'enable' || actionName === 'disable' )
					me.handleGroupActions( actionName, grid,
					[
						record
					], 'rowAction' );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						if( 'client' == me.selectedMst )
						{
							me.showHistory( record.get( 'uploadDate' ), record.get( 'history' ).__deferred.uri,
								record.get( 'identifier' ) );
						}
					}
				}
				else if( actionName === 'btnView' || actionName === 'btnEdit' )
				{
					if( actionName === 'btnView' )
					{
						me.submitExtForm( 'showCurrencyRateMstView.srvc', record, rowIndex, 'VIEW' );
					}
					else if( actionName === 'btnEdit' )
					{
						me.submitExtForm( 'showCurrencyRateMstEntry.srvc', record, rowIndex, 'EDIT' );
					}
				}
			},

			submitExtForm : function( strUrl, record, rowIndex, pageMode )
			{
				var me = this;
				var viewRecordState = record.data.viewState;
				var updateIndex = rowIndex;
				var form, inputField;

				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$viewState',viewRecordState  ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$pageMode', pageMode ) );
				me.setFilterParameters( form );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
			},

			doHandleGridRowSelectionChange : function( groupInfo, subGroupInfo, objGrid, objRecord, intRecordIndex,
				selectedRecords, jsonData )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				var blnAuthInstLevel = false;
				var maskArray = new Array(), actionMask = '', objData = null;
				;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				var isDisabled = false;
				var isSubmit = false;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < selectedRecords.length ; index++ )
				{
					objData = selectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
					if( objData.raw.validFlag != 'Y' )
					{
						isDisabled = true;
					}
					if( objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0 )
					{
						isSubmit = true;
					}
				}
				actionMask = doAndOperation( maskArray, 10 );
				me.enableDisableGroupActions( actionMask, isSameUser, isDisabled, isSubmit );
			},

			handleGroupActions : function( strAction, grid, arrSelectedRecords, strActionType )
			{
				var me = this;
				var strActionName = '';
				if( !Ext.isEmpty( strAction ) )
					strActionName = strAction.actionName;
				var strUrl = Ext.String.format( 'services/currencyRateMstList/{0}.srvc?', strActionName );
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, grid, arrSelectedRecords );
				}
				else
				{
					this.preHandleGroupActions( strUrl, '', grid, arrSelectedRecords );
				}
			},

			showHistory : function( uploadDate, url, id )
			{
				Ext.create( 'GCP.view.HistoryPopup',
				{
					uploadDate : uploadDate,
					historyUrl : url,
					identifier : id
				} ).show();
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
						/*
						 * blnRetValue = me.isRowIconVisible(store, record, jsonData,
						 * null, arrMenuItems[a].maskPosition);
						 */
						// arrMenuItems[a].setVisible(blnRetValue);
					}
				}
				menu.showAt( event.xy[ 0 ] + 5, event.xy[ 1 ] + 5 );
			},
			
			handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
					record) {
				var me = this;
				var grid = me.getGrid();
				var actionName = btn.itemId;
				var selectedRecord = grid.getSelectionModel().getSelection()[ 0 ];
				var rowIndex = grid.store.indexOf( selectedRecord );
				if( actionName === 'submit' || actionName === 'discard' || actionName === 'accept'
					|| actionName === 'reject' || actionName === 'enable' || actionName === 'disable' )
					me.doHandleGroupActions( actionName, grid,
					[
						record
					], 'rowAction' );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						if( 'client' == me.selectedMst )
						{
							me.showHistory( record.get( 'uploadDate' ), record.get( 'history' ).__deferred.uri,
								record.get( 'identifier' ) );
						}
					}
				}
				else if( actionName === 'btnView' || actionName === 'btnEdit' )
				{
					if( actionName === 'btnView' )
					{
						me.submitExtForm( 'showCurrencyRateMstView.srvc', record, rowIndex, 'VIEW' );
					}
					else if( actionName === 'btnEdit' )
					{
						me.submitExtForm( 'showCurrencyRateMstEntry.srvc', record, rowIndex, 'EDIT' );
					}
				}
			},
			doHandleGroupActions : function( strAction, grid, arrSelectedRecords, strActionType )
			{
				var me = this;
				if( !Ext.isEmpty( strAction ) )
					var strAction = strAction;
				var strUrl = Ext.String.format( 'services/currencyRateMstList/{0}.srvc?', strAction );
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, grid, arrSelectedRecords );
				}
				else
				{
					this.preHandleGroupActions( strUrl, '', grid, arrSelectedRecords );
				}
			},

			showRejectVerifyPopUp : function( strAction, strActionUrl, grid, record )
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					titleMsg = getLabel( 'prfRejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					fieldLbl = getLabel( 'prfRejectRemarkPopUpFldLbl', 'Reject Remark' );
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
							me.preHandleGroupActions( strActionUrl, text, grid,record );
						}
					}
				} );
			},

			preHandleGroupActions : function( strUrl, remark, grid, arrSelectedRecords )
			{
				var me = this;
				var grid = me.getGrid();
				if( !Ext.isEmpty( grid ) )
				{
					var me = this;
					if( !Ext.isEmpty( grid ) )
					{
						var arrayJson = new Array();
						var records = grid.getSelectedRecords();
						records = (!Ext.isEmpty(records) && Ext.isEmpty(arrSelectedRecords)) ? records	: arrSelectedRecords;
						for( var index = 0 ; index < records.length ; index++ )
						{
							arrayJson.push(
							{
								serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
								identifier : records[ index ].data.identifier,
								userMessage : remark,
								recordDesc : records[ index ].data.uploadNmbr
							} );
						}
						if( arrayJson )
							arrayJson = arrayJson.sort( function( valA, valB )
							{
								return valA.serialNo - valB.serialNo
							} );

						Ext.Ajax.request(
						{
							url : strUrl + csrfTokenName + "=" + csrfTokenValue,
							method : 'POST',
							jsonData : Ext.encode( arrayJson ),
							success : function( response )
							{
								// TODO : Action Result handling to be done here
								me.enableDisableGroupActions( '00000000000' );
								//grid.refreshData();
								//me.applyFilter();
								grid.setLoading( false );
								grid.refreshData();
								var errorMessage = '';
								if(response.responseText != '[]')
							       {
								        var jsonData = Ext.decode(response.responseText);
								        if(!Ext.isEmpty(jsonData))
								        {
								        	for(var i =0 ; i<jsonData.length;i++ )
								        	{
								        		var arrError = jsonData[i].errors;
								        		if(!Ext.isEmpty(arrError))
								        		{
								        			for(var j =0 ; j< arrError.length; j++)
										        	{
									        			errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
										        	}
								        		}
								        		
								        	}
									        if('' != errorMessage && null != errorMessage)
									        {
									         //Ext.Msg.alert("Error",errorMessage);
									        	Ext.MessageBox.show({
													title : getLabel('instrumentErrorPopUpTitle','Error'),
													msg : errorMessage,
													buttons : Ext.MessageBox.OK,
													cls : 'ux_popup',
													icon : Ext.MessageBox.ERROR
												});
									        } 
								        }
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

			},

			/**
			 * Finds all strings that matches the searched value in each grid
			 * cells.
			 * 
			 * @private
			 */
			searchOnPage : function()
			{
				var me = this;
				var searchValue = me.getSearchTextInput().value;
				var anyMatch = me.getMatchCriteria().getValue();
				if( 'anyMatch' === anyMatch.searchOnPage )
				{
					anyMatch = false;
				}
				else
				{
					anyMatch = true;
				}

				var grid = me.getGrid();
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
									// populate indexes array, set currentIndex, and
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

			handleClientEntryAction : function( entryType )
			{
				var me = this;
				var selectedSeller = null;
				var currencyRateMstFilterViewRef = me.getCurrencyRateMstFilterViewRef();
				selectedSeller = me.sellerFilterVal;
				var selectedClient = null;
				selectedClient = me.clientFilterVal;
				var form;
				var strUrl = 'showCurrencyRateMstEntry.srvc';
				var errorMsg = null;

				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$viewState', '' ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', '$pageMode', 'NEW' ) );
				form.action = strUrl;
				me.setFilterParameters( form );
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},

			/* Function sets the filter Panel element values in JSON */
			setFilterParameters : function( form )
			{
				var me = this;
				var orderingPartyId = null;
				var orderingPartyName = null;
				var arrJsn = {};
				var currencyRateMstFilterViewRef = me.getCurrencyRateMstFilterViewRef();

				var orderPartyNameFltId = currencyRateMstFilterViewRef.down( 'combobox[itemId=orderPartyNameFltId]' );
				var orderPartyCodeFltId = currencyRateMstFilterViewRef.down( 'combobox[itemId=orderPartyCodeFltId]' );
				var selectedSeller = me.sellerFilterVal;
				var selectedClient = me.clientFilterVal;
				;
				if( !Ext.isEmpty( orderPartyNameFltId ) && !Ext.isEmpty( orderPartyNameFltId.getValue() ) )
				{
					orderingPartyName = orderPartyNameFltId.getValue();
				}
				if( !Ext.isEmpty( orderPartyCodeFltId ) && !Ext.isEmpty( orderPartyCodeFltId.getValue() ) )
				{
					orderingPartyId = orderPartyCodeFltId.getValue();
				}
				arrJsn[ 'sellerId' ] = selectedSeller;
				arrJsn[ 'clientId' ] = selectedClient;
				arrJsn[ 'clientDesc' ] = me.clientFilterDesc;
				arrJsn[ 'orderingPartyName' ] = orderingPartyName;
				arrJsn[ 'orderingPartyId' ] = orderingPartyId;
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'filterData', Ext.encode( arrJsn ) ) );
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
							var oredringPartyName = '';
							var orderingPartyId = '';
							var seller = '';
							var client = '';
							var currencyRateMstFilterViewRef = me.getCurrencyRateMstFilterViewRef();
							var orderPartyNameFltId = currencyRateMstFilterViewRef
								.down( 'combobox[itemId=orderPartyNameFltId]' );
							var orderPartyCodeFltId = currencyRateMstFilterViewRef
								.down( 'combobox[itemId=orderPartyCodeFltId]' );
							var uploadDateFieldRef = me.getUploadDateFieldRef(); 
							if( !Ext.isEmpty( orderPartyNameFltId ) && !Ext.isEmpty( orderPartyNameFltId.getValue() ) )
							{
								oredringPartyName = orderPartyNameFltId.getValue();
							}
							else
								oredringPartyName = getLabel( 'none', 'None' );

							if( !Ext.isEmpty( orderPartyCodeFltId ) && !Ext.isEmpty( orderPartyCodeFltId.getValue() ) )
							{
								orderingPartyId = orderPartyCodeFltId.getValue();
							}
							else
								orderingPartyId = getLabel( 'none', 'None' );
							if( entityType == 1 )
							{
								client = ( me.clientFilterDesc != '' ) ? me.clientFilterDesc : getLabel(
									'allcompanies', 'All Companies' );
							}
							else
							{

								// client = (me.clientFilterDesc != '') ? me.clientFilterDesc : getLabel('none','None');
								if( me.clientFilterDesc )
								{
									client = me.clientFilterDesc;
								}
								else
									client = getLabel( 'none', 'None' );

							}
							var sellerRef = me.getSellerCodeFieldRef();
							if( sellerRef && sellerRef.getStore() && sellerRef.getStore().data && sellerRef.getStore().data.length > 1 )
							{
								tip.update(getLabel('financialinstitution', 'Financial Institution')
										+ ' : '
										+ sellerRef.getValue()
										+ '<br/>'
										+ getLabel( 'lblUpLoadDate', 'Upload Date' )
										+ ' : '
										+ Ext.Date.format( uploadDateFieldRef.getValue(), 'm/d/Y' ) );
							}
							else
							{
								tip.update( getLabel( 'lblUpLoadDate', 'Upload Date' )
										+ ' : '
										+ Ext.Date.format( uploadDateFieldRef.getValue(), 'm/d/Y' ) );
							}
						}
					}
				} );
			},

			handleReportAction : function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn.itemId );
			},

			downloadReport : function( actionName )
			{
				var me = this;
				var withHeaderFlag = me.getWithHeaderCheckbox().checked;
				var arrExtension =
				{
					downloadXls : 'xls',
					downloadCsv : 'csv',
					downloadReport : 'pdf',
					downloadTsv : 'tsv',
					downloadBAl2 : 'bai2'
				};
				var currentPage = 1;
				var strExtension = '';
				var strUrl = '';
				var strSelect = '';
				var activeCard = '';

				strExtension = arrExtension[ actionName ];
				strUrl = 'services/generateOrderingPartiesReport.' + strExtension;
				strUrl += '?$skip=1';
				//strUrl += this.generateFilterUrl();
				var objGroupView = me.getGroupView();
				var groupInfo = objGroupView.getGroupInfo();
				var subGroupInfo = objGroupView.getSubGroupInfo();
				strUrl += me.getFilterUrl( subGroupInfo, groupInfo );
				var grid = objGroupView.getGrid();
				arrColumn = grid.getAllVisibleColumns();

				if( arrColumn )
				{
					var col = null;
					var colArray = new Array();
					for( var i = 0 ; i < arrColumn.length ; i++ )
					{
						col = arrColumn[ i ];
						if( col.dataIndex && arrDownloadReportColumn[ col.dataIndex ] )
							colArray.push( arrDownloadReportColumn[ col.dataIndex ] );
					}
					if( colArray.length > 0 )
						strSelect = '&$select=[' + colArray.toString() + ']';
				}

				var strOrderBy = me.reportGridOrder;
				if( !Ext.isEmpty( strOrderBy ) )
				{
					var orderIndex = strOrderBy.indexOf( 'orderby' );
					if( orderIndex > 0 )
					{
						strOrderBy = strOrderBy.substring( orderIndex, strOrderBy.length );
						var indexOfamp = strOrderBy.indexOf( '&$' );
						if( indexOfamp > 0 )
							strOrderBy = strOrderBy.substring( 0, indexOfamp );
						strUrl += '&$' + strOrderBy;
					}
				}

				strUrl = strUrl + strSelect;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );

			},

			generateFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '', strUrl = '';
				me.setDataForFilter();
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
				if( !Ext.isEmpty( strQuickFilterUrl ) )
				{
					strUrl += '&$filter=' + strQuickFilterUrl;
				}
				return strUrl;
			},

			generateUrlWithQuickFilterParams : function( me )
			{
				var filterData = me.filterData;
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
								strTemp = strTemp + ' ) ';
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

			}

		} );
function showClientPopup( brandingPkg )
{
	GCP.getApplication().fireEvent( 'showClientPopup', brandingPkg );
}
