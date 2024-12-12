Ext.define('GCP.view.AccountsLimitsPopup', {
			extend : 'Ext.window.Window',
			xtype : 'accountsLimitsPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 420,
			autoHeight : true,
			modal : true,
			draggable : true,
			itemId : this.itemId,
			closeAction : 'hide',
			autoScroll : true,
			title : this.title,
			config : {
				title: null,
				colName : null,
				itemId : null,
				entity_type1 : null,
				entity_type2 : null
			},
			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				
				var entityType1Store = Ext.create('Ext.data.Store',{
											fields : ['name', 'value'],
											proxy : {
												type : 'ajax',
												url : 'cpon/clientServiceSetup/entityType1Values?id='+encodeURIComponent(parentkey)+'&entityType1='+me.entity_type1,
												reader : {
													type : 'json',
													root : 'd.accounts'
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
										
				var entityType2Store = Ext.create('Ext.data.Store',{
											fields : ['name', 'value'],
											proxy : {
												type : 'ajax',
												url : 'cpon/clientServiceSetup/accountsList?id='+encodeURIComponent(parentkey)+'&entityType1='+me.entity_type1,
												reader : {
													type : 'json',
													root : 'd.accounts'
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
												url : 'cpon/clientServiceSetup/limitProfilesList?id='+encodeURIComponent(parentkey),
												reader : {
													type : 'json',
													root : 'd.accounts'
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
				
				entityType1ComboValues = Ext.create('Ext.form.ComboBox', {
					itemId: 'entityType1Id',
					padding : '0 0 0 0',
					fieldLabel : me.colName,
					labelAlign : 'top',
					labelSeparator : "",
					store : entityType1Store,
					displayField : "name",
					valueField:"value",
					editable : false,
					value:""
				});
				
				entityType2ComboValues = Ext.create('Ext.form.ComboBox', {
					itemId: 'entityType2Id',
					padding : '0 0 0 20',
					fieldLabel : 'Account',
					labelAlign : 'top',
					labelSeparator : "",
					store : entityType2Store,
					displayField : "name",
					valueField:"value",
					editable : false,
					value:""
				});
				
				limitProfileIds = Ext.create('Ext.form.ComboBox', {
					itemId : 'limitProfileId',
					padding : '0 0 0 0',
					fieldLabel : 'Limit Profile',
					labelAlign : 'top',
					labelSeparator : "",
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
								fields : ['limitValue1','limitValue2','limitProfileId','dtlCount','identifier'],
								proxyUrl : 'cpon/clientServiceSetup/clientLimitPopupListValues.json',
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
					items : [entityType1ComboValues,entityType2ComboValues]
				},{
					xtype : 'container',
					layout : 'hbox',
					items : [limitProfileIds,
						{
							xtype : 'button',
							width : 80,
							itemId : 'btnSearchPackage',
							text : getLabel('saveBtn', 'Save'),
							cls : 'xn-button',
							margin : '20 0 0 50',
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
							cls : 'xn-button',
							handler : function() {
								if(!Ext.isEmpty(adminListView.getSelectedRecords())){
								}else{
									me.close();
								}
							}
						}];
				me.callParent(arguments);
			},
			
			searchPackages : function() {
					//adminListView.refreshData();
				},
			handleSaveBtn : function() {
				var me = this;
				var grid = me.down('grid');
				var entityValue1 = me.down('combo[itemId=entityType1Id]').getValue();
				var entityValue2 = me.down('combo[itemId=entityType2Id]').getValue();
				var limitProfileId = me.down('combo[itemId=limitProfileId]').getValue();
				//var limitProfileId = limitProfileIds.getValue();
				var errorMsg = "";
				if(limitProfileId == "" || limitProfileId == null)
				{
					errorMsg= errorMsg + "Please select Limit Profile!<br/>";
				}
				if(entityValue1 == "" || entityValue1 == null)
				{
					errorMsg= errorMsg + "Please select "+me.colName+"!<br/>";
				}
				if(entityValue2 == "" || entityValue2 == null)
				{
					errorMsg= errorMsg + "Please select Account!";
				}
		
					var record =  {
						entityType1 : me.entity_type1,
						entityValue1 : entityValue1,
						entityType2 : me.entity_type2,
						entityValue2 : entityValue2,
						limitProfileId : limitProfileId,
						clientLimitProfileId : clientLimitProfileId
						}; 
				var jsonData = { identifier : parentkey,
							 userMessage : record	
							};
				
					if(errorMsg =="")
					{
						Ext.Ajax.request({
							url: 'cpon/clientServiceSetup/saveCustomizedPopupValues',
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
							"colDesc" :  me.colName
						},{
							"colId" : "limitValue2",
							"colDesc" :  getLabel('account','Account')
						},{
							"colId" : "limitProfileId",
							"colDesc" :  getLabel('limitProfie','Limit Profile')
						}];
				objWidthMap = {
					"limitValue1" : 130,
					"limitValue2" : 85,
					"limitProfileId" : 85
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
							var objActionCol = {
								colType : 'action',
								colId : 'action',
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
							return objActionCol;
						
				},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&entity_type1='+me.entity_type1 + '&entity_type2='+me.entity_type2;
				strUrl = strUrl + '&clientLimitProfileId='+ clientLimitProfileId;
				grid.loadGridData(strUrl, null, null, false);
			},
			handlePagingGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this.up('accountsLimitsPopup');
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				
				strUrl = strUrl + '&entity_type1='+me.entity_type1 + '&entity_type2='+me.entity_type2;
				strUrl = strUrl + '&clientLimitProfileId='+ clientLimitProfileId;
				grid.loadGridData(strUrl, null, null, false);
			},
			handleRowIconClick : function(tableView, rowIndex, columnIndex, btn,
									event, record){
				var jsonData;
				var me =this;
				var grid = me.down('grid');
				var strUrl="cpon/clientServiceSetup/deleteCustomizedPopupValues";
				strUrl = strUrl + '?identifier='+ encodeURIComponent(record.raw.identifier);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&clientLimitProfileId='+ record.raw.clientLimitServiceMstId;
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
