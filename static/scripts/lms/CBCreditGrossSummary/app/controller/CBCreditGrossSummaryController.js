Ext
	.define( 'GCP.controller.CBCreditGrossSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CBCreditGrossSummaryGridView'
			],
			views :
			[
			 	'GCP.view.CBCreditGrossSummaryGridView'
			],
			refs :
			[
				{
					ref : 'cbCreditGrossGridViewRef',
					selector : 'cbCreditGrossSummaryViewType cbCreditGrossSummaryGridViewType grid[itemId="summaryGridViewItemId"]'
				},
				{
					ref : 'computationSummaryViewItemRef',
					selector : 'cbCreditGrossSummaryViewType cbCreditGrossSummaryGridViewType panel[itemId="computationSummaryViewItemId"]'
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
						'cbCreditGrossSummaryGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'cbCreditGrossSummaryGridViewType smartgrid' :
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
				strUrl = strUrl + "&$isAccrualSettlement=" + "N";
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var computationSummaryGrid = me.getCbCreditGrossGridViewRef();
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
						"CURRENCY" : 100,
						"GROSS_CREDIT_POOL_BAL" : 230,
						"APPLIED_RATE" : 230,
						"INTEREST_AMNT_GROSS_CR" : 210,
						"SUM_ACC_LVL_INTEREST_DR" : 230,
						"INTEREST_ACCRUED" : 130,
						"INTEREST_SETTLED" : 130,
						"CREDIT_BENEFIT" : 110,
						"FIRST_LVL_APPORT" : 230,
						"POST" : 70
					};
				}
				else
				{
					objWidthMap =
					{
						"DATE" : 100,
						"CURRENCY" : 100,
						"GROSS_CREDIT_POOL_BAL" : 230,
						"APPLIED_RATE" : 230,
						"INTEREST_AMNT_GROSS_CR" : 210,
						"SUM_ACC_LVL_INTEREST_DR" : 230,
						"INTEREST_ACCRUED" : 130,
						"INTEREST_SETTLED" : 130,
						"FIRST_LVL_APPORT" : 230,
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
						"colId" : "GROSS_CREDIT_POOL_BAL",
						"colDesc" : getLabel( 'summaryNetPoolBalance', 'Gross Credit Pool Balance' ),
						"colType" : "number"
					},
					{
						"colId" : "APPLIED_RATE",
						"colDesc" : getLabel( 'summaryNetPoolBalance', 'Applied Rate For Gross Credit Balance' ),
						"colType" : "number"
					},
					{
						"colId" : "INTEREST_AMNT_GROSS_CR",
						"colDesc" : getLabel( 'summarytPoolIntAmnt', 'Pool Credit Interest Amount' ),
						"colType" : "number"
					},
					{
						"colId" : "SUM_ACC_LVL_INTEREST_DR",
						"colDesc" : getLabel( 'summarytPoolIntAmnt', 'Sum Account Level Interest(Debit)' ),
						"colType" : "number"
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
						"colDesc" : getLabel( 'summaryBenefit', 'Credit Benefit' ),
						"colType" : "number",
						"colHidden" : benefitCal == 'Y' ? false : true
					},
					{
						"colId" : "FIRST_LVL_APPORT",
						"colDesc" : getLabel( 'summaryApportionment', 'Total First Level Apportionment Cr' ),
						"colType" : "number"
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
						'DATE', 'CURRENCY', 'GROSS_CREDIT_POOL_BAL','APPLIED_RATE',
						'INTEREST_AMNT_GROSS_CR', 'SUM_ACC_LVL_INTEREST_DR', 'INTEREST_ACCRUED','INTEREST_SETTLED','CREDIT_BENEFIT',
						'FIRST_LVL_APPORT', 'POST', 'DR_INT_PROF_RECKEY', 'CR_INT_PROF_RECKEY'
					],
					proxyUrl : 'getCBCreditGrossSummary.srvc',
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
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = value;
				var recKey = null;
				if( !Ext.isEmpty( value ) && value != ''  )
				{
					if( colId === 'col_DATE' )
					{
						
						strRetValue = '<a href="#" onclick="callToDateWisePage( \''
							+ record.get( 'DATE' ) + '\' )"><u>'+ value + ' </u></a>';
					}
					else if( colId === 'col_APPLIED_RATE' &&  "0.0000" != value && '0' == entityType )
					{
						var creditProfKey = record.get( 'CR_INT_PROF_RECKEY' );
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + creditProfKey + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
					}
				}
				return strRetValue;
			},
			goToDateWisePage : function( selectedDate )
			{
				var me = this;
				var form;
				var strUrl = 'getComputationDtWiseData.srvc';

				strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&$selectedDate="+selectedDate ; 
				strUrl = strUrl + "&$isAccrualSettlement=" + "N";
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit(); 
			},

			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				pgSize = 100;
				computationSummaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'summaryGridViewItemId',
					itemId : 'summaryGridViewItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					cls:'t7-grid',
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					headerDockedItems : null,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
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

function callToDateWisePage( selectedDate )
{
	GCP.getApplication().fireEvent( 'callDateWisePage', selectedDate );
}
