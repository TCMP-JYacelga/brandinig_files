Ext
	.define(
		'GCP.controller.CurrencyRateDtlController',
		{
			extend : 'Ext.app.Controller',
			requires : [],
			views :
			[
				'GCP.view.CurrencyRateDtlView', 'GCP.view.CurrencyRateDtlGridView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'currencyRateDtlViewRef',
					selector : 'currencyRateDtlViewType'
				},
				{
					ref : 'groupView',
					selector : 'currencyRateDtlViewType groupView'
				},
				{
					ref : 'createNewToolBar',
					selector : 'currencyRateDtlViewType currencyRateDtlGridViewType toolbar[itemId="btnCreateNewToolBar"]'
				},
				{
					ref : 'currencyRateDtlGridViewRef',
					selector : 'currencyRateDtlViewType currencyRateDtlGridViewType'
				},
				{
					ref : 'currencyRateDtlDetailViewRef',
					selector : 'currencyRateDtlViewType currencyRateDtlGridViewType panel[itemId="currencyRateDtlDetaillViewItemId"]'
				},
				{
					ref : 'gridHeader',
					selector : 'currencyRateDtlViewType currencyRateDtlGridViewType panel[itemId="currencyRateDtlDtlViewItemId"] container[itemId="gridHeader"]'
				},
				{
					ref : 'currencyRateDtlGridRef',
					selector : 'currencyRateDtlViewType currencyRateDtlGridViewType grid[itemId="gridViewDtlId"]'
				},
				{
					ref : 'searchTextInput',
					selector : 'currencyRateDtlGridViewType textfield[itemId="searchTextField"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'currencyRateDtlGridViewType radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'grid',
					selector : 'currencyRateDtlGridViewType smartgrid'
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
				reportGridOrder : null
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

					},
					callSaveCcyList : function( strUrl )
					{
						me.saveCurrencyDetailList( strUrl );
					}

				} );

				me.control(
				{
					'currencyRateDtlViewType groupView' :
					{
						/**
						 * This is to be handled if grid model changes as per
						 * group by category. Otherewise no need to catch this
						 * event. If captured then
						 * GroupView.reconfigureGrid(gridModel) should be called
						 * with gridModel as a parameter
						 */
						'groupByChange' : function( menu, groupInfo )
						{
							me.doHandleGroupByChange( menu, groupInfo );
						},
						'groupTabChange' : function( groupInfo, subGroupInfo, tabPanel, newCard, oldCard )
						{
							me.doHandleGroupTabChange( groupInfo, subGroupInfo, tabPanel, newCard, oldCard );
						},
						'gridRender' : me.doHandleLoadGridData,
						'gridPageChange' : me.doHandleLoadGridData,
						'gridSortChange' : me.doHandleLoadGridData,
						'gridPageSizeChange' : me.doHandleLoadGridData,
						'gridColumnFilterChange' : me.doHandleLoadGridData,
						'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
						'gridRecordSave' : me.doHandleValidateCell,
						'gridStateChange' : function( grid )
						{
							//me.toggleSavePrefrenceAction(true);
						},
						'gridRowActionClick' : function( grid, rowIndex, columnIndex, actionName, record )
						{
							me.doHandleRowActions( actionName, grid, record );
						},
						'groupActionClick' : function( actionName, isGroupAction, maskPosition, grid,
							arrSelectedRecords )
						{
							if( isGroupAction === true )
								me.doHandleGroupActions( actionName, grid, arrSelectedRecords, 'groupAction' );
						},
						afterrender : function( panel, opts )
						{
							//me.setFilterRetainedValues();
							me.clientFilterVal = strClientId;
							me.clientFilterDesc = strClientDescr;
							me.setInfoTooltip();
						}

					}

				} );
			},

			doHandleGroupByChange : function( menu, groupInfo )
			{
				var me = this;
				/*if (me.previouGrouByCode === 'ADVFILTER') {
					me.savePrefAdvFilterCode = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
				}
				if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
					me.previouGrouByCode = groupInfo.groupTypeCode;
				} else
					me.previouGrouByCode = null;*/
			},

			doHandleGroupTabChange : function( groupInfo, subGroupInfo, tabPanel, newCard, oldCard )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var strModule = '', strUrl = null, args = null, strFilterCode = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
				if( groupInfo )
				{
					args =
					{
						scope : me
					};
					var colPrefModuleName = ( subGroupInfo.groupCode === 'all' ) ? ( groupInfo.groupTypeCode + subGroupInfo.groupCode )
						: subGroupInfo.groupCode;
					strModule = colPrefModuleName;
					//me.getSavedPreferences(strUrl,
					//		me.postHandleDoHandleGroupTabChange, args);
					var data = null;
					me.postHandleDoHandleGroupTabChange( data, args );

				}
			},

			postHandleDoHandleGroupTabChange : function( data, args )
			{
				var me = args.scope;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getCurrencyRateDtlViewRef(), objPref = null, gridModel = null, intPgSize = null;
				var colModel = null, arrCols = null;
				if( data && data.preference )
				{
					objPref = Ext.decode( data.preference );
					arrCols = objPref.gridCols || null;
					intPgSize = objPref.pgSize || _GridSizeTxn;
					colModel = objSummaryView.getColumnModel( arrCols );
					if( colModel )
					{
						gridModel =
						{
							columnModel : colModel,
							pageSize : intPgSize,
							storeModel :
							{
								sortState : objPref.sortState
							}
						}
					}
				}
				objGroupView.reconfigureGrid( gridModel );
			},

			doHandleLoadGridData : function( groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter,
				filterData )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				//objGroupView.handleGroupActionsVisibility(buttonMask);
				me.setDataForFilter();
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				strUrl += me.getFilterUrl( subGroupInfo, groupInfo );
				me.reportGridOrder = strUrl;
				grid.loadGridData( strUrl, null, null, false );
			},

			applySeekFilter : function()
			{
				var me = this;
				//me.changeFilterParams();
				me.setDataForFilter();
				me.applyFilter();
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

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				me.setDataForFilter();
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				strUrl = strUrl + me.getFilterUrl();
				grid.loadGridData( strUrl, null );
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
				strQuickFilterUrl += '&$viewState=' + encodeURIComponent( viewState );
				return strQuickFilterUrl;
			},

			generateUrlWithFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
				var strTemp = '';
				var strFilterParam = '';
				if( !Ext.isEmpty( filterData ) )
				{
					for( var index = 0 ; index < filterData.length ; index++ )
					{
						if( isFilterApplied )
							strTemp = strTemp + ' and ';
						switch( filterData[ index ].operatorValue )
						{
							case 'bt':
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'' + ' and ' + '\'' + filterData[ index ].paramValue2 + '\'';
								break;
							case 'in':
								var arrId = filterData[ index ].paramValue1;
								if( 0 != arrId.length )
								{
									strTemp = strTemp + '(';
									for( var count = 0 ; count < arrId.length ; count++ )
									{
										strTemp = strTemp + filterData[ index ].paramName + ' eq ' + '\''
											+ arrId[ count ] + '\'';
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
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'';
								break;
						}
						isFilterApplied = true;
					}
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
				return null;
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
							me.showHistory( true, record.get( 'clientId' ), record.get( 'history' ).__deferred.uri,
								record.get( 'identifier' ) );
						}
					}
				}
				else if( actionName === 'btnView' || actionName === 'btnEdit' )
				{
					if( actionName === 'btnView' )
					{
						me.submitExtForm( 'viewCurrencyRateMst.srvc', record, rowIndex );
					}
					else if( actionName === 'btnEdit' )
					{
						me.submitExtForm( 'editCurrencyRateMst.srvc', record, rowIndex );
					}
				}
			},

			submitExtForm : function( strUrl, record, rowIndex )
			{
				var me = this;
				var viewState = record.data.identifier;
				var updateIndex = rowIndex;
				var form, inputField;

				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'viewState', viewState ) );
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
				setDirtyBit();
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
			
			doHandleValidateCell : function( record, editor, grid )
			{
				if( isNaN( record.data.sellFxRate ) )
				{
					record.data.sellFxRate = '0.0';
				}
				
				if( isNaN( record.data.buyFxRate ) )
				{
					record.data.buyFxRate = '0.0';
				}
				
				if( isNaN( record.data.fxRate ) )
				{
					record.data.fxRate = '0.0';
				}
				setDirtyBit();
			},
			doHandleGroupActions : function( strAction, grid, arrSelectedRecords, strActionType )
			{
				var me = this;
				if( !Ext.isEmpty( strAction ) )
					var strAction = strAction;
				var strUrl = Ext.String.format( 'services/currencyRateMstList/{0}.srvc?', strAction );
				if( strAction === 'reject' )
				{
					this.showRejectVerifyPopUp( strAction, strUrl, arrSelectedRecords );
				}
				else
				{
					this.preHandleGroupActions( strUrl, '', grid, arrSelectedRecords );
				}
			},

			showHistory : function( isClient, clientName, url, id )
			{
				Ext.create( 'GCP.view.HistoryPopup',
				{
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientName : clientName
				} ).show();
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

			enableDisableGroupActions : function( actionMask, isSameUser, isDisabled, isSubmit )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var actionBar = objGroupView.down( 'toolbar[itemId="groupActionToolBar"]' );
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

							if( ( item.maskPosition === 6 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 7 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 8 && blnEnabled )
							{
								blnEnabled = blnEnabled && isDisabled;
							}
							else if( item.maskPosition === 9 && blnEnabled )
							{
								blnEnabled = blnEnabled && !isDisabled;
							}
							else if( item.maskPosition === 10 && blnEnabled )
							{
								blnEnabled = blnEnabled && !isSubmit;
							}
							item.setDisabled( !blnEnabled );
						}
					} );
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
						if( btn == 'ok' )
						{
							me.preHandleGroupActions( strActionUrl, text, record );
						}
					}
				} );
			},

			preHandleGroupActions : function( strUrl, remark, grid, arrSelectedRecords )
			{
				var me = this;
				var groupView = me.getGroupView();
				if( !Ext.isEmpty( groupView ) )
				{
					var me = this;
					if( !Ext.isEmpty( grid ) )
					{
						var arrayJson = new Array();
						var records = ( arrSelectedRecords || [] );
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
							url : strUrl + csrfTokenName + "=" + csrfTokenValue,
							method : 'POST',
							jsonData : Ext.encode( arrayJson ),
							success : function( response )
							{
								// TODO : Action Result handling to be done here
								me.enableDisableGroupActions( '00000000000' );
								//grid.refreshData();
								//me.applyFilter();
								groupView.setLoading( false );
								groupView.refreshData();
								var errorMessage = '';
								if( response.responseText != '[]' )
								{
									var jsonData = Ext.decode( response.responseText );
									Ext.each( jsonData[ 0 ].errors, function( error, index )
									{
										errorMessage = errorMessage + error.errorMessage + "<br/>";
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

							tip.update( getLabel( 'client', 'Client' ) + ' : ' + client + '<br/>'
								+ getLabel( 'oredringPartyName', 'Ordering Party Name' ) + ' : ' + oredringPartyName
								+ '<br/>' + getLabel( 'orderIngPartyId', 'Ordering Party ID' ) + ' : '
								+ orderingPartyId );
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
				strUrl += '&$sellerCode=' + 'MTB';
				strUrl += '&$viewState=' + encodeURIComponent( viewState );

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

			},
			saveCurrencyDetailList : function( url )
			{
				var me = this;
				var counter = 0;
				var form = document.forms[ "frmMain" ];
				var url = url + '?&' + csrfTokenName + '=' + csrfTokenValue;
				var url = url + '&$viewState=' + encodeURIComponent( viewState );
				var gridRef = me.getGroupView();
				var counter = gridRef.getGrid().getStore().data.items.length;

				if( counter > 0 )
				{
					for( var index = 0 ; index < counter ; index++ )
					{
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
							+ '].uploadNmbr', gridRef.getGrid().getStore().data.items[ index ].data.uploadNmbr ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
							+ '].ccyPairCode', gridRef.getGrid().getStore().data.items[ index ].data.ccyPairCode ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
							+ '].ccyCode', gridRef.getGrid().getStore().data.items[ index ].data.ccyCode ) );
						form
							.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
								+ '].derivedCcyCode',
								gridRef.getGrid().getStore().data.items[ index ].data.derivedCcyCode ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
							+ '].buyFxRate', gridRef.getGrid().getStore().data.items[ index ].data.buyFxRate ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
							+ '].sellFxRate', gridRef.getGrid().getStore().data.items[ index ].data.sellFxRate ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
							+ '].fxRate', gridRef.getGrid().getStore().data.items[ index ].data.fxRate ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
							+ '].identifier', gridRef.getGrid().getStore().data.items[ index ].data.identifier ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
							+ '].recordKeyNo', gridRef.getGrid().getStore().data.items[ index ].data.recordKeyNo ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'currencyRateDtlBeans[' + index
							+ '].version', gridRef.getGrid().getStore().data.items[ index ].data.version ) );
					}
					if( counter > 0 )
					{
						form.method = 'POST';
						form.action = url;
						form.submit();
					}
				}
			}

		} );
function showClientPopup( brandingPkg )
{
	GCP.getApplication().fireEvent( 'showClientPopup', brandingPkg );
}

function saveCurrencyDetailRecords( strUrl )
{
	GCP.getApplication().fireEvent( 'callSaveCcyList', strUrl );
}
