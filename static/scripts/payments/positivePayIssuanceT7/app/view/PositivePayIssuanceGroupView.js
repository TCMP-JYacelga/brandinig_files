Ext.define('GCP.view.PositivePayIssuanceGroupView', {
	extend : 'Ext.panel.Panel',
	xtype : 'positivePayIssuanceGroupView',
	autoHeight : true,
	width : '100%',
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
		if (objPositivePayIssuancePref) {
			var objJsonData = Ext.decode(objPositivePayIssuancePref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (me.getDefaultColumnModel() || '[]');
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			// cfgGroupByUrl :
			// 'static/scripts/payments/paymentSummaryNewUX/data/groupBy.json',
			cfgGroupByUrl : 'services/grouptype/positivePayIssuance/groupBy.json?$filterGridId=GRD_PP_POSPAYISS',
			cfgSummaryLabel : getLabel('issuance', 'Issuance'),
			cfgGroupByLabel : getLabel('groupedBy', 'Grouped By'),
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cls : 't7-grid',
			padding : '12 0 0 0',
			enableQueryParam:false,
			cfgShowFilter : true,
			cfgAutoGroupingDisabled : true,
			//cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'positivePayIssuanceFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				},
				collapsed : true
			},
			getActionColumns : function() {
				return [me.createGroupActionColumn()];
			},
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				// showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				cfgShowRefreshLink : false,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				checkBoxColumnWidth : _GridCheckBoxWidth,
			
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : []
							}]
				},
				storeModel : {
					fields : ['version', 'requestState', 'accountNumber','acctName','approveIssuance',
							'amount', 'checkerId', 'checkerStamp', 'clientId',
							'corporationId', 'currSessionNo', 'description',
							'identifier', '__metadata', 'fileName', 'beanName',
							'issuanceId', 'issuanceDate', 'makerId',
							'makerStamp', 'payeeName', 'recordKeyNo',
							'decisionStatus', 'rejectRemarks', 'voidIndicator',
							'corporationDesc', 'clientDesc', 'serialNumber',
							'sellerCode', 'acctNmbr','acctName','currencySymbol'],
					proxyUrl : 'services/positivePayIssuanceDataList.json',
					rootNode : 'd.positivePayIssuance',
					totalRowsNode : 'd._count'
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
				groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(me
						.getDefaultColumnModel()),
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
	getDefaultColumnModel : function() {
		var arrCols = [{
					"colId" : "issuanceDate",
					"colHeader" : "Issue Date",
					width : 100,					
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":1
				}, {
					"colId" : "acctNameNumber",
					"colHeader" : "Account",
					width : 100,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":2
				},{
					"colId" : "acctName",
					"colHeader" : "Account Name",
					width : 150,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":3
				},
				{
					"colId" : "serialNumber",
					"colHeader" : "Check No.",
					width : 100,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":4
				}, {
					"colId" : "payeeName",
					"colHeader" : "Payee Name",
					width : 250,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":5
				}, {
					"colId" : "voidIndicator",
					"colHeader" : "Void",
					width : 60,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":6
				}, {
					"colId" : "amount",
					"colType" : "amount",
					"colHeader" : "Amount",
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":7
				}, {
					"colId" : "decisionStatus",
					"colHeader" : "Status",
					width : 200,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":8,
					"sortable" : false
				}, {
					"colId" : "clientDesc",
					"colHeader" : "Client Name",
					width : 170,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":9
				}, {
					"colId" : "fileName",
					"colHeader" : "File Name",
					width : 170,
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":10
				}, {
					"colId" : "makerStamp",
					"colHeader" : "Create Date",
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":11
				},{
					"colId" : "makerId",
					"colHeader" : "Created By",
					"locked"	: false,
					"hidden"	: false,
					"hideable"	: true,
					"colSequence":12
				}];
		return arrCols;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 8;
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
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";

		if (colId === 'col_acctNameNumber') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('accountNumber'))
						&& !Ext.isEmpty(record.get('acctName'))) {
					strRetValue = record.get('acctNmbr');
				}
			}
		} else if (colId === 'col_voidIndicator') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('voidIndicator'))) {
					if (record.get('voidIndicator') == 'Y')
						strRetValue = 'Yes';
					else
						strRetValue = 'No';
				}
			}
		}
		 else if (colId === 'col_amount') {
					if (!record.get('isEmpty') && !Ext.isEmpty(record.get('amount')) && !Ext.isEmpty(record.get('currencySymbol'))) {
						strRetValue = record.get('currencySymbol')+ " " + record.get('amount');
					}
				}
		else {
			strRetValue = value;
		}
		return strRetValue;
	},
	getGroupActionModel : function() {
		var retArray = [];
		var arrActions = ['Discard', 'Approve', 'Reject','Submit','Void'];
		var objActions = {
			'Approve' : {
				actionName : 'accept',
				itemText : getLabel('instrumentsActionAuthorize', 'Approve'),
				maskPosition : 4
			},
			'Reject' : {
				actionName : 'reject',
				itemText : getLabel('instrumentsActionReturnToMaker', 'Reject'),
				maskPosition : 5

			},
			'Discard' : {
				actionName : 'discard',
				itemText : getLabel('instrumentsActionDiscard', 'Discard'),
				maskPosition : 6
			},
			'Submit' : {
				actionName : 'submit',
				itemText : getLabel('positivePayActionSubmit', 'Submit'),
				maskPosition : 7
			},
			'Void' : {
				actionName : 'void',
				itemText : getLabel('positivePayActionVoid', 'Void'),
				maskPosition : 8
			}
		};

		for (var i = 0; i < arrActions.length; i++) {
			if (!Ext.isEmpty(objActions[arrActions[i]]))
				retArray.push(objActions[arrActions[i]])
		}
		return retArray;
	},
	getColumnModel : function(arrCols) {
		return arrCols;

		/*var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editToolTip', 'Edit'),
			itemLabel : getLabel('editToolTip', 'Edit'),
			maskPosition : 1
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 2
				// fnClickHandler : viewRecord
			}, {
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			toolTip : getLabel('historyToolTip', 'View History'),
			itemLabel : getLabel('historyToolTip', 'View History'),
			maskPosition : 3
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : showHistory
			}];
		var colGroupAction = me.createGroupActionColumn();
		colGroupAction.items = arrRowActions.concat(colGroupAction.items || []);
		var arrColumns = [colGroupAction];
		return arrColumns.concat(arrCols || []);*/
	},
	createGroupActionColumn : function() {
		var me = this;
		var colItems = [];
		var arrRowActions = [{
			itemId : 'btnEdit',
			itemCls : 'grid-row-action-icon icon-edit',
			toolTip : getLabel('editToolTip', 'Modify Record'),
			itemLabel : getLabel('editToolTip', 'Modify Record'),
			maskPosition : 1
				// fnClickHandler : editRecord
			}, {
			itemId : 'btnView',
			itemCls : 'grid-row-action-icon icon-view',
			toolTip : getLabel('viewToolTip', 'View Record'),
			itemLabel : getLabel('viewToolTip', 'View Record'),
			maskPosition : 2
				// fnClickHandler : viewRecord
			}, {
			itemId : 'btnHistory',
			itemCls : 'grid-row-action-icon icon-history',
			toolTip : getLabel('historyToolTip', 'View History'),
			itemLabel : getLabel('historyToolTip', 'View History'),
			maskPosition : 3
				// fnVisibilityHandler : isIconVisible
				// fnClickHandler : showHistory
			}];
		var actionsForWidget = ['Discard', 'Reject', 'Approve','Submit','Void'];
		colItems = me.getGroupActionColItems(actionsForWidget);
		var objActionCol = {
			colId : 'actioncontent',
			colType : 'actioncontent',
			colHeader :getLabel('actions', 'Actions'),
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : arrRowActions.concat(colItems || []),
			visibleRowActionCount : 1
		};
		return objActionCol;
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/positivePayIssuance.json',
						reader : {
							type : 'json',
							root : 'd.filters'
						}
					},
					listeners : {
						load : function(store, records, success, opts) {
							store.each(function(record) {
										record.set('filterName', record.raw);
									});
						}
					}
				})
		return myStore;
	},
	getGroupActionColItems : function(availableActions) {
		var itemsArray = [];
		if (!Ext.isEmpty(availableActions)) {
			for (var count = 0; count < availableActions.length; count++) {
				switch (availableActions[count]) {
					case 'Discard' :
						itemsArray.push({
							text : getLabel('actionDiscard', 'Discard'),
							actionName : 'discard',
							itemId : 'discard',
							maskPosition : 6
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;
					case 'Approve' :
						itemsArray.push({
							text : getLabel('actionAuthorize', 'Approve'),
							actionName : 'accept',
							itemId : 'accept',
							maskPosition : 4
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;
					case 'Reject' :
						itemsArray.push({
							text : getLabel('actionReturnToMaker', 'Reject'),
							actionName : 'reject',
							itemId : 'reject',
							maskPosition : 5
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;
					case 'Submit' :
						itemsArray.push({
							text : getLabel('positivePayActionSubmit', 'Submit'),
							actionName : 'submit',
							itemId : 'submit',
							maskPosition : 7
								/**
								 * fnVisibilityHandler : me.isRowIconVisible,
								 * fnClickHandler : function(grid, rowIndex,
								 * columnIndex, btn, event, record) {
								 * me.handleRowActionClick(me, grid, rowIndex,
								 * columnIndex, btn, event, record); }
								 */
							});
						break;
					case 'Void' :
						itemsArray.push({
							text : getLabel('positivePayActionVoid', 'Void'),
							actionName : 'void',
							itemId : 'void',
							maskPosition : 8
							});
						break;
				}

			}
		}
		return itemsArray;
	}
});