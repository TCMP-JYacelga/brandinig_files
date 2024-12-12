/**
 * @class GCP.view.PreGeneratedReportView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext
	.define(
		'GCP.view.PreGeneratedReportView',
		{
			extend : 'Ext.panel.Panel',
			xtype : 'preGeneratedReportViewType',
			requires :
			[
				'Ext.ux.gcp.GroupView', 'GCP.view.PreGeneratedReportTitleView', 'GCP.view.PreGeneratedReportFilterView'
			],
			autoHeight : true,
			widgetType : null,
			initComponent : function()
			{
				var me = this;
				var groupView = me.createGroupView();
				me.items =
				[
					groupView
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
				
				var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
				if (objpregenPreferencesPref) 
				{
					var objJsonData = Ext.decode(objpregenPreferencesPref);
					objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
					objGridSetting = objJsonData.d.preferences.GridSetting || {};
					arrColumnSetting = objJsonData && objJsonData.d.preferences
							&& objJsonData.d.preferences.ColumnSetting
							&& objJsonData.d.preferences.ColumnSetting.gridCols
								? objJsonData.d.preferences.ColumnSetting.gridCols
								: (REPORT_GENERIC_COLUMN_MODEL || '[]');
				}
		
				if( objGridViewPref )
				{
					var objJsonData = Ext.decode( objGridViewPref );
					objGroupByPref = objJsonData || {};
				}
				var cfgGroupByUrl = 'services/grouptype/preGeneratedReport/groupBy.srvc';
				var strWidgetFilter = cfgGroupByUrl + '?'+csrfTokenName+'=' + tokenValue + '&$filterGridId=GRD_ADM_PREGENREP' +'&$filter=seller eq ' + '\''
					+ strSeller + '\'' + ' and client eq ' + '\'' + strClient + '\'' + ' and seller eq ' + '\''
					+ strSeller + '\'' + '&$filterscreen=CLIENT';

				groupView = Ext.create( 'Ext.ux.gcp.GroupView',
				{
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : 'Reports & Downloads',
					cfgGroupByLabel : 'Group By',
					cfgGroupCode : objGroupByPref.groupCode || null,
					cfgSubGroupCode : objGroupByPref.subGroupCode || null,
					cfgParentCt : me,
					cfgShowFilter : true,
					cfgAutoGroupingDisabled : true,
					cfgSmartGridSetting : true,
					padding : '12 0 0 0',
					cls:'t7-grid',
					enableQueryParam:false,
					cfgShowAdvancedFilterLink:false,
					cfgFilterModel : {
					cfgContentPanelItems : [{
							xtype : 'preGeneratedReportFilterViewType'
							}],
					cfgContentPanelLayout : {
							type : 'vbox',
							align : 'stretch'
						}
					},
					cfgPrefferedColumnModel : arrColumnSetting,
					cfgGridModel :
					{
						pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
						showSorterToolbar : _charEnableMultiSort,
						cfgCaptureColumnSettingAt :  'G',
						enableColumnAutoWidth : _blnGridAutoColumnWidth, 
						rowList : _AvailableGridSize,
						stateful : false,
						checkBoxColumnWidth : _GridCheckBoxWidth,
						hideRowNumbererColumn : true,
						showCheckBoxColumn : true,
						showSummaryRow : false,
						showEmptyRow : false,
						showPager : true,
						heightOption : objGridSetting.defaultGridSize,
						minHeight : 108,
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
		getGroupActionModel : function()
			{
				var retArray = [];
				var arrActions =
				[
					'Export','View'
				];
				var objActions =
				{
					'Export' :
					{
						actionName : 'actionExport',
						// itemCls : 'icon-button icon-discard',
						disabled : false,
						itemText : getLabel( 'actionExport', 'Export' ),
						maskPosition : 2,
						hidden :true
					},
					'View' :
					{
						actionName : 'actionView',
						// itemCls : 'icon-button icon-discard',
						disabled : false,
						itemText : getLabel( 'actionView', 'View' ),
						maskPosition : 3,
						hidden :true
					}
				};

				for( var i = 0 ; i < arrActions.length ; i++ )
				{
					if( !Ext.isEmpty( objActions[ arrActions[ i ] ] ) )
						retArray.push( objActions[ arrActions[ i ] ] )
				}
				return retArray;
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
						cfgCol.hidden = objCol.hidden;
						cfgCol.locked = objCol.locked;
						if( cfgCol.colId === 'schCnt' )
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
					colId : 'actioncontent',
					colHeader: getLabel('actions', 'Actions'),
					colType : 'actioncontent',
					width : 108,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					items :
					[
						{
							itemId : 'btnGenrate',
							text : getLabel('downloadlbl','Download'),
							itemLabel : getLabel( 'downloadlbl', 'Download' ),
							maskPosition : 1
						},
						{
							itemId : 'btnExport',
							text : 'Export',
							itemLabel : getLabel( 'export', 'Export' ),
							maskPosition : 2
						},
						{
							itemId : 'btnView',
							text : 'View',
							itemLabel : getLabel( 'view', 'View' ),
							maskPosition : 3
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
				else if( colId === 'col_moduleName' )
				{
					strRetValue = getModuleLabel(record.get('moduleCode'),record.get( 'moduleName'));
				}
				else if( colId === 'col_srcDescription' )
				{
					strRetValue = getReportDescLabel(record.get('srcName'),record.get( 'srcDescription'));
				}
				else if( colId === 'col_fileExtension' )
				{
					strRetValue = getLabel(value,value);
				}
				else
					strRetValue = value;
				meta.tdAttr = 'title="' + strRetValue + '"';
				return strRetValue;
			},

			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				var maskSize = 3;
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
