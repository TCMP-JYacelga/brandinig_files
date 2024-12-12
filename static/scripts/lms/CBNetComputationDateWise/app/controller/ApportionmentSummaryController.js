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
				'GCP.view.ComputationDateWiseView'
			],
			refs :
			[
				{
					ref : 'apportionmentSummaryGridViewRef',
					selector : 'computationDateWiseViewType apportionmentSummaryGridViewType grid[itemId="gridViewMstItemId"]'
				},
				{
					ref : 'apportionmentViewItemRef',
					selector : 'computationDateWiseViewType apportionmentSummaryGridViewType panel[itemId="apportionmentViewItemId"]'
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
					"NET_BALANCE" : 125,
					"APPLIED_APPORT_RATE" : 180,
					"APPORTIONMENT" : 130,
					"PAIRED_NODE" : 120
				};

				arrColsPref =
				[
					{
						"colId" : "NODE",
						"colDesc" : getLabel( 'summaryNode', 'Node' )
					},
					{
						"colId" : "NET_BALANCE",
						"colDesc" : getLabel( 'summaryNetBalance', 'Net Balance' ),
						"colType" : "number"
					},
					{
						"colId" : "APPLIED_APPORT_RATE",
						"colDesc" : getLabel( 'summaryAppliedApportRate', 'Applied Apportionment Rate' ),
						"colType" : "number"
					},
					{
						"colId" : "APPORTIONMENT",
						"colDesc" : getLabel( 'summaryApportionment', 'Apportionment' ),
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
						'NODE', 'NET_BALANCE', 'APPLIED_APPORT_RATE','APPORTIONMENT','PAIRED_NODE',
						'DERIVED_PROFILE_RECKEY','DATE'
					],
					proxyUrl : 'getCBNetComputeDteWiseApport.srvc',
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
						cfgCol.locked = Ext.isEmpty(objCol.locked) ? false : objCol.locked;
						cfgCol.resizable = Ext.isEmpty(objCol.resizable) ? true : objCol.resizable;
						cfgCol.draggable = Ext.isEmpty(objCol.draggable) ? true : objCol.draggable;
						cfgCol.sortable = false;
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
					if( colId === 'col_APPLIED_APPORT_RATE' && "0.0000" != value && '0' == entityType )
					{
						strRetValue = '<a href="#" onclick="javascript:showInterestProfile(' + "'" + record.get( 'DERIVED_PROFILE_RECKEY') + "', '" + record.get( 'DATE' ) + "', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');"><u>' + value + '%</u></a>';
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
				apportionmentSummaryGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'gridViewMstId',
					itemId : 'gridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					enableColumnHeaderMenu : false,
					showPager : true,
					showCheckBoxColumn : false,
					cls:'t7-grid',
					multiSort : false, 
					headerDockedItems : null,
					autoExpandLastColumn : false,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 10,
					maxHeight : 280,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					margin : '0 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel,
					enableColumnAutoWidth : _blnGridAutoColumnWidth
				} );
				var apportionmentSummaryView = me.getApportionmentViewItemRef();
				apportionmentSummaryView.add( apportionmentSummaryGrid );
				apportionmentSummaryView.doLayout();
			}
		});