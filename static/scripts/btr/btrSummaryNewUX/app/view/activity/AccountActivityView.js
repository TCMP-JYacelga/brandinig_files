/** 
 * @class GCP.view.activity.AccountActivityView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.activity.AccountActivityView', {
	extend : 'Ext.panel.Panel',
	xtype : 'accountActivityView',
	requires : [/*'GCP.view.activity.AccountActivityTitleView',			
			'GCP.view.common.SummaryRibbonView',*/
			'GCP.view.activity.AccountActivityFilterView',
			'GCP.view.activity.AccountActivityGraph', 'Ext.Ajax',
			'Ext.ux.gcp.SmartGrid', 'Ext.panel.Panel',
			'Ext.container.Container', 'Ext.button.Button', 'Ext.menu.Menu',
			'Ext.form.field.Text',
			'GCP.view.activity.TransactionInitiationView','Ext.ux.gcp.GridHeaderFilterView'],
	autoHeight : true,
	width : '100%',	
	gridModel : null,
	accountFilter : null,
	accCcySymbol : null,
	initComponent : function() {
		var me = this;			
		var groupView=me.createGroupView();
		me.items=[{
					xtype : 'transactionInitiationView',
					itemId : 'transferFunds',
					hidden : true
				},groupView];
		me.callParent(arguments);
	},
	createGroupView:function(){
		var me=this;
		var groupView = null;
		var arrCols = new Array(),arrSorters=new Array(),arrColsPref = null;
		
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objLocalPageSize = '',objLocalSubGroupCode = null;
		if (objActivityPref) {
			var objJsonData = Ext.decode(objActivityPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: Ext.decode(arrGenericActivityColumnModel || '[]');
		}
		
		if(objSaveActivityLocalStoragePref){
			var objLocalData = Ext.decode(objSaveActivityLocalStoragePref);
			objLocalPageSize = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.pageSize ? objLocalData.d.preferences.tempPref.pageSize : '';
			objLocalSubGroupCode = objLocalData && objLocalData.d.preferences
								&& objLocalData.d.preferences.tempPref 
								&& objLocalData.d.preferences.tempPref.subGroupCode ? objLocalData.d.preferences.tempPref.subGroupCode : null;
		}
		
		var data = me.gridModel;
		arrColsPref = data.gridCols;
		arrSorters=data.sortState;
		arrCols = me.getColumns(arrColsPref);
		
		groupView=Ext.create("Ext.ux.gcp.GroupView",{
			cfgGroupByUrl : 'static/scripts/btr/btrSummaryNewUX/data/activityGroupBy.json?$filterscreen=groupViewFilter',
			cfgSummaryLabel : 'Activity',
			cfgGroupByLabel : 'Group By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgSubGroupCode : objLocalSubGroupCode || objGeneralSetting.subGroupCode || null,					
			cfgParentCt : me,
			enableQueryParam:false,
			itemId : 'activityGrid',
			cls : 't7-grid',					
			cfgShowFilter : true,										
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgGroupingDisabled : true,
			cfgShowRibbon : objClientParameters.enableSummaryRibbon,
			cfgRibbonModel : { items : [{xtype : 'container', html : '<div id="summaryCarousalActivityTargetDiv"></div>'}], itemId : 'summaryCarousalActivity',showSetting : false },
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'accountActivityFilterView'
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
				showPager:true,
				minHeight : 100,
				pageSize : objLocalPageSize || objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				autoSortColumnList : true,
				storeModel : {
						fields : ['notes', 'postingDate', 'typeCodeDesc','remittanceTextFlag',
								'typeCode', 'customerRefNo', 'text',
								'creditUnit', 'debitUnit', 'sequenceNumber',
								'sessionNumber', 'remittance', 'currency',
								'currencySymbol', 'accountId', 'bankRef',
								'identifier', 'info20', 'info11', 'info12',
								'info13', 'info14', 'info15', 'info16',
								'info17', 'info18', 'info19', 'info1', 'info2', 'info3',
								'runningLegBalance', 'accountNo', 'valueDate',
								'fedReference', 'customerRefNo', 'txnAmount',
								'noteText', 'isHistoryFlag','noteFilename', 'hostImageKey'],
						proxyUrl : 'services/btrActivities/'+summaryType+'/account.srvc',
						rootNode : 'd.btractivities',
						totalRowsNode : 'd.__count'
					},
					fnRowIconVisibilityHandler : me.isRowIconVisible,
					defaultColumnModel : arrCols,
					fnColumnRenderer : me.columnRenderer,
					enableColumnAutoWidth : false,
					heightOption : objGridSetting.defaultGridSize,
					showSorterToolbar : _charEnableMultiSort //For Multisort
			}
		});
		return groupView;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var notesDisPlayFlag = jsonData.d.__hasNotes;
		var intraDayDetailViewImageFlag = jsonData.d.__intraDayDetailViewImageFlag;
		var prevDayDetailViewImageFlag = jsonData.d.__prevDayDetailViewImageFlag;
		var retValue = true;
		var checkTypeCode = getLabel('checkTypeCode','475');
		var depositTypeCode = getLabel('depositTypeCode','175');
		var granularEstatementsFlag = 'N';
		granularEstatementsFlag = jsonData.d.__granularEstatementsFlag;
		if (itmId === 'notes' || itmId === 'notesAttached') {
			if (objClientParameters.enableNotes === true && record.data.isHistoryFlag !== 'I') {
				if (itmId === 'notes') {
					retValue = (Ext.isEmpty(record.get('noteText')) && Ext.isEmpty(record.get('noteFilename')));
				} else if ((itmId === 'notesAttached')) {
					retValue = (!(Ext.isEmpty(record.get('noteText'))) || !(Ext.isEmpty(record.get('noteFilename'))));
				}
			} else {
				retValue = false;
			}
		}

		if (itmId === 'eStatement') {
			if(enableEstatementsflag){
				if (isGranularPermissionForClient == 'Y') {
					if (granularEstatementsFlag == 'Y')
						retValue = true;
					else
						retValue = false;
				} else
					retValue = true;
			} else
				retValue = false;
		}
		if (itmId === 'email') {
			retValue = objClientParameters.enableEmail === true;
		}
		if (itmId === 'expandedWire') {
			if (record.get('info20') === 'Y')
			{
				retValue = objClientParameters.enableExpandedWire === true;
			}
			else
			{
				retValue = false;
			}
		}
		if (itmId === 'check') {
			retValue = chequeTxnTypeCodeList.indexOf(record.get('typeCode')) != -1;
			if(record.raw.viewImageFlag =='Y'){
				retValue = true;
			}
			else
				retValue = false;
			
			if(retValue == true){

				if(enableIntraDayImageflag && enablePrevDayImageflag)
					{
						if(isGranularPermissionForClient  == 'Y')
						{
							if(record.data.isHistoryFlag !== 'I' && prevDayDetailViewImageFlag == 'Y'  )
								retValue = true;
							else if( record.data.isHistoryFlag == 'I' && intraDayDetailViewImageFlag == 'Y' )
								retValue = true;
							else
								retValue = false;
						}
						else
							retValue = true;
					}

				else if( enableIntraDayImageflag && ( record.data.isHistoryFlag !== 'I' ))
				{
					if(isGranularPermissionForClient  == 'Y')
					{
						if (intraDayDetailViewImageFlag !== 'Y' )
							retValue = false;
					}
					else
						retValue = false;
				}
				else if( enablePrevDayImageflag )
					{
						if(isGranularPermissionForClient  == 'Y')
						{
							if( prevDayDetailViewImageFlag !== 'Y' )
							retValue = false;
						}
						else
							retValue = false;
					}

		}
		}

		return retValue;
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				cfgCol = me.cloneObject(arrColsPref[i]);
				if (cfgCol.isTypeCode)
					cfgCol.metaInfo = {
						isTypeCode : cfgCol.isTypeCode
					};
				if (cfgCol.colId !== 'noteText') {
					arrCols.push(cfgCol);
				} else {
					/**
					 * Notes column to be shown if user is entitled for Notes
					 * feature
					 */
					if (objClientParameters.enableNotes === true)
						arrCols.push(cfgCol);
				}
			}
		}
		return arrCols;
	},
	createActionColumn : function() {
		var itemList=null;



		if( entityType == '0' )
		{
			itemList =	[ {
				itemId : 'txnDetails',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('txnDetails', 'Transaction Details'),
				itemLabel : getLabel('txnDetails',
						'Transaction Details')
			},{
				itemId : 'notes',
				itemCls : 'grid-row-action-icon icon-notes',
				toolTip : getLabel('notes', 'Notes'),
				itemLabel : getLabel('notes', 'Notes')
			},{
				itemId : 'notesAttached',
				itemCls : 'grid-row-action-icon icon-notes-attached',
				toolTip : getLabel('notes', 'Notes'),
				itemLabel : getLabel('notes', 'Notes')
			}
			]
		}
		else
		{
			itemList = [ {
				itemId : 'txnDetails',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('txnDetails', 'Transaction Details'),
				itemLabel : getLabel('txnDetails',
						'Transaction Details')
			},{
				itemId : 'notes',
				itemCls : 'grid-row-action-icon icon-notes',
				toolTip : getLabel('notes', 'Notes'),
				itemLabel : getLabel('notes', 'Notes')
			}, {
				itemId : 'notesAttached',
				itemCls : 'grid-row-action-icon icon-notes-attached',
				toolTip : getLabel('notes', 'Notes'),
				itemLabel : getLabel('notes', 'Notes')
			}, {
				itemId : 'eStatement',
				itemCls : 'grid-row-estatement-icon',
				toolTip : getLabel('eStatement', 'eStatements'),
				itemLabel : getLabel('eStatement', 'eStatements')
			},{
				itemId : 'email',
				itemCls : 'grid-row-email-icon',
				toolTip : getLabel('email', 'Email'),
				itemLabel : getLabel('email', 'Email')
			},
			{
				itemId : 'check',
				itemCls : 'grid-row-check-icon',
				toolTip : getLabel('checkimg', 'Image'),
				itemLabel : getLabel('checkimg', 'Image')
			},
			{
				itemId : 'expandedWire',
				itemCls : 'grid-row-check-icon',
				toolTip : getLabel('expandedWire', 'Expended Wire'),
				itemLabel : getLabel('expandedWire', 'Expended Wire')
			}
			]
		}
	var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('actions', 'Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			visibleRowActionCount : 1,
			items : itemList


			};
		return objActionCol;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
        var me = this;
        var strRetValue = "";
        var strCCY = '';
        if ((colId === 'col_creditUnit') || (colId === 'col_debitUnit')) {
            if (!Ext.isEmpty(record.get('isEmpty')) && record.get('isEmpty') === true)
                return;
            else {
                if (value == null || value == 0 || value == 0.00) {
                    strCCY = !Ext.isEmpty(record.get('currencySymbol')) ? record.get('currencySymbol') : (me.accCcySymbol || '');
                    strRetValue = '';
                }
                else if (colId === 'col_debitUnit') {
                    if (value.indexOf("-") == 0) {
                        value = value.substring(1);
                    }
                    strCCY = !Ext.isEmpty(record.get('currencySymbol')) ? record.get('currencySymbol') : (me.accCcySymbol || '');
                    strRetValue = strCCY + ' ' + value;
                }
                else {
                    strCCY = !Ext.isEmpty(record.get('currencySymbol')) ? record.get('currencySymbol') : (me.accCcySymbol || '');
                    strRetValue = strCCY + ' ' + value;
                }
                meta.tdAttr = 'title="' + strRetValue + '"';
            }
        }
        else if (colId === 'col_runningLegBalance') {
            if (!Ext.isEmpty(record.get('isEmpty')) && record.get('isEmpty') === true)
                return;
            else {
                if (value == null || value == 0 || value == 0.00) {
                    strCCY = !Ext.isEmpty(record.get('currencySymbol')) ? record.get('currencySymbol') : (me.accCcySymbol || '');
                    strRetValue = strCCY + ' ' + '0.00';
                }
                else {
                    strCCY = !Ext.isEmpty(record.get('currencySymbol')) ? record.get('currencySymbol') : (me.accCcySymbol || '');
                    strRetValue = strCCY + ' ' + value;
                }
                meta.tdAttr = 'title="' + strRetValue + '"';
            }
        }
        else if (colId === 'col_noteText' && !Ext.isEmpty(record.get('noteFilename'))
                && (objClientParameters && objClientParameters.enableNotes)) {
            strRetValue = '<span> <i class="ft-icons-attach ft-icons" title="Multiple"> </i>' + '</span>' + '&nbsp;' + value;
        }
        else {
            if (!Ext.isEmpty(value))
                meta.tdAttr = 'title="' + value + '"';
            strRetValue = value;
        }
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