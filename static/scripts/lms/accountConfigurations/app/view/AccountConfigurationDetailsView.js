Ext.define('GCP.view.AccountConfigurationDetailsView', {
			extend : 'Ext.panel.Panel',
			xtype : 'accountList',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/accountList.json';
				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : 5,
							xtype : 'profileListView',
							itemId : 'profileListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							padding : '5 0 0 0',
							minHeight : 0,
							columnModel : colModel,
							storeModel : {
								fields : ['identifier', 'bankDesc', 'acctNmbr', 'ccyCode',
					'acctUsageBr', 'acctUsagePay', 'activeFlag', 'acctUsageColl','acctUsageLMS','acctUsageFSC'],
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
								}
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});
				this.items = [adminListView];
				this.callParent(arguments);
			},

			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [{
					"colId" : "bankDesc",
					"colDesc" : getLabel('bank', 'Bank')
				}, {
					"colId" : "acctNmbr",
					"colDesc" : getLabel('accountNmbr', 'Account')
				}, {
					"colId" : "ccyCode",
					"colDesc" : getLabel('ccy', 'CCY')
				}, {
					"colId" : "acctUsageBr",
					"colDesc" : getLabel('brlbl', 'BR')
				}, {
					"colId" : "acctUsagePay",
					"colDesc" : getLabel('payment', 'Payment')
				},{
					"colId" : "acctUsageColl",
					"colDesc" : getLabel('collectionlbl', 'Receivables')
				},{
					"colId" : "acctUsageLMS",
					"colDesc" : getLabel('lmslbl', 'LMS')
				},{
					"colId" : "acctUsageFSC",
					"colDesc" : getLabel('fsclbl', 'SCF')
				}, {
					"colId" : "activeFlag",
					"colDesc" : getLabel('status', 'Status')
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
			var strRetValue = "";'acctUsageBr', 'acctUsagePay', 'activeFlag', 'acctUsageColl','acctUsageLMS','acctUsageFSC'
			
		if (colId === 'col_acctUsageBr')
			{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageBr')) && "Y" == record.get('acctUsageBr'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageBr')) && "N" == record.get('acctUsageBr'))
				{
					strRetValue = getLabel('no','No');
				}
			}
			}
		else if (colId === 'col_acctUsagePay') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsagePay')) && "Y" == record.get('acctUsagePay'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsagePay')) && "N" == record.get('acctUsagePay'))
				{
					strRetValue = getLabel('no','No');
				}
			}
			}
		else if (colId === 'col_activeFlag') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('activeFlag')) && "Y" == record.get('activeFlag'))
				{
					strRetValue = getLabel('active','Active');
				}
				else if (!Ext.isEmpty(record.get('activeFlag')) && "N" == record.get('activeFlag'))
				{
					strRetValue = getLabel('inactive','Inactive');
				}
			}
			}
		else if (colId === 'col_acctUsageColl') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageColl')) && "Y" == record.get('acctUsageColl'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageColl')) && "N" == record.get('acctUsageColl'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		}
		else if (colId === 'col_acctUsageLMS') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageLMS')) && "Y" == record.get('acctUsageLMS'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageLMS')) && "N" == record.get('acctUsageLMS'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		}
		else if (colId === 'col_acctUsageFSC') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageFSC')) && "Y" == record.get('acctUsageFSC'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageFSC')) && "N" == record.get('acctUsageFSC'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		    }
		else
		{
			strRetValue = value;
		}
		/*if(record.raw.isUpdated === true)
				strRetValue='<span class="color_change">'+strRetValue+'</span>';*/
		return strRetValue;
	},
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				grid.loadGridData(strUrl, null, null, false);
			}
		});
