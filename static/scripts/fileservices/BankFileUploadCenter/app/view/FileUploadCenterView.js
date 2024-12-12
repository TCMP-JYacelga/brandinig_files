Ext.define('GCP.view.FileUploadCenterView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.ux.gcp.GroupView',
			'GCP.view.FileUploadCenterFilterView','GCP.view.FileUploadTitleView'],
	xtype : 'fileUploadCenterView',
	// cls : 'ux_header ux_panel-background',
	// bodyPadding : '2 4 2 2',
	// bodyPadding : '0 0 0 0',
	autoHeight : true,
	width : '100%',
	//parent : null,
	minHeight: 600,
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [{
					xtype : 'fileUploadTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb ux_panel-background'
				},{
					xtype : 'fileUploadCenterFilterView',
					margin : '0 0 12 0',
					width : '100%'
				},
				{
						xtype : 'container',
						layout : 'hbox',
						flex : 1,
						items : [{
									xtype : 'toolbar',
									itemId : 'btnCreateNewToolBar',
									cls : 'ux_panel-background',
									flex : 1,
									items : [{
												xtype : 'button',
												border : 0,
												text : getLabel('lblImportFile', 'Import File'),
												glyph : 'xf055@fontawesome',
												cls : 'ux_font-size14 xn-content-btn ux-button-s ',
												parent : this,
												itemId : 'importFileBtn',
												listeners : {
													'click' : function() {
															 showImportFilePopUp();
													}
												}
											}]
								}]
				},
				/*{
					xtype : 'bankScheduleGridInformationView',
					margin : '0 0 12 0'		
				}
				*/
				, groupView];
		//me.items = [groupView];
		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {}

		if (objFileUploadCenterPref) {
			var objJsonData = Ext.decode(objFileUploadCenterPref);
			objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'services/grouptype/fileUploadCenter/groupBy.json?$filterscreen=fileUploadGroupViewFilter&$filterGridId=GRD_PAY_FILECEN',
			cfgSummaryLabel : 'File Import Center',
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGroupByPref.groupCode || null,
			cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			//cls : 't7-grid',
			cfgShowFilterInfo : false,
			padding : '12 0 0 0',
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
			cfgGridModel : {
				pageSize : _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				hideRowNumbererColumn : true,
				// showSummaryRow : true,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				showEmptyRow : false,
				showPager : true,
				showPagerRefreshLink : false,
				minHeight : 100,
				enableColumnHeaderFilter : true,
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
			colHeader : 'Action',
			width : 50,
			align : 'center',
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			visibleRowActionCount : 1,
			items : [{
						itemId : 'btnViewError',
						itemCls : 'grid-row-action-icon icon-error',
						toolTip : getLabel('viewToolTip', 'View Error Report'),
						maskPosition : 1
					}, {
						itemId : 'btnViewRepair',
						// FTGCPBDB-4831 Redirect to Payment center is not available in other module .hence to maintain the consistency the change has been done and remeoved from Payment
						itemCls : 'grid-row-action-icon icon-error',
						toolTip : getLabel('underRepairToolTip', 'Under Repair'),
						maskPosition : 2
					}, {
						itemId : 'btnViewOk',
						itemCls : 'grid-row-action-icon icon-completed',
						toolTip : getLabel('completeToolTip', 'Completed'),
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
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this;
		var strRetValue = "";
		if (colId === 'col_ahtskTotalAmnt' && (typeof value != 'undefined') && value)
		{		
			strRetValue = setDigitAmtGroupFormat(value);							
		}	
		else
		{
			strRetValue = value;			
		}
		return strRetValue;
	}

});