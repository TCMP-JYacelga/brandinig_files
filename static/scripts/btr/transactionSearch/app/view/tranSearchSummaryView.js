/** 
 * @class GCP.view.tranSearchSummaryView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.tranSearchSummaryView', {
	extend : 'Ext.panel.Panel',
	xtype : 'tranSearchSummaryView',
	requires : ['Ext.ux.gcp.GroupView','GCP.view.tranSearchTiltleView','GCP.view.tranSearchFilterView'],
	autoHeight : true,
	width : '100%',
	cls : 'ux_panel-background',
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [{
					xtype : 'tranSearchTiltleView',
					cls : 'ux_no-border ux_largepaddingtb ux_panel-background'
				}, {
					xtype : 'tranSearchFilterView',
					margin : '0 0 12 0',
					collapsed : filterRibbonCollapsed
				},groupView];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {}
		if (objTranSearchGroupByPref && Ext.isEmpty(widgetFilterUrl)) {
			var objJsonData = Ext.decode(objTranSearchGroupByPref);
			objGroupByPref = objJsonData || {};
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					//cfgGroupByUrl : Ext.String
					//		.format(
					//				'services/grouptype/btrSummary/groupBy.json?$filter={0}',
					//				summaryType),
					//cfgGroupByUrl : 'static/scripts/btr/transactionSearch/data/groupBy.json',
					cfgGroupByUrl : 'services/grouptype/transactionSearchSummary/groupBy.json',
					cfgSummaryLabel : 'Accounts',
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
						showSummaryRow : false,
						showEmptyRow : false,
						showPager : true,
						minHeight : 100,
						storeModel : {
							fields : ['notes', 'postingDate', 'typeCodeDesc',
										'typeCode', 'customerRefNo', 'text',
										'creditUnit', 'debitUnit', 'sequenceNumber',
										'sessionNumber', 'remittance', 'currency',
										'currencySymbol', 'accountId', 'bankRef',
										'identifier', 'info20', 'info11', 'info12',
										'info13', 'info14', 'info15', 'info16',
										'info17', 'info18', 'info19', 'info1', 'info2', 'info3',
										'runningLegBalance', 'accountNo', 'valueDate',
										'fedReference', 'customerRefNo', 'txnAmount',
										'noteText', 'isHistoryFlag','noteFilename','accountName'],
								proxyUrl : 'services/activities/transactionSearch',
								rootNode : 'd.btractivities',
								//sortState:arrSorters,
								totalRowsNode : 'd.__count'
						},
						defaultColumnModel : me.getDefaultColumnModel(),
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
		return groupView
	},

	getDefaultColumnModel : function() {
		var me = this, columnModel = null;
		if(objDefPref['TXNSEARCH']['GRID'][mapService['BR_GRIDVIEW_GENERIC']])
			columnModel = me.getColumns(objDefPref['TXNSEARCH']['GRID'][mapService['BR_GRIDVIEW_GENERIC']]['columnModel'] || []);
		else	
			columnModel = [];
		return columnModel;
	},
	getDefaultColumnPreferences : function () {
		if(objDefPref['TXNSEARCH']['GRID'][mapService['BR_GRIDVIEW_GENERIC']])
			return objDefPref['TXNSEARCH']['GRID'][mapService['BR_GRIDVIEW_GENERIC']]['columnModel'];
		else 
			return [];
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
				colId : 'actioncontent',
				colType : 'actioncontent',
				width : 80,
				locked : true,
				lockable : false,
				sortable : false,
				hideable : false,
				visibleRowActionCount : 2,
				items : [{
							itemId : 'notes',
							itemCls : 'grid-row-attach-icon',
							toolTip : getLabel('notes', 'Notes'),
							itemLabel : getLabel('notes', 'Notes')
						}, {
							itemId : 'txnDetails',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('txnDetails', 'Transaction Details'),
							itemLabel : getLabel('txnDetails',
									'Transaction Details')
						}, {
							itemId : 'email',
							itemCls : 'grid-row-email-icon',
							toolTip : getLabel('email', 'Email'),
							itemLabel : getLabel('email', 'Email')
						}, {
							itemId : 'check',
							itemCls : 'grid-row-check-icon',
							toolTip : getLabel('checkimg', 'Image'),
							itemLabel : getLabel('checkimg', 'Image')
						}]
			};
			return objActionCol;
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActionColumn());

		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				cfgCol = me.cloneObject(arrColsPref[i]);
				if (cfgCol.isTypeCode){
					cfgCol.metaInfo = {
						isTypeCode : cfgCol.isTypeCode
					};
					if(cfgCol.isTypeCode === 'Y'){
						cfgCol.sortable = false;
					}
				}
				if (i === 0) {
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, colId) {
						var strRet = getLabel('total', 'Total');
						return strRet;
					}
				}
				// Summary Render logic will goes here, use allowSubTotal
				if (cfgCol.allowSubTotal === 'Y') {
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, rowIndex, colIndex, store, view, colId) {
						var strRet = '';
						var strKey = colId;
						if (strKey && !this.hidden) {
							var data = store.proxy.reader.jsonData, objMap = null;
							strKey = strKey.substring(4);
							if (data && data.d && data.d.__columnSubTotal) {
								objMap = data.d.__columnSubTotal;
								if (!Ext.isEmpty(objMap)
										&& !Ext.isEmpty(objMap[strKey])) {
									strRet = ' ' + (me.equiCcySymbol || '')
											+ ' ' + objMap[strKey];
								}
							}
						}
						return strRet;
					}
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this;
		var strRetValue = "";
		if ((colId === 'col_creditUnit') || (colId === 'col_debitUnit')) {
			if (!Ext.isEmpty(record.get('isEmpty'))
					&& record.get('isEmpty') === true)
				return;
			else {
				if (value == null || value == 0 || value == 0.00) {
					strRetValue = '';
				} else if (colId === 'col_debitUnit') {
					if (value.indexOf("-") == 0) {
						value = value.substring(1);
					}
					var strCCY = !Ext.isEmpty(record.get('currencySymbol'))
							? record.get('currencySymbol')
							: (me.accCcySymbol || '');
					strRetValue = '<span class="red">' + strCCY + ' ' + value
							+ '</span>';
				} else {
					var strCCY = !Ext.isEmpty(record.get('currencySymbol'))
							? record.get('currencySymbol')
							: (me.accCcySymbol || '');
					strRetValue = strCCY + ' ' + value;
				}
			}
		} else if (colId === 'col_typeCodeDesc') {
			meta.tdAttr = 'title="' + value + '"';
			strRetValue = value;
			if (this.summaryType === 'P'
					&& record.get('info20') === 'Y'
					&& (objClientParameters && objClientParameters.enableExpandedWire)) {
				strRetValue += '<img src="static/images/misc/icon_fedwire.gif" id="iconFedWire" class="thePointer" title="Incoming Wire Details">';
			}
		} else if (colId === 'col_runningLegBalance') {
			if (!Ext.isEmpty(record.get('isEmpty'))
					&& record.get('isEmpty') === true)
				return;
			else {
				if (value == null || value == 0 || value == 0.00) {
					strRetValue = '';
				} else {
					var strCCY = !Ext.isEmpty(record.get('currencySymbol'))
							? record.get('currencySymbol')
							: (me.accCcySymbol || '');
					strRetValue = strCCY + ' ' + value;
				}
			}
		} else {
			if (!Ext.isEmpty(value))
				meta.tdAttr = 'title="' + value + '"';
			strRetValue = value;
		}
		return strRetValue;
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		
		var retValue = true;
		if (itmId === 'notes') {
			retValue = (objClientParameters.enableNotes === true && (CAN_EDIT === 'true'));
		}
		if (itmId === 'email') {
			retValue = (objClientParameters.enableEmail == true)
					&& (CAN_EDIT === 'true');
		}
		if (itmId === 'check') {
			retValue = chequeTxnTypeCodeList.indexOf(record.get('typeCode')) != -1;
		}
		
		return retValue;
		
	}
});