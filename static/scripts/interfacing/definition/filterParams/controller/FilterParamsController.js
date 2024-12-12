Ext
	.define(
		'GCP.controller.FilterParamsController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.FilterParamsGridView'
			],
			views :
			[
				'GCP.view.FilterParamsView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'filterParamsView',
					selector : 'filterParamsView'
				},
				{
					ref : 'filterParamsGrid',
					selector : 'filterParamsView filterParamsGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'filterParamsDtlView',
					selector : 'filterParamsView filterParamsGridView panel[itemId="filterParamsDtlView"]'
				},
				{
					ref : 'addFilterParamsbtn',
					selector : 'filterParamsView button[itemId="addFilterParamsbtn"]'
				},
				{
					ref : 'filterParamsGridView',
					selector : 'filterParamsView filterParamsGridView'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'filterParamsView filterParamsGridView filterParamsGroupActionBarView'
				},
				{
					ref : 'actionLbl',
					selector : 'filterParamsGridView label[itemId="actionLbl"]'
				},
				{
					ref : 'deleteBtn',
					selector : 'filterParamsGridView toolbar[itemId="filterParamsGroupActionBarView_summDtl"]'
				}
			],
			config :
			{
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
				me
					.control(
					{
						'filterParamsView' :
						{
							beforerender : function( panel, opts )
							{	
								
							},
							afterrender : function( panel, opts )
							{
							}
						},
						'filterParamsView button[itemId="addFilterParamsbtn"]' :
						{
							click : function( btn, opts )
							{
								addFilterParamPopUp();
							}
						},
						'filterParamsGridView' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
								if(pageMode == 'View')
								{
									me.getActionLbl().hide();
									me.getDeleteBtn().hide();
								}
								else
								{
									me.getActionLbl().show();
									me.getDeleteBtn().show();
								}
							}
						},
						'filterParamsGridView smartgrid' :
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
						'filterParamsView filterParamsGridView toolbar[itemId=filterParamsGroupActionBarView_summDtl]' :
						{
							performGroupAction : function( btn, opts )
							{
								me.deleteAction();
							}
						}
					} );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var filterParamsGrid = me.getFilterParamsGrid();
				var objConfigMap = me.getFilterParamsConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( filterParamsGrid ) )
				{
					if( objConfigMap.arrColsPref )
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
			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;

				pgSize = 10;
				filterParamsGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					padding : 10,
					cls: 'ux_border-top',
					rowList :
					[
					 	10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
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
					handleMoreMenuItemClick : me.handleRowIconClick
				} );
				var badnInfoDtlView = me.getFilterParamsDtlView();
				badnInfoDtlView.add( filterParamsGrid );
				badnInfoDtlView.doLayout();
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'delete')
					me.handleGroupActions( btn, record );
				else if( actionName === 'btnView' )
				{
					viewFilterParameter(record);
				}
				else if( actionName === 'btnEdit' )
				{
					editFilterParamPopUp(record);
				}
				else if( actionName === 'btnDelete' )
				{
					
				}
			},
			getFilterParamsConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"parameterName" : 200,
					"dataType" : 150,
					"parameterDesc" : 200,
					"parameterType" : 100,
					"defaultValue" : 200,
					"derivation":100
				};
				arrColsPref =
					[
						{
							"colId" : "parameterName",
							"colDesc" : getLabel( 'filterParamName', 'Name' )
						},
						{
							"colId" : "dataType",
							"colDesc" : getLabel( 'filterParamDataType', 'Data Type' )
						},
						{
							"colId" : "parameterDesc",
							"colDesc" : getLabel( 'filterParamDesc', 'Description' )
						},
						{
							"colId" : "parameterType",
							"colDesc" : getLabel( 'filterParamType', 'Type' )
						},
						{
							"colId" : "defaultValue",
							"colDesc" : getLabel( 'filterParamDefaultValue', 'Default Value' )
						},
						{
							"colId" : "derivationTypeDesc",
							"colDesc" : getLabel( 'filterParamDerivation', 'Derivation' )
						}
					];
				
				storeModel =
				{
					fields :
					[
						'parameterName','dataType', 'parameterDesc', 'parameterType', 'defaultValue','derivation','derivationValue','derivationValue1',
						'derivationTypeDesc', 'identifier','__metadata','mandateType','length','columnFormat','viewParamState','listValueType'
					],
					proxyUrl : 'getFilterParameterList.srvc',
					rootNode : 'd.filterParameters',
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
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue + "&" + "$viewState" + "=" + encodeURIComponent(strViewState);
				grid.loadGridData( strUrl, null);
			},
			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '000';
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
				actionMask = doAndOperation( maskArray, 3 );
				me.enableDisableGroupActions( actionMask, isSameUser );
			},
			deleteAction : function()
			{
				var me = this;
				var grid = this.getFilterParamsGrid();
				var updateIndex;
				var listState = '';
				if( !Ext.isEmpty( grid ) )
				{
					var records = grid.getSelectedRecords();
					for( var index = 0 ; index < records.length ; index++ )
					{
						listState = listState + records[ index ].data.viewParamState + "," ;
					}
					document.getElementById( "listState" ).value =listState;
					deleteFilterParam("frmMain");
				}
			},
			handleGroupActions : function( btn, record )
			{
				var me = this;
				var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
				var strUrl = Ext.String.format( 'FilterParams/{0}.srvc?',strAction );
				strUrl= strUrl+ csrfTokenName + "=" + csrfTokenValue;
				this.preHandleGroupActions( strUrl, '', record );
			},
			preHandleGroupActions : function( strUrl, remark, record )
			{

				var me = this;
				var grid = this.getMessageBoxGrid();
				
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
							// TODO : Action Result handling to
							// be done here
							me.enableDisableGroupActions( '000', true );
							grid.refreshData();
							me.setGridInfo(grid);
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'ErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'ErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}

			},
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 3;
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
				if (pageMode == 'View' && maskPosition == '1')
					{
						retValue = false;
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
							if( ( item.maskPosition === 6 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 7 && blnEnabled )
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
				//arrCols.push( me.createGroupActionColumn())
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
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				if(colId == 'col_parameterType')
				{
					if( 'I' == value ||'Internal' == value )
					{
						value = getLabel('Internal','Internal');
					}
					else if( 'E' == value ||'External' == value)
					{
						value = getLabel('External','External');
					}
					else if( 'H' == value ||'Hidden' == value )
					{
						value = getLabel("Hidden",'Hidden');
					}
				}
				strRetValue = value;
				return strRetValue;
			},
			createGroupActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 80,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'btnDelete',
							text : 	getLabel( 'actionDelete', 'Delete' ),
							toolTip : getLabel( 'actionDelete', 'Delete' ),
							maskPosition : 3
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
					colId : 'actionId',
					width : 70,
					align : 'right',
					locked : true,
					items :
					[
						{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							toolTip : getLabel( 'editToolTip', 'Edit Record' ),
							itemLabel : getLabel( 'editToolTip', 'Edit Record' ),
							maskPosition : 1
						},
						{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel( 'viewToolTip', 'View Record' ),
							itemLabel : getLabel( 'viewToolTip', 'View Record' ),
							maskPosition : 2
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
			}
		} );
