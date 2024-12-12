Ext.define('GCP.view.AgreementSweepQueryResultGridView', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.panel.Panel' ],
	xtype : 'agreementSweepQueryResultGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		this.items = [ /*{
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
		},*/ /*{
			xtype : 'panel',
			width : '100%',
			cls : 'xn-panel',
			bodyCls: 'gradiant_back',
			title: getLabel('movementSummary', 'Movement Summary'),
			autoHeight : true,
			itemId : 'agreementSweepQueryResultGridListView',
			items : [ {
				xtype : 'container',
				layout : 'hbox',
				//cls: 'ux_border-top ux_panel-transparent-background',
				items : [ ]

			} ]
		},*/ me.createGroupView()];
		this.callParent(arguments);
	}, 
	
	createGroupView : function() {
		var me = this;
		var groupView = null;
		var /*objGeneralSetting = {},*/ objGridSetting = {}, arrColumnSetting;

		if (objSweepQueryResultPref) {
			var objJsonData = Ext.decode(objSweepQueryResultPref);
			/*objGeneralSetting = objJsonData.d.preferences.GeneralSetting || {};*/
			objGridSetting = objJsonData.d.preferences.GridSetting || {};
			arrColumnSetting = objJsonData && objJsonData.d.preferences
					&& objJsonData.d.preferences.ColumnSetting
					&& objJsonData.d.preferences.ColumnSetting.gridCols
					? objJsonData.d.preferences.ColumnSetting.gridCols
					: SWEEP_QRY_RESULT_DEFAULT_COL_MODEL || '[]';
		}
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgParentCt : me,
			cls : 't7-grid',
			cfgGroupByUrl : 'static/scripts/lms/agreementSweepQueryResult/data/groupBy.json',
			enableQueryParam:false,
			cfgShowFilter : false,
			cfgShowFilterInfo : false,
			cfgSmartGridSetting : true,
			cfgAutoGroupingDisabled : true,
			cfgCaptureColumnSettingAt : !Ext.isEmpty(_charCaptureGridColumnSettingAt) ? _charCaptureGridColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				columnHeaderFilterCfg : {},
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeTxn,
				rowList : _AvailableGridSize,
				showEmptyRow : false,
				stateful : false,
				hideRowNumbererColumn : true,
				showCheckBoxColumn : false,
				showPager : true,
				minHeight : 100,
				heightOption : objGridSetting.defaultGridSize,
				cfgShowRefreshLink : false,
				enableColumnHeaderFilter : true,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showSorterToolbar : _charEnableMultiSort,
				storeModel : {
					fields : ['REF_CODE', 'MOVEMENT_REF_NMBR', 'DEBIT_ACCOUNT', 
						'CREDIT_ACCOUNT','DEBIT_BANK','CREDIT_BANK', 'AMNT_TRANSF',
						'MOVEMENT_STATUS', 'CLEARING_STATUS', 'REASON_FOR_NON_EXEC',
						'MOVEMENT_ID','AGREEMENT_CODE'],
					proxyUrl : 'agreementSweepQueryResult.srvc',
					rootNode : 'd.commonDataTable',
					totalRowsNode : 'd.__count'
				},
				groupActionModel : [],
				defaultColumnModel : me.getColumnModel(me.getDefaultColumnModel()),
				fnColumnRenderer : me.columnRenderer
			}
		});
		return groupView;
	},
	getColumnModel : function(arrCols) {
		var me = this;
		var actionCol = [];
		actionCol.push(me.createActionColumn());
		return actionCol.concat(arrCols);
	},
	getDefaultColumnModel : function() {
		arrColsPref = SWEEP_QRY_RESULT_DEFAULT_COL_MODEL;
		return arrColsPref;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'actioncontent',
			colHeader : getLabel("actions", "Actions"),
			locked : true,
			items : [{
				itemId : 'btnView',
				text : getLabel('viewRecord', 'View Record'),
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record'),
				maskPosition : 3
			}]
		};
		return objActionCol;
	},
	columnRenderer : function(value, meta, record, rowIndex,
			colIndex, store, view, colId) {
		var strRetValue = null;
		if (record.get('isEmpty')) {
			if (rowIndex === 0 && colIndex === 0) {
				meta.style = "display:inline;text-align:left;position:absolute;white-space: nowrap !important;empty-cells:hide;";
				return getLabel('gridNoDataMsg',
						'No records found !!!');											
			}
		}
		else if (colId === 'col_AMNT_TRANSF' && (typeof value != 'undefined') && value)
		{		
			strRetValue = setDigitAmtGroupFormat(value);							
		}	
		else
			strRetValue = value;
		
		return strRetValue;
	}
});
