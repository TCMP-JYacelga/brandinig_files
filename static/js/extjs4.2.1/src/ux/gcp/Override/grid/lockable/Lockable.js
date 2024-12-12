/**
 * The method onLockedViewScroll is overridden here for smooth scrolling of grid
 */
/**
 * @class Ext.ux.gcp.Override.grid.lockable.Lockable
 * @override Ext.grid.locking.Lockable
 * @author Megha Garg
 */
Ext.define('Ext.ux.gcp.Override.grid.lockable.Lockable', {
			override : 'Ext.grid.locking.Lockable',
			 onLockedViewScroll: function() {
			        var me = this,
			            lockedView = me.lockedGrid.getView(),
			            normalView = me.normalGrid.getView(),
			            normalDom = normalView.el.dom,
			            lockedDom = lockedView.el.dom,
			            normalTable,
			            lockedTable;

			        // See onNormalViewScroll
			        if (normalDom.scrollTop !== lockedDom.scrollTop) {
			        	/** For smooth grid scrolling.
			        	 *  For grid with locked columns, while selecting bottom options 
			        	 *  to avoid the grid from scrolling up, the below line is commented.
			        	 * */
			            //normalDom.scrollTop = lockedDom.scrollTop;
			            // For buffered views, the absolute position is important as well as scrollTop
			            if (me.store.buffered) {
			                lockedTable = lockedView.el.child('table', true);
			                normalTable = normalView.el.child('table', true);
			                normalTable.style.position = 'absolute';
			                normalTable.style.top = lockedTable.style.top;
			            }
			        }
			    }

		});