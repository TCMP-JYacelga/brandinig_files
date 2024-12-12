Ext.define('GCP.view.TypeCodeView', {
			extend : 'Ext.panel.Panel',
			xtype : 'typecodeview',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/typeCodeProfileDetailsForCPON.json';
				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							showPager : true,
							showAllRecords : false,
							pageSize : _GridSizeMaster,
							xtype : 'typeCodeList',
							itemId : 'typeCodeList',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							rowList :_AvailableGridSize,
							padding : '5 0 0 0',
							minHeight : 0,
							columnModel : colModel,
							storeModel : {
								fields : ['typeCode', 'typeDescription', 'typecodeLevel',
									'type', 'grid',
									'header'],
								proxyUrl : strUrl,
								rootNode : 'd.profileDetails',
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
							}
							
						});
				this.items = [adminListView];
				this.callParent(arguments);
			},

			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [{
							"colId" : "typeCode",
							"colDesc" : getLabel("lblBtrTypeCode","Type Code")
						}, {
							"colId" : "typeDescription",
							"colDesc" : getLabel("btrTypeCodeDesc","Description")
						}, {
							"colId" : "typecodeLevel",
							"colDesc" : getLabel("btrTypeCodeLevel","Level")
						}, {
							"colId" : "type",
							"colDesc" : getLabel("btrTypeCodeType","Type")
						}, {
							"colId" : "liquidity",
							"colDesc" : getLabel("btrTypeCodeLiq","Liquidity")
						}, {
							"colId" : "grid",
							"colDesc" : getLabel("grid","Grid")
						}, {
							"colId" : "header",
							"colDesc" : getLabel("btrTypeCodeHdr","Header")
						}];
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

					cfgCol.width = 120;
					cfgCol.fnColumnRenderer = me.columnRenderer;
					arrCols.push(cfgCol);
			}
		}
		return arrCols;
		},
		columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			var strRetValue = "";
			if (colId === 'col_grid' || colId === 'col_liquidity' || colId === 'col_header'){
				if(value === 'Y'){	
					strRetValue = getLabel('yes', 'Yes');
				}
				else{
					strRetValue = getLabel('no', 'No');
				}
			}
			else {
				strRetValue = value;
			}
				
		return strRetValue;
		},
		
		handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&$filter='+ typecode_profileid + '&$qparam=\'Y\'';
				grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
		},
		enableEntryButtons:function(){
			gridCountAfterRender++;
			enableDisableGridButtons(false);
		}
	});
