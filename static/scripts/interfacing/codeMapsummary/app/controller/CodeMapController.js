Ext
	.define( 'GCP.controller.CodeMapController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler'
			],
			views :
			[
				'GCP.view.CodeMapView'
			],
			refs :
			[
				{
					ref : 'codeMapGridViewRef',
					selector : 'codeMapViewType codeMapGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'codeMapDtlViewRef',
					selector : 'codeMapViewType codeMapGridViewType panel[itemId="codeMapDtlViewItemId"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'codeMapGridViewType textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'codeMapGridViewType radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'codeMapFilterViewRef',
					selector : 'codeMapViewType codeMapFilterViewType'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'codeMapViewType codeMapGridViewType codeMapGroupActionBarViewType'
				},
				{
					ref : 'btnSavePreferencesRef',
					selector : 'codeMapViewType codeMapFilterViewType button[itemId="btnSavePreferencesItemId"]'
				}
			],
			config :
			{
				sellerFilterVal : 'all',
				clientFilterVal : 'all',
				dispatchBankFilterVal : 'all',
				filterData : [],
				urlGridPref : 'userpreferences/codeMapGridFilter/gridView.srvc?'
			},
			init : function()
			{
				var me = this;

				me.control(
				{
					'codeMapGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},
					'codeMapViewType codeMapFilterViewType' : {
						render : function() {
							me.setInfoTooltip();
						}
					},
					'codeMapGridViewType radiogroup[itemId="matchCriteria"]' :
					{
						change : function( btn, opts )
						{
							me.searchTrasactionChange();
						}
					},
					'codeMapGridViewType textfield[itemId="searchTxnTextField"]' :
					{
						change : function( btn, opts )
						{
							me.searchTrasactionChange();
						}
					},
					'codeMapViewType codeMapFilterViewType combobox[itemId="sellerIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							var objFilterPanel = me.getCodeMapFilterViewRef();
							var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientIdItemId"]' );
							objAutocompleter.cfgUrl = 'services/userseek/bankcodeMapClientIdSeek.json';
							objAutocompleter.setValue( '' );
							objAutocompleter.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : sellerValue
								}
							];
							me.handleSellerFilter( sellerValue );
							me.handleDispatchBankFilter( sellerValue );
						},
						change : function( combo, record, index )
						{
							if( record == null )
							{
								me.handleSellerFilter( "all" );
							}
						}
					},
					'codeMapViewType codeMapFilterViewType AutoCompleter[itemId="clientIdItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.handleClientFilter( record[ 0 ].data.CODE );
						},
						change : function( combo, record, index )
						{
							if( record == null )
							{
								me.handleClientFilter( "all" );
							}
						}
					},
					'codeMapGridViewType smartgrid' :
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
					'codeMapViewType codeMapGridViewType toolbar[itemId=codeMapGroupActionBarViewItemId]' :
					{
						performGroupAction : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					},
					'codeMapViewType codeMapGridViewType button[itemId="codeMapNewRequestItemId"]' :
					{
						click : function( btn, opts )
						{
							me.showCodeMapNewRequest( btn );
						}
					},
					'codeMapViewType codeMapFilterViewType button[itemId="btnSavePreferencesItemId"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleSavePreferences();
						}
					},
					'codeMapViewType codeMapFilterViewType button[itemId="btnFilter"]' : 
					{
						click : function(btn, opts) 
						{
							me.setDataForFilter();
							me.applyFilter();
						}
				    },

				} );

			},
			showCodeMapNewRequest : function()
			{
				goToPage( 'showAddNewCodeMapForm.srvc', 'frmMain' );
			},
			handleSellerFilter : function( selectedValue )
			{
				var me = this;
				me.sellerFilterVal = selectedValue;
				me.callHandleLoadGridData();
			},
			
			handleDispatchBankFilter : function( selectedValue )
			{
				var me = this;
				me.dispatchBankFilterVal = selectedValue;
				me.callHandleLoadGridData();
			},
			handleClientFilter : function( selectedValue )
			{
				var me = this;
				me.clientFilterVal = selectedValue;
				me.callHandleLoadGridData();
			},
			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getCodeMapGridViewRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},

			getFilterUrl : function()
			{
				var me = this;
				me.setDataForFilter();
				var strFilterUrl = '';
				var strUrl = '';

				strFilterUrl = me.generateUrlWithFilterParams();
				if( !Ext.isEmpty( strFilterUrl ) )
				{
					strUrl += strFilterUrl;
					isFilterApplied = true;
				}
				return strUrl;
			},
			setDataForFilter : function()
			{
				var me = this;
				this.filterData = this.getFilterQueryJson();
			},
			getFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var statusVal = '';
				var objFilterPanel = me.getCodeMapFilterViewRef();
				var statusFltId = objFilterPanel
				.down('combobox[itemId=statusFilter]');

				if( entityType == '0' )
				{
					if( isBankCodeMap == 'true' )
					{
						jsonArray.push(
						{
							paramName : 'entityType',
							paramValue1 : 'BANK',
							operatorValue : 'eq',
							dataType : 'S'
						} );
					}
					else
					{
						jsonArray.push(
						{
							paramName : 'entityType',
							paramValue1 : 'BANK,' + 'CLIENT',
							operatorValue : 'in',
							dataType : 'S'
						} );
						
					}
				}
				else
				{
					jsonArray.push(
					{
						paramName : 'entityType',
						paramValue1 : 'BANK,' + 'CLIENT',
						operatorValue : 'in',
						dataType : 'S'
					} );
				}
					if (!Ext.isEmpty(statusFltId)
							&& !Ext.isEmpty(statusFltId.getValue())
							&& "ALL" != statusFltId.getValue().toUpperCase()&& getLabel('all','ALL').toUpperCase()!= statusFltId.getValue().toUpperCase()) {
						statusVal = statusFltId.getValue();
					}

					if (!Ext.isEmpty(statusVal)) {
					var isPending = true;
					if (statusVal == 13)//Pending My Approval
						{
							statusVal  = new Array('5YY','4NY','0NY','1YY');
							isPending = false;
							jsonArray.push({
										paramName : 'statusFilter',
										paramValue1 : statusVal,
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
					if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				       if (statusVal == 12 || statusVal == 14) // 12: New Submitted,14: Modified Submitted
				          {
					           statusVal = (statusVal == 12)?0:1;
								jsonArray.push({
											paramName : 'isSubmitted',
											paramValue1 : 'Y',
											operatorValue : 'eq',
											dataType : 'S'
										});
								strInFlag = true;
							} else // Valid/Authorized
							{
								jsonArray.push({
											paramName : 'validFlag',
											paramValue1 : 'Y',
											operatorValue : 'eq',
											dataType : 'S'
										});
							}
						} else if (statusVal == 11) // Disabled
						{
							statusVal = 3;
							jsonArray.push({
										paramName : 'validFlag',
										paramValue1 : 'N',
										operatorValue : 'eq',
										dataType : 'S'
									});
						} else if (statusVal == 0 || statusVal == 1) // New
						// and
						// Modified
						{
							jsonArray.push({
										paramName : 'isSubmitted',
										paramValue1 : 'N',
										operatorValue : 'eq',
										dataType : 'S'
									});
						}
							jsonArray.push({
										paramName : statusFltId.name,
										paramValue1 : statusVal,
										operatorValue : 'eq',
										dataType : 'S'
									});
				        }			
					}

				if( me.sellerFilterVal != 'all' )
				{
					jsonArray.push(
					{
						paramName : 'sellerCode',
						paramValue1 : 'OWNER,' + me.sellerFilterVal,
						operatorValue : 'in',
						dataType : 'S'	
					} );
				}
				else
				{
					jsonArray.push(
					{
						paramName : 'sellerCode',
						paramValue1 : 'OWNER,' + sellerValue,
						operatorValue : 'in',
						dataType : 'S'
					} );
				}
				
				if( me.clientFilterVal != 'all' )
				{
					if( me.dispatchBankFilterVal != 'all' )
					{
						jsonArray.push(
						{
							paramName : 'clientCode',
							paramValue1 : 'BANK,' + me.dispatchBankFilterVal + ',' + me.clientFilterVal,
							operatorValue : 'in',
							dataType : 'S'
						} );
						
					}
					else
					{
						jsonArray.push(
						{
							paramName : 'clientCode',
							paramValue1 : 'BANK,' + dispatchBankValue + ',' + me.clientFilterVal,
							operatorValue : 'in',
							dataType : 'S'
						} );
						
					}
				}
				else
				{
					if( !Ext.isEmpty( clientValue ) )  // use when BANK as CLIENT logged in
					{
						if( me.dispatchBankFilterVal != 'all' )
						{
							jsonArray.push(
							{
								paramName : 'clientCode',
								paramValue1 : 'BANK,' + me.dispatchBankFilterVal +  ',' + clientValue ,
								operatorValue : 'in',
								dataType : 'S'
							} );
							
						}
						else
						{
							jsonArray.push(
								{
									paramName : 'clientCode',
									paramValue1 : 'BANK,' +  dispatchBankValue + ',' + clientValue ,
									operatorValue : 'in',
									dataType : 'S'
								} );
						}
					}
					else
					{
						if( me.dispatchBankFilterVal != 'all' )
						{
							jsonArray.push(
							{
								paramName : 'clientCode',
								paramValue1 : 'BANK,' + me.dispatchBankFilterVal ,
								operatorValue : 'in',
								dataType : 'S'
							} );
							
						}
						else
						{
							jsonArray.push(
								{
									paramName : 'clientCode',
									paramValue1 : 'BANK,' +  dispatchBankValue ,
									operatorValue : 'in',
									dataType : 'S'
								} );
							
						}
						
					}
					
					
					
					
						
				//	}
				}
				return jsonArray;
			},
			generateUrlWithFilterParams : function()
			{
				var me = this;
				var filterDataObj = me.filterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
				var strTemp = '';

				for( var index = 0 ; index < filterDataObj.length ; index++ )
				{
					if( isFilterApplied )
						strTemp = strTemp + ' and ';

					switch( filterDataObj[ index ].operatorValue )
					{
						case 'eq':
							strTemp = strTemp + filterDataObj[ index ].paramName + ' '
								+ filterDataObj[ index ].operatorValue + ' ' + '\''
								+ filterDataObj[ index ].paramValue1 + '\'';
							break;
							
						case 'in':
							var arrId = filterDataObj[ index ].paramValue1;
						  if(filterDataObj[index].paramName != 'requestState')
							{
							   if(filterDataObj[index].paramName != 'statusFilter' && filterDataObj[ index ].paramValue1.length != 4)
								{
									var tempArrId = arrId.split( ',' );
									if( tempArrId[ 0 ] == 'OWNER' || tempArrId[ 0 ] == 'BANK' )
									{
										arrId = arrId.split( ',' );
									}
								}
							}
							if( 0 != arrId.length )
							{
								strTemp = strTemp + '(';
								for( var count = 0 ; count < arrId.length ; count++ )
								{
									strTemp = strTemp + filterDataObj[ index ].paramName + ' eq ' + '\'' + arrId[ count ]
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
							strTemp = strTemp + filterDataObj[ index ].paramName + ' '
								+ filterDataObj[ index ].operatorValue + ' ' + '\''
								+ filterDataObj[ index ].paramValue1 + '\'';
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
			handleSmartGridConfig : function()
			{
				var me = this;
				var codeMapGrid = me.getCodeMapGridViewRef();
				var objConfigMap = me.getCodeMapGridConfig();

				if( !Ext.isEmpty( codeMapGrid ) )
					codeMapGrid.destroy( true );

				var arrColsPref = null;
				var data = null;

				if( !Ext.isEmpty( objGridViewPref ) )
				{
					data = Ext.decode( objGridViewPref );
					objPref = data[ 0 ];
					arrColsPref = objPref.gridCols;
					arrCols = me.getColumns( arrColsPref, objConfigMap );
				}
				else if( objDefaultGridViewPref )
				{
					data = objDefaultGridViewPref;
					objPref = data[ 0 ];
					arrColsPref = objPref.gridCols;
					arrCols = me.getColumns( arrColsPref, objConfigMap );
				}
				else
				{
					arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				}
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel );
			},

			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				var alertSummaryGrid = null;
				pgSize = 10;
				codeMapGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : true,
					showPager : true,
					showCheckBoxColumn : true,
					padding : '5 0 0 0',
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					maxHeight : 280,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

					handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
					},
					handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,menu, event, record) {
						var dataParams = menu.dataParams;
						me.handleRowIconClick(dataParams.view, dataParams.rowIndex,dataParams.columnIndex, menu, null, dataParams.record);

					}
				} );
				var codeMapDtlView = me.getCodeMapDtlViewRef();
				codeMapDtlView.add( codeMapGrid );
				codeMapDtlView.doLayout();
			},
			getCodeMapGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"codeMapCode" : 125,
					"codeMapDesc" : 125,
					"codeMapDefaultValue" : 125,
					"codeMapOthersValue" : 125,
					"codeMapStatus" : 125

				};

				arrColsPref =
				[
					{
						"colId" : "codeMapCode",
						"colDesc" : getLabel( 'codeMapName', 'Name' )
					},
					{
						"colId" : "codeMapDesc",
						"colDesc" : getLabel( 'codeMapDescription', 'Description' )
					},
					{
						"colId" : "codeMapDefaultValue",
						"colDesc" : getLabel( 'codeMapDefaultVal', 'Default Value' )
					},
					{
						"colId" : "codeMapOthersValue",
						"colDesc" : getLabel( 'codeMapOthersVal', 'Other Value' )
					},
					{
						"colId" : "statusDesc",
						"colDesc" : getLabel( 'codeMapStatus', 'Status' )
					}
				];

				storeModel =
				{
					fields :
					[
						'codeMapCode', 'codeMapDesc', 'codeMapDefaultValue', 'codeMapOthersValue', 'statusDesc',
						'identifier', 'history', '__metadata', 'viewState'
					],
					proxyUrl : 'getCodeMapMasterList.srvc',
					rootNode : 'd.codeMapSummary',
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
						
						if(objCol.colId == 'statusDesc')
				        {
					      cfgCol.sortable = false;
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
				strRetValue = value;
				return strRetValue;
			},
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );

				strUrl = strUrl + me.getFilterUrl();

				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'enable' || actionName === 'disable' || actionName === 'submit' )
				{
					me.handleGroupActions( btn, record );
				}
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ), record.get('codeMapCode') );
					}
				}
				else if( actionName === 'btnView' )
				{
					var me = this;
					me.submitForm( 'viewCodeMapMasterDetails.srvc', record, rowIndex );
				}
				else if( actionName === 'btnEdit' )
				{
					me.submitForm( 'editCodeMapMasterDetails.srvc', record, rowIndex );
				}
			},
			showHistory : function( url, id, codeMap)
			{
				Ext.create( 'GCP.view.CodeMapMstHistoryPopupView',
				{
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					identifier : id,
					codeMapCode : codeMap
				} ).show();
			},
			submitForm : function( strUrl, record, rowIndex )
			{
				var form;
				var viewState = record.get( 'viewState' );
				var me = this;
				strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="
					+ csrfTokenValue;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
			},
			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'getCodeMapMasterList/{0}.srvc?', strAction );
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
					fieldLbl = getLabel( 'prfRejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
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
						if( btn == 'ok' )
						{
							me.preHandleGroupActions( strActionUrl, text, record );
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
				var grid = this.getCodeMapGridViewRef();
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
							var jsonRes = Ext.JSON.decode( response.responseText );
							var errors = '';
							for( var i in jsonRes.d.instrumentActions )
							{
								if( jsonRes.d.instrumentActions[ i ].errors )
								{
									for( var j in jsonRes.d.instrumentActions[ i ].errors )
									{
										errors += jsonRes.d.instrumentActions[ i ].errors[ j ].errorMessage + "<br\>";
									}
								}
							}
							if( errors != '' )
							{
								Ext.MessageBox.show(
								{
									title : getLabel( 'lblerror', 'Error' ),
									msg : errors,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
							me.enableDisableGroupActions( '0000000000', true ); // mask size 10
							grid.refreshData();
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'codeMapErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'codeMapErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}
			},

			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '0000000000';
				var maskSize = 10;

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
					//maskArray.push( objData.raw.__metadata.__rightsMap )
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
				}

				actionMask = doAndOperation( maskArray, maskSize );
				me.enableDisableGroupActions( actionMask, isSameUser );
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
						if( strBitMapKey || strBitMapKey == 0 )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 1 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 2 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},
			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'action',
					width : 85,
					//align : 'right',
					locked : true,
					sortable : false,
					hideable : false,
					resizable : false,
					draggable : false,
					items :
					[
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							itemLabel : getLabel( 'editToolTip', 'Edit Record' ),
							toolTip : getLabel('editToolTip', 'Edit Record' ),//confirm
							maskPosition : 8
						},
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							itemLabel : getLabel( 'viewToolTip', 'View Record' ),
							toolTip :  getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 5
						},
						{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							itemLabel : getLabel( 'historyToolTip', 'View History' ),
							toolTip : getLabel( 'historyToolTip', 'View History' ),
							maskPosition : 4
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
							itemId : 'accept',
							text : getLabel( 'approve', 'Approve' ),
							maskPosition : 1
						},
						{
							itemId : 'reject',
							text : getLabel( 'actionReject', 'Reject' ),
							maskPosition : 2
						}
					],
					moreMenu :
					{
						fnMoreMenuVisibilityHandler : function( store, record, jsonData, itmId, menu )
						{
							return me.isRowMoreMenuVisible( store, record, jsonData, itmId, menu );
						},
						fnMoreMenuClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record )
						{
							me.handleRowMoreMenuClick( tableView, rowIndex, columnIndex, btn, event, record );
						},
						items :
						[
							{
								itemId : 'discard',
								itemLabel : getLabel( 'actionDiscard', 'Discard' ),
								maskPosition : 3
							},
							{
								itemId : 'enable',
								itemLabel : getLabel( 'actionEnable', 'Enable' ),
								maskPosition : 6
							},
							{
								itemId : 'disable',
								itemLabel : getLabel( 'actionDisable', 'Disable' ),
								maskPosition : 7
							},
							{
								itemId : 'submit',
								itemLabel : getLabel( 'actionSubmit', 'Submit' ),
								maskPosition : 10
							}
					
					// commented as Clone Action code not yet added. 		
							/*		{
								itemId : 'clone',
								itemLabel : getLabel( 'clone', 'Copy Record' ),
								maskPosition : 9
							} */

						]
					}
				};
				return objActionCol;
			},
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var me = this;
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
				if( ( maskPosition === 1 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( maskPosition === 2 && retValue )
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
			searchTrasactionChange : function()
			{
				var me = this;
				var searchValue = me.getSearchTxnTextInput().value;
				var anyMatch = me.getMatchCriteria().getValue();
				if( 'anyMatch' === anyMatch.searchOnPage )
				{
					anyMatch = false;
				}
				else
				{
					anyMatch = true;
				}

				var grid = me.getCodeMapGridViewRef();
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
									// populate indexes array, set
									// currentIndex, and
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
			toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferencesRef();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );

			},
			handleSavePreferences : function()
			{
				var me = this;
				me.savePreferences();
			},
			savePreferences : function()
			{
				var me = this, objPref = {}, arrCols = null, objCol = null;
				var strUrl = me.urlGridPref;
				var grid = me.getCodeMapGridViewRef();
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
								colHidden : objCol.hidden,
								colType : objCol.type
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
							if( responseData.d.preferences && responseData.d.preferences.success === 'Y' )
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
								// Need to check the flag to be sent

								/*	if( !Ext.isEmpty( me.getBtnSavePreferencesRef() ) )
										me.toggleSavePrefrenceAction( true );  */
								if( !Ext.isEmpty( me.getBtnSavePreferencesRef() ) )
									me.getBtnSavePreferencesRef().setDisabled( false );

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
								title : getLabel( 'codeMapErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'codeMapErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
				applyFilter : function() {
						var me = this;
						var grid = me.getCodeMapGridViewRef();
						grid.refreshData();
					},
			setInfoTooltip : function() {
				var me = this;
				var infotip = Ext.create('Ext.tip.ToolTip', {
							target : 'imgFilterInfoGridView',
							listeners : {
								// Change content dynamically depending on which element
								// triggered the show.
								beforeshow : function(tip) {
									var sellerVal = null;
									
									var objFilterPanel = me.getCodeMapFilterViewRef();
									var sellerFltId = objFilterPanel.down( 'combobox[itemId=sellerIdItemId]' );
									var codeMapStatus = objFilterPanel.down('combobox[itemId=statusFilter]');
									if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getRawValue())) {
										sellerVal = sellerFltId.getRawValue();
									}
									
									if (!Ext.isEmpty(codeMapStatus) && !Ext.isEmpty(codeMapStatus.getRawValue())) {
										codeMapStatus = codeMapStatus.getRawValue();
									}
									
									tip.update(getLabel( "financialinstitution", "Financial Institution" ) + ' : ' + sellerVal + '<br/>'
									+getLabel('status', 'Status') + ' : ' + codeMapStatus + '<br/>'
									);	
									
								}
							}
						});
			}

		} );
