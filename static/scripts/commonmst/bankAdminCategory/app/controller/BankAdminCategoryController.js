/**
 * @class GCP.controller.BankAdminCategoryController
 * @extends Ext.app.Controller
 * @author Nilesh Shinde
 */

Ext
	.define(
		'GCP.controller.BankAdminCategoryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.BankAdminCategoryGridView'
			],
			views :
			[
				'GCP.view.BankAdminCategoryView'
			],

			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'bankAdminCategoryViewRef',
					selector : 'bankAdminCategoryViewType'
				},
				{
					ref : 'bankAdminCategoryGridViewRef',
					selector : 'bankAdminCategoryViewType bankAdminCategoryGridViewType'
				},
				{
					ref : 'bankAdminCategoryDtlViewRef',
					selector : 'bankAdminCategoryViewType bankAdminCategoryGridViewType panel[itemId="bankAdminCategoryDtlViewItemId"]'
				},
				{
					ref : 'bankAdminCategoryGridRef',
					selector : 'bankAdminCategoryViewType bankAdminCategoryGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'bankAdminCategoryViewType bankAdminCategoryGridViewType bankAdminCategoryGroupActionViewType'
				},				
				{
					ref : "statusFilter",
					selector : 'bankAdminCategoryFilterViewType combobox[itemId="requestStateFilterItemId"]'
				},
				{
					ref : 'bankAdminCategoryFilterViewRef',
					selector : 'bankAdminCategoryViewType bankAdminCategoryFilterViewType'
				},
				{
					ref :'categoryCodeFilter',
					selector :'bankAdminCategoryFilterViewType AutoCompleter[itemId="categoryCodeFilterItemId"]'
				}
			],

			config :
			{
				filterCodeValue : null,
				sellerFilterVal : strSellerId,
				categoryCodeFilterVal : 'all',
				categoryRecKeyFilterVal : 'all',
				statusFilterVal : 'all',
				statusKeyFilterVal : 'all',
				filterData : [],
				filterApplied : 'ALL',
				//recordIdetifier : null,
				recordViewState : null
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

				me.control(
				{
					'bankAdminCategoryViewType' :
					{
						render : function( panel )
						{
						},
						performReportAction : function( btn, opts )
						{
							me.handleReportAction( btn, opts );
						}
					},

					'bankAdminCategoryGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},

					'bankAdminCategoryFilterViewType' :
					{
						render : function( panel, opts )
						{
							me.setInfoTooltip();
						},
						expand : function( panel )
						{
							//me.toggleSavePrefrenceAction( true );
						},
						collapse : function( panel )
						{
							//me.toggleSavePrefrenceAction( true );
						},
						filterStatusType : function( btn, opts )
						{
							//me.toggleSavePrefrenceAction( true );
							me.handleStatusTypeFilter( btn );
						}
					},

					'bankAdminCategoryGridViewType smartgrid' :
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
							//me.toggleSavePrefrenceAction( true );
						},
						pagechange : function( pager, current, oldPageNum )
						{
							//me.toggleSavePrefrenceAction( true );
						}
					},

					'bankAdminCategoryGridViewType toolbar[itemId=groupActionBarItemId]' :
					{
						performGroupAction : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					},

					'bankAdminCategoryFilterViewType AutoCompleter[itemId="categoryCodeFilterItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.categoryCodeFilterVal = record[ 0 ].data.CODE;
							me.categoryRecKeyFilterVal = record[ 0 ].data.RECORD_KEY_NO;
						},
						change : function( combo, record, index )
						{
							me.categoryCodeFilterVal ='all';
							me.categoryRecKeyFilterVal ='all';
						}
					},

					'bankAdminCategoryFilterViewType combobox[itemId="requestStateFilterItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.statusKeyFilterVal = record[ 0 ].data.key;
							me.statusFilterVal = record[ 0 ].data.value;
						}
					},

					'bankAdminCategoryFilterViewType button[itemId="btnFilter"]' :
					{
						click : function( btn, opts )
						{
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
                var isPending = true;
				jsonArray.push(
				{
					paramName : 'sellerCode',
					paramValue1 : encodeURIComponent(me.sellerFilterVal.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				} );
				if( !Ext.isEmpty( me.categoryCodeFilterVal ) && !('all' === me.categoryCodeFilterVal))
				{
					jsonArray.push(
					{
						paramName : 'categoryRecKey',
						paramValue1 : encodeURIComponent(me.categoryCodeFilterVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});					
				}
				
				me.statusKeyFilterVal = me.getStatusFilter().getValue();
				
				if( !Ext.isEmpty( me.statusKeyFilterVal ) && me.statusKeyFilterVal.toUpperCase()!='ALL' && getLabel('lblAll','All').toUpperCase() != me.statusKeyFilterVal.toUpperCase() )
				{
		
					if(me.statusKeyFilterVal  == '13NY')
					{
					    me.statusKeyFilterVal  = new Array('5YY','4NY','0NY','1YY');
						isPending = false;
						jsonArray.push({
									paramName : 'statusFilter',
									paramValue1 : me.statusKeyFilterVal,
									operatorValue : 'in',
									dataType : 'S'
								} );
						jsonArray.push({
									paramName : 'makerId',
									paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : 'ne',
									dataType : 'S'
								});
					}
				 if(isPending)
				 {
					 if(me.statusKeyFilterVal  == '0NY' || me.statusKeyFilterVal  == '1YY'){
	                    	me.statusKeyFilterVal  = (me.statusKeyFilterVal  == '0NY')?'0NY':'1YY'
                        jsonArray.push(
                                   {
                                        paramName : 'statusFilter',
                                        paramValue1 : me.statusKeyFilterVal,
                                        operatorValue : 'eq',
                                        dataType : 'S'
                                   } );
                   }
                   else {
                   jsonArray.push(
                             {
                                   paramName : 'statusFilter',
                                   paramValue1 : me.statusKeyFilterVal,
                                   operatorValue : 'eq',
                                   dataType : 'S'
                             } );
                   }               

				}
			}
				return jsonArray;
			},

			handleSmartGridConfig : function()
			{
				var me = this;
				var bankAdminCategoryGrid = me.getBankAdminCategoryGridRef();
				var objConfigMap = me.getBankAdminCategoryNewConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( bankAdminCategoryGrid ) )
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
				bankAdminCategoryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : _GridSizeMaster,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : false,
					showSummaryRow : false,
					padding : '0 10 10 10',
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
					handleMoreMenuItemClick : function(
							grid, rowIndex, cellIndex,
							menu, event, record) {
						var dataParams = menu.dataParams;
						me.handleRowIconClick(
								dataParams.view,
								dataParams.rowIndex,
								dataParams.columnIndex,
								menu, null,
								dataParams.record);
					}			
				} );

				var bankAdminCategoryDtlView = me.getBankAdminCategoryDtlViewRef();
				bankAdminCategoryDtlView.add( bankAdminCategoryGrid );
				bankAdminCategoryDtlView.doLayout();
			},

			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'submit'  || actionName === 'disable' || actionName === 'enable')
				{
					me.handleGroupActions( btn, record );
				}
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ), record.get( 'categoryDesc' )  );
					}
				}
				else if( actionName === 'btnView' )
				{
					viewBankAdminCategoryRole( record.get( 'viewState' ) );
				}
				else if( actionName === 'btnEdit' )
				{
					editBankAdminCategoryRole( record.get( 'viewState' ) );
				}
			},

			submitForm : function( strUrl, record, rowIndex )
			{
				var form;
				var viewState = record.get( 'viewState' );

				strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="
					+ csrfTokenValue;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.action = strUrl;
				form.submit();
			},

			showHistory : function( url, id , cat )
			{
				Ext.create( 'GCP.view.BankAdminCategoryHistoryView',
				{
					historyUrl : url + "?" + csrfTokenName + "=" + csrfTokenValue,
					identifier : id,
					categoryDesc : cat
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
				strUrl = 'services/getBankAdminCategoryList/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.getFilterUrl();
				strUrl += strQuickFilterUrl;
				var grid = me.getBankAdminCategoryGridRef();
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

			getBankAdminCategoryNewConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"categoryCode" : '30%',
					"categoryDesc" : '40%',
					"requestStateDesc" : '30%'
				};

				
			if (autousrcode != 'PRODUCT') {	
				arrColsPref =
				[
					{
						"colId" : "categoryCode",
						"colDesc" : getLabel( 'lbl.bankAdminCategory.categoryCode', 'Role' )
					},
					{
						"colId" : "categoryDesc",
						"colDesc" : getLabel( 'lbl.bankAdminCategory.categoryDesc', 'Role Description' )
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : getLabel( 'status', 'Status' ),
						"colHidden" : false
					},
					{
						"colId" : "isAdminPrivSelected",
						"colDesc" : getLabel( 'bankAdmin', 'Bank Admin' ),
						"colHidden" : true
					},{
						"colId" : "isOnBehalfPrivSelected",
						"colDesc" : getLabel( 'onBehalf', 'On Behalf' ),
						"colHidden" : true
					}
				];
			} else {
				arrColsPref =
					[
					{
						"colId" : "categoryCode",
						"colDesc" : getLabel( 'lbl.bankAdminCategory.categoryCode', 'Role' )
					},
					{
						"colId" : "categoryDesc",
						"colDesc" : getLabel( 'lbl.bankAdminCategory.categoryDesc', 'Role Description' )
					},
					{
						"colId" : "requestStateDesc",
						"colDesc" : getLabel( 'status', 'Status' ),
						"colHidden" : false
					},{
						"colId" : "makerId",
						"colDesc" : getLabel( 'createdBy', 'Created By' ),
						"colHidden" : false
					},{
						"colId" : "makerStamp",
						"colDesc" : getLabel( 'dateCreated', 'Date Created' ),
						"colHidden" : false
					},{
						"colId" : "checkerId",
						"colDesc" : getLabel( 'approvedBy', 'Approved By' ),
						"colHidden" : true
					},{
						"colId" : "isAdminPrivSelected",
						"colDesc" : getLabel( 'bankAdmin', 'Bank Admin' ),
						"colHidden" : true
					},{
						"colId" : "isOnBehalfPrivSelected",
						"colDesc" : getLabel( 'onBehalf', 'On Behalf' ),
						"colHidden" : true
					}
					];
				}

				storeModel =
				{
					fields :
					[
						'categoryCode', 'categoryDesc', 'requestStateDesc','makerId','makerStamp','checkerId','history', 'identifier', 'viewState',
						'isAdminPrivSelected','isOnBehalfPrivSelected','__metadata'
					],
					proxyUrl : 'getBankAdminCategoryList.srvc',
					rootNode : 'd.bankAdminCategoryList',
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

			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getBankAdminCategoryGridRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
				me.enableDisableGroupActions( '000000000');
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
							isFilterApplied = true;
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
							isFilterApplied = true;
							break;
						
						case 'lk' :
							if(filterData[ index ].paramName == 'categoryRecKey')
							{
								strTemp = strTemp + ' ( ';
								strTemp = strTemp + filterData[ index ].paramName + ' '
										+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
										+ '\'';
								strTemp = strTemp + ' or ';
								strTemp = strTemp + 'categoryRecDesc '
								+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
								+ '\'';
								strTemp = strTemp + ' ) ';
							} else {
								strTemp = strTemp + filterData[ index ].paramName + ' '
								+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
								+ '\'';
							}
							isFilterApplied = true;
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
							isFilterApplied = true;
							break;
					}
					//isFilterApplied = true;
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
				var buttonMask = '000000000';
				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				var isSubmitted = false;
				var isDisabled = false;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < selectedRecords.length ; index++ )
				{
					objData = selectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
					if (objData.raw.validFlag != 'Y') {
						isDisabled = true;
					}
					if (objData.raw.isSubmitted != null
							&& objData.raw.isSubmitted == 'Y'
							&& objData.raw.requestState != 8
							&& objData.raw.requestState != 4
							&& objData.raw.requestState != 5) {
						isSubmitted = true;
					}
				}
				actionMask = doAndOperation( maskArray, 9 );
				me.enableDisableGroupActions( actionMask, isSameUser,isDisabled,
						isSubmitted );
			},

			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'getBankAdminCategoryList/{0}.srvc?', strAction );
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
						if( btn == 'ok' )
						{
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel( 'lblerror', 'Error' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remarks cannot be blank' ));
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
				var grid = this.getBankAdminCategoryGridRef();
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
							reason : records[ index ].data.categoryCode
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
									width : 300,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
							me.enableDisableGroupActions( '000000000', true );
							grid.refreshData();
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'lblerror', 'Error' ),
								msg : getLabel( 'lblerrordata', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}
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

			enableDisableGroupActions : function( actionMask, isSameUser,isDisabled,
					isSubmitted )
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
							if( ( item.maskPosition === 2 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 3 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 4 && blnEnabled )
							{
								blnEnabled = blnEnabled && (isSubmitted != undefined && !isSubmitted);
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
						
						if(objCol.colId == 'userCount' ||objCol.colId == 'adminEnable' ||objCol.colId == 'lmsEnable' )
						{
							cfgCol.locked = false;
							cfgCol.lockable = false;
							cfgCol.sortable = false;
							cfgCol.hideable = false;
							cfgCol.resizable = false;
							cfgCol.draggable = false;
							cfgCol.hidden = false;
						}
						else if(objCol.colId == 'requestStateDesc' ||objCol.colId == 'isAdminPrivSelected' ||objCol.colId == 'isOnBehalfPrivSelected')
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
				if(Ext.isEmpty(value) || (typeof(value)=="string" && value.indexOf("null")!=-1))
				{
					strRetValue = "";
				}
				else if(colId === 'col_makerStamp')
				{
					if(!Ext.isEmpty(value))
					{
						var arrDateString = value.split(" ");
						strRetValue = arrDateString[0];
					}
				} 
				else if(colId === 'col_isAdminPrivSelected'||colId === 'col_isOnBehalfPrivSelected')
				{
					if(!Ext.isEmpty(value))
					{
						if("Y"==value)
						{
							strRetValue = "Yes";	
						}	
						else
						{
							strRetValue = "No";	
						}
					}
				}
				else
				{
					strRetValue = value;
				}
				return strRetValue;
			},

			createGroupActionColumn : function()	{
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
								maskPosition : 4
							},{
								text : getLabel('prfMstActionEnable', 'Enable'),
								itemId : 'enable',
								actionName : 'enable',
								maskPosition : 5
							}, {
								text : getLabel('prfMstActionDisable',	'Suspend'),
								itemId : 'disable',
								actionName : 'disable',
								maskPosition : 6
							}]
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
					visibleRowActionCount : 2,
					align : 'left',
					width : 75,
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
							itemLabel : getLabel('viewToolTip','View Record'),
							maskPosition : 8
						},
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Edit Record' ),
							itemLabel : getLabel('edit','Edit'),
							maskPosition : 7
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

			setInfoTooltip : function()
			{
				var me = this;
				var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfo',
					listeners :
					{
						// Change content dynamically depending on which
						// element
						// triggered the show.
						beforeshow : function( tip )
						{
							var sellerFilter = me.sellerFilterVal == 'all' || Ext.isEmpty(me.sellerFilterVal) ? getLabel('none', 'None') : me.sellerFilterVal;
							var categoryCodeFilter = me.categoryCodeFilterVal == 'all' || Ext.isEmpty(me.categoryCodeFilterVal) ? getLabel('none', 'None') : me.categoryCodeFilterVal;
							var statusFilter = me.statusFilterVal == 'all' || Ext.isEmpty(me.statusFilterVal) ? getLabel('all', 'ALL') : me.statusFilterVal;

							// No seller required as of now
							/*
							tip.update( getLabel( 'lbl.bankAdminCategory.seller', 'Financial Institution' ) + ' : '
								+ sellerFilter + '<br/>'
								+ getLabel( 'lbl.bankAdminCategory.bankRoleName', 'Bank Role Name' ) + ' : '
								+ categoryCodeFilter + '<br/>'
								+ getLabel( 'lbl.bankAdminCategory.recordStatus', 'Status' ) + ' : ' + statusFilter );
							*/
							tip.update(getLabel( 'lbl.bankAdminCategory.bankRoleName', 'Role Name' ) + ' : '
								+ categoryCodeFilter + '<br/>'
								+ getLabel( 'lbl.bankAdminCategory.recordStatus', 'Status' ) + ' : ' + statusFilter );
						}
					}
				} );
			}

		} );
