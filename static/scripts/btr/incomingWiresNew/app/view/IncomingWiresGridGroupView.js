Ext.define('GCP.view.IncomingWiresGridGroupView', {
	extend : 'Ext.panel.Panel',
	xtype : 'incomingWiresGridGroupView',
	autoHeight : true,
	width : '100%',
	arrSorter:[],
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
		var objGroupCodePref = null, objSubGroupCodePref = null;
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var objGroupByPref = {};
		
		if (objIncomningWirePref) {
			var objJsonData = Ext.decode(objIncomningWirePref);
			objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: (me.getDefaultColumnModel() || '[]');
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {			
			cfgGroupByUrl : 'services/grouptype/incomingwire/groupBy.json?$filterscreen=incomingWireFilter&$filterGridId=GRD_BR_INCOMINGWIRE',
			cfgSummaryLabel : getLabel('transactions', 'Transactions'),
			cfgGroupByLabel : 'Grouped By',
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			//cfgSubGroupCode :  objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cfgShowFilter : true,										
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			cfgShowRibbon : true,
			cfgRibbonModel : { items : [{xtype : 'container', html : '<div id="summaryCarousal"></div>'}], itemId : 'summaryCarousal',showSetting : false },
			cls : 't7-grid',
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'incomingWiresFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			//TODO : This has to be driven from system_parameter_mst
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			getActionColumns : function() {
				return [me.createGroupActionColumn()];
			},
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage ||_GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				//hideRowNumbererColumn : false,  //FTGCPPRD-1041 Sonar fixes:duplicate property
				showSorterToolbar : _charEnableMultiSort,
				showSummaryRow : false,
				showEmptyRow : false,
				showCheckBoxColumn : false,
				showPager : true,
				heightOption : objGridSetting.defaultGridSize,
				minHeight : 100,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				columnHeaderFilterCfg : {
					remoteFilter : true,
					filters : [{
								type : 'list',
								colId : 'actionStatus',
								options : []
							}]
				},
				storeModel : {
						fields : ['valueDate', 'fedReference', 'receiverAccNmbr', 'receiverAccName',
								'drCrFlag','paymentAmount','senderName',
								'__metadata','identifier', 'senderBankName','senderBankABA','__subTotal','crCount','drCount','crSummary','drSummary','clientDesc'],
						proxyUrl : 'incomingWiresList.srvc',
						rootNode : 'd.incomingWire',
						sortState:me.arrSorter,
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
				//groupActionModel : me.getGroupActionModel(),
				defaultColumnModel : me.getColumnModel(me.getDefaultColumnModel()),
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
	    var me = this;
		var data = null;
		var arrCols = [];
		if( !Ext.isEmpty( objGridViewPref ) )
		{
			data = Ext.decode( objGridViewPref );
		}
		if(entityType === '0' || me.showClientFlag)
		{
			arrCols = [{
						"colId" : "clientDesc",
						"colHeader" : getLabel('clientDesc','Client'),
						width : 100
					   },{
						"colId" : "valueDate",
						"colHeader" : getLabel('valueDate','Value Date'),
						width : 100
					   },{
						"colId" : "fedReference",
						"colHeader" : getLabel('fedReference','FED Reference Number'),
						width : 110
					   },{
						"colId" : "receiverAccNmbr",
						"colHeader" : getLabel('receiverAccNmbr','Account'),
						width : 100
					   },{
						"colId" : "receiverAccName",
						"colHeader" : getLabel('receiverAccName','Account Type'),
						width : 140
					   },{
						"colId" : "drCrFlag",
						"colHeader" : getLabel('drCrFlag','Debit/Credit'),
						width : 57
					   },{
						"colId" : "paymentAmount",
						"colHeader" : getLabel('paymentAmount','Amount'),
						"colType" : "number",
						"align" : 'right',
						width : 100
					   },{
						"colId" : "senderName",
						"colHeader" : getLabel('senderName','Sender Name'),
						width : 110
					   },{
						"colId" : "senderBankName",
						"colHeader" : getLabel('senderBankName','Sending Bank'),
						width : 110
					   },{
						"colId" : "senderBankABA",
						"colHeader" : getLabel('senderBankABA','Sending Bank Identifier'),
						width : 120
					   }];
		}
		else
		{
			arrCols = [{
						"colId" : "valueDate",
						"colHeader" : getLabel('valueDate','Value Date'),
						width : 100
					   },{
						"colId" : "fedReference",
						"colHeader" : getLabel('fedReference','FED Reference Number'),
						width : 110
					   },{
						"colId" : "receiverAccNmbr",
						"colHeader" : getLabel('receiverAccNmbr','Account'),
						width : 100
					   },{
						"colId" : "receiverAccName",
						"colHeader" : getLabel('receiverAccName','Account Type'),
						width : 140
					   },{
						"colId" : "drCrFlag",
						"colHeader" : getLabel('drCrFlag','Debit/Credit'),
						width : 57
					   },{
						"colId" : "paymentAmount",
						"colHeader" : getLabel('paymentAmount','Amount'),
						"colType" : "number",
						"align" : 'right',
						width : 100
					   },{
						"colId" : "senderName",
						"colHeader" : getLabel('senderName','Sender Name'),
						width : 110
					   },{
						"colId" : "senderBankName",
						"colHeader" : getLabel('senderBankName','Sending Bank'),
						width : 110
					   },{
						"colId" : "senderBankABA",
						"colHeader" : getLabel('senderBankABA','Sending Bank Identifier'),
						width : 120
					   }];
		}
		return arrCols;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
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
			retValue = retValue && isSameUser ;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser ;
		}
		return retValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if(colId === "col_paymentAmount")
		{
			strRetValue = '$' + value;
		}
		else
		{
			strRetValue = value;
		}
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},
	getColumnModel : function(arrCols) {
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colId : 'actioncontent',
			colHeader: getLabel('actions', 'Actions'),
			colType : 'actioncontent',
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			items : [{
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record'),
				itemLabel : getLabel('viewToolTip', 'View Record'),
				maskPosition : 1
				}],
			visibleRowActionCount : 2
		};
		return objActionCol;
	}
});