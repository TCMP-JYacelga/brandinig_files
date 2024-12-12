Ext.define('GCP.controller.InterestRateAppDtlController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.SmartGrid'],
	views : ['GCP.view.InterestRateApplicationDtlView','GCP.view.InterestRateApplicationGridDtlView','Ext.util.Point'],
	refs : [{
		ref : 'interestRateApplicationView',
		selector : 'interestRateApplicationDtlView'
	}, {
		ref : 'interestRateApplicationGridDtlView',
		selector : 'interestRateApplicationDtlView interestRateApplicationGridDtlView'
	}, {
		ref : 'interestRateApplicationDtlView',
		selector : 'interestRateApplicationDtlView interestRateApplicationGridDtlView panel[itemId="transactionsDtlView"]'
	},{
		ref : 'interestRateApplicationGrid',
		selector : 'interestRateApplicationDtlView interestRateApplicationGridDtlView grid[itemId="gridViewMstId"]'
	},{
		ref : 'gridHeader',
		selector : 'interestRateApplicationDtlView interestRateApplicationGridDtlView panel[itemId="transactionsDtlView"] container[itemId="gridHeader"]'
	},{
		ref : 'actionBar',
		selector : 'interestRateApplicationDtlView interestRateApplicationGridDtlView interestRateApplicationActionBarDtlView'
	}],
	
	config :{
		filterData : [],
		statusFilter : ''
	},
	
	init : function() {
		var me = this;
		enteredByClient = $('#enteredByClient').val();
		fileName = $('#fileName').val();
		me.control({
			'interestRateApplicationGridDtlView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'interestRateApplicationGridDtlView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					 me.enableValidActionsForGrid(grid, record, recordIndex,
							 records, jsonData);
				}
			},
			'interestRateApplicationDtlView interestRateApplicationGridDtlView panel[itemId="transactionsDtlView"]' : {
				render : function() {
					//me.handleGridHeader();
				}
			},
			
			'interestRateApplicationDtlView interestRateApplicationGridDtlView toolbar[itemId=interestRateReqActionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}
		});
	},
	
	handleSmartGridConfig : function() {
		var me = this;
		var interestRateAppGrid = me.getInterestRateApplicationGrid();
		var objConfigMap = me.getInterestRateAppGridConfiguration();
		var arrCols = new Array();
		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		if (!Ext.isEmpty(interestRateAppGrid))
			interestRateAppGrid.destroy(true);

		 arrCols = me.getColumns(objConfigMap.arrColsPref,
		 objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
	},
	
	getInterestRateAppGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
			"invFinIntRefNmbr" : 100,
			"invAmount" : 100,
			"finreqEntryDate" : 100,
			"loanType" : 100
		};

			arrColsPref = [{
					"colId" : "invFinIntRefNmbr",
					"colDesc" : getLabel('invFinIntRefNmbr','Request #'),
					"sort":true
				},{
					"colId" : "invAmnt",
					"colDesc" : getLabel('invAmnt','Finance Amount'),
					"colType" : 'number',
					"sort":true
				},{
					"colId" : "finreqEntryDate",
					"colDesc" : getLabel('finreqEntryDate','Request Date'),
					"colType" : 'number',
					"sort":true
				},{
					"colId" : "loanType",
					"colDesc" : getLabel('loanType','Loan Type'),
					"sort":true
				}];

		storeModel = {
			fields : ['invFinIntRefNmbr', 'invAmnt', 'finreqEntryDate', 'loanType','identifier'],
			proxyUrl : 'interestRateDetailGridList.srvc',
			rootNode : 'd.interestRateApplDetail',
			totalRowsNode : 'd.__count'
		};

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		interestRateGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			padding : '5 10 10 10',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			showCheckBoxColumn : false,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			enableColumnAutoWidth : true,

			handleRowIconClick : function(tableView, rowIndex,
					columnIndex, btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex,
					btn, event, record);
			},

			 handleMoreMenuItemClick : function(grid, rowIndex,
					 cellIndex, menu, event, record) {
				 var dataParams = menu.dataParams;
					 me.handleRowIconClick(dataParams.view,
						 dataParams.rowIndex, dataParams.columnIndex,
						 menu, null, dataParams.record);
			 }
		});
		var interestRateApplicationDtlView = me.getInterestRateApplicationDtlView();
		interestRateApplicationDtlView.add(interestRateGrid);
		interestRateApplicationDtlView.doLayout();
	},
	
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&'+csrfTokenName+'='+csrfTokenValue;
		strUrl = strUrl + '&$filter= enteredByClient eq \''+enteredByClient+'\' and fileName eq \''+fileName+'\'';
		grid.loadGridData(strUrl, null);
	},
	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createGroupActionColumn());
		if(screenMode != 'ADD')
			arrCols.push(me.createActionColumn());
		
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.draggable = true;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.sortable = objCol.sort;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		
		if (actionName === 'btnView') 
			me.submitForm('viewInterestRateApplicationDetail.srvc', record, rowIndex);		
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		return true;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 50,
			locked : true,
			sortable: false,
			lockable: false,
			draggable : true,
			items : [{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip :  getLabel('viewToolTip','View Record')
						//maskPosition : 7
					}]
		};
		return objActionCol;

	},
	
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var updateIndex = rowIndex;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'MODE',
				screenMode));
		
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
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