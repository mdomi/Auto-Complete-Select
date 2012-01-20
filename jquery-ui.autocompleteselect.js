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
	$.widget('select.autocompleteselect', {
		options : {
			delay: 0,
			minLength: 0,
			attrPrefix: 'autocomplete_'
		}, // 27:29
		_create : function () {
			var self = this;
			this._selectedItem = {label: '', value: ''};
			this._changed = false;
			this._optionValues = this.element.find('option').map(function () {
				var $option = $(this);
				var optionObject = {
					label : $option.text(),
					value : $option.attr('value')
				};
				if($option.is(':selected')) {
					self._selectedItem = optionObject
				}
				return optionObject;
			});
			this.element.hide();
			this.textInput = $('<input type="text" />').val(this._selectedItem.label).autocomplete({
				delay: this.options.delay,
				minLength: this.options.minLength,
				source : function (request, response) {
					response($.ui.autocomplete.filter(self._optionValues, request.term));
				},
				select: function(event, ui) {
					if(ui.item.value != self._selectedItem.value) {
						self._changed = true;
					}
					self._selectedItem = ui.item;
				},
				close: function(event, ui) {
					self._selecting = false;
					self.textInput.val(self._selectedItem.label).trigger('blur');
				}
			}).on({
				focus: function() {
					self._selecting = true;
					self.textInput.val('').autocomplete('search');
				},
				blur: function(event) {
					if(event.isTrigger) {
						self.element.trigger('blur');
					}
					if(self._changed) {
						self._changed = false;
						self.textInput.trigger('change');
					}
				},
				// TODO: simplify change, not 100% consistent yet
				change: function(event) {
					self.element.val(self._selectedItem.value).change();
				}
			}).appendTo(this.element.parent())
			this.textInput.attr('name', this.options.attrPrefix + this.element.attr('name'));
			this.textInput.attr('id', this.options.attrPrefix + this.element.attr('id'));
		},
		_destroy: function() {
			this.textInput.remove();
			this.element.show();
		}
	});
})(jQuery);
