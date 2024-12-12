Ext.define('Cashweb.view.portlet.UserActivity', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.useractivity',
	requires : ['Cashweb.store.UserActivityStore','Cashweb.view.portlet.UserActivityDetailPopup','Ext.ux.gcp.SmartGrid'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	taskRunner : null,
	userId : '',
	cols : 2,
	minHeight : 336,
	enableQueryParam : false,
	titleId : '',
	objActivityDtlPopup : null,
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.UserActivityStore();

		thisClass.objActivityDtlPopup = Ext.create(
				'Cashweb.view.portlet.UserActivityDetailPopup', {
					itemId : 'gridActivityDtl'

				});
		thisClass.objActivityDtlPopup.center();
		
		thisClass.on('columnhide', thisClass.handleStateChange);
		thisClass.on('columnmove', thisClass.handleStateChange);
		// TODO
		// thisClass.on('columnresize', thisClass.handleStateChange);
		thisClass.on('columnshow', thisClass.handleStateChange);
		thisClass.on('sortchange', thisClass.handleStateChange);
		thisClass.on('lockcolumn', function(ct, colmn, width, opts) {
					thisClass.handleStateChange(ct, colmn, width, opts)
				});
		thisClass.on('unlockcolumn', function(ct, colmn, width, opts) {
					thisClass.handleStateChange(ct, colmn, width, opts)
				});

		thisClass.on('cellclick', function(me, td, cellIndex, record, tr,
						rowIndex, e, eOpts) {
					thisClass.showViewActivity(record);
				});

		thisClass.on('refreshWidget', function() {
					var settings = [];
					var filterUrl = '', userIdPresent = false;
					var record = thisClass.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'userId') {
							thisClass.userId = settings[i].value1;
							userIdPresent = true;
						}
					}
					if (!userIdPresent)
						thisClass.userId = '';
					thisClass.setLoading(label_map.loading);
					thisClass.ajaxRequest(settings);
				});

		thisClass.on('boxready', function(component, eOpts) {
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
					var settings = [];
					var filterUrl = '', userIdPresent = false;
					var record = thisClass.record;
					if (!Ext.isEmpty(record.get('settings'))) {
						settings = record.get('settings');
					}
					for (var i = 0; i < settings.length; i++) {
						if (settings[i].field === 'userId') {
							thisClass.userId = settings[i].value1;
							userIdPresent = true;
						}
					}
					if (!userIdPresent)
						thisClass.userId = '';
//					thisClass.setLoading(label_map.loading);
					thisClass.ajaxRequest(settings);
				});
		var objDefaultArr = [{
					header : getLabel("userName", "User Name"),
					dataIndex : 'USER_NAME',
					align : 'left',
					flex : 22,
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hideable : false
				}, {
					header : (clientSso == 'Y' && autousrcode != 'PRODUCT') ? getLabel( 'ssoUserId', 'SSO User ID' ) : getLabel( 'loginId', 'Login ID' ),
					dataIndex :(clientSso == 'Y' && autousrcode != 'PRODUCT') ? 'SSO_USERID' : 'USER_CODE' ,
					align : 'left',
					flex : 22,
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hideable : false
				}, {
					header : getLabel("lastLoginTime", "Last Login Time"),
					dataIndex : 'LOGIN_DATETIME',
					align : 'left',
					flex : 29,
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hideable : false
				}, {
					header : getLabel("lastLogoutTime", "Last Logout Time"),
					dataIndex : 'LOGOUT_DATETIME',
					align : 'left',
					flex : 27,
					sortable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false,
					hideable : false
				}];

		var settings = thisClass.record.get('settings');
		var arrColPref = [];
		for (var i = 0; i < settings.length; i++) {
			if (settings[i].field === 'colPref') {
				arrColPref = settings[i].value1.columns;
				break;
			}
		}		
		var columnModel = (!Ext.isEmpty(arrColPref))
				? arrColPref
				: objDefaultArr;
		for (var i = 0; i < columnModel.length; i++) {
			columnModel[i].renderer = function(val, metadata, record) {
				metadata.tdAttr = 'title="' + (val) + '"';
				metadata.style = 'cursor: pointer;';
				return val;
			}
		}
 				
		thisClass.columns = columnModel;
		
		this.dockedItems = [{
			xtype : 'toolbar',
			dock : 'bottom',
			overCls : 'widgetTable-footer',
			layout : {
				pack : 'center',
				type : 'hbox'
			},
			items : [{
				type : 'button',
				text : getLabel("seeMore", "See More"),
				cls : 'widget-footer-cls',
				handler : function() {
					var filter = thisClass.strFilter;
					thisClass.fireEvent('seeMoreRecords', filter,
							thisClass.record.get('settings'));
				}

			}]
		}];
		
		this.callParent();
	},
	showViewActivity : function(record) {
		var me = this;
		me.handleUsrActSmartGridConfig(record);
		if (!Ext.isEmpty(me.objActivityDtlPopup)) {
			if(clientSso == 'Y' && autousrcode !== 'PRODUCT'){
				me.objActivityDtlPopup.down('label[itemId=usercodesso]')
						.setText(record.raw.SSO_USERID);				
			} else{
				
				me.objActivityDtlPopup.down('label[itemId=usercode]')
						.setText(record.raw.USER_CODE);
			}
			me.objActivityDtlPopup.down('label[itemId=username]')
					.setText(record.raw.USER_NAME);
			me.objActivityDtlPopup.down('label[itemId=logintime]')
					.setText(record.raw.LOGIN_DATETIME);
			me.objActivityDtlPopup.down('label[itemId=logouttime]')
					.setText(record.raw.LOGOUT_DATETIME);
			me.objActivityDtlPopup.down('label[itemId=userCategory]')
			.setText(record.raw.USRCATEGORY);
			me.objActivityDtlPopup.down('label[itemId=clientName]')
			.setText(record.raw.CLIENT_DESC);
			var strRetValue = record.get('userType');
				strRetValue = "Customer";
			
			me.objActivityDtlPopup.down('label[itemId=userType]')
			.setText(strRetValue);
			
			me.objActivityDtlPopup.show();

		} else {
			me.objActivityDtlPopup = Ext.create(
					'Cashweb.view.portlet.UserActivityDetailPopup', {
						user_code : (clientSso == 'Y' && autousrcode != 'PRODUCT') ? record.raw.SSO_USERID : record.raw.USER_CODE,
						user_name : record.raw.USER_NAME,
						login_time : record.raw.LOGIN_DATETIME,
						logout_time : record.raw.LOGOUT_DATETIME,
						user_category : record.raw.USRCATEGORY,
						client_name : record.raw.CLIENT_DESC,
						user_type : "Customer"
					});
			me.objActivityDtlPopup.show();
			me.objActivityDtlPopup.center();
		}
		//me.refreshData();
	},
	handleUsrActSmartGridConfig : function(record) {
		var me = this;
		var activityDtlGrid = me.objActivityDtlPopup.down('grid[itemId="gridActDtlItemId"]');
		var objConfigMap = me.getActivityDtlConfiguration(record);
		var arrCols = [];
		arrCols = me.getActDtlColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		if (!Ext.isEmpty(activityDtlGrid))
			activityDtlGrid.destroy(true);
		me.handleActivityDtlSmartGridLoad(arrCols, objConfigMap.storeModel,
				record);
	},
	getActivityDtlConfiguration : function(record) {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
				"loginTime" : 210,
				"logoutTime" : 210,
				"loginStatus" : 140
				};
		
		arrColsPref = [
		{
			"colId" : "loginTime",
			"colDesc" : getLabel("lbl.userActivity.grid.lastLoginTime","Last Login Time")
		},
		{
			"colId" : "logoutTime",
			"colDesc" : getLabel("lbl.userActivity.grid.lastLogoutTime","Last Logout Time")
		},{
			"colId" : "loginStatus",
			"colDesc" : getLabel("lblstatus","Status")
		}/*,
		{
			"colId" : "userType",
			"colDesc" : "User Type"
		}*/];
		
		var userCode = record.data.USER_CODE;
		var gridUrl = 'userActivityGridList/'+userCode+'.srvc';

		storeModel={
			fields : ['userCode', 'userName', 'userCategory',
						'corporationName', 'clientName', 'loginTime',
						'logoutTime', 'loginStatus', 'identifier','requestState','validFlag','channel','userType',
						'__metadata', 'sessionId'],
			proxyUrl : gridUrl,
			rootNode : 'd.activitylist',
		    totalRowsNode : 'd.__count'
		}

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
	getActDtlColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createActDtlActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 150;
				//cfgCol.width = 120;
				//cfgCol.width = 150;
				cfgCol.fnColumnRenderer = me.detailColumnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	handleActivityDtlSmartGridLoad : function(arrCols, storeModel, parentRecord) {
		var me = this;
		var pgSize = null;
		var userActivityDtlGrid = null;
		pgSize = 5;
		var userActivityPopupDtlId = me.objActivityDtlPopup;
		var userActivityDtlGrid = Ext.getCmp('gridActDtlItemId');

		if (typeof userActivityDtlGrid == 'undefined') {
			userActivityDtlGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
						id : 'gridActDtlItemId',
						itemId : 'gridActDtlItemId',
						pageSize : pgSize,
						autoDestroy : true,
						stateful : false,
						showEmptyRow : false,
						scroll : 'vertical',
						cls : 't7-grid',
						//showSummaryRow : true,
						padding : '5 0 0 0',
						showCheckBoxColumn : false,
						//enableColumnAutoWidth : true,
						rowList : [5, 10, 15, 20, 25, 30],
						minHeight : 'auto',
						maxHeight : 300,
						columnModel : arrCols,
						storeModel : storeModel,
						isRowIconVisible : me.isRowIconVisible,
						rowNumbererColumnWidth : 65,
						isRowMoreMenuVisible : false,
						// handleRowMoreMenuClick : me.handleRowMoreMenuClick,
						handleRowIconClick : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							me.handleRowIconClick(tableView, rowIndex,
									columnIndex, btn, event, record);
						},
						listeners : {
							render : function(grid) {
								me.handleActDtlLoadGridData(grid,grid.store.dataUrl,
										userActivityDtlGrid.pageSize, 1, 1,
										null, parentRecord);
							},
							gridPageChange : function(grid, strUrl, pageSize,
									newPgNo, oldPgNo, sorters) {
								me
										.handleActDtlLoadGridData(grid,grid.store.dataUrl,
												pageSize, newPgNo, oldPgNo,
												sorters, parentRecord);
							},
							gridSortChange : function(grid, strUrl, pageSize,
									newPgNo, oldPgNo, sorters) {
								me
										.handleActDtlLoadGridData(grid,grid.store.dataUrl,
												pageSize, newPgNo, oldPgNo,
												sorters, parentRecord);
							},
							pagechange : function(pager, current, oldPageNum) {
								/*me.handleComboPageSizeChange(pager, current,
										oldPageNum);*/
							}
						}
					});
			userActivityDtlGrid.view.refresh();
			userActivityPopupDtlId.add(userActivityDtlGrid);
			userActivityPopupDtlId.doLayout();
		}
		// me.handleActDtlLoadGridData(userActivityDtlGrid,
		// userActivityDtlGrid.pageSize, 1, 1, parentRecord );
	},
	handleStateChange : function(ct, colmn, width, opts) {
		var thisClass = this;
		thisClass.up('panel').fireEvent('statechanged', thisClass.record,
				thisClass.getGridState())
	},
	getGridState : function() {
		var me = this;
		var arrCols = null, objCol = null, objCfg = null, arrColPref = null, objState = {};
		arrCols = me.headerCt.getGridColumns();
		arrColPref = new Array();
		for (var j = 0; j < arrCols.length; j++) {
			objCol = arrCols[j];
			if (!Ext.isEmpty(objCol)) {
				objCfg = {
					dataIndex : objCol.dataIndex,
					header : objCol.text,
					hidden : objCol.hidden,
					flex : objCol.flex,
					sortable : objCol.sortable,
					align : objCol.align
				};
				if (!Ext.isEmpty(objCol.locked))
					objCfg.locked = objCol.locked;
				arrColPref.push(objCfg);
			}
		}
		objState['columns'] = arrColPref;
		return objState;
	},

	ajaxRequest : function(settings) {
		var thisClass = this;
		var strUrl = '';
		thisClass.setTitle(settings);
		if (!Ext.isEmpty(thisClass.userId))
			strUrl = strUrl + '?userId=' + thisClass.userId;

		if (strUrl.charAt(0) == "?") { //remove first qstnmark
			strUrl = strUrl.substr(1);
		}
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = strUrl || {}, arrMatches;
		if (thisClass.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
			}
		}
		Ext.Ajax.request({
					url : 'services/getUserActivityDetails.json',//strUrl,
					method : 'POST',
					params : objParam,
					success : function(response) {
						obj = Ext.decode(response.responseText);
						thisClass.loadData(obj);
						thisClass.setRefreshLabel();
					},
					failure : function(response) {
						thisClass.getTargetEl().unmask();
						thisClass.setLoading(false);
					}
				});

	},

	loadData : function(data) {
		var thisClass = this;
		var storeData = [];
		var arrData = [];
		if(!Ext.isEmpty(data))
		{
			arrData = data.d.activitylist;
		}
		if (arrData.length < 5) {
			var fbarInstance = this.down('toolbar');
			fbarInstance.hide();
		}
		if (arrData.length >= 5) {
			var fbarInstance = this.down('toolbar');
			fbarInstance.show();
		}
		Ext.each(arrData, function(object, index) {
			var colJson = {};
			colJson["USER_NAME"] = object.userName;
			colJson["USER_CODE"] = object.userCode;
			colJson["SSO_USERID"] = object.ssoUserid;
			colJson["USRCATEGORY"] = object.userCategory;
			colJson["USRCORPORATION"] = object.corporationName;
			colJson["SESSION_ID"] = object.sessionId;
			colJson["REQUEST_STATE"] = object.requestState;
			colJson["VALID_FLAG"] = object.validFlag;
			if(object.successfulAttempt == 'Y'){
				if(object.loginStatus === "Y"){
					colJson["LOGIN_DATETIME"] = object.loginTime;
					if(object.logoutTime) {
						colJson["LOGOUT_DATETIME"] = object.logoutTime;
					} else {
						colJson["LOGOUT_DATETIME"] = getLabel("Active","Active");
					}
				}else{
					colJson["LOGIN_DATETIME"] = object.loginTime;
					colJson["LOGOUT_DATETIME"] = object.logoutTime;				
				}	
			}
			else if(object.successfulAttempt == 'N'){
				if(object.loginStatus === "Y"){
					colJson["LOGIN_DATETIME"] = object.loginTime;
					colJson["LOGOUT_DATETIME"] = "Active";
				}
				else{
					colJson["LOGIN_DATETIME"] = object.loginTime;
					colJson["LOGOUT_DATETIME"] = object.logoutTime;				
				}	
			}else{
				colJson["LOGIN_DATETIME"] = "Failed";
				colJson["LOGOUT_DATETIME"] = "";
			}
			
			//colJson["LOGOUT_DATETIME"] = object.logoutTime;	
			colJson["CORPORATION_NAME"] = object.corporationName;
			colJson["CLIENT_DESC"] = object.clientName;
			colJson["CURRENTLOGINTIME"] = object.currentLoginDate;
			storeData.push(colJson);
				});
		thisClass.getStore().loadData(storeData);
		thisClass.setLoading(false);
	},
	setRefreshLabel : function() {
		var thisClass = this;
		$("#" + thisClass.titleId).empty();
		var label = Ext.create('Ext.form.Label', {
					text : getLabel('asof','As of ') + displaycurrenttime(),
					margin : '0 0 0 5',
					style : {
						'font-size' : '14px !important',
						'font-weight' : 'bold',
						'position' : 'absolute',
						'right' : '50px',
						'color' : '#67686b'
					},
					renderTo : Ext.get(thisClass.titleId)
				});
	},
	showSettingsPopup : function(widgetCode, titleforsettings, record) {
		var me = this;
		var portletSettings = Ext.create('Ext.window.Window', {
					record : record,
					//minHeight : 200,
					cls : 'settings-popup xn-popup',
					buttonAlign : 'center',
					itemId : widgetCode + 'SettingsPanel',
					title : titleforsettings,
					autoHeight : true,
					/*width : 380,*/
					minHeight : 156,
					maxHeight : 550,
					width  : (screen.width) > 1024 ? 580 : 578,
					modal : true,
					resizable : false,
					draggable : false,
					items : me.getSettingsPanel(),
					listeners : {
						resize : function(){
							this.center();
						}
					},
					bbar : [{
								text : getLabel("cancel", "Cancel"),
								handler : function() {
									this.up('window').close();
								}
							}, '->', {
								text : getLabel("save", "Save"),
								handler : function() {
									var settings = me.getSettings(this
											.up('window'));
									var userIdPresent = false;
									me.record.set('settings', settings);
									me.setLoading(label_map.loading);
									for (var i = 0; i < settings.length; i++) {
										if (settings[i].field === 'userId') {
											me.userId = settings[i].value1;
											userIdPresent = true;
										}
									}
									if (!userIdPresent)
										me.userId = '';
									me.up('panel').fireEvent('saveSettings',
											record, settings);
									this.up('window').close();
									me.ajaxRequest(settings);
								}
							}]
				});
		portletSettings.show();
		me.setSettings(portletSettings, me.record.get('settings'));
	},
	setTitle : function(settings) {
		var me = this;
		var titleChangeFlag = false;
		for (var i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			if (fieldName === 'customname' && !Ext.isEmpty(fieldVal)) {
				me.up('panel').setTitle(fieldVal + '<span id=' + me.titleId
						+ '>&nbsp;&nbsp;</span> ');
				titleChangeFlag = true;
				break;
			}
		}
		if (!titleChangeFlag) {
			var defaultTitle = label_map[me.record.get('widgetCode')
					.toLowerCase()];
			me.up('panel').setTitle(defaultTitle + '<span id=' + me.titleId
					+ '>&nbsp;&nbsp;</span> ');
		}
	},
	getSettingsPanel : function() {
		var thisClass = this;
		var settingsPanel = Ext.create('Ext.panel.Panel', {
					items : [{
						xtype : 'container',
						layout : {
							//type : 'vbox',//'hbox',
							type : 'column',
							pack : 'center'
						},
						flex : 1,
						cls : 'ft-padding-bottom',
						items : [{
									xtype : 'AutoCompleter',
									cls : 'ft-padding-bottom',
									//flex : 0.75,
									width  : (screen.width) > 1024 ? 220 : 220,
									fitToParent : true,
									fieldCls : 'xn-form-text xn-suggestion-box',
									labelCls : 'frmLabel',
									fieldLabel : getLabel("userId", "User ID"),
									emptyText : getLabel('searchUserId', 'Search By User ID'),
									labelAlign : 'top',
									labelSeparator : '',
									itemId : 'userId',
									name : 'userId',
									cfgUrl : 'services/userseek/corpuser.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'userId',
									cfgRootNode : 'd.preferences',
									cfgDataNode1 : 'CODE',
									cfgDataNode2 : 'DESCR',
									cfgKeyNode : 'CODE'

								}, {
									xtype : 'container',
									layout : 'hbox',
									cls : 'ft-padding-bottom',
									//flex : 0.75,
									items : [{
										xtype : 'textfield',
										hideTrigger : true,
										width  : (screen.width) > 1024 ? 220 : 220,
										padding : '0 0 0 50',
										labelAlign : 'top',
										labelSeparator : '',
										fieldLabel : getLabel("widgetName",
												"Widget Name"),
										itemId : 'customname',
										fieldCls : 'xn-form-text',
										labelCls : 'frmLabel',
										name : 'customname',
										maxLength : 20, // restrict user to enter 25 chars max instead of 40 bcoz As of time not displaying 
										enforceMaxLength : true,
										maskRe : /[A-Za-z0-9 .]/
									}]
								}, {
									xtype : 'container',
									layout : 'hbox',
									flex : 0.24,
									items : []
								}]
					}]
				});
		return settingsPanel;
	},
	setSettings : function(widget, settings) {
		for (i = 0; i < settings.length; i++) {
			fieldName = settings[i].field;
			fieldVal = settings[i].value1;
			fieldVal2 = settings[i].value2;
			operatorValue = settings[i].operator;

			if (fieldName === 'userId') {
				var userField = widget.down('AutoCompleter[itemId=userId]');
				if (!Ext.isEmpty(userField)) {
					if (!Ext.isEmpty(fieldVal))
						userField.setValue(fieldVal);
				}
			}

			if (fieldName === 'customname') {
				var customnameField = widget
						.down('textfield[itemId=customname]');
				if (!Ext.isEmpty(customnameField)) {
					if (!Ext.isEmpty(fieldVal))
						customnameField.setValue(fieldVal);
				}
			}

		}
	},
	getSettings : function(portletPanel) {
		var me = portletPanel;
		var jsonArray = [];

		// User Id
		var userId = me.down('AutoCompleter[itemId="userId"]').getValue();
		if (!Ext.isEmpty(userId) && userId != '') {
			jsonArray.push({
						field : 'userId',
						operator : 'eq',
						value1 : userId,
						dataType : 0,
						displayType : 6
					});
		}

		// custom Name
		var customnameValue = me.down('textfield[itemId="customname"]')
				.getValue();
		if (!Ext.isEmpty(customnameValue)) {
			jsonArray.push({
						field : 'customname',
						operator : 'eq',
						value1 : customnameValue,
						dataType : 0,
						displayType : 6
					});
		}

		return jsonArray;
	},

	handleActDtlLoadGridData : function(grid,url, pgSize, newPgNo, oldPgNo,
			sorter, record) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl(me.subGroupInfo,me.groupInfo, record);
		strUrl = strUrl + '&' + csrfTokenName + '=' + csrfTokenValue;
		//strUrl = strUrl + '& loginDate eq ' + record.data.LOGIN_DATETIME;
		grid.loadGridData(strUrl, null);
	},
	getFilterUrl : function(subGroupInfo, groupInfo, record) {
		var me = this;
		var indexofSpace = (record.data.LOGIN_DATETIME).indexOf(' ');
		var strAppDate = (record.data.LOGIN_DATETIME).substring(0,indexofSpace);
		var date = new Date(Ext.Date.parse(strAppDate, strExtApplicationDateFormat));		
		var logindt = Ext.Date.format(date, 'Y-m-d');
		
		var strUrl = '';
		if (Ext.isEmpty(strUrl)) {
			strUrl = '&$filter=';
			strUrl = strUrl + "bankUserFlag eq '1' ";
			strUrl = strUrl + "and loginTime eq date'" + logindt +"'";
			return strUrl;
		}
	},

	detailColumnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = value;
		var showIcons = false;
		if (colId === 'col_loginStatus') {
			if(record.data.loginStatus=='Y')
				strRetValue=getLabel("Online","Online");
			else 
				strRetValue=getLabel("Disabled","Disabled");
		}
		/*if(colId === 'col_channel'){
			strRetValue = "Web";
		}	*/	

		return strRetValue;
	}
});