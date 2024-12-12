Ext.define('CPON.view.PkgAssignmentPopupView', {
 extend : 'Ext.window.Window',
	xtype : 'pkgAssignmentPopupView',
    autoHeight : true,
	modal : true,
	requires : ['Ext.ux.gcp.AutoCompleter','Ext.container.Container', 'Ext.ux.gcp.SmartGrid','Ext.form.Label'],
	width : '43%',
	itemId : 'filterPopUpViewPanel', 

/**
	 * @cfg{String} cfgFilterTitle The text to be displyed in AutoCompleter Filter Label
	 * @default 'Summary Details'
	 */
	cfgFilterLabel : null,
	/**
	 * @cfg{JSON} cfgGridModel The json model used for SmartGrid creation
	 * @default {}
	 * 
	 * @example
	 */
   cfgGridModel : {
	            pageSize : 5,
			    rowList : [5, 10, 15, 20, 25, 30],
				stateful : false,
				hideRowNumbererColumn : true,
				showSummaryRow : true,
				showEmptyRow : false,
				showPager : true,
				escapeHtml : false
			},
	/**
	 * @cfg{Boolean} cfgShowFilter controls whether the filter panel should
	 *               appear or not
	 * 
	 * @default true
	 */
	cfgShowFilter : true,
    filterData : [],
	filterParam : {},
	cfgUrl : null,
	paramName : null,
	filterValue : null,
	cfgGrid : null,
	displayCount : false,
	checkboxId : null,
	labelId : null,
	userMode :null,
	module : '',
	subsidaries : '',
	service : '',
	userCategory : '',
	userCorporation : '',
	userCode : '',
	hiddenValueField: null,
	hiddenValuePopUpField: null,
	cfgAutoCompleterUrl :'',
	dataNode:null,
	dataNode2:null,
	cfgListCls:null,
	delimiter:'',
	rootNode:null,
	responseNode:'details',
	autoCompleterExtraParam:null,
	autoCompleterEmptyText:null,
	config : {
				fnCallback : null,
				savefnCallback : null,
				cancelfnCallback : null,
				urlCallback : null,
				title : null
			},
	
listeners:{
	'resize' : function(){
				    this.center();
				   },
	'show':function(){
					var selectpopup = this;
					var checkBoxEle=document.getElementById(selectpopup.checkboxId);
					var filterContainer = selectpopup.down('container[itemId="filterContainer"] AutoCompleter');
					if(filterContainer  !=null && !Ext.isEmpty(filterContainer.getValue()))
						 filterContainer.setValue('');
					var grid = selectpopup.down("smartgrid");
					 if(!Ext.isEmpty (checkBoxEle) && checkBoxEle.getAttribute('src').indexOf('/icon_checked')!=-1){
						 selectpopup.setAllSelectedRecord (grid, null, null);
					}else{
					       selectpopup.resetAllSelectedRecord (grid, null, null);
					}					
				}
			},
initComponent : function() {
		var me = this;
		var arrItems=new Array();
		var objGridPanel = me.createGridPanel();
		if(me.cfgShowFilter === true){
			 me.filterParam.filterSeekUrl=me.cfgAutoCompleterUrl;
			 me.filterParam.SeekLabel=me.cfgFilterLabel;
			 objFilterPanel = me.createFilterPanel(me.filterParam);
			 arrItems.push(objFilterPanel);
		}
		if(Ext.isEmpty(me.cfgListCls)){
			me.cfgListCls="xn-autocompleter";
		}
		arrItems.push(objGridPanel);
		me.items =  arrItems;
		me.bbar = (me.userMode == 'VIEW' || me.userMode == "MODIFIEDVIEW"
						|| me.userMode == "VERIFY") ? ['->',{
					xtype : 'button',
					text : getLabel('btncancel', 'Cancel'),
					cls : 'ft-button-light',
					itemId : 'cancelBtn',
					handler : function() {
						var grid=me.down("smartgrid");
						if (me.userMode != 'VIEW' && me.userMode != "MODIFIEDVIEW"
						&& me.userMode != "VERIFY")
						{
						var checkValueEle=document.getElementById(me.checkboxId);
						if(!Ext.isEmpty (checkValueEle) && checkValueEle.getAttribute('src').indexOf('/icon_unchecked')!=-1)
						{
								var arrayData=grid.selectedRecordListTemp;
								var	iCount=0;
								if(arrayData.length>0)
								{
								grid.selectedRecordList =new Array();

									for(;iCount<arrayData.length;iCount++)
									{
										if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
											grid.selectedRecordsListInDB.push(arrayData[iCount]);
										
											if(!me.isAlreadyExist(grid.selectedRecordList,arrayData[iCount]))
												grid.selectedRecordList.push(arrayData[iCount]);
									
									}
									grid.selectedRecordList =new Array();
								}
								arrayData=grid.tempSelectedRecord;
									iCount=0;
									for(;iCount<arrayData.length;iCount++)
									{
								if(!me.isAlreadyExist(grid.deSelectedRecordListTemp,arrayData[iCount])
									&& !me.isAlreadyExist(grid.selectedRecordListTemp,arrayData[iCount]))
									{
										if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
											grid.selectedRecordsListInDB.push(arrayData[iCount]);
									}
									
									}
									arrayData=grid.deSelectedRecordListTemp;
										if(arrayData.length>0)
										{	
											grid.deSelectedRecordList=new Array();
											iCount=0;
											for(;iCount<arrayData.length;iCount++)
											{
												if(!me.isAlreadyExist(grid.deSelectedRecordList,arrayData[iCount]))
														grid.deSelectedRecordList.push(arrayData[iCount]);
									
											}
										}
										else
										{
											arrayData=grid.deSelectedRecordList;
											iCount=0;
											for(;iCount<arrayData.length;iCount++)
											{
											if(grid.deSelectedRecordListTemp.length>0 && !me.isAlreadyExist(grid.deSelectedRecordListTemp,arrayData[iCount]))
											{
												if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
													grid.selectedRecordsListInDB.push(arrayData[iCount]);
												
											}
											}
											grid.deSelectedRecordList=new Array();

										}
								}
								else
								{
								var arrayData=grid.tempSelectedRecord;
									var iCount=0;
									for(;iCount<arrayData.length;iCount++)
									{
										if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
											grid.selectedRecordsListInDB.push(arrayData[iCount]);

									}
									arrayData=grid.deSelectedRecordList;
									iCount=0;
									for(;iCount<arrayData.length;iCount++)
									{
										if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
										grid.selectedRecordsListInDB.push(arrayData[iCount]);
									}
									grid.deSelectedRecordList=new Array();
								}
						me.close();
						
						}
						else
						{
							 arrayData=grid.selectedRecordList;
							  iCount=0;
								for(;iCount<arrayData.length;iCount++)
								{
								if(!me.isAlreadyExist(grid.deSelectedRecordListTemp,arrayData[iCount]))			 
									grid.selectedRecordsListInDB.push(arrayData[iCount]);
								}
							if(me.cancelfnCallback == null || me.cancelfnCallback == undefined) 
							{
								me.close();
							}
							else
							{
								me.cancelfnCallback(me);
							}
						}
						
			
				}
					}] : [{
					xtype : 'button',
					text : getLabel('btncancel', 'Cancel'),
					cls : 'ft-button-light',
					itemId : 'cancelBtn',
					handler : function() {
						var grid=me.down("smartgrid");
						if (me.userMode != 'VIEW' && me.userMode != "MODIFIEDVIEW"
						&& me.userMode != "VERIFY")
						{
						var checkValueEle=document.getElementById(me.checkboxId);
						if(!Ext.isEmpty (checkValueEle) && checkValueEle.getAttribute('src').indexOf('/icon_unchecked')!=-1)
						{
								var arrayData=grid.selectedRecordListTemp;
								var	iCount=0;
								if(arrayData.length>0)
								{
								grid.selectedRecordList =new Array();

									for(;iCount<arrayData.length;iCount++)
									{
										if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
											grid.selectedRecordsListInDB.push(arrayData[iCount]);
										
											if(!me.isAlreadyExist(grid.selectedRecordList,arrayData[iCount]))
												grid.selectedRecordList.push(arrayData[iCount]);
									
									}
									grid.selectedRecordList =new Array();
								}
								arrayData=grid.tempSelectedRecord;
									iCount=0;
									for(;iCount<arrayData.length;iCount++)
									{
								if(!me.isAlreadyExist(grid.deSelectedRecordListTemp,arrayData[iCount])
									&& !me.isAlreadyExist(grid.selectedRecordListTemp,arrayData[iCount]))
									{
										if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
											grid.selectedRecordsListInDB.push(arrayData[iCount]);
									}
									
									}
									arrayData=grid.deSelectedRecordListTemp;
										if(arrayData.length>0)
										{	
											grid.deSelectedRecordList=new Array();
											iCount=0;
											for(;iCount<arrayData.length;iCount++)
											{
												if(!me.isAlreadyExist(grid.deSelectedRecordList,arrayData[iCount]))
														grid.deSelectedRecordList.push(arrayData[iCount]);
									
											}
										}
										else
										{
											arrayData=grid.deSelectedRecordList;
											iCount=0;
											for(;iCount<arrayData.length;iCount++)
											{
											if(grid.deSelectedRecordListTemp.length>0 && !me.isAlreadyExist(grid.deSelectedRecordListTemp,arrayData[iCount]))
											{
												if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
													grid.selectedRecordsListInDB.push(arrayData[iCount]);
												
											}
											}
											grid.deSelectedRecordList=new Array();

										}
								}
								else
								{
								var arrayData=grid.tempSelectedRecord;
									var iCount=0;
									for(;iCount<arrayData.length;iCount++)
									{
										if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
											grid.selectedRecordsListInDB.push(arrayData[iCount]);

									}
									arrayData=grid.deSelectedRecordList;
									iCount=0;
									for(;iCount<arrayData.length;iCount++)
									{
										if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
										grid.selectedRecordsListInDB.push(arrayData[iCount]);
									}
									grid.deSelectedRecordList=new Array();
								}
						me.close();
						
						}
						else
						{
							 arrayData=grid.selectedRecordList;
							  iCount=0;
								for(;iCount<arrayData.length;iCount++)
								{
								if(!me.isAlreadyExist(grid.deSelectedRecordListTemp,arrayData[iCount]))			 
									grid.selectedRecordsListInDB.push(arrayData[iCount]);
								}
							if(me.cancelfnCallback == null || me.cancelfnCallback == undefined) 
							{
								me.close();
							}
							else
							{
								me.cancelfnCallback(me);
							}
						}
						
			
				}},'->', {
					xtype : 'button',
					text : getLabel('btnSubmit',"Submit"),
					cls : 'ft-button-primary',
					handler : function() {
					var grid=me.down("smartgrid");
					var arrayData;
					var iCount=0;
					if (me.userMode != 'VIEW' && me.userMode != "MODIFIEDVIEW"
						&& me.userMode != "VERIFY")
						{
						me.isActionperformed=true;
					grid.selectedRecordListTemp=new Array();
					grid.deSelectedRecordListTemp=new Array();
					grid.selectedRecordsListInDB.splice(0,grid.selectedRecordsListInDB.length);
					var checkValueEle=document.getElementById(me.checkboxId);
					if(!Ext.isEmpty (checkValueEle) && checkValueEle.getAttribute('src').indexOf('/icon_checked')!=-1)
					{
					 arrayData=grid.tempSelectedRecord;
					iCount=0;
					for(;iCount<arrayData.length;iCount++)
					{
						if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
							grid.selectedRecordsListInDB.push(arrayData[iCount]);
					}
					}
					else if(grid.selectedRecordList.length>0){
					
						 arrayData=grid.selectedRecordList;
						 iCount=0;
						for(;iCount<arrayData.length;iCount++)
						{
							if(!me.isAlreadyExist(grid.selectedRecordListTemp,arrayData[iCount]))
								grid.selectedRecordListTemp.push(arrayData[iCount]);
							if(!me.isAlreadyExist(grid.selectedRecordsListInDB,arrayData[iCount]))
								grid.selectedRecordsListInDB.push(arrayData[iCount]);
						}
						arrayData=grid.deSelectedRecordList;
						 iCount=0;
						for(;iCount<arrayData.length;iCount++)
						{
							if(!me.isAlreadyExist(grid.deSelectedRecordListTemp,arrayData[iCount]))
								grid.deSelectedRecordListTemp.push(arrayData[iCount]);
							
						}
						
						}
						else if(grid.selectedRecordList.length==0)
						{
						
							grid.selectedRecordsListInDB=new Array();
							arrayData=grid.deSelectedRecordList;
						 iCount=0;
						for(;iCount<arrayData.length;iCount++)
						{
							if(!me.isAlreadyExist(grid.deSelectedRecordListTemp,arrayData[iCount]))
								grid.deSelectedRecordListTemp.push(arrayData[iCount]);
						
						}
						}
						grid.tempSelectedRecord=[];
					}
					else
					{
					 arrayData=grid.selectedRecordList;
					  iCount=0;
						for(;iCount<arrayData.length;iCount++)
						{
						if(!me.isAlreadyExist(grid.deSelectedRecordListTemp,arrayData[iCount]))			 
							grid.selectedRecordsListInDB.push(arrayData[iCount]);
						}
				
					}
					me.savefnCallback(me);
				}}];
		me.on('resize', function() {
						me.doLayout();
					});
		me.on('render', function(cmp) {
						 me.reconfigureGrid(me.cfgModel);
						cfgGrid=cmp.down('grid[xtype="smartgrid"]');
				});
		me.callParent(arguments);

},

onEsc: function() {
	var cancelBtn = this.down('button[itemId="cancelBtn"]');
	if(!Ext.isEmpty(cancelBtn))
		cancelBtn.handler(cancelBtn);
},

createGridPanel : function() {
		var me = this;
		var objGridContainer = null;
		objGridContainer = Ext.create('Ext.container.Container', {
					itemId : 'gridContainer',
					layout : 'fit',
					height : 'auto',
					width : '100%',
					//maxWidth : 650,
					//padding : '5 10 12 10',
					componentCls : 'gradiant_back x-portlet ux_border-top',
					//autoHeight : true
					minHeight : 50,
					maxHeight : 230
				});
		return objGridContainer;

},
createFilterPanel : function(filterParam) {
		var me = this;
		var objFilterContainer = null;
		objFilterContainer = Ext.create('Ext.container.Container', {
					itemId : 'filterContainer',
					layout : 'vbox',
					height : 'auto',
					width : '100%',
					//padding : '5 10 12 10',
					componentCls : 'gradiant_back x-portlet ux_border-top ft-padding-bottom',
					autoHeight : true
				});
				var me=this;
		
	var objLabel=Ext.create('Ext.form.Label',{
			text: filterParam.SeekLabel
			//padding : '0 0 6 0',//'1 0 0 0',
			//cls:'frmLabel'
		});
	var customeUrl=me.urlCallback(this);
	
	autoCompleterParent = Ext.create('Ext.container.Container', {
		itemId : 'autoComplterParentContainer',
		layout : 'hbox',
		height : 'auto',
		width : '100%',
		componentCls : 'gradiant_back x-portlet ux_border-top',
		autoHeight : true
	});
	
	objAutoCompleter =  Ext.create('Ext.ux.gcp.AutoCompleter', {
					 //padding : '1 0 0 0',
					 layout : 'hbox',
					 fieldCls : 'popup-searchBox xn-suggestion-box',
					 width : 220,
					 height : 35,
					 cfgUrl : me.cfgUrl,
					 cfgProxyMethodType : 'POST',
					 cfgQueryParamName :'packageName',
					 cfgRecordCount : -1,
					 matchFieldWidth: true,
					 cfgSeekId : filterParam.filterSeekUrl,
					 cfgRootNode : me.rootNode,
					 cfgDataNode1 : me.dataNode,
					 cfgDataNode2:me.dataNode2,
					 cfgDelimiter:me.delimiter,
					 cfgTplCls:me.cfgListCls,
					 cfgExtraParams : me.autoCompleterExtraParam,
					 enableQueryParam:false,
					 emptyText : me.autoCompleterEmptyText,
					listeners : {
	                    'select':function(){
						      me.setDataForFilter(me);
							  var selected = me.down('component[itemId="clearLink"]');
							  selected.show();
	                     },
						   'change':function(){
						     var filterContainer = me.down('container[itemId="filterContainer"] AutoCompleter');
						   if(Ext.isEmpty(filterContainer.getValue())){
						      me.setDataForFilter(me);
						      var clearLink = me.down('component[itemId="clearLink"]');
						      clearLink.hide();
						   }
	                     }/*,
	                     'afterrender': function() {
	                    	 var filterContainer = me.down('container[itemId="filterContainer"] AutoCompleter');
	                    	 filterContainer.focus(false, 1000);
	                      }*/
					 }			
				
				});
	
	var link = Ext.create('Ext.Component', {
		layout : 'hbox',
		itemId : 'clearLink',
		hidden : true,
		cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l ft-margin-very-small-t',
		//renderTo: Ext.getBody(),
        html: '<a>Clear</a>',
        listeners: {
            'click': function() {
            	var filterContainer = me.down('container[itemId="filterContainer"] AutoCompleter');
            	filterContainer.setValue("");
            	var selected = me.down('component[itemId="clearLink"]');
            	selected.hide();
            },
            element: 'el',
            delegate: 'a'
        }
	});
	
		 if (!Ext.isEmpty(objAutoCompleter)) {
		     objFilterContainer.add(objLabel);
		     autoCompleterParent.add(objAutoCompleter);
	         autoCompleterParent.add(link);
		     objFilterContainer.add(autoCompleterParent);
		}		
	return objFilterContainer;		
},

reconfigureGrid : function(gridModel) {
		var me = this, objSmartGrid = null, actionToolBar = null, arrTBarItem = null;
		gridModel = (gridModel || {});
		var gridContainer = me.down('container[itemId="gridContainer"]');
		var cfgModel = me.cfgGridModel;
		var pageSize = (gridModel.pageSize || cfgModel.pageSize);
		var columnModel = (gridModel.columnModel || gridModel.columnModel
				|| cfgModel.defaultColumnModel || []);
		me.applyDefaultColumnRenderer(columnModel);	
		var rowList = (gridModel.rowList || cfgModel.rowList || []);
		var gridStoreModel = (gridModel.storeModel || {});
		var cfgStoreModel = (cfgModel.storeModel || {});
		var storeModel = {
			fields : gridStoreModel.fields || cfgStoreModel.fields,
			proxyUrl : gridStoreModel.proxyUrl || cfgStoreModel.proxyUrl,
			rootNode : gridStoreModel.rootNode || cfgStoreModel.rootNode,
			sortState : gridStoreModel.sortState || cfgStoreModel.sortState,
			totalRowsNode : gridStoreModel.totalRowsNode
					|| cfgStoreModel.totalRowsNode
		};
		var stateful = !Ext.isEmpty(gridModel.stateful)
				? gridModel.stateful
				: (!Ext.isEmpty(cfgModel.stateful) ? cfgModel.stateful : true);
		var enableLocking = !Ext.isEmpty(gridModel.enableLocking)
				? gridModel.enableLocking
				: (!Ext.isEmpty(cfgModel.enableLocking)
						? cfgModel.enableLocking
						: true);
		var hideRowNumbererColumn = !Ext
				.isEmpty(gridModel.hideRowNumbererColumn)
				? gridModel.hideRowNumbererColumn
				: (!Ext.isEmpty(cfgModel.hideRowNumbererColumn)
						? cfgModel.hideRowNumbererColumn
						: false);
		var showCheckBoxColumn = !Ext.isEmpty(gridModel.showCheckBoxColumn)
				? gridModel.showCheckBoxColumn
				: (!Ext.isEmpty(cfgModel.showCheckBoxColumn)
						? cfgModel.showCheckBoxColumn
						: true);
		var showSummaryRow = !Ext.isEmpty(gridModel.showSummaryRow)
				? gridModel.showSummaryRow
				: (!Ext.isEmpty(cfgModel.showSummaryRow)
						? cfgModel.showSummaryRow
						: false);
		var showEmptyRow = !Ext.isEmpty(gridModel.showEmptyRow)
				? gridModel.showEmptyRow
				: (!Ext.isEmpty(cfgModel.showEmptyRow)
						? cfgModel.showEmptyRow
						: true);
		var showPager = !Ext.isEmpty(gridModel.showPager)
				? gridModel.showPager
				: (!Ext.isEmpty(cfgModel.showPager) ? cfgModel.showPager : true);
		var showAllRecords = !Ext.isEmpty(gridModel.showAllRecords)
				? gridModel.showAllRecords
				: (!Ext.isEmpty(cfgModel.showAllRecords)
						? cfgModel.showAllRecords
						: false);
		var fnColumnRenderer = (gridModel.fnColumnRenderer
				|| cfgModel.fnColumnRenderer || me.columnRenderer);
		var fnRowIconVisibilityHandler = (gridModel.fnRowIconVisibilityHandler
				|| cfgModel.fnRowIconVisibilityHandler || me.isRowIconVisible);
		var fnSummaryRenderer = (gridModel.fnSummaryRenderer
				|| cfgModel.fnSummaryRenderer || me.summaryRenderer);

		var height = (gridModel.height || cfgModel.height || 'auto');
		var minHeight = (gridModel.minHeight || cfgModel.minHeight || 'auto');
		var checkBoxColumnWidth = (gridModel.checkBoxColumnWidth
				|| cfgModel.checkBoxColumnWidth || null);
		var rowNumbererColumnWidth = (gridModel.rowNumbererColumnWidth
				|| cfgModel.rowNumbererColumnWidth || null);

		var enableColumnHeaderFilter = !Ext
				.isEmpty(gridModel.enableColumnHeaderFilter)
				? gridModel.enableColumnHeaderFilter
				: (!Ext.isEmpty(cfgModel.enableColumnHeaderFilter)
						? cfgModel.enableColumnHeaderFilter
						: false);
		var columnHeaderFilterCfg = (gridModel.columnHeaderFilterCfg
				|| cfgModel.columnHeaderFilterCfg || null);
		var showPageSetting = !Ext.isEmpty(gridModel.showPageSetting)
				? gridModel.showPageSetting
				: (!Ext.isEmpty(cfgModel.showPageSetting)
						? cfgModel.showPageSetting
						: false);
		var showPagerRefreshLink = !Ext.isEmpty(gridModel.showPagerRefreshLink)
				? gridModel.showPagerRefreshLink
				: (!Ext.isEmpty(cfgModel.showPagerRefreshLink)
						? cfgModel.showPagerRefreshLink
						: !me.cfgShowRefreshLink);
		var multiSort = !Ext.isEmpty(gridModel.multiSort)
				? gridModel.multiSort
				: (!Ext.isEmpty(cfgModel.multiSort) ? cfgModel.multiSort : true);
		var enableRowEditing = !Ext.isEmpty(gridModel.enableRowEditing)
				? gridModel.enableRowEditing
				: (!Ext.isEmpty(cfgModel.enableRowEditing)
						? cfgModel.enableRowEditing
						: false);		
		var enableCellEditing = !Ext.isEmpty(gridModel.enableCellEditing)
				? gridModel.enableCellEditing
				: (!Ext.isEmpty(cfgModel.enableCellEditing)
						? cfgModel.enableCellEditing
						: false);
		
		var escapeHtml = !Ext.isEmpty(gridModel.escapeHtml)
				? gridModel.escapeHtml
				: (!Ext.isEmpty(cfgModel.escapeHtml)
						? cfgModel.escapeHtml
						: true);
		
		gridContainer.removeAll(true);
		if (!Ext.isEmpty(columnModel)) {
			objSmartGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
						id : Ext.String.format('summaryGrid_{0}', me.itemId),
						itemId : Ext.String
								.format('summaryGrid_{0}', me.itemId),
						bodyCls : 'single-border',
						columnModel : columnModel,
						storeModel : storeModel,
						pageSize : pageSize,
						rowList : rowList,
						enableLocking : enableLocking,
						stateful : stateful,
						enableCellEditing : enableCellEditing,						
						hideRowNumbererColumn : hideRowNumbererColumn,
						showCheckBoxColumn : showCheckBoxColumn,
						showEmptyRow : showEmptyRow,
						showPager : showPager,
						showAllRecords : showAllRecords,
						showPageSetting : showPageSetting,
						showPagerRefreshLink : showPagerRefreshLink,
						height : height,
						minHeight : minHeight,
						maxHeight : me.smartGridMaxHeight || height,
						checkBoxColumnWidth : checkBoxColumnWidth,
						rowNumbererColumnWidth : rowNumbererColumnWidth,
						isRowIconVisible : fnRowIconVisibilityHandler,
						enableColumnHeaderFilter : enableColumnHeaderFilter,
						columnHeaderFilterCfg : columnHeaderFilterCfg,
						multiSort : multiSort,
						escapeHtml : escapeHtml,
						enableRowEditing : enableRowEditing,
						selectedRecordList : new Array(),
						deSelectedRecordList : new Array(),
						selectedRecordListTemp : new Array(),
						deSelectedRecordListTemp : new Array(),
						isCancelClick :false,
						selectedRecordsListInDB : new Array(),
						tempSelectedRecord:new Array(),
						cls:'t7-grid',
						checkBoxColumnWidth : _GridCheckBoxWidth,
						keyNode: me.keyNode,
						listeners : {
						render : function(grid) {
							me.handlePagingData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
							
						},
						beforeselect : me.handleBeforeSelect,
						beforedeselect : me.handleBeforeSelect,
						select : me.addSelected,
						deselect : me.removeDeselected,
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handlePagingData,
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {

						}
					}
					});
		}
		if (!Ext.isEmpty(objSmartGrid)) {
			gridContainer.add(objSmartGrid);
		}
		gridContainer.doComponentLayout();
	},

getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		return strQuickFilterUrl;
},
	
generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var isFilterApplied = false;
		var strFilter = '&packageName=';
		var strTemp = '';
		for (var index = 0; index < filterData.length; index++) {
			if(filterData[index].operatorValue && filterData[index].paramValue1!=null &&filterData[index].paramValue1!='') {
			strTemp =  filterData[index].paramValue1 ;
			}
			isFilterApplied=true;
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
	   thisClass.filterData=[];
		return strFilter;
		
		
	},
setDataForFilter:function(filterPopUpView){
	    var me = this;
		var JsonArr={};
		var grid = me.down('grid[xtype="smartgrid"]');
         var filterContainer = me.down('container[itemId="filterContainer"] AutoCompleter');
		JsonArr.operatorValue='lk';
		JsonArr.paramName=me.paramName,
	    JsonArr.paramValue1=filterContainer.getValue();
		me.filterData.push(JsonArr);
		var gridUrl=grid.store.dataUrl;
        var gridSorter=grid.store.sorters;
        var gridPageSize=grid.pageSize;
        var filterValue=filterPopUpView.getFilterUrl()		
		grid.filterValue=filterValue;
		filterPopUpView.filterValue=filterValue;
		filterPopUpView.handlePagingData(grid,gridUrl,gridPageSize,1, 1,gridSorter,null)  
},

	handleBeforeSelect : function(me, record, index, eOpts) {
				if (!Ext.isEmpty(record.data.allowAllPayAcctsFlag)
					&& record.data.allowAllPayAcctsFlag === "Y")//record.data.readOnly === true)
		 			return false;
			},
  addSelected : function(row, record, index, eopts) {
				var me = this;
				var usermstselectpopup = me.up("pkgAssignmentPopupView");
				var keyNode = me.keyNode;
				var alreadyPresent = usermstselectpopup.checkIfRecordExist(me.selectedRecordList,keyNode,record.data);
				/* Add to Grid Selection List */
				if (!alreadyPresent ) {
					me.selectedRecordList.push(record.data);
					alreadyPresent = false;
				}	
				usermstselectpopup.removeElementIfExist(me.deSelectedRecordList,keyNode,record.data);
				
			},

 removeDeselected : function(row, record, index, eopts) {
				var me = this;
				var usermstselectpopup = me.up("pkgAssignmentPopupView");
				var keyNode = me.keyNode;
				/* Remove Ellement From Grid Selection List */
				var index = -1;
				usermstselectpopup.removeElementIfExist(me.selectedRecordList,keyNode,record.data);
				var alreadyPresent = usermstselectpopup.checkIfRecordExist(me.deSelectedRecordList,keyNode,record.data);
			
				/* Add to Grid Selection List */
				if (!alreadyPresent ) {
					me.deSelectedRecordList.push(record.data);
					alreadyPresent = false;
				}
				
				
			},
