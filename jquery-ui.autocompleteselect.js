/*
 * Copyright 2012 Michael Dominice
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function ($) {

	var KEY_CODE_ENTER = 13;
	
	$.widget('select.autocompleteselect', {
		options : {
			delay: 0,
			minLength: 0,
			attrPrefix: 'autocomplete_'
		},
		_create : function () {
			var self = this;
			var selectedItem = {label: '', value: ''};
			var changed = false;
			var selected = false;
			
			var optionValues = this.element.find('option').map(function () {
				var $option = $(this);
				var optionObject = {
					label : $option.text(),
					value : $option.attr('value')
				};
				if($option.is(':selected')) {
					selectedItem = optionObject
				}
				return optionObject;
			});
			
			this.element.hide();
			
			function setSelectedValue(selectedValue) {
				if(selectedValue.value != selectedItem.value) {
					changed = true;
				}
				selectedItem = selectedValue;
				selected = true;
			}
			
			function autocompleteclose() {
				if(selected) {
					self.textInput.val(selectedItem.label);
					self.element.val(selectedItem.value);
					self.textInput.trigger('blur');
					selected = false;
				}
			} 
			
			this.textInput = $('<input type="text" />').val(selectedItem.label).autocomplete({
				delay: this.options.delay,
				minLength: this.options.minLength,
				source : function (request, response) {
					response($.ui.autocomplete.filter(optionValues, request.term));
				},
				select: function(event, ui) {
					setSelectedValue(ui.item);
				},
				close: autocompleteclose
			}).on({
				keypress: function(event) {
					if(event.keyCode === KEY_CODE_ENTER) {
						var validSelection = false;
						$.each(optionValues, function(i, optionValue) {
							if(optionValue.label.toLowerCase() === self.textInput.val().toLowerCase()) {
								validSelection = true;
								setSelectedValue(optionValue);
								
							}
						});
						if(validSelection) {
							autocompleteclose();
						}
						return false;
					}
				},
				focus: function(event) {
					self.textInput.val('').autocomplete('search');
				},
				blur: function(event) {
					if(event.isTrigger) {
						self.element.trigger('blur');
					}
					if(changed) {
						changed = false;
						self.textInput.trigger('change');
					} else {
						self.textInput.val(selectedItem.label);
					}
				},
				change: function(event) {
					if(event.isTrigger) {
						self.element.trigger('change');
					}
				}
			}).appendTo(this.element.parent());
			
			this.textInput.attr('name', this.options.attrPrefix + this.element.attr('name'));
			this.textInput.attr('id', this.options.attrPrefix + this.element.attr('id'));
		},
		_destroy: function() {
			this.textInput.remove();
			this.element.show();
		}
	});
})(jQuery);
