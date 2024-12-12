/**
 * @class GCP.view.StationeryDtlGridView
 * @extends Ext.panel.Panel
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryDtlGridView', {
    extend : 'Ext.panel.Panel',
    requires : ['Ext.ux.gcp.SmartGrid','Ext.panel.Panel'],
    xtype : 'stationeryDtlGridView',
    width : '100%',
    cls: 'ux_extralargemargin-top',
    initComponent : function() {
        var me = this;
        this.items = [{
            xtype : 'panel',
            width : '100%',
            collapsible : true, 
            title : (viewType == 'VIEW_BRANCH') ? getLabel('receivedList', 'Received List') : getLabel('dispatchList', 'Dispatch List'),
            autoHeight : true,
            cls : 'xn-ribbon ux_panel-transparent-background',
            itemId : 'gridDtlView',
            items : [{
                xtype : 'container',
                layout : 'hbox',
                cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
                items : [{
                    xtype : 'label',
                    text : '',
                    flex : 1
                }]
            }]
        }];
        this.callParent(arguments);
    }
});
