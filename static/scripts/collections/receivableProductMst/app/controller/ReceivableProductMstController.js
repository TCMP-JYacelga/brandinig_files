/**
 * @class GCP.controller.ReceivableProductController
 * @extends Ext.app.Controller
 * @author Archana Shirude
 */

Ext
	.define(
		'GCP.controller.ReceivableProductMstController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.ReceivableProductMstGridView'
			],
			views :
			[
				'GCP.view.ReceivableProductMstView'
			],

			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'receivableProductMstViewRef',
					selector : 'receivableProductMstViewType'
				},
				{
					ref : 'receivableProductMstGridViewRef',
					selector : 'receivableProductMstViewType receivableProductMstGridViewType'
				},
				{
					ref : 'receivableProductMstDtlViewRef',
					selector : 'receivableProductMstViewType receivableProductMstGridViewType panel[itemId="receivableProductMstDtlViewItemId"]'
				},
				{
					ref : 'receivableProductMstGridRef',
					selector : 'receivableProductMstViewType receivableProductMstGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'receivableProductMstViewType receivableProductMstGridViewType receivableProductMstGroupActionViewType'
				},				
				{
					ref : "statusFilter",
					selector : 'receivableProductMstFilterViewType combobox[itemId="requestStateFilterItemId"]'
				},
				{
					ref : 'receivableProductMstFilterViewRef',
					selector : 'receivableProductMstViewType receivableProductMstFilterViewType'
				},
				{
					ref :'productCodeFilter',
					selector :'receivableProductMstFilterViewType AutoCompleter[itemId="productNameFilterItemId"]'
				},
				{
					ref :'createNewProductItemId',
					selector :'receivableProductMstViewType button[itemId="createNewProductItemId"]'
				},
				{
					ref : "sellerFilter",
					selector : 'receivableProductMstFilterViewType combobox[itemId="sellerFltId"]'
				}
			],

			config :
			{
				filterCodeValue : null,
				sellerFilterVal : strSellerId,
				productCodeFilterVal : 'all',
				productRecKeyFilterVal : 'all',
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
					'receivableProductMstViewType' :
					{
						render : function( panel )
						{
						},
						performReportAction : function( btn, opts )
						{
							me.handleReportAction( btn, opts );
						},
						createNewReceivableProduct:function(btn){
							me.handleCreateNewReceivableProduct();
						}
					},

					'receivableProductMstGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},

					'receivableProductMstFilterViewType' :
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

					'receivableProductMstGridViewType smartgrid' :
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
					'receivableProductMstGridViewType toolbar[itemId=groupActionBarItemId]' :
					{
						performGroupAction : function( btn, opts )
						{
							me.handleGroupActions( btn );
						}
					},

					'receivableProductMstFilterViewType AutoCompleter[itemId="productNameFilterItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.productCodeFilterVal = record[ 0 ].data.CODE;
							me.productRecKeyFilterVal = record[ 0 ].data.RECORD_KEY_NO;
						},
						change : function( combo, record, index )
						{
							if( Ext.isEmpty( record ) )
							{
								me.productCodeFilterVal ='';
								me.productRecKeyFilterVal ='';
							}
						}
					},

					'receivableProductMstFilterViewType combobox[itemId="requestStateFilterItemId"]' :
					{
						select : function( combo, record, index )
						{
							me.statusKeyFilterVal = record[ 0 ].data.key;
							me.statusFilterVal = record[ 0 ].data.value;
						}
					},

					'receivableProductMstFilterViewType button[itemId="btnFilter"]' :
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
				var jsonArray = [],statusVal = null;
				var isPending = true;

				jsonArray.push(
				{
					paramName : 'sellerCode',
					paramValue1 : encodeURIComponent(me.sellerFilterVal.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				} );
				if( !Ext.isEmpty( me.getProductCodeFilter() ) && !Ext.isEmpty(me.getProductCodeFilter().getValue()))
				{
					jsonArray.push(
					{
						paramName : 'productDescription',
						paramValue1 : encodeURIComponent(me.getProductCodeFilter().getValue().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S'
					} );
				}
				
				me.statusVal = me.getStatusFilter().getValue();
				
				if( !Ext.isEmpty( me.statusVal ) && me.statusVal.toUpperCase()!='ALL' && getLabel('lblAll','All').toUpperCase() != me.statusVal.toUpperCase() )
				{
				   if(me.statusVal == 13)//Pending My Approval
					{
						me.statusVal  = new Array('5YN','4NN','0NY','1YY');
						isPending = false;
						jsonArray.push({
									paramName : 'statusFilter',
									paramValue1 : me.statusVal,
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
			 if (me.statusVal == 12 || me.statusVal == 3 || me.statusVal == 14)
			 {
				if (me.statusVal == 12 || me.statusVal == 14) //12: New Submitted //14:Modified Submitted
				{
					me.statusVal = (me.statusVal == 12) ? 0:1;
							jsonArray.push({
										paramName : 'isSubmitted',
										paramValue1 : 'Y',
										operatorValue : 'eq',
										dataType : 'S'
									});
							
						} else // Valid/Authorized
						{
							jsonArray.push({
										paramName : 'validFlag',
										paramValue1 : 'Y',
										operatorValue : 'eq',
										dataType : 'S'
									});
						}
					} else if (me.statusVal == 11) // Disabled
					{
						me.statusVal = 3;
						jsonArray.push({
									paramName : 'validFlag',
									paramValue1 : 'N',
									operatorValue : 'eq',
									dataType : 'S'
								});
					} else if (me.statusVal == 0 || me.statusVal == 1) // New
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
										paramName : me.getStatusFilter().name,
										paramValue1 : me.statusVal,
										operatorValue : 'eq',
										dataType : 'S'
									});
				 }
				}
				return jsonArray;
			},

			handleSmartGridConfig : function()
			{
				var me = this;
				var receivableProductMstGrid = me.getReceivableProductMstGridRef();
				var objConfigMap = me.getReceivableProductNewConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( receivableProductMstGrid ) )
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
				receivableProductGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : _GridSizeMaster,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : false,
					showPager : true ,
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

				var receivableProductDtlView = me.getReceivableProductMstDtlViewRef();
				receivableProductDtlView.add( receivableProductGrid );
				receivableProductDtlView.doLayout();
			},

			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'accept' || actionName === 'reject' || actionName === 'discard'
					|| actionName === 'submit' || actionName === 'disable'|| actionName === 'enable')
				{
					me.handleGroupActions( btn, record );
				}
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'history' ).__deferred.uri, record.get( 'identifier' ), record.get('productDescription'));
					}
				}
				else if( actionName === 'btnView' )
				{
					me.submitForm('viewReceivableProductMst.form', record, rowIndex);
				}
				else if( actionName === 'btnEdit' )
				{
					me.submitForm('editReceivableProductMst.form', record, rowIndex);
				}
			},

			submitForm : function(strUrl, record, rowIndex) {
				var me = this;
				var viewState = record.data.identifier;
				var updateIndex = rowIndex;
				var form, inputField;
				
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokenValue));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'txtRecordIndex', rowIndex));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
						viewState));

				form.action = strUrl;
			//	me.setFilterParameters(form, record);
				document.body.appendChild(form);
				form.submit();
			},

			showHistory : function( url, id , cat )
			{
				Ext.create( 'GCP.view.ReceivableProductMstHistoryView',
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
			handleCreateNewReceivableProduct:function(){
				var me = this;
				var form;
		//		var sellerCombo = me.getFinancialComboFilter();
		//		if (sellerCombo) {
		//			var selectedSeller = sellerCombo.getValue();
		//		}
				var strUrl = 'addReceivableProductMst.form';
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokenValue));
		//		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
		//				selectedSeller));

				form.action = strUrl;
			//	me.setFilterParameters(form);
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);
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
				strUrl = 'services/getReceivableProductMst/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var strQuickFilterUrl = me.getFilterUrl();
				strUrl += strQuickFilterUrl;
				var grid = me.getReceivableProductMstGridRef();
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

			getReceivableProductNewConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"productCode" : 100,
					"productDescription" : 350,
					"currencies":100,
					"cutOffTime" : 100,
					"requestStateDesc" : 100
				};

				arrColsPref =
				[
					{
						"colId" : "productCode",
						"colDesc" : getLabel( 'productCode', 'Product Code' )
					},
					{
						"colId" : "productDescription",
						"colDesc" : getLabel( 'productName', 'Product Name' )
					},
					{
						"colId" : "currencies",
						"colDesc" : getLabel( 'currencies', 'Currencies' )
					},
					{
						"colId" : "cutOffTime",
						"colDesc" : getLabel( 'cutOffTime', 'Cut Off Time' )
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
						'productCode','productDescription', 'currencies', 'cutOffTime','requestStateDesc','history', 'identifier', 'viewState','__metadata'
					],
					proxyUrl : 'services/receivableProductMst.json',
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

			callHandleLoadGridData : function()
			{
				var me = this;
				var gridObj = me.getReceivableProductMstGridRef();
				me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null );
			},

			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
				var buttonMask = '00000000000';
				me.enableDisableGroupActions(buttonMask,'N','N','N');
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

			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'services/receivableProductMst/{0}.srvc?', strAction );
				//strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
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
								Ext.Msg.alert(getLabel( 'lblerror', 'Error' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remark field can not be blank' ));
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
				var grid = this.getReceivableProductMstGridRef();
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
							recordDesc :records[index].data.productDescription
						} );
					}
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						} );

					grid.setLoading(true);
					Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						timeout : 60000,
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							grid.setLoading(false);
							grid.refreshData();
