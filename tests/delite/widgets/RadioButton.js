define([
	"intern!bdd",
	"intern/chai!expect",
	"delite/register",
	"../../../wrapper",
	"../../../Observable",
	"../../../ObservablePath",
	"../../../delite/widgets/RadioButton",
	"../../waitFor",
	"requirejs-text/text!./templates/basicRadioButton.html",
	"../../../delite/WidgetBindingTarget",
	"../../sandbox/monitor"
], function (bdd, expect, register, wrapper, Observable, ObservablePath, RadioButton, waitFor, basicRadioButtonTemplate) {
	/* jshint withstmt: true */
	/* global describe, afterEach, it */
	with (bdd) {
		describe("Test liaison/delite/widgets/RadioButton", function () {
			var handles = [];
			afterEach(function () {
				for (var handle = null; (handle = handles.shift());) {
					handle.remove();
				}
			});
			it("Basic", function () {
				var observable = new Observable({current: "bar", bazValue: "baz"}),
					div = document.createElement("div"),
					template = div.appendChild(document.createElement("template"));
				this.timeout = 10000;
				template.innerHTML = basicRadioButtonTemplate;
				handles.push(template.bind("bind", observable));
				return waitFor(function () {
					var inputs = div.getElementsByTagName("input");
					return inputs.length === 3 && inputs[1].checked;
				}).then(function () {
					var inputs = div.getElementsByTagName("input");
					expect(inputs[0].checked).not.to.be.true;
					expect(inputs[2].checked).not.to.be.true;
					observable.set("current", "foo");
				}).then(waitFor.create(function () {
					return div.getElementsByTagName("input")[0].current === "foo";
				})).then(function () {
					var inputs = div.getElementsByTagName("input");
					expect(inputs[0].checked).to.be.true;
					expect(inputs[1].checked).not.to.be.true;
					expect(inputs[2].checked).not.to.be.true;
					inputs[2].checked = true;
					var event = document.createEvent("HTMLEvents");
					event.initEvent("change", false, true);
					inputs[2].dispatchEvent(event);
				}).then(waitFor.create(function () {
					return observable.current !== "foo";
				})).then(function () {
					expect(observable.current).to.equal("baz");
				});
			});
			it("Changing checked", function () {
				var observable = new Observable({current: "bar", bazValue: "baz"}),
					div = document.createElement("div"),
					template = div.appendChild(document.createElement("template"));
				this.timeout = 10000;
				template.innerHTML = basicRadioButtonTemplate;
				handles.push(template.bind("bind", observable));
				return waitFor(function () {
					var inputs = div.getElementsByTagName("input");
					return inputs.length === 3 && inputs[1].checked;
				}).then(function () {
					observable.set("bazChecked", true);
				}).then(waitFor.create(function () {
					return observable.current !== "bar";
				})).then(function () {
					expect(observable.current).to.equal("baz");
				});
			});
			it("Changing value", function () {
				var observable = new Observable({current: "baz", bazValue: "baz"}),
					div = document.createElement("div"),
					template = div.appendChild(document.createElement("template"));
				this.timeout = 10000;
				template.innerHTML = basicRadioButtonTemplate;
				handles.push(template.bind("bind", observable));
				return waitFor(function () {
					var inputs = div.getElementsByTagName("input");
					return inputs.length === 3 && inputs[2].checked;
				}).then(function () {
					observable.set("bazValue", "BAZ");
				}).then(waitFor.create(function () {
					return observable.current !== "baz";
				})).then(function () {
					expect(observable.current).to.equal("BAZ");
				});
			});
		});
	}
});
