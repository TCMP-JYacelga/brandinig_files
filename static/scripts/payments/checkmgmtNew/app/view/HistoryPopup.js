/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup',{
	extend : 'Ext.window.Window',
	historyUrl : null,
	identifier : null,
	requires : ['Ext.grid.column.Action','Ext.grid.column.Date'],
	/**
     * @cfg {number} width
     * width of component in pixels.
     */
	width : 800,
	maxWidth : 835,
	/**
     * @cfg {number} height
     * width of component in pixels.
     */
	//height : 300,
	minHeight : 156,
	maxHeight : 550,
	resizable : false,
	draggable : false,
	/**
	 * @cfg {String} layout
	 * In order for child items to be correctly sized and positioned, typically a layout manager must be specified through 
	 * the layout configuration option.
	 * layout may be specified as either as an Object or as a String:
	 */
	layout : 'fit',
	/**
	 * @cfg {boolean} modal
	 * True to make the window modal and mask everything behind it when displayed, false to display it without restricting access to other UI elements.
	 * Defaults to: false
	 */
	modal : true,
	cls:'xn-popup',
	listeners : {
		resize : function(){
			this.center();
		}
	},	
	
	
	
	initComponent : function (){
		var thisClass = this;
		if(Ext.isEmpty(this.historyUrl)){
			Ext.apply(this,{
				title: getLabel('lblerror','Error'),
				html : getLabel('lblnourl','Sorry no URl provided for History')
			});
		}else {
			var arrayData = thisClass.loadHistoryData(this.historyUrl, this.identifier);
			this.title =  getLabel('lblchkmgmthist','Check Management History');
			this.items = [{
				xtype : 'grid',
				cls : 't7-grid',
				scroll : 'vertical',				
				forceFit : true,
				store : arrayData,
				columns : [{
					xtype : 'rownumberer',
					text: "Seq. No.",
					width : 75,
					resizable : false,
					sortable : false,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
	                    meta.tdAttr = 'title="' + (rowIndex+1) + '"';
	                    return (rowIndex+1);
					}
				},{
					dataIndex : 'userCode',
					text : getLabel('instrumentsHistoryColumnUserId','User'),
					width : 125,
					menuDisabled : true,
					sortable : false,
					draggable : false,
					resizable: false,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
	                    meta.tdAttr = 'title="' + val + '"';
	                    return val;
					}
				}, {
					dataIndex : 'responseDate',
					text : getLabel('instrumentsHistoryColumnDateTime','Date Time'),
					width : 200,
					menuDisabled : true,
					sortable : false,
					draggable : false,
					resizable: false,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
	                    meta.tdAttr = 'title="' + val + '"';
	                    return val;
					}
				},{
					dataIndex : 'remarks',
					text : getLabel('instrumentsHistoryColumnRejectRemark','Reject Remark'),
					width : 180,
					menuDisabled : true,
					sortable : false,
					draggable : false,
					resizable: false,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
	                    	meta.tdAttr = 'title="' + val + '"';
	                    return val;
	            }
				},{
					dataIndex : 'requestState',
					text : getLabel('instrumentsHistoryColumnStatus','Status'),
					width : 220,
					menuDisabled : true,
					sortable : false,
					draggable : false,
					resizable: false,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
	                    meta.tdAttr = 'title="' + val + '"';
	                    return val;
	            }
				}]
			}];
		this.bbar = [{
				xtype : 'button',
				id : 'btnChkMgmtHistoryPopupClose',
				tabIndex : '1',
				cls : 'ft-button ft-button-light',
				text : getLabel( 'btnCancel', 'Cancel' ),
				handler : function()
				{
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
				data = data.d.requestHistory;
				arrayData = new Ext.data.ArrayStore({
								fields : ['version', "recordKeyNo", "userCode","responseDate", "requestState", 'remarks','__metadata']
								});
				if(!Ext.isEmpty(data))
				{
					arrayData.loadData(data);
				}
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel('lblerror', 'Error'),
							msg : getLabel('lblerrordata','Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
		return arrayData;
	}
});
