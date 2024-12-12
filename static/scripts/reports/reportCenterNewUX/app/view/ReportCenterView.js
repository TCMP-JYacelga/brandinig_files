/**
 * @class GCP.view.ReportCenterView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 */
Ext.define('GCP.view.ReportCenterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'reportCenterView',
	requires : ['Ext.ux.gcp.GroupView',			
			'GCP.view.ReportCenterFilterView'],
	autoHeight : true,
	//cls : 'ux_panel-background',	
	widgetType : null,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {};
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objReportCenterPref) {
			var objJsonData = Ext.decode(objReportCenterPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: REPORT_GENERIC_COLUMN_MODEL || '[]';
		}
		var cfgGroupByUrl = 'services/grouptype/reportCenterNewUX/groupBy.srvc';
		var strWidgetFilter = cfgGroupByUrl + '?'+csrfTokenName+'=' + tokenValue + '&$filterGridId=GRD_ADM_REPORTCEN' + '&$filter=seller eq ' + '\'' + strSeller + '\'' + ' and client eq ' + '\'' + strClient + '\'' + ' and seller eq ' + '\'' + strSeller + '\'';
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : 'Reports',
					cfgGroupByLabel : 'Group By',
					cfgGroupCode : objGroupByPref.groupCode || null,
					cfgSubGroupCode : objGroupByPref.subGroupCode || null,
					cfgParentCt : me,
					cfgShowFilter:true,
					cfgShowAdvancedFilterLink:false,
					cfgShowRefreshLink : false,
					cfgAutoGroupingDisabled : true,
					cfgSmartGridSetting:true,	
					enableQueryParam:false,
					/*padding : '12 0 0 0',*/
					cls:'t7-grid',
					cfgFilterModel : {
						cfgContentPanelItems : [{
							xtype : 'reportCenterFilterView'
						}],
						cfgContentPanelLayout : {
							type : 'vbox',
							align : 'stretch'
						}
					},
					getActionColumns : function() {
						return [me.createFavoriteColumn(),me.createGroupActionColumn()]
					},
					cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
					cfgPrefferedColumnModel : arrColumnSetting,
					cfgGridModel : {
						pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
						heightOption : objGridSetting.defaultGridSize,
						rowList : _AvailableGridSize,
						stateful : false,
						showSorterToolbar : _charEnableMultiSort,
						enableColumnAutoWidth : _blnGridAutoColumnWidth,
						hideRowNumbererColumn : true,
						showCheckBoxColumn : false,
						showSummaryRow : false,
						showEmptyRow : false,
						showPager : true,
						minHeight : 100,
						storeModel : {
							fields :
							[
								'entityCode','reportCode','reportName', 'reportDesc', 'reportType','reportTypeDesc','srcType', 'schCnt', 'pregen', 'reportStatus',
								'isFavorite','securityProfile','securityProfileId','__metadata','identifier','version','recordKeyNo','delInfo','entityDesc','isAllowSchdule','isReportAllowSchdule',
								'isAllowOndemand','isReportAllowOndemand','medium','moduleCode','sellerId','moduleName','originalSourceId','entityType','channelName','distributionId','delOutput','intRecordKeyNmbr','executeFlag'
							],
							proxyUrl : 'loadWidgetsData/',
							rootNode : 'd.reportCenter',
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
				});			
		return groupView;
	},
	getDefaultColumnModel : function() {
		var me = this, columnModel = null;
		columnModel = me.getColumns( REPORT_GENERIC_COLUMN_MODEL|| []);
		return columnModel;
	},
	getColumns : function(arrColsPref) {
		var me = this;		
		var arrCols = new Array(), objCol = null, cfgCol = null;
		/*var arr=new Array();
		arr.push( me.createActionColumn() );
		arr.push( me.createGenerateActionColumn() );
		arr.push( me.createFavoriteColumn() );
		for (var i = 0; i < arr.length; i++) {
		    if(arrColsPref[0].colId!== "favorite"){
		             arrColsPref.unshift(arr[i])
			 }
		}*/
		//arrCols.push( me.createFavoriteColumn() );
		if( !Ext.isEmpty( arrColsPref ) )
		{
			//arrColsPref.push( me.createActionColumn() );
			
			for( var i = 0 ; i < arrColsPref.length ; i++ )
			{
				cfgCol = me.cloneObject(arrColsPref[i]);
				
				if(cfgCol.colId === 'schCnt' || cfgCol.colId === 'pregen')
				{
					cfgCol.align = "right";
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				//cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width  : objGridWidthMap[ objCol.colId ];
				//cfgCol.width =  200;
				arrCols.push( cfgCol );
			}
		}
		return arrCols;
	},
	createFavoriteColumn : function() {
				var me = this;
				var objActionCol =
				{
					colType : 'action',
					colId : 'favorite',
					align : 'left', 
					colHeader: getLabel('favourite', 'Favourite'),
					width : 90,
					locked : true,
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
								if(_IsEmulationMode == true)
								{
									Ext.MessageBox.show(
											{
												title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
												msg : getLabel( 'emulationError', 'You are in emulation mode and cannot perform save or update.' ),
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
												icon : Ext.MessageBox.ERROR
											} );
								}
								else
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
			colHeader : 'Action',
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 80,
			locked : true,
			//items :
			//[
				//{
			itemId : 'btnGenrate'
			//text : 	'Generate',
			//itemLabel : getLabel( 'generate', 'Generate' ),
			//maskPosition : 1
				//}
			//]

		};
		return objActionCol;
	},
	
	createActionColumn : function( widgetCodeVal )
	{
		var me = this;
		var objActionCol;
		if( widgetCodeVal == '15' )
		{
			objActionCol =
			{
				colType : 'actioncontent',
				colId : 'actionId',
				width : 70,
				locked : true,
				items : []
	
			};
		}
		else
		{
			objActionCol =
			{
				colType : 'actioncontent',
				colId : 'actionId',
				width : 70,
				locked : true,
				items :
				[
					/*{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel( 'viewToolTip', 'Edit' ),
						maskPosition : 2
					}*/
				]
	
			};
		}
		return objActionCol;
	},
	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var strRetValue = "";
		//console.log(colId);
		if( colId === 'col_pregen')
		{
			if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
				return;
			else if(value != '0' && value != '')
			{
				//strRetValue = value;
				strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="seePregenerated">..See</a>';
			}
		}
		else if( colId === 'col_favorite' )
			{
				var me = this;
				if( !record.get( 'isEmpty' ) )
				{
					if( record.data.isFavorite === 'Y' )
					{
						strRetValue = '<a title="'
											+ '" class="linkbox misc-icon icon-misc-favorite"></a>';
					}
					else
					{
						strRetValue = '<a title="' 
											+ '"class="linkbox misc-icon icon-misc-nonfavorite"></a>';
					}
				}
			}
		else if( colId === 'col_reportName' )
			{
				var me = this;
				if( 'R' == record.get( 'srcType' ) )
				{
					strRetValue = getReportDescLabel(record.get('reportCode'),record.get( 'reportName'));
				}
				else
				{
					strRetValue = value;
				}
			}
		else if( colId === 'col_reportDesc' )
			{
				if(record.get("srcType") == 'R')
				{
					strRetValue = getReportDescLabel(record.get('reportCode'),record.get( 'reportDesc'));
				}
				else
				{
					strRetValue = getReportDescLabel(record.get('reportName'),record.get( 'reportDesc'));
				}
				
			}
		else if( colId === 'col_moduleName' )
		{
			strRetValue = getModuleLabel(record.get('moduleCode'),record.get( 'moduleName'));
		}
		else if( colId === 'col_reportStatus' )
		{
			strRetValue = getLabel("lbl.reportcenter.status."+record.get('reportStatus'),record.get( 'reportStatus'));
		}
		else
				strRetValue = value;
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},

	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Submit','Discard','Enable','Disable'];
		var objActions = {
			'Submit' : {
				actionName : 'reportCenterSubmit',
				// itemCls : 'icon-button icon-discard',
				disabled : false,
				itemText : getLabel('reportCenterActionSubmit', 'Submit'),
				maskPosition : 3
			},
			'Discard' : {
				actionName : 'reportCenterDiscard',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('reportCenterActionDiscard', 'Discard'),
				disabled : false,
				maskPosition : 4
			},
			'Enable' : {
				actionName : 'reportCenterEnable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('reportCenterActionEnable', 'Enable'),
				disabled : false,
				maskPosition : 5
			},
			'Disable' : {
				actionName : 'reportCenterDisable',
				// itemCls : 'icon-button icon-discard',
				itemText : getLabel('reportCenterActionDisable', 'Disable'),
				disabled : false,
				maskPosition : 6
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
	{
		var maskSize = 5;
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
		
		var isSameUser = false;
		if(record.raw.reportType =='C' && record.raw.createdBy === USER )
		{
			isSameUser = true;
		}
		if( Ext.isEmpty( bitPosition ) )
			return retValue;
		retValue = isActionEnabled( actionMask, bitPosition );
		if(itmId == 'btnAddSchedule'){
			retValue = true; // Quick Fix..Not used the Mask Position.
			if(isScheduleAllow == 'true' && record.get("executeFlag") == "Y")
				if((record.get("srcType") == 'R' && record.get("isReportAllowSchdule") == 'Y') || (record.get("srcType") == 'D' && record.get("isAllowSchdule") == 'Y'))
					retValue = true;
				else 
					retValue = false;
			else
				retValue = false;
		}
		if(itmId == 'btnSecurity'){
			if(isSecPrfAllow == 'false')
				retValue = false;
			else {
				if(isSameUser || record.raw.reportType !='C')
			       retValue = true;
				else
					retValue = false;
			}
		}
		return retValue;
	
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [
			{
				itemId : 'btnGenerate',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('generateReport', 'Generate'),
				itemLabel : getLabel('generateReport', 'Generate'),
				fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record ){
						me.fireEvent( 'generateReportId', record );
				},
				maskPosition : 1
			},
			{
				itemId : 'btnAddSchedule',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('addSchedule', 'Add Schedules'),
				itemLabel : getLabel('addSchedule', 'Add Schedules'),
				maskPosition : 1,
				fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record ){
						me.fireEvent( 'addSchedule', record );
				}
			},
			{
				itemId : 'btnSecurity',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('securityConfig', 'Security Config'),
				itemLabel : getLabel('securityConfig', 'Security Config'),
				maskPosition : 1,
				fnClickHandler : function( tableView, rowIndex, columnIndex, btn, event, record ){
						me.fireEvent( 'securityProfile', record, tableView );
				}
			}			
		];
		
		var arrRowActions = [];
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions','Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			items : arrRowActions.concat(colItems || []),
			visibleRowActionCount : 1
		};
		return objActionCol;
	}	
});