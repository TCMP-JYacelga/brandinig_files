/**
 * @class GCP.view.jobMonitorView
 * @extends Ext.panel.Panel
 * @author Naresh Mahajan
 */
Ext.define('GCP.view.JobMonitorView', {
	extend : 'Ext.panel.Panel',
	xtype : 'jobMonitorView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.JobMonitorTitleView',
			'GCP.view.JobMonitorFilterView',
			'GCP.view.JobMonitorGridInformationView','Ext.tab.Panel',
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
					xtype : 'jobMonitorTitleView',
					cls : 'ux_no-border ux_largepaddingtb ux_panel-background'
				},{
					xtype : 'jobMonitorFilterView',
					margin : '0 0 12 0'
				},
				/*{
					xtype : 'jobMonitorGridInformationView',
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
		var cfgGroupByUrl = 'services/grouptype/jobMonitor/groupBy.srvc';
		var strWidgetFilter = cfgGroupByUrl+ '?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+strSeller+'\'' + ' and seller eq '+'\''+strSeller+'\''
		 + '&$filterscreen=BANKSCHEDULE';
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					cfgGroupByUrl : strWidgetFilter,
					cfgSummaryLabel : getLabel('jobSummaryLabel', 'JOBS'),
					cfgGroupByLabel : 'Group By',
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
								'jobType','jobId','scheduleRef','jobSrcName','jobSrcType','medium','format','jobModuleName',
								'executionDate','createdDate','completedDate','jobStatus','entityDesc','seller','entityType','entityCode',
								'identifier','__metadata','jobSrcDescription','channelName','mediaDetails','parentExecutionId','txnAmount',
								'mediaDetails'
							],
							proxyUrl : 'loadJobMonitorWidgetsData/',
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
			colType : 'actioncontent',
			colId : 'action',
			width : 85,
			align : 'center',
			sortable : false,
			locked : true,
			lockable: false,
			hideable: false,
			items : [
						{
						itemId : 'btnViewSuccess',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewsuccess', 'View Success'),
						itemLabel : getLabel('viewsuccess', 'View Success'),
						maskPosition : 1
					},
					{
						itemId : 'btnViewError',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewerror', 'View Error'),
						itemLabel : getLabel('viewerror', 'View Error'),
						maskPosition : 2
					},
					{
						itemId : 'btnReUpload',
						itemCls : 'grid-row-action-icon icon-history',
						toolTip : getLabel('reupload', 'Re Upload'),
						itemLabel : getLabel('reupload', 'Re Upload'),
						maskPosition : 3
					},
					{
						itemId : 'btnDownload',
						itemCls : 'grid-row-action-icon icon-clone',
						toolTip : getLabel('downloadtitle', 'Download'),
						itemLabel : getLabel('downloadtitle', 'Download'),
						maskPosition : 4
					},
					{
						itemId : 'btnViewErrReport',
						itemCls : 'grid-row-action-icon icon-error',
						toolTip : getLabel('viewErrorReport', 'View Error Report'),
						itemLabel : getLabel('viewErrorReport', 'View Error Report'),
						maskPosition : 5
					},
					{
						itemId : 'btnRetry',
						itemCls : 'grid-row-action-icon icon-retry',
						toolTip : getLabel('retry', 'Retry'),
						itemLabel : getLabel('retry', 'Retry'),
						maskPosition : 6
					}]
		};
		return objActionCol;
	},
	
	columnRenderer : function( value, meta, record, rowIndex, colIndex, store, view, colId )
	{
		var strRetValue = "";
		if( colId === 'col_jobSrcType' )
		{
			strRetValue = getLabel('srcType.'+value, value);
		}
		else if( colId === 'col_jobStatus' )
		{
			strRetValue = getLabel('jobStatus.'+value, value);
		}
		else
		{
			strRetValue = value;
		}			
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
		var retValue = false;
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