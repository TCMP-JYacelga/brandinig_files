Ext
	.define( 'GCP.controller.CPNetSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CPNetSummaryGridView'
			],
			views :
			[
			 	'GCP.view.CPNetSummaryView'
			],
			refs :
			[
				{
					ref : 'cpNetGridViewRef',
					selector : 'cpNetSummaryViewType cpNetSummaryGridViewType grid[itemId="summaryGridViewItemId"]'
				},
				{
					ref : 'computationSummaryViewItemRef',
					selector : 'cpNetSummaryViewType cpNetSummaryGridViewType panel[itemId="computationSummaryViewItemId"]'
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
						'cpNetSummaryGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'cpNetSummaryGridViewType smartgrid' :
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
				var computationSummaryGrid = me.getCpNetGridViewRef();
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

				objWidthMap =
				{
					"DATE" : 100,
					"CURRENCY" : 100,
					"NET_POOL_BAL" : 190,
					"APPLIED_RATE" : 200,
					"POOL_INTEREST_AMNT" : 200,
					"ALLOCATION_METHOD" : 180,
					"BENEFIT" : 130,
					"BENEFIT_ACCRUED" : 150,
					"BENEFIT_SETTLED" : 150,
					"POST" : 90
				};

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
						"colDesc" : getLabel( 'summaryNetPoolBalance', 'Applicable Rate' ),
						"colType" : "number"
					},
					{
						"colId" : "POOL_INTEREST_AMNT",
						"colDesc" : getLabel( 'summarytPoolIntAmnt', 'Applicable Interest' ),
						"colType" : "number"
					},
					{
						"colId" : "ALLOCATION_METHOD",
						"colDesc" : getLabel( 'summarytPoolIntAmnt', 'Allocation Method' )
					},
					{
						"colId" : "BENEFIT",
						"colDesc" : getLabel( 'summaryInterestAccrued', 'Benefit' ),
						"colType" : "number"
					},
					{
						"colId" : "BENEFIT_ACCRUED",
						"colDesc" : getLabel( 'summaryBenefitAccrued', 'Benefit Accrued' )						
					},
					{
						"colId" : "BENEFIT_SETTLED",
						"colDesc" : getLabel( 'summaryBenefitSettled', 'Benefit Settled' )
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
						'POOL_INTEREST_AMNT', 'ALLOCATION_METHOD', 'BENEFIT', 'BENEFIT_ACCRUED','BENEFIT_SETTLED','POST','DERIVED_PROFILE_RECKEY'
					],
					proxyUrl : 'getCPNetComputationSummary.srvc',
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
						recKey = null;
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

				strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&$selectedDate="+selectedDate;
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
					id : 'summaryGridViewItemId',
					itemId : 'summaryGridViewItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					cls : 't7-grid',
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
				var computationSummaryView = me.getComputationSummaryViewItemRef();
				computationSummaryView.add( computationSummaryGrid );
				computationSummaryView.doLayout();
			}
		});

function callToDateWisePage( selectedDate )
{
	GCP.getApplication().fireEvent( 'callDateWisePage', selectedDate );
}