removeElementIfExist : function(arrayList,keyNode,keyNodeValue){
				var index = -1;
				var isRecordPresent = false;
				var keyNodeStr=keyNode;
				var keyNodeArray=keyNodeStr.split(",");
				for ( var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					for ( var j = 0; j < keyNodeArray.length; j++) {
							var KeyVal=keyNodeArray[j];
						if (rowRecord[KeyVal] === keyNodeValue[KeyVal]) {
							isRecordPresent=true;
						}
						else
						{
								isRecordPresent=false;
								break;
						}
					}
					if(isRecordPresent)
					{
						index = i;
							break;
					}
				}
				if (index > -1) {
					arrayList.splice(index, 1);
				}
			},
checkIfRecordExist : function(arrayList,keyNode,keyNodeValue){
				var isRecordPresent = false;
				var keyNodeStr=keyNode;
				var keyNodeArray=keyNodeStr.split(",");
				for ( var i = 0; i < arrayList.length; i++) {
					var rowRecord = arrayList[i];
					for ( var j = 0; j < keyNodeArray.length; j++) {
					var KeyVal=keyNodeArray[j];
					if (rowRecord[KeyVal] === keyNodeValue[KeyVal]) {
						isRecordPresent = true;
					}
					else
					{
						isRecordPresent = false;
						break;
					}
				}
				if(isRecordPresent)
					break;
				}
				return isRecordPresent;
				
			},


handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var popObj=grid.up('pkgAssignmentPopupView');
				var strUrl= popObj.getUrlWithDataParam(popObj,grid,url, pgSize, newPgNo, oldPgNo, sorter);
				grid.loadGridData(strUrl,
						popObj.updateLoadSelection,
						grid, false);
			},

handlePagingData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter,s) {
				var me = this;
				var popObj=grid.up('pkgAssignmentPopupView');
				var strUrl= popObj.getUrlWithDataParam(me,grid,url, pgSize, newPgNo, oldPgNo, sorter);
				if(me.isXType('grid')){  
					grid.loadGridData(strUrl,popObj.updateSelection, grid, false);
				}else{
				   grid.loadGridData(strUrl,popObj.updateSelection, grid, false);
				}
			},
getUrlWithDataParam: function(me,grid,url, pgSize, newPgNo, oldPgNo,
		sorter)
{
	var filterValue=null;
	var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
			sorter);
	var popObj=grid.up('pkgAssignmentPopupView');
	if(!Ext.isEmpty(popObj)){
		filterValue=popObj.filterValue;
		if(!Ext.isEmpty(filterValue)&& filterValue != null){
			 strUrl = strUrl+filterValue;
			}
	}

	strUrl = strUrl+popObj.urlCallback(popObj);
	return strUrl;
},
getGeneratedFilterUrl : function(){
	var me = this, grid = me.getGrid();
		return grid ? me.getUrlWithDataParam(me, grid, grid.store.dataUrl,
				grid.pageSize, grid.store.currentPage, grid.store.currentPage,
				grid.store.sorter) : null;
},
getGrid:function(){
	return this.down('smartgrid');
},
isAlreadyExist : function(list,item){
				var me=this;
				var allreadyPresent = false;
				var keyNodeStr=me.keyNode;
				var keyNodeArray=keyNodeStr.split(",");
				for ( var i = 0; i < list.length; i++) {
					for ( var j = 0; j < keyNodeArray.length; j++) {
					var tempKey=keyNodeArray[j];
					if (list[i][tempKey] === item[tempKey]) {
						allreadyPresent = true;
					}
					else
					{
					allreadyPresent=false;
					break;
					}
				}
				if(allreadyPresent)
				break;
				}
				return allreadyPresent;
			},
