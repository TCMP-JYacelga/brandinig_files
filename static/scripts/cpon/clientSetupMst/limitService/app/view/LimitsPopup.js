Ext.define('CPON.view.LimitsPopup', {
			extend : 'Ext.window.Window',
			xtype : 'limitsPopup',
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
				if(undefined!=me.entity_type1&&'REVERSAL_ACCOUNT'==me.entity_type1)
				{
					var entityType1Store = Ext.create('Ext.data.Store',{
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
				}
				else
				{
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
					
				}
				var colModel = me.getColumns();
				
				entityType1ComboValues = Ext.create('Ext.form.ComboBox', {
					itemId: 'entityType1Id',
					//padding : '0 0 0 0',
					fieldLabel : me.colName,
					labelAlign : 'top',
					labelSeparator : "",
					store : entityType1Store,
					displayField : "name",
					disabled : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
					hidden : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
					valueField:"value",
					editable : false,
					fieldCls : 'xn-form-field ux_font-size14-normal',
					labelCls : 'ux_font-size14',
					triggerBaseCls : 'xn-form-trigger',
					cls : 'ux_extralargemargin-tb ux_extralargemargin-right',
					value:""
				});
				limitProfileIds = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text xn-suggestion-box',
					width : '50%',
					itemId : 'limitProfileId',
					matchFieldWidth : true,
					fieldLabel : getLabel('limitPrf' , 'Limit Profile'),
					disabled : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
					hidden : (mode=='VIEW' || mode=='MODIFIEDVIEW')?true:false,
					labelAlign : 'top',
					labelCls : 'ft-content-font',
					cfgUrl : 'cpon/clientServiceSetup/allLimitProfilesList',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgDataNode1 : 'name',
					minChars:1,
					cfgExtraParams : [{
												key : 'id',
												value : encodeURIComponent(parentkey)
											},
											{
												key : 'periodType',
												value :$('input:radio[name=periodType]:checked').val()
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
					items : [entityType1ComboValues,limitProfileIds,
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
								var entityValue1 = me.down('combo[itemId=entityType1Id]').getValue();
								if(!Ext.isEmpty(entityValue1))
								{
									me.down('combo[itemId=entityType1Id]').setValue('Select');	
								}
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
				var entityValue1 = me.down('combo[itemId=entityType1Id]').getValue();
				
				var limitProfileId = strLimitProfileId ;
				//var limitProfileId = limitProfileIds.getValue();
				var errorMsg="";
				if(limitProfileId == "" || limitProfileId == null || limitProfileId == "Select")
				{
					errorMsg= errorMsg + getLabel('limitPrfError', 'Please select Limit Profile')+ "<br/>";
				}
				if(entityValue1 == "" || entityValue1 == null || entityValue1=="Select")
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
							 userMessage : record,
							 periodType:periodType	
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
												strLimitProfileId = '' ;
												me.down('combo[itemId=limitProfileId]').setValue("");
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
					"limitValue1" : "50%",
					"limitProfileId" : "50%"
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
				var me = this.up('limitsPopup');
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
