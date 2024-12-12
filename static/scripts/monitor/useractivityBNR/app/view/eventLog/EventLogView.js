/**
 * @class GCP.view.eventLog.EventLogView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.eventLog.EventLogView', {
	extend : 'Ext.panel.Panel',
	xtype : 'eventLogView',
	requires : ['GCP.view.eventLog.EventLogFilterView',
			'Ext.ux.gcp.GroupView'],
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
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		if (objEventSavePreferences) {
			var objJsonData = Ext.decode(objEventSavePreferences);
			//objGroupByPref = objJsonData.d.preferences.groupByPref || {};
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					:(EVENTLOG_GENERIC_COLUMN_MODEL || '[]');
		}
		//blnShowAdvancedFilter = !isHidden('AdvanceFilter');
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			//cfgGroupByUrl : 'services/grouptype/eventLog/groupBy.json?$filterscreen=eventGrpViewFilter&$filterGridId=GRD_ADM_EVENTLOG',
			// Removed advancedfilter url parameter as not supporting in groupby
			cfgGroupByUrl : 'services/grouptype/eventLog/groupBy.json?$filterGridId=GRD_ADM_EVENTLOG',
			cfgSummaryLabel : getLabel('lbl.eventLog.summaryLabel', 'Event Log'),
			cfgGroupByLabel : getLabel('groupedby', 'Grouped By'),
			cls : 't7-grid',
			cfgShowFilter : true,
			enableQueryParam:false,
			cfgShowAdvancedFilterLink : true,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'eventLogFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGroupCode : objGroupByPref.defaultGroupByCode || null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				showSorterToolbar : _charEnableMultiSort,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				showEmptyRow : false,
				showCheckBoxColumn : false,
				showPager : true,
				minHeight : 100,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : arrActionColumnStatus || []
							}]
				},
				storeModel : {
					fields : ['eventTime','userCode','channel','userMessage','module','accountNo','actionTaken','page',
					          'clientId','userCategory','ipAdress','isAdmin','field1','field2','field3','field4','userName',
					          'systemMessage','emulatingUserId','department','trackingNumber'],
					proxyUrl : 'eventLogGridList.srvc',
					rootNode : 'd.eventlist',
					totalRowsNode : 'd.__count'
				},
				//groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me
						.getColumnModel(EVENTLOG_GENERIC_COLUMN_MODEL),
				/**
				 * @cfg{Function} fnColumnRenderer Used as default column
				 *                renderer for all columns if fnColumnRenderer
				 *                is not passed to the grids column model
				 */
				fnColumnRenderer : me.columnRenderer,
				/**
				 * @cfg{Function} fnSummaryRenderer Used as default column
				 *                summary renderer for all columns if
				 *                fnSummaryRenderer is not passed to the grids
				 *                column model
				 */
				// fnSummaryRenderer : function(value, summaryData, dataIndex,
				// rowIndex, colIndex, store, view, colId) {
				// },
				/**
				 * @cfg{Function} fnRowIconVisibilityHandler Used as default
				 *                icon visibility handler for all columns if
				 *                fnVisibilityHandler is not passed to the grids
				 *                "actioncontent" column's actions
				 * 
				 * @example
				 * fnRowIconVisibilityHandler : function(store, record, jsonData,
				 *		iconName, maskPosition) { 
				 * 	return true;
				 *}
				 * 
				 * @param {Ext.data.Store}
				 *            store The grid data store
				 * @param {Ext.data.Model}
				 *            record The record for current row
				 * @param {JSON}
				 *            jsonData The response json data
				 * @param {String}
				 *            iconName The name of the icon
				 * @param {Number}
				 *            maskPosition The position of the icon action in
				 *            bit mask
				 * @return{Boolean} Returns true/false
				 */
				fnRowIconVisibilityHandler : me.isRowIconVisible

			}
		});
		return groupView
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		/*if (itmId == "btnQuickPay") {
			var paymentType = record.data.paymentType;
			if (!Ext.isEmpty(paymentType) && paymentType == "QUICKPAY")
				return true;
			else
				return false;
		} else {
			var maskSize = 18;
			var maskArray = new Array();
			var actionMask = '';
			var rightsMap = record.data.__metadata.__rightsMap;
			var buttonMask = '';
			var retValue = true;
			var bitPosition = '';
			if (!Ext.isEmpty(maskPosition)) {
				bitPosition = parseInt(maskPosition) - 1;
				maskSize = maskSize;
			}
			if (!Ext.isEmpty(jsonData)
					&& !Ext.isEmpty(jsonData.d.__metadata.__buttonMask))
				buttonMask = jsonData.d.__metadata.__buttonMask;
			maskArray.push(buttonMask);
			maskArray.push(rightsMap);
			actionMask = doAndOperation(maskArray, maskSize);
			if (Ext.isEmpty(bitPosition))
				return retValue;
			retValue = isActionEnabled(actionMask, bitPosition);
			return retValue;
		}*/
		return true;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		/*if (colId === 'col_action') {
			strRetValue = '<a href="#" onclick="getEventLogView();">' + '<span> View </span>' + '</a>'
		}
		else*/
		if(colId === 'col_isAdmin'){
			if(record.data.isAdmin == 1)
				 strRetValue = "Customer";
			else if (record.data.isAdmin == 0)
				 strRetValue = "Bank";
		}
		else if(colId === 'col_channel'){
			if(value === 'MOBILEENTRY')
				strRetValue = "Mobile";
			else
				strRetValue = "Web";
		}
		
		else if(colId=== 'col_module')
		{
			value = value.replace(/\s/g,'');
			switch(value)
			{
				case 'Admin':strRetValue=getLabel('Admin','Admin');break;
				case 'BalanceReporting':strRetValue=getLabel('BalanceReporting','Balance Reporting');break;
				case 'Payments':strRetValue=getLabel('Payments','Payments');break;
				case 'LMS':strRetValue=getLabel('LMS','LMS');break;
				case 'Receivables':strRetValue=getLabel('Receivables','Receivables');break;
				case 'Loans':strRetValue=getLabel('Loans','Loans');break;
				case 'SCF':strRetValue=getLabel('SCF','SCF');break;
				case 'PositivePay':strRetValue=getLabel('PositivePay','Positive Pay');break;
				case 'CheckManagement':strRetValue=getLabel('CheckManagement','Check Management');break;
				default:strRetValue="";
			}
		}
		else
			strRetValue = value;
		
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},
	getColumnModel : function(arrCols) {
		var me = this;
		var arrColumns = [];
		return arrColumns.concat(arrCols || []);
	}
});