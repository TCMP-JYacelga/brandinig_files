Ext
	.define( 'GCP.controller.CBGrossSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CBGrossSummaryGrid'
			],
			views :
			[
				'GCP.view.CBGrossSummaryView'
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
				
				GCP.getApplication().on(
						{
							callDateWisePage : function( selectedDate )
							{
								me.goToDateWisePage( selectedDate );
							}
						} );
				
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

				strUrl = strUrl + "&$filter=" + viewState;
				strUrl = strUrl + "&$isAccrualSettlement=" + "N";

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
						"GROSS_CREDIT_POOL_BALANCE" : 175,
						"GROSS_DEBIT_POOL_BALANCE" : 175,
						"APPLIED_RATE_FOR_CREDIT" : 250,
						"APPLIED_RATE_FOR_DEBIT" : 250,
						"INTEREST_AMOUNT_GROSS_CREDIT" : 200,
						"INTEREST_AMOUNT_GROSS_DEBIT" : 200,
						"INTEREST_ACCRUED" : 120,
						"INTEREST_SETTLED" : 120,
						"CREDIT_BENEFIT" : 120,
						"DEBIT_BENEFIT" : 120,
						"FIRST_LVL_APPORT_CR" : 260,
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
						"GROSS_CREDIT_POOL_BALANCE" : 175,
						"GROSS_DEBIT_POOL_BALANCE" : 175,
						"APPLIED_RATE_FOR_CREDIT" : 250,
						"APPLIED_RATE_FOR_DEBIT" : 250,
						"INTEREST_AMOUNT_GROSS_CREDIT" : 200,
						"INTEREST_AMOUNT_GROSS_DEBIT" : 200,
						"INTEREST_ACCRUED" : 120,
						"INTEREST_SETTLED" : 120,
						"FIRST_LVL_APPORT_CR" : 260,
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
						"colId" : "GROSS_CREDIT_POOL_BALANCE",
						"colDesc" : getLabel( 'summaryGrossCreditPoolBalance', 'Gross Credit Pool Balance' )
					},
					{
						"colId" : "GROSS_DEBIT_POOL_BALANCE",
						"colDesc" : getLabel( 'summaryGrossDebitPoolBalance', 'Gross Debit Pool Balance' )
					},
					{
						"colId" : "APPLIED_RATE_FOR_CREDIT",
						"colDesc" : getLabel( 'summaryNetPoolBalance', 'Applied rate for Gross Credit Balances' )
					},
					{
						"colId" : "INTEREST_AMOUNT_GROSS_CREDIT",
						"colDesc" : getLabel( 'summaryAcctLvlInterestCr', 'Pool Credit Interest Amount' )
					},					
					{
						"colId" : "APPLIED_RATE_FOR_DEBIT",
						"colDesc" : getLabel( 'summaryNetPoolBalance', 'Applied rate for Gross Debit Balances' )
					},
					{
						"colId" : "INTEREST_AMOUNT_GROSS_DEBIT",
						"colDesc" : getLabel( 'summaryAcctLvlInterestCr', 'Pool Debit Interest Amount' )
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
						"colId" : "CREDIT_BENEFIT",
						"colDesc" : getLabel( 'summaryCreditBenefit', 'Credit Benefit' ),
						"colHidden" : benefitCal == 'Y' ? false : true
					},
					{
						"colId" : "DEBIT_BENEFIT",
						"colDesc" : getLabel( 'summaryDebitBenefit', 'Debit Benefit' ),
						"colHidden" : benefitCal == 'Y' ? false : true
					},
					{
						"colId" : "FIRST_LVL_APPORT_CR",
						"colDesc" : getLabel( 'summaryCRApportionment', 'Total First Level Approtionment Cr' )
					},
					{
						"colId" : "FIRST_LVL_APPORT_DR",
						"colDesc" : getLabel( 'summaryDrApportionment', 'Total First Level Approtionment Dr' )
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
						"DATE", "CURRENCY", "GROSS_CREDIT_POOL_BALANCE", "GROSS_DEBIT_POOL_BALANCE",
						"APPLIED_RATE_FOR_CREDIT", "APPLIED_RATE_FOR_DEBIT", "INTEREST_AMOUNT_GROSS_CREDIT",
						"INTEREST_AMOUNT_GROSS_DEBIT", "INTEREST_ACCRUED", "INTEREST_SETTLED", "CREDIT_BENEFIT",
						"DEBIT_BENEFIT", "FIRST_LVL_APPORT_CR", "FIRST_LVL_APPORT_DR", "POST",
						"CR_INTEREST_PROFILERECKEY", "DR_INTEREST_PROFILERECKEY"
					],
					proxyUrl : 'getCBGrossSummary.srvc',
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
							if( cfgCol.colId === "GROSS_DEBIT_POOL_BALANCE" || cfgCol.colId === "GROSS_CREDIT_POOL_BALANCE"
								|| cfgCol.colId === "APPLIED_RATE_FOR_CREDIT" || cfgCol.colId === "APPLIED_RATE_FOR_DEBIT"
								|| cfgCol.colId === "INTEREST_AMOUNT_GROSS_DEBIT" || cfgCol.colId === "INTEREST_AMOUNT_GROSS_CREDIT"
								|| cfgCol.colId === "DEBIT_BENEFIT" || cfgCol.colId === "CREDIT_BENEFIT"
								|| cfgCol.colId === "FIRST_LVL_APPORT_DR" || cfgCol.colId === "FIRST_LVL_APPORT_CR" )
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
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = value;
				if( !Ext.isEmpty( value ) && value != '' )
				{
					if( colId === 'col_DATE' )
					{
						strRetValue = '<a href="#" onclick="callToDateWisePage( \''
							+ record.get( 'DATE' ) + '\' )"><u>'+ value + '</u></a>';
					}
					else if (colId == 'col_APPLIED_RATE_FOR_CREDIT' &&  "0.0000" != value && '0' == entityType)
					{
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'CR_INTEREST_PROFILERECKEY' ) + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
					}
					else if (colId == 'col_APPLIED_RATE_FOR_DEBIT' &&  "0.0000" != value && '0' == entityType)
					{
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'DR_INTEREST_PROFILERECKEY' ) + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
					}
				}
				return strRetValue;
			},
			goToDateWisePage : function( selectedDate )
			{
				var me = this;
				var form;
				var strUrl = 'getCBGrossDateWiseData.srvc';

				strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&$selectedDate="+selectedDate ;
				strUrl = strUrl + "&$isAccrualSettlement=" + "N";
				strUrl = strUrl + "&" + csrfTokenName + "="	+ csrfTokenValue;
				form = document.createElement( 'FORM' );
				document.body.appendChild(form);
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.action = strUrl;
				form.submit();
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
					cls : 't7-grid',
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					enableColumnHeaderMenu : false,
					showPager : false,
					showCheckBoxColumn : false,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					maxHeight : 280,
					//margin : '18 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel,
					headerDockedItems : null
				} );
				var computationSummaryView = me.getComputationSummaryViewItemRef();
				computationSummaryView.add( computationSummaryGrid );
				computationSummaryView.doLayout();
			}
		});

function callToDateWisePage( selectedDate )
{
	GCP.getApplication().fireEvent( 'callDateWisePage', selectedDate );
}
