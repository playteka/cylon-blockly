
/**
 * Save blocks to local file.
 * better include Blob and FileSaver for browser compatibility
 */
function save() {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var data = Blockly.Xml.domToText(xml);
    
    var filename = prompt("Please enter your file name", "sketch1");
    if (filename != null) {
        filename += '.xml';
        // Store data in blob.
        var blob = new Blob([data], {type: "text/plain;charset=utf-16"});
        saveAs(blob, filename);
        onsole.log("saving blob " + filename);
    }
}

/**
 * Load blocks from local file.
 */
function upload() {
    var upLoadFiles = document.getElementById("uploadInput").files;
    // Only allow uploading one file.
    if (upLoadFiles.length != 1) {
        return;
    }
    
    // FileReader
    var reader = new FileReader();
    reader.onload = function(event) {
        var target = event.target;
        // 2 == FileReader.DONE
        if (target.readyState == 2) {
            try {
                var xml = Blockly.Xml.textToDom(target.result);
            } catch (e) {
                alert('Error parsing XML:\n' + e);
                return;
            }
            
            var count = Blockly.mainWorkspace.getAllBlocks().length;
            if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
                Blockly.mainWorkspace.clear();
            }
            
            //load XML into workspace
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
            //invoke myUpdateFunction() to generate the obj_set for object dropdown menu
            myUpdateFunction();
            //clear the workspace
            Blockly.mainWorkspace.clear();
            //load XML again so that even the Chinese characters of the dropdown menu will be shown properly
            Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
        }
        // Reset value of input after loading because Chrome will not fire
        // a 'change' event if the same file is loaded again.
        document.getElementById('uploadInput').value = '';
    };
    reader.readAsText(upLoadFiles[0]);
}


function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

var broker_socekt = null;
var isConnected = false;

function run(){
    
    //show the console tab
    tabClick('tab_console');
    
    if (isConnected != true) {
        
        broker_socekt = io.connect();
        
        broker_socekt.on('connect', function() {
                         isConnected = true;
                         document.getElementById('textarea_console').value += "connected!\n";
                         document.getElementById('textarea_console').scrollTop = document.getElementById('textarea_console').scrollHeight;
                         });
        
        // build event handlers to write the messages from worker and broker
        broker_socekt.on('worker_stdout', function (data) {
                         document.getElementById('textarea_console').value += data;
                         document.getElementById('textarea_console').scrollTop = document.getElementById('textarea_console').scrollHeight;
                         });
        
        broker_socekt.on('worker_stderr', function (data) {
                         document.getElementById('textarea_console').value += data;
                         document.getElementById('textarea_console').scrollTop = document.getElementById('textarea_console').scrollHeight;
                         });
        
        broker_socekt.on('worker_sysout', function (data) {
                         document.getElementById('textarea_console').value += data;
                         document.getElementById('textarea_console').scrollTop = document.getElementById('textarea_console').scrollHeight;
                         
                         });
        
        broker_socekt.on('disconnect', function() {
                         isConnected = false;
                         document.getElementById('textarea_console').value += "disconnected!\n";
                         document.getElementById('textarea_console').scrollTop = document.getElementById('textarea_console').scrollHeight;
                         });
        /*
        document.getElementById('textarea_console').addEventListener('change', function(){
                                                                     document.getElementById('textarea_console').scrollTop = document.getElementById('textarea_console').scrollHeight;
                                                                     });
         */
        
    }; //if (isConnected != true) { ...
    
    //send program to broker
    var code = document.getElementById('textarea_code').value;
    broker_socekt.emit('run', code);
    
    //enable stop button
    //document.getElementById('stopButton').disabled = false;
    
}

function stop(){
    //send the 'stop' message to broker
    if (broker_socekt != null) {
        broker_socekt.emit('stop','stop');
    };
    
    //disable stop button
    //document.getElementById('stopButton').disabled = true;
}

