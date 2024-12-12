/**
 * @class GCP.view.SweepTxnAgreementView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 * @author Shraddha Chauhan
 */
Ext.define( 'GCP.view.SweepTxnAgreementView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'sweepTxnAgreementViewType',
	requires :
	[
		'Ext.ux.gcp.GroupView','GCP.view.SweepTxnAgreementFilterView' 
	],
	autoHeight : true,
	initComponent : function(){
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
		var groupView = null, blnShowAdvancedFilter = false;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		if (objSummaryPref) {
			var objJsonData = Ext.decode(objSummaryPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					:  me.getDefaultColumnModel()|| [];
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
			cfgGroupByUrl : 'static/scripts/lms/sweepTxnAgreementSummary/data/SweepTxnAgreementGroupBy.json',
			cfgSummaryLabel : 'Sweep Agreement',
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : (allowLocalPreference === 'Y') ? objLocalSubGroupCode : null,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'sweepTxnAgreementFilterViewType'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()]
			},
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : (allowLocalPreference === 'Y' && !Ext.isEmpty(objLocalPageSize)) ? objLocalPageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				showCheckBoxColumn : false,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : false,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				storeModel : {
					fields : [
							'changeId','agreementCode', 'agreementName', 'clientDesc', 'sellerDesc', 'effectiveFromDate',
							'__metadata','identifier','history','structureTypeDesc','scheduleExecutionDate',
							'clientId','agreementRecKey','structureType','viewState','sellerId','agreementExeId','noPostStructure'
						],
						proxyUrl : 'getLmsSweepAgreementTxnList.srvc',
						rootNode : 'd.sweepTxnList',
						totalRowsNode : 'd.__count'
				},
				defaultColumnModel : me.getDefaultColumnModel(),
				fnColumnRenderer : me.columnRenderer,
				fnRowIconVisibilityHandler : me.isRowIconVisible
			}
		});
		return groupView
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var arrRowActions = [
              {
            	itemId : 'btnAdjustment',
  				itemLabel : getLabel( 'adjustment', 'Adjustment' ),
  				maskPosition : 2
  			},{
  				itemId : 'btnTransfer',
  				itemLabel : getLabel( 'transfer', 'Transfer' ),
				maskPosition : 3
			},{
				itemId : 'btnExecute',
				itemLabel : getLabel( 'execute', 'Execute' ),
				maskPosition : 4
			},{
				itemId : 'btnSimulate',
				itemLabel : getLabel( 'simulate', 'Simulate' ),
				maskPosition : 5
			},{
				itemId : 'btnCancelSchedule',
				itemLabel : getLabel( 'cancelSchedule', 'Cancel Schedule' ),
				maskPosition : 6

			},{
				itemId : 'btnHistory',
				itemLabel : getLabel( 'history', 'View History' ),
				maskPosition : 7

			}];
		var objActionCol = null;
		objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions','Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : arrRowActions.concat([]),
			visibleRowActionCount : 1
		};
		return objActionCol;
	},
	getGroupActionModel : function(arrAvaliableActions) {
		var retArray = [];
		var arrActions = (['Adjustment', 'Transfer',
				'Execute', 'Simulate', 'CancelSchedule']);
		
		var objActions = {
			'Adjustment' : {
				actionName : 'btnAdjustment',
				isGroupAction : true,
				itemText : getLabel( 'adjustment', 'Adjustment' ),
				maskPosition : 2
			},
			'Transfer' : {
				actionName : 'btnTransfer',
				itemText : getLabel( 'transfer', 'Transfer' ),
				maskPosition : 3
			},
			'Execute' : {
				actionName : 'btnExecute',
				itemText : getLabel( 'execute', 'Execute' ),
				maskPosition : 4
			},
			'Simulate' : {
				actionName : 'btnSimulate',
				itemText : getLabel( 'simulate', 'Simulate' ),
				maskPosition : 5
			},
			'CancelSchedule' : {
				actionName : 'btnCancelSchedule',
				itemText : getLabel( 'cancelSchedule', 'Cancel Schedule' ),
				maskPosition : 6

			},
			'History' : {
				actionName : 'btnHistory',
				itemText : getLabel( 'history', 'View History' ),
				maskPosition : 7

			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		strRetValue = value;
		return strRetValue;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 9;
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
		/*if( ( maskPosition === 2 && retValue ) )
		{
			retValue = retValue && isSameUser;
		}
		else if( maskPosition === 3 && retValue )
		{
			retValue = retValue && isSameUser;
		}*/
		return retValue;
	},
	getDefaultColumnModel : function(){
		var me = this;
		var AGREEMENT_GENERIC_COLUMN_MODEL = [{
			"colId" : "agreementCode",
			"colHeader" : getLabel( 'agreementCode1', 'Agreement Code' ),
			"hidden" : false
		},{
			"colId" : "noPostStructure",
			"colHeader" : getLabel( 'noPostStructure', 'Live / Non Live' ),
			"hidden" : false
		}, {
			"colId" : "agreementName",
			"colHeader" : getLabel( 'agreementDesc', 'Agreement Description' ),
			"hidden" : false
		}, {
			"colId" : "clientDesc",
			"colHeader" : getLabel("grid.column.company", "Company Name"),
			"hidden" : false
		}, {
			"colId" : "structureTypeDesc",
			"colHeader" : getLabel( 'structureType', 'Structure Type' ),
			"hidden" : false
		}, {
			"colId" : "effectiveFromDate",
			"colHeader" : getLabel( 'effectiveFrom', 'Effective From' ),
			"hidden" : false
		}];
		
		return AGREEMENT_GENERIC_COLUMN_MODEL;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	}
} );
