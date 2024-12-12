var selectedpk = new Array();
Ext.define('CPON.view.AttachPackagePopup', {
			extend : 'Ext.window.Window',
			xtype : 'attachPackagePopup',
			requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store','Ext.ux.gcp.AutoCompleter'],
			//width : 450,//(srvcCode=='02'?380:620),
			width : 650,
			maxWidth : 735,
			autoHeight : true,
			minHeight : 156,
			maxHeight : 600,
			modal : true,
			draggable : false,
			resizable : false,
			cls : 'non-xn-popup',
			//closeAction : 'hide',
			//autoScroll : true,
			title : getLabel('attach'+srvcCode,'Attach Payment Packages'),
			config : {
				filterVal : null
			},
			listeners : {
				'resize' : function(){
					this.center();
				}
			},
			initComponent : function() {
				//setDirtyBit();
				var me = this;
				var colModel = me.getColumns();
				var strPackUrl = null;
				var filterUrl = null;
				if(srvcCode=='02')
				{
					strPackUrl = 'cpon/clientServiceSetup/getAllPaymentPackages.json';	
				}
				if(srvcCode=='05')
				{
					strPackUrl = 'cpon/clientServiceSetup/getAllCollectionPackages.json';
				}
				/* filter part for single/batch payment START */
				var featurePresent = false;
					for (var cnt=0;cnt<featureData.length;cnt++)
					{
						if(featureData[cnt].value == "SNGP" && featureData[cnt].isAssigned)
						{
							if(featurePresent)
							{
								pkgTypeFilter = pkgTypeFilter + ' or pkgType eq \'Q\' or pkgType eq \'M\' ';
							}else
							{
								pkgTypeFilter = '\'Q\' or pkgType eq \'M\' ';
							}	
							featurePresent = true;
						}
						if(featureData[cnt].value == "BP" && featureData[cnt].isAssigned)
						{
							if(featurePresent)
							{
								pkgTypeFilter = pkgTypeFilter + ' or pkgType eq \'B\' or pkgType eq \'M\' ';
							}else
							{
								pkgTypeFilter = '\'B\' or pkgType eq \'M\'';
							}	
							featurePresent = true;
						}
					}
				/* filter part for single/batch payment END */
					
				clearLink = Ext.create('Ext.Component',{
					layout : 'hbox',
					itemId : 'clearLink',
					hidden : true,
					cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l ux_verysmallmargin-top',
					html: '<a>Clear</a>',
					listeners: {
						'click': function() {
							var filterContainer = me.down('[itemId="packageFilter"]');
							filterContainer.setValue("");
							var selected = me.down('component[itemId="clearLink"]');
							selected.hide();
						},
						element: 'el',
						delegate: 'a'
					}
				});
				
				clearProductLink = Ext.create('Ext.Component',{
					layout : 'hbox',
					itemId : 'clearProductLink',
					hidden : true,
					cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l ux_verysmallmargin-top',
					html: '<a>Clear</a>',
					listeners: {
						'click': function() {
							var filterContainer = me.down('[itemId="productFilter"]');
							filterContainer.setValue("");
							var selected = me.down('component[itemId="clearProductLink"]');
							selected.hide();
						},
						element: 'el',
						delegate: 'a'
					}
				});
				
				if (srvcCode=='02')
				{
					filterUrl = 'validFlag eq \'Y\' and ( pkgType eq '+pkgTypeFilter+' )' ;
					if(selectedCategories.length!=0)
					{
						filterUrl = filterUrl + ' and ( '
					}
					for (var i = 0; i < selectedCategories.length; i++) 
					{
						var cat = selectedCategories[i];
						if (cat) {
							if (cat == '%') cat = "%25";
						} else {
							cat = "%25";
						}
						filterUrl = filterUrl + ' productCatType lk \'' + cat + '\'';
						if((i+1)<selectedCategories.length)
						{	
							filterUrl = filterUrl + ' or '
						}
					}
					if(selectedCategories.length!=0)
					{
						filterUrl = filterUrl + ' ) '
					}
					if((typeof ($('#chkImg_MLTC').attr('src')) == 'undefined')   || (typeof ($('#chkImg_MLTC').attr('src')) != 'undefined' 
						&&  $('#chkImg_MLTC').attr('src').indexOf('icon_unchecked') != -1))
						{
							filterUrl = filterUrl + ' and crossCurrencyFlag eq \'N\'';
						}
								
					packageFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					//padding : '1 0 0 0',
					fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox',
					itemId : 'packageFilter',
					fieldLabel : getLabel('Name', 'Payment Package'),
					labelAlign : 'top',
					width : 220,
					height : 52,
					emptyText : getLabel('searchByPmtPackage','Search by Payment Package@@@'),
					cfgUrl : strPackUrl,
					cfgQueryParamName : 'packageName',
					cfgRecordCount : -1,
					cfgRootNode : 'd.profile',
					cfgDataNode1 : 'packageName',
					cfgProxyMethodType : 'POST',
					cfgExtraParams : [
									   {
											key : 'id',
											value : encodeURIComponent(parentkey)
										},
									   {
											key : '$filter',
											value : filterUrl   
									   }
									   ],
					fitToParent : true,
					listeners : {
								'select':function(){ 
									me.searchPackages();
									var selected = me.down('component[itemId="clearLink"]');
          								  selected.show();									
								 },
								   'change':function(){
									 var filterContainer = me.down('[itemId="packageFilter"]');
								   if(Ext.isEmpty(filterContainer.getValue())){
										var selected = me.down('component[itemId="clearLink"]');
										selected.hide();
									  me.searchPackages();
									  }
								 }
							 }
				});	
				}
				if(srvcCode=='05')
				{
					packageFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					//padding : '1 0 0 0',
					fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox',
					itemId : 'packageFilter',
					fieldLabel : getLabel('Name', 'Receivable Package'),
					labelAlign : 'top',
					emptyText : getLabel('searchByReceivableMethod','Search by Receivables Package'),
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'validColPackageSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					enableQueryParam:false,
					cfgProxyMethodType : 'POST',
					fitToParent : true,
					listeners : {
								'select':function(){ 
									me.searchPackages();
									var selected = me.down('component[itemId="clearLink"]');
          								  selected.show();									
								 },
								   'change':function(){
									 var filterContainer = me.down('[itemId="packageFilter"]');
								   if(Ext.isEmpty(filterContainer.getValue())){
										var selected = me.down('component[itemId="clearLink"]');
										selected.hide();
									  me.searchPackages();
									  }
								 }
							 }
					});	
				}	
							
				productFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					margin : '0 0 0 65',
					fieldCls : 'xn-form-text popup-searchBox xn-suggestion-box',
					fieldLabel : getLabel('catName', 'Category'),
					emptyText : getLabel('searchByCategory','Search by Category'),
					labelAlign : 'top',
					cfgUrl : 'cpon/cponseek/{0}.json',
					itemId : 'productFilter',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : (srvcCode=='02')? 'validProductSeek':'validColProductSeek',
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					cfgKeyNode : 'value',
					cfgProxyMethodType : 'POST',
					listeners : {
						'select':function(){ 
							me.searchPackages();
							var selected = me.down('component[itemId="clearProductLink"]');
  								  selected.show();									
						 },
						   'change':function(){
							 var filterContainer = me.down('[itemId="productFilter"]');
						   if(Ext.isEmpty(filterContainer.getValue())){
								var selected = me.down('component[itemId="clearProductLink"]');
								selected.hide();
							  me.searchPackages();
							  }
						 }
					 }
				});				
				adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
							stateful : false,
							showEmptyRow : false,
							showPager : true,
							cls : 't7-grid',
							minHeight : 40,//150,
							maxHeight : 400,
							scroll : 'vertical',
							checkBoxColumnWidth : _GridCheckBoxWidth,
							pageSize : 5,
							rowList : [5, 10, 15, 20, 25, 30],
							columnModel : colModel,
							hideRowNumbererColumn : true,
							storeModel : {
								fields : ['packageName','productCatType','identifier','packageId','productDescription'],
								proxyUrl : strPackUrl,
								rootNode : 'd.profile',
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
								gridPageChange : me.handlePagingData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							},
							checkBoxColumnRenderer : function(value, metaData,
									record, rowIndex, colIndex, store, view) {

							}

						});
				if(srvcCode=='05')
					{
					me.items = [{
						xtype : 'container',
						layout : 'column',
						cls : 'ft-padding-bottom',
						items : [packageFilterfield,clearLink,productFilterfield,clearProductLink
							/*{
								xtype : 'button',
								itemId : 'btnSearchPackage',
								text : getLabel('search', 'Search'),
								cls : 'xn-button ux_button-background-color ux_cancel-button',
								margin : '0 0 0 10',
								handler : function() {
									me.searchPackages();
								}
							}*/
						]
					},adminListView];
					}
				else
					{
					me.items = [{
						xtype : 'container',
						layout : 'hbox',
						cls : 'ft-padding-bottom',
						items : [packageFilterfield, clearLink
							/*{
								xtype : 'button',
								itemId : 'btnSearchPackage',
								text : getLabel('search', 'Search'),
								cls : 'ux_button-background-color ux_cancel-button',
								margin : '0 0 0 10',
								handler : function() {
									me.searchPackages();
								}
							}*/
						]
					},adminListView];
					}
				
				
				me.bbar = [ {
							xtype : 'button',
							text : getLabel('cancel', 'Cancel'),
							handler : function() {
								me.close();
							}
				},'->', 
							{
							xtype : 'button',
							text : getLabel('submit', 'Submit'),
							//margin : '0 0 0 10',
							itemId : 'btnSubmitPackage',
							handler : function() {
								
								if(!Ext.isEmpty(selectedpk)){
									this.fireEvent("submitPackages",selectedpk);
								}else{
									me.close();
								}
								selectedpk=[];
								setDirtyBit();
							}
						}];
					
					
				me.callParent(arguments);
			},
			
			searchPackages : function() {
					adminListView.refreshData();
				},

			getColumns : function() {
				arrColsPref = [{
							"colId" : "packageName",
							"colDesc" :  getLabel('paymentPackages'+srvcCode,'Payment Methods'),
							"resizable" : false,
							"draggable" : false
						},{
							"colId" : "productDescription",
							"colDesc" :  getLabel('catName','Category'),
							"resizable" : false,
							"draggable" : false
						}];
				objWidthMap = {
					"packageName" : 258,
					"productDescription" : 259
				};
				var me = this;
				var arrCols = new Array(), objCol = null, cfgCol = null;
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.resizable = objCol.resizable;
						cfgCol.draggable = objCol.draggable;
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
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&$filter=validFlag eq \'Y\'' ;
				if(srvcCode=='02')
				{
					strUrl = strUrl + ' and ( pkgType eq '+pkgTypeFilter+' ) ';
				}
				if(selectedCategories.length!=0)
				{
					strUrl = strUrl + ' and ( '
				}
				if (Ext.isEmpty(productFilterfield.getValue()))
					{
				for (var i = 0; i < selectedCategories.length; i++) 
				{
					var cat = selectedCategories[i];
					if (cat) {
						
						if (cat == '%') cat = "%25";
					} else {
						cat = "%25";
					}
					strUrl = strUrl + ' productCatType lk \'' + cat + '\'';
					if((i+1)<selectedCategories.length)
					{	
						strUrl = strUrl + ' or '
					}
				}
				
				if(selectedCategories.length!=0)
				{
					strUrl = strUrl + ' ) '
				}
					}
				else
					{
					strUrl = strUrl + ' and productCatType lk \''+ productFilterfield.getValue().trim().toUpperCase() +'\'';
					}
				if (!Ext.isEmpty(packageFilterfield.getValue()))
				{
					strUrl = strUrl + ' and packageName lk \''+ packageFilterfield.getValue().toUpperCase() +'\'';
				}
				
				if(srvcCode=='02')
				{
					if((typeof ($('#chkImg_MLTC').attr('src')) == 'undefined')   || (typeof ($('#chkImg_MLTC').attr('src')) != 'undefined' 
					&&  $('#chkImg_MLTC').attr('src').indexOf('icon_unchecked') != -1))
					{
						strUrl = strUrl + ' and crossCurrencyFlag eq \'N\'';
					}
					//removed cross currency flag check, as it is not required.
				}
				grid.loadGridData(strUrl, me.updateSelection, grid, false);
			},
			updateSelection : function(grid, responseData, args) {
				var me = this;
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
								for(var j=0; j<selectedpk.length;j++) {
									if(selectedpk[j].data.packageId===item.data.packageId){	
										isInSelectedr = true;			
										break;
									}
								}
								if(isInSelectedr){
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0){
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
			},
			handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,sorter);
				strUrl = strUrl + '&id='+encodeURIComponent(parentkey);
				strUrl = strUrl + '&$filter=validFlag eq \'Y\'' ;
				if(srvcCode=='02')
				{
					strUrl = strUrl + ' and ( pkgType eq '+pkgTypeFilter+' ) ';
				}
				if(selectedCategories.length!=0)
				{
					strUrl = strUrl + ' and '

					strUrl = strUrl + ' (';
					for (var i = 0; i < selectedCategories.length; i++)
					{
						var cat = selectedCategories[i];

						if (cat) {
							if (cat == '%') cat = "%25";
						} else {
							cat = "%25";
						}

						strUrl = strUrl + ' productCatType lk \'' + cat + '\'';
						if((i+1)<selectedCategories.length)
						{	
							strUrl = strUrl + ' or '
						}
					}

					strUrl = strUrl + ' ) '
				}
				if (!Ext.isEmpty(productFilterfield.getValue()))
				{
					strUrl = strUrl + ' and productCatType lk \''+ productFilterfield.getValue().trim().toUpperCase() +'\'';
				}
				if (!Ext.isEmpty(packageFilterfield.getValue()))
				{
					strUrl = strUrl + ' and packageName lk \''+ packageFilterfield.getValue().toUpperCase() +'\'';
				}
				if(srvcCode=='02')
				{
					if((typeof ($('#chkImg_MLTC').attr('src')) == 'undefined')   || (typeof ($('#chkImg_MLTC').attr('src')) != 'undefined' 
					&&  $('#chkImg_MLTC').attr('src').indexOf('icon_unchecked') != -1))
					{
						strUrl = strUrl + ' and crossCurrencyFlag eq \'N\'';
					}
					//removed cross currency flag check, as it is not required.
				}
				grid.loadGridData(strUrl, me.up('attachPackagePopup').updateLoadSelection, grid, false);
					
			},
			updateLoadSelection : function(grid, responseData, args) {
				var me = this;
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for (var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
								for(var j=0; j<selectedpk.length; j++) {
									if(selectedpk[j].data.packageId===item.data.packageId){	
										isInSelectedr = true;			
										break;
									}
								}
								if(isInSelectedr){
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0){
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
			},
			addSelected : function(row, record, index , eopts){
				var allreadyPresent = false;
				for(var i=0; i<selectedpk.length;i++) {
					if(selectedpk[i].data.packageId===record.data.packageId){	
						allreadyPresent = true;			
						break;
					}
				}
				if(!allreadyPresent) {
					selectedpk.push(record);
					allreadyPresent = false;
				}
			},
			removeDeselected : function(row, record, index , eopts){
				var index= -1;
				for(var i=0; i<selectedpk.length;i++) {
					if(selectedpk[i].data.packageId===record.data.packageId){	
						index = i;		
						break;
					}
				}
				if (index > -1) {
					selectedpk.splice(index, 1);
				}
			}
			
		});
