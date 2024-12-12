Ext.define('GCP.view.FileUploadCenterView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.ux.gcp.GroupView',
			'GCP.view.FileUploadCenterFilterView'],
	xtype : 'fileUploadCenterView',
	autoHeight : true,
	parent : null,
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
		var groupView = null, blnShowAdvancedFilter = true;
		var objGroupByPref = {};
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;

/*		if (objFileUploadCenterPref) {
			var objJsonData = Ext.decode(objFileUploadCenterPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}*/
		
		
		if (objFileUploadCenterPref) {
			var objJsonData = Ext.decode(objFileUploadCenterPref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (FILE_GENERIC_COLUMN_MODEL || '[]');
		}		
		blnShowAdvancedFilter = !isHidden('AdvanceFilter');
		
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/fileUploadCenter/groupBy.json?$filterscreen=fileUploadGroupViewFilter&$filterGridId=GRD_PAY_FILECEN',
			cfgSummaryLabel : getLabel('lblFileUploadCenter', 'File Upload Center'),
			cfgGroupByLabel : getLabel('lblGroupedBy', 'Grouped By'),
			cfgGroupCode :  objGeneralSetting.defaultGroupByCode || null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : true,
			cfgShowAdvancedFilterLink : blnShowAdvancedFilter,
			/*padding : '12 0 0 0',*/
			cfgShowRefreshLink : false,
			cfgAutoGroupingDisabled : true,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'fileUploadCenterFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return me.getActionColumns();
			},
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,			
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				showCheckBoxColumn : false,
				hideRowNumbererColumn : true,
				// showSummaryRow : true,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				showEmptyRow : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,				
				showPagerRefreshLink : false,
				minHeight : 100,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,				
				columnHeaderFilterCfg : {
		// remoteFilter : true,
				// filters : [{
				// type : 'list',
				// colId : 'actionStatus',
				// options : arrActionColumnStatus || []
				// }]
				},
				storeModel : {
					fields : ['ahtskSrc', 'uploadDate', 'ahtskclient',
							'ahtskClientDesc', 'tskslRemarks', '__metadata',
							'identifier', 'ahtskTotalInst', 'ahtskTotalAmnt',
							'ahtskTotalInstRejected', 'ahtskStatus',
							'recordKeyNo', 'ahtskid','ahtskdata', 'srNo', 'phdNumber','ahtskMaker',
							'phdProduct', 'paymentIdentifier'],
					proxyUrl : 'fileUploadCenterList.srvc',
					rootNode : 'd.fileUploadCenter',
					totalRowsNode : 'd.__count'
				},
				/**
				 * @cfg {Array} groupActionModel This is used to create the
				 *      items in Action Bar
				 * 
				 * @example
				 * The example for groupActionModel as below : 
				 * 	[{
				 *	  //@requires Used while creating the action url.
				 *		actionName : 'submit',
				 *	  //@optional Used to display the icon.
				 *		itemCls : 'icon-button icon-submit',
				 *	  //@optional Defaults to true. If true , then the action will considered
				 *	            in enable/disable on row selection.
				 *		isGroupAction : false,
				 *	  //@optional Text to display
				 *		itemText : getLabel('instrumentsActionSubmit', 'Submit'),
				 *	  //@requires The position of the action in mask.
				 *		maskPosition : 5
				 *	  //@optional The position of the action in mask.
				 *		fnClickHandler : function(tableView, rowIndex, columnIndex, btn, event,
				 *						record) {
				 *		},
				 *	}, {
				 *		actionName : 'verify',
				 *		itemCls : 'icon-button icon-verify',
				 *		itemText : getLabel('instrumentsActionVerify', 'Verify'),
				 *		maskPosition : 13
				 *}]
				 */
				// groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me
						.getColumnModel(FILE_GENERIC_COLUMN_MODEL),
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
		return groupView;
	},
	getColumnModel : function(arrCols) {
		var me = this;
		// var arrColumns = me.getActionColumns() || [];
		return (arrCols || []);
	},

	getActionColumns : function() {
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader : getLabel('action','Action'),
			flex : 1,
			align : 'center',
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			visibleRowActionCount : 1,
			items : [{
						itemId : 'btnViewError',
						itemCls : 'grid-row-action-icon icon-error',
						toolTip : getLabel('viewReportToolTip', 'View Report'),
						text : getLabel('viewReportToolTip', 'View Report'),
						maskPosition : 1
					}, {
						itemId : 'btnViewRepair',
						// FTGCPBDB-4831 Redirect to Payment center is not available in other module .hence to maintain the consistency the change has been done and remeoved from Payment
						itemCls : 'grid-row-action-icon icon-error',
						toolTip : getLabel('viewReportToolTip', 'View Report'),
						text : getLabel('viewReportToolTip', 'View Report'),
						maskPosition : 2
					}, {
						itemId : 'btnViewOk',
						itemCls : 'grid-row-action-icon icon-completed',
						toolTip : getLabel('completeToolTip', 'Completed'),
						text : getLabel('completeToolTip', 'Completed'),
						maskPosition : 3
					}]
		};
		return [objActionCol];
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 3;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);

		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);

		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		}
		if(record.data.ahtskStatus=="Completed" && Ext.isEmpty(record.data.ahtskTotalAmnt))
		{
			return false;
		}
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this;
		var strRetValue = "";
		if (colId === 'col_ahtskTotalAmnt' && (typeof value != 'undefined') && value)
		{		
				strRetValue = setDigitAmtGroupFormat(value);
				meta.tdAttr = 'title="' + strRetValue + '"';			
		}	
		else
		{
			strRetValue = value;
			if (!Ext.isEmpty(value))
				meta.tdAttr = 'title="' + value + '"';
		}	
		return strRetValue;
	}

});