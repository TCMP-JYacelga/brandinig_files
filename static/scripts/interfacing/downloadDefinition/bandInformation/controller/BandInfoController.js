Ext
	.define(
		'GCP.controller.BandInfoController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.BandInfoGridView'
			],
			views :
			[
				'GCP.view.BandInfoView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'bandInfoView',
					selector : 'bandInfoView'
				},
				{
					ref : 'bandInfoGrid',
					selector : 'bandInfoView bandInfoGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'bandInfoDtlView',
					selector : 'bandInfoView bandInfoGridView panel[itemId="bandInfoDtlView"]'
				},
				{
					ref : 'addBandbtn',
					selector : 'bandInfoView button[itemId="addBandbtn"]'
				},
				{
					ref : 'bandInfoGridView',
					selector : 'bandInfoView bandInfoGridView'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'bandInfoView bandInfoGridView bandInfoGroupActionBarView'
				},
				{
					ref : 'addBandLbl',
					selector : 'bandInfoView label[itemId="addBandLbl"]'
				},
				{
					ref : 'actionLbl',
					selector : 'bandInfoGridView label[itemId="actionLbl"]'
				},
				{
					ref : 'deleteBtn',
					selector : 'bandInfoGridView toolbar[itemId="bandInfoGroupActionBarView_summDtl"]'
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
						'bandInfoGridView' :
						{
							beforerender : function( panel, opts )
							{	
								if(pageMode == 'View' || 'false' == isBankInterfaceMapBand)
								{
									me.getAddBandbtn().hide();
									me.getAddBandLbl().hide();
								}
								else
								{
									me.getAddBandbtn().show();
									me.getAddBandLbl().show();
								}
							},
							afterrender : function( panel, opts )
							{
							}
						},
						'bandInfoView button[itemId="addBandbtn"]' :
						{
							click : function( btn, opts )
							{
								resetPopupField();
								showAddBandPopUp();
							}
						},
						'bandInfoGridView' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
								if(pageMode == 'View' || 'false' == isBankInterfaceMapBand)
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
						'bandInfoGridView smartgrid' :
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
						'bandInfoView bandInfoGridView toolbar[itemId=bandInfoGroupActionBarView_summDtl]' :
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
				var bandInfoGrid = me.getBandInfoGrid();
				var objConfigMap = me.getBandInfoConfiguration();
				var arrCols = new Array();
				var objPref = null, arrColsPref = null, pgSize = null;
				var data;
				if( Ext.isEmpty( bandInfoGrid ) )
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
				bandInfoGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					checkBoxColumnWidth : _GridCheckBoxWidth,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					padding : '10 10 10 10',
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
				var badnInfoDtlView = me.getBandInfoDtlView();
				badnInfoDtlView.add( bandInfoGrid );
				badnInfoDtlView.doLayout();
			},
			handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				var actionName = btn.itemId;
				if( actionName === 'btnView' )
				{
					getBandViewPopup(record);
				}
				else if( actionName === 'btnEdit' )
				{
					showEditBandPopUp(record);
				}
			},
			getBandInfoConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"bandName" : 100,
					"bandId" : 100,
					"bandIdPosition" : 100,
					"bandIdLength" : 100,
					"bandSequence" : 100,
					"parentBand":200
				};
				arrColsPref =
					[
						{
							"colId" : "bandName",
							"colDesc" : getLabel( 'bandName', 'Name' )
						},
						{
							"colId" : "bandId",
							"colDesc" : getLabel( 'bandId', 'Id' )
						},
						{
							"colId" : "bandIdPosition",
							"colDesc" : getLabel( 'bandPosition', 'Id Position' )
						},
						{
							"colId" : "bandIdLength",
							"colDesc" : getLabel( 'bandLength', 'Id Length' )
						},
						{
							"colId" : "bandSequence",
							"colDesc" : getLabel( 'bandSequence', 'Sequence' )
						},
						{
							"colId" : "parentBand",
							"colDesc" : getLabel( 'parentBand', 'Parent Name' )
						}
					];
				
				storeModel =
				{
					fields :
					[
						'bandName','bandId', 'bandIdPosition', 'bandIdLength', 'bandSequence', 'bandType', 'identifier',
						'__metadata', 'parentBand','relativeXpath','xpath','mandatory','bandFormatType','bandFileDelimitter',
						'txtBandFileDelimiter','bandQualifier','txtBandQualifier','bandMandatory','recordLevel','recordKeyNo',
						'datastoreName','bandViewState'
					],
					proxyUrl : 'getDownloadInterfaceBandDetailList.srvc',
					rootNode : 'd.bandInfo',
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
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue + "&" + "$viewState" + "=" + encodeURIComponent(viewState);
				grid.loadGridData( strUrl,me.enableEntryButtons, null, false);
			},
			enableEntryButtons:function(){
				interfaceGridLoaded=true;
				enableDisableGridButtons(false);
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
				actionMask = doAndOperation( maskArray, 10 );
				me.enableDisableGroupActions( actionMask, isSameUser );
			},
			deleteAction : function()
			{
				var me = this;
				var grid = this.getBandInfoGrid();
				var updateIndex;
				var listState = '';
				if( !Ext.isEmpty( grid ) )
				{
					var records = grid.getSelectedRecords();
					for( var index = 0 ; index < records.length ; index++ )
					{
						listState = listState + records[ index ].data.bandViewState + "," ;
					}
					document.getElementById( "listState" ).value =listState;
					deleteBand("addBandForm");
				}
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
				strRetValue = value;
				return strRetValue;
			},
			createActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'action',
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
