Ext
	.define(
		'GCP.controller.AccrualSettlementSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler', 'GCP.view.AccrualSettlementSummaryGridView'
			],
			views :
			[
				'GCP.view.AccrualSettlementSummaryView'
			],
			refs :
			[
				{
					ref : 'accrualPoolGridViewRef',
					selector : 'accrualSettlementSummaryViewType accrualSettlementSummaryGridViewType grid[itemId="poolGridViewMstItemId"]'
				},
				{
					ref : 'accrualPoolViewItemIdRef',
					selector : 'accrualSettlementSummaryViewType accrualSettlementSummaryGridViewType panel[itemId="accrualPoolViewItemId"]'
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
					'accrualSettlementSummaryGridViewType' :
					{
						render : function( panel )
						{
							me.handleSmartGridConfig();
						}
					},

					'accrualSettlementSummaryGridViewType smartgrid' :
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
				var accrualPoolGrid = me.getAccrualPoolGridViewRef();
				var objConfigMap = me.getAccrualPoolGridConfig();

				if( !Ext.isEmpty( accrualPoolGrid ) )
					accrualPoolGrid.destroy( true );

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

			getAccrualPoolGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				if( queryType == '2' )
				{
					objWidthMap =
					{
						"TRAN_DATE" : 130,
						"TYPE" : 110,
						"TXN_AMOUNT" : 140,
						"DEBIT_ACCOUNT" : 150,
						"DEBIT_COUNTRY" : 110,
						"DEBIT_GLID" : 150,
						"CREDIT_ACCOUNT" : 150,
						"CREDIT_COUNTRY" : 110,
						"CREDIT_GLID" : 150,
						"IS_SETTLED" : 102
					};
				}
				else
				{
					objWidthMap =
					{
						"TRAN_DATE" : 130,
						"VALUE_DATE" : 130,
						"TYPE" : 110,
						"TXN_AMOUNT" : 140,
						"DEBIT_ACCOUNT" : 150,
						"DEBIT_COUNTRY" : 110,
						"DEBIT_GLID" : 150,
						"CREDIT_ACCOUNT" : 150,
						"CREDIT_COUNTRY" : 110,
						"CREDIT_GLID" : 150,
						"WHT_RATE" : 100,
						"WITHHOLDING_TAX" : 150
					};
				}

				arrColsPref =
				[
					{
						"colId" : "TRAN_DATE",
						"colDesc" : queryType == '2' ? getLabel( 'accrualDate', 'Accrual Date' ) : getLabel(
							'settlementDate', 'Settlement Date' )
					},
					{
						"colId" : "VALUE_DATE",
						"colDesc" : getLabel( 'settlementValueDate', 'Value Date' ),
						"colHidden" : queryType == '2' ? true : false
					},
					{
						"colId" : "TYPE",
						"colDesc" : getLabel( 'accrualType', 'Type' )
					},
					{
						"colId" : "TXN_AMOUNT",
						"colDesc" : queryType == '2' ? getLabel( 'accrualAmount', 'Accrued Amount' ) : getLabel(
							'settlementAmount', 'Settlement Amount' ),
						"colType" : "number"
					},
					{
						"colId" : "DEBIT_GLID",
						"colDesc" : getLabel( 'accrualDebitGlId', 'Debit Account No' )
					},
					{
						"colId" : "DEBIT_ACCOUNT",
						"colDesc" : getLabel( 'accrualDebitAccount', 'Debit Account Name' )
					},
					{
						"colId" : "DEBIT_COUNTRY",
						"colDesc" : getLabel( 'accrualDebitCountry', 'Country' )
					},
					{
						"colId" : "CREDIT_GLID",
						"colDesc" : getLabel( 'accrualCreditGlId', 'Credit Account No' )
					},
					{
						"colId" : "CREDIT_ACCOUNT",
						"colDesc" : getLabel( 'accrualCreditAccount', 'Credit Account Name' )
					},
					{
						"colId" : "CREDIT_COUNTRY",
						"colDesc" : getLabel( 'accrualCreditCountry', 'Country' )
					},
					{
						"colId" : "IS_SETTLED",
						"colDesc" : getLabel( 'accrualSettled', 'Settled' ),
						"colHidden" : queryType == '2' ? false : true
					},
					{
						"colId" : "WHT_RATE",
						"colDesc" : getLabel( 'settlmentWhtRate', 'WHT Rate' ),
						"colHidden" : queryType == '3' ? false : true,
						"colType" : "number"
					},
					{
						"colId" : "WITHHOLDING_TAX",
						"colDesc" : getLabel( 'settlmentWhtTax', 'Withholding Tax' ),
						"colHidden" : queryType == '3' ? false : true,
						"colType" : "number"	
					}
				];

				storeModel =
				{
					fields :
					[
						'TRAN_DATE', 'VALUE_DATE', 'TYPE', 'TXN_AMOUNT', 'DEBIT_ACCOUNT', 'DEBIT_COUNTRY', 'DEBIT_GLID', 'CREDIT_ACCOUNT',
						'CREDIT_COUNTRY', 'CREDIT_GLID', 'IS_SETTLED', 'TRANSACTION_ID', 'WHT_RATE', 'WITHHOLDING_TAX','TXN_TYPE','NARRATION'
					],
					proxyUrl : 'getAccrualSettlementSummaryGridData.srvc',
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
				if( !Ext.isEmpty( value ) && value != '' )
				{
					if( colId === 'col_TRAN_DATE' &&  (record.get('TXN_TYPE') != '11' && record.get('TXN_TYPE') != '12') )
					{
						strRetValue = '<a href="#" onclick="callToAccrualSetDtWisePage( \''
							+ record.get( 'TRANSACTION_ID' ) + "','" + record.get( 'TRAN_DATE' ) + "','" +  "N" + '\' )"><u>' + value
							+ ' </u></a>';
					}
					if(colId === 'col_TYPE' &&  (record.get('TXN_TYPE') == '11' || record.get('TXN_TYPE') == '12'))
					{
						meta.tdAttr = 'data-qtip="' + getLabel( 'NARR_'+record.get('TXN_TYPE'), '' ) + ' : '+ record.get('NARRATION') + '"';
					}
				}
				return strRetValue;
			},

			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				pgSize = 100;
				accrualPoolGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'poolGridViewMstItemId',
					itemId : 'poolGridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					cls:'t7-grid',
					headerDockedItems : null,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					//margin : '18 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var accraulPoolView = me.getAccrualPoolViewItemIdRef();
				accraulPoolView.add( accrualPoolGrid );
				accraulPoolView.doLayout();
			}
		} );

