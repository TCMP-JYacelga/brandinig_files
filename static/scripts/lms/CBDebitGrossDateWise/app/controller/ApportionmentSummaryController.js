Ext
	.define( 'GCP.controller.ApportionmentSummaryController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.ApportionmentSummaryGridView'
			],
			views :
			[
				'GCP.view.CBDebitGrossSummaryView'
			],
			refs :
			[
				{
					ref : 'apportionmentSummaryGridViewRef',
					selector : 'cpComputationSummaryViewType apportionmentSummaryGridViewType grid[itemId="apporGridViewMstItemId"]'
				},
				{
					ref : 'apportionmentViewItemRef',
					selector : 'cpComputationSummaryViewType apportionmentSummaryGridViewType panel[itemId="apportionmentViewItemId"]'
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
						'apportionmentSummaryGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'apportionmentSummaryGridViewType smartgrid' :
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
				var apportionmentSummaryGrid = me.getApportionmentSummaryGridViewRef()
				var objConfigMap = me.getApportionmentSummaryGridConfig();

				if( !Ext.isEmpty( apportionmentSummaryGrid ) )
					apportionmentSummaryGrid.destroy( true );

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
			
			getApportionmentSummaryGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
					"NODE" : 115,
					"GROSS_DEBIT_BALANCE" : 160,
					"DEBIT_APPROTIONMENT_RATE" : 200,
					"DEBIT_APPORTIONMENT" : 145,
					"PAIRED_NODE" : 145
				};

				arrColsPref =
				[
					{
						"colId" : "NODE",
						"colDesc" : getLabel( 'summaryNode', 'Node' )
					},
					{
						"colId" : "GROSS_DEBIT_BALANCE",
						"colDesc" : getLabel( 'summaryGrossDebitBalance', 'Gross Debit Balance' )
					},
					{
						"colId" : "DEBIT_APPROTIONMENT_RATE",
						"colDesc" : getLabel( 'summaryDebitApportRate', 'Debit Apportionment Rate' )
					},
					{
						"colId" : "DEBIT_APPORTIONMENT",
						"colDesc" : getLabel( 'summaryDebitApportionment', 'Debit Apportionment' )
					},
					{
						"colId" : "PAIRED_NODE",
						"colDesc" : getLabel( 'summaryPairedNode', 'Paired Node' )
					}
				];

				storeModel =
				{
					fields :
					[
						'NODE', 'GROSS_DEBIT_BALANCE', 'DEBIT_APPROTIONMENT_RATE','DEBIT_APPORTIONMENT','PAIRED_NODE','DR_APPORTIONMENT_PROFILERECKEY',
						'DATE'
					],
					proxyUrl : 'getCBDebitGrossDteWiseApport.srvc',
					rootNode : 'd.commonDataTable'
				//	totalRowsNode : 'd.__count'
				};

				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : arrColsPref,
					"storeModel" : storeModel
				};
				return objConfigMap;
			},		
			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = value;
				if( !Ext.isEmpty( value )  && value != '' )
				{
					if (colId == 'col_DEBIT_APPROTIONMENT_RATE' && "0.0000" != value && '0' == entityType)
					{
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'DR_APPORTIONMENT_PROFILERECKEY' ) + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"> <u>' + value + '%</u></a>';
					}
				}
				return strRetValue;
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
							if( cfgCol.colId === 'GROSS_DEBIT_BALANCE' || cfgCol.colId === 'DEBIT_APPROTIONMENT_RATE'
								|| cfgCol.colId === 'DEBIT_APPORTIONMENT')
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

			handleSmartGridLoading : function( arrCols, storeModel )
			{
				var me = this;
				var pgSize = null;
				var alertSummaryGrid = null;
				pgSize = 100;
				apportionmentSummaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'apporGridViewMstId',
					itemId : 'apporGridViewMstItemId',
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
					multiSort : false, 
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					//margin : '18 0 0 0',
					headerDockedItems : null,
					autoExpandLastColumn : false,
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var apportionmentSummaryView = me.getApportionmentViewItemRef();
				apportionmentSummaryView.add( apportionmentSummaryGrid );
				apportionmentSummaryView.doLayout();
			}
		});
