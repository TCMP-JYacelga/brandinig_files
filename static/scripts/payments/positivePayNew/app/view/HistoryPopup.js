/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup',{
	extend : 'Ext.window.Window',
	historyUrl : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 550,
	maxWidth : 735,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	//height : 250,
	minHeight : 156,
	maxHeight : 550,
	/**
	 * @cfg {String} layout In order for child items to be correctly sized and
	 *      positioned, typically a layout manager must be specified through the
	 *      layout configuration option. layout may be specified as either as an
	 *      Object or as a String:
	 */
	/**
	 * @cfg {boolean} modal True to make the window modal and mask everything
	 *      behind it when displayed, false to display it without restricting
	 *      access to other UI elements. Defaults to: false
	 */
	modal : true,
	cls:'xn-popup',
	resizable : false,
	draggable : false,
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	config : {
		historyData : []
	},

	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) { 
			Ext.apply(this, {
						title : getLabel('historyPopUpErrorTitle',
								'Error'),
						html : getLabel('historyPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,this.identifier);
			this.title = getLabel('uploadHistoryTitle', 'Positive Pay Decision History');

			this.items = [ {
				xtype : 'grid',
				maxHeight : 400, 
				cls : 't7-grid',
				scroll : 'vertical',
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns : [{
							dataIndex : 'label',
							sortable : false,
							menuDisabled : true,
							text : getLabel('HistoryDescription', 'Description'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
			            }
						}, {
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('HistoryMstMaker', 'Maker'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
			            }
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('HistoryMstChecker', 'Checker'),
							renderer : function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
			            }
						}]
			}];

			this.bbar = [{
						text : getLabel('btnClose', 'Close'),//getLabel('btnOk', 'Ok'),
						handler : function() {
							thisClass.close();
						}
					}];
		}

		this.callParent();
	},

	loadHistoryData : function(historyUrl,identifier) {
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request({
			url : historyUrl,
			method : 'POST',
			jsonData : Ext.encode(identifier),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				data = data.d.positivePay[0];
				var makerStamp, checkerStamp, checkerId,time;
				if (!Ext.isEmpty(data.makerDate)) {
					makerStamp = data.makerDate;
					//time = makerStamp.toLocaleTimeString();
					//makerStamp = Ext.Date.format(makerStamp,strExtApplicationDateFormat);	
					makerStamp = makerStamp;
				}
				if (!Ext.isEmpty(data.checkerId)) {
					checkerId = data.checkerId;
				}
			
				if (!Ext.isEmpty(data.checkerDate))
				{
					checkerStamp = data.checkerDate;
					//time = checkerStamp.toLocaleTimeString();
					//checkerStamp = Ext.Date.format(checkerStamp,strExtApplicationDateFormat);
					checkerStamp=checkerStamp;
				}

				var historyData = [
						[
								getLabel('HistoryPopUpUser',
										'User'), data.makerId, checkerId],
						[getLabel('HistoryPopUpdateDate', 'Date Time'),
						 		makerStamp,checkerStamp],
						[getLabel('HistoryPopUpdateRemark', 'Remark'),
								'', data.rejectRemarks]];
				arrayData = new Ext.data.ArrayStore({
							fields : ['label', 'makerVal', 'checkerVal']
						});
				arrayData.loadData(historyData);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('HistoryPopUpTitle', 'Error'),
							msg : getLabel('HistoryErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
