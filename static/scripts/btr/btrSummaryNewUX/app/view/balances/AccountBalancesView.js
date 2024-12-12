/**
 * @class GCP.view.balances.AccountBalancesView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.balances.AccountBalancesView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountBalancesView',
	requires : ['Ext.panel.Panel', 'Ext.container.Container', 'Ext.Img',
			'Ext.form.Label', 'Ext.button.Button', 'Ext.form.field.Text',
			//'GCP.view.balances.AccountBalancesTitleView',
			'GCP.view.balances.AccountBalancesFilterView',
			//'GCP.view.common.SummaryRibbonView',
			'GCP.view.balances.AccountBalancesGraphView','Ext.ux.gcp.GridHeaderFilterView'],
	autoHeight : true,
	width : '100%',
	accountFilter : null,
	gridModel : null,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.on('refreshGroupView', function() {
			me.refreshGroupView();
		});
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	createGroupView:function(){
		var me=this;
		var groupView = null;
		var arrCols = new Array(),arrSorters=new Array(),arrColsPref = null;
		var data = me.gridModel;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		if(objSaveBalancesLocalStoragePref){
			var objLocalData = Ext.decode(objSaveBalancesLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}
		
		arrColsPref = data.gridCols;
		arrCols = me.getColumns(arrColsPref);
		arrSorters=data.sortState;
		pgSize = data.pgSize || _GridSizeTxn;
		showPager = data.gridSetting
					&& !Ext.isEmpty(data.gridSetting.showPager)
					? data.gridSetting.showPager
					: true;
		heightOption = data.gridSetting
				&& !Ext.isEmpty(data.gridSetting.heightOption)
				? data.gridSetting.heightOption
				: null;	
				
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		
		if (objHistoryPref) {
			var objJsonData = Ext.decode(objHistoryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericBalanceColumnModel || '[]');
		}
				
		groupView=Ext.create("Ext.ux.gcp.GroupView",{
			cfgGroupByUrl : 'static/scripts/btr/btrSummaryNewUX/data/balanceGroupBy.json',
			cfgSummaryLabel : 'Balances',
			cfgGroupByLabel : 'Group By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			// cfgSubGroupCode : objGeneralSetting.subGroupCode || null,					
			cfgParentCt : me,
			enableQueryParam:false,
			itemId : 'balanceGrid',
			cls : 't7-grid',					
			cfgShowFilter : true,										
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgGroupingDisabled : true,
			cfgShowAdvancedFilterLink : false,
			cfgShowRibbon : objClientParameters.enableSummaryRibbon,
			cfgRibbonModel : { items : [{xtype : 'container', html : '<div id="summaryCarousalBalanceTargetDiv"></div>'}], itemId : 'summaryCarousalBalance',showSetting : true },
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'accountBalancesFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
					return [me.createActionColumn()]
			},
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				hideRowNumbererColumn : true,
				showCheckBoxColumn : false,
				showPagerRefreshLink : false,
				showSummaryRow : false,
				stateful : false,
				showEmptyRow : false,
				showPager:showPager,
				minHeight : 100,
				pageSize : objLocalPageSize || objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				autoSortColumnList : true,
				storeModel : {
						fields : ['date', 'availablebalance', 'bookbalance',
								'mapTypeCodes', 'totaldebitamount', 'summaryDate',
								'debitcount', 'totalcreditamount',
								'creditcount', 'identifier', 'currencyCode',
								'currencySymbol', 'accountCalDate','subFacilityDesc','subFacilityCode',
								'accountId', 'summaryISODate', 'sessionNumber',
								'accountNumber','isHistoryFlag','accountName'],
						proxyUrl : 'services/btrBalanceHistory/'+summaryType+'/accountHistory',
						rootNode : 'd.summary',
						sortState:arrSorters,
						totalRowsNode : 'd.__count'
					},
					isRowIconVisible : me.isRowIconVisible,
					defaultColumnModel : arrCols,
					fnColumnRenderer : me.columnRenderer,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					heightOption : objGridSetting.defaultGridSize,
					showSorterToolbar : _charEnableMultiSort //For Multisort
			}
		});
		return groupView;
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				cfgCol = me.cloneObject(arrColsPref[i]);
				if (cfgCol.metaInfo && cfgCol.metaInfo.isTypeCode && cfgCol.metaInfo.isTypeCode === 'Y'){
						cfgCol.sortable = false;
				}
				cfgCol.fnColumnRenderer = function(value, meta, record,
						rowIndex, colIndex, store, view, colId) {
					return me.columnRenderer(value, meta, record, rowIndex,
							colIndex, store, view, colId);
				}
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	createActionColumn : function() {
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'actioncontent',
			colHeader : getLabel('actions', 'Actions'),
			locked : true,
			width : 108,
			lockable : false,
			sortable : false,
			hideable : false,
			visibleRowActionCount : 0,
			items : [{
				itemId : 'additionalinfo',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewAdditionalInfo', 'View Additional Info'),
				itemLabel : getLabel('viewAdditionalInfo', 'View Additional Info')
			}]
		};
		return objActionCol;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return;
		var strRetValue = "";
		var column = view.getHeaderAtIndex(colIndex);
		var isTypeCode = (column.metaInfo && column.metaInfo.isTypeCode)
				? column.metaInfo.isTypeCode
				: 'N';

		if (isTypeCode === 'N') {
			if (colId === 'col_summaryDate') {
				if (activityFeature) {
					strRetValue = '<span class="activitiesLink cursor_pointer button_underline thePoniter ux_font-size14-normal" title="View Activity">'
							+ value + '</span> ';
				} else {
					strRetValue = value;
				}

			} else
				strRetValue = value;
		} else {
			var strDataType = column.colType || 'string';
			var strCCY = !Ext.isEmpty(record.get('currencySymbol')) ? record
					.get('currencySymbol') : '';
			if (strDataType != 'amount')
				strCCY = '';
			var typecode = colId.substring(4);
			var colVal = record.get('mapTypeCodes')[typecode];
			if (colVal == null) {
				strRetValue = '';
			} else
				strRetValue = strCCY + ' ' + colVal;
		}
		meta.tdAttr = 'title="' + strRetValue + '"';	
		return strRetValue;
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	refreshGroupView : function() {
		var me = this;
		var grid = me.down('grid[xtype="smartgrid"]');
		if (!Ext.isEmpty(grid)) {
			grid.refreshData();
		}
	}
});