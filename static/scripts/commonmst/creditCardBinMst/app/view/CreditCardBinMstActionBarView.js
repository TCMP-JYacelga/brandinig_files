/**
 * @class GCP.view.CreditCardBinMstActionBarView
 * @extends Ext.toolbar.Toolbar
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.CreditCardBinMstActionBarView',{
    extend : 'Ext.toolbar.Toolbar',
    xtype : 'creditCardBinMstActionBarView',
    enableOverflow : true,
    border : false,
    componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
    initComponent : function() {
        var me = this;
        me.items = [{
            text : getLabel('mstActionSubmit', 'Submit'),
            disabled : true,
            actionName : 'submit',
            maskPosition : 5,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        },'-', {
            text : getLabel('mstActionApprove', 'Approve'),
            disabled : true,
            actionName : 'accept',
            maskPosition : 6,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('mstActionReject', 'Reject'),
            disabled : true,
            actionName : 'reject',
            maskPosition : 7,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('mstActionEnable', 'Enable'),
            disabled : true,
            actionName : 'enable',
            maskPosition : 8,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('mstActionSuspend', 'Suspend'),
            disabled : true,
            actionName : 'disable',
            maskPosition : 9,
            handler : function(btn, opts) {
                me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
                me.fireEvent('performGroupAction', btn, opts);
            }
        }, '-',{
            text : getLabel('mstActionDiscard', 'Discard'),
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