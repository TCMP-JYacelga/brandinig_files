Ext.define( 'GCP.controller.CPNetPoolController',
{
	extend : 'Ext.app.Controller',
	requires :
	[
		'Ext.ux.gcp.DateHandler', 'GCP.view.CPNetPoolGridView'
	],
	views :
	[
	 	'GCP.view.CPNetSummaryView'
	],
	refs :
	[
		{
			ref : 'cpNetPoolGridViewRef',
			selector : 'cpNetSummaryViewType cpNetPoolGridViewType grid[itemId="poolGridViewMstItemId"]'
		},
		{
			ref : 'computationPoolViewItemRef',
			selector : 'cpNetSummaryViewType cpNetPoolGridViewType panel[itemId="computationPoolViewItemId"]'
		}
	],
	config :
	{
		dateHandler : null
	},
	init : function()
	{
		var me = this;
		this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );

		me.control(
		{
			'cpNetPoolGridViewType' :
			{
				render : function( panel )
				{
					me.handleSmartGridConfig();
				}
			},

			'cpNetPoolGridViewType smartgrid' :
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

		strUrl = strUrl + "&$viewState=" + viewState;

		strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

		grid.loadGridData( strUrl, null );
	},
	handleSmartGridConfig : function()
	{
		var me = this;
		var cpNetPoolGrid = me.getCpNetPoolGridViewRef();
		var objConfigMap = me.getComputationPoolGridConfig();

		if( !Ext.isEmpty( cpNetPoolGrid ) )
			cpNetPoolGrid.destroy( true );

		var arrColsPref = null;
		var data = null;

		if( !Ext.isEmpty( objGridViewPref ) )
		{
			data = Ext.decode( objGridViewPref );
			objPref = data[ 0 ];
			arrColsPref = objPref.gridCols;
			arrCols = me.getColumns( arrColsPref, objConfigMap );
		}
		else
			if( objDefaultGridViewPref )
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
			"POOLDESC" : 200,
			"CURRENCY" : 150,
			"TOTAL_NET_INTEREST" : 220,
			"TOTAL_BENEFIT" : 200
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
				"colId" : "TOTAL_NET_INTEREST",
				"colDesc" : getLabel( 'poolTotalNetInterest', 'Total Net Interest' ),
				"colType" : "number"
			},
			{
				"colId" : "TOTAL_BENEFIT",
				"colDesc" : getLabel( 'poolTotalCreditBenefit', 'Total Benefit' ),
				"colType" : "number"
			}
		];

		storeModel =
		{
			fields :
			[
				'POOLDESC', 'CURRENCY', 'TOTAL_NET_INTEREST', 'TOTAL_BENEFIT'
			],
			proxyUrl : 'getCPNetComputationPool.srvc',
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
			stateful : false,
			showEmptyRow : false,
			hideRowNumbererColumn : true,
			showSummaryRow : false,
			showPager : false,
			showCheckBoxColumn : false,
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
		var computationPoolView = me.getComputationPoolViewItemRef();
		computationPoolView.add( computationPoolGrid );
		computationPoolView.doLayout();
	}
} );
