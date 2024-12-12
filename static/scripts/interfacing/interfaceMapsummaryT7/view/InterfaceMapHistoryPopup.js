/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.InterfaceMapHistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	invoiceNumber : null,
	identifier : null ,
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
	resizable : false,
	draggable : false,
	config : {
		historyData : []
	},
	cls:'xn-popup',
	listeners : {
		resize : function(){
			this.center();
		}
	},
	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
						title : getLabel('historyPopUpErrorTitle',
								'Error'),
						html : getLabel('historyPopUpNoUrlError',
								'Sorry no URl provided for History')
					});
		} else {

			var arrayData = thisClass.loadHistoryData(this.historyUrl,this.identifier);
			this.title = getLabel('interfaceHistory', 'Interface History');

			this.items = [{

				xtype : 'panel',
				width : '100%',
				cls:'ft-padding-bottom',
				layout : 'hbox',
				items : [{
							xtype : 'label',
						
							text : getLabel('interfaceCode', 'Interface Code')
									+ " :"
						}, {
							xtype : 'label',
							cls : 'label-font-normal ft-margin-very-small-l',
							text : this.interfaceCode,//this.interfaceName,
							width : '150'
						}]
			}, {
				xtype : 'grid',
				cls:'t7-grid',
				scroll : 'vertical',
				maxHeight : 300,
				forceFit : true,
				store : arrayData,
				defaultSortable : false,
				columns : [{
							dataIndex : 'label',
							sortable : false,
							menuDisabled : true,
							text : getLabel('description', 'Description'),
							width : 150
						}, {
							dataIndex : 'makerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('maker', 'Maker'),
							width : 190
						}, {
							dataIndex : 'checkerVal',
							sortable : false,
							menuDisabled : true,
							text : getLabel('checker', 'Checker'),
							width : 190
						}]
			}];

			this.bbar = ['->',{
						text : getLabel('close', 'Close'),//getLabel('btnOk', 'Ok'),
						handler : function() {
							thisClass.close();
						}
					}];
		}

		this.callParent(arguments);
	},

	loadHistoryData : function(historyUrl,identifier) {
		var me = this;
		var arrayData = new Array();
		Ext.Ajax.request({
			//url : historyUrl,			
			url : 'services/common/history.json' + '?&' + '$histSeekPageId=history.seek.interfaceCenter',
			method : 'POST',
			jsonData : Ext.encode(identifier),
			async : false,
			success : function(response) {
				var data = Ext.decode(response.responseText);
				data = data.d.history[0];
				var checkerStamp, checkerId, makerRequestState, checkerRequestState;
				if( ( data.requestState != 0 && data.requestState != 1 && data.requestState != 4 && data.requestState != 5 ) )
				{
					checkerId = data.checkerId;
					checkerRequestState = data.requestStateDesc;
					makerRequestState = data.lastRequestStateDesc;
					checkerStamp = data.checkerStamp;
				}
				else
				{
					makerRequestState = data.requestStateDesc;
				}
				
			    var setRejectRemarks = "";
                if (!Ext.isEmpty(checkerRequestState)
                        && checkerRequestState
                                .indexOf("Reject") > -1) {
                    setRejectRemarks = data.rejectRemarks;
                }
				var historyData = [
						[getLabel('prfMstHistoryPopUpDescription',
										'Description'), data.makerId, checkerId],
						[getLabel('prfMstHistoryPopUpdateDate', 'Date Time'),
						 				data.makerStamp, checkerStamp],
						[getLabel('prfMstHistoryPopUpdateAction', 'Action'),
										makerRequestState, checkerRequestState],
						[getLabel('prfMstHistoryPopUpdateRemark', 'Remark'),
										'', setRejectRemarks]];
				arrayData = new Ext.data.ArrayStore({
							fields : ['label', 'makerVal', 'checkerVal']
						});
				arrayData.loadData(historyData);			
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('historyPopUpErrorTitle', 'Error'),
							msg : getLabel('historyErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
