Ext
	.define( 'GCP.controller.BankInterestSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.BankInterestSummaryGridView'
			],
			views :
			[
				'GCP.view.TENetComputationSummaryView'
			],
			refs :
			[
				{
					ref : 'bankInterestSummaryGridViewRef',
					selector : 'cpComputationSummaryViewType bankInterestSummaryGridViewType grid[itemId="bankInterestGridViewMstItemId"]'
				},
				{
					ref : 'bankInterestViewItemRef',
					selector : 'cpComputationSummaryViewType bankInterestSummaryGridViewType panel[itemId="bankInterestItemId"]'
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
						'bankInterestSummaryGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'bankInterestSummaryGridViewType smartgrid' :
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

				strUrl = strUrl + "&$filter=" + viewState + "&$selectedDate=" + selectedDate ;
				strUrl = strUrl + "&$isAccrualSettlement=" + isAccrualSettlement;
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var bankInterestSummaryGrid = me.getBankInterestSummaryGridViewRef()
				var objConfigMap = me.getBankInterestSummaryGridConfig();

				if( !Ext.isEmpty( bankInterestSummaryGrid ) )
					bankInterestSummaryGrid.destroy( true );

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
			
			getBankInterestSummaryGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"ACCOUNT" : 140,
					"BALANCE" : 120,
					"CURRENCY" :100,
					"POOL_CCY_BALANCE" :120,
					"APPLICABLE_TIER" : 120,
					"APPLICABLE_RATE" : 140,
					"APPLIED_TIER" : 120,
					"APPLIED_RATE" : 140,
					"APPLIED_INTEREST" : 180,
					"BENEFIT" : 180,
					"BENEFIT_IN_POOL_CURRENCY" : 180,
					"EXCHANGE_RATE" : 100
				};

				arrColsPref =
				[
					{
						"colId" : "ACCOUNT",
						"colDesc" : getLabel( 'summaryAccount', 'Account' )
					},
					{
						"colId" : "BALANCE",
						"colDesc" : getLabel( 'summaryBalance', 'Balance' )
					},
					{
						"colId" : "CURRENCY",
						"colDesc" : getLabel( 'currency', 'Currency' )
					},
					{
						"colId" : "EXCHANGE_RATE",
						"colDesc" : getLabel( 'summaryExchangeRate', 'Exchange Rate' )
					},
					{
						"colId" : "POOL_CCY_BALANCE",
						"colDesc" : getLabel( 'poolCcyBalance', 'Balance in Pool CCY' ),
						"colType" : "number"
					},
					{
						"colId" : "APPLICABLE_TIER",
						"colDesc" : getLabel( 'summaryApplicableTier', 'Applicable Tier' )
					},
					{
						"colId" : "APPLICABLE_RATE",
						"colDesc" : getLabel( 'summaryApplicableRate', 'Applicable Rate' )
					},
					{
						"colId" : "APPLIED_TIER",
						"colDesc" : getLabel( 'summaryApplicableTier', 'Applied Tier' )
					},
					{
						"colId" : "APPLIED_RATE",
						"colDesc" : getLabel( 'summaryApplicableRate', 'Applied Rate' )
					},
					{
						"colId" : "APPLIED_INTEREST",
						"colDesc" : getLabel( 'summaryApplicableInterest', 'Applied Interest' )
					},
					{
						"colId" : "BENEFIT",
						"colDesc" : getLabel( 'summaryApplicableInterest', 'Benefit' )
					},
					{
						"colId" : "BENEFIT_IN_POOL_CURRENCY",
						"colDesc" : getLabel( 'summaryApplicableInterest', 'Benefit In Pool Currency' )
					}
				];

				storeModel =
				{
					fields :
					[
						"ACCOUNT", "BALANCE","CURRENCY","POOL_CCY_BALANCE", "APPLICABLE_TIER", "APPLICABLE_RATE", 
						"APPLIED_TIER", "APPLIED_RATE", "APPLIED_INTEREST", "BENEFIT", "BENEFIT_IN_POOL_CURRENCY",
						"EXCHANGE_RATE", "DERIVED_PROFILE_RECKEY", 'DATE'
					],
					proxyUrl : 'getTENetComputationDteWiseBankInt.srvc',
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
							if( objCol.colId == 'BALANCE' || objCol.colId == 'APPLICABLE_RATE'
								|| objCol.colId == 'APPLIED_RATE' || objCol.colId == 'APPLIED_INTEREST'
								|| objCol.colId == 'BENEFIT' || objCol.colId == 'BENEFIT_IN_POOL_CURRENCY'
								|| objCol.colId == 'EXCHANGE_RATE' )
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
				if(  !Ext.isEmpty( value ) && value != '' )
				{
					if ( (colId == 'col_APPLICABLE_RATE' || colId == "col_APPLIED_RATE") && "0.0000" != value && '0' == entityType)
					{
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'DERIVED_PROFILE_RECKEY' ) + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
					}
				}
				return strRetValue;
			},
			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				var alertSummaryGrid = null;
				pgSize = 100;
				bankInterestSummaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'bankInterestGridViewMstItemId',
					itemId : 'bankInterestGridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					enableColumnHeaderMenu : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
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
				var bankInterestSummaryView = me.getBankInterestViewItemRef();
				bankInterestSummaryView.add( bankInterestSummaryGrid );
				bankInterestSummaryView.doLayout();
			}
		});
