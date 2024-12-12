Ext.define('GCP.view.OverdueBucketGridView', {
	extend : 'Ext.panel.Panel',
	border : false,
	xtype : 'overdueBucketGridView',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.OverdueDtlPopup'],
	autoHeight : true,
	layout : 'vbox',
	config : {
	oldRecDays : 0
	},
	initComponent : function() {
		var me = this, grid = null;
				this.title = me.title;
				var strUrl = 'cpon/overdueProfileDtl.json';
				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : 5,
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '7 10 10 10',
							minHeight : 150,
							height : 250,
							showPager : false,
							columnModel : colModel,
							isRowIconVisible : me.isRowIconVisible,
							handleRowIconClick : function(tableView, rowIndex, columnIndex,
								btn, event, record) {
									me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
									event, record);
								},
							storeModel : {
								fields : ['overDueNo','overDueDesc','overDueDays','identifier','loanTypeActions'],
								proxyUrl : strUrl,
								rootNode : 'd.details',
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
				adminListView.getStore().on('load',function(store,records,successful, eOpts){
					var actualCount = store.getCount();
					for (var i = actualCount; i < 5; i++)
					{
						store.insert(i,{"overDueNo": i+1,"overDueDesc":"","fromDay":"","overDueDays":""});
					}			
					});
				
				adminListView.on('cellclick', function(view, td, cellIndex, record,
							tr, rowIndex, e, eOpts) {
						var linkClicked = (e.target.tagName == 'SPAN');
						if (linkClicked) {
							var className = e.target.className;
							if (!Ext.isEmpty(className)
									&& className.indexOf('defineLink') !== -1) {
								var frm = document.forms["frmMain"];
								frm.action = "addAVMSlab.form";
								frm.method = "POST";
								frm.target = "";
								frm.submit();
							}
							if (!Ext.isEmpty(className)
									&& className.indexOf('editLink') !== -1) {
								var frm = document.forms["frmMain"];
								frm.action = "editAVMSlab.form";
								frm.method = "POST";
								frm.target = "";
								frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
										'axmFrom', record.get('axmFrom')));
								frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
										'axmTo', record.get('axmTo')));
								frm.submit();
							}
						}
					});
		me.items = [ {
			xtype : 'panel',
			collapsible : true,
			width : '100%',
			cls : 'xn-ribbon ux_border-bottom',
			componentCls: 'gradiant_back',
			title : getLabel('overduebuckets', 'Overdue Buckets'),
			itemId : 'prfMstDtlView',
			items : [adminListView]
		}];

		me.on('resize', function() {
					me.doLayout();
				});

		me.callParent(arguments);
	},
	getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [
				{
					"colId" : "overDueNo",
					"colDesc" : getLabel("overdueBucketNo","Overdue Bucket #"),
					"colType" : "number",
						"sort":false
				}, {
					"colId" : "overDueDesc",
					"colDesc" : getLabel("prfMstDescription","Description"),
					"sort":false
				}, {
					"colId" : "fromDay",
					"colDesc" : getLabel("fromDay","From Day"),
					"colType" : "number",
					"sort":false
				}, {
					"colId" : "overDueDays",
					"colDesc" : getLabel("toDay","To Day"),
					"colType" : "number",
					"sort":false
				}];
			
			arrCols.push(me.createActionColumn());	
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
				cfgCol.sortable=objCol.sort;
				cfgCol.width = 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
				
			}
		}
		return arrCols;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			align : 'left',
			locked : true,
			items : [
					{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip',
								'Edit')
					},
					{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip',
								'View Record')
					} ]
		
		}
		return objActionCol;
		},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
		view, colId) {
		var me = this;
			if (colId === 'col_fromDay') {
				if (record.data.overDueNo == 1)
				{
					strRetValue = 1;
					me.oldRecDays = record.data.overDueDays;
				}
				else
				{
					if (!Ext.isEmpty(record.data.overDueDays))
						strRetValue = me.oldRecDays + 1;
						
						me.oldRecDays = record.data.overDueDays;
				}
			}
			else
				strRetValue = value;
			if(record.raw.updated === 1 && VIEW_MODE === 'VIEW_CHANGES')
				strRetValue='<span class="newFieldValue">'+strRetValue+'</span>';
			else if(record.raw.updated === 2 && VIEW_MODE === 'VIEW_CHANGES')
				strRetValue='<span class="modifiedFieldValue">'+strRetValue+'</span>';
			else if(record.raw.updated === 3 && VIEW_MODE === 'VIEW_CHANGES')
				strRetValue='<span class="deletedFieldValue">'+strRetValue+'</span>';	
			return strRetValue;
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var me = this;
		var totalRecords = store.totalCount;
		if(itmId === "btnEdit"){
			if(MODE=="EDIT"){
			if(record.data.overDueNo <= totalRecords+1 )
				return true;
			else 
				return false;
			}else
			return false;
		}
		if(itmId === "btnView")
		{
			if(record.data.overDueNo <= totalRecords )
				return true;
			else 
				return false;
		}
		
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var fromDay = adminListView.getStore().getAt(rowIndex-1);
		if(typeof(fromDay) === 'object'){
			fromDay = fromDay.data.overDueDays + 1;
		}else{
			fromDay = 1;
		}
		var nextToDay = adminListView.getStore().getAt(rowIndex+1);
		if((typeof(nextToDay) === 'object') && nextToDay.data.overDueDays !=""){
			nextToDay = nextToDay.data.overDueDays;
		}else{
			nextToDay = 0;
		}
		var OverdueDtlPopup = Ext.create('GCP.view.OverdueDtlPopup',{
					srNo : record.data.overDueNo,
					description : record.data.overDueDesc,
					toDay : record.data.overDueDays,
					fromDay : fromDay,
					productCode : productCode,
					sellerCode : sellerCode,
					nextToDay : nextToDay
					});
			if (btn.itemId == 'btnEdit')
				me.fireEvent('handleEditSelectedLoanTypes',record);				
			else
				me.fireEvent('handleViewSelectedLoanTypes',record);
	},		
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
			sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
				sorter);
		strUrl = strUrl + "&$orderby="+"overdue_no";		
		if(MODE === "VIEW")
		{
			strUrl = strUrl+ "&$select="+"OLD";
		}
		strUrl = strUrl+ "&id="+encodeURIComponent(parentkey);
		grid.loadGridData(strUrl, null, null, false);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}
});