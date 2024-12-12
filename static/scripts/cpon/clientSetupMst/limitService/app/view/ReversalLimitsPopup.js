Ext.define('CPON.view.ReversalLimitsPopup', {
			extend : 'Ext.window.Window',
			xtype : 'reversalLimitsPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 500,
			minHeight : 156,
			maxHeight : 550,
			resizable : false,
			cls : 'non-xn-popup cpon-limits-popup',
			autoHeight : true,
			modal : true,
			draggable : false,
			itemId : this.itemId,
			closeAction : 'hide',
			autoScroll : true,
			title : this.title,
			config : {
				itemId : null,
				entity_type1: null,
				title : null,
				colName : null
			},
			initComponent : function() {
				var me = this;

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
										
				var colModel = me.getColumns();
				
				
				limitProfileIds = Ext.create('Ext.form.ComboBox', {
					itemId : 'limitProfileId',
					//padding : '0 0 0 20',
					fieldLabel : getLabel('limitPrf' , 'Limit Profile'),	
					labelAlign : 'top',
					labelSeparator : "",
					store : limitsStore,
					displayField : "name",
					disabled : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
					valueField:"value",
					editable : false,
					fieldCls : 'xn-form-field ux_font-size14-normal',
					labelCls : 'ux_font-size14',
					triggerBaseCls : 'xn-form-trigger',
					cls : 'ux_extralargepadding-tb ux_extralargemargin-left',
					value:""
				});
				
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							cls : 'ux_extralargemargin-top',
							minHeight : 50,
							maxHeight : 350,
							maxWidth : 480,
							overflowY : 'auto',
							overflowX : false,
							columnModel : colModel,
							showCheckBoxColumn : false,
							hideRowNumbererColumn : true,
							showPager : false,
							showAllRecords : true,
							//isRowIconVisible : true,
							storeModel : {
								fields : ['limitValue1','limitProfileId','dtlCount','identifier','clientLimitServiceMstId'],
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
					items : [limitProfileIds,
						{
							xtype : 'button',
							itemId : 'btnSearchPackage',
							text : getLabel('lblAssign', 'Assign'),
							cls : 'ft-button-primary',
							margin : '16 0 0 0',
							style : {
								'float' : 'right'
							},
							hidden : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
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
	  	   	  			    //cls : 'ux_button-padding ux_cancel-button',
							//glyph : 'xf056@fontawesome',
							handler : function() {
								var limitProfileId = me.down('combo[itemId=limitProfileId]').getValue();
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
			
			handleSaveBtn : function() {
				var me = this;
				var grid = me.down('grid');
				//var entityValue1 = me.down('combo[itemId=entityType1Id]').getValue();
				var entityValue1 = $('#acctNmbr').val()
				var limitProfileId = me.down('combo[itemId=limitProfileId]').getValue();
				//var limitProfileId = limitProfileIds.getValue();
				var errorMsg="";
				if(limitProfileId == "" || limitProfileId == null || limitProfileId == "Select")
				{
					errorMsg= errorMsg + getLabel('limitPrfError', 'Please select Limit Profile')+ "<br/>";
				}
				if(entityValue1 == "" || entityValue1 == null)
				{
					errorMsg= errorMsg + getLabel("plsSelect","Please select ")+ " " +me.colName+"!";
				}
				
					var record =  {
						entityType1 : me.entity_type1,
						entityValue1 : entityValue1,
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
						if(mode!='VIEW'  && mode!='MODIFIEDVIEW')
							{
							 objActionCol = {
									colType : 'actioncontent',
									colId : 'action',
									width : 50,
									//align : 'right',
									locked : true,
									colHeader : getLabel('actions','Actions'),
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
										width : 50,
										//align : 'right',
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
				strUrl = strUrl + '&clientLimitProfileId='+ clientLimitProfileId;
				grid.loadGridData(strUrl, null, null, false);
			},
			handlePagingGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this.up('reversalLimitsPopup');
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				
				strUrl = strUrl + '&entity_type1='+ me.entity_type1;
				strUrl = strUrl + '&clientLimitProfileId='+ clientLimitProfileId;
				grid.loadGridData(strUrl, null, null, false);
			},
			handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record){
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
