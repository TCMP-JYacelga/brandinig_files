Ext
	.define( 'GCP.controller.CBDebitGrossDetailController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CBDebitGrossSummaryGrid'
			],
			views :
			[
				'GCP.view.CBDebitGrossSummaryView'
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

				strUrl = strUrl + "&$filter=" + viewState  + "&$selectedDate=" + selectedDate ;

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

				if( benefitCal == 'Y' )
				{
					objWidthMap =
					{
						"DATE" : 100,
						"CURRENCY" : 75,
						"GROSS_DEBIT_POOL_BALANCE" : 175,
						"APPLIED_RATE" : 250,
						"INTEREST_AMOUNT_GROSS_DEBIT" : 300,
						"TOTAL_ACCT_LVL_INTEREST_CR" : 300,
						"INTEREST_ACCRUED" : 120,
						"INTEREST_SETTLED" : 120,
						"DEBIT_BENEFIT" : 120,
						"FIRST_LVL_APPORT_DR" : 260,
						"POST" : 70
					};
				}
				else
				{
					objWidthMap =
					{
						"DATE" : 100,
						"CURRENCY" : 75,
						"GROSS_DEBIT_POOL_BALANCE" : 175,
						"APPLIED_RATE" : 250,
						"INTEREST_AMOUNT_GROSS_DEBIT" : 300,
						"TOTAL_ACCT_LVL_INTEREST_CR" : 300,
						"INTEREST_ACCRUED" : 120,
						"INTEREST_SETTLED" : 120,
						"FIRST_LVL_APPORT_DR" : 260,
						"POST" : 70
					};
				}
				
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
						"colId" : "GROSS_DEBIT_POOL_BALANCE",
						"colDesc" : getLabel( 'summaryGrossDebitPoolBalance', 'Gross Debit Pool Balance' )
					},
					{
						"colId" : "APPLIED_RATE",
						"colDesc" : getLabel( 'summaryNetPoolBalance', 'Applied Rate For Gross Debit Balances' )
					},
					{
						"colId" : "INTEREST_AMOUNT_GROSS_DEBIT",
						"colDesc" : getLabel( 'summaryAcctLvlInterestCr', 'Pool Interest Amount On Gross Debit Balance' )
					},					
					{
						"colId" : "TOTAL_ACCT_LVL_INTEREST_CR",
						"colDesc" : getLabel( 'summaryAcctLvlInterestCr', 'Sum Account Level Interest (Cr)' )
					},					
					{
						"colId" : "INTEREST_ACCRUED",
						"colDesc" : getLabel( 'summaryInterestAccrued', 'Interest Accrued' )
					},
					{
						"colId" : "INTEREST_SETTLED",
						"colDesc" : getLabel( 'summaryInterestSettled', 'Interest Settled' )
					},
					{
						"colId" : "DEBIT_BENEFIT",
						"colDesc" : getLabel( 'summaryBenefit', 'Debit Benefit' ),
						"colHidden" : benefitCal == 'Y' ? false : true
					},
					{
						"colId" : "FIRST_LVL_APPORT_DR",
						"colDesc" : getLabel( 'summaryApportionment', 'Total First Level Approtionment Dr' )
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
						"DATE", "CURRENCY", "GROSS_DEBIT_POOL_BALANCE", "APPLIED_RATE","INTEREST_AMOUNT_GROSS_DEBIT", "TOTAL_ACCT_LVL_INTEREST_CR",
						"INTEREST_ACCRUED", "INTEREST_SETTLED", "DEBIT_BENEFIT", "FIRST_LVL_APPORT_DR", "POST","CR_INTEREST_PROFILERECKEY","DR_INTEREST_PROFILERECKEY"
					],
					proxyUrl : 'getCBDebitGrossSummaryDteWise.srvc',
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
							if( cfgCol.colId === 'GROSS_DEBIT_POOL_BALANCE' || cfgCol.colId === 'APPLIED_RATE'
								|| cfgCol.colId === 'INTEREST_AMOUNT_GROSS_DEBIT'
								|| cfgCol.colId === 'TOTAL_ACCT_LVL_INTEREST_CR' || cfgCol.colId === 'DEBIT_BENEFIT'
								|| cfgCol.colId === 'FIRST_LVL_APPORT_DR' )
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
				if( !Ext.isEmpty( value ) && value != '' )
				{
					if ( colId == 'col_APPLIED_RATE' && "0.0000" != value && '0' == entityType)
					{
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'DR_INTEREST_PROFILERECKEY' ) + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
					enableColumnHeaderMenu : false,
					showSummaryRow : false,
					showPager : true,
					showCheckBoxColumn : false,
					cls:'t7-grid',
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					//margin : '18 0 0 0',
					headerDockedItems : null,
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var computationSummaryView = me.getComputationSummaryViewItemRef();
				computationSummaryView.add( computationSummaryGrid );
				computationSummaryView.doLayout();
			}
		});