resetAllSelectedRecord : function(grid){
var selectpopup = grid.up("pkgAssignmentPopupView");
var checkValueEle=document.getElementById(selectpopup.checkboxId);
			if(grid.getSelectionModel().isLocked()){
				grid.getSelectionModel().setLocked(false);
				}
				grid.selectedRecordList.splice(0,grid.selectedRecordList.length);
				for(var iCount=0;iCount<grid.selectedRecordsListInDB.length;iCount++)
				{
					grid.selectedRecordList.push(grid.selectedRecordsListInDB[iCount]);
				}
					
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for ( var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
								for ( var j = 0; j < grid.selectedRecordsListInDB.length; j++) {
								if(selectpopup.isAlreadyExist(grid.selectedRecordsListInDB , item.data))
								{
									selectedRecords.push(item);
								
								}
								}
							}
						}
						grid.suspendEvent('beforeselect');
						grid.getSelectionModel().select(selectedRecords);
						grid.resumeEvent('beforeselect');
						
						if (selectpopup.userMode == 'VIEW' || selectpopup.userMode == "MODIFIEDVIEW"
						|| selectpopup.userMode == "VERIFY" || (!Ext.isEmpty (checkValueEle) &&checkValueEle.getAttribute('src').indexOf("/icon_checked.gif")!=-1)) {
						grid.getSelectionModel().setLocked(true);
				        }
				        
						}
						}
						
		
			},	
