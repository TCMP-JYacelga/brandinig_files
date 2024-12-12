Ext
	.define(
		'GCP.controller.AgentSetupSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.Ajax'
			],
			views :
			[
				'GCP.view.AgentSetupSummaryView', 'GCP.view.AgentSetupSummaryGridView', 'GCP.view.HistoryPopup'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'agentSetupSummaryView',
					selector : 'agentSetupSummaryView'
				},
				{
					ref : 'createNewToolBar',
					selector : 'agentSetupSummaryView agentSetupSummaryGridView toolbar[itemId="btnCreateNewToolBar"]'
				},
				{
					ref : 'specificFilterPanel',
					selector : 'agentSetupSummaryView agentSetupSummaryFilterView panel[itemId="specificFilter"]'
				},
				{
					ref : 'agentSetupSummaryFilterViewRef',
					selector : 'agentSetupSummaryView agentSetupSummaryFilterView'
				},				
				{
					ref : 'agentSetupSummaryGridView',
					selector : 'agentSetupSummaryView agentSetupSummaryGridView'
				},
				{
					ref : 'agentSetupSummaryDtlView',
					selector : 'agentSetupSummaryView agentSetupSummaryGridView panel[itemId="agentSetupSummaryDtlView"]'
				},
				{
					ref : 'gridHeader',
					selector : 'agentSetupSummaryView agentSetupSummaryGridView panel[itemId="agentSetupSummaryDtlView"] container[itemId="gridHeader"]'
				},
				{
					ref : 'agentSetupSummaryGrid',
					selector : 'agentSetupSummaryView agentSetupSummaryGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'searchTextInput',
					selector : 'agentSetupSummaryGridView textfield[itemId="searchTextField"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'agentSetupSummaryGridView radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'grid',
					selector : 'agentSetupSummaryGridView smartgrid'
				},
				{
					ref : "sellerCombo",
					selector : 'agentSetupSummaryView agentSetupSummaryFilterView combobox[itemId="sellerFltId"]'
				},
				{
					ref : "statusFilter",
					selector : 'agentSetupSummaryView agentSetupSummaryFilterView combobox[itemId="statusFilter"]'
				},
				{
					ref : 'groupActionBar',
					selector : 'agentSetupSummaryView agentSetupSummaryGridView agentSetupSummaryActionBarView'
				},
				{
					ref : 'agentNameField',
					selector : 'agentSetupSummaryView agentSetupSummaryFilterView AutoCompleter[itemId=agentName]'
				}
			],
			config :
			{
				filterData : [],
				statusType : 'all'
			},
			init : function()
			{
				var me = this;

				me
					.control(
					{
						'agentSetupSummaryView agentSetupSummaryGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateAgent"]' :
						{
							click : function()
							{
								me.handleAgentSetupEntryAction( true );
							}
						},
						'agentSetupSummaryView agentSetupSummaryFilterView' :
						{
							render : function()
							{
								me.setInfoTooltip();
								me.handleSpecificFilter();
							},
							filterStatusType : function( btn, opts )
							{
								me.handleStatusTypeFilter( btn );
							}
						},
						'agentSetupSummaryView agentSetupSummaryFilterView button[itemId="btnFilter"]' :
						{
							click : function( btn, opts )
							{
								me.setDataForFilter();
								me.applyFilter();
							}
						},
						'agentSetupSummaryView agentSetupSummaryGridView panel[itemId="agentSetupSummaryDtlView"]' :
						{
							render : function()
							{
								me.handleGridHeader();

							}
						},
						'agentSetupSummaryView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' :
						{
							click : function()
							{
								me.filterData = [];
								me.handleSpecificFilter();
								me.handleGridHeader();
							}
						},
						'agentSetupSummaryFilterView combo[itemId="sellerFltId"]' :
						{
							select : function( combo, record, index )
							{
								var objFilterPanel = me.getAgentSetupSummaryFilterViewRef();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agentName"]' );
								objAutocompleter.cfgUrl = 'services/userseek/agentnameseek.json';
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : combo.getValue()
									}
								];
							}
						},
						'agentSetupSummaryGridView' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'agentSetupSummaryGridView textfield[itemId="searchTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchOnPage();
							}
						},
						'agentSetupSummaryGridView radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchOnPage();
							}
						},
						'agentSetupSummaryGridView smartgrid' :
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
						'agentSetupSummaryGridView toolbar[itemId=groupActionBarView]' :
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
				var me = this;
				//		me.getSearchTextInput().setValue('');
				//me.getStatusFilter().setValue( '' );
				var objStore = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'value', 'name'
					],
					proxy :
					{
						type : 'ajax',
						autoLoad : true,
						url : 'services/lmsInterestProfileMasterSeek/sellerList.json',
						reader :
						{
							type : 'json',
							root : 'filterList'
						}
					}
				} );
			},
			handleGridHeader : function()
			{
				var me = this;
				var gridHeaderPanel = me.getGridHeader();
				var createNewPanel = me.getCreateNewToolBar();
				if( !Ext.isEmpty( createNewPanel ) )
				{
					createNewPanel.removeAll();
				}
				/*createNewPanel.add(
				{
					xtype : 'label',
					text : getLabel( 'createNew', 'Create New' ),
					cls : 'f13'
				} );*/
				createNewPanel.add(
				{
					xtype : 'button',
					border : 0,
					text : getLabel('createNewAgent', 'Create Agent'),
					cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
					glyph:'xf055@fontawesome',
					parent : this,
					itemId : 'btnCreateAgent'
				} );
			},

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				var grid = me.getGrid();
				if( !Ext.isEmpty( grid ) )
				{
					var strDataUrl = grid.store.dataUrl;
					var store = grid.store;
					var strUrl = grid.generateUrl( strDataUrl, grid.pageSize, newPgNo, oldPgNo, store.sorters );
					strUrl = strUrl + me.getFilterUrl();
					me.enableDisableGroupActions( '000000000');
					grid.setLoading(true);
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
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
				//me.getSearchTextInput().setValue('');
				var agentName = null, statusVal = null, jsonArray = [];
				var sellerVal = null;

				var sellerFltId = me.getSellerCombo();
				if( !Ext.isEmpty( sellerFltId ) && !Ext.isEmpty( sellerFltId.getValue() )
					&& "ALL" != sellerFltId.getValue() )
				{
					sellerVal = sellerFltId.getValue();
				}
			
				var agentNameFieldRef = me.getAgentNameField();
				if( !Ext.isEmpty( agentNameFieldRef ) )
				{
					if( !Ext.isEmpty( agentNameFieldRef.getValue() ) )
					{
						agentName = agentNameFieldRef.getValue();
					}
				}				
				
				if( !Ext.isEmpty( me.statusType ) && 'ALL' != me.statusType.toUpperCase() )				
				{
					 if(me.statusType  == '0NY' || me.statusType  == '1YY' ){
	                    	me.statusType  = new Array('0NY','1YY')
	                        jsonArray.push(
	                                   {
	                                        paramName : 'statusFilter',
	                                        paramValue1 : me.statusType,
	                                        operatorValue : 'in',
	                                        dataType : 'S'
	                                   } );
	                   }
	                   else {	
					jsonArray.push({
						paramName : 'statusFilter',
						paramValue1 : me.statusType,
						operatorValue : 'eq',
						dataType : 'S'
					});
				  }
				}

				if( !Ext.isEmpty( agentName ) )
				{
					jsonArray.push(
					{
						paramName : 'agentCode',
						paramValue1 : agentName,
						operatorValue : 'lk',
						dataType : 'S'
					} );
				}

				if( !Ext.isEmpty( sellerVal ) )
				{
					jsonArray.push(
					{
						paramName : sellerFltId.filterParamName,
						paramValue1 : sellerVal.toUpperCase(),
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
					grid.setLoading( true );
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var agentSetupSummaryGrid = me.getAgentSetupSummaryGrid();
				var objConfigMap = me.getAgentSetupSummaryGridConfiguration();
				var arrCols = new Array();
				if( !Ext.isEmpty( agentSetupSummaryGrid ) )
					agentSetupSummaryGrid.destroy( true );

				arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel );

			},

			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var agentSetupSummaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					hideRowNumbererColumn : true,
					pageSize : _GridSizeMaster,
					stateful : false,
					showEmptyRow : false,
					padding : '0 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					width : '100%',
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
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

				var agentSetupSummaryDtlView = me.getAgentSetupSummaryDtlView();
				agentSetupSummaryDtlView.add( agentSetupSummaryGrid );
				agentSetupSummaryDtlView.doLayout();
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
						me.showHistory( record.get( 'agentName' ), record.get( 'history' ).__deferred.uri, record
							.get( 'identifier' ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					me.submitExtForm( 'viewAgentMaster.srvc', record, rowIndex );
				}
				else if( actionName === 'btnEdit' )
				{
					me.submitExtForm( 'editAgentMaster.srvc', record, rowIndex );
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
				
				/*else if (maskPosition === 2 && retValue) {
					var reqState = record.raw.requestState;
					var submitFlag = record.raw.isSubmitted;
					var validFlag = record.raw.validFlag;
					var isDisabled = (reqState === 3 && validFlag == 'N');
					var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
					retValue = retValue && (!isDisabled) && (!isSubmitModified);
				} else if (maskPosition === 10 && retValue) {
					var reqState = record.raw.requestState;
					var submitFlag = record.raw.isSubmitted;
					var submitResult = (reqState === 0 && submitFlag == 'Y');
					retValue = retValue && (!submitResult);
				}else if (maskPosition === 8 && retValue) {
					var validFlag = record.raw.validFlag;
					var reqState = record.raw.requestState;
					retValue = retValue && (reqState == 3 && validFlag == 'N');
				}
				else if (maskPosition === 9 && retValue) {
					var validFlag = record.raw.validFlag;
					var reqState = record.raw.requestState;
					retValue = retValue && (reqState == 3 && validFlag == 'Y');
				}*/
				return retValue;
			},

			getColumns : function( arrColsPref, objWidthMap )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				arrCols.push(me.createGroupActionColumn());
				arrCols.push( me.createActionColumn() )
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						
						if(objCol.colId == 'requestStateDesc')
						{
							cfgCol.locked = false;
							cfgCol.lockable = false;
							cfgCol.sortable = false;
							cfgCol.hideable = false;
							cfgCol.draggable = false;
							cfgCol.hidden = false;
						}
						
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
					colId : 'actioncontent',
					visibleRowActionCount : 1,
					width : 45,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					resizable : false,
					draggable : false,
					menuDisabled: true,
					items :
					[
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 7
						},
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Modify Record' ),
							itemLabel : getLabel('editToolTip','Modify Record'),
							maskPosition : 8
						},
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							toolTip : getLabel( 'historyToolTip', 'View History' ),
							itemLabel : getLabel('historyToolTip','View History'),
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
				var objActionCol = {
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 130,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					resizable : false,
					draggable : false,
					items: [{
								text : getLabel('prfMstActionSubmit', 'Submit'),
								itemId : 'submit',
								actionName : 'submit',
								maskPosition : 1
							},{
								text : getLabel('prfMstActionApprove', 'Approve'),
								itemId : 'accept',
								actionName : 'accept',
								maskPosition : 2
							},{
								text : getLabel('prfMstActionReject', 'Reject'),
								itemId : 'reject',
								actionName : 'reject',
								maskPosition : 3
							},{
								text : getLabel('prfMstActionDiscard', 'Discard'),
								itemId : 'discard',
								actionName : 'discard',
								maskPosition : 6
							},{
								text : getLabel('prfMstActionEnable', 'Enable'),
								itemId : 'enable',
								actionName : 'enable',
								maskPosition : 4
							}, {
								text : getLabel('prfMstActionDisable',	'Suspend'),
								itemId : 'disable',
								actionName : 'disable',
								maskPosition : 5
							}]
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

					if (objData.raw.isSubmitted == 'Y'
						&& objData.raw.requestState != 8
						&& objData.raw.requestState != 4
						&& objData.raw.requestState != 5) {
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

			enableDisableGroupActions : function( actionMask, isSameUser,isEnabled,isDisabled,
					isSubmitted )
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
							else if( item.maskPosition === 6 && blnEnabled )
							{
								blnEnabled = blnEnabled && (isSubmitted != undefined && !isSubmitted);
							}
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},

			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'agentSetup/{0}.srvc', strAction );
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
					fieldLbl = getLabel( 'prfRejectRemarkPopUpTitle', 'Please enter reject remark' );
					titleMsg = getLabel( 'prfRejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				var msgbox = Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function( btn, text )
					{
						if(text.length >255) {
							Ext.Msg.alert(getLabel("errorTitle","Error"), getLabel("rejectRestrictionError","Reject remark should be less than 255 characters"));
							return false;
						}
						if( btn == 'ok' )
						{
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel("errorTitle","Error"), getLabel("Error","Reject Remark field can not be blank"));
							}
							else
							{
								me.preHandleGroupActions(strActionUrl, text, record);
							}
						}
					}
				} );
				msgbox.textArea.enforceMaxLength = true;
				msgbox.textArea.inputEl.set({
					maxLength : 255
				});
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
							userMessage : remark,
							recordDesc : records[ index ].data.profileDescription
						} );
					}
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						} );
					
					$.blockUI();

					Ext.Ajax.request(
					{
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),				
						callback : function(options , success, response) { 
							
							if(success) {

								// TODO : Action Result handling to be done here
								me.enableDisableGroupActions( '0000000000', true );
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
													title : getLabel('errorTitle','Error'),
													msg : errorMessage,
													buttons : Ext.MessageBox.OK,
													cls : 'ux_popup',
													icon : Ext.MessageBox.ERROR
												});
									        } 
								        }
							       }						
								console.log('Ajax Successfull');
								$.unblockUI();
							}
							else { //Failure
								$.unblockUI();
								var errMsg = "";
								Ext.MessageBox.show(
								{
									title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
									msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );						
								console.log('Ajax Failure');
								
							}
						}
					});
				}

			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				if (record.get('isEmpty')) {
					if (rowIndex === 0 && colIndex === 0) {
						meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
						return getLabel('noRecFound',
								'No records found !!!');											
					}
				} else
					return value;
			},
			getAgentSetupSummaryGridConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				objWidthMap =
				{
					"agentName" : '33%',
					"agentCode" : '33%',					
					"requestStateDesc" : '33%'
				};

				arrColsPref =
				[
					{
						"colId" : "agentName",
						"colDesc" : getLabel('lblAgentName', 'Agent Name')
					},
					{
						"colId" : "agentCode",
						"colDesc" :  getLabel('lblagentCode', 'Agent Code')
					},					
					{
						"colId" : "requestStateDesc",
						"colDesc" :  getLabel('lblstatus', 'Status')
					}
				];

				storeModel =
				{
					fields :
					[
						'agentName', 'agentCode', 'requestStateDesc', 'identifier', 'history', '__metadata', 'viewState','sellerId'			
					],
					proxyUrl : 'agentSetupSummaryList.srvc',
					rootNode : 'd.agentList',
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
			handleAgentSetupEntryAction : function( entryType )
			{
				var me = this;
				var form;
				var strUrl = 'showAgentSetupEntryForm.srvc';
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
						target : 'agentSetupSummaryFilterView-1012_header_hd-textEl',
						listeners :
						{
							// Change content dynamically depending on which element
							// triggered the show.
							beforeshow : function( tip )
							{
								var seller = '';
								var agentName = '';
								var status = '';

								var sellerFltId = me.getSellerCombo();
								if( !Ext.isEmpty( sellerFltId ) && !Ext.isEmpty( sellerFltId.getValue() ) )
								{
									seller = sellerFltId.getValue();
								}
								else
								{
									seller = getLabel( 'all', 'ALL' );
								}

								var agentNameRef = me.getAgentNameField();
								if( !Ext.isEmpty( agentNameRef ) && !Ext.isEmpty( agentNameRef.getValue() ) )
								{
									agentName = agentNameRef.getValue();
								}
								else
								{
									agentName = getLabel( 'none', 'None' );
								}
							
								
								if( !Ext.isEmpty( me.getStatusFilter() )
									&& !Ext.isEmpty( me.getStatusFilter().getValue() ) )
								{
									var combo = me.getStatusFilter();
									status = combo.getRawValue()
								}
								else
								{
									status = getLabel( 'all', 'ALL' );
								}
								
								var sellerComboCount = me.getAgentSetupSummaryFilterViewRef().down('combobox[itemId=sellerFltId]').store.getCount();
								
								if(sellerComboCount > 1) {

								tip.update( getLabel( "seller", "Seller" ) + ' : ' + seller + '<br/>'
										+ getLabel( "agentName", "Agent Name" ) + ' : ' + agentName + '<br/>'										
									+ getLabel( 'status', 'Status' ) + ' : ' + status );
								}
								else {
									tip.update(getLabel( "agentName", "Agent Name" ) + ' : ' + agentName + '<br/>'										
										+ getLabel( 'status', 'Status' ) + ' : ' + status );
								}

							}
						}
					} );
			},		
			handleStatusTypeFilter : function( btn )
			{
				var me = this;
				me.statusType = btn.value;	
			}
		} );
