Ext
	.define(
		'GCP.controller.InputParameterController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.InputParameterGridView'
			],
			views :
			[
				'GCP.view.InputParameterView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'inputParameterView',
					selector : 'inputParameterView'
				},
				{
					ref : 'inputParameterGrid',
					selector : 'inputParameterView inputParameterGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'inputParameterDtlView',
					selector : 'inputParameterView inputParameterGridView panel[itemId="inputParameterDtlView"]'
				},
				{
					ref : 'inputParameterGridView',
					selector : 'inputParameterView inputParameterGridView'
				},
				{
					ref : 'addInputParamBtn',
					selector : 'inputParameterView button[itemId="addInputParamBtn"]'
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
						'inputParameterView' :
						{
							beforerender : function( panel, opts )
							{	
								if(routineType == 'PRE_PROCESSING_ROUTINE')
								{
									me.getAddInputParamBtn().hide();
								}
								else
								{
									if(pageMode == 'View')
									{
										me.getAddInputParamBtn().hide();
									}
									else
									{
										me.getAddInputParamBtn().show();
									}
								}
							},
							afterrender : function( panel, opts )
							{
							}
						},
						'inputParameterGridView' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'inputParameterView button[itemId="addInputParamBtn"]' :
						{
							click : function( btn, opts )
							{
								addInputParameterField();
							}
						},
						'inputParameterGridView smartgrid' :
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
						}
					} );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var inputParameterGrid = me.getInputParameterGrid();
				var objConfigMap = me.getInputParameterConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( inputParameterGrid ) )
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
				inputParameterGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					autoScroll : true,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showCheckBoxColumn : false,
					stripeRows: true,
					showPager : false,
					padding : '5 0 0 0',
					rowList :
					[
					 	10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					minWidth : 300,
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
				var inputParameterDtlView = me.getInputParameterDtlView();
				inputParameterDtlView.add( inputParameterGrid );
				inputParameterDtlView.doLayout();
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
			},
			getInputParameterConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				var switchType = null;
				if(routineType == 'PRE_PROCESSING_ROUTINE')
				{
					switchType = '0' ;
				}
				else
				{
					switchType = '1' ;
				}
				objWidthMap =
				{
					"checked":60,
					"bandName":100,
					"fieldName" : 600
				};
				switch (switchType) 
				{
					case '0' :
						arrColsPref =
							[
								{
									"colId" : "checked",
									"colDesc" : getLabel( 'Select', 'Select' )
								},
								{
									"colId" : "fieldName",
									"colDesc" : getLabel( 'fieldName', 'Field Name' )
								}
							];
						break;
					case '1' :
						arrColsPref =
							[
								{
									"colId" : "checked",
									"colDesc" : getLabel( 'Select', 'Select' )
								},
								{
									"colId" : "bandName",
									"colDesc" : getLabel( 'bandName', 'Band Name' )
								},
								{
									"colId" : "fieldName",
									"colDesc" : getLabel( 'fieldName', 'Field Name' )
								}
							];
						break;	
				}
				
				storeModel =
				{
					fields :
					[
					 	'interfaceCode','processCode','parameterName','bandName','fieldName','routineName','routineType',
					 	'seqNmbr','checked','selected','recordKeyNo'
					],
					proxyUrl : 'getInputParameterList.srvc',
					rootNode : 'd.inputParameter',
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
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue + "&" + "$viewState" + "=" + encodeURIComponent(strViewState)+"&$routineType="+routineType;
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
				if(colId == 'col_checked')
				{
					if(value == 'Y')
					{
						if(pageMode == 'View')
						{
							strRetValue = '<input type="checkbox" onclick="javascript:setFlag('+rowIndex+',this)" id="'+rowIndex+'_checkId" name="'+rowIndex+'_checkName" checked disabled="disabled"/>';
						}
						else
						{
							strRetValue = '<input type="checkbox" onclick="javascript:setFlag('+rowIndex+',this)" id="'+rowIndex+'_checkId" name="'+rowIndex+'_checkName" checked/>';
						}
						
					}
					else
					{
						if(pageMode == 'View')
						{
							strRetValue = '<input type="checkbox" onclick="javascript:setFlag('+rowIndex+',this)" id="'+rowIndex+'_checkId" name="'+rowIndex+'_checkName" disabled="disabled" />';
						}
						else
						{
							strRetValue = '<input type="checkbox" onclick="javascript:setFlag('+rowIndex+',this)" id="'+rowIndex+'_checkId" name="'+rowIndex+'_checkName" />';
						}
					}	
				}
				else
				{
					strRetValue = value;
				}
				return strRetValue;
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
function setFlag(rowIndex,checkbox)
{
	if(checkbox.checked == true)
	{
		inputParameterGrid.store.data.items[rowIndex].data.checked="Y";
	}
	else
	{
		inputParameterGrid.store.data.items[rowIndex].data.checked="N";
	}
}

