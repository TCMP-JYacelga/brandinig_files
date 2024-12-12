Ext.define('GCP.view.CreateAlertPopup', {
	extend : 'Ext.window.Window',
	xtype : 'copyProfileSeek',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.data.Store' ],
	width : 450,
	height : 300,
	modal : true,
	draggable : true,
	closeAction : 'hide',
	autoScroll : true,
	config : {

	},

	initComponent : function() {
		var me = this;
		var colModel = me.getColumns();
		packageFilterfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
			padding : '1 0 0 0',
			fieldCls : 'xn-form-text w12 xn-suggestion-box',
			itemId : 'packageFilter',
			cfgUrl : 'services/getEventTemplateList.json',
			cfgQueryParamName : 'qfilter',
			cfgRecordCount : -1,
			cfgSeekId : 'eventTemplateSeek',
			cfgProxyMethodType : 'POST',
			cfgRootNode : 'd.manageAlerts',
			cfgDataNode1 : 'subscriptionDesc'
		});

		adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
			xtype : 'profileListView',
			itemId : 'profileListView',
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : false,
			padding : '5 0 0 0',
			minHeight : 150,
			pageSize : 5,
			columnModel : colModel,
			storeModel : {
				fields : [ 'subscriptionName', 'subscriptionDesc',
						'identifier', 'moduleName', 'moduleCode' ],
				proxyUrl : 'services/getEventTemplateList.json',
				rootNode : 'd.manageAlerts',
				totalRowsNode : 'd.__count'
			},
			listeners : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
				}
			},
			checkBoxColumnRenderer : function(value, metaData, record,
					rowIndex, colIndex, store, view) {

			}

		});

		me.items = [ {
			xtype : 'container',
			layout : 'hbox',
			items : [ packageFilterfield, {
				xtype : 'button',
				itemId : 'btnSearchPackage',
				text : getLabel('search', 'Search'),
				cls : 'xn-button',
				margin : '4 0 0 15',
				handler : function() {
					me.searchPackages();
				}
			} ]
		}, adminListView ];
		adminListView.on('cellclick', function(view, td, cellIndex, record, tr,
				rowIndex, e, eOpts) {
			var linkClicked = (e.target.tagName == 'SPAN');
			if (linkClicked) {
				var className = e.target.className;
				if (!Ext.isEmpty(className)
						&& className.indexOf('activitiesLink') !== -1) {
					me.selectProfile(me, record.get('subscriptionName'),record.get('moduleCode'));
				}
			}
		});
		me.buttons = [ {
			xtype : 'button',
			text : getLabel('cancel', 'Cancel'),
			cls : 'xn-button',
			handler : function() {
				me.close();
			}
		} ];
		me.callParent(arguments);
	},

	getColumns : function() {
		arrColsPref = [ {
			"colId" : "subscriptionDesc",
			"colDesc" : getLabel('name', 'Name')
		}, {
			"colId" : "moduleName",
			"colDesc" : getLabel('module', 'Module')
		} ];
		objWidthMap = {
				"subscriptionDesc" : 250,
				"moduleDesc" : 103
			};
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
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

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
				? objWidthMap[objCol.colId]
				: 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";

		if (colId === 'col_subscriptionDesc') {

			strRetValue = '<span class="activitiesLink underlined">' + value
					+ '</span>';
		} else {
			strRetValue = value;
		}

		return strRetValue;
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if (!Ext.isEmpty(packageFilterfield.getValue())) {
			strUrl = strUrl + '&qfilter=' + packageFilterfield.getValue();
		}
		grid.loadGridData(strUrl, null, null, false);
	},

	selectProfile : function(parent, profileId,moduleCode) {
		var form, inputField;
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'profileId',
				profileId));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'moduleCode',
				moduleCode));

		form.action = 'addCustomAlerts.srvc';

		form.submit();
		parent.close();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	searchPackages : function() {
		adminListView.refreshData();
	}
});
