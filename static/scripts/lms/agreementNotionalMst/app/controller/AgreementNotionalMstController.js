Ext
	.define(
		'GCP.controller.AgreementNotionalMstController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.AgreementNotionalMstGridView'
			],
			views :
			[
				'GCP.view.AgreementNotionalMstView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'agreementNotionalViewRef',
					selector : 'agreementNotionalViewType'
				},
				{
					ref : 'agreementNotionalGridViewRef',
					selector : 'agreementNotionalViewType agreementNotionalGridViewType'
				},
				{
					ref : 'agreementNotionalDtlViewRef',
					selector : 'agreementNotionalViewType agreementNotionalGridViewType panel[itemId="agreementNotionalDtlViewItemId"]'
				},
				{
					ref : 'agreementNotionalGridRef',
					selector : 'agreementNotionalViewType agreementNotionalGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'agreementNotionalViewType agreementNotionalGridViewType agreementNotionalGroupActionViewType'
				},
				{
					ref : 'agreementNotionalFilterViewRef',
					selector : 'agreementNotionalViewType agreementNotionalFilterViewType'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'agreementNotionalViewType agreementNotionalFilterViewType button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'agreementNotionalViewType agreementNotionalFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'strStructureTypeValueLabel',
					selector : 'agreementNotionalViewType agreementNotionalFilterViewType label[itemId="strStructureTypeValue"]'
				},
				{
					ref : 'strStructureSubtypeValueLabel',
					selector : 'agreementNotionalViewType agreementNotionalFilterViewType label[itemId="strStructureSubtypeValue"]'
				},
				{
					ref : 'structureSubTypeRef',
					selector : 'agreementNotionalFilterViewType combobox[itemId="structureSubtypeId"]'
				},								
				{
					ref : 'withHeaderCheckbox',
					selector : 'agreementNotionalViewType  menuitem[itemId="withHeaderId"]'
				}
			],
			config :
			{
				savePrefAdvFilterCode : null,
				filterCodeValue : null,
				sellerFilterVal : strSellerId,
				clientFilterVal : 'all',
				clientFilterDesc : 'all',
				agreementCodeFilterVal : 'all',
				structureType : 'all',
				structureSubType : 'all',
				statusType : 'all',
				filterData : [],
				filterApplied : 'All',
				urlGridPref : 'userpreferences/agreementNotionalMst/gridView.srvc?',
				urlGridFilterPref : 'userpreferences/agreementNotionalMst/gridViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/agreementNotionalMst.json'
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
				var emptyStore;
				combinationList = Ext.create( 'Ext.data.Store',
				{
					fields :
					[
						'key', 'value'
					],
					data :
					[
					]
				} );
				
				var tbarSubTotal = null;
				var btnClearPref = me.getBtnClearPreferences();
				if( btnClearPref )
				{
					btnClearPref.setEnabled( false );
				}

				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				me.updateFilterConfig();
				me.control(
				{
					'agreementNotionalViewType' :
					{
						render : function( panel )
						{
						},
						performReportAction : function( btn, opts )
						{
							me.handleReportAction( btn, opts );
						}
					},
					'agreementNotionalViewType button[itemId="createNewItemId"]' :
					{
						addNewAgreementEvent : function()
						{
							showAddNewAgreement();
						}
					},
					'agreementNotionalGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},
					'agreementNotionalGridViewType smartgrid' :
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
					'agreementNotionalViewType agreementNotionalGridViewType toolbar[itemId=groupActionBarItemId]' :
					{
						performGroupAction : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					},
					'agreementNotionalViewType agreementNotionalFilterViewType' :
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
						filterStructureType : function( combo, record, index )
						{
							me.toggleSavePrefrenceAction( true );
							me.handleStructureTypeFilter(  record );
						},
						filterStructureSubtype : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( true );
							me.handleStructureSubTypeFilter( btn );
						},
						filterStatusType : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( true );
							me.handleStatusTypeFilter( btn );
						}
					},
					'agreementNotionalFilterViewType combo[itemId="entitledSellerIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getAgreementNotionalFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientIdItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/notionalClientIdSeek.json';
							objAutocompleter.setValue( '' );
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : combo.getValue()
								}
							];
							me.handleSellerFilter( combo.getValue() );
						}
					},
					'agreementNotionalFilterViewType AutoCompleter[itemId="clientIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.clientFilterDesc = record[ 0 ].data.DESCRIPTION ;
							me.handleClientFilter( record[ 0 ].data.CODE );
							me.resetAgreementCodeFilter("notionalMstAgreementCodeFilterSeek", record[0].data.CODE );
						},
						change : function( combo, record, index )
						{
							if(combo.value == ''|| combo.value == null) {
								me.clientFilterDesc = combo.value ;
								me.handleClientFilter( 'all' );
								me.resetAgreementCodeFilter("notionalMstAgreementCodeFilterSeekAll", 'all' );
								me.resetStructureTypeFilter();
								me.resetStructureSubTypeFilter();
							}
						}
					},
					'agreementNotionalFilterViewType AutoCompleter[itemId="agreementCodeItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.handleAgreementCodeFilter( record[ 0 ].data.CODE );
						},
						change : function(combo , record,index) 
						{
						if(combo.value == ''|| combo.value == null) {
							me.handleAgreementCodeFilter( 'all' );
							me.resetStructureTypeFilter();
							me.resetStructureSubTypeFilter();
							}
						}
					},
					'agreementNotionalViewType agreementNotionalFilterViewType button[itemId="btnSavePreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleSavePreferences();
						}
					},
					'agreementNotionalViewType agreementNotionalFilterViewType button[itemId="btnClearPreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleClearPreferences();
						}
					},					
					'agreementNotionalViewType agreementNotionalFilterViewType button[itemId="btnFilter"]' : {
						click : function(btn, opts) {
							me.callHandleLoadGridData();
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
				var isPending = true;
				if( me.sellerFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'sellerCode',
						paramValue1 : encodeURIComponent(me.sellerFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.clientFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'clientCode',
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.agreementCodeFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'agreementCode',
						paramValue1 : encodeURIComponent(me.agreementCodeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.structureType != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'structureType',
						paramValue1 : encodeURIComponent(me.structureType.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.structureSubType != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'structureSubType',
						paramValue1 : encodeURIComponent(me.structureSubType.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				
				if( !Ext.isEmpty( me.statusType ) && 'ALL' != me.statusType.toUpperCase() )				
				{
					if (me.statusType == '13NY')
					{
						isPending = false;
							me.statusType  = new Array('5YY','4NY','0NY','1YY');
				             isPending = false;
				             jsonArray.push({
					 			paramName : 'statusFilter',
								paramValue1 : me.statusType,
								operatorValue : 'in',
								dataType : 'S'
												} );
				              jsonArray.push({
								paramName : 'user',
								paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'ne',
								dataType : 'S'
					});
					
				}		
				if(isPending)
				{
					if (me.statusType == '0NY'
							|| me.statusType == '1YY') {
						me.statusType = (me.statusType == '0NY')? '0NY': '1YY';
						jsonArray.push({
							paramName : 'statusFilter',
							paramValue1 : me.statusType,
							operatorValue : 'eq',
							dataType : 'S'
						});
					} else if (me.statusType == '6NN'
							|| me.statusType == '6YY') {
						jsonArray.push({
							paramName : 'statusFilter',
							paramValue1 : new Array('6NN', '6YY'),
							operatorValue : 'in',
							dataType : 'S'
						});
					} else {
						jsonArray.push({
							paramName : 'statusFilter',
							paramValue1 : me.statusType,
							operatorValue : 'eq',
							dataType : 'S'
						});
					}
				 }
				}
					
				return jsonArray;
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var agreementNotionalGrid = me.getAgreementNotionalGridRef();
				var objConfigMap = me.getAgreementNotionalNewConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( agreementNotionalGrid ) )
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
				var alertSummaryGrid = null;
				
				agreementNotionalGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : _GridSizeMaster,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,					
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					padding : '0 10 10 10',
					rowList : _AvailableGridSize,
					minHeight : 0,
					width : '100%',
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},
					handleMoreMenuItemClick : function( grid, rowIndex, cellIndex,menu, event, record )
					{
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view,dataParams.rowIndex,dataParams.columnIndex,menu, null,dataParams.record);
					}
				} );


				var agreementNotionalDtlView = me.getAgreementNotionalDtlViewRef();
				agreementNotionalDtlView.add( agreementNotionalGrid );
				agreementNotionalDtlView.doLayout();
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'enable' || actionName === 'disable' || actionName === 'submit' )
					me.handleGroupActions( btn, record );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory(record.get('agreementName'), record.get( 'history' ).__deferred.uri, record.get( 'identifier' ) );
					}
				}
				else if( actionName === 'btnView' )
				{
					me.submitForm( 'viewAgreementNotionalMaster.srvc', record, rowIndex );
				}
				else if( actionName === 'btnEdit' )
				{
					me.submitForm( 'editAgreementNotionalMaster.srvc', record, rowIndex );
				}
				else if( actionName === 'btnSpecialEdit' )
				{
					showSpecialEditPopup( record );
				}
				else if( actionName === 'btnTreeView' )
				{
					showAgreementNotionalTree( 'viewAgreementNotionalTree.srvc', record, rowIndex );
					//showTreeView( 'viewAgreementNotionalTree.srvc', record );
				}
			},
			submitForm : function( strUrl, record, rowIndex )
			{
				var form;
				var viewState = record.get( 'viewState' );

				strUrl = strUrl + "?$viewState=" + viewState + "&" + csrfTokenName + "="
					+ csrfTokenValue;
				form = document.createElement( 'FORM' );
				form.setAttribute('method',"post");
				form.setAttribute('action',strUrl);
				form.setAttribute('name',"frmMain");
				form.setAttribute('id',"frmMain");
				document.body.appendChild(form);
				form.submit();
			},
			showHistory : function( product,url, id )
			{
				Ext.create( 'GCP.view.AgreementNotionalMstHistoryView',
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
			getAgreementNotionalNewConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"agreementCode" : '15%',
					"agreementName" : '15%',
					"clientDesc" : '20%',
					"structureType" : '10%',
					"structureSubTypeDesc" : '10%',
					"editEffectDate" : '15%',
					"requestStateDesc" : '14.6%'
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
						"colDesc" : getLabel( 'lbl.notionalMst.companyName', 'Company Name' )
					},
					{
						"colId" : "structureType",
						"colDesc" : getLabel( 'structureType', 'Structure Type' )
					},
					{
						"colId" : "structureSubTypeDesc",
						"colDesc" : getLabel( 'structureSubtype', 'Structure Subtype' )
					},
					{
						"colId" : "editEffectDate",
						"colDesc" : getLabel( 'effectiveFrom', 'Effective From' )
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : getLabel( 'status', 'Status' )
					}
				];

				storeModel =
				{
					fields :
					[
						'agreementCode', 'agreementName', 'clientDesc', 'structureType', 'structureSubTypeDesc', 'startDate',
						'endDate', 'requestStateDesc', 'clientId', 'identifier', '__metadata', 'viewState','editEffectDate','history'
					],
					proxyUrl : 'getAgreementNotionalMstList.srvc',
					rootNode : 'd.notionalList',
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
				me.agreementCodeFilterVal = selectedValue;
			},
			handleStructureTypeFilter : function( record )
			{
				var me = this;
			    me.structureType = record[0].data.key;
				var structureSubtypeRef = me.getStructureSubTypeRef();
				var structureSubTypeStore;
				if( me.structureType == 'CB' )
				{
					structureSubTypeStore = Ext.create( 'Ext.data.Store',
					{
						fields :
						[
							'key', 'value'
						],
						data :
						[
							
							{
								'key' : 'all',
								'value' : getLabel( 'lms.notionalMst.All', 'All' )
							},
							{
								'key' : '1',
								'value' : getLabel( 'lms.notionalMst.net', 'Net' )
							},
							{
								'key' : '2',
								'value' : getLabel( 'lms.notionalMst.gross', 'Gross' )
							},
							{
								'key' : '3',
								'value' :  getLabel( 'lms.notionalMst.debitGross', 'Debit Gross' )
							},
							{
								'key' : '4',
								'value' : getLabel( 'lms.NotionalMst.creditGross', 'Credit Gross' )
							}
							
						]
					} );
				}
				else if( me.structureType == 'CP' )
				{
					structureSubTypeStore = Ext.create( 'Ext.data.Store',
						{
							fields :
							[
								'key', 'value'
							],
							data :
							[
								{
									'key' : 'all',
									'value' : getLabel( 'lms.notionalMst.All', 'All' )
								},
								{
									'key' : '1',
									'value' :  getLabel( 'lms.notionalMst.net', 'Net' )
								}
							]
						} );
				}
				else if( me.structureType == 'TE' )
				{
					structureSubTypeStore = Ext.create( 'Ext.data.Store',
						{
							fields :
							[
								'key', 'value'
							],
							data :
							[
								{
									'key' : 'all',
									'value' : getLabel( 'lms.notionalMst.All', 'All' )
								},
								{
									'key' : '1',
									'value' : getLabel( 'lms.notionalMst.net', 'Net' )
								}
							]
						} );
				}
				else if( me.structureType == 'all' )
				{
					structureSubTypeStore = Ext.create( 'Ext.data.Store',
						{
							fields :
							[
								'key', 'value'
							],
							data :
							[
								{
									'key' : 'all',
									'value' : getLabel( 'lms.notionalMst.All', 'All' )
								}
							]
						} );
				}
				
				structureSubtypeRef.bindStore(structureSubTypeStore);
				me.resetStructureSubTypeFilter();
			},
			handleStructureSubTypeFilter : function( btn )
			{
				var me = this;
				me.structureSubType = btn.value;
			},
			handleStatusTypeFilter : function( btn )
			{
				var me = this;
				me.statusType = btn.value;
			},
			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getAgreementNotionalGridRef();
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
						case 'in' :
							var arrId = filterData[index].paramValue1;
							if (0 != arrId.length) {
								strTemp = strTemp + '(';
								for (var count = 0; count < arrId.length; count++) {
									strTemp = strTemp + filterData[index].paramName
											+ ' eq ' + '\'' + arrId[count] + '\'';
									if (count != arrId.length - 1) {
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
			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '0000000000';
				var maskArray = new Array(), actionMask = '', objData = null;
				var isDisabled = null; 
				var isEnabled = null;
				var isSubmit = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				if(selectedRecords.length > 1 )
				{
					buttonMask = buttonMask.replace(buttonMask.substring(0,1),"0")
				}
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
				actionMask = doAndOperation( maskArray, 10 );
				me.enableDisableGroupActions( actionMask, isSameUser, isEnabled, isDisabled, isSubmit );
			},
			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'agreementNotionalMst/{0}.srvc?', strAction );
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
					fieldLbl = getLabel( 'rejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					titleMsg = getLabel( 'rejectRemarkPopUpFldLbl', 'Reject Remark' );
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
							Ext.Msg.alert(getLabel( 'filterPopupTitle', 'Error' ), getLabel( 'rejectMaxCharErrorMsg', 'Reject remark should be less than 255 characters' ));
							return false;
						}
						if( btn == 'ok' )
						{
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel( 'filterPopupTitle', 'Error' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remark field can not be blank' ));
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
				var grid = this.getAgreementNotionalGridRef();
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
							reason : records[ index ].data.agreementCode
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
							var cutOffFlag = false;
							for (var i in jsonRes.d.instrumentActions) {
								if (jsonRes.d.instrumentActions[i].errors) {
									for (var j in jsonRes.d.instrumentActions[i].errors) {
										errors += jsonRes.d.instrumentActions[i].errors[j].errorMessage + "<br\>";
									}
								}
								if( jsonRes.d.instrumentActions[i].serialNo == 'CUTOFF_FLAG' &&  
									jsonRes.d.instrumentActions[i].success == 'Y' )
								{
									cutOffFlag = true;
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
							else
							{
								if( cutOffFlag )
								{
									Ext.MessageBox.show(
										{
											title : getLabel( 'cutOffPopUpHeader', 'Message' ),
											msg : getLabel( 'cutOffPopUpMsg', 'Cutoff Exceeded. Changes would be effective from next working date.' ),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.INFO
										} );									
								}
							}
							me.enableDisableGroupActions( '0000000000', true );
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
				var maskSize = 10;
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
				if( ( maskPosition === 2 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 3 && retValue )
				{
					retValue = retValue && isSameUser;
				}
				else if(maskPosition === 10 && retValue)
				{
					if(record.data.structureType === 'Combination')
					{
						retValue = retValue && true;
					}
					else
					{
						retValue = retValue && false;
					}
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
			enableDisableGroupActions : function( actionMask, isSameUser, isEnabled, isDisabled, isSubmit)
			{
				var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey || strBitMapKey == 0)
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
							 else if  (item.maskPosition === 6 &&
									  blnEnabled) {
									  blnEnabled =  blnEnabled && !isSubmit;
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
				arrCols.push( me.createGroupActionColumn() );
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

						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						/*if( objCol.colId === 'invoiceNumber' )
						{
							cfgCol.width = 190;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var strRet = '';
								var grid = me.getAgreementNotionalGridRef();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										strSubTotal = data.d.__subTotal;
									}
								}
								if( null != strSubTotal && strSubTotal != ' ' )
								{
									strRet = getLabel( 'subTotal', 'Sub Total' );
								}
								return strRet;
							}
						}
						if( objCol.colId === 'paidAmount' )
						{
							cfgCol.align = 'right';
							cfgCol.width = 100;
							cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId )
							{
								var grid = me.getAgreementNotionalGridRef();
								if( !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) )
								{
									var data = grid.store.proxy.reader.jsonData;
									if( data && data.d && data.d.__subTotal )
									{
										if( data.d.__subTotal != ' ' )
											strRet = data.d.__subTotal;
									}
								}
								return strRet;
							}
						}*/
						cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;

						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				if (record.get('isEmpty')) {
					if (rowIndex === 0 && colIndex === 0) {
						meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
						return getLabel('gridNoDataMsg',
								'No records found !!!');											
					}
				} else
					return value;
			},
			createGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
                        colId : 'groupaction',
                        width : 130,
                        locked : true,
                        lockable : false,
                        sortable : false,
                        hideable : false,
                        resizable : false,
                        draggable : false,
					items :
					[
						{
							itemId : 'submit',
							text : getLabel('submit', 'Submit'),
							actionName : 'submit',
							maskPosition : 1
						},
						{
							itemId : 'accept',
							text : getLabel('approve', 'Approve'),
							actionName : 'accept',
							maskPosition : 2
						},
						{
							itemId : 'reject',
							text : getLabel('reject', 'Reject'),
							actionName : 'reject',
							maskPosition : 3
						},
						{
							itemId : 'enable',
							text : getLabel('enable', 'Enable'),
							actionName : 'enable',
							maskPosition : 4
						},
						{
							itemId : 'disable',
							text : getLabel('disable', 'Disable'),
							actionName : 'disable',
							maskPosition : 5
						},
						{
							itemId : 'discard',
							text : getLabel('discard', 'Discard'),
							actionName : 'discard',
							maskPosition : 6
						}
					]
				};
				return objActionCol;
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
							toolTip : getLabel('editToolTip',
									'Edit'),
							itemLabel : getLabel('editToolTip',
									'Edit'),
							maskPosition : 8	
						},
						/* JIRA : FTGCPBDB-5188*/
						{
							itemId : 'btnSpecialEdit',
							itemCls : 'grid-row-action-icon icon-clone',
							itemLabel : getLabel(
									'specialEditToolTip',
									'SpecialEdit'),
							maskPosition : 10
						},
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							itemLabel : getLabel('historyToolTip',
									'View History'),
							maskPosition : 9
						},
						{
							itemId : 'btnTreeView',
							itemCls : 'grid-row-action-icon icon-tree',
							itemLabel : getLabel( 'treeViewToolTip', 'Tree View' ),
							maskPosition : 7
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
                            var clientFilter = me.clientFilterDesc == 'all' || Ext.isEmpty(me.clientFilterDesc) ? getLabel( 'none', 'None' ) : me.clientFilterDesc ;
                            var agreementFilter = me.agreementCodeFilterVal == 'all' || Ext.isEmpty(me.agreementCodeFilterVal) ? getLabel( 'none', 'None' ) : me.agreementCodeFilterVal;
                            var structureTypeFilter = me.structureType;
							var structureSubtypeFilter = me.structureSubType;
							var statusFilter = me.statusType;

							var objStructureTypeLbl =
							{
								'CB' : getLabel( 'lms.notionalMst.combination', 'Combination' ),
								'CP' : getLabel( 'lms.notionalMst.compensation', 'Compensation' ),
								'TE' : getLabel( 'lms.notionalMst.tierEnhancement', 'Tier Enhancement' ),
								'all': getLabel('lms.notionalMst.All', 'All')
							};
							var objStructureSubtypeLbl =
							{
								'1' : getLabel( 'lms.notionalMst.net', 'Net' ),
								'2' : getLabel( 'lms.notionalMst.gross', 'Gross' ),
								'3' : getLabel( 'lms.notionalMst.debitGross', 'Debit Gross' ),
								'4' : getLabel( 'lms.NotionalMst.creditGross', 'Credit Gross' ),
								'5' : getLabel( 'lms.notionalMst.info', 'Info' ),
								'all':getLabel('lms.notionalMst.All', 'All')
							};
							var objStatusLbl =
							{
								'0NN' : getLabel( 'lblDraft', 'Draft' ),
								'0NY' : getLabel( 'new', 'New' ),
								'1YN' : getLabel( 'lblModifiedDraft', 'Modified Draft' ),
								'1YY' : getLabel( 'lblModified', 'Modified' ),
								'3NN' : getLabel( 'lblDisabled', 'Disabled' ),
								'3YN' : getLabel( 'lblAuthorized', 'Authorized' ),
								'4NY' : getLabel( 'lblEnableRequest', 'Enable Request' ),
								'5YY' : getLabel( 'lblDisableRequest', 'Disable Request' ),
								'6YY' : getLabel( 'lblClosed', 'Closed' ),
								'7NN' : getLabel( 'lblNewRejected', 'New Rejected' ),
								'8YN' : getLabel( 'lblModifiedReject', 'Modified Rejected' ),
								'9YN' :  getLabel( 'lblDisableReqRejected', 'Disable Request Rejected' ),
								'10NN' :  getLabel( 'lblEnableReqRejected', 'Enable Request Rejected' ),
								'6YN' :  getLabel( 'lblExpired', 'Expired' ),
								'all': getLabel('lms.notionalMst.All', 'All')
							};
                            if(multipleSellersAvailable)
                            {
                                tip.update( getLabel( 'lbl.notionalMst.seller', 'Financial Institution' ) + ' : ' + sellerFilter + '<br/>'
                                    + getLabel( 'grid.column.company', 'Company Name' ) + ':' + clientFilter + '<br/>' 
                                    + getLabel( 'lbl.notionalMst.agreement', 'Agreement' ) + ':' + agreementFilter + '<br/>'
                                    + getLabel('lms.notionalMst.structureType', 'Structure Type') + ':' + objStructureTypeLbl[structureTypeFilter] + '<br/>'
                                    + getLabel('lms.notionalMst.structureSubtype', 'Structure Subtype') + ':' + objStructureSubtypeLbl[structureSubtypeFilter] + '<br/>'
                                    + getLabel('lms.notionalMst.status', 'Status') + ':' + objStatusLbl[statusFilter] + '<br/>'
                                );
                            }
                            else
                            {
                                tip.update( getLabel( 'grid.column.company', 'Company Name' ) + ':' + clientFilter + '<br/>' 
                                        + getLabel( 'lbl.notionalMst.agreement', 'Agreement' ) + ':' + agreementFilter + '<br/>'
                                        + getLabel('lms.notionalMst.structureType', 'Structure Type') + ':' + objStructureTypeLbl[structureTypeFilter] + '<br/>'
                                        + getLabel('lms.notionalMst.structureSubtype', 'Structure Subtype') + ':' + objStructureSubtypeLbl[structureSubtypeFilter] + '<br/>'
                                        + getLabel('lms.notionalMst.status', 'Status') + ':' + objStatusLbl[statusFilter] + '<br/>'
                                    );
                            }
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
				var grid = me.getAgreementNotionalGridRef();
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
				objQuickFilterPref.agreementCode = me.agreementCodeFilterVal;
				objQuickFilterPref.structureType = me.structureType;
				objQuickFilterPref.structureSubType = me.structureSubType;
				objQuickFilterPref.status = me.status;
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
				var grid = me.getAgreementNotionalGridRef();
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
					me.agreementCodeFilterVal = data.quickFilter.agreementCode;
					me.structureType = data.quickFilter.structureType;
					me.structureSubType = data.quickFilter.structureSubType;
					me.statusType = data.quickFilter.status
				}

				me.filterData = me.getQuickFilterQueryJson();
			},
			handleReportAction : function(btn, opts) {
				var me = this;
				me.downloadReport(btn.itemId);
			},
			downloadReport : function(actionName) {
				var me = this;
				var withHeaderFlag = me.getWithHeaderCheckbox().checked;
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
				
				strExtension = arrExtension[actionName];
				strUrl = 'services/agreementNotionalMst/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue+'&$seller='+this.sellerFilterVal;
				var grid = this.getAgreementNotionalGridRef();
				
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
					if (col.dataIndex && arrReportSortColumn[col.dataIndex]) {
						if (colMap[arrReportSortColumn[col.dataIndex]]) {
						} else {
							colMap[arrReportSortColumn[col.dataIndex]] = 1;
							colArray.push(arrReportSortColumn[col.dataIndex]);
						}
					}
				}
				if (colMap != null) {

					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}

				strUrl = strUrl + strSelect;
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						csrfTokenName, csrfTokenValue));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
						currentPage));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
						withHeaderFlag));
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
				},
				resetAgreementCodeFilter : function(cfgSeekId, filtercode2 )
				{
					var me = this;
					var objFilterPanel = me.getAgreementNotionalFilterViewRef();
					var objAutocompleter = objFilterPanel.down('AutoCompleter[itemId="agreementCodeItemId"]');
					objAutocompleter.setValue('');											
					objAutocompleter.cfgSeekId = cfgSeekId;
					objAutocompleter.cfgExtraParams = [ 
					{
						key : '$filtercode1',
						value : strSellerId
					},
					{
						key : '$filtercode2',
						value : filtercode2
					}							
					];
				},
				resetStructureTypeFilter : function()
				{
					var me = this;
					var objFilterPanel = me.getAgreementNotionalFilterViewRef();				
					var objAutocompleter = objFilterPanel.down( 'combobox[itemId="structureTypeId"]' );
					objAutocompleter.setValue( 'All' );
					me.structureType = 'all';					
				},
				resetStructureSubTypeFilter : function()
				{
					var me = this;
					var objFilterPanel = me.getAgreementNotionalFilterViewRef();	
					objAutocompleter = objFilterPanel.down( 'combobox[itemId="structureSubtypeId"]' );
					objAutocompleter.setValue( 'All' );
					me.structureSubType = 'all';
				}
		} );
