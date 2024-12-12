Ext.define('GCP.controller.PrfMstDetailsEntryController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.LoanTypeDtlsGridView'],
	views : ['GCP.view.PrfMstDtlsActionBarView',
			'GCP.view.LoanTypeDtlsGridView'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'loanTypeDtlsGridView',
				selector : 'loanTypeDtlsGridView'
			}, {
				ref : 'prfDetailsGrid',
				selector : 'loanTypeDtlsGridView grid[itemId="prfDetailsGrid"]'
			}, {
				ref : 'prfMstActionsView',
				selector : 'loanTypeDtlsGridView container[itemId="prfMstActionsView"]'
			}, {
				ref : 'discardBtn',
				selector : 'prfMstDtlsActionBarView[itemId="dtlsActionBar"] [actionName="unassign"]'
			}, {
				ref : 'assignBtn',
				selector : 'prfMstDtlsActionBarView[itemId="dtlsActionBar"] [actionName="assign"]'
			}, {
				ref : 'prfMstDtlView',
				selector : 'loanTypeDtlsGridView panel[itemId="prfMstDtlView"]'
			}, {
				ref : 'searchTextField',
				selector : 'loanTypeDtlsGridView textfield[itemId="searchAlertEntryTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'loanTypeDtlsGridView radiogroup[itemId="matchCriteriaAlertEntry"]'
			}, {
				ref : 'createNewToolBar',
				selector : 'loanTypeDtlsGridView toolbar[itemId="btnCreateNewToolBar"]'
			}],
	config : {
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.control({
			'loanTypeDtlsGridView' : {
				render : function(panel, opts) {
					me.handleSmartGridConfig();
					me.handleGridHeader();
				},
				afterrender : function(panel, opts) {
					var prfMstDtlView = me.getPrfMstDtlView();
					
					prfMstDtlView.setTitle(getLabel("loanTypes",
							'Loan Types'))
					if (modeVal == 'VERIFY' || modeVal == 'VIEW'
							|| modeVal == 'SUBMIT') {
						me.getPrfMstActionsView().hide();
					}
				}
			},
			'loanTypeDtlsGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableDisablePrMstActions();
				}
			},
			'loanTypeDtlsGridView textfield[itemId="searchAlertEntryTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'loanTypeDtlsGridView prfMstDtlsActionBarView' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn, opts);
				}
			}
		});
	},
	handleEntryAction : function(btn, Url) {
		var me = this;
		var form;
		var strUrl = Url;
		var errorMsg = null;
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
					'profileViewState', $('#viewState').val())); // Temprary
																	// Changes
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

	},
	handleGroupActions : function(btn, opts) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		if( btn && btn.el )
			btn.disable();
		
		var strUrl = Ext.String.format('cpon/financingProfileMst/loanTypeDetails/{0}',
				strAction);
		this.preHandleGroupActions(strUrl, excryptedParentId);
	},
	preHandleGroupActions : function(strUrl, encryptedParentId) {
		var me = this;
		var grid = me.getPrfDetailsGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
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
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							var errorMessage = '';
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								if (!Ext.isEmpty(data))
								{
									if(!Ext.isEmpty(data.parentIdentifier))
									{
										excryptedParentId = data.parentIdentifier;
										document.getElementById('viewState').value = data.parentIdentifier;
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
										title : getLabel("instrumentErrorPopUpTitle","Error"),
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						        }
							}
							grid.refreshData();
							grid.getSelectionModel().deselectAll();
							me.enableDisablePrMstActions();
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
										cls: 'ux_popup',
										buttons : Ext.MessageBox.OK,
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
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		//strUrl = strUrl + '&$filter=' + mstProfileId;
		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
			//strUrl = strUrl + '&$qparam=Y';
			if (null != blnViewOld || !('' == blnViewOld)) {
				strUrl = strUrl + '&$old=' + blnViewOld;
			}
		}
		
		strUrl = strUrl + '&$parentRecordKeyNo=' + parentRecKey;
		strUrl = strUrl + '&$workflowCode=' + workflowCode;
		strUrl = strUrl + '&$entityType=' + entityType;
		
		// strUrl = strUrl + me.addFilterUrl();
		grid.loadGridData(strUrl, null);
	},
	
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//if ('systemBene' == me.selectedPrfMst || 'enrichment' == me.selectedPrfMst)
		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
			arrCols.push(me.createActionColumn());
		}
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
				cfgCol.sortable = objCol.sort;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			locked : true,
			items : [{
				itemId : 'btnEdit',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('editToolTip', 'Edit')
					// maskPosition : 2
				}, {
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record')
					// maskPosition : 3
				}]
		};
		return objActionCol;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = value;
		if (record.raw.isUpdated === 'D') {
			strRetValue = '<span class="strike_through_row">' + value
					+ '</span>';
		} else if (record.raw.isUpdated === 'N') {
			strRetValue = '<span class="blue_row">' + value + '</span>';
		}
		
			if (colId === 'col_financeWorkflow') {
				if(record.get('assignmentStatus') == "Assigned")
				{
				  if(record.get('workflowAdded') == "Y") {
					  if(!(modeVal == 'VIEW'))
						strRetValue = '<span class="button_underline thePointer editWorkflow">' + 'Edit' + '</span>';
				  }
				  else
					  strRetValue = '<span class="button_underline thePointer addWorkflow">' + 'Add' + '</span>';
					
				}
			}
			
			if (colId === 'col_interest') {
				if(record.get('assignmentStatus') == "Assigned")
					{
					  if(record.get('interestAdded') == "Y" )
							strRetValue = '<span class="button_underline thePointer editInterest">' + 'Edit' + '</span>';
					  else
						  {
						  	if(record.get('workflowAdded') == "Y")
						  		strRetValue = '<span class="button_underline thePointer addInterest">' + 'Add' + '</span>';
						  }
						  
					}
			}
		
		return strRetValue;
	},

	handleSmartGridConfig : function() {
		var me = this;
		var prfDetailsGrid = me.getPrfDetailsGrid();
		var objConfigMap = me.getPrfMstConfiguration();
		var arrCols = new Array();
		var showCheckBoxColumn = true;
		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		if (!Ext.isEmpty(prfDetailsGrid)) {
			var store = prfDetailsGrid.createGridStore(objConfigMap.storeModel);
			var columns = prfDetailsGrid.createColumns(arrCols);
			prfDetailsGrid.reconfigure(store, columns);
			prfDetailsGrid.down('pagingtoolbar').bindStore(store);
			prfDetailsGrid.refreshData();
		} else {
			if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
				showCheckBoxColumn = false;
			}
			me.handleSmartGridLoading(arrCols, objConfigMap.storeModel,
					showCheckBoxColumn);
		}
	},
	handleSmartGridLoading : function(arrCols, storeModel, showCheckBoxColumn) {
		var me = this;
		var pgSize = null;
		var prfDetailsGrid = null;
		pgSize = 5;
		prfDetailsGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'prfDetailsGrid',
			itemId : 'prfDetailsGrid',
			pageSize : pgSize,
			stateful : false,
			padding : '5 10 10 10',
			rowList : _AvailableGridSize,
			height : 'auto',
			columnModel : arrCols,
			storeModel : storeModel,
			showPager : false,
			showEmptyRow : false,
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,
			showCheckBoxColumn : showCheckBoxColumn,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleRowMoreMenuItemClick : function(menu, event) {
				var dataParams = menu.ownerCt.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, this, event, dataParams.record);
			}
		});

		var prfMstDtlView = me.getPrfMstDtlView();
		prfMstDtlView.add(prfDetailsGrid);
		prfMstDtlView.doLayout();
		
		prfDetailsGrid.on('cellclick', function(view, td, cellIndex,
				record, tr, rowIndex, e, eOpts) {
			
			if(modeVal != 'VIEW')
				{
					var linkClicked = (e.target.tagName == 'SPAN');
					if (linkClicked) {
					var className = e.target.className;
					if (!Ext.isEmpty(className)
							&& className.indexOf('editWorkflow') !== -1) {
						me.submitForm('editFinancingProfileDtl.form', record, rowIndex);
					}
					if (!Ext.isEmpty(className)
							&& className.indexOf('addWorkflow') !== -1) {
						me.submitForm('editFinancingProfileDtl.form', record, rowIndex);
					}
					if (!Ext.isEmpty(className)
							&& className.indexOf('addInterest') !== -1) {
						me.submitForm('addFinancingProfileInterestDtl.form', record, rowIndex);
					}
					if (!Ext.isEmpty(className)
							&& className.indexOf('editInterest') !== -1) {
						me.submitForm('addFinancingProfileInterestDtl.form', record, rowIndex);
					}
				}
			}
		});
	},
	
	handleRowIconClick : function(view, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;

		if (actionName === 'btnEdit') {
			me.submitForm('editFinancingProfileDtl.form', record, rowIndex);
		} else if (actionName === 'btnView') {
			me.submitForm('viewFinancingProfileDtl.form', record, rowIndex);
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var masterRecordKey = record.data.recordkeyNo;
		var loanTypeCode = record.data.loanTypeCode;
		var productWorkflow =  $('#productWorkflow').val();
		var updateIndex = rowIndex;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'recordKeyNo',
				masterRecordKey));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'hdrViewState', $('#viewState').val())); // Temprary
																// Changes

		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'dtlIdentifier',
				viewState));
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'loanTypeCode',
				loanTypeCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'productWorkflow',
				productWorkflow));
		if(strUrl === "viewFinancingProfileDtl.form")
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				"VIEW"));
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
		var arrColsPref = null;
		var storeModel = null;

				objWidthMap = {
					"loanTypeDesc" : 180,
					"entityType" : 180,
					"financeWorkflow" : 110,
					//"interest" : 110,
					"assignmentStatus" : 115
				};

				arrColsPref = [{
							"colId" : "loanTypeDesc",
							"colDesc" : getLabel("loanType","Loan Type"),
							"sort" :true
						}, {
							"colId" : "entityTypeDesc",
							"colDesc" : getLabel("entityType","Entity Type"),
							"sort" :true
						}, {
							"colId" : "financeWorkflow",
							"colDesc" : getLabel("financeWrk","Finance Workflow"),
							"sort" :false
						}, /*{
							"colId" : "interest",
							"colDesc" : "Interest",
							"sort" :false
						},*/ {
							"colId" : "assignmentStatus",
							"colDesc" : getLabel("status","Status"),
							"sort" :false
						}];

				storeModel = {
					fields : ['loanTypeDesc', 'entityType', 'loanTypeCode','entityTypeDesc',
							'assignmentStatus', 'parentRecordKey', 'version',
							'recordKeyNo','identifier', 'workflowAdded', 'interestAdded','isUpdated'],
					proxyUrl : 'cpon/financeProfileLoanTypeDetails.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				};


		
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	enableDisablePrMstActions : function() {
		var me = this;
		var grid = me.getPrfDetailsGrid();
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

		var assignBtn = me.getAssignBtn();
		var discardBtn = me.getDiscardBtn();

		if (!discardActionEnabled && !assignActionEnabled) {
			discardBtn.setDisabled(!blnEnabled);
			assignBtn.setDisabled(!blnEnabled);
		} else if (discardActionEnabled && assignActionEnabled) {
			assignBtn.setDisabled(!blnEnabled);
			discardBtn.setDisabled(!blnEnabled);
		} else if (assignActionEnabled) {
			assignBtn.setDisabled(blnEnabled);
		} else if (discardActionEnabled) {
			discardBtn.setDisabled(blnEnabled);
		}
		
	},
	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var me = this;
		
		if(modeVal == 'VIEW' || modeVal == 'VERIFY')
		{
			if(itmId === 'btnView'){
				if(record.get('assignmentStatus') == "Assigned")
					return  true;
				 }
		}
		else
		{
			if (itmId === 'btnEdit') {
				if(record.get('assignmentStatus') == "Assigned")
					return  true;
			}
		}
		return  false;
		
	}
});
