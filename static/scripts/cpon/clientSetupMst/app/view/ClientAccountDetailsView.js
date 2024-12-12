Ext.define('GCP.view.ClientAccountDetailsView', {
			extend : 'Ext.panel.Panel',
			xtype : 'accountList',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.util.Point'],
			views : ['GCP.view.VerifyPaymentPkgPopupView'],
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/accountList.json';
				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : _GridSizeMaster,
							xtype : 'profileListView',
							itemId : 'profileListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							multiSort : false,
							padding : '0 0 3 0',
							rowList :_AvailableGridSize,
							minHeight : 0,
							columnModel : colModel,
							storeModel : {
								fields : ['identifier', 'bankDesc', 'acctNmbr','orgAccName', 'ccyCode','packageCount','accountId',
								          'acctUsageBr', 'acctUsagePay', 'activeFlag', 'acctUsageColl','acctUsagePooling', 'acctUsageSweeping','acctUsageFSC','acctUsageForecast','receivablePackageCount','shortAccountNo','transactionCode','acctUsageSubAccounts','defaultDebitAcc'],
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
				adminListView.on('cellclick', function(view, td, cellIndex, record,
						tr, rowIndex, e, eOpts) {	
					if (td.className.match('x-grid-cell-col_acctUsagePay'))
					{
						var pkgDetails = null;
						var pkgDetails = Ext.create(
								'GCP.view.VerifyPaymentPkgPopupView', {
									itemId : 'verifyPaymentPkgPopupView',
									title : getLabel('paymentMethod','Payment Package Name'),
									packageId : record.get('accountId'),
									id : parentkey,
									mode : 'LIST',
									srvcCode : '02'
								});
						pkgDetails.show();
					}
					else if (td.className.match('x-grid-cell-col_acctUsageColl'))
					{
						var pkgDetails = null;
						var pkgDetails = Ext.create(
								'GCP.view.VerifyPaymentPkgPopupView', {
									itemId : 'verifyReceivablePkgPopupView',
									title : getLabel('collectionMethodName','Receivables Method Name'),
									packageId : record.get('accountId'),
									id : parentkey,
									mode : 'LIST',
									srvcCode : '05'
								});
						pkgDetails.show();
					}
				});
			},

			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = [{
					"colId" : "bankDesc",
					//"colDesc" : getLabel('lblAcctSysBank','System Bank'),
					"colDesc" : me.getAdditionalInfoLabel('systemBank', 'System Bank')
				}, {
					"colId" : "acctNmbr",
					//"colDesc" : getLabel('lblAcctNumber','Account'),
					"colDesc" : me.getAdditionalInfoLabel('acctNmbr', 'Account')
				}, {
					"colId" : "shortAccountNo",
					//"colDesc" : getLabel('shortActNmbr','Short Account Number'),
					"colDesc" : me.getAdditionalInfoLabel('shortActNmbr', 'Short Account Number')
				},{
					"colId" : "transactionCode",
					"colDesc" : me.getAdditionalInfoLabel('transactionCode', 'Transaction Code'),
					"sortable":true
				},{
					"colId" : "orgAccName",
					//"colDesc" : getLabel('lblAcctName','Account Name'),
					"colDesc" : me.getAdditionalInfoLabel('orgAccName', 'Account Name'),
					 hidden:true
				}, {
					"colId" : "ccyCode",
					//"colDesc" : getLabel('ccy','CCY'),
					"colDesc" : me.getAdditionalInfoLabel('ccyCode', 'Currency')
				}];
		if (isBrEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageBr",
					"colDesc" : getLabel('br','BR')
				}
			);
		}
		if (isPaymentEnable == 'true')
		{
			arrColsPref.push(  {
					"colId" : "acctUsagePay",
					"colDesc" : getLabel('payment','Payment')
				}
			);
			
			arrColsPref.push(  {
				"colId" : "defaultDebitAcc",
				"colDesc" : getLabel('lblDefaultDebitAccount', 'Default Debit Account')				
				}
			);
		}
		if (isCollEnable == 'true')
		{
			arrColsPref.push(  {
					"colId" : "acctUsageColl",
					"colDesc" : getLabel('collection','Receivables')
				}
			);
		}
		if (isLiquidityEnable == 'true')
		{
			arrColsPref.push(  {
					"colId" : "acctUsagePooling",
					"colDesc" : getLabel("pooling","Pooling")
				}
			);
			arrColsPref.push(  {
				"colId" : "acctUsageSweeping",
				"colDesc" : getLabel("lblSweeping","Sweeping")
				}
			);
		}
		if (isFscEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageFSC",
					"colDesc" : getLabel("lblFsc","SCF")
				}
			);
		}
		
		if (isForecastEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageForecast",
					"colDesc" : getLabel("lblForecast","Cashflow Forecast")
				}
			);
		}
		if (isSubAccountEnable == 'true')
		{
			arrColsPref.push( {
					"colId" : "acctUsageSubAccounts",
					"colDesc" : getLabel('lblSubAccount', 'SubAccount'),
					"sortable":true
				}
			);
		}
			arrColsPref.push( {
					"colId" : "activeFlag",
					"colDesc" : getLabel("status","Status")
				}
			);
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.hidden = objCol.hidden;
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
	
	// getAdditionalInfoLabel	
	getAdditionalInfoLabel : function(fieldId , label)	{
		
		if( ADDITIONAL_INFO_BASE_GRID == null || ADDITIONAL_INFO_BASE_GRID == '' )
			return getLabel(fieldId, label);
			var labelFound = false;
			
		for( index = 0 ; index < ADDITIONAL_INFO_BASE_GRID.length ; index++ )
		{
			var columnid = ADDITIONAL_INFO_BASE_GRID[ index ].javaName;			
			if(columnid == fieldId )
			{
				console.log( 'Label Found for : ' + fieldId);
				labelFound = true;
				return ADDITIONAL_INFO_BASE_GRID[ index ].displayName;
				break ;
			}
		}
		if(!labelFound)
			return getLabel(fieldId, label);
	},
	
	

			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			var strRetValue = "";'acctUsageBr', 'acctUsagePay', 'activeFlag', 'acctUsageColl', 'acctUsagePooling','acctUsageSweeping','acctUsageFSC','acctUsageForecast','transactionCode','acctUsageSubAccounts'
			
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
				if(record.get('packageCount') > 0 )
				{
					strRetValue = strRetValue + '(<span class="underlined cursor_pointer">' +  record.get('packageCount') + '</span>)';
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
				if(record.get('receivablePackageCount') > 0 && "Y" == record.get('acctUsageColl'))
				{
					strRetValue = strRetValue + '(<span class="underlined cursor_pointer">' +  record.get('receivablePackageCount') + '</span>)';
				}
			}
		}
		else if (colId === 'col_acctUsagePooling') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsagePooling')) && "Y" == record.get('acctUsagePooling'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsagePooling')) && "N" == record.get('acctUsagePooling'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		}
		else if (colId === 'col_acctUsageSweeping') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageSweeping')) && "Y" == record.get('acctUsageSweeping'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageSweeping')) && "N" == record.get('acctUsageSweeping'))
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
		    else if (colId === 'col_acctUsageForecast') 
		{
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('acctUsageForecast')) && "Y" == record.get('acctUsageForecast'))
				{
					strRetValue = getLabel('yes','Yes');
				}
				else if (!Ext.isEmpty(record.get('acctUsageForecast')) && "N" == record.get('acctUsageForecast'))
				{
					strRetValue = getLabel('no','No');
				}
			}
		    }
		    else if (colId === 'col_transactionCode') 
			{
				if (!record.get('isEmpty')) {
					if (!Ext.isEmpty(record.get('transactionCode')) && "0" == record.get('transactionCode'))
					{
						strRetValue = "";
					}
					else
					{
						strRetValue = value;
					}
					
				}
			}
		    else if (colId === 'col_acctUsageSubAccounts') 
			{
				if (!record.get('isEmpty')) {
					if (!Ext.isEmpty(record.get('acctUsageSubAccounts')) && "Y" == record.get('acctUsageSubAccounts'))
					{
						strRetValue = getLabel('yes','Yes');
					}
					else if (!Ext.isEmpty(record.get('acctUsageSubAccounts')) && "N" == record.get('acctUsageSubAccounts'))
					{
						strRetValue = getLabel('no','No');
					}
				}
			}
		    else if (colId === 'col_defaultDebitAcc') 
			{
				if (!record.get('isEmpty')) {
					if (!Ext.isEmpty(record.get('defaultDebitAcc')) && "Y" == record.get('defaultDebitAcc'))
					{
						strRetValue = getLabel('yes','Yes');
					}
					else if (!Ext.isEmpty(record.get('defaultDebitAcc')) && "N" == record.get('defaultDebitAcc'))
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
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		gridCountAfterRender++;
		enableDisableGridButtons(false);
	}
});
