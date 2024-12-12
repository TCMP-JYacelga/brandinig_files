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
		var strGridId = 'GRD_BR_TRANSEARCH';
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		//var objGroupByPref = {}
		/*if (objTranSearchGroupByPref && Ext.isEmpty(widgetFilterUrl)) {
			var objJsonData = Ext.decode(objTranSearchGroupByPref);
			objGroupByPref = objJsonData || {};
		}*/
		if (objTranSearchPref  && Ext.isEmpty(widgetFilterUrl)) {
			var objJsonData = Ext.decode(objTranSearchPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (me.getDefaultColumnPreferences() || '[]');
		}
        if(objSaveLocalStoragePref){
            var objLocalData = Ext.decode(objSaveLocalStoragePref);
            objLocalPageSize = objLocalData && objLocalData.d.preferences
                                && objLocalData.d.preferences.tempPref 
                                && objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
            objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
                                && objLocalData.d.preferences.tempPref 
                                && objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
        }
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
					//cfgGroupByUrl : Ext.String
					//		.format(
					//				'services/grouptype/btrSummary/groupBy.json?$filter={0}',
					//				summaryType),
					//cfgGroupByUrl : 'static/scripts/btr/transactionSearch/data/groupBy.json',
					cfgGroupByUrl : Ext.String.format('services/grouptype/transactionSearchSummary/groupBy.json?$filterGridId={0}', strGridId),
					cfgSummaryLabel : 'Accounts',
					cfgGroupByLabel : 'Group By',
					cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
					//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
					cfgParentCt : me,
					enableQueryParam:false,
					cls : 't7-grid',
					cfgShowFilter : true,
					cfgSmartGridSetting : false,	
					cfgAutoGroupingDisabled : true,
					cfgFilterModel : {
							cfgContentPanelItems : [{
										xtype : 'tranSearchFilterView' 
									}],
							cfgContentPanelLayout : {
								type : 'vbox',
								align : 'stretch'
							},
							collapsed : false
						},		
					cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
					getActionColumns : function() {
						return [me.createActionColumn()];
					},
					cfgPrefferedColumnModel : arrColumnSetting,
					cfgGridModel : {
						pageSize :objGridSetting.defaultRowPerPage || _GridSizeTxn,
						showSorterToolbar : _charEnableMultiSort,
						rowList : _AvailableGridSize,
						enableColumnAutoWidth : _blnGridAutoColumnWidth,
						stateful : false,
						hideRowNumbererColumn : true,
						enableColumnHeaderFilter : true,
						showCheckBoxColumn : false,
						showSummaryRow : false,
						showEmptyRow : false,
						showPager : true,
						heightOption : objGridSetting.defaultGridSize,
						checkBoxColumnWidth : _GridCheckBoxWidth,
						minHeight : 100,
						columnHeaderFilterCfg : {
							remoteFilter : true,
							filters : []
						},
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
										'noteText', 'isHistoryFlag','noteFilename','accountName','hostImageKey'],
								proxyUrl : 'services/activities/transactionSearch',
								rootNode : 'd.btractivities',
								//sortState:arrSorters,
								totalRowsNode : 'd.__count'
						},
						defaultColumnModel : me.getColumnModel(me.getDefaultColumnPreferences()),
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
	getColumnModel : function(arrCols) {
		return arrCols;
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
				width : 108,
				locked : true,
				colHeader:getLabel('actions', 'Actions'),
				lockable : false,
				sortable : false,
				hideable : false,
				visibleRowActionCount : 1,
				items : [{
							itemId : 'notes',
							itemCls : 'grid-row-action-icon icon-notes',
							toolTip : getLabel('notes', 'Notes'),
							itemLabel : getLabel('notes', 'Notes')
						},
						{
							itemId : 'notesAttached',
							itemCls : 'grid-row-action-icon icon-notes-attached',
							toolTip : getLabel('notes', 'Notes'),
							itemLabel : getLabel('notes', 'Notes')
						},
						{
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
							toolTip : getLabel('checkimg', 'View Image'),
							itemLabel : getLabel('checkimg', 'View Image')
						}]
			};
			return objActionCol;
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
					strRetValue = strCCY + ' ' + value;
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
		} else if (colId === 'col_dataSource') {
			if (!Ext.isEmpty(record.get('isHistoryFlag'))
					&& record.get('isHistoryFlag') === true)
				return;
			else {
					if(record.get('isHistoryFlag') =='H')
						strRetValue=getLabel('previousDay', 'Previous Day');
					else
						strRetValue=getLabel('intraDay', 'Intraday');
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
		if (itmId === 'notes' || itmId === 'notesAttached') {
			if (objClientParameters.enableNotes === true &&  record.data.isHistoryFlag !== 'I') {
				if (itmId === 'notes') {
					retValue = (Ext.isEmpty(record.get('noteText')) && Ext.isEmpty(record.get('noteFilename')));
				} else if (itmId === 'notesAttached') {
					retValue = (!(Ext.isEmpty(record.get('noteText'))) || !(Ext.isEmpty(record.get('noteFilename'))));
				}
			} else {
				retValue = false;
			}
		}
		if (itmId === 'email') {
			retValue = (objClientParameters.enableEmail == true)
					&& (CAN_EDIT === 'true');
		}
		if (itmId === 'check') {
			retValue = chequeTxnTypeCodeList.indexOf(record.get('typeCode')) != -1;
			if(record.get('typeCode') == '475' || record.get('typeCode') == '173'){
				retValue = true;
			}			
			if(retValue)
			{
				if(enableIntraDayImageflag   &&  enablePrevDayImageflag)
					retValue = true;
				else if(enableIntraDayImageflag  && record.data.isHistoryFlag == 'I')
					retValue =true;
				else if(enablePrevDayImageflag && record.data.isHistoryFlag == 'H')
					retValue =true;				
			}
		}
		
		return retValue;
		
		
	}
});