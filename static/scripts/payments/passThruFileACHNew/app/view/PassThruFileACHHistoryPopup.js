/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.PassThruFileACHHistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	fileName : null,
	identifier : null ,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 600,
	maxWidth : 735,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
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
	resizable : false,
	draggable : false,
	cls:'xn-popup',
	config : {
		historyData : []
	},
	listeners : {
		resize : function(){
			this.center();
		}
	},

	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('MstHistoryPopUpErrorTitle',
								'Error'),
						html : getLabel('MstHistoryPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,this.identifier);
			this.title = getLabel('passThruTitle', 'ACH PassThru File History');

			this.items = [{
				xtype : 'grid',
				maxHeight : 350,
				scroll : 'vertical',
				cls : 't7-grid',
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns : [{
							dataIndex : 'label',
							sortable : false,
							menuDisabled : true,
							text : getLabel('MstDescription', 'Description'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}, {
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('MstMaker', 'Maker'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('MstChecker', 'Checker'),
							renderer: function(val, meta, rec, rowIndex, colIndex, store) {
			                    meta.tdAttr = 'title="' + val + '"';
			                    return val;
							}
						}]					
			}];

			/*this.bbar = [{
						text : getLabel('btnClose', 'Close'),//getLabel('btnOk', 'Close'),
						handler : function() {
							thisClass.close();
						}
					}];*/

			this.bbar =
				[
					{
						xtype : 'button',
						id : 'btnAchPassThruHistoryPopupClose',
						tabIndex : '1',
						cls : 'ft-button ft-button-light',
						text : getLabel( 'btnOk1', 'Close' ),
						handler : function()
						{
							thisClass.close();
						}
					}
				];
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
				data = data.d.passThruFileACH;
				var makerStamp, checkerStamp, checkerId, makerRequestState, checkerRequestState,time;
				if (!Ext.isEmpty(data[0].makerStamp)) {
					makerStamp = data[0].makerStamp;
					//time = makerStamp.toLocaleTimeString();
					//makerStamp = Ext.Date.format(makerStamp,strExtApplicationDateFormat);	
					makerStamp = makerStamp;
				}
				if (!Ext.isEmpty(data[0].checkerId)) {
					checkerId = data[0].checkerId;
					checkerRequestState = data[0].requestStateDesc;
					makerRequestState = data[0].lastRequestStateDesc;					
				}
				else
				{
					makerRequestState = data[0].requestStateDesc;
				}
				if (!Ext.isEmpty(data[0].checkerStamp))
				{
					checkerStamp = data[0].checkerStamp;
					//time = checkerStamp.toLocaleTimeString();
					//checkerStamp = Ext.Date.format(checkerStamp,strExtApplicationDateFormat);
					checkerStamp=checkerStamp;
				}

				var historyData = [
						[
								getLabel('MstHistoryPopUpDescription',
										'User'), data[0].makerId, checkerId],
						[getLabel('MstHistoryPopUpdateDate', 'Date Time'),
						 		makerStamp,checkerStamp],
						[getLabel('MstHistoryPopUpdateAction', 'Action'),
						 		makerRequestState, checkerRequestState],
						[getLabel('MstHistoryPopUpdateRemark', 'Remark'),
								'', data[0].rejectRemarks]];
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
							cls : 'ux_popup',
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
