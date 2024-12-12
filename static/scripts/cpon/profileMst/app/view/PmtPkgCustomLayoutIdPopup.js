Ext.define('GCP.view.PmtPkgCustomLayoutIdPopup', {
			extend : 'Ext.window.Window',
			xtype : 'pmtPkgCustomLayoutIdPopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			modal : true,
			draggable : true,
			closeAction : 'hide',
			autoScroll : true,
			title : getLabel("custLayId","Custom Layout Id"),
			customSelected:'',
			config : {
				columnName : null,
				strUrl : null,
				actionUrl : null,
				filterUrl : null
			},

			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				packageFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					padding : '1 0 0 0',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					itemId : 'packageFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'adminFeatureProfileSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							xtype : 'profileListView',
							itemId : 'profileListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '5 0 0 0',
							minHeight : 150,
							pageSize : 5,
							showPager : true,
							rowList : [5, 10, 20, 30],
							columnModel : colModel,
							storeModel : {
								fields : ['name','value'],
								proxyUrl : 'cpon/cponCustomIds.json',
								rootNode : 'd.filter',
								totalRowsNode : 'd.count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {
							}

						});

				me.items = [adminListView];
				adminListView.on('cellclick',function(view, td, cellIndex, record,
							tr, rowIndex, e, eOpts) {
							if (e.target.tagName == 'INPUT'
								&& e.target.name.trim() == 'defaultCustRadio') {
								if (undefined != e.target.name) {
									me.customSelected = record.get('name');
								}
							}
						
					});
				me.buttons = [ {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							cls : 'xn-button',
							handler : function() {
								me.hide();
							}
						},{
							xtype : 'button',
							text : getLabel('ok', 'OK'),
							cls : 'xn-button',
							handler : function() {
								me.saveData();
							}
						}];
				me.callParent(arguments);
			},
			
			saveData : function() {
				var me = this;
				document.getElementById('customLayoutId').value = me.customSelected;
				$('#custLabel').text(me.customSelected);
				this.close();
			},

			getColumns : function() {
				var	arrColsPref = [{
								colId : 'name',
								colHeader : '',
								width : 30,
								
								fnColumnRenderer : function(name,
										metaData, record, rowIndex, colIndex) {
									var retVal = null;
									var custLayId = record.get('name');
									var strChecked ='';
									var isAsssigned = false;
									if(customLayoutId == custLayId)
									{
										isAsssigned = true;
										strChecked = 'checked';
									}
									if(modeVal == "VIEW" || modeVal == "VERIFY")
									{
										if (isAsssigned) {
											retVal = '<input type="radio" name="defaultCustRadio" id = "radio_'
													+ rowIndex
													+ '" checked="'
													+ strChecked
													+ '"'
													+ ' disabled="true">';
										} else {
											retVal = '<input type="radio" name="defaultCustRadio" id = "radio_'
													+ rowIndex
													+ '"'
													+ ' disabled="true">';
										}
									}
									else
									{
										if (isAsssigned) {
											retVal = '<input type="radio" name="defaultCustRadio" id = "radio_'
													+ rowIndex
													+ '" checked="'
													+ strChecked
													+ '">';
										} else {
											retVal = '<input type="radio" name="defaultCustRadio" id = "radio_'
													+ rowIndex
													+ '"';
										}
									}
									return retVal;
								}
							},
							{
								colId : 'value',
								colHeader : getLabel('custLayout','Custom Layout'),
								width : 330
							}];
				var me = this;
				
				return arrColsPref;
			},

			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
				var strRetValue = "";
				
				if (colId === 'col_value'){
					
					strRetValue = '<span class="activitiesLink underlined cursor_pointer">'+value+'</span>';
				} else {
					strRetValue = value;
				}

				return strRetValue;
			},
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				if (!Ext.isEmpty(packageFilterfield.getValue()))
				{
					strUrl = strUrl + '&qfilter='+ packageFilterfield.getValue();
				}
				grid.loadGridData(strUrl, null, null, false);
			},
			
			
			createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	searchPackages : function()
	{
		adminListView.refreshData();	
	}
		});