resetAllRecord : function(grid){
			if(grid.getSelectionModel().isLocked()){
				grid.getSelectionModel().setLocked(false);
				}
				grid.selectedRecordList=[];
				
				if (!Ext.isEmpty(grid)) {
						var selectedRecords = new Array();
						grid.suspendEvent('beforeselect');
						grid.getSelectionModel().select(selectedRecords);
						grid.resumeEvent('beforeselect');						
					}
			},				
setAllSelectedRecord : function(grid){
				var selectpopup = grid.up("pkgAssignmentPopupView");
				if(grid.getSelectionModel().isLocked()){
				grid.getSelectionModel().setLocked(false);
				}
				var selectedRecords = new Array();
				grid.selectedRecordList.splice(0,grid.selectedRecordList.length);			
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for ( var i = 0; i < items.length; i++) {
								var item = items[i];
									selectedRecords.push(item);
									grid.selectedRecordList.push(item.data);
									if(item.data.isAssigned)
									{
									grid.tempSelectedRecord.push(item.data);
									}
								
							}
						}						
						grid.suspendEvent('beforeselect');
						grid.getSelectionModel().select(selectedRecords);
						grid.resumeEvent('beforeselect');	
						grid.getSelectionModel().setLocked(true);						
					}
				}
			},
			
