Ext.define( 'GCP.controller.CBCreditGrossPoolController',
{
	extend : 'Ext.app.Controller',
	requires :
	[
		'Ext.ux.gcp.DateHandler', 'GCP.view.CBCreditGrossPoolGridView'
	],
	views :
	[
		'GCP.view.CBCreditGrossPoolGridView'
	],
	refs :
	[
		{
			ref : 'cbCreditGrossPoolGridViewRef',
			selector : 'cbCreditGrossSummaryViewType cbCreditGrossPoolGridViewType grid[itemId="poolGridViewMstItemId"]'
		},
		{
			ref : 'cbCreditGrossSummaryViewItemRef',
			selector : 'cbCreditGrossSummaryViewType cbCreditGrossPoolGridViewType panel[itemId="computationPoolViewItemId"]'
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
			'cbCreditGrossPoolGridViewType' :
			{
				render : function( panel )
				{
					me.handleSmartGridConfig();
				}
			},

			'cbCreditGrossPoolGridViewType smartgrid' :
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
		var cbCreditGrossPoolGrid = me.getCbCreditGrossPoolGridViewRef();
		var objConfigMap = me.getComputationPoolGridConfig();

		if( !Ext.isEmpty( cbCreditGrossPoolGrid ) )
			cbCreditGrossPoolGrid.destroy( true );

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

		if( benefitCal == 'Y' )
		{
			objWidthMap =
			{
				"POOLDESC" : 150,
				"CURRENCY" : 150,
				"TOTAL_CREDIT_INTEREST" : 200,
				"SUM_ACC_LVL_INT" : 300,
				"TOTAL_CREDIT_BENEFIT" : 180,
				"SUM_FIRST_LVL_APPORT" : 232
			};
		}
		else
		{
			objWidthMap =
			{
				"POOLDESC" : 240,
				"CURRENCY" : 240,
				"TOTAL_CREDIT_INTEREST" : 246,
				"SUM_ACC_LVL_INT" : 240,
				"SUM_FIRST_LVL_APPORT" : 245
			};
		}
		

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
				"colId" : "TOTAL_CREDIT_INTEREST",
				"colDesc" : getLabel( 'poolTotalNetInterest', 'Total Credit Interest' ),
				"colType" : "number"
			},
			{
				"colId" : "SUM_ACC_LVL_INT",
				"colDesc" : getLabel( 'poolAccLvlInterest', 'Sum Account Level Interest(Debit)' ),
				"colType" : "number"
			},
			{
				"colId" : "TOTAL_CREDIT_BENEFIT",
				"colDesc" : getLabel( 'poolTotalCreditBenefit', 'Total Credit Benefit' ),
				"colType" : "number",
				"colHidden" : benefitCal == 'Y' ? false : true
			},
			{
				"colId" : "SUM_FIRST_LVL_APPORT",
				"colDesc" : getLabel( 'poolApportionment', 'Sum First Level Apportionment Cr' ),
				"colType" : "number"
			}
		];

		storeModel =
		{
			fields :
			[
				'POOLDESC', 'CURRENCY', 'TOTAL_CREDIT_INTEREST', 'SUM_ACC_LVL_INT', 'TOTAL_CREDIT_BENEFIT',
				'SUM_FIRST_LVL_APPORT'
			],
			proxyUrl : 'getCBCreditGrossPool.srvc',
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
			stateful : false,
			showEmptyRow : false,
			cls:'t7-grid',
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
		var computationPoolView = me.getCbCreditGrossSummaryViewItemRef();
		computationPoolView.add( computationPoolGrid );
		computationPoolView.doLayout();
	}
} );
