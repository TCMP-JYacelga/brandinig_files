Ext.define('GCP.view.AgreementSweepQueryGridView', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.ux.gcp.SmartGrid','Ext.util.Point', 'Ext.panel.Panel', 'GCP.view.AgreementSweepQueryFilterView' ],
	xtype : 'agreementSweepQueryGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];

		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
		/*var me = this;
		this.items = [ {
			xtype : 'container',
			layout : 'hbox',
			flex : 1,
			items : [ {
				xtype : 'container',
				layout : 'hbox',
				cls : 'rightfloating',
				items : []

			} ]
		}, {

			xtype : 'container',
			layout : 'hbox',
			cls : 'rightfloating',
			items : [ {
				xtype : 'button',
				border : 0,
				itemId : 'btnSearchOnPage',
				text : getLabel('searchOnPage', 'Search on Page'),
				cls : 'xn-custom-button cursor_pointer',
				padding : '5 0 0 3',
				menu : Ext.create('Ext.menu.Menu', {
					itemId : 'menu',
					items : [ {
						xtype : 'radiogroup',
						itemId : 'matchCriteria',
						vertical : true,
						columns : 1,
						items : [ {
							boxLabel : getLabel('exactMatch', 'Exact Match'),
							name : 'searchOnPage',
							inputValue : 'exactMatch'
						}, {
							boxLabel : getLabel('anyMatch', 'Any Match'),
							name : 'searchOnPage',
							inputValue : 'anyMatch',
							checked : true
						} ]

					} ]
				})
			}, {
				xtype : 'textfield',
				itemId : 'searchTextField',
				cls : 'w10',
				padding : '0 0 0 5'
			} ]
		}, {
			xtype : 'panel',
			//width : '100%',
			//collapsible : true,
			bodyCls: 'gradiant_back',
			cls : 'xn-panel',
			autoHeight : true,
			//margin : '20 0 0 0',
			title : getLabel('sweepQuery', 'SWEEP QUERY'),
			itemId : 'agreementSweepQueryGridListView',
			items : [ {
				xtype : 'container',
				layout : 'hbox',
				items : [ ]

			} ]
		} ];
		this.callParent(arguments);*/
	},

	createGroupView : function() {
		var me = this;
		var groupView = null;
		var objGroupByPref = {}, objGridSetting = {};
		if (objAgreementQueryPref) {
			var objJsonData = Ext.decode(objAgreementQueryPref);
		    objGroupByPref = objJsonData.d.preferences.groupByPref || {};
		    objGridSetting = objJsonData.d.preferences.GridSetting || {};
		    arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: SWEEP_QUERY_DEFAULT_COLUMN_MODEL || [];
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'static/scripts/lms/agreementSweepQuery/data/groupBy.json',
			cfgSummaryLabel : getLabel('sweepQuery', 'Sweep Query'),
			cfgGroupByLabel : getLabel('groupedby', 'Grouped By'),
			cfgGroupCode : objGroupByPref.groupCode || null,
			cfgSubGroupCode : objGroupByPref.subGroupCode || null,
			cfgParentCt : me,
			cls : 't7-grid',
			enableQueryParam:false,
			cfgShowFilter : true,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			cfgFilterModel : {
				cfgContentPanelItems : [{
							xtype : 'agreementSweepQueryFilterView'
						}],
				cfgContentPanelLayout : {
					type : 'vbox',
					align : 'stretch'
				}
			},
			getActionColumns : function() {
				return me.getActionColumnModel();
			},
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgShowAdvancedFilterLink : false,
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				stateful : false,
				hideRowNumbererColumn : false,
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				cfgShowRefreshLink : false,
				showCheckBoxColumn :false,
				enableColumnHeaderFilter : false,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				showSorterToolbar : _charEnableMultiSort,
				storeModel : {
					fields : [ 'CLIENT_CODE','CLIENT_NAME', 'REF_CODE','NO_POST_STRUCTURE',
								'EXECUTION_MODE','MOVEMENT_TYPE', 'EXECUTION_DATE',
								'EXECUTION_STATUS', 'FAILURE_REASON',
								'AGEREXECID','viewState',
								'AGREEMENT_NAME' ],
						proxyUrl : 'agreementSweepQueryList.srvc',
						rootNode : 'd.commonDataTable',
						totalRowsNode : 'd.__count'
				},
				handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record)	{	
					me.handleRowIconClick(tableView, rowIndex, columnIndex, btn, event, record);
				},
				handleMoreMenuItemClick : function(tableView, rowIndex, columnIndex, btn, event, record)	{	
					me.handleRowIconClick(tableView, rowIndex, columnIndex, btn, event, record);
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
				defaultColumnModel : SWEEP_QUERY_DEFAULT_COLUMN_MODEL || [],
				/**
				 * @cfg{Function} fnColumnRenderer Used as default column
				 *                renderer for all columns if fnColumnRenderer
				 *                is not passed to the grids column model
				 */
				//fnColumnRenderer : me.columnRenderer,
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
//	getAgreementSweepQueryGridConfiguration : function() {
//		var me = this;
//		var objConfigMap = null;
//		var objWidthMap = null;
//		var arrColsPref = null;
//		var storeModel = null;
//		objWidthMap = {
//
//			"CLIENT_NAME" : '25%',
//			"REF_CODE" : '10%',
//			"EXECUTION_MODE" : '10%',
//			"EXECUTION_DATE" : '17%',
//			"EXECUTION_STATUS" : '15%',
//			"FAILURE_REASON" : '27.6%'
//		};
//
//		arrColsPref = [ {
//			"colId" : "CLIENT_NAME",
//			"colDesc" : "Client Name"
//		}, {
//			"colId" : "REF_CODE",
//			"colDesc" : "Agreement Code"
//		}, {
//			"colId" : "EXECUTION_MODE",
//			"colDesc" : "Execution Mode"
//		}, {
//			"colId" : "EXECUTION_DATE",
//			"colDesc" : "Execution Date Time"
//		}, {
//			"colId" : "EXECUTION_STATUS",
//			"colDesc" : "Execution Status"
//		}, {
//			"colId" : "FAILURE_REASON",
//			"colDesc" : "Remarks"
//		} ];
//		storeModel = {
//			fields : [ 'CLIENT_CODE','CLIENT_NAME', 'REF_CODE',
//					'EXECUTION_MODE', 'EXECUTION_DATE',
//					'EXECUTION_STATUS', 'FAILURE_REASON',
//					'AGEREXECID','viewState',
//					'AGREEMENT_NAME' ],
//			proxyUrl : 'agreementSweepQueryList.srvc',
//			rootNode : 'd.commonDataTable',
//			totalRowsNode : 'd.__count'
//		};
//
//		objConfigMap = {
//			"objWidthMap" : objWidthMap,
//			"arrColsPref" : arrColsPref,
//			"storeModel" : storeModel
//		};
//		return objConfigMap;
//	},
//	getColumns : function(arrColsPref, objWidthMap) {
//		var me = this;
//		var arrCols = new Array(), objCol = null, cfgCol = null;
//		/* arrCols.push(me.createGroupActionColumn()); */						
//		arrCols.push(me.createActionColumn())
//		if (!Ext.isEmpty(arrColsPref)) {
//			for (var i = 0; i < arrColsPref.length; i++) {
//				objCol = arrColsPref[i];
//				cfgCol = {};
//				cfgCol.colHeader = objCol.colDesc;
//				cfgCol.colId = objCol.colId;
//				if (!Ext.isEmpty(objCol.colType)) {
//					cfgCol.colType = objCol.colType;
//					if (cfgCol.colType === "number")
//						cfgCol.align = 'right';
//				}
//
//				cfgCol.width = !Ext
//						.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId]
//						: 120;
//
//				cfgCol.fnColumnRenderer = me.columnRenderer;
//				arrCols.push(cfgCol);
//			}
//		}
//		return arrCols;
//	},
	getActionColumnModel : function() {
		var me = this;
		var objActionCol = {
				colType : 'actioncontent',
				colId : 'actioncontent',
				width : 108,
				colHeader: getLabel('action', 'Action'),
				sortable : false,
				locked : true,
				lockable: false,
				hideable: false,
				visibleRowActionCount : 1,
			items : [{
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record'),
				itemLabel : getLabel('lblviewRecord', 'View Record'),
				maskPosition : 3
			},
			{
				itemId : 'btnSnapshot',
				itemCls : 'grid-row-action-icon icon-clone',
				itemLabel :  getLabel('lblExcSnapshot', 'Execution Snapshot'),
				toolTip : getLabel('viewSnapshot', 'Execution Snapshot'),
				maskPosition : 4
			}]
		};
		var arrColumns = [objActionCol];
		return arrColumns;
	},
	handleRowIconClick : function(tableView, rowIndex,
			columnIndex, btn, event, record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'btnView') {
			me.submitExtForm(
					'agreementSweepQueryResultCenter.srvc',
					record, rowIndex);
		}
		else if(actionName === 'btnSnapshot')
		{
			showExecutionSnapshot(record);
		}
	}
});
