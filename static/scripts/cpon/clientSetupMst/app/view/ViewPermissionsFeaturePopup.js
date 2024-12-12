Ext.define('GCP.view.ViewPermissionsFeaturePopup', {
			extend : 'Ext.window.Window',
			xtype : 'adminFeaturePopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			minHeight : 156,
			maxHeight : 550,
			cls : 'non-xn-popup',
			modal : true,
			draggable : false,
			resizable : false,
			closeAction : 'hide',
			//autoScroll : true,
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null,
				title : null,
				isAllSelected : null
			},
			listeners : {
				resize : function(){
					this.center();
				}
			},
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/cponPermissionFeatures';
				var colModel = me.getColumns();

				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							showPager : false,
							pageSize : 5,
							rowList : _AvailableGridSize,
							showAllRecords : true,
							xtype : 'adminFeatureView',
							itemId : 'adminFeatureViewId',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							minHeight : 50,
							maxHeight : 420,
							scroll : 'vertical',
							cls : 't7-grid',
							columnModel : colModel,
							storeModel : {
								fields : ['name', 'isAssigned', 'value',
										'isAutoApproved', 'profileId','readOnly'],
								proxyUrl : strUrl,
								rootNode : 'd.filter',
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
								}
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});

				this.items = [adminListView];
				this.bbar = ['->', {
							xtype : 'button',
							text : getLabel('btnClose', 'Close'),
							handler : function() {
								me.close();
							}
						}];
				this.callParent(arguments);
			},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "name",
							"colDesc" : getLabel('privileges', 'Privileges')
						}];
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.width = 160;
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
					}
				}
				if(viewmode == 'VIEW'  || viewmode =="MODIFIEDVIEW" || pagemode == "VERIFY"){
					arrCols.push(me.createViewAssingedActionColumn());
					arrCols.push(me.createViewAutoApproveActionColumn());
				}
				return arrCols;
			},
			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
				view, colId) {
				var strRetValue = "";
				if(record.raw.updated === 1 && viewmode === 'MODIFIEDVIEW')
					strRetValue='<span class="newFieldValue">'+value+'</span>';
				else if(record.raw.updated === 2 && viewmode === 'MODIFIEDVIEW')
					strRetValue='<span class="modifiedFieldValue">'+value+'</span>';
				else if(record.raw.updated === 3 && viewmode === 'MODIFIEDVIEW')
					strRetValue='<span class="deletedFieldValue">'+value+'</span>';
				else 
					strRetValue = value;
				
				return strRetValue;
			},
	
			createViewAssingedActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAssigned',
					colHeader : getLabel('assigned', 'Assigned'),
					width : 70,
					align : 'center',
					items : [{
						itemId : 'isAssigned',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (record.data.isAssigned === true) {
									var iconClsClass = 'icon-checkbox-checked';
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked';
									return iconClsClass;
								}
							}
						}
					}]
				};
				return objActionCol;
			},

			createViewAutoApproveActionColumn : function() {
				var me = this;
				var objActionCol = {
					colType : 'action',
					colId : 'isAutoApproved',
					colHeader : getLabel('autoapprove', 'Auto Approve'),
					width : 75,
					align : 'center',
					items : [{
						itemId : 'isAutoApproved',
						fnIconRenderer : function(value, metaData, record,
								rowIndex, colIndex, store, view) {
							if (!record.get('isEmpty')) {
								if (record.data.isAutoApproved === true) {
									var iconClsClass = 'icon-checkbox-checked';
									return iconClsClass;
								} else {
									var iconClsClass = 'icon-checkbox-unchecked';
									return iconClsClass;
								}
							}
						}
					}]
				};
				return objActionCol;
			},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				if (!Ext.isEmpty(me.profileId)) {
					var url = Ext.String.format(
							'&featureType={0}&module={1}&profileId={2}',
							me.featureType, me.module, me.profileId);
					strUrl = strUrl + url;
				} else {
					var url = Ext.String.format('&featureType={0}&module={1}',
							me.featureType, me.module);
					strUrl = strUrl + url;
				}
				if (me.isAllSelected == "Y") {
					strUrl = strUrl + '&isAllSelected=Y';
				}
				// isCustomReportHideFlag flag to hide/unhide Custom report option on popup 
				if( isCustomReportHideFlag == "Y")
				{
					strUrl = strUrl + '&isCustomReportHideFlag=Y';
				}
				// isReportCenterHideFlag flag to hide/unhide Report Center option on popup 
				if( isReportCenterHideFlag == "Y")
				{
					strUrl = strUrl + '&isReportCenterHideFlag=Y';
				}
				
				grid.loadGridData(strUrl, null, null, false);
			}
		});