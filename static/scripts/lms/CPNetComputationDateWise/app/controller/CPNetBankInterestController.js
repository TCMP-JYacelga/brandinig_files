Ext
	.define( 'GCP.controller.CPNetBankInterestController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CPNetBankInterestGridView'
			],
			views :
			[
			 	'GCP.view.CPNetDateWiseView'
			],
			refs :
			[
				{
					ref : 'bankInterestSummaryGridViewRef',
					selector : 'cpNetDateWiseViewType cpNetBankInterestGridViewType grid[itemId="bankInterestGridViewMstItemId"]'
				},
				{
					ref : 'bankInterestViewItemRef',
					selector : 'cpNetDateWiseViewType cpNetBankInterestGridViewType panel[itemId="bankInterestItemId"]'
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
						'cpNetBankInterestGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'cpNetBankInterestGridViewType smartgrid' :
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
					"ACCOUNT" : 180,
					"BALANCE" : 180,
				//	"APPLICABLE_RATE" : 180,
					"APPLIED_RATE" : 210,
					"APPLIED_INTEREST" : 220,
					"BENEFIT_ALLOCATED" : 210,
					"BENEFIT_RATIO" : 210
				};

				arrColsPref =
				[
					{
						"colId" : "ACCOUNT",
						"colDesc" : getLabel( 'summaryAccount', 'Account' )
					},
					{
						"colId" : "BALANCE",
						"colDesc" : getLabel( 'summaryBalance', 'Balance' ),
						"colType" : "number"
					},
			/*		{
						"colId" : "APPLICABLE_RATE",
						"colDesc" : getLabel( 'summaryApplicableRate', 'Applicable Rate' ),
						"colType" : "number"
					}, */
					{
						"colId" : "APPLIED_RATE",
						"colDesc" : getLabel( 'summaryAppliedRate', 'Applied Rate' ),
						"colType" : "number"
					},
					{
						"colId" : "APPLIED_INTEREST",
						"colDesc" : getLabel( 'summaryAppliedInterest', 'Applied Interest' ),
						"colType" : "number"
					},
					{
						"colId" : "BENEFIT_ALLOCATED",
						"colDesc" : getLabel( 'summaryBenefitAllocated', 'Benefit Allocated' ),
						"colType" : "number"
					},
					{
						"colId" : "BENEFIT_RATIO",
						"colDesc" : getLabel( 'summaryBenefitRatio', 'Benefit Ratio	%' ),
						"colType" : "number"
					}
				];

				storeModel =
				{
					fields :
					[
						'ACCOUNT', 'CURRENCY', 'BALANCE', 'APPLICABLE_RATE','APPLIED_RATE','APPLIED_INTEREST','BENEFIT_ALLOCATED',
						'BENEFIT_RATIO', 'APPLICABLE_INT_RECKEY', 'APPLIED_INT_RECKEY', 'DATE'
					],
					proxyUrl : 'getCPNetDteWiseBankInt.srvc',
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
				var recKey = null;
				if( !Ext.isEmpty( value ) && value != '')
				{
					if( colId === 'col_APPLICABLE_RATE' &&  "0.0000" != value && '0' == entityType)
					{
						recKey = null;
						recKey = record.get( 'APPLICABLE_INT_RECKEY' );
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + recKey + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
					}
					else if( colId === 'col_APPLIED_RATE' &&  "0.0000" != value && '0' == entityType)
					{
						recKey = null;
						recKey = record.get( 'APPLIED_INT_RECKEY' );
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + recKey + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
					}
					else if( colId === 'col_BENEFIT_RATIO')
					{
						strRetValue = value + '%';
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
				cbCreditGrossbankInterestGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'bankInterestGridViewMstItemId',
					itemId : 'bankInterestGridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					enableColumnHeaderMenu : false,
					stateful : false,
					showEmptyRow : false,
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
				var cbCreditGrossbankInterestGridView = me.getBankInterestViewItemRef();
				cbCreditGrossbankInterestGridView.add( cbCreditGrossbankInterestGrid );
				cbCreditGrossbankInterestGridView.doLayout();
			}
		});
