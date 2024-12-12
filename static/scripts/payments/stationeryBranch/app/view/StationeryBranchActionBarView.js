/**
 * @class GCP.view.StationeryBranchActionBarView
 * @extends Ext.toolbar.Toolbar
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryBranchActionBarView',{
    extend : 'Ext.toolbar.Toolbar',
    xtype : 'stationeryBranchActionBarView',
    enableOverflow : true,
    border : false,
    componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
    initComponent : function() {
        var me = this;
        me.items = [{
            text : getLabel('stnBranchActionApprove', 'Approve'),
            disabled : true,
            actionName : 'accept',
            maskPosition : 3,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('stnBranchActionReject', 'Reject'),
            disabled : true,
            actionName : 'reject',
            maskPosition : 4,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('stnBranchActionDiscard', 'Discard'),
            disabled : true,
            actionName : 'discard',
            maskPosition : 5,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('stnBranchActionReceive', 'Receive'),
            disabled : true,
            actionName : 'receive',
            maskPosition : 6,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }];
        me.callParent();
    },
    listeners : {
        resize : function(toolbar, width, height, oldWidth, oldHeight, eOpts){
            var tbarId = toolbar.id;
            var button = Ext.select('a[id="' + tbarId + '-menu-trigger-btnEl"]');
            var imgSpan = Ext.select('span[id="' + tbarId + '-menu-trigger-btnIconEl"]');
            var txtSpan = Ext.select('span[id="' + tbarId + '-menu-trigger-btnInnerEl"]');
            if (button) {
                if (imgSpan)
                    imgSpan.remove();
                if (txtSpan)
                    txtSpan.remove();
                button.setHTML(getLabel('moreMenuTitle', 'more'));
                button.addCls('xn-trigger-cls');
            }
        }
    }
});