/**
 * @class GCP.view.CustomReportCenterView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */

Ext
	.define(
		'GCP.view.CustomReportCenterView',
		{
			extend : 'Ext.panel.Panel',
			xtype : 'customReportCenterViewType',
			requires :
			[
				'Ext.ux.gcp.GroupView', 'GCP.view.CustomReportCenterFilterView'
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
				if (objcustReportPref) 
				{
					var objJsonData = Ext.decode(objcustReportPref);
					objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
					objGridSetting = objJsonData.d.preferences.GridSetting || {};
					if(entityType == 0)
					{
						arrColumnSetting = objJsonData && objJsonData.d.preferences
						&& objJsonData.d.preferences.ColumnSetting
						&& objJsonData.d.preferences.ColumnSetting.gridCols
						? objJsonData.d.preferences.ColumnSetting.gridCols
						: (REPORT_GENERIC_COLUMN_MODELADM || '[]');
					}
					else
					{
						arrColumnSetting = objJsonData && objJsonData.d.preferences
						&& objJsonData.d.preferences.ColumnSetting
						&& objJsonData.d.preferences.ColumnSetting.gridCols
						? objJsonData.d.preferences.ColumnSetting.gridCols
						: (REPORT_GENERIC_COLUMN_MODEL || '[]');
					}
				}
				if (objcustReportPref) 
				{
					var objJsonData = Ext.decode(objcustReportPref);
					objGroupByPref = objJsonData.d.preferences.groupByPref || {};
				}
				var cfgGroupByUrl = 'services/grouptype/customReportCenter/groupBy.srvc';
				var strWidgetFilter = cfgGroupByUrl + '?'+csrfTokenName+'=' + tokenValue + '&$filterGridId=GRD_ADM_CUSREPORT' + '&$filter=seller eq ' + '\''
					+ strSeller + '\'' + ' and client eq ' + '\'' + strClient + '\'' + ' and seller eq ' + '\''
					+ strSeller + '\'';

				groupView = Ext.create( 'Ext.ux.gcp.GroupView',
				{
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : 'Reports',
					cfgGroupByLabel : 'Group By',
					cfgGroupCode : objGeneralSetting.defaultGroupByCode,
					cfgSubGroupCode : objGroupByPref.subGroupCode || null,
					cfgParentCt : me,
					cfgSmartGridSetting : true,
					cfgAutoGroupingDisabled : true,
					cfgShowAdvancedFilterLink:false,
					padding:'12 0 0 0',
					enableQueryParam:false,
					cls:'t7-grid',
					cfgShowFilter : true,
					cfgShowRefreshLink : false,
					cfgFilterModel : {
						cfgContentPanelItems : [{
								xtype : 'customReportCenterFilterViewType'
							}],
							cfgContentPanelLayout : {
								type : 'vbox',
								align : 'stretch'
							}
					},
					getActionColumns : function() {
						return [me.createGroupActionColumn()]
					},
					cfgPrefferedColumnModel : arrColumnSetting,
					cfgGridModel :
					{
					    pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
					    showSorterToolbar : _charEnableMultiSort,
						cfgCaptureColumnSettingAt : 'G',
						enableColumnAutoWidth : _blnGridAutoColumnWidth,
						rowList : _AvailableGridSize,
						heightOption : objGridSetting.defaultGridSize,
						stateful : false,
						hideRowNumbererColumn : true,
						checkBoxColumnWidth : _GridCheckBoxWidth,
						showCheckBoxColumn : true,
						showSummaryRow : false,
						showEmptyRow : false,
						showPager : true,
						minHeight : 100,
						storeModel :
						{
							fields :
							[
								'entityCode', 'reportCode', 'reportName', 'reportDesc', 'reportType', 'reportTypeDesc', 'srcType',
								'schCnt', 'pregen', 'reportStatus', 'isFavorite', 'securityProfile',
								'securityProfileId', '__metadata', 'identifier', 'version', 'recordKeyNo', 'delInfo',
								'entityDesc', 'medium', 'moduleCode', 'sellerId', 'moduleName', 'originalSourceId',
								'entityType', 'channelName', 'distributionId', 'delOutput', 'intRecordKeyNmbr',
								'createdBy','requestStateDesc'
							],
							proxyUrl : 'loadCustomReportWidgetsData/',
							rootNode : 'd.reportCenter',
							totalRowsNode : 'd.__count'
						},
						defaultColumnModel : (entityType == 0)?(REPORT_GENERIC_COLUMN_MODELADM) :(REPORT_GENERIC_COLUMN_MODEL || []),
						groupActionModel : me.getGroupActionModel(),
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
			getColumns : function( arrColsPref )
			{
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				//arrCols.push( me.createFavoriteColumn() );
				//arrCols.push( me.createActionColumn() );
				if( !Ext.isEmpty( arrColsPref ) )
				{
					for( var i = 0 ; i < arrColsPref.length ; i++ )
					{
						objCol = arrColsPref[ i ];
						cfgCol = {};
						cfgCol.colHeader = objCol.colHeader;
						cfgCol.colId = objCol.colId;
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
			createFavoriteColumn : function()
			{
				var me = this;
				var objActionCol =
				{
					colType : 'action',
					colId : 'action',
					align : 'left', 
					colHeader: getLabel('favourite', 'Favourite'),
					width : 90,
					locked : true,
					hidden : true,
					sortable : false,
					fnColumnRenderer : function(a,b,c) {
						if (b.record.data.isFavorite === 'Y') {
							return "<a class='linkbox icon-misc-favorite'><i class='fa fa-star'></i></a>";
						} else {
							return "<a class='linkbox icon-misc-nonfavorite'><i class='fa fa-star'></i></a>";
						}
					},
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
							text : 'Generate',
							itemLabel : getLabel( 'generate', 'Generate' ),
							maskPosition : 1
						}
					]

				};
				return objActionCol;
			},

			createGroupActionColumn : function() {
				var me = this;
				var colItems = [];
				var actionsForWidget = ['Submit', 'Discard', 'Approve', 'Reject',
						'Enable', 'Disable'];
				var arrRowActions = [{
					itemId : 'btnEdit',
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : getLabel('editToolTip1', 'Edit Record'),
					itemLabel : getLabel('editToolTip1', 'Edit Record'),
					maskPosition : 1
				}, {
					itemId : 'btnView',
					itemCls : 'grid-row-action-icon icon-view',
					toolTip : getLabel('viewToolTip1', 'View Record'),
					itemLabel : getLabel('viewToolTip1', 'View Record'),
					maskPosition : 2
				}, {
					itemId : 'btnHistory',
					itemCls : 'grid-row-action-icon icon-history',
					itemLabel : getLabel('historyToolTip', 'View History'),
					toolTip : getLabel('historyToolTip', 'View History'),
					maskPosition : 3
					// fnVisibilityHandler : isIconVisible
				// fnClickHandler : showHistory
				}];
				colItems = me.getGroupActionColItems(actionsForWidget);
				var objActionCol = {
					colId : 'actioncontent',
					colType : 'actioncontent',			
					colHeader: getLabel('actions', 'Actions'),
					width : 108,
					locked : true,
					lockable : false,
					sortable : false,
					hideable : false,
					items : (arrRowActions||[]).concat(colItems||[]),
					visibleRowActionCount : 1
				};
				return objActionCol;
			},
			
			getGroupActionColItems : function(availableActions) {
					var itemsArray = [];
					if (!Ext.isEmpty(availableActions)) {
						for (var count = 0; count < availableActions.length; count++) {
							switch (availableActions[count]) {
								case 'Submit' :
									itemsArray.push({
										text : getLabel('userMstActionSubmit', 'Submit'),
										actionName : 'submit',
										itemId : 'submit',
										maskPosition : 4
											/**
											 * fnVisibilityHandler : me.isRowIconVisible,
											 * fnClickHandler : function(grid, rowIndex,
											 * columnIndex, btn, event, record) {
											 * me.handleRowActionClick(me, grid, rowIndex,
											 * columnIndex, btn, event, record); }
											 */
										});
									break;
								case 'Discard' :
									itemsArray.push({
										text : getLabel('userMstActionDiscard', 'Discard'),
										actionName : 'discard',
										itemId : 'discard',
										maskPosition : 9
											/**
											 * fnVisibilityHandler : me.isRowIconVisible,
											 * fnClickHandler : function(grid, rowIndex,
											 * columnIndex, btn, event, record) {
											 * me.handleRowActionClick(me, grid, rowIndex,
											 * columnIndex, btn, event, record); }
											 */
										});
									break;
								case 'Approve' :
									itemsArray.push({
										text : getLabel('userMstActionApprove', 'Approve'),
										itemId : 'accept',
										actionName : 'accept',
										maskPosition : 5
											/**
											 * fnVisibilityHandler : me.isRowIconVisible,
											 * fnClickHandler : function(grid, rowIndex,
											 * columnIndex, btn, event, record) {
											 * me.handleRowActionClick(me, grid, rowIndex,
											 * columnIndex, btn, event, record); }
											 */
										});
									break;
								case 'Reject' :
									itemsArray.push({
										text : getLabel('userMstActionReject', 'Reject'),
										itemId : 'reject',
										actionName : 'reject',
										maskPosition : 6
											/**
											 * fnVisibilityHandler : me.isRowIconVisible,
											 * fnClickHandler : function(grid, rowIndex,
											 * columnIndex, btn, event, record) {
											 * me.handleRowActionClick(me, grid, rowIndex,
											 * columnIndex, btn, event, record); }
											 */
										});
									break;
								case 'Enable' :
									itemsArray.push({
										text : getLabel('userMstActionEnable', 'Enable'),
										itemId : 'enable',
										actionName : 'enable',
										maskPosition : 7
											/**
											 * fnVisibilityHandler : me.isRowIconVisible,
											 * fnClickHandler : function(grid, rowIndex,
											 * columnIndex, btn, event, record) {
											 * me.handleRowActionClick(me, grid, rowIndex,
											 * columnIndex, btn, event, record); }
											 */
										});
									break;
								case 'Disable' :
									itemsArray.push({
										text : getLabel('userMstActionDisable', 'Suspend'),
										itemId : 'disable',
										actionName : 'disable',
										maskPosition : 8
											/**
											 * fnVisibilityHandler : me.isRowIconVisible,
											 * fnClickHandler : function(grid, rowIndex,
											 * columnIndex, btn, event, record) {
											 * me.handleRowActionClick(me, grid, rowIndex,
											 * columnIndex, btn, event, record); }
											 */
										});
									break;
							}

						}
					}
					return itemsArray;
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
				else if( colId === 'col_moduleName' )
				{
					strRetValue = getModuleLabel(record.get('moduleCode'),record.get( 'moduleName'));
				}
				else
					strRetValue = value;
				meta.tdAttr = 'title="' + strRetValue + '"';
				return strRetValue;
			},

			getGroupActionModel : function()
			{
				var retArray = [];
				var arrActions =
				[
					'Submit', 'Discard', 'Enable', 'Disable','Reject','Approve'
				];
				var objActions =
				{
					'Submit' :
					{
						actionName : 'submit',
						// itemCls : 'icon-button icon-discard',
						disabled : false,
						itemText : getLabel( 'reportCenterActionSubmit', 'Submit' ),
						maskPosition : 4
					},
					'Reject' :
					{
						actionName : 'reject',
						// itemCls : 'icon-button icon-discard',
						disabled : false,
						itemText : getLabel( 'reportCenterActionReject', 'Reject' ),
						maskPosition : 6
					},
					'Approve' :
					{
						actionName : 'accept',
						// itemCls : 'icon-button icon-discard',
						disabled : false,
						itemText : getLabel( 'reportCenterActionApprove', 'Approve' ),
						maskPosition : 5
					},
					'Discard' :
					{
						actionName : 'discard',
						// itemCls : 'icon-button icon-discard',
						itemText : getLabel( 'reportCenterActionDiscard', 'Discard' ),
						disabled : false,
						maskPosition : 9
					},
					'Enable' :
					{
						actionName : 'enable',
						// itemCls : 'icon-button icon-discard',
						itemText : getLabel( 'reportCenterActionEnable', 'Enable' ),
						disabled : false,
						maskPosition : 7
					},
					'Disable' :
					{
						actionName : 'disable',
						// itemCls : 'icon-button icon-discard',
						itemText : getLabel( 'reportCenterActionDisable', 'Suspend' ),
						disabled : false,
						maskPosition : 8
					}
				};

				for( var i = 0 ; i < arrActions.length ; i++ )
				{
					if( !Ext.isEmpty( objActions[ arrActions[ i ] ] ) )
						retArray.push( objActions[ arrActions[ i ] ] )
				}
				return retArray;
			},
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
			{
				
				var maskSize = 10;
				var maskArray = new Array();
				var actionMask = '';
				var rightsMap = record.data.__metadata.__rightsMap;
				var buttonMask = '';
				var retValue = true;
				var bitPosition = '';
	      var reqState = record.raw.requestState;
			  var validFlag = record.raw.validFlag;
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
                //Avoid Modify Action in case of Modified Submitted by Maker User not working
        if( ( maskPosition === 1 && retValue ) )
				{
					var submitFlag = (record.raw.draftFlag == "Y") ? "N" : "Y"; 
					var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
					retValue = retValue && (!isSubmitModified);		
				}
         //Avoid Approve & Reject Action for Maker User
				else if( ( maskPosition === 5 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
				else if( ( maskPosition === 6 && retValue ) )
				{
					retValue = retValue && isSameUser;
				}
               //Handle Enable Disable
                else if( ( maskPosition === 7 && retValue ) )
				{
					 retValue = retValue && (reqState == 3 && validFlag == 'N')
				}
				else if( ( maskPosition === 8 && retValue ) )
				{
					 retValue = retValue && (reqState == 3 && validFlag == 'Y')
				}			
				return retValue;

			},
			cloneObject : function( obj )
			{
				return JSON.parse( JSON.stringify( obj ) );
			}
		} );
