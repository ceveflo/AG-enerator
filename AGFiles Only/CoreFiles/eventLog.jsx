function writeLog(fileFolder, name){
        
        this.file  = File(fileFolder+ "/Eventlog_"+name+".txt");

        var file = this.file;                
        
        this.createEvent = function(event){
            var time = new Date();

            var seconds = time.getSeconds();
            var minutes = time.getMinutes();
            var hour = time.getHours();
            var eventString = "["+(time.getYear() + 1900)+"/"+(time.getMonth() + 1)+"/"+time.getDay()+" "+hour+":"+minutes+":"+seconds+"]: " + event;
                        
            var prevdata = "";
            
            
            if(file.exists){
                file.encoding = "UTF8";
                file.open("e", "TEXT", "????");
                prevdata = file.read();
                file.close();
                //
            }
        
            file.encoding = "UTF8";
            file.open("e", "TEXT", "????");
            file.writeln(prevdata + eventString);
            file.close();
        }
    
        this.removeLog = function(){
            if(file.exists){
               file.remove();  
                file.encoding = "UTF8";
                file.open("e", "TEXT", "????");
                file.write("");
                file.close();
            }
        }

}