/**
 * jQuery Editable Combo Box UI Widget
 * 
 * http://jqueryui.com/autocomplete/#combobox
 * 
 * This is a customized editable combobox widget.
 * 
 * Depends: - jQuery 1.4.2+ - jQuery UI 1.8 widget factory
 * 
 * @author Vinay Thube
 */
(function($) {
	$.widget("custom.editablecombobox", {
		options : {
			emptyText : 'Select',
			dependantFieldId : '',
			maxLength : '',
			cssClass : '',
			title : '',
			width : '',
			tabIndex : 1,
			style : '',
			adhocValueAllowed : false,
			adhocEnteredValue : ''
		},
		_create : function() {
			this.wrapper = $("<span>").addClass("custom-combobox")
					.insertAfter(this.element);
			this.element.hide();
			this._createAutocomplete();
		},

		_createAutocomplete : function() {
			var selected = this.element.children(":selected"), value = selected
					.val() ? selected.text() : "";
			var jqMe = this;
			this.input = $("<input>")
					.appendTo(this.wrapper)
					.val(value)
					.attr({
								"tabIndex" : jqMe.options.tabIndex,
								"id" : jqMe.element.attr('id') + '_jq'
							})
					.addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left jq-editable-combo ")
					.autocomplete({
								delay : 0,
								minLength : 0,
								source : $.proxy(this, "_source")
							}).on('mouseup', function() {
								$(this).select();
							});
			if (!isEmpty(this.element.attr('disabled'))
					&& (this.element.attr('disabled') === 'disabled' || this.element
							.attr('disabled') == true))
				this.input.attr('readonly', 'readonly');
			if (jqMe.options.cssClass)
				this.input.addClass(jqMe.options.cssClass);
			if (!isEmpty(jqMe.options.maxLength))
				this.input.attr('maxLength', jqMe.options.maxLength);
			if (!isEmpty(jqMe.options.title))
				this.input.attr('title', jqMe.options.title);
			if (!isEmpty(jqMe.options.width))
				this.input.attr('width', jqMe.options.width);
			if (!isEmpty(jqMe.options.emptyText))
				this.input.attr('placeHolder', jqMe.options.emptyText);
			if (!isEmpty(jqMe.options.style))
				this.input.attr('style', jqMe.options.style);

			this.input.autocomplete("widget")
					.addClass("jq-editable-combo-picker");

			$(this).blur();
			this.input.addClass(this.element.attr('class'));
			this.input.on('autocompleteselect', {
						inputCt : this.input
					}, function(event, ui) {
						ui.item.option.selected = true;
						event.data.inputCt.trigger("select", event, {
									item : ui.item.option
								});
						jqMe.element.trigger('change');
					});
			this.input.on('autocompletechange', function(event, ui) {
						jqMe._removeIfInvalid(event, ui);
					});
			this.input.on('click', function(event, ui) {
						if (jqMe.element.attr('readonly') === true
								|| jqMe.element.attr('readonly') === 'readonly')
							return false;
						jqMe.input.autocomplete("search", "");
					});
			this.input.on('blur', function(event, ui) {
						if (isEmpty(jqMe.input.val())) {
							jqMe.element.val('');
							jqMe.element.trigger('change');
						}
					});
			this.element.addClass('jq-editable-combo');
		},

		_source : function(request, response) {
			var matcher = new RegExp($.ui.autocomplete
							.escapeRegex(request.term), "i");
			var strValue2 = $('#' + this.options.dependantFieldId).val()
			response(this.element.children("option").map(function() {
				var text = $(this).text(), strValue1 = $(this).val();
				if (this.value && (!request.term || matcher.test(text))
						&& (strValue1 !== strValue2))
					return {
						label : text,
						value : text,
						option : this
					};
			}));
		},

		_removeIfInvalid : function(event, ui) {
			if (ui.item) {
				var selected = this.element;
				return;
			};
			var default_text = "";
			var value = this.input.val(), valueLowerCase = value.toLowerCase(), valid = false;
			this.element.children("option").each(function() {
						if ($(this).val() == "default") {
							default_text = $(this).text();
						};
						if ($(this).text().toLowerCase() === valueLowerCase) {
							this.selected = valid = true;
							return false;
						};
					});

			if (valid) {
				return;
			}
			if (this.options.adhocValueAllowed) {
				this.element.attr('editableValue',this.input.val());
				this.element.val('');
				this.element.find('option:selected').removeAttr("selected");
			} else {
				this.element.val('');
				this.element.attr('editableValue','');
				this.input.val(default_text);
				this.element.trigger('change');
			}
		},

		destroy : function() {
			$.Widget.prototype.destroy.call(this);
			this.wrapper.remove();
			this.element.removeClass('jq-editable-combo');
			this.element.show();
			return this;
		},

		refresh : function() {
			var selected = this.element.children(":selected");
			var default_text = this.options.emptyText;
			if (!isEmpty(this.element.attr('disabled'))
					&& (this.element.attr('disabled') == 'disabled' || this.element
							.attr('disabled') == true))
				this.input.attr('readonly', true);
			else
				this.input.attr('readonly', false);
			if(this.options.adhocValueAllowed && selected && (isEmpty(selected.text()) || 'Select'===selected.text()))
				this.input.val(this.options.adhocEnteredValue);
			else if (!isEmpty(selected.val()))
				this.input.val(selected.text());
			else
				this.input.val(default_text);
		}
	});
})(jQuery);