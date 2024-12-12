Ext
	.define( 'GCP.controller.PoolViewAppDebitInterestController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.PoolViewAppDebitInterestGrid'
			],
			views :
			[
			 	'GCP.view.PoolViewInterestSummaryView'
			],
			refs :
			[
				{
					ref : 'appDebitGridViewRef',
					selector : 'poolViewInterestSummaryViewType poolViewAppDebitInterestGridType grid[itemId="debitAppGridViewMstItemId"]'
				},
				{
					ref : 'appDebitViewItemRef',
					selector : 'poolViewInterestSummaryViewType poolViewAppDebitInterestGridType panel[itemId="appDebitViewItemId"]'
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
						'poolViewAppDebitInterestGridType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						
						'poolViewAppDebitInterestGridType smartgrid' :
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

				strUrl = strUrl + "&$interestProfile=" + debitApportionmentProfile;

				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var appDebitPoolGrid = me.getAppDebitGridViewRef();
				var objConfigMap = me.getComputationPoolGridConfig();

				if( !Ext.isEmpty( appDebitPoolGrid ) )
					appDebitPoolGrid.destroy( true );

				var arrColsPref = null;
				var data = null;

				arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
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
					"frmAmt" : 160,
					"toAmt" : 160,
					"rateType" : 250,
					"baseRateCodeDesc" : 250,
					"baseRate" : 150,
					"spread" : 150,
					"interestRate" : 190
				};

				arrColsPref =
				[
					{
						"colId" : "frmAmt",
						"colDesc" : getLabel( 'fromAmt', 'Amount From' ),
						"colType" : "number"
					},
					{
						"colId" : "toAmt",
						"colDesc" : getLabel( 'toAmt', 'Amount To' ),
						"colType" : "number"
					},
					{
						"colId" : "rateType",
						"colDesc" : getLabel( 'rateType', 'Fixed or Variable' )
					},
					{
						"colId" : "baseRateCodeDesc",
						"colDesc" : getLabel( 'baseRateCodeDesc', 'Base Rate Type' )
					},
					{
						"colId" : "baseRate",
						"colDesc" : getLabel( 'interestRate', 'Base Rate(%)' ),
						"colType" : "number"
					},
					{
						"colId" : "spread",
						"colDesc" : getLabel( 'spread', 'Spread' ),
						"colType" : "number"
					},
					{
						"colId" : "interestRate",
						"colDesc" : getLabel( 'effectiveRate', 'Effective Rate(%)' ),
						"colType" : "number"
					}
				];

				storeModel =
				{
					fields :
					[
						'frmAmt', 'toAmt','rateType','baseRateCodeDesc','baseRate','spread','interestRate'
					],
					proxyUrl : 'getProfileInterestSlabs.srvc',
					rootNode : 'd.profile',
					totalRowsNode : 'count'
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
				appDebitPoolGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'debitAppGridViewMstItemId',
					itemId : 'debitAppGridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					showPager : false,
					enableColumnAutoWidth : true,
					showCheckBoxColumn : false,
					enableColumnHeaderMenu : false,
					padding : '5 0 0 0',
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					maxHeight : 280,
//					width : 980,
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var appDebitPoolView = me.getAppDebitViewItemRef();
				appDebitPoolView.add( appDebitPoolGrid );
				appDebitPoolView.doLayout();
			}
		});