updateSelection : function(grid, responseData, args) {
				var me = this;
				var selectpopup = grid.up("pkgAssignmentPopupView");
				var checkValueEle=document.getElementById(selectpopup.checkboxId);
				var objLinkedNode;
				if(!Ext.isEmpty(responseData) && responseData.d && responseData.d.linkedProducts){
					grid.selectedRecordList=[];
					objLinkedNode = responseData.d.linkedProducts;
				}
				if(grid.getSelectionModel().isLocked()){
				grid.getSelectionModel().setLocked(false);
				}
				var selectedArray = responseData.d[selectpopup.responseNode];
				 if (!Ext.isEmpty (checkValueEle) && checkValueEle.getAttribute('src')=="static/images/icons/icon_checked.gif") {
					var selectedArray = responseData.d[selectpopup.responseNode];
					if(!Ext.isEmpty(selectedArray)){
						for ( var i = 0; i < selectedArray.length; i++) {
								grid.selectedRecordList.push(selectedArray[i]);						
							if(selectedArray[i].isAssigned)
								grid.tempSelectedRecord.push(selectedArray[i]);
						}
					}
				} else {
					var selectedArray = responseData.d[selectpopup.responseNode];
					var addFlag=true;
					if (!Ext.isEmpty(selectedArray)) {
						for ( var i = 0; i < selectedArray.length; i++) {
							if( !selectpopup.isAlreadyExist(grid.selectedRecordList,selectedArray[i])
							&& (!selectpopup.checkIfRecordExist(grid.deSelectedRecordList,selectpopup.keyNode,selectedArray[i])) && selectedArray[i].isAssigned){
								grid.selectedRecordList.push(selectedArray[i]);
							}
							if(selectedArray[i].isAssigned)
							grid.tempSelectedRecord.push(selectedArray[i]);
						}
					}
				}
				 
						if (Ext.isEmpty(grid.selectedRecordList)
								&& (grid.selectedRecordList.length === 0)) {
							if (!Ext.isEmpty(objLinkedNode)) {
								for (var i = 0; i < objLinkedNode.length; i++) {
									grid.selectedRecordList
											.push(objLinkedNode[i]);
								}
							}
						}
				if (!Ext.isEmpty(grid)) {
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for ( var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
								for ( var j = 0; j < grid.selectedRecordList.length; j++) {
									if (selectpopup.isAlreadyExist(grid.selectedRecordList , item.data)) {
										isInSelectedr = true;
										break;
									}
								}
								if (isInSelectedr) {
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0) {
							grid.suspendEvent('beforeselect');
							grid.getSelectionModel().select(selectedRecords);
							grid.resumeEvent('beforeselect');
						}
					}
				}
				
			if (selectpopup.userMode == 'VIEW' || selectpopup.userMode == "MODIFIEDVIEW"
						|| selectpopup.userMode == "VERIFY" || (!Ext.isEmpty (checkValueEle) && checkValueEle.getAttribute('src').indexOf("/icon_checked.gif")!=-1)) {
						grid.getSelectionModel().setLocked(true);
				}
			me.fireEvent('selectionUpdated');
			var filterContainer = selectpopup.down('container[itemId="filterContainer"] AutoCompleter');
			if(!Ext.isEmpty(filterContainer))
	    	 filterContainer.focus();
	},
