Ext.define('GCP.controller.PrfMstDetailsEntryController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.AlertPrfEntryGridView'],
	views : ['GCP.view.PrfMstDtlsActionBarView',
			'GCP.view.AlertPrfEntryGridView','GCP.view.ScheduleAdvanceConfigPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'alertPrfEntryGridView',
				selector : 'alertPrfEntryGridView'
			}, {
				ref : 'prfDetailsGrid',
				selector : 'alertPrfEntryGridView grid[itemId="prfDetailsGrid"]'
			}, {
				ref : 'prfMstActionsView',
				selector : 'alertPrfEntryGridView container[itemId="prfMstActionsView"]'
			}, {
				ref : 'discardBtn',
				selector : 'prfMstDtlsActionBarView[itemId="dtlsActionBar"] [actionName="unassign"]'
			}, {
				ref : 'assignBtn',
				selector : 'prfMstDtlsActionBarView[itemId="dtlsActionBar"] [actionName="assign"]'
			}, 
			{
				ref : 'prfMstDtlView',
				selector : 'alertPrfEntryGridView panel[itemId="prfMstDtlView"]'
			}, {
				ref : 'searchTextField',
				selector : 'alertPrfEntryGridView textfield[itemId="searchAlertEntryTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'alertPrfEntryGridView radiogroup[itemId="matchCriteriaAlertEntry"]'
			}, {
				ref : 'createNewToolBar',
				selector : 'alertPrfEntryGridView toolbar[itemId="btnCreateNewToolBar"]'
			},
			{
				ref : 'scheduleAdvanceConfigPopup',
				selector : 'scheduleAdvanceConfigPopup'
			},
			{
				ref : 'scheduleCheckBox',
				selector : 'scheduleAdvanceConfigPopup checkbox[itemId=scheduleCheckBox]'
			}],
	config : {
		selectedPrfMst : addEntryFor
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.control({
			'scheduleAdvanceConfigPopup checkbox[itemId=scheduleCheckBox]' : 
			{
				change : function(cmp, newValue, oldValue, eOpts)
				{
					me.allowSchCheckboxChange(cmp, newValue, oldValue, eOpts);
				}
			},
			'alertPrfEntryGridView' : {
				render : function(panel, opts) {
					me.handleSmartGridConfig();
					me.handleGridHeader();
				},
				afterrender : function(panel, opts) {
					var prfMstDtlView = me.getPrfMstDtlView();
					var selectedPrfMstLabel = Ext.String.format('{0}s',
							me.selectedPrfMst);
					prfMstDtlView.setTitle(getLabel(selectedPrfMstLabel,
							'Profile Details'))

					if (modeVal == 'VERIFY' || modeVal == 'VIEW'
							|| modeVal == 'SUBMIT') {
						me.getPrfMstActionsView().hide();
					}
				}
			},
			'alertPrfEntryGridView smartgrid' : {
				'cellclick' : me.doHandleCellClick,
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
			'alertPrfEntryGridView textfield[itemId="searchAlertEntryTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'alertPrfEntryGridView radiogroup[itemId="matchCriteriaAlertEntry"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'alertPrfEntryGridView prfMstDtlsActionBarView' : {
				render : function(view) {
					if ('systemBene' == me.selectedPrfMst && validFlag == 'Y') {
						unassignBtn = view
								.down('button[actionName="unassign"]');
						//unassignBtn.hide();
					}
					if ('enrichment' == me.selectedPrfMst) {
						var element = me.getAlertPrfEntryGridView()
								.down('container[itemId=prfMstActionsView]');
						element.hide();
					}

				},
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn, opts);
				}
			},
			'alertPrfEntryGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBeneficiary"]' : {
				click : function(btn, e, eOpts) {
					me.handleEntryAction(btn,
							"addSystemBeneficiarySetupMaster.form");
				}
			},
			'alertPrfEntryGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateEnrichment"]' : {
				click : function(btn, e, eOpts) {
					me.handleEntryAction(btn, "addEnrichmentMasterSetup.form");
				}
			},
			'scheduleAdvanceConfigPopup button[itemId=btnSaveConfigDetails]' : {
				click : function(btn, opts) {
					me.saveAdvanceConfigDetails();
				}
			}
		});
	},
	allowSchCheckboxChange : function( cmp, newValue, oldValue, eOpts)
	{
		var me = this;
		var combo = me.getScheduleAdvanceConfigPopup().down('combo[itemId=scheduleProfileCombo]');
		if(newValue == false)
		{
			combo.disabled = true;
			combo.setValue(null);
			combo.setRawValue(null);
		}else
		{
			combo.disabled = false;
			combo.readonly = '';
			combo.setReadOnly(false);
			combo.setDisabled(false);
		}
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
					'profileViewState', $('#viewState').val()));// Temprary
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
	handleGroupActions : function(btn, opts) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/{0}ProfileMst/{1}',
				me.selectedPrfMst, strAction);
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
							}
							if(!Ext.isEmpty(errorMessage))
					        {
					        	Ext.MessageBox.show({
									title : getLabel("errorTitle","Error"),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					        }
							else
					        {
								grid.refreshData();
								grid.getSelectionModel().deselectAll();
								me.enableDisablePrMstActions();
					        }							
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
		strUrl = strUrl + '&$filter=' + mstProfileId;
		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
			strUrl = strUrl + '&$qparam=Y';
			if (null != blnViewOld || !('' == blnViewOld)) {
				strUrl = strUrl + '&$old=' + blnViewOld;
			}
		}
		// strUrl = strUrl + me.addFilterUrl();
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
		grid.setSelectedRecords('');
		me.enableDisablePrMstActions();
	},
	doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
		var clickedId = e.target.id ;
		if( clickedId == 'advanceConfigId')
		{
			me.openScheduleAdvanceConfigPopup(record,view);
		}
	},
	openScheduleAdvanceConfigPopup : function( record ,viewSmartGrid)
	{
		var me = this;
		var selectedScheduleProfileId = record.raw.scheduleProfileId;
		if(addEntryFor==='interface')
		{
			var txtName = record.raw.interfaceDesc;
		}
		else
		{
			var txtName = record.raw.reportName;
		}
		
		var storeData = me.handleSecurityProfileLoading( record);
		var objScheduleProfilePopup = Ext.create('GCP.view.ScheduleAdvanceConfigPopup',{
			storeData : storeData,
			selectedScheduleProfileId : selectedScheduleProfileId,
			txtName : txtName,
			record : record
			});
		objScheduleProfilePopup.show();
	},
	handleSecurityProfileLoading : function(record)
	{
		var storeData = null;
		var me = this;
		var strUrl = addEntryFor+'/getScheduleProfile.srvc?';
		Ext.Ajax.request(
		{
			url : strUrl + csrfTokenName + '=' + csrfTokenValue ,
			method : "POST",
			async : false,
			success : function( response )
			{
				storeData =  Ext.decode( response.responseText );
			},
			failure : function( response )
			{
				console.log( 'Error Occured' );
			}
		} );
		return storeData;
	},
	saveAdvanceConfigDetails : function(){
		var me = this;
		var prfPopupRef = me.getScheduleAdvanceConfigPopup();
		var jsonData = prfPopupRef.getJsonofScheduleProfile();
		var strUrl = addEntryFor + "/saveScheduleConfigDetails.srvc";
		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			jsonData : Ext.encode(jsonData),		
			success : function( response )
			{
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
				}
				prfPopupRef.destroy();
				var prfDetailsGrid = me.getPrfDetailsGrid();
				prfDetailsGrid.refreshData();
			},
			failure : function( response )
			{
				console.log( 'Error Occured' );
			}
		} );
	},
	enableEntryButtons:function(){
		if(addEntryFor==='alert')
			alertGridLoaded=true;
		else if(addEntryFor==='interface')
			interfaceGridLoaded=true;
		else if(addEntryFor==='report')	
			reportGridLoaded=true;
		else if(addEntryFor==='enrichment')
			enrichmentGridLoaded=true;
		else if(addEntryFor == "systemBene")
			 gridRender=true;
		 
		enableDisableGridButtons(false);
	},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if ('enrichment' == me.selectedPrfMst) {
			arrCols.push(me.createGroupActionColumn());
			arrCols.push(me.createActionColumn());
		} else if ('systemBene' == me.selectedPrfMst)
			arrCols.push(me.createSystemBeneActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.hidden = objCol.hidden;
				if (!Ext.isEmpty(objCol.colType))
					cfgCol.colType = objCol.colType;
				if (objCol.colId === 'amount' || objCol.colId === 'count')
					cfgCol.align = 'right';
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				if ('enrichment' == me.selectedPrfMst) {
					cfgCol.fnColumnRenderer = me.enrichmentDtlColumnRenderer;
				} else {
					cfgCol.fnColumnRenderer = me.columnRenderer;
				}
				cfgCol.sortable = objCol.sort;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'groupaction',
			width : 80,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'discard',
						itemCls : 'grid-row-text-icon icon-discard-text',
						toolTip : getLabel('prfMstActionDiscard', 'Discard'),
						itemLabel : getLabel('prfMstActionDiscard', 'Discard')
					}]
		};
		return objActionCol;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol;
		if (modeVal != 'VERIFY' && modeVal != 'VIEW' && modeVal != 'SUBMIT') {
			objActionCol = {
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
		} else {
			objActionCol = {
				colType : 'actioncontent',
				colId : 'action',
				width : 80,
				locked : true,
				items : [{
					itemId : 'btnView',
					itemCls : 'grid-row-action-icon icon-view',
					toolTip : getLabel('viewToolTip', 'View Record')
						// maskPosition : 3
					}]
			};
		}

		return objActionCol;
	},
	createSystemBeneActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 40,
			locked : true,
			items : [{
				itemId : 'btnView',
				itemCls : 'grid-row-action-icon icon-view',
				toolTip : getLabel('viewToolTip', 'View Record')
					// maskPosition : 3
				}/*, {
				itemId : 'btnHistory',
				itemCls : 'grid-row-action-icon icon-history',
				itemLabel : getLabel('historyToolTip', 'View History')
					// maskPosition : 4
				}*/]
		};
		return objActionCol;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = value;
		
		if(colId == 'col_advanceConfig')
		{
			if(record.raw.assignmentStatus == 'Not assigned' )
			{
				strRetValue = '';
			}
			else
			{
				if(record.raw.interfaceType == 'Upload')
				{
					strRetValue = '';
				}
				else
				{
					strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="advanceConfigId">Configure</a>';
				}
				return strRetValue;
			}
		}
        meta['tdAttr'] = 'title="' + (strRetValue) + '"';
		if (record.raw.changeState === 1) {
			strRetValue = '<span class="modifiedFieldValue">' + value
					+ '</span>';
		}
		else if (record.raw.changeState === 2) {
			strRetValue = '<span class="deletedFieldValue">' + value
					+ '</span>';
		} else if (record.raw.changeState === 3) {
			strRetValue = '<span class="newFieldGridValue">' + value + '</span>';
		}
		return strRetValue;
	},
	enrichmentDtlColumnRenderer : function(value, meta, record, rowIndex,
			colIndex, store, view, colId) {
		var strRetValue = value;
		if (record.raw.isUpdated === 'D') {
			strRetValue = '<span class="strike_through_row">' + value
					+ '</span>';
		} else if (record.raw.isUpdated === 'N') {
			strRetValue = '<span class="blue_row">' + value + '</span>';
		}
		if (colId == 'col_enrichType') {
			strRetValue = getLabel('enrichmentType.' + value, value);
		}
		if (colId == 'col_mandatoryFlag') {
			strRetValue = getLabel('description.' + value, value);
		}
		if (colId == 'col_enrichDataType') {
			strRetValue = getLabel('enrichmentDataType.' + value, value);
		}
		return strRetValue;
	},
	handleSmartGridConfig : function() {
		var me = this;
		var prfDetailsGrid = me.getPrfDetailsGrid();
		var objConfigMap = me.getPrfMstConfiguration();
		var arrCols = new Array();
		var showCheckBoxColumn = true;
		if ('enrichment' == me.selectedPrfMst) {
			showCheckBoxColumn = false;
		}
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
		pgSize = _GridSizeMaster;
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
			// isRowIconVisible : me.isRowIconVisible,
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
	handleRowIconClick : function(view, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		var selectedProfile = '';
		switch (me.selectedPrfMst) {
			case 'enrichment' :
				selectedProfile = 'EnrichmentMasterSetup';
				break;
			case 'systemBene' :
				selectedProfile = 'SystemBeneficiarySetupMaster';
				break;
		}

		if (actionName === 'btnEdit') {
			var strUrl = Ext.String.format('edit{0}.form', selectedProfile);
			me.submitForm(strUrl, record, rowIndex);
		} else if (actionName === 'btnView') {
			var strUrl = Ext.String.format('view{0}.form', selectedProfile);
			me.submitForm(strUrl, record, rowIndex);
		} else if (me.selectedPrfMst == 'enrichment'
				&& actionName === 'discard') {
			var me = this;
			var strUrl = Ext.String.format('cpon/delete{0}/{1}',
					selectedProfile, actionName);
			me.enrichmentDiscard(strUrl, record);
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var masterRecordKey = record.data.masterRecordkeyNo;
		var beneCode = record.data.beneCode;
		var updateIndex = rowIndex;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'recordKeyNo',
				masterRecordKey));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'beneficiaryCode',
				beneCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'profileViewState', $('#viewState').val())); // Temprary
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
		var arrColsPref = null;
		var storeModel = null;

		switch (me.selectedPrfMst) {
			case 'alert' :

				objWidthMap = {
					"subscriptionName" : 180,
					"eventDescription" : 180,
					"notifications" : 120,
					"assignmentStatus" : 115
				};

				arrColsPref = [{
							"colId" : "subscriptionName",
							"colDesc" : getLabel("alertSubDetails","Subscription Details"),
							"sort" : true
						}, {
							"colId" : "eventDescription",
							"colDesc" : getLabel("alertEveSub","Event Description"),
							"sort" : true
						}, {
							"colId" : "notifications",
							"colDesc" : getLabel("alertNotifications","Notifications"),
							"sort" : false
						}, {
							"colId" : "assignmentStatus",
							"colDesc" : getLabel("status","Status"),
							"sort" : false
						}];

				storeModel = {
					fields : ['notifications', 'identifier', 'beanName',
							'profileId', 'primaryKey', 'subscriptionCode',
							'subscriptionName', 'eventDescription',
							'assignmentStatus', 'parentRecordKey', 'version',
							'recordKeyNo'],
					proxyUrl : 'cpon/alertProfileDetails.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				};

				break;

			case 'report' :

				if(scheduleProfileApplicable == 'Y') {
					
				objWidthMap = {
					"reportName" : '30%',
					"reportTypeDesc" : '10%',
					"assignmentStatus" : '10%',
					"allowOndemand" : '10%',
					"allowSchedule" : '10%',
					"scheduleProfileDesc":'15%',
					"advanceConfig":'14%'	
				};

				arrColsPref = [{
							"colId" : "reportName",
							"colDesc" : getLabel("reportDetails","Report Details"),
							"sort" : true
						}, {
							"colId" : "reportTypeDesc",
							"colDesc" : getLabel("reportType","Report Type"),
							"sort" : false
						},{
							"colId" : "assignmentStatus",
							"colDesc" : getLabel("status","Status"),
							"sort" : false
						},
						{
							"colId" : "allowOndemand",
							"colDesc" : getLabel("reportOnDemand","On Demand"),
							"sort" : false
						},
						{
							"colId" : "allowSchedule",
							"colDesc" : getLabel("rptSchedule","Schedule"),
							"sort" : false
						},
						{
							"colId" : "scheduleProfileDesc",
							"colDesc" : getLabel("reportSchPrf","Schedule Profile"),
							"sort" : false
						},
						{
							"colId" : "advanceConfig",
							"colDesc" : getLabel("rptAdvConfig","Advance Config"),
							"hidden" : modeVal == 'VIEW',
							"sort" : false
						}];
				}
				else{
					objWidthMap = {
							"reportName" : '30%',
							"reportTypeDesc" : '10%',
							"assignmentStatus" : '10%',
							"allowOndemand" : '10%',
							"allowSchedule" : '10%',							
							"advanceConfig":'29%'	
						};

						arrColsPref = [{
									"colId" : "reportName",
									"colDesc" : getLabel("reportDetails","Report Details"),
									"sort" : true
								}, {
									"colId" : "reportTypeDesc",
									"colDesc" : getLabel("reportType","Report Type"),
									"sort" : false
								},{
									"colId" : "assignmentStatus",
									"colDesc" : getLabel("status","Status"),
									"sort" : false
								},
								{
									"colId" : "allowOndemand",
									"colDesc" : getLabel("reportOnDemand","On Demand"),
									"sort" : false
								},
								{
									"colId" : "allowSchedule",
									"colDesc" : getLabel("rptSchedule","Schedule"),
									"sort" : false
								},
								{
									"colId" : "advanceConfig",
									"colDesc" : getLabel("rptAdvConfig","Advance Config"),
									"hidden" : modeVal == 'VIEW',
									"sort" : false
								}];
				}

				storeModel = {
					fields : ['identifier', 'beanName', 'primaryKey',
							'reportCode', 'reportName', 'assignmentStatus','allowOndemand','allowSchedule',
							'version','reportTypeDesc','scheduleProfileDesc','scheduleProfileId','profileId'],
					proxyUrl : 'cpon/reportProfileDetails.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				};

				break;

			case 'interface' :

				objWidthMap = {
					"interfaceDesc" : 240,
					"processName" : 180,
					"interfaceType" : 100,
					"assignmentStatus" : 130,
					"interfaceFlavour" : 90,
					"allowOndemand" : 80,
					"allowSchedule" : 80,
					"scheduleProfileDesc":120,
					"advanceConfig":90
					
				};

				arrColsPref = [{
							"colId" : "interfaceDesc",
							"colDesc" : getLabel("interfaceDtls","Interface Details"),
							"sort" : true
						}, {
							"colId" : "processName",
							"colDesc" : getLabel("intFormatDesc","Format Description"),
							"sort" : true
						}, {
							"colId" : "interfaceType",
							"colDesc" : getLabel("interfaceType","Type"),
							"sort" : true
						},{
							"colId" : "interfaceFlavour",
							"colDesc" : getLabel("interfaceCat","Category"),
							"sort" : true
						},{
							"colId" : "assignmentStatus",
							"colDesc" : getLabel("status","Status"),
							"sort" : false
						},
						{
							"colId" : "allowOndemand",
							"colDesc" : getLabel("interfaceOnDemand","On Demand"),
							"sort" : true
						},
						{
							"colId" : "allowSchedule",
							"colDesc" :  getLabel("interfaceSch","Schedule"),
							"sort" : true
						},
						{
							"colId" : "scheduleProfileDesc",
							"colDesc" : getLabel("reportSchPrf","Schedule Profile"),
							"sort" : true
						},
						{
							"colId" : "advanceConfig",
							"colDesc" : getLabel("rptAdvConfig","Advance Config"),
							"hidden" : modeVal == 'VIEW'  ,
							"sort" : false
						}
						];

				storeModel = {
					fields : ['identifier', 'beanName', 'primaryKey',
							'assignmentStatus', 'processCode', 'interfaceType','allowOndemand','allowSchedule',
							'processName', 'interfaceDesc', 'version','interfaceFlavour','scheduleProfileDesc','scheduleProfileId','profileId','interfaceModelFlag'],
					proxyUrl : 'cpon/interfaceProfileDetails.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				};

				break;

			case 'systemBene' :

				objWidthMap = {
					"beneName" : 300,
					"assignmentStatus" : 115
				};

				arrColsPref = [{
							"colId" : "beneName",
							"colDesc" : getLabel("sysBeneName","Beneficiary Name"),
							"sort" : true
						}, {
							"colId" : "category",
							"colDesc" : getLabel("category","Category"),
							"sort" : true
						},{
							"colId" : "assignmentStatus",
							"colDesc" : getLabel("status","Status"),
							"sort" : false
						}
						];

				storeModel = {
					fields : ['identifier', 'profileId', 'beneCode',
							'beanName', 'beneName', 'primaryKey',
							'assignmentStatus', 'parentRecordKey', 'version',
							'recordKeyNo', 'masterRecordkeyNo','category'],
					proxyUrl : 'cpon/systemBeneProfileDetails.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				};

				break;

			case 'enrichment' :
				objWidthMap = {
					"enrichLabelDescription" : 180,
					"enrichType" : 100,
					"enrichDataType" : 100,
					"mandatoryFlag" : 80,
					"enrichNmbr" : 80
				};

				arrColsPref = [{
							"colId" : "enrichLabelDescription",
							"colDesc" : getLabel("enrichName","Enrichment Name"),
							"sort" : true
						}, {
							"colId" : "enrichDataType",
							"colDesc" : getLabel("enrichDataType","Data Type"),
							"sort" : true
						}, {
							"colId" : "mandatoryFlag",
							"colDesc" : getLabel("enrichMandatory","Mandatory"),
							"sort" : true
						}, {
							"colId" : "enrichNmbr",
							"colDesc" : getLabel("enrichSeq","Sequence"),
							"sort" : true
						}, {
							"colId" : "enrichType",
							"colDesc" : getLabel("enrichType","Enrichment Type"),
							"sort" : true
						}];

				storeModel = {
					fields : ['identifier', 'profileId',
							'enrichLabelDescription', 'enrichmentCode',
							'enrichType', 'primaryKey', 'parentRecordKey',
							'recordKeyNo', 'masterRecordkeyNo',
							'mandatoryFlag', 'enrichmentName', 'enrichNmbr',
							'enrichDataType'],
					proxyUrl : 'cpon/enrichmentProfileDetails.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				};

				break;

			default :

		}
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
		/*var discardScheduleActionEnabled = false;
		var assignScheduleActionEnabled = false;
		var discardOndemandActionEnabled = false;
		var assignOndemandActionEnabled = false;*/
		
		var blnEnabled = false;
		if (Ext.isEmpty(grid.getSelectedRecords())) {
			discardActionEnabled = false;
			assignActionEnabled = false;
			/*discardScheduleActionEnabled = false;
			assignScheduleActionEnabled = false
			discardOndemandActionEnabled = false
			assignOndemandActionEnabled = false ;*/
		} else {
			Ext.each(grid.getSelectedRecords(), function(item) {
						if (item.data.assignmentStatus == "Not assigned") {
							assignActionEnabled = true;
							/*discardOndemandActionEnabled = true; 
							assignOndemandActionEnabled = true ;
							discardScheduleActionEnabled = true;
							assignScheduleActionEnabled = true ;*/
						} else if (item.data.assignmentStatus == "Assigned") {
							discardActionEnabled = true;
							/*if(item.data.allowOndemand == "Yes" )
							{
								discardOndemandActionEnabled = true ;
							}
							else if(item.data.allowOndemand == "No" )
							{
								assignOndemandActionEnabled = true
							}
							if(item.data.allowSchedule == "Yes" )
							{
								discardScheduleActionEnabled = true ;
							}
							else if(item.data.allowSchedule == "No")
							{
								assignScheduleActionEnabled = true ;
							}*/
						}
					});
		}

		var assignBtn = me.getAssignBtn();
		var discardBtn = me.getDiscardBtn();
		/*var assignOndemandBtn = me.getAssignOndemandBtn();
		var discardOndemandBtn = me.getDiscardOndemandBtn();
		var assignScheduleBtn = me.getAssignScheduleBtn();
		var discardScheduleBtn = me.getDiscardScheduleBtn();*/
		
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
		
		/*if (!discardOndemandActionEnabled && !assignOndemandActionEnabled) {
			discardOndemandBtn.setDisabled(!blnEnabled);
			assignOndemandBtn.setDisabled(!blnEnabled);
		} else if (discardOndemandActionEnabled && assignOndemandActionEnabled) {
			assignOndemandBtn.setDisabled(!blnEnabled);
			discardOndemandBtn.setDisabled(!blnEnabled);
		} else if (assignOndemandActionEnabled) {
			assignOndemandBtn.setDisabled(blnEnabled);
		} else if (discardOndemandActionEnabled) {
			discardOndemandBtn.setDisabled(blnEnabled);
		}*/
		
		/*if (!discardScheduleActionEnabled && !assignScheduleActionEnabled) {
			discardScheduleBtn.setDisabled(!blnEnabled);
			assignScheduleBtn.setDisabled(!blnEnabled);
		} else if (discardScheduleActionEnabled && assignScheduleActionEnabled) {
			discardScheduleBtn.setDisabled(!blnEnabled);
			assignScheduleBtn.setDisabled(!blnEnabled);
		} else if (assignScheduleActionEnabled) {
			assignScheduleBtn.setDisabled(blnEnabled);
		} else if (discardScheduleActionEnabled) {
			discardScheduleBtn.setDisabled(blnEnabled);
		}*/
	},
	enrichmentDiscard : function(strUrl, record) {
		var me = this;
		var grid = me.getPrfDetailsGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			arrayJson.push({
						serialNo : 1,
						identifier : record.data.identifier,
						userMessage : excryptedParentId
					});
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							grid.refreshData();
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
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	}
});
