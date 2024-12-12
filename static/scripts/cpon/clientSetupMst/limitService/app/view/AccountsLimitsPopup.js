Ext.define('CPON.view.AccountsLimitsPopup', {
			extend : 'Ext.window.Window',
			xtype : 'accountsLimitsPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 735,
			minHeight : 156,
			maxHeight : 550,
			resizable : false,
			cls : 'non-xn-popup',
			autoHeight : true,
			modal : true,
			draggable : false,
			itemId : this.itemId,
			closeAction : 'hide',
			autoScroll : true,
			title : this.title,
			config : {
				title: null,
				colName : null,
				itemId : null,
				entity_type1 : null,
				entity_type2 : null,
				accountNo : null
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
										
				/*var entityType2Store = Ext.create('Ext.data.Store',{
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
										});*/
										
				var limitsStore = Ext.create('Ext.data.Store',{
											fields : ['name', 'value'],
											proxy : {
												type : 'ajax',
												url : 'cpon/clientServiceSetup/limitProfilesList?id='+encodeURIComponent(parentkey)+'&periodType='+limitPeriod,
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
				
				sectionalLine = Ext.create('Ext.panel.Panel', {
					border: 5,
					style: {
					    borderColor: 'red',
					    borderStyle: 'solid'
					}
				});
				entityType1ComboValues = Ext.create('Ext.form.ComboBox', {
					itemId: 'entityType1Id',
					padding : '0 0 0 0',
					fieldLabel : me.colName,
					columnWidth : 0.3333,
					labelAlign : 'top',
					labelSeparator : "",
					store : entityType1Store,
					displayField : "name",
					disabled : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
					valueField:"value",
					editable : false,
					value:"",
					fieldCls : 'xn-form-field ux_font-size14-normal',
					labelCls : 'ux_font-size14',
					triggerBaseCls : 'xn-form-trigger',
					cls : 'ux_extralargemargin-right'
				});
				
				/*entityType2ComboValues = Ext.create('Ext.form.ComboBox', {
					itemId: 'entityType2Id',
					padding : '0 0 0 10',
					columnWidth : 0.3333,
					fieldLabel : getLabel('limitAccount','Account'),
					labelAlign : 'top',
					labelSeparator : "",
					store : entityType2Store,
					displayField : "name",
					disabled : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
					valueField:"value",
					editable : false,
					value:"",
					fieldCls : 'xn-form-field ux_font-size14-normal',
					labelCls : 'ux_font-size14',
					triggerBaseCls : 'xn-form-trigger',
					cls : 'ux_extralargemargin-left ux_extralargemargin-right ux_extralargepadding-tb'
				});*/
				
				limitProfileIds = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text xn-suggestion-box',
					padding : '0 0 0 0',
					columnWidth : 0.3333,
					itemId : 'limitProfileId',
					matchFieldWidth : true,
					fieldLabel : getLabel('limitPrf' , 'Limit Profile'),
					disabled : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
					labelAlign : 'top',
					labelCls : 'ft-content-font',
					cfgUrl : 'cpon/clientServiceSetup/allLimitProfilesList',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : '$autofilter',
					cfgDataNode1 : 'name',
					minChars:1,
					cfgExtraParams : [{
												key : 'id',
												value : encodeURIComponent(parentkey)
											},
											{
												key : 'periodType',
												value : limitPeriod
											}],
					listeners : 
					{
						select : function( combo, record, index )
						{
							strLimitProfileId = record[ 0 ].raw.value;
							
						}
					}								
				});
				
							
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							cls : 'ux_extralargemargin-top',
							minHeight : 50,
							maxHeight : 300,
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
							columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
									view, colId) {
									var strRetValue = "";
									if(record.raw.updated === 1 && mode=='MODIFIEDVIEW')
										strRetValue='<span class="newFieldValue">'+value+'</span>';
									else 
										strRetValue = value;
									return strRetValue;
							},
							handleRowIconClick : function(tableView, rowIndex, columnIndex,
								btn, event, record) {
									me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
									event, record);
								}

						});

				me.items = [{
					xtype : 'container',
					layout : 'column',
					cls : 'ux_extralargemargin-bottom',
					items : [entityType1ComboValues,limitProfileIds]
					//items : [entityType1ComboValues,entityType2ComboValues,limitProfileIds]
				},{
					xtype : 'container',
					layout : 'column',
					//cls : 'ux_extralargemargin-bottom',
					items : [
						{
							xtype : 'button',
							//width : 50,
							itemId : 'btnSearchPackage',
							text : getLabel('assign', 'Assign'),
							//cls : 'xn-button ux_button-background-color ux_cancel-button',
							cls : 'ft-button-primary',
							hidden : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
							margin : '0 0 0 0',
							handler : function() {
								me.handleSaveBtn();
							}
						}
					]
				},{
					xtype: 'component',
				    autoEl: 'hr',
				    cls : 'ux_extralargemargin-top ux_extralargemargin-bottom'
				},adminListView];
				
				me.bbar = ['->',{
							xtype : 'button',
							text : getLabel('btnClose', 'Close'),
							itemId : 'btnSubmitPackage',
	  	   	  			    //cls : 'ux_button-padding ux_cancel-button footer-btns accnt-limits-xbtn-left',
							//glyph : 'xf056@fontawesome',
							handler : function() {
								var entityValue1 = me.down('combo[itemId=entityType1Id]').getValue();
								//var entityValue2 = me.down('combo[itemId=entityType2Id]').getValue();
							 	var entityValue2 = $('#acctNmbr').val();
								var limitProfileId = me.down('combo[itemId=limitProfileId]').getValue();
								if(!Ext.isEmpty(entityValue1))
								{
									me.down('combo[itemId=entityType1Id]').setValue('Select');	
								}
								/*if(!Ext.isEmpty(entityValue2)){
									me.down('combo[itemId=entityType2Id]').setValue('Select');
								}*/
								if(!Ext.isEmpty(limitProfileId)){
									me.down('combo[itemId=limitProfileId]').setValue('Select');
								}
								
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
				//var entityValue2 = me.down('combo[itemId=entityType2Id]').getValue();
				var entityValue2 = $('#acctNmbr').val();
				var limitProfileId = strLimitProfileId ;
				//var limitProfileId = limitProfileIds.getValue();
				var errorMsg = "";
				if(limitProfileId == "" || limitProfileId == null || limitProfileId == 'Select')
				{
					errorMsg= errorMsg + getLabel('limitPrfError', 'Please select Limit Profile')+"<br/>";
				}
				if(entityValue1 == "" || entityValue1 == null || entityValue1 == 'Select')
				{
					errorMsg= errorMsg + getLabel("plsSelect","Please select ")+ " " +me.colName+"!<br/>";
				}
				if(entityValue2 == "" || entityValue2 == null)
				{
					errorMsg= errorMsg + getLabel("plsSelectAccount","Please enter Account! ");
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
							 userMessage : record	,
							 periodType:limitPeriod	
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
									var data = Ext.decode(response.responseText);
									if (!Ext.isEmpty(data))
									{
										var data = Ext.decode(response.responseText);
										if(!Ext.isEmpty(data.parentIdentifier))
										{
											parentkey = data.parentIdentifier;
											document.getElementById('viewState').value = data.parentIdentifier;
										}
										if(!Ext.isEmpty(data.listActionResult))
										{
									        Ext.each(data.listActionResult[0].errors, function(error, index) {
										         errorMessage = errorMessage + error.errorMessage +"<br/>";
										        });
										}
										strLimitProfileId = '' ;
										me.down('combo[itemId=limitProfileId]').setValue("");
									}
									if('' != errorMessage && null != errorMessage){
										//Ext.Msg.alert("Error",errorMessage);
										Ext.MessageBox.show({
												title : getLabel("errorTitle","Error"),
												msg : errorMessage,
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
												icon : Ext.MessageBox.ERROR
												});
									}
								}
								 grid.refreshData();
							},
							failure: function() {
								//Ext.Msg.alert("Error","Error while fetching data");
								Ext.MessageBox.show({
									title : getLabel("errorTitle","Error"),
									msg : getLabel("instrumentErrorPopUpMsg","Error while fetching data"),
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
							}
						});
					}
					else
					{
						//Ext.Msg.alert("Error",errorMsg);
						Ext.MessageBox.show({
									title : getLabel("errorTitle","Error"),
									msg : errorMsg,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				},
			getColumns : function() {
				var me=this;
				arrColsPref = [{
							"colId" : "limitValue1",
							"colDesc" :  me.colName
						},{
							"colId" : "limitValue2",
							"colDesc" :  getLabel('limitAccount','Account')
						},{
							"colId" : "limitProfileId",
							"colDesc" :  getLabel('limitProfie','Limit Profile')
						}];
				objWidthMap = {
					"limitValue1" : 130,
					"limitValue2" : 185,
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
						cfgCol.sortable = false;
						if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

						cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
						if(mode=='MODIFIEDVIEW'){
							cfgCol.fnColumnRenderer = me.columnRenderer;
						}
						arrCols.push(cfgCol);
					}
				}
				return arrCols;
			},
			createActionColumn : function() {
						var me = this;
						
						var objActionCol;
						if(mode!='VIEW' && mode!='MODIFIEDVIEW')
							{
							objActionCol = {
									colType : 'actioncontent',
									colId : 'action',
									colHeader : getLabel('actions','Actions'),
									width : 60,
									//align : 'right',
									locked : true,
									items : [
											{
												itemId : 'btnDelete',
												itemCls : 'grid-row-delete-icon ux_smallpadding-left',
												toolTip : getLabel('deleteToolTip',
														'Delete')
											} ]
								
								};
							}
						else
							{
							objActionCol = {
									colType : 'actioncontent',
									colId : 'action',
									width : 60,
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
				strUrl = strUrl + '&entity_type1='+me.entity_type1 + '&entity_type2='+me.entity_type2;
				strUrl = strUrl + '&clientLimitProfileId='+ clientLimitProfileId;
				if (!Ext.isEmpty(me.accountNo))
					strUrl = strUrl + '&accountNo='+ me.accountNo;
				grid.loadGridData(strUrl, null, null, false);
			},
			handlePagingGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this.up('accountsLimitsPopup');
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&entity_type1='+me.entity_type1 + '&entity_type2='+me.entity_type2;
				strUrl = strUrl + '&clientLimitProfileId='+ clientLimitProfileId;
				if (!Ext.isEmpty(me.accountNo))
					strUrl = strUrl + '&accountNo='+ me.accountNo;
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
					success: function(response) {
						var errorMessage = '';
						if(!Ext.isEmpty(response.responseText))
						{
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data))
							{
								if(!Ext.isEmpty(data.parentIdentifier))
								{
									parentkey = data.parentIdentifier;
									document.getElementById('viewState').value = data.parentIdentifier;
								}
								if(!Ext.isEmpty(data.listActionResult))
								{
							        Ext.each(data.listActionResult[0].errors, function(error, index) {
								         errorMessage = errorMessage + error.errorMessage +"<br/>";
								        });
								}
							}
							if('' != errorMessage && null != errorMessage)
							{
								//Ext.Msg.alert("Error",errorMessage);
								Ext.MessageBox.show({
								title : getLabel("errorTitle","Error"),
								msg : errorMessage,
								buttons : Ext.MessageBox.OK,
								cls : 'ux_popup',
								icon : Ext.MessageBox.ERROR
								});
							}
						}
						grid.refreshData();
					},
					failure: function() {
						Ext.Msg.alert("Error","Error while fetching data");
					}
				});	
			}
		});
