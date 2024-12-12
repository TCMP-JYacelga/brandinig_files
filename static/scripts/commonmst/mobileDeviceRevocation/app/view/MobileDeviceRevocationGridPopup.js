/**
 * @class GCP.controller.MobileDeviceRevocation
 * @extends Ext.window.Window
 * @author Gaurav Kabra
 */
 
Ext.define('GCP.view.MobileDeviceRevocationGridPopup', {
	extend : 'Ext.window.Window',
	xtype : 'mobileDeviceRevocationGridPopup',
	width : 735,
	itemId : 'mobDeviceRevocationGridPopupId',
	maxHeight : 550,
	layout : 'fit',
	resizable : false,
	cls:'xn-popup',
	draggable : false,
	modal : true,
	data : [],
	initComponent : function() {
		var me = this;
		var gridView = me.createGridView();
		me.items = gridView;
		me.addListener('show', function(popup, eOpts) {
			popup.center();
		});
		me.bbar = [{
			xtype : 'button',
			cls : 'ft-button-light',
			text : getLabel('cancel', 'Cancel'),
			handler : function() {
				me.close();
			}
		}, '->',{
			xtype : 'button',
			cls : 'ft-button-primary',
			text : getLabel('revoke', 'Revoke'),
			handler : function(button) {
				var popupWindow = button.up('window[itemId="mobDeviceRevocationGridPopupId"]');
				var grid = popupWindow.down('grid[itemId="mobileDeviceRevocationPopupGrid"]');
				var mapUids = '';
				grid.getStore().data.items.forEach(function(record, index, records) {
					if(index > 0) {
						mapUids = mapUids + ',';
					}
					mapUids = mapUids + record.data.mapUid;
				});
				
				GCP.getApplication().fireEvent('revokeDevices', mapUids);
				me.close();
			}
		}];
		me.callParent(arguments);
	},
	createGridView : function() {
		var me = this, gridView = null;
		gridView = Ext.create('Ext.grid.Panel', {
			scroll : true,
			forceFit : true,
			itemId : 'mobileDeviceRevocationPopupGrid',
			/*cls : 't7-grid',*/
			/*autoScroll : true,*/
			width : 735,
			store : me.getStore(),
			columns : me.getColumns()
		});
		return gridView;
	},
	getStore : function() {
		var me = this, dataStore = null;
		dataStore = Ext.create('Ext.data.Store', {
			fields : ['userName', 'userId', 'deviceId', 'deviceName', 'mapUid'],
			data : me.data
		});
		return dataStore;
	},
	getColumns : function() {
		var me = this;
		var columns = [{
			text: getLabel('userName', 'User Name'),
			width : 170,
			dataIndex: 'userName',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer : me.columnRenderer
		}, {
			text: getLabel('loginId', 'Login ID'),
			width : 170,
			dataIndex: 'userId',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer : me.columnRenderer
		}, {
			text: getLabel('deviceId', 'Device ID'),
			width : 170,
			dataIndex: 'deviceId',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer : me.columnRenderer
		}, {
			text : getLabel('deviceName', 'Device Name'),
			width: 370,
			dataIndex : 'deviceName',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer : me.columnRenderer
		}];
		return columns;
	},	
	columnRenderer : function(value, metaData) {
		if(!Ext.isEmpty(value)) {
			metaData.tdAttr = 'title="' + value + '"';
		}
		return value;
	}
});