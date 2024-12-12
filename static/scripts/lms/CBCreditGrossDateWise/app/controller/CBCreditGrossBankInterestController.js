Ext
	.define( 'GCP.controller.CBCreditGrossBankInterestController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'Ext.ux.gcp.DateHandler','GCP.view.CBCreditGrossBankInterestGridView'
			],
			views :
			[
			 	'GCP.view.CBCreditGrossDateWiseView'
			],
			refs :
			[
				{
					ref : 'bankInterestSummaryGridViewRef',
					selector : 'cbCreditGrossDateWiseViewType cbCreditGrossBankInterestGridViewType grid[itemId="bankInterestGridViewMstItemId"]'
				},
				{
					ref : 'bankInterestViewItemRef',
					selector : 'cbCreditGrossDateWiseViewType cbCreditGrossBankInterestGridViewType panel[itemId="bankInterestItemId"]'
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
						'cbCreditGrossBankInterestGridViewType' :
						{
							render : function( panel )
							{
								me.handleSmartGridConfig();
							}
						},
						'cbCreditGrossBankInterestGridViewType smartgrid' :
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
					"ACCOUNT" : 181,
					"BALANCE" : 181,
					"APPLICABLE_RATE" : 181,
					"APPLICABLE_INTEREST" : 181,
					"APPORT_APPLICABLE" : 181
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
					{
						"colId" : "APPLICABLE_RATE",
						"colDesc" : getLabel( 'summaryApplicableRate', 'Applicable Rate' ),
						"colType" : "number"
					},
					{
						"colId" : "APPLICABLE_INTEREST",
						"colDesc" : getLabel( 'summaryApplicableInterest', 'Applicable Interest' ),
						"colType" : "number"
					},
					{
						"colId" : "APPORT_APPLICABLE",
						"colDesc" : getLabel( 'summaryApportApplicable', 'Apportionment Applicable' )
					}
				];

				storeModel =
				{
					fields :
					[
						'ACCOUNT', 'BALANCE', 'APPLICABLE_RATE','APPLICABLE_INTEREST','APPORT_APPLICABLE',
						'CR_INT_PROF_RECKEY','DATE'
					],
					proxyUrl : 'getCBCreditGrossDteWiseBankInt.srvc',
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
					if( colId === 'col_APPLICABLE_RATE' &&  "0.0000" != value  && '0' == entityType)
					{
						recKey = null;
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
				cbCreditGrossbankInterestGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
				{
					id : 'bankInterestGridViewMstItemId',
					itemId : 'bankInterestGridViewMstItemId',
					pageSize : pgSize,
					autoDestroy : true,
					stateful : false,
					showEmptyRow : false,
					enableColumnHeaderMenu : false,
					cls : 't7-grid',
					hideRowNumbererColumn : true,
					showSummaryRow : false,
					showPager : false,
					showCheckBoxColumn : false,
					autoExpandLastColumn : false,
					rowList :
					[
						10, 25, 50, 100, 200, 500
					],
					minHeight : 140,
					maxHeight : 280,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					//margin : '22 0 0 0',
					columnModel : arrCols,
					storeModel : storeModel
				} );
				var cbCreditGrossbankInterestGridView = me.getBankInterestViewItemRef();
				cbCreditGrossbankInterestGridView.add( cbCreditGrossbankInterestGrid );
				cbCreditGrossbankInterestGridView.doLayout();
			}
		});
