Ext.define('GCP.view.CodeMapPopup', {
			extend : 'Ext.window.Window',
			xtype : 'codeMapPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			width : 600,
			autoHeight : true,
			modal : true,
			draggable : false,
			itemId : this.itemId,
			closeAction : 'hide',
			autoScroll : true,
			title : getLabel('CodeMapDetails','Code Map Details'),
			cls:'xn-popup pagesetting ',
			config : {
				itemId : null,
				fieldName: null,
				colName : null,
				makerCheckerFlag:null,
				modelName : null
			},
			initComponent : function() {
				var me = this;
				var entityType1Store = Ext.create('Ext.data.Store',{
											fields : ['name', 'value'],
											proxy : {
												type : 'ajax',
												url : 'services/customInterface/codeMap/inputValues?modelName='+encodeURIComponent(me.modelName)+'&fieldName='+me.fieldName+'&viewState='+strViewState,
												reader : {
													type : 'json',
													root : 'd.codeMapDtlSummary'
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
					itemId: 'inputValue',
					padding : '0 0 0 0',
					labelAlign : 'top',
					labelSeparator : "",
					cls:'ux_trigger-height',
					store : entityType1Store,
					displayField : "name",
					valueField:"value",
					editable : false,
					value:"",
					emptyText : getLabel('select','Select')
				});
				
				/*outputValueTextField = Ext.create('Ext.form.TextField', {
					itemId: 'outputValue',
					//padding : '0 0 0 20',
					labelSeparator : "",
					cls:'xn-form-text  xn-suggestion-box',
					value:""
				});
				*/
				
				outputValueTextField = Ext.create('Ext.form.TextField', {
							labelSeparator : '',
							fieldCls : 'xn-form-text',
							name : 'outputValue',
							itemId : 'outputValue',
							fieldStyle: {
								minHeight:'39px',
								padding:'0px'
							}
							
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
							enableColumnHeaderMenu : false,
							//isRowIconVisible : true,
							storeModel : {
								fields : ['inValue','outValue','dtlCount','identifier'],
								proxyUrl : 'services/customInterface/codeMapPopupValues.json',
								rootNode : 'd.codeMapDtlSummary',
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
							isRowIconVisible : me.isRowIconVisible

						});

				me.items = [{
					xtype : 'container',
					layout : 'hbox',
					items : [
					{
							xtype : 'container',
							itemId : 'inputValueContainer',
							layout : 'vbox',
							flex : 0.3,
							items : [{
										xtype : 'label',
										cls : 'required',
										text : getLabel('inputValueContainer', 'Input Value')
									}, entityType1ComboValues]
				
					},
					{
						xtype : 'container',
						padding:'0 0 0 10px',
							itemId : 'outputValueContainer',
							layout : 'vbox',
							flex : 0.3,
							items : [{
										xtype : 'label',
										cls : 'required',
										text : getLabel('outputValueContainer', 'Output Value')
									}, outputValueTextField]
					},
					{
						xtype : 'container',
							itemId : 'buttonContainer',
							padding:'0 0 0 10px',
							flex : 0.2,
							layout : {type:'vbox',pack:'center'},
							items : [{
							xtype : 'button',
							//width : 60,
							//flex :1,
							itemId : 'btnSearchPackage',
							text : getLabel('btnSearchPackage', 'Assign'),
							cls : 'ft-button ft-button-primary',
							margin : '20 0 0 15',
							hidden : (pageMode=='VIEW')?true:false,
							handler : function() {
									me.handleSaveBtn();
								}
						}]
					}
						
					]
				},adminListView];
				
				me.bbar = [{
							
					xtype : 'button',
					text : getLabel('btnClose', "Close"),
					//cls : 'ft-btn-primary',
					handler : function() {
						me.close();
					}
				
						}];
				me.callParent(arguments);
			},
			
			handleSaveBtn : function() {
				var me = this;
				var grid = me.down('grid');
				var inValue = me.down('combo[itemId=inputValue]').getValue();
				var outValue = me.down('textfield[itemId=outputValue]').getValue();
				
				var errorMsg = "";
				
				if(inValue == "" || inValue == null)
				{
					errorMsg= errorMsg + getLabel("inputError","Please select Input Value!<br/>");
				}
				if(outValue == "" || outValue == null)
				{
					errorMsg= errorMsg + getLabel("outputError","Please select Output Value!");
				}
				
				var record =  {
						inValue : inValue,
						outValue : outValue,
						fieldName : me.fieldName
						}; 
				var jsonData = { identifier : strViewState,
							 userMessage : record,
							mapViewState: $('#interfaceMapMasterViewState').val()
							};

					if(errorMsg =="")
					{
					
							if(isNewRecord != 'Y')
							{
								Ext.Ajax.request({
									url: 'services/customInterface/codeMap/saveCustomizedPopupValues',
									method: 'POST',
									jsonData: jsonData,
									success: function(response) {
										var errorMessage = '';
										me.down('textfield[itemId=outputValue]').setValue('');
										me.down('combo[itemId=inputValue]').getStore().reload();
										me.down('combo[itemId=inputValue]').setValue('');
										grid.refreshData();
									},
									failure: function() {
										Ext.Msg.alert("Error","Error while fetching data");
									}
								});
							}
							else
							{
								Ext.Msg.alert("Error", "Please Save the Interface defintion first");
							}
					}
					else
					{
Ext.MessageBox.show({
							title : getLabel('error','Error'),
							msg : errorMsg,
							buttons : Ext.MessageBox.OK,
							buttonText: {
					            ok: getLabel('btnOk', 'OK')
								},
							cls : 't7-popup',
							icon : Ext.MessageBox.ERROR
						});
					}
			},

			getColumns : function() {
				var me=this;
				arrColsPref = [{
							"colId" : "inValue",
							"colDesc" : me.colName
						},{
							"colId" : "outValue",
							"colDesc" :  getLabel('outputValue','Output Value')
						}];
				objWidthMap = {
					"inValue" : 150,
					"outValue" : 300
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
			isRowIconVisible : function( store, record, jsonData, itmId, maskPosition ){
				return true;
			},
			createActionColumn : function() {
						var me = this;
							var objActionCol;
							if(pageMode!='VIEW')
							{
							 objActionCol =  {
								colHeader: getLabel('actions', 'Actions'),
								colType : 'actioncontent',
								colId : 'action',
								width : 109,
								
								locked : true,
								items : [
										{
											itemId : 'btnDelete',
											itemCls : 'grid-row-action-icon icon-edit',
											toolTip : getLabel( 'deleteToolTip', 'Delete Record' ),
											itemLabel : getLabel('deleteToolTip', 'Delete Record'),
											fnClickHandler : me.handleRowIconClick
										} ]
							
								};
						
							}
						else
							{
							 objActionCol =  {
								colHeader: getLabel('actions', 'Actions'),
								colType : 'actioncontent',
								colId : 'action',
								width : 80,
								
								locked : true,
								items : [
										]
							
								};
							}
							return objActionCol;
						
				},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = grid.up('codeMapPopup');
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&viewState='+encodeURIComponent(strViewState);
				strUrl = strUrl + '&fieldName='+ me.fieldName;
				grid.loadGridData(strUrl, null, null, false);
			},
			handlePagingGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = grid.up('codeMapPopup');
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&viewState='+encodeURIComponent(strViewState);
				strUrl = strUrl + '&fieldName='+ me.fieldName;
				//strUrl = strUrl + '&codeMapRecordKeyNo='+;
				grid.loadGridData(strUrl, null, null, false);
			},
			handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record){
				var me = this;
				var popup = tableView.up('codeMapPopup');
				var grid = tableView.up('smartgrid');
				var strUrl="services/customInterface/codeMap/discard";
				strUrl = strUrl + '?identifier='+ encodeURIComponent(record.raw.identifier);
				strUrl = strUrl + '&viewState='+encodeURIComponent(strViewState);
				strUrl = strUrl + '&categoryLimitServiceId='+ record.raw.parentRecordKey;
				strUrl = strUrl + '&mapViewState='+ $('#interfaceMapMasterViewState').val();
				
				Ext.Ajax.request({
					url: strUrl,
					method: 'POST',
					success: function() {
						popup.down('combo[itemId=inputValue]').getStore().reload();
						grid.refreshData();
					},
					failure: function() {
						Ext.Msg.alert("Error","Error while fetching data");
					}
				});										
			}
			
		});
