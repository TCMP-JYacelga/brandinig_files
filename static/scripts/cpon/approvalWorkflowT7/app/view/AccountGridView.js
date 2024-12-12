Ext.define('GCP.view.AccountGridView', {
			extend : 'Ext.panel.Panel',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			cls : 'xn-panel xn-no-rounded-border',
			xtype : 'accountGridView',
			initComponent : function() {

				var me = this;
				this.title = me.title;
				var strUrl = 'services/approvalMatrixWorkflowDetailList.json';
				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							itemId : 'accountGrid',
							showCheckBoxColumn : false,
							padding : '12 0 0 0',
							cls:'t7-grid',
							minHeight : 'auto',
							maxHeight : 200,
							showPager : false,
							columnModel : colModel,
							enableColumnAutoWidth : false,
							enableColumnHeaderMenu : false,
							headerDockedItems : null,
							handleMoreMenuItemClick : function(view, rowIndex, cellIndex, menu,
									eventObj, record) {
								var btn = null;
								if( menu.itemId =='btnDelete' ){
									btn = 'delete';
									me.fireEvent('handleRowIconClick', btn, record);
								}else if( menu.itemId =='btnEdit' ){
									btn = 'edit';
									me.fireEvent('handleRowIconClick', btn, record);
								}
							},							
							storeModel : {
								fields : ['accountNmbrDesc', 'accountName','customAxmCode','accountNmbr',
										'axmName', 'identifier','approverCount','displayField','accountCcyCode'],
								proxyUrl : strUrl,
								rootNode : 'd.accounts',
								totalRowsNode : 'd.__count'
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
								},
								boxready : function() {
									this.doLayout();	
								},
								cellclick : function(view, td, cellIndex, record,
												tr, rowIndex, e, eOpts) {/*
									var IconLinkClicked = (e.target.tagName == 'A');	
									if(IconLinkClicked){
										var className = e.target.className;
										var btn = null;
										if(className=='grid-row-action-icon icon-delete'){
											btn = 'delete';
											me.fireEvent('handleRowIconClick', btn, record);
										}else if(className=='grid-row-action-icon icon-edit'){
											btn = 'edit';
											me.fireEvent('handleRowIconClick', btn, record);
										}else{
										 
										}
									}
								*/}
							}/*,

							isRowIconVisible : me.isRowIconVisible*/
						});
						
				if (entryType != 'VIEW')
				{
					this.items = [/*{
					xtype : 'toolbar',
					itemId : 'btnCreateNewToolBar',
					cls : ' ux_panel-transparent-background',
					items : ['->', {
						xtype : 'button',
						border : 0,
						text : getLabel('addaccout',
								'Add Account with Specific Authorization Matrix'),
						cls : 'cursor_pointer',
						parent : this,
						padding : '4 0 1 0',
						itemId : 'btnCustomizeAccount',
						handler : function() {
							 me.fireEvent('addAccountAssignmentPopup');
						}
					}]
				}, */adminListView];
				}
				else
				{
					this.items = [adminListView];
				}

				

				this.callParent(arguments);
			},

			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [{
							"colId" : "displayField",
							"colDesc" : getLabel('account','Account'),
							"sortable" : false,
							"menuDisabled": false,
                            "draggable" : false,
                            "width" : 400
						}, {
							"colId" : "accountName",
							"colDesc" : getLabel('accountname', 'Account Name'),
							"sortable" : false,
							"menuDisabled": false,
                            "draggable" : false,
                            "width" : 300
						}, {
							"colId" : "axmName",
							"colDesc" : getLabel('approvalmatrix', 'Approval Matrix'),
							"sortable" : false,
							"menuDisabled": false,
                            "draggable" : false,
                            "width" : 300
						}];
				if (entryType != 'VIEW')
					arrCols.push(me.createActionColumn())
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.sortable = objCol.sortable;
						cfgCol.menuDisabled = objCol.menuDisabled;
						cfgCol.width = objCol.width;
						if (!Ext.isEmpty(objCol.colType)) {
							cfgCol.colType = objCol.colType;
							if (cfgCol.colType === "number")
								cfgCol.align = 'right';
						}

						//cfgCol.width = 120;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);

					}
				}
				return arrCols;
			},

			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				strUrl = strUrl + "&$filter=" + encodeURIComponent(matrixId);
				strUrl = strUrl + "&$qParam=0";
				grid.loadGridData(strUrl, me.postHandleLoadGridData, null, false, me);
			},
			
			postHandleLoadGridData : function() {
				var me = this;
				me.enableEntryButtons();
				$(document).trigger('gridDataLoaded', ['accountGrid']);
			},
			
			enableEntryButtons : function() {
				accountGridRender = true;
				disableGridButtons(false);
			},
			
			createFormField : function(element, type, name, value) {
				var inputField;
				inputField = document.createElement(element);
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},
/*			createActionColumn : function() {

				var objActionCol = {
					colId : 'action',
					colHeader : 'Actions',
					width : 80,
					locked : true,
					sortable : false,
					fnColumnRenderer: function(value, metaData, record,
											rowIndex, colIndex, store){ 
						return '<a class="grid-row-action-icon icon-delete" title="Delete"></a>'
						+' '+'<a class="grid-row-action-icon icon-edit" title="Edit"></a>';
					}
				};
				return objActionCol;
			},
*/			
			createActionColumn : function()
			{
					var objActionCol =
					{
						colType : 'actioncontent',
						colId : 'actioncontent',
						colHeader : getLabel('action', 'Actions'),
						visibleRowActionCount : 1,
						width : 108,
						locked : true,
						lockable : false,
						sortable : false,
						hideable : false,
						resizable : false,
						draggable : false,
						items :
						[
						 	{
								itemId : 'btnEdit',
								itemCls : 'grid-row-action-icon icon-edit',
								toolTip : getLabel('editToolTip', 'Edit Record'),
								text : getLabel('editToolTip', 'Edit Record')
							},
							{
								itemId : 'btnDelete',
								itemCls : 'grid-row-action-icon icon-view',
								toolTip : getLabel('deleteToolTip', 'Delete Record'),
								text : getLabel('deleteToolTip', 'Delete Record')
							}
						 ]
					};							
				return objActionCol;
			},

			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
					view, colId) {
				var strRetValue = "";
				if (colId === 'col_axmName') {
					if (!Ext.isEmpty(record.get('customAxmCode')) && record.get('customAxmCode') == 'MAKERCHECKER') {
						strRetValue = getLabel('makerchecker','Maker-Checker');
					}
					else
						strRetValue = value;
				}
				else
					strRetValue = value;
				
				meta.tdAttr = 'title="' + strRetValue + '"';
				return strRetValue;
			}

		});
