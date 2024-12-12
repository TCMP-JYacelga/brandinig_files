/**
 * @class GCP.view.BankScheduleWidget
 * @extends Ext.panel.Panel
 * @author
 */
Ext.define( 'GCP.view.BankScheduleWidget',
{
	extend : 'Ext.ux.portal.Portlet',
	xtype : 'bankScheduleWidget',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'Ext.toolbar.Toolbar', 'Ext.panel.Panel', 'Ext.button.Button', 'Ext.Img','Ext.util.Point'
	],
	frame : true,
	closable : false,
	collapsible : true,
	animCollapse : true,
	widgetModel : null,
	widgetDesc : null,
	code : null,
	widgetCode : null,
	codeColumn : null,
	widgetEqCcy : null,
	widgetType : null,
	padding : '2 2 2 2',
	draggable :
	{
		moveOnDrag : false
	},
	cls : 'x-portlet xn-panel',

	getTools : function()
	{
		return
		[
			{
				xtype : 'tool',
				type : 'gear'
			}
		];
	},

	initComponent : function()
	{
		var me = this;
		var objWidthMap =
		{
			"reportName"  : 250,
			"reportTypeDesc" : 200,
			"schCnt" : 150,
			"securityProfile" : 150,
			"pregen" : 150,
			"reportStatus" : 150
			
		};
		if( !Ext.isEmpty( me.widgetModel ) )
		{
			var viewActionBar = null, viewSmartGrid = null;
			var strTitle = "", objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
			var tbarSubTotal = null;

			objPref = me.widgetModel;
			strTitle = me.widgetDesc;
			me.title = '<span class="block w16">' + strTitle + '</span>';
			me.itemId = me.widgetCode;
			me.id = me.widgetCode;
			arrColsPref = objPref.widgetPref.gridCols;
			arrCols = me.getColumns( arrColsPref,objWidthMap );
			pgSize = !Ext.isEmpty( objPref.widgetPref.pgSize ) ? parseInt( objPref.widgetPref.pgSize,10 ) : 20;

			me.widgetDetails =
			{
				widgetCode : me.widgetCode,
				widgetDesc : me.widgetDesc,
				code : me.code,
				codeColumn : me.codeColumn,
				pgSize : pgSize
			};
			viewSmartGrid = me.createGrid( arrCols );
			me.items =
			[
				viewSmartGrid
			];
			
			var actionsForWidget = ['Submit','Discard','Enable','Disable'];
			if (!Ext.isEmpty(actionsForWidget)) {
				viewActionBar = Ext.create('GCP.view.BankScheduleGroupActionBarView', {
							itemId : Ext.String.format('bankScheduleGroupActionBarView_{0}',
									me.widgetCode),
							parent : me,
							margin : '1 0 0 0',
							avlActions : actionsForWidget
						});
				viewSmartGrid.addDocked({
							xtype : 'panel',
							layout : 'hbox',
							items : [{
										xtype : 'label',
										text : 'Actions : ',
										cls : 'font_bold',
										padding : '5 0 0 3'
									}, viewActionBar]
						}, 0);
			}
		}
		me.on( 'afterrender', function( panel )
		{
			if( !Ext.isEmpty( panel.header ) && !Ext.isEmpty( panel.header.titleCmp ) )
				panel.header.titleCmp.flex = 0;
		} );
		Ext.EventManager.onWindowResize( function( w, h )
		{
			me.doComponentLayout();
		} );
		this.callParent( arguments );
	},
	createGrid : function( arrCols )
	{
		var pgSize = null, viewSmartGrid, objPref = null, me = this;
		objPref = me.widgetModel;
		pgSize = !Ext.isEmpty( objPref.widgetPref.pgSize ) ? parseInt( objPref.widgetPref.pgSize,10 ) : 20;
		viewSmartGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
			{
				id : Ext.String.format( 'bankSchedule_{0}', me.widgetCode ),
				itemId : Ext.String.format( 'bankSchedule_{0}', me.widgetCode ),
				pageSize : pgSize,
				stateful : false,
				rowList :
				[
					5, 10, 15, 20, 25, 30
				],
				hideRowNumbererColumn : true,
				showCheckBoxColumn : true,
				showEmptyRow : false,
				height : 'auto',
				showSummaryRow : true,
				columnModel : arrCols,
				storeModel :
				{
					fields :
					[
						'entityCode','showEntityType','reportCode','reportName', 'reportType','reportTypeDesc','srcType', 'schCnt', 'pregen', 'reportStatus',
						'isFavorite','securityProfile','SecurityProfileId','__metadata','identifier','version','recordKeyNo','delInfo',
						'medium','moduleCode','sellerId'
					],
					proxyUrl : 'loadBankScheduleWidgetsData/' + me.widgetType + '.srvc',
					rootNode : 'd.reportCenter',
					totalRowsNode : 'd.__count'
				},
				isRowIconVisible : me.isRowIconVisibleWidget,
				listeners :
				{
					render : function( objGrid )
					{
						me.fireEvent( 'gridRender', me, objGrid, objGrid.store.dataUrl, objGrid.pageSize, 1, 1, null );
					},
					afterrender : function( objGrid )
					{
						me.fireEvent( 'gridAfterRender', me, objGrid, objGrid.store.dataUrl, objGrid.pageSize, 1, 1, null );
					},
					gridPageChange : function( objGrid, strDataUrl, intPgSize, intNewPgNo, intOldPgNo, jsonSorter )
					{
						me.widgetDetails.pgSize = intPgSize;
						me.fireEvent( 'gridPageChange', me, objGrid, strDataUrl, intPgSize, intNewPgNo, intOldPgNo, jsonSorter );
					},
					gridSortChange : function( objGrid, strDataUrl, intPgSize, intNewPgNo, intOldPgNo, jsonSorter )
					{
						me.fireEvent( 'gridSortChange', me, objGrid, strDataUrl, intPgSize, intNewPgNo, intOldPgNo, jsonSorter );
					},
					gridRowSelectionChange : function( objGrid, objRecord, intRecordIndex, arrSelectedRecords, jsonData )
					{
						me.fireEvent( 'gridRowSelectionChange', me, objGrid, objRecord, intRecordIndex, arrSelectedRecords,
							jsonData );
					},
					pagechange : function( pager, current, oldPageNum )
					{
						me.fireEvent( 'performComboPageSizeChange', pager, current, oldPageNum );
					},
					statechange : function( grid )
					{
						me.fireEvent( 'gridStateChange', grid );
					}
				}

			} );
		
		viewSmartGrid.on( 'cellclick', function( view, td, cellIndex, record, tr, rowIndex, e, eOpts )
		{ 
			var linkClicked = ( e.target.tagName == 'SPAN' );
			var generateClicked = ( e.target.tagName == 'A' );
			var imgClicked = ( e.target.tagName == 'IMG' );
			var clickedId = e.target.id ; 
			
			if( clickedId == 'seeSchedule'  && cellIndex == 2)
			{
				me.fireEvent('scheduleReports',record);
			}
			else if( clickedId == 'addSchedule'  && cellIndex == 2)
			{
				me.fireEvent('scheduleReports',record);
			}
			else if( clickedId == 'seePregenerated'  && ( cellIndex == 5 || cellIndex == 3 ) )
			{
				me.fireEvent('preGeneratedReports',record);
			}
			else if( imgClicked && cellIndex == 3)
			{
				me.fireEvent('editReports',record);
			}
			else if( generateClicked )
			{  
				me.fireEvent('generateReport',record);
			}
			
		} );

		viewSmartGrid.store.on( 'load', function( store, records, options )
		{
			if( store.data.length == 0 )
			{
				 me.hide();
			}
			else
			{
				me.show();
			}
		} );
		return viewSmartGrid;
	},
	
	isRowIconVisibleWidget : function( store, record, jsonData, itmId, maskPosition )
	{
		var maskSize = 2;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if( !Ext.isEmpty( maskPosition ) )
		{
			bitPosition = parseInt( maskPosition,10 ) - 1;
			maskSize = maskSize;
		}
		if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push( buttonMask );
		maskArray.push( rightsMap );
		actionMask = doAndOperation( maskArray, maskSize );

		var isSameUser = true;
		if( record.raw.makerId === USER )
		{
			isSameUser = false;
		}
		if( Ext.isEmpty( bitPosition ) )
			return retValue;
		retValue = isActionEnabled( actionMask, bitPosition );
		return retValue;
	
	},
	getColumns : function( arrColsPref, objWidthMap)
	{
		
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push( me.createFavoriteColumn() );
		arrCols.push( me.createGenerateActionColumn() );
		arrCols.push( me.createActionColumn() );
		if( !Ext.isEmpty( arrColsPref ) )
		{
			for( var i = 0 ; i < arrColsPref.length ; i++ )
			{
				objCol = arrColsPref[ i ];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if(cfgCol.colId === 'schCnt' || cfgCol.colId === 'pregen')
				{
					cfgCol.align = "right";
				}
				if( !Ext.isEmpty( objCol.colType ) )
				{
					cfgCol.colType = objCol.colType;
				}

				if( objCol.colHidden === true )
				{
					cfgCol.hideable = true;
					cfgCol.hidden = true;
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 200;
				//cfgCol.width =  200;
				arrCols.push( cfgCol );
			}
		}
		return arrCols;
	},
	createFavoriteColumn : function()
	{
		var me = this;
		var objActionCol =
		{
			colType : 'action',
			colId : 'action',
			width : 30,
			locked : true,
			sortable : false,
			items :
			[
				{
					itemId : 'btnfavorite',
					itemCls : 'linkbox misc-icon icon-misc-nonfavorite',
					fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record )
					{
						if( record.data.isFavorite === 'Y' )
						{
							record.set( "isFavorite", "N" );
							var reportCode = record.data.reportCode;
							me.fireEvent( 'deleteFavoriteRep', reportCode, me );
						}
						else
						{
							record.set( "isFavorite", "Y" );
							var reportCode = record.data.reportCode;
							me.fireEvent( 'addFavoriteRep', reportCode, me );
						}
					},
					fnIconRenderer : function( value, metaData, record, rowIndex, colIndex, store, view )
					{
						if( !record.get( 'isEmpty' ) )
						{
							if( record.data.isFavorite === 'Y' )
							{
								var iconClsClass = 'linkbox misc-icon icon-misc-favorite';
								return iconClsClass;
							}
							else
							{
								var iconClsClass = 'linkbox misc-icon icon-misc-nonfavorite';
								return iconClsClass;
							}
						}
					}
				}
			]
		};
		return objActionCol;
	},

	createGenerateActionColumn : function()
	{
		var me = this;
		var objActionCol =
		{
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 70,
			locked : true,
			items :
			[
				{
					itemId : 'btnGenrate',
					text : 	'Generate',
					itemLabel : getLabel( 'generate', 'Generate' ),
					maskPosition : 1
				}
			]

		};
		return objActionCol;
	},

	createActionColumn : function()
	{
		var me = this;
		var objActionCol =
		{
			colType : 'action',
			colId : 'actionId',
			width : 40,
			locked : true,
			items :
			[
				{
					itemId : 'btnEdit',
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : getLabel( 'viewToolTip', 'Edit' ),
					maskPosition : 2
				}
			]

		};
		return objActionCol;
	},

	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var strRetValue = "";
		if( colId === 'col_schCnt')
		{
			if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
				return;
			else if(value != '0' && value != '')
			{
				strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="seeSchedule">See</a>';
			}
			else
			{
				strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="addSchedule">Add</a>';
			}
		}
		else if( colId === 'col_pregen')
		{
			if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
				return;
			else if(value != '0' && value != '')
			{
				//strRetValue = value;
				strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="seePregenerated">..See</a>';
			}
		}
		else
			if( colId === 'col_favorite' )
			{
				var me = this;
				if( !record.get( 'isEmpty' ) )
				{
					if( record.data.isFavorite === 'Y' )
					{
						strRetValue = '<a onclick="' + this.myfunction() + 'class="linkbox misc-icon icon-misc-favorite"></a>';
					}
					else
					{
						strRetValue = '<a title="' + '" class="linkbox misc-icon icon-misc-nonfavorite"></a>';
					}
				}
			}
			else
				strRetValue = value;
					
		return strRetValue;
	}
	
} );
