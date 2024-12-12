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
		if (objGridViewPref) {
			var objJsonData = Ext.decode(objGridViewPref);
			objGroupByPref = objJsonData || {};
		}
		var cfgGroupByUrl = 'services/grouptype/reportCenterNewUX/groupBy.srvc';
		var strWidgetFilter = cfgGroupByUrl+ '?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+strSeller+'\'';
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : 'Reports',
					cfgGroupByLabel : 'Group By',
					padding:'12 0 0 0',
					cfgSmartGridSetting:true,
					cfgShowFilter:true,
					cls:'t7-grid',
					cfgFilterModel : {
						cfgContentPanelItems : [{
							xtype : 'reportCenterFilterView',
							itemId:'reportCenterFilterId'
						}],
						cfgContentPanelLayout : {
							type : 'vbox',
							align : 'stretch'
						}
					},
					cfgGroupCode : objGroupByPref.groupCode || null,
					cfgSubGroupCode : objGroupByPref.subGroupCode || null,
					cfgParentCt : me,
					/*getActionColumns : function() {
					return me.createActionColumn();
					},*/
					cfgGridModel : {
						pageSize : _GridSizeTxn,
						rowList : _AvailableGridSize,
						stateful : false,
						checkBoxColumnWidth : _GridCheckBoxWidth,
						hideRowNumbererColumn : true,	
						showCheckBoxColumn : true,
						showSummaryRow : true,
						showEmptyRow : false,
						showPager : true,
						minHeight : 100,
						storeModel : {
							fields :
							[
								'entityCode','reportCode','reportName', 'reportType','reportTypeDesc','srcType', 'schCnt', 'pregen', 'reportStatus',
								'isFavorite','securityProfile','securityProfileId','__metadata','identifier','version','recordKeyNo','delInfo','entityDesc',
								'medium','moduleCode','sellerId','moduleName','originalSourceId','entityType','channelName','distributionId','delOutput','intRecordKeyNmbr'
							],
							proxyUrl : 'loadWidgetsData/',
							rootNode : 'd.reportCenter',
							totalRowsNode : 'd.__count'
						},
						defaultColumnModel : me.getDefaultColumnModel(),
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
		arrCols.push( me.createFavoriteColumn() );
		arrCols.push( me.createGenerateActionColumn() );
		arrCols.push( me.createActionColumn() );
		if( !Ext.isEmpty( arrColsPref ) )
		{
			for( var i = 0 ; i < arrColsPref.length ; i++ )
			{
				objCol = arrColsPref[ i ];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
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
				cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width  : objGridWidthMap[ objCol.colId ];
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
	
	createActionColumn : function( widgetCodeVal )
	{
		var me = this;
		var objActionCol;
		if( widgetCodeVal == '15' )
		{
			objActionCol =
			{
				colType : 'actioncontent',
				colId : 'actioncontent',
				width : 40,
				locked : true,
				items : []
	
			};
		}
		else
		{
			objActionCol =
			{
				colType : 'actioncontent',
				colId : 'actioncontent',
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
		}
		return objActionCol;
	},
	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var strRetValue = "";
		if( colId === 'col_schCnt')
		{
			if(!Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'reportStatus' ) !== 'DRAFT')
			{
				if(record.get('moduleCode') == '15'){
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
		else if( colId === 'col_securityProfile')
		{
			if(record.get('moduleCode') == '15'){
				return;
			}
			if(record.get("srcType") == 'R')
			{
				if(value != null && value != '')
				{
					strRetValue = value;
					strRetValue += '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="editProfile">..Edit</a>';
				}
				else
				{
					strRetValue = value;
					strRetValue += '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="selectProfile">..Select</a>';
				}
			}
			else
			{
				strRetValue = value;
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
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
});