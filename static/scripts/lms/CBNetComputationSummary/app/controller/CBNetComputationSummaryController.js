Ext
	.define( 'GCP.controller.CBNetComputationSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CBNetComputationSummaryGrid'
			],
			views :
			[
				'GCP.view.CBNetComputationSummaryView'
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

				strUrl = strUrl + "&$viewState=" +viewState;
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

				if( benefitCal == 'Y')
				{
					objWidthMap =
					{
						"DATE" : 100,
						"CURRENCY" : 100,
						"NET_POOL_BAL" : 150,
						"APPLIED_RATE" : 250,
						"POOL_INT_AMNT" : 250,
						"INTEREST_ACCRUED" : 170,
						"INTEREST_SETTLED" : 170,
						"BENEFIT" : 110,
						"FIRST_LVL_APPORT" : 150,
						"POST" : 80
					};
				}
				else
				{
					objWidthMap =
					{
						"DATE" : 100,
						"CURRENCY" : 100,
						"NET_POOL_BAL" : 150,
						"APPLIED_RATE" : 250,
						"POOL_INT_AMNT" : 250,
						"INTEREST_ACCRUED" : 170,
						"INTEREST_SETTLED" : 170,
						"FIRST_LVL_APPORT" : 150,
						"POST" : 80
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
						"colId" : "NET_POOL_BAL",
						"colDesc" : getLabel( 'summaryNetPoolBalance', 'Net Pool Balance' ),
						"colType" : "number"
					},
					{
						"colId" : "APPLIED_RATE",
						"colDesc" : getLabel( 'summaryAppliedRateBal', 'Applied Rate For Net Pool Balances' ),
						"colType" : "number"
					},
					{
						"colId" : "POOL_INT_AMNT",
						"colDesc" : getLabel( 'summaryPoolIntAmnt', 'Pool Interest Amount On Net Balance' ),
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
						"colId" : "BENEFIT",
						"colDesc" : getLabel( 'summaryBenefit', 'Benefit' ),
						"colType" : "number",
						"colHidden" : benefitCal == 'Y' ? false : true
					},
					{
						"colId" : "FIRST_LVL_APPORT",
						"colDesc" : getLabel( 'summaryApportionment', 'Total First Level Apportionment' ),
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
						'DATE', 'CURRENCY', 'NET_POOL_BAL','APPLIED_RATE',
						'POOL_INT_AMNT', 'INTEREST_ACCRUED','INTEREST_SETTLED','BENEFIT',
						'FIRST_LVL_APPORT', 'POST','DERIVED_PROFILE_RECKEY'
					],
					proxyUrl : 'getCBNetComputationSummary.srvc',
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
					else if( colId === 'col_APPLIED_RATE' &&  "0.0000" != value && '0' == entityType)
					{
						recKey = record.get( 'DERIVED_PROFILE_RECKEY');
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + recKey + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
					stateful : false,
					cls : 't7-grid',
					showEmptyRow : false,
					enableColumnHeaderMenu : false,
					hideRowNumbererColumn : true,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					headerDockedItems : null,
					minHeight : 140,
					maxHeight : 280,
					margin : '0 0 0 0',
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
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
