Ext.define('GCP.controller.PrfMstDetailsEntryController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.HolidayPrfEntryGridView'],
	views : ['GCP.view.PrfMstDtlsActionBarView',
			'GCP.view.HolidayPrfEntryGridView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'holidayPrfEntryGridView',
				selector : 'holidayPrfEntryGridView'
			}, {
				ref : 'prfDetailsGrid',
				selector : 'holidayPrfEntryGridView grid[itemId="prfDetailsGrid"]'
			}, {
				ref : 'prfMstActionsView',
				selector : 'holidayPrfEntryGridView container[itemId="prfMstActionsView"]'
			}, {
				ref : 'prfMstDtlView',
				selector : 'holidayPrfEntryGridView panel[itemId="prfMstDtlView"]'
			}, {
				ref : 'searchTextField',
				selector : 'holidayPrfEntryGridView textfield[itemId="searchAlertEntryTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'holidayPrfEntryGridView radiogroup[itemId="matchCriteriaAlertEntry"]'
			}, {
				ref : 'createNewToolBar',
				selector : 'holidayPrfEntryGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'yearFilter',
				selector : 'holidayPrfEntryGridView combo[itemId="yearFilter"]'
			},{
				ref : 'actionBar',
				selector : 'holidayPrfEntryGridView prfMstDtlsActionBarView'
			}, {
				ref : 'discardBtn',
				selector : 'holidayPrfEntryGridView toolbar[itemId="dtlsActionBar"] button[itemId="btnDiscard"]'
			}, {
				ref : 'enableBtn',
				selector : 'holidayPrfEntryGridView toolbar[itemId="dtlsActionBar"] button[itemId="btnEnable"]'
			}, {
				ref : 'disableBtn',
				selector : 'holidayPrfEntryGridView toolbar[itemId="dtlsActionBar"] button[itemId="btnDisable"]'
 			}],
	config : {
		selectedPrfMst : addEntryFor,
		dateFilterVal:null,
		strOldUrl : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.control({
			'holidayPrfEntryGridView' : {
				render : function(panel, opts) {
					me.handleSmartGridConfig();
					me.handleGridHeader();
				}
			},
			'holidayPrfEntryGridView smartgrid' : {
				render : function(grid) {
					me.handleActionBar();
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex, records, jsonData);
				}
			},
			'holidayPrfEntryGridView  combo[itemId="yearFilter"]' : {
				select : function(combo) {
					me.dateFilterVal=combo.getValue();
					me.getPrfDetailsGrid().refreshData();
				},
				boxready : function(combo, width, height, eOpts) {
					combo.setValue("ALL");
				}
			},
			'holidayPrfEntryGridView textfield[itemId="searchAlertEntryTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			
			'holidayPrfEntryGridView radiogroup[itemId="matchCriteriaAlertEntry"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},

			'holidayPrfEntryGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBeneficiary"]' : {
				click : function(btn, e, eOpts) {
					me.handleEntryAction(btn,
							"addSystemBeneficiarySetupMaster.form");
				}
			},
			'holidayPrfEntryGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateEnrichment"]' : {
				click : function(btn, e, eOpts) {
					me.handleEntryAction(btn, "addEnrichmentMasterSetup.form");
				}
			},
			'holidayPrfEntryGridView toolbar[itemId=dtlsActionBar]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
		});
	},
	handleEntryAction : function(btn, Url) {
		var me = this;
		var form;
		var strUrl = Url;
		if (!Ext.isEmpty(strUrl)) {
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'profileMstName', btn.name));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'profileViewState', $('#viewState').val()));// Temporary
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'transactionType', $('#txnType').val())); // Changes
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}
	},
	handleGridHeader : function() {
		var me = this;
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel)) {
			createNewPanel.removeAll();
		}

		if ('enrichment' == me.selectedPrfMst) {
			createNewPanel.add({
				xtype : 'button',
				border : 0,
				text : getLabel('createEnrichment', 'Create New Enrichment'),
				cls : 'cursor_pointer ux_button-background-color ux_button-padding',
				padding : '4 0 2 0',
				glyph : 'xf055@fontawesome',
				parent : this,
				itemId : 'btnCreateEnrichment'
			});
		}
	},
	handleGroupActions : function(btn, record) {
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('services/holidayProfileDetails/{0}',strAction);
		this.preHandleGroupActions(strUrl, excryptedParentId,record);
	},
	preHandleGroupActions : function(strUrl, encryptedParentId,record) {
		var me = this;
		var grid = me.getPrfDetailsGrid();
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
							userMessage : encryptedParentId
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			grid.setLoading(true);
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
							me.enableValidActionsForGrid();
							var errorMessage = '';
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										excryptedParentId = data.parentIdentifier;
										document.getElementById('viewState').value = excryptedParentId;
										document.getElementById('parentViewState').value = excryptedParentId;
									}
									if(!Ext.isEmpty(data.listActionResult))
									{
								        Ext.each(data.listActionResult[0].errors, function(error, index) {
									         errorMessage = errorMessage + error.errorMessage +"<br/>";
									        });
									}
								}
								if(!Ext.isEmpty(errorMessage))
						        {
						        	Ext.MessageBox.show({
										title : "Error",
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						        }
							}
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
							grid.setLoading(false);							
						},
						failure : function() {
							grid.setLoading(false);
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},
	searchTrasactionChange : function() {
		var me = this;
		var grid = me.getPrfDetailsGrid();
		var searchValue = me.getSearchTextField().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatchAlertEntry' === anyMatch.searchOnPageAlertEntry) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}
		grid.view.refresh();
		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';

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
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$filter=' + parentRecKey;
		if(me.dateFilterVal!=null)
		strUrl=strUrl+"&$holidayYear="+me.dateFilterVal;
		strUrl = strUrl + '&$qparam=Y';
		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
			if (null != blnViewOld || !('' == blnViewOld)) {
				strUrl = strUrl + '&$old=' + blnViewOld;
			}
			if(blnViewOld == 'TRUE')
		{
			 strOldUrl = grid.generateUrl("cpon/oldHolidayProfileDetails.json", pgSize, newPgNo, oldPgNo, sorter);
				
		}
		}
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		holidayGridLoaded=true;
		enableDisableGridButtons(false);
	},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;	
		if (modeVal != 'VERIFY' && modeVal != 'VIEW' && modeVal != 'SUBMIT') { 
			 arrCols.push(me.createActionColumn());
		}
		if(modeVal == 'VIEW' && blnViewOld == 'TRUE')
		{
		   arrCols.push(me.createViewOnlyActionColumn());   
    }
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.draggable = true;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.sortable = objCol.sort;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	createGroupActionColumn : function() {
		var objActionCol = {
			colType : 'action',
			colId : 'groupaction',
			width : 80,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'discard',
						actionName:'discard',
						itemCls : 'grid-row-text-icon icon-discard-text',
						toolTip : getLabel('prfMstActionDiscard', 'Discard'),
						itemLabel : getLabel('prfMstActionDiscard', 'Discard')
					}]
		};
		return objActionCol;
	},
	createActionColumn : function() {
		var objActionCol = {};
			objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : 85,
				align : 'right',
				locked : true,
				items : [{
					itemId : 'btnEdit',
					itemCls : 'grid-row-action-icon icon-edit',
					toolTip : getLabel('editToolTip', 'Edit')
				},{
					itemId : 'btnView',
					itemCls : 'grid-row-action-icon icon-view',
					toolTip : getLabel('viewToolTip', 'View Record')
				},{
					itemId : 'btnClone',
					itemCls : 'grid-row-action-icon icon-clone',
					itemLabel : getLabel('lblcopyrecordsToolTip', 'Copy Record')
				}]
			};
		return objActionCol;
	},
	createSystemBeneActionColumn : function() {
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			locked : true,
			items : [{
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record')
				}, {
				itemId : 'btnHistory',
				itemCls : 'grid-row-action-icon icon-history',
				itemLabel : getLabel('historyToolTip', 'View History')
				}]
		};
		return objActionCol;
	},
	handleSmartGridConfig : function() {
		var me = this;
		var prfDetailsGrid = me.getPrfDetailsGrid();
		var objConfigMap = me.getPrfMstConfiguration();
		var arrCols = new Array();
		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		if (!Ext.isEmpty(prfDetailsGrid)) {
			var store = prfDetailsGrid.createGridStore(objConfigMap.storeModel);
			var columns = prfDetailsGrid.createColumns(arrCols);
			prfDetailsGrid.reconfigure(store, columns);
			prfDetailsGrid.down('pagingtoolbar').bindStore(store);
			prfDetailsGrid.refreshData();
		} else {
			me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
		}
	},
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		var prfDetailsGrid = null;
		var enableDisableChkBoxColumn = true;
		var yearFilter = me.getYearFilter();
		pgSize = _GridSizeMaster;
		if (modeVal == 'VERIFY' || modeVal == 'SUBMIT') {
			enableDisableChkBoxColumn = false;
			yearFilter.disable(true);
		}
		if(modeVal == 'VIEW'){
			enableDisableChkBoxColumn = false;
		}
		prfDetailsGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'prfDetailsGrid',
			itemId : 'prfDetailsGrid',
			cls : 'ux_panel-transparent-background',
			pageSize : pgSize,
			stateful : false,
			padding : '5 10 10 10',
			rowList : _AvailableGridSize,
			height : 'auto',
			columnModel : arrCols,
			storeModel : storeModel,
			showEmptyRow : false,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,
			showCheckBoxColumn : enableDisableChkBoxColumn,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex,
										 cellIndex, menu, event, record) {
				 var dataParams = menu.dataParams;
				 me.handleRowIconClick(dataParams.view, dataParams.rowIndex, dataParams.columnIndex,
						 menu, null, dataParams.record);
			 }
		});

		var prfMstDtlView = me.getPrfMstDtlView();
		prfMstDtlView.add(prfDetailsGrid);
		prfMstDtlView.doLayout();
	},
	handleRowIconClick : function(view, rowIndex, columnIndex, btn, event,
			record) {
		var actionName = btn.itemId;
		if (actionName === 'btnEdit') {
			showAddholidayPopup('EDIT',record);
		} else if (actionName === 'btnView') {
			if(blnViewOld == 'FALSE')
			{
				showAddholidayPopup('VIEW',record,blnViewOld);
			}
			else
			{
				showAddholidayPopup('VIEW',record,blnViewOld,strOldUrl);
			}
		} else if (actionName === 'discard') {
			var me = this;
			me.handleGroupActions(btn,record);
		} else if (actionName === 'btnClone') {
			showAddholidayPopup('CLONE',record);
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var masterRecordKey = record.data.masterRecordkeyNo;
		var beneCode = record.data.beneCode;
		var form;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'recordKeyNo',
				masterRecordKey));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'beneficiaryCode',
				beneCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'profileViewState', $('#viewState').val())); // Temporary
		// Changes
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				$('#MODE').val()));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'transactionType', $('#txnType').val()));
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

	getPrfMstConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = new Array();
		var storeModel = null;

		switch (me.selectedPrfMst) {
			case 'alert' :

				objWidthMap = {
					"holidayDate" : 150,
					"holidayDescription" : 150,
					"holidayType" : 150,
					"holidayState" : 200,
					"holidayLocation" : 200,
					"activeFlag" : 100
				};
				// Logic to push columns in the grid Start
				arrColsPref.push({
					"colId" : "holidayDate",
					"colDesc" : getLabel("holidayDate","Date"),
					"sort" : true
				});
				arrColsPref.push({
					"colId" : "holidayDescription",
					"colDesc" : getLabel("holidayDesc","Description"),
					"sort" : true
				});
				if(holidayType === 'L'){
					arrColsPref.push({
						"colId" : "holidayType",
						"colDesc" : getLabel("holidayType","Type"),
						"sort" : true
					});
					arrColsPref.push({
						"colId" : "holidayGridState",
						"colDesc" : getLabel("holidayState","State"),
						"sort" : false
					});
					arrColsPref.push({
						"colId" : "holidayGridLocation",
						"colDesc" : getLabel("holidayLocation","Location"),
						"sort" : false
					});
				}
				arrColsPref.push({
					"colId" : "activeFlag",
					"colDesc" : getLabel("activeFlag","Status"),
					"sort" : false
				});
				// Logic to push columns in the grid End
				storeModel = {
					fields : ['notifications', 'identifier', 'beanName',
							'profileId', 'primaryKey',
							'holidayDescription', 'holidayDate', 'holidayType', 'holidayGridState', 'holidayGridLocation',
							'holidayDtlState','holidayDtlLocation',
							'activeFlag', 'assignmentStatus', 'parentRecordKey', 'version','isUpdated',
							'recordKeyNo', 'profileFieldType'],
					proxyUrl : 'cpon/holidayProfileDetails.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				};

				

		}
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	enableValidActionsForGrid : function() {
		var me = this;
 		var grid = me.getPrfDetailsGrid();
		var discardActionEnabled = false;
		var enableActionEnabled = false;
		var disableActionEnabled = false;
		var blnEnabled = false;

		if (!Ext.isEmpty(grid.getSelectedRecords())) {
			discardActionEnabled = true;		
			Ext.each(grid.getSelectedRecords(), function(item) {
				if (item.data.activeFlag == "N") {
					enableActionEnabled = true;
				} else if (item.data.activeFlag == "Y") {
					disableActionEnabled = true;
				}
				discardActionEnabled =  discardActionEnabled && me.getDiscardActionEnabled(item);
			});
		}

		var enableBtn = me.getEnableBtn();
		var disableBtn = me.getDisableBtn();
 		var discardBtn = me.getDiscardBtn();

		if (!disableActionEnabled && !enableActionEnabled) {
			disableBtn.setDisabled(!blnEnabled);
			enableBtn.setDisabled(!blnEnabled);
		} 
		else if (disableActionEnabled && enableActionEnabled) {
			enableBtn.setDisabled(!blnEnabled);
			disableBtn.setDisabled(!blnEnabled);
		}
		else if (enableActionEnabled) {
			enableBtn.setDisabled(blnEnabled);
		} 
		else if (disableActionEnabled) {
			disableBtn.setDisabled(blnEnabled);
		}
		
		if (discardActionEnabled) {
			discardBtn.setDisabled(blnEnabled);
		}
		else
		{
			discardBtn.setDisabled(!blnEnabled);
		}
	},
	getDiscardActionEnabled : function(record) {
		var strProfileFieldType = record.data.profileFieldType;
		return (disableDiscardActionFlag == 'true' && strProfileFieldType != 'NEW') ? false : true;
	},
	createViewOnlyActionColumn : function() {
		var objActionCol = {};
			objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : 35,
				align : 'right',
				locked : true,
				items : [{
							itemId : 'btnView',
							itemCls : 'grid-row-action-icon icon-view',
							toolTip : getLabel('viewToolTip', 'View Record')
						}]
			};
		return objActionCol;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) 
	{
		var strRetValue = null;
		if (colId === 'col_holidayType') {
			if (!Ext.isEmpty(record.get('holidayType'))
					&& "L" == record.get('holidayType')) {
				strRetValue = getLabel('Location','Location');
			} else {
				strRetValue = getLabel('General','General');
			}
		}
		else if (colId === 'col_holidayGridState'
				|| colId === 'col_holidayGridLocation' || colId === 'col_holidayDescription') {
			meta.tdAttr = 'title="' + value + '"';
			strRetValue = value;
		}
		else if (colId === 'col_activeFlag') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('activeFlag')) && "Y" == record.get('activeFlag'))
				{
					strRetValue = getLabel('active','Active');
				}
				else if (!Ext.isEmpty(record.get('activeFlag')) && "N" == record.get('activeFlag'))
				{
					strRetValue = getLabel('inactive','Inactive');
				}
			}
		}
		else {
			strRetValue = value;
		}
		if(modeVal == 'VIEW' && VIEW_MODE === 'VIEW_CHANGES')
		{
			if (record.raw.changeState === 1) {
			strRetValue = '<span class="modifiedFieldValue">' + strRetValue
					+ '</span>';
			} else if (record.raw.changeState === 2) {
			strRetValue = '<span class="deletedFieldValue">' + strRetValue + '</span>';
		}
			else if (record.raw.changeState === 3) {
			strRetValue = '<span class="newFieldGridValue">' + strRetValue + '</span>';
			}
		}
		return strRetValue;
	},
	handleActionBar : function(){
		var me = this;
		var actionBar = me.getActionBar();
		actionBar.up().hide();
		if(!(modeVal === "VIEW")
				&& !(modeVal === "SUBMIT")){
			actionBar.up().show();
		}
	}
});
