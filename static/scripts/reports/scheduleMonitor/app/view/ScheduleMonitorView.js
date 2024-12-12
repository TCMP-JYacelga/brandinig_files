/**
 * @class GCP.view.scheduleMonitorView
 * @extends Ext.panel.Panel
 * @author Naresh Mahajan
 */
Ext.define('GCP.view.ScheduleMonitorView', {
	extend : 'Ext.panel.Panel',
	xtype : 'scheduleMonitorView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.ScheduleMonitorTitleView',
			'GCP.view.ScheduleMonitorFilterView',
			'GCP.view.ScheduleMonitorGridInformationView','Ext.tab.Panel',
			'Ext.tab.Tab', 'Ext.layout.container.HBox', 'Ext.form.Label',
			'Ext.button.Button', 'Ext.Img', 'Ext.panel.Panel',
			'Ext.ux.portal.WidgetContainer', 'Ext.form.field.Text',
			'Ext.container.Container', 'Ext.form.RadioGroup'],
			
			
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	widgetType : null,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [{
					xtype : 'scheduleMonitorTitleView',
					cls : 'ux_no-border ux_largepaddingtb ux_panel-background'
				},{
					xtype : 'scheduleMonitorFilterView',
					margin : '0 0 12 0'
				},
				/*{
					xtype : 'scheduleMonitorGridInformationView',
					margin : '0 0 12 0'		
				}
				*/
				, groupView];
		
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {};
		var cfgGroupByUrl = 'services/grouptype/scheduleMonitor/groupBy.srvc';
		var strWidgetFilter = cfgGroupByUrl+ '?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+strSeller+'\'' + ' and seller eq '+'\''+strSeller+'\''
		 + '&$filterscreen=BANKSCHEDULE';
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : getLabel('cfgSummaryLabel', 'SCHEDULES'),
					cfgGroupByLabel : getLabel('GroupBy', 'Group By'),
					cfgGroupCode : objGroupByPref.groupCode || null,
					cfgSubGroupCode : objGroupByPref.subGroupCode || null,
					cfgParentCt : me,
					cfgGridModel : {
						pageSize : _GridSizeTxn,
						rowList : _AvailableGridSize,
						stateful : false,
						hideRowNumbererColumn : true,
						showCheckBoxColumn : false,
						showSummaryRow : true,
						showEmptyRow : false,
						showPager : true,
						minHeight : 100,
						storeModel : {
							fields :
							[
								'moduleName','schSrcName','schSrcDescription','seller','Type','schCnt','formatSchNextGenDate','maxThreadCount',
								'schDelMedium','schModuleName','schDelOutput','scheduleCount','itemsInQueue','schSrcType','schMode','schSrcId',
								'schEntityType','schEntityCode','scheduleStatus','identifier','__metadata','entityDesc','schId','scheduleName'
							],
							proxyUrl : 'loadScheduleMonitorWidgetsData/',
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
		columnModel = me.getColumns( BANK_GENERIC_COLUMN_MODEL|| []);
		return columnModel;
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push( me.createFavoriteColumn() );
		arrCols.push( me.createGroupActionColumn() );
		//arrCols.push( me.createActionColumn() );
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

				if( objCol.hidden === true )
				{
					cfgCol.hideable = true;
					cfgCol.hidden = true;
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				cfgCol.width = !Ext.isEmpty( objGridWidthMap[ objCol.colId ] ) ? objGridWidthMap[ objCol.colId ] : 200;
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
			colType : 'actioncontent',
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
	createActionColumn : function(  )
	{
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'action',
			width : 50,
			align : 'right',
			sortable : false,
			locked : true,
			lockable: false,
			hideable: false,
			items : [
						{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit'),
						maskPosition : 1
					}]
		};
		return objActionCol;
	},
	
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			colHeader : getLabel('actions','Actions'),
			width : 120,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items: [{
						text :  getLabel('reportCenterActionSkip', 'Skip'),
						itemId : 'scheduleMonitorSuspend',
						actionName : 'scheduleMonitorSuspend',
						maskPosition : 1
					},{
						text : getLabel('reportCenterActionDelay', 'Delay'),
						itemId : 'scheduleMonitorDelay',
						actionName : 'scheduleMonitorDelay',
						maskPosition : 2
					},{
						text : getLabel('reportCenterActionHold', 'Hold'),
						itemId : 'scheduleMonitorHold',
						actionName : 'scheduleMonitorHold',
						maskPosition : 3
					},{
						text : getLabel('reportCenterActionResume', 'Resume'),
						itemId : 'scheduleMonitorResume',
						actionName : 'scheduleMonitorResume',
						maskPosition : 4
					},
					{
						text : getLabel('reportCenterActionReset', 'Reset'),
						itemId : 'scheduleMonitorReset',
						actionName : 'scheduleMonitorReset',
						maskPosition : 5
					}]
		};
		return objActionCol;
	},
	
	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var strRetValue = "";
		if( colId === 'col_schSrcType' )
			{
				strRetValue = getLabel('srcType.'+value, value);
			}
		else if( colId === 'col_favorite' )
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
		return null;
	},
	isRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
	{
		
		var maskSize = 6;
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
		if( Ext.isEmpty( bitPosition ) )
			return retValue;
		retValue = isActionEnabled( actionMask, bitPosition );
		
		return retValue;
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
});