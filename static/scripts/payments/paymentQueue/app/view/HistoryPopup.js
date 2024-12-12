/**
 * @class GCP.view.HistoryPopup
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 * @author Vinay Thube
 */
/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
	extend : 'Ext.window.Window',
	historyUrl : null,
	identifier : null,
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date',
			'Ext.grid.column.RowNumberer', 'Ext.grid.Panel',
			'Ext.layout.container.Fit', 'Ext.button.Button',
			'Ext.window.MessageBox'],
	/**
	 * @cfg {number} width width of component in pixels.
	 */
	width : 735,
	/**
	 * @cfg {number} height width of component in pixels.
	 */
	minHeight : 156,
	maxHeight : 550,
	resizable : false,
	draggable : false,
	/**
	 * @cfg {String} layout In order for child items to be correctly sized and
	 *      positioned, typically a layout manager must be specified through the
	 *      layout configuration option. layout may be specified as either as an
	 *      Object or as a String:
	 */
	layout : 'fit',
	/**
	 * @cfg {boolean} modal True to make the window modal and mask everything
	 *      behind it when displayed, false to display it without restricting
	 *      access to other UI elements. Defaults to: false
	 */
	modal : true,
	cls:'non-xn-popup',
	listeners : {
		'resize' : function(){
			this.center();
		}
	},

	initComponent : function() {
		var thisClass = this;
		if (Ext.isEmpty(this.historyUrl)) {
			Ext.apply(this, {
				title : getLabel('lblerror', 'Error'),
				html : getLabel('lblnourl', 'Sorry no URl provided for History')
			});
		} else {
			var arrayData = thisClass.loadHistoryData(this.historyUrl,
					this.identifier);
			this.title = getLabel('lblbankprocessqueue',
					'Bank Processing Queue History');
			this.items = [{
						xtype : 'grid',
						cls : 't7-grid',
						scroll : 'vertical',
						forceFit : true,
						store : arrayData,
						// autoHeight : true,
						columns : [{
									xtype : 'rownumberer',
									text : "#"
								}, {
									dataIndex : 'makerCode',
									text : getLabel('lblusername', 'User Name')
								}, {
									dataIndex : 'makerDate',
									text : getLabel('lbldatetime',
											'Date Time'),
									width : 135
								}, {
									dataIndex : 'rejectRemarks',
									text : getLabel('lblrejectremark',
											'Reject Remark'),
									renderer: function(val, meta, rec, rowIndex, colIndex, store) {
					                    if(val.length > 12)
					                    meta.tdAttr = 'title="' + val + '"';
					                    return val;
						            }
								}, {
									dataIndex : 'makerAction',
									text : getLabel('status', 'Status'),
									renderer: function(val, meta, rec, rowIndex, colIndex, store) {
					                    if(val.length > 12)
					                    meta.tdAttr = 'title="' + val + '"';
					                    return val;
						            }
								}, {
									dataIndex : 'oldValue',
									text : getLabel('lbloldvalue', 'Old Value')
								}, {
									dataIndex : 'newValue',
									text : getLabel('lblnewvalue', 'New Value')
								}]
					}];
					
			this.bbar = ['->',{
					text : getLabel('btnCancel', 'Cancel'),
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
					url : historyUrl,
					method : 'POST',
					jsonData : Ext.encode(id),
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						data = data.d.bankProcessingHistory;
						// Logic to change the date as per locale Start
						var mkrDate, time, oldVal, newVal, dateParts;
						if(data && data.length){
							Ext.each(data, function(obj){
								if (!Ext.isEmpty(obj.makerDate)) {
									mkrDate = new Date(obj.makerDate);
									time = mkrDate.toLocaleTimeString();
									mkrDate = Ext.Date.format(mkrDate,strExtApplicationDateFormat);
									obj.makerDate = mkrDate+' '+time;
								}
								if (!Ext.isEmpty(obj.oldValue)) {
								    dateParts = obj.oldValue.split("/");
									oldVal = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 																		
									oldVal = Ext.Date.format(oldVal,strExtApplicationDateFormat);
									obj.oldValue = oldVal;
								}
								if (!Ext.isEmpty(obj.newValue)) {
									dateParts = obj.newValue.split("/");
									newVal = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 									
									newVal = Ext.Date.format(newVal,strExtApplicationDateFormat);
									obj.newValue = newVal;
								}
							});
						}
						// Logic to change the date as per locale End
						arrayData = new Ext.data.ArrayStore({
									fields : ["makerCode", "makerDate",
												"makerAction", 'rejectRemarks',
													'oldValue', 'newValue',
														'__metadata']
								});
						
						if(data)
						  arrayData.loadData(data);

					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel('lblerror', 'Error'),
									msg : getLabel('lblerrordata',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
		return arrayData;
	}
});
