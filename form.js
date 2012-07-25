var Form = function(){}

var form = new Form();

Form.prototype.addInlineInput = function (container, label, name, size) {
  this.addInput(container, label, name, $('<span>'), size);
}

Form.prototype.addNewlineInput = function (container, label, name, size) {
  this.addInput(container, label, name, $('<div>'), size);
}

Form.prototype.addInput = function (container, label, name, inputCont, size) {
  inputCont.html(label + ':');
  var inputText = $('<input type="text"/>');
  inputText.attr('name', name)
    .attr('size', size);
  inputText.css('margin', 3);
  inputCont.append(inputText);
  container.append(inputCont);
}

Form.prototype.addButton = function (container, clickHandler, label) {
  var inputCont = $('<div>');
  inputCont.css('marginTop', '10');
  var inputSubmit = $('<input type="submit"/>');
  inputSubmit.attr('value', label);
  inputCont.append(inputSubmit);
  inputSubmit.click(clickHandler);
  container.append(inputCont);
}
