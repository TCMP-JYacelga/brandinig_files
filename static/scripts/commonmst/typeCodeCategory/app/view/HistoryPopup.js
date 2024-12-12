/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	productDesc : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 550,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	maxWidth : 735,
	// height : 300,
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
	cls : 'non-xn-popup',
	config : {
		historyData : []
	},

	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('bankHistoryPopUpErrorTitle', 'Error'),
						html : getLabel('bankHistoryPopUpErrorMsg',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,
					this.identifier);
			this.title = getLabel('tpcmstHistoryTitle',
					'Type Code Category History');

			this.items = [{

				xtype : 'panel',
				width : '100%',
				cls : 'ft-padding-bottom',
				layout : 'hbox',
				items : [{
					xtype : 'label',
					cls : 'ux_font-size14 label-color',
					html : getLabel('tpcmstTypeCodeCategoryID', 'Type Code Category')
							+ " :" + "&nbsp;",
					width : '100'
				}, {
					xtype : 'label',
					style : {
						fontWeight : 'normal !important'
					},
					cls : 'ux_font-size14 label-font-normal',
					text : thisClass.productDesc,
					padding : '0 0 0 0',
					width : '150'
				}]
			}, {
				xtype : 'grid',
				cls : 'x-grid-padding-top',
				autoScroll : true,
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns : [{
							dataIndex : 'profile_Name',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfDesc', 'Description')
						}, {
							dataIndex : 'maker_id',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstMaker', 'Maker'),
							renderer : function(val, meta, rec, rowIndex,
									colIndex, store) {
								if (val.length > 33)
									meta.tdAttr = 'title="' + val + '"';
								return val;
							}
						}, {
							dataIndex : 'checker_id',
							sortable : false,
							menuDisabled : true,
							text : getLabel('prfMstChecker', 'Checker'),
							renderer : function(val, meta, rec, rowIndex,
									colIndex, store) {
								if (val.length > 33)
									meta.tdAttr = 'title="' + val + '"';
								return val;
							}
						}]
			}];

			this.bbar = ['->', {
						text : getLabel('btnClose', 'Close'),
						handler : function() {
							thisClass.close();
						}
					}];
		}

		this.callParent();
	},

	loadHistoryData : function(historyUrl, id) {
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request({
			// url : historyUrl,
			url : 'services/common/history.json' + '?&'
					+ '$histSeekPageId=history.seek.typeCodeCat',
			method : 'POST',
			jsonData : Ext.encode(id),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				data = data.d.history[0];
				var checkerStamp, checkerId, makerRequestState, checkerRequestState;
				if ((data.requestState != 0 && data.requestState != 1
						&& data.requestState != 4 && data.requestState != 5)) {
					checkerId = data.checkerId;
					checkerRequestState = data.requestStateDesc;
					makerRequestState = data.lastRequestStateDesc;
					checkerStamp = data.checkerStamp;
				} else {
					makerRequestState = data.requestStateDesc;
				}

				var historyData = [
						[
								getLabel('prfMstHistoryPopUpDescription',
										'Description'), data.makerId, checkerId],
						[getLabel('prfMstHistoryPopUpdateDate', 'Date Time'),
								data.makerStamp, checkerStamp],
						[getLabel('prfMstHistoryPopUpdateAction', 'Action'),
								makerRequestState, checkerRequestState],
						[getLabel('prfMstHistoryPopUpdateRemark', 'Remark'),
								'', data.rejectRemarks]];
				arrayData = new Ext.data.ArrayStore({
							fields : ['profile_Name', 'maker_id', 'checker_id',
									'reject_remarks']
						});
				arrayData.loadData(historyData);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('errorTitle', 'Error'),
							msg : getLabel('errorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
