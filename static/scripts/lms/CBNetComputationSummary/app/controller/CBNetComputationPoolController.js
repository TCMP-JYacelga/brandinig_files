Ext
	.define( 'GCP.controller.CBNetComputationPoolController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CBNetComputationPoolInfoGridView'
			],
			views :
			[
			 	'GCP.view.CBNetComputationSummaryView'
			],
			refs :
			[
				{
					ref : 'cpComputationPoolGridViewRef',
					selector : 'cpComputationSummaryViewType cpComputationPoolGridViewType grid[itemId="poolGridViewMstItemId"]'
				},
				{
					ref : 'computationSummaryViewItemRef',
					selector : 'cpComputationSummaryViewType cpComputationPoolGridViewType panel[itemId="computationPoolViewItemId"]'
				}
			],
			config :
			{
				filterData : [],
				dateHandler : null
			},
			init : function()
			{
				var me = this;
				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				
				me.control(
					{
						'cpComputationPoolGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						
						'cpComputationPoolGridViewType smartgrid' :
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

				strUrl = strUrl + "&$viewState=" +viewState;

				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var computationPoolGrid = me.getCpComputationPoolGridViewRef();
				var objConfigMap = me.getComputationPoolGridConfig();

				if( !Ext.isEmpty( computationPoolGrid ) )
					computationPoolGrid.destroy( true );

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
			
			getComputationPoolGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				if( benefitCal == 'Y')
				{
					objWidthMap =
					{
						"POOLDESC" : 150,
						"CURRENCY" : 150,
						"TOTAL_NET_INTEREST" : 175,
						"TOTAL_NET_BENEFIT" : 175,
						"SUM_FIRST_LVL_APPORT" : 210
					};
				}
				else
				{
					objWidthMap =
					{
						"POOLDESC" : 150,
						"CURRENCY" : 150,
						"TOTAL_NET_INTEREST" : 175,
						"SUM_FIRST_LVL_APPORT" : 210
					};
				}

				arrColsPref =
				[
					{
						colType : 'emptyColumn',
						colId : 'emptyCol',
						colDesc : '',
						locked : true,
						resizable : false,
						draggable : false,
						width : 0.1,
						minWidth : 0.1
					},
					{
						"colId" : "POOLDESC",
						"colDesc" : getLabel( 'poolDesc', 'Pool Description' )
					},
					{
						"colId" : "CURRENCY",
						"colDesc" : getLabel( 'poolCurrency', 'Currency' )
					},
					{
						"colId" : "TOTAL_NET_INTEREST",
						"colDesc" : getLabel( 'poolTotalNetInterest', 'Total Net Interest' ),
						"colType" : "number"
					},
					{
						"colId" : "TOTAL_NET_BENEFIT",
						"colDesc" : getLabel( 'poolTotalBenefit', 'Total Benefit' ),
						"colType" : "number",
						"colHidden" : benefitCal == 'Y' ? false : true
					},
					{
						"colId" : "SUM_FIRST_LVL_APPORT",
						"colDesc" : getLabel( 'poolApportionment', 'Sum First Level Apportionment' ),
						"colType" : "number"
					}
				];

				storeModel =
				{
					fields :
					[
						'POOLDESC', 'CURRENCY','TOTAL_NET_INTEREST','TOTAL_NET_BENEFIT','SUM_FIRST_LVL_APPORT'
						//'identifier', 'history', '__metadata',
					],
					proxyUrl : 'getCBNetComputationPool.srvc',
					rootNode : 'd.commonDataTable'
				//	totalRowsNode : 'd.__count'
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
						cfgCol.draggable = Ext.isEmpty(objCol.draggable) ? false : objCol.draggable;
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}

						cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : Ext.isEmpty(objCol.width) ? 120 : objCol.width;
						if (!Ext.isEmpty(objCol.minWidth)) {
							cfgCol.minWidth = objCol.minWidth;
						}
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},

			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				pgSize = 100;
				computationPoolGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'poolGridViewMstItemId',
					itemId : 'poolGridViewMstItemId',
					pageSize : pgSize,
					enableColumnHeaderMenu : false,
					autoDestroy : true,
					stateful : false,
					cls:'t7-grid',
					headerDockedItems : null,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					margin : '0 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var computationPoolView = me.getComputationSummaryViewItemRef();
				computationPoolView.add( computationPoolGrid );
				computationPoolView.doLayout();
			}
		});
