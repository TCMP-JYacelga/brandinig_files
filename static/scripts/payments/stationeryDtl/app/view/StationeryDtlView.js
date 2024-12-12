/**
 * @class GCP.view.StationeryIndConfirmView
 * @extends Ext.container.Container
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryDtlView',
{
    extend : 'Ext.container.Container',
    xtype : 'stationeryDtlView',
    requires : [ 'Ext.container.Container',
            'GCP.view.StationeryDtlGridView' ],
    width : '100%',
    autoHeight : true,
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'stationeryDtlGridView',
            width : '100%'
        }];
        me.on('resize', function() {
            me.doLayout();
        });
        me.callParent(arguments);
    }
});
