Ext.define('GCP.controller.PrfPmtPackageController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.PrfPmtPackageEntryView'],
	views : ['GCP.view.PrfPmtPackageEntryView',
			'GCP.view.PmtPkgProductSelectionPopUp',
			'GCP.view.PmtPkgCopyFromPopUp'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'prfPmtPackageEntryView',
				selector : 'prfPmtPackageEntryView'
			},{
				ref : 'pmtPkgProductSelectionPopUp',
				selector : 'pmtPkgProductSelectionPopUp'
			},{
				ref : 'pmtPkgCopyFromPopUp',
				selector : 'pmtPkgCopyFromPopUp'
			}, {
				ref : 'prfDetailsGrid',
				selector : 'prfPmtPackageEntryView grid[itemId="prfDetailsGrid"]'
			}, {
				ref : 'selectProductsGrid',
				selector : 'pmtPkgProductSelectionPopUp grid[itemId="selectProductsId"]'
			},{
				ref : 'btnFilterPrd',
				selector : 'pmtPkgProductSelectionPopUp textfield[itemId="btnFilterPrd"]'
			}, {
				ref : 'searchPrdText',
				selector : 'pmtPkgProductSelectionPopUp textfield[itemId="searchPrdText"]'
			},{
				ref : 'btnFilterPkg',
				selector : 'pmtPkgCopyFromPopUp textfield[itemId="btnFilterPkg"]'
			}, {
				ref : 'copyPkgText',
				selector : 'pmtPkgCopyFromPopUp textfield[itemId="copyPkgText"]'
			},{
				ref : 'prdSelectionContainer',
				selector : 'prfPmtPackageEntryView container[itemId="prdSelectionContainer"]'
			}, {
				ref : 'copyFromPkgGrid',
				selector : 'pmtPkgCopyFromPopUp grid[itemId="copyFromPkgId"]'
			}, {
				ref : 'prfMstDtlView',
				selector : 'prfPmtPackageEntryView panel[itemId="prfMstDtlView"]'
			}, {
				ref : 'searchTextField',
				selector : 'prfPmtPackageEntryView textfield[itemId="searchPrfPkgTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'prfPmtPackageEntryView radiogroup[itemId="matchCriteriaPrfPkg"]'
			},{
				ref : 'prfMstActionsView',
				selector : 'prfPmtPackageEntryView container[itemId="prfMstActionsView"]'
			}, {
				ref : 'discardBtn',
				selector : 'prfPmtPackageEntryView toolbar[itemId="dtlsActionBar"] [actionName="unassign"]'
			}],
	config : {},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		    $(document).on('handleViewChanges',function() {
					                me.refreshGrid();
									        });
		me.control({
			'prfPmtPackageEntryView' : {
				render : function(panel, opts) {
					me.handleSmartGridConfig();
				},
				afterrender : function(panel, opts) {
					if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
									me.getPrfMstActionsView().hide();
									me.getPrdSelectionContainer().hide();
								}
				}
			},
			'prfPmtPackageEntryView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableDiscardPrMstAction();
				}
			},
			'prfPmtPackageEntryView textfield[itemId="searchPrfPkgTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'prfPmtPackageEntryView radiogroup[itemId="matchCriteriaPrfPkg"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'prfPmtPackageEntryView button[itemId="selectProdBtn"]' : {
				click : function(btn, opts) {
					me.showSelectProductsPopUp();
				}
			},
			'prfPmtPackageEntryView button[itemId="cpyPkgBtn"]' : {
				click : function(btn, opts) {
					me.showCopyPackagePopUp();
				}
			},
			'pmtPkgCopyFromPopUp button[itemId="btnOkCopyPkgPopUp"]' : {
				click : function(btn, opts) {
					me.saveItems(btn);
				}
			},
			'pmtPkgProductSelectionPopUp button[itemId="btnOkSelectProduct"]' : {
				click : function(btn, opts) {
					me.saveItems(btn);
				}
			},
			'pmtPkgProductSelectionPopUp button[itemId="btnFilterPrd"]' : {
				click : function(btn, opts) {
					var popUp= me.getPmtPkgProductSelectionPopUp();
					var textfield = me.getSearchPrdText();
					var grid = me.getSelectProductsGrid();
					me.performSearch(popUp,textfield,grid);
				}
			},
			'pmtPkgCopyFromPopUp button[itemId="btnFilterPkg"]' : {
				click : function(btn, opts) {
					var popUp= me.getPmtPkgCopyFromPopUp();
					var textfield = me.getCopyPkgText();
					var grid = me.getCopyFromPkgGrid();
					me.performSearch(popUp,textfield,grid);
				}
			},
			'prfPmtPackageEntryView toolbar[itemId="dtlsActionBar"] button[itemId="unassignBtn"]' : {
				click : function(btn, opts) {
					me.saveItems(btn);
				}
			}
		});
	},
	performSearch: function(popUp,textfield,grid){
		var me=this;
		popUp.setSearchValue(textfield.value);
		grid.refreshData();
	},
	saveItems : function(btn) {
		var me = this;
		var grid = null;
		if (btn.itemId == "btnOkCopyPkgPopUp") {
			grid = me.getCopyFromPkgGrid();
		} else if (btn.itemId == "btnOkSelectProduct") {
			grid = me.getSelectProductsGrid();
		} else {
			grid = me.getPrfDetailsGrid();
		}

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

			if (btn.itemId == "btnOkCopyPkgPopUp") {
				if (!Ext.isEmpty(arrayJson)) {
					me.assignUnssignDetails(btn, arrayJson, 'copyPkgDetails');
				} else {
					if (!Ext.isEmpty(me.getPmtPkgCopyFromPopUp()))
						me.getPmtPkgCopyFromPopUp().close();
					if (!Ext.isEmpty(me.getPmtPkgProductSelectionPopUp()))
						me.getPmtPkgProductSelectionPopUp().close();
				}
			} else if (btn.itemId == "btnOkSelectProduct") {
				if (!Ext.isEmpty(arrayJson)) {
					me.assignUnssignDetails(btn, arrayJson, 'assign');
				} else {
					if (!Ext.isEmpty(me.getPmtPkgCopyFromPopUp()))
						me.getPmtPkgCopyFromPopUp().close();
					if (!Ext.isEmpty(me.getPmtPkgProductSelectionPopUp()))
						me.getPmtPkgProductSelectionPopUp().close();
				}
			} else {
				if (!Ext.isEmpty(arrayJson)) {
					me.assignUnssignDetails(btn, arrayJson, 'unassign');
				} else {
					if (!Ext.isEmpty(me.getPmtPkgCopyFromPopUp()))
						me.getPmtPkgCopyFromPopUp().close();
					if (!Ext.isEmpty(me.getPmtPkgProductSelectionPopUp()))
						me.getPmtPkgProductSelectionPopUp().close();
				}
			}

		}
	},
	assignUnssignDetails : function(btn, arrayJson, action) {
		var me = this;
		var grid = me.getPrfDetailsGrid();
		var popUp= null;
		var popUpGrid= null;
		
		if (btn.itemId == "btnOkCopyPkgPopUp") {
				popUp = me.getPmtPkgCopyFromPopUp();
				popUpGrid = me.getCopyFromPkgGrid();
			} else if (btn.itemId == "btnOkSelectProduct") {
				popUp = me.getPmtPkgProductSelectionPopUp();
				popUpGrid = me.getSelectProductsGrid();
			} 
		var strUrl = Ext.String.format("cpon/pmtPkgProfileMst/{0}", action);
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						// TODO : Action Result handling to be done here
						var jsonData = JSON.parse(response.responseText);
						var jsonArr = jsonData.listActionResult
						var jsonErrArray= null;
						for(var i=0;i<jsonArr.length;i++)
						{
							if(jsonArr[i].success=="N")
							{
							error= jsonArr[i];
							jsonErrArray = error.errors;
							if (!Ext.isEmpty(popUpGrid)) {
								popUpGrid.getSelectionModel().deselectAll();
							}
							if (!Ext.isEmpty(popUp)) {
								popUp.close();
							}
							me.showFailurePopup(jsonErrArray);
							}
							else if(jsonArr[i].success=="MIXED")
							{
								$('#paymentType').val('Mixed');
								$('#customLayoutId').attr('disabled', 'disabled');
					    		$("#customLayoutId").find('option').remove();
					            $("#customLayoutId").append("<option value=''>Mixed Layout</option>");
					            $('#customLayoutId').val('MIXEDLAYOUT');
							}
						}
						if(!Ext.isEmpty(jsonData.parentIdentifier))
						{
							excryptedParentId = jsonData.parentIdentifier;
							document.getElementById('viewState').value = jsonData.parentIdentifier;
						}
						grid.refreshData();
						grid.getSelectionModel().deselectAll();
						me.enableDiscardPrMstAction();
						if (!Ext.isEmpty(popUp)) {
							popUp.close();
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	showFailurePopup: function(jsonErrArray){
		var errMsg = '';
		for(var i=0;i<jsonErrArray.length;i++)
		{
			if(!Ext.isEmpty(jsonErrArray[i]))
			{
			errMsg = jsonErrArray[i].errorMessage ;
			}
		}
		Ext.MessageBox.show({
				title : getLabel(
						'instrumentErrorPopUpTitle',
						'Error'),
				msg : errMsg,
				buttons : Ext.MessageBox.OK,
				cls : 'ux_popup',
				icon : Ext.MessageBox.ERROR
				});
	},
	showSelectProductsPopUp : function() {
		var objSelectProdPopup = Ext.create(
				'GCP.view.PmtPkgProductSelectionPopUp', {
					itemId : 'pmtPkgProductSelectionPopUpId',
					title : getLabel('selectProd', 'Select Products')
				});
		objSelectProdPopup.show();
	},
	showCopyPackagePopUp : function() {
		var objCopyPkgPopUp = Ext.create('GCP.view.PmtPkgCopyFromPopUp', {
					itemId : 'pmtPkgCopyFromPopUpId',
					title : getLabel('copyPackage', 'Copy Payment Package')
				});
		objCopyPkgPopUp.show();
	},
	searchTrasactionChange : function() {
		var me = this;
		var grid = me.getPrfDetailsGrid();
		var searchValue = me.getSearchTextField().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatchPrfPkg' === anyMatch.searchOnPagePrfPkg) {
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
		strUrl = strUrl + '&$filter=' + parentRecKey;
		//grid.loadGridData(strUrl, null);		
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
	},
		enableEntryButtons:function(){
		  gridRender=true;
		  enableDisableGridButtons(false);
	 },
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if(!Ext.isEmpty(objCol.hidden)){
					cfgCol.hidden = objCol.hidden;
				}
				if (!Ext.isEmpty(objCol.colType))
					cfgCol.colType = objCol.colType;
				if (objCol.colId === 'amount' || objCol.colId === 'count')
					cfgCol.align = 'right';
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				
			   if(blnViewOld){
				   cfgCol.fnColumnRenderer = me.columnRenderer;
			   }
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			var strRetValue = value;
			if (record.raw.changeState === 1) {
			strRetValue = '<span class="modifiedFieldValue">' + strRetValue
					+ '</span>';
			} else if (record.raw.changeState === 2) {
			strRetValue = '<span class="deletedFieldValue">' + strRetValue + '</span>';
			}
			else if (record.raw.changeState === 3) {
			strRetValue = '<span class="newFieldGridValue">' + strRetValue + '</span>';
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
				console.log("arrCols :"+arrCols);
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
			cls:'ux_panel-transparent-background',
			padding : '5 10 10 10',
			rowList : [5, 10, 15, 20, 25, 30],
			height : 'auto',
			columnModel : arrCols,
			storeModel : storeModel,
			showEmptyRow : false,
			//isRowIconVisible : me.isRowIconVisible,
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
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;

			// TODO: Need to change logic.
			var dtlIdentifier = record.data.identifier;
			var updateIndex = rowIndex;
			var form, inputField;
			var strUrl = '';

			form = document.createElement('FORM');
			form.name = 'frmMainDtl';
			form.id = 'frmMainDtl';
			form.method = 'POST';
			if (actionName === 'btnEdit') {
					strUrl = 'editPaymentPackageDtl.form';
			} else {
				strUrl = 'viewPaymentPackageDtl.form';
			} 

			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIndex',
					rowIndex));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'dtlIdentifier',					
					dtlIdentifier));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'hdrViewState',
					document.getElementById('viewState').value));	
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'page_action',
					document.getElementById('page_action').value));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'PAGE_MODE',
					modeVal));
						
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
		
	},
	createActionColumn : function() {
		var me = this;
		var viewModeCols = [{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
					}];
		var editModeCols = [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit')
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record')
					}];		
		var arrCols;
		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
			arrCols = viewModeCols;
		}
		else
		{
			arrCols = editModeCols;
		}
		
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'actioncontent',
			width : 80,
			align : 'right',
			locked : true,
			sortable : false,
			items : arrCols,
			moreMenu : {
				fnMoreMenuVisibilityHandler : function(store, record, jsonData,
						itmId, menu) {
					
				},
				fnMoreMenuClickHandler : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
					me.handleRowMoreMenuClick(tableView, rowIndex, columnIndex,
							btn, event, record);
				},
				items : [{
							itemId : 'btnHistory',
							itemCls : 'grid-row-action-icon icon-history',
							itemLabel : getLabel('historyToolTip',
									'View History')
						}]
			}
		};
		return objActionCol;
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
			"productDescription" : 200,
			"cutoffProfileId" : 180,
			"enrichmentProfileId" : 180
			};
		arrColsPref = [{
					"colId" : "productDescription",
					"colDesc" : getLabel("packProfProductDescription","Product Description")
				}, {
					"colId" : "cutoffProfileId",
					"colDesc" : getLabel("packProfcutoffprf","Cut-Off Profile")
				}];

		storeModel = {
			fields : ['productCode', 'productDescription','identifier', 'beanName',
					'cutoffProfileId', 'enrichmentProfileId', 
					'workflowProfileId', 'alertProfileId', 'reportProfileId',
					'parentRecordKey', 'version', 'recordKeyNo'],
			proxyUrl : 'cpon/pmtPkgProfileDetails.json',
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
	enableDiscardPrMstAction : function() {
		var me = this;
		var grid = me.getPrfDetailsGrid();
		var discardActionEnabled = false;
		var blnEnabled = false;
		if (Ext.isEmpty(grid.getSelectedRecords())) {
			discardActionEnabled = false;
		} else {
			discardActionEnabled = true;
		}

		var discardBtn = me.getDiscardBtn();

		if (!discardActionEnabled) {
			discardBtn.setDisabled(!blnEnabled);
		} 
		else {
			discardBtn.setDisabled(blnEnabled);
		}
		
	},
	  refreshGrid: function()
		{
			        var me = this;
					var prfDetailGrid = me.getPrfDetailsGrid();
					me.handleSmartGridConfig();
				    prfDetailGrid.refreshData();
		},

});