updateLoadSelection : function(grid, responseData, args) {
				var me = this;
				var objLinkedNode;
				if(!Ext.isEmpty(responseData) && responseData.d && responseData.d.linkedProducts){
					objLinkedNode = responseData.d.linkedProducts;
				}
			    if(grid.getSelectionModel().isLocked()){
				grid.getSelectionModel().setLocked(false);
				}
				var selectpopup = grid.up("pkgAssignmentPopupView");
				var checkValueEle=document.getElementById(selectpopup.checkboxId);
				var selectedArray = responseData.d[selectpopup.responseNode];
				if (!Ext.isEmpty (checkValueEle) &&  checkValueEle.getAttribute('src')=="static/images/icons/icon_checked.gif") {
					var selectedArray = responseData.d[selectpopup.responseNode];
					for ( var i = 0; i < selectedArray.length; i++) {
							grid.selectedRecordList.push(selectedArray[i]);	
							if(selectedArray[i].isAssigned)
							grid.tempSelectedRecord.push(selectedArray[i]);
					}
					
				} else{
					var selectedArray = responseData.d[selectpopup.responseNode];
					var addFlag=true;
					for ( var i = 0; i < selectedArray.length; i++) {
						if( !selectpopup.isAlreadyExist(grid.selectedRecordList,selectedArray[i])
						&& (!selectpopup.checkIfRecordExist(grid.deSelectedRecordList,selectpopup.keyNode,selectedArray[i])) && selectedArray[i].isAssigned){
							grid.selectedRecordList.push(selectedArray[i]);
						}
					
						if(selectedArray[i].isAssigned)
							grid.tempSelectedRecord.push(selectedArray[i]);
					}
		}
				 
				if(grid.selectedRecordList.length>0 && !Ext.isEmpty(objLinkedNode)){
					 grid.selectedRecordList=[];
					 grid.selectedRecordsListInDB=[];
					 if(!Ext.isEmpty(objLinkedNode)){
						 for(var i=0 ; i<objLinkedNode.length ; i++){
							 grid.selectedRecordList.push(objLinkedNode[i]);
							 grid.selectedRecordsListInDB.push(objLinkedNode[i]);
						 }
					 }
				 }
				if (!Ext.isEmpty(grid)) {
				
					var store = grid.getStore();
					var records = store.data;
					if (!Ext.isEmpty(records)) {
						var items = records.items;
						var selectedRecords = new Array();
						if (!Ext.isEmpty(items)) {
							for ( var i = 0; i < items.length; i++) {
								var item = items[i];
								var isInSelectedr = false;
								for ( var j = 0; j < grid.selectedRecordList.length; j++) {
									if (selectpopup.isAlreadyExist(grid.selectedRecordList,item.data)) {
										isInSelectedr = true;
										break;
									}
								}
								if (isInSelectedr) {
									selectedRecords.push(item);
								}
							}
						}
						if (selectedRecords.length > 0) {
							grid.suspendEvent('beforeselect');
						   grid.getSelectionModel().select(selectedRecords);
						   grid.resumeEvent('beforeselect');	
						}
					}
				}
				
			if (selectpopup.userMode == 'VIEW' || selectpopup.userMode == "MODIFIEDVIEW"
						|| selectpopup.userMode == "VERIFY" || (!Ext.isEmpty (checkValueEle) &&checkValueEle.getAttribute('src').indexOf("/icon_checked.gif")!=-1)) {
						grid.getSelectionModel().setLocked(true);
				}
			me.fireEvent('loadSelectionUpdated');
	},
	applyDefaultColumnRenderer : function(columnModel) {
		var me = this;
		if (!Ext.isEmpty(columnModel)) {
			for (var i = 0; i < columnModel.length; i++)
				if (columnModel[i].colId == 'packageDesc'
						&& Ext.isEmpty(columnModel[i].fnColumnRenderer))
					columnModel[i].fnColumnRenderer = function(value, meta,
							record, rowIndex, colIndex, store, view, colId) {
						var strRetValue = "";
						if (!Ext.isEmpty(record) && !Ext.isEmpty(record.raw)
								&& !Ext.isEmpty(record.raw.profileFieldType)) {
							if (record.raw.profileFieldType === "NEW"
									&& me.userMode == 'MODIFIEDVIEW')
								strRetValue = '<span class="newFieldGridValue">'
										+ value + '</span>';
							else if (record.raw.profileFieldType === "MODIFIED"
									&& me.userMode == 'MODIFIEDVIEW')
								strRetValue = '<span class="modifiedFieldValue">'
										+ value + '</span>';
							else if (record.raw.profileFieldType === "DELETED"
									&& me.userMode == 'MODIFIEDVIEW')
								strRetValue = '<span class="deletedFieldValue">'
										+ value + '</span>';
							else
								strRetValue = value;
						} else
							strRetValue = value;
						return strRetValue;
					}
		}
	}
	

});