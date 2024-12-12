Ext.define('GCP.view.FxSpreadPrfEntryGridView', {
	extend : 'Ext.panel.Panel',
	border : false,
	xtype : 'fxSpreadPrfEntryGridView',
	requires : ['Ext.ux.gcp.SmartGrid', 'GCP.view.PrfMstDtlsActionBarView'],
	autoHeight : true,
	layout : 'vbox',
	cls : 'ux_panel-background',
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

		textfieldTypeCodeSearch = Ext.create('Ext.form.field.Text', {
					itemId : 'searchFxSpreadEntryTextField',
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
					itemId : 'matchCriteriaFxSpreadEntry',
					vertical : true,
					columns : 1,
					items : [{
								boxLabel : getLabel('exactMatch', 'Exact Match'),
								name : 'searchOnPageFxSpreadEntry',
								inputValue : 'exactMatchTypeCodeEntry',
								listeners : {
									change : function(f, e) {
										me.searchTrasactionChange(grid);
									}
								}
							}, {
								boxLabel : getLabel('anyMatch', 'Any Match'),
								name : 'searchOnPageFxSpreadEntry',
								inputValue : 'anyMatchFxSpreadEntry',
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
			margin : '0 0 12 0',
			width:'100%',
			items : [ {
						xtype : 'button',
						itemId : 'addNewProfileId',
						name : 'alert',
						text : '<span class="">'
								+ getLabel('addCcyPai', 'Add Currency Pair')
								+ '</span>',
						cls : 'ux_cancel-button ux_button-background-color ux_button-padding  ux_loan-center-button',
						glyph: 'xf055@fontawesome',
						handler : function() {
							me.addCcyPair("addFxSpreadCcyDetail.form");
						}
					},{
						xtype : 'label',
						text : '',
						flex : 1
					}, {
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating ux_hide-image',
						//padding : '4 0 0 0',
						items : [{
									xtype : 'button',
									border : 0,
									itemId : 'btnTypeCodeSearchOnPageEntry',
									padding : '4 0 0 0',
									text : getLabel('searchOnPage',
											'Search on Page'),
									cls : 'xn-custom-button cursor_pointer',
									menu : Ext.create('Ext.menu.Menu', {
												itemId : 'menu',
												items : [radioMatchCriteria]
											})
								}, textfieldTypeCodeSearch]
					}]
		}, {
			xtype : 'panel',
			collapsible : true,
			width : '100%',
			cls : 'xn-ribbon ux_border-bottom ux_panel-transparent-background',
			title : getLabel('fxccypairs', 'FX Currency Pair'),
			itemId : 'prfMstDtlView',
			items : [ grid]
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
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/typeCodeProfileMst/{0}',
				strAction);
		this.preHandleGroupActions(strUrl, excryptedParentId,record);
	},
	preHandleGroupActions : function(strUrl, excryptedParentId,record) {
		var me = this;
		var grid = me.down('smartgrid[itemId="gridFxSpreadProfileDetails"]');
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : excryptedParentId,
							typeDescription : records[index].data.typeDescription,
							typecodeLevel:records[index].data.typecodeLevel,
							sign:records[index].data.sign,
							gridOrder:records[index].data.gridOrder,
							headerOrder:records[index].data.headerOrder,
							grid:records[index].data.grid,
							header:records[index].data.header
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
		var searchValue = textfieldTypeCodeSearch.value;
		var anyMatch = radioMatchCriteria.getValue();
		if ('anyMatchFxSpreadEntry' === anyMatch.searchOnPageFxSpreadEntry) {
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
		strUrl = 'cpon/fxSpreadProfileDetails.json';

		var pgSize = (typeof serverTxnPageSize != 'undefined')
				? serverTxnPageSize
				: 10;
		arrCols = me.getColumns();
		grid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridFxSpreadProfileDetails',
			itemId : 'gridFxSpreadProfileDetails',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			padding : '5 10 10 10',
			rowList : [5, 10, 15, 20, 25, 30],
			minHeight : 100,
			columnModel : arrCols,
			showCheckBoxColumn: checkBoxColumnHideShow,
			storeModel : {
				fields : ['ccyPairCode','currencyPairDesc', 'identifier', 'beanName',
						'profileId', 'primaryKey', 'noOfSlab',
						 'parentRecordKey', 'version',
						'recordKeyNo'],
				proxyUrl : strUrl,
				rootNode : 'd.profileDetails',
				totalRowsNode : 'd.__count'
				
			},
			isRowIconVisible : me.isRowIconVisible,
			//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
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
			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu,
					event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			},
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
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
	isRowIconVisible : function() {
		return true;
	},
	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
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
	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var objWidthMap = {
			"action" : 80,
			"currencyPairDesc" : 180,
			"noOfSlab" : 180
		};
		arrCols.push(me.createActionColumn());
		var arrColsPref = [{
					"colId" : "currencyPairDesc",
					"colDesc" : "Currency Pair",
						"sort":true
				},{
					"colId" : "noOfSlab",
					"colDesc" : "Tiers #",
						"sort":false
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
				cfgCol.sortable=objCol.sort;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				cfgCol.editor = {
                xtype: 'datefield'
            };
				if (viewPageMode == 'VIEW_CHANGES') {
					cfgCol.fnColumnRenderer = me.columnRenderer;
				}
				arrCols.push(cfgCol);
			}
		}
		
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			var strRetValue =value;
			if(colId == 'col_currencyPairDesc')
			{
			  if(null !=record.raw.currencypairDescFieldType)
				strRetValue='<span class='+record.raw.currencypairDescFieldType+'>'+strRetValue+'</span>';
			}
			if(colId == 'col_noOfSlab')
			{
				if(undefined !=record.raw.noOfSlabsFieldType)
				strRetValue='<span class='+record.raw.noOfSlabsFieldType+'>'+strRetValue+'</span>';
			}
			return strRetValue;
		},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('profileName'),
						record.get('history').__deferred.uri);
			}
		} else if (actionName === 'btnEdit') {
			var strUrl = "editfxSpreadCcypairDtl.form";
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
		
			var strUrl = "viewfxSpreadCcypairDtl.form";
			me.submitForm(strUrl, record, rowIndex);
		}
		else if (actionName === 'btnDiscard') {
			this.preHandleGroupActions("cpon/fxSpreadProfileMst/discardCcyPair", excryptedParentId,record);
					
			//var strUrl = "discardfxSpreadCcypairDtl.form";
			//me.submitForm(strUrl, record, rowIndex);
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var updateIndex = rowIndex;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'PREVMODE', modeVal));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	addCcyPair : function(strUrl) {
		var me = this;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				excryptedParentId));		
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = null;
		if(modeVal == 'VIEW' || modeVal == 'VERIFY')
		{
			 objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : 80,
				align : 'right',
				locked : true,
				items : [{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewToolTip', 'View Record')
							}]
			};
		}
		else
		{
			objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : 80,
				align : 'right',
				locked : true,
				items : [{
							itemId : 'btnDiscard',
							itemCls : 'grid-row-delete-icon middleAlign',
							itemLabel : getLabel('discardToolTip', 'Discard Record'),
							toolTip : getLabel('discardToolTip', 'Discard Record')
						},{
							itemId : 'btnEdit',
							itemCls : 'grid-row-action-icon icon-edit',
							itemLabel : getLabel('editToolTip', 'Edit'),
							toolTip : getLabel('editToolTip', 'Edit')
						}, {
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							itemLabel : getLabel('viewToolTip', 'View Record'),
							toolTip : getLabel('viewToolTip', 'View Record')
							}]
				};
		}
		return objActionCol;
	},
	
	addFilterUrl : function() {
		var strUrl = '';
		strUrl = strUrl + '&$filter=' + mstProfileId;

		var prfMstActionsView = me
				.down('container[itemId="prfMstActionsView"]');
				
		if (modeVal == 'VERIFY' || modeVal == 'SUBMIT' || modeVal == 'VIEW') {
			strUrl = strUrl + '&$qparam=Y';
			prfMstActionsView.hide();
		}

		return strUrl;
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$filter=' + mstProfileId;

		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
			strUrl = strUrl + '&$qparam=Y';
		}
		if (viewPageMode == 'VIEW_CHANGES') {
			strUrl = strUrl + 'viewMode=VIEW_CHANGES';
		}
		// strUrl = strUrl + me.addFilterUrl();
		//grid.loadGridData(strUrl, null);
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') 
		{
			var addNewCurrency = me.down('[itemId="addNewProfileId"]');
			addNewCurrency.hide();
		}
	},
	enableEntryButtons:function(){
	  gridRender=true;
	  enableDisableGridButtons(false);
	 }
});