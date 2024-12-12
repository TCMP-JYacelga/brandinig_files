Ext
	.define(
		'GCP.controller.BalanceAdjustmentSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.BalanceAdjustmentSummaryGridView' , 'Ext.ux.gcp.DateHandler'
			],
			views :
			[
				'GCP.view.BalanceAdjustmentSummaryView'
			],
			refs :
			[
				{
					ref : 'balanceAdjustmentSummaryViewRef',
					selector : 'balanceAdjustmentSummaryViewType'
				},
				{
					ref : 'balanceAdjustmentSummaryGridViewRef',
					selector : 'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryGridViewType'
				},
				{
					ref : 'balanceAdjustmentSummaryDtlViewRef',
					selector : 'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryGridViewType panel[itemId="balanceAdjustmentDtlViewItemId"]'
				},
				{
					ref : 'balanceAdjustmentSummaryGridRef',
					selector : 'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryGridViewType balanceAdjustmentSummaryGroupActionViewType'
				},
				{
					ref : 'balanceAdjustmentSummaryFilterViewRef',
					selector : 'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryFilterViewType'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryFilterViewType button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'strStructureTypeValueLabel',
					selector : 'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryFilterViewType label[itemId="strStructureTypeValue"]'
				},
				{
					ref : 'strStructureSubtypeValueLabel',
					selector : 'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryFilterViewType label[itemId="strStructureSubtypeValue"]'
				},
				{
					ref : 'structureSubtypeRef',
					selector : 'balanceAdjustmentSummaryFilterViewType combobox[itemId="structureSubtypeId"]'
				},
				{
					ref : 'changeDate',
					selector : 'balanceAdjustmentSummaryFilterViewType datefield[itemId="changeDate"]'
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
				changeDateFilterVal : 'all',
				statusType : 'all',
				filterData : [],
				filterApplied : 'ALL',
				urlGridPref : 'userpreferences/balanceAdjustmentSummary/gridView.srvc?',
				urlGridFilterPref : 'userpreferences/balanceAdjustmentSummary/gridViewFilter.srvc?',
				commonPrefUrl : 'services/userpreferences/balanceAdjustmentSummary.json'
			},
			init : function()
			{
				var me = this;
				
				var btnClearPref = me.getBtnClearPreferences();
				if( btnClearPref )
				{
					btnClearPref.setEnabled( false );
				}
				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				me.updateFilterConfig();
				me.control(
				{
					'balanceAdjustmentSummaryViewType' :
					{
						render : function( panel )
						{
						},
						performReportAction : function( btn, opts )
						{
							me.handleReportAction( btn, opts );
						}
					},
					'balanceAdjustmentSummaryViewType button[itemId="createNewItemId"]' :
					{
						addNewBalanceAdjustmentEvent : function()
						{
							addNewBalanceAdjustment();
						}
					},
					'balanceAdjustmentSummaryGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},
					'balanceAdjustmentSummaryGridViewType smartgrid' :
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
					'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryGridViewType toolbar[itemId=groupActionBarItemId]' :
					{
						performGroupAction : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					},
					'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryFilterViewType' :
					{
						render : function( panel, opts )
						{
							me.changeDateFilterVal  = Ext.util.Format.date( me.getChangeDate().getValue(), 'Y-m-d' );
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
						filterStatusType : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( true );
							me.handleStatusTypeFilter( btn );
						},
						filterChangeDate : function(oldValue,newValue)
						{
							 me.changeDateFilterVal = Ext.util.Format.date( me.getChangeDate().getValue(), 'Y-m-d' );
						}
					},
					'balanceAdjustmentSummaryFilterViewType combo[itemId="entitledSellerIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getBalanceAdjustmentSummaryFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientIdItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/balanceAdjustmentClientIdSeek.json';
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
					'balanceAdjustmentSummaryFilterViewType AutoCompleter[itemId="clientIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getBalanceAdjustmentSummaryFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/balanceAdjustmentAgreementIdSeek.json';
							objAutocompleter.setValue( '' );
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : record[ 0 ].data.CODE
								}
							];
							me.clientFilterDesc = record[ 0 ].data.DESCRIPTION;
							me.handleClientFilter( record[ 0 ].data.CODE );
						},
						change : function( combo, record, index )
						{
							if(combo.value == ''|| combo.value == null) {
								me.handleClientFilter('all');
								var objFilterPanel = me.getBalanceAdjustmentSummaryFilterViewRef();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="agreementItemId"]' );
								objAutocompleter.cfgUrl = 'services/userseek/balanceAdjustmentAgreementIdSeek.json';
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$filtercode1',
										value : '%'
									}
								];
							}
						}
					},
					'balanceAdjustmentSummaryFilterViewType AutoCompleter[itemId="agreementItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.handleAgreementCodeFilter( record[ 0 ].data.CODE );
						},
						change : function( combo, record, index )
						{
							if(combo.value == ''|| combo.value == null) {
								me.handleAgreementCodeFilter('all');
							}
						}
					},
					'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryFilterViewType button[itemId="btnSavePreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleSavePreferences();
						}
					},
					'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryFilterViewType button[itemId="btnClearPreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleClearPreferences();
						}
					},					
					'balanceAdjustmentSummaryViewType balanceAdjustmentSummaryFilterViewType button[itemId="btnFilter"]' : {
						click : function(btn, opts) {
							me.callHandleLoadGridData();
						}
					}
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
				if( me.agreementFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'agreementCode',
						paramValue1 : encodeURIComponent(me.agreementFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( me.changeDateFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'changeDate',
						paramValue1 : encodeURIComponent(me.changeDateFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'D'
					} );
				}
				if( me.statusType != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'statusFilter',
						paramValue1 : me.statusType,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				return jsonArray;
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var balanceAdjustmentSummary = me.getBalanceAdjustmentSummaryGridRef();
				var objConfigMap = me.getBalanceAdjustmentSummaryConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( balanceAdjustmentSummary ) )
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
				balanceAdjustmentSummary = Ext.create( 'Ext.ux.gcp.SmartGrid',
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
					handleRowMoreMenuItemClick : function( menu, event )
					{
						var dataParams = menu.ownerCt.dataParams;
						me.handleRowIconClick( dataParams.view, dataParams.rowIndex, dataParams.columnIndex, this,
							event, dataParams.record );
					},
					handleMoreMenuItemClick : function( grid, rowIndex, cellIndex,menu, event, record )
					{
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view,dataParams.rowIndex,dataParams.columnIndex,menu, null,dataParams.record);
					}
				} );
				var balanceAdjustmentDtlView = me.getBalanceAdjustmentSummaryDtlViewRef();
				balanceAdjustmentDtlView.add( balanceAdjustmentSummary );
				balanceAdjustmentDtlView.doLayout();
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'submit' || actionName === 'discard' )
					me.handleGroupActions( btn, record );
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ), record.get('clientDesc') );
					}
				}
				else if( actionName === 'btnEdit' )
				{
					editNotionalSpecialEditTxn(record.get('changeId'));
				}
				else if( actionName === 'btnView' )
				{
					viewBalanceAdjustment(record.get('changeId'));
				}
			},
			showHistory : function( url, id, clName )
			{
				Ext.create( 'GCP.view.BalanceAdjustmentSummaryHistory',
				{
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					identifier : id,
					clientDesc : clName
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
				strExtension = arrExtension[ actionName ];
				strUrl = 'services/balanceAdjustmentSummary/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.getFilterUrl();
				strUrl += strQuickFilterUrl;
				var grid = me.getBalanceAdjustmentSummaryGridRef();
				viscols = grid.getAllVisibleColumns();
				for( var j = 0 ; j < viscols.length ; j++ )
				{
					col = viscols[ j ];
					if( col.dataIndex && arrReportSortColumn[ col.dataIndex ] )
					{
						if( colMap[ arrReportSortColumn[ col.dataIndex ] ] )
						{
							// ; do nothing
						}
						else
						{
							colMap[ arrReportSortColumn[ col.dataIndex ] ] = 1;
							colArray.push( arrReportSortColumn[ col.dataIndex ] );
						}
					}
				}
				if( colMap != null )
				{
					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
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
			getBalanceAdjustmentSummaryConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				objWidthMap =
				{
					"changeId" : '10%',
					"agreementCode" : '10%',
					"agreementName" : '20%',
					"clientDesc" : '20%',
					"effectiveFromDate" : '10%',
					"effectiveToDate" : '10%',
					"updateDateTime" : '10%',
					"requestStateDesc" : '9.7%'
				};
				arrColsPref =
				[
					{
						"colId" : "changeId",
						"colDesc" : getLabel( 'changeId', 'Change Id' )
					},
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
						"colId" : "effectiveFromDate",
						"colDesc" : getLabel( 'effectiveFrom', 'From' )
					},
					{
						"colId" : "effectiveToDate",
						"colDesc" : getLabel( 'effectiveTo', 'To' )
					},
					{
						"colId" : "updateDateTime",
						"colDesc" : getLabel( 'changeDate', 'Change Date' )
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
						'changeId','agreementCode', 'agreementName', 'clientDesc', 'sellerDesc', 'effectiveFromDate', 'effectiveToDate',
						'updateDateTime', 'requestStateDesc','__metadata','changeId','identifier','history'
					],
					proxyUrl : 'getBalanceAdjustmentList.srvc',
					rootNode : 'd.balanceAdjustmentList',
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
			handleStatusTypeFilter : function( btn )
			{
				var me = this;
				me.statusType = btn.value;
			},
			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getBalanceAdjustmentSummaryGridRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
				me.enableDisableGroupActions( '000000');
				grid.setLoading(true);
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
				var buttonMask = '0000000';
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
				actionMask = doAndOperation( maskArray, 7 );
				me.enableDisableGroupActions( actionMask, isSameUser );
			},
			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'balanceAdjustmentSummary/{0}.srvc?', strAction );
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
				var msgbox= Ext.Msg.show(
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
						if( btn == 'ok' )
						{
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel( 'filterPopupTitle', 'Reject Remark' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remark field can not be blank' ));
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
				var grid = this.getBalanceAdjustmentSummaryGridRef();
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
							me.enableDisableGroupActions( '000000', true );
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
				var maskSize = 7;
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
				else if( maskPosition === 6 && retValue )
				{
					retValue = retValue && !isSameUser;
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
							else if( item.maskPosition === 6 && blnEnabled )
							{
								blnEnabled = blnEnabled && !isSameUser;
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
				} else	if(colId == 'col_changeId')
				{
					strRetValue = '<a href="#" style="color:blue" onclick="javascript:viewBalanceAdjustment(\''+ value +'\');">'+ value + '</a>'
				}
				else
				{
					strRetValue = value;
				}
				return strRetValue;
			},
			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'actioncontent',
					visibleRowActionCount : 2,
					width : 90,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					resizable : false,
					draggable : false,
					items :
					[
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Edit Record' ),
							maskPosition : 4
						},
						{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 7
					    },
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							itemLabel : getLabel( 'historyToolTip', 'View History' ),
							maskPosition : 5
						}
					]
				};
				return objActionCol;
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
							text : getLabel('prfMstActionSubmit',
							'Submit'),
							itemId : 'submit',
							actionName : 'submit',
							maskPosition : 1
						},
						{
							text : getLabel('prfMstActionApprove',
							'Approve'),
							itemId : 'accept',
							actionName : 'accept',
							maskPosition : 2
						},
						{
								text : getLabel('prfMstActionReject',
								'Reject'),
								itemId : 'reject',
								actionName : 'reject',
								maskPosition : 3
							},							
							{
								text : getLabel('prfMstActionDiscard',
								'Discard'),
								itemId : 'discard',
								actionName : 'discard',
								maskPosition : 6
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
						beforeshow : function( tip )
						{
							var sellerFilter = me.sellerFilterVal;
							var clientFilter = me.clientFilterDesc == 'all' || Ext.isEmpty(me.clientFilterDesc) ? getLabel( 'none', 'None' ) : me.clientFilterDesc;
							var agreementFilter = me.agreementFilterVal == 'all' || Ext.isEmpty(me.agreementFilterVal) ? getLabel( 'none', 'None' ) : me.agreementFilterVal;
							var changeDateFilter = me.changeDateFilterVal;
							var statusFilter = me.statusType
							var objStatusLbl =
							{
								'3N' : getLabel( 'lblAuthorized', 'Approved' ),
								'7N' : getLabel( 'lblRejected', 'Rejected' ),
								'0N' : getLabel( 'lblNew', 'New' ),
								'0Y' : getLabel( 'lblSubmitted', 'Submitted' ),
								'all':'All'
							};
							if(multipleSellersAvailable)
							{
								tip.update( getLabel( 'lbl.notionalMst.seller', 'Financial Institution' ) + ' : ' + sellerFilter + '<br/>'
								+ getLabel( 'grid.column.company', 'Company Name' ) + ':' + clientFilter + '<br/>'
								+ getLabel( 'agreementCode', 'Agreement Code' ) + ':' + agreementFilter + '<br/>'
								+ getLabel( 'changeDate', 'Change Date' ) + ':' + changeDateFilter + '<br/>'
								+ getLabel( 'status', 'Status' ) + ':' + objStatusLbl[statusFilter] );
							}
							else
							{
								tip.update( getLabel( 'grid.column.company', 'Company Name' ) + ':' + clientFilter + '<br/>'
								+ getLabel( 'agreementCode', 'Agreement Code' ) + ':' + agreementFilter + '<br/>'
								+ getLabel( 'changeDate', 'Change Date' ) + ':' + changeDateFilter + '<br/>'
								+ getLabel( 'status', 'Status' ) + ':' + objStatusLbl[statusFilter] );
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
				var grid = me.getBalanceAdjustmentSummaryGridRef();
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
				objQuickFilterPref.changeDate = me.changeDateFilterVal;
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
				var grid = me.getBalanceAdjustmentSummaryGridRef();
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
				if( !Ext.isEmpty( objDefaultGridViewPref ) )
				{
					var data = Ext.decode( objDefaultGridViewPref );
					me.sellerFilterVal = data.quickFilter.sellerId;
					me.clientFilterVal = data.quickFilter.clientId;
					me.agreementFilterVal = data.quickFilter.agreementCode
					me.changeDateFilterVal = data.quickFilter.changeDate
					me.statusType = data.quickFilter.status
				}
				me.filterData = me.getQuickFilterQueryJson();
			}
		} );
