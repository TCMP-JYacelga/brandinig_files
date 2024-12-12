Ext.define('Cashweb.view.portlet.FXRate', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.fxrate',
	requires : ['Cashweb.store.FXRateStore'],
	border : false,
	emptyText : null,
	cls : 'widget-grid',
	//minHeight : 336,
	height : 336,
	cols : 1,
	allRecordsFlag : false,
	ccyCode : '',
	selectedClientCode : '',
	enableQueryParam : false,
	titleId : '',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		thisClass.store = new Cashweb.store.FXRateStore();
		thisClass.on('refreshWidget', function() {
					thisClass.setLoading(label_map.loading);
					thisClass.ajaxRequest();
				});
		thisClass.on('boxready', function(component, eOpts) {
			thisClass.setLoading(label_map.loading);
		});
		thisClass.on('viewready', function(component, eOpts) {
//					thisClass.setLoading(label_map.loading);
					thisClass.ajaxRequest();
				});
		thisClass.on('columnhide', thisClass.handleStateChange);
		thisClass.on('columnmove', thisClass.handleStateChange);
		thisClass.on('columnshow', thisClass.handleStateChange);
		thisClass.on('sortchange', thisClass.handleStateChange);
		thisClass.on('lockcolumn', function(ct, colmn, width, opts) {
					thisClass.handleStateChange(ct, colmn, width, opts)
				});
		thisClass.on('unlockcolumn', function(ct, colmn, width, opts) {
					thisClass.handleStateChange(ct, colmn, width, opts)
				});
		var objDefaultArr = [{
					header : getLabel("ccy", "Currency Pair"),
					dataIndex : 'ccyType',
					align : 'left',
					flex : 25,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false					
				}, {
					header : getLabel("buyRate", "Buy Rate"),
					dataIndex : 'buy_fx_rate',
					align : 'right',
					flex : 25,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
				}, {
					header : getLabel("sellRate", "Sell Rate"),
					dataIndex : 'sell_fx_rate',
					align : 'right',
					flex : 25,
					hidden : false,
					sortable : false,
					hideable : false,
					menuDisabled:true,
					draggable :false,
					resizable : false
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
		thisClass.callParent();
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
					menuDisabled:true,
					draggable :false,
					resizable : false,
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
	ajaxRequest : function() {
		var thisClass = this;
		var strUrl = '';
		var isFilterapplied = false;
		if (thisClass.allRecordsFlag) {
			strUrl = strUrl + '?$allRecords=Y';
			isFilterapplied = true;
		}
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
					url : 'services/getExchangeRates.json',
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
		var me = this;
		var storeData = [];
		var arrData = data.summary;
		if (!Ext.isEmpty(arrData)) {
			for (var i = 0; i < arrData.length ; i++) {
				var colJson = {};
				if (arrData[i]) {
					var brate = parseFloat(arrData[i].buy_fx_rate);
					var srate = parseFloat(arrData[i].sell_fx_rate);
					colJson["ccyType"] = arrData[i].from_ccy + '-'
							+ arrData[i].to_ccy;
					colJson["buy_fx_rate"] = brate.toFixed(strRatePrecision);
					colJson["sell_fx_rate"] = srate.toFixed(strRatePrecision);
					colJson["fx_rate"] = arrData[i].fx_rate;
				}
				storeData.push(colJson);
			}
		}
		me.getStore().loadData(storeData);
		if (data.fxMode === 'M') {
			var columnModel = [{
						header : getLabel("currency", "Currency"),
						dataIndex : 'ccyType',
						sortable : false,
						hideable : false,
						menuDisabled:true,
						draggable :false,
						resizable : false,						
						align : 'left',
						flex : 60,
						hidden : false
					}, {
						header : getLabel("MIDRate", "MID Rate"),
						dataIndex : 'fx_rate',
						align : 'right',
						sortable : false,
						flex : 40,
						hidden : false
					}]
			me.reconfigure(me.getStore(), columnModel);
		}
		me.setLoading(false);
	},
	setRefreshLabel : function() {
		var thisClass = this;
		$("#" + thisClass.titleId).empty();
		var label = Ext.create('Ext.form.Label', {
					text : getLabel('asof','As of ')+ displaycurrenttime(),
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
	}
});
