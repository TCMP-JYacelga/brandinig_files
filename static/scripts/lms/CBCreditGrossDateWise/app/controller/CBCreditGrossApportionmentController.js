Ext
	.define( 'GCP.controller.CBCreditGrossApportionmentController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CBCreditGrossApportionmentGridView'
			],
			views :
			[
			 	'GCP.view.CBCreditGrossDateWiseView'
			],
			refs :
			[
				{
					ref : 'apportionmentSummaryGridViewRef',
					selector : 'cbCreditGrossDateWiseViewType cbCreditGrossApportionmentGridViewType grid[itemId="apportionmentViewMstItemId"]'
				},
				{
					ref : 'apportionmentViewItemRef',
					selector : 'cbCreditGrossDateWiseViewType cbCreditGrossApportionmentGridViewType panel[itemId="apportionmentViewItemId"]'
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
						'cbCreditGrossApportionmentGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'cbCreditGrossApportionmentGridViewType smartgrid' :
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
					"NODE" : 125,
					"NODE_BALANCE" : 125,
					"GROSS_CREDIT_BALANCE" : 200,
					"CREDIT_APPORT_RATE" : 180,
					"CREDIT_APPORTIONMENT" : 150,
					"PAIRED_NODE" : 125
				};

				arrColsPref =
				[
					{
						"colId" : "NODE",
						"colDesc" : getLabel( 'summaryNode', 'Node' )
					},
					{
						"colId" : "NODE_BALANCE",
						"colDesc" : getLabel( 'summaryNetBalance', 'Net Balance' ),
						"colType" : "number"
					},
					{
						"colId" : "GROSS_CREDIT_BALANCE",
						"colDesc" : getLabel( 'summaryGrossCreditBalance', 'Gross Credit Balance' ),
						"colType" : "number"
					},
					{
						"colId" : "CREDIT_APPORT_RATE",
						"colDesc" : getLabel( 'summaryAppliedApportRate', 'Credit Apportionment Rate' ),
						"colType" : "number"
					},
					{
						"colId" : "CREDIT_APPORTIONMENT",
						"colDesc" : getLabel( 'summaryApportionment', 'Credit Apportionment' ),
						"colType" : "number"
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
						'NODE','NODE_BALANCE', 'GROSS_CREDIT_BALANCE', 'CREDIT_APPORT_RATE','CREDIT_APPORTIONMENT','PAIRED_NODE',
						'CR_APPORT_PROF_RECKEY', 'DATE'
					],
					proxyUrl : 'getCBCreditGrossDteWiseApport.srvc',
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
				if( !Ext.isEmpty( value ) && value != '' )
				{
					if( colId === 'col_CREDIT_APPORT_RATE' &&  "0.0000" != value && '0' == entityType)
					{
						var creditProfKey = record.get( 'CR_APPORT_PROF_RECKEY' );
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
				cbCReditGrossapportionmentGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'apportionmentViewMstItemId',
					itemId : 'apportionmentViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					enableColumnHeaderMenu : false,
					cls : 't7-grid',
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					autoExpandLastColumn : false,
					multiSort : false, 

					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					maxHeight : 280,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					//margin : '22 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel,
					headerDockedItems : null
				} );
				var cbCReditGrossapportionmentView = me.getApportionmentViewItemRef();
				cbCReditGrossapportionmentView.add( cbCReditGrossapportionmentGrid );
				cbCReditGrossapportionmentView.doLayout();
			}
		});