//									me.applyFilter();
							var errorMessage = '';
							if(!Ext.isEmpty(response.responseText))
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
						},
						failure : function() {
							grid.setLoading(false);
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel('errorTitle', 'Error'),
										msg : getLabel('errorPopUpMsg', 'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
				}
			},

			isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
				 var maskSize = 11;
				 var maskArray = new Array();
				 var actionMask = '';
				 var rightsMap = record.data.__metadata.__rightsMap;
				 var buttonMask = '';
				 var retValue = true;
				 var bitPosition = '';
				 if (!Ext.isEmpty(maskPosition)) {
					 bitPosition = parseInt(maskPosition,10) - 1;
					 maskSize = maskSize;
				 }
				 if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
					 buttonMask = jsonData.d.__buttonMask;
				 maskArray.push(buttonMask);
				 maskArray.push(rightsMap);
				 actionMask = doAndOperation(maskArray, maskSize);
				 var isSameUser = true;
				 if (record.raw.makerId === USER) {
					 isSameUser = false;
				 }
				 if (Ext.isEmpty(bitPosition))
					return retValue;
				 retValue = isActionEnabled(actionMask, bitPosition);
				 if ((maskPosition === 6 && retValue)) {
					
					 retValue = retValue && isSameUser;
				 } else if (maskPosition === 7 && retValue) {
						
					retValue = retValue && isSameUser;
				 } else if (maskPosition === 2 && retValue) {
				 
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
			enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
				var actionBar = this.getActionBarSummDtl();
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
				else
				{
					strRetValue = value;
				}
				return strRetValue;
			},

			createGroupActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 150,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					resizable : false,
					draggable : false,
					items: [{
								text : getLabel('submit', 'Submit'),
								itemId : 'submit',
								actionName : 'submit',
								maskPosition : 5
							},{
								text : getLabel('approve', 'Approve'),
								itemId : 'accept',
								actionName : 'accept',
								maskPosition : 6
							},{
								text : getLabel('prfMstActionReject', 'Reject'),
								itemId : 'reject',
								actionName : 'reject',
								maskPosition : 7
							},{
								text : getLabel('prfMstActionEnable', 'Enable'),
								itemId : 'enable',
								actionName : 'enable',
								maskPosition : 8
							}, {
								text : getLabel('prfMstActionSuspend', 'Suspend'),
								itemId : 'disable',
								actionName : 'disable',
								maskPosition : 9
							},{
								text : getLabel('prfMstActionDiscard', 'Discard'),
								itemId : 'discard',
								actionName : 'discard',
								maskPosition : 10
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
					sortable : false,
					align : 'left',
					width : 75,
					locked : true,
					items :
					[{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip','Edit'),
						maskPosition : 2
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip :  getLabel('viewToolTip','View Record'),
						maskPosition : 3
					},{
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip','View History'),
						toolTip : getLabel('historyToolTip','View History'),
						maskPosition : 4
					}]
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
							var sellerFilter =  me.getSellerFilter().getRawValue();
							var categoryCodeFilter = me.getProductCodeFilter();
							var statusFilter =  me.getStatusFilter();
							
							if (!Ext.isEmpty(categoryCodeFilter)
									&& !Ext.isEmpty(categoryCodeFilter.getValue())) {
								categoryCodeFilter = categoryCodeFilter.getRawValue();
							}else
								categoryCodeFilter = getLabel('none','None');

							if (!Ext.isEmpty(statusFilter)
									&& !Ext.isEmpty(statusFilter.getValue())) {
								statusFilter = statusFilter.getRawValue();
							}else
								statusFilter = getLabel('none','None');							

							tip.update( 
							    getLabel('financialinstitution', 'Financial Institution') + ' : ' 
							    + sellerFilter + '<br/>'
								+ getLabel( 'product', 'Product' ) + ' : '
								+ categoryCodeFilter + '<br/>'
								+ getLabel( 'colStatus', 'Status' ) + ' : ' + statusFilter );
						}
					}
				} );
			}

		} );