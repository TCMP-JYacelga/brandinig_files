Ext.define('GCP.controller.MessageFormMstGridController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.MessageFormMstGridView'],
	views : ['GCP.view.MessageFormMstMainView'],

	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
		ref : 'messageFormMstGridViewRef',
		selector : 'messageFormMstGridViewType panel[itemId="gridViewPanelItemId"]'
	}, {
		ref : 'smartGridRef',
		selector : 'grid[itemId="smartGridItemId"]'
	}, {
		ref : 'messageFormMstMainViewRef',
		selector : 'messageFormMstMainViewType'
	}, {
		ref : 'actionBarSummDtl',
		selector : 'messageFormMstGridViewType messageFormMstGroupActionBarViewType'
	}, {
		ref : 'withHeaderCheckboxRef',
		selector : 'messageFormMstMainViewType menuitem[itemId="withHeaderId"]'
	},{
			ref: 'sellerfilter',
			selector: 'messageFormMstMainViewType messageFormMstFilterViewType panel[itemId="sellerFilter"]'
		}

	],
	config : {
		listURL : 'getMessageFormMstList.srvc'
	},

	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */

	init : function() {
		var me = this;

		me.control({
			'messageFormMstMainViewType' : {
				render : function(panel) {
					me.handleSmartGridConfig();
					me.renderSellerClientFields();
				},
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},

			'messageFormMstGridViewType smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
			},

			'messageFormMstGridViewType toolbar[itemId="groupActionBarItemId"]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}

		});
	},

	handleSmartGridConfig : function() {
		var me = this;
		var flag = false;
		var smartGridRef = me.getSmartGridRef();
		if (Ext.isEmpty(smartGridRef)) {
			if (objGridViewPref) {
				flag = true;
				me.loadSmartGrid(objGridViewPref, flag);
			} else {
				me.loadSmartGrid(objDefaultGridView, flag);
			}
		} else {
			me.handleLoadGridData(smartGridRef, smartGridRef.store.dataUrl,
					smartGridRef.pageSize, 1, 1, null, null);
		}
	},

	loadSmartGrid : function(data, flag) {
		var me = this;
		var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
		// var massageFormMstGrid = null;
		var url;
		var url = me.listURL;
		var data1;
		var objWidthMap = {
			"formName" : 150,
			"formGroup" : 150,
			"formDestination" : 150,
			"screenTypeDesc" : 150,
			"replyType" : 150,
			"qlinkName" : 140,
			"statusDesc" : 100
		};

		if (flag === false) {
			objPref = data[0];
			arrColsPref = objPref.gridCols;
			arrCols = me.getColumns(arrColsPref, objWidthMap);
			pgSize = !Ext.isEmpty(objPref.pgSize)
					? parseInt(objPref.pgSize,10)
					: _GridSizeMaster;
		} else {
			data1 = Ext.decode(data);
			objPref = data1[0];
			arrColsPref = objPref.gridCols;
			arrCols = me.getColumns(arrColsPref, objWidthMap);
			pgSize = !Ext.isEmpty(objPref.pgSize)
					? parseInt(objPref.pgSize,10)
					: _GridSizeMaster;
		}

		massageFormMstGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			itemId : 'smartGridItemId',
			// height : 500,
			pageSize : 10,
			autoDestroy : true,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : true,
			hideRowNumbererColumn : true,
			enableCellEditing : true,
			showPager : true,
			padding : '0 10 10 10',
			rowList : [5, 10, 25, 50, 100, 500],
			minHeight : 140,
			columnModel : arrCols,
			storeModel : {
				fields : ['formName', 'formGroup', 'formDestination','screenTypeDesc',
						'replyType', 'qlinkName', 'statusDesc', 'identifier',
						'history', 'recViewState', '__metadata'],
				proxyUrl : url,
				totalRowsNode : 'd.__count',
				rootNode : 'd.messageFormMst'
			},
			gridPageChange : function(objGrid, strDataUrl, intPgSize,
					intNewPgNo, intOldPgNo, jsonSorter) {
				me.widgetDetails.pgSize = intPgSize;
				me.fireEvent('gridPageChange', me, objGrid, strDataUrl,
						intPgSize, intNewPgNo, intOldPgNo, jsonSorter);
			},
			pagechange : function(pager, current, oldPageNum) {
				me.fireEvent('performComboPageSizeChange', pager, current,
						oldPageNum);
			},
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},
			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
						menu, event, record) {
						var dataParams = menu.dataParams;
						me.handleRowIconClick(
						  dataParams.view,
						  dataParams.rowIndex,
						  dataParams.columnIndex,
						  menu, event,
						 dataParams.record);
					}
		});
		var messageFormMstGridViewRef = me.getMessageFormMstGridViewRef();
		messageFormMstGridViewRef.add(massageFormMstGrid);
		messageFormMstGridViewRef.doLayout();
	},

	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				if (objCol.colId === 'requestReference') // to show the
				// summary row
				// description
				{
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, colId) {
						var strRet = getLabel('lblsubtotal', 'Sub Total');
						return strRet;
					}
				}

				if (objCol.colId === 'requestedAmnt') // to show subtotal
				// value
				{
					cfgCol.fnSummaryRenderer = function(value, summaryData,
							dataIndex, colId) {
						var loanCenterGrid = me.getLoanCenterGridRef();
						if (!Ext.isEmpty(loanCenterGrid)
								&& !Ext.isEmpty(loanCenterGrid.store)) {
							var data = loanCenterGrid.store.proxy.reader.jsonData;
							if (data && data.d && data.d.__subTotal) {
								strRet = data.d.__subTotal;
							}
						}
						return strRet;
					}
				}

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
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 120,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items : [{
						itemId : 'submit',
						text : getLabel('prfMstActionSubmit','Submit'),
						toolTip : getLabel('prfMstActionSubmit', 'Submit'),
						maskPosition : 1
					}, {
						itemId : 'accept',
						text : getLabel('prfMstActionApprove','Approve'),
						toolTip : getLabel('prfMstActionApprove', 'Approve'),
						maskPosition : 2
					},
					{
						text : getLabel('prfMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 3
					},
					{
						text : getLabel('prfMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 6
					},
					{
						text : getLabel('prfMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 4
					},
					{
						text : getLabel('prfMstActionDisable',	'Disable'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 5
					}]
		};
		return objActionCol;
	},

	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			sortable : false,
			width : 85,
			locked : true,
			lockable: false,
			draggable : true,
			items : [{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 7
					}, {
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit Record'),
						maskPosition : 8
					}, {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip','View History'),
						toolTip : getLabel('historyToolTip', 'View History'),
						maskPosition : 9
					}]
		};
		return objActionCol;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		strRetValue = value;
		return strRetValue;
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var me = this;
		var maskSize = 9;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
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
		if ((maskPosition === 2 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 3 && retValue) {
			retValue = retValue && isSameUser;
		}
		return retValue;
	},

	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
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

	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var maskSize = 9;
		var buttonMask = '';
		var maskArray = new Array(), actionMask = '', objData = null;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		actionMask = doAndOperation(maskArray, maskSize);
		me.enableDisableGroupActions(actionMask, isSameUser);
	},

	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'reject' || actionName === 'enable'
				|| actionName === 'disable' || actionName === 'discard') {
			me.handleGroupActions(btn, record);
		} else if (actionName === 'btnEdit') {
			showEditMessageForm(record.data.recViewState);
		} else if (actionName === 'btnView') {
			showViewMessageForm(record.data.recViewState);
		} else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		}
	},

	showHistory : function(url, id) {
		Ext.create('GCP.view.MessageFormMstHistoryPopupView', {
					historyUrl : url + "?" + csrfTokenName + "="
							+ csrfTokenValue,
					identifier : id
				}).show();
	},

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('getMessageFormMstList/{0}.srvc?',
				strAction);
		strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, record);
		} else {
			this.preHandleGroupActions(strUrl, '', record);
		}
	},

	showRejectVerifyPopUp : function(strAction, strActionUrl, record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('instrumentsHistoryColumnRejectRemark', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me
									.preHandleGroupActions(strActionUrl, text,
											record);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, record) {
		var me = this;
		var grid = this.getSmartGridRef();
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
							userMessage : remark,
							reason : records[index].data.formName
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
							if(response.responseText != '[]')
						       {
							        var jsonData = Ext.decode(response.responseText);
							        if(!Ext.isEmpty(jsonData))
							        {
							        	jsonData = jsonData.d.instrumentActions;
							        	for(var i =0 ; i<jsonData.length;i++ )
							        	{
							        		var arrError = jsonData[i].errors;
							        		if(!Ext.isEmpty(arrError))
							        		{
							        			for(var j =0 ; j< arrError.length; j++)
									        	{
								        			errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
									        	}
							        		}
							        		
							        	}
								        if('' != errorMessage && null != errorMessage)
								        {
								         //Ext.Msg.alert("Error",errorMessage);
								        	Ext.MessageBox.show({
												title : getLabel('instrumentErrorPopUpTitle','Error'),
												msg : errorMessage,
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
												icon : Ext.MessageBox.ERROR
											});
								        } 
							        }
						       }
							me.enableDisableGroupActions('000000000', true);
							grid.refreshData();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'filterPopupMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},

	enableDisableGroupActions : function(actionMask, isSameUser) {
		var actionBar = this.getActionBarSummDtl();

		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey || strBitMapKey == 0) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							if ((item.maskPosition === 2 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 3 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},

	callHandleLoadGridData : function(passedFilterUrl) {
		var me = this;
		var gridObj = me.getMessageFormMstMainViewRef().globalGridRef;
		me.handleLoadGridData(gridObj, gridObj.store.dataUrl, gridObj.pageSize,
				1, 1, null, passedFilterUrl);
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter,
			passedFilterUrl) {
		var me = this;
		me.getMessageFormMstMainViewRef().globalGridRef = grid;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var strFilterUrl = '', strSellerCode = strSellerId;

		if (passedFilterUrl == null)
			strFilterUrl = this.getController('MessageFormMstFilterController')
					.getFilterUrl();
		else
			strFilterUrl = passedFilterUrl;
		if(!Ext.isEmpty(strSellerCode)){
			strFilterUrl = Ext.isEmpty(strFilterUrl) ? ("&$filter=entitledSellerId eq '"+strSellerCode+"'") : strFilterUrl  + (" and entitledSellerId eq '"+strSellerCode+"'");
		}
		strUrl = strUrl + strFilterUrl + "&" + csrfTokenName + "=" + csrfTokenValue
		grid.loadGridData(strUrl);
	},
	handleReportAction : function(btn, opts) {
		var me = this;
		me.downloadReport(btn.itemId);
	},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = me.getWithHeaderCheckboxRef().checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			loanCenterDownloadPdf : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';
		var viscols;
		var col = null;
		var visColsStr = "";
		var colMap = new Object();
		var colArray = new Array();

		strExtension = arrExtension[actionName];
		strUrl = 'services/getMessageFormMstList/getMessageFormMstDynamicReport.'
				+ strExtension;
		strUrl += '?$skip=1';

		var strQuickFilterUrl = this.getMessageFormMstMainViewRef().globalFilterReportData;

		strUrl += strQuickFilterUrl;
		var grid = me.getSmartGridRef();
		viscols = grid.getAllVisibleColumns();
		for (var j = 0; j < viscols.length; j++) {
			col = viscols[j];
			if (col.dataIndex && arrSortColumn[col.dataIndex]) {
				if (colMap[arrSortColumn[col.dataIndex]]) {
					// ; do nothing
				} else {
					colMap[arrSortColumn[col.dataIndex]] = 1;
					colArray.push(arrSortColumn[col.dataIndex]);
				}
			}

		}
		if (colMap != null) {

			visColsStr = visColsStr + colArray.toString();
			strSelect = '&$select=[' + colArray.toString() + ']';
		}

		strUrl = strUrl + strSelect;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	
	renderSellerClientFields : function()
	{
		var me = this;
	    var sellerFilterPanel = me.getSellerfilter();
	    var multipleSellersAvailable = false;
	    var storeDataSeller = null;
	    var objSellerStore = null;
	    
	    Ext.Ajax.request({
	        url: 'services/userseek/adminSellersListCommon.json',
	        params: {
	            filter: USER
	        },
	        method: 'POST',
	        async: false,
	        success: function(response) {
	            var data = Ext.decode(response.responseText);
	            if (!Ext.isEmpty(data)) {
	                storeDataSeller = data.d.preferences;
	            }
	        },
	        failure: function(response) {
	            // console.log("Ajax Get data Call Failed");
	        }
	    });
	    objSellerStore = Ext.create('Ext.data.Store', {
	        fields: ['CODE', 'DESCR'],
	        data: storeDataSeller,
	        reader: {
	            type: 'json',
	            root: 'd.preferences'
	        },
	        autoLoad: false

	    });
	    objSellerStore.load();
	    if (objSellerStore.getCount() > 1) {
	        multipleSellersAvailable = true;
	    }
	    if (!Ext.isEmpty(sellerFilterPanel)) {
	        sellerFilterPanel.removeAll();
	    }

	    if (userType == "0" && multipleSellersAvailable){
	        sellerFilterPanel.add([{
	                xtype: 'label',
	                text: getLabel('seller', 'Financial Institution'),
	                cls: 'frmLabel'
	                //padding : '6 0 0 10'
	            }, {
	                xtype: 'combobox',
					cls : 'ux_paddingb',
	                fieldCls: 'xn-form-field inline_block',
	                triggerBaseCls: 'xn-form-trigger ux_width17',
	                //filterParamName : 'requestState',
	                itemId: 'broadcastMsgSellerCode',
	                valueField: 'CODE',
	                displayField: 'DESCR',
	                name: 'comboSeller',
					editable: false,
					width:'100%',
	                store: objSellerStore,
	                listeners: {
	                    'render': function(combo, record) {
	                        combo.setValue(strSellerId);
	                        combo.store.load();
	                    },
	                    'select' : function(combo, strNewValue, strOldValue) {
							setAdminSeller(combo.getValue());
							me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
					        }
	                }

	            }]);
	        sellerFilterPanel.show();
	    } else {
	        sellerFilterPanel.hide();
	    }
	}
});
