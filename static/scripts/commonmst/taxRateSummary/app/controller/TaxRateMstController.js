Ext.define('GCP.controller.TaxRateMstController',
{
	extend : 'Ext.app.Controller',
	requires :
		[
			'Ext.Ajax'
		],
		views :
			[
				'GCP.view.TaxRateMstSummaryView', 'GCP.view.TaxRateMstGridView', 'GCP.view.HistoryPopup'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
				[
					{
						ref : 'taxRateMstSummaryView',
						selector : 'taxRateMstSummaryView'
					},
					{
						ref : 'specificFilterPanel',
						selector : 'taxRateMstSummaryView taxRateMstFilterView panel[itemId="specificFilter"]'
					},
					{
						ref : 'taxRateMstFilterViewRef',
						selector : 'taxRateMstSummaryView taxRateMstFilterView'
					},
					
					{
						ref : 'taxRateMstGridView',
						selector : 'taxRateMstSummaryView taxRateMstGridView'
					},
					{
						ref : 'taxRateMstSummaryDtlView',
						selector : 'taxRateMstSummaryView taxRateMstGridView panel[itemId="taxRateMstSummaryDtlView"]'
					},
					{
						ref : 'gridHeader',
						selector : 'taxRateMstSummaryView taxRateMstGridView panel[itemId="taxRateMstSummaryDtlView"] container[itemId="gridHeader"]'
					},
					{
						ref : 'taxRateMstGrid',
						selector : 'taxRateMstSummaryView taxRateMstGridView grid[itemId="gridViewMstId"]'
					},
					{
						ref : 'searchTextInput',
						selector : 'taxRateMstGridView textfield[itemId="searchTextField"]'
					},
					{
						ref : 'matchCriteria',
						selector : 'taxRateMstGridView radiogroup[itemId="matchCriteria"]'
					},
					{
						ref : 'grid',
						selector : 'taxRateMstGridView smartgrid'
					},
					{
						ref : "sellerCombo",
						selector : 'taxRateMstSummaryView taxRateMstFilterView combobox[itemId="sellerFltId"]'
					},
					{
						ref : "statusFilter",
						selector : 'taxRateMstSummaryView taxRateMstFilterView combobox[itemId="statusFilter"]'
					},
					{
						ref : 'groupActionBar',
						selector : 'taxRateMstSummaryView taxRateMstGridView taxRateMstActionBarView'
					},
					{
						ref : 'taxRateCode',
						selector : 'taxRateMstSummaryView taxRateMstFilterView AutoCompleter[itemId="taxRateCode"]'
					}
					
				],
				config :
				{
					filterData : []
				},
				init : function()
				{
			
					var me = this;
					me.control(
					{
					     'taxRateMstSummaryView taxRateMstGridView button[itemId="btnCreateTaxRateSummary"]' :
						 {
							addNewAgreementEvent : function()
							{
							  
								me.handleTaxRateMstEntryAction( true );
							}
					     },
					
					     'taxRateMstSummaryView taxRateMstFilterView' :
					     {
								render : function()
								{
									me.setInfoTooltip();
									me.handleSpecificFilter();
								}
						},
						'taxRateMstSummaryView taxRateMstFilterView button[itemId="btnFilter"]' :
						{
							click : function( btn, opts )
							{
								me.setDataForFilter();
								me.applyFilter();
							}
						},
						'taxRateMstSummaryView taxRateMstGridView panel[itemId="taxRateSummaryDtlView"]' :
						{
							render : function()
							{
								//me.handleGridHeader();

							}
						},
						'taxRateMstSummaryView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' :
						{
							click : function()
							{
								me.filterData = [];
								me.handleSpecificFilter();
								//me.handleGridHeader();
							}
						},
						'taxRateMstFilterView combo[itemId="sellerFltId"]' :
						{
							select : function( combo, record, index )
							{
								var objFilterPanel = me.getTaxRateMstFilterViewRef();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="profileName"]' );
								//objAutocompleter.setValue( '' );
							}
						},
						'taxRateMstGridView' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'taxRateMstGridView textfield[itemId="searchTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchOnPage();
							}
						},
						'taxRateMstGridView radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchOnPage();
							}
						},
						'taxRateMstGridView smartgrid' :
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
						'taxRateMstGridView toolbar[itemId=groupActionBarView]' :
						{
							performGroupAction : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						}
					});
            },
            handleSpecificFilter : function()
			{
				var me = this;
				//		me.getSearchTextInput().setValue('');
				me.getStatusFilter().setValue( '' );
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
				//me.getSearchTextInput().setValue('');
				var profileName = null, statusVal = null, jsonArray = [];
				var sellerVal = null,taxRateCodeVal=null;
				var taxRateCodeFltId = me.getTaxRateCode();
						if (!Ext.isEmpty(taxRateCodeFltId)
								&& !Ext.isEmpty(taxRateCodeFltId.getValue())) {
							taxRateCodeVal = taxRateCodeFltId.getValue();
						}
						if (!Ext.isEmpty(taxRateCodeVal)) {
							jsonArray.push({
								paramName : 'taxRateCode',
								paramValue1 : taxRateCodeVal,
								operatorValue : 'lk',
								dataType : 'S'
							});
						}

				var sellerFltId = me.getSellerCombo();
				if( !Ext.isEmpty( sellerFltId ) && !Ext.isEmpty( sellerFltId.getValue() )
					&& "ALL" != sellerFltId.getValue() )
				{
					sellerVal = sellerFltId.getValue();
				}
				
				if( !Ext.isEmpty( me.getStatusFilter() ) && !Ext.isEmpty( me.getStatusFilter().getValue() )
					&& "ALL" != me.getStatusFilter().getValue() )
				{
					statusVal = me.getStatusFilter().getValue();

					var strInFlag = false;
					if( statusVal == 12 || statusVal == 3 )
					{
						if( statusVal == 12 ) // Submitted
						{
							statusVal = new Array( 0, 1 );
							jsonArray.push(
							{
								paramName : 'isSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							} );
							strInFlag = true;
						}
						else
						// Valid/Authorized
						{
							jsonArray.push(
							{
								paramName : 'validFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							} );
						}
					}
					else if( statusVal == 11 ) // Disabled
					{
						statusVal = 3;
						jsonArray.push(
						{
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						} );
					}
					else if( statusVal == 0 || statusVal == 1 ) // New and Modified
					{
						jsonArray.push(
						{
							paramName : 'isSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						} );
					}
					if( strInFlag ) // Used for Submitted & Rejected status
					{
						jsonArray.push(
						{
							paramName : me.getStatusFilter().filterParamName,
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
						} );
					}
					else
					{
						jsonArray.push(
						{
							paramName : me.getStatusFilter().filterParamName,
							paramValue1 : statusVal,
							operatorValue : 'eq',
							dataType : 'S'
						} );
					}
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
					grid.setLoading(true);
					grid.loadGridData( strUrl, me.handleAfterGridDataLoad, null );
				}
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var taxRateMstSummaryGrid = me.getTaxRateMstGrid();
				var objConfigMap = me.getTaxRateMstSummaryGridConfiguration();
				var arrCols = new Array();
				if( !Ext.isEmpty( taxRateMstSummaryGrid ) )
					taxRateMstSummaryGrid.destroy( true );

				arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel );

			},
			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var taxRateMstSummaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : _GridSizeMaster,
					stateful : false,
					showEmptyRow : false,
					padding : '5 0 0 0',
					rowList : _AvailableGridSize,
					minHeight : 0,
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

				var taxRateMstSummaryDtlView = me.getTaxRateMstSummaryDtlView();
				taxRateMstSummaryDtlView.add( taxRateMstSummaryGrid );
				taxRateMstSummaryDtlView.doLayout();
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
					    //taxRateDescription,history,identifier all are the grid column names.
						me.showHistory( record.get( 'taxRateDescription' ), record.get( 'history' ).__deferred.uri, record
							.get( 'identifier' ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					me.submitExtForm( 'viewTaxRateMst.srvc', record, rowIndex );
				}
				else if( actionName === 'btnEdit' )
				{
					me.submitExtForm( 'editTaxRateMst.srvc', record, rowIndex );
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
			showHistory : function( taxRateDescription,url, id )
			{
				Ext.create( 'GCP.view.HistoryPopup',
				{
					productName : taxRateDescription,
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					identifier : id
				} ).show();
			},
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 10;
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
				else if( maskPosition === 8 && retValue) // 0 means not done any special edit. Can allow normal edit.
				{
					if( specialEditStatus == 0  ) // Allow Edit
					{
						retValue = true; 	
					}
					else // Dont Allow Edit 
					{
						retValue = false; 
					}					
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
					colType : 'action',
					colId : 'action',
					width : 98,
					locked : true,
					items :
					[						
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Edit' ),
							maskPosition : 8
						},
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 7
						},
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
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
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},
			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'taxRateMst/{0}.srvc', strAction );
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
							Ext.Msg.alert(getLabel('instrumentErrorPopUpTitle',"Error"), getLabel('rejectRestrictionError','Reject remark should be less than 255 characters'));
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
			getTaxRateMstSummaryGridConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				objWidthMap =
				{
				    "taxRateCode" :200,
					"taxRateDescription" : 200,
					//"sellerId" : 150,
					"taxRateType" : 200,
					"taxRate" : 200,
					"requestStateDesc" : 200
				};

				arrColsPref =
				[
                     {
	                     "colId" : "taxRateCode",
	                     "colDesc" : getLabel("lbl.taxRateMst.taxRateCode","Tax Rate Code")
                     },
                     {
	                     "colId" : "taxRateDescription",
	                     "colDesc" : getLabel("prfMstDescription","Description")
                    },
					//{
					//	"colId" : "sellerId",
					//	"colDesc" : "FI"
					//},
					{
						"colId" : "taxRateType",
	                     "colDesc" : getLabel("lbl.taxRateMst.taxRateType","Tax Rate Type")
					},
					{
						"colId" : "taxRate",
	                     "colDesc" : getLabel("lbl.taxRateMst.taxRate","Tax Rate(%)"),
	                     "colType" :"number"
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : getLabel("status","Status")
					}
				];

				storeModel =
				{
					fields :
					[
						'taxRateCode','taxRateDescription','sellerId','taxRateType', 'taxRate', 'requestStateDesc', 
						 'identifier', 'history', '__metadata', 'viewState',
						'sellerAppDate','specialEditStatus','specialEditRemarks'				
					],
					proxyUrl : 'taxRateMst.srvc',
					//take rootNode from TaxRateMstSerializer
					rootNode : 'd.taxRateList',
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
			handleTaxRateMstEntryAction : function( entryType )
			{
				var me = this;
				var form;
				var strUrl = 'addTaxRateEntry.srvc';
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
								var seller = '';
								var profileName = '';
								var status = '';
                                var taxRateCode='';
								var sellerFltId = me.getSellerCombo();
								if( !Ext.isEmpty( sellerFltId ) && !Ext.isEmpty( sellerFltId.getValue() ) )
								{
									seller = sellerFltId.getValue();
								}
								else
								{
									seller = getLabel( 'all', 'ALL' );
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
								var taxRateCodeFltId = me.getTaxRateCode();
								if (!Ext.isEmpty(taxRateCodeFltId)
										&& !Ext.isEmpty(taxRateCodeFltId
												.getValue())) {
									taxRateCode = taxRateCodeFltId.getValue();
								} else {
									taxRateCode = getLabel('none', 'None');
								}

								tip.update( getLabel( "seller", "Seller" ) + ' : ' + seller + '<br/>'
									+ getLabel( 'status', 'Status' ) + ' : ' + status   +'<br/>' + getLabel("lbl.taxRateMst.taxRateCode","Tax Rate Code")+ ':' + taxRateCode);

							}
						}
					} );
			}

	});