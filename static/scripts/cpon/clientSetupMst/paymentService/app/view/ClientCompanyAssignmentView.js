Ext.define('CPON.view.ClientCompanyAssignmentView', {
			extend : 'Ext.panel.Panel',
			xtype : 'clientCompanyAssignmentView',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			//width : 470,
			cls : 'non-xn-popup',
			autoHeight : true,
			modal : true,
			minHeight : 200,
			width : 450,
			draggable : false,
			autoScroll : true,
			config : {
				packageId : null,
				id :null
			},
			listeners : {
				'resize' : function(){
					this.center();
				}
			},
			initComponent : function() {
				var me = this;
				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							cls : 't7-grid',
							checkBoxColumnWidth : _GridCheckBoxWidth,
							itemId : 'companygridItemId',
							stateful : false,
							showEmptyRow : false,
							checkboxId:'chkAllCompanySelectedFlag',
							minHeight : 150,
							padding : '5 0 0 0',
							//rowList : [ 5, 10, 15, 20, 25, 30 ],
							columnModel : colModel,
							hideRowNumbererColumn : true,
							storeModel : {
								fields : ['companyId','identifier','companyName','assigned','recordKeyNo','updated'],
								proxyUrl : 'cpon/clientServiceSetup/availableCompanyList.json',
								rootNode : 'd.accounts',
								totalRowsNode : 'd.__count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								select : me.addSelected,
								deselect : me.removeDeselected,
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

				me.items = [{
					xtype : 'container',
					layout : 'hbox',
					items : [
						/*{
							xtype : 'button',
							itemId : 'btnSearchPackage',
							text : getLabel('search', 'Search'),
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							margin : '0 0 0 15',
							handler : function() {
								me.searchPackages();
							}
						}*/
					]
				},adminListView];
				
		/*		me.bbar = [ {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							//glyph : 'xf056@fontawesome',
							handler : function() {
								me.close();
							}
				},'->',
							{
							xtype : 'button',
							text : getLabel('submit', 'Submit'),
							itemId : 'savebtn',
							//glyph : 'xf058@fontawesome',
							handler : function() {
								var records = selectedCompanies;
								this.fireEvent("assignCompany",records,me.id);
								selectedCompanies = [];
							}
						}];*/
				me.callParent(arguments);
			},
			
			addSelected : function(row, record, index, eopts) {
				var allreadyPresent = false;
					for ( var i = 0; i < selectedCompanies.length; i++) {
						if (selectedCompanies[i].data.companyId === record.data.companyId) {
							allreadyPresent = true;
							break;
						}
					}
					if (!allreadyPresent) {
						selectedCompanies.push(record);
						record.raw.isAssigned = true;
						allreadyPresent = false;
					}
				},

				removeDeselected : function(row, record, index, eopts) {
					var index = -1;
					for ( var i = 0; i < selectedCompanies.length; i++) {
						if (selectedCompanies[i].data.companyId === record.data.companyId) {
							index = i;
							break;
						}
					}
					if (index > -1) {
						selectedCompanies.splice(index, 1);
					}
				},
			getColumns : function() {
				arrColsPref = [{
							"colId" : "companyId",
							"colDesc" :  getLabel('companyId','Company ID')
						},{
							"colId" : "companyName",
							"colDesc" :  getLabel('companyName','Company Name')
						}];
				objWidthMap = {
					"companyId" : 150,
					"companyName" : 200
				};
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
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

			
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = grid.up('clientCompanyAssignmentView');
				grid.packageId = me.packageId;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&accountId='+$("#accountId").val();
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
			},

			updateSelection : function(grid, responseData, args) {
			
				var me = this;
				var selectAll = args.selectAllCheckBox;
				var checkBoxEle = document.getElementById(me.checkboxId);
				if (!Ext.isEmpty(grid)) {
				
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						if (!Ext.isEmpty(items)) {
							var selectedCompaniesecords = new Array();
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								if (item.data.assigned) {
									selectedCompaniesecords.push(item)
								}
								else if(!Ext.isEmpty (checkBoxEle) && checkBoxEle.getAttribute('src').indexOf('/icon_checked')!=-1)
								{
									selectedCompaniesecords.push(item)
								}
							}
							grid.getSelectionModel().setLocked(false);
							if (selectedCompaniesecords.length > 0)
								grid.getSelectionModel()
										.select(selectedCompaniesecords);
						}
					}
				}
				if(viewmode == 'VIEW'  || viewmode == "MODIFIEDVIEW" || viewmode == "VERIFY"){
					grid.getSelectionModel().setLocked(true);
				}
			}
			
		});
