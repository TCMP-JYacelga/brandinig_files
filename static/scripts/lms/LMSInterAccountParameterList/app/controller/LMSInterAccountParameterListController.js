Ext
	.define(
		'GCP.controller.LMSInterAccountParameterListController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.Ajax'
			],
			views :
			[
				'GCP.view.LMSInterAccountParameterListView', 'GCP.view.LMSInterAccountParameterListGridView',
				'GCP.view.HistoryPopup'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'lmsInterAccountParameterListView',
					selector : 'lmsInterAccountParameterListView'
				},
				{
					ref : 'createNewToolBar',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListGridView toolbar[itemId="btnCreateNewToolBar"]'
				},
				{
					ref : 'specificFilterPanel',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView panel[itemId="specificFilter"]'
				},
				{
					ref : 'profileType',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView combobox[itemId="profileType"]'
				},
				{
					ref : 'lmsInterAccountParameterListGridView',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListGridView'
				},
				{
					ref : 'lmsInterAccountParameterListDtlView',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListGridView panel[itemId="lmsInterAccountParameterListDtlView"]'
				},
				{
					ref : 'gridHeader',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListGridView panel[itemId="lmsInterAccountParameterListDtlView"] container[itemId="gridHeader"]'
				},
				{
					ref : 'lmsInterAccountParameterListGrid',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'searchTextInput',
					selector : 'lmsInterAccountParameterListGridView textfield[itemId="searchTextField"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'lmsInterAccountParameterListGridView radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'grid',
					selector : 'lmsInterAccountParameterListGridView smartgrid'
				},
				{
					ref : "clientFilter",
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId="clientCodeItemId"]'
				},
				{
					ref : "agreementCodeFilter",
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId="agreementCodeItemId"]'
				},
				{
					ref : "fromAccountFilter",
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId="fromAccountItemId"]'
				},
				{
					ref : "toAccountFilter",
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId="toAccountItemId"]'
				},
				{
					ref : 'groupActionBar',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListGridView lmsInterAccountParameterListActionBarView'
				},
				{
					ref : 'profileNameField',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId=profileName]'
				},
				{
					ref : 'lmsInterAccountParameterListFilterViewRef',
					selector : 'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView'
				}
			],
			config :
			{
				filterData : []
			},
			init : function()
			{
				var me = this;

				me
					.control(
					{
						'lmsInterAccountParameterListView lmsInterAccountParameterListGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateLMSInterAccountParameterList"]' :
						{
							click : function()
							{
								me.handleLMSInterAccountParameterListEntryAction( true );
							}
						},
						'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView' :
						{
							render : function()
							{
								me.setInfoTooltip();
								me.handleSpecificFilter();
							}
						},
						/*'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView button[itemId="btnFilter"]' :
						{
							click : function( btn, opts )
							{
								me.setDataForFilter();
								me.applyFilter();
							}
						},*/
						'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId="clientCodeItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objFilterPanel = me.getLmsInterAccountParameterListFilterViewRef();
								var objAutocompleter = objFilterPanel
									.down( 'AutoCompleter[itemId="agreementCodeItemId"]' );

								strClientId = record[ 0 ].data.CODE;
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : ( (null == strSellerId || '' == strSellerId) ? '%' : strSellerId)
									},
									{
										key : '$filtercode2',
										value : ( (null == strClientId || '' == strClientId) ? '%' : strClientId)
									}
								];
								
								me.setDataForFilter();
								me.applyFilter();
							},
							'change':function(combo, record, index ){
								if(combo.getRawValue()==""){
										me.setDataForFilter();
										me.applyFilter();
								}
							}
						},
						'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId="fromAccountItemId"]' :
						{
							select : function( combo, record, index )
							{
								
								me.setDataForFilter();
								me.applyFilter();
							},
							'change':function(combo, record, index ){
								if(combo.getRawValue()==""){
										me.setDataForFilter();
										me.applyFilter();
								}
							}
						},
						'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId="toAccountItemId"]' :
						{
							select : function( combo, record, index )
							{
								
								me.setDataForFilter();
								me.applyFilter();
							},
							'change':function(combo, record, index ){
								if(combo.getRawValue()==""){
										me.setDataForFilter();
										me.applyFilter();
								}
							}
						},
						
						'lmsInterAccountParameterListView lmsInterAccountParameterListFilterView AutoCompleter[itemId="agreementCodeItemId"]' :
						{
							select : function( combo, record, index )
							{
								var objFilterPanel = me.getLmsInterAccountParameterListFilterViewRef();
								var objAutocompleter = objFilterPanel
									.down( 'AutoCompleter[itemId="fromAccountItemId"]' );
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode2',
										value : strSellerId
									},
									{
										key : '$filtercode3',
										value : strClientId
									},
									{
										key : '$filtercode4',
										value : record[ 0 ].data.RECKEY
									}
								];
								objAutocompleter = null;
								objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="toAccountItemId"]' );
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode2',
										value : strSellerId
									},
									{
										key : '$filtercode3',
										value : strClientId
									},
									{
										key : '$filtercode4',
										value : record[ 0 ].data.RECKEY
									}
								];
								
								me.setDataForFilter();
								me.applyFilter();

							},
							'change':function(combo, record, index ){
								if(combo.getRawValue()==""){
										me.setDataForFilter();
										me.applyFilter();
								}
							}
						},
						'lmsInterAccountParameterListView lmsInterAccountParameterListGridView panel[itemId="lmsInterAccountParameterListDtlView"]' :
						{
							render : function()
							{
								me.handleGridHeader();
							}
						},
						'lmsInterAccountParameterListView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' :
						{
							click : function()
							{
								me.filterData = [];
								me.handleSpecificFilter();
								me.handleGridHeader();
							}
						},

						'lmsInterAccountParameterListGridView' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'lmsInterAccountParameterListGridView textfield[itemId="searchTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchOnPage();
							}
						},
						'lmsInterAccountParameterListGridView radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchOnPage();
							}
						},
						'lmsInterAccountParameterListGridView smartgrid' :
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
							}
						},
						'lmsInterAccountParameterListGridView toolbar[itemId=groupActionBarView]' :
						{
							performGroupAction : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						}

					} );
			},

			handleSpecificFilter : function()
			{
			},
			handleGridHeader : function()
			{

			},

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				strUrl += '&' + csrfTokenName + '=' + csrfTokenValue;
				me.enableDisableGroupActions( '000000000');
				grid.setLoading(true);
				grid.loadGridData( strUrl, null );
			},

			getFilterUrl : function()
			{
				var me = this;
				var strQuickFilterUrl = '';
				strQuickFilterUrl = me.generateUrlWithFilterParams( this );
				strQuickFilterUrl += '&' + csrfTokenName + '=' + csrfTokenValue;
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
						default:
							// Default opertator is eq
							strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue
								+ ' ' + '\'' + filterData[ index ].paramValue1 + '\'';
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
				var jsonArray = [];
				var clientValue = null;
				var agreementCodeFilter = null;
				var agreementCodeValue = null;
				
				var fromAccountFilter = null;
				var fromAccountValue = null;
				
				var toAccountFilter = null;
				var toAccountValue = null;				

				var clientFilter = me.getClientFilter();
				if( !Ext.isEmpty( clientFilter ) && !Ext.isEmpty( clientFilter.getValue() )
					&& "ALL" != clientFilter.getValue() )
				{
					clientValue = clientFilter.getValue();
				}		
				
				if( !Ext.isEmpty( clientValue ) )
				{
					jsonArray.push(
					{
						paramName : clientFilter.filterParamName,
						paramValue1 : clientValue.toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				
				agreementCodeFilter = me.getAgreementCodeFilter();
				if( !Ext.isEmpty( agreementCodeFilter ) && !Ext.isEmpty( agreementCodeFilter.getValue() )
					&& "ALL" != agreementCodeFilter.getValue() )
				{
					agreementCodeValue = agreementCodeFilter.getValue();
				}		
				
				if( !Ext.isEmpty( agreementCodeValue ) )
				{
					jsonArray.push(
					{
						paramName : agreementCodeFilter.filterParamName,
						paramValue1 : agreementCodeValue.toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				
				fromAccountFilter = me.getFromAccountFilter();
				if( !Ext.isEmpty( fromAccountFilter ) && !Ext.isEmpty( fromAccountFilter.getValue() )
					&& "ALL" != fromAccountFilter.getValue() )
				{
					fromAccountValue = fromAccountFilter.getValue();
				}		
				
				if( !Ext.isEmpty( fromAccountValue ) )
				{
					jsonArray.push(
					{
						paramName : fromAccountFilter.filterParamName,
						paramValue1 : fromAccountValue.toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				
				toAccountFilter = me.getToAccountFilter();
				if( !Ext.isEmpty( fromAccountFilter ) && !Ext.isEmpty( fromAccountFilter.getValue() )
					&& "ALL" != fromAccountFilter.getValue() )
				{
					toAccountValue = toAccountFilter.getValue();
				}		
				
				if( !Ext.isEmpty( toAccountValue ) )
				{
					jsonArray.push(
					{
						paramName : toAccountFilter.filterParamName,
						paramValue1 : toAccountValue.toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				
				me.filterData = jsonArray;
			},
			applyFilter : function()
			{
				var me = this;
				var grid = me.getGrid();
				if( !Ext.isEmpty( grid ) )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, 1, 1, store.sorters );
					strUrl = strUrl + me.getFilterUrl();
					me.enableDisableGroupActions( '000000000');
					grid.setLoading(true);
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var lmsInterAccountParameterListGrid = me.getLmsInterAccountParameterListGrid();
				var objConfigMap = me.getLMSInterAccountParameterListGridConfiguration();
				var arrCols = new Array();
				if( !Ext.isEmpty( lmsInterAccountParameterListGrid ) )
					lmsInterAccountParameterListGrid.destroy( true );

				arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel );

			},

			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				pgSize = 10;
				var lmsInterAccountParameterListGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
					padding : '5 0 0 0',
					rowList : _AvailableGridSize,
					minHeight : 0,
					hideRowNumbererColumn:true,
					cls:'t7-grid',
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					//					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},

					handleMoreMenuItemClick : function( grid, rowIndex, cellIndex, menu, event, record )
					{
						var dataParams = menu.dataParams;
						me.handleRowIconClick( dataParams.view, dataParams.rowIndex, dataParams.columnIndex, menu,
							null, dataParams.record );
					}
				} );

				var lmsInterAccountParameterListDtlView = me.getLmsInterAccountParameterListDtlView();
				lmsInterAccountParameterListDtlView.add( lmsInterAccountParameterListGrid );
				lmsInterAccountParameterListDtlView.doLayout();
			},

			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'submit' || actionName === 'accept' || actionName === 'enable'
					|| actionName === 'disable' || actionName === 'reject' || actionName === 'discard' )
					me.handleGroupActions( btn, record );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'profileName' ), record.get( 'history' ).__deferred.uri, record
							.get( 'identifier' ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					me.submitExtForm( 'viewLMSInterAccountParameterListMst.srvc', record, rowIndex );
				}
				else if( actionName === 'btnEdit' )
				{
					me.submitExtForm( 'lmsEditLMSInterAccountParameterListMst.srvc', record, rowIndex );
				}
				else if( actionName === 'btnSpecialEdit' )
				{
					me.showSpecialEditWindow( record, rowIndex );
				}
			},
			submitExtForm : function( strUrl, record, rowIndex )
			{
				var me = this;
				var viewState = record.data.viewState;
				var updateIndex = rowIndex;
				var form, inputField;

				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'viewState', viewState ) );

				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
			},

			showHistory : function( product, url, id )
			{
				Ext.create( 'GCP.view.HistoryPopup',
				{
					productName : product,
					historyUrl : url,
					identifier : id
				} ).show();
			},
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 9;
				var maskArray = new Array();
				var actionMask = '';
				var rightsMap = record.data.__metadata.__rightsMap;
				var specialEditStatus = record.data.specialEditStatus;
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
				var reqState = record.raw.requestState;
				var submitFlag = record.raw.isSubmitted;
				var validFlag = record.raw.validFlag;

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
				else if( maskPosition === 8 && retValue ) 
				{
					retValue = true;
				}
				return retValue;
			},

			getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				//arrCols.push(me.createGroupActionColumn());
				arrCols.push( me.createActionColumn() )
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
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

			createActionColumn : function()
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
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Edit' ),
							itemLabel : getLabel('editToolTip', 'Edit Record'),
							maskPosition : 8
						},
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							itemLabel : getLabel('viewToolTip', 'View Record'),
							maskPosition : 7
						},
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							toolTip : getLabel( 'historyToolTip', 'View History' ),
							itemLabel : getLabel( 'historyToolTip', 'View History' ),
							maskPosition : 9
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

			createGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 120,
					locked : true,
					items :
					[
						{
							text : getLabel( 'prfMstActionSubmit', 'Submit' ),
							itemId : 'submit',
							actionName : 'submit',
							maskPosition : 1
						},
						{
							text : getLabel( 'prfMstActionDiscard', 'Discard' ),
							itemId : 'discard',
							actionName : 'discard',
							maskPosition : 6
						},
						{
							text : getLabel( 'prfMstActionApprove', 'Approve' ),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 2
						},
						{
							text : getLabel( 'prfMstActionReject', 'Reject' ),
							itemId : 'reject',
							actionName : 'reject',
							maskPosition : 3
						},
						{
							text : getLabel( 'prfMstActionEnable', 'Enable' ),
							itemId : 'enable',
							actionName : 'enable',
							maskPosition : 4
						},
						{
							text : getLabel( 'prfMstActionDisable', 'Disable' ),
							itemId : 'disable',
							actionName : 'disable',
							maskPosition : 5
						}
					]
				};
				return objActionCol;
			},

			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '0000000000';
				var maskArray = new Array(), actionMask = '', objData = null;
				;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				var isDisabled = false;
				var isSubmit = false;
				var isEnabled = false;
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
						isEnabled = true;
					}

					if( objData.raw.validFlag == 'Y' )
					{
						isDisabled = true;
					}

					if( objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0 )
					{
						isSubmit = true;
					}
				}
				if( isEnabled && isDisabled )
				{
					isEnabled = false;
					isDisabled = false;
				}
				actionMask = doAndOperation( maskArray, 10 );
				me.enableDisableGroupActions( actionMask, isSameUser, isEnabled, isDisabled, isSubmit );
			},

			enableDisableGroupActions : function( actionMask, isSameUser, isEnabled, isDisabled, isSubmit )
			{
				var actionBar = this.getGroupActionBar();
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

							if( ( item.maskPosition === 2 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 3 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							/*
							else if (item.maskPosition === 8 && blnEnabled) 
							{
								blnEnabled = blnEnabled && isEnabled;
							}
							else if (item.maskPosition === 9 && blnEnabled)
							{
								blnEnabled = blnEnabled && isDisabled;
							}
							else if (item.maskPosition === 10 && blnEnabled)
							{
								blnEnabled = blnEnabled && !isSubmit;
							}*/
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},

			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'lmsLMSInterAccountParameterListMst/{0}.srvc', strAction );
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
						if(text.length >255) {
							Ext.Msg.alert('Error', getLabel('rejectRestrictionError', 'Reject remark should be less than 255 characters'));
							return false;
						}
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
				var grid = this.getGrid();
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
							// TODO : Action Result handling to be done here
							me.enableDisableGroupActions( '0000000000', true );
							grid.refreshData();
							var errorMessage = '';
							if( response.responseText != '[]' )
							{
								var jsonData = Ext.decode( response.responseText );
								Ext.each( jsonData[ 0 ].errors, function( error, index )
								{
									errorMessage = errorMessage + error.code + ' : ' + error.errorMessage + "<br/>";
								} );
								if( '' != errorMessage && null != errorMessage )
								{
									Ext.Msg.alert( "Error", errorMessage );
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
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				strRetValue = value;
				return strRetValue;
			},
			getLMSInterAccountParameterListGridConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				objWidthMap =
				{
					"agreementName" : 155,
					"fromAccount" : 130,
					"fromAccountDesc" : 150,
					"toAccount" : 130,
					"toAccountDesc" : 200,
					"requestStateDesc" : 200
				};

				arrColsPref =
				[
					{
						"colId" : "agreementName",
						"colDesc" : getLabel('agreementName', 'Agreement Name')
					},
					{
						"colId" : "agreementCode",
						"colDesc" : getLabel( 'agreementCode', 'Agreement Code' )
					},
					{
						"colId" : "fromAccount",
						"colDesc" : getLabel('fromAccount', 'From Account')
					},
					{
						"colId" : "fromAccountDesc",
						"colDesc" : getLabel('fromDescription', 'From Description')
					},
					{
						"colId" : "toAccount",
						"colDesc" : getLabel('toAcc', 'To Account')
					},
					{
						"colId" : "toAccountDesc",
						"colDesc" : getLabel('toAccDesc', 'To Account Description')
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : getLabel('status', 'Status')
					}
				];

				storeModel =
				{
					fields :
					[
						'agreementName', 'agreementCode','fromAccount', 'fromAccountDesc', 'toAccount', 'toAccountDesc',
						'requestStateDesc', 'identifier', 'history', '__metadata', 'viewState'
					],
					proxyUrl : 'lmsLMSInterAccountParameterListMst.srvc',
					rootNode : 'd.profile',
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
			/**
			 * Finds all strings that matches the searched value in each grid
			 * cells.
			 * 
			 * @private
			 */
			searchOnPage : function()
			{
				var me = this;
				//var searchValue = me.getSearchTextInput().value;
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
			handleLMSInterAccountParameterListEntryAction : function( entryType )
			{
				var me = this;
				var form;
				var strUrl = 'showLMSInterAccountParameterListMst.srvc';
				var errorMsg = null;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );

				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
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
						target : 'imgFilterInfo',
						listeners :
						{
							// Change content dynamically depending on which element
							// triggered the show.
							beforeshow : function( tip )
							{
								var agreementCodeFilter = null;
								var agreementCodeValue = null;
								
								var fromAccountFilter = null;
								var fromAccountValue = null;
								
								var toAccountFilter = null;
								var toAccountValue = null;	
								
								var clientFilterValue = null;
								
								
								var clientFilter = me.getClientFilter();
								if( !Ext.isEmpty( clientFilter ) && !Ext.isEmpty( clientFilter.getValue() ) )
								{
									clientFilterValue = clientFilter.getValue();
								}
								else
								{
									clientFilterValue = getLabel( 'all', 'ALL' );
								}


								var agreementCodeFilter = me.getAgreementCodeFilter();
								if( !Ext.isEmpty( agreementCodeFilter ) && !Ext.isEmpty( agreementCodeFilter.getValue() ) )
								{
									agreementCodeValue = agreementCodeFilter.getValue();
								}
								else
								{
									agreementCodeValue = getLabel( 'all', 'ALL' );
								}

								var fromAccountFilter = me.getFromAccountFilter();
								if( !Ext.isEmpty( fromAccountFilter ) && !Ext.isEmpty( fromAccountFilter.getValue() ) )
								{
									fromAccountValue = fromAccountFilter.getValue();
								}
								else
								{
									fromAccountValue = getLabel( 'all', 'ALL' );
								}
								

								var toAccountFilter = me.getToAccountFilter();
								if( !Ext.isEmpty( toAccountFilter ) && !Ext.isEmpty( toAccountFilter.getValue() ) )
								{
									toAccountValue = toAccountFilter.getValue();
								}
								else
								{
									toAccountValue = getLabel( 'all', 'ALL' );
								}
								
								tip.update( 
									getLabel( "client", "Client")  + ' : ' + clientFilterValue + '<br/>'
									+ getLabel( "agreementCode", "Agreement Code" ) + ' : ' + agreementCodeValue + '<br/>'
									+ getLabel( "fromAccount", "From Account" ) + ' : ' + fromAccountValue + '<br/>'
									+ getLabel( "toAccount", "To Account" ) + ' : ' + toAccountValue);
							}
						}
					} );
			},
			showSpecialEditWindow : function( record, rowIndex )
			{
				var me = this;
				var win;
				var refresh = true;
				var form = Ext.widget( 'form',
					{
						layout :
						{
							type : 'vbox',
							align : 'stretch'
						},
						border : false,
						bodyPadding : 10,
						parent : this,
						//standardSubmit : true,
						fieldDefaults :
						{
							labelAlign : 'top',
							labelWidth : 100,
							labelStyle : 'font-weight:bold'
						},
						url : 'lmsLMSInterAccountParameterListMst/specialedit.srvc',
						headers :
						{
							'Content-Type' : 'application/javascript'
						},
						items :
						[
							{
								xtype : 'hidden',
								name : csrfTokenName,
								value : csrfTokenValue
							},
							{
								xtype : 'hidden',
							//	name : rowIndex,
								name : 'rowIndex',
								value : rowIndex
							},
							{
								xtype : 'hidden',
								name : 'viewState',
								value : record.get( 'viewState' )
							},
							{
								xtype : 'hidden',
								itemId : 'identifier',
								name : 'identifier',
								value : record.get( 'identifier' )
							},
							{
								xtype : 'hidden',
								itemId : 'profileCode',
								name : 'profileCode',
								value : record.get( 'profileCode' )
							},
							{
								xtype : 'datefield',
								name : 'effectiveDate',
								itemId : 'effectiveDate',
								format : 'Y-m-d H:i:s',
								fieldLabel : getLabel('chgEffectiveForm', 'Change Effective From'),
								editable : false,
								maxValue : record.get( 'sellerAppDate' ),
								allowBlank : true
							},
							{
								xtype : 'textareafield',
								name : 'specialEditRemarks',
								fieldLabel : getLabel('splEditRemark', 'Special Edit Remarks'),
								labelAlign : 'top',
								flex : 1,
								margins : '0',
								allowBlank : true
							}
						],

						buttons :
						[
							{
								text : getLabel('cancel', 'Cancel'),
								handler : function()
								{
									this.up( 'form' ).getForm().reset();
									this.up( 'window' ).hide();
								}
							},
							{
								text : getLabel('proceed', 'Proceed'),
								handler : function()
								{
									var form = this.up( 'form' ).getForm();
									//TODO : This should not be hard coded index. It should be  iterated.
									var rowIndex = form.getValues().rowIndex;
									form
										.submit(
										{
											success : function( form, action )
											{
												var data = Ext.JSON.decode( action.response.responseText );
												if( null != data && null != data.d && null != data.d.profile )
												{
													if( data.d.profile.length > 0 )
													{
														var rowData = Ext.getCmp( 'gridViewMstId' ).store
															.getAt( rowIndex ).data;
														rowData.viewState = data.d.profile[ 0 ].viewState;
														rowData.identifier = data.d.profile[ 0 ].identifier;
													}
												}
											},
											failure : function( form, action )
											{
												var data = Ext.JSON.decode( action.response.responseText );

												if( null != data && null != data.d && null != data.d.profile )
												{
													if( data.d.profile.length > 0 )
													{
														var rowData = Ext.getCmp( 'gridViewMstId' ).store
															.getAt( rowIndex ).data;
														rowData.viewState = data.d.profile[ 0 ].viewState;
														rowData.identifier = data.d.profile[ 0 ].identifier;
														var form, inputField;

														form = document.createElement( 'FORM' );
														form.name = 'frmMain';
														form.id = 'frmMain';
														form.method = 'POST';
														form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
															csrfTokenName, csrfTokenValue ) );
														form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
															'txtRecordIndex', rowIndex ) );
														form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
															'viewState', data.d.profile[ 0 ].viewState ) );

														form.action = 'lmsEditLMSInterAccountParameterListMst.srvc';
														document.body.appendChild( form );
														form.submit();
													}
												}
											}
										} );
									this.up( 'window' ).hide();
								}
							}
						]
					} );

				win = Ext.widget( 'window',
				{
					title : getLabel('specialEdit', 'Special Edit'),
					closeAction : 'hide',
					width : 300,
					height : 300,
					layout : 'fit',
					resizable : false,
					modal : true,
					items : form,
					parent : this
				} );
				win.show();
			}
		} );
