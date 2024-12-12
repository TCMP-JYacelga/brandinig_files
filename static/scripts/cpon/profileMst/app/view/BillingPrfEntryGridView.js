Ext.define('GCP.view.BillingPrfEntryGridView', {
	extend : 'Ext.panel.Panel',
	border : false,
	xtype : 'BillingPrfEntryGridView',
	requires : ['Ext.ux.gcp.SmartGrid', 'GCP.view.PrfMstDtlsActionBarView'],
	autoHeight : true,
	layout : 'vbox',
	//cls : 'xn-panel',
	initComponent : function() {
		var me = this, grid = null;
		var checkBoxColumnHideShow = true;
		
		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
			checkBoxColumnHideShow= false;
		}
		
		grid = me.createGrid(checkBoxColumnHideShow);

		actionBar = Ext.create('GCP.view.PrfMstDtlsActionBarView', {
					itemId : 'dtlsActionBar',
					height : 21,
					width : '100%',
					parent : me
				});

		textfieldBillingSearch = Ext.create('Ext.form.field.Text', {
					itemId : 'searchBillingEntryTextField',
					cls : 'w10',
					padding : '0 0 0 5',
					listeners : {
						change : function(f, e) {
							me.searchTrasactionChange(grid);
						}
					}
				});

		radioMatchCriteria = Ext.create('Ext.form.RadioGroup', {
					xtype : 'radiogroup',
					itemId : 'matchCriteriaBillingEntry',
					vertical : true,
					columns : 1,
					items : [{
								boxLabel : getLabel('exactMatch', 'Exact Match'),
								name : 'searchOnPageBillingEntry',
								inputValue : 'exactMatchBillingEntry',
								listeners : {
									change : function(f, e) {
										me.searchTrasactionChange(grid);
									}
								}
							}, {
								boxLabel : getLabel('anyMatch', 'Any Match'),
								name : 'searchOnPageBillingEntry',
								inputValue : 'anyMatchBillingEntry',
								checked : true,
								listeners : {
									change : function(f, e) {
										me.searchTrasactionChange(grid);
									}
								}
							}]

				});

		me.items = [{
			xtype : 'container',
			layout : 'hbox',
			margin : '6 0 6 0',
			width:'100%',
			items : [{
						xtype : 'label',
						text : '',
						flex : 1
					}, {
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating',
						//padding : '4 0 0 0',
						items : [{
									xtype : 'button',
									border : 0,
									itemId : 'btnBillingSearchOnPageEntry',
									padding : '4 0 0 0',
									text : getLabel('searchOnPage',
											'Search on Page'),
									cls : 'xn-custom-button cursor_pointer',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'menu',
												items : [radioMatchCriteria]
											})
								}, textfieldBillingSearch]
					}]
		}, {
			xtype : 'panel',
			collapsible : true,
			width : '100%',
			cls : 'xn-panel',
			title : getLabel('billingProfiles', 'Billing Profiles'),
			itemId : 'prfMstDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						itemId : 'prfMstActionsView',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'font_bold',
									padding : '5 0 0 3'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}, grid]
		}

		];

		me.on('resize', function() {
					me.doLayout();
				});
		me.on('performGroupAction', function(btn, opts) {
					me.handleGroupActions(btn, opts);
				});
		me.callParent(arguments);
	},
	handleGroupActions : function(btn, opts) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/billingProfileMst/{0}',
				strAction);
		this.preHandleGroupActions(strUrl, excryptedParentId);
	},
	preHandleGroupActions : function(strUrl, excryptedParentId) {
		var me = this;
		var grid = me.down('smartgrid[itemId="gridBillingProfileDetails"]');
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : excryptedParentId
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
							me.enableDisablePrMstActions(grid);
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},
	searchTrasactionChange : function(grid) {
		var me = this;
		var searchValue = textfieldBillingSearch.value;
		var anyMatch = radioMatchCriteria.getValue();
		if ('anyMatchBillingEntry' === anyMatch.searchOnPageBillingEntry) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		// var grid = this.getPmtGrid();
		grid.view.refresh();

		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

		if (searchValue !== null) {
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
							});
							// update cell html
							cell.dom.innerHTML = cellHTML;
							td = td.next();
						}
					}
				}, me);
			}
		}
	},
	createGrid : function(checkBoxColumnHideShow) {
		var me = this;
		var grid = null, arrCols = null;
		var strUrl = '';
		strUrl = 'cpon/billingProfileDetails.json';

		var pgSize = (typeof serverTxnPageSize != 'undefined')
				? serverTxnPageSize
				: 10;
		arrCols = me.getColumns();
		grid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridBillingProfileDetails',
			itemId : 'gridBillingProfileDetails',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			padding : '10 0 0 0',
			rowList : [5, 10, 15, 20, 25, 30],
			minHeight : 100,
			columnModel : arrCols,
			showCheckBoxColumn: checkBoxColumnHideShow,
			storeModel : {
				fields : ['notifications', 'identifier', 'beanName',
						'profileId', 'primaryKey', 'eventCode',
						'eventName', 'assignmentStatus','parentRecordKey', 'version',
						'recordKeyNo'],
				proxyUrl : strUrl,
				rootNode : 'd.profileDetails',
				totalRowsNode : 'd.__count'
			},
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,
			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},
			handleRowMoreMenuItemClick : function(menu, event) {
				var dataParams = menu.ownerCt.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, this, event, dataParams.record);
			},
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				afterrender : function(panel, opts) {						
					if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
						var prfMstActionsView = me.down('container[itemId="prfMstActionsView"]');
						prfMstActionsView.hide();
					}
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					// console.log(grid.getSelectedRecords());
					me.enableDisablePrMstActions(grid);

				}
			}
		});
		return grid;
	},
	enableDisablePrMstActions : function(grid) {
		var me = this;
		var discardActionEnabled = false;
		var assignActionEnabled = false;
		var blnEnabled = false;

		if (Ext.isEmpty(grid.getSelectedRecords())) {
			discardActionEnabled = false;
			assignActionEnabled = false;
		} else {
			Ext.each(grid.getSelectedRecords(), function(item) {
						if (item.data.assignmentStatus == "Not assigned") {
							assignActionEnabled = true;
						} else if (item.data.assignmentStatus == "Assigned") {
							discardActionEnabled = true;
						}
					});
		}

		var discardBtn = me
				.down('prfMstDtlsActionBarView[itemId="dtlsActionBar"] [actionName="unassign"]');
		var assignBtn = me
				.down('prfMstDtlsActionBarView[itemId="dtlsActionBar"] [actionName="assign"]');

		if (!discardActionEnabled && !assignActionEnabled) {
			discardBtn.setDisabled(!blnEnabled);
			assignBtn.setDisabled(!blnEnabled);
		} else if (discardActionEnabled && assignActionEnabled) {
			assignBtn.setDisabled(!blnEnabled);
			discardBtn.setDisabled(!blnEnabled);
		}else if (assignActionEnabled) {
			assignBtn.setDisabled(blnEnabled);
		} else if (discardActionEnabled) {
			discardBtn.setDisabled(blnEnabled);
		}

	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var objWidthMap = {
			"eventName" : 180,
			"assignmentStatus" : 180
		};

		var arrColsPref = [{
					"colId" : "eventName",
					"colDesc" : getLabel("lblBillingDesc","Event Description")
				},{
					"colId" : "assignmentStatus",
					"colDesc" : getLabel("status", "Status")
				}];
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType))
					cfgCol.colType = objCol.colType;
				if (objCol.colId === 'amount' || objCol.colId === 'count')
					cfgCol.align = 'right';
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},		
	
	addFilterUrl : function() {
		var strUrl = '';
		strUrl = strUrl + '&$filter=' + mstProfileId;

		if (modeVal == 'VERIFY' || modeVal == 'SUBMIT' || modeVal == 'VIEW') {
			strUrl = strUrl + '&$qparam=Y';
		}

		return strUrl;
	},
	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			var strRetValue = value;
			if(record.raw.isUpdated === 'D')
			{
				strRetValue='<span class="strike_through_row">'+value+'</span>';
			}
			else if(record.raw.isUpdated === 'N')
			{
				strRetValue='<span class="blue_row">'+value+'</span>';
			}
			return strRetValue;
		},	
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$filter=' + mstProfileId;
		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') 
		{
			strUrl = strUrl + '&$qparam=Y';
			if(null!=blnViewOld || !(''==blnViewOld))
			{
				strUrl = strUrl +'&$old='+blnViewOld;
			}			
		}
		// strUrl = strUrl + me.addFilterUrl();
		grid.loadGridData(strUrl, null);
	}
});