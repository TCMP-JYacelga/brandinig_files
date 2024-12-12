(function($, window, document, undefined1) {
	'use strict';

	//===================
	// Render the widget.
	//===================

	function render(width) {
		var EXT_ELEMENT = Ext.getElementById('ft-create-role-read-only');

		// Set the dimensions.
		var ELEMENT_WIDTH = width;

		//=============
		// HTML: ROW 1.
		//=============

		var header1 = $('#_verifyRole_header1').html();
		header1 = $.trim(header1).replace(/\s+/g, ' ');

		var row1Column1 = $('#_verifyRole_row1Column1').html();
		row1Column1 = $.trim(row1Column1).replace(/\s+/g, ' ');

		var row1Column2 = $('#_verifyRole_row1Column2').html();
		row1Column2 = $.trim(row1Column2).replace(/\s+/g, ' ');

		var row1Column3 = $('#_verifyRole_row1Column3').html();
		row1Column3 = $.trim(row1Column3).replace(/\s+/g, ' ');

		//=============
		// HTML: ROW 2.
		//=============

		var header2 = $('#_verifyRole_header2').html();
		header2 = $.trim(header2).replace(/\s+/g, ' ');

		var row2Column1 = $('#_verifyRole_row2Column1').html();
		row2Column1 = $.trim(row2Column1).replace(/\s+/g, ' ');

		var row2Column2 = $('#_verifyRole_row2Column2').html();
		row2Column2 = $.trim(row2Column2).replace(/\s+/g, ' ');

		var row2Column3 = $('#_verifyRole_row2Column3').html();
		row2Column3 = $.trim(row2Column3).replace(/\s+/g, ' ');

		//=============
		// HTML: ROW 3.
		//=============

		var header3 = $('#_verifyRole_header3').html();
		header3 = $.trim(header3).replace(/\s+/g, ' ');

		var row3Column1 = $('#_verifyRole_row3Column1').html();
		row3Column1 = $.trim(row3Column1).replace(/\s+/g, ' ');

		var row3Column2 = $('#_verifyRole_row3Column2').html();
		row3Column2 = $.trim(row3Column2).replace(/\s+/g, ' ');

		var row3Column3 = $('#_verifyRole_row3Column3').html();
		row3Column3 = $.trim(row3Column3).replace(/\s+/g, ' ');

		var footer = $('#_verifyRole_footer').html();
		footer = $.trim(footer).replace(/\s+/g, ' ');

		//================
		// Build the view.
		//================

		Ext.create('Ext.panel.Panel', {
			header: false,
			id: 'ft-create-role-read-only-cmp',
			renderTo: EXT_ELEMENT,
			width: ELEMENT_WIDTH,
			layout: {
				type: 'vbox', // Arrange child items vertically
				align: 'stretch', // Each takes up full width
				padding: 0
			},
			items: [{
				xtype: 'container',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					flex: 6,
					height: 47,
					header: false,
					html: header1
				} ]
			}, {
				xtype: 'container',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					flex: 2,
					header: false,
					items: [{
						xtype: 'displayfield',
						value: row1Column1
					}]
				}, {
					xtype: 'panel',
					flex: 2,
					header: false,
					items: [{
						xtype: 'displayfield',
						value: row1Column2
					}]
				}, {
					xtype: 'panel',
					flex: 2,
					header: false,
					items: [{
						xtype: 'displayfield',
						value: row1Column3
					}]
				}]
			}, {
				xtype: 'container',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					flex: 6,
					height: 34,
					header: false,
					html: header2
				} ]
			}, {
				xtype: 'container',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					flex: 2,
					height: 190,
					header: false,
					items: [{
						xtype: 'displayfield',
						value: row2Column1
					}]
				}, {
					xtype: 'panel',
					flex: 2,
					height: 190,
					header: false,
					items: [{
						xtype: 'displayfield',
						value: row2Column2
					}]
				}, {
					xtype: 'panel',
					flex: 2,
					height: 190,
					header: false,
					items: [{
						xtype: 'displayfield',
						value: row2Column3
					}]
				}]
			}, {
				xtype: 'container',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					flex: 2,
					height: 34,
					header: false,
					html: header3
				} ]
			}, {
				xtype: 'container',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					flex: 2,
					height: 285,
					header: false,
					items: [{
						xtype: 'displayfield',
						value: row3Column1
					}]
				}, {
					xtype: 'panel',
					flex: 2,
					height: 285,
					header: false,
					items: [{
						xtype: 'displayfield',
						value: row3Column2
					}]
				}, {
					xtype: 'panel',
					flex: 2,
					height: 285,
					header: false,
					items: [{
						xtype: 'displayfield',
						value: row3Column3
					}]
				}]
			}, {
				xtype: 'container',
				layout: {
					align: 'stretch',
					type: 'hbox'
				},
				items: [{
					xtype: 'panel',
					flex: 6,
					height: 56,
					header: false,
					html: footer
				} ]
			}]
		});

	}

	//=====================
	// Rudimentary pub/sub.
	//=====================

	$(document).on('drawFluidWidgets', function(e, width) {
		render(width);
	});

	// Params: jQuery, window, document.
})(jQuery, this, this.document);