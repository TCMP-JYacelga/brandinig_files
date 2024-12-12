Ext.define('GCP.view.LimitsPopup', {
			extend : 'Ext.window.Window',
			xtype : 'limitsPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 500,
			autoHeight : true,
			modal : true,
			draggable : true,
			itemId : this.itemId,
			closeAction : 'hide',
			autoScroll : true,
			title : this.title,
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
					itemId: 'entityType1Id',
					padding : '0 0 0 0',
					fieldLabel : me.colName,
					labelAlign : 'top',
					labelSeparator : "",
					cls:'ux_trigger-height',
					store : entityType1Store,
					displayField : "name",
					valueField:"value",
					editable : false,
					value:""
				});
				limitProfileIds = Ext.create('Ext.form.ComboBox', {
					itemId : 'limitProfileId',
					padding : '0 0 0 20',
					fieldLabel : 'Limit Profile',
					labelAlign : 'top',
					labelSeparator : "",
					cls:'ux_trigger-height',
					store : limitsStore,
					displayField : "name",
					valueField:"value",
					editable : false,
					value:""
				});
				
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							padding : '5 0 0 0',
							height : 200,
							overflowY : 'auto',
							columnModel : colModel,
							showCheckBoxColumn : false,
							hideRowNumbererColumn : true,
							showPager : false,
							showAllRecords : true,
							//isRowIconVisible : true,
							storeModel : {
								fields : ['limitValue1','limitProfileId','dtlCount','identifier','clientLimitServiceMstId'],
								proxyUrl : 'services/user/clientLimitPopupListValues.json',
								rootNode : 'd.profileDetails',
								totalRowsNode : 'd.__count'
							},
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
								}

						});

				me.items = [{
					xtype : 'container',
					layout : 'hbox',
					items : [entityType1ComboValues,limitProfileIds,
						{
							xtype : 'button',
							width : 60,
							itemId : 'btnSearchPackage',
							text : getLabel('assign', 'Assign'),
							cls : 'ux_button-padding ux_button-background-color',
							margin : '20 0 0 15',
							hidden : (mode=='VIEW')?true:false,
							handler : function() {
								me.handleSaveBtn();
							}
						}
					]
				},adminListView];
				
				me.buttons = [{
							xtype : 'button',
							text : getLabel('btnClose', 'Close'),
							itemId : 'btnSubmitPackage',
							cls : 'ux_button-padding ux_button-background-color',
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
					errorMsg= errorMsg + "Please select Limit Profile!<br/>";
				}
				if(entityValue1 == "" || entityValue1 == null)
				{
					errorMsg= errorMsg + "Please select "+me.colName+"!";
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
										if(response.responseText != '[]')
										{
											var jsonData = Ext.decode(response.responseText);
											Ext.each(jsonData[0].errors, function(error, index) {
												errorMessage = errorMessage + error.errorMessage +"<br/>";
											});
											if('' != errorMessage && null != errorMessage)
											Ext.Msg.alert("Error",errorMessage);
										}
										
										grid.refreshData();
									},
									failure: function() {
										Ext.Msg.alert("Error","Error while fetching data");
									}
								});
						
					}
					else
					{
								Ext.Msg.alert("Error",errorMsg);
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
								width : 80,
								align : 'right',
								locked : true,
								items : [
										{
											itemId : 'btnDelete',
											itemCls : 'grid-row-delete-icon',
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
								width : 80,
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
					success: function() {
						grid.refreshData();
					},
					failure: function() {
						Ext.Msg.alert("Error","Error while fetching data");
					}
				});										
			}
			
		});
