Ext
	.define( 'GCP.controller.NotionalQryBVIntAccruedController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.NotionalQryBVIntAccruedGridView'
			],
			views :
			[
			 	'GCP.view.NotionalQryBVInterestView'
			],
			refs :
			[
				{
					ref : 'bankAccruedGridViewRef',
					selector : 'notionalQryBVInterestViewType notionalQryBVIntAccruedGridViewType grid[itemId="bankAccruedGridViewId"]'
				},
				{
					ref : 'bankAccruedViewItemRef',
					selector : 'notionalQryBVInterestViewType notionalQryBVIntAccruedGridViewType panel[itemId="bankAccruedViewItemId"]'
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
						'notionalQryBVIntAccruedGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'notionalQryBVIntAccruedGridViewType smartgrid' :
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

				strUrl = strUrl + "&$viewState=" +viewState + "&$changeId=" + changeId ;

				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				grid.loadGridData( strUrl, null );
			},
			handleSmartGridConfig : function()
			{
				var me = this;
				var bankAccruedGrid = me.getBankAccruedGridViewRef();
				var objConfigMap = me.getBankAccruedGridConfig();

				if( !Ext.isEmpty( bankAccruedGrid ) )
					bankAccruedGrid.destroy( true );

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
			
			getBankAccruedGridConfig : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;

				objWidthMap =
				{
						"NODE" : 170,
						"DEBIT_ACCOUNT" : 160,
						"DEBIT_GLID" :140,
						"AMOUNT" : 160,
						"CURRENCY" : 80,								
						"CREDIT_ACCOUNT" : 180,
						"CREDIT_GLID" :140
				};

				arrColsPref =
				[
					{
						"colId" : "NODE",
						"colDesc" : getLabel( 'lblNode', 'Node' )
					},
					{
						"colId" : "DEBIT_ACCOUNT",
						"colDesc" : getLabel( 'lblDebitAccount', 'Debit Account Name' )
					},
					{
						"colId" : "DEBIT_GLID",
						"colDesc" : getLabel( 'lblDebitGLID', 'Debit GL ID' )
					},
					{
						"colId" : "AMOUNT",
						"colDesc" : getLabel( 'lblAmount', 'Amount' ),
						"colType" : "number"
					},					
					{
						"colId" : "CURRENCY",
						"colDesc" : getLabel( 'lblCurrency', 'CCY' )
					},
					{
						"colId" : "CREDIT_ACCOUNT",
						"colDesc" : getLabel( 'lblCreditAccount', 'Credit Account Name' )
					},
					{
						"colId" : "CREDIT_GLID",
						"colDesc" : getLabel( 'lblCreditGLID', 'Credit GL ID' )
					}
				];

				storeModel =
				{
					fields :
					[
						'NODE', 'DEBIT_ACCOUNT', 'DEBIT_GLID', 'AMOUNT', 'DEBIT_DR_CR', 'CURRENCY', 'PAIRED_NODE',
						'CREDIT_DR_CR', 'CREDIT_ACCOUNT', 'CREDIT_GLID'
						
					],
					proxyUrl : 'getBVBankIntAccrued.srvc',
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

						cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : '100';
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
					if( colId === 'col_NODE' )
					{
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
				bankAccruedGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'bankAccruedGridViewId',
					itemId : 'bankAccruedGridViewId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					showPager : true,
					showCheckBoxColumn : false,
					enableColumnHeaderMenu : false,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					cls:'t7-grid',
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					height : 'auto',
					minHeight : 10,
					maxHeight : 280,
					margin : '0 0 0 0',
					headerDockedItems : null,
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var bankAccruedGridView = me.getBankAccruedViewItemRef();
				bankAccruedGridView.add( bankAccruedGrid );
				bankAccruedGridView.doLayout();
			}
		});