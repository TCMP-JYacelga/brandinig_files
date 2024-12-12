/**
 * @class GCP.view.BankPreGeneratedReportView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext
	.define(
		'GCP.view.BankPreGeneratedReportView',
		{
			extend : 'Ext.panel.Panel',
			xtype : 'bankPreGeneratedReportViewType',
			requires :
			[
				'Ext.ux.gcp.GroupView', 'GCP.view.BankPreGeneratedReportTitleView',
				'GCP.view.BankPreGeneratedReportFilterView'
			],
			autoHeight : true,
			cls : 'ux_panel-background',
			width : '100%',
			widgetType : null,
			initComponent : function()
			{
				var me = this;
				var groupView = me.createGroupView();
				me.items =
				[
					{
						xtype : 'bankPreGeneratedReportTitleViewType',
						cls : 'ux_no-border ux_largepaddingtb ux_panel-background'
					},
					{
						xtype : 'bankPreGeneratedReportFilterViewType',
						margin : '0 0 12 0'
					}, groupView
				];

				me.on( 'resize', function()
				{
					me.doLayout();
				} );

				me.callParent( arguments );
			},
			createGroupView : function()
			{
				var me = this;
				var groupView = null;
				var objGroupByPref = {};
				if( objGridViewPref )
				{
					var objJsonData = Ext.decode( objGridViewPref );
					objGroupByPref = objJsonData || {};
				}
				var cfgGroupByUrl = 'services/grouptype/bankPreGeneratedReport/groupBy.srvc';
				var strWidgetFilter = cfgGroupByUrl + '?'+csrfTokenName+'=' + tokenValue + '&$filter=seller eq ' + '\''
					+ strSeller + '\'' + ' and seller eq ' + '\'' + strSeller + '\'' + '&$filterscreen=BANKADMIN';

				groupView = Ext.create( 'Ext.ux.gcp.GroupView',
				{
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : getLabel( 'titleRepDwnldGrid', 'Reports & Downloads' ),
					cfgGroupByLabel : getLabel( 'groupBy', 'Group By' ),
					cfgGroupCode : objGroupByPref.groupCode || null,
					cfgSubGroupCode : objGroupByPref.subGroupCode || null,
					cfgParentCt : me,
					cfgShowFilterInfo : false,
					cfgGridModel :
					{
						pageSize : _GridSizeTxn,
						rowList : _AvailableGridSize,
						stateful : false,
						hideRowNumbererColumn : true,
						showCheckBoxColumn : false,
						showSummaryRow : false,
						showEmptyRow : false,
						showPager : true,
						minHeight : 0,
						storeModel :
						{
							fields :
							[
								'entityCode', 'reportCode', 'reportName', 'reportType', 'reportTypeDesc', 'srcType',
								'schCnt', 'pregen', 'reportStatus', 'isFavorite', 'securityProfile',
								'securityProfileId', '__metadata', 'identifier', 'version', 'recordKeyNo', 'delInfo',
								'entityDesc', 'medium', 'moduleCode', 'sellerId', 'moduleName', 'originalSourceId',
								'entityType', 'channelName', 'distributionId', 'delOutput', 'intRecordKeyNmbr',
								'genDateTimeStr', 'srcName', 'size', 'copies', 'reportTypeDesc', 'fileExtension',
								'gaFileName', 'fileName','srcDescription','viewState'
							],
							proxyUrl : 'loadPreGeneratedReportWidgetsData/',
							rootNode : 'd.preGeneratedReport',
							totalRowsNode : 'd.__count'
						},
						defaultColumnModel : me.getDefaultColumnModel(),
						//groupActionModel : me.getGroupActionModel(),
						/**
						 * @cfg{Function} fnColumnRenderer Used as default
						 *                column renderer for all columns if
						 *                fnColumnRenderer is not passed to the
						 *                grids column model
						 */
						fnColumnRenderer : me.columnRenderer,
						fnRowIconVisibilityHandler : me.isRowIconVisible
					}
				} );
				return groupView;
			},

			getDefaultColumnModel : function()
			{
				var me = this, columnModel = null;
				columnModel = me.getColumns( REPORT_GENERIC_COLUMN_MODEL || [] );
				return columnModel;
			},

			getColumns : function( arrColsPref )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				//arrCols.push( me.createFavoriteColumn() );
				arrCols.push( me.createDownloadActionColumn() );
				//arrCols.push( me.createActionColumn() );
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colHeader;
						cfgCol.colId = objCol.colId;
						
						if(objCol.colId == 'channelName')
						{
							cfgCol.locked = false;
							cfgCol.lockable = false;
							cfgCol.sortable = false;
							cfgCol.hideable = false;
							cfgCol.resizable = false;
							cfgCol.draggable = false;
							cfgCol.hidden = false;
						}
						
						if( cfgCol.colId === 'schCnt' )
						{
							cfgCol.align = "right";
						}
						if( !Ext.isEmpty( objCol.colType ) )
						{
							cfgCol.colType = objCol.colType;
						}

						if( objCol.hidden === true )
						{
							cfgCol.hideable = true;
							cfgCol.hidden = true;
						}
						cfgCol.fnColumnRenderer = me.columnRenderer;
						cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width : objGridWidthMap[ objCol.colId ];
						//cfgCol.width =  200;
						arrCols.push( cfgCol );
					}
				}
				return arrCols;
			},

			createDownloadActionColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'groupaction',
					width : 80,
					locked : true,
					items :
					[
						{
							itemId : 'btnGenrate',
							text : getLabel( 'downloadlbl', 'Download' ),
							itemLabel : getLabel( 'download', 'Download' )
						}
					]

				};
				return objActionCol;
			},

			columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
			{
				var strRetValue = "";
				if( colId === 'col_schCnt' )
				{
					if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'reportStatus' ) !== 'DRAFT' )
					{
						if( record.get( 'moduleCode' ) == '15' )
						{
							return;
						}
						if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
							return;
						/*else if(value != '0' && value != '')
						{
							strRetValue = '<a style="color:blue" href="#" id="seeSchedule">See</a>';
						}
						else
						{
							strRetValue = '<a style="color:blue" href="#" id="addSchedule">Add</a>';
						}
						*/
						strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="addSchedule">Add</a>';
					}
					else
					{
						return;
					}
				}
				else if( colId === 'col_favorite' )
				{
					var me = this;
					if( !record.get( 'isEmpty' ) )
					{
						if( record.data.isFavorite === 'Y' )
						{
							strRetValue = '<a onclick="' + this.myfunction()
								+ 'class="linkbox misc-icon icon-misc-favorite"></a>';
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
			},

			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
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
			cloneObject : function( obj )
			{
				return JSON.parse( JSON.stringify( obj ) );
			}
		} );
