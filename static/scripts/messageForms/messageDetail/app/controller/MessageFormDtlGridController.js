	Ext.define( 'GCP.controller.MessageFormDtlGridController',
	{
		extend : 'Ext.app.Controller',
		requires :
		[
			'GCP.view.MessageFormDtlGridView'
		],
		views :
		[
			'GCP.view.MessageFormDtlMainView'
		],
	
		/**
		 * Array of configs to build up references to views on page.
		 */
		refs :
		[
			{
				ref : 'messageFormDtlGridViewRef',
				selector : 'messageFormDtlGridViewType panel[itemId="gridViewDetailPanelItemId"]'
			},
			{
				ref : 'smartGridRef',
				selector : 'grid[itemId="smartGridItemId"]'
			}
		],
		config :
		{
			listURL : 'getMessageFormDtlList.srvc'
		},
	
		/**
		 * A template method that is called when your application boots. It is
		 * called before the Application's launch function is executed so gives a
		 * hook point to run any code before your Viewport is created.
		 */
	
		init : function()
		{
			var me = this;
	
			me.control(
			{
	
				'messageFormDtlMainViewType' :
				{
					render : function( panel )
					{
						me.handleSmartGridConfig();
					}
				},
				'messageFormDtlGridViewType smartgrid' :
				{
					/*render : function( grid )
					{
						me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null, null );
					},*/
					render : function(grid) {
						me.handleLoadGridData(grid, grid.store.dataUrl,
								grid.pageSize, 1, 1, null,null);
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
			var smartGridRef = me.getSmartGridRef();
			if( Ext.isEmpty( smartGridRef ) )
			{
				if( objDefaultDtlGridViewPref )
				{
					me.loadSmartGrid( objDefaultDtlGridViewPref );
				}
			}
			else
			{
				me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null, null );
			}
		},
	
		loadSmartGrid : function( data )
		{
			var me = this;
			var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
			var massageFormDtlGrid = null;
			var url;
			var url = me.listURL;
	
			var objWidthMap =
			{
				"fieldName" : 250,
				"fieldMandatory" : 80,
				"fieldLength" : 80,
				"fieldSequence" : 80,
				"fieldTypeDesc" : 250
			};
			objPref = data[ 0 ];
			arrColsPref = objPref.gridCols;
			arrCols = me.getColumns( arrColsPref, objWidthMap );
			pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 100;
	
			massageFormDtlGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
			{
				itemId : 'smartGridItemId',
				pageSize : 10,
				autoDestroy : true,
				stateful : false,
				showEmptyRow : false,
				hideRowNumbererColumn : false,
				showCheckBoxColumn : false,
				showPager : true,
				padding : '5 10 10 10',
				rowList :
				[
					10, 25, 50, 100, 200, 500
				],
				minHeight : 140,
				columnModel : arrCols,
				storeModel :
				{
					fields :
					[
						'fieldName', 'fieldMandatory', 'fieldMinLength', 'fieldMaxLength', 'fieldDisclaimerText','fieldSequence',
						'fieldValueListDefVal', 'fieldTypeDesc', 'fieldType','fieldValueList','identifier','recViewState', '__metadata'
					],
					proxyUrl : url,
					rootNode : 'd.messageFormDtl',
					totalRowsNode : 'd.__count'
				},
				isRowIconVisible : me.isRowIconVisible,
				handleRowMoreMenuClick : me.handleRowMoreMenuClick,
	
				handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
				{
					me.handleRowIconClick( tableView, rowIndex, columnIndex, btn, event, record );
				},
				handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
						menu, event, record) {
						var dataParams = menu.dataParams;
						me.handleRowIconClick(
						  dataParams.view,
						  dataParams.rowIndex,
						  dataParams.columnIndex,
						  menu, event,
						 dataParams.record);
					}
			} );
			var messageFormDtlGridViewRef = me.getMessageFormDtlGridViewRef();
			messageFormDtlGridViewRef.add( massageFormDtlGrid );
			messageFormDtlGridViewRef.doLayout();
		},
	
		getColumns : function( arrColsPref, objWidthMap )
		{
			var me = this;
			var arrCols = new Array(), objCol = null, cfgCol = null;
			arrCols.push( me.createActionColumn() );
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
		},// getColumns
	
		createActionColumn : function()
		{
			var me = this;
			var objActionCol =
			{
				colType : 'actioncontent',
				colId : 'actioncontent',
				sortable : false,
				align : 'left',
				width : 80,
				locked : true,
				colHeader : getLabel('action', 'Action'),
				items :
				[
					{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel( 'viewToolTip', 'View Record' ),
						maskPosition : 1
					},
					{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel( 'editToolTip', 'Edit Record' ),
						maskPosition : 2
					},
					{
						itemId : 'btnDelete',
						itemCls : 'grid-row-action-icon icon_deleted',
						itemLabel : getLabel( 'deleteToolTip', 'Delete' ),
						toolTip : getLabel( 'deleteToolTip', 'Delete' ),
						maskPosition : 3
					}
				]
			};
			return objActionCol;
		},
	
		columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
		{
			var strRetValue = "";
			strRetValue = value;
			return strRetValue;
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
			if( 'VIEW' == pageMode)
			{
				buttonMask = "100";	
			}
			maskArray.push( buttonMask );
			
			maskArray.push( rightsMap );
			actionMask = doAndOperation( maskArray, maskSize );
	
			if( Ext.isEmpty( bitPosition ) )
				return retValue;
			retValue = isActionEnabled( actionMask, bitPosition );
			return retValue;
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
					blnRetValue = me.isRowIconVisible( store, record, jsonData, null, arrMenuItems[ a ].maskPosition );
					arrMenuItems[ a ].setVisible( blnRetValue );
				}
			}
			menu.showAt( event.xy[ 0 ] + 5, event.xy[ 1 ] + 5 );
		},
	
		enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
		{
			var me = this;
			var buttonMask = '000';
			var maskArray = new Array(), actionMask = '', objData = null;
			;
	
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
			actionMask = doAndOperation( maskArray, 15 );
			me.enableDisableGroupActions( actionMask, isSameUser );
		},
	
		handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
		{
			var me = this;
			var actionName = btn.itemId;
			if( actionName === 'btnEdit' )
			{
				showEditFieldPopup( record.data );
			}
			else if( actionName === 'btnView' )
			{
				showViewMessageFormDtl( record.data );
			}
			else if( actionName === 'btnDelete' )
			{
				deleteMessageFormDtl( record.data.recViewState );
			}
		},
	
		callHandleLoadGridData : function( passedFilterUrl )
		{
			var me = this;
			var gridObj = me.getMessageFormDtlGridViewRef().globalGridRef;
			me.handleLoadGridData( gridObj, gridObj.store.dataUrl, gridObj.pageSize, 1, 1, null, passedFilterUrl );
		},
	
		handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter, filterUrl )
		{
			var me = this;
			me.getMessageFormDtlGridViewRef().globalGridRef = grid;
			var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
			var viewState = document.getElementById("viewStateFormField"); 
			strUrl = strUrl + (filterUrl ? filterUrl : '') + "&" + csrfTokenName + "=" + csrfTokenValue + "&$viewState=" + encodeURIComponent(viewState.value);
			grid.loadGridData(strUrl, null, null, false);
		}
	
	} );
