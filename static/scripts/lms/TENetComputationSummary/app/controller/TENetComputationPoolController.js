Ext
	.define( 'GCP.controller.TENetComputationPoolController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.TENetComputationPoolInfoGridView'
			],
			views :
			[
			 	'GCP.view.TENetComputationSummaryView'
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

				strUrl = strUrl + "&$filter=" + viewState;

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

				objWidthMap =
				{
					"POOLDESC" : 197,
					"CURRENCY" : 199,
					"BENFIT" : 197
				};

				arrColsPref =
				[
					{
						"colId" : "POOLDESC",
						"colDesc" : getLabel( 'poolDesc', 'Pool Description' )
					},
					{
						"colId" : "CURRENCY",
						"colDesc" : getLabel( 'poolCurrency', 'Currency' )
					},
					{
						"colId" : "BENFIT",
						"colDesc" : getLabel( 'poolBenefit', 'Benefit' )
					}
				];

				storeModel =
				{
					fields :
					[
						'POOLDESC', 'CURRENCY','BENFIT'
					],
					proxyUrl : 'getTENetComputationPool.srvc',
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
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.hidden = objCol.colHidden;
						cfgCol.sortable = false;
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
							if( cfgCol.colType === "number" )
								cfgCol.align = 'right';
						}
						if( !Ext.isEmpty( objCol.colId ) )
						{
							if( objCol.colId == 'BENFIT' )
							{
								cfgCol.align = 'right';
							}
						}

						cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
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
					autoDestroy : true,
					cls:'t7-grid',
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					showPager : true,
					showCheckBoxColumn : false,
					autoExpandLastColumn : false,
					headerDockedItems : null,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					//margin : '18 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var computationPoolView = me.getComputationSummaryViewItemRef();
				computationPoolView.add( computationPoolGrid );
				computationPoolView.doLayout();
			}
		});
