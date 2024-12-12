Ext.define('GCP.view.LimitsPopup', {
			extend : 'Ext.window.Window',
			xtype : 'limitsPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 500,
			minHeight : 156,
			maxHeight : 550,
			autoHeight : true,
			modal : true,
			draggable : false,
			resizable : false,
			itemId : this.itemId,
			closeAction : 'hide',
			autoScroll : true,
			title : this.title,
			cls : 'xn-popup',
			config : {
				itemId : null,
				entity_type1: null,
				title : null,
				colName : null,
				makerCheckerFlag:null
			},
			initComponent : function() {
				var me = this;
				var entityType1Store = Ext.create('Ext.data.Store',{
											fields : ['name', 'value'],
											proxy : {
												type : 'ajax',
												url : 'services/user/entityType1Values?id='+encodeURIComponent(parentkey)+'&entityType1='+me.entity_type1,
												reader : {
													type : 'json'
													//root : 'd.accounts'
												},
												actionMethods : {
													create : "POST",
													read : "POST",
													update : "POST",
													destroy : "POST"
												}
											},
											autoLoad : true
										});
				var limitsStore = Ext.create('Ext.data.Store',{
											fields : ['name', 'value'],
											proxy : {
												type : 'ajax',
												url : 'services/user/limitProfilesList?id='+encodeURIComponent(parentkey)+'&periodType='+periodType,
												reader : {
													type : 'json'
													//root : 'd.accounts'
												},
												actionMethods : {
													create : "POST",
													read : "POST",
													update : "POST",
													destroy : "POST"
												}
											},
											autoLoad : true
										});
										
				var colModel = me.getColumns();
				
				entityType1ComboValues = Ext.create('Ext.form.ComboBox', {
					//flex : 1,
					width : 150,
					itemId: 'entityType1Id',
					//padding : '0 0 0 0',
					fieldLabel : me.colName,
					labelAlign : 'top',
					labelCls : 'ft-content-font',
					labelSeparator : "",
					cls:'xn-form-field ft-largeMargin-right',
					triggerCls : 'xn-form-trigger',
					store : entityType1Store,
					displayField : "name",
					valueField:"value",
					editable : false,
					value:""
				});
				limitProfileIds = Ext.create('Ext.form.ComboBox', {
					//flex : 1,
					width : 150,
					itemId : 'limitProfileId',
					//padding : '0 0 0 20',
					fieldLabel : getLabel('limitProfile','Limit Profile'),
					labelAlign : 'top',
					labelCls : 'ft-content-font',
					triggerCls : 'xn-form-trigger',
					labelSeparator : "",
					cls:'xn-form-field',
					store : limitsStore,
					displayField : "name",
					valueField:"value",
					editable : false,
					value:""
				});
				
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							minHeight : 50,
							maxHeight : 350,
							overflowY : 'auto',
							overflowX : false,
							columnModel : colModel,
							showCheckBoxColumn : false,
							hideRowNumbererColumn : true,
							cls:'t7-grid',
							showPager : false,
							multiSort : false,
							showAllRecords : true,
							storeModel : {
								fields : ['limitValue1','limitProfileId','dtlCount','identifier','clientLimitServiceMstId'],
								proxyUrl : 'services/user/clientLimitPopupListValues.json',
								rootNode : 'd.profileDetails',
								totalRowsNode : 'd.__count'
							},
							isRowIconVisible : me.isRowIconVisible,
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : me.handlePagingGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							},
							handleRowIconClick : function(tableView, rowIndex, columnIndex,
								btn, event, record) {
									me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
									event, record);
								},
								handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,menu, event, record) {
									me.handleMoreMenuItemClick(grid, rowIndex, cellIndex,menu, event, record);
								}

						});

				me.items = [{
					xtype : 'container',
					layout : 'column',
					cls : 'ft-padding-bottom',
					items : [entityType1ComboValues,limitProfileIds,
						{
							xtype : 'button',
							//flex : 1,
							itemId : 'btnSearchPackage',
							text : getLabel('assign', 'Assign'),
							cls : 'ft-button-primary',
							margin : '16 0 0 0',
							style : {
								'float' : 'right'
							},
							hidden : (mode=='VIEW')?true:false,
							handler : function() {
								me.handleSaveBtn();
							}
						}
					]
				},adminListView];
				
				me.bbar = ['->',{
							xtype : 'button',
							text : getLabel('btnClose', 'Close'),
							itemId : 'btnSubmitPackage',
							//cls : 'ux_button-padding ux_button-background-color',
							handler : function() {
								if(!Ext.isEmpty(adminListView.getSelectedRecords())){
								}else{
									me.close();
								}
							}
						}];
				me.callParent(arguments);
			},
			
			handleSaveBtn : function() {
				var me = this;
				var grid = me.down('grid');
				var entityValue1 = me.down('combo[itemId=entityType1Id]').getValue();
				var limitProfileId = me.down('combo[itemId=limitProfileId]').getValue();
				
				var errorMsg = "";
				if(limitProfileId == "" || limitProfileId == null)
				{
					errorMsg= errorMsg + getLabel("errorSelectlimitProfile","Please Select Limit Profile!")+"<br/>";
				}
				if(entityValue1 == "" || entityValue1 == null)
				{
					errorMsg= errorMsg +getLabel("pleaseSelect","Please select ")+me.colName+"!"+"</br>";
				}
				
				//var limitProfileId = limitProfileIds.getValue();
				var userCategoryServiceId = null;
				if(me.makerCheckerFlag == 'M'){
					userCategoryServiceId = categoryMakerLimitServiceId;
				}
				else{
					userCategoryServiceId = categoryCheckerLimitServiceId;
				}
				
				var record =  {
						entityType1 : me.entity_type1,
						entityValue1 : entityValue1,
						limitProfileId : limitProfileId,
						categoryLimitServiceId : userCategoryServiceId,
						makerCheckerFlag : me.makerCheckerFlag,
						sellerCode : $('#sellerCodeId').val()
						}; 
				var jsonData = { identifier : parentkey,
							 userMessage : record,
							 sellerCode : $('#sellerCodeId').val()
							};

					if(errorMsg =="")
					{
								Ext.Ajax.request({
									url: 'services/user/saveCustomizedPopupValues',
									method: 'POST',
									jsonData: jsonData,
									success: function(response) {
										var errorMessage = '';
										if (response.responseText != '[]') {
											var data = Ext.decode(response.responseText);
											if (!Ext.isEmpty(data))
											{
												if(!Ext.isEmpty(data.actionResult))
												{
											        Ext.each(data.actionResult[0].errors, function(error, index) {
												         errorMessage = errorMessage +  error.code +' : '+ error.errorMessage +"<br/>";
												        });
												}
												if(!Ext.isEmpty(data.identifier))
												{
													parentkey = data.identifier;
													document.getElementById('viewState').value = data.identifier;
												}
											}
											if ('' != errorMessage
													&& null != errorMessage) {
												Ext.MessageBox.show({
													title : getLabel(
															'errorTitle',
															'Error'),
													msg : errorMessage,
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
											}
										}
										grid.refreshData();
									},
									failure: function() {
										Ext.Msg.alert(getLabel('errorTitle','Error'),getLabel("errorPopUpMsg","Error while fetching data"));
									}
								});
						
					}
					else
					{
							Ext.Msg.alert(getLabel('errorTitle','Error'),errorMsg);
					}
				},

			getColumns : function() {
				var me=this;
				arrColsPref = [{
							"colId" : "limitValue1",
							"colDesc" : me.colName
						},{
							"colId" : "limitProfileId",
							"colDesc" :  getLabel('limitProfile','Limit Profile')
						}];
				objWidthMap = {
					"limitValue1" : 150,
					"limitProfileId" : 150
				};
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				arrCols.push(me.createActionColumn())
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.sortable = false;
						if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

						cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
						//cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				return arrCols;
			},
			createActionColumn : function() {
						var me = this;
							var objActionCol;
							if(mode!='VIEW')
							{
							 objActionCol =  {
								colType : 'actioncontent',
								colId : 'actioncontent',
								width : 108,
								locked : true,
								colHeader : getLabel('actions','Actions'),
								items : [
										{
											itemId : 'btnDelete',
											actionName : 'delete',
											text :  getLabel('deleteToolTip','Delete'),
											toolTip : getLabel('deleteToolTip',
													'Delete')
										} ]
							
								};
						
							}
						else
							{
							 objActionCol =  {
								colType : 'actioncontent',
								colId : 'actioncontent',
								width : 108,
								align : 'right',
								locked : true,
								items : [
										]
							
								};
							}
							return objActionCol;
						
				},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&entity_type1='+ me.entity_type1;
				if(me.makerCheckerFlag == 'M'){
					strUrl = strUrl + '&categoryLimitServiceId='+ categoryMakerLimitServiceId;
				}
				else{
					strUrl = strUrl + '&categoryLimitServiceId='+ categoryCheckerLimitServiceId;
				}
				strUrl = strUrl + '&makerCheckerFlag='+ me.makerCheckerFlag;
				strUrl = strUrl + '&sellerCode='+ $('#sellerCodeId').val();
				grid.loadGridData(strUrl, null, null, false);
			},
			handlePagingGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this.up('limitsPopup');
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				
				strUrl = strUrl + '&entity_type1='+ me.entity_type1;
				if(me.makerCheckerFlag == 'M'){
					strUrl = strUrl + '&categoryLimitServiceId='+ categoryMakerLimitServiceId;
				}
				else{
					strUrl = strUrl + '&categoryLimitServiceId='+ categoryCheckerLimitServiceId;
				}
				strUrl = strUrl + '&makerCheckerFlag='+ me.makerCheckerFlag;
				strUrl = strUrl + '&sellerCode='+ $('#sellerCodeId').val();
				grid.loadGridData(strUrl, null, null, false);
			},
			handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record){
				var me =this;
				var grid = me.down('grid');
				var strUrl="services/user/deleteCustomizedPopupValues";
				strUrl = strUrl + '?identifier='+ encodeURIComponent(record.raw.identifier);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&categoryLimitServiceId='+ record.raw.clientLimitServiceMstId;
				Ext.Ajax.request({
					url: strUrl,
					method: 'POST',
					success: function(response) {
						var errorMessage = '';
						if (response.responseText != '[]') {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data))
							{
								if(!Ext.isEmpty(data.actionResult))
								{
							        Ext.each(data.actionResult[0].errors, function(error, index) {
								         errorMessage = errorMessage +  error.code +' : '+ error.errorMessage +"<br/>";
								        });
								}
								if(!Ext.isEmpty(data.identifier))
								{
									parentkey = data.identifier;
									document.getElementById('viewState').value = data.identifier;
								}
							}
							if ('' != errorMessage
									&& null != errorMessage) {
								Ext.MessageBox.show({
									title : getLabel(
											'errorTitle',
											'Error'),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
						}
						grid.refreshData();
					},
					failure: function() {
						Ext.Msg.alert(getLabel('errorTitle','Error'),errorMsg);
					}
				});										
			},
			isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
				return true;
			},
			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,menu, event, record) {
				var me = this;
				var dataParams = null;
				if (!Ext.isEmpty(menu.dataParams))
					dataParams = menu.dataParams;
				if (!Ext.isEmpty(dataParams)){
					me.handleRowIconClick(grid,dataParams.rowIndex, dataParams.columnIndex, menu,event,dataParams.record);
				}
					
			}
			
		});
