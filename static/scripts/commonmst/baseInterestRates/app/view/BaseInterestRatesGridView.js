Ext.define('GCP.view.BaseInterestRatesGridView', {

	extend : 'Ext.grid.Panel',
	xtype : 'baseInterestRatesGridView',
	requires : [ 'Ext.grid.*','GCP.view.BaseInterestRatesPopup','Ext.ux.grid.feature.MultiSorting', 'Ext.ux.gcp.SmartGridSorter' ],
	selType : 'cellmodel',
	padding: '5 10 10 10',
	cls: 'ux_panel-transparent-background',
	plugins : [ {
		ptype : 'cellediting',
		clicksToEdit : 1,
		listeners : {
			beforeedit : function(e, editor) {
				var retVal = false;
				var status = editor.record.get('requestStateDesc');
				if ((effectiveDate == dtApplicationDate)
					&& (status === 'New' || status === 'Approved' || status === 'Modified' || status === 'Not Captured')) {
					retVal =  true;
				} 
				return retVal;
			},
			afteredit : function(e, editor) {
				var retVal = false;
				var status = editor.record.get('requestStateDesc');
				editor.record.set('isModified', 'N');
				if ((effectiveDate == dtApplicationDate)
					&& (status === 'New' || status === 'Approved' || status === 'Modified')) {
					editor.record.set('isModified', 'Y');
					retVal = true;
				}
				return retVal;
			}
		}
	} ],

	initComponent : function() {
		var me = this;
		var itemsPerPage = 10;
		var url = 'baseInterestRates.srvc' + '?' + csrfTokenName + '='
				+ csrfTokenValue + '&$effectiveDate=' + effectiveDate;

		me.store = Ext.create('Ext.data.Store', {
			storeId : 'detailStore',
			sortable: false,
		    defaultSortable: false,
			/*
			 * autoLoad : { start : 0, limit : itemsPerPage, '$inlinecount' :
			 * 'allpages', '$top' : itemsPerPage*3, '$skip' : skip*1,
			 * '$effectiveDate' : effectiveDate },
			 */
			pageSize : itemsPerPage,

			fields : [ 'baseRateCurrency', 'baseRateType',
					'baseRateDescription', 'baseInterestRate',
					'baseRateRecordKey', 'baseRateMstRecordKey',
					'effectiveDate', 'requestStateDesc', 'isSelected',
					'isModified', 'recordKeyNo', 'version' ],

			proxy : {
				type : 'ajax',
				method : 'POST',
				url : url,
				reader : {
					type : 'json',
					root : 'd.baseInterestRates',
					totalProperty : 'd.__count'
				}
			},

			listeners : {
				beforeload : function(store, operation, eOpts) {
					skip = store.currentPage;
				}
			}
		});

		/*me.selModel = new Ext.selection.CheckboxModel({
			checkOnly : true,
			xtype : 'checkcolumn',
			headerWidth : 34,
			itemId : 'isSelected',
			ignoreRightMouseSelection : true,
			injectCheckbox : 0,
			renderer : function(value, metaData, record, rowIndex, colIndex,
					store, view) {
				if (record.get('isEmpty'))
					return '';
				else {
					var baseCSSPrefix = Ext.baseCSSPrefix;
					metaData.tdCls = baseCSSPrefix + 'grid-cell-special '
							+ baseCSSPrefix + 'grid-cell-row-checker';
					return '<div class="' + baseCSSPrefix
							+ 'grid-row-checker">&#160;</div>';

				}
			}
		hasSelection:function
		});*/
		
		me.columns = [ {
			xtype : 'checkcolumn',
			text : '&#160;',
		    sortable: false,
		    draggable: false,
		    resizable: false,
		    hideable: false,
		    menuDisabled: true,
			columnHeaderCheckbox: false,
			checkedCls: 'x-column-header-text',
			itemId : 'isSelected',
			dataIndex : 'isSelected',
			 mode: 'MULTI',
		     checkOnly: true,
			width : '2.5%'
		},{
			 xtype:'actioncolumn',
			 width : '3%',
		    sortable: false,
		    draggable: false,
		    resizable: false,
		    hideable: false,
		    menuDisabled: true,
	         items: [{
				btnId : 'btnHistory',
				tooltip : getLabel('historyToolTip', 'View History'),
				icon: 'static/images/icons/icon_viewHistory.jpg',
				iconCls:'baseInterestRatesViewHistoryImg',
				getClass: function(value, metaData, record) { 
					if (record.data.baseRateRecordKey==='')
					{
						return 'xn-hide';
					}
					else
                    {
                        return 'baseInterestRatesViewHistoryImg';
                    }
				},
				handler : function(grid, rowIndex, columnIndex) {
					var record = grid.getStore().getAt(rowIndex).raw;
					var product = record.baseRateType;
					var url = record.history.__deferred.uri;
					var id = record.identifier;
					if(!Ext.isEmpty(record.recordKeyNo)){
						Ext.create('GCP.view.BaseInterestRatesPopup', {
							productName : product,
							historyUrl : url,
							identifier : id
						}).show();
					}
				}
	         }]
			
		}, {			
			header : getLabel('currency','Currency'),
			dataIndex : 'baseRateCurrency',
			width : '10%',
			align : 'center'
		}, {
			header : getLabel('baseRateCode','Base Rate Code'),
			dataIndex : 'baseRateType',
			width : '15%'
		}, {
			header : getLabel('prfMstDescription','Description'),
			dataIndex : 'baseRateDescription',
			width : '45%'
		}, {
			header : getLabel('baseRateCol','Base Rate(%)'),
			dataIndex : 'baseInterestRate',
			width : '10%',
			align : 'right',
			editor : {
				xtype : 'numberfield',
				align : 'right',
				decimalPrecision : 4,
				allowBlank : false,
				anchor : '100%',
				maxValue : 100,
				minValue : 0, // prevents negative numbers
				// Remove spinner buttons, and arrow key and
				// mouse wheel
				// listeners
				hideTrigger : true,
				keyNavEnabled : false,
				mouseWheelEnabled : false
			},
			renderer : function( value, metaData, record, rowIndex )
			{
				//Set these once, right after Ext.onReady
				Ext.util.Format.thousandSeparator = ',';
				Ext.util.Format.decimalSeparator = '.';
				//Then this should work:
				value = Ext.util.Format.number(value, '000.0000'); //output 123.4567
				return value;
			}
			
		}, {
			header : getLabel('status','Status'),
			dataIndex : 'requestStateDesc',
			width : '15%',
			"locked" : false,
			"lockable" : false,
			"sortable" : false,
			"hideable" : false,
			"resizable" : false,
			"draggable" : false,
			"hidden" : false,
		renderer : function( value, metaData, record, rowIndex )
		{
			if(!Ext.isEmpty(record.raw.baseRateMstRecordKey))
			return value;
			else
			return getLabel('notCaptured','Not Captured');	
		}
		} ];
		me.dockedItems = [ {
			xtype : 'pagingtoolbar',
			store : 'detailStore',
			itemId : 'paggingtlbr',
			displayMsg : 'Displaying {0} - {1} of {2}',
			emptyMsg : getLabel('noRecFound','No records found !!!'),
			dock : 'bottom',
			cls: 'xn-paging-toolbar xn-paging-toolbar-default xn-paging-toolbar-docked-bottom xn-paging-toolbar-default-docked-bottom font_bold',
			items: ['->'],
			prependButtons: true,
			displayInfo : true,
			pageSize : itemsPerPage
		} ];

		//Added to multiple sorting
		var multiSortFeature = null, objPager, objSorter, objSortView = null, colHdrFilterFeature = null;
		var arrFeatures = new Array(), arrDocekdItems = new Array(), arrPlugins = new Array();
		
		arrFeatures.push({
			ftype : 'multisorting'
		});
		
		me.features = arrFeatures;
		/*objSorter = me.createSorter();
		me.dockedItems.push(objSorter);*/
		

		
		me.callParent(arguments);
	},
	createSorter : function() {
		var me = this;
		var sorter = Ext.create('Ext.ux.gcp.SmartGridSorter', {
					dock : 'top',
					itemId : 'sortToolbar'
				});
		sorter.on('afterrender', function(sorter) {
					var reorderPlugin = sorter.getPlugin('sort-reorderer');
					reorderPlugin.on('Drop', me.changeSortOrder, me);
				})
		return sorter;
	},
	changeSortOrder : function(ux, container, dragCmp, startIdx, idx, eOpts) {
		if (startIdx === idx)
			return false;
		var me = this;
		var sortTbar = me.down('toolbar[itemId="sortToolbar"]');
		var toolbarItems = sortTbar ? sortTbar.items.items : [];
		var toolbarBtnArray = new Array();
		for (var count = 1; count < toolbarItems.length; count++) {
			toolbarBtnArray.push({
						property : toolbarItems[count].property,
						direction : toolbarItems[count].direction
					});
		}

		me.getStore().sort(toolbarBtnArray, null, false);
		me.getStore().currentPage = 1;
		me.handleSortChange(1, 1);
	},
	handleSortChange : function(newPgNo, oldPgNo) {
		var me = this;
		var objStore = me.store;
		var strUrl = objStore.dataUrl;
		var filterData = me.getColumnFilterData();
		if (Ext.isEmpty(me.storeModel.sortState) || !me.isFirstDataLoadCall) {
			me.fireEvent('gridSortChange', me, strUrl, me.pageSize, newPgNo,
					oldPgNo, objStore.sorters, filterData);
		}
		me.isFirstDataLoadCall = false;
	},
	getColumnFilterInstance : function() {
		var me = this;
		var objFilter = null;
		var isLockingEnable = me.enableLocking;
		if (isLockingEnable)
			objFilter = (me.lockedGrid && me.lockedGrid.filters
					? me.lockedGrid.filters
					: null)
					|| (me.normalGrid && me.normalGrid.filters
							? me.normalGrid.filters
							: null);
		else
			objFilter = me.filters || null;

		return objFilter;

	},
	getColumnFilterData : function(filter) {
		var me = this;
		var objData = null, retArray = null;
		var objFilter = (filter || me.getColumnFilterInstance());
		var arrData = null;
		if (objFilter) {
			arrData = objFilter.getFilterData() || [];
			Ext.each(arrData, function(obj) {
						objData = {};
						retArray = (retArray || {})
						objData['fieldName'] = obj.field;
						objData['type'] = obj.data.type;
						objData['value'] = obj.data.value;
						retArray[obj.field] = objData;
					});
		}
		return retArray;
	},

	onLockedHeaderSortChange : function(headerCt, header, sortState) {
		if (sortState) {
			// no real header, and silence the event so we dont get into an
			// infinite loop
			// this.normalGrid.headerCt.clearOtherSortStates(null, true);
		}
	},
	onNormalHeaderSortChange : function(headerCt, header, sortState) {
		if (sortState) {
			// no real header, and silence the event so we dont get into an
			// infinite loop
			// this.lockedGrid.headerCt.clearOtherSortStates(null, true);
		}
	},
	getState : function() {
		var me = this, state = me.callParent(), sorter = me.store.sorters
				.first(), sorters = me.store.sorters.items;
		// sorters = me.store.sorters;
		state = me.addPropertyToState(state, 'columns', (me.headerCt || me)
						.getColumnsState());
		if (sorters) {
			state = me.addPropertyToState(state, 'sort', sorters);
		}
		return state;
	},
	applyState : function(state) {
		var me = this, sorter = state.sort, store = me.store, columns = state.columns;
		delete state.columns;
		// Ensure superclass has applied *its* state.
		// AbstractComponent saves dimensions (and anchor/flex) plus collapsed
		// state.
		if (columns) {
			(me.headerCt || me).applyColumnsState(columns);
		}
		if (sorter) {
			if (store.remoteSort) {
				// Pass false to prevent a sort from occurring
				store.sort(sorter, null, false);
			} else {
				store.sort(sorter.property, sorter.direction);
			}
		}
		me.setSortState();
		if (me.multiSort === true)
			me.updateSortViewToolbar();
	},
	setSortState : function() {
		if (this.enableLocking) {
			var headerCt, sorters, grid;

			grid = this.normalGrid;
			headerCt = grid.view.headerCt;
			sorters = grid.store.sorters;

			headerCt.items.each(function(header) {
						sortState = header.sortState;
						if (sorters.containsKey(header.getSortParam())) {
							sorter = sorters.getByKey(header.getSortParam());
							header.setSortState(sorter.direction, false, true);
						}
					}, grid);

			grid = this.lockedGrid;
			headerCt = grid.view.headerCt;
			sorters = grid.store.sorters;

			headerCt.items.each(function(header) {
						sortState = header.sortState;
						if (sorters.containsKey(header.getSortParam())) {
							sorter = sorters.getByKey(header.getSortParam());
							header.setSortState(sorter.direction, false, true);
						}
					}, grid);
		}
	},
	handleColumnFilterUpdate : function(filters) {
		var me = this;
		var filterData = me.getColumnFilterData(filters);
		var objStore = me.store;
		var strUrl = objStore.dataUrl;
		me.fireEvent('gridColumnFilterChange', me, strUrl, me.pageSize, 1, me
						.getCurrentPage(), objStore.sorters, filterData);
	}
});
