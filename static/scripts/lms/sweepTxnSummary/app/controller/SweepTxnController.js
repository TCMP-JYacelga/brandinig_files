Ext
	.define(
		'GCP.controller.SweepTxnController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.SweepTxnGridView' , 'Ext.ux.gcp.DateHandler'
			],
			views :
			[
				'GCP.view.SweepTxnView'
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
				},
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
				}
			],
			config :
			{
				savePrefAdvFilterCode : null,
				filterCodeValue : null,
				sellerFilterVal : strSellerId,
				clientFilterVal : 'all',
				clientFilterDesc : 'all',
				agreementFilterVal : 'all',
				transactionType : 'all',
				filterData : [],
				filterApplied : 'ALL',
				urlGridPref : 'userpreferences/sweepTxn/gridView.srvc?',
				urlGridFilterPref : 'userpreferences/sweepTxn/gridViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/sweepTxn.json'
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
				me.control(
				{
					'sweepTxnViewType' :
					{
						render : function( panel )
						{
						}
					},
					'sweepTxnGridViewType' :
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
							me.handleSellerFilter( combo.getValue() );
							me.callHandleLoadGridData();
							
						}
					},
					'sweepTxnFilterViewType combo[itemId="clientCodeId"]' :
					{
						
						change : function( combo, record, index )
						{
							//TODO
							if(combo.value == ''|| combo.value == null) {
								
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
							}
						},
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getSweepTxnFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/{0}.json';
							objAutocompleter.cfgSeekId = 'sweepTxnIdSeek';
							objAutocompleter.setValue( '' );
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
							me.clientFilterDesc = combo.getDisplayValue();
							me.handleClientFilter( combo.getValue() );
							me.callHandleLoadGridData();
						}
					},
					'sweepTxnFilterViewType AutoCompleter[itemId="clientIdItemId"]' :
					{
						change : function( combo, record, index )
						{
							//TODO
							if(combo.value == ''|| combo.value == null) {
								
								
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
							me.callHandleLoadGridData();
						}
					},
					'sweepTxnFilterViewType AutoCompleter[itemId="agreementItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.handleAgreementCodeFilter( record[ 0 ].data.CODE );
							me.callHandleLoadGridData();
						},					
						change : function( combo, record, index )
						{
							//TODO
							if(combo.value == ''|| combo.value == null) {	
								me.handleAgreementCodeFilter('all');
								me.callHandleLoadGridData();
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
					}
					/*'sweepTxnViewType sweepTxnFilterViewType button[itemId="btnFilter"]' : {
						click : function(btn, opts) {
							me.callHandleLoadGridData();
						}
					}*/
				} );
			},
			setDataForFilter : function()
			{
				var me = this;
				if( this.filterApplied === 'Q' || this.filterApplied === 'ALL' )
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
					jsonArray.push(
					{
						paramName : 'sellerCode',
						paramValue1 : me.sellerFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.clientFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'clientCode',
						paramValue1 : me.clientFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.agreementFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'agreementCode',
						paramValue1 : me.agreementFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.transactionType != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'transactionType',
						paramValue1 : me.transactionType,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( entity_type != '' )
				{
					jsonArray.push(
					{
						paramName : 'entityType',
						paramValue1 : entity_type,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
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
				Ext.create( 'GCP.view.SweepTxnHistory',
				{
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
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
			handleSellerFilter : function( selectedValue )
			{
				var me = this;
				me.sellerFilterVal = selectedValue;
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
			},
			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getSweepTxnGridRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
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

				if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
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
				var grid = this.getSweepTxnGridRef();
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
			}
		} );
