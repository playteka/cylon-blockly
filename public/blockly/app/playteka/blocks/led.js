// the led block
Blockly.Blocks['led_device'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(120);
    this.appendValueInput("pin")
    .setCheck("Number")
    .appendField("Led: name")
    .appendField(new Blockly.FieldTextInput("led"), "led_var")
    .appendField("pin");
    this.setInputsInline(true);
    this.setOutput(true, "device_type");
    this.setTooltip('');
}
};

Blockly.JavaScript['led_device'] = function(block) {
    var value_pin = Blockly.JavaScript.valueToCode(block, 'pin', Blockly.JavaScript.ORDER_ATOMIC);
    var text_led_var = block.getFieldValue('led_var');
    
    //push the led variable into the led_var_set for the dropdown menu o
    all_devices.led.push(text_led_var);
    var inside_name = all_devices.create_inside_name(text_led_var);
    all_devices.led_dropdown.push([text_led_var,inside_name]);
    
    //Assemble a string like "led1: { driver: 'led', pin: 13,", in upper level connection block, a string like "connection:arduino}" will be appended
    var code = inside_name + ": { driver: 'led', pin: " + value_pin +",";
    
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};



// led turn On method
Blockly.Blocks['led_turnOn_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Led:")
    .appendField(new Blockly.FieldDropdown(all_devices.led_dropdown), "led_var")
    .appendField("turn on");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};


Blockly.JavaScript['led_turnOn_method'] = function(block) {
    var variable_led_var = block.getFieldValue('led_var');
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + variable_led_var + ".turnOn(); \n" ;
    return code;      // do not return [code, Blockly.JavaScript.ORDER_ATOMIC]
};


// led turn Off method
Blockly.Blocks['led_turnOff_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Led:")
    .appendField(new Blockly.FieldDropdown(all_devices.led_dropdown), "led_var")
    .appendField("turn off");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};


Blockly.JavaScript['led_turnOff_method'] = function(block) {
    var variable_led_var = block.getFieldValue('led_var');
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + variable_led_var + ".turnOff(); \n" ;
    return code;      // do not return [code, Blockly.JavaScript.ORDER_ATOMIC]
};





// led toggle method
Blockly.Blocks['led_toggle_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Led:")
    .appendField(new Blockly.FieldDropdown(all_devices.led_dropdown), "led_var")
    .appendField("toggle");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};


Blockly.JavaScript['led_toggle_method'] = function(block) {
    var variable_led_var = block.getFieldValue('led_var');
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + variable_led_var + ".toggle();\n" ;
    return code;  // do not return [code, Blockly.JavaScript.ORDER_ATOMIC]
};

// Returns the current brightness of the LED
Blockly.Blocks['led_currentBrightness_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Led:")
    .appendField(new Blockly.FieldDropdown(all_devices.led_dropdown), "var")
    .appendField("brightness");
    this.setOutput(true, "Number");
    this.setTooltip('');
}
};

Blockly.JavaScript['led_currentBrightness_method'] = function(block) {
    var variable_led_var = block.getFieldValue('var');
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + variable_led_var + ".currentBrightness()" ;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

// Sets brightness of the LED to the specified value  to (0-255) using PWM
Blockly.Blocks['led_setBrightness_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Led:")
    .appendField(new Blockly.FieldDropdown(all_devices.led_dropdown), "var");
    this.appendValueInput("brightness")
    .appendField("set brightness");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
}
};

Blockly.JavaScript['led_setBrightness_method'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    var value_brightness = Blockly.JavaScript.valueToCode(block, 'brightness', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + dropdown_var + ".brightness(" + value_brightness + "); \n" ;
    return code;
};


// led isOn block to check whether or not the led is on
Blockly.Blocks['led_isOn_method'] = {
init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(230);
    this.appendDummyInput()
    .appendField("Led:")
    .appendField(new Blockly.FieldDropdown(all_devices.led_dropdown), "var")
    .appendField("is on");
    this.setOutput(true, "Boolean");
    this.setTooltip('');
}
};

Blockly.JavaScript['led_isOn_method'] = function(block) {
    var dropdown_var = block.getFieldValue('var');
    // TODO: Assemble JavaScript into code variable.
    var code = "my." + dropdown_var + ".isOn()" ;
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};
