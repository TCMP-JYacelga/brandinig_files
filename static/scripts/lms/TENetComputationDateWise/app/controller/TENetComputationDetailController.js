Ext
	.define( 'GCP.controller.TENetComputationDetailController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.TENetComputationSummaryGrid'
			],
			views :
			[
				'GCP.view.TENetComputationSummaryView'
			],
			refs :
			[
				{
					ref : 'cpComputationSummaryGridViewRef',
					selector : 'cpComputationSummaryViewType cpComputationSummaryGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'computationSummaryViewItemRef',
					selector : 'cpComputationSummaryViewType cpComputationSummaryGridViewType panel[itemId="computationSummaryViewItemId"]'
				}
			],
			config :
			{

			},
			init : function()
			{
				var me = this;
				
				me.control(
					{
						'cpComputationSummaryGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'cpComputationSummaryGridViewType smartgrid' :
						{
							render : function( grid )
							{
								me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
							},
							gridPageChange : me.handleLoadGridData,
							gridSortChange : me.handleLoadGridData,
							gridRowSelectionChange : function( grid, record, recordIndex, records, jsonData )
							{
							}
						}
					} );
			},
			
			handleLoadGridData : function( grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );

				strUrl = strUrl + "&$filter=" + viewState  + "&$selectedDate=" + selectedDate;
				strUrl = strUrl + "&$isAccrualSettlement=" + isAccrualSettlement;
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var computationSummaryGrid = me.getCpComputationSummaryGridViewRef();
				var objConfigMap = me.getComputationSummaryGridConfig();

				if( !Ext.isEmpty( computationSummaryGrid ) )
					computationSummaryGrid.destroy( true );

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
			
			getComputationSummaryGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"DATE" : 200,
					"CURRENCY" : 200,
					"NET_POOL_BALANCE" : 250,
					"BENEFIT_IN_POOL_CURRRENCY" : 250,
					"APPLIED_TIER" : 200 ,
					"POST" : 110
				};

				arrColsPref =
				[
					{
						"colId" : "DATE",
						"colDesc" : getLabel( 'summaryDate', 'Date' )
					},
					{
						"colId" : "CURRENCY",
						"colDesc" : getLabel( 'summaryCurrency', 'Currency' )
					},
					{
						"colId" : "NET_POOL_BALANCE",
						"colDesc" : getLabel( 'summaryNetPoolBalance', 'Pool Balance' )
					},
					{
						"colId" : "BENEFIT_IN_POOL_CURRRENCY",
						"colDesc" : getLabel( 'summaryBenefitInPool', 'Benefit' )
					},
					{
						"colId" : "APPLIED_TIER",
						"colDesc" : getLabel( 'summaryAppliedTier', 'Applied Tier' )
					},
					{
						"colId" : "POST",
						"colDesc" : getLabel( 'summaryPost', 'Post' )
					}
				];

				storeModel =
				{
					fields :
					[
						"DATE", "CURRENCY", "NET_POOL_BALANCE", "BENEFIT_IN_POOL_CURRRENCY","APPLIED_TIER",
						"POST","CR_INTEREST_PROFILERECKEY","DR_INTEREST_PROFILERECKEY"
					],
					proxyUrl : 'getTENetComputationSummaryDteWise.srvc',
					rootNode : 'd.commonDataTable'
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

				if( !Ext.isEmpty( arrColsPref ) )
				{
					
					if(arrColsPref.length > 0) {
						arrColsPref.splice(0, 0, {
							colType : 'emptyColumn',
							colId : 'emptyCol',
							colDesc : '',
							locked : true,
							resizable : false,
							draggable : false,
							width : 0.1,
							minWidth : 0.1
						});
					}
					
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.colHidden;
						cfgCol.sortable = false;
						cfgCol.locked = Ext.isEmpty(objCol.locked) ? false : objCol.locked;
						cfgCol.resizable = Ext.isEmpty(objCol.resizable) ? true : objCol.resizable;
						cfgCol.draggable = Ext.isEmpty(objCol.draggable) ? true : objCol.draggable;
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						if( !Ext.isEmpty( objCol.colId ) )
						{
							if( objCol.colId == 'NET_POOL_BALANCE' 
								|| objCol.colId == 'BENEFIT_IN_POOL_CURRRENCY' )
							{
								cfgCol.align = 'right';
							}
						}


						cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : Ext.isEmpty(objCol.width) ? 120 : objCol.width;
						if(!Ext.isEmpty(objCol.minWidth)) {
							cfgCol.minWidth = objCol.minWidth;
						}
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = value;
				if( value != '' )
				{
					if( colId === 'col_DATE' )
					{
						
					}				
				}
				return strRetValue;
			},
			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				pgSize = 100;
				computationSummaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					enableColumnHeaderMenu : false,
					showPager : true,
					showCheckBoxColumn : false,
					cls:'t7-grid',
					headerDockedItems : null,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					//margin : '18 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var computationSummaryView = me.getComputationSummaryViewItemRef();
				computationSummaryView.add( computationSummaryGrid );
				computationSummaryView.doLayout();
			}
		});
