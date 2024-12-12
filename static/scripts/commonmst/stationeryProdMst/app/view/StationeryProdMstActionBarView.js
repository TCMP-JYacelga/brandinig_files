/**
 * @class GCP.view.StationeryProdMstActionBarView
 * @extends Ext.toolbar.Toolbar
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryProdMstActionBarView',{
    extend : 'Ext.toolbar.Toolbar',
    xtype : 'stationeryProdMstActionBarView',
    enableOverflow : true,
    border : false,
    componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
    initComponent : function() {
        var me = this;
        me.items = [{
            text : getLabel('stnProdMstActionSubmit', 'Submit'),
            disabled : true,
            actionName : 'submit',
            maskPosition : 5,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        },'-', {
            text : getLabel('stnProdMstActionApprove', 'Approve'),
            disabled : true,
            actionName : 'accept',
            maskPosition : 6,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('stnProdMstActionReject', 'Reject'),
            disabled : true,
            actionName : 'reject',
            maskPosition : 7,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('stnProdMstActionEnable', 'Enable'),
            disabled : true,
            actionName : 'enable',
            maskPosition : 8,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('stnProdMstActionSuspend', 'Suspend'),
            disabled : true,
            actionName : 'disable',
            maskPosition : 9,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('stnProdMstActionDiscard', 'Discard'),
            disabled : true,
            actionName : 'discard',
            maskPosition : 10,
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