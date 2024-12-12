Ext.define('GCP.view.TypeCodePrfEntryGridView', {
	extend : 'Ext.panel.Panel',
	border : false,
	xtype : 'typeCodePrfEntryGridView',
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
					itemId : 'searchTypeCodeEntryTextField',
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
					itemId : 'matchCriteriaTypeCodeEntry',
					vertical : true,
					columns : 1,
					items : [{
								boxLabel : getLabel('exactMatch', 'Exact Match'),
								name : 'searchOnPageTypeCodeEntry',
								inputValue : 'exactMatchTypeCodeEntry',
								listeners : {
									change : function(f, e) {
										me.searchTrasactionChange(grid);
									}
								}
							}, {
								boxLabel : getLabel('anyMatch', 'Any Match'),
								name : 'searchOnPageTypeCodeEntry',
								inputValue : 'anyMatchTypeCodeEntry',
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
			//margin : '6 0 6 0',
			width:'100%',
			items : [{
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
			componentCls:'x-portlet',
			title : getLabel('typeCodes', 'Type Codes'),
			itemId : 'prfMstDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						itemId : 'prfMstActionsView',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'font_bold ux-ActionLabel',
									padding : '5 0 0 10'
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
		var strUrl = Ext.String.format('cpon/typeCodeProfileMst/{0}',
				strAction);
		this.preHandleGroupActions(strUrl, excryptedParentId);
	},
	preHandleGroupActions : function(strUrl, excryptedParentId) {	
		var me = this;
		var discardBtn = me.down('prfMstDtlsActionBarView[itemId="dtlsActionBar"] [actionName="unassign"]');
		var assignBtn = me.down('prfMstDtlsActionBarView[itemId="dtlsActionBar"] [actionName="assign"]');
		discardBtn.setDisabled(true);
		assignBtn.setDisabled(true);
		var grid = me.down('smartgrid[itemId="gridTypeCodeProfileDetails"]');
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : excryptedParentId,
							typeDescription : records[index].data.typeDescription,
							itemCount : records[index].data.itemCount,
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
		if ('anyMatchTypeCodeEntry' === anyMatch.searchOnPageTypeCodeEntry) {
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
		strUrl = 'cpon/typeCodeProfileDetails.json';

		var pgSize = (typeof serverTxnPageSize != 'undefined')
				? serverTxnPageSize
				: 10;
		arrCols = me.getColumns();
		grid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridTypeCodeProfileDetails',
			itemId : 'gridTypeCodeProfileDetails',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			padding : '0 10 10 10',
			rowList : _AvailableGridSize,
			minHeight : 100,
			columnModel : arrCols,
			showCheckBoxColumn: checkBoxColumnHideShow,
			storeModel : {
				fields : ['notifications', 'identifier', 'beanName',
						'profileId', 'primaryKey', 'typeCode',
						'typeDescription', 'typeCodeLevelDescription','typecodeLevel','type','gridOrder','headerOrder','itemCount',
						'assignmentStatus', 'parentRecordKey', 'version','summaryComputeFlag','isSummaryEnabled',
						'recordKeyNo','grid','header'],
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
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableDisablePrMstActions(grid);

				}
			}
		});
	
		grid.on('headerclick', function(ct, column, e, t,  eOpts) {			
			var linkClicked = (e.target.tagName == 'A');
			if (linkClicked) {
				var linkId = e.target.id;
				if(linkId && linkId === 'linkGridOrder'){
					me.fireEvent('getTypeCodeOrderPopUp',this,'grid');
				}
				else
				{
					me.fireEvent('getTypeCodeOrderPopUp',this,'header');
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
		}else if (discardActionEnabled && assignActionEnabled) {
			assignBtn.setDisabled(!blnEnabled);
			discardBtn.setDisabled(!blnEnabled);
		} else if (assignActionEnabled) {
			assignBtn.setDisabled(blnEnabled);
		} else if (discardActionEnabled) {
			discardBtn.setDisabled(blnEnabled);
		}

	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var objWidthMap = {
			"action" : 80,
			"typeCode" : 80,
			"typeDescription" : 250,
			"typecodeLevel" : 100,
			"type" : 100
		};

		var arrColsPref = [{
					"colId" : "typeCode",
					"colDesc" : getLabel("lblTypecode","Type Code")
				},{
					"colId" : "typeDescription",
					"colDesc" : getLabel("bankHistoryPopUpDescription","Description")
				},{
					"colId" : "typeCodeLevelDescription",
					"colDesc" : getLabel("lbllevel","Level")
				}, {
					"colId" : "type",
					"colDesc" : getLabel("lblType","Type")
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
		//arrCols.push(me.createGridOrderActionColumn());		
		//arrCols.push(me.createHeaderOrderActionColumn());	
		if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
			arrCols.push(me.createViewItemCountActionColumn());
			}else{
			arrCols.push(me.createItemCountActionColumn());
			}		
		//Change for "Option to add Summary / Status Type Codes to BR Recap Ribbon"
		arrCols.push(me.summaryRibbonColumn());
		cfgCol = {};
		cfgCol.colId="assignmentStatus";
		cfgCol.colHeader = getLabel("status","Status");
		cfgCol.width =  120;
		cfgCol.sortable=false;
		cfgCol.fnColumnRenderer = me.columnRenderer;		
		arrCols.push(cfgCol);
		return arrCols;
	},
	summaryRibbonColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'header',
			colHeader : getLabel('summaryRibbon', 'Summary Ribbon'),
			sortable: false,
			hideable : false,
			draggable: false,
			lockable: false,
			resizable: false,
			width : 100,
			align : 'center',
			items : [{
				itemId : 'headerFlag',
				fnClickHandler : function(tableView, rowIndex, columnIndex,
						btn, event, record) {
					if (modeVal != 'VERIFY' && modeVal != 'VIEW'
							&& modeVal != 'SUBMIT') {
						if (record.data.header === 'N') {
							record.set("header", 'Y');
						} else {
							record.set("header", 'N');
						}
						var recordKeyNo = record.data.recordKeyNo;
						if (typeof recordKeyNo !== undefined
								&& recordKeyNo !== null && recordKeyNo) {

							var newEntry = {};
							newEntry['recordKeyNo'] = recordKeyNo;
							newEntry['header'] = record.data.header;

							if (!me
									.checkIfRecordKeyExistsforHeader(recordKeyNo)) {
								typeCodeDetailHeaderSelectionsArray
										.push(newEntry);
							} else {

								for (var i in typeCodeDetailHeaderSelectionsArray) {
									if (typeCodeDetailHeaderSelectionsArray[i].recordKeyNo == recordKeyNo) {
										typeCodeDetailHeaderSelectionsArray[i].header = record.data.header;
										break; // Stop this loop, we found it!
									}
								}

							}
						}
					}
				},
				fnIconRenderer : function(value, metaData, record, rowIndex,
						colIndex, store, view) {
					if (!record.get('isEmpty')) {
						if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
							if(record.data.isSummaryEnabled === 'Y'){	
							if (record.data.header === 'Y') {
								var iconClsClass = 'icon-checkbox-checked-grey';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked-grey';
								return iconClsClass;
							}
							}
						}else{
						if(record.data.isSummaryEnabled === 'Y'){
							if (record.data.header === 'Y') {
								var iconClsClass = 'icon-checkbox-checked';
								return iconClsClass;
							} else {
								var iconClsClass = 'icon-checkbox-unchecked';
								return iconClsClass;
							}
						 }	
						}
					}
				}
			}]
		};
		return objActionCol;
	},
	
	createViewItemCountActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'itemCount',
					colHeader : getLabel('itemCount', 'Item Count'),
					width : 80,
					align : 'center',
					items : [{
						itemId : 'itemCount',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT') {
								if(record.data.typecodeLevel === 'S' && record.data.summaryComputeFlag === 'Y'){	
									if (record.data.itemCount === 'Y') {
									var iconClsClass = 'icon-checkbox-checked-grey'; 
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked-grey';
									return iconClsClass;
								}
								}
								}else{
								if(record.data.typecodeLevel === 'S' && record.data.summaryComputeFlag === 'Y'){
									if (record.data.itemCount === 'Y') {
										var iconClsClass = 'icon-checkbox-checked';
										return iconClsClass;
									} else {
										var iconClsClass = 'icon-checkbox-unchecked';
										return iconClsClass;
									}
								}
								}
							}
						}
					}]
				};
				return objActionCol;
			},
	
	createItemCountActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'itemCount',
					colHeader : getLabel('itemCount', 'Item Count'),
					width : 80,
					align : 'center',
					items : [{
						itemId : 'itemCount',
						fnClickHandler : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							
							if (record.data.itemCount === 'N') {
								record.set("itemCount", 'Y');
							} else {
								record.set("itemCount", 'N');
							}
							var recordKeyNo = record.data.recordKeyNo;
							if(typeof recordKeyNo!== undefined && recordKeyNo!==null && recordKeyNo ){
								
								var newEntry = {};
								newEntry['recordKeyNo'] = recordKeyNo;
								newEntry['itemCount'] = record.data.itemCount;
								
								if(!me.checkIfRecordKeyExists(recordKeyNo)){
								  typeCodeDetailItemCountSelectionsArray.push(newEntry);
								}else{
								  
								    for (var i in typeCodeDetailItemCountSelectionsArray) {
										 if (typeCodeDetailItemCountSelectionsArray[i].recordKeyNo == recordKeyNo) {
											typeCodeDetailItemCountSelectionsArray[i].itemCount = record.data.itemCount;
											break; //Stop this loop, we found it!
										 }
									   }
								
								
								}
						   }
								
						},
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (modeVal == 'VERIFY' || modeVal == 'VIEW' || modeVal == 'SUBMIT'){
									if(record.data.typecodeLevel === 'S' && record.data.summaryComputeFlag === 'Y'){	
									if (record.data.itemCount === 'Y') {
										var iconClsClass = 'icon-checkbox-checked-grey'; 
										return iconClsClass;
									} else {
										var iconClsClass = 'icon-checkbox-unchecked-grey';
										return iconClsClass;
									}
									}
								}else{
								if(record.data.typecodeLevel === 'S' && record.data.summaryComputeFlag === 'Y'){
									if (record.data.itemCount === 'Y') {
										var iconClsClass = 'icon-checkbox-checked'; 
										return iconClsClass;
									} else {
										var iconClsClass = 'icon-checkbox-unchecked';
										return iconClsClass;
									}
								 }	
								}
							}
						}
					}]
				};
				return objActionCol;
			},
	
	checkIfRecordKeyExists : function (recordKeyNo) {
	 var me = this;
	 var flag = false;
	 for (var index  in typeCodeDetailItemCountSelectionsArray){
			
				var orginalObj = typeCodeDetailItemCountSelectionsArray[index];
				
				if(orginalObj.recordKeyNo == recordKeyNo){
				   flag =true;break;
				 }
				
				}
		 return flag;		
	
	},
	checkIfRecordKeyExistsforHeader : function (recordKeyNo) {
	 var me = this;
	 var flag = false;
	 for (var index  in typeCodeDetailHeaderSelectionsArray){
			
				var orginalObj = typeCodeDetailHeaderSelectionsArray[index];
				
				if(orginalObj.recordKeyNo == recordKeyNo){
				   flag =true;break;
				 }
				
				}
		 return flag;		
	
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
	
	createGridOrderActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'gridOrder',
			colHeader : "Grid &nbsp;(&nbsp; <a class='cursor_pointer navigationLink' id='linkGridOrder'>Grid Order</a> &nbsp;)",
			align : 'center',
			sortable:false,
			hideable:false,
			width : 140,
			//locked : true,
			items : [{
				//itemId : 'btnfavoriteGridView',
				itemCls : 'linkbox icon-checkbox-checked',
				fnClickHandler : function(tableView, rowIndex, columnIndex,
						btn, event, record) {

					if(Ext.isEmpty(record.data.grid) || record.data.grid=="N")
						{
						record.set('grid',"Y");
						}
						else
						{
						record.set('grid',"N");
						}
				},
				fnIconRenderer : function(value, metaData, record, rowIndex,
						colIndex, store, view) {
					var iconClsClass = '';
					if(Ext.isEmpty(record.data.grid) || record.data.grid=='N')
					{					
					iconClsClass = 'linkbox icon-checkbox-unchecked';
					}
					else
					{
					iconClsClass = 'linkbox icon-checkbox-checked';
					}
					return iconClsClass;
				}
			}]
		};
		return objActionCol;
	},
	createHeaderOrderActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'headerOrder',
			colHeader : "Header &nbsp;(&nbsp; <a class='cursor_pointer navigationLink' id='linkHeaderOrder'>Header Order</a> &nbsp;)",
			align : 'center',
			width : 140,
			sortable:false,
			hideable:false,
			//locked : true,
			items : [{
				itemId : 'btnfavoriteGridView',
				itemCls : 'linkbox misc-icon icon-misc-nonfavorite',
				fnClickHandler : function(tableView, rowIndex, columnIndex,
						btn, event, record) {
						if(Ext.isEmpty(record.data.grid) || record.data.header=="N")
						{
						record.set('header',"Y");
						}
						else
						{
						record.set('header',"N");
						}
					
				},
				fnIconRenderer : function(value, metaData, record, rowIndex,
						colIndex, store, view) {
					var iconClsClass = '';	
					if(Ext.isEmpty(record.data.header) || record.data.header=='N')
					{					
					iconClsClass = 'linkbox icon-checkbox-unchecked';
					}
					else
					{
					iconClsClass = 'linkbox icon-checkbox-checked';
					}
					return iconClsClass;
				}
			}]
		};
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
			if(null!=blnViewOld || !(''==blnViewOld))
			{
				strUrl = strUrl +'&$old='+blnViewOld;
			}			
		}

		// strUrl = strUrl + me.addFilterUrl();
		//grid.loadGridData(strUrl, null);
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
		grid.setSelectedRecords('');
		//me.enableDisablePrMstActions(grid);
	},
	enableEntryButtons:function(){
	  gridRender=true;
	  enableDisableGridButtons(false);
	 }
});