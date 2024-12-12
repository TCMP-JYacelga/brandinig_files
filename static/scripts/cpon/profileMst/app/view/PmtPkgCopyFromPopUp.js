Ext.define('GCP.view.PmtPkgCopyFromPopUp', {
			extend : 'Ext.window.Window',
			xtype : 'pmtPkgCopyFromPopUp',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
			width : 450,
			maxWidth : 735,
			//height : 300,
			minHeight : 156,
			maxHeight : 550,
			cls : 'non-xn-popup',
			modal : true,
			draggable : false,
			resizable : false,
			closeAction : 'destroy',
			//autoScroll : true,
			searchVal : '',
			config : {
				fnCallback : null,
				profileId : null,
				featureType : null,
				module : null,
				title : null
			},
			listeners : {
				'resize' : function(){
					this.center();
				}
			},
			initComponent : function() {
				var me = this;
				this.title = me.title;

				var strUrl = 'cpon/paymentPackageProfileMst.json'

				var colModel = me.getColumns();
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							showPager : false,
							showAllRecords : true,
							xtype : 'copyFromPkgView',
							itemId : 'copyFromPkgId',
							stateful : false,
							showEmptyRow : false,
							showCheckBoxColumn : true,
							hideRowNumbererColumn : true,
							minHeight : 40,
							maxHeight : 390,
							scroll : 'vertical',
							width : 'auto',
							columnModel : colModel,
							storeModel : {
								fields : ['packageId','packageName','identifier',
										'profileType','parentRecordKey',
										'version', 'recordKeyNo'],
								proxyUrl : strUrl,
								rootNode : 'd.profile',
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

				this.items = [{
					xtype : 'panel',
					layout : 'hbox',
					cls:'ft-padding-bottom',
					items : [{
								xtype : 'textfield',
								itemId : 'copyPkgText',
								//fieldLabel : getLabel('payMethod', 'Payment Method'),
								emptyText : getLabel("packProfSearchByPayMethod","Search by Payment Package"),
								fieldCls : 'textfield-input',
								labelSeparator : '',
								labelAlign : 'left',
								height : 30,
								width : 200,
								listeners : {
									change : function(field, newValue) {
										field.setValue(newValue.toUpperCase());
									}
								}
							}, {
								xtype : 'button',
								text : getLabel('filter', 'Filter'),
								itemId : 'btnFilterPkg',
								cls : 'ft-button-primary',
								margin : '3 0 0 12'
							}]
				}, adminListView];
				this.bbar = [{
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							itemId : 'btnCancelCopyPkgPopUp',
							handler : function() {
								me.close();
							}
						},'->',
						{
							xtype : 'button',
							text : getLabel('btnDone','Done'),//getLabel('ok', 'Ok'),
							itemId : 'btnOkCopyPkgPopUp'
						}];
				this.callParent(arguments);
			},
			getColumns : function() {
				arrColsPref = [{
							"colId" : "packageName",
							"colDesc" : getLabel("prfPkgPayMethod","Payment Package")
						}, {
							"colId" : "profileType",
							"colDesc" : getLabel("prfPkgPrfType","Profile Type")
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
						arrCols.push(cfgCol);
					}
				}
				return arrCols;
			},
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = grid.up('pmtPkgCopyFromPopUp');
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
				var instQuery = '';
				var defaultFilter = 'valid_flag eq \'Y\' and request_state eq 3 ';
				var productCatCode = $('#paymentType').find('option:selected').val();
				
				if (productCatCode) 
				{
                     if (productCatCode == 'Mixed' || productCatCode == 'MIXED') productCatCode = "%25";
                } 
                else 
                {
                     productCatCode = "%25";
                }
				if (!Ext.isEmpty(me.searchVal)) {
					instQuery = Ext.String.format(
							"and packageName lk '{0}' ",
							 me.searchVal.toLowerCase());
					defaultFilter = defaultFilter + instQuery;
				}
				strUrl = strUrl + '&$filter=' + defaultFilter+'&$prodCat=' + productCatCode ;
				grid.loadGridData(strUrl, null,null,false);
			},
			setSearchValue : function(textValue) {
				var me = this;
				me.searchVal = textValue;
			}
		});