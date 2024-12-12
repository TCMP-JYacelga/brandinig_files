Ext.define('GCP.view.ClientFSCPackageDetailsView', {
			extend : 'Ext.panel.Panel',
			xtype : 'packageDetails',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','GCP.view.EditAccount'],
			
			initComponent : function() {
				var me = this;
				this.title = me.title;
				var strUrl = 'cpon/clientServiceSetup/fscScmProductList.json';
				var colModel = me.getColumns();
				
				fscPackageListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							pageSize : _GridSizeMaster,
							xtype : 'profileListView',
							itemId : 'profileListView',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : false,
							rowList :_AvailableGridSize,
							padding : '0 0 3 0',
							minHeight : 0,
							columnModel : colModel,
							storeModel : {
					fields : ['productCode', 'productDescription','vendorDealerFlag', 'productWorkflow','financeProfileDesc','overDueProfileDesc','packageDesc','accountsFlag',
					'activeFlag','__metadata','requestStateDesc','identifier','updated'],
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
				fscPackageListView.on('cellclick', function(view, td, cellIndex, record,
						tr, rowIndex, e, eOpts) {
					if (td.className.match('x-grid-cell-col_accountsFlag')) {
						var productName = record.get('productDescription');
							var productCode = record.get('productCode');
							var accountDetailsPopup = Ext.create(
									'GCP.view.EditAccount', {
										itemId : 'packProductPopup',
										productName : productName,
										productCode : productCode		
									});
						
							var accountsCombos = accountDetailsPopup.query('combo');
							for(var i=0; i<accountsCombos.length ; i++){
								accountsCombos[i].setReadOnly (true);
							}
							
						var accountUrl =  'cpon/clientServiceSetup/cfAccountsList.json?$select='+'NEW';
						Ext.Ajax.request({
							url : accountUrl,
							method : 'POST',
							async : true,
							params: {
								'productCode': productCode,
								'id' : parentkey			
							},
							success : function(response) {
								var accountsCombos = accountDetailsPopup.query('combo');
								var accountInfo = Ext.decode(response.responseText);
								var preshipLoanAccFlag=accountInfo.preshipLoanAccFlag;
								var interestDebitAccFlag=accountInfo.interestDebitAccFlag;
								var invCollAccFlag=accountInfo.invCollAccFlag;
								var loanDisbAccFlag=accountInfo.loanDisbAccFlag;
								var invCollSuspAccFlag=accountInfo.invCollSuspAccFlag;
								var postshipLoanAccFlag=accountInfo.postshipLoanAccFlag;
								var actionFlag=accountInfo.updatedValues;
								var isLoanDisbAccAvailabe=accountInfo.isLoanDisbAccAvailabe;
						    	var isPreshipLoanAccAvailabe=accountInfo.isPreshipLoanAccAvailabe;
						    	var isInterestDebitAccAvailabe=accountInfo.isInterestDebitAccAvailabe;
						    	var isPostShipAccAvailabe=accountInfo.isPostShipAccAvailabe;
						    	var isServiceTaxAccAvailabe=accountInfo.isServiceTaxAccAvailabe;
						    	var isInvoiceCollAccAvailabe=accountInfo.isInvoiceCollAccAvailabe;
						    	var isInvoiceCollSuspAccAvailabe=accountInfo.isInvoiceCollSuspAccAvailabe;
						    	var isChargeAccAvailabe=accountInfo.isChargeAccAvailabe;
						    	var isEduCessAccAvailable=accountInfo.isEduCessAccAvailable;
								
								accountInfo = accountInfo.d;							
								 for(var i=0; i<accountInfo.length ; i++){
									for(var j=0; j<accountsCombos.length ; j++){
									if(accountInfo[i].accountName === accountsCombos[j].name){
											accountsCombos[j].setValue(accountInfo[i].accountNmbr);
										}
									}
								}
								 for(var j=0; j<accountsCombos.length ; j++){
										if(!Ext.isEmpty(isLoanDisbAccAvailabe) && accountsCombos[j].name==="CL_LOAN_DISB"){
											accountsCombos[j].hidden=true;
										}else if(!Ext.isEmpty(isPreshipLoanAccAvailabe) &&accountsCombos[j].name==="CL_PRE_LOAN") {
											accountsCombos[j].hidden=true;
										}else if(!Ext.isEmpty(isInvoiceCollSuspAccAvailabe) &&accountsCombos[j].name==="CL_INV_COSUS") {
											accountsCombos[j].hidden=true;
										}else if(!Ext.isEmpty(isInterestDebitAccAvailabe) &&accountsCombos[j].name==="CL_INT_DEBIT") {
											accountsCombos[j].hidden=true;
										}else if(!Ext.isEmpty(isPostShipAccAvailabe) &&accountsCombos[j].name==="CL_POS_LOAN") {
											accountsCombos[j].hidden=true;
										}else if(!Ext.isEmpty(isServiceTaxAccAvailabe) &&accountsCombos[j].name==="CL_CF_STAX") {
											accountsCombos[j].hidden=true;
										}else if(!Ext.isEmpty(isInvoiceCollAccAvailabe) &&accountsCombos[j].name==="CL_INV_COLL") {
											accountsCombos[j].hidden=true;
										}else if(!Ext.isEmpty(isChargeAccAvailabe) &&accountsCombos[j].name==="CL_COMM") {
											accountsCombos[j].hidden=true;
										}else if(!Ext.isEmpty(isEduCessAccAvailable) &&accountsCombos[j].name==="CL_CF_EDUCESS") {
											accountsCombos[j].hidden=true;
										}
									
								 }
								 
							   accountDetailsPopup.show();
						   },
							failure : function() {
								var errMsg = "";
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						});	

					}
				});
				this.items = [fscPackageListView];
				this.callParent(arguments);
			},

			getColumns : function() {
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				var arrColsPref = null;
				if(brandingPkgType === 'N'){
					arrColsPref = [{
								"colId" : "productDescription",
								"colDesc" : getLabel("fscScmProduct","SCF Package")
							}, {
								"colId" : "vendorDealerFlag",
								"colDesc" : getLabel("fscVenDel","Vendor/Dealer")
							},{
								"colId" : "financeProfileDesc",
								"colDesc" : getLabel("fscFinPrf","Finance Profile")
							},{
								"colId" : "packageDesc",
								"colDesc" : getLabel("fscPayMethod","Payment Method")
							},{
								"colId" : "accountsFlag",
								"colDesc" : getLabel("fscAccounts","Accounts"),
								"sortable" : false
							},{
								"colId" : "activeFlag",
								"colDesc" : getLabel("status","Status")
							}];
				}
				else if(brandingPkgType === 'Y'){
					arrColsPref = [{
								"colId" : "productDescription",
								"colDesc" : getLabel("fscScmProduct","SCF Package")
							}, {
								"colId" : "vendorDealerFlag",
								"colDesc" : getLabel("fscVenDel","Vendor/Dealer")
							},{
								"colId" : "financeProfileDesc",
								"colDesc" : getLabel("fscFinPrf","Finance Profile")
							},{
								"colId" : "packageDesc",
								"colDesc" : getLabel("fscPayMethod","Payment Method")
							},{
								"colId" : "activeFlag",
								"colDesc" : getLabel("status","Status")
							}];
			}
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
				cfgCol.sortable = objCol.sortable;
				cfgCol.width = 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
				
			}
		}
		return arrCols;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
		view, colId) {
		var strRetValue = "";'activeFlag';
		if (colId === 'col_activeFlag'){
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
		}else if (colId === 'col_accountsFlag'){
			if (!record.get('isEmpty')) {
			
				strRetValue = '<span class="underlined"></span>'
						+ '<span class="smallpadding_lr text_skyblue cursor_pointer">'
						+ getLabel('view', 'View') + '</span>';
				}
		}		
		else
		{
			strRetValue = value;
		}
				
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
