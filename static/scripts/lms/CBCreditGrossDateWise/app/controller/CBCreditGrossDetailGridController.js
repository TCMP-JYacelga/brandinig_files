Ext
	.define( 'GCP.controller.CBCreditGrossDetailGridController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CBCreditGrossDetailGridView'
			],
			views :
			[
			 	'GCP.view.CBCreditGrossDateWiseView'
			],
			refs :
			[
				{
					ref : 'cbCreditGrossDetailGridViewRef',
					selector : 'cbCreditGrossDateWiseViewType cbCreditGrossDetailGridViewType grid[itemId="computationDetailGridViewMstId"]'
				},
				{
					ref : 'computationDetailItemRef',
					selector : 'cbCreditGrossDateWiseViewType cbCreditGrossDetailGridViewType panel[itemId="computationDetailItemId"]'
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
						'cbCreditGrossDetailGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'cbCreditGrossDetailGridViewType smartgrid' :
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

				strUrl = strUrl + "&$viewState=" + viewState + "&$selectedDate=" + selectedDate ;
				strUrl = strUrl + "&$isAccrualSettlement=" + isAccrualSettlement;
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var computationDetailSummaryGrid = me.getCbCreditGrossDetailGridViewRef();
				var objConfigMap = me.getComputationDetailSummaryGridConfig();

				if( !Ext.isEmpty( computationDetailSummaryGrid ) )
					computationDetailSummaryGrid.destroy( true );

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
			
			getComputationDetailSummaryGridConfig : function()
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
						"APPLIED_RATE" : 270,
						"INTEREST_AMNT_GROSS_CR" : 200,
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
						"APPLIED_RATE" : 270,
						"INTEREST_AMNT_GROSS_CR" : 200,
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
						'SUM_ACC_LVL_INTEREST_DR', 'INTEREST_ACCRUED','INTEREST_SETTLED','CREDIT_BENEFIT',
						'FIRST_LVL_APPORT', 'POST','CR_INT_PROF_RECKEY','INTEREST_AMNT_GROSS_CR'
					],
					proxyUrl : 'getCBCreditGrossSummaryDteWise.srvc',
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
				if( !Ext.isEmpty( value ) && value != '')
				{
					if( colId === 'col_APPLIED_RATE' &&  "0.0000" != value && '0' == entityType )
					{
						var creditProfKey = record.get( 'CR_INT_PROF_RECKEY' );
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + creditProfKey + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
				creditGrossDetailGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'computationDetailGridViewMstId',
					itemId : 'computationDetailGridViewMstId',
					pageSize : pgSize,
					autoDestroy : true,
					cls:'t7-grid',
					stateful : false,
					showEmptyRow : false,
					enableColumnHeaderMenu : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					//margin : '22 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var creditGrossDetailGridView = me.getComputationDetailItemRef();
				creditGrossDetailGridView.add( creditGrossDetailGrid );
				creditGrossDetailGridView.doLayout();
			}
		});
